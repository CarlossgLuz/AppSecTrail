---
title: 'XSS: quando texto vira execução'
category: AppSec
summary: 'Entenda XSS refletido, armazenado e DOM, reconheça sinks inseguros e escolha proteções por contexto.'
version: 1
draft: true
id: appsec-xss-contextos-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
  - Diferenciar XSS refletido, armazenado e baseado no DOM.
  - Reconhecer quando dados não confiáveis chegam a um contexto de interpretação de código ou HTML.
  - Escolher APIs seguras, encoding contextual e sanitização conforme a necessidade.
competencyIds: ['A03.02', 'A03.03']
references:
  - url: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
    accessDate: '2026-11-02'
  - url: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites: ['Conhecer HTML, JavaScript e a diferença entre texto e marcação.']
  pedagogicalReview: pending
  activities:
    - id: appsec-xss-contextos-01-q1
      version: 1
      format: multiple-choice
      hints: ['Pergunte se a API interpreta ou exibe a entrada.', 'Prefira a API que trata o valor como texto.']
    - id: appsec-xss-contextos-01-a1
      version: 1
      format: analysis
      hints: ['Procure a fonte não confiável e o destino (sink).', 'Um framework pode escapar por padrão e ainda conter APIs de bypass.']
    - id: appsec-xss-contextos-01-r1
      version: 1
      format: regression
      hints: ['Garanta que conteúdo malformado continue legível como texto.', 'Inclua o uso legítimo que não pode regredir.']
exercise:
  prompt: 'Uma página deve mostrar um comentário recebido de outro usuário como texto simples. Qual opção é preferível?'
  correctId: textcontent
  hint: 'O objetivo é exibir texto, não interpretar HTML fornecido pelo usuário.'
  options:
    - id: textcontent
      label: 'Atribuir o valor a element.textContent.'
      feedback: 'Correto. O navegador trata o valor como texto, sem interpretá-lo como marcação HTML.'
    - id: innerhtml
      label: 'Atribuir o valor diretamente a element.innerHTML.'
      feedback: 'innerHTML interpreta marcação e pode abrir um sink de XSS quando recebe dados não confiáveis sem sanitização adequada.'
    - id: regex
      label: 'Remover caracteres < e > com regex e usar innerHTML.'
      feedback: 'Filtros ad hoc são frágeis e não cobrem todos os contextos de interpretação.'
    - id: cookie
      label: 'Usar cookies HttpOnly e manter a renderização insegura.'
      feedback: 'HttpOnly pode limitar leitura de cookies, mas não impede a execução de script injetado nem elimina XSS.'
---

## Primeiro, entenda o mecanismo

**Cross-Site Scripting (XSS)** ocorre quando a aplicação permite que dados não confiáveis sejam interpretados como código ou marcação ativa no contexto do navegador. O impacto pode incluir ações em nome da pessoa, alteração de conteúdo da página e acesso a dados disponíveis ao script.

A pergunta central não é “essa entrada contém uma palavra suspeita?”, mas **“onde o dado chega e como será interpretado?”**. O local que interpreta o dado costuma ser chamado de *sink*.

## Três formas frequentes de XSS

- **Refletido:** dados de uma requisição reaparecem em uma resposta sem a proteção adequada. Em geral, o problema depende da navegação por uma entrada construída para o fluxo vulnerável.
- **Armazenado:** dados ficam persistidos e depois são exibidos a outros usuários, por exemplo em comentários ou perfis.
- **Baseado no DOM:** JavaScript executado no navegador lê dados de uma fonte e os insere em um destino inseguro no próprio DOM.

Esses nomes descrevem **como o dado percorre o sistema**, não a severidade automática do problema. A classificação exige evidência do fluxo real.

## Dois destinos, dois comportamentos

Se o requisito é mostrar um comentário como texto, use uma API que não interprete HTML:

```javascript
const comentario = entradaNaoConfiavel; // Recebida de fonte externa
const preview = document.querySelector("#preview");
if (preview) {
  preview.textContent = comentario;
}
```

O exemplo abaixo é inseguro quando o valor contém HTML não confiável:

```javascript
// Exemplo didático de sink inseguro. Não utilize com dados não confiáveis.
preview.innerHTML = comentario;
```

Trocar `innerHTML` por `textContent` pode corrigir o caso em que a funcionalidade só precisa mostrar **texto**. Mas não é uma regra universal para aplicações que legitimamente precisam renderizar HTML formatado.

## Quando o produto precisa renderizar HTML

Nesse caso, use uma biblioteca de **sanitização HTML mantida e adequada ao contexto**, configure uma lista de elementos e atributos permitidos e teste o resultado. Encoding de texto puro e sanitização de HTML são estratégias diferentes.

Para valores em atributos, URLs, CSS e JavaScript, os requisitos mudam: use a proteção adequada ao **contexto de saída**. Um valor escapado para HTML comum não é automaticamente seguro como código JavaScript ou como uma URL clicável. Validação de entrada pode restringir formatos, mas não substitui encoding ou APIs seguras.

Frameworks modernos geralmente escapam texto exibido por padrão. Mesmo assim, APIs que ignoram a proteção padrão podem reintroduzir a vulnerabilidade.

## Controles complementares não são correção de origem

Uma Content Security Policy (CSP) bem configurada pode limitar determinadas consequências, mas não substitui a remoção do sink inseguro. Da mesma forma, `HttpOnly` limita a leitura de cookies por JavaScript, porém não impede que um script malicioso execute ações autenticadas.

## Investigação e teste de regressão

Em laboratório autorizado com dados sintéticos:

1. Identifique **fonte, transformação e destino** do valor.
2. Confirme que um comentário legítimo com caracteres especiais continua sendo mostrado integralmente, como texto.
3. Inspecione o DOM e verifique que o navegador não criou marcação ativa a partir do comentário.
4. Se o recurso aceita HTML de propósito, teste somente o subconjunto permitido e confirme que elementos ou atributos perigosos são tratados corretamente.
5. Repita as verificações após a correção. Não aceite como evidência suficiente apenas um status HTTP ou a ausência de uma mensagem de erro.

## Exercício de análise

Um time usa um framework que escapa variáveis automaticamente, mas um componente novo introduz uma API de inserção de HTML sem sanitização. Um desenvolvedor conclui: “Não precisamos testar XSS porque o framework protege”.

Explique por que a conclusão não é confiável e quais evidências você exigiria na revisão de código.

### Rubrica de autoavaliação (não é correção automática)

- **1 ponto:** identifica o sink e a fonte não confiável.
- **1 ponto:** diferencia escape automático do framework de APIs de bypass.
- **1 ponto:** sugere API segura para texto ou sanitizador quando HTML é requisito.
- **1 ponto:** propõe regressão com caso benigno e tentativa de interpretação indevida.

**Gabarito orientativo:** proteção padrão é útil, mas só cobre caminhos em que ela é aplicada. É necessário verificar o uso da API de inserção, a necessidade de HTML e o resultado no DOM; não basta citar o nome do framework.

## Fontes e revisão

Aula autoral baseada nas recomendações do OWASP Cross-Site Scripting Prevention Cheat Sheet e MDN `textContent`. Revisão técnica/pedagógica independente ainda pendente; esta aula permanece **rascunho**.
