import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Giro } from "../brand/Giro";

export type NoticeVariant = "success" | "error";

export interface NoticeProps {
  variant: NoticeVariant;
  children: ReactNode;
  id?: string;
  className?: string;
}

/**
 * Aviso em pílula com o Giro do estado à esquerda. O erro é sempre tinta com Giro coral
 * (o CSS cuida disso), em qualquer superfície.
 */
export function Notice({ variant, children, id, className }: NoticeProps) {
  const isError = variant === "error";
  return (
    <span
      id={id}
      role={isError ? "alert" : "status"}
      className={cn("g-notice", isError ? "g-notice--error" : "g-notice--success", className)}
    >
      <Giro state={isError ? "error" : "done"} size={32} />
      {children}
    </span>
  );
}

export interface EmptyStateProps {
  title: string;
  text?: string;
  backHref: string;
  backLabel: string;
}

/** Busca ou filtro sem resultado: Giro `empty` de 72 px, frase, explicação e caminho de volta. */
export function EmptyState({ title, text, backHref, backLabel }: EmptyStateProps) {
  return (
    <div className="g-empty" role="status">
      <Giro state="empty" size={72} />
      <p className="g-empty__title">{title}</p>
      {text && <p className="g-empty__text">{text}</p>}
      <a href={backHref} className="text-sm underline underline-offset-4 decoration-2">
        {backLabel}
      </a>
    </div>
  );
}
