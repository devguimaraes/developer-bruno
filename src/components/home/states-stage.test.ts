import { afterEach, describe, expect, it } from "vitest";
import {
  calcOpeningStep,
  calcScreenBeatTime,
  calcStatesBeat,
  calcStatesScript,
  clearDemoOverride,
  demoPress,
  getDemoOverride,
  HAND_AT,
  SCREEN_BEAT,
  SCREEN_FROM,
  setDemoOverride,
  setScreenBusy,
} from "./states-stage";

// Linha do tempo de 10 unidades: a pilha fecha até 2,2, as quatro batidas vão de 2,25 a 9.
const at = (t: number) => t / 10;

afterEach(() => clearDemoOverride());

describe("calcStatesBeat", () => {
  it("troca de batida a cada 1,6875 unidade, de 2,25 a 9", () => {
    expect(calcStatesBeat(at(2.25))).toBe(0);
    expect(calcStatesBeat(at(3.9))).toBe(0);
    expect(calcStatesBeat(at(3.95))).toBe(1);
    expect(calcStatesBeat(at(5.6))).toBe(1);
    expect(calcStatesBeat(at(5.7))).toBe(2);
    expect(calcStatesBeat(at(7.3))).toBe(2);
    expect(calcStatesBeat(at(7.4))).toBe(3);
    expect(calcStatesBeat(at(9))).toBe(3);
  });

  it("prende a batida em 0 a 3 fora da faixa e com NaN", () => {
    expect(calcStatesBeat(0)).toBe(0);
    expect(calcStatesBeat(1)).toBe(3);
    expect(calcStatesBeat(Number.NaN)).toBe(0);
  });
});

describe("calcStatesScript", () => {
  it("antes de 2,25 a tela de exemplo fica vazia", () => {
    expect(calcStatesScript(at(0))).toBe("empty");
    expect(calcStatesScript(at(2.2))).toBe("empty");
  });

  it("depois segue vazio, carregando, erro e pronto", () => {
    expect(calcStatesScript(at(3))).toBe("empty");
    expect(calcStatesScript(at(4.5))).toBe("loading");
    expect(calcStatesScript(at(6))).toBe("error");
    expect(calcStatesScript(at(8))).toBe("done");
  });
});

describe("calcOpeningStep", () => {
  it("antes da passagem de mão o Giro fica escondido na estação da hero", () => {
    expect(calcOpeningStep(0)).toEqual({ k: "hand", stop: "hero", state: "done", hidden: true });
    expect(calcOpeningStep(at(HAND_AT - 0.01)).hidden).toBe(true);
  });

  it("logo depois a pilha começa a fechar: aparece na estação, feliz e depois curioso", () => {
    expect(calcOpeningStep(at(HAND_AT))).toEqual({ k: "rest", stop: "hero", state: "done" });
    expect(calcOpeningStep(at(1.5))).toEqual({ k: "rest", stop: "hero", state: "curious" });
  });

  it("de 2,25 a 9 o Giro é o estado: no centro da tela, e sobre a página azul em pronto", () => {
    expect(calcOpeningStep(at(3))).toEqual({ k: "b0", stop: "card", state: "empty" });
    expect(calcOpeningStep(at(4.5))).toEqual({ k: "b1", stop: "card", state: "loading" });
    expect(calcOpeningStep(at(6))).toEqual({ k: "b2", stop: "card", state: "error" });
    expect(calcOpeningStep(at(8))).toEqual({ k: "b3", stop: "card-done", state: "done" });
  });

  it("em 9 salta para a saída", () => {
    expect(calcOpeningStep(at(9))).toEqual({ k: "exit", stop: "exit", state: "curious" });
    expect(calcOpeningStep(1)).toEqual({ k: "exit", stop: "exit", state: "curious" });
  });

  it("o estado pedido pelo visitante manda na tela, mas não na saída nem na hero", () => {
    setDemoOverride("error");
    expect(calcOpeningStep(at(3))).toEqual({ k: "over-error", stop: "card", state: "error" });
    setDemoOverride("done");
    expect(calcOpeningStep(at(3))).toEqual({ k: "over-done", stop: "card-done", state: "done" });
    expect(calcOpeningStep(at(9.5)).stop).toBe("exit");
    expect(calcOpeningStep(at(1)).stop).toBe("hero");
  });
});

describe("demoPress", () => {
  it("publicar no vazio carrega e, em 1500 ms, dá erro", () => {
    expect(demoPress("empty")).toEqual({ next: "loading", later: { ms: 1500, state: "error" } });
  });

  it("tentar de novo carrega e, em 1200 ms, fica pronto", () => {
    expect(demoPress("error")).toEqual({ next: "loading", later: { ms: 1200, state: "done" } });
  });

  it("publicar de novo, em pronto, volta ao vazio", () => {
    expect(demoPress("done")).toEqual({ next: "empty" });
  });

  it("apertar enquanto carrega não faz nada", () => {
    expect(demoPress("loading")).toBeNull();
  });
});

describe("override da tela de exemplo", () => {
  it("guarda, lê e limpa", () => {
    expect(getDemoOverride()).toBeNull();
    setDemoOverride("loading");
    expect(getDemoOverride()).toBe("loading");
    clearDemoOverride();
    expect(getDemoOverride()).toBeNull();
  });
});

describe("batida da tela", () => {
  afterEach(() => setScreenBusy(false));

  it("antes de SCREEN_FROM a pilha fica aberta; depois, a cena vai até a tela montada", () => {
    expect(calcScreenBeatTime(0)).toBe(0);
    expect(calcScreenBeatTime(at(SCREEN_FROM - 0.01))).toBe(0);
    expect(calcScreenBeatTime(at(SCREEN_FROM))).toBe(SCREEN_BEAT);
    expect(calcScreenBeatTime(1)).toBe(SCREEN_BEAT);
  });

  it("enquanto a cena não voltou ao começo, o Giro da história não devolve a mão ao da hero", () => {
    setScreenBusy(true);
    expect(calcOpeningStep(0).hidden).toBeUndefined();
    expect(calcOpeningStep(0)).toMatchObject({ k: "rest", stop: "hero" });
    setScreenBusy(false);
    expect(calcOpeningStep(0).hidden).toBe(true);
  });
});
