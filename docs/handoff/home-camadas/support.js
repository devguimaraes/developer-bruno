// Runtime mínimo para rodar componentes .dc.html fora do Design Canvas
class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = null;
    this.alive = true;
    this.timers = [];
  }
  setState(p) {
    const patch = typeof p === "function" ? p(this.state) : p;
    this.state = Object.assign({}, this.state, patch);
    if (this._update) this._update();
  }
  forceUpdate() {
    if (this._update) this._update();
  }
}

window.DCLogic = DCLogic;

function get(path, ctx) {
  if (!path) return undefined;
  return path.trim().split(".").reduce((o, k) => (o == null ? undefined : o[k]), ctx);
}

function interpolate(str, ctx) {
  return str.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, p) => {
    const v = get(p, ctx);
    return v == null ? "" : String(v);
  });
}

async function mountComponent(rootEl, scriptEl, propOverrides = {}) {
  let propsDef = {};
  const rawProps = scriptEl.getAttribute("data-props");
  if (rawProps) {
    try {
      propsDef = JSON.parse(rawProps);
    } catch (e) {
      console.warn("Failed to parse data-props:", e);
    }
  }

  const props = {};
  for (const [k, v] of Object.entries(propsDef)) {
    if (k[0] !== "$" && v && "default" in v) {
      props[k] = v.default;
    }
  }

  // URL query params override props
  if (typeof location !== "undefined") {
    const q = new URLSearchParams(location.search);
    q.forEach((v, k) => {
      if (k === "board") return;
      props[k] = v === "true" ? true : v === "false" ? false : Number.isNaN(Number(v)) ? v : Number(v);
    });
  }

  Object.assign(props, propOverrides);

  const code = scriptEl.textContent;
  const Component = new Function("DCLogic", `${code}\nreturn Component;`)(DCLogic);
  const comp = new Component(props);
  comp.alive = true;
  comp._root = rootEl;

  let vals = comp.renderVals() || {};

  comp._update = () => {
    vals = comp.renderVals() || {};
    applyBindings();
  };

  const applyBindings = () => {
    // 1. Ref bindings
    rootEl.querySelectorAll("[ref]").forEach((el) => {
      const refAttr = el.getAttribute("ref");
      const m = refAttr.match(/^\{\{\s*([\w.]+)\s*\}\}$/);
      if (m) {
        const fn = get(m[1], vals);
        if (typeof fn === "function") {
          fn(el);
        }
      }
    });

    // 2. Attribute interpolations (e.g. class="hs {{rootCls}}")
    rootEl.querySelectorAll("*").forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        if (attr.name === "ref") continue;
        if (attr.value.includes("{{")) {
          if (!el.hasAttribute(`data-orig-${attr.name}`)) {
            el.setAttribute(`data-orig-${attr.name}`, attr.value);
          }
          const orig = el.getAttribute(`data-orig-${attr.name}`);
          el.setAttribute(attr.name, interpolate(orig, vals));
        }
      }
    });
  };

  // Check for dc-import
  const imports = Array.from(rootEl.querySelectorAll("dc-import"));
  for (const imp of imports) {
    const name = imp.getAttribute("name");
    if (!name) continue;
    try {
      const resp = await fetch(`${name}.dc.html`);
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const childXdc = doc.querySelector("x-dc");
      const childScript = doc.querySelector('script[type="text/x-dc"]');
      if (childXdc && childScript) {
        // Strip helmet
        const helmet = childXdc.querySelector("helmet");
        if (helmet) helmet.remove();
        imp.innerHTML = childXdc.innerHTML;

        const childProps = {};
        for (const attr of Array.from(imp.attributes)) {
          if (attr.name === "name" || attr.name === "hint-size") continue;
          let val = attr.value;
          if (val.includes("{{")) val = interpolate(val, vals);
          childProps[attr.name] = val === "true" ? true : val === "false" ? false : val;
        }

        const childComp = await mountComponent(imp, childScript, childProps);
        comp._child = childComp;
      }
    } catch (err) {
      console.error(`Failed to import <dc-import name="${name}">:`, err);
    }
  }

  applyBindings();

  if (comp.componentDidMount) {
    comp.componentDidMount();
  }

  return comp;
}

if (typeof document !== "undefined") {
  const init = async () => {
    const scriptEl = document.querySelector('script[type="text/x-dc"][data-dc-script]');
    const rootEl = document.querySelector("x-dc") || document.body;
    if (scriptEl && rootEl) {
      const comp = await mountComponent(rootEl, scriptEl);
      window.__comp = comp;
      window.__ready = true;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
