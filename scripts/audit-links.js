/** Read-only HTTP audit. Reachability does not establish offer or affiliate eligibility. */
const fs = require('node:fs');
const cheerio = require('cheerio');
const {catalog, guides, hubs, planningPages, siteUrl, cleanPath} = require('./site-data');
const auditDate = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const outputFile = `docs/audits/link-status-${auditDate}.json`;
const urls = new Map();
function add(url, context) {
  if (!/^https?:\/\//.test(url)) return;
  const key = url.split('#')[0];
  if (!urls.has(key)) urls.set(key, new Set());
  urls.get(key).add(context);
}
for (const item of catalog) add(item.bookingUrl || '', `catalog:${item.id}`);
for (const item of catalog.filter(item=>item.reviewUrl?.endsWith('.html') && fs.existsSync(item.reviewUrl))) {
  const $ = cheerio.load(fs.readFileSync(item.reviewUrl, 'utf8'));
  $('a[href]').each((i, el) => add($(el).attr('href'), item.reviewUrl));
}
for (const file of ['index.html','affiliate-disclosure.html',...guides.map(g=>g.reviewUrl),...hubs.map(h=>h.file),...planningPages.map(p=>p.file)]) add(siteUrl+cleanPath(file), `public:${file}`);
const queue = [...urls];
const results = [];
async function worker() {
  while (queue.length) {
    const [url, contexts] = queue.shift();
    let result = {url, contexts:[...contexts]};
    try {
      const response = await fetch(url, {redirect:'follow', signal:AbortSignal.timeout(18000), headers:{'User-Agent':'PokiSky-LinkAudit/1.0'}});
      result.status = response.status; result.finalUrl = response.url; result.contentType=response.headers.get('content-type');
      const body = (await response.text()).slice(0, 250000);
      const $ = cheerio.load(body); result.title = $('title').text().trim().slice(0,180);
      result.needsBrowser = /text\/html|application\/json/.test(result.contentType||'') && !result.title;
      result.state = response.status === 404 || response.status === 410 ? 'missing' : [401,403,429].includes(response.status) || /just a moment|captcha|access denied|verify you are human/i.test(result.title) ? 'blocked' : response.ok ? 'reachable' : 'http-error';
    } catch (error) {result.state='unconfirmed'; result.error=error.cause?.code || error.name;}
    results.push(result);
    if (results.length % 25 === 0) console.log(`Checked ${results.length}/${urls.size}`);
  }
}
(async()=>{
  await Promise.all(Array.from({length:6}, worker));
  results.sort((a,b)=>a.url.localeCompare(b.url));
  const registeredItems = catalog.map(item=>{
    const validPage=item.reviewUrl?.endsWith('.html') && fs.existsSync(item.reviewUrl);
    const visible=guides.some(g=>g.id===item.id);
    const destination=item.bookingUrl||'';
    const http=results.find(r=>r.url===destination.split('#')[0]);
    return {id:item.id,title:item.title,reviewUrl:item.reviewUrl,bookingUrl:destination,pageState:visible?'published':validPage?'held-for-review':'not-prepared',destinationState:http?.state||(destination.startsWith('/')?'internal':destination?'unconfirmed':'not-configured'),needsBrowser:http?.needsBrowser||false};
  });
  const report = {registeredItems,checkedAt:new Date().toISOString(), limits:'HTTP reachability only. A successful response does not verify current prices, product identity, affiliation, delivery or commission. Bot-blocked responses require browser verification.', counts:results.reduce((a,r)=>(a[r.state]=(a[r.state]||0)+1,a),{}), results};
  fs.mkdirSync('docs/audits',{recursive:true});
  if(fs.existsSync(outputFile)) report.browserChecks=JSON.parse(fs.readFileSync(outputFile,'utf8')).browserChecks||[];
  fs.writeFileSync(outputFile,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report.counts));
})();
