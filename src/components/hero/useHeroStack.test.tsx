import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import { Hero } from "./Hero";

const originalMatchMedia = window.matchMedia;
const FRAME_MS = 16;
// Quatro quadros por act: os estados conferidos duram centenas de ms, e um act por quadro deixa a
// simulação lenta demais quando a suíte inteira roda em paralelo.
const STEP_MS = FRAME_MS * 4;
const LIMIT_MS = 20_000;
// A simulação percorre segundos de laço; o limite padrão de 5 s não basta com a suíte em paralelo.
const SIM_TIMEOUT_MS = 15_000;

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
  for (let t = 0; t <= LIMIT_MS; t += STEP_MS) {
    const shown = shownTags(container);
    if (history.at(-1)?.join() !== shown.join()) history.push(shown);
    if (done(shown)) return history;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(STEP_MS);
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

describe("useHeroStack, rótulos da linha", { timeout: SIM_TIMEOUT_MS }, () => {
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

  it("a pilha fecha e esconde rótulos no pouso ao voltar ao chão", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    // Espera todas as 4 estações serem visitadas
    await advanceUntil(container, shown => shown.length === 4);
    // Espera o pouso no chão fechar a pilha
    await advanceUntil(container, shown => shown.length === 0);

    expect(shownTags(container)).toEqual([]);
    expect(container.querySelector('[data-hud="layer"]')?.textContent).toBe("chão");
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

// Avança quadro a quadro até o painel de estado mostrar `state`.
async function advanceUntilState(container: HTMLElement, state: string): Promise<void> {
  for (let t = 0; t <= LIMIT_MS; t += STEP_MS) {
    if (container.querySelector('[data-hud="state"]')?.textContent === state) return;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(STEP_MS);
    });
  }
  throw new Error(`o painel não chegou a "${state}" em ${LIMIT_MS}ms`);
}

describe("useHeroStack, entrada desenhada no trajeto novo", { timeout: SIM_TIMEOUT_MS }, () => {
  it("depois do lançamento o painel passa por no ar e termina em pronto, com o Giro na estação de tokens", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    await advanceUntilState(container, "no ar");
    await advanceUntilState(container, "pronto");

    // Estacionado em tokens: transform limpo e rótulo de tokens ligado
    expect(container.querySelector<HTMLElement>(".hb-rider__in")?.style.transform).toBe("");
    expect(shownTags(container)).toEqual(["0"]);
  });

  it("desenha o rastro enquanto o Giro está no ar", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    await advanceUntilState(container, "no ar");
    // Alguns quadros de voo: o histórico junta pontos de um quadro para o outro.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(FRAME_MS * 10);
    });

    expect(container.querySelector(".hb-trail__p")?.getAttribute("d")).toMatch(/^M.+Z$/);
  });

  it("a pilha abre no impacto e a camada 2 acende com is-hit", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    let sawHit = false;
    for (let t = 0; t <= LIMIT_MS; t += FRAME_MS) {
      if (container.querySelector('[data-layer="2"]')?.classList.contains("is-hit")) {
        sawHit = true;
        break;
      }
      await act(async () => {
        await vi.advanceTimersByTimeAsync(FRAME_MS);
      });
    }

    expect(sawHit).toBe(true);
  });

  it("o pouso em tokens dispara a camada 0 com is-fire", async () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    await advanceUntilState(container, "pronto");
    // Aguarda o FIRE_DELAY_MS do disparo da camada 0
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(container.querySelector('[data-layer="0"]')?.classList.contains("is-fire")).toBe(true);
  });
});
