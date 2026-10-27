import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import type { BlogPost } from "@/types/blog";
import BlogPage from "./BlogPage";

// Renderização pesada: com a suíte inteira em paralelo passa dos 5s padrão.
vi.setConfig({ testTimeout: 20_000 });

function makePost(overrides: Partial<BlogPost> & Pick<BlogPost, "slug" | "title">): BlogPost {
  return {
    id: overrides.slug,
    date: "22 ABR 2026",
    readTime: "8 min",
    tags: ["Frontend"],
    author: "Bruno Guimarães",
    excerpt: "Um resumo curto.",
    content: "",
    ...overrides,
  };
}

const posts: BlogPost[] = [
  makePost({
    slug: "design-system",
    title: "Design System Dark-First",
    tags: ["Frontend"],
    excerpt: "Construindo sistemas de design.",
  }),
  makePost({
    slug: "performance",
    title: "Performance Front-End 2026",
    tags: ["Performance"],
    excerpt: "Budget de JS e Core Web Vitals.",
  }),
  makePost({
    slug: "astro-islands",
    title: "Astro 5 + React Islands",
    tags: ["Arquitetura", "Frontend"],
    excerpt: "Arquitetura de ilhas reativas.",
  }),
];

describe("BlogPage", () => {
  afterEach(() => {
    setLocale("pt");
  });

  it("mostra rótulo, título, descrição e o total de posts na superfície de leitura", () => {
    const { container } = render(<BlogPage initialPosts={posts} />);

    expect(container.querySelector(".blog-page")).toHaveClass("g-papel");
    expect(container.querySelector(".bg-black")).toBeNull();
    expect(screen.getByText("// blog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
    expect(
      screen.getByText("Artigos sobre programação, engenharia de software e tecnologia.")
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("posts")).toBeInTheDocument();
  });

  it("lista cada post com data formatada e sem o aviso de idioma em português", () => {
    render(<BlogPage initialPosts={posts} />);

    expect(screen.getByRole("link", { name: /Design System Dark-First/ })).toHaveAttribute(
      "href",
      "/blog/design-system"
    );
    expect(screen.getAllByText("22 abr 2026")).toHaveLength(3);
    expect(screen.getAllByText("8 min de leitura")).toHaveLength(3);
    expect(screen.queryByText(/In Portuguese/)).not.toBeInTheDocument();
  });

  it("escolher uma categoria esconde os outros posts", () => {
    render(<BlogPage initialPosts={posts} />);

    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Frontend" }));

    expect(screen.getByRole("button", { name: "Frontend" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("link", { name: /Design System Dark-First/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Performance Front-End 2026/ })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Astro 5/ })).not.toBeInTheDocument();
    expect(screen.queryByText("Nenhum post nessa categoria ainda.")).not.toBeInTheDocument();
  });

  it("categoria sem posts mostra a frase vazia e Ver todos devolve a lista", () => {
    const front = makePost({ slug: "front", title: "Post de front", tags: ["Frontend"] });
    const back = makePost({ slug: "back", title: "Post de back", tags: ["Backend"] });
    const { container, rerender } = render(<BlogPage initialPosts={[front, back]} />);

    fireEvent.click(screen.getByRole("button", { name: "Backend" }));
    // A categoria continua selecionada quando os posts deixam de pertencer a ela.
    rerender(<BlogPage initialPosts={[front, { ...back, tags: ["Frontend"] }]} />);

    expect(screen.getByRole("status")).toHaveTextContent("Nenhum post nessa categoria ainda.");
    expect(container.querySelector('[data-state="empty"]')).toHaveStyle({ fontSize: "72px" });
    expect(screen.queryByRole("link", { name: "Ver todos" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Post de front/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver todos" }));

    expect(screen.getByRole("link", { name: /Post de front/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Post de back/ })).toBeInTheDocument();
    expect(screen.queryByText("Nenhum post nessa categoria ainda.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
  });

  it("Carregar mais revela o restante e some quando não sobra nada", () => {
    const many = Array.from({ length: 7 }, (_, index) => {
      const n = String(index + 1).padStart(2, "0");
      return makePost({ slug: `nota-${n}`, title: `Nota ${n}`, tags: ["Notas"] });
    });
    render(<BlogPage initialPosts={many} />);

    expect(screen.getByRole("link", { name: /Nota 06/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Nota 07/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Carregar mais (1 restantes)" }));

    expect(screen.getByRole("link", { name: /Nota 07/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Carregar mais/ })).not.toBeInTheDocument();
  });

  it("em inglês, cada post avisa que está em português", () => {
    setLocale("en");
    render(<BlogPage initialPosts={posts.slice(0, 1)} />);

    expect(screen.getByText(/In Portuguese/)).toBeInTheDocument();
    expect(screen.getByText("Apr 22, 2026")).toBeInTheDocument();
    expect(screen.getByText("8 min read · In Portuguese")).toBeInTheDocument();
    expect(
      screen.getByText("Articles on programming, software engineering and technology.")
    ).toBeInTheDocument();
  });
});
