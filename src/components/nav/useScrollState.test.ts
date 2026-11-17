import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestGiroMoment } from "./giro-director";
import { useScrollState } from "./useScrollState";

vi.mock("./giro-director", () => ({
  requestGiroMoment: vi.fn(),
}));

// Os quadros são disparados à mão: assim dá para controlar quanto a página andou em cada um.
let onFrame: () => void = () => {};
vi.mock("./scroll", async importOriginal => {
  const actual = await importOriginal<typeof import("./scroll")>();
  return {
    ...actual,
    subscribeFrames: (callback: () => void) => {
      onFrame = callback;
      return () => {};
    },
  };
});

// Lista estável, como SECTION_IDS: uma nova a cada render reinscreveria o efeito.
const NO_SECTIONS: readonly string[] = [];
let now = 0;
let scrollY = 0;

/** Rola 100 px por quadro, um quadro a cada 50 ms, durante `ms`. */
function scrollFast(ms: number) {
  for (let t = 0; t <= ms; t += 50) {
    now += 50;
    scrollY += 100;
    act(() => onFrame());
  }
}

/** Avança relógio e timers juntos. */
function wait(ms: number) {
  now += ms;
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("useScrollState — tonto", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    now = 0;
    scrollY = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.mocked(requestGiroMoment).mockClear();
    Reflect.deleteProperty(window, "scrollY");
  });

  it("rolagem rápida por mais de 700 ms pede o tonto quando para", () => {
    const { result } = renderHook(() => useScrollState(NO_SECTIONS));
    scrollFast(900);
    expect(result.current.fast).toBe(true);
    expect(requestGiroMoment).not.toHaveBeenCalled();

    wait(350);
    expect(result.current.fast).toBe(false);
    expect(requestGiroMoment).toHaveBeenCalledTimes(1);
    expect(requestGiroMoment).toHaveBeenCalledWith("dizzy");
  });

  it("um gesto rápido e curto não pede o tonto", () => {
    const { result } = renderHook(() => useScrollState(NO_SECTIONS));
    scrollFast(300);
    wait(350);
    expect(result.current.fast).toBe(false);
    expect(requestGiroMoment).not.toHaveBeenCalled();
  });

  it("rolagem lenta não pede o tonto, mesmo longa", () => {
    const { result } = renderHook(() => useScrollState(NO_SECTIONS));
    for (let t = 0; t <= 2000; t += 50) {
      now += 50;
      scrollY += 20;
      act(() => onFrame());
    }
    wait(350);
    expect(result.current.fast).toBe(false);
    expect(requestGiroMoment).not.toHaveBeenCalled();
  });
});
