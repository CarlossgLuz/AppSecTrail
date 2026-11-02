export type Question = { correctId: string; options: { id: string; feedback: string }[] };
export function evaluateAnswer(question: Question, selectedId: string) {
  const option = question.options.find(item => item.id === selectedId);
  return option ? { correct: option.id === question.correctId, feedback: option.feedback } : null;
}
