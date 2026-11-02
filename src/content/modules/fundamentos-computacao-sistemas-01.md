---
title: 'Computador, software e sistema: onde tudo acontece'
category: Fundamentos
summary: Identifique hardware, sistema operacional, processo, serviço e aplicativo antes de analisar segurança.
version: 1
draft: true
id: fundamentos-computacao-sistemas-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
- Demonstrar Identifique hardware, sistema operacional, processo, serviço e aplicativo antes de analisar segurança
competencyIds:
- F01.01
- F01.03
references:
- url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server
  accessDate: '2026-11-02'
- url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview
  accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites:
  - 'Nenhum: entrada para iniciantes absolutos'
  pedagogicalReview: pending
  activities:
  - id: fundamentos-computacao-sistemas-01-quiz-01
    version: 1
    format: multiple-choice
    hints:
    - Um executável pode estar no disco sem nenhum processo em execução.
  - id: fundamentos-computacao-sistemas-01-pratica-01
    version: 1
    format: analysis
    hints:
    - Separe o que sabe do que precisa verificar.
exercise:
  prompt: Qual alternativa descreve corretamente um processo?
  correctId: processo
  hint: Um executável pode estar no disco sem nenhum processo em execução.
  options:
  - id: programa
    label: O conjunto de arquivos do aplicativo, mesmo quando não está em execução.
    feedback: Isso descreve o programa armazenado, não uma instância em execução.
  - id: processo
    label: Uma instância em execução com memória e contexto próprios.
    feedback: 'Correto: processo é execução, e pode haver várias instâncias do mesmo programa.'
  - id: api
    label: O contrato usado por clientes para conversar com a aplicação.
    feedback: Uma API é uma interface; não se confunde com o processo que implementa a interface.
---

## O que você vai conseguir fazer
Ao final, identifique o papel de cada componente de um sistema e **localize onde uma decisão de segurança realmente é executada**. Você não precisa saber programar para começar.

## Comece com um problema realista
Você abre uma loja virtual. A tela mostra seus pedidos, mas o botão **Ver pedido** retorna uma mensagem de erro. Quem pode estar envolvido? A interface do navegador, uma API, uma aplicação no servidor, uma consulta ao banco ou o sistema operacional da máquina. Se chamarmos tudo isso de “o sistema”, não saberemos por onde investigar.

Imagine uma cozinha: o prédio e os equipamentos são hardware; as regras de funcionamento e distribuição de recursos lembram o sistema operacional; cada pedido em preparo é um trabalho em execução; o serviço de atendimento fica pronto para receber pedidos. A analogia ajuda, mas máquinas e programas não se comportam exatamente como pessoas.

## Modelo mental: seis peças distintas
1. **Hardware:** processador, memória, disco e dispositivos físicos. Uma falha de disco não é o mesmo que um erro na aplicação.
2. **Sistema operacional:** software que gerencia recursos e oferece isolamento e permissões para processos. Exemplos: Linux e Windows.
3. **Programa/aplicativo:** código e arquivos que descrevem o que a aplicação pode fazer.
4. **Processo:** instância em execução de um programa, com memória, identidade e permissões próprias. Um mesmo programa pode possuir vários processos.
5. **Serviço:** função oferecida de modo contínuo ou sob demanda. Frequentemente é implementada por um ou mais processos, mas serviço e processo não são sinônimos.
6. **Dados persistidos:** informações que continuam existindo após o processo terminar, como registros em um banco ou arquivos.

## Acompanhe uma requisição
```text
Navegador (cliente)
  -> rede -> servidor HTTP -> aplicação/API
                         -> consulta ao banco
                         <- resultado
  <- resposta HTTP <- aplicação/API
```
O navegador é um cliente. A API é uma **interface de comunicação**, não necessariamente um computador separado. A aplicação pode estar em uma VM, container, servidor físico ou serviço gerenciado. O banco pode executar na mesma máquina ou em outra. A arquitetura define essas escolhas.

Em uma aplicação web típica, o navegador recebe HTML, CSS e JavaScript. Parte do código é executada localmente, mas decisões críticas — como permitir que você leia um pedido privado — devem ser verificadas no lado confiável do servidor. Esconder o botão no navegador não garante autorização.

## Uma falha observável não revela automaticamente a causa
Se a página retornar `500`, sabemos que a requisição falhou no processamento, mas não em qual camada. Pode ser uma exceção na aplicação, uma dependência indisponível ou erro de configuração. Um `404` pode refletir recurso inexistente ou uma política deliberada que evita revelar sua existência. O diagnóstico exige evidência adicional.

Para investigar com segurança: descreva o comportamento, identifique o componente que produz a mensagem, consulte logs autorizados e reproduza o problema com dados fictícios. Não peça credenciais nem execute comandos desconhecidos para “testar”.

## Experimento guiado, sem instalação
Desenhe no papel um navegador, uma API e um banco. Acrescente uma seta mostrando onde o pedido entra e outra mostrando onde a resposta volta. Agora coloque um cadeado no ponto em que a API verifica se o usuário pode consultar o objeto. Explique por que o cadeado desenhado **apenas no botão** não impediria uma requisição enviada por outro cliente.

## Erros comuns
- “API é a mesma coisa que banco”: não; ela define um contrato de acesso e pode consultar várias fontes.
- “Container é outro sistema operacional completo”: normalmente compartilha o kernel do host, diferentemente de uma VM tradicional.
- “O site exibiu um erro, logo o problema é frontend”: a interface é apenas onde o erro ficou visível.
- “Está autenticado, então pode ver qualquer registro”: autenticação e autorização respondem perguntas diferentes.

## Prática de transferência
Uma equipe coloca a interface em um servidor estático e a API em outro serviço. Onde ficam as sessões e a autorização? O fato de a interface ser estática garante que todos os dados estejam públicos? Responda com um diagrama e separe o que você sabe do que depende da implementação.

## Revisão pessoal
Antes de ler uma solução, tente explicar a ideia com palavras suas, complete o exercício objetivo e produza a atividade prática. Registre **dúvidas e hipóteses** separadamente.

## Fontes e autoria
Aula autoral baseada nos conceitos das referências listadas no frontmatter. Não reproduz o texto original de terceiros. Rascunho: **revisão técnica e pedagógica humana ainda pendente**, inclusive validação dos URLs na data de publicação.
