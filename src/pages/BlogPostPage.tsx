import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogPost } from '../hooks/use-blog-posts';
import { getAllBlogPosts, BlogPost } from '../utils/blog';
import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostNavigation,
  BlogPostLoading,
  BlogPostNotFound,
  BlogPostBackButton
} from '../components/blog';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading } = useBlogPost(slug || '');
  const [adjacentPosts, setAdjacentPosts] = useState<{
    previous: BlogPost | null;
    next: BlogPost | null;
  }>({ previous: null, next: null });

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
      return;
    }

    const loadAdjacentPosts = async () => {
      try {
        const allPosts = await getAllBlogPosts();
        const currentIndex = allPosts.findIndex(p => p.slug === slug);

        setAdjacentPosts({
          previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
          next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
        });
      } catch (error) {
        console.error('Erro ao carregar posts adjacentes:', error);
      }
    };

    if (post) {
      loadAdjacentPosts();
    }
  }, [slug, post]);

  if (loading) {
    return <BlogPostLoading />;
  }

  if (!post) {
    return <BlogPostNotFound />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BlogPostBackButton />
        <BlogPostHeader post={post} />
        <BlogPostContent content={post.content} />
        <BlogPostNavigation
          previous={adjacentPosts.previous}
          next={adjacentPosts.next}
        />
      </div>
    </motion.div>
  );
};

export default BlogPostPage;