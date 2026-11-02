# AppSecTrail

Plataforma aberta de aprendizagem em AppSec e DevSecOps. O catálogo permite estudar módulos independentes; a trilha inicial organiza fundamentos de HTTP. O perfil, o progresso e as avaliações ficam no navegador, em IndexedDB, sem conta online.

O projeto está em desenvolvimento. Conteúdo ainda não revisado permanece em rascunho. Os resultados de questionários indicam desempenho nas questões respondidas e não comprovam domínio profissional.

## Executar localmente

Requisitos: Node.js 24 e npm. Na raiz do repositório:

```sh
npm ci
npm run dev
```

Abra o endereço mostrado pelo Astro. Para validar alterações:

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

A CI também executa a suíte de aulas com uma build de teste isolada. O armazenamento local pertence ao navegador: exporte um backup JSON antes de limpar dados ou trocar de dispositivo; mantenha-o em local seguro, pois pode conter seu histórico.

## Contribuições e segurança

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de contribuir e [SECURITY.md](SECURITY.md) para relatar vulnerabilidades. A aplicação é estática; não inclua segredos ou dados reais em exemplos.

## Licenças

O código é distribuído sob [MIT](LICENSE). O conteúdo educacional original em `src/content/modules/` é disponibilizado sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), salvo indicação explícita diferente. As referências externas continuam sujeitas às respectivas licenças; citar uma fonte não transfere sua licença ao projeto.
