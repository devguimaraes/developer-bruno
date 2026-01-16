import type { Experience } from '@/types';

/**
 * Professional experience data
 */
export const experiences: readonly Experience[] = [
  {
    id: 'pixel-pro-technologies',
    year: '2023 - Atual',
    role: 'Front-End Developer',
    company: 'Pixel Pro Technologies',
    description:
      'Desenvolvimento de aplicações web modernas com React, TypeScript e Tailwind CSS ou WordPress. Colaboração com designers e equipes back-end para entregar produtos digitais de alta qualidade e performance.',
    achievements: [
      'Desenvolvimento de 30+ projetos de sites e landing pages para clientes diversos',
      'Implementação de CI/CD com GitHub Actions para deployments automatizados',
      'Migração bem-sucedida de projetos legados para versões mais atuais do Next.js',
      'Otimização de performance resultando em melhoria de 40% nos Core Web Vitals',
      'Implementação de design systems reutilizáveis para acelerar desenvolvimento',
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GitHub Actions'],
    location: 'Remoto',
    type: 'full-time',
  },
  {
    id: 'agencia-multi-br',
    year: '2022 - Atual',
    role: 'Front-End Developer & WordPress',
    company: 'Agência Multi BR',
    description:
      'Atuação em agência de marketing digital com foco em resultados mensuráveis para clientes de diversos segmentos. Desenvolvimento de soluções web completas com foco em conversão e SEO.',
    achievements: [
      'Desenvolvimento frontend de sites institucionais e landing pages conversivas',
      'Otimização de SEO para campanhas de Google Ads e Meta Ads',
      'Implementação de design responsivo e otimização de performance móvel',
      'Gestão de perfis Google Meu Negócio e indexação no Search Console',
      'Integração com ferramentas de analytics e marketing automation',
      'WordPress, Elementor Pro, Google Ads, Meta Ads, GA4, Hotjar',
    ],
    tech: ['WordPress', 'Elementor', 'SEO', 'Google Ads', 'Analytics'],
    location: 'Rio de Janeiro, Brasil',
    type: 'part-time',
  },
  {
    id: 'solution-seg',
    year: '2020 - 2022',
    role: 'Gerente de Suporte Técnico',
    company: 'Solution Seg',
    description:
      'Gestão de equipe técnica e projetos de infraestrutura de TI. Foco em resolução de problemas complexos, liderança de equipe e implementação de soluções tecnológicas para clientes corporativos.',
    achievements: [
      'Gestão de equipe de 8 técnicos de suporte e coordenação de chamados técnicos',
      'Implantação e manutenção de softwares empresariais e redes de computadores',
      'Gerenciamento de projetos técnicos com cronogramas e entregas definidas',
      'Desenvolvimento de habilidades de liderança e comunicação técnica',
      'Redução de 35% no tempo de resolução de problemas através de otimização de processos',
      'Implementação de sistemas de monitoramento proativo e automação de tarefas',
    ],
    tech: ['Gestão de TI', 'Liderança', 'Infraestrutura', 'Redes', 'Automação'],
    location: 'Rio de Janeiro, Brasil',
    type: 'full-time',
  },
] as const;

/**
 * Get experience by ID
 */
export const getExperienceById = (id: string): Experience | undefined => {
  return experiences.find(exp => exp.id === id);
};

/**
 * Get current experiences (ongoing)
 */
export const getCurrentExperiences = (): readonly Experience[] => {
  return experiences.filter(exp => exp.year.includes('Atual'));
};

/**
 * Get past experiences
 */
export const getPastExperiences = (): readonly Experience[] => {
  return experiences.filter(exp => !exp.year.includes('Atual'));
};

/**
 * Get experiences by company type
 */
export const getExperiencesByType = (type: Experience['type']): readonly Experience[] => {
  return experiences.filter(exp => exp.type === type);
};

/**
 * Get all unique companies worked with
 */
export const getAllCompanies = (): readonly string[] => {
  return experiences.map(exp => exp.company);
};

/**
 * Get total years of experience
 */
export const getTotalYearsOfExperience = (): number => {
  // Simple calculation based on date ranges
  const currentYear = new Date().getFullYear();
  const startYear = 2020; // From first experience
  return currentYear - startYear;
};

/**
 * Get all skills mentioned across experiences
 */
export const getExperienceSkills = (): readonly string[] => {
  const allAchievements = experiences.flatMap(exp => exp.achievements);
  const techKeywords = new Set<string>();

  allAchievements.forEach(achievement => {
    // Extract common tech keywords - simplified regex to avoid escaping issues
    const commonTechKeywords = [
      'React', 'Next.js', 'TypeScript', 'WordPress', 'JavaScript', 'CSS', 'HTML',
      'Tailwind', 'Node.js', 'PHP', 'MySQL', 'MongoDB', 'Docker', 'AWS', 'Vercel',
      'Git', 'GitHub', 'SEO', 'GA4', 'API', 'REST', 'GraphQL', 'Agile', 'Scrum',
      'CI/CD', 'Figma', 'Adobe', 'Sketch', 'Linux', 'Windows', 'Mac', 'iOS', 'Android',
      'Firebase', 'Supabase', 'Prisma', 'PostgreSQL', 'Redis', 'Nginx', 'Apache',
      'WebSockets', 'PWA', 'Service Worker', 'CORS', 'OAuth', 'JWT', 'RESTful',
      'Microservices', 'Serverless', 'Cloudflare', 'DigitalOcean', 'Heroku', 'Netlify',
      'Contentful', 'Strapi', 'Sanity', 'Headless', 'CMS', 'E-commerce', 'Stripe',
      'PayPal', 'Mercado Pago', 'Hotjar', 'Mixpanel', 'Segment', 'Mailchimp', 'SendGrid',
      'Twilio', 'WhatsApp', 'Chatbot', 'AI', 'Machine Learning', 'Python', 'Java',
      'C#', '.NET', 'Ruby', 'Rails', 'Django', 'Flask', 'Laravel', 'Symfony',
      'Vue.js', 'Angular', 'Svelte', 'Redux', 'MobX', 'Context', 'Hooks',
      'Styled Components', 'Emotion', 'Sass', 'LESS', 'PostCSS', 'Webpack', 'Vite',
      'Babel', 'ESLint', 'Prettier', 'Jest', 'Cypress', 'Testing Library', 'Storybook',
      'Chromatic', 'Lighthouse', 'PageSpeed', 'Web Vitals', 'Performance', 'Accessibility',
      'A11y', 'WCAG', 'ARIA', 'Semantic', 'SEO', 'Schema', 'JSON-LD', 'Microdata',
      'Open Graph', 'Twitter Cards', 'Favicon', 'Manifest', 'Progressive Enhancement',
      'Mobile First', 'Responsive', 'Grid', 'Flexbox', 'Animations', 'Transitions',
      'SVG', 'Canvas', 'WebGL', 'Three.js', 'D3.js', 'Chart.js', 'Recharts', 'Victory',
      'React Query', 'SWR', 'Apollo', 'Relay', 'CRUD', 'Authentication', 'Authorization',
      'Security', 'HTTPS', 'SSL', 'TLS', 'CSRF', 'XSS', 'SQL Injection', 'Validation',
      'Sanitization', 'Zod', 'Yup', 'Joi', 'Formik', 'React Hook Form', 'Controlled',
      'Uncontrolled', 'State Management', 'useReducer', 'useState', 'useEffect',
      'useCallback', 'useMemo', 'Custom Hooks', 'Higher Order Components', 'Render Props',
      'Compound Components', 'Composition', 'Inheritance', 'Polymorphism', 'Encapsulation',
      'Abstraction', 'Interface', 'Abstract', 'Class', 'Function', 'Async', 'Await',
      'Promise', 'Callback', 'Event Loop', 'Stack', 'Queue', 'Heap', 'Tree', 'Graph',
      'Algorithm', 'Data Structure', 'Complexity', 'Big O', 'Time', 'Space', 'Sorting',
      'Searching', 'Recursion', 'Iteration', 'Dynamic Programming', 'Greedy', 'Divide Conquer',
      'Backtracking', 'Branch Bound', 'Memoization', 'Tabulation', 'Top Down', 'Bottom Up',
      'Cache', 'Memory Leak', 'Garbage Collection', 'Reference', 'Value', 'Mutable', 'Immutable',
      'Pure Function', 'Side Effects', 'Functional Programming', 'Declarative', 'Imperative',
      'Object Oriented', 'Programming', 'Prototype Chain', 'Closure', 'Scope', 'Hoisting',
      'This', 'Bind', 'Call', 'Apply', 'Spread', 'Rest', 'Destructuring', 'Template Literal',
      'Arrow Function', 'Default Parameters', 'Optional Chaining', 'Nullish Coalescing',
      'Type Inference', 'Generics', 'Union', 'Intersection', 'Tuple', 'Enum', 'Namespace',
      'Module', 'Import', 'Export', 'Default', 'Named', 'Dynamic Import', 'Tree Shaking',
      'Code Splitting', 'Lazy Loading', 'Suspense', 'Error Boundary', 'Fallback', 'Retry',
      'Infinite Scroll', 'Pagination', 'Virtual List', 'Windowing', 'Debounce', 'Throttle',
      'Resize Observer', 'Intersection Observer', 'Mutation Observer', 'Performance Observer',
      'Navigation Timing', 'Resource Timing', 'Paint Timing', 'User Timing', 'Beacon',
      'Web Workers', 'IndexedDB', 'Local Storage', 'Session Storage', 'Cookies', 'Web Storage',
      'Cache Storage', 'Application Cache', 'Background Sync', 'Server Sent Events',
      'Event Source', 'Push Notifications', 'Geolocation', 'Media Devices', 'WebRTC',
      'Web Audio', 'WebGL', 'MathML', 'Web Assembly', 'Web Components', 'Custom Elements',
      'Shadow DOM', 'Templates', 'Slots', 'Lifecycle', 'Attributes', 'Properties', 'Events',
      'State', 'Computed', 'Methods', 'Watchers', 'Directives', 'Filters', 'Mixins', 'Plugins',
      'Extensions', 'DevTools', 'Debugging', 'Profiling', 'Benchmarks', 'Testing', 'Unit',
      'Integration', 'E2E', 'Visual Regression', 'Usability', 'UX', 'UI', 'Design System',
      'Component Library', 'Design Patterns', 'Architecture', 'Clean Code', 'SOLID', 'DRY',
      'KISS', 'YAGNI', 'Refactoring', 'Technical Debt', 'Code Review', 'Pair Programming',
      'Mob Programming', 'DevOps', 'Infrastructure as Code', 'Monitoring', 'Logging',
      'Alerting', 'Metrics', 'Analytics', 'Business Intelligence', 'Data Visualization',
      'Automation', 'Scripting', 'Bash', 'PowerShell', 'Kubernetes', 'Terraform', 'Ansible',
      'Jenkins', 'GitLab CI', 'CircleCI', 'TravisCI', 'AppVeyor', 'Fastly', 'Akamai', 'CDN',
      'DNS', 'Domain', 'SSL Certificate', 'HSTS', 'CSP', 'SRI', 'Integrity', 'Checksum',
      'Hash', 'Encryption', 'Decryption', 'Hashing', 'Salting', 'Peppering', 'Session',
      'Cookie', 'Token', 'API Key', 'Secret', 'Environment Variable', 'Configuration',
      'Settings', 'Preferences', 'Database', 'SQL', 'NoSQL', 'ElasticSearch', 'Hasura',
      'TypeORM', 'Sequelize', 'Mongoose', 'Knex', 'Bookshelf', 'Objection', 'Waterline',
      'LoopBack', 'NestJS', 'Express', 'Koa', 'Fastify', 'Hapi', 'Sails', 'Adonis',
      'Feather', 'Meteor', 'Nuxt.js', 'Gatsby', 'Astro', 'SvelteKit', 'Remix', 'Solid',
      'Qwik', 'Fresh', 'Deno', 'Bun', 'Runtime', 'V8', 'SpiderMonkey', 'JavaScriptCore',
      'CoffeeScript', 'LiveScript', 'Elm', 'PureScript', 'Reason', 'ML', 'OCaml', 'F#',
      'Haskell', 'Lisp', 'Scheme', 'Clojure', 'Racket', 'Erlang', 'Elixir', 'Phoenix',
      'Rust', 'Go', 'Swift', 'Kotlin', 'Scala', 'C++', 'C', 'Perl', 'Lua', 'R', 'MATLAB',
      'Julia', 'Dart', 'Flutter', 'React Native', 'Expo', 'Ionic', 'Cordova', 'PhoneGap',
      'Capacitor', 'Electron', 'Tauri', 'NW.js', 'Web App', 'Chrome Extension', 'Firefox Addon',
      'Safari Extension', 'Edge Extension', 'Opera Extension', 'Brave Extension', 'Vivaldi Extension',
      'Tor Browser', 'IE Browser', 'Compatibility', 'Polyfill', 'Transpiler', 'SWC', 'Sucrase',
      'Traceur', 'Flow', 'Prop Types', 'Class Validator', 'Validator.js', 'Express Validator',
      'Lodash', 'Underscore', 'Ramda', 'Moment.js', 'Day.js', 'date-fns', 'Luxon', 'Date Time',
      'Timezone', 'Locale', 'i18n', 'Internationalization', 'Localization', 'Translation',
      'Globalization', 'Formatting', 'Parsing', 'Escaping', 'Encoding', 'Decoding', 'Compression',
      'Decompression', 'Zip', 'Gzip', 'Brotli', 'Deflate', 'Inflate', 'Tar', 'Archive',
      'File System', 'Path', 'URL', 'URI', 'Query String', 'Router', 'Navigation', 'History',
      'Location', 'Hash', 'Scroll Position', 'Smooth Scrolling', 'Parallax', 'Sticky',
      'Fixed', 'Absolute', 'Relative', 'Static CSS', 'Display', 'Position', 'Z Index',
      'Overflow', 'Clip Path', 'Mask', 'Filter', 'Backdrop', 'Blend Mix', 'Transform',
      'Transition', 'Animation', 'Keyframe', 'Timing Function', 'Easing', 'Bezier', 'Cubic Bezier',
      'Spring', 'Physics', 'Collision Detection', 'Bounding Box', 'Navigation Timing',
      'Resource Timing', 'Paint Timing', 'User Timing', 'Application Cache', 'Background Sync'
    ];

    const techMatches = achievement.match(new RegExp(`\\b(${commonTechKeywords.join('|')})\\b`, 'gi'));

    techMatches?.forEach(match => {
      techKeywords.add(match.toLowerCase());
    });
  });

  return Array.from(techKeywords).sort();
};

/**
 * Get experience statistics
 */
export const getExperienceStats = () => ({
  total: experiences.length,
  current: getCurrentExperiences().length,
  past: getPastExperiences().length,
  companies: getAllCompanies().length,
  totalYears: getTotalYearsOfExperience(),
  skillsCount: getExperienceSkills().length,
});

// Export default experiences array for convenience
export default experiences;