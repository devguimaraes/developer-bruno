# CLAUDE.md

Guide for Claude Code (claude.ai/code) working with this portfolio repository.

## 🚀 Quick Start

```bash
npm install && npm run dev    # Start development server on port 8080
npm run build && npm run preview  # Test production build
```

## 📋 Essential Commands

```bash
npm run dev          # Development server (port 8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint
npm run preview      # Preview production build
```

## 🏗️ Architecture Overview

**Tech Stack:**
- React 18.3.1 + TypeScript + Vite (SWC plugin)
- Tailwind CSS + shadcn/ui (36 components) + Radix UI
- React Router DOM, React Query, React Hook Form + Zod
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

**Usage:**
```tsx
const { getTransform, getZIndex } = useStackingSections(['hero', 'about', 'projects']);
// Apply to section elements
```

## ⚡ Performance & SEO

**Brazilian Market Optimizations:**
- Performance budgets: JS 300KB, Images 500KB, Total 1MB
- Web Vitals monitoring with Brazilian thresholds
- Connection quality tracking for mobile networks
- Bundle size monitoring and warnings

**Key Files:**
- `useWebVitals.ts` - Performance monitoring
- `site.ts` - Brazilian SEO keywords and config
- `vite.config.ts` - Build optimizations and code splitting

**Performance Features:**
- Lazy loading for non-critical components (Services, Blog)
- Image optimization with Next.js Image patterns
- Code splitting with dynamic imports
- Resource budget monitoring

## 📝 Blog System

- Markdown processing with frontmatter
- SEO optimized for individual posts
- Dynamic routing with slugs
- Brazilian market content focus

## 🎨 Design System (Brutalist)

**Core Principles:**
- Heavy borders (`border-4`) with no border radius
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
7. Test on both mobile and desktop viewports

**State Management:**
- **React Query:** Server state (projects, blog posts)
- **Local State:** useState for UI interactions
- **Theme:** next-themes for dark/light mode

**Form Handling:**
- React Hook Form + Zod validation
- Sonner for toast notifications
- TypeScript schemas in `validation.ts`

## 🔧 Key Configuration Files

- `tailwind.config.ts` - Design tokens, animations, brutalist variants
- `vite.config.ts` - Build optimization, component tagger, path aliases
- `site.ts` - SEO, Brazilian market config, performance budgets
- `components/ui/` - shadcn/ui component library (36 components)

## 🌍 Brazilian Market Focus

**SEO Configuration:**
- Keywords: "desenvolvedor front-end Brasil", "programador React Rio de Janeiro"
- Locale: pt_BR, Region: BR
- Service areas: Rio, São Paulo, Brasília, etc.
- Performance budgets optimized for Brazilian mobile networks

**Contact & Social:**
- Email: bc.guimaraes@outlook.com
- Location: Rio de Janeiro, Brasil
- LinkedIn: /in/bcguimaraes/
- GitHub: /devguimaraes

## ⚡ Deployment

**Optimized for Vercel:**
- Static site generation capability
- Asset optimization with Vite
- Performance budget enforcement
- Brazilian market analytics integration

**Build Features:**
- SWC plugin for fast compilation
- Path aliases (@/ for src/)
- PostCSS with Tailwind + Autoprefixer
- ESLint with React/TypeScript rules