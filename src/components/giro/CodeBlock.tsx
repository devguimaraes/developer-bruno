import type { ReactNode } from "react";

export interface CodeBlockProps {
  /** Linguagem, ex.: "tsx". Aparece como "// tsx" no topo. */
  lang: string;
  /** Código já realçado, com spans tk-k, tk-s, tk-c e tk-f. */
  children: ReactNode;
  /** Ação do cabeçalho, normalmente o botão de copiar (CopyButton). */
  copyAction?: ReactNode;
}

export function CodeBlock({ lang, children, copyAction }: CodeBlockProps) {
  return (
    <figure className="g-code">
      <div className="g-code__head">
        <span className="g-code__lang">{`// ${lang}`}</span>
        {copyAction}
      </div>
      <pre className="g-code__body">
        <code>{children}</code>
      </pre>
    </figure>
  );
}
