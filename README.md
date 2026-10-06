# PokiSky

PokiSky is a static, multilingual publication for source-based product and course guides. It is hosted on Vercel at <https://blog-travel-eight.vercel.app/>.

## Site structure

- `index.html` is the publication home page and renders the catalog from `assets/js/articles.js`.
- `docs/PRODUCTS.md` is the register of public guides and their editorial status.
- `topics/` contains the individual product guides and offer-status pages.
- `assets/css/review.css` provides the shared product-page layout; `assets/css/editorial.css` supplies the editorial sections; each product stylesheet sets its own palette.
- `assets/images/products/` contains product images used on the site. Do not use one product’s packaging to represent another product.
- `affiliate-disclosure.html` explains the affiliate relationship and editorial standards.
- `robots.txt` allows crawling and points to the sitemap. `npm run seo:sitemap` regenerates `sitemap.xml` from the public catalog, home page, and disclosure page, excluding pages marked `noindex`.
- `googlecf7e194290b51fa5.html` and `BingSiteAuth.xml` are search-engine ownership verification files. Keep them at the site root.
- `scripts/` contains small maintenance tools for the static site.
- `docs/` contains editorial references, URL notes, and search-engine setup instructions.

## Public product guides

The public catalog is maintained in `assets/js/articles.js`. Pages with unverified offer details are marked `noindex` and hidden from the catalog until their information is confirmed. The sitemap generator also excludes those pages and redirect aliases.

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
4. Add the page to `assets/js/articles.js` and the public catalog only after the page is ready for indexing.
5. Keep incomplete or unidentified offers out of the public catalog and use `noindex, follow` until the missing information is resolved.
6. When a product is ready to go live, update its page, `assets/js/articles.js`, and `docs/PRODUCTS.md`; then run `npm run seo:sitemap`.

Google Search does not guarantee rankings or rich-result display. Google Ads is not configured in this repository; review the destination, offer, location, and current advertising policies before creating a campaign.
