import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { claimFirstVisit } from "./loader-flag";
import { waitForFirstPaint } from "./ready";

// Tempos da tela (decisões 29 e 36; prancha "Tela de carregamento"). O mínimo evita piscar e o
// máximo cobre rede ruim. Fora isso, a tela termina quando a página está pronta.
const MIN_MS = 600;
const MAX_MS = 1500;
const DONE_HOLD_MS = 400;
const FLIGHT_MS = 520;
const FADE_MS = 240;
const FLIGHT_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
// Corte do md do Tailwind: acima dele o Giro voa até a assinatura, abaixo até a barra de abas.
const DESKTOP_MIN_WIDTH = 768;
const LOADER_ATTR = "data-loader";

type Phase = "pending" | "loading" | "done" | "flying" | "fading" | "hidden";

// type e não interface: o animate do Framer só aceita objetos com assinatura de índice implícita.
type Flight = {
  x: number;
  y: number;
  scale: number;
};

const REST: Flight = { x: 0, y: 0, scale: 1 };

function flightTarget(): Element | null {
  if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
    return document.querySelector("[data-site-header] .g-signature__o .g-giro");
  }
  return document.querySelector(".g-tabbar__giro .g-giro");
}

/** Deslocamento e escala que levam o Giro da tela ao alvo. Null se algum dos dois não tem área. */
function measureFlight(from: Element, to: Element): Flight | null {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  if (a.width === 0 || b.width === 0) return null;
  return {
    x: b.left + b.width / 2 - (a.left + a.width / 2),
    y: b.top + b.height / 2 - (a.top + a.height / 2),
    scale: b.width / a.width,
  };
}

export function LoadingScreen() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("pending");
  const [face, setFace] = useState<GiroState>("loading");
  const [flight, setFlight] = useState<Flight>(REST);
  const giroRef = useRef<HTMLDivElement>(null);

  // Só a primeira visita da sessão mostra a tela. Sem a marca (ou com o storage bloqueado), o
  // overlay que o script inline pôs no <html> sai e a página aparece direto.
  useEffect(() => {
    if (!claimFirstVisit()) {
      setPhase("hidden");
      return;
    }
    document.documentElement.setAttribute(LOADER_ATTR, "mounted");
    setPhase("loading");
  }, []);

  useEffect(() => {
    if (phase === "hidden") document.documentElement.removeAttribute(LOADER_ATTR);
  }, [phase]);

  // Se a ilha sair da página no meio da tela, o atributo não pode ficar e prender o conteúdo.
  useEffect(() => {
    return () => document.documentElement.removeAttribute(LOADER_ATTR);
  }, []);

  // Espera o carregamento real, entre o mínimo e o máximo. Com movimento reduzido, termina só
  // com o fade.
  useEffect(() => {
    if (phase !== "loading") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let ready = false;
    let minElapsed = false;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      for (const timer of timers) clearTimeout(timer);
      if (reducedMotion) {
        setPhase("fading");
      } else {
        setFace("done");
        setPhase("done");
      }
    };

    timers.push(setTimeout(finish, MAX_MS));
    timers.push(
      setTimeout(() => {
        minElapsed = true;
        if (ready) finish();
      }, MIN_MS)
    );
    void waitForFirstPaint().then(() => {
      ready = true;
      if (minElapsed) finish();
    });

    return () => {
      finished = true;
      for (const timer of timers) clearTimeout(timer);
    };
  }, [phase, reducedMotion]);

  // Giro pronto (sorriso e pulo), um instante, e então voa até o alvo. Sem alvo, só o fade.
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => {
      const giro = giroRef.current;
      const target = flightTarget();
      const measured = giro && target ? measureFlight(giro, target) : null;
      if (measured) {
        setFlight(measured);
        setPhase("flying");
      } else {
        setPhase("fading");
      }
    }, DONE_HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // Ao pousar, o Giro vira a assinatura em repouso e a tela começa a sumir.
  useEffect(() => {
    if (phase !== "flying") return;
    const timer = setTimeout(() => {
      setFace("idle");
      setPhase("fading");
    }, FLIGHT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const timer = setTimeout(() => setPhase("hidden"), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <motion.div
      className="g-azul g-loader"
      role="status"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000 }}
    >
      <motion.div
        ref={giroRef}
        className="g-loader__giro"
        initial={false}
        animate={flight}
        transition={{ duration: FLIGHT_MS / 1000, ease: FLIGHT_EASE }}
      >
        <Giro state={face} signature={face === "idle"} hop={phase === "done"} />
      </motion.div>
      <span className="g-sr">{t(locale, "loader.label")}</span>
    </motion.div>
  );
}
