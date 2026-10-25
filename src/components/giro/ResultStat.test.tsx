import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ResultStat } from "./ResultStat";

// IntersectionObserver de teste: guarda o callback para disparar "entrou na tela" à mão.
let observerCallback: IntersectionObserverCallback | undefined;

class IntersectionObserverStub {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

function enterScreen() {
  act(() => {
    observerCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
}

function setReducedMotion(reduced: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: reduced && query.includes("reduce"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
}

function valueText(): string {
  return document.querySelector(".g-stat__value")?.textContent ?? "";
}

beforeEach(() => {
  vi.useFakeTimers();
  setReducedMotion(false);
  observerCallback = undefined;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ResultStat — contagem", () => {
  it("começa em 0 e só conta depois de entrar na tela, em 900 ms", () => {
    render(<ResultStat value="+40%" label="contatos internacionais" source="SEMOGRJ" />);
    expect(valueText()).toBe("+0%");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(valueText()).toBe("+0%");

    enterScreen();
    act(() => {
      vi.advanceTimersByTime(450);
    });
    const middle = Number(valueText().slice(1, -1));
    expect(middle).toBeGreaterThan(0);
    expect(middle).toBeLessThan(40);

    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(valueText()).toBe("+40%");
  });

  it("mantém o separador decimal e as casas do valor", () => {
    render(<ResultStat value="3,5x" label="mais rápido" source="site anterior" />);
    enterScreen();
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(valueText()).toBe("3,5x");
  });

  it("não conta se o valor não tem número", () => {
    render(<ResultStat value="—" label="sem dado" source="fonte" />);
    enterScreen();
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(valueText()).toBe("—");
  });
});

describe("ResultStat — movimento reduzido", () => {
  it.each([
    ["+40%", "+40%"],
    ["−30%", "−30%"],
    ["3x", "3x"],
  ])("mostra %s pronto, sem contar", (value, expected) => {
    setReducedMotion(true);
    render(<ResultStat value={value} label="rótulo" source="fonte" />);
    expect(valueText()).toBe(expected);
  });
});

describe("ResultStat — renderização", () => {
  it("renderiza rótulo e fonte", () => {
    setReducedMotion(true);
    render(<ResultStat value="+40%" label="contatos internacionais" source="SEMOGRJ" />);
    expect(screen.getByText("contatos internacionais")).toBeInTheDocument();
    expect(screen.getByText("SEMOGRJ")).toBeInTheDocument();
  });
});
