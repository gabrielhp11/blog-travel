const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const vm = require('node:vm');
const cheerio = require('cheerio');
const {guides, hubs, guidesFor, isEuropeanGuide, localeOf} = require('./site-data');
const manifest = JSON.parse(fs.readFileSync('assets/fonts/manifest.json'));
for (const face of manifest) {
  const data = fs.readFileSync('assets/fonts/' + face.file);
  assert.equal(data.subarray(0, 4).toString(), 'wOF2');
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'), face.sha256);
}
for (const file of ['index.html', 'affiliate-disclosure.html', ...hubs.map(h=>h.file), ...guides.map(g=>g.reviewUrl)]) {
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  assert.equal($('link[href*="fonts.googleapis.com"],link[href*="fonts.gstatic.com"]').length, 0, file);
  assert.equal($('link[href^="/assets/css/fonts.css"]').length, 1, file);
  const preload = $('link[as="font"]');
  assert.equal(preload.length, 1, file);
  assert.ok(fs.existsSync(preload.attr('href').slice(1)), file);
  assert.ok(preload.is('[crossorigin]'), file);
}
// Exercise the actual filter script against generated cards, including markets
// such as "English-speaking European audience" that the previous exact check missed.
const home = cheerio.load(fs.readFileSync('index.html','utf8'));
const cards = home('#blog-grid .blog-post').toArray().map(element => ({dataset: {...home(element).data()}, hidden: false}));
// Browser dataset values are strings; cheerio converts booleans automatically.
cards.forEach(card => Object.keys(card.dataset).forEach(key => card.dataset[key] = String(card.dataset[key])));
const handlers = {};
const buttons = ['all','europe','german'].map(filter=>({dataset:{filter},classList:{toggle(){}},setAttribute(){},addEventListener(name, callback){handlers[filter]=callback;}}));
const count = {textContent:''};
vm.runInNewContext(fs.readFileSync('assets/js/main.js','utf8'), {document:{
  addEventListener(name, callback){callback();},
  getElementById(id){return id === 'blog-grid' ? {querySelectorAll(){return cards;}} : id === 'guide-count' ? count : null;},
  querySelectorAll(){return buttons;},querySelector(){return {hidden:true};}
}});
handlers.europe();
const english = guides.filter(g=>isEuropeanGuide(g) && localeOf(g).startsWith('en'));
assert.equal(cards.filter(c=>!c.hidden).length, english.length);
assert.ok(cards[0].hidden === false, 'Newest English European guide must remain discoverable');
assert.ok(cards.every(c=>c.hidden || c.dataset.locale.startsWith('en')));
handlers.german();
assert.equal(cards.filter(c=>!c.hidden).length, guides.filter(g=>localeOf(g).startsWith('de')).length);
handlers.all();assert.equal(cards.filter(c=>!c.hidden).length, guides.length);
assert.equal(guidesFor(hubs.find(h=>h.key==='europe')).length, english.length + guides.filter(g=>isEuropeanGuide(g) && localeOf(g).startsWith('de')).length);
console.log(`Europe and performance checks passed: ${english.length} English Europe guides; local fonts verified; actual filters exercised.`);
