import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { homeCases } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setLocale } from "@/lib/i18n";
import {
  BAND_ARRIVE_MS,
  BAND_GIRO_FADE_MS,
  BAND_SELECT_HOLD_MS,
  BAND_TYPE_DELAY_MS,
  BAND_TYPE_MS,
  HomeProjects,
} from "./HomeProjects";
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

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  observers.length = 0;
  paintedBandIds.clear();
  document.documentElement.removeAttribute("data-loader");
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  vi.mocked(useReducedMotion).mockReturnValue(false);
  vi.stubGlobal("IntersectionObserver", BandObserver);
});

afterEach(() => {
  setLocale("pt");
  document.documentElement.removeAttribute("data-loader");
  vi.unstubAllGlobals();
  vi.useRealTimers();
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

  it("não pinta enquanto o loader está na tela e pinta quando ele sai", async () => {
    document.documentElement.setAttribute("data-loader", "mounted");
    render(<HomeProjects />);
    enterFirst();

    expect(band()).toHaveAttribute("data-painted", "false");

    await act(async () => {
      document.documentElement.removeAttribute("data-loader");
      await Promise.resolve();
    });

    expect(band()).toHaveAttribute("data-painted", "true");
    expect(band()).toHaveAttribute("data-typing", "true");
  });

  it("pinta uma vez: entrar de novo não recomeça a digitação", async () => {
    render(<HomeProjects />);
    enterFirst();
    expect(band()).toHaveAttribute("data-typing", "true");

    await advance(BAND_TYPE_DELAY_MS + BAND_TYPE_MS);
    expect(band()).toHaveAttribute("data-typing", "false");

    enterFirst();
    expect(band()).toHaveAttribute("data-painted", "true");
    expect(band()).toHaveAttribute("data-typing", "false");
  });

  it("leva a capa e o Giro some no centro, sem ir para o canto", async () => {
    render(<HomeProjects />);
    enterFirst();

    await advance(BAND_ARRIVE_MS);
    expect(band()).toHaveAttribute("data-loaded", "true");
    expect(band()).toHaveAttribute("data-selected", "true");
    expect(band().querySelector(".g-giro")).toHaveAttribute("data-state", "loading");

    await advance(BAND_GIRO_FADE_MS);
    expect(band().querySelector(".g-giro")).not.toHaveAttribute("data-state");

    await advance(BAND_SELECT_HOLD_MS - BAND_GIRO_FADE_MS);
    expect(band()).toHaveAttribute("data-selected", "false");
  });

  it("com movimento reduzido a faixa já chega pintada, sem digitação", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<HomeProjects />);

    expect(band()).toHaveAttribute("data-painted", "true");
    expect(band()).toHaveAttribute("data-loaded", "true");
    expect(band()).toHaveAttribute("data-typing", "false");
    expect(band()).toHaveAttribute("data-selected", "false");
    expect(band().querySelector(".g-giro")).not.toHaveAttribute("data-state");
    expect(observers).toHaveLength(0);
  });

  it("no celular com movimento reduzido a seleção fica visível", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query.includes("887"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    render(<HomeProjects />);

    expect(band()).toHaveAttribute("data-selected", "true");
    expect(band()).toHaveAttribute("data-typing", "false");
  });

  it("ao voltar para a home a faixa que já pintou entra assentada", () => {
    const first = render(<HomeProjects />);
    enterFirst();
    expect(band()).toHaveAttribute("data-painted", "true");
    first.unmount();

    render(<HomeProjects />);
    expect(band()).toHaveAttribute("data-painted", "true");
    expect(band()).toHaveAttribute("data-loaded", "true");
    expect(band()).toHaveAttribute("data-typing", "false");
    expect(band("atlas-marine-solutions")).toHaveAttribute("data-painted", "false");
  });
});
