# Arquitetura e stack proposta

Esta é uma base inicial. O Codex deve validar e registrar decisões em ADRs antes de implementar.

## Arquitetura lógica

```text
Painel administrativo
        |
API/BFF autenticada
        |
MKT Digital Core
  |-- Policy Engine
  |-- Approval Engine
  |-- AI Gateway
  |-- Content Planner
  |-- Campaign Orchestrator
  |-- Omnichannel Hub
  |-- CRM/Attribution
  |-- Audit/Event Log
        |
Connector Gateway
  |-- Meta Ads
  |-- Meta Organic/Messaging
  |-- WhatsApp
  |-- Google Ads
  |-- YouTube
  |-- TikTok
  |-- AdMob
  |-- Gmail/Microsoft
        |
APIs e MCPs oficiais
```

## Base técnica sugerida

- Monorepo TypeScript com workspaces.
- Aplicação web administrativa em Next.js/React.
- Projeto Supabase já existente do aplicativo Turbo Tiger para Postgres, Auth, Storage e RLS.
- Schema exclusivo `mod_mkt` para todos os objetos próprios do MKT Digital.
- Serviço Node.js/TypeScript para webhooks, jobs e tarefas longas.
- Fila persistente com retries, dead-letter queue e idempotência.
- Armazenamento de mídia no Supabase Storage ou provedor compatível.
- Contratos internos com schemas validados.
- Testes unitários, integração e E2E.

## Estrutura sugerida do monorepo

```text
apps/
  admin-web/
  api/
  worker/
packages/
  core/
  policy-engine/
  ai-gateway/
  connectors/
  db/
  ui/
  observability/
supabase/
  migrations/
  functions/
docs/
```

## Padrões obrigatórios

- Adapter/port para cada plataforma.
- Capability matrix para declarar o que cada conector suporta.
- Outbox para ações externas.
- Inbox/idempotency store para webhooks.
- Feature flags para toda escrita externa.
- Readback verification após criar/alterar campanha.
- Saga/compensação para fluxos com múltiplas plataformas.
- Versionamento de prompts, políticas, territórios e ativos.

## Ambientes

- local;
- desenvolvimento;
- homologação/sandbox;
- produção.

Produção nunca deve compartilhar credenciais, banco ou buckets com homologação.

## Integração com o Supabase existente

- Reutilizar o projeto Supabase já vinculado na raiz `\TurboTiger\Desenvolvimento`, resolvida a partir da unidade ou compartilhamento atual.
- Usar a CLI local `tools\supabase-cli\supabase.exe`; não instalar ou vincular outro projeto Supabase para o MKT Digital.
- As migrations físicas permanecem na infraestrutura Supabase do projeto principal, com objetos qualificados por `mod_mkt`.
- O acesso a dados de outros schemas deve ocorrer somente por interfaces autorizadas, com menor privilégio e auditoria.
- Nunca executar `supabase db push` sem solicitação explícita; aplicar somente a migration específica aprovada.
