(function (root, factory) {
  "use strict";
  var engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  else root.TurboTigerCompareEngine = engine;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  var MAX = 10000000;
  function fail(message) { throw new Error(message); }
  function cents(value) {
    if (!Number.isSafeInteger(value) || value < 0 || value > MAX) fail("Valor inválido: use até R$ 100.000,00, com duas casas decimais.");
    return value;
  }
  function odd(value) {
    var n = Number(value), scaled = Math.round(n * 10000);
    if (!Number.isFinite(n) || n <= 1 || n > 100000 || Math.abs(n * 10000 - scaled) > 0.00001) fail("Informe odds maiores que 1, até 100.000, com no máximo quatro casas decimais.");
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
    if (!budget || reserve > budget) fail("O orçamento deve ser positivo e a reserva não pode ultrapassá-lo.");
    if (!Array.isArray(input.games) || input.games.length < 1 || input.games.length > 3) fail("Escolha de um a três confrontos.");
    if (!["auto", "manual"].includes(input.mode)) fail("Modo de distribuição inválido.");
    var ids = new Set();
    var games = input.games.map(function (g) {
      if (!Number.isSafeInteger(g.id) || g.id <= 0 || ids.has(g.id)) fail("Escolha confrontos diferentes.");
      ids.add(g.id);
      if (!Array.isArray(g.odds) || g.odds.length !== 3) fail("Preencha as três odds de cada confronto.");
      var scaled = g.odds.map(odd);
      return { id: g.id, name: String(g.name || "Confronto"), odds: scaled.map(function (o) { return o / 10000; }), scaled: scaled,
        index: scaled.reduce(function (s, o) { return s + 10000 / o; }, 0), stakes: [] };
    });
    var allocated = budget - reserve;
    if (input.mode === "auto") {
      var minimum = input.includeAll ? cents(input.minimum) : 0;
      if (input.includeAll && minimum < 3) fail("Defina um mínimo por confronto de pelo menos R$ 0,03.");
      if (minimum * games.length > allocated) fail("O mínimo por confronto ultrapassa o valor disponível para distribuir.");
      var best = games.reduce(function (a, g, i) { return g.index < games[a].index ? i : a; }, 0);
      games.forEach(function (g, i) { g.stakes = balance(minimum + (i === best ? allocated - minimum * games.length : 0), g.scaled); });
    } else {
      games.forEach(function (g, i) {
        var values = input.games[i].stakes;
        if (!Array.isArray(values) || values.length !== 3) fail("Preencha os três valores de cada confronto.");
        g.stakes = values.map(cents);
      });
      allocated = games.reduce(function (s, g) { return s + g.stakes.reduce(function (a, b) { return a + b; }, 0); }, 0);
      if (allocated > budget - reserve) fail("Os valores ultrapassam o orçamento disponível, descontada a reserva mínima.");
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
    if (!Number.isFinite(limit) || limit < 0 || limit > 100) fail("O limite de perda deve ficar entre 0% e 100%.");
    return { version: 1, budget: budget, allocated: allocated, reserve: reserve, games: games.map(function (g) { delete g.scaled; return g; }),
      scenarios: scenarios, worst: worst, best: bestNet, maximumLoss: Math.max(0, -worst),
      withinLimit: Math.max(0, -worst) <= budget * limit / 100,
      positiveCount: scenarios.filter(function (s) { return s.net > 0; }).length };
  }
  return { calculate: calculate };
});
