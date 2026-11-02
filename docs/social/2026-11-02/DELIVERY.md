# Campanha de suplementos — 02/11/2026

Concluída: **oito posts novos em cada rede (24 publicações), oito Stories do Instagram e três destaques atualizados**. Oito artes finais geradas no Gemini web, baixadas pelo botão nativo e revisadas visualmente. O Instagram passou de 56 para 64 posts.

## Cobertura e nova rodada

A auditoria `coverage.json` cruzou os guias públicos com as campanhas anteriores e os 33 posts migrados para Stories. Há 44 suplementos individuais públicos e dez guias comparativos. CleanSeSana permanece oculto e foi excluído.

Antes desta campanha, 37 suplementos tinham registro de post individual. Os sete restantes foram publicados primeiro, nas três redes, nesta ordem:

1. Advanced Prostate Formula — formulação e divergência entre narrativa e rótulo.
2. GLP-1 Plus — categoria do produto e leitura além do nome.
3. KetoSana — formato líquido e necessidade do rótulo completo.
4. Prime Perform Pro — quantidades e verificação de compatibilidade.
5. SpartaMax — ingredientes e detalhes além do formato em goma.
6. VigorSana — informações além dos dois nutrientes destacados.
7. BrainAMP — forma dos ingredientes e base da porção.

BrainAMP já aparecia em comparativos; esses posts não substituíam o primeiro post individual. GlucoTrust German foi identificado como o guia já publicado GlucoTrust auf Deutsch. Após confirmar os sete envios nas três redes, o oitavo post inaugurou a próxima rodada: **Alpha Dualis**, com nova arte e enfoque em conteúdo do pacote, valor integral e devolução.

Resultado: **44 de 44 suplementos públicos com cobertura individual registrada**. Nas próximas campanhas, verificar se novos guias foram adicionados e priorizá-los; depois reutilizar os produtos com outro assunto, arte e legenda. A preferência está registrada em `../WORKFLOW.md`.

## Publicações verificadas

- Pinterest: **PokiSky | Supplement Guides**, pasta **Supplement Buying Guides | PokiSky**. Oito recibos de criação, URLs públicas e oito títulos conferidos no perfil Criados. Identificação de conteúdo por IA ativada.
- Facebook: **PokiSky Supplement Guides**. Oito confirmações da Meta e permalinks reais extraídos de “Ver post no Facebook” nos detalhes publicados.
- Instagram: **pokisky.guides**. Oito URLs públicas correspondentes aos textos alternativos das artes; perfil com 64 posts.
- Stories: oito imagens publicadas somente no Instagram, em três lotes por tema. Os oito IDs novos foram confirmados sem reenviar os lotes. O arquivamento automático estava ligado.

Legendas em inglês, como nos perfis. O post KetoSana informa que a página do fornecedor revisada era em alemão. Os guias desta campanha contêm links de afiliado; as legendas informam isso no início, e as artes incluem “AI editorial illustration · Affiliate guide”. Datas reais de revisão das fontes foram mantidas; preços históricos não foram anunciados como atuais.

## Destaques

| Destaque | Anteriores | Novos | Total persistido | Link |
| --- | ---: | ---: | ---: | --- |
| Mens Health | 2 | 5 | 7 | [Abrir](https://www.instagram.com/stories/highlights/17902761246386168/) |
| Metabolic | 10 | 2 | 12 | [Abrir](https://www.instagram.com/stories/highlights/18183830125429638/) |
| Brain | 5 | 1 | 6 | [Abrir](https://www.instagram.com/stories/highlights/18135495877669528/) |

Todos foram reabertos após salvar: contagens e presença dos novos IDs conferidas. Stories anteriores preservados. Os 13 destaques do perfil agora reúnem 64 artes das campanhas acumuladas. IDs agrupados por assunto, sem inventar uma correspondência individual baseada na ordem de processamento.

## Arquivos e evidências

`posts.json` e `publication-receipts.json` contêm os estados finais e links. `POSTS.md`, três CSVs e `prompts.json` guardam as legendas, destinos e prompts. `images/` contém os oito originais finais; `images-manifest.json` registra origem Gemini, dimensões, bytes e SHA-256. `evidence/` guarda comprovantes das publicações, perfis, Stories e seleções persistidas.

A primeira arte Prime Perform Pro não tinha rodapé e foi substituída por uma nova versão do Gemini antes de publicar. Somente a versão final está em `images/`. Os originais de 928 × 1152 foram publicados inteiros. A Meta acomodou as artes no fundo vertical do Story. O Pinterest aceitou a largura de 928 pixels apesar de recomendar 1000.

O controle de link dos Stories ficou indisponível para Instagram nesta interface; não foi prometido link clicável. Endereços nas legendas do feed do Instagram são texto simples.

## Validação

- Oito artes revisadas, 24 URLs públicas verificadas, oito Stories em três destaques com seleções persistidas.
- Limites das legendas, arquivos de origem, UTM por rede, hashes e dimensões conferidos.
- Auditoria de cobertura: 44 suplementos individuais cobertos e nenhum restante; sete primeiros posts individuais precederam o novo enfoque de Alpha Dualis.
- `node scripts/run-task.js check` aprovado: verificações de SEO de 127 páginas e 115 guias, imagens, ícones, links, catálogo, comparações, 13 testes de infraestrutura/links e três testes de publicação editorial.

Não foi necessário alterar as páginas públicas do blog. O fluxo de commit e push normal mantém os registros desta campanha no GitHub.
