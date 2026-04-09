# Developer Bruno -- Design System

> **Stack:** Astro 5 (SSG) + React 18 islands + TypeScript + Tailwind CSS
> **Deploy:** Vercel | devguimaraes.com.br

---

## 1. Manifesto e Identidade

A identidade visual do projeto e "Techno Brutalist Prism": alto contraste, sombras duras, movimento glitch/digital. O design e deliberadamente cru e assertivo, otimizado para o mercado brasileiro.

### Os 3 Mandamentos Visuais

1. **Borders are King** -- Tudo tem borda grossa (`border-4`). Sem sutilezas.
2. **Shadows are Hard** -- Sombras solidas com offset, zero blur (`4px 4px 0px #000`).
3. **Motion is Glitch** -- Animacoes devem parecer digitais, mecanicas ou glitchy.

---

## 2. Cores

### Variaveis CSS (`src/index.css`)

| Token | Valor (HSL) | Descricao |
|-------|-------------|-----------|
| `--background` | `0 0% 0%` | Fundo preto |
| `--foreground` | `0 0% 100%` | Texto branco |
| `--primary` | `0 0% 100%` | Primaria branca |
| `--accent` | `45 87% 57%` | Freesia gold |
| `--border` | `0 0% 100%` | Bordas brancas |

### Paleta Brutalista (`tailwind.config.ts`)

| Token | Cor | Hex |
|-------|-----|-----|
| `brutal-bg` | stone-100 | `#f5f5f4` |
| `brutal-dark` | stone-900 | `#1c1917` |
| `brutal-orange` | orange-500 | `#f97316` |
| `brutal-yellow` | yellow-400 | `#facc15` |
| `brutal-purple` | purple-500 | `#a855f7` |
| `brutal-blue` | blue-500 | `#3b82f6` |
| `brutal-green` | green-500 | `#22c55e` |
| `brutal-red` | red-500 | `#ef4444` |

---

## 3. Tipografia

### Fontes (Google Fonts, via `Layout.astro`)

| Token CSS | Familia | Uso |
|-----------|---------|-----|
| `--font-pixel-display` | Jersey 15 | Display pixel, hero titles |
| `--font-pixel-tech` | Silkscreen | Labels tecnicos, badges |
| `--font-serif` | Newsreader | Serif/editorial |
| `font-mono` | JetBrains Mono | Monospace, codigo |
| `font-sans` | Inter | Corpo de texto |

### Classes de Tipografia (`src/index.css`)

| Classe | Descricao |
|--------|-----------|
| `type-raster-hero` | `font-pixel` uppercase, tracking tight, leading 0.8 |
| `type-raster-section` | `font-pixel` uppercase, tracking section |
| `type-mono` | `font-silkscreen` 10px, tracking wide, uppercase, opacity 50% |
| `type-display-hero` | `font-hero-pixel` uppercase, tracking 0.05em |
| `type-display-section` | `font-pixel` uppercase, tracking 0.06em |
| `type-display-card` | `font-pixel` uppercase, tracking 0.035em |
| `type-ui-label` | `font-pixel` uppercase, tracking 0.22em |
| `type-body` | `font-sans` tracking 0.01em, leading relaxed |
| `type-body-lg` | `font-sans` tracking 0.01em, leading 1.6 |

---

## 4. Sombras

Definidas em `tailwind.config.ts`:

| Classe | Valor |
|--------|-------|
| `shadow-brutal` | `var(--shadow-brutal)` (CSS variable) |
| `shadow-brutal-sm` | `var(--shadow-brutal-sm)` (CSS variable) |
| `shadow-brutal-lg` | `var(--shadow-brutal-lg)` (CSS variable) |
| `shadow-neo` | `4px 4px 0px 0px rgba(0,0,0,1)` |
| `shadow-neo-sm` | `2px 2px 0px 0px rgba(0,0,0,1)` |
| `shadow-neo-lg` | `8px 8px 0px 0px rgba(0,0,0,1)` |
| `shadow-pixel` | Borda pixelada (4px cada lado) |

---

## 5. Animacoes

### Regra Geral

- **CSS keyframes** para animacoes continuas (float, typing, glitch, marquee)
- **Framer Motion** para transicoes de entrada/saida
- **GSAP** para efeitos avancados de texto (ShuffleText, StaggeredMenu)

### Keyframes Configuradas (`tailwind.config.ts`)

| Animacao | Duracao | Tipo |
|----------|---------|------|
| `animate-float` | 6s ease-in-out infinite | Deslocamento vertical suave |
| `animate-float-slow` | 6s ease-in-out infinite | Float lento |
| `animate-float-medium` | 4s ease-in-out infinite | Float medio |
| `animate-float-fast` | 3s ease-in-out infinite | Float rapido |
| `animate-typing` | 1s ease-in-out infinite | Piscar cursor |
| `animate-glitch` | 0.3s ease-in-out infinite | Tremor glitch |
| `animate-marquee` | 30s linear infinite | Rolagem horizontal |
| `animate-slide-up` | 0.5s ease-out | Entrada de baixo |
| `animate-fade-in` | 0.5s ease-out | Fade simples |
| `animate-scale-in` | 0.3s ease-out | Scale + fade |

---

## 6. Componentes UI (`src/components/ui/`)

### Componentes Ativos (importados pelo codigo)

| Componente | Arquivo | Descricao |
|------------|---------|-----------|
| SectionEntrance | `SectionEntrance.tsx` | Wrapper de secao com animacao scroll |
| GlitchImage | `GlitchImage.tsx` + `.css` | Imagem/video com efeito glitch |
| GlassSurface | `GlassSurface.tsx` + `.css` | Superficie glass morphism |
| GrainOverlay | `GrainOverlay.tsx` + `.css` | Overlay de granulado de filme |
| CustomCursor | `CustomCursor.tsx` | Cursor personalizado |
| PixelLoader | `PixelLoader.tsx` + `.css` | Tela de carregamento pixel |
| SmoothScroll | `SmoothScroll.tsx` | Wrapper Lenis smooth scroll |
| ShuffleText | `ShuffleText.tsx` | Efeito GSAP de embaralhar texto |
| StaggeredMenu | `StaggeredMenu.tsx` | Menu animado com stagger |
| Magnetic | `Magnetic.tsx` | Efeito hover magnetico |
| ScrollReveal | `ScrollReveal.tsx` | Reveal ao scroll |
| TextReveal | `TextReveal.tsx` | Reveal de texto |
| BorderGlow | `BorderGlow.tsx` | Efeito brilho na borda |
| motion-components | `motion-components.tsx` | Primitivos Framer Motion |
| scroll-animation | `scroll-animation.tsx` | Animacoes baseadas em scroll |
| Avatar | `Avatar.tsx` | Avatar |
| Sonner | `sonner.tsx` | Notificacoes toast (lib Sonner) |

### UI Global (`Layout.astro`)

| Componente | Hydration | Funcao |
|------------|-----------|--------|
| PixelLoader | `client:load` | Tela de loading |
| CustomCursor | `client:load` | Cursor customizado |
| SmoothScroll | `client:load` | Scroll suave (envolve tudo) |
| Navigation | `client:load` | Barra de navegacao |
| Footer | `client:visible` | Rodape |
| Toaster | `client:load` | Notificacoes toast |
| GrainOverlay | `client:load` | Efeito granulado |

---

## 7. Padroes CSS (`src/index.css`)

| Classe | Efeito |
|--------|--------|
| `pixel-border` | Sombra simulando borda pixelada 4px |
| `pixel-border-sm` | Borda pixelada 2px |
| `grid-technical` | Grid linear tecnico (80px) |
| `grid-dots` | Grid de pontos (40px) |
| `scanlines` | Efeito scanlines via pseudo-elemento |
| `gpu-accel` | Aceleracao GPU (translate3d, backface-visibility) |
| `modular-grid` | Grid modular flex vertical |
| `scrollbar-hide` | Oculta scrollbar |
| `pixelated` | `image-rendering: pixelated` |
| `outlined-title-mobile-solid` | Titulo outline vira solido em mobile |
| `horizontal-scroll-container` | Container snap horizontal |
| `horizontal-section` | Secao 100vw/100vh com snap |
| `vertical-scroll-inner` | Scroll vertical interno com snap |

---

## 8. Performance

### Budgets (`src/config/site.ts`)

| Recurso | Limite |
|---------|--------|
| JavaScript | < 300KB |
| Imagens | < 500KB |
| CSS | < 50KB |
| Total | < 1MB |

### Contexto

- Publico-alvo inclui redes 3G/4G brasileiras
- O site e totalmente estatico (SSG), sem SSR
- Imagens devem usar WebP com dimensoes explicitas
- Fonts pre-carregadas via Google Fonts (pesos essenciais apenas)

---

## 9. Analytics

**Plausible Analytics** (producao apenas, via `Layout.astro`):

```html
<script defer data-domain="devguimaraes.com.br" src="https://plausible.io/js/script.js"></script>
```

- Conforme LGPD, sem cookies
- NAO usa Google Analytics

---

## 10. Arquitetura de Routing

Paginas Astro em `src/pages/`:

| Pagina | Arquivo | Componente React |
|--------|---------|------------------|
| Home | `index.astro` | `Index.tsx` |
| Blog | `blog/index.astro` | `BlogPage.tsx` |
| Post | `blog/[slug].astro` | `BlogPostPage.tsx` |
| 404 | `404.astro` | `NotFound.tsx` |

Layout unico em `src/layouts/Layout.astro` com SEO (Open Graph, Twitter Cards, canonical URL).

---

## 11. Checklist de Code Review

- [ ] Respeita o tema Techno Brutalist (bordas, sombras, alto contraste)?
- [ ] Cores usam variaveis CSS ou classes Tailwind (sem hex hardcoded)?
- [ ] Tipografia usa as classes `type-*` definidas no sistema?
- [ ] Imagens tem `alt` e estao em WebP?
- [ ] Animacoes seguem a regra: CSS continuas, Framer Motion transicoes, GSAP texto?
- [ ] Componente respeita o budget de performance?
