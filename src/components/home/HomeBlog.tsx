import { ArrowLink } from "@/components/giro/Button";
import { PostRow } from "@/components/giro/PostRow";
import { SectionHeader } from "@/components/giro/SectionHeader";
import { useLocale } from "@/hooks/useLocale";
import { formatDate, t } from "@/lib/i18n";
import { bareLabel } from "./copy";

/** Post já lido do content collection pela página (index.astro). */
export interface HomePost {
  slug: string;
  title: string;
  /** Data ISO, AAAA-MM-DD. */
  date: string;
  /** Primeira tag do post. */
  category: string;
  /** Minutos de leitura. */
  readTime: number;
  excerpt: string;
}

export interface HomeBlogProps {
  posts: HomePost[];
}

/** Data ISO lida como UTC, para o dia não mudar com o fuso. */
function dateFromIso(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function HomeBlog({ posts }: HomeBlogProps) {
  const locale = useLocale();
  // Os posts estão só em português: em inglês, cada linha avisa.
  const languageNote = t(locale, "posts.card_language_note");

  return (
    <div className="home-blog">
      <SectionHeader
        label={bareLabel(t(locale, "posts.label"))}
        title={t(locale, "posts.title")}
        lead={t(locale, "posts.home_intro")}
        action={<ArrowLink href="/blog">{t(locale, "posts.read_all")}</ArrowLink>}
      />
      <div className="home-blog__list">
        {posts.map(post => {
          const readTime = t(locale, "posts.read_time", { n: post.readTime });
          return (
            <PostRow
              key={post.slug}
              href={`/blog/${post.slug}`}
              date={formatDate(locale, dateFromIso(post.date))}
              dateTime={post.date}
              title={post.title}
              category={post.category}
              readTime={languageNote ? `${readTime} · ${languageNote}` : readTime}
              excerpt={post.excerpt}
            />
          );
        })}
      </div>
    </div>
  );
}
