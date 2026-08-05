# Checklist de configuração externa do MKT Digital

## Estado e regra de uso

- Projeto: **MKT Digital**.
- Diretório oficial: `turbotiger-site/adm/mkt`.
- Backend inicial: projeto Supabase Pro atual.
- Schema privado: `mod_mkt`.
- Data-base: `2026-08-03`.
- Estado: checklist de planejamento; **nenhuma conta, credencial, integração ou deploy foi criado no Marco M0**.

Este documento separa o que o código fará do que o proprietário ou a plataforma deverá criar, autorizar ou fornecer. Um item marcado não autoriza a execução do marco seguinte. Cada plataforma só será conectada no marco específico, após aprovação explícita.

## Regras para qualquer credencial

- [ ] Definir um proprietário humano e um suplente por conta/app.
- [ ] Conceder apenas os escopos e ativos exigidos pelas capabilities aprovadas.
- [ ] Inserir valores diretamente no cofre/ambiente autorizado; nunca em chat, Git, banco de negócio, fixture, log ou screenshot.
- [ ] Registrar somente o nome lógico da credencial, tenant, ambiente, proprietário, emissão, expiração e rotação.
- [ ] Usar credenciais, contas, números, destinatários e ativos controlados de teste antes de liberar produção.
- [ ] Manter procedimento documentado de revogação e rotação.
- [ ] Revisar termos, política de desenvolvedor, uso aceitável, privacidade, retenção e transferência internacional aplicáveis.
- [ ] Guardar evidência de aprovação/review da plataforma, sem anexar segredo.

Exemplos permitidos na documentação: `META_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`, `OPENAI_API_KEY`. Valores reais são proibidos.

## Gate comum antes de conectar qualquer plataforma

### O proprietário deverá

- [ ] Confirmar a organização, workspace lógico (`test` ou `production`), marca, produto e responsável pelo conector.
- [ ] Informar IDs públicos/não secretos necessários: conta, página, canal, número, dataset ou equivalente.
- [ ] Aprovar capabilities de leitura e escrita separadamente.
- [ ] Aprovar limites de custo, quota, público/destinatário e finalidade.
- [ ] Confirmar URLs públicas de privacidade, termos, exclusão de dados e suporte exigidas pela plataforma.
- [ ] Concluir verificação empresarial, OAuth, revisão de app e aceite de termos quando exigidos.
- [ ] Inserir os segredos diretamente no cofre depois que o destino estiver aprovado.

### O sistema fará em marco futuro autorizado

- validar configuração sem revelar o segredo;
- vincular a conexão ao tenant/workspace/ambiente;
- declarar capabilities e status de revisão;
- executar health check e registrar expiração/última sincronização;
- bloquear escrita até flags, policy, aprovação, allowlist e limites estarem válidos;
- verificar assinatura de webhook, deduplicar eventos e registrar auditoria;
- oferecer desconexão, revogação lógica e runbook de rotação.

### Evidência mínima

- [ ] conta/ativo e proprietário registrados;
- [ ] ambiente e tenant corretos;
- [ ] scopes/capabilities aprovados e datados;
- [ ] health check sem segredo em log;
- [ ] procedimento de revogação testado;
- [ ] escrita externa desligada por padrão.

## 1. Vercel, domínio e frontend — MVP

### Proprietário/plataforma

- [ ] Confirmar organização/conta Vercel que será dona do painel.
- [ ] Confirmar domínio e URL definitivos do painel.
- [ ] Autorizar criação futura do projeto Vercel ligado ao diretório/app correto.
- [ ] Configurar DNS e verificar domínio quando o marco de deploy for autorizado.
- [ ] Definir responsáveis com acesso administrativo e política de MFA.
- [ ] Inserir variáveis por ambiente diretamente na Vercel; não fornecer valores por chat.
- [ ] Confirmar URLs finais de callback OAuth, webhook e políticas antes de submetê-las às plataformas.

### Código em marco futuro

- construir o painel Next.js e a API contract;
- usar somente chave pública/publicável no navegador;
- manter secrets e funções privilegiadas no backend;
- aplicar headers seguros, CSP, validação de origem e logs redigidos.

### Gate

- [ ] domínio HTTPS válido;
- [ ] preview não usa conta real nem segredo de produção;
- [ ] deploy de produção continua bloqueado até autorização própria.

## 2. Supabase Pro atual — MVP

Decisão encerrada: será usado o **mesmo projeto Supabase Pro do aplicativo**, sem novo projeto hospedado e sem sandbox externo. `turbo_tiger_test` e `turbo_tiger_prod` serão workspaces lógicos isolados no mesmo projeto.

### Proprietário/Supabase deverá

- [ ] Confirmar o project ref já vinculado pela CLI local, sem criar novo link.
- [ ] Confirmar que o backup gerenciado mais recente está íntegro antes do primeiro marco estrutural.
- [ ] Autorizar separadamente a primeira migration do schema `mod_mkt`.
- [ ] Autorizar, em marco próprio, a habilitação de PGMQ/Supabase Queues e Vault se ainda não estiverem habilitados.
- [ ] Aprovar roles técnicas distintas e de menor privilégio para API, webhook, worker e auditoria.
- [ ] Aprovar buckets/prefixos privados de teste e produção antes da criação.
- [ ] Inserir segredos futuros diretamente em Supabase Secrets/Vault.
- [ ] Definir responsáveis por backup, restauração, Disk IO Budget e incidentes.

### Código/migrations em marcos futuros

- criar apenas objetos de negócio qualificados por `mod_mkt`;
- manter `mod_mkt` fora dos schemas expostos pela Data API;
- ativar RBAC/RLS, FKs compostas e índices usados por policies;
- impedir privilégio sobre `public` e outros módulos, salvo contrato explícito autorizado;
- usar pool transacional, transações curtas, timeouts, lotes pequenos, cursor e retenção;
- criar buckets privados e paths derivados no backend;
- versionar migrations aditivas e rollback/compensação no Git;
- aplicar somente o arquivo aprovado com a CLI local; nunca usar `supabase db push` neste fluxo.

### Gate antes da primeira migration remota

- [ ] branch/commit e SQL revisados;
- [ ] backup e versão atual das migrations registrados;
- [ ] verificação de que a migration não altera tabelas do app;
- [ ] rollback compensatório documentado;
- [ ] teste local de grants, RLS e cross-tenant aprovado;
- [ ] arquivo exato e janela de execução aprovados;
- [ ] plano de monitoramento de IO/conexões definido.

## 3. Meta — configuração comum do MVP

### Proprietário/Meta deverá

- [ ] Confirmar ou criar, se necessário, o portfólio empresarial correto e concluir verificações exigidas.
- [ ] Confirmar ou criar o Meta App sob propriedade empresarial adequada.
- [ ] Aceitar termos aplicáveis e cadastrar dados de contato, privacidade, termos e exclusão de dados.
- [ ] Informar os IDs públicos dos ativos que o app poderá acessar.
- [ ] Autorizar OAuth com administrador dos ativos, usando apenas permissões necessárias.
- [ ] Solicitar App Review/Advanced Access quando uma capability exigir.
- [ ] Configurar domínios, redirect URIs e webhook URLs somente após as URLs finais serem fornecidas.
- [ ] Designar responsável por tokens, revisão anual, alertas e revogação.

### Código em marcos futuros

- implementar plugins separados para Meta Ads, Meta Organic/Messaging e WhatsApp;
- validar `state`, vínculo tenant-conta e scopes concedidos;
- assinar/verificar webhooks conforme o produto Meta;
- manter MCP da Meta opcional; o núcleo não dependerá dele;
- registrar versão da API e capabilities efetivamente aprovadas.

### Gate comum

- [ ] app e ativos pertencem à organização esperada;
- [ ] modo e contas de teste identificados;
- [ ] cada permission/capability foi confirmada na documentação oficial e na matriz;
- [ ] produção permanece com escrita desligada.

## 4. Meta Ads — MVP leitura no M7 e escrita pausada no M8

### Proprietário/Meta deverá

- [ ] Informar Business/Portfolio ID, Ad Account ID e moeda/fuso da conta.
- [ ] Conceder acesso ao usuário/app responsável com o menor papel necessário.
- [ ] Confirmar Pages, Instagram accounts, pixels/datasets e demais ativos autorizados, se usados.
- [ ] Cadastrar método de pagamento diretamente na Meta; nunca fornecer dado financeiro ao MKT Digital.
- [ ] Definir teto diário, mensal, por ação, variação máxima, cooldown e aprovadores.
- [ ] Fornecer públicos, exclusões, idade e território aprovados; não inferir.
- [ ] Solicitar/obter as permissões de leitura e gestão exigidas pela capability aprovada.

### Código em marcos futuros

- M7: sincronizar configuração e insights em modo somente leitura;
- M8: criar campanha/conjunto/anúncio apenas pausado/rascunho, com idempotência;
- aplicar Policy/Approval Engines e direitos antes da criação;
- fazer readback de status, orçamento, público, território e ativo;
- bloquear ativação automática no MVP.

### Gate de escrita

- [ ] conta allowlisted e orçamento baixo aprovado;
- [ ] feature flags de criação pausada liberadas; ativação continua desligada;
- [ ] idempotência, timeout ambíguo e readback passaram em teste;
- [ ] ativo, contrato e território aprovados quando houver celebridade.

## 5. Facebook/Instagram Organic e Messaging — MVP M9

### Proprietário/Meta deverá

- [ ] Informar Page IDs e contas profissionais do Instagram autorizadas.
- [ ] Confirmar ligação entre Página, conta profissional e portfólio quando exigida pelo fluxo escolhido.
- [ ] Autorizar permissões de leitura, publicação, comentários e mensagens apenas para capabilities do MVP.
- [ ] Configurar subscriptions de webhook e usuários de teste durante revisão.
- [ ] Aprovar quais formatos podem ser publicados e quais exigem revisão humana.
- [ ] Definir assuntos automáticos, assuntos proibidos, responsáveis e SLA de handoff.

### Código em marco futuro

- receber mensagens/comentários, deduplicar e registrar no inbox/CRM;
- produzir rascunhos e publicar somente após gate correspondente;
- interromper IA imediatamente quando o humano assumir;
- impedir mensagem fria iniciada por automação quando a plataforma não permitir;
- auditar conteúdo, versão, aprovação, resposta externa e permalink/ID.

### Gate

- [ ] página/conta de teste confirmada;
- [ ] webhook validado e replay testado;
- [ ] publicação automática começa desligada;
- [ ] base oficial e matriz de handoff aprovadas.

## 6. WhatsApp Business Platform — MVP M9

Nível oficial do MVP: **inbound-first + utility outbound controlado**. O Turbo Tiger é serviço de gestão, organização, controle e estatísticas; não é jogo, bet ou casa de apostas. A comunicação não pode prometer ganho, prever resultado nem incentivar aposta.

### Proprietário/Meta deverá

- [ ] Confirmar ou criar WABA e número empresarial autorizado.
- [ ] Concluir verificação empresarial, nome de exibição e demais revisões exigidas.
- [ ] Informar WABA ID, Phone Number ID e número de teste/produção sem compartilhar token.
- [ ] Cadastrar webhook e verify token diretamente no ambiente autorizado quando solicitado.
- [ ] Criar e submeter templates de utilidade com texto/finalidade aprovados.
- [ ] Definir processo de opt-in de marketing, texto de consentimento e prova de origem/data/finalidade.
- [ ] Definir palavra/fluxo de descadastro e suppression imediata.
- [ ] Fornecer allowlist de números internos para validação.
- [ ] Obter esclarecimento/classificação escrita da Meta se a plataforma levantar dúvida regulatória; não presumir bloqueio nem exceção por categoria incorreta.

### Código em marco futuro

- responder quando o usuário iniciar a conversa;
- calcular a janela conforme regra vigente da plataforma;
- fora da janela, permitir somente template aprovado e finalidade/consentimento válidos;
- bloquear lista comprada, contato frio, disparo em massa e destinatário fora da allowlist durante validação;
- registrar consentimento, template, janela, envio, resposta, falha e opt-out;
- fazer handoff humano com lease transacional.

### Gate de envio

- [ ] políticas oficiais vigentes revisadas e datadas;
- [ ] templates aprovados na plataforma e internamente;
- [ ] `enable_whatsapp_send` liberada somente para o tenant/allowlist corretos;
- [ ] janela, opt-in, finalidade, suppression e rate limit testados;
- [ ] campanhas promocionais continuam sob aprovação humana e opt-in específico;
- [ ] prospecção fria automática permanece fora do MVP.

## 7. OpenAI e provedores de IA — MVP M6

### Proprietário/provedor deverá

- [ ] Criar/selecionar projeto de API sob conta empresarial apropriada.
- [ ] Inserir a chave diretamente no cofre e definir responsável/rotação.
- [ ] Aprovar modelos/capabilities permitidos por tarefa.
- [ ] Definir teto diário/mensal, alertas de consumo e responsável pelo custo.
- [ ] Aprovar política de envio de PII, retenção, residência/transferência e contrato aplicável.
- [ ] Aprovar quais tarefas admitem fallback, comparação ou revisão cruzada.

### Código em marco futuro

- usar OpenAI como primeiro adapter do AI Gateway, sem acoplar o core;
- rotear por tarefa/capability/custo/privacidade/saúde;
- redigir dados, validar saída estruturada e registrar uso/custo;
- proibir IA de receber credencial externa ou chamar conector diretamente;
- bloquear fallback que reduza controles de privacidade ou compliance.

### Gate

- [ ] projeto, modelo, teto e política de dados aprovados;
- [ ] prompt injection, PII/redaction, timeout e custo testados;
- [ ] `enable_ai_generation` granular por tenant e tarefa.

Para Claude, Gemini, Grok, Ollama/vLLM ou outro provedor, repetir este checklist quando o adapter interno estiver versionado e implantado. Cadastro no painel não instala código novo.

## 8. Google Ads — pós-MVP

### Proprietário/Google deverá

- [ ] Confirmar conta manager/customer, IDs, moeda, fuso e responsáveis.
- [ ] Criar/selecionar projeto Google Cloud e tela de consentimento OAuth apropriados.
- [ ] Solicitar developer token e nível de acesso compatível com as capabilities pretendidas.
- [ ] Autorizar OAuth com menor escopo e concluir verificações/revisões exigidas.
- [ ] Definir contas de teste, budgets, públicos, conversões e método de pagamento diretamente no Google Ads.

### Código futuro

- separar leitura, relatórios e gestão em capabilities;
- respeitar acesso aprovado, quotas e permissible use;
- criar recursos pausados e fazer readback antes de qualquer liberação.

### Gate

- [ ] developer token aprovado para o uso pretendido;
- [ ] conta de teste/produção e limites identificados;
- [ ] revisão oficial registrada na matriz de capacidades.

## 9. Google Analytics 4, Tag Manager e Search Console — pós-MVP

### Proprietário/Google deverá

- [ ] Informar GA4 Property IDs, contas/propriedades e acessos autorizados.
- [ ] Informar contas/containers/workspaces do Google Tag Manager.
- [ ] Verificar propriedade do site e informar sites do Search Console.
- [ ] Criar/selecionar projeto Google Cloud, habilitar APIs e consentimento OAuth necessários.
- [ ] Aprovar acesso por usuário ou credencial suportada, sempre com menor privilégio.
- [ ] Definir fuso, moeda, eventos/conversões e dicionário de métricas oficiais.

### Código futuro

- GA4: adapters separados para Data e Admin; começar somente leitura;
- GTM: começar leitura; edição/publicação exige aprovação de alto risco e versão/readback;
- Search Console: ingestão incremental, quota-aware, sem presumir webhook inexistente;
- normalizar origem, definição, granularidade, fuso e freshness no Turbo Analytics.

### Gate

- [ ] propriedades verificadas e dicionário de métricas aprovado;
- [ ] escrita em GTM permanece desligada até marco específico;
- [ ] limites e retenção protegem o IO do Supabase compartilhado.

## 10. YouTube — pós-MVP

### Proprietário/Google deverá

- [ ] Informar canal/Brand Account e administradores autorizados.
- [ ] Criar/selecionar projeto Google Cloud, habilitar YouTube Data API e configurar OAuth.
- [ ] Configurar tela de consentimento, usuários de teste e verificação quando exigida.
- [ ] Aprovar quotas, privacidade inicial, formatos e política de comentários.

### Código futuro

- importar métricas e metadados;
- preparar upload/agendamento como rascunho/privado até aprovação;
- respeitar restrições de projetos não verificados e quotas;
- moderar comentários somente com policy e auditoria.

### Gate

- [ ] upload de teste não torna vídeo público;
- [ ] quota e status de verificação documentados;
- [ ] canal de produção permanece com publicação desligada.

## 11. TikTok — pós-MVP

### Proprietário/TikTok deverá

- [ ] Confirmar Business Center, contas de anúncio e contas orgânicas autorizadas.
- [ ] Criar/selecionar developer app sob a entidade correta.
- [ ] Solicitar produtos/APIs, scopes, revisão e acesso de produção necessários.
- [ ] Configurar redirect URIs, webhooks e contas de teste/sandbox oferecidas.
- [ ] Aprovar orçamento, formatos, públicos e política editorial.

### Código futuro

- manter adapters separados para Marketing e orgânico/contas;
- declarar somente capabilities realmente aprovadas;
- não usar Content Posting API como atalho inadequado para ferramenta interna;
- criar anúncios pausados e reconciliar o estado externo.

### Gate

- [ ] produto/API adequado foi aprovado para o caso de uso;
- [ ] limites de sandbox e produção documentados;
- [ ] escrita/publicação continua desligada até piloto próprio.

## 12. AdMob — pós-MVP

### Proprietário/Google deverá

- [ ] Confirmar conta AdMob, Publisher ID e apps autorizados.
- [ ] Informar App IDs e unidades de anúncio quando necessárias, sem dado financeiro sensível.
- [ ] Criar/selecionar projeto OAuth e conceder o acesso mínimo suportado.
- [ ] Aprovar finalidade de relatório e qualquer futura gestão de inventário/mediation.

### Código futuro

- começar somente leitura de contas, apps e relatórios;
- tratar capacidades de criação/gestão como separadas, limitadas e pós-MVP;
- conciliar moeda, fuso e definição de receita antes de agregar.

### Gate

- [ ] acesso de relatório validado;
- [ ] nenhuma alteração de app/ad unit/mediation habilitada no primeiro conector.

## 13. Gmail / Google Workspace — pós-MVP

Uso previsto: atendimento solicitado e caixa omnichannel, não envio em massa.

### Proprietário/Google deverá

- [ ] Informar contas/caixas autorizadas e se pertencem a Google Workspace.
- [ ] Criar/selecionar projeto Google Cloud e tela de consentimento OAuth.
- [ ] Solicitar apenas scopes necessários; concluir verificação e avaliação de segurança quando exigidas para scopes sensíveis/restritos.
- [ ] Aprovar remetentes, aliases, assinatura, destinatários de teste e política de retenção.
- [ ] Se push for usado, criar/autorizar projeto, topic e permissões Pub/Sub conforme documentação oficial.

### Código futuro

- sincronizar mensagens incrementalmente e renovar `watch` antes de expirar;
- deduplicar, aplicar handoff/consentimento/suppression e enviar apenas resposta autorizada;
- redigir conteúdo em logs/IA e respeitar quotas.

### Gate

- [ ] caixas e remetentes allowlisted;
- [ ] revisão de scopes concluída;
- [ ] envio externo desligado durante validação.

## 14. Microsoft 365 / Outlook — pós-MVP

### Proprietário/Microsoft deverá

- [ ] Informar tenant Microsoft Entra, caixas e administradores autorizados.
- [ ] Registrar/selecionar aplicativo Entra e configurar redirect URIs.
- [ ] Aprovar permissões Microsoft Graph delegadas ou de aplicação conforme o caso de uso.
- [ ] Conceder admin consent quando exigido.
- [ ] Restringir acesso de aplicação às caixas necessárias com mecanismo oficial aplicável.
- [ ] Autorizar endpoints públicos e lifecycle notifications para subscriptions/webhooks.

### Código futuro

- receber mensagens/notificações, renovar subscriptions e reconciliar lacunas;
- separar leitura e envio em capabilities;
- aplicar RBAC, handoff, suppression, auditoria e redaction.

### Gate

- [ ] consentimento e restrição de caixas comprovados;
- [ ] lifecycle/replay de webhook testado;
- [ ] envio permanece allowlisted.

## 15. LinkedIn — pós-MVP

### Proprietário/LinkedIn deverá

- [ ] Confirmar organização, páginas e contas de anúncio autorizadas.
- [ ] Criar/selecionar developer app e associá-lo à organização correta.
- [ ] Solicitar produtos, permissions e tiers necessários; concluir review.
- [ ] Autorizar OAuth e informar IDs públicos dos ativos.
- [ ] Aprovar finalidade de lead sync, conteúdo ou anúncios separadamente.

### Código futuro

- adapters separados por Ads, Community/Organic e Lead Sync;
- registrar versão mensal da API e status de acesso;
- tratar dados de lead como restritos e criar anúncios pausados.

### Gate

- [ ] produto/tier aprovado para o caso de uso;
- [ ] ambiente de desenvolvimento não é tratado como sandbox fictício;
- [ ] retenção e finalidade de leads aprovadas.

## 16. X — pós-MVP

### Proprietário/X deverá

- [ ] Criar/selecionar developer organization, project e app.
- [ ] Aprovar tier/custos e habilitar billing diretamente na plataforma quando exigido.
- [ ] Configurar OAuth, callback e conta(s) autorizada(s).
- [ ] Para Ads, informar ad account e confirmar acesso ao Ads API/sandbox disponível.
- [ ] Aprovar regras de resposta, automação e publicação conforme política vigente.

### Código futuro

- separar Organic e Ads;
- aplicar quota/custo, regras de reply e auditoria;
- usar ads sandbox quando oferecido e criar recursos pausados.

### Gate

- [ ] tier e custo aprovados;
- [ ] acesso Ads separado do acesso orgânico;
- [ ] escrita desligada até testes específicos.

## 17. Pinterest — pós-MVP

### Proprietário/Pinterest deverá

- [ ] Confirmar Business account, boards e ad accounts autorizados.
- [ ] Criar/selecionar app e configurar OAuth/redirect URIs.
- [ ] Solicitar Trial/Standard access ou revisão aplicável ao uso pretendido.
- [ ] Definir contas/ativos de teste compatíveis com as limitações do sandbox.

### Código futuro

- separar pins/orgânico, ads e analytics em capabilities;
- respeitar diferenças entre sandbox, trial e produção;
- publicar/criar somente após policy, aprovação e readback.

### Gate

- [ ] status de acesso e limitações documentados;
- [ ] ativos de teste não são confundidos com produção.

## 18. Telegram — pós-MVP

### Proprietário/Telegram deverá

- [ ] Criar bot via BotFather e inserir token diretamente no cofre.
- [ ] Autorizar o bot nos grupos/canais necessários e definir permissões mínimas.
- [ ] Informar IDs públicos autorizados e endpoint HTTPS de webhook.
- [ ] Definir secret token de webhook diretamente no ambiente.

### Código futuro

- validar webhook/secret, deduplicar updates e registrar auditoria;
- respeitar que bot não inicia conversa arbitrariamente com usuário;
- responder/publicar somente nos chats/canais autorizados.

### Gate

- [ ] chats allowlisted e permissões mínimas;
- [ ] webhook e fallback operacional testados.

## 19. Discord — pós-MVP

### Proprietário/Discord deverá

- [ ] Criar application/bot e autorizar apenas servidores controlados.
- [ ] Definir bot permissions/intents mínimos e informar IDs autorizados.
- [ ] Configurar interaction endpoint/webhook e public key conforme o fluxo.
- [ ] Inserir token diretamente no cofre.

### Código futuro

- usar webhooks/interactions em Edge quando suficiente;
- validar assinatura, deduplicar e aplicar capabilities;
- não prometer Gateway persistente no MVP; essa necessidade reabre decisão de worker.

### Gate

- [ ] servidor/canais allowlisted;
- [ ] assinatura e permissões validadas;
- [ ] caso de uso não exige worker persistente sem ADR novo.

## 20. Jurídico, marca, consentimento e direitos — obrigatório antes do piloto

### Posicionamento e conteúdo

- [ ] Aprovar a mensagem oficial: `O Turbo Tiger não foi criado para incentivar apostas. Foi criado para incentivar o controle e o jogo responsável.`
- [ ] Aprovar termos proibidos, escalonamentos e exemplos de linguagem responsável.
- [ ] Confirmar política para menores, crise, fraude, segurança, cobrança e compromisso comercial.
- [ ] Fornecer URLs vigentes de termos, privacidade, suporte e exclusão de dados.

### LGPD e atendimento

- [ ] Identificar controlador, operadores/suboperadores, responsável jurídico/DPO quando aplicável e canal do titular.
- [ ] Aprovar base legal e finalidade por origem/canal, inclusive marketing.
- [ ] Aprovar política de retenção por contato, mensagem, anexo, evento, métrica e auditoria.
- [ ] Definir acesso, correção, portabilidade/exportação, exclusão/anonimização e legal hold.
- [ ] Aprovar transferência internacional e uso de PII em cada provedor de IA/observabilidade.
- [ ] Aprovar base de conhecimento oficial, responsáveis, SLA, horário e handoff.

### Celebridades, contratos e Cauã Reymond

- [ ] Fornecer documento oficial e identificador/hash sem expor conteúdo sensível além do necessário.
- [ ] Fornecer datas de início/fim e status.
- [ ] Informar plataformas, formatos, modalidades paga/orgânica e territórios autorizados.
- [ ] Fornecer lista operacional aprovada da região para tráfego pago e IDs geográficos por plataforma.
- [ ] Informar regras de recorte, sobreposição, alteração visual, voz, fala e IA.
- [ ] Identificar ativos aprovados, suas versões/hashes e aprovadores.
- [ ] Definir ação em vencimento, revogação ou bloqueio.

Até isso ocorrer, material pago de Cauã permanece bloqueado. Orgânico não recebe restrição territorial inventada, mas permanece bloqueado se outro direito obrigatório estiver indefinido.

## 21. Orçamento, operação e observabilidade — obrigatório antes do piloto

### Proprietário deverá

- [ ] Definir moeda e fuso canônicos por conta/workspace.
- [ ] Definir teto diário, mensal e por ação.
- [ ] Definir variação automática máxima, cooldown e ações que sempre exigem aprovação.
- [ ] Definir aprovadores, substitutos e se autoaprovação é proibida.
- [ ] Definir limites de custo de IA e processamento de mídia.
- [ ] Definir responsáveis por alertas, incidentes, fora de horário e escalonamento.
- [ ] Aprovar retenção de logs, métricas e erros.
- [ ] Criar/autorizar projeto Sentry ou observabilidade equivalente antes da integração.
- [ ] Configurar canais de alerta sem expor conteúdo sensível.

### Código futuro

- registrar `correlation_id`, `event_id`, `external_action_id` e versão do plugin;
- redigir PII/segredos em logs e traces;
- medir fila, falha, retry, DLQ, latência, quota, custo e drift;
- fornecer kill switch global, por tenant, conector e capability;
- emitir alertas sem incluir corpo completo de mensagem ou token.

### Gate

- [ ] dashboard de saúde mostra última sincronização e erro redigido;
- [ ] alertas e runbooks foram ensaiados;
- [ ] kill switch e revogação de credencial foram demonstrados;
- [ ] Disk IO Budget e conexões do Supabase possuem limites operacionais.

## 22. Processamento externo de imagem e vídeo — quando entrar no escopo

### Proprietário deverá

- [ ] Selecionar provedor e aprovar termos, custo, retenção, direitos e região de processamento.
- [ ] Confirmar que o contrato permite uso dos ativos enviados, especialmente celebridades.
- [ ] Inserir chave no cofre e definir teto/allowlist.

### Código futuro

- enviar job assíncrono, guardar apenas ID/estado e buscar resultado por polling/webhook;
- não renderizar tarefa pesada dentro da Edge Function;
- validar arquivo, hash, direitos e aprovação antes de publicar;
- bloquear alteração de rosto, voz ou nova fala sem permissão explícita.

## Sequência de desbloqueio por marco

| Marco | Configuração externa necessária | Ações externas permitidas |
|---|---|---|
| M0 | nenhuma | nenhuma |
| M1 | nenhuma conta real; somente mocks | nenhuma |
| M2 | aprovação de backup/migration e roles no Supabase atual | somente estrutura autorizada; nenhuma integração |
| M3 | autorização de PGMQ/Vault e secrets placeholders | nenhuma escrita em plataforma |
| M4 | contratos, territórios, buckets e aprovadores | gestão interna de ativos |
| M5 | base de conhecimento, SLA, consentimento e canais mockados | somente mocks/allowlist interna |
| M6 | projeto OpenAI, teto e política de dados | geração interna controlada |
| M7 | Meta App/ativos/scopes de leitura | leitura Meta apenas |
| M8 | Meta Ads, budgets, direitos e conta allowlisted | criação pausada; sem ativação |
| M9 | contas orgânicas, WABA, templates e consentimento | piloto inbound/utility e publicação aprovada |
| M10 | runbooks, alertas, limites e aprovação final | piloto controlado dentro das flags |

## Registro de entrega por conector

Antes de considerar um conector pronto, anexar ao inventário interno — sem valores secretos:

- [ ] nome do provider, adapter e versão;
- [ ] documentação oficial consultada e data;
- [ ] tenant, ambiente e proprietário;
- [ ] conta/app/ativos públicos vinculados;
- [ ] método OAuth/token e scopes concedidos;
- [ ] capabilities habilitadas e negadas;
- [ ] webhook, assinatura, replay e renovação;
- [ ] quotas/rate limits, custo e alertas;
- [ ] health check, expiração e última rotação;
- [ ] modo de teste, allowlists e feature flags;
- [ ] revogação, rollback e contato de incidente;
- [ ] evidência de App Review/consentimento quando exigida.

## Critério de conclusão deste checklist

Um item externo só está concluído quando há responsável, evidência, data e escopo; marcar uma caixa sem esses dados não libera a capability. Qualquer permissão, classificação de plataforma ou regra jurídica ainda não confirmada permanece `approval_required`/bloqueada e deve ser validada na documentação oficial antes da implementação.
