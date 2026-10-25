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
