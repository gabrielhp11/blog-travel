/** Keep product purpose and a real image in each opening, without duplicating assets. */
const fs = require('node:fs');
const crypto = require('node:crypto');
const cheerio = require('cheerio');
const {catalog, escapeHtml: esc} = require('./site-data');
const openings = JSON.parse(fs.readFileSync('content/product-openings.json', 'utf8'));
const sources = JSON.parse(fs.readFileSync('assets/images/sources/manifest.json', 'utf8'));
const sourceByUrl = new Map(sources.map(source => [source.sourceUrl, source]));
const cssHash = crypto.createHash('sha256').update(fs.readFileSync('assets/css/product-opening.css')).digest('hex').slice(0, 10);
let count = 0;
for (const article of catalog) {
  const file = article.reviewUrl;
  if (!file || !fs.existsSync(file)) continue;
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const hero = $('.hero').first();
  const card = hero.find('.product-card').first();
  const copy = hero.find('.hero-copy').first();
  if (!card.length || !copy.length) continue; // Status pages are not product offers.
  const opening = openings[file];
  if (!opening && !article.editorialPost) throw new Error('Missing product-purpose text: ' + file);

  // Use only pinned, decoded supplier/context images or labelled local illustrations.
  $('img').each((i, element) => {
    const image = $(element);
    const resolved = new URL(image.attr('src'), 'https://blog-travel-eight.vercel.app/' + file);
    if (resolved.origin === 'https://blog-travel-eight.vercel.app') image.attr('src', resolved.pathname);
    const source = sourceByUrl.get(image.attr('src'));
    if (!source) return;
    if (!source.path) throw new Error('Unresolved image source: ' + source.sourceUrl);
    image.attr({src: source.path, width: String(source.width), height: String(source.height)});
    if (source.replacement) {
      image.attr('alt', source.replacement.alt);
      image.closest('figure').find('figcaption').text(source.replacement.caption);
    }
  });

  if (!card.find('img').length) {
    // Teaching illustrations are a clearer introduction than seller earnings graphics.
    const preferContext = ['ki-training.html', 'hook-mastery.html'].some(name => file.endsWith('/' + name));
    let figure = $('main figure').filter((i, element) => {
      const image = $(element).find('img').first();
      if (!image.length || $(element).closest('.hero').length) return false;
      return preferContext ? /\/editorial\//.test(image.attr('src')) : !$(element).closest('.seo-context-gallery').length;
    }).first();
    if (!figure.length) figure = $('main figure').filter((i, element) => $(element).find('img').length && !$(element).closest('.hero').length).first();
    if (!figure.length) throw new Error('No usable opening image: ' + file);
    card.prepend(figure); // Move: the two remaining images stay in the article.
  }
  $('.seo-context-gallery').each((i, gallery) => {
    if (!$(gallery).find('img').length) $(gallery).closest('section').remove();
  });

  if (!copy.children('.hero-opening').length) {
    const openingBlock = $('<div class="hero-opening"></div>');
    const eyebrow = copy.children('.eyebrow').first();
    const title = copy.children('h1').first();
    const lead = copy.children('.lead').first();
    if (!title.length || !lead.length) throw new Error('Unsupported hero structure: ' + file);
    openingBlock.append(eyebrow, title, lead);
    const details = $('<div class="hero-details"></div>');
    details.append(copy.contents());
    copy.append(openingBlock, details);
  }
  if (opening) copy.find('.hero-opening > .lead').text(opening.description);
  if (opening?.modified) $('meta[name="dateModified"]').attr('content', opening.modified);
  $('body').addClass('product-first');
  $('img').each((i, element) => {
    const image = $(element);
    if (image.closest('.hero').length) image.attr({loading: 'eager', fetchpriority: 'high', decoding: 'async'});
    else image.attr({loading: 'lazy', decoding: 'async'}).removeAttr('fetchpriority');
  });
  const stylesheet = $('link[href*="/assets/css/product-opening.css"]').first();
  if (stylesheet.length) stylesheet.attr('href', `/assets/css/product-opening.css?v=${cssHash}`);
  else $('head').append(`<link rel="stylesheet" href="/assets/css/product-opening.css?v=${cssHash}" />\n`);
  const primary = hero.find('img').first();
  $('meta[property="og:image"]').attr('content', 'https://blog-travel-eight.vercel.app' + primary.attr('src'));
  if ($('meta[property="og:image:alt"]').length) $('meta[property="og:image:alt"]').attr('content', primary.attr('alt'));
  const unique = new Set($('img').map((i, image) => $(image).attr('src')).get());
  if (unique.size < 3) throw new Error('Offer needs three distinct images: ' + file);
  fs.writeFileSync(file, $.html());
  count++;
}
console.log(`Prepared direct-purpose openings and visible primary images for ${count} product/editorial guides.`);
