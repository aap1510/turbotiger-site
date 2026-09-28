(function (root, factory) {
  "use strict";
  var Core = root.TurboTigerIC && root.TurboTigerIC.Core;
  var api = factory(Core, root);
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Clock = api;
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ic-core.js"), root);
}(typeof window !== "undefined" ? window : globalThis, function (Core, root) {
  "use strict";

  var fontesLegendasRelogio = {
    "legenda_ic_relogio_neutro": "Neutro",
    "legenda_ic_relogio_controle": "Controle",
    "legenda_ic_relogio_atencao": "Atenção",
    "legenda_ic_relogio_atencao_elevada": "Atenção elevada",
    "legenda_ic_relogio_limite": "Limite",
    "legenda_ic_relogio_captura_indisponivel": "Captura indisponível",
    "legenda_ic_relogio_tempo_planejado_atingido": "Tempo planejado atingido",
    "legenda_ic_relogio_limite_perda_atingido": "Limite de perda atingido",
    "legenda_ic_relogio_valor_limite_perda": "de {valor} de perda",
    "legenda_ic_relogio_indisponivel": "Indisponível",
    "legenda_ic_relogio_controle_financeiro_incompleto": "controle financeiro incompleto",
    "legenda_ic_relogio_limite_perda": "Limite de perda",
    "legenda_ic_relogio_monitoramento_financeiro_incompleto": "Monitoramento financeiro incompleto",
    "legenda_ic_relogio_captura_pendente_reconciliacao": "O tempo continua, mas resultado e limite financeiro não serão apresentados como seguros até a captura ser reconciliada.",
    "legenda_ic_relogio_captura_completa": "Captura completa",
    "legenda_ic_relogio_captura": "Captura ",
    "legenda_ic_relogio_decorridos": " decorridos",
    "legenda_ic_relogio_tempo": "Tempo"
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasRelogio);
  function legendaRelogio(chave, valores) {
    if (root.TurboTigerLegendas) return root.TurboTigerLegendas.texto(chave, valores);
    return fontesLegendasRelogio[chave].replace(/\{([a-z][a-z0-9_]*)\}/g, function (token, nome) { return valores && Object.prototype.hasOwnProperty.call(valores, nome) ? String(valores[nome]) : token; });
  }

  var LABELS = {
    get neutral() { return legendaRelogio("legenda_ic_relogio_neutro"); },
    get control() { return legendaRelogio("legenda_ic_relogio_controle"); },
    get attention() { return legendaRelogio("legenda_ic_relogio_atencao"); },
    get high() { return legendaRelogio("legenda_ic_relogio_atencao_elevada"); },
    get limit() { return legendaRelogio("legenda_ic_relogio_limite"); },
    get capture_unavailable() { return legendaRelogio("legenda_ic_relogio_captura_indisponivel"); }
  };

  function valueOf(record, textKey, numericKey) {
    if (Object.prototype.hasOwnProperty.call(record, textKey)) return record[textKey];
    return record[numericKey];
  }

  function normalize(value) {
    value = value || {};
    var state = Core.CLOCK_STATES.indexOf(value.state) >= 0 ? value.state : "neutral";
    var captureQuality = String(value.capture_quality || "unknown").trim().toLowerCase();
    var elapsed = Math.max(0, Core.finiteInteger(value.elapsed_seconds, 0));
    var planned = Math.max(0, Core.finiteInteger(value.planned_seconds, 0));
    var lossLimit = Core.integerUnits(valueOf(value, "loss_limit_units_text", "loss_limit_units"));
    var net = Core.integerUnits(valueOf(value, "net_result_units_text", "net_result_units"));
    var currency = typeof value.currency === "string" && /^[A-Z]{3}$/.test(value.currency) ? value.currency : null;
    var decimalPlaces = Core.decimalPlacesOf(value, null);
    var captureComplete = value.financial_enabled !== false && currency !== null && decimalPlaces !== null && /^(complete|completa)$/.test(captureQuality) && net !== null && Core.unitsSign(lossLimit) > 0;
    if (!captureComplete && (state === "neutral" || state === "control")) state = "capture_unavailable";
    var loss = Core.unitsSign(net) < 0 ? Core.absoluteUnits(net) : "0";
    var lossPercent = captureComplete ? Core.unitsRatioPercent(loss, lossLimit) : null;
    var reasons = Core.normalizeArray(value.reasons || value.motivos).slice();
    var timePercent = planned > 0 ? Core.clamp(elapsed * 100 / planned, 0, 100) : 0;
    var objectivePercent = Math.max(timePercent, lossPercent === null ? 0 : lossPercent);
    if (state !== "limit" && objectivePercent >= 80) state = "high";
    else if (state !== "limit" && state !== "high" && objectivePercent >= 50) state = "attention";
    if (objectivePercent >= 100) {
      state = "limit";
      var code = timePercent >= 100 ? "planned_time_reached" : "planned_loss_reached";
      if (!reasons.some(function (reason) { return reason && reason.code === code; })) reasons.push({ code: code, label: timePercent >= 100 ? legendaRelogio("legenda_ic_relogio_tempo_planejado_atingido") : legendaRelogio("legenda_ic_relogio_limite_perda_atingido"), severity: "limit" });
    }
    return {
      state: state,
      label: LABELS[state],
      elapsedSeconds: elapsed,
      plannedSeconds: planned,
      timePercent: timePercent,
      lossUnits: loss,
      lossLimitUnits: lossLimit,
      lossPercent: lossPercent,
      netResultUnits: net,
      currency: currency,
      decimalPlaces: decimalPlaces,
      captureQuality: captureQuality,
      captureComplete: captureComplete,
      reasons: reasons
    };
  }

  function render(value, UI) {
    var item = normalize(value);
    var tone = item.state === "capture_unavailable" ? "capture" : item.state;
    var reasons = item.reasons.length ? '<div class="ic-card__footer">' + item.reasons.map(function (reason) { return UI.badge(reason.label || reason.descricao || reason, reason.severity || item.state); }).join("") + '</div>' : '';
    var financial = item.captureComplete ? '<div class="ic-clock-card__limit"><strong>' + Core.escapeHtml(Core.formatSignedMoney(item.netResultUnits, item.currency, item.decimalPlaces)) + "</strong><span>" + Core.escapeHtml(legendaRelogio("legenda_ic_relogio_valor_limite_perda", { valor: Core.formatMoney(item.lossLimitUnits, item.currency, item.decimalPlaces) })) + "</span></div>" : ("<div class=\"ic-clock-card__limit\"><strong>" + Core.escapeHtml(legendaRelogio("legenda_ic_relogio_indisponivel")) + "</strong><span>" + Core.escapeHtml(legendaRelogio("legenda_ic_relogio_controle_financeiro_incompleto")) + "</span></div>");
    var lossProgress = item.captureComplete ? UI.progress(legendaRelogio("legenda_ic_relogio_limite_perda"), item.lossPercent, Core.formatMoney(item.lossUnits, item.currency, item.decimalPlaces) + " / " + Core.formatMoney(item.lossLimitUnits, item.currency, item.decimalPlaces), tone) : UI.banner(legendaRelogio("legenda_ic_relogio_monitoramento_financeiro_incompleto"), legendaRelogio("legenda_ic_relogio_captura_pendente_reconciliacao"), "capture");
    return '<article class="ic-card ic-clock-card ic-clock-card--' + tone + '"><div class="ic-clock-card__state"><h3>' + Core.escapeHtml(item.label.toUpperCase()) + '</h3>' + UI.badge(item.captureComplete ? legendaRelogio("legenda_ic_relogio_captura_completa") : legendaRelogio("legenda_ic_relogio_captura") + item.captureQuality, item.captureComplete ? "control" : "capture") + '</div><div class="ic-clock-card__body"><div class="ic-clock-card__primary"><strong class="ic-clock-card__time">' + Core.escapeHtml(Core.formatDuration(item.elapsedSeconds)) + ("<span class=\"ic-sr-only\">" + Core.escapeHtml(legendaRelogio("legenda_ic_relogio_decorridos")) + "</span></strong>") + financial + '</div>' + UI.progress(legendaRelogio("legenda_ic_relogio_tempo"), item.timePercent, Core.formatDuration(item.elapsedSeconds) + " / " + Core.formatDuration(item.plannedSeconds), tone) + lossProgress + reasons + '</div></article>';
  }

  return { normalize: normalize, render: render, LABELS: LABELS };
}));
