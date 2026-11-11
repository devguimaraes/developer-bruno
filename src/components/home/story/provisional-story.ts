import type { GiroState } from "@/components/brand/giro-states";
import { calcAboutStep } from "@/components/home/about-stage";
import { calcBlogStep, calcContactStep } from "@/components/home/blog-contact-stage";
import { calcEndStep } from "@/components/home/end-stage";
import { calcProcessChapterStep } from "@/components/home/process-stage";
import { calcProjectStep } from "@/components/home/project-stage";
import { calcServiceStep } from "@/components/home/service-stage";
import { type Chapter, createChapter } from "./chapters";
import { detectSurface } from "./giro-jump";
import { getStorySignals } from "./story-signals";

export interface SectionStoryConfig {
  id: string;
  label: string;
  state: GiroState;
  stop: string;
  after?: Array<[ms: number, state: GiroState]>;
}

export const PROVISIONAL_SECTIONS: readonly SectionStoryConfig[] = [
  { id: "hero", label: "// início", state: "done", stop: "hero" },
  { id: "servicos", label: "// serviços", state: "curious", stop: "servicos" },
  { id: "projetos", label: "// projetos", state: "idle", stop: "projetos" },
  { id: "processo", label: "// processo", state: "thinking", stop: "processo" },
  { id: "sobre", label: "// sobre", state: "curious", stop: "sobre" },
  { id: "blog", label: "// blog", state: "sleeping", stop: "blog" },
  { id: "contato", label: "// contato", state: "idle", stop: "contato" },
  { id: "fim", label: "// fim da pilha", state: "loading", stop: "fn0" },
];

/**
 * Constrói capítulos provisórios a partir das seções presentes no DOM.
 * Permite que o Giro atravesse a página enquanto os palcos dedicados de cada capítulo
 * são portados nas próximas issues do roadmap.
 */
export function buildProvisionalChapters(
  configs: readonly SectionStoryConfig[] = PROVISIONAL_SECTIONS
): Chapter[] {
  if (typeof document === "undefined") return [];

  const viewportH = window.innerHeight || 900;
  const chapters: Chapter[] = [];

  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i];
    const el = document.getElementById(cfg.id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const len = Math.max(1, el.offsetHeight - viewportH);
    const surface = detectSurface(el);
    const surfaceName = surface === "g-papel" ? "papel" : surface === "g-tinta" ? "tinta" : "azul";

    if (cfg.id === "servicos") {
      const track = el.querySelector<HTMLElement>(".sv-track") || el;
      const trackRect = track.getBoundingClientRect();
      const trackTop = trackRect.top + window.scrollY;
      const trackLen = Math.max(1, track.offsetHeight - viewportH);

      chapters.push(
        createChapter({
          id: "servicos",
          label: cfg.label,
          top: trackTop,
          len: trackLen,
          altura: viewportH,
          lead: 0.45,
          surface: "papel",
          at: (p: number) => {
            const step = calcServiceStep(p);
            return {
              k: `sv${step}`,
              stop: `sv${step}`,
              state: "curious",
            };
          },
        })
      );
      continue;
    }

    if (cfg.id === "projetos") {
      const count = Math.max(1, el.querySelectorAll(".pj").length);
      chapters.push(
        createChapter({
          id: "projetos",
          label: cfg.label,
          top,
          len,
          altura: viewportH,
          lead: 0.5,
          surface: "papel",
          at: (p: number) => calcProjectStep(p, count),
        })
      );
      continue;
    }

    if (cfg.id === "processo") {
      chapters.push(
        createChapter({
          id: "processo",
          label: cfg.label,
          top,
          len,
          altura: viewportH,
          lead: 0.5,
          surface: "tinta",
          at: calcProcessChapterStep,
        })
      );
      continue;
    }

    if (cfg.id === "sobre") {
      chapters.push(
        createChapter({
          id: "sobre",
          label: cfg.label,
          top,
          len,
          altura: viewportH,
          lead: 0.5,
          surface: "azul",
          at: calcAboutStep,
        })
      );
      continue;
    }

    if (cfg.id === "blog" || cfg.id === "contato") {
      const blog = cfg.id === "blog";
      chapters.push(
        createChapter({
          id: cfg.id,
          label: cfg.label,
          top,
          len,
          altura: viewportH,
          lead: blog ? 0.6 : 0.55,
          surface: blog ? "papel" : "azul",
          at: () => (blog ? calcBlogStep(getStorySignals()) : calcContactStep(getStorySignals())),
        })
      );
      continue;
    }

    if (cfg.id === "fim") {
      chapters.push(
        createChapter({
          id: "fim",
          label: cfg.label,
          top,
          len,
          altura: viewportH,
          lead: 0.4,
          surface: "tinta",
          at: p => calcEndStep(p, getStorySignals()),
        })
      );
      continue;
    }

    chapters.push(
      createChapter({
        id: cfg.id,
        label: cfg.label,
        top,
        len,
        altura: viewportH,
        lead: cfg.id === "hero" ? 0 : 0.45,
        surface: surfaceName,
        at: () => ({
          k: cfg.id,
          stop: cfg.stop,
          state: cfg.state,
          after: cfg.after,
        }),
      })
    );
  }

  return chapters;
}
