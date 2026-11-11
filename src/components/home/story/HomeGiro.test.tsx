import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as reducedMotionHook from "@/hooks/useReducedMotion";
import { getGiroOnStage, resetGiroOnStageForTesting } from "@/lib/giroOnStage";
import { type Chapter, createChapter } from "./chapters";
import { HomeGiro } from "./HomeGiro";

describe("HomeGiro component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetGiroOnStageForTesting();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
    resetGiroOnStageForTesting();
  });

  it("não renderiza nada e não ativa giroOnStage quando prefers-reduced-motion estiver ativo", () => {
    vi.spyOn(reducedMotionHook, "useReducedMotion").mockReturnValue(true);

    const { container } = render(<HomeGiro />);
    expect(container.firstChild).toBeNull();
    expect(getGiroOnStage()).toBe(false);
  });

  it("ativa giroOnStage ao montar e desativa ao desmontar", () => {
    vi.spyOn(reducedMotionHook, "useReducedMotion").mockReturnValue(false);

    const { unmount } = render(<HomeGiro />);
    expect(getGiroOnStage()).toBe(true);

    unmount();
    expect(getGiroOnStage()).toBe(false);
  });

  it("troca de chave dispara o salto e pouso aplica o estado e classe is-squash", () => {
    vi.spyOn(reducedMotionHook, "useReducedMotion").mockReturnValue(false);

    // Cria as paradas no DOM
    const stop1 = document.createElement("div");
    stop1.dataset.stop = "s1";
    stop1.className = "g-papel";
    stop1.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 50,
      height: 50,
      right: 150,
      bottom: 150,
      x: 100,
      y: 100,
      toJSON: () => {},
    });
    document.body.appendChild(stop1);

    const stop2 = document.createElement("div");
    stop2.dataset.stop = "s2";
    stop2.className = "g-tinta";
    stop2.getBoundingClientRect = () => ({
      left: 300,
      top: 500,
      width: 50,
      height: 50,
      right: 350,
      bottom: 550,
      x: 300,
      y: 500,
      toJSON: () => {},
    });
    document.body.appendChild(stop2);

    let activeKey = "s1";
    const testChapter: Chapter = createChapter({
      id: "ch1",
      label: "Capítulo de Teste",
      top: 0,
      len: 1000,
      surface: "papel",
      at: () => ({
        k: activeKey,
        stop: activeKey,
        state: activeKey === "s1" ? "curious" : "celebrating",
      }),
    });

    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      rafCallback = cb;
      return 123;
    });

    const onLandMock = vi.fn();

    const { container } = render(
      <HomeGiro chapters={[testChapter]} initialStop="s1" onLand={onLandMock} />
    );

    const actor = container.querySelector(".hs-actor");
    const actorIn = container.querySelector(".hs-actor__in");
    expect(actor).not.toBeNull();
    expect(actorIn).not.toBeNull();

    // Estado inicial pousado em s1
    expect(actor?.classList.contains("g-papel")).toBe(true);

    // Simula troca de chave disparada pela rolagem
    activeKey = "s2";

    const t0 = performance.now();

    // Avança um quadro de animação no tempo t0 (início do salto)
    act(() => {
      rafCallback?.(t0);
    });

    // Durante o salto, o Giro assume o estado "idle"
    const svgGiroDuringJump = container.querySelector("svg.g-giro");
    expect(svgGiroDuringJump?.getAttribute("data-state")).toBeNull(); // idle não seta data-state ou seta idle

    // Avança o tempo até completar a duração T do salto (u >= 1)
    act(() => {
      rafCallback?.(t0 + 1500); // 1500ms após, u > 1 (pois T <= 820ms)
    });

    // Ao pousar em s2 (superfície tinta):
    // 1. A classe de superfície muda para g-tinta
    expect(actor?.classList.contains("g-tinta")).toBe(true);
    // 2. O estado muda para o estado da parada (celebrating)
    const svgGiroLanded = container.querySelector("svg.g-giro");
    expect(svgGiroLanded?.getAttribute("data-state")).toBe("celebrating");
    // 3. A classe is-squash é aplicada no pouso
    expect(actorIn?.classList.contains("is-squash")).toBe(true);
    // 4. Callback onLand foi invocado
    expect(onLandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        k: "s2",
        stop: "s2",
        state: "celebrating",
      })
    );
  });

  it("atualiza a escala do ator se data-size da parada mudar a cada quadro", () => {
    vi.spyOn(reducedMotionHook, "useReducedMotion").mockReturnValue(false);

    const stopEl = document.createElement("div");
    stopEl.dataset.stop = "dyn";
    stopEl.dataset.size = "96"; // escala 1.0 (96/96)
    stopEl.className = "g-azul";
    stopEl.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 96,
      height: 96,
      right: 196,
      bottom: 196,
      x: 100,
      y: 100,
      toJSON: () => {},
    });
    document.body.appendChild(stopEl);

    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      rafCallback = cb;
      return 123;
    });

    const testChapter: Chapter = createChapter({
      id: "ch-dyn",
      label: "Capítulo Dinâmico",
      top: 0,
      len: 500,
      surface: "azul",
      at: () => ({
        k: "dyn",
        stop: "dyn",
        state: "done",
      }),
    });

    const { container } = render(<HomeGiro chapters={[testChapter]} initialStop="dyn" />);

    const actor = container.querySelector<HTMLElement>(".hs-actor");
    expect(actor).not.toBeNull();

    // Roda quadros para convergir escala em 1.0
    for (let i = 0; i < 20; i++) {
      act(() => {
        rafCallback?.(100 + i * 16);
      });
    }
    expect(Number(actor?.style.getPropertyValue("--gk"))).toBeCloseTo(1.0, 1);

    // Altera o data-size da parada para 48 (escala 0.5) sem mudar de capítulo
    stopEl.dataset.size = "48";

    // Roda mais quadros para convergir na nova escala
    for (let i = 0; i < 30; i++) {
      act(() => {
        rafCallback?.(500 + i * 16);
      });
    }

    // A escala --gk deve se aproximar de 0.5 (48 / 96)
    expect(Number(actor?.style.getPropertyValue("--gk"))).toBeCloseTo(0.5, 1);
  });
  describe("passagem de mão", () => {
    // A passagem de mão só existe com as cenas ligadas.
    beforeEach(() => document.documentElement.setAttribute("data-scenes", "on"));

    const rectAt = (x: number, y: number) => () => ({
      left: x,
      top: y,
      width: 10,
      height: 10,
      right: x + 10,
      bottom: y + 10,
      x,
      y,
      toJSON: () => {},
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-giro-hand");
      document.documentElement.removeAttribute("data-scenes");
    });

    it("escondido, o Giro não aparece e o hero segue com o rosto; ao liberar, assume e pousa", () => {
      vi.spyOn(reducedMotionHook, "useReducedMotion").mockReturnValue(false);
      const stop = document.createElement("div");
      stop.dataset.stop = "hero";
      stop.className = "g-azul";
      stop.getBoundingClientRect = rectAt(300, 200);
      document.body.appendChild(stop);

      let hidden = true;
      const chapter: Chapter = createChapter({
        id: "hero",
        label: "// início",
        top: 0,
        len: 1000,
        surface: "azul",
        lead: 0,
        at: () =>
          hidden
            ? { k: "hand", stop: "hero", state: "done", hidden: true }
            : { k: "rest", stop: "hero", state: "curious" },
      });
      let raf: FrameRequestCallback | null = null;
      vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
        raf = cb;
        return 1;
      });

      const { container } = render(<HomeGiro chapters={[chapter]} />);
      const actor = container.querySelector<HTMLElement>(".hs-actor");
      const actorIn = container.querySelector(".hs-actor__in");

      expect(actor?.hasAttribute("data-hidden")).toBe(true);
      expect(document.documentElement.hasAttribute("data-giro-hand")).toBe(false);

      hidden = false;
      act(() => {
        raf?.(performance.now());
      });

      expect(actor?.hasAttribute("data-hidden")).toBe(false);
      expect(document.documentElement.getAttribute("data-giro-hand")).toBe("story");
      expect(container.querySelector("svg.g-giro")?.getAttribute("data-state")).toBe("curious");
      expect(actorIn?.classList.contains("is-squash")).toBe(true);
    });

    it("ao desmontar, devolve o rosto ao hero", () => {
      vi.spyOn(reducedMotionHook, "useReducedMotion").mockReturnValue(false);
      const stop = document.createElement("div");
      stop.dataset.stop = "s1";
      stop.className = "g-azul";
      stop.getBoundingClientRect = rectAt(50, 50);
      document.body.appendChild(stop);
      const chapter: Chapter = createChapter({
        id: "ch",
        label: "ch",
        top: 0,
        len: 1000,
        surface: "azul",
        at: () => ({ k: "s1", stop: "s1", state: "done" }),
      });

      const { unmount } = render(<HomeGiro chapters={[chapter]} />);
      expect(document.documentElement.getAttribute("data-giro-hand")).toBe("story");

      unmount();
      expect(document.documentElement.hasAttribute("data-giro-hand")).toBe(false);
    });
  });
});
