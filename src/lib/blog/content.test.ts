import { describe, expect, it } from 'vitest';
import { countWords, parseReadingTime } from './content';

describe('parseReadingTime', () => {
  it('parses reading time from label', () => {
    expect(parseReadingTime('12 min')).toBe(12);
    expect(parseReadingTime('aprox. 4 minutos')).toBe(4);
    expect(parseReadingTime('sem numero')).toBeUndefined();
  });
});

describe('countWords', () => {
  it('counts markdown words ignoring formatting tokens', () => {
    const markdown = `# Heading\n\nTexto **forte** com \`inline\` e lista:\n- item um\n- item dois`;
    expect(countWords(markdown)).toBeGreaterThan(6);
  });
});
