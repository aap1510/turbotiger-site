(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasPlanejamento = {
    "legenda_ic_planejamento_15_minutos": "15 minutos",
    "legenda_ic_planejamento_30_minutos": "30 minutos",
    "legenda_ic_planejamento_45_minutos": "45 minutos",
    "legenda_ic_planejamento_60_minutos": "60 minutos",
    "legenda_ic_planejamento_90_minutos": "90 minutos",
    "legenda_ic_planejamento_reagendando_sessao_planejada": "Reagendando Sessão Planejada",
    "legenda_ic_planejamento_confirme_novamente_data_duracao_limite_e_lembrete_a_alteracao_cria_nova_revisao_auditavel": "Confirme novamente data, duração, limite e lembrete. A alteração cria nova revisão auditável.",
    "legenda_ic_planejamento_contexto_historico_carregado": "Contexto histórico carregado",
    "legenda_ic_planejamento_a_faixa_e_o_contexto_foram_preenchidos_data_duracao_limite_e_lembrete_continuam_exigindo_sua_co": "A faixa e o contexto foram preenchidos. Data, duração, limite e lembrete continuam exigindo sua confirmação.",
    "legenda_ic_planejamento_salvando": "Salvando…",
    "legenda_ic_planejamento_salvar_reagendamento": "Salvar reagendamento",
    "legenda_ic_planejamento_criar_sessao_planejada": "Criar Sessão Planejada",
    "legenda_ic_planejamento_cancelar_edicao": "Cancelar edição",
    "legenda_ic_planejamento_defina_seu_compromisso": "Defina seu compromisso",
    "legenda_ic_planejamento_data": "Data *",
    "legenda_ic_planejamento_horario": "Horário *",
    "legenda_ic_planejamento_duracao_maxima": "Duração máxima *",
    "legenda_ic_planejamento_selecione": "Selecione",
    "legenda_ic_planejamento_limite_maximo_de_perda": "Limite máximo de perda *",
    "legenda_ic_planejamento_valor_na_moeda_selecionada": "Valor na moeda selecionada",
    "legenda_ic_planejamento_moeda": "Moeda *",
    "legenda_ic_planejamento_selecione_a_moeda": "Selecione a moeda",
    "legenda_ic_planejamento_revise_os_campos_obrigatorios_destacados_antes_de_continuar": "Revise os campos obrigatórios destacados antes de continuar.",
    "legenda_ic_planejamento_abrir_o_lembrete_nao_inicia_a_sessao_somente_o_botao_iniciar_sessao_ativa_o_controle": "Abrir o lembrete não inicia a sessão. Somente o botão “Iniciar sessão” ativa o controle.",
    "legenda_ic_planejamento_no_horario": "No horário",
    "legenda_ic_planejamento_5_min_antes": "5 min antes",
    "legenda_ic_planejamento_10_min_antes": "10 min antes",
    "legenda_ic_planejamento_15_min_antes": "15 min antes",
    "legenda_ic_planejamento_30_min_antes": "30 min antes",
    "legenda_ic_planejamento_momento_do_lembrete": "Momento do lembrete *",
    "legenda_ic_planejamento_toda_sessao_planejada_possui_lembrete_automatico_o_canal_pode_ser_local_remoto_ou_hibrido": "Toda Sessão Planejada possui lembrete automático. O canal pode ser local, remoto ou híbrido.",
    "legenda_ic_planejamento_segunda": "Segunda",
    "legenda_ic_planejamento_terca": "Terça",
    "legenda_ic_planejamento_quarta": "Quarta",
    "legenda_ic_planejamento_quinta": "Quinta",
    "legenda_ic_planejamento_sexta": "Sexta",
    "legenda_ic_planejamento_sabado": "Sábado",
    "legenda_ic_planejamento_domingo": "Domingo",
    "legenda_ic_planejamento_contexto_e_recorrencia": "Contexto e recorrência",
    "legenda_ic_planejamento_bet": "Bet",
    "legenda_ic_planejamento_conta": "Conta",
    "legenda_ic_planejamento_jogo": "Jogo",
    "legenda_ic_planejamento_modo": "Modo",
    "legenda_ic_planejamento_orientativo": "Orientativo",
    "legenda_ic_planejamento_firme": "Firme",
    "legenda_ic_planejamento_recorrencia": "Recorrência",
    "legenda_ic_planejamento_uma_ocorrencia": "Uma ocorrência",
    "legenda_ic_planejamento_semanal": "Semanal",
    "legenda_ic_planejamento_ordinal_mensal": "Ordinal mensal",
    "legenda_ic_planejamento_personalizada": "Personalizada",
    "legenda_ic_planejamento_fuso_do_compromisso": "Fuso do compromisso",
    "legenda_ic_planejamento_dia_da_semana_semanal_mensal": "Dia da semana (semanal/mensal)",
    "legenda_ic_planejamento_ocorrencia_no_mes": "Ocorrência no mês",
    "legenda_ic_planejamento_primeira": "Primeira",
    "legenda_ic_planejamento_terceira": "Terceira",
    "legenda_ic_planejamento_ultima": "Última",
    "legenda_ic_planejamento_personalizada_a_cada_quantas_semanas": "Personalizada: a cada quantas semanas",
    "legenda_ic_planejamento_personalizada_dias_da_semana": "Personalizada: dias da semana",
    "legenda_ic_planejamento_encerrar_recorrencia_em_opcional": "Encerrar recorrência em (opcional)",
    "legenda_ic_planejamento_revisao_periodica": "Revisão periódica",
    "legenda_ic_planejamento_nao_definida": "Não definida",
    "legenda_ic_planejamento_mensal": "Mensal",
    "legenda_ic_planejamento_trimestral": "Trimestral",
    "legenda_ic_planejamento_mensagem_pessoal": "Mensagem pessoal",
    "legenda_ic_planejamento_nenhuma_sessao_planejada": "Nenhuma sessão planejada",
    "legenda_ic_planejamento_seus_proximos_compromissos_e_planos_concluidos_aparecerao_aqui": "Seus próximos compromissos e planos concluídos aparecerão aqui.",
    "legenda_ic_planejamento_abrir": "Abrir",
    "legenda_ic_planejamento_no_horario_2": "no horário",
    "legenda_ic_planejamento_obrigatorio": "obrigatório",
    "legenda_ic_planejamento_min_antes": " min antes",
    "legenda_ic_planejamento_compromissos_recorrentes": "Compromissos recorrentes",
    "legenda_ic_planejamento_sessao_recorrente": "Sessão recorrente",
    "legenda_ic_planejamento_proxima": " · próxima: ",
    "legenda_ic_planejamento_editar_serie": "Editar série",
    "legenda_ic_planejamento_retomar_serie": "Retomar série",
    "legenda_ic_planejamento_pausar_serie": "Pausar série",
    "legenda_ic_planejamento_cancelar_proximas": "Cancelar próximas",
    "legenda_ic_planejamento_planejar": "Planejar",
    "legenda_ic_planejamento_defina_antes_quanto_tempo_e_quanto_esta_disposto_a_perder_o_aplicativo_informa_voce_decide": "Defina antes quanto tempo e quanto está disposto a perder. O aplicativo informa; você decide.",
    "legenda_ic_planejamento_seus_planos": "Seus planos",
    "legenda_ic_planejamento_proximos_concluidos_cancelados_e_expirados": "Próximos, concluídos, cancelados e expirados.",
    "legenda_ic_planejamento_revise_os_dias_e_a_frequencia_da_recorrencia": "Revise os dias e a frequência da recorrência.",
    "legenda_ic_planejamento_a_moeda_precisa_estar_disponivel_no_catalogo_validado": "A moeda precisa estar disponível no catálogo validado.",
    "legenda_ic_planejamento_revise_os_campos_obrigatorios_antes_de_continuar": "Revise os campos obrigatórios antes de continuar.",
    "legenda_ic_planejamento_revise_os_campos_obrigatorios_da_sessao_planejada": "Revise os campos obrigatórios da Sessão Planejada.",
    "legenda_ic_planejamento_nao_foi_possivel_validar_a_revisao_atual_deste_planejamento": "Não foi possível validar a revisão atual deste planejamento.",
    "legenda_ic_planejamento_nao_foi_possivel_gerar_uma_identificacao_segura_para_o_planejamento": "Não foi possível gerar uma identificação segura para o planejamento.",
    "legenda_ic_planejamento_sessao_planejada_reagendada_com_novo_lembrete_automatico": "Sessão Planejada reagendada com novo lembrete automático.",
    "legenda_ic_planejamento_sessao_planejada_criada_com_lembrete_automatico": "Sessão Planejada criada com lembrete automático.",
    "legenda_ic_planejamento_nao_foi_possivel_salvar_a_sessao_planejada": "Não foi possível salvar a Sessão Planejada.",
    "legenda_ic_planejamento_compromisso_recorrente": "Compromisso recorrente",
    "legenda_ic_planejamento_cancelar_proximas_ocorrencias": "Cancelar próximas ocorrências?",
    "legenda_ic_planejamento_pausar_recorrencia": "Pausar recorrência?",
    "legenda_ic_planejamento_retomar_recorrencia": "Retomar recorrência?",
    "legenda_ic_planejamento_os_fatos_ja_registrados_serao_preservados": "Os fatos já registrados serão preservados",
    "legenda_ic_planejamento_a_alteracao_afeta_somente_os_proximos_compromissos_e_seus_lembretes": "A alteração afeta somente os próximos compromissos e seus lembretes.",
    "legenda_ic_planejamento_confirmar": "Confirmar",
    "legenda_ic_planejamento_nao_foi_possivel_alterar_a_recorrencia": "Não foi possível alterar a recorrência.",
    "legenda_ic_planejamento_abrir_nao_inicia_a_sessao": "Abrir não inicia a sessão",
    "legenda_ic_planejamento_revise_o_compromisso_e_toque_em_iniciar_sessao_somente_quando_decidir_comecar": "Revise o compromisso e toque em Iniciar sessão somente quando decidir começar.",
    "legenda_ic_planejamento_inicio": "Início",
    "legenda_ic_planejamento_duracao": "Duração",
    "legenda_ic_planejamento_min": " min",
    "legenda_ic_planejamento_limite": "Limite",
    "legenda_ic_planejamento_iniciar_sessao": "Iniciar sessão",
    "legenda_ic_planejamento_reagendar": "Reagendar",
    "legenda_ic_planejamento_cancelar": "Cancelar",
    "legenda_ic_planejamento_sessao_planejada": "Sessão Planejada",
    "legenda_ic_planejamento_detalhes_do_plano": "Detalhes do plano",
    "legenda_ic_planejamento_o_servidor_nao_confirmou_uma_sessao_ativa_atualize_o_planejamento": "O servidor não confirmou uma sessão ativa. Atualize o planejamento.",
    "legenda_ic_planejamento_sessao_de_controle_iniciada": "Sessão de controle iniciada.",
    "legenda_ic_planejamento_sessao_planejada_cancelada": "Sessão Planejada cancelada.",
    "legenda_ic_planejamento_a_operacao_nao_foi_concluida": "A operação não foi concluída."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasPlanejamento);
  function legendaPlanejamento(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasPlanejamento[chave]; }

  IC.Screens.planejar = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, series: [], error: null, saving: false, errors: {}, editingPlan: null, editingSeries: null, pendingCreate: null };

    function currencyContext() {
      var bootstrap = deps.store.getState().bootstrap;
      return bootstrap && bootstrap.data || {};
    }

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try {
        var responses = await Promise.all([deps.api.rpc("ic_planejamentos_listar_rpc", { p_cursor: null, p_limite: 30 }, { key: "planning:list" }), deps.api.rpc("ic_series_planejadas_listar_rpc", {}, { key: "planning:series" })]);
        var result = responses[0]; state.series = Core.normalizeArray((responses[1].data || {}).items);
        state.status = "ready"; state.data = result.data || {}; state.error = null; state.saving = false; state.errors = {};
      } catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function pad(value) { return String(value).padStart(2, "0"); }
    function unitsInput(value, decimalPlaces) {
      var units = Core.integerUnits(value), places = Core.decimalPlacesOf(decimalPlaces, null);
      if (units === null || places === null || Core.unitsSign(units) <= 0) return "";
      var digits = Core.absoluteUnits(units), padded = places > 0 ? digits.padStart(places + 1, "0") : digits;
      return places > 0 ? padded.slice(0, -places) + "," + padded.slice(-places) : padded;
    }
    function selected(current, expected) { return String(current) === String(expected) ? " selected" : ""; }
    function recurrenceValue(value) {
      var aliases = { unica: "none", semanal: "weekly", ordinal_mensal: "monthly_ordinal", personalizada: "custom" };
      value = String(value && value.type || value || "none");
      return aliases[value] || value;
    }

    function formHtml() {
      var now = new Date(), today = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
      var historicalDraft = deps.store.getState().planningDraft || {};
      var editing = state.editingSeries ? state.editingSeries.planning : state.editingPlan;
      var draft = editing || historicalDraft;
      var start = Core.zonedDateTimeParts(draft.starts_at || draft.inicio_em || draft.inicio_planejado_em, draft.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) || { date: "", time: "" };
      var draftDate = start.date || today;
      var draftTime = start.time || Core.safeText(draft.start_time || draft.hora_inicio, "").slice(0, 5);
      var duration = draft.duration_minutes || draft.duracao_minutos || (draft.duracao_limite_segundos ? Math.round(Number(draft.duracao_limite_segundos) / 60) : "");
      var loss = unitsInput(Core.unitsFrom(draft, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), Core.decimalPlacesOf(draft, null));
      var offset = draft.reminder_offset_minutes;
      if (offset === null || typeof offset === "undefined") offset = draft.lembrete_antecedencia_minutos;
      if (offset === null || typeof offset === "undefined") offset = 10;
      var durations = [[15, legendaPlanejamento("legenda_ic_planejamento_15_minutos")], [30, legendaPlanejamento("legenda_ic_planejamento_30_minutos")], [45, legendaPlanejamento("legenda_ic_planejamento_45_minutos")], [60, legendaPlanejamento("legenda_ic_planejamento_60_minutos")], [90, legendaPlanejamento("legenda_ic_planejamento_90_minutos")]];
      var contextBanner = editing ? UI.banner(legendaPlanejamento("legenda_ic_planejamento_reagendando_sessao_planejada"), legendaPlanejamento("legenda_ic_planejamento_confirme_novamente_data_duracao_limite_e_lembrete_a_alteracao_cria_nova_revisao_auditavel"), "attention") : Object.keys(historicalDraft).length ? UI.banner(legendaPlanejamento("legenda_ic_planejamento_contexto_historico_carregado"), legendaPlanejamento("legenda_ic_planejamento_a_faixa_e_o_contexto_foram_preenchidos_data_duracao_limite_e_lembrete_continuam_exigindo_sua_co"), "neutral") : "";
      var actions = UI.button(state.saving ? legendaPlanejamento("legenda_ic_planejamento_salvando") : editing ? legendaPlanejamento("legenda_ic_planejamento_salvar_reagendamento") : legendaPlanejamento("legenda_ic_planejamento_criar_sessao_planejada"), { type: "submit", kind: "primary", block: true, disabled: state.saving });
      if (editing) actions += UI.button(legendaPlanejamento("legenda_ic_planejamento_cancelar_edicao"), { action: "cancel-reschedule", kind: "quiet", disabled: state.saving });
      return '<form class="ic-form" id="icPlanningForm" novalidate>' + contextBanner + ('<div class="ic-form-section"><h3>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_defina_seu_compromisso")) + '</h3><div class="ic-form-grid"><div class="ic-field"><label for="ic-plan-date">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_data")) + '</label><input id="ic-plan-date" name="date" type="date" min="') + today + '" value="' + Core.escapeHtml(draftDate) + ('" required></div><div class="ic-field"><label for="ic-plan-time">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_horario")) + '</label><input id="ic-plan-time" name="time" type="time" value="') + Core.escapeHtml(draftTime) + ('" required></div><div class="ic-field"><label for="ic-plan-duration">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_duracao_maxima")) + '</label><select id="ic-plan-duration" name="duration_minutes" required><option value="">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_selecione")) + '</option>') + durations.map(function (item) { return '<option value="' + item[0] + '"' + selected(duration, item[0]) + '>' + Core.escapeHtml(item[1]) + '</option>'; }).join("") + ('</select></div><div class="ic-field"><label for="ic-plan-limit">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_limite_maximo_de_perda")) + '</label><input id="ic-plan-limit" name="loss_limit" inputmode="decimal" placeholder="' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_valor_na_moeda_selecionada")) + "\" value=\"") + Core.escapeHtml(loss) + ('" required></div><div class="ic-field"><label for="ic-plan-currency">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_moeda")) + '</label><select id="ic-plan-currency" name="currency" required>') + Core.currencyOptions(currencyContext(), draft.currency || draft.moeda || "", legendaPlanejamento("legenda_ic_planejamento_selecione_a_moeda")) + '</select></div></div></div>' + reminderHtml(offset) + optionalHtml(draft) + (Object.keys(state.errors).length ? ('<p class="ic-form-error" role="alert">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_revise_os_campos_obrigatorios_destacados_antes_de_continuar")) + '</p>') : '') + '<div class="ic-page-stack">' + actions + ('</div><p class="ic-required-note">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_abrir_o_lembrete_nao_inicia_a_sessao_somente_o_botao_iniciar_sessao_ativa_o_controle")) + '</p></form>');
    }

    function reminderHtml(selectedOffset) {
      var offsets = [{ v: 0, l: legendaPlanejamento("legenda_ic_planejamento_no_horario") }, { v: 5, l: legendaPlanejamento("legenda_ic_planejamento_5_min_antes") }, { v: 10, l: legendaPlanejamento("legenda_ic_planejamento_10_min_antes") }, { v: 15, l: legendaPlanejamento("legenda_ic_planejamento_15_min_antes") }, { v: 30, l: legendaPlanejamento("legenda_ic_planejamento_30_min_antes") }];
      return ('<div class="ic-form-section"><fieldset class="ic-fieldset"><legend>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_momento_do_lembrete")) + '</legend><div class="ic-choice-grid">') + offsets.map(function (item) { return '<div class="ic-choice"><input type="radio" id="ic-reminder-' + item.v + '" name="reminder_offset_minutes" value="' + item.v + '"' + (Number(selectedOffset) === item.v ? " checked" : "") + ' required><label for="ic-reminder-' + item.v + '">' + Core.escapeHtml(item.l) + '</label></div>'; }).join("") + ('</div><p class="ic-required-note">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_toda_sessao_planejada_possui_lembrete_automatico_o_canal_pode_ser_local_remoto_ou_hibrido")) + '</p></fieldset></div>');
    }

    function optionalHtml(draft) {
      draft = draft || {};
      var days = [[1, legendaPlanejamento("legenda_ic_planejamento_segunda")], [2, legendaPlanejamento("legenda_ic_planejamento_terca")], [3, legendaPlanejamento("legenda_ic_planejamento_quarta")], [4, legendaPlanejamento("legenda_ic_planejamento_quinta")], [5, legendaPlanejamento("legenda_ic_planejamento_sexta")], [6, legendaPlanejamento("legenda_ic_planejamento_sabado")], [7, legendaPlanejamento("legenda_ic_planejamento_domingo")]];
      return '<details class="ic-form-section"' + (Object.keys(draft).length ? " open" : "") + ('><summary>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_contexto_e_recorrencia")) + '</summary><div class="ic-form-grid">') + ["bet", "account", "game"].map(function (name, index) { return '<div class="ic-field"><label for="ic-plan-' + name + '">' + Core.escapeHtml([legendaPlanejamento("legenda_ic_planejamento_bet"), legendaPlanejamento("legenda_ic_planejamento_conta"), legendaPlanejamento("legenda_ic_planejamento_jogo")][index]) + '</label><input id="ic-plan-' + name + '" name="' + name + '" maxlength="100" value="' + Core.escapeHtml(draft[name] || draft[name + "_reference"] || "") + '"></div>'; }).join("") +
        ('<div class="ic-field"><label for="ic-plan-mode">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_modo")) + '</label><select id="ic-plan-mode" name="mode"><option value="orientativo">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_orientativo")) + '</option><option value="firme">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_firme")) + '</option></select></div><div class="ic-field"><label for="ic-plan-recurrence">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_recorrencia")) + '</label><select id="ic-plan-recurrence" name="recurrence"><option value="none">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_uma_ocorrencia")) + '</option><option value="weekly">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_semanal")) + '</option><option value="monthly_ordinal">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_ordinal_mensal")) + '</option><option value="custom">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_personalizada")) + '</option></select></div><div class="ic-field"><label for="ic-plan-timezone">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_fuso_do_compromisso")) + '</label><input id="ic-plan-timezone" name="timezone" value="') + Core.escapeHtml(draft.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) + '" required></div>' +
        ('<div class="ic-field"><label for="ic-plan-weekday">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_dia_da_semana_semanal_mensal")) + '</label><select id="ic-plan-weekday" name="recurrence_weekday"><option value="">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_selecione")) + '</option>') + days.map(function (day) { return '<option value="' + day[0] + '">' + Core.escapeHtml(day[1]) + '</option>'; }).join("") + ('</select></div><div class="ic-field"><label for="ic-plan-ordinal">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_ocorrencia_no_mes")) + '</label><select id="ic-plan-ordinal" name="recurrence_ordinal"><option value="">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_selecione")) + '</option><option value="1">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_primeira")) + '</option><option value="2">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_segunda")) + '</option><option value="3">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_terceira")) + '</option><option value="4">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_quarta")) + '</option><option value="5">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_quinta")) + '</option><option value="-1">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_ultima")) + '</option></select></div><div class="ic-field"><label for="ic-plan-interval">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_personalizada_a_cada_quantas_semanas")) + '</label><input id="ic-plan-interval" name="interval_weeks" type="number" min="1" max="52" value="1"></div><fieldset class="ic-fieldset"><legend>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_personalizada_dias_da_semana")) + '</legend>') + days.map(function (day) { return '<label><input type="checkbox" name="weekdays" value="' + day[0] + '"> ' + Core.escapeHtml(day[1]) + '</label>'; }).join("") + ('</fieldset><div class="ic-field"><label for="ic-plan-until">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_encerrar_recorrencia_em_opcional")) + '</label><input id="ic-plan-until" name="until" type="date"></div><div class="ic-field"><label for="ic-plan-review">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_revisao_periodica")) + '</label><select id="ic-plan-review" name="review"><option value="none">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_nao_definida")) + '</option><option value="monthly">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_mensal")) + '</option><option value="quarterly">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_trimestral")) + '</option></select></div></div><div class="ic-field"><label for="ic-plan-message">' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_mensagem_pessoal")) + '</label><textarea id="ic-plan-message" name="personal_message" maxlength="500"></textarea></div></details>');
    }

    function plansHtml() {
      var data = state.data || {};
      var plans = Core.normalizeArray(data.items || data.itens || data.plans || data.planos);
      if (!plans.length) return UI.state({ type: "empty", title: legendaPlanejamento("legenda_ic_planejamento_nenhuma_sessao_planejada"), message: legendaPlanejamento("legenda_ic_planejamento_seus_proximos_compromissos_e_planos_concluidos_aparecerao_aqui"), retry: false });
      return '<div class="ic-list">' + plans.map(function (plan) {
        var when = Core.formatDateTime(plan.starts_at || plan.inicio_em);
        var limit = Core.formatMoney(Core.unitsFrom(plan, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), plan.currency || plan.moeda || "", Core.decimalPlacesOf(plan, null));
        var actions = UI.button(legendaPlanejamento("legenda_ic_planejamento_abrir"), { action: "open-plan", value: planIdentifier(plan), kind: "quiet" });
        var reminderOffset = plan.reminder_offset_minutes;
        if (reminderOffset === null || typeof reminderOffset === "undefined") reminderOffset = plan.lembrete_antecedencia_minutos;
        return UI.listRow(plan.title || plan.titulo || when, (plan.status || "agendada") + " · " + (plan.duration_minutes || plan.duracao_minutos || "—") + " min · lembrete " + reminderLabel(reminderOffset), limit, actions);
      }).join("") + '</div>';
    }

    function planIdentifier(plan) { return plan && (plan.id || plan.plan_id || plan.id_planejamento || plan.cod_sessao_planejada); }
    function reminderLabel(offset) { var value = Core.validReminderOffset(offset); return value === 0 ? legendaPlanejamento("legenda_ic_planejamento_no_horario_2") : value === null ? legendaPlanejamento("legenda_ic_planejamento_obrigatorio") : value + legendaPlanejamento("legenda_ic_planejamento_min_antes"); }
    function seriesHtml() {
      if (!state.series.length) return "";
      return ('<section class="ic-page-stack"><h3>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_compromissos_recorrentes")) + '</h3>') + state.series.map(function (series) {
        var paused = series.status === "pausada", cancelled = series.status === "cancelada";
        return '<article class="ic-card"><h4>' + Core.escapeHtml(series.title || legendaPlanejamento("legenda_ic_planejamento_sessao_recorrente")) + '</h4><p>' + Core.escapeHtml(series.status) + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_proxima")) + Core.escapeHtml(Core.formatDateTime(series.next_occurrence_at)) + '</p><div class="ic-card__footer">' + (cancelled ? "" : UI.button(legendaPlanejamento("legenda_ic_planejamento_editar_serie"), { action: "edit-series", value: series.series_id }) + UI.button(paused ? legendaPlanejamento("legenda_ic_planejamento_retomar_serie") : legendaPlanejamento("legenda_ic_planejamento_pausar_serie"), { action: paused ? "resume-series" : "pause-series", value: series.series_id }) + UI.button(legendaPlanejamento("legenda_ic_planejamento_cancelar_proximas"), { action: "cancel-series", value: series.series_id, kind: "danger" })) + '</div></article>';
      }).join("") + '</section>';
    }

    function render() {
      var html = UI.sectionHeader(legendaPlanejamento("legenda_ic_planejamento_planejar"), legendaPlanejamento("legenda_ic_planejamento_defina_antes_quanto_tempo_e_quanto_esta_disposto_a_perder_o_aplicativo_informa_voce_decide"));
      if (state.status === "idle" || state.status === "loading") return html + UI.state({ type: "loading", retry: false });
      if (state.status === "error") return html + UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      return html + '<div class="ic-planning-layout"><section class="ic-card ic-card--raised">' + formHtml() + ('</section><section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_seus_planos")) + '</h3><p>' + Core.escapeHtml(legendaPlanejamento("legenda_ic_planejamento_proximos_concluidos_cancelados_e_expirados")) + '</p></div></div>') + plansHtml() + seriesHtml() + '</section></div>';
    }

    function renderInto() {
      deps.container.innerHTML = render();
      var form = deps.container.querySelector("#icPlanningForm"), draft = state.editingSeries && state.editingSeries.planning || state.editingPlan || deps.store.getState().planningDraft || {};
      if (!form) return;
      var values = {
        mode: draft.mode || draft.modo_controle,
        recurrence: recurrenceValue(draft.recurrence || draft.tipo_recorrencia),
        recurrence_weekday: draft.recurrence && draft.recurrence.weekday,
        recurrence_ordinal: draft.recurrence && draft.recurrence.ordinal,
        interval_weeks: draft.recurrence && draft.recurrence.interval_weeks || 1,
        until: draft.recurrence && draft.recurrence.until,
        review: draft.review_cycle || draft.ciclo_revisao,
        personal_message: draft.personal_message || draft.mensagem_pessoal
      };
      Object.keys(values).forEach(function (name) { var field = form.elements.namedItem(name); if (field && values[name] !== null && typeof values[name] !== "undefined") field.value = String(values[name]); });
      var currencies = Core.currencyCatalog(currencyContext()), currencyField = form.elements.namedItem("currency");
      if (currencyField && !currencyField.value && currencies.length === 1) currencyField.value = currencies[0].code;
      var overall = (currencyContext().historical_summary || {}).overall || {};
      var historicalCurrency = overall.moeda || overall.currency;
      if (currencyField && !currencyField.value && historicalCurrency && currencies.some(function (item) { return item.code === historicalCurrency; })) currencyField.value = historicalCurrency;
      if (draft.recurrence && Array.isArray(draft.recurrence.weekdays)) Array.from(form.querySelectorAll('[name="weekdays"]')).forEach(function (field) { field.checked = draft.recurrence.weekdays.indexOf(Number(field.value)) >= 0; });
    }

    async function submit(form) {
      if (state.saving) return;
      var values = new FormData(form);
      var currency = String(values.get("currency") || "");
      var definition = Core.currencyCatalog(currencyContext()).find(function (item) { return item.code === currency; });
      var units = definition ? Core.parseMoneyToUnitsText(values.get("loss_limit"), definition.decimal_places) : null;
      var payload = {
        starts_at: Core.wallTimeToISOString(String(values.get("date") || ""), String(values.get("time") || ""), String(values.get("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone)),
        duration_minutes: Core.finiteInteger(values.get("duration_minutes"), 0),
        loss_limit_units: units,
        currency: currency,
        decimal_places: definition ? definition.decimal_places : null,
        reminder_offset_minutes: Core.finiteInteger(values.get("reminder_offset_minutes"), -1),
        mode: String(values.get("mode") || "orientativo"),
        bet_reference: String(values.get("bet") || "").trim() || null,
        account_reference: String(values.get("account") || "").trim() || null,
        game_reference: String(values.get("game") || "").trim() || null,
        recurrence: { type: String(values.get("recurrence") || "none") },
        timezone: String(values.get("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone),
        review_cycle: String(values.get("review") || "none"),
        personal_message: String(values.get("personal_message") || "").trim() || null,
        source_report_id: (deps.store.getState().planningDraft || {}).id || (deps.store.getState().planningDraft || {}).id_registro || null
      };
      if (["weekly", "day_of_week", "monthly_ordinal"].indexOf(payload.recurrence.type) >= 0) payload.recurrence.weekday = Number(values.get("recurrence_weekday"));
      if (payload.recurrence.type === "monthly_ordinal") payload.recurrence.ordinal = Number(values.get("recurrence_ordinal"));
      if (payload.recurrence.type === "custom") { payload.recurrence.weekdays = values.getAll("weekdays").map(Number); payload.recurrence.interval_weeks = Number(values.get("interval_weeks")); }
      if (values.get("until")) payload.recurrence.until = String(values.get("until"));
      payload.recurrence.review_cycle = payload.review_cycle;
      var validation = Core.validatePlannedSession(payload);
      if ((payload.recurrence.weekday != null && !(payload.recurrence.weekday >= 1 && payload.recurrence.weekday <= 7)) ||
          (payload.recurrence.type === "monthly_ordinal" && [1, 2, 3, 4, 5, -1].indexOf(payload.recurrence.ordinal) < 0) ||
          (payload.recurrence.type === "custom" && (!payload.recurrence.weekdays.length || !Number.isInteger(payload.recurrence.interval_weeks) || payload.recurrence.interval_weeks < 1 || payload.recurrence.interval_weeks > 52))) { validation.valid = false; validation.errors.recurrence = legendaPlanejamento("legenda_ic_planejamento_revise_os_dias_e_a_frequencia_da_recorrencia"); }
      if (!definition) { validation.valid = false; validation.errors.currency = legendaPlanejamento("legenda_ic_planejamento_a_moeda_precisa_estar_disponivel_no_catalogo_validado"); }
      state.errors = validation.errors;
      if (!validation.valid) {
        var fieldMap = { starts_at: "date", duration_minutes: "duration_minutes", loss_limit_units: "loss_limit", currency: "currency", reminder_offset_minutes: "reminder_offset_minutes" };
        Object.keys(validation.errors).forEach(function (key) { var field = form.elements.namedItem(fieldMap[key]); if (field) { if (field.length && !field.tagName) field = field[0]; field.setAttribute("aria-invalid", "true"); } });
        var existingError = form.querySelector(".ic-form-error");
        if (!existingError) { existingError = document.createElement("p"); existingError.className = "ic-form-error"; existingError.setAttribute("role", "alert"); form.appendChild(existingError); }
        existingError.textContent = legendaPlanejamento("legenda_ic_planejamento_revise_os_campos_obrigatorios_antes_de_continuar");
        var firstInvalid = form.querySelector('[aria-invalid="true"]'); if (firstInvalid) firstInvalid.focus();
        UI.announce(legendaPlanejamento("legenda_ic_planejamento_revise_os_campos_obrigatorios_da_sessao_planejada")); return;
      }
      state.saving = true;
      var submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) { submitButton.disabled = true; submitButton.textContent = legendaPlanejamento("legenda_ic_planejamento_salvando"); }
      try {
        var editing = state.editingPlan;
        var series = state.editingSeries;
        var planId = editing && Core.finiteInteger(editing.id || editing.plan_id || editing.id_planejamento || editing.cod_sessao_planejada, 0);
        var revision = editing && Core.finiteInteger(editing.revision || editing.revisao || editing.revisao_atual, 0);
        if (editing && (planId <= 0 || revision <= 0)) throw new Error(legendaPlanejamento("legenda_ic_planejamento_nao_foi_possivel_validar_a_revisao_atual_deste_planejamento"));
        if (!editing && !series) {
          var fingerprint = JSON.stringify(payload);
          if (!state.pendingCreate || state.pendingCreate.fingerprint !== fingerprint) {
            if (!root.crypto || typeof root.crypto.randomUUID !== "function") throw new Error(legendaPlanejamento("legenda_ic_planejamento_nao_foi_possivel_gerar_uma_identificacao_segura_para_o_planejamento"));
            state.pendingCreate = { fingerprint: fingerprint, id: root.crypto.randomUUID() };
          }
          payload.client_request_id = state.pendingCreate.id;
        }
        var rpc = series ? "ic_serie_planejada_editar_rpc" : editing ? "ic_sessao_reagendar_rpc" : payload.recurrence.type !== "none" ? "ic_serie_planejada_criar_rpc" : "ic_sessao_planejar_rpc";
        var parameters = series ? { p_id_serie: series.series_id, p_revisao_esperada: series.revision, p_planejamento: payload } : editing ? { p_id_planejamento: planId, p_revisao_esperada: revision, p_planejamento: payload } : { p_planejamento: payload };
        var created = await deps.api.rpc(rpc, parameters, { key: "planning:save" });
        syncLocalReminder(created.data, "schedule");
        state.pendingCreate = null;
        UI.toast(editing ? legendaPlanejamento("legenda_ic_planejamento_sessao_planejada_reagendada_com_novo_lembrete_automatico") : legendaPlanejamento("legenda_ic_planejamento_sessao_planejada_criada_com_lembrete_automatico"));
        deps.store.set({ planningDraft: null });
        state.editingPlan = null; state.editingSeries = null; state.status = "idle"; state.saving = false; await load(true);
      } catch (error) { state.saving = false; if (submitButton) { submitButton.disabled = false; submitButton.textContent = state.editingPlan ? legendaPlanejamento("legenda_ic_planejamento_salvar_reagendamento") : legendaPlanejamento("legenda_ic_planejamento_criar_sessao_planejada"); } UI.toast(error.message || legendaPlanejamento("legenda_ic_planejamento_nao_foi_possivel_salvar_a_sessao_planejada")); }
    }

    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (["edit-series", "pause-series", "resume-series", "cancel-series"].indexOf(action) >= 0) {
        var series = state.series.find(function (item) { return item.series_id === value; });
        if (!series) return;
        if (action === "edit-series") { state.editingSeries = series; state.editingPlan = null; renderInto(); return; }
        UI.openSheet({ eyebrow: legendaPlanejamento("legenda_ic_planejamento_compromisso_recorrente"), title: action === "cancel-series" ? legendaPlanejamento("legenda_ic_planejamento_cancelar_proximas_ocorrencias") : action === "pause-series" ? legendaPlanejamento("legenda_ic_planejamento_pausar_recorrencia") : legendaPlanejamento("legenda_ic_planejamento_retomar_recorrencia"), html: UI.banner(legendaPlanejamento("legenda_ic_planejamento_os_fatos_ja_registrados_serao_preservados"), legendaPlanejamento("legenda_ic_planejamento_a_alteracao_afeta_somente_os_proximos_compromissos_e_seus_lembretes"), "attention") + UI.button(legendaPlanejamento("legenda_ic_planejamento_confirmar"), { action: "confirm-" + action, value: value }) });
      }
      if (["confirm-pause-series", "confirm-resume-series", "confirm-cancel-series"].indexOf(action) >= 0) {
        var selectedSeries = state.series.find(function (item) { return item.series_id === value; });
        if (!selectedSeries) return;
        var seriesRpc = action === "confirm-pause-series" ? "ic_serie_planejada_pausar_rpc" : action === "confirm-resume-series" ? "ic_serie_planejada_retomar_rpc" : "ic_serie_planejada_cancelar_rpc";
        try { await deps.api.rpc(seriesRpc, { p_id_serie: selectedSeries.series_id, p_revisao_esperada: selectedSeries.revision }, { key: "planning:series:mutation" }); UI.closeSheet(); state.status = "idle"; await load(true); }
        catch (error) { UI.toast(error.message || legendaPlanejamento("legenda_ic_planejamento_nao_foi_possivel_alterar_a_recorrencia")); }
      }
      if (action === "open-plan") {
        var plans = Core.normalizeArray((state.data || {}).items || (state.data || {}).itens || (state.data || {}).plans || (state.data || {}).planos);
        var plan = plans.find(function (item) { return String(planIdentifier(item)) === String(value); });
        if (!plan) return;
        var html = UI.banner(legendaPlanejamento("legenda_ic_planejamento_abrir_nao_inicia_a_sessao"), legendaPlanejamento("legenda_ic_planejamento_revise_o_compromisso_e_toque_em_iniciar_sessao_somente_quando_decidir_comecar"), "neutral") + '<div class="ic-grid ic-grid--metrics">' + UI.metric(legendaPlanejamento("legenda_ic_planejamento_inicio"), Core.formatDateTime(plan.starts_at || plan.inicio_em)) + UI.metric(legendaPlanejamento("legenda_ic_planejamento_duracao"), Core.safeText(plan.duration_minutes || plan.duracao_minutos) + legendaPlanejamento("legenda_ic_planejamento_min")) + UI.metric(legendaPlanejamento("legenda_ic_planejamento_limite"), Core.formatMoney(Core.unitsFrom(plan, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), plan.currency || plan.moeda || "", Core.decimalPlacesOf(plan, null))) + '</div><div class="ic-card__footer">' + UI.button(legendaPlanejamento("legenda_ic_planejamento_iniciar_sessao"), { action: "start-plan", value: value, kind: "primary" }) + UI.button(legendaPlanejamento("legenda_ic_planejamento_reagendar"), { action: "reschedule-plan", value: value }) + UI.button(legendaPlanejamento("legenda_ic_planejamento_cancelar"), { action: "cancel-plan", value: value, kind: "danger" }) + '</div>';
        UI.openSheet({ eyebrow: plan.status || legendaPlanejamento("legenda_ic_planejamento_sessao_planejada"), title: plan.title || legendaPlanejamento("legenda_ic_planejamento_detalhes_do_plano"), html: html });
      }
      if (["start-plan", "cancel-plan"].indexOf(action) >= 0) {
        var rpc = action === "start-plan" ? "ic_sessao_iniciar_rpc" : "ic_sessao_cancelar_rpc";
        try { var changed = await deps.api.rpc(rpc, { p_id_planejamento: value }, { key: "planning:mutation" }); if (action === "start-plan" && (!changed.data || changed.data.started === false || ["ativa", "pausada"].indexOf(changed.data.status) < 0 || Core.finiteInteger(changed.data.session_id || changed.data.id_sessao, 0) <= 0 || Core.finiteInteger(changed.data.revision || changed.data.revisao, 0) <= 0)) throw new Error(legendaPlanejamento("legenda_ic_planejamento_o_servidor_nao_confirmou_uma_sessao_ativa_atualize_o_planejamento")); if (action === "cancel-plan") syncLocalReminder(changed.data || { id_planejamento: value }, "cancel"); else IC.Bridge.post("session_control_action", { action: "start", session_id: changed.data && (changed.data.session_id || changed.data.id_sessao), revision: changed.data && (changed.data.revision || changed.data.revisao), carga: deps.route().loadGeneration || null }); UI.closeSheet(); UI.toast(action === "start-plan" ? legendaPlanejamento("legenda_ic_planejamento_sessao_de_controle_iniciada") : legendaPlanejamento("legenda_ic_planejamento_sessao_planejada_cancelada")); state.status = "idle"; await load(true); if (action === "start-plan") deps.navigate({ section: "ao-vivo", sessionId: null }); }
        catch (error) { UI.toast(error.message || legendaPlanejamento("legenda_ic_planejamento_a_operacao_nao_foi_concluida")); }
      }
      if (action === "reschedule-plan") {
        var scheduledPlans = Core.normalizeArray((state.data || {}).items || (state.data || {}).itens || (state.data || {}).plans || (state.data || {}).planos);
        var scheduledPlan = scheduledPlans.find(function (item) { return String(planIdentifier(item)) === String(value); });
        if (!scheduledPlan) return;
        state.editingSeries = null; state.editingPlan = scheduledPlan; state.errors = {}; UI.closeSheet(); renderInto();
        var dateField = deps.container.querySelector("#ic-plan-date"); if (dateField) { dateField.scrollIntoView({ behavior: "smooth", block: "center" }); dateField.focus(); }
      }
      if (action === "cancel-reschedule") { state.editingPlan = null; state.editingSeries = null; state.errors = {}; renderInto(); }
    }

    function syncLocalReminder(result, operation) {
      var reminder = result && (result.device_reminder || result.lembrete_dispositivo || result.reminder || result.lembrete);
      if (!Core.isPlainObject(reminder) || ["schedule", "cancel"].indexOf(operation) < 0) return false;
      var deliveryId = Core.finiteInteger(reminder.delivery_id || reminder.id_entrega || result.delivery_id || result.id_entrega, 0);
      var reminderId = Core.finiteInteger(reminder.reminder_id || reminder.id_lembrete || reminder.id, 0);
      var planId = Core.finiteInteger(reminder.plan_id || reminder.id_planejamento || result.plan_id || result.id_planejamento || result.id, 0);
      var revision = Core.finiteInteger(reminder.revision || reminder.revisao || result.revision || result.revisao, 0);
      var localToken = String(reminder.local_token || reminder.token_local || result.local_token || result.token_local || "").trim().toLowerCase();
      var scheduledAt = String(reminder.scheduled_at || reminder.agendado_em || result.scheduled_at || result.agendado_em || "").trim();
      var validUntil = String(reminder.valid_until || "").trim();
      if (deliveryId <= 0 || reminderId <= 0 || planId <= 0 || revision <= 0 ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(localToken) ||
          (operation === "schedule" && !(Number.isFinite(Date.parse(scheduledAt)) && Date.parse(validUntil) > Date.parse(scheduledAt)))) return false;
      return IC.Bridge.post("reminder_local_sync", {
        operation: operation,
        delivery_id: deliveryId,
        reminder_id: reminderId,
        plan_id: planId,
        revision: revision,
        local_token: localToken,
        scheduled_at: scheduledAt || null,
        valid_until: validUntil || null,
        carga: deps.route().loadGeneration || null
      });
    }

    return { render: render, load: load, handleAction: handleAction, handleSubmit: function (form) { if (form.id === "icPlanningForm") return submit(form); } };
  };
}(window));
