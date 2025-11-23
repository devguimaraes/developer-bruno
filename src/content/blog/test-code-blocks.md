---
title: "Test: Code Blocks Colors"
date: "23 NOV 2023"
readTime: "1 min"
tags: ["Test"]
excerpt: "Post para testar cores dos blocos de código."
---

# Testando Blocos de Código

Este post é apenas para testar se as cores dos blocos de código estão funcionando corretamente.

## Inline Code

Aqui temos um exemplo de `código inline` no meio do texto.

## Bloco de Código Simples

```javascript
function exemploSimples() {
  console.log("Este é um bloco de código JavaScript");
  return true;
}
```

## Bloco TypeScript

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
```

## Bloco CSS

```css
.teste {
  background-color: hsl(var(--markdown-pre-bg));
  color: hsl(var(--markdown-pre-text));
  padding: 1rem;
  border: 2px solid hsl(var(--markdown-border));
}
```

## Bloco de Código Grande

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

Se todos os blocos acima estiverem com texto branco sobre fundo escuro (ou texto preto sobre fundo claro), o problema está resolvido!