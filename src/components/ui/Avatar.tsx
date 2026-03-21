import React from "react";
import { cn } from "@/lib/utils";
import avatarUrl from "@/assets/avatar.webp?url";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  containerClassName?: string;
}

/**
 * Reusable Avatar component for the brutalist portfolio.
 * Uses native <img> for instant loading and cross-page cache reliability (Astro compatible).
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  size = 250, 
  className, 
  containerClassName,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "aspect-square rounded-full bg-brutal-orange border-4 border-black p-1.5 overflow-hidden relative",
        containerClassName
      )}
      style={{ maxWidth: size }}
    >
      <img
        src={avatarUrl}
        alt="Bruno Guimarães"
        loading="eager"
        fetchPriority="high"
        className={cn(
          "w-full h-full object-cover rounded-full border-2 border-black contrast-110",
          className
        )}
        {...props}
      />
    </div>
  );
};
