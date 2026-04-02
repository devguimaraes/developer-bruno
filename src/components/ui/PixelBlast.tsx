import React, { useRef, useEffect } from 'react';

interface PixelBlastProps {
  pixelSize?: number;
  pixelColor?: string;
  animationSpeed?: number;
}

const PixelBlast: React.FC<PixelBlastProps> = ({ 
  pixelSize = 20, 
  pixelColor = '#000000',
  animationSpeed = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;
    let pixels: { x: number; y: number; opacity: number; targetOpacity: number }[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      
      const cols = Math.ceil(w / pixelSize);
      const rows = Math.ceil(h / pixelSize);
      
      pixels = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          pixels.push({
            x: x * pixelSize,
            y: y * pixelSize,
            opacity: 0,
            targetOpacity: 0
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      pixels.forEach(p => {
        if (Math.random() < 0.005 * animationSpeed) {
          p.targetOpacity = Math.random() * 0.15;
        }
        
        p.opacity += (p.targetOpacity - p.opacity) * 0.1;
        
        if (p.opacity > 0.01) {
          ctx.fillStyle = pixelColor;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pixelSize, pixelColor, animationSpeed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

export default PixelBlast;
