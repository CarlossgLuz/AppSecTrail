import { useState } from 'react';
import { filterModules, type ModuleSummary } from '../lib/catalog';

export default function Catalog({ modules }: { modules: ModuleSummary[] }) {
  const [query, setQuery] = useState('');
  const filtered = filterModules(modules, query);
  return <section aria-label="Módulos disponíveis">
    <label htmlFor="search">Buscar por assunto</label>
    <input id="search" type="search" value={query} onChange={event => setQuery(event.target.value)} />
    <p role="status">{modules.length === 0 ? 'Ainda não há módulos publicados.' : `${filtered.length} módulo(s) encontrado(s).`}</p>
    <div className="grid">{filtered.map(module => <article className="card" key={module.id}>
      <span className="label">{module.category}</span><h2><a href={`/biblioteca/${encodeURIComponent(module.id)}/`}>{module.title}</a></h2><p>{module.summary}</p>
    </article>)}</div>
  </section>;
}
