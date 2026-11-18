import { type CSSProperties, type RefObject, useEffect } from "react";
import { isBeatSnapActive } from "./beat-snap";
import { SCENE_MOBILE_QUERY } from "./chapters";

interface BeatSnapProps {
  /** O capítulo: o elemento rolado, com o palco preso dentro dele. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Paradas em progresso do capítulo (0 a 1). */
  points: readonly number[];
}

type MarkStyle = CSSProperties & { "--p": number };

/**
 * Paradas da rolagem do capítulo no celular. Cada ponto vira um marcador de scroll-snap com
 * `scroll-snap-stop: always`, então um gesto para na batida seguinte em vez de passar duas. O
 * snap só liga (html[data-beat-snap]) com o palco preso na tela. Os marcadores das pontas, uma
 * tela antes e no fim do capítulo, deixam o visitante sair dele sem ser puxado de volta.
 */
export function BeatSnap({ sectionRef, points }: BeatSnapProps) {
  useEffect(() => {
    const sec = sectionRef.current;
    const html = document.documentElement;
    if (!sec || html.dataset.scenes !== "on") return;
    const id = sec.id;
    // Só no celular: lá um gesto com embalo rola mais que uma batida e passava direto por ela.
    const mobile = window.matchMedia(SCENE_MOBILE_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const r = sec.getBoundingClientRect();
      if (mobile.matches && isBeatSnapActive(r.top, r.bottom)) {
        html.dataset.beatSnap = id;
      } else if (html.dataset.beatSnap === id) {
        delete html.dataset.beatSnap;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
      if (html.dataset.beatSnap === id) delete html.dataset.beatSnap;
    };
  }, [sectionRef]);

  return (
    <div className="beat-snap" aria-hidden="true">
      <i className="beat-snap__mark beat-snap__mark--before" />
      {points.map(p => (
        <i key={p} className="beat-snap__mark" style={{ "--p": p } as MarkStyle} />
      ))}
      <i className="beat-snap__mark beat-snap__mark--after" />
    </div>
  );
}
