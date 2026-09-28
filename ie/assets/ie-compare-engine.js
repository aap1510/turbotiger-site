(function (root, factory) {
  "use strict";
  var engine = factory(root);
  if (typeof module === "object" && module.exports) module.exports = engine;
  else root.TurboTigerCompareEngine = engine;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";
  var fontesLegendasComparador = {
    "legenda_ie_comparador_valor_invalido_use_ate_r_100_000_00_com_duas_casas_decimais": "Valor inválido: use até R$ 100.000,00, com duas casas decimais.",
    "legenda_ie_comparador_informe_odds_maiores_que_1_ate_100_000_com_no_maximo_quatro_casas_decimais": "Informe odds maiores que 1, até 100.000, com no máximo quatro casas decimais.",
    "legenda_ie_comparador_o_orcamento_deve_ser_positivo_e_a_reserva_nao_pode_ultrapassa_lo": "O orçamento deve ser positivo e a reserva não pode ultrapassá-lo.",
    "legenda_ie_comparador_escolha_de_um_a_tres_confrontos": "Escolha de um a três confrontos.",
    "legenda_ie_comparador_modo_de_distribuicao_invalido": "Modo de distribuição inválido.",
    "legenda_ie_comparador_escolha_confrontos_diferentes": "Escolha confrontos diferentes.",
    "legenda_ie_comparador_preencha_as_tres_odds_de_cada_confronto": "Preencha as três odds de cada confronto.",
    "legenda_ie_comparador_confronto": "Confronto",
    "legenda_ie_comparador_defina_um_minimo_por_confronto_de_pelo_menos_r_0_03": "Defina um mínimo por confronto de pelo menos R$ 0,03.",
    "legenda_ie_comparador_o_minimo_por_confronto_ultrapassa_o_valor_disponivel_para_distribuir": "O mínimo por confronto ultrapassa o valor disponível para distribuir.",
    "legenda_ie_comparador_preencha_os_tres_valores_de_cada_confronto": "Preencha os três valores de cada confronto.",
    "legenda_ie_comparador_os_valores_ultrapassam_o_orcamento_disponivel_descontada_a_reserva_minima": "Os valores ultrapassam o orçamento disponível, descontada a reserva mínima.",
    "legenda_ie_comparador_o_limite_de_perda_deve_ficar_entre_0_e_100": "O limite de perda deve ficar entre 0% e 100%."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasComparador);
  function legendaComparador(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasComparador[chave]; }
  var MAX = 10000000;
  function fail(message) { throw new Error(message); }
  function cents(value) {
    if (!Number.isSafeInteger(value) || value < 0 || value > MAX) fail(legendaComparador("legenda_ie_comparador_valor_invalido_use_ate_r_100_000_00_com_duas_casas_decimais"));
    return value;
  }
  function odd(value) {
    var n = Number(value), scaled = Math.round(n * 10000);
    if (!Number.isFinite(n) || n <= 1 || n > 100000 || Math.abs(n * 10000 - scaled) > 0.00001) fail(legendaComparador("legenda_ie_comparador_informe_odds_maiores_que_1_ate_100_000_com_no_maximo_quatro_casas_decimais"));
    return scaled;
  }
  function payout(stake, scaled) { return Number(BigInt(stake) * BigInt(scaled) / 10000n); }
  // For a fixed allocation, find the largest attainable minimum return in cents.
  function balance(total, odds) {
    var lo = 0, hi = Math.floor(total / odds.reduce(function (s, o) { return s + 10000 / o; }, 0)) + 1;
    function required(target) { return odds.map(function (o) { return Number((BigInt(target) * 10000n + BigInt(o) - 1n) / BigInt(o)); }); }
    while (lo + 1 < hi) {
      var mid = Math.floor((lo + hi) / 2);
      if (required(mid).reduce(function (a, b) { return a + b; }, 0) <= total) lo = mid;
      else hi = mid;
    }
    var stakes = required(lo), remaining = total - stakes.reduce(function (a, b) { return a + b; }, 0);
    var weight = odds.reduce(function (s, o) { return s + 1 / o; }, 0);
    var extra = odds.map(function (o) { return Math.floor(remaining / o / weight); });
    extra.forEach(function (v, i) { stakes[i] += v; });
    remaining -= extra.reduce(function (a, b) { return a + b; }, 0);
    for (var k = 0; k < remaining; k++) stakes[k % 3]++;
    return stakes;
  }
  function calculate(input) {
    var budget = cents(input.budget), reserve = cents(input.reserve || 0);
    if (!budget || reserve > budget) fail(legendaComparador("legenda_ie_comparador_o_orcamento_deve_ser_positivo_e_a_reserva_nao_pode_ultrapassa_lo"));
    if (!Array.isArray(input.games) || input.games.length < 1 || input.games.length > 3) fail(legendaComparador("legenda_ie_comparador_escolha_de_um_a_tres_confrontos"));
    if (!["auto", "manual"].includes(input.mode)) fail(legendaComparador("legenda_ie_comparador_modo_de_distribuicao_invalido"));
    var ids = new Set();
    var games = input.games.map(function (g) {
      if (!Number.isSafeInteger(g.id) || g.id <= 0 || ids.has(g.id)) fail(legendaComparador("legenda_ie_comparador_escolha_confrontos_diferentes"));
      ids.add(g.id);
      if (!Array.isArray(g.odds) || g.odds.length !== 3) fail(legendaComparador("legenda_ie_comparador_preencha_as_tres_odds_de_cada_confronto"));
      var scaled = g.odds.map(odd);
      return { id: g.id, name: String(g.name || legendaComparador("legenda_ie_comparador_confronto")), odds: scaled.map(function (o) { return o / 10000; }), scaled: scaled,
        index: scaled.reduce(function (s, o) { return s + 10000 / o; }, 0), stakes: [] };
    });
    var allocated = budget - reserve;
    if (input.mode === "auto") {
      var minimum = input.includeAll ? cents(input.minimum) : 0;
      if (input.includeAll && minimum < 3) fail(legendaComparador("legenda_ie_comparador_defina_um_minimo_por_confronto_de_pelo_menos_r_0_03"));
      if (minimum * games.length > allocated) fail(legendaComparador("legenda_ie_comparador_o_minimo_por_confronto_ultrapassa_o_valor_disponivel_para_distribuir"));
      var best = games.reduce(function (a, g, i) { return g.index < games[a].index ? i : a; }, 0);
      games.forEach(function (g, i) { g.stakes = balance(minimum + (i === best ? allocated - minimum * games.length : 0), g.scaled); });
    } else {
      games.forEach(function (g, i) {
        var values = input.games[i].stakes;
        if (!Array.isArray(values) || values.length !== 3) fail(legendaComparador("legenda_ie_comparador_preencha_os_tres_valores_de_cada_confronto"));
        g.stakes = values.map(cents);
      });
      allocated = games.reduce(function (s, g) { return s + g.stakes.reduce(function (a, b) { return a + b; }, 0); }, 0);
      if (allocated > budget - reserve) fail(legendaComparador("legenda_ie_comparador_os_valores_ultrapassam_o_orcamento_disponivel_descontada_a_reserva_minima"));
      reserve = budget - allocated;
    }
    var scenarios = [{ outcomes: [], returns: 0 }];
    games.forEach(function (g) {
      var next = [];
      scenarios.forEach(function (s) { g.odds.forEach(function (_, i) {
        next.push({ outcomes: s.outcomes.concat(i), returns: s.returns + payout(g.stakes[i], g.scaled[i]) });
      }); });
      scenarios = next;
    });
    scenarios.forEach(function (s) { s.net = s.returns - allocated; s.balance = reserve + s.returns; });
    var worst = Math.min.apply(null, scenarios.map(function (s) { return s.net; }));
    var bestNet = Math.max.apply(null, scenarios.map(function (s) { return s.net; }));
    var limit = Number(input.lossLimit);
    if (!Number.isFinite(limit) || limit < 0 || limit > 100) fail(legendaComparador("legenda_ie_comparador_o_limite_de_perda_deve_ficar_entre_0_e_100"));
    return { version: 1, budget: budget, allocated: allocated, reserve: reserve, games: games.map(function (g) { delete g.scaled; return g; }),
      scenarios: scenarios, worst: worst, best: bestNet, maximumLoss: Math.max(0, -worst),
      withinLimit: Math.max(0, -worst) <= budget * limit / 100,
      positiveCount: scenarios.filter(function (s) { return s.net > 0; }).length };
  }
  return { calculate: calculate };
});
