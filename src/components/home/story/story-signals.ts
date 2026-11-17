/** Envio do formulário de contato, como o Giro do botão enxerga. */
export type ContactSend = "idle" | "loading" | "done" | "error";

/**
 * O que os capítulos sabem além da rolagem: hover numa linha ou placa, envio e digitação.
 * O `HomeGiro` lê a cada quadro pelos `at` dos capítulos; quem escreve é o componente do capítulo.
 */
export interface StorySignals {
  /** Linha do blog sob o ponteiro, ou -1. */
  blogHover: number;
  /** Placa do fim sob o ponteiro ou o foco, em ordem de leitura, ou -1. */
  endHover: number;
  contactSend: ContactSend;
  /** Verdadeiro logo depois de uma tecla no formulário. */
  contactTyping: boolean;
}

const INITIAL: StorySignals = {
  blogHover: -1,
  endHover: -1,
  contactSend: "idle",
  contactTyping: false,
};

let signals: StorySignals = { ...INITIAL };

export function getStorySignals(): Readonly<StorySignals> {
  return signals;
}

export function setStorySignal<K extends keyof StorySignals>(key: K, value: StorySignals[K]) {
  signals = { ...signals, [key]: value };
}

/** Apenas para testes: volta ao estado inicial. */
export function resetStorySignals() {
  signals = { ...INITIAL };
}
