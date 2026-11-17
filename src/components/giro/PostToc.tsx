export interface PostTocItem {
  /** id do h2 no artigo; o link aponta para #id. */
  id: string;
  title: string;
}

export interface PostTocProps {
  /** Nome do índice, ex.: "Neste post". Vira o rótulo e o aria-label. */
  title: string;
  items: readonly PostTocItem[];
  /** id da seção em leitura. Ela ganha aria-current="true". */
  activeId?: string | null;
}

export function PostToc({ title, items, activeId = null }: PostTocProps) {
  return (
    <nav className="g-toc" aria-label={title}>
      <p className="g-eyebrow">{`// ${title}`}</p>
      <ol className="g-toc__list">
        {items.map(item => (
          <li key={item.id}>
            <a
              className="g-toc__link"
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "true" : undefined}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
