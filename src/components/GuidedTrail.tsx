import { useEffect, useState } from 'react';
import { sitePath } from '../lib/paths';
import { getProfile } from '../lib/profile';

type Module = { id: string; title: string; summary: string };

export default function GuidedTrail({ modules }: { modules: Module[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [notice, setNotice] = useState('Carregando progresso local…');

  useEffect(() => {
    getProfile()
      .then(profile => {
        setCompleted(
          profile?.lessonHistory
            .filter(event => event.state === 'completed')
            .map(event => event.lessonId) ?? [],
        );
        setNotice(profile ? 'Progresso salvo neste navegador.' : 'Crie um perfil para acompanhar seu progresso.');
      })
      .catch(() => setNotice('Não foi possível acessar o progresso local.'));
  }, []);

  const doneCount = modules.filter(module => completed.includes(module.id)).length;
  const percent = modules.length ? Math.round(doneCount / modules.length * 100) : 0;

  return (
    <section aria-label="Etapas da trilha">
      <div className="minimal-trail-progress">
        <p role="status">{notice}</p>
        <p>{doneCount} de {modules.length} aulas concluídas · {percent}%</p>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <ol className="trail-timeline">
        {modules.map((module, index) => {
          const done = completed.includes(module.id);
          return (
            <li key={module.id} className={`trail-node ${done ? 'is-completed' : ''}`}>
              <div className="trail-marker-col" aria-hidden="true">
                <span className="trail-marker">{done ? '✓' : index + 1}</span>
                {index < modules.length - 1 && <span className="trail-line" />}
              </div>
              <div className="minimal-trail-step">
                <h2><a href={sitePath(`/biblioteca/${encodeURIComponent(module.id)}/`)}>{module.title}</a></h2>
                <p>{module.summary}</p>
                {done && <small>Concluída no perfil local</small>}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="minimal-trail-note">Prefere escolher outro assunto? <a href={sitePath('/biblioteca/')}>Acesse todas as aulas livremente.</a></p>
    </section>
  );
}
