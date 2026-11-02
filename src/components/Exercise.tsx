import { useState } from 'react';
import { evaluateAnswer, type Question } from '../lib/exercise';
type Option = { id: string; label: string; feedback: string };
type Props = { prompt: string; correctId: string; options: Option[]; hint: string };
export default function Exercise({ prompt, correctId, options, hint }: Props) {
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState<ReturnType<typeof evaluateAnswer>>(null);
  const [showHint, setShowHint] = useState(false);
  const question: Question = { correctId, options };
  return <section aria-labelledby="exercise-title" className="card">
    <h2 id="exercise-title">Experimente</h2>
    <fieldset><legend>{prompt}</legend>{options.map(option => <div key={option.id}><label><input style={{ width: 'auto', display: 'inline', marginRight: '.5rem' }} type="radio" name="exercise" value={option.id} checked={selected === option.id} onChange={() => { setSelected(option.id); setResult(null); }} />{option.label}</label></div>)}</fieldset>
    <div className="actions"><button className="button" type="button" disabled={!selected} onClick={() => setResult(evaluateAnswer(question, selected))}>Verificar resposta</button><button className="button secondary" type="button" onClick={() => setShowHint(!showHint)} aria-expanded={showHint}>Mostrar ou ocultar dica</button></div>
    {showHint && <p>{hint}</p>}{result && <p role="status"><strong>{result.correct ? 'Correto. ' : 'Ainda não. '}</strong>{result.feedback}</p>}
  </section>;
}
