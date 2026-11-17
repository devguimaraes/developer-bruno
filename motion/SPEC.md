# SPEC · Giro em movimento (estudo de transições)

GOAL:    aprovar a coreografia do mascote antes de portar para `src/styles/giro.css`. Quem assiste
         compara, no mesmo quadro, o Giro de hoje e o proposto, e vê as três reações novas.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, sem som (é um estudo, não uma peça de marca).
TIME:    41 s x 30 fps = 1230 quadros.

LOOK:    fundo azul-sinal #2b2eff chapado, sem textura. Painéis azul-fundo #1f22d6, raio 28 px.
         Giro em lima #d2ff4d; erro em coral #ff5c3d sobre disco tinta #0b0c1f (regra do DS).
         Títulos Anybody 900, font-stretch 115%, -3% de tracking. Legendas Anybody 450, 32 px,
         papel #f6f5f0. Rótulos Geist Mono 28 px, minúsculos, com `//` na frente.
         Sem sombra, gradiente, brilho ou grão (proibido pelo DS).

OBJECTS: o Giro é o SVG de `src/components/brand/Giro.tsx` (viewBox 120, raio 44, olhos 6x9), com
         os rostos separados por lado para poderem ser desenhados em tempos diferentes.
         Botão "copiar e-mail" e campo "mensagem" desenhados com os tokens do DS.

MOTION:  curvas com o mesmo nome e os mesmos números que vão para o CSS (assets/giro-rig.js):
         resolve  cubic-bezier(.2, .8, .2, 1)      chegadas, arco, olhos
         hop      cubic-bezier(.34, 1.56, .64, 1)  olhos abrindo
         turn     cubic-bezier(.34, 1.3, .64, 1)   rotação do arco entre estados (560 ms)
         inOut    cubic-bezier(.45, 0, .55, 1)     sono, suspiro, aceno
         spinIn   cubic-bezier(.5, 0, .7, .67)     1ª volta do carregamento (1 s, termina a 400°/s)
         finish   cubic-bezier(.25, .6, .3, 1)     fim da volta: max(280, min(720, resto × 2,2)) ms
         Giro atual reproduz o giro.css de hoje, incluindo os saltos.

SHOTS:   0,0 a 2,5   abertura: título estica de 60% a 115% de largura, Giro proposto respira
         2,5 a 8,0   carregando → pronto, atual × proposto
         8,0 a 13,0  repouso → erro → repouso
         13,0 a 19,5 repouso → dormindo → acordado
         19,5 a 25,7 40 px ampliado 6×: erro, repouso, carregando, pronto
         25,7 a 29,2 piscadela no botão "copiar e-mail"
         29,2 a 33,7 oi no fim do loader
         33,7 a 38,2 ouvindo enquanto o campo é digitado
         38,2 a 41,0 fecho: "Aprovado, vira giro.css."

BANNED:  fade e slide-up em tudo, texto que se mexe enquanto é lido, brilho, partículas,
         gradiente, cantoneiras e HUD decorativo.

QA:      2,5 + 2,05 (atual salta para 0°, proposto ainda girando) · 2,5 + 2,55 (sorriso no meio do
         traço) · 8,0 + 0,95 (recuo do erro) · 19,5 + 0,75 (tremida em 40 px: atual quase parado)
         · 25,7 + 1,3 (piscadela) · 33,7 + 2,5 (olhos seguindo o texto).

PORTE:   regra que o vídeo revelou e o CSS precisa seguir: ao sair de loading, além do ângulo do
         giro, o stroke-dashoffset do arco também termina o ciclo (vai ao múltiplo de 277 mais
         próximo) em vez de voltar a 0 num quadro.

---

# SPEC · Tela de carregamento (a assinatura se monta)

GOAL:    na primeira visita, a tela de carregamento apresenta quem é e o que faz: o Giro que
         gira é o "o" de "bruno guimarães", o nome se monta em volta dele, cada meia volta traz
         uma cor e uma linha, e a assinatura encolhe até o header.
OUTPUT:  cena `loader` montada no `index.html` em 48,0 s, com 14,6 s (438 quadros). A raiz
         passa a 62,6 s. Render isolado: `render -c compositions/loader.html`.
TIME:    cartela 1 de 0,0 a 1,4 · tomada 1 (computador) de 1,4 a 7,3 · cartela 2 de 7,3 a 8,7
         · tomada 2 (celular) de 8,7 a 14,6. Tempos abaixo em ms desde o começo da tomada.
LOOK:    superfícies azul-sinal, lima, papel e tinta. Texto e Giro por superfície: azul (papel,
         Giro lima), lima (azul-sinal, Giro azul), papel (azul-sinal, Giro azul), tinta (papel,
         Giro lima). Nome em Anybody 800, largura 115%, -0,02 em, 136 px no computador e 50 px
         no celular. Linhas em Geist Mono 400, 26 px (computador) e 15 px (celular).
OBJECTS: o Giro (rig "nov", traço 12 que engrossa para 22), a assinatura (estrutura de
         `src/styles/giro-nav.css`: "o" de 0,74 em, 0,06 em abaixo da linha de base, margem de
         0,03 em), três linhas de código e a seleção do componente no papel.
MOTION:
  0         azul, Giro em carregando. O nome é ancorado no centro do "o": "brun" encosta pela
            direita e " guimarães" pela esquerda.
  80-795    o nome se desdobra do Giro para fora: cada letra vai de largura 50% e opacidade 0
            a 115% e 1, resolve de 400 ms, 35 ms entre letras, a partir do "o". O conjunto
            desliza 282 px até ficar centrado (resolve, 720 ms). O traço vai de 12 a 22 em
            150-650, o peso das letras.
  1000      (360°) disco lima nasce do Giro, 215 ms, resolve, de 52 a 1420 px no computador e de
            20 a 570 px no celular. Em 1050 a linha 1 é digitada em 260 ms, um caractere por
            passo, com cursor de bloco na ponta.
  1450      (540°) disco papel e linha 2. Em 1500 o "o" é selecionado como componente: caixa
            de 2 px em azul-sinal (scale 1,15 a 1, 220 ms), quatro alças com pulo e a etiqueta
            `<Giro />`. Some com o disco seguinte.
  1900      (720°) disco tinta e linha 3. As linhas se acumulam.
  2350      (900°) disco azul: a volta fecha. Só no computador. No celular a volta termina na
            tinta, a cor da barra de abas.
  2565      pronto: `done` do rig (fim da volta em 280 ms, sorriso, pulo). O cursor some.
  2965-3485 saída, resolve de 520 ms. Computador: a assinatura inteira encolhe até o header
            (scale 26/136, origem no centro do "o") e o painel de cor recolhe para cima;
            a página sobe 24 px. Celular: o Giro voa até o botão da barra (traço de 22 a 14),
            o painel desce e apaga o nome e as linhas.
  3485      pouso e oi (5 passos de 300 ms), `settle` em +1500 e `idle` até o fim da tomada.
SHOTS:   tomada 1: computador 1920 × 1080 em 1:1, destino com header de 88 px e página de case.
         Tomada 2: celular 390 × 844 em escala 1,2, moldura tinta, destino com barra de abas.
BANNED:  gradiente, sombra, blur, coral, Giro com raio diferente de 44, lima como texto no
         papel, espera falsa sem aviso (veja PORTE).
QA:      0 erros no `npm run check`. Quadros: 49,7 (desdobrando), 50,3 (nome), 50,8 (lima e
         linha 1), 51,2 (papel e seleção), 51,5 (tinta), 52,2 (pronto), 52,45 e 52,52 (saída),
         53,0 e 55,0 (assinatura no header), 57,0, 58,3, 59,4, 59,85 e 60,3 (celular).
PORTE:   a tela passa a ter duração fixa: a página aparece em 3,5 s (hoje de 1,8 a 2,7 s),
         o que muda a decisão 29. Proposta: só na primeira visita da sessão, como hoje; pular
         com clique, tecla ou rolagem; se a página não estiver pronta em 2,9 s, o Giro segue
         girando na última cor até ela ficar. Largura das letras em CSS com `font-stretch` e
         `animation-delay`; digitação com `steps()`; discos e painel com `clip-path`; o voo da
         assinatura no Framer Motion, medindo a assinatura do header. Movimento reduzido: só
         um fade, sem giro, desdobramento ou digitação. O fundo lima segue como exceção ao DS
         ("lima nunca fundo de página") e precisa de decisão.
