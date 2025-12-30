import { useRouteSEO } from '@/hooks/useRouteSEO';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useBlogPost } from '@/hooks/use-blog-posts';

/**
 * Componente que gerencia SEO baseado na rota atual
 * Substitui o SEO hardcodado do App.tsx e consolida funcionalidade do BlogSEO
 */
export const RouteSEO: React.FC = () => {
  const location = useLocation();

  // Get blog post data if on blog post page
  const slug = location.pathname.startsWith('/blog/') && location.pathname.split('/').length > 2
    ? location.pathname.split('/')[2]
    : '';

  const { post } = useBlogPost(slug);

  // Get route-specific SEO data
  // Fix: Converte null para undefined para satisfazer a tipagem do hook
  const routeSEO = useRouteSEO(post || undefined);

  return <SEO {...routeSEO} />;
};

export default RouteSEO;