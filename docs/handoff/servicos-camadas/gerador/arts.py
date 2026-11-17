"""Cinco artes de serviço: interfaces em camadas isométricas, em HTML e CSS 3D.

Cada arte tem 48em de largura (1em = largura / 48, o host é um container de inline-size) e a
altura justa da composição (--ah). As placas ficam num plano girado em isometria (rotateX 60,
rotateZ -45) e sobem em Z. Tudo anima só transform, opacity, clip-path e cor, num relógio só
por arte (--T). Um cursor que encara a câmera dá a causa de cada passo.
"""

SCENE = "rotateX(60deg) rotateZ(-45deg)"


def E(v):
    return f"{round(v, 3):g}em"


def box(x, y, w, h, cls="", style="", inner=""):
    c = f' class="{cls}"' if cls else ""
    return f'<b{c} style="left:{E(x)};top:{E(y)};width:{E(w)};height:{E(h)};{style}">{inner}</b>'


def txt(x, y, text, cls="t", style=""):
    # A posição fica no <b> (em da arte); a fonte vai no <span>, senão o em da posição muda junto.
    return f'<b style="left:{E(x)};top:{E(y)}"><span class="{cls}" style="{style}">{text}</span></b>'


GEOM = []


def project(x, y, z):
    return (0.7071 * (x + y), 0.3536 * (y - x) - 0.866 * z)


def reach(x, y, z):
    """Ponto que algo em movimento alcança (o topo de um arco), para o enquadramento."""
    GEOM.append(project(x, y, z))


def plate(x, y, w, h, z, inner, cls="", d=0, r=1.1, edge=0.8):
    GEOM.extend(project(px, py, pz) for px in (x, x + w) for py in (y, y + h) for pz in (z, z - edge))
    edges = "".join(f'<i class="pl__e" style="--e:{E(-edge * k / 3)}"></i>' for k in (3, 2, 1))
    return (
        f'<div class="pl {cls}" style="--x:{E(x)};--y:{E(y)};--w:{E(w)};--h:{E(h)};--z:{E(z)};--r:{E(r)};--d:{d}ms">'
        f'<div class="pl__b">{edges}<div class="pl__face">{inner}</div></div></div>'
    )


def floor(x, y, w, h, r=1.1):
    return f'<b class="fl" style="left:{E(x)};top:{E(y)};width:{E(w)};height:{E(h)};border-radius:{E(r)}"></b>'


def billboard(cls, inner, z=None):
    """Algo que encara a câmera; o x/y anda no plano (cls) e o z numa camada própria (cls-z)."""
    zs = f' style="transform:translateZ({E(z)})"' if z is not None else ""
    return f'<div class="bb {cls}"><div class="bb__z {cls}-z"{zs}><div class="bb__r">{inner}</div></div></div>'


def dot(cls, color, size=1.3):
    return billboard(cls, f'<b class="bb__dot {cls}-dot" style="left:{E(-size / 2)};top:{E(-size / 2)};width:{E(size)};height:{E(size)};background:{color}"></b>')


def pill(cls, text, bg, fg, w=3.6):
    return billboard(cls, f'<b class="bb__dot bb__pill {cls}-dot" style="left:{E(-w / 2)};top:-.8em;width:{E(w)};height:1.6em;background:{bg};color:{fg}">'
                          f'<span>{text}</span></b>')


def cursor(cls, z):
    # A ponta da seta fica na origem: é ela que toca o botão.
    return billboard(cls, f'<svg aria-hidden="true" class="cur {cls}-p" viewBox="0 0 24 24" style="left:-.33em;top:-.22em;width:2.6em;height:2.6em">'
                          '<path d="M3 2 L3 19 L8 14.6 L11.4 22 L14.6 20.6 L11.2 13.4 L17.6 13.4 Z"/></svg>', z)


def giro(x, y, size, cls="", color="var(--ink)"):
    return (
        f'<svg aria-hidden="true" class="gm {cls}" viewBox="0 0 120 120" style="left:{E(x)};top:{E(y)};width:{E(size)};height:{E(size)};color:{color}">'
        '<circle class="gm__track" cx="60" cy="60" r="44"/>'
        '<g class="gm__turn"><circle class="gm__arc" cx="60" cy="60" r="44"/></g>'
        '<g class="gm__eyes"><ellipse cx="46" cy="54" rx="6" ry="9"/><ellipse cx="74" cy="54" rx="6" ry="9"/></g>'
        '<path class="gm__f gm__happy" d="M38 60 Q46 46 54 60 M66 60 Q74 46 82 60"/>'
        '<path class="gm__f gm__x" d="M39 50 L53 62 M53 50 L39 62 M67 50 L81 62 M81 50 L67 62"/>'
        '<path class="gm__f gm__sleep" d="M39 55 Q46 62 53 55 M67 55 Q74 62 81 55"/>'
        "</svg>"
    )


def check(x, y, size, cls="", color="var(--paper)"):
    return (
        f'<svg aria-hidden="true" class="ck {cls}" viewBox="0 0 24 24" style="left:{E(x)};top:{E(y)};width:{E(size)};height:{E(size)};color:{color}">'
        '<path d="M5 12.5 L10 17 L19 7" pathLength="1"/></svg>'
    )


def fit(margin_x=0.02, margin_y=0.035):
    """Palco justo: 48em de largura e a altura que a composição pede, com uma margem pequena."""
    xs = [p[0] for p in GEOM]
    ys = [p[1] for p in GEOM]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    k = 48 * (1 - 2 * margin_x) / w
    ah = k * h / (1 - 2 * margin_y)
    cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    return f"--sx:{E(24 - k * cx)};--sy:{E(ah / 2 - k * cy)};--k:{round(k, 3)};--ah:{E(ah)};", round(48 / ah, 3)


def kf(name, stops):
    """stops: [(pct, {prop: valor}, easing_do_trecho_seguinte | None)]"""
    out = []
    for pct, props, ease in stops:
        body = ";".join(f"{k}:{v}" for k, v in props.items())
        if ease:
            body += f";animation-timing-function:{ease}"
        out.append(f"{round(pct, 2):g}%{{{body}}}")
    return f"@keyframes {name}{{{''.join(out)}}}"


def at(x, y):
    return {"transform": f"translate({E(x)},{E(y)})"}


LIFT = 2.4  # o cursor flutua acima da placa para a seta inteira ficar por cima dela


def cat(x, y):
    """Posição do cursor: erguido LIFT em z e recuado no plano para a ponta cair sobre (x, y)."""
    d = 1.2247 * LIFT
    return at(x - d, y + d)


def press(name, clicks):
    """O cursor afunda um pouco no clique e volta com uma sobra."""
    stops = [(0, {"transform": "scale(1)"}, None)]
    for c in clicks:
        stops += [(c - .5, {"transform": "scale(1)"}, ER), (c + .8, {"transform": "scale(.78)"}, EH), (c + 3.5, {"transform": "scale(1)"}, None)]
    stops.append((100, {"transform": "scale(1)"}, None))
    return kf(name, stops)


def ripple(name, t, dur=6, s0=.3, s1=1.1):
    return kf(name, [(0, {"opacity": 0, "transform": f"scale({s0})"}, None), (t, {"opacity": 0, "transform": f"scale({s0})"}, None),
                     (t + .4, {"opacity": .9, "transform": f"scale({s0})"}, EOUT), (t + dur, {"opacity": 0, "transform": f"scale({s1})"}, None),
                     (100, {"opacity": 0, "transform": f"scale({s1})"}, None)])


ER = "var(--er)"
EH = "var(--eh)"
EIO = "var(--eio)"
EIN = "cubic-bezier(.55,0,.8,.3)"
EOUT = "cubic-bezier(.2,.7,.35,1)"

BASE_CSS = """
.ar{--ink:#0b0c1f;--ink-2:rgba(11,12,31,.58);--ink-3:rgba(11,12,31,.17);--ink-4:rgba(11,12,31,.07);
  --paper:#fbfaf6;--paper-2:#efeee8;--side:#d6d4cb;--azul:#2b2eff;--lima:#d2ff4d;--tinta:#0b0c1f;
  --floor:rgba(11,12,31,.07);
  --er:cubic-bezier(.2,.8,.2,1);--eh:cubic-bezier(.34,1.56,.64,1);--eio:cubic-bezier(.65,0,.35,1);
  position:relative;display:block;width:48em;height:var(--ah,32em);font-size:calc(100cqw / 48);
  font-family:"Anybody",system-ui,sans-serif;color:var(--ink);pointer-events:none;user-select:none;}
.ar *,.ar *::before,.ar *::after{box-sizing:border-box;}
.ar b{position:absolute;display:block;font-weight:inherit;}
.ar b > span{display:block;}
.ar svg{position:absolute;overflow:visible;}
.ar .t{font:500 .78em/1 "Geist Mono",ui-monospace,monospace;letter-spacing:-.01em;white-space:nowrap;color:var(--ink-2);}
.ar .n{font:800 1em/1 "Anybody",sans-serif;font-stretch:115%;letter-spacing:-.02em;color:var(--ink);white-space:nowrap;}
.ar__scene{position:absolute;left:var(--sx,50%);top:var(--sy,56%);width:0;height:0;transform-style:preserve-3d;
  transform:scale(var(--k,1)) """ + SCENE + """;}
.ar .pl{position:absolute;left:var(--x);top:var(--y);width:var(--w);height:var(--h);transform-style:preserve-3d;
  transform:translateZ(var(--z));transition:translate .9s var(--er) calc(var(--cd,0ms) + var(--d,0ms));}
.ar .pl__b{position:absolute;inset:0;transform-style:preserve-3d;}
.ar .pl__e,.ar .pl__face{position:absolute;inset:0;border-radius:var(--r);transition:opacity .4s linear calc(var(--cd,0ms) + var(--d,0ms));}
.ar .pl__e{background:var(--side);transform:translateZ(var(--e));}
.ar .pl__face{background:var(--paper);overflow:hidden;}
.ar .fl{background:var(--floor);transform:translateZ(-1.6em);transition:opacity .6s linear;}
.ar .bb,.ar .bb__z,.ar .bb__r{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d;}
.ar .bb__r{transform:rotateZ(45deg) rotateX(-60deg);}
.ar .bb__dot{border-radius:999px;opacity:0;}
.ar .bb__pill{display:flex;align-items:center;justify-content:center;font:600 .82em/1 "Geist Mono",monospace;}
.ar .bb__pill span{font-size:1em;}
.ar .cur{transform-origin:.33em .22em;}
.ar .cur path{fill:var(--ink);stroke:var(--paper);stroke-width:1.6;stroke-linejoin:round;}
.ar .gm__track{fill:none;stroke:currentColor;stroke-width:14;opacity:0;}
.ar .gm__arc{fill:none;stroke:currentColor;stroke-width:14;stroke-linecap:round;stroke-dasharray:240 37;}
.ar .gm__turn{transform-origin:60px 60px;transform:rotate(-21.5deg);}
.ar .gm__eyes{fill:currentColor;transform-origin:60px 54px;}
.ar .gm__f{fill:none;stroke:currentColor;stroke-width:9;stroke-linecap:round;stroke-linejoin:round;opacity:0;}
.ar .ck path{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;}
.ar .ring{border-radius:50%;border:.2em solid var(--azul);opacity:0;}
.ar .pt{border-radius:50%;opacity:0;}
/* Entrada: as placas sobem do chão em cascata. O loop já corre por baixo. */
.ar.is-pre .pl{translate:0 0 -5em;}
.ar.is-pre .pl__e,.ar.is-pre .pl__face,.ar.is-pre .fl,.ar.is-pre .cur{opacity:0;}
.ar.is-pre .pl__e,.ar.is-pre .pl__face,.ar.is-pre .pl{transition-delay:0ms;transition-duration:0ms;}
.ar .cur{transition:opacity .3s linear calc(var(--cd,0ms) + 700ms);}
/* Fora de vista e com movimento reduzido, o relógio para. */
.ar.is-paused *{animation-play-state:paused !important;}
.ar.is-still *{animation:none !important;}
.ar.is-still .cur{opacity:0;}
"""


def scoped(key, n):
    """Toda classe sN-* ganha o relógio da arte; cada regra só diz o nome da animação."""
    return f".ar-{key} [class*=s{n}-]{{animation:var(--T) linear infinite;}}"


# -------------------------------------------------------------------------------------------
# 01 · Sites completos: o cursor clica no menu, a página troca, o mapa do site e o SEO acompanham.
# -------------------------------------------------------------------------------------------
def art_sites():
    GEOM.clear()
    T = 6.4
    VW = 23.8
    X1, Y1, Z1 = -13, -12, 6.5   # navegador
    X0, Y0 = -23, -5             # mapa do site
    XC, YC, ZC = 9, 10, 5        # selo de SEO
    C = [19, 52, 85]             # cliques: sobre, blog, início
    LINK = [1, 2, 0]

    def page_home(ox):
        return "".join([
            box(ox, .4, 13, 1.6, "", "background:var(--ink);border-radius:.35em"),
            box(ox, 2.5, 9.5, 1.6, "", "background:var(--ink);border-radius:.35em"),
            box(ox, 4.9, 12, .55, "", "background:var(--ink-3);border-radius:.3em"),
            box(ox, 5.9, 8.6, .55, "", "background:var(--ink-3);border-radius:.3em"),
            box(ox, 7.7, 6.4, 2.1, "", "background:var(--azul);border-radius:1.05em",
                box(1.6, .8, 3.2, .5, "", "background:var(--paper);border-radius:.25em")),
            box(ox + 7.2, 7.7, 5.4, 2.1, "", "border:.16em solid var(--ink-3);border-radius:1.05em"),
            box(ox + 15, .4, 8.8, 9.6, "", "background:var(--lima);border-radius:.9em",
                giro(2.1, 2.5, 4.6, "", "var(--ink)")),
        ])

    def page_sobre(ox):
        return "".join([
            box(ox, .4, 6.4, 6.4, "", "background:var(--azul);border-radius:50%",
                box(1.7, 1.7, 3, 3, "", "background:var(--lima);border-radius:50%")),
            box(ox + 7.8, .7, 9.5, 1.5, "", "background:var(--ink);border-radius:.35em"),
            box(ox + 7.8, 3.2, 14, .55, "", "background:var(--ink-3);border-radius:.3em"),
            box(ox + 7.8, 4.3, 15.4, .55, "", "background:var(--ink-3);border-radius:.3em"),
            box(ox + 7.8, 5.4, 11.6, .55, "", "background:var(--ink-3);border-radius:.3em"),
            *[box(ox + i * 5.6, 8, 5, 1.6, "", f"border:.16em solid {c};border-radius:.8em") for i, c in enumerate(["var(--azul)", "var(--ink-3)", "var(--ink-3)"])],
        ])

    def page_blog(ox):
        thumbs = ["var(--azul)", "var(--lima)", "var(--ink)"]
        cards = "".join(
            box(ox + i * 8.1, 2.6, 7.6, 7.8, "", "background:var(--paper-2);border-radius:.8em",
                box(.5, .5, 6.6, 3.8, "", f"background:{thumbs[i]};border-radius:.5em")
                + box(.5, 5, 5.6, .55, "", "background:var(--ink-2);border-radius:.3em")
                + box(.5, 6.1, 3.8, .55, "", "background:var(--ink-3);border-radius:.3em"))
            for i in range(3))
        return box(ox, .2, 8, 1.5, "", "background:var(--ink);border-radius:.35em") + cards

    strip = box(0, 0, VW * 4, 10.6, "s1-strip", "",
                page_home(0) + page_sobre(VW) + page_blog(VW * 2) + page_home(VW * 3))
    links = "".join(box(16.6 + i * 3, 3.95, 2.4, .5, "", "background:var(--ink-2);border-radius:.25em") for i in range(3))
    ripples = "".join(box(17.8 + i * 3 - 1.6, 4.2 - 1.6, 3.2, 3.2, f"ring s1-rp{i}") for i in range(3))
    browser = "".join([
        box(0, 0, 27, 2.6, "", "background:var(--paper-2)"),
        *[box(1.1 + i * 1.1, .95, .7, .7, "", f"background:{c};border-radius:50%") for i, c in enumerate(["#ff5c3d", "var(--lima)", "var(--ink-3)"])],
        box(5.2, .6, 14, 1.4, "", "background:var(--paper);border-radius:.7em;overflow:hidden",
            txt(.8, .34, "seusite.com/", "t", "color:var(--ink)")
            + box(6.75, 0, 6, 1.4, "", "overflow:hidden",
                  box(0, 0, 6, 5.6, "s1-path", "",
                      "".join(txt(0, .34 + i * 1.4, p, "t", "color:var(--azul)") for i, p in enumerate(["", "sobre", "blog", ""]))))),
        box(0, 2.45, 27, .22, "s1-prog", "background:var(--azul);transform-origin:left;transform:scaleX(0)"),
        box(1.6, 3.5, 1.5, 1.5, "", "border:.32em solid var(--azul);border-radius:50%"),
        links,
        box(16.6, 4.9, 2.4, .26, "s1-under", "background:var(--azul);border-radius:.13em"),
        ripples,
        box(1.6, 6, VW, 10.6, "", "overflow:hidden", strip),
    ])
    nodes = ["/", "/sobre", "/blog"]
    sitemap = "".join([
        txt(1.4, 1.3, "mapa do site"),
        box(1.4, 6.1, 5, 2.4, "", "background:var(--ink);border-radius:1.2em",
            txt(1.05, .82, "seusite", "t", "color:var(--paper)")),
        box(6.4, 7.22, 2.8, .16, "", "background:var(--ink-3)"),
        box(9.12, 3.6, .16, 7.36, "", "background:var(--ink-3)"),
        *[box(9.2, 3.52 + i * 3.6, 2.8, .16, "", "background:var(--ink-3)") for i in range(3)],
        # o caminho da página da vez acende
        box(6.4, 7.18, 2.8, .24, "s1-w0", "background:var(--azul);transform-origin:left"),
        *[box(12, 2.4 + i * 3.6, 6.4, 2.4, "", "background:var(--paper-2);border-radius:1.2em",
              txt(.95, .82, n, "t", "color:var(--ink)")) for i, n in enumerate(nodes)],
        box(11.6, 2, 7.2, 3.2, "s1-node", "border:.22em solid var(--azul);border-radius:1.6em"),
        txt(1.4, 12.6, "3 páginas · 0 erros", "t"),
    ])
    seo = "".join([
        '<svg aria-hidden="true" viewBox="0 0 40 40" style="left:.7em;top:.7em;width:3.2em;height:3.2em">'
        '<circle cx="20" cy="20" r="15" style="fill:none;stroke:var(--ink-3);stroke-width:5"/>'
        '<circle class="s1-ring" cx="20" cy="20" r="15" style="fill:none;stroke:var(--azul);stroke-width:5;stroke-linecap:round;stroke-dasharray:100" pathLength="100" transform="rotate(-90 20 20)"/></svg>',
        txt(4.5, .95, "SEO"),
        txt(4.5, 2.25, "100", "n", "font-size:1.35em"),
    ])
    link_at = lambda i: (X1 + 17.8 + i * 3 + .3, Y1 + 4.2 + .35)
    rest = [(X1 + 9, Y1 + 11), (X1 + 13, Y1 + 13), (X1 + 6, Y1 + 12)]
    cur = [(0, cat(*rest[0]), None)]
    for n, (c, li) in enumerate(zip(C, LINK)):
        cur += [(c - 9, cat(*rest[n]), EIO), (c - 1, cat(*link_at(li)), None),
                (c + 3, cat(*link_at(li)), EIO), (c + 12 if n < 2 else 98, cat(*rest[(n + 1) % 3]), None)]
    cur.append((100, cat(*rest[0]), None))

    def steps(name, prop, fmt, vals, off, dur, ease=ER):
        stops = [(0, {prop: fmt(vals[0])}, None)]
        for c, v0, v1 in zip(C, vals, vals[1:]):
            stops += [(c + off, {prop: fmt(v0)}, ease), (min(c + off + dur, 100), {prop: fmt(v1)}, None)]
        stops.append((100, {prop: fmt(vals[-1])}, None))
        return kf(name, stops)

    prog = [(0, {"transform": "scaleX(0)", "opacity": 1}, None)]
    ring = [(0, {"stroke-dashoffset": 0}, None)]
    wire = [(0, {"transform": "scaleX(1)"}, None)]
    for c in C:
        prog += [(c + .5, {"transform": "scaleX(0)", "opacity": 1}, EOUT), (c + 8, {"transform": "scaleX(1)", "opacity": 1}, None),
                 (c + 10, {"transform": "scaleX(1)", "opacity": 0}, None), (c + 10.5, {"transform": "scaleX(0)", "opacity": 1}, None)]
        ring += [(c + 2, {"stroke-dashoffset": 0}, ER), (c + 4, {"stroke-dashoffset": 100}, None),
                 (c + 8, {"stroke-dashoffset": 100}, EOUT), (min(c + 14, 100), {"stroke-dashoffset": 0}, None)]
        wire += [(c + 2, {"transform": "scaleX(1)"}, ER), (c + 3, {"transform": "scaleX(0)"}, None),
                 (c + 4, {"transform": "scaleX(0)"}, ER), (c + 10, {"transform": "scaleX(1)"}, None)]
    prog.append((100, {"transform": "scaleX(0)", "opacity": 1}, None))
    ring.append((100, {"stroke-dashoffset": 0}, None))
    wire.append((100, {"transform": "scaleX(1)"}, None))

    scene = (
        floor(X0, Y0, 22, 15)
        + plate(X0, Y0, 22, 15, 0, sitemap, d=0)
        + plate(XC, YC, 9, 4.6, ZC, seo, cls="s1-chip", d=220, r=1)
        + plate(X1, Y1, 27, 18, Z1, browser, d=120)
        + cursor("s1-cur", Z1 + LIFT)
    )
    vars_, ratio = fit()
    css = "\n".join([
        f".ar-sites{{--T:{T}s;{vars_}--side:#c9cae9;--floor:rgba(11,12,31,.16);}}",
        scoped("sites", 1),
        ".ar-sites .s1-strip{animation-name:s1-strip}.ar-sites .s1-path{animation-name:s1-path}",
        ".ar-sites .s1-under{animation-name:s1-under}.ar-sites .s1-node{animation-name:s1-node}",
        ".ar-sites .s1-rp0{animation-name:s1-rp0}.ar-sites .s1-rp1{animation-name:s1-rp1}.ar-sites .s1-rp2{animation-name:s1-rp2}",
        ".ar-sites .s1-prog{animation-name:s1-prog}.ar-sites .s1-ring{animation-name:s1-ring}.ar-sites .s1-w0{animation-name:s1-w0}",
        ".ar-sites .s1-cur{animation-name:s1-cur}.ar-sites .s1-cur-p{animation-name:s1-press}.ar-sites .s1-cur-z{animation:none}",
        ".ar-sites .s1-chip > .pl__b{animation:s1-float 2.4s var(--eio) infinite alternate}",
        steps("s1-strip", "transform", lambda v: f"translateX({E(-VW * v)})", [0, 1, 2, 3], 2, 8),
        steps("s1-path", "transform", lambda v: f"translateY({E(-1.4 * v)})", [0, 1, 2, 3], 2, 6),
        steps("s1-under", "transform", lambda v: f"translateX({E(3 * v)})", [0, 1, 2, 0], 1, 7),
        steps("s1-node", "transform", lambda v: f"translateY({E(3.6 * v)})", [0, 1, 2, 0], 3, 7, EH),
        *[ripple(f"s1-rp{li}", c) for c, li in zip(C, LINK)],
        kf("s1-prog", prog), kf("s1-ring", ring), kf("s1-w0", wire),
        kf("s1-cur", cur), press("s1-press", C),
        kf("s1-float", [(0, {"transform": "translateZ(0)"}, None), (100, {"transform": "translateZ(.6em)"}, None)]),
    ])
    beats = [(0, "Página inicial"), (19, "Clica em sobre"), (52, "Clica em blog"), (85, "Volta ao início")]
    return {"key": "sites", "T": T, "css": css, "scene": scene, "beats": beats, "ratio": ratio}


# -------------------------------------------------------------------------------------------
# 02 · Landing pages: a página carrega, o clique vira conversão no painel e a conta sobe.
# -------------------------------------------------------------------------------------------
def art_landing():
    GEOM.clear()
    T = 5.6
    X1, Y1, Z1 = -12, -12, 6.5   # página
    X0, Y0 = -21, -6             # analytics
    XV, YV, ZV = 9, 6.2, 12      # Web Vitals
    cta = (X1 + 5.6, Y1 + 13.1, Z1 + .75)
    lf = (14.6, 7.4)             # pouso no painel, em coordenadas da placa
    land = (X0 + lf[0], Y0 + lf[1], .75)
    reach(cta[0] + (land[0] - cta[0]) * .45, cta[1] + (land[1] - cta[1]) * .45, cta[2] + 3.2)
    page = "".join([
        box(1.6, 1.4, 1.4, 1.4, "", "border:.3em solid var(--azul);border-radius:50%"),
        box(18.4, 1.9, 2, .45, "", "background:var(--ink-3);border-radius:.25em"),
        box(21, 1.9, 2, .45, "", "background:var(--ink-3);border-radius:.25em"),
        box(1.6, 4.2, 14.5, 1.7, "s2-h1", "border-radius:.35em"),
        box(1.6, 6.3, 10.5, 1.7, "s2-h2", "border-radius:.35em"),
        box(1.6, 8.8, 13, .55, "s2-p1", "border-radius:.3em"),
        box(1.6, 9.8, 9.5, .55, "s2-p2", "border-radius:.3em"),
        box(16.6, 4.2, 6.8, 10.2, "s2-img", "border-radius:.9em;overflow:hidden",
            box(1.4, 3.1, 4, 4, "s2-imgin", "border-radius:50%;background:var(--lima)")),
        box(1.6, 11.8, 8, 2.6, "s2-cta", "background:var(--azul);border-radius:1.3em",
            box(2, 1.05, 4, .5, "s2-lbl", "background:var(--paper);border-radius:.25em")
            + giro(3.15, .45, 1.7, "s2-spin", "var(--paper)")
            + check(3.1, .4, 1.8, "s2-ck")),
        box(10.6, 12.3, 4.6, 1.6, "", "border:.16em solid var(--ink-3);border-radius:.8em"),
        box(5.6 - 2, 13.1 - 2, 4, 4, "ring s2-rp"),
    ])
    path = "M0 40 C 10 40 18 22 30 24 S 48 48 62 44 S 82 16 98 22 S 124 46 138 42 S 156 40 162 40"
    wave = (f'<path d="{path} L162 66 L0 66 Z" style="fill:rgba(43,46,255,.10)"/>'
            f'<path d="{path}" style="fill:none;stroke:var(--azul);stroke-width:2.6;vector-effect:non-scaling-stroke"/>')
    spark = (f'<svg aria-hidden="true" class="s2-spark" viewBox="0 0 324 66" preserveAspectRatio="none" style="left:0;top:0;width:32.4em;height:6.6em">'
             f'{wave}<g transform="translate(162 0)">{wave}</g></svg>')
    angles = [(1, 0), (.5, .87), (-.5, .87), (-1, 0), (-.5, -.87), (.5, -.87)]
    colors = ["var(--azul)", "var(--lima)", "var(--ink)"] * 2
    parts = "".join(box(lf[0] - .45, lf[1] - .45, .9, .9, f"pt s2-pt{i}", f"background:{colors[i]}") for i in range(6))
    analytics = "".join([
        txt(1.4, 1.3, "conversões · hoje"),
        box(1.4, 2.4, 7, 2.4, "", "overflow:hidden",
            box(0, 0, 7, 4.8, "s2-num", "",
                txt(0, .1, "4,8%", "n", "font-size:2.2em") + txt(0, 2.5, "4,9%", "n", "font-size:2.2em;color:var(--azul)"))),
        box(1.4, 5.4, 16.2, 6.4, "", "overflow:hidden", spark),
        box(1.4, 11.85, 16.2, .12, "", "background:var(--ink-3)"),
        box(lf[0] - 2.2, lf[1] - 2.2, 4.4, 4.4, "ring s2-splash"),
        parts,
        box(12.6, 1.2, 4.6, 2.2, "s2-plus", "background:var(--lima);border-radius:1.1em",
            txt(1.15, .55, "+1", "n", "font-size:1.05em")),
    ])
    vit = "".join([
        '<svg aria-hidden="true" viewBox="0 0 40 40" style="left:.8em;top:.75em;width:3.3em;height:3.3em">'
        '<circle cx="20" cy="20" r="15" style="fill:none;stroke:var(--ink-3);stroke-width:5"/>'
        '<circle class="s2-ring" cx="20" cy="20" r="15" style="fill:none;stroke:var(--azul);stroke-width:5;stroke-linecap:round;stroke-dasharray:100" pathLength="100" transform="rotate(-90 20 20)"/></svg>',
        txt(4.8, 1.05, "LCP"),
        txt(4.8, 2.35, "0,8 s", "n", "font-size:1.25em"),
    ])
    r0, r1 = (X1 + 13, Y1 + 9), (X1 + 15, Y1 + 5)
    tip = (cta[0] + .6, cta[1] + .2)
    scene = (
        floor(X0, Y0, 19, 13)
        + plate(X0, Y0, 19, 13, 0, analytics, d=0)
        + plate(X1, Y1, 25, 17, Z1, page, d=120)
        + plate(XV, YV, 9.6, 4.8, ZV, vit, cls="s2-chip", d=240, r=1)
        + dot("s2-dot", "var(--azul)", 1.4)
        + cursor("s2-cur", Z1 + LIFT)
    )
    sk = "var(--ink-4)"

    def resolve(name, a, b, final):
        return kf(name, [(0, {"background-color": sk}, None), (a, {"background-color": sk}, ER), (b, {"background-color": final}, None),
                         (86, {"background-color": final}, ER), (91, {"background-color": sk}, None), (100, {"background-color": sk}, None)])

    hide = {"opacity": 0, "transform": "scale(.5)"}
    show = {"opacity": 1, "transform": "scale(1)"}
    vars_, ratio = fit()
    css = "\n".join([
        f".ar-landing{{--T:{T}s;{vars_}}}",
        scoped("landing", 2),
        ".ar-landing .s2-h1,.ar-landing .s2-h2{background:var(--ink)}.ar-landing .s2-p1,.ar-landing .s2-p2{background:var(--ink-3)}.ar-landing .s2-img{background:var(--azul)}",
        ".ar-landing .s2-spin,.ar-landing .s2-plus{opacity:0}",
        ".ar-landing .s2-h1{animation-name:s2-h1}.ar-landing .s2-h2{animation-name:s2-h2}",
        ".ar-landing .s2-p1{animation-name:s2-p1}.ar-landing .s2-p2{animation-name:s2-p2}",
        ".ar-landing .s2-img{animation-name:s2-img}.ar-landing .s2-imgin{animation-name:s2-imgin}",
        ".ar-landing .s2-cta{animation-name:s2-cta}.ar-landing .s2-lbl{animation-name:s2-lbl}",
        ".ar-landing .s2-spin{animation-name:s2-spin}.ar-landing .s2-spin .gm__turn{animation:s2-turn var(--T) linear infinite}",
        ".ar-landing .s2-spin .gm__arc{stroke-dasharray:70 207}.ar-landing .s2-spin .gm__track{opacity:.3}",
        ".ar-landing .s2-ck path{animation:s2-ck var(--T) linear infinite}",
        ".ar-landing .s2-rp{animation-name:s2-rp}.ar-landing .s2-splash{animation-name:s2-splash}",
        ".ar-landing .s2-plus{animation-name:s2-plus}.ar-landing .s2-spark{animation-name:s2-spark}.ar-landing .s2-num{animation-name:s2-num}",
        ".ar-landing .s2-ring{animation-name:s2-ring}",
        "".join(f".ar-landing .s2-pt{i}{{animation-name:s2-pt{i}}}" for i in range(6)),
        ".ar-landing .s2-chip > .pl__b{animation:s2-float 2.2s var(--eio) infinite alternate}",
        ".ar-landing .s2-dot{animation-name:s2-dxy}.ar-landing .s2-dot-z{animation-name:s2-dz}.ar-landing .s2-dot-dot{animation-name:s2-dop}",
        ".ar-landing .s2-cur{animation-name:s2-cur}.ar-landing .s2-cur-p{animation-name:s2-press}.ar-landing .s2-cur-z{animation:none}",
        resolve("s2-h1", 2, 7, "var(--ink)"), resolve("s2-h2", 3, 8, "var(--ink)"),
        resolve("s2-p1", 4, 9, "var(--ink-3)"), resolve("s2-p2", 4.5, 9.5, "var(--ink-3)"),
        resolve("s2-img", 5, 11, "var(--azul)"),
        kf("s2-imgin", [(0, {"transform": "scale(0)"}, None), (8, {"transform": "scale(0)"}, EH), (14, {"transform": "scale(1)"}, None),
                        (86, {"transform": "scale(1)"}, ER), (90, {"transform": "scale(0)"}, None), (100, {"transform": "scale(0)"}, None)]),
        kf("s2-cta", [(0, {"transform": "scale(1)"}, None), (23, {"transform": "scale(1)"}, ER), (24.5, {"transform": "scale(.92)"}, EH),
                      (28, {"transform": "scale(1)"}, None), (100, {"transform": "scale(1)"}, None)]),
        kf("s2-lbl", [(0, show, None), (24.5, show, ER), (27, hide, None), (87, hide, ER), (91, show, None), (100, show, None)]),
        kf("s2-spin", [(0, hide, None), (26, hide, ER), (28.5, show, None), (36, show, ER), (38, hide, None), (100, hide, None)]),
        kf("s2-turn", [(0, {"transform": "rotate(-21.5deg)"}, None), (26, {"transform": "rotate(-21.5deg)"}, None),
                       (38, {"transform": "rotate(698.5deg)"}, None), (100, {"transform": "rotate(698.5deg)"}, None)]),
        kf("s2-ck", [(0, {"stroke-dashoffset": 1}, None), (37.5, {"stroke-dashoffset": 1}, ER), (41, {"stroke-dashoffset": 0}, None),
                     (86, {"stroke-dashoffset": 0}, ER), (89, {"stroke-dashoffset": 1}, None), (100, {"stroke-dashoffset": 1}, None)]),
        ripple("s2-rp", 23.5, 7), ripple("s2-splash", 49, 7, .2, 1.2),
        *[kf(f"s2-pt{i}", [(0, {"opacity": 0, "transform": "translate(0,0) scale(1)"}, None), (49, {"opacity": 0, "transform": "translate(0,0) scale(1)"}, None),
                           (49.5, {"opacity": 1, "transform": "translate(0,0) scale(1)"}, EOUT),
                           (57, {"opacity": 0, "transform": f"translate({E(dx * 4.2)},{E(dy * 4.2)}) scale(.4)"}, None),
                           (100, {"opacity": 0, "transform": f"translate({E(dx * 4.2)},{E(dy * 4.2)}) scale(.4)"}, None)])
          for i, (dx, dy) in enumerate(angles)],
        kf("s2-plus", [(0, {"opacity": 0, "transform": "translateY(.8em) scale(.6)"}, None), (50, {"opacity": 0, "transform": "translateY(.8em) scale(.6)"}, EH),
                       (56, {"opacity": 1, "transform": "translateY(0) scale(1)"}, None), (82, {"opacity": 1, "transform": "translateY(0) scale(1)"}, ER),
                       (87, {"opacity": 0, "transform": "translateY(-.6em) scale(1)"}, None), (100, {"opacity": 0, "transform": "translateY(.8em) scale(.6)"}, None)]),
        kf("s2-num", [(0, {"transform": "translateY(0)"}, None), (50, {"transform": "translateY(0)"}, EH), (55, {"transform": "translateY(-2.4em)"}, None),
                      (86, {"transform": "translateY(-2.4em)"}, ER), (91, {"transform": "translateY(0)"}, None), (100, {"transform": "translateY(0)"}, None)]),
        kf("s2-spark", [(0, {"transform": "translateX(0)"}, None), (100, {"transform": "translateX(-16.2em)"}, None)]),
        kf("s2-ring", [(0, {"stroke-dashoffset": 100}, None), (2, {"stroke-dashoffset": 100}, ER), (12, {"stroke-dashoffset": 8}, None),
                       (86, {"stroke-dashoffset": 8}, ER), (91, {"stroke-dashoffset": 100}, None), (100, {"stroke-dashoffset": 100}, None)]),
        kf("s2-float", [(0, {"transform": "translateZ(0)"}, None), (100, {"transform": "translateZ(.7em)"}, None)]),
        kf("s2-dxy", [(0, at(cta[0], cta[1]), None), (38, at(cta[0], cta[1]), None), (49, at(land[0], land[1]), None), (100, at(land[0], land[1]), None)]),
        kf("s2-dz", [(0, {"transform": f"translateZ({E(cta[2])})"}, None), (38, {"transform": f"translateZ({E(cta[2])})"}, EOUT),
                     (43, {"transform": f"translateZ({E(cta[2] + 3.2)})"}, EIN), (49, {"transform": f"translateZ({E(land[2])})"}, None),
                     (100, {"transform": f"translateZ({E(land[2])})"}, None)]),
        kf("s2-dop", [(0, {"opacity": 0, "transform": "scale(.4)"}, None), (38, {"opacity": 0, "transform": "scale(.4)"}, EH),
                      (40, {"opacity": 1, "transform": "scale(1)"}, None), (48.5, {"opacity": 1, "transform": "scale(1)"}, ER),
                      (50, {"opacity": 0, "transform": "scale(.2)"}, None), (100, {"opacity": 0, "transform": "scale(.2)"}, None)]),
        kf("s2-cur", [(0, cat(*r0), None), (12, cat(*r0), EIO), (21, cat(*tip), None), (27, cat(*tip), EIO), (38, cat(*r1), None),
                      (86, cat(*r1), EIO), (97, cat(*r0), None), (100, cat(*r0), None)]),
        press("s2-press", [23.5]),
    ])
    beats = [(2, "Carrega em 0,8 s"), (23, "Clique no botão"), (38, "O clique desce"), (49, "Conta a conversão"), (86, "Nova visita")]
    return {"key": "landing", "T": T, "css": css, "scene": scene, "beats": beats, "ratio": ratio}


# -------------------------------------------------------------------------------------------
# 03 · Interfaces de produto: carregando, vazio, erro; o cursor tenta de novo e a lista entra.
# -------------------------------------------------------------------------------------------
def art_product():
    GEOM.clear()
    T = 7.2
    X1, Y1, Z1 = -11, -11, 6.5
    X0, Y0 = -15, -1
    XT, YT, ZT = 5.4, 2.6, 12
    CX = 13.9   # centro da área de conteúdo
    states = ["carregando", "vazio", "erro", "pronto", "carregando"]
    rows = "".join(
        box(7.2, 5 + i * 3.3, 13.4, 2.8, f"s3-row s3-row{i}", "",
            box(0, .4, 2, 2, "", f"background:{c};border-radius:50%")
            + box(2.8, .55, 6.2, .7, "", "background:var(--ink);border-radius:.3em")
            + box(2.8, 1.7, 4, .5, "", "background:var(--ink-3);border-radius:.25em")
            + box(9.8, .7, 3.6, 1.4, "", "background:var(--lima);border-radius:.7em",
                  check(1.15, .05, 1.3, "", "var(--ink)")))
        for i, c in enumerate(["var(--azul)", "var(--lima)", "var(--ink)"]))
    side = "".join([
        box(1.1, 4.7, 4.6, 1.5, "", "background:var(--ink-4);border-radius:.75em"),
        *[box(1.7, 5.2 + i * 1.9, w, .45, "", f"background:{c};border-radius:.22em")
          for i, (w, c) in enumerate([(3, "var(--ink)"), (2.4, "var(--ink-3)"), (2.8, "var(--ink-3)"), (2, "var(--ink-3)")])],
        box(6.3, 3.9, .12, 13.1, "", "background:var(--ink-4)"),
    ])
    panel = "".join([
        box(1.6, 1.5, 5.4, 1.1, "", "background:var(--ink);border-radius:.3em"),
        box(7.6, 1.15, 1.8, 1.8, "s3-badge", "background:var(--lima);border-radius:50%", txt(.55, .45, "3", "n", "font-size:.9em")),
        box(10.4, 1.35, 6.8, 1.4, "", "background:var(--ink-4);border-radius:.7em"),
        box(18.8, 1.3, 1.6, 1.6, "", "background:var(--paper-2);border-radius:50%"),
        box(0, 3.9, 22, .12, "", "background:var(--ink-4)"),
        side,
        box(CX - 3.1, 4.6, 6.2, 6.2, "s3-gwrap", "", giro(0, 0, 6.2, "s3-giro", "var(--ink)")),
        box(CX - 2.5, 12.2, 5, .55, "s3-c0", "background:var(--ink-3);border-radius:.3em;overflow:hidden",
            box(-2, 0, 2, .55, "s3-shine", "background:rgba(255,255,255,.75)")),
        box(CX - 3.7, 12, 7.4, .9, "s3-c1", "background:var(--ink);border-radius:.3em"),
        box(CX - 2.7, 13.4, 5.4, .5, "s3-c1", "background:var(--ink-3);border-radius:.25em"),
        box(CX - 3.4, 11.8, 6.8, .9, "s3-c2", "background:var(--ink);border-radius:.3em"),
        box(CX - 3, 13.2, 6, 1.9, "s3-c2", "", box(0, 0, 6, 1.9, "s3-retry", "background:var(--azul);border-radius:.95em",
                                                  box(1.5, .7, 3, .5, "", "background:var(--paper);border-radius:.25em"))),
        rows,
    ])
    ds = "".join([
        txt(1.4, 1.2, "componentes"),
        box(1.4, 3, 6, 2, "", "background:var(--azul);border-radius:1em",
            box(1.5, .78, 3, .45, "", "background:var(--paper);border-radius:.22em")),
        box(8.6, 3.1, 3.4, 1.8, "s3-tg", "border-radius:.9em",
            box(.2, .2, 1.4, 1.4, "s3-knob", "background:var(--paper);border-radius:50%")),
        box(13.4, 3.1, 1.8, 1.8, "s3-cb", "border-radius:.45em;border:.18em solid var(--ink)",
            check(.12, .12, 1.25, "s3-cbk", "var(--paper)")),
        box(1.4, 6.6, 10.6, 2.2, "", "border:.16em solid var(--ink-3);border-radius:.55em;background:var(--paper)",
            box(.9, .45, .14, 1, "s3-caret", "background:var(--ink)")),
        box(13.4, 6.9, 3.2, 1.6, "s3-chip", "border-radius:.8em"),
        box(1.4, 9.8, 4, .5, "", "background:var(--ink-3);border-radius:.25em"),
        box(6, 9.8, 6, .5, "", "background:var(--ink-4);border-radius:.25em"),
    ])
    toast = box(0, 0, 10.5, 3.4, "s3-tw", "", "".join([
        box(.9, 1.25, .9, .9, "s3-dotc", "border-radius:50%"),
        box(2.5, .85, 7.4, 1.7, "", "overflow:hidden",
            box(0, 0, 7.4, 1.7 * 5, "s3-slot", "",
                "".join(txt(0, .45 + i * 1.7, s, "t", "color:var(--ink);font-size:.86em") for i, s in enumerate(states)))),
    ]))
    retry = (X1 + CX + .4, Y1 + 14.15 + .3)
    r0, r1 = (X1 + 20, Y1 + 6.5), (X1 + 19.5, Y1 + 15.5)
    scene = (
        floor(X0, Y0, 18, 12)
        + plate(X0, Y0, 18, 12, 0, ds, d=0)
        + plate(X1, Y1, 22, 17, Z1, panel, d=120)
        + plate(XT, YT, 10.5, 3.4, ZT, toast, cls="s3-toast", d=240, r=1)
        + cursor("s3-cur", Z1 + LIFT)
    )
    vin = {"opacity": 1, "transform": "translateY(0)"}
    vup = {"opacity": 0, "transform": "translateY(-.6em)"}
    vdn = {"opacity": 0, "transform": "translateY(.6em)"}
    seg = lambda name, a, b: kf(name, [(0, vdn, None), (a, vdn, ER), (a + 3.5, vin, None), (b, vin, ER), (b + 3.5, vup, None), (100, vup, None)])
    changes = [22, 47, 72, 96]
    pop = [(0, {"transform": "scale(1)"}, None)]
    for c in changes:
        pop += [(c, {"transform": "scale(1)"}, ER), (c + 1.5, {"transform": "scale(.9)"}, EH), (min(c + 5, 100), {"transform": "scale(1)"}, None)]
    # O último toque já termina em 100%: repetir a parada vira seletor duplicado no keyframe.
    if pop[-1][0] < 100:
        pop.append((100, {"transform": "scale(1)"}, None))
    vars_, ratio = fit()
    css = "\n".join([
        f".ar-product{{--T:{T}s;{vars_}}}",
        scoped("product", 3),
        ".ar-product .s3-c0,.ar-product .s3-c1,.ar-product .s3-c2,.ar-product .s3-gwrap{opacity:0}",
        ".ar-product .s3-tg{background:var(--azul)}.ar-product .s3-knob{transform:translateX(1.6em)}.ar-product .s3-cb{background:var(--ink)}",
        ".ar-product .s3-cbk path{stroke-dashoffset:0}.ar-product .s3-slot{transform:translateY(-5.1em)}.ar-product .s3-dotc{background:var(--lima)}",
        ".ar-product .s3-chip{background:var(--lima)}.ar-product .s3-row .ck path{stroke-dashoffset:0}",
        ".ar-product .s3-c0{animation-name:s3-c0}.ar-product .s3-c1{animation-name:s3-c1}.ar-product .s3-c2{animation-name:s3-c2}",
        ".ar-product .s3-shine{animation:s3-shine .9s linear infinite}",
        ".ar-product .s3-gwrap{animation-name:s3-gwrap}.ar-product .s3-giro .gm__turn{animation:s3-turn var(--T) linear infinite}",
        ".ar-product .s3-giro .gm__arc{animation:s3-arc var(--T) linear infinite}.ar-product .s3-giro .gm__track{animation:s3-track var(--T) linear infinite}",
        ".ar-product .s3-giro .gm__eyes{animation:s3-eyes var(--T) linear infinite}.ar-product .s3-giro .gm__sleep{animation:s3-sleep var(--T) linear infinite}",
        ".ar-product .s3-giro .gm__x{animation:s3-x var(--T) linear infinite}.ar-product .s3-giro{animation-name:s3-shake}",
        ".ar-product .s3-row0{animation-name:s3-r0}.ar-product .s3-row1{animation-name:s3-r1}.ar-product .s3-row2{animation-name:s3-r2}",
        ".ar-product .s3-badge{animation-name:s3-badge}.ar-product .s3-retry{animation-name:s3-retry}",
        ".ar-product .s3-tg{animation-name:s3-tg}.ar-product .s3-knob{animation-name:s3-knob}.ar-product .s3-chip{animation-name:s3-chip}",
        ".ar-product .s3-cb{animation-name:s3-cb}.ar-product .s3-cbk path{animation:s3-cbk var(--T) linear infinite}",
        ".ar-product .s3-caret{animation:s3-caret 1s steps(1) infinite}",
        ".ar-product .s3-slot{animation-name:s3-slot}.ar-product .s3-dotc{animation-name:s3-dotc}.ar-product .s3-tw{animation-name:s3-pop}",
        ".ar-product .s3-toast > .pl__b{animation:s3-float 2.4s var(--eio) infinite alternate}",
        ".ar-product .s3-cur{animation-name:s3-cur}.ar-product .s3-cur-p{animation-name:s3-press}.ar-product .s3-cur-z{animation:none}",
        kf("s3-c0", [(0, vin, None), (20, vin, ER), (23.5, vup, None), (96, vdn, ER), (99.5, vin, None), (100, vin, None)]),
        seg("s3-c1", 23, 46), seg("s3-c2", 48, 70),
        kf("s3-shine", [(0, {"transform": "translateX(0)"}, None), (100, {"transform": "translateX(9em)"}, None)]),
        kf("s3-gwrap", [(0, {"opacity": 1, "transform": "scale(1)"}, None), (70, {"opacity": 1, "transform": "scale(1)"}, ER),
                        (73, {"opacity": 0, "transform": "scale(.6)"}, None), (96, {"opacity": 0, "transform": "scale(.6)"}, EH),
                        (100, {"opacity": 1, "transform": "scale(1)"}, None)]),
        kf("s3-turn", [(0, {"transform": "rotate(-21.5deg)"}, None), (22, {"transform": "rotate(698.5deg)"}, None),
                       (100, {"transform": "rotate(698.5deg)"}, None)]),
        kf("s3-arc", [(0, {"stroke-dasharray": "70 207"}, None), (20, {"stroke-dasharray": "70 207"}, ER),
                      (24, {"stroke-dasharray": "240 37"}, None), (96, {"stroke-dasharray": "240 37"}, ER), (100, {"stroke-dasharray": "70 207"}, None)]),
        kf("s3-track", [(0, {"opacity": .2}, None), (20, {"opacity": .2}, ER), (24, {"opacity": 0}, None), (96, {"opacity": 0}, ER), (100, {"opacity": .2}, None)]),
        kf("s3-eyes", [(0, {"transform": "scaleY(1)", "opacity": 1}, None), (22, {"transform": "scaleY(1)", "opacity": 1}, ER),
                       (24, {"transform": "scaleY(.1)", "opacity": 0}, None), (96, {"transform": "scaleY(.1)", "opacity": 0}, EH),
                       (99, {"transform": "scaleY(1)", "opacity": 1}, None), (100, {"transform": "scaleY(1)", "opacity": 1}, None)]),
        kf("s3-sleep", [(0, {"opacity": 0}, None), (23, {"opacity": 0}, ER), (26, {"opacity": 1}, None), (46, {"opacity": 1}, ER), (48, {"opacity": 0}, None), (100, {"opacity": 0}, None)]),
        kf("s3-x", [(0, {"opacity": 0}, None), (48, {"opacity": 0}, ER), (50, {"opacity": 1}, None), (70, {"opacity": 1}, ER), (72, {"opacity": 0}, None), (100, {"opacity": 0}, None)]),
        kf("s3-shake", [(0, {"transform": "translateX(0)"}, None), (50, {"transform": "translateX(0)"}, None),
                        (51, {"transform": "translateX(-.6em)"}, None), (52, {"transform": "translateX(.5em)"}, None),
                        (53, {"transform": "translateX(-.35em)"}, None), (54, {"transform": "translateX(.18em)"}, ER),
                        (55.5, {"transform": "translateX(0)"}, None), (100, {"transform": "translateX(0)"}, None)]),
        *[kf(f"s3-r{i}", [(0, {"opacity": 0, "transform": "translateX(1.6em)"}, None), (73 + i * 2, {"opacity": 0, "transform": "translateX(1.6em)"}, ER),
                          (78 + i * 2, {"opacity": 1, "transform": "translateX(0)"}, None), (95, {"opacity": 1, "transform": "translateX(0)"}, ER),
                          (98, {"opacity": 0, "transform": "translateX(0)"}, None), (100, {"opacity": 0, "transform": "translateX(0)"}, None)])
          for i in range(3)],
        kf("s3-badge", [(0, {"transform": "scale(0)"}, None), (79, {"transform": "scale(0)"}, EH), (84, {"transform": "scale(1)"}, None),
                        (95, {"transform": "scale(1)"}, ER), (98, {"transform": "scale(0)"}, None), (100, {"transform": "scale(0)"}, None)]),
        kf("s3-retry", [(0, {"transform": "scale(1)"}, None), (68.5, {"transform": "scale(1)"}, ER), (69.8, {"transform": "scale(.9)"}, EH),
                        (73, {"transform": "scale(1)"}, None), (100, {"transform": "scale(1)"}, None)]),
        kf("s3-tg", [(0, {"background-color": "var(--ink-3)"}, None), (74, {"background-color": "var(--ink-3)"}, ER), (78, {"background-color": "var(--azul)"}, None),
                     (95, {"background-color": "var(--azul)"}, ER), (99, {"background-color": "var(--ink-3)"}, None), (100, {"background-color": "var(--ink-3)"}, None)]),
        kf("s3-knob", [(0, {"transform": "translateX(0)"}, None), (74, {"transform": "translateX(0)"}, EH), (78, {"transform": "translateX(1.6em)"}, None),
                       (95, {"transform": "translateX(1.6em)"}, ER), (99, {"transform": "translateX(0)"}, None), (100, {"transform": "translateX(0)"}, None)]),
        kf("s3-chip", [(0, {"background-color": "var(--ink-4)"}, None), (48, {"background-color": "var(--ink-4)"}, ER), (51, {"background-color": "#ff5c3d"}, None),
                       (71, {"background-color": "#ff5c3d"}, ER), (75, {"background-color": "var(--lima)"}, None), (95, {"background-color": "var(--lima)"}, ER),
                       (99, {"background-color": "var(--ink-4)"}, None), (100, {"background-color": "var(--ink-4)"}, None)]),
        kf("s3-cb", [(0, {"background-color": "transparent"}, None), (76, {"background-color": "transparent"}, ER), (79, {"background-color": "var(--ink)"}, None),
                     (95, {"background-color": "var(--ink)"}, ER), (99, {"background-color": "transparent"}, None), (100, {"background-color": "transparent"}, None)]),
        kf("s3-cbk", [(0, {"stroke-dashoffset": 1}, None), (77, {"stroke-dashoffset": 1}, ER), (81, {"stroke-dashoffset": 0}, None),
                      (95, {"stroke-dashoffset": 0}, ER), (98, {"stroke-dashoffset": 1}, None), (100, {"stroke-dashoffset": 1}, None)]),
        kf("s3-caret", [(0, {"opacity": 1}, None), (50, {"opacity": 0}, None), (100, {"opacity": 0}, None)]),
        kf("s3-slot", [(0, {"transform": "translateY(0)"}, None), (22, {"transform": "translateY(0)"}, ER), (25, {"transform": "translateY(-1.7em)"}, None),
                       (47, {"transform": "translateY(-1.7em)"}, ER), (50, {"transform": "translateY(-3.4em)"}, None),
                       (72, {"transform": "translateY(-3.4em)"}, ER), (75, {"transform": "translateY(-5.1em)"}, None),
                       (96, {"transform": "translateY(-5.1em)"}, ER), (99.5, {"transform": "translateY(-6.8em)"}, None), (100, {"transform": "translateY(-6.8em)"}, None)]),
        kf("s3-dotc", [(0, {"background-color": "var(--azul)"}, None), (22, {"background-color": "var(--azul)"}, ER), (25, {"background-color": "var(--ink-3)"}, None),
                       (47, {"background-color": "var(--ink-3)"}, ER), (50, {"background-color": "#ff5c3d"}, None), (72, {"background-color": "#ff5c3d"}, ER),
                       (75, {"background-color": "var(--lima)"}, None), (96, {"background-color": "var(--lima)"}, ER), (99.5, {"background-color": "var(--azul)"}, None),
                       (100, {"background-color": "var(--azul)"}, None)]),
        kf("s3-pop", pop),
        kf("s3-float", [(0, {"transform": "translateZ(0)"}, None), (100, {"transform": "translateZ(.7em)"}, None)]),
        kf("s3-cur", [(0, cat(*r0), None), (58, cat(*r0), EIO), (67, cat(*retry), None), (72, cat(*retry), EIO), (82, cat(*r1), None),
                      (90, cat(*r1), EIO), (99, cat(*r0), None), (100, cat(*r0), None)]),
        press("s3-press", [69]),
    ])
    beats = [(0, "Carregando"), (23, "Vazio"), (48, "Erro"), (69, "Tentar de novo"), (73, "Pronto")]
    return {"key": "product", "T": T, "css": css, "scene": scene, "beats": beats, "ratio": ratio}


# -------------------------------------------------------------------------------------------
# 04 · Full stack: o formulário envia, o POST desce pela API até o banco e o 201 sobe.
# -------------------------------------------------------------------------------------------
def art_fullstack():
    GEOM.clear()
    T = 6.4
    X, Y, W, H = -8.5, -7, 17, 14
    Z = [0, 6.5, 13]
    bx, by = 12.1, 12.3          # centro do botão (a pilha cai reta daqui)
    btn = (X + bx, Y + by)
    reach(btn[0], btn[1], Z[2] + 1.5)
    form = "".join([
        box(1.4, 1.4, 6, 1, "", "background:var(--ink);border-radius:.3em"),
        box(1.4, 3.5, 3.2, .45, "", "background:var(--ink-3);border-radius:.22em"),
        box(1.4, 4.3, 14.2, 2.2, "s4-in1", "border:.16em solid var(--ink-3);border-radius:.55em",
            box(.7, .78, 8, .5, "s4-f1", "background:var(--ink);border-radius:.25em;transform-origin:left")),
        box(1.4, 7.4, 4.2, .45, "", "background:var(--ink-3);border-radius:.22em"),
        box(1.4, 8.2, 14.2, 2.2, "s4-in2", "border:.16em solid var(--ink-3);border-radius:.55em",
            box(.7, .78, 10.5, .5, "s4-f2", "background:var(--ink);border-radius:.25em;transform-origin:left")),
        box(1.4, 11.5, 1.6, 1.6, "s4-cb", "border:.16em solid var(--ink);border-radius:.4em", check(.1, .1, 1.2, "s4-cbk", "var(--paper)")),
        box(3.6, 12.05, 3.6, .45, "", "background:var(--ink-3);border-radius:.22em"),
        box(bx - 3.5, by - 1.1, 7, 2.2, "s4-btn", "background:var(--azul);border-radius:1.1em",
            box(2, .85, 3, .5, "s4-lbl", "background:var(--paper);border-radius:.25em")
            + giro(2.75, .35, 1.5, "s4-spin", "var(--paper)")
            + check(2.7, .3, 1.6, "s4-ck")),
        box(bx - 3.7, by - 1.3, 7.4, 2.6, "ring s4-rp", "border-radius:1.3em"),
    ])
    api = "".join([
        txt(1.4, 1.3, "api"),
        txt(1.4, 2.6, "route.ts", "t", "color:var(--ink)"),
        *[box(1.4, 4 + i * 1, w, .4, "", "background:var(--ink-4);border-radius:.2em") for i, w in enumerate([5, 3.6, 4.4])],
        txt(1.4, 8.4, "POST /api/contato", "t", "color:var(--ink);font-size:.86em"),
        box(1.4, 10.3, 4, 1.8, "s4-201", "background:var(--lima);border-radius:.9em", txt(1, .5, "201", "t", "color:var(--ink)")),
        txt(5.9, 10.85, "38 ms", "s4-ms t"),
        giro(bx - 1.6, by - 1.6, 3.2, "s4-proc", "var(--azul)"),
    ])
    row = lambda y, cls="": box(1.4, y, 14.2, 2.2, f"s4-tr {cls}", "border-radius:.5em",
                                 box(.6, .85, 2, .5, "", "background:var(--ink-2);border-radius:.25em")
                                 + box(3.4, .85, 5.6, .5, "", "background:var(--ink);border-radius:.25em")
                                 + box(9.8, .85, 3.4, .5, "", "background:var(--ink-3);border-radius:.25em"))
    # Janela da tabela abaixo da faixa coberta pela API; as linhas sobem e a nova entra por baixo.
    table = box(0, 6.8, W, H - 6.8, "", "overflow:hidden",
                box(0, 0, W, 2.4 * 5, "s4-rows", "", "".join(row(i * 2.4) for i in range(3)) + row(3 * 2.4, "s4-new")))
    dbp = "".join([
        txt(1.4, 1.3, "banco · contatos"),
        box(1.4, 2.5, 4.4, 2.2, "", "overflow:hidden",
            box(0, 0, 4.4, 4.4, "s4-count", "", txt(0, .2, "128", "n", "font-size:1.7em") + txt(0, 2.4, "129", "n", "font-size:1.7em;color:var(--azul)"))),
        table,
    ])
    r0, r1 = (X + 9, Y + 2.5), (X + 4, Y + 11)
    tip = (btn[0] + .7, btn[1] + .3)
    scene = (
        floor(X, Y, W, H)
        + plate(X, Y, W, H, Z[0], dbp, d=0)
        + plate(X, Y, W, H, Z[1], api, d=120)
        + plate(X, Y, W, H, Z[2], form, d=240)
        + pill("s4-q", "POST", "var(--azul)", "var(--paper)", 3.8)
        + pill("s4-r", "201", "var(--lima)", "var(--ink)", 3.2)
        + cursor("s4-cur", Z[2] + LIFT)
    )
    zq = [Z[2] + 1, Z[1] + 1, Z[0] + 1]
    hide = {"opacity": 0, "transform": "scale(.5)"}
    show = {"opacity": 1, "transform": "scale(1)"}

    def focus(name, a, b):
        return kf(name, [(0, {"border-color": "var(--ink-3)"}, None), (a, {"border-color": "var(--ink-3)"}, ER), (a + 2, {"border-color": "var(--azul)"}, None),
                         (b, {"border-color": "var(--azul)"}, ER), (b + 2, {"border-color": "var(--ink-3)"}, None), (100, {"border-color": "var(--ink-3)"}, None)])

    vars_, ratio = fit()
    css = "\n".join([
        f".ar-fullstack{{--T:{T}s;{vars_}}}",
        scoped("fullstack", 4),
        ".ar-fullstack .s4-spin,.ar-fullstack .s4-proc{opacity:0}.ar-fullstack .s4-cb{background:var(--ink)}.ar-fullstack .s4-cbk path{stroke-dashoffset:0}",
        ".ar-fullstack .s4-f1{animation-name:s4-f1}.ar-fullstack .s4-f2{animation-name:s4-f2}",
        ".ar-fullstack .s4-in1{animation-name:s4-in1}.ar-fullstack .s4-in2{animation-name:s4-in2}",
        ".ar-fullstack .s4-cb{animation-name:s4-cb}.ar-fullstack .s4-cbk path{animation:s4-cbk var(--T) linear infinite}",
        ".ar-fullstack .s4-btn{animation-name:s4-btn}.ar-fullstack .s4-lbl{animation-name:s4-lbl}.ar-fullstack .s4-rp{animation-name:s4-rp}",
        ".ar-fullstack .s4-spin{animation-name:s4-spin}.ar-fullstack .s4-spin .gm__turn{animation:s4-turn var(--T) linear infinite}",
        ".ar-fullstack .s4-spin .gm__arc,.ar-fullstack .s4-proc .gm__arc{stroke-dasharray:70 207}",
        ".ar-fullstack .s4-spin .gm__track,.ar-fullstack .s4-proc .gm__track{opacity:.25}",
        ".ar-fullstack .s4-proc{animation-name:s4-proc}.ar-fullstack .s4-proc .gm__turn{animation:s4-turn2 var(--T) linear infinite}",
        ".ar-fullstack .s4-ck path{animation:s4-ck var(--T) linear infinite}",
        ".ar-fullstack .s4-201{animation-name:s4-201}.ar-fullstack .s4-ms{animation-name:s4-ms}.ar-fullstack .s4-rows{animation-name:s4-rows}",
        ".ar-fullstack .s4-new{animation-name:s4-new}.ar-fullstack .s4-count{animation-name:s4-count}",
        ".ar-fullstack .s4-q{animation-name:s4-qxy}.ar-fullstack .s4-q-z{animation-name:s4-qz}.ar-fullstack .s4-q-dot{animation-name:s4-qo}",
        ".ar-fullstack .s4-r-z{animation-name:s4-rz}.ar-fullstack .s4-r-dot{animation-name:s4-ro}",
        f".ar-fullstack .s4-r{{transform:translate({E(btn[0])},{E(btn[1])})}}",
        ".ar-fullstack .s4-cur{animation-name:s4-cur}.ar-fullstack .s4-cur-p{animation-name:s4-press}.ar-fullstack .s4-cur-z{animation:none}",
        kf("s4-f1", [(0, {"transform": "scaleX(0)"}, None), (4, {"transform": "scaleX(0)"}, "steps(6,end)"), (13, {"transform": "scaleX(1)"}, None),
                     (90, {"transform": "scaleX(1)"}, ER), (94, {"transform": "scaleX(0)"}, None), (100, {"transform": "scaleX(0)"}, None)]),
        kf("s4-f2", [(0, {"transform": "scaleX(0)"}, None), (14, {"transform": "scaleX(0)"}, "steps(8,end)"), (24, {"transform": "scaleX(1)"}, None),
                     (90, {"transform": "scaleX(1)"}, ER), (94, {"transform": "scaleX(0)"}, None), (100, {"transform": "scaleX(0)"}, None)]),
        focus("s4-in1", 3, 13), focus("s4-in2", 13.5, 24),
        kf("s4-cb", [(0, {"background-color": "transparent"}, None), (25, {"background-color": "transparent"}, ER), (27, {"background-color": "var(--ink)"}, None),
                     (90, {"background-color": "var(--ink)"}, ER), (94, {"background-color": "transparent"}, None), (100, {"background-color": "transparent"}, None)]),
        kf("s4-cbk", [(0, {"stroke-dashoffset": 1}, None), (25.5, {"stroke-dashoffset": 1}, ER), (28, {"stroke-dashoffset": 0}, None),
                      (90, {"stroke-dashoffset": 0}, ER), (93, {"stroke-dashoffset": 1}, None), (100, {"stroke-dashoffset": 1}, None)]),
        kf("s4-btn", [(0, {"transform": "scale(1)"}, None), (30, {"transform": "scale(1)"}, ER), (31.3, {"transform": "scale(.92)"}, EH),
                      (35, {"transform": "scale(1)"}, None), (100, {"transform": "scale(1)"}, None)]),
        ripple("s4-rp", 30.5, 6, .85, 1.2),
        kf("s4-lbl", [(0, show, None), (31, show, ER), (33, hide, None), (91, hide, ER), (95, show, None), (100, show, None)]),
        kf("s4-spin", [(0, hide, None), (32.5, hide, ER), (35, show, None), (75, show, ER), (77, hide, None), (100, hide, None)]),
        kf("s4-turn", [(0, {"transform": "rotate(-21.5deg)"}, None), (32, {"transform": "rotate(-21.5deg)"}, None),
                       (77, {"transform": "rotate(1778.5deg)"}, None), (100, {"transform": "rotate(1778.5deg)"}, None)]),
        kf("s4-turn2", [(0, {"transform": "rotate(-21.5deg)"}, None), (43, {"transform": "rotate(-21.5deg)"}, None),
                        (53, {"transform": "rotate(698.5deg)"}, None), (100, {"transform": "rotate(698.5deg)"}, None)]),
        kf("s4-proc", [(0, {"opacity": 0, "transform": "scale(.4)"}, None), (43, {"opacity": 0, "transform": "scale(.4)"}, EH),
                       (45, {"opacity": 1, "transform": "scale(1)"}, None), (51.5, {"opacity": 1, "transform": "scale(1)"}, ER),
                       (53.5, {"opacity": 0, "transform": "scale(.4)"}, None), (100, {"opacity": 0, "transform": "scale(.4)"}, None)]),
        kf("s4-ck", [(0, {"stroke-dashoffset": 1}, None), (77, {"stroke-dashoffset": 1}, ER), (81, {"stroke-dashoffset": 0}, None),
                     (90, {"stroke-dashoffset": 0}, ER), (93, {"stroke-dashoffset": 1}, None), (100, {"stroke-dashoffset": 1}, None)]),
        kf("s4-201", [(0, {"opacity": 0, "transform": "scale(.6)"}, None), (64, {"opacity": 0, "transform": "scale(.6)"}, EH),
                      (68, {"opacity": 1, "transform": "scale(1)"}, None), (90, {"opacity": 1, "transform": "scale(1)"}, ER),
                      (94, {"opacity": 0, "transform": "scale(.6)"}, None), (100, {"opacity": 0, "transform": "scale(.6)"}, None)]),
        kf("s4-ms", [(0, {"opacity": 0, "transform": "translateX(-.6em)"}, None), (67, {"opacity": 0, "transform": "translateX(-.6em)"}, ER),
                     (71, {"opacity": 1, "transform": "translateX(0)"}, None), (90, {"opacity": 1, "transform": "translateX(0)"}, ER),
                     (94, {"opacity": 0, "transform": "translateX(0)"}, None), (100, {"opacity": 0, "transform": "translateX(-.6em)"}, None)]),
        kf("s4-rows", [(0, {"transform": "translateY(0)"}, None), (58, {"transform": "translateY(0)"}, ER),
                       (64, {"transform": "translateY(-2.4em)"}, None), (100, {"transform": "translateY(-2.4em)"}, None)]),
        kf("s4-new", [(0, {"opacity": 0, "background-color": "var(--lima)"}, None), (58, {"opacity": 0, "background-color": "var(--lima)"}, ER),
                      (63, {"opacity": 1, "background-color": "var(--lima)"}, None), (84, {"opacity": 1, "background-color": "var(--lima)"}, ER),
                      (97, {"opacity": 1, "background-color": "rgba(210,255,77,0)"}, None), (100, {"opacity": 1, "background-color": "rgba(210,255,77,0)"}, None)]),
        kf("s4-count", [(0, {"transform": "translateY(0)"}, None), (59, {"transform": "translateY(0)"}, EH), (64, {"transform": "translateY(-2.2em)"}, None),
                        (99.9, {"transform": "translateY(-2.2em)"}, None), (100, {"transform": "translateY(0)"}, None)]),
        kf("s4-qxy", [(0, at(*btn), None), (100, at(*btn), None)]),
        kf("s4-qz", [(0, {"transform": f"translateZ({E(zq[0])})"}, None), (33, {"transform": f"translateZ({E(zq[0])})"}, EIO),
                     (42, {"transform": f"translateZ({E(zq[1])})"}, None), (51, {"transform": f"translateZ({E(zq[1])})"}, EIO),
                     (58, {"transform": f"translateZ({E(zq[2])})"}, None), (100, {"transform": f"translateZ({E(zq[2])})"}, None)]),
        kf("s4-qo", [(0, {"opacity": 0, "transform": "scale(.3)"}, None), (32.5, {"opacity": 0, "transform": "scale(.3)"}, EH),
                     (34.5, {"opacity": 1, "transform": "scale(1)"}, None), (42, {"opacity": 1, "transform": "scale(1)"}, ER),
                     (44, {"opacity": 0, "transform": "scale(.3)"}, None), (51, {"opacity": 0, "transform": "scale(.3)"}, EH),
                     (52.5, {"opacity": 1, "transform": "scale(1)"}, None), (58, {"opacity": 1, "transform": "scale(1)"}, ER),
                     (60, {"opacity": 0, "transform": "scale(.3)"}, None), (100, {"opacity": 0, "transform": "scale(.3)"}, None)]),
        kf("s4-rz", [(0, {"transform": f"translateZ({E(zq[2])})"}, None), (61, {"transform": f"translateZ({E(zq[2])})"}, EIO),
                     (75, {"transform": f"translateZ({E(zq[0])})"}, None), (100, {"transform": f"translateZ({E(zq[0])})"}, None)]),
        kf("s4-ro", [(0, {"opacity": 0, "transform": "scale(.3)"}, None), (60.5, {"opacity": 0, "transform": "scale(.3)"}, EH),
                     (62.5, {"opacity": 1, "transform": "scale(1)"}, None), (74.5, {"opacity": 1, "transform": "scale(1)"}, ER),
                     (77, {"opacity": 0, "transform": "scale(.3)"}, None), (100, {"opacity": 0, "transform": "scale(.3)"}, None)]),
        kf("s4-cur", [(0, cat(*r0), None), (18, cat(*r0), EIO), (24, cat(r0[0] - 6, r0[1] + 9.6), None), (26, cat(r0[0] - 6, r0[1] + 9.6), EIO),
                      (29.5, cat(*tip), None), (34, cat(*tip), EIO), (44, cat(*r1), None), (88, cat(*r1), EIO), (98, cat(*r0), None), (100, cat(*r0), None)]),
        press("s4-press", [25.5, 30.5]),
    ])
    beats = [(4, "Preenche"), (25, "Aceita e envia"), (43, "A API processa"), (58, "Grava no banco"), (61, "201 sobe"), (77, "Enviado")]
    return {"key": "fullstack", "T": T, "css": css, "scene": scene, "beats": beats, "ratio": ratio}


# -------------------------------------------------------------------------------------------
# 05 · Branding: o cursor escolhe um token, ele sobe e pinta o componente.
# -------------------------------------------------------------------------------------------
def art_branding():
    GEOM.clear()
    T = 7.8
    XM, YM, ZM = -19, -11, 0         # marca
    XK, YK, ZK = -4, -2, 0           # tokens
    XC, YC, ZC = -12.3, -6.1, 12     # componente
    WC, HC = 15, 10.5
    sw = [("papel", "var(--paper)", "border:.16em solid var(--ink-3)"), ("azul", "var(--azul)", ""),
          ("lima", "var(--lima)", ""), ("tinta", "var(--tinta)", "")]
    swx = lambda i: 1.2 + i * 3.1
    land = (XC + 11.6, YC + 2.6)
    reach(land[0], land[1], ZC + 4)
    S = [(1, 1), (34.3, 3), (67.6, 0)]   # (início do passo em %, swatch)

    def card(bg, fg, soft, btn, btn_fg, mark, cls):
        inner = "".join([
            box(1.4, 1.5, 6.4, 1.3, "", f"background:{fg};border-radius:.35em"),
            box(1.4, 3.5, 4.4, 1.3, "", f"background:{fg};border-radius:.35em"),
            box(1.4, 5.6, 8.6, .5, "", f"background:{soft};border-radius:.25em"),
            box(1.4, 6.6, 6.2, .5, "", f"background:{soft};border-radius:.25em"),
            box(1.4, 8, 5.8, 1.7, "s5-btn", f"background:{btn};border-radius:.85em",
                box(1.6, .6, 2.6, .5, "", f"background:{btn_fg};border-radius:.25em")),
            box(8, 8.2, 1.3, 1.3, "", f"background:{soft};border-radius:50%"),
            box(10, 1.2, 3.4, 3.4, "s5-mk", f"border:.55em solid {mark};border-radius:50%;border-right-color:transparent"),
        ])
        return box(0, 0, WC, HC, cls, f"background:{bg}", inner)

    comp = "".join([
        card("var(--paper)", "var(--ink)", "var(--ink-3)", "var(--azul)", "var(--paper)", "var(--azul)", "s5-base"),
        card("var(--azul)", "var(--paper)", "rgba(246,245,240,.45)", "var(--lima)", "var(--ink)", "var(--lima)", "s5-ov s5-ov1"),
        card("var(--tinta)", "var(--paper)", "rgba(246,245,240,.35)", "var(--lima)", "var(--ink)", "var(--paper)", "s5-ov s5-ov2"),
        card("var(--paper)", "var(--ink)", "var(--ink-3)", "var(--azul)", "var(--paper)", "var(--azul)", "s5-ov s5-ov3"),
    ])
    names = ["papel", "azul-sinal", "tinta", "papel"]
    hexes = ["#f6f5f0", "#2b2eff", "#0b0c1f", "#f6f5f0"]
    tokens = "".join([
        *[box(swx(i), 1.4, 2.6, 2.6, "", f"background:{c};border-radius:50%;{extra}") for i, (_, c, extra) in enumerate(sw)],
        box(swx(0) - .42, .98, 3.44, 3.44, "s5-sel", "border:.22em solid var(--ink);border-radius:50%"),
        box(1.4, 5.3, 7.8, 1.4, "", "overflow:hidden",
            box(0, 0, 9, 1.4 * 4, "s5-slot", "", "".join(txt(0, .3 + i * 1.4, f"--{n}", "t", "color:var(--ink)") for i, n in enumerate(names)))),
        box(1.4, 6.9, 9, 1.4, "", "overflow:hidden",
            box(0, 0, 9, 1.4 * 4, "s5-slot2", "", "".join(txt(0, .3 + i * 1.4, h, "t") for i, h in enumerate(hexes)))),
        txt(9.2, 5.5, "Aa", "s5-aa"),
    ])
    grid = "".join(box(1.5 + i * 2, 1.5, .08, 10, "", "background:var(--ink-4)") for i in range(6)) + \
        "".join(box(1.5, 1.5 + i * 2, 10, .08, "", "background:var(--ink-4)") for i in range(6))
    mark = "".join([
        grid,
        box(1, 1, 11, 11, "", "border:.08em dashed var(--ink-3);border-radius:50%"),
        giro(1.5, 1.5, 10, "s5-giro", "var(--azul)"),
    ])
    sw_at = lambda i: (XK + swx(i) + 1.3, YK + 2.7)
    rest = (XK + 12.4, YK + 8.6)
    scene = (
        floor(XM, YM, 13, 13)
        + floor(XK, YK, 14, 9.6)
        + plate(XM, YM, 13, 13, ZM, mark, d=0)
        + plate(XK, YK, 14, 9.6, ZK, tokens, d=120)
        + plate(XC, YC, WC, HC, ZC, comp, cls="s5-comp", d=240)
        + dot("s5-d", "var(--azul)", 1.3)
        + cursor("s5-cur", ZK + LIFT)
    )

    def stepped(prop, vals, off, dur, ease, fmt):
        stops = [(0, {prop: fmt(vals[0])}, None)]
        for (s, _), v0, v1 in zip(S, vals, vals[1:]):
            stops += [(s + off, {prop: fmt(v0)}, ease), (s + off + dur, {prop: fmt(v1)}, None)]
        stops.append((100, {prop: fmt(vals[-1])}, None))
        return stops

    sel = stepped("transform", [0, 1, 3, 0], 7.5, 4, EH, lambda i: f"translateX({E(swx(i) - swx(0))})")
    slot = stepped("transform", [0, 1, 2, 3], 8.5, 4, ER, lambda n: f"translateY({E(-1.4 * n)})")
    slot = slot[:-1] + [(99.9, {"transform": "translateY(-4.2em)"}, None), (100, {"transform": "translateY(0)"}, None)]
    turn = stepped("transform", [0, 1, 2, 3], 8.5, 6, EH, lambda n: f"rotate({-21.5 + 120 * n}deg)")
    aa = stepped("font-variation-settings", [100, 150, 50, 100], 8.5, 6, EH, lambda w: f'"wdth" {w}')
    blink = [(0, {"transform": "scaleY(1)"}, None)]
    for s, _ in S:
        blink += [(s + 9, {"transform": "scaleY(1)"}, ER), (s + 10.2, {"transform": "scaleY(.1)"}, ER), (s + 12, {"transform": "scaleY(1)"}, None)]
    blink.append((100, {"transform": "scaleY(1)"}, None))
    cur = [(0, cat(*rest), None)]
    for s, i in S:
        tip = (sw_at(i)[0] + .4, sw_at(i)[1] + .5)
        cur += [(s, cat(*rest), EIO), (s + 6, cat(*tip), None), (s + 9.5, cat(*tip), EIO), (s + 17, cat(*rest), None)]
    cur.append((100, cat(*rest), None))
    dxy, dz, dop = [], [], []
    for s, i in S:
        src = sw_at(i)
        dxy += [(s + 10, at(*src), ER), (s + 19, at(*land), None)]
        dz += [(s + 10, {"transform": f"translateZ({E(ZK + .7)})"}, EOUT), (s + 15, {"transform": f"translateZ({E(ZC + 4)})"}, EIN),
               (s + 19, {"transform": f"translateZ({E(ZC + .7)})"}, None)]
        dop += [(s + 10, {"opacity": 0, "transform": "scale(.3)"}, EH), (s + 11.5, {"opacity": 1, "transform": "scale(1)"}, None),
                (s + 18.5, {"opacity": 1, "transform": "scale(1)"}, ER), (s + 20, {"opacity": 0, "transform": "scale(.2)"}, None)]
    dxy = [(0, dxy[0][1], None)] + dxy + [(100, dxy[-1][1], None)]
    dz = [(0, dz[0][1], None)] + dz + [(100, dz[-1][1], None)]
    dop = [(0, {"opacity": 0, "transform": "scale(.3)"}, None)] + dop + [(100, {"opacity": 0, "transform": "scale(.2)"}, None)]
    lx, ly = land[0] - XC, land[1] - YC
    clip0, clip1 = f"circle(0em at {E(lx)} {E(ly)})", f"circle(19em at {E(lx)} {E(ly)})"
    ovs = [kf(f"s5-ov{n}", [(0, {"clip-path": clip0}, None), (s + 19, {"clip-path": clip0}, ER), (s + 27, {"clip-path": clip1}, None),
                            (99.9, {"clip-path": clip1}, None), (100, {"clip-path": clip0}, None)])
           for n, (s, _) in enumerate(S, 1)]
    bump = [(0, {"transform": "scale(1)"}, None)]
    for s, _ in S:
        bump += [(s + 25, {"transform": "scale(1)"}, ER), (s + 27, {"transform": "scale(.88)"}, EH), (s + 31, {"transform": "scale(1)"}, None)]
    bump.append((100, {"transform": "scale(1)"}, None))
    spin = stepped("transform", [0, 1, 2, 3], 24, 7, EH, lambda n: f"rotate({120 * n}deg)")
    vars_, ratio = fit()
    css = "\n".join([
        f".ar-branding{{--T:{T}s;{vars_}}}",
        scoped("branding", 5),
        ".ar-branding .s5-sel{animation-name:s5-sel}.ar-branding .s5-slot{animation-name:s5-slot}.ar-branding .s5-slot2{animation-name:s5-slot}",
        ".ar-branding .s5-giro .gm__turn{animation:s5-turn var(--T) linear infinite}.ar-branding .s5-giro .gm__eyes{animation:s5-blink var(--T) linear infinite}",
        ".ar-branding .s5-aa{font:800 2.1em/1 Anybody,sans-serif;color:var(--ink);letter-spacing:-.02em;animation-name:s5-aa}",
        ".ar-branding .s5-ov{clip-path:circle(0em at 50% 50%)}",
        ".ar-branding .s5-ov1{animation-name:s5-ov1}.ar-branding .s5-ov2{animation-name:s5-ov2}.ar-branding .s5-ov3{animation-name:s5-ov3}",
        ".ar-branding .s5-btn{transform-origin:left center;animation-name:s5-bump}.ar-branding .s5-mk{animation-name:s5-spin}",
        ".ar-branding .s5-d{animation-name:s5-dxy}.ar-branding .s5-d-z{animation-name:s5-dz}.ar-branding .s5-d-dot{animation-name:s5-dop}",
        ".ar-branding .s5-comp > .pl__b{animation:s5-float 2.6s var(--eio) infinite alternate}",
        ".ar-branding .s5-cur{animation-name:s5-cur}.ar-branding .s5-cur-p{animation-name:s5-press}.ar-branding .s5-cur-z{animation:none}",
        kf("s5-sel", sel), kf("s5-slot", slot), kf("s5-turn", turn), kf("s5-aa", aa), kf("s5-blink", blink),
        kf("s5-dxy", dxy), kf("s5-dz", dz), kf("s5-dop", dop), *ovs, kf("s5-bump", bump), kf("s5-spin", spin),
        kf("s5-cur", cur), press("s5-press", [s + 7 for s, _ in S]),
        kf("s5-float", [(0, {"transform": "translateZ(0)"}, None), (100, {"transform": "translateZ(.6em)"}, None)]),
    ])
    beats = [(1, "Escolhe o azul"), (20, "O token pinta"), (34, "Escolhe tinta"), (67, "Volta ao papel")]
    return {"key": "branding", "T": T, "css": css, "scene": scene, "beats": beats, "ratio": ratio}


def build_all():
    return [art_sites(), art_landing(), art_product(), art_fullstack(), art_branding()]


def art_html(a, extra_cls=""):
    return f'<span class="ar ar-{a["key"]} {extra_cls}"><span class="ar__scene">{a["scene"]}</span></span>'


def all_css(arts):
    return BASE_CSS + "\n".join(a["css"] for a in arts)
