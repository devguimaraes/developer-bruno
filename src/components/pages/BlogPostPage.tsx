import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { initializeCodeBlocks } from '@/lib/blog/code-blocks';

import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostNavigation,
  BlogPostBackButton,
} from '../blog';

interface BlogPostPageClientProps {
  post: BlogPost;
  previous: BlogPost | null;
  next: BlogPost | null;
  children?: React.ReactNode;
}

const BlogPostPage: React.FC<BlogPostPageClientProps> = ({ post, previous, next, children }) => {
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
      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 md:py-28 max-w-3xl">
        <BlogPostBackButton />
        <BlogPostHeader post={post} />
        <BlogPostContent>{children}</BlogPostContent>
        <BlogPostNavigation previous={previous} next={next} />
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
