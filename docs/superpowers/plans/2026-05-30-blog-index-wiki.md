# Blog Index Wiki UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a página principal de listagem do blog em uma interface de Wiki com 3 colunas, filtros e busca.

**Architecture:** Refatoração do `BlogPageClient.tsx` para usar um grid de 3 colunas e adição de novos componentes para filtros e sidebar de utilidades.

**Tech Stack:** Astro 5, React 18, Tailwind CSS, Lucide Icons.

---

### Task 1: Componente de Busca Brutalista

**Files:**
- Create: `src/components/blog/SearchBar.tsx`

- [ ] **Step 1: Criar componente SearchBar**
Um input com borda pesada e ícone de busca.

```tsx
import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <div className="relative group">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-accent" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="BUSCAR INSIGHTS..."
      className="w-full bg-black border-2 border-white/20 p-3 pl-10 text-xs font-mono uppercase tracking-widest focus:border-accent outline-none transition-colors"
    />
  </div>
);
```

- [ ] **Step 2: Commit**
```bash
git add src/components/blog/SearchBar.tsx
git commit -m "feat(blog): add SearchBar component"
```

---

### Task 2: Sidebar de Filtros e Categorias

**Files:**
- Create: `src/components/blog/BlogFilters.tsx`

- [ ] **Step 1: Implementar BlogFilters**
Lista de categorias e anos com suporte a seleção.

```tsx
import React from 'react';

export const BlogFilters = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: string[], 
  activeCategory: string, 
  onCategoryChange: (c: string) => void 
}) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-xs font-pixel uppercase tracking-widest text-stone-500 mb-4">Categorias</h3>
      <div className="space-y-2">
        <button 
          onClick={() => onCategoryChange('all')}
          className={`block text-xs uppercase tracking-widest transition-colors ${activeCategory === 'all' ? 'text-accent font-bold' : 'text-stone-400 hover:text-white'}`}
        >
          [ Todas ]
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`block text-xs uppercase tracking-widest transition-colors ${activeCategory === cat ? 'text-accent font-bold' : 'text-stone-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  </div>
);
```

- [ ] **Step 2: Commit**
```bash
git add src/components/blog/BlogFilters.tsx
git commit -m "feat(blog): add BlogFilters component"
```

---

### Task 3: Sidebar de Utilidades (Estatísticas e Recomendados)

**Files:**
- Create: `src/components/blog/BlogSidebar.tsx`

- [ ] **Step 1: Implementar BlogSidebar**
Card de estatísticas e links recomendados.

```tsx
import React from 'react';
import type { BlogPost } from '@/types/blog';

export const BlogSidebar = ({ posts }: { posts: BlogPost[] }) => {
  const totalReadTime = posts.reduce((acc, p) => acc + parseInt(p.readTime), 0);
  
  return (
    <div className="space-y-8">
      <div className="border border-white/10 p-4 bg-stone-900/20">
        <h3 className="text-[10px] font-mono uppercase text-stone-500 mb-3 tracking-tighter">Status da Biblioteca</h3>
        <div className="space-y-2 text-[10px] font-bold uppercase">
          <div className="flex justify-between">
            <span>Total de Artigos</span>
            <span className="text-accent">{posts.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Tempo de Estudo</span>
            <span className="text-accent">~{totalReadTime} MIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**
```bash
git add src/components/blog/BlogSidebar.tsx
git commit -m "feat(blog): add BlogSidebar component"
```

---

### Task 4: Refatoração do BlogPageClient

**Files:**
- Modify: `src/components/pages/BlogPage.tsx`
- Modify: `src/components/blog/index.ts`

- [ ] **Step 1: Exportar novos componentes no index.ts**
- [ ] **Step 2: Implementar o grid de 3 colunas e lógica de busca/filtro**
Integrar os novos componentes e adicionar o estado de `search` e `filter`.
- [ ] **Step 3: Ajustar responsividade**
- [ ] **Step 4: Commit**
```bash
git add src/components/pages/BlogPage.tsx src/components/blog/index.ts
git commit -m "feat(blog): refactor BlogPage to Wiki layout with search and filters"
```
