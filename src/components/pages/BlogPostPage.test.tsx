import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import type { BlogPost } from "@/types/blog";
import BlogPostPage from "./BlogPostPage";

const post: BlogPost = {
  id: "react-19",
  slug: "react-19-server-components",
  title: "React 19 e Server Components",
  date: "10 ABR 2026",
  readTime: "8 min",
  tags: ["React"],
  author: "Bruno Guimarães",
  excerpt: "Como o React 19 reduz o JavaScript enviado ao cliente.",
  content: "## Introdução\n\nTexto.\n\n## Fechamento\n\nFim.\n",
};

function box(top: number, height: number): DOMRect {
  return {
    x: 0,
    y: top,
    top,
    left: 0,
    right: 0,
    bottom: top + height,
    width: 0,
    height,
    toJSON() {
      return {};
    },
  } as DOMRect;
}

function mockLayout(article: { top: number; height: number }, headings: Record<string, number>) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function mockRect(
    this: HTMLElement
  ) {
    if (this.hasAttribute("data-reading-root")) return box(article.top, article.height);
    const top = this.id ? headings[this.id] : undefined;
    if (top !== undefined) return box(top, 32);
    return box(0, 0);
  });
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 1000 });
}

function renderPost(children?: ReactNode, following: readonly BlogPost[] = []) {
  return render(
    <BlogPostPage post={post} following={following}>
      {children ?? (
        <>
          <h2 id="introducao">Introdução</h2>
          <p>Texto.</p>
          <h2 id="fechamento">Fechamento</h2>
        </>
      )}
    </BlogPostPage>
  );
}

afterEach(() => {
  cleanup();
  setLocale("pt");
  vi.restoreAllMocks();
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 768 });
});

describe("BlogPostPage — índice e progresso", () => {
  it("marca o heading que já passou da linha de leitura", () => {
    mockLayout({ top: 200, height: 4000 }, { introducao: 400, fechamento: 1200 });
    const { container } = renderPost();

    expect(container.querySelector("article")).toHaveAttribute("data-reading-root");
    expect(container.querySelector("article")).toHaveAttribute("data-read-line", "0.7");
    expect(screen.getByRole("link", { name: "Introdução" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(screen.getByRole("link", { name: "Fechamento" })).not.toHaveAttribute("aria-current");
    expect(screen.getByText("13% lido")).toBeInTheDocument();
  });

  it("no fim do artigo o último item é o atual e o texto é o de concluído", () => {
    mockLayout({ top: 1000 * 0.7 - 2000, height: 2000 }, { introducao: 100, fechamento: 900 });
    renderPost();

    expect(screen.getByRole("link", { name: "Fechamento" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(screen.getByRole("link", { name: "Introdução" })).not.toHaveAttribute("aria-current");
    expect(screen.getByText("lido até o fim")).toBeInTheDocument();
    expect(screen.queryByText("100% lido")).not.toBeInTheDocument();
  });
});

describe("BlogPostPage — idioma", () => {
  it("não mostra o aviso em português", () => {
    renderPost();
    expect(screen.queryByText("This post is in Portuguese.")).not.toBeInTheDocument();
  });

  it("em inglês, o aviso fica embaixo do título", () => {
    setLocale("en");
    renderPost();
    const title = screen.getByRole("heading", { level: 1, name: post.title });
    expect(title.nextElementSibling).toHaveTextContent("This post is in Portuguese.");
  });
});

describe("BlogPostPage — código", () => {
  it("mostra o rótulo da linguagem no bloco", () => {
    render(
      <BlogPostPage post={{ ...post, content: "Sem seções." }} following={[]}>
        <pre data-language="tsx">
          <code>const giro = true</code>
        </pre>
      </BlogPostPage>
    );

    expect(screen.getByText("// tsx")).toHaveClass("g-code__lang");
    expect(screen.getByRole("button", { name: "Copiar o código de tsx" })).toBeInTheDocument();
  });
});

describe("BlogPostPage — voltar e continuar lendo", () => {
  const later: BlogPost[] = [
    {
      ...post,
      id: "css",
      slug: "css-grid-moderno",
      title: "CSS Grid moderno",
      date: "01 ABR 2026",
    },
    {
      ...post,
      id: "ts",
      slug: "typescript-performance",
      title: "TypeScript na prática",
      date: "22 MAR 2026",
    },
    {
      ...post,
      id: "extra",
      slug: "extra",
      title: "Não deve aparecer",
      date: "01 MAR 2026",
    },
  ];

  it("mostra o fim do post e no máximo dois posts seguintes", () => {
    renderPost(undefined, later);

    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Voltar para o blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByText("// fim do post")).toBeInTheDocument();
    expect(screen.getByText("// continue lendo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /CSS Grid moderno/ })).toHaveAttribute(
      "href",
      "/blog/css-grid-moderno"
    );
    expect(screen.getByRole("link", { name: /TypeScript na prática/ })).toHaveAttribute(
      "href",
      "/blog/typescript-performance"
    );
    expect(screen.queryByRole("link", { name: /Não deve aparecer/ })).not.toBeInTheDocument();
  });

  it("sem posts seguintes, não inventa a lista", () => {
    renderPost();
    expect(screen.getByText("// fim do post")).toBeInTheDocument();
    expect(screen.queryByText("// continue lendo")).not.toBeInTheDocument();
  });
});
