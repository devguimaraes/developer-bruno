// Recorta o fundo preto da foto por inundação a partir das bordas e assa o duotone azul com alfa.
const { chromium } = require("playwright"); const fs = require("fs");
const [, , src, out] = process.argv;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const d = "data:image/webp;base64," + fs.readFileSync(src).toString("base64");
  await p.setContent("<canvas id=c></canvas>");
  const url = await p.evaluate(async (d) => {
    const im = new Image(); im.src = d; await im.decode();
    const W = 900, H = Math.round(im.naturalHeight * W / im.naturalWidth);
    const c = document.getElementById("c"); c.width = W; c.height = H;
    const x = c.getContext("2d"); x.drawImage(im, 0, 0, W, H);
    const id = x.getImageData(0, 0, W, H), a = id.data;
    const bg = new Uint8Array(W * H), st = [];
    const dark = (i) => a[i * 4] <= 12 && a[i * 4 + 1] <= 12 && a[i * 4 + 2] <= 12;
    const push = (i) => { if (!bg[i] && dark(i)) { bg[i] = 1; st.push(i); } };
    for (let i = 0; i < W; i++) { push(i); push((H - 1) * W + i); }
    for (let j = 0; j < H; j++) { push(j * W); push(j * W + W - 1); }
    while (st.length) { const i = st.pop(), q = i % W;
      if (q > 0) push(i - 1); if (q < W - 1) push(i + 1); if (i >= W) push(i - W); if (i < W * (H - 1)) push(i + W); }
    const al = new Float32Array(W * H);
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      let s = 0; for (let v = -1; v <= 1; v++) for (let u = -1; u <= 1; u++) s += bg[(j + v) * W + i + u] ? 0 : 1;
      al[j * W + i] = s / 9;
    }
    const blue = [43 / 255, 46 / 255, 1];
    for (let n = 0; n < W * H; n++) {
      let g = (0.299 * a[n * 4] + 0.587 * a[n * 4 + 1] + 0.114 * a[n * 4 + 2]) / 255;
      g = Math.max(0, Math.min(1, ((g - 0.5) * 1.3 + 0.5) * 0.94));
      for (let k = 0; k < 3; k++) a[n * 4 + k] = 255 * (1 - (1 - g) * (1 - blue[k]));
      a[n * 4 + 3] = 255 * al[n];
    }
    x.putImageData(id, 0, 0);
    return c.toDataURL("image/webp", 0.82);
  }, d);
  fs.writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
  console.log(out, fs.statSync(out).size);
  await b.close();
})();