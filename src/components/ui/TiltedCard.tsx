import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltedCardProps {
  children: React.ReactNode;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  className?: string;
}

const springConfig = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  children,
  scaleOnHover = 1.05,
  rotateAmplitude = 10,
  className = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXPercentage = (e.clientX - rect.left) / width - 0.5;
    const mouseYPercentage = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXPercentage);
    y.set(mouseYPercentage);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      className={`relative [perspective:1000px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative [transform-style:preserve-3d] w-full h-full"
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: scaleOnHover }}
      >
        {children}
      </motion.div>
    </div>
  );
}
