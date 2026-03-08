# Lições Aprendidas

## ⚡ Fast Refresh & HMR

- **Regra:** Nunca exporte constantes (estilos, variantes) ou funções auxiliares do mesmo arquivo que exporta um componente React se o projeto utiliza Vite/React Refresh. Isso quebra o Hot Module Replacement de forma silenciosa ou causa avisos irritantes no console. Use arquivos separados como `badge-variants.ts` para resolver isso.

## 🛡️ Tipagem de Globais (Window)

- Evite o uso de `(window as any)` em toda parte. Prefira estender a interface global em `src/types/global.d.ts`. Isso traz **Auto-complete** nativo e remove 100% dos erros de lint de "no-explicit-any" em chamadas ao Google Analytics, Plausible, etc.

## 🚀 Performance Mobile (Brasil)

- Ao configurar o `QueryClient` (React Query), utilize `staleTime` agresivo (ex: 10min) e desative `refetchOnWindowFocus` para sites focados em conteúdo estático. Isso economiza drasticamente o consumo de banda de usuários em conexões 3G/4G instáveis, melhorando a percepção de performance.
