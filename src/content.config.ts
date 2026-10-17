import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Legal pages, one Markdown file per page and language: src/content/legal/<locale>/<page>.md */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Date the text takes effect, shown at the end of the page. */
    updated: z.coerce.date(),
  }),
});

export const collections = { legal };
