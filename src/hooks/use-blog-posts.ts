import { useState, useEffect, useCallback } from 'react';
import type { BlogPost } from '@/types/blog';
import { getRecentPosts, getBlogPost, invalidateBlogCache } from '@/utils/blog';

// Hook para posts recentes (usado na página principal)
export function useRecentPosts(limit: number = 3) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const recentPosts = await getRecentPosts(limit);
      setPosts(recentPosts);
    } catch (error) {
      console.error('Erro ao carregar posts recentes:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadPosts();

    // Hot-reload listener
    const handleHotReload = () => {
      console.log('🔄 Recent posts hot-reloaded');
      invalidateBlogCache();
      loadPosts();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('blog-cache-invalidated', handleHotReload);
      return () => window.removeEventListener('blog-cache-invalidated', handleHotReload);
    }
  }, [loadPosts]);

  return { posts, loading, refetch: loadPosts };
}

// Hook para post individual (usado na página de post)
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPost = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const blogPost = await getBlogPost(slug);
      setPost(blogPost);
    } catch (error) {
      console.error('Erro ao carregar post:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return { post, loading, refetch: loadPost };
}
