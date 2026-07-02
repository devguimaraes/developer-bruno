import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { initializeCodeBlocks } from "@/lib/blog/code-blocks";

import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostTags,
  BlogPostNavigation,
  BlogPostBackButton,
} from "../blog";

interface BlogPostPageClientProps {
  post: BlogPost;
  next: BlogPost | null;
  children?: React.ReactNode;
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

    // Initialize code blocks after content is rendered
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-50 shadow-[0_2px_10px_rgba(251,191,36,0.3)]"
        style={{ scaleX }}
      />

      <div className="pt-[72px] sm:pt-[88px]">
        <article className="max-w-[720px] mx-auto px-6 sm:px-8 pt-8 sm:pt-12 lg:pt-16 pb-24">
          <BlogPostBackButton />
          <BlogPostHeader post={post} />
          <BlogPostContent>{children}</BlogPostContent>
          <BlogPostTags tags={post.tags} />
          <BlogPostNavigation next={next} />
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
