import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { createProfile, getProfile, renameProfile } from './profile';

afterEach(async () => { await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase('appsectrail-profile'); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); });

describe('perfil local', () => {
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
});
