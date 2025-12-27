import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-neo-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-brutal-yellow text-black hover:bg-yellow-300",
        brutal: "bg-brutal-orange text-white hover:bg-orange-600",
        purple: "bg-brutal-purple text-white hover:bg-purple-600",
        green: "bg-brutal-green text-white hover:bg-green-600",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "bg-white text-foreground hover:bg-stone-100",
        dark: "bg-black text-white hover:bg-stone-800",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BadgeVariantsProps = VariantProps<typeof badgeVariants>;
