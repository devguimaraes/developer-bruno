> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Brand Kit Integration — Design Spec

**Data:** 2026-07-03
**Status:** Design aprovado
**Escopo:** Integração completa do brand kit (mascote BLOCO + ícones BLOCO Line) ao portfólio Developer Bruno

---

## Contexto

O projeto recebeu um brand kit completo (`brand-kit/`) contendo:
- **Mascote BLOCO** — figura geométrica (corpo cápsula, olhos em pílula, pés dourados) em 5 variantes (cor, negativo, mono-preto, mono-branco, mono-dourado)
- **11 ícones BLOCO Line** — ícones de linha com traço branco + acento dourado #F1C232 (código, terminal, deploy, documentação, erro, sucesso, alerta, settings, usuário, comunidade, API)
- **Paleta:** Preto #000000, Branco #FFFFFF, Dourado #F1C232

O projeto já compartilha as mesmas fontes (Jersey 15, JetBrains Mono), paleta de cores (dourado como `--accent`) e estética neo-brutalista. O brand kit foi desenhado para este site — a integração preenche a lacuna de personalidade visual que hoje é suprida por uma foto de avatar e ícones genéricos do lucide-react.

**Objetivo:** Integrar mascote e ícones com animações de nível 2 (estados expressivos), mantendo ou elevando o nível de UI/UX atual, com foco em "efeito UAU".

---

## Arquitetura

### Abordagem: Componentes Atômicos de Marca

Dois componentes encapsulam todo o brand kit:

```
src/components/brand/
  BrandMascot.tsx    — Todas as variantes + estados expressivos
  BrandIcon.tsx      — 11 ícones BLOCO Line com variante line/solid
  index.ts           — Re-exports para imports limpos
```

**Por que atômico e não composto:** O mascote tem anatomia fixa (proporções nunca se alteram) e comportamentos bem definidos por estado. Um componente único com props evita dispersão de lógica de renderização entre contextos. Se no futuro um estado exigir complexidade que não caiba num componente, extrai-se uma primitiva — YAGNI.

### API dos componentes

```ts
// BrandMascot
type MascotVariant = "cor" | "negativo" | "mono-preto" | "mono-branco" | "mono-dourado";
type MascotState = "idle" | "focused" | "happy" | "confused" | "curious";

<BrandMascot
  variant="cor"        // default: "cor"
  size={32}            // px, mínimo 16
  state="idle"         // default: "idle" (sem animação)
  className?           // classes Tailwind adicionais
/>

// BrandIcon
type IconName = "codigo" | "terminal" | "deploy" | "documentacao"
             | "erro" | "sucesso" | "alerta" | "settings"
             | "usuario" | "comunidade" | "api";
type IconVariant = "line" | "solid";

<BrandIcon
  name="terminal"
  size={24}            // px, escala proporcional à grade 32×32
  variant="line"       // default: "line"
  className?
/>
```

### Estados expressivos do mascote

| Estado | Olhos | Pés | Uso |
|---|---|---|---|
| `idle` | Piscada lenta (~4s intervalo) | Imóveis | Nav, footer, byline |
| `focused` | Estreitam (scaleX 0.6) | Tremulação sutil (translateY ±1px) | Loader, hero inicial |
| `happy` | Sobem (translateY -2px) | Balançam alternados (rotate ±5°) | Sucesso, hover em CTA |
| `confused` | Movimento lateral (translateX ±2px) | Um pé levanta (translateY -3px rotate) | 404, erro |
| `curious` | Seguem mouse (limitado a ±3px) | Batem de leve (scaleY alternado) | Hero pós-load, blog |

**Reduced motion:** Quando `prefers-reduced-motion: reduce` está ativo, todos os estados renderizam como `idle` estático.

**Animação:** Framer Motion (`animate` prop com spring physics). Piscada via `useEffect` + `setInterval` com CSS transition para performance.

---

## Onda 1 — Identidade da Marca

Substituição dos pontos de identidade visual existentes pelo mascote BLOCO.

### 1.1 BrandMascot (versão inicial)

- Renderiza SVG inline a partir de primitivas React (rect + rect + rect)
- Props: `variant`, `size`, `className`
- Sem prop `state` ainda — sempre renderiza estático
- Testes unitários: renderiza cada variante com cores corretas, aplica tamanho, aplica className, respeita mínimo de 16px

### 1.2 Navegação

**Arquivo:** `src/components/Navigation.tsx`

- Substituir `<img src="/avatar-bruno-bg.jpg">` por `<BrandMascot variant="cor" size={48} />`
- Wrapper: trocar `rounded-full` por `rounded-lg` (consistente com rx=6 do mascote)
- Manter hover de borda `white/20` → `accent`
- Texto "BRUNO / GUIMARÃES" permanece

### 1.3 Favicon

**Arquivo:** `src/layouts/Layout.astro`

- Trocar `<link rel="icon" type="image/webp" href="/logo.webp">` por PNG mono-preto 32px
- Arquivo fonte: `brand-kit/png/mono-preto/mono-preto-32.png`
- Copiar para `public/favicon.png` como parte da implementação

### 1.4 Blog Byline

**Arquivo:** `src/components/blog/BlogPostByline.tsx`

- Substituir quadrado "BG" (pixel text) por `<BrandMascot variant="cor" size={32} />`
- Layout e informações (nome, role) mantidos

### Arquivos — Onda 1

| Arquivo | Ação |
|---|---|
| `src/components/brand/BrandMascot.tsx` | Novo |
| `src/components/Navigation.tsx` | Editar (~5 linhas) |
| `src/layouts/Layout.astro` | Editar (1 linha) |
| `src/components/blog/BlogPostByline.tsx` | Editar (~3 linhas) |

---

## Onda 2 — Personagem Vivo

Expansão do BrandMascot com estados animados e inserção do mascote em momentos-chave da experiência.

### 2.1 BrandMascot — Expansão com estados

- Adicionar prop `state: MascotState`
- Cada estado define valores de `animate` para subcomponentes (olhos, pés)
- Piscada implementada via `useEffect` + intervalo com jitter aleatório (3-5s)
- `useReducedMotion` → desativa animações, renderiza `idle`

### 2.2 PixelLoader — Refatoração com identidade BLOCO

**Arquivos:** `src/components/ui/PixelLoader.tsx` + `PixelLoader.css`

- Grid de pixels usa paleta da marca: preto → branco → dourado (em vez de roxo → verde)
- BLOCO `focused` aparece ao centro durante a dissolução
- Animação de "despertar": scale 0.8 → 1.0 com spring, fade in dos olhos
- Loader desaparece após piscada do BLOCO

### 2.3 NotFound — BLOCO perdido

**Arquivo:** `src/components/pages/NotFound.tsx`

- Adicionar `<BrandMascot variant="cor" size={64} state="confused" />` como elemento visual
- Posicionado acima do "404", como ilustração de apoio
- Micro-interação: hover no botão "Voltar" → BLOCO transiciona para `happy`

### 2.4 Hero — Presença decorativa

**Arquivo:** `src/components/Hero.tsx`

- BLOCO no canto inferior direito (32px), mesma zona dos elementos POS/VER
- Estado: `focused` nos primeiros 3s → `curious` após
- Opacidade: 0.3 base → 0.6 no hover
- Não compete com o headline — é descoberta, não destaque

### 2.5 Loader de transição

- `<BrandMascot variant="cor" size={24} state="focused" />` como estado de carregamento inline
- Usar em fetching de posts do blog e estados assíncronos

### Arquivos — Onda 2

| Arquivo | Ação |
|---|---|
| `src/components/brand/BrandMascot.tsx` | Expandir — adicionar `state`, animações |
| `src/components/ui/PixelLoader.tsx` | Refatorar |
| `src/components/ui/PixelLoader.css` | Refatorar |
| `src/components/pages/NotFound.tsx` | Adicionar BLOCO |
| `src/components/Hero.tsx` | Adicionar BLOCO decorativo |

---

## Onda 3 — Ícones BLOCO Line

Substituição estratégica de ícones lucide-react pelos BLOCO Line, apenas onde há correspondência semântica.

### 3.1 BrandIcon — Componente

- Mapa interno com paths SVG de cada um dos 11 ícones (extraídos dos SVGs do brand kit)
- Traço branco com `strokeWidth` proporcional ao `size` (2.6/32 = ~8% do viewBox)
- Acento dourado via fill/stroke #F1C232
- `variant="line"` (contorno) como padrão; `variant="solid"` para estado ativo

### 3.2 Regra de substituição

**Substitui:**
| lucide-react | Contexto | BLOCO |
|---|---|---|
| `Code2` | Skills (skills.ts) | `codigo` |
| `Rocket` | Skills | `deploy` |
| `Database` | Skills | `api` |
| `Globe` | Skills | `comunidade` |

**Mantém lucide-react:**
| Ícone | Motivo |
|---|---|
| `Languages`, `ArrowLeft/Right/UpRight`, `Calendar`, `Clock`, `MousePointer2`, `X`, `Mail`, `ExternalLink`, `Zap`, `Palette`, `Smartphone`, `Shield` | Sem equivalente semântico no BLOCO Line |

### 3.3 Integração com sonner (Toasts)

**Arquivo:** `src/components/ui/sonner.tsx`

- Ícones customizados para tipos de toast:
  - `error` → `<BrandIcon name="erro" size={20} />`
  - `success` → `<BrandIcon name="sucesso" size={20} />`
  - `warning` → `<BrandIcon name="alerta" size={20} />`

### 3.4 Barrel export

**Arquivo:** `src/components/brand/index.ts`

```ts
export { BrandMascot } from "./BrandMascot";
export { BrandIcon } from "./BrandIcon";
```

### Arquivos — Onda 3

| Arquivo | Ação |
|---|---|
| `src/components/brand/BrandIcon.tsx` | Novo |
| `src/components/brand/index.ts` | Novo |
| `src/data/skills.ts` | Editar (~5 substituições) |
| `src/components/ui/sonner.tsx` | Editar (ícones de toast) |

---

## O que NÃO muda

- **CustomCursor** — já usa dourado como acento central, crosshair não tem equivalente no BLOCO Line
- **Ícones de UI genérica** (setas, X, calendário) — continuam com lucide-react
- **Social icons** — continuam com @icons-pack/react-simple-icons (marcas de terceiros)
- **GrainOverlay, LiquidGlass, SmoothScroll** — componentes de efeito visual globais não relacionados a branding
- **Tipografia e cores** — já alinhadas com o brand kit

---

## Testes

### Unitários (Vitest)

- `BrandMascot.test.tsx` — renderiza cada variante com cores corretas, aplica size, className, respeita mínimo 16px, estados renderizam sem crash
- `BrandIcon.test.tsx` — renderiza cada ícone, aplica size, variant line/solid, className

### E2E (Playwright)

- Página inicial carrega com mascote na navegação
- Página 404 exibe mascote "confused"
- Toasts exibem ícones BLOCO Line
- PixelLoader executa sem erros

### Verificação manual

- `bun run build` — build estático sem erros
- `bun run lint` — sem violações
- `bun run test:unit` — todos os testes passam
- Inspeção visual em mobile (375px), tablet (768px), desktop (1440px)

---

## Critérios de sucesso

1. Mascote visível em nav, byline, loader, 404, hero
2. Estados expressivos funcionam em cada contexto
3. Ícones BLOCO Line aparecem onde houve substituição
4. Animações respeitam `prefers-reduced-motion`
5. Performance: sem regressão no Lighthouse score (>95)
6. Build estático sem erros
7. Zero regressão visual nos componentes não tocados
