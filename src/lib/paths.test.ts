import { describe, expect, it } from 'vitest';
import { resolveSitePath } from './paths';
describe('caminhos internos', () => {
  it('preserva o desenvolvimento na raiz', () => expect(resolveSitePath('/biblioteca/', '/')).toBe('/biblioteca/'));
  it('inclui a base do GitHub Pages', () => expect(resolveSitePath('/biblioteca/', '/AppSecTrail/')).toBe('/AppSecTrail/biblioteca/'));
  it('suporta a página inicial', () => expect(resolveSitePath('/', '/AppSecTrail/')).toBe('/AppSecTrail/'));
});
