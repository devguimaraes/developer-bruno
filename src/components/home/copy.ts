/** Rótulo de seção sem a barra. O SectionHeader põe "// " na frente. */
export function bareLabel(label: string): string {
  return label.replace(/^\/\/\s*/, "");
}

export interface OutcomeParts {
  value: string;
  label: string;
  source: string;
}

/**
 * Separa o resumo de um site no ar ("−30% na taxa de rejeição · WordPress · acessibilidade")
 * em número, o que ele mede e a fonte. O primeiro bloco traz o número seguido do texto.
 */
export function splitOutcome(summary: string): OutcomeParts {
  const [head = "", ...rest] = summary.split(" · ");
  const match = /^(\S+)\s+(.+)$/.exec(head);
  if (!match) return { value: head, label: "", source: rest.join(" · ") };
  const [, value = "", label = ""] = match;
  return { value, label, source: rest.join(" · ") };
}
