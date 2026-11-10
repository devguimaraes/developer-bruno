type GiroOnStageListener = (onStage: boolean) => void;

let currentOnStage = false;
const listeners = new Set<GiroOnStageListener>();

/**
 * Retorna se o mascote Giro está ativo em cena no palco da home.
 */
export function getGiroOnStage(): boolean {
  return currentOnStage;
}

/**
 * Atualiza o estado da presença do Giro em cena e notifica os ouvintes.
 */
export function setGiroOnStage(value: boolean): void {
  if (currentOnStage === value) return;
  currentOnStage = value;
  listeners.forEach(fn => {
    fn(value);
  });
}

/**
 * Inscreve um ouvinte para receber alterações da presença do Giro em cena.
 * Retorna função para cancelar a inscrição.
 */
export function subscribeGiroOnStage(fn: GiroOnStageListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Apenas para uso em testes unitários para restaurar o estado padrão.
 */
export function resetGiroOnStageForTesting(): void {
  currentOnStage = false;
  listeners.clear();
}
