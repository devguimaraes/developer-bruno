export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  readingTime?: number;
  tags: string[];
  author: string;
  excerpt: string;
  description?: string;
  content: string;
  image?: string;
  featured?: boolean;
  lastModified?: string;
  wordCount?: number;
}

export interface BlogFrontmatter {
  title?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  author?: string;
  excerpt?: string;
  image?: string;
  featured?: boolean;
}
