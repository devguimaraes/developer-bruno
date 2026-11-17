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

Astro 5 site with React 18 islands, TypeScript and Tailwind 3. Portfolio of a Brazilian front-end developer at `brunoguimaraes.dev`. Pages are prerendered (`output: 'static'`, `build.format: 'directory'`) with the `@astrojs/vercel` adapter. The only server code is the on-demand Vercel function for the contact form (`src/pages/api/contato.ts`, ADR 0002, #54), with `prerender = false`. There are no other API routes. Navigation between pages goes through Astro's `ClientRouter`, so the page does not reload.

### Astro shell, React content

Astro pages in `src/pages/` are thin wrappers that hydrate one React component from `src/components/pages/` (or `src/components/projects/CaseStudy.tsx`) via `client:load`. Routes: `index`, `blog/index`, `blog/[slug]`, `projetos/[slug]`, `404`. `dev/[page]` is generated only by the dev server.

`src/layouts/Layout.astro` is the only layout. Besides SEO (OG, Twitter, canonical, `noindex` on Vercel previews), Plausible (prod only) and `<ClientRouter />` in the head, the body mounts `LoadingScreen`, `SiteHeader` (desktop), the `<slot />` inside `<main>`, `SiteFooter` (`client:visible`, every page except the home, where the footer is part of the final chapter), and the `ScrollIsland` (desktop) and `Dock` (mobile icon rail) with `transition:persist`, so they survive page changes. Nav code lives in `src/components/nav/` (`sections.ts` has the section ids; `dock-map.ts` maps chapter and route to the active rail icon). On mobile the rail has no menu, so the language switch lives in the hero and in the footers.

The home is a story in chapters (map #112, `docs/handoff/home-camadas/`). `components/pages/Index.tsx` mounts `HomeGiro` and the chapters in order: `HomeOpening` (`#hero`, hero plus the States chapter on one stage), `HomeServices` (`#servicos`), `HomeProjects` (`#projetos`), `HomeProcess` (`#processo`), `HomeAbout` (`#sobre`), `HomeBlog` (`#blog`), `HomeContact` (`#contato`) and `HomeEnd` (`#fim`). These anchors are used by the nav and the e2e tests. Each chapter keeps its pure logic in a `*-stage.ts` next to it (with tests) and its CSS in its own file under `src/styles/`. `story/provisional-story.ts` builds the chapter list from the DOM for `HomeGiro`, the single Giro that jumps between `data-stop` elements; hover, typing and form state reach it through `story/story-signals.ts`. Stage rules live under `html[data-scenes="on"]` (set by `Layout.astro` before first paint unless reduced motion); without it every chapter reads in order. When `HomeGiro` takes over from the hero Giro it sets `html[data-giro-hand="story"]`, which stops the hero runtime and hides its rider, so there are never two faces.

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
- Giro mascot (ADR 0001): `src/components/brand/` (`Giro.tsx`, states and moments in `giro-states.ts`). It is SVG animated in CSS (`src/styles/giro.css`), not Framer Motion: `data-state` picks the state, `data-from` holds the previous one for the transition, and `data-moment` plays a short reaction on top (wink, hello, listening, dizzy), cleared when the `g-moment` clock animation ends. CSS renders before hydration, which the loader relies on. The only JS animation is leaving loading (Web Animations, pose math in `giro-motion.ts`, which mirrors the keyframes in `giro.css`). `--g-amp` scales translations at small sizes. Do not add Rive or Lottie.
- Motion: in the site, Framer Motion is used for diagrams and section entrances (`SectionEntrance` is no longer used on the home). GSAP with ScrollTrigger (ADR 0001 November 2026 revision) is used exclusively for the home scroll-driven story scenes (`src/components/home/story/`), loaded via dynamic import so it does not add weight to other routes. Each chapter builds one timeline through `useChapterScenes` (`scene()` with `scrub`, no `pin`; the chapter sticks with CSS `position: sticky`) and gives every animated CSS variable an initial value through `setVars`, or GSAP starts it from zero. Each chapter splits its timeline in two (ADR 0001, 12 November 2026 revision): discrete beats (Batida in `GLOSSARY.md`) live in a paused timeline played in time by `createBeatPlayer` (`story/beats.ts`), with scroll only picking the beat through the chapter's `calc*BeatTime`; continuous motion (parallax, the states script, the station line) and the Passagens stay scrubbed in `scene()`. On mount and resize the scene jumps straight to the current beat (`jumpTo`). Idle float runs in CSS (`translate`) for Processo and Projetos, and in JS (`layerFloat`, `calcEndFloat`) for the hero and Fim stacks, where lines and the Giro seat must move with the plates. `HomeGiro` follows its stop with a dt-based spring (`stepSpring` in `giro-jump.ts`), not frame-by-frame, and switches surface mid-flight; a stop painted over by a colour disc declares `data-surface`. Hero 3D stack, loader lay-down, and the Giro entrance path use pure CSS 3D and RAF transforms without extra libraries. Lenis and the glass effect remain removed. Outside the site, GSAP also lives in `motion/`, a HyperFrames studio where motion is studied on video before being ported to CSS. Animated components should honor `useReducedMotion`; Giro moments and chapter stages are skipped under reduced motion (`data-scenes="on"` is omitted).

### Design system

Identity Giro (ADR 0001) replaces the old dark, neo-brutalist theme. Source of truth: the "Giro" Design System artifact linked in the ADR. In code, tokens and surfaces live in `src/styles/giro.css`: `g-papel` (reading), `g-azul` (brand) and `g-tinta` (dark). Pages alternate brand and reading surfaces. There is no dark mode at launch.

Fonts are Anybody (`sans`) and Geist Mono (`mono`), bundled in `src/assets/fonts/` and set as CSS variables in `giro.css`. Tailwind `fontFamily` only maps those two. Geist Serif (`--font-serif`, Regular 400 only, display face) is used only for blog post titles: the `/blog` list, the post `h1`, related posts and markdown `h2`/`h3`. Page titles and the home stay in Anybody. Check `tailwind.config.ts` and `giro.css` before using a token. Page gutter, heading rhythm and vertical breathing room are tokens in `giro.css` (`--G`, `--head-gap-eyebrow`, `--head-gap-lead`, `--sec-top`/`--sec-bottom` for reading chapters on the home, `--page-top`/`--page-bottom` for inner pages): use them instead of per-chapter values. Sticky stages keep their own offsets, because their layout is fitted to the viewport. The legacy `brutal` palette, shadcn tokens and `shadow-brutal*` classes were removed.

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
