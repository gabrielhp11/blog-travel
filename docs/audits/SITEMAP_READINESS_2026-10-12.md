# Sitemap e aptidão técnica — 12/10/2026

## Resultado ao vivo

As 78 URLs de `https://blog-travel-eight.vercel.app/sitemap.xml` passaram na auditoria de produção. Cada URL respondeu HTTP 200 sem seguir redirecionamentos, retornou HTML com título, H1 e conteúdo principal estático, teve exatamente um canonical igual ao endereço do sitemap e não apresentou `noindex`/`none` em meta robots/googlebot/bingbot ou X-Robots-Tag. O robots.txt respondeu 200, permitiu os caminhos e apontou para o sitemap correto. O conjunto publicado coincide com o sitemap local regenerado.

Não foram encontrados defeitos de acesso nas URLs do sitemap; não foi necessário remover páginas válidas ou liberar ofertas retidas para aumentar sua contagem. Rascunhos e páginas sem oferta confirmada continuam excluídos. Detalhes por URL: [auditoria JSON](sitemap-live-2026-10-12.json).

## Confirmações no Search Console

Inspeções individuais autenticadas mostraram “O URL está no Google” e “A página está indexada” para:

- `/topics/education/language-learning/babbel`
- `/topics/business/productivity/expertslides-powerpoint`
- `/topics/business/professional-learning/chargeback-prevention-masterclass`
- `/topics/business/creative-learning/social-media-masterclass`

Esses resultados são mais atuais que a classificação agregada registrada na revisão anterior, que mostrava os quatro exemplos como rastreados sem indexação. Não atribuir a mudança à revisão nem somar quatro páginas ao total agregado: as datas e os relatórios diferem. Não foi feita inspeção individual de todas as 78 URLs.

O teste em tempo real da Social Media Masterclass informou “O URL está disponível para o Google” e “É possível indexar a página”, com um item de breadcrumbs válido. Isso confirma o acesso do Google ao exemplo, não o estado de indexação de todas as páginas. O sitemap já havia sido enviado com sucesso nesta sessão em 12/10; não foi reenviado novamente sem mudança de URLs.

## Verificação permanente

Novo comando: `npm run seo:live`, ou `npm run seo:live -- report.json`. A auditoria falha diante de redirects, erros HTTP, canonicals conflitantes, restrições de indexação e divergência entre o sitemap publicado e o checkout. Por projeto, robots.txt permite todos os caminhos; qualquer Disallow não vazio exige revisão e reprova conservadoramente o check. O script não pretende interpretar políticas arbitrárias de robots.txt nem detectar todos os tipos de soft 404.

Três testes cobrem restrições nos cabeçalhos/metas, canonicals conflitantes e páginas vazias. As verificações completas de SEO passaram e a reconstrução manteve as 78 URLs sem alteração.

O workflow `Published sitemap validation` está preparado para execuções manuais e eventos de deployment concluído enviados ao GitHub. Porém a execução automática está impedida pela conta: o job do commit anterior não iniciou e sua anotação diz “The job was not started because your account is locked due to a billing issue.” [Execução consultada](https://github.com/gabrielhp11/blog-travel/actions/runs/38299217634). É necessário resolver a cobrança/bloqueio no GitHub para o workflow rodar. A validação local e a auditoria HTTP foram concluídas independentemente disso.

## Limite da garantia

Todos os endereços do sitemap estavam funcionais e sem os bloqueios técnicos verificados no momento da auditoria. Nenhum código, sitemap ou pedido manual garante a inclusão permanente de todas as páginas no índice. O Google seleciona o que indexar, considerando também conteúdo, duplicidade, relevância e suas políticas. [Requisitos técnicos oficiais](https://developers.google.com/search/docs/essentials/technical).
