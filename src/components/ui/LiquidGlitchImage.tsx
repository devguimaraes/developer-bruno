import { cn } from "@/lib/utils";
import { GlitchImage, type VideoSource } from "./GlitchImage";
import { LiquidGlassLens } from "./LiquidGlassLens";
import "./GlitchImage.css";
import "./LiquidGlassLens.css";

export interface LiquidGlitchImageProps {
  src?: string;
  /** @deprecated prefira videoSources (webm + mp4) */
  videoSrc?: string;
  videoSources?: VideoSource[];
  posterSrc?: string;
  alt: string;
  className?: string;
  active?: boolean;
  loadingLazy?: boolean;
  /** Props do efeito glass sobre a imagem */
  glassRefraction?: number;
  glassBevelDepth?: number;
  glassFrost?: number;
  glassTilt?: boolean;
}

export function LiquidGlitchImage({
  src,
  videoSrc,
  videoSources,
  posterSrc,
  alt,
  active = false,
  className,
  loadingLazy = false,
  glassRefraction = 0.015,
  glassBevelDepth = 0.06,
  glassFrost = 0,
  glassTilt = false,
}: LiquidGlitchImageProps) {
  return (
    <div
      className={cn(
        "liquid-glitch-container relative w-full h-full overflow-hidden bg-black",
        className
      )}
    >
      {/* Camada base: GlitchImage (imagem + glitch CSS) */}
      <GlitchImage
        src={src}
        videoSrc={videoSrc}
        videoSources={videoSources}
        posterSrc={posterSrc}
        alt={alt}
        active={active}
        loadingLazy={loadingLazy}
        className="w-full h-full"
      />

      {/* Camada de vidro: LiquidGlassLens sobreposto */}
      <LiquidGlassLens
        className="absolute inset-0 z-10"
        height="100%"
        width="100%"
        backgroundOpacity={0.02}
        blur={0}
        saturation={1}
        refraction={glassRefraction}
        bevelDepth={glassBevelDepth}
        bevelWidth={0.08}
        frost={glassFrost}
        specular={true}
        shadow={false}
        tilt={glassTilt}
        tiltFactor={5}
        magnify={1}
      >
        {/* Conteúdo vazio — o vidro refrata a imagem abaixo */}
      </LiquidGlassLens>
    </div>
  );
}

export default LiquidGlitchImage;
