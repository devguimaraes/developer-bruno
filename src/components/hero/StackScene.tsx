import { type CSSProperties, Fragment } from "react";

export interface StackLabels {
  layers: readonly [string, string, string, string]; // nomes sem "//": tokens, componentes, tela, estado
  colors: readonly [string, string, string, string, string]; // azul, lima, papel, tinta, coral
  ctaProjects: string;
  ctaContact: string;
  ready: string;
  loading: string;
  greeting: string;
  error: string;
  miniTitle: string;
}

// Pilha da hero (vista explodida). Markup estático: a posição de cada peça vem do inline style
// (--x --y --w --h --r --zr, e --c --i nos swatches e nas réguas) e o movimento vem de giro-hero.css.
// A cena é decorativa, então os três blocos são aria-hidden.

const SWATCHES = [
  { color: "#2b2eff", left: 22, labelLeft: 25 },
  { color: "#d2ff4d", left: 66, labelLeft: 68 },
  { color: "#f6f5f0", left: 110, labelLeft: 110, papel: true },
  { color: "#0b0c1f", left: 154, labelLeft: 155 },
  { color: "#ff5c3d", left: 198, labelLeft: 199 },
];

const RULES = [
  { width: 10, top: 96 },
  { width: 20, top: 110 },
  { width: 30, top: 124 },
  { width: 40, top: 138 },
  { width: 60, top: 152 },
  { width: 80, top: 166 },
];

const SIZES = [
  { text: "4", top: 94 },
  { text: "8", top: 108 },
  { text: "12", top: 122 },
  { text: "16", top: 136 },
  { text: "24", top: 150 },
  { text: "32", top: 164 },
];

const RADII = [
  { left: 196, radius: 3 },
  { left: 226, radius: 7 },
  { left: 256, radius: 9 },
  { left: 286, radius: "50%" },
];

const DOTS = [12, 24, 36];

const PAGE_SKELETONS = [
  { key: "kicker", left: 14, top: 12, width: 80, height: 8 },
  { key: "title", left: 14, top: 40, width: 150, height: 24 },
  { key: "subtitle", left: 14, top: 68, width: 120, height: 24 },
  { key: "text", left: 14, top: 104, width: 180, height: 6 },
  { key: "pill", left: 14, top: 136, width: 70, height: 22, radius: 11 },
  { key: "media", left: 206, top: 44, width: 110, height: 80, radius: 8 },
];

const HEADER_BARS = [
  { left: 232, width: 22 },
  { left: 260, width: 20 },
  { left: 286, width: 28 },
];

const TEXT_BARS = [
  { top: 104, width: 176 },
  { top: 114, width: 140 },
];

/**
 * As quatro camadas da pilha (tokens, componentes, tela e estado), sem o mundo em volta. A hero
 * e o capítulo Processo da home montam a mesma pilha; o CSS das peças vem de .hb em giro-hero.css.
 */
export function StackPlates({ labels }: { labels: StackLabels }) {
  return (
    <>
      {/* Camada 0: tokens */}
      <div
        className="iso-pl hb-pl"
        data-layer="0"
        style={
          {
            "--x": "0px",
            "--y": "0px",
            "--w": "330px",
            "--h": "230px",
            "--r": "18px",
            "--zr": "14px",
          } as CSSProperties
        }
      >
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <div className="iso-pl__face">
          {SWATCHES.map((s, i) => (
            <Fragment key={s.color}>
              <b
                className={s.papel ? "hb-sw hb-sw--papel" : "hb-sw"}
                style={
                  {
                    left: s.left,
                    top: 20,
                    width: 34,
                    height: 34,
                    background: s.color,
                    "--c": s.color,
                    "--i": String(i),
                  } as CSSProperties
                }
              />
              <b className="t" style={{ left: s.labelLeft, top: 62 }}>
                {labels.colors[i]}
              </b>
            </Fragment>
          ))}
          <b className="hb-aa" style={{ left: 20, top: 88 }}>
            Aa
          </b>
          <b className="t" style={{ left: 24, top: 190 }}>
            Anybody · Geist Mono
          </b>
          {RULES.map((r, i) => (
            <b
              key={r.width}
              className="hb-rule"
              style={{ left: 196, top: r.top, width: r.width, "--i": String(i) } as CSSProperties}
            />
          ))}
          {SIZES.map(n => (
            <b key={n.text} className="t" style={{ left: 288, top: n.top }}>
              {n.text}
            </b>
          ))}
          {RADII.map(r => (
            <b
              key={r.left}
              className="hb-rad"
              style={{ left: r.left, top: 188, width: 22, height: 22, borderRadius: r.radius }}
            />
          ))}
        </div>
      </div>

      {/* Camada 1: componentes */}
      <div
        className="iso-pl hb-pl"
        data-layer="1"
        style={
          {
            "--x": "30px",
            "--y": "-30px",
            "--w": "330px",
            "--h": "230px",
            "--r": "18px",
            "--zr": "164px",
          } as CSSProperties
        }
      >
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <div className="iso-pl__face">
          <b className="hb-btn hb-btn--pri" style={{ left: 22, top: 22, width: 136, height: 40 }}>
            {labels.ctaProjects}
          </b>
          <b className="hb-btn hb-btn--sec" style={{ left: 170, top: 22, width: 136, height: 40 }}>
            {labels.ctaContact}
          </b>
          <b className="hb-tg" style={{ left: 22, top: 84, width: 56, height: 30 }}>
            <b />
          </b>
          <b className="hb-cb" style={{ left: 94, top: 86, width: 26, height: 26 }}>
            <svg className="ck" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5 L10 17 L19 7" />
            </svg>
          </b>
          <b className="hb-chip" style={{ left: 136, top: 88, width: 78, height: 22 }}>
            <span className="t" style={{ color: "var(--tinta)" }}>
              {labels.ready}
            </span>
          </b>
          <b className="hb-field" style={{ left: 22, top: 132, width: 286, height: 40 }}>
            <b className="hb-typed" style={{ left: 18, top: 12, width: 94, height: 16 }}>
              {labels.greeting}
            </b>
            <b className="hb-caret" style={{ left: 114, top: 12 }} />
          </b>
          <b className="hb-range" style={{ left: 22, top: 196, width: 190, height: 6 }}>
            <b />
          </b>
          <b className="t" style={{ left: 228, top: 193 }}>
            gap 24
          </b>
          <span className="hb-note" style={{ left: 22, top: 184, width: 286, height: 30 }}>
            <i />
            {labels.error}
          </span>
        </div>
      </div>

      {/* Camada 2: tela */}
      <div
        className="iso-pl hb-pl"
        data-layer="2"
        style={
          {
            "--x": "60px",
            "--y": "-60px",
            "--w": "330px",
            "--h": "230px",
            "--r": "18px",
            "--zr": "314px",
          } as CSSProperties
        }
      >
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <div className="iso-pl__face">
          <b className="hb-chrome" style={{ left: 0, top: 0, width: 330, height: 28 }} />
          {DOTS.map(left => (
            <b key={left} className="hb-dot" style={{ left, top: 10.5 }} />
          ))}
          <b className="hb-url" style={{ left: 60, top: 6, width: 200, height: 16 }}>
            <b className="t hb-urltext" style={{ left: 10, top: 3, width: 122 }}>
              devguimaraes.com.br
            </b>
          </b>
          <b className="hb-page" style={{ left: 0, top: 28, width: 330, height: 202 }}>
            {PAGE_SKELETONS.map(s => (
              <b
                key={s.key}
                className="hb-skel"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.width,
                  height: s.height,
                  borderRadius: s.radius,
                }}
              />
            ))}
            <b className="hb-paint" style={{ left: 0, top: 0, width: 330, height: 202 }}>
              <b className="hb-mini-sig" style={{ left: 14, top: 12 }}>
                bruno guimarães
              </b>
              {HEADER_BARS.map(bar => (
                <b
                  key={bar.left}
                  className="hb-bar"
                  style={{ left: bar.left, top: 14, width: bar.width, height: 5 }}
                />
              ))}
              <b className="hb-mini-title" style={{ left: 14, top: 46, fontSize: 44 }}>
                {labels.miniTitle}
              </b>
              {TEXT_BARS.map(bar => (
                <b
                  key={bar.top}
                  className="hb-bar"
                  style={{ left: 14, top: bar.top, width: bar.width, height: 5 }}
                />
              ))}
              <b className="hb-mini-cta" style={{ left: 14, top: 136, width: 70, height: 22 }} />
              <b className="hb-card" style={{ left: 206, top: 44, width: 110, height: 80 }}>
                <b className="hb-mini-cta" style={{ left: 12, top: 12, width: 18, height: 18 }} />
                <b className="hb-skel" style={{ left: 12, top: 44, width: 80, height: 6 }} />
                <b className="hb-skel" style={{ left: 12, top: 56, width: 56, height: 6 }} />
              </b>
              <b className="hb-card" style={{ left: 206, top: 132, width: 52, height: 56 }} />
              <b className="hb-card" style={{ left: 264, top: 132, width: 52, height: 56 }} />
            </b>
          </b>
        </div>
      </div>

      {/* Camada 3: estado */}
      <div
        className="iso-pl hb-pl"
        data-layer="3"
        style={
          {
            "--x": "10px",
            "--y": "-6px",
            "--w": "170px",
            "--h": "62px",
            "--r": "31px",
            "--zr": "464px",
          } as CSSProperties
        }
      >
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <i className="iso-pl__e" />
        <div className="iso-pl__face">
          <b className="hb-toast-dot" style={{ left: 16, top: 23 }} />
          <b className="hb-slot" style={{ left: 42, top: 14, width: 116, height: 16 }}>
            <b className="hb-slot__a" style={{ left: 0 }}>
              {labels.loading}
            </b>
            <b className="hb-slot__b" style={{ left: 0 }}>
              {labels.ready}
            </b>
          </b>
          <b className="hb-prog" style={{ left: 42, top: 38, width: 110, height: 5 }}>
            <b />
          </b>
        </div>
      </div>
    </>
  );
}

export function StackScene({ labels }: { labels: StackLabels }) {
  // --n é o número de caracteres do rótulo; o CSS usa para digitar uma letra por passo.
  const tagText = labels.layers.map(name => `// ${name}`);
  const tagStyle = (text: string) => ({ "--n": text.length }) as CSSProperties;
  return (
    <>
      <div className="hb-floor-layer" aria-hidden="true">
        <div className="iso" data-iso="floor">
          <b className="hb-floor" />
          <b className="hb-base" />
        </div>
      </div>

      <div className="hb-world" aria-hidden="true">
        <div className="iso" data-iso="world">
          <StackPlates labels={labels} />
        </div>
      </div>

      {/* Linha de estações à direita da pilha. O Giro não entra aqui: o Hero o renderiza. */}
      <div className="hb-line" aria-hidden="true">
        <div className="hb-line__deco">
          <svg className="hb-line__svg" aria-hidden="true">
            <polyline className="hb-rail" points="0,0 0,0" />
            <circle className="hb-stop" data-stop="-1" cx="0" cy="0" r={4} />
            <circle className="hb-stop" data-stop="0" cx="0" cy="0" r={5} />
            <circle className="hb-stop" data-stop="1" cx="0" cy="0" r={5} />
            <circle className="hb-stop" data-stop="2" cx="0" cy="0" r={5} />
            <circle className="hb-stop" data-stop="3" cx="0" cy="0" r={5} />
          </svg>
          <b className="hb-link" data-link="0" />
          <b className="hb-link" data-link="1" />
          <b className="hb-link" data-link="2" />
          <b className="hb-link" data-link="3" />
          <span className="hb-tag" data-tag="0" style={tagStyle(tagText[0])}>
            {tagText[0]}
          </span>
          <span className="hb-tag" data-tag="1" style={tagStyle(tagText[1])}>
            {tagText[1]}
          </span>
          <span className="hb-tag" data-tag="2" style={tagStyle(tagText[2])}>
            {tagText[2]}
          </span>
          <span className="hb-tag" data-tag="3" style={tagStyle(tagText[3])}>
            {tagText[3]}
          </span>
        </div>
      </div>
    </>
  );
}
