> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Análise Técnica Atual do Projeto

## 1. Visão Geral

O projeto é um portfólio pessoal construído com `Astro 5 + React islands + TypeScript + Tailwind CSS`, com foco em performance, legibilidade de conteúdo, direção visual autoral e manutenção relativamente simples.

A experiência publicada hoje combina:

- home imersiva e tipográfica
- vitrine de projetos curada
- blog editorial em tema escuro
- shell global com navegação fixa, granulado, smooth scroll e elementos de atmosfera digital

## 2. Stack Real em Uso

### Núcleo

- `Astro 5` para SSG e estrutura de rotas
- `React 18` para componentes interativos
- `TypeScript` com tipagem estrita
- `Tailwind CSS` para composição utilitária

### Experiência e UI

- `Framer Motion` para transições e reveals
- `GSAP` em efeitos textuais específicos
- `Lenis` para smooth scroll
- componentes visuais próprios como `GlassSurface`, `GlitchImage` e `GrainOverlay`

### Conteúdo e SEO

- `Astro Content Collections` para blog
- metadata estruturada em `Layout.astro`
- `Plausible` em produção

## 3. Estado Atual da Linguagem Visual

O site atual não deve mais ser lido como um sistema colorido em light mode ou como uma vitrine genérica de componentes brutalistas.

A leitura correta hoje é:

- `dark-first`
- alto contraste
- pixel-display + editorial serif
- linguagem de sistema
- direção de arte cinematográfica

Documentos canônicos para essa camada:

- [Identidade Visual Atual](./identidade-visual-atual.md)
- [Guia de Design Atual](./guia-de-design-atual.md)
- [Branding Guide Atual](./branding-guide-atual.md)

## 4. Estrutura Atual da Experiência

### Shell global

Em `src/layouts/Layout.astro`, a experiência ativa inclui:

- `PixelLoader`
- `CustomCursor`
- `SmoothScroll`
- `Navigation`
- `Footer`
- `Toaster`
- `GrainOverlay`

### Home

A composição real da home em `src/components/pages/Index.tsx` é:

1. `Hero`
2. `Projects`
3. `LatestPosts`
4. `About`
5. CTA final de contato

Importante:

- `Skills.tsx` existe, mas não integra a home atual
- `Contact.tsx` existe, mas não integra a home atual

### Blog

O blog hoje está alinhado com a linguagem escura e editorial do site:

- listagem em cards escuros
- posts com markdown dark theme
- metadata técnica compacta
- acento dourado em links e feedback

## 5. Pontos Fortes Atuais

### Coerência entre visual e posicionamento

O site transmite uma proposta clara: front-end com rigor técnico e direção visual consciente.

### Boa diferenciação

A combinação entre:

- preto dominante
- tipografia pixel-display
- microcopy de sistema
- vídeo e textura

torna a marca mais específica do que um portfólio padrão.

### Arquitetura simples o bastante para evoluir

Apesar de experimental na aparência, o app mantém uma estrutura relativamente compreensível:

- rotas Astro
- seções React bem separadas
- CSS central em `src/index.css`
- conteúdo de blog desacoplado

### Blog integrado à identidade

O blog não parece uma área separada do site; ele expande a mesma assinatura visual em registro mais editorial.

## 6. Pontos de Atenção Atuais

### 1. Documentação legada ainda existia em conflito

Parte da documentação histórica do projeto descrevia:

- stack antiga
- paleta antiga
- seções antigas da home
- componentes não mais centrais

Isso já foi reduzido com os novos guias, mas é um ponto importante de governança documental.

### 2. Há componentes legados fora do núcleo visual atual

Exemplos:

- `Skills.tsx`
- `Contact.tsx`

Eles não devem ser tratados automaticamente como referência para decisões de design sem revisão contextual.

### 3. A paleta `brutal` do Tailwind ainda existe como herança

O tema publicado hoje depende mais de:

- preto
- branco
- dourado
- opacidades

Do que da paleta brutal multicolorida definida historicamente no `tailwind.config.ts`.

## 7. Recomendações

### Curto prazo

1. Tratar os novos guias como referência única para identidade, design e branding.
2. Evitar reintroduzir cores e padrões antigos sem revisão completa.
3. Continuar tratando componentes fora da home atual como referências contextuais, não como padrão automático.

### Médio prazo

1. Revisar componentes legados que ainda carregam repertório visual de fases anteriores.
2. Consolidar o uso dos dados de projetos, caso a vitrine evolua além do array hardcoded atual.
3. Continuar separando claramente `conteúdo canônico atual` de `registro histórico`.

## 8. Conclusão

O projeto está em uma fase visual mais madura do que sugeriam alguns documentos legados. Hoje ele deve ser entendido como um portfólio autoral de front-end com experiência escura, técnica, editorial e altamente dirigida.

O principal ganho recente não foi apenas técnico, mas de clareza:

- o código já apontava para uma identidade consistente
- a documentação agora passa a acompanhar essa realidade

Se a evolução futura respeitar os novos guias e o código ativo como fonte de verdade, a tendência é aumentar consistência sem perder personalidade.
