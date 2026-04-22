import type React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

// --- FadeInStagger ---
// Context for staggered animations of children
interface FadeInStaggerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number;
}

export const FadeInStagger: React.FC<FadeInStaggerProps> = ({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- FadeInItem ---
// Child item that fades in (upwards by default)
export const FadeInItem: React.FC<HTMLMotionProps<"div">> = ({ children, className, ...props }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

// --- TextReveal ---
// Splits text into words or characters and reveals them
interface TextRevealProps {
  text: string;
  className?: string;
  mode?: "word" | "char";
  stagger?: number;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  mode = "word",
  stagger = 0.05,
  delay = 0,
}) => {
  const segments = mode === "word" ? text.split(" ") : Array.from(text);
  const segmentCounts = new Map<string, number>();
  const keyedSegments = segments.map(segment => {
    const normalizedSegment = segment === " " ? "space" : segment;
    const occurrence = (segmentCounts.get(normalizedSegment) ?? 0) + 1;
    segmentCounts.set(normalizedSegment, occurrence);

    return {
      key: `${mode}-${normalizedSegment}-${occurrence}`,
      value: segment,
    };
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1] as const,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ display: "inline-block", overflow: "hidden" }} // Overflow hidden for clean "slide up" effect
    >
      {keyedSegments.map(({ key, value }) => (
        <span
          key={key}
          style={{
            display: "inline-block",
            marginRight: mode === "word" ? "0.25em" : "0",
          }}
        >
          <motion.span variants={itemVariants} style={{ display: "inline-block" }}>
            {value}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

// --- ScaleOnHover ---
// Simple micro-interaction wrapper
export const ScaleOnHover: React.FC<HTMLMotionProps<"div">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
