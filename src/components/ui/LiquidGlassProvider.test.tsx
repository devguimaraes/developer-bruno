import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiquidGlassProvider, useLiquidGlassContext } from "./LiquidGlassProvider";

// Componente de teste que consome o contexto
function TestConsumer() {
  const ctx = useLiquidGlassContext();
  return (
    <div>
      <span data-testid="supported">{String(ctx.isSupported)}</span>
      <span data-testid="ready">{String(ctx.isReady)}</span>
      <span data-testid="hasRegisterLens">{String(typeof ctx.registerLens === "function")}</span>
      <span data-testid="hasUnregisterLens">
        {String(typeof ctx.unregisterLens === "function")}
      </span>
    </div>
  );
}

describe("LiquidGlassProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete window.liquidGL;
    delete window.__liquidGLRenderer__;
  });

  it("renderiza children", () => {
    render(
      <LiquidGlassProvider>
        <div data-testid="child">conteúdo</div>
      </LiquidGlassProvider>
    );

    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("provê contexto com isSupported=false em jsdom (sem WebGL)", () => {
    render(
      <LiquidGlassProvider>
        <TestConsumer />
      </LiquidGlassProvider>
    );

    expect(screen.getByTestId("supported").textContent).toBe("false");
    expect(screen.getByTestId("ready").textContent).toBe("false");
  });

  it("provê registerLens e unregisterLens via contexto", () => {
    render(
      <LiquidGlassProvider>
        <TestConsumer />
      </LiquidGlassProvider>
    );

    expect(screen.getByTestId("hasRegisterLens").textContent).toBe("true");
    expect(screen.getByTestId("hasUnregisterLens").textContent).toBe("true");
  });
});
