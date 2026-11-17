import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button, ButtonLink, IconButton, ArrowLink } from "./Button";

describe("Button — variantes", () => {
  it("primário é o padrão e não ganha modificador de variante", () => {
    render(<Button>Ver projetos</Button>);
    const button = screen.getByRole("button", { name: "Ver projetos" });
    expect(button.className).toBe("g-button");
    expect(button.getAttribute("type")).toBe("button");
  });

  it("secundário, fantasma e pequeno geram as classes do DS", () => {
    render(
      <>
        <Button variant="secondary">Ler o case</Button>
        <Button variant="ghost">Ver todos</Button>
        <Button size="sm">Enviar</Button>
      </>
    );
    expect(screen.getByRole("button", { name: "Ler o case" }).className).toContain(
      "g-button--secondary"
    );
    expect(screen.getByRole("button", { name: "Ver todos" }).className).toContain(
      "g-button--ghost"
    );
    expect(screen.getByRole("button", { name: "Enviar" }).className).toContain("g-button--sm");
  });

  it("lead com ícone ou Giro gera g-button--lead", () => {
    render(<Button lead={<span data-testid="lead" />}>Enviar</Button>);
    expect(screen.getByRole("button", { name: "Enviar" }).className).toContain("g-button--lead");
  });

  it("sem lead não gera g-button--lead", () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole("button", { name: "Enviar" }).className).not.toContain("--lead");
  });

  it("seta depois do texto aparece quando arrow é verdadeiro", () => {
    const { container } = render(<Button arrow>Ver projetos</Button>);
    expect(container.querySelector("svg.g-button__arrow")).not.toBeNull();
  });

  it("mantém className extra e repassa eventos", () => {
    const onClick = vi.fn();
    render(
      <Button className="is-hover" onClick={onClick}>
        Hover
      </Button>
    );
    const button = screen.getByRole("button", { name: "Hover" });
    expect(button.className).toContain("is-hover");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("desabilitado repassa o atributo disabled e não dispara clique", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Desabilitado
      </Button>
    );
    const button = screen.getByRole("button", { name: "Desabilitado" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Button — status", () => {
  it("carregando põe aria-busy e Giro loading no lugar do ícone", () => {
    const { container } = render(
      <Button status="loading" lead={<span data-testid="icone" />}>
        Enviando
      </Button>
    );
    const button = screen.getByRole("button", { name: "Enviando" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector('svg[data-state="loading"]')).not.toBeNull();
    expect(screen.queryByTestId("icone")).toBeNull();
    expect(button.className).toContain("g-button--lead");
  });

  it("pronto mostra Giro done e não tem aria-busy", () => {
    const { container } = render(<Button status="done">Enviado</Button>);
    const button = screen.getByRole("button", { name: "Enviado" });
    expect(container.querySelector('svg[data-state="done"]')).not.toBeNull();
    expect(button.hasAttribute("aria-busy")).toBe(false);
  });

  it("repouso não tem Giro nem aria-busy", () => {
    const { container } = render(<Button>Enviar</Button>);
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.getByRole("button", { name: "Enviar" }).hasAttribute("aria-busy")).toBe(false);
  });
});

describe("IconButton", () => {
  it("usa o aria-label como nome acessível e a classe g-icon-button", () => {
    render(
      <IconButton aria-label="Abrir menu">
        <svg className="g-icon" />
      </IconButton>
    );
    const button = screen.getByRole("button", { name: "Abrir menu" });
    expect(button.className).toBe("g-icon-button");
  });
});

describe("ButtonLink e ArrowLink", () => {
  it("ButtonLink é um link com a classe de botão", () => {
    render(<ButtonLink href="/projetos">Ver projetos</ButtonLink>);
    const link = screen.getByRole("link", { name: "Ver projetos" });
    expect(link.getAttribute("href")).toBe("/projetos");
    expect(link.className).toContain("g-button");
  });

  it("ArrowLink põe a seta depois do texto por padrão", () => {
    const { container } = render(<ArrowLink href="#contato">Ver case</ArrowLink>);
    const link = screen.getByRole("link", { name: "Ver case" });
    expect(link.className).toBe("g-link");
    expect(link.lastElementChild?.tagName.toLowerCase()).toBe("svg");
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("ArrowLink com back põe a seta antes do texto", () => {
    render(
      <ArrowLink href="/blog" back>
        Voltar
      </ArrowLink>
    );
    const link = screen.getByRole("link", { name: "Voltar" });
    expect(link.className).toContain("g-link--back");
    expect(link.firstElementChild?.tagName.toLowerCase()).toBe("svg");
  });
});
