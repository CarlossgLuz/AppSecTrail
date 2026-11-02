---
title: 'Autorização: quem pode acessar qual recurso?'
category: AppSec
summary: 'Modele sujeito, ação e recurso para identificar falhas de autorização por objeto.'
version: 1
draft: true
id: appsec-autorizacao-objetos-01
locale: pt-BR
author: AppSecTrail
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - Diferenciar autenticação de autorização.
  - Propor verificações de acesso por objeto e testes de regressão.
competencyIds: ['F07.03', 'A02.02', 'A02.03']
references:
  - url: https://top10proactive.owasp.org/the-top-10/c1-accesscontrol/
    accessDate: '2026-11-02'
  - url: https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['Requisições e respostas HTTP.']
  pedagogicalReview: pending
  activities:
    - id: authz-objeto-01
      version: 1
      format: multiple-choice
      hints: ['A identidade autenticada não determina sozinha acesso a todos os registros.', 'Considere sujeito, ação e recurso.']
    - id: authz-regressao-01
      version: 1
      format: regression
      hints: ['Compare solicitações de duas contas para objetos de cada uma.']
exercise:
  prompt: 'Ana está autenticada. Antes de retornar o relatório 42, o servidor deve verificar:'
  correctId: objeto
  hint: 'Autenticação responde quem é; autorização responde se a ação no recurso é permitida.'
  options:
    - id: objeto
      label: 'Se Ana pode ler o relatório 42 naquele contexto.'
      feedback: 'Correto. A decisão considera a identidade, a ação e o objeto solicitado.'
    - id: login
      label: 'Apenas se Ana está autenticada.'
      feedback: 'Uma sessão válida não concede automaticamente acesso a todos os relatórios.'
    - id: interface
      label: 'Apenas se o botão aparece na interface.'
      feedback: 'O cliente pode ser modificado; a checagem deve ocorrer no lado confiável do servidor.'
---

## Objetivos e pré-requisitos
Diferencie autenticação de autorização e formule testes para acesso a um recurso específico. É útil conhecer requisições HTTP e respostas de erro.

## Comece pelo problema
Apresentar uma credencial responde à pergunta “quem está fazendo o pedido?”. Decidir se essa pessoa pode ler determinado relatório responde a outra pergunta. Estar dentro de um prédio não significa que todas as salas estejam liberadas.

## Como funciona
Uma decisão de autorização envolve ao menos sujeito, ação e recurso, e pode considerar organização, papel e estado do objeto. O servidor precisa aplicar essa decisão no caminho confiável para cada operação protegida, inclusive quando o identificador do recurso vem da URL. Ocultar botões ajuda a experiência, mas não impede que uma requisição seja construída fora da interface.

Em uma API fictícia, `GET /relatorios/42` não deve retornar o relatório apenas porque a sessão é válida: a política deve verificar se a pessoa pode ler aquele relatório. O comportamento exato de erro e a política de compartilhamento dependem do produto. Uma regra genérica como “qualquer usuário autenticado pode ler qualquer relatório” deve ser uma decisão explícita, não consequência acidental da ausência de verificação.

## Cenário prático
Ana e Beto têm contas e relatórios distintos. Ana consegue consultar o seu relatório. Uma falha acontece se, ao substituir o identificador pelo relatório privado de Beto, a aplicação entrega os dados sem uma permissão aplicável. Não execute essa troca em sistemas sem autorização; use dados e contas de laboratório.

## Atividades de análise e regressão
1. Resolva o exercício interativo e nomeie sujeito, ação e recurso na decisão correta.
2. Escreva uma matriz para duas contas e dois relatórios: dono permitido, outra conta negada e, se existir compartilhamento explícito, usuário autorizado permitido.
3. Após corrigir a verificação, repita os três casos no endpoint e nos caminhos alternativos, como exportação. Confira também que negar um acesso não alterou dados e que a pessoa legítima continua conseguindo acessar o próprio relatório.

## Fontes
- [OWASP Proactive Controls: Implement Access Control](https://top10proactive.owasp.org/the-top-10/c1-accesscontrol/), consultado em 02/11/2026.
- [OWASP Top 10 2025: Broken Access Control](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/), consultado em 02/11/2026.
