# ExecPlan oficial do MKT Digital

## Estado do plano

- Projeto: **MKT Digital**.
- `project_slug`: `mkt_digital`.
- Diretório oficial: `turbotiger-site/adm/mkt`.
- Módulo e schema de negócio: `mod_mkt`.
- Versão do plano: `1.0`.
- Data-base das decisões e validações externas: `2026-08-03`.
- Estado: **Marco M0 materializado; aguardando revisão do proprietário**.
- Próxima autorização possível: Marco M1, somente após aprovação explícita separada.

Este documento é vivo. Depois de cada marco aprovado, ele deverá registrar resultado, testes, desvios, decisões e o commit correspondente. Aprovar este documento não autoriza executar todos os marcos.

## Objetivo e resultado observável

Construir gradualmente uma plataforma web/backend multiempresa para planejamento, produção, operação, atendimento e análise de marketing omnichannel, com governança por políticas, aprovações, direitos, consentimento, orçamento e auditoria.

O primeiro MVP utilizável deverá permitir, com segurança:

1. administrar organizações, workspaces lógicos de teste/produção, marcas e produtos;
2. configurar plugins internos e conectores por capability;
3. produzir e aprovar conteúdo e campanhas;
4. operar Meta Ads com novas campanhas/anúncios pausados;
5. operar Instagram/Facebook e WhatsApp em modelo inbound-first;
6. centralizar conversas, contatos e oportunidades em caixa omnichannel/CRM;
7. usar OpenAI através de AI Orchestrator e AI Gateway agnósticos;
8. consolidar métricas operacionais no Turbo Analytics;
9. provar toda ação externa por idempotência, readback, reconciliação e auditoria.

O resultado observável do Marco M0 é apenas documental e de versionamento: Git restrito ao diretório oficial e oito documentos de arquitetura/execução, sem código, migration, dependência, deploy, mudança no Supabase ou conexão externa.

## Contexto e fontes lidas

Foram lidos integralmente e tratados como fontes do planejamento:

- `AGENTS.md`, `README-INICIO.md` e `.agent/PLANS.md`;
- os documentos `docs/00` a `docs/16`;
- `references/README.md` e os dois PDFs de referência;
- todos os JSONs de `examples/`;
- todos os prompts de `prompts/`;
- `_conversa_chatgpt.docx`;
- instruções relevantes do `AGENTS.md` do projeto principal;
- referências institucionais, estratégicas, contratuais e operacionais autorizadas em `docs/_referencias` do projeto principal;
- configuração local do Supabase e uma inspeção somente leitura do catálogo.

Achados confirmados na inspeção:

- o schema `mod_mkt` ainda não existe;
- `pg_cron` e `pg_net` estão instalados;
- `pgmq` e `vault` ainda não estão instalados;
- a Data API expõe atualmente `public` e `graphql_public`, não `mod_mkt`;
- o projeto Supabase possui outros módulos que não poderão ser acoplados diretamente;
- o Git principal ignorava todo `turbotiger-site/`; a exceção local foi limitada a `turbotiger-site/adm/mkt/**`.

Guias históricos com linguagem de lucro, crescimento de banca ou incentivo a apostas não são posicionamento vigente. Prevalece:

> O Turbo Tiger não foi criado para incentivar apostas. Foi criado para incentivar o controle e o jogo responsável.

## Escopo e fora de escopo

### Incluído na arquitetura

- painel administrativo Next.js;
- API própria em Supabase Edge Functions;
- Postgres/Auth/Storage/Queues/Cron do Supabase atual;
- schema privado `mod_mkt`;
- multiempresa, workspaces, marcas e produtos;
- RBAC, RLS, feature flags e auditoria;
- Plugin System Nível 1;
- Connector Engine e Connector Registry;
- AI Orchestrator, AI Gateway e provider plugins;
- Event Bus por outbox + Supabase Queues;
- Policy Engine e Approval Engine;
- prompts e templates versionados;
- conteúdo, campanhas e biblioteca de mídia;
- celebridades, contratos, ativos e territórios;
- caixa omnichannel, CRM, consentimento e supressão;
- Turbo Analytics operacional;
- observabilidade, idempotência, readback, reconciliação e DLQ.

### Fora do MVP

- alteração do app Delphi/FireMonkey;
- onboarding SaaS público, billing, trial e white-label;
- marketplace público ou execução dinâmica de plugins;
- código de terceiros e SDK público;
- Cloud Run, Redis, Kafka ou data warehouse completo;
- ativação automática de campanhas;
- prospecção fria, listas compradas ou disparos em massa;
- suporte legado, migração de versões antigas ou compatibilidade retroativa não solicitada;
- implantação simultânea de todos os conectores planejados;
- integrações financeiras ou módulos não relacionados ao escopo de marketing.

## Decisões arquiteturais consolidadas

1. O nome oficial permanece **MKT Digital**; a modularidade será interna.
2. Todos os objetos de negócio ficam em `mod_mkt`.
3. `auth`, `storage`, `pgmq`, `pgmq_public` e `vault` são possíveis exceções gerenciadas da infraestrutura, não domínios de negócio.
4. O frontend nunca acessa `mod_mkt` diretamente pela Data API.
5. A API humana não usa `service_role`; roles técnicas serão limitadas ao módulo.
6. Produção e teste compartilham o projeto Supabase, mas usam workspaces, contas, buckets, flags e allowlists isolados.
7. O Plugin System do MVP contém apenas plugins internos registrados, testados e publicados por deploy.
8. O painel configura plugins instalados; não instala nem executa código.
9. O Connector Engine é universal, mas Meta/Instagram/Facebook/WhatsApp formam o MVP funcional.
10. OpenAI é o primeiro adapter; provider ou protocolo novo entra por plugin sem reestruturar o core/banco.
11. Eventos desacoplam módulos, mas não substituem o estado relacional nem a auditoria.
12. Toda escrita externa passa por policy, capability, flag/aprovação, idempotência e auditoria.
13. Campanhas e anúncios nascem pausados; publicação orgânica permanece rascunho até o último gate.
14. Direitos de celebridade são fail-closed.
15. Para Cauã Reymond, pago fica bloqueado até região/datas; orgânico não recebe restrição territorial inventada, mas continua sujeito aos demais direitos.

As alternativas e justificativas estão em `ARCHITECTURE_DECISIONS.md`.

## Arquivos e módulos previstos

Estrutura-alvo, a ser criada somente nos marcos autorizados:

```text
apps/
  web/
  edge-api/
  edge-workers/

packages/
  core/
  contracts/
  database/
  event-bus/
  policy-engine/
  approval-engine/
  ai-orchestrator/
  ai-gateway/
  connector-engine/
  plugin-contracts/
  plugin-registry/
  prompt-engine/
  template-engine/
  analytics/
  observability/
  testkit/
  plugins/

database/
  migrations/
  verification/
  rollback/
```

Fontes de migrations do MKT Digital serão versionadas dentro de `turbotiger-site/adm/mkt/database/migrations`. A CLI usada continuará sendo a CLI local do projeto principal. Nenhuma migration será criada no M0.

## Banco e migrations

### Princípios

- migrations SQL-first, pequenas, aditivas e revisáveis;
- um arquivo aplicado por vez, nunca `supabase db push`;
- nomes lowercase `snake_case`;
- `bigint identity` para tabelas internas de alto volume quando adequado e IDs opacos para exposição externa;
- `timestamptz`, boolean, text e valores monetários exatos; nunca `float` para dinheiro;
- PK em toda tabela, FK indexada e índices compostos/participais alinhados aos filtros reais;
- RLS habilitada e forçada quando aplicável;
- políticas otimizadas, com colunas de tenant/membership indexadas;
- paginação por cursor nas listas volumosas;
- transações curtas, sem chamadas HTTP dentro delas;
- limites de conexão, pool transacional e `statement_timeout`;
- retenção antes de acumular webhooks, mensagens, métricas ou payloads brutos.

### Procedimento remoto futuro

Antes de qualquer migration remota:

1. validar o SQL localmente;
2. confirmar e registrar o backup gerenciado mais recente;
3. obter dump estrutural dos objetos afetados;
4. fazer backup direcionado de `mod_mkt` quando houver dados;
5. revisar que não há alterações em schemas do app, salvo exceção autorizada de extensão/policy;
6. aplicar somente o arquivo aprovado com a CLI local;
7. verificar estrutura, grants, RLS e isolamento;
8. liberar comportamento apenas por feature flag.

Comando previsto:

```powershell
& ".\tools\supabase-cli\supabase.exe" db query --linked --file "turbotiger-site\adm\mkt\database\migrations\<arquivo-aprovado>.sql"
```

Não serão feitos dumps amplos de tabelas grandes do app sem autorização e análise do Disk IO Budget.

## Contratos de API, plugins e eventos

### API

- REST versionada sob `/v1` e descrita em OpenAPI;
- JWT Supabase, RBAC e contexto de tenant/brand/product;
- comandos assíncronos retornam `202` e um `external_action_id`;
- `Idempotency-Key` obrigatória em comandos externos;
- endpoints de webhook usam corpo bruto, assinatura, deduplicação e ACK rápido;
- endpoints internos de worker usam segredo/assinatura próprios, não sessão humana.

### Plugins

Cada release declara versão, compatibilidade, capabilities, config schema, scopes, egress permitido, risco e health check. Plugins não acessam outros plugins diretamente; usam contratos do core, Capability Broker ou eventos.

### Eventos

Envelope mínimo:

```text
event_id
tenant_id
event_type
schema_version
aggregate_type
aggregate_id
aggregate_version
correlation_id
causation_id
occurred_at
payload_ref
```

Estado, auditoria e outbox são gravados na mesma transação. Entrega é tratada como at-least-once; consumidores mantêm receipts idempotentes, limite causal e detecção de ciclos. Eventos não contornam Policy Engine.

### Ações externas

Estados mínimos:

```text
draft
blocked
awaiting_approval
approved
queued
executing
succeeded_unverified
succeeded
reconciliation_required
failed_retryable
failed_terminal
compensating
compensated
cancelled
```

## Segurança, privacidade, gastos e direitos

Controles obrigatórios:

- isolamento por organization/workspace, RLS e FKs compostas;
- credenciais por referência segura, nunca no browser, logs ou auditoria;
- OAuth com menor escopo, PKCE/state e revogação;
- webhook assinado, anti-replay e tamanho máximo;
- idempotência ponta a ponta e reconciliação antes de repetir writes incertos;
- reservas/tetos de orçamento e kill switch;
- aprovação vinculada ao hash do payload e versões usadas;
- prompt injection tratado como dado hostil;
- minimização e redação de PII antes da IA;
- allowlist de egress para providers/conectores;
- consentimento, janela do canal, supressão e descadastro;
- controle transacional do handoff humano;
- contratos, ativos, formatos, plataformas, vigência e território versionados;
- auditoria append-only e exportação de evidências;
- lotes/índices/retention para proteger o IO do Supabase compartilhado.

O modelo detalhado está em `SECURITY-THREAT-MODEL.md`.

## Estratégia de testes

### Camadas

- unitários: policies, approvals, capability checks, roteamento de IA, consentimento, rights e cálculos;
- propriedade: invariantes de idempotência, orçamento e isolamento;
- integração Postgres/Supabase local: schema, RLS, roles, migrations, queue/outbox e concorrência;
- contrato: adapters e webhooks com fixtures redigidas/mocks oficiais;
- E2E Playwright: painel, aprovações, inbox, handoff e fluxos principais;
- segurança: cross-tenant, SSRF, prompt injection, replay, privilege escalation e anexos;
- resiliência: timeout, rate limit, token expirado, worker morto, lease e DLQ;
- operação: readback, drift, rollback por flag e reconciliação.

CI não acessa contas reais nem o Supabase de produção. Homologação remota usa somente workspace/contas/allowlists de teste após aprovação.

## Plano de rollback

- código: reverter o commit do marco e manter a feature flag desligada;
- worker: parar novos claims, drenar/inativar a fila e preservar evidências;
- banco: migration compensatória; evitar remoção destrutiva automática;
- plugin: desabilitar release e retornar à release anterior compatível;
- prompt/template: mover o ponteiro de release para versão anterior;
- ação externa: pausar/compensar quando a API permitir; nunca prometer undo inexistente;
- incidente: kill switch global/tenant/conector/capability;
- dados: restauração direcionada do módulo; backup global não equivale a restore isolado.

## Marcos e critérios de saída

| Marco | Entrega | Critério de saída |
|---|---|---|
| M0 | Exceção Git e oito documentos | Apenas MKT rastreado; documentos revisados; nenhum código/Supabase |
| M1 | Monorepo, contratos, registries, mocks e CI | Lint/typecheck/testes; nenhum conector real |
| M2 | Backup, `mod_mkt`, multiempresa, RBAC/RLS, flags e auditoria | Teste cross-tenant e test/prod aprovado |
| M3 | PGMQ/Vault, Event Bus, jobs, Policy/Approval Engines e DLQ | Idempotência, retry, cycle guard e kill switch aprovados |
| M4 | Storage, mídia, celebridades, contratos e territórios | Direitos fail-closed e Cauã bloqueado corretamente |
| M5 | Inbox/CRM com plugins mockados | Webhook, consentimento, SLA e handoff aprovados |
| M6 | AI Orchestrator/Gateway, OpenAI, prompts e templates | Custo, fallback, PII e prompt injection aprovados |
| M7 | Meta read-only, Registry operacional e Analytics inicial | Nenhum write; métricas reconciliadas |
| M8 | Meta Ads pausado | Readback confirma estado pausado; timeout reconciliado |
| M9 | Meta Organic e WhatsApp inbound-first | Janela, templates, opt-in, supressão e auditoria aprovados |
| M10 | Piloto controlado | Limites baixos, alertas, runbook e rollback demonstrados |

Cada marco terá branch `codex/mN-*`, commits restritos ao MKT Digital, testes, demonstração e aprovação separada. O backlog detalhado está em `MVP-BACKLOG.md`.

## Dependências externas e aprovações manuais

O código poderá criar fluxos de OAuth, webhooks e configurações; o proprietário/plataforma deverá criar e autorizar contas, apps, ativos, números, projetos, escopos e revisões. Nada será conectado durante o M0.

Antes dos marcos que usam produção serão necessários, entre outros:

- contas/ativos Meta e WhatsApp;
- conta/projeto OpenAI e teto de gasto;
- política de consentimento, retenção e LGPD;
- base oficial e SLA de atendimento;
- limites de orçamento e matriz de aprovação;
- dados contratuais completos de Cauã;
- secrets inseridos diretamente no cofre autorizado.

O checklist completo está em `EXTERNAL-SETUP-CHECKLIST.md`.

## Decisões pendentes do proprietário

Somente questões que bloqueiam um marco permanecem em `OPEN-QUESTIONS.md`. Enquanto uma questão estiver aberta, o comportamento correspondente será fail-closed. Nome, schema, Git, Plugin System, multiempresa e topologia do MVP estão encerrados.

## Registro de progresso

| Marco | Estado | Evidência |
|---|---|---|
| M0 | Materializado; aguardando revisão | Oito documentos + commit exclusivo do MKT Digital |
| M1–M10 | Não autorizados | Nenhuma execução iniciada |
