import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const modules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modules' }),
  schema: z.object({ title: z.string(), category: z.string(), summary: z.string(), version: z.number().int().positive(), draft: z.boolean().default(true), id: z.string().min(1), locale: z.literal('pt-BR'), author: z.string().min(1), license: z.string().min(1), technicalReviewStatus: z.enum(['pending', 'reviewed']), lastTechnicalReview: z.string(), learningObjectives: z.array(z.string()).min(1), competencyIds: z.array(z.string()).min(1), references: z.array(z.object({ url: z.url(), accessDate: z.string() })).min(1), exercise: z.object({ prompt: z.string(), correctId: z.string(), hint: z.string(), options: z.array(z.object({ id: z.string(), label: z.string(), feedback: z.string() })).min(2) }).refine(q => new Set(q.options.map(option => option.id)).size === q.options.length && q.options.some(option => option.id === q.correctId), 'A questão deve ter opções únicas e uma resposta correta existente.').optional() }).refine(module => module.draft || module.technicalReviewStatus === 'reviewed', 'Conteúdo publicado precisa de revisão técnica.'),
});
export const collections = { modules };
