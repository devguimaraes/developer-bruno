# DEV-36: Reativacao do Blog — Design Spec

**Data:** 2026-04-11
**Issue:** DEV-36 — Reativacao das postagens de BLOG
**Branch:** `devgmrs/dev-36-reativacao-das-postagens-de-blog`
**Abordagem:** Migracao para Astro 5 Content Collections API + redesign dark/editorial

---

## 1. Contexto e Problema

O projeto possui uma estrutura de blog completa (componentes React, paginas Astro, 4 posts em markdown), porem com dois problemas criticos:

1. **Geracao estatica quebrada:** As paginas individuais dos posts nao sao geradas como HTML estatico durante o build. O Astro 5 exige `src/content.config.ts` para definir colecoes, e esse arquivo nao existe. O warning "Auto-generating collections... deprecated" aparece no build.

2. **Dissonancia visual:** O blog atual usa estetica brutalista (fundo claro, `border-4`, `shadow-brutal-lg`) enquanto o restante do site e dark/editorial (`bg-black`, `type-raster`, `border-white/10`). O blog parece pertencer a outro site.

---

## 2. Arquitetura — Content Collections API

### Estado atual

- `import.meta.glob` carrega arquivos `.md` manualmente
- Parsing de frontmatter com regex customizado em `src/lib/blog/content.ts`
- `getAllBlogPosts()` faz tudo: carrega, parseia, ordena, cacheia
- Sem validacao de schema

### Estado proposto

```
src/content.config.ts          ← NOVO: colecao blog com schema Zod
src/lib/blog/index.ts          ← REFACTORED: usa getCollection() do Astro
src/lib/blog/content.ts        ← SIMPLIFICADO: apenas helpers (countWords, parseReadingTime)
src/content/blog/*.md          ← EXISTENTE: 4 posts + 2-3 novos
src/pages/blog/index.astro     ← REFINADO: passa dados via props, SSG
src/pages/blog/[slug].astro    ← REFINADO: getStaticPaths() com getCollection()
```

### Fluxo de dados

```
content.config.ts (schema Zod)
  -> Astro valida frontmatter no build (erro se campo obrigatorio faltar)
  -> getCollection('blog') retorna posts tipados
  -> [slug].astro gera HTML estatico para cada post
  -> Build output: /blog/post-slug/index.html
```

### Schema Zod

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    readTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Bruno Guimaraes'),
    excerpt: z.string(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

---

## 3. Layout e Componentes

### 3.1 Home — Secao "Latest Posts"

**Posicao:** Entre Projects e About (`Hero -> Projects -> LatestPosts -> About -> Contact`)

- Exibe os 3 posts mais recentes usando `getRecentPosts(3)`
- Layout horizontal com cards estilo `grayscale hover:grayscale-0`
- CTA no final: "VER TODOS OS POSTS ->" linkando para `/blog`
- Fundo `bg-black`, tipografia `type-raster-section` para titulo da secao
- Tags em `border border-white rounded-full type-mono text-[10px]`

### 3.2 Pagina /blog — Listagem com lazy loading

**Header:**
- Fundo `bg-black`, titulo raster gigante `type-raster-section text-[10vw]`
- Label mono: `// LATEST_POSTS` / `TOTAL: N`
- Separador `border-t border-white/10`

**Grid de posts:**
- Fundo escuro, sem cards com bordas grossas
- Cada post: thumbnail com `grayscale hover:grayscale-0`
- Titulo em raster, tags em `border border-white rounded-full type-mono`
- Hover: `hover:text-accent`, transicao suave

**Lazy loading (client-side):**
- Posts iniciais: 6 carregados automaticamente
- Botao "Carregar mais" exibe os proximos
- SSG estatico: todos os posts ja estao no HTML — toggle de visibilidade via React state

### 3.3 Pagina /blog/[slug] — Post individual

**Header do post:**
- Fundo `bg-black`, titulo em raster grande
- Metadata: `type-mono text-[10px]` com data, tempo de leitura, autor
- Separadores `border-white/10`
- Tags: `border border-white rounded-full`

**Conteudo markdown:**
- Fundo escuro `bg-black`, texto `text-white/90`
- Codigo: `bg-white/5 border border-white/10`
- Links: `hover:text-accent`
- Blockquotes: `border-l-2 border-accent`

**Navegacao entre posts:**
- Posts anterior/proximo com estilo dark
- Labels mono: `// PREVIOUS` / `// NEXT`

---

## 4. SEO Completo

### Meta tags

**Pagina /blog (listagem):**
- title: "Blog — Bruno Guimaraes | Desenvolvedor Front-end"
- description: "Artigos sobre React, Next.js, TypeScript e engenharia front-end."
- canonical: `https://devguimaraes.com.br/blog`
- OG: title, description, url, site_name, type=website, image

**Pagina /blog/[slug] (post individual):**
- title: dinamico do frontmatter
- description: dinamico do excerpt
- canonical: `https://devguimaraes.com.br/blog/{slug}`
- OG: title, description, url, type=article, published_time, tags, image
- Twitter Card: summary_large_image

### Schema Markup (JSON-LD)

- `BlogPosting` em cada post: title, datePublished, author, description, image
- `Blog` na listagem: name, description, url

### Heading Hierarchy

- Home (LatestPosts): `<h2>` "Latest Posts", `<h3>` para cada card
- Blog listagem: `<h1>` titulo da pagina, `<h2>` para cada card
- Post individual: `<h1>` titulo do post, `<h2>`-`<h4>` do markdown

### Sitemap

- Integracao `@astrojs/sitemap` ja existe — posts incluidos automaticamente apos SSG funcionar

---

## 5. Novos Posts

Adicionar 2-3 novos posts alem dos 4 existentes, com temas atuais relevantes para o mercado brasileiro de front-end. Mesmo formato de frontmatter, conteudo em portugues.

Frontmatter padronizado via schema Zod:
```yaml
title: string (obrigatorio)
date: string (obrigatorio, "DD MMM YYYY")
readTime: string (opcional, default calculado por word count)
tags: string[] (obrigatorio, minimo 1)
excerpt: string (obrigatorio)
image: string (opcional)
featured: boolean (opcional, default false)
```

---

## 6. Componentes — Resumo de Mudancas

| Componente | Acao | Mudanca principal |
|---|---|---|
| `src/content.config.ts` | NOVO | Schema Zod para colecao blog |
| `src/components/pages/BlogPage.tsx` | REESCREVER | Dark theme, raster titles, lazy loading |
| `src/components/pages/BlogPostPage.tsx` | REESCREVER | Dark theme, refined layout |
| `src/components/blog/BlogPostHeader.tsx` | REESCREVER | Raster title, mono metadata, dark |
| `src/components/blog/BlogPostContent.tsx` | REESCREVER | Dark markdown, code blocks |
| `src/components/blog/BlogPostNavigation.tsx` | REESCREVER | Dark cards, accent hover |
| `src/components/blog/BlogPostBackButton.tsx` | REESCREVER | Mono style, accent hover |
| `src/components/blog/BlogPostCardSkeleton.tsx` | REESCREVER | Dark skeleton |
| `src/components/blog/BlogPostLoadingSkeleton.tsx` | REESCREVER | Dark loading state |
| `src/components/blog/BlogPostNotFound.tsx` | REESCREVER | Dark 404 |
| `src/components/pages/LatestPosts.tsx` | NOVO | Secao Home com 3 posts recentes |
| `src/components/pages/Index.tsx` | EDITAR | Adicionar LatestPosts entre Projects e About |
| `src/lib/blog/index.ts` | REFACTORED | Usar getCollection() |
| `src/lib/blog/content.ts` | SIMPLIFICAR | Apenas helpers |
| `src/pages/blog/index.astro` | REFINAR | Passar dados via props |
| `src/pages/blog/[slug].astro` | REFINAR | getStaticPaths() com getCollection() |
| `src/layouts/Layout.astro` | VERIFICAR | Suporte a meta tags dinamicas para blog |

---

## 7. Testes e Validacao

- Testes unitarios existentes adaptados para `getCollection()`
- Build verification: cada post gera HTML estatico em `dist/blog/{slug}/index.html`
- Responsividade: mobile, tablet, desktop
- SEO: meta tags renderizadas no HTML estatico
- Lighthouse: performance, accessibility, SEO, best practices
