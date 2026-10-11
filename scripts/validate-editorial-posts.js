const fs = require('node:fs');
const assert = require('node:assert/strict');
const cheerio = require('cheerio');
const {catalog, guides, cleanPath} = require('./site-data');
const {renderPost} = require('./render-editorial-post');
const posts = JSON.parse(fs.readFileSync('content/editorial-posts.json', 'utf8'));
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const used = new Set();
for (const post of posts) {
  assert.ok(!used.has(post.id), 'Duplicate editorial ID'); used.add(post.id);
  assert.ok(!catalog.some(article => article.id === post.id && !article.editorialPost), 'Existing product ID collision');
  const source = guides.find(article => article.id === post.sourceProductId && !article.editorialPost);
  assert.ok(source, 'Source item must be registered and indexable: ' + post.title);
  assert.ok(/Europe|United States/.test(post.market), 'Editorial scope must be Europe or US');
  for (const date of [post.reviewed, post.scheduledFor, post.publishedAt].filter(Boolean)) assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  if (post.publishedAt) assert.ok(post.reviewed <= post.publishedAt, 'Review cannot be later than publication');
  assert.ok(post.sections.length >= 2 && post.checklist.length >= 4 && post.faqs.length >= 2);
  assert.equal(new Set(post.images.map(image => image.src)).size, 3);
  for (const image of post.images) {
    assert.ok(image.alt && image.width > 0 && image.height > 0);
    const svg = fs.readFileSync(image.src.slice(1), 'utf8');
    assert.ok(svg.includes(`width="${image.width}"`) && svg.includes(`height="${image.height}"`), 'Actual image dimensions differ');
    assert.match(svg, /editorial/i, 'Artwork needs editorial identification');
  }
  for (const [,href] of post.sources) assert.equal(new URL(href).protocol, 'https:');
  const $ = cheerio.load(renderPost(post, source));
  assert.equal($('h1').length, 1);
  assert.equal($('img').length, 3);
  assert.ok($(`a[href="${cleanPath(source.reviewUrl)}"]`).length >= 2, 'Post must lead to the original item');
  assert.equal($('img[loading="lazy"]').length, 2);
  assert.ok($('.editorial-disclosure').text().includes('affiliate'));
  if (post.publishedAt) {
    assert.ok(fs.existsSync(post.file));
    assert.ok(catalog.some(article => article.id === post.id && article.publishedAt === post.publishedAt));
    const publicPage = cheerio.load(fs.readFileSync(post.file, 'utf8'));
    assert.equal(publicPage('meta[name="datePublished"]').attr('content'), post.publishedAt);
    assert.ok(publicPage(`time[datetime="${post.publishedAt}"]`).length);
    assert.ok(sitemap.includes(cleanPath(post.file)));
  } else {
    assert.ok(!fs.existsSync(post.file), 'Future draft leaked as a public page');
    assert.ok(!catalog.some(article => article.id === post.id), 'Future draft leaked into catalog');
    assert.ok(!sitemap.includes(cleanPath(post.file)), 'Future draft leaked into sitemap');
  }
}
assert.ok(fs.readFileSync('.vercelignore','utf8').split('\n').includes('content/'), 'Draft content must stay outside deployment');
console.log(`Editorial checks passed: ${posts.filter(post => post.publishedAt).length} released; ${posts.filter(post => !post.publishedAt).length} complete drafts excluded from public delivery.`);
