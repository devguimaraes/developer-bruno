# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vite + React + TypeScript portfolio app.

- `src/`: application code.
- `src/components/`: page sections and reusable UI primitives (`src/components/ui`).
- `src/pages/`: route-level pages.
- `src/hooks/`, `src/lib/`, `src/types/`, `src/data/`: shared logic, utilities, types, and content data.
- `src/test/`: test setup and E2E tests (`src/test/e2e`).
- `public/`: static assets served as-is.
- `supabase/functions/`: edge/serverless functions.
- `docs/`: architecture, design, and implementation notes.
- `scripts/`: automation scripts (for example sitemap generation).

## Build, Test, and Development Commands
- `npm run dev`: start local dev server (Vite, port `8080`).
- `npm run build`: production build + sitemap generation.
- `npm run build:dev`: development-mode build + sitemap generation.
- `npm run preview`: preview production build locally.
- `npm run lint`: run ESLint across the project.
- `npm run test`: watch-mode unit/component tests with Vitest.
- `npm run test:unit`: single-run Vitest execution.
- `npm run test:e2e`: Playwright tests from `src/test/e2e`.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true` in `tsconfig.app.json`).
- Indentation: 2 spaces; prefer small, focused React components.
- Use path alias `@/` for imports from `src`.
- Naming:
  - Components/pages: `PascalCase` (e.g., `BlogPostPage.tsx`).
  - Hooks: `use*` camelCase (e.g., `useWebVitals.ts`).
  - Tests: `*.test.ts(x)` for Vitest, `*.spec.ts` for Playwright.
- Linting: ESLint (`eslint.config.js`); pre-commit runs `lint-staged` with `eslint --fix` and `tsc --noEmit`.

## Testing Guidelines
- Unit/component tests run in `jsdom` via Vitest.
- Keep unit tests close to source files when practical (examples already in `src/lib` and `src/hooks`).
- E2E uses Playwright with desktop and mobile projects.
- Before opening a PR, run: `npm run lint && npm run test:unit && npm run test:e2e`.

## Commit & Pull Request Guidelines
- Follow Gitflow:
  - `feature/*` from `develop`, merge back to `develop`.
  - `hotfix/*` from `main`, merge to both `main` and `develop`.
  - `release/*` from `develop`.
- Use Conventional Commits, optionally scoped:
  - `feat(hero): add CTA variant`
  - `fix(seo): sanitize JSON-LD output`
- Open PRs with a clear description, linked issue/task, and screenshots for UI changes.
- Ensure CI/status checks pass and request review before merge.
