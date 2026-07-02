import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";

interface BlogPostNavigationProps {
  next: BlogPost | null;
}

export function BlogPostNavigation({ next }: BlogPostNavigationProps) {
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
        className="group block p-8 border border-white/10 hover:border-accent/70 hover:bg-white/[0.02] transition-colors"
      >
        <span
          className="font-silkscreen uppercase block"
          style={{ fontSize: "10px", letterSpacing: "0.20em", color: "rgba(255,255,255,0.32)" }}
        >
          {"PRÓXIMO POST →"}
        </span>
        <h3
          className="font-pixel uppercase text-white/90 group-hover:text-accent transition-colors"
          style={{ fontSize: "clamp(22px, 4vw, 30px)", lineHeight: 1.05, marginTop: "14px" }}
        >
          {next.title}
        </h3>
      </a>
    </motion.nav>
  );
}
