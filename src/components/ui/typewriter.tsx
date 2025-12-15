import React from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  variant?: "smooth" | "mechanical";
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  className,
  speed = 0.02,
  delay = 0,
  variant = "smooth",
}) => {
  // Split text into characters
  const characters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: speed, delayChildren: delay * i },
    }),
  };

  const smoothVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 5,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const mechanicalVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0, // Instant
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
  };

  const childVariants =
    variant === "mechanical" ? mechanicalVariants : smoothVariants;

  return (
    <motion.p
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <motion.span variants={childVariants} key={index} aria-hidden="true">
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};
