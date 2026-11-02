import { useState } from 'react';
import { evaluateAnswer, type Question } from '../lib/exercise';
import { recordAttempt } from '../lib/profile';

type Option = { id: string; label: string; feedback: string };
type Props = {
  prompt: string;
  correctId: string;
  options: Option[];
  hint: string;
  moduleId: string;
  moduleVersion: number;
};

export default function Exercise({
  prompt,
  correctId,
  options,
  hint,
  moduleId,
  moduleVersion,
}: Props) {
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState<ReturnType<typeof evaluateAnswer>>(null);
  const [showHint, setShowHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');

  const question: Question = { correctId, options };

  async function verify() {
    const answer = evaluateAnswer(question, selected);
    if (!answer) return;
    setResult(answer);
    setSaving(true);
    setStorageMessage('');
    try {
      const saved = await recordAttempt({
        moduleId,
        moduleVersion,
        optionId: selected,
        correct: answer.correct,
      });
      setStorageMessage(
        saved ? 'Tentativa salva no perfil local.' : 'Sem perfil local: tentativa não salva.',
      );
    } catch {
      setStorageMessage('Não foi possível salvar a tentativa neste navegador.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="exercise-title" className="exercise-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span className="badge badge-appsec">Verificação Prática</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Módulo v{moduleVersion}</span>
      </div>
      <h2 id="exercise-title" style={{ marginTop: 0 }}>Experimente</h2>

      <fieldset>
        <legend>{prompt}</legend>
        <div className="options-list">
          {options.map(option => {
            const isSelected = selected === option.id;
            return (
              <label
                key={option.id}
                className={`option-card ${isSelected ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="exercise"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => {
                    setSelected(option.id);
                    setResult(null);
                  }}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="actions">
        <button
          className="button"
          type="button"
          disabled={!selected || saving}
          onClick={verify}
        >
          Verificar resposta
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={() => setShowHint(!showHint)}
          aria-expanded={showHint}
        >
          Mostrar ou ocultar dica
        </button>
      </div>

      {showHint && (
        <p className="hint-box">
          <strong>Dica: </strong>
          {hint}
        </p>
      )}

      {result && (
        <p
          role="status"
          className={`status-banner ${result.correct ? 'success' : 'warning'}`}
        >
          <span>
            <strong>{result.correct ? 'Correto. ' : 'Ainda não. '}</strong>
            {result.feedback}
          </span>
        </p>
      )}

      {storageMessage && (
        <p
          role="status"
          style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}
        >
          {storageMessage}
        </p>
      )}
    </section>
  );
}
