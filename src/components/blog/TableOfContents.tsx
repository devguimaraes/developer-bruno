import type React from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { motion } from "framer-motion";

interface Heading {
  id: string;
  text: string;
  depth: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const activeId = useScrollSpy(headings.map(h => h.id));

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
      <div className="mb-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-accent shadow-[2px_2px_0px_#000]" />
        <h3 className="text-xs font-pixel uppercase tracking-[0.2em] text-stone-500">No artigo</h3>
      </div>

      <ul className="space-y-4">
        {headings.map(heading => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}>
            <a
              href={`#${heading.id}`}
              className={`group relative flex items-start text-sm lg:text-base transition-all duration-300 ${
                activeId === heading.id
                  ? "text-accent font-bold translate-x-1"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {activeId === heading.id && (
                <motion.span
                  layoutId="toc-indicator"
                  className="absolute -left-4 top-1.5 w-2 h-0.5 bg-accent"
                />
              )}
              <span className="line-clamp-2">{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
