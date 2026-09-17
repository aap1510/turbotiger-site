(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

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
      var tabs = [["sessoes", "Sessões"], ["rodadas", "Rodadas"], ["periodos", "Períodos"]];
      var sorts = [["recentes", "Mais recente primeiro"], ["maior_amostra", "Maior amostra"], ["maior_retorno", "Maior retorno observado"], ["menor_retorno", "Menor retorno"], ["maior_resultado", "Maior resultado"], ["maior_perda", "Maior perda"], ["maior_sobrevivencia", "Maior sobrevivência"], ["menor_drawdown", "Menor drawdown"], ["maior_aderencia", "Maior aderência"], ["duracao", "Duração"], ["rodadas", "Quantidade de rodadas"]];
      return '<div class="ic-history-controls"><div class="ic-chip-row" role="tablist" aria-label="Tipo de histórico">' + tabs.map(function (tab) { return '<button class="ic-chip" type="button" role="tab" aria-selected="' + (state.tab === tab[0]) + '" data-screen-action="history-tab" data-action-value="' + tab[0] + '">' + tab[1] + '</button>'; }).join("") + '</div><div class="ic-filter-summary"><div class="ic-field"><label for="ic-history-sort">Ordenar</label><select id="ic-history-sort" data-screen-change="history-sort">' + sorts.map(function (sort) { return '<option value="' + sort[0] + '"' + (state.sort === sort[0] ? " selected" : "") + '>' + sort[1] + '</option>'; }).join("") + '</select></div>' + UI.button(state.filtersOpen ? "Ocultar filtros" : "Filtros", { action: "toggle-filters", icon: "filter" }) + '</div>' + filterForm() + '</div>';
    }

    function filterForm() {
      if (!state.filtersOpen) return "";
      return '<form class="ic-card ic-form" id="icHistoryFilters"><div class="ic-form-grid"><div class="ic-field"><label for="ic-h-period">Período</label><select id="ic-h-period" name="periodo"><option value="30d">Últimos 30 dias</option><option value="90d">Últimos 90 dias</option><option value="180d">Últimos 6 meses</option><option value="all">Todo o histórico</option></select></div><div class="ic-field"><label for="ic-h-bet">Bet</label><input id="ic-h-bet" name="bet" maxlength="100"></div><div class="ic-field"><label for="ic-h-account">Conta</label><input id="ic-h-account" name="conta" maxlength="100"></div><div class="ic-field"><label for="ic-h-game">Jogo</label><input id="ic-h-game" name="jogo" maxlength="160"></div><div class="ic-field"><label for="ic-h-provider">Provedor</label><input id="ic-h-provider" name="provedor" maxlength="120"></div><div class="ic-field"><label for="ic-h-currency">Moeda</label><select id="ic-h-currency" name="moeda">' + Core.currencyOptions(currencyContext(), state.filters.moeda || "", "Todas") + '</select></div><div class="ic-field"><label for="ic-h-round">Tipo de rodada</label><select id="ic-h-round" name="tipo_rodada"><option value="">Todos</option><option value="paga">Paga</option><option value="free_spin">Free spin</option><option value="bonus">Bônus</option><option value="retorno_parcial">Retorno parcial</option></select></div><div class="ic-field"><label for="ic-h-session-origin">Origem da sessão</label><select id="ic-h-session-origin" name="origem_sessao"><option value="">Planejada e observada</option><option value="planejada">Planejada</option><option value="observada">Observada</option></select></div><div class="ic-field"><label for="ic-h-time">Faixa de horário</label><input id="ic-h-time" name="horario" type="time"></div><div class="ic-field"><label for="ic-h-weekday">Dia da semana</label><select id="ic-h-weekday" name="dia_semana"><option value="">Todos</option><option value="1">Segunda</option><option value="2">Terça</option><option value="3">Quarta</option><option value="4">Quinta</option><option value="5">Sexta</option><option value="6">Sábado</option><option value="0">Domingo</option></select></div><div class="ic-field"><label for="ic-h-month-week">Semana do mês</label><select id="ic-h-month-week" name="semana_mes"><option value="">Todas</option><option value="1">Primeira</option><option value="2">Segunda</option><option value="3">Terceira</option><option value="4">Quarta</option><option value="5">Quinta</option><option value="-1">Última</option></select></div><div class="ic-field"><label for="ic-h-exposure">Faixa de exposição</label><input id="ic-h-exposure" name="faixa_exposicao" maxlength="40" placeholder="Ex.: 0,25%–0,50%"></div><div class="ic-field"><label for="ic-h-multiplier">Multiplicador mínimo</label><input id="ic-h-multiplier" name="multiplicador_minimo" inputmode="decimal"></div><div class="ic-field"><label for="ic-h-quality">Qualidade</label><select id="ic-h-quality" name="qualidade"><option value="">Todas</option><option value="completa">Completa</option><option value="parcial">Parcial</option><option value="insuficiente">Insuficiente</option></select></div></div>' + UI.button("Aplicar filtros", { type: "submit", kind: "primary" }) + '</form>';
    }

    function results() {
      var data = state.data || {};
      var items = Core.normalizeArray(data.items || data.itens);
      if (!items.length) return UI.state({ type: data.status === "amostra_insuficiente" ? "insufficient_data" : data.status === "qualidade_insuficiente" ? "insufficient_quality" : "empty", message: data.message || data.mensagem, meta: data.sample_summary || data.resumo_amostra, retry: false });
      return '<div class="ic-list">' + items.map(function (item) {
        var title = item.title || item.titulo || item.period_label || item.periodo_rotulo || Core.formatDateTime(item.started_at || item.inicio_em);
        var meta = item.description || item.descricao || [item.bet || item.bet_nome, item.game || item.jogo, item.rounds || item.rodadas ? (item.rounds || item.rodadas) + " rodadas" : null].filter(Boolean).join(" · ");
        if (state.tab === "sessoes") {
          title = Core.formatDateTime(item.started_at || item.inicio_em);
          meta = [item.game || item.jogo, Core.formatNumber(item.rounds || item.rodadas || 0, 0) + " rodadas", item.duration_seconds == null ? null : Core.formatDuration(item.duration_seconds)].filter(Boolean).join(" · ");
        }
        var effectiveSource = item.effective_source || item.fonte_efetiva;
        if (effectiveSource) meta += (meta ? " · " : "") + (effectiveSource === "pessoal" ? "Origem efetiva: seu histórico" : effectiveSource === "comunidade" ? "Origem efetiva: comunidade elegível" : "Origem efetiva: seu histórico e comunidade elegível");
        var hasMoney = item.net_result_units_text !== undefined || item.resultado_liquido_unidades_texto !== undefined || item.net_result_units !== undefined || item.resultado_liquido_unidades !== undefined;
        var value = hasMoney ? Core.formatSignedMoney(Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], "0"), item.currency || item.moeda || "BRL", Core.decimalPlacesOf(item, 2)) : item.observed_return !== undefined || item.retorno_observado !== undefined ? Core.formatPercent(item.observed_return || item.retorno_observado, 1) : "";
        var actions = UI.button("Detalhes", { action: "history-detail", value: item.id || item.id_registro, kind: "quiet" });
        if (state.tab === "periodos" && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) actions += UI.button(item.plan_count || item.quantidade_planos ? "Plano ativo" : "Planejar sessão", { action: "history-plan", value: item.id || item.id_registro, icon: "calendar", kind: item.plan_count || item.quantidade_planos ? "gold" : "quiet", disabled: item.planning_blocked || item.planejamento_bloqueado });
        return UI.listRow(title, meta, value, actions) + (state.tab === "sessoes" ? "" : UI.evidence(item.evidence || item.evidencia || item));
      }).join("") + '</div>' + (state.cursor ? '<div class="ic-card__footer">' + UI.button(state.loadingMore ? "Carregando…" : "Carregar mais", { action: "load-more", disabled: state.loadingMore }) + '</div>' : '');
    }

    function render() {
      var html = UI.sectionHeader("Meu Histórico", "Consulte fatos registrados sem transformar o passado em promessa futura.", UI.button("Meus alertas", { route: "configuracoes", icon: "bell" }) + UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">' + controls();
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += results();
      return html + '<div class="ic-disclaimer">Dados históricos. Resultados anteriores não indicam nem garantem resultados futuros.</div></div>';
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
      var fields = [["net_result_units", "Resultado líquido", "money"], ["stake_units", "Apostado", "money"], ["return_units", "Retornado", "money"], ["peak_units", "Pico da sessão", "money"], ["giveback_units", "Redução após o pico", "money"], ["drawdown_units", "Maior queda", "money"], ["multiplier", "Multiplicador", "multiplier"], ["bankroll_percent", "Aposta sobre a banca", "percent"], ["loss_streak", "Sequência de perdas"], ["stake_increases_after_loss", "Aumentos após perdas"], ["accelerations_after_loss", "Acelerações após perdas"], ["disguised_losses", "Retornos parciais com perda"], ["disguised_loss", "Retorno parcial com perda", "boolean"], ["stake_increase_after_loss", "Aumento após perda", "boolean"], ["acceleration_after_loss", "Aceleração após perda", "boolean"]];
      var rows = fields.filter(function (field) { return values[field[0]] !== undefined; }).map(function (field) {
        var value = values[field[0]], formatted = value == null ? "Não disponível" : field[2] === "money" ? Core.formatSignedMoney(value, currency, places) : field[2] === "boolean" ? (value === true ? "Sim" : value === false ? "Não" : "Não disponível") : field[2] === "percent" ? Core.formatPercent(value, 2) : Core.formatNumber(value) + (field[2] === "multiplier" ? "×" : "");
        return UI.listRow(field[1], "", formatted);
      }).join("");
      return '<div class="ic-list">' + rows + '</div><details class="ic-form-section"><summary>Registro técnico completo</summary><pre class="ic-detail-json">' + Core.escapeHtml(JSON.stringify(details, null, 2)) + '</pre></details>';
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
      } catch (error) { if (error.code !== "aborted" && error.code !== "stale_session") UI.toast(error.message || "Não foi possível carregar a próxima página."); }
      state.loadingMore = false; renderInto();
    }

    function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "toggle-filters") { state.filtersOpen = !state.filtersOpen; renderInto(); return; }
      if (action === "history-tab") { state.tab = value; state.status = "idle"; renderInto(); load(true); return; }
      if (action === "history-detail") { var item = findItem(value); if (item) UI.openSheet({ eyebrow: state.tab, title: item.title || item.titulo || "Detalhes históricos", html: UI.banner(item.title || item.titulo || "Registro", item.description || item.descricao || "Informações registradas pelo sistema.", item.status) + UI.evidence(item.evidence || item.evidencia || item) + detailHtml(item) }); }
      if (action === "history-plan") { var selected = findItem(value); deps.store.set({ planningDraft: selected || null }); deps.navigate({ section: "planejar" }); UI.toast("Confirme data futura, duração, limite e lembrete antes de criar o plano."); }
      if (action === "load-more") return loadMore();
    }

    function handleChange(element) { if (element.dataset.screenChange === "history-sort") { state.sort = element.value; state.status = "idle"; load(true); } }
    function handleSubmit(form) { if (form.id === "icHistoryFilters") { var values = new FormData(form), filters = {}; values.forEach(function (value, key) { if (String(value).trim()) filters[key] = String(value).trim(); }); state.filters = filters; state.status = "idle"; load(true); } }
    return { render: render, load: load, handleAction: handleAction, handleChange: handleChange, handleSubmit: handleSubmit };
  };
}(window));
