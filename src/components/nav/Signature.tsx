import type { CSSProperties } from "react";
import { Giro } from "@/components/brand/Giro";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";

export interface SignatureProps {
  /** Tamanho da fonte em px. Sem ele vale o CSS: 26 px no header, 72 e 48 px no rodapé. */
  size?: number;
  className?: string;
}

/** "bruno guimarães" com o Giro no lugar do "o". Leva para o início. */
export function Signature({ size, className }: SignatureProps) {
  const locale = useLocale();
  const style: CSSProperties | undefined =
    size === undefined ? undefined : { fontSize: `${size}px` };

  return (
    <a
      href="/"
      className={["g-signature", className].filter(Boolean).join(" ")}
      aria-label={t(locale, "global.signature_label")}
      style={style}
    >
      <span>brun</span>
      <span className="g-signature__o">
        <Giro signature />
      </span>
      <span>&nbsp;guimarães</span>
    </a>
  );
}
