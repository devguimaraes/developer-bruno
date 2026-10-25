import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { Check } from "lucide-react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Escolha feita. Vira aria-pressed e mostra o check da Lucide. */
  selected?: boolean;
}

/** Chip selecionável para escolhas curtas (tipo de projeto, categoria do blog). */
export function Chip({
  selected = false,
  className,
  type = "button",
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={["g-chip", className].filter(Boolean).join(" ")}
      {...rest}
      aria-pressed={selected}
    >
      {selected && <Check className="g-icon g-chip__check" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Tag só de leitura (stack, categoria). Não é clicável. */
export function Tag({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={["g-tag", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </span>
  );
}
