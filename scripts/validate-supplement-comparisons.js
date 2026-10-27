/** Check the two-product relationships and comparison-specific publication promises. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cheerio=require('cheerio');
const {catalog,cleanPath}=require('./site-data');
const posts=JSON.parse(fs.readFileSync('content/supplement-comparisons.json','utf8'));
const ids=new Set(),pairs=new Set(),heroHashes=new Set();
const crypto=require('node:crypto');
for(const p of posts){
 assert.ok(!ids.has(p.id),'Duplicate comparison id');ids.add(p.id);
 const key=[...p.sourceProductIds].sort().join(':');assert.ok(!pairs.has(key),'Duplicate comparison pair');pairs.add(key);
 assert.equal(new Set(p.sourceProductIds).size,2);
 const pair=p.sourceProductIds.map(id=>catalog.find(a=>a.id===id&&!a.comparison&&!a.hidden));assert.ok(pair.every(Boolean));
 const $=cheerio.load(fs.readFileSync(p.file,'utf8'));
 assert.equal($('h1').length,1);assert.equal($('meta[name="datePublished"]').attr('content'),p.publishedAt);
 assert.equal($('#comparison thead th').length,3);assert.ok($('#comparison tbody tr').length>=5);
 assert.equal($('main img').length,3);assert.ok($('.editorial-disclosure').text().toLowerCase().includes('affiliate'));
 for(const a of pair)assert.ok($(`a[href="${cleanPath(a.reviewUrl)}"]`).length>=2,'Both guides must remain discoverable');
 assert.equal($('a.btn[href^="http"]').length,0,'Comparison CTAs lead to registered guides, not an unverified offer');
 assert.ok($('#conclusion p').text().length>100,'A specific editorial conclusion is required');
 const h=crypto.createHash('sha256').update(fs.readFileSync(p.images[0].src.slice(1))).digest('hex');assert.ok(!heroHashes.has(h),'Each comparison needs its own individual artwork');heroHashes.add(h);
 for(const s of p.sources)assert.equal(new URL(s.href).protocol,'https:');
 assert.ok(catalog.some(a=>a.id===p.id&&a.comparison));
}
const hub=fs.readFileSync('guides/supplement-comparisons.html','utf8');
for(const p of posts)assert.ok(hub.includes(cleanPath(p.file)), 'Comparison missing from hub');
console.log(`Comparison checks passed: ${posts.length} distinct pairs, individual art, comparison tables and both source guides.`);
