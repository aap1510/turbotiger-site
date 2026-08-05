# Módulos e fluxos ponta a ponta

## Módulos

1. Dashboard.
2. Organizações, marcas e contas.
3. Usuários, RBAC e aprovações.
4. Provedores de IA.
5. Conectores e credenciais.
6. Biblioteca de mídia.
7. Celebridades, contratos e territórios.
8. Policy Engine.
9. Conteúdo e calendário.
10. Campanhas e orçamento.
11. Caixa de entrada omnichannel.
12. CRM e funil.
13. Conversões e atribuição.
14. Relatórios.
15. Auditoria e incidentes.

## Fluxo de conteúdo orgânico

```text
Agenda -> briefing -> IA -> ativo/legenda -> revisão automática
-> Policy Engine -> aprovação -> publicação -> confirmação -> métricas
```

## Fluxo de campanha paga

```text
Briefing -> estratégia proposta -> orçamento/público/criativos
-> preflight jurídico e territorial -> criação pausada
-> readback da plataforma -> aprovação/ativação -> métricas
-> regras de otimização -> nova aprovação quando exigida
```

## Fluxo de mensagem

```text
Webhook -> validação de assinatura -> deduplicação -> normalização
-> contato/conversa -> classificação -> base de conhecimento
-> Policy Engine de atendimento -> resposta/rascunho/handoff
-> envio -> confirmação -> CRM -> auditoria
```

## Fluxo de conversão

```text
Lead -> conversa -> cadastro -> assinatura -> receita
-> atribuição interna -> evento elegível -> envio à plataforma
-> retorno e auditoria
```

## Estados mínimos de uma ação externa

- draft;
- awaiting_approval;
- approved;
- queued;
- executing;
- succeeded;
- failed_retryable;
- failed_terminal;
- cancelled;
- rolled_back quando aplicável.
