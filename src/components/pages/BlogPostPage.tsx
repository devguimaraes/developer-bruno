import { useEffect } from "react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";

import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostNavigation,
  BlogPostBackButton,
} from "../blog";
import { BlogPostLoadingSkeleton } from "../blog/BlogPostLoadingSkeleton";

interface BlogPostPageClientProps {
  post: BlogPost;
  previous: BlogPost | null;
  next: BlogPost | null;
}

const BlogPostPage: React.FC<BlogPostPageClientProps> = ({ post, previous, next }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return <BlogPostLoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="container mx-auto px-4 py-28 max-w-4xl">
        <BlogPostBackButton />
        <BlogPostHeader post={post} />
        <BlogPostContent content={post.content} />
        <BlogPostNavigation
          previous={previous}
          next={next}
        />
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
