// Notify participating search engines only after verifying the published pages.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cheerio = require('cheerio');
const {siteUrl} = require('./site-data');
const {inspectPage} = require('./check-live-sitemap');

function changedUrls(current, previous) {
  return Object.keys(current).filter(url => current[url] !== previous[url]);
}

async function get(url) {
  const response = await fetch(url, {redirect: 'manual', signal: AbortSignal.timeout(25000)});
  if (response.status !== 200) throw new Error(`${url}: HTTP ${response.status}`);
  return {response, body: await response.text()};
}

async function main() {
  const stateFile = '.cache/indexnow-state.json';
  const reportFile = '.cache/indexnow-report.json';
  const key = fs.readFileSync('indexnow-key.txt', 'utf8').trim();
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('Invalid IndexNow key');
  const keyLocation = `${siteUrl}/indexnow-key.txt`;
  if ((await get(keyLocation)).body.trim() !== key) throw new Error('Published key does not match checkout');
  const live = (await get(`${siteUrl}/sitemap.xml`)).body;
  const urls = cheerio.load(live, {xml: true})('url > loc').map((i, el) => el.children[0].data.trim()).get();
  const local = cheerio.load(fs.readFileSync('sitemap.xml', 'utf8'), {xml: true});
  const expected = local('url > loc').map((i, el) => local(el).text().trim()).get();
  if (!urls.length || new Set(urls).size !== urls.length || urls.length !== expected.length || urls.some(url => !expected.includes(url))) throw new Error('Published sitemap differs from checkout');
  const current = {};
  let cursor = 0;
  await Promise.all(Array.from({length: 6}, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const parsed = new URL(url);
      if (parsed.origin !== siteUrl || parsed.search || parsed.hash) throw new Error('Unexpected URL');
      const {response, body} = await get(url);
      const errors = inspectPage(body, response.headers, url);
      if (errors.length) throw new Error(`${url}: ${errors.join(', ')}`);
      current[url] = crypto.createHash('sha256').update(body).digest('hex');
    }
  }));
  const previous = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {};
  const urlList = changedUrls(current, previous);
  const report = {checkedAt: new Date().toISOString(), checked: urls.length, submitted: 0, status: 'unchanged', note: 'Receipt is not proof of indexing'};
  if (urlList.length) {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({host: new URL(siteUrl).host, key, keyLocation, urlList}),
      signal: AbortSignal.timeout(30000)
    });
    report.httpStatus = response.status;
    if (![200, 202].includes(response.status)) throw new Error(`IndexNow HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
    report.submitted = urlList.length;
    report.urls = urlList;
    report.status = response.status === 200 ? 'received' : 'received-key-validation-pending';
  }
  fs.mkdirSync(path.dirname(stateFile), {recursive: true});
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  // Advance only after receipt; failures remain eligible for the next run.
  fs.writeFileSync(stateFile, JSON.stringify(current, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
}

module.exports = {changedUrls};
if (require.main === module) main().catch(error => {console.error(error.message); process.exitCode = 1;});
