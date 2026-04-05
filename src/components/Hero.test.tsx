import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Hero from "./Hero";

// Mock do framer-motion para componentes internos
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useScroll: () => ({ scrollY: { get: () => 0, onChange: vi.fn(), on: vi.fn() } }),
  useTransform: () => ({ get: () => 0 }),
  useSpring: () => ({ get: () => 0 }),
}));

// Mock do GlassSurface
vi.mock("@/components/ui/GlassSurface", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-surface" className={className}>{children}</div>
  ),
}));

// Mock do Marquee
vi.mock("@/components/ui/Marquee", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marquee">{children}</div>
  ),
}));

describe("Hero Component - Editorial Redesign", () => {
  it("deve renderizar o título principal FRONT END DEVELOPER", () => {
    render(<Hero />);
    expect(screen.getByText("FRONT END")).toBeInTheDocument();
    expect(screen.getByText("DEVELOPER")).toBeInTheDocument();
  });

  it("deve renderizar a descrição técnica sem 'Front end' (removido no redesign)", () => {
    render(<Hero />);
    const description = screen.getByText(/interfaces digitais de alto impacto/i);
    expect(description).toBeInTheDocument();
    expect(description.textContent).not.toMatch(/Front end/i);
  });

  it("deve exibir as tecnologias principais", () => {
    render(<Hero />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Astro")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("deve renderizar elementos decorativos brutalistas", () => {
    render(<Hero />);
    expect(screen.getByText("EST. 2020")).toBeInTheDocument();
    expect(screen.getByText("DISPONÍVEL PARA PROJETOS")).toBeInTheDocument();
  });

  it("deve ter a estrutura de GlassSurface conforme o novo design", () => {
    render(<Hero />);
    const glassSurfaces = screen.getAllByTestId("glass-surface");
    expect(glassSurfaces.length).toBeGreaterThan(0);
  });
});
