import { motion } from 'framer-motion';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogPostNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export function BlogPostNavigation({ previous, next }: BlogPostNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t-4 border-black"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {previous && (
          <a
            href={`/blog/${previous.slug}`}
            className="group flex flex-col gap-2 p-4 sm:p-5 border-4 border-black hover:border-brutal-orange transition-colors min-h-28"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-bold">
              <ChevronLeft className="w-4 h-4" />
              Post anterior
            </div>
            <h3 className="font-bold text-black group-hover:text-brutal-orange transition-colors">
              {previous.title}
            </h3>
          </a>
        )}

        {next && (
          <a
            href={`/blog/${next.slug}`}
            className="group flex flex-col gap-2 p-4 sm:p-5 border-4 border-black hover:border-brutal-orange transition-colors text-left md:text-right md:ml-auto min-h-28"
          >
            <div className="flex items-center md:justify-end gap-2 text-xs sm:text-sm text-stone-600 font-bold">
              Próximo post
              <ChevronRight className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-black group-hover:text-brutal-orange transition-colors">
              {next.title}
            </h3>
          </a>
        )}
      </div>
    </motion.nav>
  );
}
