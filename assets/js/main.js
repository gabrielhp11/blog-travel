/** PokiSky guide library interactions. */

function buildAffiliateLink(article) {
  if (!article || !article.bookingUrl) return '#';
  const url = article.bookingUrl;
  // Official listings must stay untracked until a partnership is configured.
  if (article.linkType === 'official') return url;
  if (
    article.isDirectAffiliate ||
    url.includes('advancedbionutritionals.com') ||
    url.includes('business-kickstart.de') ||
    url.includes('primeperformpro.com') ||
    url.includes('myketosana.com') ||
    url.startsWith('topics/') ||
    url.endsWith('.html')
  ) return url;

  const marker = typeof AFFILIATE_CONFIG !== 'undefined' ? AFFILIATE_CONFIG.travelPayoutsMarker : '';
  if (!marker || marker === 'YOUR_MARKER_ID') return url;
  return `https://www.travelpayouts.com/redirect/?marker=${marker}&url=${encodeURIComponent(url)}`;
}

let activeFilter = 'all';

function renderBlogGrid() {
  const grid = document.getElementById('blog-grid');
  if (!grid || typeof blogArticles === 'undefined') return;

  const guides = blogArticles.filter((item) => !item.hidden && item.reviewUrl && !item.reviewUrl.startsWith('#'));
  const filtered = activeFilter === 'all'
    ? guides
    : guides.filter((item) => activeFilter === 'europe'
      ? item.market === 'Europe' && item.locale === 'en-GB'
      : activeFilter === 'digistore24'
        ? item.network === 'Digistore24' || /(?:digistore24|checkout-ds24)\.com\//.test(item.bookingUrl || '')
        : activeFilter === 'business'
          ? item.topic === 'business' || item.topic === 'education'
          : item.topic === activeFilter || item.subtopic === activeFilter);

  const count = document.getElementById('guide-count');
  if (count) {
    const portuguese = filtered.length > 0 && filtered.every((item) => item.locale === 'pt-BR');
    count.textContent = portuguese
      ? `${filtered.length} ${filtered.length === 1 ? 'guia' : 'guias'}`
      : `${filtered.length} ${filtered.length === 1 ? 'guide' : 'guides'}`;
  }

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">No guides are available in this category yet.</p>';
    return;
  }

  grid.innerHTML = filtered.map((article, index) => {
    const hasImage = Boolean(article.imageUrl);
    const headerClass = ['post-header', hasImage ? 'has-image' : '', article.imageType === 'editorial' ? 'editorial-artwork' : ''].filter(Boolean).join(' ');
    const headerStyle = hasImage ? ` style="background-image:url('${article.imageUrl}');"` : '';
    const portuguese = article.locale === 'pt-BR';
    const category = article.locale ? article.category : (article.topic === 'business' ? 'Courses & skills' : article.category);
    const topicLabel = article.topic === 'travel' ? (portuguese ? 'Viagens' : 'Travel') :
      (portuguese ? (article.subtopic === 'retro-gaming' ? 'Jogos' : (article.subtopic === 'accessories-business' ? 'Negócios' : (article.topic === 'wellness' ? 'Bem-estar' : 'Cursos'))) : (article.topic === 'business' || article.topic === 'education' ? 'Learning' : 'Wellness'));
    const linkRel = article.linkType === 'official' ? 'noopener noreferrer' : 'noopener sponsored nofollow';
    const highlights = article.market === 'Europe' ? `<ul class="post-highlights">${article.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}</ul>` : '';
    const guideUrl = article.reviewUrl.endsWith('.html') ? article.reviewUrl : `${article.reviewUrl}.html`;
    return `
      <article class="blog-post" data-topic="${article.topic}">
        <div class="${headerClass}"${headerStyle} role="img" aria-label="${article.imageAlt || `${article.title} guide artwork`}">
          <span class="post-category">${category}</span>
          <span class="post-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        </div>
        <div class="post-content">
          <div class="post-meta"><span class="post-badge">${topicLabel}</span><span class="post-service-tag">${article.service}</span></div>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          ${highlights}
          <div class="post-footer">
            <a class="text-link" href="${guideUrl}">${portuguese ? 'Ler o guia' : 'Read the guide'} <span aria-hidden="true">→</span></a>
            <a class="btn btn-primary" href="${buildAffiliateLink(article)}" target="_blank" rel="${linkRel}">${article.ctaText} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </article>`;
  }).join('');
}

function initFilters() {
  const buttons = document.querySelectorAll('.topic-filter-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      activeFilter = button.dataset.filter || 'all';
      renderBlogGrid();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBlogGrid();
  initFilters();
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
