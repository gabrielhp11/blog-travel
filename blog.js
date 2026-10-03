const AFFILIATE_MARKER = 'YOUR_MARKER_ID'; // Replace with your Travel Payouts marker

const blogArticles = [
  {
    id: 1,
    category: 'Flights',
    audience: '💼 Busy professionals',
    title: '48-hour city breaks that feel premium',
    summary: 'Fast escapes with smart flight timing, lower fares, and a clean route to a short luxury reset.',
    highlights: [
      'Under $300 round-trip flights',
      'Perfect for long weekends',
      'Quick, high-value cities'
    ],
    service: 'Flights',
    ctaText: 'Find flights',
    bookingUrl: 'https://www.aviasales.com',
  },
  {
    id: 2,
    category: 'Hotels',
    audience: '👨‍👩‍👧‍👦 Families',
    title: 'Beach weeks with easy transfers and space',
    summary: 'Simple, low-friction family travel: resort stays, airport convenience, and lower-stress booking flows.',
    highlights: [
      'Family-friendly resorts',
      'Easy airport access',
      'Kids activities included'
    ],
    service: 'Hotels',
    ctaText: 'Browse resorts',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Cancun',
  },
  {
    id: 3,
    category: 'Stays',
    audience: '🌐 Digital nomads',
    title: '7-night stays built for work and calm',
    summary: 'Hotels with desks, strong connectivity, and affordable weekly rates. Long stays that support your remote routine.',
    highlights: [
      'Strong Wi-Fi guaranteed',
      'Work-friendly spaces',
      'Weekly discounts available'
    ],
    service: 'Stays',
    ctaText: 'See remote-work stays',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Lisbon',
  },
  {
    id: 4,
    category: 'Escapes',
    audience: '💑 Couples',
    title: 'Romantic escapes with a fast booking flow',
    summary: 'Short, high-value trips for couples who want atmosphere, comfort, and fewer planning steps. Direct to the moment.',
    highlights: [
      'Intimate settings',
      'Premium atmosphere',
      'Seamless booking'
    ],
    service: 'Escapes',
    ctaText: 'Find romantic escapes',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Rome',
  },
  {
    id: 5,
    category: 'Luxury',
    audience: '✨ Premium travelers',
    title: 'Airport-to-resort without friction',
    summary: 'Premium stays with clear value, easier transfers, and more comfort at a better total price. Luxury without overpaying.',
    highlights: [
      'Premium accommodations',
      'Seamless transfers',
      'Best value for luxury'
    ],
    service: 'Luxury',
    ctaText: 'Browse luxury stays',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Dubai',
  },
  {
    id: 6,
    category: 'Deals',
    audience: '💰 Smart savers',
    title: 'Low-cost weekends that feel like an upgrade',
    summary: 'Short escapes that keep spending low without cutting the experience, timing, or comfort. Value-first travel.',
    highlights: [
      'Under $200 total',
      'High-quality stays',
      'Smart savings everywhere'
    ],
    service: 'Deals',
    ctaText: 'Find budget deals',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Prague',
  },
];

function buildAffiliateLink(url) {
  const target = encodeURIComponent(url);
  return `https://www.travelpayouts.com/redirect/?marker=${AFFILIATE_MARKER}&url=${target}`;
}

function renderBlogGrid() {
  const blogGrid = document.getElementById('blog-grid');

  blogGrid.innerHTML = blogArticles
    .map(
      (article) => `
        <article class="blog-post">
          <div class="post-header">
            <span class="post-category">${article.category}</span>
          </div>
          <div class="post-content">
            <div class="post-meta">
              <span class="post-badge">${article.audience}</span>
              <span>${article.service}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <ul class="post-highlights">
              ${article.highlights.map(h => `<li>• ${h}</li>`).join('')}
            </ul>
            <div class="post-footer">
              <a class="text-link" href="#recent">Read more</a>
              <a 
                class="btn btn-primary" 
                href="${buildAffiliateLink(article.bookingUrl)}" 
                target="_blank" 
                rel="noopener sponsored nofollow"
              >
                ${article.ctaText}
              </a>
            </div>
          </div>
        </article>
      `,
    )
    .join('');
}

renderBlogGrid();