import { describe, expect, it } from 'vitest';
import { activityBankSchema, evaluateObjective } from './activities';

const question = { id: 'q1', version: 1, type: 'single-choice', prompt: 'Pergunta?', status: 'draft', requiresEditorialReview: true, options: [{ id: 'a', label: 'A', feedback: 'A não.' }, { id: 'b', label: 'B', feedback: 'B sim.' }], correctId: 'b', explanation: 'Explicação.' } as const;
const scenario = { id: 's1', version: 1, type: 'guided-scenario', prompt: 'Analise.', status: 'draft', requiresEditorialReview: true, scoring: 'manual-rubric-only', autoGrade: false, rubric: [{ criterion: 'Justifica.', maxPoints: 1 }], modelAnswer: 'Exemplo.' } as const;
const practice = { id: 'p1', version: 1, type: 'guided-practice', prompt: 'Pratique.', status: 'draft', requiresEditorialReview: true, autoGrade: false } as const;
describe('contrato de atividades', () => {
  it('separa questões, cenários e práticas', () => expect(activityBankSchema.safeParse({ moduleId: 'aula', moduleVersion: 1, status: 'draft', questions: [question, scenario, practice] }).success).toBe(true));
  it('rejeita gabarito inexistente e IDs duplicados', () => {
    expect(activityBankSchema.safeParse({ moduleId: 'aula', moduleVersion: 1, status: 'draft', questions: [{ ...question, correctId: 'x' }] }).success).toBe(false);
    expect(activityBankSchema.safeParse({ moduleId: 'aula', moduleVersion: 1, status: 'draft', questions: [question, question] }).success).toBe(false);
  });
  it('corrige apenas escolhas válidas sem atribuir competência', () => {
    expect(evaluateObjective(question, 'b')).toEqual({ correct: true, feedback: 'B sim.' });
    expect(evaluateObjective(question, 'x')).toBeNull();
  });
  it('rejeita correção automática em cenários', () => expect(activityBankSchema.safeParse({ moduleId: 'aula', moduleVersion: 1, status: 'draft', questions: [{ ...scenario, autoGrade: true }] }).success).toBe(false));
});
