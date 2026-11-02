---
title: 'Risco em segurança: não confunda alerta, vulnerabilidade e impacto'
category: Fundamentos
summary: Diferencie ativo, ameaça, vulnerabilidade, risco, hipótese e evidência na tomada de decisão.
version: 1
draft: true
id: fundamentos-risco-evidencia-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
- Diferenciar ativo, ameaça, vulnerabilidade, risco, hipótese e evidência.
- Justificar uma decisão de priorização sem confundir alerta de ferramenta com exploração comprovada.
competencyIds:
- F07.01
- F07.05
references:
- url: https://csrc.nist.gov/pubs/sp/800/30/r1/final
  accessDate: '2026-11-02'
- url: https://www.first.org/cvss/
  accessDate: '2026-11-02'
- url: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
  accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites:
  - Nenhum, mas exemplos de aplicação ajudam
  pedagogicalReview: pending
  activities:
  - id: fundamentos-risco-evidencia-01-quiz-01
    version: 1
    format: multiple-choice
    hints:
    - Primeiro separe a correspondência de inventário da demonstração de exploração.
  - id: fundamentos-risco-evidencia-01-pratica-01
    version: 1
    format: analysis
    hints:
    - Separe o que sabe do que precisa verificar.
exercise:
  prompt: O que um alerta SCA, isoladamente, comprova?
  correctId: alerta
  hint: Primeiro separe a correspondência de inventário da demonstração de exploração.
  options:
  - id: explorada
    label: Que a aplicação pública foi explorada com sucesso.
    feedback: O scanner não demonstra invasão ou exploração da instância.
  - id: alerta
    label: Que existe uma correspondência a investigar entre componente/versão e dados de vulnerabilidade.
    feedback: 'Correto: a validação depende de versão, contexto, condições e fontes.'
  - id: zero
    label: Que nenhuma ação precisa ser tomada.
    feedback: O alerta merece triagem, ainda que a exposição não esteja demonstrada.
---

## O que você vai conseguir fazer
Ler um relato de segurança e separar o que foi observado do que precisa ser investigado. Essa competência evita tanto alarmismo quanto a normalização de problemas sérios.

## Comece com um alerta
Um scanner informa “dependência vulnerável, severidade alta”. Isso significa que a aplicação foi comprometida? Não. Existe um indício de que uma versão de componente pode corresponder a um advisory, mas ainda precisamos confirmar o componente real, a faixa afetada, as condições de exploração, o contexto do ambiente e os controles existentes.

## Vocabulário com funções diferentes
- **Ativo:** algo que possui valor para a organização, como credenciais, dados ou disponibilidade do serviço.
- **Ameaça:** causa ou evento potencial capaz de produzir dano, incluindo ação maliciosa ou falha não intencional.
- **Vulnerabilidade:** fraqueza de um sistema ou controle que pode ser explorada ou provocar consequência indesejada.
- **Exploração demonstrada:** evidência de que um mecanismo de abuso funcionou sob condições determinadas. Um scanner não a comprova automaticamente.
- **Impacto:** consequência sobre confidencialidade, integridade, disponibilidade ou negócio.
- **Risco:** avaliação contextual da possibilidade de eventos adversos e suas consequências; não é sinônimo de score CVSS.

## Exemplo progressivo
Uma biblioteca de lint aparece em um alerta. Ela executa apenas nos jobs de CI. O serviço público entrega HTML estático.

1. Observação: a ferramenta encontrou uma versão indicada como afetada.
2. Hipóteses: o caminho de execução pode receber entrada não confiável ou apenas padrões internos seguros.
3. Evidências necessárias: cadeia de dependência, advisory, versão efetiva, localização de execução, configuração e dados controláveis por terceiros.
4. Decisão: atualizar se houver versão compatível, mitigar exposição ou registrar aceitação temporária com responsável e revisão.

Não conclua “risco zero” só porque é devDependency: o pipeline pode ter tokens ou acesso a recursos. Mas também não conclua “execução remota de código contra visitantes” sem demonstrar um caminho plausível.

## Métricas não intercambiáveis
- **CVSS:** descreve severidade técnica da vulnerabilidade conforme a métrica e versão utilizadas. Não mede sozinho risco do ativo.
- **EPSS:** estimativa probabilística, condicionada ao modelo e horizonte definidos pelo FIRST, referente à exploração observada na população de CVEs; não é probabilidade de que seu sistema específico será comprometido.
- **CISA KEV:** catálogo de vulnerabilidades conhecidas como exploradas na prática; presença no catálogo reforça prioridade, mas não prova que sua instância específica foi atingida.

Essas informações podem mudar com o tempo; sempre inclua data e fonte em triagens reais. Não invente métricas para exemplos fictícios.

## Como comunicar
Escreva “o scanner identificou `pacote X` na faixa afetada, execução alcançável ainda não confirmada” em vez de “sistema invadido”. Se houver reprodução autorizada, descreva as condições e evidências sanitizadas. Recomendação deve incluir ação, validação, responsável e possibilidade de rollback.

## Prática guiada
Separe três colunas: confirmado, hipótese e decisão. Para um alerta de biblioteca de CI, preencha cada coluna apenas com afirmações sustentáveis. Diga quais informações faltam para avançar.

## Transferência
Um endpoint retorna dados privados de outro usuário num laboratório isolado. Agora há evidência de comportamento, não apenas alerta. Como muda a classificação? Descreva o ativo afetado, impacto plausível, controle ausente e teste de regressão, sem generalizar para todos os tenants ou endpoints.

## Revisão pessoal
Antes de ler uma solução, tente explicar a ideia com palavras suas, complete o exercício objetivo e produza a atividade prática. Registre **dúvidas e hipóteses** separadamente.

## Fontes e autoria
Aula autoral baseada nos conceitos das referências listadas no frontmatter. Não reproduz o texto original de terceiros. Rascunho: **revisão técnica e pedagógica humana ainda pendente**, inclusive validação dos URLs na data de publicação.
