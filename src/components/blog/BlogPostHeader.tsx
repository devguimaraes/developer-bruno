import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';
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
      className="mb-8"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-stone-500 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{post.readTime}</span>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-stone-200 text-black border-2 border-black text-sm"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </motion.span>
          ))}
        </div>
      )}
    </motion.header>
  );
}
