import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  "bg-card text-card-foreground border-4 border-black transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-brutal",
        elevated: "shadow-brutal-lg",
        interactive: "shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer",
        flat: "shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type CardVariantsProps = VariantProps<typeof cardVariants>;
