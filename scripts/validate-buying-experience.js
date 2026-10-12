const assert=require('node:assert/strict');
const fs=require('node:fs');
const cheerio=require('cheerio');
const {guides,hubs,planningPages,cleanPath}=require('./site-data');
for(const file of ['index.html','affiliate-disclosure.html',...hubs.map(h=>h.file),...planningPages.map(p=>p.file),...guides.map(g=>g.reviewUrl)]) {
 const $=cheerio.load(fs.readFileSync(file,'utf8'));
 assert.equal($('link[href="/assets/css/experience.css"]').length,1,file);
}
for(const g of guides) {
 const $=cheerio.load(fs.readFileSync(g.reviewUrl,'utf8'));
 assert.equal($('.buying-summary').length,1,g.reviewUrl);
 assert.ok($('.buying-summary').text().includes(g.summary),g.reviewUrl);
 assert.ok($('.skip-link').length,g.reviewUrl);
 assert.ok($('.guide-contents a').length,g.reviewUrl);
 $('.guide-contents a').each((i,e)=>assert.equal($('[id]').filter((i,target)=>$(target).attr('id')===$(e).attr('href').slice(1)).length,1,`${g.reviewUrl}: ${$(e).attr('href')}`));
 $('.buying-next a[target="_blank"]').each((i,e)=>{
  const link=$(e); assert.ok(/noopener/.test(link.attr('rel')),g.reviewUrl);
  const href=link.attr('href'); if(/[?#&]aff=|digistore24.com\/redir|kiwify.*afid=/i.test(href)) assert.ok(/sponsored/.test(link.attr('rel')),g.reviewUrl);
 });
}
const $=cheerio.load(fs.readFileSync('index.html','utf8'));
assert.ok($('#guide-search').is('input[type="search"]'));
assert.ok($('label[for="guide-search"]').length);
$('#blog-grid .blog-post').each((i,e)=>{
 const card=$(e); assert.equal(card.find('.post-footer a').length,1);
 assert.equal(card.find('.post-footer a').attr('href'),cleanPath(guides[i].reviewUrl));
 assert.ok(!card.find('.post-footer a').attr('target'));
});
console.log(`Buying experience checks passed: ${guides.length} summaries, contents, disclosure links and guide-first catalog actions.`);
