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
  it("deve renderizar a seção de contato", () => {
    render(<Contact />);
    const contactSection = document.querySelector("#contact");
    expect(contactSection).toBeInTheDocument();
  });

  it("deve renderizar o botão de acesso ao email", () => {
    render(<Contact />);
    expect(screen.getByText(/ACCESS_SIGNAL_PORT/)).toBeInTheDocument();
  });

  it("deve renderizar a seção de redes sociais", () => {
    render(<Contact />);
    expect(screen.getByText(/SOCIAL_NETWORKS/)).toBeInTheDocument();
  });

  it("deve conter o disclaimer", () => {
    render(<Contact />);
    expect(screen.getByText(/DISCLAIMER:/i)).toBeInTheDocument();
  });
});
