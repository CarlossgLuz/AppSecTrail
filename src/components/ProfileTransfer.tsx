import { useEffect, useState, type ChangeEvent } from 'react';
import { getProfile, type Profile } from '../lib/profile';
import {
  exportProfile,
  importProfile,
  MAX_BACKUP_BYTES,
  parseBackup,
  type Backup,
} from '../lib/transfer';

export default function ProfileTransfer() {
  const [preview, setPreview] = useState<{ backup: Backup; current: Profile | null } | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function download() {
    setMessage('');
    try {
      const text = await exportProfile();
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'appsectrail-perfil.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Arquivo de backup gerado. Guarde-o em local seguro.');
    } catch (error) {
      setMessage(
        error instanceof Error && error.message.includes('tamanho suportado')
          ? 'O perfil excede 2 MB e ainda não pode ser exportado. Não apague os dados locais.'
          : 'Não foi possível exportar o perfil.',
      );
    }
  }

  async function choose(event: ChangeEvent<HTMLInputElement>) {
    setPreview(null);
    setMessage('');
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      setMessage('Arquivo maior que 2 MB.');
      return;
    }
    setBusy(true);
    try {
      const backup = parseBackup(await file.text());
      const current = await getProfile();
      setPreview({ backup, current });
    } catch {
      setMessage('Arquivo inválido ou versão não suportada. Nenhum dado foi alterado.');
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!preview) return;
    setBusy(true);
    setMessage('');
    try {
      await importProfile(preview.backup, preview.current);
      setPreview(null);
      setMessage('Perfil importado. Recarregue a página para ver os dados.');
    } catch {
      setPreview(null);
      setMessage(
        'Importação cancelada: o perfil pode ter mudado ou o armazenamento está indisponível. Selecione o arquivo novamente.',
      );
    } finally {
      setBusy(false);
    }
  }

  const isError =
    message.includes('inválido') ||
    message.includes('Não foi') ||
    message.includes('excede') ||
    message.includes('maior') ||
    message.includes('cancelada');

  return (
    <section aria-labelledby="transfer-title" className="card" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h2 id="transfer-title" style={{ margin: 0 }}>Backup do perfil</h2>
        <span className="badge badge-devsecops">Portabilidade JSON (máx. 2 MB)</span>
      </div>
      <p>
        O arquivo pode conter seu nome e histórico. Guarde-o em local seguro; a transferência é feita por você, sem sincronização automática.
      </p>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button
          className="button secondary"
          type="button"
          onClick={download}
          disabled={!ready || busy}
        >
          Exportar perfil JSON
        </button>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <label htmlFor="backup-file">Selecionar backup JSON</label>
        <input
          id="backup-file"
          type="file"
          accept="application/json,.json"
          onChange={choose}
          disabled={!ready || busy}
        />
      </div>

      {preview && (
        <div className="card" style={{ background: 'var(--surface-raised)', borderColor: 'var(--accent-amber-border)', marginTop: '1rem' }}>
          <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Revisão obrigatória</span>
          <h3>Prévia da importação</h3>
          <p>
            Perfil: {preview.backup.profile.name}. Tentativas: {preview.backup.profile.attempts.length}. Versão do arquivo: {preview.backup.formatVersion}.
          </p>
          <p>
            {preview.current
              ? 'A confirmação substituirá o perfil deste navegador e seu histórico.'
              : 'Um novo perfil será criado neste navegador.'}
          </p>
          <div className="actions" style={{ marginBottom: 0 }}>
            <button className="button" type="button" disabled={busy} onClick={confirm}>
              Confirmar importação
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={busy}
              onClick={() => setPreview(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <p
        role="status"
        className={message ? `status-banner ${isError ? 'danger' : 'success'}` : undefined}
        style={!message ? { margin: 0 } : { marginBottom: 0 }}
      >
        {message}
      </p>
    </section>
  );
}
