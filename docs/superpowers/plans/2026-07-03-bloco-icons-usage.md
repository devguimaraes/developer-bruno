# BLOCO Icons — Uso no Site (Integração Híbrida) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar uso real aos 11 ícones BLOCO Line (via `BrandIcon`) distribuindo-os pelas superfícies vivas do site — com uma lista editorial de capacidades no About como lar principal — sem forçar onde não faz sentido.

**Architecture:** `BrandIcon` já existe; ganha um modo `decorative` (aria-hidden) e um atributo `data-icon` para testabilidade. O About recebe um bloco novo (lista editorial `ícone + capacidade`) alimentado por dados inline + i18n. Salpicos pontuais de `BrandIcon` entram no Blog (listagem + post) e no Case Study (labels de seção). Nenhum componente de marca novo é criado.

**Tech Stack:** React 18, TypeScript, Framer Motion, Tailwind CSS, Astro 5, Vitest + React Testing Library.

## Global Constraints

- Paleta: Preto `#000000`, Branco `#FFFFFF`, Dourado `#F1C232`. Ícones são traço branco + dourado fixos → **só em superfície escura** (`bg-black`); nunca dentro do badge dourado nem em botão branco.
- Todos os usos de ícone acompanham texto → sempre passar `decorative` (aria-hidden), evitando anúncio redundante em leitor de tela.
- Animações respeitam `prefers-reduced-motion: reduce` via hook `useReducedMotion()` de `@/hooks/useReducedMotion`.
- Ícones ficam estáticos (sem animação própria); só o container faz reveal de entrada.
- Fontes/estética inalteradas (neo-brutalista editorial: labels mono, tipos raster, filetes finos).
- Copy nova em pt **e** en (o tipo `TranslationKey` é derivado de `dictionary.pt` — ambas as listas precisam das mesmas chaves).
- Commits: Conventional Commits, **sem** `Co-Authored-By`. Pre-commit hook (Biome + `tsc --noEmit`) deve passar — não usar `--no-verify` em commits de código.
- `bun run build`, `bun run lint` e `bun run test:unit` devem passar.

---

## File Structure

```
src/components/brand/BrandIcon.tsx        — Modificar: prop `decorative` + data-icon
src/components/brand/BrandIcon.test.tsx   — Criar: testes de acessibilidade
src/lib/i18n.ts                           — Modificar: 7 chaves novas (pt + en)
src/components/About.tsx                  — Modificar: lista editorial de capacidades
src/components/About.test.tsx             — Modificar: casos da lista de capacidades
src/components/pages/BlogPage.tsx         — Modificar: ícone documentacao no hero label
src/components/pages/BlogPage.test.tsx    — Modificar: asserção do ícone
src/components/blog/BlogPostHeader.tsx    — Modificar: ícone documentacao na meta row
src/components/pages/BlogPostPage.test.tsx— Modificar: asserção do ícone
src/components/projects/CaseStudy.tsx     — Modificar: ícones terminal/codigo nos labels
```

---

## Task 1: `BrandIcon` — modo decorativo + `data-icon`

**Files:**
- Modify: `src/components/brand/BrandIcon.tsx` (interface `BrandIconProps` ~linhas 19-24; componente ~linhas 432-454)
- Test: `src/components/brand/BrandIcon.test.tsx` (criar)

**Interfaces:**
- Produces: `BrandIcon` passa a aceitar `decorative?: boolean` (default `false`). Quando `true`, o `<svg>` recebe `aria-hidden="true"` + `focusable="false"` e **não** recebe `role`/`aria-label`. Quando `false`, mantém `role="img"` + `aria-label={`Ícone ${name}`}` (comportamento atual). O `<svg>` sempre recebe `data-icon={name}`.

- [ ] **Step 1: Escrever o teste que falha**

Criar `src/components/brand/BrandIcon.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrandIcon } from "./BrandIcon";

describe("BrandIcon — acessibilidade", () => {
  it("por padrão expõe role=img e aria-label (não decorativo)", () => {
    const { container } = render(<BrandIcon name="codigo" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Ícone codigo");
    expect(svg?.getAttribute("aria-hidden")).toBeNull();
  });

  it("com decorative marca aria-hidden e remove role/label", () => {
    const { container } = render(<BrandIcon name="codigo" decorative />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.getAttribute("aria-label")).toBeNull();
    expect(svg?.getAttribute("focusable")).toBe("false");
  });

  it("expõe data-icon com o nome para consulta em testes", () => {
    const { container } = render(<BrandIcon name="terminal" decorative />);
    expect(container.querySelector('[data-icon="terminal"]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `bunx vitest run src/components/brand/BrandIcon.test.tsx`
Expected: FAIL — o caso `decorative` falha (hoje sempre há `role="img"`; `data-icon` ausente).

- [ ] **Step 3: Atualizar a interface de props**

Em `src/components/brand/BrandIcon.tsx`, substituir a interface (linhas ~19-24):

```tsx
interface BrandIconProps {
  name: IconName;
  size?: number;
  variant?: IconVariant;
  className?: string;
  decorative?: boolean;
}
```

- [ ] **Step 4: Atualizar o componente para honrar `decorative` e emitir `data-icon`**

Substituir o corpo do componente `BrandIcon` (linhas ~432-454) por:

```tsx
export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  size = 24,
  variant = "line",
  className,
  decorative = false,
}) => {
  const data = ICON_PATHS[name];
  const a11y = decorative
    ? ({ "aria-hidden": true, focusable: "false" } as const)
    : ({ role: "img", "aria-label": `Ícone ${name}` } as const);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      data-icon={name}
      style={{ minWidth: size, minHeight: size }}
      {...a11y}
    >
      {data.elements.map((el, idx) => renderElement(el, variant, idx))}
    </svg>
  );
};
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `bunx vitest run src/components/brand/BrandIcon.test.tsx`
Expected: PASS (3 casos).

- [ ] **Step 6: Verificar build + lint**

Run: `bun run build && bun run lint`
Expected: build estático sem erros; lint sem violações. (Os toasts do sonner seguem funcionando — não passam `decorative`, comportamento atual preservado.)

- [ ] **Step 7: Commit**

```bash
git add src/components/brand/BrandIcon.tsx src/components/brand/BrandIcon.test.tsx
git commit -m "feat(brand): add decorative mode and data-icon to BrandIcon"
```

---

## Task 2: Chaves de i18n para as capacidades

**Files:**
- Modify: `src/lib/i18n.ts` (`dictionary.pt` após `"about.based"` ~linha 32; `dictionary.en` após `"about.based"` ~linha 135)

**Interfaces:**
- Produces: 7 chaves novas de tradução, disponíveis como `TranslationKey`: `about.capabilities_label`, `about.cap.development`, `about.cap.backend`, `about.cap.deploy`, `about.cap.a11y`, `about.cap.practices`, `about.cap.collaboration`.

- [ ] **Step 1: Adicionar as chaves em `dictionary.pt`**

Em `src/lib/i18n.ts`, logo após a linha `"about.based": "// RIO_DE_JANEIRO",` (dentro de `pt:`), inserir:

```ts
    "about.capabilities_label": "// O_QUE_EU_FAÇO",
    "about.cap.development": "Desenvolvimento Front-End",
    "about.cap.backend": "Backend & APIs",
    "about.cap.deploy": "Deploy & CI/CD",
    "about.cap.a11y": "Acessibilidade & UX",
    "about.cap.practices": "Boas Práticas & Processo",
    "about.cap.collaboration": "Colaboração com Produto",
```

- [ ] **Step 2: Adicionar as mesmas chaves em `dictionary.en`**

Em `src/lib/i18n.ts`, logo após a linha `"about.based": "// RIO_DE_JANEIRO",` (dentro de `en:`), inserir:

```ts
    "about.capabilities_label": "// WHAT_I_DO",
    "about.cap.development": "Front-End Development",
    "about.cap.backend": "Backend & APIs",
    "about.cap.deploy": "Deploy & CI/CD",
    "about.cap.a11y": "Accessibility & UX",
    "about.cap.practices": "Engineering Practices",
    "about.cap.collaboration": "Product Collaboration",
```

- [ ] **Step 3: Verificar typecheck (chaves consistentes entre pt/en)**

Run: `bunx tsc --noEmit -p tsconfig.app.json`
Expected: sem erros. (Se `en` estiver faltando alguma chave que `pt` tem, o objeto ainda compila — mas a paridade é obrigatória por convenção; confira visualmente que as 7 chaves existem nas duas listas.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat(i18n): add capability labels for About section (pt/en)"
```

---

## Task 3: About — lista editorial de capacidades

**Files:**
- Modify: `src/components/About.tsx` (imports ~linhas 1-18; coluna de conteúdo, inserir após o bloco da bio que fecha ~linha 103)
- Test: `src/components/About.test.tsx` (adicionar describe novo ao final)

**Interfaces:**
- Consumes: `BrandIcon` de `@/components/brand`; `IconName` de `@/components/brand`; `TranslationKey` de `@/lib/i18n`; `useReducedMotion` de `@/hooks/useReducedMotion`; chaves de i18n da Task 2.
- Produces: a seção About renderiza, abaixo da bio, a label `about.capabilities_label` e uma `<ul>` com 6 `<li>` (`ícone decorativo` + label mono), com reveal escalonado gated por reduced motion.

- [ ] **Step 1: Escrever os testes que falham**

No fim de `src/components/About.test.tsx`, adicionar:

```tsx
describe("About — Lista de Capacidades", () => {
  it("renderiza a label da seção de capacidades", () => {
    render(<About />);
    expect(screen.getByText("// O_QUE_EU_FAÇO")).toBeInTheDocument();
  });

  it("renderiza os 6 rótulos de capacidade (pt)", () => {
    render(<About />);
    expect(screen.getByText("Desenvolvimento Front-End")).toBeInTheDocument();
    expect(screen.getByText("Backend & APIs")).toBeInTheDocument();
    expect(screen.getByText("Deploy & CI/CD")).toBeInTheDocument();
    expect(screen.getByText("Acessibilidade & UX")).toBeInTheDocument();
    expect(screen.getByText("Boas Práticas & Processo")).toBeInTheDocument();
    expect(screen.getByText("Colaboração com Produto")).toBeInTheDocument();
  });

  it("renderiza um BrandIcon decorativo por capacidade", () => {
    const { container } = render(<About />);
    for (const name of ["codigo", "api", "deploy", "usuario", "settings", "comunidade"]) {
      expect(container.querySelector(`[data-icon="${name}"]`)).not.toBeNull();
    }
  });
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `bunx vitest run src/components/About.test.tsx`
Expected: FAIL — os 3 casos novos falham (label e ícones ainda não renderizados).

- [ ] **Step 3: Adicionar imports e os dados das capacidades**

Em `src/components/About.tsx`, adicionar aos imports existentes (após a linha 18 `import { MousePointer2 } from "lucide-react";`):

```tsx
import { BrandIcon } from "@/components/brand";
import type { IconName } from "@/components/brand";
import type { TranslationKey } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
```

Logo antes de `const About: React.FC = () => {` (linha 20), adicionar:

```tsx
const capabilities: { icon: IconName; key: TranslationKey }[] = [
  { icon: "codigo", key: "about.cap.development" },
  { icon: "api", key: "about.cap.backend" },
  { icon: "deploy", key: "about.cap.deploy" },
  { icon: "usuario", key: "about.cap.a11y" },
  { icon: "settings", key: "about.cap.practices" },
  { icon: "comunidade", key: "about.cap.collaboration" },
];
```

- [ ] **Step 4: Ler `prefers-reduced-motion` no componente**

Dentro de `About`, logo após `const locale = useLocale();` (linha 21), adicionar:

```tsx
  const prefersReducedMotion = useReducedMotion();
```

- [ ] **Step 5: Inserir a lista editorial abaixo da bio**

Em `src/components/About.tsx`, localizar o fechamento do bloco da bio — o trecho:

```tsx
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white" />
                  <div className="w-2 h-2 bg-white/40" />
                  <div className="w-2 h-2 bg-white/10" />
                </div>
              </div>
            </motion.div>
          </div>
```

Substituir por (adiciona a lista logo após o `</motion.div>` da bio, ainda dentro da coluna de conteúdo):

```tsx
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white" />
                  <div className="w-2 h-2 bg-white/40" />
                  <div className="w-2 h-2 bg-white/10" />
                </div>
              </div>
            </motion.div>

            {/* Lista editorial de capacidades */}
            <div className="mt-14 md:ml-12 max-w-md pointer-events-auto">
              <p className="type-mono text-[11px] text-accent uppercase tracking-[0.4em] font-bold mb-2">
                {t(locale, "about.capabilities_label")}
              </p>
              <ul>
                {capabilities.map((cap, i) => (
                  <motion.li
                    key={cap.icon}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="flex items-center gap-4 py-4 border-t border-white/10 first:border-t-0"
                  >
                    <BrandIcon name={cap.icon} size={22} decorative />
                    <span className="type-mono text-xs md:text-sm uppercase tracking-[0.15em] text-white/80">
                      {t(locale, cap.key)}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
```

- [ ] **Step 6: Rodar os testes e confirmar que passam**

Run: `bunx vitest run src/components/About.test.tsx`
Expected: PASS (casos existentes + 3 novos).

- [ ] **Step 7: Verificar build + lint**

Run: `bun run build && bun run lint`
Expected: build estático sem erros; lint sem violações.

- [ ] **Step 8: Commit**

```bash
git add src/components/About.tsx src/components/About.test.tsx
git commit -m "feat(brand): add editorial capability list with BLOCO icons to About"
```

---

## Task 4: Blog — ícone `documentacao` (listagem + post)

**Files:**
- Modify: `src/components/pages/BlogPage.tsx` (import no topo; hero label ~linhas 50-52)
- Modify: `src/components/blog/BlogPostHeader.tsx` (import no topo; meta row ~linhas 22-31)
- Test: `src/components/pages/BlogPage.test.tsx` (adicionar 1 caso)
- Test: `src/components/pages/BlogPostPage.test.tsx` (adicionar 1 caso)

**Interfaces:**
- Consumes: `BrandIcon` de `@/components/brand`.
- Produces: `documentacao` renderizado (decorativo) no hero label da listagem e na meta row do post.

- [ ] **Step 1: Escrever os testes que falham**

Em `src/components/pages/BlogPage.test.tsx`, dentro do `describe("BlogPage — Hero Section", ...)`, adicionar:

```tsx
  it("exibe o ícone documentacao ao lado do label // BLOG", () => {
    const { container } = render(<BlogPage initialPosts={mockPosts} />);
    expect(container.querySelector('[data-icon="documentacao"]')).not.toBeNull();
  });
```

Em `src/components/pages/BlogPostPage.test.tsx`, dentro do `describe("BlogPostPage — Header", ...)`, adicionar:

```tsx
  it("exibe o ícone documentacao na meta row", () => {
    const { container } = render(<BlogPostPage post={mockPost} next={null} />);
    expect(container.querySelector('[data-icon="documentacao"]')).not.toBeNull();
  });
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `bunx vitest run src/components/pages/BlogPage.test.tsx src/components/pages/BlogPostPage.test.tsx`
Expected: FAIL — os 2 casos novos falham (nenhum `data-icon="documentacao"` ainda).

- [ ] **Step 3: Adicionar o ícone no hero label da listagem**

Em `src/components/pages/BlogPage.tsx`, adicionar o import (junto aos imports do topo do arquivo):

```tsx
import { BrandIcon } from "@/components/brand";
```

Substituir o hero label (linhas ~50-52):

```tsx
            <span className="type-mono text-[10px] tracking-[0.38em] text-accent block mb-6 font-bold">
              {t(locale, "blog.label")}
            </span>
```

por:

```tsx
            <span className="type-mono text-[10px] tracking-[0.38em] text-accent flex items-center gap-2 mb-6 font-bold">
              <BrandIcon name="documentacao" size={16} decorative />
              {t(locale, "blog.label")}
            </span>
```

- [ ] **Step 4: Adicionar o ícone na meta row do post**

Em `src/components/blog/BlogPostHeader.tsx`, adicionar o import (após a linha 5):

```tsx
import { BrandIcon } from "@/components/brand";
```

Na meta row, inserir o ícone como primeiro filho — substituir:

```tsx
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <span className="type-mono text-[9px] font-bold tracking-[0.20em] bg-accent text-black px-3 py-[3px] leading-none">
          {category}
        </span>
```

por:

```tsx
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <BrandIcon name="documentacao" size={16} decorative />
        <span className="type-mono text-[9px] font-bold tracking-[0.20em] bg-accent text-black px-3 py-[3px] leading-none">
          {category}
        </span>
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

Run: `bunx vitest run src/components/pages/BlogPage.test.tsx src/components/pages/BlogPostPage.test.tsx`
Expected: PASS.

- [ ] **Step 6: Verificar build + lint**

Run: `bun run build && bun run lint`
Expected: build estático sem erros; lint sem violações.

- [ ] **Step 7: Commit**

```bash
git add src/components/pages/BlogPage.tsx src/components/blog/BlogPostHeader.tsx src/components/pages/BlogPage.test.tsx src/components/pages/BlogPostPage.test.tsx
git commit -m "feat(brand): add documentacao icon to blog listing and post header"
```

---

## Task 5: Case Study — ícones `terminal` e `codigo` nos labels

**Files:**
- Modify: `src/components/projects/CaseStudy.tsx` (import ~linha 3; label `case.context`; label `case.stack`)

**Interfaces:**
- Consumes: `BrandIcon` de `@/components/brand`.
- Produces: `terminal` no label da seção CONTEXT e `codigo` no label da seção STACK (ambos decorativos).

> Não há suíte de testes para `CaseStudy` (o componente exige um mock completo de `Project`); a verificação desta task é por build + lint + inspeção visual. Justificativa: a mudança é puramente de apresentação (dois ícones decorativos prefixando labels já testados por i18n), sem lógica nova.

- [ ] **Step 1: Adicionar o import**

Em `src/components/projects/CaseStudy.tsx`, adicionar (junto aos imports do topo):

```tsx
import { BrandIcon } from "@/components/brand";
```

- [ ] **Step 2: Adicionar `terminal` no label CONTEXT**

Localizar (na seção CONTEXT):

```tsx
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
            {t(locale, "case.context")}
          </div>
```

Substituir por:

```tsx
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8 flex items-center gap-2">
            <BrandIcon name="terminal" size={14} decorative />
            {t(locale, "case.context")}
          </div>
```

- [ ] **Step 3: Adicionar `codigo` no label STACK**

Localizar (na seção STACK):

```tsx
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
            {t(locale, "case.stack")}
          </div>
```

Substituir por:

```tsx
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8 flex items-center gap-2">
            <BrandIcon name="codigo" size={14} decorative />
            {t(locale, "case.stack")}
          </div>
```

- [ ] **Step 4: Verificar build + lint**

Run: `bun run build && bun run lint`
Expected: build estático sem erros; lint sem violações.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/CaseStudy.tsx
git commit -m "feat(brand): add terminal/codigo icons to case study section labels"
```

---

## Verification (final, após todas as tasks)

- [ ] **Suíte completa de testes**

Run: `bun run test:unit`
Expected: todos os testes passam (incluindo os novos de BrandIcon, About, BlogPage, BlogPostPage).

- [ ] **Build + lint**

Run: `bun run build && bun run lint`
Expected: build estático sem erros; lint sem violações.

- [ ] **Inspeção visual** (`bun run dev`, porta 4321)

- `/` — About: lista de capacidades abaixo da bio, 6 ícones + labels, filetes; reveal escalonado ao entrar na viewport.
- `/blog` — `documentacao` ao lado de `// BLOG`.
- `/blog/[slug]` — `documentacao` na meta row do header.
- `/projetos/[slug]` — `terminal` no label CONTEXT, `codigo` no label STACK.
- Toasts (qualquer ação que dispare) — `erro`/`sucesso`/`alerta` seguem funcionando.
- Alternar idioma pt/en — labels de capacidade traduzem.
- `prefers-reduced-motion: reduce` — lista do About aparece estática, sem stagger.
- Mobile (375px) / desktop (1440px) — sem overflow; ícones proporcionais.

## Cobertura dos 11 ícones (conferência)

- Toasts: `erro`, `sucesso`, `alerta` (já existente).
- About: `codigo`, `api`, `deploy`, `usuario`, `settings`, `comunidade` (Task 3).
- Blog: `documentacao` (Task 4).
- Case Study: `terminal` + `codigo` reuso (Task 5).

11/11 com uso real; reúso só onde coerente.
