# PokiSky — Blog de ofertas de viagem e produtos de estilo de vida

Site editorial de ofertas de viagem com foco em conversão, redirecionamento para ofertas de afiliados e páginas de review com estrutura clara e alta legibilidade.

## Visão geral

Este projeto foi estruturado para funcionar como um blog editorial de viagens, wellness e produtividade, com páginas de revisão de produtos, CTAs de afiliado e uma interface simples para publicar novos conteúdos sem depender de frameworks pesados.

O objetivo principal é:

- publicar conteúdos com orientação editorial
- direcionar o usuário para ofertas relevantes
- manter a base estável em HTML/CSS/JS puro
- facilitar manutenção e expansão por categoria

## Estrutura principal

```text
blog-travel/
├── index.html
├── README.md
├── vercel.json
├── cleansesana.html
├── ketosana.html
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── review.css
│   └── js/
│       ├── articles.js
│       └── main.js
├── topics/
│   ├── business/
│   │   └── digital-skills/
│   │       └── hook-mastery.html
│   ├── wellness/
│   │   ├── gut-health/
│   │   │   ├── cleansesana.html
│   │   │   └── ketosana.html
│   │   ├── longevity/
│   │   │   ├── advanced-collagen.html
│   │   │   └── vigorsana.html
│   │   └── mens-health/
│   │       └── spartamax.html
│   └── travel/
│       └── deals/
└── public/
```

## Como funciona

A estrutura usa:

- HTML para as páginas de conteúdo e landing pages
- CSS para identidade visual e layout editorial
- JavaScript leve para renderização e filtros, quando necessário
- redirecionamento simples para páginas de review e ofertas afiliadas

As páginas de revisão seguem um padrão consistente:

- headline principal com benefício claro
- bloco de CTA de conversão
- benefícios em cards
- prova social / trust badges
- lista de ingredientes ou pontos de valor
- seção de conversão final

## Publicação e deploy

O projeto foi pensado para funcionar em hosts estáticos, com destaque para:

- Vercel
- GitHub Pages
- qualquer ambiente estático com suporte a arquivos HTML

A configuração de rotas está em `vercel.json`, permitindo URLs limpas e redirecionamentos previsíveis.

## Fluxo editorial

A lógica de conteúdo do projeto é simples:

1. O usuário entra na home e encontra os tópicos principais.
2. Navega por categorias em wellness, travel e business.
3. Entra em uma landing page ou review page com proposta clara.
4. A CTA leva para a oferta afiliada correspondente.

## Convenções

- A marca principal é PokiSky.
- O tom editorial é direto, premium e orientado para benefícios.
- O foco é informar antes de vender, sem perder a objetividade.
- As páginas seguem uma linguagem de conversão moderna, com copy simples e forte valor percebido.

## Boas práticas aplicadas

- URLs sem ruído e redirecionamento limpo
- meta title, description e Open Graph para SEO e compartilhamento
- acessibilidade básica em navegação e texto
- CTA visível em destaque e sem excesso de elementos distraidores
- design enxuto para priorizar conversão

## Observação de manutenção

Para adicionar uma nova oferta, o ideal é:

- criar a página de review/landing em seu diretório correto
- definir título, metadados e CTA do produto
- manter a mesma estrutura visual da marca
- atualizar o link da oferta afiliada e o copy do benefício principal

## Repositório

- GitHub: https://github.com/gabrielhp11/blog-travel
- Site: https://blog-travel-eight.vercel.app

## Licença

Este repositório foi desenvolvido para uso editorial e de marketing de afiliados. Ajustes, expansão de categorias e novas páginas podem ser feitos livremente conforme a estratégia da marca.
