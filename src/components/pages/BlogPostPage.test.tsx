import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPostPage from "./BlogPostPage";
import type { BlogPost } from "@/types/blog";

const mockPost: BlogPost = {
  id: "post-1",
  slug: "design-system-dark",
  title: "Design System Dark-First",
  date: "JUN 2026",
  readTime: "8 min",
  tags: ["FRONTEND", "DESIGN"],
  author: "Bruno Guimarães",
  excerpt: "Construindo sistemas de design com paleta escura.",
  content: "# Design System\n\nConteúdo do post.",
  image: "/uploads/blog/design-system.webp",
};

const mockPostSemImagem: BlogPost = { ...mockPost, image: undefined };
const mockPostSemTags: BlogPost = { ...mockPost, tags: [] };

const mockNext: BlogPost = {
  ...mockPost,
  id: "post-2",
  slug: "performance-frontend",
  title: "Performance Front-End 2026",
};

describe("BlogPostPage — Header", () => {
  it("exibe o título do post em fonte raster", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    const heading = screen.getByText("Design System Dark-First");
    expect(heading.tagName).toBe("H1");
    expect(heading.className).toContain("type-raster-section");
  });

  it("exibe a meta row com badge de categoria, data e tempo de leitura", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    // "FRONTEND" também aparece na cápsula de tags no rodapé (tags[0] === categoria)
    expect(screen.getAllByText("FRONTEND").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("JUN 2026")).toBeInTheDocument();
    expect(screen.getByText("8 min de leitura")).toBeInTheDocument();
  });

  it("usa 'POST' como fallback de categoria quando não há tags", () => {
    render(<BlogPostPage post={mockPostSemTags} next={null} />);
    expect(screen.getByText("POST")).toBeInTheDocument();
  });

  it("exibe a lede com o excerpt do post", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    expect(
      screen.getByText("Construindo sistemas de design com paleta escura.")
    ).toBeInTheDocument();
  });
});

describe("BlogPostPage — Byline", () => {
  it("exibe o nome do autor e o cargo fixo", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    expect(screen.getByText("Bruno Guimarães")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Front-End")).toBeInTheDocument();
  });

  it("exibe o mascote BLOCO no avatar do autor", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    expect(screen.getByLabelText(/Mascote BLOCO/i)).toBeInTheDocument();
  });
});

describe("BlogPostPage — Cover", () => {
  it("exibe a imagem de capa quando post.image existe", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    const img = screen.getByRole("img", { name: mockPost.title });
    expect(img).toHaveAttribute("src", mockPost.image);
    expect(img).toHaveAttribute("alt", mockPost.title);
  });

  it("não exibe imagem de capa quando post.image está ausente", () => {
    render(<BlogPostPage post={mockPostSemImagem} next={null} />);
    expect(screen.queryByRole("img", { name: mockPostSemImagem.title })).not.toBeInTheDocument();
  });
});

describe("BlogPostPage — Conteúdo e tags", () => {
  it("renderiza children dentro do container de markdown", () => {
    const { container } = render(
      <BlogPostPage post={mockPost} next={null}>
        <p>Conteúdo de teste</p>
      </BlogPostPage>
    );
    const markdownContainer = container.querySelector("[data-markdown-content]");
    expect(markdownContainer).toContainElement(screen.getByText("Conteúdo de teste"));
  });

  it("exibe cada tag como cápsula no rodapé do artigo", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    // "FRONTEND" também aparece no badge de categoria da meta row
    expect(screen.getAllByText("FRONTEND").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("DESIGN")).toBeInTheDocument();
  });

  it("não renderiza a seção de tags quando post.tags está vazio", () => {
    render(<BlogPostPage post={mockPostSemTags} next={null} />);
    expect(screen.queryByText("DESIGN")).not.toBeInTheDocument();
  });
});

describe("BlogPostPage — Navegação para o próximo post", () => {
  it("exibe o card de próximo post quando next existe", () => {
    render(<BlogPostPage post={mockPost} next={mockNext} />);
    expect(screen.getByText("PRÓXIMO POST →")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Performance Front-End 2026/ });
    expect(link).toHaveAttribute("href", "/blog/performance-frontend");
  });

  it("não exibe nada quando next é null", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    expect(screen.queryByText(/PRÓXIMO POST/)).not.toBeInTheDocument();
  });
});

describe("BlogPostPage — Back button", () => {
  it("exibe o link de volta para a listagem do blog", () => {
    render(<BlogPostPage post={mockPost} next={null} />);
    const link = screen.getByRole("link", { name: /VOLTAR AO BLOG/ });
    expect(link).toHaveAttribute("href", "/blog");
  });
});

describe("BlogPostPage — Estado vazio", () => {
  it("renderiza apenas o fallback quando post é nulo", () => {
    const { container } = render(<BlogPostPage post={null as unknown as BlogPost} next={null} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelector(".bg-black")).toBeInTheDocument();
  });
});
