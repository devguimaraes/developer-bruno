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
