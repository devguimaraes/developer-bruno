import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Contact from "./Contact";

// Mock do framer-motion para evitar animações em testes
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: { children: React.ReactNode }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: { children: React.ReactNode }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: { children: React.ReactNode }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock do componente UI de animação para simplificar o teste
vi.mock("@/components/ui/motion-components", () => ({
  TextReveal: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe("Contact Component", () => {
  it("deve renderizar o título principal e a chamada para ação", () => {
    render(<Contact />);
    expect(screen.getAllByText(/PRONTO PARA/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CONSTRUIR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/JUNTOS\?/i).length).toBeGreaterThan(0);
  });

  it("deve exibir o badge de status e disponibilidade", () => {
    render(<Contact />);
    expect(screen.getByText(/CANAL_ABERTO/i)).toBeDefined();
    expect(screen.getByText(/DISPONÍVEL PARA NOVOS PROJETOS/i)).toBeDefined();
  });

  it("deve renderizar os links de redes sociais do config", () => {
    render(<Contact />);
    // Os spans contêm o texto 'LinkedIn', 'GitHub', etc.
    expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
  });

  it("deve conter os usernames corretos nos links sociais", () => {
    render(<Contact />);
    // Verifica se @ aparece conforme o código (span com @item.username)
    const usernames = screen.getAllByText(/@/);
    expect(usernames.length).toBeGreaterThan(0);
  });
});
