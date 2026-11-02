import { z } from 'astro/zod';
import { getProfile, replaceProfileIfUnchanged, type Profile } from './profile';

export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
const date = z.iso.datetime();
const attempt = z.strictObject({ moduleId: id, moduleVersion: z.number().int().positive(), optionId: id, correct: z.boolean(), at: date });
const progress = z.strictObject({ moduleVersion: z.number().int().positive(), completed: z.boolean(), updatedAt: date });
const profileSchema = z.strictObject({ schemaVersion: z.literal(1), id: z.uuid(), name: z.string().trim().min(1).max(60), createdAt: date, updatedAt: date, preferences: z.strictObject({ theme: z.literal('system') }), lessonHistory: z.array(z.strictObject({ lessonId: id, lessonVersion: z.number().int().positive(), state: z.enum(['visited', 'started', 'completed']), at: date })).max(10000), attempts: z.array(attempt).max(10000), progress: z.record(id, progress).refine(value => Object.keys(value).length <= 1000) });
const schema = z.strictObject({ format: z.literal('appsectrail-profile'), formatVersion: z.literal(1), exportedAt: date, profile: profileSchema });
export type Backup = z.infer<typeof schema>;

export async function exportProfile(): Promise<string> {
  const profile = await getProfile();
  if (!profile) throw new Error('Nenhum perfil para exportar.');
  const output = JSON.stringify(schema.parse({ format: 'appsectrail-profile', formatVersion: 1, exportedAt: new Date().toISOString(), profile }), null, 2);
  if (new TextEncoder().encode(output).byteLength > MAX_BACKUP_BYTES) throw new Error('Perfil excede o tamanho suportado para backup.');
  return output;
}
export function parseBackup(text: string): Backup {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) throw new Error('Arquivo excede 2 MB.');
  return schema.parse(JSON.parse(text));
}
export async function importProfile(backup: Backup, expected: Profile | null): Promise<void> {
  const checked = schema.parse(backup);
  await replaceProfileIfUnchanged(checked.profile, expected);
}
