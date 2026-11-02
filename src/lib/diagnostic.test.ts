import { describe, expect, it } from 'vitest';
import { evaluateDiagnostic, evaluateVersion, httpPilotV1 } from './diagnostic';

describe('diagnóstico inicial', () => {
  it('mantém a pontuação v1 ao adicionar uma definição v2', () => {
    const versions = { 'http-piloto:1': httpPilotV1, 'http-piloto:2': [{ id: 'nova', options: [{ id: 'sim' }, { id: 'nao' }], correctId: 'sim' }] };
    expect(evaluateVersion({ 'http-resposta': 'servidor', 'http-metodo': 'get' }, 'http-piloto', 1, versions).correct).toBe(2);
    expect(evaluateVersion({ nova: 'nao' }, 'http-piloto', 2, versions).correct).toBe(0);
    expect(Object.isFrozen(httpPilotV1[0])).toBe(true);
  });
  it('calcula acertos por competência e rejeita respostas incompletas', () => {
    expect(() => evaluateDiagnostic({})).toThrow();
    expect(evaluateDiagnostic({ 'http-resposta': 'servidor', 'http-metodo': 'get' })).toMatchObject({ correct: 2, total: 2, percent: 100, competencyId: 'F04.05' });
    expect(evaluateDiagnostic({ 'http-resposta': 'cliente', 'http-metodo': 'get' }).percent).toBe(50);
  });
});
