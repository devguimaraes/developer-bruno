# Repo Hygiene Pass — Design Spec

**Data:** 2026-04-08
**Status:** Draft
**Autor:** Claude Code + devguimaraes

---

## 1. Objetivo

Executar uma passagem de higiene no repositório `developer-bruno`, sem alterar regras de negócio nem criar features. O resultado é um repositório mais limpo, com documentação alinhada ao estado atual da stack.

## 2. Escopo

| # | Tarefa | Tipo |
|---|--------|------|
| 1 | Deletar docs com stack legada | Documentação |
| 2 | Reescrever DESIGN_SYSTEM_GUIDELINE.md | Documentação |
| 3 | Remover código morto e imports não usados | Código |
| 4 | Remover arquivos órfãos confirmados | Código |
| 5 | Remover dependências não usadas | Dependências |
| 6 | Gerar relatório classificado | Documentação |

**Fora do escopo:** Novas features, mudanças de regra de negócio, refatoração arquitetural.

## 3. Decisões do Usuário

- **Docs legados** (ARCHITECTURE.md, ARCHITECTURE_DESIGN_SYSTEM.md, BACKEND_DB_DESIGN_SYSTEM.md, PHASE1_IMPLEMENTATION.md, RUNTIME_FIXES.md): **Remover todos.**
- **DESIGN_SYSTEM_GUIDELINE.md:** **Reescrever do zero** refletindo stack atual.
- **Dependências:** **Analisar tudo** com verificação profunda.
- **Abordagem:** **Fase única** — relatório + execução de baixo risco em um ciclo.

## 4. Metodologia de Investigação

### 4.1 Evidência para "confirmado sem uso"

Para classificar um arquivo ou dep como "confirmado sem uso", deve atender TODOS:

1. Zero imports estáticos via `grep -r "from.*<path>"` e `grep -r "import.*<path>"` em `src/`
2. Zero imports dinâmicos via `grep -r "import("` em `src/`
3. Zero referência em Astro pages/components (verificar `client:*` directives)
4. Zero referência em configs (`astro.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, etc.)
5. Zero referência em testes (`src/**/*.test.*`, `src/test/`)

### 4.2 Classificação para "suspeito"

Qualquer item que NÃO passe em todos os critérios acima, especialmente:

- Imports dinâmicos (padrão `import()`)
- Uso via Astro content collections
- Uso em scripts (`scripts/`)
- Uso em CI/Husky hooks
- Uso indireto via wrapper (ex: `framer-motion` via `motion-components.tsx`)

### 4.3 Classificação de Risco

| Nível | Critério | Ação |
|-------|----------|------|
| **Baixo** | Confirmado sem uso por evidência reproduzível (5 critérios acima) | Executar agora |
| **Médio** | Suspeito — heurística indica não uso, mas não 100% confirmável | Listar no relatório, não executar |
| **Alto** | Risco de efeito colateral — dep com side-effects, tipo global, etc. | Listar, requer revisão manual do usuário |

## 5. Execução (Apenas Baixo Risco)

### Passo 1: Deletar docs legados

Arquivos a remover:
- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE_DESIGN_SYSTEM.md`
- `docs/BACKEND_DB_DESIGN_SYSTEM.md`
- `docs/PHASE1_IMPLEMENTATION.md`
- `docs/RUNTIME_FIXES.md`

**Risco:** Baixo. Referenciam stack Vite/Supabase/Deno completamente substituída.

### Passo 2: Reescrever DESIGN_SYSTEM_GUIDELINE.md

Nova versão deve refletir:
- **Stack:** Astro 5 (static SSG) + React 18 islands + TypeScript + Tailwind CSS
- **Fontes:** Jersey 15, Silkscreen (pixel/display), Newsreader (serif), Inter (sans), JetBrains Mono (mono)
- **Cores:** HSL tokens — primary (Parakeet green), secondary (Royal Lilac), accent (Freesia gold)
- **Efeitos:** GrainOverlay, CustomCursor, BorderGlow, BackgroundGrid
- **Sombras:** `shadow-brutal`, `shadow-brutal-sm`, `shadow-brutal-lg`
- **Componentes UI:** Lista real de `src/components/ui/`
- **Observabilidade:** Plausible Analytics (LGPD-compliant), não Google Analytics
- **Performance:** Budgets para redes brasileiras (3G/4G)

### Passo 3: Remover código morto confirmado

Apenas itens com evidência de zero uso. A investigação detalhada acontece durante a execução.

### Passo 4: Remover deps confirmadas

Apenas deps com zero import em todo o `src/`, configs e scripts.

### Passo 5: Validação

```bash
npm run lint          # Biome lint
npm run build         # TypeScript check via Astro build
npm run test:unit     # Vitest unit tests
```

Tudo deve passar verde.

## 6. Relatório de Saída

Gerado conforme template:

1. **Itens confirmados sem uso** — lista + evidência breve
2. **Itens suspeitos** — lista + por que é suspeito + como validar
3. **Documentação desatualizada** — arquivo, trecho, correção proposta
4. **Dependências candidatas à remoção** — pacote + evidência; confirmado vs suspeito
5. **Plano de ação por risco** — baixo: executado; médio/alto: pendente revisão
6. **Mudanças aplicadas** — diff resumido + arquivos tocados
7. **Validação final** — comandos e resultados

## 7. Critérios de Aceite

- [ ] DESIGN_SYSTEM_GUIDELINE.md reflete o estado atual do design system
- [ ] Docs legados removidos
- [ ] Relatório preenchido conforme 7 seções
- [ ] `npm run lint` verde
- [ ] `npm run build` verde
- [ ] `npm run test:unit` verde
- [ ] Nenhuma remoção sem classificação "confirmado" ou ticket de follow-up para "suspeitos"

## 8. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Falso-negativo (remover algo usado) | 5 critérios de evidência obrigatórios |
| Dep com side-effect (polyfill, global) | Classificar como médio/alto, não executar |
| Quebrar build ao remover dep | Validar com `npm run build` após cada remoção |
| Doc incompleto na reescrita | Basear em leitura do código real, não em memória |
