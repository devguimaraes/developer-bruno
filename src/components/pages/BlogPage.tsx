import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/types/blog";

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  initialPosts?: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPosts = [] }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const blogPosts = initialPosts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visiblePosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  return (
    <div className="bg-black min-h-screen pt-20 sm:pt-24 overflow-x-clip">
      {/* Header */}
      <div className="pt-6 sm:pt-8 pb-10 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 sm:mb-16">
            <p className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
              {"// LATEST_POSTS"} &middot; TOTAL: {blogPosts.length}
            </p>
            <h1 className="type-raster-section text-[14vw] sm:text-5xl md:text-7xl text-white uppercase tracking-tighter leading-[0.92]">
              TODOS OS
              <br />
              INSIGHTS
            </h1>
            <div className="border-t border-white/10 mt-6 pt-4 max-w-md">
              <p className="type-mono text-xs text-white/40">
                Biblioteca completa de conhecimentos tecnicos e reflexoes sobre desenvolvimento web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visiblePosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index < POSTS_PER_PAGE ? index * 0.1 : 0 }}
              className="group flex flex-col h-full border border-white/10 hover:border-accent/30 transition-colors"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <span className="type-mono text-[10px] text-white/40 uppercase tracking-widest truncate max-w-[200px]">
                  {post.slug}.md
                </span>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full border border-white/20" />
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <div className="flex gap-4 type-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>

                <p className="text-white/50 text-sm mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>

                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="border border-white/20 text-white/60 px-2.5 py-1 rounded-full type-mono text-[9px] uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="type-mono text-[9px] text-white/30">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 type-mono text-[10px] text-white/60 hover:text-accent transition-colors uppercase tracking-widest shrink-0"
                  >
                    Ler <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
              className="border border-white/20 text-white hover:border-accent hover:text-accent px-8 py-3 type-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              Carregar mais ({blogPosts.length - visibleCount} restantes)
            </button>
          </div>
        )}

        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="type-mono text-white/40 uppercase tracking-widest">
              Nenhum post encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
