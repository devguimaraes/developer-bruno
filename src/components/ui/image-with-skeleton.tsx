import React, { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  className,
  wrapperClassName,
  alt,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Se a imagem já foi carregada do cache antes do React registrar o onLoad, atualizar o state
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {isLoading && (
        <Skeleton className={cn("absolute inset-0 w-full h-full", className)} />
      )}
      <img
        ref={imgRef}
        className={cn(
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        alt={alt}
        loading="lazy"
        {...props}
      />
    </div>
  );
};
