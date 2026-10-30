import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GiroShortcutBuffer } from "./useGiroEggs";
import { EMPTY_GIRO_SHORTCUT, endGiroParty, pushGiroShortcut, useGiroEggs } from "./useGiroEggs";

function setDocumentHidden(hidden: boolean): void {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  });
}

function restoreDocumentHidden(): void {
  Reflect.deleteProperty(document, "hidden");
}

function typeLetters(keys: readonly string[]): void {
  act(() => {
    for (const key of keys) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    }
  });
}

afterEach(() => {
  restoreDocumentHidden();
  document.dispatchEvent(new Event("visibilitychange"));
  endGiroParty();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "x", bubbles: true }));
});

describe("pushGiroShortcut", () => {
  it("dispara ao digitar giro dentro de 1,5s e zera o buffer", () => {
    const times = [0, 400, 800, 1500];
    let buffer = EMPTY_GIRO_SHORTCUT;
    let triggered = false;
    for (const [index, key] of ["g", "i", "r", "o"].entries()) {
      const result = pushGiroShortcut(buffer, key, times[index] ?? 0);
      buffer = result.buffer;
      triggered = result.triggered;
    }
    expect(triggered).toBe(true);
    expect(buffer).toEqual(EMPTY_GIRO_SHORTCUT);
  });

  it("aceita as mesmas letras em maiúsculas", () => {
    let buffer = EMPTY_GIRO_SHORTCUT;
    let triggered = false;
    for (const [index, key] of ["G", "I", "R", "O"].entries()) {
      const result = pushGiroShortcut(buffer, key, index * 200);
      buffer = result.buffer;
      triggered = result.triggered;
    }
    expect(triggered).toBe(true);
    expect(buffer).toEqual(EMPTY_GIRO_SHORTCUT);
  });

  it("zera o buffer quando a lacuna passa de 1,5s", () => {
    const started = pushGiroShortcut(EMPTY_GIRO_SHORTCUT, "g", 0);
    const lateI = pushGiroShortcut(started.buffer, "i", 1501);
    expect(lateI.triggered).toBe(false);
    expect(lateI.buffer.progress).toBe("");

    const lateG = pushGiroShortcut(started.buffer, "g", 1501);
    expect(lateG.triggered).toBe(false);
    expect(lateG.buffer).toEqual({ progress: "g", startedAt: 1501 });
  });

  it("ignora a sequência em input, textarea, select ou contenteditable", () => {
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    const nested = document.createElement("span");
    editable.append(nested);
    const targets: EventTarget[] = [
      document.createElement("input"),
      document.createElement("textarea"),
      document.createElement("select"),
      editable,
      nested,
    ];

    for (const target of targets) {
      const mid: GiroShortcutBuffer = { progress: "gi", startedAt: 0 };
      const ignored = pushGiroShortcut(mid, "r", 200, target);
      expect(ignored.triggered).toBe(false);
      expect(ignored.buffer).toBe(mid);

      let buffer = EMPTY_GIRO_SHORTCUT;
      let triggered = false;
      for (const [index, key] of ["g", "i", "r", "o"].entries()) {
        const result = pushGiroShortcut(buffer, key, index * 100, target);
        buffer = result.buffer;
        triggered = result.triggered;
      }
      expect(triggered).toBe(false);
      expect(buffer).toEqual(EMPTY_GIRO_SHORTCUT);
    }
  });
});

describe("useGiroEggs", () => {
  it("dorme com a aba escondida e acorda quando ela volta", () => {
    setDocumentHidden(true);
    const { result } = renderHook(() => useGiroEggs());
    expect(result.current.asleep).toBe(true);
    expect(result.current.celebrating).toBe(false);

    setDocumentHidden(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(result.current.asleep).toBe(false);
  });

  it("não reporta sono nem festa com movimento reduzido", () => {
    const matchMedia = vi.mocked(window.matchMedia);
    const original = matchMedia.getMockImplementation();
    matchMedia.mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    setDocumentHidden(true);

    try {
      const { result } = renderHook(() => useGiroEggs());
      typeLetters(["g", "i", "r", "o"]);
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(result.current.asleep).toBe(false);
      expect(result.current.celebrating).toBe(false);
    } finally {
      setDocumentHidden(false);
      if (original) matchMedia.mockImplementation(original);
    }
  });

  it("encerra a festa em 2,4s se a animação não avisar", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const { result } = renderHook(() => useGiroEggs());
      typeLetters(["g", "i", "r", "o"]);
      expect(result.current.celebrating).toBe(true);
      act(() => {
        vi.advanceTimersByTime(2399);
      });
      expect(result.current.celebrating).toBe(true);
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.celebrating).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("cochilo do Giro", () => {
  // Estado do módulo (cochilo, timer, listeners) zera a cada teste com import novo.
  async function loadGiroModules() {
    vi.resetModules();
    const testing = await import("@testing-library/react");
    const eggs = await import("./useGiroEggs");
    return { ...testing, ...eggs };
  }

  let giro: Awaited<ReturnType<typeof loadGiroModules>>;

  function advance(ms: number): void {
    giro.act(() => {
      vi.advanceTimersByTime(ms);
    });
  }

  function dispatchActivity(type: string): void {
    giro.act(() => {
      document.dispatchEvent(new Event(type));
    });
  }

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
    giro = await loadGiroModules();
  });

  afterEach(() => {
    giro.cleanup();
    vi.useRealTimers();
  });

  it("cochila depois de 60 s sem atividade", () => {
    const { result } = giro.renderHook(() => giro.useGiroEggs());
    expect(result.current.asleep).toBe(false);

    advance(59_999);
    expect(result.current.asleep).toBe(false);
    advance(1);
    expect(result.current.asleep).toBe(true);
    expect(result.current.celebrating).toBe(false);
  });

  it("pointermove aos 59 s adia o cochilo em mais 60 s", () => {
    const { result } = giro.renderHook(() => giro.useGiroEggs());

    advance(59_000);
    dispatchActivity("pointermove");
    advance(59_999);
    expect(result.current.asleep).toBe(false);
    advance(1);
    expect(result.current.asleep).toBe(true);
  });

  it("atividade durante o cochilo acorda, chama o listener uma vez e cochila de novo", () => {
    const wake = vi.fn();
    const stop = giro.onGiroWake(wake);
    const { result } = giro.renderHook(() => giro.useGiroEggs());

    advance(60_000);
    expect(result.current.asleep).toBe(true);
    expect(wake).not.toHaveBeenCalled();

    dispatchActivity("pointerdown");
    expect(result.current.asleep).toBe(false);
    expect(wake).toHaveBeenCalledTimes(1);

    dispatchActivity("pointermove");
    expect(wake).toHaveBeenCalledTimes(1);

    advance(60_000);
    expect(result.current.asleep).toBe(true);
    expect(wake).toHaveBeenCalledTimes(1);
    stop();
  });

  it("voltar da aba zera o cochilo, conta como atividade e chama o listener", () => {
    const wake = vi.fn();
    const stop = giro.onGiroWake(wake);
    setDocumentHidden(true);
    const { result } = giro.renderHook(() => giro.useGiroEggs());
    expect(result.current.asleep).toBe(true);

    advance(30_000);
    setDocumentHidden(false);
    dispatchActivity("visibilitychange");
    expect(result.current.asleep).toBe(false);
    expect(wake).toHaveBeenCalledTimes(1);

    // Atividade conta a partir da volta (30 s), então o cochilo cai em 90 s.
    advance(59_999);
    expect(result.current.asleep).toBe(false);
    advance(1);
    expect(result.current.asleep).toBe(true);
    stop();
  });

  it("com movimento reduzido não cochila, e o cochilo não sobra para depois", () => {
    const matchMedia = vi.mocked(window.matchMedia);
    const original = matchMedia.getMockImplementation();
    const setReducedMotion = (reduced: boolean) =>
      matchMedia.mockImplementation((query: string) => ({
        matches: reduced && query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

    try {
      setReducedMotion(true);
      const reduced = giro.renderHook(() => giro.useGiroEggs());
      advance(130_000);

      // O movimento reduzido sai fora do ritmo das conferências (60 s, 120 s, 180 s).
      setReducedMotion(false);
      reduced.unmount();
      const { result } = giro.renderHook(() => giro.useGiroEggs());
      expect(result.current.asleep).toBe(false);
      // O tempo parado com movimento reduzido não conta: são 60 s novos até cochilar.
      advance(59_000);
      expect(result.current.asleep).toBe(false);
      advance(1_000);
      expect(result.current.asleep).toBe(true);
    } finally {
      if (original) matchMedia.mockImplementation(original);
    }
  });
});
