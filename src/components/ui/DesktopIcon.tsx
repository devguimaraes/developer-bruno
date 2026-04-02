import React from "react";

import { LucideIcon } from "lucide-react";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon: Icon,
  label,
  onClick,
  color = "bg-black"
}) => {
  return (
    <button
      onClick={onClick}
      className="desktop-icon group"
    >
      <div className={`w-16 h-16 ${color} text-white flex items-center justify-center pixel-border-sm group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>
      <span className="font-pixel text-[10px] bg-black text-white px-1 mt-1 group-hover:bg-brutal-orange transition-colors">
        {label.toUpperCase()}
      </span>
    </button>
  );
};
