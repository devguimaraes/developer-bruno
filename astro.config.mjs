import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { rehypePostContent } from './src/lib/blog/headings.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://brunoguimaraes.dev',
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
  // Hosts em que o Astro confia no X-Forwarded-Host. Sem isso a função da Vercel vê o pedido como
  // localhost e a checagem de origem do contato (isSameOriginRequest) recusa todo envio com 403.
  security: {
    allowedDomains: [
      { hostname: 'brunoguimaraes.dev', protocol: 'https' },
      { hostname: 'www.brunoguimaraes.dev', protocol: 'https' },
      // Previews da Vercel (developer-bruno-<hash>-devguimaraes-projects.vercel.app).
      { hostname: '*.vercel.app', protocol: 'https' },
    ],
  },
  // A barra de dev cobre a barra de abas no celular e intercepta cliques. Só o e2e a desliga.
  devToolbar: { enabled: process.env.E2E !== '1' },
  markdown: {
    rehypePlugins: [rehypePostContent],
  },
  build: {
    format: 'directory' // Cria as rotas com pastinha no final pra evitar index.html direto nas urls
  }
});
