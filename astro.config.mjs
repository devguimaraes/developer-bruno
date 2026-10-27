import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { rehypePostContent } from './src/lib/blog/headings.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://devguimaraes.com.br',
  // Páginas pré-geradas. A função da Vercel só entra quando houver rota com prerender = false (contato, #54).
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
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
  // A barra de dev cobre a barra de abas no celular e intercepta cliques. Só o e2e a desliga.
  devToolbar: { enabled: process.env.E2E !== '1' },
  markdown: {
    rehypePlugins: [rehypePostContent],
  },
  build: {
    format: 'directory' // Cria as rotas com pastinha no final pra evitar index.html direto nas urls
  }
});
