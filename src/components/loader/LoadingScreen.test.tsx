import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LoadingScreen } from "./LoadingScreen";
import { LOADED_KEY } from "./loader-flag";
import { waitForFirstPaint } from "./ready";

vi.mock("./ready", () => ({ waitForFirstPaint: vi.fn() }));
vi.mock("@/hooks/useReducedMotion", () => ({ useReducedMotion: vi.fn() }));

function setInnerWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: width });
}

function rect(left: number, top: number, width: number): DOMRect {
  return { left, top, width, height: width, right: left + width, bottom: top + width } as DOMRect;
}

/** Põe um alvo da assinatura (ou da barra de abas) na página, para o voo ter onde pousar. */
function addFlightTarget(html: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.append(wrapper);
  return wrapper;
}

/** Avança o relógio falso e deixa o React processar as atualizações. */
async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

function overlaySvg(): SVGElement | null {
  return screen.queryByRole("status")?.querySelector("svg") ?? null;
}

beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
  setInnerWidth(1440);
  vi.mocked(useReducedMotion).mockReturnValue(false);
  vi.mocked(waitForFirstPaint).mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute("data-loader");
  document.body.innerHTML = "";
});

describe("LoadingScreen", () => {
  it("não mostra a tela quando a sessão já tem a marca", () => {
    sessionStorage.setItem(LOADED_KEY, "1");
    render(<LoadingScreen />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.documentElement.hasAttribute("data-loader")).toBe(false);
  });

  it("mostra na primeira visita e grava a marca da sessão", () => {
    render(<LoadingScreen />);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(sessionStorage.getItem(LOADED_KEY)).toBe("1");
    expect(document.documentElement.getAttribute("data-loader")).toBe("mounted");
  });

  it("termina no mínimo de 600 ms, mesmo com a página pronta antes", async () => {
    render(<LoadingScreen />);
    await advance(599);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    await advance(1);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
  });

  it("termina no máximo de 1500 ms se as fontes não ficarem prontas", async () => {
    vi.mocked(waitForFirstPaint).mockReturnValue(new Promise(() => {}));
    render(<LoadingScreen />);
    await advance(1499);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    await advance(1);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
  });

  it("sem assinatura na página, o Giro sorri e a tela só some com o fade", async () => {
    render(<LoadingScreen />);
    await advance(600);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    await advance(400);
    expect(screen.getByRole("status")).toBeTruthy();
    await advance(240);
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.documentElement.hasAttribute("data-loader")).toBe(false);
  });

  it("no computador, o Giro voa até o o da assinatura, pousa e só então some", async () => {
    const wrapper = addFlightTarget(
      '<header data-site-header><span class="g-signature__o"><svg class="g-giro"></svg></span></header>'
    );
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      return this.closest("[data-site-header]") ? rect(100, 20, 20) : rect(500, 300, 168);
    });

    render(<LoadingScreen />);
    await advance(600);
    await advance(400);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    expect(screen.getByRole("status")).toBeTruthy();

    await advance(520);
    expect(overlaySvg()?.classList.contains("g-giro--signature")).toBe(true);
    expect(overlaySvg()?.getAttribute("data-state")).toBeNull();

    await advance(240);
    expect(screen.queryByRole("status")).toBeNull();
    wrapper.remove();
  });

  it("no celular, o alvo é o centro da barra de abas", async () => {
    setInnerWidth(390);
    const wrapper = addFlightTarget('<div class="g-tabbar__giro"><svg class="g-giro"></svg></div>');
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      return this.closest(".g-tabbar__giro") ? rect(175, 762, 40) : rect(125, 310, 140);
    });

    render(<LoadingScreen />);
    // Um passo por fase: o React só aplica o efeito de cada fase depois do act.
    await advance(600);
    await advance(400);
    await advance(520);
    expect(overlaySvg()?.classList.contains("g-giro--signature")).toBe(true);
    wrapper.remove();
  });

  it("anuncia a tela para leitores de tela, com texto oculto visualmente", () => {
    render(<LoadingScreen />);
    const label = screen.getByText("Carregando o site");
    expect(label.classList.contains("g-sr")).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("Carregando o site");
  });

  it("sessionStorage que lança erro não quebra e não mostra a tela", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage bloqueado");
    });
    render(<LoadingScreen />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.documentElement.hasAttribute("data-loader")).toBe(false);
  });

  it("com movimento reduzido, não chega ao estado pronto e só faz o fade", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<LoadingScreen />);
    await advance(600);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    await advance(240);
    expect(screen.queryByRole("status")).toBeNull();
  });
});
