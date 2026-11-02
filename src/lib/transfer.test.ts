import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { createProfile, getProfile, renameProfile, recordAttempt } from './profile';
import { exportProfile, parseBackup, importProfile } from './transfer';

afterEach(async () => { await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase('appsectrail-profile'); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); });
describe('portabilidade de perfil', () => {
  it('exporta histórico e importa em um banco limpo', async () => {
    await createProfile('Ana');
    await recordAttempt({ moduleId: 'http-essencial', moduleVersion: 1, optionId: 'resposta', correct: true });
    const previous = await getProfile();
    const backup = parseBackup(await exportProfile());
    await new Promise<void>((resolve, reject) => { const r = indexedDB.deleteDatabase('appsectrail-profile'); r.onsuccess = () => resolve(); r.onerror = () => reject(r.error); });
    await importProfile(backup, null);
    expect(await getProfile()).toEqual(previous);
  });
  it('rejeita JSON inválido, versão desconhecida e propriedades extras', async () => {
    expect(() => parseBackup('{')).toThrow();
    await createProfile('Ana');
    const data = JSON.parse(await exportProfile());
    expect(() => parseBackup(JSON.stringify({ ...data, formatVersion: 99 }))).toThrow();
    expect(() => parseBackup(JSON.stringify({ ...data, extra: 'x' }))).toThrow();
  });
  it('não substitui perfil modificado desde a prévia', async () => {
    await createProfile('Ana');
    const backup = parseBackup(await exportProfile());
    const before = await getProfile();
    await renameProfile('Lia');
    await expect(importProfile(backup, before)).rejects.toThrow();
    expect((await getProfile())?.name).toBe('Lia');
  });
});
