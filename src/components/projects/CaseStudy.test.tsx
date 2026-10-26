import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { homeCases } from "@/data/projects";
import { setLocale, t } from "@/lib/i18n";
import { getPageGiro, setPageGiro } from "@/lib/page-giro";
import CaseStudy from "./CaseStudy";

const entre = homeCases[0];
const atlas = homeCases[1];
const last = homeCases[homeCases.length - 1];

beforeEach(() => {
  setLocale("pt");
  setPageGiro(null);
});

describe("CaseStudy", () => {
  it("renderiza as quatro seções do Estúdio Entre, com a lista de necessidades", () => {
    const { container } = render(<CaseStudy project={entre} />);

    expect(screen.getByRole("heading", { level: 1, name: entre.title })).toBeInTheDocument();
    expect(document.getElementById("contexto")).toHaveTextContent(entre.context.title.pt);
    expect(document.getElementById("problema")).toHaveTextContent(entre.problem.title.pt);
    expect(document.getElementById("solucao")).toHaveTextContent(entre.solution.title.pt);
    expect(document.getElementById("resultado")).toHaveTextContent(entre.result.title.pt);
    expect(screen.getByText(entre.context.text.pt)).toBeInTheDocument();

    expect(screen.getByText(t("pt", "case.page.problem_list_label"))).toBeInTheDocument();
    for (const need of entre.problem.needs.pt) {
      expect(screen.getByText(need)).toBeInTheDocument();
    }
    for (const item of entre.result.items.pt) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    expect(container.querySelector(".g-stat")).toBeNull();
  });

  it("omite a lista de necessidades quando needs é null", () => {
    render(<CaseStudy project={atlas} />);

    expect(document.getElementById("problema")).toHaveTextContent(atlas.problem.title.pt);
    expect(screen.queryByText(t("pt", "case.page.problem_list_label"))).not.toBeInTheDocument();
    expect(screen.queryByText(entre.problem.needs.pt[0])).not.toBeInTheDocument();
  });

  it("mostra os botões de site e código só quando o dado existe", () => {
    const { unmount } = render(<CaseStudy project={entre} />);

    expect(screen.getByRole("link", { name: t("pt", "case.page.cta_live") })).toHaveAttribute(
      "href",
      entre.live
    );
    expect(screen.getByRole("link", { name: t("pt", "case.page.cta_code") })).toHaveAttribute(
      "href",
      entre.github
    );

    unmount();
    render(<CaseStudy project={atlas} />);

    expect(screen.getByRole("link", { name: t("pt", "case.page.cta_live") })).toHaveAttribute(
      "href",
      atlas.live
    );
    expect(screen.queryByRole("link", { name: t("pt", "case.page.cta_code") })).toBeNull();
  });

  it("aponta o próximo case para o slug seguinte e some no último", () => {
    const following = homeCases[1];
    const { unmount } = render(<CaseStudy project={entre} />);
    const next = screen.getByRole("link", { name: name => name.includes(following.title) });

    expect(next).toHaveAttribute("href", `/projetos/${following.slug}`);
    expect(next).toHaveTextContent(t("pt", "case.page.next_label"));

    unmount();
    if (!last) throw new Error("missing last case");
    render(<CaseStudy project={last} />);

    expect(screen.queryByText(t("pt", "case.page.next_label"))).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Estúdio Entre/ })).toBeNull();
  });

  it("publica o Giro da seção ativa e limpa ao desmontar", () => {
    const view = render(<CaseStudy project={entre} />);
    expect(getPageGiro()).toBe("idle");
    view.unmount();
    expect(getPageGiro()).toBeNull();
  });
});
