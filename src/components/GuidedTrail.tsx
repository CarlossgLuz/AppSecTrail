import { useEffect, useState } from 'react';
import { getProfile } from '../lib/profile';

type Module = { id: string; title: string; summary: string };
export default function GuidedTrail({ modules }: { modules: Module[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [notice, setNotice] = useState('Carregando progresso local…');
  useEffect(() => { getProfile().then(profile => { setCompleted(profile?.lessonHistory.filter(event => event.state === 'completed').map(event => event.lessonId) ?? []); setNotice(profile ? 'Progresso salvo neste navegador.' : 'Crie um perfil para acompanhar seu progresso.'); }).catch(() => setNotice('Não foi possível acessar o progresso local.')); }, []);
  return <section><p role="status">{notice}</p><ol>{modules.map(module => <li key={module.id}><h3><a href={`/biblioteca/${module.id}/`}>{module.title}</a></h3><p>{module.summary}</p><p>{completed.includes(module.id) ? 'Concluída no perfil local' : 'Ainda não concluída'}</p></li>)}</ol><p><a href="/biblioteca/">Explorar todos os módulos livremente</a></p></section>;
}
