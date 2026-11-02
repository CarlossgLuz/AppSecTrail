import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { createProfile, getProfile, renameProfile, recordAttempt, recordLessonEvent, recordDiagnostic } from './profile';

afterEach(async () => { await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase('appsectrail-profile'); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); });

describe('perfil local', () => {
  it('preserva avaliações anteriores no perfil', async () => {
    await createProfile('Ana');
    await recordDiagnostic({ 'http-resposta': 'servidor', 'http-metodo': 'get' });
    await recordDiagnostic({ 'http-resposta': 'cliente', 'http-metodo': 'get' });
    expect((await getProfile())?.assessments?.map(a => a.correct)).toEqual([2, 1]);
  });
  it('rejeita dados inválidos de aula sem alterar o perfil', async () => {
    await createProfile('Ana');
    const before = await getProfile();
    await expect(recordLessonEvent('../invalido', 0, 'visited')).rejects.toThrow();
    expect(await getProfile()).toEqual(before);
  });
  it('registra visita, início e conclusão sem confundir seus estados', async () => {
    await createProfile('Ana');
    await recordLessonEvent('http-essencial', 1, 'visited');
    expect((await getProfile())?.lessonHistory.map(e => e.state)).toEqual(['visited']);
    await recordLessonEvent('http-essencial', 1, 'started');
    await recordLessonEvent('http-essencial', 1, 'completed');
    expect((await getProfile())?.lessonHistory.map(e => e.state)).toEqual(['visited', 'started', 'completed']);
  });
  it('cria e recupera um perfil com nome normalizado e contrato versionado', async () => {
    const profile = await createProfile('  Ana  ');
    expect(profile.name).toBe('Ana');
    expect(profile.schemaVersion).toBe(1);
    expect(await getProfile()).toEqual(profile);
  });
  it('altera o nome preservando identidade e data de criação', async () => {
    const initial = await createProfile('Ana');
    const updated = await renameProfile('Lia');
    expect(updated).toMatchObject({ id: initial.id, createdAt: initial.createdAt, name: 'Lia' });
    expect(await getProfile()).toEqual(updated);
  });
  it('rejeita nomes vazios ou maiores que 60 caracteres', async () => {
    await expect(createProfile('  ')).rejects.toThrow();
    await expect(createProfile('a'.repeat(61))).rejects.toThrow();
    expect(await getProfile()).toBeNull();
  });
  it('não sobrescreve um perfil existente ao criar outro', async () => {
    const initial = await createProfile('Ana');
    await expect(createProfile('Lia')).rejects.toThrow();
    expect(await getProfile()).toEqual(initial);
  });
  it('registra tentativas e progresso de módulo sem alterar a identidade', async () => {
    const initial = await createProfile('Ana');
    await recordAttempt({ moduleId: 'http-essencial', moduleVersion: 1, optionId: 'pedido', correct: false });
    await recordAttempt({ moduleId: 'http-essencial', moduleVersion: 1, optionId: 'resposta', correct: true });
    const saved = await getProfile();
    expect(saved?.id).toBe(initial.id);
    expect(saved?.attempts).toHaveLength(2);
    expect(saved?.attempts.map(item => item.correct)).toEqual([false, true]);
    expect(saved?.progress['http-essencial']).toMatchObject({ moduleVersion: 1, completed: true });
  });
  it('não exige perfil nem cria um automaticamente para registrar tentativa', async () => {
    expect(await recordAttempt({ moduleId: 'http-essencial', moduleVersion: 1, optionId: 'resposta', correct: true })).toBe(false);
    expect(await getProfile()).toBeNull();
  });
});
