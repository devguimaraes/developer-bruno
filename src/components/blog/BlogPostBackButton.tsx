import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export function BlogPostBackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <a
        href="/blog"
        className="inline-flex items-center gap-2 type-mono text-[10px] text-white/40 hover:text-accent transition-colors uppercase tracking-widest py-1"
      >
        <ArrowLeft className="w-3 h-3" />
        // BACK_TO_BLOG
      </a>
    </motion.div>
  );
}
