(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasVisaoGeral = {
    "legenda_ic_visao_geral_carteira_nao_atualizada": "Carteira não atualizada",
    "legenda_ic_visao_geral_tente_atualizar_novamente_o_resultado_das_rodadas_abaixo_nao_substitui_o_resultado_financeiro_d": "Tente atualizar novamente. O resultado das rodadas abaixo não substitui o resultado financeiro da carteira.",
    "legenda_ic_visao_geral_sua_carteira": "Sua carteira",
    "legenda_ic_visao_geral_nao_confirmado": "Não confirmado",
    "legenda_ic_visao_geral_depositos_registrados": "Depósitos registrados",
    "legenda_ic_visao_geral_valores_encontrados_no_historico_financeiro": "Valores encontrados no histórico financeiro",
    "legenda_ic_visao_geral_saques_registrados": "Saques registrados",
    "legenda_ic_visao_geral_saldo_consolidado": "Saldo consolidado",
    "legenda_ic_visao_geral_ultimo_saldo_conhecido_nao_e_consulta_bancaria_em_tempo_real": "Último saldo conhecido; não é consulta bancária em tempo real",
    "legenda_ic_visao_geral_resultado_financeiro": "Resultado financeiro",
    "legenda_ic_visao_geral_calculado_pela_carteira_separado_das_rodadas": "Calculado pela carteira, separado das rodadas",
    "legenda_ic_visao_geral_ha_contas_ou_saldos_sem_cobertura_completa_nao_calculamos_lucro_por_suposicao": "Há contas ou saldos sem cobertura completa. Não calculamos lucro por suposição.",
    "legenda_ic_visao_geral_visao_geral": "Visão Geral",
    "legenda_ic_visao_geral_seu_dia_suas_regras_e_os_fatos_que_merecem_atencao_agora": "Seu dia, suas regras e os fatos que merecem atenção agora.",
    "legenda_ic_visao_geral_ultima_atualizacao": "Última atualização: ",
    "legenda_ic_visao_geral_sua_central_esta_pronta": "Sua Central está pronta",
    "legenda_ic_visao_geral_ainda_nao_ha_rodadas_analisadas_nesta_conta_defina_suas_regras_e_consulte_os_dados_da_comunidad": "Ainda não há rodadas analisadas nesta conta. Defina suas regras e consulte os dados da Comunidade enquanto seu histórico é formado.",
    "legenda_ic_visao_geral_minhas_regras": "Minhas regras",
    "legenda_ic_visao_geral_conhecer_a_comunidade": "Conhecer a Comunidade",
    "legenda_ic_visao_geral_resultado_liquido": "Resultado líquido",
    "legenda_ic_visao_geral_hoje": "Hoje",
    "legenda_ic_visao_geral_tempo_total": "Tempo total",
    "legenda_ic_visao_geral_somando_todas_as_bets": "Somando todas as Bets",
    "legenda_ic_visao_geral_sessoes": "Sessões",
    "legenda_ic_visao_geral_rodadas": "Rodadas",
    "legenda_ic_visao_geral_capturadas": "Capturadas",
    "legenda_ic_visao_geral_limite_diario": "Limite diário",
    "legenda_ic_visao_geral_utilizado": "Utilizado",
    "legenda_ic_visao_geral_proxima_sessao": "Próxima sessão",
    "legenda_ic_visao_geral_nenhuma": "Nenhuma",
    "legenda_ic_visao_geral_lembrete_automatico_configurado": "Lembrete automático configurado",
    "legenda_ic_visao_geral_planeje_quando_fizer_sentido": "Planeje quando fizer sentido",
    "legenda_ic_visao_geral_resumo_de_hoje": "Resumo de hoje",
    "legenda_ic_visao_geral_atividade_registrada_nas_suas_contas": "Atividade registrada nas suas contas.",
    "legenda_ic_visao_geral_nenhuma_atividade_registrada_hoje": "Nenhuma atividade registrada hoje",
    "legenda_ic_visao_geral_seu_historico_continua_disponivel_abaixo_nenhuma_sessao_e_iniciada_ao_abrir_esta_tela": "Seu histórico continua disponível abaixo. Nenhuma sessão é iniciada ao abrir esta tela.",
    "legenda_ic_visao_geral_resultados_por_moeda": "Resultados por moeda",
    "legenda_ic_visao_geral_moedas_e_escalas_distintas_nao_sao_somadas_nem_convertidas_implicitamente": "Moedas e escalas distintas não são somadas nem convertidas implicitamente.",
    "legenda_ic_visao_geral_volume_apostado": "Volume apostado",
    "legenda_ic_visao_geral_financeiro_reconciliado": "Financeiro reconciliado",
    "legenda_ic_visao_geral_verifique_a_cobertura": "Verifique a cobertura",
    "legenda_ic_visao_geral_planejar_sessao": "Planejar sessão",
    "legenda_ic_visao_geral_ver_sessao_atual": "Ver sessão atual",
    "legenda_ic_visao_geral_abrir_historico": "Abrir histórico",
    "legenda_ic_visao_geral_preciso_parar": "Preciso parar",
    "legenda_ic_visao_geral_acoes_rapidas": "Ações rápidas",
    "legenda_ic_visao_geral_escolha_o_proximo_passo_de_forma_consciente": "Escolha o próximo passo de forma consciente.",
    "legenda_ic_visao_geral_sessoes_2": " sessões",
    "legenda_ic_visao_geral_ate": "até ",
    "legenda_ic_visao_geral_retorno_observado": "Retorno observado",
    "legenda_ic_visao_geral_historico_deste_jogo": "Histórico deste jogo",
    "legenda_ic_visao_geral_no_conjunto_analisado": "No conjunto analisado",
    "legenda_ic_visao_geral_premiacoes_relevantes": "Premiações relevantes",
    "legenda_ic_visao_geral_quantidade_com_retorno_5_10_20_50_100": "Quantidade com retorno ≥ 5× / 10× / 20× / 50× / 100×",
    "legenda_ic_visao_geral_perdas_disfarcadas_de_ganho": "Perdas disfarçadas de ganho",
    "legenda_ic_visao_geral_retorno_maior_que_zero_mas_menor_que_a_aposta": "Retorno maior que zero, mas menor que a aposta",
    "legenda_ic_visao_geral_seu_historico_analisado": "Seu histórico analisado",
    "legenda_ic_visao_geral_um_resumo_de_todas_as_rodadas_disponiveis_nesta_conta": "Um resumo de todas as rodadas disponíveis nesta conta.",
    "legenda_ic_visao_geral_exploratorio": "exploratório",
    "legenda_ic_visao_geral_historico_pessoal": "Histórico pessoal",
    "legenda_ic_visao_geral_os_numeros_descrevem_seus_registros_eles_nao_preveem_a_proxima_rodada": "Os números descrevem seus registros. Eles não preveem a próxima rodada.",
    "legenda_ic_visao_geral_em": "Em ",
    "legenda_ic_visao_geral_resultado_das_rodadas": "Resultado das rodadas",
    "legenda_ic_visao_geral_nao_representa_saldo_atual_nem_lucro_financeiro_reconciliado": "Não representa saldo atual nem lucro financeiro reconciliado",
    "legenda_ic_visao_geral_sessao_mediana": "Sessão mediana",
    "legenda_ic_visao_geral_metade_ficou_abaixo_e_metade_acima": "Metade ficou abaixo e metade acima",
    "legenda_ic_visao_geral_multiplicador_maximo": "Multiplicador máximo",
    "legenda_ic_visao_geral_maior_coeficiente_observado": "Maior coeficiente observado",
    "legenda_ic_visao_geral_premiacoes_100x": "Premiações ≥ 100x",
    "legenda_ic_visao_geral_eventos_extremos": "Eventos extremos",
    "legenda_ic_visao_geral_perdas_disfarcadas": "Perdas disfarçadas",
    "legenda_ic_visao_geral_retorno_parcial_com_perda_liquida": "Retorno parcial com perda líquida",
    "legenda_ic_visao_geral_retorno_total_elevado_pode_depender_de_poucos_premios_extremos_as_telas_de_estatisticas_e_comun": "Retorno total elevado pode depender de poucos prêmios extremos. As telas de Estatísticas e Comunidade mostram amostra, concentração e resultado sem o maior pagamento.",
    "legenda_ic_visao_geral_dentro_das_suas_regras": "Dentro das suas regras",
    "legenda_ic_visao_geral_exige_atencao": "Exige atenção",
    "legenda_ic_visao_geral_conflito_com_uma_regra": "Conflito com uma regra",
    "legenda_ic_visao_geral_dados_insuficientes": "Dados insuficientes",
    "legenda_ic_visao_geral_radar_da_sessao": "Radar da sessão",
    "legenda_ic_visao_geral_sem_contexto_atual_suficiente_para_avaliar_seus_limites_isso_nao_invalida_as_analises_do_seu_hi": "Sem contexto atual suficiente para avaliar seus limites. Isso não invalida as análises do seu histórico.",
    "legenda_ic_visao_geral_fato": "Fato",
    "legenda_ic_visao_geral_ainda_estamos_conhecendo_seu_padrao": "Ainda estamos conhecendo seu padrão",
    "legenda_ic_visao_geral_o_radar_sera_apresentado_quando_houver_contexto_confiavel": "O Radar será apresentado quando houver contexto confiável.",
    "legenda_ic_visao_geral_radar_antes_de_jogar": "Radar antes de jogar · ",
    "legenda_ic_visao_geral_avaliacao_baseada_em_limites_intervalo_sessoes_do_dia_e_qualidade_dos_dados": "Avaliação baseada em limites, intervalo, sessões do dia e qualidade dos dados.",
    "legenda_ic_visao_geral_insight": "Insight",
    "legenda_ic_visao_geral_entender": "Entender",
    "legenda_ic_visao_geral_ainda_nao_ha_insights_confiaveis": "Ainda não há insights confiáveis",
    "legenda_ic_visao_geral_fatos_pessoais_aparecerao_aqui_quando_atingirem_os_criterios_minimos_de_qualidade": "Fatos pessoais aparecerão aqui quando atingirem os critérios mínimos de qualidade.",
    "legenda_ic_visao_geral_insights_recentes": "Insights recentes",
    "legenda_ic_visao_geral_no_maximo_tres_fatos_priorizados_sempre_com_amostra_e_status": "No máximo três fatos priorizados, sempre com amostra e status.",
    "legenda_ic_visao_geral_disciplina": "Disciplina",
    "legenda_ic_visao_geral_reconhecimento_por_cumprir_seus_proprios_compromissos_nunca_por_apostar_mais": "Reconhecimento por cumprir seus próprios compromissos, nunca por apostar mais.",
    "legenda_ic_visao_geral_compromisso_respeitado": "Compromisso respeitado",
    "legenda_ic_visao_geral_evidencia": "Evidência",
    "legenda_ic_visao_geral_entenda_este_fato": "Entenda este fato",
    "legenda_ic_visao_geral_este_e_um_fato_descritivo_do_historico_resultados_anteriores_nao_indicam_nem_garantem_resultado": "Este é um fato descritivo do histórico. Resultados anteriores não indicam nem garantem resultados futuros."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasVisaoGeral);
  function legendaVisaoGeral(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasVisaoGeral[chave]; }

  IC.Screens["visao-geral"] = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var wallet = null, walletError = false, walletLoading = false, disposed = false;

    async function load(force) {
      await deps.loadBootstrap(force);
      if (disposed || walletLoading || (!force && wallet)) return;
      walletLoading = true;
      try {
        var response = await deps.api.rpc("ic_carteira_resumo_rpc", {}, { key: "overview:wallet" });
        if (!disposed) { wallet = response.data; walletError = false; }
      } catch (error) {
        if (!disposed && error.code !== "aborted" && error.code !== "stale_session") walletError = true;
      } finally {
        walletLoading = false;
        if (!disposed) deps.container.innerHTML = render();
      }
    }

    function renderWallet() {
      if (walletError) return UI.banner(legendaVisaoGeral("legenda_ic_visao_geral_carteira_nao_atualizada"), legendaVisaoGeral("legenda_ic_visao_geral_tente_atualizar_novamente_o_resultado_das_rodadas_abaixo_nao_substitui_o_resultado_financeiro_d"), "neutral");
      if (!wallet) return "";
      var rows = Core.normalizeArray(wallet.resumo).filter(function (item) { return item.moeda_conhecida === true; });
      if (!rows.length) return "";
      return ('<section><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_sua_carteira")) + '</h3><div class="ic-list">') + rows.map(function (item) {
        var definition = Core.currencyCatalog((current() || {}).data).find(function (entry) { return entry.code === item.moeda; });
        function money(value) {
          if (value == null || !definition) return legendaVisaoGeral("legenda_ic_visao_geral_nao_confirmado");
          return Core.formatMoney(Core.parseMoneyToUnitsText(String(value).replace(".", ","), definition.decimal_places), item.moeda, definition.decimal_places);
        }
        return '<article class="ic-card"><h4>' + Core.escapeHtml(item.moeda) + '</h4><div class="ic-summary-grid">' + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_depositos_registrados"), money(item.depositos_capturados), legendaVisaoGeral("legenda_ic_visao_geral_valores_encontrados_no_historico_financeiro")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_saques_registrados"), money(item.saques_capturados), legendaVisaoGeral("legenda_ic_visao_geral_valores_encontrados_no_historico_financeiro")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_saldo_consolidado"), money(item.saldo_total), legendaVisaoGeral("legenda_ic_visao_geral_ultimo_saldo_conhecido_nao_e_consulta_bancaria_em_tempo_real")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_resultado_financeiro"), item.resultado_parcial === true ? legendaVisaoGeral("legenda_ic_visao_geral_nao_confirmado") : money(item.resultado), legendaVisaoGeral("legenda_ic_visao_geral_calculado_pela_carteira_separado_das_rodadas")) + '</div>' + (item.resultado_parcial === true ? ('<p class="ic-required-note">' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_ha_contas_ou_saldos_sem_cobertura_completa_nao_calculamos_lucro_por_suposicao")) + '</p>') : '') + '</article>';
      }).join("") + '</div></section>';
    }

    function current() { return deps.store.getState().bootstrap; }

    function render() {
      var resource = current();
      var html = UI.sectionHeader(legendaVisaoGeral("legenda_ic_visao_geral_visao_geral"), legendaVisaoGeral("legenda_ic_visao_geral_seu_dia_suas_regras_e_os_fatos_que_merecem_atencao_agora"));
      if (!resource || resource.status === "loading") return html + UI.state({ type: "loading", retry: false });
      if (resource.status === "error") return html + UI.state({ type: resource.error && resource.error.code === "offline" ? "offline" : "error", message: resource.error && resource.error.message, meta: resource.updatedAt ? legendaVisaoGeral("legenda_ic_visao_geral_ultima_atualizacao") + Core.formatDateTime(resource.updatedAt) : null });
      var data = resource.data || {};
      var today = data.today || data.resumo_hoje || {};
      var currency = today.currency || today.moeda || "";
      var decimalPlaces = Core.decimalPlacesOf(today, null);
      var netUnits = Core.unitsFrom(today, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null);
      var netSign = Core.unitsSign(netUnits);
      var historical = data.historical_summary || data.resumo_historico || {};
      var hasHistory = Number((historical.overall || {}).rodadas || (historical.overall || {}).rounds || 0) > 0;
      if (!hasHistory) html += UI.banner(legendaVisaoGeral("legenda_ic_visao_geral_sua_central_esta_pronta"), legendaVisaoGeral("legenda_ic_visao_geral_ainda_nao_ha_rodadas_analisadas_nesta_conta_defina_suas_regras_e_consulte_os_dados_da_comunidad"), "neutral") + '<div class="ic-quick-actions">' + UI.button(legendaVisaoGeral("legenda_ic_visao_geral_minhas_regras"), { route: "regras-pausas", icon: "shield" }) + (deps.featureEnabled("ic_community_report_enabled") ? UI.button(legendaVisaoGeral("legenda_ic_visao_geral_conhecer_a_comunidade"), { route: "comunidade", icon: "community" }) : '') + '</div>';
      var metrics = [
        UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_resultado_liquido"), Core.formatSignedMoney(netUnits, currency, decimalPlaces), legendaVisaoGeral("legenda_ic_visao_geral_hoje"), netSign < 0 ? "negative" : netSign > 0 ? "positive" : "neutral"),
        UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_tempo_total"), Core.formatDuration(today.total_seconds || today.tempo_total_segundos || 0), legendaVisaoGeral("legenda_ic_visao_geral_somando_todas_as_bets")),
        UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_sessoes"), Core.safeText(today.sessions || today.sessoes || 0), legendaVisaoGeral("legenda_ic_visao_geral_hoje")),
        UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_rodadas"), Core.safeText(today.rounds || today.rodadas || 0), legendaVisaoGeral("legenda_ic_visao_geral_capturadas")),
        UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_limite_diario"), Core.formatPercent(today.daily_limit_percent == null ? today.limite_diario_percentual : today.daily_limit_percent), legendaVisaoGeral("legenda_ic_visao_geral_utilizado"))
      ];
      if (deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) metrics.push(UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_proxima_sessao"), today.next_plan_at || today.proximo_plano_em ? Core.formatDateTime(today.next_plan_at || today.proximo_plano_em, { weekday: "short", hour: "2-digit", minute: "2-digit" }) : legendaVisaoGeral("legenda_ic_visao_geral_nenhuma"), today.next_plan_at || today.proximo_plano_em ? legendaVisaoGeral("legenda_ic_visao_geral_lembrete_automatico_configurado") : legendaVisaoGeral("legenda_ic_visao_geral_planeje_quando_fizer_sentido")));
      html += '<div class="ic-page-stack">';
      html += renderWallet();
      var hasActivityToday = Number(today.rounds || today.rodadas || today.sessions || today.sessoes || 0) > 0;
      html += hasActivityToday ? ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_resumo_de_hoje")) + '</h3><p>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_atividade_registrada_nas_suas_contas")) + '</p></div></div><div class="ic-summary-grid">') + metrics.join("") + '</div></section>' : UI.banner(legendaVisaoGeral("legenda_ic_visao_geral_nenhuma_atividade_registrada_hoje"), legendaVisaoGeral("legenda_ic_visao_geral_seu_historico_continua_disponivel_abaixo_nenhuma_sessao_e_iniciada_ao_abrir_esta_tela"), "neutral");
      var ledgers = Core.normalizeArray(today.currency_subledgers || today.subledgers);
      if (ledgers.length) html += ('<section><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_resultados_por_moeda")) + '</h3><p>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_moedas_e_escalas_distintas_nao_sao_somadas_nem_convertidas_implicitamente")) + '</p><div class="ic-grid ic-grid--cards">') + ledgers.map(function (ledger) {
        var places = Core.decimalPlacesOf(ledger, null), amount = Core.unitsFrom(ledger, ["net_result_units"], null);
        return '<article class="ic-card"><h4>' + Core.escapeHtml(ledger.currency) + '</h4>' + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_resultado_liquido"), Core.formatSignedMoney(amount, ledger.currency, places)) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_volume_apostado"), Core.formatMoney(Core.unitsFrom(ledger, ["stake_volume_units", "volume_units"], null), ledger.currency, places)) + UI.badge(ledger.financial_complete === true ? legendaVisaoGeral("legenda_ic_visao_geral_financeiro_reconciliado") : legendaVisaoGeral("legenda_ic_visao_geral_verifique_a_cobertura"), ledger.financial_complete === true ? "complete" : "partial") + '</article>';
      }).join("") + '</div></section>';
      if (deps.featureEnabled("ic_historical_report_enabled")) html += renderHistoricalSummary(data.historical_summary || data.resumo_historico || {});
      if (deps.featureEnabled("ic_personal_insights_enabled") || deps.featureEnabled("ic_session_risk_enabled")) html += renderRadar(data.radar || data.radar_antes_jogar || {});
      if (deps.featureEnabled("ic_personal_insights_enabled")) html += renderInsights(data.insights || data.insights_recentes || []);
      if (deps.featureEnabled("ic_discipline_gamification_enabled")) html += renderDiscipline(data.discipline || data.disciplina || {});
      var actions = [];
      if (deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) actions.push(UI.button(legendaVisaoGeral("legenda_ic_visao_geral_planejar_sessao"), { route: "planejar", icon: "calendar" }));
      if (deps.featureEnabled("ic_live_clock_enabled")) actions.push(UI.button(legendaVisaoGeral("legenda_ic_visao_geral_ver_sessao_atual"), { route: "ao-vivo", icon: "live" }));
      if (deps.featureEnabled("ic_historical_report_enabled")) actions.push(UI.button(legendaVisaoGeral("legenda_ic_visao_geral_abrir_historico"), { route: "historico", icon: "history" }));
      if (deps.featureEnabled("ic_emergency_enabled")) actions.push(UI.button(legendaVisaoGeral("legenda_ic_visao_geral_preciso_parar"), { route: "regras-pausas", icon: "shield", kind: "danger" }));
      html += ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_acoes_rapidas")) + '</h3><p>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_escolha_o_proximo_passo_de_forma_consciente")) + '</p></div></div><div class="ic-quick-actions">') + actions.join("") + '</div></section></div>';
      return html;
    }

    function renderHistoricalSummary(summary) {
      var overall = summary.overall || {}, sessions = summary.sessions || {}, games = Core.normalizeArray(summary.games);
      if (!overall.rodadas && !overall.rounds) return "";
      var currency = overall.moeda || overall.currency || "BRL", places = Number(overall.casas == null ? 2 : overall.casas);
      var result = overall.resultado == null ? null : String(overall.resultado);
      var topGames = games.slice(0, 2).map(function (game) {
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(game.jogo || game.game) + '</h3><p>' + Core.formatNumber(game.rodadas || 0, 0) + ' rodadas · ' + Core.formatNumber(game.sessoes || 0, 0) + (Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_sessoes_2")) + '</p></div>') + UI.badge(legendaVisaoGeral("legenda_ic_visao_geral_ate") + Core.formatNumber(game.maior_multiplicador || 0) + "×", "neutral") + '</div><div class="ic-list">' + UI.listRow(legendaVisaoGeral("legenda_ic_visao_geral_retorno_observado"), legendaVisaoGeral("legenda_ic_visao_geral_historico_deste_jogo"), Core.formatPercent(game.rtp, 2)) + UI.listRow(legendaVisaoGeral("legenda_ic_visao_geral_resultado_liquido"), legendaVisaoGeral("legenda_ic_visao_geral_no_conjunto_analisado"), Core.formatSignedMoney(String(game.resultado), currency, places)) + UI.listRow(legendaVisaoGeral("legenda_ic_visao_geral_premiacoes_relevantes"), legendaVisaoGeral("legenda_ic_visao_geral_quantidade_com_retorno_5_10_20_50_100"), [game.m5, game.m10, game.m20, game.m50, game.m100].map(function (value) { return Core.formatNumber(value, 0); }).join(" / ")) + UI.listRow(legendaVisaoGeral("legenda_ic_visao_geral_perdas_disfarcadas_de_ganho"), legendaVisaoGeral("legenda_ic_visao_geral_retorno_maior_que_zero_mas_menor_que_a_aposta"), Core.formatNumber(game.perdas_disfarcadas || 0, 0)) + '</div></article>';
      }).join("");
      return ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_seu_historico_analisado")) + '</h3><p>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_um_resumo_de_todas_as_rodadas_disponiveis_nesta_conta")) + '</p></div>') + UI.badge(legendaVisaoGeral("legenda_ic_visao_geral_exploratorio"), "neutral") + '</div>' + UI.banner(legendaVisaoGeral("legenda_ic_visao_geral_historico_pessoal"), legendaVisaoGeral("legenda_ic_visao_geral_os_numeros_descrevem_seus_registros_eles_nao_preveem_a_proxima_rodada"), "neutral") + '<div class="ic-summary-grid">' + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_rodadas"), Core.formatNumber(overall.rodadas || overall.rounds, 0), legendaVisaoGeral("legenda_ic_visao_geral_em") + Core.safeText(overall.sessoes || 0) + legendaVisaoGeral("legenda_ic_visao_geral_sessoes_2")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_resultado_das_rodadas"), Core.formatSignedMoney(result, currency, places), legendaVisaoGeral("legenda_ic_visao_geral_nao_representa_saldo_atual_nem_lucro_financeiro_reconciliado"), Number(result) < 0 ? "negative" : "neutral") + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_sessao_mediana"), Core.formatSignedMoney(String(sessions.resultado_mediano || 0), currency, places), legendaVisaoGeral("legenda_ic_visao_geral_metade_ficou_abaixo_e_metade_acima")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_multiplicador_maximo"), Core.formatNumber(overall.maior_multiplicador || 0) + "×", legendaVisaoGeral("legenda_ic_visao_geral_maior_coeficiente_observado")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_premiacoes_100x"), Core.formatNumber(overall.m100 || 0, 0), legendaVisaoGeral("legenda_ic_visao_geral_eventos_extremos")) + UI.metric(legendaVisaoGeral("legenda_ic_visao_geral_perdas_disfarcadas"), Core.formatNumber(overall.perdas_disfarcadas || 0, 0), legendaVisaoGeral("legenda_ic_visao_geral_retorno_parcial_com_perda_liquida")) + '</div><div class="ic-grid ic-grid--cards">' + topGames + ('</div><div class="ic-disclaimer">' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_retorno_total_elevado_pode_depender_de_poucos_premios_extremos_as_telas_de_estatisticas_e_comun")) + '</div></section>');
    }

    function renderRadar(radar) {
      var status = radar.status || radar.estado || "insufficient_data";
      var tone = Core.statusTone(status);
      var titleMap = { control: legendaVisaoGeral("legenda_ic_visao_geral_dentro_das_suas_regras"), attention: legendaVisaoGeral("legenda_ic_visao_geral_exige_atencao"), high: legendaVisaoGeral("legenda_ic_visao_geral_conflito_com_uma_regra"), neutral: legendaVisaoGeral("legenda_ic_visao_geral_dados_insuficientes") };
      var facts = Core.normalizeArray(radar.facts || radar.fatos);
      if (!facts.length) return UI.banner(legendaVisaoGeral("legenda_ic_visao_geral_radar_da_sessao"), legendaVisaoGeral("legenda_ic_visao_geral_sem_contexto_atual_suficiente_para_avaliar_seus_limites_isso_nao_invalida_as_analises_do_seu_hi"), "neutral");
      var factHtml = facts.length ? '<div class="ic-list">' + facts.map(function (fact) { return UI.listRow(fact.label || fact.rotulo || legendaVisaoGeral("legenda_ic_visao_geral_fato"), fact.detail || fact.detalhe || "", fact.value || fact.valor || ""); }).join("") + '</div>' : UI.banner(legendaVisaoGeral("legenda_ic_visao_geral_ainda_estamos_conhecendo_seu_padrao"), radar.message || radar.mensagem || legendaVisaoGeral("legenda_ic_visao_geral_o_radar_sera_apresentado_quando_houver_contexto_confiavel"), "neutral");
      return '<section class="ic-card ic-card--raised"><div class="ic-radar"><div class="ic-radar__status"><div class="ic-radar__icon">' + UI.icon(tone === "control" ? "check" : tone === "neutral" ? "info" : "alert") + ('</div><div class="ic-radar__text"><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_radar_antes_de_jogar"))) + Core.escapeHtml(radar.title || radar.titulo || titleMap[tone] || titleMap.neutral) + '</h3><p>' + Core.escapeHtml(radar.summary || radar.resumo || legendaVisaoGeral("legenda_ic_visao_geral_avaliacao_baseada_em_limites_intervalo_sessoes_do_dia_e_qualidade_dos_dados")) + '</p></div></div>' + factHtml + (radar.behavioral_risk || radar.risco_comportamental ? UI.evidence(radar.evidence || radar.evidencia || {}) : '') + '</div></section>';
    }

    function renderInsights(insights) {
      var items = Core.normalizeArray(insights).slice(0, 3);
      if (!items.length) return "";
      var body = items.length ? '<div class="ic-grid ic-grid--cards">' + items.map(function (item, index) {
        var kind = item.kind || item.tipo || "quality";
        return '<article class="ic-card ic-insight ic-insight--' + Core.escapeHtml(kind === "positive" || kind === "disciplina" ? "positive" : kind === "risk" || kind === "risco" ? "risk" : "quality") + '"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || legendaVisaoGeral("legenda_ic_visao_geral_insight")) + '</h3><p>' + Core.escapeHtml(item.message || item.mensagem || "") + '</p></div>' + UI.badge(item.evidence_status || item.status_evidencia || "descritivo", item.evidence_status || item.status_evidencia) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + UI.button(legendaVisaoGeral("legenda_ic_visao_geral_entender"), { action: "understand", value: index, icon: "info" }) + '</div></article>';
      }).join("") + '</div>' : UI.state({ type: "insufficient_data", title: legendaVisaoGeral("legenda_ic_visao_geral_ainda_nao_ha_insights_confiaveis"), message: legendaVisaoGeral("legenda_ic_visao_geral_fatos_pessoais_aparecerao_aqui_quando_atingirem_os_criterios_minimos_de_qualidade"), retry: false });
      return ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_insights_recentes")) + '</h3><p>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_no_maximo_tres_fatos_priorizados_sempre_com_amostra_e_status")) + '</p></div></div>') + body + '</section>';
    }

    function renderDiscipline(discipline) {
      var items = Core.normalizeArray(discipline.items || discipline.itens || discipline.achievements || discipline.conquistas);
      if (!items.length) return "";
      return ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_disciplina")) + '</h3><p>' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_reconhecimento_por_cumprir_seus_proprios_compromissos_nunca_por_apostar_mais")) + '</p></div></div><div class="ic-grid ic-grid--cards">') + items.slice(0, 3).map(function (item) { return '<article class="ic-card"><h3>' + Core.escapeHtml(item.title || item.titulo || legendaVisaoGeral("legenda_ic_visao_geral_compromisso_respeitado")) + '</h3><p>' + Core.escapeHtml(item.message || item.mensagem || "") + '</p>' + UI.evidence(item.evidence || item.evidencia || item) + '</article>'; }).join("") + '</div></section>';
    }

    function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "understand") {
        var data = current() && current().data || {};
        var item = Core.normalizeArray(data.insights)[Number(value)];
        if (!item) return;
        UI.openSheet({ eyebrow: item.evidence_status || item.status_evidencia || legendaVisaoGeral("legenda_ic_visao_geral_evidencia"), title: item.title || item.titulo || legendaVisaoGeral("legenda_ic_visao_geral_entenda_este_fato"), html: UI.banner(item.title || item.titulo || legendaVisaoGeral("legenda_ic_visao_geral_insight"), item.explanation || item.explicacao || item.message || item.mensagem || "", item.kind || item.tipo) + UI.evidence(item.evidence || item.evidencia || item) + ('<div class="ic-disclaimer">' + Core.escapeHtml(legendaVisaoGeral("legenda_ic_visao_geral_este_e_um_fato_descritivo_do_historico_resultados_anteriores_nao_indicam_nem_garantem_resultado")) + '</div>') });
      }
    }

    return { render: render, load: load, handleAction: handleAction, dispose: function () { disposed = true; wallet = null; } };
  };
}(window));
