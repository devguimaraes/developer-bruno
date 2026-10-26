import { useEffect, useMemo, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import { Button } from "@/components/giro/Button";
import { Chip } from "@/components/giro/Chip";
import { PostRow } from "@/components/giro/PostRow";
import { useLocale } from "@/hooks/useLocale";
import { toISODate } from "@/lib/blog";
import { parseReadingTime } from "@/lib/blog/content";
import type { Locale } from "@/lib/i18n";
import { formatDate, t } from "@/lib/i18n";
import type { BlogPost } from "@/types/blog";

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  initialPosts?: BlogPost[];
}

/** Data ISO lida como UTC, para o dia não mudar com o fuso. */
function dateFromIso(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function categoriesFrom(posts: BlogPost[]): string[] {
  const seen = new Set<string>();
  for (const post of posts) {
    const category = post.tags[0];
    if (category) seen.add(category);
  }
  return [...seen];
}

function readingLabel(locale: Locale, post: BlogPost): string {
  const minutes = post.readingTime ?? parseReadingTime(post.readTime);
  const readTime =
    minutes === undefined ? post.readTime : t(locale, "posts.read_time", { n: minutes });
  // Os posts estão só em português: em inglês, cada linha avisa.
  const languageNote = t(locale, "posts.card_language_note");
  return languageNote ? `${readTime} · ${languageNote}` : readTime;
}

export default function BlogPage({ initialPosts = [] }: BlogPageProps) {
  const locale = useLocale();
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = useMemo(() => categoriesFrom(initialPosts), [initialPosts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === null) return initialPosts;
    return initialPosts.filter(post => post.tags[0] === activeCategory);
  }, [initialPosts, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const remaining = filteredPosts.length - visiblePosts.length;
  const isEmpty = activeCategory !== null && filteredPosts.length === 0;

  function selectCategory(category: string | null) {
    setActiveCategory(category);
    setVisibleCount(POSTS_PER_PAGE);
  }

  return (
    <section className="blog-page g-papel">
      <div className="blog-page__inner">
        <header className="blog-page__head">
          <div className="blog-page__intro">
            <p className="g-eyebrow">{t(locale, "blog.label")}</p>
            <h1 className="blog-page__title">{t(locale, "blog.heading")}</h1>
            <p className="blog-page__description">{t(locale, "blog.description")}</p>
          </div>
          <p className="blog-page__count">
            <span className="blog-page__count-value">{initialPosts.length}</span>
            <span className="blog-page__count-label">{t(locale, "blog.total_label")}</span>
          </p>
        </header>

        <fieldset className="blog-page__filters">
          <legend>{t(locale, "posts.filter.label")}</legend>
          <Chip selected={activeCategory === null} onClick={() => selectCategory(null)}>
            {t(locale, "blog.all_categories")}
          </Chip>
          {categories.map(category => (
            <Chip
              key={category}
              selected={activeCategory === category}
              onClick={() => selectCategory(category)}
            >
              {category}
            </Chip>
          ))}
        </fieldset>

        {isEmpty ? (
          <div className="g-empty" role="status">
            <Giro state="empty" size={72} />
            <p className="g-empty__title">{t(locale, "blog.empty")}</p>
            <Button variant="secondary" onClick={() => selectCategory(null)}>
              {t(locale, "blog.show_all")}
            </Button>
          </div>
        ) : (
          <div className="blog-page__list">
            {visiblePosts.map(post => {
              const iso = toISODate(post.date);
              return (
                <PostRow
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  date={formatDate(locale, dateFromIso(iso))}
                  dateTime={iso}
                  title={post.title}
                  category={post.tags[0] ?? ""}
                  readTime={readingLabel(locale, post)}
                  excerpt={post.excerpt}
                />
              );
            })}
          </div>
        )}

        {remaining > 0 && (
          <div className="blog-page__more">
            <Button
              variant="secondary"
              onClick={() => setVisibleCount(count => count + POSTS_PER_PAGE)}
            >
              {`${t(locale, "blog.load_more")} (${remaining} ${t(locale, "blog.remaining")})`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
