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
bun run test:e2e               # Playwright e2e tests
bun run optimize:media         # Optimize media assets via scripts/optimize-media.mjs
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
- `blog/index.astro` — Blog listing
- `blog/[slug].astro` — Individual blog post (dynamic route)
- `404.astro` — Not found

### Layout

Single global layout at `src/layouts/Layout.astro`:
- SEO meta tags (Open Graph, Twitter Cards, canonical URL)
- Google Fonts (Jersey 15, Silkscreen, Newsreader, JetBrains Mono, Inter)
- Plausible Analytics (production only)
- Global UI: PixelLoader, CustomCursor, GrainOverlay, SmoothScroll wrapper, Toaster

### Page Structure

Astro pages are thin wrappers. The real UI lives in React components under `src/components/pages/`:
- `Index.tsx` — Home page with Hero, Projects, About sections wrapped in `SectionEntrance`
- `BlogPage.tsx` — Blog listing
- `BlogPostPage.tsx` — Individual blog post
- `NotFound.tsx` — 404 page

### Content Layer

- `src/content/blog/` — Markdown files with frontmatter (title, date, tags, excerpt)
- `src/data/` — Static data files (projects, experience, skills, testimonials)
- `src/config/site.ts` — SEO config, Brazilian market keywords, performance budgets

### Key React Patterns

**Section Entrance:** `SectionEntrance` wraps each page section with scroll-based animations.

**Hooks:** Custom hooks in `src/hooks/` handle:
- `useStackingSections` — scroll-based stacking transforms
- `useHorizontalScroll` — horizontal scroll with vertical scroll support per section
- `useWebVitals` — performance monitoring
- `use-analytics` — Plausible event tracking
- `useVideoLoading` — video loading state

**Animations:** Framer Motion for UI transitions. GSAP for advanced text effects (`ShuffleText`). Three.js available but minimally used.

## Design System

Brutalist/neo-brutalist aesthetic:
- **Borders:** `border-4`, `rounded-none`
- **Shadows:** `shadow-brutal`, `shadow-brutal-sm`, `shadow-brutal-lg`
- **Fonts:** Jersey 15 + Silkscreen (pixel/display), Newsreader (serif), Inter (sans), JetBrains Mono (mono)
- **Colors:** HSL tokens — primary (Parakeet green), secondary (Royal Lilac), accent (Freesia gold)
- **Effects:** GrainOverlay, CustomCursor, BorderGlow, BackgroundGrid

## Testing

- **Unit:** Vitest with jsdom, setup at `src/test/setup.ts` (mocks IntersectionObserver, ResizeObserver, Framer Motion)
- **E2E:** Playwright with chromium, firefox, webkit, Mobile Chrome, Mobile Safari — tests in `src/test/e2e/`
- **Path alias:** `@/` → `./src/` (configured in both `tsconfig.json` and `vitest.config.ts`)

## Brazilian Market

- Locale: pt-BR, all content in Portuguese
- Performance budgets for Brazilian mobile networks (3G/4G)
- LGPD-compliant analytics (Plausible, no cookies)
- SEO keywords targeting "desenvolvedor front-end Brasil", "programador React Rio de Janeiro"
- Service areas: Rio de Janeiro, São Paulo, Brasília

## Configuration Files

- `astro.config.mjs` — Astro config with React, Tailwind, Sitemap integrations
- `biome.json` — Linting (recommended rules) and formatting (2-space indent, 100px line width, double quotes)
- `vitest.config.ts` — Unit test config with jsdom and `@/` alias
- `playwright.config.ts` — E2E test config (baseURL: http://127.0.0.1:4321)
- `tailwind.config.ts` — Design tokens, animations, brutalist variants
- `src/config/site.ts` — SEO metadata and performance budgets
