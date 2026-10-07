# Search Engine Setup

## Google Search Console

The homepage already contains the Google site verification meta tag, and the matching verification HTML file is kept at the site root. These prove site ownership when added to the matching Search Console property; they do not submit the sitemap automatically.

After the latest version is deployed:

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Add the URL-prefix property `https://blog-travel-eight.vercel.app/`.
3. Verify ownership with the existing HTML file or the existing meta tag. Keep the selected verification method in the deployed site.
4. Open **Sitemaps**, enter `sitemap.xml`, and submit it.
5. Use **URL inspection** for the homepage and a few published guides to request indexing and check whether Google can fetch each page.

After changing the catalog or pages, run `npm run seo:build` and `npm run seo:check`, then deploy the generated files. `npm run seo:sitemap` remains available for a sitemap-only refresh.

## Current crawl files

- `robots.txt` allows crawling and advertises the sitemap.
- `sitemap.xml` lists the home page, disclosure page, four directories (including Europe), and public catalog pages with self-referencing extensionless canonicals and no `noindex` directive.
- Pages with unconfirmed offer details remain crawlable but carry `noindex, follow`; do not block them in `robots.txt`, because search engines need to fetch the page to see that directive.

Search engines decide independently whether and when to index a submitted page. A successful sitemap submission is not an indexing or ranking guarantee.

## Bing Webmaster Tools

The site has been added to Bing Webmaster Tools. The verification file `BingSiteAuth.xml` is now in the project root. After deploying it, return to the Bing verification panel and choose **Verify**. Then open **Sitemaps** for this site and submit `https://blog-travel-eight.vercel.app/sitemap.xml`.

The Bing account was created using Google sign-in. Search Console data was not imported into Bing; importing it would require a separate Google data-access authorization.

## Deployment verification

On 6 October 2026, the public sitemap returned HTTP 200 with `application/xml`. A guide URL ending in `.html` returned HTTP 308 to its extensionless equivalent. The October SEO update aligns canonicals, internal links and sitemap entries with those final URLs. The 7 October release generates 69 URLs, including `/guides/europe`; confirm the current generated count before submitting the deployed sitemap.

On 7 October, authenticated Google and Bing reports were still processing. The Google sitemap had been processed with 50 discovered URLs from 6 October; Bing had no sitemap submission. Google’s live homepage test passed, while its indexed-version inspection showed discovered but not yet indexed. See `SEO_EUROPE_AUDIT_2026-10-07.md` for the deployment follow-up. Do not treat repository findings as measured traffic losses or claim a percentage improvement.

## Measure the organic impact

1. In Search Console's Search results report, export the last 28 complete days as the baseline: clicks, impressions, CTR and average position. Save the deployment date and compare the next 28 complete days with the previous period, allowing for seasonality and changes in query mix.
2. Break results down by page, query, country and device. Keep English, Portuguese and German audiences separate when evaluating changes. Use clicks as the primary traffic measure; impressions and CTR help explain where opportunity or loss occurs.
3. Inspect the home page, each topic directory and representative guides. Confirm that Google's selected canonical matches the extensionless URL, that the page is eligible for indexing, and that the fetched HTML contains links to the guides.
4. For pages with impressions and low CTR, compare the actual query with the page's title and description. Improve relevance and clarity using the page's real contents. Avoid unsupported promises or changing every title at once.
5. For pages with little visibility, examine whether the guide answers the reader's questions with useful comparisons, limitations and attributed sources. Add product-specific evidence when available and document actual first-hand tests only when performed.
6. After 28 days, compare topic groups and representative pages. After 56 days, check whether the pattern persists. Do not attribute all changes to this release without considering demand, competition and indexing changes.

Primary references: [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [helpful, reliable content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
