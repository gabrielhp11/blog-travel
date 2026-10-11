const siteUrl = 'https://blog-travel-eight.vercel.app';
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const clean = file => '/' + file.replace(/\.html$/, '');

function catalogEntry(post, source) {
  return {
    id: post.id, sourceProductId: source.id, editorialPost: true,
    topic: source.topic, subtopic: source.subtopic, locale: post.locale, market: post.market,
    category: post.category, audience: post.audience, title: post.title, summary: post.description,
    highlights: post.facts.map(fact => fact[0]), service: 'Editorial buying checklist',
    ctaText: 'Read the registered product guide', reviewUrl: post.file, bookingUrl: clean(source.reviewUrl),
    imageUrl: post.images[0].src.slice(1), imageAlt: post.images[0].alt, imageType: 'editorial',
    linkType: 'official', isDirectAffiliate: false, featured: false, publishedAt: post.publishedAt
  };
}

function renderPost(post, source) {
  const url = siteUrl + clean(post.file);
  const sourcePath = clean(source.reviewUrl);
  const hub = source.topic === 'wellness' ? 'wellness' : source.topic === 'travel' ? 'travel' : 'courses';
  const figure = index => {
    const image = post.images[index];
    return `<figure class="editorial-figure"><img src="${esc(image.src)}" alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" loading="${index ? 'lazy' : 'eager'}" decoding="async" /><figcaption>Original PokiSky editorial illustration; a planning concept, not official product artwork, a screenshot or evidence of a product test.</figcaption></figure>`;
  };
  return `<!doctype html>
<html lang="${esc(post.locale)}"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(post.title)} | PokiSky</title><meta name="description" content="${esc(post.description)}" />
<meta name="datePublished" content="${post.publishedAt || ''}" /><meta name="dateModified" content="${post.reviewed}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" /><meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(post.description)}" /><meta property="og:url" content="${url}" />
<meta property="og:image" content="${siteUrl + post.images[0].src}" /><meta property="og:image:alt" content="${esc(post.images[0].alt)}" />
<link rel="stylesheet" href="/assets/css/review.css" /><link rel="stylesheet" href="/assets/css/editorial.css" /><link rel="stylesheet" href="/assets/css/editorial-posts.css" />
</head><body class="editorial-page page-editorial-post">
<a class="skip-link" href="#main-content">Skip to content</a>
<header class="topbar"><div class="container nav"><a href="/" class="brand"><span class="brand-mark" aria-hidden="true">P</span><span>PokiSky</span></a><nav class="nav-links" aria-label="Main navigation"><a href="/guides/${hub}">Browse guides</a><a href="/guides/europe">Europe</a><a href="/affiliate-disclosure">Disclosure</a></nav></div></header>
<main id="main-content"><article>
<section class="hero"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/guides/${hub}">Buying guides</a><span aria-hidden="true">/</span><span>${esc(post.category)}</span></nav>
<div class="hero-grid"><div class="hero-copy"><p class="eyebrow">${esc(post.eyebrow)}</p><h1>${esc(post.title)}</h1>
<p class="seo-author">By <a href="/affiliate-disclosure">PokiSky Editorial Desk</a></p><p class="lead">${esc(post.lead)}</p>
<div class="cta-row"><a class="btn btn-primary" href="${sourcePath}">Read the ${esc(post.productName)} buying guide →</a><a class="btn btn-secondary" href="#checklist">Use the checklist</a></div>
<div class="trust-badge-row"><span>Source-based reading</span><span>Practical buying checklist</span><span>No independent product test</span></div>
<div class="review-meta"><span>Published <time datetime="${post.publishedAt || ''}">${post.publishedAt || 'Draft'}</time></span><span>Sources checked <time datetime="${post.reviewed}">${post.reviewed}</time></span></div>
<p class="editorial-disclosure">This article leads to our registered product guide. ${esc(post.disclosure)} <a href="/affiliate-disclosure">Read our editorial standards and affiliate disclosure</a>.</p>
</div><aside class="product-card">${figure(0)}<div class="product-body"><p class="eyebrow">Before you decide</p><h2>${esc(post.productName)}</h2><div class="product-facts">${post.facts.map(([key, value]) => `<div class="product-fact"><strong>${esc(key)}</strong><span>${esc(value)}</span></div>`).join('')}</div></div></aside></div></div></section>
${post.sections.map((section, index) => `<section class="editorial-section${index % 2 ? ' editorial-tint' : ''}"><div class="container editorial-narrow"><h2>${esc(section.title)}</h2>${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${index === 0 ? figure(1) : index === 1 ? figure(2) : ''}</div></section>`).join('\n')}
<section id="checklist" class="editorial-section"><div class="container editorial-narrow"><p class="eyebrow">A practical decision</p><h2>${esc(post.checklistTitle)}</h2><ol class="editorial-list">${post.checklist.map(item => `<li>${esc(item)}</li>`).join('')}</ol><div class="cta-block"><div><h2>Continue with the registered buying guide</h2><p>${esc(post.next)}</p></div><a class="btn btn-primary" href="${sourcePath}">Read the ${esc(post.productName)} guide →</a></div></div></section>
<section class="editorial-section editorial-tint"><div class="container editorial-narrow"><h2>Questions before choosing</h2><div class="product-faq">${post.faqs.map(([q,a]) => `<div class="product-faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}</div></div></section>
<section class="editorial-section editorial-source"><div class="container editorial-narrow"><h2>Sources and method</h2><p>${esc(post.method)}</p><ul>${post.sources.map(([name,href]) => `<li><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a></li>`).join('')}</ul><p>Public sources checked ${post.reviewed}. Prices, access and purchase terms can change; the buyer must confirm the current offer. <a href="${sourcePath}">Our registered ${esc(post.productName)} guide</a> provides further context.</p></div></section>
</article></main><footer class="footer"><div class="container footer-inner"><p>PokiSky · Independent product and course guides.</p><p><a href="/affiliate-disclosure">Affiliate disclosure and editorial standards</a></p></div></footer>
</body></html>\n`;
}
module.exports = {renderPost, catalogEntry};
