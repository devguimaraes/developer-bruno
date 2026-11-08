import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { homeCases } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setLocale } from "@/lib/i18n";
import { HomeProjects } from "./HomeProjects";
import { paintedBandIds } from "./painted-bands";

vi.mock("@/hooks/useReducedMotion", () => ({ useReducedMotion: vi.fn() }));

const observers: BandObserver[] = [];

class BandObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds: readonly number[] = [];
  elements: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }

  observe(element: Element) {
    this.elements.push(element);
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter(item => item !== element);
  }

  disconnect() {
    this.elements = [];
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  intersect(ratio = 1) {
    const height = 800;
    this.callback(
      this.elements.map(target => ({
        isIntersecting: ratio > 0,
        intersectionRatio: ratio,
        intersectionRect: {
          height: height * ratio,
          width: 400,
          top: 0,
          left: 0,
          bottom: height,
          right: 400,
          x: 0,
          y: 0,
          toJSON() {
            return {};
          },
        },
        boundingClientRect: target.getBoundingClientRect(),
        rootBounds: null,
        target,
        time: 0,
      })) as IntersectionObserverEntry[],
      this
    );
  }
}

function band(id = "estudio-entre"): HTMLElement {
  const element = document.getElementById(`home-band-${id}`);
  if (!element) throw new Error(`faixa ${id} não encontrada`);
  return element;
}

function enterFirst() {
  act(() => {
    observers[0]?.intersect();
  });
}

beforeEach(() => {
  observers.length = 0;
  paintedBandIds.clear();
  document.documentElement.removeAttribute("data-loader");
  vi.mocked(useReducedMotion).mockReturnValue(false);
  vi.stubGlobal("IntersectionObserver", BandObserver);
});

afterEach(() => {
  setLocale("pt");
  document.documentElement.removeAttribute("data-loader");
  vi.unstubAllGlobals();
});

describe("HomeProjects", () => {
  it("mostra o título da seção e os cinco cases em português", () => {
    render(<HomeProjects />);

    expect(screen.getByRole("heading", { level: 2, name: "No ar." })).toBeInTheDocument();
    expect(screen.getByText("// projetos")).toBeInTheDocument();

    for (const project of homeCases) {
      expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
        "href",
        `/projetos/${project.slug}`
      );
      expect(screen.getByText(project.label.pt)).toBeInTheDocument();
      expect(screen.getByText(project.summary.pt)).toBeInTheDocument();
      const tag = document.querySelector(`#home-band-${project.id} .home-band__tag`);
      expect(tag?.textContent).toMatch(/^<[A-Za-z0-9]+ \/>$/);
    }

    expect(document.querySelector("#home-band-estudio-entre .home-band__tag")).toHaveTextContent(
      "<EstudioEntre />"
    );
    expect(document.querySelector("#home-band-agencia-multi-br .home-band__tag")).toHaveTextContent(
      "<AgenciaMultiBR />"
    );
    expect(screen.getAllByRole("list", { name: "Stack" })).toHaveLength(homeCases.length);
    expect(screen.getAllByText("Ver case", { selector: ".home-band__cta" })).toHaveLength(
      homeCases.length
    );
    expect(band().querySelector(".home-band__cover")).toHaveAttribute("aria-hidden", "true");
    expect(band().querySelector(".home-band__sel")).toHaveAttribute("aria-hidden", "true");
  });

  it("troca rótulo, resumo e chamada quando o idioma é inglês", () => {
    setLocale("en");
    render(<HomeProjects />);

    expect(screen.getByRole("heading", { level: 2, name: "Live." })).toBeInTheDocument();
    expect(screen.getByText(homeCases[0].label.en)).toBeInTheDocument();
    expect(screen.getByText(homeCases[0].summary.en)).toBeInTheDocument();
    expect(screen.getAllByText("View case study", { selector: ".home-band__cta" })).toHaveLength(
      homeCases.length
    );
  });

  it("não entra enquanto o loader está na tela e entra quando ele sai", async () => {
    document.documentElement.setAttribute("data-loader", "mounted");
    render(<HomeProjects />);
    enterFirst();

    expect(band()).toHaveAttribute("data-painted", "false");

    await act(async () => {
      document.documentElement.removeAttribute("data-loader");
      await Promise.resolve();
    });

    expect(band()).toHaveAttribute("data-painted", "true");
  });

  it("entra uma vez: sair e voltar para a tela não recomeça", () => {
    render(<HomeProjects />);
    expect(band()).toHaveAttribute("data-painted", "false");

    enterFirst();
    expect(band()).toHaveAttribute("data-painted", "true");

    act(() => {
      observers[0]?.intersect(0);
    });
    expect(band()).toHaveAttribute("data-painted", "true");
  });

  it("põe o logo da tecnologia na badge, e só texto onde não há logo", () => {
    render(<HomeProjects />);

    const tags = [...document.querySelectorAll<HTMLElement>(".home-band .g-tag")];
    const byName = (name: string) => tags.filter(tag => tag.textContent === name);

    for (const name of ["Astro", "React", "Next.js", "PHP", "WordPress"]) {
      for (const tag of byName(name)) {
        expect(tag.querySelector("svg.g-tag__logo")).toHaveAttribute("aria-hidden", "true");
      }
    }
    expect(byName("SEO").length).toBeGreaterThan(0);
    for (const tag of byName("SEO")) expect(tag.querySelector("svg")).toBeNull();
  });

  it("não usa mais loader, troca de fundo nem seleção automática na capa", () => {
    render(<HomeProjects />);
    enterFirst();

    expect(band().querySelector(".g-giro")).toBeNull();
    expect(band().querySelector(".home-band__wash")).toBeNull();
    expect(band()).not.toHaveAttribute("data-loaded");
    expect(band()).not.toHaveAttribute("data-typing");
    expect(band()).not.toHaveAttribute("data-selected");
  });

  it("com movimento reduzido a faixa já chega assentada", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<HomeProjects />);

    expect(band()).toHaveAttribute("data-painted", "true");
    expect(observers).toHaveLength(0);
  });

  it("ao voltar para a home a faixa que já entrou chega assentada", () => {
    const first = render(<HomeProjects />);
    enterFirst();
    expect(band()).toHaveAttribute("data-painted", "true");
    first.unmount();

    render(<HomeProjects />);
    expect(band()).toHaveAttribute("data-painted", "true");
    expect(band("atlas-marine-solutions")).toHaveAttribute("data-painted", "false");
  });
});
