(function (root, factory) {
  var api = factory();
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Core = api;
  if (typeof module === "object" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var SECTIONS = [
    "visao-geral", "planejar", "ao-vivo", "historico", "estatisticas",
    "jogos", "comunidade", "regras-pausas", "coach", "configuracoes"
  ];
  var REMINDER_OFFSETS = [0, 5, 10, 15, 30];
  var CLOCK_STATES = ["neutral", "control", "attention", "high", "limit", "capture_unavailable"];
  var FEATURE_FLAGS = [
    "ic_predictive_legacy_enabled", "ic_historical_report_enabled", "ic_planned_session_enabled",
    "ic_reminders_enabled", "ic_live_clock_enabled", "ic_financial_clock_enabled",
    "ic_personal_insights_enabled", "ic_community_report_enabled", "ic_community_plan_enabled",
    "ic_interval_lab_enabled", "ic_bankroll_curve_enabled", "ic_significant_win_enabled",
    "ic_session_risk_enabled", "ic_integrity_monitor_enabled", "ic_ai_coach_enabled",
    "ic_emergency_enabled", "ic_discipline_gamification_enabled"
  ];

  function isPlainObject(value) {
    if (!value || Object.prototype.toString.call(value) !== "[object Object]") return false;
    var prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function safeText(value, fallback) {
    if (value === null || typeof value === "undefined" || value === "") return fallback === null || typeof fallback === "undefined" ? "—" : String(fallback);
    return String(value);
  }

  function escapeHtml(value) {
    return safeText(value, "").replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function finiteInteger(value, fallback) {
    var number = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(number)) return typeof fallback === "number" ? fallback : 0;
    return Math.trunc(number);
  }

  function validUuid(value) {
    var text = safeText(value, "").trim().toLowerCase();
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(text) ? text : null;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, Number(value) || 0));
  }

  function integerUnits(value) {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "number") return Number.isSafeInteger(value) ? String(value) : null;
    var text = typeof value === "string" ? value.trim() : "";
    if (!/^-?[0-9]+$/.test(text)) return null;
    var negative = text.charAt(0) === "-";
    var digits = (negative ? text.slice(1) : text).replace(/^0+(?=[0-9])/, "");
    if (/^0+$/.test(digits)) return "0";
    return (negative ? "-" : "") + digits;
  }

  function unitsSign(value) {
    var normalized = integerUnits(value);
    if (normalized === null || normalized === "0") return 0;
    return normalized.charAt(0) === "-" ? -1 : 1;
  }

  function absoluteUnits(value) {
    var normalized = integerUnits(value);
    if (normalized === null) return "0";
    return normalized.charAt(0) === "-" ? normalized.slice(1) : normalized;
  }

  function unitsFrom(record, keys, fallback) {
    var source = isPlainObject(record) ? record : {};
    var names = Array.isArray(keys) ? keys : [];
    for (var index = 0; index < names.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(source, names[index])) continue;
      var normalized = integerUnits(source[names[index]]);
      if (normalized !== null) return normalized;
    }
    return fallback === null ? null : integerUnits(fallback) || "0";
  }

  function decimalPlacesOf(value, fallback) {
    var candidate = value;
    if (isPlainObject(value)) {
      candidate = Object.prototype.hasOwnProperty.call(value, "decimal_places") ? value.decimal_places : value.casas_decimais;
    }
    var parsed = candidate === null || candidate === undefined || candidate === "" ? NaN : typeof candidate === "number" ? candidate : Number(candidate);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 8) return parsed;
    return Number.isInteger(fallback) && fallback >= 0 && fallback <= 8 ? fallback : fallback === null ? null : 2;
  }

  function currencySymbol(code) {
    try {
      var part = new Intl.NumberFormat("pt-BR", { style: "currency", currency: code, currencyDisplay: "symbol" }).formatToParts(0).find(function (item) { return item.type === "currency"; });
      return part && part.value ? part.value : code;
    } catch (_error) { return code; }
  }

  function formatMoney(units, currency, decimalPlaces) {
    var normalized = integerUnits(units);
    if (normalized === null) return "—";
    var code = typeof currency === "string" && /^[A-Z]{3}$/.test(currency) ? currency : null;
    var places = decimalPlacesOf(decimalPlaces, null);
    if (!code || places === null) return "—";
    var negative = normalized.charAt(0) === "-";
    var digits = negative ? normalized.slice(1) : normalized;
    var padded = places > 0 ? digits.padStart(places + 1, "0") : digits;
    var whole = places > 0 ? padded.slice(0, -places) : padded;
    var fraction = places > 0 ? padded.slice(-places) : "";
    var grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (negative ? "−" : "") + currencySymbol(code) + "\u00a0" + grouped + (places > 0 ? "," + fraction : "");
  }

  function formatSignedMoney(units, currency, decimalPlaces) {
    if (integerUnits(units) === null) return "—";
    var sign = unitsSign(units);
    if (sign === 0) return formatMoney("0", currency, decimalPlaces);
    var text = formatMoney(absoluteUnits(units), currency, decimalPlaces);
    return text === "—" ? text : (sign > 0 ? "+" : "−") + text;
  }

  function unitsRatioPercent(numerator, denominator) {
    var left = integerUnits(numerator), right = integerUnits(denominator);
    if (left === null || right === null || unitsSign(right) <= 0) return 0;
    try {
      if (typeof BigInt !== "function") return 0;
      var scaled = BigInt(absoluteUnits(left)) * BigInt("1000000") / BigInt(absoluteUnits(right));
      return clamp(Number(scaled) / 10000, 0, 100);
    } catch (_error) { return 0; }
  }

  function parseMoneyToUnits(value) {
    var source = safeText(value, "").trim().replace(/\s/g, "").replace(/^R\$/i, "");
    if (!source) return null;
    if (/^-?\d+$/.test(source)) {
      var wholeUnits = Number(source) * 100;
      return Number.isSafeInteger(wholeUnits) ? wholeUnits : null;
    }
    if (/^-?\d{1,3}(?:\.\d{3})*,\d{1,2}$/.test(source)) source = source.replace(/\./g, "").replace(",", ".");
    else if (/^-?\d+(?:[.,]\d{1,2})$/.test(source)) source = source.replace(",", ".");
    else return null;
    var parts = source.split(".");
    var sign = parts[0].charAt(0) === "-" ? -1 : 1;
    var whole = Math.abs(Number(parts[0]));
    var cents = Number((parts[1] || "").padEnd(2, "0").slice(0, 2));
    if (!Number.isSafeInteger(whole) || !Number.isSafeInteger(cents)) return null;
    var units = whole * 100 + cents;
    return Number.isSafeInteger(units) ? sign * units : null;
  }

  function parseMoneyToUnitsText(value, decimalPlaces) {
    var places = decimalPlacesOf(decimalPlaces, -1);
    if (decimalPlaces === null || decimalPlaces === undefined || !Number.isInteger(Number(decimalPlaces)) || Number(decimalPlaces) < 0 || Number(decimalPlaces) > 8) return null;
    var text = typeof value === "string" ? value.trim().replace(/\s/g, "") : "";
    if (!text || text.length > 80) return null;
    var parts = text.split(",");
    if (parts.length > 2) return null;
    var whole = parts[0], fraction = parts.length === 2 ? parts[1] : "";
    if (!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(whole) || !/^\d*$/.test(fraction) || fraction.length > places || (parts.length === 2 && fraction.length === 0)) return null;
    whole = whole.replace(/\./g, "");
    var result = integerUnits(whole + fraction.padEnd(places, "0"));
    if (result === null || absoluteUnits(result).length > 30) return null;
    return result;
  }

  function currencyCatalog(context) {
    var candidates = context && (context.currencies || context.moedas);
    var byCode = Object.create(null), conflicts = Object.create(null);
    normalizeArray(candidates).forEach(function (item) {
      if (!item || typeof item !== "object") return;
      var code = String(item.code || item.currency || "");
      var rawPlaces = item.decimal_places;
      if (!/^[A-Z]{3}$/.test(code) || rawPlaces === null || rawPlaces === undefined || rawPlaces === "") return;
      var places = Number(rawPlaces);
      if (!Number.isInteger(places) || places < 0 || places > 8) return;
      if (byCode[code] && byCode[code].decimal_places !== places) conflicts[code] = true;
      byCode[code] = { code: code, decimal_places: places, label: String(item.label || code) };
    });
    return Object.keys(byCode).sort().filter(function (code) { return !conflicts[code]; }).map(function (code) { return byCode[code]; });
  }

  function currencyOptions(context, selectedCode, emptyLabel) {
    return '<option value="">' + escapeHtml(emptyLabel || "Selecione a moeda") + '</option>' + currencyCatalog(context).map(function (currency) {
      return '<option value="' + currency.code + '"' + (currency.code === selectedCode ? " selected" : "") + '>' + escapeHtml(currency.label) + '</option>';
    }).join("");
  }

  function formatDuration(seconds) {
    var total = Math.max(0, finiteInteger(seconds, 0));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var remaining = total % 60;
    return (hours > 0 ? String(hours).padStart(2, "0") + ":" : "") + String(minutes).padStart(2, "0") + ":" + String(remaining).padStart(2, "0");
  }

  function formatDateTime(value, options) {
    if (!value) return "—";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    var config = options || { dateStyle: "short", timeStyle: "short" };
    try { return new Intl.DateTimeFormat("pt-BR", config).format(date); }
    catch (_error) { return date.toLocaleString("pt-BR"); }
  }

  function formatPercent(value, digits) {
    if (value === null || value === undefined || value === "") return "—";
    var number = Number(value);
    if (!Number.isFinite(number)) return "—";
    return number.toLocaleString("pt-BR", { minimumFractionDigits: digits || 0, maximumFractionDigits: typeof digits === "number" ? digits : 1 }) + "%";
  }

  function zonedDateTimeParts(value, timezone) {
    try {
      var date = new Date(value), parts = {};
      if (Number.isNaN(date.getTime())) return null;
      new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date).forEach(function (part) { parts[part.type] = part.value; });
      return { date: parts.year + "-" + parts.month + "-" + parts.day, time: parts.hour + ":" + parts.minute, stamp: Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second)) };
    } catch (_error) { return null; }
  }

  // Mesmo contrato do materializador SQL: gap avança pela lacuna e fold
  // escolhe a ocorrência posterior. O fuso do aparelho não decide a série.
  function wallTimeToISOString(dateValue, timeValue, timezone) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue) || !/^\d{2}:\d{2}$/.test(timeValue) || !timezone) return "";
    var desired = new Date(dateValue + "T" + timeValue + ":00Z").getTime();
    if (!Number.isFinite(desired) || new Date(desired).toISOString().slice(0, 16) !== dateValue + "T" + timeValue) return "";
    var offsets = [], candidates = [];
    for (var hour = -48; hour <= 48; hour += 6) {
      var sample = desired + hour * 3600000, parts = zonedDateTimeParts(sample, timezone);
      if (!parts) return "";
      var offset = parts.stamp - sample;
      if (offsets.indexOf(offset) < 0) offsets.push(offset);
    }
    offsets.forEach(function (offset) {
      var instant = desired - offset, parts = zonedDateTimeParts(instant, timezone);
      if (parts) candidates.push({ instant: instant, shift: parts.stamp - desired });
    });
    var exact = candidates.filter(function (candidate) { return candidate.shift === 0; }).sort(function (a, b) { return b.instant - a.instant; });
    if (exact.length) return new Date(exact[0].instant).toISOString();
    var forward = candidates.filter(function (candidate) { return candidate.shift > 0 && candidate.shift <= 86400000; }).sort(function (a, b) { return a.shift - b.shift || b.instant - a.instant; });
    return forward.length ? new Date(forward[0].instant).toISOString() : "";
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeEnvelope(payload) {
    var value = Array.isArray(payload) && payload.length === 1 ? payload[0] : payload;
    if (!isPlainObject(value) || !Object.prototype.hasOwnProperty.call(value, "ok")) {
      return { ok: false, version: "ic_api_v1", data: null, meta: {}, error: { public_message: "A resposta segura desta área está fora do contrato." } };
    }
    if (Object.prototype.hasOwnProperty.call(value, "ok")) {
      return {
        ok: value.ok === true,
        version: safeText(value.version || value.versao, "ic_api_v1"),
        data: Object.prototype.hasOwnProperty.call(value, "data") ? value.data : value.dados,
        meta: isPlainObject(value.meta) ? value.meta : {},
        error: value.error || value.erro || (Array.isArray(value.errors) && value.errors.length ? value.errors[0] : null)
      };
    }
  }

  function statusTone(status) {
    var value = safeText(status, "").toLowerCase();
    if (/incomplete|incomplet|partial|parcial|unavailable|indispon/.test(value)) return "capture";
    if (/inactive|inativ|invalid|nao_valid|não_valid|unverified|nao_verific|não_verific/.test(value)) return "neutral";
    if (/limit|critical|critico|blocked|bloqueado|grave/.test(value)) return "limit";
    if (/high|elevad|risk|risco|conflict|conflito/.test(value)) return "high";
    if (/attention|atenc|warning|alerta|medium/.test(value)) return "attention";
    if (/control|complete|complet|active|ativo|inside|dentro|validado|replicado/.test(value)) return "control";
    if (/capture|captura|partial|parcial|unavailable|indispon/.test(value)) return "capture";
    return "neutral";
  }

  function validSection(value) { return SECTIONS.indexOf(value) >= 0 ? value : "visao-geral"; }
  function validReminderOffset(value) {
    if (value === null || typeof value === "undefined" || value === "") return null;
    var offset = finiteInteger(value, -1);
    return REMINDER_OFFSETS.indexOf(offset) >= 0 ? offset : null;
  }

  function validatePlannedSession(input, now) {
    var errors = {};
    var value = isPlainObject(input) ? input : {};
    var start = new Date(safeText(value.starts_at, ""));
    var reference = now instanceof Date ? now : new Date();
    if (Number.isNaN(start.getTime()) || start.getTime() <= reference.getTime()) errors.starts_at = "Escolha uma data e um horário futuros.";
    if (finiteInteger(value.duration_minutes, 0) <= 0) errors.duration_minutes = "Informe uma duração máxima válida.";
    if (unitsSign(value.loss_limit_units) <= 0) errors.loss_limit_units = "Informe um limite máximo de perda válido.";
    if (!/^[A-Z]{3}$/.test(safeText(value.currency, ""))) errors.currency = "Selecione a moeda.";
    if (validReminderOffset(value.reminder_offset_minutes) === null) errors.reminder_offset_minutes = "Selecione o momento do lembrete.";
    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  function coachResponseIsGrounded(response, facts, allowedActions) {
    if (!isPlainObject(response)) return false;
    var factIds = normalizeArray(facts).map(function (fact) { return safeText(fact && fact.id, ""); }).filter(Boolean);
    var refs = normalizeArray(response.fact_refs);
    var allowed = normalizeArray(allowedActions);
    if (!safeText(response.title, "") || !safeText(response.message, "")) return false;
    if (refs.some(function (ref) { return factIds.indexOf(String(ref)) < 0; })) return false;
    if (normalizeArray(response.actions).some(function (action) { return allowed.indexOf(action) < 0; })) return false;
    return true;
  }

  return {
    SECTIONS: SECTIONS.slice(),
    REMINDER_OFFSETS: REMINDER_OFFSETS.slice(),
    CLOCK_STATES: CLOCK_STATES.slice(),
    FEATURE_FLAGS: FEATURE_FLAGS.slice(),
    isPlainObject: isPlainObject,
    safeText: safeText,
    escapeHtml: escapeHtml,
    finiteInteger: finiteInteger,
    validUuid: validUuid,
    clamp: clamp,
    integerUnits: integerUnits,
    unitsSign: unitsSign,
    absoluteUnits: absoluteUnits,
    unitsFrom: unitsFrom,
    decimalPlacesOf: decimalPlacesOf,
    unitsRatioPercent: unitsRatioPercent,
    formatMoney: formatMoney,
    formatSignedMoney: formatSignedMoney,
    parseMoneyToUnits: parseMoneyToUnits,
    parseMoneyToUnitsText: parseMoneyToUnitsText,
    currencyCatalog: currencyCatalog,
    currencyOptions: currencyOptions,
    formatDuration: formatDuration,
    formatDateTime: formatDateTime,
    formatPercent: formatPercent,
    zonedDateTimeParts: zonedDateTimeParts,
    wallTimeToISOString: wallTimeToISOString,
    normalizeArray: normalizeArray,
    normalizeEnvelope: normalizeEnvelope,
    statusTone: statusTone,
    validSection: validSection,
    validReminderOffset: validReminderOffset,
    validatePlannedSession: validatePlannedSession,
    coachResponseIsGrounded: coachResponseIsGrounded
  };
}));
