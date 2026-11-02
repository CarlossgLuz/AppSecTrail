import { describe, expect, it } from 'vitest';
import { editorialSchema } from './editorial';

const valid = { version: 1, prerequisites: ['HTTP básico'], pedagogicalReview: 'pending', activities: [{ id: 'a1', version: 1, format: 'multiple-choice', hints: ['Observe a requisição', 'Compare o emissor'] }] };
describe('contrato editorial', () => {
  it('aceita metadados versionados e pistas graduais', () => expect(editorialSchema.safeParse(valid).success).toBe(true));
  it('rejeita versões inválidas ou atividades sem pistas', () => {
    expect(editorialSchema.safeParse({ ...valid, version: 0 }).success).toBe(false);
    expect(editorialSchema.safeParse({ ...valid, activities: [{ ...valid.activities[0], hints: [] }] }).success).toBe(false);
  });
});
