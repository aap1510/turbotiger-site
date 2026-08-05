# Modelo de ameaças do MKT Digital

## Estado e objetivo

- Projeto: **MKT Digital**.
- `project_slug`: `mkt_digital`.
- Domínio e schema privado: `mod_mkt`.
- Data-base: `2026-08-03`.
- Escopo: arquitetura planejada para o MVP; este documento não autoriza implementação nem acesso a contas reais.

O objetivo é impedir vazamento entre empresas, gasto ou publicação acidental, uso indevido de dados pessoais e direitos de imagem, abuso de conectores e decisões autônomas fora das políticas. O modelo adota defesa em profundidade e comportamento **fail-closed**: quando identidade, consentimento, aprovação, direito, território, orçamento ou estado externo não puder ser provado, a ação é bloqueada.

## Escopo técnico

Incluído:

- painel Next.js na Vercel;
- API, webhooks e handlers assíncronos em Supabase Edge Functions;
- projeto Supabase Pro já usado pelo aplicativo, com negócio isolado em `mod_mkt`;
- Supabase Auth, Storage, Queues/PGMQ, Cron e Vault/segredos;
- workspaces lógicos `turbo_tiger_test` e `turbo_tiger_prod` no mesmo projeto;
- Plugin System Nível 1, Connector Engine, AI Orchestrator/Gateway, Event Bus, Policy/Approval Engines;
- Meta, Instagram/Facebook, WhatsApp, caixa omnichannel/CRM e OpenAI no MVP;
- conectores futuros previstos na matriz de capacidades.

Fora deste modelo inicial: segurança interna dos provedores externos, marketplace ou código de terceiros, Cloud Run, Redis, cobrança SaaS e alterações no aplicativo Delphi/FMX.

## Ativos protegidos

| Classe | Exemplos | Impacto principal |
|---|---|---|
| Identidade e autorização | usuários, memberships, papéis, permissões, tenant e sessão | acesso cruzado ou ação privilegiada |
| Segredos | tokens OAuth, chaves de API, segredos de webhook e referências do cofre | tomada de conta e ações externas |
| Dados pessoais | contatos, identidades de canal, mensagens, consentimentos e anexos | privacidade, fraude e obrigação LGPD |
| Ativos comerciais | campanhas, públicos, orçamento, criativos, métricas e atribuição | gasto, reputação e decisão incorreta |
| Direitos | contratos, ativos de celebridade, vigência, plataforma, formato e território | violação contratual e reputacional |
| Conhecimento e IA | prompts, templates, base oficial, rotas, avaliações e custos | resposta indevida, exfiltração e custo |
| Evidências | aprovações, avaliações de policy, auditoria, readback e incidentes | perda de rastreabilidade e não repúdio |
| Disponibilidade | banco compartilhado, filas, webhooks, workers e quotas | impacto no MKT Digital e no aplicativo |

Classificação mínima dos dados: `public`, `internal`, `confidential`, `restricted`. Segredos, tokens, mensagens privadas, identificadores pessoais, contratos e anexos sensíveis são `restricted`. Logs e telemetria devem conter apenas identificadores técnicos e dados redigidos.

## Atores e pressupostos

### Atores legítimos

- proprietário e administradores da organização;
- operadores de marketing, conteúdo, atendimento, jurídico e análise;
- aprovadores de orçamento, publicação e direitos;
- serviços internos, schedulers e workers;
- provedores de IA e plataformas conectadas, sempre por adapters autorizados.

### Atores hostis ou falhas consideradas

- usuário autenticado tentando acessar outro tenant ou elevar privilégio;
- conta administrativa comprometida;
- remetente externo enviando conteúdo, arquivo ou webhook malicioso;
- repetição, atraso, perda ou reordenação de eventos;
- conector, API ou resposta externa inconsistente/hostil;
- prompt injection vindo de mensagens, e-mails, comentários ou páginas;
- erro de configuração que mistura teste e produção;
- bug, condição de corrida ou retry que duplica gasto/publicação;
- dependência ou plugin first-party comprometido;
- operador legítimo cometendo erro ou excedendo sua autorização.

Nenhuma resposta de IA, webhook, dado importado ou status local é confiável por si só. O estado crítico de uma plataforma exige readback ou reconciliação.

## Fronteiras de confiança

```text
Navegador não confiável
        |
        | TLS + JWT + CSRF/origin + rate limit
        v
API própria / Edge Functions
        |
        | RBAC + tenant context + Policy Engine + auditoria
        v
Roles técnicas de menor privilégio
        |
        +----> schema privado mod_mkt
        +----> filas, cron, storage e cofre autorizados
        |
        | Capability Broker + egress allowlisted
        v
Plugins internos e conectores
        |
        v
Meta / WhatsApp / OpenAI / demais provedores
```

Fronteiras adicionais:

1. `mod_mkt` versus schemas do aplicativo: não há escrita direta nem privilégio por conveniência.
2. workspace de teste versus produção: divisão lógica obrigatória por tenant, contas, buckets, allowlists e flags.
3. sistema versus IA: a IA propõe; ferramentas internas autorizadas decidem e executam.
4. sistema versus plataforma: toda entrada externa é não confiável; toda saída crítica é auditada e reconciliada.
5. plugin versus núcleo: plugin não acessa banco, segredos ou outro plugin de forma irrestrita.

## Invariantes de segurança

1. Toda consulta operacional é escopada pelo tenant na API e defendida por RLS/FK composta quando aplicável.
2. `mod_mkt` não é exposto diretamente pela Supabase Data API.
3. `service_role` nunca aparece no navegador nem atende requisição humana normal.
4. Segredos são referências opacas; valores não entram no Git, banco de negócio, logs, prompts ou screenshots.
5. Toda escrita externa passa por autenticação, RBAC, capability, feature flag, Policy Engine, aprovação quando exigida, idempotência e auditoria.
6. Aprovação é vinculada ao hash do payload e às versões de policy, prompt, template, ativo, contrato e território; qualquer alteração a invalida.
7. Campanhas, conjuntos e anúncios novos nascem pausados; publicação real permanece bloqueada até o último gate.
8. Material com celebridade só segue quando contrato, ativo, modalidade, plataforma, formato, edição, vigência e território forem comprovados.
9. Para Cauã Reymond, tráfego pago fica bloqueado até lista operacional da região e datas; orgânico não recebe restrição territorial inventada, mas obedece aos demais direitos.
10. Jobs, webhooks e eventos são tratados como entrega `at-least-once`; duplicidade não pode duplicar efeito externo.
11. Workload de teste não usa credencial, bucket, destinatário ou conta de produção.
12. WhatsApp é inbound-first; fora da janela do canal, somente template aprovado e finalidade/consentimento válidos.
13. Eventos e IA não contornam Policy Engine nem acionam conectores diretamente.
14. Transações de banco são curtas; nenhuma chamada HTTP ocorre mantendo lock aberto.
15. Auditoria é append-only para a aplicação e não pode ser alterada por operadores comuns.

## Registro de ameaças e controles

Escala: probabilidade `B`/`M`/`A`; impacto `M`/`A`/`C` (moderado, alto, crítico).

| ID | Ameaça | Prob. | Impacto | Controles obrigatórios | Evidência/teste |
|---|---|---:|---:|---|---|
| IAM-01 | Vazamento entre organizações/workspaces por filtro ausente | M | C | tenant derivado da sessão, não do corpo; RBAC; RLS forçada quando aplicável; FKs compostas; índices nas colunas de policy | testes cross-tenant em API e banco, incluindo ID válido de outro tenant |
| IAM-02 | Uso amplo ou vazamento de `service_role` | M | C | proibida no frontend/fluxo humano; roles separadas para API, webhook e worker; grants mínimos; rotação | varredura de bundle/Git/logs e teste negativo de privilégios fora de `mod_mkt` |
| IAM-03 | Exposição acidental de `mod_mkt` pela Data API | B | C | schema fora da lista exposta; revogar privilégios padrão; API própria como único canal humano | inspeção de configuração e tentativa anônima/autenticada de acesso direto |
| IAM-04 | Tomada de conta administrativa ou autoaprovação indevida | M | C | MFA quando suportado, sessão curta para ação crítica, segregação de funções, step-up, alerta e revogação | teste de matriz RBAC, self-approval e sessão revogada |
| IAM-05 | Plugin excede capabilities ou acessa outro domínio | M | A | Plugin Nível 1 por deploy, manifest/release imutável, Capability Broker, egress allowlist, sem acesso direto entre plugins | teste de capability negada, egress bloqueado e release desativada |
| CRED-01 | Roubo, mistura de tenant ou uso de token OAuth errado | M | C | state/PKCE quando aplicável, vínculo conta-tenant imutável, menor escopo, cofre, expiração/rotação/revogação | teste de callback trocado, token expirado e desconexão |
| WEB-01 | Webhook falsificado, repetido ou reordenado | A | A | corpo bruto, assinatura, timestamp/nonce quando fornecido, limite de tamanho, deduplicação e inbox receipt | fixtures de assinatura inválida, replay, duplicidade e fora de ordem |
| EXT-01 | Retry duplica campanha, mensagem, publicação ou gasto | A | C | `Idempotency-Key`, chave natural externa, ação canônica, readback antes de repetir resultado incerto, receipt por tentativa | fault injection após timeout e prova de um único efeito externo |
| EXT-02 | Concorrência ultrapassa teto de orçamento | M | C | reserva atômica, lock/advisory lock quando necessário, versão otimista, tetos diário/mensal/por ação e cooldown | testes concorrentes com múltiplos workers e limite exato |
| APP-01 | Aprovação antiga é reutilizada após alteração do conteúdo | M | C | hash completo, versões imutáveis, expiração e invalidação automática ao mudar qualquer entrada | alterar payload/ativo/policy após aprovação e confirmar bloqueio |
| RGT-01 | Uso de celebridade sem direito válido ou fora do território | M | C | validação fail-closed pré e pós-criação, ativo por hash, contrato/território versionados, readback da segmentação | matriz de vigência, plataforma, formato, edição e fronteira territorial |
| DRF-01 | Estado externo diverge do estado local | M | A | readback, reconciliação periódica, drift alert, estado `succeeded_unverified` e bloqueio de ativação | simular alteração manual e confirmar alerta/bloqueio |
| AI-01 | Prompt injection chama ferramenta ou vaza dados | A | C | conteúdo externo como dado, prompts separados, ferramentas allowlisted por tarefa, saída estruturada validada, policy após IA | corpus de injeção em mensagem, e-mail, comentário e documento |
| AI-02 | PII/segredo é enviado ao provedor de IA sem base/autorização | M | C | classificação, minimização/redação, rota por política, contrato de tratamento, retenção configurada, segredo nunca no prompt | testes de redaction e bloqueio de campos `restricted` |
| CRM-01 | IA responde enquanto humano assumiu a conversa | M | A | lease transacional, versão da conversa, rechecagem imediatamente antes do envio e cancelamento de jobs pendentes | corrida entre `assumir` e `enviar`, incluindo timeout do lease |
| CRM-02 | Identidades de pessoas diferentes são mescladas | M | A | evidência por canal, merge explícito e reversível, confiança, aprovação para sinais fracos e auditoria | conflitos de telefone/e-mail e desfazer merge |
| MSG-01 | Spam, contato frio ou violação de janela/opt-out | M | C | consentimento com origem/data/finalidade, suppression global/canal, janela calculada, template aprovado, allowlist e limites baixos | testes dentro/fora da janela, descadastro e contato sem opt-in |
| WEB-02 | XSS, arquivo malicioso ou fórmula ativa em conteúdo/anexo | M | A | escapar saída, CSP, sanitização, bucket privado, tipo/tamanho permitidos, antivírus/quarentena quando aplicável, download seguro | payloads XSS/SVG/HTML e arquivos proibidos |
| WEB-03 | SSRF por URL de mídia, webhook ou endpoint configurável | M | C | HTTPS, allowlist de host, resolução/revalidação DNS, bloquear IP privado/metadata, limite de redirects e tamanho | casos localhost, RFC1918, metadata e DNS rebinding |
| OPS-01 | Jobs, métricas ou ataque esgotam IO/conexões do Supabase compartilhado | M | C | pool transacional, limites/timeouts, lotes pequenos, índices/FKs, cursor, retenção, backpressure e circuit breaker | carga controlada, fila crescente, query timeout e orçamento de IO |
| AUD-01 | Trilha de auditoria é apagada ou adulterada | B | C | append-only, role separada, hash/encadeamento ou exportação de evidências, retenção e alerta de lacunas | tentativa de update/delete e verificação periódica de integridade |
| LGPD-01 | Retenção/exclusão conflita com obrigação de evidência | M | C | política jurídica aprovada, separação de PII/evidência, anonimização, legal hold e workflow de titular | ensaio de acesso, correção, exportação e exclusão com exceções registradas |
| STO-01 | Bucket/caminho de teste ou outro tenant fica acessível | M | C | buckets privados, prefixo derivado no backend, políticas por tenant, URLs assinadas curtas, MIME/tamanho | tentativa cross-tenant e acesso após expiração da URL |
| CON-01 | Resposta maliciosa ou incompatível do conector corrompe estado | M | A | schema validation, versionamento de API, limite de payload, quarantena de campos desconhecidos e normalização | contrato com fixture inválida, campo extra, overflow e status inesperado |
| SUP-01 | Dependência/plugin first-party comprometido | B | C | lockfile, versões fixas, revisão, scanner, proveniência do build, CI, release por deploy e rollback | SBOM/scan, alteração não revisada e rollback de release |
| ENV-01 | Dado/teste dispara ação em produção | M | C | `tenant_id`, `environment`, `is_test`, credenciais/buckets/allowlists separados, flags off e policy que proíbe promoção implícita | teste com registro `is_test=true` contra conector de produção |
| BAK-01 | Restore global sobrescreve dados do app ou perde isolamento | B | C | backup antes de migration, escopo documentado, restore ensaiado, migration compensatória e aprovação específica | tabletop de restauração e verificação dos schemas não afetados |
| EVT-01 | Ciclo ou tempestade de eventos causa ações repetidas/custo | M | A | `event_id`, correlation/causation, profundidade máxima, dedupe, rate limit, circuit breaker e DLQ | evento circular, fan-out excessivo e consumidor indisponível |
| ANA-01 | Analytics expõe PII ou soma métricas semanticamente incompatíveis | M | A | métricas canônicas, origem/fuso/moeda/definição, agregação, minimização e acesso por papel | reconciliação com fonte e teste de dashboard por tenant/papel |

## Controles por camada

### Painel e API

- JWT validado no servidor; o tenant efetivo deriva da membership autorizada.
- CSRF/origin, CSP, headers seguros, rate limit e validação estrita em toda fronteira.
- Step-up ou nova confirmação para mudanças de permissão, segredo, orçamento, ativação e exportação.
- O frontend recebe somente dados e capabilities necessários para a tela; nunca segredo ou SQL direto.

### Banco e RLS

- roles `nologin` e grants específicos; nenhum `GRANT ALL` para a aplicação;
- revogar defaults desnecessários e qualificar `search_path` em funções privilegiadas;
- habilitar/forçar RLS onde aplicável e indexar colunas usadas nas policies;
- FKs, inclusive tenant-scoped, com índices correspondentes;
- índices compostos alinhados a `tenant_id + status/created_at` e parciais para filas/ativos abertos quando medição justificar;
- conexão pelo pool transacional, limites e `statement_timeout` adequados;
- claim concorrente por mecanismo da fila ou `FOR UPDATE SKIP LOCKED`, sem HTTP dentro de transação.

RLS é defesa adicional, não substitui autorização da API. Policies complexas precisam de revisão de segurança e desempenho antes da migration.

### Eventos, jobs e ações externas

- estado, auditoria e outbox na mesma transação;
- envelope versionado com tenant, correlation e causation IDs;
- lease/visibility timeout, retry com backoff e jitter, máximo de tentativas e DLQ;
- deduplicação por consumidor e ação externa;
- timeout ambíguo resulta em readback/reconciliação, não em repetição cega;
- payload de fila contém referência mínima; dados sensíveis permanecem no armazenamento autorizado.

### IA e plugins

- AI Orchestrator escolhe rota conforme capability, custo, saúde, privacidade e policy;
- Gateway normaliza resposta; schemas e limites são validados antes de qualquer uso;
- IA não possui credencial de plataforma e não chama conector diretamente;
- plugins são internos, versionados, revisados e publicados por deploy;
- endpoints customizáveis exigem allowlist e HTTPS; URLs arbitrárias são proibidas;
- fallback não pode reduzir o nível de privacidade, moderação ou aprovação.

### Storage, logs e auditoria

- buckets privados e separados por finalidade/ambiente; caminho é calculado pelo backend;
- URL assinada curta e revogável quando tecnicamente possível;
- logs JSON com redaction e correlação; sem conteúdo completo de mensagem, token ou contrato;
- auditoria registra ator, tenant, ação, versões, policy, aprovação, estado anterior/posterior, retorno externo e resultado;
- Sentry/APM e fornecedores de observabilidade recebem apenas dados minimizados.

## Policy Engine, aprovações e kill switches

Ordem obrigatória para ação de escrita:

```text
autenticação
  -> tenant/RBAC
  -> plugin + capability
  -> ambiente + feature flag
  -> consentimento/janela, quando mensagem
  -> direitos/território, quando aplicável
  -> orçamento/limites
  -> Policy Engine
  -> aprovação vinculada ao hash, quando exigida
  -> idempotência
  -> conector
  -> readback/reconciliação
  -> auditoria
```

Precedência de bloqueio:

1. kill switch global;
2. kill switch por tenant/workspace;
3. conector/plugin desabilitado;
4. capability desabilitada;
5. feature flag de escrita;
6. policy, consentimento, direito, orçamento e aprovação.

Um nível inferior nunca pode reativar ação bloqueada por nível superior. As flags de escrita, publicação, envio, ativação e orçamento começam desligadas; leitura/teste interno é liberado de forma granular.

## Resposta a incidentes

1. identificar tenant, correlation ID, ação e credencial afetados;
2. acionar o kill switch de menor escopo que contenha o risco;
3. revogar/rotacionar credencial sem expor seu valor;
4. pausar jobs e preservar fila, audit trail e readbacks;
5. reconciliar ações externas e gastos antes de qualquer retry;
6. avaliar dados pessoais, obrigação de notificação e contato jurídico;
7. aplicar correção por commit/migration compensatória aprovada;
8. registrar causa, impacto, linha do tempo, evidências e prevenção.

Runbooks mínimos antes do piloto: credencial vazada, campanha/gasto indevido, publicação indevida, envio indevido, vazamento cross-tenant, webhook abusivo, fila presa, indisponibilidade de IA, contrato vencido e incidente de dados pessoais.

## Gates antes de produção

- matriz de papéis, aprovadores e segregação de funções aprovada;
- testes cross-tenant e de privilégio negativo aprovados;
- secrets scan sem achados e rotação/revogação demonstradas;
- assinatura/replay/deduplicação de webhooks aprovados;
- idempotência, timeout ambíguo, readback e drift aprovados;
- tetos de orçamento, cooldown e kill switch demonstrados;
- regras de celebridade/território aprovadas com dados contratuais oficiais;
- consentimento, janela, template, suppression e handoff testados;
- retenção/LGPD, base de conhecimento e escalonamentos aprovados;
- teste `test -> production` confirma bloqueio;
- backup e rollback do marco registrados;
- alertas, responsável de plantão e runbooks confirmados.

## Riscos residuais

- o mesmo projeto Supabase aumenta o raio de impacto; isolamento lógico, grants, limites e rollout por flags reduzem, mas não eliminam esse risco;
- APIs externas podem mudar política, escopo, quota ou comportamento sem aviso; cada release de conector precisa revalidar documentação oficial;
- operações externas nem sempre oferecem reversão completa; por isso criação pausada, aprovação, readback e kill switch precedem automação;
- classificação jurídica, bases legais e interpretação contratual dependem do responsável humano; o sistema não inventa regras.

Questões de negócio ainda bloqueadoras permanecem exclusivamente em `OPEN-QUESTIONS.md`.
