import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { FileText, X, Calendar, Clock, Tag, ArrowRight, FolderOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, BlogPost } from '@/utils/blog';

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await getAllBlogPosts();
      setBlogPosts(posts);
    };
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="fixed top-0 w-full z-50 bg-black text-white border-b-4 border-white/20 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-white flex items-center justify-center text-black shadow-neo transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none">
                <span className="font-black font-mono text-sm">BG</span>
             </div>
             <span className="text-sm font-bold hover:text-brutal-orange transition-colors">← VOLTAR</span>
          </Link>

          <div className="font-mono text-xs tracking-widest opacity-60">
            ~/BLOG
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 relative z-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brutal-purple border-2 border-black text-white px-3 py-1 font-mono font-bold text-xs mb-4 shadow-neo">
                <FolderOpen size={14} />
                ~/DOCUMENTS/BLOG
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                BLOG<br/>
                <span className="text-transparent bg-clip-text bg-black text-stroke-2">
                  COMPLETO
                </span>
              </h1>
            </div>
            <p className="max-w-md font-mono text-sm bg-stone-100 border-2 border-black p-4 shadow-neo">
               Todos os insights técnicos, dicas de performance e pensamentos sobre desenvolvimento web em um lugar só.
            </p>
          </div>

        </div>
      </div>

      {/* Grid Completo de Posts */}
      <section className="py-24 bg-stone-50">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
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
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-1 font-black text-sm hover:underline decoration-4 decoration-brutal-yellow underline-offset-2"
                    >
                      LER ARQUIVO <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

        {/* Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black text-white border-4 border-black p-6 text-center shadow-brutal-lg">
              <FolderOpen className="w-8 h-8 mx-auto mb-4 text-brutal-yellow" />
              <div className="font-mono text-2xl font-black">{blogPosts.length}</div>
              <div className="text-sm text-gray-300 font-mono">POSTS PUBLICADOS</div>
            </div>

            <div className="bg-brutal-yellow text-black border-4 border-black p-6 text-center shadow-brutal-lg">
              <Calendar className="w-8 h-8 mx-auto mb-4" />
              <div className="font-mono text-2xl font-black">2023</div>
              <div className="text-sm font-bold font-mono">ANO DE CONTEÚDO</div>
            </div>

            <div className="bg-brutal-orange text-white border-4 border-black p-6 text-center shadow-brutal-lg">
              <Tag className="w-8 h-8 mx-auto mb-4" />
              <div className="font-mono text-2xl font-black">9</div>
              <div className="text-sm font-bold font-mono">TAGS ÚNICAS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t-4 border-white/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-sm">
            © {new Date().getFullYear()} Bruno Guimarães | Blog Desenvolvedor Front-End |
            <span className="text-brutal-yellow">Powered by React & Neo-Brutalismo</span>
          </p>
        </div>
      </footer>

      {/* Modal de Leitura (Overlay) */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="bg-white w-full max-w-4xl h-[90vh] border-4 border-black shadow-brutal-lg flex flex-col animate-in zoom-in-95 duration-300 relative">

            {/* Modal Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black flex-shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="text-brutal-yellow" />
                <span className="font-mono font-bold text-sm md:text-base uppercase">
                  LENDO: {selectedPost.slug}.md
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-red-500 hover:bg-red-600 text-white p-1 border-2 border-white transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="overflow-y-auto p-6 md:p-12 bg-stone-50 custom-scrollbar">
              <div className="max-w-3xl mx-auto">
                {/* Meta Data */}
                <div className="mb-8 pb-8 border-b-4 border-stone-300 border-dashed">
                  <div className="flex flex-wrap gap-4 mb-4 text-sm font-mono font-bold text-stone-500">
                    <span className="bg-stone-200 px-2 py-1 text-black">{selectedPost.date}</span>
                    <span className="bg-stone-200 px-2 py-1 text-black">{selectedPost.readTime} leitura</span>
                    {selectedPost.tags.map(tag => (
                      <span key={tag} className="text-brutal-orange">#{tag}</span>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight">
                    {selectedPost.title}
                  </h1>
                </div>

                {/* Markdown Body */}
                <div className="markdown-content font-medium text-stone-800">
                  <Markdown>{selectedPost.content}</Markdown>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t-4 border-black text-center">
                  <p className="font-mono text-sm font-bold text-stone-500 mb-4">
                    *** FIM DO ARQUIVO ***
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="bg-black text-white font-bold px-6 py-3 border-4 border-transparent hover:border-brutal-orange hover:bg-stone-900 transition-all shadow-neo"
                    >
                      FECHAR LEITURA
                    </button>
                    <Link
                      to="/"
                      className="bg-brutal-orange text-black font-bold px-6 py-3 border-4 border-transparent hover:bg-brutal-orange/90 hover:border-black transition-all shadow-neo"
                    >
                      VOLTAR AO PORTFÓLIO
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;