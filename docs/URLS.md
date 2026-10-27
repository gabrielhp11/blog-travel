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


## Supplement expansion — 25 October 2026

- [Elixolve Sleep Strips: Ingredients & US Pack Costs](/topics/wellness/nutrition/elixolve-sleep-strips) · en
- [SlimSana: Inhaltsstoffe, Kosten & Kaufbedingungen](/topics/wellness/metabolic-health/slimsana) · de-DE
- [MetaboSana: Etikett, EGCG-Hinweise & Kosten](/topics/wellness/metabolic-health/metabosana) · de-DE
- [GlucoSana: Chrom-Etikett & Kaufbedingungen](/topics/wellness/metabolic-health/glucosana) · de-DE
- [HeroSana Caliber: Gummies, Etikett & Abo-Checks](/topics/wellness/mens-health/herosana-caliber) · de-DE
- [GlucoTrust auf Deutsch: Etikett & Kaufkosten](/topics/wellness/metabolic-health/glucotrust-german) · de-DE
- [Gluconite: Pack Costs, Returns & Label Questions](/topics/wellness/nutrition/gluconite) · en
- [Insulin Herb Berberine: Costs & Formula Questions](/topics/wellness/metabolic-health/insulin-herb-berberine) · en

## Cinco suplementos — 26/10/2026

- `/floravitasana` → `/topics/wellness/gut-health/floravitasana`; alias `.html` incluído.
- `/slin` → `/topics/wellness/metabolic-health/slin`; alias `.html` incluído.
- `/yara-hair-vitamins` → `/topics/wellness/nutrition/yara-hair-vitamins`; alias `.html` incluído.
- `/senflo-gummies` → `/topics/wellness/gut-health/senflo-gummies`; alias `.html` incluído.
- `/adaptogen-4` → `/topics/wellness/nutrition/adaptogen-4`; alias `.html` incluído.

## Supplement comparisons — 27 October 2026

Directory: `/guides/supplement-comparisons`. Every article also has short aliases with and without `.html`.

- [SLIN vs Insulin Herb Berberine: Serving & Formula Checks](/topics/wellness/metabolic-health/slin-vs-insulin-herb-berberine) · en-US
- [Gluconite vs Elixolve Sleep Strips: Nighttime Label Comparison](/topics/wellness/nutrition/gluconite-vs-elixolve-sleep-strips) · en-US
- [SlimSana vs. KetoSana: Kapseln, Tropfen und Etiketten](/topics/wellness/metabolic-health/slimsana-vs-ketosana) · de-DE
- [MetaboSana vs. GlucoSana: Mengen und Warnhinweise](/topics/wellness/metabolic-health/metabosana-vs-glucosana) · de-DE
- [Curcumitol-Q vs Advanced Joint Support: Formula & Allergen Checks](/topics/wellness/joint-health/curcumitol-q-vs-advanced-joint-support) · en-GB
- [Advanced Muscle Plus vs Advanced Amino Formula: Label Differences](/topics/wellness/nutrition/advanced-muscle-plus-vs-advanced-amino-formula) · en-GB
- [BrainAMP vs Advanced Memory Formula: Ingredient & Serving Comparison](/topics/wellness/brain-health/brainamp-vs-advanced-memory-formula) · en-GB
- [SenFlo vs Integrative Digestive Formula: Different Digestive Proposals](/topics/wellness/gut-health/senflo-vs-integrative-digestive-formula) · en-GB
- [EZNaturals Moringa vs Pep Tonic: Capsule & Powder Comparison](/topics/wellness/nutrition/eznaturals-moringa-vs-pep-tonic) · en-GB
- [SelfPlus AGE+ vs Advanced Mitochondrial Formula: Label Scope](/topics/wellness/longevity/selfplus-age-plus-vs-advanced-mitochondrial-formula) · en-GB
