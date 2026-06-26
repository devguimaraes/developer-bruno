import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Clock, Filter, Terminal } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { SearchBar, BlogFilters, BlogFiltersDrawer, BlogSidebar } from "../blog";

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  initialPosts?: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPosts = [] }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extrair todas as categorias únicas
  const categories = useMemo(() => {
    const allTags = initialPosts.flatMap(post => post.tags || []);
    return Array.from(new Set(allTags)).sort();
  }, [initialPosts]);

  // Lógica de filtragem e busca
  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || post.tags?.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchQuery, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="bg-black min-h-screen pt-[72px] sm:pt-[88px] overflow-x-clip">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-12 xl:gap-20 max-w-7xl mx-auto py-12">
          {/* Column 1: Filters (Desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <BlogFilters
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={cat => {
                  setActiveCategory(cat);
                  setVisibleCount(POSTS_PER_PAGE);
                }}
              />
            </div>
          </aside>

          {/* Column 2: Main Feed */}
          <main className="min-w-0">
            {/* Header Section */}
            <header className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-5 h-5 text-accent" />
                <p className="type-mono text-[11px] text-white/40 uppercase tracking-[0.3em]">
                  {"// BIBLIOTECA_DE_INSIGHTS"}
                </p>
              </div>
              <h1 className="type-raster-section text-[12vw] sm:text-6xl md:text-7xl text-white uppercase tracking-tighter leading-[0.9] mb-8">
                ÍNDICE DE
                <br />
                CONHECIMENTO
              </h1>

              {/* Mobile Search + Filter */}
              <div className="lg:hidden space-y-4 mb-8">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="flex items-center gap-2 px-4 min-h-[48px] border-2 border-white/10 text-white hover:border-accent/40 transition-colors pressable"
                  >
                    <Filter size={16} />
                    <span className="type-mono text-[11px]">Filtrar</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {visiblePosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group flex flex-col h-full border-2 border-white/5 hover:border-accent/40 transition-all bg-stone-950/20 shadow-none hover:shadow-brutal"
                  >
                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-stone-950/40">
                      <span className="type-mono text-[11px] text-stone-500 uppercase tracking-widest truncate">
                        {post.slug}.md
                      </span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-accent/20" />
                        <div className="w-1.5 h-1.5 bg-accent/40" />
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex gap-4 type-mono text-[11px] text-stone-500 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-accent/60">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-stone-400 text-xs md:text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="border border-white/10 text-stone-500 px-2 py-0.5 type-mono text-[11px] uppercase tracking-widest"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 type-mono text-accent/80 hover:text-accent transition-colors uppercase tracking-widest shrink-0 px-2 py-1 min-h-[44px]"
                        >
                          Acessar <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-24 border-2 border-dashed border-white/5">
                <p className="type-mono text-stone-600 uppercase tracking-[0.2em] text-xs">
                  Nenhum registro encontrado para a busca
                </p>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
                  className="border-2 border-white/20 text-white hover:border-accent hover:text-accent hover:shadow-brutal px-10 py-4 type-mono uppercase tracking-widest transition-all bg-black pressable"
                >
                  Carregar mais ({filteredPosts.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </main>

          {/* Column 3: Search & Utilities (Desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-10">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <BlogSidebar posts={initialPosts} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <BlogFiltersDrawer
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={cat => {
          setActiveCategory(cat);
          setVisibleCount(POSTS_PER_PAGE);
        }}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />
    </div>
  );
};

export default BlogPage;
