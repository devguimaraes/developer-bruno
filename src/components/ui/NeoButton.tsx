/**
 * NeoButton - Legacy compatibility wrapper
 *
 * This component has been unified with the main Button component.
 * It now re-exports Button with the 'brutal' variant as default.
 *
 * @deprecated Use Button component directly with variant="brutal" instead
 */
import React from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface NeoButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "outline";
  icon?: boolean;
  fullWidth?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = "primary",
  icon = false,
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  // Map legacy variants to new Button variants
  const variantMap = {
    primary: "brutal" as const,
    secondary: "secondary" as const,
    outline: "outline" as const,
  };

  return (
    <Button
      variant={variantMap[variant]}
      icon={icon}
      className={cn(fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
};
