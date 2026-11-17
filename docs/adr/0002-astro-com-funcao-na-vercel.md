# Astro continua, com uma função na Vercel e navegação de app

Na v2.0.0 o site deixa de ser pensado para busca e passa a ser vitrine de trabalho e portfólio, com cara de app web no celular. Isso pede três coisas que o site estático de hoje não tem: um formulário de contato que envia de verdade, a ilha de rolagem e o Giro vivos de uma página para outra, e liberdade para tela de carregamento e animação. A decisão é continuar em Astro. As páginas seguem pré-geradas, uma função na Vercel (adapter `@astrojs/vercel`) cuida só do envio do contato pelo Resend, e o roteador do Astro (`ClientRouter`) faz a navegação no navegador, mantendo a ilha montada entre as páginas.

As decisões de produto que levaram a isso estão no Design System "Giro", seção "Decisões": https://claude.ai/artifact/7PWUCGVYqreyQYXArUizLt

## Considered Options

- **Next.js (App Router).** É a stack principal do Bruno, mas pede reescrever a casca, o blog e o i18n, e as animações de saída entre páginas são frágeis no App Router.
- **SPA com React e Vite.** Dá controle total das transições, mas perde título, descrição e imagem de prévia por página, que é o que aparece quando o link é mandado para um cliente.

## Consequences

- O site deixa de ser só estático: entram o adapter da Vercel e uma rota sob demanda para o contato. A chave do Resend fica numa variável de ambiente na Vercel, nunca no código. O `CLAUDE.md` precisa ser atualizado na implementação, porque hoje diz que não há SSR nem rotas de API.
- Busca não é prioridade. Cada página mantém título, descrição e imagem de prévia, mas saem a lista de palavras-chave e os dados estruturados. Não volte a otimizar para busca sem rever este ADR.
- A navegação passa pelo `ClientRouter`. O que precisa sobreviver à troca de página (ilha de rolagem, barra de abas) usa `transition:persist`, e os scripts das páginas precisam rodar de novo a cada navegação, não só no primeiro carregamento.
- O orçamento de peso em `src/config/site.ts` passa a valer para o que carrega antes da tela de carregamento terminar. O resto carrega depois.
