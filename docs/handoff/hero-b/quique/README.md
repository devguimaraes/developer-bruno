# Hero B, entrada quicando

Handoff da entrada do Giro na hero, mapa #95.

## O que é

No lugar do voo em arco do lançamento, o Giro sai da origem (a assinatura no computador, a aba de baixo no celular) como uma bola de verdade: quica sobre as letras do título, que afundam um pouco a cada toque, cai no chão, quica de novo e rola até a estação de partida da linha. Deixa um rastro lima curto e uma sombra no chão. Ao estacionar, começa o ciclo da vista explodida, e os rótulos da linha aparecem digitados conforme o Giro chega em cada estação.

No celular o título ocupa quase toda a largura, então o Giro toca o título duas vezes, cai pela frente das letras, bate na parede direita e volta rolando. A camada de estado ganha um vão extra quando a pilha abre.

## De onde veio

Canvas privado "Nova hero isométrica", pranchas "Quique" e "Quique celular", aprovadas em 5 de novembro de 2026.

## Arquivos

- `Quique.dc.html`: prancha do computador e referência de código da física. Os métodos que importam para o porte são `measure`, `surface`, `prelaunch`, `launch`, `aimFloor`, `kick`, `dip`, `stepBall`, `trailPush`, `drawTrail`, `stepLetters`, `placeBall`, `park`, `showTag` e `hideTags`.
- `Quique-celular.dc.html`: importa a prancha do computador no layout de celular (390 x 844) e repassa os ajustes.
- `hero-quique.css`: estilos que a entrada soma aos de `../prancha/hero-b.css`, no escopo `.hq`: letras por caractere, rastro, sombra e rótulos digitados.

Os ajustes da prancha (elasticidade, velocidade, rastro, letras, só entrada, repetir) servem só para estudo. No site ficam os valores aprovados: elasticidade de 58%, rastro de 320 ms e letras reagindo.

Como as pranchas de `../prancha/`, os `.dc.html` rodam só dentro do runtime do canvas: importam `./support.js` e os arquivos de `ds/giro/`, que não foram copiados para cá.

## Capturas

Capturas das pranchas no Chromium, em `capturas/`, feitas em 5 de novembro de 2026:

- `desktop-1440-titulo.png`: o Giro no ar, quicando sobre o título.
- `desktop-1440-chao.png`: o Giro rolando no chão, perto da estação, com o painel em "rolando".
- `desktop-1440-rotulos.png`: a pilha aberta, com os rótulos digitados até "tela".
- `celular-390-queda.png`: o Giro caindo pela frente do título, com o rastro.
- `celular-390-pilha.png`: a pilha aberta no celular, com o vão da camada de estado.
