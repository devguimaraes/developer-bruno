import { useRouteSEO } from '@/hooks/useRouteSEO';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';

/**
 * Componente que gerencia SEO baseado na rota atual
 * Substitui o SEO hardcodado do App.tsx
 */
export const RouteSEO: React.FC = () => {
  const location = useLocation();

  // Get route-specific SEO data
  const routeSEO = useRouteSEO();

  return <SEO {...routeSEO} />;
};

export default RouteSEO;