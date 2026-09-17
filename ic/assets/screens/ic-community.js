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
      var rows = metrics.map(function (item) { return UI.metric(item.label || item.rotulo, item.formatted_value || item.valor_formatado || Core.safeText(item.value || item.valor), item.detail || item.detalhe); }).join("");
      var initial = data.source === "base_experimental_inicial";
      var heading = initial ? "Base experimental inicial Turbo Tiger" : "Agregação protegida";
      var explanation = initial ? "Mais de 200 mil rodadas de testes reais já formam a referência inicial. Hoje há um contribuidor; isso é mostrado com transparência e será enriquecido pelos próximos usuários." : "Resultados comunitários usam pseudonimização, supressão e limite de contribuição por usuário.";
      return UI.banner(heading, explanation, initial ? "neutral" : "control") + (rows ? '<div class="ic-grid ic-grid--metrics">' + rows + '</div>' : UI.state({ type: "empty", message: "Nenhuma métrica foi liberada para este recorte.", retry: false })) + renderPatterns(data.patterns || data.padroes || data.hypotheses || data.hipoteses || []) + '<section class="ic-card"><div class="ic-card__header"><div><h3>Como interpretar</h3><p>Volume total, multiplicadores e experiência típica respondem perguntas diferentes.</p></div></div><div class="ic-list">' + UI.listRow("Fonte atual", initial ? "Base histórica de testes do primeiro usuário" : "Comunidade elegível", Core.safeText(data.source_label || "")) + UI.listRow("Diversidade", initial ? "Um contribuidor, explicitamente identificado como base inicial" : "Múltiplos contribuidores protegidos", Core.safeText(data.users || 0) + " usuário(s)") + UI.listRow("Evidência", "Associação descritiva; não causal e não preditiva.", Core.safeText(data.status)) + '</div></section>' + '<div class="ic-disclaimer">Os padrões mostram dias, semanas, tipos de dia e horários com resultados históricos diferentes. O multiplicador mede a dimensão das premiações. Nenhum padrão prevê o próximo resultado.</div>';
    }

    function patternCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese); }
    function renderPatterns(items) {
      items = Core.normalizeArray(items).slice(0, 60);
      if (!items.length) return "";
      return '<section><div class="ic-card__header"><div><h3>Padrões históricos</h3><p>Melhores e piores resultados por jogo, dia, semana, tipo de dia e horário.</p></div></div><div class="ic-list">' + items.map(function (item, index) {
        var direction = item.direction || item.direcao || "descritiva";
        var actions = "";
        if (deps.featureEnabled("ic_community_plan_enabled") && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled") && !item.planning_blocked && !item.planejamento_bloqueado) actions += UI.button("Usar como contexto do plano", { action: "community-plan", value: index, icon: "calendar" });
        var effective = item.effective_source || item.fonte_efetiva;
        var detail = item.details || item.detalhes || {};
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || patternCode(item) || "Padrão") + '</h3><p>Direção observada: ' + Core.escapeHtml(direction === "melhor_historico" ? "acima da referência" : direction === "pior_historico" ? "abaixo da referência" : direction) + '. ' + Core.escapeHtml(item.message || item.mensagem || "") + (effective ? ' Origem efetiva da última atualização: ' + Core.escapeHtml(effective === "pessoal" ? "seu histórico" : effective === "comunidade" ? "comunidade elegível" : "seu histórico e comunidade elegível") + '.' : '') + '</p></div>' + UI.badge(item.status || "descritivo", item.status) + '</div><div class="ic-list">' + UI.listRow("Retorno observado", "Diferença: " + Core.safeText(detail.difference_pp) + " p.p.", detail.observed_rtp_pct == null ? "—" : Core.formatPercent(detail.observed_rtp_pct, 2)) + UI.listRow("Amostra", Core.safeText(detail.sessions || 0) + " sessões", Core.safeText(detail.rounds || 0) + " rodadas") + UI.listRow("Multiplicadores", "≥5x: " + Core.safeText(detail.multiplier_5x || 0) + " · ≥10x: " + Core.safeText(detail.multiplier_10x || 0) + " · ≥50x: " + Core.safeText(detail.multiplier_50x || 0), "máx. " + Core.safeText(detail.largest_multiplier || 0) + "x") + UI.listRow("Sensibilidade", "Retorno sem o maior pagamento", detail.rtp_without_largest_return_pct == null ? "—" : Core.formatPercent(detail.rtp_without_largest_return_pct, 2)) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + actions + '</div></article>';
      }).join("") + '</div></section>';
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
