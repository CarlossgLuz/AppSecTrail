import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const common = { id: text, version: z.number().int().positive(), prompt: text, status: z.enum(['draft', 'reviewed']), requiresEditorialReview: z.boolean() };
const optionSchema = z.object({ id: text, label: text, feedback: text });
const objectiveSchema = z.object({ ...common, type: z.literal('single-choice'), options: z.array(optionSchema).min(2), correctId: text, explanation: text }).refine(q => new Set(q.options.map(o => o.id)).size === q.options.length && q.options.some(o => o.id === q.correctId), 'Opções ou gabarito inválidos.');
const scenarioSchema = z.object({ ...common, type: z.literal('guided-scenario'), scoring: z.literal('manual-rubric-only'), autoGrade: z.literal(false), rubric: z.array(z.object({ criterion: text, maxPoints: z.number().positive() })).min(1), modelAnswer: text });
const practiceSchema = z.object({ ...common, type: z.literal('guided-practice'), autoGrade: z.literal(false) });
export const activityBankSchema = z.object({ moduleId: text, moduleVersion: z.number().int().positive(), status: z.enum(['draft', 'reviewed']), questions: z.array(z.union([objectiveSchema, scenarioSchema, practiceSchema])).min(1) }).refine(bank => new Set(bank.questions.map(q => q.id)).size === bank.questions.length, 'IDs de atividades devem ser únicos.');

/** Apenas avalia uma escolha; nunca infere competência ou salva progresso. */
export function evaluateObjective(question: { readonly correctId: string; readonly options: readonly { readonly id: string; readonly feedback: string }[] }, selectedId: string) {
  const option = question.options.find(item => item.id === selectedId);
  return option ? { correct: option.id === question.correctId, feedback: option.feedback } : null;
}
