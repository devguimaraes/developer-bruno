import { motion } from 'framer-motion';

interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
        prose-p:text-white/90 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-code:text-accent prose-code:bg-white/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
        prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:my-8
        prose-blockquote:border-l-accent prose-blockquote:text-white/70 prose-blockquote:my-6 prose-blockquote:pl-4
        prose-li:text-white/90 prose-li:mb-2
        prose-hr:border-white/10 prose-hr:my-12
        prose-img:rounded prose-img:my-8
        prose-ul:my-6 prose-ol:my-6"
    >
      {children}
    </motion.article>
  );
}
