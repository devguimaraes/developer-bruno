/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    testTimeout: 10000,
    // Os testes de tempo (loader, hero) estouram com a suíte inteira em paralelo no WSL.
    maxWorkers: 4,
    css: true,
    exclude: ["**/src/test/e2e/**", "**/.worktrees/**", "**/.claude/**", "**/node_modules/**", ".opencode/**"],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/types/**',
        'node_modules/**',
        '**/.worktrees/**',
        '**/.claude/**',
        '**/*.config.{ts,js}',
        '**/*.astro',
      ],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 30,  // baseline atual: 25.43%
        branches: 25,    // baseline atual: 26.68%
        functions: 25,   // baseline atual: 22.17%
        lines: 30,       // baseline atual: 26.96%
      },
      watermarks: {
        statements: [50, 80],
        branches: [50, 80],
        functions: [50, 80],
        lines: [50, 80],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "astro:content": path.resolve(__dirname, "./src/test/__mocks__/astro-content.ts"),
    },
  },
});
