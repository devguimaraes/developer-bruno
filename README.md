# ⚡ Bruno Guimarães | Professional Portfolio

<div align="center">

![Bruno Guimarães Banner](https://raw.githubusercontent.com/devguimaraes/developer-bruno/main/public/og-image.jpg)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Astro](https://img.shields.io/badge/Astro-5-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**[ESTÉTICA BRUTALISTA] [PERFORMANCE EXTREMA] [SEO BRASILEIRO]**

Um ecossistema digital de alta performance focado no mercado brasileiro, construído com uma arquitetura "Data-First" e design neo-brutalista.

[Visualizar Demo](https://devguimaraes.com.br) • [Guia de Estilo](docs/DESIGN_SYSTEM_GUIDELINE.md)

</div>

---

## 🏗️ Arquitetura & Engenharia

Este não é apenas um site estático, mas uma aplicação React robusta com foco em escalabilidade e manutenção simplificada.

### 🧩 Core Stack
- **Engine**: Astro 5 (SSG) + React 18.3 + TypeScript para compilação ultra-rápida.
- **Design System**: Tailwind CSS 3.4 com estética brutalista customizada.
- **Animações**: Framer Motion para transições de UI e **Rive** para animações vetoriais interativas de baixo consumo.
- **Data Layer**: 100% do conteúdo externalizado em `src/data/`, validado em tempo de execução com **Zod**.
- **Performance**: **React Query 5** para cache inteligente e gerenciamento de estado assíncrono.

### 🌀 Scroll Stacking System (Proprietário)
Implementamos um sistema avançado de camadas baseado em scroll (`useStackingSections.ts`).
- **Depth Effect**: Seções que se empilham dinamicamente conforme o usuário navega.
- **Intersection Optimization**: Monitoramento de 101 thresholds para garantir 60fps durante as transições.

---

## 🇧🇷 Otimização para o Mercado Brasileiro

Desenvolvido para entregar a melhor experiência possível sob as condições de infraestrutura do Brasil.

- **Performance Budget**: Limites rigorosos de 300KB JS e 1MB total, garantindo carregamento rápido em redes 3G/4G instáveis.
- **Local SEO**: Metadados em `pt_BR`, Schema.org (JSON-LD) em português e geração automática de sitemap para o Google Brasil.
- **Typography**: Uso estratégico das fontes Satoshi e JetBrains Mono para legibilidade superior em qualquer densidade de tela.
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
├── components/       # UI Primitives (shadcn) e Seções (Hero, Projects, etc)
├── data/             # A ÚNICA fonte de verdade (JSON/TS Objects)
├── hooks/            # Lógica reutilizável (Stacking, WebVitals, Analytics)
├── lib/              # Utilitários, Validação Zod e Configuração de Sitemap
├── types/            # Definições estritas de TypeScript
└── config/           # Metadados de SEO e Budgets de Performance
```

---

## 📐 Design Tokens (Brutalismo Neo)

O projeto segue princípios estritos de design brutalista:
- **Bordas**: `border-4` para contraste máximo.
- **Radius**: `rounded-none` (0rem) para uma estética crua e técnica.
- **Sombras**: `shadow-brutal` (offset duro sem blur).
- **Cores**: HSL adaptativo (Parakeet Green, Royal Lilac, Freesia Gold).

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
perf: otimiza assets Rive para 48kb
```

---

<div align="center">

**[BRUNO GUIMARÃES]**
*Engenheiro de Front-End & Designer de Interfaces*

</div>
