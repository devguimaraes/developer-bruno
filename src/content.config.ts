import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // "15 NOV 2025" (pt-BR) ou ISO. Mês errado quebraria a lista do blog, então falha no build.
    date: z
      .string()
      .regex(
        /^(\d{1,2} (JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ) \d{4}|\d{4}-\d{2}-\d{2})$/i,
        'Data no formato "DD MMM AAAA" (ex.: "15 NOV 2025") ou AAAA-MM-DD'
      ),
    readTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Bruno Guimarães"),
    excerpt: z.string(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
