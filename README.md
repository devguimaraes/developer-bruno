# ⚡ Bruno Guimarães | Professional Portfolio

<div align="center">

![Bruno Guimarães](https://raw.githubusercontent.com/devguimaraes/developer-bruno/main/public/og-image.png)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Astro](https://img.shields.io/badge/Astro-5-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**[IDENTIDADE GIRO] [PERFORMANCE] [BLOG EDITORIAL]**

Portfólio autoral de alta performance com a identidade Giro: um spinner com rosto, azul sinal e lima, e blog editorial integrado.

[Visualizar Demo](https://devguimaraes.com.br) • [ADR da identidade](docs/adr/0001-identidade-visual-giro.md) • [ADR da arquitetura](docs/adr/0002-astro-com-funcao-na-vercel.md)

</div>

---

## 🏗️ Arquitetura & Engenharia

O projeto combina renderização estática com ilhas interativas em React, mantendo uma base enxuta e direcionada à experiência visual.

### 🧩 Core Stack
- **Engine**: Astro 5 (SSG) + React 18.3 + TypeScript para compilação ultra-rápida.
- **UI Layer**: Tailwind CSS 3.4 + tokens e componentes da Giro em `src/styles/giro*.css`.
- **Animações**: estados do Giro em CSS com `data-state`; Framer Motion só para voos.
- **Contato**: função sob demanda na Vercel (`/api/contato`) com Resend.
- **Conteúdo**: Astro Content Collections para blog e dados tipados em `src/data/`.
- **SEO & Analytics**: metadados em `Layout.astro`, JSON-LD e Plausible em produção.

---

## 🇧🇷 Otimização para o Mercado Brasileiro

Desenvolvido para entregar a melhor experiência possível sob as condições de infraestrutura do Brasil.

- **Performance Budget**: Limites rigorosos de 300KB JS e 1MB total, garantindo carregamento rápido em redes 3G/4G instáveis.
- **Local SEO**: Metadados em `pt_BR`, Schema.org (JSON-LD) em português e geração automática de sitemap para o Google Brasil.
- **Typography**: Anybody e Geist Mono, servidas localmente, sem requisição a terceiros.
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
├── hooks/            # useLocale e useReducedMotion
├── lib/              # Utilitários, Validação Zod e Configuração de Sitemap
├── types/            # Definições estritas de TypeScript
├── config/           # Metadados de SEO e Budgets de Performance
├── layouts/          # Shell global Astro
└── pages/            # Rotas Astro do site e do blog
```

---

## 📐 Direção Visual

A identidade Giro alterna superfícies de marca e de leitura:
- **g-azul**: azul sinal, para a marca.
- **g-papel**: papel, para leitura.
- **g-tinta**: tinta, para contraste.
- **Tipo**: Anybody (títulos e corpo) e Geist Mono (rótulos).
- **Sem modo escuro** no lançamento.

As decisões estão em [docs/adr](docs/adr) e no `GLOSSARY.md`. Os guias antigos em `docs/` descrevem a identidade anterior e são históricos.

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
fix(hero): corrige overflow no mobile
perf: otimiza mídia do hero e imagens WebP
```

---

<div align="center">

**[BRUNO GUIMARÃES]**
*Engenheiro de Front-End & Designer de Interfaces*

</div>
