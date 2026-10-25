import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Giro } from "../brand/Giro";
import { Button } from "./Button";

/** Tempo que o estado copiado fica na tela antes de voltar ao repouso. */
export const COPIED_FEEDBACK_MS = 1800;

type CopyStatus = "idle" | "copied" | "error";

export interface CopyButtonProps {
  /** Texto que vai para a área de transferência. */
  value: string;
  copyLabel: string;
  copiedLabel: string;
  /** Texto curto no próprio botão, como "Não deu para copiar". */
  errorLabel: string;
  /** Instrução de correção. Fica embaixo do botão, nunca dentro dele (decisão 57). */
  errorHint: string;
}

/** Botão que copia um texto e responde no próprio lugar, sem toast. */
export function CopyButton({
  value,
  copyLabel,
  copiedLabel,
  errorLabel,
  errorHint,
}: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch (error) {
      console.error("Failed to copy text:", error);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2" aria-live="polite">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClick}
        status={status === "copied" ? "done" : "idle"}
        lead={
          status === "error" ? (
            <Giro state="error" />
          ) : (
            <Copy className="g-icon" aria-hidden="true" />
          )
        }
      >
        {status === "copied" ? copiedLabel : status === "error" ? errorLabel : copyLabel}
      </Button>
      {status === "error" && <p className="micro text-s-muted">{errorHint}</p>}
    </div>
  );
}
