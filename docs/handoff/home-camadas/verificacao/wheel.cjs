// Reproduz a chegada aos projetos com a roda do mouse, em vários tamanhos de janela.
const http = require("http"), fs = require("fs"), path = require("path"), { chromium } = require("playwright");
const ROOT = (fs.existsSync(path.join(__dirname, "canvas", "project")) ? path.join(__dirname, "canvas", "project") : path.resolve(__dirname, ".."));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [1920, 1080], [1366, 768], [1536, 730]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errors = []; p.on("pageerror", (e) => errors.push(String(e)));
    await p.goto(`http://127.0.0.1:${server.address().port}/Main.dc.html`);
    await p.waitForFunction(() => window.__hs && window.__hs.chs, null, { timeout: 40000 }); await sleep(800);
    await p.mouse.move(w / 2, h / 2);
    const target = await p.evaluate(() => { const hs = window.__hs, n = hs.q(".pj-ch"); return hs.absTop(n) + (n.offsetHeight - hs.H) * 0.2; });
    for (let i = 0; i < 400; i++) {
      const y = await p.evaluate(() => window.__hs.sc.scrollTop);
      if (y >= target) break;
      await p.mouse.wheel(0, Math.min(620, target - y)); await sleep(45);
    }
    await sleep(1600);
    const m = await p.evaluate(() => {
      const hs = window.__hs;
      const vis = hs.qa(".pj").map((n) => { const r = n.getBoundingClientRect(), c = getComputedStyle(n); return [Math.round(r.top), Math.round(r.height), c.visibility, c.opacity]; });
      const imgs = hs.qa(".pj-cover img").map((i) => i.naturalWidth);
      const cov = getComputedStyle(hs.q(".pj-cover")).clipPath;
      return { y: Math.round(hs.sc.scrollTop), key: hs.key, H: hs.H, vis: vis.slice(0, 2), imgs, cov, st: window.ScrollTrigger.getAll().length };
    });
    console.log(`${w}x${h}`, JSON.stringify(m), "erros", errors.length);
    await p.screenshot({ path: path.join(__dirname, `roda-${w}.jpg`), type: "jpeg", quality: 60 });
    await p.close();
  }
  await b.close(); server.close();
})().catch((e) => { console.error(e); process.exit(1); });
