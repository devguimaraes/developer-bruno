import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import { Hero } from "./Hero";

const originalMatchMedia = window.matchMedia;
const FRAME_MS = 16;
const LIMIT_MS = 20_000;

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

// Índices (data-tag) dos rótulos que estão mostrados agora.
function shownTags(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll(".hb-tag.is-shown"),
    n => n.getAttribute("data-tag") ?? ""
  );
}

// Avança o tempo falso quadro a quadro até o estado de rótulos satisfazer `done`. Devolve os
// estados distintos pelos quais passou. Se não chegar, falha em vez de afrouxar a condição.
async function advanceUntil(
  container: HTMLElement,
  done: (shown: string[]) => boolean
): Promise<string[][]> {
  const history: string[][] = [];
  for (let t = 0; t <= LIMIT_MS; t += FRAME_MS) {
    const shown = shownTags(container);
    if (history.at(-1)?.join() !== shown.join()) history.push(shown);
    if (done(shown)) return history;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(FRAME_MS);
    });
  }
  throw new Error(`o laço não chegou ao estado esperado em ${LIMIT_MS}ms`);
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "performance",
    ],
  });
});

afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = originalMatchMedia;
  act(() => setLocale("pt"));
});

describe("useHeroStack, rótulos da linha", () => {
  it("nenhum rótulo aparece antes de o Giro chegar na primeira estação", () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    expect(shownTags(container)).toEqual([]);
  });

  it("depois da visita à camada 0, só o rótulo de tokens está mostrado", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    await advanceUntil(container, shown => shown.includes("0"));

    expect(shownTags(container)).toEqual(["0"]);
  });

  it("digita os rótulos na ordem das estações, esconde todos ao fechar a pilha e repete no ciclo seguinte", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    const firstCycle = await advanceUntil(container, shown => shown.length === 4);
    const closed = await advanceUntil(container, shown => shown.length === 0);
    const nextCycle = await advanceUntil(container, shown => shown.includes("0"));

    expect(firstCycle).toEqual([[], ["0"], ["0", "1"], ["0", "1", "2"], ["0", "1", "2", "3"]]);
    expect(closed).toEqual([["0", "1", "2", "3"], []]);
    expect(nextCycle.at(-1)).toEqual(["0"]);
  });

  it("com movimento reduzido, os quatro rótulos ficam mostrados de uma vez", () => {
    mockReducedMotion(true);
    const { container } = render(<Hero />);

    expect(shownTags(container)).toEqual(["0", "1", "2", "3"]);
  });

  it("--n acompanha o número de caracteres de cada rótulo, também depois da troca de idioma", () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);
    const tag = (i: number) => container.querySelector<HTMLElement>(`.hb-tag[data-tag="${i}"]`);

    // "// componentes" tem 14 caracteres.
    expect(tag(0)?.style.getPropertyValue("--n")).toBe("9");
    expect(tag(1)?.style.getPropertyValue("--n")).toBe("14");

    act(() => setLocale("en"));

    // "// components" tem 13 caracteres.
    expect(tag(1)?.style.getPropertyValue("--n")).toBe("13");
  });
});
