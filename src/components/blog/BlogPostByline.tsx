import type { BlogPost } from "@/types/blog";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

interface BlogPostBylineProps {
  post: BlogPost;
}

export function BlogPostByline({ post }: BlogPostBylineProps) {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-3.5 border-t border-b border-white/[0.08] py-5 pb-10 mb-14">
      <div className="w-10 h-10 bg-white pixel-border-sm flex items-center justify-center text-black shrink-0">
        <span className="font-pixel text-sm">BG</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="type-mono text-[10px] text-white/80">{post.author}</span>
        <span className="type-mono text-[9px] text-white/30 tracking-[0.16em]">
          {t(locale, "blog.author_role")}
        </span>
      </div>
    </div>
  );
}
