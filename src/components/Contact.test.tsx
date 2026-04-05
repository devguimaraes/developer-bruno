import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Contact from "./Contact";

// O mock global do framer-motion em setup.ts deve ser suficiente
// Mas vamos garantir que os componentes UI internos sejam mockados se necessário

vi.mock("@/components/ui/GlassSurface", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-surface" className={className}>{children}</div>
  ),
}));

vi.mock("@/components/ui/Magnetic", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="magnetic">{children}</div>
  ),
}));

vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-reveal">{children}</div>
  ),
}));

describe("Contact Component - Final Conversion", () => {
  it("deve renderizar o título principal e a chamada para ação", () => {
    render(<Contact />);
    expect(screen.getByText(/PRONTO PARA/i)).toBeInTheDocument();
    expect(screen.getByText(/CONSTRUIR/i)).toBeInTheDocument();
  });

  it("deve exibir o badge de status e disponibilidade", () => {
    render(<Contact />);
    expect(screen.getByText(/CANAL_ABERTO/i)).toBeInTheDocument();
    expect(screen.getByText(/DISPONÍVEL PARA NOVOS PROJETOS/i)).toBeInTheDocument();
  });

  it("deve renderizar os links de redes sociais principais", () => {
    render(<Contact />);
    expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp/i)).toBeInTheDocument();
  });

  it("deve conter os links corretos para as redes sociais", () => {
    render(<Contact />);
    const linkedin = screen.getByRole("link", { name: /LinkedIn/i });
    expect(linkedin).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
    
    const whatsapp = screen.getByRole("link", { name: /WhatsApp/i });
    expect(whatsapp).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});
