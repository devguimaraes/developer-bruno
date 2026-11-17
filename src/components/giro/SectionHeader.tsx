import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SectionHeaderProps {
  /** Rótulo sem a barra: o componente põe "// " na frente. */
  label: string;
  /** Título da seção, renderizado como h2. */
  title: string;
  /** Abertura curta opcional, abaixo do título. */
  lead?: string;
  /** Ação à direita, normalmente um link. */
  action?: ReactNode;
  className?: string;
}

// Mesma curva e duração de --ease-resolve e --dur-resolve (giro.css).
const RESOLVE_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const RESOLVE = { duration: 0.4, ease: RESOLVE_EASE };

export function SectionHeader({ label, title, lead, action, className }: SectionHeaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={["g-section-head", className].filter(Boolean).join(" ")}>
      <div className="g-section-head__text">
        <p className="g-eyebrow">{`// ${label}`}</p>
        <motion.h2
          className="g-section-head__title"
          initial={reducedMotion ? false : { fontStretch: "50%" }}
          whileInView={reducedMotion ? undefined : { fontStretch: "115%" }}
          viewport={{ once: true }}
          transition={RESOLVE}
        >
          {title}
        </motion.h2>
        {lead && (
          <motion.p
            className="g-section-head__lead"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={RESOLVE}
          >
            {lead}
          </motion.p>
        )}
      </div>
      {action}
    </div>
  );
}
