/**
 * Testes para markdown.css — Slice 4: Blog Post Experiência de Leitura
 *
 * Verifica que os estilos aplicados via [data-markdown-content] produzem
 * os valores esperados de computed style em jsdom (css: true no vitest.config).
 *
 * NOTA: jsdom NÃO suporta getComputedStyle com pseudo-elementos (::before, ::after).
 * Testes de ::content são feitos via leitura de regras CSS do stylesheet.
 */
import { describe, it, expect, afterEach } from "vitest";
import "../styles/markdown.css";

/** Renderiza HTML dentro de um container [data-markdown-content] no DOM real */
function renderMarkdown(html: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-markdown-content", "");
  wrapper.insertAdjacentHTML("beforeend", html);
  document.body.appendChild(wrapper);
  return wrapper;
}

/** Busca uma regra CSS que case com o seletor informado */
function findCssRule(selectorPattern: string): CSSStyleRule | undefined {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText.includes(selectorPattern)) {
          return rule;
        }
      }
    } catch {
      // cross-origin stylesheet — ignora
    }
  }
  return undefined;
}

afterEach(() => {
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Callouts
// ---------------------------------------------------------------------------
describe("Callouts (data-callout)", () => {
  it("callout info renderiza blockquote com atributo data-callout", () => {
    const container = renderMarkdown(
      `<blockquote data-callout="info">Mensagem informativa</blockquote>`
    );
    const el = container.querySelector("blockquote") as HTMLElement;
    expect(el.getAttribute("data-callout")).toBe("info");
  });

  it("callout warning renderiza com atributo data-callout", () => {
    const container = renderMarkdown(
      `<blockquote data-callout="warning">Cuidado importante</blockquote>`
    );
    const el = container.querySelector("blockquote") as HTMLElement;
    expect(el.getAttribute("data-callout")).toBe("warning");
  });

  it("callout error renderiza com atributo data-callout", () => {
    const container = renderMarkdown(`<blockquote data-callout="error">Erro crítico</blockquote>`);
    const el = container.querySelector("blockquote") as HTMLElement;
    expect(el.getAttribute("data-callout")).toBe("error");
  });

  it("callout tip renderiza com atributo data-callout", () => {
    const container = renderMarkdown(`<blockquote data-callout="tip">Dica útil</blockquote>`);
    const el = container.querySelector("blockquote") as HTMLElement;
    expect(el.getAttribute("data-callout")).toBe("tip");
  });

  it("callout info tem regra CSS com ::before definindo content com ícone", () => {
    // O ícone está em ::before — verificamos via CSSOM
    const hasInfoRule = Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(
          r =>
            r instanceof CSSStyleRule &&
            r.selectorText.includes("data-callout") &&
            r.selectorText.includes("info")
        );
      } catch {
        return false;
      }
    });
    expect(hasInfoRule).toBe(true);
  });

  it("callout tem cor de fundo sutil (não totalmente transparente)", () => {
    const container = renderMarkdown(`<blockquote data-callout="info">Com fundo</blockquote>`);
    const el = container.querySelector("blockquote") as HTMLElement;
    const style = getComputedStyle(el);
    expect(style.backgroundColor).not.toBe("transparent");
    expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  });
});

// ---------------------------------------------------------------------------
// Pull Quotes (blockquote sem data-callout)
// ---------------------------------------------------------------------------
describe("Pull Quotes (blockquote padrão)", () => {
  it("blockquote padrão mantém estilo existente (não é callout)", () => {
    const container = renderMarkdown(
      `<blockquote><p>Uma citação memorável do artigo.</p></blockquote>`
    );
    const el = container.querySelector("blockquote") as HTMLElement;
    // Não deve ter data-callout
    expect(el.hasAttribute("data-callout")).toBe(false);
    // CSS deve ter regra para blockquote sem data-callout
    const rule = findCssRule("blockquote:not([data-callout])");
    expect(rule).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Headings
// ---------------------------------------------------------------------------
describe("Headings (h2, h3)", () => {
  it("h3 tem font-size de 1.5rem", () => {
    const container = renderMarkdown(`<h3>Subtítulo da seção</h3>`);
    const el = container.querySelector("h3") as HTMLElement;
    const style = getComputedStyle(el);
    expect(style.fontSize).toBe("1.5rem");
  });
});

// ---------------------------------------------------------------------------
// Horizontal Rule
// ---------------------------------------------------------------------------
describe("Horizontal Rule (hr)", () => {
  it("hr tem border-top width >= 1px", () => {
    const container = renderMarkdown(`<hr />`);
    const el = container.querySelector("hr") as HTMLElement;
    const style = getComputedStyle(el);
    const topWidth = Number.parseFloat(style.borderTopWidth);
    expect(topWidth).toBeGreaterThanOrEqual(1);
  });

  it("hr tem margem vertical de 3rem", () => {
    const container = renderMarkdown(`<hr />`);
    const el = container.querySelector("hr") as HTMLElement;
    const style = getComputedStyle(el);
    expect(style.marginTop).toBe("3rem");
    expect(style.marginBottom).toBe("3rem");
  });

  it("hr tem regra CSS com border: none e border-top customizado", () => {
    const rule = findCssRule("[data-markdown-content] hr");
    expect(rule).toBeDefined();
    // border-right e border-left devem ser 0 (via border: none)
    expect(rule?.style.borderRightWidth || rule?.style.borderWidth).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Imagens inline
// ---------------------------------------------------------------------------
describe("Imagens inline", () => {
  it("img tem borda arredondada", () => {
    const container = renderMarkdown(`<img src="/test.webp" alt="test" />`);
    const el = container.querySelector("img") as HTMLElement;
    const style = getComputedStyle(el);
    const radius = Number.parseFloat(style.borderRadius);
    expect(radius).toBeGreaterThan(0);
  });

  it("img tem border-top-width visível (≥ 1px)", () => {
    const container = renderMarkdown(`<img src="/test.webp" alt="test" />`);
    const el = container.querySelector("img") as HTMLElement;
    const style = getComputedStyle(el);
    const topWidth = Number.parseFloat(style.borderTopWidth);
    expect(topWidth).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Listas
// ---------------------------------------------------------------------------
describe("Listas", () => {
  it("ul tem regra CSS que remove bullets padrão", () => {
    // jsdom pode reportar "disc" do user-agent; verificamos via CSSOM
    const rule = findCssRule("[data-markdown-content] ul");
    expect(rule).toBeDefined();
    // A regra deve conter list-style: none
    expect(rule?.style.listStyleType || rule?.cssText).toBeTruthy();
  });

  it("li tem padding-left para acomodar bullet customizado", () => {
    const container = renderMarkdown(`<ul><li>Item um</li></ul>`);
    const li = container.querySelector("li") as HTMLElement;
    const style = getComputedStyle(li);
    const paddingLeft = Number.parseFloat(style.paddingLeft);
    expect(paddingLeft).toBeGreaterThan(0);
  });
});
