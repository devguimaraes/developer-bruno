import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostToc, type PostTocItem } from "./PostToc";

const items: PostTocItem[] = [
  { id: "problema", title: "O problema: JavaScript demais no cliente" },
  { id: "impacto", title: "Impacto real nos Core Web Vitals" },
  { id: "deploy", title: "Considerações para deploy no Brasil" },
];

describe("PostToc", () => {
  it("é uma nav rotulada com um link por seção, apontando para a âncora", () => {
    render(<PostToc title="Neste post" items={items} />);
    expect(screen.getByRole("navigation", { name: "Neste post" })).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[1]).toHaveAttribute("href", "#impacto");
  });

  it('a seção ativa ganha aria-current="true" e só ela', () => {
    render(<PostToc title="Neste post" items={items} activeId="impacto" />);
    expect(screen.getByRole("link", { name: "Impacto real nos Core Web Vitals" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(
      screen.getByRole("link", { name: "O problema: JavaScript demais no cliente" })
    ).not.toHaveAttribute("aria-current");
    expect(document.querySelectorAll('[aria-current="true"]')).toHaveLength(1);
  });

  it("sem seção ativa, nenhum link tem aria-current", () => {
    render(<PostToc title="Neste post" items={items} />);
    expect(document.querySelector("[aria-current]")).toBeNull();
  });
});
