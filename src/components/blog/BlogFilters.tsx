import type React from "react";

interface BlogFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-10">
      <div className="group">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-accent shadow-[2px_2px_0px_#000]" />
          <h3 className="text-xs font-pixel uppercase tracking-[0.2em] text-stone-500 group-hover:text-white transition-colors">
            Categorias
          </h3>
        </div>

        <div className="flex flex-col items-start gap-4">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`group relative text-[10px] uppercase tracking-[0.2em] font-mono transition-all duration-300 ${
              activeCategory === "all"
                ? "text-accent font-bold translate-x-2"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            {activeCategory === "all" && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-accent">&gt;</span>
            )}
            [ TODAS ]
          </button>

          {categories.map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`group relative text-[10px] uppercase tracking-[0.2em] font-mono transition-all duration-300 ${
                activeCategory === cat
                  ? "text-accent font-bold translate-x-2"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {activeCategory === cat && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-accent">&gt;</span>
              )}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 border border-stone-700" />
          <h4 className="text-[10px] font-pixel uppercase tracking-widest text-stone-600">
            Cronologia
          </h4>
        </div>
        <p className="text-[9px] font-mono text-stone-700 uppercase tracking-tighter">
          Arquivo completo (2024 - 2026)
        </p>
      </div>
    </div>
  );
};
