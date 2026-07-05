> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Design System Guideline

## Status deste arquivo

Este arquivo agora funciona como `porta de entrada canônica` para a documentação visual atual do projeto.

Grande parte do conteúdo que antes existia aqui descrevia fases anteriores do site e misturava referências válidas com decisões já superadas. Para evitar ambiguidade, a documentação foi desmembrada em guias específicos e atualizados.

## Documentos atuais

- [Identidade Visual Atual](./identidade-visual-atual.md)
- [Guia de Design Atual](./guia-de-design-atual.md)
- [Branding Guide Atual](./branding-guide-atual.md)

## Como usar esta documentação

### Se você precisa entender a expressão visual do site

Leia primeiro:

- [Identidade Visual Atual](./identidade-visual-atual.md)

Esse documento cobre:

- conceito visual real em produção
- paleta ativa
- tipografia em uso
- materialidade
- motion language
- inventário do que realmente aparece no site hoje

### Se você precisa desenhar, evoluir ou revisar interface

Leia primeiro:

- [Guia de Design Atual](./guia-de-design-atual.md)

Esse documento cobre:

- shell global
- composição real da home
- padrões do blog
- componentes de maior peso visual
- limites de consistência
- exceções e outliers

### Se você precisa alinhar comunicação, narrativa e tom

Leia primeiro:

- [Branding Guide Atual](./branding-guide-atual.md)

Esse documento cobre:

- posicionamento
- atributos da marca
- tom de voz
- mensagens-chave
- consistência entre portfólio, blog e canais externos

## Fonte de verdade

Quando houver divergência entre documentação e percepção subjetiva, a ordem de confiança deve ser:

1. código ativo do app
2. rotas e componentes atualmente renderizados
3. novos guias atualizados
4. documentação legada

Arquivos centrais para validação:

- `src/layouts/Layout.astro`
- `src/index.css`
- `src/components/pages/Index.tsx`
- `src/components/Hero.tsx`
- `src/components/Projects.tsx`
- `src/components/pages/LatestPosts.tsx`
- `src/components/About.tsx`
- `src/components/pages/BlogPage.tsx`
- `src/components/pages/BlogPostPage.tsx`
- `src/styles/markdown.css`

## Resumo visual atual

O site atual deve ser entendido como:

`brutalismo digital editorial, dark-first, com base preta, tipografia pixel-display, linguagem de sistema, acento dourado e atmosfera audiovisual cinematográfica`

Isso significa na prática:

- fundo preto como palco principal
- branco como cor estrutural de leitura
- dourado como cor de acento e resposta
- headlines gigantes e autorais
- microcopy técnica em caixa alta
- uso controlado de vídeo, granulado, vidro e glitch

## Alertas de desatualização

As interpretações abaixo `não` devem mais ser tratadas como diretrizes do estado atual:

- light mode como expressão principal
- roxo e verde como eixo dominante da marca
- `Satoshi` como tipografia principal do site
- home baseada em `Skills` e `Contact`
- leitura do projeto como “React + Vite” em vez de `Astro 5 + React islands`
- uso de `NotFound.tsx` como referência de linguagem visual

## Regra operacional

Antes de alterar layout, UI ou copy estrutural:

1. consulte o guia específico adequado
2. confirme o componente real em uso
3. preserve a coerência com a direção visual já publicada

Se a nova proposta parecer mais próxima de:

- SaaS genérico
- dashboard corporativo
- landing page clara e arredondada
- sistema colorido demais

ela provavelmente está desalinhada com o estado atual do site.
