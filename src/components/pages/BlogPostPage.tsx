import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { initializeCodeBlocks } from "@/lib/blog/code-blocks";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostTags,
  BlogPostNavigation,
  BlogPostBackButton,
} from "../blog";
import { TableOfContents } from "../blog/TableOfContents";

interface BlogPostPageClientProps {
  post: BlogPost;
  next: BlogPost | null;
  children?: React.ReactNode;
}

/** Capa full-bleed com parallax */
function CoverFullBleed({ image, title }: { image: string; title: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(
    prefersReducedMotion ? scrollYProgress : scrollYProgress,
    [0, 1],
    [0, 120]
  );

  return (
    <div
      ref={ref}
      data-testid="cover-fullbleed"
      className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden"
    >
      <motion.img
        src={image}
        alt={title}
        style={{ y }}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />
      {/* Gradiente inferior para transição ao texto */}
      <div
        data-testid="cover-gradient"
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"
      />
    </div>
  );
}

const BlogPostPage: React.FC<BlogPostPageClientProps> = ({ post, next, children }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      initializeCodeBlocks();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!post) {
    return <div className="bg-black min-h-screen" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-clip bg-black"
    >
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-50 shadow-[0_2px_10px_rgba(251,191,36,0.3)]"
        style={{ scaleX }}
      />

      {/* Cover Full-Bleed (fora do article) */}
      {post.image && <CoverFullBleed image={post.image} title={post.title} />}

      <div className={post.image ? "" : "pt-[72px] sm:pt-[88px]"}>
        <article className="blog-article max-w-[720px] mx-auto px-6 sm:px-8 pt-8 sm:pt-12 lg:pt-16 pb-24">
          <BlogPostBackButton />
          <BlogPostHeader post={post} />
          <BlogPostContent>{children}</BlogPostContent>
          <BlogPostTags tags={post.tags} />
          <BlogPostNavigation next={next} />
        </article>
      </div>

      {/* Table of Contents */}
      <TableOfContents />
    </motion.div>
  );
};

export default BlogPostPage;
