const fs = require('node:fs');
const cheerio = require('cheerio');
const {siteUrl, guides, hubs, cleanPath, indexable, planningPages} = require('./site-data');

const published = ['index.html', 'affiliate-disclosure.html', ...hubs.map(hub => hub.file), ...planningPages.map(page => page.file), ...guides.map(guide => guide.reviewUrl)];
const entries = published.filter(indexable).map(file => {
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const expected = siteUrl + cleanPath(file);
  const canonical = $('link[rel="canonical"]').attr('href');
  if (canonical !== expected) throw new Error('Canonical mismatch in ' + file + ': ' + canonical);
  // File mtimes change on checkout/build; only an explicit content review is a reliable date.
  const lastmod = $('meta[name="dateModified"]').attr('content');
  if (lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error('Invalid content review date: ' + file);
  return {canonical, lastmod};
}).sort((a, b) => a.canonical.localeCompare(b.canonical));
const escapeXml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(entry => '  <url><loc>' + escapeXml(entry.canonical) + '</loc>' + (entry.lastmod ? '<lastmod>' + entry.lastmod + '</lastmod>' : '') + '</url>'),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync('sitemap.xml', xml);
console.log('Generated sitemap.xml with ' + entries.length + ' canonical, indexable pages.');
