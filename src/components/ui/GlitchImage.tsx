import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import './GlitchImage.css';

interface GlitchImageProps {
  src?: string;
  videoSrc?: string;
  alt: string;
  className?: string;
  active?: boolean;
}

interface MediaProps {
  src?: string;
  videoSrc?: string;
  alt: string;
  className?: string;
}

const GlitchMedia: React.FC<MediaProps> = ({ src, videoSrc, alt, className }) => {
  if (videoSrc) {
    return (
      <video 
        src={videoSrc}
        autoPlay loop muted playsInline
        className={cn("object-cover w-full h-full", className)}
      />
    );
  }
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("object-cover w-full h-full", className)}
    />
  );
};

export function GlitchImage({ 
  src, 
  videoSrc,
  alt, 
  active = false, 
  className 
}: GlitchImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldGlitch = active || isHovered;

  const layerMediaClass = "filter contrast-125 saturate-200";

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlitchMedia src={src} videoSrc={videoSrc} alt={alt} className={cn("glitch-base-img", className)} />
      
      <div className={cn("glitch-layer-1 absolute inset-0 mix-blend-screen opacity-0", shouldGlitch && "is-active")}>
        <div className="w-full h-full" style={{ transform: 'translateX(-4px)' }}>
          <GlitchMedia src={src} videoSrc={videoSrc} alt={alt} className={cn(layerMediaClass, className)} />
        </div>
      </div>

      <div className={cn("glitch-layer-2 absolute inset-0 mix-blend-screen opacity-0", shouldGlitch && "is-active")}>
        <div className="w-full h-full" style={{ transform: 'translateX(4px)' }}>
          <GlitchMedia src={src} videoSrc={videoSrc} alt={alt} className={cn(layerMediaClass, className)} />
        </div>
      </div>

      <div className={cn("glitch-layer-3 absolute inset-0 mix-blend-overlay opacity-0", shouldGlitch && "is-active")}>
        <div className="w-full h-full" style={{ transform: 'translateY(-2px)' }}>
          <GlitchMedia src={src} videoSrc={videoSrc} alt={alt} className={cn(layerMediaClass, className)} />
        </div>
      </div>

      <div className={cn("glitch-block glitch-block-magenta pointer-events-none", shouldGlitch && "is-active")} />
      <div className={cn("glitch-block glitch-block-screen pointer-events-none", shouldGlitch && "is-active")} />
    </div>
  );
}

export default GlitchImage;

