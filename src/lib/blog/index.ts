import { countWords, parseBlogContent, parseReadingTime } from './content';
import type { BlogPost } from '@/types/blog';

export type { BlogPost } from '@/types/blog';

// Função para converter filename em slug
export function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Cache para posts carregados
let postsCache: BlogPost[] | null = null;

// Sistema automatizado de importação usando Vite glob
const blogModules = import.meta.glob('../../content/blog/*.md', { query: '?raw', import: 'default' });

// Função para carregar posts dos arquivos .md (automatizado)
async function loadBlogPosts(): Promise<BlogPost[]> {
  if (postsCache) {
    return postsCache;
  }

  try {
    const posts: BlogPost[] = [];

    for (const path in blogModules) {
      const rawContent = await (blogModules[path] as () => Promise<string>)();

      const filename = path.split('/').pop() || '';
      const slug = generateSlug(filename);
      const { frontmatter, markdown } = parseBlogContent(rawContent);

      const readTime = frontmatter.readTime || '5 min';
      const readingTime = parseReadingTime(readTime);
      const excerpt = frontmatter.excerpt || '';

      const post: BlogPost = {
        id: slug,
        slug,
        title: frontmatter.title || 'Sem título',
        date: frontmatter.date || 'Data não definida',
        readTime,
        readingTime,
        tags: frontmatter.tags || [],
        author: frontmatter.author || 'Bruno Guimarães',
        excerpt,
        description: excerpt || undefined,
        content: markdown,
        image: frontmatter.image,
        featured: frontmatter.featured || false,
        wordCount: countWords(markdown),
      };

      posts.push(post);
    }

    posts.sort((a, b) => {
      const dateA = convertBrazilianDate(a.date);
      const dateB = convertBrazilianDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    postsCache = posts;
    return posts;
  } catch (error) {
    console.error('Erro ao carregar posts do blog:', error);
    return [];
  }
}

// Função auxiliar para converter datas brasileiras (ex: "24 OUT 2023") para Date
function convertBrazilianDate(dateStr: string): Date {
  const months: Record<string, number> = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
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

// Interface pública para obter todos os posts ordenados por data
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await loadBlogPosts();
}

// Função para obter os posts mais recentes (limitado a uma quantidade)
export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  return posts.slice(0, limit);
}

// Função para obter um post específico pelo slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

// Função para recarregar posts (útil para hot-reload em desenvolvimento)
export function invalidateBlogCache(): void {
  postsCache = null;
}

// Hook para hot-reload em desenvolvimento
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('Hot reload detected - invalidating blog cache');
    invalidateBlogCache();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blog-cache-invalidated'));
    }
  });
}
