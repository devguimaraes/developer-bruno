// Cada serviço no celular, a ilha em cada superfície e o menu aberto.
const http = require("http"), fs = require("fs"), path = require("path"), { chromium } = require("playwright");
const ROOT = (fs.existsSync(path.join(__dirname, "canvas", "project")) ? path.join(__dirname, "canvas", "project") : path.resolve(__dirname, ".."));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const [, , H = "844", out = "folha-m4.png"] = process.argv;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: +H } });
  const errors = []; p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`http://127.0.0.1:${server.address().port}/Home-celular.dc.html`);
  await p.waitForFunction(() => window.__hs && window.__hs.chs, null, { timeout: 40000 }); await sleep(900);
  const to = (s, f) => p.evaluate(([s, f]) => { const h = window.__hs, n = h.q(s); h.sc.scrollTop = h.absTop(n) + Math.max(0, n.offsetHeight - h.H) * f; }, [s, f]);
  const shots = [];
  const snap = async (l) => shots.push([l, (await p.screenshot({ type: "jpeg", quality: 75 })).toString("base64")]);
  for (const i of [0, 1, 2, 3, 4]) {
    await to(".sv-track", i / 5 + 0.08); await sleep(1500);
    const m = await p.evaluate((i) => { const h = window.__hs; const R = (s) => h.q(s).getBoundingClientRect(); const tags = h.qa(".sv-detail")[i].querySelector(".sv-tags").getBoundingClientRect(); const dock = R(".hs-dock"); const pn = R(".sv-panel"); const art = h.qa(".sv-art")[i].querySelector(".service-art").getBoundingClientRect(); return { painel: Math.round(pn.height), arteL: Math.round(art.width), arteA: Math.round(art.height), vaoTagsIlha: Math.round(dock.top - tags.bottom) }; }, i);
    console.log("serviço", i + 1, JSON.stringify(m));
    await snap(`sv${i + 1}`);
  }
  await to(".pc-ch", 0.5); await sleep(1300); await snap("ilha-tinta");
  await to(".ct", 0); await sleep(1200); await snap("ilha-contato");
  await to(".pj-ch", 0.3); await sleep(1300);
  const menuBtn = await p.$(".hs-dock__menu");
  if (menuBtn) {
    await menuBtn.click(); await sleep(1300); await snap("menu");
    console.log("menu", JSON.stringify(await p.evaluate(() => ({ exp: window.__hs.q(".hs-dock__menu").getAttribute("aria-expanded"), key: window.__hs.key, giro: window.__hs.el.giro.getAttribute("data-state") }))));
    await p.click('.hs-band[data-i="4"]'); await sleep(1400); await snap("foi-sobre");
    console.log("depois do menu", JSON.stringify(await p.evaluate(() => ({ y: Math.round(window.__hs.sc.scrollTop), alvo: window.__hs.absTop(window.__hs.q("#sobre")), key: window.__hs.key, vis: getComputedStyle(window.__hs.el.menu).visibility }))));
  } else {
    const navSobre = await p.$('.hs-nav[href="#sobre"]');
    if (navSobre) {
      await navSobre.click(); await sleep(1400); await snap("foi-sobre");
      console.log("navegou via trilho", JSON.stringify(await p.evaluate(() => ({ y: Math.round(window.__hs.sc.scrollTop), alvo: window.__hs.absTop(window.__hs.q("#sobre")), key: window.__hs.key }))));
    }
  }
  console.log("erros:", errors.length ? errors : "nenhum");
  const n = shots.length, tw = 190, th = Math.round(tw * +H / 390);
  const sh = await b.newPage({ viewport: { width: (tw + 8) * 9, height: (th + 24) * Math.ceil(n / 9) } });
  await sh.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(9,${tw}px);gap:0 8px;font:12px monospace;color:#fff">${shots.map(([l, d]) => `<div><div style="height:20px">${l}</div><img src="data:image/jpeg;base64,${d}" style="width:${tw}px;height:${th}px;display:block"></div>`).join("")}</body>`);
  await sleep(400); await sh.screenshot({ path: out }); await b.close(); server.close();
})().catch((e) => { console.error(e); process.exit(1); });