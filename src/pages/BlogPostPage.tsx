import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { useBlogPost } from "../hooks/use-blog-posts";
import { getAllBlogPosts } from "../utils/blog";
import {
  BlogPostHeader,
  BlogPostContent,
  BlogPostNavigation,
  BlogPostNotFound,
  BlogPostBackButton,
} from "../components/blog";
import { BlogPostLoadingSkeleton } from "../components/blog/BlogPostLoadingSkeleton";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post } = useBlogPost(slug || "");
  const [adjacentPosts, setAdjacentPosts] = useState<{
    previous: BlogPost | null;
    next: BlogPost | null;
  }>({ previous: null, next: null });

  useEffect(() => {
    if (!slug) {
      navigate("/blog");
      return;
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const loadAdjacentPosts = async () => {
      try {
        const allPosts = await getAllBlogPosts();
        const currentIndex = allPosts.findIndex((p) => p.slug === slug);

        setAdjacentPosts({
          previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
          next:
            currentIndex < allPosts.length - 1
              ? allPosts[currentIndex + 1]
              : null,
        });
      } catch (error) {
        console.error("Erro ao carregar posts adjacentes:", error);
      }
    };

    if (post) {
      loadAdjacentPosts();
    }
  }, [slug, post, navigate]);

  if (!post) {
    return <BlogPostLoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="container mx-auto px-4 py-28 max-w-4xl">
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
