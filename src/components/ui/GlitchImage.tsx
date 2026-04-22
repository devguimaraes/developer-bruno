import type React from "react";
import { cn } from "@/lib/utils";
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

const GlitchMedia: React.FC<MediaProps> = ({
  src,
  videoSrc,
  videoSources,
  posterSrc,
  alt,
  className,
  loadingLazy = false,
}) => {
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
};

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
  const layerMediaClass = "filter contrast-125 saturate-200";

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

      <div
        className={cn(
          "glitch-layer-1 absolute inset-0 mix-blend-screen opacity-0",
          active && "is-active"
        )}
      >
        <div className="h-full w-full" style={{ transform: "translateX(-4px)" }}>
          <GlitchMedia
            src={src}
            videoSrc={videoSrc}
            videoSources={videoSources}
            posterSrc={posterSrc}
            alt={alt}
            loadingLazy={loadingLazy}
            className={cn(layerMediaClass, className)}
          />
        </div>
      </div>

      <div
        className={cn(
          "glitch-layer-2 absolute inset-0 mix-blend-screen opacity-0",
          active && "is-active"
        )}
      >
        <div className="h-full w-full" style={{ transform: "translateX(4px)" }}>
          <GlitchMedia
            src={src}
            videoSrc={videoSrc}
            videoSources={videoSources}
            posterSrc={posterSrc}
            alt={alt}
            loadingLazy={loadingLazy}
            className={cn(layerMediaClass, className)}
          />
        </div>
      </div>

      <div
        className={cn(
          "glitch-layer-3 absolute inset-0 mix-blend-overlay opacity-0",
          active && "is-active"
        )}
      >
        <div className="h-full w-full" style={{ transform: "translateY(-2px)" }}>
          <GlitchMedia
            src={src}
            videoSrc={videoSrc}
            videoSources={videoSources}
            posterSrc={posterSrc}
            alt={alt}
            loadingLazy={loadingLazy}
            className={cn(layerMediaClass, className)}
          />
        </div>
      </div>

      <div
        className={cn(
          "glitch-block glitch-block-magenta pointer-events-none",
          active && "is-active"
        )}
      />
      <div
        className={cn(
          "glitch-block glitch-block-screen pointer-events-none",
          active && "is-active"
        )}
      />
    </div>
  );
}

export default GlitchImage;
