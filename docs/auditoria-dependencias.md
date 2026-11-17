# Auditoria de dependências (out 2026)

Registro das vulnerabilidades que o `bun audit` aponta no projeto, feito durante a v2.0.0 (Identidade Giro) na branch `feature/identidade-giro`. Nada aqui foi corrigido: este documento só descreve o que existe, o que está exposto e o caminho para resolver. O trabalho de correção fica na issue de dependências do mapa #40.

## Resumo

- Data: 25/10/2026, com `bun audit` sobre `bun.lock` no commit `2801f05`.
- Total: **72 vulnerabilidades em 25 pacotes** (2 críticas, 33 altas, 30 moderadas, 7 baixas).
- Antes da v2.0.0 já eram **70** (2 críticas, 32 altas, 29 moderadas, 7 baixas), medido no `bun.lock` de `03d1664` e de `176dabc`. A única entrada nova veio da #45 (`@astrojs/vercel@9.0.5`): 1 moderada no próprio adapter (`x-astro-path`, corrigida só no 10.0.2, que exige Astro 6 ou 7) e 1 alta no `path-to-regexp@6.1.0`, via `@vercel/routing-utils`.
- `bun audit --prod` mostra 66, porque o Bun só exclui as `devDependencies` e o Astro, o Vite e o PostCSS entram como dependências de build. "Produção" aqui não significa "roda no servidor".

Para reproduzir:

```bash
bun audit            # todas
bun audit --prod     # sem devDependencies
bun audit --json     # estruturado
```

## Exposição real

O site é pré-gerado e servido como arquivos estáticos. Quase tudo que o audit aponta roda só na máquina de desenvolvimento ou no build, e não vai para o navegador de quem visita. O que eu não verifiquei: a explorabilidade de cada advisory. A leitura abaixo vem do que o projeto usa, conferido no código.

| Superfície | O que roda | Pacotes afetados | Risco |
|---|---|---|---|
| Produção, páginas estáticas | HTML, CSS e JS gerados | nenhum dos pacotes do audit é enviado ao navegador, exceto `react`, `framer-motion`, `lucide-react` e `clsx`, que não aparecem no audit | baixo |
| Produção, função da Vercel (#54, ainda não existe) | só a rota do contato, sob demanda | `astro` (SSR), `@astrojs/vercel`, `path-to-regexp`, `zod`, `devalue` | médio quando a função existir: é o único código de servidor do projeto |
| Build local e CI | `astro build`, Vite, PostCSS, Tailwind | `astro`, `vite`, `postcss`, `svgo`, `js-yaml`, `smol-toml`, `picomatch`, `yaml` | baixo a médio: depende de quem controla os arquivos de entrada (aqui, só o próprio repositório) |
| Servidor de desenvolvimento | `astro dev` em `127.0.0.1:4321` | `vite` (leitura de arquivo, `server.fs`), `launch-editor`, `ws` | baixo: escuta só em localhost. Piora se alguém rodar com `--host` |
| Testes | Vitest e jsdom | `vitest`, `@vitest/mocker`, `jsdom` > `ws` | baixo |
| Scripts de mídia | `bun run optimize:media` | `sharp` | baixo: só processa imagens do próprio repositório |

Duas críticas, ambas sem caminho de código no projeto:

- **`astro`, RCE na otimização de AVIF (`GHSA-26w7-cxv4-gfx2`, corrigida em 7.2.8).** O projeto não usa `astro:assets`, `<Image>`, `<Picture>` nem `getImage` (conferido com `grep` em `src/`). Imagens são `<img>` comuns em `public/`. Continua pendente porque o pacote está instalado, mas o caminho vulnerável não é exercitado.
- **`vitest`, leitura e execução de arquivo com o servidor da UI ativo (`GHSA-5xrq-8626-4rwp`, corrigida em 4.1.0).** Só vale com a UI do Vitest escutando. O script `test:coverage:ui` usa `--ui`, mas `@vitest/ui` não está nas `devDependencies`. A correção é subir o Vitest para 4.1.11 ou mais, que o `bun audit fix` já faz.

## Pacotes afetados

Severidades por pacote (C crítica, A alta, M moderada, B baixa). "Direto" quer dizer que está no `package.json`; os outros entram por dependência de terceiros.

| Pacote@versão | C | A | M | B | Origem | Resolve com `bun audit fix`? |
|---|---|---|---|---|---|---|
| `astro@5.18.1` | 1 | 2 | 6 | 2 | direto | Não. Precisa de Astro 6 ou 7 (última 7.4.2) |
| `devalue@5.6.4` | 0 | 4 | 3 | 1 | `astro` | Sim |
| `vite@6.4.1` | 0 | 3 | 5 | 1 | `astro`, `@astrojs/react`, `vitest` | Sim (6.4.5) |
| `postcss@8.5.6` | 0 | 2 | 2 | 0 | direto | Sim |
| `sharp@0.34.5` | 0 | 3 | 0 | 0 | direto (dev) | Não. Precisa de 0.35.5 (muda o range do `package.json`) |
| `vitest@4.0.16` | 1 | 0 | 1 | 0 | direto (dev) | Sim (4.1.11) |
| `js-yaml@4.1.1` | 0 | 3 | 1 | 0 | `astro` > `@astrojs/markdown-remark` | Sim |
| `nanoid@3.3.11` | 0 | 3 | 0 | 0 | `postcss` | Sim |
| `picomatch@4.0.3, 2.3.1` | 0 | 2 | 2 | 0 | `astro`, `tailwindcss` | Sim |
| `svgo@4.0.1` | 0 | 2 | 1 | 0 | `astro` | Sim |
| `browserslist@4.28.0` | 0 | 2 | 0 | 0 | `autoprefixer` | Sim |
| `smol-toml@1.6.0` | 0 | 1 | 2 | 0 | `astro` > `@astrojs/markdown-remark` | Sim |
| `ws@8.18.3` | 0 | 1 | 1 | 0 | `jsdom` | Sim |
| `defu@6.1.4` | 0 | 1 | 0 | 0 | `astro` > `unstorage` > `h3` | Sim |
| `http-cache-semantics@4.2.0` | 0 | 1 | 0 | 0 | `astro` | Sim |
| `path-to-regexp@6.1.0, 6.3.0` | 0 | 1 | 0 | 0 | `@astrojs/vercel` > `@vercel/routing-utils` | Não. Só com `@astrojs/vercel` 10 ou mais |
| `source-map-js@1.2.1` | 0 | 1 | 0 | 0 | `postcss` | Sim |
| `zod@4.3.6, 3.25.76` | 0 | 1 | 0 | 0 | `astro`, `@astrojs/sitemap` | Não. Vem junto com o Astro |
| `@vitest/mocker@4.0.16` | 0 | 0 | 2 | 0 | `vitest` | Parcial: sobem para 4.1.11, mas 2 moderadas seguem abertas |
| `postcss-selector-parser@6.1.2` | 0 | 0 | 1 | 1 | `tailwindcss` | Não (1 moderada e 1 baixa seguem abertas) |
| `@astrojs/vercel@9.0.5` | 0 | 0 | 1 | 0 | direto | Não. Precisa de 10.0.2 ou mais, que exige Astro 6 ou 7 |
| `baseline-browser-mapping@2.10.9` | 0 | 0 | 1 | 0 | `autoprefixer` | Sim |
| `yaml@2.8.2` | 0 | 0 | 1 | 0 | `lint-staged`, `postcss-load-config` | Sim |
| `@babel/core@7.29.0` | 0 | 0 | 0 | 1 | `@astrojs/react` | Sim |
| `esbuild@0.25.12, 0.27.4` | 0 | 0 | 0 | 1 | `@astrojs/vercel`, `vite` | Não (1 baixa segue aberta) |

A última coluna vem da simulação descrita na próxima seção.

## Simulação do `bun audit fix`

Rodei `bun audit fix` numa cópia de `package.json` e `bun.lock` fora do repositório, para medir sem alterar o lockfile real. Resultado: **48 vulnerabilidades corrigidas em 18 pacotes e 22 restantes** (1 crítica, 7 altas, 10 moderadas, 4 baixas), sem trocar de major. O `vitest` crítico sai com essa correção (sobe para 4.1.11), e o Vite sobe para 6.4.5.

O que sobra, por pacote:

| Pacote | Restante | O que destrava |
|---|---|---|
| `astro` | 1 crítica, 2 altas, 6 moderadas, 2 baixas | Astro 6 ou 7 |
| `sharp` | 3 altas | 0.35.5 (muda o range do `package.json`, só o script de mídia usa) |
| `zod` | 1 alta | vem junto com o Astro |
| `path-to-regexp` | 1 alta | `@astrojs/vercel` 10 ou mais |
| `@astrojs/vercel` | 1 moderada | `@astrojs/vercel` 10.0.2 ou mais, que exige Astro 6 ou 7 |
| `@vitest/mocker` | 2 moderadas | a conferir: novas advisories mesmo na 4.1.11 |
| `postcss-selector-parser` | 1 moderada, 1 baixa | a conferir: fica no Tailwind 3 |
| `esbuild` | 1 baixa | a conferir |

Quase tudo que sobra de peso depende do Astro. Trocar o Astro de major é a única decisão cara.

## Compatibilidade a verificar antes do upgrade do Astro

Não testei nenhuma destas integrações com Astro 6 ou 7, então são riscos, não fatos:

- `@astrojs/react` (hoje 4.x), `@astrojs/tailwind` (integração do Tailwind 3), `@astrojs/sitemap`.
- O `ClientRouter` e as transições da #45, e o `getStaticPaths` com `import.meta.env.DEV` da página `/dev/giro`.
- O adapter `@astrojs/vercel` 10 ou 11 e o Node exigido por ele.

## Caminho sugerido

Dentro da branch de integração, antes da verificação final (#61) e da release (#62):

1. Rodar `bun audit fix`, conferir `tsc`, lint, testes, build e e2e, commitar e registrar aqui o novo total (esperado: 22).
2. Subir o `sharp` para 0.35.5 e rodar `bun run optimize:media` e `check:media-budget`. É dev only.
3. Avaliar o upgrade do Astro e do adapter num commit à parte, com build, e2e e conferência da navegação sem recarregar no navegador. Se a compatibilidade com as integrações não fechar, registrar o bloqueio e decidir com o Bruno se a v2.0.0 sai com as advisories do Astro documentadas.
4. Antes de criar a função do contato (#54), reavaliar a linha "função da Vercel" da tabela de exposição: é ali que as advisories de SSR passam a ter exposição real.

## Andamento

### 25/10/2026: `bun audit fix` e `sharp` (issue #63, etapas 1 e 2)

- `bun audit fix` alterou só o `bun.lock` (62 linhas adicionadas, 46 removidas) e corrigiu **48 vulnerabilidades em 18 pacotes**, como a simulação previu. Nenhuma troca de major, nenhuma mudança no `package.json`.
- `sharp` do projeto subiu de `^0.34.5` para `^0.35.5` (`bun add -d sharp@0.35.5`). `bun run optimize:media` rodou com a versão nova e converteu a imagem de teste sem erro, e `bun run check:media-budget` continua dentro do limite.
- Total depois das duas etapas: **22 vulnerabilidades** (1 crítica, 7 altas, 10 moderadas, 4 baixas), em 8 pacotes: `astro` (11), `sharp` (3), `@vitest/mocker` (2), `postcss-selector-parser` (2), `@astrojs/vercel` (1), `esbuild` (1), `path-to-regexp` (1) e `zod` (1).
- As 3 altas do `sharp` que sobraram não vêm do `sharp` do projeto. Vêm da cópia 0.34.5 que o Astro 5 traz como dependência opcional (`astro/sharp`). O projeto não usa `astro:assets`, então essa cópia não é carregada. Elas saem com o upgrade do Astro. Forçar a versão nova com `overrides` ficaria fora do intervalo que o Astro declara (`^0.34.0`), e não vale o risco por um caminho que não roda.
- O `vitest` crítico saiu (subiu para 4.1.11). O que resta de crítica é a do `astro`.
- Pendente: etapa 3 (avaliar Astro 6 ou 7 e `@astrojs/vercel` 10 ou mais) e a etapa 4 antes da função do contato (#54).

### 25/10/2026: avaliação do Astro 6 e 7 (issue #63, etapa 3)

Feita numa cópia do projeto fora do repositório. O repositório continua no Astro 5.18.1.

- **Astro 6 não resolve a crítica.** A RCE na otimização de AVIF só é corrigida na 7.2.8. A 6.4.8 (última) com `@astrojs/vercel` 10.0.8 e `@astrojs/react` 7 ainda deixa 17 vulnerabilidades, 1 crítica.
- **Astro 7 (7.4.2) com `@astrojs/vercel` 11.0.16 e `@astrojs/react` 7.1.1** deixou 6 vulnerabilidades (2 altas, 3 moderadas, 1 baixa), sem crítica: `path-to-regexp` (alta), `zod` 3.x (alta), `@vitest/mocker` (2 moderadas) e `postcss-selector-parser` (1 moderada e 1 baixa). As duas altas não são do Astro: `path-to-regexp` vem de `@vercel/routing-utils` e o `zod` 3 ainda é pedido por dependências.
- **Bloqueios para adotar o Astro 7:**
  1. Exige Node 22.23.4 ou mais. O Node local é o 22.22.2 e o Astro se recusa a rodar. Falta conferir o Node do CI (`.github/workflows/ci.yml`) e o da Vercel.
  2. `@astrojs/tailwind` 6.0.2 só declara suporte a Astro 3 a 5. O Tailwind 3 já passa pelo PostCSS (`postcss.config.js`), então a integração pode sair, mas isso muda o `astro.config.mjs`.
  3. O Astro 7 usa o Vite 8, e o `@astrojs/react` 7 também. Vitest, `@vitejs/plugin-react` e o build precisam ser revalidados juntos.
  4. Os efeitos no `ClientRouter`, nas transições da #45 e na rota `/dev/giro` não foram testados, porque o build do Astro 7 não rodou neste Node.
- **Decisão pendente com o Bruno:** subir o Node (local, CI, Vercel) e fazer o upgrade do Astro 7 como trabalho próprio, ou entregar a v2.0.0 no Astro 5 com a crítica documentada. A crítica não tem caminho de código hoje (sem `astro:assets`), mas a função do contato (#54) vai rodar o Astro em servidor.

## Critério de saída

- `bun audit` sem críticas e sem altas em pacotes que rodam em produção ou na função do contato.
- O que ficar de fora, com a razão, listado neste arquivo e citado nas notas da release.
