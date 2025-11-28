import React from 'react';

interface BlogPostSkeletonProps {
  /** Number of skeleton items to show */
  count?: number;
}

export const BlogPostSkeleton: React.FC<BlogPostSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border-4 border-black flex flex-col h-full animate-pulse"
        >
          {/* Header do Card - Skeleton */}
          <div className="p-6 border-b-4 border-black flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              {/* Categoria e Data - Skeleton */}
              <div className="flex items-center gap-3">
                <div className="h-4 w-16 bg-brutal-gray border-2 border-black rounded-sm"></div>
                <div className="h-4 w-20 bg-brutal-gray border-2 border-black rounded-sm"></div>
              </div>

              {/* Leitura - Skeleton */}
              <div className="h-4 w-12 bg-brutal-gray border-2 border-black rounded-sm"></div>
            </div>

            {/* Título - Skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
              <div className="h-8 w-3/4 bg-brutal-gray border-2 border-black rounded-sm"></div>
            </div>
          </div>

          {/* Conteúdo do Card - Skeleton */}
          <div className="p-6 flex-grow flex flex-col">
            {/* Resumo - Skeleton */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
              <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
              <div className="h-4 w-5/6 bg-brutal-gray border-2 border-black rounded-sm"></div>
              <div className="h-4 w-4/5 bg-brutal-gray border-2 border-black rounded-sm"></div>
            </div>

            {/* Tags - Skeleton */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 w-16 bg-brutal-gray border-2 border-black rounded-sm"></div>
              <div className="h-6 w-20 bg-brutal-gray border-2 border-black rounded-sm"></div>
              <div className="h-6 w-14 bg-brutal-gray border-2 border-black rounded-sm"></div>
            </div>

            {/* Botão - Skeleton */}
            <div className="mt-auto">
              <div className="w-full h-12 bg-brutal-gray border-4 border-black rounded-sm hover:bg-brutal-gray/80 flex items-center justify-center transition-colors duration-300">
                <div className="h-4 w-20 bg-brutal-gray-dark border-2 border-black rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPostSkeleton;