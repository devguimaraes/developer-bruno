// Serve a pasta do canvas, posiciona a rolagem em cada ponto da história e monta uma folha de quadros.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = (fs.existsSync(path.join(__dirname, "canvas", "project")) ? path.join(__dirname, "canvas", "project") : path.resolve(__dirname, ".."));
const [, , name, width, height, cols, thumb, out, onlyArg] = process.argv;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [rótulo, seletor do capítulo, fração da parte fixa]
const POINTS = [
  ["hero", ".ab", 0.0], ["fecha", ".ab", 0.13], ["vazio", ".ab", 0.27], ["carregando", ".ab", 0.46], ["erro", ".ab", 0.62], ["pronto", ".ab", 0.8], ["disco", ".ab", 0.95],
  ["sv1", ".sv-track", 0.05], ["sv3", ".sv-track", 0.5], ["sv4", ".sv-track", 0.68],
  ["no-ar", ".pj-ch", 0.06], ["janela1", ".pj-ch", 0.2], ["janela3", ".pj-ch", 0.42], ["janela5", ".pj-ch", 0.66], ["pilha", ".pj-ch", 0.84],
  ["pc1", ".pc-ch", 0.1], ["pc2", ".pc-ch", 0.34], ["pc3", ".pc-ch", 0.56], ["pc4", ".pc-ch", 0.8],
  ["sobre1", ".sb-ch", 0.3], ["sobre2", ".sb-ch", 0.85],
  ["blog", ".bl", 0.0], ["contato", ".ct", 0.0], ["fim1", ".fn-ch", 0.3], ["fim2", ".fn-ch", 1.0],
];

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +width, height: +height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && !/fonts\.g|ERR_|404/.test(m.text()) && errors.push(m.text()));
  await page.goto(`${base}/${name}`);
  await page.waitForFunction(() => window.__hs && window.__hs.chs, null, { timeout: 40000 });
  await sleep(900);
  const only = onlyArg ? new Set(onlyArg.split(",")) : null;
  const shots = []; if (process.env.MENU) { }
  for (const [label, sel, f] of POINTS) {
    if (only && !only.has(label)) continue;
    await page.evaluate(([sel, f]) => {
      const hs = window.__hs;
      const n = hs.q(sel);
      let top = 0;
      for (let e = n; e && e !== hs.sc; e = e.offsetParent) top += e.offsetTop;
      hs.sc.scrollTop = top + Math.max(0, n.offsetHeight - hs.H) * f;
    }, [sel, f]);
    await sleep(1500);
    const buf = await page.screenshot({ type: "jpeg", quality: 72 });
    shots.push([label, buf.toString("base64")]);
    if (process.env.SAVE) fs.writeFileSync(path.join(ROOT, "img", `q-${label}.jpg`), buf);
  }
  const metrics = await page.evaluate(() => {
    const hs = window.__hs;
    return { scrollH: hs.sc.scrollHeight, H: hs.H, overflowX: hs.sc.scrollWidth - hs.sc.clientWidth, chs: hs.chs.map((c) => [c.id, Math.round(c.top), Math.round(c.len)]) };
  });
  console.log(JSON.stringify(metrics));
  console.log("erros:", errors.length ? errors.slice(0, 8) : "nenhum");
  const n = +cols, tw = +thumb, th = Math.round((tw * +height) / +width);
  const sheet = await browser.newPage({ viewport: { width: (tw + 8) * n, height: (th + 26) * Math.ceil(shots.length / n) } });
  await sheet.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${n},${tw}px);gap:0 8px;font:12px monospace;color:#fff">${shots.map(([l, b]) => `<div><div style="height:22px;line-height:22px">${l}</div><img src="data:image/jpeg;base64,${b}" style="width:${tw}px;height:${th}px;display:block"></div>`).join("")}</body>`);
  await sleep(500);
  await sheet.screenshot({ path: out, type: "png" });
  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
