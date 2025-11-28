import { useRouteSEO } from '@/hooks/useRouteSEO';
import { useBlogPost } from '@/hooks/use-blog-posts';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';

interface BlogSEOProps {
  slug?: string;
}

export const BlogSEO: React.FC<BlogSEOProps> = ({ slug }) => {
  const location = useLocation();
  const { post } = useBlogPost(slug || "");

  // Get route-specific SEO data
  const routeSEO = useRouteSEO(post);

  return <SEO {...routeSEO} />;
};

export default BlogSEO;