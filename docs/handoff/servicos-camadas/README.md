# Handoff: artes da seção Serviços em camadas isométricas

Para quem vai implementar (agente ou pessoa). Leia este arquivo inteiro antes de mexer no código,
e leia também o `CLAUDE.md` da raiz: comandos, convenções e regras do projeto valem para você.

## Objetivo

Trocar as cinco ilustrações SVG da seção "O que eu faço." da home pelas artes novas aprovadas no
canvas de design (página "Fase 6 · serviços, rodada 2"). As artes novas são interfaces em camadas
isométricas feitas em HTML e CSS 3D. Elas já estão prontas e exportadas nesta pasta; o trabalho é
plugar no componente existente, ajustar o CSS do card e atualizar os testes.

Não redesenhe nada. Composição, tempos e cores foram aprovados. Se algo parecer errado, anote e
pergunte ao Bruno em vez de mudar.

## O que tem nesta pasta

| Arquivo | O que é |
|---|---|
| `arts/<nome>.html` | Um fragmento por arte: um `<style>` com o CSS só daquela arte e o markup (`<span class="ar ar-...">`). Nomes iguais às chaves atuais de `ServiceArtName`. |
| `service-art-base.css` | CSS comum a todas as artes (cena 3D, placas, cursor, Giro mini, estados `is-pre`, `is-paused`, `is-still`). Vai para o CSS global. |
| `meta.json` | Por arte: `loopSeconds`, `ratio` (largura / altura do palco) e os passos do loop. |
| `preview.html` | Prévia sozinha das cinco artes, sem o site. Abra servindo a pasta (`python3 -m http.server`) e acesse `preview.html`. Parâmetros: `?t=2.4` congela em 2,4 s; `?solo=landing` mostra uma arte grande; `?sheet=fullstack&n=8` mostra 8 quadros do loop. |
| `gerador/` | O gerador em Python que produz tudo acima (`arts.py`), a prévia (`preview.py`) e as pranchas do canvas (`gen_dc.py`). Só para regenerar; não precisa rodar para implementar. |

Proporções e loops (de `meta.json`):

| Chave (`ServiceArtName`) | Classe CSS | Loop | `ratio` |
|---|---|---|---|
| `sites-completos` | `ar-sites` | 6,4 s | 1.527 |
| `landing-pages` | `ar-landing` | 5,6 s | 1.528 |
| `product-ui` | `ar-product` | 7,2 s | 1.204 |
| `full-stack` | `ar-fullstack` | 6,4 s | 0.927 |
| `branding` | `ar-branding` | 7,8 s | 1.42 |

## Como as artes funcionam (o que você precisa saber)

- A arte mede `48em` de largura e `var(--ah)` de altura. `1em` = largura do container / 48, via
  `font-size: calc(100cqw / 48)`. Por isso **o elemento que envolve a arte precisa ter
  `container-type: inline-size`** e uma largura definida. Sem isso, `cqw` cai para a viewport e a
  arte fica gigante.
- Cada arte roda num relógio só (`--T`), com CSS `@keyframes` puro: nada de JS, SMIL ou
  Web Animations para tocar o loop. Pausar e retomar é trocar classe.
- Classes de estado no `.ar` (raiz da arte):
  - `is-pre`: placas abaixadas e transparentes. Vem no markup exportado. Remover a classe dispara
    a entrada (as placas sobem em cascata, 0,9 s). A cascata entre cards usa a variável `--cd`
    (ms) no host.
  - `is-paused`: congela o loop (`animation-play-state: paused`). Use fora da tela.
  - `is-still`: tira as animações e mostra a pose montada. Use com movimento reduzido.
- O loop já corre por baixo enquanto a arte está em `is-pre`. Ao revelar, zere o relógio para
  a arte começar do primeiro passo: `ar.getAnimations({ subtree: true })` e
  `currentTime = 0` em cada `CSSAnimation`.
- O card azul (sites) não precisa de variável extra: `.ar-sites` já define a cor da borda das
  placas para fundo azul.

## Passos

Trabalhe na branch `feature/identidade-giro` (o fluxo desse projeto é commit direto nela, sem PR
por fase). A seção Serviços atual ainda **não foi commitada**: os arquivos dela aparecem como
modificados ou não rastreados no `git status`. Não descarte nada disso; você vai trabalhar por cima.

### 1. Assets

1. Copie `arts/*.html` para `src/assets/service-art/` (mesmos nomes).
2. Copie o conteúdo de `service-art-base.css` para um arquivo novo `src/styles/service-art.css` e
   importe ele onde `giro-home.css` é importado (confira com `grep -rn "giro-home.css" src`).
   Rode `bunx biome format --write src/styles/service-art.css`.
3. Os arquivos antigos `src/assets/service-art/*.svg` e `scripts/build-service-art.mjs` deixam de
   ser usados. **Peça confirmação ao Bruno antes de apagar** (regra do projeto).

### 2. `src/components/services/ServiceArt.tsx`

Mantenha a interface pública: `ServiceArt({ name, delay })` e o tipo `ServiceArtName`. Mude o
miolo:

- `ART`: para cada nome, `load: () => import("@/assets/service-art/<nome>.html?raw")` e
  `ratio` (número, da tabela acima). Saem `loop` e `pose`.
- Inserção do fragmento: o arquivo tem um `<style>` e um `<span>`. Use
  `document.createRange().createContextualFragment(module.default)` e
  `host.replaceChildren(fragment)`. Não use `DOMParser` com `text/html` (ele joga o `<style>` no
  `<head>` do documento parseado e você perde o CSS) nem `dangerouslySetInnerHTML` (o Biome
  proíbe).
- Saem `seek`, `play`, `pause` e todo o código de SMIL (`pauseAnimations`, `setCurrentTime`).
- Sai o Giro de carregamento (`<Giro state=...>` e o `LOADING_MS`/`RESOLVE_MS`). A entrada agora
  é a das placas subindo.
- Mantenha os dois observadores na **caixa externa** (`boxRef`), não no host: há um teste de
  regressão para isso. `nearScreen` (rootMargin 200px) carrega; `inView` (threshold 0.3) toca e
  pausa; `seen` marca a primeira vez na tela.
- Estado do `.ar` depois de carregado, aplicado com `classList` no elemento inserido:
  - movimento reduzido (`useReducedMotion()`): remove `is-pre`, adiciona `is-still`;
  - visto pela primeira vez: zera os relógios (veja acima) e remove `is-pre`;
  - `inView` falso: adiciona `is-paused`; verdadeiro: remove.
- Render: `<span ref={boxRef} className="service-art" data-ready={...} style={{ "--ratio": ratio, "--cd": `${delay}ms`, aspectRatio: String(ratio) }}><span ref={hostRef} className="service-art__host" /></span>`.
  `data-ready` fica `true` quando a arte foi inserida e revelada (os testes usam).
- Erro de carregamento: mantenha o `console.error("Failed to load service art:", error)` e
  deixe a caixa vazia (o card continua legível sem a arte).

### 3. `src/styles/giro-home.css` (bloco "Serviços")

- Apague as regras de `.service-art__svg`, `.service-art__svg .sa`, `.service-art__loading` e os
  `--art-face` / `--art-side` do `.home-service` (o fundo do card vira `#edece8` direto, e o azul
  continua vindo de `.g-azul`). Apague também as linhas delas no bloco
  `prefers-reduced-motion` do fim do arquivo.
- `.service-art`: `display: block; container-type: inline-size;`.
- `.service-art__host`: `display: block;`.
- Alturas da área da arte: `.home-service__art` 300px; nos dois primeiros cards, 360px.
- Largura da arte (o palco é justo, então ela ocupa a altura da área):
  - cards pequenos: `.home-service__art .service-art { width: min(100% - 24px, calc(276px * var(--ratio))); }`
  - dois primeiros: `calc(336px * var(--ratio))`.
- Celular (`max-width: 640px`), mantendo o card com a altura da tela que já existe:
  - `.home-service__art`: `height: auto; padding: 16px 0 0;`
  - `.home-service__art .service-art`: `width: 100%;`
  - `.home-service__body`: `gap: 14px; padding: 8px 24px 28px;`
  - `.home-service__title`: `font-size: 34px;` e `.home-service__text`: `font-size: 18px;`
- Movimento reduzido no CSS também (além do `is-still` do componente):
  `@media (prefers-reduced-motion: reduce) { .ar * { animation: none !important; } .ar .pl, .ar .pl__e, .ar .pl__face, .ar .fl { transition: none; } }`.

A referência visual exata desses valores é `gerador/gen_dc.py` (constante `GRID_CSS`), que gera a
prancha aprovada.

### 4. `src/components/home/HomeServices.tsx`

Só o que muda: nada além de continuar passando `delay={index * STAGGER_MS}`. Confira se
`STAGGER_MS` é 160 (era 180; o canvas aprovado usa 160).

### 5. Testes

- `ServiceArt.test.tsx`: o teste de regressão continua (todo elemento observado é a caixa
  `.service-art`). Atualize a proporção esperada: `aspectRatio` de `landing-pages` passa a ser
  `"1.528"`. Adicione: com `useReducedMotion` verdadeiro, depois de carregar, o `.ar` tem
  `is-still` e não tem `is-pre` (mocke o `import(...?raw)` ou o `ART`, como achar mais simples).
- `HomeServices.test.tsx`: o segundo teste fala do Giro de carregamento, que saiu. Troque por:
  as cinco caixas `.service-art` começam com `data-ready="false"` e host vazio
  (`.service-art__host` sem filhos).
- `src/test/e2e/home.spec.ts`: deve continuar passando sem mudança. Há um teste conhecido como
  instável ("Deve espiar depois de 5 s parado numa seção"); se falhar, rode de novo antes de
  concluir que você quebrou.

## Verificação (obrigatória antes de dizer que terminou)

```bash
bunx tsc -p tsconfig.app.json --noEmit
```

```bash
bunx biome check src/components/services src/components/home src/styles
```

```bash
bunx vitest run src/components/services src/components/home
```

```bash
bunx playwright test --project=chromium home.spec.ts
```

```bash
bun run build
```

Se existir `.claude/worktrees/` dentro do repo, `bun run lint` e `bun run test:unit` falham por
causa dele; use os comandos com caminho acima.

No navegador (Playwright, `bun run dev` em http://127.0.0.1:4321):

1. Desktop 1440px: as cinco artes aparecem, sobem em cascata ao entrar na tela e ficam em loop.
   Compare com `preview.html` e com a prancha do canvas: mesma composição e mesmo ritmo.
2. Rolar a seção para fora da tela: `document.querySelectorAll('.ar.is-paused').length` é 5.
3. Celular 390x844: um card por tela, arte inteira (sem corte nas laterais), sem rolagem
   horizontal, e só a arte visível sem `is-paused`.
4. Movimento reduzido (`page.emulateMedia({ reducedMotion: "reduce" })`): artes paradas e
   montadas, sem cursor.
5. Console sem erros.

Mande screenshots de desktop e celular junto com o resultado.

## Commit

Conventional Commits em português, com escopo, sem linha de atribuição a ferramenta de IA. Sugestão:
`feat(home): troca as artes de serviços por interfaces em camadas`. Só commite quando o Bruno
pedir, e não faça push sem confirmação.

## Fora do escopo

- Não mexa no texto dos cards (`src/lib/i18n.ts`) nem na ordem dos serviços.
- Não adicione dependência nova. Nada de GSAP, Lottie ou Rive (ADR 0001).
- Não reaproveite o `scripts/build-service-art.mjs` para as artes novas: o formato é outro.
- Não teste em Safari por conta própria; registre como pendência se não tiver como.

## Riscos conhecidos

- Safari não foi testado. O ponto sensível é `transform-style: preserve-3d` com elementos que
  encaram a câmera (cursor, pontos, etiquetas "POST" e "201"). Se algo sumir atrás das placas no
  Safari, registre e avise; não tente consertar mudando a geometria.
- Orçamento de CSS do projeto é 50 KB (`src/config/site.ts`). O CSS base tem cerca de 3,6 KB;
  o de cada arte (cerca de 13 KB cru, 3 KB gzip) vem no chunk da própria arte, carregado só perto
  da tela. Confira no `bun run build` que nenhum CSS global cresceu além dos 3,6 KB.
