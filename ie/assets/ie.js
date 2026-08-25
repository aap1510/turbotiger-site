(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    sessionTimeoutMs: 15000,
    cachePrefix: "tt_ie_cache_v1_",
    preview: (location.hostname === "localhost" || location.hostname === "127.0.0.1") && new URLSearchParams(location.search).get("preview") === "1"
  };

  var ALERT_EVENTS = [
    { code: "pre_inicio", label: "Antes do início" },
    { code: "inicio_evento", label: "Partida iniciada" },
    { code: "escalacao_disponivel", label: "Escalação disponível" },
    { code: "gol", label: "Gol" },
    { code: "cartao_vermelho", label: "Cartão vermelho" },
    { code: "intervalo", label: "Intervalo" },
    { code: "encerramento", label: "Encerramento" },
    { code: "mudanca_horario", label: "Mudança de horário" }
  ];

  var state = {
    session: null,
    bootstrap: null,
    card: null,
    games: { live: [], upcoming: [], results: [] },
    news: [],
    activeTab: "home",
    previousTab: "home",
    gameFilter: "live",
    catalog: { participants: [], competitions: [] },
    selectionChanges: {},
    loading: false,
    toastTimer: null
  };

  function byId(id) { return document.getElementById(id); }
  function all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeUrl(value) {
    try {
      var url = new URL(String(value || ""));
      return url.protocol === "https:" ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function arrayOf(value) {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.itens)) return value.itens;
    return [];
  }

  function numberOf(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : (fallback || 0);
  }

  function formatDateTime(value, withDate) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    if (withDate === false) return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }) + " · " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function relativeFreshness(value) {
    if (!value) return "Atualização indisponível";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Atualizado " + String(value);
    var seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return "Atualizado agora";
    var minutes = Math.round(seconds / 60);
    if (minutes < 60) return "Atualizado há " + minutes + " min";
    var hours = Math.round(minutes / 60);
    if (hours < 24) return "Atualizado há " + hours + " h";
    return "Atualizado em " + date.toLocaleDateString("pt-BR");
  }

  function initials(name) {
    var parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join("") || "?";
  }

  function logoHtml(url, name, className) {
    var safe = safeUrl(url);
    return "<span class=\"" + (className || "ie-crest") + "\">" + (safe ? "<img src=\"" + escapeHtml(safe) + "\" alt=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer\">" : escapeHtml(initials(name))) + "</span>";
  }

  function icon(name) {
    return "<svg aria-hidden=\"true\"><use href=\"#ie-ico-" + escapeHtml(name) + "\"/></svg>";
  }

  function detailButton(kind, id, url, title) {
    return "<button class=\"ie-details\" type=\"button\" data-detail-kind=\"" + escapeHtml(kind || "generic") + "\" data-detail-id=\"" + escapeHtml(id || "") + "\" data-detail-url=\"" + escapeHtml(url || "") + "\" data-detail-title=\"" + escapeHtml(title || "") + "\">Detalhes" + icon("chevron") + "</button>";
  }

  function friendlyError(error) {
    var raw = String(error && (error.message || error.error) || error || "").trim();
    var messages = {
      app_session_timeout: "O aplicativo demorou para validar sua sessão.",
      app_session_unavailable: "Não foi possível validar sua sessão pelo aplicativo.",
      sessao_expirada: "Sua sessão expirou. Volte ao aplicativo e tente novamente.",
      nao_autenticado: "Sua sessão não está disponível.",
      Failed_to_fetch: "Não foi possível acessar a central. Verifique sua conexão."
    };
    return messages[raw] || messages[raw.replace(/\s+/g, "_")] || raw || "Não foi possível carregar as informações.";
  }

  function showToast(message, isError) {
    var toast = byId("toast");
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.classList.toggle("is-error", !!isError);
    toast.hidden = false;
    state.toastTimer = window.setTimeout(function () { toast.hidden = true; }, 3600);
  }

  function hasBridge() {
    try {
      return !!(window.TurboTigerIEBridge && typeof window.TurboTigerIEBridge.post === "function");
    } catch (error) {
      return false;
    }
  }

  function postNative(type, payload) {
    if (!hasBridge()) return false;
    var message = Object.assign({ type: type }, payload || {});
    window.TurboTigerIEBridge.post(JSON.stringify(message));
    return true;
  }

  function jwtPayload(token) {
    try {
      var part = String(token || "").split(".")[1] || "";
      part = part.replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      return JSON.parse(atob(part));
    } catch (error) {
      return {};
    }
  }

  var sessionPromise = null;
  var sessionResolve = null;
  var sessionReject = null;
  var sessionTimer = null;

  function finishSession(error, session) {
    window.clearTimeout(sessionTimer);
    sessionTimer = null;
    var resolve = sessionResolve;
    var reject = sessionReject;
    sessionPromise = null;
    sessionResolve = null;
    sessionReject = null;
    if (error && reject) reject(error);
    if (!error && resolve) resolve(session);
  }

  window.TurboTigerIEReceiveSession = function (payload) {
    try {
      if (!payload || payload.ok !== true) throw new Error(payload && payload.error || "app_session_unavailable");
      var value = payload.session || payload;
      var token = String(value.access_token || "").trim();
      if (!token) throw new Error("app_session_unavailable");
      var jwt = jwtPayload(token);
      state.session = {
        access_token: token,
        expires_at: Number(jwt.exp || 0) * 1000,
        user_id: String(jwt.sub || "")
      };
      finishSession(null, state.session);
    } catch (error) {
      finishSession(error);
    }
  };

  window.TurboTigerIERefresh = function () {
    loadAll(true);
  };

  function requestSession() {
    if (CONFIG.preview) {
      state.session = { access_token: "preview", expires_at: Date.now() + 3600000, user_id: "preview" };
      return Promise.resolve(state.session);
    }
    if (!hasBridge()) return Promise.reject(new Error("app_session_unavailable"));
    if (state.session && state.session.access_token && state.session.expires_at > Date.now() + 60000) return Promise.resolve(state.session);
    if (sessionPromise) return sessionPromise;
    sessionPromise = new Promise(function (resolve, reject) {
      sessionResolve = resolve;
      sessionReject = reject;
      sessionTimer = window.setTimeout(function () { finishSession(new Error("app_session_timeout")); }, CONFIG.sessionTimeoutMs);
      try {
        postNative("session_request", { protocol: 1 });
      } catch (error) {
        finishSession(new Error("app_session_unavailable"));
      }
    });
    return sessionPromise;
  }

  async function parseResponse(response) {
    var text = await response.text();
    var data = null;
    if (text) {
      try { data = JSON.parse(text); } catch (error) { data = { raw: text }; }
    }
    if (!response.ok) throw new Error(data && (data.message || data.error || data.details) || "falha_http_" + response.status);
    return data;
  }

  async function rpc(name, payload) {
    if (CONFIG.preview) return previewRpc(name, payload || {});
    var session = await requestSession();
    if (!session || !session.access_token) throw new Error("sessao_expirada");
    var response = await fetch(CONFIG.supabaseUrl + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: {
        apikey: CONFIG.apiKey,
        Authorization: "Bearer " + session.access_token,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload || {})
    });
    var result = await parseResponse(response);
    if (result && result.schema_version && result.data != null) {
      var envelope = {
        schema_version: result.schema_version,
        generated_at: result.generated_at,
        freshness: result.freshness,
        source_status: result.source_status,
        next_cursor: result.next_cursor,
        errors: result.errors
      };
      if (Array.isArray(result.data)) return Object.assign({ itens: result.data }, envelope);
      if (typeof result.data === "object") return Object.assign({}, result.data, envelope);
    }
    return result;
  }

  function previewRpc(name, payload) {
    var now = new Date();
    var later = new Date(now.getTime() + 3 * 3600000);
    var matches = [
      { id_evento: 101, status: "ao_vivo", minuto: "64'", competicao_nome: "Brasileirão · Série A", inicio_em: now.toISOString(), participante_casa: { nome: "Atlético-MG" }, participante_fora: { nome: "Internacional" }, placar_casa: 1, placar_fora: 0, atualizado_em: now.toISOString() },
      { id_evento: 102, status: "agendado", competicao_nome: "Brasileirão · Série A", inicio_em: later.toISOString(), participante_casa: { nome: "São Paulo" }, participante_fora: { nome: "Palmeiras" }, atualizado_em: now.toISOString() }
    ];
    var participants = ["Flamengo", "Palmeiras", "Corinthians", "São Paulo", "Santos", "Grêmio", "Internacional", "Atlético-MG"].map(function (name, index) { return { id: index + 1, id_participante: index + 1, tipo_alvo: "participante", nome: name, acompanhar: index < 3, notificar: index < 2, esporte_nome: "Futebol" }; });
    var competitions = ["Brasileirão Série A", "Copa do Brasil", "CONMEBOL Libertadores", "Sul-Americana", "Paulistão", "Carioca"].map(function (name, index) { return { id: index + 101, id_competicao: index + 101, tipo_alvo: "competicao", nome: name, acompanhar: index < 2, esporte_nome: "Futebol" }; });
    if (name === "ie_central_bootstrap_rpc") return Promise.resolve({ ok: true, preferencias: { id_esporte_favorito: 1, notificacoes_ativas: true }, alertas: { ativo: true, antecedencias_minutos: [30, 60], tipos_evento: ["pre_inicio", "gol", "encerramento"] }, selecoes: participants.filter(function (item) { return item.acompanhar || item.notificar; }).concat(competitions.filter(function (item) { return item.acompanhar; })), filtros: {}, catalogo: { esportes: [{ id: 1, nome: "Futebol", codigo: "football" }, { id: 2, nome: "Basquete", codigo: "basketball" }, { id: 3, nome: "Vôlei", codigo: "volleyball" }], continentes: [{ id: 1, nome: "América do Sul" }, { id: 2, nome: "Europa" }], paises: [{ id: 1, nome: "Brasil", id_continente: 1 }, { id: 2, nome: "Argentina", id_continente: 1 }, { id: 3, nome: "Inglaterra", id_continente: 2 }] } });
    if (name === "ie_card_resumo_rpc") return Promise.resolve({ ok: true, configurado: true, generated_at: now.toISOString(), subcards: [
      { codigo: "partidas", titulo: "Partidas", itens: matches },
      { codigo: "campeonatos", titulo: "Campeonato", itens: [{ id_competicao: 101, nome: "Brasileirão · Série A", classificacao: [{ posicao: 1, nome: "Palmeiras", pontos: 16 }, { posicao: 2, nome: "Flamengo", pontos: 16 }] }] },
      { codigo: "noticias", titulo: "Notícias", itens: [{ id_noticia: 501, titulo: "Clubes se preparam para a próxima rodada do campeonato nacional", resumo: "Informações atualizadas sobre as equipes acompanhadas.", fonte_nome: "Fonte esportiva", publicado_em: now.toISOString(), url_original: "https://example.com/noticia" }] },
      { codigo: "cotacoes", titulo: "1X2 · Informativo", itens: [{ id_evento: 102, casa: 2.35, empate: 3.2, fora: 2.9, atualizado_em: now.toISOString() }] },
      { codigo: "analises", titulo: "Probabilidade estatística", itens: [{ id_evento: 102, casa: 41, empate: 29, fora: 30, atualizado_em: now.toISOString() }] }
    ] });
    if (name === "ie_partidas_listar_rpc") return Promise.resolve({ ok: true, itens: payload.p_secao === "proximos" ? [matches[1]] : payload.p_secao === "resultados" ? [] : [matches[0]] });
    if (name === "ie_noticias_listar_rpc") return Promise.resolve({ ok: true, itens: [{ id_noticia: 501, titulo: "Clubes se preparam para a próxima rodada do campeonato nacional", resumo: "Informações atualizadas sobre os times que você acompanha.", fonte_nome: "Fonte esportiva", publicado_em: now.toISOString(), url_original: "https://example.com/noticia" }] });
    if (name === "ie_catalogo_buscar_rpc") return Promise.resolve({ ok: true, itens: payload.p_tipo === "competicao" || payload.p_tipo === "competicoes" || payload.p_tipo === "campeonato" || payload.p_tipo === "campeonatos" ? competitions : participants });
    if (name === "ie_partida_detalhe_rpc") return Promise.resolve({ ok: true, evento: matches.find(function (item) { return Number(item.id_evento) === Number(payload.p_id_evento); }) || matches[0], linha_tempo: [], estatisticas: [], escalacoes: [], classificacao: [], odds: [], noticias: [] });
    return Promise.resolve({ ok: true });
  }

  function cacheKey() {
    return CONFIG.cachePrefix + (state.session && state.session.user_id || "anonymous");
  }

  function saveCache() {
    if (CONFIG.preview) return;
    try {
      sessionStorage.setItem(cacheKey(), JSON.stringify({ saved_at: new Date().toISOString(), bootstrap: state.bootstrap, card: state.card, games: state.games, news: state.news }));
    } catch (error) {}
  }

  function loadCache() {
    try {
      var raw = sessionStorage.getItem(cacheKey());
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function showApp(show) {
    byId("loadingPanel").hidden = true;
    byId("accessPanel").hidden = !!show;
    byId("ieApp").hidden = !show;
  }

  function setFreshness(value) {
    var text = relativeFreshness(value);
    byId("headerFreshness").textContent = text;
    byId("footerFreshness").textContent = text;
  }

  function emptyState(title, text, canConfigure) {
    return "<div class=\"ie-empty\"><strong>" + escapeHtml(title) + "</strong><p>" + escapeHtml(text) + "</p>" + (canConfigure ? "<button class=\"ie-button ie-button-primary\" type=\"button\" data-open-settings>Configurar</button>" : "") + "</div>";
  }

  function matchSides(item) {
    var participants = arrayOf(item.participantes);
    var homeFromList = participants.find(function (participant) { return /^(casa|mandante|home|local)$/i.test(String(participant.papel || "")); }) || participants[0] || {};
    var awayFromList = participants.find(function (participant) { return /^(fora|visitante|away)$/i.test(String(participant.papel || "")); }) || participants[1] || {};
    var home = item.participante_casa || item.mandante || item.time_casa || item.home || homeFromList;
    var away = item.participante_fora || item.visitante || item.time_fora || item.away || awayFromList;
    return {
      home: { name: home.nome || home.nome_curto || item.time_casa_nome || item.mandante_nome || "Casa", logo: home.imagem_url || home.logo_url || home.logo || item.time_casa_logo, score: home.placar_numerico == null ? home.placar : home.placar_numerico },
      away: { name: away.nome || away.nome_curto || item.time_fora_nome || item.visitante_nome || "Visitante", logo: away.imagem_url || away.logo_url || away.logo || item.time_fora_logo, score: away.placar_numerico == null ? away.placar : away.placar_numerico }
    };
  }

  function renderMatchCard(item, label) {
    var sides = matchSides(item || {});
    var status = String(item.status || item.status_canonico || "").toLowerCase();
    var live = status === "ao_vivo" || status === "live" || status === "em_andamento";
    var id = item.id_evento || item.id_partida || item.id || "";
    var result = item.placar || item.resultado || {};
    var scoreHome = item.placar_casa == null ? (sides.home.score == null ? (result.casa == null ? "" : result.casa) : sides.home.score) : item.placar_casa;
    var scoreAway = item.placar_fora == null ? (sides.away.score == null ? (result.fora == null ? "" : result.fora) : sides.away.score) : item.placar_fora;
    var startAt = item.inicio_em || item.data_partida || item.data_inicio;
    var statusText = item.minuto || item.status_texto || item.status_detalhado || (live ? "Ao vivo" : formatDateTime(startAt, false));
    var center = live || scoreHome !== "" || scoreAway !== "" ? "<span class=\"ie-score\">" + escapeHtml(scoreHome === "" ? 0 : scoreHome) + " – " + escapeHtml(scoreAway === "" ? 0 : scoreAway) + "</span><span class=\"ie-match-time\">" + escapeHtml(statusText) + "</span>" : "<span class=\"ie-match-time\">" + escapeHtml(formatDateTime(startAt, false) || "A definir") + "</span>";
    return "<article class=\"ie-feed-card ie-wide" + (live ? " is-live" : "") + "\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon(live ? "live" : "clock") + "</span>" + escapeHtml(label || (live ? "Ao vivo" : "Partida")) + "</span>" + detailButton("event", id, "", sides.home.name + " x " + sides.away.name) + "</div><div class=\"ie-match\"><div class=\"ie-side\">" + logoHtml(sides.home.logo, sides.home.name) + "<strong>" + escapeHtml(sides.home.name) + "</strong></div><div class=\"ie-match-center\">" + center + "</div><div class=\"ie-side\">" + logoHtml(sides.away.logo, sides.away.name) + "<strong>" + escapeHtml(sides.away.name) + "</strong></div></div><div class=\"ie-meta\">" + escapeHtml(item.competicao_nome || item.competicao || "") + (startAt ? " · " + escapeHtml(formatDateTime(startAt)) : "") + "</div></article>";
  }

  function renderNewsCard(item) {
    var id = item.id_noticia || item.id || "";
    var url = item.url_original || item.url || "";
    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("news") + "</span>Notícias</span>" + detailButton("news", id, url, item.titulo) + "</div><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Notícia esportiva") + "</h3>" + (item.resumo || item.descricao ? "<p class=\"ie-news-description\">" + escapeHtml(item.resumo || item.descricao) + "</p>" : "") + "<span class=\"ie-source\">Fonte: " + escapeHtml(item.fonte_nome || item.fonte || "não informada") + (item.publicado_em ? " · " + escapeHtml(formatDateTime(item.publicado_em)) : "") + "</span></article>";
  }

  function renderOddsCard(item, prediction) {
    var values = prediction ? [item.casa || item.probabilidade_casa, item.empate || item.probabilidade_empate, item.fora || item.probabilidade_fora] : [item.casa || item.odd_casa, item.empate || item.odd_empate, item.fora || item.odd_fora];
    var suffix = prediction ? "%" : "";
    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>" + (prediction ? "Probabilidade estatística" : "1X2 · Informativo") + "</span>" + detailButton("event", item.id_evento || item.id_partida || "") + "</div><div class=\"ie-stat-row\"><span>1<strong>" + escapeHtml(values[0] == null ? "—" : values[0] + suffix) + "</strong></span><span>X<strong>" + escapeHtml(values[1] == null ? "—" : values[1] + suffix) + "</strong></span><span>2<strong>" + escapeHtml(values[2] == null ? "—" : values[2] + suffix) + "</strong></span></div>" + (prediction ? "<p class=\"ie-disclaimer\">Estimativa estatística. Não representa recomendação nem garantia de resultado.</p>" : "<p class=\"ie-disclaimer\">Informação neutra, sem indicação ou direcionamento para apostas.</p>") + "</article>";
  }

  function renderCompetitionCard(item) {
    var rows = arrayOf(item.classificacao || item.posicoes).slice(0, 4);
    var body = rows.length ? "<div class=\"ie-standings\">" + rows.map(function (row) { return "<div class=\"ie-standing-row\"><span>" + escapeHtml(row.posicao || row.rank || "—") + "</span><strong>" + escapeHtml(row.nome || row.time_nome || row.participante_nome || "") + "</strong><strong>" + escapeHtml(row.pontos == null ? "" : row.pontos) + "</strong></div>"; }).join("") + "</div>" : "<p class=\"ie-news-description\">Acompanhe partidas, classificação e atualizações desta competição.</p>";
    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("trophy") + "</span>Campeonato</span>" + detailButton("competition", item.id_competicao || item.id || "", "", item.nome) + "</div><h3 class=\"ie-news-title\">" + escapeHtml(item.nome || item.competicao_nome || "Campeonato") + "</h3>" + body + "</article>";
  }

  function renderHome() {
    var card = state.card || {};
    var configured = card.configurado !== false && !!(state.bootstrap && (state.bootstrap.preferencias && state.bootstrap.preferencias.id_esporte_favorito || arrayOf(state.bootstrap.selecoes).length));
    var favorite = favoriteSport();
    byId("favoriteSportTitle").textContent = favorite ? favorite.nome : "Seu esporte favorito";
    byId("favoriteSportIcon").textContent = favorite ? initials(favorite.nome) : "●";
    if (!configured) {
      byId("homeContent").innerHTML = emptyState("Escolha seus esportes", "Defina um esporte favorito e acompanhe os times, participantes e campeonatos que realmente interessam a você.", true);
      return;
    }
    var html = [];
    arrayOf(card.subcards).forEach(function (subcard) {
      var code = String(subcard.codigo || subcard.tipo || "").toLowerCase();
      arrayOf(subcard.itens).slice(0, 3).forEach(function (item) {
        if (code.indexOf("notic") >= 0) html.push(renderNewsCard(item));
        else if (code.indexOf("cotac") >= 0 || code.indexOf("odd") >= 0) html.push(renderOddsCard(item, false));
        else if (code.indexOf("analis") >= 0 || code.indexOf("pred") >= 0 || code.indexOf("prob") >= 0) html.push(renderOddsCard(item, true));
        else if (code.indexOf("camp") >= 0 || code.indexOf("class") >= 0) html.push(renderCompetitionCard(item));
        else html.push(renderMatchCard(item, subcard.titulo));
      });
    });
    byId("homeContent").innerHTML = html.join("") || emptyState("Nenhuma informação disponível", "Os dados do seu esporte favorito ainda não foram atualizados pela fonte.", false);
  }

  function renderGames() {
    var rows = state.games[state.gameFilter] || [];
    var labels = { live: "Ao vivo", upcoming: "Próximos", results: "Resultados" };
    byId("gamesContent").innerHTML = rows.length ? rows.map(function (item) { return renderMatchCard(item, labels[state.gameFilter]); }).join("") : emptyState("Nenhuma partida", "Não há partidas nesta seção para os times e campeonatos acompanhados.", false);
  }

  function renderNews() {
    byId("newsContent").innerHTML = state.news.length ? state.news.map(renderNewsCard).join("") : emptyState("Nenhuma notícia", "Ainda não encontramos notícias autorizadas relacionadas às suas seleções.", false);
  }

  function selectionRows(targetType) {
    var source = targetType === "participant" ? state.catalog.participants : state.catalog.competitions;
    var selected = selectionMap();
    return source.map(function (item) {
      var id = item.id_participante || item.id_time || item.id_competicao || item.id;
      var key = targetType + ":" + id;
      var current = state.selectionChanges[key] || selected[key] || item;
      var follow = !!current.acompanhar;
      var notify = targetType === "participant" && !!current.notificar;
      return "<div class=\"ie-selection-row\">" + logoHtml(item.logo_url || item.logo, item.nome, "ie-entity-logo") + "<strong>" + escapeHtml(item.nome || item.nome_exibicao || "") + "</strong><div class=\"ie-selection-actions\"><button class=\"ie-selection-action" + (follow ? " is-active" : "") + "\" type=\"button\" data-selection-key=\"" + escapeHtml(key) + "\" data-selection-kind=\"follow\" aria-label=\"Acompanhar\" aria-pressed=\"" + follow + "\">" + icon("star") + "</button>" + (targetType === "participant" ? "<button class=\"ie-selection-action" + (notify ? " is-active" : "") + "\" type=\"button\" data-selection-key=\"" + escapeHtml(key) + "\" data-selection-kind=\"notify\" aria-label=\"Notificar\" aria-pressed=\"" + notify + "\">" + icon("bell") + "</button>" : "") + "</div></div>";
    }).join("");
  }

  function selectionIdentity(item) {
      var targetType = String(item.tipo_alvo || item.tipo || "").toLowerCase();
      var genericId = item.id_alvo || item.alvo_id || item.id;
      var participantId = item.id_participante || item.id_time || ((targetType.indexOf("particip") >= 0 || targetType.indexOf("time") >= 0 || targetType.indexOf("equipe") >= 0) ? genericId : null);
      var competitionId = item.id_competicao || ((targetType.indexOf("compet") >= 0 || targetType.indexOf("camp") >= 0 || targetType.indexOf("liga") >= 0) ? genericId : null);
      return participantId ? { type: "participant", id: participantId } : competitionId ? { type: "competition", id: competitionId } : { type: "", id: null };
  }

  function selectionMap() {
    var map = {};
    arrayOf(state.bootstrap && state.bootstrap.selecoes).forEach(function (item) {
      var identity = selectionIdentity(item);
      if (identity.type && identity.id) map[identity.type + ":" + identity.id] = item;
    });
    return map;
  }

  function renderSelectionLists() {
    byId("teamSelectionList").innerHTML = selectionRows("participant") || emptyState("Nenhum resultado", "Ajuste os filtros ou a busca.", false);
    byId("competitionSelectionList").innerHTML = selectionRows("competition") || emptyState("Nenhum resultado", "Ajuste os filtros ou a busca.", false);
    var merged = Object.assign({}, selectionMap(), state.selectionChanges);
    var teamCount = Object.keys(merged).filter(function (key) { return key.indexOf("participant:") === 0 && merged[key].acompanhar; }).length;
    var competitionCount = Object.keys(merged).filter(function (key) { return key.indexOf("competition:") === 0 && merged[key].acompanhar; }).length;
    byId("teamSelectionCount").textContent = teamCount + " selecionado" + (teamCount === 1 ? "" : "s");
    byId("competitionSelectionCount").textContent = competitionCount + " selecionado" + (competitionCount === 1 ? "" : "s");
  }

  function renderEntities() {
    var selections = arrayOf(state.bootstrap && state.bootstrap.selecoes);
    var participants = selections.filter(function (item) { return selectionIdentity(item).type === "participant" && item.acompanhar; });
    var competitions = selections.filter(function (item) { return selectionIdentity(item).type === "competition" && item.acompanhar; });
    byId("teamsContent").innerHTML = participants.length ? participants.map(function (item) { return "<article class=\"ie-entity-row\">" + logoHtml(item.imagem_url || item.logo_url, item.nome, "ie-entity-logo") + "<div class=\"ie-entity-copy\"><strong>" + escapeHtml(item.nome || "Time ou participante") + "</strong><span>" + escapeHtml(item.esporte_nome || "") + (item.notificar ? " · notificações ativas" : "") + "</span></div>" + detailButton("participant", selectionIdentity(item).id, "", item.nome) + "</article>"; }).join("") : emptyState("Nenhum time acompanhado", "Use as configurações para escolher times ou participantes.", true);
    byId("competitionsContent").innerHTML = competitions.length ? competitions.map(function (item) { return "<article class=\"ie-entity-row\">" + logoHtml(item.imagem_url || item.logo_url, item.nome, "ie-entity-logo") + "<div class=\"ie-entity-copy\"><strong>" + escapeHtml(item.nome || "Campeonato") + "</strong><span>" + escapeHtml(item.esporte_nome || "") + "</span></div>" + detailButton("competition", selectionIdentity(item).id, "", item.nome) + "</article>"; }).join("") : emptyState("Nenhum campeonato acompanhado", "Use as configurações para escolher seus campeonatos.", true);
  }

  function favoriteSport() {
    var id = state.bootstrap && state.bootstrap.preferencias && state.bootstrap.preferencias.id_esporte_favorito;
    return arrayOf(state.bootstrap && state.bootstrap.catalogo && state.bootstrap.catalogo.esportes).find(function (item) { return String(item.id || item.id_esporte) === String(id); }) || null;
  }

  function fillSelect(select, items, placeholder, value) {
    select.innerHTML = "<option value=\"\">" + escapeHtml(placeholder) + "</option>" + arrayOf(items).map(function (item) { return "<option value=\"" + escapeHtml(item.id || item.id_esporte || item.id_continente || item.id_pais) + "\">" + escapeHtml(item.nome) + "</option>"; }).join("");
    select.value = value == null ? "" : String(value);
  }

  function fillCountrySelect(continentId, countryId) {
    var catalog = state.bootstrap && state.bootstrap.catalogo || {};
    var countries = arrayOf(catalog.paises).filter(function (item) {
      return !continentId || String(item.id_continente || item.continente_id || "") === String(continentId);
    });
    fillSelect(byId("countrySelect"), countries, "Todos", countryId);
  }

  function normalizeAlerts(value, preferences) {
    if (!Array.isArray(value)) return value || {};
    var activeRows = value.filter(function (item) { return item && item.ativo !== false; });
    return {
      ativo: !!(preferences && preferences.notificacoes_ativas),
      antecedencias_minutos: activeRows.filter(function (item) { return item.tipo_evento === "pre_inicio"; }).map(function (item) { return Number(item.antecedencia_minutos); }).filter(function (minutes) { return minutes > 0; }),
      tipos_evento: activeRows.map(function (item) { return item.tipo_evento; }).filter(function (code, index, items) { return code && items.indexOf(code) === index; })
    };
  }

  function renderSettings() {
    var catalog = state.bootstrap && state.bootstrap.catalogo || {};
    var prefs = state.bootstrap && state.bootstrap.preferencias || {};
    var filters = state.bootstrap && state.bootstrap.filtros || {};
    var alerts = normalizeAlerts(state.bootstrap && state.bootstrap.alertas, prefs);
    fillSelect(byId("favoriteSportSelect"), catalog.esportes, "Escolha um esporte", prefs.id_esporte_favorito);
    var selectedContinent = arrayOf(filters.ids_continentes)[0];
    fillSelect(byId("continentSelect"), catalog.continentes, "Todos", selectedContinent);
    fillCountrySelect(selectedContinent, arrayOf(filters.ids_paises)[0]);
    fillSelect(byId("sportSelect"), catalog.esportes, "Todos", arrayOf(filters.ids_esportes)[0]);
    byId("notificationsEnabled").checked = alerts.ativo === true || prefs.notificacoes_ativas === true;
    var chosen = arrayOf(alerts.antecedencias_minutos);
    byId("alertTimes").innerHTML = [15, 30, 60, 120].map(function (minutes) { return "<label class=\"ie-time-option\"><input type=\"checkbox\" name=\"alertTime\" value=\"" + minutes + "\"" + (chosen.indexOf(minutes) >= 0 ? " checked" : "") + "><span>" + minutes + " min</span></label>"; }).join("");
    var chosenEvents = arrayOf(alerts.tipos_evento);
    byId("alertEvents").innerHTML = ALERT_EVENTS.map(function (eventType) { return "<label class=\"ie-event-option\"><input type=\"checkbox\" name=\"alertEvent\" value=\"" + escapeHtml(eventType.code) + "\"" + (chosenEvents.indexOf(eventType.code) >= 0 ? " checked" : "") + "><span>" + escapeHtml(eventType.label) + "</span></label>"; }).join("");
    renderSelectionLists();
  }

  function renderAll() {
    renderHome();
    renderGames();
    renderNews();
    renderEntities();
    renderSettings();
    var generated = state.card && (state.card.generated_at || state.card.gerado_em) || new Date().toISOString();
    setFreshness(generated);
  }

  async function loadCatalog() {
    var sport = byId("sportSelect") ? byId("sportSelect").value : "";
    var continent = byId("continentSelect") ? byId("continentSelect").value : "";
    var country = byId("countrySelect") ? byId("countrySelect").value : "";
    var teamSearch = byId("teamSearch") ? byId("teamSearch").value.trim() : "";
    var competitionSearch = byId("competitionSearch") ? byId("competitionSearch").value.trim() : "";
    var results = await Promise.all([
      rpc("ie_catalogo_buscar_rpc", { p_tipo: "participante", p_busca: teamSearch || null, p_id_esporte: sport ? Number(sport) : null, p_id_continente: continent ? Number(continent) : null, p_id_pais: country ? Number(country) : null, p_limite: 50, p_offset: 0 }),
      rpc("ie_catalogo_buscar_rpc", { p_tipo: "competicao", p_busca: competitionSearch || null, p_id_esporte: sport ? Number(sport) : null, p_id_continente: continent ? Number(continent) : null, p_id_pais: country ? Number(country) : null, p_limite: 50, p_offset: 0 })
    ]);
    state.catalog.participants = arrayOf(results[0]);
    state.catalog.competitions = arrayOf(results[1]);
    renderSelectionLists();
  }

  async function loadAll(manual) {
    if (state.loading) return;
    state.loading = true;
    byId("refreshButton").classList.add("is-loading");
    if (manual) byId("footerFreshness").textContent = "Atualizando...";
    try {
      await requestSession();
      var results = await Promise.all([
        rpc("ie_central_bootstrap_rpc", {}),
        rpc("ie_card_resumo_rpc", { p_limite: 3 }),
        rpc("ie_partidas_listar_rpc", { p_secao: "ao_vivo", p_limite: 30, p_offset: 0 }),
        rpc("ie_partidas_listar_rpc", { p_secao: "proximos", p_limite: 30, p_offset: 0 }),
        rpc("ie_partidas_listar_rpc", { p_secao: "resultados", p_limite: 30, p_offset: 0 }),
        rpc("ie_noticias_listar_rpc", { p_limite: 30, p_offset: 0 })
      ]);
      state.bootstrap = results[0] || {};
      state.card = results[1] || {};
      state.games.live = arrayOf(results[2]);
      state.games.upcoming = arrayOf(results[3]);
      state.games.results = arrayOf(results[4]);
      state.news = arrayOf(results[5]);
      showApp(true);
      renderAll();
      await loadCatalog();
      saveCache();
      if (manual) showToast("Informações atualizadas.", false);
    } catch (error) {
      var cached = state.session ? loadCache() : null;
      if (cached && cached.bootstrap) {
        state.bootstrap = cached.bootstrap;
        state.card = cached.card;
        state.games = cached.games || state.games;
        state.news = cached.news || [];
        showApp(true);
        renderAll();
        setFreshness(cached.saved_at);
        showToast("Sem conexão. Exibindo a última atualização disponível.", true);
      } else {
        byId("loadingStatus").textContent = friendlyError(error);
        showApp(false);
      }
    } finally {
      state.loading = false;
      byId("refreshButton").classList.remove("is-loading");
    }
  }

  function activateTab(tab) {
    if (tab !== "settings") state.previousTab = tab;
    state.activeTab = tab;
    all("[data-tab]").forEach(function (button) { button.classList.toggle("is-active", button.getAttribute("data-tab") === tab); });
    all("[data-panel]").forEach(function (panel) {
      var active = panel.getAttribute("data-panel") === tab;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeDetail() {
    byId("detailModal").hidden = true;
    document.body.style.overflow = "";
  }

  function detailSection(title, body) {
    if (!body) return "";
    return "<section class=\"ie-detail-section\"><h3>" + escapeHtml(title) + "</h3>" + body + "</section>";
  }

  async function openEventDetail(id, title) {
    byId("detailTitle").textContent = title || "Detalhes da partida";
    byId("detailSubtitle").textContent = "Carregando informações...";
    byId("detailContent").innerHTML = "<div class=\"ie-empty\"><span class=\"ie-spinner\"></span></div>";
    byId("detailModal").hidden = false;
    document.body.style.overflow = "hidden";
    try {
      var data = await rpc("ie_partida_detalhe_rpc", { p_id_evento: Number(id) });
      var event = data && data.evento || {};
      var sides = matchSides(event);
      byId("detailTitle").textContent = sides.home.name + " × " + sides.away.name;
      byId("detailSubtitle").textContent = event.competicao_nome || event.status_texto || "Detalhes da partida";
      var html = renderMatchCard(event, event.status_texto || "Partida");
      var collections = [
        ["Linha do tempo", data.linha_tempo],
        ["Estatísticas", data.estatisticas],
        ["Escalações", data.escalacoes],
        ["Classificação", data.classificacao],
        ["Cotações informativas", data.odds]
      ];
      collections.forEach(function (entry) {
        var rows = arrayOf(entry[1]);
        if (!rows.length) return;
        html += detailSection(entry[0], "<div class=\"ie-detail-list\">" + rows.slice(0, 20).map(function (row) {
          var label = row.nome || row.tipo || row.rotulo || row.mercado || row.participante_nome || "Informação";
          var value = row.valor == null ? (row.detalhe || row.resultado || row.minuto || "") : row.valor;
          return "<div><span>" + escapeHtml(label) + "</span><strong>" + escapeHtml(value) + "</strong></div>";
        }).join("") + "</div>");
      });
      byId("detailContent").innerHTML = html;
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Detalhes indisponíveis", friendlyError(error), false);
    }
  }

  function openGenericDetail(kind, id, title) {
    byId("detailTitle").textContent = title || "Detalhes";
    byId("detailSubtitle").textContent = kind === "competition" ? "Campeonato acompanhado" : "Time ou participante acompanhado";
    byId("detailContent").innerHTML = emptyState("Informações completas na central", "As próximas partidas, resultados e dados relacionados ficam disponíveis nas áreas correspondentes.", false);
    byId("detailModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function openNewsSource(url, title) {
    var safe = safeUrl(url);
    if (!safe) {
      showToast("A fonte desta notícia não forneceu um endereço HTTPS válido.", true);
      return;
    }
    if (!postNative("open_news", { url: safe, title: String(title || "Fonte da notícia"), read_only: true })) {
      showToast("A notícia original só pode ser aberta pelo aplicativo.", true);
    }
  }

  async function saveSettings(event) {
    event.preventDefault();
    var button = byId("saveSettingsButton");
    button.disabled = true;
    button.textContent = "Salvando...";
    try {
      var changes = Object.keys(state.selectionChanges).map(function (key) {
        var parts = key.split(":");
        var value = state.selectionChanges[key];
        return rpc("ie_selecao_salvar_rpc", { p_tipo_alvo: parts[0] === "participant" ? "participante" : "competicao", p_id_alvo: Number(parts[1]), p_acompanhar: !!value.acompanhar, p_notificar: parts[0] === "participant" && !!value.notificar });
      });
      var times = all("input[name=alertTime]:checked").map(function (input) { return Number(input.value); });
      var events = all("input[name=alertEvent]:checked").map(function (input) { return input.value; });
      changes.push(rpc("ie_esporte_favorito_salvar_rpc", { p_id_esporte: byId("favoriteSportSelect").value ? Number(byId("favoriteSportSelect").value) : null }));
      changes.push(rpc("ie_filtros_salvar_rpc", { p_ids_esportes: byId("sportSelect").value ? [Number(byId("sportSelect").value)] : [], p_ids_continentes: byId("continentSelect").value ? [Number(byId("continentSelect").value)] : [], p_ids_paises: byId("countrySelect").value ? [Number(byId("countrySelect").value)] : [] }));
      changes.push(rpc("ie_alertas_salvar_rpc", { p_ativo: byId("notificationsEnabled").checked, p_antecedencias_minutos: times, p_tipos_evento: events }));
      await Promise.all(changes);
      state.selectionChanges = {};
      showToast("Configurações salvas.", false);
      await loadAll(false);
      activateTab(state.previousTab || "home");
      postNative("preferences_changed", {});
    } catch (error) {
      showToast(friendlyError(error), true);
    } finally {
      button.disabled = false;
      button.textContent = "Salvar";
    }
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { fn.apply(null, args); }, delay);
    };
  }

  function setupEvents() {
    byId("retryButton").addEventListener("click", function () { byId("accessPanel").hidden = true; byId("loadingPanel").hidden = false; loadAll(false); });
    byId("refreshButton").addEventListener("click", function () { loadAll(true); });
    byId("settingsButton").addEventListener("click", function () { activateTab("settings"); });
    all("[data-open-settings]").forEach(function (button) { button.addEventListener("click", function () { activateTab("settings"); }); });
    all("[data-close-settings]").forEach(function (button) { button.addEventListener("click", function () { activateTab(state.previousTab || "home"); }); });
    all("[data-tab]").forEach(function (button) { button.addEventListener("click", function () { activateTab(button.getAttribute("data-tab")); }); });
    all("[data-game-filter]").forEach(function (button) { button.addEventListener("click", function () { state.gameFilter = button.getAttribute("data-game-filter"); all("[data-game-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); renderGames(); }); });
    all("[data-close-detail]").forEach(function (button) { button.addEventListener("click", closeDetail); });
    byId("settingsForm").addEventListener("submit", saveSettings);
    var updateCatalog = debounce(function () { loadCatalog().catch(function (error) { showToast(friendlyError(error), true); }); }, 280);
    byId("continentSelect").addEventListener("change", function () {
      fillCountrySelect(byId("continentSelect").value, "");
      updateCatalog();
    });
    ["countrySelect", "sportSelect", "teamSearch", "competitionSearch"].forEach(function (id) { byId(id).addEventListener(id.indexOf("Search") >= 0 ? "input" : "change", updateCatalog); });
    document.addEventListener("click", function (event) {
      var settings = event.target.closest("[data-open-settings]");
      if (settings) { activateTab("settings"); return; }
      var detail = event.target.closest("[data-detail-kind]");
      if (detail) {
        var kind = detail.getAttribute("data-detail-kind");
        if (kind === "news") openNewsSource(detail.getAttribute("data-detail-url"), detail.getAttribute("data-detail-title"));
        else if (kind === "event") openEventDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"));
        else openGenericDetail(kind, detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"));
        return;
      }
      var selection = event.target.closest("[data-selection-key]");
      if (selection) {
        var key = selection.getAttribute("data-selection-key");
        var kind = selection.getAttribute("data-selection-kind");
        var base = state.selectionChanges[key] || selectionMap()[key] || { acompanhar: false, notificar: false };
        var next = { acompanhar: !!base.acompanhar, notificar: !!base.notificar };
        if (kind === "follow") next.acompanhar = !next.acompanhar;
        if (kind === "notify") next.notificar = !next.notificar;
        state.selectionChanges[key] = next;
        renderSelectionLists();
      }
    });
    byId("backButton").addEventListener("click", function () {
      if (!byId("detailModal").hidden) { closeDetail(); return; }
      if (state.activeTab === "settings") { activateTab(state.previousTab || "home"); return; }
      if (!postNative("close", {})) history.back();
    });
    window.addEventListener("popstate", function () {
      if (!byId("detailModal").hidden) closeDetail();
      else if (state.activeTab === "settings") activateTab(state.previousTab || "home");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupEvents();
    loadAll(false);
  });
})();
