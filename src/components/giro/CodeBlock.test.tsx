import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("mostra a linguagem em mono com //", () => {
    render(<CodeBlock lang="tsx">{"const ok = 1;"}</CodeBlock>);
    expect(screen.getByText("// tsx")).toHaveClass("g-code__lang");
  });

  it("renderiza o código já realçado, com os tokens tk-*", () => {
    const { container } = render(
      <CodeBlock lang="tsx">
        <span className="tk-k">const</span> ok = <span className="tk-s">&quot;done&quot;</span>
      </CodeBlock>
    );
    expect(container.querySelector("pre code")?.textContent).toBe('const ok = "done"');
    expect(container.querySelector(".tk-k")).toHaveTextContent("const");
    expect(container.querySelector(".tk-s")).toHaveTextContent('"done"');
  });

  it("recebe a ação de copiar por slot, sem depender do CopyButton", () => {
    render(
      <CodeBlock lang="tsx" copyAction={<button type="button">Copiar</button>}>
        {"x"}
      </CodeBlock>
    );
    expect(screen.getByRole("button", { name: "Copiar" })).toBeInTheDocument();
  });

  it("sem ação, o cabeçalho fica só com a linguagem", () => {
    const { container } = render(<CodeBlock lang="ts">{"x"}</CodeBlock>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(".g-code__head")?.children).toHaveLength(1);
  });
});
