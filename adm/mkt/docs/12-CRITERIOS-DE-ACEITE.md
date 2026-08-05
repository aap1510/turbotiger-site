# Critérios de aceite globais

## Fundação

- Usuário sem permissão não acessa nem aciona recurso restrito.
- Dados de organizações não se misturam.
- Nenhum segredo aparece no Git ou nos logs.
- Jobs duplicados não geram ação externa duplicada.

## Celebridade

- Ativo vencido ou não aprovado é bloqueado.
- Tráfego pago fora do território é bloqueado.
- Tráfego orgânico permitido sem restrição pode ser publicado, sujeito às demais regras.
- Alteração visual/voz/fala proibida é detectada por metadado e fluxo de aprovação.
- Vencimento cancela agenda futura conforme política.

## Campanhas

- Estrutura nasce pausada/rascunho.
- Sistema lê a configuração de volta.
- Divergência de território, orçamento, ativo ou conta impede ativação.
- Tetos e cooldowns são respeitados.
- Toda ação aparece na auditoria.

## Atendimento

- Webhook duplicado não duplica mensagem.
- IA não responde quando humano assumiu.
- Assunto sem base oficial escala para humano.
- Janela/regra específica do canal é respeitada.
- Origem do lead é preservada quando fornecida.

## IA

- Troca de provedor não altera a regra de negócio.
- Falha do provedor usa fallback quando permitido.
- Custo e tokens ficam registrados.
- Conteúdo malicioso de mensagem não consegue chamar ferramenta não autorizada.

## Operação

- Conector indisponível entra em retry e depois dead-letter.
- Token expirado gera alerta sem perda silenciosa.
- Dashboard mostra saúde e última sincronização.
- É possível desligar toda escrita externa por feature flag.
