# URLs and Deployment

**Production domain:** https://blog-travel-eight.vercel.app

The site is a static project deployed on Vercel. `vercel.json` enables clean URLs and defines legacy redirects.

The authoritative list of pages submitted to search engines is `sitemap.xml`. It is generated from the homepage, disclosure page, and visible entries in `assets/js/articles.js`, while respecting each page's canonical and robots metadata. Run `npm run seo:sitemap` after publishing or metadata changes.

The homepage catalog is maintained separately in `assets/js/articles.js`. Affiliate destinations live with their corresponding catalog entries or product pages and are intentionally not duplicated here.

## GearUP e Creality — 18/10/2026

- `/gearup` → `/topics/entertainment/gaming-network/gearup-booster` (português, produto PC).
- `/creality` → `/topics/business/maker-tools/creality-3d-printers` (inglês, loja US).
- `/guides/gaming` agrupa software de conexão para jogos. A home inclui filtro Gaming.

## Suplementos Digistore24 — outubro de 2026

- `/selfplus-age-plus` → `/topics/wellness/longevity/selfplus-age-plus` (inglês; entrega somente US).
- `/alpha-dualis` → `/topics/wellness/mens-health/alpha-dualis` (inglês; verificações de rótulo e oferta US).
- Ambos também têm alias com `.html`; o catálogo e `/guides/wellness` apontam para os guias antes de qualquer oferta externa.
