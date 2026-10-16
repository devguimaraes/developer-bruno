# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Bun (CI pins 1.3.12).

```bash
bun install
bun run dev                    # Astro dev server, http://127.0.0.1:4321
bun run build                  # Static build (astro build)
bun run preview
bun run lint                   # Biome lint (scope: src/** and scripts/** only)
bun run lint:fix
bun run format                 # Biome format check
bun run format:fix
bun run test                   # Vitest watch
bun run test:unit              # Vitest single run
bun run test:coverage          # v8 coverage, enforces thresholds (~30% statements/lines, 25% branches/functions)
bun run test:e2e               # Playwright (starts its own dev server on 4321 unless one is running)
bun run optimize:media         # scripts/optimize-media.mjs
bun run check:media-budget     # scripts/check-media-budget.mjs
```

```bash
bunx vitest run src/lib/utils.test.ts                 # single unit test file
bunx playwright test --project=chromium home.spec.ts  # single e2e file/browser
```

**CI** (`.github/workflows/ci.yml`): lint, unit and build in parallel, then e2e on **chromium only**. The 5-browser Playwright matrix (chromium, firefox, webkit, Pixel 5, iPhone 12) only runs locally.

**Pre-commit** (Husky + lint-staged, `src/**/*.{ts,tsx}`): `biome lint --fix`, `biome format --write`, `tsc -p tsconfig.app.json --noEmit`.

**Typecheck:** use `bunx tsc -p tsconfig.app.json --noEmit` (strict). Root `tsconfig.json` has `"files": []` and only `references`, so a plain `tsc --noEmit` checks nothing and exits 0. The baseline is 0 errors, so any error is new.

**Worktrees:** don't leave git worktrees inside the repo (e.g. `.claude/worktrees/`) while running `bun run lint` or `test:unit`. Each has its own `biome.json` (Biome fails with "nested root configuration") and its tests are picked up by Vitest.

Biome is the linter/formatter (2 spaces, 100 cols, double quotes). `eslint.config.js` exists but is not wired into any script or CI step.

Workflow, branching (Gitflow: `feature/*` from `develop`, `hotfix/*` from `main`) and commit conventions are in `AGENTS.md` and `GIT_WORKFLOW.md`. Vercel deploys `main` only (`vercel.json` disables `develop`).

## Architecture

Astro 5 static site (`output: 'static'`, `build.format: 'directory'`) with React 18 islands, TypeScript and Tailwind 3. Portfolio of a Brazilian front-end developer at `devguimaraes.com.br`. No SSR, no API routes.

### Astro shell, React content

Astro pages in `src/pages/` are thin wrappers that hydrate one React component from `src/components/pages/` (or `src/components/projects/CaseStudy.tsx`) via `client:load`. Routes: `index`, `blog/index`, `blog/[slug]`, `projetos/[slug]`, `404`.

`src/layouts/Layout.astro` is the only layout. Besides SEO (OG, Twitter, JSON-LD, canonical, `noindex` on Vercel previews) and Plausible (prod only), it mounts the global islands: `CustomCursor`, `SmoothScroll` (Lenis) wrapping `LiquidGlassProvider`, `Navigation`, `Footer` (`client:visible`), `Toaster` (sonner) and `GrainOverlay`. Home sections are wrapped in `SectionEntrance` in `components/pages/Index.tsx`; the anchors `#hero`, `#projetos`, `#about`, `#contact` are used by Navigation and e2e tests.

`<slot />` (the page's island) sits inside `SmoothScroll` > `LiquidGlassProvider` in `Layout.astro`, alongside `Navigation` and `Footer`. Each `client:*` component is its own island, so state shared across islands that must not depend on context nesting goes through module-level stores (see i18n below).

### i18n without a framework

`src/lib/i18n.ts` holds a flat `dictionary` (pt, en), `t(locale, key)` with `TranslationKey` derived from `dictionary.pt`, and a pub/sub store (`getLocale`/`setLocale`/`subscribeToLocale`). `useLocale()` subscribes React components to it. The locale is persisted in `localStorage('locale')`, and an inline script in `Layout.astro` sets `<html lang>` and `og:locale` before hydration. A new UI string needs both languages in the dictionary or the key type breaks.

### Blog content

Markdown in `src/content/blog/*.md`, collection defined in `src/content.config.ts` (Zod: `title`, `date` as string, `excerpt` required; `readTime`, `tags`, `author`, `image`, `featured` optional or defaulted). Pages render with Astro's `render(entry)` and `<Content />`. `src/lib/blog/` has the helpers (reading time, word count, code blocks, content fetching). Blog category filter is derived from `tags[0]`. Markdown styles live in `src/styles/markdown.css` (`data-markdown-content`).

Unit tests alias `astro:content` to `src/test/__mocks__/astro-content.ts` (`vitest.config.ts`), so code importing it can be tested without Astro.

### Other data and config

- `src/data/projects.ts`, `skills.ts`: typed static data feeding Projects and case study pages.
- `src/config/site.ts`: SEO config, Brazilian market keywords, contact data, performance budgets (300KB JS, 500KB images, 50KB CSS, 1MB total, enforced for media by `check:media-budget`).
- `src/hooks/useLiquidGlass.ts` + `LiquidGlassProvider`/`LiquidGlassLens`: glass effect with an SSR-safe default context (`isSupported: false`, no-ops) and type shim in `src/types/liquidGL.d.ts`.
- Motion: Framer Motion is the default. GSAP is used only by `StaggeredMenu`. Lenis lives in `SmoothScroll` and is exposed through `LenisContext`. Animated components should honor `useReducedMotion`.

### Design system

Neo-brutalist/pixel, black background (`--background: 0 0% 0%`), white `--primary`, gold `--accent: 45 87% 57%`, all HSL CSS variables in `src/index.css`. Docs: `docs/guia-de-design-atual.md`, `docs/identidade-visual-atual.md`, `docs/branding-guide-atual.md`.

Tailwind `fontFamily` defines only `sans` (Satoshi), `mono` (JetBrains Mono) and `pixel` (Jersey 15). Silkscreen and Newsreader are CSS variables (`--font-pixel-tech`, `--font-serif`) consumed by utility classes such as `.type-mono` and `.type-body`. The `brutal` palette has only `bg`, `dark`, `orange`, `blue`. Shadows `shadow-brutal`, `-sm`, `-lg` come from CSS vars. Check `tailwind.config.ts` and `index.css` before using a token; older docs list classes that do not exist.

## Testing

- **Unit:** Vitest + jsdom + Testing Library, tests colocated as `*.test.ts(x)`. `src/test/setup.ts` mocks IntersectionObserver, ResizeObserver, matchMedia and Framer Motion.
- **E2E:** Playwright, specs in `src/test/e2e/*.spec.ts`, `baseURL` `http://127.0.0.1:4321`.
- Vitest excludes `src/test/e2e` and `.worktrees`.
- Pre-PR checklist: `bun run lint && bun run test:unit && bun run test:e2e`, plus a build for visual or content changes.
- Path alias `@/` maps to `src/` (set in `tsconfig.json`, `tsconfig.app.json` and `vitest.config.ts`).

## Related documentation

- `AGENTS.md`: structure, naming, Gitflow, commit and PR rules
- `GEMINI.md`, `TESTING.md`, `CONTRIBUTING.md`: overlap with this file; GEMINI.md is a copy-style overview for another tool
- `docs/`: design guides, branding, audits, plans. Many are historical, so verify against code.

## Agent skills

### Issue tracker

Issues vivem no GitHub Issues de `devguimaraes/developer-bruno`, via CLI `gh`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: um `GLOSSARY.md` e `docs/adr/` na raiz. See `docs/agents/domain.md`.
