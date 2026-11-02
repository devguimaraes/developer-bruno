import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceArt } from "./ServiceArt";

// Uma arte quebrada: o arquivo chega, mas não é um SVG.
vi.mock("@/assets/service-art/product-ui.svg?raw", () => ({ default: "<div>quebrada</div>" }));

describe("ServiceArt", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Regressão: o host do SVG tem altura zero até a arte chegar e, recortado pelo card, nunca
  // conta como visível. Observado ele, as artes fora da primeira dobra não carregavam.
  it("observa a caixa com a proporção da arte, não o host vazio do SVG", () => {
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
    expect(box).toHaveStyle({ aspectRatio: "431 / 301" });
  });

  // Regressão: quando a arte falhava, o Giro girava para sempre no lugar dela.
  it("tira o Giro e reporta o erro quando a arte não é um SVG", async () => {
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
    expect(container.querySelector(".service-art__loading")).toBeNull();
    expect(container.querySelector(".service-art__svg")?.childElementCount).toBe(0);
    consoleError.mockRestore();
  });
});
