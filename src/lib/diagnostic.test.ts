import { describe, expect, it } from 'vitest';
import { evaluateDiagnostic } from './diagnostic';

describe('diagnóstico inicial', () => {
  it('calcula acertos por competência e rejeita respostas incompletas', () => {
    expect(() => evaluateDiagnostic({})).toThrow();
    expect(evaluateDiagnostic({ 'http-resposta': 'servidor', 'http-metodo': 'get' })).toMatchObject({ correct: 2, total: 2, percent: 100, competencyId: 'F04.05' });
    expect(evaluateDiagnostic({ 'http-resposta': 'cliente', 'http-metodo': 'get' }).percent).toBe(50);
  });
});
