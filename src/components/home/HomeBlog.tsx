import { type PointerEvent, useEffect } from "react";
import { ArrowLink } from "@/components/giro/Button";
import { useLocale } from "@/hooks/useLocale";
import { formatDate, t } from "@/lib/i18n";
import { bareLabel } from "./copy";
import { SCENE_MOBILE_QUERY } from "./story/chapters";
import { setStorySignal } from "./story/story-signals";

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

/** Sem ponteiro de verdade (toque) ou no celular, o Giro do blog só cochila. */
function canHover(event: PointerEvent): boolean {
  return event.pointerType !== "touch" && !window.matchMedia(SCENE_MOBILE_QUERY).matches;
}

export function HomeBlog({ posts }: HomeBlogProps) {
  const locale = useLocale();
  // Os posts estão só em português: em inglês, cada linha avisa.
  const languageNote = t(locale, "posts.card_language_note");

  // O capítulo escreve o sinal; o Giro da história lê. Ao sair, o sinal volta a "ninguém".
  useEffect(() => () => setStorySignal("blogHover", -1), []);

  function hoverRow(event: PointerEvent, i: number) {
    if (canHover(event)) setStorySignal("blogHover", i);
  }

  return (
    <section className="bl g-papel" id="blog" aria-labelledby="bl-title">
      <div className="bl-in">
        <div className="bl-head">
          <p className="g-eyebrow">{bareLabel(t(locale, "posts.label"))}</p>
          <h2 className="bl-title" id="bl-title">
            {t(locale, "posts.title")}
          </h2>
          <p className="bl-lead">{t(locale, "posts.home_intro")}</p>
          <ArrowLink className="bl-all" href="/blog">
            {t(locale, "posts.read_all")}
          </ArrowLink>
        </div>
        <div className="bl-list">
          <div className="bl-rule" aria-hidden="true">
            <i
              className="hs-stop bl-nap"
              data-stop="bl-nap"
              data-size="48"
              data-size-m="48"
              aria-hidden="true"
            />
          </div>
          {posts.map((post, i) => {
            const readTime = t(locale, "posts.read_time", { n: post.readTime });
            return (
              <a
                key={post.slug}
                className="bl-row"
                href={`/blog/${post.slug}`}
                onPointerEnter={event => hoverRow(event, i)}
                onPointerLeave={() => setStorySignal("blogHover", -1)}
              >
                <i
                  className="hs-stop bl-seat"
                  data-stop={`bl${i}`}
                  data-size="40"
                  data-size-m="40"
                  aria-hidden="true"
                />
                <time dateTime={post.date}>{formatDate(locale, dateFromIso(post.date))}</time>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="bl-meta">
                    <span className="g-tag">{post.category}</span>
                    {languageNote ? `${readTime} · ${languageNote}` : readTime}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
