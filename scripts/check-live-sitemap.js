/** Check the deployed sitemap, not just files in the checkout. No indexing promises. */
const fs = require('node:fs');
const cheerio = require('cheerio');
const {siteUrl} = require('./site-data');

function indexingBlocked(value = '') {
  return /\b(?:noindex|none)\b/i.test(value);
}

function inspectPage(html, headers, url, expectedHtml) {
  const $ = cheerio.load(html);
  const errors = [];
  if (!/text\/html/i.test(headers.get('content-type') || '')) errors.push('Not HTML');
  if (indexingBlocked(headers.get('x-robots-tag') || '')) errors.push('X-Robots-Tag blocks indexing');
  $('meta[name]').each((i, el) => {
    if (/^(robots|googlebot|bingbot)$/i.test($(el).attr('name')) && indexingBlocked($(el).attr('content'))) errors.push('Meta robots blocks indexing');
  });
  const canonical = $('link[rel="canonical"]');
  if (canonical.length !== 1 || canonical.attr('href') !== url) errors.push('Canonical differs from sitemap URL');
  if (!$('title').text().trim() || $('h1').length !== 1 || !$('h1').text().trim()) errors.push('Missing title or unique H1');
  if (!$('main').text().trim()) errors.push('Missing static main content');
  if (expectedHtml !== undefined) {
    const local = cheerio.load(expectedHtml);
    const links = (doc) => doc('.seo-related-list a').map((i, el) => doc(el).attr('href')).get();
    if (JSON.stringify(links($)) !== JSON.stringify(links(local))) errors.push('Published related navigation differs from checkout');
    const icons = (doc) => doc('link[rel="icon"], link[rel="apple-touch-icon"]').map((i, el) => ['rel', 'href', 'type', 'sizes'].map(name => doc(el).attr(name) || '').join('|')).get();
    if (JSON.stringify(icons($)) !== JSON.stringify(icons(local))) errors.push('Published browser icons differ from checkout');
  }
  return errors;
}

async function get(url) {
  const response = await fetch(url, {redirect: 'manual', signal: AbortSignal.timeout(25000), headers: {'User-Agent': 'PokiSky-Sitemap-Check/1.0'}});
  return {response, body: await response.text()};
}

async function main() {
  const issues = [];
  const {response, body} = await get(siteUrl + '/sitemap.xml');
  if (response.status !== 200) throw new Error('Sitemap HTTP ' + response.status);
  const xml = cheerio.load(body, {xml: true});
  if (!xml('urlset').length) throw new Error('Missing sitemap urlset');
  const urls = xml('url > loc').map((i, el) => xml(el).text().trim()).get();
  if (!urls.length || new Set(urls).size !== urls.length) issues.push('Empty or duplicated sitemap');
  const local = cheerio.load(fs.readFileSync('sitemap.xml', 'utf8'), {xml: true});
  const expected = local('url > loc').map((i, el) => local(el).text().trim()).get();
  if (urls.length !== expected.length || !expected.every(url => urls.includes(url))) issues.push('Live sitemap differs from checkout');
  // This site deliberately allows all paths. Fail closed if the robots policy changes;
  // do not claim to implement arbitrary robots.txt matching.
  const robots = await get(siteUrl + '/robots.txt');
  if (robots.response.status !== 200) issues.push('robots.txt HTTP ' + robots.response.status);
  if (robots.body.split('\n').some(line => /^disallow\s*:\s*\S+/i.test(line.replace(/#.*/, '').trim()))) issues.push('Non-empty robots Disallow requires review');
  if (!robots.body.includes('Sitemap: ' + siteUrl + '/sitemap.xml')) issues.push('robots.txt missing sitemap');
  let cursor = 0;
  const results = [];
  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const errors = [];
      let status = null;
      try {
        const parsed = new URL(url);
        if (parsed.origin !== siteUrl || parsed.hash || parsed.search || parsed.pathname.endsWith('.html')) throw new Error('Not a canonical public URL');
        const page = await get(url);
        status = page.response.status;
        if (status !== 200) errors.push('HTTP ' + status + (page.response.headers.get('location') ? ' -> ' + page.response.headers.get('location') : ''));
        else {
          const file = parsed.pathname === '/' ? 'index.html' : parsed.pathname.slice(1) + '.html';
          errors.push(...inspectPage(page.body, page.response.headers, url, fs.readFileSync(file, 'utf8')));
        }
      } catch (error) { errors.push(error.message); }
      results.push({url, status, errors});
    }
  }
  await Promise.all(Array.from({length: 6}, worker));
  results.sort((a, b) => a.url.localeCompare(b.url));
  const failed = results.filter(result => result.errors.length);
  const report = {checkedAt: new Date().toISOString(), sitemap: siteUrl + '/sitemap.xml', scope: 'HTTP and HTML technical eligibility; not Google index status', checked: urls.length, passed: results.length - failed.length, issues, results};
  const output = process.argv[2];
  if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({checked: report.checked, passed: report.passed, issues, failed}, null, 2));
  if (issues.length || failed.length) process.exitCode = 1;
}

module.exports = {indexingBlocked, inspectPage};
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
