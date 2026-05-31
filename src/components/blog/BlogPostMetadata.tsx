import type React from "react";
import type { BlogPost } from "@/types/blog";
import { Calendar, Clock, User, Tag as TagIcon } from "lucide-react";

interface BlogPostMetadataProps {
  post: BlogPost;
}

export const BlogPostMetadata: React.FC<BlogPostMetadataProps> = ({ post }) => {
  return (
    <div className="border-2 border-white p-6 shadow-brutal bg-black mb-10 group hover:-translate-x-1 hover:-translate-y-1 transition-transform">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
        <div className="w-2 h-2 bg-accent shadow-[2px_2px_0px_#000]" />
        <h3 className="text-xs font-pixel uppercase tracking-[0.2em] text-white">Ficha Técnica</h3>
      </div>

      <div className="grid gap-6 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-stone-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-mono tracking-tighter">Data</span>
          </div>
          <p className="font-bold text-stone-200">{post.date}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-stone-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-mono tracking-tighter">Leitura</span>
          </div>
          <p className="font-bold text-stone-200">{post.readTime}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-stone-500">
            <User className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-mono tracking-tighter">Autor</span>
          </div>
          <p className="font-bold text-stone-200">{post.author}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-stone-500">
            <TagIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-mono tracking-tighter">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags?.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-bold border border-white/20 px-2 py-0.5 hover:border-accent hover:text-accent cursor-pointer transition-colors uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
