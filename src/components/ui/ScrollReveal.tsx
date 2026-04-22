import type React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialProps = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 30 };
      case "down":
        return { opacity: 0, y: -30 };
      case "left":
        return { opacity: 0, x: 30 };
      case "right":
        return { opacity: 0, x: -30 };
      case "none":
        return { opacity: 0, scale: 0.95 };
      default:
        return { opacity: 0, y: 30 };
    }
  };

  const getAnimateProps = () => {
    return {
      opacity: isInView ? 1 : 0,
      y: isInView ? 0 : getInitialProps().y,
      x: isInView ? 0 : getInitialProps().x,
      scale: isInView ? 1 : getInitialProps().scale,
    };
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialProps()}
      animate={getAnimateProps()}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
