import { describe, it, expect } from 'vitest';
import { getMarkdownClasses } from './typography';

describe('getMarkdownClasses', () => {
  it('should return a string of concatenated classes', () => {
    const classes = getMarkdownClasses();
    expect(typeof classes).toBe('string');
    expect(classes.length).toBeGreaterThan(0);
  });

  it('should include base prose classes', () => {
    const classes = getMarkdownClasses();
    expect(classes).toContain('prose');
    expect(classes).toContain('prose-lg');
    expect(classes).toContain('prose-stone');
  });

  it('should include heading styles', () => {
    const classes = getMarkdownClasses();
    expect(classes).toContain('prose-headings:font-bold');
    expect(classes).toContain('prose-h1:text-2xl');
    expect(classes).toContain('prose-h1:font-black');
    expect(classes).toContain('prose-h1:uppercase');
  });

  it('should include responsive classes for H1', () => {
    const classes = getMarkdownClasses();
    expect(classes).toContain('prose-h1:sm:text-3xl');
    expect(classes).toContain('prose-h1:md:text-4xl');
    expect(classes).toContain('prose-h1:lg:text-5xl');
    expect(classes).toContain('prose-h1:xl:text-6xl');
  });

  it('should include link styles', () => {
    const classes = getMarkdownClasses();
    expect(classes).toContain('prose-a:no-underline');
    expect(classes).toContain('prose-a:font-bold');
  });

  it('should include custom theme classes', () => {
    const classes = getMarkdownClasses();
    expect(classes).toContain('[&>*]:text-[hsl(var(--markdown-text))]');
    expect(classes).toContain('prose-p:text-[hsl(var(--markdown-text-muted))]');
  });
});
