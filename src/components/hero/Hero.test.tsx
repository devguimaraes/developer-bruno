import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

const originalMatchMedia = window.matchMedia;
let rafSpy: { mockRestore: () => void } | undefined;

// Movimento reduzido ligado: só a consulta de prefers-reduced-motion responde true.
function mockReducedMotion(reduced: boolean): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeAll(() => {
  // jsdom não tem canvas 2D: o campo precisa ficar desligado sem quebrar a ilha.
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    writable: true,
    value: () => null,
  });
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  rafSpy?.mockRestore();
  rafSpy = undefined;
});

describe("Hero", () => {
  it("renderiza rótulo, título, abertura e os dois botões com destino", () => {
    mockReducedMotion(false);
    render(<Hero />);

    expect(screen.getByText("// desenvolvedor front-end · rio de janeiro")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Interfaces com vida." })).toBeInTheDocument();
    expect(screen.getByText(/Sites, lojas e sistemas em React/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver projetos" })).toHaveAttribute("href", "#projetos");
    expect(screen.getByRole("link", { name: "Falar comigo" })).toHaveAttribute("href", "#contato");
  });

  it("dá nome ao botão do pulo e o deixa ativo fora do movimento reduzido", () => {
    mockReducedMotion(false);
    render(<Hero />);

    expect(screen.getByRole("button", { name: "Fazer o Giro pular" })).toBeEnabled();
  });

  it("com movimento reduzido, não roda o loop e deixa o pulo inerte", async () => {
    mockReducedMotion(true);
    const raf = vi.spyOn(window, "requestAnimationFrame");
    rafSpy = raf;
    const { container } = render(<Hero />);

    // Dá tempo para os efeitos assentarem; o motor não pode voltar a pedir quadros.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const calls = raf.mock.calls.length;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(raf.mock.calls.length).toBe(calls);
    expect(container.querySelector(".hr-stage")).toHaveClass("is-out");
    expect(screen.getByRole("button", { name: "Fazer o Giro pular" })).toBeDisabled();
  });
});
