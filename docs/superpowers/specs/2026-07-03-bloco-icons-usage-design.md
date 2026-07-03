# BLOCO Icons — Uso no Site (Integração Híbrida) — Design Spec

**Data:** 2026-07-03
**Status:** Design aprovado
**Escopo:** Dar uso real aos 11 ícones BLOCO Line já disponíveis no componente `BrandIcon`, distribuindo-os pelas superfícies vivas do site onde há correspondência semântica — com a seção **Sobre (About)** como lar principal.
**Depende de:** `2026-07-03-brand-kit-integration-design.md` (criou o mascote + `BrandIcon`). Esta spec é o follow-up focado em **uso** dos ícones.

---

## Contexto

O brand kit e o componente `BrandIcon` (11 ícones BLOCO Line, traço branco + acento dourado `#F1C232`, feitos para superfícies escuras) já existem e funcionam. O problema é de **uso**, não de componente:

- **Renderizam hoje (3/11):** `erro`, `sucesso`, `alerta` — nos toasts do sonner.
- **Definidos mas mortos (4/11):** `codigo`, `deploy`, `api`, `comunidade` estão em `src/data/skills.ts`, mas `skills.ts` **não é renderizado** — apenas `getAllTechnologies()` (lista de strings) é consumida em `index.astro` para o Schema.org.
- **Nunca usados (4/11):** `terminal`, `documentacao`, `settings`, `usuario`.

**Raiz do problema:** os melhores lares semânticos do set (uma grade de skills / práticas de engenharia) foram removidos da home em refactors passados. Os componentes `EngineeringPractices`, `LatestPosts` e `InfoBar` ainda existem como arquivo mas estão **órfãos** — nenhum é renderizado (`EngineeringPractices` e `LatestPosts` não são importados em lugar nenhum; `InfoBar` só aparece em teste).

**Superfícies que hoje estão de fato no ar** e podem receber ícones: Sobre (About), Blog (listagem + post), Case Study, Hero, Contato/Footer.

**Objetivo:** distribuir os ícones pelas superfícies vivas onde fizer sentido — sem forçar onde não faz — usando a seção Sobre como lar principal, mantendo a estética neo-brutalista editorial existente (fundo preto, acento dourado, tipos raster/mono, texturas de glitch/scanline).

---

## Princípios de design

1. **Nativo da estética existente.** Nada de linguagem visual nova. Labels mono, bordas/filetes finos, um acento dourado por ícone, reveal escalonado no scroll respeitando `prefers-reduced-motion`.
2. **Ícones são a textura calma; o mascote é o personagem animado.** Ícones ficam estáticos (sem animação própria). Só o container faz reveal de entrada.
3. **Só onde faz sentido.** Reúso de um ícone entre contextos é permitido quando coerente. Nenhum ícone é enfiado em superfície sem correspondência semântica.
4. **Fundo escuro apenas.** Os ícones são traço branco + dourado fixos (não herdam cor de texto). Todas as superfícies-alvo são `bg-black`. Não colocar ícone dentro do badge dourado nem em botão branco.

---

## Arquitetura

Nenhum componente novo de marca é necessário — `BrandIcon` já existe. As mudanças são:

1. Um ajuste de acessibilidade no `BrandIcon` (modo decorativo).
2. Um bloco editorial novo dentro do `About` (lista de capacidades).
3. Salpicos pontuais de `BrandIcon` em Blog, Case Study.
4. Chaves de i18n novas para a copy do bloco do About.

### 4.1 `BrandIcon` — modo decorativo (acessibilidade)

**Arquivo:** `src/components/brand/BrandIcon.tsx`

Hoje o `BrandIcon` sempre renderiza `role="img"` + `aria-label={`Ícone ${name}`}`. Como em **todos** os usos desta spec o ícone fica colado a um texto (label/título), isso causaria anúncio duplicado em leitores de tela.

Adicionar prop opcional `decorative` (default `false`):

```ts
interface BrandIconProps {
  name: IconName;
  size?: number;
  variant?: IconVariant;
  className?: string;
  decorative?: boolean; // NOVO — quando true, aria-hidden e sem role/label
}
```

- `decorative === true` → `<svg aria-hidden="true" focusable="false">` sem `role` nem `aria-label`.
- `decorative === false` (default) → comportamento atual preservado (não quebra os toasts nem testes existentes).

Todos os usos desta spec passam `decorative` (o texto adjacente já carrega o significado).

`variant="solid"` permanece como está (hoje é no-op — `resolveColor` retorna dourado para line e solid). Nenhum uso desta spec precisa de `solid`; não há mudança. YAGNI.

### 4.2 Sobre (About) — lista editorial de capacidades

**Arquivo:** `src/components/About.tsx`

Inserir, **abaixo do bloco da bio** (após o `<p>` da bio e o bloco `about.based`, dentro da coluna de conteúdo editorial que hoje vai até ~linha 104), uma lista vertical de capacidades no estilo revista:

- Cada item: `[BrandIcon 20px decorative]` + label mono/uppercase.
- Filete fino entre itens (`border-t border-white/10`), sem borda no primeiro.
- Largura contida (ex.: `max-w-md`) para ler como lista editorial, não grade.
- Um label mono de seção acima da lista (ex.: `// O_QUE_EU_FAÇO`).
- Reveal escalonado por item no scroll (`whileInView` + `transition delay`), **silenciado** quando `useReducedMotion()` for verdadeiro (adicionar o import do hook `@/hooks/useReducedMotion`, hoje ausente no About).

Dados inline no componente (pequeno, isolado):

```ts
const capabilities: { icon: IconName; key: TranslationKey }[] = [
  { icon: "codigo",      key: "about.cap.development" },
  { icon: "api",         key: "about.cap.backend" },
  { icon: "deploy",      key: "about.cap.deploy" },
  { icon: "usuario",     key: "about.cap.a11y" },
  { icon: "settings",    key: "about.cap.practices" },
  { icon: "comunidade",  key: "about.cap.collaboration" },
];
```

Isso recupera o espírito da `EngineeringPractices` órfã dentro do About, sem revivê-la como arquivo.

### 4.3 Copy / i18n

**Arquivo:** `src/lib/i18n.ts` (adicionar chaves em `dictionary.pt` e `dictionary.en`, seguindo a convenção `"// PREFIXO"` para labels mono)

| Chave | pt | en |
|---|---|---|
| `about.capabilities_label` | `// O_QUE_EU_FAÇO` | `// WHAT_I_DO` |
| `about.cap.development` | Desenvolvimento Front-End | Front-End Development |
| `about.cap.backend` | Backend & APIs | Backend & APIs |
| `about.cap.deploy` | Deploy & CI/CD | Deploy & CI/CD |
| `about.cap.a11y` | Acessibilidade & UX | Accessibility & UX |
| `about.cap.practices` | Boas Práticas & Processo | Engineering Practices |
| `about.cap.collaboration` | Colaboração com Produto | Product Collaboration |

(As duas listas — pt e en — precisam das mesmas chaves; o tipo `TranslationKey` é derivado de `dictionary.pt`.)

### 4.4 Salpicos nas superfícies vivas

**Blog — listagem** (`src/components/pages/BlogPage.tsx`, hero label `blog.label` ~linha 50):
- `<BrandIcon name="documentacao" size={16} decorative />` antes do texto `// BLOG`. Blog é literalmente documentação. Alinhar verticalmente com o label mono.

**Blog — post header** (`src/components/blog/BlogPostHeader.tsx`, meta row ~linhas 23-29):
- `documentacao` (14–16px, decorative) discreto na meta row, antes do badge de categoria ou junto à data. Um só ponto, para não poluir.

**Case Study — labels de seção** (`src/components/projects/CaseStudy.tsx`):
- Label `case.context` → prefixar com `terminal` (o "ambiente/setup" do problema).
- Label `case.stack` → prefixar com `codigo`.
- Demais labels (`case.impact`, `case.related`, `case.next`) permanecem **sem** ícone — iconizar todos viraria ruído. (Reúso de `codigo` entre About e Case Study é coerente.)

Padrão de inserção nos labels mono: `<span className="inline-flex items-center gap-2"><BrandIcon name="…" size={14} decorative />{t(locale, "…")}</span>`.

---

## Cobertura dos 11 ícones

| Superfície | Ícones | Status |
|---|---|---|
| Toasts (sonner) | `erro`, `sucesso`, `alerta` | Já feito |
| Lista About | `codigo`, `api`, `deploy`, `usuario`, `settings`, `comunidade` | Nesta spec |
| Blog (listagem + post) | `documentacao` | Nesta spec |
| Case Study (labels) | `terminal`, `codigo` (reuso) | Nesta spec |

Todos os 11 ganham casa; reúso apenas onde é coerente; nenhum forçado.

---

## O que NÃO muda

- **`skills.ts`** — permanece como fonte de `getAllTechnologies()` para Schema.org. Não será renderizado como grade nesta spec (os ícones que ele referencia agora têm casa no About). Sem mudança.
- **Componentes órfãos** (`EngineeringPractices`, `LatestPosts`, `InfoBar`) — não serão revividos nem removidos nesta spec (fora de escopo; decisão separada).
- **Ticker de stack do About** — continua com `@icons-pack/react-simple-icons` (logos reais de terceiros: Next, TS, Vercel…). Não substituir por BLOCO.
- **Ícones de UI genérica** (setas, X, idioma, calendário, relógio, mail) — continuam com `lucide-react` (sem equivalente semântico BLOCO).
- **Mascote** — inalterado (nav, byline, 404, hero, loader já feitos).
- **Tipografia, cores, efeitos globais** — inalterados.

---

## Acessibilidade

- Ícones sempre acompanham texto → renderizados com `decorative` (`aria-hidden`, `focusable="false"`), evitando anúncio redundante.
- Contraste: traço branco/dourado sobre `bg-black` — alto contraste, ok.
- A lista de capacidades usa marcação semântica (`<ul>/<li>`), com o ícone como adorno e o label como conteúdo textual real.
- Nenhuma informação depende só do ícone (sempre há label textual).

## Motion / reduced motion

- Lista do About: reveal escalonado por item (`whileInView`, `transition={{ delay: i * 0.08 }}`), gated por `useReducedMotion()` → sem animação quando reduzido.
- Ícones em si: estáticos, sem animação própria.
- Sem layout shift (SVG inline, dimensões fixas via `size`).

---

## Testes

### Unitários (Vitest)
- `BrandIcon.test.tsx` — novo caso: `decorative` renderiza `aria-hidden="true"` e **não** emite `role="img"`/`aria-label`; sem `decorative`, comportamento atual preservado.
- `About.test.tsx` — a lista de capacidades renderiza os 6 itens com seus labels; existência dos ícones (por `data-*`/estrutura). Ajustar teste existente se a nova marcação afetá-lo.
- `BlogPage` / `CaseStudy` — asserção leve de presença do ícone onde adicionado (quando já houver teste correspondente; caso contrário, cobrir via smoke visual).

### Verificação manual
- `bun run build` — build estático sem erros.
- `bun run lint` — sem violações.
- `bun run test:unit` — todos passam.
- Inspeção visual: mobile (375px), tablet (768px), desktop (1440px).
- `prefers-reduced-motion: reduce` — lista aparece estática, sem stagger.

---

## Critérios de sucesso

1. Lista de capacidades visível no About, com os 6 ícones e labels (pt/en).
2. `documentacao` presente no Blog (listagem + post).
3. `terminal` e `codigo` presentes nos labels do Case Study.
4. `BrandIcon decorative` não gera anúncio duplicado (aria-hidden).
5. Todos os 11 ícones têm pelo menos um uso real no site.
6. Animações respeitam `prefers-reduced-motion`.
7. `bun run build` + `lint` + `test:unit` passam.
8. Zero regressão visual nas superfícies não tocadas; toasts continuam funcionando.
