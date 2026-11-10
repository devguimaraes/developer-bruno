import type { GiroState } from "@/components/brand/giro-states";
import { type Chapter, createChapter } from "./chapters";
import { detectSurface } from "./giro-jump";

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
