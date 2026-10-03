const AFFILIATE_MARKER = 'YOUR_MARKER_ID';

const posts = [
  {
    category: 'Flights',
    audience: 'Busy professionals',
    title: '48-hour city breaks that still feel premium',
    summary:
      'Fast escapes with smart flight timing, lower fares, and a clean route to a short luxury reset.',
    service: 'Flights',
    url: 'https://www.booking.com/searchresults.html?ss=Paris',
  },
  {
    category: 'Family',
    audience: 'Families',
    title: 'Beach weeks with easy transfers and more space',
    summary:
      'Simple, low-friction family travel: resort stays, airport convenience, and lower-stress booking flows.',
    service: 'Hotels',
    url: 'https://www.booking.com/searchresults.html?ss=Cancun',
  },
  {
    category: 'Remote work',
    audience: 'Digital nomads',
    title: '7-night stays built for work, calm, and a good Wi‑Fi signal',
    summary:
      'Hotels with desks, strong connectivity, and affordable weekly rates for long stays.',
    service: 'Stays',
    url: 'https://www.booking.com/searchresults.html?ss=Lisbon',
  },
  {
    category: 'Couples',
    audience: 'Couples',
    title: 'Romantic escapes with a fast booking flow',
    summary:
      'Short, high-value trips for couples who want atmosphere, comfort, and fewer planning steps.',
    service: 'Escapes',
    url: 'https://www.booking.com/searchresults.html?ss=Rome',
  },
  {
    category: 'Luxury',
    audience: 'Premium travelers',
    title: 'Airport-to-resort travel without the usual friction',
    summary:
      'Premium stays with clear value, easier transfers, and more comfort at a better total price.',
    service: 'Luxury',
    url: 'https://www.booking.com/searchresults.html?ss=Dubai',
  },
  {
    category: 'Budget',
    audience: 'Smart savers',
    title: 'Low-cost weekends that still feel like an upgrade',
    summary:
      'Short escapes that keep spending low without cutting the experience, timing, or comfort.',
    service: 'Deals',
    url: 'https://www.booking.com/searchresults.html?ss=Prague',
  },
];

function buildAffiliateLink(url) {
  const target = encodeURIComponent(url);
  return `https://www.travelpayouts.com/redirect/?marker=${AFFILIATE_MARKER}&url=${target}`;
}

function renderPosts() {
  const postsContainer = document.getElementById('posts');

  postsContainer.innerHTML = posts
    .map(
      (post) => `
        <article class="post-card">
          <div class="post-media">
            <strong>${post.category}</strong>
          </div>
          <div class="post-body">
            <div class="meta">
              <span class="badge">${post.audience}</span>
              <span>${post.service}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <div class="card-footer">
              <a class="post-link" href="#">Direct offer</a>
              <a class="btn btn-primary" href="${buildAffiliateLink(post.url)}" target="_blank" rel="noopener sponsored nofollow">Book now</a>
            </div>
          </div>
        </article>
      `,
    )
    .join('');
}

renderPosts();
