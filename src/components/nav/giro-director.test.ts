import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  decideMoment,
  requestGiroMoment,
  resetGiroDirector,
  useDirectedMoment,
} from "./giro-director";
import type { DirectedMoment, DirectorState } from "./giro-director";

// Estados prontos: um wink pedido em 0 e um tonto pedido em 0.
const WINK_AT_0: DirectorState = { moment: "wink", playingUntil: 1720, blockedUntil: 7720 };
const DIZZY_AT_0: DirectorState = { moment: "dizzy", playingUntil: 1400, blockedUntil: 7400 };

describe("decideMoment", () => {
  it("aceita no ocioso", () => {
    expect(decideMoment({ moment: null, playingUntil: 0, blockedUntil: 0 }, "wink", 1000)).toEqual({
      moment: "wink",
      playingUntil: 2720,
      blockedUntil: 8720,
    });
  });

  it("descarta dentro do intervalo mínimo, sem fila", () => {
    expect(decideMoment(WINK_AT_0, "wink", 3000)).toBeNull();
    expect(decideMoment(WINK_AT_0, "hello", 3000)).toBeNull();
  });

  it("aceita depois de playingUntil + 6000", () => {
    expect(decideMoment(WINK_AT_0, "wink", 7719)).toBeNull();
    expect(decideMoment(WINK_AT_0, "wink", 7720)).toEqual({
      moment: "wink",
      playingUntil: 9440,
      blockedUntil: 15440,
    });
  });

  it("dizzy interrompe wink", () => {
    expect(decideMoment(WINK_AT_0, "dizzy", 500)).toEqual({
      moment: "dizzy",
      playingUntil: 1900,
      blockedUntil: 7900,
    });
  });

  it("hello interrompe wink", () => {
    expect(decideMoment(WINK_AT_0, "hello", 500)?.moment).toBe("hello");
  });

  it("wink não interrompe dizzy", () => {
    expect(decideMoment(DIZZY_AT_0, "wink", 500)).toBeNull();
  });

  it("hello não interrompe dizzy", () => {
    expect(decideMoment(DIZZY_AT_0, "hello", 500)).toBeNull();
  });

  it("wink não interrompe outro wink", () => {
    expect(decideMoment(WINK_AT_0, "wink", 500)).toBeNull();
  });
});

describe("requestGiroMoment", () => {
  let now = 0;

  /** Pede um momento dentro de act, para o hook ver a troca. */
  function request(moment: DirectedMoment): boolean {
    let accepted = false;
    act(() => {
      accepted = requestGiroMoment(moment);
    });
    return accepted;
  }

  /** Avança relógio e timers juntos. */
  function advance(ms: number) {
    now += ms;
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  }

  beforeEach(() => {
    vi.useFakeTimers();
    now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    resetGiroDirector();
  });

  afterEach(() => {
    act(() => {
      resetGiroDirector();
    });
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("publica o momento e limpa no fim da animação", () => {
    const { result } = renderHook(() => useDirectedMoment());
    expect(result.current).toBeUndefined();

    expect(request("wink")).toBe(true);
    expect(result.current).toBe("wink");

    advance(1719);
    expect(result.current).toBe("wink");
    advance(1);
    expect(result.current).toBeUndefined();
  });

  it("dizzy interrompe o wink e cancela o fim do wink", () => {
    const { result } = renderHook(() => useDirectedMoment());
    request("wink");

    advance(500);
    expect(request("dizzy")).toBe(true);
    expect(result.current).toBe("dizzy");

    // O fim do wink (em 1720) não pode apagar o tonto, que dura até 1900.
    advance(1399);
    expect(result.current).toBe("dizzy");
    advance(1);
    expect(result.current).toBeUndefined();
  });

  it("com movimento reduzido, nada é publicado", () => {
    const { result } = renderHook(() => useDirectedMoment());
    vi.mocked(window.matchMedia).mockReturnValueOnce({ matches: true } as MediaQueryList);

    expect(request("wink")).toBe(false);
    expect(result.current).toBeUndefined();
  });

  it("clique num elemento com data-giro-wink pede wink", () => {
    const { result } = renderHook(() => useDirectedMoment());
    const button = document.createElement("button");
    button.setAttribute("data-giro-wink", "");
    const label = document.createElement("span");
    button.append(label);
    document.body.append(button);

    act(() => {
      label.click();
    });
    expect(result.current).toBe("wink");
  });

  it("clique fora de data-giro-wink não pede nada", () => {
    const { result } = renderHook(() => useDirectedMoment());
    const block = document.createElement("div");
    document.body.append(block);

    act(() => {
      block.click();
    });
    expect(result.current).toBeUndefined();
  });

  it("copiar texto fora de campo pede wink", () => {
    const { result } = renderHook(() => useDirectedMoment());
    const paragraph = document.createElement("p");
    document.body.append(paragraph);

    act(() => {
      paragraph.dispatchEvent(new Event("copy", { bubbles: true }));
    });
    expect(result.current).toBe("wink");
  });

  it("ao voltar para a aba, o Giro acorda dizendo oi", () => {
    const { result } = renderHook(() => useDirectedMoment());
    const setHidden = (hidden: boolean) => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
      document.dispatchEvent(new Event("visibilitychange"));
    };

    act(() => setHidden(true));
    expect(result.current).toBeUndefined();
    act(() => setHidden(false));
    expect(result.current).toBe("hello");
    Reflect.deleteProperty(document, "hidden");
  });

  it("copiar dentro de input não pede nada", () => {
    const { result } = renderHook(() => useDirectedMoment());
    const input = document.createElement("input");
    document.body.append(input);

    act(() => {
      input.dispatchEvent(new Event("copy", { bubbles: true }));
    });
    expect(result.current).toBeUndefined();
  });
});
