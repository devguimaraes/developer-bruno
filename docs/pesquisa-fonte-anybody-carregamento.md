# Fonte Anybody durante o carregamento

Pesquisa da issue [71](https://github.com/devguimaraes/developer-bruno/issues/71). Astro do repositório: 5.18.1 (`node_modules/astro/package.json`). A comparação das opções não veio de um laboratório. O que o build de 2026-11-01 confirmou está no fim desta nota.

## Pergunta

Como garantir que o nome da tela de carregamento v2 já esteja desenhado na Anybody quando começa a se desdobrar, se esse arquivo é uma das coisas que ainda estão a caminho?

O desdobramento do estudo começa aos 80 ms da tomada. Isso é menos do que dá para prometer num download frio. A garantia tem de ser um instante em que a face já carregou, não um palpite de que o arquivo chegou a tempo.

## O que o site fazia antes do porte (2026-10-31)

A tela de então não desenhava o nome. `LoadingScreen` mostra o Giro e um texto só para leitor de tela (`src/components/loader/LoadingScreen.tsx`). O overlay fica `display: none` até o `<html>` ganhar `data-loader` (`src/styles/giro-loader.css`). Um script `is:inline` no começo do `<head>` de `src/layouts/Layout.astro` põe `data-loader="on"` na primeira visita da sessão, antes do que o comentário do arquivo chama de primeiro paint. O mesmo script, aos 8 s, só tira o atributo se o valor ainda for `"on"`. Quando o React monta, troca para `"mounted"` (`LoadingScreen.tsx`). Esse backstop não solta uma tela que já passou para `"mounted"`.

A tela de então esperava a página entre 600 ms e 1500 ms, segurava 400 ms no estado pronto, voava 520 ms e sumia em 240 ms (`MIN_MS`, `MAX_MS`, `DONE_HOLD_MS`, `FLIGHT_MS`, `FADE_MS` em `LoadingScreen.tsx`). Não havia `document.fonts` nem `<link rel="preload">` no layout.

A Anybody está num `@font-face` só (`src/styles/giro.css`):

- família `"Anybody"`, peso `100 900`, `font-stretch: 50% 150%`
- `font-display: swap`
- um arquivo, `src/assets/fonts/anybody-latin-wdth-wght.woff2` (56888 bytes), `format("woff2-variations")`
- `unicode-range` latino, que inclui `U+0000-00FF`
- pilha `--font-sans: "Anybody", "Arial Black", system-ui, sans-serif`

O CSS entra por `import "@/index.css"` no layout, e `src/index.css` importa `giro.css`. O `astro.config.mjs` não muda `build.inlineStylesheets` nem `build.assets`. No Astro 5.18.1 o padrão de `inlineStylesheets` é `auto`: folha menor que `assetsInlineLimit` (4 kb) entra no HTML, o resto vai para um arquivo externo (`node_modules/astro/dist/types/public/config.d.ts`). O padrão do Vite para esse limite é 4096 bytes (`node_modules/vite/dist/node/constants.js`, `DEFAULT_ASSETS_INLINE_LIMIT`). As folhas em `src/styles/` e `src/index.css` somam 97328 bytes, então a folha empacotada não cabe nos 4 kb. A Anybody não está em `public/`. O header de computador renderiza a assinatura no HTML inicial (`src/components/nav/SiteHeader.tsx` usa `Signature`, texto "brun" e "guimarães" em `src/components/nav/Signature.tsx`).

Um `@font-face` sozinho não pede o arquivo. O navegador baixa a fonte quando algum estilo que a usa está aplicado a um elemento da página ([web.dev, Best practices for fonts](https://web.dev/articles/font-best-practices), seção "Understand `@font-face`"). Com a folha externa, a descoberta da Anybody espera o CSS e, em seguida, o texto que a usa. O nome da v2, aos 80 ms, entra nessa corrida.

O estudo v2 (`motion/SPEC.md`, "SPEC · Tela de carregamento", e `motion/compositions/loader.html`) assume a fonte já presente: o estúdio carrega o woff2 local em `motion/index.html`. Na tomada, `T.unfold` é `0.08`. Cada letra vai de `fontStretch: "50%"` e opacidade 0 a `"115%"` e opacidade 1, em 400 ms, com 35 ms entre letras, a partir do "o" (`letter()` em `loader.html`). O nome é Anybody, peso 800 (`font-weight: 800` em `.sig`). O porte da spec diz que a página aparece em 3,5 s e que a largura das letras fica em CSS, com `font-stretch` e `animation-delay`.

## Opções

### Preload do woff2 no layout

`<link rel="preload" as="font">` pede o arquivo cedo, antes do maquinário principal de renderização. Fonte e `fetch` exigem `crossorigin`, mesmo na mesma origem, porque a busca de fonte usa CORS anônimo. Sem o atributo, o preload e o `@font-face` não compartilham o cache e o arquivo baixa duas vezes. O `type="font/woff2"` faz o navegador ignorar o preload se não souber o formato ([MDN, `rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload)).

O preload não aplica a fonte e não segura animação. Ele só antecipa o download. Os 80 ms da tomada continuam podendo desenhar o fallback.

No LCP: texto que espera fonte pode atrasar o LCP em alguns casos ([web.dev](https://web.dev/articles/font-best-practices), abertura). Adiantar o arquivo encolhe essa espera quando o elemento de LCP é texto que depende da fonte. O web.dev pede cautela: o preload tira banda de outros recursos, ignora `unicode-range` e deve cobrir um formato só. Aqui o arquivo já é o subset latino, e o nome cabe nesse `unicode-range`, então o preload não puxa um arquivo que o `unicode-range` teria dispensado. Com folha externa, o mesmo artigo diz que precarregar a fonte mais importante é eficaz, porque sem isso o navegador só descobre a fonte depois do CSS.

No tempo da tela: zero. O relógio da coreografia não muda. O que muda é a chance de o arquivo já estar lá quando os 80 ms chegam. Isso não é garantia.

### `font-display`: block, swap, fallback, optional

O descritor vale para a face inteira, não para um elemento. Mudar o `@font-face` de `giro.css` muda header, hero e corpo junto com o nome da tela ([MDN, `font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)).

O relógio da face tem três períodos. No block, o texto usa um fallback invisível: mesma métrica da primeira face já carregada da pilha, glifos sem tinta. No swap, usa o fallback visível. No failure, a face é tratada como falha e fica o fallback. Os números abaixo são recomendação, e o agente pode usar durações um pouco diferentes ([CSS Fonts Module Level 4, `font-display`](https://drafts.csswg.org/css-fonts-4/#font-display-desc)). A MDN não fixa milissegundos. O Firefox ainda expõe essas durações em preferência ([MDN, `font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)). A tabela do web.dev é mais fechada e não bate palavra por palavra com a spec:

| Valor | Spec (recomendado) | web.dev |
| --- | --- | --- |
| `block` | block curto, 3 s na maioria dos casos; swap infinito | block de 2 a 3 s; swap infinito |
| `swap` | block extremamente curto, 100 ms ou menos; swap infinito | block de 0 ms; swap infinito |
| `fallback` | block de 100 ms ou menos; swap curto, 3 s na maioria dos casos | block de 100 ms; swap de 3 s |
| `optional` | se não der para a primeira pintura, block e swap contam como já vencidos | block de 100 ms; sem swap |

`swap` é o valor de hoje. O texto pinta no fallback quase na hora. O LCP do texto não fica preso ao download. A troca posterior pode deslocar layout: o web.dev trata isso como CLS, não como um segundo LCP. Aos 80 ms de uma visita fria o nome está no fallback. A tela não espera. A garantia falha.

`block` deixa o texto da Anybody invisível durante o block (cerca de 3 s na recomendação da spec) e troca quando o arquivo chega, sem prazo. Se o texto de LCP for Anybody, a primeira pintura desse texto espera a fonte ou o fim do block, e texto atrasado pode atrasar o LCP ([web.dev](https://web.dev/articles/font-best-practices)). A spec manda usar `block` só em texto curto em que a face é obrigatória para a página ser usável. O nome cabe em "texto curto". O mesmo descritor também apagaria o resto do site que usa essa face. O relógio da tela não cresce: a animação CSS não é um período de `font-display`. O usuário pode não ver o desdobramento, porque ele corre enquanto os glifos estão sem tinta e, quando a Anybody entra, o `font-stretch` já pode estar em 115%.

`fallback` segura no máximo cerca de 100 ms no invisível e só troca se a fonte chegar na janela de cerca de 3 s. Depois disso o fallback fica até o fim da vida da página. O atraso de LCP é curto. A garantia falha quando o arquivo passa da janela. A tela não espera.

`optional` é o melhor número de LCP e de CLS no artigo do web.dev: no máximo cerca de 100 ms sem texto, e sem troca tardia. Se a fonte não está pronta para a primeira pintura, o navegador pode nem baixar, ou baixar com prioridade baixa, e não pode aplicá-la depois que o fallback já pintou ([CSS Fonts 4](https://drafts.csswg.org/css-fonts-4/#font-display-desc)). A spec diz que heurística de preload para `optional` não pode ser tratada como garantia. Na primeira visita da sessão, que é quando a tela aparece, o arquivo de 56888 bytes em geral não está na primeira pintura. O nome fica no fallback a visita inteira.

Nenhum valor de `font-display` cria um instante em que a animação de largura começa com a Anybody já aplicada.

### Esperar `document.fonts.load` antes do desdobramento

`FontFaceSet.load(font, text)` força o carregamento das faces pedidas. A promise cumpre com as `FontFace` carregadas e rejeita se alguma falha. O segundo argumento limita as faces cujo `unicode-range` contém ao menos um caractere do texto. O padrão é um espaço (`" "`). Carregar uma face que já está carregada não dispara outro download ([MDN, CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API); [MDN, `FontFaceSet.load()`](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load)).

O espaço padrão cai em `U+0000-00FF`, então já seleciona este `@font-face`. Passar `"bruno guimarães"` amarra o pedido aos caracteres do nome, inclusive `ã` (`U+00E3`, dentro do mesmo intervalo). O peso 800 cabe em `font-weight: 100 900`. Há um `src` só, cobrindo `font-stretch: 50% 150%`. Um `load()` dessa face baixa esse arquivo. A forma da MDN é um atalho de fonte, por exemplo `"800 16px Anybody"`. O tamanho não seleciona outra face: este `@font-face` não tem `font-size`.

`document.fonts.ready` cumpre quando todas as fontes já pedidas pelo documento resolveram e o layout fechou ([MDN, CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API)). Isso inclui a Geist Mono (23128 bytes, outro `@font-face` em `giro.css`) se algum texto já a tiver pedido. O nome não precisa dessa espera.

Enquanto a promise não cumpre, só o Giro gira. O Giro é SVG e já está no HTML da tela. A classe que dispara `font-stretch` e `animation-delay` entra depois do cumprimento. Os 80 ms, os 35 ms e os 400 ms continuam sendo a coreografia do estudo, contados desse instante, não do primeiro paint.

No LCP: o nome só pinta depois da fonte. Se esse nome for o elemento de LCP, a espera da fonte entra no LCP, pelo mesmo mecanismo do web.dev (texto atrasado pode atrasar o LCP). O resto da página permanece em `swap`, então não fica invisível por cerca de 3 s.

No tempo da tela: a coreografia de 3,5 s do porte (`motion/SPEC.md`) começa quando a promise cumpre. Antes disso a tela mostra o Giro. O tempo de parede é a espera da fonte mais 3,5 s. Com a face já carregada, `load()` não baixa de novo e a espera some. Se a chamada ficar só na ilha `client:load`, a espera também inclui o JS da hidratação. A promise rejeitada tem de seguir a tela: o backstop de 8 s não remove `data-loader="mounted"`.

### Como o Astro serve o arquivo hoje

Arquivo importado que não é imagem vira a URL final do build, no formato `/_astro/nome.hash.ext` ([Astro, Imports](https://docs.astro.build/en/guides/imports/), "Other assets"). `url()` dentro de CSS passa pelo mesmo tratamento: no dev a URL é a do fonte (`/src/...`), no build o nome leva hash, e arquivo menor que `assetsInlineLimit` vira data URL ([Vite, Static Asset Handling](https://vite.dev/guide/assets)). 56888 bytes estão acima de 4096, então o woff2 sai como arquivo, não como base64.

O diretório padrão desses assets é `_astro` (`build.assets` em `node_modules/astro/dist/types/public/config.d.ts`). O `astro.config.mjs` não redefine isso. Arquivo em `public/` seria copiado com o caminho estável. A Anybody não está lá.

Um `href` escrito à mão não é estável. No dev e no build a URL muda, e o hash muda quando os bytes do arquivo mudam. O `href` estável é o valor que o import devolve no frontmatter de `Layout.astro`, o mesmo pipeline que reescreve o `url()` do CSS. Os dois pedidos só se encontram se a URL e o modo CORS forem os mesmos (MDN, acima).

O Astro 5.18.1 também tem a Fonts API: `fonts` no config, `<Font preload />` e campo `stretch`, que o gerador escreve como `font-stretch` ([guia de fontes](https://docs.astro.build/en/guides/fonts/); `node_modules/astro/dist/assets/fonts/utils.js` e `providers/local.js`). O site não usa essa API. O `@font-face` atual, o `unicode-range` e o fallback `"Arial Black"` estão escritos à mão. A API, por padrão, usa `font-display: swap` e tenta gerar fallback otimizado (`types.d.ts`, `optimizedFallbacks` padrão `true`). `<Font preload>` adianta o arquivo. Não segura os 80 ms.

## Recomendação

Segurar o desdobramento em `document.fonts.load` da Anybody 800, e antecipar o mesmo woff2 com preload da URL importada. Manter `font-display: swap`.

O preload sozinho não garante os 80 ms. `block` esconde texto demais e não segura a animação. `fallback` e `optional` podem deixar o nome no fallback a visita inteira, e a tela só roda na primeira visita da sessão. `load()` é o único mecanismo, entre os pedidos, que tem um instante definido em que a face já carregou antes da largura começar a mudar. O preload existe para essa espera ser o resto de um download que começou no HTML, não um download descoberto depois do CSS. O `crossorigin` é obrigatório para os dois pedidos serem o mesmo.

Chamada, depois que o `@font-face` já está no documento:

```js
document.fonts.load('800 16px "Anybody"', "bruno guimarães")
```

No cumprimento, aplicar a classe da animação. Na rejeição, ou se a lista de faces voltar vazia, seguir a tela mesmo assim: o desdobramento não fica preso. Não usar `document.fonts.ready` para este portão: ele espera as outras faces já pedidas, entre elas a Geist Mono.

Este portão empurra o início dos 3485 ms. Na decisão já fechada, a página aparece aos 3485 ms se já estiver pronta, contados do começo da coreografia. Com a espera da fonte na frente, o tempo de parede passa a ser essa espera mais 3485 ms. Os dois só coincidem quando a Anybody já está pronta no primeiro paint. Isso não é fato do estudo. O Bruno confirmou este relógio em 2026-11-01. Clique, tecla ou rolagem durante a espera adiantam para a saída, como no resto da tela. Com movimento reduzido não há desdobramento, então a tela não espera a fonte.

Não migrar a Anybody para a Fonts API neste trabalho. O preload que ela emite não substitui o portão, e a troca reescreve a face que o eixo de largura usa.

## Efeito em LCP e no tempo da tela

| Opção | LCP | Tempo da tela |
| --- | --- | --- |
| Preload, `swap` como está | Adianta o arquivo do texto que depende da Anybody. Não segura pintura. | A coreografia não espera. Aos 80 ms o nome pode estar no fallback. |
| `block` na face inteira | Texto Anybody invisível por cerca de 3 s (recomendação da spec). Se esse texto for o LCP, o LCP espera. | O relógio da tela não cresce. O desdobramento pode terminar invisível. |
| `swap` (hoje) | O texto pinta no fallback. O download não segura essa primeira pintura. A troca pode deslocar layout (CLS). | A tela não espera. A garantia falha. |
| `fallback` | No máximo cerca de 100 ms sem texto, depois o fallback. | A tela não espera. Se o arquivo passar de cerca de 3 s, a Anybody não entra nessa visita. |
| `optional` | Atraso de texto de no máximo cerca de 100 ms, sem troca tardia. | A tela não espera. Na visita fria o nome tende a ficar no fallback o tempo todo. |
| `fonts.load` antes do desdobramento, com preload e `swap` | O nome só pinta com a Anybody. Se o nome for o LCP, essa espera entra no LCP. O resto do site continua em `swap`. | Giro desde o primeiro paint. Os 3,5 s da coreografia começam quando a promise cumpre. Preload encolhe essa espera. Cache quente: `load()` de face já carregada não baixa de novo. |

A estratégia recomendada é a última linha. O custo de tempo fica na frente da coreografia, não no meio dela: cor, linha e saída continuam nas marcas do estudo, contadas a partir da fonte pronta. O custo de LCP da tabela vale se o nome for o elemento de LCP. No build seguinte de 2026-11-01 ele não foi. O nome fica partido em spans, com opacidade 0 no começo. O LCP da home ficou em `p.hr-lede` e o do case na foto. O outro relógio, com o nome visível no fallback, também não passou o LCP para a assinatura. Essa medição está em `docs/pesquisa-orcamento-carregamento.md`. Ela não fecha esta issue.

## O que a spec de porte deve copiar literalmente

Fatos do estudo e do CSS atual. Não são decisão nova.

- Nome em Anybody, peso 800. Cada letra sai de largura 50% e opacidade 0 e chega a 115% e opacidade 1, em 400 ms, curva `resolve` (`cubic-bezier(0.2, 0.8, 0.2, 1)` em `motion/SPEC.md` e `--ease-resolve` em `giro.css`), 35 ms entre letras, a partir do "o", começo aos 80 ms da tomada (`motion/SPEC.md`; `T.unfold = 0.08` e `letter()` em `motion/compositions/loader.html`).
- A página do estudo aparece em 3,5 s contados do começo da tomada (`motion/SPEC.md`).
- Animar o eixo de largura (`font-stretch`, alias de `font-width`) no nome exige que a linha não quebre. `.g-signature` já tem `white-space: nowrap` (`src/styles/giro-nav.css`). No estudo, `.sig` usa `white-space: pre`, que a MDN equivale a preservar espaços e não quebrar linha ([MDN, `white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)). No celular o sobrenome vai para a segunda linha por posição (`.m .sig-r { top: 1em }` em `loader.html`), não porque uma letra quebrou. Se uma letra quebrar, a largura animada muda o tamanho em linha dos glifos e a linha reflui.
- `font-stretch` anima por valor computado, como porcentagem ([MDN, `font-stretch`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch), "Animation type: by computed value type"). A porcentagem é a largura fracionária dos glifos. Em fonte variável, quem implementa isso é o eixo `wdth`. Se a face usada não tem a largura pedida, entra a largura mais próxima. Se a fonte não oferece faces condensadas ou expandidas, a propriedade não tem efeito visual ([MDN, `font-stretch`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch); [CSS Fonts 4, font-width](https://drafts.csswg.org/css-fonts-4/#font-width-prop)). Enquanto a face usada é o fallback, a animação do valor existe e o desdobramento da Anybody não. A Anybody desta face declara `font-stretch: 50% 150%`. O efeito do estudo começa quando essa face é a que pinta.

## O que não ficou preso a uma fonte primária

- Não há uma frase, na MDN nem na CSS Fonts 4, dizendo que `font-display` pausa ou não pausa uma animação CSS. O que está escrito: `font-display` escolhe a face pintada, e `animation-delay` é o atraso entre o elemento e o começo da sequência ([MDN, Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)). A leitura de que o relógio dos 80 ms segue mesmo com o texto invisível é inferência desses dois textos.
- Não foi conferido se "Arial Black" no sistema de quem visita tem eixo de largura. A regra geral está na MDN e na spec. O inventário dessa face, não.
- O overlay `position: fixed` não tirou o parágrafo do hero do LCP no build de 2026-11-01. O elemento medido está em `docs/pesquisa-orcamento-carregamento.md`.
- A URL com hash foi conferida depois, no build de 2026-11-01. Está na seção final. A diferença entre dev e produção continua vindo da documentação do Astro 5.18.1 e do Vite.
- A MDN diz que `load()` rejeita se uma fonte falha ao carregar. Não diz o que a promise faz se `"Anybody"` ainda não entrou no documento porque o CSS não aplicou. A chamada tem de acontecer depois do `@font-face`.
- Não há tempo de produção para os 56888 bytes. No laboratório local, perfil Slow 4G aplicado (latência de 150 ms, download de 1638,4 Kbps, CPU 4×), viewport 412×823 e cache desligado, o woff2 terminou aos 1,3 s da navegação em três passagens: 1330 ms, 1325 ms e 1321 ms. O pedido começou por volta de 237 ms. A transferência foi de 57188 bytes. Quando o `data-run="play"` foi visto, `document.fonts.check` já era verdadeiro. A tela saiu por volta de 11,3 s nesse relógio. O intervalo entre o arquivo pronto e o começo da coreografia inclui a hidratação com CPU 4×. Não é o tempo de download.

## Conferido no build de 2026-11-01

`dist/client/index.html` precarrega `/_astro/anybody-latin-wdth-wght.CHqbGEEr.woff2`. No primeiro build do dia o `url()` da Anybody estava em `/_astro/_slug_.qjBqEzH0.css`. No build seguinte, depois da cópia de tinta e da seleção, a folha compartilhada passou a ser `/_astro/_slug_.Csvglrpa.css`. O caminho da fonte é o mesmo nos dois. O arquivo tem 56888 bytes, acima do limite de inline, então não virou data URL. O `crossorigin="anonymous"` está no preload. Isso confirma que o import do `Layout.astro` e o `url()` do CSS produzem o mesmo pedido neste build. O hash muda se os bytes da fonte mudarem.
