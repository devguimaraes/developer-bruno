import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { initializeCodeBlocks } from "@/lib/blog/code-blocks";

import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostNavigation,
  BlogPostBackButton,
  TableOfContents,
  BlogPostMetadata,
} from "../blog";

interface BlogPostPageClientProps {
  post: BlogPost;
  previous: BlogPost | null;
  next: BlogPost | null;
  headings?: { id: string; text: string; depth: number }[];
  children?: React.ReactNode;
}

const BlogPostPage: React.FC<BlogPostPageClientProps> = ({
  post,
  previous,
  next,
  headings = [],
  children,
}) => {
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
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50 shadow-[0_2px_10px_rgba(251,191,36,0.3)]"
        style={{ scaleX }}
      />

      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_250px] gap-12 xl:gap-20 max-w-7xl mx-auto">
          {/* Column 1: Navigation (Desktop Only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <BlogPostBackButton />
            </div>
          </aside>

          {/* Column 2: Main Content */}
          <article className="min-w-0">
            <div className="lg:hidden mb-8">
              <BlogPostBackButton />
            </div>

            <BlogPostHeader post={post} />

            {/* Mobile Metadata */}
            <div className="lg:hidden">
              <BlogPostMetadata post={post} />
            </div>

            <BlogPostContent>{children}</BlogPostContent>

            <BlogPostNavigation previous={previous} next={next} />
          </article>

          {/* Column 3: Utilities (Desktop Only) */}
          <aside className="hidden lg:block">
            <div className="space-y-8">
              <BlogPostMetadata post={post} />
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
