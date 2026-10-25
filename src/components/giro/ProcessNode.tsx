import type { ReactNode } from "react";

export interface ProcessNodeProps {
  /** Ícone da Lucide já instanciado, ex.: <Code2 className="g-icon" aria-hidden="true" />. */
  icon: ReactNode;
  /** Número da etapa, ex.: "etapa 03". */
  step: string;
  /** Nome da etapa, ex.: "Código". */
  name: string;
  expanded: boolean;
  onToggle: () => void;
  /** id do painel de detalhe, para aria-controls. */
  controls?: string;
}

export function ProcessNode({ icon, step, name, expanded, onToggle, controls }: ProcessNodeProps) {
  return (
    <button
      type="button"
      className="g-node"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
    >
      <span className="g-node__icon">{icon}</span>
      <span className="g-node__text">
        <span className="g-node__step">{step}</span>
        <span className="g-node__name">{name}</span>
      </span>
    </button>
  );
}
