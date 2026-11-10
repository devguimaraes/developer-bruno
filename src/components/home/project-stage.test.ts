import { describe, expect, it } from "vitest";
import { calcProjectStep } from "./project-stage";

// Linha do tempo da prancha com cinco janelas: t0 1.2, passo 1.4, virada em 8.2, total 12.2.
const TOTAL = 12.2;
const at = (t: number) => calcProjectStep(t / TOTAL, 5);

describe("calcProjectStep", () => {
  it("começa no ponto do título, parado", () => {
    expect(at(0)).toMatchObject({ k: "t", stop: "pj-dot", state: "idle" });
    expect(at(1.5)).toMatchObject({ k: "t", stop: "pj-dot" });
  });

  it("pousa na vaga de cada janela carregando e marca pronto 820 ms depois", () => {
    expect(at(1.6)).toEqual({
      k: "pj0",
      stop: "pj0",
      state: "loading",
      after: [[820, "done"]],
    });
    expect(at(3.0).stop).toBe("pj1");
    expect(at(7.4).stop).toBe("pj4");
  });

  it("depois da virada vai para os números e, no fim, para a saída", () => {
    expect(at(9.5)).toMatchObject({ k: "o", stop: "pj-out", state: "done" });
    expect(at(11.2)).toMatchObject({ k: "x", stop: "pj-exit", state: "curious" });
    expect(at(TOTAL)).toMatchObject({ k: "x" });
  });

  it("entre a última janela e a virada fica na última vaga", () => {
    expect(at(8.6).stop).toBe("pj4");
    expect(at(9.0).stop).toBe("pj4");
  });

  it("prende o progresso fora de 0 a 1", () => {
    expect(calcProjectStep(-1, 5).k).toBe("t");
    expect(calcProjectStep(2, 5).k).toBe("x");
    expect(calcProjectStep(Number.NaN, 5).k).toBe("t");
  });
});
