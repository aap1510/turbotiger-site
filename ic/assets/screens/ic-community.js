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
      return UI.banner("Agregação protegida", "Resultados comunitários usam pseudonimização, supressão e limite de contribuição por usuário.", "control") + (rows ? '<div class="ic-grid ic-grid--metrics">' + rows + '</div>' : UI.state({ type: "empty", message: "Nenhuma métrica comunitária foi liberada para este recorte.", retry: false })) + renderPatterns(data.patterns || data.padroes || data.hypotheses || data.hipoteses || []) + '<section class="ic-card"><div class="ic-card__header"><div><h3>Como interpretar</h3><p>Volume total e experiência típica respondem perguntas diferentes.</p></div></div><div class="ic-list">' + UI.listRow("Retorno ponderado por volume", "Quanto foi retornado sobre todo o dinheiro movimentado.", Core.safeText(data.volume_weighted_return_formatted || data.retorno_ponderado_formatado)) + UI.listRow("Experiência típica", "Mediana das sessões/usuários elegíveis, sem deixar uma pessoa dominar o recorte.", Core.safeText(data.typical_experience_formatted || data.experiencia_tipica_formatada)) + UI.listRow("Aderência ao plano", "Disciplina e respeito aos limites; não desempenho como apostador.", Core.safeText(data.adherence_formatted || data.aderencia_formatada)) + '</div></section>' + '<div class="ic-disclaimer">Planejar a partir da comunidade exige confirmação completa de data, horário, duração, perda e lembrete. Assinar um padrão é diferente: não pede data fixa e avisa em cada nova ocorrência recorrente.</div>';
    }

    function patternCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese); }
    function renderPatterns(items) {
      items = Core.normalizeArray(items);
      if (!items.length) return "";
      return '<section><div class="ic-card__header"><div><h3>Padrões comunitários elegíveis</h3><p>Associações agregadas com direção, amostra e origem explícitas.</p></div></div><div class="ic-list">' + items.map(function (item, index) {
        var direction = item.direction || item.direcao || "descritiva";
        var actions = isSubscribable(item) ? UI.button(item.notification_active || item.notificacao_ativa ? "Gerenciar lembrete" : "Lembrar deste padrão", { action: "community-subscribe", value: evidenceId(item), icon: "bell", kind: item.notification_active || item.notificacao_ativa ? "gold" : "quiet" }) : "";
        if (deps.featureEnabled("ic_community_plan_enabled") && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled") && !item.planning_blocked && !item.planejamento_bloqueado) actions += UI.button("Usar como contexto do plano", { action: "community-plan", value: index, icon: "calendar" });
        var effective = item.effective_source || item.fonte_efetiva;
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || patternCode(item) || "Padrão") + '</h3><p>Direção observada: ' + Core.escapeHtml(direction) + '. ' + Core.escapeHtml(item.message || item.mensagem || "") + (effective ? ' Origem efetiva da última atualização: ' + Core.escapeHtml(effective === "pessoal" ? "seu histórico" : effective === "comunidade" ? "comunidade elegível" : "seu histórico e comunidade elegível") + '.' : '') + '</p></div>' + UI.badge(item.status || "descritivo", item.status) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + actions + '</div></article>';
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
