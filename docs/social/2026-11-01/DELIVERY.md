# Campanha de suplementos — 01/11/2026

Concluída: **10 novos posts em cada rede (30 publicações), 10 Stories do Instagram e quatro destaques atualizados**. As dez artes foram geradas no Gemini web, baixadas pelo botão nativo e revisadas visualmente. O Instagram passou de 46 para 56 posts.

## Conteúdo e divulgação

QBX Chlorella, QBX Kräuteressenz, DigestiStart, PrimeBiome, FemiCore, Menovelle, MindSilence, RhythmONE, Primal Force Focus IQ e TonicGreens. Cada post aborda uma pergunta específica sobre rótulo ou compra e leva ao guia correspondente do blog.

O idioma das redes permanece inglês. Os dois guias QBX são em alemão para o contexto da Alemanha; isso está explícito nas legendas. A data real de revisão das fontes é 31/10/2026. Os guias usam links oficiais sem rastreamento; as legendas e artes refletem esse fato, sem reutilizar a indicação de afiliados das campanhas anteriores.

## Publicação verificada

- Pinterest: conta **PokiSky | Supplement Guides**, pasta **Supplement Buying Guides | PokiSky**. Dez recibos “Você criou um Pin!”, URLs públicas e presença dos dez títulos no perfil Criados. Divulgação de conteúdo por IA ativada.
- Facebook: página **PokiSky Supplement Guides**. Dez confirmações da Meta, detalhes marcados como publicados e links reais “Ver post no Facebook” registrados individualmente.
- Instagram: **pokisky.guides**. Dez URLs públicas identificadas pelo texto alternativo correspondente no perfil, que passou a mostrar 56 posts. Legendas específicas e texto alternativo para cada arte.
- Stories: publicados somente no Instagram, em quatro grupos por tema. Dez IDs novos confirmados; nenhum lote reenviado. O arquivamento automático estava ativado e foi conferido.

Os permalinks de todas as publicações estão em `posts.json`, `publication-receipts.json`, `POSTS.md` e nos três CSVs. Capturas e registros da interface estão em `evidence/`.

## Destaques

| Destaque | Anteriores | Novos | Total verificado | Link |
| --- | ---: | ---: | ---: | --- |
| Nutrition | 9 | 4 | 13 | [Abrir](https://www.instagram.com/stories/highlights/17894119074616970/) |
| Digestion | 4 | 3 | 7 | [Abrir](https://www.instagram.com/stories/highlights/18106038518269274/) |
| Brain | 3 | 2 | 5 | [Abrir](https://www.instagram.com/stories/highlights/18135495877669528/) |
| Longevity | 4 | 1 | 5 | [Abrir](https://www.instagram.com/stories/highlights/18076840808743676/) |

Todos os destaques foram reabertos após salvar para verificar a persistência da contagem. As seleções anteriores foram preservadas. Os 13 destaques do perfil agora representam 56 artes das campanhas acumuladas. Os IDs dos Stories desta campanha estão associados ao respectivo grupo; a ordem de processamento não foi usada para inventar associação individual.

## Arquivos e qualidade

- `images/`: dez originais finais do Gemini, 928 × 1152, sem cortes locais nem embalagens inventadas.
- `images-manifest.json`: dimensões, bytes, SHA-256, arquivo original de download e origem Gemini.
- `prompts.json`: prompts e as duas revisões necessárias para QBX Chlorella. Apenas a terceira versão dessa arte foi publicada.
- `POSTS.md` e CSVs: legendas, destinos com UTM e URLs publicadas.
- `publication-receipts.json` e `posts.json`: estados finais e recibos para impedir duplicações.
- `../WORKFLOW.md`: fluxo e aprendizados atualizados.

O Pinterest aceitou os originais de 928 pixels de largura, embora recomende pelo menos 1000. A Meta acomodou a arte inteira no fundo vertical dos Stories. O controle Adicionar link ficou indisponível para Stories do Instagram; não foi prometido link clicável. URLs na legenda do feed do Instagram são texto simples.

## Validação

Verificação da campanha: dez imagens revisadas, 30 publicações com URL e estado público verificado, limites das legendas, arquivos de origem e URLs de rastreamento corretos. Dez Stories em quatro destaques com contagens persistidas.

`node scripts/run-task.js check` passou: verificações de SEO de 127 páginas/115 guias, imagens, catálogo, experiência de compra, comparações, sete testes de infraestrutura e três testes de publicação editorial. Nenhuma alteração nas páginas públicas do blog foi necessária nesta campanha.
