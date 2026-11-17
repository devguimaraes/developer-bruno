import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Chip, Tag } from "./Chip";

function ChipHarness({ onToggle }: { onToggle?: (next: boolean) => void }) {
  const [selected, setSelected] = useState(false);
  return (
    <Chip
      selected={selected}
      onClick={() => {
        setSelected(!selected);
        onToggle?.(!selected);
      }}
    >
      Design
    </Chip>
  );
}

describe("Chip", () => {
  it("começa sem seleção: aria-pressed false e sem check", () => {
    const { container } = render(<Chip>Design</Chip>);
    const chip = screen.getByRole("button", { name: "Design" });
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    expect(chip.getAttribute("type")).toBe("button");
    expect(container.querySelector(".g-chip__check")).toBeNull();
  });

  it("selecionado mostra o check da Lucide e aria-pressed true", () => {
    const { container } = render(<Chip selected>Design</Chip>);
    expect(screen.getByRole("button", { name: "Design" }).getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(container.querySelector("svg.g-chip__check")).not.toBeNull();
  });

  it("alterna aria-pressed a cada clique", () => {
    render(<ChipHarness />);
    const chip = screen.getByRole("button", { name: "Design" });
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("false");
  });

  it("repassa o clique para quem usa o chip", () => {
    const onToggle = vi.fn();
    render(<ChipHarness onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { name: "Design" }));
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});

describe("Tag", () => {
  it("é um texto de leitura com a classe g-tag, sem papel de botão", () => {
    render(<Tag>React</Tag>);
    const tag = screen.getByText("React");
    expect(tag.className).toBe("g-tag");
    expect(tag.tagName.toLowerCase()).toBe("span");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
