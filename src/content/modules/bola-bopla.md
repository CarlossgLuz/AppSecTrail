---
title: 'APIs: autorização por objeto e propriedade'
category: AppSec
summary: 'Diferenciar falhas de autorização por objeto e por propriedade.'
version: 1
draft: true
id: bola-bopla-01
locale: pt-BR
author: AppSecTrail
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - 'Diferenciar falhas de autorização por objeto e por propriedade.'
competencyIds: ['A02.01']
references:
  - url: https://api-security.owasp.org/editions/2023/en/0x11-t10/
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['HTTP e autorização por objeto.']
  pedagogicalReview: pending
  activities:
    - id: bola-bopla-questao-01
      version: 1
      format: multiple-choice
      hints: ['Considere o contexto e os limites de cada afirmação.']
    - id: bola-bopla-pratica-01
      version: 1
      format: regression
      hints: ['Inclua um caso permitido e um caso negado ou incorreto.']
exercise:
  prompt: 'Qual cenário caracteriza uma falha de autorização por propriedade?'
  correctId: propriedade
  hint: 'Considere o contexto e os limites de cada afirmação.'
  options:
    - id: propriedade
      label: 'Um usuário altera o campo administrativo de seu próprio perfil sem permissão.'
      feedback: 'Correto. A operação sobre o objeto pode ser permitida, mas essa propriedade exige autorização própria.'
    - id: objeto
      label: 'Um usuário lê o relatório privado pertencente a outra pessoa.'
      feedback: 'Esse exemplo aponta para autorização por objeto; o acesso ao relatório inteiro não deveria ser concedido.'
---

## Objetivos e pré-requisitos
Diferencie autorização por objeto e por propriedade; recomenda-se estudar HTTP e autorização por objeto primeiro.

## Comece pelo problema
Abrir seu próprio armário não significa ter permissão para mudar a etiqueta de patrimônio da empresa. Em APIs, a pessoa pode ter acesso ao objeto e, ainda assim, não poder ler ou alterar determinados campos.

## Mecanismo técnico
BOLA ocorre quando uma operação aceita um identificador e não verifica adequadamente se o sujeito pode agir sobre aquele objeto. BOPLA trata de autorização inadequada para propriedades: tanto a exposição indevida de campos quanto a aceitação de alterações não autorizadas podem ocorrer. IDs difíceis de adivinhar reduzem enumeração, mas não substituem a política de autorização. O servidor precisa validar sujeito, ação, objeto e propriedades relevantes no contexto apropriado.

Considere um perfil fictício com `nome` e `papel`. Permitir que a pessoa altere o nome não implica que ela possa atribuir a si mesma o papel de administradora. Igualmente, retornar todos os campos armazenados pode expor dados que a pessoa não deveria ler.

## Práticas orientadas, sem pontuação automática
1. Classifique: Ana lê o relatório privado de Beto; Ana altera `papel` no próprio perfil; Ana edita seu nome permitido. Justifique separadamente objeto e propriedade.
2. Crie uma matriz com duas identidades, dois objetos e campos público e restrito. Inclua leitura e alteração.
3. Em laboratório autorizado, valide que chamadas negadas não alteram o estado e que o fluxo permitido continua funcionando. Não teste contas ou recursos reais sem autorização.

## Fonte
- [Referência técnica oficial](https://api-security.owasp.org/editions/2023/en/0x11-t10/), consultada em 02/11/2026.
