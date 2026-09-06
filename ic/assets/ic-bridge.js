(function (root, factory) {
  "use strict";
  var api = factory(root);
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Bridge = api;
}(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";
  var bridgeName = "TurboTigerICBridge";
  var canonicalHost = "turbotiger.com.br";
  var schemePrefix = "turbotiger-ic://bridge?payload=";
  var maxPayloadCharacters = 32768;
  var allowedMessages = ["session_request", "central_ready", "close", "session_control_action", "emergency_action", "reminder_local_sync"];
  var sessionListener = null;
  var clearListener = null;
  var refreshListener = null;
  var backListener = null;
  var openSectionListener = null;
  var nativeReadyListener = null;
  var nativeReadyPending = false;
  var nativeReadyDelivered = false;
  var pendingOpenSection = null;
  var lastOpenSectionPayload = null;

  function bridgeObject() { return root[bridgeName] && typeof root[bridgeName] === "object" ? root[bridgeName] : null; }
  function hasBridge() {
    var bridge = bridgeObject();
    return !!(bridge && (typeof bridge.post === "function" || bridge.nativeApp === true));
  }

  function isAuthorizedDocument() {
    if (!root.location) return false;
    var protocol = String(root.location.protocol || "").toLowerCase();
    var hostname = String(root.location.hostname || "").toLowerCase();
    var port = String(root.location.port || "");
    var path = String(root.location.pathname || "").replace(/\/{2,}/g, "/");
    return protocol === "https:" && hostname === canonicalHost && (port === "" || port === "443") &&
      (path === "/ic" || path === "/ic/" || path.indexOf("/ic/") === 0);
  }

  function post(type, payload) {
    if (!hasBridge() || !isAuthorizedDocument() || allowedMessages.indexOf(type) < 0) return false;
    var message = Object.assign({ type: type }, payload || {});
    var serialized = JSON.stringify(message);
    if (serialized.length > maxPayloadCharacters) return false;
    var bridge = bridgeObject();
    try {
      if (typeof bridge.post === "function") { bridge.post(serialized); return true; }
      if (bridge.nativeApp !== true) return false;
      var encoded = encodeURIComponent(serialized);
      if (encoded.length > maxPayloadCharacters) return false;
      root.location.href = schemePrefix + encoded;
      return true;
    }
    catch (_error) { return false; }
  }

  function decodeBase64Json(encoded) {
    if (typeof encoded !== "string" || encoded.length < 4 || encoded.length > 131072) throw new Error("Sessão nativa inválida.");
    var binary = root.atob(encoded);
    var bytes = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    var json = typeof TextDecoder === "function" ? new TextDecoder("utf-8", { fatal: true }).decode(bytes) : decodeURIComponent(Array.prototype.map.call(bytes, function (byte) { return "%" + byte.toString(16).padStart(2, "0"); }).join(""));
    return JSON.parse(json);
  }

  function normalizeSession(encoded) {
    var value = decodeBase64Json(encoded);
    var token = value && (value.access_token || value.accessToken);
    if (typeof token !== "string" || token.length < 20 || token.length > 8192) throw new Error("Token de sessão inválido.");
    return {
      accessToken: token,
      expiresAt: value.expires_at || value.expiresAt || null,
      sessionKey: String(value.session_key || value.sessionKey || "")
    };
  }

  function safeNativeUuid(value, required) {
    var text = String(value || "").trim().toLowerCase();
    if (!text && !required) return null;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(text)) throw new Error("UUID nativo inválido.");
    return text;
  }

  function safeNativeText(value, maximum, required) {
    var text = String(value || "").trim();
    if ((!text && required) || text.length > maximum || /[\u0000-\u001f]/.test(text)) throw new Error("Contexto nativo inválido.");
    return text || null;
  }

  function safeNativeDate(value, required) {
    var text = safeNativeText(value, 64, required);
    if (!text) return null;
    if (Number.isNaN(new Date(text).getTime())) throw new Error("Período nativo inválido.");
    return text;
  }

  function normalizeOpenSection(encoded) {
    var value = decodeBase64Json(encoded);
    if (!value || value.section !== "estatisticas") throw new Error("Destino nativo inválido.");
    var scope = safeNativeText(value.escopo_estatistico, 48, true);
    var direction = safeNativeText(value.direcao_historica, 80, true);
    var source = safeNativeText(value.fonte_efetiva, 24, true);
    if (["pessoal", "comunidade", "ambos"].indexOf(scope) < 0) throw new Error("Escopo estatístico inválido.");
    if (["melhor_historico", "pior_historico"].indexOf(direction) < 0) throw new Error("Direção histórica inválida.");
    if (["pessoal", "comunidade", "ambos"].indexOf(source) < 0) throw new Error("Fonte efetiva inválida.");
    if ((scope === "pessoal" && source !== "pessoal") || (scope === "comunidade" && source !== "comunidade")) throw new Error("Fonte fora do escopo escolhido.");
    var occurrenceStart = safeNativeDate(value.ocorrencia_inicio, true);
    var occurrenceEnd = safeNativeDate(value.ocorrencia_fim, true);
    if (new Date(occurrenceEnd).getTime() <= new Date(occurrenceStart).getTime()) throw new Error("Janela da ocorrência inválida.");
    var ruleVersion = safeNativeText(value.versao_regra, 16, true);
    if (!/^[1-9][0-9]{0,8}$/.test(ruleVersion)) throw new Error("Versão da regra inválida.");
    return {
      section: "estatisticas",
      id_assinatura_estatistica: safeNativeUuid(value.id_assinatura_estatistica, true),
      id_insight_evidencia: safeNativeUuid(value.id_insight_evidencia, true),
      escopo_estatistico: scope,
      direcao_historica: direction,
      fonte_efetiva: source,
      ocorrencia_inicio: occurrenceStart,
      ocorrencia_fim: occurrenceEnd,
      versao_regra: ruleVersion
    };
  }

  function receiveSession(encoded) {
    if (!isAuthorizedDocument() || !hasBridge()) return false;
    try {
      if (!sessionListener) return false;
      sessionListener(normalizeSession(encoded));
      return true;
    }
    catch (_error) { if (clearListener) clearListener("invalid_session"); return false; }
  }

  function receiveOpenSection(encoded) {
    try {
      if (!isAuthorizedDocument() || !hasBridge() || typeof encoded !== "string") return false;
      if (encoded === lastOpenSectionPayload) return true;
      var value = normalizeOpenSection(encoded);
      lastOpenSectionPayload = encoded;
      if (!openSectionListener) { pendingOpenSection = value; return true; }
      openSectionListener(value);
      return true;
    } catch (_error) { return false; }
  }

  function bind(handlers) {
    handlers = handlers || {};
    sessionListener = typeof handlers.onSession === "function" ? handlers.onSession : null;
    clearListener = typeof handlers.onClear === "function" ? handlers.onClear : null;
    refreshListener = typeof handlers.onRefresh === "function" ? handlers.onRefresh : null;
    backListener = typeof handlers.onBack === "function" ? handlers.onBack : null;
    openSectionListener = typeof handlers.onOpenSection === "function" ? handlers.onOpenSection : null;
    nativeReadyListener = typeof handlers.onNativeReady === "function" ? handlers.onNativeReady : null;
    if (nativeReadyPending && !nativeReadyDelivered && nativeReadyListener) {
      nativeReadyPending = false;
      nativeReadyDelivered = true;
      nativeReadyListener();
    }
    if (pendingOpenSection && openSectionListener) {
      var pending = pendingOpenSection;
      pendingOpenSection = null;
      openSectionListener(pending);
    }
  }

  function nativeBridgeReady() {
    if (!isAuthorizedDocument() || !hasBridge()) return false;
    if (nativeReadyDelivered) return true;
    if (!nativeReadyListener) { nativeReadyPending = true; return true; }
    nativeReadyDelivered = true;
    nativeReadyListener();
    return true;
  }

  root.TurboTigerICReceiveSession = receiveSession;
  root.TurboTigerICClearSession = function () { if (clearListener) clearListener("native_clear"); };
  root.TurboTigerICRefresh = function () { if (refreshListener) refreshListener(); };
  root.TurboTigerICHandleBack = function () { return backListener ? !!backListener() : false; };
  root.TurboTigerICNativeBridgeReady = nativeBridgeReady;
  root.TurboTigerICOpenSection = receiveOpenSection;

  return {
    name: bridgeName,
    hasBridge: hasBridge,
    isAuthorizedDocument: isAuthorizedDocument,
    post: post,
    bind: bind,
    nativeBridgeReady: nativeBridgeReady,
    requestSession: function (loadGeneration) { return post("session_request", { carga: loadGeneration || null }); },
    close: function (loadGeneration) { return post("close", { carga: loadGeneration || null }); }
  };
}));
