import type React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SectionEntranceProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionEntrance: React.FC<SectionEntranceProps> = ({ children, className, id }) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionEntrance;
