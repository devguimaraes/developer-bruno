import { ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { homeCases, outcomeSites } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { splitOutcome } from "./copy";
import {
  calcProjectBeatTime,
  PROJECT_ENTER,
  projectHost,
  projectSurface,
  projectTimeline,
} from "./project-stage";
import { SCENE_MOBILE_QUERY } from "./story/chapters";
import { createBeatPlayer } from "./story/beats";
import { type SceneBuilder, useChapterScenes } from "./story/useChapterScenes";

/**
 * Projetos em janelas: cada case entra como uma janela por cima da anterior e, no fim, a pilha
 * deita e os números dos outros sites aparecem ao lado. Sem data-scenes é leitura em ordem.
 */
export function HomeProjects() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const buildScene = useCallback<SceneBuilder>(({ gsap, scene, setVars }) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const q = (s: string) => sec.querySelector<HTMLElement>(s);
    const wins = [...sec.querySelectorAll<HTMLElement>(".pj")];
    const world = q(".pj-world");
    const big = q(".pj-big");
    const lead = q(".pj-lead");
    const out = q(".pj-out");
    const disc = q(".pj-disc");
    const exit = q(".pj-exit");
    if (!world || !big || !lead || !out || !disc || !exit || wins.length === 0) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const mobile = window.matchMedia(SCENE_MOBILE_QUERY).matches;
    const { t0, step, tTilt, total } = projectTimeline(wins.length);

    // O disco da passagem para tinta abre a partir da saída do Giro.
    const ex = exit.offsetLeft;
    const ey = exit.offsetTop;
    setVars(disc, { "--dx": `${ex}px`, "--dy": `${ey}px`, "--dr": "0px" });
    const radius = Math.hypot(Math.max(ex, W - ex), ey) + 40;

    // Sem valor inicial o GSAP parte de zero, e --wk é a escala: as janelas sumiriam na virada.
    setVars(world, { "--wk": 1, "--wrx": "0deg", "--wrz": "0deg", "--wx": "0px", "--wy": "0px" });
    gsap.set(wins, { y: H * 1.1, scale: 1, z: 0, visibility: "visible", "--dim": 0 });

    // As batidas tocam no tempo: cada janela entra inteira quando a rolagem chega nela, e a
    // virada em pilha também. A rolagem só escolhe a batida.
    const beats = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const player = createBeatPlayer(beats);
    let beatTime = 0;
    // O título abrindo, a paralaxe das capas e a Passagem da saída seguem a rolagem.
    const tl = scene(sec, {
      onUpdate: (self: { progress: number }) => {
        const next = calcProjectBeatTime(self.progress, wins.length);
        if (next !== beatTime) {
          beatTime = next;
          player.playTo(next);
        }
      },
    });
    tl.fromTo(big, { fontStretch: "50%" }, { fontStretch: "128%", duration: 1.1 }, 0);

    wins.forEach((win, i) => {
      const cover = win.querySelector(".pj-cover");
      const img = win.querySelector(".pj-cover img");
      const at = t0 + i * step;
      beats.to(win, { y: 0, duration: PROJECT_ENTER, ease: "power3.out" }, at);
      if (cover) {
        beats.fromTo(
          cover,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.5 },
          at + 0.05
        );
      }
      if (img) tl.fromTo(img, { yPercent: 6 }, { yPercent: -6, duration: step * 1.6 }, at);
      for (let j = 0; j < i; j += 1) {
        const n = i - j;
        beats.to(
          wins[j],
          {
            y: -12 * n,
            scale: 1 - 0.035 * n,
            "--dim": Math.min(0.5, 0.2 * n),
            duration: 0.9,
            ease: "power1.out",
          },
          at
        );
      }
    });

    beats.to([big, lead], { autoAlpha: 0, duration: 0.5 }, t0 + 0.2);

    const zGap = mobile ? 62 : 120;
    beats
      .to(
        wins,
        { y: 0, scale: 1, z: i => i * zGap, "--dim": 0, duration: 1.3, ease: "power2.inOut" },
        tTilt
      )
      .to(
        world,
        {
          "--wrx": "60deg",
          "--wrz": "-45deg",
          "--wk": mobile ? 0.5 : 0.46,
          "--wx": mobile ? "0px" : `${-W * 0.2}px`,
          "--wy": mobile ? `${-H * 0.21}px` : `${H * 0.05}px`,
          duration: 1.3,
          ease: "power2.inOut",
        },
        tTilt
      )
      .fromTo(out, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, tTilt + 1);
    tl.to(disc, { "--dr": `${radius}px`, duration: 1, ease: "power2.in" }, tTilt + 3).to(
      {},
      { duration: 0.01 },
      total
    );

    // Montagem e remontagem (resize) começam já na batida atual, sem tocar a cena de novo.
    beatTime = calcProjectBeatTime(tl.scrollTrigger?.progress ?? 0, wins.length);
    player.jumpTo(beatTime);
    return () => player.kill();
  }, []);

  useChapterScenes(buildScene, [], {
    scope: sectionRef,
    enabled: reducedMotion ? false : undefined,
  });

  const count = String(homeCases.length).padStart(2, "0");

  return (
    <section className="pj-ch g-papel" id="projetos" aria-labelledby="pj-title" ref={sectionRef}>
      <div className="pj-stage">
        <div className="pj-head">
          <h2 className="pj-big" id="pj-title">
            <span className="pj-big__in">
              {t(locale, "projects.title")}
              <i
                className="hs-stop pj-dot"
                data-stop="pj-dot"
                data-size="72"
                data-size-m="40"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="pj-lead">{t(locale, "projects.intro")}</p>
        </div>

        <div className="pj-world">
          {homeCases.map((project, i) => (
            <article
              key={project.id}
              className={`pj ${projectSurface(i)}`}
              aria-label={project.title}
            >
              <header className="pj-bar">
                <span className="pj-slot">
                  <i
                    className="hs-stop pj-slot__stop"
                    data-stop={`pj${i}`}
                    data-size="30"
                    data-size-m="30"
                    aria-hidden="true"
                  />
                </span>
                <span className="pj-url">{projectHost(project.live)}</span>
                <span className="pj-live">
                  <i aria-hidden="true" />
                  {t(locale, "case.page.facts.live")}
                </span>
                <span className="pj-n">
                  {String(i + 1).padStart(2, "0")}/{count}
                </span>
              </header>
              <div className="pj-body">
                <div className="pj-text">
                  <p className="g-eyebrow">{project.label[locale]}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary[locale]}</p>
                  <ul className="pj-stack" aria-label={t(locale, "projects.stack")}>
                    {project.stack.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a className="g-button" href={`/projetos/${project.slug}`}>
                    <span>{t(locale, "projects.card_link")}</span>
                    <span className="sr-only">{`: ${project.title}`}</span>
                    <ArrowRight className="g-icon g-button__arrow" aria-hidden="true" />
                  </a>
                </div>
                <figure className="pj-cover">
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={
                      project.coverPosition ? { objectPosition: project.coverPosition } : undefined
                    }
                  />
                </figure>
              </div>
            </article>
          ))}
        </div>

        <div className="pj-out">
          <p className="g-eyebrow pj-out__e">
            <i
              className="hs-stop pj-out__stop"
              data-stop="pj-out"
              data-size="44"
              data-size-m="44"
              aria-hidden="true"
            />
            {t(locale, "outcomes.label")}
          </p>
          {outcomeSites.map(site => {
            const parts = splitOutcome(site.summary[locale]);
            return (
              <a
                key={site.id}
                className="pj-stat"
                href={site.live}
                target="_blank"
                rel="noopener noreferrer"
                data-giro-wink=""
              >
                <strong>{parts.value}</strong>
                <span>
                  {parts.label}
                  <small>{`${site.title} · ${parts.source}`}</small>
                </span>
              </a>
            );
          })}
          <p className="pj-out__note">{t(locale, "outcomes.measured")}</p>
        </div>

        {/* A saída fica dentro do disco: o Giro pousa já na superfície de tinta. */}
        <div className="hs-disc pj-disc g-tinta" aria-hidden="true">
          <i
            className="hs-stop pj-exit"
            data-stop="pj-exit"
            data-size="56"
            data-size-m="56"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
