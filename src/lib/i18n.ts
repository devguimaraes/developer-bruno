export type Locale = "pt" | "en";

export const defaultLocale: Locale = "pt";

export const locales: Locale[] = ["pt", "en"];

// Copy da Giro v2 (aprovada em 25/10/2026). Textos narrativos dos cases ficam nos dados dos projetos.
// Placeholders ({n}, {name}...) são preenchidos por t(locale, key, vars).
const ptDictionary = {
  // Global
  "global.signature_label": "Bruno Guimarães, início",
  "global.main_nav_label": "Principal",
  "menu.projects": "Projetos",
  "menu.process": "Processo",
  "menu.about": "Sobre",
  "menu.blog": "Blog",
  "menu.contact": "Contato",
  "menu.open": "Abrir menu",
  "menu.close": "Fechar menu",
  "language.group_label": "Idioma",
  "tabs.label": "Navegação",
  "tabs.home": "Início",
  "tabs.projects": "Projetos",
  "tabs.blog": "Blog",
  "tabs.contact": "Contato",
  "giro.menu_progress": "Abrir menu, {n}% lido",
  "footer.copyright": "© 2026 Bruno Guimarães",
  "footer.built_with": "Feito com Astro",
  "loader.label": "Carregando o site",
  "meta.home_title": "Bruno Guimarães · desenvolvedor front-end",
  "meta.home_description":
    "Desenvolvedor front-end especializado em React, Next.js, TypeScript e design systems. Interfaces rápidas, acessíveis e consistentes, do protótipo ao deploy.",
  "meta.case_title": "{project} · case de Bruno Guimarães",
  "meta.post_title": "{title} · blog de Bruno Guimarães",

  // Hero
  "hero.label": "// desenvolvedor front-end · design systems",
  "hero.title": "Interfaces com vida.",
  "hero.intro":
    "Construo interfaces em React, Next.js e Astro e crio os design systems que mantêm o produto consistente enquanto ele cresce. Do protótipo ao deploy, com tipos, testes e métricas.",
  "hero.cta_projects": "Ver projetos",
  "hero.cta_contact": "Falar comigo",
  "giro.label_state": "estado",
  "giro.label_position": "posição",
  "giro.label_spin": "giro",
  "giro.state.signature": "na assinatura",
  "giro.state.air": "no ar",
  "giro.state.bounce": "quicando",
  "giro.state.roll": "rolando",
  "giro.state.done": "pronto",
  "giro.state.jump": "pulando",
  "giro.state.idle": "repouso",
  "giro.jump_button": "Fazer o Giro pular",

  // Home · projetos
  "projects.label": "// projetos",
  "projects.title": "No ar.",
  "projects.intro":
    "Cinco projetos em produção. Em cada um: o problema, as decisões técnicas e o resultado.",
  "projects.card_link": "Ver case",

  // Home · processo
  "process.label": "// processo",
  "process.title": "Do escopo ao deploy.",
  "process.intro":
    "Quatro etapas, da conversa ao site no ar. Cada ferramenta aparece na etapa em que entra.",
  "process.diagram_label": "Processo em quatro etapas",
  "process.hint":
    "clique numa etapa para ver o detalhe (no celular: toque numa etapa para ver o detalhe)",
  "process.step_label": "etapa",
  "process.talk.name": "Conversa",
  "process.talk.body":
    "Entendo o negócio, quem vai usar e qual resultado o projeto precisa entregar.",
  "process.talk.deliverable": "escopo e prazo por escrito",
  "process.design.name": "Desenho",
  "process.design.body":
    "Defino tokens, componentes e os estados de cada tela antes de escrever código.",
  "process.design.deliverable": "protótipo e design system",
  "process.code.name": "Código",
  "process.code.body":
    "Construo sobre o design system, com componentes tipados, testes e revisão em cada entrega.",
  "process.code.deliverable": "código tipado, testado e documentado",
  "process.launch.name": "Entrega",
  "process.launch.body":
    "Publico com CI/CD, meço Core Web Vitals e acompanho o site depois do lançamento.",
  "process.launch.deliverable": "site no ar com métricas",
  "process.deliverable_label": "você recebe",
  "process.counter": "etapa 0{n} de 0{total}",
  "process.prev": "Etapa anterior",
  "process.next": "Próxima etapa",
  "process.autoplay.pause": "pausar",
  "process.autoplay.play": "reproduzir",
  "process.autoplay.replay": "ver de novo",
  "process.group.communication": "conversa",
  "process.group.organization": "organização",
  "process.group.screens": "telas e tokens",
  "process.group.exploration": "exploração",
  "process.group.foundation": "base",
  "process.group.interface": "interface e design system",
  "process.group.content": "conteúdo",
  "process.group.workflow": "fluxo",
  "process.group.hosting": "hospedagem",
  "process.group.quality": "qualidade",
  "process.group.metrics": "métricas",

  // Home · sobre
  "about.label": "// sobre",
  "about.title": "Bruno Guimarães",
  "about.bio_1":
    "Trabalho com front-end há 5 anos, no ponto em que design e engenharia se encontram.",
  "about.bio_2":
    "Crio e mantenho design systems: tokens, componentes e documentação que deixam o produto consistente e o time mais rápido. No código, uso React, TypeScript e Next.js com foco em performance, Core Web Vitals e acessibilidade, e mantenho testes automatizados e CI/CD em projetos com tráfego real.",
  "about.photo_alt": "Bruno Guimarães, de braços cruzados, sorrindo",
  "about.capability.development": "Front-end em React e TypeScript",
  "about.capability.apis": "Integração com APIs",
  "about.capability.deploy": "Deploy e CI/CD",
  "about.capability.a11y": "Acessibilidade e UX",
  "about.capability.practices": "Design systems e documentação",
  "about.capability.collaboration": "Colaboração com design e produto",

  // Home · blog e página do blog
  "posts.label": "// blog",
  "posts.title": "Notas de campo.",
  "posts.home_intro":
    "Front-end, arquitetura e performance, escrito a partir de projeto real. Os três posts mais recentes.",
  "posts.read_all": "Ver o blog",
  "posts.card_language_note": "",
  "posts.read_time": "{n} min de leitura",
  "posts.count": "{n} posts",
  "posts.filter.label": "Filtrar por categoria",

  // Home · contato
  "contact.label": "// contato",
  "contact.title": "Vamos conversar.",
  "contact.intro":
    "Projeto novo, redesign ou um design system para o seu time. Me conta o contexto e eu respondo pelo e-mail que você deixar.",
  "contact.form.label": "Formulário de contato",
  "contact.form.name_label": "nome",
  "contact.form.name_placeholder": "Como posso te chamar",
  "contact.form.email_label": "e-mail",
  "contact.form.email_placeholder": "voce@empresa.com",
  "contact.form.type_label": "tipo de projeto",
  "contact.form.type.website": "site",
  "contact.form.type.landing_page": "landing page",
  "contact.form.type.store": "loja",
  "contact.form.type.app": "sistema",
  "contact.form.type.other": "outro",
  "contact.form.message_label": "mensagem",
  "contact.form.message_placeholder": "O que é, para quem e qual o prazo",
  "contact.form.error.name": "Escreva seu nome.",
  "contact.form.error.email": "Escreva seu e-mail.",
  "contact.form.error.email_invalid": "Esse e-mail está incompleto. Confira o @ e o domínio.",
  "contact.form.error.message": "Escreva uma mensagem.",
  "contact.form.error.send_failed":
    "Não deu para enviar. Tente de novo ou escreva para o e-mail ao lado.",
  "contact.form.error.rate_limit": "Muitos envios seguidos. Espere alguns minutos e tente de novo.",
  "contact.form.submit": "Enviar mensagem",
  "contact.form.submitting": "Enviando",
  "contact.form.sent": "Enviado",
  "contact.form.success": "Recebi sua mensagem. A resposta vai para o e-mail que você deixou.",
  "contact.form.write_another": "Escrever outra",
  "contact.direct.region": "E-mail direto",
  "contact.direct.label": "// e-mail direto",
  "contact.direct.copy": "Copiar e-mail",
  "contact.direct.copied": "Copiado",
  "contact.direct.copy_error": "Não deu para copiar. Selecione o e-mail acima.",
  "contact.direct.copy_error_hint": "Selecione o e-mail acima.",
  "contact.social.github": "GitHub",
  "contact.social.linkedin": "LinkedIn",

  // E-mails do formulário (Bruno recebe em português)
  "email.contact.subject": "Contato pelo site: {name} · {type}",
  "email.contact.body":
    "Nome: {name} · E-mail: {email} · Tipo: {type} · Idioma do site: {language} · Mensagem: {message}",
  "email.reply.subject": "Recebi sua mensagem",
  "email.reply.body":
    "Oi. Recebi sua mensagem pelo devguimaraes.com.br e respondo por este e-mail. Se quiser acrescentar alguma coisa, é só responder. Bruno Guimarães",

  // Página de case (rótulos de UI)
  "case.page.back": "Projetos",
  "case.page.back_mobile": "Voltar para projetos",
  "case.page.facts.role": "papel",
  "case.page.facts.stack": "stack",
  "case.page.facts.live": "no ar",
  "case.page.facts.code": "código",
  "case.page.steps_label": "Etapas do case",
  "case.page.rail.context": "contexto",
  "case.page.rail.problem": "problema",
  "case.page.rail.solution": "solução",
  "case.page.rail.result": "resultado",
  "case.page.problem_list_label": "// o que o site precisava",
  "case.page.cta_live": "Ver o site no ar",
  "case.page.cta_code": "Código no GitHub",
  "case.page.next_label": "// próximo case",

  // Post
  "post.back": "Blog",
  "post.back_mobile": "Voltar para o blog",
  "post.kicker": "// blog · {category}",
  "post.toc_label": "// neste post",
  "post.progress": "{n}% lido",
  "post.progress_done": "lido até o fim",
  "post.code.copy_label": "Copiar o código de {file}",
  "post.code.copy": "Copiar",
  "post.code.copied": "Copiado",
  "post.code.copy_error": "Não deu para copiar",
  "post.code.copy_error_hint": "Selecione o código.",
  "post.link.copy": "Copiar link",
  "post.link.copied": "Link copiado",
  "post.link.copy_error": "Não deu para copiar",
  "post.link.copy_error_hint": "Copie o endereço da barra do navegador.",
  "post.end_mark": "// fim do post",
  "post.keep_reading": "// continue lendo",
  "post.language_note": "",

  // 404
  "notfound.label": "// erro 404",
  "notfound.title": "Essa página se perdeu.",
  "notfound.text": "O endereço que você abriu não existe ou mudou de lugar.",
  "notfound.address": "// endereço: {path}",
  "notfound.home_button": "Voltar ao início",
  "notfound.blog_button": "Ir para o blog",

  // Legado: ainda usado por componentes que não migraram para a v2 (valores inalterados)
  "blog.label": "// blog",
  "blog.heading": "Blog",
  "blog.description": "Artigos sobre programação, engenharia de software e tecnologia.",
  "blog.total_label": "posts",
  "blog.empty": "Nenhum post nessa categoria ainda.",
  "blog.load_more": "Carregar mais",
  "blog.remaining": "restantes",
  "blog.all_categories": "Todos",
  "blog.show_all": "Ver todos",

  // Home · outros sites no ar e fatos do sobre (issue #52)
  "outcomes.label": "// outros sites no ar",
  "outcomes.measured": "números medidos em cada projeto",
  "about.fact.experience_value": "5 anos",
  "about.fact.experience_label": "de front-end",
  "about.fact.education_value": "Senac",
  "about.fact.education_label": "Desenvolvimento de Sistemas Web",
  "about.fact.location_value": "Remoto",
  "about.fact.location_label": "base no Brasil",
} as const;

export type TranslationKey = keyof typeof ptDictionary;

// Tipado como Record<TranslationKey, string>: chave faltando ou sobrando em en quebra o typecheck.
const enDictionary: Record<TranslationKey, string> = {
  // Global
  "global.signature_label": "Bruno Guimarães, home",
  "global.main_nav_label": "Main",
  "menu.projects": "Projects",
  "menu.process": "Process",
  "menu.about": "About",
  "menu.blog": "Blog",
  "menu.contact": "Contact",
  "menu.open": "Open menu",
  "menu.close": "Close menu",
  "language.group_label": "Language",
  "tabs.label": "Navigation",
  "tabs.home": "Home",
  "tabs.projects": "Projects",
  "tabs.blog": "Blog",
  "tabs.contact": "Contact",
  "giro.menu_progress": "Open menu, {n}% read",
  "footer.copyright": "© 2026 Bruno Guimarães",
  "footer.built_with": "Built with Astro",
  "loader.label": "Loading the site",
  "meta.home_title": "Bruno Guimarães · front-end developer",
  "meta.home_description":
    "Front-end developer specialized in React, Next.js, TypeScript and design systems. Fast, accessible and consistent interfaces, from prototype to deploy.",
  "meta.case_title": "{project} · case study by Bruno Guimarães",
  "meta.post_title": "{title} · Bruno Guimarães's blog",

  // Hero
  "hero.label": "// front-end developer · design systems",
  "hero.title": "Interfaces that live.",
  "hero.intro":
    "I build interfaces in React, Next.js and Astro, and I create the design systems that keep a product consistent as it grows. From prototype to deploy, with types, tests and metrics.",
  "hero.cta_projects": "See projects",
  "hero.cta_contact": "Get in touch",
  "giro.label_state": "state",
  "giro.label_position": "position",
  "giro.label_spin": "spin",
  "giro.state.signature": "on the logo",
  "giro.state.air": "in the air",
  "giro.state.bounce": "bouncing",
  "giro.state.roll": "rolling",
  "giro.state.done": "done",
  "giro.state.jump": "jumping",
  "giro.state.idle": "idle",
  "giro.jump_button": "Make Giro jump",

  // Home · projects
  "projects.label": "// projects",
  "projects.title": "Live.",
  "projects.intro":
    "Five projects in production. For each one: the problem, the technical decisions and the result.",
  "projects.card_link": "View case study",

  // Home · process
  "process.label": "// process",
  "process.title": "Scope to deploy.",
  "process.intro":
    "Four stages, from the first talk to a live site. Each tool shows up at the stage where it comes in.",
  "process.diagram_label": "Process in four stages",
  "process.hint": "click a stage to see the details (on the phone: tap a stage to see the details)",
  "process.step_label": "stage",
  "process.talk.name": "Talk",
  "process.talk.body":
    "I learn the business, who will use it and what result the project has to deliver.",
  "process.talk.deliverable": "scope and timeline in writing",
  "process.design.name": "Design",
  "process.design.body":
    "I define tokens, components and every screen's states before writing code.",
  "process.design.deliverable": "a prototype and a design system",
  "process.code.name": "Code",
  "process.code.body":
    "I build on top of the design system, with typed components, tests and review on every delivery.",
  "process.code.deliverable": "typed, tested, documented code",
  "process.launch.name": "Launch",
  "process.launch.body":
    "I ship through CI/CD, measure Core Web Vitals and stay with the site after launch.",
  "process.launch.deliverable": "a live site with metrics",
  "process.deliverable_label": "you get",
  "process.counter": "stage 0{n} of 0{total}",
  "process.prev": "Previous stage",
  "process.next": "Next stage",
  "process.autoplay.pause": "pause",
  "process.autoplay.play": "play",
  "process.autoplay.replay": "watch again",
  "process.group.communication": "communication",
  "process.group.organization": "organization",
  "process.group.screens": "screens and tokens",
  "process.group.exploration": "exploration",
  "process.group.foundation": "foundation",
  "process.group.interface": "interface and design system",
  "process.group.content": "content",
  "process.group.workflow": "workflow",
  "process.group.hosting": "hosting",
  "process.group.quality": "quality",
  "process.group.metrics": "metrics",

  // Home · about
  "about.label": "// about",
  "about.title": "Bruno Guimarães",
  "about.bio_1": "I've worked in front-end for 5 years, where design and engineering meet.",
  "about.bio_2":
    "I create and maintain design systems: tokens, components and documentation that keep a product consistent and a team faster. In code, I use React, TypeScript and Next.js with a focus on performance, Core Web Vitals and accessibility, and I maintain automated tests and CI/CD on projects with real traffic.",
  "about.photo_alt": "Bruno Guimarães, arms crossed, smiling",
  "about.capability.development": "Front-end in React and TypeScript",
  "about.capability.apis": "API integration",
  "about.capability.deploy": "Deployment and CI/CD",
  "about.capability.a11y": "Accessibility and UX",
  "about.capability.practices": "Design systems and documentation",
  "about.capability.collaboration": "Working with design and product",

  // Home · blog and blog page
  "posts.label": "// blog",
  "posts.title": "Field notes.",
  "posts.home_intro":
    "Front-end, architecture and performance, written from real projects. The three latest posts.",
  "posts.read_all": "Read the blog",
  "posts.card_language_note": "In Portuguese",
  "posts.read_time": "{n} min read",
  "posts.count": "{n} posts",
  "posts.filter.label": "Filter by category",

  // Home · contact
  "contact.label": "// contact",
  "contact.title": "Let's talk.",
  "contact.intro":
    "A new project, a redesign or a design system for your team. Tell me the context and I'll reply to the email you leave.",
  "contact.form.label": "Contact form",
  "contact.form.name_label": "name",
  "contact.form.name_placeholder": "What should I call you",
  "contact.form.email_label": "email",
  "contact.form.email_placeholder": "you@company.com",
  "contact.form.type_label": "project type",
  "contact.form.type.website": "website",
  "contact.form.type.landing_page": "landing page",
  "contact.form.type.store": "online store",
  "contact.form.type.app": "web app",
  "contact.form.type.other": "other",
  "contact.form.message_label": "message",
  "contact.form.message_placeholder": "What it is, who it's for and the deadline",
  "contact.form.error.name": "Enter your name.",
  "contact.form.error.email": "Enter your email.",
  "contact.form.error.email_invalid": "This email looks incomplete. Check the @ and the domain.",
  "contact.form.error.message": "Write a message.",
  "contact.form.error.send_failed":
    "It didn't go through. Try again or write to the email next to the form.",
  "contact.form.error.rate_limit": "Too many messages in a row. Wait a few minutes and try again.",
  "contact.form.submit": "Send message",
  "contact.form.submitting": "Sending",
  "contact.form.sent": "Sent",
  "contact.form.success": "Got your message. I'll reply to the email you left.",
  "contact.form.write_another": "Write another",
  "contact.direct.region": "Direct email",
  "contact.direct.label": "// direct email",
  "contact.direct.copy": "Copy email",
  "contact.direct.copied": "Copied",
  "contact.direct.copy_error": "Couldn't copy. Select the email above.",
  "contact.direct.copy_error_hint": "Select the email above.",
  "contact.social.github": "GitHub",
  "contact.social.linkedin": "LinkedIn",

  // Contact form emails (Bruno receives them in Portuguese, so en repeats pt)
  "email.contact.subject": "Contato pelo site: {name} · {type}",
  "email.contact.body":
    "Nome: {name} · E-mail: {email} · Tipo: {type} · Idioma do site: {language} · Mensagem: {message}",
  "email.reply.subject": "I got your message",
  "email.reply.body":
    "Hi. I got your message from devguimaraes.com.br and I'll reply to this email. If you want to add anything, just reply. Bruno Guimarães",

  // Case page (UI labels)
  "case.page.back": "Projects",
  "case.page.back_mobile": "Back to projects",
  "case.page.facts.role": "role",
  "case.page.facts.stack": "stack",
  "case.page.facts.live": "live",
  "case.page.facts.code": "code",
  "case.page.steps_label": "Case study sections",
  "case.page.rail.context": "context",
  "case.page.rail.problem": "problem",
  "case.page.rail.solution": "solution",
  "case.page.rail.result": "result",
  "case.page.problem_list_label": "// what the site needed",
  "case.page.cta_live": "Visit the live site",
  "case.page.cta_code": "Code on GitHub",
  "case.page.next_label": "// next case study",

  // Post
  "post.back": "Blog",
  "post.back_mobile": "Back to the blog",
  "post.kicker": "// blog · {category}",
  "post.toc_label": "// in this post",
  "post.progress": "{n}% read",
  "post.progress_done": "read to the end",
  "post.code.copy_label": "Copy the code from {file}",
  "post.code.copy": "Copy",
  "post.code.copied": "Copied",
  "post.code.copy_error": "Couldn't copy",
  "post.code.copy_error_hint": "Select the code.",
  "post.link.copy": "Copy link",
  "post.link.copied": "Link copied",
  "post.link.copy_error": "Couldn't copy",
  "post.link.copy_error_hint": "Copy the address from the browser bar.",
  "post.end_mark": "// end of post",
  "post.keep_reading": "// keep reading",
  "post.language_note": "This post is in Portuguese.",

  // 404
  "notfound.label": "// error 404",
  "notfound.title": "This page got lost.",
  "notfound.text": "The address you opened doesn't exist or has moved.",
  "notfound.address": "// address: {path}",
  "notfound.home_button": "Back to home",
  "notfound.blog_button": "Go to the blog",

  // Legacy: still used by components not yet migrated to v2 (values unchanged)
  "blog.label": "// blog",
  "blog.heading": "Blog",
  "blog.description": "Articles on programming, software engineering and technology.",
  "blog.total_label": "posts",
  "blog.empty": "No posts in this category yet.",
  "blog.load_more": "Load more",
  "blog.remaining": "remaining",
  "blog.all_categories": "All",
  "blog.show_all": "See all",

  // Home · outros sites no ar e fatos do sobre (issue #52)
  "outcomes.label": "// other live sites",
  "outcomes.measured": "numbers measured on each project",
  "about.fact.experience_value": "5 years",
  "about.fact.experience_label": "of front-end",
  "about.fact.education_value": "Senac",
  "about.fact.education_label": "Web Systems Development",
  "about.fact.location_value": "Remote",
  "about.fact.location_label": "based in Brazil",
};

export const dictionary = {
  pt: ptDictionary,
  en: enDictionary,
} as const;

export function t(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const template: string = dictionary[locale]?.[key] ?? dictionary.pt[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    Object.hasOwn(vars, name) ? String(vars[name]) : placeholder
  );
}

// Data no formato "22 abr 2026" (pt) ou "Apr 22, 2026" (en). Usa UTC para não deslocar o dia.
export function formatDate(locale: Locale, date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  };
  if (locale === "en") {
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  const parts = new Intl.DateTimeFormat("pt-BR", options).formatToParts(date);
  const partOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? "";
  // pt-BR abrevia com ponto ("abr.", "set."); o copy não usa ponto.
  return `${partOf("day")} ${partOf("month").replace(".", "")} ${partOf("year")}`;
}

export function getHtmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "pt-BR";
}

export function getOgLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "pt_BR";
}

export function applyLocaleDocumentMetadata(locale: Locale): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = getHtmlLang(locale);

  const ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
  if (ogLocale) {
    ogLocale.content = getOgLocale(locale);
  }
}

// ─── Reactive locale store (works across React roots) ───

type Listener = (locale: Locale) => void;

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored && (stored === "pt" || stored === "en")) return stored;
  return defaultLocale;
}

let currentLocale: Locale = defaultLocale;
const listeners = new Set<Listener>();

// Only run on client
if (typeof window !== "undefined") {
  currentLocale = getInitialLocale();
  applyLocaleDocumentMetadata(currentLocale);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (locale === currentLocale) {
    applyLocaleDocumentMetadata(locale);
    return;
  }
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
    applyLocaleDocumentMetadata(locale);
  }
  listeners.forEach(fn => {
    fn(locale);
  });
}

export function subscribeToLocale(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
