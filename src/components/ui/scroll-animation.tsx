import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

interface ScrollAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "fadeInUp" | "scaleIn" | "slideInLeft" | "slideInRight" | "fade";
  delay?: number;
  className?: string;
  duration?: number;
}

const variantsMap: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  variant = "fadeInUp",
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1], // Soft smooth ease-out (similar to Apple/modern interaction)
      }}
      variants={variantsMap[variant]}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
