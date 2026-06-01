# Design Spec: Blog Index Wiki UI

**Data:** 2026-05-30
**Status:** Draft
**Autor:** Gemini CLI

## 1. Visão Geral
Transformar a página principal de listagem do blog (`/blog`) em uma interface de "Índice de Wiki" ou "Biblioteca Digital". O layout seguirá o padrão de 3 colunas estabelecido para os posts individuais, garantindo consistência visual e funcional em toda a seção de conteúdo.

## 2. Objetivos
- Implementar o layout de 3 colunas na página de listagem do blog.
- Criar uma sidebar de filtros por categorias/tags e cronologia (ano/mês).
- Adicionar uma sidebar de utilidades com busca, posts em destaque e estatísticas.
- Manter a estética brutalista nos cards de posts.

## 3. Design e Interface

### 3.1. Layout (Grid de 3 Colunas)
- **Coluna Esquerda (Navegação/Filtros):** 
  - Menu de categorias (React, Design, Tech, etc).
  - Filtro por ano (Cronologia).
  - Botão "Voltar para Home".
- **Coluna Central (Feed de Conteúdo):**
  - Grid de posts (2 colunas dentro da área central ou lista compacta).
  - Título da seção: "BIBLIOTECA DE INSIGHTS" (Fonte Pixel).
- **Coluna Direita (Utilidades):**
  - Barra de busca brutalista.
  - Card de "Posts Recomendados".
  - Card de "Estatísticas" (Total de artigos, tempo total de leitura).

### 3.2. Estética e Tipografia
- Manter o padrão de bordas pesadas e sombras brutais.
- Cabeçalhos de seção em Fonte Pixel (Jersey 15).
- Labels técnicos em Fonte Mono (Silkscreen).

### 3.3. Comportamento Mobile
- Coluna única.
- Sidebar de filtros colapsada em um menu horizontal ou "drawer".
- Busca e utilidades movidas para o final da página ou integradas no cabeçalho.

## 4. Funcionalidades
- **Filtragem Dinâmica:** Filtrar posts por categoria/tag sem recarregar (estado React).
- **Busca Local:** Filtro de texto em tempo real nos posts carregados.
- **Paginação/Load More:** Manter o sistema atual de carregamento incremental.

## 5. Arquitetura Técnica
- **Páginas:** Modificação de `src/pages/blog/index.astro`.
- **Componentes:**
  - `BlogPageClient.tsx`: Refatoração para o novo grid.
  - `BlogFilters.tsx`: Novo componente para a sidebar esquerda.
  - `BlogSidebar.tsx`: Novo componente para a sidebar direita.
  - `SearchBar.tsx`: Componente de busca brutalista.
