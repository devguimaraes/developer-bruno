// Parser customizado de frontmatter (compatível com navegador)
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: content.trim() };
  }

  const frontmatterStr = match[1];
  const markdownContent = match[2];

  const data: any = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove aspas se existirem
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayStr = value.slice(1, -1);
        const items = arrayStr.split(',').map(item => {
          item = item.trim();
          // Remove aspas dos itens
          if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
            item = item.slice(1, -1);
          }
          return item;
        });
        data[key] = items;
      } else {
        data[key] = value;
      }
    }
  }

  return { data, content: markdownContent.trim() };
}

// Tipos para os posts do blog
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string;
}

// Função para converter filename em slug
function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Cache para posts carregados
let postsCache: BlogPost[] | null = null;

// Sistema automatizado de importação usando Vite glob
const blogModules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default' });

// Função para carregar posts dos arquivos .md (automatizado)
async function loadBlogPosts(): Promise<BlogPost[]> {
  // Se já temos cache, retornar
  if (postsCache) {
    return postsCache;
  }

  try {
    const posts: BlogPost[] = [];

    // Iterar sobre todos os módulos encontrados
    for (const path in blogModules) {
      // Carregar conteúdo do arquivo
      const content = await (blogModules[path] as Promise<string>)();

      // Extrair filename do path
      const filename = path.split('/').pop() || '';
      const slug = generateSlug(filename);

      // Parse frontmatter e conteúdo
      const { data: frontmatter, content: markdown } = parseFrontmatter(content);

      // Criar objeto post
      const post: BlogPost = {
        slug,
        title: frontmatter.title || 'Sem título',
        date: frontmatter.date || 'Data não definida',
        readTime: frontmatter.readTime || '5 min',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        excerpt: frontmatter.excerpt || '',
        content: markdown.trim()
      };

      posts.push(post);
    }

    // Ordenar por data (mais recentes primeiro)
    posts.sort((a, b) => {
      const dateA = convertBrazilianDate(a.date);
      const dateB = convertBrazilianDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Cache dos posts
    postsCache = posts;

    return posts;
  } catch (error) {
    console.error('❌ Erro ao carregar posts do blog:', error);
    return [];
  }
}

// Função auxiliar para converter datas brasileiras (ex: "24 OUT 2023") para Date
function convertBrazilianDate(dateStr: string): Date {
  const months: { [key: string]: number } = {
    'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
    'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
  };

  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1].toUpperCase()] || 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  // Fallback para parsing padrão
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
  return posts.find(post => post.slug === slug) || null;
}

// Função para recarregar posts (útil para hot-reload em desenvolvimento)
export function invalidateBlogCache(): void {
  postsCache = null;
}

// Hook para hot-reload em desenvolvimento
if (import.meta.hot) {
  import.meta.hot.accept(['../content/blog/*.md'], () => {
    console.log('🔄 Hot reload detected - invalidating blog cache');
    invalidateBlogCache();

    // Disparar evento para componentes React
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blog-cache-invalidated'));
    }
  });
}