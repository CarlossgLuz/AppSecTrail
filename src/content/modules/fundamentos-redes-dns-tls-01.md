---
title: 'Redes para AppSec: DNS, IP, portas e TLS sem mistério'
category: Fundamentos
summary: Siga a jornada de uma conexão HTTPS e saiba o que cada controle realmente garante.
version: 1
draft: true
id: fundamentos-redes-dns-tls-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
- Demonstrar Siga a jornada de uma conexão HTTPS e saiba o que cada controle realmente garante
competencyIds:
- F04.01
- F04.02
references:
- url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
  accessDate: '2026-11-02'
- url: https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security
  accessDate: '2026-11-02'
- url: https://developer.mozilla.org/en-US/docs/Glossary/DNS
  accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites:
  - Diferenciar cliente e servidor
  pedagogicalReview: pending
  activities:
  - id: fundamentos-redes-dns-tls-01-quiz-01
    version: 1
    format: multiple-choice
    hints:
    - Pense em proteger a viagem dos dados versus decidir quem pode lê-los.
  - id: fundamentos-redes-dns-tls-01-pratica-01
    version: 1
    format: analysis
    hints:
    - Separe o que sabe do que precisa verificar.
exercise:
  prompt: Que afirmação sobre HTTPS está correta?
  correctId: tls
  hint: Pense em proteger a viagem dos dados versus decidir quem pode lê-los.
  options:
  - id: tls
    label: Ajuda a proteger o transporte, mas não substitui autorização por objeto.
    feedback: Correto. A proteção do canal e a decisão sobre objetos resolvem problemas diferentes.
  - id: authz
    label: Garante que todo usuário autenticado tem acesso apenas a seus objetos.
    feedback: Isso depende da lógica de autorização da aplicação.
  - id: codigo
    label: Elimina falhas de implementação na API.
    feedback: A camada TLS não corrige código de negócio ou consultas vulneráveis.
---

## O que você vai conseguir fazer
Explicar, sem decorar siglas, o caminho entre digitar uma URL HTTPS e receber uma resposta. O objetivo é localizar dependências e fronteiras de confiança antes de avançar para testes de aplicações.

## Um cenário inicial
Você digita `https://loja.example/pedidos` no navegador. Parece uma única ação, mas envolve resolução de nome, conexão, estabelecimento de transporte seguro e troca de mensagens HTTP. O navegador pode reutilizar conexões, cache ou outras otimizações; esta é uma representação didática, não uma sequência universal de pacotes.

## Quatro conceitos que não são sinônimos
- **DNS:** associa nomes a informações, frequentemente endereços IP. Resolver o nome não prova que o servidor é confiável.
- **IP:** endereçamento e encaminhamento entre redes. Um mesmo serviço pode usar vários IPs e um IP pode hospedar vários serviços.
- **Porta:** ajuda a identificar o destino de uma comunicação em um host. Portas 443 e 80 são convenções comuns para HTTPS e HTTP, mas a numeração isolada não garante protocolo ou segurança.
- **TLS:** protocolo que protege a comunicação quanto a confidencialidade e integridade durante o transporte, quando corretamente estabelecido e validado. Não corrige autorização ou código vulnerável na aplicação.

## Fluxo de referência
```text
URL https://loja.example/pedidos
    | nome do host
    v
DNS -> dados de resolução
    |
Conexão com destino e porta configurada
    |
TLS -> validação da identidade do servidor e chaves de sessão
    |
HTTP GET /pedidos -> aplicação/API -> política de autorização
    |
HTTP resposta <- aplicação
```
Uma conexão HTTPS pode usar HTTP/2 ou HTTP/3 e diferentes transportes. Portanto não memorize “HTTPS significa sempre HTTP sobre TCP” como regra universal. Aprenda primeiro a função de cada camada.

## O que o cadeado do navegador NÃO garante
O HTTPS corretamente estabelecido ajuda a proteger os dados em trânsito e a verificar a identidade do servidor conforme a cadeia de confiança. Ele não diz que o vendedor é honesto, que o servidor não possui SQL Injection, que o usuário tem permissão para ler o pedido nem que a informação retornada é verdadeira.

## Exposição versus risco
A presença de uma porta acessível ou de um serviço na internet é **superfície de exposição**, não prova automática de vulnerabilidade explorável. É necessário conhecer produto, versão, configuração, autenticação, controles compensatórios e o ambiente. Não realize varreduras em servidores de terceiros sem autorização.

## Diagnóstico seguro por sintomas
- “Nome não resolve”: hipótese envolvendo DNS, resolução local ou conectividade.
- “Falha ao validar certificado”: hipótese envolvendo confiança, nome do host, cadeia ou data. Não recomende desabilitar validação TLS.
- “HTTP 403”: a comunicação pode ter funcionado; servidor negou operação conforme sua política.
- “Página demorou”: pode ter muitas causas; latência sozinha não identifica falha de TLS ou DNS.

## Experimento sem comandos
Desenhe as camadas e coloque três etiquetas: (1) DNS responde sobre o destino, (2) TLS protege transporte, (3) API decide autorização. Se você retirasse a checagem de propriedade da API, qual dos outros dois controles a substituiria? **Nenhum.**

## Transferência
Uma API usa HTTPS, mas permite a qualquer usuário autenticado acessar o pedido de outro cliente. Identifique o controle funcionando e o controle ausente. Em seguida, descreva quais informações seriam necessárias para afirmar o impacto. Diferencie hipótese de evidência.

## Revisão pessoal
Antes de ler uma solução, tente explicar a ideia com palavras suas, complete o exercício objetivo e produza a atividade prática. Registre **dúvidas e hipóteses** separadamente.

## Fontes e autoria
Aula autoral baseada nos conceitos das referências listadas no frontmatter. Não reproduz o texto original de terceiros. Rascunho: **revisão técnica e pedagógica humana ainda pendente**, inclusive validação dos URLs na data de publicação.
