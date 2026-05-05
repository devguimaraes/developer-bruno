# developer-bruno (portfolio) — Plano de Implementação

> **Para agentes:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development ou superpowers:executing-plans para executar este plano task-by-task.

**Goal:** Implementar as 15 issues abertas do projeto developer-bruno (portfolio) seguindo a prioridade definida no Linear + dependências técnicas.

**Architecture:** Astro 6, React, TypeScript, Tailwind, testes Vitest/Playwright. Conteúdo em markdown + dados em `src/data/`.

**Tech Stack:** Astro 6, React, TypeScript, Tailwind, Vitest, Playwright, Biome

---

## Issues Open — Prioridade do Linear

| Prioridade | Issue | DEV | Título |
|:----------:|-------|-----|--------|
| 🔴 **Alta** | `2c38c025` | DEV-83 | Consolidar fonte de dados dos projetos |
| 🔴 **Alta** | `3e1df4b6` | DEV-84 | Criar páginas de case para projetos |
| 🔴 **Alta** | `7e231522` | DEV-85 | Respeitar prefers-reduced-motion |
| 🔴 **Alta** | `19a1ad06` | DEV-81 | i18n PT-BR/EN |
| 🟡 **Média** | `3693abbe` | DEV-75 | Refinar descrição dos projetos |
| 🟡 **Média** | `208260a8` | DEV-76 | Campo Role nos projetos |
| 🟡 **Média** | `5d6c611a` | DEV-77 | Refinar bio para nichos |
| 🟡 **Média** | `f09ee9ef` | DEV-78 | Seção práticas de engenharia |
| 🟡 **Média** | `8cf13cb4` | DEV-80 | CTA adicional após Selected Works |
| 🟡 **Média** | `2c857ebb` | DEV-82 | Links cruzados projeto ↔ posts |
| 🟡 **Média** | `1acb510e` | DEV-86 | Normalizar datas ISO no schema.org |
| 🟡 **Média** | `eca2f867` | DEV-87 | Auditar peso de mídia |
| 🟡 **Média** | `b73307c0` | DEV-88 | Ampliar cobertura E2E |
| ⚪ **Baixa** | `d7640c52` | DEV-62 | Favicon avatar do menu |
| ⚪ **Baixa** | `7b27a69f` | DEV-79 | Explicar labels editoriais |

---

## Grafo de Dependências

```
SPRINT 1 — Fundação + Independentes de Alta Prioridade
├── 🔴 DEV-83: Consolidar fonte de dados dos projetos (BLOQUEADOR)
├── 🔴 DEV-85: prefers-reduced-motion (independente)
├── 🟡 DEV-86: datas ISO no schema.org (independente)
└── 🟡 DEV-87: auditar peso de mídia (independente)

        ↓

SPRINT 2 — Projetos (dependem de DEV-83)
├── 🔴 DEV-84: páginas de case
├── 🟡 DEV-76: campo Role nos projetos
├── 🟡 DEV-75: refinar descrições dos projetos
├── 🟡 DEV-77: refinar bio
├── 🟡 DEV-78: seção práticas de engenharia
└── 🟡 DEV-80: CTA adicional após Selected Works

        ↓

SPRINT 3 — Conteúdo + Links
├── 🟡 DEV-82: links cruzados projeto ↔ posts (depende de DEV-84)
├── 🔴 DEV-81: i18n PT-BR/EN (conteúdo precisa estar estável)
├── ⚪ DEV-79: explicar labels editoriais
└── ⚪ DEV-62: favicon

        ↓

SPRINT 4 — Testes
└── 🟡 DEV-88: ampliar cobertura E2E (depende de tudo pronto)
```

---

## SPRINT 1 — Fundação + Independentes de Alta Prioridade

**Objetivo:** Resolver a task bloqueadora (DEV-83) + tasks independentes de alta prioridade em paralelo.

| # | Issue | DEV | Título | Depende de | Paralelo com | Complexidade |
|---|-------|-----|--------|------------|--------------|:------------:|
| 1.1 | `2c38c025` | DEV-83 | Consolidar fonte de dados dos projetos | — | 1.2, 1.3, 1.4 | M |
| 1.2 | `7e231522` | DEV-85 | Respeitar prefers-reduced-motion | — | 1.1, 1.3, 1.4 | M |
| 1.3 | `1acb510e` | DEV-86 | Normalizar datas ISO no schema.org | — | 1.1, 1.2, 1.4 | S |
| 1.4 | `eca2f867` | DEV-87 | Auditar peso de mídia | — | 1.1, 1.2, 1.3 | M |

### DEV-83: Consolidar fonte de dados dos projetos

**Problema:** Duas fontes de verdade conflitantes:
- `src/components/Projects.tsx` — lista hardcoded (Movies Bremen, Agência Multi BR, Danila Rizo)
- `src/data/projects.ts` — outra lista (Agência Multi BR, Engerod, SEMOGRJ, Luis Felipe Pereira, Movies Bremen)

**Critérios de aceite:**
- Única fonte de dados em `src/data/projects.ts`
- `Projects.tsx` consome essa fonte com filtro/ordenação para selected works
- Campos tipados: title, category, image, technologies, role, context, impact, relatedPosts, liveUrl
- Testes existentes continuam passando

### DEV-85: Respeitar prefers-reduced-motion

**Problema:** Home usa vídeo de fundo, parallax via Framer Motion, efeitos glitch, text reveal e animações de entrada.

**Critérios de aceite:**
- `prefers-reduced-motion: reduce` → versões estáticas ou suavizadas
- Vídeo de fundo, glitch/parallax e animações de texto têm fallback previsível
- Layout visualmente coerente sem animação
- Teste E2E ou unitário simulando reduced motion para hero e projetos

### DEV-86: Normalizar datas ISO no schema.org

**Problema:** Posts usam datas textuais como `30 ABR 2026` repassadas para `datePublished` no JSON-LD.

**Critérios de aceite:**
- `datePublished` e campos similares no JSON-LD usam formato ISO (`YYYY-MM-DD`)
- UI continua exibindo datas no formato editorial atual
- Ordenação dos posts usa função única e testada para parsing/normalização
- Teste unitário cobre datas em português e datas ISO

### DEV-87: Auditar peso de mídia

**Problema:** Home depende de vídeo de fundo, vídeo/avatar na bio, imagens grandes e efeitos visuais. `performanceBudget` existe em `src/config/site.ts` mas não há verificação automatizada.

**Critérios de aceite:**
- Assets críticos da home têm tamanho documentado e comparado ao `performanceBudget`
- Vídeos e imagens usam poster, lazy loading, dimensões estáveis e formatos modernos
- Validação Lighthouse ou Playwright trace documentada para mobile
- Regressões de peso/performance cobertas por script ou checklist no PR

---

## SPRINT 2 — Projetos (dependem de DEV-83)

**Objetivo:** Todas as melhorias nos projetos que dependem da fonte de dados consolidada.

| # | Issue | DEV | Título | Depende de | Paralelo com | Complexidade |
|---|-------|-----|--------|------------|--------------|:------------:|
| 2.1 | `3e1df4b6` | DEV-84 | Criar páginas de case para projetos | 1.1, 2.2 | 2.2, 2.3, 2.4, 2.5, 2.6 | L |
| 2.2 | `208260a8` | DEV-76 | Campo Role nos projetos | 1.1 | 2.1, 2.3, 2.4, 2.5, 2.6 | S |
| 2.3 | `3693abbe` | DEV-75 | Refinar descrição dos projetos | 1.1 | 2.1, 2.2, 2.4, 2.5, 2.6 | M |
| 2.4 | `5d6c611a` | DEV-77 | Refinar bio para nichos | — | 2.1, 2.2, 2.3, 2.5, 2.6 | S |
| 2.5 | `f09ee9ef` | DEV-78 | Seção práticas de engenharia | — | 2.1, 2.2, 2.3, 2.4, 2.6 | S |
| 2.6 | `8cf13cb4` | DEV-80 | CTA adicional após Selected Works | — | 2.1, 2.2, 2.3, 2.4, 2.5 | S |

### DEV-84: Criar páginas de case para projetos

**Problema:** Cards de `SELECTED_WORKS` apontam diretamente para sites externos, limitando storytelling, SEO e leitura de impacto.

**Critérios de aceite:**
- Cada projeto selecionado possui página interna de case (ex: `/projetos/movies-bremen`)
- Card da home prioriza navegação para o case interno e mantém link para o site live
- Páginas têm title/description próprios e schema estruturado adequado
- Cada case inclui contexto, role, decisões técnicas, impacto e CTA de contato
- Rotas inexistentes têm tratamento consistente com o 404 atual

### DEV-76: Campo Role nos projetos

**Problema:** Portfólio não deixa explícito se cada entrega foi solo, em equipe, com liderança front-end, etc.

**Critérios de aceite:**
- Todos os projetos exibidos possuem campo de papel/responsabilidade
- Texto diferencia implementação, liderança técnica, colaboração e escopo de decisão
- Campo tipado em TypeScript e coberto por teste unitário ou E2E simples

### DEV-75: Refinar descrição dos projetos

**Problema:** Projetos comunicam bem stack e categoria, mas não deixam claro problema de negócio, papel exercido e impacto.

**Critérios de aceite:**
- Cada projeto exibe: Contexto, Minha atuação, Impacto
- Pelo menos 1 resultado concreto ou qualitativo por projeto
- Layout preserva estética editorial atual sem comprom leitura em mobile
- Textos centralizados em fonte de dados reutilizável, não duplicados no JSX

### DEV-77: Refinar bio para nichos

**Problema:** Bio atual é ampla — falta posicionar tipos de produto prioritários.

**Critérios de aceite:**
- Bio menciona explicitamente 1–2 tipos de produto/negócio prioritários
- Texto conecta experiência com performance real, SEO técnico ou Core Web Vitals
- Tom continua editorial mas fica claro para clientes e recrutadores

### DEV-78: Seção práticas de engenharia

**Problema:** Site comunica stack técnica mas pouco mostra práticas de engenharia que diferenciam senioridade.

**Critérios de aceite:**
- Seção ou faixa curta listando práticas: Code review, Testing, CI/CD, Acessibilidade, Design handoff, SEO técnico, Colaboração
- Mantém densidade visual e estilo editorial da home
- Conteúdo deixa claro como o trabalho se integra com design, marketing e produto
- Navegável e legível em mobile

### DEV-80: CTA adicional após Selected Works

**Problema:** CTA forte aparece apenas no final da home — usuário precisa rolar tudo após ver projetos.

**Critérios de aceite:**
- CTA de contato logo após a seção de projetos, antes de Latest_posts
- Aponta para e-mail ou WhatsApp mantendo fluxo atual de contato
- Não compete visualmente com os cards de projeto
- Teste E2E valida presença e link do CTA intermediário

---

## SPRINT 3 — Conteúdo + Links

**Objetivo:** Links cruzados, internacionalização e tasks de baixa prioridade.

| # | Issue | DEV | Título | Depende de | Paralelo com | Complexidade |
|---|-------|-----|--------|------------|--------------|:------------:|
| 3.1 | `2c857ebb` | DEV-82 | Links cruzados projeto ↔ posts | 2.1 | — | M |
| 3.2 | `19a1ad06` | DEV-81 | i18n PT-BR/EN | Sprint 2 completa | 3.3, 3.4 | L |
| 3.3 | `7b27a69f` | DEV-79 | Explicar labels editoriais | — | 3.2, 3.4 | S |
| 3.4 | `d7640c52` | DEV-62 | Favicon avatar do menu | — | 3.2, 3.3 | S |

### DEV-82: Links cruzados projeto ↔ posts

**Problema:** Posts são fortes isoladamente, mas projetos não aproveitam conteúdo do blog para mostrar profundidade técnica.

**Critérios de aceite:**
- Cada projeto referencia pelo menos 1 post relevante do blog
- Links aparecem de forma discreta e visível (ex: "Leia como aplico isso")
- Links usam slugs reais dos posts existentes e não quebram build
- Relacionamento projeto-post modelado em dados, não hardcoded no componente

### DEV-81: i18n PT-BR/EN

**Problema:** Textos majoritariamente em português limitam leitura por recrutadores e clientes fora do Brasil.

**Critérios de aceite:**
- Usuário consegue alternar entre PT-BR e EN
- Hero, projetos, bio, CTAs, navegação e metadados principais têm tradução revisada
- URLs e canonical/hreflang tratados corretamente para SEO
- Implementação não duplica componentes sem necessidade

### DEV-79: Explicar labels editoriais

**Problema:** Labels como `POS`, `VER`, `STREAM_BIO_03`, `SCROLL_FOR_MORE` podem gerar ruído para clientes menos técnicos.

**Critérios de aceite:**
- Labels não óbvios possuem explicação breve via `title`, `aria-label`, tooltip acessível ou texto contextual
- Estética editorial preservada
- Explicações não poluem a interface
- Validação de acessibilidade básica para teclado/leitor de tela

### DEV-62: Favicon avatar do menu

**Problema:** Favicon atual não usa a mesma imagem de avatar exibida no menu.

**Critérios de aceite:**
- Favicon atualizado para usar imagem do avatar do menu
- Funciona em todos os browsers e tamanhos (16x16, 32x32, 180x180 apple-touch-icon)

---

## SPRINT 4 — Testes

**Objetivo:** Ampliar cobertura E2E para validar todo o conteúdo estratégico implementado.

| # | Issue | DEV | Título | Depende de | Complexidade |
|---|-------|-----|--------|------------|:------------:|
| 4.1 | `b73307c0` | DEV-88 | Ampliar cobertura E2E | Sprint 3 completa | M |

### DEV-88: Ampliar cobertura E2E

**Problema:** `src/test/e2e/home.spec.ts` cobre carregamento básico mas precisa validar conteúdo estratégico novo.

**Critérios de aceite:**
- E2E valida presença dos campos estratégicos dos projetos (role, contexto, impacto)
- E2E valida CTA intermediário após `SELECTED_WORKS`
- E2E valida pelo menos um link cruzado projeto-blog
- Testes rodam em desktop e mobile sem flakiness relevante
- Testes evitam acoplamento excessivo a microcopy instável

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de issues | 15 |
| Issues paralelizáveis | 8 (53%) |
| Issues bloqueadoras | 1 (DEV-83: consolidar dados) |
| Estimativa total | 4 sprints |
| Maior risco | DEV-84 (páginas de case) e DEV-81 (i18n) — ambos complexidade L |

### Regras de Priorização Aplicadas

1. **Prioridade Alta do Linear primeiro** — DEV-83, 84, 85, 81 têm precedência
2. **Dependências técnicas respeitadas** — DEV-83 bloqueia 75, 76, 84; DEV-84 bloqueia 82
3. **Independentes rodam em paralelo** — DEV-85, 86, 87 não bloqueiam nem são bloqueadas
4. **i18n depois do conteúdo estável** — DEV-81 no Sprint 3 para evitar retradução
5. **E2E no final** — DEV-88 testa tudo que já foi implementado
6. **Baixa prioridade encaixada** — DEV-62 e DEV-79 no Sprint 3 (rápidas, não bloqueiam)
