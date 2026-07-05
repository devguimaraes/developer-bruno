import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrandIcon } from "./BrandIcon";

describe("BrandIcon — acessibilidade", () => {
  it("por padrão expõe role=img e aria-label (não decorativo)", () => {
    const { container } = render(<BrandIcon name="codigo" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Ícone codigo");
    expect(svg?.getAttribute("aria-hidden")).toBeNull();
  });

  it("com decorative marca aria-hidden e remove role/label", () => {
    const { container } = render(<BrandIcon name="codigo" decorative />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.getAttribute("aria-label")).toBeNull();
    expect(svg?.getAttribute("focusable")).toBe("false");
  });

  it("expõe data-icon com o nome para consulta em testes", () => {
    const { container } = render(<BrandIcon name="terminal" decorative />);
    expect(container.querySelector('[data-icon="terminal"]')).not.toBeNull();
  });
});
