(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

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
      var draftDate = start.date;
      var draftTime = start.time || Core.safeText(draft.start_time || draft.hora_inicio, "").slice(0, 5);
      var duration = draft.duration_minutes || draft.duracao_minutos || (draft.duracao_limite_segundos ? Math.round(Number(draft.duracao_limite_segundos) / 60) : "");
      var loss = unitsInput(Core.unitsFrom(draft, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), Core.decimalPlacesOf(draft, null));
      var offset = draft.reminder_offset_minutes;
      if (offset === null || typeof offset === "undefined") offset = draft.lembrete_antecedencia_minutos;
      if (offset === null || typeof offset === "undefined") offset = 10;
      var durations = [[15, "15 minutos"], [30, "30 minutos"], [45, "45 minutos"], [60, "60 minutos"], [90, "90 minutos"]];
      var contextBanner = editing ? UI.banner("Reagendando Sessão Planejada", "Confirme novamente data, duração, limite e lembrete. A alteração cria nova revisão auditável.", "attention") : Object.keys(historicalDraft).length ? UI.banner("Contexto histórico carregado", "A faixa e o contexto foram preenchidos. Data, duração, limite e lembrete continuam exigindo sua confirmação.", "neutral") : "";
      var actions = UI.button(state.saving ? "Salvando…" : editing ? "Salvar reagendamento" : "Criar Sessão Planejada", { type: "submit", kind: "primary", block: true, disabled: state.saving });
      if (editing) actions += UI.button("Cancelar edição", { action: "cancel-reschedule", kind: "quiet", disabled: state.saving });
      return '<form class="ic-form" id="icPlanningForm" novalidate>' + contextBanner + '<div class="ic-form-section"><h3>Defina seu compromisso</h3><div class="ic-form-grid"><div class="ic-field"><label for="ic-plan-date">Data *</label><input id="ic-plan-date" name="date" type="date" min="' + today + '" value="' + Core.escapeHtml(draftDate) + '" required></div><div class="ic-field"><label for="ic-plan-time">Horário *</label><input id="ic-plan-time" name="time" type="time" value="' + Core.escapeHtml(draftTime) + '" required></div><div class="ic-field"><label for="ic-plan-duration">Duração máxima *</label><select id="ic-plan-duration" name="duration_minutes" required><option value="">Selecione</option>' + durations.map(function (item) { return '<option value="' + item[0] + '"' + selected(duration, item[0]) + '>' + item[1] + '</option>'; }).join("") + '</select></div><div class="ic-field"><label for="ic-plan-limit">Limite máximo de perda *</label><input id="ic-plan-limit" name="loss_limit" inputmode="decimal" placeholder="Valor na moeda selecionada" value="' + Core.escapeHtml(loss) + '" required></div><div class="ic-field"><label for="ic-plan-currency">Moeda *</label><select id="ic-plan-currency" name="currency" required>' + Core.currencyOptions(currencyContext(), draft.currency || draft.moeda || "", "Selecione a moeda") + '</select></div></div></div>' + reminderHtml(offset) + optionalHtml(draft) + (Object.keys(state.errors).length ? '<p class="ic-form-error" role="alert">Revise os campos obrigatórios destacados antes de continuar.</p>' : '') + '<div class="ic-page-stack">' + actions + '</div><p class="ic-required-note">Abrir o lembrete não inicia a sessão. Somente o botão “Iniciar sessão” ativa o controle.</p></form>';
    }

    function reminderHtml(selectedOffset) {
      var offsets = [{ v: 0, l: "No horário" }, { v: 5, l: "5 min antes" }, { v: 10, l: "10 min antes" }, { v: 15, l: "15 min antes" }, { v: 30, l: "30 min antes" }];
      return '<div class="ic-form-section"><fieldset class="ic-fieldset"><legend>Momento do lembrete *</legend><div class="ic-choice-grid">' + offsets.map(function (item) { return '<div class="ic-choice"><input type="radio" id="ic-reminder-' + item.v + '" name="reminder_offset_minutes" value="' + item.v + '"' + (Number(selectedOffset) === item.v ? " checked" : "") + ' required><label for="ic-reminder-' + item.v + '">' + item.l + '</label></div>'; }).join("") + '</div><p class="ic-required-note">Toda Sessão Planejada possui lembrete automático. O canal pode ser local, remoto ou híbrido.</p></fieldset></div>';
    }

    function optionalHtml(draft) {
      draft = draft || {};
      var days = [[1, "Segunda"], [2, "Terça"], [3, "Quarta"], [4, "Quinta"], [5, "Sexta"], [6, "Sábado"], [7, "Domingo"]];
      return '<details class="ic-form-section"' + (Object.keys(draft).length ? " open" : "") + '><summary>Contexto e recorrência</summary><div class="ic-form-grid">' + ["bet", "account", "game"].map(function (name, index) { return '<div class="ic-field"><label for="ic-plan-' + name + '">' + ["Bet", "Conta", "Jogo"][index] + '</label><input id="ic-plan-' + name + '" name="' + name + '" maxlength="100" value="' + Core.escapeHtml(draft[name] || draft[name + "_reference"] || "") + '"></div>'; }).join("") +
        '<div class="ic-field"><label for="ic-plan-mode">Modo</label><select id="ic-plan-mode" name="mode"><option value="orientativo">Orientativo</option><option value="firme">Firme</option></select></div><div class="ic-field"><label for="ic-plan-recurrence">Recorrência</label><select id="ic-plan-recurrence" name="recurrence"><option value="none">Uma ocorrência</option><option value="weekly">Semanal</option><option value="monthly_ordinal">Ordinal mensal</option><option value="custom">Personalizada</option></select></div><div class="ic-field"><label for="ic-plan-timezone">Fuso do compromisso</label><input id="ic-plan-timezone" name="timezone" value="' + Core.escapeHtml(draft.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) + '" required></div>' +
        '<div class="ic-field"><label for="ic-plan-weekday">Dia da semana (semanal/mensal)</label><select id="ic-plan-weekday" name="recurrence_weekday"><option value="">Selecione</option>' + days.map(function (day) { return '<option value="' + day[0] + '">' + day[1] + '</option>'; }).join("") + '</select></div><div class="ic-field"><label for="ic-plan-ordinal">Ocorrência no mês</label><select id="ic-plan-ordinal" name="recurrence_ordinal"><option value="">Selecione</option><option value="1">Primeira</option><option value="2">Segunda</option><option value="3">Terceira</option><option value="4">Quarta</option><option value="5">Quinta</option><option value="-1">Última</option></select></div><div class="ic-field"><label for="ic-plan-interval">Personalizada: a cada quantas semanas</label><input id="ic-plan-interval" name="interval_weeks" type="number" min="1" max="52" value="1"></div><fieldset class="ic-fieldset"><legend>Personalizada: dias da semana</legend>' + days.map(function (day) { return '<label><input type="checkbox" name="weekdays" value="' + day[0] + '"> ' + day[1] + '</label>'; }).join("") + '</fieldset><div class="ic-field"><label for="ic-plan-until">Encerrar recorrência em (opcional)</label><input id="ic-plan-until" name="until" type="date"></div><div class="ic-field"><label for="ic-plan-review">Revisão periódica</label><select id="ic-plan-review" name="review"><option value="none">Não definida</option><option value="monthly">Mensal</option><option value="quarterly">Trimestral</option></select></div></div><div class="ic-field"><label for="ic-plan-message">Mensagem pessoal</label><textarea id="ic-plan-message" name="personal_message" maxlength="500"></textarea></div></details>';
    }

    function plansHtml() {
      var data = state.data || {};
      var plans = Core.normalizeArray(data.items || data.itens || data.plans || data.planos);
      if (!plans.length) return UI.state({ type: "empty", title: "Nenhuma sessão planejada", message: "Seus próximos compromissos e planos concluídos aparecerão aqui.", retry: false });
      return '<div class="ic-list">' + plans.map(function (plan) {
        var when = Core.formatDateTime(plan.starts_at || plan.inicio_em);
        var limit = Core.formatMoney(Core.unitsFrom(plan, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), plan.currency || plan.moeda || "", Core.decimalPlacesOf(plan, null));
        var actions = UI.button("Abrir", { action: "open-plan", value: planIdentifier(plan), kind: "quiet" });
        var reminderOffset = plan.reminder_offset_minutes;
        if (reminderOffset === null || typeof reminderOffset === "undefined") reminderOffset = plan.lembrete_antecedencia_minutos;
        return UI.listRow(plan.title || plan.titulo || when, (plan.status || "agendada") + " · " + (plan.duration_minutes || plan.duracao_minutos || "—") + " min · lembrete " + reminderLabel(reminderOffset), limit, actions);
      }).join("") + '</div>';
    }

    function planIdentifier(plan) { return plan && (plan.id || plan.plan_id || plan.id_planejamento || plan.cod_sessao_planejada); }
    function reminderLabel(offset) { var value = Core.validReminderOffset(offset); return value === 0 ? "no horário" : value === null ? "obrigatório" : value + " min antes"; }
    function seriesHtml() {
      if (!state.series.length) return "";
      return '<section class="ic-page-stack"><h3>Compromissos recorrentes</h3>' + state.series.map(function (series) {
        var paused = series.status === "pausada", cancelled = series.status === "cancelada";
        return '<article class="ic-card"><h4>' + Core.escapeHtml(series.title || "Sessão recorrente") + '</h4><p>' + Core.escapeHtml(series.status) + ' · próxima: ' + Core.escapeHtml(Core.formatDateTime(series.next_occurrence_at)) + '</p><div class="ic-card__footer">' + (cancelled ? "" : UI.button("Editar série", { action: "edit-series", value: series.series_id }) + UI.button(paused ? "Retomar série" : "Pausar série", { action: paused ? "resume-series" : "pause-series", value: series.series_id }) + UI.button("Cancelar próximas", { action: "cancel-series", value: series.series_id, kind: "danger" })) + '</div></article>';
      }).join("") + '</section>';
    }

    function render() {
      var html = UI.sectionHeader("Planejar", "Defina antes quanto tempo e quanto está disposto a perder. O aplicativo informa; você decide.");
      if (state.status === "idle" || state.status === "loading") return html + UI.state({ type: "loading", retry: false });
      if (state.status === "error") return html + UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      return html + '<div class="ic-planning-layout"><section class="ic-card ic-card--raised">' + formHtml() + '</section><section><div class="ic-card__header"><div><h3>Seus planos</h3><p>Próximos, concluídos, cancelados e expirados.</p></div></div>' + plansHtml() + seriesHtml() + '</section></div>';
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
          (payload.recurrence.type === "custom" && (!payload.recurrence.weekdays.length || !Number.isInteger(payload.recurrence.interval_weeks) || payload.recurrence.interval_weeks < 1 || payload.recurrence.interval_weeks > 52))) { validation.valid = false; validation.errors.recurrence = "Revise os dias e a frequência da recorrência."; }
      if (!definition) { validation.valid = false; validation.errors.currency = "A moeda precisa estar disponível no catálogo validado."; }
      state.errors = validation.errors;
      if (!validation.valid) {
        var fieldMap = { starts_at: "date", duration_minutes: "duration_minutes", loss_limit_units: "loss_limit", currency: "currency", reminder_offset_minutes: "reminder_offset_minutes" };
        Object.keys(validation.errors).forEach(function (key) { var field = form.elements.namedItem(fieldMap[key]); if (field) { if (field.length && !field.tagName) field = field[0]; field.setAttribute("aria-invalid", "true"); } });
        var existingError = form.querySelector(".ic-form-error");
        if (!existingError) { existingError = document.createElement("p"); existingError.className = "ic-form-error"; existingError.setAttribute("role", "alert"); form.appendChild(existingError); }
        existingError.textContent = "Revise os campos obrigatórios antes de continuar.";
        var firstInvalid = form.querySelector('[aria-invalid="true"]'); if (firstInvalid) firstInvalid.focus();
        UI.announce("Revise os campos obrigatórios da Sessão Planejada."); return;
      }
      state.saving = true;
      var submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Salvando…"; }
      try {
        var editing = state.editingPlan;
        var series = state.editingSeries;
        var planId = editing && Core.finiteInteger(editing.id || editing.plan_id || editing.id_planejamento || editing.cod_sessao_planejada, 0);
        var revision = editing && Core.finiteInteger(editing.revision || editing.revisao || editing.revisao_atual, 0);
        if (editing && (planId <= 0 || revision <= 0)) throw new Error("Não foi possível validar a revisão atual deste planejamento.");
        if (!editing && !series) {
          var fingerprint = JSON.stringify(payload);
          if (!state.pendingCreate || state.pendingCreate.fingerprint !== fingerprint) {
            if (!root.crypto || typeof root.crypto.randomUUID !== "function") throw new Error("Não foi possível gerar uma identificação segura para o planejamento.");
            state.pendingCreate = { fingerprint: fingerprint, id: root.crypto.randomUUID() };
          }
          payload.client_request_id = state.pendingCreate.id;
        }
        var rpc = series ? "ic_serie_planejada_editar_rpc" : editing ? "ic_sessao_reagendar_rpc" : payload.recurrence.type !== "none" ? "ic_serie_planejada_criar_rpc" : "ic_sessao_planejar_rpc";
        var parameters = series ? { p_id_serie: series.series_id, p_revisao_esperada: series.revision, p_planejamento: payload } : editing ? { p_id_planejamento: planId, p_revisao_esperada: revision, p_planejamento: payload } : { p_planejamento: payload };
        var created = await deps.api.rpc(rpc, parameters, { key: "planning:save" });
        syncLocalReminder(created.data, "schedule");
        state.pendingCreate = null;
        UI.toast(editing ? "Sessão Planejada reagendada com novo lembrete automático." : "Sessão Planejada criada com lembrete automático.");
        deps.store.set({ planningDraft: null });
        state.editingPlan = null; state.editingSeries = null; state.status = "idle"; state.saving = false; await load(true);
      } catch (error) { state.saving = false; if (submitButton) { submitButton.disabled = false; submitButton.textContent = state.editingPlan ? "Salvar reagendamento" : "Criar Sessão Planejada"; } UI.toast(error.message || "Não foi possível salvar a Sessão Planejada."); }
    }

    async function handleAction(action, value) {
      if (action === "retry") return load(true);
      if (["edit-series", "pause-series", "resume-series", "cancel-series"].indexOf(action) >= 0) {
        var series = state.series.find(function (item) { return item.series_id === value; });
        if (!series) return;
        if (action === "edit-series") { state.editingSeries = series; state.editingPlan = null; renderInto(); return; }
        UI.openSheet({ eyebrow: "Compromisso recorrente", title: action === "cancel-series" ? "Cancelar próximas ocorrências?" : action === "pause-series" ? "Pausar recorrência?" : "Retomar recorrência?", html: UI.banner("Os fatos já registrados serão preservados", "A alteração afeta somente os próximos compromissos e seus lembretes.", "attention") + UI.button("Confirmar", { action: "confirm-" + action, value: value }) });
      }
      if (["confirm-pause-series", "confirm-resume-series", "confirm-cancel-series"].indexOf(action) >= 0) {
        var selectedSeries = state.series.find(function (item) { return item.series_id === value; });
        if (!selectedSeries) return;
        var seriesRpc = action === "confirm-pause-series" ? "ic_serie_planejada_pausar_rpc" : action === "confirm-resume-series" ? "ic_serie_planejada_retomar_rpc" : "ic_serie_planejada_cancelar_rpc";
        try { await deps.api.rpc(seriesRpc, { p_id_serie: selectedSeries.series_id, p_revisao_esperada: selectedSeries.revision }, { key: "planning:series:mutation" }); UI.closeSheet(); state.status = "idle"; await load(true); }
        catch (error) { UI.toast(error.message || "Não foi possível alterar a recorrência."); }
      }
      if (action === "open-plan") {
        var plans = Core.normalizeArray((state.data || {}).items || (state.data || {}).itens || (state.data || {}).plans || (state.data || {}).planos);
        var plan = plans.find(function (item) { return String(planIdentifier(item)) === String(value); });
        if (!plan) return;
        var html = UI.banner("Abrir não inicia a sessão", "Revise o compromisso e toque em Iniciar sessão somente quando decidir começar.", "neutral") + '<div class="ic-grid ic-grid--metrics">' + UI.metric("Início", Core.formatDateTime(plan.starts_at || plan.inicio_em)) + UI.metric("Duração", Core.safeText(plan.duration_minutes || plan.duracao_minutos) + " min") + UI.metric("Limite", Core.formatMoney(Core.unitsFrom(plan, ["loss_limit_units_text", "limite_perda_unidades_texto", "loss_limit_units", "limite_perda_unidades"], null), plan.currency || plan.moeda || "", Core.decimalPlacesOf(plan, null))) + '</div><div class="ic-card__footer">' + UI.button("Iniciar sessão", { action: "start-plan", value: value, kind: "primary" }) + UI.button("Reagendar", { action: "reschedule-plan", value: value }) + UI.button("Cancelar", { action: "cancel-plan", value: value, kind: "danger" }) + '</div>';
        UI.openSheet({ eyebrow: plan.status || "Sessão Planejada", title: plan.title || "Detalhes do plano", html: html });
      }
      if (["start-plan", "cancel-plan"].indexOf(action) >= 0) {
        var rpc = action === "start-plan" ? "ic_sessao_iniciar_rpc" : "ic_sessao_cancelar_rpc";
        try { var changed = await deps.api.rpc(rpc, { p_id_planejamento: value }, { key: "planning:mutation" }); if (action === "start-plan" && (!changed.data || changed.data.started === false || ["ativa", "pausada"].indexOf(changed.data.status) < 0 || Core.finiteInteger(changed.data.session_id || changed.data.id_sessao, 0) <= 0 || Core.finiteInteger(changed.data.revision || changed.data.revisao, 0) <= 0)) throw new Error("O servidor não confirmou uma sessão ativa. Atualize o planejamento."); if (action === "cancel-plan") syncLocalReminder(changed.data || { id_planejamento: value }, "cancel"); else IC.Bridge.post("session_control_action", { action: "start", session_id: changed.data && (changed.data.session_id || changed.data.id_sessao), revision: changed.data && (changed.data.revision || changed.data.revisao), carga: deps.route().loadGeneration || null }); UI.closeSheet(); UI.toast(action === "start-plan" ? "Sessão de controle iniciada." : "Sessão Planejada cancelada."); state.status = "idle"; await load(true); if (action === "start-plan") deps.navigate({ section: "ao-vivo", sessionId: null }); }
        catch (error) { UI.toast(error.message || "A operação não foi concluída."); }
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
