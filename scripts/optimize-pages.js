const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const {siteUrl, guides, hubs, localeOf, ogLocaleOf, languages, cleanPath, absoluteUrl, escapeHtml: esc, hubFor, jsonLd, extractFaqs, faqPage, isEuropeanGuide, isUkIrelandGuide, planningPages} = require('./site-data');

function htmlFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

const files = [...fs.readdirSync('.').filter(file => file.endsWith('.html')), ...htmlFiles('topics')];
const pages = new Map(files.map(file => [cleanPath(file), file]));
for (const hub of hubs) pages.set(cleanPath(hub.file), hub.file);
for (const page of planningPages) pages.set(cleanPath(page.file), page.file);

function normaliseUrl(value, file) {
  if (!value || /^(?:#|data:|mailto:|tel:)/i.test(value)) return value;
  let url;
  try { url = new URL(value, absoluteUrl(`/${file}`)); } catch { return value; }
  if (url.origin !== siteUrl) return value;
  const cleaned = url.pathname === '/index.html' ? '/' : url.pathname.replace(/\.html$/, '');
  if (!pages.has(cleaned)) return value;
  return value.startsWith(siteUrl) ? siteUrl + cleaned + url.search + url.hash : cleaned + url.search + url.hash;
}

const contexts = {
  en: {home: 'Home', breadcrumb: 'Breadcrumb', by: 'By', related: 'Related buyer guides', browse: 'Browse this topic', artwork: 'Editorial illustration by PokiSky; context only, not a product image or course preview.', heading: 'A checklist for your decision'},
  'en-GB': {home: 'Home', breadcrumb: 'Breadcrumb', by: 'By', related: 'Related buyer guides', browse: 'Browse this topic', artwork: 'Editorial illustration by PokiSky; context only, not a product image or course preview.', heading: 'A checklist for your decision'},
  'pt-BR': {home: 'Início', breadcrumb: 'Você está em', by: 'Por', related: 'Guias relacionados', browse: 'Explorar este assunto', artwork: 'Ilustração editorial da PokiSky; contexto, não uma imagem do produto ou prévia do curso.', heading: 'Pontos para comparar antes de decidir'},
  'de-DE': {home: 'Startseite', breadcrumb: 'Brotkrümelnavigation', by: 'Von', related: 'Weitere Ratgeber', browse: 'Weitere Angebote zu diesem Thema', artwork: 'Redaktionelle Illustration von PokiSky; keine Produktabbildung oder Kursansicht.', heading: 'Vor der Entscheidung vergleichen'}
};
const artDescriptions = {
  en: {'label-checklist': 'Ingredients, amounts, directions and warnings to check', 'learning-plan': 'Choose a goal, study, practise and review', 'language-practice': 'Everyday greetings in four languages', 'travel-checklist': 'Destinations, dates and booking terms to check', 'points-planning': 'Compare availability, fees and flexibility'},
  'pt-BR': {'label-checklist': 'Ingredientes, quantidades, instruções e avisos para conferir', 'learning-plan': 'Definir uma meta, estudar, praticar e revisar', 'language-practice': 'Cumprimentos do dia a dia em quatro idiomas', 'travel-checklist': 'Destinos, datas e condições da reserva para conferir', 'points-planning': 'Comparar disponibilidade, taxas e flexibilidade'},
  'de-DE': {'label-checklist': 'Zutaten, Mengen, Anwendung und Warnhinweise prüfen', 'learning-plan': 'Lernziel wählen, lernen, üben und überprüfen', 'language-practice': 'Begrüßungen in vier Sprachen', 'travel-checklist': 'Reiseziele, Daten und Buchungsbedingungen prüfen', 'points-planning': 'Verfügbarkeit, Gebühren und Flexibilität vergleichen'}
};

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(original, {sourceCodeLocationInfo: true});
  const edits = [];
  function replace(element, html, startTagOnly = false) {
    const location = element[0]?.sourceCodeLocation;
    if (!location) throw new Error(`Missing source location in ${file}`);
    const range = startTagOnly ? location.startTag : location;
    edits.push({start: range.startOffset, end: range.endOffset, html});
  }
  function attributes(element, values) {
    element.attr(values);
    const tag = $.html(element).match(/^<[^>]*>/)[0];
    const location = element[0].sourceCodeLocation.startTag;
    if (original.slice(location.startOffset, location.endOffset) !== tag) replace(element, tag, true);
  }
  function insert(offset, html) { edits.push({start: offset, end: offset, html}); }

  $('a[href], link[rel="canonical"], meta[property="og:url"]').each((i, element) => {
    const tag = $(element);
    const attr = element.name === 'meta' ? 'content' : 'href';
    const value = tag.attr(attr);
    const next = normaliseUrl(value, file);
    if (next !== value) attributes(tag, {[attr]: next});
  });

  const article = guides.find(item => item.reviewUrl === file);
  if (article) {
    const lang = localeOf(article);
    const text = contexts[lang] || contexts.en;
    const descriptions = artDescriptions[lang] || artDescriptions.en;
    const hub = hubFor(article);
    const url = absoluteUrl(cleanPath(file));
    $('img').each((i, element) => attributes($(element), {loading: $(element).closest('.hero').length ? 'eager' : 'lazy', decoding: 'async'}));
    attributes($('html'), {lang});
    replace($('title'), `<title>${esc(article.title)} | PokiSky</title>`);
    replace($('h1').first(), `<h1>${esc(article.title)}</h1>`);
    attributes($('meta[property="og:title"]'), {content: article.title});
    if ($('meta[name="twitter:title"]').length) attributes($('meta[name="twitter:title"]'), {content: article.title});
    const breadcrumb = `<nav class="breadcrumb" aria-label="${text.breadcrumb}"><a href="/">${text.home}</a><span aria-hidden="true">/</span><a href="${cleanPath(hub.file)}">${esc(hub.label)}</a><span aria-hidden="true">/</span><span>${esc(article.title.split(':')[0])}</span></nav>`;
    if ($('.breadcrumb').length) {
      // Drop earlier link-only edits inside the breadcrumb being replaced.
      const location = $('.breadcrumb')[0].sourceCodeLocation;
      for (let i = edits.length - 1; i >= 0; i--) if (edits[i].start >= location.startOffset && edits[i].end <= location.endOffset) edits.splice(i, 1);
      replace($('.breadcrumb').first(), breadcrumb);
    }
    const author = `<p class="seo-author">${text.by} <a href="/affiliate-disclosure">PokiSky Editorial Desk</a></p>`;
    if ($('.seo-author').length) replace($('.seo-author'), author);
    else insert($('h1').first()[0].sourceCodeLocation.endOffset, '\n' + author);

    let additionalImages = [];
    if ($('img').length === 0) additionalImages = article.subtopic === 'points-and-miles' ? ['travel-checklist', 'points-planning', 'learning-plan'] : ['language-practice', 'learning-plan', 'travel-checklist'];
    else if ($('img').length < 3) additionalImages = [article.topic === 'wellness' ? 'label-checklist' : 'learning-plan'];
    if (additionalImages.length) {
      const gallery = `<section class="editorial-section"><div class="container editorial-narrow"><h2>${text.heading}</h2><div class="seo-context-gallery">${additionalImages.map(name => `<figure><img src="/assets/images/editorial/${name}.svg" alt="${esc(descriptions[name])}" width="960" height="600" loading="lazy" decoding="async" /><figcaption>${esc(descriptions[name])}. ${text.artwork}</figcaption></figure>`).join('')}</div></div></section>`;
      insert($('.hero').first()[0].sourceCodeLocation.endOffset, '\n' + gallery);
    }

    const related = guides.filter(item => item !== article && hubFor(item) === hub).sort((a, b) => {
      const score = item => (item.subtopic === article.subtopic ? 4 : 0) + (localeOf(item) === lang ? 2 : 0);
      return score(b) - score(a);
    }).slice(0, 3);
    const europeHub = hubs.find(item => item.key === 'europe');
    const germanHub = hubs.find(item => item.key === 'europe-de');
    const ukHub = hubs.find(item => item.key === 'uk-ireland');
    const extraLinks = [];
    if (article.subtopic === 'connectivity') {
      const planning = planningPages.find(page => page.lang === lang) || planningPages[0];
      extraLinks.push(`<a href="${cleanPath(planning.file)}" lang="${planning.lang}">${esc(planning.title)} &#8594;</a>`);
    }
    extraLinks.push(`<a href="${cleanPath(hub.file)}">${text.browse} &#8594;</a>`);
    if (isEuropeanGuide(article) && europeHub) extraLinks.push(`<a href="${cleanPath(europeHub.file)}">${lang.startsWith('de') ? 'Europa-Ratgeber' : 'Europe buying guides'} &#8594;</a>`);
    if (lang.startsWith('de') && germanHub) extraLinks.push(`<a href="${cleanPath(germanHub.file)}" lang="de">Ratgeber auf Deutsch &#8594;</a>`);
    if (isUkIrelandGuide(article) && ukHub) extraLinks.push(`<a href="${cleanPath(ukHub.file)}">UK and Ireland guides &#8594;</a>`);
    const relatedHtml = `<section class="editorial-section seo-related"><div class="container editorial-narrow"><h2>${text.related}</h2><ul class="seo-related-list">${related.map(item => `<li><a href="${cleanPath(item.reviewUrl)}" lang="${localeOf(item)}">${esc(item.title)}</a><small>${languages[localeOf(item)] || localeOf(item)} · ${esc(item.category)}</small></li>`).join('')}</ul>${extraLinks.join('')}</div></section>`;
    const oldRelated = $('.seo-related').first().length ? $('.seo-related').first() : $('.offer-related-grid').closest('section').first();
    if (oldRelated.length) {
      const location = oldRelated[0].sourceCodeLocation;
      for (let i = edits.length - 1; i >= 0; i--) if (edits[i].start >= location.startOffset && edits[i].end <= location.endOffset) edits.splice(i, 1);
      replace(oldRelated, relatedHtml);
    } else insert($('main article').first()[0].sourceCodeLocation.endTag.startOffset, '\n' + relatedHtml + '\n');

    const images = $('img').map((i, image) => absoluteUrl(new URL($(image).attr('src'), url).href)).get();
    images.push(...additionalImages.map(name => absoluteUrl(`/assets/images/editorial/${name}.svg`)));
    const entities = [
      {'@type': 'Article', '@id': url + '#article', mainEntityOfPage: url, headline: article.title, description: $('meta[name="description"]').attr('content'), inLanguage: lang, image: [...new Set(images)].slice(0, 3), author: {'@type': 'Organization', name: 'PokiSky Editorial Desk', url: `${siteUrl}/affiliate-disclosure`}, publisher: {'@type': 'Organization', name: 'PokiSky', url: `${siteUrl}/`}},
      {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name: text.home, item: `${siteUrl}/`},
        {'@type': 'ListItem', position: 2, name: hub.label, item: absoluteUrl(cleanPath(hub.file))},
        {'@type': 'ListItem', position: 3, name: article.title.split(':')[0], item: url}
      ]}
    ];
    const faqs = faqPage(extractFaqs($));
    if (faqs) entities.push(faqs);
    const graph = jsonLd({'@context': 'https://schema.org', '@graph': entities});
    if ($('script[data-pokisky-seo]').length) replace($('script[data-pokisky-seo]'), graph);
    else insert($('head')[0].sourceCodeLocation.endTag.startOffset, graph + '\n');
    if (!$('meta[property="og:image"]').length && images.length) insert($('head')[0].sourceCodeLocation.endTag.startOffset, `<meta property="og:image" content="${esc(images[0])}" />\n`);
    const headEnd = $('head')[0].sourceCodeLocation.endTag.startOffset;
    if (!$('meta[property="og:site_name"]').length) insert(headEnd, `<meta property="og:site_name" content="PokiSky" />\n`);
    if (!$('meta[property="og:locale"]').length) insert(headEnd, `<meta property="og:locale" content="${ogLocaleOf(lang)}" />\n`);
    if (!$('meta[name="twitter:card"]').length) insert(headEnd, `<meta name="twitter:card" content="summary_large_image" />\n`);
  }
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let html = original;
  for (const edit of edits) html = html.slice(0, edit.start) + edit.html + html.slice(edit.end);
  html = html.replace(/[ \t]+$/gm, '');
  if (html !== original) fs.writeFileSync(file, html);
}

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
for (const redirect of config.redirects) {
  redirect.destination = redirect.destination.replace(/\.html$/, '');
}
fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n');
console.log(`Updated metadata, internal links and editorial navigation for ${guides.length} published guides.`);
