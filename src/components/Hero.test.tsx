import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Hero from "./Hero";

// Mock do framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: { children: React.ReactNode }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: { children: React.ReactNode }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock do Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe("Hero Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document.getElementById para os scroll handlers
    document.getElementById = vi.fn().mockReturnValue({
        scrollIntoView: vi.fn()
    });
  });

  it("deve renderizar o nome do desenvolvedor com destaque", () => {
    render(<Hero />);
    expect(screen.getByText("Bruno")).toBeDefined();
    expect(screen.getByText("Guimarães")).toBeDefined();
  });

  it("deve renderizar a descrição profissional", () => {
    render(<Hero />);
    expect(screen.getByText(/Desenvolvedor Front-end/i)).toBeInTheDocument();
    // "performance" aparece na descrição e no Marquee
    const perfElements = screen.getAllByText(/performance/i);
    expect(perfElements.length).toBeGreaterThan(0);
  });

  it("deve conter os botões de ação (CTA)", () => {
    render(<Hero />);
    expect(screen.getByText(/EXPLORAR PORTFÓLIO/i)).toBeDefined();
    expect(screen.getByText(/INICIAR PROJETO/i)).toBeDefined();
  });

  it("deve chamar scrollIntoView ao clicar nos botões de CTA", () => {
    render(<Hero />);
    
    const exploreBtn = screen.getByText(/EXPLORAR PORTFÓLIO/i);
    fireEvent.click(exploreBtn);
    
    // Como o componente usa document.getElementById('projects')?.scrollIntoView()
    // verificamos se o document.getElementById foi chamado
    expect(document.getElementById).toHaveBeenCalledWith("projects");
  });

  it("deve renderizar o badge de status do sistema", () => {
    render(<Hero />);
    expect(screen.getByText(/SYSTEM_READY/i)).toBeDefined();
  });
});
