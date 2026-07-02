interface BlogPostTagsProps {
  tags: string[];
}

export function BlogPostTags({ tags }: BlogPostTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-14 pt-8 border-t border-white/10">
      {tags.map(tag => (
        <span
          key={tag}
          className="font-silkscreen uppercase"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "6px 12px 5px",
            fontSize: "10px",
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
