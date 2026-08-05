# ExecPlans do MKT Digital

Para funcionalidades complexas ou refatorações relevantes, o Codex deve produzir um ExecPlan executável antes de implementar.

## Conteúdo obrigatório

- objetivo e resultado observável;
- contexto e documentos lidos;
- escopo e fora de escopo;
- decisões arquiteturais e alternativas rejeitadas;
- arquivos e módulos previstos;
- mudanças de banco e migrações;
- contratos de API e eventos;
- riscos de segurança, privacidade, gasto e direitos de imagem;
- estratégia de testes;
- plano de rollback;
- marcos pequenos com critérios de aceite;
- dependências externas e aprovações manuais;
- decisões pendentes do proprietário.

## Regra de execução

- Antes da aprovação do primeiro ExecPlan, não escrever código de produção.
- Após aprovação, manter o plano atualizado com progresso, decisões e desvios.
- Não misturar mais de um marco grande no mesmo diff.
- Criar checkpoint Git antes e depois de cada marco.
