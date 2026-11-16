import { type FC, useEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setGiroOnStage } from "@/lib/giroOnStage";
import { type Chapter, type ChapterStep, chapterAt, progress } from "./chapters";
import {
  calcArcLift,
  calcFlightOmega,
  calcJumpArcHeight,
  calcJumpDuration,
  calcJumpSpin,
  calcStretch,
  calcTargetScale,
  detectSurface,
  MAX_FRAME,
  readStopSize,
  type SpringAxis,
  type SurfaceClass,
  stepSpring,
} from "./giro-jump";
import { buildProvisionalChapters } from "./provisional-story";

// Marca no <html> que o Giro da home já tem dono: o hero e a pilha da abertura leem daqui.
const HAND_ATTR = "data-giro-hand";
// Marca no <html> a parada em que o Giro já pousou (limpa enquanto ele está no ar entre paradas).
const STOP_ATTR = "data-giro-stop";

/** Mola do Giro parado na estação: segue a parada com um pouco de atraso e assenta macio. */
const GROUND_OMEGA = 38;
const GROUND_ZETA = 0.78;
/**
 * Parado numa estação que anda na tela (seção que rola, janela escovada), o Giro acompanha esta
 * fração do deslocamento dela na hora; a mola cuida só do resto. Sem isso ele ficaria dezenas de
 * px atrás do assento e esticaria a cada rolagem.
 */
const GROUND_FOLLOW = 0.88;
/** No voo a mola ultrapassa um pouco o alvo antes de assentar. */
const FLIGHT_ZETA = 0.82;
/** Flutuação em repouso, em px na escala 1, e o período dela em ms. */
const BOB_AMP = 2;
const BOB_PERIOD = 2800;

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
  t0: number;
  T: number;
  h: number;
  /** A superfície nova já foi aplicada (acontece no meio do voo). */
  dressed: boolean;
}

interface ActorNext {
  cls: SurfaceClass;
  st: GiroState;
  step: ChapterStep;
}

interface ActorState {
  /** Posição e velocidade no chão (sem o arco do salto), uma mola por eixo. */
  px: SpringAxis;
  py: SpringAxis;
  /** Giro do corpo: a mola persegue rollT, que cresce a cada salto. */
  roll: SpringAxis;
  rollT: number;
  /** Altura do arco agora e a que sobrou de um salto interrompido. */
  lift: number;
  carry: number;
  /** Quanto está em repouso (0 a 1): liga a flutuação aos poucos. */
  rest: number;
  placed: boolean;
  last: number;
  /** Onde a parada estava no quadro anterior, para saber quanto ela andou. */
  seen: { x: number; y: number } | null;
  k: number;
  kT: number;
  tg: HTMLElement | null;
  fl: ActorFlight | null;
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
      px: { x: 0, v: 0 },
      py: { x: 0, v: 0 },
      roll: { x: 0, v: 0 },
      rollT: 0,
      lift: 0,
      carry: 0,
      rest: 0,
      placed: false,
      last: 0,
      seen: null,
      k: 1,
      kT: 1,
      tg: null,
      fl: null,
      next: null,
    };

    // Coloca o Giro direto num ponto, sem voo nem velocidade.
    const place = (p: { x: number; y: number }) => {
      A.px = { x: p.x, v: 0 };
      A.py = { x: p.y, v: 0 };
      A.lift = 0;
      A.carry = 0;
      A.k = A.kT;
      A.placed = true;
    };

    // Toca de novo uma animação curta do corpo (impulso na saída, amassada no pouso, pulo no lugar).
    const kick = (name: "is-squash" | "is-leap" | "is-hop") => {
      actorIn.classList.remove("is-squash", "is-leap", "is-hop");
      // Força reflow para a animação recomeçar
      void actorIn.offsetWidth;
      actorIn.classList.add(name);
    };

    // Veste a superfície do destino: cor do traço e do miolo.
    const dress = (cls: SurfaceClass) => {
      actor.className = `hs-actor ${cls}`;
      setSurface(cls);
    };

    let key = "";

    // Passagem de mão: com o HomeGiro em cena, o Giro da entrada (hero) fica inerte e sem rosto.
    const setHand = (handed: boolean) => {
      // Só há passagem de mão com as cenas ligadas; sem elas o Giro da hero fica onde está.
      const scenes = document.documentElement.getAttribute("data-scenes") === "on";
      if (handed && scenes) document.documentElement.setAttribute(HAND_ATTR, "story");
      else document.documentElement.removeAttribute(HAND_ATTR);
    };

    const setLandedStop = (stop: string | null) => {
      if (stop) document.documentElement.setAttribute(STOP_ATTR, stop);
      else document.documentElement.removeAttribute(STOP_ATTR);
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

    // quiet: o Giro já estava nesta parada (só muda rosto ou superfície), então não amassa.
    const land = (quiet = false) => {
      if (!A.next) return;
      actor.removeAttribute("data-hidden");
      dress(A.next.cls);
      setGiroState(A.next.st);
      setLandedStop(A.next.step.stop);
      if (!quiet) kick("is-squash");
      else if (A.next.step.hop) kick("is-hop");

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
      // Assume o Giro só depois de achar a parada: sem ela, o da hero continua visível.
      setHand(d.hidden !== true);

      const surfCls = d.surface ?? detectSurface(n);
      const isMobile = window.innerWidth < 768;
      const targetSize = readStopSize(n, isMobile);
      A.kT = calcTargetScale(targetSize);
      A.next = { cls: surfCls, st: d.state, step: d };
      const sameStop = A.tg === n && !A.fl && !actor.hasAttribute("data-hidden");
      if (A.tg !== n) A.seen = null;
      A.tg = n;

      const p = pos(n);
      const hidden = d.hidden === true;
      actor.toggleAttribute("data-hidden", hidden);
      if (!sameStop) setLandedStop(null);
      if (hidden) {
        // Escondido, o Giro só acompanha a parada, sem voar nem pousar: quem aparece é o da hero.
        setLandedStop(null);
        A.fl = null;
        place(p);
        clearTimers();
        dress(surfCls);
        setGiroState(d.state);
        return;
      }
      if (!A.placed) {
        place(p);
        land();
        return;
      }

      // Mesma parada, só muda rosto ou superfície: não salta, mesmo que a mola esteja alguns
      // px atrás dela por causa da rolagem.
      const dist = Math.hypot(p.x - A.px.x, p.y - A.py.x);
      if (sameStop || dist < 2) {
        A.fl = null;
        A.lift = 0;
        clearTimers();
        land(sameStop);
        return;
      }

      // Salto interrompido: a altura que ele tinha desce aos poucos por baixo do arco novo, e a
      // velocidade segue na mola. Assim rolar rápido emenda os saltos em vez de recomeçar parado.
      A.carry += A.lift;
      A.lift = 0;
      A.rollT += calcJumpSpin(dist) * Math.sign(p.x - A.px.x || 1);
      A.fl = {
        t0: performance.now(),
        T: calcJumpDuration(dist),
        h: calcJumpArcHeight(dist, isMobile),
        dressed: false,
      };

      clearTimers();
      setGiroState("idle");
      kick("is-leap");
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
        go(d);
      }
    };

    // O Giro começa na estação do capítulo em que a página abriu (voltando de outra página, a
    // última estação), sem voar da hero. Sem capítulos ainda, parte da parada inicial.
    const startChapter = chapters.length > 0 ? chapterAt(window.scrollY, chapters) : undefined;
    const startStep = startChapter?.at(progress(window.scrollY, startChapter));
    if (startChapter && startStep && findStop(startStep.stop)) {
      key = `${startChapter.id}:${startStep.k}`;
      go(startStep);
    } else {
      const initialEl = findStop(initialStop);
      if (initialEl) {
        A.tg = initialEl;
        A.kT = calcTargetScale(readStopSize(initialEl, window.innerWidth < 768));
        place(pos(initialEl));
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

      const dt = A.last === 0 ? 1 / 60 : Math.min(MAX_FRAME, Math.max(0, (now - A.last) / 1000));
      A.last = now;

      // Parada fora do DOM (capítulo remontado) mede 0,0: o Giro espera onde está.
      if (A.tg?.isConnected) {
        const isMobile = window.innerWidth < 768;
        A.kT = calcTargetScale(readStopSize(A.tg, isMobile));
        const t = pos(A.tg);
        const liftBefore = A.lift + A.carry;
        let omega = GROUND_OMEGA;
        let zeta = GROUND_ZETA;

        if (A.fl) {
          const f = A.fl;
          const u = Math.min(1, (now - f.t0) / f.T);
          omega = calcFlightOmega(f.T);
          zeta = FLIGHT_ZETA;
          A.lift = calcArcLift(u, f.h);

          // No meio do voo o Giro já veste a superfície de destino: a cor troca no ar, com
          // transição, em vez de pousar com o miolo da superfície de onde saiu.
          if (!f.dressed && u >= 0.5 && A.next) {
            f.dressed = true;
            dress(A.next.cls);
          }
          if (u >= 1) {
            A.fl = null;
            A.lift = 0;
            land();
          }
        }

        // No chão ele anda junto com a parada; no ar a mola é que o leva até ela.
        if (A.seen && !A.fl) {
          A.px.x += (t.x - A.seen.x) * GROUND_FOLLOW;
          A.py.x += (t.y - A.seen.y) * GROUND_FOLLOW;
        }
        A.seen = t;

        A.carry *= Math.exp(-dt * 12);
        A.px = stepSpring(A.px, t.x, omega, zeta, dt);
        A.py = stepSpring(A.py, t.y, omega, zeta, dt);
        A.roll = stepSpring(A.roll, A.rollT, omega, 1, dt);
        A.k += (A.kT - A.k) * (1 - Math.exp(-dt * 10));

        const lift = A.lift + A.carry;
        const vy = A.py.v - (dt > 0 ? (lift - liftBefore) / dt : 0);
        const stretch = calcStretch(A.px.v, vy);

        // Em repouso ele flutua de leve; qualquer movimento desliga a flutuação.
        const still = !A.fl && Math.hypot(A.px.v, A.py.v) < 40;
        A.rest += ((still ? 1 : 0) - A.rest) * (1 - Math.exp(-dt * (still ? 3 : 14)));
        const bob = Math.sin((now / BOB_PERIOD) * Math.PI * 2) * BOB_AMP * A.k * A.rest;

        const x = A.px.x;
        const y = A.py.x - lift + bob;

        actor.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        actor.style.setProperty("--gk", A.k.toFixed(3));
        actor.style.setProperty("--roll", `${A.roll.x.toFixed(1)}deg`);
        actor.style.setProperty("--va", `${stretch.angle.toFixed(1)}deg`);
        actor.style.setProperty("--st", stretch.amount.toFixed(3));
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
      setLandedStop(null);
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
