import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { BlogPostByline } from "./BlogPostByline";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const locale = useLocale();
  const category = post.tags[0] || "POST";

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <span className="type-mono text-[9px] font-bold tracking-[0.20em] bg-accent text-black px-3 py-[3px] leading-none">
          {category}
        </span>
        <span className="type-mono text-[9px] tracking-[0.18em] text-white/30">{post.date}</span>
        <span className="text-[9px] text-white/20">·</span>
        <span className="type-mono text-[9px] tracking-[0.18em] text-white/30">
          {post.readTime} {t(locale, "blog.min_read")}
        </span>
      </div>

      {/* Título */}
      <h1
        className="type-raster-section text-white mb-8"
        style={{ fontSize: "clamp(38px, 8vw, 74px)" }}
      >
        {post.title}
      </h1>

      {/* Lede */}
      <p
        className="font-serif italic text-[22px] leading-[1.55] text-white/60 mb-11"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {post.excerpt}
      </p>

      <BlogPostByline post={post} />

      {post.image && (
        <div className="w-full aspect-[16/9] overflow-hidden mb-14 border border-white/[0.08]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
    </motion.header>
  );
}
