# Campanhas por plataforma

## Contrato comum de conector

Cada conector deve declarar capacidades e implementar, quando suportado:

- listar contas;
- validar acesso e escopos;
- sincronizar campanhas e métricas;
- criar rascunho/estrutura pausada;
- atualizar campos autorizados;
- ativar/pausar;
- enviar criativos;
- consultar geografia e segmentação;
- verificar configuração criada;
- receber webhooks/eventos;
- informar limites e erros normalizados.

## Meta Ads

Estrutura nativa esperada:

```text
Campanha -> Conjunto de anúncios -> Criativo -> Anúncio
```

Regras:

- aproveitar MCP oficial quando ele for adequado e disponível;
- manter adaptador para Marketing API quando necessária;
- criar em estado pausado;
- validar página, conta, pixel/dataset, objetivo, público, orçamento, território e ativo;
- ler a estrutura criada antes de ativar.

## Google Ads e YouTube Ads

- Google Ads é o conector de mídia paga.
- YouTube orgânico é conector separado.
- Modelar diferenças entre campanha, grupo, grupo de recursos, anúncios e assets.
- Não presumir paridade com a Meta.

## TikTok Ads

- Conector separado para mídia paga.
- Publicação orgânica deve ser tratada por capacidade/API própria.

## AdMob

- Tratar principalmente monetização e relatórios internos do app.
- Não confundir com aquisição de usuários, que pertence ao Google Ads.

## Regras de automação

- modos por conta: leitura, rascunho, aprovação, automático, bloqueado;
- teto diário e mensal;
- percentual máximo de alteração;
- cooldown após mudança;
- amostra mínima antes de decisão;
- aprovação obrigatória para celebridade, região, público sensível ou novo objetivo;
- todas as ações com motivo e evidência.
