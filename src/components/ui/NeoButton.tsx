import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: boolean;
  fullWidth?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  variant = 'primary',
  icon = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-bold text-lg transition-all duration-200 border-2 border-black focus:outline-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brutal-orange text-white shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-orange-600",
    secondary: "bg-brutal-yellow text-black shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-300",
    outline: "bg-white text-black shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-50"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {children}
      {icon && <ArrowRight className="ml-2 w-5 h-5" />}
    </button>
  );
};