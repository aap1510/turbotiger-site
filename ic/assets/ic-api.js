(function (root, factory) {
  "use strict";
  var Core = root.TurboTigerIC && root.TurboTigerIC.Core;
  var api = factory(Core);
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Api = api;
}(typeof window !== "undefined" ? window : globalThis, function (Core) {
  "use strict";
  var RPC_PATTERN = /^ic_[a-z0-9_]+_rpc$/;
  var EDGE_FUNCTIONS = ["ic-coach"];
  var SUPABASE_URL = "https://jzqgudmvquokizvgehow.supabase.co";
  var PUBLISHABLE_KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";

  function publicHttpMessage(status) {
    if (status === 401) return "Sua sessão expirou. O aplicativo solicitará uma nova autenticação.";
    if (status === 403) return "Você não tem acesso a este conteúdo.";
    if (status === 404 || status === 406) return "A fachada segura desta área ainda não está disponível.";
    if (status === 409) return "O estado mudou enquanto você confirmava. Atualize e revise novamente.";
    if (status === 422 || status === 400) return "Os dados enviados não passaram pela validação.";
    if (status === 429) return "Muitas solicitações em sequência. Aguarde um instante.";
    return "Não foi possível concluir a solicitação agora.";
  }

  function create(options) {
    options = options || {};
    var inflight = new Map();
    var sequence = 0;

    function cancel(key) {
      var current = inflight.get(key);
      if (current) current.abort();
      inflight.delete(key);
    }

    function cancelAll() {
      inflight.forEach(function (controller) { controller.abort(); });
      inflight.clear();
    }

    async function rpc(name, parameters, requestOptions) {
      if (!RPC_PATTERN.test(name)) throw new Error("Fachada IC não permitida.");
      var session = options.getSession && options.getSession();
      if (!session || !session.accessToken) throw Object.assign(new Error("Sessão não disponível."), { code: "session_missing" });
      var epoch = options.getSessionEpoch ? options.getSessionEpoch() : 0;
      var settings = requestOptions || {};
      var requestKey = settings.key || name;
      if (settings.replace !== false) cancel(requestKey);
      var controller = new AbortController();
      var requestId = ++sequence;
      inflight.set(requestKey, controller);
      try {
        var response = await fetch(SUPABASE_URL + "/rest/v1/rpc/" + encodeURIComponent(name), {
          method: "POST",
          mode: "cors",
          cache: "no-store",
          credentials: "omit",
          redirect: "error",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Profile": "public",
            "Content-Profile": "public",
            "apikey": PUBLISHABLE_KEY,
            "Authorization": "Bearer " + session.accessToken
          },
          body: JSON.stringify(parameters || {})
        });
        var text = await response.text();
        var payload = text ? JSON.parse(text) : null;
        if (!response.ok) {
          throw Object.assign(new Error(publicHttpMessage(response.status)), { code: "http_" + response.status, status: response.status });
        }
        if (epoch !== (options.getSessionEpoch ? options.getSessionEpoch() : epoch)) throw Object.assign(new Error("Resposta de sessão anterior descartada."), { code: "stale_session" });
        var envelope = Core.normalizeEnvelope(payload);
        if (!envelope.ok) {
          var publicMessage = envelope.error && (envelope.error.public_message || envelope.error.mensagem_publica);
          throw Object.assign(new Error(publicMessage || "A operação não foi concluída."), { code: "rpc_error" });
        }
        return { data: envelope.data, meta: envelope.meta, version: envelope.version, requestId: requestId };
      } catch (error) {
        if (error && error.name === "AbortError") throw Object.assign(new Error("Requisição substituída."), { code: "aborted" });
        if (typeof navigator !== "undefined" && navigator.onLine === false) throw Object.assign(new Error("Sem conexão. Tente novamente quando estiver online."), { code: "offline" });
        if (error instanceof SyntaxError) throw Object.assign(new Error("Resposta inválida do servidor."), { code: "invalid_response" });
        throw error;
      } finally {
        if (inflight.get(requestKey) === controller) inflight.delete(requestKey);
      }
    }

    async function edge(name, payload, requestOptions) {
      if (EDGE_FUNCTIONS.indexOf(name) < 0) throw new Error("Edge Function IC não permitida.");
      var session = options.getSession && options.getSession();
      if (!session || !session.accessToken) throw Object.assign(new Error("Sessão não disponível."), { code: "session_missing" });
      var epoch = options.getSessionEpoch ? options.getSessionEpoch() : 0;
      var settings = requestOptions || {};
      var requestKey = settings.key || "edge:" + name;
      if (settings.replace !== false) cancel(requestKey);
      var controller = new AbortController();
      inflight.set(requestKey, controller);
      try {
        var response = await fetch(SUPABASE_URL + "/functions/v1/" + encodeURIComponent(name), {
          method: "POST",
          mode: "cors",
          cache: "no-store",
          credentials: "omit",
          redirect: "error",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "apikey": PUBLISHABLE_KEY,
            "Authorization": "Bearer " + session.accessToken
          },
          body: JSON.stringify(payload || {})
        });
        var text = await response.text();
        var result = text ? JSON.parse(text) : {};
        if (!response.ok || result.ok === false) throw Object.assign(new Error(publicHttpMessage(response.status)), { code: "edge_" + response.status, status: response.status });
        if (epoch !== (options.getSessionEpoch ? options.getSessionEpoch() : epoch)) throw Object.assign(new Error("Resposta de sessão anterior descartada."), { code: "stale_session" });
        return result;
      } catch (error) {
        if (error && error.name === "AbortError") throw Object.assign(new Error("Requisição substituída."), { code: "aborted" });
        if (typeof navigator !== "undefined" && navigator.onLine === false) throw Object.assign(new Error("Sem conexão. Tente novamente quando estiver online."), { code: "offline" });
        if (error instanceof SyntaxError) throw Object.assign(new Error("Resposta inválida do servidor."), { code: "invalid_response" });
        throw error;
      } finally {
        if (inflight.get(requestKey) === controller) inflight.delete(requestKey);
      }
    }

    return { rpc: rpc, edge: edge, cancel: cancel, cancelAll: cancelAll, isAllowedRpc: function (name) { return RPC_PATTERN.test(name); }, isAllowedEdge: function (name) { return EDGE_FUNCTIONS.indexOf(name) >= 0; } };
  }

  return { create: create, RPC_PATTERN: RPC_PATTERN, EDGE_FUNCTIONS: EDGE_FUNCTIONS.slice(), SUPABASE_URL: SUPABASE_URL };
}));
