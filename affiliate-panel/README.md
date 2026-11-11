# PokiSky Affiliate Panel

Aplicação separada para o programa de afiliados do blog estático. O site público permanece no diretório raiz e continua sendo publicado sem depender deste app. Publique `affiliate-panel/` como um projeto Vercel independente (Root Directory = `affiliate-panel`) e associe, por exemplo, `afiliados.seudominio.com`.

## Recursos implementados

- Login exclusivo Google OAuth e criação automática de perfil/código no primeiro acesso.
- Piloto limitado a cinco contas afiliadas por slots transacionais no PostgreSQL; administradores não ocupam vaga.
- Dashboard de afiliado, links curtos e diretos, histórico de cliques/vendas e solicitação PIX.
- Área administrativa habilitada exclusivamente por `ADMIN_EMAILS`, com lista/detalhes de afiliados, bloqueio e gestão de saques.
- PostgreSQL + Prisma; PIX criptografado com AES-256-GCM, IP armazenado como HMAC-SHA-256.
- Redirect `/r/CODIGO`, tracking de links diretos por script opcional, janela de atribuição de 30 dias e modelo first-click (ou last-click).
- Webhook autenticado por HMAC com timestamp, janela anti-replay, limites de payload e idempotência por plataforma/ID externo.
- Validação Zod, verificação de origem em alterações autenticadas e tracking, rate limit Redis (Upstash obrigatório em produção), auditoria e headers de segurança.

O sistema não cria nem estima vendas. A plataforma de origem deve enviar o postback assinado, incluindo o código do afiliado, e confirmar quando uma comissão pode ser liberada.
O piloto tem cinco vagas de afiliado. O limite é imposto no banco para evitar cadastros concorrentes acima da capacidade; o painel administrativo mostra as vagas ocupadas.

## Requisitos

- Node.js 22.6+
- PostgreSQL (Neon, Supabase, Railway ou outro PostgreSQL compatível)
- Projeto Google OAuth com URLs autorizadas abaixo
- Upstash Redis REST para deploy de produção
- URL HTTPS própria para o painel em produção

## Configuração local

```powershell
cd affiliate-panel
Copy-Item .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Edite `.env` antes de iniciar. Gere segredos fortes localmente; não reutilize os exemplos:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Use uma chave diferente para cada uma destas variáveis:

- `AUTH_SECRET`: segredo aleatório de sessão Auth.js (mínimo 32 caracteres).
- `IP_HASH_SECRET`: segredo HMAC independente para anonimizar IPs.
- `PII_ENCRYPTION_KEY`: 32 bytes aleatórios codificados em base64 (exatamente 44 caracteres normalmente). Crie com `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.
- `WEBHOOK_SECRET`: segredo compartilhado com o serviço que assina postbacks.

Configurar também `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`, `DATABASE_URL`, `AUTH_URL`, `APP_ORIGIN` (URL do painel), `BLOG_ORIGIN` (origem exata do blog, sem barra final), `ADMIN_EMAILS` (lista de e-mails Google separados por vírgula), `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`. `MINIMUM_PAYOUT_BRL` define o saque mínimo e `ATTRIBUTION_MODEL` aceita `first` ou `last`.

No Google Cloud Console, cadastre:

- Authorized JavaScript origin: `APP_ORIGIN`
- Authorized redirect URI: `${AUTH_URL}/api/auth/callback/google`

O perfil só recebe papel administrativo se o e-mail Google autenticado estiver em `ADMIN_EMAILS`. Não existe endpoint público para elevar privilégios.

## Publicação Vercel

1. Importe o mesmo repositório em um novo projeto Vercel e selecione `affiliate-panel` como Root Directory.
2. Configure PostgreSQL, Upstash Redis e todas as variáveis de ambiente de produção, com URLs HTTPS exatas em `AUTH_URL`, `APP_ORIGIN` e `BLOG_ORIGIN`.
3. Configure o Google OAuth para o domínio final e cadastre `${AUTH_URL}/api/auth/callback/google` como redirect URI autorizada.
4. Aplique as migrations antes do primeiro login com `npm run db:deploy`; inclua `prisma migrate deploy && npm run build` no comando de build do Vercel para manter o schema atualizado.
5. Configure a integração de postback em cada rede antes de considerar vendas atribuídas.
6. Para aumentar o limite do piloto, altere `MAX_AFFILIATES`, crie slots adicionais por migration e atualize o texto e a métrica do painel; não aumente somente a constante.

Os arquivos de deploy do blog na raiz não são alterados por este app; o projeto Vercel atual continua estático.

## Integração do blog e links

Links curtos gerados pelo dashboard usam `APP_ORIGIN/r/CODIGO?path=%2F...`. O redirect registra o clique e encaminha o visitante à URL do blog com `?ref=CODIGO`. O script de integração mantém um cookie próprio no domínio do blog por 30 dias. O build do blog injeta automaticamente o script nas páginas HTML públicas usando `AFFILIATE_PANEL_ORIGIN` (padrão: `https://affiliate-panel-cyan.vercel.app`); não é necessário editar cada página manualmente. Se usar outro domínio para o painel, configure essa variável no build do blog e rode `npm run seo:build`.

O endpoint aceita requisições do `BLOG_ORIGIN` exato. Se o blog passar a usar CSP, permita o host do painel em `script-src` e `connect-src`. O script remove `ref` e o marcador técnico da barra de endereço depois de armazenar a atribuição. O script é opcional para links curtos, mas necessário para atribuição de links diretos `?ref=CODIGO` e para persistir o código no navegador do blog.

Para encaminhar a atribuição a uma plataforma externa, inclua o valor de `window.PokiSkyAffiliate.getCode()` no campo de referência/subID que a rede disponibiliza. O nome desse parâmetro e sua habilitação dependem de cada conta/plataforma; o painel não modifica links de checkout automaticamente.

## Orientação para afiliados

O painel inclui um guia introdutório em **Como conseguir vendas**. Em resumo, priorize conteúdo orgânico original que resolva uma dúvida real, escolha o guia de destino correspondente, use uma chamada clara e informe visivelmente que pode receber comissão. Não faça spam, avaliações falsas ou promessas sem comprovação.

Para anúncios pagos, confirme primeiro as regras da plataforma de afiliados e da rede de anúncios, divulgue a relação comercial e teste com um orçamento pequeno que possa perder. Compare gasto com vendas efetivamente confirmadas antes de escalar; cliques sozinhos não representam vendas nem garantem comissão. Cada rede pode aplicar sua própria janela e modelo de atribuição, independentemente do cookie de 30 dias do blog.

## Webhook de vendas

Endpoint: `POST ${APP_ORIGIN}/api/sales/webhook`. Corpo JSON:

```json
{
  "platform": "hotmart",
  "externalId": "pedido-unico-123",
  "affiliateCode": "A1B2C3D4",
  "productName": "Produto",
  "saleValue": "199.90",
  "status": "confirmed",
  "timestamp": 1790000000
}
```

Envie `X-Webhook-Signature: sha256=<hex>` com `HMAC-SHA256(WEBHOOK_SECRET, corpo-JSON-exato)` e `Origin` igual a um dos valores em `WEBHOOK_ALLOWED_ORIGINS` quando a plataforma enviar esse cabeçalho. Webhooks servidor-servidor sem `Origin` são autorizados somente com assinatura válida, timestamp com diferença máxima de cinco minutos e segredo forte. A integração deve mapear identificadores únicos e garantir que os timestamps usem Unix em segundos.

Cada novo evento gera uma venda com comissão de 80% (o programa retém 20%). `pending` não libera saldo; `confirmed` libera; status subsequentes `confirmed` ou `reversed` atualizam a mesma venda pela chave `(platform, externalId)`. Eventos repetidos são idempotentes. Uma reversão reduz as comissões acumuladas e pode tornar o saldo negativo se a comissão já tiver sido sacada; esse saldo bloqueia novos saques até ser compensado.

## Pagamentos e auditoria

- A solicitação exige chave PIX válida e saldo disponível, bloqueia o valor em transação e aplica um limite de três solicitações/dia por conta.
- Administradores aprovam a solicitação, executam o PIX fora do sistema e então marcam como pago. Rejeição devolve o saldo reservado.
- O painel registra eventos de saques, bloqueios, vendas via webhook e processamento administrativo. Consulte `AuditLog` no PostgreSQL para auditoria.
- A aplicação registra somente hash HMAC de IP, user-agent truncado e origem sem query string em cliques.

## Comandos

```powershell
npm run typecheck
npm test
npm run build
npm run db:studio
```

Crie e revise migrations em desenvolvimento antes de `npm run db:deploy` em produção. Mantenha os segredos fora do Git. Faça retenção/expurgo conforme política de privacidade e obrigações legais aplicáveis.
