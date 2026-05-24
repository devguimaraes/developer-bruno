# Social Icons na Seção LET'S_TALK — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Adicionar ícones das redes sociais (Instagram, GitHub, LinkedIn, X) na seção LET'S_TALK da homepage, com o mesmo padrão visual do Contact.tsx.

**Architecture:** Componente `SocialIcons` autônomo que lê de `contactData.socialLinks`, renderiza ícones SVG das marcas via `@icons-pack/react-simple-icons` (já instalado), com índices numéricos e hover accent. Integrado em `Index.tsx` entre o link LET'S_TALK e o copyright.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion (ScrollReveal), @icons-pack/react-simple-icons, Vitest + jsdom

---

### Task 1: Adicionar rede X ao contactData

**Files:**
- Modify: `src/config/site.ts:155-161`

- [ ] **Step 1: Adicionar entrada X ao array socialLinks**

```typescript
// src/config/site.ts — dentro de contactData.socialLinks, após Instagram:
    {
      id: 'x',
      icon: 'X',
      href: 'https://x.com/devguimraes/',
      label: 'X',
      username: 'devguimraes',
    },
```

O array final fica com 4 itens: linkedin, github, instagram, x.

- [ ] **Step 2: Rodar typecheck para confirmar**

Run: `bunx tsc --noEmit src/config/site.ts`
Expected: PASS (sem erros de tipo em site.ts)

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "feat(data): add X social network to contactData"
```

---

### Task 2: Criar teste do componente SocialIcons

**Files:**
- Create: `src/components/SocialIcons.test.tsx`

- [ ] **Step 1: Escrever o teste**

```typescript
// src/components/SocialIcons.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialIcons from "./SocialIcons";
import { contactData } from "@/config/site";

// Mock ScrollReveal para renderizar children diretamente
vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("SocialIcons", () => {
  it("renders all 4 social links", () => {
    render(<SocialIcons />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);

    contactData.socialLinks.forEach((social) => {
      const link = screen.getByRole("link", { name: new RegExp(social.label, "i") });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });

  it("renders index numbers 01-04", () => {
    render(<SocialIcons />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("renders brand SVG icons", () => {
    render(<SocialIcons />);

    const svgs = document.querySelectorAll("svg");
    // Um SVG por link + 4 ArrowUpRight SVGs = 8 SVGs
    expect(svgs.length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Rodar teste e verificar que falha**

Run: `bunx vitest run src/components/SocialIcons.test.tsx`
Expected: FAIL — "SocialIcons is not defined" ou erro de módulo não encontrado

- [ ] **Step 3: Commit**

```bash
git add src/components/SocialIcons.test.tsx
git commit -m "test: add SocialIcons unit test"
```

---

### Task 3: Implementar componente SocialIcons

**Files:**
- Create: `src/components/SocialIcons.tsx`

- [ ] **Step 1: Escrever a implementação**

```typescript
// src/components/SocialIcons.tsx
import type React from "react";
import { ArrowUpRight } from "lucide-react";
import { SiGithub, SiLinkedin, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { contactData } from "@/config/site";
import ScrollReveal from "@/components/ui/ScrollReveal";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: SiGithub,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
  x: SiX,
};

const SocialIcons: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {contactData.socialLinks.map((link, idx) => {
        const Icon = iconMap[link.id];
        if (!Icon) return null;

        return (
          <ScrollReveal key={link.id} direction="up" delay={0.1 + idx * 0.1}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              className="group flex items-center gap-2 border-b-2 border-white/10 hover:border-accent py-2 px-1 transition-all min-h-12"
            >
              <span className="type-ui-label text-[10px] opacity-20 text-white">0{idx + 1}</span>
              <Icon size={22} className="text-white/60 group-hover:text-accent transition-colors" />
              <ArrowUpRight
                size={18}
                className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-accent"
              />
            </a>
          </ScrollReveal>
        );
      })}
    </div>
  );
};

export default SocialIcons;
```

- [ ] **Step 2: Rodar teste para verificar que passa**

Run: `bunx vitest run src/components/SocialIcons.test.tsx`
Expected: PASS — 3 testes verdes

- [ ] **Step 3: Rodar typecheck**

Run: `bunx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/SocialIcons.tsx
git commit -m "feat(social): add SocialIcons component with brand SVG icons"
```

---

### Task 4: Integrar SocialIcons na homepage

**Files:**
- Modify: `src/components/pages/Index.tsx:49-65`

- [ ] **Step 1: Adicionar import e componente**

Adicionar o import no topo do arquivo:

```typescript
import SocialIcons from "@/components/SocialIcons";
```

Inserir `<SocialIcons />` entre o link LET'S_TALK e o copyright:

```tsx
      <SectionEntrance
        id="contact"
        className="py-40 flex flex-col items-center justify-center text-center"
      >
        <div className="type-mono mb-8">Ready to start a project?</div>
        <a
          href={`mailto:${contactData.email}`}
          className="type-raster-section text-[12vw] hover:text-accent transition-colors cursor-pointer block"
          title="Get in touch to start a project"
        >
          LET&apos;S_TALK
        </a>
        <SocialIcons />
        <div className="mt-20 type-mono opacity-50">
          © 2026 BRUNO GUIMARÃES / ALL RIGHTS RESERVED
        </div>
      </SectionEntrance>
```

- [ ] **Step 2: Rodar typecheck e testes**

Run: `bunx tsc --noEmit`
Expected: PASS

Run: `bunx vitest run src/components/SocialIcons.test.tsx`
Expected: PASS — 3 testes verdes

- [ ] **Step 3: Rodar build para verificar integração**

Run: `bun run build`
Expected: PASS — build sem erros

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/Index.tsx
git commit -m "feat(home): integrate SocialIcons into LET'S_TALK section"
```

---

### Task 5: Verificação visual no dev server

**Files:** Nenhum (verificação manual)

- [ ] **Step 1: Iniciar dev server**

Run: `bun run dev`
Expected: Server rodando em `http://localhost:4321`

- [ ] **Step 2: Verificar visualmente**

- Scrollar até a seção LET'S_TALK no final da página
- Confirmar que 4 ícones aparecem entre LET'S_TALK e o copyright
- Verificar hover: ícone muda para cor accent, ArrowUpRight aparece
- Clicar em cada link: abre em nova aba a rede social correta

- [ ] **Step 3: Rodar lint final**

Run: `bun run lint`
Expected: PASS (sem erros)

- [ ] **Step 4: Commit final (se necessário)**

```bash
git add -A
git commit -m "chore: final adjustments for social icons"
```
