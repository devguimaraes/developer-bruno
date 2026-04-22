import type React from "react";
import { motion } from "framer-motion";

interface SectionEntranceProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionEntrance: React.FC<SectionEntranceProps> = ({ children, className, id }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier luxuoso
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionEntrance;
