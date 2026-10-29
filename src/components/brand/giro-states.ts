// Estados do mascote. Cada um vira data-state e o CSS (src/styles/giro.css) cuida do resto.
export const GIRO_STATES = [
  "idle",
  "loading",
  "done",
  "error",
  "empty",
  "thinking",
  "curious",
  "lost",
  "sleeping",
  "celebrating",
] as const;

export type GiroState = (typeof GIRO_STATES)[number];

// Momentos: reações curtas por cima do estado, cada uma presa a um gesto do visitante. Piscadela e
// oi tocam uma vez e somem; ouvindo dura enquanto quem usa o Giro mantiver o momento.
export const GIRO_MOMENTS = ["wink", "hello", "listening"] as const;

export type GiroMoment = (typeof GIRO_MOMENTS)[number];

/** Evento que toca um momento num Giro de outra ilha (o loader cumprimenta pela assinatura). */
export const GIRO_MOMENT_EVENT = "giro:moment";

export function isGiroMoment(value: unknown): value is GiroMoment {
  return typeof value === "string" && (GIRO_MOMENTS as readonly string[]).includes(value);
}

/** Toca o momento no Giro (o svg .g-giro) que estiver em `target`. */
export function playGiroMoment(target: Element, moment: GiroMoment): void {
  target.dispatchEvent(new CustomEvent(GIRO_MOMENT_EVENT, { detail: moment }));
}
