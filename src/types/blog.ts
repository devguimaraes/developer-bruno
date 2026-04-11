export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  excerpt: string;
  content: string;
  image?: string;
  featured?: boolean;
  readingTime?: number;
  wordCount?: number;
}
