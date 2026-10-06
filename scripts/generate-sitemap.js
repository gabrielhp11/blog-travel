const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const siteUrl = (process.env.SITE_URL || 'https://blog-travel-eight.vercel.app').replace(/\/$/, '');

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'legacy') return [];

    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(filePath);
    return entry.isFile() && entry.name.endsWith('.html') ? [filePath] : [];
  });
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] || '';
}

function pageMetadata(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const head = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '';
  const tags = head.match(/<(?:meta|link)\b[^>]*>/gi) || [];
  const robots = tags.find((tag) => tag.startsWith('<meta') && getAttribute(tag, 'name').toLowerCase() === 'robots');
  const canonical = tags.find((tag) => tag.startsWith('<link') && getAttribute(tag, 'rel').toLowerCase() === 'canonical');

  return {
    noindex: robots ? getAttribute(robots, 'content').toLowerCase().includes('noindex') : false,
    canonical: canonical ? getAttribute(canonical, 'href') : '',
  };
}

const articlesSource = fs.readFileSync('assets/js/articles.js', 'utf8');
const catalogPaths = vm.runInNewContext(
  `${articlesSource}\nblogArticles.filter((article) => !article.hidden && article.reviewUrl.endsWith('.html')).map((article) => article.reviewUrl)`,
);
const publishedPaths = new Set(['index.html', 'affiliate-disclosure.html', ...catalogPaths]);

const urls = listHtmlFiles('.').flatMap((filePath) => {
  const relativePath = path.relative('.', filePath).split(path.sep).join('/');
  if (!publishedPaths.has(relativePath)) return [];

  const { noindex, canonical } = pageMetadata(filePath);
  if (noindex || !canonical) return [];

  const expectedUrl = relativePath === 'index.html'
    ? `${siteUrl}/`
    : `${siteUrl}/${relativePath}`;

  return canonical === expectedUrl ? [canonical] : [];
}).sort();

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync('sitemap.xml', xml);
console.log(`Generated sitemap.xml with ${urls.length} canonical, indexable pages.`);
