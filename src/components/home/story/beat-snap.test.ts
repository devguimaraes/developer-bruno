import { describe, expect, it } from "vitest";
import { isBeatSnapActive } from "./beat-snap";

describe("isBeatSnapActive", () => {
  it("liga com o topo do capítulo no topo da tela e enquanto o fim dele não saiu por cima", () => {
    expect(isBeatSnapActive(0, 6000)).toBe(true);
    expect(isBeatSnapActive(-3000, 800)).toBe(true);
    expect(isBeatSnapActive(-5200, 2)).toBe(true);
  });

  it("desliga antes do capítulo, para sair por cima, e depois que ele termina", () => {
    expect(isBeatSnapActive(400, 6400)).toBe(false);
    expect(isBeatSnapActive(2, 6002)).toBe(false);
    expect(isBeatSnapActive(-6000, 0)).toBe(false);
  });
});
