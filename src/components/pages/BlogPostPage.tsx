import { motion } from "framer-motion";
import { type ReactNode, type RefObject, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLink } from "@/components/giro/Button";
import { CodeBlock } from "@/components/giro/CodeBlock";
import { CopyButton } from "@/components/giro/CopyButton";
import { PostRow } from "@/components/giro/PostRow";
import { PostToc } from "@/components/giro/PostToc";
import { siteConfig } from "@/config/site";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { toISODate } from "@/lib/blog";
import { parseReadingTime } from "@/lib/blog/content";
import { type ArticleHeading, headingsFromMarkdown } from "@/lib/blog/headings";
import { formatDate, type Locale, t } from "@/lib/i18n";
import type { BlogPost } from "@/types/blog";
import { activeSectionAt, articleProgress, readLineRatioOf, subscribeFrames } from "../nav/scroll";

interface BlogPostPageClientProps {
  post: BlogPost;
  /** Próximos posts, do mais novo ao mais antigo. A página mostra no máximo dois. */
  following?: readonly BlogPost[];
  children?: ReactNode;
}

interface CodeRecord {
  id: string;
  lang: string;
  text: string;
  /** Elemento <code> original. Os nós vão para o CodeBlock e voltam no cleanup. */
  source: HTMLElement;
  target: HTMLElement;
}

const RESOLVE_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const RESOLVE = { duration: 0.4, ease: RESOLVE_EASE };
const FOLLOWING_LIMIT = 2;

function bareLabel(label: string): string {
  return label.replace(/^\/\/\s*/, "");
}

function publishedOn(value: string): { iso: string; date: Date } | null {
  const iso = toISODate(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return { iso, date };
}

function minutesLabel(locale: Locale, readTime: string): string {
  const minutes = parseReadingTime(readTime);
  if (minutes === undefined) return readTime;
  return t(locale, "posts.read_time", { n: minutes });
}

function rowReadTime(locale: Locale, readTime: string): string {
  const label = minutesLabel(locale, readTime);
  const note = t(locale, "posts.card_language_note");
  return note ? `${label} · ${note}` : label;
}

function detectLanguage(pre: HTMLElement): string {
  const code = pre.querySelector("code");
  const data = pre.getAttribute("data-language") || code?.getAttribute("data-language") || "";
  if (data && data.toLowerCase() !== "plaintext") return data.toLowerCase();
  const match = /(?:language-|lang-)([a-z0-9#+]+)/i.exec(
    `${pre.className} ${code?.className ?? ""}`
  );
  return match?.[1]?.toLowerCase() || "code";
}

function sameHeadings(left: readonly ArticleHeading[], right: readonly ArticleHeading[]): boolean {
  if (left.length !== right.length) return false;
  return left.every(
    (item, index) => item.id === right[index]?.id && item.title === right[index]?.title
  );
}

function headingsInArticle(
  article: HTMLElement,
  parsed: readonly ArticleHeading[]
): ArticleHeading[] {
  const domHeadings = [...article.querySelectorAll<HTMLElement>("h2")];
  return parsed.map((item, index) => {
    const heading = domHeadings[index];
    if (!heading) return { id: item.id, title: item.title, level: 2 };
    if (!heading.id) heading.id = item.id;
    const title = heading.textContent?.replace(/\s+/g, " ").trim() || item.title;
    return { id: heading.id, title, level: 2 };
  });
}

/** Blocos do markdown viram CodeBlock, com o pre original escondido para o texto copiado. */
function useCodeBlocks(
  articleRef: RefObject<HTMLElement | null>,
  children: ReactNode
): CodeRecord[] {
  const [records, setRecords] = useState<CodeRecord[]>([]);

  useLayoutEffect(() => {
    const root = articleRef.current?.querySelector<HTMLElement>("[data-markdown-content]");
    // children é o markdown desta render. A lista redecora o código quando ele troca.
    if (!root || children == null) return;

    const created: CodeRecord[] = [];
    const tableWraps: HTMLElement[] = [];

    for (const table of root.querySelectorAll("table")) {
      if (table.parentElement?.classList.contains("post-table")) continue;
      const wrap = document.createElement("div");
      wrap.className = "post-table";
      table.replaceWith(wrap);
      wrap.append(table);
      tableWraps.push(wrap);
    }

    const pres = [...root.querySelectorAll("pre")].filter(
      pre => !pre.closest(".g-code") && !pre.hasAttribute("data-giro-source")
    );

    pres.forEach((pre, index) => {
      const code = pre.querySelector("code");
      if (!code) return;
      const lang = detectLanguage(pre);
      const target = document.createElement("div");
      target.className = "post-code-mount";
      pre.before(target);
      pre.hidden = true;
      pre.setAttribute("data-giro-source", "");
      created.push({
        id: `${index}-${lang}`,
        lang,
        text: code.textContent ?? "",
        source: code,
        target,
      });
    });

    setRecords(created);

    return () => {
      for (const record of created) {
        const destination = record.target.querySelector("pre code");
        if (record.source.childNodes.length === 0 && destination) {
          record.source.append(...destination.childNodes);
        }
        const pre = record.target.nextElementSibling;
        if (pre instanceof HTMLElement && pre.hasAttribute("data-giro-source")) {
          pre.hidden = false;
          pre.removeAttribute("data-giro-source");
        }
        record.target.remove();
      }
      for (const wrap of tableWraps) {
        const table = wrap.querySelector("table");
        if (table) wrap.replaceWith(table);
        else wrap.remove();
      }
      setRecords([]);
    };
  }, [articleRef, children]);

  return records;
}

function useArticleReading(
  articleRef: RefObject<HTMLElement | null>,
  parsed: readonly ArticleHeading[]
) {
  const [items, setItems] = useState<ArticleHeading[]>(() => [...parsed]);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const article = articleRef.current;
      if (!article) return;
      const resolved = headingsInArticle(article, parsed);
      setItems(previous => (sameHeadings(previous, resolved) ? previous : resolved));

      const viewport = window.innerHeight;
      const rect = article.getBoundingClientRect();
      const ratio = readLineRatioOf(article.getAttribute("data-read-line"));
      const nextProgress = Math.round(articleProgress(rect.top, rect.height, viewport, ratio));
      const line = ratio == null ? 0 : viewport * ratio;
      const sections = resolved.map(item => {
        const heading = article.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`);
        return {
          id: item.id,
          top: heading?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
        };
      });
      const nextActive =
        resolved.length === 0
          ? null
          : nextProgress >= 100
            ? (resolved[resolved.length - 1]?.id ?? null)
            : activeSectionAt(sections, line);

      setProgress(previous => (previous === nextProgress ? previous : nextProgress));
      setActiveId(previous => (previous === nextActive ? previous : nextActive));
    };

    measure();
    return subscribeFrames(measure);
  }, [articleRef, parsed]);

  return { items, progress, activeId };
}

function PostCode({ record }: { record: CodeRecord }) {
  const locale = useLocale();
  const host = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const destination = host.current?.querySelector("pre code");
    const source = record.source;
    if (!destination) return;
    const nodes = [...source.childNodes];
    destination.replaceChildren(...nodes);
    return () => {
      source.replaceChildren(...nodes);
    };
  }, [record]);

  return (
    <div ref={host}>
      <CodeBlock
        lang={record.lang}
        copyAction={
          <CopyButton
            value={record.text}
            copyLabel={t(locale, "post.code.copy")}
            copiedLabel={t(locale, "post.code.copied")}
            errorLabel={t(locale, "post.code.copy_error")}
            errorHint={t(locale, "post.code.copy_error_hint")}
            accessibleName={t(locale, "post.code.copy_label", { file: record.lang })}
          />
        }
      >
        {null}
      </CodeBlock>
    </div>
  );
}

const BlogPostPage = ({ post, following = [], children }: BlogPostPageClientProps) => {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const articleRef = useRef<HTMLElement>(null);
  const parsed = useMemo(() => headingsFromMarkdown(post.content), [post.content]);
  const { items, progress, activeId } = useArticleReading(articleRef, parsed);
  const codeBlocks = useCodeBlocks(articleRef, children);
  const languageNote = t(locale, "post.language_note");
  const category = post.tags[0] ?? "post";
  const published = publishedOn(post.date);
  const articleReadTime = minutesLabel(locale, post.readTime);
  const progressText =
    progress >= 100 ? t(locale, "post.progress_done") : t(locale, "post.progress", { n: progress });
  const related = following.slice(0, FOLLOWING_LIMIT);

  return (
    <div className="post-page g-papel">
      <div className="post-page__inner">
        <ArrowLink back href="/blog" className="post-back post-back--desktop">
          {t(locale, "post.back")}
        </ArrowLink>
        <ArrowLink back href="/blog" className="post-back post-back--mobile">
          {t(locale, "post.back_mobile")}
        </ArrowLink>

        <header className="post-header">
          <p className="g-eyebrow">{t(locale, "post.kicker", { category })}</p>
          <motion.h1
            className="titulo-1 post-title"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={RESOLVE}
          >
            {post.title}
          </motion.h1>
          {languageNote ? <p className="rotulo post-language-note">{languageNote}</p> : null}
          {post.excerpt ? <p className="corpo-l post-lead">{post.excerpt}</p> : null}
          <div className="post-meta">
            {published ? (
              <time className="micro" dateTime={published.iso}>
                {formatDate(locale, published.date)}
              </time>
            ) : null}
            <span className="micro">{articleReadTime}</span>
            <p className="post-progress">{progressText}</p>
            <CopyButton
              value={`${siteConfig.domain}/blog/${post.slug}`}
              copyLabel={t(locale, "post.link.copy")}
              copiedLabel={t(locale, "post.link.copied")}
              errorLabel={t(locale, "post.link.copy_error")}
              errorHint={t(locale, "post.link.copy_error_hint")}
            />
          </div>
        </header>

        <div className="post-layout">
          <div className="post-main">
            <article
              ref={articleRef}
              className="post-article"
              data-reading-root=""
              data-read-line="0.7"
            >
              <div data-markdown-content>{children}</div>
              <p className="g-eyebrow post-end">{t(locale, "post.end_mark")}</p>
              {codeBlocks.map(record =>
                createPortal(<PostCode key={record.id} record={record} />, record.target)
              )}
            </article>

            {related.length > 0 ? (
              <section className="post-more" aria-labelledby="post-keep-reading">
                <p id="post-keep-reading" className="g-eyebrow post-more__label">
                  {t(locale, "post.keep_reading")}
                </p>
                {related.map(item => {
                  const itemDate = publishedOn(item.date);
                  return (
                    <PostRow
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      date={itemDate ? formatDate(locale, itemDate.date) : item.date}
                      dateTime={itemDate?.iso ?? item.date}
                      title={item.title}
                      category={item.tags[0] ?? category}
                      readTime={rowReadTime(locale, item.readTime)}
                      excerpt={item.excerpt}
                    />
                  );
                })}
              </section>
            ) : null}
          </div>

          {items.length > 0 ? (
            <aside className="post-rail">
              <PostToc
                title={bareLabel(t(locale, "post.toc_label"))}
                items={items}
                activeId={activeId}
              />
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
