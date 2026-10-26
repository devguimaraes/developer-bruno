export interface ArticleHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** Título de heading sem marcação markdown, para o slug bater com o HTML renderizado. */
export function plainHeading(title: string): string {
  return title
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/[*_~]+/g, "")
    .replace(/\s+#+\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyHeading(value: string): string {
  const slug = plainHeading(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "secao";
}

function nextId(used: Map<string, number>, title: string): string {
  const base = slugifyHeading(title);
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

/** Headings h2 e h3 do markdown, fora de fences, com o mesmo id que o HTML ganha no build. */
export function articleHeadings(markdown: string): ArticleHeading[] {
  const found: ArticleHeading[] = [];
  const used = new Map<string, number>();
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s{0,3}```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;
    const level = match[1].length === 2 ? 2 : 3;
    const title = plainHeading(match[2] ?? "");
    found.push({ id: nextId(used, title), title, level });
  }

  return found;
}

export function headingsFromMarkdown(markdown: string): ArticleHeading[] {
  return articleHeadings(markdown).filter(heading => heading.level === 2);
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function wrapTables(node: HastNode) {
  const children = node.children;
  if (!children) return;
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (!child) continue;
    wrapTables(child);
    if (child.type === "element" && child.tagName === "table") {
      children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["post-table"] },
        children: [child],
      };
    }
  }
}

/** Headings com id e tabelas que rolam dentro da coluna. */
export function rehypePostContent() {
  const headings = rehypeHeadingIds();
  return (tree: HastNode) => {
    headings(tree);
    wrapTables(tree);
  };
}

/** Ids de h2/h3 no HTML do post. A mesma conta de `articleHeadings`, para o índice apontar certo. */
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const used = new Map<string, number>();
    const walk = (node: HastNode) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        const properties = node.properties ?? {};
        const current = properties.id;
        if (typeof current !== "string" || current.length === 0) {
          properties.id = nextId(used, textOf(node));
          node.properties = properties;
        }
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}
