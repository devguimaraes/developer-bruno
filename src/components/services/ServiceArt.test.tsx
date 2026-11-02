import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceArt } from "./ServiceArt";

// O import rejeita: a caixa fica vazia e o erro vai para o console.
vi.mock("@/assets/service-art/product-ui.html?raw", () => ({
  get default() {
    throw new Error("arte quebrada");
  },
}));

describe("ServiceArt", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Regressão: o host tem altura zero até a arte chegar e, recortado pelo card, nunca conta
  // como visível. Observado ele, as artes fora da primeira dobra não carregavam.
  it("observa a caixa com a proporção da arte, não o host vazio", () => {
    const observed: Element[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = (element: Element) => observed.push(element);
        disconnect = vi.fn();
        unobserve = vi.fn();
        takeRecords = () => [];
      }
    );

    const { container } = render(<ServiceArt name="landing-pages" />);
    const box = container.querySelector(".service-art");

    expect(observed.length).toBeGreaterThan(0);
    for (const element of observed) expect(element).toBe(box);
    expect(box).toHaveStyle({ aspectRatio: "1.528" });
  });

  it("reporta o erro e deixa a caixa vazia quando a arte não carrega", async () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private callback: IntersectionObserverCallback) {}
        observe = (target: Element) =>
          this.callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver
          );
        disconnect = vi.fn();
        unobserve = vi.fn();
        takeRecords = () => [];
      }
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(<ServiceArt name="product-ui" />);

    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(container.querySelector(".service-art")).toHaveAttribute("data-ready", "false");
    expect(container.querySelector(".service-art__host")?.childElementCount).toBe(0);
    consoleError.mockRestore();
  });

  it("com movimento reduzido mostra a arte montada, sem a entrada", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private callback: IntersectionObserverCallback) {}
        observe = (target: Element) =>
          this.callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver
          );
        disconnect = vi.fn();
        unobserve = vi.fn();
        takeRecords = () => [];
      }
    );

    const { container } = render(<ServiceArt name="landing-pages" />);

    await waitFor(() => {
      const art = container.querySelector(".ar");
      expect(art).not.toBeNull();
      expect(art).toHaveClass("is-still");
      expect(art).not.toHaveClass("is-pre");
    });
  });
});
