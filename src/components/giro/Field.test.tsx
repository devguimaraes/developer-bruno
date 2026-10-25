import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Field, Search, TextArea } from "./Field";

describe("Field", () => {
  it("associa o rótulo ao input", () => {
    render(<Field label="E-mail" />);
    expect(screen.getByLabelText("E-mail")).toBeInstanceOf(HTMLInputElement);
  });

  it("sem erro, não marca aria-invalid nem aria-describedby", () => {
    render(<Field label="Nome" />);
    const input = screen.getByLabelText("Nome");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("com erro, marca aria-invalid e liga o aviso por aria-describedby", () => {
    render(<Field label="E-mail" defaultValue="marina@" error="E-mail inválido." />);
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("E-mail inválido.");
    expect(screen.getByRole("alert")).toHaveTextContent("E-mail inválido.");
  });

  it("o hint entra na descrição, junto com o erro", () => {
    render(<Field label="Senha" hint="Mínimo de 8 caracteres." error="Muito curta." />);
    expect(screen.getByLabelText("Senha")).toHaveAccessibleDescription(
      "Mínimo de 8 caracteres. Muito curta."
    );
  });

  it("chama onBlur ao sair do campo e não valida a cada tecla", () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(<Field label="Nome" onBlur={onBlur} onChange={onChange} />);
    const input = screen.getByLabelText("Nome");
    fireEvent.change(input, { target: { value: "B" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("disabled chega ao input", () => {
    render(<Field label="Nome" disabled />);
    expect(screen.getByLabelText("Nome")).toBeDisabled();
  });

  it("encaminha a ref para o input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Field label="Nome" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("Nome"));
  });
});

describe("TextArea", () => {
  it("renderiza textarea com a classe de área e liga o erro", () => {
    const { container } = render(<TextArea label="Mensagem" error="Conte um pouco mais." />);
    const area = screen.getByLabelText("Mensagem");
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveClass("g-input--area");
    expect(area).toHaveAttribute("aria-invalid", "true");
    expect(area).toHaveAccessibleDescription("Conte um pouco mais.");
    expect(container.querySelector(".g-notice--error")).not.toBeNull();
  });
});

describe("Search", () => {
  it("tem rótulo para leitor de tela e input do tipo search", () => {
    const { container } = render(<Search label="Buscar no blog" placeholder="Buscar" />);
    const input = screen.getByRole("searchbox", { name: "Buscar no blog" });
    expect(input).toHaveAttribute("type", "search");
    expect(container.querySelector(".g-search__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("com erro, marca aria-invalid", () => {
    render(<Search label="Buscar" error="Digite pelo menos uma letra." />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");
  });
});
