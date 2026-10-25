import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostRow } from "./PostRow";

describe("PostRow", () => {
  it("a linha inteira é um link para o post", () => {
    render(
      <PostRow
        href="/blog/react-19"
        date="10 abr 2026"
        dateTime="2026-04-10"
        title="React 19 e Server Components"
        category="React"
        readTime="8 min de leitura"
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/react-19");
    expect(link).toContainElement(screen.getByRole("heading", { level: 3 }));
  });

  it("mostra data com atributo dateTime, categoria e tempo de leitura", () => {
    const { container } = render(
      <PostRow
        href="/blog/react-19"
        date="10 abr 2026"
        dateTime="2026-04-10"
        title="React 19 e Server Components"
        category="React"
        readTime="8 min de leitura"
      />
    );
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2026-04-10");
    expect(screen.getByText("10 abr 2026")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveClass("g-tag");
    expect(screen.getByText("8 min de leitura", { exact: false })).toBeInTheDocument();
  });

  it("o resumo é opcional", () => {
    const { container, rerender } = render(
      <PostRow
        href="/blog/a"
        date="01 abr 2026"
        dateTime="2026-04-01"
        title="Título"
        category="Arquitetura"
        readTime="9 min de leitura"
      />
    );
    expect(container.querySelector(".g-post-row__excerpt")).toBeNull();

    rerender(
      <PostRow
        href="/blog/a"
        date="01 abr 2026"
        dateTime="2026-04-01"
        title="Título"
        category="Arquitetura"
        readTime="9 min de leitura"
        excerpt="Um resumo curto."
      />
    );
    expect(screen.getByText("Um resumo curto.")).toBeInTheDocument();
  });
});
