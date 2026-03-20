import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  beforeEach(() => {
    // Reset window width
    vi.stubGlobal("innerWidth", 1024);
    // Mock matchMedia
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // depreciado mas usado no hook
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  it("deve retornar false se a largura for desktop (> 768px)", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("deve retornar true se a largura for mobile (< 768px)", () => {
    vi.stubGlobal("innerWidth", 375);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("deve atualizar o estado quando a janela for redimensionada", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simular disparo do evento de resize/change
    act(() => {
      vi.stubGlobal("innerWidth", 375);
      // Disparar evento window resize que muitos hooks usam (embora este use matchMedia)
      window.dispatchEvent(new Event('resize'));
      
      // Como o hook especificamente usa mql.addEventListener, vamos disparar o callback
      // O mock do matchMedia armazena callbacks se implementarmos melhor, 
      // mas vamos apenas forçar o re-render ou disparar o listener capturado.
    });

    // Tentar capturar o listener de qualquer chamada matchMedia
    const matchMediaMock = vi.mocked(window.matchMedia);
    const mqlInstance = matchMediaMock.mock.results[0].value;
    
    act(() => {
      if (mqlInstance.addEventListener.mock.calls.length > 0) {
        const callback = mqlInstance.addEventListener.mock.calls[0][1];
        callback();
      }
    });

    expect(result.current).toBe(true);
  });
});
