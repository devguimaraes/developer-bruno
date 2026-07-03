import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

interface BlogPostNavigationProps {
  next: BlogPost | null;
}

export function BlogPostNavigation({ next }: BlogPostNavigationProps) {
  const locale = useLocale();

  if (!next) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-16"
    >
      <a
        href={`/blog/${next.slug}`}
        className="group block p-8 border border-white/[0.08] hover:border-accent/70 hover:bg-white/[0.02] transition-colors pressable"
      >
        <span className="type-mono text-[10px] tracking-[0.20em] text-white/30 block">
          {t(locale, "blog.next_post")}
        </span>
        <h3
          className="type-raster-section text-white/90 group-hover:text-accent transition-colors mt-3.5"
          style={{ fontSize: "clamp(22px, 4vw, 30px)" }}
        >
          {next.title}
        </h3>
      </a>
    </motion.nav>
  );
}
