import React from "react";

import {
  Calendar,
  Clock,
  ArrowRight,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import type { BlogPost } from "@/types/blog";
import {
  FadeInStagger,
  FadeInItem,
  TextReveal,
} from "@/components/ui/motion-components";

type BlogProps = React.HTMLAttributes<HTMLElement> & { posts?: BlogPost[] };

const Blog: React.FC<BlogProps> = ({ className, posts: blogPosts = [], ...props }) => {
  return (
    <section
      {...props}
      className={`py-24 bg-white relative ${className ?? ""}`}
    >
      {/* Neo-Brutalist Background */}
      <div className="absolute inset-0 bg-neo-dots opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-2 bg-brutal-purple" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-brutal-purple border-2 border-black text-white px-3 py-1 font-mono font-bold text-xs mb-4 shadow-neo">
              <FolderOpen size={14} />
              ~/DOCUMENTS/BLOG
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              <TextReveal text="INSIGHTS" />
              <br />
              <span className="text-transparent bg-clip-text bg-black text-stroke-2">
                <TextReveal text="TÉCNICOS" delay={0.2} />
              </span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-sm bg-stone-100 border-2 border-black p-4 shadow-neo">
            <TextReveal
              text="Pensamentos sobre código, design e a entropia do desenvolvimento web moderno."
              delay={0.4}
            />
          </p>
        </div>

        {/* Grid de Posts */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">
              Nenhum post encontrado.
            </p>
            <p className="text-sm text-gray-400">
              Adicione arquivos .md em src/content/blog/
            </p>
          </div>
        ) : (
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <FadeInItem
                key={post.slug}
                className="group bg-white border-4 border-black flex flex-col h-full transition-all duration-300 shadow-brutal-lg hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2"
              >
                {/* Accent Border Top */}
                <div className="h-2 bg-brutal-orange w-full" />
                <div className="bg-stone-100 border-b-4 border-black p-3 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold uppercase truncate max-w-[200px] flex items-center gap-2">
                    <span className="w-2 h-2 bg-brutal-green rounded-full animate-pulse" />
                    {post.slug}.md
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-black" />
                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex gap-4 text-xs font-mono font-bold text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black leading-tight mb-4 line-clamp-2 group-hover:text-brutal-orange transition-colors uppercase tracking-tight">
                    {post.title}
                  </h3>

                  <p className="text-stone-600 font-medium mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t-2 border-stone-200 flex justify-between items-center">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 font-black text-sm hover:underline decoration-4 decoration-brutal-yellow underline-offset-2"
                    >
                      LER_ARQUIVO <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        )}

        {/* Botão Ver Todos */}
        <div className="my-12 text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 border-4 border-black hover:border-brutal-orange hover:bg-stone-900 transition-all shadow-neo group"
          >
            VER TODOS OS POSTS
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
