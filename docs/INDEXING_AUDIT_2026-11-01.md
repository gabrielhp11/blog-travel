# Google indexing follow-up — 1 November 2026

Authenticated Google Search Console was inspected for `https://blog-travel-eight.vercel.app/`.

## Action completed

The sitemap report initially showed 117 discovered URLs, last read on 30 October. Production and the checkout now contain 127 URLs. Submitted the updated `sitemap.xml` once. Google confirmed “Sitemap enviado”; the resulting report showed **Processado**, submitted/read **1 November 2026**, and **127 pages found**. This confirms sitemap processing, not 127 indexed pages.

## Current Google findings

- The aggregate page-indexing report still uses data from 22 October: 28 indexed, 65 discovered but not indexed, three redirect exclusions, and zero crawled but not indexed.
- The discovered-page validation already showed a 1 November start when this session opened. The redirect validation started on 27 October. Neither validation was restarted in this session.
- `/guides/europa-esim` is still discovered without a recorded crawl in the indexed-version inspection. Google's live test at 10:42 Sao Paulo time succeeded: “O URL está disponível para o Google” and “É possível indexar a página”; one valid breadcrumb item was detected.
- One manual indexing request was attempted for that URL. Google rejected it with “A cota foi excedida” and instructed retrying tomorrow. No successful URL indexing request is claimed. Further requests were not attempted after the quota response.

## Redirect exclusions verified

These old URLs return a permanent HTTP 308 directly to the equivalent extensionless path:

- `/topics/wellness/longevity/collagen.html`
- `/topics/education/language-learning/hackeando-a-fluencia.html`
- `/topics/wellness/brain-health/advanced-memory-formula.html`

Their final URLs pass the live sitemap check. These are expected alias exclusions; removing the redirects would break old links and is unnecessary. The current sitemap contains the final URLs.

## Technical checks

`node scripts/check-live-sitemap.js docs/audits/sitemap-live-2026-11-01.json` checked all 127 production URLs: 127 passed, no issues. Checks include direct HTTP 200, HTML, matching canonical, static main content, robots.txt, and meta/header indexing restrictions. The production sitemap matches the checkout.

`node scripts/run-task.js check seo:build` passed the project validations and regenerated the site without changes to public artifacts. No speculative changes were made to page content, canonicals, intentional noindex holds, or redirects.

## Remaining external limits

Google must crawl and evaluate the discovered pages; sitemap processing and a successful live test do not establish index inclusion. The daily manual-request quota currently prevents another URL request. Existing validations remain pending. Do not repeatedly submit an unchanged sitemap or restart pending validations merely to clear the report.

References: [Request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [Troubleshoot crawling](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors), [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects).

## Follow-up: contextual navigation repairs

At the user's request to fix the remaining pages, extracted all 65 visible examples from the **all known pages** discovered-but-not-indexed report. Its last update is still 22 October; these are historical examples, not 65 fresh URL inspections. That report's validation began on 27 October, while the sitemap-filtered view inspected earlier showed 1 November. Neither was restarted. The URL list is preserved in `audits/google-discovered-2026-11-01.json`.

A fresh indexed-version inspection of the homepage confirmed “O URL está no Google” and “A página está indexada”, despite its presence in the historical exclusion list. Do not describe all 65 examples as currently excluded.

The contextual recommendation selector had two weaknesses: it could prefer a different-language guide solely because the subtopic matched, and equal relevance always favoured the first records in the catalog. There were 76 cross-language recommendation links and 18 guides with no incoming links from other guides' recommendation lists (they were already linked from home/topic directories, so these were not orphan pages).

Changed `scripts/related-guides.js` and the page optimizer to select same-language recommendations, prioritise explicit product/comparison and editorial relationships, connect the two products in an existing comparison, and rotate equally relevant neighbours deterministically. This repairs reader navigation and provides more contextual discovery paths. It is not evidence that internal linking caused Google's crawl delay. No source dates were advanced for navigation-only edits.

The final build changes contextual navigation on 112 published guides, including 53 of the 65 historical examples. Public page content, source dates, affiliate destinations and intentional indexing holds are preserved.

The resulting contextual navigation has zero cross-language recommendations. Recommendations now require a shared subtopic or an explicit product/editorial/comparison relationship; a broad directory alone is insufficient. After removing unrelated filler, 29 guides have no incoming recommendation-list links, but all still have static links from home/topic directories. This is a deliberate relevance tradeoff, not a claim that they are orphaned or need more arbitrary recommendations. All 127 public pages, including all 65 historical report examples, are reachable through static HTML links from home. `audits/discovery-after-2026-11-01.json` records the paths and incoming sources; `audits/related-navigation-2026-11-01.json` records before/after links and counts. Regression checks now cover the generated navigation and product/comparison relationships.

No blanket removal of intentional `noindex` holds, redirect changes, repeated manual indexing requests, or restart of active validations was performed. The sitemap was already processed with 127 pages earlier today; the navigation update does not add sitemap URLs. See [Google's internal-link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
