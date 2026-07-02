import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/types/blog";

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  initialPosts?: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPosts = [] }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extrair categorias únicas de tags[0]
  const categories = useMemo(() => {
    const seen = new Set<string>();
    initialPosts.forEach(post => {
      if (post.tags[0]) seen.add(post.tags[0]);
    });
    return Array.from(seen);
  }, [initialPosts]);

  // Lógica de filtragem por categoria (sem busca)
  const filteredPosts = useMemo(() => {
    if (activeCategory === "Todos") return initialPosts;
    return initialPosts.filter(post => post.tags[0] === activeCategory);
  }, [initialPosts, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="bg-black min-h-screen pt-[72px] sm:pt-[88px] overflow-x-clip">
      {/* ── Hero Section ──────────────────────────── */}
      <div
        style={{
          padding: "160px 48px 72px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black" />

        <div
          className="max-w-[1152px] mx-auto relative z-10"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              className="type-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "hsl(var(--accent))",
                display: "block",
                marginBottom: "24px",
                fontWeight: 700,
              }}
            >
              {"// BLOG"}
            </span>
            <h1
              className="font-pixel text-white uppercase"
              style={{
                fontSize: "clamp(72px, 11vw, 140px)",
                lineHeight: 0.8,
                letterSpacing: "-0.04em",
                margin: "0 0 32px 0",
              }}
            >
              POSTS
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "19px",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.68)",
                margin: 0,
                maxWidth: "500px",
              }}
            >
              Artigos técnicos e reflexões sobre programação, engenharia de software e tecnologia.
            </p>
          </div>

          <div style={{ textAlign: "right", alignSelf: "flex-end" }}>
            <span
              className="font-pixel"
              style={{
                fontSize: "clamp(52px, 7vw, 80px)",
                color: "rgba(255,255,255,0.06)",
                lineHeight: 1,
                display: "block",
                letterSpacing: "-0.04em",
              }}
            >
              {initialPosts.length}
            </span>
            <span
              className="type-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.20)",
              }}
            >
              TOTAL_POSTS
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Category Filter ────────────────── */}
      <div
        style={{
          background: "rgba(0,0,0,0.92)",
          position: "sticky",
          top: "80px",
          zIndex: 40,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="max-w-[1152px] mx-auto"
          style={{
            padding: "0 48px",
            overflowX: "auto",
            display: "flex",
            gap: 0,
            scrollbarWidth: "none",
          }}
        >
          {["Todos", ...categories].map(cat => {
            const isActive = cat === activeCategory;
            const count =
              cat === "Todos"
                ? initialPosts.length
                : initialPosts.filter(p => p.tags[0] === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(POSTS_PER_PAGE);
                }}
                className="type-mono"
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.20em",
                  padding: "18px 20px 16px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap",
                  transition: "all 200ms ease",
                  outline: "none",
                  userSelect: "none",
                  lineHeight: 1,
                  background: isActive ? "hsl(45,87%,57%)" : "transparent",
                  color: isActive ? "#000" : "rgba(255,255,255,0.55)",
                  borderBottom: isActive ? "2px solid hsl(45,87%,57%)" : "2px solid transparent",
                }}
              >
                {cat}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    background: isActive ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.08)",
                    color: isActive ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.40)",
                    padding: "1px 6px",
                    lineHeight: 1.4,
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filtered Count Label ──────────────────── */}
      <div className="max-w-[1152px] mx-auto" style={{ padding: "24px 48px 0" }}>
        <span
          className="type-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          {filteredPosts.length} POSTS
        </span>
      </div>

      {/* ── Posts List ────────────────────────────── */}
      <main className="max-w-[1152px] mx-auto" style={{ padding: "8px 48px 160px" }}>
        <AnimatePresence mode="popLayout">
          {visiblePosts.map((post, index) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              style={{
                display: "block",
                padding: "40px 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                textDecoration: "none",
                color: "#fff",
                cursor: "pointer",
                transition:
                  "background 160ms ease, padding-left 160ms ease, padding-right 160ms ease",
              }}
              className="group hover:bg-white/[0.018]"
            >
              {/* Meta row: badge + date + readtime + CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className="type-mono"
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.20em",
                      background: "hsl(var(--accent))",
                      color: "#000",
                      padding: "3px 10px 2px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.tags[0] || "POST"}
                  </span>
                  <span
                    className="type-mono"
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.28)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.date}
                  </span>
                  <span
                    className="type-mono"
                    style={{
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.16)",
                      padding: "0 2px",
                    }}
                  >
                    ·
                  </span>
                  <span
                    className="type-mono"
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.28)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.readTime}
                  </span>
                </div>
                <span
                  className="type-mono"
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                    color: "rgba(255,255,255,0.30)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    paddingBottom: "3px",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Ler →
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-pixel text-white uppercase group-hover:text-accent transition-colors"
                style={{
                  fontSize: "clamp(22px, 3.8vw, 46px)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.92)",
                  margin: "0 0 16px 0",
                  maxWidth: "880px",
                }}
              >
                {post.title}
              </h2>

              {/* Summary */}
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "16px",
                  lineHeight: 1.62,
                  color: "rgba(255,255,255,0.48)",
                  margin: 0,
                  maxWidth: "680px",
                }}
              >
                {post.excerpt}
              </p>
            </motion.a>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div
            className="text-center py-24"
            style={{ border: "2px dashed rgba(255,255,255,0.05)" }}
          >
            <p className="type-mono text-stone-600 uppercase tracking-[0.2em] text-xs">
              Nenhum post encontrado para esta categoria
            </p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
              className="border-2 border-white/20 text-white hover:border-accent hover:text-accent hover:shadow-brutal px-10 py-4 type-mono uppercase tracking-widest transition-all bg-black pressable"
            >
              Carregar mais ({filteredPosts.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
