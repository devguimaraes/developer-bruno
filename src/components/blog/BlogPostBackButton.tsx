import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

export function BlogPostBackButton() {
  const locale = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-14"
    >
      <a
        href="/blog"
        className="inline-flex items-center gap-2 type-mono py-2 min-h-[44px] pressable text-white/40 hover:text-white/85 transition-colors text-[10px]"
        title={t(locale, "blog.back_title")}
      >
        {t(locale, "blog.back_to_blog")}
      </a>
    </motion.div>
  );
}
