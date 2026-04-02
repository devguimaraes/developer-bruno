import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "relative inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap font-bold font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 border-4 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90",
        brutal: "bg-brutal-orange text-white shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-orange-600",
        secondary: "bg-brutal-yellow text-black shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-300",
        outline: "bg-white text-black shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-stone-100",
        destructive: "bg-destructive text-destructive-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-destructive/90",
        ghost: "border-transparent bg-transparent shadow-none hover:bg-muted active:shadow-none",
        link: "border-transparent bg-transparent shadow-none text-primary underline-offset-4 hover:underline active:shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-11 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
