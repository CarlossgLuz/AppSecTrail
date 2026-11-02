export const diagnosticQuestions = [
  { id: 'http-resposta', prompt: 'Quem envia a resposta HTTP?', options: [{ id: 'cliente', label: 'O cliente' }, { id: 'servidor', label: 'O servidor' }], correctId: 'servidor', explanation: 'O servidor envia uma resposta à requisição do cliente.' },
  { id: 'http-metodo', prompt: 'Qual método HTTP é normalmente usado para obter uma representação de um recurso?', options: [{ id: 'get', label: 'GET' }, { id: 'delete', label: 'DELETE' }], correctId: 'get', explanation: 'GET solicita uma representação; DELETE solicita a remoção do recurso.' },
] as const;

export function evaluateDiagnostic(answers: Record<string, string>) {
  if (diagnosticQuestions.some(q => !q.options.some(option => option.id === answers[q.id]))) throw new Error('Responda todas as questões.');
  const correct = diagnosticQuestions.filter(q => answers[q.id] === q.correctId).length;
  return { competencyId: 'F04.05', correct, total: diagnosticQuestions.length, percent: 100 * correct / diagnosticQuestions.length };
}
