/**
 * Dados dos projetos (fonte única).
 * Textos da "Copy da Giro" (fase 5). Todo texto de interface tem pt e en.
 * Todos os cases têm as mesmas chaves (ausente = null ou []), e os tipos são inferidos daqui.
 */

/**
 * Cases da home, na ordem em que aparecem.
 * pendingConfirmation lista os campos de um case ainda sem confirmação do dono (vazio = tudo confirmado).
 */
export const homeCases = [
  {
    id: "estudio-entre",
    slug: "estudio-entre",
    title: "Estúdio Entre",
    kicker: {
      pt: "Hub cultural · Méier, RJ",
      en: "Cultural hub · Méier, Rio de Janeiro",
    },
    summary: {
      pt: "Plataforma cultural com eventos, loja, acervo e conteúdo, gerida no Sanity e integrada a um CRM.",
      en: "A cultural platform with events, a shop, a book collection and content, managed in Sanity and connected to a CRM.",
    },
    label: {
      pt: "// case · hub cultural · méier, rj",
      en: "// case study · cultural hub · méier, rio de janeiro",
    },
    role: {
      pt: "Desenvolvimento full-stack e UI/UX",
      en: "Full-stack development and UI/UX",
    },
    stack: ["Astro", "React", "Sanity", "Tailwind CSS", "Vercel"],
    live: "https://www.estudioentre.com.br/",
    github: "https://github.com/devguimaraes/estudio-entre",
    image: "/capa-estudio-entre.webp",
    bannerImage: "/capa-estudio-entre.webp",
    tags: ["cultura", "hub", "independente", "e-commerce", "cms"],
    relatedPosts: [],
    pendingConfirmation: [],
    context: {
      title: {
        pt: "Uma mãe, uma filha e um sonho.",
        en: "A mother, a daughter and a dream.",
      },
      text: {
        pt: "O Estúdio Entre nasceu do sonho de mãe e filha: criar um hub cultural independente no Méier, Rio de Janeiro, onde a palavra vira encontro. O espaço une biblioterapia, oficinas, palestras, um estúdio de produção audiovisual e um sebo literário.",
        en: "Estúdio Entre began as a mother and daughter's dream: an independent cultural hub in Méier, Rio de Janeiro, where words turn into gatherings. The space brings together bibliotherapy, workshops, talks, an audiovisual production studio and a used bookstore.",
      },
    },
    problem: {
      title: {
        pt: "Cada pilar com presença própria, conversando com o todo.",
        en: "Each pillar with a space of its own, all speaking as one.",
      },
      text: {
        pt: "O desafio era traduzir essa essência numa plataforma coesa. E a equipe precisava mudar o site sem depender de um desenvolvedor.",
        en: "The challenge was to turn that spirit into one coherent platform. And the team had to be able to change the site without a developer.",
      },
      needs: {
        pt: [
          "Ser gerido pela própria equipe",
          "Agendar eventos",
          "Vender pelo catálogo de produtos",
          "Levar a conversa para o WhatsApp",
        ],
        en: [
          "Be run by the team itself",
          "Schedule events",
          "Sell from a product catalog",
          "Take the conversation to WhatsApp",
        ],
      },
    },
    solution: {
      title: {
        pt: "Conteúdo no Sanity, site estático em Astro.",
        en: "Content in Sanity, a static site in Astro.",
      },
      text: {
        pt: "A equipe publica eventos, exposições, galeria e produtos no Sanity, um CMS headless que também se integra a um CRM. O Astro gera o site com ilhas em React só onde há interação, a Vercel hospeda, e o contato segue pelo WhatsApp.",
        en: "The team publishes events, exhibitions, the gallery and products in Sanity, a headless CMS that also connects to a CRM. Astro builds the site with React islands only where there is interaction, Vercel hosts it, and contact goes through WhatsApp.",
      },
      diagram: {
        label: {
          pt: "Arquitetura: a equipe edita no Sanity, que se integra a um CRM; o Astro gera o site com ilhas em React; a Vercel hospeda; quem visita fala pelo WhatsApp.",
          en: "Architecture: the team edits in Sanity, which connects to a CRM; Astro builds the site with React islands; Vercel hosts it; visitors get in touch on WhatsApp.",
        },
        stations: [
          { role: { pt: "quem edita", en: "who edits" }, name: { pt: "Equipe", en: "Team" } },
          { role: { pt: "conteúdo", en: "content" }, name: { pt: "Sanity", en: "Sanity" } },
          { role: { pt: "site estático", en: "static site" }, name: { pt: "Astro", en: "Astro" } },
          { role: { pt: "hospedagem", en: "hosting" }, name: { pt: "Vercel", en: "Vercel" } },
          {
            role: { pt: "quem visita", en: "who visits" },
            name: { pt: "Visitante", en: "Visitor" },
          },
        ],
      },
    },
    result: {
      title: {
        pt: "A equipe cuida do site sozinha.",
        en: "The team runs the site on its own.",
      },
      text: null,
      items: {
        pt: [
          "Gestão autônoma de eventos, exposições, galeria de fotos e produtos.",
          "Build estático em Astro, com ilhas interativas em React.",
          "Integração com o WhatsApp e com um CRM.",
          "Presença digital que fortaleceu o hub como referência cultural na Zona Norte carioca.",
        ],
        en: [
          "The team manages events, exhibitions, the photo gallery and products.",
          "Static build in Astro, with interactive React islands.",
          "WhatsApp and CRM integration.",
          "An online presence that made the hub a cultural reference in Rio's North Zone.",
        ],
      },
    },
    screenshots: [
      {
        src: "/estudio-entre-home.webp",
        alt: { pt: "Página inicial do Estúdio Entre", en: "Estúdio Entre home page" },
        caption: null,
      },
      {
        src: "/estudio-entre-celular.webp",
        alt: {
          pt: "Página inicial do Estúdio Entre · no celular",
          en: "Estúdio Entre home page · on a phone",
        },
        caption: { pt: "celular", en: "phone" },
      },
      {
        src: "/estudio-entre-loja.webp",
        alt: {
          pt: "Loja do Estúdio Entre com livros e produtos",
          en: "Estúdio Entre shop with books and products",
        },
        caption: {
          pt: "a loja, gerida pela equipe no Sanity",
          en: "the shop, run by the team in Sanity",
        },
      },
    ],
    nextCase: "atlas-marine-solutions",
  },
  {
    id: "atlas-marine-solutions",
    slug: "atlas-marine-solutions",
    title: "Atlas Marine Solutions",
    kicker: {
      pt: "Agência marítima · EUA e Brasil",
      en: "Ship agency · USA and Brazil",
    },
    summary: {
      pt: "Site em quatro idiomas para serviços portuários em mais de 20 portos de 14 países.",
      en: "A site in four languages for port services in more than 20 ports across 14 countries.",
    },
    label: {
      pt: "// case · agência marítima · eua e brasil",
      en: "// case study · ship agency · usa and brazil",
    },
    role: {
      pt: "Desenvolvimento full-stack e DevOps",
      en: "Full-stack development and DevOps",
    },
    stack: ["Next.js", "React", "Tailwind CSS"],
    live: "https://atlasmarinesolutions.com/",
    github: null,
    image: "/atlas-marine-solutions.webp",
    bannerImage: null,
    tags: [],
    relatedPosts: [],
    pendingConfirmation: [],
    context: {
      title: {
        pt: "Apoio portuário para navios de qualquer bandeira.",
        en: "Port support for vessels of any flag.",
      },
      text: {
        pt: "A Atlas Marine Solutions é uma agência marítima com bases na Flórida e no Rio de Janeiro. Ela coordena a escala de um navio da chegada à saída, com dez serviços, do agenciamento e abastecimento à troca de tripulação e ao despacho aduaneiro.",
        en: "Atlas Marine Solutions is a ship agency with bases in Florida and Rio de Janeiro. It runs a vessel's port call from arrival to departure, with ten services, from ship agency and bunkering to crew change and customs clearance.",
      },
    },
    problem: {
      title: {
        pt: "Um site institucional, editorial e minimalista.",
        en: "An institutional site, editorial and minimal.",
      },
      text: {
        pt: "A Atlas pediu um site institucional com perfil editorial e minimalista. Ele precisava falar com armadores e operadores de vários países, mostrar os dez serviços e deixar claro onde a Atlas atende.",
        en: "Atlas asked for an institutional site with an editorial, minimal feel. It had to speak to shipowners and operators in many countries, show the ten services and make clear where Atlas operates.",
      },
      needs: null,
    },
    solution: {
      title: {
        pt: "Quatro idiomas e um mapa de cobertura.",
        en: "Four languages and a coverage map.",
      },
      text: {
        pt: "Cuidei do projeto do briefing ao ar: desenvolvimento, deploy e configuração de DNS. O site em Next.js e Tailwind CSS sai em inglês, português, espanhol e francês. Um mapa mostra os portos atendidos, e o contato leva à mesa de operações, que atende 24 horas.",
        en: "I handled the project from brief to launch: development, deploy and DNS setup. The Next.js and Tailwind CSS site comes in English, Portuguese, Spanish and French. A map shows the ports covered, and contact goes to the operations desk, open 24/7.",
      },
      diagram: null,
    },
    // Sem número de resultado: o site tem menos de um mês no ar.
    result: {
      title: null,
      text: {
        pt: "Site novo, no ar há menos de um mês, em quatro idiomas, com mais de 20 portos em 14 países.",
        en: "A new site, live for less than a month, in four languages, covering more than 20 ports in 14 countries.",
      },
      items: null,
    },
    screenshots: [],
    nextCase: "movies-bremen",
  },
  {
    id: "movies-bremen",
    slug: "movies-bremen",
    title: "Movies Bremen",
    kicker: {
      pt: "Cinema e casa de eventos · Bremen, Alemanha",
      en: "Cinema and event house · Bremen, Germany",
    },
    summary: {
      pt: "Plataforma em alemão e inglês para um cinema premium, com regras de negócio complexas.",
      en: "A German and English platform for a premium cinema, with complex business rules.",
    },
    label: {
      pt: "// case · cinema e casa de eventos · bremen, alemanha",
      en: "// case study · cinema and event house · bremen, germany",
    },
    role: {
      pt: "Desenvolvimento full-stack e UI/UX",
      en: "Full-stack development and UI/UX",
    },
    stack: ["Next.js", "React", "Tailwind CSS"],
    live: "https://www.moviesbremen.com/",
    github: null,
    image: "/movies-bremen.webp",
    bannerImage: "/banner-movies-event-house-bremen.webp",
    tags: ["entretenimento", "premium", "internacional", "adult"],
    relatedPosts: ["react-19-server-components", "typescript-performance"],
    pendingConfirmation: [],
    context: {
      title: {
        pt: "Um cinema premium em Bremen.",
        en: "A premium cinema in Bremen.",
      },
      text: {
        pt: "A Movies Event House, em Bremen, na Alemanha, é um cinema adulto premium, com sex shop e cabines privativas. Ela precisava de uma plataforma digital moderna, em alemão e inglês.",
        en: "Movies Event House, in Bremen, Germany, is a premium adult cinema with a sex shop and private booths. It needed a modern digital platform in German and English.",
      },
    },
    problem: {
      title: {
        pt: "Discrição e apelo visual na mesma tela.",
        en: "Discretion and visual appeal on the same screen.",
      },
      text: {
        pt: "O site tinha que ser discreto e sofisticado ao mesmo tempo, apresentar cada serviço com clareza e dar conta de regras de negócio complexas.",
        en: "The site had to be discreet and refined at once, present each service clearly and handle complex business rules.",
      },
      needs: null,
    },
    solution: {
      title: {
        pt: "Next.js com navegação em dois idiomas.",
        en: "Next.js with navigation in two languages.",
      },
      text: {
        pt: "Construí a plataforma em Next.js e Tailwind CSS, com navegação simples em alemão e inglês e uma arquitetura de informação que separa cada serviço.",
        en: "I built the platform in Next.js and Tailwind CSS, with simple navigation in German and English and an information architecture that gives each service its own place.",
      },
      diagram: null,
    },
    result: {
      title: null,
      text: {
        pt: "Plataforma multilíngue no ar para o público europeu, com baixa taxa de rejeição e mais tráfego orgânico local.",
        en: "A multilingual platform live for a European audience, with a low bounce rate and more local organic traffic.",
      },
      items: null,
    },
    screenshots: [],
    nextCase: "agencia-multi-br",
  },
  {
    id: "agencia-multi-br",
    slug: "agencia-multi-br",
    title: "Agência Multi BR",
    kicker: {
      pt: "Agência digital 360º",
      en: "Full-service digital agency",
    },
    summary: {
      pt: "Site institucional focado em conversão, com Next.js otimizado para Core Web Vitals.",
      en: "A conversion-focused company site, with Next.js tuned for Core Web Vitals.",
    },
    label: {
      pt: "// case · agência digital 360º",
      en: "// case study · full-service digital agency",
    },
    role: {
      pt: "Liderança de front-end e UI/UX",
      en: "Front-end lead and UI/UX",
    },
    stack: ["React", "Next.js", "Tailwind CSS"],
    live: "https://www.agenciamultibr.com/",
    github: null,
    image: "/agencia-multi-br.webp",
    bannerImage: null,
    tags: ["marketing", "web-design", "seo", "branding"],
    relatedPosts: ["engenharia-interface-2026", "react-server-components"],
    pendingConfirmation: [],
    context: {
      title: {
        pt: "Uma agência que precisava se mostrar.",
        en: "An agency that had to show what it does.",
      },
      text: {
        pt: "A Agência Multi BR é uma agência de marketing digital 360º. Ela precisava de um site institucional à altura dessa posição.",
        en: "Agência Multi BR is a full-service digital marketing agency. It needed a company site that matched that position.",
      },
    },
    problem: {
      title: {
        pt: "Captar clientes e provar a técnica.",
        en: "Win clients and prove the craft.",
      },
      text: {
        pt: "O site tinha que passar profissionalismo, criatividade e resultados, captar clientes e mostrar a capacidade técnica da própria agência.",
        en: "The site had to convey professionalism, creativity and results, win clients and show the agency's own technical skill.",
      },
      needs: null,
    },
    solution: {
      title: {
        pt: "Next.js otimizado para Core Web Vitals.",
        en: "Next.js tuned for Core Web Vitals.",
      },
      text: {
        pt: "Um site focado em conversão, em Next.js, otimizado para Core Web Vitals e SEO.",
        en: "A conversion-focused site in Next.js, tuned for Core Web Vitals and SEO.",
      },
      diagram: null,
    },
    result: {
      title: null,
      text: {
        pt: "Site responsivo que explica os serviços com clareza e trouxe mais leads orgânicos.",
        en: "A responsive site that explains the services clearly and brought in more organic leads.",
      },
      items: null,
    },
    screenshots: [],
    nextCase: "danila-rizo-palmieri",
  },
  {
    id: "danila-rizo-palmieri",
    slug: "danila-rizo-palmieri",
    title: "Danila Rizo Palmieri",
    kicker: {
      pt: "RH e internacionalização · Brasil e EUA",
      en: "HR and international expansion · Brazil and USA",
    },
    summary: {
      pt: "Site da consultoria de RH que leva empresas do Brasil para os EUA.",
      en: "The site of an HR consultancy that takes Brazilian companies to the USA.",
    },
    label: {
      pt: "// case · rh e internacionalização · brasil e eua",
      en: "// case study · hr and international expansion · brazil and usa",
    },
    role: {
      pt: "Desenvolvimento web e design",
      en: "Web development and design",
    },
    stack: ["WordPress", "PHP", "SEO"],
    live: "https://www.danilapalmieri.com/",
    github: null,
    image: "/banner-danila-rizo.webp",
    bannerImage: "/banner-danila-rizo.webp",
    tags: ["rh", "internacionalização", "business", "premium"],
    relatedPosts: ["engenharia-interface-2026"],
    pendingConfirmation: [],
    context: {
      title: {
        pt: "Do Brasil para os EUA.",
        en: "From Brazil to the USA.",
      },
      text: {
        pt: "Danila Rizo Palmieri é CEO da Connect Solutions e trabalha com RH e internacionalização de empresas que querem sair do Brasil para os EUA.",
        en: "Danila Rizo Palmieri is the CEO of Connect Solutions and works in HR and international expansion for companies moving from Brazil to the USA.",
      },
    },
    problem: {
      title: {
        pt: "Confiança para o mercado executivo.",
        en: "Trust for an executive audience.",
      },
      text: {
        pt: "O site precisava passar sofisticação e confiança e ajudar a encontrar clientes que querem levar a operação para os EUA.",
        en: "The site had to convey refinement and trust, and help find clients who want to take their business to the USA.",
      },
      needs: null,
    },
    solution: {
      title: {
        pt: "A consultoria no centro.",
        en: "The consultancy at the center.",
      },
      text: {
        pt: "Em WordPress, com uma estrutura de informação que coloca a consultoria e a experiência técnica na frente.",
        en: "Built in WordPress, with an information structure that puts the consultancy and its expertise first.",
      },
      diagram: null,
    },
    result: {
      title: null,
      text: {
        pt: "O site virou a principal ferramenta de prospecção e trouxe leads mais qualificados para o mercado global.",
        en: "The site became the main prospecting tool and brought in better-qualified leads for the global market.",
      },
      items: null,
    },
    screenshots: [],
    nextCase: "estudio-entre",
  },
] as const;

export type Project = (typeof homeCases)[number];

/**
 * Sites no ar com número medido (fora dos cases).
 */
export const outcomeSites = [
  {
    id: "engerod",
    title: "Engerod Engenharia",
    live: "https://engerod.com.br/",
    summary: {
      pt: "−30% na taxa de rejeição depois do redesign · WordPress · acessibilidade e performance",
      en: "−30% bounce rate after the redesign · WordPress · accessibility and performance",
    },
  },
  {
    id: "semogrj",
    title: "SEMOGRJ",
    live: "https://semogrj.com.br/",
    summary: {
      pt: "+40% de contatos de novos clientes internacionais · WordPress · site multilíngue",
      en: "+40% contacts from new international clients · WordPress · multilingual site",
    },
  },
  {
    id: "luis-felipe-pereira",
    title: "Luis Felipe Pereira",
    live: "https://luisfelipepereira.com.br/",
    summary: {
      pt: "3x mais rápido para carregar que o site anterior · WordPress · galeria em WebP com lazy loading",
      en: "3x faster to load than the previous site · WordPress · WebP gallery with lazy loading",
    },
  },
] as const;

export type OutcomeSite = (typeof outcomeSites)[number];
