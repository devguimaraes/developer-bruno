import { ArrowLeft } from 'lucide-react';

export function BlogPostNotFound() {
  return (
    <div className="bg-black min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
          // ERROR_404
        </p>
        <h1 className="type-raster-section text-6xl text-white mb-6">NAO ENCONTRADO</h1>
        <p className="text-white/50 mb-8">Este post nao existe ou foi removido.</p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 border border-white/20 text-white hover:border-accent hover:text-accent px-6 py-3 type-mono text-[10px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar ao blog
        </a>
      </div>
    </div>
  );
}
