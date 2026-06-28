import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LenisProvider, useLenis } from "./LenisContext";

function TestConsumer() {
  const { lenis } = useLenis();
  return <span data-testid="has-lenis">{String(lenis !== null)}</span>;
}

describe("LenisContext", () => {
  it("provê contexto com lenis null por padrão", () => {
    render(
      <LenisProvider>
        <TestConsumer />
      </LenisProvider>
    );

    // Em jsdom, Lenis não é instanciado (não há window)
    expect(screen.getByTestId("has-lenis").textContent).toBe("false");
  });

  it("renderiza children", () => {
    render(
      <LenisProvider>
        <div data-testid="child">conteúdo</div>
      </LenisProvider>
    );

    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("useLenis fora do provider retorna valores default seguros", () => {
    // Comportamento SSR-safe: ao invés de throw, retorna lenis null
    // (useLenis retorna do contexto; sem provider, o contexto é null)
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Não deve lançar — trata-se de SSR-safe
    expect(() => render(<TestConsumer />)).not.toThrow();

    spy.mockRestore();
  });
});
