import { motion } from "framer-motion";

export function BlogPostBackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-14"
    >
      <a
        href="/blog"
        className="inline-flex items-center gap-2 font-silkscreen uppercase py-2 min-h-[44px] pressable text-white/40 hover:text-white/85 transition-colors"
        style={{ letterSpacing: "0.24em", fontSize: "10px" }}
        title="Voltar para a listagem do blog"
      >
        {"← VOLTAR AO BLOG"}
      </a>
    </motion.div>
  );
}
