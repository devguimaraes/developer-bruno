import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import About from "./About";

// Mock do framer-motion robusto
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <section {...props}>{children}</section>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
    a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useScroll: () => ({ scrollY: { get: () => 0, onChange: vi.fn(), on: vi.fn() } }),
  useTransform: () => ({ get: () => 0 }),
  useInView: () => true,
}));

// Mock do GlassSurface
vi.mock("@/components/ui/GlassSurface", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-surface" className={className}>{children}</div>
  ),
}));

// Mock do ScrollReveal
vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-reveal">{children}</div>
  ),
}));

describe("About Component - Editorial Biography", () => {
  it("deve renderizar a biografia atualizada com 5 anos de experiência e SENAC-RJ", () => {
    render(<About />);
    expect(screen.getByText(/5 anos de experiência/i)).toBeInTheDocument();
    expect(screen.getByText(/SENAC-RJ/i)).toBeInTheDocument();
  });

  it("deve renderizar os links sociais corretos", () => {
    render(<About />);
    const linkedin = screen.getByLabelText(/LinkedIn/i);
    const instagram = screen.getByLabelText(/Instagram/i);
    const twitter = screen.getByLabelText(/X \(Twitter\)/i);
    const whatsapp = screen.getByLabelText(/WhatsApp/i);

    expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/bcguimaraes/");
    expect(instagram).toHaveAttribute("href", "https://www.instagram.com/brunoguimraes/");
    expect(twitter).toHaveAttribute("href", "https://x.com/devguimraes");
    expect(whatsapp).toHaveAttribute("href", expect.stringMatching(/wa\.me/i));
  });

  it("o link do WhatsApp deve conter a mensagem personalizada", () => {
    render(<About />);
    const whatsapp = screen.getByLabelText(/WhatsApp/i);
    const href = whatsapp.getAttribute("href") || "";
    expect(decodeURIComponent(href)).toContain("Olá Bruno, vim através do seu site");
  });

  it("deve renderizar o ticker de tecnologias", () => {
    render(<About />);
    expect(screen.getByText("REACT")).toBeInTheDocument();
    expect(screen.getByText("TYPESCRIPT")).toBeInTheDocument();
    expect(screen.getByText("NEXT.JS")).toBeInTheDocument();
  });
});
