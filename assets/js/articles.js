/**
 * PokiSky — Central Affiliate Articles & Offers Database
 * Organized by Major Topic and Subtopics for seamless scalability.
 */

const AFFILIATE_CONFIG = {
  travelPayoutsMarker: 'YOUR_MARKER_ID',
  defaultNetwork: 'custom',
};

const blogArticles = [
  {
    id: 1,
    topic: 'wellness',
    subtopic: 'brain-health',
    category: 'Brain Health',
    audience: '🧠 High Performers & 50+',
    title: 'The Nobel-Prize Science of Staying Sharp: Advanced Memory Formula',
    summary:
      'Why modern neuroscience points to NGF and BDNF as the biological keys to preserving lifelong cognitive agility, rapid recall, and mental clarity.',
    highlights: [
      '11 clinically backed neuro-nutrients in therapeutic doses',
      'Stimulates Nerve Growth Factor (NGF) and BDNF pathways',
      'Endorsed by Dr. Frank Shallenberger, MD (44+ years clinical experience)',
      '90-Day "Down-to-the-last-pill" unconditional refund guarantee'
    ],
    service: 'Nootropics & Longevity',
    ctaText: 'Claim Verified Formula',
    reviewUrl: 'topics/wellness/brain-health/advanced-memory-formula.html',
    bookingUrl:
      'https://www.advancedbionutritionals.com/DS24/Advanced-Memory/Nobel-Prize-Winning-Memory-Breakthroughs/HD.htm#aff=gabrielhenriquep123f97e',
    isDirectAffiliate: true,
    featured: true,
  },
  {
    id: 2,
    topic: 'wellness',
    subtopic: 'gut-health',
    category: 'Gut Health',
    audience: '💚 Health-Conscious Travelers',
    title: 'Travel Ready: Natural Digestive Support for On-The-Go',
    summary:
      'Bloating, irregular digestion, and travel fatigue can derail any itinerary. CleanSeSana supports gentle gut rhythm and cellular detoxification without harsh stimulants.',
    highlights: [
      'Natural plant-based fiber & probiotic complex',
      'Noticeable reduction in digestive bloating in 2–4 weeks',
      'Convenient daily capsule routine designed for travelers'
    ],
    service: 'Digestive Wellness',
    ctaText: 'Get CleanSeSana',
    reviewUrl: 'topics/wellness/gut-health/cleansesana.html',
    bookingUrl:
      'https://cleansesana.com/cleansesana-pdp-fe#aff=gabrielhenriquep123f97e',
    isDirectAffiliate: true,
    featured: true,
  },
  {
    id: 9,
    topic: 'wellness',
    subtopic: 'mens-health',
    category: "Men's Vitality",
    audience: '⚡ Men 35+ & High Performers',
    title: 'The Science of Sustained Male Vitality: Prime Perform Pro',
    summary:
      'How clinical botanicals like Tongkat Ali, Epimedium, and Boron Chelate liberate free testosterone and restore bedroom confidence without synthetic chemicals.',
    highlights: [
      '100% natural botanical androgenic matrix',
      'Supports free testosterone, pelvic blood flow, and stamina',
      'Protects prostate wellness with Saw Palmetto and Nettle Root',
      '60-Day unconditional money-back guarantee'
    ],
    service: 'Hormonal Mastery',
    ctaText: 'Explore Prime Perform',
    reviewUrl: 'topics/wellness/mens-health/prime-perform-pro.html',
    bookingUrl:
      'https://primeperformpro.com/principal/#aff=gabrielhenriquep123f97e',
    isDirectAffiliate: true,
    featured: true,
  },
  {
    id: 3,
    topic: 'travel',
    subtopic: 'flights',
    category: 'Flights',
    audience: '💼 Busy Professionals',
    title: '48-hour city breaks that feel premium',
    summary:
      'Fast escapes with smart flight timing, lower fares, and a clean route to a short luxury reset without vacation lag.',
    highlights: [
      'Under $300 round-trip flights',
      'Optimized for long weekend itineraries',
      'High-impact culture & culinary destinations'
    ],
    service: 'Aviation',
    ctaText: 'Find flights',
    reviewUrl: '#recent',
    bookingUrl: 'https://www.aviasales.com',
    isDirectAffiliate: false,
    featured: false,
  },
  {
    id: 4,
    topic: 'travel',
    subtopic: 'stays',
    category: 'Hotels',
    audience: '👨‍👩‍👧‍👦 Families',
    title: 'Beach weeks with easy transfers and space',
    summary:
      'Simple, low-friction family travel: resort stays, airport convenience, and lower-stress booking flows designed for all ages.',
    highlights: [
      'Family-friendly resort suites',
      'Effortless airport transfer logistics',
      'Kids activities & private beach access included'
    ],
    service: 'Hotels & Resorts',
    ctaText: 'Browse resorts',
    reviewUrl: '#recent',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Cancun',
    isDirectAffiliate: false,
    featured: false,
  },
  {
    id: 5,
    topic: 'travel',
    subtopic: 'stays',
    category: 'Stays',
    audience: '🌐 Digital Nomads',
    title: '7-night stays built for work and calm',
    summary:
      'Hotels and boutique apartments with dedicated ergonomic desks, high-speed fiber connectivity, and generous weekly rates.',
    highlights: [
      'Verified high-speed Wi-Fi',
      'Quiet, dedicated workspaces',
      'Extended-stay weekly savings'
    ],
    service: 'Remote Work Stays',
    ctaText: 'See remote-work stays',
    reviewUrl: '#recent',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Lisbon',
    isDirectAffiliate: false,
    featured: false,
  },
  {
    id: 6,
    topic: 'travel',
    subtopic: 'escapes',
    category: 'Escapes',
    audience: '💑 Couples',
    title: 'Romantic escapes with a fast booking flow',
    summary:
      'Short, high-value getaways for couples who want intimate atmosphere, comfort, and minimal planning friction.',
    highlights: [
      'Handpicked intimate boutique properties',
      'Atmospheric sunset dining locations',
      'Instant confirmed reservation flow'
    ],
    service: 'Couples Retreats',
    ctaText: 'Find romantic escapes',
    reviewUrl: '#recent',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Rome',
    isDirectAffiliate: false,
    featured: false,
  },
  {
    id: 7,
    topic: 'travel',
    subtopic: 'luxury',
    category: 'Luxury',
    audience: '✨ Premium Travelers',
    title: 'Airport-to-resort without the friction',
    summary:
      'Premium stays with clear value, seamless private transfers, and bespoke comfort at superior total pricing. Luxury without overpaying.',
    highlights: [
      '5-star verified accommodations',
      'Dedicated concierge and chauffeur options',
      'Exclusive club lounge privileges'
    ],
    service: 'Luxury Stays',
    ctaText: 'Browse luxury stays',
    reviewUrl: '#recent',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Dubai',
    isDirectAffiliate: false,
    featured: false,
  },
  {
    id: 8,
    topic: 'travel',
    subtopic: 'deals',
    category: 'Deals',
    audience: '💰 Smart Savers',
    title: 'Low-cost weekends that feel like an upgrade',
    summary:
      'Short escapes that keep spending low without sacrificing design, central location, or comfort. Value-first travel curation.',
    highlights: [
      'High-impact stays under $200 total',
      'Boutique budget hotel curation',
      'Smart transit and culinary city guides'
    ],
    service: 'Smart Deals',
    ctaText: 'Find budget deals',
    reviewUrl: '#recent',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Prague',
    isDirectAffiliate: false,
    featured: false,
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { blogArticles, AFFILIATE_CONFIG };
}
