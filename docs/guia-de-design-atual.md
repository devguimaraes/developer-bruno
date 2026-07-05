> **Nota:** Este documento é histórico. Os componentes PixelLoader, GlassSurface, Magnetic, LatestPosts, InfoBar, EngineeringPractices, ShuffleText e BorderGlow foram removidos na limpeza de Jul/2026.
# Guia de Design Atual

## Objetivo

Este guia documenta os padrões de design atualmente ativos no site para orientar manutenção, evolução e criação de novas páginas sem descaracterizar a experiência já consolidada.

O foco aqui é `como o site está desenhado hoje`, não como documentos antigos sugeriam que ele deveria ser.

## Princípios de design

### 1. Impacto antes de ornamentação

Grandes headlines, fundo preto e composição ampla geram a primeira impressão. Efeitos entram para reforçar isso, não para substituir hierarquia.

### 2. Interface como artefato técnico

O design assume códigos visuais de sistema:

- labels em uppercase
- microcopy tipo console
- metadados compactos
- coordenadas, versões e prefixes com `//`

### 3. Editorial dentro do digital

Quando o conteúdo pede profundidade, a experiência desacelera:

- bio com serifada
- blog com leitura longa
- espaçamento generoso
- largura de texto controlada

### 4. Motion com propósito

Movimento serve para:

- revelar conteúdo
- dar profundidade
- reforçar imersão

Não para encher a interface de microanimações arbitrárias.

## Shell global

Definido principalmente em `src/layouts/Layout.astro`.

### Elementos globais ativos

- `PixelLoader`
- `CustomCursor`
- `SmoothScroll`
- `Navigation`
- `Footer`
- `Toaster`
- `GrainOverlay`

### Regras do shell

- fundo base preto
- layout full-width
- navegação fixa no topo
- footer escuro com metadados de versão e localização
- overlays e efeitos visuais aplicados globalmente

## Navegação

### Características

- fixa
- translúcida
- com efeito de vidro distorcido
- compacta ao rolar
- desktop com links horizontais
- mobile com `StaggeredMenu`

### Linguagem visual

- avatar circular pequeno
- wordmark textual `BRUNO / GUIMARÃES`
- labels técnicas com `type-mono`
- hover com cor de acento

### Boas práticas derivadas

- manter a barra visualmente leve
- evitar botões pesados ou CTA chamativos no topo
- preservar a sensação de overlay técnico

## Home atual

### Estrutura real

Em `src/components/pages/Index.tsx`:

1. `Hero`
2. `Projects`
3. `LatestPosts`
4. `About`
5. CTA final de contato

### Regra importante

`Skills` e `Contact` não fazem parte da home atual. Se forem reintroduzidos, precisam ser reinterpretados para caber na direção visual vigente.

## Hero

### Função

Estabelecer presença, especialidade e atmosfera.

### Características

- vídeo de fundo full-bleed
- título raster gigante em duas linhas
- apoio técnico curto
- faixa inferior com narrativa curta e indicador de scroll
- coordenadas e versão como detalhes periféricos

### Regras para evolução

- preservar headline gigante e simples
- evitar excesso de blocos, cards ou selos no centro
- manter a leitura limpa sobre mídia de fundo
- qualquer CTA futuro precisa ser discreto e coerente com o tom atual

## Projetos

### Função

Apresentar portfólio como galeria curada, não como lista utilitária.

### Padrões

- seção escura
- título em `type-raster-section`
- cards de imagem com bastante respiro entre si
- overlay textual central
- glitch e grayscale com revelação no hover
- chips de tecnologia em cápsulas

### Regras

- priorizar poucas entradas fortes
- imagem precisa sustentar a composição
- categorias curtas e legíveis
- tags tecnológicas devem parecer metadata, não badge promocional

## Latest Posts

### Função

Conectar portfólio e pensamento técnico.

### Padrões

- segue a linguagem de `Projects`
- metadata compacta com ícones
- título forte
- resumo curto
- tags discretas em cápsulas

### Regras

- não transformar em blog card genérico de SaaS
- manter tipografia forte e poucas distrações
- preservar continuidade visual com a home

## About

### Função

Humanizar a marca e aprofundar a autoridade criativa/técnica.

### Padrões

- barra informacional superior
- retrato em vídeo com glitch
- grande nome tipográfico
- texto bio em registro editorial
- ticker horizontal com stack

### Regras

- usar contraste entre humano e sistema
- preservar a combinação entre retrato forte e biografia refinada
- não lotar a seção com cards de habilidade ou estatísticas desnecessárias

## CTA final

### Função

Fechar a home de forma memorável e direta.

### Padrões

- texto monumental `LET'S_TALK`
- layout centralizado
- microcopy mínimo

### Regra

Esse bloco funciona porque é simples. Evitar transformá-lo em formulário complexo no mesmo contexto visual.

## Blog listing

### Características

- fundo preto contínuo
- heading forte
- grid de cards escuros com bordas finas
- aparência de arquivo técnico
- botão de “carregar mais” discreto

### Regras

- manter densidade moderada
- bordas e divisórias sempre sutis
- priorizar legibilidade e hierarquia

## Blog post

### Estrutura

Layout editorial de coluna única (`max-w-720px`), sem sidebar e sem table of contents. Ordem vertical, em `src/components/pages/BlogPostPage.tsx`:

- botão de retorno em linguagem de sistema (`← VOLTAR AO BLOG`)
- meta row: badge de categoria (`tags[0]`, fundo dourado) + data + tempo de leitura
- título gigante em `font-pixel`
- lede itálica serifada (`excerpt` do post)
- byline: avatar quadrado com iniciais, nome do autor e cargo fixo
- cover opcional (só renderiza se o post tiver `image`; sem placeholder quando ausente)
- conteúdo markdown em tema escuro editorial
- tags em cápsulas de canto reto no rodapé do artigo
- navegação apenas para o próximo post, como card único (`PRÓXIMO POST →` + título grande) — não há link para o post anterior

### Regras tipográficas do conteúdo

Baseadas em `src/styles/markdown.css`:

- largura máxima confortável
- entrelinha longa
- headings brancos, `h2` em uppercase
- acento dourado em links e detalhes
- blocos de código com borda leve
- blockquotes com filete à esquerda
- listas não ordenadas com marcador customizado (seta `→` em vez de bullet)

## Footer

### Características

- fundo preto
- borda superior translúcida
- selo de versão
- copyright
- coordenadas
- monograma `BG`

### Regra

O footer deve continuar operando como fechamento técnico e institucional, não como área de navegação pesada.

## Componentes e efeitos com peso visual real

Os componentes abaixo têm impacto direto na linguagem do produto:

- `GlassSurface`
- `GrainOverlay`
- `GlitchImage`
- `SmoothScroll`
- `SectionEntrance`
- `ScrollReveal`
- `TextReveal`
- `Magnetic`
- `StaggeredMenu`

Eles devem ser reutilizados com parcimônia para manter coesão.

## Tokens e decisões de estilo

### Cores

Base ativa:

- preto
- branco
- dourado

Uso recomendado:

- dourado para foco, hover e ênfase
- branco para leitura principal
- branco translúcido para bordas, divisórias e metadata

### Tipografia

Uso recomendado:

- `Jersey 15` para headlines de impacto
- `Silkscreen` para labels e dados técnicos
- `Newsreader` para passagens editoriais especiais
- `Inter` e `JetBrains Mono` para suporte

### Bordas e sombras

O sistema atual usa dois repertórios:

- brutalismo herdado no Tailwind
- bordas finas translúcidas da UI ativa

A UI principal publicada hoje se apoia mais em:

- `border-white/10`
- `border-white/20`
- superfícies escuras
- poucas sombras pesadas

## Responsividade

Padrões observados:

- títulos fluidos em `vw`
- padding lateral progressivo
- grids que colapsam para coluna única
- navegação adaptada com menu mobile
- blog e home funcionam em ritmo vertical no mobile

## Consistência e limites

### Fazer

- preservar o preto como palco principal
- usar o dourado com contenção
- manter headlines grandes e decisivas
- escrever microcopy com tom técnico e seguro
- usar efeitos para atmosfera, não como truque

### Evitar

- introduzir light mode como default sem redesenho completo
- reintroduzir roxo e verde como eixo dominante
- trocar a tipografia display por algo corporativo neutro
- adicionar cards genéricos de marketing
- usar componentes antigos como se fossem espelho exato da home atual

## 404

`src/components/pages/NotFound.tsx` agora segue a linguagem principal do produto:

- fundo preto
- headline raster
- labels de sistema
- CTAs diretos para home e blog
- metadata técnica no rodapé

Ela não deve competir com a home, mas já opera dentro da mesma família visual.

## Resumo operacional

Se uma nova interface parecer:

- escura
- precisa
- técnica
- editorial
- espaçada
- com uma ou duas camadas atmosféricas bem escolhidas

ela tende a estar alinhada.

Se parecer:

- colorida demais
- arredondada demais
- genérica demais
- parecida com dashboard SaaS

ela tende a estar fora da identidade atual.
