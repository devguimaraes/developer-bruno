import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiquidGlassLens } from "./LiquidGlassLens";
import { LiquidGlassProvider } from "./LiquidGlassProvider";

describe("LiquidGlassLens", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete window.liquidGL;
    delete window.__liquidGLRenderer__;
  });

  it("renderiza children", () => {
    render(
      <LiquidGlassProvider>
        <LiquidGlassLens>
          <span data-testid="inner">conteúdo interno</span>
        </LiquidGlassLens>
      </LiquidGlassProvider>
    );

    expect(screen.getByTestId("inner")).toBeDefined();
  });

  it("renderiza com classe CSS base", () => {
    const { container } = render(
      <LiquidGlassProvider>
        <LiquidGlassLens data-testid="lens">
          <span>test</span>
        </LiquidGlassLens>
      </LiquidGlassProvider>
    );

    const lens = container.querySelector('[class*="liquid-glass-lens"]');
    expect(lens).not.toBeNull();
  });

  it("aplica fallback CSS quando isSupported=false (jsdom)", () => {
    const { container } = render(
      <LiquidGlassProvider>
        <LiquidGlassLens data-testid="lens">
          <span>test</span>
        </LiquidGlassLens>
      </LiquidGlassProvider>
    );

    // Deve ter a classe de fallback (backdrop-filter CSS)
    const fallback = container.querySelector('[class*="liquid-glass-lens--fallback"]');
    expect(fallback).not.toBeNull();
  });

  it("aceita className customizado", () => {
    const { container } = render(
      <LiquidGlassProvider>
        <LiquidGlassLens className="minha-classe-custom">
          <span>test</span>
        </LiquidGlassLens>
      </LiquidGlassProvider>
    );

    expect(container.querySelector(".minha-classe-custom")).not.toBeNull();
  });

  it("aceita props de estilo (height, width)", () => {
    const { container } = render(
      <LiquidGlassProvider>
        <LiquidGlassLens height={80} width="100%">
          <span>test</span>
        </LiquidGlassLens>
      </LiquidGlassProvider>
    );

    const lens = container.firstElementChild as HTMLElement;
    expect(lens).not.toBeNull();
  });
});
