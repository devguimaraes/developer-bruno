import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Giro } from "../brand/Giro";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";
/** idle: texto e ícone normais. loading: Giro loading e aria-busy. done: Giro done (estado pronto). */
export type ButtonStatus = "idle" | "loading" | "done";

interface ButtonClassOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  hasLead: boolean;
  className?: string;
}

function buttonClassName({ variant, size, hasLead, className }: ButtonClassOptions): string {
  return [
    "g-button",
    variant === "secondary" && "g-button--secondary",
    variant === "ghost" && "g-button--ghost",
    size === "sm" && "g-button--sm",
    hasLead && "g-button--lead",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone Lucide ou Giro na frente do texto. Some quando status não é idle. */
  lead?: ReactNode;
  /** Seta depois do texto, que anda 3 px no hover. */
  arrow?: boolean;
  status?: ButtonStatus;
}

export function Button({
  variant = "primary",
  size = "md",
  lead,
  arrow = false,
  status = "idle",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  const leadNode = status === "idle" ? lead : <Giro state={status} />;
  const hasLead = leadNode !== undefined && leadNode !== null;

  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, hasLead, className })}
      {...rest}
      aria-busy={status === "loading" || undefined}
    >
      {leadNode}
      {children}
      {arrow && <ArrowRight className="g-icon g-button__arrow" aria-hidden="true" />}
    </button>
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  lead?: ReactNode;
  arrow?: boolean;
}

/** Botão que é link (navegação para outra página ou seção). */
export function ButtonLink({
  variant = "primary",
  size = "md",
  lead,
  arrow = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      className={buttonClassName({
        variant,
        size,
        hasLead: lead !== undefined && lead !== null,
        className,
      })}
      {...rest}
    >
      {lead}
      {children}
      {arrow && <ArrowRight className="g-icon g-button__arrow" aria-hidden="true" />}
    </a>
  );
}

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** Nome acessível. Obrigatório, porque o botão não tem texto visível. */
  "aria-label": string;
}

export function IconButton({ className, type = "button", children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={["g-icon-button", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Seta antes do texto, apontando para trás. */
  back?: boolean;
}

/** Link com seta (g-link). Com back, a seta fica antes do texto e anda para a esquerda. */
export function ArrowLink({ back = false, className, children, ...rest }: ArrowLinkProps) {
  return (
    <a
      className={[back ? "g-link g-link--back" : "g-link", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {back && <ArrowLeft className="g-icon" aria-hidden="true" />}
      {children}
      {!back && <ArrowRight className="g-icon" aria-hidden="true" />}
    </a>
  );
}
