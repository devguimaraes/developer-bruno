import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { StackLogo } from "@/components/giro/ToolLogo";
import { ServiceArt } from "@/components/services/ServiceArt";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { SERVICES, calcServiceScrollTop, calcServiceStep } from "./service-stage";
import { type GSAP, loadGsap } from "./story/useChapterScenes";

export const HomeServices: FC = () => {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<GSAP | null>(null);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (!cancelled) gsapRef.current = gsap;
    });
    return () => {
      cancelled = true;
      if (programmaticScrollTimerRef.current) {
        clearTimeout(programmaticScrollTimerRef.current);
      }
      if (discRef.current && gsapRef.current) {
        gsapRef.current.killTweensOf(discRef.current);
      }
    };
  }, []);

  const triggerDiscTransition = useCallback(
    (nextIdx: number, instant = false) => {
      const panel = panelRef.current;
      const disc = discRef.current;
      const nextColor = SERVICES[nextIdx].colorCss;
      if (!panel || !disc) return;

      if (instant || reducedMotion || !gsapRef.current) {
        panel.style.setProperty("--sv-c", nextColor);
        return;
      }

      panel.style.setProperty("--sv-next", nextColor);
      const r = panel.getBoundingClientRect();
      const gsap = gsapRef.current;
      gsap.killTweensOf(disc);
      gsap.fromTo(
        disc,
        { clipPath: `circle(0px at 0px ${r.height * 0.5}px)` },
        {
          clipPath: `circle(${Math.hypot(r.width, r.height)}px at 0px ${r.height * 0.5}px)`,
          duration: 0.56,
          ease: "power2.out",
          onComplete: () => {
            panel.style.setProperty("--sv-c", nextColor);
          },
        }
      );
    },
    [reducedMotion]
  );

  const setService = useCallback(
    (index: number, instant = false) => {
      if (index === activeIndexRef.current && !instant) return;
      setActiveIndex(index);
      triggerDiscTransition(index, instant);
    },
    [triggerDiscTransition]
  );

  useEffect(() => {
    triggerDiscTransition(0, true);
  }, [triggerDiscTransition]);

  // Sincronização via Scroll quando data-scenes está ativo
  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (isProgrammaticScrollRef.current) return;
        const track = trackRef.current;
        if (!track) return;

        const isScenesOn = document.documentElement.getAttribute("data-scenes") === "on";
        if (!isScenesOn || reducedMotion) return;

        const rect = track.getBoundingClientRect();
        const totalLen = track.offsetHeight - window.innerHeight;
        if (totalLen <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / totalLen));
        const step = calcServiceStep(progress);
        if (step !== activeIndexRef.current) {
          setService(step);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [reducedMotion, setService]);

  const handleSelectService = (index: number) => {
    const track = trackRef.current;
    if (track) {
      const isScenesOn = document.documentElement.getAttribute("data-scenes") === "on";
      const totalLen = track.offsetHeight - window.innerHeight;
      if (isScenesOn && !reducedMotion && totalLen > 0) {
        isProgrammaticScrollRef.current = true;
        if (programmaticScrollTimerRef.current) {
          clearTimeout(programmaticScrollTimerRef.current);
        }
        programmaticScrollTimerRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 850);

        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        const targetTop = calcServiceScrollTop(index, trackTop, totalLen);
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    }
    setService(index);
  };

  return (
    <section className="hs-ch sv g-papel" id="servicos" aria-labelledby="sv-title">
      <div className="sv-intro g-papel only-m">
        <p className="g-eyebrow">{"// serviços"}</p>
        <h2 className="sv-title" id="sv-title">
          {t(locale, "services.title")}
        </h2>
        <p className="sv-lead">{t(locale, "services.intro")}</p>
      </div>

      <div className="sv-track" ref={trackRef}>
        <div className="hs-stage g-papel sv-stage">
          <div className="sv-left">
            <div className="sv-head only-d">
              <p className="g-eyebrow">{"// serviços"}</p>
              <h2 className="sv-title">{t(locale, "services.title")}</h2>
              <p className="sv-lead">{t(locale, "services.intro")}</p>
            </div>

            <ol
              className="sv-list"
              style={{ "--sv-p": activeIndex / (SERVICES.length - 1) } as React.CSSProperties}
            >
              {SERVICES.map((item, index) => {
                const isOn = activeIndex === index;
                return (
                  <li
                    key={item.id}
                    className={
                      isOn
                        ? "is-on"
                        : index < activeIndex
                          ? "is-done"
                          : index === activeIndex + 1
                            ? "is-next"
                            : undefined
                    }
                  >
                    <button
                      type="button"
                      className={`sv-row ${isOn ? "is-on" : ""}`}
                      data-i={index}
                      aria-label={t(locale, item.titleKey)}
                      aria-pressed={isOn}
                      onClick={() => handleSelectService(index)}
                    >
                      <i
                        className="hs-stop sv-dot"
                        data-stop={item.stop}
                        data-size="44"
                        data-size-m="44"
                        aria-hidden="true"
                      />
                      <span className="sv-n">{String(index + 1).padStart(2, "0")}</span>
                      <span className="sv-name">{t(locale, item.titleKey)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="sv-slot">
              {SERVICES.map((item, index) => {
                const isOn = activeIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`sv-detail ${isOn ? "is-on" : ""}`}
                    aria-hidden={!isOn}
                  >
                    <p>{t(locale, item.bodyKey)}</p>
                    <ul className="sv-tags">
                      {t(locale, item.tagsKey)
                        .split(" · ")
                        .map(tag => (
                          <li key={tag}>
                            <StackLogo name={tag} />
                            {tag}
                          </li>
                        ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="sv-panel"
            data-c={SERVICES[activeIndex].color}
            ref={panelRef}
            style={
              {
                "--sv-c": SERVICES[0].colorCss,
              } as React.CSSProperties
            }
          >
            <div className="sv-panel__disc" ref={discRef} />

            {SERVICES.map((item, index) => {
              const isOn = activeIndex === index;
              return (
                <div
                  key={item.id}
                  className={`sv-art ${isOn ? "is-on" : ""}`}
                  data-c={item.color}
                  aria-hidden={!isOn}
                >
                  <div
                    className={`sv-art__head only-m ${
                      item.color === "azul"
                        ? "g-azul"
                        : item.color === "tinta"
                          ? "g-tinta"
                          : "g-papel"
                    }`}
                  >
                    <p className="g-eyebrow">
                      {`// serviços · ${String(index + 1).padStart(2, "0")}/05`}
                    </p>
                    <h3 className="sv-art__name">{t(locale, item.titleKey)}</h3>
                  </div>
                  <div className="sv-art__stage">
                    <ServiceArt name={item.art} active={isOn} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
