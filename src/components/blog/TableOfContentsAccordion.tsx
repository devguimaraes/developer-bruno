import type React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { motion, AnimatePresence } from "framer-motion";

interface Heading {
  id: string;
  text: string;
  depth: number;
}

interface TableOfContentsAccordionProps {
  headings: Heading[];
}

export const TableOfContentsAccordion: React.FC<TableOfContentsAccordionProps> = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeId = useScrollSpy(headings.map(h => h.id));

  if (headings.length === 0) return null;

  return (
    <div className="lg:hidden border-y border-white/5 my-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-1 py-4 min-h-[44px] text-left pressable"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent" />
          <span className="font-pixel text-xs uppercase tracking-[0.2em] text-stone-400">
            Neste artigo
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-stone-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 pb-5 pt-2">
              {headings.map((heading, i) => (
                <motion.li
                  key={heading.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block py-1.5 text-sm transition-colors ${
                      activeId === heading.id
                        ? "text-accent font-bold"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {heading.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
