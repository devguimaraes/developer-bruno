import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Giro } from "./Giro";
import { GIRO_STATES, type GiroState } from "./giro-states";

function getSvg(props: Parameters<typeof Giro>[0] = {}) {
  const { container } = render(<Giro {...props} />);
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("Giro não renderizou um svg");
  return svg;
}

describe("Giro — estados", () => {
  it.each(
    GIRO_STATES.filter(state => state !== "idle")
  )("estado %s gera data-state com o mesmo nome", (state: GiroState) => {
    expect(getSvg({ state }).getAttribute("data-state")).toBe(state);
  });

  it("idle não tem data-state (o CSS trata o repouso pela ausência do atributo)", () => {
    expect(getSvg({ state: "idle" }).hasAttribute("data-state")).toBe(false);
    expect(getSvg().hasAttribute("data-state")).toBe(false);
  });

  it("cobre os dez estados do glossário", () => {
    expect(GIRO_STATES).toHaveLength(10);
  });
});

describe("Giro — progresso", () => {
  it("50 gera data-progress e --g-dash com metade visível e metade do resto", () => {
    // Circunferência 277: 50% visível = 138.5, resto = 277 - 138.5 = 138.5.
    // Os dois somam a circunferência, então o padrão de traço fecha o círculo.
    const svg = getSvg({ progress: 50 });
    expect(svg.getAttribute("data-progress")).toBe("50");
    expect(svg.getAttribute("style")).toContain("--g-dash: 138.5 138.5");
  });

  it("0 e 100 cobrem os extremos do arco", () => {
    expect(getSvg({ progress: 0 }).getAttribute("style")).toContain("--g-dash: 0 277");
    expect(getSvg({ progress: 100 }).getAttribute("style")).toContain("--g-dash: 277 0");
  });

  it("sem progress não gera data-progress nem --g-dash", () => {
    const svg = getSvg();
    expect(svg.hasAttribute("data-progress")).toBe(false);
    expect(svg.getAttribute("style") ?? "").not.toContain("--g-dash");
  });
});

describe("Giro — olhar e pulo", () => {
  it("look define --g-look-x e --g-look-y em px", () => {
    const style = getSvg({ look: { x: 4, y: -3 } }).getAttribute("style") ?? "";
    expect(style).toContain("--g-look-x: 4px");
    expect(style).toContain("--g-look-y: -3px");
  });

  it("curioso inclina o corpo na direção do alvo, até 8° com os olhos em 6", () => {
    const tilt = (x: number) =>
      getSvg({ state: "curious", look: { x, y: 0 } }).getAttribute("style") ?? "";
    expect(tilt(6)).toContain("--g-tilt: 8deg");
    expect(tilt(-3)).toContain("--g-tilt: -4deg");
    expect(tilt(20)).toContain("--g-tilt: 8deg");
  });

  it("só o curioso inclina: outros estados e curioso sem alvo não definem --g-tilt", () => {
    expect(getSvg({ state: "thinking", look: { x: 6, y: 0 } }).getAttribute("style")).not.toContain(
      "--g-tilt"
    );
    expect(getSvg({ state: "curious" }).getAttribute("style") ?? "").not.toContain("--g-tilt");
  });

  it("hop adiciona is-hop", () => {
    expect(getSvg({ hop: true }).classList.contains("is-hop")).toBe(true);
    expect(getSvg().classList.contains("is-hop")).toBe(false);
  });
});

describe("Giro — acessibilidade", () => {
  it("é decorativo: aria-hidden=true e sem role", () => {
    const svg = getSvg({ state: "loading" });
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
  });
});

describe("Giro — tamanho", () => {
  it("define font-size pelo size em px", () => {
    expect(getSvg({ size: 48 }).getAttribute("style")).toContain("font-size: 48px");
  });

  it.each([
    [96, "g-giro"],
    [60, "g-giro"],
    [59, "g-giro--md"],
    [32, "g-giro--md"],
    [31, "g-giro--sm"],
    [24, "g-giro--sm"],
    [23, "g-giro--xs"],
    [16, "g-giro--xs"],
  ])("size %i usa a classe %s", (size, className) => {
    expect(getSvg({ size }).classList.contains(className)).toBe(true);
  });

  it("sem size usa a classe base, que herda o tamanho do pai", () => {
    const svg = getSvg();
    expect(svg.getAttribute("class")).toBe("g-giro");
    expect(svg.getAttribute("style") ?? "").not.toContain("font-size");
  });

  it("signature usa o traço da assinatura, mesmo com size de outra faixa", () => {
    expect(getSvg({ size: 40, signature: true }).classList.contains("g-giro--signature")).toBe(
      true
    );
    expect(getSvg({ size: 40, signature: true }).classList.contains("g-giro--md")).toBe(false);
  });

  it("className é somado às classes do Giro", () => {
    const svg = getSvg({ size: 16, className: "ml-2" });
    expect(svg.classList.contains("g-giro--xs")).toBe(true);
    expect(svg.classList.contains("ml-2")).toBe(true);
  });
});
