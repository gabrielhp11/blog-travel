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
