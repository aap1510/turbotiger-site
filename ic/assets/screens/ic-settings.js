(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasConfiguracoes = {
    "legenda_ic_configuracoes_meus_alertas_estatisticos": "Meus alertas estatísticos",
    "legenda_ic_configuracoes_resultados_jogos_bets_e_antecedencias": "Resultados, jogos, Bets e antecedências",
    "legenda_ic_configuracoes_relogio": "Relógio",
    "legenda_ic_configuracoes_exibicao_texto_movimento_e_acessibilidade": "Exibição, texto, movimento e acessibilidade",
    "legenda_ic_configuracoes_banca": "Banca",
    "legenda_ic_configuracoes_moeda_teto_percentual_e_contas": "Moeda, teto percentual e contas",
    "legenda_ic_configuracoes_dados": "Dados",
    "legenda_ic_configuracoes_qualidade_sincronizacao_exportacao_e_privacidade": "Qualidade, sincronização, exportação e privacidade",
    "legenda_ic_configuracoes_comunidade": "Comunidade",
    "legenda_ic_configuracoes_transparencia_contribuicao_e_consentimentos": "Transparência, contribuição e consentimentos",
    "legenda_ic_configuracoes_inteligencia_artificial": "Inteligência artificial",
    "legenda_ic_configuracoes_explicacoes_historico_e_fallback": "Explicações, histórico e fallback",
    "legenda_ic_configuracoes_seguranca_e_emergencia": "Segurança e emergência",
    "legenda_ic_configuracoes_pessoa_de_confianca_pausas_e_dominios": "Pessoa de confiança, pausas e domínios",
    "legenda_ic_configuracoes_mostrar_nome_e_motivo_do_estado_alem_da_cor": "Mostrar nome e motivo do estado além da cor",
    "legenda_ic_configuracoes_reduzir_animacoes": "Reduzir animações",
    "legenda_ic_configuracoes_mostrar_metricas_avancadas_no_painel_expandido": "Mostrar métricas avançadas no painel expandido",
    "legenda_ic_configuracoes_os_limiares_de_seguranca_sao_administrados_por_politica_e_nao_podem_ser_ampliados_durante_uma_s": "Os limiares de segurança são administrados por política e não podem ser ampliados durante uma sessão.",
    "legenda_ic_configuracoes_moeda_principal": "Moeda principal",
    "legenda_ic_configuracoes_selecione_a_moeda": "Selecione a moeda",
    "legenda_ic_configuracoes_teto_percentual_por_rodada": "Teto percentual por rodada",
    "legenda_ic_configuracoes_ex_0_50": "Ex.: 0,50%",
    "legenda_ic_configuracoes_saldo_reconciliado": "Saldo reconciliado",
    "legenda_ic_configuracoes_a_banca_protegida_so_usa_saldos_com_origem_e_qualidade_conhecidas": "A banca protegida só usa saldos com origem e qualidade conhecidas.",
    "legenda_ic_configuracoes_uso_agregado": "Uso agregado",
    "legenda_ic_configuracoes_sua_participacao_nunca_expoe_linhas_individuais_recortes_pequenos_permanecem_suprimidos": "Sua participação nunca expõe linhas individuais. Recortes pequenos permanecem suprimidos.",
    "legenda_ic_configuracoes_permitir_contribuicao_pseudonimizada_para_analises_comunitarias_elegiveis": "Permitir contribuição pseudonimizada para análises comunitárias elegíveis",
    "legenda_ic_configuracoes_retirar_o_consentimento_afeta_usos_futuros_conforme_a_politica_sem_reescrever_auditoria_legitim": "Retirar o consentimento afeta usos futuros conforme a política, sem reescrever auditoria legítima.",
    "legenda_ic_configuracoes_permitir_explicacoes_do_tiger_coach": "Permitir explicações do Tiger Coach",
    "legenda_ic_configuracoes_permitir_contexto_agregado_ja_validado_pelo_motor_deterministico": "Permitir contexto agregado já validado pelo motor determinístico",
    "legenda_ic_configuracoes_desativar_a_ia_nao_desativa_relogio_regras_alertas_ou_calculos": "Desativar a IA não desativa relógio, regras, alertas ou cálculos.",
    "legenda_ic_configuracoes_abrir_pausas": "Abrir pausas",
    "legenda_ic_configuracoes_protecao_ativa": "Proteção ativa",
    "legenda_ic_configuracoes_pausas_e_dominios_reconhecidos_permanecem_disponiveis_na_area_de_seguranca": "Pausas e domínios reconhecidos permanecem disponíveis na área de segurança.",
    "legenda_ic_configuracoes_pessoa_de_confianca": "Pessoa de confiança",
    "legenda_ic_configuracoes_contato_somente_com_consentimento_explicito": "Contato somente com consentimento explícito",
    "legenda_ic_configuracoes_nao_configurada": "Não configurada",
    "legenda_ic_configuracoes_dominios_reconhecidos": "Domínios reconhecidos",
    "legenda_ic_configuracoes_protecao_contra_clones_e_redirecionamentos": "Proteção contra clones e redirecionamentos",
    "legenda_ic_configuracoes_verificando": "Verificando",
    "legenda_ic_configuracoes_autoexclusao_e_apoio": "Autoexclusão e apoio",
    "legenda_ic_configuracoes_acesso_a_recursos_oficiais_quando_necessario": "Acesso a recursos oficiais quando necessário",
    "legenda_ic_configuracoes_disponivel": "Disponível",
    "legenda_ic_configuracoes_resumo_agregado": "Resumo agregado",
    "legenda_ic_configuracoes_solicitacao_de_correcao": "Solicitação de correção",
    "legenda_ic_configuracoes_pronto": "Pronto",
    "legenda_ic_configuracoes_recebida_para_revisao": "Recebida para revisão",
    "legenda_ic_configuracoes_consultar": "Consultar",
    "legenda_ic_configuracoes_qualidade_da_captura": "Qualidade da captura",
    "legenda_ic_configuracoes_nenhuma_informacao_de_qualidade_foi_recebida": "Nenhuma informação de qualidade foi recebida.",
    "legenda_ic_configuracoes_ultima_captura": "Última captura",
    "legenda_ic_configuracoes_ultimo_evento_aceito_pelo_pipeline": "Último evento aceito pelo pipeline",
    "legenda_ic_configuracoes_ultima_sincronizacao": "Última sincronização",
    "legenda_ic_configuracoes_reconciliacao_concluida": "Reconciliação concluída",
    "legenda_ic_configuracoes_lacunas": "Lacunas",
    "legenda_ic_configuracoes_intervalos_conhecidos_sem_cobertura_completa": "Intervalos conhecidos sem cobertura completa",
    "legenda_ic_configuracoes_preparar_resumo_para_exportacao": "Preparar resumo para exportação",
    "legenda_ic_configuracoes_informar_correcao": "Informar correção",
    "legenda_ic_configuracoes_o_resumo_inclui_a_visao_geral_as_regras_e_as_preferencias_atuais_nao_contem_a_lista_completa_de": "O resumo inclui a visão geral, as regras e as preferências atuais. Não contém a lista completa de rodadas.",
    "legenda_ic_configuracoes_ultimas_solicitacoes": "Últimas solicitações",
    "legenda_ic_configuracoes_nao_foi_possivel_consultar_as_solicitacoes": "Não foi possível consultar as solicitações.",
    "legenda_ic_configuracoes_resumo_agregado_gerado_em": "Resumo agregado gerado em ",
    "legenda_ic_configuracoes_conteudo_do_resumo": "Conteúdo do resumo",
    "legenda_ic_configuracoes_copiar_resumo": "Copiar resumo",
    "legenda_ic_configuracoes_solicitacao_recebida_para_revisao": "Solicitação recebida para revisão",
    "legenda_ic_configuracoes_seu_resumo": "Seu resumo",
    "legenda_ic_configuracoes_correcao_informada": "Correção informada",
    "legenda_ic_configuracoes_nao_foi_possivel_consultar_esta_solicitacao": "Não foi possível consultar esta solicitação.",
    "legenda_ic_configuracoes_nao_foi_possivel_identificar_a_solicitacao_neste_dispositivo": "Não foi possível identificar a solicitação neste dispositivo.",
    "legenda_ic_configuracoes_nao_foi_possivel_registrar_a_solicitacao": "Não foi possível registrar a solicitação.",
    "legenda_ic_configuracoes_som_e_entrega_de_sessoes_planejadas": "Som e entrega de sessões planejadas",
    "legenda_ic_configuracoes_canal_do_lembrete": "Canal do lembrete",
    "legenda_ic_configuracoes_local": "Local",
    "legenda_ic_configuracoes_remoto": "Remoto",
    "legenda_ic_configuracoes_hibrido": "Híbrido",
    "legenda_ic_configuracoes_som": "Som",
    "legenda_ic_configuracoes_vibracao": "Vibração",
    "legenda_ic_configuracoes_salvar_esta_secao": "Salvar esta seção",
    "legenda_ic_configuracoes_configuracoes": "Configurações",
    "legenda_ic_configuracoes_preferencias_de_entrega_acessibilidade_dados_e_protecao": "Preferências de entrega, acessibilidade, dados e proteção.",
    "legenda_ic_configuracoes_informar_uma_correcao": "Informar uma correção",
    "legenda_ic_configuracoes_o_que_precisa_ser_revisado": "O que precisa ser revisado?",
    "legenda_ic_configuracoes_indique_a_data_a_bet_e_o_registro_envolvido_nao_informe_senhas_ou_codigos_de_acesso": "Indique a data, a Bet e o registro envolvido. Não informe senhas ou códigos de acesso.",
    "legenda_ic_configuracoes_a_solicitacao_fica_registrada_para_revisao_nenhuma_rodada_ou_movimentacao_sera_alterada_automat": "A solicitação fica registrada para revisão. Nenhuma rodada ou movimentação será alterada automaticamente.",
    "legenda_ic_configuracoes_registrar_solicitacao": "Registrar solicitação",
    "legenda_ic_configuracoes_resumo_copiado": "Resumo copiado.",
    "legenda_ic_configuracoes_selecione_o_conteudo_e_use_copiar_no_seu_dispositivo": "Selecione o conteúdo e use Copiar no seu dispositivo.",
    "legenda_ic_configuracoes_descreva_a_correcao_em_10_a_2_000_caracteres": "Descreva a correção em 10 a 2.000 caracteres.",
    "legenda_ic_configuracoes_escolha_uma_moeda_do_catalogo_validado": "Escolha uma moeda do catálogo validado.",
    "legenda_ic_configuracoes_configuracoes_salvas": "Configurações salvas.",
    "legenda_ic_configuracoes_nao_foi_possivel_salvar_as_configuracoes": "Não foi possível salvar as configurações."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasConfiguracoes);
  function legendaConfiguracoes(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasConfiguracoes[chave]; }

  IC.Screens.configuracoes = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var alerts = IC.AlertPreferences(deps);
    var state = { status: "idle", data: null, error: null, open: "notifications", pendingSubscription: null, requests: [], dataRequest: null, requesting: false, exportText: null };
    function groups() { return [
      ["notifications", legendaConfiguracoes("legenda_ic_configuracoes_meus_alertas_estatisticos"), legendaConfiguracoes("legenda_ic_configuracoes_resultados_jogos_bets_e_antecedencias")],
      ["clock", legendaConfiguracoes("legenda_ic_configuracoes_relogio"), legendaConfiguracoes("legenda_ic_configuracoes_exibicao_texto_movimento_e_acessibilidade")],
      ["bankroll", legendaConfiguracoes("legenda_ic_configuracoes_banca"), legendaConfiguracoes("legenda_ic_configuracoes_moeda_teto_percentual_e_contas")],
      ["data", legendaConfiguracoes("legenda_ic_configuracoes_dados"), legendaConfiguracoes("legenda_ic_configuracoes_qualidade_sincronizacao_exportacao_e_privacidade")],
      ["community", legendaConfiguracoes("legenda_ic_configuracoes_comunidade"), legendaConfiguracoes("legenda_ic_configuracoes_transparencia_contribuicao_e_consentimentos")],
      ["ai", legendaConfiguracoes("legenda_ic_configuracoes_inteligencia_artificial"), legendaConfiguracoes("legenda_ic_configuracoes_explicacoes_historico_e_fallback")],
      ["security", legendaConfiguracoes("legenda_ic_configuracoes_seguranca_e_emergencia"), legendaConfiguracoes("legenda_ic_configuracoes_pessoa_de_confianca_pausas_e_dominios")]
    ]; }

    function currencyContext() {
      var bootstrap = deps.store.getState().bootstrap;
      return bootstrap && bootstrap.data || {};
    }

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try { var result = await deps.api.rpc("ic_configuracoes_contexto_rpc", {}, { key: "settings:context" }); state.status = "ready"; state.data = result.data || {}; state.error = null; }
      catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
      if (state.status === "ready") await alerts.load(force);
    }

    function groupBody(id) {
      var aliases = { notifications: "notificacoes", clock: "relogio", bankroll: "banca", data: "dados", community: "comunidade", ai: "ia", security: "seguranca" };
      var data = (state.data || {})[id] || (state.data || {})[aliases[id]] || {};
      if (id === "notifications") return notificationsBody(data);
      if (id === "clock") return '<form class="ic-form" id="icSettingsClock"><label class="ic-check"><input type="checkbox" name="show_text"' + (data.show_text !== false ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_mostrar_nome_e_motivo_do_estado_alem_da_cor")) + '</span></label><label class="ic-check"><input type="checkbox" name="reduced_motion"') + (data.reduced_motion ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_reduzir_animacoes")) + '</span></label><label class="ic-check"><input type="checkbox" name="show_advanced"') + (data.show_advanced ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_mostrar_metricas_avancadas_no_painel_expandido")) + '</span></label><p class="ic-required-note">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_os_limiares_de_seguranca_sao_administrados_por_politica_e_nao_podem_ser_ampliados_durante_uma_s")) + '</p>') + saveButton(id) + '</form>';
      if (id === "bankroll") return ('<form class="ic-form" id="icSettingsBankroll"><div class="ic-field"><label for="ic-bankroll-currency">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_moeda_principal")) + '</label><select id="ic-bankroll-currency" name="currency">') + Core.currencyOptions(currencyContext(), data.currency || "", legendaConfiguracoes("legenda_ic_configuracoes_selecione_a_moeda")) + ('</select></div><div class="ic-field"><label for="ic-bankroll-cap">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_teto_percentual_por_rodada")) + '</label><input id="ic-bankroll-cap" name="stake_percent_cap" inputmode="decimal" value="') + Core.escapeHtml(data.stake_percent_cap || "") + ("\" placeholder=\"" + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_ex_0_50")) + '"></div>') + UI.banner(legendaConfiguracoes("legenda_ic_configuracoes_saldo_reconciliado"), Core.safeText(data.reconciliation_message, legendaConfiguracoes("legenda_ic_configuracoes_a_banca_protegida_so_usa_saldos_com_origem_e_qualidade_conhecidas")), data.reconciliation_status || "neutral") + saveButton(id) + '</form>';
      if (id === "data") return dataBody(data);
      if (id === "community") return UI.banner(legendaConfiguracoes("legenda_ic_configuracoes_uso_agregado"), legendaConfiguracoes("legenda_ic_configuracoes_sua_participacao_nunca_expoe_linhas_individuais_recortes_pequenos_permanecem_suprimidos"), "control") + '<form class="ic-form" id="icSettingsCommunity"><label class="ic-check"><input type="checkbox" name="contribute"' + (data.contribute ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_permitir_contribuicao_pseudonimizada_para_analises_comunitarias_elegiveis")) + '</span></label><p class="ic-required-note">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_retirar_o_consentimento_afeta_usos_futuros_conforme_a_politica_sem_reescrever_auditoria_legitim")) + '</p>') + saveButton(id) + '</form>';
      if (id === "ai") return '<form class="ic-form" id="icSettingsAi"><label class="ic-check"><input type="checkbox" name="enabled"' + (data.enabled !== false ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_permitir_explicacoes_do_tiger_coach")) + '</span></label><label class="ic-check"><input type="checkbox" name="aggregated_context"') + (data.aggregated_context ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_permitir_contexto_agregado_ja_validado_pelo_motor_deterministico")) + '</span></label><p class="ic-required-note">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_desativar_a_ia_nao_desativa_relogio_regras_alertas_ou_calculos")) + '</p>') + saveButton(id) + '</form>';
      var emergencyAction = deps.featureEnabled("ic_emergency_enabled") ? '<div class="ic-card__footer">' + UI.button(legendaConfiguracoes("legenda_ic_configuracoes_abrir_pausas"), { route: "regras-pausas", icon: "shield" }) + '</div>' : "";
      return UI.banner(legendaConfiguracoes("legenda_ic_configuracoes_protecao_ativa"), Core.safeText(data.message, legendaConfiguracoes("legenda_ic_configuracoes_pausas_e_dominios_reconhecidos_permanecem_disponiveis_na_area_de_seguranca")), data.status || "control") + '<div class="ic-list">' + UI.listRow(legendaConfiguracoes("legenda_ic_configuracoes_pessoa_de_confianca"), legendaConfiguracoes("legenda_ic_configuracoes_contato_somente_com_consentimento_explicito"), Core.safeText(data.trusted_contact_status, legendaConfiguracoes("legenda_ic_configuracoes_nao_configurada"))) + UI.listRow(legendaConfiguracoes("legenda_ic_configuracoes_dominios_reconhecidos"), legendaConfiguracoes("legenda_ic_configuracoes_protecao_contra_clones_e_redirecionamentos"), Core.safeText(data.recognized_domains_status, legendaConfiguracoes("legenda_ic_configuracoes_verificando"))) + UI.listRow(legendaConfiguracoes("legenda_ic_configuracoes_autoexclusao_e_apoio"), legendaConfiguracoes("legenda_ic_configuracoes_acesso_a_recursos_oficiais_quando_necessario"), legendaConfiguracoes("legenda_ic_configuracoes_disponivel")) + '</div>' + emergencyAction;
    }

    function dataBody(data) {
      var requests = state.requests.map(function (item) {
        return UI.listRow(item.tipo === "exportacao_resumo" ? legendaConfiguracoes("legenda_ic_configuracoes_resumo_agregado") : legendaConfiguracoes("legenda_ic_configuracoes_solicitacao_de_correcao"), Core.formatDateTime(item.criado_em), item.status === "pronta" ? legendaConfiguracoes("legenda_ic_configuracoes_pronto") : legendaConfiguracoes("legenda_ic_configuracoes_recebida_para_revisao"), UI.button(legendaConfiguracoes("legenda_ic_configuracoes_consultar"), { action: "data-request-detail", value: item.id_solicitacao }));
      }).join("");
      return UI.banner(legendaConfiguracoes("legenda_ic_configuracoes_qualidade_da_captura"), Core.safeText(data.quality_message, legendaConfiguracoes("legenda_ic_configuracoes_nenhuma_informacao_de_qualidade_foi_recebida")), data.quality_status || "capture") + '<div class="ic-list">' + UI.listRow(legendaConfiguracoes("legenda_ic_configuracoes_ultima_captura"), legendaConfiguracoes("legenda_ic_configuracoes_ultimo_evento_aceito_pelo_pipeline"), Core.formatDateTime(data.last_capture_at)) + UI.listRow(legendaConfiguracoes("legenda_ic_configuracoes_ultima_sincronizacao"), legendaConfiguracoes("legenda_ic_configuracoes_reconciliacao_concluida"), Core.formatDateTime(data.last_sync_at)) + UI.listRow(legendaConfiguracoes("legenda_ic_configuracoes_lacunas"), legendaConfiguracoes("legenda_ic_configuracoes_intervalos_conhecidos_sem_cobertura_completa"), Core.safeText(data.gaps || 0)) + '</div><div class="ic-card__footer">' + UI.button(legendaConfiguracoes("legenda_ic_configuracoes_preparar_resumo_para_exportacao"), { action: "request-export", disabled: state.requesting }) + UI.button(legendaConfiguracoes("legenda_ic_configuracoes_informar_correcao"), { action: "request-correction", disabled: state.requesting }) + ('</div><p>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_o_resumo_inclui_a_visao_geral_as_regras_e_as_preferencias_atuais_nao_contem_a_lista_completa_de")) + '</p>') + (requests ? ('<section><h3>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_ultimas_solicitacoes")) + '</h3><div class="ic-list">') + requests + '</div></section>' : '');
    }

    async function loadRequests() {
      try { var result = await deps.api.rpc("ic_dados_solicitacoes_listar_rpc", {}, { key: "settings:data-list" }); state.requests = Core.normalizeArray((result.data || {}).items); renderInto(); }
      catch (error) { UI.toast(error.message || legendaConfiguracoes("legenda_ic_configuracoes_nao_foi_possivel_consultar_as_solicitacoes")); }
    }

    async function showRequest(id) {
      if (!Core.validUuid(id)) return;
      try {
        var result = await deps.api.rpc("ic_dados_solicitacao_consultar_rpc", { p_id_solicitacao: id }, { key: "settings:data-detail" });
        var item = result.data || {};
        state.exportText = item.tipo === "exportacao_resumo" ? JSON.stringify(item.conteudo, null, 2) : null;
        var body = state.exportText ? ('<p>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_resumo_agregado_gerado_em"))) + Core.escapeHtml(Core.formatDateTime(item.criado_em)) + ('.</p><div class="ic-field"><label for="icExportSummary">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_conteudo_do_resumo")) + '</label><textarea id="icExportSummary" readonly rows="12">') + Core.escapeHtml(state.exportText) + '</textarea></div>' + UI.button(legendaConfiguracoes("legenda_ic_configuracoes_copiar_resumo"), { action: "copy-export" }) : UI.banner(legendaConfiguracoes("legenda_ic_configuracoes_solicitacao_recebida_para_revisao"), item.descricao || "", "neutral");
        UI.openSheet({ title: state.exportText ? legendaConfiguracoes("legenda_ic_configuracoes_seu_resumo") : legendaConfiguracoes("legenda_ic_configuracoes_correcao_informada"), html: body });
      } catch (error) { UI.toast(error.message || legendaConfiguracoes("legenda_ic_configuracoes_nao_foi_possivel_consultar_esta_solicitacao")); }
    }

    async function requestData(kind, description) {
      if (state.requesting) return;
      state.requesting = true;
      try {
        if (!state.dataRequest || state.dataRequest.kind !== kind || state.dataRequest.description !== description) {
          if (!root.crypto || typeof root.crypto.randomUUID !== "function") throw new Error(legendaConfiguracoes("legenda_ic_configuracoes_nao_foi_possivel_identificar_a_solicitacao_neste_dispositivo"));
          state.dataRequest = { kind: kind, description: description, key: root.crypto.randomUUID() };
        }
        var result = await deps.api.rpc("ic_dados_solicitar_rpc", { p_tipo: kind, p_chave_idempotencia: state.dataRequest.key, p_descricao: description || null }, { key: "settings:data-request" });
        state.dataRequest = null;
        UI.closeSheet();
        await loadRequests();
        await showRequest((result.data || {}).id_solicitacao);
      } catch (error) { UI.toast(error.message || legendaConfiguracoes("legenda_ic_configuracoes_nao_foi_possivel_registrar_a_solicitacao")); }
      finally { state.requesting = false; renderInto(); }
    }

    function notificationChannel(value) { value = String(value || "hybrid").toLowerCase(); return value === "remoto" ? "remote" : value === "hibrido" ? "hybrid" : ["local", "remote", "hybrid"].indexOf(value) >= 0 ? value : "hybrid"; }
    function channelOption(value, label, current) { return '<option value="' + value + '"' + (current === value ? " selected" : "") + '>' + Core.escapeHtml(label) + '</option>'; }
    function notificationsBody(data) {
      var currentChannel = notificationChannel(data.channel);
      return alerts.render() + ('<details class="ic-settings-delivery"><summary>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_som_e_entrega_de_sessoes_planejadas")) + '</summary><form class="ic-form" id="icSettingsNotifications"><div class="ic-field"><label for="ic-notification-channel">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_canal_do_lembrete")) + '</label><select id="ic-notification-channel" name="channel">') + channelOption("local", legendaConfiguracoes("legenda_ic_configuracoes_local"), currentChannel) + channelOption("remote", legendaConfiguracoes("legenda_ic_configuracoes_remoto"), currentChannel) + channelOption("hybrid", legendaConfiguracoes("legenda_ic_configuracoes_hibrido"), currentChannel) + '</select></div><label class="ic-check"><input type="checkbox" name="sound"' + (data.sound !== false ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_som")) + '</span></label><label class="ic-check"><input type="checkbox" name="vibration"') + (data.vibration !== false ? " checked" : "") + ('><span>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_vibracao")) + '</span></label><input type="hidden" name="quiet_start" value="') + Core.escapeHtml(data.quiet_start || "22:00") + '"><input type="hidden" name="quiet_end" value="' + Core.escapeHtml(data.quiet_end || "08:00") + '"></form></details>';
    }

    function saveButton(id) { return UI.button(legendaConfiguracoes("legenda_ic_configuracoes_salvar_esta_secao"), { type: "submit", kind: "primary", value: id }); }

    function content() {
      var visible = groups().filter(function (group) { return group[0] !== "ai" || deps.featureEnabled("ic_ai_coach_enabled"); });
      return '<div class="ic-settings-list">' + visible.map(function (group) { var isOpen = state.open === group[0]; return '<section class="ic-settings-group"><button type="button" data-screen-action="settings-group" data-action-value="' + group[0] + '" aria-expanded="' + isOpen + '"><span><strong>' + Core.escapeHtml(group[1]) + '</strong><small class="ic-metric__detail">' + Core.escapeHtml(group[2]) + '</small></span>' + UI.icon("chevron") + '</button>' + (isOpen ? '<div class="ic-settings-group__body">' + groupBody(group[0]) + '</div>' : '') + '</section>'; }).join("") + '</div>';
    }

    function render() {
      var html = UI.sectionHeader(legendaConfiguracoes("legenda_ic_configuracoes_configuracoes"), legendaConfiguracoes("legenda_ic_configuracoes_preferencias_de_entrega_acessibilidade_dados_e_protecao")) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }
    function renderInto() { deps.container.innerHTML = render(); alerts.refreshStatus(); }
    async function handleAction(action, value) {
      if (action.indexOf("alerts-") === 0) return alerts.handleAction(action, value);
      if (action === "retry") load(true);
      if (action === "settings-group") { state.open = state.open === value ? null : value; renderInto(); if (state.open === "data") await loadRequests(); }
      if (action === "request-export") return requestData("exportacao_resumo", null);
      if (action === "request-correction") UI.openSheet({ title: legendaConfiguracoes("legenda_ic_configuracoes_informar_uma_correcao"), html: ('<form class="ic-form" id="icDataCorrection"><div class="ic-field"><label for="icCorrectionDescription">' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_o_que_precisa_ser_revisado")) + '</label><textarea id="icCorrectionDescription" name="description" minlength="10" maxlength="2000" required></textarea><small>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_indique_a_data_a_bet_e_o_registro_envolvido_nao_informe_senhas_ou_codigos_de_acesso")) + '</small></div><p>' + Core.escapeHtml(legendaConfiguracoes("legenda_ic_configuracoes_a_solicitacao_fica_registrada_para_revisao_nenhuma_rodada_ou_movimentacao_sera_alterada_automat")) + '</p>') + UI.button(legendaConfiguracoes("legenda_ic_configuracoes_registrar_solicitacao"), { type: "submit", disabled: state.requesting }) + '</form>' });
      if (action === "data-request-detail") return showRequest(value);
      if (action === "copy-export" && state.exportText) {
        try { if (!root.navigator || !root.navigator.clipboard) throw new Error("clipboard_unavailable"); await root.navigator.clipboard.writeText(state.exportText); UI.toast(legendaConfiguracoes("legenda_ic_configuracoes_resumo_copiado")); }
        catch (_error) { var field = document.getElementById("icExportSummary"); if (field) { field.focus(); field.select(); } UI.toast(legendaConfiguracoes("legenda_ic_configuracoes_selecione_o_conteudo_e_use_copiar_no_seu_dispositivo")); }
      }
    }
    async function handleSubmit(form) {
      if (form.id === "icDataCorrection") {
        var description = String(new FormData(form).get("description") || "").trim();
        if (description.length < 10 || description.length > 2000) { UI.toast(legendaConfiguracoes("legenda_ic_configuracoes_descreva_a_correcao_em_10_a_2_000_caracteres")); return; }
        return requestData("correcao", description);
      }
      if (form.id.indexOf("icSettings") !== 0) return;
      var sectionMap = { icSettingsNotifications: "notifications", icSettingsClock: "clock", icSettingsBankroll: "bankroll", icSettingsCommunity: "community", icSettingsAi: "ai" };
      var section = sectionMap[form.id]; if (!section) return;
      var values = new FormData(form), payload = {};
      values.forEach(function (value, key) { payload[key] = value === "on" ? true : value; });
      if (section === "bankroll") {
        var currency = Core.currencyCatalog(currencyContext()).find(function (item) { return item.code === payload.currency; });
        if (!currency) { UI.toast(legendaConfiguracoes("legenda_ic_configuracoes_escolha_uma_moeda_do_catalogo_validado")); return; }
        payload.decimal_places = currency.decimal_places;
      }
      Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"]')).forEach(function (input) { payload[input.name] = input.checked; });
      try { await deps.api.rpc("ic_configuracoes_salvar_rpc", { p_secao: section, p_preferencias: payload }, { key: "settings:save" }); UI.toast(legendaConfiguracoes("legenda_ic_configuracoes_configuracoes_salvas")); state.status = "idle"; await load(true); }
      catch (error) { UI.toast(error.message || legendaConfiguracoes("legenda_ic_configuracoes_nao_foi_possivel_salvar_as_configuracoes")); }
    }
    function handleChange(target) {
      if (target.closest("#icAlertPreferences")) return alerts.handleChange(target);
      var form = target.closest("#icSettingsNotifications");
      if (form) return handleSubmit(form);
    }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, handleChange: handleChange, dispose: alerts.dispose };
  };
}(window));
