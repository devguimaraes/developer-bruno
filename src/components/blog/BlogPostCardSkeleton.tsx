export function BlogPostCardSkeleton({ count = 3 }: { count?: number }) {
  const skeletonIds = Array.from({ length: count }, (_, index) => `blog-post-skeleton-${index}`);

  return (
    <>
      {skeletonIds.map(id => (
        <div key={id} className="border border-white/10 animate-pulse">
          <div className="p-4 border-b border-white/10">
            <div className="h-3 bg-white/5 w-24" />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-3 bg-white/5 w-20" />
            <div className="h-5 bg-white/5 w-3/4" />
            <div className="h-3 bg-white/5 w-full" />
            <div className="h-3 bg-white/5 w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}
