export type Attempt = { moduleId: string; moduleVersion: number; optionId: string; correct: boolean; at: string };
export type ModuleProgress = { moduleVersion: number; completed: boolean; updatedAt: string };
export type Profile = { schemaVersion: 1; id: string; name: string; createdAt: string; updatedAt: string; preferences: { theme: 'system' }; lessonHistory: never[]; attempts: Attempt[]; progress: Record<string, ModuleProgress> };
const DB_NAME = 'appsectrail-profile';
type RecordData = { key: 'active'; data: Profile };

function validateName(value: string): string {
  const name = value.trim();
  if (!name || Array.from(name).length > 60) throw new Error('Informe um nome entre 1 e 60 caracteres.');
  return name;
}
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('profiles', { keyPath: 'key' });
    request.onsuccess = () => { const db = request.result; db.onversionchange = () => db.close(); resolve(db); };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Banco local bloqueado por outra aba.'));
  });
}
async function access<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore, done: (value: T) => void) => void): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profiles', mode); let value: T;
    tx.oncomplete = () => { db.close(); resolve(value); };
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Não foi possível salvar os dados locais.')); };
    tx.onerror = () => { /* onabort reports the transaction error */ };
    try { action(tx.objectStore('profiles'), result => { value = result; }); } catch (error) { tx.abort(); db.close(); reject(error); }
  });
}
export async function getProfile(): Promise<Profile | null> {
  return access('readonly', (store, done) => { const request = store.get('active'); request.onsuccess = () => done((request.result as RecordData | undefined)?.data ?? null); });
}
export async function createProfile(value: string): Promise<Profile> {
  const name = validateName(value); const now = new Date().toISOString();
  const profile: Profile = { schemaVersion: 1, id: crypto.randomUUID(), name, createdAt: now, updatedAt: now, preferences: { theme: 'system' }, lessonHistory: [], attempts: [], progress: {} };
  return access('readwrite', (store, done) => { store.add({ key: 'active', data: profile } satisfies RecordData); done(profile); });
}
export async function renameProfile(value: string): Promise<Profile> {
  const name = validateName(value);
  return access('readwrite', (store, done) => { const request = store.get('active'); request.onsuccess = () => { const current = request.result as RecordData | undefined; if (!current) { request.transaction?.abort(); return; } const profile = { ...current.data, name, updatedAt: new Date().toISOString() }; store.put({ key: 'active', data: profile } satisfies RecordData); done(profile); }; });
}
export async function recordAttempt(input: Omit<Attempt, 'at'>): Promise<boolean> {
  return access('readwrite', (store, done) => {
    const request = store.get('active');
    request.onsuccess = () => {
      const current = request.result as RecordData | undefined;
      if (!current) { done(false); return; }
      const at = new Date().toISOString();
      const previous = current.data.progress[input.moduleId];
      const completed = input.correct || (previous?.moduleVersion === input.moduleVersion && previous.completed);
      const data: Profile = { ...current.data, updatedAt: at, attempts: [...current.data.attempts, { ...input, at }], progress: { ...current.data.progress, [input.moduleId]: { moduleVersion: input.moduleVersion, completed, updatedAt: at } } };
      store.put({ key: 'active', data } satisfies RecordData);
      done(true);
    };
  });
}
export async function replaceProfileIfUnchanged(profile: Profile, expected: Profile | null): Promise<void> {
  return access('readwrite', (store, done) => {
    const request = store.get('active');
    request.onsuccess = () => {
      const current = (request.result as RecordData | undefined)?.data ?? null;
      if (JSON.stringify(current) !== JSON.stringify(expected)) { request.transaction?.abort(); return; }
      store.put({ key: 'active', data: profile } satisfies RecordData);
      done(undefined);
    };
  });
}
