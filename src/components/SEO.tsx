import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";
import type { SEOProps, OpenGraphProps, TwitterCardProps } from "@/types/seo";

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  locale = "pt_BR",
  author,
  publishedDate,
  modifiedDate,
  noindex = false,
  nofollow = false,
  articleMeta,
}) => {
  // Build full title using consistent template
  const fullTitle = title
    ? siteConfig.titleTemplate?.replace("%s", title) ||
      `${title} | ${siteConfig.title}`
    : siteConfig.title;

  // Use provided description or fallback to site description
  const metaDescription = description || siteConfig.description;

  // Build keywords (combine provided keywords with site defaults)
  const allKeywords = keywords
    ? [...keywords, ...siteConfig.seo.keywords]
    : siteConfig.seo.keywords;

  // Build absolute URL
  const absoluteUrl = url ? `${siteConfig.domain}${url}` : siteConfig.domain;

  // Build absolute image URL
  const absoluteImage = image
    ? `${siteConfig.domain}${image}`
    : siteConfig.seo.image;

  // Build robots meta tag
  const robots =
    noindex && nofollow
      ? "noindex,nofollow"
      : noindex
      ? "noindex"
      : nofollow
      ? "nofollow"
      : "index,follow";

  // Open Graph props
  const openGraph: OpenGraphProps = {
    title: fullTitle,
    description: metaDescription,
    type,
    url: absoluteUrl,
    image: absoluteImage,
    siteName: siteConfig.title,
    locale,
  };

  // Twitter Card props
  const twitterCard: TwitterCardProps = {
    card: "summary_large_image",
    title: fullTitle,
    description: metaDescription,
    image: absoluteImage,
    site: "@brunoguimaraes",
    creator: "@brunoguimaraes",
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta name="author" content={author || siteConfig.author} />
      <meta name="robots" content={robots} />

      {/* Language and Region for Brazilian Market */}
      <html lang={locale} />
      <meta name="geo.region" content="BR-RJ" />
      <meta name="geo.placename" content="Rio de Janeiro" />
      <meta name="ICBM" content="-22.9068,-43.1729" />

      {/* Canonical URL */}
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={openGraph.title} />
      <meta property="og:description" content={openGraph.description} />
      <meta property="og:type" content={openGraph.type} />
      <meta property="og:url" content={openGraph.url} />
      <meta property="og:image" content={openGraph.image} />
      <meta property="og:site_name" content={openGraph.siteName} />
      <meta property="og:locale" content={openGraph.locale} />

      {/* Additional Open Graph for Brazilian Market */}
      <meta property="og:locale:alternate" content="pt_BR" />
      <meta property="og:country_name" content="Brasil" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard.card} />
      <meta name="twitter:title" content={twitterCard.title} />
      <meta name="twitter:description" content={twitterCard.description} />
      <meta name="twitter:image" content={twitterCard.image} />
      <meta name="twitter:site" content={twitterCard.site} />
      <meta name="twitter:creator" content={twitterCard.creator} />

      {/* Structured Data for Brazilian Market */}
      <script type="application/ld+json">
        {JSON.stringify(
          type === "article"
            ? {
                // Article schema for blog posts
                "@context": "https://schema.org",
                "@type": "Article",
                headline: title || siteConfig.title,
                description: metaDescription,
                url: absoluteUrl,
                inLanguage: locale,
                author: {
                  "@type": "Person",
                  name: author || siteConfig.author,
                  url: siteConfig.domain,
                },
                publisher: {
                  "@type": "Person",
                  name: siteConfig.author,
                  url: siteConfig.domain,
                },
                datePublished: publishedDate,
                dateModified: modifiedDate || publishedDate,
                image: absoluteImage,
                articleSection: articleMeta?.section || "Desenvolvimento Web",
                keywords:
                  articleMeta?.tags?.join(", ") || allKeywords.join(", "),
                wordCount: articleMeta?.wordCount,
                timeRequired: articleMeta?.readingTime
                  ? `PT${articleMeta.readingTime}M`
                  : undefined,
                isPartOf: {
                  "@type": "WebSite",
                  name: siteConfig.title,
                  url: siteConfig.domain,
                  inLanguage: locale,
                },
              }
            : {
                // WebPage schema for other content
                "@context": "https://schema.org",
                "@type": type === "profile" ? "Person" : "WebPage",
                name: title || siteConfig.title,
                description: metaDescription,
                url: absoluteUrl,
                inLanguage: locale,
                isPartOf: {
                  "@type": "WebSite",
                  name: siteConfig.title,
                  url: siteConfig.domain,
                  inLanguage: locale,
                },
                author: {
                  "@type": "Person",
                  name: siteConfig.author,
                  url: siteConfig.domain,
                },
                datePublished: publishedDate,
                dateModified: modifiedDate || publishedDate,
                image: absoluteImage,
                publisher: {
                  "@type": "Person",
                  name: siteConfig.author,
                  url: siteConfig.domain,
                },
              }
        )}
      </script>

      {/* Additional SEO for Brazilian Market */}
      <meta name="language" content="Português" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="7 days" />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEO;
