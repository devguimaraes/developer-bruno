import { useEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Ilustrações isométricas dos serviços (CSS @keyframes + SMIL, sem JS). Saem de
// scripts/build-service-art.mjs já com escopo .sa-<nome>, então várias convivem na página.
// Cada uma vira um chunk próprio e só carrega quando chega perto da tela.
// `loop` é a duração do loop em segundos; `pose` é a fração do loop em que todas as camadas
// estão na tela, onde a arte entra e onde ela para com movimento reduzido.
const ART = {
  "sites-completos": {
    load: () => import("@/assets/service-art/sites-completos.svg?raw"),
    ratio: "438 / 267",
    loop: 16,
    pose: 0.5,
  },
  "landing-pages": {
    load: () => import("@/assets/service-art/landing-pages.svg?raw"),
    ratio: "431 / 301",
    loop: 8,
    pose: 0.39,
  },
  "product-ui": {
    load: () => import("@/assets/service-art/product-ui.svg?raw"),
    ratio: "422 / 280",
    loop: 12,
    pose: 0.5,
  },
  "full-stack": {
    load: () => import("@/assets/service-art/full-stack.svg?raw"),
    ratio: "362 / 321",
    loop: 14.4,
    pose: 0.4,
  },
  branding: {
    load: () => import("@/assets/service-art/branding.svg?raw"),
    ratio: "292 / 324",
    loop: 19.2,
    pose: 0.505,
  },
} as const;

export type ServiceArtName = keyof typeof ART;

// Quanto o Giro gira antes de a arte entrar, e o intervalo entre ele sorrir e a arte aparecer.
const LOADING_MS = 700;
const RESOLVE_MS = 350;

// As keyframes CSS e o SMIL andam no relógio do SVG: pausar só um deles desmontaria o desenho
// (as faces laterais em SMIL acompanham as placas em CSS).
function cssAnimations(svg: SVGSVGElement): Animation[] {
  return typeof svg.getAnimations === "function" ? svg.getAnimations({ subtree: true }) : [];
}

function seek(svg: SVGSVGElement, seconds: number) {
  svg.pauseAnimations();
  svg.setCurrentTime(seconds);
  for (const animation of cssAnimations(svg)) {
    animation.pause();
    animation.currentTime = seconds * 1000;
  }
}

function play(svg: SVGSVGElement) {
  const ms = svg.getCurrentTime() * 1000;
  for (const animation of cssAnimations(svg)) {
    animation.currentTime = ms;
    animation.play();
  }
  svg.unpauseAnimations();
}

function pause(svg: SVGSVGElement) {
  svg.pauseAnimations();
  const ms = svg.getCurrentTime() * 1000;
  for (const animation of cssAnimations(svg)) {
    animation.pause();
    animation.currentTime = ms;
  }
}

interface ServiceArtProps {
  name: ServiceArtName;
  /** Espera extra antes de a arte entrar, para os cards entrarem em cascata. */
  delay?: number;
}

/**
 * A arte entra como a interface carrega: o Giro gira no lugar dela, sorri e ela aparece já
 * montada. Depois fica em loop enquanto estiver na tela.
 */
export function ServiceArt({ name, delay = 0 }: ServiceArtProps) {
  // Os observadores olham a caixa (que já tem a proporção da arte); o SVG entra no host. O host
  // tem altura zero até o SVG chegar e, recortado pelo card, nunca contaria como visível.
  const boxRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);
  // Perto da tela: carrega. Na tela: a entrada começa e o loop toca. Com a folga de 200px no
  // play, o card vizinho animaria fora de vista e disputaria atenção com o da tela no celular.
  const [nearScreen, setNearScreen] = useState(false);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  // "error": a arte não veio; o Giro sai e o card fica só com o texto.
  const [phase, setPhase] = useState<"loading" | "done" | "ready" | "error">("loading");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const near = new IntersectionObserver(
      ([entry]) => setNearScreen(entry?.isIntersecting ?? false),
      { rootMargin: "200px" }
    );
    const visible = new IntersectionObserver(
      ([entry]) => {
        const isIn = entry?.isIntersecting ?? false;
        setInView(isIn);
        if (isIn) setSeen(true);
      },
      { threshold: 0.3 }
    );
    near.observe(box);
    visible.observe(box);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!nearScreen || svg) return;
    let cancelled = false;
    ART[name]
      .load()
      .then(module => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        const root = new DOMParser().parseFromString(
          module.default,
          "image/svg+xml"
        ).documentElement;
        if (!(root instanceof SVGSVGElement))
          throw new Error(`service art "${name}" is not an SVG`);
        const node = document.importNode(root, true);
        // O React não renderiza filhos aqui: o host é só o lugar onde o SVG entra.
        host.replaceChildren(node);
        // Parado na pose antes da primeira pintura; o loop começa quando a arte aparece.
        seek(node, ART[name].loop * ART[name].pose);
        setSvg(node);
      })
      .catch(error => {
        console.error("Failed to load service art:", error);
        if (!cancelled) setPhase("error");
      });
    return () => {
      cancelled = true;
    };
  }, [name, nearScreen, svg]);

  // A entrada roda uma vez, com a arte carregada e o card na tela.
  useEffect(() => {
    if (!svg || !seen) return;
    if (reducedMotion) {
      setPhase("ready");
      return;
    }
    const wait = LOADING_MS + delay;
    const done = window.setTimeout(() => setPhase("done"), wait);
    const ready = window.setTimeout(() => setPhase("ready"), wait + RESOLVE_MS);
    return () => {
      window.clearTimeout(done);
      window.clearTimeout(ready);
    };
  }, [svg, seen, reducedMotion, delay]);

  // Fora de vista e com movimento reduzido a arte fica parada. O CSS sozinho não pausa o SMIL.
  useEffect(() => {
    if (!svg || phase !== "ready") return;
    if (inView && !reducedMotion) play(svg);
    else if (reducedMotion) seek(svg, ART[name].loop * ART[name].pose);
    else pause(svg);
  }, [svg, phase, inView, reducedMotion, name]);

  return (
    <span
      ref={boxRef}
      className="service-art"
      data-ready={phase === "ready"}
      style={{ aspectRatio: ART[name].ratio }}
    >
      <span ref={hostRef} className="service-art__svg" />
      {phase !== "error" && (
        <span className="service-art__loading">
          <Giro state={phase === "loading" ? "loading" : "done"} size={48} />
        </span>
      )}
    </span>
  );
}
