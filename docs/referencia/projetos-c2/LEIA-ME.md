# Referência da C2

Origem: canvas "Seção de projetos" (artifact privado), pranchas C2 desktop e C2 celular, arquivos `projetos-c.css` e `projetos-c2.css`. As cópias estão nesta pasta. O HTML da prancha depende do runtime do canvas e não abre sozinho.

O que o site usa:

- Faixas no papel, separadas por `1px` em `--s-line`. Desktop (`min-height: 760px`) quando a seção tem pelo menos 760px de largura. Abaixo disso, altura do conteúdo.
- Anel lima (`--lima`) e disco de papel (`--s-bg`). Os dois crescem com `clip-path` em 1200ms, curva `cubic-bezier(0.16, 1, 0.3, 1)`. O papel espera 480ms. O texto fica em `--s-fg` o tempo todo.
- O disco nasce no centro da capa e o raio cobre o canto mais longe da faixa, medido de novo quando a faixa muda de tamanho.
- Giro: fica `loading` no centro da capa. Quando a foto entra, some em 800ms (opacidade e um leve encolher até 0.94), curva `cubic-bezier(0.4, 0, 0.7, 0.2)`. Não pousa no canto.
- Rótulo digitado em 620ms, `steps`, atraso de 180ms, só na faixa larga. No layout estreito o rótulo quebra linha e aparece inteiro.
- Seleção (caixa, alças, etiqueta) usa `--s-signal` e `--s-on-accent`. Entra quando a capa chega, fica 1600ms, e no layout largo também no hover com ponteiro fino. No layout estreito, só nessa entrada.
- Etiqueta gerada do título: sem acento, PascalCase, sigla de até 3 letras permanece em maiúsculas (`Agência Multi BR` vira `<AgenciaMultiBR />`).
- Movimento reduzido: sem anel, disco, digitação e Giro. Capa já visível.
