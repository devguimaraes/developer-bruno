# Developer Bruno — Design System Conventions

## Setup & Wrapping

Este design system é construído em **Astro 5 + React 18 + Tailwind CSS** com modo dark ativo por padrão.

### Root wrapper necessário
```tsx
// Layout.astro (Astro)
<html class="dark">
  <body class="bg-black text-white">
    <YourComponent client:load />
  </body>
</html>

// ou em React isolado
export default function App() {
  return (
    <div className="dark bg-black text-white min-h-screen">
      <Navigation />
      <Hero />
    </div>
  )
}
```

**O que quebra sem isso:** Tailwind não aplica cores, sombras e breakpoints — componentes ficam unstyled.

### Dark mode & CSS vars
O tema usa HSL CSS variables via Tailwind:
```css
:root {
  --primary: 0 0% 100%;      /* white */
  --accent: 45 87% 57%;      /* gold */
  --background: 0 0% 0%;     /* black */
}
```

**Load order importante:**
1. Tailwind base (reset)
2. Tokens CSS (via `src/index.css`)
3. Componentes
4. Animações (Framer Motion, GSAP)

---

## Styling Idiom: Tailwind Utilities + Neo-Brutalist Classes

### Cor & Tipografia
```tsx
// Cores (via CSS vars → Tailwind tokens)
className="bg-background text-foreground border-primary"
className="hover:bg-accent hover:text-accent-foreground"

// Fontes (Tailwind custom family)
className="font-mono"           // JetBrains Mono
className="font-sans"           // Satoshi
className="font-pixel"          // Jersey 15 (labels, pixel art)
```

### Neo-Brutalist Visual Language

> **Nota:** `border-4`, `shadow-brutal-sm/lg`, `shadow-neo`, `animate-slide-up` são utilitários Tailwind válidos neste sistema mas não estão pré-compilados no bundle atual (nenhum dos 7 componentes sincronizados os usa). Estão disponíveis com uma compilação Tailwind completa. Os tokens de CSS custom properties `--muted`, `--secondary`, `--primary-foreground`, `--muted-foreground` são injetados em runtime via shadcn/ui e não estão no bundle shipping.

```tsx
// Bordas & sombras (nunca rounded)
className="border-4 border-white shadow-brutal"
className="shadow-brutal-sm hover:shadow-brutal-lg transition-shadow"
className="shadow-neo"          // hard offset, sem blur

// Animações
className="animate-slide-up animate-fade-in"
className="animate-marquee"     // scroll infinito
className="transition-all duration-200"

// Breakpoints
className="text-xs md:text-sm lg:text-base"
className="hidden md:block"     // md = 768px, novo xs = 480px
```

### Padrões comuns
```tsx
// Cards neo-brutalista
<div className="border-4 border-white bg-black p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow">
  Conteúdo
</div>

// Botão pressão (mobile)
<button className="px-4 py-2 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-transform" />

// Layout responsivo com clamp()
<h1 className="text-[clamp(1.75rem,8vw,3rem)] leading-tight" />
```

---

## Where the Truth Lives

### Stylesheets
- **`src/index.css`** — estilos globais, CSS vars, Tailwind directives
- **`src/styles/markdown.css`** — tipografia para blog posts
- **`tailwind.config.ts`** — tokens, breakpoints, animations, fontFamily

### Componentes & Documentação
- **`src/components/`** — componentes React principais
  - `Navigation.tsx` — navbar fixa, hamburger menu mobile
  - `Hero.tsx` — hero section com gradient
  - `Projects.tsx` — grid de projetos
  - `About.tsx` — seção sobre bio
  - `Footer.tsx` — rodapé com versão
  - `InfoBar.tsx` — barra social/contact
  - `SocialIcons.tsx` — ícones Lucide React

### Hooks & Libs de Suporte
- **`src/hooks/useReducedMotion`** — respeita `prefers-reduced-motion`
- **`src/hooks/useScrollSpy`** — tracking de headings para TOC
- **`src/hooks/useMobile`** — detecção `md` (768px)
- **`src/lib/i18n.ts`** — sistema pt/en com store reativo

---

## Exemplo Idiomatic

```tsx
// Componente novo seguindo convenções do projeto
import { cn } from "@/lib/utils";

export function SectionCard({ title, children }) {
  return (
    <section className="px-4 md:px-8 py-8 md:py-16 max-w-full overflow-x-hidden">
      <div className="border-4 border-white shadow-brutal p-6 hover:shadow-brutal-lg transition-shadow">
        <h2 className="text-[clamp(1.5rem,6vw,2.5rem)] font-bold mb-4">
          {title}
        </h2>
        <div className="text-sm leading-relaxed text-gray-300">
          {children}
        </div>
      </div>
    </section>
  );
}

// Uso em página
<SectionCard title="Engineering">
  High-performance interfaces, type-safe React, semantic HTML.
</SectionCard>
```

---

## Princípios de Design

1. **Impacto antes de ornamentação** — headlines grandes, high contrast, composição ampla
2. **Interface como artefato técnico** — labels uppercase, microcopy tipo console, metadados compactos
3. **Motion com propósito** — revela conteúdo, não enche
4. **Mobile first** — min 11px tipografia, 44px touch targets, breakpoint xs (480px) novo

Leia `docs/guia-de-design-atual.md` e `docs/branding-guide-atual.md` para context completo de marca e identidade.
