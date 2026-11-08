import { ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/giro/SectionHeader";
import { StackLogo } from "@/components/giro/ToolLogo";
import { homeCases, type Project } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type Locale, t } from "@/lib/i18n";
import { bareLabel } from "./copy";
import { paintedBandIds } from "./painted-bands";

const ENTER_RATIO = 0.33;

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

function loaderBlocking(): boolean {
  return document.documentElement.hasAttribute("data-loader");
}

function bandEntered(entry: IntersectionObserverEntry): boolean {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= ENTER_RATIO) return true;
  return entry.intersectionRect.height >= window.innerHeight * ENTER_RATIO;
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
  const played = useRef(false);
  const [painted, setPainted] = useState(false);
  const label = project.label[locale];
  const count = String(total).padStart(2, "0");
  const position = String(index + 1).padStart(2, "0");

  useLayoutEffect(() => {
    if (!reducedMotion && !systemReduced() && !paintedBandIds.has(project.id)) return;
    played.current = true;
    paintedBandIds.add(project.id);
    setPainted(true);
  }, [project.id, reducedMotion]);

  useEffect(() => {
    if (played.current || reducedMotion || systemReduced()) return;
    const band = bandRef.current;
    if (!band) return;

    let seen = false;

    const begin = () => {
      if (played.current || !seen || loaderBlocking()) return;
      played.current = true;
      paintedBandIds.add(project.id);
      setPainted(true);
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
      intersection.disconnect();
      mutations.disconnect();
    };
  }, [project.id, reducedMotion]);

  return (
    <article
      className="home-band"
      id={`home-band-${project.id}`}
      data-painted={painted ? "true" : "false"}
      ref={bandRef}
    >
      <div className="home-band__head">
        <p className="home-band__label">
          <span className="home-band__index">
            {position}/{count}
          </span>
          <span>{label}</span>
        </p>
        <h3 className="home-band__title">
          <a className="home-band__link" href={`/projetos/${project.slug}`}>
            {project.title}
          </a>
        </h3>
      </div>
      <div className="home-band__cover" aria-hidden="true">
        <div className="home-band__frame g-tinta">
          <img className="home-band__img" src={project.image} alt="" />
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
              <StackLogo name={item} />
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

/** Faixas dos cases: cada uma entra uma vez, com fade e subida curta, ao aparecer na tela. */
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
