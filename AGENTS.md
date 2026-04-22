# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro 5 + React + TypeScript portfolio app.

- `src/`: application code.
- `src/components/`: page sections and reusable UI primitives (`src/components/ui`).
- `src/pages/`: route-level pages (mostly `.astro` and nested directories).
- `src/hooks/`, `src/lib/`, `src/types/`, `src/data/`, `src/content/`: shared logic, utilities, types, and content data.
- `src/test/`: test setup and E2E tests (`src/test/e2e`).
- `public/`: static assets served as-is (images, Rive files).
- `supabase/functions/`: edge/serverless functions.
- `docs/`: architecture, design, and implementation notes.
- `scripts/`: automation scripts (e.g., sitemap generation).

## Build, Test, and Development Commands
- `bun run dev`: start local dev server (Astro at `http://127.0.0.1:4321/`).
- `bun run build`: production build + sitemap generation.
- `bun run preview`: preview production build locally.
- `bun run lint`: run Biome across the project.
- `bun run test`: watch-mode unit/component tests with Vitest.
- `bun run test:unit`: single-run Vitest execution.
- `bun run test:e2e`: Playwright tests from `src/test/e2e`.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true` in `tsconfig.app.json`).
- Indentation: 2 spaces; prefer small, focused React components for interactivity.
- Use path alias `@/` for imports from `src`.
- Naming:
  - Components: `PascalCase` (e.g., `Hero.tsx`).
  - Pages: `.astro` files usually `index.astro` or kebab-case (e.g., `[slug].astro`).
  - Hooks: `use*` camelCase (e.g., `useWebVitals.ts`).
  - Tests: `*.test.ts(x)` for Vitest, `*.spec.ts` for Playwright.
- Linting: Biome (`biome.json`); pre-commit runs `lint-staged` with `biome lint --fix`, `biome format --write`, and `tsc --noEmit`.

## Testing Guidelines
- Unit/component tests run in `jsdom` via Vitest.
- Keep unit tests close to source files when practical (examples in `src/lib` and `src/hooks`).
- E2E uses Playwright with desktop and mobile configurations against `http://127.0.0.1:4321/`.
- Before opening a PR, run: `bun run lint && bun run test:unit && bun run test:e2e`.

## Commit & Pull Request Guidelines
- Follow Gitflow:
  - `feature/*` from `develop`, merge back to `develop`.
  - `hotfix/*` from `main`, merge to both `main` and `develop`.
  - `release/*` from `develop`.
- Use Conventional Commits:
  - `feat(hero): add CTA variant`
  - `fix(seo): sanitize JSON-LD output`
- Open PRs with a clear description, linked issue/task, and screenshots for UI changes.
- Ensure CI/status checks pass and request review before merge.
