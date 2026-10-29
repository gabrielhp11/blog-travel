# Indexing audit — 29 October 2026

Authenticated Google Search Console and Bing Webmaster Tools were inspected for `https://blog-travel-eight.vercel.app/`.

## Google

- Aggregate report last updated 22 October: 28 indexed, 65 discovered but not indexed, three redirect exclusions, zero crawled but not indexed.
- Both active issue validations started on 27 October. Do not restart them or label pending validation as failure.
- Current URL inspection confirms the homepage is indexed even though the older issue examples still list it.
- `/guides/europa-esim` remains discovered without a recorded crawl. Manual indexing was attempted but rejected because the daily quota was exceeded. No successful indexing request is claimed.
- Sitemap processed successfully: last read 28 October, 117 discovered URLs. Resubmission is unnecessary while this already matches production.

## Bing

- Performance report through 27 October: zero clicks and impressions over the selected three months.
- Sitemap list: success, no warnings/errors, 69 discovered URLs. Last submission/crawl date was displayed as `10/08/2026`; the translated UI retained that numeric string, so its locale interpretation is uncertain. Production currently contains 117 URLs.
- Re-submit returned “Erro: Falha ao enviar https://blog-travel-eight.vercel.app/sitemap.xml.” The old entry remained unchanged. No successful sitemap re-submit is claimed.
- Site Explorer's indexed-URLs view returned no data. This is not proof of zero indexed pages.
- IndexNow loaded an onboarding page rather than a populated submission report; no active submissions could be confirmed.

## Technical validation and repair

All 117 production sitemap URLs passed direct HTTP 200, HTML, matching canonical, static main content and indexability checks. Robots allows crawling and announces the sitemap. Results: `docs/audits/sitemap-live-2026-10-29.json`.

Added an IndexNow ownership file and a post-deployment notification step to the existing published-sitemap workflow. It verifies the deployed key, sitemap and pages before submitting, hashes published HTML, and records state only after a 200/202 receipt. GitHub cache suppresses unchanged submissions; no periodic polling is added. Initial receipt and deployment must be verified separately. See https://www.indexnow.org/documentation .

No content or redirects were changed merely to clear an aggregate exclusion report. Discovery, receipt and technical eligibility do not guarantee index inclusion, ranking or traffic.
