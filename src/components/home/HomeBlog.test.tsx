import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { setLocale } from "@/lib/i18n";
import { HomeBlog, type HomePost } from "./HomeBlog";

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
});
