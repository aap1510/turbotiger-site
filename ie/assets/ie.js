(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    sessionTimeoutMs: 15000,
    cachePrefix: "tt_ie_cache_v1_"
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

  var ALERT_TIMES = [15, 30, 60, 120];

  function emptyHistoryContributionState() {
    return {
      yearStart: null,
      yearEnd: null,
      filters: {
        year: "",
        teamQuery: "",
        teamKey: "",
        teamName: "",
        competitionKey: "",
        season: "",
        scope: "",
        uf: ""
      },
      teams: [],
      facets: { competitions: [], seasons: [], scopes: [], ufs: [] },
      rows: [],
      mode: "recentes",
      cursor: null,
      nextCursor: null,
      cursorStack: [],
      page: 1,
      hasMore: false,
      loading: false,
      requestId: 0,
      filterRequestId: 0,
      currentRow: null
    };
  }

  var state = {
    session: null,
    bootstrap: null,
    card: null,
    baseSummary: null,
    games: { forYou: [], live: [], upcoming: [], results: [] },
    favoriteCompetitions: [],
    news: [],
    activeSportId: null,
    sportFavoriteOrder: [],
    sportRequestId: 0,
    newsRequestId: 0,
    newsFilters: { participantId: null, competitionId: null },
    activeTab: "home",
    previousTab: "home",
    homeSectionFilter: "",
    settingsContext: "",
    gameFilter: "live",
    gameCompetitionId: null,
    gameCompetitionGames: { live: [], upcoming: [], results: [] },
    gameCompetitionLoading: false,
    gameCompetitionRequestId: 0,
    catalog: { participants: [], competitions: [] },
    catalogKnown: { participants: {}, competitions: {} },
    catalogRequestId: 0,
    selectionChanges: {},
    selectionBusy: {},
    favorites: [],
    favoriteOrder: [],
    historyContribution: emptyHistoryContributionState(),
    detailStack: [],
    loading: false,
    loadGeneration: 0,
    preferenceRevision: 0,
    openingReadySent: false,
    toastTimer: null
  };

  function byId(id) { return document.getElementById(id); }
  function all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  var WINDOWS_1252_BYTES = {
    "\u20ac": 0x80, "\u201a": 0x82, "\u0192": 0x83, "\u201e": 0x84,
    "\u2026": 0x85, "\u2020": 0x86, "\u2021": 0x87, "\u02c6": 0x88,
    "\u2030": 0x89, "\u0160": 0x8a, "\u2039": 0x8b, "\u0152": 0x8c,
    "\u017d": 0x8e, "\u2018": 0x91, "\u2019": 0x92, "\u201c": 0x93,
    "\u201d": 0x94, "\u2022": 0x95, "\u2013": 0x96, "\u2014": 0x97,
    "\u02dc": 0x98, "\u2122": 0x99, "\u0161": 0x9a, "\u203a": 0x9b,
    "\u0153": 0x9c, "\u017e": 0x9e, "\u0178": 0x9f
  };

  function mojibakeScore(value) {
    var text = String(value || "");
    var markers = text.match(/[\u00c2\u00c3\u00e2\u00f0\ufffd]/g);
    var controls = text.match(/[\u0080-\u009f]/g);
    return (markers ? markers.length : 0) + (controls ? controls.length * 2 : 0);
  }

  function decodeWesternUtf8(value) {
    var text = String(value || "");
    var encoded = "";
    for (var index = 0; index < text.length; index += 1) {
      var character = text.charAt(index);
      var code = text.charCodeAt(index);
      var byte = code <= 0xff ? code : WINDOWS_1252_BYTES[character];
      if (byte == null) return text;
      encoded += "%" + byte.toString(16).padStart(2, "0");
    }
    try { return decodeURIComponent(encoded); } catch (error) { return text; }
  }

  function decodeTextEntities(value) {
    var text = String(value == null ? "" : value);
    for (var attempt = 0; attempt < 2 && /&(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);/i.test(text); attempt += 1) {
      var decoder = document.createElement("textarea");
      decoder.innerHTML = text;
      var decoded = decoder.value;
      if (decoded === text) break;
      text = decoded;
    }
    return text;
  }

  var CONFIRMED_DISPLAY_REPLACEMENTS = [
    ["Ta\ufffda", "Taça"],
    ["S\ufffdo", "São"],
    ["J\ufffdnior", "Júnior"],
    ["Cear\ufffd", "Ceará"],
    ["S\ufffdO", "SÃO"],
    ["Ferrovi\ufffdrio", "Ferroviário"],
    ["Am\ufffdrica", "América"],
    ["Quixad\ufffd", "Quixadá"],
    ["Atl\ufffdtico", "Atlético"],
    ["TA\ufffdA", "TAÇA"],
    ["Jos\ufffd", "José"],
    ["Uni\ufffdo", "União"],
    ["Gr\ufffdmio", "Grêmio"]
  ];

  function repairConfirmedDisplayText(value) {
    return CONFIRMED_DISPLAY_REPLACEMENTS.reduce(function (text, replacement) {
      return text.split(replacement[0]).join(replacement[1]);
    }, String(value == null ? "" : value));
  }

  function displayText(value) {
    var text = repairConfirmedDisplayText(decodeTextEntities(value));
    for (var attempt = 0; attempt < 2; attempt += 1) {
      var decoded = decodeWesternUtf8(text);
      if (decoded === text || mojibakeScore(decoded) >= mojibakeScore(text)) break;
      text = decoded;
    }
    return repairConfirmedDisplayText(text);
  }

  function competitionDisplayName(value, maximumLength) {
    var name = displayText(value).replace(/\bcampeonato\s+/gi, "").replace(/\s+/g, " ").trim();
    var limit = Number(maximumLength || 0);
    if (limit > 1 && name.length > limit) name = name.slice(0, limit - 1).trimEnd() + "…";
    return name;
  }

  function normalizeSearchText(value) {
    var text = displayText(value);
    if (typeof text.normalize === "function") text = text.normalize("NFD");
    return text.replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return displayText(value)
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

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
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
    var parts = displayText(name || "?").trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join("") || "?";
  }

  function logoHtml(url, name, className, abbreviation) {
    var safe = safeUrl(url);
    var fallback = String(abbreviation || "").trim().toUpperCase() || initials(name);
    return "<span class=\"" + (className || "ie-crest") + "\">" + (safe ? "<img src=\"" + escapeHtml(safe) + "\" alt=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer\">" : escapeHtml(fallback)) + "</span>";
  }

  function icon(name) {
    return "<svg aria-hidden=\"true\"><use href=\"#ie-ico-" + escapeHtml(name) + "\"/></svg>";
  }

  function detailAttributes(kind, id, url, title) {
    var label = String(title || "Abrir informações");
    return " data-detail-kind=\"" + escapeHtml(kind || "generic") + "\" data-detail-id=\"" + escapeHtml(id || "") + "\" data-detail-url=\"" + escapeHtml(url || "") + "\" data-detail-title=\"" + escapeHtml(title || "") + "\" role=\"button\" tabindex=\"0\" aria-label=\"" + escapeHtml(label) + "\"";
  }

  function friendlyError(error) {
    var raw = String(error && (error.message || error.error) || error || "").trim();
    var messages = {
      app_session_timeout: "O aplicativo demorou para validar sua sessão.",
      app_session_unavailable: "Não foi possível validar sua sessão pelo aplicativo.",
      sessao_expirada: "Sua sessão expirou. Volte ao aplicativo e tente novamente.",
      nao_autenticado: "Sua sessão não está disponível.",
      Failed_to_fetch: "Não foi possível acessar a central. Verifique sua conexão."
      ,ano_e_time_obrigatorios: "Escolha o ano e o time antes de pesquisar."
      ,ano_fora_da_base: "O ano escolhido está fora do período disponível."
      ,time_historico_invalido: "Escolha um time na lista de resultados."
      ,campos_essenciais_obrigatorios: "Preencha data, times, placar, competição e temporada."
      ,confronto_historico_no_futuro: "A data informada ainda não ocorreu."
      ,placar_invalido: "Confira os números do placar informado."
      ,placar_intervalo_incompleto: "Informe os dois placares do intervalo."
      ,placar_intervalo_invalido: "O placar do intervalo não pode ser maior que o placar final."
      ,times_invalidos: "Os times precisam ser diferentes e válidos."
      ,competicao_invalida: "Informe uma competição válida."
      ,campos_inclusao_obrigatorios: "Preencha todos os dados do confronto antes de enviar."
      ,dados_contribuicao_invalidos: "Revise os dados informados."
      ,dados_contribuicao_excedem_limite: "As informações ultrapassaram o limite permitido."
      ,dados_invalidos: "Revise os dados informados."
      ,dados_excedem_limite: "As informações ultrapassaram o limite permitido."
      ,observacao_excede_limite: "A observação ultrapassou o limite permitido."
      ,campos_texto_excedem_limite: "Um dos textos ultrapassou o limite permitido."
      ,nenhuma_correcao_informada: "Altere pelo menos uma informação ou escreva uma observação."
      ,confronto_historico_nao_encontrado: "Este confronto não foi localizado na base."
      ,chave_idempotencia_invalida: "Não foi possível identificar este envio. Tente novamente."
    };
    return messages[raw] || messages[raw.replace(/\s+/g, "_")] || raw || "Não foi possível carregar as informações.";
  }

  function showToast(message, isError) {
    var toast = byId("toast");
    window.clearTimeout(state.toastTimer);
    toast.textContent = displayText(message);
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

  function notifyInitialOpeningReady() {
    if (state.openingReadySent) return;
    var token = "";
    try { token = new URLSearchParams(window.location.search).get("carga") || ""; } catch (error) { token = ""; }
    if (!token || !postNative("central_ready", { carga: token })) return;
    state.openingReadySent = true;
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
      if (!hasBridge() || !sessionPromise || !sessionResolve) throw new Error("app_session_unavailable");
      if (!payload || payload.ok !== true) throw new Error(payload && payload.error || "app_session_unavailable");
      var value = payload.session || payload;
      var token = String(value.access_token || "").trim();
      if (!token) throw new Error("app_session_unavailable");
      var jwt = jwtPayload(token);
      var previousCacheKey = state.session && state.session.user_id ? cacheKey() : "";
      state.session = {
        access_token: token,
        expires_at: Number(jwt.exp || 0) * 1000,
        user_id: String(jwt.sub || "")
      };
      if (previousCacheKey && previousCacheKey !== cacheKey()) sessionStorage.removeItem(previousCacheKey);
      finishSession(null, state.session);
    } catch (error) {
      finishSession(error);
    }
  };

  window.TurboTigerIERefresh = function () {
    return loadAll(true);
  };

  window.TurboTigerIEClearSession = function () {
    var currentCacheKey = state.session && state.session.user_id ? cacheKey() : "";
    if (currentCacheKey) sessionStorage.removeItem(currentCacheKey);
    window.clearTimeout(sessionTimer);
    sessionTimer = null;
    sessionPromise = null;
    sessionResolve = null;
    sessionReject = null;
    state.session = null;
    state.bootstrap = null;
    state.card = null;
    state.baseSummary = null;
    state.games = { forYou: [], live: [], upcoming: [], results: [] };
    state.favoriteCompetitions = [];
    state.news = [];
    state.activeSportId = null;
    state.sportFavoriteOrder = [];
    state.sportRequestId += 1;
    state.newsRequestId += 1;
    state.newsFilters = { participantId: null, competitionId: null };
    state.gameCompetitionId = null;
    state.gameCompetitionGames = { live: [], upcoming: [], results: [] };
    state.gameCompetitionLoading = false;
    state.gameCompetitionRequestId += 1;
    state.catalog = { participants: [], competitions: [] };
    state.catalogKnown = { participants: {}, competitions: {} };
    state.catalogRequestId += 1;
    state.selectionChanges = {};
    state.selectionBusy = {};
    state.favorites = [];
    state.favoriteOrder = [];
    state.historyContribution = emptyHistoryContributionState();
    state.detailStack = [];
    state.loadGeneration += 1;
    state.loading = false;
    if (byId("detailModal")) closeDetail();
    if (byId("ieApp")) showApp(false);
  };

  function requestSession() {
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

  function cacheKey() {
    return CONFIG.cachePrefix + (state.session && state.session.user_id || "anonymous");
  }

  function saveCache() {
    try {
      sessionStorage.setItem(cacheKey(), JSON.stringify({ saved_at: new Date().toISOString(), bootstrap: state.bootstrap, card: state.card, baseSummary: state.baseSummary, games: state.games, favoriteCompetitions: state.favoriteCompetitions, news: state.news, favorites: state.favorites, activeSportId: state.activeSportId, sportFavoriteOrder: state.sportFavoriteOrder }));
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
    byId("headerFreshness").textContent = displayText(relativeFreshness(value));
  }

  function emptyState(title, text, canConfigure) {
    return "<div class=\"ie-empty\"><strong>" + escapeHtml(title) + "</strong><p>" + escapeHtml(text) + "</p></div>";
  }

  function matchSides(item) {
    var participants = arrayOf(item.participantes);
    var homeFromList = participants.find(function (participant) { return /^(casa|mandante|home|local)$/i.test(String(participant.papel || "")); }) || participants[0] || {};
    var awayFromList = participants.find(function (participant) { return /^(fora|visitante|away)$/i.test(String(participant.papel || "")); }) || participants[1] || {};
    var home = item.participante_casa || item.mandante || item.time_casa || item.home || homeFromList;
    var away = item.participante_fora || item.visitante || item.time_fora || item.away || awayFromList;
    return {
      home: { name: home.nome || home.nome_curto || item.time_casa_nome || item.mandante_nome || "Casa", abbreviation: home.sigla || home.tla || item.time_casa_sigla, logo: home.imagem_url || home.logo_url || home.logo || item.time_casa_logo, score: home.placar_numerico == null ? home.placar : home.placar_numerico },
      away: { name: away.nome || away.nome_curto || item.time_fora_nome || item.visitante_nome || "Visitante", abbreviation: away.sigla || away.tla || item.time_fora_sigla, logo: away.imagem_url || away.logo_url || away.logo || item.time_fora_logo, score: away.placar_numerico == null ? away.placar : away.placar_numerico }
    };
  }

  function sportIdOf(item) {
    return Number(item && (item.id_esporte || item.esporte_id || item.esporte && (item.esporte.id_esporte || item.esporte.id)) || 0);
  }

  function catalogSports() {
    return arrayOf(state.bootstrap && state.bootstrap.catalogo && state.bootstrap.catalogo.esportes);
  }

  function sportId(item) {
    return Number(item && (item.id_esporte || item.id) || item || 0);
  }

  function sportById(id) {
    return catalogSports().find(function (item) { return sportId(item) === Number(id); }) || null;
  }

  function sportCatalogOrder(item) {
    return numberOf(item && (item.ordem_catalogo || item.ordem), Number.MAX_SAFE_INTEGER);
  }

  function sportIsOperational(item) {
    if (!item) return false;
    if (typeof item.operacional === "boolean") return item.operacional;
    var status = String(item.status_catalogo || "").toLowerCase();
    if (status) return status === "operacional";
    // Compatibilidade somente com o cache da sessao atual, cujo catalogo
    // anterior continha exclusivamente modalidades operacionais.
    return true;
  }

  function activeSportIsOperational() {
    return sportIsOperational(activeSport());
  }

  function comingSoonState(sport) {
    sport = sport || activeSport();
    var name = sport && sport.nome || "Este esporte";
    return "<section class=\"ie-coming-soon\"><span>" + escapeHtml(name) + "</span><strong>Em breve!</strong><p>Estamos preparando esta modalidade para você acompanhar competições, participantes e confrontos em um só lugar.</p></section>";
  }

  function normalizeSportFavoriteOrder(preferences) {
    var allowed = {};
    catalogSports().forEach(function (item) { allowed[String(sportId(item))] = true; });
    var rows = arrayOf(preferences && preferences.esportes_favoritos).slice().sort(function (a, b) { return numberOf(a.ordem, 0) - numberOf(b.ordem, 0); });
    var ids = rows.map(sportId).filter(function (id, index, values) { return id > 0 && allowed[String(id)] && values.indexOf(id) === index; });
    var first = Number(preferences && preferences.id_esporte_favorito || 0);
    if (!ids.length && first > 0 && allowed[String(first)]) ids.push(first);
    return ids;
  }

  function ensureActiveSport() {
    var available = catalogSports().map(sportId).filter(function (id) { return id > 0; });
    state.sportFavoriteOrder = state.sportFavoriteOrder.filter(function (id, index, values) { return available.indexOf(Number(id)) >= 0 && values.indexOf(id) === index; }).map(Number);
    if (state.sportFavoriteOrder.indexOf(Number(state.activeSportId)) < 0) state.activeSportId = state.sportFavoriteOrder[0] || null;
  }

  function activeSport() {
    return sportById(state.activeSportId);
  }

  function selectionSportMatches(item, wantedId) {
    var itemSport = sportIdOf(item);
    return !wantedId || itemSport === Number(wantedId);
  }

  function followedSelections(type, wantedSportId) {
    return arrayOf(state.bootstrap && state.bootstrap.selecoes).filter(function (item) {
      return selectionIdentity(item).type === type && item.acompanhar && selectionSportMatches(item, wantedSportId);
    });
  }

  function selectionFavoriteOrder(item, fallbackIndex) {
    var value = item && item.ordem_favorito;
    if (value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) return Number(value);
    value = item && item.id_selecao;
    if (value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) return Number(value);
    return Number.MAX_SAFE_INTEGER - 1000 + numberOf(fallbackIndex, 0);
  }

  function gameCompetitionSelections() {
    return followedSelections("competition", state.activeSportId).map(function (item, index) { return { item: item, index: index }; }).sort(function (a, b) {
      var aOrder = selectionFavoriteOrder(a.item, a.index);
      var bOrder = selectionFavoriteOrder(b.item, b.index);
      var aName = competitionDisplayName(a.item.nome || a.item.nome_exibicao || a.item.competicao_nome || "Competição");
      var bName = competitionDisplayName(b.item.nome || b.item.nome_exibicao || b.item.competicao_nome || "Competição");
      return aOrder - bOrder || aName.localeCompare(bName, "pt-BR");
    }).map(function (entry) { return entry.item; });
  }

  function resetGameCompetitionFilter() {
    state.gameCompetitionId = null;
    state.gameCompetitionGames = { live: [], upcoming: [], results: [] };
    state.gameCompetitionLoading = false;
    state.gameCompetitionRequestId += 1;
  }

  function selectedGameCompetitionId() {
    var selected = Number(state.gameCompetitionId || 0);
    if (!selected) return null;
    var valid = gameCompetitionSelections().some(function (item) {
      return Number(selectionIdentity(item).id) === selected;
    });
    if (!valid) {
      resetGameCompetitionFilter();
      return null;
    }
    return selected;
  }

  function favoriteParticipantIds(wantedSportId) {
    return followedSelections("participant", wantedSportId).map(function (item) { return Number(selectionIdentity(item).id); }).filter(function (id) { return id > 0; });
  }

  function matchParticipantIds(item) {
    var sides = [item && (item.participante_casa || item.mandante || item.time_casa || item.home), item && (item.participante_fora || item.visitante || item.time_fora || item.away)];
    var ids = arrayOf(item && item.participantes).map(function (participant) { return Number(participant.id_participante || participant.participante_id || participant.id || 0); });
    sides.forEach(function (participant) { if (participant) ids.push(Number(participant.id_participante || participant.participante_id || participant.id || 0)); });
    return ids.filter(function (id, index, values) { return id > 0 && values.indexOf(id) === index; });
  }

  function matchInvolvesFavoriteTeam(item, wantedSportId) {
    var favorites = favoriteParticipantIds(wantedSportId);
    var ids = matchParticipantIds(item);
    if (ids.length) return ids.some(function (id) { return favorites.indexOf(id) >= 0; });
    var favoriteNames = followedSelections("participant", wantedSportId).map(function (selection) { return normalizeSearchText(selection.nome || selection.nome_exibicao || ""); });
    var sides = matchSides(item || {});
    return [sides.home.name, sides.away.name].some(function (name) { return favoriteNames.indexOf(normalizeSearchText(name)) >= 0; });
  }

  function orderedFavoriteParticipantIds(wantedSportId) {
    var available = favoriteParticipantIds(wantedSportId);
    var ordered = state.favoriteOrder.map(Number).filter(function (id) {
      return id > 0 && available.indexOf(id) >= 0;
    });
    available.forEach(function (id) {
      if (ordered.indexOf(id) < 0) ordered.push(id);
    });
    return ordered;
  }

  function matchCanonicalId(item) {
    var value = item && (item.id_evento || item.id_partida || item.id);
    return value == null || value === "" ? "" : String(value);
  }

  function matchStartTimestamp(item) {
    var value = item && (item.inicio_em || item.data_inicio || item.data_partida) || "";
    var time = item && (item.hora_partida || item.hora) || "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value)) && time) value = String(value) + "T" + String(time);
    var timestamp = Date.parse(String(value));
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  function matchCompetitionId(item) {
    return Number(item && (item.id_competicao || item.competicao_id || item.competicao && (item.competicao.id_competicao || item.competicao.id)) || 0);
  }

  function orderedFavoriteCompetitionIds(wantedSportId) {
    return followedSelections("competition", wantedSportId).map(function (item, index) {
      return {
        id: Number(selectionIdentity(item).id),
        order: selectionFavoriteOrder(item, index),
        index: index
      };
    }).filter(function (entry) { return entry.id > 0; }).sort(function (a, b) {
      return a.order - b.order || a.index - b.index || a.id - b.id;
    }).map(function (entry) { return entry.id; });
  }

  function orderMatchesByFavorites(rows, wantedSportId, filter) {
    var seen = {};
    var unique = arrayOf(rows).filter(function (item) {
      var id = matchCanonicalId(item);
      if (!id) return true;
      if (seen[id]) return false;
      seen[id] = true;
      return true;
    });
    var favoriteTeams = orderedFavoriteParticipantIds(wantedSportId);
    var favoriteCompetitions = orderedFavoriteCompetitionIds(wantedSportId);
    var now = Date.now();
    return unique.map(function (item, index) {
      var participantOrders = matchParticipantIds(item).map(function (id) { return favoriteTeams.indexOf(id); }).filter(function (order) { return order >= 0; });
      var teamOrder = participantOrders.length ? Math.min.apply(Math, participantOrders) : -1;
      var competitionOrder = favoriteCompetitions.indexOf(matchCompetitionId(item));
      var groupType = teamOrder >= 0 ? 0 : competitionOrder >= 0 ? 1 : 2;
      var groupOrder = teamOrder >= 0 ? teamOrder : competitionOrder >= 0 ? competitionOrder : Number.MAX_SAFE_INTEGER;
      var timestamp = matchStartTimestamp(item);
      var status = String(item && (item.status || item.status_canonico || item.status_normalizado) || "").toLowerCase();
      var live = item && item.ao_vivo === true || ["ao_vivo", "live", "em_andamento", "intervalo", "prorrogacao", "penaltis"].indexOf(status) >= 0;
      var statusOrder = filter === "forYou" ? (live ? 0 : timestamp !== null && timestamp >= now ? 1 : 2) : 0;
      var descending = filter === "results" || filter === "forYou" && statusOrder === 2;
      return { item: item, index: index, id: matchCanonicalId(item), groupType: groupType, groupOrder: groupOrder, statusOrder: statusOrder, timestamp: timestamp, descending: descending };
    }).sort(function (a, b) {
      if (a.groupType !== b.groupType) return a.groupType - b.groupType;
      if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
      if (a.statusOrder !== b.statusOrder) return a.statusOrder - b.statusOrder;
      var aValid = a.timestamp !== null;
      var bValid = b.timestamp !== null;
      if (aValid !== bValid) return aValid ? -1 : 1;
      if (aValid && a.timestamp !== b.timestamp) return (a.timestamp - b.timestamp) * (a.descending ? -1 : 1);
      var idOrder = a.id.localeCompare(b.id, "pt-BR", { numeric: true });
      return idOrder || a.index - b.index;
    }).map(function (entry) {
      return entry.item;
    });
  }

  function renderMatchCard(item, label, interactive) {
    var sides = matchSides(item || {});
    var status = String(item.status || item.status_canonico || "").toLowerCase();
    var live = status === "ao_vivo" || status === "live" || status === "em_andamento";
    var id = item.id_evento || item.id_partida || item.id || "";
    var result = item.placar || item.resultado || {};
    var scoreHome = item.placar_casa == null ? (sides.home.score == null ? (result.casa == null ? "" : result.casa) : sides.home.score) : item.placar_casa;
    var scoreAway = item.placar_fora == null ? (sides.away.score == null ? (result.fora == null ? "" : result.fora) : sides.away.score) : item.placar_fora;
    var started = live || ["intervalo", "prorrogacao", "penaltis", "encerrada", "finished"].indexOf(status) >= 0;
    if (!started) {
      scoreHome = "";
      scoreAway = "";
    }
    var startAt = item.inicio_em || item.data_partida || item.data_inicio;
    var rawStatusText = String(item.minuto || item.status_texto || item.status_detalhado || "").trim();
    var technicalStatus = /^(TIMED|SCHEDULED|NOT_STARTED|NS)$/i.test(rawStatusText) || /^[A-Z_]+$/.test(rawStatusText);
    var statusText = technicalStatus ? "" : rawStatusText;
    if (!statusText) statusText = live ? "Ao vivo" : formatDateTime(startAt, false);
    var dateText = formatDate(startAt);
    var center = live || scoreHome !== "" || scoreAway !== "" ? "<span class=\"ie-score\">" + escapeHtml(scoreHome === "" ? 0 : scoreHome) + " – " + escapeHtml(scoreAway === "" ? 0 : scoreAway) + "</span><span class=\"ie-match-time\">" + escapeHtml(statusText) + "</span>" : "<span class=\"ie-match-time\">" + escapeHtml(formatDateTime(startAt, false) || "A definir") + "</span>";
    if (dateText) center += "<span class=\"ie-match-date\">" + escapeHtml(dateText) + "</span>";
    var attributes = interactive === false ? "" : detailAttributes("event", id, "", sides.home.name + " x " + sides.away.name);
    var competition = competitionDisplayName(item.competicao_nome || item.competicao && (item.competicao.nome || item.competicao) || label || "Confronto", 25);
    var actions = interactive === false || !id ? "" : "<div class=\"ie-match-actions\"><button type=\"button\" data-match-action=\"odds\" data-event-id=\"" + escapeHtml(id) + "\" aria-label=\"Abrir cotações de " + escapeHtml(sides.home.name + " e " + sides.away.name) + "\">" + icon("chart") + "</button><button type=\"button\" data-match-action=\"analysis\" data-event-id=\"" + escapeHtml(id) + "\" aria-label=\"Abrir análises de " + escapeHtml(sides.home.name + " e " + sides.away.name) + "\">" + icon("analysis") + "</button></div>";
    return "<article class=\"ie-feed-card ie-wide ie-match-card" + (live ? " is-live" : "") + "\"" + attributes + "><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon(live ? "live" : "trophy") + "</span>" + escapeHtml(competition) + "</span>" + actions + "</div><div class=\"ie-match\"><div class=\"ie-side\">" + logoHtml(sides.home.logo, sides.home.name, "", sides.home.abbreviation) + "<strong>" + escapeHtml(sides.home.name) + "</strong></div><div class=\"ie-match-center\">" + center + "</div><div class=\"ie-side\">" + logoHtml(sides.away.logo, sides.away.name, "", sides.away.abbreviation) + "<strong>" + escapeHtml(sides.away.name) + "</strong></div></div></article>";
  }

  function renderNewsCard(item) {
    var id = item.id_noticia || item.id || "";
    var url = item.url_original || item.url || "";
    return "<article class=\"ie-feed-card\"" + detailAttributes("news", id, url, item.titulo || "Notícia esportiva") + "><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Notícia esportiva") + "</h3>" + (item.resumo || item.descricao ? "<p class=\"ie-news-description\">" + escapeHtml(item.resumo || item.descricao) + "</p>" : "") + "<span class=\"ie-source\">Fonte: " + escapeHtml(item.fonte_nome || item.fonte || "não informada") + (item.publicado_em ? " · " + escapeHtml(formatDateTime(item.publicado_em)) : "") + "</span></article>";
  }

  function renderOddsCard(item, prediction) {
    function firstValue(values) {
      return values.find(function (value) { return value !== null && value !== undefined && value !== ""; });
    }
    var values = prediction ? [
      firstValue([item.probabilidade_casa, item.casa]),
      firstValue([item.probabilidade_empate, item.empate]),
      firstValue([item.probabilidade_fora, item.fora])
    ] : [
      firstValue([item.odd_casa, item.casa]),
      firstValue([item.odd_empate, item.empate]),
      firstValue([item.odd_fora, item.fora])
    ];
    var suffix = prediction ? "%" : "";
    var labels = ["Casa", "Empate", "Fora"];
    var detailKind = prediction ? "analysis" : "odds";
    var detailTitle = prediction ? "Análises estatísticas" : "Cotações informativas";
    return "<article class=\"ie-feed-card\"" + detailAttributes(detailKind, item.id_evento || item.id_partida || "", "", detailTitle) + "><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>" + (prediction ? "Probabilidade estatística" : "Cotações informativas") + "</span></div><div class=\"ie-stat-row\"><span>" + labels[0] + "<strong>" + escapeHtml(values[0] == null ? "—" : values[0] + suffix) + "</strong></span><span>" + labels[1] + "<strong>" + escapeHtml(values[1] == null ? "—" : values[1] + suffix) + "</strong></span><span>" + labels[2] + "<strong>" + escapeHtml(values[2] == null ? "—" : values[2] + suffix) + "</strong></span></div>" + (prediction ? "<p class=\"ie-disclaimer\">Estimativa estatística. Não representa recomendação nem garantia de resultado.</p>" : "<p class=\"ie-disclaimer\">Informação neutra, sem indicação ou direcionamento para apostas.</p>") + "</article>";
  }

  function renderAnalysisCard(item) {
    var type = String(item.tipo || item.tipo_analise || item.kind || "").toLowerCase();
    var historicalSummary = item.resumo && typeof item.resumo === "object" ? item.resumo : item;
    var historicalType = type === "confronto_historico" || type === "historico_confronto" || type === "h2h";
    if (historicalType && numberOf(historicalSummary.jogos, 0) > 0) {
      var teamA = item.time_a || item.participante_a || {};
      var teamB = item.time_b || item.participante_b || {};
      var teamAName = item.time_a_nome || item.nome_time_a || teamA.nome || item.participante_casa_nome || "Time A";
      var teamBName = item.time_b_nome || item.nome_time_b || teamB.nome || item.participante_fora_nome || "Time B";
      var id = item.id_evento || item.id_partida || item.id || "";
      return "<article class=\"ie-feed-card ie-analysis-summary\"" + detailAttributes("analysis", id, "", teamAName + " x " + teamBName) + "><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>Análises estatísticas</span></div><div class=\"ie-h2h-card-title\"><strong>" + escapeHtml(numberOf(historicalSummary.jogos, 0)) + " jogos</strong><span>" + escapeHtml(teamAName) + " × " + escapeHtml(teamBName) + "</span></div><div class=\"ie-stat-row\"><span>" + escapeHtml(teamAName) + "<strong>" + escapeHtml(numberOf(historicalSummary.vitorias_time_a, 0)) + "</strong><small>vitórias</small></span><span>Empates<strong>" + escapeHtml(numberOf(historicalSummary.empates, 0)) + "</strong><small>resultados</small></span><span>" + escapeHtml(teamBName) + "<strong>" + escapeHtml(numberOf(historicalSummary.vitorias_time_b, 0)) + "</strong><small>vitórias</small></span></div><p class=\"ie-disclaimer\">Estatística histórica. Resultados passados não garantem resultados futuros.</p></article>";
    }
    if (type === "resumo_personalizado" || item.proximos !== undefined || item.ao_vivo !== undefined || item.encerrados !== undefined) {
      return "<article class=\"ie-feed-card\"" + detailAttributes("analysis", item.id_evento || item.id || "", "", item.titulo || "Análises estatísticas") + "><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>Análises</span></div><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Resumo dos seus acompanhamentos") + "</h3><div class=\"ie-stat-row\"><span>Próximos<strong>" + escapeHtml(numberOf(item.proximos, 0)) + "</strong></span><span>Ao vivo<strong>" + escapeHtml(numberOf(item.ao_vivo, 0)) + "</strong></span><span>Encerrados<strong>" + escapeHtml(numberOf(item.encerrados, 0)) + "</strong></span></div><p class=\"ie-disclaimer\">Resumo informativo das suas seleções esportivas.</p></article>";
    }

    var probabilityType = /probabil|predi|estimativa/.test(type);
    var explicitProbability = item.probabilidade_casa !== undefined || item.probabilidade_empate !== undefined || item.probabilidade_fora !== undefined;
    var probabilityValues = explicitProbability ? [item.probabilidade_casa, item.probabilidade_empate, item.probabilidade_fora] : [item.casa, item.empate, item.fora];
    var completeProbability = probabilityValues.every(function (value) { return value !== null && value !== undefined && value !== ""; });
    if ((probabilityType || explicitProbability) && completeProbability) return renderOddsCard(item, true);

    return "<article class=\"ie-feed-card\"" + detailAttributes("analysis", item.id_evento || item.id || "", "", item.titulo || "Análises estatísticas") + "><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>Análises</span></div><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Análise esportiva") + "</h3>" + (item.resumo || item.descricao ? "<p class=\"ie-news-description\">" + escapeHtml(item.resumo || item.descricao) + "</p>" : "") + "<p class=\"ie-disclaimer\">Estimativas, quando disponíveis, são estatísticas e não representam recomendação nem garantia de resultado.</p></article>";
  }

  function renderCompetitionCard(item) {
    var rows = arrayOf(item.classificacao || item.posicoes).slice(0, 4);
    var period = [item.data_inicio ? "Início " + formatDate(item.data_inicio) : "", item.data_fim ? "Fim " + formatDate(item.data_fim) : ""].filter(Boolean).join(" • ");
    var summary = (item.fase_atual ? "<p class=\"ie-news-description\"><strong>" + escapeHtml(item.fase_atual) + "</strong></p>" : "") + (period ? "<span class=\"ie-source\">" + escapeHtml(period) + "</span>" : "");
    var body = rows.length ? "<div class=\"ie-standings\">" + rows.map(function (row) { return "<div class=\"ie-standing-row\"><span>" + escapeHtml(row.posicao || row.rank || "—") + "</span><strong>" + escapeHtml(row.nome || row.time_nome || row.participante_nome || "") + "</strong><strong>" + escapeHtml(row.pontos == null ? "" : row.pontos) + "</strong></div>"; }).join("") + "</div>" : summary || "<p class=\"ie-news-description\">Calendário em atualização.</p>";
    var name = competitionDisplayName(item.nome || item.competicao_nome || "Competição");
    return "<article class=\"ie-feed-card\"" + detailAttributes("competition", item.id_competicao || item.id || "", "", name) + "><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("trophy") + "</span>Competição</span></div><h3 class=\"ie-news-title\">" + escapeHtml(name) + "</h3>" + body + "</article>";
  }

  function subcardMatchesSection(subcard, section) {
    var code = String(subcard && (subcard.codigo || subcard.tipo) || "").toLowerCase();
    var wanted = String(section || "").toLowerCase();
    if (wanted === "partidas" || wanted === "jogos") return code.indexOf("part") >= 0 || code.indexOf("jogo") >= 0 || code.indexOf("evento") >= 0;
    if (wanted === "campeonatos") return code.indexOf("camp") >= 0 || code.indexOf("class") >= 0 || code.indexOf("compet") >= 0;
    if (wanted === "noticias") return code.indexOf("notic") >= 0;
    if (wanted === "cotacoes") return code.indexOf("cotac") >= 0 || code.indexOf("odd") >= 0;
    if (wanted === "analises") return code.indexOf("analis") >= 0 || code.indexOf("pred") >= 0 || code.indexOf("prob") >= 0;
    return true;
  }

  function formatDatabasePeriod(data) {
    if (!data) return "";
    function dateOnly(value) {
      var match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
      return match ? match[3] + "/" + match[2] + "/" + match[1] : formatDate(value);
    }
    var first = data.data_inicio || data.periodo_inicio || data.primeiro_jogo_em;
    var last = data.data_fim || data.periodo_fim || data.ultimo_jogo_em;
    if (first && last) return dateOnly(first) + " a " + dateOnly(last);
    if (first) return "Desde " + dateOnly(first);
    if (last) return "Até " + dateOnly(last);
    return "";
  }

  function renderDatabaseSummaryCard(data) {
    if (!data || data.pais !== "Brasil" || data.modalidade !== "Futebol") return "";
    function total(value) { return numberOf(value, 0).toLocaleString("pt-BR"); }
    var period = formatDatabasePeriod(data);
    return "<article class=\"ie-feed-card ie-wide ie-base-summary-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>Base própria</span></div><h3 class=\"ie-news-title\">Futebol do Brasil</h3><p class=\"ie-news-description\">Acervo histórico organizado pelo Turbo Tiger" + (period ? " · " + escapeHtml(period) : "") + "</p><div class=\"ie-stat-row\"><span>Partidas<strong>" + escapeHtml(total(data.total_registros)) + "</strong></span><span>Competições<strong>" + escapeHtml(total(data.total_competicoes)) + "</strong></span><span>Times<strong>" + escapeHtml(total(data.total_times)) + "</strong></span></div>" + historyContributionLinkHtml() + "</article>";
  }

  function renderHome() {
    var card = state.card || {};
    var filteredSection = String(state.homeSectionFilter || "").toLowerCase();
    if (!activeSport()) {
      byId("homeContent").innerHTML = emptyState("Escolha seus esportes", "Defina um esporte favorito e acompanhe os times, participantes e competições que realmente interessam a você.", true);
      return;
    }
    if (!activeSportIsOperational()) {
      byId("homeContent").innerHTML = comingSoonState();
      return;
    }
    var html = [];
    if (filteredSection) {
      if (filteredSection === "analises") {
        var databaseCard = renderDatabaseSummaryCard(state.baseSummary);
        if (databaseCard) html.push(databaseCard);
      }
      arrayOf(card.subcards).filter(function (subcard) { return subcardMatchesSection(subcard, filteredSection); }).forEach(function (subcard) {
        var code = String(subcard.codigo || subcard.tipo || "").toLowerCase();
        arrayOf(subcard.itens).slice(0, 3).forEach(function (item) {
          if (code.indexOf("cotac") >= 0 || code.indexOf("odd") >= 0) html.push(renderOddsCard(item, false));
          else if (code.indexOf("analis") >= 0 || code.indexOf("pred") >= 0 || code.indexOf("prob") >= 0) html.push(renderAnalysisCard(item));
        });
      });
    } else {
      orderMatchesByFavorites(state.games.forYou, state.activeSportId, "forYou").forEach(function (item) { html.push(renderMatchCard(item)); });
      state.favoriteCompetitions.forEach(function (item) { html.push(renderCompetitionCard(item)); });
    }
    byId("homeContent").innerHTML = html.join("") || emptyState(filteredSection ? "Nenhuma informação disponível" : "Nenhum favorito neste esporte", filteredSection ? "Esta seção ainda não possui dados atualizados para suas escolhas." : "Acompanhe times ou competições deste esporte para montar o seu espaço.", false);
  }

  function renderGames() {
    var filter = byId("gamesCompetitionFilter");
    var toolbar = filter.closest(".ie-games-filter-toolbar");
    if (!activeSport()) {
      if (toolbar) toolbar.hidden = true;
      byId("gamesContent").innerHTML = emptyState("Escolha seus esportes", "Defina ao menos um esporte favorito para acompanhar confrontos.", true);
      return;
    }
    if (!activeSportIsOperational()) {
      if (toolbar) toolbar.hidden = true;
      byId("gamesContent").innerHTML = comingSoonState();
      return;
    }
    if (toolbar) toolbar.hidden = false;
    var competitions = gameCompetitionSelections();
    var competitionId = selectedGameCompetitionId();
    filter.innerHTML = "<option value=\"\">Todas as favoritas</option>" + competitions.map(function (item) {
      var identity = selectionIdentity(item);
      var name = competitionDisplayName(item.nome || item.nome_exibicao || item.competicao_nome || "Competição");
      return "<option value=\"" + escapeHtml(identity.id) + "\">" + escapeHtml(name) + "</option>";
    }).join("");
    filter.value = competitionId ? String(competitionId) : "";
    filter.disabled = !competitions.length;
    filter.setAttribute("aria-busy", state.gameCompetitionLoading ? "true" : "false");

    var rows = competitionId ? state.gameCompetitionGames[state.gameFilter] || [] : state.games[state.gameFilter] || [];
    rows = orderMatchesByFavorites(rows, state.activeSportId, state.gameFilter);
    if (competitionId && state.gameCompetitionLoading && !rows.length) {
      byId("gamesContent").innerHTML = emptyState("Carregando confrontos", "Buscando os confrontos desta competição.", false);
      return;
    }
    byId("gamesContent").innerHTML = rows.length ? rows.map(function (item) { return renderMatchCard(item); }).join("") : emptyState("Nenhum confronto", "Não há confrontos nesta seção para os times e competições acompanhados.", false);
  }

  function renderNews() {
    if (!activeSport()) {
      byId("newsContent").innerHTML = emptyState("Escolha seus esportes", "Defina ao menos um esporte favorito para acompanhar notícias.", true);
      return;
    }
    if (!activeSportIsOperational()) {
      byId("newsContent").innerHTML = comingSoonState();
      return;
    }
    byId("newsContent").innerHTML = state.news.length ? state.news.map(renderNewsCard).join("") : emptyState("Nenhuma notícia", "Ainda não encontramos notícias autorizadas relacionadas às suas seleções.", false);
  }

  function orderedSports() {
    var favorites = state.sportFavoriteOrder.slice();
    return catalogSports().slice().sort(function (a, b) {
      var aIndex = favorites.indexOf(sportId(a));
      var bIndex = favorites.indexOf(sportId(b));
      if (aIndex < 0) aIndex = Number.MAX_SAFE_INTEGER;
      if (bIndex < 0) bIndex = Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex || sportCatalogOrder(a) - sportCatalogOrder(b) || String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
    });
  }

  function renderSportsNav() {
    var sports = orderedSports().filter(function (item) { return state.sportFavoriteOrder.indexOf(sportId(item)) >= 0; });
    var nav = byId("sportsNav");
    nav.innerHTML = sports.map(function (item) {
      var id = sportId(item);
      var favorite = state.sportFavoriteOrder.indexOf(id) >= 0;
      var operational = sportIsOperational(item);
      var name = item.nome || "Esporte";
      return "<button type=\"button\" data-sport-id=\"" + id + "\" class=\"" + (id === Number(state.activeSportId) ? "is-active" : "") + (favorite ? " is-favorite" : "") + (operational ? "" : " is-coming-soon") + "\" aria-label=\"" + escapeHtml(name + (operational ? "" : " — Em breve!")) + "\" aria-pressed=\"" + (id === Number(state.activeSportId)) + "\">" + escapeHtml(name) + "</button>";
    }).join("");
    nav.hidden = !sports.length || state.activeTab === "settings";
  }

  function renderNewsFilters() {
    var controls = byId("newsTeamFilter").closest(".ie-news-filters");
    if (!activeSportIsOperational()) {
      if (controls) controls.hidden = true;
      return;
    }
    if (controls) controls.hidden = false;
    var teams = followedSelections("participant", state.activeSportId);
    var competitions = followedSelections("competition", state.activeSportId);
    if (!teams.some(function (item) { return Number(selectionIdentity(item).id) === Number(state.newsFilters.participantId); })) state.newsFilters.participantId = null;
    if (!competitions.some(function (item) { return Number(selectionIdentity(item).id) === Number(state.newsFilters.competitionId); })) state.newsFilters.competitionId = null;
    byId("newsTeamFilter").innerHTML = "<option value=\"\">Todos</option>" + teams.map(function (item) { return "<option value=\"" + escapeHtml(selectionIdentity(item).id) + "\">" + escapeHtml(item.nome || item.nome_exibicao || "Time") + "</option>"; }).join("");
    byId("newsCompetitionFilter").innerHTML = "<option value=\"\">Todas</option>" + competitions.map(function (item) { return "<option value=\"" + escapeHtml(selectionIdentity(item).id) + "\">" + escapeHtml(competitionDisplayName(item.nome || item.nome_exibicao || "Competição")) + "</option>"; }).join("");
    byId("newsTeamFilter").value = state.newsFilters.participantId ? String(state.newsFilters.participantId) : "";
    byId("newsCompetitionFilter").value = state.newsFilters.competitionId ? String(state.newsFilters.competitionId) : "";
  }

  function selectionRows(targetType) {
    var source = (targetType === "participant" ? state.catalog.participants : state.catalog.competitions).slice();
    var selected = selectionMap();
    var search = targetType === "participant" ? byId("teamSearch").value.trim() : byId("competitionSearch").value.trim();
    if (!search) {
      arrayOf(state.bootstrap && state.bootstrap.selecoes).forEach(function (item) {
        var identity = selectionIdentity(item);
        if (identity.type !== targetType) return;
        var wantedSport = byId("sportSelect").value;
        var wantedContinent = byId("continentSelect").value;
        var wantedCountry = byId("countrySelect").value;
        var itemSport = item.id_esporte || item.esporte_id || item.cod_esporte;
        var itemContinent = item.id_continente || item.continente_id || item.cod_continente;
        var itemCountry = item.id_pais || item.pais_id || item.cod_pais;
        if (wantedSport && String(itemSport || "") !== String(wantedSport)) return;
        if (wantedContinent && String(itemContinent || "") !== String(wantedContinent)) return;
        if (wantedCountry && String(itemCountry || "") !== String(wantedCountry)) return;
        source.push(item);
      });
    }
    var unique = {};
    source.forEach(function (item) {
      var id = targetType === "participant"
        ? (item.id_participante || item.id_time || item.id_alvo || item.id)
        : (item.id_competicao || item.id_alvo || item.id);
      if (id) unique[String(id)] = Object.assign({}, unique[String(id)] || {}, item);
    });
    source = Object.keys(unique).map(function (id) { return unique[id]; });
    source.sort(function (a, b) {
      function stateFor(item) {
        var id = targetType === "participant"
          ? (item.id_participante || item.id_time || item.id_alvo || item.id)
          : (item.id_competicao || item.id_alvo || item.id);
        var key = targetType + ":" + id;
        return state.selectionChanges[key] || selected[key] || item;
      }
      var aSelected = !!stateFor(a).acompanhar;
      var bSelected = !!stateFor(b).acompanhar;
      if (aSelected !== bSelected) return aSelected ? -1 : 1;
      if (targetType === "participant" && aSelected) {
        var aId = Number(a.id_participante || a.id_time || a.id_alvo || a.id);
        var bId = Number(b.id_participante || b.id_time || b.id_alvo || b.id);
        var aOrder = state.favoriteOrder.indexOf(aId);
        var bOrder = state.favoriteOrder.indexOf(bId);
        if (aOrder >= 0 || bOrder >= 0) {
          if (aOrder < 0) aOrder = Number.MAX_SAFE_INTEGER;
          if (bOrder < 0) bOrder = Number.MAX_SAFE_INTEGER;
          if (aOrder !== bOrder) return aOrder - bOrder;
        }
      }
      return displayText(a.nome || a.nome_exibicao || "").localeCompare(displayText(b.nome || b.nome_exibicao || ""), "pt-BR");
    });
    return source.map(function (item) {
      var id = item.id_participante || item.id_time || item.id_competicao || item.id;
      var key = targetType + ":" + id;
      var current = state.selectionChanges[key] || selected[key] || item;
      var follow = !!current.acompanhar;
      var notify = targetType === "participant" && !!current.notificar;
      var name = targetType === "competition" ? competitionDisplayName(item.nome || item.nome_exibicao || "") : (item.nome || item.nome_exibicao || "");
      var busy = !!state.selectionBusy[key];
      var canReorder = targetType === "participant" && follow;
      var reorderControl = canReorder
        ? "<button class=\"ie-drag-handle\" type=\"button\" data-favorite-drag-id=\"" + escapeHtml(id) + "\" aria-label=\"Arrastar para ordenar " + escapeHtml(name) + "\"><span aria-hidden=\"true\"></span></button>"
        : "<span class=\"ie-drag-placeholder\" aria-hidden=\"true\"></span>";
      return "<div class=\"ie-selection-row" + (busy ? " is-saving" : "") + "\"" + (canReorder ? " data-favorite-row-id=\"" + escapeHtml(id) + "\"" : "") + ">" + reorderControl + logoHtml(item.imagem_url || item.logo_url || item.logo, name, "ie-entity-logo") + "<strong>" + escapeHtml(name) + "</strong><div class=\"ie-selection-actions\"><button class=\"ie-selection-action" + (follow ? " is-active" : "") + "\" type=\"button\" data-selection-key=\"" + escapeHtml(key) + "\" data-selection-kind=\"follow\" aria-label=\"Acompanhar\" aria-pressed=\"" + follow + "\"" + (busy ? " disabled" : "") + ">" + icon("star") + "</button>" + (targetType === "participant" ? "<button class=\"ie-selection-action" + (notify ? " is-active" : "") + "\" type=\"button\" data-selection-key=\"" + escapeHtml(key) + "\" data-selection-kind=\"notify\" aria-label=\"Notificar\" aria-pressed=\"" + notify + "\"" + (busy ? " disabled" : "") + ">" + icon("bell") + "</button>" : "") + "</div></div>";
    }).join("");
  }

  function rememberCatalogItems(targetType, items) {
    var bucketName = targetType === "participant" ? "participants" : "competitions";
    var bucket = state.catalogKnown[bucketName];
    arrayOf(items).forEach(function (item) {
      var id = targetType === "participant"
        ? (item.id_participante || item.id_time || item.id_alvo || item.id)
        : (item.id_competicao || item.id_alvo || item.id);
      if (!id) return;
      bucket[String(id)] = Object.assign({}, bucket[String(id)] || {}, item);
    });
  }

  function filterCatalogItems(items, search) {
    var wanted = normalizeSearchText(search);
    if (!wanted) return arrayOf(items);
    return arrayOf(items).filter(function (item) {
      return normalizeSearchText([
        item.nome,
        item.nome_exibicao,
        item.nome_curto,
        item.sigla,
        item.codigo
      ].filter(Boolean).join(" ")).indexOf(wanted) >= 0;
    });
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

  function orderedFavoriteParticipants() {
    var candidates = {};
    function add(item, forcedId) {
      var id = forcedId || item.id_participante || item.id_time || item.id_alvo || item.id;
      if (!id) return;
      var key = "participant:" + id;
      candidates[String(id)] = Object.assign({}, candidates[String(id)] || {}, item, { id_participante: Number(id), selection_key: key });
    }
    arrayOf(state.favorites).forEach(function (item) { add(item); });
    arrayOf(state.bootstrap && state.bootstrap.selecoes).forEach(function (item) {
      var identity = selectionIdentity(item);
      if (identity.type === "participant") add(item, identity.id);
    });
    Object.keys(state.catalogKnown.participants).forEach(function (id) { add(state.catalogKnown.participants[id], id); });

    var selected = selectionMap();
    var items = Object.keys(candidates).map(function (id) {
      var item = candidates[id];
      var current = state.selectionChanges[item.selection_key] || selected[item.selection_key] || item;
      item.acompanhar = !!current.acompanhar;
      return item;
    }).filter(function (item) { return item.acompanhar; });

    var available = {};
    items.forEach(function (item) { available[String(item.id_participante)] = true; });
    state.favoriteOrder = state.favoriteOrder.filter(function (id) { return available[String(id)]; });
    items.sort(function (a, b) {
      var aOrder = state.favoriteOrder.indexOf(Number(a.id_participante));
      var bOrder = state.favoriteOrder.indexOf(Number(b.id_participante));
      if (aOrder < 0) aOrder = Number.MAX_SAFE_INTEGER;
      if (bOrder < 0) bOrder = Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder || numberOf(a.ordem, Number.MAX_SAFE_INTEGER) - numberOf(b.ordem, Number.MAX_SAFE_INTEGER) || String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
    });
    items.forEach(function (item) {
      var id = Number(item.id_participante);
      if (state.favoriteOrder.indexOf(id) < 0) state.favoriteOrder.push(id);
    });
    items.sort(function (a, b) { return state.favoriteOrder.indexOf(Number(a.id_participante)) - state.favoriteOrder.indexOf(Number(b.id_participante)); });
    return items;
  }

  function renderSelectionLists() {
    var merged = Object.assign({}, selectionMap(), state.selectionChanges);
    var teamCount = Object.keys(merged).filter(function (key) { return key.indexOf("participant:") === 0 && merged[key].acompanhar; }).length;
    var competitionCount = Object.keys(merged).filter(function (key) { return key.indexOf("competition:") === 0 && merged[key].acompanhar; }).length;
    byId("teamSelectionCount").textContent = teamCount + " selecionado" + (teamCount === 1 ? "" : "s");
    byId("competitionSelectionCount").textContent = competitionCount + " selecionado" + (competitionCount === 1 ? "" : "s");
    var selectedSportId = Number(byId("sportSelect") && byId("sportSelect").value || 0);
    if (selectedSportId && !sportIsOperational(sportById(selectedSportId))) {
      var message = comingSoonState(sportById(selectedSportId));
      byId("teamSelectionList").innerHTML = message;
      byId("competitionSelectionList").innerHTML = message;
      return;
    }
    byId("teamSelectionList").innerHTML = selectionRows("participant") || emptyState("Nenhum resultado", "Ajuste os filtros ou a busca.", false);
    byId("competitionSelectionList").innerHTML = selectionRows("competition") || emptyState("Nenhum resultado", "Ajuste os filtros ou a busca.", false);
  }

  function renderEntities() {
    if (!activeSport()) {
      byId("teamsContent").innerHTML = emptyState("Escolha seus esportes", "Defina ao menos um esporte favorito para acompanhar times e participantes.", true);
      byId("competitionsContent").innerHTML = emptyState("Escolha seus esportes", "Defina ao menos um esporte favorito para acompanhar competições.", true);
      return;
    }
    if (!activeSportIsOperational()) {
      byId("teamsContent").innerHTML = comingSoonState();
      byId("competitionsContent").innerHTML = comingSoonState();
      return;
    }
    var participants = followedSelections("participant", state.activeSportId);
    var competitions = state.favoriteCompetitions;
    var selected = selectionMap();
    byId("teamsContent").innerHTML = participants.length ? participants.map(function (item) {
      var name = item.nome || item.nome_exibicao || "Time ou participante";
      var abbreviation = String(item.sigla || item.abreviacao || "").trim().toUpperCase();
      var displayName = abbreviation ? abbreviation + " - " + name : name;
      var key = "participant:" + selectionIdentity(item).id;
      var current = state.selectionChanges[key] || selected[key] || item;
      var busy = !!state.selectionBusy[key];
      return "<article class=\"ie-entity-row" + (busy ? " is-saving" : "") + "\"><div class=\"ie-entity-main\"" + detailAttributes("participant", selectionIdentity(item).id, "", name) + ">" + logoHtml(item.imagem_url || item.logo_url, name, "ie-entity-logo", abbreviation) + "<div class=\"ie-entity-copy\"><strong>" + escapeHtml(displayName) + "</strong></div>" + icon("chevron") + "</div><div class=\"ie-entity-actions\"><button class=\"ie-selection-action is-active\" type=\"button\" data-entity-selection-key=\"" + escapeHtml(key) + "\" data-entity-selection-kind=\"follow\" aria-label=\"Remover " + escapeHtml(name) + " dos favoritos\" aria-pressed=\"true\"" + (busy ? " disabled" : "") + ">" + icon("star") + "</button><button class=\"ie-selection-action" + (current.notificar ? " is-active" : "") + "\" type=\"button\" data-entity-selection-key=\"" + escapeHtml(key) + "\" data-entity-selection-kind=\"notify\" aria-label=\"" + (current.notificar ? "Desativar" : "Ativar") + " notificações de " + escapeHtml(name) + "\" aria-pressed=\"" + (!!current.notificar) + "\"" + (busy ? " disabled" : "") + ">" + icon("bell") + "</button></div></article>";
    }).join("") : emptyState("Nenhum time acompanhado", "Use as configurações para escolher times ou participantes deste esporte.", true);
    byId("competitionsContent").innerHTML = competitions.length ? competitions.map(function (item) {
      var name = competitionDisplayName(item.nome || item.competicao_nome || "Competição");
      var id = item.id_competicao || item.id;
      var key = "competition:" + id;
      var busy = !!state.selectionBusy[key];
      return "<article class=\"ie-entity-row" + (busy ? " is-saving" : "") + "\"><div class=\"ie-entity-main\"" + detailAttributes("competition", id, "", name) + ">" + logoHtml(item.imagem_url || item.logo_url, name, "ie-entity-logo", item.sigla) + "<div class=\"ie-entity-copy\"><strong>" + escapeHtml(name) + "</strong><span>" + escapeHtml(item.fase_atual || item.temporada || "") + "</span></div>" + icon("chevron") + "</div><div class=\"ie-entity-actions\"><button class=\"ie-selection-action is-active\" type=\"button\" data-entity-selection-key=\"" + escapeHtml(key) + "\" data-entity-selection-kind=\"follow\" aria-label=\"Remover " + escapeHtml(name) + " dos favoritos\" aria-pressed=\"true\"" + (busy ? " disabled" : "") + ">" + icon("star") + "</button></div></article>";
    }).join("") : emptyState("Nenhuma competição acompanhada", "Use as configurações para escolher suas competições deste esporte.", true);
  }

  function favoriteSport() {
    return sportById(state.sportFavoriteOrder[0]);
  }

  function renderSportFavoriteSettings() {
    var favorites = state.sportFavoriteOrder.slice();
    var rows = orderedSports();
    byId("sportFavoriteList").innerHTML = rows.length ? rows.map(function (item) {
      var id = sportId(item);
      var index = favorites.indexOf(id);
      var selected = index >= 0;
      var name = item.nome || "Esporte";
      var operational = sportIsOperational(item);
      var reorderControl = selected
        ? "<button class=\"ie-drag-handle\" type=\"button\" data-sport-favorite-drag-id=\"" + id + "\" aria-label=\"Arrastar para ordenar " + escapeHtml(name) + "\"><span aria-hidden=\"true\"></span></button>"
        : "<span class=\"ie-drag-placeholder\" aria-hidden=\"true\"></span>";
      return "<div class=\"ie-sport-favorite-row" + (selected ? " is-selected" : "") + (operational ? "" : " is-coming-soon") + "\"" + (selected ? " data-sport-favorite-row-id=\"" + id + "\"" : "") + ">" + reorderControl + "<span class=\"ie-sport-favorite-copy\"><strong>" + escapeHtml(name) + "</strong>" + (operational ? "" : "<small>Em breve!</small>") + "</span><div class=\"ie-sport-favorite-actions\"><button class=\"ie-selection-action" + (selected ? " is-active" : "") + "\" type=\"button\" data-sport-favorite-id=\"" + id + "\" data-sport-favorite-action=\"toggle\" aria-label=\"" + (selected ? "Remover " : "Favoritar ") + escapeHtml(item.nome || "esporte") + "\" aria-pressed=\"" + selected + "\">" + icon("star") + "</button></div></div>";
    }).join("") : emptyState("Nenhum esporte disponível", "O catálogo esportivo ainda não foi disponibilizado.", false);
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
    renderSportFavoriteSettings();
    var selectedContinent = arrayOf(filters.ids_continentes)[0];
    fillSelect(byId("continentSelect"), catalog.continentes, "Todos", selectedContinent);
    fillCountrySelect(selectedContinent, arrayOf(filters.ids_paises)[0]);
    fillSelect(byId("sportSelect"), catalog.esportes, "Todos", arrayOf(filters.ids_esportes)[0]);
    byId("notificationsEnabled").checked = alerts.ativo === true || prefs.notificacoes_ativas === true;
    var chosen = arrayOf(alerts.antecedencias_minutos);
    var availableTimes = arrayOf(catalog.antecedencias_alerta).map(function (item) {
      var minutes = Number(item.minutos || item.antecedencia_minutos || item.valor);
      return { minutes: minutes, label: item.nome || item.label || (minutes + " min") };
    }).filter(function (item) { return Number.isInteger(item.minutes) && item.minutes > 0; });
    if (!availableTimes.length) availableTimes = ALERT_TIMES.map(function (minutes) { return { minutes: minutes, label: minutes + " min" }; });
    byId("alertTimes").innerHTML = availableTimes.map(function (item) { return "<label class=\"ie-time-option\"><input type=\"checkbox\" name=\"alertTime\" value=\"" + item.minutes + "\"" + (chosen.indexOf(item.minutes) >= 0 ? " checked" : "") + "><span>" + escapeHtml(item.label) + "</span></label>"; }).join("");
    var chosenEvents = arrayOf(alerts.tipos_evento);
    var availableEvents = arrayOf(catalog.tipos_alerta).map(function (item) { return { code: item.codigo || item.codigo_tipo_alerta || item.code, label: item.nome || item.nome_tipo_alerta || item.label }; }).filter(function (item) { return item.code; });
    if (!availableEvents.length) availableEvents = ALERT_EVENTS;
    byId("alertEvents").innerHTML = availableEvents.map(function (eventType) { return "<label class=\"ie-event-option\"><input type=\"checkbox\" name=\"alertEvent\" value=\"" + escapeHtml(eventType.code) + "\"" + (chosenEvents.indexOf(eventType.code) >= 0 ? " checked" : "") + "><span>" + escapeHtml(eventType.label) + "</span></label>"; }).join("");
    renderSelectionLists();
  }

  function renderAll() {
    renderSportsNav();
    renderHome();
    renderGames();
    renderNewsFilters();
    renderNews();
    renderEntities();
    renderSettings();
    var generated = state.card && (state.card.generated_at || state.card.gerado_em) || new Date().toISOString();
    setFreshness(generated);
  }

  async function loadCatalog(generation) {
    var requestId = ++state.catalogRequestId;
    var sport = byId("sportSelect") ? byId("sportSelect").value : "";
    var continent = byId("continentSelect") ? byId("continentSelect").value : "";
    var country = byId("countrySelect") ? byId("countrySelect").value : "";
    var teamSearch = byId("teamSearch") ? byId("teamSearch").value.trim() : "";
    var competitionSearch = byId("competitionSearch") ? byId("competitionSearch").value.trim() : "";
    if (sport && !sportIsOperational(sportById(Number(sport)))) {
      state.catalog.participants = [];
      state.catalog.competitions = [];
      if (requestId === state.catalogRequestId && loadIsCurrent(generation)) renderSelectionLists();
      return;
    }
    var results = await Promise.all([
      rpc("ie_catalogo_buscar_rpc", { p_tipo: "participante", p_busca: teamSearch || null, p_id_esporte: sport ? Number(sport) : null, p_id_continente: continent ? Number(continent) : null, p_id_pais: country ? Number(country) : null, p_limite: 100, p_offset: 0 }),
      rpc("ie_catalogo_buscar_rpc", { p_tipo: "competicao", p_busca: competitionSearch || null, p_id_esporte: sport ? Number(sport) : null, p_id_continente: continent ? Number(continent) : null, p_id_pais: country ? Number(country) : null, p_limite: 100, p_offset: 0 })
    ]);
    if (requestId !== state.catalogRequestId || !loadIsCurrent(generation)) return;
    state.catalog.participants = filterCatalogItems(results[0], teamSearch);
    state.catalog.competitions = filterCatalogItems(results[1], competitionSearch);
    rememberCatalogItems("participant", state.catalog.participants);
    rememberCatalogItems("competition", state.catalog.competitions);
    renderSelectionLists();
  }

  function setPullRefreshState(progress, refreshing) {
    var indicator = byId("pullRefreshIndicator");
    if (!indicator) return;
    var value = Math.max(0, Math.min(1, Number(progress) || 0));
    indicator.style.setProperty("--ie-pull-progress", String(value));
    indicator.style.setProperty("--ie-pull-rotation", Math.round(value * 240) + "deg");
    indicator.classList.toggle("is-visible", value > 0 || !!refreshing);
    indicator.classList.toggle("is-refreshing", !!refreshing);
  }

  async function loadNewsForActiveSport(renderAfter) {
    var requestId = ++state.newsRequestId;
    if (!activeSportIsOperational()) {
      state.news = [];
      if (renderAfter !== false) { renderNewsFilters(); renderNews(); }
      return;
    }
    var result = await rpc("ie_noticias_listar_rpc", {
      p_id_esporte: state.activeSportId ? Number(state.activeSportId) : null,
      p_id_participante: state.newsFilters.participantId ? Number(state.newsFilters.participantId) : null,
      p_id_competicao: state.newsFilters.competitionId ? Number(state.newsFilters.competitionId) : null,
      p_limite: 30,
      p_offset: 0
    });
    if (requestId !== state.newsRequestId) return;
    state.news = arrayOf(result);
    if (renderAfter !== false) renderNews();
  }

  var ALL_SPORT_DATA_SECTIONS = ["forYou", "live", "upcoming", "results", "competitions", "news"];

  function uniqueSportSections(sectionNames) {
    return arrayOf(sectionNames).filter(function (name, index, values) {
      return ALL_SPORT_DATA_SECTIONS.indexOf(name) >= 0 && values.indexOf(name) === index;
    });
  }

  function sportSectionRequest(name, sport, competitionId) {
    if (name === "forYou") return rpc("ie_partidas_listar_rpc", { p_secao: "para_voce", p_id_esporte: sport, p_fase: null, p_limite: 30, p_offset: 0 });
    if (name === "live") return rpc("ie_partidas_listar_rpc", { p_secao: "ao_vivo", p_id_esporte: sport, p_id_competicao: competitionId ? Number(competitionId) : null, p_fase: null, p_limite: 30, p_offset: 0 });
    if (name === "upcoming") return rpc("ie_partidas_listar_rpc", { p_secao: "proximos", p_id_esporte: sport, p_id_competicao: competitionId ? Number(competitionId) : null, p_fase: null, p_limite: 30, p_offset: 0 });
    if (name === "results") return rpc("ie_partidas_listar_rpc", { p_secao: "resultados", p_id_esporte: sport, p_id_competicao: competitionId ? Number(competitionId) : null, p_fase: null, p_limite: 30, p_offset: 0 });
    if (name === "competitions") return rpc("ie_competicoes_favoritas_listar_rpc", { p_id_esporte: sport, p_limite: 30, p_offset: 0 });
    return rpc("ie_noticias_listar_rpc", { p_id_esporte: sport, p_id_participante: state.newsFilters.participantId ? Number(state.newsFilters.participantId) : null, p_id_competicao: state.newsFilters.competitionId ? Number(state.newsFilters.competitionId) : null, p_limite: 30, p_offset: 0 });
  }

  function applySportSection(name, value) {
    if (name === "forYou") state.games.forYou = arrayOf(value);
    else if (name === "live") state.games.live = arrayOf(value);
    else if (name === "upcoming") state.games.upcoming = arrayOf(value);
    else if (name === "results") state.games.results = arrayOf(value);
    else if (name === "competitions") state.favoriteCompetitions = arrayOf(value);
    else if (name === "news") state.news = arrayOf(value);
  }

  function clearSportSections(sectionNames) {
    uniqueSportSections(sectionNames).forEach(function (name) { applySportSection(name, []); });
  }

  function renderSportSections(sectionNames) {
    var sections = uniqueSportSections(sectionNames);
    if (sections.indexOf("forYou") >= 0 || sections.indexOf("competitions") >= 0) renderHome();
    if (sections.some(function (name) { return name === "live" || name === "upcoming" || name === "results"; })) renderGames();
    if (sections.indexOf("news") >= 0) { renderNewsFilters(); renderNews(); }
    if (sections.indexOf("competitions") >= 0) renderEntities();
  }

  function loadIsCurrent(generation) {
    return generation == null || generation === state.loadGeneration;
  }

  async function loadActiveSportSections(sectionNames, renderAfter, generation, strict) {
    var requestId = ++state.sportRequestId;
    var sport = state.activeSportId ? Number(state.activeSportId) : null;
    var sections = uniqueSportSections(sectionNames);
    var newsRequestId = sections.indexOf("news") >= 0 ? ++state.newsRequestId : null;
    if (!sport || !sportIsOperational(sportById(sport))) {
      clearSportSections(sections);
      if (renderAfter === "partial") renderSportSections(sections);
      else if (renderAfter !== false) renderAll();
      return { errors: [] };
    }
    var results = await Promise.all(sections.map(function (name) {
      return sportSectionRequest(name, sport).then(function (value) {
        return { name: name, ok: true, value: value };
      }, function (error) {
        return { name: name, ok: false, error: error };
      });
    }));
    if (!loadIsCurrent(generation) || requestId !== state.sportRequestId || sport !== Number(state.activeSportId)) return { stale: true, errors: [] };
    var errors = results.filter(function (result) { return !result.ok; }).map(function (result) { return result.error; });
    if (strict && errors.length) throw errors[0];
    results.forEach(function (result) {
      if (!result.ok) return;
      if (result.name === "news" && newsRequestId !== state.newsRequestId) return;
      applySportSection(result.name, result.value);
    });
    if (renderAfter === "partial") renderSportSections(sections);
    else if (renderAfter !== false) renderAll();
    return { errors: errors };
  }

  async function loadGameCompetitionData(renderAfter, generation, strict) {
    var requestId = ++state.gameCompetitionRequestId;
    var sport = state.activeSportId ? Number(state.activeSportId) : null;
    var competitionId = selectedGameCompetitionId();
    var sections = ["live", "upcoming", "results"];
    if (!sport || !activeSportIsOperational() || !competitionId) {
      state.gameCompetitionGames = { live: [], upcoming: [], results: [] };
      state.gameCompetitionLoading = false;
      if (renderAfter !== false) renderGames();
      return { errors: [] };
    }

    state.gameCompetitionLoading = true;
    if (renderAfter !== false) renderGames();
    var results = await Promise.all(sections.map(function (name) {
      return sportSectionRequest(name, sport, competitionId).then(function (value) {
        return { name: name, ok: true, value: value };
      }, function (error) {
        return { name: name, ok: false, error: error };
      });
    }));
    if (!loadIsCurrent(generation) || requestId !== state.gameCompetitionRequestId || sport !== Number(state.activeSportId) || competitionId !== Number(selectedGameCompetitionId())) {
      if (requestId === state.gameCompetitionRequestId) {
        state.gameCompetitionLoading = false;
        if (renderAfter !== false) renderGames();
      }
      return { stale: true, errors: [] };
    }

    var errors = results.filter(function (result) { return !result.ok; }).map(function (result) { return result.error; });
    results.forEach(function (result) {
      if (result.ok) state.gameCompetitionGames[result.name] = arrayOf(result.value);
    });
    state.gameCompetitionLoading = false;
    if (renderAfter !== false) renderGames();
    if (strict && errors.length) throw errors[0];
    return { errors: errors };
  }

  async function loadActiveSportData(renderAfter) {
    var result = await loadActiveSportSections(ALL_SPORT_DATA_SECTIONS, false, null, true);
    if (selectedGameCompetitionId()) await loadGameCompetitionData(false, null, true);
    if (renderAfter !== false) renderAll();
    return result;
  }

  async function changeActiveSport(id) {
    var next = Number(id || 0);
    if (!next || next === Number(state.activeSportId)) return;
    state.sportRequestId += 1;
    state.activeSportId = next;
    state.newsFilters = { participantId: null, competitionId: null };
    state.newsRequestId += 1;
    resetGameCompetitionFilter();
    clearSportSections(["live", "upcoming", "results"]);
    state.homeSectionFilter = "";
    renderSportsNav();
    if (!activeSportIsOperational()) {
      clearSportSections(ALL_SPORT_DATA_SECTIONS);
      renderAll();
      saveCache();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    renderGames();
    try {
      await loadActiveSportData(true);
      saveCache();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      renderGames();
      showToast(friendlyError(error), true);
    }
  }

  function rememberCurrentSelections() {
    arrayOf(state.bootstrap && state.bootstrap.selecoes).forEach(function (item) {
      var identity = selectionIdentity(item);
      if (identity.type) rememberCatalogItems(identity.type, [item]);
    });
  }

  async function loadCardSummary(generation) {
    var preferenceRevision = state.preferenceRevision;
    var result = await rpc("ie_card_resumo_rpc", { p_limite: 3 });
    if (!loadIsCurrent(generation) || preferenceRevision !== state.preferenceRevision) return false;
    state.card = result || {};
    return true;
  }

  async function loadFavoritesSummary(generation) {
    var preferenceRevision = state.preferenceRevision;
    var result = await rpc("ie_favoritos_listar_rpc", {});
    if (!loadIsCurrent(generation) || preferenceRevision !== state.preferenceRevision) return false;
    state.favorites = arrayOf(result);
    rememberCatalogItems("participant", state.favorites);
    state.favoriteOrder = state.favorites.map(function (item) { return Number(item.id_participante); }).filter(function (id) { return id > 0; });
    return true;
  }

  async function loadBaseSummary(generation) {
    var result = await rpc("ie_base_futebol_brasil_resumo_rpc", {});
    if (!loadIsCurrent(generation)) return false;
    state.baseSummary = result || null;
    return true;
  }

  function hydrateCachedOpening(cached) {
    if (!cached) return;
    state.card = cached.card || null;
    state.baseSummary = cached.baseSummary || null;
    state.favorites = arrayOf(cached.favorites);
    rememberCatalogItems("participant", state.favorites);
    state.favoriteOrder = state.favorites.map(function (item) { return Number(item.id_participante); }).filter(function (id) { return id > 0; });
    if (Number(cached.activeSportId || 0) === Number(state.activeSportId || 0)) {
      state.games = cached.games || state.games;
      state.favoriteCompetitions = cached.favoriteCompetitions || [];
      state.news = cached.news || [];
    }
  }

  function restoreCachedState(cached) {
    state.bootstrap = cached.bootstrap;
    state.card = cached.card;
    state.baseSummary = cached.baseSummary || null;
    state.games = cached.games || state.games;
    state.favoriteCompetitions = cached.favoriteCompetitions || [];
    state.news = cached.news || [];
    state.favorites = cached.favorites || [];
    state.sportFavoriteOrder = arrayOf(cached.sportFavoriteOrder).map(Number).filter(function (id) { return id > 0; });
    state.activeSportId = Number(cached.activeSportId || state.sportFavoriteOrder[0] || 0) || null;
    ensureActiveSport();
    rememberCurrentSelections();
    rememberCatalogItems("participant", state.favorites);
    state.favoriteOrder = state.favorites.map(function (item) { return Number(item.id_participante); }).filter(function (id) { return id > 0; });
  }

  function initialLoadRequirements(route) {
    var requirements = { card: false, favorites: false, base: false, catalog: false, sportSections: [] };
    if (route.eventId > 0 || route.competitionId > 0) return requirements;
    if (route.section === "configuracoes") { requirements.favorites = true; requirements.catalog = true; }
    else if (route.section === "partidas" || route.section === "jogos") {
      requirements.sportSections = ["live", "upcoming", "results"];
      requirements.favorites = route.context === "favoritos_primeiro";
    }
    else if (route.section === "campeonatos") requirements.sportSections = ["competitions"];
    else if (route.section === "noticias") requirements.sportSections = ["news"];
    else if (route.section === "cotacoes") requirements.card = true;
    else if (route.section === "analises") { requirements.card = true; requirements.base = true; }
    else if (route.section !== "times") requirements.sportSections = ["forYou", "competitions"];
    return requirements;
  }

  function checkedSettingValues(name) {
    return all("input[name=" + name + "]:checked").map(function (input) { return String(input.value); });
  }

  function captureSettingsDraft() {
    if (state.activeTab !== "settings") return null;
    var changes = {};
    Object.keys(state.selectionChanges).forEach(function (key) { changes[key] = Object.assign({}, state.selectionChanges[key]); });
    return {
      selectionChanges: changes,
      sportFavoriteOrder: state.sportFavoriteOrder.slice(),
      favoriteOrder: state.favoriteOrder.slice(),
      sport: byId("sportSelect").value,
      continent: byId("continentSelect").value,
      country: byId("countrySelect").value,
      teamSearch: byId("teamSearch").value,
      competitionSearch: byId("competitionSearch").value,
      notificationsEnabled: byId("notificationsEnabled").checked,
      alertTimes: checkedSettingValues("alertTime"),
      alertEvents: checkedSettingValues("alertEvent")
    };
  }

  function restoreSettingsDraft(draft) {
    if (!draft) return;
    state.selectionChanges = draft.selectionChanges;
    state.sportFavoriteOrder = draft.sportFavoriteOrder.slice();
    state.favoriteOrder = draft.favoriteOrder.slice();
    renderSportFavoriteSettings();
    byId("continentSelect").value = draft.continent;
    fillCountrySelect(draft.continent, draft.country);
    byId("sportSelect").value = draft.sport;
    byId("teamSearch").value = draft.teamSearch;
    byId("competitionSearch").value = draft.competitionSearch;
    byId("notificationsEnabled").checked = draft.notificationsEnabled;
    all("input[name=alertTime]").forEach(function (input) { input.checked = draft.alertTimes.indexOf(String(input.value)) >= 0; });
    all("input[name=alertEvent]").forEach(function (input) { input.checked = draft.alertEvents.indexOf(String(input.value)) >= 0; });
    renderSelectionLists();
  }

  async function loadInitialOpening(generation, route) {
    await requestSession();
    var cached = loadCache();
    var bootstrap = await rpc("ie_central_bootstrap_rpc", {});
    if (!loadIsCurrent(generation)) return;
    state.bootstrap = bootstrap || {};
    state.sportFavoriteOrder = normalizeSportFavoriteOrder(state.bootstrap.preferencias || {});
    state.activeSportId = null;
    ensureActiveSport();
    hydrateCachedOpening(cached);
    rememberCurrentSelections();
    renderAll();

    var required = initialLoadRequirements(route);
    var critical = [];
    var openingErrors = [];
    if (required.card) critical.push(loadCardSummary(generation));
    if (required.favorites) critical.push(loadFavoritesSummary(generation));
    if (required.base) critical.push(loadBaseSummary(generation).catch(function (error) {
      if (loadIsCurrent(generation)) state.baseSummary = null;
      openingErrors.push(error);
    }));
    if (required.sportSections.length) critical.push(loadActiveSportSections(required.sportSections, false, generation, true));
    if (required.catalog) critical.push(loadCatalog(generation));
    await Promise.all(critical);
    if (!loadIsCurrent(generation)) return;

    renderAll();
    await applyInitialRoute(route);
    if (!loadIsCurrent(generation)) return;
    showApp(true);
    state.loading = false;
    byId("headerFreshness").textContent = "Atualizando...";
    notifyInitialOpeningReady();

    var backgroundErrors = openingErrors.slice();
    var backgroundStale = false;
    var backgroundIncomplete = false;
    function background(task) {
      return task.then(function (result) {
        if (result === false) backgroundIncomplete = true;
        return result;
      }, function (error) { backgroundErrors.push(error); });
    }
    var pending = [];
    if (!required.card) pending.push(background(loadCardSummary(generation)));
    if (!required.base) pending.push(background(loadBaseSummary(generation)));
    if (!required.favorites && !required.catalog) {
      pending.push(background(loadFavoritesSummary(generation)).then(function (result) {
        if (result !== true || !loadIsCurrent(generation)) return result;
        return background(loadCatalog(generation));
      }));
    } else {
      if (!required.favorites) pending.push(background(loadFavoritesSummary(generation)));
      if (!required.catalog) pending.push(background(loadCatalog(generation)));
    }
    var remainingSections = ALL_SPORT_DATA_SECTIONS.filter(function (name) { return required.sportSections.indexOf(name) < 0; });
    if (remainingSections.length) {
      pending.push(loadActiveSportSections(remainingSections, false, generation, false).then(function (result) {
        if (result && result.stale) backgroundStale = true;
        backgroundErrors = backgroundErrors.concat(result && result.errors || []);
      }, function (error) { backgroundErrors.push(error); }));
    }
    await Promise.all(pending);
    if (!loadIsCurrent(generation) || backgroundStale) return;
    renderHome();
    renderGames();
    renderNewsFilters();
    renderNews();
    renderEntities();
    if (backgroundErrors.length || backgroundIncomplete) byId("headerFreshness").textContent = "Atualização parcial";
    else {
      setFreshness(new Date().toISOString());
      saveCache();
    }
  }

  async function loadFullRefresh(generation) {
    await requestSession();
    var bootstrap = await rpc("ie_central_bootstrap_rpc", {});
    if (!loadIsCurrent(generation)) return;
    state.bootstrap = bootstrap || {};
    state.sportFavoriteOrder = normalizeSportFavoriteOrder(state.bootstrap.preferencias || {});
    ensureActiveSport();
    var results = await Promise.all([
      rpc("ie_card_resumo_rpc", { p_limite: 3 }),
      rpc("ie_favoritos_listar_rpc", {}),
      rpc("ie_base_futebol_brasil_resumo_rpc", {}).catch(function () { return null; })
    ]);
    if (!loadIsCurrent(generation)) return;
    state.card = results[0] || {};
    state.favorites = arrayOf(results[1]);
    state.baseSummary = results[2] || null;
    rememberCurrentSelections();
    rememberCatalogItems("participant", state.favorites);
    state.favoriteOrder = state.favorites.map(function (item) { return Number(item.id_participante); }).filter(function (id) { return id > 0; });
    await loadActiveSportSections(ALL_SPORT_DATA_SECTIONS, false, generation, true);
    if (selectedGameCompetitionId()) await loadGameCompetitionData(false, generation, true);
    if (!loadIsCurrent(generation)) return;
    showApp(true);
    renderAll();
    await loadCatalog(generation);
    if (!loadIsCurrent(generation)) return;
    saveCache();
  }

  async function loadAll(manual) {
    if (state.loading) return;
    var settingsDraft = manual ? captureSettingsDraft() : null;
    var initialOpening = !manual && !state.bootstrap && byId("ieApp").hidden;
    var route = initialOpening ? initialRouteDefinition() : null;
    var generation = ++state.loadGeneration;
    state.loading = true;
    if (manual) {
      byId("headerFreshness").textContent = "Atualizando...";
      setPullRefreshState(1, true);
    }
    try {
      if (initialOpening) await loadInitialOpening(generation, route);
      else {
        await loadFullRefresh(generation);
        if (settingsDraft && loadIsCurrent(generation)) {
          restoreSettingsDraft(settingsDraft);
          await loadCatalog(generation);
        }
      }
      if (!loadIsCurrent(generation)) return;
      if (manual) showToast("Informações atualizadas.", false);
    } catch (error) {
      if (!loadIsCurrent(generation)) return;
      var cached = state.session ? loadCache() : null;
      if (cached && cached.bootstrap) {
        restoreCachedState(cached);
        renderAll();
        if (settingsDraft) restoreSettingsDraft(settingsDraft);
        if (initialOpening) await applyInitialRoute(route);
        if (!loadIsCurrent(generation)) return;
        showApp(true);
        setFreshness(cached.saved_at);
        showToast("Sem conexão. Exibindo a última atualização disponível.", true);
        notifyInitialOpeningReady();
      } else {
        if (initialOpening) state.bootstrap = null;
        byId("loadingStatus").textContent = displayText(friendlyError(error));
        showApp(false);
        if (initialOpening) notifyInitialOpeningReady();
      }
    } finally {
      if (loadIsCurrent(generation)) state.loading = false;
      if (manual && loadIsCurrent(generation)) window.setTimeout(function () { setPullRefreshState(0, false); }, 220);
    }
  }

  function activateTab(tab) {
    if (tab !== "settings") state.previousTab = tab;
    state.activeTab = tab;
    all("[data-tab]").forEach(function (button) { button.classList.toggle("is-active", button.getAttribute("data-tab") === tab); });
    byId("settingsButton").classList.toggle("is-active", tab === "settings");
    byId("settingsButton").setAttribute("aria-pressed", tab === "settings" ? "true" : "false");
    byId("backButton").classList.toggle("is-hidden-home", tab === "home");
    all("[data-panel]").forEach(function (panel) {
      var active = panel.getAttribute("data-panel") === tab;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    renderSportsNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function settingsContextDefinition(context) {
    var definitions = {
      partidas: { label: "Partidas", target: "settingsParticipants" },
      campeonatos: { label: "Competição", target: "settingsCompetitions" },
      noticias: { label: "Notícias", target: "settingsParticipants" },
      cotacoes: { label: "Cotações", target: "settingsParticipants" },
      analises: { label: "Análises", target: "settingsFavoriteSport" }
    };
    return definitions[String(context || "").toLowerCase()] || null;
  }

  function applySettingsContext(context, scrollToTarget) {
    var definition = settingsContextDefinition(context);
    state.settingsContext = definition ? String(context).toLowerCase() : "";
    byId("settingsTitle").textContent = definition ? "Configurações · " + definition.label : "Configurações";
    all("[data-settings-section]").forEach(function (section) { section.classList.remove("is-context-target"); });
    if (!definition) return;
    var target = byId(definition.target);
    if (!target) return;
    target.classList.add("is-context-target");
    if (scrollToTarget) window.setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }

  function openSettings(context, scrollToTarget) {
    activateTab("settings");
    applySettingsContext(context, scrollToTarget !== false);
  }

  function chooseAvailableGameFilter() {
    var source = selectedGameCompetitionId() ? state.gameCompetitionGames : state.games;
    var filter = source.live.length ? "live" : source.upcoming.length ? "upcoming" : source.results.length ? "results" : "live";
    state.gameFilter = filter;
    all("[data-game-filter]").forEach(function (button) { button.classList.toggle("is-active", button.getAttribute("data-game-filter") === filter); });
    renderGames();
  }

  function initialRouteDefinition() {
    var params = new URLSearchParams(location.search);
    return {
      section: String(params.get("secao") || "").toLowerCase(),
      context: String(params.get("contexto") || "").toLowerCase(),
      eventId: Number(params.get("id_evento") || 0),
      competitionId: Number(params.get("id_competicao") || 0)
    };
  }

  async function applyInitialRoute(route) {
    var requested = route || initialRouteDefinition();
    if (requested.section === "configuracoes") openSettings(requested.context, true);
    else if (requested.section === "partidas" || requested.section === "jogos") {
      activateTab("games");
      chooseAvailableGameFilter();
    }
    else if (requested.section === "campeonatos") activateTab("competitions");
    else if (requested.section === "times") activateTab("teams");
    else if (requested.section === "noticias") activateTab("news");
    else if (requested.section === "cotacoes" || requested.section === "analises") {
      state.homeSectionFilter = requested.section;
      activateTab("home");
      renderHome();
    }
    if (requested.eventId > 0 && requested.section === "analises") await openAnalysisDetail(requested.eventId, "Análises estatísticas");
    else if (requested.eventId > 0 && requested.section === "cotacoes") await openOddsDetail(requested.eventId, "Cotações informativas");
    else if (requested.eventId > 0) await openEventDetail(requested.eventId, "Detalhes da partida");
    else if (requested.competitionId > 0) await openCompetitionDetail(requested.competitionId, "Detalhes da competição");
  }

  function closeDetail() {
    byId("detailModal").hidden = true;
    document.body.style.overflow = "";
    state.detailStack = [];
    byId("detailBackButton").hidden = true;
    byId("detailContent").removeAttribute("data-detail-view");
    if (state.homeSectionFilter) {
      state.homeSectionFilter = "";
      renderHome();
    }
  }

  function beginDetail(title, subtitle, pushCurrent) {
    var detailContent = byId("detailContent");
    if (pushCurrent === true && !byId("detailModal").hidden) {
      state.detailStack.push({
        title: byId("detailTitle").textContent,
        subtitle: byId("detailSubtitle").textContent,
        html: detailContent.innerHTML,
        view: detailContent.getAttribute("data-detail-view") || "",
        scrollTop: detailContent.scrollTop
      });
    } else if (pushCurrent !== "replace") {
      state.detailStack = [];
    }
    byId("detailBackButton").hidden = state.detailStack.length === 0;
    byId("detailTitle").textContent = displayText(title || "Detalhes");
    byId("detailSubtitle").textContent = displayText(subtitle || "");
    detailContent.removeAttribute("data-detail-view");
    detailContent.innerHTML = "<div class=\"ie-empty\"><span class=\"ie-spinner\"></span></div>";
    detailContent.scrollTop = 0;
    byId("detailModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function backDetail() {
    var previous = state.detailStack.pop();
    if (!previous) { closeDetail(); return; }
    var detailContent = byId("detailContent");
    byId("detailTitle").textContent = previous.title;
    byId("detailSubtitle").textContent = previous.subtitle;
    detailContent.innerHTML = previous.html;
    if (previous.view) detailContent.setAttribute("data-detail-view", previous.view);
    else detailContent.removeAttribute("data-detail-view");
    byId("detailBackButton").hidden = state.detailStack.length === 0;
    if (previous.view === "history-list") renderHistoryContributionPage();
    detailContent.scrollTop = Number(previous.scrollTop) || 0;
  }

  function historyDetailView() {
    return byId("detailContent").getAttribute("data-detail-view") || "";
  }

  window.TurboTigerIEHandleBack = function () {
    if (!byId("detailModal").hidden) {
      if (state.detailStack.length) backDetail(); else closeDetail();
      return true;
    }
    if (state.activeTab === "settings") {
      applySettingsContext("", false);
      activateTab(state.previousTab || "home");
      return true;
    }
    if (state.homeSectionFilter) {
      state.homeSectionFilter = "";
      renderHome();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    }
    if (state.activeTab !== "home") {
      activateTab("home");
      return true;
    }
    if (!postNative("close", {})) history.back();
    return true;
  };

  function detailSection(title, body) {
    if (!body) return "";
    return "<section class=\"ie-detail-section\"><h3>" + escapeHtml(title) + "</h3>" + body + "</section>";
  }

  function renderOddsDetail(items, sides, notice) {
    var groups = {};
    arrayOf(items).forEach(function (row) {
      var operator = String(row.operador || row.fonte || "Fonte não informada");
      var market = String(row.mercado || "Resultado 1X2");
      var key = operator + "|" + market;
      if (!groups[key]) groups[key] = { operator: operator, market: market, source: row.fonte || "", updatedAt: row.observado_em || "", values: {} };
      var selection = String(row.selecao || "").toLowerCase();
      if (selection.indexOf("casa") >= 0 || selection === "1") groups[key].values.home = row.valor;
      else if (selection.indexOf("empate") >= 0 || selection === "x") groups[key].values.draw = row.valor;
      else if (selection.indexOf("fora") >= 0 || selection === "2") groups[key].values.away = row.valor;
    });
    var entries = Object.keys(groups).map(function (key) { return groups[key]; }).filter(function (group) {
      return group.values.home != null || group.values.draw != null || group.values.away != null;
    });
    if (!entries.length) return "";
    function odd(value) {
      if (value == null || value === "") return "—";
      var parsed = Number(value);
      return Number.isFinite(parsed) ? parsed.toFixed(2).replace(".", ",") : String(value);
    }
    var home = sides && sides.home && sides.home.name || "time da casa";
    var away = sides && sides.away && sides.away.name || "time visitante";
    var explanation = "<div class=\"ie-odds-help\"><strong>Como interpretar</strong><span><b>Casa</b> vitória de " + escapeHtml(home) + "</span><span><b>Empate</b> nenhum time vence</span><span><b>Fora</b> vitória de " + escapeHtml(away) + "</span></div>";
    var complete = entries.filter(function (group) { return Number.isFinite(Number(group.values.home)) && Number.isFinite(Number(group.values.draw)) && Number.isFinite(Number(group.values.away)); });
    var average = complete.reduce(function (result, group) {
      result.home += Number(group.values.home); result.draw += Number(group.values.draw); result.away += Number(group.values.away); return result;
    }, { home: 0, draw: 0, away: 0 });
    if (complete.length) { average.home /= complete.length; average.draw /= complete.length; average.away /= complete.length; }
    var averageHtml = complete.length ? "<article class=\"ie-odds-provider ie-odds-average\"><header><div><strong>Média do mercado</strong><span>Resumo de " + escapeHtml(complete.length) + (complete.length === 1 ? " casa" : " casas") + "</span></div></header><div class=\"ie-odds-grid\"><div><span class=\"ie-odds-label\">Casa</span><small>Vitória de</small><b>" + escapeHtml(home) + "</b><strong>" + escapeHtml(odd(average.home)) + "</strong></div><div><span class=\"ie-odds-label\">Empate</span><small>Nenhum time vence</small><b>Empate</b><strong>" + escapeHtml(odd(average.draw)) + "</strong></div><div><span class=\"ie-odds-label\">Fora</span><small>Vitória de</small><b>" + escapeHtml(away) + "</b><strong>" + escapeHtml(odd(average.away)) + "</strong></div></div></article>" : "";
    var cards = entries.map(function (group) {
      var marketLabel = /1x2|resultado/i.test(group.market) ? "Resultado da partida" : group.market;
      return "<article class=\"ie-odds-provider\"><header><div><strong>" + escapeHtml(group.operator) + "</strong><span>" + escapeHtml(marketLabel) + "</span></div>" + (group.source && group.source !== group.operator ? "<small>Dados: " + escapeHtml(group.source) + "</small>" : "") + "</header><div class=\"ie-odds-grid\"><div><span class=\"ie-odds-label\">Casa</span><small>Vitória de</small><b>" + escapeHtml(home) + "</b><strong>" + escapeHtml(odd(group.values.home)) + "</strong></div><div><span class=\"ie-odds-label\">Empate</span><small>Nenhum time vence</small><b>Empate</b><strong>" + escapeHtml(odd(group.values.draw)) + "</strong></div><div><span class=\"ie-odds-label\">Fora</span><small>Vitória de</small><b>" + escapeHtml(away) + "</b><strong>" + escapeHtml(odd(group.values.away)) + "</strong></div></div>" + (group.updatedAt ? "<footer>Atualizado em " + escapeHtml(formatDateTime(group.updatedAt)) + "</footer>" : "") + "</article>";
    }).join("");
    return explanation + averageHtml + "<div class=\"ie-odds-providers\">" + cards + "</div><p class=\"ie-odds-notice\">" + escapeHtml(notice || "Cotações informativas, sem recomendação ou garantia de resultado.") + "</p>";
  }

  function renderHistoricalComparison(data) {
    var teamA = data && data.time_a || {};
    var teamB = data && data.time_b || {};
    var summary = data && data.resumo || {};
    var homeA = data && data.mando_time_a || {};
    var homeB = data && data.mando_time_b || {};
    var total = numberOf(summary.jogos, 0);
    if (!total) return emptyState("Histórico ainda indisponível", "Ainda não há confrontos históricos organizados para estas equipes.", false);
    function resultGrid(values, label) {
      return "<section class=\"ie-h2h-block\"><h4>" + escapeHtml(label) + " <small>" + escapeHtml(numberOf(values.jogos, 0)) + " jogos</small></h4><div class=\"ie-h2h-results\"><div><strong>" + escapeHtml(numberOf(values.vitorias_time_a, 0)) + "</strong><span>Vitórias<br>" + escapeHtml(teamA.nome || "Time A") + "</span></div><div><strong>" + escapeHtml(numberOf(values.empates, 0)) + "</strong><span>Empates</span></div><div><strong>" + escapeHtml(numberOf(values.vitorias_time_b, 0)) + "</strong><span>Vitórias<br>" + escapeHtml(teamB.nome || "Time B") + "</span></div></div></section>";
    }
    function performanceBlock(team, performance) {
      function row(label, values) {
        values = values || {};
        return "<div class=\"ie-performance-row\"><strong>" + escapeHtml(label) + "</strong><div class=\"ie-performance-metrics\"><span><b>" + escapeHtml(numberOf(values.jogos, 0)) + "</b><small>Jogos</small></span><span><b>" + escapeHtml(numberOf(values.vitorias, 0)) + "</b><small>Vitórias</small></span><span><b>" + escapeHtml(numberOf(values.empates, 0)) + "</b><small>Empates</small></span><span><b>" + escapeHtml(numberOf(values.derrotas, 0)) + "</b><small>Derrotas</small></span><span><b>" + escapeHtml(numberOf(values.aproveitamento, 0).toLocaleString("pt-BR")) + "%</b><small>Aproveit.</small></span></div><p>Vitórias em " + escapeHtml(numberOf(values.percentual_vitorias, 0).toLocaleString("pt-BR")) + "% dos jogos</p></div>";
      }
      return "<article class=\"ie-performance-team\"><h4>" + escapeHtml(team.nome || "Time") + "</h4>" + row("Em casa", performance && performance.casa) + row("Fora de casa", performance && performance.fora) + "</article>";
    }
    var overall = "<div class=\"ie-h2h-hero\"><p>Em todos os confrontos registrados</p><strong>" + escapeHtml(total) + " jogos</strong><div class=\"ie-h2h-results ie-h2h-overall\"><div><strong>" + escapeHtml(numberOf(summary.vitorias_time_a, 0)) + "</strong><span>" + escapeHtml(teamA.nome || "Time A") + "</span><small>" + escapeHtml(numberOf(summary.percentual_time_a, 0).toLocaleString("pt-BR")) + "%</small></div><div><strong>" + escapeHtml(numberOf(summary.empates, 0)) + "</strong><span>Empates</span><small>" + escapeHtml(numberOf(summary.percentual_empates, 0).toLocaleString("pt-BR")) + "%</small></div><div><strong>" + escapeHtml(numberOf(summary.vitorias_time_b, 0)) + "</strong><span>" + escapeHtml(teamB.nome || "Time B") + "</span><small>" + escapeHtml(numberOf(summary.percentual_time_b, 0).toLocaleString("pt-BR")) + "%</small></div></div></div>";
    var competitions = arrayOf(data.competicoes);
    var competitionsHtml = competitions.length ? "<div class=\"ie-h2h-competitions\">" + competitions.map(function (item) { return "<div><span>" + escapeHtml(competitionDisplayName(item.competicao || "Competição")) + "</span><strong>" + escapeHtml(numberOf(item.jogos, 0)) + " jogos</strong></div>"; }).join("") + "</div>" : "";
    var games = arrayOf(data.jogos);
    var gamesHtml = games.length ? "<div class=\"ie-h2h-games\">" + games.map(function (game) { return "<div><time>" + escapeHtml(formatDate(game.data)) + "</time><span><b>" + escapeHtml(game.time_casa) + "</b> " + escapeHtml(game.placar_casa) + " – " + escapeHtml(game.placar_fora) + " <b>" + escapeHtml(game.time_fora) + "</b><small>" + escapeHtml(competitionDisplayName(game.competicao || "")) + "</small></span></div>"; }).join("") + "</div>" : "";
    var performanceHtml = data.desempenho_time_a && data.desempenho_time_b ? "<div class=\"ie-performance-compare\">" + performanceBlock(teamA, data.desempenho_time_a) + performanceBlock(teamB, data.desempenho_time_b) + "</div>" : "";
    var general = data.desempenho_geral || {};
    var generalHtml = general.desempenho_time_a && general.desempenho_time_b ? "<p class=\"ie-performance-scope\">" + escapeHtml(general.escopo || "Todos os jogos oficiais disponíveis, independentemente do adversário.") + "</p><div class=\"ie-performance-compare\">" + performanceBlock(teamA, general.desempenho_time_a) + performanceBlock(teamB, general.desempenho_time_b) + "</div>" : "";
    return "<div class=\"ie-h2h\">" + overall + resultGrid(homeA, "Com mando de " + (teamA.nome || "Time A")) + resultGrid(homeB, "Com mando de " + (teamB.nome || "Time B")) + (performanceHtml ? detailSection("Somente neste confronto: casa e fora", performanceHtml) : "") + (generalHtml ? detailSection("Desempenho geral: casa e fora", generalHtml) : "") + (competitionsHtml ? detailSection("Competições", competitionsHtml) : "") + (gamesHtml ? detailSection("Confrontos mais recentes", gamesHtml) : "") + "<p class=\"ie-h2h-notice\">" + escapeHtml(data.aviso || "Resultados passados não garantem resultados futuros.") + "</p></div>";
  }

  function renderBrazilDatabaseSummary(data) {
    if (!data || data.pais !== "Brasil" || data.modalidade !== "Futebol") return "";
    function total(value) { return numberOf(value, 0).toLocaleString("pt-BR"); }
    var period = formatDatabasePeriod(data);
    return "<section class=\"ie-database-summary\"><div><span>Base própria</span><strong>Futebol do Brasil</strong><small>Acervo histórico organizado pelo Turbo Tiger" + (period ? " · " + escapeHtml(period) : "") + "</small></div><dl><div><dt>Partidas</dt><dd>" + escapeHtml(total(data.total_registros)) + "</dd></div><div><dt>Competições</dt><dd>" + escapeHtml(total(data.total_competicoes)) + "</dd></div><div><dt>Times</dt><dd>" + escapeHtml(total(data.total_times)) + "</dd></div></dl>" + historyContributionLinkHtml() + "</section>";
  }

  function historyContributionLinkHtml() {
    return "<button class=\"ie-base-collaborate-link\" type=\"button\" data-history-action=\"open\">Ajude a completar esta história: confira os confrontos e contribua com informações do seu time.<span aria-hidden=\"true\">›</span></button>";
  }

  function historyDate(value) {
    var match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? match[3] + "/" + match[2] + "/" + match[1] : formatDate(value);
  }

  function historyTime(value) {
    var match = String(value || "").match(/^(\d{2}):(\d{2})/);
    return match ? match[1] + ":" + match[2] : "";
  }

  function historySelectOptions(items, selected, placeholder, valueOf, labelOf) {
    return "<option value=\"\">" + escapeHtml(placeholder) + "</option>" + arrayOf(items).map(function (item) {
      var value = valueOf ? valueOf(item) : item;
      var label = labelOf ? labelOf(item) : item;
      return "<option value=\"" + escapeHtml(value) + "\"" + (String(value) === String(selected || "") ? " selected" : "") + ">" + escapeHtml(label) + "</option>";
    }).join("");
  }

  function resetHistoryOptionalFilters() {
    var filters = state.historyContribution.filters;
    filters.competitionKey = "";
    filters.season = "";
    filters.scope = "";
    filters.uf = "";
    state.historyContribution.facets = { competitions: [], seasons: [], scopes: [], ufs: [] };
  }

  function hideHistoryTeamSuggestions() {
    var container = byId("historyTeamSuggestions");
    var input = byId("historyTeamInput");
    if (container) {
      container.innerHTML = "";
      container.hidden = true;
    }
    if (input) input.setAttribute("aria-expanded", "false");
  }

  function renderHistoryTeamSuggestions() {
    var container = byId("historyTeamSuggestions");
    if (!container) return;
    var input = byId("historyTeamInput");
    var history = state.historyContribution;
    var query = history.filters.teamQuery.trim();
    if (query.length < 2 || history.filters.teamKey) {
      hideHistoryTeamSuggestions();
      return;
    }
    container.innerHTML = history.teams.length ? history.teams.map(function (team) {
      var period = [team.primeiro_jogo_em ? historyDate(team.primeiro_jogo_em) : "", team.ultimo_jogo_em ? historyDate(team.ultimo_jogo_em) : ""].filter(Boolean).join(" a ");
      return "<button type=\"button\" role=\"option\" data-history-action=\"select-team\" data-history-team-key=\"" + escapeHtml(team.time_chave) + "\" data-history-team-name=\"" + escapeHtml(team.nome || "Time") + "\"><strong>" + escapeHtml(team.nome || "Time") + "</strong>" + (team.uf || period ? "<small>" + escapeHtml([team.uf, period].filter(Boolean).join(" · ")) + "</small>" : "") + "</button>";
    }).join("") : "<span>Nenhum time encontrado.</span>";
    container.hidden = false;
    if (input) input.setAttribute("aria-expanded", "true");
  }

  function updateHistorySearchControls() {
    var history = state.historyContribution;
    var ready = Number(history.filters.year) > 0 && !!history.filters.teamKey;
    var button = byId("historySearchButton");
    var hint = byId("historySearchHint");
    if (button) button.disabled = !ready || history.loading;
    if (hint) hint.textContent = ready ? "Os demais filtros são opcionais." : "Para pesquisar, escolha o ano e selecione um time na lista.";
    all("[data-history-filter]").forEach(function (select) {
      var name = select.getAttribute("data-history-filter");
      select.disabled = !ready || (name === "uf" && history.filters.scope === "nacional");
    });
  }

  function renderHistoryFilters() {
    var history = state.historyContribution;
    var filters = history.filters;
    var facets = history.facets;
    var competitionOptions = historySelectOptions(facets.competitions, filters.competitionKey, "Todas", function (item) { return item.chave; }, function (item) { return competitionDisplayName(item.nome || "Competição"); });
    var seasonOptions = historySelectOptions(facets.seasons, filters.season, "Todas", null, null);
    var scopeOptions = historySelectOptions(facets.scopes, filters.scope, "Todas", null, function (value) { return value === "nacional" ? "Nacional" : value === "estadual" ? "Estadual" : value; });
    var ufOptions = historySelectOptions(facets.ufs, filters.uf, "Todas", null, null);
    return "<section class=\"ie-history-search\"><div class=\"ie-history-search-intro\"><strong>Encontre um confronto</strong><span>A lista começa com os 20 registros mais recentes. Para uma pesquisa específica, informe ano e time.</span></div><div class=\"ie-history-filters\"><label class=\"ie-history-field\"><span>Ano *</span><input id=\"historyYearInput\" type=\"number\" inputmode=\"numeric\" min=\"" + escapeHtml(history.yearStart || 1800) + "\" max=\"" + escapeHtml(history.yearEnd || new Date().getFullYear()) + "\" value=\"" + escapeHtml(filters.year) + "\" placeholder=\"Ano\"></label><label class=\"ie-history-field is-wide ie-history-team-field\"><span>Time *</span><input id=\"historyTeamInput\" type=\"search\" maxlength=\"120\" value=\"" + escapeHtml(filters.teamQuery) + "\" placeholder=\"Digite e selecione o time\" autocomplete=\"off\" aria-autocomplete=\"list\" aria-controls=\"historyTeamSuggestions\" aria-expanded=\"false\"><div id=\"historyTeamSuggestions\" class=\"ie-history-suggestions\" role=\"listbox\" hidden></div></label><label class=\"ie-history-field is-wide\"><span>Competição</span><select data-history-filter=\"competitionKey\"" + (!filters.teamKey || !filters.year ? " disabled" : "") + ">" + competitionOptions + "</select></label><label class=\"ie-history-field\"><span>Temporada</span><select data-history-filter=\"season\"" + (!filters.teamKey || !filters.year ? " disabled" : "") + ">" + seasonOptions + "</select></label><label class=\"ie-history-field\"><span>Abrangência</span><select data-history-filter=\"scope\"" + (!filters.teamKey || !filters.year ? " disabled" : "") + ">" + scopeOptions + "</select></label><label class=\"ie-history-field\"><span>UF</span><select data-history-filter=\"uf\"" + (!filters.teamKey || !filters.year || filters.scope === "nacional" ? " disabled" : "") + ">" + ufOptions + "</select></label></div><span id=\"historySearchHint\" class=\"ie-history-search-hint\"></span><div class=\"ie-history-search-actions\"><button type=\"button\" class=\"ie-button ie-button-primary\" id=\"historySearchButton\" data-history-action=\"search\">Pesquisar</button><button type=\"button\" class=\"ie-button ie-button-secondary\" data-history-action=\"clear\">Limpar filtros</button></div></section>";
  }

  function renderHistoryRow(row) {
    var id = row.id || row.cod_confronto || "";
    var score = String(row.placar_casa == null ? "—" : row.placar_casa) + " – " + String(row.placar_fora == null ? "—" : row.placar_fora);
    var meta = [competitionDisplayName(row.competicao || ""), row.temporada, row.fase, row.rodada].filter(Boolean).join(" · ");
    var place = [row.cidade, row.estadio].filter(Boolean).join(" · ");
    var label = [historyDate(row.data_partida), row.time_casa, score, row.time_fora, meta].filter(Boolean).join(" · ");
    return "<button type=\"button\" class=\"ie-history-row\" data-history-action=\"correct\" data-history-row-id=\"" + escapeHtml(id) + "\" aria-label=\"Conferir " + escapeHtml(label) + "\"><time datetime=\"" + escapeHtml(row.data_partida || "") + "\"><strong>" + escapeHtml(historyDate(row.data_partida)) + "</strong><span>" + escapeHtml(historyTime(row.hora_partida) || "horário não informado") + "</span></time><span class=\"ie-history-row-copy\"><strong><span>" + escapeHtml(row.time_casa || "Casa") + "</span><b>" + escapeHtml(score) + "</b><span>" + escapeHtml(row.time_fora || "Visitante") + "</span></strong><small>" + escapeHtml(meta || "Competição não informada") + "</small>" + (place ? "<small>" + escapeHtml(place) + "</small>" : "") + "</span>" + icon("chevron") + "</button>";
  }

  function renderHistoryContributionPage() {
    var history = state.historyContribution;
    byId("detailContent").setAttribute("data-detail-view", "history-list");
    byId("detailTitle").textContent = "Colabore com nossa base";
    byId("detailSubtitle").textContent = "Futebol do Brasil";
    var listTitle = history.mode === "pesquisa" ? "Resultados da pesquisa" : "Confrontos mais recentes";
    var rows = history.rows.length ? "<div class=\"ie-history-table\">" + history.rows.map(renderHistoryRow).join("") + "</div>" : emptyState("Nenhum confronto encontrado", history.mode === "pesquisa" ? "Revise os filtros informados ou envie um confronto que ainda não está na base." : "Ainda não há registros disponíveis.", false);
    var pager = history.page > 1 || history.hasMore ? "<nav class=\"ie-history-pager\" aria-label=\"Paginação dos confrontos\"><button type=\"button\" data-history-action=\"previous\"" + (history.page <= 1 || history.loading ? " disabled" : "") + ">Anterior</button><span>Página " + escapeHtml(history.page) + "</span><button type=\"button\" data-history-action=\"next\"" + (!history.hasMore || history.loading ? " disabled" : "") + ">Próxima</button></nav>" : "";
    byId("detailContent").innerHTML = renderHistoryFilters() + "<section class=\"ie-history-results\"><header><div><strong>" + escapeHtml(listTitle) + "</strong><span>Toque em uma linha para sugerir uma correção.</span></div><button class=\"ie-history-add\" type=\"button\" data-history-action=\"new\" aria-label=\"Enviar um confronto não localizado\">+</button></header>" + (history.loading ? "<div class=\"ie-empty\"><span class=\"ie-spinner\"></span></div>" : rows + pager) + "</section>";
    updateHistorySearchControls();
    renderHistoryTeamSuggestions();
  }

  function applyHistoryFilterResponse(result, targetHistory) {
    var history = targetHistory || state.historyContribution;
    history.yearStart = Number(result && result.ano_inicio || history.yearStart || 0) || null;
    history.yearEnd = Number(result && result.ano_fim || history.yearEnd || 0) || null;
    history.teams = arrayOf(result && result.times);
    var facets = result && result.facetas || {};
    history.facets = {
      competitions: arrayOf(facets.competicoes),
      seasons: arrayOf(facets.temporadas),
      scopes: arrayOf(facets.abrangencias),
      ufs: arrayOf(facets.ufs)
    };
  }

  async function loadHistoryFacets() {
    var history = state.historyContribution;
    if (!Number(history.filters.year) || !history.filters.teamKey) return;
    var requestId = ++history.filterRequestId;
    try {
      var result = await rpc("ie_hist_futebol_brasil_filtros_rpc", {
        p_ano: Number(history.filters.year),
        p_busca_time: null,
        p_time_chave: history.filters.teamKey,
        p_limite: 12
      });
      if (history !== state.historyContribution || requestId !== history.filterRequestId) return;
      applyHistoryFilterResponse(result || {}, history);
      if (historyDetailView() === "history-list") renderHistoryContributionPage();
    } catch (error) {
      if (history === state.historyContribution && requestId === history.filterRequestId && historyDetailView() === "history-list") showToast(friendlyError(error), true);
    }
  }

  async function loadHistoryTeamSuggestions(query) {
    var history = state.historyContribution;
    var wanted = String(query || "").trim();
    if (history.filters.teamKey || wanted !== history.filters.teamQuery.trim()) {
      hideHistoryTeamSuggestions();
      return;
    }
    var requestId = ++history.filterRequestId;
    if (wanted.length < 2) {
      history.teams = [];
      hideHistoryTeamSuggestions();
      return;
    }
    try {
      var result = await rpc("ie_hist_futebol_brasil_filtros_rpc", {
        p_ano: Number(history.filters.year) || null,
        p_busca_time: wanted,
        p_time_chave: null,
        p_limite: 12
      });
      if (history !== state.historyContribution || requestId !== history.filterRequestId || wanted !== history.filters.teamQuery.trim()) return;
      history.yearStart = Number(result && result.ano_inicio || history.yearStart || 0) || null;
      history.yearEnd = Number(result && result.ano_fim || history.yearEnd || 0) || null;
      history.teams = arrayOf(result && result.times);
      renderHistoryTeamSuggestions();
    } catch (error) {
      if (history === state.historyContribution && requestId === history.filterRequestId && historyDetailView() === "history-list") {
        history.teams = [];
        hideHistoryTeamSuggestions();
        showToast(friendlyError(error), true);
      }
    }
  }

  function historyListPayload(cursor) {
    var history = state.historyContribution;
    var filters = history.filters;
    return {
      p_modo: history.mode,
      p_ano: history.mode === "pesquisa" ? Number(filters.year) : null,
      p_time_chave: history.mode === "pesquisa" ? filters.teamKey : null,
      p_competicao_chave: history.mode === "pesquisa" && filters.competitionKey ? filters.competitionKey : null,
      p_temporada: history.mode === "pesquisa" && filters.season ? filters.season : null,
      p_abrangencia: history.mode === "pesquisa" && filters.scope ? filters.scope : null,
      p_uf: history.mode === "pesquisa" && filters.uf ? filters.uf : null,
      p_cursor: cursor || null,
      p_limite: 20
    };
  }

  async function loadHistoryRows(cursor) {
    var history = state.historyContribution;
    var requestId = ++history.requestId;
    history.loading = true;
    renderHistoryContributionPage();
    try {
      var result = await rpc("ie_hist_futebol_brasil_confrontos_listar_rpc", historyListPayload(cursor));
      if (history !== state.historyContribution || requestId !== history.requestId) return false;
      history.rows = arrayOf(result);
      history.cursor = cursor || null;
      history.nextCursor = result && result.next_cursor || null;
      history.hasMore = !!(result && result.tem_mais);
      return true;
    } catch (error) {
      if (history === state.historyContribution && requestId === history.requestId) showToast(friendlyError(error), true);
      return false;
    } finally {
      if (history === state.historyContribution && requestId === history.requestId) {
        history.loading = false;
        if (historyDetailView() === "history-list") renderHistoryContributionPage();
      }
    }
  }

  async function openHistoryContribution(pushCurrent) {
    state.historyContribution = emptyHistoryContributionState();
    beginDetail("Colabore com nossa base", "Carregando confrontos...", !!pushCurrent);
    byId("detailContent").setAttribute("data-detail-view", "history-loading");
    var history = state.historyContribution;
    history.loading = true;
    var requestId = ++history.filterRequestId;
    try {
      var results = await Promise.all([
        rpc("ie_hist_futebol_brasil_filtros_rpc", { p_ano: null, p_busca_time: null, p_time_chave: null, p_limite: 12 }),
        rpc("ie_hist_futebol_brasil_confrontos_listar_rpc", historyListPayload(null))
      ]);
      if (history !== state.historyContribution || requestId !== history.filterRequestId || historyDetailView() !== "history-loading") return;
      applyHistoryFilterResponse(results[0] || {}, history);
      history.rows = arrayOf(results[1]);
      history.nextCursor = results[1] && results[1].next_cursor || null;
      history.hasMore = !!(results[1] && results[1].tem_mais);
      history.loading = false;
      renderHistoryContributionPage();
    } catch (error) {
      if (history !== state.historyContribution || historyDetailView() !== "history-loading") return;
      history.loading = false;
      byId("detailContent").innerHTML = emptyState("Não foi possível abrir a colaboração", friendlyError(error), false);
    }
  }

  async function clearHistoryContributionFilters() {
    var history = state.historyContribution;
    history.filters = {
      year: "",
      teamQuery: "",
      teamKey: "",
      teamName: "",
      competitionKey: "",
      season: "",
      scope: "",
      uf: ""
    };
    history.teams = [];
    history.facets = { competitions: [], seasons: [], scopes: [], ufs: [] };
    history.mode = "recentes";
    history.cursor = null;
    history.nextCursor = null;
    history.cursorStack = [];
    history.page = 1;
    history.loading = true;
    var requestId = ++history.filterRequestId;
    renderHistoryContributionPage();
    try {
      var results = await Promise.all([
        rpc("ie_hist_futebol_brasil_filtros_rpc", { p_ano: null, p_busca_time: null, p_time_chave: null, p_limite: 12 }),
        rpc("ie_hist_futebol_brasil_confrontos_listar_rpc", historyListPayload(null))
      ]);
      if (history !== state.historyContribution || requestId !== history.filterRequestId || historyDetailView() !== "history-list") return;
      applyHistoryFilterResponse(results[0] || {}, history);
      history.rows = arrayOf(results[1]);
      history.nextCursor = results[1] && results[1].next_cursor || null;
      history.hasMore = !!(results[1] && results[1].tem_mais);
    } catch (error) {
      if (history === state.historyContribution && requestId === history.filterRequestId && historyDetailView() === "history-list") showToast(friendlyError(error), true);
    } finally {
      if (history === state.historyContribution && requestId === history.filterRequestId && historyDetailView() === "history-list") {
        history.loading = false;
        renderHistoryContributionPage();
      }
    }
  }

  function historyIdempotencyKey() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return "ie-hist-" + window.crypto.randomUUID();
    return "ie-hist-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 14);
  }

  function historyFormField(label, name, type, value, options) {
    options = options || {};
    var attributes = " name=\"" + escapeHtml(name) + "\"" + (options.required ? " required" : "") + (options.min != null ? " min=\"" + escapeHtml(options.min) + "\"" : "") + (options.max != null ? " max=\"" + escapeHtml(options.max) + "\"" : "") + (options.maxLength != null ? " maxlength=\"" + escapeHtml(options.maxLength) + "\"" : "") + (options.step ? " step=\"" + escapeHtml(options.step) + "\"" : "") + (options.placeholder ? " placeholder=\"" + escapeHtml(options.placeholder) + "\"" : "");
    return "<label class=\"ie-history-form-field" + (options.wide ? " is-wide" : "") + "\"><span>" + escapeHtml(label) + (options.required ? " *" : "") + "</span><input type=\"" + escapeHtml(type || "text") + "\" value=\"" + escapeHtml(value == null ? "" : value) + "\"" + attributes + "></label>";
  }

  function renderHistoryContributionForm(type, row) {
    var correction = type === "correcao";
    var requiredForInclusion = !correction;
    row = row || {};
    var intro = correction ? "Encontrou algo diferente? Corrija os dados abaixo e envie para nossa análise." : "Não encontrou uma partida? Preencha todos os dados do confronto e envie para conferência.";
    var html = "<form class=\"ie-history-form\" data-history-contribution-form><input type=\"hidden\" name=\"contribution_type\" value=\"" + (correction ? "correcao" : "inclusao") + "\"><input type=\"hidden\" name=\"confrontation_id\" value=\"" + escapeHtml(correction ? row.id || row.cod_confronto || "" : "") + "\"><input type=\"hidden\" name=\"idempotency_key\" value=\"" + escapeHtml(historyIdempotencyKey()) + "\"><p class=\"ie-history-form-intro\">" + escapeHtml(intro) + "</p><div class=\"ie-history-form-grid\">";
    html += historyFormField("Data", "data_partida", "date", String(row.data_partida || "").slice(0, 10), { required: true });
    html += historyFormField("Horário", "hora_partida", "time", historyTime(row.hora_partida), { required: requiredForInclusion });
    html += historyFormField("Time da casa", "time_casa", "text", row.time_casa, { required: true, wide: true, maxLength: 200 });
    html += historyFormField("Placar casa", "placar_casa", "number", row.placar_casa, { required: true, min: 0, max: 99, step: 1 });
    html += historyFormField("Intervalo casa", "placar_intervalo_casa", "number", row.placar_intervalo_casa, { required: requiredForInclusion, min: 0, max: 99, step: 1 });
    html += historyFormField("Time visitante", "time_fora", "text", row.time_fora, { required: true, wide: true, maxLength: 200 });
    html += historyFormField("Placar visitante", "placar_fora", "number", row.placar_fora, { required: true, min: 0, max: 99, step: 1 });
    html += historyFormField("Intervalo visitante", "placar_intervalo_fora", "number", row.placar_intervalo_fora, { required: requiredForInclusion, min: 0, max: 99, step: 1 });
    html += historyFormField("Competição", "competicao", "text", row.competicao, { required: true, wide: true, maxLength: 240 });
    html += historyFormField("Temporada", "temporada", "text", row.temporada, { required: true, maxLength: 80 });
    html += historyFormField("Fase", "fase", "text", row.fase, { required: requiredForInclusion, maxLength: 120 });
    html += historyFormField("Rodada", "rodada", "text", row.rodada, { required: requiredForInclusion, maxLength: 120 });
    html += historyFormField("Estádio", "estadio", "text", row.estadio, { required: requiredForInclusion, wide: true, maxLength: 200 });
    html += historyFormField("Cidade", "cidade", "text", row.cidade, { required: requiredForInclusion, wide: true, maxLength: 160 });
    html += "<label class=\"ie-history-official is-wide\"><input type=\"checkbox\" name=\"partida_oficial\"" + (row.partida_oficial === false ? "" : " checked") + "><span>Partida oficial</span></label><label class=\"ie-history-form-field is-wide\"><span>Observação</span><textarea name=\"observacao\" maxlength=\"1000\" rows=\"3\" placeholder=\"Se desejar, explique o que deve ser conferido.\"></textarea></label></div><small class=\"ie-history-author-note\">Sua contribuição ficará vinculada à sua conta para análise.</small><button class=\"ie-button ie-button-primary ie-history-submit\" type=\"submit\">Enviar para análise</button></form>";
    byId("detailTitle").textContent = correction ? "Corrigir confronto" : "Enviar confronto";
    byId("detailSubtitle").textContent = correction ? historyDate(row.data_partida) + " · " + (row.time_casa || "Casa") + " × " + (row.time_fora || "Visitante") : "Nova informação para análise";
    byId("detailContent").innerHTML = html;
    byId("detailContent").setAttribute("data-detail-view", "history-form");
  }

  function openHistoryCorrection(id) {
    var row = state.historyContribution.rows.find(function (item) { return Number(item.id || item.cod_confronto) === Number(id); });
    if (!row) {
      showToast("Este confronto não está mais na página atual.", true);
      return;
    }
    state.historyContribution.currentRow = row;
    beginDetail("Corrigir confronto", "Preparando informações...", true);
    renderHistoryContributionForm("correcao", row);
  }

  function openHistoryInclusion() {
    state.historyContribution.currentRow = null;
    beginDetail("Enviar confronto", "Nova informação para análise", true);
    renderHistoryContributionForm("inclusao", {});
  }

  function historyFormPayload(form) {
    var values = new FormData(form);
    var type = String(values.get("contribution_type") || "");
    var row = type === "correcao" ? state.historyContribution.currentRow || {} : {};
    var data = {
      data_partida: String(values.get("data_partida") || ""),
      hora_partida: String(values.get("hora_partida") || ""),
      time_casa: String(values.get("time_casa") || "").trim(),
      time_fora: String(values.get("time_fora") || "").trim(),
      placar_casa: String(values.get("placar_casa") || ""),
      placar_fora: String(values.get("placar_fora") || ""),
      placar_intervalo_casa: String(values.get("placar_intervalo_casa") || ""),
      placar_intervalo_fora: String(values.get("placar_intervalo_fora") || ""),
      competicao: String(values.get("competicao") || "").trim(),
      temporada: String(values.get("temporada") || "").trim(),
      fase: String(values.get("fase") || "").trim(),
      rodada: String(values.get("rodada") || "").trim(),
      estadio: String(values.get("estadio") || "").trim(),
      cidade: String(values.get("cidade") || "").trim(),
      partida_oficial: !!form.querySelector("[name=partida_oficial]").checked
    };
    if (type === "correcao") {
      if (normalizeSearchText(data.time_casa) === normalizeSearchText(row.time_casa)) data.time_casa_chave = row.time_casa_chave;
      if (normalizeSearchText(data.time_fora) === normalizeSearchText(row.time_fora)) data.time_fora_chave = row.time_fora_chave;
      if (normalizeSearchText(data.competicao) === normalizeSearchText(row.competicao)) data.competicao_chave = row.competicao_chave;
    }
    return {
      p_tipo: type,
      p_id_confronto: type === "correcao" ? Number(values.get("confrontation_id")) : null,
      p_dados: data,
      p_observacao: String(values.get("observacao") || "").trim() || null,
      p_chave_idempotencia: String(values.get("idempotency_key") || "")
    };
  }

  function renderHistorySubmissionResult(result) {
    var duplicate = !!(result && result.duplicado);
    var pendingDuplicate = !!(result && result.repetida) || (duplicate && result && result.source_status && result.source_status.status === "em_analise");
    var confrontation = result && result.confronto || {};
    var confrontationHtml = confrontation.time_casa || confrontation.time_fora ? "<div class=\"ie-history-duplicate\"><time>" + escapeHtml(historyDate(confrontation.data_partida)) + "</time><strong>" + escapeHtml(confrontation.time_casa || "Casa") + " × " + escapeHtml(confrontation.time_fora || "Visitante") + "</strong></div>" : "";
    byId("detailTitle").textContent = pendingDuplicate ? "Colaboração já recebida" : duplicate ? "Confronto já localizado" : "Colaboração recebida";
    byId("detailSubtitle").textContent = pendingDuplicate ? "Aguardando análise" : duplicate ? "Confira antes de enviar novamente" : "Aguardando análise";
    byId("detailContent").innerHTML = "<div class=\"ie-history-result" + (duplicate ? " is-duplicate" : "") + "\"><strong>" + escapeHtml(pendingDuplicate ? "Este envio já está aguardando análise." : duplicate ? "Este confronto já está em nossa base." : "Obrigado por colaborar com a nossa base.") + "</strong><p>" + escapeHtml(pendingDuplicate ? "A contribuição já foi registrada em sua conta; não é necessário enviá-la novamente." : duplicate ? "Confira o registro e, se houver alguma diferença, envie uma correção." : "Recebemos as informações em sua conta e vamos conferi-las antes de alterar a base.") + "</p>" + confrontationHtml + "<button type=\"button\" class=\"ie-button ie-button-primary\" data-history-action=\"back-list\">Voltar à lista</button></div>";
    byId("detailContent").setAttribute("data-detail-view", "history-result");
  }

  async function submitHistoryContribution(form) {
    var button = form.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Enviando...";
    try {
      var result = await rpc("ie_hist_futebol_brasil_contribuicao_salvar_rpc", historyFormPayload(form));
      if (!form.isConnected || historyDetailView() !== "history-form") return;
      renderHistorySubmissionResult(result || {});
    } catch (error) {
      if (!form.isConnected || historyDetailView() !== "history-form") return;
      showToast(friendlyError(error), true);
      button.disabled = false;
      button.textContent = "Enviar para análise";
    }
  }

  async function openEventDetail(id, title, pushCurrent) {
    beginDetail(title || "Detalhes do confronto", "Carregando informações...", !!pushCurrent);
    try {
      var data = await rpc("ie_partida_detalhe_rpc", { p_id_evento: Number(id) });
      var event = data && data.evento || {};
      var sides = matchSides(event);
      byId("detailTitle").textContent = displayText(sides.home.name + " × " + sides.away.name);
      byId("detailSubtitle").textContent = competitionDisplayName(event.competicao_nome || event.status_texto || "Detalhes da partida");
      var html = renderMatchCard(event, event.status_texto || "Partida", false);
      var collections = [
        ["Linha do tempo", data.linha_tempo],
        ["Estatísticas", data.estatisticas],
        ["Escalações", data.escalacoes],
        ["Classificação", data.classificacao]
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
      var oddsHtml = renderOddsDetail(data.odds, sides, data.odds_aviso);
      if (oddsHtml) html += detailSection("Cotações informativas", oddsHtml);
      byId("detailContent").innerHTML = html;
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Detalhes indisponíveis", friendlyError(error), false);
    }
  }

  async function openOddsDetail(id, title, pushCurrent) {
    if (!Number(id)) { openGenericDetail("odds", id, title, pushCurrent); return; }
    var view = "event-odds:" + Number(id);
    beginDetail(title || "Cotações informativas", "Carregando cotações...", pushCurrent);
    byId("detailContent").setAttribute("data-detail-view", view);
    try {
      var data = await rpc("ie_partida_detalhe_rpc", { p_id_evento: Number(id) });
      if (byId("detailContent").getAttribute("data-detail-view") !== view) return;
      var event = data && data.evento || {};
      var sides = matchSides(event);
      byId("detailTitle").textContent = displayText(sides.home.name + " × " + sides.away.name);
      byId("detailSubtitle").textContent = displayText("Cotações informativas" + (event.competicao_nome ? " · " + competitionDisplayName(event.competicao_nome) : ""));
      var html = renderOddsDetail(data.odds, sides, data.odds_aviso);
      byId("detailContent").innerHTML = detailModeSwitch("analysis", id) + (html || emptyState("Cotações indisponíveis", "Ainda não há cotações atualizadas para esta partida.", false));
    } catch (error) {
      if (byId("detailContent").getAttribute("data-detail-view") === view) byId("detailContent").innerHTML = detailModeSwitch("analysis", id) + emptyState("Cotações indisponíveis", friendlyError(error), false);
    }
  }

  function detailModeSwitch(target, id) {
    var analysis = target === "analysis";
    return "<div class=\"ie-detail-switcher\"><button type=\"button\" class=\"ie-button ie-button-secondary\" data-detail-switch=\"" + (analysis ? "analysis" : "odds") + "\" data-event-id=\"" + escapeHtml(id) + "\">" + icon(analysis ? "analysis" : "chart") + "<span>" + (analysis ? "Ver análises" : "Ver cotações") + "</span></button></div>";
  }

  function openGenericDetail(kind, id, title, pushCurrent) {
    beginDetail(title || "Detalhes", "", !!pushCurrent);
    byId("detailSubtitle").textContent = kind === "competition" ? "Competição acompanhada" : kind === "analysis" ? "Resumo estatístico personalizado" : kind === "odds" ? "Cotações informativas" : "Time ou participante acompanhado";
    byId("detailContent").innerHTML = emptyState("Informações completas na central", kind === "analysis" ? "As análises usam somente os dados disponíveis para as suas seleções e não representam recomendação nem garantia de resultado." : kind === "odds" ? "Ainda não há cotações atualizadas para esta partida." : "As próximas partidas, resultados e dados relacionados ficam disponíveis nas áreas correspondentes.", false);
  }

  async function openAnalysisDetail(id, title, pushCurrent) {
    if (!Number(id)) { openGenericDetail("analysis", id, title, pushCurrent); return; }
    var view = "event-analysis:" + Number(id);
    beginDetail(title || "Análises estatísticas", "Carregando histórico do confronto...", pushCurrent);
    byId("detailContent").setAttribute("data-detail-view", view);
    try {
      var data = await rpc("ie_confronto_evento_rpc", { p_id_evento: Number(id), p_limite: 20, p_offset: 0 });
      if (byId("detailContent").getAttribute("data-detail-view") !== view) return;
      try { data.desempenho_geral = await rpc("ie_desempenho_geral_evento_rpc", { p_id_evento: Number(id) }); } catch (generalError) { /* desempenho geral pode não estar mapeado */ }
      if (byId("detailContent").getAttribute("data-detail-view") !== view) return;
      var baseSummary = null;
      try { baseSummary = await rpc("ie_base_futebol_brasil_resumo_rpc", {}); } catch (baseError) { /* selo da base não bloqueia as estatísticas */ }
      if (byId("detailContent").getAttribute("data-detail-view") !== view) return;
      byId("detailTitle").textContent = displayText((data.time_a && data.time_a.nome || "Time A") + " × " + (data.time_b && data.time_b.nome || "Time B"));
      byId("detailSubtitle").textContent = "Histórico completo do confronto";
      byId("detailContent").innerHTML = detailModeSwitch("odds", id) + renderBrazilDatabaseSummary(baseSummary) + renderHistoricalComparison(data);
    } catch (error) {
      if (byId("detailContent").getAttribute("data-detail-view") === view) byId("detailContent").innerHTML = detailModeSwitch("odds", id) + emptyState("Análise indisponível", friendlyError(error), false);
    }
  }

  async function openCompetitionDetail(id, title, pushCurrent) {
    beginDetail(title || "Detalhes da competição", "Carregando informações...", !!pushCurrent);
    try {
      var data = await rpc("ie_competicao_detalhe_rpc", { p_id_competicao: Number(id) });
      var competition = data && data.competicao || {};
      var teams = arrayOf(data && data.times_classificados);
      byId("detailTitle").textContent = competitionDisplayName(competition.nome || title || "Competição");
      byId("detailSubtitle").textContent = displayText([competition.temporada, competition.pais].filter(Boolean).join(" • ") || "Detalhes da competição");
      var overview = "<div class=\"ie-detail-list\">" + [
        ["Fase atual", competition.fase_atual || "Em atualização"],
        ["Início", competition.data_inicio ? formatDate(competition.data_inicio) : "Em atualização"],
        ["Fim", competition.data_fim ? formatDate(competition.data_fim) : "Em atualização"]
      ].map(function (row) { return "<div><span>" + escapeHtml(row[0]) + "</span><strong>" + escapeHtml(row[1]) + "</strong></div>"; }).join("") + "</div>";
      var teamHtml = teams.length ? "<div class=\"ie-classified-list\">" + teams.map(function (team) {
        var teamName = team.nome || "Time";
        var abbreviation = String(team.sigla || team.abreviacao || "").trim().toUpperCase() || initials(teamName).slice(0, 3);
        var label = (abbreviation ? abbreviation + " - " : "") + teamName + (team.pontos == null ? "" : " (" + team.pontos + ")");
        return "<article class=\"ie-classified-row\"" + detailAttributes("competition-participant", team.id_participante || team.id, "", teamName) + " data-participant-id=\"" + escapeHtml(team.id_participante || team.id || "") + "\" data-competition-id=\"" + escapeHtml(competition.id_competicao || id) + "\" data-phase=\"" + escapeHtml(competition.fase_atual || "") + "\"><span class=\"ie-classified-position\">" + escapeHtml(team.posicao ? team.posicao + "º" : team.grupo || "—") + "</span>" + logoHtml(team.imagem_url || team.logo_url, teamName, "ie-entity-logo", abbreviation) + "<strong>" + escapeHtml(label) + "</strong>" + icon("chevron") + "</article>";
      }).join("") + "</div>" : "<p>Os classificados ainda não foram disponibilizados pela fonte.</p>";
      byId("detailContent").innerHTML = detailSection("Informações da competição", overview) + detailSection("Times classificados na fase", teamHtml);
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Detalhes indisponíveis", friendlyError(error), false);
    }
  }

  async function openParticipantDetail(id, title, pushCurrent) {
    beginDetail(title || "Time ou participante", "Carregando competições...", !!pushCurrent);
    try {
      var data = await rpc("ie_participante_competicoes_rpc", { p_id_participante: Number(id), p_id_esporte: state.activeSportId ? Number(state.activeSportId) : null, p_limite: 50, p_offset: 0 });
      var participant = data && data.participante || followedSelections("participant", state.activeSportId).find(function (item) { return Number(selectionIdentity(item).id) === Number(id); }) || {};
      var competitions = arrayOf(data);
      byId("detailTitle").textContent = displayText(participant.nome || title || "Time ou participante");
      byId("detailSubtitle").textContent = "Competições em que participa";
      byId("detailContent").innerHTML = competitions.length ? "<div class=\"ie-detail-entities\">" + competitions.map(function (competition) {
        var competitionId = competition.id_competicao || competition.id;
        var name = competitionDisplayName(competition.nome || competition.competicao_nome || "Competição");
        return "<article class=\"ie-entity-row\"" + detailAttributes("participant-competition", competitionId, "", name) + " data-participant-id=\"" + escapeHtml(id) + "\" data-competition-id=\"" + escapeHtml(competitionId) + "\" data-phase=\"" + escapeHtml(competition.fase_atual || "") + "\">" + logoHtml(competition.imagem_url || competition.logo_url, name, "ie-entity-logo", competition.sigla) + "<div class=\"ie-entity-copy\"><strong>" + escapeHtml(name) + "</strong><span>" + escapeHtml(competition.fase_atual || competition.temporada || "") + "</span></div>" + icon("chevron") + "</article>";
      }).join("") + "</div>" : emptyState("Nenhuma competição disponível", "Ainda não há competições relacionadas a este participante.", false);
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Competições indisponíveis", friendlyError(error), false);
    }
  }

  async function openParticipantCompetitionMatches(participantId, competitionId, phase, title, pushCurrent) {
    beginDetail(title || "Confrontos", phase || "Próximos confrontos", !!pushCurrent);
    try {
      var phaseFilter = normalizeSearchText(phase) === "temporada regular" ? null : (phase || null);
      var result = await rpc("ie_partidas_listar_rpc", { p_secao: "proximos", p_id_esporte: state.activeSportId ? Number(state.activeSportId) : null, p_id_competicao: Number(competitionId), p_id_participante: Number(participantId), p_fase: phaseFilter, p_limite: 50, p_offset: 0 });
      var matches = orderMatchesByFavorites(arrayOf(result), state.activeSportId, "upcoming");
      byId("detailTitle").textContent = displayText(title || "Confrontos");
      byId("detailSubtitle").textContent = displayText(phase || "Próximos confrontos");
      byId("detailContent").innerHTML = matches.length ? "<div class=\"ie-feed\">" + matches.map(function (item) { return renderMatchCard(item); }).join("") + "</div>" : emptyState("Nenhum confronto programado", "Ainda não há confrontos futuros disponíveis nesta fase.", false);
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Confrontos indisponíveis", friendlyError(error), false);
    }
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
      await Promise.all(changes);
      var times = all("input[name=alertTime]:checked").map(function (input) { return Number(input.value); });
      var events = all("input[name=alertEvent]:checked").map(function (input) { return input.value; });
      changes = [];
      changes.push(rpc("ie_esportes_favoritos_ordenar_rpc", { p_ids_esportes: state.sportFavoriteOrder.slice() }));
      changes.push(rpc("ie_filtros_salvar_rpc", { p_ids_esportes: byId("sportSelect").value ? [Number(byId("sportSelect").value)] : [], p_ids_continentes: byId("continentSelect").value ? [Number(byId("continentSelect").value)] : [], p_ids_paises: byId("countrySelect").value ? [Number(byId("countrySelect").value)] : [] }));
      changes.push(rpc("ie_alertas_salvar_rpc", { p_ativo: byId("notificationsEnabled").checked, p_antecedencias_minutos: times, p_tipos_evento: events }));
      changes.push(rpc("ie_favoritos_ordenar_rpc", { p_ids_participantes: orderedFavoriteParticipants().map(function (item) { return Number(item.id_participante); }) }));
      await Promise.all(changes);
      state.selectionChanges = {};
      state.activeSportId = state.sportFavoriteOrder[0] || null;
      resetGameCompetitionFilter();
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

  function updateBootstrapSelection(key, next) {
    var parts = String(key || "").split(":");
    var targetType = parts[0];
    var targetId = Number(parts[1]);
    var selections = arrayOf(state.bootstrap && state.bootstrap.selecoes).slice();
    var index = selections.findIndex(function (item) {
      var identity = selectionIdentity(item);
      return identity.type === targetType && Number(identity.id) === targetId;
    });
    if (index >= 0) {
      selections[index] = Object.assign({}, selections[index], next);
    } else {
      var known = targetType === "participant"
        ? state.catalogKnown.participants[String(targetId)]
        : state.catalogKnown.competitions[String(targetId)];
      selections.push(Object.assign({}, known || {}, next, targetType === "participant"
        ? { tipo_alvo: "participante", id_participante: targetId }
        : { tipo_alvo: "competicao", id_competicao: targetId }));
    }
    state.bootstrap.selecoes = selections;
  }

  async function persistEntitySelection(key, kind) {
    if (!key || state.selectionBusy[key]) return;
    var parts = key.split(":");
    var targetType = parts[0];
    var targetId = Number(parts[1]);
    if ((targetType !== "participant" && targetType !== "competition") || !targetId) return;

    var selected = selectionMap();
    var base = state.selectionChanges[key] || selected[key] || { acompanhar: false, notificar: false };
    var next = {
      acompanhar: !!base.acompanhar,
      notificar: targetType === "participant" && !!base.notificar
    };
    if (kind === "follow") next.acompanhar = !next.acompanhar;
    else if (kind === "notify" && targetType === "participant") next.notificar = !next.notificar;
    else return;

    state.preferenceRevision += 1;
    var previousPending = Object.prototype.hasOwnProperty.call(state.selectionChanges, key)
      ? Object.assign({}, state.selectionChanges[key])
      : null;
    state.selectionChanges[key] = next;
    state.selectionBusy[key] = true;
    renderEntities();
    renderSelectionLists();

    try {
      await rpc("ie_selecao_salvar_rpc", {
        p_tipo_alvo: targetType === "participant" ? "participante" : "competicao",
        p_id_alvo: targetId,
        p_acompanhar: next.acompanhar,
        p_notificar: targetType === "participant" && next.notificar
      });
      updateBootstrapSelection(key, next);
      if (targetType === "competition" && !next.acompanhar && Number(state.gameCompetitionId) === targetId) resetGameCompetitionFilter();
      if (targetType === "competition") renderGames();
      delete state.selectionChanges[key];
      if (targetType === "participant" && !next.acompanhar) {
        state.favorites = state.favorites.filter(function (item) {
          return Number(item.id_participante || item.id_time || item.id_alvo || item.id) !== targetId;
        });
        state.favoriteOrder = state.favoriteOrder.filter(function (id) { return Number(id) !== targetId; });
      }
      await loadActiveSportData(false);
      renderHome();
      renderGames();
      renderNewsFilters();
      renderNews();
      renderEntities();
      renderSelectionLists();
      setFreshness(new Date().toISOString());
      saveCache();
      postNative("preferences_changed", {});
      showToast(kind === "notify" ? "Notificações atualizadas." : "Favoritos atualizados.", false);
    } catch (error) {
      if (previousPending) state.selectionChanges[key] = previousPending;
      else delete state.selectionChanges[key];
      showToast(friendlyError(error), true);
    } finally {
      delete state.selectionBusy[key];
      renderEntities();
      renderSelectionLists();
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

  function setupPullToRefresh() {
    var tracking = false;
    var startY = 0;
    var progress = 0;
    var threshold = 76;

    document.addEventListener("touchstart", function (event) {
      if (state.loading || window.scrollY > 0 || !byId("detailModal").hidden || !event.touches || event.touches.length !== 1) {
        tracking = false;
        return;
      }
      tracking = true;
      progress = 0;
      startY = event.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchmove", function (event) {
      if (!tracking || !event.touches || event.touches.length !== 1) return;
      var distance = Math.max(0, event.touches[0].clientY - startY);
      progress = Math.min(1, distance / threshold);
      setPullRefreshState(progress, false);
    }, { passive: true });

    function release() {
      if (!tracking) return;
      tracking = false;
      if (progress >= 1) {
        setPullRefreshState(1, true);
        loadAll(true);
      } else {
        setPullRefreshState(0, false);
      }
      progress = 0;
    }

    document.addEventListener("touchend", release, { passive: true });
    document.addEventListener("touchcancel", release, { passive: true });
  }

  function setupEvents() {
    byId("retryButton").addEventListener("click", function () { byId("accessPanel").hidden = true; byId("loadingPanel").hidden = false; loadAll(false); });
    setupPullToRefresh();
    byId("settingsButton").addEventListener("click", function () { openSettings("", true); });
    byId("closeButton").addEventListener("click", function () { if (!postNative("close", {})) history.back(); });
    all("[data-open-settings]").forEach(function (button) { button.addEventListener("click", function () { openSettings("", true); }); });
    all("[data-close-settings]").forEach(function (button) { button.addEventListener("click", window.TurboTigerIEHandleBack); });
    all("[data-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        var tab = button.getAttribute("data-tab");
        activateTab(tab);
      });
    });
    all("[data-game-filter]").forEach(function (button) { button.addEventListener("click", function () { state.gameFilter = button.getAttribute("data-game-filter"); all("[data-game-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); renderGames(); }); });
    byId("gamesCompetitionFilter").addEventListener("change", function () {
      state.gameCompetitionId = byId("gamesCompetitionFilter").value ? Number(byId("gamesCompetitionFilter").value) : null;
      state.gameCompetitionGames = { live: [], upcoming: [], results: [] };
      loadGameCompetitionData(true, null, false).then(function (result) {
        if (result && result.errors && result.errors.length) showToast(friendlyError(result.errors[0]), true);
      }, function (error) { showToast(friendlyError(error), true); });
    });
    all("[data-close-detail]").forEach(function (button) { button.addEventListener("click", closeDetail); });
    byId("detailBackButton").addEventListener("click", backDetail);
    byId("settingsForm").addEventListener("submit", saveSettings);
    byId("newsTeamFilter").addEventListener("change", function () {
      state.newsFilters.participantId = byId("newsTeamFilter").value ? Number(byId("newsTeamFilter").value) : null;
      if (state.newsFilters.participantId) { state.newsFilters.competitionId = null; byId("newsCompetitionFilter").value = ""; }
      loadNewsForActiveSport(true).catch(function (error) { showToast(friendlyError(error), true); });
    });
    byId("newsCompetitionFilter").addEventListener("change", function () {
      state.newsFilters.competitionId = byId("newsCompetitionFilter").value ? Number(byId("newsCompetitionFilter").value) : null;
      if (state.newsFilters.competitionId) { state.newsFilters.participantId = null; byId("newsTeamFilter").value = ""; }
      loadNewsForActiveSport(true).catch(function (error) { showToast(friendlyError(error), true); });
    });
    function refreshCatalog() {
      loadCatalog().catch(function (error) { showToast(friendlyError(error), true); });
    }
    var updateCatalogFromFilter = debounce(refreshCatalog, 40);
    var updateCatalogFromSearch = debounce(refreshCatalog, 280);
    var lastContinent = byId("continentSelect").value;
    function continentChanged() {
      var continent = byId("continentSelect").value;
      if (continent !== lastContinent) {
        lastContinent = continent;
        fillCountrySelect(continent, "");
      }
      updateCatalogFromFilter();
    }
    byId("continentSelect").addEventListener("input", continentChanged);
    byId("continentSelect").addEventListener("change", continentChanged);
    ["countrySelect", "sportSelect"].forEach(function (id) {
      byId(id).addEventListener("input", updateCatalogFromFilter);
      byId(id).addEventListener("change", updateCatalogFromFilter);
    });
    ["teamSearch", "competitionSearch"].forEach(function (id) {
      byId(id).addEventListener("input", updateCatalogFromSearch);
    });
    var updateHistoryTeamSearch = debounce(function (query) {
      loadHistoryTeamSuggestions(query);
    }, 260);
    var updateHistoryFacets = debounce(function () {
      loadHistoryFacets();
    }, 120);
    document.addEventListener("input", function (event) {
      if (event.target.id === "historyYearInput") {
        state.historyContribution.filters.year = String(event.target.value || "").trim();
        updateHistorySearchControls();
        return;
      }
      if (event.target.id !== "historyTeamInput") return;
      var history = state.historyContribution;
      var query = String(event.target.value || "");
      history.filterRequestId += 1;
      history.teams = [];
      history.filters.teamQuery = query;
      if (normalizeSearchText(query) !== normalizeSearchText(history.filters.teamName)) {
        history.filters.teamKey = "";
        history.filters.teamName = "";
        resetHistoryOptionalFilters();
      }
      updateHistorySearchControls();
      hideHistoryTeamSuggestions();
      updateHistoryTeamSearch(query);
    });
    document.addEventListener("change", function (event) {
      if (event.target.id === "historyYearInput") {
        var history = state.historyContribution;
        history.filters.year = String(event.target.value || "").trim();
        resetHistoryOptionalFilters();
        renderHistoryContributionPage();
        if (history.filters.year && history.filters.teamKey) updateHistoryFacets();
        return;
      }
      var historyFilter = event.target.getAttribute && event.target.getAttribute("data-history-filter");
      if (!historyFilter) return;
      state.historyContribution.filters[historyFilter] = String(event.target.value || "");
      if (historyFilter === "scope") {
        if (state.historyContribution.filters.scope === "nacional") state.historyContribution.filters.uf = "";
        renderHistoryContributionPage();
      }
    });
    document.addEventListener("submit", function (event) {
      var form = event.target.closest && event.target.closest("[data-history-contribution-form]");
      if (!form) return;
      event.preventDefault();
      submitHistoryContribution(form);
    });
    var detailGesture = null;
    document.addEventListener("pointerdown", function (event) {
      var detail = event.target.closest("[data-detail-kind]");
      if (!detail || event.button !== 0) { detailGesture = null; return; }
      detailGesture = { target: detail, x: event.clientX, y: event.clientY, moved: false };
    }, { passive: true });
    document.addEventListener("pointermove", function (event) {
      if (!detailGesture) return;
      if (Math.abs(event.clientX - detailGesture.x) > 10 || Math.abs(event.clientY - detailGesture.y) > 10) detailGesture.moved = true;
    }, { passive: true });
    document.addEventListener("pointercancel", function () { detailGesture = null; }, { passive: true });
    document.addEventListener("touchstart", function (event) {
      var detail = event.target.closest("[data-detail-kind]");
      if (!detail || !event.touches || event.touches.length !== 1) return;
      detailGesture = { target: detail, x: event.touches[0].clientX, y: event.touches[0].clientY, moved: false };
    }, { passive: true });
    document.addEventListener("touchmove", function (event) {
      if (!detailGesture || !event.touches || event.touches.length !== 1) return;
      if (Math.abs(event.touches[0].clientX - detailGesture.x) > 10 || Math.abs(event.touches[0].clientY - detailGesture.y) > 10) detailGesture.moved = true;
    }, { passive: true });
    document.addEventListener("touchcancel", function () { detailGesture = null; }, { passive: true });

    var favoriteDrag = null;

    function mergeVisibleFavoriteOrder(currentOrder, visibleOrder) {
      var visible = {};
      visibleOrder.forEach(function (id) { visible[String(id)] = true; });
      var cursor = 0;
      var merged = currentOrder.map(function (id) {
        return visible[String(id)] ? visibleOrder[cursor++] : Number(id);
      });
      visibleOrder.forEach(function (id) {
        if (merged.indexOf(Number(id)) < 0) merged.push(Number(id));
      });
      return merged;
    }

    function finishFavoriteDrag(event) {
      if (!favoriteDrag || (event && event.pointerId !== favoriteDrag.pointerId)) return;
      var drag = favoriteDrag;
      var visibleOrder = all(drag.rowSelector, drag.list).map(function (row) {
        return Number(row.getAttribute(drag.rowAttribute));
      }).filter(function (id) { return id > 0; });
      if (drag.kind === "sport") state.sportFavoriteOrder = mergeVisibleFavoriteOrder(state.sportFavoriteOrder, visibleOrder);
      else state.favoriteOrder = mergeVisibleFavoriteOrder(state.favoriteOrder, visibleOrder);
      state.preferenceRevision += 1;
      drag.row.classList.remove("is-dragging");
      document.body.classList.remove("ie-reordering-favorites");
      favoriteDrag = null;
      if (drag.kind === "sport") renderSportFavoriteSettings();
      else renderSelectionLists();
    }

    document.addEventListener("pointerdown", function (event) {
      var sportHandle = event.target.closest("[data-sport-favorite-drag-id]");
      var handle = sportHandle || event.target.closest("[data-favorite-drag-id]");
      if (!handle || event.button !== 0) return;
      var kind = sportHandle ? "sport" : "participant";
      var rowSelector = kind === "sport" ? "[data-sport-favorite-row-id]" : "[data-favorite-row-id]";
      var rowAttribute = kind === "sport" ? "data-sport-favorite-row-id" : "data-favorite-row-id";
      var list = byId(kind === "sport" ? "sportFavoriteList" : "teamSelectionList");
      var row = handle.closest(rowSelector);
      if (!row) return;
      event.preventDefault();
      detailGesture = null;
      favoriteDrag = { pointerId: event.pointerId, row: row, list: list, rowSelector: rowSelector, rowAttribute: rowAttribute, kind: kind };
      row.classList.add("is-dragging");
      document.body.classList.add("ie-reordering-favorites");
      if (handle.setPointerCapture) {
        try { handle.setPointerCapture(event.pointerId); } catch (error) {}
      }
    }, { passive: false });

    document.addEventListener("pointermove", function (event) {
      if (!favoriteDrag || event.pointerId !== favoriteDrag.pointerId) return;
      event.preventDefault();
      var list = favoriteDrag.list;
      if (favoriteDrag.kind === "sport") {
        var tabs = document.querySelector(".ie-tabs");
        var pageTopEdge = tabs ? tabs.getBoundingClientRect().bottom + 24 : 72;
        if (event.clientY < pageTopEdge) window.scrollBy(0, -14);
        else if (event.clientY > window.innerHeight - 42) window.scrollBy(0, 14);
      } else {
        var listBounds = list.getBoundingClientRect();
        if (event.clientY < listBounds.top + 42) list.scrollTop -= 14;
        else if (event.clientY > listBounds.bottom - 42) list.scrollTop += 14;
      }
      var pointed = document.elementFromPoint(event.clientX, event.clientY);
      var target = pointed && pointed.closest(favoriteDrag.rowSelector);
      if (!target || target === favoriteDrag.row || target.parentNode !== favoriteDrag.row.parentNode) return;
      var bounds = target.getBoundingClientRect();
      target.parentNode.insertBefore(
        favoriteDrag.row,
        event.clientY < bounds.top + bounds.height / 2 ? target : target.nextSibling
      );
    }, { passive: false });

    document.addEventListener("pointerup", finishFavoriteDrag, { passive: true });
    document.addEventListener("pointercancel", finishFavoriteDrag, { passive: true });

    function openDetailElement(detail, pushCurrent) {
      var kind = detail.getAttribute("data-detail-kind");
      if (kind === "news") openNewsSource(detail.getAttribute("data-detail-url"), detail.getAttribute("data-detail-title"));
      else if (kind === "event") openEventDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"), pushCurrent);
      else if (kind === "odds") openOddsDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"), pushCurrent);
      else if (kind === "competition") openCompetitionDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"), pushCurrent);
      else if (kind === "participant") openParticipantDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"), pushCurrent);
      else if (kind === "competition-participant" || kind === "participant-competition") openParticipantCompetitionMatches(detail.getAttribute("data-participant-id"), detail.getAttribute("data-competition-id"), detail.getAttribute("data-phase"), detail.getAttribute("data-detail-title"), true);
      else if (kind === "analysis") openAnalysisDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"), pushCurrent);
      else openGenericDetail(kind, detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"), pushCurrent);
    }

    document.addEventListener("click", function (event) {
      var historyAction = event.target.closest("[data-history-action]");
      if (historyAction) {
        event.preventDefault();
        event.stopPropagation();
        detailGesture = null;
        var action = historyAction.getAttribute("data-history-action");
        var history = state.historyContribution;
        if (action === "open") {
          openHistoryContribution(!byId("detailModal").hidden);
        } else if (action === "select-team") {
          history.filters.teamKey = historyAction.getAttribute("data-history-team-key") || "";
          history.filters.teamName = historyAction.getAttribute("data-history-team-name") || "";
          history.filters.teamQuery = history.filters.teamName;
          resetHistoryOptionalFilters();
          renderHistoryContributionPage();
          if (history.filters.year) loadHistoryFacets();
        } else if (action === "search") {
          if (!Number(history.filters.year) || !history.filters.teamKey || history.loading) return;
          history.mode = "pesquisa";
          history.cursor = null;
          history.nextCursor = null;
          history.cursorStack = [];
          history.page = 1;
          loadHistoryRows(null);
        } else if (action === "clear") {
          if (!history.loading) clearHistoryContributionFilters();
        } else if (action === "correct") {
          openHistoryCorrection(historyAction.getAttribute("data-history-row-id"));
        } else if (action === "new") {
          openHistoryInclusion();
        } else if (action === "next") {
          if (!history.loading && history.nextCursor) {
            var nextCursor = history.nextCursor;
            history.cursorStack.push(history.cursor);
            history.page += 1;
            loadHistoryRows(nextCursor).then(function (loaded) {
              if (loaded) return;
              history.page = Math.max(1, history.page - 1);
              history.cursorStack.pop();
              renderHistoryContributionPage();
            });
          }
        } else if (action === "previous") {
          if (!history.loading && history.page > 1 && history.cursorStack.length) {
            var previousCursor = history.cursorStack.pop();
            var failedCursor = history.cursor;
            history.page -= 1;
            loadHistoryRows(previousCursor).then(function (loaded) {
              if (loaded) return;
              history.page += 1;
              history.cursorStack.push(previousCursor);
              history.cursor = failedCursor;
              renderHistoryContributionPage();
            });
          }
        } else if (action === "back-list") {
          backDetail();
          if (!byId("detailModal").hidden) renderHistoryContributionPage();
        }
        return;
      }
      var settings = event.target.closest("[data-open-settings]");
      if (settings) { openSettings("", true); return; }
      var sportButton = event.target.closest("[data-sport-id]");
      if (sportButton) { changeActiveSport(sportButton.getAttribute("data-sport-id")); return; }
      var entitySelection = event.target.closest("[data-entity-selection-key]");
      if (entitySelection) {
        event.preventDefault();
        event.stopPropagation();
        detailGesture = null;
        persistEntitySelection(
          entitySelection.getAttribute("data-entity-selection-key"),
          entitySelection.getAttribute("data-entity-selection-kind")
        );
        return;
      }
      var detailSwitch = event.target.closest("[data-detail-switch]");
      if (detailSwitch) {
        event.preventDefault();
        event.stopPropagation();
        detailGesture = null;
        var switchTarget = detailSwitch.getAttribute("data-detail-switch");
        var switchEventId = detailSwitch.getAttribute("data-event-id");
        if (switchTarget === "analysis") openAnalysisDetail(switchEventId, "Análises estatísticas", "replace");
        else openOddsDetail(switchEventId, "Cotações informativas", "replace");
        return;
      }
      var matchAction = event.target.closest("[data-match-action]");
      if (matchAction) {
        var actionCard = matchAction.closest("[data-detail-kind]");
        if (detailGesture && actionCard && detailGesture.target === actionCard && detailGesture.moved) { event.preventDefault(); detailGesture = null; return; }
        detailGesture = null;
        var pushAction = !byId("detailModal").hidden && byId("detailModal").contains(matchAction);
        if (matchAction.getAttribute("data-match-action") === "odds") openOddsDetail(matchAction.getAttribute("data-event-id"), "Cotações informativas", pushAction);
        else openAnalysisDetail(matchAction.getAttribute("data-event-id"), "Análises estatísticas", pushAction);
        return;
      }
      var detail = event.target.closest("[data-detail-kind]");
      if (detail) {
        if (detailGesture && detailGesture.target === detail && detailGesture.moved) {
          event.preventDefault();
          detailGesture = null;
          return;
        }
        detailGesture = null;
        openDetailElement(detail, !byId("detailModal").hidden && byId("detailModal").contains(detail));
        return;
      }
      var sportFavorite = event.target.closest("[data-sport-favorite-id]");
      if (sportFavorite) {
        state.preferenceRevision += 1;
        var favoriteSportId = Number(sportFavorite.getAttribute("data-sport-favorite-id"));
        var favoriteSportIndex = state.sportFavoriteOrder.indexOf(favoriteSportId);
        if (favoriteSportIndex >= 0) state.sportFavoriteOrder.splice(favoriteSportIndex, 1);
        else state.sportFavoriteOrder.push(favoriteSportId);
        renderSportFavoriteSettings();
        return;
      }
      var selection = event.target.closest("[data-selection-key]");
      if (selection) {
        state.preferenceRevision += 1;
        var key = selection.getAttribute("data-selection-key");
        var kind = selection.getAttribute("data-selection-kind");
        var base = state.selectionChanges[key] || selectionMap()[key] || { acompanhar: false, notificar: false };
        var next = { acompanhar: !!base.acompanhar, notificar: !!base.notificar };
        if (kind === "follow") next.acompanhar = !next.acompanhar;
        if (kind === "notify") next.notificar = !next.notificar;
        state.selectionChanges[key] = next;
        if (key.indexOf("participant:") === 0 && kind === "follow") {
          var selectedParticipantId = Number(key.split(":")[1]);
          if (next.acompanhar && state.favoriteOrder.indexOf(selectedParticipantId) < 0) state.favoriteOrder.push(selectedParticipantId);
          if (!next.acompanhar) state.favoriteOrder = state.favoriteOrder.filter(function (id) { return Number(id) !== selectedParticipantId; });
        }
        renderSelectionLists();
      }
    });
    document.addEventListener("keydown", function (event) {
      var sportDragHandle = event.target.closest("[data-sport-favorite-drag-id]");
      var dragHandle = sportDragHandle || event.target.closest("[data-favorite-drag-id]");
      if (dragHandle && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        var isSportDrag = !!sportDragHandle;
        var dragAttribute = isSportDrag ? "data-sport-favorite-drag-id" : "data-favorite-drag-id";
        var favoriteId = Number(dragHandle.getAttribute(dragAttribute));
        var favoriteOrder = isSportDrag ? state.sportFavoriteOrder : state.favoriteOrder;
        var favoriteIndex = favoriteOrder.indexOf(favoriteId);
        var targetIndex = favoriteIndex + (event.key === "ArrowUp" ? -1 : 1);
        if (favoriteIndex >= 0 && targetIndex >= 0 && targetIndex < favoriteOrder.length) {
          state.preferenceRevision += 1;
          var swapped = favoriteOrder[targetIndex];
          favoriteOrder[targetIndex] = favoriteId;
          favoriteOrder[favoriteIndex] = swapped;
          if (isSportDrag) renderSportFavoriteSettings();
          else renderSelectionLists();
          var movedHandle = document.querySelector("[" + dragAttribute + "=\"" + favoriteId + "\"]");
          if (movedHandle) movedHandle.focus();
        }
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("[data-match-action], [data-entity-selection-key]")) return;
      var detail = event.target.closest("[data-detail-kind]");
      if (!detail) return;
      event.preventDefault();
      openDetailElement(detail, !byId("detailModal").hidden && byId("detailModal").contains(detail));
    });
    byId("backButton").addEventListener("click", window.TurboTigerIEHandleBack);
    window.addEventListener("popstate", function () {
      if (!byId("detailModal").hidden) closeDetail();
      else if (state.activeTab !== "home") activateTab("home");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupEvents();
    if (!hasBridge()) {
      byId("loadingStatus").textContent = friendlyError(new Error("app_session_unavailable"));
      showApp(false);
      return;
    }
    loadAll(false);
  });
})();
