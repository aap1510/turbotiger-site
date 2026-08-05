# MKT Digital - pacote inicial para o Codex

Este repositório contém a especificação inicial para construir um painel administrativo e uma plataforma de automação de marketing, tráfego pago, conteúdo, atendimento omnichannel e CRM do Turbo Tiger.

## Decisões oficiais

- Nome do projeto: **MKT Digital**.
- Diretório oficial: `C:\AAP\BET\ProjetoTurboTiger\TurboTiger Codex\turbotiger-site\adm\mkt`.
- Banco: mesmo projeto Supabase já usado pelo aplicativo Turbo Tiger.
- Schema exclusivo do módulo: `mod_mkt`.
- CLI Supabase: `C:\AAP\BET\ProjetoTurboTiger\TurboTiger Codex\tools\supabase-cli\supabase.exe`.
- O MKT Digital não altera o aplicativo Delphi e não duplica a infraestrutura Supabase existente.

## Como começar

1. Extraia esta pasta e transforme-a em um repositório Git privado.
2. Abra a raiz no VS Code com a extensão Codex, no Codex Desktop ou no Codex CLI.
3. Não coloque chaves reais no repositório. Use somente `.env.example` e um gerenciador de segredos.
4. Inicie o Codex em modo de planejamento.
5. Cole o conteúdo de `prompts/00-PROMPT-MESTRE-PLANEJAMENTO.md`.
6. Exija que o Codex entregue e aguarde aprovação do plano antes de escrever código.
7. Depois da aprovação, execute uma fase por vez usando os prompts da pasta `prompts/`.

## Regra essencial

Não peça "faça tudo" em uma única execução. O projeto deve ser implementado por marcos pequenos, testáveis, versionados e reversíveis.

## Resultado de MVP recomendado

A primeira versão utilizável deve priorizar:

- painel administrativo;
- autenticação, usuários e permissões;
- biblioteca de mídia;
- celebridades, contratos e territórios;
- Policy Engine;
- IA configurável por provedor;
- Meta Ads em leitura e criação de rascunhos pausados;
- Instagram/Facebook orgânico;
- WhatsApp, Instagram Direct e Facebook Messenger;
- caixa de entrada unificada e CRM;
- auditoria completa.

Google, YouTube, TikTok e AdMob entram por conectores independentes nas fases posteriores, sem alterar o núcleo.
