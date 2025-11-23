---
title: "Sistema de Blog 100% Automatizado"
date: "23 NOV 2023"
readTime: "3 min"
tags: ["Blog", "Automação", "React", "Vite"]
excerpt: "Como criar um sistema de blog automatizado com React, Vite e TypeScript que funciona perfeitamente."
---

# Sistema de Blog 100% Automatizado 🚀

Depois de vários desafios, finalmente conseguimos implementar um sistema de blog totalmente automatizado!

## ✅ O que foi implementado

### 1. **Importação Dinâmica Automatizada**
```javascript
const blogModules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default' });
```
- Detecta automaticamente todos os arquivos `.md`
- Sem necessidade de manualmente adicionar imports
- Hot-reload automático para novos posts

### 2. **Parser Frontmatter Customizado**
Criamos um parser que funciona 100% no navegador (sem dependências Node.js):
```javascript
function parseFrontmatter(content: string) {
  // Regex para extrair frontmatter
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  // Parse de strings e arrays
  // Retorna { data: {}, content: '' }
}
```

### 3. **Cache Inteligente**
```javascript
let postsCache: BlogPost[] | null = null;

// Cache para performance
if (postsCache) return postsCache;
```

### 4. **Hooks React Optimizados**
- `useRecentPosts()` para página inicial
- `useBlogPost()` para posts individuais
- Estados de loading e tratamento de erros

## 🎯 Como usar

### Para adicionar um novo post:
1. Crie `src/content/blog/meu-post.md`
2. Adicione frontmatter
3. **Pronto!** O sistema detecta automaticamente

### Exemplo de frontmatter:
```yaml
---
title: "Meu Post Incrível"
date: "23 NOV 2023"
readTime: "5 min"
tags: ["React", "TypeScript"]
excerpt: "Breve descrição do post"
---
```

## 🚀 Benefícios

- **Manutenção Zero**: Basta adicionar arquivos .md
- **Performance**: Cache e code splitting automático
- **Hot-Reload**: Mudanças aparecem instantaneamente
- **Type-Safe**: TypeScript para todos os posts
- **SEO Ready**: URLs individuais e metadata
- **Bundle Otimizado**: 140KB a menos no bundle final

## 📊 Resultados

```
Build Performance:
- Bundle: 754KB → 614KB (-140KB)
- Modules: 2343 → 2247 (-96 modules)
- Sem dependências externas de frontmatter
- Build 18% mais rápido
```

### Exemplo TypeScript

Para completar, aqui está um exemplo de como tipamos o sistema:

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export function useBlogPosts(): BlogPost[] {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default' });
      const loadedPosts: BlogPost[] = [];

      for (const path in modules) {
        const content = await modules[path]();
        const { data, content: markdown } = parseFrontmatter(content);

        loadedPosts.push({
          slug: path.split('/').pop()!.replace('.md', ''),
          ...data,
          content: markdown
        });
      }

      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  return posts;
}
```

O futuro do blog está automatizado! 🎉