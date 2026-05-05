import type React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./GrainOverlay.css";

const GrainOverlay: React.FC = () => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.10] mix-blend-overlay">
      <div className="absolute inset-0 w-full h-full bg-noise animate-noise" />
    </div>
  );
};

export default GrainOverlay;
