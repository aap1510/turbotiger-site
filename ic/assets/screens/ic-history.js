(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens.historico = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, tab: "sessoes", sort: "recentes", filtersOpen: false, filters: {}, cursor: null, loadingMore: false, pendingSubscription: null };

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
        var effectiveSource = item.effective_source || item.fonte_efetiva;
        if (effectiveSource) meta += (meta ? " · " : "") + (effectiveSource === "pessoal" ? "Origem efetiva: seu histórico" : effectiveSource === "comunidade" ? "Origem efetiva: comunidade elegível" : "Origem efetiva: seu histórico e comunidade elegível");
        var hasMoney = item.net_result_units_text !== undefined || item.resultado_liquido_unidades_texto !== undefined || item.net_result_units !== undefined || item.resultado_liquido_unidades !== undefined;
        var value = hasMoney ? Core.formatSignedMoney(Core.unitsFrom(item, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], "0"), item.currency || item.moeda || "BRL", Core.decimalPlacesOf(item, 2)) : item.observed_return !== undefined || item.retorno_observado !== undefined ? Core.formatPercent(item.observed_return || item.retorno_observado, 1) : "";
        var actions = UI.button("Detalhes", { action: "history-detail", value: item.id || item.id_registro, kind: "quiet" });
        if (state.tab === "periodos" && deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) actions += UI.button(item.plan_count || item.quantidade_planos ? "Plano ativo" : "Planejar sessão", { action: "history-plan", value: item.id || item.id_registro, icon: "calendar", kind: item.plan_count || item.quantidade_planos ? "gold" : "quiet", disabled: item.planning_blocked || item.planejamento_bloqueado });
        if (state.tab === "periodos" && isSubscribable(item) && deps.featureEnabled("ic_personal_insights_enabled")) actions += UI.button(item.notification_active || item.notificacao_ativa ? "Gerenciar lembrete" : "Lembrar deste padrão", { action: "history-subscribe", value: evidenceId(item), icon: "bell", kind: item.notification_active || item.notificacao_ativa ? "gold" : "quiet" });
        return UI.listRow(title, meta, value, actions) + UI.evidence(item.evidence || item.evidencia || item);
      }).join("") + '</div>' + (state.cursor ? '<div class="ic-card__footer">' + UI.button(state.loadingMore ? "Carregando…" : "Carregar mais", { action: "load-more", disabled: state.loadingMore }) + '</div>' : '');
    }

    function render() {
      var html = UI.sectionHeader("Meu Histórico", "Consulte fatos registrados sem transformar o passado em promessa futura.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">' + controls();
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
    function patternCode(item) { return item && (item.hypothesis_code || item.codigo_hipotese || item.pattern_code || item.codigo_padrao); }
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
      var html = UI.banner("Direção observada: " + direction, "Escolha quais dados devem sustentar o lembrete recorrente. Cada aviso identificará somente a fonte efetivamente elegível naquela ocorrência.", "neutral") + '<div class="ic-choice-grid">' + UI.button("Meu histórico", { action: "history-source", value: "pessoal" }) + UI.button("Comunidade", { action: "history-source", value: "comunidade" }) + UI.button("Ambos, quando elegíveis", { action: "history-source", value: "ambos", kind: "primary" }) + '</div>' + (!eligible ? UI.banner("Comunidade ainda sem evidência elegível", "Você pode registrar essa preferência agora. Nenhum aviso alegará origem comunitária até que a célula atenda aos critérios de amostra, qualidade, concentração e privacidade.", "neutral") : '') + (item.notification_active || item.notificacao_ativa ? '<div class="ic-card__footer">' + UI.button("Desativar lembrete", { action: "history-unsubscribe", kind: "danger" }) + '</div>' : '') + '<div class="ic-disclaimer">Sem data fixa: o Turbo Tiger reconhecerá cada nova ocorrência da janela histórica. Isso não cria Sessão Planejada nem prevê resultados.</div>';
      UI.openSheet({ eyebrow: patternCode(item), title: "Lembrete de padrão histórico", html: html });
    }
    async function saveSubscription(source, active) {
      var item = state.pendingSubscription;
      if (!item || !patternCode(item)) return;
      try {
        await deps.api.rpc("ic_hipotese_notificacao_rpc", { p_id_insight_evidencia: evidenceId(item), p_escopo_estatistico: source, p_ativa: active }, { key: "history:subscription" });
        UI.closeSheet(); UI.toast(active ? "Lembrete recorrente ativado." : "Lembrete recorrente desativado."); state.pendingSubscription = null; state.status = "idle"; await load(true);
      } catch (error) { UI.toast(error.message || "Não foi possível atualizar a assinatura."); }
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
      if (action === "history-detail") { var item = findItem(value); if (item) UI.openSheet({ eyebrow: state.tab, title: item.title || item.titulo || "Detalhes históricos", html: UI.banner(item.title || item.titulo || "Registro", item.description || item.descricao || "Informações registradas pelo sistema.", item.status) + UI.evidence(item.evidence || item.evidencia || item) + '<pre class="ic-detail-json">' + Core.escapeHtml(JSON.stringify(item.details || item.detalhes || {}, null, 2)) + '</pre>' }); }
      if (action === "history-plan") { var selected = findItem(value); deps.store.set({ planningDraft: selected || null }); deps.navigate({ section: "planejar" }); UI.toast("Confirme data futura, duração, limite e lembrete antes de criar o plano."); }
      if (action === "history-subscribe") { var subscription = Core.normalizeArray((state.data || {}).items || (state.data || {}).itens).find(function (item) { return String(evidenceId(item)) === String(value); }); if (subscription && isSubscribable(subscription)) subscriptionSheet(subscription); }
      if (action === "history-source" && ["pessoal", "comunidade", "ambos"].indexOf(value) >= 0) return saveSubscription(value, true);
      if (action === "history-unsubscribe") return saveSubscription((state.pendingSubscription && (state.pendingSubscription.notification_source || state.pendingSubscription.fonte_notificacao || state.pendingSubscription.scope || state.pendingSubscription.escopo_estatistico)) || "ambos", false);
      if (action === "load-more") return loadMore();
    }

    function handleChange(element) { if (element.dataset.screenChange === "history-sort") { state.sort = element.value; state.status = "idle"; load(true); } }
    function handleSubmit(form) { if (form.id === "icHistoryFilters") { var values = new FormData(form), filters = {}; values.forEach(function (value, key) { if (String(value).trim()) filters[key] = String(value).trim(); }); state.filters = filters; state.status = "idle"; load(true); } }
    return { render: render, load: load, handleAction: handleAction, handleChange: handleChange, handleSubmit: handleSubmit };
  };
}(window));
