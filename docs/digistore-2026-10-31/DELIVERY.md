# Dez novos guias de suplementos

Criados a pedido do usuário a partir de ofertas consultadas no marketplace autenticado da Digistore24. Fontes e rótulos foram conferidos em **31/10/2026**; a entrega foi concluída em **01/11/2026**. O lote contém oito guias em inglês para contexto de compra nos EUA e dois em alemão para a Alemanha.

| Produto | Marketplace | Guia |
| --- | --- | --- |
| QBX Chlorella 500 mg | 59504 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/nutrition/qbx-chlorella) |
| QBX 2-in-1 Kräuteressenz | 59513 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/gut-health/qbx-kraeuteressenz) |
| DigestiStart | 52958 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/gut-health/digestistart) |
| PrimeBiome | 50539 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/gut-health/primebiome) |
| FemiCore | 55175 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/nutrition/femicore) |
| Menovelle | 52420 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/nutrition/menovelle) |
| MindSilence | 58629 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/brain-health/mindsilence) |
| RhythmONE | 58851 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/longevity/rhythmone) |
| Primal Force Focus IQ | 50962 | [Abrir guia](https://blog-travel-eight.vercel.app/topics/wellness/brain-health/focus-iq) |
| TonicGreens | 43141 | [Abrir review](https://blog-travel-eight.vercel.app/topics/wellness/nutrition/tonicgreens-review) |

## Conteúdo e limites

Cada página tem abertura específica, três imagens oficiais distintas, transcrição seletiva do painel, tabela de pacotes, condições de entrega e devolução, perguntas próprias e links para as fontes. Não há teste pessoal, avaliações inventadas, promessa clínica ou embalagem criada artificialmente.

- QBX: sulfites na Chlorella; porções e mínimo de três meses das opções de assinatura; a proporção dos extratos da essência não foi confundida com dose individual.
- DigestiStart: mistura única de 500 mg, cápsula de gelatina, custos de frete conflitantes e prazo de devolução versus sugestão de três meses.
- PrimeBiome: 500 milhões de CFU separados da mistura de 430 mg; identificação de cepa e garantia até a validade não presumidas. Checkout inicial de dois frascos mostrou $158 e rejeitou Brasil, sem cotação completa de endereço.
- FemiCore: mistura vegetal de 350 mg e probiótica de 50 mg; mg não convertidos para CFU. A política diverge entre data do pedido e da entrega.
- Menovelle: quatro entradas de 266 mg e uma mistura conjunta de 266 mg; 60 cápsulas não tratadas como 60 porções.
- MindSilence: divergência de 15 e 30 bilhões de CFU no próprio rótulo; condições da garantia de 365 dias não descritas como reembolso incondicional de todos os custos.
- RhythmONE: alerta explícito do rótulo de que a segurança não foi determinada, dose adicional não recomendada e política de devolução incompleta mantidos visíveis.
- Focus IQ: painel atual da loja, peixe como alérgeno, compra única versus autoship. A solicitação de afiliação preexistente continuava pendente.
- TonicGreens: rótulo de 4,4 g por colher incompatível com entradas de 5 g de carboidratos e 2 g de proteína; sem correção inventada. Devolução contada do envio, não da entrega. A página foi identificada como review, sem assumir a identidade do fornecedor.

Os dez guias usam **links oficiais sem rastreamento**. A presença no marketplace não foi representada como aprovação de afiliação. Não foram aceitos novos contratos, enviadas solicitações ou realizadas compras. Lymphatic System Support ficou fora porque a apresentação disponível não ofereceu informação suficiente para este lote. Produtos já publicados não foram duplicados.

## Arquivos e manutenção

- `content/digistore-supplements-20261031.json`: texto, fontes, identidade, IDs e data real da revisão.
- `scripts/generate-digistore-supplement-guides.js`: geração integrada a `seo:build`, com catálogo, aberturas, cenários de decisão e aliases.
- `downloaded-assets.json`: procedência das 30 imagens, dimensões decodificadas e hashes. Os arquivos foram convertidos sem recorte para PNG; não houve edição criativa.
- `assets/images/sources/manifest.json`: registro central das imagens utilizadas.
- Observações brutas e temporárias de navegação ficaram somente em `.cache/`, fora do Git.

## Validação

`node scripts/run-task.js seo:build check` passou: 127 páginas indexáveis, 115 guias, sete testes de infraestrutura e três testes editoriais. Verificação das 30 imagens e dos links internos incluída no processo existente.

A conferência no Chrome cobriu as dez páginas em 320×568, 360×640 e 1366×768, sem transbordamento horizontal e com imagem principal carregada; no celular, imagem antes dos botões. Geometria registrada em `evidence/responsive-checks.json`. Capturas de tela mostram a janela visível do Chrome, que tinha tradução automática para português; o idioma dos arquivos publicados permanece o do catálogo. A largura da captura da janela pode ser menor que a viewport de desktop medida.

Publicado: commit de conteúdo `893c485` enviado normalmente para `origin/main`. A geração repetida após o commit não alterou arquivos. A verificação em produção passou nas **127 páginas** do sitemap, incluindo os dez novos guias, sem falhas de HTTP, conteúdo estático, canonical ou bloqueios de indexação. As **30 novas imagens** responderam HTTP 200 com tipo de imagem. Recibos: `live-validation.json` e `live-images.json`. Isso não comprova indexação pelo Google. Captura pública: `evidence/primebiome-published.png`.
