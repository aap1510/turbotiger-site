(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens.estatisticas = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var areas = [
      { id: "banca", label: "Banca", flag: "ic_bankroll_curve_enabled" },
      { id: "sessoes", label: "Sessões", flag: "ic_personal_insights_enabled" },
      { id: "ritmo", label: "Ritmo", flag: "ic_personal_insights_enabled" },
      { id: "apos-perdas", label: "Após perdas", flag: "ic_personal_insights_enabled" },
      { id: "pico", label: "Pico e devolução", flag: "ic_significant_win_enabled" },
      { id: "horarios", label: "Horários", flag: "ic_personal_insights_enabled" },
      { id: "intervalos", label: "Intervalos", flag: "ic_interval_lab_enabled" },
      { id: "bonus", label: "Bônus", flag: "ic_personal_insights_enabled" },
      { id: "risco", label: "Risco da sessão", flag: "ic_session_risk_enabled" },
      { id: "laboratorio", label: "Laboratório", flag: "ic_interval_lab_enabled" }
    ];
    var state = { status: "idle", data: null, error: null, area: deps.route().subsection || "banca", pendingHypothesis: null, protection: null, protectionError: null, exposure: null, exposureError: null, exposureQuery: { p_id_jogo: null, p_exposicao_pct: null, p_risco_maximo: null } };
    var loadRevision = 0, disposed = false;

    function availableAreas() { return areas.filter(function (area) { return deps.featureEnabled(area.flag); }); }
    function normalizeArea() { var available = availableAreas(); if (!available.some(function (area) { return area.id === state.area; })) state.area = available.length ? available[0].id : null; return available; }

    async function load(force) {
      if (disposed || state.status === "loading" || (!force && state.status === "ready")) return;
      if (!normalizeArea().length) { state.status = "unavailable"; renderInto(); return; }
      var revision = ++loadRevision, requestedArea = state.area;
      state.status = "loading"; renderInto();
      try {
        var modelRequest = requestedArea === "risco" ? deps.api.rpc("ic_risco_comportamental_rpc", { p_id_jogo: null }, { key: "statistics:behavioral-risk" }).then(function (result) {
          if (!result.data || result.data.schema_version !== "ic_behavioral_risk_v1" || !Array.isArray(result.data.models)) throw new Error("Contrato do modelo comportamental indisponível.");
          return { data: result.data };
        }).catch(function (error) { return { error: error }; }) : Promise.resolve({ data: null });
        var exposureRequest = requestedArea === "banca" ? deps.api.rpc("ic_exposicao_continua_rpc", Object.assign({}, state.exposureQuery), { key: "statistics:continuous-exposure" }).then(function (result) {
          if (!result.data || result.data.schema_version !== "ic_continuous_exposure_v1" || !Array.isArray(result.data.models)) throw new Error("Contrato da curva de exposição indisponível.");
          return { data: result.data };
        }).catch(function (error) { return { error: error }; }) : Promise.resolve({ data: null });
        var results = await Promise.all([deps.api.rpc("ic_estatisticas_rpc", { p_area: requestedArea }, { key: "statistics:" + requestedArea }), modelRequest, exposureRequest]);
        if (revision !== loadRevision || requestedArea !== state.area) return;
        state.status = "ready"; state.data = results[0].data || {}; state.error = null;
        state.protection = results[1].data || null; state.protectionError = results[1].error || null;
        state.exposure = results[2].data || null; state.exposureError = results[2].error || null;
      } catch (error) { if (revision !== loadRevision || error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
      if (state.status === "ready") openNotificationContext();
    }

    function subnav() { return '<div class="ic-chip-row" role="tablist" aria-label="Áreas estatísticas">' + normalizeArea().map(function (area) { return '<button class="ic-chip" type="button" role="tab" aria-selected="' + (state.area === area.id) + '" data-screen-action="stats-area" data-action-value="' + area.id + '">' + area.label + '</button>'; }).join("") + '</div>'; }

    function content() {
      var data = state.data || {};
      if (data.status === "amostra_insuficiente") return UI.state({ type: "insufficient_data", message: data.message || data.mensagem, meta: data.sample_summary || data.resumo_amostra, retry: false });
      if (data.status === "qualidade_insuficiente") return UI.state({ type: "insufficient_quality", message: data.message || data.mensagem, meta: data.sample_summary || data.resumo_amostra, retry: false });
      if (state.area === "laboratorio") return laboratory(data);
      var summary = data.summary || data.resumo || {};
      var series = Core.normalizeArray(data.series || data.serie || data.items || data.itens);
      if (!series.length && !Object.keys(summary).length) return UI.state({ type: "empty", title: "Ainda não há estatística para este recorte", message: "A infraestrutura permanece ativa e passará a exibir resultados quando houver dados elegíveis.", retry: false });
      var metrics = Core.normalizeArray(summary.metrics || summary.metricas).map(function (item) { return UI.metric(item.label || item.rotulo, item.formatted_value || item.valor_formatado || Core.safeText(item.value !== undefined ? item.value : item.valor), item.detail || item.detalhe); }).join("");
      var maximum = Math.max.apply(Math, [1].concat(series.map(function (item) { return Math.abs(Number(item.value || item.valor || 0)); })));
      var rows = series.map(function (item) { var value = Number(item.value || item.valor || 0); return '<div class="ic-stat-row"><span class="ic-stat-row__label">' + Core.escapeHtml(item.label || item.rotulo || "Faixa") + '</span><div class="ic-stat-row__track" aria-hidden="true"><div class="ic-stat-row__bar" style="width:' + Core.clamp(Math.abs(value) * 100 / maximum, 0, 100) + '%"></div></div><strong class="ic-stat-row__value">' + Core.escapeHtml(item.formatted_value || item.valor_formatado || String(value).replace(".", ",")) + '</strong></div>'; }).join("");
      return (metrics ? '<div class="ic-grid ic-grid--metrics">' + metrics + '</div>' : '') + '<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(data.title || data.titulo || areaLabel()) + '</h3><p>' + Core.escapeHtml(data.description || data.descricao || "Associação histórica apresentada com amostra e incerteza.") + '</p></div>' + UI.badge(data.evidence_status || data.status_evidencia || "descritivo", data.evidence_status || data.status_evidencia) + '</div><div class="ic-stat-block">' + rows + '</div>' + UI.evidence(data.evidence || data.evidencia || data) + '</section>' + renderEligiblePatterns(data) + '<div class="ic-disclaimer">Associações descrevem o histórico e não estabelecem causalidade nem preveem a próxima rodada.</div>';
    }

    function laboratory(data) {
      var items = Core.normalizeArray(data.hypotheses || data.hipoteses || data.items || data.itens);
      if (!items.length) return UI.state({ type: "empty", title: "Nenhuma hipótese publicada", message: "Descobertas só aparecem após registro de método, amostra, limitações e status de validação.", retry: false });
      return '<div class="ic-list">' + items.map(function (item) { var direction = item.direction || item.direcao || "descritiva", effective = item.effective_source || item.fonte_efetiva; var bell = isSubscribable(item) ? UI.button(item.notification_active ? "Gerenciar lembrete" : "Lembrar deste padrão", { action: "hypothesis-bell", value: evidenceId(item), icon: "bell", kind: item.notification_active ? "gold" : "quiet" }) : ""; return '<article class="ic-card"><div class="ic-card__header"><div><span class="ic-hypothesis-code">' + Core.escapeHtml(item.code || item.codigo) + '</span><h3>' + Core.escapeHtml(item.title || item.titulo || item.description || item.descricao) + '</h3><p>Direção observada: ' + Core.escapeHtml(direction) + '. ' + Core.escapeHtml(item.limitation || item.limitacao || "") + (effective ? ' Origem efetiva da última atualização: ' + Core.escapeHtml(sourceLabel(effective)) + '.' : '') + '</p></div>' + UI.badge(item.status || "exploratorio", item.status) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + UI.button("Ver método", { action: "hypothesis-detail", value: item.code || item.codigo }) + bell + '</div></article>'; }).join("") + '</div><div class="ic-disclaimer">Hipóteses exploratórias permanecem apenas para consulta. O sino só aparece quando existe identidade temporal, regra versionada e evidência elegível.</div>';
    }

    function patternCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese || item.pattern_code || item.codigo_padrao); }
    function evidenceId(item) { return Core.validUuid(item && (item.id_insight_evidencia || item.insight_evidence_id || item.uuid_insight_evidencia || item.evidence_id)); }
    function temporalRule(item) { return item && (item.temporal_rule_id || item.id_regra_temporal || item.temporal_rule_code || item.codigo_regra_temporal || item.temporal_rule || item.regra_temporal); }
    function isSubscribable(item) {
      var status = String(item && (item.status || item.evidence_status || item.status_evidencia) || "").toLowerCase();
      var eligible = item && (item.notification_eligible === true || item.notificacao_elegivel === true || item.subscription_eligible === true || item.assinatura_elegivel === true);
      var evidence = item && (item.evidence_eligible === true || item.evidencia_elegivel === true);
      return !!(patternCode(item) && evidenceId(item) && temporalRule(item) && eligible && evidence && !/explorat|observacao_inicial|observação_inicial|ruido|ruído|insuficiente/.test(status));
    }
    function patternsFromData(data) { return Core.normalizeArray(data.notification_patterns || data.padroes_notificaveis || data.patterns || data.padroes || data.hypotheses || data.hipoteses); }
    function renderEligiblePatterns(data) {
      var items = patternsFromData(data).filter(isSubscribable);
      if (!items.length) return "";
      return '<section><div class="ic-card__header"><div><h3>Lembretes de padrões históricos</h3><p>Padrões temporais elegíveis deste recorte, com direção e evidência explícitas.</p></div></div><div class="ic-list">' + items.map(function (item) { var code = patternCode(item); return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || code) + '</h3><p>Direção observada: ' + Core.escapeHtml(item.direction || item.direcao || "descritiva") + '.</p></div>' + UI.badge(item.status || "elegivel", item.status) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + UI.button(item.notification_active || item.notificacao_ativa ? "Gerenciar lembrete" : "Lembrar deste padrão", { action: "hypothesis-bell", value: evidenceId(item), icon: "bell", kind: item.notification_active || item.notificacao_ativa ? "gold" : "quiet" }) + '</div></article>'; }).join("") + '</div></section>';
    }

    function areaLabel() { var found = areas.find(function (item) { return item.id === state.area; }); return found ? found.label : "Estatísticas"; }
    function finiteMetric(value) { if ((typeof value !== "number" && typeof value !== "string") || (typeof value === "string" && !value.trim())) return null; var number = Number(value); return Number.isFinite(number) ? number : null; }
    function probabilityValue(value) { var number = finiteMetric(value); return number !== null && number >= 0 && number <= 1 ? number : null; }
    function protectionEvidence(model) {
      var sample = model.sample || {}, period = model.period || {};
      var source = ["pessoal", "comunidade", "ambos"].indexOf(model.scope) >= 0 ? sourceLabel(model.scope) : "Fonte não informada";
      return '<div class="ic-list">' + UI.listRow("Origem", source, "") + UI.listRow("Amostra", Core.safeText(sample.sessions) + " sessões; " + Core.safeText(sample.eligible_sessions) + " elegíveis; " + Core.safeText(sample.users) + " usuários", "") + UI.listRow("Período", Core.formatDateTime(period.start) + " até " + Core.formatDateTime(period.end), "") + UI.listRow("Versão do cálculo", Core.safeText(model.model_version), "") + '</div>';
    }
    function behavioralModels() {
      if (state.area !== "risco") return "";
      var title = "Risco de romper o planejamento";
      if (state.protectionError) return UI.banner(title, "O modelo comportamental não pôde ser atualizado. As outras estatísticas não substituem essa estimativa.", "neutral");
      var models = Core.normalizeArray(state.protection && state.protection.models).slice(0, 20);
      if (!models.length) return UI.banner(title, "Ainda não há sessões planejadas elegíveis para esta análise. Sessões observadas sem plano não recebem um compromisso inventado.", "neutral");
      return '<section><div class="ic-card__header"><div><h3>' + title + '</h3><p>Comportamento em relação aos seus compromissos, não ao resultado da próxima rodada.</p></div></div><div class="ic-list">' + models.map(function (model) {
        var probability = probabilityValue(model.probability), interval = model.interval || {};
        var lower = probabilityValue(interval.lower), upper = probabilityValue(interval.upper);
        var eligible = model.probability_eligible === true && ["validado_fora_amostra", "replicado"].indexOf(model.status) >= 0 && probability !== null && lower !== null && upper !== null && lower <= probability && probability <= upper;
        var metric = eligible ? UI.metric("Estimativa comportamental", Core.formatPercent(probability * 100, 2), "Faixa de incerteza: " + Core.formatPercent(lower * 100, 2) + " a " + Core.formatPercent(upper * 100, 2)) : UI.banner("Estimativa ainda não liberada", "Amostra, qualidade e validação fora da amostra precisam ser suficientes. Ausência de estimativa não significa risco zero.", "neutral");
        var notes = Core.normalizeArray(model.reasons).concat(Core.normalizeArray(model.limitations)).filter(function (value) { return typeof value === "string"; }).slice(0, 12);
        return '<article class="ic-card"><div class="ic-card__header"><h3>' + Core.escapeHtml(model.game_label || "Seu planejamento") + '</h3>' + UI.badge(model.status || "amostra_insuficiente", model.status) + '</div>' + metric + protectionEvidence(model) + (notes.length ? '<p>' + Core.escapeHtml(notes.join(" ")) + '</p>' : '') + '<div class="ic-disclaimer">Esta análise não muda a cor do relógio, não flexibiliza seus limites e não prevê se o jogo pagará.</div></article>';
      }).join("") + '</div></section>';
    }
    function exposureModels() {
      if (state.area !== "banca") return "";
      var models = Core.normalizeArray(state.exposure && state.exposure.models).slice(0, 20), query = state.exposureQuery;
      var games = [], seen = Object.create(null);
      models.forEach(function (model) { var game = model.game || {}, id = Core.safeText(game.id, ""); if (/^[1-9]\d*$/.test(id) && !seen[id]) { seen[id] = true; games.push({ id: id, label: model.game_label || "Jogo " + id }); } });
      if (query.p_id_jogo && !seen[query.p_id_jogo]) games.push({ id: query.p_id_jogo, label: "Jogo " + query.p_id_jogo });
      var form = '<form class="ic-card ic-form" id="icExposureForm"><h3>Consultar exposição histórica</h3><p>Consulta apenas: não altera sua banca, aposta, limites ou Sessão Planejada.</p><div class="ic-form-grid"><div class="ic-field"><label for="ic-exposure-game">Jogo</label><select id="ic-exposure-game" name="game"><option value="">Recortes disponíveis</option>' + games.map(function (game) { return '<option value="' + Core.escapeHtml(game.id) + '"' + (String(query.p_id_jogo) === game.id ? ' selected' : '') + '>' + Core.escapeHtml(game.label) + '</option>'; }).join("") + '</select></div><div class="ic-field"><label for="ic-exposure-pct">Aposta sobre a banca inicial (%)</label><input id="ic-exposure-pct" name="exposure" inputmode="decimal" required value="' + Core.escapeHtml(query.p_exposicao_pct === null ? "" : String(query.p_exposicao_pct).replace(".", ",")) + '"></div><div class="ic-field"><label for="ic-exposure-risk">Tolerância histórica para atingir a perda indicada (%)</label><input id="ic-exposure-risk" name="risk" inputmode="decimal" required value="' + Core.escapeHtml(query.p_risco_maximo === null ? "" : String(query.p_risco_maximo * 100).replace(".", ",")) + '"></div></div>' + UI.button("Consultar sem alterar meu plano", { type: "submit", kind: "primary" }) + '</form>';
      if (state.exposureError) return form + UI.banner("Curva de exposição indisponível", "Não foi possível atualizar o modelo. As outras estatísticas não substituem essa consulta.", "neutral");
      if (!models.length) return form + UI.banner("Curva em formação", "Ainda não há recortes com saldo inicial e sessões elegíveis. Dados ausentes não são tratados como banca ou risco zero.", "neutral");
      return form + '<div class="ic-list">' + models.map(function (model) {
        var game = model.game || {}, sample = model.sample || {}, period = model.period || {};
        var eligible = model.curve_eligible === true && model.status === "validado_fora_amostra";
        var points = Core.normalizeArray(model.points).slice(0, 101).map(function (point) {
          var exposure = finiteMetric(point.exposure_pct), observed = probabilityValue(point.observed_rate), estimate = probabilityValue(point.estimate), lower = probabilityValue(point.lower), upper = probabilityValue(point.upper);
          var valid = eligible && point.in_support === true && exposure !== null && exposure > 0 && exposure <= 100 && estimate !== null && lower !== null && upper !== null && lower <= estimate && estimate <= upper;
          return UI.listRow(exposure === null ? "Exposição indisponível" : Core.formatPercent(exposure, 2) + " da banca inicial", "Observado: " + (observed === null ? "indisponível" : Core.formatPercent(observed * 100, 2)) + "; " + Core.safeText(point.sessions) + " sessões", valid ? "Estimativa: " + Core.formatPercent(estimate * 100, 2) + " (" + Core.formatPercent(lower * 100, 2) + "–" + Core.formatPercent(upper * 100, 2) + ")" : "Estimativa não liberada");
        }).join("");
        var target = model.adequacy || {}, estimate = probabilityValue(target.estimate), lower = probabilityValue(target.lower), upper = probabilityValue(target.upper), tolerance = probabilityValue(target.risk_tolerance);
        var targetExposure = finiteMetric(target.exposure_pct);
        var validTarget = eligible && target.in_support === true && ["dentro_tolerancia_historica", "acima_tolerancia_historica"].indexOf(target.status) >= 0 && targetExposure !== null && targetExposure > 0 && targetExposure <= 100 && estimate !== null && lower !== null && upper !== null && tolerance !== null && lower <= estimate && estimate <= upper && targetExposure === query.p_exposicao_pct && tolerance === query.p_risco_maximo && (target.status === "dentro_tolerancia_historica") === (upper <= tolerance);
        var targetText = validTarget ? (target.status === "dentro_tolerancia_historica" ? "Dentro da tolerância histórica consultada" : "Acima da tolerância histórica consultada") : target.status === "fora_suporte" ? "Percentual fora do suporte observado" : "Adequação ainda indisponível";
        var targetDetail = validTarget ? "Para " + Core.formatPercent(targetExposure, 2) + ", limite superior estimado de " + Core.formatPercent(upper * 100, 2) + "; tolerância escolhida: " + Core.formatPercent(tolerance * 100, 2) + ". Não significa que apostar seja seguro." : "Informe os parâmetros da consulta. Amostra, qualidade, suporte e validação futura precisam ser suficientes; não há extrapolação.";
        var source = ["pessoal", "comunidade", "ambos"].indexOf(model.scope) >= 0 ? sourceLabel(model.scope) : "Fonte não informada";
        var notes = Core.normalizeArray(model.limitations).filter(function (note) { return typeof note === "string"; }).slice(0, 12);
        return '<article class="ic-card"><div class="ic-card__header"><h3>' + Core.escapeHtml(model.game_label || "Jogo " + Core.safeText(game.id)) + '</h3>' + UI.badge(model.status || "amostra_insuficiente", model.status) + '</div><p>Evento analisado: perda de ' + Core.escapeHtml(Core.safeText(model.threshold_loss_pct)) + '% no mesmo recorte, em até ' + Core.escapeHtml(Core.safeText(period.fixed_horizon_paid_rounds)) + ' rodadas pagas. Sessões interrompidas antes desse horizonte são identificadas separadamente.</p><div class="ic-list">' + UI.listRow("Recorte", "Bet " + Core.safeText(game.bet_id) + " · versão " + Core.safeText(game.version_id) + " · " + Core.safeText(game.platform) + " · " + Core.safeText(game.mode), Core.safeText(model.currency)) + UI.listRow("Origem", source, "") + UI.listRow("Amostra", Core.safeText(sample.complete_sessions) + " sessões completas; " + Core.safeText(sample.censored_sessions) + " censuradas; " + Core.safeText(sample.users) + " usuários", "") + UI.listRow("Período", Core.formatDateTime(period.start) + " até " + Core.formatDateTime(period.end), "") + UI.listRow("Modelo", Core.safeText(model.model_version), "") + points + '</div>' + UI.banner(targetText, targetDetail, "neutral") + (notes.length ? '<p>' + Core.escapeHtml(notes.join(" ")) + '</p>' : '') + '<div class="ic-disclaimer">Associação observacional, não causal. O percentual de 0,5% é uma referência em análise, nunca um ótimo garantido. Esta consulta não determina a cor do relógio nem recomenda iniciar uma sessão.</div></article>';
      }).join("") + '</div>';
    }
    async function handleSubmit(form) {
      if (disposed || form.id !== "icExposureForm" || state.area !== "banca" || state.status === "loading") return;
      var values = new FormData(form), game = String(values.get("game") || "").trim();
      var exposure = finiteMetric(String(values.get("exposure") || "").trim().replace(",", ".")), risk = finiteMetric(String(values.get("risk") || "").trim().replace(",", "."));
      if ((game && !/^[1-9]\d*$/.test(game)) || exposure === null || exposure <= 0 || exposure > 100 || risk === null || risk < 0 || risk > 100) { UI.toast("Informe um percentual maior que zero e até 100%, e uma tolerância entre 0% e 100%."); return; }
      state.exposureQuery = { p_id_jogo: game || null, p_exposicao_pct: exposure, p_risco_maximo: risk / 100 };
      return load(true);
    }
    function sourceLabel(source) { return source === "pessoal" ? "seu histórico" : source === "comunidade" ? "comunidade elegível" : "seu histórico e comunidade elegível"; }
    function communityEligible(item) { return item.community_eligible !== false && item.comunidade_elegivel !== false && item.community_cell_eligible !== false && item.celula_comunitaria_elegivel !== false; }
    function openNotificationContext() {
      var context = deps.store.getState().statisticsNotificationContext;
      if (!context || context.section !== "estatisticas") return;
      deps.store.set({ statisticsNotificationContext: null });
      var period = [context.ocorrencia_inicio ? Core.formatDateTime(context.ocorrencia_inicio) : null, context.ocorrencia_fim ? Core.formatDateTime(context.ocorrencia_fim) : null].filter(Boolean).join(" até ");
      UI.openSheet({ eyebrow: "Lembrete de padrão histórico", title: "Ocorrência do padrão acompanhado", html: UI.banner("Direção histórica: " + Core.safeText(context.direcao_historica), "Fonte efetiva: " + sourceLabel(context.fonte_efetiva) + ". Chegou uma nova janela correspondente ao padrão histórico que você decidiu acompanhar.", "neutral") + '<div class="ic-list">' + UI.listRow("Escopo", "Estatística acompanhada", Core.safeText(context.escopo_estatistico)) + UI.listRow("Ocorrência atual", "Janela recorrente identificada", period || "Não informado") + UI.listRow("Versão da regra", "Critério usado para reconhecer esta ocorrência", Core.safeText(context.versao_regra)) + '</div><div class="ic-disclaimer">Este aviso não cria nem inicia Sessão Planejada e não prevê resultados futuros. Se a célula comunitária não for elegível, ela não é apresentada como origem efetiva.</div>' });
    }
    function render() {
      var html = UI.sectionHeader("Estatísticas", "Explore custo, exposição, comportamento e qualidade sem transformar associação em promessa.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">' + subnav();
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "unavailable") html += UI.state({ type: "unavailable", message: "Nenhuma análise estatística está habilitada pela política atual.", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content() + behavioralModels() + exposureModels();
      return html + '</div>';
    }
    function renderInto() { if (!disposed) deps.container.innerHTML = render(); }
    function findHypothesis(reference) { return patternsFromData(state.data || {}).find(function (item) { return String(patternCode(item)) === String(reference) || String(evidenceId(item)) === String(reference); }); }
    function subscriptionSheet(item) {
      var code = item.code || item.codigo, direction = item.direction || item.direcao || "descritiva";
      state.pendingHypothesis = item;
      var eligible = communityEligible(item);
      var html = UI.banner("Direção observada: " + direction, "Escolha quais dados devem sustentar o lembrete recorrente. Cada aviso identificará somente a fonte efetivamente elegível naquela ocorrência.", "neutral") + '<div class="ic-choice-grid">' + UI.button("Meu histórico", { action: "hypothesis-source", value: "pessoal" }) + UI.button("Comunidade", { action: "hypothesis-source", value: "comunidade" }) + UI.button("Ambos, quando elegíveis", { action: "hypothesis-source", value: "ambos", kind: "primary" }) + '</div>' + (!eligible ? UI.banner("Comunidade ainda sem evidência elegível", "Você pode registrar essa preferência agora. Nenhum aviso alegará origem comunitária até que a célula atenda aos critérios de amostra, qualidade, concentração e privacidade.", "neutral") : '') + (item.notification_active ? '<div class="ic-card__footer">' + UI.button("Desativar lembrete", { action: "hypothesis-unsubscribe", value: code, kind: "danger" }) + '</div>' : '') + '<div class="ic-disclaimer">Sem data fixa: o Turbo Tiger reconhecerá cada nova ocorrência da janela histórica. O aviso é descritivo e não prevê resultados.</div>';
      UI.openSheet({ eyebrow: code, title: "Lembrete de padrão histórico", html: html });
    }
    async function saveSubscription(source, active) {
      var item = state.pendingHypothesis;
      if (!item) return;
      try {
        await deps.api.rpc("ic_hipotese_notificacao_rpc", { p_id_insight_evidencia: evidenceId(item), p_escopo_estatistico: source, p_ativa: active }, { key: "statistics:bell" });
        if (disposed) return;
        UI.closeSheet(); UI.toast(active ? "Lembrete recorrente ativado." : "Lembrete recorrente desativado."); state.pendingHypothesis = null; state.status = "idle"; await load(true);
      } catch (error) { if (!disposed) UI.toast(error.message || "Não foi possível atualizar a assinatura."); }
    }
    async function handleAction(action, value) {
      if (disposed) return;
      if (action === "retry") return load(true);
      if (action === "stats-area" && availableAreas().some(function (area) { return area.id === value; })) { state.area = value; state.status = "idle"; deps.navigate({ section: "estatisticas", subsection: value }, true); load(true); }
      if (action === "hypothesis-detail") { var item = findHypothesis(value); if (item) UI.openSheet({ eyebrow: item.code || item.codigo, title: item.title || item.titulo || "Hipótese", html: UI.banner("Status: " + Core.safeText(item.status), item.description || item.descricao || "", item.status) + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-disclaimer">' + Core.escapeHtml(item.limitation || item.limitacao || "A causa não foi estabelecida e o resultado não prevê rodadas futuras.") + '</div>' }); }
      if (action === "hypothesis-bell") { var hypothesis = findHypothesis(value); if (hypothesis && isSubscribable(hypothesis)) subscriptionSheet(hypothesis); }
      if (action === "hypothesis-source" && ["pessoal", "comunidade", "ambos"].indexOf(value) >= 0) return saveSubscription(value, true);
      if (action === "hypothesis-unsubscribe") return saveSubscription((state.pendingHypothesis && (state.pendingHypothesis.notification_source || state.pendingHypothesis.fonte_notificacao || state.pendingHypothesis.scope || state.pendingHypothesis.escopo_estatistico)) || "ambos", false);
    }
    function dispose() { disposed = true; loadRevision += 1; state.data = null; state.protection = null; state.protectionError = null; state.exposure = null; state.exposureError = null; state.exposureQuery = {}; state.pendingHypothesis = null; }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, dispose: dispose };
  };
}(window));
