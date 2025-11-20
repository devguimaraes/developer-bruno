# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start development server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Project Architecture

This is a personal portfolio website for Bruno Guimarães built with a "Techno Brutalist" design aesthetic using React + TypeScript + Vite.

### Tech Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite with SWC plugin
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom brutalist design system
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: React Query for server state, local useState for UI state
- **Form Handling**: react-hook-form with zod validation
- **Icons**: lucide-react

### Project Structure

```
src/
├── components/
│   ├── ui/             # shadcn/ui components (reusable primitives)
│   ├── Navigation.tsx  # Site navigation with mobile toggle
│   ├── Hero.tsx        # Main hero section with animated content
│   ├── Projects.tsx    # Project showcase with carousel
│   ├── Experience.tsx  # Work experience timeline
│   ├── About.tsx       # About section
│   ├── Contact.tsx     # Contact form
│   └── Footer.tsx      # Site footer
├── pages/
│   ├── Index.tsx       # Main portfolio page
│   └── NotFound.tsx    # 404 page
├── hooks/
│   ├── use-mobile.tsx  # Mobile screen detection
│   └── use-toast.ts    # Toast notification system
├── lib/
│   └── utils.ts        # cn() utility for class merging
└── assets/             # Static assets and images
```

### Design System

**Brutalist Design Language:**

- Heavy borders (`border-4`) with no border radius (`--radius: 0rem`)
- Custom shadows: `shadow-brutal`, `shadow-brutal-sm`, `shadow-brutal-lg`
- Color palette: Parakeet (green), Royal Lilac (purple), Freesia (yellow)
- Dark mode support with HSL CSS variables
- Custom gradients: `gradient-aqua`, `gradient-primary`, `gradient-accent`
- Fonts: Satoshi (sans), JetBrains Mono (mono)

**Key Design Tokens:**

- `--primary`: Parakeet (162 100% 27%)
- `--secondary`: Royal Lilac (282 32% 42%)
- `--accent`: Freesia (45 87% 57%)
- `--background`: Light mode (0 0% 98%), Dark mode (0 0% 8%)

### Component Patterns

**UI Components (shadcn/ui):**

- Uses Radix UI primitives for accessibility
- Class Variance Authority (CVA) for component variants
- Consistent `forwardRef` pattern
- Custom theme integration with Tailwind

**Page Components:**

- Single-page portfolio layout
- Scroll-based navigation with smooth scrolling
- Responsive design with mobile-first approach
- Animation on scroll using custom CSS animations

### State Management

**React Query:** Used for fetching external data (projects, etc.)
**Local State:** useState hooks for UI interactions
**Theme:** next-themes for dark/light mode switching

### Styling Architecture

**Tailwind Configuration:**

- Custom design tokens in `tailwind.config.ts`
- HSL color system for consistent theming
- Custom animations and keyframes
- Brutalist design variants (shadows, borders, gradients)

**CSS Organization:**

- Global CSS variables in `index.css`
- Component-level styling with Tailwind utilities
- Custom animations for interactive elements

### Development Notes

**Key Dependencies:**

- Full Radix UI component suite for accessibility
- React Hook Form with Zod for form validation
- Embla Carousel for project showcase
- Sonner for toast notifications

**Build Configuration:**

- Vite with React SWC plugin for fast builds
- TypeScript with path aliases
- ESLint with React and TypeScript rules
- PostCSS with Tailwind and Autoprefixer

**Deployment:**

- Optimized for Vercel deployment
- Static site generation capability
- Asset optimization with Vite

### Feature Implementation

When adding new features:

1. Follow brutalist design patterns (heavy borders, no radius)
2. Use shadcn/ui components as base
3. Implement responsive design (mobile-first)
4. Add smooth animations using existing keyframes
5. Ensure dark mode compatibility
6. Use TypeScript for type safety
7. Test on both mobile and desktop viewports
