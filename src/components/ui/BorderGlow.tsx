import type React from "react";

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // HSL format "H S L"
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
  return (
    <div
      className={`group relative p-[2px] overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        backgroundColor: backgroundColor,
      }}
    >
      {/* Background Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            hsla(${glowColor}, ${glowIntensity * 0.2}) 0%,
            transparent ${glowRadius}%
          )`,
        }}
      />

      {/* Border Glow Layer */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          borderRadius: `${borderRadius}px`,
          padding: "2px",
          background: `radial-gradient(
            circle at 50% 50%,
            hsla(${glowColor}, 1) 0%,
            transparent 100%
          )`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Content */}
      <div
        className="relative z-20 h-full w-full bg-inherit"
        style={{ borderRadius: borderRadius > 0 ? `${borderRadius - 1}px` : 0 }}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
