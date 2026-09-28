(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasAoVivo = {
    "legenda_ic_ao_vivo_ao_vivo": "Ao Vivo",
    "legenda_ic_ao_vivo_durante_a_sessao_o_foco_e_cumprir_a_decisao_tomada_antes_sem_previsao_de_rodada": "Durante a sessão, o foco é cumprir a decisão tomada antes — sem previsão de rodada.",
    "legenda_ic_ao_vivo_protecao_ativa": "Proteção ativa",
    "legenda_ic_ao_vivo_o_acesso_as_bets_dentro_do_turbo_tiger_esta_bloqueado_pelo_seu_compromisso": "O acesso às Bets dentro do Turbo Tiger está bloqueado pelo seu compromisso",
    "legenda_ic_ao_vivo_ate": " até ",
    "legenda_ic_ao_vivo_enquanto_o_estado_e_validado": " enquanto o estado é validado",
    "legenda_ic_ao_vivo_isso_nao_bloqueia_navegadores_ou_aparelhos_externos": ". Isso não bloqueia navegadores ou aparelhos externos.",
    "legenda_ic_ao_vivo_nenhuma_sessao_em_andamento": "Nenhuma sessão em andamento",
    "legenda_ic_ao_vivo_quando_uma_sessao_for_iniciada_pelo_botao_de_confirmacao_o_controle_ao_vivo_aparecera_aqui": "Quando uma sessão for iniciada pelo botão de confirmação, o controle ao vivo aparecerá aqui.",
    "legenda_ic_ao_vivo_ver_sessoes_planejadas": "Ver Sessões Planejadas",
    "legenda_ic_ao_vivo_detalhes_ocultos": "Detalhes ocultos",
    "legenda_ic_ao_vivo_o_relogio_e_os_controles_essenciais_continuam_visiveis": "O relógio e os controles essenciais continuam visíveis.",
    "legenda_ic_ao_vivo_alertas_ativos": "Alertas ativos",
    "legenda_ic_ao_vivo_alerta_de_controle": "Alerta de controle",
    "legenda_ic_ao_vivo_o_que_esta_acontecendo": "O que está acontecendo",
    "legenda_ic_ao_vivo_as_metricas_financeiras_aguardam_reconciliacao_da_captura": "As métricas financeiras aguardam reconciliação da captura.",
    "legenda_ic_ao_vivo_metricas_financeiras_indisponiveis": "Métricas financeiras indisponíveis",
    "legenda_ic_ao_vivo_nenhum_valor_parcial_sera_apresentado_como_resultado_completo": "Nenhum valor parcial será apresentado como resultado completo.",
    "legenda_ic_ao_vivo_resultado_liquido": "Resultado líquido",
    "legenda_ic_ao_vivo_sessao_inteira": "Sessão inteira",
    "legenda_ic_ao_vivo_volume_apostado": "Volume apostado",
    "legenda_ic_ao_vivo_exposicao_acumulada": "Exposição acumulada",
    "legenda_ic_ao_vivo_aposta_atual": "Aposta atual",
    "legenda_ic_ao_vivo_aposta_media": "Aposta média",
    "legenda_ic_ao_vivo_banca_por_rodada": "Banca por rodada",
    "legenda_ic_ao_vivo_indisponivel": "Indisponível",
    "legenda_ic_ao_vivo_exige_saldo_validado": "Exige saldo validado",
    "legenda_ic_ao_vivo_rodadas": "Rodadas",
    "legenda_ic_ao_vivo_ritmo": "Ritmo",
    "legenda_ic_ao_vivo_rpm": " rpm",
    "legenda_ic_ao_vivo_sequencia": "Sequência",
    "legenda_ic_ao_vivo_perdas": " perdas",
    "legenda_ic_ao_vivo_pico": "Pico",
    "legenda_ic_ao_vivo_devolucao": "Devolução ",
    "legenda_ic_ao_vivo_saldo_resultado_e_volume_sao_tratados_separadamente": "Saldo, resultado e volume são tratados separadamente.",
    "legenda_ic_ao_vivo_risco_da_sessao_indisponivel": "Risco da sessão indisponível",
    "legenda_ic_ao_vivo_risco_de_atingir_o_limite": "Risco de atingir o limite",
    "legenda_ic_ao_vivo_estimativa_da_sessao_nunca_da_proxima_rodada": "Estimativa da sessão, nunca da próxima rodada.",
    "legenda_ic_ao_vivo_probabilidade_estimada": "Probabilidade estimada",
    "legenda_ic_ao_vivo_sessao_global_por_moeda": "Sessão Global por moeda",
    "legenda_ic_ao_vivo_pico_e_drawdown_seguem_a_ordem_real_dos_eventos_nao_somamos_os_picos_individuais_das_bets": "Pico e drawdown seguem a ordem real dos eventos. Não somamos os picos individuais das Bets.",
    "legenda_ic_ao_vivo_moeda_nao_identificada": "Moeda não identificada",
    "legenda_ic_ao_vivo_livro_financeiro_parcial_resultado_pico_e_drawdown_nao_sao_apresentados_como_completos": "Livro financeiro parcial. Resultado, pico e drawdown não são apresentados como completos.",
    "legenda_ic_ao_vivo_volume": "Volume",
    "legenda_ic_ao_vivo_retorno_pago": "Retorno pago",
    "legenda_ic_ao_vivo_retorno_de_bonus": "Retorno de bônus",
    "legenda_ic_ao_vivo_devolucao_2": "Devolução",
    "legenda_ic_ao_vivo_drawdown_maximo": "Drawdown máximo",
    "legenda_ic_ao_vivo_integridade_estatistica": "Integridade estatística",
    "legenda_ic_ao_vivo_status_calculado_por_versao_plataforma_e_qualidade_de_captura": "Status calculado por versão, plataforma e qualidade de captura.",
    "legenda_ic_ao_vivo_bet": "Bet",
    "legenda_ic_ao_vivo_jogo": "Jogo",
    "legenda_ic_ao_vivo_conta": "Conta",
    "legenda_ic_ao_vivo_captura_desconhecida": "captura desconhecida",
    "legenda_ic_ao_vivo_ultima_rodada": " · última rodada ",
    "legenda_ic_ao_vivo_sem_contexto_ativo": "Sem contexto ativo",
    "legenda_ic_ao_vivo_nenhuma_bet_ou_jogo_foi_identificado_nesta_sessao": "Nenhuma Bet ou jogo foi identificado nesta sessão.",
    "legenda_ic_ao_vivo_contextos_ativos": "Contextos ativos",
    "legenda_ic_ao_vivo_visao_consolidada_da_sessao_global": "Visão consolidada da Sessão Global.",
    "legenda_ic_ao_vivo_timeline": "Timeline",
    "legenda_ic_ao_vivo_oculta_enquanto_a_cobertura_financeira_estiver_incompleta": "Oculta enquanto a cobertura financeira estiver incompleta.",
    "legenda_ic_ao_vivo_timeline_aguardando_reconciliacao": "Timeline aguardando reconciliação",
    "legenda_ic_ao_vivo_rodadas_parciais_nao_serao_apresentadas_como_uma_sequencia_completa": "Rodadas parciais não serão apresentadas como uma sequência completa.",
    "legenda_ic_ao_vivo_as_ultimas_rodadas_validas_da_sessao": "As últimas rodadas válidas da sessão.",
    "legenda_ic_ao_vivo_nenhuma_rodada_capturada": "Nenhuma rodada capturada",
    "legenda_ic_ao_vivo_o_relogio_de_tempo_pode_continuar_mas_o_financeiro_nao_ficara_verde_sem_captura_confiavel": "O relógio de tempo pode continuar, mas o financeiro não ficará verde sem captura confiável.",
    "legenda_ic_ao_vivo_timeline_compacta": "Timeline compacta",
    "legenda_ic_ao_vivo_retorno_parcial_continua_sendo_perda_liquida": "Retorno parcial continua sendo perda líquida.",
    "legenda_ic_ao_vivo_hora": "Hora",
    "legenda_ic_ao_vivo_aposta": "Aposta",
    "legenda_ic_ao_vivo_retorno": "Retorno",
    "legenda_ic_ao_vivo_liquido": "Líquido",
    "legenda_ic_ao_vivo_mult": "Mult.",
    "legenda_ic_ao_vivo_tipo": "Tipo",
    "legenda_ic_ao_vivo_modo_firme": "Modo Firme",
    "legenda_ic_ao_vivo_o_compromisso_encerra_as_abas_internas_ao_atingir_o_limite_trocar_de_bet_nao_reinicia_o_control": "O compromisso encerra as abas internas ao atingir o limite. Trocar de Bet não reinicia o controle.",
    "legenda_ic_ao_vivo_sessao_pausada": "Sessão pausada",
    "legenda_ic_ao_vivo_pausa_prevista_ate": "Pausa prevista até ",
    "legenda_ic_ao_vivo_a_pausa_esta_ativa": "A pausa está ativa. ",
    "legenda_ic_ao_vivo_o_fim_do_planejamento_continua": "O fim do planejamento continua ",
    "legenda_ic_ao_vivo_inalterado": "inalterado.",
    "legenda_ic_ao_vivo_retomar_sessao": "Retomar sessão",
    "legenda_ic_ao_vivo_pausar": "Pausar",
    "legenda_ic_ao_vivo_decisao": "Decisão",
    "legenda_ic_ao_vivo_nao_e_possivel_ampliar_tempo_ou_limite_durante_a_sessao": "Não é possível ampliar tempo ou limite durante a sessão.",
    "legenda_ic_ao_vivo_encerrar_sessao": "Encerrar sessão",
    "legenda_ic_ao_vivo_revisar_regras": "Revisar regras",
    "legenda_ic_ao_vivo_abrir_coach": "Abrir Coach",
    "legenda_ic_ao_vivo_mostrar_detalhes": "Mostrar detalhes",
    "legenda_ic_ao_vivo_esconder_detalhes": "Esconder detalhes",
    "legenda_ic_ao_vivo_confirme_sua_decisao": "Confirme sua decisão",
    "legenda_ic_ao_vivo_pausar_sessao": "Pausar sessão",
    "legenda_ic_ao_vivo_escolha_a_duracao": "Escolha a duração",
    "legenda_ic_ao_vivo_a_pausa_nao_acrescenta_tempo_ao_planejamento_o_horario_final_continua_fixo": "A pausa não acrescenta tempo ao planejamento. O horário final continua fixo.",
    "legenda_ic_ao_vivo_pausar_5_minutos": "Pausar 5 minutos",
    "legenda_ic_ao_vivo_pausar_15_minutos": "Pausar 15 minutos",
    "legenda_ic_ao_vivo_voltar": "Voltar",
    "legenda_ic_ao_vivo_a_retomada_usa_somente_o_tempo_restante_do_planejamento_original": "A retomada usa somente o tempo restante do planejamento original.",
    "legenda_ic_ao_vivo_o_resumo_pos_sessao_sera_preparado_sem_alterar_os_fatos_registrados": "O resumo pós-sessão será preparado sem alterar os fatos registrados.",
    "legenda_ic_ao_vivo_sessao_pausada_2": "Sessão pausada.",
    "legenda_ic_ao_vivo_estado_da_sessao_atualizado": "Estado da sessão atualizado.",
    "legenda_ic_ao_vivo_sessao_encerrada": "Sessão encerrada.",
    "legenda_ic_ao_vivo_a_operacao_nao_foi_concluida": "A operação não foi concluída."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasAoVivo);
  function legendaAoVivo(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasAoVivo[chave]; }

  IC.Screens["ao-vivo"] = function (deps) {
    var Core = IC.Core, UI = IC.UI, Clock = IC.Clock;
    var state = { status: "idle", data: null, error: null, detailsHidden: false, observedAt: 0, ticker: null, mutating: false, latchedSessionId: null };

    function activeSession() { var data = state.data || {}; return data.session || data.sessao || null; }
    function sessionIsOpen(session) {
      var status = String(session && (session.status || session.estado) || "").toLowerCase();
      return !!session && session.active !== false && session.ativa !== false && ["ativa", "active", "pausada", "paused"].indexOf(status) >= 0;
    }
    function sessionIsPaused(session) { return /^(pausada|paused)$/.test(String(session && (session.status || session.estado) || "").toLowerCase()); }
    function monotonicNow() { return root.performance && typeof root.performance.now === "function" ? root.performance.now() : Date.now(); }
    function captureIsComplete(session) {
      return /^(complete|completa)$/.test(String(session && (session.capture_quality || session.qualidade_captura) || "").trim().toLowerCase()) && deps.featureEnabled("ic_financial_clock_enabled") &&
        /^[A-Z]{3}$/.test(session.currency || session.moeda || "") && Core.decimalPlacesOf(session, null) !== null &&
        Core.unitsFrom(session, ["net_result_units_text", "net_result_units", "resultado_liquido_unidades"], null) !== null &&
        Core.unitsSign(Core.unitsFrom(session, ["loss_limit_units_text", "loss_limit_units", "limite_perda_unidades"], null)) > 0;
    }
    function elapsedSeconds(session) {
      var base = Core.finiteInteger(session.elapsed_seconds || session.tempo_decorrido_segundos, 0);
      return Math.max(0, base + (sessionIsOpen(session) ? Math.floor(Math.max(0, monotonicNow() - state.observedAt) / 1000) : 0));
    }
    function stopTicker() { if (state.ticker) root.clearInterval(state.ticker); state.ticker = null; }
    function ensureTicker() {
      if (!sessionIsOpen(activeSession())) { stopTicker(); return; }
      if (state.ticker) return;
      state.ticker = root.setInterval(function () {
        if (document.hidden || deps.container.hidden || state.status !== "ready" || !sessionIsOpen(activeSession())) return;
        renderInto();
      }, 1000);
    }

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try {
        var result = await deps.api.rpc("ic_sessao_estado_ao_vivo_rpc", {}, { key: "live:state" });
        state.status = "ready"; state.data = result.data || {}; state.error = null; state.observedAt = monotonicNow();
      } catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; stopTicker(); }
      renderInto(); ensureTicker();
    }

    function clockSnapshot(session, currency, decimalPlaces) {
      var value = { state: session.clock_state || session.estado_relogio, elapsed_seconds: elapsedSeconds(session), planned_seconds: session.planned_seconds || session.tempo_planejado_segundos, net_result_units_text: Core.unitsFrom(session, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null), loss_limit_units_text: Core.unitsFrom(session, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), currency: currency, decimal_places: decimalPlaces, capture_quality: session.capture_quality || session.qualidade_captura, financial_enabled: deps.featureEnabled("ic_financial_clock_enabled"), reasons: session.reasons || session.motivos };
      var sessionId = Core.integerUnits(session.session_id || session.id_sessao || session.id);
      var normalized = Clock.normalize(value);
      if (sessionId && Core.unitsSign(sessionId) > 0) {
        if (normalized.state === "limit") state.latchedSessionId = sessionId;
        if (state.latchedSessionId === sessionId) value.state = "limit";
      }
      return value;
    }

    function render() {
      var html = UI.sectionHeader(legendaAoVivo("legenda_ic_ao_vivo_ao_vivo"), legendaAoVivo("legenda_ic_ao_vivo_durante_a_sessao_o_foco_e_cumprir_a_decisao_tomada_antes_sem_previsao_de_rodada"));
      if (state.status === "idle" || state.status === "loading") return html + UI.state({ type: "loading", retry: false });
      if (state.status === "error") return html + UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      var data = state.data || {};
      var session = data.session || data.sessao || null;
      var authority = data.control_authority || {}, blocking = authority.blocking || {};
      if (blocking.active === true) html += UI.banner(legendaAoVivo("legenda_ic_ao_vivo_protecao_ativa"), blocking.message || (legendaAoVivo("legenda_ic_ao_vivo_o_acesso_as_bets_dentro_do_turbo_tiger_esta_bloqueado_pelo_seu_compromisso") + (blocking.until ? legendaAoVivo("legenda_ic_ao_vivo_ate") + Core.formatDateTime(blocking.until) : legendaAoVivo("legenda_ic_ao_vivo_enquanto_o_estado_e_validado")) + legendaAoVivo("legenda_ic_ao_vivo_isso_nao_bloqueia_navegadores_ou_aparelhos_externos")), "limit");
      if (!session || session.active === false || session.ativa === false) return html + UI.state({ type: "empty", icon: "live", title: legendaAoVivo("legenda_ic_ao_vivo_nenhuma_sessao_em_andamento"), message: legendaAoVivo("legenda_ic_ao_vivo_quando_uma_sessao_for_iniciada_pelo_botao_de_confirmacao_o_controle_ao_vivo_aparecera_aqui"), retry: false }) + '<div class="ic-card__footer">' + UI.button(legendaAoVivo("legenda_ic_ao_vivo_ver_sessoes_planejadas"), { route: "planejar", icon: "calendar" }) + '</div>';
      var currency = session.currency || session.moeda || "";
      var decimalPlaces = Core.decimalPlacesOf(session, null);
      var metrics = data.metrics || data.metricas || session;
      var captureComplete = captureIsComplete(session);
      html += '<div class="ic-live-layout"><div class="ic-page-stack">' + Clock.render(clockSnapshot(session, currency, decimalPlaces), UI) + renderAlerts(data.alerts || data.alertas || []) + renderMetrics(metrics, currency, decimalPlaces, captureComplete) + renderSubledgers(session.currency_subledgers || metrics.currency_subledgers) + renderActions() + '</div><aside class="ic-page-stack">' + renderContexts(data.contexts || data.contextos || []) + renderRisk(data.risk || data.risco || {}) + renderIntegrity(data.integrity || data.integridade || {}) + (state.detailsHidden ? UI.banner(legendaAoVivo("legenda_ic_ao_vivo_detalhes_ocultos"), legendaAoVivo("legenda_ic_ao_vivo_o_relogio_e_os_controles_essenciais_continuam_visiveis"), "neutral") : renderTimeline(data.timeline || data.rodadas || [], currency, decimalPlaces, captureComplete)) + '</aside></div>';
      return html;
    }

    function renderAlerts(items) {
      var order = { critical: 0, critico: 0, high: 1, alto: 1, medium: 2, medio: 2, informational: 3, informativo: 3 };
      function weight(item) { var key = String(item.severity || item.severidade || "").toLowerCase(); return Object.prototype.hasOwnProperty.call(order, key) ? order[key] : 9; }
      items = Core.normalizeArray(items).filter(function (item) {
        var kind = String(item.kind || item.tipo || item.code || item.codigo || "").toLowerCase();
        if (/pico|peak|giveback|devolucao|ganho_relevante|significant_win/.test(kind) && !deps.featureEnabled("ic_significant_win_enabled")) return false;
        if (/risco_sessao|session_risk|probabilidade_limite/.test(kind) && !deps.featureEnabled("ic_session_risk_enabled")) return false;
        if (/integridade|integrity/.test(kind) && !deps.featureEnabled("ic_integrity_monitor_enabled")) return false;
        return true;
      }).slice().sort(function (left, right) { return weight(left) - weight(right); }).slice(0, 3);
      if (!items.length) return "";
      return ('<section aria-label="' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_alertas_ativos")) + '">') + items.map(function (item) { return UI.banner(item.title || item.titulo || legendaAoVivo("legenda_ic_ao_vivo_alerta_de_controle"), item.message || item.mensagem || "", item.severity || item.severidade); }).join("") + '</section>';
    }

    function renderMetrics(item, currency, fallbackDecimalPlaces, captureComplete) {
      if (!captureComplete) return ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_o_que_esta_acontecendo")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_as_metricas_financeiras_aguardam_reconciliacao_da_captura")) + '</p></div></div>') + UI.state({ type: "insufficient_quality", title: legendaAoVivo("legenda_ic_ao_vivo_metricas_financeiras_indisponiveis"), message: legendaAoVivo("legenda_ic_ao_vivo_nenhum_valor_parcial_sera_apresentado_como_resultado_completo"), retry: false }) + '</section>';
      var decimalPlaces = Core.decimalPlacesOf(item, fallbackDecimalPlaces);
      var netUnits = Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null);
      var rows = [
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_resultado_liquido"), Core.formatSignedMoney(netUnits, currency, decimalPlaces), legendaAoVivo("legenda_ic_ao_vivo_sessao_inteira"), Core.unitsSign(netUnits) < 0 ? "negative" : Core.unitsSign(netUnits) > 0 ? "positive" : "neutral"),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_volume_apostado"), Core.formatMoney(Core.unitsFrom(item, ["volume_units_text", "volume_unidades_texto", "volume_units", "volume_unidades"], null), currency, decimalPlaces), legendaAoVivo("legenda_ic_ao_vivo_exposicao_acumulada")),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_aposta_atual"), Core.formatMoney(Core.unitsFrom(item, ["current_stake_units_text", "aposta_atual_unidades_texto", "current_stake_units", "aposta_atual_unidades"], null), currency, decimalPlaces)),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_aposta_media"), Core.formatMoney(Core.unitsFrom(item, ["average_stake_units_text", "aposta_media_unidades_texto", "average_stake_units", "aposta_media_unidades"], null), currency, decimalPlaces)),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_banca_por_rodada"), item.bankroll_percent == null && item.percentual_banca == null ? legendaAoVivo("legenda_ic_ao_vivo_indisponivel") : Core.formatPercent(item.bankroll_percent == null ? item.percentual_banca : item.bankroll_percent, 2), legendaAoVivo("legenda_ic_ao_vivo_exige_saldo_validado")),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_rodadas"), Core.safeText(item.rounds || item.rodadas || 0)),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_ritmo"), Core.safeText(item.rounds_per_minute || item.rodadas_por_minuto || "—") + legendaAoVivo("legenda_ic_ao_vivo_rpm")),
        UI.metric(legendaAoVivo("legenda_ic_ao_vivo_sequencia"), Core.safeText(item.loss_streak || item.sequencia_perdas || 0) + legendaAoVivo("legenda_ic_ao_vivo_perdas"))
      ];
      if (deps.featureEnabled("ic_significant_win_enabled")) rows.push(UI.metric(legendaAoVivo("legenda_ic_ao_vivo_pico"), Core.formatSignedMoney(Core.unitsFrom(item, ["peak_units_text", "pico_unidades_texto", "peak_units", "pico_unidades"], null), currency, decimalPlaces), legendaAoVivo("legenda_ic_ao_vivo_devolucao") + Core.formatMoney(Core.unitsFrom(item, ["giveback_units_text", "devolucao_pico_unidades_texto", "giveback_units", "devolucao_pico_unidades"], null), currency, decimalPlaces)));
      return ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_o_que_esta_acontecendo")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_saldo_resultado_e_volume_sao_tratados_separadamente")) + '</p></div></div><div class="ic-grid ic-grid--metrics">') + rows.join("") + '</div></section>';
    }

    function renderRisk(risk) {
      if (!deps.featureEnabled("ic_session_risk_enabled") || !Object.keys(risk).length) return "";
      if (risk.status === "amostra_insuficiente" || risk.status === "indisponivel_por_qualidade" || (risk.probability == null && risk.probabilidade == null && !risk.formatted_probability && !risk.probabilidade_formatada)) return UI.state({ type: risk.status === "amostra_insuficiente" ? "insufficient_data" : "insufficient_quality", title: legendaAoVivo("legenda_ic_ao_vivo_risco_da_sessao_indisponivel"), message: risk.message || risk.mensagem, retry: false });
      return ('<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_risco_de_atingir_o_limite")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_estimativa_da_sessao_nunca_da_proxima_rodada")) + '</p></div>') + UI.badge(risk.quality || risk.qualidade || "indeterminado", risk.status || risk.estado) + '</div>' + UI.metric(legendaAoVivo("legenda_ic_ao_vivo_probabilidade_estimada"), risk.formatted_probability || risk.probabilidade_formatada || Core.formatPercent(Number(risk.probability || risk.probabilidade || 0) * (Number(risk.probability || risk.probabilidade || 0) <= 1 ? 100 : 1), 0)) + UI.evidence(risk.evidence || risk.evidencia || risk) + '</section>';
    }

    function renderSubledgers(ledgers) {
      ledgers = Core.normalizeArray(ledgers);
      if (!ledgers.length) return "";
      return ('<section class="ic-page-stack"><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_sessao_global_por_moeda")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_pico_e_drawdown_seguem_a_ordem_real_dos_eventos_nao_somamos_os_picos_individuais_das_bets")) + '</p>') + ledgers.map(function (ledger) {
        var places = Core.decimalPlacesOf(ledger, null);
        if (ledger.financial_complete !== true || ledger.capture_complete !== true) return UI.banner(ledger.currency || legendaAoVivo("legenda_ic_ao_vivo_moeda_nao_identificada"), legendaAoVivo("legenda_ic_ao_vivo_livro_financeiro_parcial_resultado_pico_e_drawdown_nao_sao_apresentados_como_completos"), "capture");
        var fields = [[legendaAoVivo("legenda_ic_ao_vivo_resultado_liquido"), "net_result_units"], [legendaAoVivo("legenda_ic_ao_vivo_volume"), "stake_volume_units"], [legendaAoVivo("legenda_ic_ao_vivo_retorno_pago"), "paid_return_units"], [legendaAoVivo("legenda_ic_ao_vivo_retorno_de_bonus"), "bonus_return_units"], [legendaAoVivo("legenda_ic_ao_vivo_pico"), "peak_units"], [legendaAoVivo("legenda_ic_ao_vivo_devolucao_2"), "giveback_units"], [legendaAoVivo("legenda_ic_ao_vivo_drawdown_maximo"), "drawdown_units"]];
        return '<article class="ic-card"><h4>' + Core.escapeHtml(ledger.currency) + '</h4><div class="ic-grid ic-grid--metrics">' + fields.map(function (field) { return UI.metric(field[0], Core.formatMoney(Core.unitsFrom(ledger, [field[1]], null), ledger.currency, places)); }).join("") + '</div></article>';
      }).join("") + '</section>';
    }

    function renderIntegrity(integrity) {
      if (!deps.featureEnabled("ic_integrity_monitor_enabled") || !Object.keys(integrity).length) return "";
      return UI.banner(legendaAoVivo("legenda_ic_ao_vivo_integridade_estatistica"), integrity.message || integrity.mensagem || legendaAoVivo("legenda_ic_ao_vivo_status_calculado_por_versao_plataforma_e_qualidade_de_captura"), integrity.status || integrity.estado || "neutral");
    }

    function renderContexts(items) {
      items = Core.normalizeArray(items);
      var body = items.length ? '<div class="ic-context-list">' + items.map(function (item) { var netUnits = Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null); var sign = Core.unitsSign(netUnits); return '<article class="ic-context"><div><h4>' + Core.escapeHtml(item.bet || item.bet_nome || legendaAoVivo("legenda_ic_ao_vivo_bet")) + ' · ' + Core.escapeHtml(item.game || item.jogo || legendaAoVivo("legenda_ic_ao_vivo_jogo")) + '</h4><p>' + Core.escapeHtml(item.account || item.conta || legendaAoVivo("legenda_ic_ao_vivo_conta")) + ' · ' + Core.escapeHtml(item.capture_quality || item.qualidade_captura || legendaAoVivo("legenda_ic_ao_vivo_captura_desconhecida")) + legendaAoVivo("legenda_ic_ao_vivo_ultima_rodada") + Core.escapeHtml(Core.formatDateTime(item.last_round_at || item.ultima_rodada_em, { hour: "2-digit", minute: "2-digit", second: "2-digit" })) + '</p></div><strong class="ic-context__value ' + (sign < 0 ? "ic-value--negative" : sign > 0 ? "ic-value--positive" : "") + '">' + Core.escapeHtml(Core.formatSignedMoney(netUnits, item.currency || item.moeda || "", Core.decimalPlacesOf(item, null))) + '</strong></article>'; }).join("") + '</div>' : UI.banner(legendaAoVivo("legenda_ic_ao_vivo_sem_contexto_ativo"), legendaAoVivo("legenda_ic_ao_vivo_nenhuma_bet_ou_jogo_foi_identificado_nesta_sessao"), "capture");
      return ('<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_contextos_ativos")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_visao_consolidada_da_sessao_global")) + '</p></div></div>') + body + '</section>';
    }

    function renderTimeline(items, currency, fallbackDecimalPlaces, captureComplete) {
      if (!captureComplete) return ('<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_timeline")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_oculta_enquanto_a_cobertura_financeira_estiver_incompleta")) + '</p></div></div>') + UI.state({ type: "insufficient_quality", title: legendaAoVivo("legenda_ic_ao_vivo_timeline_aguardando_reconciliacao"), message: legendaAoVivo("legenda_ic_ao_vivo_rodadas_parciais_nao_serao_apresentadas_como_uma_sequencia_completa"), retry: false }) + '</section>';
      items = Core.normalizeArray(items).slice(0, 30);
      if (!items.length) return ('<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_timeline")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_as_ultimas_rodadas_validas_da_sessao")) + '</p></div></div>') + UI.state({ type: "empty", title: legendaAoVivo("legenda_ic_ao_vivo_nenhuma_rodada_capturada"), message: legendaAoVivo("legenda_ic_ao_vivo_o_relogio_de_tempo_pode_continuar_mas_o_financeiro_nao_ficara_verde_sem_captura_confiavel"), retry: false }) + '</section>';
      return ('<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_timeline_compacta")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_retorno_parcial_continua_sendo_perda_liquida")) + '</p></div></div><div class="ic-table-scroll"><table class="ic-timeline"><thead><tr><th>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_hora")) + '</th><th>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_aposta")) + '</th><th>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_retorno")) + '</th><th>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_liquido")) + '</th><th>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_mult")) + '</th><th>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_tipo")) + '</th></tr></thead><tbody>') + items.map(function (round) { var net = Core.unitsFrom(round, ["net_units_text", "liquido_unidades_texto", "net_units", "liquido_unidades"], null), sign = Core.unitsSign(net), roundCurrency = round.currency || round.moeda || currency, decimalPlaces = Core.decimalPlacesOf(round, fallbackDecimalPlaces); return '<tr><td>' + Core.escapeHtml(Core.formatDateTime(round.at || round.em, { hour: "2-digit", minute: "2-digit", second: "2-digit" })) + '</td><td>' + Core.escapeHtml(Core.formatMoney(Core.unitsFrom(round, ["stake_units_text", "aposta_unidades_texto", "stake_units", "aposta_unidades"], null), roundCurrency, decimalPlaces)) + '</td><td>' + Core.escapeHtml(Core.formatMoney(Core.unitsFrom(round, ["return_units_text", "retorno_unidades_texto", "return_units", "retorno_unidades"], null), roundCurrency, decimalPlaces)) + '</td><td class="' + (sign < 0 ? "ic-value--negative" : sign > 0 ? "ic-value--positive" : "") + '">' + Core.escapeHtml(Core.formatSignedMoney(net, roundCurrency, decimalPlaces)) + '</td><td>' + Core.escapeHtml(round.multiplier == null ? (round.multiplicador == null ? "—" : round.multiplicador) : round.multiplier) + '</td><td>' + Core.escapeHtml(round.type || round.tipo || "—") + '</td></tr>'; }).join("") + '</tbody></table></div></section>';
    }

    function renderActions() {
      var session = activeSession() || {}, paused = sessionIsPaused(session);
      var mode = session.control_mode || session.modo_controle;
      var end = session.commitment_ends_at || session.fim_compromisso_em;
      var pauseEnd = session.pause_ends_at || session.pausa_ate;
      var pauseInfo = (mode === "firme" ? UI.banner(legendaAoVivo("legenda_ic_ao_vivo_modo_firme"), legendaAoVivo("legenda_ic_ao_vivo_o_compromisso_encerra_as_abas_internas_ao_atingir_o_limite_trocar_de_bet_nao_reinicia_o_control"), "control") : "") + (paused ? UI.banner(legendaAoVivo("legenda_ic_ao_vivo_sessao_pausada"), (pauseEnd ? legendaAoVivo("legenda_ic_ao_vivo_pausa_prevista_ate") + Core.formatDateTime(pauseEnd) + ". " : legendaAoVivo("legenda_ic_ao_vivo_a_pausa_esta_ativa")) + legendaAoVivo("legenda_ic_ao_vivo_o_fim_do_planejamento_continua") + (end ? Core.formatDateTime(end) + "." : legendaAoVivo("legenda_ic_ao_vivo_inalterado")), "attention") : "");
      var action = paused ? UI.button(legendaAoVivo("legenda_ic_ao_vivo_retomar_sessao"), { action: "resume", disabled: session.can_resume !== true || state.mutating }) : UI.button(legendaAoVivo("legenda_ic_ao_vivo_pausar"), { action: "pause", icon: "pause", disabled: state.mutating });
      return ('<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_decisao")) + '</h3><p>' + Core.escapeHtml(legendaAoVivo("legenda_ic_ao_vivo_nao_e_possivel_ampliar_tempo_ou_limite_durante_a_sessao")) + '</p></div></div>') + pauseInfo + '<div class="ic-card__footer">' + action + UI.button(legendaAoVivo("legenda_ic_ao_vivo_encerrar_sessao"), { action: "end", icon: "stop", kind: "danger", disabled: state.mutating }) + UI.button(legendaAoVivo("legenda_ic_ao_vivo_revisar_regras"), { route: "regras-pausas", icon: "shield" }) + UI.button(legendaAoVivo("legenda_ic_ao_vivo_abrir_coach"), { route: "coach", icon: "coach" }) + UI.button(state.detailsHidden ? legendaAoVivo("legenda_ic_ao_vivo_mostrar_detalhes") : legendaAoVivo("legenda_ic_ao_vivo_esconder_detalhes"), { action: "toggle-details", icon: "eye", kind: "quiet" }) + '</div></section>';
    }

    function renderInto() { deps.container.innerHTML = render(); }

    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "toggle-details") { state.detailsHidden = !state.detailsHidden; renderInto(); return; }
      if (action === "pause" && !sessionIsPaused(activeSession())) {
        UI.openSheet({ eyebrow: legendaAoVivo("legenda_ic_ao_vivo_confirme_sua_decisao"), title: legendaAoVivo("legenda_ic_ao_vivo_pausar_sessao"), html: UI.banner(legendaAoVivo("legenda_ic_ao_vivo_escolha_a_duracao"), legendaAoVivo("legenda_ic_ao_vivo_a_pausa_nao_acrescenta_tempo_ao_planejamento_o_horario_final_continua_fixo"), "attention") + '<div class="ic-card__footer">' + UI.button(legendaAoVivo("legenda_ic_ao_vivo_pausar_5_minutos"), { action: "confirm-pause", value: 5 }) + UI.button(legendaAoVivo("legenda_ic_ao_vivo_pausar_15_minutos"), { action: "confirm-pause", value: 15 }) + UI.button(legendaAoVivo("legenda_ic_ao_vivo_voltar"), { action: "close-sheet" }) + '</div>' });
      }
      if (action === "end" || (action === "resume" && (activeSession() || {}).can_resume === true)) {
        var label = action === "resume" ? legendaAoVivo("legenda_ic_ao_vivo_retomar_sessao") : legendaAoVivo("legenda_ic_ao_vivo_encerrar_sessao");
        UI.openSheet({ eyebrow: legendaAoVivo("legenda_ic_ao_vivo_confirme_sua_decisao"), title: label, html: UI.banner(label, action === "resume" ? legendaAoVivo("legenda_ic_ao_vivo_a_retomada_usa_somente_o_tempo_restante_do_planejamento_original") : legendaAoVivo("legenda_ic_ao_vivo_o_resumo_pos_sessao_sera_preparado_sem_alterar_os_fatos_registrados"), action === "end" ? "limit" : "attention") + '<div class="ic-card__footer">' + UI.button(label, { action: "confirm-" + action, kind: action === "end" ? "danger" : "primary" }) + UI.button(legendaAoVivo("legenda_ic_ao_vivo_voltar"), { action: "close-sheet" }) + '</div>' });
      }
      if (action === "close-sheet") UI.closeSheet();
      if (["confirm-pause", "confirm-end", "confirm-resume"].indexOf(action) >= 0) {
        if (state.mutating || !sessionIsOpen(activeSession())) return;
        var minutes = Number(value);
        if (action === "confirm-pause" && [5, 15].indexOf(minutes) < 0) return;
        if (action === "confirm-resume" && (activeSession() || {}).can_resume !== true) return;
        var rpc = action === "confirm-pause" ? "ic_sessao_pausar_rpc" : action === "confirm-resume" ? "ic_sessao_retomar_rpc" : "ic_sessao_encerrar_rpc";
        state.mutating = true;
        try { var result = await deps.api.rpc(rpc, action === "confirm-pause" ? { p_duracao_minutos: minutes } : {}, { key: "live:mutation" }); IC.Bridge.post("session_control_action", { action: action === "confirm-pause" ? "pause" : action === "confirm-resume" ? "resume" : "end", session_id: result.data && (result.data.session_id || result.data.id_sessao) || null, revision: result.data && (result.data.revision || result.data.revisao) || null, carga: deps.route().loadGeneration || null }); UI.closeSheet(); UI.toast(action === "confirm-pause" ? legendaAoVivo("legenda_ic_ao_vivo_sessao_pausada_2") : action === "confirm-resume" ? legendaAoVivo("legenda_ic_ao_vivo_estado_da_sessao_atualizado") : legendaAoVivo("legenda_ic_ao_vivo_sessao_encerrada")); state.status = "idle"; await load(true); }
        catch (error) { UI.toast(error.message || legendaAoVivo("legenda_ic_ao_vivo_a_operacao_nao_foi_concluida")); }
        finally { state.mutating = false; renderInto(); }
      }
    }

    return { render: render, load: load, handleAction: handleAction, dispose: stopTicker };
  };
}(window));
