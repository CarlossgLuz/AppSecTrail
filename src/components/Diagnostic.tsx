import { useEffect, useState } from 'react';
import { diagnosticQuestions, evaluateDiagnostic } from '../lib/diagnostic';
import { sitePath } from '../lib/paths';
import { getProfile, recordDiagnostic, type Profile } from '../lib/profile';

export default function Diagnostic() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<ReturnType<typeof evaluateDiagnostic> | null>(null);
  const [message, setMessage] = useState('');
  const [comparison, setComparison] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setMessage('Não foi possível acessar o perfil.'));
  }, []);

  async function submit() {
    setMessage('');
    try {
      const score = evaluateDiagnostic(answers);
      setBusy(true);
      if (!(await recordDiagnostic(answers))) {
        setMessage('Crie um perfil antes de salvar a avaliação.');
        return;
      }
      const previous = [...(profile?.assessments ?? [])]
        .reverse()
        .find(a => a.version === 1 && (!a.assessmentId || a.assessmentId === 'http-piloto'));
      setComparison(previous ? score.percent - previous.percent : null);
      setProfile(await getProfile());
      setSubmittedAnswers({ ...answers });
      setResult(score);
      setMessage('Avaliação salva no perfil.');
    } catch {
      setMessage('Responda todas as questões e confira o armazenamento local.');
    } finally {
      setBusy(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / diagnosticQuestions.length) * 100);
  const isErrorMsg = message.includes('Responda') || message.includes('Não foi') || message.includes('Crie um perfil');

  return (
    <section aria-label="Questionário de diagnóstico">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-fundamentos">Competência F04.05</span>
            <span className="badge badge-neutral">Versão 1 · {diagnosticQuestions.length} questões</span>
          </div>
          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Progresso: {answeredCount}/{diagnosticQuestions.length} respondida(s)
          </span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <p style={{ marginBottom: 0, marginTop: '0.75rem' }}>
          Avaliação piloto de HTTP (F04.05), com duas questões. O resultado mede apenas este questionário, não demonstra domínio prático ou proficiência profissional.
        </p>
      </div>

      {!profile && (
        <p className="status-banner warning">
          <span>
            <a href={sitePath('/perfil/')}>Crie um perfil local</a> para salvar seus resultados e comparar reavaliações futuras neste navegador.
          </span>
        </p>
      )}

      {diagnosticQuestions.map((q, idx) => (
        <div key={q.id} className="question-card">
          <div style={{ marginBottom: '0.55rem' }}>
            <span className="badge badge-neutral">Questão {idx + 1} de {diagnosticQuestions.length}</span>
          </div>
          <fieldset style={{ margin: 0 }}>
            <legend>{q.prompt}</legend>
            <div className="options-list">
              {q.options.map(o => {
                const isSelected = answers[q.id] === o.id;
                return (
                  <label
                    key={o.id}
                    className={`option-card ${isSelected ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={isSelected}
                      onChange={() => setAnswers({ ...answers, [q.id]: o.id })}
                    />
                    <span>{o.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      ))}

      <div className="actions">
        <button className="button" type="button" disabled={busy} onClick={submit}>
          Finalizar avaliação
        </button>
      </div>

      <p
        role="status"
        className={message ? `status-banner ${isErrorMsg ? 'danger' : 'success'}` : undefined}
        style={!message ? { margin: 0 } : undefined}
      >
        {message}
      </p>

      {result && (
        <section className="card" style={{ marginTop: '1.5rem', marginBottom: '1.75rem', borderColor: 'var(--border-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h2 style={{ margin: 0 }}>Resultado</h2>
            <span className={result.percent === 100 ? 'badge badge-success' : 'badge badge-warning'}>
              {result.percent}% de acerto
            </span>
          </div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Competência {result.competencyId}: {result.correct}/{result.total} acertos ({result.percent}%).
          </p>
          {comparison !== null && (
            <p className="notice">
              Variação em relação à avaliação equivalente anterior: {comparison > 0 ? '+' : ''}
              {comparison} pontos percentuais.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: '1rem 0' }}>
            {diagnosticQuestions.map(q => {
              const isCorrect = submittedAnswers[q.id] === q.correctId;
              return (
                <p
                  key={q.id}
                  className={`status-banner ${isCorrect ? 'success' : 'warning'}`}
                  style={{ margin: 0 }}
                >
                  <span>
                    {isCorrect ? 'Correto. ' : 'Incorreto. '}
                    {q.explanation}
                  </span>
                </p>
              );
            })}
          </div>
          {result.correct < result.total && (
            <p className="notice" style={{ marginBottom: 0 }}>
              <span>
                Para revisar os conceitos:{' '}
                <a href={sitePath('/biblioteca/http-essencial/')}>HTTP: requisições e respostas</a>.
              </span>
            </p>
          )}
        </section>
      )}

      <div className="card" style={{ marginTop: '1.75rem' }}>
        <h2>Avaliações anteriores</h2>
        {profile?.assessments?.length ? (
          <ol className="history-list">
            {profile.assessments.map((a, i) => (
              <li key={`${a.at}-${i}`}>
                {new Date(a.at).toLocaleString('pt-BR')} — HTTP v{a.version}: {a.correct}/{a.total} ({a.percent}%)
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ marginBottom: 0 }}>Nenhuma avaliação registrada.</p>
        )}
      </div>
    </section>
  );
}
