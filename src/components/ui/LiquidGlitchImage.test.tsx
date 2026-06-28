import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { LiquidGlitchImage } from "./LiquidGlitchImage";
import { LiquidGlassProvider } from "./LiquidGlassProvider";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <LiquidGlassProvider>{children}</LiquidGlassProvider>;
}

describe("LiquidGlitchImage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete window.liquidGL;
    delete window.__liquidGLRenderer__;
  });

  it("renderiza imagem base com src", () => {
    const { container } = render(
      <Wrapper>
        <LiquidGlitchImage src="/test.jpg" alt="Test image" />
      </Wrapper>
    );

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/test.jpg");
    expect(img?.getAttribute("alt")).toBe("Test image");
  });

  it("renderiza LiquidGlassLens como overlay", () => {
    const { container } = render(
      <Wrapper>
        <LiquidGlitchImage src="/test.jpg" alt="Test image" />
      </Wrapper>
    );

    // Deve conter a classe do LiquidGlassLens
    const lens = container.querySelector('[class*="liquid-glass-lens"]');
    expect(lens).not.toBeNull();
  });

  it("renderiza camadas de glitch quando active=true", () => {
    const { container } = render(
      <Wrapper>
        <LiquidGlitchImage src="/test.jpg" alt="Test" active={true} />
      </Wrapper>
    );

    // As camadas glitch devem existir
    const glitchLayers = container.querySelectorAll('[class*="glitch-layer"]');
    expect(glitchLayers.length).toBeGreaterThan(0);
  });

  it("não renderiza camadas glitch quando active=false", () => {
    const { container } = render(
      <Wrapper>
        <LiquidGlitchImage src="/test.jpg" alt="Test" active={false} />
      </Wrapper>
    );

    const glitchLayers = container.querySelectorAll('[class*="glitch-layer-1"]');
    expect(glitchLayers.length).toBe(0);
  });

  it("renderiza com className customizado", () => {
    const { container } = render(
      <Wrapper>
        <LiquidGlitchImage src="/test.jpg" alt="Test" className="custom-img" />
      </Wrapper>
    );

    expect(container.querySelector(".custom-img")).not.toBeNull();
  });
});
