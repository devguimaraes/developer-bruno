import { motion } from 'framer-motion';

interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      data-markdown-content
      className="blog-post-content"
    >
      {children}
    </motion.div>
  );
}
