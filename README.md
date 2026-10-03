# PokiSky — Direct Travel, Wellness & Longevity Picks

A minimal, high-conversion affiliate publication and review platform hosted seamlessly on **Vercel** (`https://blog-travel-eight.vercel.app/`) and **GitHub Pages**.

---

## 📁 Project Architecture & Folder Organization

The project is structured into modular topics, subtopics, and centralized assets to keep the codebase clean, organized, and scalable as dozens of affiliate products are onboarded:

```
blog-travel/
├── index.html                           # Main portal (hero, topic filters, dynamic grid)
├── cleansesana.html                     # Backward-compatible redirect to gut-health review
├── vercel.json                          # Vercel routing rules & clean URLs configuration
├── README.md                            # Comprehensive project documentation & SOP
│
├── assets/                              # Centralized reusable static assets
│   ├── css/
│   │   ├── main.css                     # Primary portal styling (layout, grid, filters)
│   │   └── review.css                   # Reusable editorial review layout (Forbes / Robb Report style)
│   └── js/
│       ├── articles.js                  # Central database of all articles & affiliate offers
│       └── main.js                      # Dynamic grid rendering, filters & affiliate routing
│
└── topics/                              # Vertical topics and subtopics
    ├── wellness/                        # Vertical: Health, Wellness & Longevity
    │   ├── brain-health/                # Subtopic: Cognitive Performance & Nootropics
    │   │   └── advanced-memory-formula.html  # In-depth editorial review (Nobel Prize science)
    │   ├── mens-health/                 # Subtopic: Male Vitality & Hormonal Support
    │   │   └── prime-perform-pro.html   # Editorial review for Prime Perform Pro
    │   └── gut-health/                  # Subtopic: Digestive Health & Bloat Relief
    │       └── cleansesana.html         # Editorial review page for CleanSeSana
    │
    └── travel/                          # Vertical: Curated Travel Escapes
        ├── flights/                     # Subtopic: Fast 48h city resets
        ├── stays/                       # Subtopic: Remote work & digital nomad stays
        ├── escapes/                     # Subtopic: Romantic couples retreats
        ├── luxury/                      # Subtopic: Premium 5-star airport-to-resort
        └── deals/                       # Subtopic: High-value budget curation
```

---

## 📊 Active Affiliate Offers & Registry

| Product / Offer | Vertical | Subtopic | Network | Target Page / Review | Direct Affiliate Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Advanced Memory Formula** | Wellness | `brain-health` | Digistore24 | `topics/wellness/brain-health/advanced-memory-formula.html` | [Affiliate Link](https://www.advancedbionutritionals.com/DS24/Advanced-Memory/Nobel-Prize-Winning-Memory-Breakthroughs/HD.htm#aff=gabrielhenriquep123f97e) |
| **Prime Perform Pro** | Wellness | `mens-health` | Digistore24 | `topics/wellness/mens-health/prime-perform-pro.html` | [Affiliate Link](https://primeperformpro.com/principal/#aff=gabrielhenriquep123f97e) |
| **CleanSeSana** | Wellness | `gut-health` | Direct | `topics/wellness/gut-health/cleansesana.html` | [Affiliate Link](https://cleansesana.com/cleansesana-pdp-fe#aff=gabrielhenriquep123f97e) |
| **Aviasales Flights** | Travel | `flights` | TravelPayouts | Root Portal CTA | Aggregator link with marker |
| **Booking.com Stays** | Travel | `stays` | TravelPayouts | Root Portal CTA | Aggregator link with marker |

---

## 🚀 Standard Operating Procedure (SOP): Adding a New Affiliate Product

Whenever you receive or select a new affiliate link, follow this 3-step protocol:

### Step 1: Create the Review Page
1. Duplicate one of the existing review pages or use `assets/css/review.css`:
   - For brain health / nootropics: see `topics/wellness/brain-health/advanced-memory-formula.html`
   - For wellness / gut health: see `topics/wellness/gut-health/cleansesana.html`
2. Save your file in the appropriate directory:
   `topics/<vertical>/<subtopic>/<product-slug>.html`
3. Link your affiliate link to the primary CTA buttons with `rel="noopener sponsored nofollow"`.

### Step 2: Register in `assets/js/articles.js`
Add a new object to the `blogArticles` array:

```javascript
{
  id: 9,
  topic: 'wellness', // or 'travel'
  subtopic: 'longevity',
  category: 'Cellular Health',
  audience: '🔬 Longevity Seekers',
  title: 'Your Article Title Here',
  summary: 'Compelling 2-sentence summary focusing on biological benefit or lifestyle upgrade.',
  highlights: [
    'Key clinical feature 1',
    'Key clinical feature 2',
    'Guarantee or purity standard'
  ],
  service: 'Nutraceuticals',
  ctaText: 'Claim Verified Formula',
  reviewUrl: 'topics/wellness/longevity/your-product.html',
  bookingUrl: 'https://affiliate-network.com/offer#aff=YOUR_ID',
  isDirectAffiliate: true,
  featured: true
}
```

### Step 3: Deploy to Vercel & GitHub
Commit and push the changes:
```bash
git add .
git commit -m "feat(content): add [Product Name] review under topics/[category]"
git push origin main
```
Vercel automatically builds and updates the live site in under 60 seconds!

---

## 🌐 Live URLs

* **Vercel Production:** [blog-travel-eight.vercel.app](https://blog-travel-eight.vercel.app/)
* **GitHub Repository:** [github.com/gabrielhp11/blog-travel](https://github.com/gabrielhp11/blog-travel)
* **Advanced Memory Formula Review:** [blog-travel-eight.vercel.app/topics/wellness/brain-health/advanced-memory-formula.html](https://blog-travel-eight.vercel.app/topics/wellness/brain-health/advanced-memory-formula.html)
* **CleanSeSana Review:** [blog-travel-eight.vercel.app/topics/wellness/gut-health/cleansesana.html](https://blog-travel-eight.vercel.app/topics/wellness/gut-health/cleansesana.html)

---

**PokiSky** — Direct picks. No friction. Curated for readers who value their time and wellbeing.