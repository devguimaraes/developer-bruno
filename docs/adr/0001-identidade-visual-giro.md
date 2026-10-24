# Identidade visual Giro substitui o brutalismo escuro

Em outubro de 2026 o portfólio troca a identidade escura com dourado, fonte pixel e o mascote BLOCO pela Identidade Giro. A ideia é que front-end vive de estados (carregando, vazio, erro, pronto), e o mascote é um spinner com rosto que mostra esses estados. A escolha veio de uma identidade mais developer, com muito movimento em SVG e um mascote de poucos traços, fácil de animar e diferente do que o site tinha.

A fonte de verdade da identidade (tokens, regras de marca, estados do Giro e registro das decisões) é o Design System "Giro": https://claude.ai/artifact/7PWUCGVYqreyQYXArUizLt

## Considered Options

Seis rotas foram desenhadas. Três editoriais em creme e serifa (Prumo, Bem-te-vi e Margem) foram descartadas por não serem developer o bastante. Entre as três developer, Til (o til de Guimarães como mascote) e Merge (o histórico do git como linguagem) perderam para a Giro.

## Consequences

- Saem o efeito de vidro (LiquidGlass), o granulado, o cursor customizado, o vídeo do hero, a rolagem suave com Lenis, o menu em GSAP, o mascote BLOCO e as fontes Satoshi, JetBrains Mono, Jersey 15, Silkscreen e Newsreader. As dependências `gsap` e `lenis` deixam de ser usadas. Não reintroduza esses efeitos sem rever este ADR.
- O mascote é SVG animado com Framer Motion, com uma variante por estado. Não use Rive nem Lottie: o runtime pesa de 100 a 200 KB e o Giro tem só um arco e dois olhos.
- O site deixa de ser só escuro: alterna superfícies de marca (azul) e de leitura (papel). Não existe modo escuro no lançamento.
- O redesign sai inteiro de uma vez, pela branch `feature/identidade-giro`, como `v2.0.0`. Nenhuma rota fica com a identidade antiga em produção.
