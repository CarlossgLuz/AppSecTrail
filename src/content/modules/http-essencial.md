---
title: 'HTTP: requisições e respostas'
category: Fundamentos
summary: 'Um primeiro contato com a comunicação entre cliente e servidor.'
version: 1
draft: true
exercise:
  prompt: 'Quando um navegador solicita uma página e o servidor envia o resultado, qual mensagem é a resposta?'
  correctId: resposta
  hint: 'Pense em quem responde depois de receber um pedido.'
  options:
    - id: pedido
      label: 'A mensagem enviada pelo navegador para pedir a página.'
      feedback: 'Essa é a requisição: ela inicia a troca pedindo um recurso.'
    - id: resposta
      label: 'A mensagem enviada pelo servidor em retorno à requisição.'
      feedback: 'A resposta traz um status e pode trazer cabeçalhos e um corpo com o conteúdo.'
    - id: endereco
      label: 'O endereço digitado pelo usuário.'
      feedback: 'O endereço identifica um recurso, mas não é uma mensagem de resposta.'
---

## Objetivo
Identificar o papel de uma requisição e de uma resposta HTTP em uma troca simples.

## O problema
Ao abrir um site, seu navegador precisa pedir algum conteúdo. Imagine fazer um pedido em uma lanchonete: o pedido diz o que você quer; a resposta informa o resultado. A analogia ajuda a distinguir as mensagens, mas um servidor não precisa devolver uma página: pode retornar dados, um erro ou outro resultado.

## O mecanismo
HTTP é um protocolo usado para a troca de mensagens entre cliente e servidor. Uma requisição normalmente inclui um método e identifica o recurso desejado; a resposta inclui um código de status, cabeçalhos e, quando aplicável, um corpo. O código informa o resultado da solicitação, mas não prova por si só que o conteúdo recebido é confiável ou seguro.

Por exemplo, um navegador faz uma requisição `GET` para obter uma página. O servidor pode responder com status `200` e um corpo contendo HTML. Se o recurso não existir, pode responder com `404`. Os detalhes dependem do servidor e da situação.

## Verifique seu raciocínio
Antes de responder ao exercício, identifique quem iniciou a troca. Depois de responder, explique com suas palavras por que um endereço não é uma resposta. Pense também em uma situação em que o servidor retorna um erro em vez de uma página.

## Fonte para aprofundar
- [MDN — Visão geral do HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview)

Rascunho: requer revisão técnica, pedagógica, de acessibilidade e de fontes antes da publicação.
