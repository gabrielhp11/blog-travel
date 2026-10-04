# PokiSky — Blog de ofertas de viagem, bem-estar e rotina inteligente

Bem-vindo ao repositório do **PokiSky**, um blog editorial focado em recomendações práticas de viagens, bem-estar, produtividade e estilo de vida. A proposta da marca é simples: apresentar opções **úteis**, **objetivas** e com boa narrativa, conectando o leitor diretamente a produtos relevantes sem excesso de ruído.

## Visão geral

Este projeto funciona como um portal de conteúdo editorial com páginas de review e páginas de conversão para ofertas de afiliados. A estrutura foi pensada para crescer em tópicos e facilitar a manutenção sem perder consistência visual ou a clareza da mensagem.

O site combina:
- **recomendação editorial** clara e baseada em benefício
- **páginas de venda** com foco em valor prático
- **links diretos de afiliado** com total transparência
- **arquitetura modular** por categoria e subtema
- **experiência enxuta** e mobile-friendly

## Objetivo do projeto

- apresentar produtos com contexto e benefício claro
- manter textos coerentes e persuasivos em toda a plataforma
- reduzir fricção entre interesse do leitor e ação de compra
- centralizar conteúdo em um blog estático fácil de publicar e manter
- manter a experiência visual elegante, profissional e consistente

## Estrutura do repositório

```bash
blog-travel/
├── index.html                 # Página inicial (portal principal)
├── cleansesana.html           # Redirecionamento do produto CleanSeSana
├── ketosana.html              # Redirecionamento do produto KetoSana
├── README.md                  # Documentação do projeto
├── vercel.json                # Configuração de deploy no Vercel
├── blog.js                    # Dados dos artigos da homepage
├── script.js                  # Lógica principal da página inicial
├── styles.css                 # Estilos globais do portal
├── assets/
│   ├── css/
│   │   ├── main.css           # Estilos do portal principal
│   │   ├── review.css         # Padrão reutilizável para pages de review
│   │   ├── cleansesana.css    # Paleta específica: verde digestivo
│   │   └── ketosana.css       # Paleta específica: energia/metabolismo
│   ├── js/
│   │   ├── articles.js        # Base de dados de artigos
│   │   └── main.js            # Lógica de renderização e filtros
│   └── images/
│       └── products/          # Imagens dos produtos
└── topics/
    ├── business/
    │   └── ai-training/
    │       └── ki-training.html
    └── wellness/
        ├── brain-health/
        │   └── advanced-memory-formula.html
        ├── mens-health/
        │   └── prime-perform-pro.html
        └── gut-health/
            ├── cleansesana.html
            └── ketosana.html
```

## Padrão das páginas de venda

Todas as páginas de oferta/review seguem uma estrutura editorial consistente:

1. **Header navegável** com logo e links (Home, categoria, seção)
2. **Breadcrumb** para contexto de navegação
3. **Hero section** com:
   - Eyebrow (tagline de categoria)
   - H1 (headline principal do benefício)
   - Lead copy (2-3 linhas explicando a proposta)
   - CTA primário (botão de compra/order)
   - CTA secundário (Ver ingredientes / Saiba mais)
   - Trust badges (3 pilares principais)
4. **Product card** com:
   - Imagem do produto
   - Nome e tagline
   - Meta-informações (foco, tipo, público, formato)
5. **Seção de benefícios** (3-4 cards com numeração)
6. **Seção de ingredientes/composição** com detalhes técnicos
7. **Placa visual** com figura e copy reflexivo
8. **Quote/testimonial** de cliente verificado
9. **Seção "Como funciona"** ou "Como usar" (4 cards)
10. **CTA final** com imagem e chamada para ação
11. **Footer** com assinatura da marca

## Fluxo editorial

Cada página de venda segue uma progressão lógica:

1. **Problema/oportunidade**: o que o leitor sente ou quer melhorar
2. **Solução**: apresentar o produto de forma clara
3. **Prova**: mostrar benef benefícios, ingredientes, uso prático
4. **Confiança**: testimonial, prova social, clareza técnica
5. **Ação**: múltiplos CTAs bem posicionados

O tom de voz é sempre:
- Claro e objetivo (sem jargão desnecessário)
- Baseado em benefício real (não em hype)
- Respeitoso com o leitor (sem agressividade comercial)
- Consistente com a identidade PokiSky

## Links de afiliado

Todo link segue estes padrões:
- Abre em nova aba (`target="_blank"`)
- Usa atributo de segurança (`rel="noopener sponsored nofollow"`)
- Inclui o parâmetro de afiliado específico
- Aponta para a landing page oficial do produto

Exemplo:
```html
<a
  href="https://cleansesana.com/cleansesana-pdp-fe#aff=gabrielhenriquep123f97e"
  target="_blank"
  rel="noopener sponsored nofollow"
>
  Obter CleanSeSana →
</a>
```

## Como adicionar uma nova página de venda

1. **Crie o arquivo HTML** em `topics/<vertical>/<subtopic>/<produto-slug>.html`
2. **Use um template existente** como base (copie de cleansesana.html ou ketosana.html)
3. **Adapte o copy** mantendo a estrutura e a lógica editorial
4. **Configure a paleta CSS** (crie `assets/css/<slug>.css` se necessário)
5. **Registre em `assets/js/articles.js`** com os dados do artigo
6. **Teste responsividade** em mobile
7. **Commit e push** para main

## Deploy

O projeto é hospedado no **Vercel** e publica automaticamente a partir do GitHub.

Fluxo de publicação:
```bash
git add .
git commit -m "feat: atualiza página de venda de [Produto]"
git push origin main
```

Vercel realiza build e publica em menos de 60 segundos.

## Observações importantes

- Linguagem deve ser clara, direta e orientada ao benefício
- Evitar repetição excessiva de frases entre seções
- Cada seção tem função editorial específica: problema → solução → prova → ação
- Design deve manter elegância e profissionalismo
- Mobile-first: testar em dispositivos antes de publicar

## Páginas de venda ativas (2026-10-04)

| Produto | Status | URL |
|---------|--------|-----|
| KI-Training | ✅ Live | `/topics/business/ai-training/ki-training.html` |
| Advanced Memory Formula | ✅ Live | `/topics/wellness/brain-health/advanced-memory-formula.html` |
| Prime Perform Pro | ✅ Live | `/topics/wellness/mens-health/prime-perform-pro.html` |
| CleanSeSana | ✅ Live | `/topics/wellness/gut-health/cleansesana.html` |
| KetoSana | ✅ Live | `/topics/wellness/gut-health/ketosana.html` |

## Resumo da marca

PokiSky é um blog de recomendações práticas para pessoas que querem **viver melhor**, **viajar melhor** e **escolher produtos com clareza**. A marca valoriza **conteúdo útil**, **estética limpa** e **decisões mais inteligentes** no dia a dia.

---

**PokiSky** — conteúdo útil, escolha inteligente e sem fricção.
