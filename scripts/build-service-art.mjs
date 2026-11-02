// Prepara as ilustrações isométricas dos serviços para ficarem inline na mesma página.
// Os arquivos de origem repetem os nomes de keyframes (k0, k1...) e têm regras globais
// (`polygon{}`, `*{animation-play-state}`), então cada um ganha um escopo `.sa-<nome>`.
// As animações (CSS e SMIL) e o desenho não mudam.
//
// Uso: node scripts/build-service-art.mjs <pasta-com-os-svgs>
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const OUT_DIR = "src/assets/service-art";

function splitRules(css) {
  const rules = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        rules.push(css.slice(start, i + 1).trim());
        start = i + 1;
      }
    }
  }
  return rules.filter(Boolean);
}

function scopeCss(css, name) {
  const scope = `.sa-${name}`;
  return splitRules(css)
    .map(rule => {
      const open = rule.indexOf("{");
      const head = rule.slice(0, open).trim();
      const body = rule.slice(open);
      if (head.startsWith("@keyframes")) {
        return `@keyframes ${name}-${head.replace("@keyframes", "").trim()}${body}`;
      }
      if (head.startsWith("@media")) {
        return `${head}{${scopeCss(body.slice(1, -1), name)}}`;
      }
      const selectors = head
        .split(",")
        .map(selector => (selector.trim() === "svg" ? scope : `${scope} ${selector.trim()}`));
      const scopedBody = body.replace(/animation:(k\w+)\s/g, `animation:${name}-$1 `);
      return `${selectors.join(",")}${scopedBody}`;
    })
    .join("\n");
}

function scopeSvg(source, name) {
  const css = source.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  if (!css) throw new Error(`${name}: sem <style>`);
  // Os nomes de classe ak* andam junto com os keyframes, então ganham o mesmo prefixo.
  const renamedCss = css.replace(/\.(ak\w+)\{/g, `.${name}-$1{`);

  return source
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .replace(/<style>[\s\S]*?<\/style>/, `<style>\n${scopeCss(renamedCss, name)}\n</style>`)
    .replace(/class="([^"]*)"/g, (_, classes) => {
      const scoped = classes
        .split(/\s+/)
        .map(token => (/^ak\w+$/.test(token) ? `${name}-${token}` : token))
        .join(" ");
      return `class="${scoped}"`;
    })
    .replace(
      /<svg ([^>]*)>/,
      (_, attrs) =>
        `<svg ${attrs
          .replace(/\s(width|height|role|aria-label)="[^"]*"/g, "")
          .trim()} class="sa sa-${name}" aria-hidden="true" focusable="false">`
    );
}

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Uso: node scripts/build-service-art.mjs <pasta-com-os-svgs>");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
const files = (await readdir(sourceDir)).filter(file => file.endsWith(".svg"));
for (const file of files) {
  const name = basename(file, ".svg");
  const output = scopeSvg(await readFile(join(sourceDir, file), "utf8"), name);
  await writeFile(join(OUT_DIR, file), output);
  console.log(`${file} → ${join(OUT_DIR, file)}`);
}
