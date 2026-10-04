# PokiSky — Direct Travel, Wellness & Longevity Picks

A minimal, high-conversion affiliate publication and review platform hosted seamlessly on **Vercel** (`https://blog-travel-eight.vercel.app/`) and **GitHub Pages**.

---

## 📁 Project Architecture & Folder Organization

The project is structured into modular topics, subtopics, and centralized assets to keep the codebase clean, organized, and scalable as dozens of affiliate products are onboarded:

```
blog-travel/
├── index.html                           # Main portal (hero, topic filters, dynamic grid)
├── cleansesana.html                     # Backward-compatible redirect to gut-health review
├── ketosana.html                       # Backward-compatible redirect to keto review
├── vercel.json                          # Vercel routing rules & clean URLs configuration
├── README.md                            # Comprehensive project documentation & SOP
│
├── assets/                              # Centralized reusable static assets
│   ├── css/
│   │   ├── main.css                     # Primary portal styling (layout, grid, filters)
│   │   └── review.css                   # Reusable editorial review layout (Forbes / Robb Report style)
│   └── js/
│       ├── articles.js                  # Central database of all articles & affiliate offers
│       └── main.js                      # Dynamic grid rendering, filters & affiliate routing
│
└── topics/                              # Vertical topics and subtopics
    ├── business/                        # Vertical: AI, SaaS & Online Income
    │   └── ai-training/                 # Subtopic: AI Income Education
    │       └── ki-training.html         # Editorial review for Business Kickstart KI-Training
    │
    ├── wellness/                        # Vertical: Health, Wellness & Longevity
    │   ├── brain-health/                # Subtopic: Cognitive Performance & Nootropics
    │   │   └── advanced-memory-formula.html  # In-depth editorial review (Nobel Prize science)
    │   ├── mens-health/                 # Subtopic: Male Vitality & Hormonal Support
    │   │   └── prime-perform-pro.html   # Editorial review for Prime Perform Pro
    │   └── gut-health/                  # Subtopic: Digestive Health & Bloat Relief
    │       ├── cleansesana.html         # Editorial review page for CleanSeSana
    │       └── ketosana.html            # Editorial review page for KetoSana
    │
    └── travel/                          # Vertical: Curated Travel Escapes
        ├── flights/                     # Subtopic: Fast 48h city resets
        ├── stays/                       # Subtopic: Remote work & digital nomad stays
        ├── escapes/                     # Subtopic: Romantic couples retreats
        ├── luxury/                      # Subtopic: Premium 5-star airport-to-resort
        └── deals/                       # Subtopic: High-value budget curation
```

---

## 📊 Active Affiliate Offers & Registry

| Product / Offer | Vertical | Subtopic | Network | Target Page / Review | Status | Updated |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **KI-Training (Business Kickstart)** | Business | `ai-training` | Digistore24 / Direct | `topics/business/ai-training/ki-training.html` | ✅ Live | 2026-10-04 |
| **Advanced Memory Formula** | Wellness | `brain-health` | Digistore24 | `topics/wellness/brain-health/advanced-memory-formula.html` | ✅ Live | — |
| **Prime Perform Pro** | Wellness | `mens-health` | Digistore24 | `topics/wellness/mens-health/prime-perform-pro.html` | ✅ Live | — |
| **CleanSeSana** | Wellness | `gut-health` | Direct | `topics/wellness/gut-health/cleansesana.html` | ✅ Live | — |
| **KetoSana** | Wellness | `gut-health` | Direct | `topics/wellness/gut-health/ketosana.html` | ✅ Live | — |
| **Aviasales Flights** | Travel | `flights` | TravelPayouts | Root Portal CTA | ✅ Live | — |
| **Booking.com Stays** | Travel | `stays` | TravelPayouts | Root Portal CTA | ✅ Live | — |

### Direct Affiliate Links

* **KI-Training:** [business-kickstart.de/ki-training-1/#aff=…](https://business-kickstart.de/ki-training-1/#aff=gabrielhenriquep123f97e)
* **Advanced Memory Formula:** [Affiliate Link](https://www.advancedbionutritionals.com/DS24/Advanced-Memory/Nobel-Prize-Winning-Memory-Breakthroughs/HD.htm#aff=gabrielhenriquep123f97e)
* **Prime Perform Pro:** [Affiliate Link](https://primeperformpro.com/principal/#aff=gabrielhenriquep123f97e)
* **CleanSeSana:** [Affiliate Link](https://cleansesana.com/cleansesana-pdp-fe#aff=gabrielhenriquep123f97e)
* **KetoSana:** [Affiliate Link](https://myketosana.com/ketosana-pdp-fe#aff=gabrielhenriquep123f97e)* **KetoSana:** [Affiliate Link](https://myketosana.com/ketosana-pdp-fe#aff=gabrielhenriquep123f97e)

### Explicação dos Links de Afiliado (2026-10-04)

Todos os links abaixo são diretos (não inventados) e estão configurados nos CTAs das páginas individuais com `rel="noopener sponsored nofollow"`. Se algum ainda estiver com `#` (placeholder), significa que o usuário ainda precisa confirmar o link real.

1. **SpartaMax:** `https://getspartamax.com/#aff=gabrielhenriquep123f97e`
   - Produto: fórmula botânica para vitalidade masculina e resistência. Página: `topics/wellness/mens-health/spartamax.html`. Paleta: dark teal (`#0b1015` + `#5ec8b6`). Status: Live.

2. **Collagen (Kitchen Test):** `https://www.advancedbionutritionals.com/DS24/Collagen/This-Simple-10-Second-Kitchen-Test/HD.htm#aff=gabrielhenriquep123f97e`
   - Produto: teste de qualidade de colágeno e fórmula verificada. Página: `topics/wellness/longevity/collagen.html`. Paleta: warm gold (`#f6f3ee` + `#bfa15f`). Status: Live.

3. **VigorSana:** `https://myvigorsana.com/vigorsana-pdp-fe#aff=gabrielhenriquep123f97e`
   - Produto: suplemento para vitalidade diária e bem-estar. Página: `topics/wellness/longevity/vigorsana.html`. Paleta: amber (`#f7f5f0` + `#c4933b`). Status: Live.

4. **Hook Mastery:** `https://go.eugen-grinschuk.de/hook-mastery/#aff=gabrielhenriquep123f97e`
   - Produto: curso de copy e conversão (psicologia de hooks). Página: `topics/business/digital-skills/hook-mastery.html`. Paleta: sky blue (`#f4f5f7` + `#0ea5e9`). Status: Live.

5. **GlucoTrust:** `https://kiwify.app/rYAlC2Q?afid=zprVreMy`
   - Produto: suporte para açúcar no sangue e saúde metabólica. Página: `topics/wellness/metabolic-health/glucotrust.html`. Paleta: deep green (`#f5f2eb` + `#3a7d5c`). Status: Live.

6. **Digistore 626900 (Business Program):** `https://www.digistore24.com/redir/626900/gabrielhenriquep123f97e/`
   - Produto: programa de renda digital e habilidades de marketing. Página: `topics/business/course/business-program.html`. Paleta: burnt sienna. Status: Live.

7. **Digistore 628355 (Advanced Program):** `https://www.digistore24.com/redir/628355/gabrielhenriquep123f97e/`
   - Produto: curso avançado de marketing, funis e conversão. Página: `topics/business/course/advanced-program.html`. Paleta: navy (`#1e3a5f`). Status: Live.

8. **Kiwify rYAlC2Q:** `https://kiwify.app/rYAlC2Q?afid=zprVreMy`
   - Oferta verificada (Kiwify). Página: `topics/travel/deals/kiwify-rYAlC2Q.html`. Paleta: burnt orange (`#c45e2a`). Status: Live.

9. **Kiwify CVGGqrZ (Pay):** `https://pay.kiwify.com.br/CVGGqrZ?afid=zprVreMy`
   - Oferta verificada via página de pagamento Kiwify. Página: `topics/travel/deals/kiwify-CVGGqrZ.html`. Paleta: rose (`#e11d48`). Status: Live.

10. **Kiwify Afb7xyL:** `https://kiwify.app/Afb7xyL?afid=tdOKSEmb`
    - Oferta verificada. Página: `topics/business/digital-skills/kiwify-Afb7xyL.html`. Paleta: forest green (`#2d6a4f`). Status: Live.

11. **Kiwify EKe5iSs:** `https://kiwify.app/EKe5iSs?afid=jV6Yvef9`
    - Oferta verificada. Página: `topics/business/digital-skills/kiwify-EKe5iSs.html`. Paleta: purple (`#7e22ce`). Status: Live.

12. **Kiwify PRCmj8S:** `https://kiwify.app/PRCmj8S?afid=yYOA0xa0`
    - Oferta verificada. Página: `topics/business/digital-skills/kiwify-PRCmj8S.html`. Paleta: bronze (`#8b5a2b`). Status: Live.

13. **Kiwify Tusc9nl (Pay):** `https://pay.kiwify.com.br/Tusc9nl?afid=yYOA0xa0`
    - Oferta verificada via pagamento. Página: `topics/travel/deals/kiwify-Tusc9nl.html`. Paleta: sienna (`#8b3a5c`). Status: Live.

14. **Kiwify ejyON0S (Pay):** `https://pay.kiwify.com.br/ejyON0S?afid=YSHscwfG`
    - Oferta verificada. Página: `topics/business/digital-skills/kiwify-ejyON0S.html`. Paleta: blue (`#2563eb`). Status: Live.

15. **Kiwify itNNPGK:** `https://kiwify.app/itNNPGK?afid=YSHscwfG`
    - Oferta verificada. Página: `topics/business/digital-skills/kiwify-itNNPGK.html`. Paleta: violet (`#6d28d9`). Status: Live.

16. **Advanced Amino Formula:** Link `#` (placeholder) — aguardando usuário.
    - Página: `topics/wellness/longevity/advanced-amino-formula.html`. Paleta: rose/mauve (`#8b3a5c`). Status: ⏸ Awaiting.

17. **Advanced Mitochondrial Formula:** Link `#` (placeholder) — aguardando usuário.
    - Página: `topics/wellness/longevity/advanced-mitochondrial-formula.html`. Paleta: forest (`#0c5d48`). Status: ⏸ Awaiting.

18. **Blood Sugar Blaster:** Link `#` (placeholder) — aguardando usuário.
    - Página: `topics/wellness/metabolic-health/blood-sugar-blaster.html`. Paleta: crimson (`#b22222`). Status: ⏸ Awaiting.

19. **Circo 2:** Link `#` (placeholder) — aguardando usuário.
    - Página: `topics/wellness/longevity/circo2.html`. Paleta: bronze/copper (`#6b5a3a`). Status: ⏸ Awaiting.

20. **Igenics:** Link `#` (placeholder) — aguardando usuário.
    - Página: `topics/wellness/brain-health/igenics.html`. Paleta: deep violet (`#5a3a6a`). Status: ⏸ Awaiting.

21. **MetaBoSana:** Link `#` (placeholder) — aguardando usuário.
    - Página: `topics/wellness/metabolic-health/metabosana.html`. Paleta: navy (`#1e4d6a`). Status: ⏸ Awaiting.

---
*Nota: cada link real (não placeholder) está diretamente configurado no `href` do botão `.btn-primary` de sua página de review. Quando o usuário confirmar os 6 links restantes, basta editar o `href="#"` nas 6 páginas listadas acima e atualizar o status na tabela do README.*


---

## 🚀 Standard Operating Procedure (SOP): Adding a New Affiliate Product

Whenever you receive or select a new affiliate link, follow this 3-step protocol:

### Step 1: Create the Review Page
1. Duplicate one of the existing review pages or use `assets/css/review.css`:
   - For AI / SaaS / business education: see `topics/business/ai-training/ki-training.html`
   - For brain health / nootropics: see `topics/wellness/brain-health/advanced-memory-formula.html`
   - For wellness / gut health: see `topics/wellness/gut-health/cleansesana.html`
   - For keto optimization: see `topics/wellness/gut-health/ketosana.html`
2. Save your file in the appropriate directory:
   `topics/<vertical>/<subtopic>/<product-slug>.html`
3. Link your affiliate link to the primary CTA buttons with `rel="noopener sponsored nofollow"`.

### Step 2: Register in `assets/js/articles.js`
Add a new object to the `blogArticles` array:

```javascript
{
  id: 9,
  topic: 'wellness', // or 'travel' | 'business'
  subtopic: 'longevity',
  category: 'Cellular Health',
  audience: '🔬 Longevity Seekers',
  title: 'Your Article Title Here',
  summary: 'Compelling 2-sentence summary focusing on biological benefit or lifestyle upgrade.',
  highlights: [
    'Key clinical feature 1',
    'Key clinical feature 2',
    'Guarantee or purity standard'
  ],
  service: 'Nutraceuticals',
  ctaText: 'Claim Verified Formula',
  reviewUrl: 'topics/wellness/longevity/your-product.html',
  bookingUrl: 'https://affiliate-network.com/offer#aff=YOUR_ID',
  isDirectAffiliate: true,
  featured: true
}
```

### Step 3: Deploy to Vercel & GitHub
Commit and push the changes:
```bash
git add .
git commit -m "feat(content): add [Product Name] review under topics/[category]"
git push origin main
```
Vercel automatically builds and updates the live site in under 60 seconds!

---

## 🌐 Live URLs

* **Vercel Production:** [blog-travel-eight.vercel.app](https://blog-travel-eight.vercel.app/)
* **GitHub Repository:** [github.com/gabrielhp11/blog-travel](https://github.com/gabrielhp11/blog-travel)
* **KI-Training Review:** [blog-travel-eight.vercel.app/topics/business/ai-training/ki-training.html](https://blog-travel-eight.vercel.app/topics/business/ai-training/ki-training.html)
* **Short redirect:** [blog-travel-eight.vercel.app/ki-training](https://blog-travel-eight.vercel.app/ki-training)
* **Advanced Memory Formula Review:** [blog-travel-eight.vercel.app/topics/wellness/brain-health/advanced-memory-formula.html](https://blog-travel-eight.vercel.app/topics/wellness/brain-health/advanced-memory-formula.html)
* **CleanSeSana Review:** [blog-travel-eight.vercel.app/topics/wellness/gut-health/cleansesana.html](https://blog-travel-eight.vercel.app/topics/wellness/gut-health/cleansesana.html)
* **KetoSana Review:** [blog-travel-eight.vercel.app/topics/wellness/gut-health/ketosana.html](https://blog-travel-eight.vercel.app/topics/wellness/gut-health/ketosana.html)

---

**PokiSky** — Direct picks. No friction. Curated for readers who value their time and wellbeing.


---

## 🎨 Per-Product Color Palettes (New 2026-10)

Each new landing page uses a dedicated palette defined in `assets/css/<slug>.css`:

- **SpartaMax** (`spartamax.css`): `#0b1015` / `#1b2a28` (dark teal) + `#5ec8b6` accent
- **Collagen** (`collagen.css`): `#f6f3ee` / `#2a2220` (warm gold) + `#bfa15f` accent
- **VigorSana** (`vigorsana.css`): `#f7f5f0` / `#2e2310` (amber) + `#c4933b` accent
- **Hook Mastery** (`hookmastery.css`): `#f4f5f7` / `#0f172a` (sky blue) + `#0ea5e9` accent
- **GlucoTrust** (`glucotrust.css`): `#f5f2eb` / `#1a2d1e` (deep green) + `#3a7d5c` accent
- **Digistore Programs** (`digistore*.css`): burnt sienna / navy themes
- **Kiwify Offers** (`kiwify-*.css`): burnt orange / rose / violet / bronze / blue / purple per link

All review pages include: hero with affiliate CTA (`rel="noopener sponsored nofollow"`), product card with image, benefits grid, ingredients/formula section, quote/testimonial, final CTA block, and responsive design via `assets/css/review.css`.


---

## ⏸ Links Aguardando Confirmação (2026-10-04)

As seguintes 6 páginas foram criadas com paletas dedicadas (CSS individuais) e CTAs configurados com placeholder (`#`). Assim que o usuário fornecer os links de afiliado, basta substituir o `href="#"` em cada página pelo link real (já com `rel="noopener sponsored nofollow"` configurado):

- `topics/wellness/longevity/advanced-amino-formula.html` → `assets/css/advanced-amino-formula.css` (rose/mauve palette)
- `topics/wellness/longevity/advanced-mitochondrial-formula.html` → `assets/css/advanced-mitochondrial-formula.css` (forest palette)
- `topics/wellness/metabolic-health/blood-sugar-blaster.html` → `assets/css/blood-sugar-blaster.css` (crimson palette)
- `topics/wellness/longevity/circo2.html` → `assets/css/circo2.css` (bronze palette)
- `topics/wellness/brain-health/igenics.html` → `assets/css/igenics.css` (violet palette)
- `topics/wellness/metabolic-health/metabosana.html` → `assets/css/metabosana.css` (navy palette)

Todos os links estão também registrados no `README.md` com status `⏸ Awaiting`. Nenhum link de afiliado foi inventado — a página indica claramente "Awaiting Link" até que o usuário confirme.
