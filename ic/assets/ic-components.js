(function (root, factory) {
  "use strict";
  var Core = root.TurboTigerIC && root.TurboTigerIC.Core;
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.UI = factory(root, Core);
}(typeof window !== "undefined" ? window : globalThis, function (root, Core) {
  "use strict";
  var sheetReturnFocus = null;
  var toastTimer = null;

  function icon(name) { return '<svg aria-hidden="true"><use href="#ic-i-' + Core.escapeHtml(name) + '"></use></svg>'; }

  function sectionHeader(title, description, actionHtml) {
    return '<header class="ic-section-header"><div><p class="ic-eyebrow">Tiger Control</p><h2>' + Core.escapeHtml(title) + '</h2>' + (description ? '<p>' + Core.escapeHtml(description) + '</p>' : '') + '</div>' + (actionHtml ? '<div class="ic-section-header__actions">' + actionHtml + '</div>' : '') + '</header>';
  }

  function state(options) {
    options = options || {};
    var type = options.type || "empty";
    var map = {
      loading: ["refresh", "Carregando", "Estamos reunindo as informações desta área."],
      empty: ["info", "Nada por aqui ainda", "Quando houver dados, eles aparecerão aqui."],
      offline: ["alert", "Sem conexão", "O conteúdo não pôde ser atualizado. Nenhum dado desatualizado será apresentado como monitoramento ativo."],
      insufficient_data: ["chart", "Ainda estamos conhecendo seu padrão", "A análise será liberada quando houver uma amostra suficiente."],
      insufficient_quality: ["alert", "Qualidade insuficiente", "O histórico existe, mas esta análise exige captura ou saldo confiável."],
      error: ["alert", "Não foi possível carregar", "Tente novamente em instantes."],
      unavailable: ["lock", "Recurso ainda indisponível", "A fachada segura desta área ainda não está disponível."]
    };
    var entry = map[type] || map.empty;
    var body = '<div class="ic-state"><div class="ic-state__icon">' + icon(options.icon || entry[0]) + '</div><h3>' + Core.escapeHtml(options.title || entry[1]) + '</h3><p>' + Core.escapeHtml(options.message || entry[2]) + '</p>';
    if (type === "loading") body += '<div class="ic-skeleton" aria-hidden="true"><span></span><span></span><span></span></div>';
    if (options.meta) body += '<span class="ic-state__meta">' + Core.escapeHtml(options.meta) + '</span>';
    body += '<span class="ic-state__meta">Última atualização: ' + Core.escapeHtml(options.updatedAt ? Core.formatDateTime(options.updatedAt) : "não disponível") + '</span>';
    if (options.retry !== false && ["offline", "error", "unavailable"].indexOf(type) >= 0) body += '<button class="ic-button" type="button" data-screen-action="retry">' + icon("refresh") + 'Tentar novamente</button>';
    return body + '</div>';
  }

  function metric(label, value, detail, tone) {
    return '<article class="ic-metric"><span class="ic-metric__label">' + Core.escapeHtml(label) + '</span><strong class="ic-metric__value ic-value--' + Core.escapeHtml(tone || "neutral") + '">' + Core.escapeHtml(value) + '</strong>' + (detail ? '<span class="ic-metric__detail">' + Core.escapeHtml(detail) + '</span>' : '') + '</article>';
  }

  function badge(label, status) { return '<span class="ic-badge ic-badge--' + Core.statusTone(status) + '">' + Core.escapeHtml(label) + '</span>'; }

  function evidence(item) {
    item = item || {};
    var values = [];
    if (item.sample || item.amostra) values.push(Core.safeText(item.sample || item.amostra));
    if (item.period || item.periodo) values.push(Core.safeText(item.period || item.periodo));
    if (item.users || item.usuarios) values.push(Core.safeText(item.users || item.usuarios) + " usuários");
    if (item.sessions || item.sessoes) values.push(Core.safeText(item.sessions || item.sessoes) + " sessões");
    if (item.rounds || item.rodadas) values.push(Core.safeText(item.rounds || item.rodadas) + " rodadas");
    if (item.updated_at || item.atualizado_em) values.push("Atualizado " + Core.formatDateTime(item.updated_at || item.atualizado_em));
    return values.length ? '<div class="ic-evidence">' + values.map(function (value) { return '<span>' + Core.escapeHtml(value) + '</span>'; }).join("") + '</div>' : '';
  }

  function banner(title, message, status) {
    var tone = Core.statusTone(status);
    return '<div class="ic-banner ic-banner--' + tone + '">' + icon(tone === "control" ? "check" : tone === "neutral" ? "info" : "alert") + '<div class="ic-banner__content"><strong>' + Core.escapeHtml(title) + '</strong><p>' + Core.escapeHtml(message) + '</p></div></div>';
  }

  function progress(label, value, detail, tone) {
    var percent = Core.clamp(value, 0, 100);
    return '<div class="ic-progress ic-progress--' + Core.statusTone(tone) + '"><div class="ic-progress__top"><span>' + Core.escapeHtml(label) + '</span><strong>' + Core.escapeHtml(detail || Core.formatPercent(percent)) + '</strong></div><progress max="100" value="' + percent + '">' + percent + '%</progress></div>';
  }

  function button(label, options) {
    options = options || {};
    var classes = "ic-button" + (options.kind ? " ic-button--" + options.kind : "") + (options.block ? " ic-button--block" : "");
    var attributes = options.route ? ' data-route="' + Core.escapeHtml(options.route) + '"' : ' data-screen-action="' + Core.escapeHtml(options.action || "") + '"';
    if (options.value !== null && typeof options.value !== "undefined") attributes += ' data-action-value="' + Core.escapeHtml(options.value) + '"';
    if (options.disabled) attributes += ' disabled aria-disabled="true"';
    return '<button class="' + classes + '" type="' + (options.type === "submit" ? "submit" : "button") + '"' + attributes + '>' + (options.icon ? icon(options.icon) : '') + Core.escapeHtml(label) + '</button>';
  }

  function listRow(title, meta, value, actions) {
    return '<article class="ic-list-row"><div class="ic-list-row__main"><h3 class="ic-list-row__title">' + Core.escapeHtml(title) + '</h3>' + (meta ? '<p class="ic-list-row__meta">' + Core.escapeHtml(meta) + '</p>' : '') + '</div>' + (value ? '<div class="ic-list-row__value">' + Core.escapeHtml(value) + '</div>' : '') + (actions ? '<div class="ic-list-row__actions">' + actions + '</div>' : '') + '</article>';
  }

  function openSheet(options) {
    options = options || {};
    var sheet = document.getElementById("icSheet");
    var backdrop = document.getElementById("icSheetBackdrop");
    var app = document.getElementById("icApp");
    if (!sheet || !backdrop) return;
    if (sheet.hidden) sheetReturnFocus = document.activeElement;
    document.getElementById("icSheetEyebrow").textContent = options.eyebrow || "Turbo Tiger";
    document.getElementById("icSheetTitle").textContent = options.title || "Detalhes";
    document.getElementById("icSheetBody").innerHTML = options.html || "";
    backdrop.hidden = false;
    sheet.hidden = false;
    document.body.classList.add("ic-sheet-open");
    if (app) { app.setAttribute("inert", ""); app.setAttribute("aria-hidden", "true"); }
    var first = sheet.querySelector("button, input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (first) first.focus();
  }

  function closeSheet() {
    var sheet = document.getElementById("icSheet");
    var backdrop = document.getElementById("icSheetBackdrop");
    var app = document.getElementById("icApp");
    if (!sheet || sheet.hidden) return false;
    sheet.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("ic-sheet-open");
    if (app) { app.removeAttribute("inert"); app.removeAttribute("aria-hidden"); }
    document.getElementById("icSheetBody").innerHTML = "";
    if (sheetReturnFocus && typeof sheetReturnFocus.focus === "function") sheetReturnFocus.focus();
    sheetReturnFocus = null;
    return true;
  }

  function toast(message) {
    var region = document.getElementById("icToastRegion");
    if (!region) return;
    if (toastTimer) root.clearTimeout(toastTimer);
    region.innerHTML = '<div class="ic-toast">' + Core.escapeHtml(message) + '</div>';
    toastTimer = root.setTimeout(function () { region.innerHTML = ""; }, 4200);
  }

  function announce(message) { var node = document.getElementById("icA11yStatus"); if (node) node.textContent = message || ""; }

  function bindGlobalSheet() {
    var sheet = document.getElementById("icSheet");
    var backdrop = document.getElementById("icSheetBackdrop");
    if (backdrop) backdrop.addEventListener("click", closeSheet);
    if (sheet) {
      sheet.addEventListener("click", function (event) { if (event.target.closest("[data-sheet-close]")) closeSheet(); });
      sheet.addEventListener("keydown", function (event) {
        if (event.key === "Escape") { event.preventDefault(); closeSheet(); return; }
        if (event.key !== "Tab") return;
        var focusable = Array.prototype.slice.call(sheet.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"));
        if (!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
    }
  }

  return { icon: icon, sectionHeader: sectionHeader, state: state, metric: metric, badge: badge, evidence: evidence, banner: banner, progress: progress, button: button, listRow: listRow, openSheet: openSheet, closeSheet: closeSheet, toast: toast, announce: announce, bindGlobalSheet: bindGlobalSheet };
}));
