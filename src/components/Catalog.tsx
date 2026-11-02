import { useEffect, useState } from 'react';
import { filterModules, type ModuleSummary } from '../lib/catalog';
import { sitePath } from '../lib/paths';
import { getProfile } from '../lib/profile';

function categoryBadgeClass(category: string): string {
  const norm = category.toLowerCase();
  if (norm.includes('appsec')) return 'badge badge-appsec';
  if (norm.includes('devsecops')) return 'badge badge-devsecops';
  return 'badge badge-fundamentos';
}

export default function Catalog({ modules }: { modules: ModuleSummary[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [startedIds, setStartedIds] = useState<string[]>([]);

  useEffect(() => {
    getProfile()
      .then(profile => {
        if (!profile) return;
        const done = new Set<string>();
        const started = new Set<string>();
        for (const ev of profile.lessonHistory) {
          if (ev.state === 'completed') done.add(ev.lessonId);
          else started.add(ev.lessonId);
        }
        for (const [modId, prog] of Object.entries(profile.progress)) {
          if (prog.completed) done.add(modId);
        }
        setCompletedIds(Array.from(done));
        setStartedIds(Array.from(started));
      })
      .catch(() => {
        /* fallback silencioso quando IndexedDB não está disponível */
      });
  }, []);

  const categories = ['Todas', ...Array.from(new Set(modules.map(m => m.category)))];
  const byCategory = activeCategory === 'Todas'
    ? modules
    : modules.filter(m => m.category === activeCategory);
  const filtered = filterModules(byCategory, query);

  return (
    <section aria-label="Módulos disponíveis">
      <div className="catalog-toolbar">
        <div className="catalog-controls">
          <div className="search-field-wrap">
            <label htmlFor="search">Buscar por assunto</label>
            <input
              id="search"
              type="search"
              placeholder="Ex.: HTTP, cookies, autorização, sessões…"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>
          {categories.length > 1 && (
            <div>
              <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Filtrar por área
              </span>
              <div className="filter-chips" role="group" aria-label="Filtrar por categoria">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className="chip-button"
                    aria-pressed={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="catalog-meta-bar">
          <p role="status">
            {modules.length === 0
              ? 'Ainda não há módulos publicados.'
              : `${filtered.length} módulo(s) encontrado(s).`}
          </p>
          {(query || activeCategory !== 'Todas') && (
            <button
              type="button"
              className="chip-button"
              onClick={() => {
                setQuery('');
                setActiveCategory('Todas');
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && modules.length > 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.25rem 1.5rem' }}>
          <h3>Nenhum módulo corresponde ao filtro atual</h3>
          <p style={{ marginInline: 'auto' }}>
            Tente outro termo de busca ou volte para todas as categorias do catálogo.
          </p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setQuery('');
              setActiveCategory('Todas');
            }}
          >
            Mostrar todos os módulos
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(module => {
            const isDone = completedIds.includes(module.id);
            const isStarted = !isDone && startedIds.includes(module.id);
            return (
              <article className="card card-interactive" key={module.id}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className={categoryBadgeClass(module.category)}>{module.category}</span>
                    {isDone ? (
                      <span className="badge badge-success">Concluído</span>
                    ) : isStarted ? (
                      <span className="badge badge-neutral">Em estudo</span>
                    ) : null}
                  </div>
                  <h2>
                    <a href={sitePath(`/biblioteca/${encodeURIComponent(module.id)}/`)}>{module.title}</a>
                  </h2>
                  <p>{module.summary}</p>
                </div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Acesso livre · Prática interativa</span>
                  <a href={sitePath(`/biblioteca/${encodeURIComponent(module.id)}/`)} aria-hidden="true" tabIndex={-1} style={{ fontWeight: 700, textDecoration: 'none' }}>
                    Estudar →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
