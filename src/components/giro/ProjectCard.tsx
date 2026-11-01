import { ArrowRight } from "lucide-react";
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

export function ProjectCard({ project, kicker, summary, ctaLabel, href }: ProjectCardProps) {
  return (
    <a className="g-project-card" href={href}>
      <div className="g-project-card__media">
        {project.image && <img src={project.image} alt="" loading="lazy" decoding="async" />}
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
