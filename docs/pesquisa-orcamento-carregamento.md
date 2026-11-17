# Orçamento da tela de carregamento

Medição do estado anterior em 2026-10-31, o build da v2 em `src/` em 2026-11-01, e um laboratório do outro relógio no fim. Esse laboratório não ficou no código. A fonte foi decidida na issue 71, e esta pesquisa responde a issue 72.

Os números de `src/config/site.ts` são 300000 bytes de JS, 50000 de CSS, 500000 de imagens e 1000000 no total. O comentário e o ADR 0002 dizem que o orçamento vale para o que carrega antes da tela de carregamento terminar. O arquivo não diz se o byte é cru ou gzip. As duas contas estão abaixo.

## O que a home pede

O HTML de `dist/client/index.html` liga duas folhas e o grafo das ilhas (`component-url`, `renderer-url` e o ClientRouter), seguindo só `import` estático.

| | cru | gzip por arquivo |
| --- | ---: | ---: |
| JS do grafo da home (37 arquivos) | 439,9 KB | 156,5 KB |
| CSS ligado no head da home | 70,0 KB | 14,6 KB |
| Anybody + Geist Mono (woff2) | 78,1 KB | já comprimido |

KB nesta tabela é 1024 bytes. 439,9 KB são 450458 bytes. O build seguinte mede 455591, cerca de 5 KB a mais, na ordem do crescimento do chunk `LoadingScreen`.

O caso `/projetos/atlas-marine-solutions` pede 344,7 KB de JS cru no mesmo tipo de grafo. O CSS da home já passa de 50 KB no byte cru e fica abaixo no gzip. O JS da home passa de 300 KB no byte cru e fica abaixo no gzip.

A tela de hoje, o chunk `LoadingScreen`, sai com 2,97 KB cru no log do Vite. Ela não é o peso da home. Os dois maiores arquivos do grafo são `index` (131,5 KB) e `proxy` (109,7 KB).

O `check:media-budget` só soma imagens do viewport. Não mede JS nem CSS.

## Lighthouse do build atual

`astro preview` não sobe: o adapter `@astrojs/vercel` recusa o comando. O build estático foi servido de `dist/client` e medido com Lighthouse 12, Chrome do sistema, simulação móvel padrão de laboratório. Não é a rede de produção.

| Página | Nota | LCP | FCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 0,57 | 6,3 s | 2,0 s | 560 ms | 0,044 |
| Case Atlas Marine | 0,87 | 2,7 s | 2,3 s | 20 ms | 0,111 |

O LCP da home é o parágrafo `.hr-lede` do hero. 93% desse tempo é atraso de render. O LCP do case é a foto do hero. 70% é atraso de render. A tela de hoje não desenha o nome, então o elemento de LCP não é ela. O atraso combina com a tela cobrindo a página até sair.

## Estimativa da v2

Conta a partir do estudo, não de um segundo build. O CSS da tela de hoje, `src/styles/giro-loader.css`, tem 715 bytes. As regras de overlay em `motion/compositions/loader.html` (camadas, assinatura, linhas, seleção) somam 3619 bytes. O destino falso do estúdio (header, case, barra) não entra no porte: o site já tem isso. Keyframes compartilhados de largura, disco e digitação cabem em cerca de 1 KB. A soma nova de CSS fica em torno de 4 KB crus, perto de 1,5 KB gzip.

O nome vira 14 spans (`brun` e ` guimarães`). As três linhas somam 65 caracteres. Se a digitação for `steps()` numa linha só, não há um span por caractere.

O chunk `LoadingScreen` de hoje tem 2,97 KB crus. A coreografia, o pular e o portão da fonte aumentam esse arquivo. O Framer Motion do voo já está no grafo da home (`index` 131,5 KB e `proxy` 109,7 KB). Não entra biblioteca nova.

Com cerca de 4 KB de CSS e 5 KB de JS a mais, a home seguiria acima de 300 KB de JS e de 50 KB de CSS no byte cru, e abaixo dos dois tetos no gzip. A v2 não muda esse veredito. O build seguinte mediu 11190 bytes crus a mais em `src/styles/giro-loader.css`, de 715 para 11905, quase o triplo desta estimativa de CSS. O veredito dos tetos não muda.

O LCP da v2 não foi medido neste registro. A medição do ramo implementado está na seção seguinte.

## Build da v2 em 2026-11-01

Este é o primeiro build com a tela v2 em `src/`. Os bytes de CSS e do chunk ficaram menores do que o build seguinte, feito depois da cópia de tinta e da seleção. `bun run build`, Astro 5.18.1. O HTML saiu de `dist/client` e foi servido em `http://127.0.0.1:4322`. Este ramo espera `document.fonts.load` da Anybody e nasce cada letra com opacidade 0.

O grafo da home continua com 37 arquivos de JS. O gzip desta tabela saiu de `zlib.gzipSync` do Node, no nível padrão.

| | cru | gzip |
| --- | ---: | ---: |
| JS da home | 454711 | 161917 |
| CSS das duas folhas do head | 77795 | 15889 |

O chunk `LoadingScreen` pesa 7022 bytes crus e 2584 gzip. No log do Vite de 2026-10-31 ele tinha 2,97 KB crus. `src/styles/giro-loader.css` tem 8657 bytes (2167 gzip). Antes do porte tinha 715 bytes.

A home segue acima de 300000 bytes de JS e de 50000 de CSS no byte cru, e abaixo dos dois no gzip. O case Atlas pede 357251 bytes de JS cru (122873 gzip) e 84045 de CSS cru (17613 gzip).

O preload e o `url()` do CSS apontam para o mesmo arquivo: `/_astro/anybody-latin-wdth-wght.CHqbGEEr.woff2`, 56888 bytes. A Geist Mono desse build tem 23128 bytes.

Lighthouse 13.6.0, simulação móvel, Chrome 154, contra esse servidor local. Não é a rede de produção. O registro de 2026-10-31 usou o Lighthouse 12, então a nota não se compara direto.

| Página | Nota | LCP | FCP | TBT | CLS | Elemento |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Home | 0,64 | 6,7 s | 1,8 s | 240 ms | 0,087 | `p.hr-lede` |
| Case Atlas Marine | 0,89 | 3,0 s | 1,7 s | 0 ms | 0,084 | a foto do hero |

O nome da tela não foi o LCP. No laboratório móvel o elemento continua o parágrafo do hero. Num Chrome local sem throttling, com o observador ligado antes do primeiro paint, o candidato final também foi esse parágrafo: 47371 px² aos 1152 ms em 412×823, e 61494 px² aos 1288 ms em 1440×900. Em 1440 px a letra "n" do loader (`span.g-loader__lt`) chegou a candidato com 6102 px² e perdeu para o hero. O nome está partido em um span por letra, então nenhum nó da assinatura alcança a área do parágrafo.

O insight de breakdown da home listou TTFB de 4 ms e atraso de render de 1,1 s. Essas duas parcelas não somam os 6,7 s da métrica. Nesta versão não dá para repetir que 93% do LCP era atraso de render.

O chunk `SignatureSizePrototype` aparece no log do Vite com 6,81 KB e nenhuma página HTML o referencia. Não entra nos 37 arquivos da home.

## Outro relógio, medido e revertido em 2026-11-01

Laboratório no servidor de desenvolvimento (`bun run dev`, porta 4321), Chrome 154, sem throttling. Não é o build estático da seção anterior e não é o Lighthouse. A tela foi forçada a começar a coreografia sem esperar `document.fonts.load`. O pedido do woff2 da Anybody foi atrasado 6 s. Depois da medição o código voltou a esperar a fonte. A issue 72 continua aberta.

No instante em que o Playwright viu `data-run="play"`, `document.fonts.check('800 16px "Anybody"', "bruno guimarães")` era falso. A letra amostrada já estava quase desdobrada: opacidade perto de 1 e `font-stretch` perto de 115%. O nome visível nessa passagem era o fallback.

O observador de LCP, instalado antes da navegação, não teve letra do loader como candidato final.

| Viewport | Candidato final | Área | Tempo |
| --- | --- | ---: | ---: |
| 412×823 | `p.hr-lede` | 48246 | 1944 ms |
| 1440×900 | `span.hr-l1` ("Interfaces") | 244490 | 1740 ms |

Em 1440 px o primeiro candidato foi um `span` sem classe, texto " guimarães", 4800 px² aos 432 ms. É a assinatura do header, não uma letra do loader. Perdeu para o hero.

`data-loader` saiu cerca de 7,4 s depois do reload em 412 px, e cerca de 7,5 s em 1440 px. Esse intervalo inclui o reload e a hidratação, depois os 3485 ms e o fade. Com a fonte atrasada 6 s, este relógio tira a tela sem esperar a Anybody. O ramo que espera `fonts.load` não foi medido de novo neste atraso.

## Build seguinte, ainda em 2026-11-01

O build da seção anterior é anterior à cópia de tinta, ao tamanho da seleção e à saída com a raiz transparente. `bun run build` de novo, Astro 5.18.1, servido em `http://127.0.0.1:4322`. O ramo continua esperando `document.fonts.load`. O gzip é `zlib.gzipSync` do Node, no nível padrão. O grafo segue só o `import` estático a partir do HTML.

| | cru | gzip |
| --- | ---: | ---: |
| JS da home (37 arquivos) | 455591 | 162120 |
| CSS das duas folhas do head da home | 80461 | 16337 |

O chunk `LoadingScreen.Uj3B8BIL.js` pesa 7953 bytes crus e 2863 gzip. `src/styles/giro-loader.css` tem 11905 bytes (2691 gzip). A home segue acima de 300000 bytes de JS e de 50000 de CSS no byte cru, e abaixo dos dois no gzip. O case Atlas pede 358131 bytes de JS cru (123076 gzip, 29 arquivos) e 86711 de CSS cru (18061 gzip, três folhas).

O preload da Anybody continua em `/_astro/anybody-latin-wdth-wght.CHqbGEEr.woff2`, 56888 bytes. A Geist Mono continua com 23128 bytes. `SignatureSizePrototype` segue no log do Vite com 6,81 KB e fora do grafo da home.

JS, CSS e as duas fontes, no byte cru, somam 455591 + 80461 + 56888 + 23128 = 616068. O HTML da home pesa 114564 bytes. O do case Atlas pesa 50784. O teto de 1000000 inclui as imagens. No HTML da home deste build as seis imagens têm `loading="lazy"` e somam 431490 bytes. JS, CSS, fontes e as seis dariam 1047558, sem o HTML. Com o HTML, 1162122, acima do teto. O `avatar.webp` (7910 bytes) entra no `check:media-budget` como imagem inicial, mas este HTML não o pede.

No Chrome local, sem throttling, o que terminou de baixar antes de `data-loader` sair foi menos do que as seis. Em 412×823: `capa-estudio-entre.webp` (33866) e `atlas-marine-solutions.webp` (60088), 93954 bytes, mais o `favicon.svg` de 302. Em 1440×900 entrou também `movies-bremen.webp` (60114), 154068 bytes de imagem, mais o favicon. A foto do sobre e as outras capas não entraram. JS, CSS, fontes, HTML e essas imagens somam 824586 bytes no celular e 884700 no computador, os dois abaixo de 1000000, sem o favicon.

O case Atlas pediu a foto do hero, 60088 bytes, com `fetchpriority="high"`, mais o favicon. A folha compartilhada ligada nessa página, `_slug_.Csvglrpa.css`, pede Anybody e Geist Mono. JS, CSS, fontes e essa foto somam 584946. Com o HTML, 635730, abaixo de 1000000, sem o favicon.

Outra passagem, com o perfil Slow 4G aplicado (latência de 150 ms, download de 1638,4 Kbps, CPU 4×), trouxe as mesmas imagens antes da saída. Elas terminaram entre 1,8 s e 3,4 s. A tela saiu aos 10,9 s no celular, aos 12,1 s no computador e aos 6,1 s no case, contados do reload. Não é a simulação de nota do Lighthouse e não é a rede de produção.

Chrome local sem throttling, observador de LCP antes do primeiro paint, `sessionStorage` limpo para a tela aparecer. A Anybody já estava disponível quando a tela saiu.

| Página | Viewport | Candidato final | Área | Tempo |
| --- | --- | --- | ---: | ---: |
| Home | 412×823 | `p.hr-lede` | 47371 | 1264 ms |
| Home | 1440×900 | `p.hr-lede` | 61494 | 1248 ms |
| Case Atlas | 412×823 | `img` do hero | 72580 | 200 ms |
| Case Atlas | 1440×900 | `img` do hero | 414120 | 212 ms |

Em 1440 px na home o primeiro candidato foi de novo o `span` sem classe do header, texto " guimarães", 5103 px² aos 276 ms. Nenhuma letra do loader entrou na lista. O nome partido em spans, com opacidade 0 no começo, continua menor que o parágrafo do hero e que a foto do case.

Lighthouse 13.6.0, a mesma simulação móvel do build anterior (CPU 4×, rede lenta). Duas passagens na home, uma no case.

| Página | Nota | LCP | FCP | TBT | CLS | Elemento |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Home, passagem 1 | 0,35 | 6,8 s | 2,0 s | 3613 ms | 0,083 | `p.hr-lede` |
| Home, passagem 2 | 0,38 | 6,8 s | 1,8 s | 1813 ms | 0,089 | `p.hr-lede` |
| Case Atlas Marine | 0,88 | 3,0 s | 1,7 s | 37 ms | 0,083 | a foto do hero |

O LCP não se moveu: 6,7 s no build anterior, 6,8 s neste, os dois no parágrafo do hero. O case ficou em 3,0 s na foto, nota 0,88 contra 0,89. O TBT da home não se repetiu (3613 ms e 1813 ms). No build anterior uma passagem deu 240 ms. A nota 0,35 e 0,38 segue esse TBT. Não dá para ler a queda como custo dos bytes novos da tela. O breakdown da home lista TTFB de 6 ms e atraso de render de 1,6 s. Essas duas parcelas não somam os 6,8 s.
