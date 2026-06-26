import type React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="relative group">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-accent transition-colors" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="BUSCAR INSIGHTS..."
      className="w-full bg-black border-2 border-white/20 p-3 pl-10 text-[12px] font-mono uppercase tracking-widest focus:border-accent outline-none transition-colors placeholder:text-stone-700 min-h-[48px]"
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
      <div className="w-1 h-1 bg-accent" />
      <div className="w-1 h-1 bg-accent/50" />
    </div>
  </div>
);
