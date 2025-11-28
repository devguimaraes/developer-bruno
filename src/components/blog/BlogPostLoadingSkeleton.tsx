import React from 'react';
import { ACCESSIBILITY_LABELS } from '@/constants/ui';

export const BlogPostLoadingSkeleton: React.FC = () => {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-28 animate-pulse"
      role="status"
      aria-label={ACCESSIBILITY_LABELS.LOADING_POSTS}
      aria-busy="true"
    >
      {/* Header Skeleton */}
      <div className="mb-12">
        <div className="h-16 w-3/4 bg-brutal-gray border-2 border-black rounded-sm mb-6"></div>

        {/* Meta information skeleton */}
        <div className="flex flex-wrap items-center gap-4 text-sm mb-8" aria-hidden="true">
          <div className="flex items-center gap-2 h-6 w-32 bg-brutal-gray border-2 border-black rounded-sm"></div>
          <div className="flex items-center gap-2 h-6 w-24 bg-brutal-gray border-2 border-black rounded-sm"></div>
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-8" aria-hidden="true">
          <div className="h-6 w-16 bg-brutal-gray border-2 border-black rounded-sm"></div>
          <div className="h-6 w-20 bg-brutal-gray border-2 border-black rounded-sm"></div>
          <div className="h-6 w-14 bg-brutal-gray border-2 border-black rounded-sm"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div
        className="prose prose-xl max-w-none prose-headings:border-2 prose-headings:border-black prose-headings:font-bold prose-p:border-2 prose-p:border-black prose-p:p-4 prose-li:border-2 prose-li:border-black prose-pre:border-2 prose-pre:border-black prose-code:border-2 prose-code:border-black"
        aria-hidden="true"
      >
        {/* Article content skeleton */}
        <div className="space-y-6">
          {/* Multiple paragraph skeletons */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-5/6 bg-brutal-gray border-2 border-black rounded-sm"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-4/5 bg-brutal-gray border-2 border-black rounded-sm"></div>
          </div>

          {/* Heading skeleton */}
          <div className="h-8 w-3/4 bg-brutal-gray border-2 border-black rounded-sm mt-8"></div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-2/3 bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
          </div>

          {/* Code block skeleton */}
          <div className="h-32 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-5/6 bg-brutal-gray border-2 border-black rounded-sm"></div>
          </div>

          {/* Another heading skeleton */}
          <div className="h-8 w-2/3 bg-brutal-gray border-2 border-black rounded-sm mt-8"></div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-full bg-brutal-gray border-2 border-black rounded-sm"></div>
            <div className="h-4 w-3/4 bg-brutal-gray border-2 border-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="mt-12 pt-8 border-t-4 border-black">
        <div className="flex justify-between items-center">
          <div className="h-10 w-24 bg-brutal-gray border-2 border-black rounded-sm"></div>
          <div className="h-10 w-24 bg-brutal-gray border-2 border-black rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostLoadingSkeleton;