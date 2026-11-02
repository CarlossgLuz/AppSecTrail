export interface ModuleSummary { id: string; title: string; category: string; summary: string }
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
export function filterModules(modules: ModuleSummary[], query: string): ModuleSummary[] {
  const needle = normalize(query);
  if (!needle) return modules;
  return modules.filter(module => normalize(`${module.title} ${module.category} ${module.summary}`).includes(needle));
}
