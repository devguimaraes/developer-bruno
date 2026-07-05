interface BlogPostTagsProps {
  tags: string[];
}

export function BlogPostTags({ tags }: BlogPostTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-14 pt-8 border-t border-white/[0.08]">
      {tags.map(tag => (
        <span
          key={tag}
          className="type-mono text-[10px] tracking-[0.16em] text-white/45 border border-white/[0.14] px-3 py-1.5"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
