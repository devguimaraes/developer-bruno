> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Repo Hygiene Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Limpar código morto, remover deps não usadas, deletar docs legados e reescrever DESIGN_SYSTEM_GUIDELINE.md para refletir o estado atual do repositório.

**Architecture:** Investigação com grep de 5 critérios, classificação por risco, execução apenas de baixo risco, validação com lint + build + testes.

**Tech Stack:** Astro 5, React 18, TypeScript, Tailwind CSS, Biome, Vitest

---

## Investigation Results (Reference)

### Arquivos confirmados SEM uso (zero imports em todo src/)

**Componentes raiz órfãos:**
- `src/components/Services.tsx` — ninguém importa `@/components/Services`
- `src/components/Metrics.tsx` — ninguém importa `@/components/Metrics`
- `src/components/TechTicker.tsx` — ninguém importa `@/components/TechTicker`
- `src/components/ComputerIllustration.tsx` — ninguém importa `@/components/ComputerIllustration`
- `src/components/Blog.tsx` — ninguém importa `@/components/Blog`
- `src/components/Experience.tsx` — ninguém importa `@/components/Experience`
- `src/components/Contact.tsx` — ninguém importa `@/components/Contact` (ATUALIZAÇÃO: Verificar abaixo)
- `src/components/ErrorBoundary.tsx` — ninguém importa `@/components/ErrorBoundary`
- `src/components/StructuredData.tsx` — ninguém importa `@/components/StructuredData`
- `src/components/Layout.tsx` — ninguém importa `@/components/Layout` (Layout real é Layout.astro)

**Componentes UI órfãos:**
- `src/components/ui/NeoButton.tsx` — zero imports
- `src/components/ui/BackgroundGrid.tsx` — zero imports
- `src/components/ui/BlurText.tsx` — zero imports
- `src/components/ui/DesktopIcon.tsx` — zero imports
- `src/components/ui/OSWindow.tsx` — zero imports
- `src/components/ui/PixelBlast.tsx` — zero imports
- `src/components/ui/TiltedCard.tsx` — zero imports
- `src/components/ui/image-with-skeleton.tsx` — zero imports
- `src/components/ui/typewriter.tsx` — importado SÓ por ComputerIllustration.tsx (que é órfão)

**shadcn/ui primitivos órfãos (zero imports):**
- `src/components/ui/button.tsx` — zero imports
- `src/components/ui/button-variants.ts` — zero imports (mas importado por NeoButton que também é órfão)
- `src/components/ui/dialog.tsx` — zero imports
- `src/components/ui/sheet.tsx` — zero imports
- `src/components/ui/skeleton.tsx` — importado SÓ por image-with-skeleton.tsx (órfão)
- `src/components/ui/toast.tsx` — importado SÓ por toaster.tsx
- `src/components/ui/toaster.tsx` — zero imports externos
- `src/components/ui/tooltip.tsx` — zero imports
- `src/components/ui/label.tsx` — zero imports
- `src/components/ui/separator.tsx` — zero imports
- `src/components/ui/input.tsx` — zero imports

**Layout órfão:**
- `src/components/layout/FixedSidebar.tsx` — zero imports
- `src/components/layout/HorizontalSplitLayout.tsx` — zero imports

**Hooks órfãos:**
- `src/hooks/use-analytics.ts` — zero imports
- `src/hooks/use-mobile.tsx` — zero imports (Navigation.tsx NÃO o importa)
- `src/hooks/use-toast.ts` — zero imports externos
- `src/hooks/useStackingSections.ts` — zero imports
- `src/hooks/useHorizontalScroll.ts` — importado SÓ por HorizontalSplitLayout.tsx (órfão)

**Lib órfãos:**
- `src/lib/sitemap.ts` — zero imports (não importado por nenhuma page ou componente)
- `src/lib/structured-data.ts` — importado SÓ por StructuredData.tsx (órfão)
- `src/lib/typography.ts` — importado SÓ por BlogPostContent.tsx (que É usado via BlogPostPage)
- `src/lib/utils.ts` — zero imports

**Types órfãos:**
- `src/types/sitemap.ts` — re-exportado por index.ts, mas o tipo nunca é referenciado em uso real
- `src/types/performance.ts` — re-exportado por index.ts, mas nunca usado diretamente
- `src/types/seo.ts` — re-exportado por index.ts, mas nunca usado diretamente
- `src/types/blog.ts` — importado por lib/blog/index.ts (que É usado por blog pages)
- `src/types/testimonial.ts` — importado SÓ por data/testimonials.ts (órfão)
- `src/types/global.d.ts` — global augmentation, pode ter efeitos no TypeScript

**Data órfãos:**
- `src/data/testimonials.ts` — zero imports

**Constants órfãos:**
- `src/constants/ui.ts` — importado SÓ por BlogPage.tsx (que É usado por blog page)

### Dependências confirmadas SEM uso (zero imports em src/)

- `@supabase/supabase-js` — zero imports em src/ (existe supabase/ mas não é usado pelo app)
- `@tanstack/react-query` — zero imports
- `@types/three` — zero imports
- `three` — zero imports em src/
- `react-hook-form` — zero imports
- `plausible-tracker` — zero imports (analytics via script tag no Layout.astro)

### Dependências com uso complexo (MÉDIO risco)

- `next-themes` — importado SÓ em sonner.tsx (Toaster), mas o site é dark-only. O Toaster é importado pelo Layout.astro.
- `@gsap/react` — zero imports em src/ (gsap puro é usado, mas @gsap/react não)

### Arquivos SUSPEITOS (não confirmados — necessitam revisão manual)

- `src/components/Contact.tsx` — não é importado por Index.tsx, mas pode ter sido planejado para uso futuro
- `src/components/Experience.tsx` — idem
- `src/data/projects.ts` — não é importado (Projects.tsx tem dados hardcoded)
- `src/data/experience.ts` — não é importado por nenhum componente usado
- `src/data/skills.ts` — importado SÓ por Skills.tsx, que NÃO é importado por Index.tsx
- `src/types/global.d.ts` — pode afetar TypeScript global
- `src/lib/validation.ts` — importado por validation.test.ts mas não por código de produção
- `src/hooks/useWebVitals.ts` — não é importado por nenhum componente

---

## Task 1: Delete Legacy Docs

**Files:**
- Delete: `docs/ARCHITECTURE.md`
- Delete: `docs/ARCHITECTURE_DESIGN_SYSTEM.md`
- Delete: `docs/BACKEND_DB_DESIGN_SYSTEM.md`
- Delete: `docs/PHASE1_IMPLEMENTATION.md`
- Delete: `docs/RUNTIME_FIXES.md`

- [ ] **Step 1: Delete the 5 legacy doc files**

```bash
rm docs/ARCHITECTURE.md docs/ARCHITECTURE_DESIGN_SYSTEM.md docs/BACKEND_DB_DESIGN_SYSTEM.md docs/PHASE1_IMPLEMENTATION.md docs/RUNTIME_FIXES.md
```

- [ ] **Step 2: Verify remaining docs are intact**

Run: `ls docs/`
Expected: `DESIGN_SYSTEM_GUIDELINE.md`, `AUDITORIA_EXECUCAO_TRACKER.md`, `AUDITORIA_SEGURANCA.md`, `PROJECT_ANALYSIS.md`, `animacoes.md`, `id-visual/`, `page-antigravity.md`, `plano-melhoria-sitemap.md`, `projetos.md`, `superpowers/`

- [ ] **Step 3: Commit**

```bash
git add docs/ARCHITECTURE.md docs/ARCHITECTURE_DESIGN_SYSTEM.md docs/BACKEND_DB_DESIGN_SYSTEM.md docs/PHASE1_IMPLEMENTATION.md docs/RUNTIME_FIXES.md
git commit -m "chore: remove legacy docs referencing Vite/Supabase/Deno stack"
```

---

## Task 2: Rewrite DESIGN_SYSTEM_GUIDELINE.md

**Files:**
- Modify: `docs/DESIGN_SYSTEM_GUIDELINE.md` (full rewrite)

- [ ] **Step 1: Read current state references for accuracy**

Read these files to extract real values:
- `src/index.css` — CSS variables, type utilities
- `tailwind.config.ts` — color tokens, shadows, animations, fonts
- `src/layouts/Layout.astro` — global UI elements, analytics, font loading
- `src/components/ui/` — list of active components

- [ ] **Step 2: Write the new DESIGN_SYSTEM_GUIDELINE.md**

Replace the entire file with content reflecting:

```markdown
# Developer Bruno — Design System Guidelines

> **Versão:** 2.0.0
> **Stack:** Astro 5 (static SSG) + React 18 islands + TypeScript + Tailwind CSS
> **Última atualização:** 2026-04-08

## 1. Identidade Visual: "Techno Brutalist Prism"

Estética neo-brutalista com alto contraste, bordas marcantes e motion digital/glitchy, otimizada para o mercado brasileiro.

### Mandamentos Visuais
1. **Borders are King:** `border-4` com sombras sólidas, sem blur
2. **Shadows are Hard:** `shadow-brutal` / `shadow-neo` (offset fixo, zero blur)
3. **Motion is Glitch:** Animações digitais, mecânicas ou glitchy

## 2. Design Tokens

### Cores (HSL — src/index.css + tailwind.config.ts)

| Token | Nome | Valor | Uso |
|-------|------|-------|-----|
| `--background` | Black | `0 0% 0%` | Fundo base (dark-only) |
| `--foreground` | White | `0 0% 100%` | Texto principal |
| `--primary` | White | `0 0% 100%` | Ações principais |
| `--accent` | Freesia | `45 87% 57%` | Destaques |
| `--border` | White | `0 0% 100%` | Bordas |

**Cores brutalistas (tailwind.config.ts):** `brutal-bg`, `brutal-dark`, `brutal-orange`, `brutal-yellow`, `brutal-purple`, `brutal-blue`, `brutal-green`, `brutal-red`

### Sombras (tailwind.config.ts)

| Classe | Valor |
|--------|-------|
| `shadow-brutal` | `var(--shadow-brutal)` |
| `shadow-brutal-sm` | `var(--shadow-brutal-sm)` |
| `shadow-brutal-lg` | `var(--shadow-brutal-lg)` |
| `shadow-neo` | `4px 4px 0px 0px rgba(0,0,0,1)` |
| `shadow-neo-sm` | `2px 2px 0px 0px rgba(0,0,0,1)` |
| `shadow-neo-lg` | `8px 8px 0px 0px rgba(0,0,0,1)` |

## 3. Tipografia

### Famílias (Google Fonts via Layout.astro)

| Token | Fonte | Uso |
|-------|-------|-----|
| `--font-pixel-display` | Jersey 15 | Títulos hero, display |
| `--font-pixel-tech` | Silkscreen | Labels técnicos, UI mono |
| `--font-serif` | Newsreader | Texto serif (uso editorial) |
| `font-mono` | JetBrains Mono | Código, detalhes técnicos |
| `font-sans` | Inter (was Satoshi) | Corpo de texto |

### Type Utilities (src/index.css)

| Classe | Uso |
|--------|-----|
| `type-raster-hero` | Títulos hero principal |
| `type-raster-section` | Títulos de seção |
| `type-mono` | Labels monospace pequenos |
| `type-display-hero` | Display hero alternativo |
| `type-display-section` | Display de seção |
| `type-display-card` | Display de card |
| `type-ui-label` | Labels de UI |
| `type-body` | Corpo de texto padrão |

## 4. Componentes UI (src/components/ui/)

Componentes ativos (importados por pages ou outros componentes em uso):

| Componente | Arquivo | Uso |
|------------|---------|-----|
| SectionEntrance | `SectionEntrance.tsx` | Wrapper de seção com animação scroll |
| GlitchImage | `GlitchImage.tsx` | Imagem com efeito glitch (suporta vídeo) |
| GlassSurface | `GlassSurface.tsx` | Superfície com efeito glass |
| GrainOverlay | `GrainOverlay.tsx` | Overlay de grão global |
| CustomCursor | `CustomCursor.tsx` | Cursor customizado |
| PixelLoader | `PixelLoader.tsx` | Loading screen pixelado |
| SmoothScroll | `SmoothScroll.tsx` | Smooth scroll via Lenis |
| ShuffleText | `ShuffleText.tsx` | Texto com efeito shuffle (GSAP) |
| StaggeredMenu | `StaggeredMenu.tsx` | Menu com animação staggered |
| Magnetic | `Magnetic.tsx` | Efeito magnético em hover |
| ScrollReveal | `ScrollReveal.tsx` | Reveal on scroll |
| TextReveal | `TextReveal.tsx` | Texto com reveal animation |
| BorderGlow | `BorderGlow.tsx` | Borda com efeito glow |
| motion-components | `motion-components.tsx` | Primitivos Framer Motion reutilizáveis |
| scroll-animation | `scroll-animation.tsx` | Animações baseadas em scroll |
| Avatar | `Avatar.tsx` | Avatar com estilo brutalista |
| Toaster (sonner) | `sonner.tsx` | Toast notifications |

## 5. Efeitos Globais

- **GrainOverlay** — Textura de grão sobre toda a página (Layout.astro)
- **CustomCursor** — Cursor customizado seguindo o mouse (Layout.astro)
- **PixelLoader** — Tela de carregamento pixelada (Layout.astro)
- **SmoothScroll** — Lenis smooth scroll wrapper (Layout.astro)

## 6. Animações (tailwind.config.ts + Framer Motion + GSAP)

- **CSS keyframes:** `float`, `float-slow`, `float-medium`, `float-fast`, `typing`, `glitch`, `marquee`, `slide-up`, `slide-right`, `fade-in`, `scale-in`
- **Framer Motion:** Usado em Hero, About, Projects, SectionEntrance, TextReveal, ScrollReveal
- **GSAP:** Usado em ShuffleText, StaggeredMenu
- **Regra:** CSS puro para animações contínuas. Framer Motion para transições enter/exit. GSAP para efeitos de texto avançados.

## 7. Observabilidade

- **Analytics:** Plausible Analytics (script tag no Layout.astro, production only). LGPD-compliant, sem cookies.
- **Performance:** `useWebVitals` hook disponível em `src/hooks/useWebVitals.ts`
- **Budgets (site.ts):** JS < 300KB, Images < 500KB, CSS < 50KB, Total < 1MB

## 8. Checklist de Code Review

- [ ] Componente respeita o tema neo-brutalista?
- [ ] Cores usam variáveis CSS/Tailwind (sem hardcoded)?
- [ ] Imagens têm `alt` e estão em WebP?
- [ ] Animações contínuas usam CSS (não JS)?
- [ ] Componente novo está em `src/components/ui/`?
```

- [ ] **Step 3: Verify the new doc renders correctly**

Run: `head -5 docs/DESIGN_SYSTEM_GUIDELINE.md`
Expected: Shows the new header with version 2.0.0 and Astro 5 stack.

- [ ] **Step 4: Commit**

```bash
git add docs/DESIGN_SYSTEM_GUIDELINE.md
git commit -m "docs: rewrite DESIGN_SYSTEM_GUIDELINE.md to reflect Astro 5 stack"
```

---

## Task 3: Remove Confirmed Orphan Components

**Files:**
- Delete: 8 root component files (confirmed zero imports)
- Delete: 9 UI component files (confirmed zero imports, including chain orphans)
- Delete: 2 layout component files (confirmed zero imports)
- Delete: associated CSS files if they exist

- [ ] **Step 1: Delete orphan root components**

These are confirmed not imported by any page (Index.tsx, BlogPage.tsx, BlogPostPage.tsx, NotFound.tsx) or any other active component:

```bash
rm src/components/Services.tsx
rm src/components/Metrics.tsx
rm src/components/TechTicker.tsx
rm src/components/ComputerIllustration.tsx
rm src/components/Blog.tsx
rm src/components/Experience.tsx
rm src/components/ErrorBoundary.tsx
rm src/components/StructuredData.tsx
rm src/components/Layout.tsx
```

- [ ] **Step 2: Delete orphan UI components (zero imports)**

```bash
rm src/components/ui/NeoButton.tsx
rm src/components/ui/BackgroundGrid.tsx
rm src/components/ui/BlurText.tsx
rm src/components/ui/DesktopIcon.tsx
rm src/components/ui/OSWindow.tsx
rm src/components/ui/PixelBlast.tsx
rm src/components/ui/TiltedCard.tsx
rm src/components/ui/image-with-skeleton.tsx
rm src/components/ui/typewriter.tsx
```

- [ ] **Step 3: Delete orphan shadcn/ui primitives (zero imports from active code)**

These form an isolated cluster — button/button-variants only imported by NeoButton (deleted), skeleton only by image-with-skeleton (deleted), toast/toaster form closed loop not used by active code, etc.:

```bash
rm src/components/ui/button.tsx
rm src/components/ui/button-variants.ts
rm src/components/ui/dialog.tsx
rm src/components/ui/sheet.tsx
rm src/components/ui/skeleton.tsx
rm src/components/ui/toast.tsx
rm src/components/ui/toaster.tsx
rm src/components/ui/tooltip.tsx
rm src/components/ui/label.tsx
rm src/components/ui/separator.tsx
rm src/components/ui/input.tsx
```

- [ ] **Step 4: Delete orphan layout components**

```bash
rm src/components/layout/FixedSidebar.tsx
rm src/components/layout/HorizontalSplitLayout.tsx
```

- [ ] **Step 5: Run lint to check for broken imports**

Run: `npm run lint`
Expected: No errors referencing deleted files. If there are errors, the file was not truly orphaned — investigate.

- [ ] **Step 6: Run build to verify no breakage**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/
git commit -m "chore: remove 30 orphan components with zero imports (confirmed via grep)"
```

---

## Task 4: Remove Confirmed Orphan Hooks, Libs, Types, Data, Constants

**Files:**
- Delete: hooks with zero imports
- Delete: lib files only imported by deleted components
- Delete: types/data/constants only imported by deleted/orphan code

- [ ] **Step 1: Delete orphan hooks**

```bash
rm src/hooks/use-analytics.ts
rm src/hooks/use-mobile.tsx
rm src/hooks/use-mobile.test.tsx
rm src/hooks/use-toast.ts
rm src/hooks/use-toast.test.ts
rm src/hooks/useStackingSections.ts
rm src/hooks/useStackingSections.test.tsx
rm src/hooks/useHorizontalScroll.ts
```

Note: `useWebVitals.ts` is kept — it's referenced in the design system and may be activated later. Classified as SUSPECT (medium risk).

- [ ] **Step 2: Delete orphan lib files**

```bash
rm src/lib/sitemap.ts
rm src/lib/sitemap.test.ts
rm src/lib/structured-data.ts
rm src/lib/utils.ts
rm src/lib/utils.test.ts
```

Note: `src/lib/typography.ts` is kept — imported by BlogPostContent.tsx which is active.
Note: `src/lib/validation.ts` is kept — has tests and may be used for future forms. SUSPECT.

- [ ] **Step 3: Delete orphan data files**

```bash
rm src/data/testimonials.ts
rm src/types/testimonial.ts
```

Note: `src/data/skills.ts` is imported by Skills.tsx (órfão). But `src/data/experience.ts` is imported by Experience.tsx (órfão). And `src/data/projects.ts` has zero imports. HOWEVER — these data files contain real portfolio data. Classified as SUSPECT (medium risk) — do NOT delete now.

- [ ] **Step 4: Run lint + build**

Run: `npm run lint && npm run build`
Expected: Both pass green.

- [ ] **Step 5: Commit**

```bash
git add -A src/hooks/ src/lib/ src/data/ src/types/
git commit -m "chore: remove orphan hooks, libs, types and data files with zero imports"
```

---

## Task 5: Remove Confirmed Unused Dependencies

**Files:**
- Modify: `package.json` (remove 7 deps)

- [ ] **Step 1: Remove confirmed unused deps from package.json**

These have zero imports in the entire `src/` directory:

```bash
npm uninstall @supabase/supabase-js @tanstack/react-query three @types/three react-hook-form plausible-tracker @gsap/react
```

Note: `next-themes` is kept for now (SUSPECT — used by sonner.tsx Toaster). See Task 7.

- [ ] **Step 2: Verify lockfile updates**

Run: `ls bun.lockb 2>/dev/null && echo "bun lockfile exists" || (ls package-lock.json 2>/dev/null && echo "npm lockfile exists")`

- [ ] **Step 3: Run build to verify no breakage**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lockb
git commit -m "chore: remove 7 unused dependencies (zero imports in src/)"
```

---

## Task 6: Validate and Run Full Test Suite

**Files:** None (validation only)

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: Pass green.

- [ ] **Step 2: Run build (includes TypeScript check)**

Run: `npm run build`
Expected: Pass green.

- [ ] **Step 3: Run unit tests**

Run: `npm run test:unit`
Expected: All tests pass. Some tests may reference deleted files — if so, delete those test files too.

- [ ] **Step 4: If any test fails, fix or delete the orphan test**

Tests that may need deletion:
- `src/hooks/use-mobile.test.tsx` — already deleted with hook
- `src/hooks/use-toast.test.ts` — already deleted with hook
- `src/hooks/useStackingSections.test.tsx` — already deleted with hook
- Any test importing deleted components

If `src/components/About.test.tsx`, `src/components/Contact.test.tsx`, `src/components/Hero.test.tsx`, `src/components/Navigation.test.tsx` reference deleted components in mocks, they should still pass since mocks replace the imports.

- [ ] **Step 5: Final commit if any test fixes needed**

```bash
git add -A
git commit -m "chore: remove orphan test files for deleted components"
```

---

## Task 7: Generate Hygiene Report

**Files:**
- Create: `docs/superpowers/reports/2026-04-08-repo-hygiene-report.md`

- [ ] **Step 1: Create the report file**

Write the report with the 7-section template from the spec, filling in:
1. Itens confirmados sem uso
2. Itens suspeitos
3. Documentação desatualizada
4. Dependências candidatas à remoção
5. Plano de ação por risco
6. Mudanças aplicadas
7. Validação final

- [ ] **Step 2: Commit the report**

```bash
git add docs/superpowers/reports/
git commit -m "docs: add repo hygiene report (2026-04-08)"
```

---

## Items Classified as MEDIUM/HIGH Risk (NOT executed — follow-up required)

### Medium Risk — Suspect, needs manual review

| Item | Why Suspect | How to Validate |
|------|-------------|-----------------|
| `src/components/Contact.tsx` | Not imported by Index.tsx but contains real contact section UI | Verify if it should be added to Index.tsx or is truly unused |
| `src/components/Experience.tsx` | Not imported by Index.tsx but contains real experience data | Verify if it's planned for a future section |
| `src/data/skills.ts` | Imported only by Skills.tsx (orphan) but has real skill data | Verify if Skills section will be reactivated |
| `src/data/experience.ts` | Imported only by Experience.tsx (orphan) but has real experience data | Verify if Experience section will be reactivated |
| `src/data/projects.ts` | Zero imports but has real project data (Projects.tsx has hardcoded data) | Verify if data should be consumed or file deleted |
| `next-themes` dep | Used by sonner.tsx but site is dark-only | Verify if Toaster needs theme switching |
| `src/hooks/useWebVitals.ts` | Not imported by any active component | Verify if it's meant to be wired into Layout |
| `src/lib/validation.ts` | Only imported by its own test, not by production code | Verify if it's planned for contact form |
| `src/types/global.d.ts` | Global augmentation file | Verify if it affects TypeScript behavior |
| `src/types/index.ts` | Re-exports from seo/sitemap/performance/blog — some of those types may still be used via barrel export | Trace all consumers of `@/types` |
| `src/components/ui/sonner.tsx` | Uses `next-themes` — Toaster imported by Layout.astro | If next-themes is removed, sonner needs rewrite |
| `supabase/` directory | Contains functions/ and migrations/ but no src/ code references Supabase | Verify if Supabase is used in production or is legacy |
| `src/constants/ui.ts` | Imported by BlogPage.tsx (which is active via blog page) | CONFIRMED USED — not a candidate for removal |

### High Risk — Requires careful review

| Item | Why High Risk | Action |
|------|--------------|--------|
| `supabase/` directory | May contain production Edge Functions | Manual review before deletion |
| `src/components/ui/sonner.tsx` + `next-themes` | Active Toaster in Layout.astro depends on next-themes | If removing next-themes, must rewrite sonner.tsx first |
