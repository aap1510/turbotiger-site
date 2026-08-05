# Prompt da Fase 1 - fundação

Use somente depois de o plano ser aprovado.

---

Implemente apenas o marco **Fase 1 - Fundação** aprovado em `docs/EXECUTION_PLAN.md`.

Antes de editar:

1. leia `AGENTS.md` e o ExecPlan;
2. crie checkpoint Git;
3. confirme o escopo exato da fase no plano;
4. não implemente conectores externos reais ainda.

Entregue:

- scaffold do monorepo;
- admin web inicial;
- autenticação Supabase;
- organizações, usuários, RBAC e RLS;
- migrações iniciais;
- auditoria;
- feature flags;
- idempotência/outbox/fila conforme decisão aprovada;
- health checks;
- CI, lint, typecheck e testes;
- `.env.example` atualizado;
- documentação de execução local.

Critérios:

- nenhuma chave real;
- nenhuma escrita externa;
- testes passando;
- seed exclusivamente fictício;
- revisão do diff e relatório de riscos.

Pare ao concluir esta fase e apresente evidências dos testes. Não avance para a Fase 2 sem aprovação.

---
