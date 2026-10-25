import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renderiza rótulo com //, título em h2 e ação à direita", () => {
    render(
      <SectionHeader
        label="projetos"
        title="Projetos"
        lead="Sites e sistemas entregues."
        action={<a href="/projetos">Ver todos</a>}
      />
    );
    expect(screen.getByText("// projetos")).toHaveClass("g-eyebrow");
    expect(screen.getByRole("heading", { level: 2, name: "Projetos" })).toBeInTheDocument();
    expect(screen.getByText("Sites e sistemas entregues.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver todos" })).toHaveAttribute("href", "/projetos");
  });

  it("sem abertura nem ação, mostra só o rótulo e o título", () => {
    const { container } = render(<SectionHeader label="blog" title="Blog" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Blog");
    expect(container.querySelector(".g-section-head__lead")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
