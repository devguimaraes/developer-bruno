import { type FC, useEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setGiroOnStage } from "@/lib/giroOnStage";
import { type Chapter, type ChapterStep, chapterAt, progress } from "./chapters";
import {
  calcJumpArcHeight,
  calcJumpDuration,
  calcJumpSpin,
  calcTargetScale,
  calcTrajectory,
  detectSurface,
  readStopSize,
  type SurfaceClass,
} from "./giro-jump";
import { buildProvisionalChapters } from "./provisional-story";

// Marca no <html> que o Giro da home já tem dono: o hero e a pilha da abertura leem daqui.
const HAND_ATTR = "data-giro-hand";

export interface HomeGiroProps {
  /** Lista customizada de capítulos para testes ou injeção; padrão: seções provisórias do DOM */
  chapters?: readonly Chapter[];
  /** Parada inicial antes da primeira leitura do scroll */
  initialStop?: string;
  /** Callback disparado ao aterrissar em uma parada */
  onLand?: (step: ChapterStep) => void;
  /** Desativa o ator manualmente */
  disabled?: boolean;
  className?: string;
}

interface ActorFlight {
  x0: number;
  y0: number;
  t0: number;
  T: number;
  h: number;
  spin: number;
  r0: number;
}

interface ActorNext {
  cls: SurfaceClass;
  st: GiroState;
  step: ChapterStep;
}

interface ActorState {
  x: number;
  y: number;
  k: number;
  kT: number;
  tg: HTMLElement | null;
  fl: ActorFlight | null;
  roll: number;
  next: ActorNext | null;
}

export const HomeGiro: FC<HomeGiroProps> = ({
  chapters: customChapters,
  initialStop = "hero",
  onLand,
  disabled = false,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const actorRef = useRef<HTMLDivElement>(null);
  const actorInRef = useRef<HTMLDivElement>(null);

  const [giroState, setGiroState] = useState<GiroState>("done");
  const [surface, setSurface] = useState<SurfaceClass>("g-azul");

  // Guarda timers de transições atrasadas (ex: after: [[1600, "done"]])
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    // Com movimento reduzido ou desativado, o Giro não atravessa a home
    if (reducedMotion || disabled) return;

    const clearTimers = () => {
      timersRef.current.forEach(timerId => {
        window.clearTimeout(timerId);
      });
      timersRef.current = [];
    };

    setGiroOnStage(true);

    const actor = actorRef.current;
    const actorIn = actorInRef.current;
    if (!actor || !actorIn) return;

    let cancelled = false;
    let rafId: number;
    let chapters: Chapter[] = customChapters ? [...customChapters] : [];

    const updateChapters = () => {
      if (!customChapters) {
        chapters = buildProvisionalChapters();
      }
    };

    updateChapters();

    const A: ActorState = {
      x: -200,
      y: -200,
      k: 1,
      kT: 1,
      tg: null,
      fl: null,
      roll: 0,
      next: null,
    };

    let key = "";

    // Passagem de mão: com o HomeGiro em cena, o Giro da entrada (hero) fica inerte e sem rosto.
    const setHand = (handed: boolean) => {
      if (handed) document.documentElement.setAttribute(HAND_ATTR, "story");
      else document.documentElement.removeAttribute(HAND_ATTR);
    };

    const findStop = (stopName: string): HTMLElement | null => {
      return (
        document.querySelector<HTMLElement>(`[data-stop="${stopName}"]`) ||
        document.getElementById(stopName)
      );
    };

    const pos = (n: HTMLElement) => {
      const r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const land = () => {
      if (!A.next) return;
      actor.removeAttribute("data-hidden");
      setSurface(A.next.cls);
      if (actor) {
        actor.className = `hs-actor ${A.next.cls}`;
      }
      setGiroState(A.next.st);

      if (actorIn) {
        actorIn.classList.remove("is-squash");
        // Força reflow para disparar a animação novamente
        void actorIn.offsetWidth;
        actorIn.classList.add("is-squash");
      }

      onLand?.(A.next.step);

      if (A.next.step.after) {
        A.next.step.after.forEach(([ms, nextState]) => {
          const tId = window.setTimeout(() => {
            if (!cancelled) {
              setGiroState(nextState);
            }
          }, ms);
          timersRef.current.push(tId);
        });
      }
    };

    const go = (d: ChapterStep) => {
      const n = findStop(d.stop);
      if (!n) return;

      const surfCls = detectSurface(n);
      const isMobile = window.innerWidth < 768;
      const targetSize = readStopSize(n, isMobile);
      A.kT = calcTargetScale(targetSize);
      A.next = { cls: surfCls, st: d.state, step: d };
      A.tg = n;

      const p = pos(n);
      const hidden = d.hidden === true;
      actor.toggleAttribute("data-hidden", hidden);
      if (hidden) {
        // Escondido, o Giro só acompanha a parada, sem voar nem pousar: quem aparece é o da hero.
        A.fl = null;
        A.x = p.x;
        A.y = p.y;
        A.k = A.kT;
        clearTimers();
        actor.className = `hs-actor ${surfCls}`;
        setSurface(surfCls);
        setGiroState(d.state);
        return;
      }
      if (A.x < -100) {
        A.x = p.x;
        A.y = p.y;
        A.k = A.kT;
        land();
        return;
      }

      const dist = Math.hypot(p.x - A.x, p.y - A.y);
      if (dist < 2) {
        land();
        return;
      }

      A.fl = {
        x0: A.x,
        y0: A.y,
        t0: performance.now(),
        T: calcJumpDuration(dist),
        h: calcJumpArcHeight(dist, isMobile),
        spin: calcJumpSpin(dist),
        r0: A.roll,
      };

      clearTimers();
      setGiroState("idle");
    };

    const story = () => {
      if (chapters.length === 0) {
        updateChapters();
        if (chapters.length === 0) return;
      }

      const y = window.scrollY;
      const c = chapterAt(y, chapters);
      if (!c) return;

      const p = progress(y, c);
      const d = c.at(p);
      const nextKey = `${c.id}:${d.k}`;

      if (nextKey !== key) {
        key = nextKey;
        setHand(d.hidden !== true);
        go(d);
      }
    };

    // O Giro começa na estação do capítulo em que a página abriu (voltando de outra página, a
    // última estação), sem voar da hero. Sem capítulos ainda, parte da parada inicial.
    const startChapter = chapters.length > 0 ? chapterAt(window.scrollY, chapters) : undefined;
    const startStep = startChapter?.at(progress(window.scrollY, startChapter));
    if (startChapter && startStep && findStop(startStep.stop)) {
      key = `${startChapter.id}:${startStep.k}`;
      setHand(startStep.hidden !== true);
      go(startStep);
    } else {
      const initialEl = findStop(initialStop);
      if (initialEl) {
        const p = pos(initialEl);
        A.x = p.x;
        A.y = p.y;
        A.tg = initialEl;
        A.k = calcTargetScale(readStopSize(initialEl, window.innerWidth < 768));
        A.kT = A.k;
        const initialSurf = detectSurface(initialEl);
        A.next = {
          cls: initialSurf,
          st: "done",
          step: { k: "init", stop: initialStop, state: "done" },
        };
        land();
      }
    }

    const frame = (now: number) => {
      if (cancelled) return;

      story();

      if (A.tg) {
        const isMobile = window.innerWidth < 768;
        A.kT = calcTargetScale(readStopSize(A.tg, isMobile));
        const t = pos(A.tg);
        let x = t.x;
        let y = t.y;

        if (A.fl) {
          const f = A.fl;
          const u = Math.min(1, (now - f.t0) / f.T);
          const pt = calcTrajectory({ x: f.x0, y: f.y0 }, t, u, f.h);
          x = pt.x;
          y = pt.y;
          A.roll = f.r0 + f.spin * u;

          if (u >= 1) {
            A.fl = null;
            land();
          }
        }

        A.x = x;
        A.y = y;
        A.k += (A.kT - A.k) * 0.16;

        actor.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        actor.style.setProperty("--gk", A.k.toFixed(3));
        actor.style.setProperty("--roll", `${A.roll.toFixed(1)}deg`);
      }

      rafId = requestAnimationFrame(frame);
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!cancelled) {
          updateChapters();
        }
      }, 200);
    };

    let isRunning = !document.hidden;
    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(rafId);
      } else if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(frame);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (isRunning) {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelled = true;
      setHand(false);
      setGiroOnStage(false);
      clearTimers();
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [customChapters, initialStop, onLand, disabled, reducedMotion]);

  if (reducedMotion || disabled) {
    return null;
  }

  const containerClasses = ["home-giro-stage", className].filter(Boolean).join(" ");

  return (
    <div className={containerClasses} aria-hidden="true">
      {/* Nasce escondido: só aparece depois do primeiro passo, na parada certa. */}
      <div ref={actorRef} className={`hs-actor ${surface}`} data-hidden="">
        <div className="hs-actor__k">
          <div ref={actorInRef} className="hs-actor__in">
            <Giro state={giroState} />
          </div>
        </div>
      </div>
    </div>
  );
};
