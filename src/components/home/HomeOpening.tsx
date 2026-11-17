import { useCallback, useEffect, useRef, useState } from "react";
import { Chip } from "@/components/giro/Chip";
import { Hero } from "@/components/hero/Hero";
import { StackPlates } from "@/components/hero/StackScene";
import {
  DESKTOP_STACK,
  layerHeights,
  layoutScale,
  MOBILE_STACK,
  stackOrigin,
} from "@/components/hero/stack";
import { stackLabelsFor } from "@/components/hero/stack-labels";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { StatesDemo } from "./StatesDemo";
import {
  calcStatesScript,
  clearDemoOverride,
  DEMO_ORDER,
  type DemoState,
  demoPress,
  calcScreenBeatTime,
  getDemoOverride,
  OPENING_TOTAL,
  setDemoOverride,
  setScreenBusy,
} from "./states-stage";
import { calcSceneProgress, createBeatPlayer } from "./story/beats";
import { type SceneBuilder, useChapterScenes } from "./story/useChapterScenes";

/** Altura das placas com a pilha fechada para virar tela, e onde cada uma fica na hero. */
const CLOSED = [2, 6, 10, 14];
const SPREAD = [
  [0, 0],
  [30, -30],
  [60, -60],
  [10, -6],
];
const DESKTOP_QUERY = "(min-width: 768px)";
/** Largura da tela da pilha, em px: a tela de exemplo é desenhada nessa escala. */
const SCREEN_W = 330;

/**
 * Abertura: a hero e o capítulo Estados no mesmo palco. A pilha da hero fecha, vira a tela de
 * exemplo e a tela mostra vazio, carregando, erro e pronto. Sem data-scenes é leitura em ordem:
 * a hero como sempre e os quatro estados lado a lado.
 */
export function HomeOpening() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [demo, setDemo] = useState<DemoState>("empty");
  const demoRef = useRef<DemoState>("empty");
  const timerRef = useRef<number | undefined>(undefined);
  const progressRef = useRef(0);

  const show = useCallback((state: DemoState) => {
    demoRef.current = state;
    setDemo(state);
  }, []);

  const stopTimer = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  // O que o visitante pediu vale até a próxima rolagem; o HomeGiro lê o mesmo pedido.
  const pick = useCallback(
    (state: DemoState) => {
      stopTimer();
      setDemoOverride(state);
      show(state);
    },
    [show, stopTimer]
  );

  const press = () => {
    const step = demoPress(demoRef.current);
    if (!step) return;
    pick(step.next);
    const later = step.later;
    if (later) {
      timerRef.current = window.setTimeout(() => {
        timerRef.current = undefined;
        pick(later.state);
      }, later.ms);
    }
  };

  // Rolar devolve a tela ao roteiro e cancela a troca que estivesse pendente.
  useEffect(() => {
    const onScroll = () => {
      stopTimer();
      clearDemoOverride();
      show(calcStatesScript(progressRef.current));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      stopTimer();
      clearDemoOverride();
    };
  }, [show, stopTimer]);

  const buildScene = useCallback<SceneBuilder>(
    ({ gsap, scene, setVars }) => {
      const sec = sectionRef.current;
      if (!sec) return;
      const q = (s: string) => sec.querySelector<HTMLElement>(s);
      const qa = (s: string) => [...sec.querySelectorAll<HTMLElement>(s)];
      const hero = q("section.hb");
      const iso = q(".ab-iso");
      const plates = qa(".ab-iso .hb-pl");
      const demoBox = q(".ab-demo");
      const text = q(".ab-st");
      const disc = q(".ab-disc");
      const exit = q(".ab-exit");
      const world = q(".ab-world");
      const outgoing = qa(".hb-copy, .hb-foot, .hb-top, .hb-hud");
      const faded = qa(".hb-line, .hb-floor-layer");
      if (!hero || !iso || plates.length !== 4 || !demoBox || !text || !disc || !exit || !world) {
        // Sem a cena o CSS do palco deixaria título e tela de exemplo escondidos para sempre.
        console.error("HomeOpening: palco incompleto, cena da abertura não montada");
        for (const el of [text, demoBox]) el?.style.setProperty("visibility", "visible");
        return;
      }

      // A pilha da cena parte exatamente da pose da hero em repouso (mesma origem, escala e
      // alturas), porque a troca entre as duas acontece sem o visitante ver.
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      const cfg = window.matchMedia(DESKTOP_QUERY).matches ? DESKTOP_STACK : MOBILE_STACK;
      const viewH = document.documentElement.clientHeight;
      const origin = stackOrigin(cfg, W, H, viewH);
      const k0 = cfg.k * layoutScale(cfg, W, viewH);
      const rest = layerHeights(cfg, [0, 0, 0, 0], [0, 0, 0, 0]);

      const cx = demoBox.offsetLeft + demoBox.offsetWidth / 2;
      const cy = demoBox.offsetTop + demoBox.offsetHeight / 2;
      const K = demoBox.offsetWidth / SCREEN_W;
      const stageW = sec.clientWidth;
      const radius =
        Math.hypot(Math.max(exit.offsetLeft, stageW - exit.offsetLeft), exit.offsetTop) + 40;

      // Toda variável animada ganha valor inicial: sem isso o GSAP parte de zero.
      setVars(iso, {
        "--ox": `${origin.x}px`,
        "--oy": `${origin.y}px`,
        "--k": k0,
        "--rx": "60deg",
        "--rz": "-45deg",
      });
      gsap.set(plates, {
        "--zr": (i: number) => `${rest[i]}px`,
        "--x": (i: number) => `${SPREAD[i][0]}px`,
        "--y": (i: number) => `${SPREAD[i][1]}px`,
        autoAlpha: 1,
      });
      gsap.set(disc, {
        "--dx": `${exit.offsetLeft}px`,
        "--dy": `${exit.offsetTop}px`,
        "--dr": "0px",
      });

      // A batida da tela toca no tempo: a rolagem só decide se a pilha está aberta ou virou tela.
      const beats = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
        onUpdate: () => setScreenBusy(beats.time() > 0.01),
      });
      beats
        .to(outgoing, { y: -H * 0.2, autoAlpha: 0, duration: 1.1 }, 0)
        .to(faded, { autoAlpha: 0, duration: 0.5 }, 0)
        .to(plates[3], { autoAlpha: 0, duration: 0.7 }, 0.1)
        .to(
          plates,
          {
            "--zr": (i: number) => `${CLOSED[i]}px`,
            "--x": "0px",
            "--y": "0px",
            duration: 1.3,
            ease: "power1.inOut",
          },
          0.1
        )
        .to(
          iso,
          {
            "--rx": "0deg",
            "--rz": "0deg",
            "--k": K,
            "--ox": `${cx}px`,
            "--oy": `${cy}px`,
            duration: 1.5,
            ease: "power2.inOut",
          },
          0.7
        )
        .fromTo(text, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.9)
        .to(world, { autoAlpha: 0, duration: 0.2 }, 2.2)
        .fromTo(demoBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 2.2);
      const player = createBeatPlayer(beats);
      let beatTime = 0;

      // Só o roteiro dos estados e a Passagem da saída seguem a rolagem.
      const tl = scene(sec, {
        onUpdate: (self: { progress: number }) => {
          progressRef.current = self.progress;
          const next = calcScreenBeatTime(self.progress);
          if (next !== beatTime) {
            beatTime = next;
            player.playTo(next);
          }
          // Com um pedido do visitante em curso, o roteiro espera a próxima rolagem.
          if (getDemoOverride() === null) show(calcStatesScript(self.progress));
        },
      });
      tl.to(disc, { "--dr": `${radius}px`, duration: 1, ease: "power2.in" }, 9).to(
        {},
        { duration: 0.01 },
        OPENING_TOTAL
      );

      progressRef.current = calcSceneProgress(sec.getBoundingClientRect(), window.innerHeight);
      // Montagem e remontagem (resize) começam já no ponto certo, sem tocar a cena de novo.
      beatTime = calcScreenBeatTime(progressRef.current);
      player.jumpTo(beatTime);
      setScreenBusy(beatTime > 0);
      show(calcStatesScript(progressRef.current));
      return () => {
        player.kill();
        setScreenBusy(false);
      };
    },
    [show]
  );

  useChapterScenes(buildScene, [], {
    scope: sectionRef,
    enabled: reducedMotion ? false : undefined,
  });

  return (
    <section className="ab g-azul" id="hero" ref={sectionRef}>
      <div className="ab-stage g-azul">
        <Hero />

        <div className="hb ab-world" aria-hidden="true">
          <div className="iso ab-iso">
            <StackPlates labels={stackLabelsFor(locale)} />
          </div>
        </div>

        <div className="ab-st">
          <p className="g-eyebrow">{t(locale, "story.states.label")}</p>
          <h2 className="ab-st__title">{t(locale, "story.states.title")}</h2>
          <p className="ab-st__lead">{t(locale, "story.states.lead")}</p>
          <fieldset className="ab-pills" aria-label={t(locale, "story.states.group")}>
            {DEMO_ORDER.map(name => (
              <Chip key={name} selected={demo === name} onClick={() => pick(name)}>
                {t(locale, `story.states.chip.${name}`)}
              </Chip>
            ))}
          </fieldset>
          <div className="ab-beats" aria-live="polite">
            {DEMO_ORDER.map(name => (
              <p key={name} className={`ab-beat${demo === name ? " is-on" : ""}`}>
                {t(locale, `story.states.beat.${name}`)}
              </p>
            ))}
          </div>
        </div>

        <div className="ab-demo">
          <StatesDemo locale={locale} state={demo} onPress={press} />
        </div>

        {/* Sem as cenas: os quatro estados lado a lado, só para ler. */}
        <ul className="ab-grid">
          {DEMO_ORDER.map(name => (
            <li key={name} className="ab-cell">
              <StatesDemo locale={locale} state={name} />
              <p className="ab-cell__beat">{t(locale, `story.states.beat.${name}`)}</p>
            </li>
          ))}
        </ul>

        {/* A saída fica sobre o disco de papel, que não é ancestral dela: declara a superfície. */}
        <i
          className="hs-stop ab-exit"
          data-stop="exit"
          data-size="64"
          data-surface="g-papel"
          aria-hidden="true"
        />
        <div className="hs-disc ab-disc g-papel" aria-hidden="true" />
      </div>
    </section>
  );
}
