(function (root, factory) {
  "use strict";
  var Core = root.TurboTigerIC && root.TurboTigerIC.Core;
  var api = factory(Core);
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Clock = api;
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ic-core.js"));
}(typeof window !== "undefined" ? window : globalThis, function (Core) {
  "use strict";
  var LABELS = {
    neutral: "Neutro",
    control: "Controle",
    attention: "Atenção",
    high: "Atenção elevada",
    limit: "Limite",
    capture_unavailable: "Captura indisponível"
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
      if (!reasons.some(function (reason) { return reason && reason.code === code; })) reasons.push({ code: code, label: timePercent >= 100 ? "Tempo planejado atingido" : "Limite de perda atingido", severity: "limit" });
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
    var financial = item.captureComplete ? '<div class="ic-clock-card__limit"><strong>' + Core.escapeHtml(Core.formatSignedMoney(item.netResultUnits, item.currency, item.decimalPlaces)) + '</strong><span>de ' + Core.escapeHtml(Core.formatMoney(item.lossLimitUnits, item.currency, item.decimalPlaces)) + ' de perda</span></div>' : '<div class="ic-clock-card__limit"><strong>Indisponível</strong><span>controle financeiro incompleto</span></div>';
    var lossProgress = item.captureComplete ? UI.progress("Limite de perda", item.lossPercent, Core.formatMoney(item.lossUnits, item.currency, item.decimalPlaces) + " / " + Core.formatMoney(item.lossLimitUnits, item.currency, item.decimalPlaces), tone) : UI.banner("Monitoramento financeiro incompleto", "O tempo continua, mas resultado e limite financeiro não serão apresentados como seguros até a captura ser reconciliada.", "capture");
    return '<article class="ic-card ic-clock-card ic-clock-card--' + tone + '"><div class="ic-clock-card__state"><h3>' + Core.escapeHtml(item.label.toUpperCase()) + '</h3>' + UI.badge(item.captureComplete ? "Captura completa" : "Captura " + item.captureQuality, item.captureComplete ? "control" : "capture") + '</div><div class="ic-clock-card__body"><div class="ic-clock-card__primary"><strong class="ic-clock-card__time">' + Core.escapeHtml(Core.formatDuration(item.elapsedSeconds)) + '<span class="ic-sr-only"> decorridos</span></strong>' + financial + '</div>' + UI.progress("Tempo", item.timePercent, Core.formatDuration(item.elapsedSeconds) + " / " + Core.formatDuration(item.plannedSeconds), tone) + lossProgress + reasons + '</div></article>';
  }

  return { normalize: normalize, render: render, LABELS: LABELS };
}));
