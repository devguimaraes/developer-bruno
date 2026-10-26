import { ProjectCard } from "@/components/giro/ProjectCard";
import { SectionHeader } from "@/components/giro/SectionHeader";
import { homeCases } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { bareLabel } from "./copy";

/** Cases da home, na ordem de homeCases. O primeiro (Estúdio Entre) ocupa a largura toda. */
export function HomeProjects() {
  const locale = useLocale();

  return (
    <div className="home-projects">
      <SectionHeader
        label={bareLabel(t(locale, "projects.label"))}
        title={t(locale, "projects.title")}
        lead={t(locale, "projects.intro")}
      />
      <div className="home-cases">
        {homeCases.map((project, index) => (
          <div
            key={project.id}
            className={index === 0 ? "home-cases__item home-cases__item--wide" : "home-cases__item"}
          >
            <ProjectCard
              project={project}
              kicker={project.kicker[locale]}
              summary={project.summary[locale]}
              ctaLabel={t(locale, "projects.card_link")}
              href={`/projetos/${project.slug}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
