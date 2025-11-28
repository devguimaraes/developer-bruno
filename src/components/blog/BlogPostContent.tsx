import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getMarkdownClasses, injectMarkdownTheme } from '@/lib/typography';
import { useEffect } from 'react';

// Adiciona data-attribute para estilização específica
const MarkdownWrapper = ({ children }: { children: React.ReactNode }) => (
  <div data-markdown-content>{children}</div>
);

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  // Inject markdown theme CSS to prevent conflicts
  useEffect(() => {
    injectMarkdownTheme();
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={getMarkdownClasses()}
    >
      <MarkdownWrapper>
        <ReactMarkdown>{content}</ReactMarkdown>
      </MarkdownWrapper>
    </motion.article>
  );
}