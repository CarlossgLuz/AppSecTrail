import { useEffect, useState, type SubmitEvent } from 'react';
import { createProfile, getProfile, renameProfile, type Profile } from '../lib/profile';

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { let mounted = true; getProfile().then(value => { if (mounted) { setProfile(value); setName(value?.name ?? ''); setReady(true); } }).catch(() => { if (mounted) setMessage('Não foi possível acessar o armazenamento deste navegador.'); }); return () => { mounted = false; }; }, []);
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { const result = profile ? await renameProfile(name) : await createProfile(name); setProfile(result); setName(result.name); setMessage('Perfil salvo neste navegador.'); }
    catch { setMessage('Não foi possível salvar. Confira o nome e tente novamente.'); }
    finally { setBusy(false); }
  }
  return <section aria-labelledby="profile-title"><h2 id="profile-title">{profile ? 'Editar perfil' : 'Criar perfil'}</h2><p>O nome fica somente neste navegador. Limpar os dados do site pode apagar seu perfil; exportação ainda está em desenvolvimento.</p><form onSubmit={submit}><label htmlFor="profile-name">Nome ou apelido</label><input id="profile-name" value={name} onChange={event => setName(event.target.value)} required maxLength={60} disabled={!ready || busy} /><button className="button" type="submit" disabled={!ready || busy}>{busy ? 'Salvando…' : 'Salvar perfil'}</button></form><p role="status">{message}</p>{profile && <section aria-labelledby="history-title"><h2 id="history-title">Histórico de tentativas</h2><p>As tentativas indicam respostas registradas, não domínio profissional.</p>{profile.attempts.length === 0 ? <p>Ainda não há tentativas salvas.</p> : <ol>{profile.attempts.map((attempt, index) => <li key={`${attempt.at}-${index}`}>{attempt.moduleId} — {attempt.correct ? 'acertou' : 'errou'} — {new Date(attempt.at).toLocaleString('pt-BR')}</li>)}</ol>}</section>}</section>;
}
