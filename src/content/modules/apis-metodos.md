---
title: 'HTTP e APIs: métodos, JSON e contratos'
category: Fundamentos
summary: 'Distinguir métodos HTTP e interpretar exemplos simples de JSON.'
version: 1
draft: true
id: apis-metodos-01
locale: pt-BR
author: AppSecTrail
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - 'Distinguir métodos HTTP e interpretar exemplos simples de JSON.'
competencyIds: ['F05.02']
references:
  - url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['Requisições e respostas HTTP; consulte também os pré-requisitos da aula.']
  pedagogicalReview: pending
  activities:
    - id: apis-metodos-questao-01
      version: 1
      format: multiple-choice
      hints: ['Considere o contexto e os limites de cada afirmação.']
    - id: apis-metodos-pratica-01
      version: 1
      format: regression
      hints: ['Inclua um caso permitido e um caso negado ou incorreto.']
exercise:
  prompt: 'Qual afirmação descreve melhor uma requisição GET?'
  correctId: get
  hint: 'Considere o contexto e os limites de cada afirmação.'
  options:
    - id: get
      label: 'Em HTTP, GET solicita uma representação de um recurso.'
      feedback: 'Correto. A resposta pode conter uma representação, conforme o servidor.'
    - id: get-inseguro
      label: 'GET prova que os dados retornados são confiáveis.'
      feedback: 'Não. O método não garante confiabilidade do conteúdo ou correção da autorização.'
---

## Objetivos e pré-requisitos
Identifique método, recurso e corpo em uma troca simples. Antes, estude requisições e respostas HTTP.

## Comece pelo problema
Um aplicativo precisa mostrar um pedido. A API funciona como um balcão com operações acordadas: um contrato descreve como solicitar a operação e o formato das respostas. A analogia não garante que a implementação cumpra esse contrato.

## Mecanismo técnico
Em HTTP, GET solicita uma representação; POST solicita processamento conforme a semântica do recurso; PATCH aplica modificações parciais e DELETE solicita remoção da associação do recurso. O comportamento efetivo depende da implementação. Métodos definidos como seguros têm semântica pretendida de leitura, não uma garantia de que todo servidor foi implementado corretamente. Status informa o resultado HTTP, mas não substitui a inspeção do corpo e do estado persistido.

```http
GET /pedidos/42 HTTP/1.1
Host: loja.example
```

Uma resposta fictícia pode conter `Content-Type: application/json` e o corpo `{"id":42,"status":"aberto"}`. JSON representa dados estruturados; não é um mecanismo de autorização. Não coloque credenciais em exemplos.

## Práticas orientadas, sem pontuação automática
1. Identifique cliente, método, caminho e identificador. Explique o que não se pode concluir apenas com status 200.
2. Crie exemplos fictícios de GET e PATCH para o mesmo pedido; descreva quais mudanças seriam esperadas e quais entradas seriam inválidas.
3. Teste de regressão: para uma alteração permitida, verifique resposta e estado; para outra conta sem permissão, confirme ausência de alteração. Execute apenas em laboratório autorizado.

## Fonte
- [Referência técnica oficial](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), consultada em 02/11/2026.
