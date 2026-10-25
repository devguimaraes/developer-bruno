import { useState } from "react";
import { Code2 } from "lucide-react";
import { CodeBlock } from "@/components/giro/CodeBlock";
import { CopyButton } from "@/components/giro/CopyButton";
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

export function CodeBlockDemo() {
  const code = 'const ok = await sendContact(form);\nsetState(ok ? "done" : "error");';
  return (
    <CodeBlock
      lang="tsx"
      copyAction={
        <CopyButton
          value={code}
          copyLabel="Copiar"
          copiedLabel="Copiado"
          errorLabel="Não deu para copiar"
          errorHint="Selecione o código."
        />
      }
    >
      <span className="tk-c">{"// the Giro follows the form state"}</span>
      {"\n"}
      <span className="tk-k">const</span> ok = <span className="tk-k">await</span>{" "}
      <span className="tk-f">sendContact</span>(form);
      {"\n"}
      <span className="tk-f">setState</span>(ok ? <span className="tk-s">{'"done"'}</span> :{" "}
      <span className="tk-s">{'"error"'}</span>);
    </CodeBlock>
  );
}
