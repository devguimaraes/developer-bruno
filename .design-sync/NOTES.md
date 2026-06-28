# Design Sync — Notas de Manutenção

## Estrutura de entry point

O package `@dev-bruno/portfolio` é um pacote npm scoped em `node_modules/@dev-bruno/portfolio/`.
O barrel em `node_modules/@dev-bruno/portfolio/index.js` usa caminhos `../../src/components/...`,
que resolvem para `node_modules/src/components/` (errado — faltam dois níveis).

**Solução aplicada:** `src/design-system.ts` na raiz do projeto serve como entry point real.
Isso faz o converter definir `PKG_DIR = project root`, resolvendo todos os paths corretamente.
Não alterar `"entry"` para apontar para o barrel do pacote scoped.

## Pre-step de compilação do CSS (buildCmd)

O `buildCmd` pré-compila o Tailwind CSS antes do bundle esbuild:

```
node_modules/.bin/tailwindcss -c tailwind.config.ts -i src/index.css -o .design-sync/compiled.css
```

- **Por quê é necessário:** o esbuild do converter não processa o Tailwind JIT diretamente
- **Output:** `.design-sync/compiled.css` (gitignored) → lido via `cssEntry`
- **Scope:** usa o content glob padrão do `tailwind.config.ts` (`./src/**/*.{ts,tsx}`), então inclui apenas classes usadas nos componentes reais
- **Nota:** `tokensGlob` foi removido do config — só funciona com `tokensPkg` setado e é silenciosamente ignorado sem ele

## CSS Variables não definidas no bundle (`[TOKENS_MISSING]`)

As seguintes CSS custom properties são referenciadas em componentes mas **não estão no bundle shipping** — são injetadas em runtime por shadcn/ui ou pelo tema Tailwind:

- `--tw-shadow-color` — Tailwind interno
- `--muted`, `--secondary`, `--muted-foreground`, `--primary-foreground` — shadcn/ui
- `--shadow-brutal` — definido em `src/index.css` via `@layer base`, resolvido pelo Tailwind em runtime

Esses são avisos não-bloqueantes. Componentes que dependem dessas vars renderizam com fallback.

## SocialIcons — blank em screenshot Playwright

`SocialIcons` usa `ScrollReveal` (Framer Motion + IntersectionObserver) que inicializa com `opacity: 0`.
O Playwright captura o screenshot após `networkidle`, antes do Framer Motion animar.

**Solução:** preview authada em `.design-sync/previews/SocialIcons.tsx` com CSS `!important`
para forçar `opacity: 1; transform: none` no wrapper. Re-usar esse approach para qualquer
componente que use `ScrollReveal` ou animação de entrada com opacity inicial zero.

## Imagens de projetos — migração para URL string

`src/data/projects.ts` importava estáticas `.webp`/`.png` que o esbuild do converter não consegue
processar (sem loader para `.webp`). Migrado para URL strings (`"/agencia-multi-br.webp"`, etc.)
e os arquivos foram copiados para `public/` para resolver via string.

Não reverter para imports estáticos nesses campos — a normalização já trata ambos os formatos.

## Utilitários Tailwind não pré-compilados

`border-4`, `shadow-brutal-sm/lg`, `shadow-neo`, `animate-slide-up` são documentados nas
conventions mas não estão no bundle CSS — os 7 componentes sincronizados não os usam,
então o Tailwind JIT não os incluiu. São classes válidas que requerem compilação completa.
