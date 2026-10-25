import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ResultStatProps {
  /** Número com prefixo ou sufixo opcional: "+40%", "−30%", "3x", "3,5x". */
  value: string;
  /** O que o número mede. */
  label: string;
  /** Fonte do dado, ex.: "SEMOGRJ · site multilíngue". */
  source: string;
}

const COUNT_MS = 900;
const FRAME_MS = 16;
const VALUE_PATTERN = /^(\D*?)(\d+(?:[.,]\d+)?)(\D*)$/;

interface ParsedValue {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  decimalSeparator: string;
}

function parseValue(value: string): ParsedValue | null {
  const match = VALUE_PATTERN.exec(value);
  if (!match) return null;
  const [, prefix = "", digits = "", suffix = ""] = match;
  const decimalSeparator = digits.includes(",") ? "," : ".";
  const separatorIndex = digits.indexOf(decimalSeparator);
  const decimals = separatorIndex === -1 ? 0 : digits.length - separatorIndex - 1;
  return {
    prefix,
    suffix,
    target: Number(digits.replace(",", ".")),
    decimals,
    decimalSeparator,
  };
}

export function ResultStat({ value, label, source }: ResultStatProps) {
  const reducedMotion = useReducedMotion();
  const parsed = parseValue(value);
  const target = parsed?.target;
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  // Fração da contagem, de 0 a 1 (curva de saída, como --ease-resolve).
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entered || reducedMotion || target === undefined) return;
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const step = () => {
      const elapsed = Math.min(1, (Date.now() - startedAt) / COUNT_MS);
      setProgress(1 - (1 - elapsed) ** 3);
      if (elapsed < 1) timer = setTimeout(step, FRAME_MS);
    };
    step();
    return () => clearTimeout(timer);
  }, [entered, reducedMotion, target]);

  // Com movimento reduzido o valor aparece pronto; sem número, o texto original.
  const ratio = reducedMotion ? 1 : progress;
  const text =
    parsed && target !== undefined
      ? `${parsed.prefix}${(target * ratio)
          .toFixed(parsed.decimals)
          .replace(".", parsed.decimalSeparator)}${parsed.suffix}`
      : value;

  return (
    <div className="g-stat" ref={ref}>
      <p className="g-stat__value">{text}</p>
      <p className="g-stat__label">{label}</p>
      <span className="g-stat__source">{source}</span>
    </div>
  );
}
