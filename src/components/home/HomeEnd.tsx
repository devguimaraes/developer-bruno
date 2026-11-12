import { ArrowUpRight } from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LanguageSwitch } from "@/components/giro/LanguageSwitch";
import { type Camera, project } from "@/components/hero/stack";
import { Signature } from "@/components/nav/Signature";
import { contactData } from "@/config/site";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type TranslationKey, t } from "@/lib/i18n";
import { calcEndGap, END_LAYERS, fitEndCamera, LIFT, PLATE } from "./end-stage";
import { SCENE_MOBILE_QUERY } from "./story/chapters";
import { setStorySignal } from "./story/story-signals";
import { type SceneBuilder, useChapterScenes } from "./story/useChapterScenes";

const FOOTER_LINK_IDS = ["linkedin", "github"];

/** Título gravado na face de cada placa. */
const FACE_TITLES: Record<string, TranslationKey> = {
  start: "hero.title",
  states: "story.end.face.states",
  services: "services.title",
  projects: "projects.title",
  process: "process.title",
  about: "about.title",
  blog: "posts.title",
  contact: "contact.title",
};

/** Detalhes de cada face: só desenho, sem texto. */
const FACE_DECOR: Record<string, ReactNode> = {
  start: <b className="fn-face__a" style={{ left: 30, bottom: 26, width: 86, height: 28 }} />,
  states: (
    <>
      <b
        className="fn-face__a"
        style={{ right: 34, top: 150, width: 64, height: 64, borderRadius: "50%" }}
      />
      <b className="fn-face__s" style={{ left: 30, bottom: 30, width: 150, height: 9 }} />
    </>
  ),
  services: (
    <>
      <b
        className="fn-face__a"
        style={{ right: 0, top: 0, width: 150, height: 280, borderRadius: 0 }}
      />
      <b className="fn-face__s" style={{ left: 30, bottom: 30, width: 150, height: 9 }} />
    </>
  ),
  projects: <img className="fn-face__img" src="/capa-estudio-entre.webp" alt="" />,
  process: (
    <>
      <b className="fn-face__s" style={{ left: 30, right: 30, bottom: 44, height: 3 }} />
      <b
        className="fn-face__a"
        style={{ left: 30, bottom: 34, width: 22, height: 22, borderRadius: "50%" }}
      />
      <b
        className="fn-face__a"
        style={{ left: 140, bottom: 34, width: 22, height: 22, borderRadius: "50%" }}
      />
    </>
  ),
  about: (
    <img
      className="fn-face__img fn-face__img--tall"
      src="/bruno-duo.webp"
      alt=""
      style={{ objectPosition: "50% 12%" }}
    />
  ),
  blog: (
    <>
      <b className="fn-face__s" style={{ left: 30, right: 30, bottom: 70, height: 8 }} />
      <b className="fn-face__s" style={{ left: 30, right: 90, bottom: 48, height: 8 }} />
      <b className="fn-face__s" style={{ left: 30, right: 30, bottom: 26, height: 8 }} />
    </>
  ),
  contact: (
    <>
      <b
        className="fn-face__s"
        style={{ left: 30, right: 30, bottom: 64, height: 34, borderRadius: 17 }}
      />
      <b
        className="fn-face__a"
        style={{ left: 30, bottom: 22, width: 120, height: 30, borderRadius: 15 }}
      />
    </>
  ),
};

function plateStyle(): CSSProperties {
  return {
    "--x": "0px",
    "--y": "0px",
    "--w": `${PLATE.w}px`,
    "--h": `${PLATE.h}px`,
    "--r": "22px",
    "--zr": "0px",
  } as CSSProperties;
}

/**
 * Fim: a página vira pilha. As oito camadas (início, estados, serviços, projetos, processo, sobre,
 * blog, contato) abrem em vãos crescentes e a linha ao lado leva a cada capítulo. Sem data-scenes
 * (sem JS ou movimento reduzido) é um título, a lista de links em ordem e o rodapé.
 */
export function HomeEnd() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const drawRef = useRef<(g: number) => void>(() => {});
  const gapRef = useRef(0);
  const worldRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(-1);
  const [hover, setHover] = useState(-1);

  const socialLinks = contactData.socialLinks.filter(link => FOOTER_LINK_IDS.includes(link.id));

  const select = useCallback((i: number) => {
    hoverRef.current = i;
    setHover(i);
    setStorySignal("endHover", i);
    // A placa sob o ponteiro sobe na hora, sem esperar o React: redesenha com o vão atual.
    drawRef.current(gapRef.current);
  }, []);

  // O sinal não pode sobrar quando a página troca: o Giro seguiria curioso numa placa que sumiu.
  useEffect(() => () => setStorySignal("endHover", -1), []);

  const buildScene = useCallback<SceneBuilder>(({ scene, setVars }) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const q = (s: string) => sec.querySelector<HTMLElement>(s);
    const qa = (s: string) => [...sec.querySelectorAll<HTMLElement>(s)];
    const iso = q(".fn-iso");
    const copy = q(".fn-copy");
    const rail = q(".fn-rail");
    const foot = q(".fn-foot");
    const spine = sec.querySelector<SVGLineElement>(".fn-spine");
    const links = [...sec.querySelectorAll<SVGLineElement>(".fn-link")];
    // No DOM a placa de baixo vem primeiro (pinta antes): a ordem de leitura vem do data-i.
    const plates = qa(".fn-pl").sort((a, b) => Number(a.dataset.i) - Number(b.dataset.i));
    const tags = qa(".fn-tag");
    const n = plates.length;
    if (!iso || !copy || !rail || !foot || !spine || links.length !== n || tags.length !== n)
      return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const mobile = window.matchMedia(SCENE_MOBILE_QUERY).matches;
    // No celular a pilha cabe entre o texto e o rodapé, também em telas baixas.
    const fit = mobile
      ? fitEndCamera(
          { top: copy.offsetTop + copy.offsetHeight + 16, bottom: foot.offsetTop - 16 },
          0.42
        )
      : null;
    const o = fit ? { x: W * 0.4, y: fit.y, k: fit.k } : { x: W * 0.62, y: H * 0.84, k: 0.62 };
    setVars(iso, {
      "--ox": `${o.x}px`,
      "--oy": `${o.y}px`,
      "--k": o.k,
      "--rx": "60deg",
      "--rz": "-45deg",
    });

    const rx = (60 * Math.PI) / 180;
    const rz = (-45 * Math.PI) / 180;
    const cam: Camera = {
      ox: o.x,
      oy: o.y,
      k: o.k,
      cx: Math.cos(rx),
      sx: Math.sin(rx),
      cz: Math.cos(rz),
      sz: Math.sin(rz),
      rxDeg: 60,
      rzDeg: -45,
      fade: 1,
    };

    // Altura das placas, estações e ligações saem do mesmo vão: a linha acompanha a pilha.
    const draw = (g: number) => {
      gapRef.current = g;
      plates.forEach((pl, i) => {
        pl.style.setProperty(
          "--zr",
          `${(n - 1 - i) * g + (hoverRef.current === Number(pl.dataset.i) ? LIFT : 0)}px`
        );
      });
      const pts = plates.map((_, i) => project(cam, PLATE.w / 2, PLATE.h / 2, (n - 1 - i) * g));
      const spineX = Math.max(...pts.map(p => p.x)) + (mobile ? 22 : 56);
      spine.setAttribute("x1", String(spineX));
      spine.setAttribute("x2", String(spineX));
      spine.setAttribute("y1", String(pts[0].y));
      spine.setAttribute("y2", String(pts[n - 1].y));
      pts.forEach((p, i) => {
        links[i].setAttribute("x1", String(p.x));
        links[i].setAttribute("y1", String(p.y));
        links[i].setAttribute("x2", String(spineX));
        links[i].setAttribute("y2", String(p.y));
        tags[i].style.transform = `translate(${spineX + (mobile ? 6 : 20)}px, ${p.y}px)`;
      });
    };
    drawRef.current = draw;

    // Progresso linear do capítulo; o vão sai da função pura, então a cena e o teste concordam.
    const S = { p: 0 };
    const redraw = () => draw(calcEndGap(S.p, mobile));
    redraw();

    const tl = scene(sec);
    tl.to(S, { p: 1, duration: 1, onUpdate: redraw }, 0)
      .fromTo(copy, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 }, 0.05)
      .fromTo([rail, foot], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.5)
      .to({}, { duration: 0.01 }, 1);

    return () => {
      drawRef.current = () => {};
    };
  }, []);

  useChapterScenes(buildScene, [], {
    scope: sectionRef,
    enabled: reducedMotion ? false : undefined,
  });

  // Leva ao capítulo na rolagem da janela. Sem o alvo no DOM, deixa o link agir sozinho.
  const goTo = useCallback(
    (event: Pick<Event, "preventDefault">, anchor: string) => {
      const target = anchor === "hero" ? document.body : document.getElementById(anchor);
      if (!target) return;
      event.preventDefault();
      const top = anchor === "hero" ? 0 : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion]
  );

  // A placa é só atalho do mouse (os rótulos são os links do teclado): um ouvinte no mundo.
  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;
    const onClick = (event: MouseEvent) => {
      const plate = (event.target as Element).closest<HTMLElement>(".fn-pl");
      if (plate?.dataset.to) goTo(event, plate.dataset.to);
    };
    world.addEventListener("click", onClick);
    return () => world.removeEventListener("click", onClick);
  }, [goTo]);

  return (
    <section className="fn-ch g-tinta" id="fim" aria-labelledby="fn-title" ref={sectionRef}>
      <div className="fn-stage">
        <div className="fn-copy">
          <p className="g-eyebrow">{t(locale, "story.end.label")}</p>
          <h2 className="fn-title" id="fn-title">
            {t(locale, "story.end.title")}
          </h2>
          <p className="fn-lead">{t(locale, "story.end.lead")}</p>
        </div>

        <div className="hb fn-world" aria-hidden="true" ref={worldRef}>
          <div className="iso fn-iso">
            <div className="pc-grid" />
            {/* A de baixo primeiro: pinta antes. O índice de leitura vai em data-i. */}
            {END_LAYERS.map((layer, i) => ({ layer, i }))
              .reverse()
              .map(({ layer, i }) => (
                <div
                  key={layer.id}
                  className={`iso-pl fn-pl${hover === i ? " is-on" : ""}`}
                  data-i={i}
                  data-to={layer.anchor}
                  data-lift={hover === i ? LIFT : 0}
                  style={plateStyle()}
                  onPointerEnter={() => select(i)}
                  onPointerLeave={() => select(-1)}
                >
                  <i className="iso-pl__e" />
                  <i className="iso-pl__e" />
                  <i className="iso-pl__e" />
                  <div className="iso-pl__face">
                    <div className={`fn-face g-${layer.surface}`}>
                      <b className="fn-face__e">{t(locale, layer.labelKey)}</b>
                      <b className="fn-face__t">{t(locale, FACE_TITLES[layer.id])}</b>
                      {FACE_DECOR[layer.id]}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="fn-rail">
          <svg className="fn-rail__svg" aria-hidden="true">
            <line className="fn-spine" />
            {END_LAYERS.map(layer => (
              <line key={layer.id} className="fn-link" />
            ))}
          </svg>
          <nav aria-label={t(locale, "story.end.nav")}>
            <ol className="fn-tags">
              {END_LAYERS.map((layer, i) => (
                <li key={layer.id}>
                  <a
                    className={`fn-tag${hover === i ? " is-on" : ""}`}
                    href={`#${layer.anchor}`}
                    data-i={i}
                    onClick={event => goTo(event, layer.anchor)}
                    onPointerEnter={() => select(i)}
                    onPointerLeave={() => select(-1)}
                    onFocus={() => select(i)}
                    onBlur={() => select(-1)}
                  >
                    <i
                      className="hs-stop"
                      data-stop={layer.stop}
                      data-size="48"
                      data-size-m="40"
                      aria-hidden="true"
                    />
                    {t(locale, layer.labelKey)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="fn-foot">
          <Signature className="fn-sig" />
          <div className="fn-foot__r">
            <LanguageSwitch groupLabel={t(locale, "language.group_label")} className="only-m" />
            {socialLinks.map(link => (
              <a key={link.id} className="g-link" href={link.href}>
                {link.label}
                <ArrowUpRight className="g-icon" aria-hidden="true" />
              </a>
            ))}
            <span className="fn-legal">{t(locale, "footer.copyright")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
