# PokiSky

PokiSky is a static, multilingual publication for source-based product and course guides. It is hosted on Vercel at <https://blog-travel-eight.vercel.app/>.

## Site structure

- `index.html` is the publication home page. Its catalog is generated as static HTML from `assets/js/articles.js`; JavaScript only enhances the filters.
- `guides/travel.html`, `guides/courses.html`, `guides/wellness.html` and `guides/europe.html` group published guides with topic- and audience-specific buying criteria and crawlable links. `/guides/europe-de` and `/guides/uk-ireland` are language- and destination-specific indexes linked from the Europe directory; they do not claim delivery in every country.
- `/guides/europe-esim` and `/guides/europa-esim` are equivalent English/German planning guides comparing Airalo, Holafly and existing roaming. Their reciprocal hreflang and visible language switch apply only to this translated pair. Edit the copy in `scripts/generate-planning-guides.js` and metadata in `scripts/site-data.js`; the build generates both pages and their directory links.
- `docs/PRODUCTS.md` is the register of public guides and their editorial status.
- `topics/` contains the individual product guides and offer-status pages.
- `assets/css/review.css` provides the shared product-page layout; `assets/css/editorial.css` supplies the editorial sections; each product stylesheet sets its own palette.
- `assets/images/products/` contains product images used on the site. Do not use one product’s packaging to represent another product.
- `affiliate-disclosure.html` explains the affiliate relationship and editorial standards.
- `robots.txt` allows crawling and points to the sitemap. `npm run seo:sitemap` regenerates `sitemap.xml` from the public catalog, topic directories, home page, and disclosure page, excluding pages marked `noindex`.
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
- Original editorial illustrations may be used for digital services when clearly labelled. They must not imitate official product packaging, screenshots, or logos.
- Offer pages should have at least three distinct, relevant images. Include alt text and dimensions; lazy-load supporting illustrations below the first viewport.
- Open every product guide with a short, audience-specific explanation of what the item is and what it is offered for, plus a visible primary image. On mobile, show the image before purchase buttons and lengthy detail blocks. Keep at least two distinct supporting images in the article.
- `content/product-openings.json` supplies the direct-purpose introductions. `scripts/prepare-product-heroes.js` builds the shared responsive opening before SEO metadata is generated. `assets/images/sources/manifest.json` records pinned supplier/context images, original URLs, dimensions and checksums. Keep editorial substitutions labelled; do not use earnings graphics as the opening product visual.
- Make each title, description, canonical URL, and main heading specific to that page.
- Do not add review ratings or Product/Review structured data unless the visible page genuinely substantiates the marked-up information.
- Keep the affiliate disclosure visible on the home page and every product guide.

## Before adding a new offer

1. Confirm the product name, seller, destination URL, current label or course outline, and purchase terms.
2. Write a useful overview with decision-relevant information, limitations, and a clear source link. Do not rely on a generic “verified offer” card.
3. Use an accurate image and a product-appropriate color palette; leave the image out when no accurate asset is available.
4. Add the page to `assets/js/articles.js` and the public catalog only after the page is ready for indexing.
5. Keep incomplete or unidentified offers out of the public catalog and use `noindex, follow` until the missing information is resolved.
6. When a product is ready to go live, update its page, `assets/js/articles.js`, and `docs/PRODUCTS.md`; then run `npm run seo:build` and `npm run seo:check`.

## SEO maintenance

Run `npm run check` before delivery to validate SEO, navigation, images, comparison pages, the live-check logic and the full editorial release queue. It groups the checks used by the existing GitHub Actions workflow; `seo:live:test` also covers the portable task runner. Then run `npm run seo:build` and confirm `git diff --exit-code` leaves generated pages unchanged after committing the intended changes. Check `git status --short` too, since newly generated files must be committed.

On a machine with Node but no npm command in PATH, use `node scripts/run-task.js seo:build check`. This executes the Node-only tasks defined in `package.json` with the current Node executable, stops at the first failed step and works on Windows and Linux. Release tests use an isolated temporary copy and do not publish drafts to the working site. Text files use LF consistently across platforms through `.gitattributes`.

Run `npm run seo:live` after deployment to check the live sitemap and every listed URL: direct HTTP 200, HTML, matching canonical, static content, robots.txt and indexing restrictions in meta tags/HTTP headers. Pass a report path with `npm run seo:live -- report.json`. The check fails when the deployed sitemap differs from the checkout or a listed page fails a technical requirement. It does not report Google index status or guarantee indexing.

`Published sitemap validation` runs when GitHub receives a successful deployment status and can also be started manually. It checks the production site against `main` and retains a JSON artifact. Execution depends on GitHub Actions being enabled and the deployment provider emitting the event. It never submits repeated indexing requests or publishes drafts.

After the live check passes, the same workflow notifies IndexNow of new or changed published HTML. `indexnow-key.txt` is the public ownership-verification file; preserve it in production. A cached hash manifest prevents resending unchanged pages; a cache miss starts a full initial submission. Failed submissions do not advance the manifest. The artifact includes the receipt report. HTTP 200 means received; 202 means received with key validation pending. Neither confirms indexing. Run `node scripts/submit-indexnow.js` for a manual submission after deployment; local state and receipts stay in `.cache/`. Google does not use this submission flow.

Use filenames ending in `.html` in the catalog and on disk. Public URLs, canonicals, internal links and the sitemap use extensionless paths to match Vercel's `cleanUrls` redirects. Existing `.html` URLs continue to redirect to their clean equivalents.

`npm run seo:build` updates published guide titles and H1s from the catalog, page languages, visible editorial bylines, related links, Article/BreadcrumbList metadata, static catalogs, local font loading and the sitemap. It preserves seller links and existing source-check dates. It does not invent review ratings, author credentials, publication dates, translated alternatives or product results. Keep each guide's catalog title descriptive of its actual content.

`npm run seo:check` verifies public-page metadata, HTML links and anchors, image requirements, sitemap consistency and visible structured-data details. The GitHub SEO workflow runs these checks and verifies that generation leaves committed artifacts unchanged. After adding images, record their actual dimensions and identify editorial artwork visibly.

See `docs/SEARCH_CONSOLE.md` for measuring search clicks, impressions and click-through rate after deployment. Traffic improvement must be assessed with account data; repository checks cannot measure organic traffic.

The October 2026 expansion adds ten English (`en-GB`) guides for European readers. These listings use original local editorial illustrations, provider sources and untracked official links (`linkType: 'official'`). Keep those links untracked until an authorised affiliate destination is available. The Travel & experiences filter includes the travel guides.

Google Search does not guarantee rankings or rich-result display. Google Ads is not configured in this repository; review the destination, offer, location, and current advertising policies before creating a campaign.

## Delivery preference

The user requests that completed project changes are validated, committed and pushed to GitHub through `origin`. Use a normal push and report any access or conflict blocker. Persistent instructions are in `AGENTS.md` and `.cursor/rules/project-delivery.mdc`.

The Europe directory groups guides by the editorial audience recorded in the catalog and distinguishes English and German content. The German and UK/Ireland indexes reuse that audience metadata. They do not imply delivery or billing support in every European country. Do not add hreflang between unrelated products; translated variants must represent the same page content. Visible FAQs may carry FAQPage markup only when the questions and answers are on the page.

The sitemap includes `lastmod` only when a page records an explicit content-review date in `meta[name="dateModified"]`. Do not use file timestamps, checkout time or build time as editorial updates. Update the planning guides' review date only after reviewing their actual content and sources. FAQ markup does not imply eligibility for Google's restricted FAQ rich results.

Fonts are served locally in WOFF2 format with Latin and extended Latin coverage. Keep `assets/fonts/manifest.json` and the SIL OFL licences alongside the hashed font files. `font-display: optional` lets text appear promptly with a fallback on a slow first load. The build removes external Google font links and preloads only the body font. Font binaries have immutable caching; use a new filename when their contents change.

See [the 7 October European SEO audit](docs/SEO_EUROPE_AUDIT_2026-10-07.md) for verified account findings, mobile measurements and their limits.

## Daily editorial publications

`content/editorial-posts.json` holds complete English articles for registered Europe/US items, with an explicit release state. `npm run posts:next -- --dry-run` previews the next due article; `npm run posts:next` releases at most one per Sao Paulo day. `npm run seo:build` generates only released pages. Future drafts stay outside Vercel, the catalog and sitemap. Each article leads to the existing product guide, preserving its official or affiliate destination. See `docs/DAILY_PUBLICATION.md` for the initial queue, actual search signals and the local daily scheduling dependency. `npm run posts:test` checks timezone, duplicate prevention, missed-day handling and every prepared future release in an isolated copy.

## Buying experience and link audits

`npm run seo:build` also generates the guide summaries, static contents navigation and shared experience stylesheet through `scripts/enhance-buying-experience.js`. Product-specific decision comparisons live in `content/buying-decisions.json`; they are editorial planning scenarios, not product testing or promised results. Keep source-check dates tied to actual source review.

The home search combines topic, guide language and local text search. Cards lead to the product guide; seller and affiliate destinations stay inside that guide. `npm run seo:check` exercises these filters and verifies summaries, contents anchors, disclosures and guide-first catalog actions.

`npm run links:audit` checks the public catalog, held registrations, external sources and site pages and writes a dated report. HTTP success is only reachability; bot blocks, JavaScript-only responses, prices, availability and affiliate eligibility need separate checks. See [the 12 October review](docs/PROJECT_REVIEW_2026-10-12.md) and [registered-link follow-ups](docs/audits/REGISTERED_LINKS_2026-10-12.md).

## Gaming and maker offers

The October 18 affiliate review adds a Portuguese GearUP PC connection guide and an English Creality US printer guide. Both use existing active partnerships and verified tracked destinations, with three pinned official images per page. `/guides/gaming` and the Gaming home filter expose gaming software independently of travel and courses; the Creality guide is grouped with business tools. See `docs/AFFILIATE_NETWORK_REVIEW_2026-10-18.md` for actual account states, candidate priorities and unconfirmed application attempts. Do not mark pending or blocked applications as approved.

## Supplement comparisons — 27 October 2026

Ten source-based comparisons are maintained in `content/supplement-comparisons.json`, rendered by `scripts/generate-supplement-comparisons.js`, and checked by `scripts/validate-supplement-comparisons.js`. The `/guides/supplement-comparisons` directory exposes all ten. Each comparison has one separately generated Gemini editorial illustration and two existing product assets, a side-by-side table, uncertainties, dated prices and internal links to both product guides. These are editorial label and buying comparisons, not product trials or efficacy rankings.
