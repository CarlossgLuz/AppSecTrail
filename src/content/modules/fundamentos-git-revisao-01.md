---
title: 'Git e Pull Requests: como revisar mudanças antes de publicar'
category: Fundamentos
summary: Entenda commits, branches, diffs, PRs e a ligação entre revisão, testes e rollback.
version: 1
draft: true
id: fundamentos-git-revisao-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
- Demonstrar Entenda commits, branches, diffs, PRs e a ligação entre revisão, testes e rollback
competencyIds:
- F06.01
- F06.02
- F06.04
references:
- url: https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository
  accessDate: '2026-11-02'
- url: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews
  accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites:
  - Noção de arquivos e pastas
  pedagogicalReview: pending
  activities:
  - id: fundamentos-git-revisao-01-quiz-01
    version: 1
    format: multiple-choice
    hints:
    - Uma ferramenta executa o teste; a qualidade depende do teste escolhido.
  - id: fundamentos-git-revisao-01-pratica-01
    version: 1
    format: analysis
    hints:
    - Separe o que sabe do que precisa verificar.
exercise:
  prompt: Qual é a evidência mais forte de que um PR preservou a regra de autorização?
  correctId: testes
  hint: Uma ferramenta executa o teste; a qualidade depende do teste escolhido.
  options:
  - id: verde
    label: Apenas a indicação de CI verde sem examinar o que foi testado.
    feedback: CI verde não diz quais cenários foram cobertos.
  - id: testes
    label: Testes positivos e negativos específicos, com verificação de efeito e código revisado.
    feedback: Correto. Ainda assim, o nível de confiança depende da cobertura e do contexto.
  - id: merge
    label: O fato de o PR já ter sido integrado.
    feedback: Merge é um evento de processo, não evidência de segurança.
---

## O que você vai conseguir fazer
Ler uma mudança de software como um conjunto de diferenças verificáveis, identificar risco no contexto e propor testes antes de integrar a alteração.

## Comece por uma alteração pequena
Uma pessoa modifica um endpoint para permitir que clientes vejam seus pedidos. O código compila, e a página carrega. Isso basta? Não: precisamos conferir que a mudança preserva o acesso legítimo e impede acesso indevido. O PR é o lugar ideal para registrar essa verificação antes de publicar.

## As peças do fluxo
- **Repositório:** histórico de arquivos versionados.
- **Commit:** snapshot de mudanças registradas, associado a mensagem e identidade de autoria. Commit não significa produção.
- **Branch:** referência móvel a uma linha de desenvolvimento; permite isolar trabalho.
- **Diff:** comparação entre versões, indicando linhas adicionadas, removidas e contexto.
- **Pull Request:** proposta de integração com descrição, discussão, checks e revisão. Não é um sinônimo de merge.
- **Merge:** integração de mudanças; sua forma afeta o histórico do repositório.
- **Rollback:** estratégia para desfazer efeitos de uma mudança; reverter um commit não desfaz automaticamente uma migração destrutiva de banco ou vazamento de segredo.

## Leia um diff conceitual
```diff
 def get_order(order_id, current_user, db):
-    return db.query(Order).filter(Order.id == order_id).first()
+    return db.query(Order).filter(
+        Order.id == order_id,
+        Order.user_id == current_user.id,
+    ).first()
```
A consulta adiciona restrição de dono. É uma correção **plausível em um modelo simples**, mas não podemos declarar solução geral sem conhecer compartilhamento, identidade confiável, papéis, tenant, caminhos alternativos e tratamento de registro não encontrado.

## Como revisar sem se perder
Primeiro descreva o comportamento esperado. Depois identifique a entrada (`order_id`), o sujeito (`current_user`) e a consulta que seleciona o objeto. Verifique se os testes incluem um usuário com acesso e outro sem acesso. Em operações de escrita, valide efeitos no banco além do status HTTP.

Os checks de CI fornecem evidências de execução de testes, mas não cobrem automaticamente todos os cenários de segurança. Um PR com checks verdes ainda pode conter um erro de autorização que nenhum teste exercita.

## Segurança na colaboração
Nunca inclua tokens, senhas e dados de clientes em commits. Se um segredo real foi exposto, retirá-lo do diff não garante que deixou de existir no histórico: execute resposta operacional de revogação/rotação conforme o escopo. Revise alterações em workflows de CI especialmente quando envolvem execução de código de terceiros e credenciais.

## Exercício de revisão
Um diff elimina o filtro `Order.user_id == current_user.id` para “corrigir um 404 que acontecia com outro usuário”. Explique por que a alteração é arriscada; escreva um comentário de PR com causa, impacto plausível, proposta e testes. Evite afirmar exploração sem evidências.

## Contraprova
Uma regra pode ser segura em uma aplicação com pedidos estritamente privados, mas inadequada quando existe compartilhamento formal entre organizações. O comportamento esperado deve vir dos requisitos de acesso, não de uma cópia mecânica do filtro.

## Revisão pessoal
Antes de ler uma solução, tente explicar a ideia com palavras suas, complete o exercício objetivo e produza a atividade prática. Registre **dúvidas e hipóteses** separadamente.

## Fontes e autoria
Aula autoral baseada nos conceitos das referências listadas no frontmatter. Não reproduz o texto original de terceiros. Rascunho: **revisão técnica e pedagógica humana ainda pendente**, inclusive validação dos URLs na data de publicação.
