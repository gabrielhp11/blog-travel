/**
 * PokiSky — Main Portal Interaction & Grid Renderer
 */

function buildAffiliateLink(article) {
  if (!article) return '#';
  const url = article.bookingUrl;

  // Direct affiliate links (Digistore24, CleanSeSana, etc.) don't need TravelPayouts wrapper
  if (
    article.isDirectAffiliate ||
    url.includes('advancedbionutritionals.com') ||
    url.includes('cleansesana.com') ||
    url.includes('business-kickstart.de') ||
    url.includes('primeperformpro.com') ||
    url.includes('myketosana.com') ||
    url.startsWith('topics/') ||
    url.endsWith('.html')
  ) {
    return url;
  }

  // TravelPayouts redirection for travel aggregators
  const marker = AFFILIATE_CONFIG ? AFFILIATE_CONFIG.travelPayoutsMarker : 'YOUR_MARKER_ID';
  const target = encodeURIComponent(url);
  return `https://www.travelpayouts.com/redirect/?marker=${marker}&url=${target}`;
}

let activeFilter = 'all';

function renderBlogGrid() {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid || typeof blogArticles === 'undefined') return;

  const filtered = activeFilter === 'all'
    ? blogArticles
    : blogArticles.filter(item => item.topic === activeFilter || item.subtopic === activeFilter);

  blogGrid.innerHTML = filtered
    .map((article) => {
      const themeClass =
        article.subtopic === 'brain-health'
          ? 'brain-theme'
          : article.subtopic === 'ai-training'
            ? 'ai-theme'
            : '';
      const hasImage = Boolean(article.imageUrl);
      const headerClass = ['post-header', themeClass, hasImage ? 'has-image' : '']
        .filter(Boolean)
        .join(' ');
      const headerStyle = hasImage
        ? ` style="background-image: url('${article.imageUrl}');"`
        : '';

      return `
        <article class="blog-post ${article.featured ? 'is-featured' : ''}" data-topic="${article.topic}">
          <div class="${headerClass}"${headerStyle} role="img" aria-label="${article.imageAlt || article.title}">
            <span class="post-category">${article.topic.toUpperCase()} • ${article.category}</span>
          </div>
          <div class="post-content">
            <div class="post-meta">
              <span class="post-badge">${article.audience}</span>
              <span class="post-service-tag">${article.service}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <ul class="post-highlights">
              ${article.highlights.map((h) => `<li>${h}</li>`).join('')}
            </ul>
            <div class="post-footer">
              <a 
                class="text-link" 
                href="${article.reviewUrl}"
              >
                ${article.reviewUrl.endsWith('.html') ? 'Read In-Depth Review →' : 'Quick View'}
              </a>
              <a 
                class="btn btn-primary" 
                href="${buildAffiliateLink(article)}" 
                target="_blank" 
                rel="noopener sponsored nofollow"
              >
                ${article.ctaText}
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function initFilters() {
  const filterButtons = document.querySelectorAll('.topic-filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderBlogGrid();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBlogGrid();
  initFilters();
});
