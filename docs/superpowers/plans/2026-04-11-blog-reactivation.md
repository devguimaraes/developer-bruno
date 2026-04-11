# Blog Reactivation (DEV-36) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reativar o blog com geracao estatica funcional, design dark/editorial alinhado ao site, SEO completo e 3 novos posts.

**Architecture:** Migrar de `import.meta.glob` + parsing manual para Astro 5 Content Collections API com schema Zod. Componentes React redesenhados com tema dark/editorial. Lazy loading client-side na listagem.

**Tech Stack:** Astro 5 Content Collections (defineCollection, glob loader, getCollection, render), Zod, React 18, Framer Motion, Tailwind CSS.

**Worktree:** `.worktrees/dev-36-blog` (branch `devgmrs/dev-36-reativacao-das-postagens-de-blog`)

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/content.config.ts` | CREATE | Schema Zod + glob loader para colecao blog |
| `src/lib/blog/index.ts` | REWRITE | Funcoes helper usando getCollection() |
| `src/lib/blog/content.ts` | SIMPLIFY | Apenas countWords e parseReadingTime |
| `src/types/blog.ts` | EDIT | Atualizar tipos para alinhar com schema Zod |
| `src/pages/blog/index.astro` | EDIT | Usar getCollection(), passar dados como props |
| `src/pages/blog/[slug].astro` | EDIT | Usar getCollection() + render() no getStaticPaths |
| `src/components/blog/BlogPostHeader.tsx` | REWRITE | Dark theme, raster title, mono metadata |
| `src/components/blog/BlogPostContent.tsx` | REWRITE | Dark markdown, usar HTML renderizado pelo Astro |
| `src/components/blog/BlogPostNavigation.tsx` | REWRITE | Dark cards, accent hover, mono labels |
| `src/components/blog/BlogPostBackButton.tsx` | REWRITE | Mono style, accent hover |
| `src/components/blog/BlogPostCardSkeleton.tsx` | REWRITE | Dark skeleton |
| `src/components/blog/BlogPostLoadingSkeleton.tsx` | REWRITE | Dark loading state |
| `src/components/blog/BlogPostNotFound.tsx` | REWRITE | Dark 404 |
| `src/components/blog/index.ts` | EDIT | Atualizar exports se necessario |
| `src/components/pages/BlogPage.tsx` | REWRITE | Dark theme, raster titles, lazy loading |
| `src/components/pages/BlogPostPage.tsx` | REWRITE | Dark theme, receber HTML renderizado |
| `src/components/pages/LatestPosts.tsx` | CREATE | Secao Home com 3 posts recentes |
| `src/components/pages/Index.tsx` | EDIT | Adicionar LatestPosts entre Projects e About |
| `src/styles/markdown.css` | EDIT | Variaveis dark por padrao (remover tema claro) |
| `src/lib/typography.ts` | EDIT | Cores dark para markdown classes |
| `src/content/blog/react-19-server-components.md` | CREATE | Novo post 1 |
| `src/content/blog/interfaces-inteligentes-ia.md` | CREATE | Novo post 2 |
| `src/content/blog/engenharia-interface-2026.md` | CREATE | Novo post 3 |
| `src/lib/blog/content.test.ts` | EDIT | Manter testes de countWords/parseReadingTime |
| `src/lib/blog/blog.test.ts` | EDIT | Atualizar testes de generateSlug |

---

### Task 1: Content Collections Setup

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Criar content.config.ts com schema Zod e glob loader**

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
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

- [ ] **Step 2: Rodar build para verificar que o warning de deprecated desaparece**

Run: `npm run build 2>&1 | grep -i "deprecated\|content"`

Expected: Nenhum warning sobre "Auto-generating collections". O build pode falhar se os posts existentes tiverem frontmatter invalido — corrigir os frontmatters se necessario.

- [ ] **Step 3: Verificar que os posts existentes tem os campos obrigatorios**

Ler cada post em `src/content/blog/` e confirmar que todos tem `title`, `date`, `excerpt`. Os posts existentes usam `readTime` e `tags` que sao opcionais/default no schema.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add content.config.ts with blog collection schema"
```

---

### Task 2: Refatorar Data Layer

**Files:**
- Modify: `src/lib/blog/index.ts`
- Modify: `src/lib/blog/content.ts`
- Modify: `src/types/blog.ts`
- Modify: `src/lib/blog/content.test.ts`
- Modify: `src/lib/blog/blog.test.ts`

- [ ] **Step 1: Atualizar src/types/blog.ts**

Substituir o conteudo por tipos que espelham o schema Zod, adicionando `ContentCollectionEntry` para tipar os resultados de getCollection:

```typescript
// src/types/blog.ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  excerpt: string;
  content: string;
  image?: string;
  featured?: boolean;
  readingTime?: number;
  wordCount?: number;
}
```

- [ ] **Step 2: Simplificar src/lib/blog/content.ts**

Remover `parseBlogContent`, `parseFrontmatter`, `parseFrontmatterValue`, `stripWrappingQuotes`, `asNonEmptyString`, `asStringArray`, `asBoolean`. Manter apenas `countWords`, `parseReadingTime` e `ParseFrontmatterResult`/`BlogFrontmatter` se necessario por outros consumidores. Remover interfaces nao usadas:

```typescript
// src/lib/blog/content.ts
export function parseReadingTime(readTime?: string): number | undefined {
  if (!readTime) return undefined;
  const match = readTime.match(/\d+/);
  if (!match) return undefined;
  const minutes = Number.parseInt(match[0], 10);
  return Number.isNaN(minutes) ? undefined : minutes;
}

export function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_~-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
```

- [ ] **Step 3: Reescrever src/lib/blog/index.ts**

Usar `getCollection()` do Astro ao inves de `import.meta.glob`. Manter `generateSlug` e as funcoes publicas com mesma assinatura:

```typescript
// src/lib/blog/index.ts
import { getCollection } from 'astro:content';
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

function collectionEntryToBlogPost(entry: { id: string; data: Record<string, unknown> }): BlogPost {
  const data = entry.data;
  const slug = entry.id;
  const readTime = (data.readTime as string) || '5 min';
  const excerpt = (data.excerpt as string) || '';
  const wordCount = typeof data.wordCount === 'number' ? data.wordCount : 0;

  return {
    id: slug,
    slug,
    title: (data.title as string) || 'Sem titulo',
    date: (data.date as string) || '',
    readTime,
    readingTime: parseReadingTime(readTime),
    tags: Array.isArray(data.tags) ? data.tags as string[] : [],
    author: (data.author as string) || 'Bruno Guimaraes',
    excerpt,
    content: '',
    image: data.image as string | undefined,
    featured: (data.featured as boolean) || false,
    wordCount,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  const posts = entries.map(collectionEntryToBlogPost);
  posts.sort((a, b) => {
    const dateA = convertBrazilianDate(a.date);
    const dateB = convertBrazilianDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
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

**Nota:** `collectionEntryToBlogPost` recebe o `entry` com `id` e `data`. O Astro 5 Content Collections retorna `{ id, data }` onde `id` e o nome do arquivo sem extensao e `data` e o frontmatter validado pelo Zod. O `content` (markdown bruto) nao e passado aqui — sera renderizado pelo Astro via `render()` na pagina `[slug].astro`.

- [ ] **Step 4: Atualizar testes em src/lib/blog/content.test.ts**

Remover testes de `parseBlogContent` (funcao removida). Manter testes de `countWords` e `parseReadingTime`:

```typescript
import { describe, expect, it } from 'vitest';
import { countWords, parseReadingTime } from './content';

describe('parseReadingTime', () => {
  it('parses reading time from label', () => {
    expect(parseReadingTime('12 min')).toBe(12);
    expect(parseReadingTime('aprox. 4 minutos')).toBe(4);
    expect(parseReadingTime('sem numero')).toBeUndefined();
  });
});

describe('countWords', () => {
  it('counts markdown words ignoring formatting tokens', () => {
    const markdown = `# Heading\n\nTexto **forte** com \`inline\` e lista:\n- item um\n- item dois`;
    expect(countWords(markdown)).toBeGreaterThan(6);
  });
});
```

- [ ] **Step 5: Atualizar testes em src/lib/blog/blog.test.ts**

Manter testes de `generateSlug` (funcao preservada). Remover imports de funcoes que nao existem mais:

```typescript
import { describe, it, expect } from 'vitest';
import { generateSlug } from '.';

describe('Blog Utils', () => {
  describe('generateSlug', () => {
    it('should convert filename to simple slug', () => {
      expect(generateSlug('meu-post.md')).toBe('meu-post');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Post com Acentuacao!.md')).toBe('post-com-acentuacao');
    });

    it('should remove file extension', () => {
      expect(generateSlug('react-hooks.md')).toBe('react-hooks');
    });

    it('should lowercase everything', () => {
      expect(generateSlug('UPPERCASE-POST.md')).toBe('uppercase-post');
    });
  });
});
```

- [ ] **Step 6: Rodar testes para verificar que passam**

Run: `npm run test:unit`

Expected: Todos os testes passando. Testes de `parseBlogContent` foram removidos, testes de `countWords`, `parseReadingTime` e `generateSlug` continuam passando.

- [ ] **Step 7: Commit**

```bash
git add src/lib/blog/ src/types/blog.ts
git commit -m "refactor: migrate blog data layer to Astro Content Collections"
```

---

### Task 3: Atualizar Paginas Astro

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Atualizar src/pages/blog/index.astro**

Usar `getCollection()` ao inves de `getAllBlogPosts()`:

```astro
---
import Layout from '@/layouts/Layout.astro';
import BlogPageClient from '@/components/pages/BlogPage';
import { getCollection } from 'astro:content';
import { countWords, parseReadingTime } from '@/lib/blog/content';
import type { BlogPost } from '@/types/blog';

const entries = await getCollection('blog');

const posts: BlogPost[] = entries.map((entry) => ({
  id: entry.id,
  slug: entry.id,
  title: entry.data.title,
  date: entry.data.date,
  readTime: entry.data.readTime || '5 min',
  readingTime: parseReadingTime(entry.data.readTime),
  tags: entry.data.tags,
  author: entry.data.author,
  excerpt: entry.data.excerpt,
  content: '',
  image: entry.data.image,
  featured: entry.data.featured,
}));

// Sort by date descending (Brazilian date format "DD MMM YYYY")
const months: Record<string, number> = {
  JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
  JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11,
};
posts.sort((a, b) => {
  const parseDate = (d: string) => {
    const parts = d.split(' ');
    if (parts.length === 3) return new Date(Number(parts[2]), months[parts[1].toUpperCase()] ?? 0, Number(parts[0]));
    return new Date(d);
  };
  return parseDate(b.date).getTime() - parseDate(a.date).getTime();
});
---

<Layout
  title="Blog"
  description="Artigos sobre React, Next.js, TypeScript e engenharia front-end por Bruno Guimaraes."
>
  <BlogPageClient initialPosts={posts} client:load />
</Layout>
```

- [ ] **Step 2: Atualizar src/pages/blog/[slug].astro**

Usar `getCollection()` + `render()` no `getStaticPaths()`. O markdown e renderizado pelo Astro nativamente, eliminando a dependencia de `react-markdown`:

```astro
---
import Layout from '@/layouts/Layout.astro';
import BlogPostPageClient from '@/components/pages/BlogPostPage';
import { getCollection, render } from 'astro:content';
import type { BlogPost } from '@/types/blog';

export async function getStaticPaths() {
  const entries = await getCollection('blog');
  const sortedEntries = [...entries].sort((a, b) => {
    const months: Record<string, number> = {
      JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
      JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11,
    };
    const parseDate = (d: string) => {
      const parts = d.split(' ');
      if (parts.length === 3) return new Date(Number(parts[2]), months[parts[1].toUpperCase()] ?? 0, Number(parts[0]));
      return new Date(d);
    };
    return parseDate(b.data.date).getTime() - parseDate(a.data.date).getTime();
  });

  return sortedEntries.map((entry, index) => ({
    params: { slug: entry.id },
    props: {
      post: {
        id: entry.id,
        slug: entry.id,
        title: entry.data.title,
        date: entry.data.date,
        readTime: entry.data.readTime || '5 min',
        tags: entry.data.tags,
        author: entry.data.author,
        excerpt: entry.data.excerpt,
        content: '',
        image: entry.data.image,
        featured: entry.data.featured,
      } satisfies BlogPost,
      previous: index > 0 ? {
        id: sortedEntries[index - 1].id,
        slug: sortedEntries[index - 1].id,
        title: sortedEntries[index - 1].data.title,
        date: sortedEntries[index - 1].data.date,
        readTime: sortedEntries[index - 1].data.readTime || '5 min',
        tags: sortedEntries[index - 1].data.tags,
        author: sortedEntries[index - 1].data.author,
        excerpt: sortedEntries[index - 1].data.excerpt,
        content: '',
      } satisfies BlogPost : null,
      next: index < sortedEntries.length - 1 ? {
        id: sortedEntries[index + 1].id,
        slug: sortedEntries[index + 1].id,
        title: sortedEntries[index + 1].data.title,
        date: sortedEntries[index + 1].data.date,
        readTime: sortedEntries[index + 1].data.readTime || '5 min',
        tags: sortedEntries[index + 1].data.tags,
        author: sortedEntries[index + 1].data.author,
        excerpt: sortedEntries[index + 1].data.excerpt,
        content: '',
      } satisfies BlogPost : null,
      Content: (await render(entry)).Content,
    },
  }));
}

const { post, previous, next, Content } = Astro.props;
---

<Layout
  title={post.title}
  description={post.excerpt}
  structuredData={{
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.date,
  }}
>
  <BlogPostPageClient
    post={post}
    previous={previous}
    next={next}
    client:load
  >
    <Content />
  </BlogPostPageClient>
</Layout>
```

**Nota:** O componente `<Content />` e renderizado pelo Astro nativamente — sem react-markdown. Ele e passado como slot para o `BlogPostPageClient`.

- [ ] **Step 3: Rodar build para verificar geracao estatica**

Run: `npm run build 2>&1 | tail -30`

Expected: Build sem erros. Verificar que `dist/blog/` contem diretorios para cada post com `index.html`.

Run: `find dist -path "*/blog/*/index.html" | sort`

Expected: Deve listar HTMLs para cada post, ex:
```
dist/blog/css-grid-moderno/index.html
dist/blog/react-server-components/index.html
dist/blog/shai-hulud-detector/index.html
dist/blog/typescript-performance/index.html
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: update blog pages to use Astro Content Collections"
```

---

### Task 4: Redesenhar Componentes do Post Individual

**Files:**
- Rewrite: `src/components/blog/BlogPostHeader.tsx`
- Rewrite: `src/components/blog/BlogPostContent.tsx`
- Rewrite: `src/components/blog/BlogPostNavigation.tsx`
- Rewrite: `src/components/blog/BlogPostBackButton.tsx`
- Modify: `src/components/blog/index.ts`
- Modify: `src/components/pages/BlogPostPage.tsx`
- Modify: `src/styles/markdown.css`
- Modify: `src/lib/typography.ts`

- [ ] **Step 1: Reescrever BlogPostHeader.tsx com dark theme**

```tsx
// src/components/blog/BlogPostHeader.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 sm:mb-12"
    >
      <h1 className="type-raster-section text-[clamp(1.9rem,8vw,3rem)] md:text-4xl lg:text-5xl text-white leading-tight mb-6">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-b border-white/10 py-4 mb-6">
        <div className="flex items-center gap-2 type-mono text-[10px] text-white/60 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center gap-2 type-mono text-[10px] text-white/60 uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          <span>{post.readTime}</span>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="border border-white text-white px-3 py-1.5 rounded-full type-mono text-[10px] uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.header>
  );
}
```

- [ ] **Step 2: Reescrever BlogPostContent.tsx — receber HTML renderizado via slot**

O conteudo agora vem como slot do Astro, nao mais como markdown bruto. O componente apenas envolve o slot com animacao e classes de tipografia dark:

```tsx
// src/components/blog/BlogPostContent.tsx
import { motion } from 'framer-motion';

export function BlogPostContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white prose-headings:font-bold
        prose-p:text-white/90 prose-p:leading-relaxed
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-code:text-accent prose-code:bg-white/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
        prose-blockquote:border-l-accent prose-blockquote:text-white/70
        prose-li:text-white/90
        prose-hr:border-white/10
        prose-img:rounded"
    >
      {children}
    </motion.article>
  );
}
```

- [ ] **Step 3: Reescrever BlogPostNavigation.tsx com dark theme**

```tsx
// src/components/blog/BlogPostNavigation.tsx
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogPostNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export function BlogPostNavigation({ previous, next }: BlogPostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-16 pt-8 border-t border-white/10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previous && (
          <a
            href={`/blog/${previous.slug}`}
            className="group flex flex-col gap-3 p-5 border border-white/10 hover:border-accent/50 transition-colors"
          >
            <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" />
              // PREVIOUS
            </div>
            <h3 className="font-bold text-white group-hover:text-accent transition-colors">
              {previous.title}
            </h3>
          </a>
        )}
        {next && (
          <a
            href={`/blog/${next.slug}`}
            className="group flex flex-col gap-3 p-5 border border-white/10 hover:border-accent/50 transition-colors text-left md:text-right md:ml-auto"
          >
            <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center md:justify-end gap-1">
              // NEXT
              <ChevronRight className="w-3 h-3" />
            </div>
            <h3 className="font-bold text-white group-hover:text-accent transition-colors">
              {next.title}
            </h3>
          </a>
        )}
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 4: Reescrever BlogPostBackButton.tsx com mono style**

```tsx
// src/components/blog/BlogPostBackButton.tsx
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export function BlogPostBackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <a
        href="/blog"
        className="inline-flex items-center gap-2 type-mono text-[10px] text-white/40 hover:text-accent transition-colors uppercase tracking-widest py-1"
      >
        <ArrowLeft className="w-3 h-3" />
        // BACK_TO_BLOG
      </a>
    </motion.div>
  );
}
```

- [ ] **Step 5: Reescrever BlogPostPage.tsx — aceitar children (slot) em vez de content string**

```tsx
// src/components/pages/BlogPostPage.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { BlogPostHeader, BlogPostContent, BlogPostNavigation, BlogPostBackButton } from '../blog';

interface BlogPostPageClientProps {
  post: BlogPost;
  previous: BlogPost | null;
  next: BlogPost | null;
  children: React.ReactNode;
}

const BlogPostPage: React.FC<BlogPostPageClientProps> = ({ post, previous, next, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-clip bg-black"
    >
      <div className="container mx-auto px-4 py-20 sm:py-24 md:py-28 max-w-4xl">
        <BlogPostBackButton />
        <BlogPostHeader post={post} />
        <BlogPostContent>{children}</BlogPostContent>
        <BlogPostNavigation previous={previous} next={next} />
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
```

- [ ] **Step 6: Atualizar markdown.css para dark por padrao**

Substituir o conteudo de `src/styles/markdown.css` para usar cores dark por padrao (o site inteiro e dark):

```css
/* Markdown Theme Styles — Dark Editorial */
[data-markdown-content] {
  color: hsl(0 0% 90%);
}

[data-markdown-content] h1,
[data-markdown-content] h2,
[data-markdown-content] h3,
[data-markdown-content] h4,
[data-markdown-content] h5,
[data-markdown-content] h6 {
  color: hsl(0 0% 100%);
  font-weight: bold;
}

[data-markdown-content] p {
  color: hsl(0 0% 90%);
}

[data-markdown-content] code {
  background-color: hsl(0 0% 100% / 0.05);
  color: hsl(0 0% 100%);
}

[data-markdown-content] pre {
  background-color: hsl(0 0% 100% / 0.05);
  color: hsl(0 0% 100%);
  border: 1px solid hsl(0 0% 100% / 0.1);
}

[data-markdown-content] blockquote {
  color: hsl(0 0% 70%);
  border-left-color: hsl(var(--accent));
}

[data-markdown-content] a {
  color: hsl(var(--accent));
}

[data-markdown-content] a:hover {
  opacity: 0.8;
}

[data-markdown-content] img,
[data-markdown-content] video,
[data-markdown-content] iframe {
  max-width: 100%;
  height: auto;
}

[data-markdown-content] table {
  border-color: hsl(0 0% 100% / 0.1);
  display: block;
  width: 100%;
  overflow-x: auto;
}

[data-markdown-content] th,
[data-markdown-content] td {
  border-color: hsl(0 0% 100% / 0.1);
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/blog/ src/components/pages/BlogPostPage.tsx src/styles/markdown.css src/lib/typography.ts
git commit -m "feat: redesign blog post components with dark editorial theme"
```

---

### Task 5: Redesenhar BlogPage (Listagem com Lazy Loading)

**Files:**
- Rewrite: `src/components/pages/BlogPage.tsx`
- Rewrite: `src/components/blog/BlogPostCardSkeleton.tsx`
- Rewrite: `src/components/blog/BlogPostLoadingSkeleton.tsx`
- Rewrite: `src/components/blog/BlogPostNotFound.tsx`

- [ ] **Step 1: Reescrever BlogPage.tsx com dark theme e lazy loading**

O componente recebe todos os posts via props (SSG). Exibe 6 inicialmente e carrega mais 6 com botao:

```tsx
// src/components/pages/BlogPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  initialPosts?: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPosts = [] }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const blogPosts = initialPosts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visiblePosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  return (
    <div className="bg-black min-h-screen pt-20 sm:pt-24 overflow-x-clip">
      {/* Header */}
      <div className="pt-6 sm:pt-8 pb-10 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 sm:mb-16">
            <p className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
              // LATEST_POSTS &middot; TOTAL: {blogPosts.length}
            </p>
            <h1 className="type-raster-section text-[14vw] sm:text-5xl md:text-7xl text-white uppercase tracking-tighter leading-[0.92]">
              TODOS OS<br />INSIGHTS
            </h1>
            <div className="border-t border-white/10 mt-6 pt-4 max-w-md">
              <p className="type-mono text-xs text-white/40">
                Biblioteca completa de conhecimentos tecnicos e reflexoes sobre desenvolvimento web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visiblePosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index < POSTS_PER_PAGE ? index * 0.1 : 0 }}
              className="group flex flex-col h-full border border-white/10 hover:border-accent/30 transition-colors"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <span className="type-mono text-[10px] text-white/40 uppercase tracking-widest truncate max-w-[200px]">
                  {post.slug}.md
                </span>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full border border-white/20" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex gap-4 type-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>

                <p className="text-white/50 text-sm mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="border border-white/20 text-white/60 px-2.5 py-1 rounded-full type-mono text-[9px] uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="type-mono text-[9px] text-white/30">+{post.tags.length - 3}</span>
                    )}
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 type-mono text-[10px] text-white/60 hover:text-accent transition-colors uppercase tracking-widest shrink-0"
                  >
                    Ler <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
              className="border border-white/20 text-white hover:border-accent hover:text-accent px-8 py-3 type-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              Carregar mais ({blogPosts.length - visibleCount} restantes)
            </button>
          </div>
        )}

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="type-mono text-white/40 uppercase tracking-widest">Nenhum post encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
```

- [ ] **Step 2: Reescrever BlogPostCardSkeleton.tsx com dark theme**

```tsx
// src/components/blog/BlogPostCardSkeleton.tsx
export function BlogPostCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-white/10 animate-pulse">
          <div className="p-4 border-b border-white/10">
            <div className="h-3 bg-white/5 w-24" />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-3 bg-white/5 w-20" />
            <div className="h-5 bg-white/5 w-3/4" />
            <div className="h-3 bg-white/5 w-full" />
            <div className="h-3 bg-white/5 w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Reescrever BlogPostLoadingSkeleton.tsx com dark theme**

```tsx
// src/components/blog/BlogPostLoadingSkeleton.tsx
export function BlogPostLoadingSkeleton() {
  return (
    <div className="bg-black min-h-screen pt-24">
      <div className="container mx-auto px-4 max-w-4xl space-y-6 animate-pulse">
        <div className="h-4 bg-white/5 w-32" />
        <div className="h-10 bg-white/5 w-3/4" />
        <div className="h-4 bg-white/5 w-48" />
        <div className="h-4 bg-white/5 w-full" />
        <div className="h-4 bg-white/5 w-2/3" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Reescrever BlogPostNotFound.tsx com dark theme**

```tsx
// src/components/blog/BlogPostNotFound.tsx
import { ArrowLeft } from 'lucide-react';

export function BlogPostNotFound() {
  return (
    <div className="bg-black min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
          // ERROR_404
        </p>
        <h1 className="type-raster-section text-6xl text-white mb-6">NAO ENCONTRADO</h1>
        <p className="text-white/50 mb-8">Este post nao existe ou foi removido.</p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 border border-white/20 text-white hover:border-accent hover:text-accent px-6 py-3 type-mono text-[10px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar ao blog
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/BlogPage.tsx src/components/blog/BlogPostCardSkeleton.tsx src/components/blog/BlogPostLoadingSkeleton.tsx src/components/blog/BlogPostNotFound.tsx
git commit -m "feat: redesign blog listing with dark theme and lazy loading"
```

---

### Task 6: Criar LatestPosts e Integrar na Home

**Files:**
- Create: `src/components/pages/LatestPosts.tsx`
- Modify: `src/components/pages/Index.tsx`

- [ ] **Step 1: Criar src/components/pages/LatestPosts.tsx**

O componente recebe posts como props (pre-carregados pelo Astro no server side):

```tsx
// src/components/pages/LatestPosts.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface LatestPostsProps {
  posts: BlogPost[];
}

const LatestPosts: React.FC<LatestPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section className="relative py-20 bg-black">
      <div className="px-6 md:px-12 mb-16">
        <h2 className="type-raster-section text-[10vw] md:text-[8vw] text-white">LATEST_POSTS</h2>
        <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
          <p className="type-mono text-white/40">Artigos e reflexoes sobre front-end</p>
          <a
            href="/blog"
            className="type-mono text-[10px] text-white/60 hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-16 sm:gap-20 md:gap-24 w-full max-w-5xl mx-auto px-8 sm:px-16 md:px-24">
        {posts.map((post, index) => (
          <motion.a
            key={post.slug}
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group block"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 type-mono text-[10px] text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
              </div>
              <h3 className="type-raster-section text-2xl sm:text-3xl md:text-4xl text-white group-hover:text-accent transition-colors tracking-tight">
                {post.title}
              </h3>
              <p className="text-white/50 text-sm max-w-xl leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="border border-white/20 text-white/60 px-3 py-1 rounded-full type-mono text-[9px] uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default LatestPosts;
```

- [ ] **Step 2: Atualizar src/pages/index.astro para passar posts**

Modificar a pagina Home do Astro para buscar posts e passar ao componente Index. Ler `src/pages/index.astro` para entender a estrutura atual e adicionar `getCollection` + `getRecentPosts`.

- [ ] **Step 3: Atualizar src/components/pages/Index.tsx**

Adicionar `LatestPosts` entre `Projects` e `About`, recebendo `latestPosts` como prop:

```tsx
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import LatestPosts from '@/components/pages/LatestPosts';
import SectionEntrance from '@/components/ui/SectionEntrance';
import type { BlogPost } from '@/types/blog';

interface IndexProps {
  latestPosts?: BlogPost[];
}

const Index: React.FC<IndexProps> = ({ latestPosts = [] }) => {
  return (
    <div className="flex flex-col">
      <SectionEntrance id="hero">
        <Hero />
      </SectionEntrance>

      <SectionEntrance id="projetos">
        <Projects />
      </SectionEntrance>

      {latestPosts.length > 0 && (
        <SectionEntrance id="blog">
          <LatestPosts posts={latestPosts} />
        </SectionEntrance>
      )}

      <SectionEntrance id="about">
        <About />
      </SectionEntrance>

      <SectionEntrance id="contact" className="py-40 flex flex-col items-center justify-center text-center">
        <div className="type-mono mb-8">Ready to start a project?</div>
        <a href="mailto:dev@bruno.com" className="type-raster-section text-[12vw] hover:text-accent transition-colors cursor-pointer block">
          LET'S_TALK
        </a>
        <div className="mt-20 type-mono opacity-50">
          (c) 2026 BRUNO GUIMARAES / ALL RIGHTS RESERVED
        </div>
      </SectionEntrance>
    </div>
  );
};

export default Index;
```

- [ ] **Step 4: Atualizar src/pages/index.astro para passar latestPosts**

```astro
---
import Layout from '@/layouts/Layout.astro';
import Index from '@/components/pages/Index';
import { getCollection } from 'astro:content';

const entries = await getCollection('blog');
const months: Record<string, number> = {
  JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
  JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11,
};
const sorted = [...entries].sort((a, b) => {
  const parseDate = (d: string) => {
    const parts = d.split(' ');
    if (parts.length === 3) return new Date(Number(parts[2]), months[parts[1].toUpperCase()] ?? 0, Number(parts[0]));
    return new Date(d);
  };
  return parseDate(b.data.date).getTime() - parseDate(a.data.date).getTime();
});
const latestPosts = sorted.slice(0, 3).map((entry) => ({
  id: entry.id,
  slug: entry.id,
  title: entry.data.title,
  date: entry.data.date,
  readTime: entry.data.readTime || '5 min',
  tags: entry.data.tags,
  author: entry.data.author,
  excerpt: entry.data.excerpt,
  content: '',
}));
---

<Layout>
  <Index latestPosts={latestPosts} client:load />
</Layout>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/LatestPosts.tsx src/components/pages/Index.tsx src/pages/index.astro
git commit -m "feat: add LatestPosts section to home page"
```

---

### Task 7: Criar 3 Novos Posts

**Files:**
- Create: `src/content/blog/react-19-server-components.md`
- Create: `src/content/blog/interfaces-inteligentes-ia.md`
- Create: `src/content/blog/engenharia-interface-2026.md`

- [ ] **Step 1: Criar post 1 — React 19 e Server Components**

Criar `src/content/blog/react-19-server-components.md` com frontmatter:
```yaml
---
title: "React 19 e Server Components: cortando JavaScript do cliente e ganhando pontos no Core Web Vitals"
date: "10 ABR 2026"
readTime: "8 min"
tags: ["React", "Server Components", "Performance", "Core Web Vitals"]
excerpt: "Entenda como o React 19 e os Server Components reduzem o JavaScript enviado ao cliente e melhoram metricas reais de performance como LCP, TTI e CLS."
---
```

Conteudo (~800 palavras): explicar o problema do excesso de JS no cliente, mostrar comparacao antes/depois de metricas (LCP, TTI, CLS), exemplos de codigo com Server Components vs Client Components, e resultados praticos.

- [ ] **Step 2: Criar post 2 — Interfaces inteligentes com IA**

Criar `src/content/blog/interfaces-inteligentes-ia.md` com frontmatter:
```yaml
---
title: "Interfaces inteligentes: como usar IA no front-end para personalizar UI em tempo real"
date: "05 ABR 2026"
readTime: "7 min"
tags: ["IA", "React", "UX", "Personalizacao", "Acessibilidade"]
excerpt: "Descubra como aplicar IA diretamente na interface para personalizar layouts, componentes e acessibilidade em tempo real, com exemplos praticos em React."
---
```

Conteudo (~700 palavras): personalizacao de layout por comportamento, recomendacoes contextuais na UI, acessibilidade adaptativa, exemplos praticos com hooks React.

- [ ] **Step 3: Criar post 3 — Engenharia de interface**

Criar `src/content/blog/engenharia-interface-2026.md` com frontmatter:
```yaml
---
title: "Engenharia de interface: padroes de arquitetura para front-ends modernos em 2026"
date: "01 ABR 2026"
readTime: "9 min"
tags: ["Arquitetura", "Front-end", "Design System", "Testes", "Observabilidade"]
excerpt: "Front-end e engenharia de software. Conheca padroes de arquitetura, camadas, design systems e observabilidade que elevam a qualidade de projetos front-end."
---
```

Conteudo (~900 palavras): camadas (UI, state, services), design system como contrato, acessibilidade como requisito, testes automatizados, observabilidade no front.

- [ ] **Step 4: Rodar build para validar frontmatter**

Run: `npm run build 2>&1 | tail -20`

Expected: Build sem erros. Se algum campo obrigatorio estiver faltando no frontmatter, o Zod vai reportar erro.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog/
git commit -m "feat: add 3 new blog posts — React 19, IA, Engenharia de Interface"
```

---

### Task 8: SEO Completo

**Files:**
- Modify: `src/pages/blog/index.astro` (meta tags estaticas)
- Modify: `src/pages/blog/[slug].astro` (meta tags dinamicas + JSON-LD)
- Modify: `src/layouts/Layout.astro` (verificar suporte a og:type article)

- [ ] **Step 1: Verificar Layout.astro suporta og:type dinamico**

O Layout.astro atual aceita `structuredData` via props e ja renderiza `<script type="application/ld+json">`. Porem, o `og:type` esta hardcoded como `website`. Adicionar prop `ogType` opcional:

Em `src/layouts/Layout.astro`, na interface Props, adicionar `ogType?: string`. Na meta tag OG, usar:
```astro
<meta property="og:type" content={ogType || 'website'} />
```

- [ ] **Step 2: Atualizar [slug].astro com SEO dinamico**

O [slug].astro ja passa `title`, `description` e `structuredData`. Adicionar `ogType="article"` e tags especificas de artigo:

```astro
<Layout
  title={post.title}
  description={post.excerpt}
  ogType="article"
  structuredData={{
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://devguimaraes.com.br',
    },
    datePublished: post.date,
    publisher: {
      '@type': 'Person',
      name: 'Bruno Guimaraes',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://devguimaraes.com.br/blog/${post.slug}`,
    },
  }}
>
```

- [ ] **Step 3: Atualizar blog/index.astro com JSON-LD para Blog**

Adicionar structuredData para a listagem:

```astro
<Layout
  title="Blog"
  description="Artigos sobre React, Next.js, TypeScript e engenharia front-end por Bruno Guimaraes."
  structuredData={{
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog — Bruno Guimaraes',
    description: 'Artigos sobre React, Next.js, TypeScript e engenharia front-end.',
    url: 'https://devguimaraes.com.br/blog',
    author: {
      '@type': 'Person',
      name: 'Bruno Guimaraes',
    },
  }}
>
```

- [ ] **Step 4: Verificar heading hierarchy**

- Home (LatestPosts): `<h2>` "LATEST_POSTS", `<h3>` para cada card — correto
- Blog listagem: `<h1>` "TODOS OS INSIGHTS", `<h2>` para cada card — correto
- Post individual: `<h1>` titulo do post, headings do markdown sao h2-h4 — correto

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/pages/blog/
git commit -m "feat: add complete SEO with JSON-LD and dynamic meta tags"
```

---

### Task 9: Build Verification e Testes Finais

**Files:** Nenhum arquivo novo.

- [ ] **Step 1: Rodar build completo**

Run: `npm run build 2>&1`

Expected: Build sem erros e sem warnings de deprecated.

- [ ] **Step 2: Verificar HTMLs gerados**

Run: `find dist -path "*/blog/*/index.html" | sort`

Expected: 7 arquivos (4 posts existentes + 3 novos):
```
dist/blog/css-grid-moderno/index.html
dist/blog/engenharia-interface-2026/index.html
dist/blog/interfaces-inteligentes-ia/index.html
dist/blog/react-19-server-components/index.html
dist/blog/react-server-components/index.html
dist/blog/shai-hulud-detector/index.html
dist/blog/typescript-performance/index.html
```

- [ ] **Step 3: Verificar blog listing**

Run: `find dist -path "*/blog/index.html" | sort`

Expected: `dist/blog/index.html` existe.

- [ ] **Step 4: Rodar testes unitarios**

Run: `npm run test:unit`

Expected: Todos os testes passando.

- [ ] **Step 5: Verificar SEO no HTML gerado**

Run: `head -30 dist/blog/react-19-server-components/index.html`

Expected: Verificar que title, meta description, og tags e JSON-LD estao presentes.

- [ ] **Step 6: Commit final se houver ajustes**

```bash
git add -A
git commit -m "chore: build verification and final adjustments"
```
