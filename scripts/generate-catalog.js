const fs = require('node:fs');
const {siteUrl, guides, hubs, navHubs, cleanPath, escapeHtml: esc, localeOf, ogLocaleOf, groupKey, guidesFor, renderCard, jsonLd, itemList, faqPage, renderFaqs, renderPlanningLinks} = require('./site-data');

function replaceBlock(html, name, content) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  if (!html.includes(start) || !html.includes(end)) throw new Error(`Missing generated block: ${name}`);
  return html.slice(0, html.indexOf(start) + start.length) + '\n' + content + '\n' + html.slice(html.indexOf(end));
}

let home = fs.readFileSync('index.html', 'utf8');
home = replaceBlock(home, 'catalog', guides.map(renderCard).join('\n'));
home = replaceBlock(home, 'catalog-count', `${guides.length} guides`);
home = replaceBlock(home, 'planning', renderPlanningLinks('europe'));
const homeTitle = 'PokiSky: European travel, course and supplement buying guides';
home = replaceBlock(home, 'home-schema', jsonLd({'@context': 'https://schema.org', '@graph': [
  {'@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'PokiSky', url: `${siteUrl}/`, inLanguage: 'en', availableLanguage: ['en', 'en-GB', 'de', 'pt-BR']},
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
  const groups = hub.groups.map(([title, intro, keys]) => {
    const group = articles.filter(article => keys.includes(groupKey(hub, article)));
    if (!group.length) return '';
    const german = keys.includes('de-DE') && lang !== 'de';
    return `<section class="guide-group"${german ? ' lang="de"' : ''}><h2>${esc(title)}</h2><p class="section-intro">${esc(intro)}</p><div class="blog-grid">${group.map(renderCard).join('\n')}</div></section>`;
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
