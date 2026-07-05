import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Detecta direção do scroll (up/down).
 * Retorna "up" quando o usuário sobe, "down" quando desce.
 */
function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;

      if (currentY < 10) {
        setDirection("down");
      } else if (currentY < lastScrollY.current - 5) {
        setDirection("up");
      } else if (currentY > lastScrollY.current + 5) {
        setDirection("down");
      }

      lastScrollY.current = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return direction;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const scrollDirection = useScrollDirection();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const prefersReducedMotion = useReducedMotion();

  // Extrai headings do conteúdo markdown
  useEffect(() => {
    const extractHeadings = () => {
      const content = document.querySelector("[data-markdown-content]");
      if (!content) return;

      const elements = content.querySelectorAll("h2, h3");
      const items: TocHeading[] = [];

      elements.forEach(el => {
        const id =
          el.id ||
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") ||
          "";

        if (!el.id) el.id = id;

        items.push({
          id,
          text: el.textContent || "",
          level: el.tagName === "H2" ? 2 : 3,
        });
      });

      setHeadings(items);
    };

    // Aguarda o conteúdo renderizar
    const timer = setTimeout(extractHeadings, 200);
    return () => clearTimeout(timer);
  }, []);

  // Controla visibilidade baseado na direção do scroll
  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true); // Sempre visível se reduced motion
      return;
    }

    if (scrollDirection === "up" && window.scrollY > 400) {
      setVisible(true);
      clearTimeout(hideTimer.current);
    } else if (scrollDirection === "down" || window.scrollY < 300) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000);
    }

    return () => clearTimeout(hideTimer.current);
  }, [scrollDirection, prefersReducedMotion]);

  // Highlight do heading ativo via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const isHidden = !visible;

  return (
    <motion.aside
      data-testid="toc"
      animate={
        prefersReducedMotion
          ? {}
          : {
              opacity: isHidden ? 0 : 1,
              x: isHidden ? 40 : 0,
              pointerEvents: isHidden ? "none" : "auto",
            }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed right-6 top-32 z-40 max-w-[240px] max-h-[60vh] overflow-y-auto bg-black/90 backdrop-blur-md border border-white/[0.08] p-6 hidden lg:block transition-opacity duration-300 ${
        isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <h4 className="type-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4">
        Neste artigo
      </h4>
      <nav>
        <ul className="space-y-1">
          {headings.map(h => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`block type-mono text-[11px] leading-relaxed py-1.5 transition-colors hover:text-accent ${
                  h.level === 3 ? "pl-4" : ""
                } ${activeId === h.id ? "text-accent" : "text-white/50"}`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
}
