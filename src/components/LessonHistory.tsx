import { useEffect, useState } from 'react';
import { recordLessonEvent, type LessonEvent } from '../lib/profile';

export default function LessonHistory({ lessonId, lessonVersion }: { lessonId: string; lessonVersion: number }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { recordLessonEvent(lessonId, lessonVersion, 'visited').catch(() => setMessage('Não foi possível registrar a visita.')); }, [lessonId, lessonVersion]);
  async function save(state: LessonEvent['state']) {
    setBusy(true);
    try { setMessage(await recordLessonEvent(lessonId, lessonVersion, state) ? 'Registro salvo no perfil.' : 'Crie um perfil para salvar seu histórico.'); }
    catch { setMessage('Não foi possível salvar o registro.'); }
    finally { setBusy(false); }
  }
  return <section aria-label="Progresso da aula"><button className="button secondary" type="button" disabled={busy} onClick={() => save('started')}>Iniciar estudo</button> <button className="button" type="button" disabled={busy} onClick={() => save('completed')}>Marcar aula como concluída</button><p role="status">{message}</p></section>;
}
