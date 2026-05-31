# Wiki Post UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a página de posts em uma interface de Wiki com 3 colunas, índice lateral dinâmico e tipografia otimizada.

**Architecture:** Layout de grid (3 colunas) usando Tailwind, com um hook de Scroll Spy para o índice e refatoração do CSS de Markdown para melhor legibilidade.

**Tech Stack:** Astro 5, React 18, Tailwind CSS, Framer Motion.

---

### Task 1: Setup da Tipografia e Estilos de Conteúdo

**Files:**
- Modify: `src/styles/markdown.css`
- Modify: `src/index.css`

- [ ] **Step 1: Atualizar variáveis e fontes base**
No `src/index.css`, garantir que as fontes Newsreader e Inter estão mapeadas.

- [ ] **Step 2: Refatorar `src/styles/markdown.css`**
Aplicar a tipografia Newsreader ao corpo do texto e os ajustes de cores suaves (`text-stone-200`).

```css
[data-markdown-content] {
  color: #e7e5e4; /* stone-200 */
  font-family: 'Newsreader', serif;
  font-size: 1.125rem;
  line-height: 1.8;
  max-width: 72ch;
}
/* ... atualizações de H1, H2, H3 conforme spec ... */
```

- [ ] **Step 3: Validar visualmente (via dev server)**
Run: `bun run dev`
Expected: Texto do blog usando fonte Serifada e cores de tom stone.

- [ ] **Step 4: Commit**
```bash
git add src/styles/markdown.css src/index.css
git commit -m "feat(wiki): update typography and base content styles"
```

---

### Task 2: Hook de Scroll Spy

**Files:**
- Create: `src/hooks/useScrollSpy.ts`

- [ ] **Step 1: Implementar o hook para detectar IDs visíveis**
O hook deve observar os elementos H2 e H3 e retornar o ID ativo.

```typescript
import { useState, useEffect } from 'react';

export const useScrollSpy = (ids: string[], offset = 100) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: `0px 0px -80% 0px` }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
};
```

- [ ] **Step 2: Commit**
```bash
git add src/hooks/useScrollSpy.ts
git commit -m "feat(wiki): add useScrollSpy hook"
```

---

### Task 3: Componente Table of Contents (TOC)

**Files:**
- Create: `src/components/blog/TableOfContents.tsx`
- Modify: `src/components/blog/index.ts`

- [ ] **Step 1: Criar o componente TOC com suporte a Scroll Spy**
```tsx
import React from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export const TableOfContents = ({ headings }: { headings: { id: string, text: string, depth: number }[] }) => {
  const activeId = useScrollSpy(headings.map(h => h.id));

  return (
    <nav className="space-y-2">
      <p className="text-xs font-pixel uppercase tracking-widest text-stone-500 mb-4">No artigo</p>
      {headings.map(h => (
        <a 
          key={h.id} 
          href={`#${h.id}`}
          className={`block text-sm transition-colors ${h.depth > 2 ? 'pl-4' : ''} ${activeId === h.id ? 'text-accent font-bold' : 'text-stone-400 hover:text-white'}`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
};
```

- [ ] **Step 2: Exportar no index.ts**
- [ ] **Step 3: Commit**
```bash
git add src/components/blog/TableOfContents.tsx src/components/blog/index.ts
git commit -m "feat(wiki): add TableOfContents component"
```

---

### Task 4: Sidebar de Metadados (Info Box)

**Files:**
- Create: `src/components/blog/BlogPostMetadata.tsx`

- [ ] **Step 1: Implementar o card brutalista de metadados**
```tsx
import type { BlogPost } from '@/types/blog';

export const BlogPostMetadata = ({ post }: { post: BlogPost }) => (
  <div className="border-2 border-white p-4 shadow-brutal bg-black mb-8">
    <div className="space-y-4">
      <div>
        <p className="text-[10px] uppercase font-mono text-stone-500 tracking-tighter">Publicado em</p>
        <p className="text-sm font-bold">{post.date}</p>
      </div>
      <div>
        <p className="text-[10px] uppercase font-mono text-stone-500 tracking-tighter">Tags</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {post.tags?.map(tag => (
            <span key={tag} className="text-[10px] border border-stone-700 px-2 py-0.5 hover:border-accent cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);
```

- [ ] **Step 2: Commit**
```bash
git add src/components/blog/BlogPostMetadata.tsx
git commit -m "feat(wiki): add BlogPostMetadata card"
```

---

### Task 5: Refatoração do Layout (3 Colunas)

**Files:**
- Modify: `src/components/pages/BlogPostPage.tsx`

- [ ] **Step 1: Implementar o Grid de 3 colunas no desktop**
Substituir o container atual por um grid fracionado.

- [ ] **Step 2: Adicionar lógica para extrair Headings do post**
Garantir que os H2/H3 do Markdown tenham IDs (Astro faz isso automaticamente, mas precisamos capturá-los).

- [ ] **Step 3: Commit**
```bash
git add src/components/pages/BlogPostPage.tsx
git commit -m "feat(wiki): refactor layout to 3-column grid"
```

---

### Task 4: Ajustes Finais e Mobile

**Files:**
- Modify: `src/components/pages/BlogPostPage.tsx`
- Modify: `src/styles/markdown.css`

- [ ] **Step 1: Ajustar responsividade**
Ocultar sidebars no mobile e mover metadados para baixo do H1.
- [ ] **Step 2: Barra de progresso**
Implementar barra amarela fina no topo usando Framer Motion.
- [ ] **Step 3: Commit**
```bash
git add src/components/pages/BlogPostPage.tsx src/styles/markdown.css
git commit -m "fix(wiki): mobile adjustments and progress bar"
```
