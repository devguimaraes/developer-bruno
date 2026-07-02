import type { BlogPost } from "@/types/blog";

interface BlogPostBylineProps {
  post: BlogPost;
}

export function BlogPostByline({ post }: BlogPostBylineProps) {
  return (
    <div
      className="flex items-center gap-3.5 border-t border-b border-white/[0.08]"
      style={{ padding: "20px 0 40px", marginBottom: "56px" }}
    >
      <div className="w-10 h-10 bg-white pixel-border-sm flex items-center justify-center text-black shrink-0">
        <span className="font-pixel text-sm">BG</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className="font-silkscreen uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.80)" }}
        >
          {post.author}
        </span>
        <span
          className="font-silkscreen uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.16em", color: "rgba(255,255,255,0.30)" }}
        >
          Engenheiro Front-End
        </span>
      </div>
    </div>
  );
}
