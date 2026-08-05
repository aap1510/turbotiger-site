# Decisões de arquitetura do MKT Digital

## Como ler este documento

Cada decisão compara opções relevantes e fixa a recomendação do ciclo atual. Uma alternativa rejeitada pode ser reavaliada por um ADR futuro quando métricas ou requisitos mudarem; não deve ser introduzida silenciosamente.

## ADR-001 — Identidade técnica e modularidade

| Opção | Prós | Contras |
|---|---|---|
| Renomear para uma plataforma genérica | Nome amplo | Perde contexto, exige reescrever documentos e estratégia de schema |
| Criar um schema por domínio | Isolamento físico | Multiplica grants, migrations, RLS e manutenção cedo demais |
| **MKT Digital + um schema `mod_mkt`** | Simples, coerente e modular por packages/tabelas | Exige disciplina de nomenclatura |

**Decisão:** manter `MKT Digital`, `project_slug=mkt_digital`, `module_key=mod_mkt` e um único schema privado `mod_mkt`. Domínios internos usam packages, serviços e prefixos de tabela quando úteis.

## ADR-002 — Stack e monorepo

| Opção | Prós | Contras |
|---|---|---|
| TypeScript + Python | Ecossistema de IA amplo | Dois toolchains e contratos duplicados no MVP |
| Polyrepo | Autonomia de deploy | Versionamento/contratos mais difíceis no início |
| **TypeScript estrito + pnpm/Turborepo** | Contratos compartilhados e menor complexidade | Exige packages runtime-neutral entre Node/Deno |

**Decisão:** TypeScript estrito ponta a ponta, Next.js para web, Deno/Edge para API e workers. Monorepo com `apps/` e `packages/`; versões exatas serão fixadas no M1, sem instalar nada no M0.

## ADR-003 — Deploy do MVP

| Opção | Prós | Contras |
|---|---|---|
| Vercel + Cloud Run + Redis | Workers persistentes e escala independente | Mais custo/operação antes da validação |
| Tudo em VPS/container | Controle | Maior responsabilidade operacional |
| **Vercel + Supabase Pro** | Reusa infraestrutura paga e reduz operação | Limites de CPU/memória/duração nas Edge Functions |

**Decisão:** Next.js na Vercel; API, webhooks e workers curtos em Supabase Edge Functions; Postgres/Auth/Storage/Queues/Cron no projeto atual. Cloud Run e Redis entram apenas após evidência técnica. Processamento pesado será delegado a APIs assíncronas.

Critérios para reavaliar: necessidade de WebSocket persistente, biblioteca nativa, jobs próximos do limite Edge, atraso recorrente de fila ou impacto de IO/conexão no app.

## ADR-004 — Schema privado e API

| Opção | Prós | Contras |
|---|---|---|
| Data API direta + RLS | Implementação rápida | Amplia superfície e espalha regras no cliente/banco |
| Somente RPC pública | Superfície estreita | Concentra toda regra em SQL e dificulta evolução |
| **API própria + schema não exposto** | Centraliza autorização, policy e auditoria | Exige API e roles técnicas corretas |

**Decisão:** `mod_mkt` não entra nos schemas expostos. O frontend usa REST `/v1`; a API valida JWT, tenant, RBAC e regras. RPCs internas ficam restritas a operações atômicas.

`service_role` é proibida no frontend e no fluxo humano. API, webhook e worker usam roles distintas, sem privilégios sobre schemas do app. A viabilidade pelo pooler é gate do M2.

## ADR-005 — Multiempresa e ambientes lógicos

| Opção | Prós | Contras |
|---|---|---|
| Apenas Turbo Tiger | Menor schema | Migração futura arriscada |
| SaaS comercial completo | Produto pronto para venda | Billing/onboarding/white-label explodem o MVP |
| **Base multiempresa operacional** | Isolamento futuro desde o início | Mais testes de autorização |

**Decisão:** `organizations` representam empresas; `workspaces` representam tenants/contextos `test` ou `production`; marcas e produtos pertencem à organização. Operações carregam `tenant_id=workspace_id` e relações críticas usam FKs compostas. Billing, onboarding público e white-label ficam pós-MVP.

Os workspaces `turbo_tiger_test` e `turbo_tiger_prod` são divisões lógicas no mesmo Supabase, não projetos ou ambientes contratados separados.

## ADR-006 — Filas e Event Bus

| Opção | Prós | Contras |
|---|---|---|
| Redis/Kafka | Alto throughput | Infraestrutura e operação adicionais |
| Event sourcing | Histórico completo por eventos | Complexidade desnecessária para o MVP |
| **Outbox + Supabase Queues/PGMQ** | Transacional, durável e já no Postgres | Objetos gerenciados fora de `mod_mkt`; cuidado com IO |

**Decisão:** estado relacional continua fonte da verdade. Estado, auditoria e outbox são gravados na mesma transação; dispatcher envia referência mínima ao PGMQ. Consumidores mantêm inbox/receipt idempotente e DLQ.

Eventos têm schema versionado, correlation/causation IDs, limite de profundidade e detecção de ciclos. Evento nunca executa escrita externa sem Policy Engine.

PGMQ/`pgmq_public` são schemas de extensão gerenciada; estado de negócio, jobs canônicos e ações externas continuam em `mod_mkt`.

## ADR-007 — Workers

| Opção | Prós | Contras |
|---|---|---|
| Um worker monolítico | Simples inicialmente | Falhas e deploys acoplados |
| Vários serviços persistentes | Isolamento máximo | Custo/operação precoce |
| **Handlers Edge especializados** | Separação lógica e baixo custo | Devem ser curtos, reinvocáveis e sem estado local |

**Decisão:** workers de IA, campanhas, conteúdo, inbox, analytics e reconciliação como consumidores separados. Lotes pequenos, visibility timeout, retry com backoff, DLQ e reconciliação. Contrato `QueuePort/WorkerRuntime` permite migração posterior.

## ADR-008 — Plugin System

| Opção | Prós | Contras |
|---|---|---|
| Marketplace dinâmico | Extensão sem deploy | RCE, supply-chain, sandbox, billing e compatibilidade |
| Apenas configuração declarativa | Seguro | Não integra protocolos proprietários complexos |
| **Nível 1: plugins internos por deploy** | Core extensível com risco controlado | Adapter novo ainda exige código revisado |

**Decisão:** plugins first-party no monorepo, releases imutáveis, capabilities, config schema, egress, health check e ativação por tenant/flag. O painel configura releases já implantadas; não carrega código.

Não haverá marketplace, upload, pacote remoto, execução de terceiros, assinatura pública ou SDK público no MVP. Plugins não chamam uns aos outros nem acessam segredos/banco irrestritamente; usam brokers e contratos internos.

## ADR-009 — Connector Engine e Registry

| Opção | Prós | Contras |
|---|---|---|
| Integração direta em cada módulo | Rápida no primeiro conector | Forte acoplamento |
| Conector HTTP totalmente genérico | Pouco código | Não modela OAuth, webhooks e semântica proprietária com segurança |
| **Adapters + capabilities granulares** | Núcleo universal e políticas precisas | Exige manifest/release por plataforma |

**Decisão:** Connector Engine único e adapters independentes. Registry separa provider family, adapter, release, versão da API, auth/scopes, environments, webhooks, quotas, risco e capabilities.

O painel cadastra instâncias de adapters instalados. Protocolo novo exige plugin revisado, mas não muda o core nem o schema estrutural. Meta/Instagram/Facebook/WhatsApp são funcionais no MVP; demais conectores são `planned` até marco próprio.

## ADR-010 — AI Orchestrator e AI Gateway

| Opção | Prós | Contras |
|---|---|---|
| Chamar OpenAI diretamente | Simples | Acoplamento e pouca governança |
| Dois provedores completos no primeiro marco | Fallback real | Duplica esforço/custo antes do MVP |
| **Orchestrator + Gateway, OpenAI primeiro** | Arquitetura neutra com entrega incremental | Fallback cross-provider só existe após segundo adapter |

**Decisão:** Orchestrator escolhe rota, capacidade, modelo, custo, timeout, health e fallback; Gateway normaliza protocolo; provider plugin executa. OpenAI é o primeiro plugin. Claude, Gemini, Grok, OpenAI-compatible e Ollama/vLLM poderão ser configurados quando seus adapters existirem.

Endpoints configuráveis exigem HTTPS e allowlist; não serão aceitas URLs arbitrárias. IA não possui credenciais de plataforma nem chama conectores diretamente.

Comparação, revisão cruzada e ensembles ficam modelados, mas desativados até segundo provider e aprovação de custo/PII.

## ADR-011 — Prompts e templates

| Opção | Prós | Contras |
|---|---|---|
| Uma tabela ampla | Consulta simples | Mistura conteúdo, modelo, publicação e histórico |
| Arquivos no Git apenas | Bom review | Sem configuração por tenant/marca |
| **Definição + versão + binding + release** | Imutabilidade, rollback e escopo | Mais relações |

**Decisão:** prompts e templates têm definições estáveis, versões imutáveis, bindings por organização/marca/produto/idioma e release ativa. Rollback troca ponteiro; não altera versão.

Modelo/temperatura/custo pertencem à rota de IA, não ao prompt. Status externo de template (por exemplo WhatsApp) é separado da aprovação interna. A versão exata entra no hash de aprovação.

## ADR-012 — Turbo Analytics

| Opção | Prós | Contras |
|---|---|---|
| Consultar somente APIs ao vivo | Sem armazenamento | Lento, inconsistente e dependente de quota |
| Warehouse completo no Supabase | Análise ampla | Risco alto para IO do app compartilhado |
| **Snapshots incrementais + agregados** | Dashboard unificado com custo controlado | Não substitui um OLAP futuro |

**Decisão:** métricas canônicas com origem, definição, moeda, fuso, granularidade e freshness. Snapshots incrementais e agregados horários/diários em `mod_mkt`; payload bruto minimizado/Storage. Não combinar métricas semanticamente diferentes.

Site/app first-party, atribuição avançada e warehouse externo são posteriores e exigem contrato explícito com o app.

## ADR-013 — Observabilidade e auditoria

| Opção | Prós | Contras |
|---|---|---|
| Apenas logs Supabase | Sem ferramenta adicional | Retenção curta e não é auditoria |
| Suite APM completa desde o início | Visibilidade alta | Custo/operação antecipados |
| **Logs JSON + Sentry + métricas + audit trail** | Bom equilíbrio e portabilidade | Exige redação e correlação disciplinadas |

**Decisão:** logs estruturados redigidos com `service.name`, tenant, correlation/event/action IDs; Sentry para erro/performance; métricas operacionais; auditoria append-only em `mod_mkt`. Corpos completos de mensagens e segredos não entram em traces.

## ADR-014 — Testes

| Opção | Prós | Contras |
|---|---|---|
| Testar em contas reais | Fidelidade | Risco de gasto/publicação/dados |
| Só unitários | Rápido | Não prova RLS, OAuth ou adapters |
| **Pirâmide local + mocks + piloto allowlisted** | Segurança e cobertura | Exige testkit/fixtures |

**Decisão:** Vitest para core, testes Deno para Edge, Supabase local para migrations/RLS/concorrência, mocks/fixtures para APIs e Playwright para E2E. CI nunca acessa produção. Homologação remota só no workspace e contas allowlisted após aprovação.

## ADR-015 — Git e migrations

| Opção | Prós | Contras |
|---|---|---|
| Repositório aninhado | Isolamento | Fragmenta histórico e tooling |
| Forçar add mantendo ignore total | Rápido | Novos arquivos continuam ocultos |
| **Git principal com exceção estreita** | Histórico único sem expor o site inteiro | Regra local precisa ser preservada nesta máquina |

**Decisão:** o Git principal rastreia apenas `turbotiger-site/adm/mkt/**`; demais arquivos de `turbotiger-site/` continuam ignorados. Branches `codex/mN-*` e staging sempre path-scoped.

Migrations do MKT serão armazenadas em `turbotiger-site/adm/mkt/database/migrations` e aplicadas individualmente pela CLI local principal. Isso mantém código/versionamento dentro do diretório oficial e evita `db push` ou migrations não relacionadas.

## Decisões encerradas

- nome, slug, módulo e schema;
- um schema de negócio no primeiro ciclo;
- Git principal;
- Vercel + Supabase Pro;
- mesmo Supabase com isolamento lógico;
- base multiempresa no MVP;
- Plugin System Nível 1;
- OpenAI primeiro com núcleo agnóstico;
- Event Bus sem event sourcing;
- Meta/WhatsApp como MVP funcional;
- Cloud Run, Redis, marketplace e SaaS comercial pós-MVP.
