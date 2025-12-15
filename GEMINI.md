# Developer Bruno - Professional Portfolio

This project is a professional digital portfolio developed using modern web technologies. It features a brutalist design aesthetic and enhanced interactivity to showcase projects, professional experience, an integrated blog, and direct contact options. The portfolio is optimized for SEO and performance, targeting the Brazilian market.

## Project Type

This is a **Code Project**—specifically, a frontend web application built with a modern JavaScript ecosystem.

## Key Technologies

### Frontend

* **Framework**: React 18.3 with TypeScript
* **Build Tool**: Vite 5.4 with SWC (Speedy Web Compiler)
* **Styling**: Tailwind CSS 3.4 for utility-first styling, complemented by custom animations.
* **UI Components**: Utilizes `shadcn/ui` and `Radix UI` primitives for accessible and customizable UI components.
* **Routing**: React Router DOM 6.30
* **State Management**: React Query 5.83 for server state management and `useState` for UI state.
* **Forms**: React Hook Form 7.61 integrated with Zod 3.25 for robust form validation.

### SEO & Analytics

* **SEO Meta Tags**: React Helmet Async 2.0 for dynamic meta tags optimized for the Brazilian market (pt-BR).
* **Structured Data**: Schema.org JSON-LD markup.
* **Performance Monitoring**: Web Vitals 3.5 to monitor Core Web Vitals with thresholds adapted for Brazilian 3G/4G networks.
* **Privacy Analytics**: Plausible Tracker for LGPD compliant, privacy-focused analytics.
* **Error Tracking**: Custom Error Boundaries for friendly fallback UX.
* **Sitemap Generation**: Automated XML sitemap optimized for search engines.

### DevTools

* **Linting**: ESLint 9.32
* **Type Checking**: TypeScript 5.8

### Design System

* **Icons**: Lucide React
* **Notifications**: Sonner Toast
* **Date Picker**: React Day Picker
* **Charts**: Recharts

## Architecture and Data Management

The project follows a strong architecture with a focus on data externalization and type safety:

* **Externalized Data**: All content (projects, experience, skills, blog posts) is stored in dedicated files (`src/data/`, `src/content/`) and validated using Zod schemas.
* **Type Safety**: Comprehensive TypeScript interfaces (`src/types/`) ensure type safety across all data structures.
* **Component Architecture**: Clear separation between UI primitives (`src/components/ui/`) and feature components (`src/components/`).

## Building and Running

### Prerequisites

Ensure you have the following installed:

* **Node.js**: v18+ (v20 LTS recommended)
* **npm**: v9+ (or `bun` as an alternative package manager)
* **Git**: v2.30+

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/devguimaraes/developer-bruno.git
    cd developer-bruno
    ```

2. **Install dependencies:**

    ```bash
    # Using npm
    npm install

    # Or using bun
    bun install
    ```

3. **Configure Environment Variables (if needed):**
    Create a `.env.local` file in the project root:

    ```
    VITE_API_URL=http://localhost:3000
    ```

### Development Commands

* **Start development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.
* **Run Linting:**

    ```bash
    npm run lint
    ```

* **Generate production build:**

    ```bash
    npm run build
    ```

* **Generate development build:**

    ```bash
    npm run build:dev
    ```

* **Preview production build locally:**

    ```bash
    npm run preview
    ```

### Deployment

The project is ready for deployment on platforms like Vercel, Netlify, or GitHub Pages. For GitHub Pages, `vite.config.ts` might need `base: '/developer-bruno/'`.

## Development Conventions

### Code Style and Practices

* **Component Design**: Components are small and focused on single responsibilities.
* **TypeScript**: Strict TypeScript usage with explicit types and clear interfaces.
* **Composition**: Preference for composition over inheritance.
* **Custom Hooks**: Complex logic is extracted into reusable custom hooks.
* **Data Architecture**: Externalized data with runtime validation.

### Commit Guidelines

* The project follows [Conventional Commits](https://www.conventionalcommits.org/) for clear and standardized commit messages (e.g., `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`).

### Performance Optimization

* **Lazy Loading**: Heavy components are lazy-loaded using `React.lazy()`.
* **Memoization**: `React.memo()` is used for optimized rendering.
* **Code Splitting**: Leverages Vite's automatic code splitting.
* **Image Optimization**: Focus on optimizing images and using modern formats (e.g., WebP).
* **Bundle Analysis**: Regular monitoring of bundle size.

### Design System

* **Consistency**: Adherence to Tailwind's design tokens.
* **Brutalist Aesthetic**: Consistent application of brutalist design elements (e.g., `border-4`, `--radius: 0rem`).
* **Dark Mode**: Native dark/light mode support using CSS variables.
* **Responsive Design**: Mobile-first approach with appropriate breakpoints.
* **Accessibility**: Components integrate ARIA labels and keyboard navigation, utilizing Radix UI.

### Development Workflow

* **Environment Variables**: Managed in `.env.local`.
* **Linting**: `npm run lint` is executed before commits.
* **Type Checking**: Real-time TypeScript validation.
* **Testing**: Plans for Vitest + React Testing Library are in place for testing components across multiple viewports.
* **Build Verification**: `npm run build` is run before deployment.

### Monitoring

* **Error Boundaries**: Implemented for runtime error fallbacks.
* **Performance**: Continuous monitoring of Core Web Vitals.
* **Bundle Size**: Periodic analysis of chunk sizes.
* **Dependencies**: Regular review and updates of dependencies.

### Contribution Workflow

* The project uses the **Gitflow Workflow**.
* `main` branch for production, `develop` for staging.
* Feature branches are created from `develop`.
* Pull Requests target `develop`, followed by code review.
* Merge to `main` only for releases.
    For full details, refer to `CONTRIBUTING.md`.
