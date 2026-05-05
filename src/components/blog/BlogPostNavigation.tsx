import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";

interface BlogPostNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export function BlogPostNavigation({ previous, next }: BlogPostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-16 pt-8 border-t border-white/10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previous && (
          <a
            href={`/blog/${previous.slug}`}
            className="group flex flex-col gap-3 p-5 border border-white/10 hover:border-accent/50 transition-colors"
          >
            <div
              className="type-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1"
              title="Previous blog post"
            >
              <ChevronLeft className="w-3 h-3" />
              {"// PREVIOUS"}
            </div>
            <h3 className="font-bold text-white group-hover:text-accent transition-colors">
              {previous.title}
            </h3>
          </a>
        )}
        {next && (
          <a
            href={`/blog/${next.slug}`}
            className="group flex flex-col gap-3 p-5 border border-white/10 hover:border-accent/50 transition-colors text-left md:text-right md:ml-auto"
          >
            <div
              className="type-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center md:justify-end gap-1"
              title="Next blog post"
            >
              {"// NEXT"}
              <ChevronRight className="w-3 h-3" />
            </div>
            <h3 className="font-bold text-white group-hover:text-accent transition-colors">
              {next.title}
            </h3>
          </a>
        )}
      </div>
    </motion.nav>
  );
}
