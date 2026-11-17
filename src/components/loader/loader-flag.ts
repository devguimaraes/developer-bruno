// Marca da primeira visita da sessão. Quem grava é o LoadingScreen; o script inline de
// Layout.astro só lê a mesma chave, antes do primeiro paint.
export const LOADED_KEY = "giro:loaded";

/**
 * Diz se esta é a primeira visita da sessão e, nesse caso, grava a marca para que as navegações
 * seguintes não mostrem a tela de novo. Se o sessionStorage estiver bloqueado ou falhar, devolve
 * false: sem marca não dá para garantir que a tela aparece só uma vez, então ela não aparece e a
 * página segue normalmente.
 */
export function claimFirstVisit(): boolean {
  try {
    if (sessionStorage.getItem(LOADED_KEY) !== null) return false;
    sessionStorage.setItem(LOADED_KEY, "1");
    return true;
  } catch {
    return false;
  }
}
