(function (root, factory) {
  "use strict";
  var core = root.TurboTigerIC && root.TurboTigerIC.Core;
  var api = factory(core);
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Router = api;
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ic-core.js"));
}(typeof window !== "undefined" ? window : globalThis, function (Core) {
  "use strict";
  var ID_PATTERN = /^(?:\d{1,18}|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
  var SUBSECTIONS = ["banca", "sessoes", "ritmo", "apos-perdas", "pico", "horarios", "intervalos", "bonus", "risco", "laboratorio"];

  function safeId(value) { return value && ID_PATTERN.test(value) ? value : null; }
  function parse(search) {
    var params = new URLSearchParams(search || "");
    var section = Core.validSection(params.get("secao") || "visao-geral");
    var subsection = params.get("subsecao");
    if (SUBSECTIONS.indexOf(subsection) < 0 || section !== "estatisticas") subsection = null;
    return {
      section: section,
      subsection: subsection,
      sessionId: safeId(params.get("id_sessao")),
      planId: safeId(params.get("id_plano")),
      gameId: safeId(params.get("id_jogo")),
      insightId: safeId(params.get("id_insight")),
      loadGeneration: safeId(params.get("carga"))
    };
  }

  function toSearch(route, currentSearch) {
    var source = route || {};
    var params = new URLSearchParams();
    params.set("secao", Core.validSection(source.section));
    if (source.section === "estatisticas" && SUBSECTIONS.indexOf(source.subsection) >= 0) params.set("subsecao", source.subsection);
    [["id_sessao", source.sessionId], ["id_plano", source.planId], ["id_jogo", source.gameId], ["id_insight", source.insightId]].forEach(function (entry) {
      var id = safeId(entry[1]); if (id) params.set(entry[0], id);
    });
    var current = new URLSearchParams(currentSearch || "");
    var load = safeId(source.loadGeneration || current.get("carga"));
    if (load) params.set("carga", load);
    return "?" + params.toString();
  }

  return { parse: parse, toSearch: toSearch, safeId: safeId, SUBSECTIONS: SUBSECTIONS.slice() };
}));
