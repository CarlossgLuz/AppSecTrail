# Prévia temporária Cloudflare Workers

Prévia separada da publicação oficial. Não há implantação automática neste repositório.

1. Use uma conta pessoal Cloudflare no plano Free e confira a conta ativa e o nome do Worker antes de continuar.
2. No checkout revisado, execute `npm ci` e `npm run build`.
3. Após autorização para publicar, execute `npx wrangler@4.135.0 login` e depois `npx wrangler@4.135.0 preview --config wrangler.preview.jsonc --name homologacao`.
4. O comando apresenta o endereço da prévia. URLs de prévia são públicas por padrão, mesmo com `noindex`; configure Cloudflare Access antes de enviar dados sensíveis ou use apenas dados sintéticos.
5. Para remover a prévia, execute `npx wrangler@4.135.0 preview delete --config wrangler.preview.jsonc --name homologacao` e confirme sua remoção no painel. Isso não remove outros Workers.

O perfil e o histórico ficam no armazenamento local de cada origem/navegador. Trocar de URL não transfere dados: use exportação e importação explícitas. Arquivos estáticos servidos diretamente não têm cobrança por requisição; confira limites e preços atuais antes de ativar serviços adicionais.

Referências: https://developers.cloudflare.com/workers/previews/ e https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ .
