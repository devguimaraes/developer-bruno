/**
 * O snap vale enquanto o palco do capítulo está preso na tela: do topo do capítulo no topo da
 * tela até o fim dele sair por cima. Fora disso a rolagem é livre, e o snap obrigatório não
 * puxaria o visitante de volta para o capítulo.
 */
export function isBeatSnapActive(top: number, bottom: number): boolean {
  return top <= 1 && bottom > 1;
}
