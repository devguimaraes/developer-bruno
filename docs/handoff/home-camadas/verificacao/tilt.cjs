// Mede o meio da virada das janelas, o trecho que a folha de quadros pulava.
const http = require("http"), fs = require("fs"), path = require("path"), { chromium } = require("playwright");
const ROOT = (fs.existsSync(path.join(__dirname, "canvas", "project")) ? path.join(__dirname, "canvas", "project") : path.resolve(__dirname, ".."));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const [, , out = "virada.png", W = "1528", Hh = "710", pageName = "Main.dc.html"] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +W, height: +Hh } });
  const errors = []; p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`http://127.0.0.1:${server.address().port}/${pageName}`);
  await p.waitForFunction(() => window.__hs && window.__hs.chs, null, { timeout: 40000 }); await sleep(900);
  const shots = [];
  for (const t of [7.8, 8.2, 8.5, 8.8, 9.1, 9.5, 10, 11.2]) {
    await p.evaluate((t) => { const h = window.__hs, n = h.q(".pj-ch"); h.sc.scrollTop = h.absTop(n) + (n.offsetHeight - h.H) * (t / 12); }, t);
    await sleep(1100);
    const m = await p.evaluate(() => {
      const h = window.__hs, w = h.q(".pj-world"), s = w.style;
      const R = h.qa(".pj").map((n) => { const r = n.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; });
      return { wk: s.getPropertyValue("--wk"), rx: s.getPropertyValue("--wrx"), rz: s.getPropertyValue("--wrz"), wx: s.getPropertyValue("--wx"), wy: s.getPropertyValue("--wy"), t: getComputedStyle(w).transform.slice(0, 60), pj4: R[4], pj0: R[0] };
    });
    console.log(String(t).padEnd(5), JSON.stringify(m));
    shots.push([t, (await p.screenshot({ type: "jpeg", quality: 60 })).toString("base64")]);
  }
  console.log("erros:", errors.length ? errors : "nenhum");
  const tw = 340, th = Math.round(tw * +Hh / +W);
  const sh = await b.newPage({ viewport: { width: (tw + 6) * 4, height: (th + 22) * 2 } });
  await sh.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(4,${tw}px);gap:0 6px;font:12px monospace;color:#fff">${shots.map(([l, d]) => `<div><div style="height:18px">t=${l}</div><img src="data:image/jpeg;base64,${d}" style="width:${tw}px;height:${th}px;display:block"></div>`).join("")}</body>`);
  await sleep(300); await sh.screenshot({ path: path.join(__dirname, out) }); await b.close(); server.close();
})().catch((e) => { console.error(e); process.exit(1); });
