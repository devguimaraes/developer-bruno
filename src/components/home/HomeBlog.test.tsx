import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { setLocale } from "@/lib/i18n";
import { HomeBlog, type HomePost } from "./HomeBlog";
import { getStorySignals, resetStorySignals } from "./story/story-signals";

const posts: HomePost[] = [
  {
    slug: "vercel-lovable",
    title: "Vercel + Lovable: o que vazou",
    date: "2026-04-22",
    category: "Segurança",
    readTime: 8,
    excerpt: "Uma análise direta dos incidentes.",
  },
  {
    slug: "react-19",
    title: "React 19 e Server Components",
    date: "2026-04-10",
    category: "React",
    readTime: 8,
    excerpt: "Como o React 19 reduz JavaScript.",
  },
];

describe("HomeBlog", () => {
  afterEach(() => {
    setLocale("pt");
    resetStorySignals();
  });

  it("mostra cada post como link para a página do post, com a data formatada", () => {
    render(<HomeBlog posts={posts} />);
    const links = screen.getAllByRole("link", { name: /React 19|Vercel/ });
    expect(links.map(link => link.getAttribute("href"))).toEqual([
      "/blog/vercel-lovable",
      "/blog/react-19",
    ]);
    expect(screen.getByText("22 abr 2026")).toHaveAttribute("datetime", "2026-04-22");
  });

  it("mostra categoria e tempo de leitura", () => {
    render(<HomeBlog posts={posts} />);
    expect(screen.getByText("Segurança")).toHaveClass("g-tag");
    expect(screen.getAllByText("8 min de leitura")).toHaveLength(2);
  });

  it("o link Ver o blog leva para /blog", () => {
    render(<HomeBlog posts={posts} />);
    expect(screen.getByRole("link", { name: "Ver o blog" })).toHaveAttribute("href", "/blog");
  });

  it("em inglês, cada post avisa que está em português", () => {
    setLocale("en");
    render(<HomeBlog posts={posts} />);
    expect(screen.getAllByText(/In Portuguese/)).toHaveLength(2);
    expect(screen.getByText("Apr 22, 2026")).toBeInTheDocument();
  });

  it("em português não mostra o aviso de idioma", () => {
    render(<HomeBlog posts={posts} />);
    expect(screen.queryByText(/In Portuguese/)).not.toBeInTheDocument();
  });

  it("é a seção #blog, com a parada de cochilo e uma parada por linha", () => {
    const { container } = render(<HomeBlog posts={posts} />);
    expect(container.querySelector("section#blog")).not.toBeNull();
    const stops = [...container.querySelectorAll("[data-stop]")].map(el =>
      el.getAttribute("data-stop")
    );
    expect(stops).toEqual(["bl-nap", "bl0", "bl1"]);
  });

  it("escreve o sinal de hover da linha sob o ponteiro e zera ao sair", () => {
    render(<HomeBlog posts={posts} />);
    const rows = screen.getAllByRole("link", { name: /React 19|Vercel/ });
    fireEvent.pointerEnter(rows[1], { pointerType: "mouse" });
    expect(getStorySignals().blogHover).toBe(1);
    fireEvent.pointerLeave(rows[1], { pointerType: "mouse" });
    expect(getStorySignals().blogHover).toBe(-1);
  });

  it("com toque, o Giro só cochila: nenhum sinal de hover", () => {
    render(<HomeBlog posts={posts} />);
    const rows = screen.getAllByRole("link", { name: /React 19|Vercel/ });
    fireEvent.pointerEnter(rows[0], { pointerType: "touch" });
    expect(getStorySignals().blogHover).toBe(-1);
  });

  it("zera o sinal ao sair da tela", () => {
    const { unmount } = render(<HomeBlog posts={posts} />);
    fireEvent.pointerEnter(screen.getAllByRole("link", { name: /Vercel/ })[0], {
      pointerType: "mouse",
    });
    expect(getStorySignals().blogHover).toBe(0);
    unmount();
    expect(getStorySignals().blogHover).toBe(-1);
  });
});
