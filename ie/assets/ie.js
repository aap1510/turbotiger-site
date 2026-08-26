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

  var ALERT_TIMES = [15, 30, 60, 120];

  var state = {
    session: null,
    bootstrap: null,
    card: null,
    games: { live: [], upcoming: [], results: [] },
    news: [],
    activeTab: "home",
    previousTab: "home",
    homeSectionFilter: "",
    settingsContext: "",
    gameFilter: "live",
    catalog: { participants: [], competitions: [] },
    catalogRequestId: 0,
    selectionChanges: {},
    favorites: [],
    favoriteOrder: [],
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
    var parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
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
    state.games = { live: [], upcoming: [], results: [] };
    state.news = [];
    state.catalog = { participants: [], competitions: [] };
    state.catalogRequestId += 1;
    state.selectionChanges = {};
    state.favorites = [];
    state.favoriteOrder = [];
    state.loading = false;
    if (byId("detailModal")) closeDetail();
    if (byId("ieApp")) showApp(false);
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
    var participants = [
      { nome: "Flamengo", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Palmeiras", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Corinthians", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "São Paulo", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Santos", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Grêmio", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Internacional", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Atlético-MG", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "River Plate", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 2 },
      { nome: "Arsenal", id_esporte: 1, esporte_nome: "Futebol", id_continente: 2, id_pais: 3 },
      { nome: "Chelsea", id_esporte: 1, esporte_nome: "Futebol", id_continente: 2, id_pais: 3 },
      { nome: "Sesi Franca", id_esporte: 2, esporte_nome: "Basquete", id_continente: 1, id_pais: 1 },
      { nome: "Minas Tênis Clube", id_esporte: 3, esporte_nome: "Vôlei", id_continente: 1, id_pais: 1 }
    ].map(function (item, index) {
      return Object.assign({}, item, { id: index + 1, id_participante: index + 1, tipo_alvo: "participante", acompanhar: index < 3, notificar: index < 2 });
    });
    var competitions = [
      { nome: "Brasileirão Série A", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Copa do Brasil", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "CONMEBOL Libertadores", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: null },
      { nome: "Sul-Americana", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: null },
      { nome: "Paulistão", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Carioca", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 1 },
      { nome: "Liga Profissional Argentina", id_esporte: 1, esporte_nome: "Futebol", id_continente: 1, id_pais: 2 },
      { nome: "Premier League", id_esporte: 1, esporte_nome: "Futebol", id_continente: 2, id_pais: 3 },
      { nome: "NBB", id_esporte: 2, esporte_nome: "Basquete", id_continente: 1, id_pais: 1 },
      { nome: "Superliga", id_esporte: 3, esporte_nome: "Vôlei", id_continente: 1, id_pais: 1 }
    ].map(function (item, index) {
      return Object.assign({}, item, { id: index + 101, id_competicao: index + 101, tipo_alvo: "competicao", acompanhar: index < 2 });
    });
    if (name === "ie_central_bootstrap_rpc") return Promise.resolve({ ok: true, preferencias: { id_esporte_favorito: 1, notificacoes_ativas: true }, alertas: { ativo: true, antecedencias_minutos: [30, 60], tipos_evento: ["pre_inicio", "gol", "encerramento"] }, selecoes: participants.filter(function (item) { return item.acompanhar || item.notificar; }).concat(competitions.filter(function (item) { return item.acompanhar; })), filtros: {}, catalogo: { esportes: [{ id: 1, nome: "Futebol", codigo: "football" }, { id: 2, nome: "Basquete", codigo: "basketball" }, { id: 3, nome: "Vôlei", codigo: "volleyball" }], continentes: [{ id: 1, nome: "América do Sul" }, { id: 2, nome: "Europa" }], paises: [{ id: 1, nome: "Brasil", id_continente: 1 }, { id: 2, nome: "Argentina", id_continente: 1 }, { id: 3, nome: "Inglaterra", id_continente: 2 }], antecedencias_alerta: ALERT_TIMES.map(function (minutes) { return { minutos: minutes, nome: minutes + " min" }; }), tipos_alerta: ALERT_EVENTS.map(function (item) { return { codigo: item.code, nome: item.label }; }) } });
    if (name === "ie_competicao_detalhe_rpc") return Promise.resolve({ ok: true, competicao: { id_competicao: payload.p_id_competicao, nome: "Campeonato Brasileiro Série A", temporada: "2026", fase_atual: "Temporada regular", data_inicio: "2026-03-28", data_fim: "2026-12-06" }, times_classificados: participants.map(function (item, index) { return { id_participante: item.id_participante, nome: item.nome, sigla: item.sigla, imagem_url: item.imagem_url, posicao: index + 1 }; }) });
    if (name === "ie_card_resumo_rpc") return Promise.resolve({ ok: true, configurado: true, generated_at: now.toISOString(), subcards: [
      { codigo: "partidas", titulo: "Partidas", itens: matches },
      { codigo: "campeonatos", titulo: "Campeonato", itens: [{ id_competicao: 101, nome: "Brasileirão · Série A", classificacao: [{ posicao: 1, nome: "Palmeiras", pontos: 16 }, { posicao: 2, nome: "Flamengo", pontos: 16 }] }] },
      { codigo: "noticias", titulo: "Notícias", itens: [{ id_noticia: 501, titulo: "Clubes se preparam para a próxima rodada do campeonato nacional", resumo: "Informações atualizadas sobre as equipes acompanhadas.", fonte_nome: "Fonte esportiva", publicado_em: now.toISOString(), url_original: "https://example.com/noticia" }] },
      { codigo: "cotacoes", titulo: "Cotações informativas", itens: [{ id_evento: 102, casa: 2.35, empate: 3.2, fora: 2.9, operador: "Média de 6 casas", fonte: "Média do mercado", quantidade_casas: 6, atualizado_em: now.toISOString() }] },
      { codigo: "analises", titulo: "Probabilidade estatística", itens: [{ tipo: "probabilidade_1x2", id_evento: 102, probabilidade_casa: 41, probabilidade_empate: 29, probabilidade_fora: 30, atualizado_em: now.toISOString() }] }
    ] });
    if (name === "ie_partidas_listar_rpc") return Promise.resolve({ ok: true, itens: payload.p_secao === "proximos" ? [matches[1]] : payload.p_secao === "resultados" ? [] : [matches[0]] });
    if (name === "ie_noticias_listar_rpc") return Promise.resolve({ ok: true, itens: [{ id_noticia: 501, titulo: "Clubes se preparam para a próxima rodada do campeonato nacional", resumo: "Informações atualizadas sobre os times que você acompanha.", fonte_nome: "Fonte esportiva", publicado_em: now.toISOString(), url_original: "https://example.com/noticia" }] });
    if (name === "ie_catalogo_buscar_rpc") {
      var catalogItems = payload.p_tipo === "competicao" || payload.p_tipo === "competicoes" || payload.p_tipo === "campeonato" || payload.p_tipo === "campeonatos" ? competitions : participants;
      var normalizedSearch = String(payload.p_busca || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      var filteredItems = catalogItems.filter(function (item) {
        var normalizedName = String(item.nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return (!payload.p_id_esporte || Number(item.id_esporte) === Number(payload.p_id_esporte))
          && (!payload.p_id_continente || Number(item.id_continente) === Number(payload.p_id_continente))
          && (!payload.p_id_pais || Number(item.id_pais) === Number(payload.p_id_pais))
          && (!normalizedSearch || normalizedName.indexOf(normalizedSearch) >= 0);
      });
      var offset = Math.max(0, Number(payload.p_offset) || 0);
      return Promise.resolve({ ok: true, itens: filteredItems.slice(offset, offset + Math.max(1, Number(payload.p_limite) || 50)) });
    }
    if (name === "ie_favoritos_listar_rpc") return Promise.resolve({ ok: true, itens: participants.filter(function (item) { return item.acompanhar; }).map(function (item, index) { return Object.assign({}, item, { ordem: index + 1 }); }) });
    if (name === "ie_favoritos_ordenar_rpc") return Promise.resolve({ ok: true, itens: arrayOf(payload.p_ids_participantes).map(function (id, index) { var item = participants.find(function (participant) { return Number(participant.id_participante) === Number(id); }) || {}; return Object.assign({}, item, { ordem: index + 1 }); }) });
    if (name === "ie_confronto_evento_rpc") return Promise.resolve({
      time_a: { id: 4, nome: "São Paulo", sigla: "SAO" }, time_b: { id: 2, nome: "Palmeiras", sigla: "PAL" },
      resumo: { jogos: 350, vitorias_time_a: 121, empates: 110, vitorias_time_b: 119, percentual_time_a: 34.6, percentual_empates: 31.4, percentual_time_b: 34.0 },
      mando_time_a: { jogos: 180, vitorias_time_a: 74, empates: 58, vitorias_time_b: 48 },
      mando_time_b: { jogos: 170, vitorias_time_a: 47, empates: 52, vitorias_time_b: 71 },
      desempenho_time_a: { casa: { jogos: 180, vitorias: 74, empates: 58, derrotas: 48, percentual_vitorias: 41.1, aproveitamento: 51.9 }, fora: { jogos: 170, vitorias: 47, empates: 52, derrotas: 71, percentual_vitorias: 27.6, aproveitamento: 37.8 } },
      desempenho_time_b: { casa: { jogos: 170, vitorias: 71, empates: 52, derrotas: 47, percentual_vitorias: 41.8, aproveitamento: 52.0 }, fora: { jogos: 180, vitorias: 48, empates: 58, derrotas: 74, percentual_vitorias: 26.7, aproveitamento: 37.4 } },
      competicoes: [{ competicao: "Campeonato Paulista", jogos: 240 }, { competicao: "Campeonato Brasileiro", jogos: 92 }],
      jogos: [{ id: 1, data: "2026-03-15", competicao: "Campeonato Brasileiro", time_casa: "São Paulo", time_fora: "Palmeiras", placar_casa: 1, placar_fora: 1 }],
      aviso: "Estatística baseada nos confrontos históricos disponíveis. Resultados passados não garantem resultados futuros."
    });
    if (name === "ie_desempenho_geral_evento_rpc") return Promise.resolve({
      time_a: { id: 4, nome: "São Paulo", sigla: "SAO" }, time_b: { id: 2, nome: "Palmeiras", sigla: "PAL" },
      desempenho_time_a: { casa: { jogos: 2850, vitorias: 1732, empates: 654, derrotas: 464, percentual_vitorias: 60.8, aproveitamento: 68.4 }, fora: { jogos: 2520, vitorias: 1189, empates: 701, derrotas: 630, percentual_vitorias: 47.2, aproveitamento: 56.5 } },
      desempenho_time_b: { casa: { jogos: 2920, vitorias: 1810, empates: 646, derrotas: 464, percentual_vitorias: 62.0, aproveitamento: 69.6 }, fora: { jogos: 2580, vitorias: 1268, empates: 704, derrotas: 608, percentual_vitorias: 49.1, aproveitamento: 57.9 } },
      escopo: "Todos os jogos oficiais disponíveis na base, independentemente do adversário."
    });
    if (name === "ie_base_futebol_brasil_resumo_rpc") return Promise.resolve({
      titulo: "Base própria — Futebol do Brasil", modalidade: "Futebol", pais: "Brasil",
      total_registros: 297076, total_competicoes: 1055, total_times: 21365, atualizado_em: now.toISOString()
    });
    if (name === "ie_partida_detalhe_rpc") {
      return Promise.resolve({
        ok: true,
        evento: matches.find(function (item) { return Number(item.id_evento) === Number(payload.p_id_evento); }) || matches[0],
        linha_tempo: [],
        estatisticas: [],
        escalacoes: [],
        classificacao: [],
        odds: [
          { mercado: "Resultado 1X2", selecao: "Casa", valor: 1.78, operador: "Winamax", fonte: "the-odds-api.com", observado_em: "2026-08-26T11:00:00Z" },
          { mercado: "Resultado 1X2", selecao: "Empate", valor: 3.30, operador: "Winamax", fonte: "the-odds-api.com", observado_em: "2026-08-26T11:00:00Z" },
          { mercado: "Resultado 1X2", selecao: "Fora", valor: 3.95, operador: "Winamax", fonte: "the-odds-api.com", observado_em: "2026-08-26T11:00:00Z" },
          { mercado: "Resultado 1X2", selecao: "Casa", valor: 1.82, operador: "Pinnacle", fonte: "the-odds-api.com", observado_em: "2026-08-26T11:00:00Z" },
          { mercado: "Resultado 1X2", selecao: "Empate", valor: 3.25, operador: "Pinnacle", fonte: "the-odds-api.com", observado_em: "2026-08-26T11:00:00Z" },
          { mercado: "Resultado 1X2", selecao: "Fora", valor: 4.05, operador: "Pinnacle", fonte: "the-odds-api.com", observado_em: "2026-08-26T11:00:00Z" }
        ],
        odds_aviso: "Informação esportiva neutra, sem indicação ou direcionamento para apostas.",
        noticias: []
      });
    }
    return Promise.resolve({ ok: true });
  }

  function cacheKey() {
    return CONFIG.cachePrefix + (state.session && state.session.user_id || "anonymous");
  }

  function saveCache() {
    if (CONFIG.preview) return;
    try {
      sessionStorage.setItem(cacheKey(), JSON.stringify({ saved_at: new Date().toISOString(), bootstrap: state.bootstrap, card: state.card, games: state.games, news: state.news, favorites: state.favorites }));
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

  function renderMatchCard(item, label) {
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
    return "<article class=\"ie-feed-card ie-wide" + (live ? " is-live" : "") + "\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon(live ? "live" : "clock") + "</span>" + escapeHtml(label || (live ? "Ao vivo" : "Partida")) + "</span>" + detailButton("event", id, "", sides.home.name + " x " + sides.away.name) + "</div><div class=\"ie-match\"><div class=\"ie-side\">" + logoHtml(sides.home.logo, sides.home.name, "", sides.home.abbreviation) + "<strong>" + escapeHtml(sides.home.name) + "</strong></div><div class=\"ie-match-center\">" + center + "</div><div class=\"ie-side\">" + logoHtml(sides.away.logo, sides.away.name, "", sides.away.abbreviation) + "<strong>" + escapeHtml(sides.away.name) + "</strong></div></div><div class=\"ie-meta\"><span>" + escapeHtml(item.competicao_nome || item.competicao || "") + "</span></div></article>";
  }

  function renderNewsCard(item) {
    var id = item.id_noticia || item.id || "";
    var url = item.url_original || item.url || "";
    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("news") + "</span>Notícias</span>" + detailButton("news", id, url, item.titulo) + "</div><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Notícia esportiva") + "</h3>" + (item.resumo || item.descricao ? "<p class=\"ie-news-description\">" + escapeHtml(item.resumo || item.descricao) + "</p>" : "") + "<span class=\"ie-source\">Fonte: " + escapeHtml(item.fonte_nome || item.fonte || "não informada") + (item.publicado_em ? " · " + escapeHtml(formatDateTime(item.publicado_em)) : "") + "</span></article>";
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
    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>" + (prediction ? "Probabilidade estatística" : "Cotações informativas") + "</span>" + detailButton("event", item.id_evento || item.id_partida || "") + "</div><div class=\"ie-stat-row\"><span>" + labels[0] + "<strong>" + escapeHtml(values[0] == null ? "—" : values[0] + suffix) + "</strong></span><span>" + labels[1] + "<strong>" + escapeHtml(values[1] == null ? "—" : values[1] + suffix) + "</strong></span><span>" + labels[2] + "<strong>" + escapeHtml(values[2] == null ? "—" : values[2] + suffix) + "</strong></span></div>" + (prediction ? "<p class=\"ie-disclaimer\">Estimativa estatística. Não representa recomendação nem garantia de resultado.</p>" : "<p class=\"ie-disclaimer\">Informação neutra, sem indicação ou direcionamento para apostas.</p>") + "</article>";
  }

  function renderAnalysisCard(item) {
    var type = String(item.tipo || item.tipo_analise || item.kind || "").toLowerCase();
    if (type === "resumo_personalizado" || item.proximos !== undefined || item.ao_vivo !== undefined || item.encerrados !== undefined) {
      return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>Análises</span>" + detailButton("analysis", item.id_evento || item.id || "") + "</div><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Resumo dos seus acompanhamentos") + "</h3><div class=\"ie-stat-row\"><span>Próximos<strong>" + escapeHtml(numberOf(item.proximos, 0)) + "</strong></span><span>Ao vivo<strong>" + escapeHtml(numberOf(item.ao_vivo, 0)) + "</strong></span><span>Encerrados<strong>" + escapeHtml(numberOf(item.encerrados, 0)) + "</strong></span></div><p class=\"ie-disclaimer\">Resumo informativo das suas seleções esportivas.</p></article>";
    }

    var probabilityType = /probabil|predi|estimativa/.test(type);
    var explicitProbability = item.probabilidade_casa !== undefined || item.probabilidade_empate !== undefined || item.probabilidade_fora !== undefined;
    var probabilityValues = explicitProbability ? [item.probabilidade_casa, item.probabilidade_empate, item.probabilidade_fora] : [item.casa, item.empate, item.fora];
    var completeProbability = probabilityValues.every(function (value) { return value !== null && value !== undefined && value !== ""; });
    if ((probabilityType || explicitProbability) && completeProbability) return renderOddsCard(item, true);

    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("chart") + "</span>Análises</span>" + detailButton("analysis", item.id_evento || item.id || "") + "</div><h3 class=\"ie-news-title\">" + escapeHtml(item.titulo || "Análise esportiva") + "</h3>" + (item.resumo || item.descricao ? "<p class=\"ie-news-description\">" + escapeHtml(item.resumo || item.descricao) + "</p>" : "") + "<p class=\"ie-disclaimer\">Estimativas, quando disponíveis, são estatísticas e não representam recomendação nem garantia de resultado.</p></article>";
  }

  function renderCompetitionCard(item) {
    var rows = arrayOf(item.classificacao || item.posicoes).slice(0, 4);
    var period = [item.data_inicio ? "Início " + formatDate(item.data_inicio) : "", item.data_fim ? "Fim " + formatDate(item.data_fim) : ""].filter(Boolean).join(" • ");
    var summary = (item.fase_atual ? "<p class=\"ie-news-description\"><strong>" + escapeHtml(item.fase_atual) + "</strong></p>" : "") + (period ? "<span class=\"ie-source\">" + escapeHtml(period) + "</span>" : "");
    var body = rows.length ? "<div class=\"ie-standings\">" + rows.map(function (row) { return "<div class=\"ie-standing-row\"><span>" + escapeHtml(row.posicao || row.rank || "—") + "</span><strong>" + escapeHtml(row.nome || row.time_nome || row.participante_nome || "") + "</strong><strong>" + escapeHtml(row.pontos == null ? "" : row.pontos) + "</strong></div>"; }).join("") + "</div>" : summary || "<p class=\"ie-news-description\">Calendário em atualização.</p>";
    return "<article class=\"ie-feed-card\"><div class=\"ie-feed-head\"><span class=\"ie-feed-label\"><span class=\"ie-feed-icon\">" + icon("trophy") + "</span>Campeonato</span>" + detailButton("competition", item.id_competicao || item.id || "", "", item.nome) + "</div><h3 class=\"ie-news-title\">" + escapeHtml(item.nome || item.competicao_nome || "Campeonato") + "</h3>" + body + "</article>";
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

  function renderHome() {
    var card = state.card || {};
    var configured = card.configurado !== false && !!(state.bootstrap && (state.bootstrap.preferencias && state.bootstrap.preferencias.id_esporte_favorito || arrayOf(state.bootstrap.selecoes).length));
    var favorite = favoriteSport();
    var filteredSection = String(state.homeSectionFilter || "").toLowerCase();
    var sectionTitles = { cotacoes: "Cotações informativas", analises: "Análises estatísticas" };
    byId("favoriteSportTitle").textContent = sectionTitles[filteredSection] || (favorite ? favorite.nome : "Seu esporte favorito");
    byId("favoriteSportIcon").textContent = filteredSection === "cotacoes" ? "C/E/F" : filteredSection === "analises" ? "∑" : (favorite ? initials(favorite.nome) : "●");
    if (!configured) {
      byId("homeContent").innerHTML = emptyState("Escolha seus esportes", "Defina um esporte favorito e acompanhe os times, participantes e campeonatos que realmente interessam a você.", true);
      return;
    }
    var html = [];
    arrayOf(card.subcards).filter(function (subcard) { return subcardMatchesSection(subcard, filteredSection); }).forEach(function (subcard) {
      var code = String(subcard.codigo || subcard.tipo || "").toLowerCase();
      arrayOf(subcard.itens).slice(0, 3).forEach(function (item) {
        if (code.indexOf("notic") >= 0) html.push(renderNewsCard(item));
        else if (code.indexOf("cotac") >= 0 || code.indexOf("odd") >= 0) html.push(renderOddsCard(item, false));
        else if (code.indexOf("analis") >= 0 || code.indexOf("pred") >= 0 || code.indexOf("prob") >= 0) html.push(renderAnalysisCard(item));
        else if (code.indexOf("camp") >= 0 || code.indexOf("class") >= 0) html.push(renderCompetitionCard(item));
        else html.push(renderMatchCard(item, subcard.titulo));
      });
    });
    byId("homeContent").innerHTML = html.join("") || emptyState("Nenhuma informação disponível", filteredSection ? "Esta seção ainda não possui dados atualizados para suas escolhas." : "Os dados do seu esporte favorito ainda não foram atualizados pela fonte.", false);
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
      return "<div class=\"ie-selection-row\">" + logoHtml(item.imagem_url || item.logo_url || item.logo, item.nome, "ie-entity-logo") + "<strong>" + escapeHtml(item.nome || item.nome_exibicao || "") + "</strong><div class=\"ie-selection-actions\"><button class=\"ie-selection-action" + (follow ? " is-active" : "") + "\" type=\"button\" data-selection-key=\"" + escapeHtml(key) + "\" data-selection-kind=\"follow\" aria-label=\"Acompanhar\" aria-pressed=\"" + follow + "\">" + icon("star") + "</button>" + (targetType === "participant" ? "<button class=\"ie-selection-action" + (notify ? " is-active" : "") + "\" type=\"button\" data-selection-key=\"" + escapeHtml(key) + "\" data-selection-kind=\"notify\" aria-label=\"Notificar\" aria-pressed=\"" + notify + "\">" + icon("bell") + "</button>" : "") + "</div></div>";
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
    arrayOf(state.catalog.participants).forEach(function (item) { add(item); });

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

  function renderFavoriteOrder() {
    var items = orderedFavoriteParticipants();
    byId("favoriteOrderList").innerHTML = items.length ? items.map(function (item, index) {
      var id = Number(item.id_participante);
      return "<div class=\"ie-favorite-order-row\"><span class=\"ie-favorite-position\">" + (index + 1) + "</span>" + logoHtml(item.imagem_url || item.logo_url || item.logo, item.nome, "ie-entity-logo") + "<strong>" + escapeHtml(item.nome || item.nome_exibicao || "Time") + "</strong><div class=\"ie-favorite-order-actions\"><button type=\"button\" data-favorite-id=\"" + id + "\" data-favorite-direction=\"up\" aria-label=\"Subir " + escapeHtml(item.nome || "time") + "\"" + (index === 0 ? " disabled" : "") + ">↑</button><button type=\"button\" data-favorite-id=\"" + id + "\" data-favorite-direction=\"down\" aria-label=\"Descer " + escapeHtml(item.nome || "time") + "\"" + (index === items.length - 1 ? " disabled" : "") + ">↓</button></div></div>";
    }).join("") : emptyState("Nenhum time favorito", "Marque a estrela dos times que deseja acompanhar.", false);
  }

  function renderSelectionLists() {
    byId("teamSelectionList").innerHTML = selectionRows("participant") || emptyState("Nenhum resultado", "Ajuste os filtros ou a busca.", false);
    byId("competitionSelectionList").innerHTML = selectionRows("competition") || emptyState("Nenhum resultado", "Ajuste os filtros ou a busca.", false);
    var merged = Object.assign({}, selectionMap(), state.selectionChanges);
    var teamCount = Object.keys(merged).filter(function (key) { return key.indexOf("participant:") === 0 && merged[key].acompanhar; }).length;
    var competitionCount = Object.keys(merged).filter(function (key) { return key.indexOf("competition:") === 0 && merged[key].acompanhar; }).length;
    byId("teamSelectionCount").textContent = teamCount + " selecionado" + (teamCount === 1 ? "" : "s");
    byId("competitionSelectionCount").textContent = competitionCount + " selecionado" + (competitionCount === 1 ? "" : "s");
    renderFavoriteOrder();
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
    renderHome();
    renderGames();
    renderNews();
    renderEntities();
    renderSettings();
    var generated = state.card && (state.card.generated_at || state.card.gerado_em) || new Date().toISOString();
    setFreshness(generated);
  }

  async function loadCatalog() {
    var requestId = ++state.catalogRequestId;
    var sport = byId("sportSelect") ? byId("sportSelect").value : "";
    var continent = byId("continentSelect") ? byId("continentSelect").value : "";
    var country = byId("countrySelect") ? byId("countrySelect").value : "";
    var teamSearch = byId("teamSearch") ? byId("teamSearch").value.trim() : "";
    var competitionSearch = byId("competitionSearch") ? byId("competitionSearch").value.trim() : "";
    var results = await Promise.all([
      rpc("ie_catalogo_buscar_rpc", { p_tipo: "participante", p_busca: teamSearch || null, p_id_esporte: sport ? Number(sport) : null, p_id_continente: continent ? Number(continent) : null, p_id_pais: country ? Number(country) : null, p_limite: 50, p_offset: 0 }),
      rpc("ie_catalogo_buscar_rpc", { p_tipo: "competicao", p_busca: competitionSearch || null, p_id_esporte: sport ? Number(sport) : null, p_id_continente: continent ? Number(continent) : null, p_id_pais: country ? Number(country) : null, p_limite: 50, p_offset: 0 })
    ]);
    if (requestId !== state.catalogRequestId) return;
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
        rpc("ie_noticias_listar_rpc", { p_limite: 30, p_offset: 0 }),
        rpc("ie_favoritos_listar_rpc", {})
      ]);
      state.bootstrap = results[0] || {};
      state.card = results[1] || {};
      state.games.live = arrayOf(results[2]);
      state.games.upcoming = arrayOf(results[3]);
      state.games.results = arrayOf(results[4]);
      state.news = arrayOf(results[5]);
      state.favorites = arrayOf(results[6]);
      state.favoriteOrder = state.favorites.map(function (item) { return Number(item.id_participante); }).filter(function (id) { return id > 0; });
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
        state.favorites = cached.favorites || [];
        state.favoriteOrder = state.favorites.map(function (item) { return Number(item.id_participante); }).filter(function (id) { return id > 0; });
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
    byId("settingsButton").classList.toggle("is-active", tab === "settings");
    byId("settingsButton").setAttribute("aria-pressed", tab === "settings" ? "true" : "false");
    byId("backButton").classList.toggle("is-hidden-home", tab === "home");
    all("[data-panel]").forEach(function (panel) {
      var active = panel.getAttribute("data-panel") === tab;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function settingsContextDefinition(context) {
    var definitions = {
      partidas: { label: "Partidas", target: "settingsParticipants" },
      campeonatos: { label: "Campeonatos", target: "settingsCompetitions" },
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
    var filter = state.games.live.length ? "live" : state.games.upcoming.length ? "upcoming" : state.games.results.length ? "results" : "live";
    state.gameFilter = filter;
    all("[data-game-filter]").forEach(function (button) { button.classList.toggle("is-active", button.getAttribute("data-game-filter") === filter); });
    renderGames();
  }

  function applyInitialRoute() {
    var params = new URLSearchParams(location.search);
    var section = String(params.get("secao") || "").toLowerCase();
    var context = String(params.get("contexto") || "").toLowerCase();
    if (section === "configuracoes") openSettings(context, true);
    else if (section === "partidas" || section === "jogos") { activateTab("games"); chooseAvailableGameFilter(); }
    else if (section === "campeonatos") activateTab("competitions");
    else if (section === "times") activateTab("teams");
    else if (section === "noticias") activateTab("news");
    else if (section === "cotacoes" || section === "analises") {
      state.homeSectionFilter = section;
      activateTab("home");
      renderHome();
    }
    var eventId = Number(params.get("id_evento") || 0);
    var competitionId = Number(params.get("id_competicao") || 0);
    if (eventId > 0) openEventDetail(eventId, "Detalhes da partida");
    else if (competitionId > 0) openCompetitionDetail(competitionId, "Detalhes do campeonato");
  }

  function closeDetail() {
    byId("detailModal").hidden = true;
    document.body.style.overflow = "";
  }

  window.TurboTigerIEHandleBack = function () {
    if (!byId("detailModal").hidden) {
      closeDetail();
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
    var competitionsHtml = competitions.length ? "<div class=\"ie-h2h-competitions\">" + competitions.map(function (item) { return "<div><span>" + escapeHtml(item.competicao || "Competição") + "</span><strong>" + escapeHtml(numberOf(item.jogos, 0)) + " jogos</strong></div>"; }).join("") + "</div>" : "";
    var games = arrayOf(data.jogos);
    var gamesHtml = games.length ? "<div class=\"ie-h2h-games\">" + games.map(function (game) { return "<div><time>" + escapeHtml(formatDate(game.data)) + "</time><span><b>" + escapeHtml(game.time_casa) + "</b> " + escapeHtml(game.placar_casa) + " – " + escapeHtml(game.placar_fora) + " <b>" + escapeHtml(game.time_fora) + "</b><small>" + escapeHtml(game.competicao || "") + "</small></span></div>"; }).join("") + "</div>" : "";
    var performanceHtml = data.desempenho_time_a && data.desempenho_time_b ? "<div class=\"ie-performance-compare\">" + performanceBlock(teamA, data.desempenho_time_a) + performanceBlock(teamB, data.desempenho_time_b) + "</div>" : "";
    var general = data.desempenho_geral || {};
    var generalHtml = general.desempenho_time_a && general.desempenho_time_b ? "<p class=\"ie-performance-scope\">" + escapeHtml(general.escopo || "Todos os jogos oficiais disponíveis, independentemente do adversário.") + "</p><div class=\"ie-performance-compare\">" + performanceBlock(teamA, general.desempenho_time_a) + performanceBlock(teamB, general.desempenho_time_b) + "</div>" : "";
    return "<div class=\"ie-h2h\">" + overall + resultGrid(homeA, "Com mando de " + (teamA.nome || "Time A")) + resultGrid(homeB, "Com mando de " + (teamB.nome || "Time B")) + (performanceHtml ? detailSection("Somente neste confronto: casa e fora", performanceHtml) : "") + (generalHtml ? detailSection("Desempenho geral: casa e fora", generalHtml) : "") + (competitionsHtml ? detailSection("Competições", competitionsHtml) : "") + (gamesHtml ? detailSection("Confrontos mais recentes", gamesHtml) : "") + "<p class=\"ie-h2h-notice\">" + escapeHtml(data.aviso || "Resultados passados não garantem resultados futuros.") + "</p></div>";
  }

  function renderBrazilDatabaseSummary(data) {
    if (!data || data.pais !== "Brasil" || data.modalidade !== "Futebol") return "";
    function total(value) { return numberOf(value, 0).toLocaleString("pt-BR"); }
    return "<section class=\"ie-database-summary\"><div><span>Base própria</span><strong>Futebol do Brasil</strong><small>Acervo histórico organizado pelo Turbo Tiger</small></div><dl><div><dt>Partidas</dt><dd>" + escapeHtml(total(data.total_registros)) + "</dd></div><div><dt>Campeonatos</dt><dd>" + escapeHtml(total(data.total_competicoes)) + "</dd></div><div><dt>Times</dt><dd>" + escapeHtml(total(data.total_times)) + "</dd></div></dl></section>";
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
      try {
        var historical = await rpc("ie_confronto_evento_rpc", { p_id_evento: Number(id), p_limite: 20, p_offset: 0 });
        try { historical.desempenho_geral = await rpc("ie_desempenho_geral_evento_rpc", { p_id_evento: Number(id) }); } catch (generalError) { /* desempenho geral pode não estar mapeado */ }
        html += detailSection("Histórico do confronto", renderHistoricalComparison(historical));
      } catch (historicalError) { /* histórico pode não estar mapeado para este esporte ou participante */ }
      byId("detailContent").innerHTML = html;
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Detalhes indisponíveis", friendlyError(error), false);
    }
  }

  function openGenericDetail(kind, id, title) {
    byId("detailTitle").textContent = title || "Detalhes";
    byId("detailSubtitle").textContent = kind === "competition" ? "Campeonato acompanhado" : kind === "analysis" ? "Resumo estatístico personalizado" : "Time ou participante acompanhado";
    byId("detailContent").innerHTML = emptyState("Informações completas na central", kind === "analysis" ? "As análises usam somente os dados disponíveis para as suas seleções e não representam recomendação nem garantia de resultado." : "As próximas partidas, resultados e dados relacionados ficam disponíveis nas áreas correspondentes.", false);
    byId("detailModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  async function openAnalysisDetail(id, title) {
    if (!Number(id)) { openGenericDetail("analysis", id, title); return; }
    byId("detailTitle").textContent = title || "Análises estatísticas";
    byId("detailSubtitle").textContent = "Carregando histórico do confronto...";
    byId("detailContent").innerHTML = "<div class=\"ie-empty\"><span class=\"ie-spinner\"></span></div>";
    byId("detailModal").hidden = false;
    document.body.style.overflow = "hidden";
    try {
      var data = await rpc("ie_confronto_evento_rpc", { p_id_evento: Number(id), p_limite: 20, p_offset: 0 });
      try { data.desempenho_geral = await rpc("ie_desempenho_geral_evento_rpc", { p_id_evento: Number(id) }); } catch (generalError) { /* desempenho geral pode não estar mapeado */ }
      var baseSummary = null;
      try { baseSummary = await rpc("ie_base_futebol_brasil_resumo_rpc", {}); } catch (baseError) { /* selo da base não bloqueia as estatísticas */ }
      byId("detailTitle").textContent = (data.time_a && data.time_a.nome || "Time A") + " × " + (data.time_b && data.time_b.nome || "Time B");
      byId("detailSubtitle").textContent = "Histórico completo do confronto";
      byId("detailContent").innerHTML = renderBrazilDatabaseSummary(baseSummary) + renderHistoricalComparison(data);
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Análise indisponível", friendlyError(error), false);
    }
  }

  async function openCompetitionDetail(id, title) {
    byId("detailTitle").textContent = title || "Detalhes do campeonato";
    byId("detailSubtitle").textContent = "Carregando informações...";
    byId("detailContent").innerHTML = "<div class=\"ie-empty\"><span class=\"ie-spinner\"></span></div>";
    byId("detailModal").hidden = false;
    document.body.style.overflow = "hidden";
    try {
      var data = await rpc("ie_competicao_detalhe_rpc", { p_id_competicao: Number(id) });
      var competition = data && data.competicao || {};
      var teams = arrayOf(data && data.times_classificados);
      byId("detailTitle").textContent = competition.nome || title || "Campeonato";
      byId("detailSubtitle").textContent = [competition.temporada, competition.pais].filter(Boolean).join(" • ") || "Detalhes do campeonato";
      var overview = "<div class=\"ie-detail-list\">" + [
        ["Fase atual", competition.fase_atual || "Em atualização"],
        ["Início", competition.data_inicio ? formatDate(competition.data_inicio) : "Em atualização"],
        ["Fim", competition.data_fim ? formatDate(competition.data_fim) : "Em atualização"]
      ].map(function (row) { return "<div><span>" + escapeHtml(row[0]) + "</span><strong>" + escapeHtml(row[1]) + "</strong></div>"; }).join("") + "</div>";
      var teamHtml = teams.length ? "<div class=\"ie-detail-list\">" + teams.map(function (team) {
        return "<div><span>" + logoHtml(team.imagem_url, team.nome, "ie-entity-logo", team.sigla) + " " + escapeHtml(team.nome || "Time") + "</span><strong>" + escapeHtml(team.posicao ? team.posicao + "º" : team.grupo || team.sigla || "") + "</strong></div>";
      }).join("") + "</div>" : "<p>Os classificados ainda não foram disponibilizados pela fonte.</p>";
      byId("detailContent").innerHTML = detailSection("Informações do campeonato", overview) + detailSection("Times classificados na fase", teamHtml);
    } catch (error) {
      byId("detailContent").innerHTML = emptyState("Detalhes indisponíveis", friendlyError(error), false);
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
      changes.push(rpc("ie_esporte_favorito_salvar_rpc", { p_id_esporte: byId("favoriteSportSelect").value ? Number(byId("favoriteSportSelect").value) : null }));
      changes.push(rpc("ie_filtros_salvar_rpc", { p_ids_esportes: byId("sportSelect").value ? [Number(byId("sportSelect").value)] : [], p_ids_continentes: byId("continentSelect").value ? [Number(byId("continentSelect").value)] : [], p_ids_paises: byId("countrySelect").value ? [Number(byId("countrySelect").value)] : [] }));
      changes.push(rpc("ie_alertas_salvar_rpc", { p_ativo: byId("notificationsEnabled").checked, p_antecedencias_minutos: times, p_tipos_evento: events }));
      changes.push(rpc("ie_favoritos_ordenar_rpc", { p_ids_participantes: orderedFavoriteParticipants().map(function (item) { return Number(item.id_participante); }) }));
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
    byId("settingsButton").addEventListener("click", function () { openSettings("", true); });
    byId("closeButton").addEventListener("click", function () { if (!postNative("close", {})) history.back(); });
    all("[data-open-settings]").forEach(function (button) { button.addEventListener("click", function () { openSettings("", true); }); });
    all("[data-close-settings]").forEach(function (button) { button.addEventListener("click", window.TurboTigerIEHandleBack); });
    all("[data-tab]").forEach(function (button) { button.addEventListener("click", function () { activateTab(button.getAttribute("data-tab")); }); });
    all("[data-game-filter]").forEach(function (button) { button.addEventListener("click", function () { state.gameFilter = button.getAttribute("data-game-filter"); all("[data-game-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); renderGames(); }); });
    all("[data-close-detail]").forEach(function (button) { button.addEventListener("click", closeDetail); });
    byId("settingsForm").addEventListener("submit", saveSettings);
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
    document.addEventListener("click", function (event) {
      var settings = event.target.closest("[data-open-settings]");
      if (settings) { openSettings("", true); return; }
      var detail = event.target.closest("[data-detail-kind]");
      if (detail) {
        var kind = detail.getAttribute("data-detail-kind");
        if (kind === "news") openNewsSource(detail.getAttribute("data-detail-url"), detail.getAttribute("data-detail-title"));
        else if (kind === "event") openEventDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"));
        else if (kind === "competition") openCompetitionDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"));
        else if (kind === "analysis") openAnalysisDetail(detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"));
        else openGenericDetail(kind, detail.getAttribute("data-detail-id"), detail.getAttribute("data-detail-title"));
        return;
      }
      var favoriteMove = event.target.closest("[data-favorite-id]");
      if (favoriteMove) {
        var favoriteId = Number(favoriteMove.getAttribute("data-favorite-id"));
        var favoriteIndex = state.favoriteOrder.indexOf(favoriteId);
        var direction = favoriteMove.getAttribute("data-favorite-direction") === "up" ? -1 : 1;
        var targetIndex = favoriteIndex + direction;
        if (favoriteIndex >= 0 && targetIndex >= 0 && targetIndex < state.favoriteOrder.length) {
          var swapped = state.favoriteOrder[targetIndex];
          state.favoriteOrder[targetIndex] = favoriteId;
          state.favoriteOrder[favoriteIndex] = swapped;
          renderFavoriteOrder();
        }
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
    byId("backButton").addEventListener("click", window.TurboTigerIEHandleBack);
    window.addEventListener("popstate", function () {
      if (!byId("detailModal").hidden) closeDetail();
      else if (state.activeTab !== "home") activateTab("home");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupEvents();
    loadAll(false).then(applyInitialRoute);
  });
})();
