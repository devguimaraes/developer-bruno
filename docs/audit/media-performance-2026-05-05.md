# Media Performance Audit — 2026-05-05

## Performance Budget (from src/config/site.ts)

| Resource | Budget |
|----------|--------|
| JavaScript | 300 KB |
| Images | 500 KB |
| CSS | 50 KB |
| Total | 1,000 KB (1 MB) |

## Critical Media on Home Page

### Videos

| File | Size | Loading Strategy | Issues |
|------|------|-----------------|--------|
| backgroundvideo.webm | 2,436 KB (2.4 MB) | Lazy via IntersectionObserver (threshold 0.1) | No explicit `preload` attribute; large file; MP4 fallback also downloaded on some browsers |
| backgroundvideo.mp4 | 2,807 KB (2.8 MB) | Lazy via IntersectionObserver (threshold 0.1) | Fallback format; only loaded if webm unsupported |
| avatar-bio3.webm | 368 KB | Lazy (`preload="none"` via GlitchImage `loadingLazy`) | Video duplica 4x no DOM (base + 3 glitch layers), cada uma com `preload="none"` |
| avatar-bio3.mp4 | 576 KB | Lazy (`preload="none"` via GlitchImage `loadingLazy`) | Fallback format |

### Images (Home Page Only)

| File | Size | Loading Strategy | Issues |
|------|------|-----------------|--------|
| hero-render-1.webp | 58.7 KB | Poster (carregado antes do vídeo) | Sem width/height explícitos |
| about-avatar.jpg | 53.0 KB | Poster (carregado antes do vídeo) | Sem width/height explícitos |
| banner-movies-event-house-bremen.webp | 232 KB | Lazy (via GlitchImage `loadingLazy`) | Duplicado 4x no DOM (base + 3 glitch layers); sem width/height |
| banner-multi-macbook.webp | 164 KB | Lazy (via GlitchImage `loadingLazy`) | Duplicado 4x no DOM; sem width/height |
| banner-danila-rizo.webp | 122 KB | Lazy (via GlitchImage `loadingLazy`) | Duplicado 4x no DOM; sem width/height |
| avatar-bruno-bg.jpg | 14.3 KB | Eager (no <nav>) | Sem width/height; sem `loading` attr; sem `fetchpriority` |
| avatar.webp (public/) | 7.9 KB | — | Não usado na home page atualmente |

### GIFs

| File | Size | Usage | Recommendation |
|------|------|-------|----------------|
| Computer.gif | 2,250 KB (2.2 MB) | **Não usado em nenhum componente** | Remover se não for utilizado; alternativamente converter para WebM |
| hero-animation.gif | 17 KB | **Não usado em nenhum componente** | Remover se não for utilizado; alternativamente converter para WebM |

> **Nota:** Ambos os GIFs residem em `src/assets/` mas não são importados por nenhum componente. Eles podem ser resquícios de versões anteriores ou assets preparados para uso futuro.

## Loading Strategy Analysis

### What's Good ✅

- **Hero video usa IntersectionObserver** com threshold 0.1 — os `<source>` elements só são renderizados quando a seção está visível, evitando download desnecessário.
- **Avatar video no About usa `preload="none"`** via GlitchImage com `loadingLazy`.
- **Projetos usam `loading="lazy"`** para imagens abaixo da dobra.
- **Posters (hero-render-1.webp, about-avatar.jpg)** fornecem fallback visual imediato antes dos vídeos carregarem.
- **WebP para todas as imagens** (exceto about-avatar.jpg que é JPEG — aceitável para foto).
- **Plausible Analytics com `defer`** não bloqueia renderização.
- **Preconnect para Google Fonts** configurado no Layout.astro.

### What Needs Improvement ❌

1. **Background video de ~2.4 MB** — maior recurso individual; mesmo com lazy loading, é pesado para redes móveis brasileiras.
2. **GlitchImage duplica mídia 4x no DOM** — mesmo com `opacity: 0` nas layers, os elementos `<img>` com `loading="lazy"` podem ser baixados pelo navegador quando próximos ao viewport. Isso efetivamente quadruplica o peso dos banners.
3. **Hero video sem `preload` explícito** — atualmente depende do padrão do navegador (geralmente `metadata`).
4. **Nenhuma imagem no home page tem `width`/`height`** — risco de Cumulative Layout Shift (CLS).
5. **Navigation image (`avatar-bruno-bg.jpg`)** carregada com eager sem `fetchpriority`.
6. **Budget de images (500 KB) é excedido** mesmo sem vídeos — só os banners somam ~518 KB.
7. **Sem cache headers para mídia no `vercel.json`** — arquivos estáticos servidos sem `Cache-Control` otimizado.
8. **Dois arquivos GIF não utilizados** — ocupam 2.2 MB em disco no repositório.
9. **Astro config sem `@astrojs/image`** para otimização automática de imagens.

## Recommendations by Priority

### 🔴 High Priority

1. **Adicionar `width` e `height` a todas as imagens** na home page — previne CLS (maior impacto em LCP para redes lentas). Foco em `hero-render-1.webp`, `about-avatar.jpg`, `avatar-bruno-bg.jpg`.
2. **Adicionar cache headers agressivos para mídia** no `vercel.json` — arquivos em `/public` devem ter `Cache-Control: public, max-age=31536000, immutable`.
3. **Verificar se GlitchImage causa downloads desnecessários** — investigar se os 3 layers extras disparam network requests mesmo com `opacity: 0`. Se sim, renderizar condicionalmente com JS.

### 🟡 Medium Priority

1. **Comprimir background video** — atualmente ~2.4 MB (webm). Reduzir para ≤1 MB com compressão mais agressiva (CRF 30+, resolução 720p) sem perda visual significativa para background.
2. **Comprimir avatar-bio videos** — atualmente 368 KB (webm) + 576 KB (mp4). Reduzir para ≤200 KB cada.
3. **Adicionar `fetchpriority="high"` ao poster do hero** — o poster é a imagem mais importante acima da dobra (`hero-render-1.webp`, 58.7 KB).
4. **Remover GIFs não utilizados** — `Computer.gif` (2.2 MB) e `hero-animation.gif` (17 KB) do repositório.
5. **Adicionar preconnect para CDN de vídeos** — se os vídeos forem servidos de um subdomínio CDN no futuro.

### 🟢 Low Priority

1. **Adicionar `@astrojs/image`** — para otimização automática e geração de múltiplos formatos.
2. **Considerar placeholder com blur-up** para imagens de projeto — melhoraria a percepção de performance.
3. **Auditar dependências JS** — framer-motion, gsap e lenis juntos somam >150 KB bundle.

## Budget Compliance

| Resource | Budget | Actual (home page) | Status |
|----------|--------|-------------------|--------|
| Images | 500 KB | ~631 KB (todos os banners + posters + nav avatar) | ❌ Excedido |
| Total media on home | 1,000 KB | ~3,400–4,000 KB (incluindo 1 vídeo) | ❌ Excedido |

> **Nota:** O budget de Total (1 MB) parece ser para o peso total inicial da página (JS+CSS+imagens). Vídeos carregados lazy não deveriam contar para o orçamento inicial, mas o budget de imagens (500 KB) é excedido mesmo sem considerar vídeos.
>
> **Cálculo detalhado:**
> - hero-render-1.webp: 58.7 KB
> - about-avatar.jpg: 53.0 KB
> - banner-movies-event-house-bremen.webp: 232 KB
> - banner-multi-macbook.webp: 164 KB
> - banner-danila-rizo.webp: 122 KB
> - avatar-bruno-bg.jpg: 14.3 KB
> - **Total imagens: ~644 KB**
>
> Com GlitchImage potencialmente quadruplicando os banners (dependendo do comportamento do navegador), o peso efetivo pode chegar a ~1.5 MB só de imagens.
