# Hero B, vista explodida

Handoff da direção B do hero da home.

## O que é

Uma interface aberta em quatro camadas isométricas: tokens, componentes, tela (com "No ar.") e estado. O Giro anda numa linha de estações à direita da pilha e para em cada uma. Ao parar, o sinal lima corre pela ligação e a camada dispara.

Comportamento:

- Um ciclo sim, outro não, o componente dá erro.
- O ponteiro abre e inclina a pilha.
- Ao rolar para serviços, a pilha fecha e gira até ficar de frente.

## De onde veio

Canvas privado "Nova hero isométrica", de 3 de novembro de 2026, mapa #85. Tinha duas direções: A, um campo que acorda, e B, a vista explodida. Escolhemos a B, com o Giro numa linha de estações ao lado da pilha.

## Arquivos

Em `prancha/`, com os mesmos nomes do canvas:

- `B.dc.html`: prancha da direção B, versão desktop.
- `B-celular.dc.html`: mesma prancha no formato de celular (390 x 844).
- `hero.css`: layout comum às direções A e B e as peças isométricas (cena em `rotateX(60deg) rotateZ(-45deg)`, placas com borda empilhada).
- `hero-b.css`: estilos da vista explodida, no escopo `.hb`.

Os `.dc.html` rodam só dentro do runtime do canvas. Eles importam `./support.js` e `ds/giro/tokens.css` e `ds/giro/components/bundle.css`, que não foram copiados para cá. Por isso não abrem sozinhos no navegador.

## Código do site

- `src/components/hero/`: `Hero.tsx`, `StackScene.tsx`, `stack.ts`, `useHeroStack.ts`
- `src/styles/giro-hero.css`

Atenção: nesta branch, `StackScene.tsx`, `stack.ts` e `useHeroStack.ts` ainda não existem. A pasta `src/components/hero/` tem hoje a versão anterior (`Hero.tsx`, `SpinnerField.tsx`, `field.ts`, `heroEngine.ts`, `useHeroEngine.ts`), com o campo de spinners em canvas. A vista explodida precisa ser escrita nesses caminhos.

## Capturas

Capturas do site no Chromium, em `docs/handoff/hero-b/capturas/`, feitas em 3 de novembro de 2026:

- `desktop-1440-ciclo.png`: o Giro na estação de componentes, curioso.
- `desktop-1440-erro.png`: o ciclo com erro, com o aviso em tinta na camada de componentes.
- `desktop-1440-rolagem-50.png`: no meio da rolagem, com a pilha fechando e girando de frente.
- `desktop-1024.png`: a cena encolhida, sem invadir o texto.
- `celular-390-ciclo.png`: o celular, com o Giro saído da barra de abas.
- `desktop-1440-reduzido.png` e `celular-390-reduzido.png`: movimento reduzido, com a pilha meio aberta e parada.

O WebKit do Playwright no Linux (WSL) não pinta `preserve-3d`: até duas placas com `translateZ` saem achatadas, por isso não há captura dele. A pilha ainda precisa ser conferida num Safari de verdade.
