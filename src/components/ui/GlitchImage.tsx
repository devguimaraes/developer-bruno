import { memo } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./GlitchImage.css";

export interface VideoSource {
  src: string;
  type: string;
}

interface GlitchImageProps {
  src?: string;
  /** @deprecated prefira videoSources (webm + mp4) */
  videoSrc?: string;
  videoSources?: VideoSource[];
  posterSrc?: string;
  alt: string;
  className?: string;
  active?: boolean;
  /** Quando true, adia carregamento de <img> (recomendado abaixo da dobra). */
  loadingLazy?: boolean;
}

interface MediaProps {
  src?: string;
  videoSrc?: string;
  videoSources?: VideoSource[];
  posterSrc?: string;
  alt: string;
  className?: string;
  loadingLazy?: boolean;
}

const GlitchMedia = memo(function GlitchMedia({
  src,
  videoSrc,
  videoSources,
  posterSrc,
  alt,
  className,
  loadingLazy = false,
}: MediaProps) {
  const sources = videoSources?.length
    ? videoSources
    : videoSrc
      ? [{ src: videoSrc, type: "video/mp4" }]
      : [];

  if (sources.length > 0) {
    return (
      <video
        aria-label={alt}
        title={alt}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        preload={loadingLazy ? "none" : "metadata"}
        className={cn("object-cover w-full h-full", className)}
      >
        {sources.map(({ src: s, type }) => (
          <source key={s} src={s} type={type} />
        ))}
      </video>
    );
  }

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loadingLazy ? "lazy" : undefined}
      decoding="async"
      className={cn("object-cover w-full h-full", className)}
    />
  );
});

interface GlitchLayerProps {
  src?: string;
  videoSrc?: string;
  videoSources?: VideoSource[];
  posterSrc?: string;
  alt: string;
  className?: string;
  loadingLazy?: boolean;
  layerClass: string;
  transform: string;
}

const GlitchLayer = memo(function GlitchLayer({
  src,
  videoSrc,
  videoSources,
  posterSrc,
  alt,
  className,
  loadingLazy,
  layerClass,
  transform,
}: GlitchLayerProps) {
  return (
    <div className={cn(layerClass, "absolute inset-0 mix-blend-screen opacity-0 is-active")}>
      <div className="h-full w-full" style={{ transform }}>
        <GlitchMedia
          src={src}
          videoSrc={videoSrc}
          videoSources={videoSources}
          posterSrc={posterSrc}
          alt={alt}
          loadingLazy={loadingLazy}
          className={cn("filter contrast-125 saturate-200", className)}
        />
      </div>
    </div>
  );
});

export function GlitchImage({
  src,
  videoSrc,
  videoSources,
  posterSrc,
  alt,
  active = false,
  className,
  loadingLazy = false,
}: GlitchImageProps) {
  const reducedMotion = useReducedMotion();
  const shouldActivateGlitch = active && !reducedMotion;

  return (
    <div className="glitch-container relative w-full h-full overflow-hidden bg-black">
      <GlitchMedia
        src={src}
        videoSrc={videoSrc}
        videoSources={videoSources}
        posterSrc={posterSrc}
        alt={alt}
        loadingLazy={loadingLazy}
        className={cn("glitch-base-img", className)}
      />

      {shouldActivateGlitch && (
        <>
          <GlitchLayer
            src={src}
            videoSrc={videoSrc}
            videoSources={videoSources}
            posterSrc={posterSrc}
            alt={alt}
            loadingLazy={loadingLazy}
            className={className}
            layerClass="glitch-layer-1"
            transform="translateX(-4px)"
          />

          <GlitchLayer
            src={src}
            videoSrc={videoSrc}
            videoSources={videoSources}
            posterSrc={posterSrc}
            alt={alt}
            loadingLazy={loadingLazy}
            className={className}
            layerClass="glitch-layer-2"
            transform="translateX(4px)"
          />

          <GlitchLayer
            src={src}
            videoSrc={videoSrc}
            videoSources={videoSources}
            posterSrc={posterSrc}
            alt={alt}
            loadingLazy={loadingLazy}
            className={className}
            layerClass="glitch-layer-3 mix-blend-overlay"
            transform="translateY(-2px)"
          />
        </>
      )}

      <div
        className={cn(
          "glitch-block glitch-block-magenta pointer-events-none",
          shouldActivateGlitch && "is-active"
        )}
      />
      <div
        className={cn(
          "glitch-block glitch-block-screen pointer-events-none",
          shouldActivateGlitch && "is-active"
        )}
      />
    </div>
  );
}

export default GlitchImage;
