# Revisão editorial dos guias — 17 de outubro de 2026

Base: `origin/main`, commit `1260a893bcfb3f8c1265928e75de4690c8cc1f9b`, obtido por `git fetch origin main`. As alterações incompletas do agente anterior foram retiradas do checkout antes desta revisão.

## Cobertura

- 87 arquivos HTML em `topics/` inspecionados: 70 guias de produto reescritos (67 públicos e 3 já retidos com `noindex`), 14 páginas de situação/redirecionamento preservadas, 1 artigo editorial gerado revisado e 2 páginas órfãs removidas.
- Títulos, H1, descrições, aberturas, apresentação de valor, perguntas de compra e CTAs receberam texto específico ao produto e ao público. Os idiomas originais foram preservados.
- As 70 meta descriptions reescritas têm 140–155 caracteres. Os títulos e descrições desses guias são únicos. Catálogo, home, diretórios, navegação e metadados foram regenerados.
- FAQs existentes foram refinadas com objeções específicas. Hackeando a Fluência, Pacote 4 Guias de Idiomas e Elite Travelhacking BasiX não tinham um contêiner de FAQ: seus checklists e estrutura foram mantidos, sem acrescentar seções.
- Acrescentadas 18 comparações de custo por porção do rótulo, distribuídas pelos três packs de BrainAMP, Integrative Digestive Formula, GLP-1 Plus, Curcumitol-Q, Pep Tonic e Advanced Vision Formula. Cálculo: preço registrado ÷ quantidade de unidades ÷ porções do rótulo por unidade; valores arredondados, sem frete ou impostos. Não representam recomendação de dose.

## Linguagem por comprador

- Profissionais e empresas: tarefa concreta, compatibilidade, licença comercial, integrações, limites e custo total, sem promessa de tráfego, vendas ou carreira.
- Alunos: idioma real do conteúdo, nível inicial, prática, liberação de aulas e período de acesso.
- Viajantes: itinerário, aparelho, hotspot, estação, ingresso escolhido, operador e cancelamento.
- Suplementos: forma, composição atribuída ao rótulo do fornecedor, limites dos blends, divergências, tamanho de pack e destino de entrega. Advertências e orientação para discutir adequação com profissional foram mantidas.

## Integridade e limites da revisão

A comparação automática de todas as páginas sobreviventes confirmou os mesmos elementos, classes e IDs no corpo original, fora dos blocos gerados de resumo/relacionados. Foram preservados os atributos de todas as imagens e os destinos/atributos de todos os links originais, inclusive fontes e afiliados. Idioma, `robots` e datas visíveis de consulta às fontes permanecem iguais aos da base.

`dateModified` foi atualizado para 2026-10-17 somente nos 70 guias com texto efetivamente alterado. Isso registra a revisão editorial; não afirma nova inspeção de cada checkout ou rótulo. Preços, ingredientes e condições são os registros atribuídos às fontes nas datas originais. Não se confirmou novamente toda a disponibilidade comercial, não houve compra, teste de produto, medição de conversão ou acesso ao Search Console.

A orientação geral sobre vitamina D foi conferida na [fonte NHS](https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/); a advertência já existente em Advanced Muscle Plus foi mantida. Não foram adicionados ratings, depoimentos ou structured data de Product/Review.

## Limpeza

- Removidos 22 arquivos/diretórios temporários da tentativa anterior: inventários, extratores, motores de reescrita, scripts de depuração, cache Python e ambiente `venv`. Dependências Node e ferramentas permanentes usadas pelo projeto foram mantidas.
- Removidos `topics/travel/flights/cheap-flights.html` e `topics/wellness/longevity/advanced-collagen.html`: páginas antigas sem entradas no catálogo, sitemap, aliases ou referências de navegação. Tinham alegações de economia/benefícios sem sustentação. Não eram os guias atuais de transporte ou Advanced Collagen Plus.
- Os backups da sessão foram salvos fora do repositório em `/tmp/pokisky-review/`; não fazem parte do deploy.

## Validação

- `npm run seo:build`: passou, com 78 URLs canônicas e 68 guias públicos (67 produtos e 1 artigo editorial).
- `npm run seo:check`: passou para SEO, Europa/performance, publicação editorial e experiência de compra.
- Auditoria de integridade sobre todas as páginas: passou.
- `git diff --check`: passou.
- Conferência visual local: hero do BrainAMP inspecionado. A tentativa posterior de abrir outros guias encontrou conexão local recusada; não se afirma cobertura visual completa ou teste móvel.
- `npm run posts:test`: passou, 3/3 testes, incluindo a geração e validação de todas as pautas preparadas em cópia isolada. A execução inicial no sandbox encontrou `spawnSync npm EPERM`; a execução autorizada com subprocessos liberados passou.
- Segundo `seo:build`: idêntico em 101 arquivos monitorados, confirmado por SHA-256.

## Inventário por página

| Arquivo | Situação | Ângulo editorial / título |
| --- | --- | --- |
| `topics/business/accessories-business/vivendo-de-acessorios.html` | Reescrito | Vivendo de Acessórios: Fornecedores e Custo do Curso |
| `topics/business/ai-training/agent-x.html` | Reescrito | Agent X: AI Marketing Workflows, Licence & $475 Offer |
| `topics/business/ai-training/ki-training.html` | Reescrito | KI-Training: Free German AI Webinar & Email Signup |
| `topics/business/course/advanced-program.html` | Reescrito | Aivatar Academy: Free Webinar or Paid Membership? |
| `topics/business/course/business-program.html` | Retido/redirecionamento preservado | Business Program listing under review |
| `topics/business/creative-learning/dennis-schmelz-lightroom-presets.html` | Reescrito | Dennis Schmelz Lightroom Presets: 18 Presets & Licence |
| `topics/business/creative-learning/domestika-plus.html` | Reescrito | Domestika Plus: Course Credits, Access & Renewal |
| `topics/business/creative-learning/prejudice-slog3-luts.html` | Reescrito | Prejudice LUTs: Sony A7S III SLOG3 Compatibility |
| `topics/business/creative-learning/skillshare.html` | Reescrito | Skillshare: Creative Classes, Trial & Annual Renewal |
| `topics/business/creative-learning/social-media-masterclass.html` | Reescrito | Social Media Masterclass: 9 Module, KI-Tools & Kosten |
| `topics/business/design-tools/canva-pro.html` | Reescrito | Canva Pro: Brand Kits, Free Plan Comparison & Licence |
| `topics/business/digital-skills/coachy-premium.html` | Reescrito | Coachy Premium: One-Course Limit & Annual Cost |
| `topics/business/digital-skills/hook-mastery.html` | Reescrito | Hook Mastery: Marketing Hooks, Examples & Course Gaps |
| `topics/business/digital-skills/kiwify-Afb7xyL.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-Afb7xyL |
| `topics/business/digital-skills/kiwify-EKe5iSs.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-EKe5iSs |
| `topics/business/digital-skills/kiwify-PRCmj8S.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-PRCmj8S |
| `topics/business/digital-skills/kiwify-ejyON0S.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-ejyON0S |
| `topics/business/digital-skills/kiwify-itNNPGK.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-itNNPGK |
| `topics/business/digital-skills/remixable-founder.html` | Reescrito | Remixable Founder: Creation Tools & Instalment Totals |
| `topics/business/family-learning/empowered-parenting.html` | Reescrito | Empowered Parenting: School Engagement Bundle & Cost |
| `topics/business/finance-ai/chartsensor.html` | Reescrito | ChartSensor: English Chart Learning, Access Pending |
| `topics/business/finance-ai/ia-para-financas.html` | Reescrito | IA para Finanças: ChatGPT, Python, n8n e custos |
| `topics/business/marketing-tools/fastseohub-elite.html` | Reescrito | FastSEOHub Elite: $197 Voucher, Audit Limits & Licence |
| `topics/business/marketing-tools/funnelcockpit-standard.html` | Reescrito | FunnelCockpit Standard: 1-€-Test & Jahreskosten |
| `topics/business/marketing-tools/salesforge-pro.html` | Reescrito | SalesForge Pro: HTML Export, $447 Cost & Licence |
| `topics/business/marketing-tools/traffic-genius.html` | Reescrito | Traffic Genius: Video Tools & $997 vs Instalment Costs |
| `topics/business/marketing-tools/ultimate-viddeos-ai.html` | Reescrito | Ultimate Viddeos AI: $897 Annual Plan & Tool Limits |
| `topics/business/productivity/excel-paket.html` | Reescrito | Excel-Paket: Über 70 Vorlagen & Versionskompatibilität |
| `topics/business/productivity/expertslides-powerpoint.html` | Reescrito | ExpertSlides: PowerPoint Add-In, Trial & Annual Cost |
| `topics/business/professional-learning/chargeback-prevention-masterclass.html` | Reescrito | NEXTMETHOD: Written Dispute Training & $225 Offer |
| `topics/business/professional-learning/coursera-plus.html` | Reescrito | Coursera Plus: Included Programmes & Subscription Cost |
| `topics/business/professional-learning/key-account-management-training.html` | Reescrito | Key Account Management: 49 Videos & PPTX Templates |
| `topics/business/professional-learning/leadership-crash-course.html` | Reescrito | Leadership Crash Course: 50 Videos & 12-Month Access |
| `topics/business/professional-learning/sap-ewm-supercharged.html` | Reescrito | SAP EWM Supercharged: 10 Topics in About 25 Minutes |
| `topics/business/technical-training/sap-ewm-complete-pack.html` | Reescrito | SAP EWM Complete Pack: Course Bundle & Access Checks |
| `topics/business/vehicle-buying/metodo-adl.html` | Reescrito | Método ADL: Curso de Veículos, Custos e Documentação |
| `topics/education/fitness-learning/supp-up-travel-system.html` | Reescrito | SUPP UP.: Travel PDFs, Download Limits & $247 Offer |
| `topics/education/holistic-learning/ayurveda-komplett-ausbildung.html` | Reescrito | Ayurveda Komplett-Ausbildung: Module & Gesamtkosten |
| `topics/education/language-learning/babbel.html` | Reescrito | Babbel: Language Levels, Self-Study Access & Renewal |
| `topics/education/language-learning/hackeando-a-fluencia.html` | Reescrito | Hackeando a Fluência: 16 Semanas, App e Acesso |
| `topics/education/language-learning/mega-sprachen-reise-englisch.html` | Reescrito | megaSPRACHEN Reise-Englisch: 121 Lessons in German |
| `topics/education/language-learning/mystery-of-nils.html` | Reescrito | The Mystery of Nils: A1/A2 Norwegian & Monthly Access |
| `topics/education/language-learning/pacote-4-guias-idiomas.html` | Reescrito | Pacote 4 Guias de Idiomas: PDFs e Prazo de Download |
| `topics/education/language-learning/spanish-slow-and-easy.html` | Reescrito | Spanish Slow and Easy: Short Audio & Latin America |
| `topics/education/music-learning/boogie-woogie-piano-course-prerequisites.html` | Artigo gerado revisado | Boogie woogie piano course: are you ready for the beginner lessons? |
| `topics/education/music-learning/endlich-klavier-spielen.html` | Reescrito | Endlich Klavier Spielen: Premiumkurs für Erwachsene |
| `topics/education/music-learning/piano-boogie-woogie.html` | Reescrito | Piano Boogie Woogie: German Lessons & Playing Level |
| `topics/education/pet-learning/herdenschutzhund-kurs.html` | Reescrito | Herdenschutzhund-Kurs: Inhalte, Jahreszugang & Kosten |
| `topics/education/technical-training/consertaflix.html` | Reescrito | ConsertaFlix: Assinatura de Reparo de Celulares |
| `topics/education/technical-training/et-akademie-dozenten-paket.html` | Reescrito | ET-Akademie Dozenten-Paket: Lehrmaterial & Nutzungsrecht |
| `topics/education/technical-training/raspberry-pi-for-beginners.html` | Reescrito | Raspberry Pi for Beginners: 25 Lessons & Older Setup |
| `topics/entertainment/retro-gaming/gpbox.html` | Reescrito | GPBOX: Requisitos Windows, Armazenamento e Licenças |
| `topics/travel/connectivity/airalo.html` | Reescrito | Airalo: eSIM Country Coverage, Data & Activation |
| `topics/travel/connectivity/holafly.html` | Reescrito | Holafly: Unlimited Data, Hotspot & Trip Package Rules |
| `topics/travel/deals/kiwify-CVGGqrZ.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-CVGGqrZ |
| `topics/travel/deals/kiwify-Tusc9nl.html` | Retido/redirecionamento preservado | Offer details pending · kiwify-Tusc9nl |
| `topics/travel/deals/kiwify-rYAlC2Q.html` | Retido/redirecionamento preservado | Oferta identificada: Hackeando a Fluência |
| `topics/travel/experiences/civitatis.html` | Reescrito | Civitatis: Tour Language, Inclusions & Booking Terms |
| `topics/travel/experiences/getyourguide.html` | Reescrito | GetYourGuide: Ticket Options, Operators & Cancellation |
| `topics/travel/flights/cheap-flights.html` | Órfão removido | — |
| `topics/travel/points-and-miles/elite-travelhacking-basix.html` | Reescrito | Elite Travelhacking BasiX: Curso em Alemão e Milhas |
| `topics/travel/transport/omio.html` | Reescrito | Omio: Door-to-Door Fares, Baggage & Separate Tickets |
| `topics/wellness/brain-health/advanced-memory-formula.html` | Reescrito | Advanced Memory Formula: 11 Ingredients to Compare |
| `topics/wellness/brain-health/brainamp.html` | Reescrito | BrainAMP: Paraxanthine Label & 3-Bottle Cost |
| `topics/wellness/brain-health/igenics.html` | Retido/redirecionamento preservado | Igenics · Details pending |
| `topics/wellness/gut-health/cleansesana.html` | Retido/redirecionamento preservado | CleanSeSana listing under review |
| `topics/wellness/gut-health/integrative-digestive-formula.html` | Reescrito | Integrative Digestive Formula: Blend Label & Pack Costs |
| `topics/wellness/gut-health/ketosana.html` | Reescrito | KetoSana: Liquid Drops & Seller Formula Checks |
| `topics/wellness/joint-health/advanced-joint-support.html` | Reescrito | Advanced Joint Support: Tablet Count & UK Order Costs |
| `topics/wellness/longevity/advanced-amino-formula.html` | Reescrito | Advanced Amino Formula: 8-Amino-Acid Blend & Costs |
| `topics/wellness/longevity/advanced-collagen.html` | Órfão removido | — |
| `topics/wellness/longevity/advanced-mitochondrial-formula.html` | Reescrito | Advanced Mitochondrial Formula: CoQ10 Label & Costs |
| `topics/wellness/longevity/circo2.html` | Reescrito | CircO2: Dissolving Tablet Label & 6-Box Costs |
| `topics/wellness/longevity/collagen.html` | Reescrito | Advanced Collagen Plus: Powder Sources & Label Checks |
| `topics/wellness/longevity/vigorsana.html` | Reescrito | VigorSana: Zinc, Niacin & Full-Label Buying Checks |
| `topics/wellness/mens-health/advanced-prostate-formula.html` | Reescrito | Advanced Prostate Formula: Serving Size & Label Gaps |
| `topics/wellness/mens-health/prime-perform-pro.html` | Reescrito | Prime Perform Pro: Botanicals & Capsule Label Checks |
| `topics/wellness/mens-health/spartamax.html` | Reescrito | SpartaMax: Gummy Format & 7-Ingredient Label Checks |
| `topics/wellness/metabolic-health/blood-sugar-blaster.html` | Retido/redirecionamento preservado | Blood Sugar Blaster · Details pending |
| `topics/wellness/metabolic-health/glp-1-plus.html` | Reescrito | GLP-1 Plus: Dihydroberberine Label & Pack Costs |
| `topics/wellness/metabolic-health/glucotrust.html` | Retido/redirecionamento preservado | Oferta identificada: Hackeando a Fluência |
| `topics/wellness/metabolic-health/metabosana.html` | Retido/redirecionamento preservado | Offer details pending · metabosana |
| `topics/wellness/nutrition/advanced-muscle-plus.html` | Reescrito | Advanced Muscle Plus: Vitamin D Caution & HMB Label |
| `topics/wellness/nutrition/curcumitol-q.html` | Reescrito | Curcumitol-Q: Curcumin, Quercetin & 6-Bottle Cost |
| `topics/wellness/nutrition/eznaturals-moringa.html` | Reescrito | EZNaturals Moringa: Powder, Extracts & US Pack Costs |
| `topics/wellness/nutrition/pep-tonic.html` | Reescrito | Pep Tonic: 10 g Scoop Label & Powder Pack Costs |
| `topics/wellness/vision-health/advanced-vision-formula.html` | Reescrito | Advanced Vision Formula: Lutein Label & Tablet Costs |

## Ofertas sem dados suficientes para publicação

As páginas retidas continuam fora do catálogo público e do sitemap. Não se inventou conteúdo promocional para completar cadastros não identificados.

- `topics/business/course/business-program.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/business/digital-skills/kiwify-Afb7xyL.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/business/digital-skills/kiwify-EKe5iSs.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/business/digital-skills/kiwify-PRCmj8S.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/business/digital-skills/kiwify-ejyON0S.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/business/digital-skills/kiwify-itNNPGK.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/travel/deals/kiwify-CVGGqrZ.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/travel/deals/kiwify-Tusc9nl.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/travel/deals/kiwify-rYAlC2Q.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/wellness/brain-health/igenics.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/wellness/gut-health/cleansesana.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/wellness/metabolic-health/blood-sugar-blaster.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/wellness/metabolic-health/glucotrust.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.
- `topics/wellness/metabolic-health/metabosana.html`: situação anterior preservada; faltam identidade, rótulo ou oferta confirmados, ou é alias que já encaminha ao guia correto.

ChartSensor e SAP EWM Complete Pack receberam revisão de texto, mas continuam com seus bloqueios anteriores de afiliação/verificação. GPBOX continua `noindex`; revisão de copy não confirma direitos de distribuição dos jogos.
