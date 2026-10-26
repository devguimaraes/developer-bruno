import { motion } from "framer-motion";
import {
  Accessibility,
  Code,
  ListChecks,
  type LucideIcon,
  Plug,
  Rocket,
  Users,
} from "lucide-react";
import { Giro } from "@/components/brand/Giro";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type TranslationKey, t } from "@/lib/i18n";
import { bareLabel } from "./copy";

// Capacidades na ordem da prancha, cada uma com o ícone Lucide da própria linha.
const CAPABILITIES: readonly { key: TranslationKey; icon: LucideIcon }[] = [
  { key: "about.capability.development", icon: Code },
  { key: "about.capability.apis", icon: Plug },
  { key: "about.capability.deploy", icon: Rocket },
  { key: "about.capability.a11y", icon: Accessibility },
  { key: "about.capability.practices", icon: ListChecks },
  { key: "about.capability.collaboration", icon: Users },
];

const FACTS: readonly { value: TranslationKey; label: TranslationKey }[] = [
  { value: "about.fact.experience_value", label: "about.fact.experience_label" },
  { value: "about.fact.education_value", label: "about.fact.education_label" },
  { value: "about.fact.location_value", label: "about.fact.location_label" },
];

// Abertura da máscara circular da foto, na mesma curva da prancha.
const PHOTO_CLOSED = "circle(0% at 50% 34%)";
const PHOTO_OPEN = "circle(120% at 50% 34%)";
// Mesma curva de --ease-resolve (giro.css).
const RESOLVE_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const PHOTO_RESOLVE = { duration: 1.5, delay: 0.12, ease: RESOLVE_EASE };

export function HomeAbout() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();

  return (
    <div className="home-about">
      <figure className="home-about__figure">
        <motion.div
          className="home-about__photo"
          initial={reducedMotion ? false : { clipPath: PHOTO_CLOSED }}
          whileInView={reducedMotion ? undefined : { clipPath: PHOTO_OPEN }}
          viewport={{ once: true }}
          transition={PHOTO_RESOLVE}
        >
          <img src="/brunoGuimaraes.webp" alt={t(locale, "about.photo_alt")} loading="lazy" />
        </motion.div>
        <span className="home-about__giro">
          <Giro state="idle" />
        </span>
      </figure>

      <div className="home-about__text">
        <div className="home-about__head">
          <p className="g-eyebrow">{bareLabel(t(locale, "about.label"))}</p>
          <h2 className="g-section-head__title">{t(locale, "about.title")}</h2>
        </div>
        <p className="home-about__lead">{t(locale, "about.bio_1")}</p>
        <p className="home-about__body">{t(locale, "about.bio_2")}</p>

        <ul className="home-about__caps">
          {CAPABILITIES.map(({ key, icon: Icon }) => (
            <li key={key}>
              <Icon className="g-icon" aria-hidden="true" />
              {t(locale, key)}
            </li>
          ))}
        </ul>

        <dl className="home-about__facts">
          {FACTS.map(fact => (
            <div key={fact.value}>
              <dt>{t(locale, fact.value)}</dt>
              <dd>{t(locale, fact.label)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
