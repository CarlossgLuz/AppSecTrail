---
title: 'Cookies de sessão: atributos e limites'
category: AppSec
summary: 'Entenda como atributos de cookies reduzem riscos sem substituir outros controles.'
version: 1
draft: true
id: appsec-cookies-sessao-01
locale: pt-BR
author: AppSecTrail
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - Explicar o papel de Secure, HttpOnly e SameSite em cookies de sessão.
  - Identificar os limites desses atributos e propor testes positivos e negativos.
competencyIds: ['A01.02', 'F05.01']
references:
  - url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
    accessDate: '2026-11-02'
  - url: https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['Requisições e respostas HTTP.']
  pedagogicalReview: pending
  activities:
    - id: cookie-atributos-01
      version: 1
      format: multiple-choice
      hints: ['Compare quem pode ler o cookie com quem pode enviá-lo.', 'HttpOnly limita a leitura por APIs JavaScript; não impede o navegador de enviar o cookie.']
    - id: cookie-regressao-01
      version: 1
      format: regression
      hints: ['Teste tanto o fluxo permitido quanto o bloqueado.']
exercise:
  prompt: 'Qual afirmação descreve corretamente um cookie HttpOnly?'
  correctId: leitura
  hint: 'Pense na diferença entre leitura por JavaScript e envio pelo navegador.'
  options:
    - id: leitura
      label: 'JavaScript não consegue lê-lo por document.cookie, mas o navegador ainda pode enviá-lo em requisições aplicáveis.'
      feedback: 'Correto. HttpOnly reduz a exposição à leitura por JavaScript; não impede toda ação realizada por um script malicioso.'
    - id: https
      label: 'Ele só é enviado por HTTPS, mesmo sem o atributo Secure.'
      feedback: 'Essa restrição é a função de Secure; HttpOnly tem outro papel.'
    - id: csrf
      label: 'Ele elimina qualquer possibilidade de CSRF.'
      feedback: 'HttpOnly não impede o envio automático do cookie. Avalie proteções específicas contra CSRF.'
---

## Objetivos e pré-requisitos
Você vai interpretar atributos de cookies de sessão e propor verificações para eles. Antes, saiba distinguir uma requisição de uma resposta HTTP.

## Comece pelo problema
Uma aplicação pode reconhecer uma sessão usando um identificador em um cookie. Se esse identificador for exposto ou usado indevidamente, outra pessoa pode agir no contexto da sessão. Os atributos do cookie reduzem algumas formas de exposição; eles não transformam uma aplicação vulnerável em segura.

## Como funciona
O servidor pode enviar `Set-Cookie` na resposta. Em requisições posteriores elegíveis, o navegador pode incluir o cookie. `Secure` restringe seu envio a conexões seguras, com particularidades de localhost entre navegadores. `HttpOnly` impede o acesso por APIs JavaScript como `document.cookie`, mas scripts ainda podem iniciar requisições às quais o navegador anexa cookies. `SameSite=Lax` ou `Strict` restringe o envio em contextos entre sites conforme as regras do navegador; escolha o modo considerando o fluxo real. `SameSite=None` exige `Secure` nos navegadores que implementam essa regra.

```http
Set-Cookie: sessao=exemplo-ficticio; Path=/; Secure; HttpOnly; SameSite=Lax
```

O valor é fictício. Não coloque tokens reais em exemplos ou registros. Mesmo com esses atributos, trate expiração, renovação, proteção contra CSRF, XSS e autorização como decisões separadas.

## Cenário prático
Uma pessoa relata que um script injetado não consegue ler `document.cookie`. Isso é compatível com `HttpOnly`, mas não demonstra que o script não possa enviar ações autenticadas. Investigue a causa da injeção e os controles de cada operação antes de concluir que o risco foi eliminado.

## Atividades de análise e regressão
1. No exercício interativo, relacione cada atributo à sua finalidade. Explique por que as alternativas incorretas falham.
2. Em uma aplicação de laboratório autorizada, examine o cabeçalho `Set-Cookie` de uma sessão descartável. Registre atributos sem copiar o valor do identificador.
3. Planeje testes de regressão: verifique o fluxo legítimo em HTTPS; confira que JavaScript não lê o cookie `HttpOnly`; teste uma operação sensível com e sem a proteção CSRF adequada. Uma resposta segura não deve depender apenas de `SameSite`.

## Fontes
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies), consultado em 02/11/2026.
- [MDN: Secure cookie configuration](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies), consultado em 02/11/2026.
