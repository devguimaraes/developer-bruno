import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  initialPosts?: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPosts = [] }) => {
  const locale = useLocale();
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [activeCategory, setActiveCategory] = useState(t(locale, "blog.all_categories"));

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

  // Lógica de filtragem por categoria
  const filteredPosts = useMemo(() => {
    if (activeCategory === t(locale, "blog.all_categories")) return initialPosts;
    return initialPosts.filter(post => post.tags[0] === activeCategory);
  }, [initialPosts, activeCategory, locale]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="bg-black min-h-screen pt-[72px] sm:pt-[88px] overflow-x-clip">
      {/* ── Hero Section ──────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/[0.08] pt-32 sm:pt-40 pb-16 sm:pb-20 px-6 sm:px-8 md:px-12">
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black" />

        <div className="max-w-6xl mx-auto relative z-10 flex items-end justify-between gap-10 flex-wrap">
          <div>
            <span className="type-mono text-[10px] tracking-[0.38em] text-accent block mb-6 font-bold">
              {t(locale, "blog.label")}
            </span>
            <h1
              className="type-raster-hero text-white leading-[0.8] tracking-[-0.04em] mb-8"
              style={{ fontSize: "clamp(72px, 11vw, 140px)" }}
            >
              {t(locale, "blog.heading")}
            </h1>
            <p
              className="font-serif italic text-[19px] leading-[1.55] text-white/70 max-w-[500px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t(locale, "blog.description")}
            </p>
          </div>

          <div className="text-right self-end">
            <span
              className="type-raster-section text-white/[0.06] block leading-none tracking-[-0.04em]"
              style={{ fontSize: "clamp(52px, 7vw, 80px)" }}
            >
              {initialPosts.length}
            </span>
            <span className="type-mono text-[9px] tracking-[0.22em] text-white/20">
              {t(locale, "blog.total_label")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Category Filter ────────────────── */}
      <div className="sticky top-[72px] sm:top-[88px] z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 flex gap-0 overflow-x-auto scrollbar-hide">
          {[t(locale, "blog.all_categories"), ...categories].map(cat => {
            const isActive = cat === activeCategory;
            const count =
              cat === t(locale, "blog.all_categories")
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
                className="type-mono text-[10px] tracking-[0.20em] py-[18px] px-5 border-none cursor-pointer flex items-center gap-2 whitespace-nowrap transition-all duration-200 outline-none select-none leading-none pressable"
                style={{
                  background: isActive ? "hsl(45,87%,57%)" : "transparent",
                  color: isActive ? "#000" : "rgba(255,255,255,0.55)",
                  borderBottom: isActive ? "2px solid hsl(45,87%,57%)" : "2px solid transparent",
                }}
              >
                {cat}
                <span
                  className={`type-mono text-[9px] px-1.5 py-px leading-[1.4] font-bold ${isActive ? "bg-black/20 text-black/70" : "bg-white/[0.08] text-white/40"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filtered Count Label ──────────────────── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 pt-6 pb-0">
        <span className="type-mono text-[9px] tracking-[0.22em] text-white/20">
          {filteredPosts.length} {t(locale, "blog.heading")}
        </span>
      </div>

      {/* ── Posts List ────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 pt-2 pb-40">
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
              className="group block py-10 border-b border-white/[0.08] text-white cursor-pointer transition-[background,padding] duration-160 hover:bg-white/[0.018] pressable"
            >
              {/* Meta row: badge + date + readtime + CTA */}
              <div className="flex items-center justify-between gap-6 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="type-mono text-[9px] font-bold tracking-[0.20em] bg-accent text-black px-3 py-[3px] leading-none whitespace-nowrap">
                    {post.tags[0] || "POST"}
                  </span>
                  <span className="type-mono text-[9px] tracking-[0.18em] text-white/30 whitespace-nowrap">
                    {post.date}
                  </span>
                  <span className="text-[9px] text-white/20">·</span>
                  <span className="type-mono text-[9px] tracking-[0.18em] text-white/30 whitespace-nowrap">
                    {post.readTime}
                  </span>
                </div>
                <span className="type-mono text-[10px] tracking-[0.28em] text-white/30 whitespace-nowrap shrink-0 pb-[3px] border-b border-white/10 group-hover:text-accent group-hover:border-accent transition-colors">
                  {t(locale, "blog.read_label")}
                </span>
              </div>

              {/* Title */}
              <h2
                className="type-raster-section text-white/90 group-hover:text-accent transition-colors leading-[0.88] tracking-[-0.02em] mb-4 max-w-3xl"
                style={{ fontSize: "clamp(22px, 3.8vw, 46px)" }}
              >
                {post.title}
              </h2>

              {/* Summary */}
              <p
                className="font-serif italic text-base leading-[1.62] text-white/50 max-w-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {post.excerpt}
              </p>
            </motion.a>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-white/[0.05]">
            <p className="type-mono text-white/40 tracking-[0.2em] text-xs">
              {t(locale, "blog.empty")}
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
              {t(locale, "blog.load_more")} ({filteredPosts.length - visibleCount}{" "}
              {t(locale, "blog.remaining")})
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
