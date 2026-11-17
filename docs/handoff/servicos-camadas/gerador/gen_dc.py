"""Gera as pranchas da rodada 2 de serviços para o canvas (formato .dc.html)."""
import json
import sys

import arts

OUT = sys.argv[1]
A = arts.build_all()
KEYS = [a["key"] for a in A]
T = {a["key"]: a["T"] for a in A}

SERVICES = [
    ("Sites completos",
     "Do mapa do site à publicação: estrutura, conteúdo, SEO e um painel para editar sem depender de mim.",
     ["Astro", "SEO", "CMS"]),
    ("Landing pages",
     "Uma página, um objetivo. Carrega rápido, mede cada clique e é fácil de testar.",
     ["Conversão", "Analytics", "Web Vitals"]),
    ("Interfaces de produto",
     "Telas com todos os estados: carregando, vazio, erro e o momento em que tudo funciona.",
     ["React", "Design system", "Acessibilidade"]),
    ("Full stack",
     "O front-end com o back-end que ele precisa: formulários, APIs e banco.",
     ["Next.js", "APIs", "Banco"]),
    ("Branding",
     "Identidade que vira código: tokens, componentes e movimento.",
     ["Identidade", "Tokens", "Motion"]),
]


def safe_css(css):
    # O template só abre buracos com chaves duplas; separo as que fecham para não haver dúvida.
    out = css.replace("}}", "}\n}")
    assert "{{" not in out
    return out


ART_CSS = safe_css(arts.all_css(A))

HEAD = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
<link rel="stylesheet" href="ds/giro/tokens.css">
<link rel="stylesheet" href="ds/giro/components/bundle.css">
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anybody:ital,wdth,wght@0,50..150,100..900;1,50..150,100..900&amp;family=Geist+Mono:wght@400;500&amp;display=swap">
<style>
body{{margin:0}}
{css}
</style>
</helmet>
"""

COMMON_CSS = """
.sv-page{width:100%;font-family:var(--font-sans);}
.sv-ctx{box-sizing:border-box;padding:40px 64px;}
.hm-sec{position:relative;}
.hm-in{box-sizing:border-box;max-width:1440px;margin:0 auto;padding:0 64px;}
.hm-pad{padding-top:144px;padding-bottom:144px;display:flex;flex-direction:column;gap:64px;}
.hm-sec .g-section-head__title{font-size:136px;line-height:0.86;letter-spacing:-0.04em;font-variation-settings:"wdth" 50;transition:font-variation-settings 1200ms var(--ease-hop);}
.hm-sec.is-in .g-section-head__title{font-variation-settings:"wdth" 115;}
.hm-rise{opacity:0;translate:0 28px;transition:opacity 500ms linear var(--d, 0ms), translate 800ms var(--ease-resolve) var(--d, 0ms);}
.is-in .hm-rise{opacity:1;translate:0 0;}
.sv-head{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;flex-wrap:wrap;}
.sv-tags{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none;}
.sv-tags li{padding:5px 12px;border:1px solid var(--s-line-strong);border-radius:var(--radius-pill);font:var(--text-micro);}
.sv-host{display:block;width:100%;container-type:inline-size;}
.g-reduced .hm-sec .g-section-head__title{font-variation-settings:"wdth" 115;transition:none;}
.g-reduced .hm-rise{opacity:1;translate:0 0;transition:none;}
.g-reduced .ar .pl,.g-reduced .ar .pl__e,.g-reduced .ar .pl__face,.g-reduced .ar .fl{transition:none;}
@media (prefers-reduced-motion: reduce){
  .hm-sec .g-section-head__title{font-variation-settings:"wdth" 115;transition:none;}
  .hm-rise{opacity:1;translate:0 0;transition:none;}
  .ar *{animation:none !important;}
  .ar .pl,.ar .pl__e,.ar .pl__face,.ar .fl{transition:none;}
}
@media (max-width: 767px){
  .sv-ctx{padding:32px 16px;}
  .hm-in{padding:0 16px;}
  .hm-pad{padding-top:88px;padding-bottom:88px;gap:40px;}
  .hm-sec .g-section-head__title{font-size:58px;}
}
"""

GRID_CSS = """
.sv-grid{display:grid;grid-template-columns:repeat(6, minmax(0, 1fr));gap:24px;margin:0;padding:0;list-style:none;}
.sv-card{grid-column:span 2;display:flex;flex-direction:column;overflow:hidden;border-radius:30px;background:#edece8;color:var(--s-fg);box-shadow:inset 0 0 0 1px var(--s-line);transition:opacity 500ms linear var(--d, 0ms), translate 800ms var(--ease-resolve) var(--d, 0ms);}
.sv-card:nth-child(-n+2){grid-column:span 3;}
.sv-card:hover{translate:0 calc(-1 * var(--lift-card));}
.is-in .sv-card:hover{translate:0 calc(-1 * var(--lift-card));transition-delay:0ms;}
.sv-card__art{display:flex;align-items:center;justify-content:center;height:300px;overflow:hidden;}
.sv-card:nth-child(-n+2) .sv-card__art{height:360px;}
/* O palco de cada arte é justo em volta dela (--ratio = largura / altura); a arte ocupa a área inteira. */
.sv-card__art .sv-host{width:min(100% - 24px, calc(276px * var(--ratio)));}
.sv-card:nth-child(-n+2) .sv-card__art .sv-host{width:min(100% - 24px, calc(336px * var(--ratio)));}
.sv-card__body{display:flex;flex-direction:column;gap:12px;padding:8px 32px 32px;}
.sv-card__n{font:var(--text-rotulo);color:var(--s-muted);}
.sv-card h3{margin:0;font-size:26px;line-height:1.15;font-weight:800;font-stretch:110%;letter-spacing:-0.015em;}
.sv-card p{margin:0;max-width:46ch;font-size:17px;line-height:1.6;font-weight:450;color:var(--s-muted);}
.g-reduced .sv-card{transition:none;}
@media (max-width: 1023px){
  .sv-grid{grid-template-columns:repeat(2, minmax(0, 1fr));}
  .sv-card, .sv-card:nth-child(-n+2){grid-column:span 1;}
  .sv-card:last-child{grid-column:span 2;}
}
@media (max-width: 767px){
  .sv-grid{grid-template-columns:minmax(0, 1fr);gap:16px;}
  .sv-card:last-child{grid-column:span 1;}
  .sv-card{justify-content:center;min-height:calc(100vh - 32px);}
  .sv-card__art, .sv-card:nth-child(-n+2) .sv-card__art{height:auto;padding:16px 0 0;}
  .sv-card__art .sv-host, .sv-card:nth-child(-n+2) .sv-card__art .sv-host{width:100%;}
  .sv-card__body{gap:14px;padding:8px 24px 28px;}
  .sv-card h3{font-size:34px;}
  .sv-card p{font-size:18px;}
}
"""

# A entrada (placas subindo) e o "rodar de novo" mexem em todas as artes de uma vez.
SECTION_JS = """class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { inn: false, pre: true };
    this.root = null;
    this.setRoot = (el) => { this.root = el; };
  }
  componentDidMount() { this.rodar(); }
  componentWillUnmount() { clearTimeout(this.t1); }
  componentDidUpdate(prev) { if (prev.movimentoReduzido !== this.props.movimentoReduzido) this.rodar(); }
  reduzido() {
    return !!this.props.movimentoReduzido || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  rodar() {
    clearTimeout(this.t1);
    if (this.reduzido()) { this.setState({ inn: true, pre: false }); return; }
    this.setState({ inn: false, pre: true });
    // O loop recomeça junto com a entrada: as placas sobem já com a interface no primeiro quadro.
    if (this.root) this.root.querySelectorAll('.ar').forEach((ar) => {
      ar.getAnimations({ subtree: true }).forEach((a) => { if (a instanceof CSSAnimation) a.currentTime = 0; });
    });
    this.t1 = setTimeout(() => this.setState({ inn: true, pre: false }), 80);
  }
  renderVals() {
    const still = !!this.props.movimentoReduzido;
    return {
      setRoot: this.setRoot,
      rootClass: still ? 'g-reduced' : '',
      inClass: this.state.inn ? 'is-in' : '',
      arClass: still ? 'is-still' : (this.state.pre ? 'is-pre' : ''),
      rodar: () => this.rodar(),
    };
  }
}
"""


def tags(ts):
    return '<ul class="sv-tags">' + "".join(f"<li>{t}</li>" for t in ts) + "</ul>"


def art(a, i):
    return (f'<span class="sv-host" style="--cd: {i * 160}ms; --ratio: {a["ratio"]};">'
            f'<span class="ar ar-{a["key"]} {{{{arClass}}}}" aria-hidden="true"><span class="ar__scene">{a["scene"]}</span></span></span>')


def head_block(tid, lead, button=True):
    btn = ('      <button type="button" class="g-button g-button--secondary g-button--sm hm-rise" style="--d: 240ms;" '
           'onClick="{{rodar}}">Rodar de novo</button>\n') if button else ""
    return f"""    <div class="sv-head">
      <div class="g-section-head">
        <div class="g-section-head__text">
          <p class="g-eyebrow hm-rise">// serviços</p>
          <h2 class="g-section-head__title" id="{tid}">O que eu faço.</h2>
          <p class="g-section-head__lead hm-rise" style="--d: 160ms;">{lead}</p>
        </div>
      </div>
{btn}    </div>
"""


def cards():
    out = []
    for i, (a, (title, text, ts)) in enumerate(zip(A, SERVICES)):
        azul = " g-azul" if i == 0 else ""
        style = "background:var(--azul-sinal);" if i == 0 else ""
        out.append(f"""        <li class="sv-card hm-rise{azul}" style="--d: {200 + i * 90}ms;{style}">
          <div class="sv-card__art">{art(a, i)}</div>
          <div class="sv-card__body">
            <span class="sv-card__n">{i + 1:02d}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            {tags(ts)}
          </div>
        </li>
""")
    return "".join(out)


def build_section(mobile=False):
    title = "Serviços · celular" if mobile else "Serviços · seção"
    tid = "sv2-titulo-m" if mobile else "sv2-titulo"
    props = {"movimentoReduzido": {"editor": "boolean", "default": False},
             "$preview": {"width": 390, "height": 844} if mobile else {"width": 1440, "height": 2100}}
    scroll = ' style="height:100vh;overflow-y:auto;"' if mobile else ""
    return (HEAD.format(title=title, css=COMMON_CSS + GRID_CSS + ART_CSS)
            + f"""<div class="g-papel sv-page {{{{rootClass}}}}" ref="{{{{setRoot}}}}"{scroll}>
  <div class="g-azul sv-ctx"><span class="g-eyebrow">// fim da hero</span></div>
  <section class="g-papel hm-sec {{{{inClass}}}}" aria-labelledby="{tid}">
    <div class="hm-in hm-pad">
{head_block(tid, "Cinco jeitos de trabalharmos juntos, do site institucional à identidade que vira código.")}      <ul class="sv-grid">
{cards()}      </ul>
    </div>
  </section>
  <div class="g-papel sv-ctx" style="border-top: 1px solid var(--s-line);"><span class="g-eyebrow">// projetos</span></div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{json.dumps(props, ensure_ascii=False)}'>
{SECTION_JS}</script>
</body>
</html>
""")


# ---------- laboratório ----------
LAB_CSS = """
.sv-host{display:block;width:100%;container-type:inline-size;}
.lb{font-family:var(--font-sans);box-sizing:border-box;min-height:100vh;padding:56px 64px;display:grid;grid-template-columns:minmax(0, 4fr) minmax(0, 9fr);gap:48px;align-items:start;}
.lb__side{display:flex;flex-direction:column;gap:28px;}
.lb__title{margin:0;font-size:64px;line-height:.9;font-weight:900;letter-spacing:-.03em;font-variation-settings:"wdth" 115;}
.lb__lead{margin:0;max-width:34ch;font:var(--text-corpo);color:var(--s-muted);}
.lb__list{margin:0;padding:0;list-style:none;border-bottom:1px solid var(--s-line);}
.lb__list li{border-top:1px solid var(--s-line);}
.lb__pick{all:unset;box-sizing:border-box;display:flex;align-items:baseline;gap:14px;width:100%;min-height:44px;padding:14px 0;cursor:pointer;}
.lb__pick:focus-visible{outline:var(--focus-width) solid var(--s-focus);outline-offset:var(--focus-offset);border-radius:var(--radius-sm);}
.lb__n{font:var(--text-rotulo);color:var(--s-muted);}
.lb__t{font-size:28px;line-height:1;font-weight:800;letter-spacing:-.02em;color:var(--s-muted);font-variation-settings:"wdth" 70;transition:font-variation-settings 600ms var(--ease-hop), color var(--dur-resolve) var(--ease-resolve);}
.lb__pick[aria-pressed="true"] .lb__n{color:var(--s-signal);}
.lb__pick[aria-pressed="true"] .lb__t{color:var(--s-fg);font-variation-settings:"wdth" 120;}
.lb__note{margin:0;font:var(--text-micro);color:var(--s-muted);max-width:40ch;}
.lb__main{display:flex;flex-direction:column;gap:20px;}
.lb__stage{position:relative;border-radius:32px;overflow:hidden;background:#edece8;box-shadow:inset 0 0 0 1px var(--s-line);}
.lb__stage.is-azul{background:var(--azul-sinal);}
.lb__art{display:none;padding:24px;}
.lb__art .sv-host{width:min(100%, calc(560px * var(--ratio)));margin:0 auto;}
.lb__art.is-on{display:block;}
.lb__bar{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.lb__speeds{display:flex;gap:6px;}
.lb__speed{all:unset;box-sizing:border-box;min-width:52px;min-height:36px;padding:0 12px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--s-line-strong);border-radius:var(--radius-pill);font:var(--text-rotulo);cursor:pointer;}
.lb__speed[aria-pressed="true"]{background:var(--s-fg);color:var(--s-bg);border-color:var(--s-fg);}
.lb__speed:focus-visible{outline:var(--focus-width) solid var(--s-focus);outline-offset:var(--focus-offset);}
.lb__clock{margin-left:auto;font:var(--text-rotulo);color:var(--s-muted);font-variant-numeric:tabular-nums;}
.lb__line{position:relative;height:72px;cursor:pointer;}
.lb__track{position:absolute;left:0;right:0;top:14px;height:4px;border-radius:2px;background:var(--s-line);}
.lb__head{position:absolute;left:0;top:6px;width:2px;height:20px;margin-left:-1px;border-radius:1px;background:var(--s-signal);}
.lb__fill{position:absolute;left:0;top:14px;height:4px;width:100%;border-radius:2px;background:var(--s-signal);transform-origin:left;transform:scaleX(0);}
.lb__beat{position:absolute;top:10px;display:flex;flex-direction:column;align-items:flex-start;gap:12px;transform:translateX(-5px);}
.lb__beat i{display:block;width:10px;height:10px;border-radius:50%;background:var(--s-bg);box-shadow:inset 0 0 0 2px var(--s-fg);}
.lb__beat span{font:var(--text-micro);color:var(--s-muted);white-space:nowrap;}
@media (max-width: 1023px){ .lb{grid-template-columns:minmax(0, 1fr);padding:32px 16px;} }
"""

LAB_JS = """class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { sel: 0, playing: true, rate: 1 };
    this.hosts = {};
    this.refs_ = {};
    KEYS.forEach((k) => { this.refs_[k] = (el) => { this.hosts[k] = el; }; });
    this.setFill = (el) => { this.fill = el; };
    this.setHead = (el) => { this.head = el; };
    this.setClock = (el) => { this.clock = el; };
    this.setLine = (el) => { this.line = el; };
  }
  componentDidMount() { this.aplica(); this.tick(); }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }
  componentDidUpdate() { this.aplica(); }
  anims(k) {
    const el = this.hosts[k];
    return el ? el.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation) : [];
  }
  // Só a arte escolhida anda; as outras ficam paradas no zero.
  aplica() {
    KEYS.forEach((k, i) => {
      this.anims(k).forEach((a) => {
        a.playbackRate = this.state.rate;
        if (i === this.state.sel && this.state.playing) a.play(); else a.pause();
      });
    });
  }
  tempo() {
    const k = KEYS[this.state.sel];
    const a = this.anims(k).find((x) => x.animationName && x.animationName.indexOf('float') < 0);
    const T = TS[k] * 1000;
    return a && a.currentTime != null ? (a.currentTime % T) / T : 0;
  }
  tick() {
    const f = this.tempo();
    if (this.fill) this.fill.style.transform = 'scaleX(' + f + ')';
    if (this.head) this.head.style.left = (f * 100) + '%';
    if (this.clock) this.clock.textContent = (f * TS[KEYS[this.state.sel]]).toFixed(1).replace('.', ',') + ' s de ' + String(TS[KEYS[this.state.sel]]).replace('.', ',') + ' s';
    this.raf = requestAnimationFrame(() => this.tick());
  }
  seek(frac) {
    const k = KEYS[this.state.sel];
    const t = frac * TS[k] * 1000;
    this.anims(k).forEach((a) => { a.currentTime = t; });
    this.setState({ playing: false });
  }
  renderVals() {
    const sel = this.state.sel;
    const k = KEYS[sel];
    return {
      r: Object.fromEntries(KEYS.map((key) => [key, this.refs_[key]])),
      on: Object.fromEntries(KEYS.map((key, i) => [key, i === sel ? 'is-on' : ''])),
      picks: NAMES.map((name, i) => ({
        n: String(i + 1).padStart(2, '0'), name, pressed: i === sel ? 'true' : 'false',
        pick: () => {
          KEYS.forEach((x) => this.anims(x).forEach((a) => { a.currentTime = 0; }));
          this.setState({ sel: i, playing: true });
        },
      })),
      speeds: [1, 0.5, 0.25].map((r) => ({
        label: (r === 1 ? '1' : String(r).replace('.', ',')) + '×', pressed: this.state.rate === r ? 'true' : 'false',
        pick: () => this.setState({ rate: r, playing: true }),
      })),
      beats: BEATS[k].map(([pct, label]) => ({ pct, label })),
      stageCls: sel === 0 ? 'is-azul' : '',
      playLabel: this.state.playing ? 'Pausar' : 'Tocar',
      toggle: () => this.setState({ playing: !this.state.playing }),
      lineClick: (e) => {
        const box = this.line.getBoundingClientRect();
        this.seek(Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)));
      },
      setFill: this.setFill, setHead: this.setHead, setClock: this.setClock, setLine: this.setLine,
    };
  }
}
"""


def build_lab():
    names = [s[0] for s in SERVICES]
    beats = {a["key"]: [[round(p, 1), label] for p, label in a["beats"]] for a in A}
    arts_html = "".join(
        f'        <div class="lb__art {{{{on.{a["key"]}}}}}" ref="{{{{r.{a["key"]}}}}}"><span class="sv-host" style="--ratio: {a["ratio"]};">'
        f'<span class="ar ar-{a["key"]}" aria-hidden="true"><span class="ar__scene">{a["scene"]}</span></span></span></div>\n'
        for a in A)
    js = LAB_JS.replace("class Component", f"const KEYS = {json.dumps(KEYS)};\nconst TS = {json.dumps(T)};\n"
                        f"const NAMES = {json.dumps(names, ensure_ascii=False)};\nconst BEATS = {json.dumps(beats, ensure_ascii=False)};\nclass Component", 1)
    props = {"$preview": {"width": 1440, "height": 1000}}
    return (HEAD.format(title="Serviços · laboratório", css=LAB_CSS + ART_CSS)
            + """<div class="g-papel lb">
  <div class="lb__side">
    <p class="g-eyebrow">// laboratório</p>
    <h2 class="lb__title">Uma arte de cada vez.</h2>
    <p class="lb__lead">Escolha um serviço, desacelere e arraste pela linha do tempo para ver cada passo do loop.</p>
    <ul class="lb__list">
      <sc-for list="{{picks}}" as="p" hint-placeholder-count="5">
        <li><button type="button" class="lb__pick" aria-pressed="{{p.pressed}}" onClick="{{p.pick}}"><span class="lb__n">{{p.n}}</span><span class="lb__t">{{p.name}}</span></button></li>
      </sc-for>
    </ul>
    <p class="lb__note">Tudo anima só transform, opacidade e cor, num relógio por arte. Fora da tela, o relógio para.</p>
  </div>
  <div class="lb__main">
    <div class="lb__stage {{stageCls}}">
""" + arts_html + """    </div>
    <div class="lb__bar">
      <button type="button" class="g-button g-button--primary g-button--sm" onClick="{{toggle}}">{{playLabel}}</button>
      <div class="lb__speeds" role="group" aria-label="Velocidade">
        <sc-for list="{{speeds}}" as="s" hint-placeholder-count="3">
          <button type="button" class="lb__speed" aria-pressed="{{s.pressed}}" onClick="{{s.pick}}">{{s.label}}</button>
        </sc-for>
      </div>
      <span class="lb__clock" ref="{{setClock}}"></span>
    </div>
    <div class="lb__line" ref="{{setLine}}" onClick="{{lineClick}}">
      <span class="lb__track"></span>
      <span class="lb__fill" ref="{{setFill}}"></span>
      <sc-for list="{{beats}}" as="b" hint-placeholder-count="4">
        <span class="lb__beat" style="left: {{b.pct}}%;"><i></i><span>{{b.label}}</span></span>
      </sc-for>
      <span class="lb__head" ref="{{setHead}}"></span>
    </div>
  </div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='""" + json.dumps(props, ensure_ascii=False) + """'>
""" + js + """</script>
</body>
</html>
""")


open(f"{OUT}/Servicos2-secao.dc.html", "w").write(build_section())
open(f"{OUT}/Servicos2-celular.dc.html", "w").write(build_section(mobile=True))
open(f"{OUT}/Servicos2-lab.dc.html", "w").write(build_lab())
print("ok")
