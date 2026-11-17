# Hero B, trajeto desenhado

Handoff da nova Entrada do Giro e saltos na hero, mapa #102.

## O que é

No lugar da física da bola, o Giro segue uma trajetória geométrica desenhada por arcos de gravidade: sai da assinatura ou da barra de abas, toca as letras do título, usa o ponto final como trampolim com arregalo de olhos, impacta a pilha abrindo as camadas e pousa na estação de tokens. Na linha lateral, desloca-se entre as estações em saltos com a mesma gravidade, em ritmo desigual com erro de componentes na primeira volta, antes de fechar a pilha e descansar.

## De onde veio

Canvas privado "Nova hero isométrica", pranchas "Giro · Trajeto desenhado" (`Trajeto.dc.html` e `Trajeto-celular.dc.html`), aprovadas em 8 de novembro de 2026.

## Arquivos

- `Trajeto.dc.html`: prancha do computador e referência de cálculo dos arcos e saltos. Os métodos que importam para o porte são `arc`, `launchPath`, `stepPath`, `pathHit`, `hitPile`, `lookAhead`, `landStation`, `cycleFrom0`, `runCycle`, `rest`, `ride`, `stepRide` e `arrive`.
- `Trajeto-celular.dc.html`: importa a prancha do computador no layout de celular (390 x 844).
- `hero-trajeto.css`: estilos que o trajeto soma ao hero: trampolim (`tj-tramp`), agachamento (`tj-crouch`), impactos e expressões faciais do Giro (`is-squint`, `is-wide`, `is-hit`).

## Capturas

Capturas das pranchas no Chromium, em `capturas/`:

- `desktop-1440-trampolim.png`: o Giro usando o ponto final como trampolim.
- `desktop-1440-impacto.png`: o impacto do Giro contra a camada da pilha.
- `desktop-1440-pilha-abrindo.png`: a pilha abrindo no ar após o impacto.
- `desktop-1440-pouso-tokens.png`: o pouso suave na estação de tokens.
- `desktop-1440-erro-componentes.png`: o erro na estação de componentes durante a primeira volta.
- `desktop-1440-descanso.png`: o repouso final com a pilha fechada.
- `celular-390-trampolim.png`: trampolim no celular.
- `celular-390-impacto.png`: impacto na pilha no celular.
- `celular-390-pilha-abrindo.png`: pilha abrindo no celular.
- `celular-390-pouso-tokens.png`: pouso em tokens no celular.
- `celular-390-erro-componentes.png`: erro em componentes no celular.
- `celular-390-descanso.png`: descanso no celular.
