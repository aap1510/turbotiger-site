(function () {
  "use strict";
  window.TurboTigerCompare = function (api) {
    var host = api.host, revision = 0, games = [], catalog = [], saved = [], offset = 0, previous = null, result = null, busy = false;
    var settings = defaults();
    var labels = ["Casa", "Empate", "Fora"], codes = ["casa", "empate", "fora"];
    function defaults() { return { budget: 10000, reserve: 0, minimum: 0, lossLimit: 10, mode: "auto", includeAll: false, rulesAccepted: false }; }
    function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function money(cents) { return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
    function number(value) { return String(value).replace(".", ","); }
    function parse(value, currency) {
      var text = String(value).trim().replace(",", ".");
      if (!/^\d+(?:\.\d+)?$/.test(text)) throw new Error("Preencha os valores numéricos sem separador de milhares.");
      if (currency && !/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error("Valores em reais devem ter no máximo duas casas decimais.");
      return currency ? Math.round(Number(text) * 100) : Number(text);
    }
    function active(r) { return revision === r && host.getAttribute("data-detail-view") === "compare" && api.active(); }
    function status(message) { var el = host.querySelector("[data-cmp-status]"); if (el) el.textContent = message; }
    function field(key, title, value, currency) { return '<label>' + title + '<input inputmode="decimal" data-cmp-setting="' + key + '" value="' + esc(number(currency ? value / 100 : value)) + '"></label>'; }
    function snapshot() {
      return Object.assign({}, settings, { version: 1, games: games.map(function (g) { return { id: g.id, name: g.name, odds: g.odds.slice(), houses: g.houses.slice(), stakes: g.stakes.slice() }; }) });
    }
    function capture() {
      host.querySelectorAll("[data-cmp-setting]").forEach(function (el) {
        var key = el.dataset.cmpSetting;
        settings[key] = el.type === "checkbox" ? el.checked : key === "mode" ? el.value : parse(el.value, ["budget", "reserve", "minimum"].includes(key));
      });
      host.querySelectorAll("[data-cmp-game]").forEach(function (el) {
        var g = games[Number(el.dataset.cmpGame)], i = Number(el.dataset.side), key = el.dataset.value;
        g[key][i] = key === "houses" ? Number(el.value) : el.value.trim() === '' ? 0 : parse(el.value, key === "stakes");
      });
    }
    function housesHtml(g, i) {
      var list = g.authorized || [];
      var html = '<option value="0">Selecione a casa</option>';
      if (g.houses[i] && !list.some(function (b) { return Number(b.id_bet) === g.houses[i]; })) html += '<option value="' + g.houses[i] + '">Casa salva — revalide antes de salvar</option>';
      return html + list.map(function (b) { return '<option value="' + Number(b.id_bet) + '">' + esc(b.bet) + '</option>'; }).join("");
    }
    function render() {
      result = null;
      host.innerHTML = '<section class="ie-compare"><p>Apostas simples, em até três confrontos diferentes. Somente resultado 1X2 nos 90 minutos mais acréscimos, sem prorrogação ou pênaltis.</p>'
        + '<div class="ie-compare-settings">' + field("budget", "Orçamento total (R$)", settings.budget, true) + field("reserve", "Reserva mínima (R$)", settings.reserve, true)
        + field("lossLimit", "Limite de perda sobre o orçamento (%)", settings.lossLimit, false)
        + '<label>Distribuição<select data-cmp-setting="mode"><option value="auto">Automática — reduzir pior perda</option><option value="manual">Manual — testar meus valores</option></select></label></div>'
        + '<div class="ie-compare-auto"' + (settings.mode === "manual" ? ' hidden' : '') + '><label><input type="checkbox" data-cmp-setting="includeAll"' + (settings.includeAll ? ' checked' : '') + '> Incluir todos os confrontos</label>'
        + field("minimum", "Mínimo distribuído por confronto (R$)", settings.minimum, true) + '<p>Sem essa exigência, a distribuição automática pode concentrar o valor em um único jogo. O mínimo não é uma recomendação de valor.</p></div>'
        + '<div class="ie-compare-games">' + games.map(function (g, j) {
          return '<fieldset><legend>' + esc(g.name) + '</legend><p>' + esc(g.source || "Odds informadas pelo usuário; disponibilidade não confirmada.") + '</p>'
            + labels.map(function (label, i) { return '<div class="ie-compare-leg"><strong>' + label + '</strong><label>Casa autorizada<select data-cmp-game="' + j + '" data-side="' + i + '" data-value="houses">' + housesHtml(g, i) + '</select></label><label>Odd<input inputmode="decimal" data-cmp-game="' + j + '" data-side="' + i + '" data-value="odds" value="' + esc(number(g.odds[i] || "")) + '"></label><label' + (settings.mode === "auto" ? ' hidden' : '') + '>Valor (R$)<input inputmode="decimal" data-cmp-game="' + j + '" data-side="' + i + '" data-value="stakes" value="' + esc(number(g.stakes[i] / 100)) + '"></label></div>'; }).join("")
            + '<button type="button" class="ie-button ie-button-secondary" data-cmp-remove="' + j + '">Remover confronto</button></fieldset>';
        }).join("") + '</div>'
        + '<div class="ie-compare-add"><label>Adicionar confronto<select data-cmp-picker><option value="">Selecione um próximo jogo acompanhado</option>' + catalog.filter(function (g) { return !games.some(function (s) { return s.id === g.id; }); }).map(function (g) { return '<option value="' + g.id + '">' + esc(g.name) + '</option>'; }).join("") + '</select></label><button type="button" class="ie-button ie-button-secondary" data-cmp-action="add"' + (games.length >= 3 ? ' disabled' : '') + '>Adicionar</button></div>'
        + '<p>As cotações são editáveis. Não multiplicamos odds de jogos diferentes: os retornos das apostas simples são somados. Mais jogos não significam menor risco.</p>'
        + '<label class="ie-compare-confirm"><input type="checkbox" data-cmp-setting="rulesAccepted"' + (settings.rulesAccepted ? ' checked' : '') + '> Conferi que as três opções de cada jogo pertencem ao mesmo mercado e período. Entendo que o aplicativo não confirma regras, limites nem aceitação das apostas.</label>'
        + '<p class="ie-compare-warning">Resultados condicionais: sem taxas, impostos, anulações ou recusas. Odds podem mudar. Esta ferramenta não executa apostas nem garante ausência de perdas.</p>'
        + '<div class="ie-compare-actions"><button type="button" class="ie-button ie-button-primary" data-cmp-action="calculate">Comparar cenários</button><button type="button" class="ie-button ie-button-secondary" data-cmp-action="list">Versões salvas</button></div>'
        + '<p data-cmp-status role="status"></p><div data-cmp-result></div><div class="ie-compare-save"><label>Nome da versão<input maxlength="80" data-cmp-name value="Comparação de confrontos"></label><button type="button" class="ie-button ie-button-secondary" data-cmp-action="save" disabled>Salvar nova versão</button></div></section>';
      host.querySelector('[data-cmp-setting="mode"]').value = settings.mode;
      host.querySelectorAll('[data-value="houses"]').forEach(function (el) { el.value = games[Number(el.dataset.cmpGame)].houses[Number(el.dataset.side)]; });
    }
    function metrics(r) {
      return '<dl class="ie-compare-metrics"><div><dt>Distribuído</dt><dd>' + money(r.allocated) + '</dd></div><div><dt>Reserva não apostada</dt><dd>' + money(r.reserve) + '</dd></div><div><dt>Pior resultado líquido</dt><dd>' + money(r.worst) + '</dd></div><div><dt>Melhor resultado líquido</dt><dd>' + money(r.best) + '</dd></div><div><dt>Menor saldo final</dt><dd>' + money(r.budget + r.worst) + '</dd></div><div><dt>Perda máxima</dt><dd>' + money(r.maximumLoss) + '</dd></div></dl>';
    }
    function showResult() {
      var r = result, el = host.querySelector("[data-cmp-result]");
      el.innerHTML = '<h3>Impacto financeiro calculado</h3>' + metrics(r)
        + '<p class="ie-compare-warning">' + (r.withinLimit ? 'Dentro do limite de perda informado, somente nas condições simuladas.' : 'O limite de perda informado não é atendido por esta distribuição.') + '</p>'
        + '<p>' + r.positiveCount + ' de ' + r.scenarios.length + ' cenários têm resultado positivo. Essa contagem não representa probabilidade de lucro.</p>'
        + (settings.mode === 'auto' ? '<p>A distribuição busca reduzir a pior perda. O arredondamento para centavos pode impedir a distribuição matematicamente ideal. A reserva é uma escolha sua, não uma proteção criada pelas odds.</p>' : '')
        + '<div class="ie-compare-table"><table><caption>Valores por confronto e resultado</caption><thead><tr><th>Confronto</th><th>Casa</th><th>Empate</th><th>Fora</th></tr></thead><tbody>'
        + r.games.map(function (g) { return '<tr><th>' + esc(g.name) + '</th>' + g.stakes.map(function (v) { return '<td>' + money(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'
        + '<div class="ie-compare-actions"><button type="button" class="ie-button ie-button-secondary" data-cmp-action="use-manual">Editar esta distribuição</button><label><input type="checkbox" data-cmp-losses> Mostrar somente cenários de perda</label></div>'
        + '<div class="ie-compare-settings">' + r.games.map(function (g, i) { return '<label>' + esc(g.name) + '<select data-cmp-outcome="' + i + '"><option value="">Qualquer resultado</option>' + labels.map(function (l, j) { return '<option value="' + j + '">' + l + '</option>'; }).join('') + '</select></label>'; }).join('') + '</div><div data-cmp-scenarios></div>';
      showScenarios();
      host.querySelector('[data-cmp-action="save"]').disabled = false;
    }
    function showScenarios() {
      if (!result) return;
      var filters = Array.from(host.querySelectorAll('[data-cmp-outcome]')).map(function (el) { return el.value; });
      var losses = host.querySelector('[data-cmp-losses]').checked;
      var rows = result.scenarios.filter(function (s) { return (!losses || s.net < 0) && s.outcomes.every(function (v, i) { return filters[i] === '' || Number(filters[i]) === v; }); });
      host.querySelector('[data-cmp-scenarios]').innerHTML = '<div class="ie-compare-table"><table><caption>' + rows.length + ' cenários exibidos · sem probabilidades estimadas</caption><thead><tr>' + result.games.map(function (_, i) { return '<th>Jogo ' + (i + 1) + '</th>'; }).join('') + '<th>Saldo final</th><th>Líquido</th></tr></thead><tbody>' + rows.map(function (s) { return '<tr>' + s.outcomes.map(function (v) { return '<td>' + labels[v] + '</td>'; }).join('') + '<td>' + money(s.balance) + '</td><td>' + money(s.net) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
    function check() {
      capture();
      if (!settings.rulesAccepted) throw new Error('Confirme o período e as regras antes de calcular.');
      games.forEach(function (g) {
        if (!g.current || !Number.isFinite(api.now()) || !Number.isFinite(Date.parse(g.start)) || Date.parse(g.start) <= api.now()) throw new Error('Este confronto precisa ser revalidado ou já começou. Adicione um próximo jogo; versões anteriores permanecem apenas para consulta.');
        if (!g.authorizationValid || g.houses.some(function (id) { return !(g.authorized || []).some(function (b) { return Number(b.id_bet) === id; }); })) throw new Error('Selecione casas brasileiras autorizadas para as três opções.');
      });
      result = window.TurboTigerCompareEngine.calculate(snapshot());
      showResult();
      status('Cálculo atualizado com os valores informados.');
    }
    async function add(id) {
      if (games.length >= 3 || games.some(function (g) { return g.id === id; })) throw new Error('Escolha até três confrontos diferentes.');
      var r = revision, context = await api.rpc('ie_comparacao_contexto_rpc', { p_id_evento: id });
      if (!active(r)) return;
      if (!(context.mercados || []).some(function (m) { return m.codigo_mercado === 'resultado_1x2' && m.periodo_codigo === '90_minutos' && m.habilitado_simulacao; })) throw new Error('Este confronto não possui mercado 1X2 de 90 minutos habilitado.');
      var item = catalog.find(function (g) { return g.id === id; });
      var g = { id: id, name: item ? item.name : api.title(context.evento), odds: [0, 0, 0], stakes: [0, 0, 0], houses: [0, 0, 0], authorized: context.casas_autorizadas || [], authorizationValid: context.autorizacao_snapshot_valido === true, current: true, start: context.evento.data_inicio, source: 'Preencha as odds observadas. Dados de referência não confirmam disponibilidade na casa.' };
      games.push(g); render();
    }
    async function list() {
      var r = revision, response = await api.rpc('ie_comparacoes_listar_rpc', { p_offset: offset });
      if (!active(r)) return;
      saved = response.itens || [];
      host.innerHTML = '<section class="ie-compare"><p>Versões pessoais preservadas com as odds digitadas. Reabrir não atualiza as cotações nem confirma disponibilidade.</p><div class="ie-compare-saved">' + saved.map(function (s, i) { return '<article><label><input type="checkbox" data-cmp-version="' + i + '"> ' + esc(s.nome) + ' · ' + esc(new Date(s.criado_em).toLocaleString('pt-BR')) + '</label><button class="ie-button ie-button-secondary" data-cmp-load="' + i + '">Consultar / editar</button></article>'; }).join('') + '</div><div class="ie-compare-actions"><button class="ie-button ie-button-secondary" data-cmp-action="compare-versions">Comparar duas versões</button><button class="ie-button ie-button-secondary" data-cmp-action="previous"' + (offset === 0 ? ' disabled' : '') + '>Anteriores</button><button class="ie-button ie-button-secondary" data-cmp-action="next"' + (saved.length < 20 ? ' disabled' : '') + '>Próximas</button><button class="ie-button ie-button-secondary" data-cmp-action="editor">Voltar ao editor</button></div><p data-cmp-status role="status"></p><div data-cmp-versions-result></div></section>';
    }
    async function load(index) {
      var s = saved[index], data = s.entrada, r = revision;
      previous = s.id; settings = Object.assign({}, data); delete settings.games; settings.rulesAccepted = false;
      games = data.games.map(function (g) { return Object.assign({}, g, { current: false, source: 'Versão salva: odds preservadas, não atualizadas.' }); });
      render(); result = window.TurboTigerCompareEngine.calculate(snapshot()); showResult();
      host.querySelector('[data-cmp-action="save"]').disabled = true;
      status('Consultando versão salva. Revalidando confrontos e lista de casas, sem alterar odds...');
      await Promise.all(games.map(async function (g) {
        try {
          var c = await api.rpc('ie_comparacao_contexto_rpc', { p_id_evento: g.id });
          if (!active(r)) return;
          g.authorized = c.casas_autorizadas || []; g.authorizationValid = c.autorizacao_snapshot_valido === true;
          g.start = c.evento.data_inicio; g.current = Date.parse(g.start) > api.now();
        } catch (_) { g.current = false; }
      }));
      if (!active(r)) return;
      render(); host.querySelector('[data-cmp-name]').value = s.nome;
      result = window.TurboTigerCompareEngine.calculate(snapshot()); showResult();
      host.querySelector('[data-cmp-action="save"]').disabled = true;
      status('Versão histórica. Para salvar alterações, confira os dados e clique em Comparar cenários.');
    }
    host.addEventListener('input', function (event) {
      if (!event.target.matches('[data-cmp-setting], [data-cmp-game]')) return;
      result = null;
      var output = host.querySelector('[data-cmp-result]'); if (output) output.innerHTML = '';
      var save = host.querySelector('[data-cmp-action="save"]'); if (save) save.disabled = true;
      status('Valores alterados. Recalcule para atualizar os cenários.');
    });
    host.addEventListener('change', function (event) {
      if (event.target.matches('[data-cmp-losses], [data-cmp-outcome]')) { showScenarios(); return; }
      if (event.target.matches('[data-cmp-setting="mode"]')) {
        // Keep partially entered odds when changing modes; full validation occurs on calculate.
        settings.mode = event.target.value;
        host.querySelector('.ie-compare-auto').hidden = settings.mode === 'manual';
        host.querySelectorAll('[data-value="stakes"]').forEach(function (el) { el.parentElement.hidden = settings.mode === 'auto'; });
      }
    });
    host.addEventListener('click', async function (event) {
      var button = event.target.closest('[data-cmp-action], [data-cmp-remove], [data-cmp-load]');
      if (!button || busy) return;
      event.preventDefault(); event.stopPropagation(); busy = true; host.inert = true; var r = revision;
      try {
        if (button.hasAttribute('data-cmp-load')) { await load(Number(button.dataset.cmpLoad)); return; }
        if (button.hasAttribute('data-cmp-remove')) { capture(); games.splice(Number(button.dataset.cmpRemove), 1); render(); return; }
        var action = button.dataset.cmpAction;
        if (action === 'calculate') check();
        if (action === 'add') { if (games.length) capture(); var id = Number(host.querySelector('[data-cmp-picker]').value); if (!id) throw new Error('Selecione um confronto.'); await add(id); }
        if (action === 'list' || action === 'next' || action === 'previous') { if (action === 'list') { if (games.length) capture(); offset = 0; } else offset = Math.max(0, offset + (action === 'next' ? 20 : -20)); await list(); }
        if (action === 'editor') render();
        if (action === 'use-manual' && result) { games.forEach(function (g, i) { g.stakes = result.games[i].stakes.slice(); }); settings.mode = 'manual'; render(); }
        if (action === 'compare-versions') {
          var selected = Array.from(host.querySelectorAll('[data-cmp-version]:checked'));
          if (selected.length !== 2) throw new Error('Selecione exatamente duas versões desta página.');
          host.querySelector('[data-cmp-versions-result]').innerHTML = selected.map(function (el) { var s = saved[Number(el.dataset.cmpVersion)]; return '<h3>' + esc(s.nome) + '</h3>' + metrics(window.TurboTigerCompareEngine.calculate(s.entrada)); }).join('') + '<p>Orçamentos e confrontos podem ser diferentes. Compare as premissas, não apenas os valores finais.</p>';
        }
        if (action === 'save') {
          check(); button.disabled = true;
          var answer = await api.rpc('ie_comparacao_salvar_rpc', { p_nome: host.querySelector('[data-cmp-name]').value, p_entrada: snapshot(), p_id_anterior: previous });
          if (active(r)) { previous = answer.id; status('Nova versão salva na sua conta. Não há monitoramento ou sininho para odds digitadas.'); }
        }
      } catch (error) { if (active(r)) status(api.error(error)); }
      finally { if (revision === r) { busy = false; host.inert = false; if (result && host.querySelector('[data-cmp-action="save"]')) host.querySelector('[data-cmp-action="save"]').disabled = false; } }
    });
    return {
      reset: function () { revision++; games = []; saved = []; catalog = []; settings = defaults(); previous = null; result = null; busy = false; host.inert = false; },
      open: async function (initialId) {
        this.reset(); api.begin(); var r = revision;
        host.setAttribute('data-detail-view', 'compare'); render(); status('Carregando próximos confrontos acompanhados...'); busy = true; host.inert = true;
        try {
          var response = await api.rpc('ie_comparacao_contexto_rpc', { p_id_evento: null });
          if (!active(r)) return;
          catalog = (response.itens || []).map(function (item) { return { id: Number(item.id_evento), name: api.title(item) }; });
          render();
          var initialIds = (Array.isArray(initialId) ? initialId : initialId ? [initialId] : []).map(Number);
          if (initialIds.length > 3 || new Set(initialIds).size !== initialIds.length || initialIds.some(function (id) { return !Number.isSafeInteger(id) || id <= 0; })) throw new Error('Escolha até três confrontos diferentes.');
          var failures = [];
          for (var id of initialIds) {
            if (!active(r)) return;
            try { await add(id); } catch (error) { failures.push(api.error(error)); }
          }
          if (!active(r)) return;
          if (failures.length) status('Alguns confrontos não puderam ser adicionados. ' + failures.join(' '));
          else if (!initialIds.length) status(catalog.length ? 'Escolha os confrontos e preencha suas odds.' : 'Nenhum próximo confronto acompanhado. Você ainda pode consultar suas versões salvas.');
        } catch (error) { if (active(r)) status(api.error(error)); }
        finally { if (revision === r) { busy = false; host.inert = false; } }
      }
    };
  };
})();
