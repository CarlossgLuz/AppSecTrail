export const httpPilotV1 = [
  { id: 'http-resposta', prompt: 'Quem envia a resposta HTTP?', options: [{ id: 'cliente', label: 'O cliente' }, { id: 'servidor', label: 'O servidor' }], correctId: 'servidor', explanation: 'O servidor envia uma resposta à requisição do cliente.' },
  { id: 'http-metodo', prompt: 'Qual método HTTP é normalmente usado para obter uma representação de um recurso?', options: [{ id: 'get', label: 'GET' }, { id: 'delete', label: 'DELETE' }], correctId: 'get', explanation: 'GET solicita uma representação; DELETE solicita a remoção do recurso.' },
] as const;

export const diagnosticQuestions = httpPilotV1;
export const diagnosticId = 'http-piloto';
export function evaluateDiagnostic(answers: Record<string, string>, assessmentId = diagnosticId, version = 1) {
  if (assessmentId !== diagnosticId || version !== 1) throw new Error('Versão de avaliação não suportada.');
  const diagnosticQuestions = httpPilotV1;
  if (Object.keys(answers).length !== diagnosticQuestions.length) throw new Error('Respostas inválidas.');
  if (diagnosticQuestions.some(q => !q.options.some(option => option.id === answers[q.id]))) throw new Error('Responda todas as questões.');
  const correct = diagnosticQuestions.filter(q => answers[q.id] === q.correctId).length;
  return { competencyId: 'F04.05', correct, total: diagnosticQuestions.length, percent: 100 * correct / diagnosticQuestions.length };
}
