(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

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
      var html = UI.sectionHeader("Ao Vivo", "Durante a sessão, o foco é cumprir a decisão tomada antes — sem previsão de rodada.", UI.button("Atualizar", { action: "retry", icon: "refresh" }));
      if (state.status === "idle" || state.status === "loading") return html + UI.state({ type: "loading", retry: false });
      if (state.status === "error") return html + UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      var data = state.data || {};
      var session = data.session || data.sessao || null;
      var authority = data.control_authority || {}, blocking = authority.blocking || {};
      if (blocking.active === true) html += UI.banner("Proteção ativa", blocking.message || ("O acesso às Bets dentro do Turbo Tiger está bloqueado pelo seu compromisso" + (blocking.until ? " até " + Core.formatDateTime(blocking.until) : " enquanto o estado é validado") + ". Isso não bloqueia navegadores ou aparelhos externos."), "limit");
      if (!session || session.active === false || session.ativa === false) return html + UI.state({ type: "empty", icon: "live", title: "Nenhuma sessão em andamento", message: "Quando uma sessão for iniciada pelo botão de confirmação, o controle ao vivo aparecerá aqui.", retry: false }) + '<div class="ic-card__footer">' + UI.button("Ver Sessões Planejadas", { route: "planejar", icon: "calendar" }) + '</div>';
      var currency = session.currency || session.moeda || "";
      var decimalPlaces = Core.decimalPlacesOf(session, null);
      var metrics = data.metrics || data.metricas || session;
      var captureComplete = captureIsComplete(session);
      html += '<div class="ic-live-layout"><div class="ic-page-stack">' + Clock.render(clockSnapshot(session, currency, decimalPlaces), UI) + renderAlerts(data.alerts || data.alertas || []) + renderMetrics(metrics, currency, decimalPlaces, captureComplete) + renderSubledgers(session.currency_subledgers || metrics.currency_subledgers) + renderActions() + '</div><aside class="ic-page-stack">' + renderContexts(data.contexts || data.contextos || []) + renderRisk(data.risk || data.risco || {}) + renderIntegrity(data.integrity || data.integridade || {}) + (state.detailsHidden ? UI.banner("Detalhes ocultos", "O relógio e os controles essenciais continuam visíveis.", "neutral") : renderTimeline(data.timeline || data.rodadas || [], currency, decimalPlaces, captureComplete)) + '</aside></div>';
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
      return '<section aria-label="Alertas ativos">' + items.map(function (item) { return UI.banner(item.title || item.titulo || "Alerta de controle", item.message || item.mensagem || "", item.severity || item.severidade); }).join("") + '</section>';
    }

    function renderMetrics(item, currency, fallbackDecimalPlaces, captureComplete) {
      if (!captureComplete) return '<section><div class="ic-card__header"><div><h3>O que está acontecendo</h3><p>As métricas financeiras aguardam reconciliação da captura.</p></div></div>' + UI.state({ type: "insufficient_quality", title: "Métricas financeiras indisponíveis", message: "Nenhum valor parcial será apresentado como resultado completo.", retry: false }) + '</section>';
      var decimalPlaces = Core.decimalPlacesOf(item, fallbackDecimalPlaces);
      var netUnits = Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null);
      var rows = [
        UI.metric("Resultado líquido", Core.formatSignedMoney(netUnits, currency, decimalPlaces), "Sessão inteira", Core.unitsSign(netUnits) < 0 ? "negative" : Core.unitsSign(netUnits) > 0 ? "positive" : "neutral"),
        UI.metric("Volume apostado", Core.formatMoney(Core.unitsFrom(item, ["volume_units_text", "volume_unidades_texto", "volume_units", "volume_unidades"], null), currency, decimalPlaces), "Exposição acumulada"),
        UI.metric("Aposta atual", Core.formatMoney(Core.unitsFrom(item, ["current_stake_units_text", "aposta_atual_unidades_texto", "current_stake_units", "aposta_atual_unidades"], null), currency, decimalPlaces)),
        UI.metric("Aposta média", Core.formatMoney(Core.unitsFrom(item, ["average_stake_units_text", "aposta_media_unidades_texto", "average_stake_units", "aposta_media_unidades"], null), currency, decimalPlaces)),
        UI.metric("Banca por rodada", item.bankroll_percent == null && item.percentual_banca == null ? "Indisponível" : Core.formatPercent(item.bankroll_percent == null ? item.percentual_banca : item.bankroll_percent, 2), "Exige saldo validado"),
        UI.metric("Rodadas", Core.safeText(item.rounds || item.rodadas || 0)),
        UI.metric("Ritmo", Core.safeText(item.rounds_per_minute || item.rodadas_por_minuto || "—") + " rpm"),
        UI.metric("Sequência", Core.safeText(item.loss_streak || item.sequencia_perdas || 0) + " perdas")
      ];
      if (deps.featureEnabled("ic_significant_win_enabled")) rows.push(UI.metric("Pico", Core.formatSignedMoney(Core.unitsFrom(item, ["peak_units_text", "pico_unidades_texto", "peak_units", "pico_unidades"], null), currency, decimalPlaces), "Devolução " + Core.formatMoney(Core.unitsFrom(item, ["giveback_units_text", "devolucao_pico_unidades_texto", "giveback_units", "devolucao_pico_unidades"], null), currency, decimalPlaces)));
      return '<section><div class="ic-card__header"><div><h3>O que está acontecendo</h3><p>Saldo, resultado e volume são tratados separadamente.</p></div></div><div class="ic-grid ic-grid--metrics">' + rows.join("") + '</div></section>';
    }

    function renderRisk(risk) {
      if (!deps.featureEnabled("ic_session_risk_enabled") || !Object.keys(risk).length) return "";
      if (risk.status === "amostra_insuficiente" || risk.status === "indisponivel_por_qualidade" || (risk.probability == null && risk.probabilidade == null && !risk.formatted_probability && !risk.probabilidade_formatada)) return UI.state({ type: risk.status === "amostra_insuficiente" ? "insufficient_data" : "insufficient_quality", title: "Risco da sessão indisponível", message: risk.message || risk.mensagem, retry: false });
      return '<section class="ic-card"><div class="ic-card__header"><div><h3>Risco de atingir o limite</h3><p>Estimativa da sessão, nunca da próxima rodada.</p></div>' + UI.badge(risk.quality || risk.qualidade || "indeterminado", risk.status || risk.estado) + '</div>' + UI.metric("Probabilidade estimada", risk.formatted_probability || risk.probabilidade_formatada || Core.formatPercent(Number(risk.probability || risk.probabilidade || 0) * (Number(risk.probability || risk.probabilidade || 0) <= 1 ? 100 : 1), 0)) + UI.evidence(risk.evidence || risk.evidencia || risk) + '</section>';
    }

    function renderSubledgers(ledgers) {
      ledgers = Core.normalizeArray(ledgers);
      if (!ledgers.length) return "";
      return '<section class="ic-page-stack"><h3>Sessão Global por moeda</h3><p>Pico e drawdown seguem a ordem real dos eventos. Não somamos os picos individuais das Bets.</p>' + ledgers.map(function (ledger) {
        var places = Core.decimalPlacesOf(ledger, null);
        if (ledger.financial_complete !== true || ledger.capture_complete !== true) return UI.banner(ledger.currency || "Moeda não identificada", "Livro financeiro parcial. Resultado, pico e drawdown não são apresentados como completos.", "capture");
        var fields = [["Resultado líquido", "net_result_units"], ["Volume", "stake_volume_units"], ["Retorno pago", "paid_return_units"], ["Retorno de bônus", "bonus_return_units"], ["Pico", "peak_units"], ["Devolução", "giveback_units"], ["Drawdown máximo", "drawdown_units"]];
        return '<article class="ic-card"><h4>' + Core.escapeHtml(ledger.currency) + '</h4><div class="ic-grid ic-grid--metrics">' + fields.map(function (field) { return UI.metric(field[0], Core.formatMoney(Core.unitsFrom(ledger, [field[1]], null), ledger.currency, places)); }).join("") + '</div></article>';
      }).join("") + '</section>';
    }

    function renderIntegrity(integrity) {
      if (!deps.featureEnabled("ic_integrity_monitor_enabled") || !Object.keys(integrity).length) return "";
      return UI.banner("Integridade estatística", integrity.message || integrity.mensagem || "Status calculado por versão, plataforma e qualidade de captura.", integrity.status || integrity.estado || "neutral");
    }

    function renderContexts(items) {
      items = Core.normalizeArray(items);
      var body = items.length ? '<div class="ic-context-list">' + items.map(function (item) { var netUnits = Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null); var sign = Core.unitsSign(netUnits); return '<article class="ic-context"><div><h4>' + Core.escapeHtml(item.bet || item.bet_nome || "Bet") + ' · ' + Core.escapeHtml(item.game || item.jogo || "Jogo") + '</h4><p>' + Core.escapeHtml(item.account || item.conta || "Conta") + ' · ' + Core.escapeHtml(item.capture_quality || item.qualidade_captura || "captura desconhecida") + ' · última rodada ' + Core.escapeHtml(Core.formatDateTime(item.last_round_at || item.ultima_rodada_em, { hour: "2-digit", minute: "2-digit", second: "2-digit" })) + '</p></div><strong class="ic-context__value ' + (sign < 0 ? "ic-value--negative" : sign > 0 ? "ic-value--positive" : "") + '">' + Core.escapeHtml(Core.formatSignedMoney(netUnits, item.currency || item.moeda || "", Core.decimalPlacesOf(item, null))) + '</strong></article>'; }).join("") + '</div>' : UI.banner("Sem contexto ativo", "Nenhuma Bet ou jogo foi identificado nesta sessão.", "capture");
      return '<section class="ic-card"><div class="ic-card__header"><div><h3>Contextos ativos</h3><p>Visão consolidada da Sessão Global.</p></div></div>' + body + '</section>';
    }

    function renderTimeline(items, currency, fallbackDecimalPlaces, captureComplete) {
      if (!captureComplete) return '<section class="ic-card"><div class="ic-card__header"><div><h3>Timeline</h3><p>Oculta enquanto a cobertura financeira estiver incompleta.</p></div></div>' + UI.state({ type: "insufficient_quality", title: "Timeline aguardando reconciliação", message: "Rodadas parciais não serão apresentadas como uma sequência completa.", retry: false }) + '</section>';
      items = Core.normalizeArray(items).slice(0, 30);
      if (!items.length) return '<section class="ic-card"><div class="ic-card__header"><div><h3>Timeline</h3><p>As últimas rodadas válidas da sessão.</p></div></div>' + UI.state({ type: "empty", title: "Nenhuma rodada capturada", message: "O relógio de tempo pode continuar, mas o financeiro não ficará verde sem captura confiável.", retry: false }) + '</section>';
      return '<section class="ic-card"><div class="ic-card__header"><div><h3>Timeline compacta</h3><p>Retorno parcial continua sendo perda líquida.</p></div></div><div class="ic-table-scroll"><table class="ic-timeline"><thead><tr><th>Hora</th><th>Aposta</th><th>Retorno</th><th>Líquido</th><th>Mult.</th><th>Tipo</th></tr></thead><tbody>' + items.map(function (round) { var net = Core.unitsFrom(round, ["net_units_text", "liquido_unidades_texto", "net_units", "liquido_unidades"], null), sign = Core.unitsSign(net), roundCurrency = round.currency || round.moeda || currency, decimalPlaces = Core.decimalPlacesOf(round, fallbackDecimalPlaces); return '<tr><td>' + Core.escapeHtml(Core.formatDateTime(round.at || round.em, { hour: "2-digit", minute: "2-digit", second: "2-digit" })) + '</td><td>' + Core.escapeHtml(Core.formatMoney(Core.unitsFrom(round, ["stake_units_text", "aposta_unidades_texto", "stake_units", "aposta_unidades"], null), roundCurrency, decimalPlaces)) + '</td><td>' + Core.escapeHtml(Core.formatMoney(Core.unitsFrom(round, ["return_units_text", "retorno_unidades_texto", "return_units", "retorno_unidades"], null), roundCurrency, decimalPlaces)) + '</td><td class="' + (sign < 0 ? "ic-value--negative" : sign > 0 ? "ic-value--positive" : "") + '">' + Core.escapeHtml(Core.formatSignedMoney(net, roundCurrency, decimalPlaces)) + '</td><td>' + Core.escapeHtml(round.multiplier == null ? (round.multiplicador == null ? "—" : round.multiplicador) : round.multiplier) + '</td><td>' + Core.escapeHtml(round.type || round.tipo || "—") + '</td></tr>'; }).join("") + '</tbody></table></div></section>';
    }

    function renderActions() {
      var session = activeSession() || {}, paused = sessionIsPaused(session);
      var mode = session.control_mode || session.modo_controle;
      var end = session.commitment_ends_at || session.fim_compromisso_em;
      var pauseEnd = session.pause_ends_at || session.pausa_ate;
      var pauseInfo = (mode === "firme" ? UI.banner("Modo Firme", "O compromisso encerra as abas internas ao atingir o limite. Trocar de Bet não reinicia o controle.", "control") : "") + (paused ? UI.banner("Sessão pausada", (pauseEnd ? "Pausa prevista até " + Core.formatDateTime(pauseEnd) + ". " : "A pausa está ativa. ") + "O fim do planejamento continua " + (end ? Core.formatDateTime(end) + "." : "inalterado."), "attention") : "");
      var action = paused ? UI.button("Retomar sessão", { action: "resume", disabled: session.can_resume !== true || state.mutating }) : UI.button("Pausar", { action: "pause", icon: "pause", disabled: state.mutating });
      return '<section class="ic-card"><div class="ic-card__header"><div><h3>Decisão</h3><p>Não é possível ampliar tempo ou limite durante a sessão.</p></div></div>' + pauseInfo + '<div class="ic-card__footer">' + action + UI.button("Encerrar sessão", { action: "end", icon: "stop", kind: "danger", disabled: state.mutating }) + UI.button("Revisar regras", { route: "regras-pausas", icon: "shield" }) + UI.button("Abrir Coach", { route: "coach", icon: "coach" }) + UI.button(state.detailsHidden ? "Mostrar detalhes" : "Esconder detalhes", { action: "toggle-details", icon: "eye", kind: "quiet" }) + '</div></section>';
    }

    function renderInto() { deps.container.innerHTML = render(); }

    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "toggle-details") { state.detailsHidden = !state.detailsHidden; renderInto(); return; }
      if (action === "pause" && !sessionIsPaused(activeSession())) {
        UI.openSheet({ eyebrow: "Confirme sua decisão", title: "Pausar sessão", html: UI.banner("Escolha a duração", "A pausa não acrescenta tempo ao planejamento. O horário final continua fixo.", "attention") + '<div class="ic-card__footer">' + UI.button("Pausar 5 minutos", { action: "confirm-pause", value: 5 }) + UI.button("Pausar 15 minutos", { action: "confirm-pause", value: 15 }) + UI.button("Voltar", { action: "close-sheet" }) + '</div>' });
      }
      if (action === "end" || (action === "resume" && (activeSession() || {}).can_resume === true)) {
        var label = action === "resume" ? "Retomar sessão" : "Encerrar sessão";
        UI.openSheet({ eyebrow: "Confirme sua decisão", title: label, html: UI.banner(label, action === "resume" ? "A retomada usa somente o tempo restante do planejamento original." : "O resumo pós-sessão será preparado sem alterar os fatos registrados.", action === "end" ? "limit" : "attention") + '<div class="ic-card__footer">' + UI.button(label, { action: "confirm-" + action, kind: action === "end" ? "danger" : "primary" }) + UI.button("Voltar", { action: "close-sheet" }) + '</div>' });
      }
      if (action === "close-sheet") UI.closeSheet();
      if (["confirm-pause", "confirm-end", "confirm-resume"].indexOf(action) >= 0) {
        if (state.mutating || !sessionIsOpen(activeSession())) return;
        var minutes = Number(value);
        if (action === "confirm-pause" && [5, 15].indexOf(minutes) < 0) return;
        if (action === "confirm-resume" && (activeSession() || {}).can_resume !== true) return;
        var rpc = action === "confirm-pause" ? "ic_sessao_pausar_rpc" : action === "confirm-resume" ? "ic_sessao_retomar_rpc" : "ic_sessao_encerrar_rpc";
        state.mutating = true;
        try { var result = await deps.api.rpc(rpc, action === "confirm-pause" ? { p_duracao_minutos: minutes } : {}, { key: "live:mutation" }); IC.Bridge.post("session_control_action", { action: action === "confirm-pause" ? "pause" : action === "confirm-resume" ? "resume" : "end", session_id: result.data && (result.data.session_id || result.data.id_sessao) || null, revision: result.data && (result.data.revision || result.data.revisao) || null, carga: deps.route().loadGeneration || null }); UI.closeSheet(); UI.toast(action === "confirm-pause" ? "Sessão pausada." : action === "confirm-resume" ? "Estado da sessão atualizado." : "Sessão encerrada."); state.status = "idle"; await load(true); }
        catch (error) { UI.toast(error.message || "A operação não foi concluída."); }
        finally { state.mutating = false; renderInto(); }
      }
    }

    return { render: render, load: load, handleAction: handleAction, dispose: stopTicker };
  };
}(window));
