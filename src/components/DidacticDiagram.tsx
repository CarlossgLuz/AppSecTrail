interface Props {
  lessonId: string;
  category: string;
}

export default function DidacticDiagram({ lessonId, category }: Props) {
  if (lessonId.includes('cookie')) {
    return (
      <figure className="didactic-diagram" aria-label="Diagrama didático de atributos de cookie de sessão">
        <div className="diagram-header">
          <span className="badge badge-appsec">Fluxo de Sessão</span>
          <span className="diagram-caption-top">Como os atributos de Set-Cookie atuam no navegador</span>
        </div>
        <div className="diagram-flow">
          <div className="diagram-node">
            <span className="node-kicker">1. Servidor envia cabeçalho</span>
            <strong>Set-Cookie: sessao=...</strong>
            <div className="diagram-tags">
              <span className="code-pill">Secure</span>
              <span className="code-pill">HttpOnly</span>
              <span className="code-pill">SameSite=Lax</span>
            </div>
          </div>
          <div className="diagram-connector" aria-hidden="true">→</div>
          <div className="diagram-node">
            <span className="node-kicker">2. Regras no Navegador</span>
            <strong>Isolamento de leitura e transporte</strong>
            <ul className="diagram-mini-list">
              <li><code>Secure</code>: tráfego apenas via HTTPS</li>
              <li><code>HttpOnly</code>: oculto de <code>document.cookie</code></li>
              <li><code>SameSite</code>: controla envio entre sites</li>
            </ul>
          </div>
          <div className="diagram-connector" aria-hidden="true">→</div>
          <div className="diagram-node node-highlight">
            <span className="node-kicker">3. Limite de Segurança</span>
            <strong>Defesa em profundidade</strong>
            <p className="diagram-note">O navegador ainda anexa o cookie em requisições elegíveis — exige proteção CSRF e controle de sessão no servidor.</p>
          </div>
        </div>
      </figure>
    );
  }

  if (lessonId.includes('autorizacao') || lessonId.includes('bola') || category === 'AppSec') {
    return (
      <figure className="didactic-diagram" aria-label="Diagrama didático de decisão de autorização por objeto">
        <div className="diagram-header">
          <span className="badge badge-appsec">Modelo de Decisão</span>
          <span className="diagram-caption-top">Verificação de acesso por objeto no caminho confiável do servidor</span>
        </div>
        <div className="diagram-flow">
          <div className="diagram-node">
            <span className="node-kicker">1. Contexto da Requisição</span>
            <strong>Sujeito + Ação + Recurso</strong>
            <ul className="diagram-mini-list">
              <li><strong>Sujeito:</strong> Usuária autenticada (Ana)</li>
              <li><strong>Ação:</strong> Leitura (<code>GET</code>)</li>
              <li><strong>Objeto:</strong> Relatório <code>#42</code></li>
            </ul>
          </div>
          <div className="diagram-connector" aria-hidden="true">→</div>
          <div className="diagram-node node-highlight">
            <span className="node-kicker">2. Política no Servidor</span>
            <strong>Ana tem permissão sobre #42?</strong>
            <p className="diagram-note">Sessão válida comprova identidade (autenticação), mas o servidor deve validar vínculo com o objeto específico.</p>
          </div>
          <div className="diagram-connector" aria-hidden="true">→</div>
          <div className="diagram-node">
            <span className="node-kicker">3. Desfecho Verificável</span>
            <strong>Resposta controlada</strong>
            <div className="diagram-tags">
              <span className="code-pill status-ok">Permitido: 200 OK</span>
              <span className="code-pill status-deny">Negado: 403 / 404</span>
            </div>
          </div>
        </div>
      </figure>
    );
  }

  if (lessonId.includes('dependencia') || lessonId.includes('sca') || category === 'DevSecOps') {
    return (
      <figure className="didactic-diagram" aria-label="Diagrama didático de análise de dependências e SCA">
        <div className="diagram-header">
          <span className="badge badge-devsecops">Cadeia de Suprimentos</span>
          <span className="diagram-caption-top">Do manifesto de pacotes à decisão de mitigação com contexto</span>
        </div>
        <div className="diagram-flow">
          <div className="diagram-node">
            <span className="node-kicker">1. Árvore de Pacotes</span>
            <strong>Manifesto + Lockfile</strong>
            <p className="diagram-note">Inclui dependências diretas e transitivas resolvidas no build.</p>
          </div>
          <div className="diagram-connector" aria-hidden="true">→</div>
          <div className="diagram-node node-highlight">
            <span className="node-kicker">2. Triagem Técnica</span>
            <strong>Alerta SCA + Alcançabilidade</strong>
            <p className="diagram-note">Avalia se a função vulnerável é executada e se há exposição real no ambiente.</p>
          </div>
          <div className="diagram-connector" aria-hidden="true">→</div>
          <div className="diagram-node">
            <span className="node-kicker">3. Ação & Regressão</span>
            <strong>Atualização ou Contorno</strong>
            <p className="diagram-note">Valida compatibilidade, testes automatizados e ausência de regressão.</p>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure className="didactic-diagram" aria-label="Diagrama didático do ciclo de requisição e resposta HTTP">
      <div className="diagram-header">
        <span className="badge badge-fundamentos">Arquitetura de Protocolo</span>
        <span className="diagram-caption-top">Troca estruturada de mensagens entre Cliente e Servidor</span>
      </div>
      <div className="diagram-flow">
        <div className="diagram-node">
          <span className="node-kicker">1. Cliente (Navegador / App)</span>
          <strong>Envia Requisição HTTP</strong>
          <div className="diagram-tags">
            <span className="code-pill">Método: GET</span>
            <span className="code-pill">Alvo: /</span>
            <span className="code-pill">Host: exemplo.test</span>
          </div>
        </div>
        <div className="diagram-connector" aria-hidden="true">⇄</div>
        <div className="diagram-node node-highlight">
          <span className="node-kicker">2. Processamento no Servidor</span>
          <strong>Interpreta rota e regra</strong>
          <p className="diagram-note">Localiza o recurso solicitado, aplica regras da aplicação e prepara cabeçalhos e corpo.</p>
        </div>
        <div className="diagram-connector" aria-hidden="true">→</div>
        <div className="diagram-node">
          <span className="node-kicker">3. Resposta HTTP</span>
          <strong>Status + Headers + Body</strong>
          <div className="diagram-tags">
            <span className="code-pill status-ok">HTTP/1.1 200 OK</span>
            <span className="code-pill">Content-Type: text/html</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
