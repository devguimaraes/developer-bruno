import { getCollection } from 'astro:content';
import { countWords, parseReadingTime } from './content';
import type { BlogPost } from '@/types/blog';

export type { BlogPost } from '@/types/blog';

export function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function convertBrazilianDate(dateStr: string): Date {
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

  const parts = dateStr.split(' ');
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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  const posts: BlogPost[] = [];

  for (const entry of entries) {
    const rawContent = entry.body ?? '';
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
      content: '',
      image: entry.data.image,
      featured: entry.data.featured,
    });
  }

  posts.sort(
    (a, b) => convertBrazilianDate(b.date).getTime() - convertBrazilianDate(a.date).getTime(),
  );
  return posts;
}

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
