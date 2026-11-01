/** Static discovery paths are evidence of navigation, not Google index status. */
const fs = require('node:fs');
const cheerio = require('cheerio');
const {siteUrl, cleanPath, guides, hubs, planningPages, localeOf} = require('./site-data');
const {relatedGuides} = require('./related-guides');
const {hubFor} = require('./site-data');

const files = ['index.html', 'affiliate-disclosure.html', ...hubs.map(item => item.file), ...planningPages.map(item => item.file), ...guides.map(item => item.reviewUrl)];
const pages = new Map(files.map(file => [cleanPath(file), {file, incoming: new Set(), contextualIncoming: new Set(), links: new Set()}]));
const errors = [];
for (const [pathname, page] of pages) {
  const $ = cheerio.load(fs.readFileSync(page.file, 'utf8'));
  page.title = $('title').text().trim();
  page.canonical = $('link[rel="canonical"]').attr('href');
  if (page.canonical !== siteUrl + pathname) errors.push(`${page.file}: canonical differs`);
  if ($('meta[name]').toArray().some(el => /^(robots|googlebot)$/i.test($(el).attr('name')) && /\b(noindex|none)\b/i.test($(el).attr('content') || ''))) errors.push(`${page.file}: indexing blocked`);
  $('a[href]').each((i, el) => {
    let url;
    try { url = new URL($(el).attr('href'), siteUrl + pathname); } catch { return; }
    if (url.origin !== siteUrl || url.search || url.pathname === pathname || !pages.has(url.pathname)) return;
    page.links.add(url.pathname);
    pages.get(url.pathname).incoming.add(pathname);
    if ($(el).closest('.seo-related-list').length) pages.get(url.pathname).contextualIncoming.add(pathname);
  });
  const article = guides.find(item => item.reviewUrl === page.file);
  if (article) {
    const expected = relatedGuides(article, guides, {hubFor, localeOf}).map(item => cleanPath(item.reviewUrl));
    const actual = $('.seo-related-list a').map((i, el) => $(el).attr('href')).get();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${page.file}: contextual recommendations are stale`);
  }
}

const paths = new Map([['/', ['/']]]);
for (const [pathname, steps] of paths) {
  for (const target of pages.get(pathname).links) if (!paths.has(target)) paths.set(target, [...steps, target]);
}
for (const [pathname, page] of pages) if (!paths.has(pathname)) errors.push(`${page.file}: unreachable from home without JavaScript`);

const input = 'docs/audits/google-discovered-2026-11-01.json';
const historical = fs.existsSync(input) ? JSON.parse(fs.readFileSync(input, 'utf8')) : {urls: []};
const results = [...pages].map(([pathname, page]) => ({
  url: siteUrl + pathname, title: page.title, canonical: page.canonical,
  listedInHistoricalGoogleReport: historical.urls.includes(siteUrl + pathname),
  discoveryPath: paths.get(pathname)?.map(step => siteUrl + step) || [],
  incomingPages: [...page.incoming].sort(), contextualIncomingPages: [...page.contextualIncoming].sort()
}));
const summary = {checked: pages.size, reachable: paths.size, historicalExamples: historical.urls.length,
  historicalExamplesChecked: results.filter(item => item.listedInHistoricalGoogleReport).length,
  guidesWithoutContextualIncoming: guides.filter(item => !pages.get(cleanPath(item.reviewUrl)).contextualIncoming.size).length,
  errors};
const report = {checkedAt: new Date().toISOString(), scope: 'Static HTML discovery and navigation; not current Google index status', historicalReportUpdated: historical.reportUpdated, ...summary, results};
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
