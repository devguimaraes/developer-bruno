import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  "data-language"?: string;
}

export function CodeBlock({ children, className, "data-language": language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const isCodeBlock = className?.includes("astro-code") || language;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [copied]);

  const handleCopy = async () => {
    if (!preRef.current) return;

    const code = preRef.current.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!isCodeBlock) {
    return <code className={className}>{children}</code>;
  }

  return (
    <div className="relative group my-8">
      {/* Language label */}
      {language && (
        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-black/80 border border-white/10 rounded text-[10px] text-white/60 uppercase tracking-wider font-mono">
          {language}
        </div>
      )}

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute -top-3 right-4 p-1.5 bg-black/80 border border-white/10 rounded hover:border-accent/50 transition-colors opacity-0 group-hover:opacity-100"
        aria-label={copied ? "Copiado!" : "Copiar código"}
        title={copied ? "Copiado!" : "Copiar código"}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-accent" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-white/60" />
        )}
      </button>

      <pre ref={preRef} className={className}>
        {children}
      </pre>
    </div>
  );
}
