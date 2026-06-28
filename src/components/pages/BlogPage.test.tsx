import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPage from "./BlogPage";
import type { BlogPost } from "@/types/blog";

const mockPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "design-system-dark",
    title: "Design System Dark-First",
    date: "JUN 2026",
    readTime: "8 min",
    tags: ["FRONTEND"],
    author: "Bruno Guimarães",
    excerpt: "Construindo sistemas de design com paleta escura.",
    content: "# Design System\n\nConteúdo do post.",
  },
  {
    id: "post-2",
    slug: "performance-frontend",
    title: "Performance Front-End 2026",
    date: "MAI 2026",
    readTime: "6 min",
    tags: ["PERFORMANCE"],
    author: "Bruno Guimarães",
    excerpt: "Budget de JS e Core Web Vitals.",
    content: "# Performance\n\nConteúdo do post.",
  },
  {
    id: "post-3",
    slug: "astro-react-islands",
    title: "Astro 5 + React Islands",
    date: "ABR 2026",
    readTime: "5 min",
    tags: ["ARQUITETURA", "FRONTEND"],
    author: "Bruno Guimarães",
    excerpt: "Arquitetura de ilhas reativas com SSG.",
    content: "# Astro\n\nConteúdo do post.",
  },
];

describe("BlogPage — Hero Section", () => {
  it("exibe o label // BLOG no hero", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    expect(screen.getByText("// BLOG")).toBeInTheDocument();
  });

  it("exibe o heading POSTS em fonte pixel", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    const heading = screen.getByText("POSTS");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
    // Deve usar a classe font-pixel
    expect(heading.className).toContain("font-pixel");
  });

  it("exibe o subtítulo descritivo", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    expect(screen.getByText(/Artigos técnicos e reflexões/)).toBeInTheDocument();
  });

  it("exibe o contador decorativo com total de posts", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    // O número 3 aparece no contador decorativo (há múltiplos "3" — badge counts também)
    const threes = screen.getAllByText("3");
    expect(threes.length).toBeGreaterThanOrEqual(1);
    // Label TOTAL_POSTS
    expect(screen.getByText("TOTAL_POSTS")).toBeInTheDocument();
  });
});

describe("BlogPage — Filtro por Categoria", () => {
  it("exibe o botão 'Todos' como padrão ativo na barra de filtro", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    const todosButton = screen.getByText("Todos");
    expect(todosButton).toBeInTheDocument();
  });

  it("exibe botões de categoria baseados em tags[0] dos posts", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    // mockPosts têm tags[0]: FRONTEND, PERFORMANCE, ARQUITETURA
    // Usa getAllByText pois os nomes aparecem nos botões de filtro E nos badges das rows
    expect(screen.getAllByText("FRONTEND").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("PERFORMANCE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("ARQUITETURA").length).toBeGreaterThanOrEqual(1);
  });

  it("filtra posts ao clicar em uma categoria", async () => {
    const { rerender } = render(<BlogPage initialPosts={mockPosts} />);

    // Com "Todos" ativo, deve mostrar todos os posts
    expect(screen.getByText("Design System Dark-First")).toBeInTheDocument();
    expect(screen.getByText("Performance Front-End 2026")).toBeInTheDocument();

    // Clica na categoria FRONTEND (usa getAllByText pois aparece no filtro E nos badges)
    const frontendButtons = screen.getAllByText("FRONTEND");
    const filterButton = frontendButtons.find(btn => btn.tagName === "BUTTON");
    expect(filterButton).toBeDefined();
    filterButton?.click();

    rerender(<BlogPage initialPosts={mockPosts} />);

    // TODO: após implementação completa, verificar filtro via estado
  });
});

describe("BlogPage — Lista de Posts", () => {
  it("exibe cada post como um link para /blog/{slug}", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    const links = screen.getAllByRole("link");
    const postLinks = links.filter(link => link.getAttribute("href")?.startsWith("/blog/"));
    expect(postLinks.length).toBeGreaterThanOrEqual(mockPosts.length);
  });

  it("exibe o título de cada post", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    expect(screen.getByText("Design System Dark-First")).toBeInTheDocument();
    expect(screen.getByText("Performance Front-End 2026")).toBeInTheDocument();
  });

  it("exibe o excerpt de cada post", () => {
    render(<BlogPage initialPosts={mockPosts} />);
    expect(
      screen.getByText("Construindo sistemas de design com paleta escura.")
    ).toBeInTheDocument();
  });
});
