const fs = require('node:fs');
const {siteUrl, guides, hubs, cleanPath, escapeHtml: esc, localeOf, guidesFor, renderCard, jsonLd, itemList} = require('./site-data');

function replaceBlock(html, name, content) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  if (!html.includes(start) || !html.includes(end)) throw new Error(`Missing generated block: ${name}`);
  return html.slice(0, html.indexOf(start) + start.length) + '\n' + content + '\n' + html.slice(html.indexOf(end));
}

let home = fs.readFileSync('index.html', 'utf8');
home = replaceBlock(home, 'catalog', guides.map(renderCard).join('\n'));
home = replaceBlock(home, 'catalog-count', `${guides.length} guides`);
home = replaceBlock(home, 'home-schema', jsonLd({'@context': 'https://schema.org', '@graph': [
  {'@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'PokiSky', url: `${siteUrl}/`, inLanguage: 'en'},
  {'@type': 'CollectionPage', '@id': `${siteUrl}/#webpage`, url: `${siteUrl}/`, name: 'PokiSky: Travel, Online Course & Supplement Guides', isPartOf: {'@id': `${siteUrl}/#website`}, mainEntity: itemList(guides)}
]}));
fs.writeFileSync('index.html', home);
fs.mkdirSync('guides', {recursive: true});
for (const hub of hubs) {
  const articles = guidesFor(hub);
  const url = siteUrl + cleanPath(hub.file);
  const groups = hub.groups.map(([title, intro, subtopics]) => {
    const group = articles.filter(article => subtopics.includes(hub.key === 'europe' ? localeOf(article) : article.subtopic));
    if (!group.length) return '';
    return `<section class="guide-group"${hub.key === 'europe' && subtopics.includes('de-DE') ? ' lang="de"' : ''}><h2>${esc(title)}</h2><p class="section-intro">${esc(intro)}</p><div class="blog-grid">${group.map(renderCard).join('\n')}</div></section>`;
  }).join('\n');
  const assigned = new Set(hub.groups.flatMap(group => group[2]));
  if (articles.some(article => !assigned.has(hub.key === 'europe' ? localeOf(article) : article.subtopic))) throw new Error(`Unassigned guide in ${hub.key}`);
  fs.writeFileSync(hub.file, `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(hub.title)} | PokiSky</title><meta name="description" content="${esc(hub.description)}" />
  <link rel="canonical" href="${url}" /><meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(hub.title)}" /><meta property="og:description" content="${esc(hub.description)}" /><meta property="og:url" content="${url}" />
  <meta property="og:image" content="${siteUrl}/assets/images/products/${hub.key === 'travel' ? 'airalo.png' : ['courses', 'europe'].includes(hub.key) ? 'coursera-plus.png' : 'advanced-amino-formula.jpg'}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/main.css" />
  ${jsonLd({'@context': 'https://schema.org', '@graph': [
    {'@type': 'CollectionPage', name: hub.title, description: hub.description, url, inLanguage: 'en', mainEntity: itemList(articles)},
    {'@type': 'BreadcrumbList', itemListElement: [{'@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/`}, {'@type': 'ListItem', position: 2, name: hub.label, item: url}]}
  ]})}
</head><body class="guide-index">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="topbar"><div class="container nav"><a href="/" class="brand"><span class="brand-mark" aria-hidden="true">P</span><span>PokiSky</span></a><nav class="nav-links" aria-label="Main navigation">${hubs.map(item => `<a href="${cleanPath(item.file)}"${item === hub ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`).join('')}</nav></div></header>
  <main id="main-content" class="container guide-directory">
    <nav class="directory-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${esc(hub.label)}</span></nav>
    <div class="directory-heading"><p class="eyebrow">PokiSky buyer guides</p><h1>${esc(hub.title)}</h1><p class="lead">${esc(hub.description)}</p><a class="text-link" href="/affiliate-disclosure">Editorial standards &amp; affiliate disclosure</a></div>
    ${hub.key === 'europe' ? `<section class="guide-group" aria-labelledby="europe-checklist"><h2 id="europe-checklist">Before buying from Europe</h2><p class="section-intro">Europe includes different countries, currencies and purchase conditions. This directory groups guides by intended audience; it does not establish that every supplier accepts orders in every country.</p><ul><li><strong>Language:</strong> check the course audio, subtitles, software interface and support language separately from the language of our guide.</li><li><strong>Currency and total:</strong> confirm the checkout currency, applicable taxes, card conversion charges and whether the amount is a one-time payment or a renewing subscription.</li><li><strong>Country and access:</strong> check your billing country, delivery destination, software requirements and licences. UK and EU terms may differ.</li><li><strong>Purchase conditions:</strong> read the seller’s current cancellation, refund, digital-access and support terms before paying. Save the order description and applicable conditions.</li></ul><p><a class="text-link" href="#english-guides">English guides</a> · <a class="text-link" href="#german-guides" lang="de">Ratgeber auf Deutsch</a></p></section>` : ''}
    ${hub.key === 'europe' ? groups.replace('<section class="guide-group">', '<section id="english-guides" class="guide-group">').replace('<section class="guide-group" lang="de">', '<section id="german-guides" class="guide-group" lang="de">') : groups}
    <nav class="directory-links" aria-label="More guide topics">${hubs.filter(item => item !== hub).map(item => `<a href="${cleanPath(item.file)}">${esc(item.label)} &#8594;</a>`).join('')}</nav>
  </main>
  <footer class="footer"><div class="container footer-inner"><span>PokiSky</span><a href="/affiliate-disclosure">Editorial standards &amp; disclosure</a></div></footer>
</body></html>\n`.replace(/[ \t]+$/gm, ''));
}
console.log(`Generated a static catalog with ${guides.length} guides and ${hubs.length} topic directories.`);
