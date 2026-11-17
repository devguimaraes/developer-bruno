import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{astro,ts,tsx}"],
  prefix: "",
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xs: "1.5rem",
        sm: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Identidade Giro: paleta e papéis da superfície ativa (g-papel, g-azul, g-tinta).
        "azul-sinal": "var(--azul-sinal)",
        "azul-fundo": "var(--azul-fundo)",
        lima: "var(--lima)",
        papel: "var(--papel)",
        tinta: "var(--tinta)",
        "tinta-2": "var(--tinta-2)",
        grafite: "var(--grafite)",
        "nevoa-azul": "var(--nevoa-azul)",
        "nevoa-tinta": "var(--nevoa-tinta)",
        coral: "var(--coral)",
        "linha-papel": "var(--linha-papel)",
        "linha-azul": "var(--linha-azul)",
        s: {
          bg: "var(--s-bg)",
          fg: "var(--s-fg)",
          muted: "var(--s-muted)",
          line: "var(--s-line)",
          "line-strong": "var(--s-line-strong)",
          raised: "var(--s-raised)",
          signal: "var(--s-signal)",
          link: "var(--s-link)",
          accent: "var(--s-accent)",
          "on-accent": "var(--s-on-accent)",
          focus: "var(--s-focus)",
          field: "var(--s-field)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
        sans: ["var(--font-sans)"],
      },
      spacing: {
        18: "var(--space-18)",
      },
      minHeight: {
        touch: "var(--touch-min)",
      },
      minWidth: {
        touch: "var(--touch-min)",
      },
      transitionTimingFunction: {
        resolve: "var(--ease-resolve)",
        hop: "var(--ease-hop)",
      },
      transitionDuration: {
        resolve: "var(--dur-resolve)",
        hop: "var(--dur-hop)",
        shake: "var(--dur-shake)",
        spin: "var(--dur-spin)",
      },
      borderRadius: {
        "g-sm": "var(--radius-sm)",
        "g-md": "var(--radius-md)",
        "g-lg": "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
} satisfies Config;
