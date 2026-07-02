import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { BlogPostByline } from "./BlogPostByline";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const category = post.tags[0] || "POST";

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <span
          className="font-silkscreen uppercase bg-accent text-black"
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.20em",
            padding: "3px 10px 2px",
            lineHeight: 1,
          }}
        >
          {category}
        </span>
        <span
          className="font-silkscreen uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.32)" }}
        >
          {post.date}
        </span>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.18)" }}>·</span>
        <span
          className="font-silkscreen uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.32)" }}
        >
          {post.readTime} de leitura
        </span>
      </div>

      {/* Título */}
      <h1
        className="font-pixel uppercase text-white"
        style={{
          fontSize: "clamp(38px, 8vw, 74px)",
          lineHeight: 0.9,
          letterSpacing: "-0.03em",
          margin: "0 0 32px",
        }}
      >
        {post.title}
      </h1>

      {/* Lede */}
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "22px",
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.62)",
          margin: "0 0 44px",
        }}
      >
        {post.excerpt}
      </p>

      <BlogPostByline post={post} />

      {post.image && (
        <div
          className="w-full overflow-hidden mb-14"
          style={{ aspectRatio: "16 / 9", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
    </motion.header>
  );
}
