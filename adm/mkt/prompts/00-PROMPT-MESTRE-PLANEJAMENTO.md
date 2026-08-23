# Primeiro prompt para o Codex - planejamento obrigatório

Cole o texto abaixo no Codex aberto na raiz deste repositório, preferencialmente em modo de planejamento:

---

Você será o arquiteto e engenheiro principal do **MKT Digital**.

Leia integralmente, nesta ordem:

1. `AGENTS.md`;
2. `README-INICIO.md`;
3. `.agent/PLANS.md`;
4. todos os arquivos de `docs/`;
5. `references/README.md` e os dois PDFs anexos;
6. arquivos de `examples/`.

## Missão desta execução

Esta execução é **somente de descoberta, validação e planejamento**. Não escreva código de produção, não instale dependências, não crie migrações e não conecte contas reais.

Produza:

1. `docs/EXECUTION_PLAN.md`, seguindo `.agent/PLANS.md`;
2. `docs/ARCHITECTURE_DECISIONS.md`, com opções, prós, contras e recomendação para stack, monorepo, fila, worker, deploy, observabilidade e testes;
3. `docs/PLATFORM_CAPABILITY_MATRIX.md`, separando Meta Ads, Meta Organic/Messaging, WhatsApp, Google Ads, YouTube, TikTok, AdMob, Gmail e Microsoft;
4. `docs/ERD-PROPOSED.md`, com entidades, relações, cardinalidades e justificativas;
5. `docs/SECURITY-THREAT-MODEL.md`;
6. `docs/EXTERNAL-SETUP-CHECKLIST.md`, listando exatamente o que eu terei de criar, autorizar ou fornecer em cada plataforma;
7. `docs/MVP-BACKLOG.md`, com épicos, histórias, critérios de aceite, dependências e ordem;
8. `docs/OPEN-QUESTIONS.md`, contendo somente perguntas realmente bloqueadoras ou decisões de negócio ainda não definidas.

## Restrições obrigatórias

- Não alterar nem integrar código do app Delphi/FM﻿X nesta fase.
- Considerar `\TurboTiger\Desenvolvimento\turbotiger-site\adm\mkt`, resolvido a partir da unidade ou compartilhamento atual, como diretório oficial do MKT Digital.
- Reutilizar o projeto Supabase existente do aplicativo e manter todos os objetos próprios no schema `mod_mkt`.
- Usar a CLI local do projeto principal, não criar outro vínculo Supabase e não executar `supabase db push`.
- Não copiar credenciais ou valores do arquivo local de segredos de emergência.
- Não acoplar o núcleo a OpenAI, Claude ou qualquer IA específica.
- Não acoplar o núcleo exclusivamente ao MCP da Meta.
- Toda escrita em plataforma externa deve passar por Policy Engine, aprovação/feature flag, idempotência e auditoria.
- Novas campanhas e anúncios devem nascer pausados/rascunho.
- Material com celebridade deve obedecer contrato, vigência, ativo, modalidade, plataforma, formato e território.
- Para Cauã Reymond, tráfego pago é regionalmente restrito e orgânico não está restrito, mas a lista operacional da região e as datas devem permanecer como decisão pendente até serem fornecidas.
- Não inventar campos contratuais, permissões de API ou regras jurídicas.
- Definir um MVP utilizável primeiro em Meta + Instagram/Facebook + WhatsApp + caixa unificada/CRM, preservando extensibilidade para os demais conectores.
- Separar claramente o que o código fará do que exige aprovação/manual setup nas plataformas.
- Criar um plano testável, com checkpoints Git e rollback.

## Forma da resposta

Ao terminar os documentos, apresente:

- resumo executivo;
- arquitetura recomendada;
- sequência das fases;
- riscos críticos;
- decisões que precisam da minha aprovação.

Pare depois disso. Aguarde aprovação explícita antes de implementar qualquer código.

---
