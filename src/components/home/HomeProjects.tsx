import { ArrowRight } from "lucide-react";
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { SectionHeader } from "@/components/giro/SectionHeader";
import { homeCases, type Project } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type Locale, t } from "@/lib/i18n";
import { bareLabel } from "./copy";
import { paintedBandIds } from "./painted-bands";

/** A capa entra com o anel ainda aberto. O papel espera 480ms e cresce por 1200ms. */
export const BAND_ARRIVE_MS = 980;
export const BAND_TYPE_MS = 620;
export const BAND_TYPE_DELAY_MS = 180;
/** O Giro some no centro quando a capa entra. O mesmo número está no CSS. */
export const BAND_GIRO_FADE_MS = 800;
export const BAND_SELECT_HOLD_MS = 1600;

const ENTER_RATIO = 0.33;
// 760px de conteúdo + 128px de padding da seção. Abaixo disso a faixa empilha.
const NARROW_VIEWPORT = "(max-width: 887px)";

type BandStyle = CSSProperties & { "--n": string };

type BandStatus = {
  painted: boolean;
  typing: boolean;
  loaded: boolean;
  selected: boolean;
  giro: GiroState;
  hop: boolean;
};

const waiting = (): BandStatus => ({
  painted: false,
  typing: false,
  loaded: false,
  selected: false,
  giro: "idle",
  hop: false,
});

const settled = (selected: boolean): BandStatus => ({
  painted: true,
  typing: false,
  loaded: true,
  selected,
  giro: "idle",
  hop: false,
});

function editorTag(title: string): string {
  const plain = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const name = plain
    .split(/[^A-Za-z0-9]+/)
    .filter(part => part.length > 0)
    .map(part => {
      if (part.length <= 3 && part === part.toUpperCase() && /[A-Z]/.test(part)) return part;
      const lower = part.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
  return `<${name} />`;
}

function systemReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function narrowViewport(): boolean {
  return window.matchMedia(NARROW_VIEWPORT).matches;
}

function loaderBlocking(): boolean {
  return document.documentElement.hasAttribute("data-loader");
}

function bandEntered(entry: IntersectionObserverEntry): boolean {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= ENTER_RATIO) return true;
  return entry.intersectionRect.height >= window.innerHeight * ENTER_RATIO;
}

function writeOrigin(band: HTMLElement, cover: HTMLElement) {
  const x = cover.offsetLeft + cover.offsetWidth / 2;
  const y = cover.offsetTop + cover.offsetHeight / 2;
  const width = band.offsetWidth;
  const height = band.offsetHeight;
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y)
  );
  band.style.setProperty("--ox", `${x}px`);
  band.style.setProperty("--oy", `${y}px`);
  band.style.setProperty("--r", `${Math.ceil(radius) + 40}px`);
}

type CaseBandProps = {
  project: Project;
  index: number;
  total: number;
  locale: Locale;
  reducedMotion: boolean;
};

function CaseBand({ project, index, total, locale, reducedMotion }: CaseBandProps) {
  const bandRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const [status, setStatus] = useState<BandStatus>(waiting);
  const label = project.label[locale];
  const count = String(total).padStart(2, "0");
  const position = String(index + 1).padStart(2, "0");
  const typedStyle = { "--n": String(Array.from(label).length) } as BandStyle;

  useLayoutEffect(() => {
    const band = bandRef.current;
    const cover = coverRef.current;
    if (!band || !cover) return;
    const measure = () => writeOrigin(band, cover);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(band);
    let alive = true;
    const fonts = document.fonts;
    if (fonts?.ready) {
      void fonts.ready.then(() => {
        if (alive) measure();
      });
    }
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const reduced = reducedMotion || systemReduced();
    if (!reduced && !paintedBandIds.has(project.id)) return;
    played.current = true;
    paintedBandIds.add(project.id);
    setStatus(settled(reduced && narrowViewport()));
  }, [project.id, reducedMotion]);

  useEffect(() => {
    if (played.current || reducedMotion || systemReduced()) return;
    const band = bandRef.current;
    if (!band) return;

    let seen = false;
    const timers: number[] = [];
    const clearTimers = () => {
      for (const timer of timers) window.clearTimeout(timer);
      timers.length = 0;
    };

    const begin = () => {
      if (played.current || !seen || loaderBlocking()) return;
      const cover = coverRef.current;
      if (cover) writeOrigin(band, cover);
      played.current = true;
      paintedBandIds.add(project.id);
      setStatus({
        painted: true,
        typing: true,
        loaded: false,
        selected: false,
        giro: "loading",
        hop: false,
      });
      timers.push(
        window.setTimeout(() => {
          setStatus(current => ({ ...current, typing: false }));
        }, BAND_TYPE_DELAY_MS + BAND_TYPE_MS)
      );
      timers.push(
        window.setTimeout(() => {
          setStatus(current => ({
            ...current,
            loaded: true,
            selected: true,
          }));
        }, BAND_ARRIVE_MS)
      );
      timers.push(
        window.setTimeout(() => {
          setStatus(current => ({ ...current, giro: "idle" }));
        }, BAND_ARRIVE_MS + BAND_GIRO_FADE_MS)
      );
      timers.push(
        window.setTimeout(() => {
          setStatus(current => ({ ...current, selected: false }));
        }, BAND_ARRIVE_MS + BAND_SELECT_HOLD_MS)
      );
    };

    const intersection = new IntersectionObserver(
      entries => {
        if (!entries.some(bandEntered)) return;
        seen = true;
        begin();
      },
      { threshold: [0, ENTER_RATIO] }
    );
    intersection.observe(band);

    const mutations = new MutationObserver(begin);
    mutations.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-loader"],
    });

    return () => {
      clearTimers();
      intersection.disconnect();
      mutations.disconnect();
    };
  }, [project.id, reducedMotion]);

  return (
    <article
      className="home-band"
      id={`home-band-${project.id}`}
      data-painted={status.painted ? "true" : "false"}
      data-typing={status.typing ? "true" : "false"}
      data-loaded={status.loaded ? "true" : "false"}
      data-selected={status.selected ? "true" : "false"}
      ref={bandRef}
    >
      <div className="home-band__wash" aria-hidden="true">
        <div className="home-band__disk home-band__disk--lima" />
        <div className="home-band__disk home-band__disk--to" />
      </div>
      <div className="home-band__head">
        <p className="home-band__label">
          <span className="home-band__index">
            {position}/{count}
          </span>
          <span className="home-band__typed" style={typedStyle}>
            {label}
          </span>
        </p>
        <h3 className="home-band__title">
          <a className="home-band__link" href={`/projetos/${project.slug}`}>
            {project.title}
          </a>
        </h3>
      </div>
      <div className="home-band__cover" ref={coverRef} aria-hidden="true">
        <div className="home-band__frame g-tinta">
          <img className="home-band__img" src={project.image} alt="" />
          <span className="home-band__giro">
            <Giro state={status.giro} hop={status.hop} />
          </span>
        </div>
        <span className="home-band__sel" aria-hidden="true">
          <span className="home-band__tag">{editorTag(project.title)}</span>
          <span className="home-band__handle home-band__handle--tl" />
          <span className="home-band__handle home-band__handle--tr" />
          <span className="home-band__handle home-band__handle--bl" />
          <span className="home-band__handle home-band__handle--br" />
        </span>
      </div>
      <div className="home-band__body">
        <p className="home-band__summary">{project.summary[locale]}</p>
        <ul className="home-band__tags" aria-label={t(locale, "projects.stack")}>
          {project.stack.map(item => (
            <li className="g-tag" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <span className="g-button home-band__cta" aria-hidden="true">
          {t(locale, "projects.card_link")}
          <ArrowRight className="g-icon g-button__arrow" />
        </span>
      </div>
    </article>
  );
}

/** Faixas da C2: cada case pinta uma vez, ao entrar na tela. */
export function HomeProjects() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();

  return (
    <div className="home-projects">
      <SectionHeader
        label={bareLabel(t(locale, "projects.label"))}
        title={t(locale, "projects.title")}
        lead={t(locale, "projects.intro")}
      />
      <div className="home-bands">
        {homeCases.map((project, index) => (
          <CaseBand
            key={project.id}
            project={project}
            index={index}
            total={homeCases.length}
            locale={locale}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}
