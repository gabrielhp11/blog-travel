# Aberturas de produto e imagens — 17/10/2026

## Alteração

O padrão agora abre com uma descrição curta da natureza e finalidade do item, no idioma e para o público do guia, e uma imagem visível. No celular, a ordem visual é introdução → imagem → botões e informações extensas. As duas imagens de apoio permanecem no artigo. Disclosure, termos, avisos relevantes, conteúdo do rótulo e atributos dos links de afiliado foram preservados.

Foram preparados 71 guias completos: 68 públicos (67 produtos e um artigo editorial) e três rascunhos com conteúdo próprio. ChartSensor, SAP EWM Complete Pack e GPBOX continuam `noindex`, com as restrições anteriores. Cadastros incompletos e redirects não receberam imagens que simulassem produtos ainda não identificados.

A auditoria inicial encontrou 13 guias públicos sem imagem dentro da hero, embora o HTML tivesse três imagens no total. Outros exibiam a imagem depois de muito texto no celular. A validação anterior contava URLs, mas não verificava a posição visual nem o carregamento real.

## Imagens

As 72 imagens externas utilizadas nos guias completos foram obtidas e decodificadas. Foram mantidas 71 cópias dos arquivos originais em `assets/images/sources/`, com dimensões reais, fonte, data de obtenção e checksum no manifesto. O acesso inicial a algumas fontes falhou com 403 ou formato não reconhecido; as tentativas com formatos compatíveis concluíram a recuperação. A data de obtenção da imagem não equivale a uma nova revisão comercial ou clínica do produto.

Uma animação do webinar de Aivatar Academy, com cerca de 28 MB, foi substituída por um SVG editorial leve, identificado como ilustração e sem simular a interface. O arquivo pesado foi removido do projeto. Gráficos de ganhos do vendedor não foram promovidos a imagem principal; nos guias de KI-Training e Hook Mastery, a abertura usa uma ilustração de estudo claramente identificada.

O novo validador exige uma imagem principal local, prioritária e não lazy, duas imagens de apoio lazy, texto de finalidade e três arquivos com checksums distintos. Ele também verifica a integridade das cópias contra o manifesto. Imagens oficiais, fotos de contexto e ilustrações continuam diferenciadas pelas legendas.

## Verificação

- 68 guias públicos em 320×568, 360×640 e 1366×768: 204 verificações no navegador. Em todos, a imagem principal carregou, a descrição inicial ficou visível, havia ao menos três imagens e não houve rolagem horizontal. No menor tamanho, o guia mais longo ainda exibiu mais de 100 px de altura da imagem; no tamanho 360×640 todos exibiram os 200 px completos.
- Conferência visual de exemplos: ConsertaFlix no celular e Advanced Collagen Plus no computador. A imagem tem enquadramento `contain`, sem recortar a embalagem.
- Comparação de todas as 85 páginas sobreviventes em `topics/`: destinos externos, `target`, `rel` e datas visíveis das fontes foram preservados.
- `seo:build` e `seo:check`: passaram. A reconstrução repetida foi idêntica nos arquivos gerados monitorados.
- `posts:test`: três testes passaram, incluindo a geração e validação de todas as pautas futuras em cópia isolada.
- A nova etapa faz parte do build; os artigos editoriais futuros passam pelo mesmo preparador sem antecipar sua publicação.

Os resultados do navegador estão em [auditoria por URL e tela](audits/PRODUCT_OPENING_2026-10-17.json). A validação cobre posição e carregamento da imagem principal, não testes de uso dos produtos ou promessa de resultados.
