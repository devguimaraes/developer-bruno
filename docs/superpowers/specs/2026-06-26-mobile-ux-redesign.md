> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Mobile UX Redesign — Especificação de Design

**Data:** 2026-06-26
**Escopo:** Revisão completa da experiência mobile do portfolio devguimaraes.com.br
**Abordagem:** Refinamento Cirúrgico (manter DNA neo-brutalista, evoluir execução)

---

## 1. Tipografia & Escala de Fontes

### Regra global
Nenhum texto abaixo de **11px** em qualquer viewport.

### Nova escala base (mobile-first)

| Elemento | Atual (mobile) | Proposto |
|---|---|---|
| `.type-mono` (labels/tags) | `10px` | `12px` |
| Tags de post/projeto | `8-9px` | `11px` |
| Hero subtitle | `8px` | `12px` (`text-xs`) |
| Metadados de blog | `9px` | `12px` |
| Títulos de seção | `10-12vw` | `clamp(2.5rem, 10vw, 4rem)` |
| Blog post title | `clamp(1.9rem, 8vw, 3rem)` | Mantém (referência) |
| Projeto title overlay | `text-5xl` (48px) | `clamp(1.75rem, 8vw, 3rem)` |
| Footer | `text-xs` (12px) | `text-sm` (14px) |
| Navegação (desktop) | `10px` | `11px` com tracking reduzido |

### Diretrizes
- Títulos de seção usarão `clamp()` como padrão do projeto
- Tags e badges com `flex-wrap gap-1.5` para evitar overflow em telas estreitas

---

## 2. Alvos de Toque & Interatividade

### Regra de ouro
Todo elemento interativo com **`min-h-[44px] min-w-[44px]`**.

### Ajustes por elemento

| Elemento | Atual | Proposto |
|---|---|---|
| Ícones sociais (InfoBar) | `size={16}` sem área | `size={18}` + wrapper `p-2 min-h-[44px] min-w-[44px]` |
| Ícones sociais (StaggeredMenu) | `size={28}` | `size={24}` + wrapper `p-2.5` |
| Hamburger button | `p-2` (~40px) | `min-h-[44px] min-w-[44px] p-2` |
| Blog card "Acessar" | text-only link | `text-xs px-3 py-2 min-h-[44px]` com border |
| Filtros de categoria | text-only | `text-xs px-3 py-2 min-h-[40px]` |
| Botão "Carregar mais" | `px-10 py-4` | Mantém + `active:scale-[0.97]` |
| CTA buttons (CaseStudy) | `px-6 py-3.5` | Mantém + `active:scale-[0.97]` |
| Back button (blog) | link simples | `p-2 min-h-[44px]` |
| Search input | `p-3` (~48px) | Mantém |

### Feedback de pressão
```css
.pressable {
  transition: transform 160ms ease-out;
}
.pressable:active {
  transform: scale(0.97);
}
```

### Touch global
```css
html {
  touch-action: manipulation;
}
```

---

## 3. Navegação & Menu Mobile

### Navbar: altura fixa

| Viewport | Atual (varia scroll) | Proposto |
|---|---|---|
| Mobile | 72px → 64px | **64px fixa** |
| Desktop | 90px → 80px | **80px fixa** |

### Hamburger → X animado
- Barras animam para "X" (topo rotaciona +45°, meio fade out, base rotaciona -45°)
- `transition: transform 200ms ease-out, opacity 200ms ease-out`

### Lenis SmoothScroll
- `touchMultiplier` reduzido de `2` → `1.2`

---

## 4. Layout, Grid & Overflow

### Novo breakpoint
```js
// tailwind.config.ts
screens: {
  xs: "480px",  // NOVO
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}
```

### Proteção de overflow
- `body` + `main` com `overflow-x-hidden`
- Cada section container com `max-w-full overflow-x-hidden`

### Padding horizontal padronizado

| Viewport | Proposto |
|---|---|
| Default (mobile) | `px-4` (16px) |
| `xs` (480px+) | `px-6` (24px) |
| `md` (768px+) | `px-8` (32px) |
| `lg` (1024px+) | `px-12` (48px) |

### Clearance da navbar
- Páginas: `pt-[64px]` mobile, `pt-[80px]` desktop
- Blog: ajustar de `pt-20` (80px) para `pt-[72px]` mobile

---

## 5. Funcionalidades Mobile Faltantes

### BlogFilters mobile
- **Solução:** Sheet/drawer que sobe do bottom da tela
- **Gatilho:** Botão "Filtrar" ao lado da barra de busca
- **Conteúdo:** Mesmas categorias do sidebar desktop, em lista vertical com tap targets de 44px
- **Animação:** `translateY(100%)` → `translateY(0)` com `cubic-bezier(0.32, 0.72, 0, 1)` (iOS-like)

### TableOfContents mobile
- **Solução:** Accordion/dropdown no topo do artigo (abaixo do header)
- **Label:** "Neste artigo ▾" que expande a lista ao toque
- **Integração:** Reutiliza o hook `useScrollSpy` existente para highlight do item ativo
- **Animação:** `max-height` transition com stagger nos itens

---

## 6. Badges, Títulos de Projetos & Detalhes Visuais

### Badges de projeto (contagem)
- Sair de `hidden md:block` → **visíveis sempre**
- Mobile: `text-2xl` + `w-12 h-12` (era `w-16 h-16` no desktop)
- Desktop: `text-4xl` + `w-16 h-16` (mantém)

### Título do projeto (overlay na imagem)
- Mobile: `clamp(1.75rem, 8vw, 3rem)`
- Adicionar `drop-shadow` para legibilidade sobre imagem

### Tags de tecnologia
- Mobile: `text-[11px]` com `px-2.5 py-1`
- Adicionar `border border-white/10` para definição visual
- `flex-wrap gap-1.5`

### Hero mobile
- Elementos decorativos (`hidden md:block`) ganham versão mobile:
  - Coordenadas: `text-[10px]` no canto, `opacity-40`
  - Versão: badge sutil abaixo da tagline

### InfoBar mobile
- Ícones sociais: `size={18}` + wrappers 44px
- `gap-6` → `gap-4` para compactar
- Texto mínimo `text-[11px]`

### Footer mobile
- Coordenadas em formato curto (`22°56'S 43°12'W`)
- Badge BG: `w-8 h-8` (era `w-10 h-10`)

---

## 7. O Que NÃO Muda

- Paleta de cores (dark bg `#000`, gold accent, brutal-* palette)
- Fontes (Jersey 15, Satoshi, Silkscreen, JetBrains Mono, Newsreader, VT323)
- Texturas/efeitos (GrainOverlay, CustomCursor, PixelLoader, scroll animations)
- Conteúdo e estrutura de páginas
- Funcionalidades existentes

---

## 8. Verificação

### Antes do PR
1. `bun run build` — build estático sem erros
2. `bun run lint` — Biome sem violações
3. `bun run test:unit` — testes unitários passam
4. `bun run test:e2e` — testes e2e passam

### Teste manual mobile
- Testar em viewports: 320px, 375px, 414px, 480px, 768px
- Verificar: sem scroll horizontal, sem texto menor que 11px, todo botão tem 44px mínimo
- Verificar: BlogFilters drawer abre/fecha, ToC accordion expande/colapsa
- Verificar: hamburger anima para X, menu abre/fecha suavemente
