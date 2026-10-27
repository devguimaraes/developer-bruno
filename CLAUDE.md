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

Biome is the only linter/formatter (2 spaces, 100 cols, double quotes); there is no ESLint. React hooks rules (`useExhaustiveDependencies`, `useHookAtTopLevel`) and the fast-refresh rule (`useComponentExportOnlyModules`, off for `*.test.*`) are configured in `biome.json`.

Workflow, branching (Gitflow: `feature/*` from `develop`, `hotfix/*` from `main`) and commit conventions are in `AGENTS.md` and `GIT_WORKFLOW.md`. Vercel deploys `main` only (`vercel.json` disables `develop`).

## Architecture

Astro 5 site with React 18 islands, TypeScript and Tailwind 3. Portfolio of a Brazilian front-end developer at `devguimaraes.com.br`. Pages are prerendered (`output: 'static'`, `build.format: 'directory'`) with the `@astrojs/vercel` adapter. The only server code is the on-demand Vercel function for the contact form (`src/pages/api/contato.ts`, ADR 0002, #54), with `prerender = false`. There are no other API routes. Navigation between pages goes through Astro's `ClientRouter`, so the page does not reload.

### Astro shell, React content

Astro pages in `src/pages/` are thin wrappers that hydrate one React component from `src/components/pages/` (or `src/components/projects/CaseStudy.tsx`) via `client:load`. Routes: `index`, `blog/index`, `blog/[slug]`, `projetos/[slug]`, `404`. `dev/[page]` is generated only by the dev server.

`src/layouts/Layout.astro` is the only layout. Besides SEO (OG, Twitter, canonical, `noindex` on Vercel previews), Plausible (prod only) and `<ClientRouter />` in the head, the body mounts `LoadingScreen`, `SiteHeader` (desktop), the `<slot />` inside `<main>`, `SiteFooter` (`client:visible`), and the `ScrollIsland` (desktop) and `TabBar` (mobile) with `transition:persist`, so they survive page changes. Nav code lives in `src/components/nav/` (`sections.ts` has the section ids and the tab list). Home sections are wrapped in `SectionEntrance` (`src/components/ui/SectionEntrance.tsx`) in `components/pages/Index.tsx`; the anchors are `#hero`, `#projetos`, `#processo`, `#sobre`, `#blog`, `#contato`, used by the nav and the e2e tests.

The page's island sits in `<slot />` inside `<main>`. Each `client:*` component is its own island, so state shared across islands goes through module-level stores (see i18n below). With `ClientRouter`, islands are remounted on each navigation unless they use `transition:persist`. Scripts in pages must also run again on `astro:page-load`, not only on first load. Menus kept alive by `transition:persist` must close themselves on `astro:before-preparation` (see `useMenuDismiss`).

Scroll: never put `overflow-x: hidden` on `html`, `body` or `main`. It turns them into scroll containers (`overflow-y` becomes `auto`), which causes scroll inside sections and breaks `position: sticky`. Use `overflow-x: clip`. An e2e test in `home.spec.ts` guards this.

Transition for the case page: `src/pages/projetos/[slug].astro` has a global style where, on mobile only and without reduced motion, the case slides in from the right. The style exists only on that page, so the rule applies to `/projetos/*` destinations.

### i18n without a framework

`src/lib/i18n.ts` holds a flat `dictionary` (pt, en), `t(locale, key)` with `TranslationKey` derived from `dictionary.pt`, and a pub/sub store (`getLocale`/`setLocale`/`subscribeToLocale`). `useLocale()` subscribes React components to it. The locale is persisted in `localStorage('locale')`, and a script in `Layout.astro` sets `<html lang>` and `og:locale` on first load and again on `astro:after-swap` and `astro:page-load`, because `ClientRouter` copies the `<html>` attributes from the new page on each swap. A new UI string needs both languages in the dictionary or the key type breaks.

### Blog content

Markdown in `src/content/blog/*.md`, collection defined in `src/content.config.ts` (Zod: `title`, `date` as string, `excerpt` required; `readTime`, `tags`, `author`, `image`, `featured` optional or defaulted). Pages render with Astro's `render(entry)` and `<Content />`. `src/lib/blog/` has the helpers (reading time, word count, code blocks, content fetching). Blog category filter is derived from `tags[0]`. Markdown styles live in `src/styles/markdown.css` (`data-markdown-content`).

Unit tests alias `astro:content` to `src/test/__mocks__/astro-content.ts` (`vitest.config.ts`), so code importing it can be tested without Astro.

### Other data and config

- `src/data/projects.ts`: typed static data feeding the home cases and the case study pages.
- `src/config/site.ts`: SEO config, Brazilian market keywords, contact data, performance budgets (300KB JS, 500KB images, 50KB CSS, 1MB total, enforced for media by `check:media-budget`).
- Giro mascot and states (ADR 0001): components in `src/components/brand/` (`Giro.tsx`, states in `giro-states.ts`). It is animated SVG with Framer Motion, one variant per state. Do not add Rive or Lottie.
- Motion: Framer Motion is the only animation library. GSAP, Lenis and the glass effect were removed, and ADR 0001 says not to bring them back without revisiting it. Animated components should honor `useReducedMotion`.

### Design system

Identity Giro (ADR 0001) replaces the old dark, neo-brutalist theme. Source of truth: the "Giro" Design System artifact linked in the ADR. In code, tokens and surfaces live in `src/styles/giro.css`: `g-papel` (reading), `g-azul` (brand) and `g-tinta` (dark). Pages alternate brand and reading surfaces. There is no dark mode at launch.

Fonts are Anybody (`sans`) and Geist Mono (`mono`), bundled in `src/assets/fonts/` and set as CSS variables in `giro.css`. Tailwind `fontFamily` only maps those two. Check `tailwind.config.ts` and `giro.css` before using a token. The legacy `brutal` palette, shadcn tokens and `shadow-brutal*` classes were removed. The docs `docs/guia-de-design-atual.md` and `docs/identidade-visual-atual.md` describe the previous identity and are historical.

## Testing

- **Unit:** Vitest + jsdom + Testing Library, tests colocated as `*.test.ts(x)`. `src/test/setup.ts` mocks IntersectionObserver, ResizeObserver, matchMedia and Framer Motion.
- **E2E:** Playwright, specs in `src/test/e2e/*.spec.ts`, `baseURL` `http://127.0.0.1:4321`.
- Vitest excludes `src/test/e2e` and `.worktrees`.
- Pre-PR checklist: `bun run lint && bun run test:unit && bun run test:e2e`, plus a build for visual or content changes.
- Path alias `@/` maps to `src/` (set in `tsconfig.json`, `tsconfig.app.json` and `vitest.config.ts`).

## Related documentation

- `AGENTS.md`: structure, naming, Gitflow, commit and PR rules
- `TESTING.md`, `CONTRIBUTING.md`: overlap with this file
- `docs/`: design guides, branding, audits, plans. Many are historical, so verify against code.

## Agent skills

### Issue tracker

Issues vivem no GitHub Issues de `devguimaraes/developer-bruno`, via CLI `gh`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: um `GLOSSARY.md` e `docs/adr/` na raiz. See `docs/agents/domain.md`.
