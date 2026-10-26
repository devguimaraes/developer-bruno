import { describe, expect, it } from "vitest";
import { bareLabel, splitOutcome } from "./copy";

describe("bareLabel", () => {
  it("tira a barra do rótulo de seção", () => {
    expect(bareLabel("// projetos")).toBe("projetos");
    expect(bareLabel("// case · hub")).toBe("case · hub");
  });

  it("devolve o texto igual quando não há barra", () => {
    expect(bareLabel("processo")).toBe("processo");
  });
});

describe("splitOutcome", () => {
  it("separa número, o que mede e a fonte", () => {
    const summary =
      "−30% na taxa de rejeição depois do redesign · WordPress · acessibilidade e performance";
    expect(splitOutcome(summary)).toEqual({
      value: "−30%",
      label: "na taxa de rejeição depois do redesign",
      source: "WordPress · acessibilidade e performance",
    });
  });

  it("lê números com sufixo x em inglês", () => {
    const summary = "3x faster to load than the previous site · WordPress · WebP gallery";
    expect(splitOutcome(summary)).toEqual({
      value: "3x",
      label: "faster to load than the previous site",
      source: "WordPress · WebP gallery",
    });
  });

  it("sem texto depois do número, o bloco vira só valor", () => {
    expect(splitOutcome("40%")).toEqual({ value: "40%", label: "", source: "" });
  });
});
