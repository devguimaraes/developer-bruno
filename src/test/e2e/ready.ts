import type { Page } from "@playwright/test";

/**
 * Espera as ilhas client:load hidratarem e a tela de carregamento sair. O data-loader sozinho não
 * diz que a página está pronta: a tela termina antes do Index hidratar com o servidor frio, e o
 * backstop de 8 s do Layout tira o atributo mesmo sem ilha montada. Sem hidratação, o clique no
 * formulário faz submit nativo e recarrega a página. O Astro tira o ssr da ilha depois do
 * hydrateRoot.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(
    () =>
      !document.querySelector('astro-island[ssr][client="load"]') &&
      !document.documentElement.hasAttribute("data-loader")
  );
}
