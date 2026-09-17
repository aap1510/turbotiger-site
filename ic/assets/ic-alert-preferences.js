(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.AlertPreferences = function (deps) {
    var C = IC.Core, UI = IC.UI, data = null, error = null, disposed = false, loading = false;
    var epoch = deps.store.getState().sessionEpoch, version = 0, savedStatus = "", conflict = false, queries = { games: "", bets: "" };
    var current = function () { return !disposed && epoch === deps.store.getState().sessionEpoch; };
    function makeSaver() { return root.TurboIEAutosave({ current: current, save: async function (value) {
      if (conflict) throw new Error("ic_alertas_conflito_revisao");
      try {
        var result = await deps.api.rpc("ic_alertas_preferencias_salvar_rpc", { p_preferencias: value, p_revisao: data.revision }, { key: "settings:alerts-save", replace: false });
        if (current()) data.revision = result.data.revision;
      } catch (e) {
        if (/40001|ic_alertas_conflito_revisao/.test(String(e.code || "") + " " + String(e.message || ""))) conflict = true;
        throw e;
      }
    }, status: function (status) { savedStatus = status; paintStatus(); } }); }
    var saver = makeSaver();
    function paintStatus() {
      var node = deps.container.querySelector("[data-alerts-status]");
      if (node) node.textContent = conflict ? "Preferências alteradas em outra sessão. Recarregue para continuar." : ({ pending: "Salvando…", saving: "Salvando…", saved: "Salvo", error: "Não foi salvo. Tente novamente.", invalid: "Confira os horários." })[savedStatus] || "As alterações são salvas automaticamente";
      var retry = deps.container.querySelector('[data-screen-action="alerts-retry"]');
      if (retry) { retry.hidden = savedStatus !== "error"; retry.textContent = conflict ? "Recarregar preferências" : "Tentar novamente"; }
    }
    async function load(force) {
      if (!current() || loading || (data && (!force || saver.busy() || saver.unsaved()))) return;
      loading = true; error = null; var requestedVersion = version;
      try {
        var result = await deps.api.rpc("ic_alertas_preferencias_contexto_rpc", {}, { key: "settings:alerts-load" });
        if (current() && version === requestedVersion) data = result.data;
      } catch (e) { if (current() && !/aborted|stale_session/.test(e.code || "")) error = e; }
      finally { loading = false; if (current()) repaint(); }
    }
    function option(field, value, label, single) {
      var p = data.preferences, selected = single ? p[field] === value : p[field].indexOf(value) >= 0;
      return '<label class="ic-alert-choice' + (selected ? ' is-selected' : '') + '"><input type="' + (single ? 'radio' : 'checkbox') + '" data-alert-field="' + field + '" name="alert-' + field + '" value="' + C.escapeHtml(value) + '"' + (selected ? ' checked' : '') + '><span>' + C.escapeHtml(label) + '</span></label>';
    }
    function normalize(text) { return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
    function choices(field) {
      var items = data[field].filter(function (x) { return normalize(x.name).indexOf(normalize(queries[field])) >= 0; });
      return items.length ? items.map(function (x) { return option(field, x.id, x.name, false); }).join("") : '<p class="ic-metric__detail">Nenhum resultado.</p>';
    }
    function picker(field, label) {
      var selected = data[field].filter(function (x) { return data.preferences[field].indexOf(x.id) >= 0; });
      return '<section class="ic-alert-picker"><h4>' + label + ' <span class="ic-metric__detail">' + selected.length + ' selecionado(s)</span></h4><div class="ic-alert-chips">' + selected.map(function (x) {
        return UI.button(x.name + " ×", { action: "alerts-remove-" + field, value: x.id, kind: "quiet" });
      }).join("") + '</div><label class="ic-field"><span class="ic-sr-only">Pesquisar ' + label + '</span><input type="search" data-alert-search="' + field + '" placeholder="Pesquisar ' + label.toLowerCase() + '" value="' + C.escapeHtml(queries[field]) + '"></label><div class="ic-alert-options" data-alert-options="' + field + '">' + choices(field) + '</div>' + (!data[field].length ? '<small>Os itens que você acessar pelo app aparecerão aqui.</small>' : '') + '</section>';
    }
    function render() {
      if (!data) return '<div id="icAlertPreferences">' + UI.state({ type: error ? "error" : "loading", message: error && error.message, retry: false }) + (error ? UI.button("Tentar novamente", { action: "alerts-load" }) : '') + '</div>';
      var p = data.preferences, custom = p.quiet_custom.map(function (x, i) {
        return '<div class="ic-alert-time-row"><label class="ic-field">De<input type="time" data-alert-custom="' + i + '" data-edge="start" value="' + C.escapeHtml(x.start) + '"></label><label class="ic-field">Até<input type="time" data-alert-custom="' + i + '" data-edge="end" value="' + C.escapeHtml(x.end) + '"></label>' + UI.button("Remover", { action: "alerts-remove-time", value: i, kind: "quiet" }) + '</div>';
      }).join("");
      return '<div id="icAlertPreferences" class="ic-alert-preferences"><div class="ic-alert-save"><span data-alerts-status role="status" aria-live="polite"></span><button type="button" class="ic-button ic-button--quiet" data-screen-action="alerts-retry" hidden>Tentar novamente</button></div>' +
        '<section><h4>Fonte dos dados</h4><div class="ic-alert-choices">' + option("source", "pessoal", "Meu histórico", true) + option("source", "comunidade", "Comunidade", true) + '</div></section>' +
        '<section><h4>Quero acompanhar</h4><div class="ic-alert-choices">' + option("directions", "melhor_historico", "Melhores resultados") + option("directions", "pior_historico", "Piores resultados") + '</div></section>' +
        picker("games", "Jogos") + picker("bets", "Bets") +
        '<section><label class="ic-field"><span>Períodos para acompanhar por dia</span><input type="number" min="0" max="20" step="1" inputmode="numeric" data-alert-field="daily_periods" value="' + p.daily_periods + '"></label><h4>Avisar antes</h4><div class="ic-alert-choices">' + [5,15,30,60].map(function (v) { return option("lead_minutes", v, v + " min"); }).join("") + '</div><div class="ic-alert-total" role="status">Até <strong>' + p.daily_periods * p.lead_minutes.length + '</strong> notificações por dia</div></section>' +
        '<details><summary>Não perturbar</summary><h4>Dias sem alertas</h4><div class="ic-alert-choices">' + ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(function (label,i) { return option("quiet_days", i+1, label); }).join("") + '</div><h4>Períodos silenciosos</h4><div class="ic-alert-choices">' + [["madrugada","Madrugada · 00–06h"],["manha","Manhã · 06–12h"],["tarde","Tarde · 12–18h"],["noite","Noite · 18–00h"]].map(function (x) { return option("quiet_periods",x[0],x[1]); }).join("") + '</div>' + custom + (p.quiet_custom.length<8 ? UI.button("Adicionar horário", { action: "alerts-add-time", icon: "plus", kind: "quiet" }) : '') + '<small>Horários de ' + C.escapeHtml(data.timezone) + '</small></details>' +
        ((!p.games.length || !p.bets.length || !p.directions.length || !p.lead_minutes.length || !p.daily_periods) ? '<p class="ic-metric__detail">Escolha jogos, Bets, resultados, antecedência e quantidade para receber alertas.</p>' : '') + '</div>';
    }
    function repaint() {
      var host = deps.container.querySelector("#icAlertPreferences");
      if (!host) return;
      var opened = host.querySelector("details[open]"), active = host.contains(document.activeElement) ? document.activeElement : null;
      var selector = active && active.dataset.alertField ? '[data-alert-field="' + active.dataset.alertField + '"][value="' + active.value + '"]' : null;
      host.outerHTML = render();
      if (opened) deps.container.querySelector("#icAlertPreferences details").open = true;
      if (selector) { var restored = deps.container.querySelector(selector); if (restored) restored.focus(); }
      paintStatus();
    }
    function save() {
      version += 1;
      var p = data.preferences;
      var valid = Number.isInteger(p.daily_periods) && p.daily_periods>=0 && p.daily_periods<=20 && p.quiet_custom.every(function (x) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(x.start) && /^([01]\d|2[0-3]):[0-5]\d$/.test(x.end) && x.start!==x.end; });
      saver.update(valid ? p : null, 0); repaint();
    }
    function handleChange(target) {
      if (!data || !target.closest("#icAlertPreferences")) return;
      var f = target.dataset.alertField, p = data.preferences;
      if (f === "source") p.source = target.value;
      else if (f === "daily_periods") p.daily_periods = target.value === "" ? null : Number(target.value);
      else if (f) {
        var v = ["lead_minutes","quiet_days"].indexOf(f)>=0 ? Number(target.value) : target.value;
        p[f] = p[f].filter(function (x) { return x!==v; }); if(target.checked) p[f].push(v);
      } else if (target.dataset.alertCustom !== undefined) p.quiet_custom[Number(target.dataset.alertCustom)][target.dataset.edge] = target.value;
      else return;
      save();
    }
    function input(event) {
      var field = event.target.dataset.alertSearch;
      if (!data || !field || !current()) return;
      queries[field] = event.target.value;
      var list = deps.container.querySelector('[data-alert-options="' + field + '"]'); if (list) list.innerHTML=choices(field);
    }
    function handleAction(action,value) {
      if (action === "alerts-load") return load(true);
      if (action === "alerts-retry") {
        if (conflict) { saver.cancel(); data = null; conflict = false; savedStatus = ""; saver = makeSaver(); return load(true); }
        return saver.retry();
      }
      if (!data) return;
      if (action === "alerts-add-time") { data.preferences.quiet_custom.push({ start: "", end: "" }); repaint(); return; }
      if (action === "alerts-remove-time") data.preferences.quiet_custom.splice(Number(value),1);
      else if (action === "alerts-remove-games" || action === "alerts-remove-bets") {
        var f = action.slice(14); data.preferences[f] = data.preferences[f].filter(function (x) { return x!==String(value); });
      } else return;
      save();
    }
    deps.container.addEventListener("input",input);
    return { render: render, load: load, handleAction: handleAction, handleChange: handleChange, refreshStatus: paintStatus,
      dispose: function () { disposed=true; saver.cancel(); deps.container.removeEventListener("input",input); } };
  };
}(window));
