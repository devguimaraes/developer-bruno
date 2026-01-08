# Developer Bruno - Professional Portfolio

Guide for Gemini (AI assistant) working with this brutalist portfolio repository.

## 🚀 Quick Start

```bash
npm install && npm run dev    # Development server on port 5173
npm run build && npm run preview  # Test production build
```

## 📋 Essential Commands

```bash
npm run dev          # Development server (port 5173)
npm run build        # Production build + sitemap generation
npm run build:dev    # Development build
npm run lint         # ESLint
npm run preview      # Preview production build
```

## 🏗️ Architecture Overview

**Tech Stack:**

- React 18.3 + TypeScript + Vite 7.2 (SWC plugin)
- Tailwind CSS 3.4 + shadcn/ui (36 components) + Radix UI
- React Router DOM 6.30, React Query 5.83, React Hook Form 7.61 + Zod 3.25
- Framer Motion, Embla Carousel, Sonner, lucide-react

**Project Structure:**

```
src/
├── components/
│   ├── ui/             # 36 shadcn/ui components
│   ├── Navigation.tsx  # Site navigation with mobile toggle
│   ├── Hero.tsx        # Main hero with animated content
│   ├── Projects.tsx    # Project showcase with carousel
│   ├── Experience.tsx  # Work experience timeline
│   ├── About.tsx       # About section
│   ├── Skills.tsx      # Skills display
│   ├── Contact.tsx     # Contact form
│   ├── Services.tsx    # Services (lazy load)
│   ├── Blog.tsx        # Blog section (lazy load)
│   └── Footer.tsx      # Site footer
├── pages/
│   ├── Index.tsx       # Main portfolio page
│   ├── BlogPage.tsx    # Blog listing
│   ├── BlogPostPage.tsx # Individual post
│   └── NotFound.tsx    # 404 page
├── hooks/
│   ├── useStackingSections.ts  # Scroll stacking effect
│   ├── useWebVitals.ts        # Performance monitoring
│   ├── use-blog-posts.ts       # Blog data
│   ├── use-mobile.tsx          # Mobile detection
│   └── use-toast.ts            # Toast notifications
├── data/
│   ├── projects.ts     # Portfolio projects data
│   ├── experience.ts   # Work experience data
│   └── skills.ts       # Skills data
├── types/              # TypeScript interfaces
├── lib/                # Utilities and validation (Zod schemas)
└── config/
    └── site.ts         # SEO and Brazilian market config
```

## 🎯 Scroll Stacking System

**Hook:** `useStackingSections.ts`

Advanced scroll-based section stacking:

- Components layer based on scroll progress
- Transform and z-index calculations for visual depth
- IntersectionObserver with 101 thresholds for smooth tracking
- Previous sections trigger next section animations at 70% progress

## ⚡ Performance & SEO (Brazilian Market)

**Performance Budgets:** JS 300KB, Images 500KB, Total 1MB
**Web Vitals:** Thresholds adapted for Brazilian 3G/4G networks
**Analytics:** Plausible Tracker (LGPD compliant)

**Key Files:**

- `useWebVitals.ts` - Performance monitoring
- `site.ts` - Brazilian SEO keywords and config
- `vite.config.ts` - Build optimizations and code splitting

**Features:**

- Lazy loading for non-critical components (Services, Blog)
- Code splitting with dynamic imports
- Automated XML sitemap generation

## 📝 Blog System

- Markdown processing with frontmatter
- SEO optimized for individual posts
- Dynamic routing with slugs
- Brazilian market content focus

## 🎨 Design System (Brutalist)

**Core Principles:**

- Heavy borders (`border-4`) with no border radius (`--radius: 0rem`)
- Custom shadows: `shadow-brutal`, `shadow-brutal-sm`, `shadow-brutal-lg`
- Neo-brutalist color palette

**Color Tokens (HSL):**

- `--primary`: Parakeet (162 100% 27%)
- `--secondary`: Royal Lilac (282 32% 42%)
- `--accent`: Freesia (45 87% 57%)
- `--background`: Light (0 0% 98%), Dark (0 0% 8%)

**Gradients:** `gradient-aqua`, `gradient-primary`, `gradient-accent`
**Animations:** `float`, `glitch`, `typing`, custom scroll effects
**Fonts:** Satoshi (sans), JetBrains Mono (mono)

## 👨‍💻 Development Guidelines

**Component Development:**

1. Use shadcn/ui components as base (forwardRef pattern)
2. Follow brutalist design patterns (heavy borders, no radius)
3. Implement responsive design (mobile-first)
4. Add smooth animations using existing keyframes
5. Ensure dark mode compatibility with HSL variables
6. Use TypeScript with strict mode

**State Management:**

- **React Query:** Server state (projects, blog posts)
- **Local State:** useState for UI interactions
- **Theme:** next-themes for dark/light mode

**Form Handling:** React Hook Form + Zod validation + Sonner toasts

**Data Architecture:**

- 100% externalized content in `src/data/` and `src/content/`
- Runtime validation with Zod schemas
- TypeScript interfaces in `src/types/`

## 🔧 Key Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Design tokens, animations, brutalist variants |
| `vite.config.ts` | Build optimization, component tagger, path aliases |
| `site.ts` | SEO, Brazilian market config, performance budgets |
| `components/ui/` | shadcn/ui component library (36 components) |

## ⚡ Deployment

**Optimized for Vercel:**

- Static site generation capability
- Asset optimization with Vite
- Performance budget enforcement

**Build Features:**

- SWC plugin for fast compilation
- Path aliases (@/ for src/)
- PostCSS with Tailwind + Autoprefixer
- ESLint with React/TypeScript rules

## 📚 Additional Documentation

- `README.md` - Full project documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `GIT_WORKFLOW.md` - Detailed Git workflow
- `docs/` - Technical documentation and implementation details
