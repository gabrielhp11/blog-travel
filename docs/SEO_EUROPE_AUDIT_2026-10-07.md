# Auditoria de busca e desempenho para a Europa — 7 de outubro de 2026

Site: https://blog-travel-eight.vercel.app/ . Levantamento feito nas sessões autenticadas do Google Search Console e do Bing Webmaster Tools, no site público e nos arquivos do projeto. Não há dados suficientes para medir tráfego ou posições por país nesta data.

## Situação encontrada

**Google:** propriedade cadastrada e acessível. Relatórios de desempenho e indexação ainda em processamento. O sitemap `/sitemap.xml` foi enviado e lido em 6 de outubro, com status **Processado** e **50 páginas descobertas**. Isso não significa 50 páginas indexadas; o catálogo público já continha 68 URLs no início desta auditoria.

A inspeção da página inicial retornou **Detectada, mas não indexada no momento**, sem rastreamento anterior registrado. O teste ao vivo realizado em 7 de outubro às 18:13 BRT confirmou **O URL está disponível para o Google** e **É possível indexar a página**. Não foi identificado bloqueio de rastreamento nessa amostra.

**Bing:** propriedade cadastrada e acessível. A conta indicava relatórios em processamento, com prazo informado de até 48 horas. Após o carregamento da listagem, havia **um sitemap enviado em 6 de outubro**, status **Success**, com **17 URLs descobertas** e última leitura em 6 de outubro. A listagem inicialmente vazia era um estado transitório de carregamento. Não é possível inferir tráfego zero a partir de relatórios indisponíveis.

**Catálogo europeu:** o filtro “Europe · English” usava a comparação literal `market === 'Europe'`, excluindo 20 guias recentes cujo mercado foi descrito com expressões mais específicas. Havia 40 guias em inglês com público europeu identificado e sete guias em alemão. Não havia diretório próprio para esse público.

## Velocidade antes das alterações

Medições de laboratório do PageSpeed Insights, celular Moto G Power emulado, rede 4G lenta, Lighthouse 13.5.0, em 7 de outubro. Não há dados CrUX de usuários reais; estas medições não representam especificamente conexões na Europa e podem variar entre execuções.

- **Página inicial, 18:08 BRT:** desempenho 89, acessibilidade 96, boas práticas 100 e SEO 100. FCP/LCP 2,7 s; TBT 0 ms; CLS 0; Speed Index 4,4 s. [Relatório inicial](https://pagespeed.web.dev/analysis/https-blog-travel-eight-vercel-app/wtzifk7jtp?form_factor=mobile).
- **FastSEOHub Elite, 18:10 BRT:** desempenho 93, acessibilidade 96, boas práticas 100 e SEO 100. FCP/LCP 2,4 s; TBT 0 ms; CLS 0; Speed Index 4,1 s. [Relatório inicial](https://pagespeed.web.dev/analysis/https-blog-travel-eight-vercel-app-topics-business-marketing-tools-fastseohub-elite/diy9640x33?form_factor=mobile).

A home dependia de uma folha de fontes externa de aproximadamente 750 ms, além do CSS local. O PageSpeed estimou economia de 1.700 ms ao resolver recursos que bloqueavam a renderização; para o guia, 1.640 ms. São estimativas da ferramenta, não ganhos medidos. O contraste insuficiente afetava textos secundários da home e do guia.

## Alterações aplicadas

1. Fontes oficiais DM Sans, Inter, Manrope e Source Serif 4 servidas pela própria hospedagem, em WOFF2, com subconjuntos Latin e Latin Extended, nomes com hash, manifesto de origem e licenças SIL OFL. Retiradas as conexões externas de fontes; preload somente da fonte de corpo; `font-display: optional` permite exibir texto com a fonte de reserva em uma primeira visita lenta. Cache de um ano para os binários imutáveis.
2. Novo diretório indexável `/guides/europe`, com 40 guias em inglês e sete em alemão, links estáticos, títulos e descrição próprios, canonical e dados estruturados coerentes. Contexto de compra: idioma real do produto, moeda, tributos, renovação, licença, país de cobrança e diferença entre condições do Reino Unido e da UE. Não presume disponibilidade em todos os países.
3. Filtro europeu corrigido para considerar o público informado no catálogo; filtro **Deutsch** acrescentado. Navegação da home e dos diretórios passa a apontar para a página europeia. Conteúdo e links permanecem disponíveis sem JavaScript.
4. Textos secundários com contraste corrigido na home e em paletas de páginas com contraste abaixo do mínimo calculado; rótulos de leitura passam a identificar o guia correspondente para leitores de tela.
5. Sitemap atualizado para **69 URLs canônicas**: 63 guias, quatro diretórios, home e divulgação editorial. Mantidos arquivos de verificação, `robots.txt`, redirecionamentos permanentes, páginas incompletas com `noindex` e todos os links externos das ofertas, incluindo o novo link NEXTMETHOD indicado pelo usuário.
6. Verificações automáticas de arquivos e hashes das fontes, ausência de links externos de fontes, comportamento real dos filtros, catálogo, sitemap, imagens, idioma, links e dados estruturados. Geração repetida produz os mesmos arquivos.

Não foram criadas traduções artificiais, avaliações, promessas de resultados ou variantes hreflang entre produtos diferentes. Região não substitui idioma: uma página em inglês sobre um curso alemão continua informando o idioma do curso. Metatags geográficas e redirecionamento automático por IP não foram acrescentados.

## Verificação após publicação

A versão com as melhorias foi enviada ao GitHub no commit `eb5822f` e confirmada no site público em 7 de outubro. O diretório europeu carrega corretamente; as fontes retornam HTTP 200, `font/woff2` e `Cache-Control: public, max-age=31536000, immutable`, com resposta HIT da hospedagem na amostra verificada.

Novas medições às 18:20 BRT, com a mesma configuração móvel de laboratório:

- **Página inicial:** desempenho **99** (antes 89), acessibilidade **100** (antes 96), boas práticas 100 e SEO 100. FCP **1,2 s**, LCP **1,5 s**, TBT 0 ms, CLS 0 e Speed Index 3,6 s. [Relatório após publicação](https://pagespeed.web.dev/analysis/https-blog-travel-eight-vercel-app/4i19zp3v2s?form_factor=mobile).
- **FastSEOHub Elite:** desempenho **100** (antes 93), acessibilidade **100** (antes 96), boas práticas 100 e SEO 100. FCP **0,9 s**, LCP **1,2 s**, TBT 0 ms, CLS 0 e Speed Index 0,9 s. [Relatório após publicação](https://pagespeed.web.dev/analysis/https-blog-travel-eight-vercel-app-topics-business-marketing-tools-fastseohub-elite/putc9tcleu?form_factor=mobile).

**Google:** reenvio de `/sitemap.xml` confirmado pelo aviso “Sitemap enviado” e data de envio atualizada para 7 de outubro. A última leitura ainda era 6 de outubro, com 50 páginas encontradas; a releitura do arquivo com 69 URLs fica pendente do motor. O pedido manual de indexação da home retornou **cota diária excedida**. Não foi concluído e não deve ser repetido no mesmo dia. O sitemap recebido e os links públicos continuam permitindo descoberta normal.

**Bing:** o envio pelo formulário e a ação **Re-submit** da entrada existente falharam com erro do servidor. A entrada antiga, com 17 URLs descobertas, permanece no painel. O arquivo público atualizado também é anunciado em `robots.txt`; não afirmar que o Bing confirmou o novo envio.

**GitHub:** geração, validação de SEO, teste dos filtros, hashes de fontes, comparação dos links externos e consistência dos arquivos passaram localmente. A execução remota não iniciou por uma restrição da conta indicada no [registro do workflow](https://github.com/gabrielhp11/blog-travel/actions/runs/37688549309). A publicação na Vercel ocorreu normalmente; aprovação remota do workflow não foi confirmada.

## Limites e avaliação futura

Elegibilidade, envio de sitemap e nota 100 no teste técnico de SEO não garantem indexação, posição ou vendas. A indexação depende de Google e Bing. Não há evidência de aumento de tráfego nesta auditoria.

Quando os relatórios estiverem disponíveis, comparar períodos de 28 dias por página, consulta, país e dispositivo. Analisar Reino Unido e Irlanda para os guias em inglês e Alemanha/Áustria para os guias em alemão; expandir países conforme a disponibilidade real das ofertas e os dados de demanda. Não converter uma descrição editorial de público em promessa de entrega.

Para ampliar a Europa continental, produzir traduções revisadas de guias adequados a cada mercado e validar produto, idioma e condições locais antes de publicar. Usar hreflang somente entre versões equivalentes da mesma página. Nenhuma compra, assinatura, permissão adicional ou campanha paga foi feita nesta auditoria.

Fontes técnicas: [Google — sites multirregionais e multilíngues](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [Google — versões localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions), [Google — experiência da página](https://developers.google.com/search/docs/appearance/page-experience), [Google Fonts — CSS API](https://developers.google.com/fonts/docs/css2).
