# Developer Bruno - Professional Portfolio

Guide for Gemini (AI assistant) working with this brutalist portfolio repository.

## 🚀 Quick Start

```bash
bun install && bun run dev    # Development server (http://127.0.0.1:4321)
bun run build && bun run preview  # Test production build
```

## 📋 Essential Commands

```bash
bun run dev          # Astro dev server
bun run build        # Production build + sitemap generation
bun run test         # Unit/Component tests (Vitest)
bun run test:e2e     # E2E tests (Playwright)
bun run lint         # Biome linting
bun run preview      # Preview production build locally
```

## 🏗️ Architecture Overview

**Tech Stack:**

- **Core:** Astro 5 (SSG Mode)
- **Frontend:** React 18.3 + TypeScript + Tailwind CSS 3.4
- **UI System:** shadcn/ui (36 components) + Radix UI + Framer Motion
- **Interactivity:** Framer Motion (animations), Embla Carousel, Sonner
- **Backend/Integrations:** Supabase (Edge Functions), Mercado Pago (PIX flow)
- **Monitoring:** Vercel Analytics, Speed Insights, Plausible (Privacy-first)

**Project Structure:**

```
src/
├── components/
│   ├── ui/             # shadcn/ui component library
│   ├── Navigation.tsx  # Interactive nav with mobile toggle
│   └── ...             # Feature components (Hero, About, etc.)
├── layouts/
│   └── Layout.astro    # Master layout (SEO, Fonts, Analytics)
├── pages/
│   ├── index.astro     # Main portfolio page
│   └── blog/           # Blog listing & dynamic posts
├── content/
│   └── blog/           # Blog posts content (Markdown)
├── hooks/              # Custom React hooks (useStackingSections, etc.)
├── data/               # Static data (projects, skills, experience)
└── lib/                # Shared utilities & validation
supabase/               # Supabase Edge Functions & Migrations
antigravity-pack/       # Antigravity product assets & docs
```

## 🎯 Development & Testing Strategy

**1. Verification Flow:**

- **Unit/Component:** `bun run test` (Vitest + React Testing Library)
- **E2E/Flow:** `bun run test:e2e` (Playwright)
- **Types/Lint:** `bun run lint` (Biome)
- **Playwright target:** local server at `http://127.0.0.1:4321/`

**2. Git Workflow:**

- **Pre-commit:** Husky + lint-staged runs linting and type checks automatically.
- **Package manager:** use Bun for install, scripts, and local workflows.
- **Conventional Commits:** Use clear prefixing (feat:, fix:, chore:, etc.).

## ⚡ Performance & SEO (Brazilian Market)

**Performance Budgets:** JS 300KB, Images 500KB, Total 1MB
**Web Vitals:** Thresholds adapted for Brazilian 3G/4G networks.
**SEO:** Automatic sitemap generation and schema.org structured data.

**Key Files:**

- `astro.config.mjs` - Integration & build config
- `src/config/site.ts` - SEO keywords & performance budgets
- `playwright.config.ts` - E2E test orchestration

## 🎨 Design System (Brutalist)

**Core Principles:**

- Heavy borders (`border-4`) with no border radius (`--radius: 0rem`)
- High contrast shadows: `shadow-brutal` / `shadow-neo`
- Neo-brutalist color palette (Parakeet, Royal Lilac, Freesia)

**Animations:**

- **Framer Motion:** Component transitions and scroll effects.
- **Scroll Stacking:** `useStackingSections.ts` for layered navigation.

## 👨‍💻 Guidelines for AI Agents

1. **Astro Islands:** Use `client:load` or `client:visible` for interactive React components.
2. **Type Safety:** Always use strict TypeScript. Define interfaces in `src/types/`.
3. **Data First:** All content should be externalized in `src/data/` or `src/content/`.
4. **Mobile First:** Ensure brutalist borders and shadows scale well on small screens.
5. **No Radius:** Never use `rounded-*` classes unless explicitly requested (Part of the IDV).

## ⚡ Deployment

**Optimized for Vercel:**

- SSG deployment for maximum speed.
- Middleware for redirects and performance monitoring.
- Serverless Edge Functions (via Supabase) for transactional flows.
