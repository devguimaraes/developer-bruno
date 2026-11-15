import {
  Accessibility,
  Code,
  ListChecks,
  type LucideIcon,
  Plug,
  Rocket,
  Users,
} from "lucide-react";
import { useCallback, useRef } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type TranslationKey, t } from "@/lib/i18n";
import { ABOUT_SWAP, ABOUT_TIMELINE, calcAboutBeatTime } from "./about-stage";
import { bareLabel } from "./copy";
import { SCENE_MOBILE_QUERY } from "./story/chapters";
import { createBeatPlayer } from "./story/beats";
import { type SceneBuilder, useChapterScenes } from "./story/useChapterScenes";

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

/**
 * Sobre: o nome grande passa por trás da foto e por cima dela, e a foto cede lugar à bio.
 * Sem data-scenes é leitura em ordem: foto, bio, capacidades, fatos.
 */
export function HomeAbout() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const buildScene = useCallback<SceneBuilder>(({ gsap, scene }) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const q = (s: string) => sec.querySelector<HTMLElement>(s);
    const back = q(".sb-back");
    const front = q(".sb-front");
    const photo = q(".sb-photo");
    const bio = q(".sb-bio");
    if (!back || !front || !photo || !bio) return;

    const H = window.innerHeight;
    const W = window.innerWidth;
    const { photoSettle } = ABOUT_TIMELINE;

    // No celular o palco não fixa: só um parallax curto enquanto o bloco passa pela tela.
    if (window.matchMedia(SCENE_MOBILE_QUERY).matches) {
      const tl = scene(q(".sb-art") ?? sec, { start: "top bottom", end: "bottom top" });
      tl.fromTo(back, { y: 40 }, { y: -30, duration: 1 }, 0)
        .fromTo(front, { y: -30 }, { y: 50, duration: 1 }, 0)
        .fromTo(photo, { y: 40 }, { y: -30, duration: 1 }, 0);
      return;
    }

    gsap.set(bio, { autoAlpha: 0, x: 80 });
    // A troca da foto pela bio é uma batida: toca no tempo quando a rolagem chega nela.
    const beats = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    beats
      .to([back, front], { autoAlpha: 0, duration: 0.3 }, 0)
      .to(
        photo,
        {
          x: -W * 0.27,
          scale: 0.92,
          transformOrigin: "50% 100%",
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      )
      .to(bio, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, ABOUT_SWAP - 0.6);
    const player = createBeatPlayer(beats);
    let beatTime = 0;

    // A paralaxe dos nomes e a subida da foto seguem a rolagem.
    const tl = scene(sec, {
      onUpdate: (self: { progress: number }) => {
        const next = calcAboutBeatTime(self.progress);
        if (next !== beatTime) {
          beatTime = next;
          player.playTo(next);
        }
      },
    });
    tl.fromTo(back, { y: H * 0.1 }, { y: -H * 0.08, duration: 1 }, 0)
      .fromTo(front, { y: -H * 0.05 }, { y: H * 0.05, duration: 1 }, 0)
      .fromTo(photo, { y: H * 0.08 }, { y: 0, duration: photoSettle }, 0);

    // Montagem e remontagem (resize) começam já na batida atual, sem tocar a cena de novo.
    beatTime = calcAboutBeatTime(tl.scrollTrigger?.progress ?? 0);
    player.jumpTo(beatTime);
    return () => player.kill();
  }, []);

  useChapterScenes(buildScene, [], {
    scope: sectionRef,
    enabled: reducedMotion ? false : undefined,
  });

  return (
    <section className="sb-ch g-azul" id="sobre" aria-labelledby="sb-title" ref={sectionRef}>
      <div className="sb-stage">
        <div className="sb-art">
          <div className="sb-back" aria-hidden="true">
            Bruno
          </div>
          <figure className="sb-photo">
            <img
              src="/bruno-duo.webp"
              alt={t(locale, "about.photo_alt")}
              loading="lazy"
              draggable={false}
            />
            <i
              className="hs-stop sb-peek"
              data-stop="sb-peek"
              data-size="120"
              data-size-m="76"
              aria-hidden="true"
            />
          </figure>
          <div className="sb-front" aria-hidden="true">
            Guimarães
          </div>
        </div>

        <div className="sb-bio">
          <p className="g-eyebrow">{bareLabel(t(locale, "about.label"))}</p>
          <h2 className="sb-title" id="sb-title">
            {t(locale, "about.title")}
          </h2>
          <p className="sb-lead">{t(locale, "about.bio_1")}</p>
          <p className="sb-body">{t(locale, "about.bio_2")}</p>

          <ul className="sb-caps">
            {CAPABILITIES.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Icon className="g-icon" aria-hidden="true" />
                {t(locale, key)}
              </li>
            ))}
          </ul>

          <dl className="sb-facts">
            {FACTS.map(fact => (
              <div key={fact.value}>
                <dt>{t(locale, fact.value)}</dt>
                <dd>{t(locale, fact.label)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
