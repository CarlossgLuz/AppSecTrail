export function resolveSitePath(path: string, base: string): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
export const sitePath = (path: string) => resolveSitePath(path, import.meta.env.BASE_URL);
