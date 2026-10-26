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
  "language.switcher": "idioma · pt · en",
  "language.options_label": "Português / English",
  "language.group_label": "Idioma",
  "reading.progress_label": "Progresso da leitura",
  "tabs.label": "Navegação",
  "tabs.home": "Início",
  "tabs.projects": "Projetos",
  "tabs.blog": "Blog",
  "tabs.contact": "Contato",
  "giro.menu_progress": "Abrir menu, {n}% lido",
  "footer.sections_label": "Seções",
  "footer.copyright": "© 2026 Bruno Guimarães",
  "footer.built_with": "Feito com Astro",
  "loader.label": "Carregando o site",
  "meta.home_title": "Bruno Guimarães · desenvolvedor front-end",
  "meta.home_description":
    "Desenvolvedor front-end no Rio de Janeiro. Sites, lojas e sistemas em React, Next.js e Astro.",
  "meta.case_title": "{project} · case de Bruno Guimarães",
  "meta.post_title": "{title} · blog de Bruno Guimarães",

  // Hero
  "hero.label": "// desenvolvedor front-end · rio de janeiro",
  "hero.title": "Interfaces com vida.",
  "hero.intro":
    "Sites, lojas e sistemas em React, Next.js e Astro. Desenho os estados, escrevo o código e acompanho o site depois que ele vai ao ar.",
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
  "giro.state.error": "erro",
  "giro.state.loading": "carregando",
  "giro.jump_button": "Fazer o Giro pular",

  // Home · projetos
  "projects.label": "// projetos",
  "projects.title": "Projetos",
  "projects.intro": "Cinco cases reais, cada um com o problema, a solução e o resultado.",
  "projects.card_link": "Ver case",

  // Home · processo
  "process.label": "// processo",
  "process.title": "Processo",
  "process.intro": "Uma linha da conversa à entrega. Cada ferramenta sai da etapa em que é usada.",
  "process.diagram_label": "Processo em quatro etapas",
  "process.hint":
    "clique numa etapa para ver o detalhe (no celular: toque numa etapa para ver o detalhe)",
  "process.step_label": "etapa",
  "process.talk.name": "Conversa",
  "process.talk.body": "Entendo o negócio, quem vai usar e o que precisa sair do papel.",
  "process.talk.deliverable": "escopo e prazo por escrito",
  "process.design.name": "Desenho",
  "process.design.body": "Desenho as telas e os estados antes de qualquer linha de código.",
  "process.design.deliverable": "protótipo navegável",
  "process.code.name": "Código",
  "process.code.body": "Construo com componentes, tipos e testes, e reviso cada entrega.",
  "process.code.deliverable": "código revisado e documentado",
  "process.launch.name": "Entrega",
  "process.launch.body": "Publico, meço e acompanho o site depois que ele vai ao ar.",
  "process.launch.deliverable": "site no ar com métricas",
  "process.deliverable_label": "você recebe",

  // Home · sobre
  "about.label": "// sobre",
  "about.title": "Sobre",
  "about.bio_1":
    "Sou formado em Desenvolvimento de Sistemas Web pelo Senac e trabalho com front-end há 5 anos.",
  "about.bio_2":
    "Trabalho com React, TypeScript e arquitetura server-side, guiado por princípios de engenharia de software e design com intenção. Otimizo performance e Core Web Vitals em projetos com tráfego real e mantenho testes automatizados e pipelines de CI/CD.",
  "about.photo_alt": "Bruno Guimarães, de braços cruzados, sorrindo",
  "about.capability.development": "Desenvolvimento front-end",
  "about.capability.apis": "APIs",
  "about.capability.deploy": "Deploy e CI/CD",
  "about.capability.a11y": "Acessibilidade e UX",
  "about.capability.practices": "Boas práticas e processo",
  "about.capability.collaboration": "Colaboração com produto",

  // Home · blog e página do blog
  "posts.label": "// blog",
  "posts.title": "Blog",
  "posts.home_intro": "Os três posts mais recentes.",
  "posts.read_all": "Ver o blog",
  "posts.card_language_note": "",
  "posts.read_time": "{n} min de leitura",
  "posts.description":
    "Artigos técnicos e reflexões sobre programação, engenharia de software e tecnologia.",
  "posts.count": "{n} posts",
  "posts.filter.all": "Todos",
  "posts.filter.label": "Filtrar por categoria",
  "posts.empty": "Nenhum post nessa categoria ainda.",
  "posts.empty.see_all": "Ver todos",
  "posts.load_more": "Carregar mais",
  "posts.load_more_remaining": "{n} restantes",

  // Home · contato
  "contact.label": "// contato",
  "contact.title": "Contato",
  "contact.intro": "Me conta o que você quer construir. Respondo pelo e-mail que você deixar.",
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
  "contact.form.message_placeholder": "O que é, para quem e para quando",
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
    "Oi, {name}. Recebi sua mensagem pelo devguimaraes.com.br e respondo por este e-mail. Se quiser acrescentar alguma coisa, é só responder. Bruno Guimarães",
  "email.reply.copy_label": "Sua mensagem",

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
  "hero.line1": "BRUNO",
  "hero.line2": "GUIMARÃES",
  "hero.badge":
    "Desenvolvedor Front-End — Especialista em TypeScript, Next.js, React e Interfaces para sistemas e aplicações web.",
  "hero.established": "// RIO_DE_JANEIRO",
  "hero.description":
    "Desenvolvimento front-end com foco em performance, arquitetura e experiência do usuário.",
  "hero.scroll": "// EXPLORE",
  "footer.location": "Rio de Janeiro, BR",
  "footer.built_by": "Feito por Bruno Guimarães",
  "cta.ready": "Tem um projeto em mente?",
  "cta.lets_talk": "BORA CONVERSAR",
  "nav.projetos": "PROJETOS",
  "nav.posts": "POSTS",
  "nav.sobre": "SOBRE",
  "nav.contato": "CONTATO",
  "nav.menu_open": "Abrir menu",
  "blog.label": "// blog",
  "blog.heading": "Blog",
  "blog.description": "Artigos sobre programação, engenharia de software e tecnologia.",
  "blog.total_label": "posts",
  "blog.read_label": "Ler →",
  "blog.empty": "Nenhum post nessa categoria ainda.",
  "blog.load_more": "Carregar mais",
  "blog.remaining": "restantes",
  "blog.all_categories": "Todos",
  "blog.show_all": "Ver todos",
  "blog.back_to_blog": "← VOLTAR AO BLOG",
  "blog.back_title": "Voltar para a listagem do blog",
  "blog.next_post": "PRÓXIMO POST →",
  "blog.min_read": "de leitura",
  "blog.author_role": "Engenheiro Front-End",
  "notfound.error_code": "// ERROR_404",
  "notfound.route_status": "Route not found",
  "notfound.page_status": "// PAGE_STATUS",
  "notfound.lost_signal": "LOST_SIGNAL",
  "notfound.heading_line1": "PAGE",
  "notfound.heading_line2": "NOT_FOUND",
  "notfound.description": "A rota que você tentou abrir não existe ou foi movida.",
  "notfound.path_label": "PATH:",
  "notfound.recovery_label": "// RECOVERY_OPTIONS",
  "notfound.back_home": "Voltar ao início",
  "notfound.go_blog": "Ir para o blog",
  "notfound.author": "Bruno Guimarães",
  "notfound.author_role": "Front-end systems",
  "notfound.location": "Rio de Janeiro, BR",
  "notfound.coords": "POS: 22.9068 S / 43.1729 W",
  "notfound.version": "VER: 4.0.4_NOT_FOUND",
  "case.back": "// VOLTAR_AOS_PROJETOS",
  "case.context": "// CONTEXT",
  "case.problem": "O PROBLEMA",
  "case.stack": "// STACK",
  "case.technologies": "TECNOLOGIAS",
  "case.impact": "// IMPACT",
  "case.results": "RESULTADOS",
  "case.related": "// RELATED_POSTS",
  "case.read_more": "LEIA MAIS",
  "case.next": "// NEXT_STEPS",
  "case.visit_live": "Visitar site ao vivo",
  "case.work_together": "Vamos trabalhar juntos",
  "case.scroll": "SCROLL",

  // Home · outros sites no ar e fatos do sobre (issue #52)
  "outcomes.label": "// outros sites no ar",
  "outcomes.measured": "números medidos em cada projeto",
  "about.fact.experience_value": "5 anos",
  "about.fact.experience_label": "de front-end",
  "about.fact.education_value": "Senac",
  "about.fact.education_label": "Desenvolvimento de Sistemas Web",
  "about.fact.location_value": "Rio de Janeiro",
  "about.fact.location_label": "Brasil",
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
  "language.switcher": "language · pt · en",
  "language.options_label": "Português / English",
  "language.group_label": "Language",
  "reading.progress_label": "Reading progress",
  "tabs.label": "Navigation",
  "tabs.home": "Home",
  "tabs.projects": "Projects",
  "tabs.blog": "Blog",
  "tabs.contact": "Contact",
  "giro.menu_progress": "Open menu, {n}% read",
  "footer.sections_label": "Sections",
  "footer.copyright": "© 2026 Bruno Guimarães",
  "footer.built_with": "Built with Astro",
  "loader.label": "Loading the site",
  "meta.home_title": "Bruno Guimarães · front-end developer",
  "meta.home_description":
    "Front-end developer in Rio de Janeiro. Websites, online stores and web apps in React, Next.js and Astro.",
  "meta.case_title": "{project} · case study by Bruno Guimarães",
  "meta.post_title": "{title} · Bruno Guimarães's blog",

  // Hero
  "hero.label": "// front-end developer · rio de janeiro",
  "hero.title": "Interfaces that live.",
  "hero.intro":
    "Websites, online stores and web apps in React, Next.js and Astro. I design the states, write the code and stay with the site after it goes live.",
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
  "giro.state.error": "error",
  "giro.state.loading": "loading",
  "giro.jump_button": "Make Giro jump",

  // Home · projects
  "projects.label": "// projects",
  "projects.title": "Projects",
  "projects.intro": "Five real projects, each with the problem, the solution and the result.",
  "projects.card_link": "View case study",

  // Home · process
  "process.label": "// process",
  "process.title": "Process",
  "process.intro":
    "One line from the first talk to launch. Each tool branches off the stage where I use it.",
  "process.diagram_label": "Process in four stages",
  "process.hint": "click a stage to see the details (on the phone: tap a stage to see the details)",
  "process.step_label": "stage",
  "process.talk.name": "Talk",
  "process.talk.body": "I learn the business, who will use it and what has to get built.",
  "process.talk.deliverable": "scope and timeline in writing",
  "process.design.name": "Design",
  "process.design.body": "I design the screens and their states before writing any code.",
  "process.design.deliverable": "a clickable prototype",
  "process.code.name": "Code",
  "process.code.body": "I build with components, types and tests, and review every delivery.",
  "process.code.deliverable": "reviewed, documented code",
  "process.launch.name": "Launch",
  "process.launch.body": "I publish, measure and stay with the site after it goes live.",
  "process.launch.deliverable": "a live site with metrics",
  "process.deliverable_label": "you get",

  // Home · about
  "about.label": "// about",
  "about.title": "About",
  "about.bio_1":
    "I have a degree in Web Systems Development from Senac and 5 years of experience in front-end.",
  "about.bio_2":
    "I work with React, TypeScript and server-side architecture, guided by software engineering principles and intentional design. I optimize performance and Core Web Vitals on projects with real traffic, and I maintain automated tests and CI/CD pipelines.",
  "about.photo_alt": "Bruno Guimarães, arms crossed, smiling",
  "about.capability.development": "Front-end development",
  "about.capability.apis": "APIs",
  "about.capability.deploy": "Deployment and CI/CD",
  "about.capability.a11y": "Accessibility and UX",
  "about.capability.practices": "Engineering practices",
  "about.capability.collaboration": "Product collaboration",

  // Home · blog and blog page
  "posts.label": "// blog",
  "posts.title": "Blog",
  "posts.home_intro": "The three latest posts.",
  "posts.read_all": "Read the blog",
  "posts.card_language_note": "In Portuguese",
  "posts.read_time": "{n} min read",
  "posts.description":
    "Technical articles and notes on programming, software engineering and technology.",
  "posts.count": "{n} posts",
  "posts.filter.all": "All",
  "posts.filter.label": "Filter by category",
  "posts.empty": "No posts in this category yet.",
  "posts.empty.see_all": "See all",
  "posts.load_more": "Load more",
  "posts.load_more_remaining": "{n} left",

  // Home · contact
  "contact.label": "// contact",
  "contact.title": "Contact",
  "contact.intro": "Tell me what you want to build. I'll reply to the email you leave.",
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
  "contact.form.message_placeholder": "What it is, who it's for and when you need it",
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
    "Hi {name}. I got your message from devguimaraes.com.br and I'll reply to this email. If you want to add anything, just reply. Bruno Guimarães",
  "email.reply.copy_label": "Your message",

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
  "hero.line1": "BRUNO",
  "hero.line2": "GUIMARÃES",
  "hero.badge":
    "Front-End Developer — Specialist in TypeScript, Next.js, React and Interfaces for web systems and applications.",
  "hero.established": "// RIO_DE_JANEIRO",
  "hero.description":
    "Front-end development focused on performance, architecture, and user experience.",
  "hero.scroll": "// EXPLORE",
  "footer.location": "Rio de Janeiro, BR",
  "footer.built_by": "Built by Bruno Guimarães",
  "cta.ready": "Have a project in mind?",
  "cta.lets_talk": "LET'S TALK",
  "nav.projetos": "PROJECTS",
  "nav.posts": "POSTS",
  "nav.sobre": "ABOUT",
  "nav.contato": "CONTACT",
  "nav.menu_open": "Open menu",
  "blog.label": "// blog",
  "blog.heading": "Blog",
  "blog.description": "Articles on programming, software engineering and technology.",
  "blog.total_label": "posts",
  "blog.read_label": "Read →",
  "blog.empty": "No posts in this category yet.",
  "blog.load_more": "Load more",
  "blog.remaining": "remaining",
  "blog.all_categories": "All",
  "blog.show_all": "See all",
  "blog.back_to_blog": "← BACK TO BLOG",
  "blog.back_title": "Back to blog listing",
  "blog.next_post": "NEXT POST →",
  "blog.min_read": "min read",
  "blog.author_role": "Front-End Engineer",
  "notfound.error_code": "// ERROR_404",
  "notfound.route_status": "Route not found",
  "notfound.page_status": "// PAGE_STATUS",
  "notfound.lost_signal": "LOST_SIGNAL",
  "notfound.heading_line1": "PAGE",
  "notfound.heading_line2": "NOT_FOUND",
  "notfound.description": "The route you tried to access does not exist or has been moved.",
  "notfound.path_label": "PATH:",
  "notfound.recovery_label": "// RECOVERY_OPTIONS",
  "notfound.back_home": "Back to home",
  "notfound.go_blog": "Go to blog",
  "notfound.author": "Bruno Guimarães",
  "notfound.author_role": "Front-end systems",
  "notfound.location": "Rio de Janeiro, BR",
  "notfound.coords": "POS: 22.9068 S / 43.1729 W",
  "notfound.version": "VER: 4.0.4_NOT_FOUND",
  "case.back": "// BACK_TO_PROJECTS",
  "case.context": "// CONTEXT",
  "case.problem": "THE PROBLEM",
  "case.stack": "// STACK",
  "case.technologies": "TECHNOLOGIES",
  "case.impact": "// IMPACT",
  "case.results": "RESULTS",
  "case.related": "// RELATED_POSTS",
  "case.read_more": "READ MORE",
  "case.next": "// NEXT_STEPS",
  "case.visit_live": "Visit live site",
  "case.work_together": "Let's work together",
  "case.scroll": "SCROLL",

  // Home · outros sites no ar e fatos do sobre (issue #52)
  "outcomes.label": "// other live sites",
  "outcomes.measured": "numbers measured on each project",
  "about.fact.experience_value": "5 years",
  "about.fact.experience_label": "of front-end",
  "about.fact.education_value": "Senac",
  "about.fact.education_label": "Web Systems Development",
  "about.fact.location_value": "Rio de Janeiro",
  "about.fact.location_label": "Brazil",
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
