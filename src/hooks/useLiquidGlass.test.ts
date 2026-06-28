import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLiquidGlass } from "./useLiquidGlass";

describe("useLiquidGlass", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // jsdom não tem WebGL — o hook deve detectar isso
    delete window.liquidGL;
    delete window.__liquidGLRenderer__;
  });

  it("retorna isSupported=false quando WebGL não está disponível (jsdom)", () => {
    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isReady).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("retorna isSupported=false quando prefers-reduced-motion está ativo", () => {
    // Simula prefers-reduced-motion: reduce
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => {
      if (query === "(prefers-reduced-motion: reduce)") {
        return { matches: true, media: query } as MediaQueryList;
      }
      return { matches: false, media: query } as MediaQueryList;
    });

    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.isSupported).toBe(false);
  });

  it("expõe os métodos registerLens, unregisterLens e refreshSnapshot", () => {
    const { result } = renderHook(() => useLiquidGlass({}));

    expect(typeof result.current.registerLens).toBe("function");
    expect(typeof result.current.unregisterLens).toBe("function");
    expect(typeof result.current.refreshSnapshot).toBe("function");
  });

  it("não tenta carregar scripts quando isSupported é false", () => {
    // O hook não deve tentar criar elementos script quando WebGL indisponível
    const createElementSpy = vi.spyOn(document, "createElement");

    renderHook(() => useLiquidGlass({}));

    // Não deve criar <script> tags (não há WebGL)
    const scriptCalls = createElementSpy.mock.calls.filter(call => call[0] === "script");
    expect(scriptCalls.length).toBe(0);
  });
});
