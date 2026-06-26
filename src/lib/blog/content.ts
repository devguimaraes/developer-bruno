export function parseReadingTime(readTime?: string): number | undefined {
  if (!readTime) return undefined;

  const match = readTime.match(/\d+/);
  if (!match) return undefined;

  const minutes = Number.parseInt(match[0], 10);
  return Number.isNaN(minutes) ? undefined : minutes;
}

export function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_~-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
