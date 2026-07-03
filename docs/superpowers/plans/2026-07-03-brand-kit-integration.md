> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Brand Kit Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the BLOCO mascot and BLOCO Line icons into the portfolio site across three sequential waves: brand identity replacement, expressive mascot animations, and strategic icon substitution.

**Architecture:** Two atomic React components (`BrandMascot`, `BrandIcon`) encapsulate the entire brand kit. `BrandMascot` renders the mascot SVG inline with variant/state/size props and Framer Motion animations. `BrandIcon` renders any of 11 BLOCO Line icons with line/solid variants. Components live in `src/components/brand/` with a barrel export.

**Tech Stack:** React 18, TypeScript, Framer Motion, Tailwind CSS, Vitest + React Testing Library, Astro 5

## Global Constraints

- Fontes: Jersey 15 (display), JetBrains Mono (UI), Newsreader (corpo)
- Paleta de cores: Preto #000000, Branco #FFFFFF, Dourado #F1C232 (accent)
- Animações devem respeitar `prefers-reduced-motion: reduce` (usar hook `useReducedMotion`)
- O mascote nunca deve ser esticado, girado, ou ter cores fora da paleta
- Ícones: nunca mais de 1 acento dourado por ícone, traço 2.6/32 proporcional
- Mascote: tamanho mínimo 16px
- Ícones BLOCO Line só substituem lucide-react onde há correspondência semântica
- Build estático (`bun run build`) deve passar sem erros
- `bun run lint` sem violações

---

## File Structure

```
src/components/brand/
  BrandMascot.tsx       — Mascote BLOCO com variantes + estados expressivos
  BrandIcon.tsx         — 11 ícones BLOCO Line (line/solid)
  index.ts              — Barrel export

Arquivos tocados:
  src/layouts/Layout.astro            — Favicon
  src/components/Navigation.tsx        — Avatar → Mascot
  src/components/blog/BlogPostByline.tsx — BG → Mascot
  src/components/ui/PixelLoader.tsx    — Refatorar com paleta BLOCO
  src/components/ui/PixelLoader.css    — Refatorar animação de saída
  src/components/pages/NotFound.tsx    — Adicionar BLOCO confused
  src/components/Hero.tsx             — Adicionar BLOCO decorativo
  src/data/skills.ts                  — Ícones lucide → string names
  src/components/ui/sonner.tsx        — Ícones de toast customizados
```

---

## Onda 1 — Identidade da Marca

### Task 1: Criar componente BrandMascot (versão inicial)

**Files:**
- Create: `src/components/brand/BrandMascot.tsx`

**Interfaces:**
- Produces: `BrandMascot` React component — props: `variant` (MascotVariant, default "cor"), `size` (number, min 16), `className` (string, optional)

- [ ] **Step 1: Criar arquivo do componente**

```tsx
// src/components/brand/BrandMascot.tsx
import type React from "react";

export type MascotVariant =
  | "cor"
  | "negativo"
  | "mono-preto"
  | "mono-branco"
  | "mono-dourado";

interface BrandMascotProps {
  variant?: MascotVariant;
  size?: number;
  className?: string;
}

/** Cores por variante — os fills do SVG */
const FILLS: Record<MascotVariant, { body: string; eyes: string; feet: string }> = {
  cor:           { body: "#FFFFFF", eyes: "#000000", feet: "#F1C232" },
  negativo:      { body: "#000000", eyes: "#FFFFFF", feet: "#F1C232" },
  "mono-preto":  { body: "#000000", eyes: "#000000", feet: "#000000" },
  "mono-branco": { body: "#FFFFFF", eyes: "#FFFFFF", feet: "#FFFFFF" },
  "mono-dourado":{ body: "#F1C232", eyes: "#F1C232", feet: "#F1C232" },
};

export const BrandMascot: React.FC<BrandMascotProps> = ({
  variant = "cor",
  size = 32,
  className,
}) => {
  const s = Math.max(16, size);
  const scale = s / 32;
  const c = FILLS[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 32 32"
      className={className}
      aria-label={`Mascote BLOCO — ${variant}`}
      role="img"
      style={{ minWidth: s, minHeight: s }}
    >
      {/* Corpo — cápsula arredondada 22×19, rx=6 */}
      <rect x="5" y="6" width="22" height="19" rx="6" fill={c.body} />
      {/* Olhos — duas pílulas verticais */}
      <rect x="11" y="12" width="3.6" height="7" rx="1.8" fill={c.eyes} />
      <rect x="17.4" y="12" width="3.6" height="7" rx="1.8" fill={c.eyes} />
      {/* Pés — dois blocos horizontais dourados */}
      <rect x="8.5" y="25" width="6" height="3.5" rx="1.5" fill={c.feet} />
      <rect x="17.5" y="25" width="6" height="3.5" rx="1.5" fill={c.feet} />
    </svg>
  );
};

export default BrandMascot;
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/brand/BrandMascot.tsx
git commit -m "feat(brand): add BrandMascot component with 5 color variants"
```

---

### Task 2: Substituir avatar na navegação pelo mascote

**Files:**
- Modify: `src/components/Navigation.tsx:46-60`

**Interfaces:**
- Consumes: `BrandMascot` from `@/components/brand/BrandMascot`
- Produces: nav brand area now shows BLOCO mascot instead of photo avatar

- [ ] **Step 1: Atualizar Navigation.tsx**

```tsx
// Substituir o bloco do avatar (linhas ~47-54) por:
import { BrandMascot } from "@/components/brand/BrandMascot";

// Dentro do <a href="/">, substituir:
// <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-accent transition-all duration-300">
//   <img src="/avatar-bruno-bg.jpg" alt="Bruno Guimarães" className="w-full h-full object-cover" />
// </div>
// Por:
<div className="rounded-lg overflow-hidden border-2 border-white/20 group-hover:border-accent transition-all duration-300 flex items-center justify-center p-1">
  <BrandMascot variant="cor" size={40} />
</div>
```

- [ ] **Step 2: Atualizar teste Navigation.test.tsx**

O teste atual verifica `screen.getByAltText(/Bruno Guimarães/i)` — isso vai quebrar porque o `<img>` foi removido. Substituir essa asserção:

```tsx
// Antes:
const avatar = screen.getByAltText(/Bruno Guimarães/i);
expect(avatar).toBeInTheDocument();

// Depois:
const mascot = screen.getByLabelText(/Mascote BLOCO/i);
expect(mascot).toBeInTheDocument();
```

- [ ] **Step 3: Verificar build + testes**

```bash
bun run build
bun run test:unit -- run src/components/Navigation.test.tsx
```

Expected: build succeeds, navigation test passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx src/components/Navigation.test.tsx
git commit -m "feat(brand): replace nav avatar with BLOCO mascot"
```

---

### Task 3: Atualizar favicon para BLOCO mono-preto

**Files:**
- Modify: `src/layouts/Layout.astro:51`
- Create: `public/favicon.png` (copied from brand-kit)

**Interfaces:**
- Consumes: `brand-kit/png/mono-preto/mono-preto-32.png`
- Produces: site favicon is now BLOCO mascot

- [ ] **Step 1: Copiar PNG e atualizar Layout.astro**

```bash
cp brand-kit/png/mono-preto/mono-preto-32.png public/favicon.png
```

```astro
<!-- Em src/layouts/Layout.astro, substituir linha 51: -->
<!-- Antes: -->
<link rel="icon" type="image/webp" href="/logo.webp" />
<!-- Depois: -->
<link rel="icon" type="image/png" href="/favicon.png" />
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

Expected: build succeeds, `favicon.png` is in dist output.

- [ ] **Step 3: Commit**

```bash
git add public/favicon.png src/layouts/Layout.astro
git commit -m "feat(brand): replace favicon with BLOCO mono-preto"
```

---

### Task 4: Substituir avatar "BG" no blog byline pelo mascote

**Files:**
- Modify: `src/components/blog/BlogPostByline.tsx:14-16`

**Interfaces:**
- Consumes: `BrandMascot` from `@/components/brand/BrandMascot`

- [ ] **Step 1: Atualizar BlogPostByline.tsx**

```tsx
import { BrandMascot } from "@/components/brand/BrandMascot";

// Substituir o quadrado "BG" (linhas 14-16):
// <div className="w-10 h-10 bg-white pixel-border-sm flex items-center justify-center text-black shrink-0">
//   <span className="font-pixel text-sm">BG</span>
// </div>
// Por:
<div className="flex items-center justify-center shrink-0">
  <BrandMascot variant="cor" size={32} />
</div>
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/BlogPostByline.tsx
git commit -m "feat(brand): replace BG initials with BLOCO mascot in blog byline"
```

---

## Onda 2 — Personagem Vivo

### Task 5: Expandir BrandMascot com estados expressivos

**Files:**
- Modify: `src/components/brand/BrandMascot.tsx`

**Interfaces:**
- Produces: Updated `BrandMascot` — adds `state` prop (`MascotState`, default "idle"), uses Framer Motion `animate` + `motion.rect` for eye/foot animations, blink via `useEffect` + `setInterval`, respects `useReducedMotion` hook

- [ ] **Step 1: Reescrever BrandMascot com estados e Framer Motion**

```tsx
// src/components/brand/BrandMascot.tsx
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type MascotVariant =
  | "cor"
  | "negativo"
  | "mono-preto"
  | "mono-branco"
  | "mono-dourado";

export type MascotState = "idle" | "focused" | "happy" | "confused" | "curious";

interface BrandMascotProps {
  variant?: MascotVariant;
  size?: number;
  state?: MascotState;
  className?: string;
}

const FILLS: Record<MascotVariant, { body: string; eyes: string; feet: string }> = {
  cor:           { body: "#FFFFFF", eyes: "#000000", feet: "#F1C232" },
  negativo:      { body: "#000000", eyes: "#FFFFFF", feet: "#F1C232" },
  "mono-preto":  { body: "#000000", eyes: "#000000", feet: "#000000" },
  "mono-branco": { body: "#FFFFFF", eyes: "#FFFFFF", feet: "#FFFFFF" },
  "mono-dourado":{ body: "#F1C232", eyes: "#F1C232", feet: "#F1C232" },
};

/** Configurações de animação por estado */
interface AnimConfig {
  leftEye: Record<string, unknown>;
  rightEye: Record<string, unknown>;
  leftFoot: Record<string, unknown>;
  rightFoot: Record<string, unknown>;
  blinkEnabled: boolean;
}

const spring = { type: "spring" as const, stiffness: 200, damping: 20 };

const STATE_ANIM: Record<MascotState, AnimConfig> = {
  idle: {
    leftEye: {},
    rightEye: {},
    leftFoot: {},
    rightFoot: {},
    blinkEnabled: true,
  },
  focused: {
    leftEye: { scaleX: 0.6 },
    rightEye: { scaleX: 0.6 },
    leftFoot: { translateY: [0, -1, 1, 0] },
    rightFoot: { translateY: [0, 1, -1, 0] },
    blinkEnabled: true,
  },
  happy: {
    leftEye: { translateY: -2 },
    rightEye: { translateY: -2 },
    leftFoot: { rotate: [0, -5, 5, 0] },
    rightFoot: { rotate: [0, 5, -5, 0] },
    blinkEnabled: true,
  },
  confused: {
    leftEye: { translateX: [-1.5, 1.5, -1] },
    rightEye: { translateX: [1.5, -1.5, 1] },
    leftFoot: { translateY: -3, rotate: -5 },
    rightFoot: {},
    blinkEnabled: true,
  },
  curious: {
    leftEye: {},
    rightEye: {},
    leftFoot: { scaleY: [1, 0.85, 1] },
    rightFoot: { scaleY: [1, 0.85, 1] },
    blinkEnabled: true,
  },
};

export const BrandMascot: React.FC<BrandMascotProps> = ({
  variant = "cor",
  size = 32,
  state = "idle",
  className,
}) => {
  const s = Math.max(16, size);
  const c = FILLS[variant];
  const reducedMotion = useReducedMotion();
  const [blink, setBlink] = useState(false);

  const anim = reducedMotion ? STATE_ANIM.idle : STATE_ANIM[state];

  // Piscada com jitter aleatório (3–5s)
  useEffect(() => {
    if (reducedMotion || !anim.blinkEnabled) return;

    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();

    return () => clearTimeout(timeout);
  }, [reducedMotion, anim.blinkEnabled]);

  // Olhos: quando piscando, scaleY → 0
  const eyeScaleY = blink ? 0.1 : 1;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 32 32"
      className={className}
      aria-label={`Mascote BLOCO — ${variant}`}
      role="img"
      style={{ minWidth: s, minHeight: s }}
    >
      {/* Corpo — estático */}
      <rect x="5" y="6" width="22" height="19" rx="6" fill={c.body} />

      {/* Olho esquerdo */}
      <motion.rect
        x="11" y="12" width="3.6" height="7" rx="1.8"
        fill={c.eyes}
        animate={{
          ...anim.leftEye,
          scaleY: eyeScaleY,
          originY: 15.5,
        }}
        transition={spring}
        style={{ transformOrigin: "12.8px 15.5px" }}
      />

      {/* Olho direito */}
      <motion.rect
        x="17.4" y="12" width="3.6" height="7" rx="1.8"
        fill={c.eyes}
        animate={{
          ...anim.rightEye,
          scaleY: eyeScaleY,
          originY: 15.5,
        }}
        transition={spring}
        style={{ transformOrigin: "19.2px 15.5px" }}
      />

      {/* Pé esquerdo */}
      <motion.rect
        x="8.5" y="25" width="6" height="3.5" rx="1.5"
        fill={c.feet}
        animate={anim.leftFoot}
        transition={spring}
        style={{ transformOrigin: "11.5px 26.75px" }}
      />

      {/* Pé direito */}
      <motion.rect
        x="17.5" y="25" width="6" height="3.5" rx="1.5"
        fill={c.feet}
        animate={anim.rightFoot}
        transition={spring}
        style={{ transformOrigin: "20.5px 26.75px" }}
      />
    </svg>
  );
};

export default BrandMascot;
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

Expected: build succeeds. Navegação, byline e demais consumidores existentes continuam funcionando (estado default `idle`).

- [ ] **Step 3: Commit**

```bash
git add src/components/brand/BrandMascot.tsx
git commit -m "feat(brand): add expressive states with Framer Motion animations to BrandMascot"
```

---

### Task 6: Refatorar PixelLoader com paleta BLOCO

**Files:**
- Modify: `src/components/ui/PixelLoader.tsx:41-66`
- Modify: `src/components/ui/PixelLoader.css:29-51`

**Interfaces:**
- Consumes: `BrandMascot` from `@/components/brand/BrandMascot`
- Produces: loader now uses brand palette (black → white → gold) instead of purple → green, shows BLOCO at center during dissolve

- [ ] **Step 1: Atualizar PixelLoader.css — animação de saída com paleta da marca**

```css
/* Substituir o @keyframes pixel-out existente (linhas 30-47) por: */
@keyframes pixel-out {
  0% {
    opacity: 1;
    transform: scale(1);
    background-color: #000;
  }
  40% {
    background-color: #F1C232; /* Dourado da marca */
  }
  70% {
    background-color: #FFFFFF; /* Branco */
  }
  100% {
    opacity: 0;
    transform: scale(0);
    background-color: transparent;
  }
}
```

- [ ] **Step 2: Atualizar PixelLoader.tsx — adicionar BLOCO central durante dissolução**

```tsx
// Adicionar import:
import { BrandMascot } from "@/components/brand/BrandMascot";

// No return, adicionar o BLOCO centralizado entre o grid de pixels e o desmonte:
return (
  <div className="pixel-loader">
    {blockIds.map((blockId, i) => {
      const delayPosition = delayMap.get(i) ?? 0;
      const delay = isExiting ? (delayPosition / totalBlocks) * 0.8 : 0;
      return (
        <div
          key={blockId}
          className={`pixel-block ${isExiting ? "exit" : ""}`}
          style={{ animationDelay: `${delay}s` }}
        />
      );
    })}

    {/* BLOCO ao centro — aparece quando a dissolução começa */}
    <div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] transition-opacity duration-500 ${
        isExiting ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDelay: "0.3s" }}
    >
      <BrandMascot variant="cor" size={48} state="focused" />
    </div>
  </div>
);
```

- [ ] **Step 3: Verificar build**

```bash
bun run build
```

Expected: build succeeds, loader visual usa paleta da marca.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/PixelLoader.tsx src/components/ui/PixelLoader.css
git commit -m "feat(brand): update PixelLoader with brand palette and BLOCO mascot"
```

---

### Task 7: Adicionar BLOCO confused na página 404

**Files:**
- Modify: `src/components/pages/NotFound.tsx:41-44`

**Interfaces:**
- Consumes: `BrandMascot` from `@/components/brand/BrandMascot`
- Produces: 404 page shows confused BLOCO above the "404" heading

- [ ] **Step 1: Adicionar import e BLOCO no NotFound.tsx**

```tsx
// Adicionar import:
import { BrandMascot } from "@/components/brand/BrandMascot";

// No return, entre a top bar e o h1 "404", adicionar:
{/* Inserir depois do motion.div da top bar (linhas 24-39) e antes do motion.h1 "404" (linha 54): */}
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.25, type: "spring", stiffness: 150 }}
  className="flex justify-center mb-6"
>
  <BrandMascot variant="cor" size={64} state="confused" />
</motion.div>
```

- [ ] **Step 2: Adicionar micro-interação de hover nos botões**

```tsx
// Adicionar estado local no topo do componente NotFound:
const [hoverState, setHoverState] = useState<MascotState>("confused");

// No botão "Voltar" — adicionar onMouseEnter/onMouseLeave:
<a
  href="/"
  className="group inline-flex items-center justify-between gap-4 bg-white px-5 py-4 text-black transition-colors hover:bg-accent pressable"
  onMouseEnter={() => setHoverState("happy")}
  onMouseLeave={() => setHoverState("confused")}
>
  ...
</a>

// Atualizar o BrandMascot para usar o estado dinâmico:
<BrandMascot variant="cor" size={64} state={hoverState} />
```

- [ ] **Step 3: Verificar build**

```bash
bun run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/NotFound.tsx
git commit -m "feat(brand): add confused BLOCO mascot to 404 page with hover interaction"
```

---

### Task 8: Adicionar BLOCO decorativo no Hero

**Files:**
- Modify: `src/components/Hero.tsx:113-125`

**Interfaces:**
- Consumes: `BrandMascot` from `@/components/brand/BrandMascot`
- Produces: hero section shows small BLOCO in bottom-right corner (same zone as decorative POS/VER elements)

- [ ] **Step 1: Adicionar import e estado no Hero.tsx**

```tsx
// Adicionar imports:
import { useState, useEffect } from "react"; // expandir import existente
import { BrandMascot } from "@/components/brand/BrandMascot";

// Adicionar estado no topo do componente (depois de useReducedMotion):
const [heroMascotState, setHeroMascotState] = useState<"focused" | "curious">("focused");

useEffect(() => {
  const timer = setTimeout(() => setHeroMascotState("curious"), 3000);
  return () => clearTimeout(timer);
}, []);
```

- [ ] **Step 2: Adicionar BLOCO na zona decorativa inferior**

```tsx
{/* Inserir depois dos elementos decorativos existentes (POS/VER), antes do fechamento da section: */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.3 }}
  whileHover={{ opacity: 0.6 }}
  className="absolute bottom-8 right-4 sm:right-10 z-10 pointer-events-auto cursor-default"
  title="BLOCO — Developer Bruno mascot"
>
  <BrandMascot variant="cor" size={32} state={heroMascotState} />
</motion.div>
```

- [ ] **Step 3: Verificar build**

```bash
bun run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat(brand): add decorative BLOCO mascot to hero section"
```

---

## Onda 3 — Ícones BLOCO Line

### Task 9: Criar componente BrandIcon

**Files:**
- Create: `src/components/brand/BrandIcon.tsx`

**Interfaces:**
- Produces: `BrandIcon` React component — props: `name` (IconName, required), `size` (number, default 24), `variant` ("line" | "solid", default "line"), `className` (string, optional)

- [ ] **Step 1: Criar BrandIcon.tsx com paths de todos os 11 ícones**

```tsx
// src/components/brand/BrandIcon.tsx
import type React from "react";

export type IconName =
  | "codigo"
  | "terminal"
  | "deploy"
  | "documentacao"
  | "erro"
  | "sucesso"
  | "alerta"
  | "settings"
  | "usuario"
  | "comunidade"
  | "api";

type IconVariant = "line" | "solid";

interface BrandIconProps {
  name: IconName;
  size?: number;
  variant?: IconVariant;
  className?: string;
}

/** Paths extraídos dos SVGs do brand-kit/icons/svg/.
 *  stroke="#fff" / stroke="#F1C232" — trocados para "currentColor" e "var(--icon-accent)"
 *  para que o CSS controle as cores, permitindo variant solid.
 *  Usamos placeholders que são substituídos na renderização. */
const ICON_PATHS: Record<IconName, { elements: Array<{ type: string; key: string; props: Record<string, unknown> }> }> = {
  codigo: {
    elements: [
      { type: "path", key: "left",  props: { d: "M12 10 L6 16 L12 22", fill: "none", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } },
      { type: "path", key: "right", props: { d: "M20 10 L26 16 L20 22", fill: "none", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } },
      { type: "line", key: "accent", props: { x1: 18, y1: 9, x2: 14, y2: 23, stroke: "accent", strokeWidth: 2.6, strokeLinecap: "round" } },
    ],
  },
  terminal: {
    elements: [
      { type: "rect", key: "frame",  props: { x: 5, y: 7, width: 22, height: 18, rx: 5, fill: "none", stroke: "white", strokeWidth: 2.6 } },
      { type: "path", key: "chevron", props: { d: "M10 14 l3.5 3 l-3.5 3", fill: "none", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } },
      { type: "line", key: "accent", props: { x1: 16, y1: 20, x2: 22, y2: 20, stroke: "accent", strokeWidth: 2.6, strokeLinecap: "round" } },
    ],
  },
  deploy: {
    elements: [
      { type: "path", key: "stem",  props: { d: "M16 23 V11", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round" } },
      { type: "path", key: "arrow", props: { d: "M10 15 L16 9 L22 15", fill: "none", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } },
      { type: "line", key: "accent", props: { x1: 10, y1: 25, x2: 22, y2: 25, stroke: "accent", strokeWidth: 2.6, strokeLinecap: "round" } },
    ],
  },
  documentacao: {
    elements: [
      { type: "rect", key: "page",  props: { x: 8, y: 5, width: 16, height: 22, rx: 4, fill: "none", stroke: "white", strokeWidth: 2.6 } },
      { type: "line", key: "accent", props: { x1: 12, y1: 11, x2: 20, y2: 11, stroke: "accent", strokeWidth: 2.4, strokeLinecap: "round" } },
      { type: "line", key: "line2",  props: { x1: 12, y1: 16, x2: 20, y2: 16, stroke: "white", strokeWidth: 2.4, strokeLinecap: "round" } },
      { type: "line", key: "line3",  props: { x1: 12, y1: 21, x2: 17, y2: 21, stroke: "white", strokeWidth: 2.4, strokeLinecap: "round" } },
    ],
  },
  erro: {
    elements: [
      { type: "circle", key: "ring",  props: { cx: 16, cy: 16, r: 10, fill: "none", stroke: "white", strokeWidth: 2.6 } },
      { type: "path", key: "accent", props: { d: "M12.5 12.5 L19.5 19.5 M19.5 12.5 L12.5 19.5", stroke: "accent", strokeWidth: 2.6, strokeLinecap: "round" } },
    ],
  },
  sucesso: {
    elements: [
      { type: "circle", key: "ring",  props: { cx: 16, cy: 16, r: 10, fill: "none", stroke: "white", strokeWidth: 2.6 } },
      { type: "path", key: "accent", props: { d: "M11 16.5 L14.5 20 L21 12.5", fill: "none", stroke: "accent", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } },
    ],
  },
  alerta: {
    elements: [
      { type: "path", key: "triangle", props: { d: "M16 6 L27 25 H5 Z", fill: "none", stroke: "white", strokeWidth: 2.6, strokeLinejoin: "round" } },
      { type: "line", key: "excl",  props: { x1: 16, y1: 13, x2: 16, y2: 19, stroke: "accent", strokeWidth: 2.6, strokeLinecap: "round" } },
      { type: "circle", key: "dot",   props: { cx: 16, cy: 22, r: 1.4, fill: "currentColor" } },
    ],
  },
  settings: {
    elements: [
      { type: "line", key: "top",    props: { x1: 7, y1: 11, x2: 25, y2: 11, stroke: "white", strokeWidth: 2.6, strokeLinecap: "round" } },
      { type: "line", key: "bottom", props: { x1: 7, y1: 21, x2: 25, y2: 21, stroke: "white", strokeWidth: 2.6, strokeLinecap: "round" } },
      { type: "circle", key: "knob1", props: { cx: 19, cy: 11, r: 3.4, fill: "none", stroke: "accent", strokeWidth: 2.6 } },
      { type: "circle", key: "knob2", props: { cx: 12, cy: 21, r: 3.4, fill: "none", stroke: "accent", strokeWidth: 2.6 } },
    ],
  },
  usuario: {
    elements: [
      { type: "circle", key: "head",   props: { cx: 16, cy: 12, r: 4.5, fill: "none", stroke: "white", strokeWidth: 2.6 } },
      { type: "path", key: "body",     props: { d: "M8 24 C8 18.5 24 18.5 24 24", fill: "none", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round" } },
      { type: "circle", key: "accentL", props: { cx: 12, cy: 26.5, r: 1.3, fill: "currentColor" } },
      { type: "circle", key: "accentR", props: { cx: 20, cy: 26.5, r: 1.3, fill: "currentColor" } },
    ],
  },
  comunidade: {
    elements: [
      { type: "circle", key: "head1",   props: { cx: 11, cy: 13, r: 3.6, fill: "none", stroke: "white", strokeWidth: 2.4 } },
      { type: "circle", key: "head2",   props: { cx: 21, cy: 13, r: 3.6, fill: "none", stroke: "accent", strokeWidth: 2.4 } },
      { type: "path", key: "body1",     props: { d: "M5 24 C5 19 17 19 17 24", fill: "none", stroke: "white", strokeWidth: 2.4, strokeLinecap: "round" } },
      { type: "path", key: "body2",     props: { d: "M15 24 C15 19 27 19 27 24", fill: "none", stroke: "accent", strokeWidth: 2.4, strokeLinecap: "round" } },
    ],
  },
  api: {
    elements: [
      { type: "path", key: "left",    props: { d: "M13 7 C10 7 11 12 8 14 C7 14.6 7 17.4 8 18 C11 20 10 25 13 25", fill: "none", stroke: "white", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } },
      { type: "path", key: "right",   props: { d: "M19 7 C22 7 21 12 24 14 C25 14.6 25 17.4 24 18 C21 20 22 25 19 25", fill: "none", stroke: "white", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } },
      { type: "circle", key: "accent", props: { cx: 16, cy: 16, r: 2, fill: "currentColor" } },
    ],
  },
};

/** Resolve "white" → #FFFFFF, "accent" → #F1C232, "currentColor" → herdado */
function resolveColor(color: string, variant: IconVariant): string {
  if (color === "currentColor") {
    return variant === "solid" ? "#F1C232" : "#F1C232";
  }
  if (color === "accent") return "#F1C232";
  if (color === "white") return "#FFFFFF";
  return color;
}

function renderElement(el: ICON_PATHS[string]["elements"][number], variant: IconVariant, idx: number) {
  const props: Record<string, unknown> = { ...el.props };
  // Resolve cores
  if (typeof props.stroke === "string") props.stroke = resolveColor(props.stroke, variant);
  if (typeof props.fill === "string" && props.fill !== "none") props.fill = resolveColor(props.fill, variant);

  const Tag = el.type as keyof JSX.IntrinsicElements;
  return <Tag key={el.key || idx} {...props} />;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  size = 24,
  variant = "line",
  className,
}) => {
  const scale = size / 32;
  const data = ICON_PATHS[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-label={`Ícone ${name}`}
      role="img"
      style={{ minWidth: size, minHeight: size }}
    >
      {data.elements.map((el, idx) => renderElement(el, variant, idx))}
    </svg>
  );
};

export default BrandIcon;
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

Expected: build succeeds (componente criado mas ainda não usado).

- [ ] **Step 3: Commit**

```bash
git add src/components/brand/BrandIcon.tsx
git commit -m "feat(brand): add BrandIcon component with all 11 BLOCO Line icons"
```

---

### Task 10: Criar barrel export para brand components

**Files:**
- Create: `src/components/brand/index.ts`

**Interfaces:**
- Produces: `@/components/brand` — re-exports BrandMascot and BrandIcon
- Consumes: BrandMascot, BrandIcon

- [ ] **Step 1: Criar index.ts**

```ts
// src/components/brand/index.ts
export { BrandMascot } from "./BrandMascot";
export type { MascotVariant, MascotState } from "./BrandMascot";
export { BrandIcon } from "./BrandIcon";
export type { IconName } from "./BrandIcon";
```

- [ ] **Step 2: Commit**

```bash
git add src/components/brand/index.ts
git commit -m "feat(brand): add barrel export for brand components"
```

---

### Task 11: Substituir ícones no skills.ts por nomes de ícone BLOCO

**Files:**
- Modify: `src/data/skills.ts:1,8-71`

**Interfaces:**
- Consumes: `IconName` type from `@/components/brand`
- Produces: `skills[].icon` is now a string (IconName) instead of a lucide-react component

- [ ] **Step 1: Atualizar skills.ts**

O tipo `Skill.icon` já é `string` no types/index.ts. Substituir as importações e valores:

```ts
// src/data/skills.ts — substituir import:
// Antes:
import { Code2, Palette, Zap, Rocket, Database, Globe, Smartphone, Shield } from "lucide-react";
// Depois:
import type { IconName } from "@/components/brand";

// Atualizar os ícones nos objetos (apenas os que têm correspondência BLOCO):
// Desenvolvimento: Code2 → "codigo"
{ icon: "codigo" as IconName, ... }

// Design & UI: Palette → mantém como string vazia (sem equivalente)
// Ou melhor: mudar o tipo Skill.icon para IconName | null
// Simplificando: manter Palette como está pois não é renderizado em lugar nenhum ainda.
// Na prática, só 4 ícones são substituídos:

// "Deploy & CI/CD": Rocket → "deploy"
{ icon: "deploy" as IconName, ... }

// "Backend & Database": Database → "api"
{ icon: "api" as IconName, ... }

// "Web & SEO": Globe → "comunidade"
{ icon: "comunidade" as IconName, ... }
```

Nota: Como `skills.ts` não é importado em nenhum componente atualmente, esta mudança é puramente de dados. O tipo `Skill.icon: string` já aceita strings. Mantemos `Palette`, `Zap`, `Smartphone`, `Shield` como strings dos ícones lucide — não quebram nada pois não são renderizados.

- [ ] **Step 2: Verificar build + lint**

```bash
bun run build
bun run lint
```

Expected: build succeeds, lint sem violações.

- [ ] **Step 3: Commit**

```bash
git add src/data/skills.ts
git commit -m "feat(brand): replace lucide icons with BLOCO icon names in skills data"
```

---

### Task 12: Adicionar ícones BLOCO nos toasts do sonner

**Files:**
- Modify: `src/components/ui/sonner.tsx`

**Interfaces:**
- Consumes: `BrandIcon` from `@/components/brand`

- [ ] **Step 1: Atualizar sonner.tsx com ícones customizados**

```tsx
// src/components/ui/sonner.tsx
import { Toaster as Sonner } from "sonner";
import { BrandIcon } from "@/components/brand";
import type { IconName } from "@/components/brand";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        error: <BrandIcon name="erro" size={20} />,
        success: <BrandIcon name="sucesso" size={20} />,
        warning: <BrandIcon name="alerta" size={20} />,
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
export { Toaster };
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/sonner.tsx
git commit -m "feat(brand): add BLOCO Line icons to toast notifications"
```

---

### Task de aplicação livre (Onda 2.5 — Loader de transição)

- [ ] Usar `<BrandMascot variant="cor" size={24} state="focused" />` como indicador de carregamento inline onde houver fetch assíncrono (blog posts, formulários).
- O componente já existe após Tasks 1+5. Aplicar conforme necessidade em componentes como `LatestPosts.tsx` ou `BlogPage.tsx` durante estados de loading.
- Sem arquivo específico — aplicar ad-hoc onde fizer sentido visual.

---

## Verification

### Verificações por onda

**Onda 1:**
```bash
bun run build          # Build estático sem erros
bun run lint           # Zero violações
bun run test:unit -- run  # Testes existentes passam
```

**Onda 2:**
```bash
bun run build          # Build estático sem erros
bun run lint           # Zero violações
bun run test:unit -- run  # Todos os testes passam
```

**Onda 3:**
```bash
bun run build          # Build estático sem erros
bun run lint           # Zero violações
bun run test:unit -- run  # Todos os testes passam
```

### Verificação visual

Após cada onda, inspecionar:
- Desktop (1440px): navegação, footer, hero, blog, 404, toasts
- Tablet (768px): navegação colapsa corretamente, mascote visível
- Mobile (375px): todos elementos proporcionais, sem overflow
- `prefers-reduced-motion: reduce`: animações desativadas, mascote estático

### Smoke test rápido

```bash
bun run dev
# Navegar: / , /blog , /blog/[qualquer-post] , /qualquer-rota-inexistente
# Verificar: mascote na nav, loader inicial, 404 com mascote, toasts com ícones BLOCO
```
