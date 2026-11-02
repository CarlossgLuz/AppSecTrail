import { useState } from 'react';
import { evaluateAnswer, type Question } from '../lib/exercise';
import { recordAttempt } from '../lib/profile';
type Option = { id: string; label: string; feedback: string };
type Props = { prompt: string; correctId: string; options: Option[]; hint: string; moduleId: string; moduleVersion: number };
export default function Exercise({ prompt, correctId, options, hint, moduleId, moduleVersion }: Props) {
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState<ReturnType<typeof evaluateAnswer>>(null);
  const [showHint, setShowHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const question: Question = { correctId, options };
  async function verify() {
    const answer = evaluateAnswer(question, selected);
    if (!answer) return;
    setResult(answer); setSaving(true); setStorageMessage('');
    try { const saved = await recordAttempt({ moduleId, moduleVersion, optionId: selected, correct: answer.correct }); setStorageMessage(saved ? 'Tentativa salva no perfil local.' : 'Sem perfil local: tentativa não salva.'); }
    catch { setStorageMessage('Não foi possível salvar a tentativa neste navegador.'); }
    finally { setSaving(false); }
  }
  return <section aria-labelledby="exercise-title" className="card">
    <h2 id="exercise-title">Experimente</h2>
    <fieldset><legend>{prompt}</legend>{options.map(option => <div key={option.id}><label><input style={{ width: 'auto', display: 'inline', marginRight: '.5rem' }} type="radio" name="exercise" value={option.id} checked={selected === option.id} onChange={() => { setSelected(option.id); setResult(null); }} />{option.label}</label></div>)}</fieldset>
    <div className="actions"><button className="button" type="button" disabled={!selected || saving} onClick={verify}>Verificar resposta</button><button className="button secondary" type="button" onClick={() => setShowHint(!showHint)} aria-expanded={showHint}>Mostrar ou ocultar dica</button></div>
    {showHint && <p>{hint}</p>}{result && <p role="status"><strong>{result.correct ? 'Correto. ' : 'Ainda não. '}</strong>{result.feedback}</p>}{storageMessage && <p role="status">{storageMessage}</p>}
  </section>;
}
