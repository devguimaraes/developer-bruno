import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Giro } from "@/components/brand/Giro";
import { PrototypeSwitcher } from "@/components/dev/PrototypeSwitcher";

// Protótipo: como a assinatura grande da tela de carregamento se dimensiona entre o celular e 1920px?
// A: clamp fluido de 50px/390 a 136px/1920, duas linhas abaixo de 960. B: degraus em 390, 768, 1024, 1440 e 1920, duas linhas só abaixo de 768. C: uma linha até o mínimo de 72px, com o código num degrau separado.

const VARIANTS = [
  { key: "A", name: "clamp fluido" },
  { key: "B", name: "degraus" },
  { key: "C", name: "encaixa e quebra" },
] as const;

type VariantKey = (typeof VARIANTS)[number]["key"];
type LineCount = 1 | 2;

const CODE_LINES = [
  "// desenvolvedor front-end",
  "// construo interfaces",
  "// design systems",
] as const;

const NAME_CLAMP = "clamp(50px, calc(50px + (100vw - 390px) * 86 / 1530), 136px)";
const CODE_CLAMP = "clamp(15px, calc(15px + (100vw - 390px) * 11 / 1530), 26px)";
const TWO_LINES_BELOW = 960;

const STEPS = [
  { min: 1920, name: 136, code: 26, lines: 1 },
  { min: 1440, name: 120, code: 24, lines: 1 },
  { min: 1024, name: 84, code: 22, lines: 1 },
  { min: 768, name: 64, code: 18, lines: 1 },
  { min: 0, name: 50, code: 15, lines: 2 },
] as const;

const FIT_MARGIN = 24;
const FIT_MIN = 72;
const FIT_MAX = 136;

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function parseVariant(value: string | null | undefined): VariantKey {
  const key = value?.toUpperCase();
  if (key === "B" || key === "C") return key;
  return "A";
}

function formatPx(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "…";
  const rounded = Math.round(value * 10) / 10;
  const [whole, frac] = rounded.toFixed(1).split(".");
  if (frac === "0") return `${whole}px`;
  return `${whole},${frac}px`;
}

function readPx(node: Element | null): number {
  if (!node) return 0;
  const value = Number.parseFloat(getComputedStyle(node).fontSize);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 10) / 10;
}

function useViewportWidth(): number {
  const [width, setWidth] = useState(0);
  useBrowserLayoutEffect(() => {
    const read = () => setWidth(window.innerWidth);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return width;
}

function OMark({ live }: { live: boolean }) {
  return <span className="g-signature__o">{live ? <Giro state="loading" signature /> : null}</span>;
}

function NameLine({
  size,
  probe,
  measureRef,
  children,
}: {
  size: number | string;
  probe?: string;
  measureRef?: RefObject<HTMLSpanElement | null>;
  children: ReactNode;
}) {
  const fontSize = typeof size === "number" ? `${size}px` : size;
  return (
    <span ref={measureRef} data-probe={probe} className="g-signature" style={{ fontSize }}>
      {children}
    </span>
  );
}

function OneLine({
  size,
  live,
  measureRef,
  probe,
}: {
  size: number | string;
  live: boolean;
  measureRef?: RefObject<HTMLSpanElement | null>;
  probe?: string;
}) {
  return (
    <NameLine size={size} measureRef={measureRef} probe={probe}>
      <span>brun</span>
      <OMark live={live} />
      <span>&nbsp;guimarães</span>
    </NameLine>
  );
}

function SignatureFrame({
  variant,
  width,
  lines,
  nameSize,
  codeSize,
  note,
}: {
  variant: VariantKey;
  width: number;
  lines: LineCount;
  nameSize: number | string;
  codeSize: number | string;
  note: string;
}) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({ name: 0, code: 0 });

  useBrowserLayoutEffect(() => {
    const read = () => {
      const name = readPx(nameRef.current);
      const code = readPx(codeRef.current);
      setMeasured(prev => (prev.name === name && prev.code === code ? prev : { name, code }));
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [nameSize, codeSize, lines]);

  const codeFont = typeof codeSize === "number" ? `${codeSize}px` : codeSize;

  return (
    <div
      className="g-azul"
      data-variant={variant}
      data-lines={lines}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div style={{ padding: "12px 16px 0", fontSize: 12, lineHeight: 1.45 }}>
        <p style={{ margin: 0 }}>
          nome {formatPx(measured.name)} · código {formatPx(measured.code)} ·{" "}
          {lines === 1 ? "uma linha" : "duas linhas"} · viewport {width > 0 ? `${width}px` : "…"}
        </p>
        <p style={{ margin: "4px 0 0", maxWidth: 760, color: "var(--s-muted)" }}>{note}</p>
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          paddingBottom: 88,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "max-content",
            fontSize: typeof nameSize === "number" ? `${nameSize}px` : nameSize,
          }}
        >
          {lines === 1 ? (
            <OneLine size={nameSize} live measureRef={nameRef} />
          ) : (
            <>
              <NameLine size={nameSize} measureRef={nameRef}>
                <span>brun</span>
                <OMark live />
              </NameLine>
              <NameLine size={nameSize}>
                <span>guimarães</span>
              </NameLine>
            </>
          )}
          <div style={{ marginTop: "0.35em" }}>
            <div
              ref={codeRef}
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 400,
                fontStretch: "100%",
                letterSpacing: 0,
                fontSize: codeFont,
                lineHeight: 1.5,
              }}
            >
              {CODE_LINES.map(line => (
                <p key={line} style={{ margin: 0, whiteSpace: "nowrap" }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VariantA({ width }: { width: number }) {
  const lines: LineCount = width < TWO_LINES_BELOW ? 2 : 1;
  return (
    <SignatureFrame
      variant="A"
      width={width}
      lines={lines}
      nameSize={NAME_CLAMP}
      codeSize={CODE_CLAMP}
      note="Clamp de 50px em 390 até 136px em 1920, e o código de 15px até 26px no mesmo intervalo. Duas linhas abaixo de 960px: ali a linha única cabe com cerca de 24px de cada lado. Em 768 ela teria 793px e passaria da tela."
    />
  );
}

function stepFor(width: number) {
  for (const step of STEPS) {
    if (width >= step.min) return step;
  }
  return STEPS[STEPS.length - 1];
}

export function VariantB({ width }: { width: number }) {
  const step = stepFor(width);
  return (
    <SignatureFrame
      variant="B"
      width={width}
      lines={step.lines}
      nameSize={step.name}
      codeSize={step.code}
      note="Degraus, sem clamp: nome/código 50/15, 64/18, 84/22, 120/24 e 136/26 px em 390, 768, 1024, 1440 e 1920. Duas linhas só abaixo de 768."
    />
  );
}

function codeStep(width: number): number {
  if (width >= 1440) return 26;
  if (width >= 1024) return 20;
  return 15;
}

export function VariantC({ width }: { width: number }) {
  const probeRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ namePx: number; lines: LineCount; breakAt: number }>({
    namePx: 50,
    lines: 2,
    breakAt: 0,
  });

  useBrowserLayoutEffect(() => {
    const root = probeRef.current;
    if (!root || width <= 0) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const one = root.querySelector<HTMLElement>('[data-probe="one"]');
      const brun = root.querySelector<HTMLElement>('[data-probe="brun"]');
      const rest = root.querySelector<HTMLElement>('[data-probe="rest"]');
      if (!one || !brun || !rest) return;
      const oneWidth = one.getBoundingClientRect().width;
      const longWidth = Math.max(
        brun.getBoundingClientRect().width,
        rest.getBoundingClientRect().width
      );
      if (oneWidth < 1 || longWidth < 1) return;
      const available = Math.max(0, width - FIT_MARGIN * 2);
      const oneFit = (available / oneWidth) * 100;
      const breakAt = (FIT_MIN / 100) * oneWidth + FIT_MARGIN * 2;
      const next =
        oneFit >= FIT_MIN
          ? { namePx: Math.min(FIT_MAX, oneFit), lines: 1 as const, breakAt }
          : {
              namePx: Math.min(FIT_MAX, (available / longWidth) * 100),
              lines: 2 as const,
              breakAt,
            };
      setFit(prev =>
        prev.namePx === next.namePx && prev.lines === next.lines && prev.breakAt === next.breakAt
          ? prev
          : next
      );
    };
    measure();
    document.fonts.ready.then(measure).catch(() => undefined);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      cancelled = true;
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [width]);

  const breakText =
    fit.breakAt > 0
      ? `quebra abaixo de ${Math.round(fit.breakAt)}px`
      : "quebra quando a linha única não cabe";

  return (
    <>
      <div
        ref={probeRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <OneLine size={100} live={false} probe="one" />
        <NameLine size={100} probe="brun">
          <span>brun</span>
          <OMark live={false} />
        </NameLine>
        <NameLine size={100} probe="rest">
          <span>guimarães</span>
        </NameLine>
      </div>
      <SignatureFrame
        variant="C"
        width={width}
        lines={fit.lines}
        nameSize={fit.namePx}
        codeSize={codeStep(width)}
        note={`Uma linha enquanto couber, margem de 24px, teto de 136px. Mínimo de 72px: ${breakText}. Código em degrau próprio, separado do nome: 15px, 20px a partir de 1024, 26px a partir de 1440.`}
      />
    </>
  );
}

export default function SignatureSizePrototype({
  initialVariant,
}: {
  initialVariant?: string | null;
}) {
  const [variant, setVariant] = useState<VariantKey>(parseVariant(initialVariant));
  const width = useViewportWidth();
  // A rota é estática: o HTML não traz a query. A URL é a fonte depois da hidratação.
  useBrowserLayoutEffect(() => {
    setVariant(parseVariant(new URL(window.location.href).searchParams.get("variant")));
  }, []);
  const onChange = useCallback((key: string) => {
    const next = parseVariant(key);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    setVariant(next);
  }, []);

  return (
    <>
      {variant === "A" && <VariantA width={width} />}
      {variant === "B" && <VariantB width={width} />}
      {variant === "C" && <VariantC width={width} />}
      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={onChange} />
    </>
  );
}
