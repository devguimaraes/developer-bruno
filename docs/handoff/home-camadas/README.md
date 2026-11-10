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

| Capítulo | Função em `Main.dc.html` | Ticket do mapa #112 | Descrição |
| :--- | :--- | :--- | :--- |
| **Abertura** | `buildAbertura` | #121 | Descanso da hero, pose fechada e passagem em disco para serviços |
| **Serviços** | `buildServicos` | #115 | Palco com 5 trocas na mesma medida, o Giro salta na linha de estações |
| **Projetos** | `buildProjetos` | #116 | Título desdobrado "No ar.", 5 janelas de projetos e virada isométrica para trás |
| **Processo** | `buildProcesso` | #117 | A mesma interface sendo feita em 4 etapas (Conversa, Roteiro, Código, Entrega) |
| **Sobre** | `buildSobre` | #118 | Foto recortada com duotone azul, Giro pousado no ombro e texto passando por trás |
| **Blog** | `buildBlog` | #119 | Notas de campo: o capítulo calmo, Giro cochila até o hover |
| **Contato** | `buildContato` | #119 | Formulário integrado: o Giro vira o botão de envio e reage à digitação |
| **Fim** | `buildFim` | #120 | A página inteira deita na perspectiva isométrica e fecha em pilha |

Tarefas complementares do mapa:
- #113: Levar as pranchas da home em camadas para o repositório (este handoff).
- #114: Adicionar GSAP com ScrollTrigger e revisar a ADR 0001.
- #122: Trilho de ícones em todas as páginas (substitui barra de abas no celular).
- #123: Home completa no celular.
- #124: Conferência da home: rolagem contínua, movimento reduzido e métricas.

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
