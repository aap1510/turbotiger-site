# Matriz de capacidades das plataformas

## Objetivo e regras de leitura

Este documento registra capacidades verificadas, limites conhecidos e dependências externas dos conectores do MKT Digital. A validação foi realizada em **2026-08-03**, usando somente documentação oficial das plataformas.

Esta matriz não autoriza conexão de conta, OAuth, publicação, envio, gasto ou alteração externa. A documentação, a versão da API e as permissões devem ser revalidadas no início do marco de implementação de cada conector.

Regras comuns a todos os conectores:

- o Connector Registry separa família, adapter, release, versão externa, autenticação, scopes, ambientes, webhooks, quotas, risco e capabilities;
- cada capability pode estar em estado **available**, **restricted**, **approval_required**, **sandbox_only**, **unavailable** ou **unverified**;
- o painel apenas configura adapters previamente implementados, revisados e implantados; protocolo novo exige código de plugin aprovado, sem upload ou execução arbitrária pelo painel;
- toda escrita externa passa por RBAC, Policy Engine, feature flag, aprovação aplicável, idempotência e auditoria;
- campanhas, conjuntos, grupos e anúncios novos nascem pausados ou em rascunho;
- publicação, mensagem e gasto exigem revalidação imediatamente antes da execução;
- retorno incerto exige readback ou reconciliação antes de retry;
- contas, tokens e secrets são referências ao cofre autorizado, nunca valores armazenados nesta matriz;
- capacidades indisponíveis ou não confirmadas permanecem bloqueadas; não se presume paridade entre plataformas.

## Visão do MVP

| Nº | Família obrigatória | Adapters previstos | Modo no MVP | Marco funcional |
|---:|---|---|---|---|
| 1 | Meta Ads | meta_ads | leitura; depois criação pausada | M7 e M8 |
| 2 | Meta Organic/Messaging | meta_facebook_pages, meta_instagram, meta_messenger | inbound e rascunho; publicação aprovada | M9 |
| 3 | WhatsApp | meta_whatsapp_cloud | inbound-first e utility outbound controlado | M9 |
| 4 | Google Ads | google_ads | planejado, sem conexão real | pós-MVP |
| 5 | YouTube | youtube_data, youtube_analytics | planejado, sem conexão real | pós-MVP |
| 6 | TikTok | tiktok_ads, tiktok_organic | planejado, condicionado a aprovação | pós-MVP |
| 7 | AdMob | google_admob | planejado, leitura primeiro | pós-MVP |
| 8 | Gmail | google_gmail | planejado para atendimento, não bulk marketing | pós-MVP |
| 9 | Microsoft | microsoft_graph_mail | planejado para atendimento, não bulk marketing | pós-MVP |

O M1 implementará os contratos e o Registry, não todas as integrações. Meta, Instagram/Facebook e WhatsApp constituem o MVP funcional. As demais famílias serão ativadas somente em marcos próprios, começando por leitura ou sandbox.

## 1. Meta Ads

| Item | Definição validada |
|---|---|
| Adapter | **meta_ads** |
| Leitura | contas, campanhas, conjuntos de anúncios, anúncios, criativos, status, configuração e Insights, conforme acesso da conta e versão da Marketing API |
| Escrita | criação e atualização de estruturas, criativos e estados quando a capability, a conta e a permissão suportarem; toda nova estrutura nasce pausada |
| Eventos | Graph API Webhooks somente para objetos/campos oficialmente suportados e assinados; métricas continuam por sincronização incremental |
| Setup humano | portfólio empresarial, conta de anúncios, método de pagamento, Meta App, verificação empresarial quando exigida, use case/permissões aprovados, usuário ou system user autorizado, ativos e contas atribuídos |
| Revisão | App Review e acesso avançado quando exigidos; autorização da conta não equivale à aprovação do anúncio |
| Proteções MKT | leitura no M7; escrita pausada no M8; ativação, orçamento e público permanecem bloqueados por flags e aprovação; território e direitos são validados antes e após o write |
| Limitações | capacidades e rate limits dependem da versão, conta, acesso e objeto; o MCP da Meta pode ser adapter auxiliar, nunca dependência exclusiva do núcleo |
| Status | **MVP — leitura M7; write pausado M8** |

Fontes oficiais: [Marketing API](https://developers.facebook.com/docs/marketing-api/), [Campaign Management](https://developers.facebook.com/docs/marketing-api/campaign-structure/), [Insights API](https://developers.facebook.com/docs/marketing-api/insights/), [Graph API Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/).

## 2. Meta Organic/Messaging

| Item | Definição validada |
|---|---|
| Adapters | **meta_facebook_pages**, **meta_instagram**, **meta_messenger** |
| Leitura | páginas/contas autorizadas, publicações, mídia, comentários, menções, conversas e mensagens disponibilizadas por cada API e tipo de conta |
| Escrita orgânica | criação/publicação dos formatos oficialmente suportados pela conta e versão; rascunho interno e aprovação final são obrigatórios |
| Atendimento | receber e responder mensagens/comentários quando iniciados ou autorizados pelo usuário e dentro das regras específicas do canal |
| Eventos | Webhooks para mensagens, comentários e demais campos oficialmente assináveis; persistência inbox-first e deduplicação antes do ACK lógico |
| Setup humano | Meta App, páginas e contas profissionais compatíveis, papéis administrativos, ativos vinculados quando o fluxo exigir, redirects, webhook público, tokens e permissões aprovadas |
| Revisão | App Review, acesso avançado e verificações de negócio/use case conforme as surfaces utilizadas |
| Proteções MKT | publicação automática começa desligada; IA cria rascunho; mensagem pública ou privada passa por Policy Engine, handoff e auditoria |
| Limitações | formatos, publishing limits, janelas e campos de webhook não são uniformes entre Facebook, Instagram e Messenger; capability discovery deve refletir a conta conectada |
| Status | **MVP M9 — inbound e orgânico approval-gated** |

Fontes oficiais: [Instagram Platform](https://developers.facebook.com/docs/instagram-platform/), [Instagram Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/), [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/), [Messenger API for Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/), [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/).

## 3. WhatsApp

| Item | Definição validada |
|---|---|
| Adapter | **meta_whatsapp_cloud** |
| Posicionamento | o Turbo Tiger é tratado como serviço de gestão, organização, controle e estatísticas. Não é classificado pelo MKT Digital como game, jogo, bet, casa ou intermediário de apostas |
| Nível oficial | **INBOUND-FIRST + UTILITY OUTBOUND CONTROLADO** |
| Inbound | usuário inicia o contato; webhook é validado e persistido; IA consulta histórico e base oficial; resposta automática ocorre apenas em assunto autorizado; CRM registra o atendimento |
| Janela aberta | mensagens livres podem ser usadas dentro da janela de atendimento definida pelo WhatsApp, sempre sujeitas a consentimento, política, handoff e base oficial |
| Fora da janela | somente template previamente aprovado, compatível com a finalidade e ainda válido na plataforma |
| Utility outbound | confirmação de cadastro, suporte solicitado, assinatura, segurança, conclusão de ação ou informação iniciada/esperada pelo próprio usuário |
| Marketing | somente com opt-in específico para marketing, finalidade registrada, campanha aprovada, limite baixo, supressão e descadastro imediato |
| Proibido no MVP | prospecção fria automática, listas compradas, contatos frios e disparos em massa |
| Auditoria | origem, data, canal, finalidade e versão do consentimento; template, envio, resposta, erro, opt-out, policy decision e actor |
| Setup humano | Business Portfolio, WABA, número, business verification quando exigida, Meta App, token autorizado, webhook, templates e display name aprovados |
| Proteções MKT | allowlist no workspace de teste; envio externo desligado por padrão; takeover humano cancela respostas pendentes; conteúdo com promessa de ganho ou incentivo a apostar é bloqueado |
| Status | **MVP M9 — inbound-first e utility outbound controlado** |

Fontes oficiais: [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/), [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/), [Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/), [WhatsApp Business Messaging Policy](https://business.whatsapp.com/policy/).

## 4. Google Ads

| Item | Definição validada |
|---|---|
| Adapter | **google_ads** |
| Leitura | hierarquia de contas, campanhas, ad groups, ads, assets, budgets, bidding, conversion actions e métricas por GAQL |
| Escrita | criação/alteração de campanhas, grupos, anúncios, assets, budgets e conversões quando suportado; novas campanhas sempre pausadas |
| Setup humano | manager account quando aplicável, developer token, Google Cloud Project, OAuth consent/client, usuário com acesso à conta, conta de teste e IDs externos |
| Revisão | nível do developer token e aprovação de acesso; revisão da API não substitui revisão editorial/política dos anúncios; certificações específicas continuam decisão da Google |
| Teste | usar Google Ads test account para mutações; dados de teste não veiculam e possuem limitações próprias |
| Proteções MKT | read-only antes de qualquer write; orçamento, público, território, conversão e ativação são capabilities distintas; Policy Engine não presume classificação jurídica ou publicitária |
| Limitações | versões e campos evoluem; operações podem ter partial failures; quotas e limites dependem do developer token e método |
| Status | **Pós-MVP — leitura primeiro** |

Fontes oficiais: [Google Ads API](https://developers.google.com/google-ads/api/docs/start), [Campaigns](https://developers.google.com/google-ads/api/docs/campaigns/overview), [OAuth](https://developers.google.com/google-ads/api/docs/oauth/overview), [Access Levels](https://developers.google.com/google-ads/api/docs/access-levels), [Test Accounts](https://developers.google.com/google-ads/api/docs/best-practices/test-accounts).

## 5. YouTube

| Item | Definição validada |
|---|---|
| Adapters | **youtube_data**, **youtube_analytics** |
| Leitura | canais, vídeos, playlists, comentários e metadados pela Data API; métricas autorizadas pela Analytics API |
| Escrita | upload e atualização de vídeos, playlists e comentários; agendamento somente pelos campos e estados oficiais, sempre approval-gated |
| Setup humano | Google Cloud Project, APIs habilitadas, OAuth consent/client, canal autorizado, redirect URI e quotas |
| Revisão | projetos não verificados podem ter uploads restringidos a privado; aumento de quota e alguns usos exigem auditoria de compliance |
| Proteções MKT | upload começa privado; publicação pública exige aprovação/readback; Data API e Analytics usam adapters/capabilities separados |
| Limitações | quota é calculada por custo de operação, não apenas por quantidade de requests; processamento de upload é assíncrono; nem toda informação do Studio está disponível nas APIs |
| Status | **Pós-MVP** |

Fontes oficiais: [YouTube Data API](https://developers.google.com/youtube/v3), [Uploading a Video](https://developers.google.com/youtube/v3/guides/uploading_a_video), [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost), [YouTube Analytics API](https://developers.google.com/youtube/analytics/).

## 6. TikTok

| Item | Definição validada |
|---|---|
| Adapters | **tiktok_ads**, **tiktok_organic** |
| Ads | contas, campanhas, ad groups, ads, criativos, reporting e outras capabilities concedidas pelo TikTok for Business |
| Orgânico | publicação e gestão somente pela API/produto aprovado para o use case; não presumir que Content Posting API autorize uma ferramenta interna de publicação para contas administradas pela própria equipe |
| Atendimento/leads | capabilities de leads, comentários ou mensagens só entram após confirmação oficial para a conta, região e produto concedido |
| Setup humano | Business Center, ad account, developer app, OAuth/redirects, permissões, sandbox quando disponível, revisão e formulários de acesso ao produto correto |
| Proteções MKT | Ads somente leitura antes do write; qualquer criação pausada/rascunho; orgânico permanece manual se a API adequada não for aprovada |
| Limitações | Marketing API e APIs orgânicas são produtos separados; acesso, região, formatos, sandbox e políticas não são uniformes; aprovação técnica não equivale à aprovação do conteúdo/anúncio |
| Status | **Pós-MVP — condicionado a aprovação de produto** |

Fontes oficiais: [TikTok for Developers](https://developers.tiktok.com/), [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started/), [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines/), [TikTok for Business API](https://business-api.tiktok.com/portal/docs).

## 7. AdMob

| Item | Definição validada |
|---|---|
| Adapter | **google_admob** |
| Leitura | publisher accounts, apps, ad units e relatórios de rede/mediação disponibilizados pela AdMob API |
| Escrita | não faz parte do primeiro adapter; qualquer capacidade administrativa experimental/beta exige análise e marco próprio |
| Setup humano | Google Cloud Project, AdMob API habilitada, OAuth client/consent, usuário com acesso ao publisher account e publisher ID |
| Uso no MKT | monetização e relatórios do app; aquisição de usuários pertence ao Google Ads, não ao AdMob |
| Proteções MKT | snapshots incrementais no Turbo Analytics; sem varreduras repetitivas ou mistura semântica com métricas de aquisição |
| Limitações | relatórios são assíncronos/streamed conforme método; dimensões e métricas possuem compatibilidades; acesso depende do publisher |
| Status | **Pós-MVP — read-only primeiro** |

Fontes oficiais: [AdMob API](https://developers.google.com/admob/api/v1/getting-started), [Generate Reports](https://developers.google.com/admob/api/v1/report-metrics-dimensions), [OAuth](https://developers.google.com/admob/api/v1/getting-started#authorize_requests).

## 8. Gmail

| Item | Definição validada |
|---|---|
| Adapter | **google_gmail** |
| Leitura | mensagens, threads, labels, history e anexos conforme scopes concedidos |
| Escrita | drafts, labels e respostas de atendimento; envio passa por aprovação/policy/handoff e não é motor de bulk marketing |
| Eventos | push notifications via Google Cloud Pub/Sub e history reconciliation; watch deve ser renovado antes da expiração, recomendadamente diariamente |
| Setup humano | Google Cloud Project, Gmail API e Pub/Sub habilitados, OAuth consent/client, domínio/usuário autorizado, topic e IAM para publicação do Gmail |
| Revisão | scopes sensíveis/restritos podem exigir verificação OAuth e avaliação de segurança; solicitar somente o mínimo necessário |
| Proteções MKT | caixa de suporte autorizada, destinatários allowlisted em teste, supressão e takeover humano; marketing em massa usa produto/provedor adequado, não Gmail API |
| Limitações | push não contém a mensagem completa; o consumidor consulta history e trata gaps; watch expira; quotas são por usuário/projeto |
| Status | **Pós-MVP — atendimento** |

Fontes oficiais: [Gmail API](https://developers.google.com/workspace/gmail/api/guides), [OAuth Scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), [Push Notifications](https://developers.google.com/workspace/gmail/api/guides/push), [Gmail API Usage Policies](https://developers.google.com/gmail/api/policy).

## 9. Microsoft

| Item | Definição validada |
|---|---|
| Adapter | **microsoft_graph_mail** |
| Leitura | mailboxes, folders, messages, attachments, delta query e metadados permitidos pelo Microsoft Graph |
| Escrita | drafts, replies, labels/categories e sendMail para atendimento; não é motor de bulk marketing |
| Eventos | change notifications por webhook e delta reconciliation; subscriptions expiram e precisam de renovação |
| Setup humano | Microsoft Entra App, tenant apropriado, redirect URI, delegated/application permissions, consentimento administrador quando exigido, segredo/certificado e webhook público |
| Restrição de mailbox | para application permissions, limitar mailboxes com Exchange Online Application RBAC quando aplicável, em vez de conceder acesso organizacional amplo |
| Proteções MKT | menor privilégio, allowlist de caixas/destinatários no teste, auditoria e handoff; respostas automáticas somente para assuntos aprovados |
| Limitações | lifetime de subscriptions depende do recurso; webhook pode sinalizar apenas a mudança e exigir consulta; permissões delegated e application têm riscos diferentes |
| Status | **Pós-MVP — atendimento** |

Fontes oficiais: [Microsoft Graph Mail API](https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview), [Change Notifications](https://learn.microsoft.com/en-us/graph/change-notifications-overview), [Permissions Reference](https://learn.microsoft.com/en-us/graph/permissions-reference), [Exchange Online Application RBAC](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac).

## Conectores futuros registrados no Registry

Estes conectores entram no catálogo arquitetural desde o M1 como **planned**, sem OAuth, secrets, chamadas ou contas reais. A implementação ocorre por marcos independentes.

### Google Analytics 4 — Data e Admin

| Item | Definição validada |
|---|---|
| Adapters | **google_analytics_data**, **google_analytics_admin** |
| Data API | runReport, pivot, batch, realtime, funnel, metadata e comparações; leitura e consolidação no Turbo Analytics |
| Admin API | contas, propriedades, streams, retenção, custom dimensions/metrics, key events, links e change history; separar read de config.write |
| Setup humano | Google Cloud Project, APIs habilitadas, OAuth consent/client ou service account autorizada, property IDs e papéis adequados |
| Limitações | Data API usa quotas por tokens/propriedade, com 10 requests concorrentes em propriedade Standard; relatórios podem ter sampling, thresholding e contagens únicas aproximadas; Admin possui recursos Alpha/Beta |
| Eventos | sem webhook genérico confirmado; usar sincronização incremental agendada e registrar freshness/quota retornada |
| Sequência | primeiro conector analítico pós-MVP: Data API read-only; Admin read depois; Admin write em marco de alto risco |

Fontes oficiais: [Data API Reports](https://developers.google.com/analytics/devguides/reporting/data/v1/basics), [Data API Quotas](https://developers.google.com/analytics/devguides/reporting/data/v1/quotas), [Reporting Data Expectations](https://developers.google.com/analytics/devguides/reporting/data/v1/reporting-data-expectations), [Admin API](https://developers.google.com/analytics/devguides/config/admin/v1).

### Google Tag Manager

| Item | Definição validada |
|---|---|
| Adapter | **google_tag_manager** |
| Capacidades | contas, containers, workspaces, tags, triggers, variables, templates, versions, environments e permissions |
| Escrita | config.write, version.create e container.publish são capabilities separadas; publicação exige aprovação humana e readback |
| Setup humano | Cloud Project/API, OAuth 2.0, acesso ao container, scopes separados e conta/container de teste |
| Limitações | 10.000 requests/dia e 0,25 QPS/projeto; operações destrutivas não apresentam confirmação nem undo; não há webhook genérico confirmado |
| Sequência | read-only pós-MVP; edição posterior; delete/publish somente em marco específico |

Fontes oficiais: [GTM API](https://developers.google.com/tag-platform/tag-manager/api/v2), [Authorization](https://developers.google.com/tag-platform/tag-manager/api/v2/authorization), [Limits and Quotas](https://developers.google.com/tag-platform/tag-manager/api/v2/limits-quotas), [Developer Guide](https://developers.google.com/tag-platform/tag-manager/api/v2/devguide).

### Google Search Console

| Item | Definição validada |
|---|---|
| Adapter | **google_search_console** |
| Capacidades | Search Analytics, Sites, Sitemaps e URL Inspection |
| Setup humano | API habilitada, OAuth 2.0, propriedade verificada e usuário autorizado; scopes read-only e read/write separados |
| Limitações | Search Analytics expõe até 50 mil linhas/dia por search type, ordenadas por cliques; URL Inspection vê a versão no índice, não testa a URL ao vivo; sem webhook genérico |
| Sequência | desempenho e inspeção read-only junto ao primeiro pacote analítico pós-MVP; sitemaps.write posteriormente |

Fontes oficiais: [API Reference](https://developers.google.com/webmaster-tools/v1/api_reference_index), [Authorization](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing), [Performance Data Limits](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data), [URL Inspection](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).

### LinkedIn

| Item | Definição validada |
|---|---|
| Adapters | **linkedin_ads**, **linkedin_community**, **linkedin_lead_sync** |
| Capacidades | campanhas, campaign groups, criativos e reporting; páginas, posts, comentários, reações e analytics; leads e webhooks em use cases aprovados |
| Setup humano | Developer App, OAuth 2.0 de três pernas, produtos aprovados, Development/Standard Tier, papéis de Page/ad account e webhook validado |
| Limitações | a maioria dos produtos requer aprovação; chamadas do Advertising Development Tier usam dados de produção, não sandbox isolado; Community Development tem restrições; leitura de perfis pessoais é restrita |
| Versionamento | header Linkedin-Version em ciclo mensal; versões suportadas por no mínimo um ano, exigindo manutenção programada |
| Sequência | futuro, leitura primeiro; nenhum write real antes de Standard/allowlist e plano de teste aprovado |

Fontes oficiais: [Community Management](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview), [Marketing API Tiers](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/marketing-tiers), [Versioning](https://learn.microsoft.com/en-us/linkedin/marketing/versioning), [Webhooks](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation), [Ads Reporting](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting).

### X

| Item | Definição validada |
|---|---|
| Adapters | **x_organic**, **x_ads** |
| Orgânico | posts, busca, timelines, DMs, users, lists, métricas e eventos por stream/webhook conforme plano |
| Ads | campanhas, criativos, audiences, analytics e conversions; sandbox separado que não veicula campanhas |
| Setup humano | Developer Account/Project/App, plano e créditos, OAuth 2.0 PKCE para capabilities v2, OAuth 1.0a para Ads, Ads API access e webhook CRC/signature |
| Limitações | rate limits e cobrança por endpoint/plano; em self-service, reply exige convocação explícita pelo autor; quote-post pela API exige Enterprise; parte de eventos/analytics depende de tier |
| Sequência | futuro; organic read antes de publish/DM; Ads somente após sandbox e aprovação/custo |

Fontes oficiais: [X API](https://docs.x.com/x-api/getting-started/about-x-api), [Post Integration Restrictions](https://docs.x.com/x-api/posts/manage-tweets/integrate), [Webhooks](https://docs.x.com/x-api/webhooks/introduction), [Ads API](https://docs.x.com/x-ads-api/introduction), [Ads Sandbox](https://docs.x.com/x-ads-api/fundamentals/sandbox).

### Pinterest

| Item | Definição validada |
|---|---|
| Adapter | **pinterest_v5** |
| Capacidades | Pins, boards, ads, ad groups, campaigns, targeting, audiences, catalogs, analytics, trends e conversions |
| Setup humano | Business Account, e-mail verificado, Developer Terms, Trial Access, app/redirect, OAuth 2.0; Standard Access exige revisão e vídeo do fluxo OAuth |
| Limitações | Trial: 1.000 requests/dia; Pins/boards de Trial visíveis somente ao criador; Sandbox não cobre video Pins, shopping ads, business access, auction, conversion ou bulk edit; sem webhook genérico confirmado |
| Sequência | futuro; é candidato inicial de write pós-MVP devido ao sandbox real, sempre com produção separada e Standard Access |

Fontes oficiais: [Connect App](https://developers.pinterest.com/docs/getting-started/connect-app/), [OAuth](https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/), [Access Tiers](https://developers.pinterest.com/docs/key-concepts/access-tiers/), [Sandbox](https://developers.pinterest.com/docs/developer-tools/sandbox/), [Rate Limits](https://developers.pinterest.com/docs/reference/rate-limits/).

### Telegram

| Item | Definição validada |
|---|---|
| Adapter | **telegram_bot** |
| Capacidades | mensagens, mídia, comandos, callbacks, grupos e canais conforme permissões; webhook HTTPS ou long polling |
| Setup humano | bot no BotFather, token no cofre, username/configuração, webhook com secret_token, privacy mode e permissões de grupo/canal |
| Limitações | bot não inicia conversa: usuário precisa enviar mensagem ou adicioná-lo; webhook e long polling são mutuamente exclusivos; updates ficam no servidor por até 24 horas; limites aproximados de 1 msg/s/chat, 20/min/grupo e 30/s em broadcast gratuito |
| Topologia | webhook é compatível com Edge Functions; deduplicar por update_id e responder rapidamente |
| Sequência | futuro canal de atendimento inbound; sem prospecção fria ou broadcast no primeiro marco |

Fontes oficiais: [Bots](https://core.telegram.org/bots), [Bot API](https://core.telegram.org/bots/api), [Bot FAQ](https://core.telegram.org/bots/faq).

### Discord

| Item | Definição validada |
|---|---|
| Adapters | **discord_webhook**, **discord_interactions**, **discord_gateway** |
| Webhook | outbound simples para canal, sem bot ou conexão persistente; não substitui atendimento/eventos completos |
| Interactions | slash commands, buttons, selects e modals recebidos por HTTP ou Gateway; HTTP é compatível com Edge Functions |
| Gateway | eventos completos por WebSocket persistente; necessário para omnichannel amplo de mensagens e não adequado ao runtime Edge atual |
| Setup humano | Developer App, bot/token, OAuth2 install URL, guild/channel permissions, Interaction Endpoint, assinatura e Gateway intents |
| Limitações | conteúdo de mensagens depende do privileged intent MESSAGE_CONTENT; apps verificadas a partir de 100 guilds precisam aprovação para intents privilegiados; rate limits vêm dos headers e não devem ser hardcoded; excesso de requests inválidos pode gerar bloqueio temporário |
| Sequência | webhook/interactions HTTP no futuro; inbox completo somente após worker persistente aprovado |

Fontes oficiais: [Webhooks](https://docs.discord.com/developers/platform/webhooks), [Interactions](https://docs.discord.com/developers/interactions/overview), [Gateway and Intents](https://docs.discord.com/developers/events/gateway), [OAuth2 and Permissions](https://docs.discord.com/developers/platform/oauth2-and-permissions), [Rate Limits](https://docs.discord.com/developers/topics/rate-limits).

## Ordem recomendada após o MVP

1. GA4 Data e Search Console em leitura para o Turbo Analytics.
2. GTM somente leitura e inventário de configuração.
3. Pinterest Sandbox e Telegram inbound.
4. Google Ads e YouTube, sempre leitura antes de escrita.
5. Gmail ou Microsoft para atendimento, conforme decisão de negócio.
6. LinkedIn e X após aprovações, custos e plano de testes.
7. TikTok após aprovação do produto correto para Ads e orgânico.
8. Discord completo somente com runtime persistente.
9. Admin writes, publicação, messaging outbound e Ads writes como capabilities e marcos independentes.

## Critérios para promover um conector de planned para development

- documentação oficial e changelog revalidados;
- use case e capabilities exatas aprovados;
- conta, app, tier e ambiente de teste identificados;
- permissões mínimas e processo OAuth revisados;
- limites, custos e política de retry registrados;
- webhook, assinatura, replay e reconciliação definidos quando aplicáveis;
- fixtures redigidas e contrato de adapter aprovados;
- riscos jurídicos, de conteúdo, consentimento, território e orçamento tratados;
- feature flags e kill switch criados;
- critério de readback e rollback definido;
- nenhuma credencial real em documentação, Git, logs ou screenshots.
