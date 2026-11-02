---
title: 'CI/CD do zero: do Pull Request à entrega verificada'
category: DevSecOps
summary: Entenda gatilhos, jobs, testes, artefatos, deploy e as primeiras fronteiras de confiança.
version: 1
draft: true
id: devsecops-cicd-fundamentos-01
locale: pt-BR
author: AppSecTrail — conteúdo autoral assistido por GPT-6
license: CC-BY-4.0
technicalReviewStatus: pending
lastTechnicalReview: ''
learningObjectives:
- Distinguir gatilhos, jobs, testes, artefatos e deploy em um pipeline simples.
- Identificar a fronteira de confiança entre código de PR não confiável e operações com credenciais sensíveis.
competencyIds:
- D01.01
- D01.02
- D01.05
references:
- url: https://docs.github.com/en/actions/get-started/understand-github-actions
  accessDate: '2026-11-02'
- url: https://docs.github.com/en/actions/security-for-github-actions/security-guides
  accessDate: '2026-11-02'
editorial:
  version: 1
  prerequisites:
  - Git, commits e Pull Requests recomendados
  pedagogicalReview: pending
  activities:
  - id: devsecops-cicd-fundamentos-01-quiz-01
    version: 1
    format: multiple-choice
    hints:
    - Quem controla o código executado e quais credenciais estão disponíveis?
  - id: devsecops-cicd-fundamentos-01-pratica-01
    version: 1
    format: analysis
    hints:
    - Separe o que sabe do que precisa verificar.
exercise:
  prompt: Qual divisão reduz o risco de um PR externo acessar credenciais de produção?
  correctId: separacao
  hint: Quem controla o código executado e quais credenciais estão disponíveis?
  options:
  - id: separacao
    label: Testar PR não confiável sem credenciais sensíveis e usar etapa de deploy confiável separada.
    feedback: 'Correto: limite de confiança e privilégios mínimos precisam atuar juntos.'
  - id: token
    label: Usar token de produção no mesmo job e apenas ocultar o valor nos logs.
    feedback: Mascaramento de logs não impede código do job de acessar o token.
  - id: scanner
    label: Adicionar SAST ao job privilegiado e permitir qualquer script do PR.
    feedback: Scanner não substitui isolamento de execução e credenciais.
---

## O que você vai conseguir fazer
Ler um pipeline curto de CI e explicar quais etapas **conferem mudanças** e quais etapas **alteram ambientes**. Ao final, saiba por que testes de Pull Requests de desconhecidos não devem compartilhar credenciais de produção.

## O problema: “subiu o código, então está pronto?”
Quando alguém abre um Pull Request, a mudança pode compilar e ainda quebrar uma regra de negócio. Integração contínua (CI) executa verificações repetíveis a cada evento configurado. Entrega/implantação contínua (CD) envolve empacotar e entregar ou implantar versões sob gates apropriados. As siglas variam em interpretação entre organizações; declare o que cada estágio faz no projeto.

## Vocabulário operacional
- **Trigger/gatilho:** evento que inicia a execução, como atualização de PR ou push.
- **Workflow/pipeline:** conjunto declarado de operações.
- **Job:** unidade agendada de trabalho, frequentemente em runner isolado.
- **Step:** comando ou ação dentro de um job.
- **Runner:** ambiente que executa o job; pode ter acesso a rede, arquivos e credenciais conforme configuração.
- **Artifact:** saída produzida e armazenada, como relatório ou pacote de build. Não é automaticamente confiável só por ter sido gerado pela CI.
- **Gate:** condição que precisa ser satisfeita para liberar uma próxima etapa, como testes, revisão ou autorização humana.
- **Deploy:** implantação em ambiente; não é sinônimo de build concluído.

## Leia um workflow ilustrativo
```yaml
name: Validacao
on:
  pull_request:
permissions:
  contents: read
jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
```
**Atenção:** o exemplo é didático, não um template de produção. Em repositórios reais, prefira fixar ações por commit SHA completo validado, entender permissões de token, revisar a cadeia de dependências e usar versões oficialmente suportadas. Não execute código de PR não confiável em contexto com segredos de deploy.

## Fluxo de confiança
```text
PR não confiável -> testes isolados -> revisão humana -> merge aprovado
                                                |
                                      build de branch confiável
                                                |
                                      publicação/deploy com escopo mínimo
```
Uma falha recorrente é misturar “testar código enviado por qualquer pessoa” com “usar token que altera produção”. Reduzir permissões ajuda, mas a separação entre trabalhos confiáveis e não confiáveis é decisiva.

## O que um check verde realmente demonstra?
Demonstra que os comandos executados terminaram no resultado esperado, dentro da infraestrutura e do escopo dos testes. Não demonstra ausência de vulnerabilidades, cumprimento de todos os requisitos ou integridade de componentes não cobertos. Um script malicioso pode até procurar credenciais se for executado em runner privilegiado.

## Prática orientada
Desenhe dois caminhos: PR de fork e alteração já integrada. Marque onde existem credenciais de publicação. Justifique por que só o caminho confiável pode acessar o ambiente de deploy e quais revisões adicionais são necessárias.

## Contraprova
Você adicionou um scanner SAST à CI, mas ele falha ao baixar o banco de regras. A CI falhou, mas não há evidência automática de que o código possua uma vulnerabilidade. Diferencie **erro de ferramenta**, **finding confirmado**, **teste falho** e **gate aprovado**.

## Transferência
Um pipeline roda `npm install` de um PR externo com token capaz de alterar o registry interno. Explique o risco e proponha isolamento, privilégios mínimos, pinning e governança de artefatos. Não copie comandos inseguros para uso real.

## Revisão pessoal
Antes de ler uma solução, tente explicar a ideia com palavras suas, complete o exercício objetivo e produza a atividade prática. Registre **dúvidas e hipóteses** separadamente.

## Fontes e autoria
Aula autoral baseada nos conceitos das referências listadas no frontmatter. Não reproduz o texto original de terceiros. Rascunho: **revisão técnica e pedagógica humana ainda pendente**, inclusive validação dos URLs na data de publicação.
