# Home em camadas

Handoff das pranchas da home completa em camadas, mapa #112.

## O que é

A home contada em capítulos contínuos, com a câmera isométrica acompanhando a rolagem do visitante e um único Giro atravessando a narrativa. No fim da página, todas as camadas deitam e se fecham em uma pilha interativa que funciona como rodapé e mapa do site.

No celular, a navegação inferior adota o trilho de ícones com trajeto conectado, substituindo a antiga barra de abas.

## De onde veio

Canvas privado "Home em camadas", pranchas aprovadas em novembro de 2026:
- `Main.dc.html`: prancha do computador (1440 x 900 px), com a lógica completa de capítulos e rolagem.
- `Home-celular.dc.html`: prancha no viewport móvel (390 x 844 px), instanciando a `Main` com layout mobile.
- `Capitulos.dc.html`: folha de quadros com os 16 momentos chave da narrativa.

## Capítulos, lógica e tickets do mapa

| Capítulo | Função em `Main.dc.html` | Ticket | No código |
| :--- | :--- | :--- | :--- |
| **Abertura e Estados** | `buildAbertura`, `setDemo` | #123 | `HomeOpening.tsx`, `StatesDemo.tsx`, `states-stage.ts` |
| **Serviços** | `buildServicos` | #116 | `HomeServices.tsx`, `service-stage.ts` |
| **Projetos** | `buildProjetos` | #117 | `HomeProjects.tsx`, `project-stage.ts` |
| **Processo** | `buildProcesso` | #118 | `HomeProcess.tsx`, `process-stage.ts` |
| **Sobre** | `buildSobre` | #119 | `HomeAbout.tsx`, `about-stage.ts` |
| **Blog** | `buildBlog` | #120 | `HomeBlog.tsx`, `blog-contact-stage.ts` |
| **Contato** | `buildContato` | #120 | `HomeContact.tsx`, `ContactForm.tsx`, `blog-contact-stage.ts` |
| **Fim** | `buildFim`, `drawFimRail` | #121 | `HomeEnd.tsx`, `end-stage.ts` |

Os componentes ficam em `src/components/home/`. Cada capítulo tem a lógica pura num `*-stage.ts` com teste e o CSS num arquivo próprio em `src/styles/` (`home-estados.css`, `home-sobre.css`, `home-blog.css`, `home-contact.css`, `home-fim.css`; Serviços, Projetos e Processo ficam em `giro-home.css`).

Tarefas complementares do mapa:
- #113: levar as pranchas para o repositório (este handoff).
- #114: base dos capítulos, GSAP só na home e versão sem animação (`story/useChapterScenes.ts`).
- #115: um Giro só atravessando os capítulos (`story/HomeGiro.tsx`, `chapters.ts`, `giro-jump.ts`).
- #122: trilho de ícones em todas as páginas (`src/components/nav/Dock.tsx`, `dock-map.ts`).
- #124: conferência final e documentação.

## O que mudou no porte

- Uma linha do tempo por capítulo, montada por `useChapterScenes` com `scene()` (`start top top`, `end bottom bottom`, `scrub 0.35`, sem `pin`). O capítulo fica preso por `position: sticky` no CSS.
- Exceção, desde 12 de novembro de 2026 (piloto): no Processo a rolagem só escolhe a etapa e a cena dela toca no tempo (`PROCESS_BEATS`, `calcProcessBeat`). Só a linha de estações e o disco da saída seguem escovados. As placas flutuam em CSS (`pc-float`).
- O Giro da história segue a parada por mola (`stepSpring`), não mais colado quadro a quadro: leva a velocidade de um salto para o outro, estica na direção do movimento e troca de superfície no meio do voo. Uma parada sobre um disco de troca de cor declara a superfície em `data-surface`; um passo de capítulo pode declarar em `surface`.
- Margem lateral e ritmo de cabeçalho são tokens em `giro.css` (`--G`, `--head-gap-eyebrow`, `--head-gap-lead`), usados por todos os capítulos e pelas páginas internas.
- Toda regra de palco vive sob `html[data-scenes="on"]`, que o `Layout.astro` liga antes do primeiro paint quando não há movimento reduzido. Sem JS ou com movimento reduzido, cada capítulo é leitura em ordem.
- O Giro da história (`HomeGiro`) lê o passo de cada capítulo a cada quadro. Hover, digitação e envio chegam pelos sinais de `story/story-signals.ts`, não por estado do componente.
- A passagem de mão entre o Giro da hero e o `HomeGiro` usa `html[data-giro-hand="story"]`: o runtime da hero para e o rider some, para nunca haver dois rostos.
- O `SiteFooter` não é montado na home: o rodapé faz parte do capítulo Fim. No celular, a troca de idioma das páginas internas fica no rodapé (só no celular, `only-m`), porque o trilho não tem menu.
- No celular, a câmera da pilha do Fim é calculada para caber entre o texto e o rodapé (`fitEndCamera`), em vez do `y` fixo da prancha.
- A placa "estados" do Fim leva para `#hero`, porque o capítulo Estados divide o palco com a hero.

## Pendências para a conferência em aparelho real (#111)

- Telas baixas (375 x 667): o Processo já sobe e encolhe a cena (`calcProcessLift`, `--pc-up`). Continuam pendentes: a base da hero corta abaixo de cerca de 760 px de altura, as pílulas de Estados encostam no trilho e as etiquetas da pilha do Fim se sobrepõem.
- Safari, GPU real e celular real ainda não foram conferidos.

## Como rodar a prancha fora do canvas

As pranchas utilizam o formato `.dc.html` do Design Canvas. Para executá-las fora do editor:

1. A pasta já contém o runtime `support.js` (baseado no `artifact-type/dc-runtime.js`), além dos estilos de apoio (`hero.css`, `hero-b.css`, `home.css`, `home-arts.css`) e scripts do GSAP (`gsap.min.js`, `ScrollTrigger.min.js`).
2. Sirva a pasta `docs/handoff/home-camadas/` através de qualquer servidor HTTP estático local apontando para `127.0.0.1`.
3. Abra `Main.dc.html`, `Home-celular.dc.html` ou `Capitulos.dc.html` no navegador.

## Scripts de verificação

A pasta `verificacao/` reúne as ferramentas automatizadas via Playwright que validam o comportamento visual, físico e interativo:

- `check.cjs`: serve o diretório localmente, percorre a rolagem pelos 25 pontos da história, valida que não há erros no console e salva os snapshots dos quadros em `img/q-*.jpg`.
- `interact.cjs`: testa a máquina de estados que a rolagem estática não cobre: cliques em demonstradores, simulação de falha e nova tentativa de publicação, alternância de etapas do processo, subida e descida da rolagem, e fluxo do formulário de contato.
- `mobile.cjs`: valida as medidas no formato de celular (390 x 844 px), alturas dos painéis de serviços, acomodação das tags e a navegação no trilho de ícones.
- `tilt.cjs`: inspeciona a transição contínua da virada das janelas de projetos para trás, medindo matrizes de transformação 3D e visibilidade durante a rolagem.
- `wheel.cjs`: simula a rolagem física com a roda do mouse na transição para os projetos em quatro resoluções de tela (1440x900, 1920x1080, 1366x768, 1536x730).
- `recorte.cjs`: processa `public/brunoGuimaraes.webp`, aplicando inundação de borda para extração da silhueta com canal alfa e gradação em duotone azul, gerando `public/bruno-duo.webp` (~45 KB).
