(function (global) {
  "use strict";
  var labels = { todos: "Todos", aberto: "Em aberto", ganhou: "Ganhou", perdeu: "Perdeu", cashout: "Cashout", anulada: "Anulada", outros: "Outros" };
  var sharing = false;
  var shareEpoch = 0;
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(v, currency) { if (v == null) return "Não informado"; try { return Number(v).toLocaleString("pt-BR", { style: "currency", currency: currency || "BRL" }); } catch (_) { return String(v) + " " + (currency || ""); } }
  function date(v) { if (!v || !Number.isFinite(Date.parse(v))) return "Não informado"; return new Date(v).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }); }
  function ticketIcon() { return '<svg viewBox="0 0 28 20" aria-hidden="true"><path d="M2 2h24v5a3 3 0 0 0 0 6v5H2v-5a3 3 0 0 0 0-6Z"/><path d="M19 4v12"/></svg>'; }
  function stack(statuses) { return '<span class="ieb-stack" role="img" aria-label="' + esc(statuses.map(function (s) { return labels[s]; }).join(", ")) + '">' + statuses.slice(0, 3).map(function (s, i) { return '<span class="ieb-ticket-icon ieb-' + esc(s) + '" style="--layer:' + i + '">' + ticketIcon() + '</span>'; }).join("") + '</span>'; }
  function ticketHtml(t) {
    return '<article class="ieb-ticket" data-bet-ticket="' + esc(t.id) + '"><header><strong>' + esc(t.plataforma) + '</strong><span class="ieb-status ieb-' + esc(t.situacao) + '">' + esc(labels[t.situacao] || "Outros") + '</span></header><div class="ieb-muted">' + esc(t.tipo || "Bilhete") + ' · ' + esc(date(t.apostado_em)) + '</div>' + (t.selecoes || []).map(function (s) {
      return '<section class="ieb-selection"><strong>' + esc(s.confronto) + '</strong><span>' + esc(s.competicao || "Competição não informada") + '</span><span>' + esc(date(s.inicio)) + '</span><div>' + esc(s.mercado) + '</div><b>' + esc(s.escolha) + '</b><span>Odd: ' + esc(s.odd == null ? "Não informada" : s.odd) + '</span></section>';
    }).join("") + '<dl class="ieb-values"><div><dt>Apostado</dt><dd>' + esc(money(t.valor, t.moeda)) + '</dd></div><div><dt>Odd total</dt><dd>' + esc(t.odd == null ? "Não informada" : t.odd) + '</dd></div><div><dt>Retorno potencial</dt><dd>' + esc(money(t.retorno_potencial, t.moeda)) + '</dd></div><div><dt>Retorno pago</dt><dd>' + esc(money(t.retorno_pago, t.moeda)) + '</dd></div></dl><small class="ieb-muted">Registro pessoal · Turbo Tiger</small></article><button type="button" class="ieb-share" data-bet-share="' + esc(t.id) + '">Compartilhar bilhete</button>';
  }
  global.TurboTigerBets = function (api) {
    var host = api.host, filters = { plataforma: "", inicio: "", fim: "", situacao: "todos", pagina: 1 }, version = 0, badgeEpoch = 0, data = null, cache = new Map(), inflight = new Map(), timer;
    function active() { return host.getAttribute("data-detail-view") === "personal-bets"; }
    function controls() {
      return '<div class="ieb-filters"><label>Plataforma<select data-bet-filter="plataforma"><option value="">Todas</option>' + (data && data.plataformas || []).map(function (p) { return '<option value="' + esc(p.id) + '"' + (String(p.id) === filters.plataforma ? ' selected' : '') + '>' + esc(p.nome) + '</option>'; }).join("") + '</select></label><div class="ieb-dates"><label>Início<input type="date" data-bet-filter="inicio" value="' + esc(filters.inicio) + '"></label><label>Fim<input type="date" data-bet-filter="fim" value="' + esc(filters.fim) + '"></label></div><nav aria-label="Situação dos bilhetes">' + Object.keys(labels).map(function (s) { return '<button type="button" data-bet-status="' + s + '" aria-pressed="' + (filters.situacao === s) + '">' + labels[s] + '</button>'; }).join("") + '</nav></div>';
    }
    function render() {
      var finances = (data.financeiro || []).map(function (f) { return '<section class="ieb-summary"><strong>' + esc(f.moeda) + ' · ' + esc(f.bilhetes) + ' bilhetes</strong><dl class="ieb-values">' + [["Apostado", f.apostado], ["Retorno pago", f.retorno_pago], ["Ganhos líquidos confirmados", f.ganhos_liquidos], ["Perdas líquidas confirmadas", f.perdas_liquidas], ["Saldo confirmado", f.saldo_confirmado]].map(function (v) { return '<div><dt>' + v[0] + '</dt><dd>' + esc(money(v[1], f.moeda)) + '</dd></div>'; }).join("") + '</dl><small>Retorno comprovado em ' + esc(f.com_retorno_confirmado) + ' de ' + esc(f.bilhetes) + ' bilhetes. ' + (f.retorno_percentual_confirmado == null ? '' : 'Resultado líquido: ' + esc(Number(f.retorno_percentual_confirmado).toFixed(1)) + '% sobre o valor desses bilhetes.') + '</small></section>'; }).join("");
      var stats = (data.estatisticas || []).map(function (s) { var decided = Number(s.acertos) + Number(s.erros), total = data.estatisticas.filter(function (row) { return row.tipo_bilhete === s.tipo_bilhete && row.id_mercado_cotacao === s.id_mercado_cotacao && row.mercado_periodo === s.mercado_periodo && row.linha === s.linha; }).reduce(function (sum, row) { return sum + Number(row.amostra); }, 0); return '<li><strong>' + esc(s.tipo_bilhete) + ' · ' + esc({ casa: "Casa", empate: "Empate", fora: "Visitante", outra: "Outra" }[s.escolha_codigo] || s.escolha_codigo) + '</strong><span>' + esc(s.mercado_periodo || '') + (s.linha ? ' · Linha ' + esc(s.linha) : '') + ' · ' + esc({ maior: "Maior odd", menor: "Menor odd", intermediaria: "Odd intermediária", empatada: "Odds iguais" }[s.faixa_odd] || 'Sem cotações completas da colocação') + '</span><span>' + esc(s.amostra) + ' seleções' + (total ? ' (' + (100 * Number(s.amostra) / total).toFixed(1) + '% deste mercado)' : '') + ' · ' + esc(s.acertos) + ' acertos · ' + esc(s.erros) + ' erros' + (decided ? ' · ' + (100 * Number(s.acertos) / decided).toFixed(1) + '% de acertos nos resultados conhecidos' : '') + '</span></li>'; }).join("");
      host.innerHTML = '<div class="ieb-page">' + controls() + '<div class="ieb-result" role="status">' + esc(data.total) + ' bilhetes encontrados</div>' + finances + '<details class="ieb-statistics"><summary>Estatísticas pessoais</summary><p>Seleções de múltiplas são analisadas individualmente. Valores financeiros são contados uma vez por bilhete.</p><ul>' + (stats || '<li>Ainda não há seleções com mercado e escolha comprovados.</li>') + '</ul><small>' + esc(data.selecoes_sem_classificacao || 0) + ' seleções sem classificação comprovada. ' + esc(data.selecoes_sem_snapshot || 0) + ' sem cotações completas do momento da aposta.</small></details>' + (data.bilhetes || []).map(ticketHtml).join("") + (!data.total ? '<p>Nenhum bilhete encontrado para estes filtros.</p>' : '') + '<footer class="ieb-pagination"><button type="button" data-bet-page="-1"' + (filters.pagina <= 1 ? ' disabled' : '') + '>Anterior</button><span>Página ' + esc(data.pagina || 1) + ' de ' + esc(Math.max(1, data.paginas || 1)) + '</span><button type="button" data-bet-page="1"' + (filters.pagina >= data.paginas ? ' disabled' : '') + '>Próximo</button></footer><small class="ieb-muted">Histórico para controle pessoal. Resultados passados não garantem resultados futuros.</small></div>';
    }
    async function load() {
      var request = ++version;
      if (filters.inicio && filters.fim && filters.inicio > filters.fim) { api.message("A data final deve ser igual ou posterior à inicial."); return; }
      host.setAttribute("aria-busy", "true");
      try {
        var result = await api.rpc("ie_minhas_apostas_rpc", { p_plataforma: filters.plataforma ? Number(filters.plataforma) : null, p_inicio: filters.inicio || null, p_fim: filters.fim || null, p_situacao: filters.situacao, p_pagina: filters.pagina });
        if (request !== version || !active()) return;
        data = result; render(); invalidate();
      } catch (_) { if (request === version && active()) { host.innerHTML = '<div class="ieb-page">' + controls() + '<p role="alert">Não foi possível consultar seus bilhetes.</p><button type="button" data-bet-retry>Tentar novamente</button></div>'; } }
      finally { if (request === version) host.removeAttribute("aria-busy"); }
    }
    function open() { if (!api.allow()) return; api.begin("Minhas apostas", "Seu histórico em todas as plataformas", false); host.setAttribute("data-detail-view", "personal-bets"); filters.pagina = 1; load(); }
    function clearBadges() {
      badgeEpoch++; cache.clear(); inflight.clear();
      document.querySelectorAll("[data-bet-ready]").forEach(function (n) { n.removeAttribute("data-bet-ready"); n.replaceChildren(); });
    }
    function invalidate() { clearBadges(); badges(); }
    async function badges() {
      var nodes = Array.from(document.querySelectorAll("[data-bet-event-id]")), ids = [];
      nodes.forEach(function (n) { var id = Number(n.dataset.betEventId); if (cache.has(id)) { var item = cache.get(id); if (!n.hasAttribute("data-bet-ready")) { n.setAttribute("data-bet-ready", ""); n.innerHTML = stack(item.bilhetes || []) + (item.pessoas > 0 ? '<small>' + esc(item.pessoas) + ' membro' + (item.pessoas === 1 ? '' : 's') + ' com aposta neste confronto</small>' : ''); } } else if (id > 0 && !inflight.has(id) && ids.indexOf(id) < 0) ids.push(id); });
      if (!ids.length) return;
      ids = ids.slice(0, 100); var request = badgeEpoch; ids.forEach(function (id) { inflight.set(id, request); });
      try { var result = await api.rpc("ie_apostas_eventos_rpc", { p_eventos: ids }); if (request !== badgeEpoch) return; var rows = Array.isArray(result) ? result : result && result.itens; if (!Array.isArray(rows)) throw new Error("Indicadores indisponíveis"); ids.forEach(function (id) { cache.set(id, { bilhetes: [], pessoas: 0 }); }); rows.forEach(function (row) { if (ids.indexOf(Number(row.id_evento)) >= 0) cache.set(Number(row.id_evento), row); }); badges(); } catch (_) { /* An unavailable count is not displayed as zero. */ }
      finally { ids.forEach(function (id) { if (inflight.get(id) === request) inflight.delete(id); }); }
    }
    new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(badges, 80); }).observe(document.getElementById("ieApp"), { childList: true, subtree: true });
    new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(badges, 80); }).observe(host, { childList: true, subtree: true });
    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-personal-bets-open]")) { open(); return; }
      if (!active()) return;
      var button = event.target.closest("[data-bet-status],[data-bet-page],[data-bet-retry],[data-bet-share]"); if (!button) return;
      if (button.hasAttribute("data-bet-share")) { var ticket = (data && data.bilhetes || []).find(function (t) { return String(t.id) === button.dataset.betShare; }); if (ticket) api.share(ticket, host.querySelector('[data-bet-ticket="' + Number(ticket.id) + '"]')); return; }
      if (button.hasAttribute("data-bet-status")) { filters.situacao = button.dataset.betStatus; filters.pagina = 1; }
      if (button.hasAttribute("data-bet-page")) filters.pagina = Math.max(1, filters.pagina + Number(button.dataset.betPage));
      load();
    });
    host.addEventListener("change", function (event) { if (!active() || !event.target.hasAttribute("data-bet-filter")) return; filters[event.target.dataset.betFilter] = event.target.value; filters.pagina = 1; load(); });
    var pull = null;
    host.addEventListener("touchstart", function (event) { pull = active() && host.scrollTop <= 0 && event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, ready: false } : null; }, { passive: true });
    host.addEventListener("touchmove", function (event) { if (!pull) return; var dx = Math.abs(event.touches[0].clientX - pull.x), dy = event.touches[0].clientY - pull.y; if (dx > 25 || dy < 0) { pull = null; return; } pull.ready = dy > 70; host.classList.toggle("ieb-pull-ready", pull.ready); }, { passive: true });
    host.addEventListener("touchend", function () { var refresh = pull && pull.ready; pull = null; host.classList.remove("ieb-pull-ready"); if (refresh && active()) load(); }, { passive: true });
    host.addEventListener("touchcancel", function () { pull = null; host.classList.remove("ieb-pull-ready"); }, { passive: true });
    return { open: open, active: active, refresh: load, reset: function () { version++; shareEpoch++; data = null; clearBadges(); host.removeAttribute("data-detail-view"); filters = { plataforma: "", inicio: "", fim: "", situacao: "todos", pagina: 1 }; }, invalidate: invalidate };
  };
  async function share(ticket, element) {
    if (sharing) return;
    sharing = true;
    try { await shareImage(ticket, element); } finally { sharing = false; }
  }
  async function shareImage(ticket, element) {
    var epoch = shareEpoch;
    if (!element) throw new Error("Bilhete não disponível.");
    // Capture only the displayed ticket, not filters, balances or another ticket.
    var width = Math.ceil(element.getBoundingClientRect().width), height = Math.ceil(element.scrollHeight);
    if (!width || !height || width * height > 4000000) throw new Error("Este bilhete excede o tamanho permitido para imagem.");
    var copy = element.cloneNode(true), originals = [element].concat(Array.from(element.querySelectorAll("*"))), copies = [copy].concat(Array.from(copy.querySelectorAll("*")));
    originals.forEach(function (node, i) { var style = getComputedStyle(node); copies[i].removeAttribute("id"); Array.from(copies[i].attributes).forEach(function (a) { if (a.name.indexOf("data-") === 0) copies[i].removeAttribute(a.name); }); Array.from(style).forEach(function (key) { copies[i].style.setProperty(key, style.getPropertyValue(key)); }); });
    copy.style.margin = "0"; copy.style.width = width + "px"; copy.style.height = height + "px"; copy.style.boxSizing = "border-box";
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">' + new XMLSerializer().serializeToString(copy) + '</div></foreignObject></svg>';
    var img = new Image(); await new Promise(function (resolve, reject) { img.onload = resolve; img.onerror = function () { reject(new Error("Não foi possível gerar a imagem do bilhete.")); }; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); });
    var canvas = document.createElement("canvas"), scale = Math.min(2, Math.sqrt(8000000 / (width * height))); canvas.width = Math.ceil(width * scale); canvas.height = Math.ceil(height * scale);
    var ctx = canvas.getContext("2d"); ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
    var encoded = canvas.toDataURL("image/png").split(",")[1]; canvas.width = canvas.height = 0;
    if (encoded.length > 2800000) throw new Error("A imagem deste bilhete excede o limite de compartilhamento.");
    if (!global.TurboTigerIEBridge || typeof global.TurboTigerIEBridge.post !== "function") throw new Error("Compartilhamento disponível somente no aplicativo.");
    var id = global.crypto.randomUUID(), offset = 0;
    // Acknowledgements prevent flooding the bounded bridge queue and surface stale builds.
    var pending = null;
    global.TurboTigerIEBetShareResult = function (result) { if (result && result.id === id && pending) { var p = pending; pending = null; clearTimeout(p.timer); result.ok ? p.resolve() : p.reject(new Error("Não foi possível abrir o compartilhamento do bilhete.")); } };
    function send(type, fields) { return new Promise(function (resolve, reject) { if (epoch !== shareEpoch) { reject(new Error("Compartilhamento cancelado após a troca de conta.")); return; } pending = { resolve: resolve, reject: reject, timer: setTimeout(function () { pending = null; reject(new Error("Atualize o aplicativo para compartilhar o bilhete como imagem.")); }, 10000) }; global.TurboTigerIEBridge.post(JSON.stringify(Object.assign({ type: type, id: id }, fields))); }); }
    try { await send("bet_share_begin", { size: encoded.length }); while (offset < encoded.length) { await send("bet_share_chunk", { offset: offset, data: encoded.slice(offset, offset + 48000) }); offset += 48000; } await send("bet_share_finish", {}); }
    finally { global.TurboTigerIEBetShareResult = null; }
  }
  global.TurboTigerBetsRendering = { ticketHtml: ticketHtml, stack: stack, money: money, share: share };
})(window);
