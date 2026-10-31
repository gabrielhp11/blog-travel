# Fluxo de redes sociais da PokiSky

Atualizado em 30/10/2026 a pedido do usuário para servir de memória das próximas campanhas.

## Preferências e referências

- Criar posts apenas de suplementos quando esse for o escopo pedido; não misturar viagens ou cursos.
- Gerar as próximas artes no Gemini web, conforme preferência expressa em 30/10/2026. Não iniciar geração em outra ferramenta sem necessidade ou nova orientação.
- Manter inglês nos perfis de suplementos, conforme o padrão existente. Conferir o idioma do guia e do público antes de adaptar itens em francês ou alemão.
- Instagram: `https://www.instagram.com/pokisky.guides/`, nome PokiSky | Supplement Guides.
- Facebook: página PokiSky Supplement Guides, conforme os registros anteriores. Conferir a identidade selecionada antes de publicar.
- Pinterest: usar a conta e a pasta de suplementos existentes; confirmar seus nomes na interface. Exemplos publicados e links estão em `2026-10-28/posts.json`.
- A configuração inicial de Instagram em `instagram/PROFILE.md` é histórica. O arquivo `../../../instagram-migration-status.json`, fora do repositório, registra publicações posteriores e conexão com Facebook. Conferir o estado atual na interface; não interpretar a descrição inicial de perfil vazio como atual.

## Preparar a campanha

1. Ler `AGENTS.md`, este fluxo, o último `posts.json` e os guias do blog. Checar os posts já publicados para evitar duplicação de arte, título e enfoque.
2. Selecionar a quantidade de itens ou novos enfoques solicitada pelo usuário. Cada um precisa de uma pergunta concreta e um guia existente, sem inventar teste pessoal, preço atual, resultado de saúde ou benefício clínico.
3. Criar `docs/social/AAAA-MM-DD/` com `posts.json`, `POSTS.md`, três CSVs, prompts, `images/`, manifesto e evidências quando houver publicação. Não sobrescrever campanhas anteriores.
4. Preparar legendas específicas para Pinterest, Facebook e Instagram. Incluir divulgação de afiliados no início e identificação de ilustração editorial por IA. Direcionar ao guia do blog, não diretamente ao checkout.
5. Usar URLs públicas sem `.html` com `utm_source` de cada rede, `utm_medium=organic_social`, campanha e identificador do post. Não atribuir a hoje uma revisão de fornecedor que não foi feita.

## Gerar e salvar no Gemini

1. Selecionar o Chrome e a aba Gemini aberta pelo usuário; usar a sessão existente. Abrir conversa nova quando necessário.
2. Preferir colar o prompt completo no campo de mensagem. Conferir o conteúdo antes de clicar em Enviar. Digitação longa por caracteres pode demorar e deixar prompt incompleto.
3. Pedir uma arte por vez, proporção 4:5 para feed compartilhado ou 2:3 para Pin dedicado. Manter nome, marca e avisos dentro de margens seguras. Não cortar automaticamente uma arte com texto.
4. Usar composições distintas e tipografia legível em celular. Não inventar embalagem, rótulo, logotipo oficial, depoimento ou resultado. Identificar a arte como editorial.
5. Esperar a conclusão, inspecionar a imagem e usar o botão nativo Baixar imagem no tamanho original. Salvar uma cópia definitiva em `images/`. Registrar origem, dimensões e SHA-256. Uma imagem apenas visível no chat ainda não é arquivo entregue.
6. Nesta sessão, `downloadMedia` não encontrou corretamente o elemento e acabou abrindo o endereço direto da imagem; evitar repetir esse caminho. Os índices da árvore de acessibilidade mudam: observar novamente após cada mudança de página.
7. Se houver interrupção de segurança ou falha para validar a URL do navegador, parar as interações e informar o impedimento. Retomar pela aba Gemini aberta pelo usuário quando houver nova instrução e o acesso voltar. Não baixar via requisição externa para contornar o bloqueio.

## Pinterest

1. Conferir conta, pasta e ausência de duplicata. Abrir criação de Pin.
2. Enviar o arquivo local revisado. Preencher título, descrição, URL específica de Pinterest e texto alternativo descritivo.
3. Conferir prévia, texto da arte, link e divulgação. Publicar quando a solicitação incluir postagem.
4. Abrir o Pin publicado, registrar URL pública e capturar evidência. Só então marcar `published`.

## Facebook

1. Selecionar PokiSky Supplement Guides no Facebook ou Meta Business Suite; conferir a identidade e o destino.
2. Criar publicação com a arte correspondente e a legenda de Facebook, incluindo o link específico. Conferir a prévia e eventual corte.
3. Adicionar texto alternativo quando disponível e manter avisos legíveis. Revisar destinos de publicação; não pressupor que Instagram esteja selecionado.
4. Após publicar, verificar a entrada em conteúdo Publicado e a publicação pública. Registrar URL/ID e evidência; sucesso em uma rede não confirma outra.

## Instagram

1. Conferir `pokisky.guides`, evitar duplicatas e escolher publicação de feed.
2. Enviar a arte revisada. Conferir o enquadramento completo, preservando título, marca e avisos. Avançar à legenda e acessibilidade.
3. Inserir a legenda própria de Instagram, hashtags pertinentes e texto alternativo. URLs na legenda são texto simples; não descrevê-las como links clicáveis.
4. Só escrever “link in bio” depois de verificar que há um link externo clicável no perfil. O campo Website já apresentou limitação no editor web; a conexão Facebook/Instagram não comprova a configuração desse link.
5. Publicar quando solicitado, abrir a publicação e registrar URL pública e evidência. Ao usar publicação conjunta pelo Meta, conferir as duas redes separadamente.
6. Stories e destaques são ações separadas. Não considerar que publicar o feed os criou. O plano histórico e o status de migração podem divergir; o estado atual verificado prevalece.

## Concluir e retomar

- Distinguir `prepared`, `uploaded`, `published` e `verified`. Não marcar uma tentativa como publicação confirmada.
- Registrar URLs por rede e eventuais pendências item a item. Antes de repetir uma ação após erro, verificar se ela já foi concluída para evitar duplicação.
- Preservar a sessão do usuário e abas pessoais. Não salvar senhas, códigos ou dados de autenticação nos documentos.
- Validar os arquivos afetados, criar commit e fazer push normal para `origin`, conforme a autorização permanente do projeto. Não usar force-push.
- Ao retomar uma campanha, ler seu `DELIVERY.md` e `posts.json` para continuar do ponto exato.

## Retomada da campanha de 30/10/2026

Os cinco posts de 30/10 foram publicados nas três redes e seus cinco destaques foram criados. O usuário posteriormente reautorizou envio ao GitHub ao final do trabalho. Consultar `2026-10-30/posts.json` e as evidências para os links e IDs; o texto histórico inicial de `DELIVERY.md` contém etapas anteriores e não representa o estado final. O trabalho adicional com 33 posts existentes tem controle separado em `2026-10-30/other-posts/plan.json` e `story-group-receipts.json`; não tratá-lo como concluído quando ainda houver itens preparados ou apenas submetidos.

## Stories e destaques pela Meta — fluxo verificado

1. No Instagram, a opção **Salvar story em Itens Arquivados** estava desligada e foi ativada em 30/10. Conferir seu estado antes de novas campanhas; o arquivamento permite preservar os Stories.
2. Na Meta Business Suite da PokiSky, abrir Conteúdo → Stories → Criar story. A conta usa `business_id=1797870504751927` e `asset_id=1441439982376766`; confirmar a identidade na interface.
3. Para pedidos de Stories do Instagram, desmarcar Facebook em Compartilhar em e manter somente `pokisky.guides`. Enviar até dez imagens por lote. A prévia acomoda a arte completa com fundo no formato do Story; conferir que os textos não foram cortados.
4. A ordem de finalização do upload pode diferir da ordem dos arquivos. Não associar IDs a imagens apenas pela posição de upload. Publicar em grupos por assunto ou identificar as miniaturas na seleção de destaques.
5. Esperar **Seu story foi publicado** e conferir a lista de Stories ativos. `Adicionar link` ficou indisponível para Instagram nesta interface; não afirmar que há um link clicável no Story.
6. Na mesma página, a seção **Destaques do Instagram** oferece **Novo** e os destaques existentes. Essa ferramenta permite selecionar Stories ativos, mesmo quando o seletor de destaques do Instagram web aparece vazio.
7. Localizar o botão cujo conteúdo é **Novo**, em vez de usar o primeiro botão com nome genérico **Abrir a célula de destaques do Instagram**. Os índices e a ordem podem mudar após carregar ou salvar.
8. Criar ou editar o destaque, selecionar as miniaturas corretas e conferir a contagem de Stories selecionados. Usar títulos curtos, em inglês, com até 16 caracteres, e preservar os Stories já selecionados ao acrescentar outros.
9. Conferir a criação/edição na Meta e os links dos destaques no perfil público. Registrar IDs de Stories, nome, URL do destaque e evidência. Não repetir lotes já publicados para contornar uma demora de carregamento.

## Campanha de 31/10/2026

O usuário solicitou oito novos posts de suplementos nas três redes, com imagens geradas no Gemini, publicação nos Stories e salvamento nos destaques. O controle é `2026-10-31/posts.json`. Gerar e revisar as oito imagens antes de publicar. Manter o fluxo normal de validação e envio ao GitHub ao concluir.


Status verificado em 31/10: campanha dos oito suplementos concluída nas três redes, Stories e cinco destaques de assunto. Links, IDs e evidências em `2026-10-31/DELIVERY.md` e `posts.json`. O destaque Nutrition foi criado com cinco Stories antigos e recebeu os quatro novos (total 9). Brain e Digestion foram criados; Joints e Longevity preservaram os anteriores.

Se o aviso “Seu story foi publicado” desaparecer, conferir os novos IDs na biblioteca de destaques antes de reenviar. Lotes com várias imagens podem continuar processando uma imagem após as demais; exigir que a diferença de IDs corresponda à quantidade do lote.


Organização de destaques: Nutrition (aminoácidos, moringa e Pep Tonic), Brain, Digestion, Longevity, Joints, Metabolic, Sleep, Hair, Mens Health e Collagen. Preservar também os destaques Labels, Formulas e Vision. A tarefa dos posts antigos usa as artes originais do próprio feed; a preferência Gemini se aplica às novas artes solicitadas.


Conclusão em 31/10: os 33 posts existentes também foram publicados como Stories e salvos nos destaques por tema. A fila de `2026-10-30/other-posts/plan.json` está integralmente `published_and_in_highlight`; consultar os recibos antes de repetir qualquer publicação. Somando os 5 posts de 30/10, os 33 anteriores e os 8 novos, os destaques reúnem 46 artes.
