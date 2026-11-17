import { ArrowRight } from "lucide-react";

export interface PostRowProps {
  href: string;
  /** Data já formatada para leitura, ex.: "10 abr 2026". */
  date: string;
  /** Data no formato ISO, para o atributo dateTime. */
  dateTime: string;
  title: string;
  /** Categoria: a primeira tag do post. */
  category: string;
  /** Tempo de leitura já no idioma da página, ex.: "8 min de leitura". */
  readTime: string;
  excerpt?: string;
}

export function PostRow({
  href,
  date,
  dateTime,
  title,
  category,
  readTime,
  excerpt,
}: PostRowProps) {
  return (
    <a className="g-post-row" href={href}>
      <time className="g-post-row__date" dateTime={dateTime}>
        {date}
      </time>
      <div className="g-post-row__main">
        <h3 className="g-post-row__title">{title}</h3>
        {excerpt && <p className="g-post-row__excerpt">{excerpt}</p>}
        <span className="g-post-row__meta">
          <span className="g-tag">{category}</span>
          {readTime}
        </span>
      </div>
      <ArrowRight className="g-icon g-icon--24 g-post-row__arrow" aria-hidden="true" />
    </a>
  );
}
