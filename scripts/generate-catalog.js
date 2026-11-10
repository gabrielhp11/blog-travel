const fs = require('node:fs');
const {siteUrl, guides, hubs, navHubs, cleanPath, escapeHtml: esc, localeOf, ogLocaleOf, groupKey, guidesFor, renderCard, jsonLd, itemList, faqPage, renderFaqs, renderPlanningLinks} = require('./site-data');

function replaceBlock(html, name, content) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  if (!html.includes(start) || !html.includes(end)) throw new Error(`Missing generated block: ${name}`);
  return html.slice(0, html.indexOf(start) + start.length) + '\n' + content + '\n' + html.slice(html.indexOf(end));
}

const supplementIcons = {
  sleep: 'M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z',
  'brain-health': 'M12 6a3 3 0 0 0-6 0 3 3 0 0 0-2 5 3.5 3.5 0 0 0 1 6.5 3.5 3.5 0 0 0 7 0V6a3 3 0 0 1 6 0 3 3 0 0 1 2 5 3.5 3.5 0 0 1-1 6.5 3.5 3.5 0 0 1-7 0M8 9l-2-3m10 3 2-3M8 14l-3 3.5m11-3.5 3 3.5',
  'gut-health': 'M9 3v5a2 2 0 0 0 3.4 1.4C15 7 20 8 20 13a7 7 0 0 1-7 7H9a2 2 0 0 0-2 2m6-19v3c4-1 9 1 9 7a9 9 0 0 1-9 9H9',
  'metabolic-health': 'M2 12h5l3-7 4 14 3-7h5',
  nutrition: 'M20 4c-8 0-13 3-13 9a4 4 0 0 0 4 4c6 0 9-5 9-13ZM4 20l11-11',
  longevity: 'M6 3h12M6 21h12M8 3v4a4 4 0 0 0 1.2 2.8l2.8 2.2-2.8 2.2A4 4 0 0 0 8 17v4M16 3v4a4 4 0 0 1-1.2 2.8L12 12l2.8 2.2A4 4 0 0 1 16 17v4',
  'mens-health': 'M15 3h6v6m0-6-7 7M15 14a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  'joint-health': 'm8 13 5-5a2.7 2.7 0 1 1 4-3.5 2.7 2.7 0 1 1 3.5 4L15 14m1-3-5 5a2.7 2.7 0 1 1-4 3.5 2.7 2.7 0 1 1-3.5-4L9 10',
  collagen: 'M12 2v8m-4-4h8m3 6v6m-3-3h6M7 12v8m-4-4h8',
  'vision-health': 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  hair: 'M5 21c0-8 3-14 8-18M10 21c0-7 3-12 8-16m-3 16c0-4 2-8 5-10',
  labels: 'M7 3h8l4 4v14H5V3h2Zm7 0v5h5M8 12h8m-8 4h8'
};

function renderSupplementTopicLink(title, href, icon) {
  return `<a href="${href}"><span class="supplement-topic-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="${supplementIcons[icon]}" /></svg></span><span>${esc(title)}</span></a>`;
}

let home = fs.readFileSync('index.html', 'utf8');
home = replaceBlock(home, 'catalog', guides.map(renderCard).join('\n'));
home = replaceBlock(home, 'catalog-count', `${guides.length} guides`);
home = replaceBlock(home, 'planning', renderPlanningLinks('europe'));
const homeTitle = 'PokiSky: travel, course, software and supplement buying guides';
home = replaceBlock(home, 'home-schema', jsonLd({'@context': 'https://schema.org', '@graph': [
  {'@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'PokiSky', url: `${siteUrl}/`, inLanguage: 'en', availableLanguage: ['en', 'en-GB', 'en-US', 'de', 'pt-BR', 'fr-FR']},
  {'@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'PokiSky', url: `${siteUrl}/`, knowsLanguage: ['en', 'de', 'pt']},
  {'@type': 'CollectionPage', '@id': `${siteUrl}/#webpage`, url: `${siteUrl}/`, name: homeTitle, isPartOf: {'@id': `${siteUrl}/#website`}, publisher: {'@id': `${siteUrl}/#organization`}, mainEntity: itemList(guides)}
]}));
fs.writeFileSync('index.html', home);
fs.mkdirSync('guides', {recursive: true});
for (const hub of hubs) {
  const articles = guidesFor(hub);
  const url = siteUrl + cleanPath(hub.file);
  const lang = hub.lang || 'en';
  const image = hub.image || (hub.key === 'travel' ? 'airalo.png' : hub.key === 'wellness' ? 'advanced-amino-formula.jpg' : 'coursera-plus.png');
  const supplementTopicLinks = [];
  const groups = hub.groups.map(([title, intro, keys]) => {
    const group = articles.filter(article => keys.includes(groupKey(hub, article)));
    if (!group.length) return '';
    const german = keys.includes('de-DE') && lang !== 'de';
    let heading = `<h2>${esc(title)}</h2>`;
    if (hub.key === 'wellness') {
      const [id] = keys;
      supplementTopicLinks.push(renderSupplementTopicLink(title, `#${id}`, id));
      heading = `<div class="supplement-topic-heading"><h2 id="${id}">${esc(title)}</h2><a class="text-link" href="#supplement-topics">All topics <span aria-hidden="true">&#8593;</span></a></div>`;
    }
    return `<section class="guide-group"${german ? ' lang="de"' : ''}>${heading}<p class="section-intro">${esc(intro)}</p><div class="blog-grid">${group.map(renderCard).join('\n')}</div></section>`;
  }).join('\n');
  const assigned = new Set(hub.groups.flatMap(group => group[2]));
  if (articles.some(article => !assigned.has(groupKey(hub, article)))) throw new Error(`Unassigned guide in ${hub.key}`);
  const crumbs = [{'@type': 'ListItem', position: 1, name: lang.startsWith('de') ? 'Startseite' : 'Home', item: `${siteUrl}/`}];
  if (hub.nav === false) crumbs.push({'@type': 'ListItem', position: 2, name: 'Europe', item: `${siteUrl}/guides/europe`});
  crumbs.push({'@type': 'ListItem', position: crumbs.length + 1, name: hub.label, item: url});
  const graph = [
    {'@type': 'CollectionPage', name: hub.title, description: hub.description, url, inLanguage: lang, isPartOf: {'@id': `${siteUrl}/#website`}, mainEntity: itemList(articles)},
    {'@type': 'BreadcrumbList', itemListElement: crumbs}
  ];
  const faqs = faqPage(hub.faqs);
  if (faqs) graph.push(faqs);
  let intro = '';
  if (hub.key === 'wellness') {
    supplementTopicLinks.push(renderSupplementTopicLink('Compare labels', '/guides/supplement-comparisons', 'labels'));
    intro = `<nav class="supplement-topics" aria-labelledby="supplement-topics">
      <h2 id="supplement-topics">Browse by topic</h2>
      <div class="supplement-topic-links">${supplementTopicLinks.join('\n        ')}</div>
    </nav>`;
  }
  if (hub.key === 'europe') {
    intro = `<section class="guide-group" aria-labelledby="europe-checklist"><h2 id="europe-checklist">Before buying from Europe</h2><p class="section-intro">Europe includes different countries, currencies and purchase conditions. This directory groups guides by intended audience; it does not establish that every supplier accepts orders in every country.</p><ul><li><strong>Language:</strong> check the course audio, subtitles, software interface and support language separately from the language of our guide.</li><li><strong>Currency and total:</strong> confirm the checkout currency, applicable taxes, card conversion charges and whether the amount is a one-time payment or a renewing subscription.</li><li><strong>Country and access:</strong> check your billing country, delivery destination, software requirements and licences. UK and EU terms may differ.</li><li><strong>Purchase conditions:</strong> read the seller’s current cancellation, refund, digital-access and support terms before paying. Save the order description and applicable conditions.</li></ul><p class="hub-jump"><a class="text-link" href="#english-guides">English guides</a><a class="text-link" href="#german-guides" lang="de">Ratgeber auf Deutsch</a><a class="text-link" href="/guides/europe-de" lang="de">Deutsch-Verzeichnis</a><a class="text-link" href="/guides/uk-ireland">UK &amp; Ireland directory</a></p></section>`;
  }
  if (hub.key === 'europe-de') {
    intro = `<section class="guide-group"><h2>Vor dem Kauf prüfen</h2><p class="section-intro">Diese Übersicht sammelt deutschsprachige Ratgeber. Sie belegt keine Lieferung oder Abrechnung in jedem Land. Vergleichen Sie Sprache, Währung, Steuern und Widerruf beim Anbieter.</p><p class="hub-jump"><a class="text-link" href="/guides/europe">Europe directory</a><a class="text-link" href="/guides/uk-ireland">UK &amp; Ireland</a></p></section>`;
  }
  if (hub.key === 'uk-ireland') {
    intro = `<section class="guide-group"><h2>Before ordering to the UK or Ireland</h2><p class="section-intro">These guides record a United Kingdom and Ireland audience where the supplier listed those destinations. They do not establish delivery to every address or to other European countries. Confirm the live checkout for your postcode.</p><p class="hub-jump"><a class="text-link" href="/guides/europe">All Europe guides</a><a class="text-link" href="/guides/wellness">All supplement guides</a></p></section>`;
  }
  const faqHeading = lang.startsWith('de') ? 'Häufige Fragen vor dem Kauf' : 'Questions before you click through';
  const faqIntro = lang.startsWith('de') ? 'Kurze Antworten aus dem sichtbaren Verzeichnis. Sie ersetzen nicht die aktuellen Anbieterbedingungen.' : 'Short answers from this directory. They do not replace the seller’s live terms.';
  let bodyGroups = groups;
  if (hub.key === 'europe') bodyGroups = groups.replace('<section class="guide-group">', '<section id="english-guides" class="guide-group">').replace('<section class="guide-group" lang="de">', '<section id="german-guides" class="guide-group" lang="de">');
  fs.writeFileSync(hub.file, `<!doctype html>
<html lang="${esc(lang)}"><head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(hub.title)} | PokiSky</title><meta name="description" content="${esc(hub.description)}" />
  <link rel="canonical" href="${url}" /><meta property="og:type" content="website" />
  <meta property="og:site_name" content="PokiSky" /><meta property="og:locale" content="${ogLocaleOf(lang)}" />
  <meta property="og:title" content="${esc(hub.title)}" /><meta property="og:description" content="${esc(hub.description)}" /><meta property="og:url" content="${url}" />
  <meta property="og:image" content="${siteUrl}/assets/images/products/${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/main.css" />
  ${jsonLd({'@context': 'https://schema.org', '@graph': graph})}
</head><body class="guide-index">
  <a class="skip-link" href="#main-content">${lang.startsWith('de') ? 'Zum Inhalt' : 'Skip to content'}</a>
  <header class="topbar"><div class="container nav"><a href="/" class="brand"><span class="brand-mark" aria-hidden="true">P</span><span>PokiSky</span></a><nav class="nav-links" aria-label="${lang.startsWith('de') ? 'Hauptnavigation' : 'Main navigation'}">${navHubs.map(item => `<a href="${cleanPath(item.file)}"${item === hub || (hub.nav === false && item.key === 'europe') ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`).join('')}</nav></div></header>
  <main id="main-content" class="container guide-directory">
    <nav class="directory-breadcrumb" aria-label="${lang.startsWith('de') ? 'Brotkrümelnavigation' : 'Breadcrumb'}"><a href="/">${lang.startsWith('de') ? 'Startseite' : 'Home'}</a><span aria-hidden="true">/</span>${hub.nav === false ? `<a href="/guides/europe">Europe</a><span aria-hidden="true">/</span>` : ''}<span>${esc(hub.label)}</span></nav>
    <div class="directory-heading"><p class="eyebrow">${lang.startsWith('de') ? 'PokiSky-Ratgeber' : 'PokiSky buyer guides'}</p><h1>${esc(hub.title)}</h1><p class="lead">${esc(hub.description)}</p><a class="text-link" href="/affiliate-disclosure">${lang.startsWith('de') ? 'Redaktionsstandards und Affiliate-Hinweis' : 'Editorial standards &amp; affiliate disclosure'}</a></div>
    ${intro}
    ${renderPlanningLinks(hub.key, lang)}
    ${bodyGroups}
    ${renderFaqs(hub.faqs, faqHeading, faqIntro)}
    <nav class="directory-links" aria-label="${lang.startsWith('de') ? 'Weitere Themen' : 'More guide topics'}">${hubs.filter(item => item !== hub).map(item => `<a href="${cleanPath(item.file)}"${item.lang?.startsWith('de') ? ' lang="de"' : ''}>${esc(item.label)} &#8594;</a>`).join('')}</nav>
  </main>
  <footer class="footer"><div class="container footer-inner"><span>PokiSky</span><a href="/affiliate-disclosure">${lang.startsWith('de') ? 'Redaktionsstandards und Hinweis' : 'Editorial standards &amp; disclosure'}</a></div></footer>
</body></html>\n`.replace(/[ \t]+$/gm, ''));
}
console.log(`Generated a static catalog with ${guides.length} guides and ${hubs.length} topic directories.`);
