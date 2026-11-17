"""Prévia local das artes, fora do canvas: grade da seção e palco solo para screenshots."""
import arts

A = arts.build_all()
TITLES = ["Sites completos", "Landing pages", "Interfaces de produto", "Full stack", "Branding"]

cards = "".join(
    f'<li class="card{" azul" if i == 0 else ""}" data-key="{a["key"]}"><div class="card__art"><span class="host" style="--ratio:{a["ratio"]}">{arts.art_html(a)}</span></div>'
    f'<div class="card__body"><span class="n">{i + 1:02d}</span><h3>{TITLES[i]}</h3></div></li>'
    for i, a in enumerate(A))
solo = "".join(f'<div class="solo" data-key="{a["key"]}"><span class="host">{arts.art_html(a)}</span></div>' for a in A)

html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Prévia</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&family=Geist+Mono:wght@400;500&display=swap">
<style>
body{{margin:0;background:#f6f5f0;font-family:Anybody,sans-serif;color:#0b0c1f}}
.wrap{{max-width:1440px;margin:0 auto;padding:64px}}
.grid{{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:24px;margin:0;padding:0;list-style:none}}
.card{{grid-column:span 2;border-radius:30px;overflow:hidden;background:#edece8;box-shadow:inset 0 0 0 1px rgba(11,12,31,.14)}}
.card:nth-child(-n+2){{grid-column:span 3}}
.card.azul{{background:#2b2eff;color:#f6f5f0}}
.card__art{{height:300px;display:flex;align-items:center;justify-content:center;overflow:hidden}}
.card:nth-child(-n+2) .card__art{{height:360px}}
.host{{display:block;container-type:inline-size;width:100%}}
.card .host{{width:min(100% - 24px, calc(276px * var(--ratio)))}}
.card:nth-child(-n+2) .host{{width:min(100% - 24px, calc(336px * var(--ratio)))}}
.card__body{{padding:8px 32px 28px}}
.n{{font:400 13px/1.4 "Geist Mono",monospace;opacity:.6}}
h3{{margin:4px 0 0;font-size:26px;font-weight:800;font-stretch:110%}}
.solo{{display:none;width:960px;background:#edece8;border-radius:32px;overflow:hidden}}
.solo[data-key=sites]{{background:#2b2eff}}
body.is-solo .wrap{{display:none}}
body.is-solo .solo.on{{display:block}}
.sheet{{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px;width:1424px}}
.cell{{position:relative;background:#edece8;border-radius:16px;overflow:hidden}}.cell.azul{{background:#2b2eff}}
.cell .host{{width:100%}}.lbl{{position:absolute;left:10px;top:8px;font:500 12px "Geist Mono",monospace;color:#5b5e78}}
{arts.all_css(A)}
@media (max-width:1023px){{.grid{{grid-template-columns:repeat(2,minmax(0,1fr))}}.card,.card:nth-child(-n+2){{grid-column:span 1}}.card:last-child{{grid-column:span 2}}}}
@media (max-width:640px){{.wrap{{padding:24px 16px}}.grid{{grid-template-columns:minmax(0,1fr);gap:16px}}.card:last-child{{grid-column:span 1}}.card__art,.card:nth-child(-n+2) .card__art{{height:auto;padding:8px 8px 0}}.card .host,.card:nth-child(-n+2) .host{{width:100%}}}}
</style></head><body>
<div class="wrap"><ul class="grid">{cards}</ul></div>
{solo}
<script>
const q = new URLSearchParams(location.search);
if (q.get('solo')) {{ document.body.classList.add('is-solo'); document.querySelector('.solo[data-key=' + q.get('solo') + ']').classList.add('on'); }}
if (q.get('sheet')) {{
  const key = q.get('sheet'), n = parseInt(q.get('n') || '8', 10);
  const src = document.querySelector('.solo[data-key=' + key + ']');
  const T = parseFloat(getComputedStyle(src.querySelector('.ar')).getPropertyValue('--T'));
  document.body.classList.add('is-solo');
  const sheet = document.createElement('div'); sheet.className = 'sheet'; document.body.append(sheet);
  for (let i = 0; i < n; i++) {{
    const t = q.get('times') ? parseFloat(q.get('times').split(',')[i]) : T * i / n;
    const cell = document.createElement('div'); cell.className = 'cell' + (key === 'sites' ? ' azul' : '');
    cell.innerHTML = src.innerHTML + '<span class="lbl">' + t.toFixed(2) + 's · ' + Math.round(t / T * 100) + '%</span>';
    sheet.append(cell);
    requestAnimationFrame(() => cell.querySelector('.ar').getAnimations({{ subtree: true }}).forEach(a => {{ a.pause(); a.currentTime = t * 1000; }}));
  }}
}}
window.freeze = (sec) => {{ document.getAnimations().forEach(a => {{ a.pause(); a.currentTime = sec * 1000; }}); }};
if (q.get('t') !== null) requestAnimationFrame(() => freeze(parseFloat(q.get('t'))));
</script>
</body></html>"""
open("preview.html", "w").write(html)
print("ok", len(html))
