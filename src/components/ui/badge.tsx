import * as React from "react";

import { cn } from "@/lib/utils";
import { badgeVariants, type BadgeVariantsProps } from "./badge-variants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantsProps {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge };
