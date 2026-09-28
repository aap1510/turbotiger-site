(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasEstatisticas = {
    "legenda_ic_estatisticas_banca": "Banca",
    "legenda_ic_estatisticas_sessoes": "Sessões",
    "legenda_ic_estatisticas_ritmo": "Ritmo",
    "legenda_ic_estatisticas_apos_perdas": "Após perdas",
    "legenda_ic_estatisticas_pico_e_devolucao": "Pico e devolução",
    "legenda_ic_estatisticas_horarios": "Horários",
    "legenda_ic_estatisticas_intervalos": "Intervalos",
    "legenda_ic_estatisticas_bonus": "Bônus",
    "legenda_ic_estatisticas_risco_da_sessao": "Risco da sessão",
    "legenda_ic_estatisticas_laboratorio": "Laboratório",
    "legenda_ic_estatisticas_a_analise_esta_aguardando_atualizacao": "A análise está aguardando atualização.",
    "legenda_ic_estatisticas_uma_associacao_historica_nao_comprova_causa_e_efeito": "Uma associação histórica não comprova causa e efeito.",
    "legenda_ic_estatisticas_nao_preve_a_proxima_rodada": "Não prevê a próxima rodada.",
    "legenda_ic_estatisticas_somente_planos_confirmados_antes_de_jogar_permitem_medir_o_cumprimento_dos_limites": "Somente planos confirmados antes de jogar permitem medir o cumprimento dos limites.",
    "legenda_ic_estatisticas_a_faixa_expressa_a_incerteza_da_estimativa": "A faixa expressa a incerteza da estimativa.",
    "legenda_ic_estatisticas_a_avaliacao_depende_das_condicoes_de_independencia_entre_sessoes": "A avaliação depende das condições de independência entre sessões.",
    "legenda_ic_estatisticas_ha_limitacoes_de_amostra_ou_qualidade_neste_calculo": "Há limitações de amostra ou qualidade neste cálculo.",
    "legenda_ic_estatisticas_contrato_do_modelo_comportamental_indisponivel": "Contrato do modelo comportamental indisponível.",
    "legenda_ic_estatisticas_contrato_da_curva_de_exposicao_indisponivel": "Contrato da curva de exposição indisponível.",
    "legenda_ic_estatisticas_areas_estatisticas": "Áreas estatísticas",
    "legenda_ic_estatisticas_consultar_a_comunidade": "Consultar a Comunidade",
    "legenda_ic_estatisticas_ainda_nao_ha_estatistica_para_este_recorte": "Ainda não há estatística para este recorte",
    "legenda_ic_estatisticas_a_infraestrutura_permanece_ativa_e_passara_a_exibir_resultados_quando_houver_dados_elegiveis": "A infraestrutura permanece ativa e passará a exibir resultados quando houver dados elegíveis.",
    "legenda_ic_estatisticas_faixa": "Faixa",
    "legenda_ic_estatisticas_saldo_historico_nao_confirmado": "Saldo histórico não confirmado",
    "legenda_ic_estatisticas_estes_registros_nao_permitem_calcular_a_banca_inicial_e_final_com_seguranca_consulte_sessoes_pa": "Estes registros não permitem calcular a banca inicial e final com segurança. Consulte Sessões para ver rodadas, duração e resultado registrados.",
    "legenda_ic_estatisticas_historico_parcial": "Histórico parcial",
    "legenda_ic_estatisticas_saldo_nao_confirmado_estes_dados_nao_preveem_proximas_rodadas": "Saldo não confirmado. Estes dados não preveem próximas rodadas.",
    "legenda_ic_estatisticas_associacao_historica_apresentada_com_amostra_e_incerteza": "Associação histórica apresentada com amostra e incerteza.",
    "legenda_ic_estatisticas_associacoes_descrevem_o_historico_e_nao_estabelecem_causalidade_nem_preveem_a_proxima_rodada": "Associações descrevem o histórico e não estabelecem causalidade nem preveem a próxima rodada.",
    "legenda_ic_estatisticas_resultado_liquido": "Resultado líquido",
    "legenda_ic_estatisticas_saldo_inicial": "Saldo inicial",
    "legenda_ic_estatisticas_movimentacoes_liquidas": "Movimentações líquidas",
    "legenda_ic_estatisticas_saldo_final": "Saldo final",
    "legenda_ic_estatisticas_pico_do_resultado": "Pico do resultado",
    "legenda_ic_estatisticas_reducao_apos_o_pico": "Redução após o pico",
    "legenda_ic_estatisticas_maior_drawdown": "Maior drawdown",
    "legenda_ic_estatisticas_bonus_creditado": "Bônus creditado",
    "legenda_ic_estatisticas_resultado_dos_free_spins": "Resultado dos free spins",
    "legenda_ic_estatisticas_aumentos_apos_perda": "Aumentos após perda",
    "legenda_ic_estatisticas_aceleracoes_apos_perda": "Acelerações após perda",
    "legenda_ic_estatisticas_retornos_inferiores_a_aposta": "Retornos inferiores à aposta",
    "legenda_ic_estatisticas_maior_sequencia_de_perdas": "Maior sequência de perdas",
    "legenda_ic_estatisticas_duracao_em_segundos": "Duração em segundos",
    "legenda_ic_estatisticas_rodadas_2": "Rodadas",
    "legenda_ic_estatisticas_indisponivel": "Indisponível",
    "legenda_ic_estatisticas_saldo_nao_confirmado": "Saldo não confirmado",
    "legenda_ic_estatisticas_qualidade_dos_registros": "Qualidade dos registros",
    "legenda_ic_estatisticas_entender_este_resultado": "Entender este resultado",
    "legenda_ic_estatisticas_apos_multiplicadores": "Após multiplicadores",
    "legenda_ic_estatisticas_ainda_nao_ha_eventos_elegiveis_na_projecao_diaria": "Ainda não há eventos elegíveis na projeção diária.",
    "legenda_ic_estatisticas_multiplicador_minimo": "Multiplicador mínimo",
    "legenda_ic_estatisticas_jogo_analisado": "Jogo analisado",
    "legenda_ic_estatisticas_todos_os_jogos": "Todos os jogos",
    "legenda_ic_estatisticas_o_que_aconteceu_depois_dos_multiplicadores": "O que aconteceu depois dos multiplicadores",
    "legenda_ic_estatisticas_distancia_observada_entre_multiplicadores": "Distância observada entre multiplicadores",
    "legenda_ic_estatisticas_atualizacao": "Atualização: ",
    "legenda_ic_estatisticas_analise_pessoal_separada_por_jogo_e_moeda": ". Análise pessoal, separada por jogo e moeda.",
    "legenda_ic_estatisticas_nenhum_evento_neste_recorte": "Nenhum evento neste recorte",
    "legenda_ic_estatisticas_escolha_outro_jogo_ou_limiar_ausencia_de_eventos_nao_indica_quando_havera_um_premio": "Escolha outro jogo ou limiar. Ausência de eventos não indica quando haverá um prêmio.",
    "legenda_ic_estatisticas_pares_completos": "Pares completos",
    "legenda_ic_estatisticas_com_proxima_ocorrencia_observada": "Com próxima ocorrência observada",
    "legenda_ic_estatisticas_eventos_sem_sucessor": "Eventos sem sucessor",
    "legenda_ic_estatisticas_nao_entram_na_media_nao_sao_espera_zero": "Não entram na média; não são espera zero",
    "legenda_ic_estatisticas_media_mediana_de_rodadas": "Média / mediana de rodadas",
    "legenda_ic_estatisticas_somente_pares_completos": "Somente pares completos",
    "legenda_ic_estatisticas_metade_central_dos_intervalos": "Metade central dos intervalos",
    "legenda_ic_estatisticas_percentis_25_a_75": "Percentis 25 a 75",
    "legenda_ic_estatisticas_tempo_medio_registrado": "Tempo médio registrado",
    "legenda_ic_estatisticas_nao_mede_o_tempo_real_de_requisicao": "Não mede o tempo real de requisição",
    "legenda_ic_estatisticas_continuacao_apos_o_evento": "Continuação após o evento",
    "legenda_ic_estatisticas_ocorrencias_nao_sessoes_independentes": "Ocorrências, não sessões independentes",
    "legenda_ic_estatisticas_terminaram_abaixo_do_resultado_pos_evento": "Terminaram abaixo do resultado pós-evento",
    "legenda_ic_estatisticas_no_mesmo_recorte_de_sessao_jogo": "No mesmo recorte de sessão/jogo",
    "legenda_ic_estatisticas_ate": " até ",
    "legenda_ic_estatisticas_qualidade_temporal": "Qualidade temporal: ",
    "legenda_ic_estatisticas_qualidade_financeira": ". Qualidade financeira: ",
    "legenda_ic_estatisticas_nenhuma_hipotese_publicada": "Nenhuma hipótese publicada",
    "legenda_ic_estatisticas_descobertas_so_aparecem_apos_registro_de_metodo_amostra_limitacoes_e_status_de_validacao": "Descobertas só aparecem após registro de método, amostra, limitações e status de validação.",
    "legenda_ic_estatisticas_direcao_observada": "Direção observada: ",
    "legenda_ic_estatisticas_origem_efetiva_da_ultima_atualizacao": " Origem efetiva da última atualização: ",
    "legenda_ic_estatisticas_ver_metodo": "Ver método",
    "legenda_ic_estatisticas_os_alertas_sao_configurados_em_meus_alertas_estatisticos_voce_nao_precisa_escolher_padroes_indi": "Os alertas são configurados em Meus alertas estatísticos; você não precisa escolher padrões individualmente.",
    "legenda_ic_estatisticas_estatisticas": "Estatísticas",
    "legenda_ic_estatisticas_fonte_nao_informada": "Fonte não informada",
    "legenda_ic_estatisticas_origem": "Origem",
    "legenda_ic_estatisticas_amostra": "Amostra",
    "legenda_ic_estatisticas_periodo": "Período",
    "legenda_ic_estatisticas_versao_do_calculo": "Versão do cálculo",
    "legenda_ic_estatisticas_risco_de_romper_o_planejamento": "Risco de romper o planejamento",
    "legenda_ic_estatisticas_o_modelo_comportamental_nao_pode_ser_atualizado_as_outras_estatisticas_nao_substituem_essa_esti": "O modelo comportamental não pôde ser atualizado. As outras estatísticas não substituem essa estimativa.",
    "legenda_ic_estatisticas_ainda_nao_ha_sessoes_planejadas_elegiveis_para_esta_analise_sessoes_observadas_sem_plano_nao_re": "Ainda não há sessões planejadas elegíveis para esta análise. Sessões observadas sem plano não recebem um compromisso inventado.",
    "legenda_ic_estatisticas_comportamento_em_relacao_aos_seus_compromissos_nao_ao_resultado_da_proxima_rodada": "Comportamento em relação aos seus compromissos, não ao resultado da próxima rodada.",
    "legenda_ic_estatisticas_estimativa_comportamental": "Estimativa comportamental",
    "legenda_ic_estatisticas_estimativa_ainda_nao_liberada": "Estimativa ainda não liberada",
    "legenda_ic_estatisticas_amostra_qualidade_e_validacao_fora_da_amostra_precisam_ser_suficientes_ausencia_de_estimativa_n": "Amostra, qualidade e validação fora da amostra precisam ser suficientes. Ausência de estimativa não significa risco zero.",
    "legenda_ic_estatisticas_seu_planejamento": "Seu planejamento",
    "legenda_ic_estatisticas_esta_analise_nao_muda_a_cor_do_relogio_nao_flexibiliza_seus_limites_e_nao_preve_se_o_jogo_pagar": "Esta análise não muda a cor do relógio, não flexibiliza seus limites e não prevê se o jogo pagará.",
    "legenda_ic_estatisticas_jogo": "Jogo ",
    "legenda_ic_estatisticas_consultar_exposicao_historica": "Consultar exposição histórica",
    "legenda_ic_estatisticas_consulta_apenas_nao_altera_sua_banca_aposta_limites_ou_sessao_planejada": "Consulta apenas: não altera sua banca, aposta, limites ou Sessão Planejada.",
    "legenda_ic_estatisticas_jogo_2": "Jogo",
    "legenda_ic_estatisticas_recortes_disponiveis": "Recortes disponíveis",
    "legenda_ic_estatisticas_aposta_sobre_a_banca_inicial": "Aposta sobre a banca inicial (%)",
    "legenda_ic_estatisticas_tolerancia_historica_para_atingir_a_perda_indicada": "Tolerância histórica para atingir a perda indicada (%)",
    "legenda_ic_estatisticas_consultar_sem_alterar_meu_plano": "Consultar sem alterar meu plano",
    "legenda_ic_estatisticas_curva_de_exposicao_indisponivel": "Curva de exposição indisponível",
    "legenda_ic_estatisticas_nao_foi_possivel_atualizar_o_modelo_as_outras_estatisticas_nao_substituem_essa_consulta": "Não foi possível atualizar o modelo. As outras estatísticas não substituem essa consulta.",
    "legenda_ic_estatisticas_curva_de_exposicao_ainda_indisponivel": "Curva de exposição ainda indisponível",
    "legenda_ic_estatisticas_esta_analise_precisa_de_saldo_inicial_e_sessoes_elegiveis_os_outros_resultados_historicos_conti": "Esta análise precisa de saldo inicial e sessões elegíveis. Os outros resultados históricos continuam disponíveis quando houver registros.",
    "legenda_ic_estatisticas_exposicao_indisponivel": "Exposição indisponível",
    "legenda_ic_estatisticas_indisponivel_2": "indisponível",
    "legenda_ic_estatisticas_estimativa_nao_liberada": "Estimativa não liberada",
    "legenda_ic_estatisticas_dentro_da_tolerancia_historica_consultada": "Dentro da tolerância histórica consultada",
    "legenda_ic_estatisticas_acima_da_tolerancia_historica_consultada": "Acima da tolerância histórica consultada",
    "legenda_ic_estatisticas_percentual_fora_do_suporte_observado": "Percentual fora do suporte observado",
    "legenda_ic_estatisticas_adequacao_ainda_indisponivel": "Adequação ainda indisponível",
    "legenda_ic_estatisticas_informe_os_parametros_da_consulta_amostra_qualidade_suporte_e_validacao_futura_precisam_ser_suf": "Informe os parâmetros da consulta. Amostra, qualidade, suporte e validação futura precisam ser suficientes; não há extrapolação.",
    "legenda_ic_estatisticas_evento_analisado_perda_de": "Evento analisado: perda de ",
    "legenda_ic_estatisticas_no_mesmo_recorte_em_ate": "% no mesmo recorte, em até ",
    "legenda_ic_estatisticas_rodadas_pagas_sessoes_interrompidas_antes_desse_horizonte_sao_identificadas_separadamente": " rodadas pagas. Sessões interrompidas antes desse horizonte são identificadas separadamente.",
    "legenda_ic_estatisticas_recorte": "Recorte",
    "legenda_ic_estatisticas_bet": "Bet ",
    "legenda_ic_estatisticas_versao_2": " · versão ",
    "legenda_ic_estatisticas_modelo": "Modelo",
    "legenda_ic_estatisticas_associacao_observacional_nao_causal_o_percentual_de_0_5_e_uma_referencia_em_analise_nunca_um_ot": "Associação observacional, não causal. O percentual de 0,5% é uma referência em análise, nunca um ótimo garantido. Esta consulta não determina a cor do relógio nem recomenda iniciar uma sessão.",
    "legenda_ic_estatisticas_informe_um_percentual_maior_que_zero_e_ate_100_e_uma_tolerancia_entre_0_e_100": "Informe um percentual maior que zero e até 100%, e uma tolerância entre 0% e 100%.",
    "legenda_ic_estatisticas_seu_historico": "seu histórico",
    "legenda_ic_estatisticas_comunidade_elegivel": "comunidade elegível",
    "legenda_ic_estatisticas_seu_historico_e_comunidade_elegivel": "seu histórico e comunidade elegível",
    "legenda_ic_estatisticas_lembrete_de_padrao_historico": "Lembrete de padrão histórico",
    "legenda_ic_estatisticas_ocorrencia_do_padrao_acompanhado": "Ocorrência do padrão acompanhado",
    "legenda_ic_estatisticas_direcao_historica": "Direção histórica: ",
    "legenda_ic_estatisticas_fonte_efetiva": "Fonte efetiva: ",
    "legenda_ic_estatisticas_chegou_uma_nova_janela_correspondente_ao_padrao_historico_que_voce_decidiu_acompanhar": ". Chegou uma nova janela correspondente ao padrão histórico que você decidiu acompanhar.",
    "legenda_ic_estatisticas_escopo": "Escopo",
    "legenda_ic_estatisticas_estatistica_acompanhada": "Estatística acompanhada",
    "legenda_ic_estatisticas_ocorrencia_atual": "Ocorrência atual",
    "legenda_ic_estatisticas_janela_recorrente_identificada": "Janela recorrente identificada",
    "legenda_ic_estatisticas_nao_informado": "Não informado",
    "legenda_ic_estatisticas_versao_da_regra": "Versão da regra",
    "legenda_ic_estatisticas_criterio_usado_para_reconhecer_esta_ocorrencia": "Critério usado para reconhecer esta ocorrência",
    "legenda_ic_estatisticas_este_aviso_nao_cria_nem_inicia_sessao_planejada_e_nao_preve_resultados_futuros_se_a_celula_comu": "Este aviso não cria nem inicia Sessão Planejada e não prevê resultados futuros. Se a célula comunitária não for elegível, ela não é apresentada como origem efetiva.",
    "legenda_ic_estatisticas_entenda_suas_sessoes_e_resultados": "Entenda suas sessões e resultados.",
    "legenda_ic_estatisticas_nenhuma_analise_estatistica_esta_habilitada_pela_politica_atual": "Nenhuma análise estatística está habilitada pela política atual.",
    "legenda_ic_estatisticas_hipotese": "Hipótese",
    "legenda_ic_estatisticas_status": "Status: ",
    "legenda_ic_estatisticas_a_causa_nao_foi_estabelecida_e_o_resultado_nao_preve_rodadas_futuras": "A causa não foi estabelecida e o resultado não prevê rodadas futuras.",
    "legenda_ic_estatisticas_ritmo_valor": "{quantidade} rodadas/min",
    "legenda_ic_estatisticas_rodadas_quantidade": "{quantidade} rodadas",
    "legenda_ic_estatisticas_intervalo_rodadas": "{inicio} a {fim} rodadas",
    "legenda_ic_estatisticas_segundos_quantidade": "{quantidade} s",
    "legenda_ic_estatisticas_horizonte_resultado": "Próximas {rodadas} rodadas: {valor}",
    "legenda_ic_estatisticas_horizontes_quantidade": "{completos} horizontes completos; {incompletos} incompletos",
    "legenda_ic_estatisticas_negativos_quantidade": "{quantidade} negativos",
    "legenda_ic_estatisticas_eventos_resumo": "{eventos} eventos em {sessoes} sessões. Bet {bet}; versão {versao}; plataforma {plataforma}",
    "legenda_ic_estatisticas_periodo_intervalo": "{inicio} até {fim}",
    "legenda_ic_estatisticas_amostra_elegivel": "{sessoes} sessões; {elegiveis} elegíveis; {usuarios} usuários",
    "legenda_ic_estatisticas_amostra_completa": "{completas} sessões completas; {censuradas} censuradas; {usuarios} usuários",
    "legenda_ic_estatisticas_incerteza_intervalo": "Faixa de incerteza: {inferior} a {superior}",
    "legenda_ic_estatisticas_adequacao_detalhe": "Para {exposicao}, limite superior estimado de {superior}; tolerância escolhida: {tolerancia}. Não significa que apostar seja seguro.",
    "legenda_ic_estatisticas_exposicao_percentual": "{percentual} da banca inicial",
    "legenda_ic_estatisticas_observado_sessoes": "Observado: {percentual}; {sessoes} sessões",
    "legenda_ic_estatisticas_estimativa_intervalo": "Estimativa: {estimativa} ({inferior}–{superior})"
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasEstatisticas);
  function legendaEstatisticas(chave, valores) {
    if (root.TurboTigerLegendas) return root.TurboTigerLegendas.texto(chave, valores);
    return fontesLegendasEstatisticas[chave].replace(/\{([a-z][a-z0-9_]*)\}/g, function (original, nome) { return valores && Object.prototype.hasOwnProperty.call(valores, nome) ? String(valores[nome]) : original; });
  }

  IC.Screens.estatisticas = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var areas = [
      { id: "banca", get label() { return legendaEstatisticas("legenda_ic_estatisticas_banca"); }, flag: "ic_bankroll_curve_enabled" },
      { id: "sessoes", get label() { return legendaEstatisticas("legenda_ic_estatisticas_sessoes"); }, flag: "ic_personal_insights_enabled" },
      { id: "ritmo", get label() { return legendaEstatisticas("legenda_ic_estatisticas_ritmo"); }, flag: "ic_personal_insights_enabled" },
      { id: "apos-perdas", get label() { return legendaEstatisticas("legenda_ic_estatisticas_apos_perdas"); }, flag: "ic_personal_insights_enabled" },
      { id: "pico", get label() { return legendaEstatisticas("legenda_ic_estatisticas_pico_e_devolucao"); }, flag: "ic_significant_win_enabled" },
      { id: "horarios", get label() { return legendaEstatisticas("legenda_ic_estatisticas_horarios"); }, flag: "ic_personal_insights_enabled" },
      { id: "intervalos", get label() { return legendaEstatisticas("legenda_ic_estatisticas_intervalos"); }, flag: "ic_interval_lab_enabled" },
      { id: "bonus", get label() { return legendaEstatisticas("legenda_ic_estatisticas_bonus"); }, flag: "ic_personal_insights_enabled" },
      { id: "risco", get label() { return legendaEstatisticas("legenda_ic_estatisticas_risco_da_sessao"); }, flag: "ic_session_risk_enabled" },
      { id: "laboratorio", get label() { return legendaEstatisticas("legenda_ic_estatisticas_laboratorio"); }, flag: "ic_interval_lab_enabled" }
    ];
    var state = { status: "idle", data: null, error: null, area: deps.route().subsection || "sessoes", pendingHypothesis: null, protection: null, protectionError: null, exposure: null, exposureError: null, exposureQuery: { p_id_jogo: null, p_exposicao_pct: null, p_risco_maximo: null } };
    var loadRevision = 0, disposed = false, subnavScrollLeft = 0, subnavRestorePending = false;
    var postThreshold = 50, postGame = "all";

    function availableAreas() { return areas.filter(function (area) { return deps.featureEnabled(area.flag); }); }
    function publicNotes(notes) {
      var labels = {
        model_update_pending: legendaEstatisticas("legenda_ic_estatisticas_a_analise_esta_aguardando_atualizacao"),
        historical_association_not_causation: legendaEstatisticas("legenda_ic_estatisticas_uma_associacao_historica_nao_comprova_causa_e_efeito"),
        not_a_next_round_prediction: legendaEstatisticas("legenda_ic_estatisticas_nao_preve_a_proxima_rodada"),
        only_confirmed_preexisting_plans_define_outcome: legendaEstatisticas("legenda_ic_estatisticas_somente_planos_confirmados_antes_de_jogar_permitem_medir_o_cumprimento_dos_limites"),
        probability_interval_is_parameter_uncertainty_not_monte_carlo_error: legendaEstatisticas("legenda_ic_estatisticas_a_faixa_expressa_a_incerteza_da_estimativa"),
        holdout_brier_interval_assumes_independent_sessions: legendaEstatisticas("legenda_ic_estatisticas_a_avaliacao_depende_das_condicoes_de_independencia_entre_sessoes")
      };
      return notes.map(function (note) { return labels[note] || (/^[a-z0-9_]+$/.test(note) ? legendaEstatisticas("legenda_ic_estatisticas_ha_limitacoes_de_amostra_ou_qualidade_neste_calculo") : note); }).filter(function (note, index, all) { return all.indexOf(note) === index; });
    }
    function normalizeArea() { var available = availableAreas(); if (!available.some(function (area) { return area.id === state.area; })) state.area = available.length ? available[0].id : null; return available; }

    async function load(force) {
      if (disposed || state.status === "loading" || (!force && state.status === "ready")) return;
      if (!normalizeArea().length) { state.status = "unavailable"; renderInto(); return; }
      var revision = ++loadRevision, requestedArea = state.area;
      state.status = "loading"; renderInto();
      try {
        var modelRequest = requestedArea === "risco" ? deps.api.rpc("ic_risco_comportamental_rpc", { p_id_jogo: null }, { key: "statistics:behavioral-risk" }).then(function (result) {
          if (!result.data || result.data.schema_version !== "ic_behavioral_risk_v1" || !Array.isArray(result.data.models)) throw new Error(legendaEstatisticas("legenda_ic_estatisticas_contrato_do_modelo_comportamental_indisponivel"));
          return { data: result.data };
        }).catch(function (error) { return { error: error }; }) : Promise.resolve({ data: null });
        var exposureRequest = requestedArea === "banca" ? deps.api.rpc("ic_exposicao_continua_rpc", Object.assign({}, state.exposureQuery), { key: "statistics:continuous-exposure" }).then(function (result) {
          if (!result.data || result.data.schema_version !== "ic_continuous_exposure_v1" || !Array.isArray(result.data.models)) throw new Error(legendaEstatisticas("legenda_ic_estatisticas_contrato_da_curva_de_exposicao_indisponivel"));
          return { data: result.data };
        }).catch(function (error) { return { error: error }; }) : Promise.resolve({ data: null });
        var results = await Promise.all([deps.api.rpc("ic_estatisticas_rpc", { p_area: requestedArea }, { key: "statistics:" + requestedArea }), modelRequest, exposureRequest]);
        if (revision !== loadRevision || requestedArea !== state.area) return;
        state.status = "ready"; state.data = results[0].data || {}; state.error = null;
        state.protection = results[1].data || null; state.protectionError = results[1].error || null;
        state.exposure = results[2].data || null; state.exposureError = results[2].error || null;
      } catch (error) { if (revision !== loadRevision || error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
      if (state.status === "ready") openNotificationContext();
    }

    function subnav() { return ('<div class="ic-chip-row" role="tablist" data-statistics-areas aria-label="' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_areas_estatisticas")) + '">') + normalizeArea().map(function (area) { return '<button class="ic-chip" type="button" role="tab" aria-selected="' + (state.area === area.id) + '" data-screen-action="stats-area" data-action-value="' + area.id + '">' + Core.escapeHtml(area.label) + '</button>'; }).join("") + '</div>'; }

    function content() {
      var data = state.data || {};
      var availableSeries = Core.normalizeArray(data.series || data.serie || data.items || data.itens);
      if (data.status === "amostra_insuficiente" && (!availableSeries.length || state.area === "risco")) return UI.state({ type: "insufficient_data", retry: false }) + UI.button(legendaEstatisticas("legenda_ic_estatisticas_consultar_a_comunidade"), { route: "comunidade", icon: "community" });
      if (data.status === "qualidade_insuficiente" && (!availableSeries.length || state.area === "risco")) return UI.state({ type: "insufficient_quality", message: data.message || data.mensagem, meta: data.sample_summary || data.resumo_amostra, retry: false });
      if (state.area === "laboratorio") return laboratory(data);
      var summary = data.summary || data.resumo || {};
      var series = Core.normalizeArray(data.series || data.serie || data.items || data.itens);
      if (!series.length && !Object.keys(summary).length) return UI.state({ type: "empty", title: legendaEstatisticas("legenda_ic_estatisticas_ainda_nao_ha_estatistica_para_este_recorte"), message: legendaEstatisticas("legenda_ic_estatisticas_a_infraestrutura_permanece_ativa_e_passara_a_exibir_resultados_quando_houver_dados_elegiveis"), retry: false });
      var metrics = Core.normalizeArray(summary.metrics || summary.metricas).map(function (item) { return UI.metric(item.label || item.rotulo, finiteMetric(item.value !== undefined ? item.value : item.valor) !== null ? Core.formatNumber(item.value !== undefined ? item.value : item.valor) : (item.formatted_value || item.valor_formatado || Core.safeText(item.value !== undefined ? item.value : item.valor)), item.detail || item.detalhe); }).join("");
      var available = series.filter(function (item) { return finiteMetric(item.value !== undefined ? item.value : item.valor) !== null; });
      var rows = available.map(function (item) {
        var value = finiteMetric(item.value !== undefined ? item.value : item.valor);
        var label = item.started_at ? Core.formatDateTime(item.started_at) : item.label || item.rotulo || legendaEstatisticas("legenda_ic_estatisticas_faixa");
        var formatted = item.rounds_per_minute != null ? legendaEstatisticas("legenda_ic_estatisticas_ritmo_valor", { quantidade: Core.formatNumber(item.rounds_per_minute) }) : state.area === "sessoes" ? legendaEstatisticas("legenda_ic_estatisticas_rodadas_quantidade", { quantidade: Core.formatNumber(value, 0) }) : item.formatted_value || item.valor_formatado || Core.formatNumber(value);
        var detail = item.duration_seconds == null ? "" : Core.formatDuration(item.duration_seconds);
        return UI.listRow(label, detail, formatted) + seriesDetails(item);
      }).join("");
      if (!available.length && series.length) rows = UI.banner(legendaEstatisticas("legenda_ic_estatisticas_saldo_historico_nao_confirmado"), legendaEstatisticas("legenda_ic_estatisticas_estes_registros_nao_permitem_calcular_a_banca_inicial_e_final_com_seguranca_consulte_sessoes_pa"), "neutral");
      var warning = /insuficiente/.test(data.status || "") ? UI.banner(legendaEstatisticas("legenda_ic_estatisticas_historico_parcial"), legendaEstatisticas("legenda_ic_estatisticas_saldo_nao_confirmado_estes_dados_nao_preveem_proximas_rodadas"), "neutral") : "";
      return warning + (metrics ? '<div class="ic-grid ic-grid--metrics">' + metrics + '</div>' : '') + '<section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(data.title || data.titulo || areaLabel()) + '</h3><p>' + Core.escapeHtml(data.description || data.descricao || legendaEstatisticas("legenda_ic_estatisticas_associacao_historica_apresentada_com_amostra_e_incerteza")) + '</p></div>' + UI.badge(data.evidence_status || data.status_evidencia || "descritivo", data.evidence_status || data.status_evidencia) + '</div><div class="ic-stat-block">' + rows + '</div>' + UI.evidence(data.evidence || data.evidencia || data) + ('</section><div class="ic-disclaimer">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_associacoes_descrevem_o_historico_e_nao_estabelecem_causalidade_nem_preveem_a_proxima_rodada")) + '</div>');
    }

    function seriesDetails(item) {
      var fields = [
        ["net_result_units", legendaEstatisticas("legenda_ic_estatisticas_resultado_liquido"), true], ["balance_initial_units", legendaEstatisticas("legenda_ic_estatisticas_saldo_inicial"), true],
        ["movements_units", legendaEstatisticas("legenda_ic_estatisticas_movimentacoes_liquidas"), true], ["balance_final_units", legendaEstatisticas("legenda_ic_estatisticas_saldo_final"), true],
        ["peak_units", legendaEstatisticas("legenda_ic_estatisticas_pico_do_resultado"), true], ["giveback_units", legendaEstatisticas("legenda_ic_estatisticas_reducao_apos_o_pico"), true],
        ["drawdown_units", legendaEstatisticas("legenda_ic_estatisticas_maior_drawdown"), true], ["bonus_credited_units", legendaEstatisticas("legenda_ic_estatisticas_bonus_creditado"), true],
        ["free_spin_result_units", legendaEstatisticas("legenda_ic_estatisticas_resultado_dos_free_spins"), true],
        ["stake_increases_after_loss", legendaEstatisticas("legenda_ic_estatisticas_aumentos_apos_perda")], ["accelerations_after_loss", legendaEstatisticas("legenda_ic_estatisticas_aceleracoes_apos_perda")],
        ["disguised_losses", legendaEstatisticas("legenda_ic_estatisticas_retornos_inferiores_a_aposta")], ["maximum_loss_streak", legendaEstatisticas("legenda_ic_estatisticas_maior_sequencia_de_perdas")],
        ["duration_seconds", legendaEstatisticas("legenda_ic_estatisticas_duracao_em_segundos")], ["rounds", legendaEstatisticas("legenda_ic_estatisticas_rodadas_2")]
      ];
      var rows = fields.filter(function (field) { return Object.prototype.hasOwnProperty.call(item, field[0]); }).map(function (field) {
        var value = item[field[0]], text = value === null || value === undefined ? legendaEstatisticas("legenda_ic_estatisticas_indisponivel") : field[2] ? Core.formatMoney(value, item.currency, item.decimal_places) : Core.formatNumber(value);
        return UI.listRow(field[1], "", text);
      }).join("");
      if (item.detail) rows = '<p>' + Core.escapeHtml(item.detail === "sem_saldo" ? legendaEstatisticas("legenda_ic_estatisticas_saldo_nao_confirmado") : item.detail) + '</p>' + rows;
      if (item.quality) rows += UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_qualidade_dos_registros"), "", Core.statusLabel(item.quality));
      return rows ? ('<details class="ic-card"><summary>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_entender_este_resultado")) + '</summary><div class="ic-list">') + rows + '</div></details>' : '';
    }

    function postMultipliers() {
      if (["pico", "intervalos"].indexOf(state.area) < 0) return "";
      var data = state.data && state.data.post_multiplier;
      if (!data || data.version !== "ic_post_multiplier_descriptive_v1") return "";
      var rows = Core.normalizeArray(data.rows);
      if (!rows.length) return UI.banner(legendaEstatisticas("legenda_ic_estatisticas_apos_multiplicadores"), legendaEstatisticas("legenda_ic_estatisticas_ainda_nao_ha_eventos_elegiveis_na_projecao_diaria"), "neutral");
      var fmt = function (value) { var number = finiteMetric(value); return number === null ? legendaEstatisticas("legenda_ic_estatisticas_indisponivel") : new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(number); };
      var games = [], seen = Object.create(null);
      rows.forEach(function (row) { var id = Core.safeText(row.game_id, ""); if (id && !seen[id]) { seen[id] = true; games.push({ id: id, label: row.game }); } });
      var filters = ('<div class="ic-chip-row" aria-label="' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_multiplicador_minimo")) + '">') + [5, 10, 20, 50, 100].map(function (n) { return '<button type="button" class="ic-chip' + (postThreshold === n ? ' is-active' : '') + '" aria-pressed="' + (postThreshold === n) + '" data-screen-action="post-threshold" data-action-value="' + n + '">≥' + n + ("×" + '</button>'); }).join("") + ('</div><div class="ic-chip-row" aria-label="' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_jogo_analisado")) + '">') + [{ id: "all", label: legendaEstatisticas("legenda_ic_estatisticas_todos_os_jogos") }].concat(games).map(function (game) { return '<button type="button" class="ic-chip' + (postGame === game.id ? ' is-active' : '') + '" aria-pressed="' + (postGame === game.id) + '" data-screen-action="post-game" data-action-value="' + Core.escapeHtml(game.id) + '">' + Core.escapeHtml(game.label) + '</button>'; }).join("") + '</div>';
      rows = rows.filter(function (row) { return Number(row.threshold) === postThreshold && (postGame === "all" || String(row.game_id) === postGame); });
      return '<section><h3>' + Core.escapeHtml(state.area === "pico" ? legendaEstatisticas("legenda_ic_estatisticas_o_que_aconteceu_depois_dos_multiplicadores") : legendaEstatisticas("legenda_ic_estatisticas_distancia_observada_entre_multiplicadores")) + ('</h3><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_atualizacao"))) + Core.escapeHtml(Core.formatDateTime(data.updated_at)) + (Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_analise_pessoal_separada_por_jogo_e_moeda")) + '</p>') + filters + (!rows.length ? UI.banner(legendaEstatisticas("legenda_ic_estatisticas_nenhum_evento_neste_recorte"), legendaEstatisticas("legenda_ic_estatisticas_escolha_outro_jogo_ou_limiar_ausencia_de_eventos_nao_indica_quando_havera_um_premio"), "neutral") : '') + '<div class="ic-list">' + rows.map(function (row) {
        var body;
        if (state.area === "intervalos") {
          body = UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_pares_completos"), legendaEstatisticas("legenda_ic_estatisticas_com_proxima_ocorrencia_observada"), fmt(row.complete_pairs)) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_eventos_sem_sucessor"), legendaEstatisticas("legenda_ic_estatisticas_nao_entram_na_media_nao_sao_espera_zero"), fmt(row.censored_events)) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_media_mediana_de_rodadas"), legendaEstatisticas("legenda_ic_estatisticas_somente_pares_completos"), fmt(row.mean_rounds) + " / " + fmt(row.median_rounds)) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_metade_central_dos_intervalos"), legendaEstatisticas("legenda_ic_estatisticas_percentis_25_a_75"), legendaEstatisticas("legenda_ic_estatisticas_intervalo_rodadas", { inicio: fmt(row.p25_rounds), fim: fmt(row.p75_rounds) })) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_tempo_medio_registrado"), legendaEstatisticas("legenda_ic_estatisticas_nao_mede_o_tempo_real_de_requisicao"), legendaEstatisticas("legenda_ic_estatisticas_segundos_quantidade", { quantidade: fmt(row.mean_seconds) }));
        } else {
          body = UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_continuacao_apos_o_evento"), legendaEstatisticas("legenda_ic_estatisticas_ocorrencias_nao_sessoes_independentes"), fmt(row.continued)) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_terminaram_abaixo_do_resultado_pos_evento"), legendaEstatisticas("legenda_ic_estatisticas_no_mesmo_recorte_de_sessao_jogo"), fmt(row.ended_below_event)) + Core.normalizeArray(row.horizons).map(function (h) {
            var units = finiteMetric(h.mean_net_units), places = finiteMetric(row.decimal_places);
            var money = units === null || !Number.isInteger(places) || places < 0 || places > 8 || !/^[A-Z]{3}$/.test(row.currency || "") ? legendaEstatisticas("legenda_ic_estatisticas_indisponivel") : new Intl.NumberFormat("pt-BR", { style: "currency", currency: row.currency, minimumFractionDigits: places, maximumFractionDigits: Math.max(places, 2) }).format(units / Math.pow(10, places));
            return UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_horizonte_resultado", { rodadas: fmt(h.rounds), valor: money }), legendaEstatisticas("legenda_ic_estatisticas_horizontes_quantidade", { completos: fmt(h.complete), incompletos: fmt(h.censored) }), legendaEstatisticas("legenda_ic_estatisticas_negativos_quantidade", { quantidade: fmt(h.negative) }));
          }).join("");
        }
        return '<details class="ic-card"><summary>' + Core.escapeHtml(row.game + " · ≥" + fmt(row.threshold) + "× · " + row.currency) + '</summary><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_eventos_resumo", { eventos: fmt(row.events), sessoes: fmt(row.sessions), bet: Core.safeText(row.bet_id), versao: Core.safeText(row.game_version), plataforma: Core.safeText(row.platform) })) + '</p><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_periodo_intervalo", { inicio: Core.formatDateTime(row.period_start), fim: Core.formatDateTime(row.period_end) })) + '</p><div class="ic-list">' + body + ('</div><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_qualidade_temporal"))) + Core.escapeHtml(Core.normalizeArray(row.temporal_quality).join(", ")) + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_qualidade_financeira")) + Core.escapeHtml(Core.normalizeArray(row.financial_quality).join(", ")) + '.</p></details>';
      }).join("") + '</div><div class="ic-disclaimer">' + Core.normalizeArray(data.limitations).map(function (note) { return '<p>' + Core.escapeHtml(note) + '</p>'; }).join("") + '</div></section>';
    }

    function laboratory(data) {
      var items = Core.normalizeArray(data.hypotheses || data.hipoteses || data.items || data.itens);
      if (!items.length) return UI.state({ type: "empty", title: legendaEstatisticas("legenda_ic_estatisticas_nenhuma_hipotese_publicada"), message: legendaEstatisticas("legenda_ic_estatisticas_descobertas_so_aparecem_apos_registro_de_metodo_amostra_limitacoes_e_status_de_validacao"), retry: false });
      return '<div class="ic-list">' + items.map(function (item) { var direction = item.direction || item.direcao || "descritiva", effective = item.effective_source || item.fonte_efetiva; var bell = ""; return '<article class="ic-card"><div class="ic-card__header"><div><span class="ic-hypothesis-code">' + Core.escapeHtml(item.code || item.codigo) + '</span><h3>' + Core.escapeHtml(item.title || item.titulo || item.description || item.descricao) + ('</h3><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_direcao_observada"))) + Core.escapeHtml(direction) + '. ' + Core.escapeHtml(item.limitation || item.limitacao || "") + (effective ? legendaEstatisticas("legenda_ic_estatisticas_origem_efetiva_da_ultima_atualizacao") + Core.escapeHtml(sourceLabel(effective)) + '.' : '') + '</p></div>' + UI.badge(item.status || "exploratorio", item.status) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + UI.button(legendaEstatisticas("legenda_ic_estatisticas_ver_metodo"), { action: "hypothesis-detail", value: item.code || item.codigo }) + bell + '</div></article>'; }).join("") + ('</div><div class="ic-disclaimer">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_os_alertas_sao_configurados_em_meus_alertas_estatisticos_voce_nao_precisa_escolher_padroes_indi")) + '</div>');
    }

    function patternCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese || item.pattern_code || item.codigo_padrao); }
    function evidenceId(item) { return Core.validUuid(item && (item.id_insight_evidencia || item.insight_evidence_id || item.uuid_insight_evidencia || item.evidence_id)); }
    function patternsFromData(data) { return Core.normalizeArray(data.notification_patterns || data.padroes_notificaveis || data.patterns || data.padroes || data.hypotheses || data.hipoteses); }
    function areaLabel() { var found = areas.find(function (item) { return item.id === state.area; }); return found ? found.label : legendaEstatisticas("legenda_ic_estatisticas_estatisticas"); }
    function finiteMetric(value) { if ((typeof value !== "number" && typeof value !== "string") || (typeof value === "string" && !value.trim())) return null; var number = Number(value); return Number.isFinite(number) ? number : null; }
    function probabilityValue(value) { var number = finiteMetric(value); return number !== null && number >= 0 && number <= 1 ? number : null; }
    function protectionEvidence(model) {
      var sample = model.sample || {}, period = model.period || {};
      var source = ["pessoal", "comunidade", "ambos"].indexOf(model.scope) >= 0 ? sourceLabel(model.scope) : legendaEstatisticas("legenda_ic_estatisticas_fonte_nao_informada");
      return '<div class="ic-list">' + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_origem"), source, "") + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_amostra"), legendaEstatisticas("legenda_ic_estatisticas_amostra_elegivel", { sessoes: Core.safeText(sample.sessions), elegiveis: Core.safeText(sample.eligible_sessions), usuarios: Core.safeText(sample.users) }), "") + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_periodo"), legendaEstatisticas("legenda_ic_estatisticas_periodo_intervalo", { inicio: Core.formatDateTime(period.start), fim: Core.formatDateTime(period.end) }), "") + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_versao_do_calculo"), Core.safeText(model.model_version), "") + '</div>';
    }
    function behavioralModels() {
      if (state.area !== "risco") return "";
      var title = legendaEstatisticas("legenda_ic_estatisticas_risco_de_romper_o_planejamento");
      if (state.protectionError) return UI.banner(title, legendaEstatisticas("legenda_ic_estatisticas_o_modelo_comportamental_nao_pode_ser_atualizado_as_outras_estatisticas_nao_substituem_essa_esti"), "neutral");
      var models = Core.normalizeArray(state.protection && state.protection.models).slice(0, 20);
      if (!models.length) return UI.banner(title, legendaEstatisticas("legenda_ic_estatisticas_ainda_nao_ha_sessoes_planejadas_elegiveis_para_esta_analise_sessoes_observadas_sem_plano_nao_re"), "neutral");
      return '<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(title) + ('</h3><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_comportamento_em_relacao_aos_seus_compromissos_nao_ao_resultado_da_proxima_rodada")) + '</p></div></div><div class="ic-list">') + models.map(function (model) {
        var probability = probabilityValue(model.probability), interval = model.interval || {};
        var lower = probabilityValue(interval.lower), upper = probabilityValue(interval.upper);
        var eligible = model.probability_eligible === true && ["validado_fora_amostra", "replicado"].indexOf(model.status) >= 0 && probability !== null && lower !== null && upper !== null && lower <= probability && probability <= upper;
        var metric = eligible ? UI.metric(legendaEstatisticas("legenda_ic_estatisticas_estimativa_comportamental"), Core.formatPercent(probability * 100, 2), legendaEstatisticas("legenda_ic_estatisticas_incerteza_intervalo", { inferior: Core.formatPercent(lower * 100, 2), superior: Core.formatPercent(upper * 100, 2) })) : UI.banner(legendaEstatisticas("legenda_ic_estatisticas_estimativa_ainda_nao_liberada"), legendaEstatisticas("legenda_ic_estatisticas_amostra_qualidade_e_validacao_fora_da_amostra_precisam_ser_suficientes_ausencia_de_estimativa_n"), "neutral");
        var notes = publicNotes(Core.normalizeArray(model.reasons).concat(Core.normalizeArray(model.limitations)).filter(function (value) { return typeof value === "string"; }).slice(0, 12));
        return '<article class="ic-card"><div class="ic-card__header"><h3>' + Core.escapeHtml(model.game_label || legendaEstatisticas("legenda_ic_estatisticas_seu_planejamento")) + '</h3>' + UI.badge(model.status || "amostra_insuficiente", model.status) + '</div>' + metric + protectionEvidence(model) + (notes.length ? '<p>' + Core.escapeHtml(notes.join(" ")) + '</p>' : '') + ('<div class="ic-disclaimer">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_esta_analise_nao_muda_a_cor_do_relogio_nao_flexibiliza_seus_limites_e_nao_preve_se_o_jogo_pagar")) + '</div></article>');
      }).join("") + '</div></section>';
    }
    function exposureModels() {
      if (state.area !== "banca") return "";
      var models = Core.normalizeArray(state.exposure && state.exposure.models).slice(0, 20), query = state.exposureQuery;
      var games = [], seen = Object.create(null);
      models.forEach(function (model) { var game = model.game || {}, id = Core.safeText(game.id, ""); if (/^[1-9]\d*$/.test(id) && !seen[id]) { seen[id] = true; games.push({ id: id, label: model.game_label || legendaEstatisticas("legenda_ic_estatisticas_jogo") + id }); } });
      if (query.p_id_jogo && !seen[query.p_id_jogo]) games.push({ id: query.p_id_jogo, label: legendaEstatisticas("legenda_ic_estatisticas_jogo") + query.p_id_jogo });
      var form = ('<form class="ic-card ic-form" id="icExposureForm"><h3>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_consultar_exposicao_historica")) + '</h3><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_consulta_apenas_nao_altera_sua_banca_aposta_limites_ou_sessao_planejada")) + '</p><div class="ic-form-grid"><div class="ic-field"><label for="ic-exposure-game">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_jogo_2")) + '</label><select id="ic-exposure-game" name="game"><option value="">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_recortes_disponiveis")) + '</option>') + games.map(function (game) { return '<option value="' + Core.escapeHtml(game.id) + '"' + (String(query.p_id_jogo) === game.id ? ' selected' : '') + '>' + Core.escapeHtml(game.label) + '</option>'; }).join("") + ('</select></div><div class="ic-field"><label for="ic-exposure-pct">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_aposta_sobre_a_banca_inicial")) + '</label><input id="ic-exposure-pct" name="exposure" inputmode="decimal" required value="') + Core.escapeHtml(query.p_exposicao_pct === null ? "" : String(query.p_exposicao_pct).replace(".", ",")) + ('"></div><div class="ic-field"><label for="ic-exposure-risk">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_tolerancia_historica_para_atingir_a_perda_indicada")) + '</label><input id="ic-exposure-risk" name="risk" inputmode="decimal" required value="') + Core.escapeHtml(query.p_risco_maximo === null ? "" : String(query.p_risco_maximo * 100).replace(".", ",")) + '"></div></div>' + UI.button(legendaEstatisticas("legenda_ic_estatisticas_consultar_sem_alterar_meu_plano"), { type: "submit", kind: "primary" }) + '</form>';
      if (state.exposureError) return form + UI.banner(legendaEstatisticas("legenda_ic_estatisticas_curva_de_exposicao_indisponivel"), legendaEstatisticas("legenda_ic_estatisticas_nao_foi_possivel_atualizar_o_modelo_as_outras_estatisticas_nao_substituem_essa_consulta"), "neutral");
      if (!models.length) return UI.banner(legendaEstatisticas("legenda_ic_estatisticas_curva_de_exposicao_ainda_indisponivel"), legendaEstatisticas("legenda_ic_estatisticas_esta_analise_precisa_de_saldo_inicial_e_sessoes_elegiveis_os_outros_resultados_historicos_conti"), "neutral");
      return form + '<div class="ic-list">' + models.map(function (model) {
        var game = model.game || {}, sample = model.sample || {}, period = model.period || {};
        var eligible = model.curve_eligible === true && model.status === "validado_fora_amostra";
        var points = Core.normalizeArray(model.points).slice(0, 101).map(function (point) {
          var exposure = finiteMetric(point.exposure_pct), observed = probabilityValue(point.observed_rate), estimate = probabilityValue(point.estimate), lower = probabilityValue(point.lower), upper = probabilityValue(point.upper);
          var valid = eligible && point.in_support === true && exposure !== null && exposure > 0 && exposure <= 100 && estimate !== null && lower !== null && upper !== null && lower <= estimate && estimate <= upper;
          return UI.listRow(exposure === null ? legendaEstatisticas("legenda_ic_estatisticas_exposicao_indisponivel") : legendaEstatisticas("legenda_ic_estatisticas_exposicao_percentual", { percentual: Core.formatPercent(exposure, 2) }), legendaEstatisticas("legenda_ic_estatisticas_observado_sessoes", { percentual: observed === null ? legendaEstatisticas("legenda_ic_estatisticas_indisponivel_2") : Core.formatPercent(observed * 100, 2), sessoes: Core.safeText(point.sessions) }), valid ? legendaEstatisticas("legenda_ic_estatisticas_estimativa_intervalo", { estimativa: Core.formatPercent(estimate * 100, 2), inferior: Core.formatPercent(lower * 100, 2), superior: Core.formatPercent(upper * 100, 2) }) : legendaEstatisticas("legenda_ic_estatisticas_estimativa_nao_liberada"));
        }).join("");
        var target = model.adequacy || {}, estimate = probabilityValue(target.estimate), lower = probabilityValue(target.lower), upper = probabilityValue(target.upper), tolerance = probabilityValue(target.risk_tolerance);
        var targetExposure = finiteMetric(target.exposure_pct);
        var validTarget = eligible && target.in_support === true && ["dentro_tolerancia_historica", "acima_tolerancia_historica"].indexOf(target.status) >= 0 && targetExposure !== null && targetExposure > 0 && targetExposure <= 100 && estimate !== null && lower !== null && upper !== null && tolerance !== null && lower <= estimate && estimate <= upper && targetExposure === query.p_exposicao_pct && tolerance === query.p_risco_maximo && (target.status === "dentro_tolerancia_historica") === (upper <= tolerance);
        var targetText = validTarget ? (target.status === "dentro_tolerancia_historica" ? legendaEstatisticas("legenda_ic_estatisticas_dentro_da_tolerancia_historica_consultada") : legendaEstatisticas("legenda_ic_estatisticas_acima_da_tolerancia_historica_consultada")) : target.status === "fora_suporte" ? legendaEstatisticas("legenda_ic_estatisticas_percentual_fora_do_suporte_observado") : legendaEstatisticas("legenda_ic_estatisticas_adequacao_ainda_indisponivel");
        var targetDetail = validTarget ? legendaEstatisticas("legenda_ic_estatisticas_adequacao_detalhe", { exposicao: Core.formatPercent(targetExposure, 2), superior: Core.formatPercent(upper * 100, 2), tolerancia: Core.formatPercent(tolerance * 100, 2) }) : legendaEstatisticas("legenda_ic_estatisticas_informe_os_parametros_da_consulta_amostra_qualidade_suporte_e_validacao_futura_precisam_ser_suf");
        var source = ["pessoal", "comunidade", "ambos"].indexOf(model.scope) >= 0 ? sourceLabel(model.scope) : legendaEstatisticas("legenda_ic_estatisticas_fonte_nao_informada");
        var notes = publicNotes(Core.normalizeArray(model.limitations).filter(function (note) { return typeof note === "string"; }).slice(0, 12));
        return '<article class="ic-card"><div class="ic-card__header"><h3>' + Core.escapeHtml(model.game_label || legendaEstatisticas("legenda_ic_estatisticas_jogo") + Core.safeText(game.id)) + '</h3>' + UI.badge(model.status || "amostra_insuficiente", model.status) + ('</div><p>' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_evento_analisado_perda_de"))) + Core.escapeHtml(Core.safeText(model.threshold_loss_pct)) + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_no_mesmo_recorte_em_ate")) + Core.escapeHtml(Core.safeText(period.fixed_horizon_paid_rounds)) + (Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_rodadas_pagas_sessoes_interrompidas_antes_desse_horizonte_sao_identificadas_separadamente")) + '</p><div class="ic-list">') + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_recorte"), legendaEstatisticas("legenda_ic_estatisticas_bet") + Core.safeText(game.bet_id) + legendaEstatisticas("legenda_ic_estatisticas_versao_2") + Core.safeText(game.version_id) + " · " + Core.safeText(game.platform) + " · " + Core.safeText(game.mode), Core.safeText(model.currency)) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_origem"), source, "") + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_amostra"), legendaEstatisticas("legenda_ic_estatisticas_amostra_completa", { completas: Core.safeText(sample.complete_sessions), censuradas: Core.safeText(sample.censored_sessions), usuarios: Core.safeText(sample.users) }), "") + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_periodo"), legendaEstatisticas("legenda_ic_estatisticas_periodo_intervalo", { inicio: Core.formatDateTime(period.start), fim: Core.formatDateTime(period.end) }), "") + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_modelo"), Core.safeText(model.model_version), "") + points + '</div>' + UI.banner(targetText, targetDetail, "neutral") + (notes.length ? '<p>' + Core.escapeHtml(notes.join(" ")) + '</p>' : '') + ('<div class="ic-disclaimer">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_associacao_observacional_nao_causal_o_percentual_de_0_5_e_uma_referencia_em_analise_nunca_um_ot")) + '</div></article>');
      }).join("") + '</div>';
    }
    async function handleSubmit(form) {
      if (disposed || form.id !== "icExposureForm" || state.area !== "banca" || state.status === "loading") return;
      var values = new FormData(form), game = String(values.get("game") || "").trim();
      var exposure = finiteMetric(String(values.get("exposure") || "").trim().replace(",", ".")), risk = finiteMetric(String(values.get("risk") || "").trim().replace(",", "."));
      if ((game && !/^[1-9]\d*$/.test(game)) || exposure === null || exposure <= 0 || exposure > 100 || risk === null || risk < 0 || risk > 100) { UI.toast(legendaEstatisticas("legenda_ic_estatisticas_informe_um_percentual_maior_que_zero_e_ate_100_e_uma_tolerancia_entre_0_e_100")); return; }
      state.exposureQuery = { p_id_jogo: game || null, p_exposicao_pct: exposure, p_risco_maximo: risk / 100 };
      return load(true);
    }
    function sourceLabel(source) { return source === "pessoal" ? legendaEstatisticas("legenda_ic_estatisticas_seu_historico") : source === "comunidade" ? legendaEstatisticas("legenda_ic_estatisticas_comunidade_elegivel") : legendaEstatisticas("legenda_ic_estatisticas_seu_historico_e_comunidade_elegivel"); }
    function communityEligible(item) { return item.community_eligible !== false && item.comunidade_elegivel !== false && item.community_cell_eligible !== false && item.celula_comunitaria_elegivel !== false; }
    function openNotificationContext() {
      var context = deps.store.getState().statisticsNotificationContext;
      if (!context || context.section !== "estatisticas") return;
      deps.store.set({ statisticsNotificationContext: null });
      var period = [context.ocorrencia_inicio ? Core.formatDateTime(context.ocorrencia_inicio) : null, context.ocorrencia_fim ? Core.formatDateTime(context.ocorrencia_fim) : null].filter(Boolean).join(legendaEstatisticas("legenda_ic_estatisticas_ate"));
      UI.openSheet({ eyebrow: legendaEstatisticas("legenda_ic_estatisticas_lembrete_de_padrao_historico"), title: legendaEstatisticas("legenda_ic_estatisticas_ocorrencia_do_padrao_acompanhado"), html: UI.banner(legendaEstatisticas("legenda_ic_estatisticas_direcao_historica") + Core.safeText(context.direcao_historica), legendaEstatisticas("legenda_ic_estatisticas_fonte_efetiva") + sourceLabel(context.fonte_efetiva) + legendaEstatisticas("legenda_ic_estatisticas_chegou_uma_nova_janela_correspondente_ao_padrao_historico_que_voce_decidiu_acompanhar"), "neutral") + '<div class="ic-list">' + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_escopo"), legendaEstatisticas("legenda_ic_estatisticas_estatistica_acompanhada"), Core.safeText(context.escopo_estatistico)) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_ocorrencia_atual"), legendaEstatisticas("legenda_ic_estatisticas_janela_recorrente_identificada"), period || legendaEstatisticas("legenda_ic_estatisticas_nao_informado")) + UI.listRow(legendaEstatisticas("legenda_ic_estatisticas_versao_da_regra"), legendaEstatisticas("legenda_ic_estatisticas_criterio_usado_para_reconhecer_esta_ocorrencia"), Core.safeText(context.versao_regra)) + ('</div><div class="ic-disclaimer">' + Core.escapeHtml(legendaEstatisticas("legenda_ic_estatisticas_este_aviso_nao_cria_nem_inicia_sessao_planejada_e_nao_preve_resultados_futuros_se_a_celula_comu")) + '</div>') });
    }
    function render() {
      var html = '<div class="ic-statistics-heading">' + UI.sectionHeader(legendaEstatisticas("legenda_ic_estatisticas_estatisticas"), legendaEstatisticas("legenda_ic_estatisticas_entenda_suas_sessoes_e_resultados")) + '</div><div class="ic-page-stack">' + subnav();
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "unavailable") html += UI.state({ type: "unavailable", message: legendaEstatisticas("legenda_ic_estatisticas_nenhuma_analise_estatistica_esta_habilitada_pela_politica_atual"), retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content() + postMultipliers() + behavioralModels() + exposureModels();
      return html + '</div>';
    }
    function renderInto() {
      if (disposed) return;
      var canQuery = typeof deps.container.querySelector === "function";
      var previous = canQuery ? deps.container.querySelector('.ic-chip-row[data-statistics-areas]') : null;
      if (previous && !subnavRestorePending) subnavScrollLeft = previous.scrollLeft;
      deps.container.innerHTML = render();
      var current = canQuery ? deps.container.querySelector('.ic-chip-row[data-statistics-areas]') : null;
      if (current) current.scrollLeft = subnavScrollLeft;
      subnavRestorePending = false;
    }
    function findHypothesis(reference) { return patternsFromData(state.data || {}).find(function (item) { return String(patternCode(item)) === String(reference) || String(evidenceId(item)) === String(reference); }); }
    async function handleAction(action, value) {
      if (disposed) return;
      if (action === "post-threshold" && [5, 10, 20, 50, 100].indexOf(Number(value)) >= 0) { postThreshold = Number(value); renderInto(); return; }
      if (action === "post-game" && (value === "all" || Core.normalizeArray(state.data && state.data.post_multiplier && state.data.post_multiplier.rows).some(function (row) { return String(row.game_id) === value; }))) { postGame = value; renderInto(); return; }
      if (action === "retry") return load(true);
      if (action === "stats-area" && availableAreas().some(function (area) { return area.id === value; })) {
        var currentSubnav = typeof deps.container.querySelector === "function" ? deps.container.querySelector('.ic-chip-row[data-statistics-areas]') : null;
        if (currentSubnav) subnavScrollLeft = currentSubnav.scrollLeft;
        subnavRestorePending = true;
        state.area = value; state.status = "idle"; deps.navigate({ section: "estatisticas", subsection: value }, true); load(true);
      }
      if (action === "hypothesis-detail") { var item = findHypothesis(value); if (item) UI.openSheet({ eyebrow: item.code || item.codigo, title: item.title || item.titulo || legendaEstatisticas("legenda_ic_estatisticas_hipotese"), html: UI.banner(legendaEstatisticas("legenda_ic_estatisticas_status") + Core.safeText(item.status), item.description || item.descricao || "", item.status) + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-disclaimer">' + Core.escapeHtml(item.limitation || item.limitacao || legendaEstatisticas("legenda_ic_estatisticas_a_causa_nao_foi_estabelecida_e_o_resultado_nao_preve_rodadas_futuras")) + '</div>' }); }
    }
    function dispose() { disposed = true; loadRevision += 1; state.data = null; state.protection = null; state.protectionError = null; state.exposure = null; state.exposureError = null; state.exposureQuery = {}; state.pendingHypothesis = null; }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, dispose: dispose };
  };
}(window));
