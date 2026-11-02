---
title: 'Dependências e SCA: do alerta à decisão'
category: DevSecOps
summary: 'Distinguir alerta de dependência de exploração demonstrada e descrever uma triagem.'
version: 1
draft: true
id: dependencias-sca-01
locale: pt-BR
author: AppSecTrail
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - 'Distinguir alerta de dependência de exploração demonstrada e descrever uma triagem.'
competencyIds: ['F07.05']
references:
  - url: https://devguide.owasp.org/en/05-implementation/02-dependencies/01-dependency-check/
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['Noções de repositórios e testes básicos.']
  pedagogicalReview: pending
  activities:
    - id: dependencias-sca-questao-01
      version: 1
      format: multiple-choice
      hints: ['Considere o contexto e os limites de cada afirmação.']
    - id: dependencias-sca-pratica-01
      version: 1
      format: regression
      hints: ['Inclua um caso permitido e um caso negado ou incorreto.']
exercise:
  prompt: 'Uma ferramenta SCA encontra uma versão com advisory. Qual é a conclusão inicial correta?'
  correctId: triagem
  hint: 'Considere o contexto e os limites de cada afirmação.'
  options:
    - id: triagem
      label: 'Há um alerta que precisa de análise de versão, alcance e contexto.'
      feedback: 'Correto. A presença de uma versão identificada não prova, sozinha, exploração no produto.'
    - id: explorada
      label: 'A aplicação pública foi comprovadamente explorada.'
      feedback: 'O scanner não demonstra exploração real. Confira condições do advisory e exposição.'
---

## Objetivos e pré-requisitos
Reconheça dependências diretas e transitivas e trate resultados de SCA como evidências para investigação. Recomenda-se conhecer repositórios e testes básicos.

## Comece pelo problema
Uma aplicação usa uma biblioteca que, por sua vez, usa outra biblioteca. Essa segunda dependência é transitiva. Um inventário ajuda a localizar componentes, mas uma etiqueta de alerta não conta toda a história.

## Mecanismo técnico
Ferramentas de análise de composição de software (SCA) identificam componentes e os relacionam a fontes de vulnerabilidades conhecidas. A qualidade do resultado depende do inventário, da identificação e dos dados disponíveis. Uma versão afetada em desenvolvimento pode ter exposição diferente de uma dependência distribuída ao usuário; essa distinção não torna o risco automaticamente nulo. Confirme o advisory, a cadeia e as condições de exploração antes de priorizar.

## Cenário prático
Uma biblioteca de build aparece em um alerta. Investigue quem a introduziu, se a versão está no intervalo afetado, quando ela executa e se recebe entrada não confiável. Identifique uma atualização compatível e valide build e testes. Se não houver correção segura imediata, registre a razão, os controles e uma data de reavaliação.

## Práticas orientadas, sem pontuação automática
1. Diferencie dependência direta e transitiva usando três caixas: aplicação, biblioteca e subdependência.
2. Escreva uma ficha de triagem: componente, versão, advisory, alcance, pré-condições, evidências e decisão. Marque hipóteses como hipóteses.
3. Faça um plano de regressão para atualização: testes da aplicação, build, verificação do lockfile e possibilidade de rollback. Uma CI verde ajuda a validar compatibilidade, mas não prova ausência de vulnerabilidades.

## Fonte
- [Referência técnica oficial](https://devguide.owasp.org/en/05-implementation/02-dependencies/01-dependency-check/), consultada em 02/11/2026.
