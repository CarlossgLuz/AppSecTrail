import { useEffect, useState, type ChangeEvent } from 'react';
import { getProfile, type Profile } from '../lib/profile';
import { exportProfile, importProfile, MAX_BACKUP_BYTES, parseBackup, type Backup } from '../lib/transfer';

export default function ProfileTransfer() {
  const [preview, setPreview] = useState<{ backup: Backup; current: Profile | null } | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  async function download() {
    setMessage('');
    try { const text = await exportProfile(); const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'appsectrail-perfil.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Arquivo de backup gerado. Guarde-o em local seguro.'); }
    catch (error) { setMessage(error instanceof Error && error.message.includes('tamanho suportado') ? 'O perfil excede 2 MB e ainda não pode ser exportado. Não apague os dados locais.' : 'Não foi possível exportar o perfil.'); }
  }
  async function choose(event: ChangeEvent<HTMLInputElement>) {
    setPreview(null); setMessage(''); const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) { setMessage('Arquivo maior que 2 MB.'); return; }
    setBusy(true);
    try { const backup = parseBackup(await file.text()); const current = await getProfile(); setPreview({ backup, current }); }
    catch { setMessage('Arquivo inválido ou versão não suportada. Nenhum dado foi alterado.'); }
    finally { setBusy(false); }
  }
  async function confirm() {
    if (!preview) return; setBusy(true); setMessage('');
    try { await importProfile(preview.backup, preview.current); setPreview(null); setMessage('Perfil importado. Recarregue a página para ver os dados.'); }
    catch { setPreview(null); setMessage('Importação cancelada: o perfil pode ter mudado ou o armazenamento está indisponível. Selecione o arquivo novamente.'); }
    finally { setBusy(false); }
  }
  return <section aria-labelledby="transfer-title"><h2 id="transfer-title">Backup do perfil</h2><p>O arquivo pode conter seu nome e histórico. Guarde-o em local seguro; a transferência é feita por você, sem sincronização automática.</p><button className="button" type="button" onClick={download} disabled={!ready || busy}>Exportar perfil JSON</button><label htmlFor="backup-file">Selecionar backup JSON</label><input id="backup-file" type="file" accept="application/json,.json" onChange={choose} disabled={!ready || busy} />{preview && <div className="card"><h3>Prévia da importação</h3><p>Perfil: {preview.backup.profile.name}. Tentativas: {preview.backup.profile.attempts.length}. Versão do arquivo: {preview.backup.formatVersion}.</p><p>{preview.current ? 'A confirmação substituirá o perfil deste navegador e seu histórico.' : 'Um novo perfil será criado neste navegador.'}</p><button className="button" type="button" disabled={busy} onClick={confirm}>Confirmar importação</button> <button className="button secondary" type="button" disabled={busy} onClick={() => setPreview(null)}>Cancelar</button></div>}<p role="status">{message}</p></section>;
}
