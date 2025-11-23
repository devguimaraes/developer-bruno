import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, ArrowRight, FolderOpen, Home, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, BlogPost } from '@/utils/blog';

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getAllBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Erro ao carregar posts no BlogPage:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <>
      {/* Header with proper padding for fixed navigation */}
      <div className="pt-24">

        {/* Header */}
        <div className="pt-8 pb-16">
          <div className="container mx-auto px-4 relative z-10">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-brutal-purple border-2 border-black text-white px-3 py-1 font-mono font-bold text-xs mb-4 shadow-neo">
                  <FolderOpen size={14} />
                  ~/DOCUMENTS/BLOG
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                  TODOS OS<br/>
                  <span className="text-transparent bg-clip-text bg-black text-stroke-2">
                    INSIGHTS
                  </span>
                </h2>
              </div>
              <p className="max-w-md font-mono text-sm bg-stone-100 border-2 border-black p-4 shadow-neo">
                Biblioteca completa de conhecimentos técnicos e reflexões sobre desenvolvimento web.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16 relative z-10">

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white border-4 border-black flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 shadow-brutal-lg hover:shadow-[12px_12px_0px_0px_#f97316]"
              >
                {/* Header do Card */}
                <div className="bg-stone-100 border-b-4 border-black p-3 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold uppercase truncate max-w-[200px]">{post.slug}.md</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <div className="w-2 h-2 rounded-full border border-black"></div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex gap-4 text-xs font-mono font-bold text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>

                  <h3 className="text-2xl font-black leading-tight mb-4 line-clamp-2 group-hover:text-brutal-orange transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-stone-600 font-medium mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t-2 border-stone-200 flex justify-between items-center">
                    <div className="flex gap-2">
                      {post.tags.slice(0,2).map(tag => (
                        <span key={tag} className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 font-black text-sm hover:underline decoration-4 decoration-brutal-yellow underline-offset-2"
                    >
                      LER ARQUIVO <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {blogPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">Nenhum post encontrado.</p>
              <p className="text-sm text-gray-400">Adicione arquivos .md em src/content/blog/</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default BlogPage;