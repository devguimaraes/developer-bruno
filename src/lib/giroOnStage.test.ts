import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getGiroOnStage,
  resetGiroOnStageForTesting,
  setGiroOnStage,
  subscribeGiroOnStage,
} from "./giroOnStage";

describe("giroOnStage store", () => {
  afterEach(() => {
    resetGiroOnStageForTesting();
  });

  it("inicia com falso por padrão", () => {
    expect(getGiroOnStage()).toBe(false);
  });

  it("atualiza valor e notifica assinantes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeGiroOnStage(listener);

    setGiroOnStage(true);
    expect(getGiroOnStage()).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);

    setGiroOnStage(false);
    expect(getGiroOnStage()).toBe(false);
    expect(listener).toHaveBeenCalledWith(false);

    unsubscribe();
    setGiroOnStage(true);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("não notifica se o valor for idêntico ao atual", () => {
    const listener = vi.fn();
    subscribeGiroOnStage(listener);

    setGiroOnStage(false); // Já era false
    expect(listener).not.toHaveBeenCalled();

    setGiroOnStage(true);
    expect(listener).toHaveBeenCalledTimes(1);

    setGiroOnStage(true); // Repetição de true
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
