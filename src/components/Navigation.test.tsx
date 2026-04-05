import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navigation from "./Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock do framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
    nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useScroll: () => ({ scrollY: { get: () => 0, onChange: vi.fn(), on: vi.fn() } }),
  useTransform: () => ({ get: () => 0 }),
}));

// Mock do hook useIsMobile
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: vi.fn(() => false),
}));

// Mock do componente StaggeredMenu
vi.mock("@/components/ui/StaggeredMenu", () => ({
  default: ({ isOpen, onClose, items }: { isOpen: boolean; onClose: () => void; items: Array<{ label: string; href: string }> }) => (
    isOpen ? (
      <div data-testid="mobile-menu">
        <button onClick={onClose}>Close</button>
        {items.map((item) => (
          <a key={item.label} href={item.href} onClick={onClose}>{item.label}</a>
        ))}
      </div>
    ) : null
  ),
}));

// Mock do componente Magnetic
vi.mock("@/components/ui/Magnetic", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Navigation Component - Brutalist Glass", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNav = () => {
    return render(<Navigation />);
  };

  it("deve renderizar o logo com o nome BRUNO / GUIMARÃES", () => {
    renderNav();
    // No redesign, o nome aparece no menu desktop e pode aparecer em outros lugares (ex: mobile)
    expect(screen.getAllByText("BRUNO").length).toBeGreaterThan(0);
    expect(screen.getAllByText("GUIMARÃES").length).toBeGreaterThan(0);
  });

  it("deve renderizar os links de navegação corretos no desktop", () => {
    renderNav();
    expect(screen.getByText("PROJETOS")).toBeInTheDocument();
    expect(screen.getByText("SOBRE")).toBeInTheDocument();
    expect(screen.getByText("CONTATO")).toBeInTheDocument();
  });

  it("não deve renderizar o link de INÍCIO (removido no redesign)", () => {
    renderNav();
    expect(screen.queryByText("INÍCIO")).toBeNull();
    expect(screen.queryByText("//INÍCIO")).toBeNull();
  });

  it("deve abrir o menu mobile ao clicar no botão de toggle", () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    
    renderNav();
    
    const toggleButton = screen.getByLabelText(/Abrir menu/i);
    fireEvent.click(toggleButton);

    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
    // No mobile menu, os links são renderizados. 
    // Como getByText falha com múltiplos, usamos getAllByText e pegamos o do menu ou verificamos a existência.
    const projectsLinks = screen.getAllByText("PROJETOS");
    expect(projectsLinks.length).toBeGreaterThan(0);
    expect(screen.getByText("SOBRE", { selector: "#mobile-menu a, [data-testid='mobile-menu'] a" })).toBeInTheDocument();
  });

  it("deve fechar o menu mobile ao clicar em um link", () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    
    renderNav();
    
    // Abre o menu
    fireEvent.click(screen.getByLabelText(/Abrir menu/i));
    
    // Pega o link no menu mobile especificamente
    const mobileLink = screen.getByText("SOBRE", { selector: "[data-testid='mobile-menu'] a" });
    fireEvent.click(mobileLink);

    expect(screen.queryByTestId("mobile-menu")).toBeNull();
  });
});
