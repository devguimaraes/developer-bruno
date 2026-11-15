import {
  Accessibility,
  Code,
  ListChecks,
  type LucideIcon,
  Plug,
  Rocket,
  Users,
} from "lucide-react";
import { ContributionCalendar } from "@/components/about/ContributionCalendar";
import { FlickeringGrid } from "@/components/about/FlickeringGrid";
import { Giro } from "@/components/brand/Giro";
import { ArrowLink, ButtonLink } from "@/components/giro/Button";
import { CopyButton } from "@/components/giro/CopyButton";
import { ProjectCard } from "@/components/giro/ProjectCard";
import { ToolLogo } from "@/components/giro/ToolLogo";
import { contactData } from "@/config/site";
import { type CareerEntry, education, experience, stack } from "@/data/about";
import { homeCases } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import type { ContributionCalendar as CalendarData } from "@/lib/github/contributions";
import { formatDate, type Locale, type TranslationKey, t } from "@/lib/i18n";

/** Post já lido do content collection pela página (sobre.astro). */
export interface AboutPost {
  slug: string;
  title: string;
  /** Data ISO, AAAA-MM-DD. */
  date: string;
  /** Primeira tag do post. */
  category: string;
  /** Minutos de leitura. */
  readTime: number;
}

export interface AboutPageProps {
  posts: AboutPost[];
  /** Null quando o build não conseguiu buscar o calendário. */
  contributions: CalendarData | null;
}

// As mesmas seis capacidades do capítulo Sobre da home, com o ícone de cada linha.
const CAPABILITIES: readonly { key: TranslationKey; icon: LucideIcon }[] = [
  { key: "about.capability.development", icon: Code },
  { key: "about.capability.apis", icon: Plug },
  { key: "about.capability.deploy", icon: Rocket },
  { key: "about.capability.a11y", icon: Accessibility },
  { key: "about.capability.practices", icon: ListChecks },
  { key: "about.capability.collaboration", icon: Users },
];

const FACTS: readonly { value: TranslationKey; label: TranslationKey }[] = [
  { value: "aboutpage.fact.experience_value", label: "aboutpage.fact.experience_label" },
  { value: "about.fact.education_value", label: "about.fact.education_label" },
  { value: "aboutpage.fact.location_value", label: "aboutpage.fact.location_label" },
];

/** Data ISO lida como UTC, para o dia não mudar com o fuso. */
function dateFromIso(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function CareerList({ entries, locale }: { entries: readonly CareerEntry[]; locale: Locale }) {
  return (
    <ul className="sobre-career">
      {entries.map(entry => (
        <li key={entry.id} className="sobre-career__row">
          {entry.logo ? (
            <img
              className="sobre-career__logo"
              src={entry.logo}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="sobre-career__logo sobre-career__logo--initials" aria-hidden="true">
              {entry.initials}
            </span>
          )}
          <span className="sobre-career__text">
            <span className="sobre-career__name">{entry.name}</span>
            <span className="sobre-career__role">{entry.role[locale]}</span>
          </span>
          <span className="sobre-career__period">{entry.period[locale]}</span>
        </li>
      ))}
    </ul>
  );
}

/** Página Sobre (/sobre, issue #129): histórico, stack, projetos, blog e contato em coluna estreita. */
export default function AboutPage({ posts, contributions }: AboutPageProps) {
  const locale = useLocale();
  // Os posts estão só em português: em inglês, cada linha avisa.
  const languageNote = t(locale, "posts.card_language_note");

  return (
    <div className="sobre-page g-papel">
      <FlickeringGrid className="sobre-page__grid" />
      <div className="sobre-page__inner">
        <section className="sobre-hero" aria-labelledby="sobre-pagina-titulo">
          <div className="sobre-hero__text">
            <p className="g-eyebrow">{t(locale, "aboutpage.eyebrow")}</p>
            <h1 className="sobre-hero__title" id="sobre-pagina-titulo">
              {t(locale, "aboutpage.title")}
            </h1>
            <p className="sobre-hero__lead">{t(locale, "aboutpage.lead")}</p>
          </div>
          <div className="sobre-hero__avatar">
            <img
              src="/brunoGuimaraes.webp"
              alt={t(locale, "about.photo_alt")}
              width={192}
              height={192}
              decoding="async"
            />
            <span className="sobre-hero__badge" aria-hidden="true">
              <Giro size={38} />
            </span>
          </div>
        </section>

        <section className="sobre-block" aria-labelledby="sobre-pagina-bio">
          <h2 className="sobre-block__title" id="sobre-pagina-bio">
            {t(locale, "aboutpage.about_heading")}
          </h2>
          <p className="sobre-block__text">{t(locale, "aboutpage.bio")}</p>
          <dl className="sobre-facts">
            {FACTS.map(fact => (
              <div key={fact.value}>
                <dt>{t(locale, fact.value)}</dt>
                <dd>{t(locale, fact.label)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="sobre-block" aria-labelledby="sobre-pagina-experiencia">
          <h2 className="sobre-block__title" id="sobre-pagina-experiencia">
            {t(locale, "aboutpage.experience_heading")}
          </h2>
          <CareerList entries={experience} locale={locale} />
        </section>

        <section className="sobre-block" aria-labelledby="sobre-pagina-formacao">
          <h2 className="sobre-block__title" id="sobre-pagina-formacao">
            {t(locale, "aboutpage.education_heading")}
          </h2>
          <CareerList entries={education} locale={locale} />
        </section>

        <section className="sobre-block" aria-labelledby="sobre-pagina-stack">
          <h2 className="sobre-block__title" id="sobre-pagina-stack">
            {t(locale, "aboutpage.stack_heading")}
          </h2>
          <ul className="sobre-stack">
            {stack.map(tool => (
              <li key={tool.name}>
                <span className={tool.logo ? "g-tool" : "g-tool sobre-stack__plain"}>
                  {tool.logo && <ToolLogo slug={tool.logo} className="g-tool__logo" />}
                  {tool.name}
                </span>
              </li>
            ))}
          </ul>
          <ul className="sobre-capabilities">
            {CAPABILITIES.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Icon className="g-icon" aria-hidden="true" />
                {t(locale, key)}
              </li>
            ))}
          </ul>
        </section>

        <section className="sobre-block" aria-labelledby="sobre-pagina-github">
          <h2 className="sobre-block__title" id="sobre-pagina-github">
            {t(locale, "aboutpage.github.heading")}
          </h2>
          <ContributionCalendar calendar={contributions} locale={locale} />
        </section>

        <section className="sobre-feature" aria-labelledby="sobre-pagina-projetos">
          <div className="sobre-feature__head">
            <p className="g-eyebrow">{t(locale, "projects.label")}</p>
            <h2 className="sobre-feature__title" id="sobre-pagina-projetos">
              {t(locale, "projects.title")}
            </h2>
            <p className="sobre-feature__lead">{t(locale, "projects.intro")}</p>
          </div>
          <div className="sobre-projects">
            {homeCases.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                kicker={project.kicker[locale]}
                summary={project.summary[locale]}
                ctaLabel={t(locale, "projects.card_link")}
                href={`/projetos/${project.slug}`}
              />
            ))}
          </div>
          <ArrowLink className="sobre-feature__more" href="/#projetos">
            {t(locale, "aboutpage.projects_link")}
          </ArrowLink>
        </section>

        <section className="sobre-feature" aria-labelledby="sobre-pagina-blog">
          <div className="sobre-feature__head">
            <p className="g-eyebrow">{t(locale, "blog.label")}</p>
            <h2 className="sobre-feature__title" id="sobre-pagina-blog">
              {t(locale, "blog.heading")}
            </h2>
            <p className="sobre-feature__lead">{t(locale, "blog.description")}</p>
          </div>
          <ol className="sobre-timeline">
            {posts.map((post, index) => {
              const readTime = t(locale, "posts.read_time", { n: post.readTime });
              return (
                <li key={post.slug} className="sobre-timeline__item">
                  <span className="sobre-timeline__station" aria-hidden="true">
                    {index === 0 ? <Giro size={36} /> : <i />}
                  </span>
                  <div className="sobre-timeline__body">
                    <time dateTime={post.date}>{formatDate(locale, dateFromIso(post.date))}</time>
                    <a className="sobre-timeline__title" href={`/blog/${post.slug}`}>
                      {post.title}
                    </a>
                    <span className="sobre-timeline__meta">
                      {post.category && <span className="g-tag">{post.category}</span>}
                      <span>{languageNote ? `${readTime} · ${languageNote}` : readTime}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
          <ArrowLink className="sobre-feature__more" href="/blog">
            {t(locale, "aboutpage.blog_link")}
          </ArrowLink>
        </section>

        <section className="sobre-feature sobre-contact" aria-labelledby="sobre-pagina-contato">
          <div className="sobre-feature__head">
            <p className="g-eyebrow">{t(locale, "contact.label")}</p>
            <h2 className="sobre-feature__title" id="sobre-pagina-contato">
              {t(locale, "contact.title")}
            </h2>
            <p className="sobre-feature__lead">{t(locale, "contact.intro")}</p>
          </div>
          <div className="sobre-contact__actions">
            <ButtonLink href="/#contato" arrow>
              {t(locale, "aboutpage.contact_cta")}
            </ButtonLink>
            <CopyButton
              value={contactData.email}
              copyLabel={t(locale, "contact.direct.copy")}
              copiedLabel={t(locale, "contact.direct.copied")}
              errorLabel={t(locale, "post.link.copy_error")}
              errorHint={t(locale, "contact.direct.copy_error_hint")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
