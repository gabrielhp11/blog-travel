const fs = require('node:fs');
const cheerio = require('cheerio');
const {siteUrl, guides, hubs, cleanPath, indexable} = require('./site-data');

const published = ['index.html', 'affiliate-disclosure.html', ...hubs.map(hub => hub.file), ...guides.map(guide => guide.reviewUrl)];
const urls = published.filter(indexable).map(file => {
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const expected = siteUrl + cleanPath(file);
  const canonical = $('link[rel="canonical"]').attr('href');
  if (canonical !== expected) throw new Error('Canonical mismatch in ' + file + ': ' + canonical);
  return canonical;
}).sort();
const escapeXml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(url => '  <url><loc>' + escapeXml(url) + '</loc></url>'),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync('sitemap.xml', xml);
console.log('Generated sitemap.xml with ' + urls.length + ' canonical, indexable pages.');
