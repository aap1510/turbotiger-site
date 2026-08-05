# Modelo de dados lógico inicial

O Codex deve transformar esta lista em ERD e migrações depois da aprovação.

## Schema oficial

Todas as tabelas, views, funções, filas, políticas e demais objetos próprios listados neste documento pertencem ao schema `mod_mkt`, dentro do mesmo projeto Supabase utilizado pelo aplicativo Turbo Tiger. Referências a objetos de outros schemas devem ser explícitas, justificadas e protegidas por interfaces autorizadas.

## Identidade e organização

- organizations
- brands
- users
- memberships
- roles
- permissions
- service_accounts

## Conectores

- connector_definitions
- connector_instances
- external_accounts
- oauth_credentials_encrypted
- connector_capabilities
- connector_health_checks
- webhook_endpoints
- webhook_events

## IA

- ai_providers
- ai_models
- ai_routes
- prompt_templates
- prompt_versions
- ai_runs
- ai_usage_costs
- tool_calls

## Conteúdo

- media_assets
- asset_versions
- content_briefs
- content_items
- content_variants
- content_approvals
- publishing_schedules
- publishing_jobs
- external_publications

## Celebridades e direitos

- celebrities
- rights_contracts
- contract_platform_rules
- contract_usage_rules
- territories
- territory_versions
- territory_platform_mappings
- contract_territories
- asset_rights

## Campanhas

- campaign_briefs
- campaigns
- ad_groups_or_sets
- ads
- creatives
- budgets
- budget_rules
- optimization_rules
- platform_snapshots
- performance_metrics

## Omnichannel e CRM

- contacts
- contact_identities
- conversations
- conversation_participants
- messages
- message_attachments
- inbox_assignments
- conversation_tags
- crm_pipelines
- crm_stages
- opportunities
- activities
- tasks
- lead_sources
- touchpoints
- conversions
- conversion_exports

## Governança

- policies
- policy_versions
- policy_evaluations
- approval_requests
- approvals
- feature_flags
- audit_events
- incidents
- outbox_commands
- idempotency_keys
- scheduled_jobs
- dead_letter_items

## Requisitos de modelagem

- organization_id nas entidades isoladas por organização;
- nomes físicos qualificados por `mod_mkt` e sem criação de tabelas próprias em `public`;
- timestamps e actor em operações relevantes;
- soft delete onde auditoria exigir preservação;
- hash/versão para ativos, contratos, políticas e territórios;
- IDs externos separados por plataforma;
- payload bruto criptografado ou minimizado conforme necessidade;
- índices para webhooks, mensagens, filas e métricas;
- retenção configurável para dados pessoais e payloads brutos.
