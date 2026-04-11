export function BlogPostLoadingSkeleton() {
  return (
    <div className="bg-black min-h-screen pt-24">
      <div className="container mx-auto px-4 max-w-4xl space-y-6 animate-pulse">
        <div className="h-4 bg-white/5 w-32" />
        <div className="h-10 bg-white/5 w-3/4" />
        <div className="h-4 bg-white/5 w-48" />
        <div className="h-4 bg-white/5 w-full" />
        <div className="h-4 bg-white/5 w-2/3" />
      </div>
    </div>
  );
}
