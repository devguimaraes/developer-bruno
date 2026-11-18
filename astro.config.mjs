import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { unified } from '@astrojs/markdown-remark';
import { rehypePostContent } from './src/lib/blog/headings.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://brunoguimaraes.dev',
  // Páginas pré-geradas. A função da Vercel só entra quando houver rota com prerender = false (contato, #54).
  adapter: vercel(),
  integrations: [
    // Tailwind entra pelo postcss.config.js: a integração @astrojs/tailwind parou no Astro 5.
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'pt-br',
        locales: {
          'pt-br': 'pt-BR',
          'en': 'en-US',
        }
      }
    }),
  ],
  output: 'static',
  // O padrão do Astro 7 ('jsx') tira espaços entre elementos. true mantém a compressão sem perda.
  compressHTML: true,
  // A barra de dev cobre a barra de abas no celular e intercepta cliques. Só o e2e a desliga.
  devToolbar: { enabled: process.env.E2E !== '1' },
  markdown: {
    // O pipeline remark/rehype mantém o plugin dos posts (no Astro 7 o padrão é o Sätteri).
    processor: unified({ rehypePlugins: [rehypePostContent] }),
  },
  build: {
    format: 'directory' // Cria as rotas com pastinha no final pra evitar index.html direto nas urls
  }
});
