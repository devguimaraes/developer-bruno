import type { SiteConfig, ContactData } from "@/types";

/**
 * Site configuration and metadata
 */
export const siteConfig: SiteConfig = {
  title: "Bruno Guimarães",

  description:
    "Desenvolvedor Front-End especializado em React, TypeScript e interfaces modernas. Criação de Sites e Softwares de alta performance.",
  author: "Bruno Guimarães",
  email: "bc.guimaraes@outlook.com",
  location: "Rio de Janeiro, Brasil",
  domain: "https://devguimaraes.com.br",
  github: "https://github.com/devguimaraes",
  linkedin: "https://www.linkedin.com/in/bcguimaraes/",
  avatar: "/avatar.webp",
  cv: {
    url: "/cv-bruno-guimaraes.pdf",
    filename: "Bruno-Guimaraes-CV.pdf",
  },
  seo: {
    keywords: [
      // Brazilian Market Keywords
      "desenvolvedor Web",
      "programador React",
      "desenvolvedor Web Rio de Janeiro",
      "desenvolvedor TypeScript",
      "portfolio desenvolvedor web",
      "Bruno Guimarães front-end",
      "Bruno Guimarães Desenvolvedor Web",
      "desenvolvedor web São Paulo",
      "programador JavaScript ",
      "front-end developer",
      "desenvolvedor React ",
      "portfolio desenvolvimento web",

      // Technical Keywords
      "desenvolvedor front-end",
      "react developer",
      "typescript",
      "next.js",
      "ui developer",
      "web development",
      "bruno guimarães",
      "front-end rio de janeiro",

      // Location-specific
      "desenvolvedor Rio de Janeiro",
      "programador Brasil",
      "front-end developer Brasil",
      "web developer Rio de Janeiro",
      "desenvolvedor web Brasil",
    ],
    image: "/og-image.webp",
    siteName: "Bruno Guimarães Portfolio",
    locale: "pt_BR",
    region: "BR",
  },

  // Performance Budget Configuration for Brazilian Market
  performanceBudget: {
    javascript: 300000, // 300KB for Brazilian mobile networks
    images: 500000, // 500KB for images
    css: 50000, // 50KB for CSS
    total: 1000000, // 1MB total budget
  },

  // Brazilian Market Configuration
  brazilianMarket: {
    country: "Brasil",
    language: "Português",
    currency: "BRL",
    locale: "pt_BR",
    region: "BR",
    timezone: "America/Sao_Paulo",
    serviceAreas: [
      "Rio de Janeiro",
      "São Paulo",
      "Brasília",
      "Belo Horizonte",
      "Porto Alegre",
      "Salvador",
      "Recife",
      "Fortaleza",
    ],
  },
};

/**
 * Contact section configuration
 */
export const contactData: ContactData = {
  title: "Vamos Conversar",
  description:
    "Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades de fazer parte da sua visão. Entre em contato!",
  email: "bc.guimaraes@outlook.com",
  socialLinks: [
    {
      id: "linkedin",
      href: "https://www.linkedin.com/in/bcguimaraes/",
      label: "LinkedIn",
      username: "bcguimaraes",
    },
    {
      id: "github",
      href: "https://github.com/devguimaraes",
      label: "GitHub",
      username: "devguimaraes",
    },
    {
      id: "instagram",
      href: "https://www.instagram.com/brunoguimraes/",
      label: "Instagram",
      username: "dev.guimaraes",
    },
    {
      id: "x",
      href: "https://x.com/devguimraes/",
      label: "X",
      username: "devguimraes",
    },
    {
      id: "whatsapp",
      href: "https://wa.me/5521969715247?text=Ol%C3%A1%20Bruno%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!",
      label: "WhatsApp",
      username: "+5521969715247",
    },
  ],
};

/**
 * Footer configuration
 */
export const footerData = {
  copyright: `© ${new Date().getFullYear()} ${siteConfig.author}. Todos os direitos reservados.`,
  builtWith: [
    { name: "Astro", url: "https://astro.build" },
    { name: "React", url: "https://react.dev" },
    { name: "TypeScript", url: "https://typescriptlang.org" },
    { name: "Tailwind CSS", url: "https://tailwindcss.com" },
  ],
};
