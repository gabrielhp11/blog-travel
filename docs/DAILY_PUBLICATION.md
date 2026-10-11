# Publicações diárias — Europa e EUA

Fila inicial preparada em 11 de outubro de 2026. Conteúdo completo em `content/editorial-posts.json`; esse diretório não é enviado à Vercel. Os rascunhos não possuem página pública, redirect, catálogo ou entrada no sitemap até a liberação explícita. O build é determinístico e nunca publica pela passagem do tempo.

- 11/10: requisitos do curso Piano Boogie Woogie, Europa; página publicada aponta para o item 45 já cadastrado. Oferta em alemão, artigo em inglês; link oficial sem comissão configurada.
- 12/10 às 09h BRT: Canva Free ou Pro, Europa; item 26. Três tarefas para decidir a assinatura; link oficial sem comissão configurada.
- 13/10 às 09h BRT: entrega, custo total e devolução da EZNaturals Moringa, EUA; item 78. Acesso ao guia com afiliado existente; nenhuma disponibilidade europeia presumida.
- 14/10 às 09h BRT: rotina de norueguês A1/A2 com The Mystery of Nils, Europa; item 36. Assinatura mensal, sem comissão configurada.

Todos os textos usam pelo menos três imagens locais distintas identificadas como ilustrações editoriais. Nenhum texto simula teste, depoimento, resultado ou volume de palavras-chave. Cada pauta responde a uma decisão diferente da visão geral do produto e direciona ao guia registrado; sem redirecionamento automático do leitor.

## Rotina de liberação

A programação usa um retorno diário a este chat do Codex. Depende de computador ligado, aplicativo em execução e acesso ao projeto e ao GitHub, conforme a documentação oficial: https://learn.chatgpt.com/docs/automations?surface=app . Não depende de GitHub Actions, cuja execução estava restrita na auditoria anterior.

Antes de liberar, conferir `git status`, sincronizar com `origin` usando fast-forward e revalidar as fontes do próximo item. Se houver alterações de usuário ou execução concorrente, preservar o trabalho e não incluí-lo no commit automático. Se preço, acesso, elegibilidade ou fonte tiver mudado, ajustar apenas a pauta e registrar a revisão real; não avançar a data de revisão sem reler o conteúdo.

`npm run posts:next -- --dry-run` mostra a próxima pauta vencida. `npm run posts:next` libera no máximo uma por dia no fuso America/Sao_Paulo, com a data efetiva; atrasos não despejam todos os rascunhos de uma vez. Reexecutar `npm run seo:build`, `npm run seo:check` e os testes da fila se a lógica mudar. Registrar a liberação em `docs/PRODUCTS.md` e no histórico do padrão. Commit e push normal para `origin`; confirmar HTTP 200, texto, canonical e links na Vercel antes de informar publicação. Se o push falhar, informar o impedimento e tentar reenviar o commit pendente antes de liberar nova pauta.

Após a terceira pauta, desativar a programação e informar o esgotamento da fila. Preparar mais pautas requer uma nova rodada de seleção; não continuar automaticamente sem fim.

## Sinais de procura consultados em 11/10

Google Search Console autenticado, pesquisa Web, sete dias, dados visíveis de 5 a 9 de outubro, atualização há 50 horas: 3 cliques, 12 impressões, CTR 25% e posição média 8,3. Países: Brasil 3 cliques/9 impressões; Estados Unidos 0 cliques/3 impressões. Nenhuma linha europeia disponível. Esses números não provam crescimento na Europa ou vendas.

A tabela de páginas mostrava Piano Boogie Woogie com 1 clique/3 impressões, Canva Pro e The Mystery of Nils com 1 clique/2 impressões cada. O total de linhas dessa tabela divergia do agregado superior: registrar como sinais exploratórios, não somar nem usar para calcular ranking ou ganho. A única consulta identificável era “consertaflix”, fora do foco Europa/EUA solicitado depois pelo usuário. Não há volumes de palavras-chave por produto ou país para classificar “os melhores” com confiança.

Moringa entra como pauta editorial dos EUA, pela oferta já registrada e pela prioridade geográfica do usuário; não foi observada procura específica por essa marca. Canva e os cursos europeus recebem pautas de decisão, não cópias do guia original.

Bing Webmaster Tools autenticado com autorização do usuário: Search Performance ainda exibe “Please check back in 48 hours while we prepare the data for your site”. Demanda do Bing não medida; não interpretar como tráfego zero.

## Verificação antes do envio

O sitemap público anterior continha 76 páginas: todas responderam HTTP 200, assim como 124 recursos locais distintos referenciados nessas páginas. Imagens remotas de fornecedores não foram incluídas nessa varredura. A validação local após a inclusão do guia americano preparado e do artigo de piano cobre 78 páginas, 68 entradas no catálogo e seis diretórios. Três testes da fila passaram, incluindo a simulação das três liberações futuras em cópia temporária. A prévia de 390 px não apresentou rolagem horizontal; imagem principal carregou e as imagens de apoio usam lazy loading.
