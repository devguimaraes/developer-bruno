import { useRef, useState, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Giro } from "@/components/brand/Giro";
import type { Project } from "@/data/projects";

// Os campos que o card usa vêm do case. Capa e stack são ampliados aqui:
// a capa pode faltar (null) e a lista de tags não precisa ser uma tupla literal.
type CardCase = Pick<Project, "title"> & {
  readonly stack: readonly string[];
  readonly image: string | null;
};

export interface ProjectCardProps {
  project: CardCase;
  /** Categoria já no idioma da página, ex.: "Hub cultural · Méier, RJ". */
  kicker: string;
  /** Resumo já no idioma da página. */
  summary: string;
  /** Texto do link de ação, ex.: "Ver case". */
  ctaLabel: string;
  href: string;
}

// Alcance máximo do olhar do Giro (unidades do componente) e distância, em px,
// em que o olhar já chega ao limite.
const MAX_LOOK = 6;
const LOOK_REACH_PX = 48;

export function ProjectCard({ project, kicker, summary, ctaLabel, href }: ProjectCardProps) {
  const giroRef = useRef<HTMLSpanElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const giro = giroRef.current;
    if (!giro) return;
    const rect = giro.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance === 0) {
      setLook({ x: 0, y: 0 });
      return;
    }
    const reach = Math.min(MAX_LOOK, distance / LOOK_REACH_PX);
    setLook({ x: (dx / distance) * reach, y: (dy / distance) * reach });
  }

  return (
    <a
      className="g-project-card"
      href={href}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setLook({ x: 0, y: 0 })}
    >
      <div className="g-project-card__media">
        {project.image && (
          <>
            <img src={project.image} alt="" loading="lazy" decoding="async" />
            <span className="g-project-card__giro" ref={giroRef}>
              <Giro state="curious" look={look} />
            </span>
          </>
        )}
      </div>
      <div className="g-project-card__body">
        <span className="g-project-card__meta">{kicker}</span>
        <h3 className="g-project-card__title">{project.title}</h3>
        <p className="g-project-card__summary">{summary}</p>
        <div className="g-project-card__tags">
          {project.stack.map(tag => (
            <span className="g-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <span className="g-project-card__cta">
          {ctaLabel}
          <ArrowRight className="g-icon" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
