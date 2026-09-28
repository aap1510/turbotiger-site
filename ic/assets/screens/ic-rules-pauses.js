(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  var fontesLegendasRegrasPausas = {
    "legenda_ic_regras_pausas_alteracao_em_reflexao": "Alteração em reflexão",
    "legenda_ic_regras_pausas_a_regra_atual_continua_valendo_confirmacao_disponivel_a_partir_de": "A regra atual continua valendo. Confirmação disponível a partir de ",
    "legenda_ic_regras_pausas_confirmar_alteracao": "Confirmar alteração",
    "legenda_ic_regras_pausas_desistir_da_alteracao": "Desistir da alteração",
    "legenda_ic_regras_pausas_pausa_ativa": "Pausa ativa",
    "legenda_ic_regras_pausas_voce_decidiu_proteger_seu_planejamento_ate": "Você decidiu proteger seu planejamento até ",
    "legenda_ic_regras_pausas_lembretes_de_inicio_permanecem_suprimidos": ". Lembretes de início permanecem suprimidos.",
    "legenda_ic_regras_pausas_nenhuma_pausa_ativa": "Nenhuma pausa ativa",
    "legenda_ic_regras_pausas_voce_pode_criar_uma_pausa_a_qualquer_momento_isso_nao_apaga_seu_historico": "Você pode criar uma pausa a qualquer momento. Isso não apaga seu histórico.",
    "legenda_ic_regras_pausas_ativa": "Ativa",
    "legenda_ic_regras_pausas_inativa": "Inativa",
    "legenda_ic_regras_pausas_editar_compromisso": "Editar compromisso",
    "legenda_ic_regras_pausas_nenhuma_regra_pessoal_criada": "Nenhuma regra pessoal criada",
    "legenda_ic_regras_pausas_defina_limites_antes_da_sessao_reducoes_entram_em_vigor_imediatamente_aumentos_exigem_reflexao": "Defina limites antes da sessão. Reduções entram em vigor imediatamente; aumentos exigem reflexão.",
    "legenda_ic_regras_pausas_preciso_parar": "Preciso parar",
    "legenda_ic_regras_pausas_ative_uma_pausa_suprima_lembretes_de_inicio_e_proteja_seu_acesso_interno": "Ative uma pausa, suprima lembretes de início e proteja seu acesso interno.",
    "legenda_ic_regras_pausas_escolher_uma_pausa_agora": "Escolher uma pausa agora",
    "legenda_ic_regras_pausas_escolha_um_compromisso_e_defina_seu_limite_nada_e_ativado_sem_sua_confirmacao": "Escolha um compromisso e defina seu limite. Nada é ativado sem sua confirmação.",
    "legenda_ic_regras_pausas_minhas_regras": "Minhas regras",
    "legenda_ic_regras_pausas_tempo_perda_intervalo_exposicao_e_mudancas_de_comportamento": "Tempo, perda, intervalo, exposição e mudanças de comportamento.",
    "legenda_ic_regras_pausas_nova_regra": "Nova regra",
    "legenda_ic_regras_pausas_modo_de_controle": "Modo de controle",
    "legenda_ic_regras_pausas_o_modo_firme_precisa_ser_escolhido_antes_da_sessao": "O modo firme precisa ser escolhido antes da sessão.",
    "legenda_ic_regras_pausas_orientativo": "Orientativo",
    "legenda_ic_regras_pausas_alerta_registra_e_mantem_a_decisao_com_voce": "Alerta, registra e mantém a decisão com você.",
    "legenda_ic_regras_pausas_ativo": "Ativo",
    "legenda_ic_regras_pausas_firme": "Firme",
    "legenda_ic_regras_pausas_fecha_a_aba_interna_encerra_a_sessao_e_inicia_pausa_ao_atingir_o_compromisso": "Fecha a aba interna, encerra a sessão e inicia pausa ao atingir o compromisso.",
    "legenda_ic_regras_pausas_regras_e_pausas": "Regras e Pausas",
    "legenda_ic_regras_pausas_compromissos_pessoais_configurados_antes_da_decisao_de_jogar": "Compromissos pessoais configurados antes da decisão de jogar.",
    "legenda_ic_regras_pausas_o_catalogo_seguro_de_regras_esta_indisponivel": "O catálogo seguro de regras está indisponível.",
    "legenda_ic_regras_pausas_moeda": "Moeda",
    "legenda_ic_regras_pausas_valor_na_moeda_escolhida": "Valor na moeda escolhida",
    "legenda_ic_regras_pausas_nao_jogar_a_partir_de": "Não jogar a partir de",
    "legenda_ic_regras_pausas_ate": "Até",
    "legenda_ic_regras_pausas_fuso_horario": "Fuso horário",
    "legenda_ic_regras_pausas_limite": "Limite",
    "legenda_ic_regras_pausas_pausa_apos_o_ganho_em_segundos": "Pausa após o ganho, em segundos",
    "legenda_ic_regras_pausas_regra": "Regra",
    "legenda_ic_regras_pausas_modo": "Modo",
    "legenda_ic_regras_pausas_manter_regra_ativa": " Manter regra ativa",
    "legenda_ic_regras_pausas_mensagem_pessoal": "Mensagem pessoal",
    "legenda_ic_regras_pausas_protecao_contra_alteracao_impulsiva": "Proteção contra alteração impulsiva",
    "legenda_ic_regras_pausas_reducoes_valem_imediatamente_aumentos_desativacao_ou_troca_para_modo_orientativo_passam_por_ref": "Reduções valem imediatamente. Aumentos, desativação ou troca para modo orientativo passam por reflexão e não podem ser confirmados durante uma sessão.",
    "legenda_ic_regras_pausas_salvar_compromisso": "Salvar compromisso",
    "legenda_ic_regras_pausas_5_min": "5 min",
    "legenda_ic_regras_pausas_15_min": "15 min",
    "legenda_ic_regras_pausas_1_h": "1 h",
    "legenda_ic_regras_pausas_24_h": "24 h",
    "legenda_ic_regras_pausas_7_dias": "7 dias",
    "legenda_ic_regras_pausas_30_dias": "30 dias",
    "legenda_ic_regras_pausas_sua_pausa_protege_o_planejamento": "Sua pausa protege o planejamento",
    "legenda_ic_regras_pausas_durante_a_pausa_lembretes_de_inicio_ficam_suprimidos_a_acao_nao_apaga_historicos": "Durante a pausa, lembretes de início ficam suprimidos. A ação não apaga históricos.",
    "legenda_ic_regras_pausas_periodo_personalizado": "Período personalizado",
    "legenda_ic_regras_pausas_voltar": "Voltar",
    "legenda_ic_regras_pausas_duracao_da_pausa_em_minutos": "Duração da pausa em minutos",
    "legenda_ic_regras_pausas_entre_5_minutos_e_365_dias_a_pausa_comeca_imediatamente": "Entre 5 minutos e 365 dias. A pausa começa imediatamente.",
    "legenda_ic_regras_pausas_acao_protetiva": "Ação protetiva",
    "legenda_ic_regras_pausas_a_sessao_global_ativa_sera_encerrada_e_novos_planejamentos_ficarao_bloqueados_durante_o_periodo": "A sessão global ativa será encerrada e novos planejamentos ficarão bloqueados durante o período escolhido.",
    "legenda_ic_regras_pausas_ativar_pausa": "Ativar pausa",
    "legenda_ic_regras_pausas_escolha_uma_duracao_entre_5_minutos_e_365_dias": "Escolha uma duração entre 5 minutos e 365 dias.",
    "legenda_ic_regras_pausas_pausa_de_protecao_ativada": "Pausa de proteção ativada.",
    "legenda_ic_regras_pausas_nao_foi_possivel_ativar_a_pausa": "Não foi possível ativar a pausa.",
    "legenda_ic_regras_pausas_regra_pessoal": "Regra pessoal",
    "legenda_ic_regras_pausas_novo_compromisso": "Novo compromisso",
    "legenda_ic_regras_pausas_defina_seu_compromisso": "Defina seu compromisso",
    "legenda_ic_regras_pausas_nao_foi_possivel_atualizar_a_alteracao": "Não foi possível atualizar a alteração.",
    "legenda_ic_regras_pausas_protecao_imediata": "Proteção imediata",
    "legenda_ic_regras_pausas_quanto_tempo_voce_precisa": "Quanto tempo você precisa?",
    "legenda_ic_regras_pausas_defina_a_duracao": "Defina a duração",
    "legenda_ic_regras_pausas_selecione_uma_moeda_validada": "Selecione uma moeda validada.",
    "legenda_ic_regras_pausas_informe_um_limite_valido": "Informe um limite válido.",
    "legenda_ic_regras_pausas_alteracao_registrada_para_reflexao_a_regra_atual_continua_valendo": "Alteração registrada para reflexão. A regra atual continua valendo.",
    "legenda_ic_regras_pausas_compromisso_aplicado": "Compromisso aplicado.",
    "legenda_ic_regras_pausas_nao_foi_possivel_salvar_a_regra": "Não foi possível salvar a regra."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasRegrasPausas);
  function legendaRegrasPausas(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasRegrasPausas[chave]; }

  IC.Screens["regras-pausas"] = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, editing: null, saving: false, pendingSave: null };
    function catalog() { return Core.normalizeArray((state.data || {}).rule_catalog); }
    function definition(type) { return catalog().find(function (item) { return item.type === type; }); }
    function currencies() { var bootstrap = deps.store.getState().bootstrap; return bootstrap && bootstrap.data || {}; }
    function ruleTitle(rule) { var item = definition(rule.type); return item ? item.title : rule.type; }
    function ruleValue(rule) { var config = rule.config || {}; return config.value_units != null ? Core.formatMoney(config.value_units, config.currency, config.decimal_places) : Core.safeText(config.value) + " " + ((definition(rule.type) || {}).unit_label || ""); }
    function pendingChange(rule) {
      var pending = rule.pending_change;
      if (!pending || ["cancelada", "confirmada", "expirada"].indexOf(pending.status) >= 0) return "";
      return UI.banner(legendaRegrasPausas("legenda_ic_regras_pausas_alteracao_em_reflexao"), legendaRegrasPausas("legenda_ic_regras_pausas_a_regra_atual_continua_valendo_confirmacao_disponivel_a_partir_de") + Core.formatDateTime(pending.available_at) + ".", "attention") + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_confirmar_alteracao"), { action: "confirm-rule-change", value: pending.change_id }) + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_desistir_da_alteracao"), { action: "cancel-rule-change", value: pending.change_id, kind: "quiet" });
    }

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try { var result = await deps.api.rpc("ic_regras_contexto_rpc", {}, { key: "rules:context" }); state.status = "ready"; state.data = result.data || {}; state.error = null; }
      catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function content() {
      var data = state.data || {}, rules = Core.normalizeArray(data.rules || data.regras), pause = data.pause || data.pausa;
      var pauseHtml = pause && (pause.active || pause.ativa) ? UI.banner(legendaRegrasPausas("legenda_ic_regras_pausas_pausa_ativa"), legendaRegrasPausas("legenda_ic_regras_pausas_voce_decidiu_proteger_seu_planejamento_ate") + Core.formatDateTime(pause.ends_at || pause.termina_em) + legendaRegrasPausas("legenda_ic_regras_pausas_lembretes_de_inicio_permanecem_suprimidos"), "control") : UI.banner(legendaRegrasPausas("legenda_ic_regras_pausas_nenhuma_pausa_ativa"), legendaRegrasPausas("legenda_ic_regras_pausas_voce_pode_criar_uma_pausa_a_qualquer_momento_isso_nao_apaga_seu_historico"), "neutral");
      var rulesHtml = rules.length ? '<div class="ic-list">' + rules.map(function (rule) { return '<article class="ic-card"><div class="ic-rule-row"><div><h4>' + Core.escapeHtml(ruleTitle(rule)) + '</h4><p>' + Core.escapeHtml((rule.active ? legendaRegrasPausas("legenda_ic_regras_pausas_ativa") : legendaRegrasPausas("legenda_ic_regras_pausas_inativa")) + " · " + rule.mode) + '</p></div><strong class="ic-rule-value">' + Core.escapeHtml(ruleValue(rule)) + '</strong></div><div class="ic-card__footer">' + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_editar_compromisso"), { action: "edit-rule", value: rule.rule_id }) + '</div>' + pendingChange(rule) + '</article>'; }).join("") + '</div>' : UI.state({ type: "empty", title: legendaRegrasPausas("legenda_ic_regras_pausas_nenhuma_regra_pessoal_criada"), message: legendaRegrasPausas("legenda_ic_regras_pausas_defina_limites_antes_da_sessao_reducoes_entram_em_vigor_imediatamente_aumentos_exigem_reflexao"), retry: false });
      var emergency = deps.featureEnabled("ic_emergency_enabled") ? ('<section class="ic-card ic-emergency"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_preciso_parar")) + '</h3><p>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_ative_uma_pausa_suprima_lembretes_de_inicio_e_proteja_seu_acesso_interno")) + '</p></div></div>') + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_escolher_uma_pausa_agora"), { action: "emergency", icon: "shield", kind: "danger", block: true }) + '</section>' : "";
      if (!rules.length && catalog().length) rulesHtml = ('<p>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_escolha_um_compromisso_e_defina_seu_limite_nada_e_ativado_sem_sua_confirmacao")) + '</p><div class="ic-quick-actions">') + catalog().map(function (item) { return UI.button(item.title, { action: "rule-template", value: item.type, icon: "shield" }); }).join("") + '</div>';
      return pauseHtml + ('<section><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_minhas_regras")) + '</h3><p>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_tempo_perda_intervalo_exposicao_e_mudancas_de_comportamento")) + '</p></div>') + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_nova_regra"), { action: "new-rule" }) + '</div>' + rulesHtml + ('</section><section class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_modo_de_controle")) + '</h3><p>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_o_modo_firme_precisa_ser_escolhido_antes_da_sessao")) + '</p></div></div><div class="ic-list">') + UI.listRow(legendaRegrasPausas("legenda_ic_regras_pausas_orientativo"), legendaRegrasPausas("legenda_ic_regras_pausas_alerta_registra_e_mantem_a_decisao_com_voce"), data.control_mode === "orientativo" || data.modo_controle === "orientativo" ? legendaRegrasPausas("legenda_ic_regras_pausas_ativo") : "") + UI.listRow(legendaRegrasPausas("legenda_ic_regras_pausas_firme"), legendaRegrasPausas("legenda_ic_regras_pausas_fecha_a_aba_interna_encerra_a_sessao_e_inicia_pausa_ao_atingir_o_compromisso"), data.control_mode === "firme" || data.modo_controle === "firme" ? legendaRegrasPausas("legenda_ic_regras_pausas_ativo") : "") + '</div></section>' + emergency;
    }

    function render() {
      var html = UI.sectionHeader(legendaRegrasPausas("legenda_ic_regras_pausas_regras_e_pausas"), legendaRegrasPausas("legenda_ic_regras_pausas_compromissos_pessoais_configurados_antes_da_decisao_de_jogar")) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }

    function renderInto() { deps.container.innerHTML = render(); }

    function ruleForm(type) {
      var editing = state.editing || {}, config = editing.config || {};
      var options = state.editing ? catalog().filter(function (entry) { return entry.type === editing.type; }) : catalog();
      var item = definition(type || editing.type) || options[0];
      if (!item) return UI.state({ type: "unavailable", message: legendaRegrasPausas("legenda_ic_regras_pausas_o_catalogo_seguro_de_regras_esta_indisponivel"), retry: false });
      var kind = item.value_kind, value = config.value == null ? "" : String(config.value), field;
      if (kind === "money") {
        var places = Core.decimalPlacesOf(config.decimal_places, null), units = Core.integerUnits(config.value_units);
        if (units != null && places != null) { var digits = units.padStart(places + 1, "0"); value = places ? digits.slice(0, -places) + "," + digits.slice(-places) : digits; }
        field = ('<div class="ic-field"><label for="ic-rule-currency">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_moeda")) + '</label><select id="ic-rule-currency" name="currency" required>') + Core.currencyOptions(currencies(), config.currency || "") + ('</select></div><div class="ic-field"><label for="ic-rule-value">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_valor_na_moeda_escolhida")) + '</label><input id="ic-rule-value" name="value" inputmode="decimal" value="') + Core.escapeHtml(value) + '" required></div>';
      } else if (kind === "period") {
        var period = String(config.value || "-").split("-");
        field = ('<div class="ic-field"><label for="ic-rule-period-start">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_nao_jogar_a_partir_de")) + '</label><input id="ic-rule-period-start" type="time" name="period_start" value="') + Core.escapeHtml(period[0] || "") + ('" required></div><div class="ic-field"><label for="ic-rule-period-end">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_ate")) + '</label><input id="ic-rule-period-end" type="time" name="period_end" value="') + Core.escapeHtml(period[1] || "") + ('" required></div><div class="ic-field"><label for="ic-rule-timezone">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_fuso_horario")) + '</label><input id="ic-rule-timezone" name="timezone" value="') + Core.escapeHtml(config.timezone || (state.data || {}).timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) + '" required></div>';
      } else {
        field = '<div class="ic-field"><label for="ic-rule-value">' + Core.escapeHtml(item.unit_label || legendaRegrasPausas("legenda_ic_regras_pausas_limite")) + '</label><input id="ic-rule-value" name="value" type="number" step="' + (kind === "percent" || kind === "multiplier" ? "any" : "1") + '" value="' + Core.escapeHtml(value) + '" required></div>';
      }
      if (kind === "multiplier") field += ('<div class="ic-field"><label for="ic-rule-pause">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_pausa_apos_o_ganho_em_segundos")) + '</label><input id="ic-rule-pause" name="pause_seconds" type="number" min="1" max="86400" value="') + Core.escapeHtml(config.pause_seconds || 60) + '" required></div>';
      return ('<form class="ic-form" id="icRuleForm"><div class="ic-field"><label for="ic-rule-type">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_regra")) + '</label><select id="ic-rule-type" name="type" required>') + options.map(function (option) { return '<option value="' + Core.escapeHtml(option.type) + '"' + (option.type === item.type ? " selected" : "") + '>' + Core.escapeHtml(option.title) + '</option>'; }).join("") + '</select></div>' + field + ('<div class="ic-field"><label for="ic-rule-mode">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_modo")) + '</label><select id="ic-rule-mode" name="mode"><option value="orientativo">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_orientativo")) + '</option><option value="firme"') + (editing.mode === "firme" ? " selected" : "") + ('>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_firme")) + '</option></select></div><div class="ic-field"><label><input type="checkbox" name="active"') + (editing.active !== false ? " checked" : "") + ('>' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_manter_regra_ativa")) + '</label></div><div class="ic-field"><label for="ic-rule-message">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_mensagem_pessoal")) + '</label><textarea id="ic-rule-message" name="message" maxlength="500">') + Core.escapeHtml(editing.personal_message || "") + '</textarea></div>' + UI.banner(legendaRegrasPausas("legenda_ic_regras_pausas_protecao_contra_alteracao_impulsiva"), legendaRegrasPausas("legenda_ic_regras_pausas_reducoes_valem_imediatamente_aumentos_desativacao_ou_troca_para_modo_orientativo_passam_por_ref"), "attention") + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_salvar_compromisso"), { type: "submit", kind: "primary", block: true }) + '</form>';
    }

    function emergencyOptions() {
      var options = [[5, legendaRegrasPausas("legenda_ic_regras_pausas_5_min")], [15, legendaRegrasPausas("legenda_ic_regras_pausas_15_min")], [60, legendaRegrasPausas("legenda_ic_regras_pausas_1_h")], [1440, legendaRegrasPausas("legenda_ic_regras_pausas_24_h")], [10080, legendaRegrasPausas("legenda_ic_regras_pausas_7_dias")], [43200, legendaRegrasPausas("legenda_ic_regras_pausas_30_dias")]];
      return UI.banner(legendaRegrasPausas("legenda_ic_regras_pausas_sua_pausa_protege_o_planejamento"), legendaRegrasPausas("legenda_ic_regras_pausas_durante_a_pausa_lembretes_de_inicio_ficam_suprimidos_a_acao_nao_apaga_historicos"), "limit") + '<div class="ic-choice-grid">' + options.map(function (item) { return UI.button(item[1], { action: "confirm-emergency", value: item[0], kind: item[0] >= 1440 ? "danger" : "" }); }).join("") + '</div><div class="ic-card__footer">' + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_periodo_personalizado"), { action: "custom-emergency" }) + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_voltar"), { action: "close-sheet", kind: "quiet" }) + '</div>';
    }

    function customEmergencyForm() {
      return ('<form class="ic-form" id="icCustomEmergencyForm"><div class="ic-field"><label for="ic-emergency-duration">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_duracao_da_pausa_em_minutos")) + '</label><input id="ic-emergency-duration" name="duration_minutes" type="number" min="5" max="525600" step="1" inputmode="numeric" required aria-describedby="ic-emergency-duration-help"><small id="ic-emergency-duration-help">' + Core.escapeHtml(legendaRegrasPausas("legenda_ic_regras_pausas_entre_5_minutos_e_365_dias_a_pausa_comeca_imediatamente")) + '</small></div>') + UI.banner(legendaRegrasPausas("legenda_ic_regras_pausas_acao_protetiva"), legendaRegrasPausas("legenda_ic_regras_pausas_a_sessao_global_ativa_sera_encerrada_e_novos_planejamentos_ficarao_bloqueados_durante_o_periodo"), "limit") + '<div class="ic-card__footer">' + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_ativar_pausa"), { type: "submit", kind: "danger" }) + UI.button(legendaRegrasPausas("legenda_ic_regras_pausas_voltar"), { action: "emergency", kind: "quiet" }) + '</div></form>';
    }

    async function activateEmergency(minutes) {
      var duration = Core.finiteInteger(minutes, 0);
      if (duration < 5 || duration > 525600) {
        UI.toast(legendaRegrasPausas("legenda_ic_regras_pausas_escolha_uma_duracao_entre_5_minutos_e_365_dias"));
        return;
      }
      try {
        await deps.api.rpc("ic_emergencia_acionar_rpc", { p_duracao_minutos: duration }, { key: "rules:emergency" });
        IC.Bridge.post("emergency_action", { action: "pause", duration_minutes: duration, carga: deps.route().loadGeneration || null });
        UI.closeSheet(); UI.toast(legendaRegrasPausas("legenda_ic_regras_pausas_pausa_de_protecao_ativada")); state.status = "idle"; await load(true);
      } catch (error) { UI.toast(error.message || legendaRegrasPausas("legenda_ic_regras_pausas_nao_foi_possivel_ativar_a_pausa")); }
    }

    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "new-rule") { state.editing = null; UI.openSheet({ eyebrow: legendaRegrasPausas("legenda_ic_regras_pausas_regra_pessoal"), title: legendaRegrasPausas("legenda_ic_regras_pausas_novo_compromisso"), html: ruleForm() }); }
      if (action === "rule-template" && definition(value)) { state.editing = null; UI.openSheet({ eyebrow: legendaRegrasPausas("legenda_ic_regras_pausas_regra_pessoal"), title: legendaRegrasPausas("legenda_ic_regras_pausas_defina_seu_compromisso"), html: ruleForm(value) }); }
      if (action === "edit-rule") { state.editing = Core.normalizeArray((state.data || {}).rules).find(function (rule) { return String(rule.rule_id) === String(value); }); if (state.editing) UI.openSheet({ eyebrow: legendaRegrasPausas("legenda_ic_regras_pausas_regra_pessoal"), title: legendaRegrasPausas("legenda_ic_regras_pausas_editar_compromisso"), html: ruleForm() }); }
      if (["confirm-rule-change", "cancel-rule-change"].indexOf(action) >= 0 && Core.validUuid(value)) {
        try { await deps.api.rpc(action === "confirm-rule-change" ? "ic_regra_alteracao_confirmar_rpc" : "ic_regra_alteracao_cancelar_rpc", { p_id_alteracao: value }, { key: "rules:pending" }); state.status = "idle"; await load(true); }
        catch (error) { UI.toast(error.message || legendaRegrasPausas("legenda_ic_regras_pausas_nao_foi_possivel_atualizar_a_alteracao")); }
      }
      if (action === "emergency" && deps.featureEnabled("ic_emergency_enabled")) UI.openSheet({ eyebrow: legendaRegrasPausas("legenda_ic_regras_pausas_protecao_imediata"), title: legendaRegrasPausas("legenda_ic_regras_pausas_quanto_tempo_voce_precisa"), html: emergencyOptions() });
      if (action === "close-sheet") UI.closeSheet();
      if (action === "custom-emergency" && deps.featureEnabled("ic_emergency_enabled")) UI.openSheet({ eyebrow: legendaRegrasPausas("legenda_ic_regras_pausas_protecao_imediata"), title: legendaRegrasPausas("legenda_ic_regras_pausas_defina_a_duracao"), html: customEmergencyForm() });
      if (action === "confirm-emergency" && deps.featureEnabled("ic_emergency_enabled")) return activateEmergency(value);
    }

    async function handleSubmit(form) {
      if (form.id === "icCustomEmergencyForm") {
        var emergencyValues = new FormData(form);
        return activateEmergency(emergencyValues.get("duration_minutes"));
      }
      if (form.id !== "icRuleForm" || state.saving) return;
      var values = new FormData(form);
      var item = definition(state.editing ? state.editing.type : String(values.get("type")));
      if (!item) return;
      var payload = { type: item.type, value: String(values.get("value") || "").trim(), mode: String(values.get("mode")), active: values.get("active") != null, personal_message: String(values.get("message") || "").trim() || null };
      if (state.editing) payload.rule_id = state.editing.rule_id;
      if (item.value_kind === "money") {
        var currency = Core.currencyCatalog(currencies()).find(function (entry) { return entry.code === values.get("currency"); });
        if (!currency) { UI.toast(legendaRegrasPausas("legenda_ic_regras_pausas_selecione_uma_moeda_validada")); return; }
        payload.value_units = Core.parseMoneyToUnitsText(payload.value, currency.decimal_places);
        if (Core.unitsSign(payload.value_units) <= 0) { UI.toast(legendaRegrasPausas("legenda_ic_regras_pausas_informe_um_limite_valido")); return; }
        payload.currency = currency.code; payload.decimal_places = currency.decimal_places; delete payload.value;
      }
      if (item.value_kind === "period") { payload.value = String(values.get("period_start") || "") + "-" + String(values.get("period_end") || ""); payload.timezone = String(values.get("timezone") || ""); }
      if (item.value_kind === "multiplier") payload.pause_seconds = Core.finiteInteger(values.get("pause_seconds"), 0);
      state.saving = true;
      try {
        var fingerprint = JSON.stringify(payload);
        if (!state.pendingSave || state.pendingSave.fingerprint !== fingerprint) state.pendingSave = { fingerprint: fingerprint, id: root.crypto.randomUUID() };
        payload.client_request_id = state.pendingSave.id;
        var result = await deps.api.rpc("ic_regra_salvar_rpc", { p_regra: payload }, { key: "rules:save" });
        state.pendingSave = null; UI.closeSheet(); UI.toast(result.data && result.data.pending_change ? legendaRegrasPausas("legenda_ic_regras_pausas_alteracao_registrada_para_reflexao_a_regra_atual_continua_valendo") : legendaRegrasPausas("legenda_ic_regras_pausas_compromisso_aplicado")); state.status = "idle"; await load(true);
      }
      catch (error) { UI.toast(error.message || legendaRegrasPausas("legenda_ic_regras_pausas_nao_foi_possivel_salvar_a_regra")); }
      finally { state.saving = false; }
    }
    function handleChange(field) { if (field.id === "ic-rule-type" && !state.editing) { UI.openSheet({ eyebrow: legendaRegrasPausas("legenda_ic_regras_pausas_regra_pessoal"), title: legendaRegrasPausas("legenda_ic_regras_pausas_defina_seu_compromisso"), html: ruleForm(field.value) }); } }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, handleChange: handleChange };
  };
}(window));
