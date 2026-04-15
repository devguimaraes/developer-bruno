# Decap CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar Decap CMS ao portfólio para gerenciar posts do blog via interface web, sem custo de infraestrutura.

**Architecture:** Decap CMS carregado via CDN em `/admin`, usando GitHub como backend (OAuth PKCE, sem servidor). Posts do blog são editados como markdown com frontmatter, commitados direto na branch `main`. O Vercel faz build automático a cada push. Projetos ficam fora do escopo inicial — o componente `Projects.tsx` tem dados hardcoded e `src/data/projects.ts` não é importado pelo app.

**Tech Stack:** Decap CMS v3 (CDN), Astro v5 Content Collections, GitHub OAuth PKCE, Vercel SSG

**Execução:** Time de 3 agents em paralelo — Track A (CMS files), Track B (Blog schema), Track C (Validation)

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `public/admin/index.html` | **Criar** | Ponto de entrada do Decap CMS |
| `public/admin/config.yml` | **Criar** | Configuração do CMS (backend, collections, fields) |
| `src/content.config.ts` | **Modificar** | Atualizar schema Zod do blog (remover `readTime`, ajustar `author`) |
| `src/lib/blog/index.ts` | **Modificar** | Adaptar `getAllBlogPosts` para novo schema (calcular readTime automaticamente) |

**Não são modificados:** `Projects.tsx`, `src/data/projects.ts` (dados hardcoded, não importados — projetos fora do escopo).

---

## Track A: CMS Admin Files (Agent `cms-admin`)

Independente — cria os arquivos estáticos do Decap CMS.

### Task 1: Criar `public/admin/index.html`

**Files:**
- Create: `public/admin/index.html`

- [ ] **Step 1: Criar o HTML de entrada do CMS**

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Admin | Bruno Guimarães</title>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </head>
  <body>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add public/admin/index.html
git commit -m "feat(cms): add Decap CMS admin entry point"
```

### Task 2: Criar `public/admin/config.yml`

**Files:**
- Create: `public/admin/config.yml`

- [ ] **Step 1: Criar configuração completa do CMS**

```yaml
backend:
  name: github
  repo: devguimaraes/developer-bruno
  branch: main
  auth_type: pkce

media_folder: public/uploads
public_folder: /uploads

locale: pt-BR

collections:
  - name: blog
    label: Blog
    folder: src/content/blog
    create: true
    slug: "{{slug}}"
    preview_path: blog/{{slug}}
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Data, name: date, widget: datetime, format: "YYYY-MM-DD" }
      - { label: Tags, name: tags, widget: list, allow_add: true }
      - { label: Resumo, name: excerpt, widget: text }
      - { label: Destacado, name: featured, widget: boolean, default: false }
      - { label: Imagem, name: image, widget: image, required: false }
      - { label: Autor, name: author, widget: string, default: "Bruno Guimarães" }
      - { label: Conteúdo, name: body, widget: markdown }
```

- [ ] **Step 2: Commit**

```bash
git add public/admin/config.yml
git commit -m "feat(cms): add Decap CMS configuration with blog collection"
```

---

## Track B: Blog Schema Adaptation (Agent `blog-schema`)

Depende de entender o schema atual. Adapta o content config e as utilities do blog para funcionar com o CMS.

### Task 3: Atualizar schema Zod do blog

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Atualizar schema do blog**

Remover `readTime` do schema (será calculado automaticamente pelo build). O CMS não gera esse campo.

```typescript
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    readTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Bruno Guimarães"),
    excerpt: z.string(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Nota:** O schema permanece idêntico — `readTime` como optional já está correto. Posts existentes com `readTime` continuam funcionando. Posts novos via CMS terão `readTime` calculado pela utility `countWords`. Verificar apenas que `author` tem default `"Bruno Guimarães"` (com acento).

- [ ] **Step 2: Rodar build para validar**

Run: `npm run build`
Expected: Build passa sem erros

- [ ] **Step 3: Commit se houve mudança (se author já estava correto, pular)**

```bash
git add src/content.config.ts
git commit -m "fix(cms): normalize blog author default with accent"
```

### Task 4: Adaptar utilities do blog para calcular readTime

**Files:**
- Modify: `src/lib/blog/index.ts`

- [ ] **Step 1: Atualizar `getAllBlogPosts` para calcular readTime automaticamente**

A função precisa usar `countWords` do `content.ts` para calcular o readTime quando o campo não estiver presente no frontmatter. Isso garante compatibilidade com posts criados pelo CMS (sem readTime) e posts existentes (com readTime manual).

```typescript
import { getCollection, render } from 'astro:content';
import { countWords, parseReadingTime } from './content';
import type { BlogPost } from '@/types/blog';

export type { BlogPost } from '@/types/blog';

export function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function convertBrazilianDate(dateStr: string): Date {
  const months: Record<string, number> = {
    JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
    JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11,
  };

  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = Number.parseInt(parts[0], 10);
    const month = months[parts[1].toUpperCase()] ?? 0;
    const year = Number.parseInt(parts[2], 10);
    if (!Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  return new Date(dateStr);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  const posts: BlogPost[] = [];

  for (const entry of entries) {
    const rendered = await render(entry);
    const rawContent = rendered.rawContent ?? '';
    const wordCount = countWords(rawContent);
    const readTime = entry.data.readTime || `${Math.ceil(wordCount / 200)} min`;

    posts.push({
      id: entry.id,
      slug: entry.id,
      title: entry.data.title,
      date: entry.data.date,
      readTime,
      readingTime: parseReadingTime(readTime),
      wordCount,
      tags: entry.data.tags,
      author: entry.data.author,
      excerpt: entry.data.excerpt,
      content: '',
      image: entry.data.image,
      featured: entry.data.featured,
    });
  }

  posts.sort(
    (a, b) => convertBrazilianDate(b.date).getTime() - convertBrazilianDate(a.date).getTime(),
  );
  return posts;
}

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
```

**Mudança chave:** Usa `render(entry)` para obter o conteúdo raw do markdown e calcula `wordCount` e `readTime` automaticamente quando não existe no frontmatter.

- [ ] **Step 2: Rodar build para validar**

Run: `npm run build`
Expected: Build passa, posts existentes mantêm readTime manual, novo campo `wordCount` populado

- [ ] **Step 3: Rodar testes**

Run: `npx vitest run`
Expected: Todos os 31 testes passando

- [ ] **Step 4: Commit**

```bash
git add src/lib/blog/index.ts
git commit -m "feat(cms): auto-calculate readTime and wordCount for CMS posts"
```

---

## Track C: Validation & Integration (Agent `cms-validation`)

Depende de Track A e Track B estarem completos. Valida que tudo funciona junto.

### Task 5: Build final e validação completa

**Files:**
- Nenhum arquivo novo

- [ ] **Step 1: Rodar build completo**

Run: `npm run build`
Expected: 10+ páginas geradas, sitemap criado, sem erros

- [ ] **Step 2: Rodar lint**

Run: `npm run lint`
Expected: Sem erros

- [ ] **Step 3: Rodar testes**

Run: `npx vitest run`
Expected: 31 testes passando

- [ ] **Step 4: Verificar que `/admin/index.html` está no build**

Run: `ls dist/admin/index.html`
Expected: Arquivo existe no diretório de build

- [ ] **Step 5: Verificar que config.yml está acessível**

Run: `cat dist/admin/config.yml | head -5`
Expected: Conteúdo do config.yml presente

---

## Execution Plan (Team of Agents)

```
Track A (cms-admin):    Task 1 → Task 2          [Independente]
Track B (blog-schema):  Task 3 → Task 4          [Independente]
Track C (cms-validation): Task 5                  [Depende de A + B]
```

### Parallel Dispatch

| Agente | Tasks | Bloqueia | Pode iniciar imediatamente |
|--------|-------|----------|--------------------------|
| `cms-admin` | 1, 2 | Track C | Sim |
| `blog-schema` | 3, 4 | Track C | Sim |
| `cms-validation` | 5 | Nenhum | Após A + B completarem |

### Coordenação

- `cms-admin` e `blog-schema` executam em paralelo
- `cms-validation` inicia quando ambos terminam
- Team lead faz merge dos resultados e build final

---

## Pós-Implementação (Manual)

Estes passos requerem ação manual do usuário no GitHub e Vercel:

1. **GitHub OAuth App:** Criar OAuth App em GitHub Settings > Developer settings
   - Authorization callback URL: `https://api.netlify.com/auth/done` (padrão Decap CMS)
   - Homepage URL: `https://devguimaraes.com.br`
2. **Vercel:** Não requer nenhuma configuração adicional — os arquivos estáticos em `public/admin/` são servidos automaticamente
3. **Testar:** Acessar `https://devguimaraes.com.br/admin` e autenticar com GitHub
4. **Criar post de teste:** Verificar que o markdown gerado está correto e o build passa
