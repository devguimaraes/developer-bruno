import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 sm:mb-12"
    >
      <h1 className="type-raster-section text-[clamp(1.9rem,8vw,3rem)] md:text-4xl lg:text-5xl text-white leading-tight mb-6">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-b border-white/10 py-4 mb-6">
        <div className="flex items-center gap-2 type-mono text-[10px] text-white/60 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center gap-2 type-mono text-[10px] text-white/60 uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          <span>{post.readTime}</span>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="border border-white text-white px-3 py-1.5 rounded-full type-mono text-[10px] uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.header>
  );
}
