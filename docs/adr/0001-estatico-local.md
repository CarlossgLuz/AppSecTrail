# ADR 0001 — Plataforma estática e dados locais

Estado: direção do produto aprovada; integração técnica em validação.

## Contexto
O projeto deve permitir estudo gratuito, sem conta, e sem custo obrigatório de servidor.

## Decisão
Gerar páginas estáticas com Astro e usar React apenas para interatividade necessária. O conteúdo versionado usa coleções tipadas. Dados de progresso serão tratados localmente em IndexedDB em outra entrega, com importação e exportação validadas.

## Consequências
Sem sincronização automática; limpeza de armazenamento pode apagar progresso. Backups, validação de arquivos não confiáveis, migrações e comunicação de risco são necessários antes de entregar perfis.

## Referências
- https://docs.astro.build/en/guides/content-collections/
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
