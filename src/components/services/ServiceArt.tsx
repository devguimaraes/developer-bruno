import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Interfaces em camadas (CSS @keyframes, sem JS). Cada arquivo vira um chunk e só carrega
// perto da tela. `ratio` é largura / altura do palco.
const ART = {
  "sites-completos": {
    load: () => import("@/assets/service-art/sites-completos.html?raw"),
    ratio: 1.527,
  },
  "landing-pages": {
    load: () => import("@/assets/service-art/landing-pages.html?raw"),
    ratio: 1.528,
  },
  "product-ui": {
    load: () => import("@/assets/service-art/product-ui.html?raw"),
    ratio: 1.204,
  },
  "full-stack": {
    load: () => import("@/assets/service-art/full-stack.html?raw"),
    ratio: 0.927,
  },
  branding: {
    load: () => import("@/assets/service-art/branding.html?raw"),
    ratio: 1.42,
  },
} as const;

export type ServiceArtName = keyof typeof ART;

type ArtStyle = CSSProperties & { [name: `--${string}`]: string };

// O loop já corre em is-pre. Zerar na revelação faz a arte começar no primeiro passo.
function resetClocks(art: Element) {
  if (typeof art.getAnimations !== "function" || typeof CSSAnimation === "undefined") return;
  for (const animation of art.getAnimations({ subtree: true })) {
    if (animation instanceof CSSAnimation) animation.currentTime = 0;
  }
}

interface ServiceArtProps {
  name: ServiceArtName;
  /** Espera da cascata entre cards, em ms. Vira --cd nas placas. */
  delay?: number;
}

/**
 * A arte entra com as placas subindo. Fora da tela o loop pausa; com movimento reduzido
 * fica na pose montada.
 */
export function ServiceArt({ name, delay = 0 }: ServiceArtProps) {
  // Os observadores olham a caixa (que já tem a proporção). O host só recebe o fragmento
  // e tem altura zero até a arte chegar: observado ele, as artes fora da primeira dobra
  // não carregavam.
  const boxRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const [nearScreen, setNearScreen] = useState(false);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [failed, setFailed] = useState(false);
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
    if (!nearScreen || inserted) return;
    let cancelled = false;
    ART[name]
      .load()
      .then(module => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        // DOMParser com text/html manda o <style> para o <head> e o CSS da arte se perde.
        const fragment = document.createRange().createContextualFragment(module.default);
        host.replaceChildren(fragment);
        setInserted(true);
      })
      .catch(error => {
        console.error("Failed to load service art:", error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [name, nearScreen, inserted]);

  useEffect(() => {
    if (!inserted) return;
    const art = hostRef.current?.querySelector(".ar");
    if (!(art instanceof HTMLElement)) return;

    if (reducedMotion) {
      art.classList.remove("is-pre");
      art.classList.add("is-still");
      setRevealed(true);
    } else {
      art.classList.remove("is-still");
      if (seen && art.classList.contains("is-pre")) {
        resetClocks(art);
        art.classList.remove("is-pre");
        setRevealed(true);
      }
    }

    if (inView) art.classList.remove("is-paused");
    else art.classList.add("is-paused");
  }, [inserted, reducedMotion, seen, inView]);

  const ratio = ART[name].ratio;
  const style: ArtStyle = {
    "--ratio": String(ratio),
    "--cd": `${delay}ms`,
    aspectRatio: String(ratio),
  };

  return (
    <span
      ref={boxRef}
      className="service-art"
      data-ready={revealed}
      data-failed={failed || undefined}
      style={style}
    >
      <span ref={hostRef} className="service-art__host" />
    </span>
  );
}
