import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import "./styles/markdown.css";

/**
 * Configuração otimizada do React Query para o mercado brasileiro
 * Foco em: Redução de consumo de dados e performance em redes instáveis (3G/4G)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo até que os dados sejam considerados "estáticos" (10 minutos)
      // Ideal para portfólios onde o conteúdo (blog, projetos) não muda frequentemente
      staleTime: 1000 * 60 * 10,

      // Tempo de permanência no cache (30 minutos)
      gcTime: 1000 * 60 * 30,

      // Evita refetch excessivo ao trocar de aba (economiza banda em conexões móveis)
      refetchOnWindowFocus: false,

      // Refetch apenas se o componente montar e os dados estiverem stale
      refetchOnMount: true,

      // Política de retry para lidar com instabilidades de rede comuns no Brasil
      retry: (failureCount, error: unknown) => {
        // Não tenta novamente em erros 404 (Auth/Not Found)
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          (error as { status?: number }).status === 404
        )
          return false;

        // Tenta até 3 vezes em outros erros (timeouts, rede, etc)
        return failureCount < 3;
      },

      // Delay entre retentativas (exponencial para não sobrecarregar)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Mutas (como formulário de contato) devem ser tentadas se falharem por rede
      retry: 2,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </HelmetProvider>,
);
