/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { generateSitemap } from "./src/lib/sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    exclude: ["**/src/test/e2e/**", "node_modules/**"],
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Sitemap plugin for Brazilian SEO
    mode === "production" && {
      name: 'vite-plugin-sitemap',
      generateSitemap: generateSitemap,
      transformSitemap: (xml) => {
        // Add Brazilian specific headers
        return xml.replace('<?xml version="1.0" encoding="UTF-8"?>',
          '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Brazilian Market SEO Sitemap -->');
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('react-helmet-async') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-client';
            }
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'forms';
            }
          }
        },
      },
    },
    // Increase chunk size warning limit (temporarily)
    chunkSizeWarningLimit: 800,
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for better optimization
    target: 'esnext',
  },
  // Define global constants
  define: {
    // Enable SWC compile-time constants
    __DEV__: mode === "development",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      'lucide-react'
    ],
  },
}));
