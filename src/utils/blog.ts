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

// Função para extrair metadata do frontmatter do markdown
function parseFrontmatter(content: string): { metadata: Partial<BlogPost>; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const frontmatter = match[1];
  const markdownContent = match[2];

  // Parse simples do frontmatter
  const metadata: Partial<BlogPost> = {};
  const lines = frontmatter.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove aspas se existirem
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1);
        const tags = value.split(',').map(tag => tag.trim().replace(/['"]/g, ''));
        metadata[key as keyof BlogPost] = tags;
      } else {
        metadata[key as keyof BlogPost] = value;
      }
    }
  }

  return { metadata, content: markdownContent };
}

// Posts estáticos para simplificar (em um projeto real, isso poderia ser carregado de uma API)
const staticPosts: BlogPost[] = [
  {
    slug: 'por-que-neo-brutalismo',
    title: 'Por que o Neo-Brutalismo Dominou o Web Design?',
    date: '24 OUT 2023',
    readTime: '5 min',
    tags: ['Design', 'Tendências', 'UI/UX'],
    excerpt: 'Abandone o flat design entediante. Descubra como sombras duras, cores vibrantes e bordas marcadas estão redefinindo a estética digital moderna.',
    content: `# O Retorno do "Feio" Estético

O design web passou a última década obcecado com o minimalismo. Tudo branco, muito espaço negativo, sombras suaves (quase invisíveis) e cantos arredondados de 20px. Ficou... **chato**.

Entra o **Neo-Brutalismo**.

Não é sobre ser feio. É sobre ser **honesto**, **cru** e **funcional**.

## Características Principais

1. **Bordas Pretas e Grossas:** Nada de sutileza. Se há uma caixa, mostre que é uma caixa.
2. **Cores de Alta Saturação:** Esqueça os pastéis. Use amarelo gema, laranja neon, roxo elétrico.
3. **Sombras Duras (Hard Shadows):** Sem desfoque. A sombra é apenas uma cópia preta do elemento deslocada 4px para baixo e direita.
4. **Tipografia Grotesca:** Fontes sem serifa, grandes, pesadas e muitas vezes monoespaçadas.

> "O Neo-Brutalismo na web é a resposta digital à arquitetura de concreto exposto dos anos 50: ame ou odeie, você não pode ignorá-lo."

## Como aplicar nos seus projetos

Comece com o básico: remova \`border-radius\`, adicione \`border: 2px solid black\` e mude sua paleta para algo que seu monitor de 1998 conseguiria exibir com orgulho.

\`\`\`css
.botao-brutal {
  background-color: #facc15;
  border: 3px solid black;
  box-shadow: 4px 4px 0px black;
  font-family: 'Space Grotesk', monospace;
}
\`\`\`

Seja ousado. A web precisa de mais personalidade.`
  },
  {
    slug: 'react-performance-tips',
    title: 'Otimizando React: Além do básico',
    date: '10 NOV 2023',
    readTime: '8 min',
    tags: ['React', 'Dev', 'Performance'],
    excerpt: 'useMemo não é bala de prata. Entenda renderização, keys e virtualização para interfaces realmente fluidas.',
    content: `# Performance Real em React

Muitos desenvolvedores espalham \`useMemo\` e \`useCallback\` pelo código como se fosse tempero, esperando que o app fique mágico. Spoiler: **não fica**.

## O verdadeiro vilão: Re-renders Desnecessários

O React é rápido, mas renderizar componentes pesados 50 vezes por segundo trava qualquer navegador.

### 1. Estrutura de Estado
O erro número 1 é colocar estado global onde estado local resolveria. Se apenas um botão muda de cor, por que a página inteira está renderizando?

### 2. Listas Longas
Se você está renderizando uma lista com mais de 100 itens, você precisa de **virtualização**.

Bibliotecas recomendadas:
* \`react-window\`
* \`virtua\`

### 3. Imagens
Use formatos modernos (WebP, AVIF) e carregamento preguiçoso (\`lazy loading\`).

\`\`\`jsx
<img
  src="foto-pesada.webp"
  loading="lazy"
  alt="Otimização"
/>
\`\`\`

Performance é UX. Ninguém gosta de esperar.`
  },
  {
    slug: 'typescript-next-level',
    title: 'TypeScript: Nível Avançado',
    date: '15 NOV 2023',
    readTime: '10 min',
    tags: ['TypeScript', 'Advanced', 'Tips'],
    excerpt: 'Vá além dos tipos básicos. Domine generics, utility types e padrões avançados para código Type-Safe.',
    content: `# TypeScript que Impressiona

Todo mundo sabe fazer \`interface User { name: string }\`. Mas você está usando TypeScript no máximo?

## Generics que Fazem Sentido

### 1. Tipos Retornáveis
\`\`\`typescript
function apiCall<T>(endpoint: string): Promise<T> {
  return fetch(endpoint).then(res => res.json())
}

type User = ReturnType<typeof apiCall<'/api/user'>>
\`\`\`

### 2. Utility Types Criativos
\`\`\`typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>
\`\`\`

### 3. Type Guards Avançados
\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
\`\`\`

## Padrões de Empresa

### 1. Branded Types
\`\`\`typescript
type UserId = string & { readonly brand: unique symbol }
function createUserId(id: string): UserId {
  return id as UserId
}
\`\`\`

### 2. Mapped Types com Template Literals
\`\`\`typescript
type EventHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K}>\`]: (event: T[K]) => void
}
\`\`\`

TypeScript não é sobre restrição. É sobre **clareza** e **confiança** no seu código.`
  }
];

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return staticPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Função para obter um post específico pelo slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}