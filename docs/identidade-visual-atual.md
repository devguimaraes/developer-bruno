# Identidade Visual Atual do Site

## Escopo e fonte de verdade

Este documento descreve a identidade visual atualmente implementada em `devguimaraes.com.br` com base no código ativo do repositório em 23 de abril de 2026.

Fontes principais:

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

Fontes secundárias, úteis mas parcialmente desatualizadas:

- `docs/DESIGN_SYSTEM_GUIDELINE.md`
- `docs/id-visual`
- `docs/PROJECT_ANALYSIS.md`

## Resumo executivo

A identidade atual do site não é um neo-brutalismo colorido em light mode. O estado real hoje é um sistema visual `dark-first`, de alto contraste, com linguagem de interface inspirada em terminal, editorial tech e direção de arte digital cinematográfica.

O resultado pode ser descrito como:

`Brutalismo digital editorial`

Ou, em uma formulação mais completa:

`um portfólio de estética técnica, cinematográfica e autoral, que combina brutalismo escuro, display pixelado, microcódigos visuais de sistema e superfícies atmosféricas como vídeo, granulado e vidro distorcido`

## Pilares visuais atuais

### 1. Base escura e contraste máximo

O site parte de um fundo preto sólido com tipografia branca e acento dourado. Isso cria impacto imediato e estabelece uma leitura premium, noturna e tecnológica.

Sinais concretos no código:

- `html, body` com `background-color: #000` em `src/index.css`
- `body class="bg-black"` em `Layout.astro`
- uso recorrente de `text-white`, `border-white/10`, `text-white/40`, `text-white/60`

### 2. Tipografia com dois registros principais

O site alterna entre dois modos de expressão:

- `display pixelado e técnico` para headlines, labels e assinatura visual
- `texto editorial` para narrativa, bio e leitura prolongada

Essa tensão entre o digital rígido e o editorial humano é parte central da identidade.

### 3. Interface como linguagem de sistema

O site evita rótulos neutros e usa nomenclaturas de sistema, terminal e telemetry:

- `LATEST_POSTS`
- `SELECTED_WORKS`
- `SCROLL_FOR_MORE`
- `STREAM_BIO_03`
- `V4.0_FINAL`
- `// BACK_TO_BLOG`
- `// ESTABLISHED_IN_RJ`

Isso torna a marca mais específica e memorável do que um portfólio genérico.

### 4. Atmosfera audiovisual

A identidade não depende só de cor e tipo. Ela é construída também por materialidade:

- vídeo full-bleed no hero
- granulado global
- superfícies de vidro com distorção
- glitch controlado em imagem e mídia
- parallax e motion vertical suave

### 5. Brutalismo refinado, não caótico

Apesar do vocabulário brutalista, o site atual não é agressivamente barulhento em todos os pontos. Há bastante contenção:

- bordas finas em branco translúcido
- grandes áreas negativas
- composições centralizadas
- ritmo mais editorial do que “poster collage”

Ou seja: o projeto mantém a aspereza conceitual do brutalismo, mas com acabamento mais elegante e premium.

## Paleta ativa

### Núcleo cromático real

Tokens definidos em `src/index.css`:

- `--background: 0 0% 0%`
- `--foreground: 0 0% 100%`
- `--primary: 0 0% 100%`
- `--accent: 45 87% 57%`
- `--border: 0 0% 100%`

Tradução prática:

- fundo principal: preto absoluto
- cor principal de texto: branco
- acento principal: dourado quente
- borda base: branco

### Cores percebidas no uso

Além dos tokens, o layout usa com frequência:

- branco em opacidades variadas
- cinzas derivados de `stone`
- preto como massa estrutural
- dourado como sinal de ação, hover e destaque

Em componentes pontuais ainda aparecem cores herdadas da paleta `brutal` do Tailwind:

- `brutal-orange`
- `brutal-blue`

Mas essas cores não definem a identidade dominante do site principal. Elas aparecem mais como herança de uma fase anterior do design system.

## Tipografia ativa

### Fontes carregadas no shell

Em `Layout.astro`:

- `Jersey 15`
- `Silkscreen`
- `Newsreader`
- `JetBrains Mono`
- `Inter`

### Papéis tipográficos

#### Display principal

`Jersey 15`

Uso:

- hero
- títulos gigantes de seção
- assinatura visual rasterizada

Sensação transmitida:

- digital
- gráfica
- arcade/editorial
- autoral

#### Técnica auxiliar

`Silkscreen`

Uso:

- labels
- metadados
- marcadores de sistema
- navegação e microcopy técnico

Sensação transmitida:

- telemetria
- interface
- terminal
- precisão

#### Editorial

`Newsreader`

Uso:

- bio principal em `About`

Sensação transmitida:

- sofisticação
- pausa
- leitura humana
- contraste com o repertório “machine”

#### Corpo e UI neutra

`Inter` e `JetBrains Mono`

Uso:

- leitura de apoio
- conteúdo funcional
- código e metadados do blog

## Classes tipográficas realmente relevantes

Definidas em `src/index.css`:

- `type-raster-hero`
- `type-raster-section`
- `type-mono`
- `type-display-hero`
- `type-display-section`
- `type-display-card`
- `type-ui-label`
- `type-body`
- `type-body-lg`

As mais presentes na experiência real atual são:

- `type-raster-hero`
- `type-raster-section`
- `type-mono`
- `type-ui-label`

## Materialidade e texturas

### 1. Vídeo full-screen

O hero usa vídeo como camada-base de atmosfera. Ele não é decorativo apenas; ele estabelece tom, profundidade e sensação de imersão.

Arquivos principais:

- `/backgroundvideo.webm`
- `/backgroundvideo.mp4`
- `/hero-render-1.webp`

### 2. Granulado global

`GrainOverlay` aplica uma camada fixa de ruído por cima de toda a experiência. Isso reforça:

- sensação tátil
- vibração analógica
- acabamento cinematográfico

### 3. Vidro distorcido

`GlassSurface` no topo do site cria uma barra translúcida e refrativa, reforçando uma estética de interface avançada e experimental.

### 4. Glitch e mídia degradada

`GlitchImage` aparece em retrato e projetos, sempre com uso controlado. O efeito não domina a interface; ele adiciona tensão visual.

## Motion language

A linguagem de movimento atual é baseada em:

- entrada suave em scroll
- parallax vertical
- fade/slide com `framer-motion`
- marquee horizontal para stack
- hover cromático com o dourado
- pequenas respostas magnéticas e de cursor customizado

Ela comunica:

- sofisticação
- fluidez
- presença digital

Sem parecer uma interface corporativa estática.

## Composição e layout

### Home

A home atual é composta por:

- hero imersivo
- vitrine de projetos
- últimos posts
- about autoral
- CTA final “LET'S_TALK”

Não entram na composição atual da home:

- `Skills.tsx`
- `Contact.tsx`

Isso é importante para não documentar como “identidade principal” elementos que hoje existem no código, mas não fazem parte da experiência publicada principal.

### Blog

O blog expande a identidade principal em registro mais editorial:

- fundo preto
- títulos fortes
- metadata em linguagem de sistema
- cards com bordas finas
- markdown dark theme
- acento dourado em links e foco

## Imagética e ativos

Ativos mais alinhados com a identidade atual:

- `avatar-bruno-bg.jpg`
- `about-avatar.jpg`
- `avatar-bio3.webm`
- `hero-render-1.webp`
- `og-image.webp`
- banners de projetos em WebP

Critério imagético percebido:

- fotografia e render com clima escuro
- enquadramento forte
- pouca poluição visual
- atmosfera mais “showreel” do que catálogo

## Assinatura de marca percebida

A marca atual se apresenta como:

- técnica, mas não fria
- autoral, mas não artesanal
- premium, mas não luxuosa no sentido clássico
- brasileira, mas com linguagem digital global

Elementos que sustentam isso:

- coordenadas geográficas do Rio
- microcopy em inglês técnico
- descrição em português
- repertório visual internacional

## O que não deve ser tratado como identidade atual

Os itens abaixo aparecem em documentos antigos, mas não representam o estado principal do site hoje:

- light mode como expressão principal
- roxo como cor estruturante
- verde como cor primária dominante do produto
- `Satoshi` como tipografia central da experiência
- narrativa de “shadcn/ui como linguagem visual principal”
- presença de `Skills` e `Contact` como seções da home atual
- `NotFound.tsx` como referência de estilo principal

`NotFound.tsx` hoje é um outlier visual e não deve orientar decisões de branding.

## Síntese final

Se a identidade atual precisasse ser resumida em uma única frase:

`Bruno Guimarães é apresentado como um desenvolvedor front-end que transforma rigor técnico em uma experiência visual escura, editorial e digitalmente sofisticada, marcada por contraste alto, tipografia pixel-display, linguagem de sistema e atmosfera cinematográfica.`
