import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLiquidGlass } from "./useLiquidGlass";

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe("useLiquidGlass — responsividade e performance", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete window.liquidGL;
    delete window.__liquidGLRenderer__;
    // Reset para desktop
    setWindowWidth(1440);
    // Remove connection mock
    Object.defineProperty(navigator, "connection", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  it("retorna isSupported=false quando navigator.connection.saveData é true", () => {
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true, effectiveType: "4g" },
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useLiquidGlass({}));
    expect(result.current.isSupported).toBe(false);
  });

  it("retorna isSupported=false em conexão 2g", () => {
    Object.defineProperty(navigator, "connection", {
      value: { saveData: false, effectiveType: "2g" },
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useLiquidGlass({}));
    expect(result.current.isSupported).toBe(false);
  });

  it("retorna isSupported=false em conexão slow-2g", () => {
    Object.defineProperty(navigator, "connection", {
      value: { saveData: false, effectiveType: "slow-2g" },
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useLiquidGlass({}));
    expect(result.current.isSupported).toBe(false);
  });

  it("retorna resolution=1 para mobile (< 768px)", () => {
    setWindowWidth(375); // iPhone

    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.resolution).toBe(1);
  });

  it("retorna resolution=1.5 para tablet (768-1023px)", () => {
    setWindowWidth(820); // iPad Air

    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.resolution).toBe(1.5);
  });

  it("retorna resolution=2 para desktop (>= 1024px)", () => {
    setWindowWidth(1440);

    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.resolution).toBe(2);
  });

  it("desabilita specular e tilt em mobile", () => {
    setWindowWidth(375);

    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.isSpecularEnabled).toBe(false);
    expect(result.current.isTiltEnabled).toBe(false);
  });

  it("habilita specular mas não tilt em tablet", () => {
    setWindowWidth(820);

    const { result } = renderHook(() => useLiquidGlass({}));

    expect(result.current.isSpecularEnabled).toBe(true);
    expect(result.current.isTiltEnabled).toBe(false); // touch device em jsdom
  });
});
