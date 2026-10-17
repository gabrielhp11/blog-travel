/** Reject the missing-image and mobile-order regressions found in the October review. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const cheerio = require('cheerio');
const {catalog, guides} = require('./site-data');
const openings = JSON.parse(fs.readFileSync('content/product-openings.json', 'utf8'));
const sources = JSON.parse(fs.readFileSync('assets/images/sources/manifest.json', 'utf8'));
for (const source of sources) {
  assert.ok(source.path && fs.existsSync(source.path.slice(1)), 'Missing pinned image: ' + source.sourceUrl);
  if (source.status === 'cached') {
    const bytes = fs.readFileSync(source.path.slice(1));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), source.sha256, 'Changed source image: ' + source.path);
    assert.ok(source.width > 0 && source.height > 0);
  } else assert.ok(source.replacement?.caption.includes('editorial'), 'Replacement needs explicit editorial identification');
}
const offers = catalog.filter(article => article.reviewUrl && fs.existsSync(article.reviewUrl)).filter(article => {
  const $ = cheerio.load(fs.readFileSync(article.reviewUrl));
  return $('.hero-grid .product-card').length;
});
for (const article of offers) {
  const file = article.reviewUrl;
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  assert.ok($('body.product-first').length, file + ': missing opening layout');
  assert.equal($('link[href*="/assets/css/product-opening.css"]').length, 1, file);
  assert.equal($('.hero-opening h1').length, 1, file);
  assert.equal($('.hero-opening > .lead').length, 1, file);
  assert.equal($('.hero-opening .btn').length, 0, file + ': buttons must follow purpose and image');
  if (openings[file]) assert.equal($('.hero-opening > .lead').text(), openings[file].description, file);
  const primary = $('.hero .product-card img');
  assert.equal(primary.length, 1, file + ': opening needs one primary image');
  assert.equal(primary.attr('loading'), 'eager', file);
  assert.equal(primary.attr('fetchpriority'), 'high', file);
  const supporting = $('main img').filter((i, image) => !$(image).closest('.hero').length);
  assert.ok(supporting.length >= 2, file + ': two supporting images must remain in the article');
  const hashes = new Set();
  $('main img').each((i, image) => {
    const tag = $(image);
    const src = tag.attr('src');
    assert.ok(src.startsWith('/assets/images/'), file + ': images must be served locally');
    assert.ok(tag.attr('alt') && Number(tag.attr('width')) > 0 && Number(tag.attr('height')) > 0, file);
    const bytes = fs.readFileSync(src.slice(1));
    hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
    if (!tag.closest('.hero').length) assert.equal(tag.attr('loading'), 'lazy', file);
  });
  assert.ok(hashes.size >= 3, file + ': three distinct image files required, not duplicate URLs');
}
for (const article of guides) assert.ok(offers.some(offer => offer.reviewUrl === article.reviewUrl), 'Public guide was skipped: ' + article.reviewUrl);
console.log(`Product-opening checks passed: ${offers.length} guides, one eager primary image, two supporting images, direct-purpose text and decoded/pinned source files.`);
