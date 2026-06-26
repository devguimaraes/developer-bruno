import type React from "react";
import type { BlogPost } from "@/types/blog";
import { BookOpen, Hash, TrendingUp } from "lucide-react";

interface BlogSidebarProps {
  posts: BlogPost[];
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({ posts }) => {
  const totalReadTime = posts.reduce((acc, p) => {
    const time = parseInt(p.readTime, 10) || 5;
    return acc + time;
  }, 0);

  // Priorizar posts em destaque (featured) para as recomendações
  const recommendedPosts = posts
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Search Space Placeholder - a busca será integrada no BlogPageClient */}

      {/* Stats Card */}
      <div className="border-2 border-white p-5 shadow-brutal bg-black group hover:-translate-x-1 hover:-translate-y-1 transition-transform">
        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
          <div className="w-2 h-2 bg-accent shadow-[2px_2px_0px_#000]" />
          <h3 className="text-xs lg:text-sm font-pixel uppercase tracking-[0.2em] text-white">
            Status da Biblioteca
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-stone-500">
              <BookOpen className="w-3 h-3" />
              <span className="text-[11px] font-mono uppercase tracking-tighter">Artigos</span>
            </div>
            <span className="text-xs font-bold text-accent">{posts.length}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-stone-500">
              <Hash className="w-3 h-3" />
              <span className="text-[11px] font-mono uppercase tracking-tighter">Conhecimento</span>
            </div>
            <span className="text-xs font-bold text-accent">~{totalReadTime} MIN</span>
          </div>
        </div>
      </div>

      {/* Trending / Recommended */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-accent" />
          <h3 className="text-xs font-pixel uppercase tracking-[0.2em] text-stone-500">
            Leituras Recomendadas
          </h3>
        </div>

        <div className="space-y-6">
          {recommendedPosts.map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group block space-y-2">
              <h4 className="text-xs font-bold text-stone-300 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600 uppercase">
                <span>{post.date}</span>
                <span>&middot;</span>
                <span>{post.readTime}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Tech Stack Indicator */}
      <div className="pt-8 border-t border-white/5">
        <p className="text-[10px] font-mono text-stone-800 uppercase tracking-[0.3em] leading-relaxed">
          Indexado via Astro Content Collections v5.0
          <br />
          Renderizado em React 18.3
        </p>
      </div>
    </div>
  );
};
