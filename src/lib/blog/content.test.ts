import { describe, expect, it } from 'vitest';
import { countWords, parseBlogContent, parseReadingTime } from './content';

describe('blog content parser', () => {
  it('parses frontmatter and markdown content', () => {
    const source = `---
title: "Meu Post"
readTime: "7 min"
tags: ["React", "TypeScript"]
featured: true
---
\n# Titulo\n\nConteudo aqui.`;

    const result = parseBlogContent(source);

    expect(result.frontmatter.title).toBe('Meu Post');
    expect(result.frontmatter.readTime).toBe('7 min');
    expect(result.frontmatter.tags).toEqual(['React', 'TypeScript']);
    expect(result.frontmatter.featured).toBe(true);
    expect(result.markdown.startsWith('# Titulo')).toBe(true);
  });

  it('parses reading time from label', () => {
    expect(parseReadingTime('12 min')).toBe(12);
    expect(parseReadingTime('aprox. 4 minutos')).toBe(4);
    expect(parseReadingTime('sem numero')).toBeUndefined();
  });

  it('counts markdown words ignoring formatting tokens', () => {
    const markdown = `# Heading\n\nTexto **forte** com \`inline\` e lista:\n- item um\n- item dois`;
    expect(countWords(markdown)).toBeGreaterThan(6);
  });
});
