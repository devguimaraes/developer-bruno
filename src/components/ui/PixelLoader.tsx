import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { BrandMascot } from "@/components/brand/BrandMascot";
import "./PixelLoader.css";

interface PixelLoaderProps {
  onComplete?: () => void;
}

const isMobileDevice = () => typeof window !== "undefined" && window.innerWidth < 768;

export const PixelLoader: React.FC<PixelLoaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  const totalBlocks = isMobileDevice() ? 100 : 200;
  const blockIds = useMemo(
    () => Array.from({ length: totalBlocks }, (_, index) => `pixel-loader-block-${index}`),
    [totalBlocks]
  );

  // Pré-computa Map<index, delayPosition> em vez de usar indexOf a cada render
  const delayMap = useMemo(() => {
    const shuffled = Array.from({ length: totalBlocks }, (_, i) => i).sort(
      () => Math.random() - 0.5
    );
    const map = new Map<number, number>();
    shuffled.forEach((originalIndex, position) => {
      map.set(originalIndex, position);
    });
    return map;
  }, [totalBlocks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 1200);

    const cleanup = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="pixel-loader">
      {blockIds.map((blockId, i) => {
        const delayPosition = delayMap.get(i) ?? 0;
        const delay = isExiting ? (delayPosition / totalBlocks) * 0.8 : 0;

        return (
          <div
            key={blockId}
            className={`pixel-block ${isExiting ? "exit" : ""}`}
            style={{ animationDelay: `${delay}s` }}
          />
        );
      })}

      {/* BLOCO ao centro — aparece quando a dissolucao comeca */}
      <div
        className={`fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] transition-opacity duration-500 ${
          isExiting ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.3s" }}
      >
        <BrandMascot variant="cor" size={48} state="focused" />
      </div>
    </div>
  );
};

export default PixelLoader;
