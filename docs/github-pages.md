# GitHub Pages — preparação e publicação manual

A publicação é pública. Não habilite nem execute o workflow até a autorização do mantenedor. A prévia do PR #12 continua independente.

1. Integre o PR de preparação após a CI aprovada. Em Settings → Pages, selecione **GitHub Actions** como fonte somente quando a publicação estiver autorizada.
2. Em Actions → **Publicar GitHub Pages (manual)** → Run workflow, selecione `main`. O workflow aceita apenas essa branch e não executa a cada merge.
3. Confira o job de publicação e acesse `https://carlossgluz.github.io/AppSecTrail/`. Dados de perfil permanecem no navegador; a origem do GitHub Pages é diferente de localhost, portanto não compartilha IndexedDB com ele. Use exportação e importação de backup para transferir o perfil.
4. Para reverter o conteúdo, reverta a alteração por PR e execute novamente o workflow manual na `main`. Para retirar o site do ar, desabilite o GitHub Pages em Settings → Pages; isso não remove cópias previamente feitas por terceiros.

Para testar a build sem publicar: `APPSECTRAIL_GITHUB_PAGES=true npm run build`; sirva `dist` sob `/AppSecTrail/` e execute os testes de `playwright.pages.config.ts` conforme a CI. O desenvolvimento normal usa base `/`.
