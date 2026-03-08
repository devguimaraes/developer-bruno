import type { BlogFrontmatter } from '@/types/blog';

interface ParseFrontmatterResult {
  data: Record<string, unknown>;
  content: string;
}

export interface ParsedBlogContent {
  markdown: string;
  frontmatter: BlogFrontmatter;
}

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;

function parseFrontmatter(rawContent: string): ParseFrontmatterResult {
  const match = rawContent.match(FRONTMATTER_REGEX);

  if (!match) {
    return { data: {}, content: rawContent.trim() };
  }

  const frontmatterStr = match[1];
  const markdownContent = match[2];
  const data: Record<string, unknown> = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex < 0) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();
    data[key] = parseFrontmatterValue(rawValue);
  }

  return { data, content: markdownContent.trim() };
}

function parseFrontmatterValue(rawValue: string): unknown {
  const value = stripWrappingQuotes(rawValue);

  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => stripWrappingQuotes(item.trim()))
      .filter(Boolean);
  }

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return value;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function parseBlogContent(rawContent: string): ParsedBlogContent {
  const { data, content } = parseFrontmatter(rawContent);

  const frontmatter: BlogFrontmatter = {
    title: asNonEmptyString(data.title),
    date: asNonEmptyString(data.date),
    readTime: asNonEmptyString(data.readTime),
    tags: asStringArray(data.tags),
    author: asNonEmptyString(data.author),
    excerpt: asNonEmptyString(data.excerpt),
    image: asNonEmptyString(data.image),
    featured: asBoolean(data.featured),
  };

  return {
    markdown: content,
    frontmatter,
  };
}

export function parseReadingTime(readTime?: string): number | undefined {
  if (!readTime) return undefined;

  const match = readTime.match(/\d+/);
  if (!match) return undefined;

  const minutes = Number.parseInt(match[0], 10);
  return Number.isNaN(minutes) ? undefined : minutes;
}

export function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_~-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  return undefined;
}
