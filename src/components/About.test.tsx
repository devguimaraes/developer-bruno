import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "./About";

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
    // Usar getAllByTitle porque há múltiplos elementos (incluindo os icons)
    const linkedins = screen.getAllByTitle(/LinkedIn/i);
    const instagrams = screen.getAllByTitle(/Instagram/i);
    const xLinks = screen.getAllByTitle(/X/i);
    const whatsapps = screen.getAllByTitle(/WhatsApp/i);

    // Verificar que pelo menos um link de cada tipo existe
    expect(linkedins.length).toBeGreaterThan(0);
    expect(instagrams.length).toBeGreaterThan(0);
    expect(xLinks.length).toBeGreaterThan(0);
    expect(whatsapps.length).toBeGreaterThan(0);

    // Verificar que pelo menos um tem o href correto
    expect(linkedins.some(el => el.getAttribute("href") === "https://www.linkedin.com/in/bcguimaraes/")).toBe(true);
    expect(instagrams.some(el => el.getAttribute("href") === "https://www.instagram.com/brunoguimraes/")).toBe(true);
    expect(xLinks.some(el => el.getAttribute("href") === "https://x.com/devguimraes")).toBe(true);
    expect(whatsapps.some(el => el.getAttribute("href")?.includes("wa.me"))).toBe(true);
  });

  it("o link do WhatsApp deve conter a mensagem personalizada", () => {
    render(<About />);
    const whatsapps = screen.getAllByTitle(/WhatsApp/i);
    const whatsappLink = whatsapps.find(el => el.getAttribute("href")?.includes("wa.me"));
    expect(whatsappLink).toBeDefined();
    const href = whatsappLink?.getAttribute("href") || "";
    expect(decodeURIComponent(href)).toContain("vi seu portfólio");
  });

  it("deve renderizar o ticker de tecnologias", () => {
    render(<About />);
    // Usar getAllByText porque o marquee duplica as techs
    const nextjsElements = screen.getAllByText("Next.js");
    const typescriptElements = screen.getAllByText("TypeScript");
    const tailwindElements = screen.getAllByText("Tailwind");

    expect(nextjsElements.length).toBeGreaterThan(0);
    expect(typescriptElements.length).toBeGreaterThan(0);
    expect(tailwindElements.length).toBeGreaterThan(0);
  });
});
