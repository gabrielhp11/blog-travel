# Referência de padrão de páginas PokiSky

Este arquivo define o padrão mínimo para todas as páginas de review/landing do projeto e serve como guia de manutenção para novos itens e alterações futuras.

## 1. Padrão de URL e estrutura de arquivos

### Estrutura de pastas

- Home: `/index.html`
- Páginas de categoria: `/topics/{category}/{subcategory}/{slug}.html`
- Redirecionamentos curtos: definidos em `vercel.json`

### Convenção de nomes

- Usar slug em minúsculas
- Sem espaços, acentos ou caracteres especiais
- Usar hífen para separar palavras
- Nome do arquivo sempre no formato: `{slug}.html`

### Exemplos válidos

- `/topics/wellness/gut-health/ketosana.html`
- `/topics/wellness/brain-health/advanced-memory-formula.html`
- `/topics/business/ai-training/ki-training.html`

### Redirecionamentos

Toda página nova deve ter um redirect curto configurado em `vercel.json` quando fizer sentido para URL limpa.

Exemplo:

```json
{
  "source": "/ketosana",
  "destination": "/topics/wellness/gut-health/ketosana",
  "permanent": true
}
```

Regra:
- manter `cleanUrls: true`
- manter `trailingSlash: false`
- incluir redirect para a versão com e sem `.html` quando aplicável

---

## 2. Padrão visual e estrutural da página

Todas as páginas de review seguem o mesmo padrão editorial, independente da categoria.

### Estrutura obrigatória

1. `<!DOCTYPE html>` e `<html lang="en">`
2. `<head>` com:
   - `meta charset="UTF-8"`
   - `meta name="viewport"`
   - `<title>` exclusivo da página
   - `<meta name="description">`
   - `<link rel="canonical">`
   - meta tags Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`)
   - `preconnect` para Google Fonts
   - `link rel="stylesheet"` para `../../../assets/css/review.css`
   - `link rel="stylesheet"` para a CSS específica da página, quando existir
3. `<body>` com classe temática específica, quando houver:
   - `class="page-ket"`
   - `class="page-amf"`
   - `class="page-ki"`
4. Header (`.topbar`) com logo e navegação
5. `<main>` com seção hero
6. Seções de conteúdo em blocos (`section`)
7. Footer com assinatura editorial

### Estrutura mínima da hero

A página deve conter, no mínimo:

- breadcrumb
- eyebrow label
- headline principal
- lead text com benefício claro
- CTA principal e CTA secundário
- trust badges
- product card com imagem, nome, descrição e meta facts
- pelo menos três imagens relevantes e distintas por página; identificar ilustrações editoriais, incluir `alt`, dimensões e `loading="lazy"` nas imagens de apoio

### Estrutura recomendada de conteúdo

Cada página costuma seguir este fluxo:

1. Hero / introdução / proposta de valor
2. Benefícios principais (`#benefits` ou `#science`)
3. Ingredientes / pontos de valor (`#ingredients`)
4. Prova social / citação / autoridade
5. Pricing / oferta / comparativo, se aplicável
6. Garantia / risco reduzido
7. CTA final

### Blocos visuais comuns

- cards com `class="card"` ou `class="feature-grid"`
- `quote-box` para depoimentos/autoridade
- `guarantee-box` para política de devolução/segurança
- `cta-block` para conversão final
- `meta-list` para informações do produto

---

## 3. Padrão de copy e conteúdo editorial

### Tom da marca

- direto
- premium, mas sem excesso de hype
- focado em benefícios reais
- copy orientada para conversão sem perder clareza

### Regras de redação

- usar título principal com benefício ou promessa clara
- manter a mensagem do produto fácil de entender em 5 segundos
- explicar o que é, para quem é e por que importa
- incluir CTA visível e com ação específica
- priorizar leitura em mobile

### Metadados obrigatórios

Cada página deve ter:

- `title`
- `meta description`
- canonical URL
- Open Graph title / description / url / image

A imagem principal deve seguir a convenção:

`/assets/images/products/{slug}.jpg`

ou equivalente correto conforme arquivo real.

---

## 4. Padrão de navegação e links

### Navegação principal

A topbar da maioria das páginas usa:

```html
<nav class="nav-links" aria-label="Main navigation">
  <a href="/">Home</a>
  <a href="/#wellness">Wellness</a>
  <a href="/#travel">Travel</a>
  <a href="#benefits">Benefits</a>
  <a href="#ingredients">Ingredients</a>
  <a href="#routine">How it works</a>
</nav>
```

### CTA de afiliado

Todos os CTAs externos devem incluir:

```html
<a
  class="btn btn-primary"
  href="https://link-da-oferta#aff=gabrielhenriquep123f97e"
  target="_blank"
  rel="noopener sponsored nofollow"
>
  Nome do Botão →
</a>
```

Regras:
- sempre usar `target="_blank"`
- sempre usar `rel="noopener sponsored nofollow"`
- manter o `#aff=` nos links de afiliado

---

## 5. Padrão de organização da categoria

### Diretrizes por categoria

- `topics/business/` → produtos de renda, cursos, IA, educação digital
- `topics/wellness/` → saúde, longevidade, nutrição, energia, foco
- `topics/travel/` → passagens, hotéis, destinos, deals

### Exemplo de árvore

```text
topics/
  business/
    ai-training/
      ki-training.html
  wellness/
    gut-health/
      ketosana.html
    brain-health/
      advanced-memory-formula.html
  travel/
    flights/
      nova-pagina.html
```

---

## 6. Checklist para nova página

Antes de publicar uma nova página, revisar todos os itens abaixo:

- [ ] criar arquivo em pasta correta (`topics/.../.../{slug}.html`)
- [ ] definir slug em minúsculas e sem espaços
- [ ] criar SEO title e meta description
- [ ] inserir canonical e Open Graph
- [ ] incluir imagem do produto no caminho correto
- [ ] incluir CSS base e CSS específica, se houver
- [ ] manter estrutura de hero + benefícios + CTA
- [ ] criar botão de CTA com link de afiliado correto
- [ ] adicionar redirecionamento curto em `vercel.json`
- [ ] atualizar `URLS.md` e/ou lista relevante do conteúdo se necessário
- [ ] validar links internos e externos
- [ ] confirmar que a página funciona sem extensão `.html` pela regra `cleanUrls`

---

## 7. Template base de página

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title | PokiSky</title>
    <meta name="description" content="Descriptive text for the page." />
    <link rel="canonical" href="https://blog-travel-eight.vercel.app/topics/categoria/subcategoria/slug.html" />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="Page Title" />
    <meta property="og:description" content="Descriptive text for the page." />
    <meta property="og:url" content="https://blog-travel-eight.vercel.app/topics/categoria/subcategoria/slug.html" />
    <meta property="og:image" content="https://blog-travel-eight.vercel.app/assets/images/products/slug.jpg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../../assets/css/review.css" />
    <link rel="stylesheet" href="../../../assets/css/slug.css" />
  </head>
  <body class="page-slug">
    <header class="topbar">
      <div class="container nav">
        <a href="/" class="brand">
          <span class="brand-mark" aria-hidden="true">P</span>
          <span>PokiSky</span>
        </a>
        <nav class="nav-links" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/#wellness">Wellness</a>
          <a href="#benefits">Benefits</a>
          <a href="#ingredients">Ingredients</a>
          <a href="#routine">How it works</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container">
          <div class="breadcrumb">
            <a href="/">Home</a>
            <span class="breadcrumb-sep">/</span>
            <span>Category</span>
          </div>
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">Label</p>
              <h1>Headline principal</h1>
              <p class="lead">Lead copy com benefício claro.</p>
              <div class="cta-row">
                <a class="btn btn-primary" href="https://oferta.com#aff=gabrielhenriquep123f97e" target="_blank" rel="noopener sponsored nofollow">Call to action</a>
                <a class="btn btn-secondary" href="#ingredients">See details</a>
              </div>
              <div class="trust-badge-row">
                <span>Trust point 1</span>
                <span>Trust point 2</span>
                <span>Trust point 3</span>
              </div>
            </div>
            <div class="product-card">
              <img src="../../../assets/images/products/slug.jpg" alt="Product name" />
            </div>
          </div>
        </div>
      </section>

      <section id="benefits">
        <div class="container">
          <div class="feature-grid">
            <div class="card">...</div>
            <div class="card">...</div>
            <div class="card">...</div>
          </div>
        </div>
      </section>

      <section id="ingredients">
        <div class="container">
          <div class="ingredients-grid">...</div>
        </div>
      </section>

      <section id="routine">
        <div class="container">
          <div class="feature-grid">...</div>
        </div>
      </section>

      <section>
        <div class="container cta-block">
          <div>
            <p class="eyebrow">Ready?</p>
            <h2>Final conversion headline</h2>
            <p>Short explanation of the offer and why it matters.</p>
          </div>
          <a class="btn btn-primary" href="https://oferta.com#aff=gabrielhenriquep123f97e" target="_blank" rel="noopener sponsored nofollow">Get it now</a>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <span>PokiSky Editorial Desk</span>
        <span>Curated recommendations for smarter decisions.</span>
      </div>
    </footer>
  </body>
</html>
```

---

## 8. Registro de alterações

Toda alteração nova deve ser documentada nesta seção. Ao criar ou editar qualquer página, adicionar uma linha no topo da tabela abaixo.

| Data | Alteração | Arquivo(s) afetado(s) | Observação |
| --- | --- | --- | --- |
| 2026-10-06 | CircO2 físico, guia em inglês e três fotos oficiais | `topics/wellness/longevity/circo2.html`, `assets/`, `vercel.json`, `PRODUCTS.md`, `sitemap.xml` | Reino Unido e Irlanda; seis caixas ID 538695; atribuição conferida; estimativa de comissão condicionada à conta e câmbio |
| 2026-10-06 | Advanced Amino Formula físico, guia em inglês e três imagens oficiais | `topics/wellness/longevity/advanced-amino-formula.html`, `assets/`, `vercel.json`, `PRODUCTS.md`, `sitemap.xml` | Reino Unido e Irlanda; ID 472943 para seis frascos; atribuição verificada; comissão estimada condicionada ao pacote, câmbio e conta |
| 2026-10-06 | Social Media Masterclass em alemão, três imagens e link de afiliado | `topics/business/creative-learning/social-media-masterclass.html`, `assets/`, `vercel.json`, `PRODUCTS.md`, `sitemap.xml` | ID 646880; atribuição no checkout verificada; comissão de 50% anunciada em diretório, pendente de confirmação na conta |
| 2026-10-06 | Inclusão de duas imagens de apoio em cada uma das 21 páginas recentes | `topics/`, `assets/images/products/*-support-*.svg`, `assets/css/catalog-offers.css` | Mínimo de três imagens por página; ilustrações editoriais identificadas, carregamento lazy e grade responsiva |
| 2026-10-06 | Página de venda Excel-Paket em alemão, catálogo e URL curta | `topics/business/productivity/excel-paket.html`, `assets/`, `vercel.json`, `PRODUCTS.md`, `sitemap.xml` | ID 175711; redirecionamento e ID no checkout verificados; comissão anunciada pelo fornecedor, sem confirmação na conta |
| 2026-10-06 | Mais 10 ofertas Digistore24, com guias em inglês, idiomas dos produtos explícitos, ilustrações, FAQs e checkouts oficiais | `topics/`, `assets/`, `vercel.json`, `sitemap.xml`, `PRODUCTS.md` | Sem afiliação ou comissão confirmada; assinatura e compatibilidade destacadas |
| 2026-10-06 | Adição de 10 guias em inglês para o mercado europeu, com ilustrações editoriais locais, FAQs, CTAs, links oficiais e URLs curtas | `topics/`, `assets/`, `vercel.json`, `sitemap.xml`, `PRODUCTS.md` | Links oficiais sem rastreamento de afiliado; imagens identificadas como ilustrações |
| 2026-10-04 | Criação do guia de padrão de páginas e documentação das convenções do projeto | `PAGE_PATTERN_REFERENCE.md`, `README.md` | Definição inicial do padrão para novos itens |

---

## 9. Regra final

Qualquer item novo no projeto deve seguir este guia antes de ser publicado. O objetivo é manter consistência visual, URL, SEO e conversão em todas as páginas do blog.

Se uma página não seguir esses padrões, ela deve ser ajustada antes de entrar em produção.









































































































































































































































































































