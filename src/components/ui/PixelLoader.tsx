import React, { useEffect, useState, useMemo } from 'react';
import './PixelLoader.css';

interface PixelLoaderProps {
  onComplete?: () => void;
}

const isMobileDevice = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

export const PixelLoader: React.FC<PixelLoaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  const totalBlocks = isMobileDevice() ? 100 : 200;

  // Pré-computa Map<index, delayPosition> em vez de usar indexOf a cada render
  const delayMap = useMemo(() => {
    const shuffled = Array.from({ length: totalBlocks }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
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
      {Array.from({ length: totalBlocks }).map((_, i) => {
        const delayPosition = delayMap.get(i) ?? 0;
        const delay = isExiting ? (delayPosition / totalBlocks) * 0.8 : 0;

        return (
          <div
            key={i}
            className={`pixel-block ${isExiting ? 'exit' : ''}`}
            style={{ animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
};

export default PixelLoader;
