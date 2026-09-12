(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens["visao-geral"] = function (deps) {
    var Core = IC.Core, UI = IC.UI;

    function current() { return deps.store.getState().bootstrap; }

    function render() {
      var resource = current();
      var html = UI.sectionHeader("Visão Geral", "Seu dia, suas regras e os fatos que merecem atenção agora.", UI.button("Atualizar", { action: "retry", icon: "refresh" }));
      if (!resource || resource.status === "loading") return html + UI.state({ type: "loading", retry: false });
      if (resource.status === "error") return html + UI.state({ type: resource.error && resource.error.code === "offline" ? "offline" : "error", message: resource.error && resource.error.message, meta: resource.updatedAt ? "Última atualização: " + Core.formatDateTime(resource.updatedAt) : null });
      var data = resource.data || {};
      var today = data.today || data.resumo_hoje || {};
      var currency = today.currency || today.moeda || "";
      var decimalPlaces = Core.decimalPlacesOf(today, null);
      var netUnits = Core.unitsFrom(today, ["net_result_units_text", "resultado_liquido_unidades_texto", "net_result_units", "resultado_liquido_unidades"], null);
      var netSign = Core.unitsSign(netUnits);
      var metrics = [
        UI.metric("Resultado líquido", Core.formatSignedMoney(netUnits, currency, decimalPlaces), "Hoje", netSign < 0 ? "negative" : netSign > 0 ? "positive" : "neutral"),
        UI.metric("Tempo total", Core.formatDuration(today.total_seconds || today.tempo_total_segundos || 0), "Somando todas as Bets"),
        UI.metric("Sessões", Core.safeText(today.sessions || today.sessoes || 0), "Hoje"),
        UI.metric("Rodadas", Core.safeText(today.rounds || today.rodadas || 0), "Capturadas"),
        UI.metric("Limite diário", Core.formatPercent(today.daily_limit_percent == null ? today.limite_diario_percentual : today.daily_limit_percent), "Utilizado")
      ];
      if (deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) metrics.push(UI.metric("Próxima sessão", today.next_plan_at || today.proximo_plano_em ? Core.formatDateTime(today.next_plan_at || today.proximo_plano_em, { weekday: "short", hour: "2-digit", minute: "2-digit" }) : "Nenhuma", today.next_plan_at || today.proximo_plano_em ? "Lembrete automático configurado" : "Planeje quando fizer sentido"));
      html += '<div class="ic-page-stack"><section><div class="ic-card__header"><div><h3>Resumo de hoje</h3><p>Uma visão consolidada entre suas contas.</p></div></div><div class="ic-summary-grid">' + metrics.join("") + '</div></section>';
      var ledgers = Core.normalizeArray(today.currency_subledgers || today.subledgers);
      if (ledgers.length) html += '<section><h3>Resultados por moeda</h3><p>Moedas e escalas distintas não são somadas nem convertidas implicitamente.</p><div class="ic-grid ic-grid--cards">' + ledgers.map(function (ledger) {
        var places = Core.decimalPlacesOf(ledger, null), amount = Core.unitsFrom(ledger, ["net_result_units"], null);
        return '<article class="ic-card"><h4>' + Core.escapeHtml(ledger.currency) + '</h4>' + UI.metric("Resultado líquido", Core.formatSignedMoney(amount, ledger.currency, places)) + UI.metric("Volume apostado", Core.formatMoney(Core.unitsFrom(ledger, ["stake_volume_units", "volume_units"], null), ledger.currency, places)) + UI.badge(ledger.financial_complete === true ? "Financeiro reconciliado" : "Verifique a cobertura", ledger.financial_complete === true ? "complete" : "partial") + '</article>';
      }).join("") + '</div></section>';
      if (deps.featureEnabled("ic_personal_insights_enabled") || deps.featureEnabled("ic_session_risk_enabled")) html += renderRadar(data.radar || data.radar_antes_jogar || {});
      if (deps.featureEnabled("ic_historical_report_enabled")) html += renderHistoricalSummary(data.historical_summary || data.resumo_historico || {});
      if (deps.featureEnabled("ic_personal_insights_enabled")) html += renderInsights(data.insights || data.insights_recentes || []);
      if (deps.featureEnabled("ic_discipline_gamification_enabled")) html += renderDiscipline(data.discipline || data.disciplina || {});
      var actions = [];
      if (deps.featureEnabled("ic_planned_session_enabled") && deps.featureEnabled("ic_reminders_enabled")) actions.push(UI.button("Planejar sessão", { route: "planejar", icon: "calendar" }));
      if (deps.featureEnabled("ic_live_clock_enabled")) actions.push(UI.button("Ver sessão atual", { route: "ao-vivo", icon: "live" }));
      if (deps.featureEnabled("ic_historical_report_enabled")) actions.push(UI.button("Abrir histórico", { route: "historico", icon: "history" }));
      if (deps.featureEnabled("ic_emergency_enabled")) actions.push(UI.button("Preciso parar", { route: "regras-pausas", icon: "shield", kind: "danger" }));
      html += '<section><div class="ic-card__header"><div><h3>Ações rápidas</h3><p>Escolha o próximo passo de forma consciente.</p></div></div><div class="ic-quick-actions">' + actions.join("") + '</div></section></div>';
      return html;
    }

    function renderHistoricalSummary(summary) {
      var overall = summary.overall || {}, sessions = summary.sessions || {}, games = Core.normalizeArray(summary.games);
      if (!overall.rodadas && !overall.rounds) return "";
      var currency = overall.moeda || overall.currency || "BRL", places = Number(overall.casas == null ? 2 : overall.casas);
      var result = overall.resultado == null ? null : String(overall.resultado);
      var topGames = games.slice(0, 4).map(function (game) {
        return '<article class="ic-card"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(game.jogo || game.game) + '</h3><p>' + Core.safeText(game.rodadas || 0) + ' rodadas · ' + Core.safeText(game.sessoes || 0) + ' sessões</p></div>' + UI.badge("até " + Core.safeText(game.maior_multiplicador || 0) + "x", "neutral") + '</div><div class="ic-list">' + UI.listRow("Retorno observado", "Histórico deste jogo", Core.formatPercent(game.rtp, 2)) + UI.listRow("Resultado líquido", "No conjunto analisado", Core.formatSignedMoney(String(game.resultado), currency, places)) + UI.listRow("Premiações relevantes", "5x / 10x / 20x / 50x / 100x", [game.m5, game.m10, game.m20, game.m50, game.m100].map(Core.safeText).join(" / ")) + UI.listRow("Perdas disfarçadas de ganho", "Retorno maior que zero, mas menor que a aposta", Core.safeText(game.perdas_disfarcadas || 0)) + '</div></article>';
      }).join("");
      return '<section><div class="ic-card__header"><div><h3>Base histórica em análise</h3><p>Os testes já alimentam a inteligência desde o primeiro usuário.</p></div>' + UI.badge("exploratório", "neutral") + '</div>' + UI.banner("Base experimental inicial Turbo Tiger", "Os números descrevem o histórico capturado. Eles não preveem a próxima rodada.", "neutral") + '<div class="ic-summary-grid">' + UI.metric("Rodadas", Core.safeText(overall.rodadas || overall.rounds), "Em " + Core.safeText(overall.sessoes || 0) + " sessões") + UI.metric("Resultado acumulado", Core.formatSignedMoney(result, currency, places), "A média por sessão é diferente do total", Number(result) < 0 ? "negative" : "positive") + UI.metric("Sessão mediana", Core.formatSignedMoney(String(sessions.resultado_mediano || 0), currency, places), "Metade ficou abaixo e metade acima") + UI.metric("Multiplicador máximo", Core.safeText(overall.maior_multiplicador || 0) + "x", "Maior coeficiente observado") + UI.metric("Premiações ≥ 100x", Core.safeText(overall.m100 || 0), "Eventos extremos") + UI.metric("Perdas disfarçadas", Core.safeText(overall.perdas_disfarcadas || 0), "Retorno parcial com perda líquida") + '</div><div class="ic-grid ic-grid--cards">' + topGames + '</div><div class="ic-disclaimer">Retorno total elevado pode depender de poucos prêmios extremos. As telas de Estatísticas e Comunidade mostram amostra, concentração e resultado sem o maior pagamento.</div></section>';
    }

    function renderRadar(radar) {
      var status = radar.status || radar.estado || "insufficient_data";
      var tone = Core.statusTone(status);
      var titleMap = { control: "Dentro das suas regras", attention: "Exige atenção", high: "Conflito com uma regra", neutral: "Dados insuficientes" };
      var facts = Core.normalizeArray(radar.facts || radar.fatos);
      var factHtml = facts.length ? '<div class="ic-list">' + facts.map(function (fact) { return UI.listRow(fact.label || fact.rotulo || "Fato", fact.detail || fact.detalhe || "", fact.value || fact.valor || ""); }).join("") + '</div>' : UI.banner("Ainda estamos conhecendo seu padrão", radar.message || radar.mensagem || "O Radar será apresentado quando houver contexto confiável.", "neutral");
      return '<section class="ic-card ic-card--raised"><div class="ic-radar"><div class="ic-radar__status"><div class="ic-radar__icon">' + UI.icon(tone === "control" ? "check" : tone === "neutral" ? "info" : "alert") + '</div><div class="ic-radar__text"><h3>Radar antes de jogar · ' + Core.escapeHtml(radar.title || radar.titulo || titleMap[tone] || titleMap.neutral) + '</h3><p>' + Core.escapeHtml(radar.summary || radar.resumo || "Avaliação baseada em limites, intervalo, sessões do dia e qualidade dos dados.") + '</p></div></div>' + factHtml + (radar.behavioral_risk || radar.risco_comportamental ? UI.evidence(radar.evidence || radar.evidencia || {}) : '') + '</div></section>';
    }

    function renderInsights(insights) {
      var items = Core.normalizeArray(insights).slice(0, 3);
      var body = items.length ? '<div class="ic-grid ic-grid--cards">' + items.map(function (item, index) {
        var kind = item.kind || item.tipo || "quality";
        return '<article class="ic-card ic-insight ic-insight--' + Core.escapeHtml(kind === "positive" || kind === "disciplina" ? "positive" : kind === "risk" || kind === "risco" ? "risk" : "quality") + '"><div class="ic-card__header"><div><h3>' + Core.escapeHtml(item.title || item.titulo || "Insight") + '</h3><p>' + Core.escapeHtml(item.message || item.mensagem || "") + '</p></div>' + UI.badge(item.evidence_status || item.status_evidencia || "descritivo", item.evidence_status || item.status_evidencia) + '</div>' + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-card__footer">' + UI.button("Entender", { action: "understand", value: index, icon: "info" }) + '</div></article>';
      }).join("") + '</div>' : UI.state({ type: "insufficient_data", title: "Ainda não há insights confiáveis", message: "Fatos pessoais aparecerão aqui quando atingirem os critérios mínimos de qualidade.", retry: false });
      return '<section><div class="ic-card__header"><div><h3>Insights recentes</h3><p>No máximo três fatos priorizados, sempre com amostra e status.</p></div></div>' + body + '</section>';
    }

    function renderDiscipline(discipline) {
      var items = Core.normalizeArray(discipline.items || discipline.itens || discipline.achievements || discipline.conquistas);
      if (!items.length) return "";
      return '<section><div class="ic-card__header"><div><h3>Disciplina</h3><p>Reconhecimento por cumprir seus próprios compromissos, nunca por apostar mais.</p></div></div><div class="ic-grid ic-grid--cards">' + items.slice(0, 3).map(function (item) { return '<article class="ic-card"><h3>' + Core.escapeHtml(item.title || item.titulo || "Compromisso respeitado") + '</h3><p>' + Core.escapeHtml(item.message || item.mensagem || "") + '</p>' + UI.evidence(item.evidence || item.evidencia || item) + '</article>'; }).join("") + '</div></section>';
    }

    function handleAction(action, value) {
      if (action === "retry") return deps.loadBootstrap(true);
      if (action === "understand") {
        var data = current() && current().data || {};
        var item = Core.normalizeArray(data.insights)[Number(value)];
        if (!item) return;
        UI.openSheet({ eyebrow: item.evidence_status || item.status_evidencia || "Evidência", title: item.title || item.titulo || "Entenda este fato", html: UI.banner(item.title || item.titulo || "Insight", item.explanation || item.explicacao || item.message || item.mensagem || "", item.kind || item.tipo) + UI.evidence(item.evidence || item.evidencia || item) + '<div class="ic-disclaimer">Este é um fato descritivo do histórico. Resultados anteriores não indicam nem garantem resultados futuros.</div>' });
      }
    }

    return { render: render, load: function () { return deps.loadBootstrap(false); }, handleAction: handleAction };
  };
}(window));
