import type { TranslationKey } from "@/lib/i18n";
import type { ChapterStep } from "./story/chapters";
import type { StorySignals } from "./story/story-signals";

export interface EndLayer {
  id: string;
  /** Id da seção na home para onde a placa e o rótulo levam. */
  anchor: string;
  labelKey: TranslationKey;
  /** Parada do Giro na linha ao lado da pilha. */
  stop: string;
  /** Superfície da face da placa. */
  surface: "azul" | "papel" | "tinta";
}

/**
 * As oito camadas da página em ordem de leitura: a primeira (início) fica em cima da pilha.
 * "estados" ainda não é uma seção da home, então por enquanto leva ao início.
 */
export const END_LAYERS: readonly EndLayer[] = [
  { id: "start", anchor: "hero", labelKey: "story.end.layer.start", stop: "fn0", surface: "azul" },
  {
    id: "states",
    anchor: "hero",
    labelKey: "story.end.layer.states",
    stop: "fn1",
    surface: "azul",
  },
  { id: "services", anchor: "servicos", labelKey: "services.label", stop: "fn2", surface: "papel" },
  { id: "projects", anchor: "projetos", labelKey: "projects.label", stop: "fn3", surface: "papel" },
  { id: "process", anchor: "processo", labelKey: "process.label", stop: "fn4", surface: "tinta" },
  { id: "about", anchor: "sobre", labelKey: "about.label", stop: "fn5", surface: "azul" },
  { id: "blog", anchor: "blog", labelKey: "blog.label", stop: "fn6", surface: "papel" },
  { id: "contact", anchor: "contato", labelKey: "contact.label", stop: "fn7", surface: "azul" },
];

/** Vão entre placas, em px: de 6 até este valor na abertura. */
const GAP_MIN = 6;
const GAP_MAX = { desktop: 92, mobile: 62 } as const;
/** A abertura ocupa os primeiros 70% da rolagem do capítulo. */
const GAP_SPAN = 0.7;
/** Até aqui o Giro sobe a pilha; depois comemora no topo. */
const TOP_FROM = 0.55;

const clamp01 = (n: number) => (Number.isNaN(n) ? 0 : Math.max(0, Math.min(1, n)));

/** Vão entre placas para um progresso do capítulo (0 a 1), com ease power2.out como na prancha. */
export function calcEndGap(progress: number, mobile: boolean): number {
  const x = clamp01(progress / GAP_SPAN);
  const eased = 1 - (1 - x) * (1 - x);
  const max = mobile ? GAP_MAX.mobile : GAP_MAX.desktop;
  return GAP_MIN + (max - GAP_MIN) * eased;
}

/** Onde o Giro deve estar e com que rosto: hover numa placa tem prioridade sobre a rolagem. */
export function calcEndStep(
  progress: number,
  signals: Pick<StorySignals, "endHover">
): ChapterStep {
  const i = signals.endHover;
  if (i >= 0) return { k: `h${i}`, stop: `fn${i}`, state: "curious" };
  if (progress < TOP_FROM) return { k: "up", stop: "fn0", state: "loading" };
  return {
    k: "top",
    stop: "fn0",
    state: "celebrating",
    after: [
      [2200, "done"],
      [7000, "sleeping"],
    ],
  };
}
