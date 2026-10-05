# PokiSky

PokiSky is an English-language publication for source-based product guides, AI course overviews, and travel ideas. The static site is hosted on Vercel at <https://blog-travel-eight.vercel.app/>.

## Site structure

- `index.html` is the publication home page and renders the catalog from `assets/js/articles.js`.
- `topics/` contains the individual product guides and offer-status pages.
- `assets/css/review.css` provides the shared product-page layout; `assets/css/editorial.css` supplies the editorial sections; each product stylesheet sets its own palette.
- `assets/images/products/` contains product images used on the site. Do not use one product’s packaging to represent another product.
- `affiliate-disclosure.html` explains the affiliate relationship and editorial standards.
- `robots.txt` and `sitemap.xml` describe crawlable public pages.

## Public product guides

The current catalog links to these named guides:

- KI-Training — Business Kickstart’s AI training
- Aivatar Academy — AI-avatar training
- Hook Mastery — marketing-copy course
- Advanced Memory Formula
- KetoSana
- Advanced Collagen Plus
- VigorSana
- Prime Perform Pro
- SpartaMax

Other offer pages are paused and marked `noindex` until the exact product, seller, current product information, and destination can be confirmed. Paused offers should not be linked from the public catalog.

## Editorial standards

- Identify seller claims as seller claims. Do not present them as independently verified results.
- Do not invent first-hand testing, ratings, endorsements, customer quotations, ingredient amounts, prices, guarantees, or course outcomes.
- For supplements, use the current seller label as the source for ingredients and serving information. Avoid disease-treatment claims and advise readers to discuss suitability and interactions with a qualified health professional.
- Use an accurate product image or no product image. Keep each page’s product-specific palette in its own stylesheet.
- Make each title, description, canonical URL, and main heading specific to that page.
- Do not add review ratings or Product/Review structured data unless the visible page genuinely substantiates the marked-up information.
- Keep the affiliate disclosure visible on the home page and every product guide.

## Before adding a new offer

1. Confirm the product name, seller, destination URL, current label or course outline, and purchase terms.
2. Write a useful overview with decision-relevant information, limitations, and a clear source link. Do not rely on a generic “verified offer” card.
3. Use an accurate image and a product-appropriate color palette; leave the image out when no accurate asset is available.
4. Add the page to `assets/js/articles.js`, the public catalog, and `sitemap.xml` only after the page is ready for indexing.
5. Keep incomplete or unidentified offers out of the public catalog and use `noindex, follow` until the missing information is resolved.

Google Search does not guarantee rankings or rich-result display. Google Ads is not configured in this repository; review the destination, offer, location, and current advertising policies before creating a campaign.
