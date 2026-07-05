import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About — Header", () => {
  it("exibe o nome BRUNO GUIMARÃES em fonte pixel", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toMatch(/BRUNO/i);
    expect(heading.textContent).toMatch(/GUIMARÃES/i);
    expect(heading.className).toContain("type-raster-section");
  });

  it("exibe a tagline Front-End Developer · AI-Native Development em accent", () => {
    render(<About />);
    const tagline = screen.getByText(/Front-End Developer/i);
    expect(tagline).toBeInTheDocument();
    expect(tagline.textContent).toContain("AI-Native Development");
    expect(tagline.className).toContain("text-accent");
    expect(tagline.className).toContain("type-mono");
  });

  it("NÃO usa mix-blend-difference no nome", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).not.toContain("mix-blend-difference");
  });
});

describe("About — Foto + Bio", () => {
  it("renderiza a foto com data-testid e imagem do Bruno", () => {
    const { container } = render(<About />);
    const photo = container.querySelector('[data-testid="about-photo"]');
    expect(photo).not.toBeNull();
    const img = container.querySelector('img[alt*="Bruno"]');
    expect(img).not.toBeNull();
  });

  it("foto tem largura ~30% no desktop (md:w-[30%])", () => {
    const { container } = render(<About />);
    const photo = container.querySelector('[data-testid="about-photo"]');
    expect(photo?.className).toMatch(/md:w-\[30%\]/);
  });

  it("exibe o texto da bio em fonte serif", () => {
    render(<About />);
    const bio = screen.getByText(/Desenvolvimento de Sistemas Web/i);
    expect(bio).toBeInTheDocument();
    expect(bio.className).toContain("font-serif");
  });

  it("bio tem container com border-l-2", () => {
    const { container } = render(<About />);
    const bioContainer = container.querySelector(".border-l-2");
    expect(bioContainer).not.toBeNull();
  });
});

describe("About — Capabilities", () => {
  it("exibe o label // O_QUE_EU_FAÇO", () => {
    render(<About />);
    expect(screen.getByText(/O_QUE_EU_FAÇO/i)).toBeInTheDocument();
  });

  it("renderiza 6 capabilities em grid de 3 colunas no lg", () => {
    const { container } = render(<About />);
    const grid = container.querySelector('[data-testid="about-capabilities"]');
    expect(grid).not.toBeNull();
    expect(grid?.className).toMatch(/lg:grid-cols-3/);
    expect(grid?.children.length).toBe(6);
  });

  it("cada capability tem um BrandIcon decorativo", () => {
    const { container } = render(<About />);
    const icons = container.querySelectorAll('[data-testid="about-capabilities"] [data-icon]');
    expect(icons.length).toBe(6);
  });

  it("exibe 'APIs' como label (não 'Backend & APIs')", () => {
    render(<About />);
    expect(screen.getByText("APIs")).toBeInTheDocument();
    expect(screen.queryByText("Backend & APIs")).toBeNull();
  });

  it("exibe todas as 6 capabilities com labels em português", () => {
    render(<About />);
    expect(screen.getByText("Desenvolvimento Front-End")).toBeInTheDocument();
    expect(screen.getByText("APIs")).toBeInTheDocument();
    expect(screen.getByText("Deploy & CI/CD")).toBeInTheDocument();
    expect(screen.getByText("Acessibilidade & UX")).toBeInTheDocument();
    expect(screen.getByText("Boas Práticas & Processo")).toBeInTheDocument();
    expect(screen.getByText("Colaboração com Produto")).toBeInTheDocument();
  });
});

describe("About — Tech Strip", () => {
  it("renderiza a strip de tech com data-testid", () => {
    const { container } = render(<About />);
    const strip = container.querySelector('[data-testid="about-tech-strip"]');
    expect(strip).not.toBeNull();
    const svgs = strip?.querySelectorAll("svg");
    expect(svgs?.length).toBeGreaterThanOrEqual(11);
  });

  it("tech strip NÃO exibe labels visíveis (apenas ícones com title)", () => {
    const { container } = render(<About />);
    const strip = container.querySelector('[data-testid="about-tech-strip"]');
    // Não deve ter <span> ou elementos de texto visível com nomes das techs
    const spans = strip?.querySelectorAll("span");
    expect(spans?.length).toBe(0);
    // Mas os ícones devem ter title para acessibilidade
    const iconsWithTitle = strip?.querySelectorAll("[title]");
    expect(iconsWithTitle?.length).toBeGreaterThanOrEqual(11);
  });
});

describe("About — Layout & Responsivo", () => {
  it("seção tem min-h-screen para garantir altura mínima", () => {
    const { container } = render(<About />);
    const section = container.querySelector("section");
    expect(section?.className).toMatch(/min-h-screen/);
  });

  it("foto NÃO usa md:absolute (layout flex, não overlapping)", () => {
    const { container } = render(<About />);
    const photo = container.querySelector('[data-testid="about-photo"]');
    expect(photo?.className).not.toContain("md:absolute");
  });
});
