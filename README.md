# ⚡ Bruno Guimarães | Professional Portfolio

<div align="center">

![Bruno Guimarães Banner](https://raw.githubusercontent.com/devguimaraes/developer-bruno/main/public/og-image.jpg)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Astro](https://img.shields.io/badge/Astro-5-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**[BRUTALISMO DIGITAL] [PERFORMANCE] [BLOG EDITORIAL]**

Portfólio autoral de alta performance com identidade visual dark-first, linguagem de sistema e blog editorial integrado.

[Visualizar Demo](https://devguimaraes.com.br) • [Guia de Design Atual](docs/guia-de-design-atual.md) • [Identidade Visual](docs/identidade-visual-atual.md) • [Branding Guide](docs/branding-guide-atual.md)

</div>

---

## 🏗️ Arquitetura & Engenharia

O projeto combina renderização estática com ilhas interativas em React, mantendo uma base enxuta e direcionada à experiência visual.

### 🧩 Core Stack
- **Engine**: Astro 5 (SSG) + React 18.3 + TypeScript para compilação ultra-rápida.
- **UI Layer**: Tailwind CSS 3.4 + componentes próprios para glass, glitch, grain e motion.
- **Animações**: Framer Motion, GSAP e smooth scroll com Lenis.
- **Conteúdo**: Astro Content Collections para blog e dados tipados em `src/data/`.
- **SEO & Analytics**: metadados em `Layout.astro`, JSON-LD e Plausible em produção.

---

## 🇧🇷 Otimização para o Mercado Brasileiro

Desenvolvido para entregar a melhor experiência possível sob as condições de infraestrutura do Brasil.

- **Performance Budget**: Limites rigorosos de 300KB JS e 1MB total, garantindo carregamento rápido em redes 3G/4G instáveis.
- **Local SEO**: Metadados em `pt_BR`, Schema.org (JSON-LD) em português e geração automática de sitemap para o Google Brasil.
- **Typography**: combinação de Jersey 15, Silkscreen, Newsreader, Inter e JetBrains Mono para equilibrar assinatura visual e legibilidade.
- **Privacy**: Implementação do Plausible Analytics, totalmente aderente à LGPD (sem cookies).

---

## 🛠️ Guia de Desenvolvimento

### Comandos Essenciais

```bash
# Instalação
bun install

# Ambiente de Desenvolvimento (http://127.0.0.1:4321)
bun run dev

# Build de Produção com Geração de Sitemap
bun run build

# Preview da Build Local
bun run preview

# Linting com Biome
bun run lint

# Testes
bun run test:unit
bun run test:e2e
```

O servidor local sobe em `http://127.0.0.1:4321/`, e esse é o endereço esperado para E2E/Playwright.

### Estrutura de Pastas

```bash
src/
├── components/       # Componentes de UI e seções da experiência
├── data/             # Dados tipados usados pelo app
├── hooks/            # Lógica reutilizável (video loading, mobile, web vitals)
├── lib/              # Utilitários, Validação Zod e Configuração de Sitemap
├── types/            # Definições estritas de TypeScript
├── config/           # Metadados de SEO e Budgets de Performance
├── layouts/          # Shell global Astro
└── pages/            # Rotas Astro do site e do blog
```

---

## 📐 Direção Visual Atual

O projeto hoje segue uma direção visual dark-first:
- **Base**: fundo preto e texto branco.
- **Acento**: dourado para hover, links e resposta visual.
- **Tipo**: Jersey 15, Silkscreen, Newsreader, Inter e JetBrains Mono.
- **Materialidade**: vídeo, granulado, glitch e superfícies translúcidas.

Para decisões de design, use:
- [Guia de Design Atual](docs/guia-de-design-atual.md)
- [Identidade Visual Atual](docs/identidade-visual-atual.md)
- [Branding Guide Atual](docs/branding-guide-atual.md)

---

## 📊 Status de Qualidade

- **Performance (Lighthouse)**: 95+ 🚀
- **Acessibilidade (WCAG 2.1)**: 100 ✅
- **SEO (Mercado BR)**: 100 🎯
- **Type Safety**: Strict Mode 🛡️

---

## 🤝 Contribuição & Licença

Este projeto é de código aberto sob a licença MIT. Siga o padrão de **Conventional Commits** para qualquer contribuição.

```bash
feat: implementa nova seção de depoimentos
fix: corrige overflow no mobile do Hero
perf: otimiza mídia do hero e imagens WebP
```

---

<div align="center">

**[BRUNO GUIMARÃES]**
*Engenheiro de Front-End & Designer de Interfaces*

</div>
