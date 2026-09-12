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
        var actions = isSubscribable(item) ? UI.button(item.notification_active || item.notificacao_ativa ? "Gerenciar lembrete" : "Lembrar deste padrão", { action: "community-subscribe", value: evidenceId(item), icon: "bell", kind: item.notification_active || item.notificacao_ativa ? "gold" : "quiet" }) : "";
        if (deps.featureEnabled("ic_community_plan_enabled") && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled") && !item.planning_blocked && !item.planejamento_bloqueado) actions += UI.button("Usar como contexto do plano", { action: "community-plan", value: index, icon: "calendar" });
        var effective = item.effective_source || item.fonte_efetiva;
        var detail = item.details || item.detalhes || {};
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || patternCode(item) || "Padrão") + '</h3><p>Direção observada: ' + Core.escapeHtml(direction === "melhor_historico" ? "acima da referência" : direction === "pior_historico" ? "abaixo da referência" : direction) + '. ' + Core.escapeHtml(item.message || item.mensagem || "") + (effective ? ' Origem efetiva da última atualização: ' + Core.escapeHtml(effective === "pessoal" ? "seu histórico" : effective === "comunidade" ? "comunidade elegível" : "seu histórico e comunidade elegível") + '.' : '') + '</p></div>' + UI.badge(item.status || "descritivo", item.status) + '</div><div class="ic-list">' + UI.listRow("Retorno observado", "Diferença: " + Core.safeText(detail.difference_pp) + " p.p.", detail.observed_rtp_pct == null ? "—" : Core.formatPercent(detail.observed_rtp_pct, 2)) + UI.listRow("Amostra", Core.safeText(detail.sessions || 0) + " sessões", Core.safeText(detail.rounds || 0) + " rodadas") + UI.listRow("Multiplicadores", "≥5x: " + Core.safeText(detail.multiplier_5x || 0) + " · ≥10x: " + Core.safeText(detail.multiplier_10x || 0) + " · ≥50x: " + Core.safeText(detail.multiplier_50x || 0), "máx. " + Core.safeText(detail.largest_multiplier || 0) + "x") + UI.listRow("Sensibilidade", "Retorno sem o maior pagamento", detail.rtp_without_largest_return_pct == null ? "—" : Core.formatPercent(detail.rtp_without_largest_return_pct, 2)) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + actions + '</div></article>';
      }).join("") + '</div></section>';
    }

    function communityPatterns() { var data = state.data || {}; return Core.normalizeArray(data.patterns || data.padroes || data.hypotheses || data.hipoteses); }
    function evidenceId(item) { return Core.validUuid(item && (item.id_insight_evidencia || item.insight_evidence_id || item.uuid_insight_evidencia || item.evidence_id)); }
    function temporalRule(item) { return item && (item.temporal_rule_id || item.id_regra_temporal || item.temporal_rule_code || item.codigo_regra_temporal || item.temporal_rule || item.regra_temporal); }
    function isSubscribable(item) {
      var status = String(item && (item.status || item.evidence_status || item.status_evidencia) || "").toLowerCase();
      return !!(patternCode(item) && evidenceId(item) && temporalRule(item) && (item.notification_eligible === true || item.notificacao_elegivel === true || item.subscription_eligible === true || item.assinatura_elegivel === true) && (item.evidence_eligible === true || item.evidencia_elegivel === true) && !/explorat|observacao_inicial|observação_inicial|ruido|ruído|insuficiente/.test(status));
    }
    function communityEligible(item) { return item.community_eligible !== false && item.comunidade_elegivel !== false && item.community_cell_eligible !== false && item.celula_comunitaria_elegivel !== false; }
    function subscriptionSheet(item) {
      state.pendingSubscription = item;
      var direction = item.direction || item.direcao || "descritiva";
      var eligible = communityEligible(item);
      var html = UI.banner("Direção observada: " + direction, "Escolha quais dados devem sustentar o lembrete recorrente. Cada aviso identificará somente a fonte efetivamente elegível naquela ocorrência.", "neutral") + '<div class="ic-choice-grid">' + UI.button("Meu histórico", { action: "community-source", value: "pessoal" }) + UI.button("Comunidade", { action: "community-source", value: "comunidade" }) + UI.button("Ambos, quando elegíveis", { action: "community-source", value: "ambos", kind: "primary" }) + '</div>' + (!eligible ? UI.banner("Comunidade ainda sem evidência elegível", "Você pode registrar essa preferência agora. Nenhum aviso alegará origem comunitária até que a célula atenda aos critérios de amostra, qualidade, concentração e privacidade.", "neutral") : '') + (item.notification_active || item.notificacao_ativa ? '<div class="ic-card__footer">' + UI.button("Desativar lembrete", { action: "community-unsubscribe", kind: "danger" }) + '</div>' : '') + '<div class="ic-disclaimer">Sem data fixa: o Turbo Tiger reconhecerá cada nova ocorrência da janela histórica. O aviso não marca uma sessão e não prevê resultados.</div>';
      UI.openSheet({ eyebrow: patternCode(item), title: "Lembrete de padrão histórico", html: html });
    }
    async function saveSubscription(source, active) {
      var item = state.pendingSubscription;
      if (!item || !patternCode(item)) return;
      try {
        await deps.api.rpc("ic_hipotese_notificacao_rpc", { p_id_insight_evidencia: evidenceId(item), p_escopo_estatistico: source, p_ativa: active }, { key: "community:subscription" });
        UI.closeSheet(); UI.toast(active ? "Lembrete recorrente ativado." : "Lembrete recorrente desativado."); state.pendingSubscription = null; state.status = "idle"; await load(true);
      } catch (error) { UI.toast(error.message || "Não foi possível atualizar a assinatura."); }
    }

    function render() {
      var html = UI.sectionHeader("Comunidade", "Aprendizado agregado para medir risco e disciplina sem identificar pessoas.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }
    function renderInto() { deps.container.innerHTML = render(); }
    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      var item = communityPatterns()[Number(value)];
      if (action === "community-subscribe") { var subscription = communityPatterns().find(function (candidate) { return String(evidenceId(candidate)) === String(value); }); if (subscription && isSubscribable(subscription)) subscriptionSheet(subscription); }
      if (action === "community-plan" && item && deps.featureEnabled("ic_community_plan_enabled")) { deps.store.set({ planningDraft: item }); deps.navigate({ section: "planejar" }); UI.toast("Confirme data futura, duração, limite e lembrete antes de criar o plano."); }
      if (action === "community-source" && ["pessoal", "comunidade", "ambos"].indexOf(value) >= 0) return saveSubscription(value, true);
      if (action === "community-unsubscribe") return saveSubscription((state.pendingSubscription && (state.pendingSubscription.notification_source || state.pendingSubscription.fonte_notificacao || state.pendingSubscription.scope || state.pendingSubscription.escopo_estatistico)) || "ambos", false);
    }
    return { render: render, load: load, handleAction: handleAction };
  };
}(window));
