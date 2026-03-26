import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;       // HSL format "H S L"
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = "",
  glowColor = "162 100% 27%", // Parakeet Primary
  backgroundColor = "transparent",
  borderRadius = 0, 
  glowRadius = 50,
  glowIntensity = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-[2px] overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        backgroundColor: backgroundColor,
      }}
    >
      {/* Background Glow Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(
            circle at ${smoothX}px ${smoothY}px,
            hsla(${glowColor}, ${glowIntensity * 0.2}) 0%,
            transparent ${glowRadius}%
          )`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Border Glow Layer */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          borderRadius: `${borderRadius}px`,
          padding: '2px',
          background: `radial-gradient(
            circle at ${smoothX}px ${smoothY}px,
            hsla(${glowColor}, 1) 0%,
            transparent 100%
          )`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full w-full bg-inherit" style={{ borderRadius: borderRadius > 0 ? `${borderRadius - 1}px` : 0 }}>
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
