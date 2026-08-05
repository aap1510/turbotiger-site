# Backlog do MVP — MKT Digital

## 1. Regras de execução

- Ordem obrigatória: M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9 → M10.
- Cada marco exige autorização explícita, branch própria, testes proporcionais ao risco, checkpoint Git e parada para revisão.
- Nenhuma história de um marco posterior pode ser antecipada.
- Teste e produção são workspaces lógicos isolados no mesmo projeto Supabase Pro.
- Toda escrita externa começa desabilitada e passa por autenticação, RBAC, Policy Engine, feature flag, aprovação aplicável, idempotência, readback e auditoria.
- Campanhas, conjuntos e anúncios nascem pausados. Conteúdo nasce em rascunho.
- Dependência externa ausente mantém a capability em mock, leitura ou bloqueio seguro.
- Nenhum dado jurídico, contratual ou de consentimento pode ser presumido.

Prioridades:

- P0: bloqueia segurança, isolamento ou saída do marco.
- P1: necessário para o resultado utilizável do marco.
- P2: melhoria que não pode atrasar um gate crítico.

## 2. M0 — Descoberta, documentação e Git

### Épico M0-A — Controle de versão restrito

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M0-01 P0 | Rastrear o MKT Digital no Git principal. | adm/mkt deixa de ser ignorado; demais áreas de turbotiger-site continuam ignoradas; nenhuma regra versionada do app é alterada. | Autorização M0. |
| M0-02 P0 | Criar os oito documentos de planejamento. | Os oito arquivos existem, são legíveis, coerentes entre si, sem segredo e sem código executável. | Leitura das fontes e decisões oficiais. |
| M0-03 P0 | Criar checkpoint reversível. | Staging contém exclusivamente caminhos sob turbotiger-site/adm/mkt; commit registrado; execução para antes do M1. | M0-01 e M0-02. |

Testes: verificação de ignore, manifesto do staging, UTF-8, links locais, ausência de segredos e ausência de migrations/dependências.

Rollback: restaurar apenas a regra local de ignore e reverter o commit do M0 com git revert; nunca usar reset destrutivo.

Gate: aprovação explícita do proprietário para o M1.

## 3. M1 — Fundação modular, contratos e mocks

### Épico M1-A — Monorepo e qualidade

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M1-01 P0 | Criar monorepo TypeScript estrito. | Apps web/API/worker e packages comuns compilam; pnpm/Turborepo aprovados; nenhum acesso real. | Aprovação M1. |
| M1-02 P0 | Definir contratos do núcleo. | Contratos versionados para eventos, jobs, policies, approvals, IA, plugins e conectores; validação runtime nas fronteiras. | M1-01. |
| M1-03 P0 | Implantar Plugin System Nível 1 em memória. | Manifests e capabilities validados; somente plugins internos do build; nenhum carregamento dinâmico. | M1-02. |
| M1-04 P1 | Criar Connector Registry/Engine com mocks. | Mocks determinísticos de Meta Ads, Meta Organic, WhatsApp, e-mail e Storage; erros, timeout e rate limit simuláveis. | M1-02 e M1-03. |
| M1-05 P0 | Criar CI e observabilidade base. | Lint, typecheck, testes, scan de segredos e logs JSON com redaction/correlation ID. | M1-01. |
| M1-06 P1 | Aprovar conceito visual do painel. | Direção premium, responsiva e compatível com comunicação responsável; sem tela funcional conectada. | Direção visual aprovada. |

Testes: unitários de contratos, compatibilidade de plugins, mocks, lint, typecheck e build reproduzível.

Rollback: reverter o checkpoint M1; não há estado remoto ou banco a compensar.

Gate: fundação compilável e testada, ainda sem migration ou conta real.

## 4. M2 — Banco, multiempresa, RBAC, RLS e auditoria

### Épico M2-A — Isolamento no Supabase compartilhado

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M2-01 P0 | Executar preflight e confirmar backup. | Backup/restauração e versão atual documentados; migration revisada isoladamente; janela aprovada. | Autorização M2 e janela segura. |
| M2-02 P0 | Criar o schema privado mod_mkt. | Schema não exposto ao navegador; privilégios mínimos; nenhuma tabela do app alterada. | M2-01. |
| M2-03 P0 | Criar organizações e workspaces. | Base multiempresa operacional; turbo_tiger_test e turbo_tiger_prod isolados; tenant derivado no servidor. | M2-02. |
| M2-04 P1 | Criar marcas e produtos. | Relações organization → brand → product válidas e auditadas; vínculo cruzado bloqueado. | M2-03. |
| M2-05 P0 | Criar memberships e RBAC. | Permissões por organização/workspace/escopo; ator humano e serviço separados; mudanças auditadas. | M2-03. |
| M2-06 P0 | Aplicar RLS e constraints de tenant. | Acesso cross-tenant e referência cruzada falham; colunas de policy/FK estão indexadas. | M2-03 a M2-05. |
| M2-07 P0 | Criar feature flags e auditoria base. | Escritas externas desligadas por padrão; kill switch testado; audit trail registra ator, tenant e correlação. | M2-03 e M2-05. |

Testes: migrations locais, constraints, RLS, RBAC, acesso sem tenant, cross-tenant, grants e smoke test de não regressão do app.

Rollback: bloquear a API e as flags; usar migration compensatória aprovada, preservando auditoria.

Gate: isolamento lógico comprovado e nenhum impacto no aplicativo.

## 5. M3 — Eventos, filas, Policy Engine e aprovações

### Épico M3-A — Execução confiável e governada

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M3-01 P0 | Habilitar PGMQ/Vault de forma controlada. | Aprovação específica, verificação antes/depois e nenhum segredo em payload/log. | M2 e autorização M3. |
| M3-02 P0 | Criar jobs canônicos e filas. | Enqueue atômico, lease, visibility timeout, retry com backoff e DLQ; worker morto não duplica efeito. | M3-01. |
| M3-03 P0 | Criar outbox e Event Bus. | Estado, auditoria e outbox na mesma transação; envelope versionado; consumidor idempotente; ciclos limitados. | M3-02. |
| M3-04 P0 | Criar Policy Engine determinístico. | Resultado allow/deny/requires_approval reproduzível; falta de dado crítico falha fechado. | M2-07 e contratos M1. |
| M3-05 P0 | Criar Approval Engine por hash. | Aprovação referencia payload e dependências imutáveis; qualquer mudança invalida o aceite. | M3-04. |
| M3-06 P0 | Criar External Actions e idempotência. | Chave única por tenant/operação; timeout reconcilia antes do retry; tentativas/readback auditados. | M3-02, M3-04 e M3-05. |
| M3-07 P1 | Criar scheduler em lotes curtos. | Cron apenas agenda lotes limitados, com cursores indexados e sem HTTP dentro de transação. | M3-02. |

Testes: duplicidade, corrida, retry, lease expirado, DLQ, ciclo de evento, invalidação de aprovação, kill switch e reconciliação.

Rollback: parar produtores/consumidores, quarentenar fila, ativar deny-all e preservar jobs/auditoria.

Gate: toda ação simulada passa pelo fluxo governado e é idempotente.

## 6. M4 — Storage, celebridades, contratos e territórios

### Épico M4-A — Biblioteca e direitos de uso

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M4-01 P0 | Criar buckets/caminhos privados. | Separação tenant/ambiente/finalidade; URL assinada curta; material test não pode chegar a produção. | M2 e autorização Storage. |
| M4-02 P1 | Versionar ativos e derivados. | Checksum, proveniência e estados draft/review/approved/retired; versão imutável. | M4-01. |
| M4-03 P0 | Versionar celebridades e contratos. | Vigência, modalidade, plataforma, formato e permissões são configuráveis; nada jurídico é presumido. | Dados contratuais oficiais. |
| M4-04 P0 | Versionar territórios e mapeamentos. | Território interno separado do targeting externo; representação insegura bloqueia o uso. | Definição operacional. |
| M4-05 P0 | Avaliar direitos antes de cada uso. | Contrato, versão do ativo, edição, modalidade, plataforma, formato, vigência e território revalidados. | M4-02 a M4-04. |
| M4-06 P0 | Codificar o bloqueio seguro de Cauã Reymond. | Paid permanece bloqueado sem região/datas; orgânico não recebe restrição territorial inventada; demais direitos continuam obrigatórios. | Dados oficiais para liberação. |

Testes: contrato vencido, plataforma/formato incorretos, território ausente, ativo alterado e separação paid/organic.

Rollback: revogar release/direito, cancelar jobs pendentes e manter policy deny-all.

Gate: nenhum ativo inválido alcança uma ação externa.

## 7. M5 — Caixa omnichannel e CRM com mocks

### Épico M5-A — Atendimento, consentimento e relacionamento

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M5-01 P0 | Consolidar contatos e identidades. | Contato tenant-scoped, múltiplos canais, deduplicação e merge auditado/reversível. | M2. |
| M5-02 P0 | Registrar consentimentos e supressão. | Origem, data, canal, finalidade e versão; revogação imediata; utility não implica marketing. | Política jurídica antes do uso real. |
| M5-03 P0 | Persistir conversas, mensagens e anexos. | Webhook duplicado não duplica mensagem; anexos privados; ordem reconciliável. | M5-01. |
| M5-04 P0 | Criar webhook inbox com mocks. | Assinatura no corpo bruto, replay protection, ACK rápido, persistência e quarentena. | M3 e M5-03. |
| M5-05 P0 | Implementar handoff humano. | Takeover bloqueia IA e cancela resposta pendente; retorno controlado e auditado. | M5-03. |
| M5-06 P1 | Criar pipelines e oportunidades. | Estágios, atividades, tarefas e touchpoints por tenant; sem escrita no app. | M5-01. |
| M5-07 P1 | Criar a caixa unificada. | Fila, SLA, contexto, IA/humano, CRM, RBAC e responsividade em uma tela. | M1-06 e M5-03 a M5-06. |
| M5-08 P0 | Vincular respostas à base oficial. | Fonte/versionamento registrados; ausência ou baixa confiança gera handoff, nunca invenção. | Base, confiança e SLA definidos. |

Testes: deduplicação, merge incorreto, replay, anexos maliciosos, consentimento revogado, corrida IA/humano e tenant crossing.

Rollback: human-only, suppress-all outbound e desligamento dos consumers.

Gate: jornada omnichannel/CRM completa apenas com mocks.

## 8. M6 — AI Orchestrator, prompts, templates e conteúdo

### Épico M6-A — IA agnóstica e governada

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M6-01 P0 | Criar registry de providers/modelos. | Instâncias por tenant, segredo por referência, capabilities e endpoint allowlisted; protocolo novo exige plugin. | M1 e M2. |
| M6-02 P1 | Implementar o plugin OpenAI. | Adapter do contrato comum, saída validada, timeout/rate limit, mock e segredo redigido. | Credencial no cofre, modelo e teto de custo. |
| M6-03 P0 | Criar AI Orchestrator. | Roteamento por tarefa/capability/custo, health, circuit breaker, fallback permitido e fail-closed. | M6-01 e M6-02. |
| M6-04 P0 | Versionar prompts. | Definição, versão, binding e release; aprovação e rollback; AI run guarda snapshot exato. | M6-03. |
| M6-05 P0 | Versionar templates. | Famílias por canal/formato, aprovação interna/externa separada, releases e rollback. | M6-04. |
| M6-06 P0 | Proteger PII e prompt injection. | Conteúdo nunca vira instrução; tool allowlist, minimização, redaction e testes adversariais. | M6-03. |
| M6-07 P1 | Gerar conteúdo somente em rascunho. | Prompt/modelo/custo/fontes auditados; Policy Engine e direitos avaliados; nenhuma publicação. | M4 e M6-03 a M6-06. |

Testes: fallback, teto de custo, saída inválida, provider indisponível, PII, prompt injection e rastreabilidade de versão.

Rollback: desabilitar geração, rotear para mock e reativar releases anteriores.

Gate: IA produz somente rascunhos auditados.

## 9. M7 — Meta somente leitura e Turbo Analytics

### Épico M7-A — Primeira integração real sem escrita

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M7-01 P0 | Vincular ativos Meta com menor privilégio. | Contas/IDs/escopos fornecidos; credencial no cofre; test/prod e revogação separados. | Aprovações Meta e M7. |
| M7-02 P0 | Sincronizar Meta Ads em leitura. | Contas, campanhas e insights incrementais; rate limit e token expirado tratados; nenhuma mutação possível. | M7-01. |
| M7-03 P1 | Sincronizar Meta Organic em leitura. | Páginas/contas autorizadas, conteúdo/métricas normalizados, sem publicação. | M7-01. |
| M7-04 P1 | Criar Turbo Analytics inicial. | Métrica registra definição, origem, moeda, fuso, freshness e qualidade; agregação incremental. | M7-02 e M7-03. |
| M7-05 P1 | Exibir saúde operacional. | Último sync, token, rate limit, filas, DLQ, custo IA e separação test/prod visíveis. | M7-04. |

Testes: paginação, cursor, rate limit, token expirado, reconciliação e prova de ausência de endpoints mutantes.

Rollback: revogar token e desligar sincronizações.

Gate: Meta operacional somente em leitura.

## 10. M8 — Meta Ads com criação pausada

### Épico M8-A — Escrita paga controlada

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M8-01 P1 | Criar briefing/campanha interna. | Objetivo, produto, público, orçamento e ativos versionados em draft. | M4, M6 e M7. |
| M8-02 P0 | Executar preflight completo. | Tenant, conta, capability, policy, orçamento, contrato, território, ativo, flag e approval válidos. | M3, M4 e M8-01. |
| M8-03 P0 | Criar campanha, ad set e anúncio pausados. | Estado externo seguro obrigatório; idempotência; qualquer estado ativo gera bloqueio/incidente. | M8-02. |
| M8-04 P0 | Fazer readback e reconciliação. | Conta, status, orçamento, território e ativos conferidos; timeout não duplica criação. | M8-03. |
| M8-05 P0 | Aplicar guardrails de orçamento. | Teto por ação/dia/mês, moeda, cooldown e variação máxima; automação segue desligada. | Limites fornecidos. |
| M8-06 P0 | Aprovar a entidade exata por hash. | Edição/expiração invalida aprovação; identidade e separação de função auditadas. | Matriz de aprovação. |

Testes: estado ativo inesperado, payload alterado, timeout, duplicidade, limite excedido, contrato/território inválido e readback divergente.

Rollback: kill switch, pausar externamente quando necessário e reconciliar antes de novo retry.

Gate: criação comprovadamente pausada, sem ativação e sem gasto autônomo.

## 11. M9 — Meta Organic, WhatsApp e CRM reais

### Épico M9-A — Publicação e atendimento controlados

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M9-01 P0 | Receber Meta Messaging. | Assinatura, deduplicação, tenant, normalização, handoff e auditoria corretos. | Permissões/revisões Meta. |
| M9-02 P0 | Publicar conteúdo orgânico aprovado. | Template, ativo, policy, flag, aprovação, idempotência e readback válidos; test nunca usa conta prod. | Capability autorizada. |
| M9-03 P0 | Operar WhatsApp inbound-first. | Webhook validado, janela calculada, histórico/base consultados e baixa confiança transferida. | WABA, número e permissões. |
| M9-04 P0 | Responder livremente apenas dentro da janela. | Conversa iniciada pelo usuário, policy/opt-out/handoff respeitados e envio idempotente. | M5 e M9-03. |
| M9-05 P0 | Enviar utility outbound controlado. | Fora da janela, somente template aprovado, finalidade válida, consentimento aplicável e allowlist. | Templates aprovados e M5-02. |
| M9-06 P0 | Controlar marketing por opt-in específico. | Sem contato frio/lista comprada/disparo em massa; aprovação humana, limites baixos e descadastro imediato. | Política jurídica e feature flag própria. |
| M9-07 P1 | Atribuir conversa e oportunidade. | Origem/touchpoints preservados e CRM auditado, sem escrever no app. | M5-06, M9-01 e M9-03. |
| M9-08 P0 | Operar fila e SLA. | Alertas, responsável, takeover, backlog/falhas e runbook disponíveis. | Equipe e SLA definidos. |

Testes: janela encerrada, template inválido, falta/revogação de consentimento, opt-out, número fora da allowlist, webhook replay e handoff concorrente.

Rollback: human-only, flags de envio/publicação desligadas, supressão total e consumers pausados.

Gate: Meta Organic e WhatsApp controlados, sem prospecção fria automática.

## 12. M10 — Piloto controlado

### Épico M10-A — Liberação gradual e reversível

| ID | História | Aceite | Dependências |
|---|---|---|---|
| M10-01 P0 | Executar preflight de produção. | Backup, contas, contratos, consentimentos, aprovadores, tetos, alertas, runbook e rollback confirmados. | Gates M0–M9. |
| M10-02 P0 | Comprovar isolamento do workspace produtivo. | Flags, connectors, buckets e allowlists próprios; nenhuma configuração test herdada. | M2, M4 e M7–M9. |
| M10-03 P0 | Liberar uma capability por vez. | Leitura antes da escrita; volume/orçamento baixos; janela de observação e aprovação explícita. | M10-01 e M10-02. |
| M10-04 P0 | Monitorar e responder a incidentes. | Alertas de fila, DLQ, webhook, token, custo e gasto; logs redigidos e responsável/SLA. | Ferramenta e responsáveis definidos. |
| M10-05 P0 | Ensaiar rollback. | Kill switch, fila pausada, jobs quarentenados, campanha pausada e envios pendentes cancelados. | M10-03. |
| M10-06 P0 | Registrar aceite do MVP. | Evidências, custos, riscos e decisão explícita de continuar, restringir ou desligar. | M10-01 a M10-05. |

Testes: smoke end-to-end controlado, alertas, kill switch, incidente simulado e rollback demonstrado.

Rollback: retornar a read-only ou desabilitar todas as ações externas.

Gate: aceite explícito do proprietário.

## 13. Pós-MVP

- Segundo e demais providers de IA por plugins revisados.
- GA4, Search Console e GTM, começando em leitura.
- Google Ads, YouTube, TikTok, AdMob, Gmail e Microsoft em marcos separados.
- LinkedIn, X, Pinterest, Telegram e Discord conforme aprovação e capabilities oficiais.
- Cloud Run, Redis ou warehouse somente mediante métrica que prove insuficiência do MVP.
- Onboarding público, billing, assinaturas, trial, white-label e demais funções SaaS comerciais.
- Plugin System Nível 2/3 somente com novo threat model, SDK, assinatura e sandbox apropriados.

## 14. Definição global de pronto

Uma história só está concluída quando:

1. critérios de aceite foram demonstrados;
2. testes relevantes passaram;
3. isolamento de tenant foi verificado;
4. nenhum segredo entrou no diff;
5. feature flag, auditoria e rollback existem quando aplicáveis;
6. documentação e runbook foram atualizados;
7. staging está restrito ao marco;
8. checkpoint Git foi criado;
9. riscos residuais foram registrados;
10. a execução parou no gate previsto.
