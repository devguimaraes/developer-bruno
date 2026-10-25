import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState, Notice } from "./Notice";

function getGiro(container: HTMLElement) {
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("Notice sem Giro");
  return svg;
}

describe("Notice", () => {
  it("sucesso usa role status, Giro done e a classe de sucesso", () => {
    const { container } = render(<Notice variant="success">Recebi sua mensagem.</Notice>);
    const notice = screen.getByRole("status");
    expect(notice).toHaveTextContent("Recebi sua mensagem.");
    expect(notice).toHaveClass("g-notice--success");
    expect(notice).not.toHaveClass("g-notice--error");
    expect(getGiro(container)).toHaveAttribute("data-state", "done");
  });

  it("erro usa role alert, Giro error e a classe do selo tinta", () => {
    const { container } = render(<Notice variant="error">Tente de novo.</Notice>);
    const notice = screen.getByRole("alert");
    expect(notice).toHaveTextContent("Tente de novo.");
    expect(notice).toHaveClass("g-notice--error");
    expect(getGiro(container)).toHaveAttribute("data-state", "error");
  });

  it("o Giro é decorativo e fica escondido do leitor de tela", () => {
    const { container } = render(<Notice variant="success">Ok.</Notice>);
    expect(getGiro(container)).toHaveAttribute("aria-hidden", "true");
  });

  it("repassa o id, que o Field usa no aria-describedby", () => {
    render(
      <Notice variant="error" id="erro-email">
        E-mail inválido.
      </Notice>
    );
    expect(screen.getByRole("alert")).toHaveAttribute("id", "erro-email");
  });
});

describe("EmptyState", () => {
  it("renderiza título, texto e caminho de volta com o Giro empty", () => {
    const { container } = render(
      <EmptyState
        title="Nada com “astro 6” por aqui."
        text="Tente outra palavra ou veja todos os posts."
        backHref="/blog"
        backLabel="Ver todos os posts"
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Nada com “astro 6” por aqui.");
    expect(screen.getByText("Tente outra palavra ou veja todos os posts.")).toBeInTheDocument();
    const back = screen.getByRole("link", { name: "Ver todos os posts" });
    expect(back).toHaveAttribute("href", "/blog");
    expect(getGiro(container)).toHaveAttribute("data-state", "empty");
  });

  it("sem texto, não renderiza o parágrafo de apoio", () => {
    const { container } = render(
      <EmptyState title="Nada aqui." backHref="/" backLabel="Voltar ao início" />
    );
    expect(container.querySelector(".g-empty__text")).toBeNull();
  });
});
