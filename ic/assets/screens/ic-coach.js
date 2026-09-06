(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens.coach = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var allowedRequestTypes = ["explain_session_state", "explain_alert", "explain_insight", "explain_rule", "post_session_review", "periodic_review"];
    var state = { status: "idle", context: null, error: null, explanations: [], sending: false };

    function positiveReference(value) {
      var number = Number(value);
      return Number.isSafeInteger(number) && number > 0 ? number : null;
    }

    function initialRequest() {
      var route = deps.route();
      if (positiveReference(route.insightId)) return { request_type: "explain_insight", reference_id: positiveReference(route.insightId) };
      if (positiveReference(route.sessionId)) return { request_type: "explain_session_state", reference_id: positiveReference(route.sessionId) };
      return { request_type: "periodic_review", reference_id: null };
    }

    function referenceFromContext(type) {
      var context = state.context || {};
      var references = Core.isPlainObject(context.references) ? context.references : Core.isPlainObject(context.referencias) ? context.referencias : {};
      var session = Core.isPlainObject(context.session) ? context.session : Core.isPlainObject(context.sessao) ? context.sessao : {};
      var alert = Core.isPlainObject(context.alert) ? context.alert : Core.isPlainObject(context.alerta) ? context.alerta : {};
      var insight = Core.isPlainObject(context.insight) ? context.insight : {};
      var rule = Core.isPlainObject(context.rule) ? context.rule : Core.isPlainObject(context.regra) ? context.regra : {};
      var candidates = {
        explain_session_state: [references.session_id, references.sessao_id, context.session_id, context.sessao_id, session.reference_id, session.id, session.cod_sessao_controle],
        explain_alert: [references.alert_id, references.alerta_id, context.alert_id, context.alerta_id, alert.reference_id, alert.id, alert.cod_alerta],
        explain_insight: [references.insight_id, context.insight_id, insight.reference_id, insight.id, insight.cod_insight],
        explain_rule: [references.rule_id, references.regra_id, context.rule_id, context.regra_id, rule.reference_id, rule.id, rule.cod_regra],
        post_session_review: [references.review_session_id, references.session_id, references.sessao_id, context.review_session_id, context.session_id, context.sessao_id, session.reference_id, session.id, session.cod_sessao_controle]
      };
      var values = candidates[type] || [];
      for (var index = 0; index < values.length; index += 1) {
        var reference = positiveReference(values[index]);
        if (reference) return reference;
      }
      return null;
    }

    function contextualLabel(type) {
      if (type === "explain_session_state") return "Por que ficou laranja?";
      if (type === "explain_alert") return "O que mudou?";
      if (type === "explain_insight") return "Entender este insight";
      if (type === "explain_rule") return "Qual regra foi acionada?";
      if (type === "post_session_review") return "Revisar esta sessão";
      return "Como estou neste período?";
    }

    function coachActionDefinition(action) {
      var definitions = {
        pause_5m: { label: "Abrir controles de pausa", route: "ao-vivo", kind: "quiet" },
        pause_15m: { label: "Abrir controles de pausa", route: "ao-vivo", kind: "quiet" },
        end_session: { label: "Revisar encerramento", route: "ao-vivo", kind: "danger" },
        open_rules: { label: "Ver minhas regras", route: "regras-pausas", kind: "quiet" },
        view_limits: { label: "Ver meus limites", route: "regras-pausas", kind: "quiet" },
        open_history: { label: "Abrir histórico", route: "historico", kind: "quiet" },
        plan_session: { label: "Planejar sessão", route: "planejar", kind: "primary" },
        open_planning: { label: "Abrir planejamento", route: "planejar", kind: "primary" },
        open_statistics: { label: "Abrir estatísticas", route: "estatisticas", kind: "quiet" }
      };
      return definitions[String(action || "").trim().toLowerCase()] || null;
    }

    function coachActionButtons(actions) {
      var seen = {};
      var buttons = Core.normalizeArray(actions).map(function (action) {
        var normalized = String(action || "").trim().toLowerCase();
        var definition = coachActionDefinition(normalized);
        if (!definition || seen[normalized]) return "";
        seen[normalized] = true;
        return UI.button(definition.label, { action: "coach-action", value: normalized, kind: definition.kind });
      }).filter(Boolean);
      return buttons.length ? '<div class="ic-card__footer">' + buttons.join("") + '</div>' : "";
    }

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      var request = initialRequest();
      try {
        var result = await deps.api.rpc("ic_coach_contexto_rpc", { p_request_type: request.request_type, p_referencia_id: request.reference_id }, { key: "coach:context" });
        state.status = "ready"; state.context = result.data || {}; state.error = null;
      } catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function normalizedSuggestions() {
      var context = state.context || {};
      var initial = initialRequest();
      var candidates = Core.normalizeArray(context.suggestions || context.sugestoes).map(function (item) {
        if (typeof item === "string") return { request_type: item, reference_id: null };
        return { request_type: item.request_type || item.tipo, reference_id: positiveReference(item.reference_id || item.referencia_id) };
      });
      candidates.unshift({ request_type: context.request_type || initial.request_type, reference_id: positiveReference(context.reference_id || context.referencia_id) || initial.reference_id });
      ["explain_session_state", "explain_alert", "explain_insight", "explain_rule", "post_session_review", "periodic_review"].forEach(function (type) {
        candidates.push({ request_type: type, reference_id: referenceFromContext(type) });
      });

      var seen = {};
      return candidates.map(function (item) {
        var type = String(item.request_type || "").trim().toLowerCase();
        var reference = positiveReference(item.reference_id) || referenceFromContext(type);
        return { label: contextualLabel(type), request_type: type, reference_id: reference };
      }).filter(function (item) {
        if (allowedRequestTypes.indexOf(item.request_type) < 0) return false;
        if (item.request_type !== "periodic_review" && !item.reference_id) return false;
        var key = item.request_type + ":" + (item.reference_id || "none");
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      }).slice(0, 8);
    }

    function explanationHtml(item) {
      var response = item.explanation || {};
      return '<article class="ic-coach-message ic-coach-message--coach"><strong>' + Core.escapeHtml(response.title || "Tiger Coach") + '</strong><div>' + Core.escapeHtml(response.message || "Os dados disponíveis ainda não permitem uma explicação segura.") + '</div>' + (Core.normalizeArray(response.fact_refs).length ? '<div class="ic-coach-message__refs">Fatos: ' + Core.escapeHtml(response.fact_refs.join(", ")) + '</div>' : '') + coachActionButtons(response.actions) + '</article>';
    }

    function content() {
      var context = state.context || {};
      if (context.ai_enabled === false && context.fallback_enabled === false) return UI.state({ type: "unavailable", title: "Explicações do Coach desativadas", message: "Os alertas determinísticos e o controle continuam funcionando normalmente.", retry: false });
      var suggestions = normalizedSuggestions();
      var thread = state.explanations.length ? state.explanations.map(explanationHtml).join("") : '<article class="ic-coach-message ic-coach-message--coach"><strong>Tiger Coach</strong><div>Escolha um fato disponível para receber uma explicação validada. O Coach não aceita perguntas livres e não tenta prever a próxima rodada.</div></article>';
      var choices = suggestions.length ? '<div class="ic-chip-row" aria-label="Explicações disponíveis">' + suggestions.map(function (item, index) { return '<button class="ic-chip" type="button" data-screen-action="coach-explain" data-action-value="' + index + '"' + (state.sending ? " disabled" : "") + '>' + Core.escapeHtml(item.label) + '</button>'; }).join("") + '</div>' : UI.banner("Nenhum fato selecionável agora", "O Coach só explica contextos determinísticos que o backend autorizou para esta sessão.", "neutral");
      return '<section class="ic-card"><div class="ic-coach-thread" id="icCoachThread">' + thread + '</div>' + choices + '</section><div class="ic-disclaimer">A Edge Function recebe apenas <code>request_type</code> e <code>reference_id</code>. Ela busca o envelope determinístico autenticado, valida números, fatos e ações e retorna fallback seguro quando necessário.</div>';
    }

    function render() {
      var html = UI.sectionHeader("Tiger Coach", "Explicações claras baseadas somente em fatos calculados e referências autorizadas.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }

    function renderInto() {
      deps.container.innerHTML = render();
      var thread = document.getElementById("icCoachThread");
      if (thread) thread.scrollTop = thread.scrollHeight;
    }

    async function explain(index) {
      var suggestion = normalizedSuggestions()[Number(index)];
      if (!suggestion || state.sending) return;
      state.sending = true; renderInto();
      try {
        var result = await deps.api.edge("ic-coach", { request_type: suggestion.request_type, reference_id: suggestion.reference_id }, { key: "coach:explain" });
        var explanation = result.explanation || {};
        if (!Core.isPlainObject(explanation) || !Core.safeText(explanation.title, "") || !Core.safeText(explanation.message, "") || !Array.isArray(explanation.fact_refs) || !Array.isArray(explanation.actions)) throw new Error("Resposta do Coach fora do contrato.");
        state.explanations.push({ explanation: explanation, evidence: result.evidence || {}, status: result.status, contextHash: result.context_hash || null });
      } catch (_error) {
        state.explanations.push({ explanation: { title: "Explicação indisponível", message: "Não foi possível obter uma explicação validada agora. Seus alertas, regras e limites determinísticos continuam ativos.", fact_refs: [], actions: [] }, status: "client_fallback" });
      } finally { state.sending = false; renderInto(); }
    }

    function handleAction(action, value) {
      if (action === "retry") load(true);
      if (action === "coach-explain") explain(value);
      if (action === "coach-action") {
        var definition = coachActionDefinition(value);
        if (definition) deps.navigate({ section: definition.route });
      }
    }
    return { render: render, load: load, handleAction: handleAction };
  };
}(window));
