// Confere o que a folha de quadros não prova: a máquina de estados, a volta da rolagem e os links.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = (fs.existsSync(path.join(__dirname, "canvas", "project")) ? path.join(__dirname, "canvas", "project") : path.resolve(__dirname, ".."));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${server.address().port}/Main.dc.html`);
  await page.waitForFunction(() => window.__hs && window.__hs.chs, null, { timeout: 40000 });
  await sleep(800);
  const to = (sel, f) => page.evaluate(([sel, f]) => { const h = window.__hs, n = h.q(sel); h.sc.scrollTop = h.absTop(n) + Math.max(0, n.offsetHeight - h.H) * f; }, [sel, f]);
  const st = () => page.evaluate(() => { const h = window.__hs; return { demo: h.q(".dm").getAttribute("data-st"), giro: h.el.giro.getAttribute("data-state"), key: h.key }; });
  const log = async (label) => console.log(label.padEnd(26), JSON.stringify(await st()));

  await to(".ab", 0.27); await sleep(1400); await log("vazio pela rolagem");
  await page.click(".dm-act"); await sleep(400); await log("clicou Publicar");
  await sleep(1500); await log("primeira falha");
  const core = await page.evaluate(() => { const h = window.__hs; const a = h.el.actor; const inn = h.el.actorIn; return { cls: a.className, core: getComputedStyle(inn, "::before").backgroundColor, sbg: getComputedStyle(a).getPropertyValue("--s-bg"), arc: getComputedStyle(h.el.giro.querySelector(".g-giro__arc")).stroke }; });
  console.log("cor do miolo no erro".padEnd(26), JSON.stringify(core));
  await page.screenshot({ path: path.join(__dirname, "zoom-erro.png"), clip: { x: 760, y: 200, width: 620, height: 480 } });
  await page.click(".dm-act"); await sleep(1500); await log("tentou de novo");
  await page.click('[data-demo="error"]'); await sleep(500); await log("chip erro");
  await to(".ab", 0.46); await sleep(1300); await log("rolou: volta ao roteiro");
  await to(".sv-track", 0.5); await sleep(1400);
  const sv = await page.evaluate(() => ({ on: window.__hs.q(".sv-row.is-on .sv-name").textContent, c: window.__hs.q(".sv-art.is-on").dataset.c, playing: [...window.__hs.qa(".sv-art")].map((a) => a.querySelector(".ar").classList.contains("is-paused")) }));
  console.log("serviço na metade".padEnd(26), JSON.stringify(sv));
  await page.click('.sv-row[data-i="4"]'); await sleep(1800);
  console.log("clicou Branding".padEnd(26), await page.evaluate(() => window.__hs.q(".sv-row.is-on .sv-name").textContent));
  await to(".pc-ch", 0.56); await sleep(1500); await log("processo, etapa código");
  await to(".pc-ch", 0.1); await sleep(1500); await log("subiu para conversa");
  await to(".ab", 0.8); await sleep(1500); await log("subiu até pronto");
  await to(".fn-ch", 1); await sleep(1600); await log("fim");
  await page.hover('.fn-tag[data-i="4"]'); await sleep(1100); await log("hover em processo");
  console.log("placa acesa".padEnd(26), await page.evaluate(() => window.__hs.q(".fn-pl.is-on").dataset.to));
  await page.click('.fn-tag[data-i="4"]'); await sleep(2600);
  console.log("clicou processo, y".padEnd(26), await page.evaluate(() => [Math.round(window.__hs.sc.scrollTop), window.__hs.absTop(window.__hs.q("#processo"))]));
  await to(".ct", 0); await sleep(900);
  await page.fill(".ct-f input", "Bruno"); await sleep(250);
  await log("digitando");
  await page.click(".ct-submit"); await sleep(500);
  console.log("enviando".padEnd(26), await page.evaluate(() => window.__hs.q(".ct").getAttribute("data-send")));
  await sleep(1500); await log("enviado");
  console.log("erros:", errors.length ? errors : "nenhum");
  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
