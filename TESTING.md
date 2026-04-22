# Testing Bruno's Portfolio

This repository uses Playwright for local end-to-end coverage and Vitest for unit/component tests.

## Local Setup

1. Install dependencies with `bun install`.
2. Start the Astro dev server with `bun run dev`.
3. Keep the app available at `http://127.0.0.1:4321/` for browser tests.

## Main Commands

- `bun run test:unit` for unit/component tests.
- `bun run test:e2e` for Playwright tests in `src/test/e2e`.
- `bun run lint` for Biome linting before review or release.

## What We Verify

- Navigation and anchor behavior.
- Mobile and desktop layouts.
- External links and interactive controls.
- Visual stability across viewports.

## Troubleshooting

If E2E fails, confirm the dev server is reachable at `http://127.0.0.1:4321/`, then rerun the Playwright suite.
