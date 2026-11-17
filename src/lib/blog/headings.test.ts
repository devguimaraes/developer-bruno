import { describe, expect, it } from "vitest";
import { articleHeadings, headingsFromMarkdown, rehypeHeadingIds } from "./headings";

const markdown = `# Título

## Introdução

Texto.

\`\`\`md
## Não conta
\`\`\`

### Detalhe do \`useState\`

## Introdução
`;

describe("headingsFromMarkdown", () => {
  it("lista só os h2, ignora fence e repete o slug", () => {
    expect(headingsFromMarkdown(markdown)).toEqual([
      { id: "introducao", title: "Introdução", level: 2 },
      { id: "introducao-2", title: "Introdução", level: 2 },
    ]);
  });

  it("usa o mesmo id que o HTML do heading", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "h2",
          properties: {},
          children: [{ type: "text", value: "Introdução" }],
        },
        {
          type: "element",
          tagName: "h3",
          properties: {},
          children: [
            { type: "text", value: "Detalhe do " },
            {
              type: "element",
              tagName: "code",
              properties: {},
              children: [{ type: "text", value: "useState" }],
            },
          ],
        },
        {
          type: "element",
          tagName: "h2",
          properties: {},
          children: [{ type: "text", value: "Introdução" }],
        },
      ],
    };

    rehypeHeadingIds()(tree);

    const ids = articleHeadings(markdown).map(heading => heading.id);
    const htmlIds = tree.children.map(child => (child.properties as { id?: string }).id);
    expect(htmlIds).toEqual(ids);
  });
});
