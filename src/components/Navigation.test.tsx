import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navigation from "./Navigation";

describe("Navigation Component", () => {
  it("deve renderizar o nome e os links de navegação", () => {
    render(<Navigation />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("PROJETOS")).toBeInTheDocument();
    expect(screen.getByText("SOBRE")).toBeInTheDocument();
    expect(screen.getByText("CONTATO")).toBeInTheDocument();
  });

  it("não deve renderizar o link de INÍCIO (removido no redesign)", () => {
    render(<Navigation />);
    expect(screen.queryByText("INÍCIO")).toBeNull();
    expect(screen.queryByText("//INÍCIO")).toBeNull();
  });

  it("deve alternar o idioma ao clicar no botão de locale", () => {
    render(<Navigation />);
    const toggle = screen.getByRole("button", { name: /Switch to English/i });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /Mudar para português/i })).toBeInTheDocument();
  });
});
