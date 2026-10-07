const fs = require('node:fs');
const cheerio = require('cheerio');
const {siteUrl, guides, hubs, cleanPath, indexable, guidesFor} = require('./site-data');

const files = ['index.html', 'affiliate-disclosure.html', ...hubs.map(hub => hub.file), ...guides.map(guide => guide.reviewUrl)];
const errors = [];
const titles = new Set();
const descriptions = new Set();
const cached = new Map();
const redirects = new Map(JSON.parse(fs.readFileSync('vercel.json', 'utf8')).redirects.map(redirect => [redirect.source, redirect.destination]));
function load(file) {
  if (!cached.has(file)) cached.set(file, cheerio.load(fs.readFileSync(file, 'utf8')));
  return cached.get(file);
}
function check(condition, file, message) { if (!condition) errors.push(`${file}: ${message}`); }
function resolveFile(url) {
  const name = decodeURIComponent(url.pathname).slice(1);
  if (!name) return 'index.html';
  if (fs.existsSync(name) && fs.statSync(name).isFile()) return name;
  if (fs.existsSync(`${name}.html`)) return `${name}.html`;
  return null;
}

for (const file of files) {
  const $ = load(file);
  const expected = siteUrl + cleanPath(file);
  check(indexable(file), file, 'Public page is noindex');
  check($('link[rel="canonical"]').length === 1 && $('link[rel="canonical"]').attr('href') === expected, file, 'Canonical must match the clean URL');
  check($('h1').length === 1 && $('h1').text().trim(), file, 'Exactly one non-empty H1 is required');
  check(Boolean($('html').attr('lang')), file, 'Missing page language');
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content');
  check(title && !titles.has(title), file, 'Missing or duplicate title');
  check(description && !descriptions.has(description), file, 'Missing or duplicate description');
  titles.add(title); descriptions.add(description);
  if (file !== 'affiliate-disclosure.html') {
    check($('meta[property="og:url"]').attr('content') === expected, file, 'Open Graph URL must match canonical');
    for (const name of ['og:title', 'og:description', 'og:image']) check(Boolean($(`meta[property="${name}"]`).attr('content')), file, `Missing ${name}`);
    check($('script[type="application/ld+json"]').length > 0, file, 'Missing structured data');
  }
  $('script[type="application/ld+json"]').each((i, element) => {
    try {
      const schema = JSON.parse($(element).text());
      for (const entity of schema['@graph'] || [schema]) {
        check(!['Review', 'Product', 'AggregateRating'].includes(entity['@type']), file, 'Unsubstantiated review markup');
        if (entity['@type'] === 'Article') {
          check(entity.headline === $('h1').text(), file, 'Article headline differs from visible H1');
          check(entity.mainEntityOfPage === expected, file, 'Article URL differs from canonical');
          check(entity.inLanguage === $('html').attr('lang'), file, 'Article language differs from HTML');
          check($('a[href="/affiliate-disclosure"]').text().includes(entity.author.name), file, 'Author is not visibly credited');
        }
        if (entity['@type'] === 'BreadcrumbList') {
          const links = $('.breadcrumb a, .directory-breadcrumb a').map((i, link) => new URL($(link).attr('href'), expected).href).get();
          const items = entity.itemListElement;
          check(items.slice(0, -1).every(item => links.includes(item.item)) && items.at(-1).item === expected, file, 'Breadcrumb schema does not match visible navigation');
        }
      }
    } catch (error) { errors.push(`${file}: Invalid JSON-LD: ${error.message}`); }
  });

  $('a[href], img[src], script[src], link[rel="stylesheet"], meta[property="og:image"]').each((i, element) => {
    const tag = $(element);
    const value = tag.attr('href') || tag.attr('src') || tag.attr('content');
    if (!value || /^(?:mailto:|tel:|data:)/i.test(value)) return;
    let url;
    try { url = new URL(value, expected); } catch { errors.push(`${file}: Invalid URL ${value}`); return; }
    if (url.origin !== siteUrl) {
      if (element.name === 'a' && tag.attr('target') === '_blank') check(/noopener/.test(tag.attr('rel') || ''), file, `Missing noopener: ${value}`);
      return;
    }
    const target = resolveFile(url);
    check(Boolean(target), file, `Missing internal file: ${value}`);
    if (element.name === 'a') {
      check(!url.pathname.endsWith('.html'), file, `Internal link uses a redirecting .html URL: ${value}`);
      if (target && url.hash) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        check(load(target)('[id]').toArray().some(node => load(target)(node).attr('id') === fragment), file, `Missing anchor: ${value}`);
      }
    }
  });

  if (file.startsWith('topics/')) {
    const images = $('img').toArray();
    check(new Set(images.map(image => $(image).attr('src'))).size >= 3, file, 'Offer needs at least three distinct images');
    images.forEach((image, index) => {
      const tag = $(image);
      check(Boolean(tag.attr('alt')), file, `Missing image alt: ${tag.attr('src')}`);
      check(Number(tag.attr('width')) > 0 && Number(tag.attr('height')) > 0, file, `Missing image dimensions: ${tag.attr('src')}`);
      if (!tag.closest('.hero').length) check(tag.attr('loading') === 'lazy', file, `Supporting image must lazy-load: ${tag.attr('src')}`);
    });
    check($('.seo-related a').length >= 2, file, 'Missing related guide navigation');
  }
}

const home = load('index.html');
const homeLinks = new Set(home('#blog-grid h3 a').map((i, link) => home(link).attr('href')).get());
check(home('#blog-grid .blog-post').length === guides.length, 'index.html', 'Static catalog is out of date');
for (const guide of guides) check(homeLinks.has(cleanPath(guide.reviewUrl)), 'index.html', `Guide not linked in static HTML: ${guide.reviewUrl}`);
for (const hub of hubs) {
  const $ = load(hub.file);
  const links = new Set($('.blog-post h3 a').map((i, link) => $(link).attr('href')).get());
  check(links.size === guidesFor(hub).length, hub.file, 'Topic catalog is out of date');
  for (const guide of guidesFor(hub)) check(links.has(cleanPath(guide.reviewUrl)), hub.file, `Missing guide: ${guide.reviewUrl}`);
}

const sitemap = cheerio.load(fs.readFileSync('sitemap.xml', 'utf8'), {xml: true});
const urls = sitemap('loc').map((i, element) => sitemap(element).text()).get();
const expectedUrls = files.filter(indexable).map(file => siteUrl + cleanPath(file));
check(urls.length === new Set(urls).size, 'sitemap.xml', 'Duplicate URLs');
check(urls.length === expectedUrls.length && expectedUrls.every(url => urls.includes(url)), 'sitemap.xml', 'Sitemap differs from public indexable pages');
for (const [source, destination] of redirects) {
  const url = new URL(destination, siteUrl);
  check(Boolean(resolveFile(url)), 'vercel.json', `Redirect target is missing: ${source} -> ${destination}`);
  check(!redirects.has(destination), 'vercel.json', `Redirect chain: ${source} -> ${destination}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`SEO checks passed: ${files.length} pages, ${guides.length} guides, ${hubs.length} topic directories, internal links, image requirements, structured data and sitemap.`);
