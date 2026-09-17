(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens.comunidade = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, pendingSubscription: null };

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try { var result = await deps.api.rpc("ic_relatorio_comunidade_rpc", { p_recorte: {} }, { key: "community:summary" }); state.status = "ready"; state.data = result.data || {}; state.error = null; }
      catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function content() {
      var data = state.data || {};
      if (data.status === "amostra_insuficiente" || data.sample_sufficient === false || data.amostra_suficiente === false) {
        return '<section class="ic-card ic-community-gate">' + UI.icon("community") + '<h3>A comunidade ainda não possui amostra suficiente para este recorte.</h3><p>Os dados permanecem protegidos até atingirem os mínimos de usuários, sessões, concentração e qualidade.</p><div>' + UI.badge("Usuários: " + Core.safeText(data.users || data.usuarios || 1), "neutral") + ' ' + UI.badge("amostra_insuficiente", "neutral") + '</div>' + UI.evidence(data.evidence || data.evidencia || data) + '</section>';
      }
      var metrics = Core.normalizeArray(data.metrics || data.metricas);
      var rows = metrics.map(function (item) { var label = item.label || item.rotulo, value = item.value == null ? item.valor : item.value; return UI.metric(label, item.formatted_value || item.valor_formatado || (Core.formatNumber(value) + (/multiplicador/i.test(label) ? "×" : "")), item.detail || item.detalhe); }).join("");
      var initial = data.source === "base_experimental_inicial";
      var heading = initial ? "Base experimental inicial Turbo Tiger" : "Agregação protegida";
      var explanation = initial ? "Histórico real de testes, com análises exploratórias. Consulte a amostra e o período de cada resultado." : "Estatísticas agregadas, sem identificar os participantes.";
      return UI.banner(heading, explanation, initial ? "neutral" : "control") + (rows ? '<div class="ic-grid ic-grid--metrics">' + rows + '</div>' : UI.state({ type: "empty", message: "Nenhuma métrica foi liberada para este recorte.", retry: false })) + renderPatterns(data.patterns || data.padroes || data.hypotheses || data.hipoteses || []) + '<section class="ic-card"><div class="ic-card__header"><div><h3>Como interpretar</h3><p>Volume total, multiplicadores e experiência típica respondem perguntas diferentes.</p></div></div><div class="ic-list">' + UI.listRow("Fonte atual", initial ? "Base histórica de testes do primeiro usuário" : "Comunidade elegível", Core.safeText(data.source_label || "")) + UI.listRow("Diversidade", initial ? "Um contribuidor, explicitamente identificado como base inicial" : "Múltiplos contribuidores protegidos", Core.safeText(data.users || 0) + " usuário(s)") + UI.listRow("Evidência", "Associação descritiva; não causal e não preditiva.", Core.safeText(data.status)) + '</div></section>' + '<div class="ic-disclaimer">Os padrões mostram dias, semanas, tipos de dia e horários com resultados históricos diferentes. O multiplicador mede a dimensão das premiações. Nenhum padrão prevê o próximo resultado.</div>';
    }

    function patternCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese); }
    function renderPatterns(items) {
      items = Core.normalizeArray(items);
      if (!items.length) return "";
      var groups = new Map();
      items.forEach(function (item, index) {
        var name = String(item.game_name || item.jogo || item.title || item.titulo || "Outros recortes").split(" · ")[0];
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push({ item: item, index: index });
      });
      function card(entry) {
        var item = entry.item, index = entry.index;
        var direction = item.direction || item.direcao || "descritiva";
        var actions = "";
        if (deps.featureEnabled("ic_community_plan_enabled") && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled") && !item.planning_blocked && !item.planejamento_bloqueado) actions += UI.button("Usar como contexto do plano", { action: "community-plan", value: index, icon: "calendar" });
        var effective = item.effective_source || item.fonte_efetiva;
        var detail = item.details || item.detalhes || {};
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || patternCode(item) || "Padrão") + '</h3><p>' + Core.escapeHtml(direction === "melhor_historico" ? "Melhores resultados históricos" : direction === "pior_historico" ? "Piores resultados históricos" : "Resultado histórico") + '</p></div>' + UI.badge(item.status || "descritivo", item.status) + '</div><div class="ic-list">' + UI.listRow("Retorno observado", "Diferença da referência: " + Core.formatNumber(detail.difference_pp) + " p.p.", Core.formatPercent(detail.observed_rtp_pct, 2)) + UI.listRow("Amostra", Core.countLabel(detail.sessions || 0, "sessão", "sessões"), Core.countLabel(detail.rounds || 0, "rodada", "rodadas")) + UI.listRow("Premiações", "≥5×: " + Core.formatNumber(detail.multiplier_5x || 0, 0) + " · ≥10×: " + Core.formatNumber(detail.multiplier_10x || 0, 0) + " · ≥50×: " + Core.formatNumber(detail.multiplier_50x || 0, 0), "máx. " + Core.formatNumber(detail.largest_multiplier) + "×") + '</div>' + (Number(detail.sessions) < 3 ? '<p class="ic-disclaimer">Pouca repetição: este recorte ainda não demonstra estabilidade.</p>' : '') + '<details class="ic-form-section"><summary>Entender este resultado</summary><p>' + Core.escapeHtml(item.message || item.mensagem || "Associação histórica, não uma previsão.") + '</p>' + UI.listRow("Sem o maior pagamento", "Mostra a influência do prêmio extremo", Core.formatPercent(detail.rtp_without_largest_return_pct, 2)) + UI.evidence(item.evidence || item.evidencia || item) + '</details><div class="ic-card__footer">' + actions + '</div></article>';
      }
      var grouped = Array.from(groups.entries()).map(function (group) {
        var ordered = group[1].slice().sort(function (a, b) { return Number((b.item.details || {}).sessions || 0) - Number((a.item.details || {}).sessions || 0) || Number((b.item.details || {}).rounds || 0) - Number((a.item.details || {}).rounds || 0); });
        var selected = [];
        ["melhor_historico", "pior_historico"].forEach(function (direction) { var entry = ordered.find(function (row) { return (row.item.direction || row.item.direcao) === direction; }); if (entry) selected.push(entry); });
        if (!selected.length) selected = ordered.slice(0, 2);
        var remaining = ordered.filter(function (entry) { return selected.indexOf(entry) < 0; });
        return '<details class="ic-card ic-form-section"><summary>' + Core.escapeHtml(group[0]) + ' · ' + Core.countLabel(ordered.length, "recorte", "recortes") + '</summary><p>Os recortes podem compartilhar rodadas. Não são confirmações independentes.</p><div class="ic-list">' + selected.map(card).join("") + '</div>' + (remaining.length ? '<details class="ic-form-section"><summary>Ver outros dias e horários (' + remaining.length + ')</summary><div class="ic-list">' + remaining.map(card).join("") + '</div></details>' : '') + '</details>';
      }).join("");
      return '<section><h3>Resultados por jogo</h3><p>Abra um jogo para comparar os recortes com maior número de sessões. Retorno e tamanho das premiações são medidas diferentes.</p><div class="ic-list">' + grouped + '</div></section>';
    }

    function communityPatterns() { var data = state.data || {}; return Core.normalizeArray(data.patterns || data.padroes || data.hypotheses || data.hipoteses); }
    function render() {
      var html = UI.sectionHeader("Comunidade", "Aprendizado agregado para medir risco e disciplina sem identificar pessoas.", UI.button("Meus alertas", { route: "configuracoes", icon: "bell" }) + UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }
    function renderInto() { deps.container.innerHTML = render(); }
    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      var item = communityPatterns()[Number(value)];
      if (action === "community-plan" && item && deps.featureEnabled("ic_community_plan_enabled")) { deps.store.set({ planningDraft: item }); deps.navigate({ section: "planejar" }); UI.toast("Confirme data futura, duração, limite e lembrete antes de criar o plano."); }
    }
    return { render: render, load: load, handleAction: handleAction };
  };
}(window));
