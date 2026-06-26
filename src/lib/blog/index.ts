import { getCollection } from "astro:content";
import { countWords, parseReadingTime } from "./content";
import type { BlogPost } from "@/types/blog";

export type { BlogPost } from "@/types/blog";

export function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function convertBrazilianDate(dateStr: string): Date {
  const months: Record<string, number> = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
  };

  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const day = Number.parseInt(parts[0], 10);
    const month = months[parts[1].toUpperCase()] ?? 0;
    const year = Number.parseInt(parts[2], 10);

    if (!Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  return new Date(dateStr);
}

/**
 * Convert Brazilian date format "DD MMM YYYY" to ISO "YYYY-MM-DD".
 * Handles both Brazilian format and already-ISO dates (pass-through).
 */
export function toISODate(dateStr: string): string {
  // If already ISO format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const months: Record<string, number> = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
  };

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = Number.parseInt(parts[0], 10);
    const month = months[parts[1].toUpperCase()];
    const year = Number.parseInt(parts[2], 10);

    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  // Fallback: try native Date parsing
  const date = new Date(dateStr);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  // Last resort: return original (will be invalid in schema, but at least we tried)
  return dateStr;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection("blog");
  const posts: BlogPost[] = [];

  for (const entry of entries) {
    const rawContent = entry.body ?? "";
    const wordCount = countWords(rawContent);
    const readTime = entry.data.readTime || `${Math.ceil(wordCount / 200)} min`;

    posts.push({
      id: entry.id,
      slug: entry.id,
      title: entry.data.title,
      date: entry.data.date,
      readTime,
      readingTime: parseReadingTime(readTime),
      wordCount,
      tags: entry.data.tags,
      author: entry.data.author,
      excerpt: entry.data.excerpt,
      content: "",
      image: entry.data.image,
      featured: entry.data.featured,
    });
  }

  posts.sort(
    (a, b) => convertBrazilianDate(b.date).getTime() - convertBrazilianDate(a.date).getTime()
  );
  return posts;
}

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}
