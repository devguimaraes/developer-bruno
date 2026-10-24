export function parseReadingTime(readTime?: string): number | undefined {
  if (!readTime) return undefined;

  const match = readTime.match(/\d+/);
  if (!match) return undefined;

  const minutes = Number.parseInt(match[0], 10);
  return Number.isNaN(minutes) ? undefined : minutes;
}
