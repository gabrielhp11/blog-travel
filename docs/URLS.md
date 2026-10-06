# URLs and Deployment

**Production domain:** https://blog-travel-eight.vercel.app

The site is a static project deployed on Vercel. `vercel.json` enables clean URLs and defines legacy redirects.

The authoritative list of pages submitted to search engines is `sitemap.xml`. It is generated from the homepage, disclosure page, and visible entries in `assets/js/articles.js`, while respecting each page's canonical and robots metadata. Run `npm run seo:sitemap` after publishing or metadata changes.

The homepage catalog is maintained separately in `assets/js/articles.js`. Affiliate destinations live with their corresponding catalog entries or product pages and are intentionally not duplicated here.
