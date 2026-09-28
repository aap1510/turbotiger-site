(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasJogos = {
    "legenda_ic_jogos_buscar_jogo": "Buscar jogo",
    "legenda_ic_jogos_nome_provedor_ou_versao": "Nome, provedor ou versão",
    "legenda_ic_jogos_refinar_pesquisa": "Refinar pesquisa",
    "legenda_ic_jogos_bet": "Bet",
    "legenda_ic_jogos_provedor": "Provedor",
    "legenda_ic_jogos_versao": "Versão",
    "legenda_ic_jogos_plataforma": "Plataforma",
    "legenda_ic_jogos_todas": "Todas",
    "legenda_ic_jogos_mobile": "Mobile",
    "legenda_ic_jogos_web": "Web",
    "legenda_ic_jogos_moeda": "Moeda",
    "legenda_ic_jogos_qualidade": "Qualidade",
    "legenda_ic_jogos_alta": "Alta",
    "legenda_ic_jogos_moderada": "Moderada",
    "legenda_ic_jogos_baixa": "Baixa",
    "legenda_ic_jogos_insuficiente": "Insuficiente",
    "legenda_ic_jogos_minimo_de_rodadas": "Mínimo de rodadas",
    "legenda_ic_jogos_ordenar": "Ordenar",
    "legenda_ic_jogos_ordem_alfabetica": "Ordem alfabética",
    "legenda_ic_jogos_maior_cobertura": "Maior cobertura",
    "legenda_ic_jogos_quantidade_de_rodadas": "Quantidade de rodadas",
    "legenda_ic_jogos_pesquisar": "Pesquisar",
    "legenda_ic_jogos_dados_insuficientes": "dados insuficientes",
    "legenda_ic_jogos_jogo": "Jogo",
    "legenda_ic_jogos_provedor_nao_identificado": "Provedor não identificado",
    "legenda_ic_jogos_versao_2": " · versão ",
    "legenda_ic_jogos_nao_identificada": "não identificada",
    "legenda_ic_jogos_rodadas": "Rodadas",
    "legenda_ic_jogos_retorno_pago": "Retorno pago",
    "legenda_ic_jogos_frequencia_de_retorno": "Frequência de retorno",
    "legenda_ic_jogos_passaporte_matematico": "Passaporte Matemático",
    "legenda_ic_jogos_a_lista_nunca_e_ordenada_por_melhor_jogo_retorno_observado_nao_indica_quando_um_jogo_pagara": "A lista nunca é ordenada por “melhor jogo”. Retorno observado não indica quando um jogo pagará.",
    "legenda_ic_jogos_jogos": "Jogos",
    "legenda_ic_jogos_compare_cobertura_volatilidade_e_integridade_nao_promessa_de_resultado": "Compare cobertura, volatilidade e integridade — não promessa de resultado.",
    "legenda_ic_jogos_compare_cobertura_e_volatilidade_nao_promessa_de_resultado": "Compare cobertura e volatilidade — não promessa de resultado.",
    "legenda_ic_jogos_seu_historico": "Seu histórico",
    "legenda_ic_jogos_comunidade_elegivel": "Comunidade elegível",
    "legenda_ic_jogos_seu_historico_simulacao_empirica": "Seu histórico — simulação empírica",
    "legenda_ic_jogos_fonte_nao_informada": "Fonte não informada",
    "legenda_ic_jogos_fonte": "Fonte",
    "legenda_ic_jogos_amostra": "Amostra",
    "legenda_ic_jogos_rodadas_pagas": " rodadas pagas; ",
    "legenda_ic_jogos_sessoes": " sessões; ",
    "legenda_ic_jogos_usuarios": " usuários",
    "legenda_ic_jogos_periodo": "Período",
    "legenda_ic_jogos_ate": " até ",
    "legenda_ic_jogos_metodo": "Método",
    "legenda_ic_jogos_atualizacao": "Atualização",
    "legenda_ic_jogos_rtp_declarado": "RTP declarado",
    "legenda_ic_jogos_retorno_observado_rodadas_pagas": "Retorno observado (rodadas pagas)",
    "legenda_ic_jogos_retorno_bruto_de_free_spins": "Retorno bruto de free spins",
    "legenda_ic_jogos_valor_monetario_separado_do_retorno_das_rodadas_pagas": "Valor monetário separado do retorno das rodadas pagas.",
    "legenda_ic_jogos_volatilidade_observada": "Volatilidade observada",
    "legenda_ic_jogos_somente_rodadas_pagas": "Somente rodadas pagas",
    "legenda_ic_jogos_total_incluindo_bonus": "Total, incluindo bônus",
    "legenda_ic_jogos_nao_identificado": "Não identificado",
    "legenda_ic_jogos_recorte": "Recorte",
    "legenda_ic_jogos_bet_2": "Bet ",
    "legenda_ic_jogos_casas_decimais": " casas decimais",
    "legenda_ic_jogos_escopo_do_rtp_declarado": "Escopo do RTP declarado",
    "legenda_ic_jogos_componentes_comparaveis": "Componentes comparáveis",
    "legenda_ic_jogos_comparacao_nao_liberada": "Comparação não liberada",
    "legenda_ic_jogos_a_referencia_declarada_corresponde_ao_componente_pago_observado_isso_nao_certifica_o_jogo_nem_p": "A referência declarada corresponde ao componente pago observado. Isso não certifica o jogo nem prevê resultados.",
    "legenda_ic_jogos_o_escopo_declarado_ou_o_vinculo_do_ciclo_de_bonus_nao_permite_comparar_os_componentes_com_segur": "O escopo declarado ou o vínculo do ciclo de bônus não permite comparar os componentes com segurança. Isso não demonstra falha do jogo.",
    "legenda_ic_jogos_nao_calculada": "não calculada",
    "legenda_ic_jogos_desvio_padrao": "× (desvio-padrão)",
    "legenda_ic_jogos_carregando_dados_do_jogo": "Carregando dados do jogo",
    "legenda_ic_jogos_integridade": "Integridade: ",
    "legenda_ic_jogos_integridade_2": "Integridade",
    "legenda_ic_jogos_nao_ha_justificativa_detalhada_disponivel_para_este_recorte": "Não há justificativa detalhada disponível para este recorte.",
    "legenda_ic_jogos_o_turbo_tiger_nao_assume_rtp_padrao_retorno_apenas_das_rodadas_pagas_nao_e_diretamente_comparav": "O Turbo Tiger não assume RTP padrão. Retorno apenas das rodadas pagas não é diretamente comparável a um RTP declarado que inclua bônus. Moedas e recortes não são somados.",
    "legenda_ic_jogos_simular_exposicao_da_sessao": "Simular exposição da sessão",
    "legenda_ic_jogos_dados_indisponiveis": "Dados indisponíveis",
    "legenda_ic_jogos_antes_da_decisao": "Antes da decisão",
    "legenda_ic_jogos_simular_risco_da_sessao": "Simular risco da sessão",
    "legenda_ic_jogos_estimativa_condicionada": "Estimativa condicionada",
    "legenda_ic_jogos_a_simulacao_usa_uma_distribuicao_historica_elegivel_nao_preve_rodadas_nao_garante_perdas_maxima": "A simulação usa uma distribuição histórica elegível. Não prevê rodadas, não garante perdas máximas e pode subestimar eventos raros não observados.",
    "legenda_ic_jogos_valor_por_rodada": "Valor por rodada",
    "legenda_ic_jogos_limite_maximo_de_perda": "Limite máximo de perda",
    "legenda_ic_jogos_quantidade_prevista_de_rodadas": "Quantidade prevista de rodadas",
    "legenda_ic_jogos_calcular_estimativa": "Calcular estimativa",
    "legenda_ic_jogos_selecione_uma_moeda_validada": "Selecione uma moeda validada.",
    "legenda_ic_jogos_revise_aposta_limite_e_quantidade_de_rodadas": "Revise aposta, limite e quantidade de rodadas.",
    "legenda_ic_jogos_atingir_o_limite": "Atingir o limite",
    "legenda_ic_jogos_perda_mediana": "Perda mediana",
    "legenda_ic_jogos_var_95": "VaR 95%",
    "legenda_ic_jogos_media_dos_piores_5": "Média dos piores 5%",
    "legenda_ic_jogos_drawdown_percentil_95": "Drawdown percentil 95",
    "legenda_ic_jogos_perda_media_simulada": "Perda média simulada",
    "legenda_ic_jogos_estimativa_indisponivel": "Estimativa indisponível",
    "legenda_ic_jogos_a_versao_a_captura_ou_a_amostra_ainda_nao_atendem_aos_criterios_do_modelo": "A versão, a captura ou a amostra ainda não atendem aos critérios do modelo.",
    "legenda_ic_jogos_incerteza_numerica_da_simulacao_wilson_95": "Incerteza numérica da simulação (Wilson 95%)",
    "legenda_ic_jogos_a": " a ",
    "legenda_ic_jogos_cenarios_atingiram_o_limite_em": " cenários atingiram o limite em ",
    "legenda_ic_jogos_simulacoes": " simulações",
    "legenda_ic_jogos_recorte_da_simulacao": "Recorte da simulação",
    "legenda_ic_jogos_incerteza_do_modelo": "Incerteza do modelo",
    "legenda_ic_jogos_a_simulacao_usa_apenas_os_multiplicadores_observados_premios_raros_ainda_nao_capturados_permane": "A simulação usa apenas os multiplicadores observados. Prêmios raros ainda não capturados permanecem desconhecidos; a incerteza numérica da simulação não elimina essa limitação.",
    "legenda_ic_jogos_limite_aplicado_apos_cada_rodada": "Limite aplicado após cada rodada",
    "legenda_ic_jogos_a_rodada_que_cruza_o_limite_pode_ultrapassa_lo_o_resultado_depende_das_condicoes_e_da_amostra_n": "A rodada que cruza o limite pode ultrapassá-lo. O resultado depende das condições e da amostra, não representa garantia e não recomenda iniciar uma sessão.",
    "legenda_ic_jogos_simulacao_reprodutivel": "Simulação reprodutível",
    "legenda_ic_jogos_distribuicao_estimada_da_sessao": "Distribuição estimada da sessão",
    "legenda_ic_jogos_nao_foi_possivel_concluir_a_simulacao": "Não foi possível concluir a simulação."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasJogos);
  function legendaJogos(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasJogos[chave]; }

  IC.Screens.jogos = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, query: "", quality: "", order: "rounds", filters: {}, simulationGame: null, simulationBet: null, passport: null, simulating: false, simulationRequest: null };
    var disposed = false, passportRevision = 0;

    function currencyContext() {
      var bootstrap = deps.store.getState().bootstrap;
      return bootstrap && bootstrap.data || {};
    }

    async function load(force) {
      if (disposed || state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try {
        var result = await deps.api.rpc("ic_jogos_listar_rpc", { p_busca: state.query || null, p_qualidade: state.quality || null, p_ordenacao: state.order, p_filtros: state.filters, p_cursor: null, p_limite: 40 }, { key: "games:list" });
        if (disposed) return;
        state.status = "ready"; state.data = result.data || {}; state.error = null;
      } catch (error) { if (disposed || error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function selected(value, expected) { return value === expected ? " selected" : ""; }
    function filterValue(name) { return Core.safeText(state.filters[name], ""); }
    function filters() {
      return ('<form class="ic-card ic-form" id="icGameFilters"><div class="ic-form-grid"><div class="ic-field"><label for="ic-game-search">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_buscar_jogo")) + '</label><input id="ic-game-search" name="query" type="search" maxlength="160" placeholder="' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_nome_provedor_ou_versao")) + "\" value=\"") + Core.escapeHtml(state.query) + ('"></div></div><details class="ic-advanced"><summary>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_refinar_pesquisa")) + '</summary><div class="ic-form-grid"><div class="ic-field"><label for="ic-game-bet">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_bet")) + '</label><input id="ic-game-bet" name="bet" maxlength="100" value="') + Core.escapeHtml(filterValue("bet")) + ('"></div><div class="ic-field"><label for="ic-game-provider">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_provedor")) + '</label><input id="ic-game-provider" name="provider" maxlength="120" value="') + Core.escapeHtml(filterValue("provider")) + ('"></div><div class="ic-field"><label for="ic-game-version">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_versao")) + '</label><input id="ic-game-version" name="version" maxlength="100" value="') + Core.escapeHtml(filterValue("version")) + ('"></div><div class="ic-field"><label for="ic-game-platform">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_plataforma")) + '</label><select id="ic-game-platform" name="platform"><option value="">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_todas")) + '</option><option value="mobile"') + selected(filterValue("platform"), "mobile") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_mobile")) + '</option><option value="web"') + selected(filterValue("platform"), "web") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_web")) + '</option></select></div><div class="ic-field"><label for="ic-game-currency">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_moeda")) + '</label><select id="ic-game-currency" name="currency">') + Core.currencyOptions(currencyContext(), filterValue("currency"), legendaJogos("legenda_ic_jogos_todas")) + ('</select></div><div class="ic-field"><label for="ic-game-quality">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_qualidade")) + '</label><select id="ic-game-quality" name="quality"><option value="">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_todas")) + '</option><option value="alta"') + selected(state.quality, "alta") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_alta")) + '</option><option value="moderada"') + selected(state.quality, "moderada") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_moderada")) + '</option><option value="baixa"') + selected(state.quality, "baixa") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_baixa")) + '</option><option value="insuficiente"') + selected(state.quality, "insuficiente") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_insuficiente")) + '</option></select></div><div class="ic-field"><label for="ic-game-rounds">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_minimo_de_rodadas")) + '</label><input id="ic-game-rounds" name="minimum_rounds" type="number" min="0" step="1" value="') + Core.escapeHtml(filterValue("minimum_rounds")) + ('"></div><div class="ic-field"><label for="ic-game-order">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_ordenar")) + '</label><select id="ic-game-order" name="order"><option value="alphabetical"') + selected(state.order, "alphabetical") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_ordem_alfabetica")) + '</option><option value="coverage"') + selected(state.order, "coverage") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_maior_cobertura")) + '</option><option value="rounds"') + selected(state.order, "rounds") + ('>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_quantidade_de_rodadas")) + '</option></select></div></div></details>') + UI.button(legendaJogos("legenda_ic_jogos_pesquisar"), { type: "submit", icon: "search", kind: "primary" }) + '</form>';
    }

    function games() {
      var data = state.data || {}, items = Core.normalizeArray(data.items || data.itens);
      if (!items.length) return UI.state({ type: data.status === "amostra_insuficiente" ? "insufficient_data" : "empty", message: data.message || data.mensagem, retry: false });
      return '<div class="ic-grid ic-grid--cards">' + items.map(function (item) { var integrityBadge = deps.featureEnabled("ic_integrity_monitor_enabled") ? UI.badge(item.integrity_status || item.status_integridade || legendaJogos("legenda_ic_jogos_dados_insuficientes"), item.integrity_status || item.status_integridade) : ""; return '<article class="ic-card ic-game-card"><div><h3>' + Core.escapeHtml(item.name || item.nome || legendaJogos("legenda_ic_jogos_jogo")) + '</h3><p>' + Core.escapeHtml(item.provider || item.provedor || legendaJogos("legenda_ic_jogos_provedor_nao_identificado")) + legendaJogos("legenda_ic_jogos_versao_2") + Core.escapeHtml(item.version || item.versao || legendaJogos("legenda_ic_jogos_nao_identificada")) + '</p></div>' + integrityBadge + '<div class="ic-game-card__stats">' + UI.metric(legendaJogos("legenda_ic_jogos_rodadas"), Core.safeText(item.rounds || item.rodadas || 0)) + UI.metric(legendaJogos("legenda_ic_jogos_retorno_pago"), item.observed_return !== undefined || item.retorno_observado !== undefined ? Core.formatPercent(item.observed_return !== undefined ? item.observed_return : item.retorno_observado, 2) : "—") + UI.metric(legendaJogos("legenda_ic_jogos_frequencia_de_retorno"), item.hit_rate !== undefined ? Core.formatPercent(item.hit_rate, 1) : "—") + UI.metric(legendaJogos("legenda_ic_jogos_qualidade"), Core.safeText(item.quality || item.qualidade || "insuficiente")) + '</div><div class="ic-card__footer">' + UI.button(legendaJogos("legenda_ic_jogos_passaporte_matematico"), { action: "passport", value: item.id || item.id_jogo, icon: "chart" }) + '</div></article>'; }).join("") + ('</div><div class="ic-disclaimer">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_a_lista_nunca_e_ordenada_por_melhor_jogo_retorno_observado_nao_indica_quando_um_jogo_pagara")) + '</div>');
    }

    function render() {
      var html = UI.sectionHeader(legendaJogos("legenda_ic_jogos_jogos"), deps.featureEnabled("ic_integrity_monitor_enabled") ? legendaJogos("legenda_ic_jogos_compare_cobertura_volatilidade_e_integridade_nao_promessa_de_resultado") : legendaJogos("legenda_ic_jogos_compare_cobertura_e_volatilidade_nao_promessa_de_resultado")) + '<div class="ic-page-stack">' + filters();
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += games();
      return html + '</div>';
    }

    function renderInto() { if (!disposed) deps.container.innerHTML = render(); }
    function analyticalEvidence(item) {
      var principal = item.primary_subledger || {}, sample = item.sample || principal.sample || {}, period = item.period || principal.period || {}, evidence = item.evidence || {};
      var privacy = item.privacy || principal.privacy || {}, users = sample.users !== undefined ? sample.users : privacy.community_users;
      var sessions = sample.sessions !== undefined ? sample.sessions : privacy.community_sessions;
      var source = item.source_scope === "personal" ? legendaJogos("legenda_ic_jogos_seu_historico") : item.source_scope === "community" ? legendaJogos("legenda_ic_jogos_comunidade_elegivel") : item.inputs ? legendaJogos("legenda_ic_jogos_seu_historico_simulacao_empirica") : legendaJogos("legenda_ic_jogos_fonte_nao_informada");
      return '<div class="ic-list">' + UI.listRow(legendaJogos("legenda_ic_jogos_fonte"), source, "") + UI.listRow(legendaJogos("legenda_ic_jogos_amostra"), Core.safeText(sample.paid_rounds) + legendaJogos("legenda_ic_jogos_rodadas_pagas") + Core.safeText(sessions) + legendaJogos("legenda_ic_jogos_sessoes") + Core.safeText(users) + legendaJogos("legenda_ic_jogos_usuarios"), "") + UI.listRow(legendaJogos("legenda_ic_jogos_periodo"), Core.formatDateTime(period.start || sample.period_start) + legendaJogos("legenda_ic_jogos_ate") + Core.formatDateTime(period.end || sample.period_end), "") + UI.listRow(legendaJogos("legenda_ic_jogos_metodo"), typeof evidence.method === "string" ? evidence.method : Core.safeText(item.version), "") + UI.listRow(legendaJogos("legenda_ic_jogos_atualizacao"), Core.formatDateTime(item.updated_at || principal.updated_at), "") + '</div>';
    }
    function passportMetrics(item) {
      return '<div class="ic-grid ic-grid--metrics">' + UI.metric(legendaJogos("legenda_ic_jogos_rtp_declarado"), Core.formatPercent(item.declared_rtp, 2)) + UI.metric(legendaJogos("legenda_ic_jogos_retorno_observado_rodadas_pagas"), Core.formatPercent(item.observed_return, 2)) + UI.metric(legendaJogos("legenda_ic_jogos_retorno_bruto_de_free_spins"), Core.formatMoney(item.bonus_return_units, item.currency, item.decimal_places), legendaJogos("legenda_ic_jogos_valor_monetario_separado_do_retorno_das_rodadas_pagas")) + UI.metric(legendaJogos("legenda_ic_jogos_volatilidade_observada"), volatilityText(item.volatility)) + UI.metric(legendaJogos("legenda_ic_jogos_rodadas"), Core.safeText(item.rounds)) + UI.metric(legendaJogos("legenda_ic_jogos_versao"), Core.safeText(item.game_version || item.version, legendaJogos("legenda_ic_jogos_nao_identificada"))) + '</div>';
    }
    function passportScope(item) {
      var scope = item.primary_subledger || item;
      var declared = item.declared_rtp_scope === "paid_only" ? legendaJogos("legenda_ic_jogos_somente_rodadas_pagas") : item.declared_rtp_scope === "total_including_bonus" ? legendaJogos("legenda_ic_jogos_total_incluindo_bonus") : legendaJogos("legenda_ic_jogos_nao_identificado");
      var comparable = item.rtp_comparability_status === "comparable_paid_only";
      return '<div class="ic-list">' + UI.listRow(legendaJogos("legenda_ic_jogos_recorte"), legendaJogos("legenda_ic_jogos_bet_2") + Core.safeText(scope.bet_id) + " · " + Core.safeText(scope.mode), Core.safeText(item.currency) + " · " + Core.safeText(item.decimal_places) + legendaJogos("legenda_ic_jogos_casas_decimais")) + UI.listRow(legendaJogos("legenda_ic_jogos_escopo_do_rtp_declarado"), declared, "") + '</div>' + UI.banner(comparable ? legendaJogos("legenda_ic_jogos_componentes_comparaveis") : legendaJogos("legenda_ic_jogos_comparacao_nao_liberada"), comparable ? legendaJogos("legenda_ic_jogos_a_referencia_declarada_corresponde_ao_componente_pago_observado_isso_nao_certifica_o_jogo_nem_p") : legendaJogos("legenda_ic_jogos_o_escopo_declarado_ou_o_vinculo_do_ciclo_de_bonus_nao_permite_comparar_os_componentes_com_segur"), "neutral");
    }
    function volatilityText(value) {
      if (value && typeof value === "object") {
        if (value.metric !== "gross_multiplier_stddev" || typeof value.stddev !== "number" || !Number.isFinite(value.stddev) || value.stddev < 0) return legendaJogos("legenda_ic_jogos_nao_calculada");
        return value.stddev.toLocaleString("pt-BR", { maximumFractionDigits: 3 }) + legendaJogos("legenda_ic_jogos_desvio_padrao");
      }
      return Core.safeText(value, legendaJogos("legenda_ic_jogos_nao_calculada"));
    }
    async function handleAction(action, value) {
      if (disposed) return;
      if (action === "retry") return load(true);
      if (action === "passport") {
        var revision = ++passportRevision;
        UI.openSheet({ eyebrow: legendaJogos("legenda_ic_jogos_passaporte_matematico"), title: legendaJogos("legenda_ic_jogos_carregando_dados_do_jogo"), html: UI.state({ type: "loading", retry: false }) });
        try {
          var result = await deps.api.rpc("ic_passaporte_jogo_rpc", { p_id_jogo: value }, { key: "games:passport" });
          if (disposed || revision !== passportRevision) return;
          var item = result.data || {};
          state.passport = { game: String(value), data: item };
          var integrityMessages = Core.normalizeArray(item.integrity_messages).filter(function (entry) { return entry && typeof entry.message === "string"; }).slice(0, 12);
          var integrity = deps.featureEnabled("ic_integrity_monitor_enabled") ? (integrityMessages.length ? integrityMessages.map(function (entry) { return UI.banner(legendaJogos("legenda_ic_jogos_integridade") + Core.safeText(entry.status), entry.message, entry.status); }).join("") : UI.banner(item.integrity_label || legendaJogos("legenda_ic_jogos_integridade_2"), item.integrity_message || legendaJogos("legenda_ic_jogos_nao_ha_justificativa_detalhada_disponivel_para_este_recorte"), item.integrity_status)) : "";
          var html = integrity + passportMetrics(item) + passportScope(item) + analyticalEvidence(item);
          var principalId = item.primary_subledger && item.primary_subledger.passport_id;
          var others = Core.normalizeArray(item.monetary_subledgers).filter(function (ledger) { return principalId === undefined || String(ledger.passport_id) !== String(principalId); });
          if (others.length) html += '<div class="ic-list">' + others.map(function (ledger) { return '<details class="ic-card"><summary>' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_bet_2") + Core.safeText(ledger.bet_id) + legendaJogos("legenda_ic_jogos_versao_2") + Core.safeText(ledger.game_version) + " · " + Core.safeText(ledger.currency) + " · " + Core.safeText(ledger.mode)) + '</summary>' + passportMetrics(ledger) + passportScope(ledger) + analyticalEvidence(ledger) + '</details>'; }).join("") + '</div>';
          html += ('<div class="ic-disclaimer">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_o_turbo_tiger_nao_assume_rtp_padrao_retorno_apenas_das_rodadas_pagas_nao_e_diretamente_comparav")) + '</div>');
          if (deps.featureEnabled("ic_session_risk_enabled")) html += UI.button(legendaJogos("legenda_ic_jogos_simular_exposicao_da_sessao"), { action: "simulate", value: value, icon: "shield" });
          UI.openSheet({ eyebrow: legendaJogos("legenda_ic_jogos_passaporte_matematico"), title: item.name || item.nome || legendaJogos("legenda_ic_jogos_jogo"), html: html });
        } catch (error) { if (!disposed && revision === passportRevision) UI.openSheet({ eyebrow: legendaJogos("legenda_ic_jogos_passaporte_matematico"), title: legendaJogos("legenda_ic_jogos_dados_indisponiveis"), html: UI.state({ type: error.code === "offline" ? "offline" : "error", message: error.message }) }); }
      }
      if (action === "simulate" && deps.featureEnabled("ic_session_risk_enabled")) {
        state.simulationGame = value;
        state.simulationBet = state.passport && state.passport.game === String(value) && state.passport.data.primary_subledger ? state.passport.data.primary_subledger.bet_id : null;
        UI.openSheet({ eyebrow: legendaJogos("legenda_ic_jogos_antes_da_decisao"), title: legendaJogos("legenda_ic_jogos_simular_risco_da_sessao"), html: UI.banner(legendaJogos("legenda_ic_jogos_estimativa_condicionada"), legendaJogos("legenda_ic_jogos_a_simulacao_usa_uma_distribuicao_historica_elegivel_nao_preve_rodadas_nao_garante_perdas_maxima"), "attention") + ('<form class="ic-form" id="icRiskForm"><div class="ic-field"><label for="ic-risk-currency">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_moeda")) + '</label><select id="ic-risk-currency" name="currency" required>') + Core.currencyOptions(currencyContext(), state.filters.currency || "") + ('</select></div><div class="ic-field"><label for="ic-risk-stake">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_valor_por_rodada")) + '</label><input id="ic-risk-stake" name="stake" inputmode="decimal" required></div><div class="ic-field"><label for="ic-risk-limit">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_limite_maximo_de_perda")) + '</label><input id="ic-risk-limit" name="loss_limit" inputmode="decimal" required></div><div class="ic-field"><label for="ic-risk-rounds">' + Core.escapeHtml(legendaJogos("legenda_ic_jogos_quantidade_prevista_de_rodadas")) + '</label><input id="ic-risk-rounds" name="rounds" type="number" min="1" max="500" step="1" required></div>') + UI.button(legendaJogos("legenda_ic_jogos_calcular_estimativa"), { type: "submit", kind: "primary" }) + '</form>' });
      }
    }
    async function simulate(form) {
      if (disposed || state.simulating || !state.simulationGame) return;
      var values = new FormData(form), definition = Core.currencyCatalog(currencyContext()).find(function (item) { return item.code === values.get("currency"); });
      if (!definition) { UI.toast(legendaJogos("legenda_ic_jogos_selecione_uma_moeda_validada")); return; }
      var params = { game_id: state.simulationGame, currency: definition.code, decimal_places: definition.decimal_places, stake_units: Core.parseMoneyToUnitsText(values.get("stake"), definition.decimal_places), loss_limit_units: Core.parseMoneyToUnitsText(values.get("loss_limit"), definition.decimal_places), rounds: Number(values.get("rounds")) };
      if (state.simulationBet !== null && state.simulationBet !== undefined) params.bet_id = state.simulationBet;
      if (Core.unitsSign(params.stake_units) <= 0 || Core.unitsSign(params.loss_limit_units) <= 0 || !Number.isInteger(params.rounds) || params.rounds < 1 || params.rounds > 500) { UI.toast(legendaJogos("legenda_ic_jogos_revise_aposta_limite_e_quantidade_de_rodadas")); return; }
      state.simulating = true;
      try {
        var fingerprint = JSON.stringify(params);
        if (!state.simulationRequest || state.simulationRequest.fingerprint !== fingerprint) state.simulationRequest = { fingerprint: fingerprint, seed: root.crypto.randomUUID() };
        params.seed = state.simulationRequest.seed;
        var response = await deps.api.rpc("ic_simular_sessao_rpc", { p_parametros: params }, { key: "games:simulation" }), data = response.data || {};
        if (disposed) return;
        var metrics = data.metrics || data;
        var uncertainty = metrics.simulation_uncertainty || {}, chance = metrics.chance_hit_limit;
        var available = data.status === "disponivel" && typeof chance === "number" && Number.isFinite(chance) && chance >= 0 && chance <= 1 && uncertainty.method === "wilson_95" && typeof uncertainty.lower === "number" && typeof uncertainty.upper === "number" && uncertainty.lower >= 0 && uncertainty.lower <= chance && chance <= uncertainty.upper && uncertainty.upper <= 1 && Number.isSafeInteger(uncertainty.simulations) && uncertainty.simulations > 0 && Number.isSafeInteger(metrics.hit_count) && metrics.hit_count >= 0 && metrics.hit_count <= uncertainty.simulations && Math.abs(metrics.hit_count / uncertainty.simulations - chance) <= 1e-8;
        var content = available ? '<div class="ic-grid ic-grid--metrics">' + UI.metric(legendaJogos("legenda_ic_jogos_atingir_o_limite"), Core.formatPercent(metrics.chance_hit_limit * 100, 1)) + [[legendaJogos("legenda_ic_jogos_perda_mediana"), "median_loss_units"], [legendaJogos("legenda_ic_jogos_var_95"), "var95_units"], [legendaJogos("legenda_ic_jogos_media_dos_piores_5"), "cvar95_units"], [legendaJogos("legenda_ic_jogos_drawdown_percentil_95"), "drawdown_p95_units"], [legendaJogos("legenda_ic_jogos_perda_media_simulada"), "expected_loss_units"]].map(function (metric) { return UI.metric(metric[0], Core.formatMoney(metrics[metric[1]], params.currency, params.decimal_places)); }).join("") + '</div>' : UI.state({ type: "insufficient_quality", title: legendaJogos("legenda_ic_jogos_estimativa_indisponivel"), message: data.message || legendaJogos("legenda_ic_jogos_a_versao_a_captura_ou_a_amostra_ainda_nao_atendem_aos_criterios_do_modelo"), retry: false });
        if (available) content += UI.listRow(legendaJogos("legenda_ic_jogos_incerteza_numerica_da_simulacao_wilson_95"), Core.formatPercent(uncertainty.lower * 100, 2) + legendaJogos("legenda_ic_jogos_a") + Core.formatPercent(uncertainty.upper * 100, 2), Core.safeText(metrics.hit_count) + legendaJogos("legenda_ic_jogos_cenarios_atingiram_o_limite_em") + Core.safeText(uncertainty.simulations) + legendaJogos("legenda_ic_jogos_simulacoes"));
        content += analyticalEvidence(data) + UI.listRow(legendaJogos("legenda_ic_jogos_recorte_da_simulacao"), legendaJogos("legenda_ic_jogos_bet_2") + Core.safeText(data.inputs && data.inputs.bet_id) + legendaJogos("legenda_ic_jogos_versao_2") + Core.safeText(data.sample && data.sample.game_version_id), "") + UI.banner(legendaJogos("legenda_ic_jogos_incerteza_do_modelo"), legendaJogos("legenda_ic_jogos_a_simulacao_usa_apenas_os_multiplicadores_observados_premios_raros_ainda_nao_capturados_permane"), "neutral") + UI.banner(legendaJogos("legenda_ic_jogos_limite_aplicado_apos_cada_rodada"), legendaJogos("legenda_ic_jogos_a_rodada_que_cruza_o_limite_pode_ultrapassa_lo_o_resultado_depende_das_condicoes_e_da_amostra_n"), "neutral");
        UI.openSheet({ eyebrow: legendaJogos("legenda_ic_jogos_simulacao_reprodutivel"), title: legendaJogos("legenda_ic_jogos_distribuicao_estimada_da_sessao"), html: content });
      } catch (error) { if (!disposed) UI.toast(error.message || legendaJogos("legenda_ic_jogos_nao_foi_possivel_concluir_a_simulacao")); }
      finally { state.simulating = false; }
    }
    function handleSubmit(form) { if (disposed) return; if (form.id === "icRiskForm") return simulate(form); if (form.id !== "icGameFilters") return; var values = new FormData(form); state.query = String(values.get("query") || "").trim(); state.quality = String(values.get("quality") || ""); state.order = String(values.get("order") || "alphabetical"); state.filters = {}; ["bet", "provider", "version", "platform", "currency", "minimum_rounds"].forEach(function (key) { var value = String(values.get(key) || "").trim(); if (value) state.filters[key] = value; }); state.status = "idle"; load(true); }
    function dispose() { disposed = true; passportRevision += 1; state.data = null; state.passport = null; state.simulationGame = null; state.simulationBet = null; state.simulationRequest = null; }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, dispose: dispose };
  };
}(window));
