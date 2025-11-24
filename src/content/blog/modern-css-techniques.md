---
title: "Modern CSS Techniques: Além do Tailwind"
date: "21 NOV 2023"
readTime: "6 min"
tags: ["CSS", "Modern Web", "Performance", "Design Systems"]
excerpt: "Explorando técnicas CSS modernas que vão além de frameworks: CSS Grid, Container Queries, Logical Properties e mais."
---

# Modern CSS Techniques: Além do Tailwind 🎨

CSS evoluiu drasticamente nos últimos anos. Muitos desenvolvedores focam apenas em frameworks como Tailwind, mas o CSS nativo oferece recursos poderosos que podem transformar suas aplicações.

## 🚀 CSS Grid: Layout 2D Avançado

### Grid com Auto-fit e Auto-fill

```css
/* Auto-fit: ajusta o número de colunas */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Auto-fill: mantém espaços vazios */
.calendar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

/* Grid com áreas nomeadas */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### Subgrid: Alinhamento Herdado

```css
.card {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.card-header {
  display: grid;
  grid-template-columns: 1fr auto;
  grid: subgrid; /* Herda do parent */
  grid-column: 1 / -1;
}

.card-footer {
  grid: subgrid;
  grid-column: 1 / -1;
}
```

## 🎯 Container Queries: Responsive Baseado no Componente

```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
  }
}

@container (min-width: 600px) {
  .card {
    grid-template-columns: 1fr 3fr;
  }
}

.sidebar {
  container-type: inline-size;
}

.card {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

/* Container queries suportados pelo React + Tailwind */
.component-with-container {
  @apply container;
  @apply mx-auto;
}

@layer components {
  .responsive-card {
    @apply p-4 border-2 border-gray-200 rounded-lg;
  }

  @container (min-width: 32rem) {
    .responsive-card {
      @apply grid grid-cols-2 gap-4;
    }
  }
}
```

## 🌐 Logical Properties: Design Internacional

```css
/* Antes: Fixed para LTR */
.margin-left: 1rem;
.padding-right: 2rem;
.text-align: left;

/* Depois: Logical */
.margin-inline-start: 1rem;
.padding-inline-end: 2rem;
.text-align: start;
.float: inline-start;

/* Layout que funciona em RTL/LTR automaticamente */
.sidebar {
  float: inline-start;
  margin-inline-end: 2rem;
  width: 250px;
}

.main-content {
  margin-inline-start: 270px;
}

/* Dimensions lógicas */
.header {
  border-block-end: 2px solid #e5e7eb;
  padding-block: 1rem;
  margin-inline: auto;
  max-inline-size: 1200px;
}

.article {
  writing-mode: vertical-rl; /* Texto vertical */
  text-orientation: mixed;
}

.vertical-text {
  writing-mode: vertical-lr;
  text-orientation: upright;
}
```

## 🎨 Modern Color Functions

```css
/* HSL com transparência */
.button-primary {
  background: hsl(210, 100%, 50%, 0.9);
  backdrop-filter: blur(10px);
}

/* Lab color space para melhor percepção */
.accent-color {
  color: lab(50% 40 30); /* L*, a*, b* */
}

/* LCH para controle de cor intuitivo */
.brand-gradient {
  background: linear-gradient(
    to right,
    lch(50% 40 30),
    lch(70% 20 50)
  );
}

/* Color-mix para combinações dinâmicas */
.mixed-color {
  color: color-mix(in srgb, #ff0000 25%, #0000ff 75%);
  background: color-mix(in oklch, #ff0000, #0000ff);
}

/* Relative colors */
.dark-mode {
  --text-color: #333;
  --bg-color: #fff;
}

.light-mode {
  --text-color: oklch(from var(--text-color) calc(l + 0.5) c h);
  --bg-color: oklch(from var(--bg-color) calc(l - 0.9) c h);
}
```

## 📐 Modern Layout Features

### CSS Grid + Flexbox Combination

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

/* Grid com alignment avançado */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: start;
  justify-items: stretch;
}

.grid-item {
  display: grid;
  place-items: center;
  min-height: 200px;
}
```

### Sticky Positioning com Index Z

```css
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}

.sticky-sidebar {
  position: sticky;
  top: 80px; /* Abaixo do header */
  height: calc(100vh - 80px);
  overflow-y: auto;
}

/* Scroll-driven animations */
@supports (animation-timeline: scroll()) {
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transform-origin: left;
    animation: grow-progress auto linear;
    animation-timeline: scroll(root);
  }

  @keyframes grow-progress {
    to { transform: scaleX(1); }
  }

  .fade-in-on-scroll {
    animation: fadeIn auto linear;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

## 🎯 Modern Selectors

### :has() - Parent Selector

```css
/* Estiliza parent baseado no child */
.card:has(.badge) {
  border-color: #3b82f6;
}

.form:has(:invalid) {
  background: #fef2f2;
}

.nav:has(.user-menu:hover) {
  background: #1f2937;
}

/* Complex combinations */
.grid:has(.featured) .card:not(.featured) {
  opacity: 0.7;
}

.article:has(h1) {
  counter-increment: articles-with-headings;
}
```

### :is() e :where()

```css
/* :is() - Specificity alta */
.article:is(h1, h2, h3) {
  margin-top: 2rem;
  color: #1f2937;
}

/* :where() - Specificidade zero */
.article:where(h1, h2, h3) {
  font-family: system-ui;
}

/* Combinação poderosa */
.component:where(.primary, .secondary) button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
}

.form:where(.login, .register):has(input:invalid) {
  border-color: #ef4444;
}
```

## 🔧 Custom Properties Avançadas

```css
:root {
  /* Cores semânticas */
  --color-primary: #3b82f6;
  --color-primary-light: color-mix(in srgb, var(--color-primary) 80%, white);
  --color-primary-dark: color-mix(in srgb, var(--color-primary) 80%, black);

  /* Espaçamento sistemático */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Tipografia fluida */
  --fluid-min-width: 320;
  --fluid-max-width: 1140;
  --fluid-screen: 100vw;
  --fluid-bp: calc(
    (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
    (var(--fluid-max-width) - var(--fluid-min-width))
  );
}

/* Tipografia responsiva com clamp */
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  line-height: clamp(1.8rem, 6vw, 3.6rem);
}

/* Grid com custom properties */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(
    var(--columns, 3),
    minmax(var(--min-width, 250px), 1fr)
  );
  gap: var(--gap, 1rem);
}

.grid-responsive {
  --columns: 2;
  --min-width: 200px;
}

@media (min-width: 768px) {
  .grid-responsive {
    --columns: 3;
    --min-width: 250px;
  }
}
```

## 🎪 Advanced Animations

### View Transitions API

```css
/* Para SPA navigation */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-out {
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Element-specific transitions */
::view-transition-old(card-detail) {
  animation: shrink-out 0.4s ease-in-out;
}

::view-transition-new(card-detail) {
  animation: expand-in 0.4s ease-in-out;
}
```

### Spring Animations

```css
.spring-bounce {
  animation: spring 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes spring {
  0% { transform: scale(0.3) rotate(0deg); }
  50% { transform: scale(1.05) rotate(5deg); }
  70% { transform: scale(0.9) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}
```

## 📱 Progressive Enhancement

```css
/* Feature detection */
@supports (display: grid) {
  .layout {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@supports not (display: grid) {
  .layout {
    display: flex;
  }

  .sidebar {
    flex: 0 0 200px;
  }

  .main {
    flex: 1;
  }
}

/* Container queries fallback */
@supports (container-type: inline-size) {
  .responsive-card {
    container-type: inline-size;
  }
}

@supports not (container-type: inline-size) {
  .responsive-card {
    /* Media queries fallback */
  }
}
```

## 🎯 Key Takeaways

1. **CSS Grid** é superior para layouts 2D complexos
2. **Container Queries** revolucionam design responsivo
3. **Logical Properties** essenciais para internacionalização
4. **Modern Color Functions** oferecem controle preciso
5. **:has()** finalmente permite parent selectors
6. **Custom Properties** criam systems verdadeiramente dinâmicos

## 🚀 Próximos Passos

- Implementar design system com estas técnicas
- Usar View Transitions para navegação SPA
- Criar layouts responsive com Container Queries
- Adotar Logical Properties para apps internacionais

CSS moderno oferece recursos que muitos frameworks ainda não exploram completamente. Dominar essas técnicas diferencia desenvolvedores e cria experiências web superiores.

---

*Este post cobre técnicas CSS que estão disponíveis nos browsers modernos. Verifique o suporte antes de usar em produção.*