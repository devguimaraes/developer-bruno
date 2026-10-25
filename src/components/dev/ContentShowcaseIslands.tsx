import { useState } from "react";
import { Code2 } from "lucide-react";
import { ProcessNode } from "@/components/giro/ProcessNode";
import { SectionHeader } from "@/components/giro/SectionHeader";

// Ilhas da vitrine de conteúdo. Props com JSX ou função não atravessam client:load,
// então a ação do cabeçalho e o estado do nó ficam aqui, dentro do React.

export function SectionHeaderDemo() {
  return (
    <SectionHeader
      label="projetos"
      title="Projetos"
      lead="Sites e sistemas entregues, do contexto ao resultado."
      action={
        <a className="g-link" href="/projetos">
          Ver todos
        </a>
      }
    />
  );
}

export function ProcessNodeDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <ProcessNode
      icon={<Code2 className="g-icon" aria-hidden="true" />}
      step="etapa 03"
      name="Código"
      expanded={expanded}
      onToggle={() => setExpanded(open => !open)}
    />
  );
}
