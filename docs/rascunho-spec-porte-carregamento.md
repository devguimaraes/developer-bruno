# Spec de porte da tela de carregamento v2

Fecha a issue 73. Fonte, tamanho e orçamento foram decididos em 2026-11-01. O resto já estava decidido nas issues 65 a 69.

Fontes: `motion/SPEC.md` (seção "SPEC · Tela de carregamento"), `motion/compositions/loader.html`, issues 65 a 69, `docs/pesquisa-fonte-anybody-carregamento.md`, `docs/pesquisa-orcamento-carregamento.md`.

## Quando aparece

Só na primeira visita da sessão, como hoje (`claimFirstVisit`).

## Coreografia

Com a página já pronta, ela aparece aos 5425 ms, contados do começo da coreografia. O estudo durava 3485 ms. Em 2026-11-01 o relógio foi alongado cerca de uma vez e meia, no computador e no celular, porque as trocas de cor e os movimentos passavam rápido demais. O disco dura 520 ms e usa uma curva de ida e volta (`cubic-bezier(0.42, 0, 0.58, 1)`), para o preenchimento aparecer. No celular a duração é a mesma. Só o raio inicial continua 20 px.

- 0: azul-sinal. Giro em carregando. A linha do nome é um flex centralizado. O deslize de 282 px do estudo não entra.
- 120 a 1197: cada letra sai de `font-stretch` 50% e opacidade 0 e chega a 115% e opacidade 1, em 600 ms, curva `resolve` (`cubic-bezier(0.2, 0.8, 0.2, 1)`), 53 ms entre letras, a partir do "o". O traço do Giro vai de 12 a 22 entre 225 e 975.
- 1500: disco lima, 520 ms. Nasce no centro do Giro, com raio de 52 px no computador e 20 px no celular. No quadro do estudo termina em 1420 px e 570 px. No porte o raio final é `150vmax`, para cobrir a tela fora desses dois quadros. A cor nova do texto entra com o recorte do disco. O Giro troca de cor no começo dele.
- 1575: linha 1 digitada em 390 ms, um passo por caractere, cursor de bloco.
- 2175: disco papel. Texto e Giro continuam em azul-sinal.
- 2250: linha 2, e o "o" é selecionado como componente. Caixa de 2 px em azul-sinal (1,5 px no celular), de escala 1,15 a 1 em 330 ms, curva `resolve`. As quatro alças nascem em escala 0 e chegam a 1 em 360 ms, curva `hop`, com 45 ms entre elas a partir de 2295 ms. A alça vai de 7 px em 390 px a 12 px em 1920 px. A etiqueta `<Giro />` vai de 10 px a 16 px e sobe 8 px em 330 ms a partir de 2340 ms. Some com o disco seguinte.
- 2850: disco tinta. A cor nova do texto entra com o recorte. O Giro volta a lima no começo do disco.
- 2925: linha 3. As linhas se acumulam.
- 3525: disco azul. Só no computador. No celular a volta termina na tinta, a cor da barra de abas.
- 4045: pronto. O Giro vai a `done` (fim da volta, sorriso, pulo) e o cursor some. Se a página ainda não estiver pronta, o Giro segue girando na última cor até o primeiro quadro. Não há outro teto.
- 4645 a 5425: saída, 780 ms, curva `resolve`. No computador a assinatura inteira encolhe até o header. A origem é o centro do "o" e a escala é a largura do Giro de destino dividida pela largura do "o". 26/136 é a razão do quadro de 1920 px, não uma escala fixa para toda largura. O painel recolhe para cima e as linhas vão com ele. A raiz do overlay não pinta fundo: o azul fica na camada. No celular o Giro voa até o botão da barra (traço de 22 a 14), o painel desce e apaga o nome e as linhas, no mesmo 780 ms. Nos dois, o miolo da página começa 24 px abaixo e sobe até o lugar durante a saída. Com movimento reduzido a página não se desloca: só o fade de 360 ms. No fim, o overlay some em 360 ms.

Clique, tecla ou rolagem adiantam para essa saída. A visita fica marcada.

Lima é fundo só nesta tela, de 1500 ms a 2175 ms.

## Textos

Chaves `loader.line1`, `loader.line2`, `loader.line3`.

- pt: `// desenvolvedor front-end`, `// construo interfaces`, `// design systems`
- en: `// front-end developer`, `// i build interfaces`, `// design systems`

O nome "bruno guimarães" não muda com o idioma. O leitor de tela continua com `role="status"` e `loader.label`. As linhas ficam escondidas dele.

## Home

A assinatura pousa no header no computador e na barra de abas no celular, como nas outras páginas. No pouso, o hero lança o Giro para o palco. A tela não acena. No celular o hero também sai da barra de abas.

## Movimento reduzido

Nome e as três linhas já escritas, só azul-sinal, 600 ms, fade de 240 ms. Sem giro, desdobramento, digitação, troca de cor ou voo. Se a página não estiver pronta, espera o primeiro quadro. Não espera a fonte. Clique, tecla ou rolagem adiantam esse fade, sem começar o voo.

## Fonte

Decidido na issue 71. Preload do woff2 importado no `Layout.astro`, com `as="font"`, `type="font/woff2"` e `crossorigin`. Manter `font-display: swap`. O desdobramento só começa quando `document.fonts.load('800 16px "Anybody"', "bruno guimarães")` cumpre. Até lá o Giro gira sozinho. Se a promise rejeitar ou a lista voltar vazia, a tela segue. Cada linha do nome fica com `white-space: nowrap`. Movimento reduzido não espera a fonte.

## Tamanhos

Decidido na issue 70. Variante A: o nome vai de 50 px em 390 px a 136 px em 1920 px, `clamp(50px, calc(50px + (100vw - 390px) * 86 / 1530), 136px)`. O código vai de 15 px a 26 px, `clamp(15px, calc(15px + (100vw - 390px) * 11 / 1530), 26px)`. Abaixo de 960 px o sobrenome desce. Cada lado do nome fica com `white-space: nowrap`. O Giro no lugar do "o" mede 0,74 em do nome, como no estudo. Pela conta do clamp, em 768 px o nome fica em 71,2 px, o "o" em 52,7 px e o código em 17,7 px. Em 1440 px, 109,0 px, 80,7 px e 22,5 px. Nos quadros do estudo o "o" dá 37 px em 390 px e 100,6 px em 1920 px. Medido com a Anybody carregada, o nome coube: 113 a 1327 px numa tela de 1440 px, e 16 a 374 px numa de 390 px. O deslize de 282 px do estudo vale para o quadro em que o "o" começa fora do centro. No porte a linha inteira é um flex centralizado, então esse deslocamento não entra.

## Orçamento

No build seguinte de 2026-11-01, já com a cópia de tinta e a seleção, a home pede 455591 bytes de JS cru (162120 gzip) e 80461 de CSS cru (16337 gzip). O chunk da tela pesa 7953 bytes crus. Continua acima dos tetos crus e abaixo no gzip. No Lighthouse 13, simulação móvel contra servidor local (não é produção), o LCP da home ficou em 6,7 s no primeiro build e em 6,8 s no seguinte, os dois em `p.hr-lede`. O do case Atlas ficou em 3,0 s na foto. A nota da home no build seguinte ficou em 0,35 e 0,38, puxada por um TBT que não se repetiu: 3613 ms e 1813 ms, contra 240 ms numa passagem do build anterior. A queda não pode ser atribuída aos bytes da tela. Sem throttling, o LCP final também continuou no hero e na foto. O nome da tela não virou o LCP. Com as imagens que terminaram antes da tela, no perfil Slow 4G aplicado, a soma de JS, CSS, fontes, HTML e essas imagens fica abaixo de 1000000 bytes. Os números e o método estão em `docs/pesquisa-orcamento-carregamento.md`.

## DS e glossário

O ADR 0001, revisão de 31 de outubro de 2026, e o verbete "Tela de carregamento" no `GLOSSARY.md` já registram a coreografia fixa, a exceção da lima, o pouso e o movimento reduzido. Editar à mão o artefato do Design System (decisões 29 e 36, e a exceção da lima) continua fora do repositório e não trava esta spec.

## Testes

- `LoadingScreen.test.tsx` cobre a visita marcada, o sorriso aos 4045 ms, a espera da página, o voo, o pular durante a espera da fonte, o movimento reduzido, o pular nesse fade, a origem do disco e o cursor por linha.
- `giro.spec.ts` e `home.spec.ts` no Chromium passaram no mesmo dia, 15 testes. O aceno fora da home, a ausência de aceno na home e o `overflow-x: clip` continuam.

Nada ficou em aberto para o porte. Editar à mão o artefato do Design System continua fora do repositório.
