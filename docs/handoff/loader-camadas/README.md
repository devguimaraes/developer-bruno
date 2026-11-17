# Loader: as cores eram camadas

Handoff da nova tela de carregamento, mapa #102.

## O que é

Os três discos de cor do loader são telas cheias empilhadas, cada uma representando uma camada da hero (tokens em lima, componentes em papel e tela em tinta). No fim da coreografia na home, elas deitam na câmera isométrica da hero, se separam no ar e assentam fechadas na pose exata da pilha real, que entra no lugar delas.

## De onde veio

Canvas privado "Nova hero isométrica", pranchas "Loader · As cores eram camadas" (`Loader.dc.html` e `Loader-celular.dc.html`), aprovadas em 8 de novembro de 2026.

## Arquivos

- `Loader.dc.html`: prancha do computador e referência da transição de deitar. Os métodos que importam para o porte são `lcTimes`, `lcMeasure`, `lcFly`, `startIso`, `renderIso` e `endIso`.
- `Loader-celular.dc.html`: importa a prancha do computador no layout de celular (390 x 844), onde o Giro pousa na barra de abas inferior.
- `hero-loader.css`: estilos do loader em camadas e da cena isométrica deitada no escopo `.lc` e `.hi`.

## Capturas

Capturas das pranchas no Chromium, em `capturas/`:

- `desktop-1440-disco-tokens.png`: disco lima com o rótulo `// tokens`.
- `desktop-1440-disco-componentes.png`: disco papel com seleção `<Giro />` e rótulo `// componentes`.
- `desktop-1440-disco-tela.png`: disco tinta com rótulo `// tela`.
- `desktop-1440-deitada.png`: cena isométrica deitando com as placas no ar.
- `celular-390-disco-tokens.png`: disco lima no celular.
- `celular-390-disco-componentes.png`: disco papel no celular.
- `celular-390-disco-tela.png`: disco tinta no celular.
- `celular-390-deitada.png`: placas deitando no celular.
