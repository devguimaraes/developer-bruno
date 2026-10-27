import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import { ArrowLink, ButtonLink } from "@/components/giro/Button";
import { SectionHeader } from "@/components/giro/SectionHeader";
import { homeCases, type Project } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type TranslationKey, t } from "@/lib/i18n";
import { setPageGiro } from "@/lib/page-giro";

const SECTIONS = ["contexto", "problema", "solucao", "resultado"] as const;
type SectionId = (typeof SECTIONS)[number];

const SECTION_STATE = {
  contexto: "idle",
  problema: "error",
  solucao: "loading",
  resultado: "done",
} as const;

const RAIL_KEY = {
  contexto: "case.page.rail.context",
  problema: "case.page.rail.problem",
  solucao: "case.page.rail.solution",
  resultado: "case.page.rail.result",
} as const satisfies Record<SectionId, TranslationKey>;

const FACT_KEY = {
  role: "case.page.facts.role",
  stack: "case.page.facts.stack",
  live: "case.page.facts.live",
  code: "case.page.facts.code",
} as const satisfies Record<string, TranslationKey>;

type FactKey = keyof typeof FACT_KEY;

// Mesma curva de --ease-resolve (giro.css), igual ao SectionHeader.
const RESOLVE_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const RESOLVE = { duration: 0.4, ease: RESOLVE_EASE };

function isSectionId(value: string): value is SectionId {
  return (SECTIONS as readonly string[]).includes(value);
}

/** Host do site, ou dono/repo quando o link é do GitHub. */
function linkFact(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "github.com") return parsed.pathname.replace(/^\/|\/$/g, "");
    return parsed.host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface CaseStudyProps {
  project: Project;
}

export default function CaseStudy({ project }: CaseStudyProps) {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<SectionId>("contexto");
  const railRef = useRef<HTMLElement>(null);
  const railWrapRef = useRef<HTMLDivElement>(null);

  const caseIndex = homeCases.findIndex(item => item.slug === project.slug);
  const nextCase =
    caseIndex >= 0 && caseIndex < homeCases.length - 1 ? homeCases[caseIndex + 1] : null;
  const photo = project.bannerImage ?? project.image;
  const diagram = project.solution.diagram;
  const needs = project.problem.needs;
  const resultTitle = project.result.title;
  const resultText = project.result.text;
  const resultItems = project.result.items;
  const liveUrl = project.live;
  const githubUrl = project.github;

  const facts: { key: FactKey; value: string }[] = [
    { key: "role", value: project.role[locale] },
    { key: "stack", value: project.stack.join(" · ") },
  ];
  if (liveUrl) facts.push({ key: "live", value: linkFact(liveUrl) });
  if (githubUrl) facts.push({ key: "code", value: linkFact(githubUrl) });

  useEffect(() => {
    setPageGiro(SECTION_STATE[active]);
  }, [active]);

  useEffect(() => {
    return () => {
      setPageGiro(null);
    };
  }, []);

  useEffect(() => {
    const tops = new Map<SectionId, number>();
    let cancelled = false;
    const observer = new IntersectionObserver(
      entries => {
        if (cancelled) return;
        for (const entry of entries) {
          const id = entry.target.id;
          if (!isSectionId(id)) continue;
          if (entry.isIntersecting) tops.set(id, entry.boundingClientRect.top);
          else tops.delete(id);
        }
        const next = [...tops.entries()].sort((a, b) => a[1] - b[1])[0];
        if (!next) return;
        setActive(next[0]);
      },
      { rootMargin: "-15% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    for (const id of SECTIONS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // O main tem overflow-x: hidden, então sticky não acompanha a rolagem.
  // O trilho fica fixo na coluna enquanto o miolo do case está na tela.
  useEffect(() => {
    const rail = railRef.current;
    const wrap = railWrapRef.current;
    if (!rail || !wrap) return;

    const place = () => {
      const column = wrap.getBoundingClientRect();
      const body = wrap.parentElement?.getBoundingClientRect();
      if (!body || column.width === 0) {
        rail.style.position = "";
        rail.style.top = "";
        rail.style.left = "";
        rail.style.width = "";
        rail.style.visibility = "";
        rail.style.zIndex = "";
        return;
      }
      const top = 96;
      // Só fica visível quando o miolo encosta na linha do trilho, senão cobre a foto.
      const inRange = body.top <= top && body.bottom > top + rail.offsetHeight + 24;
      rail.style.position = "fixed";
      rail.style.top = `${top}px`;
      rail.style.left = `${column.left}px`;
      rail.style.width = `${column.width}px`;
      rail.style.zIndex = "2";
      rail.style.visibility = inRange ? "visible" : "hidden";
    };

    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    const resize = new ResizeObserver(place);
    resize.observe(wrap);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      resize.disconnect();
    };
  }, []);

  return (
    <article className="case-page g-papel">
      <div className="case-page__inner">
        <header className="case-hero">
          <ArrowLink href="/#projetos" back>
            <span className="case-back__desktop">{t(locale, "case.page.back")}</span>
            <span className="case-back__mobile">{t(locale, "case.page.back_mobile")}</span>
          </ArrowLink>
          <p className="g-eyebrow">{project.label[locale]}</p>
          <motion.h1
            className="case-hero__title"
            initial={reducedMotion ? false : { fontStretch: "50%" }}
            animate={reducedMotion ? undefined : { fontStretch: "115%" }}
            transition={RESOLVE}
          >
            {project.title}
          </motion.h1>
          <p className="case-hero__summary">{project.summary[locale]}</p>
          <dl className="case-facts">
            {facts.map(fact => (
              <div key={fact.key}>
                <dt>{t(locale, FACT_KEY[fact.key])}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <figure className="case-hero__photo">
            {/* React 18 não repassa fetchPriority. O atributo em minúsculo entra no HTML. */}
            <img src={photo} alt={project.title} decoding="async" {...{ fetchpriority: "high" }} />
          </figure>
        </header>

        <div className="case-body">
          <div className="case-rail-wrap" ref={railWrapRef}>
            <nav
              className="case-rail"
              aria-label={t(locale, "case.page.steps_label")}
              ref={railRef}
            >
              <div className="case-rail__giro" aria-hidden="true">
                <Giro state={SECTION_STATE[active]} size={56} />
              </div>
              <ol className="case-rail__list">
                {SECTIONS.map(id => (
                  <li key={id}>
                    <a
                      className="case-rail__link"
                      href={`#${id}`}
                      aria-current={active === id ? "true" : undefined}
                    >
                      <span className="case-rail__mark" aria-hidden="true" />
                      {t(locale, RAIL_KEY[id])}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="case-main">
            <section id="contexto" className="case-section">
              <SectionHeader
                label={t(locale, RAIL_KEY.contexto)}
                title={project.context.title[locale]}
              />
              <p className="case-copy">{project.context.text[locale]}</p>
            </section>

            <section id="problema" className="case-section">
              <SectionHeader
                label={t(locale, RAIL_KEY.problema)}
                title={project.problem.title[locale]}
              />
              <p className="case-copy">{project.problem.text[locale]}</p>
              {needs && (
                <div className="case-needs">
                  <p className="case-needs__label">{t(locale, "case.page.problem_list_label")}</p>
                  <ul className="case-list">
                    {needs[locale].map(need => (
                      <li key={need}>{need}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section id="solucao" className="case-section">
              <SectionHeader
                label={t(locale, RAIL_KEY.solucao)}
                title={project.solution.title[locale]}
              />
              <p className="case-copy">{project.solution.text[locale]}</p>
              {diagram && (
                <figure className="case-metro">
                  {/* role + name, sem ícone. ProcessNode é um botão de etapa da home. */}
                  <ol className="case-branch">
                    {diagram.stations.map(station => (
                      <li
                        key={`${station.role.pt}-${station.name.pt}`}
                        className="case-branch__station"
                      >
                        <span className="case-branch__role">{station.role[locale]}</span>
                        <span className="case-branch__name">{station.name[locale]}</span>
                      </li>
                    ))}
                  </ol>
                  <figcaption className="case-metro__caption">{diagram.label[locale]}</figcaption>
                </figure>
              )}
              {project.screenshots.length > 0 && (
                <ul className="case-shots">
                  {project.screenshots.map(shot => (
                    <li key={shot.src}>
                      <figure className="case-shot">
                        <img
                          src={shot.src}
                          alt={shot.alt[locale]}
                          loading="lazy"
                          decoding="async"
                        />
                        {shot.caption ? <figcaption>{shot.caption[locale]}</figcaption> : null}
                      </figure>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section id="resultado" className="case-section">
              {resultTitle ? (
                <SectionHeader label={t(locale, RAIL_KEY.resultado)} title={resultTitle[locale]} />
              ) : (
                <p className="g-eyebrow">{`// ${t(locale, RAIL_KEY.resultado)}`}</p>
              )}
              {resultText && <p className="case-copy">{resultText[locale]}</p>}
              {resultItems && (
                <ul className="case-list">
                  {resultItems[locale].map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>

            <div className="case-end">
              {(liveUrl || githubUrl) && (
                <div className="case-actions">
                  {liveUrl && (
                    <ButtonLink href={liveUrl} target="_blank" rel="noreferrer" arrow>
                      {t(locale, "case.page.cta_live")}
                    </ButtonLink>
                  )}
                  {githubUrl && (
                    <ButtonLink
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="secondary"
                      arrow
                    >
                      {t(locale, "case.page.cta_code")}
                    </ButtonLink>
                  )}
                </div>
              )}
              {nextCase && (
                <a className="case-next" href={`/projetos/${nextCase.slug}`}>
                  <span className="g-eyebrow">{t(locale, "case.page.next_label")}</span>
                  <span className="case-next__title">{nextCase.title}</span>
                  <span className="case-next__kicker">{nextCase.kicker[locale]}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
