import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { siteConfig } from '@/config/site';
import { BlogPost } from '@/utils/blog';

interface RouteSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  type: 'website' | 'article' | 'blog';
  image?: string;
  articleMeta?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    section?: string;
  };
}

export const useRouteSEO = (blogPost?: BlogPost): RouteSEOProps => {
  const location = useLocation();

  return useMemo(() => {
    const { pathname } = location;
    const baseUrl = siteConfig.domain;

    // SEO Default
    const defaultSEO: RouteSEOProps = {
      title: siteConfig.title,
      description: siteConfig.description,
      keywords: [
        'desenvolvedor front-end Brasil',
        'programador React Rio de Janeiro',
        'desenvolvedor TypeScript Brasil'
      ],
      url: '/',
      type: 'website',
      image: siteConfig.seo.image
    };

    // SEO para página inicial
    if (pathname === '/') {
      return {
        title: siteConfig.title,
        description: siteConfig.description,
        keywords: siteConfig.seo.keywords,
        url: '/',
        type: 'website',
        image: siteConfig.seo.image
      };
    }

    // SEO para página de blog
    if (pathname === '/blog') {
      return {
        title: 'Blog | Bruno Guimarães - Desenvolvedor Front-End',
        description: 'Artigos sobre React, TypeScript, performance e desenvolvimento web para mercado brasileiro.',
        keywords: [
          'blog React Brasil',
          'artigos TypeScript',
          'desenvolvimento web Rio de Janeiro',
          'performance front-end'
        ],
        url: '/blog',
        type: 'website',
        image: siteConfig.seo.image
      };
    }

    // SEO para posts individuais do blog
    if (pathname.startsWith('/blog/') && blogPost) {
      const baseUrlFull = `${baseUrl}${pathname}`;

      return {
        title: `${blogPost.title} | Bruno Guimarães`,
        description: blogPost.excerpt || blogPost.description || siteConfig.description,
        keywords: [
          ...(blogPost.tags || []),
          'Bruno Guimarães',
          'desenvolvedor front-end'
        ],
        url: pathname,
        type: 'article',
        image: blogPost.image || siteConfig.seo.image,
        publishedDate: blogPost.date,
        modifiedDate: blogPost.lastModified || blogPost.date,
        author: 'Bruno Guimarães',
        articleMeta: {
          tags: blogPost.tags || [],
          section: 'Desenvolvimento Web',
          readingTime: blogPost.readingTime,
          wordCount: blogPost.wordCount
        }
      };
    }

    // SEO para página 404
    if (pathname.includes('404') || pathname === '*') {
      return {
        title: 'Página Não Encontrada | Bruno Guimarães',
        description: 'A página que você está procurando não foi encontrada. Volte para o início e conheça meu trabalho.',
        keywords: ['erro 404', 'página não encontrada', 'Bruno Guimarães'],
        url: pathname,
        type: 'website',
        image: siteConfig.seo.image
      };
    }

    // SEO para outras páginas (como skills, projects, etc.)
    // Mapeia sections para SEO específico
    if (pathname.includes('#skills') || pathname.includes('/skills')) {
      return {
        title: 'Skills | Bruno Guimarães - Desenvolvedor Front-End',
        description: 'Minhas competências técnicas: React, TypeScript, Tailwind CSS, Next.js e mais. Conheça minhas habilidades.',
        keywords: ['skills front-end', 'competências React', 'habilidades TypeScript'],
        url: pathname,
        type: 'website',
        image: siteConfig.seo.image
      };
    }

    if (pathname.includes('#projects') || pathname.includes('/projects')) {
      return {
        title: 'Projetos | Bruno Guimarães - Desenvolvedor Front-End',
        description: 'Conheça meus projetos de desenvolvimento front-end. Aplicações web modernas com React e TypeScript.',
        keywords: ['projetos front-end', 'portfólio React', 'desenvolvimento web Brasil'],
        url: pathname,
        type: 'website',
        image: siteConfig.seo.image
      };
    }

    // Fallback para qualquer outra rota
    return {
      ...defaultSEO,
      url: pathname
    };
  }, [location.pathname, blogPost?.slug, blogPost?.title]);
};