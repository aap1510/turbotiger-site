(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;

  var fontesLegendasAlertas = {
    "legenda_ic_alertas_conflito_preferencias": "Preferências alteradas em outra sessão. Recarregue para continuar.",
    "legenda_ic_alertas_salvando": "Salvando…",
    "legenda_ic_alertas_salvo": "Salvo",
    "legenda_ic_alertas_falha_salvar": "Não foi salvo. Tente novamente.",
    "legenda_ic_alertas_confira_horarios": "Confira os horários.",
    "legenda_ic_alertas_salvamento_automatico": "As alterações são salvas automaticamente",
    "legenda_ic_alertas_recarregar_preferencias": "Recarregar preferências",
    "legenda_ic_alertas_tentar_novamente": "Tentar novamente",
    "legenda_ic_alertas_sem_resultados": "Nenhum resultado.",
    "legenda_ic_alertas_selecionados": " selecionado(s)",
    "legenda_ic_alertas_pesquisar": "Pesquisar ",
    "legenda_ic_alertas_itens_acessados_aparecerao": "Os itens que você acessar pelo app aparecerão aqui.",
    "legenda_ic_alertas_horario_de": "De",
    "legenda_ic_alertas_horario_ate": "Até",
    "legenda_ic_alertas_remover": "Remover",
    "legenda_ic_alertas_fonte_dados": "Fonte dos dados",
    "legenda_ic_alertas_meu_historico": "Meu histórico",
    "legenda_ic_alertas_comunidade": "Comunidade",
    "legenda_ic_alertas_quero_acompanhar": "Quero acompanhar",
    "legenda_ic_alertas_melhores_resultados": "Melhores resultados",
    "legenda_ic_alertas_piores_resultados": "Piores resultados",
    "legenda_ic_alertas_jogos": "Jogos",
    "legenda_ic_alertas_bets": "Bets",
    "legenda_ic_alertas_periodos_diarios": "Períodos para acompanhar por dia",
    "legenda_ic_alertas_avisar_antes": "Avisar antes",
    "legenda_ic_alertas_ate_quantidade": "Até ",
    "legenda_ic_alertas_notificacoes_por_dia": " notificações por dia",
    "legenda_ic_alertas_nao_perturbar": "Não perturbar",
    "legenda_ic_alertas_dias_sem_alertas": "Dias sem alertas",
    "legenda_ic_alertas_segunda_abreviada": "Seg",
    "legenda_ic_alertas_terca_abreviada": "Ter",
    "legenda_ic_alertas_quarta_abreviada": "Qua",
    "legenda_ic_alertas_quinta_abreviada": "Qui",
    "legenda_ic_alertas_sexta_abreviada": "Sex",
    "legenda_ic_alertas_sabado_abreviado": "Sáb",
    "legenda_ic_alertas_domingo_abreviado": "Dom",
    "legenda_ic_alertas_periodos_silenciosos": "Períodos silenciosos",
    "legenda_ic_alertas_madrugada": "Madrugada · 00–06h",
    "legenda_ic_alertas_manha": "Manhã · 06–12h",
    "legenda_ic_alertas_tarde": "Tarde · 12–18h",
    "legenda_ic_alertas_noite": "Noite · 18–00h",
    "legenda_ic_alertas_adicionar_horario": "Adicionar horário",
    "legenda_ic_alertas_horarios_fuso": "Horários de ",
    "legenda_ic_alertas_escolha_filtros_alertas": "Escolha jogos, Bets, resultados, antecedência e quantidade para receber alertas."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasAlertas);
  function legendaAlertas(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasAlertas[chave]; }

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
      if (node) node.textContent = conflict ? legendaAlertas("legenda_ic_alertas_conflito_preferencias") : ({ pending: legendaAlertas("legenda_ic_alertas_salvando"), saving: legendaAlertas("legenda_ic_alertas_salvando"), saved: legendaAlertas("legenda_ic_alertas_salvo"), error: legendaAlertas("legenda_ic_alertas_falha_salvar"), invalid: legendaAlertas("legenda_ic_alertas_confira_horarios") })[savedStatus] || legendaAlertas("legenda_ic_alertas_salvamento_automatico");
      var retry = deps.container.querySelector('[data-screen-action="alerts-retry"]');
      if (retry) { retry.hidden = savedStatus !== "error"; retry.textContent = conflict ? legendaAlertas("legenda_ic_alertas_recarregar_preferencias") : legendaAlertas("legenda_ic_alertas_tentar_novamente"); }
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
      return items.length ? items.map(function (x) { return option(field, x.id, x.name, false); }).join("") : ("<p class=\"ic-metric__detail\">" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_sem_resultados")) + "</p>");
    }
    function picker(field, label) {
      var selected = data[field].filter(function (x) { return data.preferences[field].indexOf(x.id) >= 0; });
      return '<section class="ic-alert-picker"><h4>' + C.escapeHtml(label) + ' <span class="ic-metric__detail">' + selected.length + (C.escapeHtml(legendaAlertas("legenda_ic_alertas_selecionados")) + "</span></h4><div class=\"ic-alert-chips\">") + selected.map(function (x) {
        return UI.button(x.name + " ×", { action: "alerts-remove-" + field, value: x.id, kind: "quiet" });
      }).join("") + ("</div><label class=\"ic-field\"><span class=\"ic-sr-only\">" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_pesquisar"))) + C.escapeHtml(label) + '</span><input type="search" data-alert-search="' + field + '" placeholder="Pesquisar ' + C.escapeHtml(label.toLowerCase()) + '" value="' + C.escapeHtml(queries[field]) + '"></label><div class="ic-alert-options" data-alert-options="' + field + '">' + choices(field) + '</div>' + (!data[field].length ? ("<small>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_itens_acessados_aparecerao")) + "</small>") : '') + '</section>';
    }
    function render() {
      if (!data) return '<div id="icAlertPreferences">' + UI.state({ type: error ? "error" : "loading", message: error && error.message, retry: false }) + (error ? UI.button(legendaAlertas("legenda_ic_alertas_tentar_novamente"), { action: "alerts-load" }) : '') + '</div>';
      var p = data.preferences, custom = p.quiet_custom.map(function (x, i) {
        return ("<div class=\"ic-alert-time-row\"><label class=\"ic-field\">" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_horario_de")) + "<input type=\"time\" data-alert-custom=\"") + i + '" data-edge="start" value="' + C.escapeHtml(x.start) + ("\"></label><label class=\"ic-field\">" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_horario_ate")) + "<input type=\"time\" data-alert-custom=\"") + i + '" data-edge="end" value="' + C.escapeHtml(x.end) + '"></label>' + UI.button(legendaAlertas("legenda_ic_alertas_remover"), { action: "alerts-remove-time", value: i, kind: "quiet" }) + '</div>';
      }).join("");
      return ("<div id=\"icAlertPreferences\" class=\"ic-alert-preferences\"><div class=\"ic-alert-save\"><span data-alerts-status role=\"status\" aria-live=\"polite\"></span><button type=\"button\" class=\"ic-button ic-button--quiet\" data-screen-action=\"alerts-retry\" hidden>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_tentar_novamente")) + "</button></div>") +
        ("<section><h4>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_fonte_dados")) + "</h4><div class=\"ic-alert-choices\">") + option("source", "pessoal", legendaAlertas("legenda_ic_alertas_meu_historico"), true) + option("source", "comunidade", legendaAlertas("legenda_ic_alertas_comunidade"), true) + '</div></section>' +
        ("<section><h4>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_quero_acompanhar")) + "</h4><div class=\"ic-alert-choices\">") + option("directions", "melhor_historico", legendaAlertas("legenda_ic_alertas_melhores_resultados")) + option("directions", "pior_historico", legendaAlertas("legenda_ic_alertas_piores_resultados")) + '</div></section>' +
        picker("games", legendaAlertas("legenda_ic_alertas_jogos")) + picker("bets", legendaAlertas("legenda_ic_alertas_bets")) +
        ("<section><label class=\"ic-field\"><span>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_periodos_diarios")) + "</span><input type=\"number\" min=\"0\" max=\"20\" step=\"1\" inputmode=\"numeric\" data-alert-field=\"daily_periods\" value=\"") + p.daily_periods + ("\"></label><h4>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_avisar_antes")) + "</h4><div class=\"ic-alert-choices\">") + [5,15,30,60].map(function (v) { return option("lead_minutes", v, v + " min"); }).join("") + ("</div><div class=\"ic-alert-total\" role=\"status\">" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_ate_quantidade")) + "<strong>") + p.daily_periods * p.lead_minutes.length + ("</strong>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_notificacoes_por_dia")) + "</div></section>") +
        ("<details><summary>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_nao_perturbar")) + "</summary><h4>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_dias_sem_alertas")) + "</h4><div class=\"ic-alert-choices\">") + [legendaAlertas("legenda_ic_alertas_segunda_abreviada"),legendaAlertas("legenda_ic_alertas_terca_abreviada"),legendaAlertas("legenda_ic_alertas_quarta_abreviada"),legendaAlertas("legenda_ic_alertas_quinta_abreviada"),legendaAlertas("legenda_ic_alertas_sexta_abreviada"),legendaAlertas("legenda_ic_alertas_sabado_abreviado"),legendaAlertas("legenda_ic_alertas_domingo_abreviado")].map(function (label,i) { return option("quiet_days", i+1, label); }).join("") + ("</div><h4>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_periodos_silenciosos")) + "</h4><div class=\"ic-alert-choices\">") + [["madrugada",legendaAlertas("legenda_ic_alertas_madrugada")],["manha",legendaAlertas("legenda_ic_alertas_manha")],["tarde",legendaAlertas("legenda_ic_alertas_tarde")],["noite",legendaAlertas("legenda_ic_alertas_noite")]].map(function (x) { return option("quiet_periods",x[0],x[1]); }).join("") + '</div>' + custom + (p.quiet_custom.length<8 ? UI.button(legendaAlertas("legenda_ic_alertas_adicionar_horario"), { action: "alerts-add-time", icon: "plus", kind: "quiet" }) : '') + ("<small>" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_horarios_fuso"))) + C.escapeHtml(data.timezone) + '</small></details>' +
        ((!p.games.length || !p.bets.length || !p.directions.length || !p.lead_minutes.length || !p.daily_periods) ? ("<p class=\"ic-metric__detail\">" + C.escapeHtml(legendaAlertas("legenda_ic_alertas_escolha_filtros_alertas")) + "</p>") : '') + '</div>';
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
    if (root.addEventListener) root.addEventListener("turbotiger:idioma", paintStatus);
    return { render: render, load: load, handleAction: handleAction, handleChange: handleChange, refreshStatus: paintStatus,
      dispose: function () { if (root.removeEventListener) root.removeEventListener("turbotiger:idioma", paintStatus); disposed=true; saver.cancel(); deps.container.removeEventListener("input",input); } };
  };
}(window));
