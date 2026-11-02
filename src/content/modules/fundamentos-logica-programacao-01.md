---
title: 'Programação do zero: variáveis, condições e decisões seguras'
category: Fundamentos
summary: Leia pequenos trechos de código, interprete entradas e escreva condições com significado.
version: 1
draft: true
id: fundamentos-logica-programacao-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
- Ler pequenos trechos de código, interpretar entradas e escrever condições com significado
competencyIds:
- F02.01
- F02.02
- F02.03
references:
- url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables
  accessDate: '2026-11-02'
- url: https://docs.python.org/3/tutorial/controlflow.html
  accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites:
  - Distinguir aplicativo e processo (recomendado, não obrigatório)
  pedagogicalReview: pending
  activities:
  - id: fundamentos-logica-programacao-01-quiz-01
    version: 1
    format: multiple-choice
    hints:
    - Procure a relação entre a identidade confiável e o dono do objeto.
  - id: fundamentos-logica-programacao-01-pratica-01
    version: 1
    format: analysis
    hints:
    - Separe o que sabe do que precisa verificar.
exercise:
  prompt: Qual condição testa a propriedade no exemplo didático?
  correctId: owner
  hint: Procure a relação entre a identidade confiável e o dono do objeto.
  options:
  - id: idpositivo
    label: pedido["id"] > 0
    feedback: Isso confirma apenas um formato parcial do identificador.
  - id: owner
    label: pedido["dono_id"] == usuario_id
    feedback: 'Correto: a comparação corresponde ao dono do objeto.'
  - id: existe
    label: pedido is not None
    feedback: Existência do objeto não determina autorização.
---

## O que você vai conseguir fazer
Interpretar variáveis, tipos, condições, funções e valores de retorno em exemplos curtos. Depois, reconhecer **quando uma condição parece verificar segurança, mas compara os elementos errados**.

## O problema: a variável não faz a validação sozinha
Imagine que um endpoint receba `pedido_id=42`. Esse número pode estar correto sintaticamente, mas pertencer a outra pessoa. Um programa precisa distinguir **validade do valor** de **permissão para usá-lo**.

Uma variável é um nome associado a um valor. O tipo descreve operações e representações possíveis. Em Python, `42` (inteiro), `'42'` (texto), `True` (booleano) e `None` (ausência de valor) são coisas diferentes. Coerção implícita pode provocar surpresas; evite adivinhar resultados sem conhecer a linguagem.

## Leia antes de executar
```python
pedido_id = 42
usuario_autenticado = 7
if pedido_id > 0:
    print('Identificador parece válido')
```
A condição apenas verifica se o número é positivo. Ela **não** verifica o dono do pedido. Para isso é necessário consultar a política e o registro correto. Esse é o primeiro hábito de revisão de código: perguntar “o que esta condição prova?” e “o que ela não prova?”.

## Controle de fluxo
Uma condição escolhe caminhos. Um laço repete instruções. Uma função encapsula operações e pode receber argumentos. Exceções representam falhas ou condições especiais; não use exceções para ocultar qualquer comportamento desconhecido.

```python
def pode_ler(pedido, usuario_id):
    return pedido['dono_id'] == usuario_id

pedido = {'id': 42, 'dono_id': 7}
assert pode_ler(pedido, 7) is True
assert pode_ler(pedido, 8) is False
```
O exemplo é deliberadamente mínimo. Não possui autenticação, banco, tenant, papéis especiais ou política de compartilhamento. Serve para ensinar a condição básica de propriedade, não como código pronto de produção.

## Entrada, processamento e saída
Uma função recebe uma entrada, processa sob alguma regra e entrega um resultado. Valores inválidos e ausentes merecem tratamento explícito.

Em sistemas de segurança, duas perguntas são diferentes: “o identificador está no formato esperado?” e “a identidade autenticada está autorizada a executar essa ação?”. Uma pode passar e a outra falhar. Se a função recebe `current_user`, mas nunca o utiliza para decidir acesso, isso merece investigação.

## Prática guiada
Sem executar código, determine os resultados de `pode_ler(pedido, 7)` e `pode_ler(pedido, 8)`. Depois, altere mentalmente `dono_id` para 8. Descreva a nova tabela verdade: usuário 7 negado; usuário 8 permitido. Não conclua que todas as políticas reais devem ser só propriedade direta; compartilhamento e multitenancy podem mudar a decisão.

## Erros frequentes
- Comparar `usuario` inteiro com um campo de ID em vez de comparar identidades compatíveis.
- Interpretar `None` como autorização concedida por padrão.
- Considerar um `assert` de caso positivo suficiente para provar controle de acesso.
- Aceitar `user_id` de um corpo JSON como se fosse a identidade autenticada.

## Transferência: regressão
Escreva uma tabela com usuário dono, usuário não dono e ID inexistente. Para cada caso, informe o resultado esperado e a evidência que observaria. Uma resposta HTTP sozinha pode ser insuficiente: em operações de escrita, verifique também se o registro mudou ou não.

## Revisão pessoal
Antes de ler uma solução, tente explicar a ideia com palavras suas, complete o exercício objetivo e produza a atividade prática. Registre **dúvidas e hipóteses** separadamente.

## Fontes e autoria
Aula autoral baseada nos conceitos das referências listadas no frontmatter. Não reproduz o texto original de terceiros. Rascunho: **revisão técnica e pedagógica humana ainda pendente**, inclusive validação dos URLs na data de publicação.
