import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "./About";

vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-reveal">{children}</div>
  ),
}));

describe("About Component - Editorial Biography", () => {
  it("deve renderizar a biografia atualizada com formação e experiência", () => {
    render(<About />);
    expect(screen.getByText(/Desenvolvimento de Sistemas Web/i)).toBeInTheDocument();
    expect(screen.getByText(/Senac/i)).toBeInTheDocument();
    expect(screen.getByText(/React, TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Web Vitals/i)).toBeInTheDocument();
  });

  it("deve renderizar o ticker de tecnologias", () => {
    render(<About />);
    const nextjsElements = screen.getAllByText("Next.js");
    const typescriptElements = screen.getAllByText("TypeScript");
    const tailwindElements = screen.getAllByText("Tailwind");

    expect(nextjsElements.length).toBeGreaterThan(0);
    expect(typescriptElements.length).toBeGreaterThan(0);
    expect(tailwindElements.length).toBeGreaterThan(0);
  });
});

describe("About — Lista de Capacidades", () => {
  it("renderiza a label da seção de capacidades", () => {
    render(<About />);
    expect(screen.getByText("// O_QUE_EU_FAÇO")).toBeInTheDocument();
  });

  it("renderiza os 6 rótulos de capacidade (pt)", () => {
    render(<About />);
    expect(screen.getByText("Desenvolvimento Front-End")).toBeInTheDocument();
    expect(screen.getByText("Backend & APIs")).toBeInTheDocument();
    expect(screen.getByText("Deploy & CI/CD")).toBeInTheDocument();
    expect(screen.getByText("Acessibilidade & UX")).toBeInTheDocument();
    expect(screen.getByText("Boas Práticas & Processo")).toBeInTheDocument();
    expect(screen.getByText("Colaboração com Produto")).toBeInTheDocument();
  });

  it("renderiza um BrandIcon decorativo por capacidade", () => {
    const { container } = render(<About />);
    for (const name of ["codigo", "api", "deploy", "usuario", "settings", "comunidade"]) {
      expect(container.querySelector(`[data-icon="${name}"]`)).not.toBeNull();
    }
  });
});
