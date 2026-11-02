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
        setNotice(
          profile
            ? 'Progresso salvo neste navegador.'
            : 'Crie um perfil para acompanhar seu progresso.',
        );
      })
      .catch(() => setNotice('Não foi possível acessar o progresso local.'));
  }, []);

  const doneCount = modules.filter(m => completed.includes(m.id)).length;
  const percent = modules.length > 0 ? Math.round((doneCount / modules.length) * 100) : 0;

  return (
    <section aria-label="Etapas da trilha">
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: 0 }}>
              Acompanhamento da Trilha
            </h2>
            <p role="status" style={{ margin: '0.2rem 0 0', fontWeight: 600, color: 'var(--text-primary)' }}>
              {notice}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-fundamentos">
              {doneCount}/{modules.length} concluída(s) ({percent}%)
            </span>
            <a className="button secondary" href={sitePath('/perfil/')} style={{ padding: '0.45rem 0.85rem', minHeight: '2.2rem', fontSize: '0.86rem' }}>
              Gerenciar perfil
            </a>
          </div>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ol className="trail-timeline">
        {modules.map((module, index) => {
          const isCompleted = completed.includes(module.id);
          return (
            <li key={module.id} className={`trail-node ${isCompleted ? 'is-completed' : ''}`}>
              <div className="trail-marker-col" aria-hidden="true">
                <span className="trail-marker">{isCompleted ? '✓' : index + 1}</span>
                {index < modules.length - 1 && <span className="trail-line" />}
              </div>
              <div className="card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className="badge badge-neutral">Etapa {index + 1} · Recomendada</span>
                  <span className={isCompleted ? 'badge badge-success' : 'badge badge-warning'}>
                    {isCompleted ? 'Concluída no perfil local' : 'Ainda não concluída'}
                  </span>
                </div>
                <h3>
                  <a href={sitePath(`/biblioteca/${encodeURIComponent(module.id)}/`)}>{module.title}</a>
                </h3>
                <p>{module.summary}</p>
                <div className="actions" style={{ margin: '0.9rem 0 0' }}>
                  <a className="button" href={sitePath(`/biblioteca/${encodeURIComponent(module.id)}/`)} aria-hidden="true" tabIndex={-1}>
                    {isCompleted ? 'Revisar módulo' : 'Iniciar módulo'}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'var(--surface-subtle)' }}>
        <div>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
            Prefere estudar fora da ordem?
          </strong>
          <p style={{ margin: 0, fontSize: '0.92rem' }}>
            Os pré-requisitos são apenas recomendações pedagógicas. Todos os módulos estão abertos na biblioteca.
          </p>
        </div>
        <div className="actions" style={{ margin: 0 }}>
          <a className="button secondary" href={sitePath('/biblioteca/')}>Explorar todos os módulos livremente</a>
          <a className="button secondary" href={sitePath('/diagnostico/')}>Testar com diagnóstico</a>
        </div>
      </div>
    </section>
  );
}
