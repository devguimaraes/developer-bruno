import { type CSSProperties, useCallback, useRef, useState } from "react";
import { PROCESS_STEPS } from "@/components/giro/process-data";
import { StackPlates } from "@/components/hero/StackScene";
import { stackLabelsFor } from "@/components/hero/stack-labels";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type TranslationKey, t } from "@/lib/i18n";
import {
  PROCESS_STATIONS,
  PROCESS_DISC,
  PROCESS_TOTAL,
  calcProcessScrollTop,
  calcProcessBeatTime,
  calcProcessDiscRadius,
  calcProcessMobileCamera,
  calcProcessStage,
} from "./process-stage";
import { SCENE_MOBILE_QUERY } from "./story/chapters";
import { createBeatPlayer } from "./story/beats";
import { type SceneBuilder, useChapterScenes } from "./story/useChapterScenes";

/** Notas da conversa: posição no chão da pilha e altura em que pousam. */
const NOTES: ReadonlyArray<{
  key: TranslationKey;
  x: number;
  y: number;
  z: number;
  /** Fase da flutuação, em segundos: cada nota sobe e desce no seu tempo. */
  delay: number;
}> = [
  { key: "process.scene.what", x: -210, y: -30, z: 70, delay: 0 },
  { key: "process.scene.who", x: 30, y: -190, z: 120, delay: -0.9 },
  { key: "process.scene.when", x: 160, y: 70, z: 90, delay: -1.7 },
];

/** Fração da tela em que o topo do capítulo precisa estar para a primeira etapa começar. */
const ENTER_AT = 0.45;

const CLOSED = [2, 6, 10, 30];
const OPENED = { desktop: [14, 150, 290, 410], mobile: [14, 112, 210, 300] };

function plateStyle(x: number, y: number, w: number, h: number, z: number): CSSProperties {
  return {
    "--x": `${x}px`,
    "--y": `${y}px`,
    "--w": `${w}px`,
    "--h": `${h}px`,
    "--r": "16px",
    "--zr": `${z}px`,
  } as CSSProperties;
}

function PlateEdges() {
  return (
    <>
      <i className="iso-pl__e" />
      <i className="iso-pl__e" />
      <i className="iso-pl__e" />
    </>
  );
}

/**
 * Processo: a pilha da hero sendo feita em quatro etapas (conversa, desenho, código, entrega),
 * escovada pela rolagem, com a linha de estações embaixo. Sem data-scenes é leitura em ordem.
 */
export function HomeProcess() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  const show = useCallback((i: number) => {
    if (stageRef.current === i) return;
    stageRef.current = i;
    setStage(i);
  }, []);

  const buildScene = useCallback<SceneBuilder>(
    ({ gsap, ScrollTrigger, scene, setVars }) => {
      const sec = sectionRef.current;
      if (!sec) return;
      const q = (s: string) => sec.querySelector<HTMLElement>(s);
      const qa = (s: string) => [...sec.querySelectorAll<HTMLElement>(s)];
      const iso = q(".pc-iso");
      const plates = qa(".pc-iso .hb-pl");
      const notes = qa(".pc-note");
      const code = q(".pc-code");
      const out = q(".pc-out");
      const paint = q(".pc-iso .hb-paint");
      const disc = q(".pc-disc");
      const fill = q(".pc-line__fill");
      if (!iso || plates.length !== 4 || !code || !out || !paint || !disc || !fill) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const mobile = window.matchMedia(SCENE_MOBILE_QUERY).matches;
      const origin = mobile ? calcProcessMobileCamera(W, H) : { x: W * 0.65, y: H * 0.62, k: 1 };
      const opened = mobile ? OPENED.mobile : OPENED.desktop;
      const place = mobile ? PROCESS_STATIONS.mobile : PROCESS_STATIONS.desktop;

      // Toda variável animada ganha valor inicial: sem isso o GSAP parte de zero.
      setVars(iso, {
        "--ox": `${origin.x}px`,
        "--oy": `${origin.y}px`,
        "--k": origin.k,
        "--rx": "60deg",
        "--rz": "-45deg",
      });
      gsap.set(plates, {
        "--zr": (i: number) => `${CLOSED[i]}px`,
        "--x": "0px",
        "--y": "0px",
        autoAlpha: 0,
      });
      gsap.set(notes, { autoAlpha: 0 });
      gsap.set(code, { autoAlpha: 0, "--zr": "260px" });
      gsap.set(out, { autoAlpha: 0 });
      gsap.set(paint, { clipPath: "inset(0 0 100% 0)" });
      setVars(disc, { "--dx": "50%", "--dy": "50%", "--dr": "0px" });

      // As batidas tocam no tempo, não na rolagem: a rolagem escolhe a etapa e a cena vai até o
      // ponto em que o desenho dela está completo, mesmo com a rolagem parada.
      const beats = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      beats
        .to(out, { autoAlpha: 1, duration: 0.2 }, 0)
        .fromTo(
          notes,
          { "--zr": "340px", autoAlpha: 0 },
          {
            "--zr": (i: number) => `${NOTES[i].z}px`,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          0.05
        )
        .to(notes, { "--zr": "420px", autoAlpha: 0, duration: 0.3, stagger: 0.05 }, 1)
        .to(plates[2], { autoAlpha: 1, duration: 0.3 }, 1.1)
        .to(out, { autoAlpha: 0, duration: 0.3 }, 1.3)
        .to(plates[0], { autoAlpha: 1, duration: 0.2 }, 1.5)
        .to(plates[1], { autoAlpha: 1, duration: 0.2 }, 1.7)
        .to(
          plates,
          { "--zr": (i: number) => `${opened[i]}px`, duration: 0.6, ease: "back.out(1.2)" },
          2.15
        )
        .to(plates[3], { autoAlpha: 1, duration: 0.3 }, 2.3)
        .to(code, { autoAlpha: 1, "--zr": "150px", duration: 0.5, ease: "power2.out" }, 2.3)
        .to(code, { autoAlpha: 0, duration: 0.3 }, 3.1)
        .to(
          plates,
          { "--zr": (i: number) => `${CLOSED[i]}px`, duration: 0.5, ease: "power2.inOut" },
          3.2
        )
        .to(paint, { clipPath: "inset(0 0 0% 0)", duration: 0.5 }, 3.45);

      // A cena é remontada a cada resize (no celular, a barra de endereço): começa já no ponto
      // da etapa atual, sem tocar tudo de novo. Só as trocas seguintes são animadas.
      let inView = sec.getBoundingClientRect().top < H * ENTER_AT;
      const player = createBeatPlayer(beats);
      const playTo = (stage: number) => player.playTo(calcProcessBeatTime(inView ? stage : -1));

      // Só a linha de estações e a troca de cor da saída seguem a rolagem.
      const tl = scene(sec, {
        onUpdate: (self: { progress: number }) => {
          const next = calcProcessStage(self.progress);
          if (next !== stageRef.current) playTo(next);
          show(next);
        },
      });
      tl.fromTo(fill, { scaleX: place[0] / 100 }, { scaleX: place[3] / 100, duration: 3.6 }, 0.2)
        .to(
          disc,
          {
            "--dr": `${calcProcessDiscRadius(W, H)}px`,
            duration: PROCESS_DISC.duration,
            ease: "power2.in",
          },
          PROCESS_DISC.at
        )
        .to({}, { duration: 0.01 }, PROCESS_TOTAL);

      // A primeira etapa começa quando o capítulo ocupa mais da metade da tela.
      const enter = ScrollTrigger.create({
        trigger: sec,
        start: `top ${ENTER_AT * 100}%`,
        onToggle: (self: { isActive: boolean; progress: number }) => {
          inView = self.isActive || self.progress > 0;
          playTo(stageRef.current);
        },
      });

      const current = calcProcessStage(tl.scrollTrigger?.progress ?? 0);
      // O gatilho pode ter disparado na criação e começado a perseguir a etapa antiga.
      player.jumpTo(calcProcessBeatTime(inView ? current : -1));
      show(current);
      return () => {
        enter.kill();
        player.kill();
      };
    },
    [show]
  );

  useChapterScenes(buildScene, [], {
    scope: sectionRef,
    enabled: reducedMotion ? false : undefined,
  });

  // Com as cenas, a rolagem decide a etapa; trocar antes faria o texto piscar no caminho.
  const goTo = (i: number) => {
    const sec = sectionRef.current;
    const scenes = document.documentElement.getAttribute("data-scenes") === "on";
    const len = sec ? sec.offsetHeight - window.innerHeight : 0;
    if (!sec || reducedMotion || !scenes || len <= 0) {
      show(i);
      return;
    }
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: calcProcessScrollTop(i, top, len), behavior: "smooth" });
  };

  const total = String(PROCESS_STEPS.length);

  return (
    <section className="pc-ch g-tinta" id="processo" aria-labelledby="pc-title" ref={sectionRef}>
      <div className="pc-stage">
        <div className="pc-head">
          <p className="g-eyebrow">{t(locale, "process.label")}</p>
          <h2 className="pc-title" id="pc-title">
            {t(locale, "process.title")}
          </h2>
          <p className="pc-intro">{t(locale, "process.intro")}</p>
        </div>

        <div className="hb pc-world" aria-hidden="true">
          <div className="iso pc-iso">
            <div className="pc-grid" />
            <div className="pc-out" />
            {NOTES.map(note => (
              <div
                key={note.key}
                className="iso-pl pc-note"
                style={
                  {
                    ...plateStyle(note.x, note.y, 190, 70, note.z),
                    "--float-delay": `${note.delay}s`,
                  } as CSSProperties
                }
              >
                <PlateEdges />
                <div className="iso-pl__face">
                  <span className="pc-note__t">{t(locale, note.key)}</span>
                </div>
              </div>
            ))}
            <div className="iso-pl pc-code" style={plateStyle(-300, 60, 230, 190, 150)}>
              <PlateEdges />
              <div className="iso-pl__face">
                <span className="pc-code__l pc-code__l--tag">{"<Interface"}</span>
                <span className="pc-code__l">{t(locale, "process.scene.state")}</span>
                <span className="pc-code__l">{t(locale, "process.scene.checks")}</span>
                <span className="pc-code__l pc-code__l--tag">{"/>"}</span>
                <span className="pc-code__ok">{t(locale, "process.scene.passed")}</span>
              </div>
            </div>
            <StackPlates labels={stackLabelsFor(locale)} />
          </div>
        </div>

        <div className="pc-copy">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.id} className={`pc-slot${stage === i ? " is-on" : ""}`}>
              <p className="pc-count">
                {t(locale, "process.counter")
                  .replace("{n}", String(step.number))
                  .replace("{total}", total)}
              </p>
              <h3 className="pc-name">{t(locale, step.nameKey)}</h3>
              <p className="pc-body">{t(locale, step.bodyKey)}</p>
              <p className="pc-get">
                <b>{t(locale, "process.deliverable_label")}</b> {t(locale, step.deliverableKey)}
              </p>
              <ul className="pc-tools">
                {step.groups.flatMap(group =>
                  group.tools.map(tool => <li key={tool.slug}>{tool.name}</li>)
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="pc-line">
          <div className="pc-line__rail" />
          <div className="pc-line__fill" />
          {PROCESS_STEPS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              className={`pc-st${i <= stage ? " is-past" : ""}`}
              aria-current={stage === i ? "step" : undefined}
              style={
                {
                  "--pd": `${PROCESS_STATIONS.desktop[i]}%`,
                  "--pm": `${PROCESS_STATIONS.mobile[i]}%`,
                } as CSSProperties
              }
              onClick={() => goTo(i)}
            >
              <i
                className="hs-stop pc-st__stop"
                data-stop={`pc${i}`}
                data-size="48"
                data-size-m="48"
                aria-hidden="true"
              />
              {t(locale, step.nameKey)}
            </button>
          ))}
        </div>

        <div className="hs-disc pc-disc g-azul" aria-hidden="true" />
      </div>
    </section>
  );
}
