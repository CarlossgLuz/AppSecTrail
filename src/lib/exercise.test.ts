import { describe, expect, it } from 'vitest';
import { evaluateAnswer } from './exercise';

describe('feedback de questão objetiva', () => {
  const question = { correctId: 'b', options: [{ id: 'a', feedback: 'Revise a resposta.' }, { id: 'b', feedback: 'Resposta correta.' }] };
  it('informa o motivo específico para uma resposta incorreta', () => {
    expect(evaluateAnswer(question, 'a')).toEqual({ correct: false, feedback: 'Revise a resposta.' });
  });
  it('reconhece a alternativa correta', () => {
    expect(evaluateAnswer(question, 'b')).toEqual({ correct: true, feedback: 'Resposta correta.' });
  });
  it('não atribui resultado a uma opção desconhecida', () => {
    expect(evaluateAnswer(question, 'outra')).toBeNull();
  });
});
