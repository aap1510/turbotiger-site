(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens.jogos = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, query: "", quality: "", order: "alphabetical", filters: {}, simulationGame: null, simulationBet: null, passport: null, simulating: false, simulationRequest: null };
    var disposed = false, passportRevision = 0;

    function currencyContext() {
      var bootstrap = deps.store.getState().bootstrap;
      return bootstrap && bootstrap.data || {};
    }

    async function load(force) {
      if (disposed || state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try {
        var result = await deps.api.rpc("ic_jogos_listar_rpc", { p_busca: state.query || null, p_qualidade: state.quality || null, p_ordenacao: state.order, p_filtros: state.filters, p_cursor: null, p_limite: 40 }, { key: "games:list" });
        if (disposed) return;
        state.status = "ready"; state.data = result.data || {}; state.error = null;
      } catch (error) { if (disposed || error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function selected(value, expected) { return value === expected ? " selected" : ""; }
    function filterValue(name) { return Core.safeText(state.filters[name], ""); }
    function filters() {
      return '<form class="ic-card ic-form" id="icGameFilters"><div class="ic-form-grid"><div class="ic-field"><label for="ic-game-search">Buscar jogo</label><input id="ic-game-search" name="query" type="search" maxlength="160" placeholder="Nome, provedor ou versão" value="' + Core.escapeHtml(state.query) + '"></div><div class="ic-field"><label for="ic-game-bet">Bet</label><input id="ic-game-bet" name="bet" maxlength="100" value="' + Core.escapeHtml(filterValue("bet")) + '"></div><div class="ic-field"><label for="ic-game-provider">Provedor</label><input id="ic-game-provider" name="provider" maxlength="120" value="' + Core.escapeHtml(filterValue("provider")) + '"></div><div class="ic-field"><label for="ic-game-version">Versão</label><input id="ic-game-version" name="version" maxlength="100" value="' + Core.escapeHtml(filterValue("version")) + '"></div><div class="ic-field"><label for="ic-game-platform">Plataforma</label><select id="ic-game-platform" name="platform"><option value="">Todas</option><option value="mobile"' + selected(filterValue("platform"), "mobile") + '>Mobile</option><option value="web"' + selected(filterValue("platform"), "web") + '>Web</option></select></div><div class="ic-field"><label for="ic-game-currency">Moeda</label><select id="ic-game-currency" name="currency">' + Core.currencyOptions(currencyContext(), filterValue("currency"), "Todas") + '</select></div><div class="ic-field"><label for="ic-game-quality">Qualidade</label><select id="ic-game-quality" name="quality"><option value="">Todas</option><option value="alta"' + selected(state.quality, "alta") + '>Alta</option><option value="moderada"' + selected(state.quality, "moderada") + '>Moderada</option><option value="baixa"' + selected(state.quality, "baixa") + '>Baixa</option><option value="insuficiente"' + selected(state.quality, "insuficiente") + '>Insuficiente</option></select></div><div class="ic-field"><label for="ic-game-rounds">Mínimo de rodadas</label><input id="ic-game-rounds" name="minimum_rounds" type="number" min="0" step="1" value="' + Core.escapeHtml(filterValue("minimum_rounds")) + '"></div><div class="ic-field"><label for="ic-game-order">Ordenar</label><select id="ic-game-order" name="order"><option value="alphabetical"' + selected(state.order, "alphabetical") + '>Ordem alfabética</option><option value="coverage"' + selected(state.order, "coverage") + '>Maior cobertura</option><option value="rounds"' + selected(state.order, "rounds") + '>Quantidade de rodadas</option></select></div></div>' + UI.button("Pesquisar", { type: "submit", icon: "search", kind: "primary" }) + '</form>';
    }

    function games() {
      var data = state.data || {}, items = Core.normalizeArray(data.items || data.itens);
      if (!items.length) return UI.state({ type: data.status === "amostra_insuficiente" ? "insufficient_data" : "empty", message: data.message || data.mensagem, retry: false });
      return '<div class="ic-grid ic-grid--cards">' + items.map(function (item) { var integrityBadge = deps.featureEnabled("ic_integrity_monitor_enabled") ? UI.badge(item.integrity_status || item.status_integridade || "dados insuficientes", item.integrity_status || item.status_integridade) : ""; return '<article class="ic-card ic-game-card"><div><h3>' + Core.escapeHtml(item.name || item.nome || "Jogo") + '</h3><p>' + Core.escapeHtml(item.provider || item.provedor || "Provedor não identificado") + ' · versão ' + Core.escapeHtml(item.version || item.versao || "não identificada") + '</p></div>' + integrityBadge + '<div class="ic-game-card__stats">' + UI.metric("Rodadas", Core.safeText(item.rounds || item.rodadas || 0)) + UI.metric("Retorno pago", item.observed_return !== undefined || item.retorno_observado !== undefined ? Core.formatPercent(item.observed_return !== undefined ? item.observed_return : item.retorno_observado, 2) : "—") + UI.metric("Hit rate", item.hit_rate !== undefined ? Core.formatPercent(item.hit_rate, 1) : "—") + UI.metric("Qualidade", Core.safeText(item.quality || item.qualidade || "insuficiente")) + '</div><div class="ic-card__footer">' + UI.button("Passaporte Matemático", { action: "passport", value: item.id || item.id_jogo, icon: "chart" }) + '</div></article>'; }).join("") + '</div><div class="ic-disclaimer">A lista nunca é ordenada por “melhor jogo”. Retorno observado não indica quando um jogo pagará.</div>';
    }

    function render() {
      var html = UI.sectionHeader("Jogos", deps.featureEnabled("ic_integrity_monitor_enabled") ? "Compare cobertura, volatilidade e integridade — não promessa de resultado." : "Compare cobertura e volatilidade — não promessa de resultado.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">' + filters();
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += games();
      return html + '</div>';
    }

    function renderInto() { if (!disposed) deps.container.innerHTML = render(); }
    function analyticalEvidence(item) {
      var principal = item.primary_subledger || {}, sample = item.sample || principal.sample || {}, period = item.period || principal.period || {}, evidence = item.evidence || {};
      var privacy = item.privacy || principal.privacy || {}, users = sample.users !== undefined ? sample.users : privacy.community_users;
      var sessions = sample.sessions !== undefined ? sample.sessions : privacy.community_sessions;
      var source = item.source_scope === "personal" ? "Seu histórico" : item.source_scope === "community" ? "Comunidade elegível" : item.inputs ? "Seu histórico — simulação empírica" : "Fonte não informada";
      return '<div class="ic-list">' + UI.listRow("Fonte", source, "") + UI.listRow("Amostra", Core.safeText(sample.paid_rounds) + " rodadas pagas; " + Core.safeText(sessions) + " sessões; " + Core.safeText(users) + " usuários", "") + UI.listRow("Período", Core.formatDateTime(period.start || sample.period_start) + " até " + Core.formatDateTime(period.end || sample.period_end), "") + UI.listRow("Método", typeof evidence.method === "string" ? evidence.method : Core.safeText(item.version), "") + UI.listRow("Atualização", Core.formatDateTime(item.updated_at || principal.updated_at), "") + '</div>';
    }
    function passportMetrics(item) {
      return '<div class="ic-grid ic-grid--metrics">' + UI.metric("RTP declarado", Core.formatPercent(item.declared_rtp, 2)) + UI.metric("Retorno observado (rodadas pagas)", Core.formatPercent(item.observed_return, 2)) + UI.metric("Retorno bruto de free spins", Core.formatMoney(item.bonus_return_units, item.currency, item.decimal_places), "Valor monetário separado do retorno das rodadas pagas.") + UI.metric("Volatilidade observada", volatilityText(item.volatility)) + UI.metric("Rodadas", Core.safeText(item.rounds)) + UI.metric("Versão", Core.safeText(item.game_version || item.version, "não identificada")) + '</div>';
    }
    function passportScope(item) {
      var scope = item.primary_subledger || item;
      var declared = item.declared_rtp_scope === "paid_only" ? "Somente rodadas pagas" : item.declared_rtp_scope === "total_including_bonus" ? "Total, incluindo bônus" : "Não identificado";
      var comparable = item.rtp_comparability_status === "comparable_paid_only";
      return '<div class="ic-list">' + UI.listRow("Recorte", "Bet " + Core.safeText(scope.bet_id) + " · " + Core.safeText(scope.mode), Core.safeText(item.currency) + " · " + Core.safeText(item.decimal_places) + " casas decimais") + UI.listRow("Escopo do RTP declarado", declared, "") + '</div>' + UI.banner(comparable ? "Componentes comparáveis" : "Comparação não liberada", comparable ? "A referência declarada corresponde ao componente pago observado. Isso não certifica o jogo nem prevê resultados." : "O escopo declarado ou o vínculo do ciclo de bônus não permite comparar os componentes com segurança. Isso não demonstra falha do jogo.", "neutral");
    }
    function volatilityText(value) {
      if (value && typeof value === "object") {
        if (value.metric !== "gross_multiplier_stddev" || typeof value.stddev !== "number" || !Number.isFinite(value.stddev) || value.stddev < 0) return "não calculada";
        return value.stddev.toLocaleString("pt-BR", { maximumFractionDigits: 3 }) + "× (desvio-padrão)";
      }
      return Core.safeText(value, "não calculada");
    }
    async function handleAction(action, value) {
      if (disposed) return;
      if (action === "retry") return load(true);
      if (action === "passport") {
        var revision = ++passportRevision;
        UI.openSheet({ eyebrow: "Passaporte Matemático", title: "Carregando dados do jogo", html: UI.state({ type: "loading", retry: false }) });
        try {
          var result = await deps.api.rpc("ic_passaporte_jogo_rpc", { p_id_jogo: value }, { key: "games:passport" });
          if (disposed || revision !== passportRevision) return;
          var item = result.data || {};
          state.passport = { game: String(value), data: item };
          var integrityMessages = Core.normalizeArray(item.integrity_messages).filter(function (entry) { return entry && typeof entry.message === "string"; }).slice(0, 12);
          var integrity = deps.featureEnabled("ic_integrity_monitor_enabled") ? (integrityMessages.length ? integrityMessages.map(function (entry) { return UI.banner("Integridade: " + Core.safeText(entry.status), entry.message, entry.status); }).join("") : UI.banner(item.integrity_label || "Integridade", item.integrity_message || "Não há justificativa detalhada disponível para este recorte.", item.integrity_status)) : "";
          var html = integrity + passportMetrics(item) + passportScope(item) + analyticalEvidence(item);
          var principalId = item.primary_subledger && item.primary_subledger.passport_id;
          var others = Core.normalizeArray(item.monetary_subledgers).filter(function (ledger) { return principalId === undefined || String(ledger.passport_id) !== String(principalId); });
          if (others.length) html += '<div class="ic-list">' + others.map(function (ledger) { return '<details class="ic-card"><summary>' + Core.escapeHtml("Bet " + Core.safeText(ledger.bet_id) + " · versão " + Core.safeText(ledger.game_version) + " · " + Core.safeText(ledger.currency) + " · " + Core.safeText(ledger.mode)) + '</summary>' + passportMetrics(ledger) + passportScope(ledger) + analyticalEvidence(ledger) + '</details>'; }).join("") + '</div>';
          html += '<div class="ic-disclaimer">O Turbo Tiger não assume RTP padrão. Retorno apenas das rodadas pagas não é diretamente comparável a um RTP declarado que inclua bônus. Moedas e recortes não são somados.</div>';
          if (deps.featureEnabled("ic_session_risk_enabled")) html += UI.button("Simular exposição da sessão", { action: "simulate", value: value, icon: "shield" });
          UI.openSheet({ eyebrow: "Passaporte Matemático", title: item.name || item.nome || "Jogo", html: html });
        } catch (error) { if (!disposed && revision === passportRevision) UI.openSheet({ eyebrow: "Passaporte Matemático", title: "Dados indisponíveis", html: UI.state({ type: error.code === "offline" ? "offline" : "error", message: error.message }) }); }
      }
      if (action === "simulate" && deps.featureEnabled("ic_session_risk_enabled")) {
        state.simulationGame = value;
        state.simulationBet = state.passport && state.passport.game === String(value) && state.passport.data.primary_subledger ? state.passport.data.primary_subledger.bet_id : null;
        UI.openSheet({ eyebrow: "Antes da decisão", title: "Simular risco da sessão", html: UI.banner("Estimativa condicionada", "A simulação usa uma distribuição histórica elegível. Não prevê rodadas, não garante perdas máximas e pode subestimar eventos raros não observados.", "attention") + '<form class="ic-form" id="icRiskForm"><div class="ic-field"><label for="ic-risk-currency">Moeda</label><select id="ic-risk-currency" name="currency" required>' + Core.currencyOptions(currencyContext(), state.filters.currency || "") + '</select></div><div class="ic-field"><label for="ic-risk-stake">Valor por rodada</label><input id="ic-risk-stake" name="stake" inputmode="decimal" required></div><div class="ic-field"><label for="ic-risk-limit">Limite máximo de perda</label><input id="ic-risk-limit" name="loss_limit" inputmode="decimal" required></div><div class="ic-field"><label for="ic-risk-rounds">Quantidade prevista de rodadas</label><input id="ic-risk-rounds" name="rounds" type="number" min="1" max="500" step="1" required></div>' + UI.button("Calcular estimativa", { type: "submit", kind: "primary" }) + '</form>' });
      }
    }
    async function simulate(form) {
      if (disposed || state.simulating || !state.simulationGame) return;
      var values = new FormData(form), definition = Core.currencyCatalog(currencyContext()).find(function (item) { return item.code === values.get("currency"); });
      if (!definition) { UI.toast("Selecione uma moeda validada."); return; }
      var params = { game_id: state.simulationGame, currency: definition.code, decimal_places: definition.decimal_places, stake_units: Core.parseMoneyToUnitsText(values.get("stake"), definition.decimal_places), loss_limit_units: Core.parseMoneyToUnitsText(values.get("loss_limit"), definition.decimal_places), rounds: Number(values.get("rounds")) };
      if (state.simulationBet !== null && state.simulationBet !== undefined) params.bet_id = state.simulationBet;
      if (Core.unitsSign(params.stake_units) <= 0 || Core.unitsSign(params.loss_limit_units) <= 0 || !Number.isInteger(params.rounds) || params.rounds < 1 || params.rounds > 500) { UI.toast("Revise aposta, limite e quantidade de rodadas."); return; }
      state.simulating = true;
      try {
        var fingerprint = JSON.stringify(params);
        if (!state.simulationRequest || state.simulationRequest.fingerprint !== fingerprint) state.simulationRequest = { fingerprint: fingerprint, seed: root.crypto.randomUUID() };
        params.seed = state.simulationRequest.seed;
        var response = await deps.api.rpc("ic_simular_sessao_rpc", { p_parametros: params }, { key: "games:simulation" }), data = response.data || {};
        if (disposed) return;
        var metrics = data.metrics || data;
        var uncertainty = metrics.simulation_uncertainty || {}, chance = metrics.chance_hit_limit;
        var available = data.status === "disponivel" && typeof chance === "number" && Number.isFinite(chance) && chance >= 0 && chance <= 1 && uncertainty.method === "wilson_95" && typeof uncertainty.lower === "number" && typeof uncertainty.upper === "number" && uncertainty.lower >= 0 && uncertainty.lower <= chance && chance <= uncertainty.upper && uncertainty.upper <= 1 && Number.isSafeInteger(uncertainty.simulations) && uncertainty.simulations > 0 && Number.isSafeInteger(metrics.hit_count) && metrics.hit_count >= 0 && metrics.hit_count <= uncertainty.simulations && Math.abs(metrics.hit_count / uncertainty.simulations - chance) <= 1e-8;
        var content = available ? '<div class="ic-grid ic-grid--metrics">' + UI.metric("Atingir o limite", Core.formatPercent(metrics.chance_hit_limit * 100, 1)) + [["Perda mediana", "median_loss_units"], ["VaR 95%", "var95_units"], ["Média dos piores 5%", "cvar95_units"], ["Drawdown percentil 95", "drawdown_p95_units"], ["Perda média simulada", "expected_loss_units"]].map(function (metric) { return UI.metric(metric[0], Core.formatMoney(metrics[metric[1]], params.currency, params.decimal_places)); }).join("") + '</div>' : UI.state({ type: "insufficient_quality", title: "Estimativa indisponível", message: data.message || "A versão, a captura ou a amostra ainda não atendem aos critérios do modelo.", retry: false });
        if (available) content += UI.listRow("Incerteza numérica da simulação (Wilson 95%)", Core.formatPercent(uncertainty.lower * 100, 2) + " a " + Core.formatPercent(uncertainty.upper * 100, 2), Core.safeText(metrics.hit_count) + " cenários atingiram o limite em " + Core.safeText(uncertainty.simulations) + " simulações");
        content += analyticalEvidence(data) + UI.listRow("Recorte da simulação", "Bet " + Core.safeText(data.inputs && data.inputs.bet_id) + " · versão " + Core.safeText(data.sample && data.sample.game_version_id), "") + UI.banner("Incerteza do modelo", "A simulação usa apenas os multiplicadores observados. Prêmios raros ainda não capturados permanecem desconhecidos; a incerteza numérica da simulação não elimina essa limitação.", "neutral") + UI.banner("Limite aplicado após cada rodada", "A rodada que cruza o limite pode ultrapassá-lo. O resultado depende das condições e da amostra, não representa garantia e não recomenda iniciar uma sessão.", "neutral");
        UI.openSheet({ eyebrow: "Simulação reprodutível", title: "Distribuição estimada da sessão", html: content });
      } catch (error) { if (!disposed) UI.toast(error.message || "Não foi possível concluir a simulação."); }
      finally { state.simulating = false; }
    }
    function handleSubmit(form) { if (disposed) return; if (form.id === "icRiskForm") return simulate(form); if (form.id !== "icGameFilters") return; var values = new FormData(form); state.query = String(values.get("query") || "").trim(); state.quality = String(values.get("quality") || ""); state.order = String(values.get("order") || "alphabetical"); state.filters = {}; ["bet", "provider", "version", "platform", "currency", "minimum_rounds"].forEach(function (key) { var value = String(values.get(key) || "").trim(); if (value) state.filters[key] = value; }); state.status = "idle"; load(true); }
    function dispose() { disposed = true; passportRevision += 1; state.data = null; state.passport = null; state.simulationGame = null; state.simulationBet = null; state.simulationRequest = null; }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, dispose: dispose };
  };
}(window));
