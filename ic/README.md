# Central de Inteligência de Cassino

Central app-only do módulo `mod_ic`, construída no mesmo padrão técnico e visual da Central de Inteligência Esportiva.

O produto não tenta prever a próxima rodada. A interface organiza fatos determinísticos, planejamento, controle ao vivo, histórico, evidência estatística e regras pessoais para ajudar o usuário a cumprir decisões tomadas antes da sessão.

## Arquitetura

A Central é estática e não possui etapa de bundle:

- HTML sem framework;
- CSS próprio com namespace `ic-*`;
- JavaScript modular em IIFEs;
- nenhuma dependência de runtime externa;
- ícones SVG locais;
- chamadas somente às fachadas autenticadas `public.ic_*` por `/rest/v1/rpc/*`;
- token recebido do aplicativo e mantido somente em memória.

Ordem de carregamento:

1. `ic-core.js` — validação, normalização e formatação;
2. `ic-store.js` — sessão e estado efêmero;
3. `ic-router.js` — rota interna sem informações sensíveis;
4. `ic-bridge.js` — bridge exclusiva `TurboTigerICBridge`;
5. `ic-api.js` — cliente das fachadas `ic_*`;
6. `ic-components.js` — componentes HTML acessíveis;
7. `ic-live-channel.js` — invalidação privada em tempo real;
8. `ic-clock.js` — apresentação determinística do relógio;
9. dez módulos de tela;
10. `ic-app.js` — composição, navegação e ciclo de sessão.

Não há cache autenticado no navegador. Troca de conta, logout ou renovação nativa invalidam requisições em andamento e zeram o estado em memória.

## Acesso app-only

A página exige simultaneamente:

- documento HTTPS na origem canônica exata `https://turbotiger.com.br`, sob `/ic`;
- interface JavaScript `TurboTigerICBridge`;
- sessão fornecida pelo aplicativo.

Sem esses requisitos, nenhuma fachada é consultada e somente o estado de acesso bloqueado é exibido. Não existe parâmetro de demonstração, sessão simulada ou modo funcional para navegador comum.

Mensagens página → aplicativo:

- `session_request`;
- `central_ready`;
- `close`;
- `session_control_action`;
- `emergency_action`;
- `reminder_local_sync`.

`reminder_local_sync` é emitida somente depois de uma mutação confirmada no
backend e sempre contém `delivery_id`, `reminder_id`, `plan_id`, `revision`,
`local_token`, além da operação `schedule` ou `cancel`. `scheduled_at` é
obrigatório em `schedule` e é `null` quando não se aplica a `cancel`. Se a
fachada não devolver esse contrato completo, a página não solicita uma operação
nativa parcial. O `local_token` é uma capacidade opaca mantida apenas em memória:
o aplicativo não deve registrá-la em log nem conservá-la depois do ACK.

Depois de agendar ou cancelar no sistema operacional, o aplicativo deve registrar
o resultado pela fachada autenticada
`ic_lembrete_local_confirmar_rpc(p_id_entrega, p_id_lembrete, p_revisao,
p_token_local, p_status, p_agendado_para, p_erro)`. A página não considera a
chamada da bridge como confirmação de entrega.

Entradas aplicativo → página:

- `TurboTigerICReceiveSession(base64Json)`;
- `TurboTigerICClearSession()`;
- `TurboTigerICRefresh()`;
- `TurboTigerICHandleBack()`;
- `TurboTigerICNativeBridgeReady()`;
- `TurboTigerICOpenSection(base64Json)`.

`TurboTigerICOpenSection` aceita somente o destino `estatisticas` e o contrato
determinístico `{section, id_assinatura_estatistica, id_insight_evidencia?,
escopo_estatistico, direcao_historica, fonte_efetiva, ocorrencia_inicio?,
ocorrencia_fim?, versao_regra}`. Ele abre o detalhe do lembrete de padrão sem
criar ou iniciar uma sessão. A origem exibida é sempre `fonte_efetiva`, não a
preferência original da assinatura.

No Android, `TurboTigerICBridge.post` é a interface nativa. No iOS, quando essa
função não está disponível, o aplicativo injeta exclusivamente no documento já
autorizado o marcador `TurboTigerICBridge.nativeApp === true` e chama
`TurboTigerICNativeBridgeReady()`. Nesse caso, a página usa somente o transporte
interno `turbotiger-ic://bridge?payload=<JSON codificado>`, limitado a 32 KiB. O
aplicativo intercepta e cancela essa navegação, revalida a URL HTTPS canônica e
decodifica o contrato; navegador comum, outro host e outra rota continuam sem
transporte e sem acesso funcional.

O contrato nativo está preparado em `UTurboICWebView.pas`, `UInteligenciaCassino.pas`, `UInicial.pas` e nas fontes `TurboIC*.java`. Isso não significa que os artefatos Android já foram regenerados ou que houve aprovação em aparelho. A bridge da Inteligência Esportiva não é reaproveitada porque possui outra autoridade e outro prefixo de URL.

O fechamento atual foi limitado pelo usuário ao Android. O código iOS já preparado permanece, mas não será ampliado nem testado agora e não deve ser apresentado como suporte validado.

## Telas

1. Visão Geral;
2. Planejar;
3. Ao Vivo;
4. Meu Histórico;
5. Estatísticas, incluindo Laboratório;
6. Jogos e Passaporte Matemático;
7. Comunidade;
8. Regras e Pausas;
9. Tiger Coach;
10. Configurações.

Toda área possui estados explícitos de carregamento, vazio, offline, amostra insuficiente, qualidade insuficiente, erro, última atualização e nova tentativa.

## Fachadas esperadas

As fachadas modernas estão definidas nas migrations locais do pacote IC. Sua existência local não comprova aplicação remota. A interface falha de forma explícita quando o backend não oferece o contrato esperado e não usa nenhuma RPC preditiva legada. Consulte o manifesto e os registros de testes antes de publicar.

Leituras principais:

```text
ic_contexto_rpc
ic_planejamentos_listar_rpc
ic_sessao_estado_ao_vivo_rpc
ic_historico_listar_rpc
ic_estatisticas_rpc
ic_risco_comportamental_rpc
ic_exposicao_continua_rpc
ic_jogos_listar_rpc
ic_passaporte_jogo_rpc
ic_relatorio_comunidade_rpc
ic_regras_contexto_rpc
ic_coach_contexto_rpc
ic_configuracoes_contexto_rpc
```

Mutações utilizadas:

```text
ic_sessao_planejar_rpc
ic_sessao_reagendar_rpc
ic_sessao_iniciar_rpc
ic_sessao_cancelar_rpc
ic_sessao_pausar_rpc
ic_sessao_encerrar_rpc
ic_sessao_retomar_rpc
ic_serie_planejada_criar_rpc
ic_serie_planejada_editar_rpc
ic_serie_planejada_pausar_rpc
ic_serie_planejada_retomar_rpc
ic_serie_planejada_cancelar_rpc
ic_hipotese_notificacao_rpc
ic_regra_salvar_rpc
ic_regra_alteracao_confirmar_rpc
ic_regra_alteracao_cancelar_rpc
ic_simular_sessao_rpc
ic_emergencia_acionar_rpc
ic_configuracoes_salvar_rpc
```

As explicações do Coach não são uma RPC Postgres. A tela chama exclusivamente a Edge Function autenticada `ic-coach` com:

```json
{
  "request_type": "explain_session_state",
  "reference_id": 123
}
```

Não há campo de pergunta livre. A Edge Function resolve o usuário pelo token, busca `ic_coach_contexto_rpc`, monta o envelope determinístico e valida fatos, números e ações antes de responder.

Cada função deverá:

- resolver o usuário exclusivamente por `auth.uid()`;
- rejeitar IDs de outro usuário;
- usar `search_path` seguro e objetos qualificados;
- retornar envelope versionado;
- paginar listas;
- nunca expor tabelas internas;
- fornecer amostra, qualidade, status e atualização quando aplicável.

O canal realtime é somente sinal de invalidação. Após o sinal, a Central reconcilia o estado pela fachada autenticada; o broadcast não é autoridade financeira.

## Sessão Planejada

Os campos obrigatórios são:

- data e horário futuros;
- duração máxima;
- limite máximo de perda;
- moeda;
- momento do lembrete.

Offsets permitidos: no horário, 5, 10, 15 ou 30 minutos antes. Não existe opção para remover o lembrete. A configuração de notificações escolhe apenas o canal local, remoto ou híbrido. Abrir o lembrete nunca inicia a sessão.

Uma série recorrente materializa ocorrências normais com data e lembrete. Seu contrato é estruturado: dia ISO da semana, ordinal mensal ou dias/intervalo de semanas, fuso IANA e revisão periódica. A interface e o SQL usam `gap_shift_forward_fold_later_v1`: horário inexistente avança pela lacuna; horário ambíguo usa a ocorrência posterior. O fuso do aparelho não substitui o fuso do compromisso. Edição, pausa e cancelamento preservam os fatos passados.

O término permanece `starts_at + duration_minutes`. Iniciar tarde reduz o tempo disponível; pausar não estende o compromisso. Série planejada e assinatura estatística são entidades diferentes.

## Proteção e precisão

- Dinheiro é texto em unidades mínimas, acompanhado de moeda e escala declaradas. Ausência não é zero nem BRL presumido.
- Moedas/precisões diferentes possuem livros separados. Pico e drawdown globais seguem a trajetória cronológica consolidada, não a soma de picos individuais.
- Regras pessoais têm campos tipados. Reduções/fortalecimento valem imediatamente; aumentos/desativação/enfraquecimento exigem reflexão e confirmação fora de sessão.
- O Modo Firme depende da autoridade do backend e de comandos nativos com ACK. A Central não consegue fechar uma Bet por conta própria.
- A captura nativa pendente não é somada ao resultado autoritativo. A reconciliação exige a chave exata e o conteúdo vigente da feature; o watermark máximo sozinho não confirma eventos.
- No nativo, a perda de reconciliação prolongada em Modo Firme gera bloqueio defensivo, não uma declaração de perda monetária inventada.
- Simulações exibem amostra, versão e limites de interpretação. Evidência insuficiente retorna estado explícito; não vira probabilidade zero.

## Modelos de proteção nas Estatísticas

A área **Risco da sessão** consulta `ic_risco_comportamental_rpc` e exige o
contrato `ic_behavioral_risk_v1`. A probabilidade só aparece com elegibilidade,
validação fora da amostra e intervalo consistente. Sessões observadas sem um
plano confirmado não recebem um limite inventado para treinar o modelo.

A área **Banca** consulta `ic_exposicao_continua_rpc` e exige
`ic_continuous_exposure_v1`. O formulário envia somente `p_id_jogo`,
`p_exposicao_pct` e `p_risco_maximo`; este último é uma fração entre 0 e 1.
Nenhum deles altera aposta, saldo, regra pessoal ou planejamento. O resultado
separa proporção histórica observada, estimativa liberada, suporte, censura,
limiar de perda, horizonte, origem e versão. Uma adequação numérica exige
parâmetros explícitos, suporte e intervalo; 0,5% é referência em análise,
nunca um ótimo garantido.

Falhas dessas consultas têm estado próprio e não substituem os relatórios
descritivos já disponíveis. Mudança de área ou logout descarta resultados em
voo. Esses modelos não determinam a cor do relógio nem liberam limites.

No Passaporte, cada recorte mantém Bet, versão, fonte, moeda e precisão. O
retorno bruto de free spins é dinheiro (`bonus_return_units`), não percentual.
RTP apenas pago não é comparado a um total que inclua bônus sem atribuição
auditável do ciclo. A simulação exige distribuição elegível e informa sua Bet
e versão efetivas; prêmios raros não observados continuam desconhecidos.

## Lembretes de padrões históricos

O sino de Estatísticas, Histórico e Comunidade cria uma assinatura dinâmica,
independente da Sessão Planejada. O usuário escolhe `pessoal`, `comunidade` ou
`ambos`; não informa data nem horário. A preferência é salva de forma explícita
e idempotente por `ic_hipotese_notificacao_rpc(p_id_insight_evidencia,
p_escopo_estatistico, p_ativa)`. O identificador é o UUID da evidência específica;
a página não envia direção, recorrência, dia ou faixa horária, pois esses dados
são derivados pelo backend da regra temporal elegível e versionada.

Cada ocorrência entregue deve trazer a direção histórica e a fonte efetivamente
usada. Quando a opção é `ambos`, uma célula comunitária inelegível é suprimida e
o aviso identifica somente o histórico pessoal. A Central nunca infere, completa
ou anuncia uma origem comunitária ausente. O texto é descritivo e não sugere que
o padrão prevê a próxima rodada ou que define um horário para jogar.

## Testes

Executar a suíte estática e os contratos puros:

```powershell
node --test tests/ic/*.test.cjs tests/ic/*.test.mjs
```

Também validar sintaxe:

```powershell
Get-ChildItem turbotiger-site/ic/assets -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Navegadores comuns só podem validar o estado bloqueado. A experiência funcional, bridge, sessão, retorno, suspensão e reconciliação precisam de teste na WebView dedicada do aplicativo.

`tests/ic/browser-gate.local.mjs` executa somente essa prova negativa em servidor local, usando um runtime Playwright já disponível indicado por `IC_PLAYWRIGHT_MODULE`. Não cria sessão, bridge ou acesso funcional de navegador.

## Publicação

Estes arquivos são somente locais. A publicação é realizada manualmente pelo responsável pelo projeto. Ao publicar, atualizar de forma coordenada os sufixos `?v=` de CSS e JavaScript para evitar cache misto.
