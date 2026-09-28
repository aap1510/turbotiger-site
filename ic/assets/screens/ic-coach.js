(function (root) {
  "use strict";
  var LEGENDAS_VALIDACAO={
  "legenda_ic_validacao_resposta_do_coach_fora_do_contrato": "Resposta do Coach fora do contrato."
};
  if(root.TurboTigerLegendas)root.TurboTigerLegendas.registrar(LEGENDAS_VALIDACAO);
  function legendaValidacao(chave){return root.TurboTigerLegendas?root.TurboTigerLegendas.texto(chave):LEGENDAS_VALIDACAO[chave];}
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};
  var fontesLegendasCoach = {
    "legenda_ic_coach_entender_o_estado_da_minha_sessao": "Entender o estado da minha sessão",
    "legenda_ic_coach_o_que_mudou": "O que mudou?",
    "legenda_ic_coach_entender_este_insight": "Entender este insight",
    "legenda_ic_coach_qual_regra_foi_acionada": "Qual regra foi acionada?",
    "legenda_ic_coach_revisar_esta_sessao": "Revisar esta sessão",
    "legenda_ic_coach_entender_meu_resumo_do_periodo": "Entender meu resumo do período",
    "legenda_ic_coach_abrir_controles_de_pausa": "Abrir controles de pausa",
    "legenda_ic_coach_revisar_encerramento": "Revisar encerramento",
    "legenda_ic_coach_ver_minhas_regras": "Ver minhas regras",
    "legenda_ic_coach_ver_meus_limites": "Ver meus limites",
    "legenda_ic_coach_abrir_historico": "Abrir histórico",
    "legenda_ic_coach_planejar_sessao": "Planejar sessão",
    "legenda_ic_coach_abrir_planejamento": "Abrir planejamento",
    "legenda_ic_coach_abrir_estatisticas": "Abrir estatísticas",
    "legenda_ic_coach_os_dados_disponiveis_ainda_nao_permitem_uma_explicacao_segura": "Os dados disponíveis ainda não permitem uma explicação segura.",
    "legenda_ic_coach_explicacoes_do_coach_desativadas": "Explicações do Coach desativadas",
    "legenda_ic_coach_os_alertas_deterministicos_e_o_controle_continuam_funcionando_normalmente": "Os alertas determinísticos e o controle continuam funcionando normalmente.",
    "legenda_ic_coach_nenhum_fato_selecionavel_agora": "Nenhum fato selecionável agora",
    "legenda_ic_coach_as_perguntas_aparecerao_quando_houver_uma_sessao_alerta_ou_analise_disponivel_para_explicar": "As perguntas aparecerão quando houver uma sessão, alerta ou análise disponível para explicar.",
    "legenda_ic_coach_explicacoes_claras_baseadas_somente_em_fatos_calculados_e_referencias_autorizadas": "Explicações claras baseadas somente em fatos calculados e referências autorizadas.",
    "legenda_ic_coach_explicacao_indisponivel": "Explicação indisponível",
    "legenda_ic_coach_explicacao_validada_indisponivel_controles_ativos": "Não foi possível obter uma explicação validada agora. Seus alertas, regras e limites determinísticos continuam ativos.",
    "legenda_ic_coach_vamos_entender_seus_dados": "Vamos entender seus dados",
    "legenda_ic_coach_escolha_pergunta_ou_abra_pelo_historico": "Escolha uma pergunta abaixo. Você também pode abrir o Coach a partir de um alerta ou resultado do seu histórico.",
    "legenda_ic_coach_explicacoes_disponiveis": "Explicações disponíveis",
    "legenda_ic_coach_as_explicacoes_usam_os_dados_disponiveis_e_seus_compromissos_nao_preveem_resultados_de_jogos": "As explicações usam os dados disponíveis e seus compromissos. Não preveem resultados de jogos."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasCoach);
  function legendaCoach(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasCoach[chave]; }


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
      if (type === "explain_session_state") return legendaCoach("legenda_ic_coach_entender_o_estado_da_minha_sessao");
      if (type === "explain_alert") return legendaCoach("legenda_ic_coach_o_que_mudou");
      if (type === "explain_insight") return legendaCoach("legenda_ic_coach_entender_este_insight");
      if (type === "explain_rule") return legendaCoach("legenda_ic_coach_qual_regra_foi_acionada");
      if (type === "post_session_review") return legendaCoach("legenda_ic_coach_revisar_esta_sessao");
      return legendaCoach("legenda_ic_coach_entender_meu_resumo_do_periodo");
    }

    function coachActionDefinition(action) {
      var definitions = {
        pause_5m: { label: legendaCoach("legenda_ic_coach_abrir_controles_de_pausa"), route: "ao-vivo", kind: "quiet" },
        pause_15m: { label: legendaCoach("legenda_ic_coach_abrir_controles_de_pausa"), route: "ao-vivo", kind: "quiet" },
        end_session: { label: legendaCoach("legenda_ic_coach_revisar_encerramento"), route: "ao-vivo", kind: "danger" },
        open_rules: { label: legendaCoach("legenda_ic_coach_ver_minhas_regras"), route: "regras-pausas", kind: "quiet" },
        view_limits: { label: legendaCoach("legenda_ic_coach_ver_meus_limites"), route: "regras-pausas", kind: "quiet" },
        open_history: { label: legendaCoach("legenda_ic_coach_abrir_historico"), route: "historico", kind: "quiet" },
        plan_session: { label: legendaCoach("legenda_ic_coach_planejar_sessao"), route: "planejar", kind: "primary" },
        open_planning: { label: legendaCoach("legenda_ic_coach_abrir_planejamento"), route: "planejar", kind: "primary" },
        open_statistics: { label: legendaCoach("legenda_ic_coach_abrir_estatisticas"), route: "estatisticas", kind: "quiet" }
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
      if (item.status === "client_fallback") response = Object.assign({}, response, {
        title: legendaCoach("legenda_ic_coach_explicacao_indisponivel"),
        message: legendaCoach("legenda_ic_coach_explicacao_validada_indisponivel_controles_ativos")
      });
      return '<article class="ic-coach-message ic-coach-message--coach"><strong>' + Core.escapeHtml(response.title || "Tiger Coach") + '</strong><div>' + Core.escapeHtml(response.message || legendaCoach("legenda_ic_coach_os_dados_disponiveis_ainda_nao_permitem_uma_explicacao_segura")) + '</div>' + coachActionButtons(response.actions) + '</article>';
    }

    function content() {
      var context = state.context || {};
      if (context.ai_enabled === false && context.fallback_enabled === false) return UI.state({ type: "unavailable", title: legendaCoach("legenda_ic_coach_explicacoes_do_coach_desativadas"), message: legendaCoach("legenda_ic_coach_os_alertas_deterministicos_e_o_controle_continuam_funcionando_normalmente"), retry: false });
      var suggestions = normalizedSuggestions();
      var thread = state.explanations.length ? state.explanations.map(explanationHtml).join("") : '<article class="ic-coach-message ic-coach-message--coach"><strong>' + Core.escapeHtml(legendaCoach("legenda_ic_coach_vamos_entender_seus_dados")) + '</strong><div>' + Core.escapeHtml(legendaCoach("legenda_ic_coach_escolha_pergunta_ou_abra_pelo_historico")) + '</div></article>';
      var choices = suggestions.length ? '<div class="ic-chip-row" aria-label="' + Core.escapeHtml(legendaCoach("legenda_ic_coach_explicacoes_disponiveis")) + '">' + suggestions.map(function (item, index) { return '<button class="ic-chip" type="button" data-screen-action="coach-explain" data-action-value="' + index + '"' + (state.sending ? " disabled" : "") + '>' + Core.escapeHtml(item.label) + '</button>'; }).join("") + '</div>' : UI.banner(legendaCoach("legenda_ic_coach_nenhum_fato_selecionavel_agora"), legendaCoach("legenda_ic_coach_as_perguntas_aparecerao_quando_houver_uma_sessao_alerta_ou_analise_disponivel_para_explicar"), "neutral");
      return '<section class="ic-card"><div class="ic-coach-thread" id="icCoachThread">' + thread + '</div>' + choices + '</section><div class="ic-disclaimer">' + Core.escapeHtml(legendaCoach("legenda_ic_coach_as_explicacoes_usam_os_dados_disponiveis_e_seus_compromissos_nao_preveem_resultados_de_jogos")) + '</div>';
    }

    function render() {
      var html = UI.sectionHeader("Tiger Coach", legendaCoach("legenda_ic_coach_explicacoes_claras_baseadas_somente_em_fatos_calculados_e_referencias_autorizadas")) + '<div class="ic-page-stack">';
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
        if (!Core.isPlainObject(explanation) || !Core.safeText(explanation.title, "") || !Core.safeText(explanation.message, "") || !Array.isArray(explanation.fact_refs) || !Array.isArray(explanation.actions)) throw new Error(legendaValidacao("legenda_ic_validacao_resposta_do_coach_fora_do_contrato"));
        state.explanations.push({ explanation: explanation, evidence: result.evidence || {}, status: result.status, contextHash: result.context_hash || null });
      } catch (_error) {
        state.explanations.push({ explanation: { title: legendaCoach("legenda_ic_coach_explicacao_indisponivel"), message: legendaCoach("legenda_ic_coach_explicacao_validada_indisponivel_controles_ativos"), fact_refs: [], actions: [] }, status: "client_fallback" });
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
    function atualizarIdioma() {
      if (root.TurboTigerLegendas && root.TurboTigerLegendas.atualizarApresentacao) root.TurboTigerLegendas.atualizarApresentacao(deps.container, render());
      else renderInto();
    }
    root.addEventListener("turbotiger:idioma", atualizarIdioma);
    return { render: render, load: load, handleAction: handleAction, dispose: function () { root.removeEventListener("turbotiger:idioma", atualizarIdioma); } };
  };
}(window));
