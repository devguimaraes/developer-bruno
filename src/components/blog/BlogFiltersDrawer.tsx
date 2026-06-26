import type React from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BlogFiltersDrawerProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogFiltersDrawer: React.FC<BlogFiltersDrawerProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  isOpen,
  onClose,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCategoryChange = (cat: string) => {
    onCategoryChange(cat);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar filtros"
        className={`fixed inset-0 z-[100] w-full h-full bg-black/60 backdrop-blur-sm transition-opacity duration-300 border-0 cursor-pointer ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        onKeyDown={e => {
          if (e.key === "Escape") onClose();
        }}
      ></button>

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 z-[110] bg-black border-t-2 border-white/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-h-[70vh] overflow-y-auto rounded-t-2xl ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-pixel text-sm uppercase tracking-[0.2em] text-white">
            Filtrar por categoria
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors pressable"
            aria-label="Fechar filtros"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Category List */}
        <div className="px-6 py-6 space-y-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`w-full text-left px-4 py-3 min-h-[44px] font-mono text-sm uppercase tracking-[0.2em] transition-all pressable ${
              activeCategory === "all"
                ? "text-accent font-bold bg-accent/5 border-l-2 border-accent"
                : "text-stone-400 hover:text-white border-l-2 border-transparent"
            }`}
          >
            Todas as categorias
          </button>

          {categories.map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full text-left px-4 py-3 min-h-[44px] font-mono text-sm uppercase tracking-[0.2em] transition-all pressable ${
                activeCategory === cat
                  ? "text-accent font-bold bg-accent/5 border-l-2 border-accent"
                  : "text-stone-400 hover:text-white border-l-2 border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
