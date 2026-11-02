import { describe, expect, it } from 'vitest';
import { filterModules } from './catalog';

describe('biblioteca de módulos', () => {
  const modules = [
    { id: 'http', title: 'HTTP essencial', category: 'Fundamentos', summary: 'Requisições e respostas' },
    { id: 'bola', title: 'Autorização por objeto', category: 'AppSec', summary: 'BOLA em APIs' },
  ];
  it('encontra conteúdo sem diferenciar maiúsculas ou acentos', () => {
    expect(filterModules(modules, 'autorizacao').map(item => item.id)).toEqual(['bola']);
  });
  it('retorna todos os módulos quando a busca está vazia', () => {
    expect(filterModules(modules, '  ')).toEqual(modules);
  });
  it('procura também no resumo e não cria resultados inexistentes', () => {
    expect(filterModules(modules, 'BOLA').map(item => item.id)).toEqual(['bola']);
    expect(filterModules(modules, 'inexistente')).toEqual([]);
  });
});
