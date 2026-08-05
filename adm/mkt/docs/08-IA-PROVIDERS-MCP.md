# IA, provedores, ferramentas e MCP

## Objetivo

Permitir trocar ou combinar OpenAI, Anthropic e futuros provedores sem alterar os módulos de negócio.

## AI Gateway

Contrato mínimo:

- generateText;
- generateStructured;
- analyzeImage;
- moderate/validate;
- toolCalling;
- embeddings/retrieval quando necessário;
- usage/cost reporting;
- timeout, retry e fallback.

## Roteamento por tarefa

Exemplos:

- estratégia;
- legenda;
- roteiro;
- revisão de compliance;
- classificação de mensagem;
- resposta ao lead;
- análise de desempenho;
- geração de imagem/vídeo por provedor específico.

Cada tarefa pode ter provedor principal, modelo, fallback, teto de custo, timeout e necessidade de segunda revisão.

## Ferramentas

A IA não recebe credenciais de plataforma. Ela recebe ferramentas internas de alto nível, como:

- analyze_performance;
- propose_campaign;
- create_campaign_draft;
- validate_asset_rights;
- validate_territory;
- schedule_content;
- draft_reply;
- send_approved_reply;
- pause_campaign;
- request_approval.

Todas passam por autenticação, RBAC, Policy Engine e auditoria.

## MCP

O sistema pode consumir MCPs oficiais e também expor um MCP próprio. O MCP próprio deve apresentar somente ferramentas seguras e sem acesso irrestrito às APIs.

## Proteção contra prompt injection

- Mensagens, comentários, e-mails, legendas importadas e páginas externas são dados não confiáveis.
- Nunca permitir que esse conteúdo sobrescreva instruções do sistema.
- Separar dados de usuário, base de conhecimento e políticas.
- Restringir ferramentas por tarefa e por papel.
- Exigir aprovação para ações de escrita de alto impacto.
