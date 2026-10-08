const fs = require('node:fs');
const vm = require('node:vm');
const cheerio = require('cheerio');

const siteUrl = 'https://blog-travel-eight.vercel.app';
const catalog = vm.runInNewContext(`${fs.readFileSync('assets/js/articles.js', 'utf8')}\nblogArticles`);
const cleanPath = (file) => file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`;
const absoluteUrl = (url) => new URL(url, `${siteUrl}/`).href;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));

function indexable(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing page: ${file}`);
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  return !/noindex/i.test($('meta[name="robots"]').attr('content') || '');
}

const guides = catalog.filter(article => !article.hidden && article.reviewUrl?.endsWith('.html') && indexable(article.reviewUrl));
const languages = {'pt-BR': 'Português', 'de-DE': 'Deutsch', 'en-GB': 'English', en: 'English'};
const localeOf = (article) => article.locale || 'en';
const ogLocaleOf = (lang) => ({en: 'en_GB', 'en-GB': 'en_GB', 'de-DE': 'de_DE', 'pt-BR': 'pt_BR'}[lang] || 'en_GB');
const planningPages = [
  {file: 'guides/europe-esim.html', lang: 'en-GB', hreflang: 'en', title: 'Airalo vs Holafly for Europe: eSIM buying checklist', description: 'Compare Airalo and Holafly for a Europe trip: country coverage, data, hotspot, home roaming and activation. Source-based checks before you buy.', hubs: ['travel', 'europe', 'uk-ireland'], reviewed: '2026-10-08'},
  {file: 'guides/europa-esim.html', lang: 'de-DE', hreflang: 'de', title: 'eSIM für Europa: Airalo und Holafly vergleichen', description: 'Airalo oder Holafly für die Europareise? Prüfen Sie Länder, Daten, Hotspot, bestehendes Roaming und Aktivierung vor dem Kauf einer Reise-eSIM.', hubs: ['travel', 'europe', 'europe-de'], reviewed: '2026-10-08'}
];

function renderPlanningLinks(key, lang = 'en') {
  const pages = planningPages.filter(page => page.hubs.includes(key));
  if (!pages.length) return '';
  const de = lang.startsWith('de');
  return `<section class="planning-links guide-group"><h2>${de ? 'Reiseplanung und Vergleiche' : 'Plan your trip: comparisons and checklists'}</h2><p>${de ? 'Beginnen Sie mit Ihrer Reiseroute und Ihrem vorhandenen Mobilfunktarif.' : 'Start with your itinerary and the mobile plan you already have.'}</p><ul>${pages.map(page => `<li lang="${page.lang}"><a class="text-link" href="${cleanPath(page.file)}" hreflang="${page.hreflang}">${escapeHtml(page.title)}</a><p>${escapeHtml(page.description)}</p></li>`).join('')}</ul></section>`;
}
// Audience metadata is editorial context, not a guarantee of delivery or billing support.
const isEuropeanGuide = article => /europe|germany|austria|united kingdom|\buk\b|ireland/i.test(article.market || '');
const isUkIrelandGuide = article => /united kingdom|\buk\b|ireland/i.test(article.market || '');
const hubs = [
  {key: 'travel', file: 'guides/travel.html', title: 'Travel planning: eSIMs, transport and experiences', label: 'Travel', description: 'Compare travel eSIMs, transport booking tools, guided experiences and travel-learning guides. Check coverage, ticket conditions and total trip costs.', topics: ['travel'], groups: [
    ['Connectivity', 'Compare your existing roaming allowance with the destinations, validity and activation rules of an eSIM. Check your exact phone model and whether it is unlocked before buying.', ['connectivity']],
    ['Transport and experiences', 'For transport, compare stations, baggage, transfers and refund rules as well as the fare. For tours and attraction tickets, check the operator, meeting point, language and cancellation deadline.', ['transport', 'experiences']],
    ['Travel learning and points', 'Language materials and points courses require time to use. Compare the teaching format and prerequisites; do not treat advertised savings or rewards availability as guaranteed.', ['points-and-miles', 'language-learning']]
  ]},
  {key: 'courses', file: 'guides/courses.html', title: 'Online courses and digital tools: compare before buying', label: 'Courses & skills', description: 'Browse language, creative, technical and business course guides. Compare subscriptions, one-time purchases, prerequisites, access and software costs.', topics: ['business', 'education'], groups: [
    ['Creative tools and learning', 'Distinguish a software subscription from a course or a downloadable preset. Check software versions, licences, renewal terms and whether the course language matches your needs.', ['creative-learning', 'design-tools']],
    ['Business and technical skills', 'Start with the task you want to perform. Compare the syllabus with your experience, required software, access period and the support actually included. Income and career outcomes are not guaranteed.', ['professional-learning', 'technical-training', 'ai-training', 'digital-skills', 'finance-ai', 'productivity', 'course', 'vehicle-buying', 'accessories-business', 'marketing-tools']],
    ['Language and music learning', 'Compare lesson language, starting level and practice format. Check whether an instrument, extra materials, live sessions or individual feedback are included or must be arranged separately.', ['language-learning', 'music-learning']],
    ['Traditional wellbeing learning', 'Compare the syllabus, staged access, payment plans and certificate recognition. A course on traditional wellbeing does not establish medical effectiveness or authorise professional treatment.', ['holistic-learning']],
    ['Nutrition and fitness reading', 'Compare the topics, format and equipment requirements of educational guides. Check suitability with a qualified professional and clarify download access, update delivery and refund conditions before buying.', ['fitness-learning']],
    ['Family and school learning', 'Compare the outline with your family’s questions and local school context. Check delivery format, access, individual support and refund conditions; courses do not assess a particular child or guarantee educational outcomes.', ['family-learning']],
    ['Learning about dogs', 'Compare the course topic with your own dog and questions. Check the teaching language, access period and whether individual support is included. A video course does not assess your particular situation or guarantee changes in behaviour.', ['pet-learning']]
  ]},
  {key: 'wellness', file: 'guides/wellness.html', title: 'Supplement buyer guides: labels, formats and seller claims', label: 'Wellness', description: 'Browse source-based supplement guides. Compare label information, serving formats, pack sizes and seller claims before discussing suitability with a health professional.', topics: ['wellness'], groups: [
    ['Formats and label details', 'Compare the current full label, ingredient amounts, serving directions, warnings and pack sizes. Similar names or shared ingredients do not establish equivalent products or effects.', ['longevity', 'nutrition', 'vision-health', 'joint-health']],
    ['Seller-described formulas', 'Read claims separately from the ingredient list. These guides summarise public seller information and do not establish clinical effectiveness or replace a qualified health professional.', ['brain-health', 'gut-health', 'mens-health', 'metabolic-health']]
  ]}
];
hubs.push({
  key: 'europe',
  file: 'guides/europe.html',
  title: 'Europe buying guides: English, German, UK and Ireland',
  label: 'Europe',
  lang: 'en',
  image: 'coursera-plus.png',
  description: 'English and German PokiSky guides for European readers. Check course language, VAT, UK or EU billing, licences and the seller’s current purchase terms.',
  topics: [],
  groupBy: 'locale',
  select: article => isEuropeanGuide(article) && ['en', 'en-GB', 'de-DE'].includes(localeOf(article)),
  groups: [
    ['English guides for European readers', 'These guides are written in English. Check the supplier’s actual teaching, interface and support languages, as well as availability in your billing country.', ['en', 'en-GB']],
    ['Ratgeber auf Deutsch', 'Vergleichen Sie Kursinhalte, Softwarelizenzen und Kaufbedingungen. Prüfen Sie Unterrichtssprache, Währung, den Gesamtpreis und die Verfügbarkeit in Ihrem Land direkt beim Anbieter.', ['de-DE']]
  ],
  faqs: [
    {q: 'Do these guides cover every country in Europe?', a: 'No. Each guide records an intended audience and purchase context. Confirm your billing country, delivery destination and the seller’s current terms; availability is not established for every European country.'},
    {q: 'What is the difference between the English and German guides?', a: 'English pages are written in English and German pages are written in German. A product’s teaching, interface or support language can still differ from the language of our guide.'},
    {q: 'Are UK and EU checkout terms the same?', a: 'Not necessarily. Currency, tax, delivery, licences and cancellation rules can differ. Read the live checkout for your country before paying.'},
    {q: 'Does PokiSky sell these products?', a: 'No. These are editorial buyer guides. Some links are affiliate links, disclosed on each page and on the disclosure page.'}
  ]
});
hubs.push({
  key: 'europe-de',
  file: 'guides/europe-de.html',
  title: 'Ratgeber auf Deutsch: Kurse, Software und Kaufchecks',
  label: 'Deutsch',
  lang: 'de',
  nav: false,
  image: 'excel-paket.svg',
  description: 'Deutschsprachige PokiSky-Ratgeber zu Kursen und Software. Prüfen Sie Unterrichtssprache, Währung, Steuern, Lizenz und die aktuellen Kaufbedingungen des Anbieters.',
  topics: [],
  groupBy: 'locale',
  select: article => isEuropeanGuide(article) && localeOf(article).startsWith('de'),
  groups: [
    ['Ratgeber auf Deutsch', 'Diese Seiten sind auf Deutsch geschrieben. Prüfen Sie trotzdem die tatsächliche Unterrichts-, Oberflächen- und Supportsprache beim Anbieter sowie die Verfügbarkeit in Ihrem Land.', ['de-DE']]
  ],
  faqs: [
    {q: 'Gelten diese Ratgeber für jedes Land in Europa?', a: 'Nein. Jede Seite nennt den vorgesehenen Leserkreis. Rechnungsadresse, Lieferort und die aktuellen Bedingungen des Anbieters müssen Sie selbst prüfen.'},
    {q: 'Ist die Kurssprache immer Deutsch?', a: 'Die Ratgeber sind auf Deutsch. Unterricht, Softwareoberfläche und Support können abweichen. Vergleichen Sie die Angaben des Anbieters.'},
    {q: 'Verkauft PokiSky die Angebote?', a: 'Nein. Es handelt sich um redaktionelle Kaufhilfen. Einige Links sind Affiliate-Links und werden auf der jeweiligen Seite gekennzeichnet.'}
  ]
});
hubs.push({
  key: 'uk-ireland',
  file: 'guides/uk-ireland.html',
  title: 'UK and Ireland buying guides: labels, packs and delivery checks',
  label: 'UK & Ireland',
  lang: 'en-GB',
  nav: false,
  image: 'advanced-amino-formula.jpg',
  description: 'English supplement buying guides for UK and Ireland readers. Compare labels, pack sizes and inspected shipping notes; confirm the live checkout for your address.',
  topics: [],
  groupBy: 'topic',
  select: isUkIrelandGuide,
  groups: [
    ['Supplement labels for UK and Ireland readers', 'These physical-product guides record supplier labels and inspected UK or Ireland checkout notes. They do not establish delivery to every address or to the rest of Europe.', ['wellness']],
    ['Courses and digital tools', 'If a UK or Ireland audience is recorded for a course or software guide, compare language, licence and billing-country terms before paying.', ['business', 'education']],
    ['Travel planning', 'Travel tools still need route, fare and coverage checks for your dates. A UK or Ireland audience note is not a delivery guarantee.', ['travel']]
  ],
  faqs: [
    {q: 'Can I order these supplements anywhere in Europe?', a: 'The recorded audience is the United Kingdom and Ireland. Delivery to other countries is not established on these pages. Confirm the destination and charges at checkout.'},
    {q: 'Does each guide confirm the final shipping total?', a: 'Where a checkout was inspected, that is stated in the guide. Address-level eligibility and the live total still need to be confirmed with the seller.'},
    {q: 'Are these independent lab reviews?', a: 'No. The pages summarise supplier labels and purchase terms. They do not establish clinical effects or replace advice from a qualified health professional.'}
  ]
});
const navHubs = hubs.filter(hub => hub.nav !== false);
const groupKey = (hub, article) => hub.groupBy === 'locale' ? localeOf(article) : hub.groupBy === 'topic' ? article.topic : article.subtopic;
const hubFor = (article) => hubs.find(hub => hub.topics.includes(article.topic));
const guidesFor = (hub) => hub.select ? guides.filter(hub.select) : guides.filter(article => hub.topics.includes(article.topic));
const affiliateMarker = vm.runInNewContext(`${fs.readFileSync('assets/js/articles.js', 'utf8')}\nAFFILIATE_CONFIG.travelPayoutsMarker`);

function bookingLink(article) {
  const url = article.bookingUrl || cleanPath(article.reviewUrl);
  if (article.linkType === 'official' || article.isDirectAffiliate || /advancedbionutritionals\.com|business-kickstart\.de|primeperformpro\.com|myketosana\.com/.test(url) || url.startsWith('topics/') || url.endsWith('.html')) return url;
  return affiliateMarker && affiliateMarker !== 'YOUR_MARKER_ID' ? `https://www.travelpayouts.com/redirect/?marker=${encodeURIComponent(affiliateMarker)}&url=${encodeURIComponent(url)}` : url;
}

function renderCard(article, index) {
  const lang = localeOf(article);
  const guideLabel = lang === 'pt-BR' ? 'Ler o guia' : lang.startsWith('de') ? 'Zum Ratgeber' : 'Read the guide';
  const network = article.network === 'Digistore24' || /(?:digistore24|checkout-ds24)\.com\//.test(article.bookingUrl || '') ? 'digistore24' : '';
  const imageUrl = article.imageUrl?.startsWith('assets/') ? `/${article.imageUrl}` : article.imageUrl;
  const page = cheerio.load(fs.readFileSync(article.reviewUrl, 'utf8'));
  const matchingImage = page('img').filter((i, element) => new URL(page(element).attr('src'), absoluteUrl(`/${article.reviewUrl}`)).href === absoluteUrl(article.imageUrl || '')).first();
  const width = matchingImage.attr('width') || 1200;
  const height = matchingImage.attr('height') || 720;
  const image = imageUrl ? `<img class="post-image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(article.imageAlt || article.title)}" width="${width}" height="${height}" loading="lazy" decoding="async" />` : '';
  const caption = article.imageType === 'editorial' ? `<span class="post-art-label">${lang === 'pt-BR' ? 'Ilustração editorial' : lang.startsWith('de') ? 'Redaktionelle Illustration' : 'Editorial illustration'}</span>` : '';
  const rel = article.linkType === 'official' ? 'noopener noreferrer' : 'noopener sponsored nofollow';
  return `<article class="blog-post" lang="${escapeHtml(lang)}" data-topic="${escapeHtml(article.topic)}" data-locale="${escapeHtml(lang)}" data-market="${escapeHtml(article.market)}" data-europe="${isEuropeanGuide(article)}" data-network="${network}">
  <div class="post-header${image ? ' has-image' : ''}${article.imageType === 'editorial' ? ' editorial-artwork' : ''}">${image}<span class="post-category">${escapeHtml(article.category)}</span>${caption}<span class="post-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></div>
  <div class="post-content"><div class="post-meta"><span class="post-badge">${languages[lang] || lang}</span><span class="post-service-tag">${escapeHtml(article.service)}</span></div>
  <h3><a href="${cleanPath(article.reviewUrl)}">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.summary)}</p>
  ${article.market === 'Europe' ? `<ul class="post-highlights">${(article.highlights || []).map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : ''}
  <div class="post-footer"><a class="text-link" href="${cleanPath(article.reviewUrl)}" aria-label="${escapeHtml(guideLabel + ": " + article.title)}">${guideLabel} <span aria-hidden="true">&#8594;</span></a><a class="btn btn-primary" href="${escapeHtml(bookingLink(article))}" target="_blank" rel="${rel}">${escapeHtml(article.ctaText)} <span aria-hidden="true">&#8599;</span></a></div></div>
</article>`.replace(/[ \t]+$/gm, '');
}

function jsonLd(data) {
  return `<script type="application/ld+json" data-pokisky-seo>${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')}</script>`;
}

function itemList(articles) {
  return { '@type': 'ItemList', itemListElement: articles.map((article, index) => ({'@type': 'ListItem', position: index + 1, name: article.title, url: absoluteUrl(cleanPath(article.reviewUrl))})) };
}

function extractFaqs($) {
  return $('.offer-faq-item, .product-faq-item').toArray().map(element => ({
    q: $(element).find('summary, h3').first().text().replace(/\s+/g, ' ').trim(),
    a: $(element).find('p').first().text().replace(/\s+/g, ' ').trim()
  })).filter(item => item.q && item.a);
}

function faqPage(faqs) {
  if (!faqs || faqs.length < 2) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {'@type': 'Answer', text: item.a}
    }))
  };
}

function renderFaqs(faqs, heading, intro) {
  if (!faqs?.length) return '';
  return `<section id="faq" class="guide-group" aria-labelledby="directory-faq"><h2 id="directory-faq">${escapeHtml(heading)}</h2>${intro ? `<p class="section-intro">${escapeHtml(intro)}</p>` : ''}<div class="offer-faq">${faqs.map(item => `<details class="offer-faq-item"><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join('')}</div></section>`;
}

module.exports = {planningPages, renderPlanningLinks, isEuropeanGuide, isUkIrelandGuide, siteUrl, catalog, guides, hubs, navHubs, languages, localeOf, ogLocaleOf, groupKey, cleanPath, absoluteUrl, escapeHtml, indexable, hubFor, guidesFor, renderCard, jsonLd, itemList, extractFaqs, faqPage, renderFaqs};
