import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { createProfile, getProfile, renameProfile, recordAttempt, recordLessonEvent, recordDiagnostic } from './profile';
import { exportProfile, parseBackup, importProfile, MAX_BACKUP_BYTES } from './transfer';

afterEach(async () => { await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase('appsectrail-profile'); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); });
describe('portabilidade de perfil', () => {
  it('preserva avaliação v1 e rejeita pontuação e versão incompatíveis', async () => {
    await createProfile('Ana');
    await recordDiagnostic({ 'http-resposta': 'servidor', 'http-metodo': 'get' });
    const expected = await getProfile();
    const backup = parseBackup(await exportProfile());
    await importProfile(backup, expected);
    expect(await getProfile()).toEqual(expected);
    const broken = JSON.parse(JSON.stringify(backup));
    broken.profile.assessments[0].correct = 0;
    expect(() => parseBackup(JSON.stringify(broken))).toThrow();
    broken.profile.assessments[0].version = 2;
    expect(() => parseBackup(JSON.stringify(broken))).toThrow();
  });
  it('preserva eventos de aula na exportação e importação', async () => {
    await createProfile('Ana');
    await recordLessonEvent('http-essencial', 1, 'visited');
    await recordLessonEvent('http-essencial', 1, 'completed');
    const before = await getProfile();
    const backup = parseBackup(await exportProfile());
    await importProfile(backup, before);
    expect((await getProfile())?.lessonHistory).toEqual(before?.lessonHistory);
  });
  it('aceita backup anterior sem histórico e rejeita evento inválido', async () => {
    await createProfile('Ana');
    const old = JSON.parse(await exportProfile());
    expect(parseBackup(JSON.stringify(old)).profile.lessonHistory).toEqual([]);
    old.profile.lessonHistory = [{ lessonId: 'http-essencial', lessonVersion: 1, state: 'inventado', at: new Date().toISOString() }];
    expect(() => parseBackup(JSON.stringify(old))).toThrow();
  });
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
    expect(() => parseBackup(' '.repeat(MAX_BACKUP_BYTES + 1))).toThrow();
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
