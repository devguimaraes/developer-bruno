import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://devguimaraes.com.br',
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
          'en': 'en-US'
        }
      }
    }),
  ],
  output: 'static',
  build: {
    format: 'directory' // Cria as rotas com pastinha no final pra evitar index.html direto nas urls
  }
});
