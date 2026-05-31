# Design Spec: Wiki Post UI

**Data:** 2026-05-30
**Status:** Draft
**Autor:** Gemini CLI

## 1. Visão Geral
Transformar a página de posts do blog em uma interface estilo "Wiki/Documentação técnica", inspirada na estética do Tailwind Docs mas mantendo a identidade visual Brutalista do portfólio. O foco é melhorar a legibilidade de textos longos e a navegabilidade entre seções.

## 2. Objetivos
- Implementar um layout de 3 colunas no desktop.
- Adicionar um Índice (Table of Contents) dinâmico com rastreamento de scroll.
- Criar uma sidebar de metadados (Info Box) com estética brutalista.
- Melhorar a tipografia para leitura de longa duração.

## 3. Design e Interface

### 3.1. Layout (Grid de 3 Colunas)
- **Coluna Esquerda (Navegação):** Botão "Voltar" e links contextuais. Fixo (sticky).
- **Coluna Central (Conteúdo):** 
  - `max-width: 768px` (72ch).
  - Alinhamento centralizado ou levemente à esquerda.
  - Tipografia: Newsreader (Serif) para o corpo, Inter/Pixel para títulos.
- **Coluna Direita (Utilidades):**
  - **Metadata Card:** Borda de 2px, sombra brutal, contendo Data, Tags, Autor e Read Time.
  - **Sticky TOC:** Lista de links para H2 e H3, destacando a seção ativa.

### 3.2. Tipografia e Cores
- **Corpo:** Newsreader, 1.125rem, `leading-relaxed`, cor `text-stone-200`.
- **Títulos:**
  - H1: Pixel (Jersey 15), Uppercase, borda amarela inferior grossa.
  - H2/H3: Sans (Inter), negrito. H2 com linha divisória sutil.
- **Código:** Blocos com `bg-stone-950`, bordas finas, botão de copiar e label de linguagem.
- **Callouts:** Blocos de destaque para "Dicas" ou "Avisos" com bordas coloridas.

### 3.3. Comportamento Mobile
- Layout de coluna única.
- Metadados logo abaixo do título principal.
- TOC transformado em um menu flutuante ou "sticky header" colapsável.
- Garantir que as bordas e sombras não ocupem espaço excessivo em telas pequenas.

## 4. Funcionalidades e Interatividade
- **Scroll Spy:** Script para detectar qual cabeçalho está visível e atualizar o TOC lateral.
- **Barra de Progresso:** Indicador visual de leitura no topo da viewport.
- **Tags Interativas:** Links para filtragem por categoria.

## 5. Arquitetura Técnica
- **Framework:** Astro 5.
- **Componentes:** 
  - Refatoração de `BlogPostPage.tsx` para acomodar o novo grid.
  - Novo componente `TableOfContents.tsx` (React).
  - Novo componente `BlogPostMetadata.tsx` (React).
- **Estilos:** Atualização de `src/styles/markdown.css` e uso de Tailwind CSS.

## 6. Critérios de Sucesso
- O índice lateral deve destacar corretamente a seção atual durante o scroll.
- O texto deve ser confortavelmente legível em desktop e mobile.
- A navegação lateral deve permitir pular entre seções sem recarregar a página.
- Manutenção da performance (LCP < 2.5s).
