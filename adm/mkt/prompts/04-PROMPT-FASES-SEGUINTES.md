# Modelo de prompt para fases seguintes

---

Implemente somente o marco `<NOME_DA_FASE>` definido e aprovado em `docs/EXECUTION_PLAN.md`.

Antes de começar:

- leia `AGENTS.md`, documentos do domínio e ExecPlan;
- crie checkpoint Git;
- atualize capability matrix com documentação oficial atual;
- liste permissões e aprovações externas;
- mantenha escrita externa desligada até homologação.

Durante:

- use o contrato comum de conector;
- não copie a estrutura de outra plataforma sem modelar diferenças;
- passe ações por Policy Engine, aprovação, idempotência e auditoria;
- implemente mocks e testes de integração;
- trate token expirado, rate limit, duplicidade, timeout e erro parcial.

Ao final:

- rode lint, typecheck, testes e E2E relevantes;
- atualize documentação e critérios de aceite;
- revise o diff;
- registre riscos e limitações;
- pare para aprovação.

---
