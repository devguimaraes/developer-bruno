# Projeto Developer Bruno - Arquitetura do Sistema

Este documento descreve a arquitetura técnica do portfólio profissional do Developer Bruno, detalhando a organização dos componentes, fluxo de dados e tecnologias utilizadas.

## Fluxograma da Arquitetura

```mermaid
graph TD
    subgraph "Camada de Entrada"
        Main["main.tsx (EntryPoint)"]
        IndexHTML["index.html"]
    end

    subgraph "Provedores & Contexto (App.tsx)"
        Helmet["HelmetProvider (SEO)"]
        Query["QueryClientProvider (Estado)"]
        Router["BrowserRouter (Rotas)"]
        UI_Providers["Tooltip/Toast Providers"]
    end

    subgraph "Layout & Estrutura Base"
        Layout["Layout.tsx"]
        Nav["Navigation.tsx"]
        Footer["Footer.tsx"]
        SEO_Comp["SEO/StructuredData"]
    end

    subgraph "Páginas (src/pages/)"
        PageIndex["Index.tsx (Home)"]
        PageBlog["BlogPage.tsx"]
        PagePost["BlogPostPage.tsx"]
        Page404["NotFound.tsx"]
    end

    subgraph "Componentes de Funcionalidade (src/components/)"
        Hero["Hero.tsx"]
        About["About.tsx"]
        ProjectsComp["Projects.tsx"]
        SkillsComp["Skills.tsx"]
        ExpComp["Experience.tsx"]
        ContactComp["Contact.tsx"]
    end

    subgraph "Camada de Dados & Tipagem"
        Data["src/data/ (Static TS Data)"]
        Content["src/content/ (Blog MD/TS)"]
        Types["src/types.ts (Interfaces)"]
    end

    subgraph "Utilidades & Hooks"
        Hooks["src/hooks/ (Custom Hooks)"]
        Lib["src/lib/ (Utils/Logger)"]
        Styles["Tailwind CSS / index.css"]
    end

    %% Fluxo Principal
    IndexHTML --> Main
    Main --> Helmet
    Helmet --> Query
    Query --> Router
    Router --> UI_Providers
    UI_Providers --> Layout

    %% Roteamento
    Layout --> Router
    Router --> PageIndex
    Router --> PageBlog
    Router --> PagePost
    Router --> Page404

    %% Composição de Páginas
    PageIndex --> Hero
    PageIndex --> About
    PageIndex --> ProjectsComp
    PageIndex --> SkillsComp
    PageIndex --> ExpComp
    PageIndex --> ContactComp

    %% Consumo de Dados
    ProjectsComp --> Data
    SkillsComp --> Data
    ExpComp --> Data
    PageBlog --> Content
    PagePost --> Content

    %% Suporte
    Hero & About & ProjectsComp --> Hooks
    ProjectsComp & SkillsComp --> Types
    Layout --> SEO_Comp
    Components --> Lib
```

## Detalhes dos Componentes

### 1. Frontend Core

* **Framework**: React 18.3 com TypeScript.
* **Build Tool**: Vite 7.2 + SWC para compilação ultra-rápida.
* **Estilização**: Tailwind CSS 3.4, seguindo uma estética **Brutalista** (bordas espessas, cores contrastantes, geometria marcada).

### 2. Gerenciamento de Estado e Dados

* **Estado do Servidor**: TanStack Query (React Query) v5 para busca e cache de dados.
* **Dados Estáticos**: Localizados em `src/data/`, exportando arrays tipados de projetos, habilidades e experiências.
* **Conteúdo Dinâmico**: O blog utiliza arquivos em `src/content/`, facilitando a manutenção de artigos via Git.

### 3. SEO e Performance

* **SEO**: Implementação robusta com `react-helmet-async` para meta tags dinâmicas e `JSON-LD` para dados estruturados (Schema.org).
* **Performance**: Monitoramento de Web Vitals adaptado para a realidade brasileira (redes 3G/4G), integrado via hooks customizados.

### 4. UI/UX

* **Primitivos**: Utiliza `shadcn/ui` (baseado em Radix UI) para componentes acessíveis e consistentes.
* **Animações**: Lucide React para ícones e interatividades sutis integradas aos componentes de funcionalidade.
