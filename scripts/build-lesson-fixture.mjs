import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// This isolated build exposes the draft only inside the test fixture, never in dist/.
const root = process.cwd();
const fixture = resolve(root, '.test-fixture');
rmSync(fixture, { recursive: true, force: true });
mkdirSync(fixture, { recursive: true });
for (const name of ['src', 'astro.config.mjs', 'tsconfig.json', 'package.json']) cpSync(resolve(root, name), resolve(fixture, name), { recursive: true });
symlinkSync(resolve(root, 'node_modules'), resolve(fixture, 'node_modules'), 'dir');
const lesson = resolve(fixture, 'src/content/modules/http-essencial.md');
const content = readFileSync(lesson, 'utf8');
if (!content.includes('draft: true') && !content.includes('draft: false')) throw new Error('Estado editorial da aula não encontrado.');
writeFileSync(lesson, content.replace('draft: true', 'draft: false'));
// Expose package drafts only in the disposable test build. Review flags here are
// fixture settings, never changes to the canonical editorial status.
for (const slug of ['fundamentos-computacao-sistemas-01', 'fundamentos-logica-programacao-01', 'fundamentos-redes-dns-tls-01']) {
  const path = resolve(fixture, `src/content/modules/${slug}.md`);
  const draft = readFileSync(path, 'utf8');
  if (draft.includes('draft: true')) {
    writeFileSync(path, draft.replace('draft: true', 'draft: false').replace('technicalReviewStatus: pending', 'technicalReviewStatus: reviewed').replace('pedagogicalReview: pending', 'pedagogicalReview: reviewed'));
  } else if (!draft.includes('draft: false')) throw new Error(`Estado editorial desconhecido: ${slug}`);
}
const result = spawnSync(resolve(root, 'node_modules/.bin/astro'), ['build', '--root', fixture], { stdio: 'inherit', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
if (result.error || result.status !== 0) throw result.error ?? new Error('Falha no build da fixture.');
