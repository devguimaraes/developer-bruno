import { clsx } from 'clsx';

// Design tokens para tipografia do blog usando CSS custom properties
export const markdownTheme = {
  colors: {
    text: 'hsl(var(--markdown-text))',
    textMuted: 'hsl(var(--markdown-text-muted))',
    border: 'hsl(var(--markdown-border))',
    codeBg: 'hsl(var(--markdown-code-bg))',
    codeText: 'hsl(var(--markdown-code-text))',
    preBg: 'hsl(var(--markdown-pre-bg))',
    preText: 'hsl(var(--markdown-pre-text))',
  },
  spacing: {
    headingMargin: 'var(--markdown-heading-margin)',
    paragraphMargin: 'var(--markdown-paragraph-margin)',
  },
  borders: {
    headingBorder: 'var(--markdown-heading-border)',
    codeBorder: 'var(--markdown-code-border)',
  }
} as const;

// Configurações de tipografia responsiva
export const typographyConfig = {
  base: 'prose prose-lg max-w-none prose-stone',

  // Cores e tema usando CSS custom properties
  colors: [
    '[&>*]:text-[hsl(var(--markdown-text))]',
    '[&_*]:text-[hsl(var(--markdown-text))]',
    'prose-headings:text-[hsl(var(--markdown-text))]',
    'prose-p:text-[hsl(var(--markdown-text-muted))]',
    'prose-strong:text-[hsl(var(--markdown-text))]',
    'prose-em:text-[hsl(var(--markdown-text))]',
    'prose-a:text-[hsl(var(--markdown-text))]',
    'prose-blockquote:text-[hsl(var(--markdown-text-muted))]',
  ],

  // Headings responsivos
  headings: {
    all: [
      'prose-headings:font-bold',
      'prose-headings:mb-4',
      'prose-headings:mt-6',
    ],
    h1: [
      'prose-h1:text-2xl',
      'prose-h1:sm:text-3xl',
      'prose-h1:md:text-4xl',
      'prose-h1:lg:text-5xl',
      'prose-h1:xl:text-6xl',
      'prose-h1:font-black',
      'prose-h1:uppercase',
      'prose-h1:border-b-4',
      'prose-h1:border-[hsl(var(--markdown-border))]',
      'prose-h1:pb-2',
      'prose-h1:mt-8',
    ],
    h2: [
      'prose-h2:text-xl',
      'prose-h2:sm:text-2xl',
      'prose-h2:md:text-3xl',
      'prose-h2:lg:text-4xl',
      'prose-h2:font-bold',
      'prose-h2:border-b-2',
      'prose-h2:border-[hsl(var(--markdown-border))]',
      'prose-h2:pb-1',
    ],
    h3: [
      'prose-h3:text-lg',
      'prose-h3:sm:text-xl',
      'prose-h3:md:text-2xl',
      'prose-h3:lg:text-3xl',
      'prose-h3:font-bold',
    ],
    h4: [
      'prose-h4:text-base',
      'prose-h4:sm:text-lg',
      'prose-h4:md:text-xl',
      'prose-h4:lg:text-2xl',
      'prose-h4:font-bold',
    ],
    h5: [
      'prose-h5:text-sm',
      'prose-h5:sm:text-base',
      'prose-h5:md:text-lg',
      'prose-h5:lg:text-xl',
      'prose-h5:font-bold',
    ],
    h6: [
      'prose-h6:text-sm',
      'prose-h6:sm:text-base',
      'prose-h6:md:text-lg',
      'prose-h6:lg:text-xl',
      'prose-h6:font-bold',
    ],
  },

  // Elementos de conteúdo
  content: {
    paragraphs: [
      'prose-p:leading-relaxed',
      'prose-p:mb-4',
      'prose-p:mt-0',
      'prose-p:font-medium',
    ],
    strong: [
      'prose-strong:font-bold',
      'prose-strong:font-semibold',
    ],
    emphasis: [
      'prose-em:italic',
    ],
    links: [
      'prose-a:no-underline',
      'prose-a:hover:decoration-2',
      'prose-a:underline-offset-4',
      'prose-a:hover:decoration-brutal-yellow',
      'prose-a:font-bold',
    ],
    lists: [
      'prose-ul:pl-6',
      'prose-ol:pl-6',
      'prose-li:mb-2',
      'prose-li:marker:text-[hsl(var(--markdown-text))]',
    ],
    code: [
      'prose-code:px-2',
      'prose-code:py-1',
      'prose-code:border-2',
      'prose-code:border-[hsl(var(--markdown-border))]',
      'prose-code:rounded',
      'prose-code:font-mono',
      'prose-code:text-sm',
    ],
    pre: [
      'prose-pre:border-2',
      'prose-pre:border-[hsl(var(--markdown-border))]',
      'prose-pre:p-4',
      'prose-pre:overflow-x-auto',
      'prose-pre:rounded-none',
    ],
    blockquote: [
      'prose-blockquote:border-l-4',
      'prose-blockquote:border-[hsl(var(--markdown-border))]',
      'prose-blockquote:pl-4',
      'prose-blockquote:not-italic',
    ],
  }
} as const;

// Função utilitária para gerar classes de tipografia
export function getMarkdownClasses() {
  return clsx(
    typographyConfig.base,
    typographyConfig.colors,
    typographyConfig.headings.all,
    typographyConfig.headings.h1,
    typographyConfig.headings.h2,
    typographyConfig.headings.h3,
    typographyConfig.headings.h4,
    typographyConfig.headings.h5,
    typographyConfig.headings.h6,
    typographyConfig.content.paragraphs,
    typographyConfig.content.strong,
    typographyConfig.content.emphasis,
    typographyConfig.content.links,
    typographyConfig.content.lists,
    typographyConfig.content.code,
    typographyConfig.content.pre,
    typographyConfig.content.blockquote
  );
}

// Classe CSS customizada para variáveis do tema
export const markdownThemeCSS = `
  :root {
    --markdown-text: rgb(0, 0, 0);
    --markdown-text-muted: rgb(75, 85, 99);
    --markdown-border: rgb(0, 0, 0);
    --markdown-code-bg: rgb(241, 245, 244);
    --markdown-pre-bg: rgb(243, 244, 246);
  }

  [data-theme="dark"] {
    --markdown-text: rgb(255, 255, 255);
    --markdown-text-muted: rgb(156, 163, 175);
    --markdown-border: rgb(255, 255, 255);
    --markdown-code-bg: rgb(31, 41, 55);
    --markdown-pre-bg: rgb(17, 24, 39);
  }
`;