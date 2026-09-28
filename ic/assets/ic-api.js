(function (root, factory) {
  "use strict";
  var Core = root.TurboTigerIC && root.TurboTigerIC.Core;
  var api = factory(Core, root);
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Api = api;
}(typeof window !== "undefined" ? window : globalThis, function (Core, root) {
  "use strict";

  var fontesLegendasAPI = {
    "legenda_ic_api_sessao_expirada": "Sua sessão expirou. O aplicativo solicitará uma nova autenticação.",
    "legenda_ic_api_sem_acesso": "Você não tem acesso a este conteúdo.",
    "legenda_ic_api_recurso_indisponivel": "A fachada segura desta área ainda não está disponível.",
    "legenda_ic_api_estado_alterado": "O estado mudou enquanto você confirmava. Atualize e revise novamente.",
    "legenda_ic_api_dados_invalidos": "Os dados enviados não passaram pela validação.",
    "legenda_ic_api_muitas_solicitacoes": "Muitas solicitações em sequência. Aguarde um instante.",
    "legenda_ic_api_solicitacao_nao_concluida": "Não foi possível concluir a solicitação agora.",
    "legenda_ic_api_consulta_nao_permitida": "Fachada IC não permitida.",
    "legenda_ic_api_sessao_indisponivel": "Sessão não disponível.",
    "legenda_ic_api_preferencias_alteradas": "Preferências alteradas em outra sessão.",
    "legenda_ic_api_resposta_sessao_anterior": "Resposta de sessão anterior descartada.",
    "legenda_ic_api_operacao_nao_concluida": "A operação não foi concluída.",
    "legenda_ic_api_requisicao_substituida": "Requisição substituída.",
    "legenda_ic_api_sem_conexao": "Sem conexão. Tente novamente quando estiver online.",
    "legenda_ic_api_resposta_invalida": "Resposta inválida do servidor.",
    "legenda_ic_api_servico_nao_permitido": "Edge Function IC não permitida."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasAPI);
  function legendaAPI(chave) { return root.TurboTigerLegendas ? root.TurboTigerLegendas.texto(chave) : fontesLegendasAPI[chave]; }

  var RPC_PATTERN = /^ic_[a-z0-9_]+_rpc$/;
  var EDGE_FUNCTIONS = ["ic-coach"];
  var SUPABASE_URL = "https://jzqgudmvquokizvgehow.supabase.co";
  var PUBLISHABLE_KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";

  function publicHttpMessage(status) {
    if (status === 401) return legendaAPI("legenda_ic_api_sessao_expirada");
    if (status === 403) return legendaAPI("legenda_ic_api_sem_acesso");
    if (status === 404 || status === 406) return legendaAPI("legenda_ic_api_recurso_indisponivel");
    if (status === 409) return legendaAPI("legenda_ic_api_estado_alterado");
    if (status === 422 || status === 400) return legendaAPI("legenda_ic_api_dados_invalidos");
    if (status === 429) return legendaAPI("legenda_ic_api_muitas_solicitacoes");
    return legendaAPI("legenda_ic_api_solicitacao_nao_concluida");
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
      if (!RPC_PATTERN.test(name)) throw new Error(legendaAPI("legenda_ic_api_consulta_nao_permitida"));
      var session = options.getSession && options.getSession();
      if (!session || !session.accessToken) throw Object.assign(new Error(legendaAPI("legenda_ic_api_sessao_indisponivel")), { code: "session_missing" });
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
          if (name === "ic_alertas_preferencias_salvar_rpc" && payload && payload.code === "40001") {
            throw Object.assign(new Error(legendaAPI("legenda_ic_api_preferencias_alteradas")), { code: "ic_alertas_conflito_revisao", status: response.status });
          }
          throw Object.assign(new Error(publicHttpMessage(response.status)), { code: "http_" + response.status, status: response.status });
        }
        if (epoch !== (options.getSessionEpoch ? options.getSessionEpoch() : epoch)) throw Object.assign(new Error(legendaAPI("legenda_ic_api_resposta_sessao_anterior")), { code: "stale_session" });
        var envelope = Core.normalizeEnvelope(payload);
        if (!envelope.ok) {
          var publicMessage = envelope.error && (envelope.error.public_message || envelope.error.mensagem_publica);
          throw Object.assign(new Error(publicMessage || legendaAPI("legenda_ic_api_operacao_nao_concluida")), { code: "rpc_error" });
        }
        return { data: envelope.data, meta: envelope.meta, version: envelope.version, requestId: requestId };
      } catch (error) {
        if (error && error.name === "AbortError") throw Object.assign(new Error(legendaAPI("legenda_ic_api_requisicao_substituida")), { code: "aborted" });
        if (typeof navigator !== "undefined" && navigator.onLine === false) throw Object.assign(new Error(legendaAPI("legenda_ic_api_sem_conexao")), { code: "offline" });
        if (error instanceof SyntaxError) throw Object.assign(new Error(legendaAPI("legenda_ic_api_resposta_invalida")), { code: "invalid_response" });
        throw error;
      } finally {
        if (inflight.get(requestKey) === controller) inflight.delete(requestKey);
      }
    }

    async function edge(name, payload, requestOptions) {
      if (EDGE_FUNCTIONS.indexOf(name) < 0) throw new Error(legendaAPI("legenda_ic_api_servico_nao_permitido"));
      var session = options.getSession && options.getSession();
      if (!session || !session.accessToken) throw Object.assign(new Error(legendaAPI("legenda_ic_api_sessao_indisponivel")), { code: "session_missing" });
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
        if (epoch !== (options.getSessionEpoch ? options.getSessionEpoch() : epoch)) throw Object.assign(new Error(legendaAPI("legenda_ic_api_resposta_sessao_anterior")), { code: "stale_session" });
        return result;
      } catch (error) {
        if (error && error.name === "AbortError") throw Object.assign(new Error(legendaAPI("legenda_ic_api_requisicao_substituida")), { code: "aborted" });
        if (typeof navigator !== "undefined" && navigator.onLine === false) throw Object.assign(new Error(legendaAPI("legenda_ic_api_sem_conexao")), { code: "offline" });
        if (error instanceof SyntaxError) throw Object.assign(new Error(legendaAPI("legenda_ic_api_resposta_invalida")), { code: "invalid_response" });
        throw error;
      } finally {
        if (inflight.get(requestKey) === controller) inflight.delete(requestKey);
      }
    }

    return { rpc: rpc, edge: edge, cancel: cancel, cancelAll: cancelAll, isAllowedRpc: function (name) { return RPC_PATTERN.test(name); }, isAllowedEdge: function (name) { return EDGE_FUNCTIONS.indexOf(name) >= 0; } };
  }

  return { create: create, RPC_PATTERN: RPC_PATTERN, EDGE_FUNCTIONS: EDGE_FUNCTIONS.slice(), SUPABASE_URL: SUPABASE_URL };
}));
