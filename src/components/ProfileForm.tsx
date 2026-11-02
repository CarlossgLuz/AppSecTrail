import { useEffect, useState, type SubmitEvent } from 'react';
import { createProfile, getProfile, renameProfile, type Profile } from '../lib/profile';

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then(value => {
        if (mounted) {
          setProfile(value);
          setName(value?.name ?? '');
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) setMessage('Não foi possível acessar o armazenamento deste navegador.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const result = profile ? await renameProfile(name) : await createProfile(name);
      setProfile(result);
      setName(result.name);
      setMessage('Perfil salvo neste navegador.');
    } catch {
      setMessage('Não foi possível salvar. Confira o nome e tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const completedCount = profile
    ? new Set(
        profile.lessonHistory
          .filter(item => item.state === 'completed')
          .map(item => item.lessonId),
      ).size
    : 0;

  const isError = message.includes('Não foi');

  return (
    <section aria-labelledby="profile-title">
      {profile && (
        <div className="stats-row" aria-label="Resumo de aprendizagem">
          <div className="stat-card">
            <span className="stat-label">Estudante local</span>
            <span className="stat-value" style={{ fontSize: '1.3rem' }}>{profile.name}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Aulas concluídas</span>
            <span className="stat-value">{completedCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Tentativas de prática</span>
            <span className="stat-value">{profile.attempts.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Diagnósticos salvos</span>
            <span className="stat-value">{profile.assessments?.length ?? 0}</span>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h2 id="profile-title" style={{ margin: 0 }}>
            {profile ? 'Editar perfil' : 'Criar perfil'}
          </h2>
          <span className="badge badge-neutral">Armazenamento IndexedDB</span>
        </div>
        <p>
          O nome fica somente neste navegador. Limpar os dados do site pode apagar seu perfil; exporte um backup para preservar seus dados.
        </p>
        <form onSubmit={submit}>
          <label htmlFor="profile-name">Nome ou apelido</label>
          <input
            id="profile-name"
            value={name}
            placeholder="Como você prefere ser identificado(a) localmente"
            onChange={event => setName(event.target.value)}
            required
            maxLength={60}
            disabled={!ready || busy}
          />
          <button className="button" type="submit" disabled={!ready || busy}>
            {busy ? 'Salvando…' : 'Salvar perfil'}
          </button>
        </form>
        <p
          role="status"
          className={message ? `status-banner ${isError ? 'danger' : 'success'}` : undefined}
          style={!message ? { margin: 0 } : { marginBottom: 0 }}
        >
          {message}
        </p>
      </div>

      {profile && (
        <div className="dashboard-grid">
          <section aria-labelledby="lessons-title" className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h2 id="lessons-title" style={{ margin: 0 }}>Histórico de aulas</h2>
              <span className="badge badge-fundamentos">Aulas concluídas: {completedCount}</span>
            </div>
            {profile.lessonHistory.length === 0 ? (
              <p style={{ marginBottom: 0 }}>Ainda não há aulas registradas.</p>
            ) : (
              <ol className="history-list">
                {profile.lessonHistory.map((item, index) => (
                  <li key={`${item.at}-${index}`}>
                    {item.lessonId} (v{item.lessonVersion}) —{' '}
                    {item.state === 'visited'
                      ? 'visitada'
                      : item.state === 'started'
                        ? 'iniciada'
                        : 'concluída'}{' '}
                    — {new Date(item.at).toLocaleString('pt-BR')}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section aria-labelledby="history-title" className="card">
            <h2 id="history-title" style={{ marginTop: 0 }}>Histórico de tentativas</h2>
            <p>As tentativas indicam respostas registradas, não domínio profissional.</p>
            {profile.attempts.length === 0 ? (
              <p style={{ marginBottom: 0 }}>Ainda não há tentativas salvas.</p>
            ) : (
              <ol className="history-list">
                {profile.attempts.map((attempt, index) => (
                  <li key={`${attempt.at}-${index}`}>
                    {attempt.moduleId} — {attempt.correct ? 'acertou' : 'errou'} —{' '}
                    {new Date(attempt.at).toLocaleString('pt-BR')}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
