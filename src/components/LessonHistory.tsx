import { useEffect, useState } from 'react';
import { recordLessonEvent, type LessonEvent } from '../lib/profile';

export default function LessonHistory({
  lessonId,
  lessonVersion,
}: {
  lessonId: string;
  lessonVersion: number;
}) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    recordLessonEvent(lessonId, lessonVersion, 'visited')
      .then(saved =>
        setMessage(
          saved ? 'Visita salva no perfil.' : 'Crie um perfil para salvar seu histórico.',
        ),
      )
      .catch(() => setMessage('Não foi possível registrar a visita.'));
  }, [lessonId, lessonVersion]);

  async function save(state: LessonEvent['state']) {
    setBusy(true);
    setMessage('');
    try {
      setMessage(
        (await recordLessonEvent(lessonId, lessonVersion, state))
          ? 'Registro salvo no perfil.'
          : 'Crie um perfil para salvar seu histórico.',
      );
    } catch {
      setMessage('Não foi possível salvar o registro.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Progresso da aula" className="card" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem' }}>Registro de estudo local</h3>
          <p role="status" style={{ margin: 0, fontSize: '0.92rem' }}>
            {message}
          </p>
        </div>
        <div className="actions" style={{ margin: 0 }}>
          <button
            className="button secondary"
            type="button"
            disabled={busy}
            onClick={() => save('started')}
          >
            Iniciar estudo
          </button>
          <button
            className="button"
            type="button"
            disabled={busy}
            onClick={() => save('completed')}
          >
            Marcar aula como concluída
          </button>
        </div>
      </div>
    </section>
  );
}
