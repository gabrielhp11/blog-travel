# Digistore24 approval reconciliation — 11 November 2026

The authenticated account query for approved partnerships, created 1 January–11 November 2026, returned 513 rows. Package, upsell and seller-offer rows repeat product brands. This update reconciles the 18 requests recorded on 5 November rather than treating every historical row as a new product. The account snapshot is in `affiliations.json`; it contains no email or payment data.

## Result

| Product | Account status | Page | Outcome |
| --- | --- | --- | --- |
| CoreVital Burn | Approved · offer 740440 | `/topics/wellness/metabolic-health/corevital-burn` | Noindex status page; supplier domain shows a generic hosting setup page |
| Pineal 10x | Approved · offer 52925 | `/topics/wellness/nutrition/pineal-10x` | Existing guide |
| T-CARE | Pending | — | Not published |
| MannaFlux | Pending | — | Not published |
| Lymphatic System Support | Pending | — | Not published |
| Native Rest | Pending | — | Not published |
| Prostadine | Approved · offer 500416 | `/topics/wellness/mens-health/prostadine` | Noindex status page; supplier domain is parked |
| ZenCortex | Pending | — | Not published |
| Vertigenics | Approved · offer 50717 | `/topics/wellness/brain-health/vertigenics` | Existing guide |
| Quietum Plus | Approved · offer 549733 | `/topics/wellness/brain-health/quietum-plus` | Noindex status page; current quantitative label and serving details not available |
| Synadentix | Approved · offer 639064 | `/topics/wellness/nutrition/synadentix` | Noindex status page; current quantitative label and serving details not available |
| JointVive | Pending | — | Not published |
| NeuroVera | Pending | — | Not published |
| ProstaLite | Approved · offer 561306 | `/topics/wellness/mens-health/prostalite` | Noindex status page; supplier label reviewed, but tracked destination and order terms not verified |
| Nerve Fresh | Approved · offer 50226 | `/topics/wellness/nutrition/nerve-fresh` | Existing guide |
| Keravita Pro | Approved · offer 554211 | `/topics/wellness/nutrition/keravita-pro` | Noindex status page; current promotion redirects to unrelated toenail-fungus sales copy |
| Steel Bite Pro | Approved · offer 348582 | `/topics/wellness/nutrition/steel-bite-pro` | Noindex status page; current label and three distinct relevant product images not verified |
| Nerve Soothe | Approved · offer 55736 | `/topics/wellness/nutrition/nerve-soothe` | Existing guide |

Four accepted products already had guides. Seven previously unpaged approved products now have explicit status pages, but remain out of the catalog and sitemap with `noindex, follow`. This preserves discoverability for users following a direct URL without presenting incomplete offers as finished reviews.

## Source checks and limits

- ProstaLite: the supplier page and an apparent Supplement Facts panel were accessible. The panel lists one capsule per serving, 30 servings per container and a 450 mg proprietary blend without individual ingredient amounts. The approved Digistore24 offer ID was known, but a tracked destination and order-specific terms could not be confirmed; the page remains noindex and contains no offer link.
- Keravita Pro: `keravitapro.com` redirected to sales copy about toenail fungus. The product identity and destination did not match well enough to publish an offer guide.
- Prostadine: the supplier domain resolved to a parked-domain page.
- CoreVital Burn: the supplier domain displayed a generic hosting setup page.
- Steel Bite Pro: the supplier page included health-related marketing, but a current quantitative label and three distinct relevant product images were not verified.
- Synadentix and Quietum Plus: supplier pages named ingredients and made marketing claims but did not expose a current quantitative label and serving details. No formula amounts or efficacy claims were copied into the status pages.
- Approved partnership state is not evidence of product safety, efficacy, medicine approval, sales or payout. No order, message or application was submitted.

Seven remaining requests were still pending in the account snapshot and were not presented as approved. No checkout was completed. The dated status reflects the account and supplier pages reviewed on 11 November 2026; it is not a guarantee of later availability.
