import { siteConfig } from '@/config/site';
import type { StructuredDataSchema } from '@/types/seo';

function buildPersonSchema(): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    alternateName: 'Bruno Guimarães',
    jobTitle: 'Desenvolvedor Front-End & Engenheiro de UI',
    description: siteConfig.description,
    url: siteConfig.domain,
    image: `${siteConfig.domain}${siteConfig.avatar}`,
    sameAs: [siteConfig.github, siteConfig.linkedin],
    knowsAbout: siteConfig.seo.keywords.slice(0, 10),
    knowsLanguage: ['Português', 'English'],
    nationality: {
      '@type': 'Country',
      name: 'Brasil',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressRegion: 'RJ',
      addressLocality: 'Rio de Janeiro',
      postalCode: '20000-000',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.brazilianMarket?.phoneNumber,
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: ['Português', 'English'],
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Bruno Guimarães Desenvolvimento Web',
      url: siteConfig.domain,
    },
  };
}

function buildWebsiteSchema(): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    alternateName: 'Portfolio Bruno Guimarães',
    description: siteConfig.description,
    url: siteConfig.domain,
    image: `${siteConfig.domain}${siteConfig.seo.image}`,
    inLanguage: siteConfig.seo.locale,
    isAccessibleForFree: true,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.title,
    },
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    about: siteConfig.seo.keywords.slice(0, 5).join(', '),
    genre: ['Desenvolvimento Web', 'Portfólio', 'Tecnologia'],
    audience: {
      '@type': 'Audience',
      audienceType: 'Empresas em busca de desenvolvedores front-end no Brasil',
    },
  };
}

function buildProfessionalServiceSchema(): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Desenvolvimento Front-End e UI',
    description:
      'Serviços especializados de desenvolvimento web front-end, interfaces modernas e otimização de performance',
    url: `${siteConfig.domain}#servicos`,
    provider: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.domain,
    },
    areaServed:
      siteConfig.brazilianMarket?.serviceAreas.map((area) => ({
        '@type': 'Place',
        name: area,
        addressCountry: 'BR',
      })) ?? [],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços de Desenvolvimento Web',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desenvolvimento React/Next.js',
            description:
              'Aplicações web modernas com React e Next.js otimizadas para mercado brasileiro',
          },
          priceCurrency: siteConfig.brazilianMarket?.currency,
          price: 'A combinar',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'UI/UX Design',
            description: 'Design de interfaces com foco em experiência do usuário',
          },
          priceCurrency: siteConfig.brazilianMarket?.currency,
          price: 'A combinar',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Performance Optimization',
            description: 'Otimização de performance para aplicações web brasileiras',
          },
          priceCurrency: siteConfig.brazilianMarket?.currency,
          price: 'A combinar',
        },
      ],
    },
    languagesSupported: siteConfig.brazilianMarket?.language,
    availableChannel: [
      {
        '@type': 'ServiceChannel',
        name: 'LinkedIn',
        url: siteConfig.linkedin,
      },
      {
        '@type': 'ServiceChannel',
        name: 'Email',
        url: `mailto:${siteConfig.email}`,
      },
    ],
  };
}

function buildOrganizationSchema(): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bruno Guimarães Desenvolvimento Web',
    alternateName: 'Bruno Guimarães Front-End',
    description: siteConfig.description,
    url: siteConfig.domain,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.domain}${siteConfig.avatar}`,
      width: 400,
      height: 400,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.brazilianMarket?.phoneNumber,
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: ['Português'],
    },
    sameAs: [siteConfig.github, siteConfig.linkedin],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressRegion: 'RJ',
      addressLocality: 'Rio de Janeiro',
    },
    foundingDate: '2020-01-01',
    founder: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    employee: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  };
}

function buildBreadcrumbSchema(): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: siteConfig.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: `${siteConfig.domain}/`,
      },
    ],
  };
}

export function getDefaultStructuredDataSchemas(): StructuredDataSchema[] {
  return [
    buildPersonSchema(),
    buildWebsiteSchema(),
    buildProfessionalServiceSchema(),
    buildOrganizationSchema(),
    buildBreadcrumbSchema(),
  ];
}
