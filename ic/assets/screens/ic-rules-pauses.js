(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

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
      return UI.banner("Alteração em reflexão", "A regra atual continua valendo. Confirmação disponível a partir de " + Core.formatDateTime(pending.available_at) + ".", "attention") + UI.button("Confirmar alteração", { action: "confirm-rule-change", value: pending.change_id }) + UI.button("Desistir da alteração", { action: "cancel-rule-change", value: pending.change_id, kind: "quiet" });
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
      var pauseHtml = pause && (pause.active || pause.ativa) ? UI.banner("Pausa ativa", "Você decidiu proteger seu planejamento até " + Core.formatDateTime(pause.ends_at || pause.termina_em) + ". Lembretes de início permanecem suprimidos.", "control") : UI.banner("Nenhuma pausa ativa", "Você pode criar uma pausa a qualquer momento. Isso não apaga seu histórico.", "neutral");
      var rulesHtml = rules.length ? '<div class="ic-list">' + rules.map(function (rule) { return '<article class="ic-card"><div class="ic-rule-row"><div><h4>' + Core.escapeHtml(ruleTitle(rule)) + '</h4><p>' + Core.escapeHtml((rule.active ? "Ativa" : "Inativa") + " · " + rule.mode) + '</p></div><strong class="ic-rule-value">' + Core.escapeHtml(ruleValue(rule)) + '</strong></div><div class="ic-card__footer">' + UI.button("Editar compromisso", { action: "edit-rule", value: rule.rule_id }) + '</div>' + pendingChange(rule) + '</article>'; }).join("") + '</div>' : UI.state({ type: "empty", title: "Nenhuma regra pessoal criada", message: "Defina limites antes da sessão. Reduções entram em vigor imediatamente; aumentos exigem reflexão.", retry: false });
      var emergency = deps.featureEnabled("ic_emergency_enabled") ? '<section class="ic-card ic-emergency"><div class="ic-card__header"><div><h3>Preciso parar</h3><p>Ative uma pausa, suprima lembretes de início e proteja seu acesso interno.</p></div></div>' + UI.button("Escolher uma pausa agora", { action: "emergency", icon: "shield", kind: "danger", block: true }) + '</section>' : "";
      return pauseHtml + '<section><div class="ic-card__header"><div><h3>Minhas regras</h3><p>Tempo, perda, intervalo, exposição e mudanças de comportamento.</p></div>' + UI.button("Nova regra", { action: "new-rule" }) + '</div>' + rulesHtml + '</section><section class="ic-card"><div class="ic-card__header"><div><h3>Modo de controle</h3><p>O modo firme precisa ser escolhido antes da sessão.</p></div></div><div class="ic-list">' + UI.listRow("Orientativo", "Alerta, registra e mantém a decisão com você.", data.control_mode === "orientativo" || data.modo_controle === "orientativo" ? "Ativo" : "") + UI.listRow("Firme", "Fecha a aba interna, encerra a sessão e inicia pausa ao atingir o compromisso.", data.control_mode === "firme" || data.modo_controle === "firme" ? "Ativo" : "") + '</div></section>' + emergency;
    }

    function render() {
      var html = UI.sectionHeader("Regras e Pausas", "Compromissos pessoais configurados antes da decisão de jogar.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">';
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
      if (!item) return UI.state({ type: "unavailable", message: "O catálogo seguro de regras está indisponível.", retry: false });
      var kind = item.value_kind, value = config.value == null ? "" : String(config.value), field;
      if (kind === "money") {
        var places = Core.decimalPlacesOf(config.decimal_places, null), units = Core.integerUnits(config.value_units);
        if (units != null && places != null) { var digits = units.padStart(places + 1, "0"); value = places ? digits.slice(0, -places) + "," + digits.slice(-places) : digits; }
        field = '<div class="ic-field"><label for="ic-rule-currency">Moeda</label><select id="ic-rule-currency" name="currency" required>' + Core.currencyOptions(currencies(), config.currency || "") + '</select></div><div class="ic-field"><label for="ic-rule-value">Valor na moeda escolhida</label><input id="ic-rule-value" name="value" inputmode="decimal" value="' + Core.escapeHtml(value) + '" required></div>';
      } else if (kind === "period") {
        var period = String(config.value || "-").split("-");
        field = '<div class="ic-field"><label for="ic-rule-period-start">Não jogar a partir de</label><input id="ic-rule-period-start" type="time" name="period_start" value="' + Core.escapeHtml(period[0] || "") + '" required></div><div class="ic-field"><label for="ic-rule-period-end">Até</label><input id="ic-rule-period-end" type="time" name="period_end" value="' + Core.escapeHtml(period[1] || "") + '" required></div><div class="ic-field"><label for="ic-rule-timezone">Fuso horário</label><input id="ic-rule-timezone" name="timezone" value="' + Core.escapeHtml(config.timezone || (state.data || {}).timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) + '" required></div>';
      } else {
        field = '<div class="ic-field"><label for="ic-rule-value">' + Core.escapeHtml(item.unit_label || "Limite") + '</label><input id="ic-rule-value" name="value" type="number" step="' + (kind === "percent" || kind === "multiplier" ? "any" : "1") + '" value="' + Core.escapeHtml(value) + '" required></div>';
      }
      if (kind === "multiplier") field += '<div class="ic-field"><label for="ic-rule-pause">Pausa após o ganho, em segundos</label><input id="ic-rule-pause" name="pause_seconds" type="number" min="1" max="86400" value="' + Core.escapeHtml(config.pause_seconds || 60) + '" required></div>';
      return '<form class="ic-form" id="icRuleForm"><div class="ic-field"><label for="ic-rule-type">Regra</label><select id="ic-rule-type" name="type" required>' + options.map(function (option) { return '<option value="' + Core.escapeHtml(option.type) + '"' + (option.type === item.type ? " selected" : "") + '>' + Core.escapeHtml(option.title) + '</option>'; }).join("") + '</select></div>' + field + '<div class="ic-field"><label for="ic-rule-mode">Modo</label><select id="ic-rule-mode" name="mode"><option value="orientativo">Orientativo</option><option value="firme"' + (editing.mode === "firme" ? " selected" : "") + '>Firme</option></select></div><div class="ic-field"><label><input type="checkbox" name="active"' + (editing.active !== false ? " checked" : "") + '> Manter regra ativa</label></div><div class="ic-field"><label for="ic-rule-message">Mensagem pessoal</label><textarea id="ic-rule-message" name="message" maxlength="500">' + Core.escapeHtml(editing.personal_message || "") + '</textarea></div>' + UI.banner("Proteção contra alteração impulsiva", "Reduções valem imediatamente. Aumentos, desativação ou troca para modo orientativo passam por reflexão e não podem ser confirmados durante uma sessão.", "attention") + UI.button("Salvar compromisso", { type: "submit", kind: "primary", block: true }) + '</form>';
    }

    function emergencyOptions() {
      var options = [[5, "5 min"], [15, "15 min"], [60, "1 h"], [1440, "24 h"], [10080, "7 dias"], [43200, "30 dias"]];
      return UI.banner("Sua pausa protege o planejamento", "Durante a pausa, lembretes de início ficam suprimidos. A ação não apaga históricos.", "limit") + '<div class="ic-choice-grid">' + options.map(function (item) { return UI.button(item[1], { action: "confirm-emergency", value: item[0], kind: item[0] >= 1440 ? "danger" : "" }); }).join("") + '</div><div class="ic-card__footer">' + UI.button("Período personalizado", { action: "custom-emergency" }) + UI.button("Voltar", { action: "close-sheet", kind: "quiet" }) + '</div>';
    }

    function customEmergencyForm() {
      return '<form class="ic-form" id="icCustomEmergencyForm"><div class="ic-field"><label for="ic-emergency-duration">Duração da pausa em minutos</label><input id="ic-emergency-duration" name="duration_minutes" type="number" min="5" max="525600" step="1" inputmode="numeric" required aria-describedby="ic-emergency-duration-help"><small id="ic-emergency-duration-help">Entre 5 minutos e 365 dias. A pausa começa imediatamente.</small></div>' + UI.banner("Ação protetiva", "A sessão global ativa será encerrada e novos planejamentos ficarão bloqueados durante o período escolhido.", "limit") + '<div class="ic-card__footer">' + UI.button("Ativar pausa", { type: "submit", kind: "danger" }) + UI.button("Voltar", { action: "emergency", kind: "quiet" }) + '</div></form>';
    }

    async function activateEmergency(minutes) {
      var duration = Core.finiteInteger(minutes, 0);
      if (duration < 5 || duration > 525600) {
        UI.toast("Escolha uma duração entre 5 minutos e 365 dias.");
        return;
      }
      try {
        await deps.api.rpc("ic_emergencia_acionar_rpc", { p_duracao_minutos: duration }, { key: "rules:emergency" });
        IC.Bridge.post("emergency_action", { action: "pause", duration_minutes: duration, carga: deps.route().loadGeneration || null });
        UI.closeSheet(); UI.toast("Pausa de proteção ativada."); state.status = "idle"; await load(true);
      } catch (error) { UI.toast(error.message || "Não foi possível ativar a pausa."); }
    }

    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (action === "new-rule") { state.editing = null; UI.openSheet({ eyebrow: "Regra pessoal", title: "Novo compromisso", html: ruleForm() }); }
      if (action === "edit-rule") { state.editing = Core.normalizeArray((state.data || {}).rules).find(function (rule) { return String(rule.rule_id) === String(value); }); if (state.editing) UI.openSheet({ eyebrow: "Regra pessoal", title: "Editar compromisso", html: ruleForm() }); }
      if (["confirm-rule-change", "cancel-rule-change"].indexOf(action) >= 0 && Core.validUuid(value)) {
        try { await deps.api.rpc(action === "confirm-rule-change" ? "ic_regra_alteracao_confirmar_rpc" : "ic_regra_alteracao_cancelar_rpc", { p_id_alteracao: value }, { key: "rules:pending" }); state.status = "idle"; await load(true); }
        catch (error) { UI.toast(error.message || "Não foi possível atualizar a alteração."); }
      }
      if (action === "emergency" && deps.featureEnabled("ic_emergency_enabled")) UI.openSheet({ eyebrow: "Proteção imediata", title: "Quanto tempo você precisa?", html: emergencyOptions() });
      if (action === "close-sheet") UI.closeSheet();
      if (action === "custom-emergency" && deps.featureEnabled("ic_emergency_enabled")) UI.openSheet({ eyebrow: "Proteção imediata", title: "Defina a duração", html: customEmergencyForm() });
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
        if (!currency) { UI.toast("Selecione uma moeda validada."); return; }
        payload.value_units = Core.parseMoneyToUnitsText(payload.value, currency.decimal_places);
        if (Core.unitsSign(payload.value_units) <= 0) { UI.toast("Informe um limite válido."); return; }
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
        state.pendingSave = null; UI.closeSheet(); UI.toast(result.data && result.data.pending_change ? "Alteração registrada para reflexão. A regra atual continua valendo." : "Compromisso aplicado."); state.status = "idle"; await load(true);
      }
      catch (error) { UI.toast(error.message || "Não foi possível salvar a regra."); }
      finally { state.saving = false; }
    }
    function handleChange(field) { if (field.id === "ic-rule-type" && !state.editing) { UI.openSheet({ eyebrow: "Regra pessoal", title: "Defina seu compromisso", html: ruleForm(field.value) }); } }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit, handleChange: handleChange };
  };
}(window));
