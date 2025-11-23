import { Link } from 'react-router-dom';

export function BlogPostNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
        <Link to="/blog" className="text-primary hover:underline">
          Voltar para o blog
        </Link>
      </div>
    </div>
  );
}