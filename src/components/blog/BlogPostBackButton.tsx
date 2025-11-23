import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BlogPostBackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-stone-600 hover:text-black transition-colors font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o blog
      </Link>
    </motion.div>
  );
}