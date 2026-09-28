(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasComunidade = {
    "legenda_ic_comunidade_amostra_protegida": "Os dados permanecem protegidos até atingirem os mínimos de usuários, sessões, concentração e qualidade.",
    "legenda_ic_comunidade_amostra_insuficiente": "A comunidade ainda não possui amostra suficiente para este recorte.",
    "legenda_ic_comunidade_usuarios": "Usuários: ",
    "legenda_ic_comunidade_base_inicial": "Base comunitária inicial",
    "legenda_ic_comunidade_agregacao_protegida": "Agregação protegida",
    "legenda_ic_comunidade_base_inicial_descricao": "Registros reais, com análises exploratórias. Consulte a amostra e o período de cada resultado.",
    "legenda_ic_comunidade_agregacao_descricao": "Estatísticas agregadas, sem identificar os participantes.",
    "legenda_ic_comunidade_sem_metricas": "Nenhuma métrica foi liberada para este recorte.",
    "legenda_ic_comunidade_interpretacao_descricao": "Volume total, multiplicadores e experiência típica respondem perguntas diferentes.",
    "legenda_ic_comunidade_como_interpretar": "Como interpretar",
    "legenda_ic_comunidade_fonte_atual": "Fonte atual",
    "legenda_ic_comunidade_fonte_base_testes": "Base histórica de testes do primeiro usuário",
    "legenda_ic_comunidade_comunidade_elegivel": "Comunidade elegível",
    "legenda_ic_comunidade_diversidade": "Diversidade",
    "legenda_ic_comunidade_um_contribuidor": "Um contribuidor, explicitamente identificado como base inicial",
    "legenda_ic_comunidade_multiplos_contribuidores": "Múltiplos contribuidores protegidos",
    "legenda_ic_comunidade_usuarios_quantidade": " usuário(s)",
    "legenda_ic_comunidade_evidencia": "Evidência",
    "legenda_ic_comunidade_associacao_descritiva": "Associação descritiva; não causal e não preditiva.",
    "legenda_ic_comunidade_limites_padroes_historicos": "Os padrões mostram dias, semanas, tipos de dia e horários com resultados históricos diferentes. O multiplicador mede a dimensão das premiações. Nenhum padrão prevê o próximo resultado.",
    "legenda_ic_comunidade_outros_recortes": "Outros recortes",
    "legenda_ic_comunidade_usar_contexto_plano": "Usar como contexto do plano",
    "legenda_ic_comunidade_padrao": "Padrão",
    "legenda_ic_comunidade_melhores_resultados": "Melhores resultados históricos",
    "legenda_ic_comunidade_piores_resultados": "Piores resultados históricos",
    "legenda_ic_comunidade_resultado_historico": "Resultado histórico",
    "legenda_ic_comunidade_retorno_observado": "Retorno observado",
    "legenda_ic_comunidade_diferenca_referencia": "Diferença da referência: ",
    "legenda_ic_comunidade_amostra": "Amostra",
    "legenda_ic_comunidade_sessao": "sessão",
    "legenda_ic_comunidade_sessoes": "sessões",
    "legenda_ic_comunidade_rodada": "rodada",
    "legenda_ic_comunidade_rodadas": "rodadas",
    "legenda_ic_comunidade_premiacoes": "Premiações",
    "legenda_ic_comunidade_maximo": "máx. ",
    "legenda_ic_comunidade_pouca_repeticao": "Pouca repetição: este recorte ainda não demonstra estabilidade.",
    "legenda_ic_comunidade_entender_resultado": "Entender este resultado",
    "legenda_ic_comunidade_associacao_nao_previsao": "Associação histórica, não uma previsão.",
    "legenda_ic_comunidade_sem_maior_pagamento": "Sem o maior pagamento",
    "legenda_ic_comunidade_influencia_premio_extremo": "Mostra a influência do prêmio extremo",
    "legenda_ic_comunidade_recorte": "recorte",
    "legenda_ic_comunidade_recortes": "recortes",
    "legenda_ic_comunidade_recortes_nao_independentes": "Os recortes podem compartilhar rodadas. Não são confirmações independentes.",
    "legenda_ic_comunidade_ver_outros_horarios": "Ver outros dias e horários (",
    "legenda_ic_comunidade_comparar_recortes": "Abra um jogo para comparar os recortes com maior número de sessões. Retorno e tamanho das premiações são medidas diferentes.",
    "legenda_ic_comunidade_resultados_por_jogo": "Resultados por jogo",
    "legenda_ic_comunidade_titulo": "Comunidade",
    "legenda_ic_comunidade_descricao": "Aprendizado agregado para medir risco e disciplina sem identificar pessoas.",
    "legenda_ic_comunidade_confirmar_dados_plano": "Confirme data futura, duração, limite e lembrete antes de criar o plano."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasComunidade);
  function legendaComunidade(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasComunidade[chave]; }


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
        return '<section class="ic-card ic-community-gate">' + UI.icon("community") + ("<h3>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_amostra_insuficiente")) + "</h3><p>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_amostra_protegida")) + "</p><div>") + UI.badge(legendaComunidade("legenda_ic_comunidade_usuarios") + Core.safeText(data.users || data.usuarios || 1), "neutral") + ' ' + UI.badge("amostra_insuficiente", "neutral") + '</div>' + UI.evidence(data.evidence || data.evidencia || data) + '</section>';
      }
      var metrics = Core.normalizeArray(data.metrics || data.metricas);
      var rows = metrics.map(function (item) { var label = item.label || item.rotulo, value = item.value == null ? item.valor : item.value; return UI.metric(label, item.formatted_value || item.valor_formatado || (Core.formatNumber(value) + (/multiplicador/i.test(label) ? "×" : "")), item.detail || item.detalhe); }).join("");
      var initial = data.source === "base_experimental_inicial";
      var heading = initial ? legendaComunidade("legenda_ic_comunidade_base_inicial") : legendaComunidade("legenda_ic_comunidade_agregacao_protegida");
      var explanation = initial ? legendaComunidade("legenda_ic_comunidade_base_inicial_descricao") : legendaComunidade("legenda_ic_comunidade_agregacao_descricao");
      return UI.banner(heading, explanation, initial ? "neutral" : "control") + (rows ? '<div class="ic-grid ic-grid--metrics">' + rows + '</div>' : UI.state({ type: "empty", message: legendaComunidade("legenda_ic_comunidade_sem_metricas"), retry: false })) + renderPatterns(data.patterns || data.padroes || data.hypotheses || data.hipoteses || []) + ("<section class=\"ic-card\"><div class=\"ic-card__header\"><div><h3>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_como_interpretar")) + "</h3><p>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_interpretacao_descricao")) + "</p></div></div><div class=\"ic-list\">") + UI.listRow(legendaComunidade("legenda_ic_comunidade_fonte_atual"), initial ? legendaComunidade("legenda_ic_comunidade_fonte_base_testes") : legendaComunidade("legenda_ic_comunidade_comunidade_elegivel"), Core.safeText(data.source_label || "")) + UI.listRow(legendaComunidade("legenda_ic_comunidade_diversidade"), initial ? legendaComunidade("legenda_ic_comunidade_um_contribuidor") : legendaComunidade("legenda_ic_comunidade_multiplos_contribuidores"), Core.safeText(data.users || 0) + legendaComunidade("legenda_ic_comunidade_usuarios_quantidade")) + UI.listRow(legendaComunidade("legenda_ic_comunidade_evidencia"), legendaComunidade("legenda_ic_comunidade_associacao_descritiva"), Core.safeText(data.status)) + '</div></section>' + ("<div class=\"ic-disclaimer\">" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_limites_padroes_historicos")) + "</div>");
    }

    function patternCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese); }
    function renderPatterns(items) {
      items = Core.normalizeArray(items);
      if (!items.length) return "";
      var groups = new Map();
      items.forEach(function (item, index) {
        var name = String(item.game_name || item.jogo || item.title || item.titulo || legendaComunidade("legenda_ic_comunidade_outros_recortes")).split(" · ")[0];
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push({ item: item, index: index });
      });
      function card(entry) {
        var item = entry.item, index = entry.index;
        var direction = item.direction || item.direcao || "descritiva";
        var actions = "";
        if (deps.featureEnabled("ic_community_plan_enabled") && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled") && !item.planning_blocked && !item.planejamento_bloqueado) actions += UI.button(legendaComunidade("legenda_ic_comunidade_usar_contexto_plano"), { action: "community-plan", value: index, icon: "calendar" });
        var effective = item.effective_source || item.fonte_efetiva;
        var detail = item.details || item.detalhes || {};
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || patternCode(item) || legendaComunidade("legenda_ic_comunidade_padrao")) + '</h3><p>' + Core.escapeHtml(direction === "melhor_historico" ? legendaComunidade("legenda_ic_comunidade_melhores_resultados") : direction === "pior_historico" ? legendaComunidade("legenda_ic_comunidade_piores_resultados") : legendaComunidade("legenda_ic_comunidade_resultado_historico")) + '</p></div>' + UI.badge(item.status || "descritivo", item.status) + '</div><div class="ic-list">' + UI.listRow(legendaComunidade("legenda_ic_comunidade_retorno_observado"), legendaComunidade("legenda_ic_comunidade_diferenca_referencia") + Core.formatNumber(detail.difference_pp) + " p.p.", Core.formatPercent(detail.observed_rtp_pct, 2)) + UI.listRow(legendaComunidade("legenda_ic_comunidade_amostra"), Core.countLabel(detail.sessions || 0, legendaComunidade("legenda_ic_comunidade_sessao"), legendaComunidade("legenda_ic_comunidade_sessoes")), Core.countLabel(detail.rounds || 0, legendaComunidade("legenda_ic_comunidade_rodada"), legendaComunidade("legenda_ic_comunidade_rodadas"))) + UI.listRow(legendaComunidade("legenda_ic_comunidade_premiacoes"), "≥5×: " + Core.formatNumber(detail.multiplier_5x || 0, 0) + " · ≥10×: " + Core.formatNumber(detail.multiplier_10x || 0, 0) + " · ≥50×: " + Core.formatNumber(detail.multiplier_50x || 0, 0), legendaComunidade("legenda_ic_comunidade_maximo") + Core.formatNumber(detail.largest_multiplier) + "×") + '</div>' + (Number(detail.sessions) < 3 ? ("<p class=\"ic-disclaimer\">" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_pouca_repeticao")) + "</p>") : '') + ("<details class=\"ic-form-section\"><summary>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_entender_resultado")) + "</summary><p>") + Core.escapeHtml(item.message || item.mensagem || legendaComunidade("legenda_ic_comunidade_associacao_nao_previsao")) + '</p>' + UI.listRow(legendaComunidade("legenda_ic_comunidade_sem_maior_pagamento"), legendaComunidade("legenda_ic_comunidade_influencia_premio_extremo"), Core.formatPercent(detail.rtp_without_largest_return_pct, 2)) + UI.evidence(item.evidence || item.evidencia || item) + '</details><div class="ic-card__footer">' + actions + '</div></article>';
      }
      var grouped = Array.from(groups.entries()).map(function (group) {
        var ordered = group[1].slice().sort(function (a, b) { return Number((b.item.details || {}).sessions || 0) - Number((a.item.details || {}).sessions || 0) || Number((b.item.details || {}).rounds || 0) - Number((a.item.details || {}).rounds || 0); });
        var selected = [];
        ["melhor_historico", "pior_historico"].forEach(function (direction) { var entry = ordered.find(function (row) { return (row.item.direction || row.item.direcao) === direction; }); if (entry) selected.push(entry); });
        if (!selected.length) selected = ordered.slice(0, 2);
        var remaining = ordered.filter(function (entry) { return selected.indexOf(entry) < 0; });
        return '<details class="ic-card ic-form-section"><summary>' + Core.escapeHtml(group[0]) + ' · ' + Core.countLabel(ordered.length, legendaComunidade("legenda_ic_comunidade_recorte"), legendaComunidade("legenda_ic_comunidade_recortes")) + ("</summary><p>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_recortes_nao_independentes")) + "</p><div class=\"ic-list\">") + selected.map(card).join("") + '</div>' + (remaining.length ? ("<details class=\"ic-form-section\"><summary>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_ver_outros_horarios"))) + remaining.length + ')</summary><div class="ic-list">' + remaining.map(card).join("") + '</div></details>' : '') + '</details>';
      }).join("");
      return ("<section><h3>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_resultados_por_jogo")) + "</h3><p>" + Core.escapeHtml(legendaComunidade("legenda_ic_comunidade_comparar_recortes")) + "</p><div class=\"ic-list\">") + grouped + '</div></section>';
    }

    function communityPatterns() { var data = state.data || {}; return Core.normalizeArray(data.patterns || data.padroes || data.hypotheses || data.hipoteses); }
    function render() {
      var html = UI.sectionHeader(legendaComunidade("legenda_ic_comunidade_titulo"), legendaComunidade("legenda_ic_comunidade_descricao")) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }
    function renderInto() { deps.container.innerHTML = render(); }
    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      var item = communityPatterns()[Number(value)];
      if (action === "community-plan" && item && deps.featureEnabled("ic_community_plan_enabled")) { deps.store.set({ planningDraft: item }); deps.navigate({ section: "planejar" }); UI.toast(legendaComunidade("legenda_ic_comunidade_confirmar_dados_plano")); }
    }
    return { render: render, load: load, handleAction: handleAction };
  };
}(window));
