import { z } from 'astro/zod';

/** Metadados do contrato editorial; conteúdos anteriores podem ser migrados gradualmente. */
export const editorialSchema = z.object({
  version: z.number().int().positive(),
  prerequisites: z.array(z.string().trim().min(1)).min(1),
  pedagogicalReview: z.enum(['pending', 'reviewed']),
  activities: z.array(z.object({
    id: z.string().trim().min(1),
    version: z.number().int().positive(),
    format: z.enum(['multiple-choice', 'analysis', 'regression']),
    hints: z.array(z.string().trim().min(1)).min(1),
  })).min(1),
}).refine(value => new Set(value.activities.map(activity => activity.id)).size === value.activities.length, 'IDs de atividades devem ser únicos.');
