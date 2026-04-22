import type React from "react";
import "./GrainOverlay.css";

const GrainOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.10] mix-blend-overlay">
      <div className="absolute inset-0 w-full h-full bg-noise animate-noise" />
    </div>
  );
};

export default GrainOverlay;
