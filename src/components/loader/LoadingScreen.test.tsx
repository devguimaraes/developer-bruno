import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GIRO_MOMENT_EVENT } from "@/components/brand/giro-states";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
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

function mockFonts(load: () => Promise<unknown[]>) {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { load, ready: Promise.resolve() },
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
  setInnerWidth(1440);
  vi.mocked(useReducedMotion).mockReturnValue(false);
  vi.mocked(waitForFirstPaint).mockResolvedValue(undefined);
  mockFonts(() => Promise.resolve([{}]));
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

  it("mostra na primeira visita e grava a marca da sessão", async () => {
    render(<LoadingScreen />);
    await advance(0);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(sessionStorage.getItem(LOADED_KEY)).toBe("1");
    expect(document.documentElement.getAttribute("data-loader")).toBe("mounted");
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("play");
  });

  it("ancora o disco no centro do Giro antes dos 1500 ms", async () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      if (this.classList.contains("g-loader__fly")) return rect(400, 280, 80);
      if (this.classList.contains("g-loader__layers")) return rect(0, 0, 1440);
      return rect(0, 0, 0);
    });

    render(<LoadingScreen />);
    await advance(0);
    const layers = document.querySelector(".g-loader__layers");
    if (!(layers instanceof HTMLElement)) throw new Error("layers missing");
    expect(layers.style.getPropertyValue("--g-ox")).toBe("");
    await advance(1229);
    expect(layers.style.getPropertyValue("--g-ox")).toBe("");
    await advance(1);
    expect(layers.style.getPropertyValue("--g-ox")).toBe("440px");
    expect(layers.style.getPropertyValue("--g-oy")).toBe("320px");
  });

  it("o cursor dá um passo por caractere da linha", async () => {
    render(<LoadingScreen />);
    await advance(0);
    const line = t("pt", "loader.line1");
    const cursor = document.querySelector(".g-loader__cur");
    expect(cursor).toBeInstanceOf(HTMLElement);
    expect((cursor as HTMLElement).style.animationTimingFunction).toBe(
      `steps(${line.length}, end), linear`
    );
  });

  it("sorri aos 4045 ms e sai aos 4645 ms quando a página já está pronta", async () => {
    render(<LoadingScreen />);
    await advance(0);
    await advance(4044);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    await advance(1);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    await advance(599);
    expect(screen.getByRole("status")).toBeTruthy();
    await advance(1);
    expect(screen.getByRole("status").getAttribute("data-exit")).toBe("1");
  });

  it("segue girando depois de 4045 ms se a página ainda não pintou", async () => {
    let release = () => {};
    vi.mocked(waitForFirstPaint).mockReturnValue(
      new Promise(resolve => {
        release = resolve;
      })
    );
    render(<LoadingScreen />);
    await advance(0);
    await advance(5000);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    expect(screen.getByRole("status")).toBeTruthy();

    await act(async () => {
      release();
    });
    await advance(599);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    await advance(1);
    expect(screen.getByRole("status").getAttribute("data-exit")).toBe("1");
  });

  it("sem assinatura na página, o Giro sorri e a tela só some com o fade", async () => {
    render(<LoadingScreen />);
    await advance(0);
    await advance(4045);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    await advance(600);
    expect(screen.getByRole("status")).toBeTruthy();
    await advance(360);
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.documentElement.hasAttribute("data-loader")).toBe(false);
  });

  it("no computador, a assinatura voa até o o do header e acena no pouso", async () => {
    const wrapper = addFlightTarget(
      '<header data-site-header><span class="g-signature__o"><svg class="g-giro"></svg></span></header>'
    );
    const moments: unknown[] = [];
    wrapper
      .querySelector(".g-giro")
      ?.addEventListener(GIRO_MOMENT_EVENT, event => moments.push((event as CustomEvent).detail));
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      return this.closest("[data-site-header]") ? rect(100, 20, 20) : rect(500, 300, 168);
    });

    render(<LoadingScreen />);
    await advance(0);
    await advance(4045);
    await advance(600);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    expect(moments).toEqual([]);

    await advance(780);
    expect(overlaySvg()?.classList.contains("g-giro--signature")).toBe(true);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    expect(overlaySvg()?.getAttribute("data-moment")).toBe("hello");
    expect(moments).toEqual(["hello"]);

    await advance(360);
    expect(screen.queryByRole("status")).toBeNull();
    wrapper.remove();
  });

  it("na home, com o hero, ninguém acena", async () => {
    const wrapper = addFlightTarget(
      '<header data-site-header><span class="g-signature__o"><svg class="g-giro"></svg></span></header><div class="hr-giro"></div>'
    );
    const moments: unknown[] = [];
    wrapper
      .querySelector(".g-giro")
      ?.addEventListener(GIRO_MOMENT_EVENT, event => moments.push((event as CustomEvent).detail));
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      return this.closest("[data-site-header]") ? rect(100, 20, 20) : rect(500, 300, 168);
    });

    render(<LoadingScreen />);
    await advance(0);
    await advance(4045);
    await advance(600);
    await advance(780);
    expect(overlaySvg()?.classList.contains("g-giro--signature")).toBe(true);
    expect(overlaySvg()?.hasAttribute("data-moment")).toBe(false);
    expect(moments).toEqual([]);
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
    await advance(0);
    await advance(4045);
    await advance(600);
    await advance(780);
    expect(overlaySvg()?.classList.contains("g-giro--signature")).toBe(true);
    expect(overlaySvg()?.getAttribute("data-moment")).toBe("hello");
    wrapper.remove();
  });

  it("uma tecla durante a coreografia adianta a saída", async () => {
    render(<LoadingScreen />);
    await advance(0);
    await advance(100);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(overlaySvg()?.getAttribute("data-state")).toBe("done");
    expect(screen.getByRole("status").getAttribute("data-exit")).toBe("1");
    await advance(360);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("enquanto a Anybody não carrega, o Giro gira e uma tecla ainda adianta a saída", async () => {
    let release: (faces: unknown[]) => void = () => {};
    mockFonts(
      () =>
        new Promise(resolve => {
          release = resolve;
        })
    );
    render(<LoadingScreen />);
    await advance(3000);
    expect(overlaySvg()?.getAttribute("data-state")).toBe("loading");
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("wait");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("status").getAttribute("data-exit")).toBe("1");
    await act(async () => {
      release([{}]);
    });
    await advance(3000);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("anuncia a tela para leitores de tela e esconde o nome e as linhas", async () => {
    render(<LoadingScreen />);
    await advance(0);
    const label = screen.getByText("Carregando o site");
    expect(label.classList.contains("g-sr")).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("Carregando o site");
    const stage = document.querySelector(".g-loader__stage");
    const text = stage?.textContent?.replaceAll("\u00a0", " ") ?? "";
    expect(stage?.getAttribute("aria-hidden")).toBe("true");
    expect(text).toContain("// desenvolvedor front-end");
    expect(text).toContain("brun");
    expect(text).toContain("guimarães");
  });

  it("sessionStorage que lança erro não quebra e não mostra a tela", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage bloqueado");
    });
    render(<LoadingScreen />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.documentElement.hasAttribute("data-loader")).toBe(false);
  });

  it("não começa a coreografia se o sistema pede movimento reduzido antes do hook", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<LoadingScreen />);
    await advance(0);
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("still");
    await advance(2000);
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("still");
  });

  it("uma tecla com movimento reduzido adianta o fade, sem voo", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<LoadingScreen />);
    await advance(0);
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("still");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("still");
    expect(screen.getByRole("status").hasAttribute("data-exit")).toBe(false);
    expect(overlaySvg()?.hasAttribute("data-state")).toBe(false);

    await advance(359);
    expect(screen.getByRole("status")).toBeTruthy();
    await advance(1);
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.documentElement.hasAttribute("data-loader")).toBe(false);
  });

  it("com movimento reduzido, fica parado 600 ms e só faz o fade", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<LoadingScreen />);
    await advance(0);
    expect(screen.getByRole("status").getAttribute("data-run")).toBe("still");
    await advance(599);
    expect(overlaySvg()?.hasAttribute("data-state")).toBe(false);
    expect(screen.getByRole("status")).toBeTruthy();
    await advance(1);
    expect(screen.getByRole("status")).toBeTruthy();
    await advance(360);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("com movimento reduzido, espera a página e não espera a fonte", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    let release = () => {};
    vi.mocked(waitForFirstPaint).mockReturnValue(
      new Promise(resolve => {
        release = resolve;
      })
    );
    mockFonts(() => new Promise(() => {}));
    render(<LoadingScreen />);
    await advance(2000);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(overlaySvg()?.hasAttribute("data-state")).toBe(false);

    await act(async () => {
      release();
    });
    await advance(360);
    expect(screen.queryByRole("status")).toBeNull();
  });
});
