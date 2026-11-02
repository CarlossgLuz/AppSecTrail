import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const modules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modules' }),
  schema: z.object({ title: z.string(), category: z.string(), summary: z.string(), version: z.number().int().positive(), draft: z.boolean().default(true), exercise: z.object({ prompt: z.string(), correctId: z.string(), hint: z.string(), options: z.array(z.object({ id: z.string(), label: z.string(), feedback: z.string() })).min(2) }).optional() }),
});
export const collections = { modules };
