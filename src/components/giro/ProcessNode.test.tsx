import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProcessNode } from "./ProcessNode";

describe("ProcessNode", () => {
  it("mostra o número da etapa e o nome dentro de um botão", () => {
    render(
      <ProcessNode
        icon={<span data-testid="icon" />}
        step="etapa 03"
        name="Código"
        expanded={false}
        onToggle={() => {}}
      />
    );
    const button = screen.getByRole("button", { name: /Código/ });
    expect(button).toHaveTextContent("etapa 03");
    expect(button).toHaveClass("g-node");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("reflete o estado aberto em aria-expanded e liga ao painel com aria-controls", () => {
    const { rerender } = render(
      <ProcessNode
        icon={null}
        step="etapa 03"
        name="Código"
        expanded={false}
        onToggle={() => {}}
        controls="detalhe-03"
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "detalhe-03");

    rerender(
      <ProcessNode
        icon={null}
        step="etapa 03"
        name="Código"
        expanded
        onToggle={() => {}}
        controls="detalhe-03"
      />
    );
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("clicar chama onToggle", () => {
    const onToggle = vi.fn();
    render(
      <ProcessNode
        icon={null}
        step="etapa 04"
        name="Entrega"
        expanded={false}
        onToggle={onToggle}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
