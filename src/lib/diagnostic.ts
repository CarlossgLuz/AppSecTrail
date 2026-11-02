export const httpPilotV1 = [
  { id: 'http-resposta', prompt: 'Quem envia a resposta HTTP?', options: [{ id: 'cliente', label: 'O cliente' }, { id: 'servidor', label: 'O servidor' }], correctId: 'servidor', explanation: 'O servidor envia uma resposta à requisição do cliente.' },
  { id: 'http-metodo', prompt: 'Qual método HTTP é normalmente usado para obter uma representação de um recurso?', options: [{ id: 'get', label: 'GET' }, { id: 'delete', label: 'DELETE' }], correctId: 'get', explanation: 'GET solicita uma representação; DELETE solicita a remoção do recurso.' },
] as const;

// Version 1 is historical data: add versions instead of editing these questions.
httpPilotV1.forEach(q => { q.options.forEach(Object.freeze); Object.freeze(q.options); Object.freeze(q); });
Object.freeze(httpPilotV1);
export const diagnosticQuestions = httpPilotV1;
export const diagnosticId = 'http-piloto';
type QuestionDefinition = { id: string; options: readonly { id: string }[]; correctId: string };
export function evaluateVersion(answers: Record<string, string>, assessmentId: string, version: number, versions: Record<string, readonly QuestionDefinition[]>) {
  const diagnosticQuestions = versions[`${assessmentId}:${version}`];
  if (!diagnosticQuestions) throw new Error('Versão de avaliação não suportada.');
  if (Object.keys(answers).length !== diagnosticQuestions.length) throw new Error('Respostas inválidas.');
  if (diagnosticQuestions.some(q => !q.options.some(option => option.id === answers[q.id]))) throw new Error('Responda todas as questões.');
  const correct = diagnosticQuestions.filter(q => answers[q.id] === q.correctId).length;
  return { competencyId: 'F04.05', correct, total: diagnosticQuestions.length, percent: 100 * correct / diagnosticQuestions.length };
}

export function evaluateDiagnostic(answers: Record<string, string>, assessmentId = diagnosticId, version = 1) {
  return evaluateVersion(answers, assessmentId, version, { 'http-piloto:1': httpPilotV1 });
}
