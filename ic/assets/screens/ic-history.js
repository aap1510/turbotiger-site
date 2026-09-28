(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasHistorico = {
    "legenda_ic_historico_sessoes": "Sessões",
    "legenda_ic_historico_rodadas": "Rodadas",
    "legenda_ic_historico_periodos": "Períodos",
    "legenda_ic_historico_mais_recente_primeiro": "Mais recente primeiro",
    "legenda_ic_historico_maior_amostra": "Maior amostra",
    "legenda_ic_historico_maior_retorno_observado": "Maior retorno observado",
    "legenda_ic_historico_menor_retorno": "Menor retorno",
    "legenda_ic_historico_maior_resultado": "Maior resultado",
    "legenda_ic_historico_maior_perda": "Maior perda",
    "legenda_ic_historico_maior_sobrevivencia": "Maior sobrevivência",
    "legenda_ic_historico_menor_drawdown": "Menor drawdown",
    "legenda_ic_historico_maior_aderencia": "Maior aderência",
    "legenda_ic_historico_duracao": "Duração",
    "legenda_ic_historico_quantidade_de_rodadas": "Quantidade de rodadas",
    "legenda_ic_historico_tipo_de_historico": "Tipo de histórico",
    "legenda_ic_historico_ordenar": "Ordenar",
    "legenda_ic_historico_ocultar_filtros": "Ocultar filtros",
    "legenda_ic_historico_filtros": "Filtros",
    "legenda_ic_historico_periodo": "Período",
    "legenda_ic_historico_ultimos_30_dias": "Últimos 30 dias",
    "legenda_ic_historico_ultimos_90_dias": "Últimos 90 dias",
    "legenda_ic_historico_ultimos_6_meses": "Últimos 6 meses",
    "legenda_ic_historico_todo_o_historico": "Todo o histórico",
    "legenda_ic_historico_bet": "Bet",
    "legenda_ic_historico_conta": "Conta",
    "legenda_ic_historico_jogo": "Jogo",
    "legenda_ic_historico_provedor": "Provedor",
    "legenda_ic_historico_moeda": "Moeda",
    "legenda_ic_historico_todas": "Todas",
    "legenda_ic_historico_tipo_de_rodada": "Tipo de rodada",
    "legenda_ic_historico_todos": "Todos",
    "legenda_ic_historico_paga": "Paga",
    "legenda_ic_historico_free_spin": "Free spin",
    "legenda_ic_historico_bonus": "Bônus",
    "legenda_ic_historico_retorno_parcial": "Retorno parcial",
    "legenda_ic_historico_origem_da_sessao": "Origem da sessão",
    "legenda_ic_historico_planejada_e_observada": "Planejada e observada",
    "legenda_ic_historico_planejada": "Planejada",
    "legenda_ic_historico_observada": "Observada",
    "legenda_ic_historico_faixa_de_horario": "Faixa de horário",
    "legenda_ic_historico_dia_da_semana": "Dia da semana",
    "legenda_ic_historico_segunda": "Segunda",
    "legenda_ic_historico_terca": "Terça",
    "legenda_ic_historico_quarta": "Quarta",
    "legenda_ic_historico_quinta": "Quinta",
    "legenda_ic_historico_sexta": "Sexta",
    "legenda_ic_historico_sabado": "Sábado",
    "legenda_ic_historico_domingo": "Domingo",
    "legenda_ic_historico_semana_do_mes": "Semana do mês",
    "legenda_ic_historico_primeira": "Primeira",
    "legenda_ic_historico_terceira": "Terceira",
    "legenda_ic_historico_ultima": "Última",
    "legenda_ic_historico_faixa_de_exposicao": "Faixa de exposição",
    "legenda_ic_historico_ex_0_25_0_50": "Ex.: 0,25%–0,50%",
    "legenda_ic_historico_multiplicador_minimo": "Multiplicador mínimo",
    "legenda_ic_historico_qualidade": "Qualidade",
    "legenda_ic_historico_completa": "Completa",
    "legenda_ic_historico_parcial": "Parcial",
    "legenda_ic_historico_insuficiente": "Insuficiente",
    "legenda_ic_historico_aplicar_filtros": "Aplicar filtros",
    "legenda_ic_historico_rodadas_2": " rodadas",
    "legenda_ic_historico_origem_efetiva_seu_historico": "Origem efetiva: seu histórico",
    "legenda_ic_historico_origem_efetiva_comunidade_elegivel": "Origem efetiva: comunidade elegível",
    "legenda_ic_historico_origem_efetiva_seu_historico_e_comunidade_elegivel": "Origem efetiva: seu histórico e comunidade elegível",
    "legenda_ic_historico_detalhes": "Detalhes",
    "legenda_ic_historico_plano_ativo": "Plano ativo",
    "legenda_ic_historico_planejar_sessao": "Planejar sessão",
    "legenda_ic_historico_carregando": "Carregando…",
    "legenda_ic_historico_carregar_mais": "Carregar mais",
    "legenda_ic_historico_meu_historico": "Meu Histórico",
    "legenda_ic_historico_consulte_fatos_registrados_sem_transformar_o_passado_em_promessa_futura": "Consulte fatos registrados sem transformar o passado em promessa futura.",
    "legenda_ic_historico_dados_historicos_resultados_anteriores_nao_indicam_nem_garantem_resultados_futuros": "Dados históricos. Resultados anteriores não indicam nem garantem resultados futuros.",
    "legenda_ic_historico_resultado_liquido": "Resultado líquido",
    "legenda_ic_historico_apostado": "Apostado",
    "legenda_ic_historico_retornado": "Retornado",
    "legenda_ic_historico_pico_da_sessao": "Pico da sessão",
    "legenda_ic_historico_reducao_apos_o_pico": "Redução após o pico",
    "legenda_ic_historico_maior_queda": "Maior queda",
    "legenda_ic_historico_multiplicador": "Multiplicador",
    "legenda_ic_historico_aposta_sobre_a_banca": "Aposta sobre a banca",
    "legenda_ic_historico_sequencia_de_perdas": "Sequência de perdas",
    "legenda_ic_historico_aumentos_apos_perdas": "Aumentos após perdas",
    "legenda_ic_historico_aceleracoes_apos_perdas": "Acelerações após perdas",
    "legenda_ic_historico_retornos_parciais_com_perda": "Retornos parciais com perda",
    "legenda_ic_historico_retorno_parcial_com_perda": "Retorno parcial com perda",
    "legenda_ic_historico_aumento_apos_perda": "Aumento após perda",
    "legenda_ic_historico_aceleracao_apos_perda": "Aceleração após perda",
    "legenda_ic_historico_nao_disponivel": "Não disponível",
    "legenda_ic_historico_sim": "Sim",
    "legenda_ic_historico_nao": "Não",
    "legenda_ic_historico_registro_tecnico_completo": "Registro técnico completo",
    "legenda_ic_historico_nao_foi_possivel_carregar_a_proxima_pagina": "Não foi possível carregar a próxima página.",
    "legenda_ic_historico_detalhes_historicos": "Detalhes históricos",
    "legenda_ic_historico_registro": "Registro",
    "legenda_ic_historico_informacoes_registradas_pelo_sistema": "Informações registradas pelo sistema.",
    "legenda_ic_historico_confirme_data_futura_duracao_limite_e_lembrete_antes_de_criar_o_plano": "Confirme data futura, duração, limite e lembrete antes de criar o plano."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasHistorico);
  function legendaHistorico(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasHistorico[chave]; }

  IC.Screens.historico = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, tab: "sessoes", sort: "recentes", filtersOpen: false, filters: { periodo: "all" }, cursor: null, loadingMore: false, pendingSubscription: null };

    function nextCursor(result) {
      var data = result && result.data || {}, meta = result && result.meta || {};
      return meta.next_cursor || meta.proximo_cursor || data.next_cursor || data.proximo_cursor || null;
    }

    function currencyContext() {
      var bootstrap = deps.store.getState().bootstrap;
      return bootstrap && bootstrap.data || {};
    }

    async function load(force) {
      if (state.status === "loading") return;
      if (!force && state.status === "ready") return;
      state.status = "loading"; renderInto();
      try {
        var result = await deps.api.rpc("ic_historico_listar_rpc", { p_tipo: state.tab, p_ordenacao: state.sort, p_filtros: state.filters, p_cursor: null, p_limite: 50 }, { key: "history:list" });
        state.status = "ready"; state.data = result.data || {}; state.cursor = nextCursor(result); state.loadingMore = false; state.error = null;
      } catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function controls() {
      var tabs = [["sessoes", legendaHistorico("legenda_ic_historico_sessoes")], ["rodadas", legendaHistorico("legenda_ic_historico_rodadas")], ["periodos", legendaHistorico("legenda_ic_historico_periodos")]];
      var sorts = [["recentes", legendaHistorico("legenda_ic_historico_mais_recente_primeiro")], ["maior_amostra", legendaHistorico("legenda_ic_historico_maior_amostra")], ["maior_retorno", legendaHistorico("legenda_ic_historico_maior_retorno_observado")], ["menor_retorno", legendaHistorico("legenda_ic_historico_menor_retorno")], ["maior_resultado", legendaHistorico("legenda_ic_historico_maior_resultado")], ["maior_perda", legendaHistorico("legenda_ic_historico_maior_perda")], ["maior_sobrevivencia", legendaHistorico("legenda_ic_historico_maior_sobrevivencia")], ["menor_drawdown", legendaHistorico("legenda_ic_historico_menor_drawdown")], ["maior_aderencia", legendaHistorico("legenda_ic_historico_maior_aderencia")], ["duracao", legendaHistorico("legenda_ic_historico_duracao")], ["rodadas", legendaHistorico("legenda_ic_historico_quantidade_de_rodadas")]];
      return ('<div class="ic-history-controls"><div class="ic-chip-row" role="tablist" aria-label="' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_tipo_de_historico")) + '">') + tabs.map(function (tab) { return '<button class="ic-chip" type="button" role="tab" aria-selected="' + (state.tab === tab[0]) + '" data-screen-action="history-tab" data-action-value="' + tab[0] + '">' + Core.escapeHtml(tab[1]) + '</button>'; }).join("") + ('</div><div class="ic-filter-summary"><div class="ic-field"><label for="ic-history-sort">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_ordenar")) + '</label><select id="ic-history-sort" data-screen-change="history-sort">') + sorts.map(function (sort) { return '<option value="' + sort[0] + '"' + (state.sort === sort[0] ? " selected" : "") + '>' + Core.escapeHtml(sort[1]) + '</option>'; }).join("") + '</select></div>' + UI.button(state.filtersOpen ? legendaHistorico("legenda_ic_historico_ocultar_filtros") : legendaHistorico("legenda_ic_historico_filtros"), { action: "toggle-filters", icon: "filter" }) + '</div>' + filterForm() + '</div>';
    }

    function filterForm() {
      if (!state.filtersOpen) return "";
      return ('<form class="ic-card ic-form" id="icHistoryFilters"><div class="ic-form-grid"><div class="ic-field"><label for="ic-h-period">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_periodo")) + '</label><select id="ic-h-period" name="periodo"><option value="30d">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_ultimos_30_dias")) + '</option><option value="90d">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_ultimos_90_dias")) + '</option><option value="180d">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_ultimos_6_meses")) + '</option><option value="all">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_todo_o_historico")) + '</option></select></div><div class="ic-field"><label for="ic-h-bet">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_bet")) + '</label><input id="ic-h-bet" name="bet" maxlength="100"></div><div class="ic-field"><label for="ic-h-account">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_conta")) + '</label><input id="ic-h-account" name="conta" maxlength="100"></div><div class="ic-field"><label for="ic-h-game">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_jogo")) + '</label><input id="ic-h-game" name="jogo" maxlength="160"></div><div class="ic-field"><label for="ic-h-provider">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_provedor")) + '</label><input id="ic-h-provider" name="provedor" maxlength="120"></div><div class="ic-field"><label for="ic-h-currency">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_moeda")) + '</label><select id="ic-h-currency" name="moeda">') + Core.currencyOptions(currencyContext(), state.filters.moeda || "", legendaHistorico("legenda_ic_historico_todas")) + ('</select></div><div class="ic-field"><label for="ic-h-round">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_tipo_de_rodada")) + '</label><select id="ic-h-round" name="tipo_rodada"><option value="">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_todos")) + '</option><option value="paga">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_paga")) + '</option><option value="free_spin">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_free_spin")) + '</option><option value="bonus">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_bonus")) + '</option><option value="retorno_parcial">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_retorno_parcial")) + '</option></select></div><div class="ic-field"><label for="ic-h-session-origin">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_origem_da_sessao")) + '</label><select id="ic-h-session-origin" name="origem_sessao"><option value="">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_planejada_e_observada")) + '</option><option value="planejada">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_planejada")) + '</option><option value="observada">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_observada")) + '</option></select></div><div class="ic-field"><label for="ic-h-time">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_faixa_de_horario")) + '</label><input id="ic-h-time" name="horario" type="time"></div><div class="ic-field"><label for="ic-h-weekday">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_dia_da_semana")) + '</label><select id="ic-h-weekday" name="dia_semana"><option value="">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_todos")) + '</option><option value="1">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_segunda")) + '</option><option value="2">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_terca")) + '</option><option value="3">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_quarta")) + '</option><option value="4">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_quinta")) + '</option><option value="5">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_sexta")) + '</option><option value="6">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_sabado")) + '</option><option value="0">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_domingo")) + '</option></select></div><div class="ic-field"><label for="ic-h-month-week">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_semana_do_mes")) + '</label><select id="ic-h-month-week" name="semana_mes"><option value="">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_todas")) + '</option><option value="1">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_primeira")) + '</option><option value="2">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_segunda")) + '</option><option value="3">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_terceira")) + '</option><option value="4">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_quarta")) + '</option><option value="5">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_quinta")) + '</option><option value="-1">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_ultima")) + '</option></select></div><div class="ic-field"><label for="ic-h-exposure">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_faixa_de_exposicao")) + '</label><input id="ic-h-exposure" name="faixa_exposicao" maxlength="40" placeholder="' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_ex_0_25_0_50")) + '"></div><div class="ic-field"><label for="ic-h-multiplier">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_multiplicador_minimo")) + '</label><input id="ic-h-multiplier" name="multiplicador_minimo" inputmode="decimal"></div><div class="ic-field"><label for="ic-h-quality">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_qualidade")) + '</label><select id="ic-h-quality" name="qualidade"><option value="">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_todas")) + '</option><option value="completa">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_completa")) + '</option><option value="parcial">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_parcial")) + '</option><option value="insuficiente">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_insuficiente")) + '</option></select></div></div>') + UI.button(legendaHistorico("legenda_ic_historico_aplicar_filtros"), { type: "submit", kind: "primary" }) + '</form>';
    }

    function results() {
      var data = state.data || {};
      var items = Core.normalizeArray(data.items || data.itens);
      if (!items.length) return UI.state({ type: data.status === "amostra_insuficiente" ? "insufficient_data" : data.status === "qualidade_insuficiente" ? "insufficient_quality" : "empty", message: data.message || data.mensagem, meta: data.sample_summary || data.resumo_amostra, retry: false });
      return '<div class="ic-list">' + items.map(function (item) {
        var title = item.title || item.titulo || item.period_label || item.periodo_rotulo || Core.formatDateTime(item.started_at || item.inicio_em);
        var meta = item.description || item.descricao || [item.bet || item.bet_nome, item.game || item.jogo, item.rounds || item.rodadas ? (item.rounds || item.rodadas) + legendaHistorico("legenda_ic_historico_rodadas_2") : null].filter(Boolean).join(" · ");
        if (state.tab === "sessoes") {
          title = Core.formatDateTime(item.started_at || item.inicio_em);
          meta = [item.game || item.jogo, Core.formatNumber(item.rounds || item.rodadas || 0, 0) + legendaHistorico("legenda_ic_historico_rodadas_2"), item.duration_seconds == null ? null : Core.formatDuration(item.duration_seconds)].filter(Boolean).join(" · ");
        }
        var effectiveSource = item.effective_source || item.fonte_efetiva;
        if (effectiveSource) meta += (meta ? " · " : "") + (effectiveSource === "pessoal" ? legendaHistorico("legenda_ic_historico_origem_efetiva_seu_historico") : effectiveSource === "comunidade" ? legendaHistorico("legenda_ic_historico_origem_efetiva_comunidade_elegivel") : legendaHistorico("legenda_ic_historico_origem_efetiva_seu_historico_e_comunidade_elegivel"));
        var hasMoney = item.net_result_units_text !== undefined || item.resultado_liquido_unidades_texto !== undefined || item.net_result_units !== undefined || item.resultado_liquido_unidades !== undefined;
        var value = hasMoney ? Core.formatSignedMoney(Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], "0"), item.currency || item.moeda || "BRL", Core.decimalPlacesOf(item, 2)) : item.observed_return !== undefined || item.retorno_observado !== undefined ? Core.formatPercent(item.observed_return || item.retorno_observado, 1) : "";
        var actions = UI.button(legendaHistorico("legenda_ic_historico_detalhes"), { action: "history-detail", value: item.id || item.id_registro, kind: "quiet" });
        if (state.tab === "periodos" && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) actions += UI.button(item.plan_count || item.quantidade_planos ? legendaHistorico("legenda_ic_historico_plano_ativo") : legendaHistorico("legenda_ic_historico_planejar_sessao"), { action: "history-plan", value: item.id || item.id_registro, icon: "calendar", kind: item.plan_count || item.quantidade_planos ? "gold" : "quiet", disabled: item.planning_blocked || item.planejamento_bloqueado });
        return UI.listRow(title, meta, value, actions) + (state.tab === "sessoes" ? "" : UI.evidence(item.evidence || item.evidencia || item));
      }).join("") + '</div>' + (state.cursor ? '<div class="ic-card__footer">' + UI.button(state.loadingMore ? legendaHistorico("legenda_ic_historico_carregando") : legendaHistorico("legenda_ic_historico_carregar_mais"), { action: "load-more", disabled: state.loadingMore }) + '</div>' : '');
    }

    function render() {
      var html = UI.sectionHeader(legendaHistorico("legenda_ic_historico_meu_historico"), legendaHistorico("legenda_ic_historico_consulte_fatos_registrados_sem_transformar_o_passado_em_promessa_futura")) + '<div class="ic-page-stack">' + controls();
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += results();
      return html + ('<div class="ic-disclaimer">' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_dados_historicos_resultados_anteriores_nao_indicam_nem_garantem_resultados_futuros")) + '</div></div>');
    }

    function renderInto() {
      deps.container.innerHTML = render();
      var form = document.getElementById("icHistoryFilters");
      if (form) Object.keys(state.filters).forEach(function (key) { var field = form.elements.namedItem(key); if (field) field.value = state.filters[key]; });
    }

    function findItem(id) { return Core.normalizeArray((state.data || {}).items || (state.data || {}).itens).find(function (item) { return String(item.id || item.id_registro) === String(id); }); }
    function detailHtml(item) {
      var details = item.details || item.detalhes || {}, places = Core.decimalPlacesOf(item, null), currency = item.currency || item.moeda || "";
      var values = Object.assign({}, item, details);
      var fields = [["net_result_units", legendaHistorico("legenda_ic_historico_resultado_liquido"), "money"], ["stake_units", legendaHistorico("legenda_ic_historico_apostado"), "money"], ["return_units", legendaHistorico("legenda_ic_historico_retornado"), "money"], ["peak_units", legendaHistorico("legenda_ic_historico_pico_da_sessao"), "money"], ["giveback_units", legendaHistorico("legenda_ic_historico_reducao_apos_o_pico"), "money"], ["drawdown_units", legendaHistorico("legenda_ic_historico_maior_queda"), "money"], ["multiplier", legendaHistorico("legenda_ic_historico_multiplicador"), "multiplier"], ["bankroll_percent", legendaHistorico("legenda_ic_historico_aposta_sobre_a_banca"), "percent"], ["loss_streak", legendaHistorico("legenda_ic_historico_sequencia_de_perdas")], ["stake_increases_after_loss", legendaHistorico("legenda_ic_historico_aumentos_apos_perdas")], ["accelerations_after_loss", legendaHistorico("legenda_ic_historico_aceleracoes_apos_perdas")], ["disguised_losses", legendaHistorico("legenda_ic_historico_retornos_parciais_com_perda")], ["disguised_loss", legendaHistorico("legenda_ic_historico_retorno_parcial_com_perda"), "boolean"], ["stake_increase_after_loss", legendaHistorico("legenda_ic_historico_aumento_apos_perda"), "boolean"], ["acceleration_after_loss", legendaHistorico("legenda_ic_historico_aceleracao_apos_perda"), "boolean"]];
      var rows = fields.filter(function (field) { return values[field[0]] !== undefined; }).map(function (field) {
        var value = values[field[0]], formatted = value == null ? legendaHistorico("legenda_ic_historico_nao_disponivel") : field[2] === "money" ? Core.formatSignedMoney(value, currency, places) : field[2] === "boolean" ? (value === true ? legendaHistorico("legenda_ic_historico_sim") : value === false ? legendaHistorico("legenda_ic_historico_nao") : legendaHistorico("legenda_ic_historico_nao_disponivel")) : field[2] === "percent" ? Core.formatPercent(value, 2) : Core.formatNumber(value) + (field[2] === "multiplier" ? "×" : "");
        return UI.listRow(field[1], "", formatted);
      }).join("");
      return '<div class="ic-list">' + rows + ('</div><details class="ic-form-section"><summary>' + Core.escapeHtml(legendaHistorico("legenda_ic_historico_registro_tecnico_completo")) + '</summary><pre class="ic-detail-json">') + Core.escapeHtml(JSON.stringify(details, null, 2)) + '</pre></details>';
    }
    async function loadMore() {
      if (!state.cursor || state.loadingMore) return;
      state.loadingMore = true; renderInto();
      try {
        var result = await deps.api.rpc("ic_historico_listar_rpc", { p_tipo: state.tab, p_ordenacao: state.sort, p_filtros: state.filters, p_cursor: state.cursor, p_limite: 50 }, { key: "history:more" });
        var currentItems = Core.normalizeArray((state.data || {}).items || (state.data || {}).itens);
        var nextItems = Core.normalizeArray((result.data || {}).items || (result.data || {}).itens);
        var seen = {};
        var merged = currentItems.concat(nextItems).filter(function (item, index) {
          var id = item && (item.id || item.id_registro || item.cod_historico || item.cod_sessao);
          if (id === null || typeof id === "undefined" || id === "") return true;
          var key = String(id); if (seen[key]) return false; seen[key] = index + 1; return true;
        });
        state.data = Object.assign({}, state.data || {}, result.data || {}, { items: merged });
        state.cursor = nextCursor(result); state.error = null;
      } catch (error) { if (error.code !== "aborted" && error.code !== "stale_session") UI.toast(error.message || legendaHistorico("legenda_ic_historico_nao_foi_possivel_carregar_a_proxima_pagina")); }
      state.loadingMore = false; renderInto();
    }

    function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "toggle-filters") { state.filtersOpen = !state.filtersOpen; renderInto(); return; }
      if (action === "history-tab") { state.tab = value; state.status = "idle"; renderInto(); load(true); return; }
      if (action === "history-detail") { var item = findItem(value); if (item) UI.openSheet({ eyebrow: state.tab, title: item.title || item.titulo || legendaHistorico("legenda_ic_historico_detalhes_historicos"), html: UI.banner(item.title || item.titulo || legendaHistorico("legenda_ic_historico_registro"), item.description || item.descricao || legendaHistorico("legenda_ic_historico_informacoes_registradas_pelo_sistema"), item.status) + UI.evidence(item.evidence || item.evidencia || item) + detailHtml(item) }); }
      if (action === "history-plan") { var selected = findItem(value); deps.store.set({ planningDraft: selected || null }); deps.navigate({ section: "planejar" }); UI.toast(legendaHistorico("legenda_ic_historico_confirme_data_futura_duracao_limite_e_lembrete_antes_de_criar_o_plano")); }
      if (action === "load-more") return loadMore();
    }

    function handleChange(element) { if (element.dataset.screenChange === "history-sort") { state.sort = element.value; state.status = "idle"; load(true); } }
    function handleSubmit(form) { if (form.id === "icHistoryFilters") { var values = new FormData(form), filters = {}; values.forEach(function (value, key) { if (String(value).trim()) filters[key] = String(value).trim(); }); state.filters = filters; state.status = "idle"; load(true); } }
    return { render: render, load: load, handleAction: handleAction, handleChange: handleChange, handleSubmit: handleSubmit };
  };
}(window));
