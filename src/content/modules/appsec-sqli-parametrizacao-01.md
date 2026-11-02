---
title: 'SQL Injection: dados não são comandos'
category: AppSec
summary: 'Identifique consultas inseguras, use parâmetros e valide a correção sem confundir injeção com autorização.'
version: 1
draft: true
id: appsec-sqli-parametrizacao-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - Identificar quando uma entrada não confiável passa a compor a sintaxe de uma consulta SQL.
  - Corrigir consultas com parâmetros e distinguir dados de identificadores SQL.
  - Planejar testes positivos e negativos para injeção sem abandonar controles de autorização.
competencyIds: ['A03.01']
references:
  - url: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
    accessDate: '2026-11-02'
  - url: https://owasp.org/www-community/attacks/SQL_Injection
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['Noções de consultas SQL, funções e entradas HTTP.']
  pedagogicalReview: pending
  activities:
    - id: appsec-sqli-parametrizacao-01-q1
      version: 1
      format: multiple-choice
      hints: ['Separe o texto da consulta dos valores que ela recebe.', 'Compare interpolação de strings e parâmetros vinculados.']
    - id: appsec-sqli-parametrizacao-01-a1
      version: 1
      format: analysis
      hints: ['A consulta é segura mesmo se o valor contém aspas?', 'Uma consulta segura ainda pode retornar dados de outra pessoa?']
    - id: appsec-sqli-parametrizacao-01-r1
      version: 1
      format: regression
      hints: ['Inclua uma consulta legítima e uma entrada tratada como dado.', 'Inclua autorização e estados sem registro.']
exercise:
  prompt: 'Um endpoint recebe order_id do usuário. Qual mudança ataca a causa raiz de SQL Injection?'
  correctId: bind
  hint: 'A defesa depende de o banco distinguir a estrutura da consulta dos dados recebidos.'
  options:
    - id: bind
      label: 'Usar consulta parametrizada, vinculando order_id como valor.'
      feedback: 'Correto. O banco recebe a estrutura SQL separada dos valores, impedindo que um valor seja interpretado como parte da sintaxe.'
    - id: escape
      label: 'Remover aspas da entrada e continuar concatenando strings.'
      feedback: 'Filtrar caracteres pode deixar brechas e não substitui parâmetros vinculados.'
    - id: base64
      label: 'Codificar o identificador em Base64 antes da concatenação.'
      feedback: 'Base64 não é uma defesa; um valor codificado pode ser decodificado, e a concatenação continua frágil.'
    - id: frontend
      label: 'Restringir o campo no frontend para aceitar somente números.'
      feedback: 'Validação de interface pode ser contornada. A consulta deve ser construída de forma segura no backend.'
---

## O problema em uma frase

**SQL Injection** acontece quando dados não confiáveis passam a ser interpretados como parte da linguagem de consulta ao banco. Não é necessário que a entrada venha de um formulário: ela pode ter origem em cabeçalhos, URLs, serviços externos ou valores salvos anteriormente.

Imagine que uma aplicação recebe um número de pedido e monta sua consulta diretamente com texto recebido.

## Compare os dois caminhos

No primeiro exemplo, o valor entra na estrutura da consulta:

```python
# Exemplo didático: inseguro. Não copie para aplicações reais.
def buscar_pedido_inseguro(db, order_id):
    sql = f"SELECT id, total FROM orders WHERE id = {order_id}"
    return db.execute(sql)
```

O problema não é o nome da variável nem a presença de uma f-string isoladamente. É a **construção de sintaxe SQL a partir de entrada não confiável**. Um cliente pode enviar conteúdo inesperado, e a aplicação não preserva a separação entre código e dado.

O segundo exemplo usa parâmetros com `sqlite3`. O driver recebe o comando e os valores separadamente:

```python
def buscar_pedido(db, order_id: int, usuario_id: int):
    cursor = db.execute(
        "SELECT id, total FROM orders WHERE id = ? AND user_id = ?",
        (order_id, usuario_id),
    )
    return cursor.fetchone()
```

Duas coisas diferentes acontecem aqui:

1. Os placeholders `?` separam valores da estrutura SQL, protegendo contra a injeção nesse ponto.
2. A restrição `user_id = ?` limita a consulta ao proprietário, supondo que `usuario_id` venha da identidade autenticada confiável. Isso é **autorização por objeto**, um controle independente.

**Parametrizar não resolve BOLA.** Uma consulta segura contra SQL Injection ainda pode devolver pedidos de outras pessoas se a política de autorização estiver incorreta.

## E se o usuário escolher a coluna de ordenação?

Parâmetros são adequados para **valores**, não para substituir nomes de tabelas, colunas ou palavras-chave como `ASC` e `DESC`. Para estrutura dinâmica, mapeie escolhas externas para opções fixas controladas pelo programa:

```python
COLUNAS = {"data": "created_at", "valor": "total"}

def coluna_ordenacao(chave: str) -> str:
    if chave not in COLUNAS:
        raise ValueError("Ordenação não suportada")
    return COLUNAS[chave]
```

Depois, somente o identificador previamente escolhido pela aplicação pode compor a parte estrutural da consulta. Mantenha os **valores** parametrizados.

## Como validar a correção

Use apenas banco e usuários de laboratório, com dados sintéticos.

1. **Caso positivo:** o proprietário consulta um pedido existente; os dados correspondem exatamente ao pedido esperado.
2. **Entrada inesperada:** envie um identificador com formato inválido; a aplicação deve rejeitar ou tratá-lo como dado, sem alterar a estrutura SQL.
3. **Outro usuário:** tente o ID do pedido de outra conta; a autorização deve negar acesso conforme a política.
4. **ID inexistente:** não deve revelar dados de outro registro nem causar erro de consulta inesperado.
5. **Evidência:** registre status, resultado esperado e observado, e verifique que nenhuma operação modificou registros indevidos.

Um teste que recebe `400`, `404` ou `422` **sozinho** não prova ausência de injeção. A evidência exige verificar o caminho de código e o efeito real no banco.

## Exercício de análise

Uma equipe corrigiu uma SQL Injection trocando concatenação por parâmetros. Um colega diz: “Agora qualquer usuário autenticado pode buscar qualquer pedido porque não há mais injeção.”

Explique em 3–5 frases por que essa conclusão está errada e proponha uma verificação de autorização separada.

### Rubrica para autoavaliação (não é nota automática)

- **1 ponto:** identifica que SQL Injection e BOLA são classes distintas.
- **1 ponto:** exige contexto de identidade confiável e política de acesso ao objeto.
- **1 ponto:** propõe teste positivo e negativo com duas contas.
- **1 ponto:** inclui observação do estado do banco e dos resultados, não apenas códigos HTTP.

**Gabarito orientativo:** placeholders protegem a interpretação dos valores; eles não verificam quem tem direito de acessar cada linha. O backend deve aplicar uma política de acesso por objeto e validar a regra com duas identidades e registros independentes.

## Limites e defesa em profundidade

Privilégios mínimos da conta de banco reduzem danos de eventuais falhas, mas não substituem a consulta parametrizada. Procedimentos armazenados também podem ser vulneráveis se construírem SQL dinâmico inseguro internamente. Evite depender de escaping manual.

## Fontes e revisão

Aula autoral baseada no OWASP SQL Injection Prevention Cheat Sheet e no material comunitário da OWASP. A revisão independente e a avaliação prática por estudantes ainda estão pendentes; o status permanece **rascunho**.
