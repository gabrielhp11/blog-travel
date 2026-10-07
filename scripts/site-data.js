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
    ['Family and school learning', 'Compare the outline with your family’s questions and local school context. Check delivery format, access, individual support and refund conditions; courses do not assess a particular child or guarantee educational outcomes.', ['family-learning']],
    ['Learning about dogs', 'Compare the course topic with your own dog and questions. Check the teaching language, access period and whether individual support is included. A video course does not assess your particular situation or guarantee changes in behaviour.', ['pet-learning']]
  ]},
  {key: 'wellness', file: 'guides/wellness.html', title: 'Supplement buyer guides: labels, formats and seller claims', label: 'Wellness', description: 'Browse source-based supplement guides. Compare label information, serving formats, pack sizes and seller claims before discussing suitability with a health professional.', topics: ['wellness'], groups: [
    ['Formats and label details', 'Compare the current full label, ingredient amounts, serving directions, warnings and pack sizes. Similar names or shared ingredients do not establish equivalent products or effects.', ['longevity', 'nutrition', 'vision-health']],
    ['Seller-described formulas', 'Read claims separately from the ingredient list. These guides summarise public seller information and do not establish clinical effectiveness or replace a qualified health professional.', ['brain-health', 'gut-health', 'mens-health', 'metabolic-health']]
  ]}
];
const hubFor = (article) => hubs.find(hub => hub.topics.includes(article.topic));
const guidesFor = (hub) => guides.filter(article => hub.topics.includes(article.topic));
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
  return `<article class="blog-post" lang="${escapeHtml(lang)}" data-topic="${escapeHtml(article.topic)}" data-locale="${escapeHtml(lang)}" data-market="${escapeHtml(article.market)}" data-network="${network}">
  <div class="post-header${image ? ' has-image' : ''}${article.imageType === 'editorial' ? ' editorial-artwork' : ''}">${image}<span class="post-category">${escapeHtml(article.category)}</span>${caption}<span class="post-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></div>
  <div class="post-content"><div class="post-meta"><span class="post-badge">${languages[lang] || lang}</span><span class="post-service-tag">${escapeHtml(article.service)}</span></div>
  <h3><a href="${cleanPath(article.reviewUrl)}">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.summary)}</p>
  ${article.market === 'Europe' ? `<ul class="post-highlights">${(article.highlights || []).map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : ''}
  <div class="post-footer"><a class="text-link" href="${cleanPath(article.reviewUrl)}">${guideLabel} <span aria-hidden="true">&#8594;</span></a><a class="btn btn-primary" href="${escapeHtml(bookingLink(article))}" target="_blank" rel="${rel}">${escapeHtml(article.ctaText)} <span aria-hidden="true">&#8599;</span></a></div></div>
</article>`.replace(/[ \t]+$/gm, '');
}

function jsonLd(data) {
  return `<script type="application/ld+json" data-pokisky-seo>${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')}</script>`;
}

function itemList(articles) {
  return { '@type': 'ItemList', itemListElement: articles.map((article, index) => ({'@type': 'ListItem', position: index + 1, name: article.title, url: absoluteUrl(cleanPath(article.reviewUrl))})) };
}

module.exports = {siteUrl, catalog, guides, hubs, languages, localeOf, cleanPath, absoluteUrl, escapeHtml, indexable, hubFor, guidesFor, renderCard, jsonLd, itemList};
