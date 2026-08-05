# Decisões confirmadas e referências do ecossistema

## Identidade oficial

- Projeto: **MKT Digital**.
- Diretório oficial: `C:\AAP\BET\ProjetoTurboTiger\TurboTiger Codex\turbotiger-site\adm\mkt`.
- Natureza: sistema web/backend de marketing digital do Turbo Tiger, separado do aplicativo Delphi/FireMonkey.

## Banco e infraestrutura

- O MKT Digital usará o mesmo projeto Supabase já utilizado pelo aplicativo Turbo Tiger.
- Todos os objetos próprios do módulo ficarão no schema exclusivo `mod_mkt`.
- A infraestrutura Supabase compartilhada, o vínculo do projeto e as migrations físicas permanecem na raiz principal do workspace.
- CLI obrigatória: `C:\AAP\BET\ProjetoTurboTiger\TurboTiger Codex\tools\supabase-cli\supabase.exe`.
- Não usar `supabase db push` sem solicitação explícita e não aplicar migrations não relacionadas.
- Integrações com usuários, assinaturas, lista de espera ou outros dados existentes serão definidas por contratos explícitos, RPCs/views autorizadas, auditoria e menor privilégio.
- O módulo não deve misturar suas tabelas com schemas existentes nem consultar tabelas grandes do app de forma ampla ou repetitiva.

## Referências incorporadas

Foram considerados o `AGENTS.md` principal e os materiais de `docs\_referencias`, incluindo contexto estratégico, continuidade técnica, história, finanças, aquisição, benchmarking, módulos futuros, indicação/MMN e governança societária.

As referências confirmam como diretrizes relevantes para o MKT Digital:

- foco em CAC, LTV, churn, conversão, retenção e atribuição mensurável;
- aquisição multicanal com tráfego pago, indicação, influenciadores e remarketing;
- crescimento e orçamento liberados por validação real, não apenas por projeções;
- proteção da marca, reputação, propriedade intelectual, dados e acesso ao código;
- autonomia técnica do proprietário e auditoria das decisões;
- preservação de contexto para módulos futuros, sem misturá-los ao MVP atual;
- uso de informações financeiras e metas como hipóteses de planejamento, não como garantias.

## Prevalência do posicionamento atual

Alguns documentos históricos usam linguagem sobre lucro, performance, aumento de banca ou “apostar melhor”. Essa linguagem é legado e não deve ser usada em campanhas ou conteúdo atual.

Prevalece o reposicionamento oficial de 21/07/2026:

> O Turbo Tiger não foi criado para incentivar apostas. Foi criado para incentivar o controle e o jogo responsável.

Toda comunicação do MKT Digital deve apresentar o Turbo Tiger como plataforma premium de tecnologia para controle financeiro, organização, histórico, estatísticas, alertas responsáveis, controle emocional e decisões conscientes. Não pode prometer ganhos, resultados, recuperação de perdas ou incentivar apostas.

## Segredos e dados sensíveis

O arquivo `docs\_referencias\99_SEGREDOS_OPERACIONAIS_EMERGENCIA.md` é somente uma fonte local de recuperação emergencial. Nenhum valor dele deve ser copiado para este diretório, documentação, Git, logs ou conversas. O MKT Digital registra apenas nomes de variáveis e usa segredos fornecidos diretamente pelo ambiente/cofre autorizado.
