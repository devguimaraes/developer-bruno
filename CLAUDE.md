# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install                    # Install dependencies
bun run dev                    # Astro dev server (port 4321)
bun run build                  # Production build (static SSG)
bun run preview                # Preview production build
bun run lint                   # Biome lint
bun run lint:fix               # Biome lint with auto-fix
bun run format                 # Biome format check
bun run format:fix             # Biome format with write
bun run test                   # Vitest (watch mode)
bun run test:unit              # Vitest single run
bun run test:coverage          # Vitest with coverage report (v8)
bun run test:e2e               # Playwright e2e tests
bun run optimize:media         # Optimize media assets via scripts/optimize-media.mjs
bun run check:media-budget     # Check media sizes against performance budget
```

**Run a single test file:**
```bash
bunx vitest run src/lib/utils.test.ts
```

**Pre-commit hook:** Husky runs lint-staged — Biome lint + format + `tsc --noEmit` on staged `.ts/.tsx` files.

## Architecture

**Stack:** Astro 5 (static SSG) + React 18 islands + TypeScript + Tailwind CSS

The project is a portfolio site for a Brazilian front-end developer, deployed at `devguimaraes.com.br` on Vercel. Output is fully static (no SSR).

### Astro + React Integration

Astro handles routing and layout. React components are hydrated via `client:*` directives:

```astro
---
import Layout from '@/layouts/Layout.astro';
import HomeClient from '@/components/pages/Index';
---
<Layout title="...">
  <HomeClient client:load />
</Layout>
```

- `client:load` — interactive from page load (Navigation, PixelLoader, main page content)
- `client:visible` — hydrate when visible (Footer)

### Routing

File-based routing under `src/pages/`:
- `index.astro` — Home
- `blog/index.astro` — Blog listing (wiki-style 3-column layout)
- `blog/[slug].astro` — Individual blog post (dynamic route)
- `projetos/[slug].astro` — Case study page (dynamic route)
- `404.astro` — Not found

### Layout

Single global layout at `src/layouts/Layout.astro`:
- SEO meta tags (Open Graph, Twitter Cards, canonical URL, Schema.org structured data)
- Google Fonts preconnect (Jersey 15, Silkscreen, Newsreader, JetBrains Mono, Inter)
- Plausible Analytics (production only)
- Global UI: PixelLoader, CustomCursor, GrainOverlay, SmoothScroll (Lenis), Toaster (sonner), Navigation, Footer

### Page Structure

Astro pages are thin wrappers. The real UI lives in React components:
- `src/components/pages/Index.tsx` — Home with Hero, Projects, InfoBar, About, EngineeringPractices, LatestPosts, CTA
- `src/components/pages/BlogPage.tsx` — Blog listing with SearchBar, BlogFilters, BlogSidebar, scroll spy
- `src/components/pages/BlogPostPage.tsx` — Blog post with TableOfContents, progress bar, prev/next nav
- `src/components/pages/LatestPosts.tsx` — Latest posts section for homepage
- `src/components/pages/NotFound.tsx` — 404 page
- `src/components/projects/CaseStudy.tsx` — Case study page (hero, CTA, context, stack grid, impact, related posts)
- `src/components/blog/` — Reusable blog sub-components (SearchBar, BlogFilters, BlogSidebar, TableOfContents, BlogPostMetadata, BlogPostHeader, BlogPostContent, BlogPostNavigation, skeletons, etc.)

### Content Layer

- `src/content/blog/` — Markdown files with frontmatter (title, date, readTime, tags, excerpt, image)
- `src/content.config.ts` — Astro v5 content collections with Zod schema
- `src/data/` — Static data: `projects.ts`, `experience.ts`, `skills.ts`
- `src/lib/blog/` — Blog utilities: content fetching, slug generation, reading time, date parsing
- `src/config/site.ts` — SEO config, Brazilian market keywords, performance budgets

### Key React Patterns

**Section Entrance:** `SectionEntrance` wraps each page section with scroll-based blur + y animations, aware of `prefers-reduced-motion`.

**Hooks** (in `src/hooks/`):
- `useLocale` — reactive pt/en locale switching (pub/sub store in `src/lib/i18n.ts`)
- `useReducedMotion` — cross-cutting accessibility: animated components check this to reduce/disable motion
- `useScrollSpy` — IntersectionObserver-based heading tracking for Table of Contents
- `useMobile` — responsive breakpoint detection (768px)
- `useWebVitals` — Core Web Vitals monitoring (LCP, CLS, INP, FCP, TTFB) with Brazilian market thresholds
- `useVideoLoading` — lazy video loading on scroll intersection

**i18n:** Full pt/en system via `src/lib/i18n.ts` (dictionary, pub/sub reactive store, `setLocale`, metadata helpers) + `useLocale` hook + language switcher in Navigation.

**Animations:** Framer Motion (primary — scroll effects, spring physics, layout animations). GSAP (only `StaggeredMenu` and `ShuffleText`). Lenis (smooth scrolling via `SmoothScroll` wrapper).

**Key dependencies:** Radix UI primitives (dialog, label, separator, slot, toast, tooltip), sonner (toast), lucide-react (icons), date-fns, react-markdown, caniuse-lite, class-variance-authority, clsx, tailwind-merge.

## Design System

Neo-brutalist/pixel aesthetic with dark background (`#000`):

- **Fonts (Tailwind):** `font-sans` = Satoshi, `font-pixel` = Jersey 15, `font-vt` = VT323, `font-mono` = JetBrains Mono. Silkscreen and Newsreader are loaded as CSS custom properties (`--font-pixel-tech`, `--font-serif`) for utility classes (`.type-mono`, `.type-body`), not in Tailwind `fontFamily`.
- **Colors (HSL via CSS vars):** `--primary: 0 0% 100%` (white), `--accent: 45 87% 57%` (gold). Extended `brutal` palette: `brutal-bg`, `brutal-dark`, `brutal-orange`, `brutal-yellow`, `brutal-purple`, `brutal-blue`, `brutal-green`, `brutal-red`.
- **Shadows:** `shadow-brutal`, `shadow-brutal-sm`, `shadow-brutal-lg` (CSS vars). `shadow-neo`, `shadow-neo-sm`, `shadow-neo-lg` (hard offset, no blur). `shadow-pixel` (4-direction black outline).
- **Borders:** `border-4`, `rounded-none`
- **Animations:** `animate-float`/`float-slow`/`float-medium`/`float-fast` (vertical bob), `animate-typing` (cursor blink), `animate-glitch` (micro-offset), `animate-marquee` (30s infinite scroll)
- **Effects:** `GrainOverlay` (noise texture), `CustomCursor` (spring physics), `BorderGlow` (radial hover), `GlassSurface` (SVG chromatic displacement), `GlitchImage` (multi-layer glitch), `Magnetic` (mouse-follow), `PixelLoader` (dissolving pixel grid), `ScrollReveal`, `StaggeredMenu` (GSAP panels), `TextReveal`, `ShuffleText`

## Testing

- **Unit:** Vitest with jsdom, setup at `src/test/setup.ts` (mocks IntersectionObserver, ResizeObserver, Framer Motion)
- **E2E:** Playwright with chromium, firefox, webkit, Mobile Chrome, Mobile Safari — tests in `src/test/e2e/`
- **Coverage:** `bun run test:coverage` (v8 provider); `bun run test:coverage:ui` for interactive exploration
- **Path alias:** `@/` → `./src/` (configured in `tsconfig.app.json`, `tsconfig.json`, and `vitest.config.ts`)
- **Pre-PR checklist:** see `AGENTS.md`

## Brazilian Market

- Locale: pt-BR (default); English supported via i18n system
- Performance budgets for Brazilian mobile networks (3G/4G): 300KB JS, 500KB images, 50KB CSS, 1MB total
- LGPD-compliant analytics (Plausible, no cookies)
- SEO keywords targeting "desenvolvedor front-end Brasil", "programador React Rio de Janeiro"
- Service areas: Rio de Janeiro, São Paulo, Brasília, Belo Horizonte, Porto Alegre, Salvador, Recife, Fortaleza

## Configuration Files

- `astro.config.mjs` — Astro config with React, Tailwind, Sitemap integrations
- `biome.json` — Linting (recommended rules) and formatting (2-space indent, 100px line width, double quotes)
- `vitest.config.ts` — Unit test config with jsdom and `@/` alias
- `playwright.config.ts` — E2E test config (baseURL: http://127.0.0.1:4321)
- `tailwind.config.ts` — Design tokens, animations, neo-brutalist variants
- `tsconfig.json` — Composite project referencing `tsconfig.app.json` (strict) + `tsconfig.node.json`
- `vercel.json` — Deployment config with rewrites, security headers (CSP, HSTS)
- `components.json` — shadcn/ui component registry
- `postcss.config.js` — PostCSS with Tailwind and autoprefixer
- `eslint.config.js` — ESLint flat config (React hooks rules alongside Biome)
- `.env.example` — Environment variable template (GitHub OAuth)
- `src/config/site.ts` — SEO metadata, performance budgets, contact/footer data

## Related Documentation

- `AGENTS.md` — Git workflow, commit conventions, pre-PR checklist
- `GEMINI.md` — Deeper architecture details, deployment, product directory (antigravity-pack)
- `docs/` — Design guides (`guia-de-design-atual.md`, `identidade-visual-atual.md`), branding (`branding-guide-atual.md`), audits, implementation plans