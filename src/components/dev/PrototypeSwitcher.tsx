import { useEffect } from "react";

// Barra do protótipo. Fica de fora do que está sendo julgado e some em produção.
interface PrototypeSwitcherProps {
  variants: readonly { key: string; name: string }[];
  current: string;
  onChange: (key: string) => void;
}

const arrowStyle = {
  width: 36,
  height: 36,
  padding: 0,
  border: "none",
  borderRadius: 999,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  fontSize: 22,
  lineHeight: 1,
  cursor: "pointer",
} as const;

export function PrototypeSwitcher({ variants, current, onChange }: PrototypeSwitcherProps) {
  const index = Math.max(
    0,
    variants.findIndex(item => item.key === current)
  );
  const item = variants[index] ?? variants[0];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.closest("input, textarea") !== null || target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = variants[(index + delta + variants.length) % variants.length];
      if (next) onChange(next.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onChange, variants]);

  if (!import.meta.env.DEV || !item) return null;

  const go = (delta: number) => {
    const next = variants[(index + delta + variants.length) % variants.length];
    if (next) onChange(next.key);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 20,
        transform: "translateX(-50%)",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 4,
        maxWidth: "calc(100vw - 24px)",
        padding: "6px 8px",
        borderRadius: 999,
        background: "var(--papel)",
        color: "var(--tinta)",
        boxShadow: "0 8px 24px rgba(11, 12, 31, 0.35)",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        fontWeight: 400,
        lineHeight: 1,
      }}
    >
      <button
        type="button"
        aria-label="variante anterior"
        onClick={() => go(-1)}
        style={arrowStyle}
      >
        ‹
      </button>
      <span style={{ padding: "0 8px", whiteSpace: "nowrap" }}>
        {item.key} ({item.name})
      </span>
      <button type="button" aria-label="próxima variante" onClick={() => go(1)} style={arrowStyle}>
        ›
      </button>
    </div>
  );
}
