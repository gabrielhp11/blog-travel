# PokiSky — Direct Travel Picks. No Friction.

A minimal, elegant travel blog built for direct booking and affiliate conversion via GitHub Pages.

## What is PokiSky?

PokiSky is a streamlined travel recommendation platform that:
- Recommends **one travel idea at a time** (flights, hotels, escapes)
- **Targets specific audiences** (professionals, families, nomads, couples, luxury, budget)
- **Converts directly** with clear, fast booking flows
- **Works globally** with no geographic barriers
- Uses **affiliate tracking** from Travel Payouts for commission-based revenue

## Structure

```
.
├── index.html       # Landing page + blog grid
├── styles.css       # Design system & layout
├── blog.js          # Article data & affiliate link builder
└── README.md        # This file
```

## How to publish

1. Push this repository to GitHub (already done at `gabrielhp11/blog-travel`)
2. Go to your repository **Settings**
3. Navigate to **Pages**
4. Select:
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** / (root)
5. Click **Save**
6. Your site will be published at: `https://gabrielhp11.github.io/blog-travel/`

## Setup Travel Payouts Integration

1. Get your **Affiliate Marker ID** from [Travel Payouts Dashboard](https://app.travelpayouts.com/dashboard)
2. Open `blog.js`
3. Replace `YOUR_MARKER_ID` with your actual marker:

```javascript
const AFFILIATE_MARKER = 'your_actual_marker_id_here';
```

4. Commit and push the change
5. All "Book now" buttons will now track conversions to your Travel Payouts account

## How affiliate links work

Each CTA button generates a link like:

```
https://www.travelpayouts.com/redirect/?marker=YOUR_MARKER&url=https%3A%2F%2Fwww.booking.com%2F...
```

- User clicks the CTA button
- Redirected through Travel Payouts (tracks the click)
- Lands on the booking page
- If they book → commission credited to your account

## Customizing blog articles

Edit the `blogArticles` array in `blog.js` to:
- Change article titles and descriptions
- Update highlights/key points
- Adjust audience targeting
- Modify booking URLs

Example:

```javascript
const blogArticles = [
  {
    id: 1,
    category: 'Flights',
    audience: '💼 Busy professionals',
    title: 'Your custom title here',
    summary: 'Your description here',
    highlights: [
      'Point 1',
      'Point 2',
      'Point 3'
    ],
    service: 'Flights',
    ctaText: 'Your CTA button text',
    bookingUrl: 'https://booking-url-here.com',
  },
  // ... more articles
];
```

## Target audiences

PokiSky is built for:
- 💼 **Busy professionals** — Quick escapes, premium but fast
- 👨‍👩‍👧‍👦 **Families** — Beach weeks, resorts, easy transfers
- 🌐 **Digital nomads** — Long stays (7+ nights), good Wi-Fi, affordable
- 💑 **Couples** — Romantic, quiet, high-value
- ✨ **Luxury seekers** — Premium without overpaying
- 💰 **Smart savers** — Low cost, high feeling

Each article targets one audience + one service (Flights, Hotels, Stays, Escapes, Luxury, Deals).

## Design philosophy

- **Minimal:** Focus on clarity, not decoration
- **Direct:** Every link leads to booking
- **Elegant:** Professional typography, restrained color palette
- **Fast:** Static HTML, no database required
- **Global:** No geographic restrictions

## Color palette

- **Background:** `#f3efe9` (warm cream)
- **Paper:** `#ffffff` (white)
- **Text:** `#151718` (dark ink)
- **Accent:** `#0d5b48` (forest green)
- **Muted:** `#5c6368` (gray)

## Tech stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Hosting:** GitHub Pages (free)
- **Affiliate tracking:** Travel Payouts API
- **Font:** Inter (Google Fonts)

## Revenue model

1. Write targeted travel articles
2. Each article links to booking via affiliate marker
3. Reader clicks "Find flights" / "Browse resorts" / etc.
4. Commission tracked by Travel Payouts
5. Booking confirmed → Commission credited
6. Monthly payout to your account

No per-click cost. No subscription. Just commission on actual bookings.

## Tips for maximizing conversions

- Keep headlines clear and specific
- Use emoji sparingly but effectively (signals audience)
- Match content to audience needs
- Test different CTA text ("Find flights" vs. "Book now")
- Update articles weekly based on trending destinations
- Monitor which audiences/services convert best
- A/B test booking URLs for higher commission rates

## Support & resources

- [Travel Payouts API Docs](https://www.travelpayouts.com/developers/api)
- [Travel Payouts Dashboard](https://app.travelpayouts.com/dashboard)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

**PokiSky**  
Direct travel. No friction.  
Built for travelers who value their time.