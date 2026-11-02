import { useEffect, useState } from 'react';
import { diagnosticQuestions, evaluateDiagnostic } from '../lib/diagnostic';
import { getProfile, recordDiagnostic, type Profile } from '../lib/profile';

export default function Diagnostic() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<ReturnType<typeof evaluateDiagnostic> | null>(null);
  const [message, setMessage] = useState('');
  const [comparison, setComparison] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { getProfile().then(setProfile).catch(() => setMessage('Não foi possível acessar o perfil.')); }, []);
  async function submit() {
    setMessage('');
    try {
      const score = evaluateDiagnostic(answers);
      setBusy(true);
      if (!await recordDiagnostic(answers)) { setMessage('Crie um perfil antes de salvar a avaliação.'); return; }
      const previous = [...(profile?.assessments ?? [])].reverse().find(a => a.version === 1 && (!a.assessmentId || a.assessmentId === 'http-piloto'));
      setComparison(previous ? score.percent - previous.percent : null);
      setProfile(await getProfile()); setSubmittedAnswers({ ...answers }); setResult(score); setMessage('Avaliação salva no perfil.');
    } catch { setMessage('Responda todas as questões e confira o armazenamento local.'); }
    finally { setBusy(false); }
  }
  return <section><p>Avaliação piloto de HTTP (F04.05), com duas questões. O resultado mede apenas este questionário, não demonstra domínio prático ou proficiência profissional.</p>{!profile && <p><a href="/perfil/">Crie um perfil local</a> para salvar seus resultados.</p>}{diagnosticQuestions.map(q => <fieldset key={q.id}><legend>{q.prompt}</legend>{q.options.map(o => <label key={o.id}><input type="radio" name={q.id} value={o.id} checked={answers[q.id] === o.id} onChange={() => setAnswers({ ...answers, [q.id]: o.id })} /> {o.label}</label>)}</fieldset>)}<button className="button" type="button" disabled={busy} onClick={submit}>Finalizar avaliação</button><p role="status">{message}</p>{result && <section><h2>Resultado</h2><p>Competência {result.competencyId}: {result.correct}/{result.total} acertos ({result.percent}%).</p>{comparison !== null && <p>Variação em relação à avaliação equivalente anterior: {comparison > 0 ? '+' : ''}{comparison} pontos percentuais.</p>}{diagnosticQuestions.map(q => <p key={q.id}>{submittedAnswers[q.id] === q.correctId ? 'Correto. ' : 'Incorreto. '}{q.explanation}</p>)}{result.correct < result.total && <p>Para revisar os conceitos: <a href="/biblioteca/http-essencial/">HTTP: requisições e respostas</a>.</p>}</section>}<h2>Avaliações anteriores</h2>{profile?.assessments?.length ? <ol>{profile.assessments.map((a, i) => <li key={`${a.at}-${i}`}>{new Date(a.at).toLocaleString('pt-BR')} — HTTP v{a.version}: {a.correct}/{a.total} ({a.percent}%)</li>)}</ol> : <p>Nenhuma avaliação registrada.</p>}</section>;
}
