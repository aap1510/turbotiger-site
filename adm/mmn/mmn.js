(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    adminSessionKey: "tt_admin_session_v1",
    requestTimeoutMs: 30000,
    addressRequestTimeoutMs: 4500,
    appSessionTimeoutMs: 15000,
    pageSize: 30,
    edgeFunctions: {
      validatePixKey: "validate-pix-key",
      confirmPixKey: "confirm-pix-key"
    },
    rpcs: {
      adminContext: "adm_contexto_rpc",
      userDashboard: "mmn_usuario_painel_rpc",
      userEnrollmentSave: "mmn_usuario_aderir_rpc",
      userProgramExit: "mmn_usuario_programa_sair_rpc",
      userProgramReenter: "mmn_usuario_programa_reentrar_rpc",
      userSimulator: "mmn_usuario_simular_rpc",
      userProfileSave: "mmn_usuario_perfil_pagamento_salvar_rpc",
      userDispute: "mmn_usuario_contestar_rpc",
      userEventRead: "mmn_usuario_evento_marcar_lido_rpc",
      userPlacementNetwork: "mmn_usuario_rede_posicionamento_rpc",
      userNetworkNode: "mmn_usuario_rede_no_rpc",
      userNetworkDiagram: "mmn_usuario_rede_diagrama_rpc",
      userRankQualified: "mmn_usuario_rank_qualificados_rpc",
      userEvolution: "mmn_usuario_evolucao_rpc",
      locationCities: "espera_cidades_uf_rpc",
      adminDashboard: "adm_mmn_painel_rpc",
      adminUserDetail: "adm_mmn_usuario_detalhe_rpc",
      adminConfigGet: "adm_mmn_config_obter_rpc",
      adminConfigSave: "adm_mmn_config_salvar_rpc",
      adminConfigDuplicate: "adm_mmn_config_duplicar_rpc",
      adminConfigPublish: "adm_mmn_config_publicar_rpc",
      adminConfigProgress: "adm_mmn_config_publicacao_progresso_rpc",
      adminConfigApproverSave: "adm_mmn_config_aprovador_salvar_rpc",
      adminRegulationDraftSave: "adm_mmn_regulamento_rascunho_salvar_rpc",
      adminRegulationPreview: "adm_mmn_regulamento_previsualizar_rpc",
      adminSimulator: "adm_mmn_simular_rpc",
      adminSimulatorReplay: "adm_mmn_simular_historico_rpc",
      adminSimulationsList: "adm_mmn_simulacoes_listar_rpc",
      adminSimulationGet: "adm_mmn_simulacao_obter_rpc",
      adminSimulationsCompare: "adm_mmn_simulacoes_comparar_rpc",
      adminSimulationExport: "adm_mmn_simulacao_exportar_rpc",
      adminPeriodCalculate: "adm_mmn_periodo_apurar_rpc",
      adminPeriodClose: "adm_mmn_periodo_fechar_rpc",
      adminPeriodReopen: "adm_mmn_periodo_reabrir_rpc",
      adminBatchCreate: "adm_mmn_lote_criar_rpc",
      adminBatchApprove: "adm_mmn_lote_aprovar_rpc",
      adminBatchMarkPaid: "adm_mmn_lote_marcar_pago_rpc",
      adminRpasList: "adm_mmn_rpas_listar_rpc",
      adminRpaGet: "adm_mmn_rpa_obter_rpc",
      adminRpaRegister: "adm_mmn_rpa_registrar_rpc",
      adminRpaIssue: "adm_mmn_rpa_emitir_rpc",
      adminParticipantStatus: "adm_mmn_participante_status_rpc",
      adminParticipantGroup: "adm_mmn_participante_grupo_rpc",
      adminSponsorCorrect: "adm_mmn_patrocinador_corrigir_rpc",
      adminPixValidate: "adm_mmn_pix_validar_rpc",
      adminWaitlistDecide: "adm_mmn_espera_decidir_rpc",
      adminFiscalApprove: "adm_mmn_fiscal_homologar_rpc",
      adminOccurrenceUpdate: "adm_mmn_ocorrencia_atualizar_rpc",
      adminParticipantsList: "adm_mmn_participantes_listar_rpc",
      adminWaitlistList: "adm_mmn_espera_listar_rpc",
      adminRevenueList: "adm_mmn_receitas_listar_rpc",
      adminAuditList: "adm_mmn_auditoria_listar_rpc",
      adminOccurrencesList: "adm_mmn_ocorrencias_listar_rpc"
    }
  };

  var state = {
    mode: "admin",
    session: null,
    context: null,
    capabilities: {},
    user: {
      dashboard: null,
      inviteUrl: "",
      copyToastTimer: null,
      cursors: { network: null, ledger: null, payments: null },
      loaded: {},
      pix: {},
      network: { rootId: "", rows: [], directs: [], stack: [], hasMore: false, nodeCache: {} },
      evolution: { rows: [], loaded: false, loading: false, error: "" },
      ranks: [],
      rankQualificationData: null,
      rankQualified: { rank: null, rows: [], cursor: null, hasMore: false }
    },
    admin: {
      dashboard: null,
      config: null,
      simulationParameters: {},
      simulations: [],
      selectedRpa: null,
      cursors: {},
      loaded: {}
    },
    dialogResolve: null,
    programExitBusy: false,
    bootSequence: 0
  };

  var addressState = {
    contexts: {},
    postalCodeCache: {}
  };

  var FRIENDLY_MESSAGES = {
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
    "Failed to fetch": "Falha de conexão. Verifique sua internet e tente novamente.",
    "Invalid login credentials": "E-mail ou senha inválidos.",
    app_session_timeout: "O app demorou para validar sua sessão. Toque em Atualizar.",
    app_session_unavailable: "Não foi possível validar sua sessão pelo app.",
    dados_obrigatorios: "Preencha os campos obrigatórios.",
    invalid_credentials: "E-mail ou senha inválidos.",
    invalid_grant: "E-mail ou senha inválidos.",
    missing_authorization: "Sessão expirada. Entre novamente.",
    nao_autenticado: "Entre para continuar.",
    sem_permissao_admin: "Sem permissão administrativa.",
    sem_permissao_mmn: "Sem permissão para acessar o MMN.",
    sessao_expirada: "Sessão expirada. Entre novamente.",
    usuario_nao_encontrado: "Usuário não encontrado.",
    usuario_nao_encontrado_no_app: "Usuário do app não encontrado.",
    confirmacao_reentrada_mmn_obrigatoria: "Confirme a reentrada no programa.",
    novo_aceite_regulamento_vigente_obrigatorio: "Aceite novamente o regulamento vigente antes de reentrar.",
    saida_voluntaria_nao_encontrada: "Não há uma saída voluntária pendente de reentrada.",
    situacao_cadastral_nao_permite_reentrada: "Sua situação cadastral não permite a reentrada neste momento.",
    pix_titular_invalido: "A chave PIX deve pertencer ao mesmo CPF do cadastro.",
    pix_email_invalido: "Informe um e-mail válido para a chave Pix.",
    pix_celular_invalido: "Informe um celular com DDD e 11 números.",
    pix_phone_invalido: "Informe um celular com DDD e 11 números.",
    pix_evp_invalido: "Informe uma chave aleatória Pix válida.",
    pix_chave_aleatoria_invalida: "Informe uma chave aleatória Pix válida.",
    pix_cpf_invalido: "Informe um CPF válido com 11 números.",
    regulamento_nao_aceito: "É necessário aceitar o regulamento vigente.",
    configuracao_fiscal_nao_homologada: "Os pagamentos reais permanecem bloqueados até a homologação fiscal.",
    quantidade_niveis_deve_ser_inteiro_de_1_a_10: "A quantidade de níveis deve ser um inteiro de 1 a 10.",
    largura_deve_ser_zero_ou_inteiro_maior_ou_igual_a_2: "A largura deve ser 0 para ilimitada ou um inteiro a partir de 2.",
    dez_faixas_de_nivel_devem_ser_preservadas_na_configuracao: "As dez faixas de nível precisam permanecer preservadas na configuração.",
    regulamento_rascunho_nao_encontrado: "Gere primeiro o rascunho do regulamento para esta configuração.",
    regulamento_somente_para_configuracao_rascunho: "O regulamento só pode ser gerado para uma configuração em rascunho.",
    modelo_de_regulamento_nao_permitido: "O modelo jurídico solicitado não é permitido.",
    versao_de_regulamento_ja_existe: "Essa versão do regulamento já existe.",
    regulamento_desatualizado_salvar_novamente_e_refazer_simulacao: "As regras mudaram. Gere novamente o regulamento e refaça a simulação antes de publicar."
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function on(id, eventName, handler) {
    var element = qs(id);
    if (element) element.addEventListener(eventName, handler);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function numberValue(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : (fallback == null ? 0 : fallback);
  }

  function integerValue(value, fallback) {
    return Math.trunc(numberValue(value, fallback));
  }

  function booleanValue(value, fallback) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    if (value === "false" || value === 0 || value === "0") return false;
    return !!fallback;
  }

  function firstDefined(values, fallback) {
    for (var index = 0; index < values.length; index += 1) {
      if (values[index] !== undefined && values[index] !== null) return values[index];
    }
    return fallback;
  }

  function listValue(value) {
    return Array.isArray(value) ? value : [];
  }

  function listFrom(data, keys) {
    var source = data || {};
    for (var index = 0; index < keys.length; index += 1) {
      if (Array.isArray(source[keys[index]])) return source[keys[index]];
    }
    return [];
  }

  function objectFrom(data, keys) {
    var source = data || {};
    for (var index = 0; index < keys.length; index += 1) {
      var value = source[keys[index]];
      if (value && typeof value === "object" && !Array.isArray(value)) return value;
    }
    return {};
  }

  function formatMoneyCents(value) {
    if (value === undefined || value === null || value === "") return "—";
    return (numberValue(value) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function centsFrom(object, keys) {
    var source = object || {};
    for (var index = 0; index < keys.length; index += 1) {
      if (source[keys[index]] !== undefined && source[keys[index]] !== null) {
        return source[keys[index]];
      }
    }
    return null;
  }

  function formatPercent(value) {
    if (value === undefined || value === null || value === "") return "—";
    return numberValue(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    }) + "%";
  }

  function formatInteger(value) {
    if (value === undefined || value === null || value === "") return "—";
    return integerValue(value).toLocaleString("pt-BR");
  }

  function formatDate(value, withTime) {
    if (!value) return "—";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("pt-BR", withTime ? {
      dateStyle: "short",
      timeStyle: "short"
    } : { dateStyle: "short" }).format(date);
  }

  function monthValue(date) {
    var current = date || new Date();
    return current.getFullYear() + "-" + String(current.getMonth() + 1).padStart(2, "0");
  }

  function monthDate(value) {
    return value ? value + "-01" : null;
  }

  function friendlyMessage(value) {
    var raw = String(value == null ? "" : value).trim();
    if (!raw) return "Não foi possível concluir a operação.";
    return FRIENDLY_MESSAGES[raw] || FRIENDLY_MESSAGES[raw.toLowerCase()] || raw;
  }

  function setText(id, value) {
    var element = qs(id);
    if (element) element.textContent = value == null ? "" : String(value);
  }

  function setStatus(id, text, kind) {
    var element = typeof id === "string" ? qs(id) : id;
    if (!element) return;
    element.textContent = text ? friendlyMessage(text) : "";
    element.classList.remove("is-error", "is-ok", "is-warn");
    if (kind) element.classList.add("is-" + kind);
  }

  function setBusy(buttonOrId, busy, busyText) {
    var button = typeof buttonOrId === "string" ? qs(buttonOrId) : buttonOrId;
    if (!button) return;
    if (busy) {
      if (!button.dataset.label) button.dataset.label = button.textContent;
      button.dataset.busy = "true";
      button.textContent = busyText || "Aguarde...";
      button.disabled = true;
    } else {
      if (button.dataset.label) button.textContent = button.dataset.label;
      delete button.dataset.busy;
      button.disabled = false;
    }
  }

  function emptyHtml(message) {
    return "<div class=\"mmn-empty\">" + escapeHtml(message) + "</div>";
  }

  function emptyTableHtml(columns, message) {
    return "<tr><td colspan=\"" + columns + "\"><div class=\"mmn-empty\">" + escapeHtml(message) + "</div></td></tr>";
  }

  function pillHtml(status, label) {
    var normalized = String(status || "").toLowerCase();
    var kind = ["ativo", "elegivel", "confirmado", "pago", "concluido", "ok", "convertido", "homologado"].indexOf(normalized) >= 0 ? "is-ok" :
      (["pendente", "apurando", "retido", "revisao", "aguardando", "fila", "enviado", "aberto", "aberta", "em_atendimento"].indexOf(normalized) >= 0 ? "is-warn" :
      (["bloqueado", "cancelado", "falhou", "revertido", "permanente", "inelegivel"].indexOf(normalized) >= 0 ? "is-bad" : ""));
    return "<span class=\"mmn-pill " + kind + "\">" + escapeHtml(label || status || "—") + "</span>";
  }

  function setGlobalError(error) {
    var box = qs("globalError");
    if (!box) return;
    if (!error) {
      box.hidden = true;
      setText("globalErrorText", "");
      return;
    }
    setText("globalErrorText", friendlyMessage(error.message || error));
    box.hidden = false;
  }

  function showLoading(show) {
    if (qs("loadingPanel")) qs("loadingPanel").hidden = !show;
  }

  function hasNativeBridge() {
    try {
      return !!(window.TurboTigerHistoricoBridge &&
        typeof window.TurboTigerHistoricoBridge.post === "function");
    } catch (error) {
      return false;
    }
  }

  function configureMode() {
    state.mode = hasNativeBridge() ? "user" : "admin";
    document.documentElement.classList.toggle("mmn-app-webview", state.mode === "user");
    if (state.mode === "user") {
      document.title = "Indicações e Benefícios - Turbo Tiger";
      setText("brandTitle", "Indicações e Benefícios");
      setText("pageTitle", "");
    } else {
      document.title = "MMN - Turbo Tiger Admin";
      setText("brandTitle", "Admin MMN");
      setText("pageTitle", "Painel MMN");
    }
  }

  function readAdminSession() {
    try {
      var raw = localStorage.getItem(CONFIG.adminSessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveAdminSession(session) {
    state.session = session;
    localStorage.setItem(CONFIG.adminSessionKey, JSON.stringify(session));
  }

  function clearAdminSession() {
    state.session = null;
    state.context = null;
    state.capabilities = {};
    localStorage.removeItem(CONFIG.adminSessionKey);
  }

  function jwtExpiresAt(token) {
    try {
      var part = String(token || "").split(".")[1] || "";
      part = part.replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      return Number(JSON.parse(atob(part)).exp || 0) * 1000;
    } catch (error) {
      return 0;
    }
  }

  var appSessionRequest = null;
  var appSessionResolve = null;
  var appSessionReject = null;
  var appSessionTimer = null;

  function finishAppSession(error, session) {
    if (appSessionTimer) window.clearTimeout(appSessionTimer);
    appSessionTimer = null;
    var resolve = appSessionResolve;
    var reject = appSessionReject;
    appSessionRequest = null;
    appSessionResolve = null;
    appSessionReject = null;
    if (error && reject) reject(error);
    if (!error && resolve) resolve(session);
  }

  window.TurboTigerMmnReceiveSession = function (payload) {
    try {
      if (!payload || payload.ok !== true) throw new Error((payload && payload.error) || "app_session_unavailable");
      var value = payload.session || payload;
      var token = String(value.access_token || "").trim();
      if (!token) throw new Error("app_session_unavailable");
      state.session = {
        access_token: token,
        expires_at: jwtExpiresAt(token),
        user: value.user || null,
        endereco_sugerido: payload.endereco_sugerido || value.endereco_sugerido || null
      };
      finishAppSession(null, state.session);
    } catch (error) {
      finishAppSession(error);
    }
  };

  function requestAppSession() {
    if (state.mode !== "user" || !hasNativeBridge()) return Promise.reject(new Error("app_session_unavailable"));
    if (appSessionRequest) return appSessionRequest;
    appSessionRequest = new Promise(function (resolve, reject) {
      appSessionResolve = resolve;
      appSessionReject = reject;
      appSessionTimer = window.setTimeout(function () {
        finishAppSession(new Error("app_session_timeout"));
      }, CONFIG.appSessionTimeoutMs);
      try {
        window.TurboTigerHistoricoBridge.post("TURBO_MMN_SESSION_REQUEST");
      } catch (error) {
        finishAppSession(new Error("app_session_unavailable"));
      }
    });
    return appSessionRequest;
  }

  async function parseResponse(response) {
    var text = await response.text();
    var data = null;
    if (text) {
      try { data = JSON.parse(text); } catch (error) { data = { raw: text }; }
    }
    if (!response.ok) {
      throw new Error((data && (data.error_description || data.message || data.error || data.erro || data.details)) || "Falha HTTP " + response.status + ".");
    }
    if (data && data.ok === false) throw new Error(data.error || data.erro || data.message || "Não foi possível concluir a operação.");
    return data == null ? {} : data;
  }

  async function fetchJson(url, options) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, CONFIG.requestTimeoutMs) : null;
    var requestOptions = Object.assign({}, options || {});
    if (controller) requestOptions.signal = controller.signal;
    try {
      return await parseResponse(await fetch(url, requestOptions));
    } catch (error) {
      if (error && error.name === "AbortError") throw new Error("A consulta demorou além do esperado.");
      throw error;
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  async function adminLogin(email, password) {
    var data = await fetchJson(CONFIG.supabaseUrl + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: CONFIG.apiKey, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ email: email, password: password })
    });
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type || "bearer",
      expires_at: Date.now() + (Number(data.expires_in || 3600) * 1000),
      user: data.user || null
    };
  }

  async function refreshSessionIfNeeded() {
    if (state.mode === "user") {
      if (state.session && state.session.access_token && state.session.expires_at > Date.now() + 60000) return state.session;
      return requestAppSession();
    }
    if (!state.session) state.session = readAdminSession();
    if (!state.session || !state.session.access_token) return null;
    if (state.session.expires_at && state.session.expires_at > Date.now() + 60000) return state.session;
    if (!state.session.refresh_token) {
      clearAdminSession();
      return null;
    }
    var data = await fetchJson(CONFIG.supabaseUrl + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: { apikey: CONFIG.apiKey, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ refresh_token: state.session.refresh_token })
    });
    saveAdminSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token || state.session.refresh_token,
      token_type: data.token_type || "bearer",
      expires_at: Date.now() + (Number(data.expires_in || 3600) * 1000),
      user: data.user || state.session.user || null
    });
    return state.session;
  }

  async function rpc(name, payload) {
    var session = await refreshSessionIfNeeded();
    if (!session || !session.access_token) throw new Error("sessao_expirada");
    return fetchJson(CONFIG.supabaseUrl + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: {
        apikey: CONFIG.apiKey,
        Authorization: "Bearer " + session.access_token,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload || {})
    });
  }

  function edgeErrorCode(data) {
    var source = data && typeof data === "object" ? data : {};
    var nested = source.error && typeof source.error === "object" ? source.error : {};
    return cleanText(firstDefined([
      cleanText(source.code) || null,
      cleanText(source.error_code) || null,
      cleanText(source.codigo) || null,
      typeof source.error === "string" ? (cleanText(source.error) || null) : null,
      typeof source.erro === "string" ? (cleanText(source.erro) || null) : null,
      cleanText(nested.code) || null,
      cleanText(nested.error_code) || null,
      cleanText(nested.codigo) || null
    ], "")).toUpperCase();
  }

  function retryAfterMilliseconds(response) {
    var value = response && response.headers ? response.headers.get("Retry-After") : "";
    if (!value) return 30000;
    var seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.max(1000, seconds * 1000);
    var date = new Date(value);
    if (!Number.isNaN(date.getTime())) return Math.max(1000, date.getTime() - Date.now());
    return 30000;
  }

  async function edgeFunction(name, payload) {
    var session = await refreshSessionIfNeeded();
    if (!session || !session.access_token) throw new Error("sessao_expirada");
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, CONFIG.requestTimeoutMs) : null;
    try {
      var response = await fetch(CONFIG.supabaseUrl + "/functions/v1/" + name, {
        method: "POST",
        headers: {
          apikey: CONFIG.apiKey,
          Authorization: "Bearer " + session.access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(payload || {}),
        signal: controller ? controller.signal : undefined
      });
      var responseText = await response.text();
      var data = {};
      if (responseText) {
        try { data = JSON.parse(responseText); }
        catch (error) { data = {}; }
      }
      if (!response.ok || data.ok === false) {
        var requestError = new Error("pix_request_failed");
        requestError.status = response.status;
        requestError.code = edgeErrorCode(data);
        var retryAfterSeconds = numberValue(firstDefined([
          data.retryAfterSeconds,
          data.retry_after_seconds,
          data.retryAfter,
          data.retry_after
        ], 0), 0);
        requestError.retryAfterMs = response.status === 429 ?
          (retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : retryAfterMilliseconds(response)) : 0;
        throw requestError;
      }
      return data;
    } catch (error) {
      if (error && error.name === "AbortError") {
        var timeoutError = new Error("pix_request_timeout");
        timeoutError.code = "REQUEST_TIMEOUT";
        throw timeoutError;
      }
      throw error;
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function cleanText(value) {
    return String(value == null ? "" : value).trim();
  }

  function firstNonEmptyText(values, fallback) {
    for (var index = 0; index < values.length; index += 1) {
      var value = cleanText(values[index]);
      if (value) return value;
    }
    return cleanText(fallback);
  }

  function digitsOnly(value) {
    return cleanText(value).replace(/\D/g, "");
  }

  function formatPostalCode(value) {
    var digits = digitsOnly(value).slice(0, 8);
    return digits.length > 5 ? digits.slice(0, 5) + "-" + digits.slice(5) : digits;
  }

  var PIX_TYPE_LABELS = {
    cpf: "CPF",
    email: "E-mail",
    celular: "Celular",
    aleatoria: "Chave aleatória"
  };

  var PIX_TYPE_ALIASES = {
    cpf: "cpf",
    email: "email",
    celular: "celular",
    phone: "celular",
    aleatoria: "aleatoria",
    evp: "aleatoria"
  };

  var PIX_PROVIDER_TYPES = {
    cpf: "CPF",
    email: "EMAIL",
    celular: "PHONE",
    aleatoria: "EVP"
  };

  function pixState(prefix) {
    if (!state.user.pix[prefix]) {
      state.user.pix[prefix] = {
        requestSequence: 0,
        validating: false,
        confirming: false,
        validationId: "",
        validationType: "",
        validationKeyFingerprint: "",
        expiresAt: 0,
        expiryTimer: null,
        rateLimitedUntil: 0,
        rateLimitTimer: null,
        verified: false,
        persisted: false,
        persistedType: "",
        persistedKeyFingerprint: "",
        persistedMasked: "",
        hasStoredKey: false,
        storedConfirmed: false,
        storedType: "",
        storedMasked: ""
      };
    }
    return state.user.pix[prefix];
  }

  function normalizePixType(value) {
    var type = cleanText(value).toLowerCase();
    return PIX_TYPE_ALIASES[type] || "";
  }

  function pixProviderType(value) {
    return PIX_PROVIDER_TYPES[normalizePixType(value)] || "";
  }

  function normalizePixKey(type, value) {
    var key = cleanText(value);
    if (type === "cpf") return digitsOnly(key);
    if (type === "celular") {
      var phoneDigits = digitsOnly(key);
      if (phoneDigits.length === 11) return "55" + phoneDigits;
      return phoneDigits;
    }
    if (type === "email" || type === "aleatoria") return key.toLowerCase();
    return key;
  }

  function validatePixMinimumFormat(type, key) {
    var normalizedType = normalizePixType(type);
    var rawKey = cleanText(key);
    if (!normalizedType) {
      return { valid: false, message: "Selecione o tipo da chave Pix." };
    }
    if (!rawKey) {
      return { valid: false, message: "Informe a chave Pix." };
    }
    if (normalizedType === "cpf") {
      if (!/^[0-9.\s-]+$/.test(rawKey) || digitsOnly(rawKey).length !== 11) {
        return { valid: false, message: "Informe um CPF válido com 11 números." };
      }
    } else if (normalizedType === "email") {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawKey)) {
        return { valid: false, message: "Informe um e-mail válido para a chave Pix." };
      }
    } else if (normalizedType === "celular") {
      var phoneDigits = digitsOnly(rawKey);
      var validPhoneCharacters = /^[+0-9() .-]+$/.test(rawKey);
      var validNationalPhone = /^[1-9]\d{10}$/.test(phoneDigits);
      var validInternationalPhone = /^55[1-9]\d{10}$/.test(phoneDigits);
      if (!validPhoneCharacters || (!validNationalPhone && !validInternationalPhone)) {
        return { valid: false, message: "Informe um celular com DDD e 11 números." };
      }
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawKey)) {
      return { valid: false, message: "Informe uma chave aleatória Pix válida." };
    }
    return { valid: true, message: "" };
  }

  function currentPixSnapshot(prefix) {
    var typeElement = qs(prefix + "PixType");
    var keyElement = qs(prefix + "PixKey");
    var type = normalizePixType(typeElement ? typeElement.value : "");
    var key = cleanText(keyElement ? keyElement.value : "");
    return {
      type: type,
      key: key,
      fingerprint: normalizePixKey(type, key)
    };
  }

  function currentPixMinimumFormat(prefix) {
    var current = currentPixSnapshot(prefix);
    return validatePixMinimumFormat(current.type, current.key);
  }

  function samePixSnapshot(prefix, type, fingerprint) {
    var current = currentPixSnapshot(prefix);
    return current.type === type && current.fingerprint === fingerprint;
  }

  function maskCpfForDisplay(value) {
    var text = cleanText(value);
    if (!text) return "";
    if (text.indexOf("*") >= 0) return text;
    var digits = digitsOnly(text);
    if (digits.length !== 11) return "";
    return "***.***.***-" + digits.slice(-2);
  }

  function maskPixKeyForDisplay(type, value) {
    var key = cleanText(value);
    if (!key) return "";
    if (type === "cpf") return maskCpfForDisplay(key);
    if (type === "email") {
      var parts = key.split("@");
      return parts.length === 2 ? (parts[0].slice(0, 1) || "*") + "***@" + parts[1] : "********";
    }
    if (type === "celular") return "******" + digitsOnly(key).slice(-4);
    return "********" + key.slice(-4);
  }

  function profilePixChangeRequested() {
    var flow = pixState("profile");
    var current = currentPixSnapshot("profile");
    if (!flow.hasStoredKey) return !!current.key || !!current.type;
    return !!current.key || current.type !== flow.storedType;
  }

  function currentPixIsPersisted(prefix) {
    var flow = pixState(prefix);
    if (prefix === "profile" && !profilePixChangeRequested()) return flow.storedConfirmed;
    return flow.persisted && samePixSnapshot(prefix, flow.persistedType, flow.persistedKeyFingerprint);
  }

  function currentPixIsVerified(prefix) {
    var flow = pixState(prefix);
    return flow.verified && !pixValidationExpired(flow) &&
      samePixSnapshot(prefix, flow.validationType, flow.validationKeyFingerprint);
  }

  function setPixFieldStatus(prefix, text, kind) {
    var key = qs(prefix + "PixKey");
    if (!key) return;
    if (kind === "error") key.setAttribute("aria-invalid", "true");
    else key.removeAttribute("aria-invalid");
  }

  function setPixWorkflowStatus(prefix, text, kind) {
    setPixFieldStatus(prefix, text, kind);
    setStatus(prefix + "PixStatus", text, kind);
  }

  function setPixConfirmedPanel(prefix, visible, description) {
    var panel = qs(prefix + "PixConfirmed");
    if (!panel) return;
    panel.hidden = !visible;
    if (description) {
      var span = panel.querySelector("span");
      if (span) span.textContent = description;
    }
  }

  function clearPixResult(prefix) {
    var result = qs(prefix + "PixResult");
    if (result) result.hidden = true;
    ["HolderName", "HolderCpf", "BankName"].forEach(function (field) {
      setText(prefix + "PixResult" + field, "—");
    });
    var checkbox = qs(prefix + "PixConfirmCheck");
    if (checkbox) checkbox.checked = false;
  }

  function clearPixExpiry(flow) {
    if (flow.expiryTimer) window.clearTimeout(flow.expiryTimer);
    flow.expiryTimer = null;
  }

  function renderPixBaseline(prefix) {
    var flow = pixState(prefix);
    clearPixResult(prefix);
    if (flow.rateLimitedUntil > Date.now()) {
      setPixConfirmedPanel(prefix, false);
      setPixWorkflowStatus(prefix, "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.", "error");
      return;
    }
    if (prefix === "profile" && !profilePixChangeRequested() && flow.storedConfirmed) {
      setPixConfirmedPanel(prefix, true, "Ela será mantida enquanto você não informar uma nova chave.");
      setStatus(prefix + "PixStatus", "", null);
      setPixFieldStatus(prefix, "Chave Pix confirmada.", "ok");
      return;
    }
    setPixConfirmedPanel(prefix, false);
    if (prefix === "profile" && !profilePixChangeRequested() && flow.hasStoredKey) {
      setStatus(prefix + "PixStatus", "A chave atual ainda não está confirmada. Informe-a novamente para verificar.", "warn");
      setPixFieldStatus(prefix, "Informe novamente a chave Pix atual para concluir a confirmação.", "warn");
    } else if (prefix === "profile" && flow.hasStoredKey && !currentPixSnapshot(prefix).key) {
      setStatus(prefix + "PixStatus", "Informe a nova chave Pix para verificar a alteração.", "warn");
      setPixFieldStatus(prefix, "Informe a nova chave Pix.", "warn");
    } else {
      setStatus(prefix + "PixStatus", "Informe o tipo e a chave, depois toque em verificar.", null);
      setPixFieldStatus(prefix, "", null);
    }
  }

  function clearPendingPix(prefix, renderBaseline) {
    var flow = pixState(prefix);
    flow.requestSequence += 1;
    flow.validating = false;
    flow.confirming = false;
    flow.validationId = "";
    flow.validationType = "";
    flow.validationKeyFingerprint = "";
    flow.expiresAt = 0;
    flow.verified = false;
    flow.persisted = false;
    flow.persistedType = "";
    flow.persistedKeyFingerprint = "";
    flow.persistedMasked = "";
    clearPixExpiry(flow);
    setBusy(prefix + "PixVerify", false);
    setBusy(prefix + "PixConfirm", false);
    var typeElement = qs(prefix + "PixType");
    var keyElement = qs(prefix + "PixKey");
    if (typeElement) typeElement.disabled = false;
    if (keyElement) keyElement.disabled = false;
    if (renderBaseline !== false) renderPixBaseline(prefix);
  }

  function pixValidationExpired(flow) {
    return !flow.expiresAt || flow.expiresAt <= Date.now();
  }

  function updatePixActions(prefix) {
    var flow = pixState(prefix);
    var current = currentPixSnapshot(prefix);
    var minimumFormat = validatePixMinimumFormat(current.type, current.key);
    var rateLimited = flow.rateLimitedUntil > Date.now();
    var verify = qs(prefix + "PixVerify");
    var confirm = qs(prefix + "PixConfirm");
    var correct = qs(prefix + "PixCorrect");
    if (verify) {
      verify.hidden = flow.verified || currentPixIsPersisted(prefix);
      verify.disabled = flow.validating || flow.confirming || rateLimited || !minimumFormat.valid || currentPixIsPersisted(prefix);
    }
    if (confirm) {
      confirm.disabled = flow.validating || flow.confirming || !flow.verified || pixValidationExpired(flow) ||
        !samePixSnapshot(prefix, flow.validationType, flow.validationKeyFingerprint);
    }
    if (correct) correct.disabled = flow.confirming;
    if (prefix === "enrollment") updateEnrollmentSubmitState();
    else {
      var submit = qs("profileSubmit");
      var submissionBlocked = !currentPixIsPersisted(prefix);
      if (submit && !submit.dataset.busy) {
        submit.disabled = submissionBlocked;
        submit.setAttribute("aria-disabled", submissionBlocked ? "true" : "false");
      }
    }
  }

  function clearPixRateLimit(prefix) {
    var flow = pixState(prefix);
    if (flow.rateLimitTimer) window.clearTimeout(flow.rateLimitTimer);
    flow.rateLimitedUntil = 0;
    flow.rateLimitTimer = null;
  }

  function schedulePixRateLimit(prefix, milliseconds) {
    var flow = pixState(prefix);
    if (flow.rateLimitTimer) window.clearTimeout(flow.rateLimitTimer);
    flow.rateLimitedUntil = Date.now() + Math.max(1000, milliseconds || 30000);
    flow.rateLimitTimer = window.setTimeout(function () {
      flow.rateLimitedUntil = 0;
      flow.rateLimitTimer = null;
      if (!flow.validating && !flow.confirming && !flow.verified && !currentPixIsPersisted(prefix)) {
        renderPixBaseline(prefix);
      }
      updatePixActions(prefix);
    }, Math.min(2147483647, Math.max(1000, flow.rateLimitedUntil - Date.now() + 50)));
  }

  function expirePixValidation(prefix, validationId) {
    var flow = pixState(prefix);
    if (!flow.verified || (validationId && flow.validationId !== validationId)) return;
    flow.validationId = "";
    flow.validationType = "";
    flow.validationKeyFingerprint = "";
    flow.expiresAt = 0;
    flow.verified = false;
    clearPixExpiry(flow);
    clearPixResult(prefix);
    setPixWorkflowStatus(prefix, "A verificação expirou. Verifique a chave Pix novamente.", "warn");
    updatePixActions(prefix);
  }

  function schedulePixExpiration(prefix) {
    var flow = pixState(prefix);
    clearPixExpiry(flow);
    var validationId = flow.validationId;
    var delay = flow.expiresAt - Date.now();
    if (delay <= 0) return expirePixValidation(prefix, validationId);
    flow.expiryTimer = window.setTimeout(function () {
      expirePixValidation(prefix, validationId);
    }, Math.min(2147483647, delay + 25));
  }

  function pixResponseSource(data) {
    var source = objectFrom(data, ["data", "result", "resultado", "validation", "validacao"]);
    return Object.keys(source).length ? source : (data || {});
  }

  function normalizePixValidationResponse(data, submitted) {
    var source = pixResponseSource(data);
    var action = cleanText(firstDefined([data.action, source.action], "")).toUpperCase();
    if (action === "IN_PROGRESS") {
      var inProgress = new Error("pix_validation_in_progress");
      inProgress.code = "VALIDATION_IN_PROGRESS";
      throw inProgress;
    }
    var pix = objectFrom(source, ["pix", "keyData", "dados_chave", "key", "chave"]);
    if (!Object.keys(pix).length) pix = source;
    var holder = objectFrom(pix, ["holder", "owner", "titular", "accountHolder", "account"]);
    if (!Object.keys(holder).length) holder = objectFrom(source, ["holder", "owner", "titular", "accountHolder", "account"]);
    var bank = objectFrom(pix, ["bank", "provider", "instituicao", "banco", "institution"]);
    if (!Object.keys(bank).length) bank = objectFrom(source, ["bank", "provider", "instituicao", "banco", "institution"]);
    var validationId = cleanText(firstDefined([
      data.validationId, data.validation_id, data.validacao_id,
      source.validationId, source.validation_id, source.validacao_id, source.id
    ], ""));
    var expiresRaw = firstDefined([
      data.expiresAt, data.expires_at, data.expira_em,
      source.expiresAt, source.expires_at, source.expira_em
    ], "");
    var expiresAt = expiresRaw ? new Date(expiresRaw).getTime() : 0;
    if (!expiresAt) {
      var expiresIn = numberValue(firstDefined([data.expiresIn, data.expires_in, source.expiresIn, source.expires_in], 0));
      if (expiresIn > 0) expiresAt = Date.now() + expiresIn * 1000;
    }
    var type = normalizePixType(firstDefined([pix.type, pix.tipo, pix.keyType, pix.key_type, source.type, source.tipo], submitted.type));
    var key = cleanText(firstDefined([pix.key, pix.chave, pix.value, pix.valor, source.key, source.chave], submitted.key));
    var holderName = cleanText(firstDefined([
      holder.name, holder.nome, holder.fullName, holder.nome_completo,
      pix.name, pix.nome, pix.holderName, pix.holder_name, pix.titular_nome,
      source.name, source.nome, source.holderName, source.holder_name, source.titular_nome
    ], ""));
    var holderCpf = maskCpfForDisplay(firstDefined([
      holder.cpfMasked, holder.cpf_masked, holder.cpf_mascarado, holder.cpf, holder.taxId, holder.tax_id, holder.documento,
      pix.cpfMasked, pix.cpf_masked, pix.cpf_mascarado, pix.holderCpfMasked, pix.holder_cpf_masked, pix.titular_cpf_mascarado, pix.titular_cpf,
      source.cpfMasked, source.cpf_masked, source.cpf_mascarado, source.holderCpfMasked, source.holder_cpf_masked, source.titular_cpf_mascarado, source.titular_cpf
    ], ""));
    var bankCode = cleanText(firstDefined([
      bank.code, bank.codigo, bank.ispb, bank.compe,
      pix.bankCode, pix.bank_code, source.bankCode, source.bank_code
    ], ""));
    var bankName = cleanText(firstDefined([
      bank.name, bank.nome, bank.corporateName, bank.razao_social,
      pix.bankName, pix.bank_name, source.bankName, source.bank_name
    ], ""));
    if (!validationId || !expiresAt || expiresAt <= Date.now() || !type || !key || !holderName || !holderCpf || !bankCode || !bankName) {
      var invalidResponse = new Error("pix_validation_response_invalid");
      invalidResponse.code = "INVALID_RESPONSE";
      throw invalidResponse;
    }
    if (type !== submitted.type || normalizePixKey(type, key) !== submitted.fingerprint) {
      var divergentResponse = new Error("pix_validation_response_divergent");
      divergentResponse.code = "DIVERGENT_RESPONSE";
      throw divergentResponse;
    }
    return {
      validationId: validationId,
      expiresAt: expiresAt,
      type: type,
      key: key,
      holderName: holderName,
      holderCpf: holderCpf,
      bankCode: bankCode,
      bankName: bankName
    };
  }

  function pixConfirmationAccepted(data) {
    var source = pixResponseSource(data);
    var status = cleanText(firstDefined([data.status, source.status, data.situacao, source.situacao], "")).toLowerCase();
    return booleanValue(firstDefined([
      data.confirmed, data.confirmado, source.confirmed, source.confirmado
    ], false), false) || status === "confirmed" || status === "confirmado";
  }

  function pixConfirmationMaskedKey(data, type, fallbackKey) {
    var source = pixResponseSource(data);
    var pix = objectFrom(source, ["pix"]);
    var masked = cleanText(firstDefined([
      pix.keyMasked, pix.key_masked, pix.chave_mascarada,
      source.keyMasked, source.key_masked, source.chave_mascarada,
      data.keyMasked, data.key_masked, data.chave_mascarada
    ], ""));
    return masked || maskPixKeyForDisplay(type, fallbackKey);
  }

  function pixErrorMessage(error, confirming) {
    var status = numberValue(error && error.status, 0);
    var rawCode = cleanText(error && error.code) || cleanText(error && error.message);
    var code = rawCode.toUpperCase();
    var blockedMatch = rawCode.match(/alteracao_pix_bloqueada_ate_(.+)$/i);
    if (blockedMatch) {
      var blockedValue = blockedMatch[1].replace(/^(\d{4}-\d{2}-\d{2})(\d{2}:)/, "$1T$2");
      var blockedDate = new Date(blockedValue);
      if (!Number.isNaN(blockedDate.getTime())) {
        return "Por segurança, sua chave Pix poderá ser alterada novamente em " +
          new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(blockedDate) + ".";
      }
      return "Por segurança, ainda não é possível alterar sua chave Pix. Aguarde o prazo informado pelo programa e tente novamente.";
    }
    if (status === 429 || code.indexOf("RATE_LIMIT") >= 0 || code.indexOf("TOO_MANY") >= 0) {
      return "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.";
    }
    if (status === 401 || status === 403 || code.indexOf("AUTH") >= 0 ||
        code.indexOf("SESSION") >= 0 || code.indexOf("SESSAO") >= 0) {
      if (code.indexOf("ASAAS") >= 0 || code.indexOf("PROVIDER") >= 0) {
        return "O serviço de consulta Pix está temporariamente indisponível. Tente novamente mais tarde.";
      }
      return "Sua sessão expirou. Atualize o painel e tente novamente.";
    }
    if (status === 410 || code.indexOf("EXPIRED") >= 0 || code.indexOf("EXPIRAD") >= 0) {
      return "A verificação expirou. Verifique a chave Pix novamente.";
    }
    if (code.indexOf("INVALID_PIX_TYPE") >= 0 || code.indexOf("PIX_TYPE_INVALID") >= 0) {
      return "Selecione um tipo válido de chave Pix.";
    }
    if (code.indexOf("INVALID_PIX_CPF") >= 0 || code.indexOf("PIX_CPF_INVALID") >= 0 || code.indexOf("PIX_CPF_INVAL") >= 0) {
      return "Informe um CPF válido com 11 números.";
    }
    if (code.indexOf("INVALID_PIX_EMAIL") >= 0 || code.indexOf("PIX_EMAIL_INVALID") >= 0 || code.indexOf("PIX_EMAIL_INVAL") >= 0) {
      return "Informe um e-mail válido para a chave Pix.";
    }
    if (code.indexOf("INVALID_PIX_PHONE") >= 0 || code.indexOf("INVALID_PIX_CELULAR") >= 0 ||
        code.indexOf("PIX_PHONE_INVALID") >= 0 || code.indexOf("PIX_CELULAR_INVAL") >= 0) {
      return "Informe um celular com DDD e 11 números.";
    }
    if (code.indexOf("INVALID_PIX_EVP") >= 0 || code.indexOf("PIX_EVP_INVALID") >= 0 ||
        code.indexOf("CHAVE_PIX_ALEATORIA_INVALIDA") >= 0 || code.indexOf("PIX_CHAVE_ALEATORIA_INVAL") >= 0) {
      return "Informe uma chave aleatória Pix válida.";
    }
    if (code.indexOf("INVALID_PIX_KEY") >= 0) {
      return "Informe uma chave Pix válida.";
    }
    if (code.indexOf("HOLDER_DATA_MISMATCH") >= 0 || code.indexOf("CPF_KEY_MUST_MATCH_USER") >= 0 ||
        code.indexOf("REJECTED_DIVERGENCE") >= 0 || code.indexOf("TITULAR") >= 0 ||
        code.indexOf("OWNERSHIP") >= 0 || code.indexOf("DIVERGEN") >= 0) {
      return "Esta chave Pix não corresponde ao titular do cadastro. Confira os dados ou use uma chave do mesmo CPF.";
    }
    if (code.indexOf("PIX_KEY_NOT_VALIDATED") >= 0 || code.indexOf("KEY_NOT_FOUND") >= 0 ||
        code.indexOf("PIX_KEY_INVALID") >= 0 || code.indexOf("REJECTED_PROVIDER") >= 0) {
      return "A chave Pix não foi localizada. Confira o tipo e a chave informados.";
    }
    if (code.indexOf("VALIDATION_IN_PROGRESS") >= 0) {
      return "A verificação desta chave Pix já está em andamento. Aguarde alguns segundos e tente novamente.";
    }
    if (code.indexOf("PROVIDER_DATA_ANOMALOUS") >= 0 || code.indexOf("REVIEW_REQUIRED") >= 0 ||
        code.indexOf("CONSISTENCY") >= 0 || code === "INVALID_RESPONSE") {
      return "A instituição retornou dados que não puderam ser confirmados com segurança. Confira a chave ou tente novamente mais tarde.";
    }
    if (code.indexOf("ASAAS") >= 0 || code.indexOf("PROVIDER_ERROR") >= 0 ||
        code.indexOf("BACKEND_UNAVAILABLE") >= 0 || code.indexOf("BACKEND_INVALID_RESPONSE") >= 0) {
      return "O serviço de consulta Pix está temporariamente indisponível. Tente novamente mais tarde.";
    }
    if (status >= 500 || code === "REQUEST_TIMEOUT" || code.indexOf("FAILED TO FETCH") >= 0 ||
        code.indexOf("NETWORK") >= 0 || code.indexOf("LOAD FAILED") >= 0) {
      return "Não foi possível consultar a chave Pix agora. Tente novamente em instantes.";
    }
    if (confirming) return "Não foi possível confirmar esta chave Pix. Verifique novamente e repita a confirmação.";
    return "Não foi possível confirmar que esta chave Pix pertence ao titular do cadastro. Confira os dados ou use outra chave.";
  }

  function isPixRelatedError(error) {
    var code = (cleanText(error && error.code) || cleanText(error && error.message) || cleanText(error)).toUpperCase();
    return /PIX|ASAAS|EVP|PHONE|CELULAR|TITULAR|HOLDER|OWNERSHIP|DIVERGEN/.test(code);
  }

  function renderPixValidationResult(prefix, details) {
    setText(prefix + "PixResultHolderName", details.holderName);
    setText(prefix + "PixResultHolderCpf", details.holderCpf);
    setText(prefix + "PixResultBankName", [details.bankCode, details.bankName].filter(Boolean).join(" "));
    qs(prefix + "PixResult").hidden = false;
    setPixConfirmedPanel(prefix, false);
  }

  async function verifyPixKey(prefix) {
    var existingFlow = pixState(prefix);
    if (existingFlow.validating || existingFlow.confirming) return false;
    if (currentPixIsPersisted(prefix) || currentPixIsVerified(prefix)) return true;
    var submitted = currentPixSnapshot(prefix);
    var minimumFormat = validatePixMinimumFormat(submitted.type, submitted.key);
    if (!minimumFormat.valid) {
      setPixWorkflowStatus(prefix, minimumFormat.message, "error");
      updatePixActions(prefix);
      return false;
    }
    clearPendingPix(prefix, false);
    var flow = pixState(prefix);
    var requestSequence = ++flow.requestSequence;
    flow.validating = true;
    setBusy(prefix + "PixVerify", true, "Verificando...");
    setPixWorkflowStatus(prefix, "Consultando a chave Pix com segurança...", "warn");
    clearPixResult(prefix);
    setPixConfirmedPanel(prefix, false);
    updatePixActions(prefix);
    try {
      var response = await edgeFunction(CONFIG.edgeFunctions.validatePixKey, {
        type: pixProviderType(submitted.type),
        key: submitted.key
      });
      if (requestSequence !== flow.requestSequence || !samePixSnapshot(prefix, submitted.type, submitted.fingerprint)) return false;
      var details = normalizePixValidationResponse(response, submitted);
      clearPixRateLimit(prefix);
      flow.validationId = details.validationId;
      flow.validationType = submitted.type;
      flow.validationKeyFingerprint = submitted.fingerprint;
      flow.expiresAt = details.expiresAt;
      flow.verified = true;
      renderPixValidationResult(prefix, details);
      setPixWorkflowStatus(prefix, "Chave localizada. Confira os dados abaixo e confirme a titularidade.", "ok");
      schedulePixExpiration(prefix);
      return true;
    } catch (error) {
      if (requestSequence !== flow.requestSequence) return false;
      flow.validationId = "";
      flow.validationType = "";
      flow.validationKeyFingerprint = "";
      flow.expiresAt = 0;
      flow.verified = false;
      clearPixResult(prefix);
      if (numberValue(error && error.status, 0) === 429 || cleanText(error && error.code).toUpperCase().indexOf("RATE_LIMIT") >= 0) {
        schedulePixRateLimit(prefix, error.retryAfterMs || 30000);
      }
      setPixWorkflowStatus(prefix, pixErrorMessage(error, false), "error");
      return false;
    } finally {
      if (requestSequence === flow.requestSequence) {
        flow.validating = false;
        setBusy(prefix + "PixVerify", false);
        updatePixActions(prefix);
      }
    }
  }

  async function confirmPixKey(prefix) {
    var flow = pixState(prefix);
    if (flow.confirming || flow.validating) return false;
    if (!flow.verified || pixValidationExpired(flow)) {
      expirePixValidation(prefix, flow.validationId);
      return false;
    }
    if (!samePixSnapshot(prefix, flow.validationType, flow.validationKeyFingerprint)) {
      clearPendingPix(prefix, true);
      return false;
    }
    var validationId = flow.validationId;
    var submitted = currentPixSnapshot(prefix);
    var requestSequence = ++flow.requestSequence;
    flow.confirming = true;
    qs(prefix + "PixType").disabled = true;
    qs(prefix + "PixKey").disabled = true;
    setBusy(prefix + "PixConfirm", true, "Confirmando...");
    setPixWorkflowStatus(prefix, "Registrando sua confirmação...", "warn");
    updatePixActions(prefix);
    try {
      var response = await edgeFunction(CONFIG.edgeFunctions.confirmPixKey, {
        validationId: validationId,
        confirmed: true
      });
      if (requestSequence !== flow.requestSequence) return false;
      if (!pixConfirmationAccepted(response)) {
        var invalidConfirmation = new Error("pix_confirmation_response_invalid");
        invalidConfirmation.code = "INVALID_RESPONSE";
        throw invalidConfirmation;
      }
      clearPixRateLimit(prefix);
      flow.persisted = true;
      flow.persistedType = submitted.type;
      flow.persistedKeyFingerprint = submitted.fingerprint;
      flow.persistedMasked = pixConfirmationMaskedKey(response, submitted.type, submitted.key);
      flow.verified = false;
      flow.validationId = "";
      flow.expiresAt = 0;
      clearPixExpiry(flow);
      clearPixResult(prefix);
      setPixConfirmedPanel(prefix, true, "A confirmação foi registrada. Se alterar o tipo ou a chave, será necessário verificar novamente.");
      setPixWorkflowStatus(prefix, "", null);
      return true;
    } catch (error) {
      if (requestSequence !== flow.requestSequence) return false;
      if (numberValue(error && error.status, 0) === 429 || cleanText(error && error.code).toUpperCase().indexOf("RATE_LIMIT") >= 0) {
        schedulePixRateLimit(prefix, error.retryAfterMs || 30000);
      }
      flow.verified = false;
      flow.validationId = "";
      flow.expiresAt = 0;
      clearPixExpiry(flow);
      clearPixResult(prefix);
      setPixWorkflowStatus(prefix, pixErrorMessage(error, true), "error");
      return false;
    } finally {
      if (requestSequence === flow.requestSequence) {
        flow.confirming = false;
        qs(prefix + "PixType").disabled = false;
        qs(prefix + "PixKey").disabled = false;
        setBusy(prefix + "PixConfirm", false);
        updatePixActions(prefix);
      }
    }
  }

  function initializePixValidation(prefix, profile) {
    var flow = pixState(prefix);
    flow.hasStoredKey = prefix === "profile" && (
      booleanValue(profile.cadastrado, false) || !!profile.pix_mascarado || !!profile.pix_chave
    );
    flow.storedConfirmed = prefix === "profile" && booleanValue(firstDefined([
      profile.pix_confirmado,
      profile.pix_validado,
      profile.confirmado,
      profile.validado
    ], false), false);
    flow.storedType = prefix === "profile" && flow.hasStoredKey ? normalizePixType(firstDefined([
      profile.pix_tipo, profile.tipo, profile.tipo_chave_pix
    ], qs(prefix + "PixType").value)) : "";
    flow.storedMasked = prefix === "profile" ? cleanText(firstDefined([
      profile.pix_mascarado, profile.chave_mascarada
    ], "")) : "";
    clearPendingPix(prefix, true);
    updatePixActions(prefix);
  }

  async function ensurePixReadyForSubmission(prefix) {
    var flow = pixState(prefix);
    if (prefix === "profile" && !profilePixChangeRequested() && flow.storedConfirmed) return true;
    var current = currentPixSnapshot(prefix);
    var minimumFormat = validatePixMinimumFormat(current.type, current.key);
    if (!minimumFormat.valid) {
      var missingStoredKey = prefix === "profile" && pixState(prefix).hasStoredKey && !current.key;
      var message = missingStoredKey ?
        "Informe novamente a chave Pix atual para verificar e confirmar." : minimumFormat.message;
      setPixWorkflowStatus(prefix, message, "error");
      var invalidKey = qs(prefix + "PixKey");
      if (invalidKey) invalidKey.focus();
      updatePixActions(prefix);
      return false;
    }
    if (currentPixIsPersisted(prefix)) return true;
    if (!currentPixIsVerified(prefix)) {
      var verified = await verifyPixKey(prefix);
      if (!verified) return false;
    }
    if (!currentPixIsPersisted(prefix)) {
      setPixWorkflowStatus(prefix, "Confira os dados encontrados e toque em Confirmar.", "warn");
      updatePixActions(prefix);
      return false;
    }
    return true;
  }

  function showPixFormError(prefix, statusId, error) {
    var raw = cleanText(error && (error.message || error));
    var pixRelated = isPixRelatedError(error);
    var codedError = !!cleanText(error && error.code) || /^[A-Z0-9_]+$/i.test(raw);
    var message = pixRelated && codedError ? pixErrorMessage(error, false) : friendlyMessage(raw);
    if (pixRelated) setPixWorkflowStatus(prefix, message, "error");
    else setStatus(statusId, message, "error");
  }

  function setupPixValidationForms() {
    ["enrollment", "profile"].forEach(function (prefix) {
      on(prefix + "PixType", "change", function () {
        clearPendingPix(prefix, true);
        updatePixActions(prefix);
      });
      on(prefix + "PixKey", "input", function () {
        clearPendingPix(prefix, true);
        updatePixActions(prefix);
      });
      on(prefix + "PixKey", "blur", function () {
        if (currentPixIsPersisted(prefix) || currentPixIsVerified(prefix)) return;
        var minimumFormat = currentPixMinimumFormat(prefix);
        if (!minimumFormat.valid) {
          setPixWorkflowStatus(prefix, minimumFormat.message, "error");
          updatePixActions(prefix);
          return;
        }
        verifyPixKey(prefix);
      });
      on(prefix + "PixVerify", "click", function () { verifyPixKey(prefix); });
      on(prefix + "PixConfirm", "click", function () { confirmPixKey(prefix); });
      on(prefix + "PixCorrect", "click", function () {
        clearPendingPix(prefix, true);
        var key = qs(prefix + "PixKey");
        key.focus();
        if (typeof key.select === "function") key.select();
      });
      updatePixActions(prefix);
    });
  }

  function normalizeSearchText(value) {
    return cleanText(value).toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function addressContext(prefix) {
    if (!addressState.contexts[prefix]) {
      addressState.contexts[prefix] = {
        prefix: prefix,
        states: staticAddressStates(prefix),
        cities: [],
        selectedState: null,
        selectedCity: null,
        stateTimer: null,
        cityTimer: null,
        postalCodeTimer: null,
        postalLookupRequest: 0,
        reversePostalCodeTimer: null,
        reverseRequest: 0,
        resolvedPostalCode: "",
        resolvedAddressKey: "",
        postalCodeConsistent: false,
        stateRequest: 0,
        cityRequest: 0,
        reverseResults: []
      };
    }
    return addressState.contexts[prefix];
  }

  function staticAddressStates(prefix) {
    var field = qs(prefix + "State");
    if (!field || !field.options) return [];
    return Array.prototype.slice.call(field.options).filter(function (option) {
      return /^[A-Z]{2}$/.test(cleanText(option.value).toUpperCase());
    }).map(function (option) {
      var uf = cleanText(option.value).toUpperCase();
      var label = cleanText(option.textContent);
      return normalizeStateRow({ uf: uf, nome: cleanText(label.replace(new RegExp("^" + uf + "\\s*-\\s*", "i"), "")) || uf });
    });
  }

  function findStaticAddressState(prefix, value) {
    var search = normalizeSearchText(value);
    if (!search) return null;
    return addressContext(prefix).states.find(function (row) {
      return normalizeSearchText(row.uf) === search || normalizeSearchText(row.nome) === search;
    }) || null;
  }

  function normalizeStateRow(raw) {
    var row = raw || {};
    return Object.assign({}, row, {
      cod_estado: firstDefined([row.cod_estado, row.id_estado, row.id], null),
      uf: cleanText(firstDefined([row.uf, row.sigla], "")).toUpperCase(),
      nome: cleanText(firstDefined([row.nome, row.estado, row.nome_estado], ""))
    });
  }

  function normalizeCityRow(raw, fallbackUf) {
    var row = raw || {};
    return Object.assign({}, row, {
      cod_cidade: firstDefined([row.cod_cidade, row.id_cidade, row.id], null),
      cod_estado: firstDefined([row.cod_estado, row.id_estado], null),
      ibge: cleanText(firstDefined([row.ibge, row.codigo_ibge, row.cidade_ibge], "")),
      uf: cleanText(firstDefined([row.uf, row.estado_uf, fallbackUf], "")).toUpperCase(),
      nome: cleanText(firstDefined([row.nome, row.cidade, row.nome_cidade], ""))
    });
  }

  function setAddressStatus(prefix, text, kind) {
    var element = qs(prefix + "PostalCodeStatus");
    if (!element) return;
    element.textContent = text || "";
    element.classList.remove("is-error", "is-ok", "is-warn");
    if (kind) element.classList.add("is-" + kind);
  }

  function currentAddressKey(prefix) {
    return [
      cleanText(qs(prefix + "State").value).toUpperCase(),
      normalizeSearchText(qs(prefix + "City").value),
      normalizeSearchText(qs(prefix + "Address").value)
    ].join("|");
  }

  function addressHasReverseLookupKey(prefix) {
    return /^[A-Z]{2}$/.test(cleanText(qs(prefix + "State").value).toUpperCase()) && cleanText(qs(prefix + "City").value).length >= 3 && cleanText(qs(prefix + "Address").value).length >= 3;
  }

  function updatePostalCodeSearchButton(prefix) {
    var button = qs(prefix + "FindPostalCode");
    if (!button) return;
    button.hidden = addressContext(prefix).postalCodeConsistent;
  }

  function markAddressResolved(prefix) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    context.resolvedPostalCode = cep.length === 8 ? cep : "";
    context.resolvedAddressKey = currentAddressKey(prefix);
    context.postalCodeConsistent = !!context.resolvedPostalCode && addressHasReverseLookupKey(prefix);
    updatePostalCodeSearchButton(prefix);
    if (prefix === "enrollment") updateEnrollmentSubmitState();
  }

  function markAddressPending(prefix, scheduleLookup, delay) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    var unchanged = cep.length === 8 && cep === context.resolvedPostalCode && currentAddressKey(prefix) === context.resolvedAddressKey;
    if (unchanged) {
      context.postalCodeConsistent = true;
      updatePostalCodeSearchButton(prefix);
      if (prefix === "enrollment") updateEnrollmentSubmitState();
      return;
    }
    context.postalCodeConsistent = false;
    updatePostalCodeSearchButton(prefix);
    if (prefix === "enrollment") updateEnrollmentSubmitState();
    context.postalLookupRequest += 1;
    window.clearTimeout(context.reversePostalCodeTimer);
    if (!addressHasReverseLookupKey(prefix)) {
      setAddressStatus(prefix, "Endereço alterado. Complete UF, cidade e logradouro ou digite um CEP válido.", "warn");
      return;
    }
    setAddressStatus(prefix, "Endereço alterado. Conferindo o CEP correspondente...", "warn");
    if (scheduleLookup !== false) {
      context.reversePostalCodeTimer = window.setTimeout(function () {
        findPostalCodeByAddress(prefix, true);
      }, delay == null ? 700 : delay);
    }
  }

  function hideAddressOptions(prefix, kind) {
    var list = qs(prefix + (kind === "state" ? "StateList" : "CityList"));
    if (!list) return;
    list.hidden = true;
    list.innerHTML = "";
  }

  function addressOptionHtml(label, index) {
    return "<button class=\"mmn-address-option\" type=\"button\" role=\"option\" data-address-index=\"" + escapeHtml(index) + "\">" + escapeHtml(label) + "</button>";
  }

  function renderStateOptions(prefix, rows) {
    var list = qs(prefix + "StateList");
    if (!list) return;
    list.innerHTML = rows.length ? rows.map(function (row, index) {
      return addressOptionHtml(row.uf + " - " + row.nome, index);
    }).join("") : "<div class=\"mmn-address-option\" role=\"option\">Nenhum estado encontrado.</div>";
    list.hidden = false;
  }

  function renderCityOptions(prefix, rows) {
    var list = qs(prefix + "CityList");
    if (!list) return;
    list.innerHTML = rows.length ? rows.map(function (row, index) {
      return addressOptionHtml(row.nome + " - " + row.uf, index);
    }).join("") : "";
    list.hidden = !rows.length;
  }

  async function loadAddressStates(prefix, search, showOptions) {
    var context = addressContext(prefix);
    context.states = staticAddressStates(prefix);
    var selected = findStaticAddressState(prefix, search);
    if (selected) context.selectedState = selected;
    if (showOptions !== false && !qs(prefix + "State").options) renderStateOptions(prefix, context.states);
    return context.states;
  }

  async function loadAddressCities(prefix, search, showOptions) {
    var context = addressContext(prefix);
    var stateInput = qs(prefix + "State");
    var cityInput = qs(prefix + "City");
    var uf = context.selectedState ? context.selectedState.uf : cleanText(stateInput && stateInput.value).toUpperCase();
    if (!/^[A-Z]{2}$/.test(uf) || !cityInput || cityInput.disabled) {
      context.cities = [];
      renderCityOptions(prefix, []);
      return;
    }
    var request = ++context.cityRequest;
    try {
      var data = await rpc(CONFIG.rpcs.locationCities, {
        p_uf: uf,
        p_busca: cleanText(search),
        p_limite: 40
      });
      if (request !== context.cityRequest) return;
      context.cities = listFrom(data, ["cidades", "itens"]).map(function (row) {
        return normalizeCityRow(row, uf);
      }).filter(function (row) {
        return row.nome && row.uf === uf;
      });
      if (showOptions !== false) renderCityOptions(prefix, context.cities);
    } catch (error) {
      if (request !== context.cityRequest) return;
      context.cities = [];
      renderCityOptions(prefix, []);
      setAddressStatus(prefix, "Não foi possível carregar as cidades agora.", "error");
    }
  }

  function selectAddressState(prefix, row, preserveCity) {
    var context = addressContext(prefix);
    var normalized = normalizeStateRow(row);
    if (!/^[A-Z]{2}$/.test(normalized.uf)) return;
    context.selectedState = normalized;
    qs(prefix + "State").value = normalized.uf;
    hideAddressOptions(prefix, "state");
    var cityInput = qs(prefix + "City");
    cityInput.disabled = false;
    cityInput.placeholder = "Digite e selecione a cidade";
    if (!preserveCity) {
      context.selectedCity = null;
      cityInput.value = "";
    }
  }

  function selectAddressCity(prefix, row) {
    var context = addressContext(prefix);
    var normalized = normalizeCityRow(row, context.selectedState && context.selectedState.uf);
    if (!normalized.nome) return;
    context.selectedCity = normalized;
    qs(prefix + "City").value = normalized.nome;
    hideAddressOptions(prefix, "city");
  }

  function selectTypedAddressState(prefix, allowSingleMatch, preserveCity) {
    var context = addressContext(prefix);
    var search = normalizeSearchText(qs(prefix + "State").value);
    if (!search) return false;
    var exact = context.states.find(function (row) {
      return normalizeSearchText(row.uf) === search || normalizeSearchText(row.nome) === search;
    });
    var matches = context.states.filter(function (row) {
      return normalizeSearchText(row.uf).indexOf(search) >= 0 || normalizeSearchText(row.nome).indexOf(search) >= 0;
    });
    var selected = exact || (allowSingleMatch && matches.length === 1 ? matches[0] : null);
    if (!selected) return false;
    selectAddressState(prefix, selected, !!preserveCity);
    loadAddressCities(prefix, preserveCity ? qs(prefix + "City").value : "", preserveCity ? false : true);
    return true;
  }

  function selectTypedAddressCity(prefix) {
    var context = addressContext(prefix);
    var search = normalizeSearchText(qs(prefix + "City").value);
    var selected = context.cities.find(function (row) { return normalizeSearchText(row.nome) === search; });
    if (!selected) return false;
    selectAddressCity(prefix, selected);
    return true;
  }

  async function fetchAddressJson(url) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, CONFIG.addressRequestTimeoutMs) : null;
    try {
      var response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      });
      if (!response.ok) throw new Error("Falha HTTP " + response.status + ".");
      return await response.json();
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function normalizeViaCep(raw) {
    var row = raw || {};
    return {
      cep: digitsOnly(row.cep),
      logradouro: cleanText(row.logradouro),
      complemento: cleanText(row.complemento),
      bairro: cleanText(row.bairro),
      cidade: cleanText(row.localidade),
      uf: cleanText(row.uf).toUpperCase(),
      ibge: cleanText(row.ibge)
    };
  }

  function normalizeBrasilApi(raw) {
    var row = raw || {};
    return {
      cep: digitsOnly(row.cep),
      logradouro: cleanText(row.street),
      complemento: "",
      bairro: cleanText(row.neighborhood),
      cidade: cleanText(row.city),
      uf: cleanText(row.state).toUpperCase(),
      ibge: cleanText(row.city_ibge)
    };
  }

  async function findAddressByPostalCode(postalCode) {
    var cep = digitsOnly(postalCode);
    if (addressState.postalCodeCache[cep]) return addressState.postalCodeCache[cep];
    var viaCepError = null;
    try {
      var viaCep = await fetchAddressJson("https://viacep.com.br/ws/" + encodeURIComponent(cep) + "/json/");
      if (!viaCep.erro) {
        var normalizedViaCep = normalizeViaCep(viaCep);
        addressState.postalCodeCache[cep] = normalizedViaCep;
        return normalizedViaCep;
      }
      viaCepError = new Error("CEP não encontrado.");
    } catch (error) {
      viaCepError = error;
    }
    try {
      var brasilApi = await fetchAddressJson("https://brasilapi.com.br/api/cep/v2/" + encodeURIComponent(cep));
      var normalizedBrasilApi = normalizeBrasilApi(brasilApi);
      addressState.postalCodeCache[cep] = normalizedBrasilApi;
      return normalizedBrasilApi;
    } catch (error) {
      if (window.console && console.warn) console.warn("Falha nas consultas de CEP.", viaCepError, error);
      throw new Error("Não foi possível localizar esse CEP.");
    }
  }

  function setAddressSelectionFromLookup(prefix, address) {
    var context = addressContext(prefix);
    var stateRow = context.states.find(function (row) { return row.uf === address.uf; }) || { uf: address.uf, nome: address.uf };
    selectAddressState(prefix, stateRow, true);
    var cityRow = context.cities.find(function (row) {
      return row.uf === address.uf && normalizeSearchText(row.nome) === normalizeSearchText(address.cidade);
    }) || { nome: address.cidade, uf: address.uf, ibge: address.ibge };
    selectAddressCity(prefix, cityRow);
  }

  function fillAddressFromLookup(prefix, address, focusNumber) {
    qs(prefix + "PostalCode").value = formatPostalCode(address.cep);
    qs(prefix + "Address").value = address.logradouro || "";
    qs(prefix + "District").value = address.bairro || "";
    qs(prefix + "City").value = address.cidade || "";
    qs(prefix + "State").value = address.uf || "";
    setAddressSelectionFromLookup(prefix, address);
    var resolvedKey = currentAddressKey(prefix);
    loadAddressCities(prefix, address.cidade, false).then(function () {
      if (currentAddressKey(prefix) !== resolvedKey) return;
      selectTypedAddressCity(prefix);
      hideAddressOptions(prefix, "city");
      markAddressResolved(prefix);
    }).catch(function () {});
    markAddressResolved(prefix);
    if (focusNumber) qs(prefix + "AddressNumber").focus();
  }

  async function lookupAddressByPostalCode(prefix, postalCode, focusNumber) {
    var context = addressContext(prefix);
    var cep = digitsOnly(postalCode);
    if (cep.length !== 8) return;
    var request = ++context.postalLookupRequest;
    setAddressStatus(prefix, "Consultando o CEP...", null);
    var expectedCep = cep;
    try {
      var address = await findAddressByPostalCode(cep);
      if (request !== context.postalLookupRequest || digitsOnly(qs(prefix + "PostalCode").value) !== expectedCep) return;
      fillAddressFromLookup(prefix, address, focusNumber);
      setAddressStatus(prefix, "Endereço encontrado.", "ok");
    } catch (error) {
      if (request !== context.postalLookupRequest || digitsOnly(qs(prefix + "PostalCode").value) !== expectedCep) return;
      setAddressStatus(prefix, error.message || "Não foi possível consultar o CEP.", "error");
    }
  }

  function resetReversePostalCodeResults(prefix) {
    var context = addressContext(prefix);
    context.reverseResults = [];
    var container = qs(prefix + "PostalCodeResults");
    var select = qs(prefix + "PostalCodeSelect");
    container.hidden = true;
    select.innerHTML = "<option value=\"\">Selecione</option>";
  }

  async function findPostalCodeByAddress(prefix, automatic) {
    var context = addressContext(prefix);
    var uf = cleanText(qs(prefix + "State").value).toUpperCase();
    var city = cleanText(qs(prefix + "City").value);
    var street = cleanText(qs(prefix + "Address").value);
    var expectedKey = currentAddressKey(prefix);
    var request = ++context.reverseRequest;
    resetReversePostalCodeResults(prefix);
    if (!/^[A-Z]{2}$/.test(uf)) {
      setAddressStatus(prefix, "Selecione uma UF válida.", "error");
      qs(prefix + "State").focus();
      return;
    }
    if (city.length < 3) {
      setAddressStatus(prefix, "Informe uma cidade com pelo menos 3 caracteres.", "error");
      qs(prefix + "City").focus();
      return;
    }
    if (street.length < 3) {
      setAddressStatus(prefix, "Informe uma rua ou avenida com pelo menos 3 caracteres.", "error");
      qs(prefix + "Address").focus();
      return;
    }
    setAddressStatus(prefix, "Procurando o CEP do endereço...", null);
    var url = [
      "https://viacep.com.br/ws",
      encodeURIComponent(uf),
      encodeURIComponent(city),
      encodeURIComponent(street),
      "json/"
    ].join("/");
    try {
      var data = await fetchAddressJson(url);
      if (request !== context.reverseRequest || currentAddressKey(prefix) !== expectedKey) return;
      var unique = {};
      (Array.isArray(data) ? data : []).forEach(function (item) {
        var normalized = normalizeViaCep(item);
        if (normalized.cep.length === 8 && !unique[normalized.cep]) unique[normalized.cep] = normalized;
      });
      var rows = Object.keys(unique).map(function (key) { return unique[key]; });
      var district = normalizeSearchText(qs(prefix + "District").value);
      if (district && rows.length > 1) {
        var districtMatches = rows.filter(function (row) { return normalizeSearchText(row.bairro) === district; });
        if (districtMatches.length) rows = districtMatches;
      }
      if (!rows.length) throw new Error("Corrija o endereço ou digite um CEP válido.");
      if (rows.length === 1) {
        fillAddressFromLookup(prefix, rows[0], true);
        setAddressStatus(prefix, "CEP encontrado.", "ok");
        return;
      }
      context.reverseResults = rows;
      context.postalCodeConsistent = false;
      updatePostalCodeSearchButton(prefix);
      var select = qs(prefix + "PostalCodeSelect");
      select.innerHTML = "<option value=\"\">Selecione um dos " + rows.length + " endereços encontrados</option>" + rows.map(function (row, index) {
        var label = [formatPostalCode(row.cep), row.logradouro, row.bairro, row.cidade + "/" + row.uf].filter(Boolean).join(" - ");
        return "<option value=\"" + index + "\">" + escapeHtml(label) + "</option>";
      }).join("");
      qs(prefix + "PostalCodeResults").hidden = false;
      setAddressStatus(prefix, "Foram encontrados vários CEPs. Selecione o endereço correto para confirmar.", "warn");
    } catch (error) {
      if (request !== context.reverseRequest || currentAddressKey(prefix) !== expectedKey) return;
      context.postalCodeConsistent = false;
      updatePostalCodeSearchButton(prefix);
      var message = error.message || "Corrija o endereço ou digite um CEP válido.";
      if (automatic && /^Não foi possível/i.test(message)) message = "Corrija o endereço ou digite um CEP válido.";
      setAddressStatus(prefix, message, "error");
    }
  }

  function setupAddressForm(prefix) {
    var context = addressContext(prefix);
    var postalCode = qs(prefix + "PostalCode");
    var stateInput = qs(prefix + "State");
    var cityInput = qs(prefix + "City");
    if (!postalCode || !stateInput || !cityInput) return;

    postalCode.addEventListener("input", function () {
      window.clearTimeout(context.postalCodeTimer);
      window.clearTimeout(context.reversePostalCodeTimer);
      context.reverseRequest += 1;
      context.postalLookupRequest += 1;
      context.postalCodeConsistent = false;
      updatePostalCodeSearchButton(prefix);
      var cep = digitsOnly(postalCode.value).slice(0, 8);
      postalCode.value = formatPostalCode(cep);
      resetReversePostalCodeResults(prefix);
      if (cep.length !== 8) {
        setAddressStatus(prefix, "", null);
        return;
      }
      context.postalCodeTimer = window.setTimeout(function () {
        lookupAddressByPostalCode(prefix, cep, true);
      }, 300);
    });

    stateInput.addEventListener("change", function () {
      context.selectedState = null;
      context.selectedCity = null;
      cityInput.value = "";
      hideAddressOptions(prefix, "city");
      if (!selectTypedAddressState(prefix, true)) {
        cityInput.disabled = true;
        cityInput.placeholder = "Selecione o estado primeiro";
        markAddressPending(prefix, false);
        return;
      }
      markAddressPending(prefix, false);
    });

    cityInput.addEventListener("focus", function () {
      if (!cityInput.disabled) loadAddressCities(prefix, cityInput.value);
    });
    cityInput.addEventListener("input", function () {
      window.clearTimeout(context.cityTimer);
      context.selectedCity = null;
      context.cityTimer = window.setTimeout(function () { loadAddressCities(prefix, cityInput.value); }, 180);
      markAddressPending(prefix, true, 850);
    });
    cityInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideAddressOptions(prefix, "city");
    });
    cityInput.addEventListener("blur", function () {
      window.setTimeout(function () {
        if (!context.selectedCity) selectTypedAddressCity(prefix);
        hideAddressOptions(prefix, "city");
        markAddressPending(prefix, true, 120);
      }, 140);
    });

    qs(prefix + "Address").addEventListener("input", function () { markAddressPending(prefix, true, 850); });
    qs(prefix + "Address").addEventListener("blur", function () { markAddressPending(prefix, true, 120); });
    qs(prefix + "District").addEventListener("change", function () {
      if (!context.postalCodeConsistent) markAddressPending(prefix, true, 120);
    });

    var stateList = qs(prefix + "StateList");
    if (stateList) {
      stateList.addEventListener("mousedown", function (event) { event.preventDefault(); });
      stateList.addEventListener("click", function (event) {
        var button = event.target.closest("[data-address-index]");
        if (!button) return;
        var selected = context.states[integerValue(button.dataset.addressIndex)];
        if (!selected) return;
        selectAddressState(prefix, selected, false);
        loadAddressCities(prefix, "");
      });
    }
    qs(prefix + "CityList").addEventListener("mousedown", function (event) { event.preventDefault(); });
    qs(prefix + "CityList").addEventListener("click", function (event) {
      var button = event.target.closest("[data-address-index]");
      if (!button) return;
      var selected = context.cities[integerValue(button.dataset.addressIndex)];
      if (selected) {
        selectAddressCity(prefix, selected);
        markAddressPending(prefix, true, 120);
      }
    });
    qs(prefix + "FindPostalCode").addEventListener("click", function () { findPostalCodeByAddress(prefix, false); });
    qs(prefix + "PostalCodeSelect").addEventListener("change", function () {
      var index = integerValue(qs(prefix + "PostalCodeSelect").value, -1);
      var selected = context.reverseResults[index];
      if (!selected) return;
      fillAddressFromLookup(prefix, selected, true);
      resetReversePostalCodeResults(prefix);
      setAddressStatus(prefix, "CEP selecionado com sucesso.", "ok");
    });
    updatePostalCodeSearchButton(prefix);
  }

  function setupAddressForms() {
    ["enrollment", "profile"].forEach(setupAddressForm);
  }

  function validateAddressForSubmission(prefix, required) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    var street = cleanText(qs(prefix + "Address").value);
    var number = cleanText(qs(prefix + "AddressNumber").value);
    var district = cleanText(qs(prefix + "District").value);
    var city = cleanText(qs(prefix + "City").value);
    var uf = cleanText(qs(prefix + "State").value).toUpperCase();
    var hasAddress = !!(cep || street || number || district || city || uf);
    if ((required || cep) && cep.length !== 8) throw new Error("Informe um CEP válido com 8 dígitos.");
    if ((required || uf) && !/^[A-Z]{2}$/.test(uf)) throw new Error("Selecione uma UF válida.");
    if (required && (!street || !number || !district || !city)) throw new Error("Complete o endereço para os dados do RPA.");
    if (!required && hasAddress && city && !uf) throw new Error("Selecione a UF do endereço.");
    if (hasAddress && (!context.postalCodeConsistent || context.resolvedPostalCode !== cep || context.resolvedAddressKey !== currentAddressKey(prefix))) {
      throw new Error("O CEP e o endereço ainda não foram confirmados. Corrija o endereço, selecione um dos CEPs encontrados ou digite um CEP válido.");
    }
    return true;
  }

  function enrollmentCompletionIssue() {
    if (!currentPixIsPersisted("enrollment")) {
      return {
        scope: "pix",
        message: "Verifique, confira e confirme a chave Pix antes de concluir a adesão.",
        element: qs("enrollmentPixKey")
      };
    }

    var requiredFields = [
      ["enrollmentPostalCode", "Informe um CEP válido com 8 dígitos."],
      ["enrollmentAddress", "Informe a rua ou avenida."],
      ["enrollmentAddressNumber", "Informe o número do endereço."],
      ["enrollmentDistrict", "Informe o bairro."],
      ["enrollmentState", "Selecione a UF do endereço."],
      ["enrollmentCity", "Informe e selecione a cidade."]
    ];
    for (var index = 0; index < requiredFields.length; index += 1) {
      var field = qs(requiredFields[index][0]);
      if (!field || !cleanText(field.value)) {
        return { scope: "form", message: requiredFields[index][1], element: field };
      }
    }
    if (digitsOnly(qs("enrollmentPostalCode").value).length !== 8) {
      return { scope: "form", message: "Informe um CEP válido com 8 dígitos.", element: qs("enrollmentPostalCode") };
    }
    var address = addressContext("enrollment");
    if (!address.postalCodeConsistent ||
        address.resolvedPostalCode !== digitsOnly(qs("enrollmentPostalCode").value) ||
        address.resolvedAddressKey !== currentAddressKey("enrollment")) {
      return {
        scope: "form",
        message: "Confirme o CEP e o endereço antes de concluir a adesão.",
        element: qs("enrollmentPostalCode")
      };
    }
    if (!qs("enrollmentTerms").checked) {
      return {
        scope: "form",
        message: "Leia e aceite o regulamento vigente para concluir a adesão.",
        element: qs("enrollmentTerms")
      };
    }
    return null;
  }

  function updateEnrollmentSubmitState() {
    var button = qs("enrollmentSubmit");
    if (!button || button.dataset.busy) return;
    var blocked = !!enrollmentCompletionIssue();
    button.disabled = false;
    button.classList.toggle("is-inactive", blocked);
    button.dataset.inactive = blocked ? "true" : "false";
    button.removeAttribute("aria-disabled");
  }

  function showEnrollmentCompletionIssue(issue) {
    if (!issue) return false;
    if (issue.scope === "pix") setPixWorkflowStatus("enrollment", issue.message, "error");
    else setStatus("enrollmentStatus", issue.message, "error");
    if (issue.element && typeof issue.element.focus === "function") issue.element.focus();
    return true;
  }

  function normalizeCapabilities(context) {
    var result = { acessar: false, suporte: false, configurar: false, fechar: false, pagar: false, financeiro: false, fiscal: false, auditar: false, superadmin: false };
    var profile = objectFrom(context, ["perfil"]);
    var profileKey = String(profile.chave || context.perfil_chave || "").toLowerCase();
    var permissions = context.permissoes_json || context.permissoes || profile.permissoes_json || {};
    var mmn = permissions.mmn || context.mmn || {};
    var areas = listValue(context.areas);
    var superAdmin = profileKey === "super_admin" || booleanValue(context.super_admin, false);
    result.superadmin = superAdmin;
    result.acessar = superAdmin || areas.indexOf("mmn") >= 0 || booleanValue(mmn.acessar, false);
    result.suporte = superAdmin || booleanValue(mmn.suporte, false);
    result.configurar = superAdmin || booleanValue(mmn.configurar, false);
    result.fechar = superAdmin || booleanValue(mmn.fechar, false);
    result.pagar = superAdmin || booleanValue(mmn.pagar, false);
    result.financeiro = superAdmin || booleanValue(mmn.financeiro, false);
    result.fiscal = superAdmin || booleanValue(mmn.fiscal, false) || result.financeiro;
    result.auditar = superAdmin || booleanValue(mmn.auditar, false);
    return result;
  }

  function hasCapability(name) {
    return !!state.capabilities[name];
  }

  function applyAdminCapabilities() {
    qsa("[data-capability]").forEach(function (element) {
      element.hidden = !hasCapability(element.getAttribute("data-capability"));
    });
    qsa("[data-capability-any]").forEach(function (element) {
      var names = String(element.getAttribute("data-capability-any") || "").split(/\s+/).filter(Boolean);
      element.hidden = !names.some(hasCapability);
    });
    var active = document.querySelector("[data-admin-tab].is-active:not([hidden])");
    if (!active) {
      var first = document.querySelector("[data-admin-tab]:not([hidden])");
      if (first) activateAdminTab(first.getAttribute("data-admin-tab"));
    }
  }

  function userParticipation(data) {
    return objectFrom(data, ["participacao_mmn", "participacao", "adesao", "elegibilidade", "participante", "usuario_mmn"]);
  }

  function userProfile(data) {
    var profile = objectFrom(data, ["perfil_pagamento", "dados_pagamento", "rpa"]);
    return Object.assign({}, objectFrom(profile, ["dados_rpa"]), profile);
  }

  function normalizeAddressProfile(raw) {
    var source = raw || {};
    return {
      cep: firstDefined([source.cep, source.codigo_postal, source.postal_code], ""),
      logradouro: firstDefined([source.logradouro, source.endereco, source.rua, source.address], ""),
      numero: firstDefined([source.numero, source.numero_endereco, source.address_number], ""),
      complemento: firstDefined([source.complemento, source.address_extra], ""),
      bairro: firstDefined([source.bairro, source.distrito, source.neighborhood], ""),
      cidade: firstDefined([source.cidade, source.cidade_nome, source.localidade, source.city], ""),
      uf: firstDefined([source.uf, source.estado_uf, source.estado, source.state], ""),
      cod_estado: firstDefined([source.cod_estado, source.id_estado], null),
      cod_cidade: firstDefined([source.cod_cidade, source.id_cidade], null),
      cidade_ibge: firstDefined([source.cidade_ibge, source.ibge, source.codigo_ibge], "")
    };
  }

  function addressSuggestionFromDashboard(data) {
    var user = objectFrom(data, ["usuario"]);
    var sessionUser = state.session && state.session.user ? state.session.user : {};
    var candidates = [
      objectFrom(data, ["endereco_sugerido", "endereco_app", "endereco_usuario", "localizacao"]),
      state.session && state.session.endereco_sugerido ? state.session.endereco_sugerido : {},
      objectFrom(user, ["endereco", "localizacao"]),
      user,
      objectFrom(sessionUser, ["endereco", "localizacao"]),
      sessionUser
    ];
    var result = {};
    candidates.forEach(function (candidate) {
      var normalized = normalizeAddressProfile(candidate);
      Object.keys(normalized).forEach(function (key) {
        if ((result[key] === undefined || result[key] === null || result[key] === "") && normalized[key] !== undefined && normalized[key] !== null && normalized[key] !== "") {
          result[key] = normalized[key];
        }
      });
    });
    return result;
  }

  function mergeProfileAddress(profile, suggestion) {
    var result = Object.assign({}, suggestion || {}, profile || {});
    var stored = normalizeAddressProfile(profile);
    var suggested = normalizeAddressProfile(suggestion);
    Object.keys(stored).forEach(function (key) {
      result[key] = stored[key] !== undefined && stored[key] !== null && stored[key] !== "" ? stored[key] : suggested[key];
    });
    return result;
  }

  function renderEnrollment(data) {
    var participation = userParticipation(data);
    var eligibility = objectFrom(data, ["elegibilidade"]);
    var regulation = objectFrom(data, ["regulamento", "termos"]);
    var accepted = booleanValue(firstDefined([
      regulation.aceito,
      participation.aceite_vigente,
      participation.regulamento_aceito,
      eligibility.regulamento_aceito,
      participation.aderiu,
      participation.adesao_ativa,
      data.adesao_concluida,
      cleanText(participation.status).toLowerCase() === "participando"
    ], false), false);
    if (participation.status === "saida_voluntaria") accepted = false;
    qs("userEnrollment").hidden = accepted;
    qs("userDashboard").hidden = !accepted;
    if (accepted) return;
    var summaries = listFrom(regulation, ["resumo", "itens"]);
    if (!summaries.length && typeof regulation.resumo === "string" && regulation.resumo.trim()) summaries = [regulation.resumo];
    if (!summaries.length) {
      summaries = [
        "A comissão considera somente assinaturas efetivamente pagas.",
        "É necessário estar elegível na data da receita e no fechamento.",
        "Simulações não representam garantia de renda."
      ];
    }
    qs("enrollmentRuleSummary").innerHTML = summaries.map(function (item) {
      return "<div>" + escapeHtml(typeof item === "string" ? item : (item.texto || item.descricao || "")) + "</div>";
    }).join("");
    var regulationUrl = regulation.url || regulation.url_documento || "";
    var regulationVersion = regulation.versao || regulation.documento_versao || "";
    if (!regulationUrl && regulationVersion) regulationUrl = "../../regulamento-mmn.html?versao=" + encodeURIComponent(regulationVersion);
    if (regulationUrl) qs("regulationLink").href = regulationUrl;
    var profile = mergeProfileAddress(userProfile(data), addressSuggestionFromDashboard(data));
    fillUserProfileFields(profile, "enrollment");
  }

  function fillUserProfileFields(profile, prefix) {
    var context = addressContext(prefix);
    var rawState = firstDefined([profile.uf, profile.estado_uf, profile.estado, profile.state], "");
    var staticState = findStaticAddressState(prefix, rawState);
    var map = {
      PixType: normalizePixType(profile.pix_tipo || profile.tipo || profile.tipo_chave_pix) || "cpf",
      PixKey: prefix === "profile" && profile.pix_mascarado ? "" : (profile.pix_chave || profile.chave_pix || ""),
      PostalCode: formatPostalCode(profile.cep || ""),
      Address: profile.logradouro || profile.endereco || "",
      AddressNumber: profile.numero || "",
      AddressExtra: profile.complemento || "",
      District: profile.bairro || "",
      City: profile.cidade || profile.cidade_nome || "",
      State: staticState ? staticState.uf : cleanText(rawState).toUpperCase(),
      Nit: profile.nit || profile.pis_pasep || ""
    };
    Object.keys(map).forEach(function (suffix) {
      var element = qs(prefix + suffix);
      if (element) element.value = map[suffix] == null ? "" : map[suffix];
    });
    if (prefix === "profile") {
      setText("profilePixMasked", profile.pix_mascarado ? "Chave atual: " + profile.pix_mascarado : "Nenhuma chave cadastrada.");
    }
    initializePixValidation(prefix, profile);
    var uf = cleanText(map.State).toUpperCase();
    var city = cleanText(map.City);
    context.selectedState = /^[A-Z]{2}$/.test(uf) ? normalizeStateRow({
      cod_estado: firstDefined([profile.cod_estado, profile.id_estado], null),
      uf: uf,
      nome: profile.estado_nome || (staticState && staticState.nome) || uf
    }) : null;
    context.selectedCity = city ? normalizeCityRow({
      cod_cidade: firstDefined([profile.cod_cidade, profile.id_cidade], null),
      cod_estado: firstDefined([profile.cod_estado, profile.id_estado], null),
      ibge: firstDefined([profile.cidade_ibge, profile.ibge], ""),
      uf: uf,
      nome: city
    }, uf) : null;
    var cityInput = qs(prefix + "City");
    if (cityInput) {
      cityInput.disabled = !context.selectedState;
      cityInput.placeholder = context.selectedState ? "Digite e selecione a cidade" : "Selecione o estado primeiro";
    }
    var expectedState = cleanText(map.State);
    var expectedCity = cleanText(map.City);
    if (digitsOnly(map.PostalCode).length === 8 && addressHasReverseLookupKey(prefix)) markAddressResolved(prefix);
    else if (digitsOnly(map.PostalCode).length === 8) lookupAddressByPostalCode(prefix, digitsOnly(map.PostalCode), false);
    if (expectedState) {
      loadAddressStates(prefix, expectedState, false).then(function () {
        if (cleanText(qs(prefix + "State").value) !== expectedState || cleanText(qs(prefix + "City").value) !== expectedCity) return null;
        var search = normalizeSearchText(expectedState);
        var matchedState = context.states.find(function (row) {
          return normalizeSearchText(row.uf) === search || normalizeSearchText(row.nome) === search;
        }) || null;
        if (!matchedState) return null;
        selectAddressState(prefix, matchedState, true);
        return loadAddressCities(prefix, expectedCity, false);
      }).then(function () {
        if (expectedCity && cleanText(qs(prefix + "City").value) === expectedCity) selectTypedAddressCity(prefix);
        if (digitsOnly(qs(prefix + "PostalCode").value).length === 8 && addressHasReverseLookupKey(prefix)) markAddressResolved(prefix);
        hideAddressOptions(prefix, "state");
        hideAddressOptions(prefix, "city");
      }).catch(function () {});
    }
  }

  function renderUserHero(data) {
    var user = objectFrom(data, ["usuario", "participante"]);
    var participation = objectFrom(data, ["participante"]);
    var eligibility = objectFrom(data, ["elegibilidade"]);
    var qualification = objectFrom(data, ["qualificacao_atual", "qualificacao", "rank"]);
    var fullName = user.nomeuser || user.nome_exibicao || user.nome || user.codinome || user.loginuser || user.login || (state.session && state.session.user && (state.session.user.name || state.session.user.email)) || "participante";
    var firstName = cleanText(fullName).split(/\s+/)[0] || "participante";
    firstName = firstName.slice(0, 1).toLocaleUpperCase("pt-BR") + firstName.slice(1).toLocaleLowerCase("pt-BR");
    setText("userGreeting", "Olá, " + firstName + ". Acompanhe sua jornada.");
    setText("userHeroText", "Indicações, qualificações e valores.");
    var eligible = booleanValue(firstDefined([eligibility.elegivel_receber, eligibility.elegivel, data.elegivel], false), false);
    var status = qs("userEligibility");
    var reasons = listValue(eligibility.motivos);
    status.textContent = eligible ? "Elegível nesta competência" : (reasons.length ? reasons.map(function (reason) {
      return String(reason).replace(/_/g, " ");
    }).join("\n") : String(participation.status || "Inelegível nesta competência").replace(/_/g, " "));
    status.className = "mmn-status " + (eligible ? "is-ok" : "is-warn");
    setText("userRank", "Rank " + (qualification.rank_financeiro || qualification.rank_atual_nome || qualification.rank_nome || user.rank || "Base"));
    var invite = objectFrom(data, ["convite"]);
    state.user.inviteUrl = invite.url || data.convite_link || "";
  }

  function renderUserBalances(data) {
    var balances = objectFrom(data, ["saldo", "saldos", "resumo_financeiro", "resumo"]);
    setText("userBalanceEstimated", formatMoneyCents(centsFrom(balances, ["em_apuracao_centavos", "estimado_centavos", "pendente_centavos"])));
    setText("userBalanceConfirmed", formatMoneyCents(centsFrom(balances, ["confirmado_centavos"])));
    setText("userBalanceAvailable", formatMoneyCents(centsFrom(balances, ["disponivel_centavos", "liberado_centavos"])));
    setText("userBalancePaid", formatMoneyCents(centsFrom(balances, ["pago_centavos", "total_pago_centavos"])));
  }

  function renderUserQualification(data) {
    var qualification = objectFrom(data, ["qualificacao_atual", "qualificacao", "rank"]);
    var network = objectFrom(data, ["rede_resumo", "rede"]);
    var rules = objectFrom(data, ["regras", "configuracao_publica"]);
    var ranks = listFrom(rules, ["ranks"]);
    var currentRank = qualification.rank_financeiro || qualification.rank_atual_nome || qualification.rank_nome || "Base";
    var current = firstDefined([qualification.rede_ativa, qualification.rede_ativos, network.rede_ativos], 0);
    var nextRankRow = ranks.filter(function (rank) { return numberValue(rank.min_rede_ativa || rank.min_ativos_rede) > numberValue(current); })
      .sort(function (a, b) { return numberValue(a.min_rede_ativa || a.min_ativos_rede) - numberValue(b.min_rede_ativa || b.min_ativos_rede); })[0] || null;
    var nextRank = qualification.proximo_rank_nome || (nextRankRow && nextRankRow.nome) || "Maior rank alcançado";
    var target = firstDefined([qualification.proximo_rank_min_ativos, qualification.meta_ativos, nextRankRow && (nextRankRow.min_rede_ativa || nextRankRow.min_ativos_rede)], numberValue(current) > 0 ? current : 1000);
    var progress = firstDefined([qualification.progresso_percentual], target > 0 ? (numberValue(current) / numberValue(target) * 100) : 100);
    setText("userCurrentRank", currentRank);
    setText("userRankCriteria", "Os critérios são avaliados a cada competência.");
    setText("userNextRank", nextRank);
    qs("userRankProgressBar").style.width = Math.max(0, Math.min(100, numberValue(progress))) + "%";
    setText("userRankProgressCurrent", formatInteger(current) + " ativos");
    setText("userRankProgressTarget", target > current ? formatInteger(target) + " necessários" : "Objetivo alcançado");
    var requirements = listFrom(qualification, ["requisitos", "criterios"]);
    if (!requirements.length) {
      var directActive = numberValue(firstDefined([qualification.diretos_ativos, network.diretos_ativos], 0));
      var directTarget = numberValue(firstDefined([nextRankRow && nextRankRow.min_diretos_ativos], 3));
      var largestLeg = numberValue(firstDefined([qualification.percentual_maior_perna, network.percentual_maior_perna], 0));
      var largestLegLimit = numberValue(firstDefined([nextRankRow && nextRankRow.max_percentual_maior_perna], 100));
      requirements = [
        { nome: "Rede ativa: " + formatInteger(current) + " de " + formatInteger(target), ok: numberValue(current) >= numberValue(target) },
        { nome: "Diretos ativos: " + formatInteger(directActive) + " de " + formatInteger(directTarget), ok: directActive >= directTarget },
        { nome: "Maior perna: " + formatPercent(largestLeg) + " (máximo " + formatPercent(largestLegLimit) + ")", ok: largestLeg <= largestLegLimit }
      ];
    }
    qs("userQualificationChecklist").innerHTML = requirements.length ? requirements.map(function (item) {
      var ok = booleanValue(item.atendido || item.ok, false);
      return "<div class=\"mmn-check-item " + (ok ? "is-ok" : "") + "\"><span>" + escapeHtml(item.nome || item.titulo || item.descricao || "Critério") + "</span></div>";
    }).join("") : emptyHtml("Os critérios da competência ainda não foram publicados.");
    setText("userDirectActive", formatInteger(firstDefined([qualification.diretos_ativos, network.diretos_ativos], 0)));
    setText("userNetworkActive", formatInteger(firstDefined([qualification.rede_ativa, qualification.rede_ativos, network.rede_ativos], 0)));
    setText("userPeriod", qualification.competencia || data.competencia || data.periodo || "—");
  }

  function renderMonthlyChart(data) {
    var rows = listFrom(data, ["historico_mensal", "evolucao_mensal", "evolucao"]);
    var container = qs("userMonthlyChart");
    if (!rows.length) {
      container.innerHTML = emptyHtml("Ainda não há competências reconhecidas para exibir.");
      return;
    }
    var max = Math.max.apply(null, rows.map(function (row) {
      return Math.max(numberValue(centsFrom(row, ["valor_centavos", "total_centavos", "creditos_centavos"])) - numberValue(row.debitos_centavos), 0);
    }).concat([1]));
    container.innerHTML = rows.map(function (row) {
      var value = Math.max(numberValue(centsFrom(row, ["valor_centavos", "total_centavos", "creditos_centavos"])) - numberValue(row.debitos_centavos), 0);
      var height = Math.max(2, value / max * 100);
      return "<div class=\"mmn-chart-column\"><strong title=\"" + escapeHtml(formatMoneyCents(value)) + "\">" + escapeHtml(formatMoneyCents(value)) + "</strong><div class=\"mmn-chart-bar-wrap\"><span class=\"mmn-chart-bar\" style=\"height:" + height + "%\"></span></div><span>" + escapeHtml(row.competencia || row.periodo || "") + "</span></div>";
    }).join("");
  }

  function realEvolutionSourceRows() {
    if (state.user.evolution.rows.length) return state.user.evolution.rows;
    var dashboard = state.user.dashboard || {};
    var embedded = listFrom(dashboard, ["evolucao_rede"]);
    if (embedded.length) return embedded;
    return listFrom(objectFrom(dashboard, ["evolucao_rede"]), ["itens"]);
  }

  function userEvolutionRows() {
    var sourceRows = realEvolutionSourceRows();
    if (!sourceRows.length) sourceRows = listFrom(state.user.dashboard || {}, ["historico_mensal", "evolucao_mensal", "evolucao"]);
    return sourceRows.map(function (row) {
      var active = firstDefined([
        row.rede_ativa,
        row.rede_ativos,
        row.ativos_rede,
        row.total_rede_ativa,
        row.usuarios_ativos
      ], null);
      return {
        competencia: cleanText(row.competencia || row.periodo || row.mes),
        ativos: active,
        diretos: firstDefined([row.diretos_ativos, row.total_diretos_ativos], null),
        rank: cleanText(row.rank_nome || row.rank || row.qualificacao_nome)
      };
    }).filter(function (row) {
      return row.competencia && row.ativos !== null && row.ativos !== "";
    });
  }

  function renderEvolutionChart() {
    if (state.user.evolution.loading) {
      qs("evolutionChartContent").innerHTML = emptyHtml("Carregando a evolução real da sua rede...");
      return;
    }
    var rows = userEvolutionRows();
    if (!rows.length) {
      qs("evolutionChartContent").innerHTML = emptyHtml(state.user.evolution.error || "Ainda não há competências com totais da rede suficientes para montar o gráfico de evolução.");
      return;
    }
    var max = Math.max.apply(null, rows.map(function (row) { return numberValue(row.ativos); }).concat([1]));
    qs("evolutionChartContent").innerHTML = "<div class=\"mmn-evolution-chart\">" + rows.map(function (row) {
      var value = Math.max(0, numberValue(row.ativos));
      var height = Math.max(3, value / max * 100);
      var details = [row.rank, row.diretos !== null && row.diretos !== "" ? formatInteger(row.diretos) + " diretos" : ""].filter(Boolean).join(" · ");
      return "<article class=\"mmn-evolution-column\"><strong>" + escapeHtml(formatInteger(value)) + "</strong><div class=\"mmn-evolution-bar-wrap\"><span style=\"height:" + height + "%\"></span></div><small>" + escapeHtml(row.competencia.slice(0, 7)) + "</small>" + (details ? "<em title=\"" + escapeHtml(details) + "\">" + escapeHtml(details) + "</em>" : "") + "</article>";
    }).join("") + "</div><p class=\"mmn-evolution-note" + (state.user.evolution.error ? " is-error" : "") + "\">" + escapeHtml(state.user.evolution.error || "O gráfico usa somente os totais reais de rede retornados em cada competência.") + "</p>";
  }

  async function openEvolutionChart() {
    qs("evolutionChartOverlay").hidden = false;
    document.body.classList.add("mmn-detail-open");
    if (!realEvolutionSourceRows().length && !state.user.evolution.loaded && !state.user.evolution.loading) {
      state.user.evolution.loading = true;
      state.user.evolution.error = "";
      renderEvolutionChart();
      try {
        var response = await rpc(CONFIG.rpcs.userEvolution, {});
        var payload = objectFrom(response, ["dados", "resultado"]);
        if (!Object.keys(payload).length) payload = response || {};
        state.user.evolution.rows = listFrom(payload, ["itens", "evolucao_rede", "evolucao"]);
      } catch (error) {
        state.user.evolution.error = "Não foi possível atualizar a evolução da rede agora.";
      } finally {
        state.user.evolution.loading = false;
        state.user.evolution.loaded = true;
      }
    }
    renderEvolutionChart();
  }

  function closeEvolutionChart() {
    qs("evolutionChartOverlay").hidden = true;
    if (qs("networkExplorerOverlay").hidden && qs("networkDiagramOverlay").hidden && qs("rankQualifiedOverlay").hidden) document.body.classList.remove("mmn-detail-open");
  }

  function renderUserNotifications(data) {
    var events = listFrom(data, ["eventos"]);
    var container = qs("userNotificationList");
    container.innerHTML = events.length ? events.map(function (event) {
      var readAction = event.lido_em ? "" : "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-user-event-read=\"" + escapeHtml(event.id || event.cod_mmn_evento) + "\">Marcar como lida</button>";
      return "<article class=\"mmn-notification-item " + (event.lido_em ? "" : "is-unread") + "\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(event.titulo || event.tipo || "Atualização") + "</strong><span>" + escapeHtml(event.mensagem || "") + "</span></div><div class=\"mmn-notification-meta\"><time datetime=\"" + escapeHtml(event.criado_em || "") + "\">" + escapeHtml(formatDate(event.criado_em, true)) + "</time>" + readAction + "</div></article>";
    }).join("") : emptyHtml("Nenhuma notificação disponível.");
  }

  function bonusesFromEvolution(data) {
    var rows = listFrom(data, ["evolucao_mensal", "historico_mensal"]);
    var result = [];
    rows.forEach(function (row) {
      var competence = String(row.competencia || row.periodo || "").slice(0, 7);
      var rankValue = numberValue(row.bonus_rank_centavos);
      var poolValue = numberValue(row.pool_centavos);
      if (rankValue > 0) result.push({ nome: "Bônus de liderança", tipo: "bonus_rank", competencia: competence, valor_centavos: rankValue, status: "confirmado" });
      if (poolValue > 0) result.push({ nome: "Pool Global", tipo: "pool_global", competencia: competence, valor_centavos: poolValue, status: "confirmado" });
    });
    return result;
  }

  function renderUserDashboard(data) {
    renderUserHero(data);
    renderEnrollment(data);
    if (qs("userDashboard").hidden) return;
    renderUserBalances(data);
    renderUserQualification(data);
    renderMonthlyChart(data);
    renderUserNotifications(data);
    fillUserProfileFields(mergeProfileAddress(userProfile(data), addressSuggestionFromDashboard(data)), "profile");
    var network = objectFrom(data, ["rede_resumo", "rede"]);
    var publicConfig = objectFrom(data, ["regras", "configuracao_publica"]);
    var dashboardLevels = listFrom(data, ["niveis"]);
    if (!dashboardLevels.length) dashboardLevels = listFrom(network, ["por_nivel", "niveis", "total_por_nivel"]);
    var ruleLevels = listFrom(publicConfig, ["niveis"]);
    dashboardLevels = dashboardLevels.map(function (level) {
      var rule = ruleLevels.find(function (item) { return String(item.nivel) === String(level.nivel); }) || {};
      return Object.assign({}, rule, level);
    });
    if (dashboardLevels.length || Array.isArray(network.diretos) || Object.keys(network).length) {
      renderUserNetwork(Object.assign({}, network, {
        niveis: dashboardLevels,
        diretos: network.diretos || [],
        regras: publicConfig,
        patrocinio: objectFrom(data, ["patrocinio", "arvore_patrocinio"]),
        posicionamento: objectFrom(data, ["posicionamento", "arvore_posicionamento", "posicao"]),
        participante: objectFrom(data, ["participante", "usuario_mmn"])
      }), false);
    }
    var ranks = listFrom(data, ["ranks"]);
    if (!ranks.length) ranks = listFrom(publicConfig, ["ranks"]);
    var bonuses = listFrom(data, ["bonificacoes", "bonus"]);
    if (!bonuses.length) bonuses = bonusesFromEvolution(data);
    if (ranks.length || bonuses.length) renderUserBonuses({ ranks: ranks, bonificacoes: bonuses, qualificacao: objectFrom(data, ["qualificacao_atual", "qualificacao"]), extrato: listFrom(data, ["extrato"]) });
  }

  function configuredNetworkParameters(data) {
    var source = data || {};
    var direct = objectFrom(source, ["parametros"]);
    var rules = objectFrom(source, ["regras", "configuracao_publica", "configuracao"]);
    var nested = objectFrom(rules, ["parametros"]);
    var dashboard = state.user.dashboard || {};
    var dashboardRules = objectFrom(dashboard, ["regras", "configuracao_publica"]);
    var dashboardParameters = objectFrom(dashboardRules, ["parametros"]);
    return Object.assign({}, dashboardRules, dashboardParameters, rules, nested, direct);
  }

  function configuredNetworkDepth(data) {
    return Math.max(1, Math.min(10, integerValue(firstDefined([
      configuredNetworkParameters(data).quantidade_niveis,
      data && data.quantidade_niveis
    ], 6), 6)));
  }

  function configuredPlacementWidth(data) {
    return Math.max(0, integerValue(firstDefined([
      configuredNetworkParameters(data).largura_maxima_posicionamento,
      data && data.largura_maxima_posicionamento
    ], 0), 0));
  }

  function relationPersonLabel(person, fallback) {
    if (person == null || person === "") return fallback || "Raiz";
    if (typeof person !== "object") return "Usuário";
    return cleanText(firstDefined([
      person.loginuser, person.usuario_login, person.login_user, person.login,
      person.codinome, person.nome
    ], "")) || fallback || "Usuário";
  }

  function renderUserGenealogy(data) {
    var participant = objectFrom(data, ["participante", "usuario_mmn"]);
    var sponsorship = objectFrom(data, ["patrocinio", "arvore_patrocinio"]);
    var placement = objectFrom(data, ["posicionamento", "arvore_posicionamento", "posicao"]);
    var sponsor = objectFrom(sponsorship, ["patrocinador", "pai"]);
    var parent = objectFrom(placement, ["pai", "pai_posicionamento"]);
    var sponsorId = firstDefined([sponsor.usuario_id, sponsor.id_usuario, sponsor.cod_usuario, sponsor.id, sponsorship.patrocinador_id, participant.patrocinador_id, data.patrocinador_id], null);
    var parentId = firstDefined([parent.usuario_id, parent.id_usuario, parent.cod_usuario, parent.id, placement.pai_posicionamento_id, participant.pai_posicionamento_id, data.pai_posicionamento_id], null);
    var slot = firstDefined([placement.slot_posicionamento, placement.slot, participant.slot_posicionamento, data.slot_posicionamento], null);
    var width = Math.max(0, integerValue(firstDefined([placement.largura_aplicada, configuredPlacementWidth(data)], 0), 0));
    var spillover = booleanValue(firstDefined([placement.spillover, placement.foi_spillover, participant.foi_spillover, data.foi_spillover], sponsorId != null && parentId != null && String(sponsorId) !== String(parentId)), false);
    var sponsorLogin = cleanText(firstDefined([sponsor.loginuser, sponsorship.patrocinador_loginuser, placement.patrocinador_loginuser, participant.patrocinador_loginuser, data.patrocinador_loginuser], ""));
    var parentLogin = cleanText(firstDefined([parent.loginuser, placement.pai_posicionamento_loginuser, participant.pai_posicionamento_loginuser, data.pai_posicionamento_loginuser], ""));
    setText("userSponsorRelation", sponsorLogin || (Object.keys(sponsor).length ? relationPersonLabel(sponsor, "Raiz") : relationPersonLabel(sponsorId, "Raiz")));
    setText("userPlacementParent", parentLogin || (Object.keys(parent).length ? relationPersonLabel(parent, "Raiz estrutural") : relationPersonLabel(parentId, "Raiz estrutural")));
    setText("userPlacementSlot", slot == null || slot === "" ? "Sem vaga atribuída" : "#" + slot);
    setText("userPlacementWidth", width === 0 ? "Ilimitada" : formatInteger(width) + " vagas por participante");
    setText("userPlacementSpillover", width === 0 ? "Sem limite horizontal de posicionamento." : (spillover ? "Posicionado por spillover; seu patrocinador permanece o mesmo." : "Posicionamento direto, sem spillover nesta entrada."));
    var genealogyRule = qs("userGenealogyRule");
    if (genealogyRule) {
      genealogyRule.hidden = width === 0;
      genealogyRule.textContent = "Com a largura limitada, indicações além das vagas diretas entram por spillover. A comissão direta permanece com quem convidou; as residuais seguem os níveis reais, sem pagar duas vezes o mesmo beneficiário pela mesma assinatura.";
    }
  }

  function networkPersonId(person) {
    return firstNonEmptyText([
      person && person.usuario_id,
      person && person.id_usuario,
      person && person.id_participante,
      person && person.id
    ], "");
  }

  function networkPersonSponsorId(person) {
    return firstNonEmptyText([
      person && person.patrocinador_id,
      person && person.id_patrocinador,
      person && person.sponsor_id,
      person && person.indicador_id
    ], "");
  }

  function networkPersonPosition(person) {
    var value = firstDefined([
      person && person.posicao_indicacao,
      person && person.ordem_indicacao,
      person && person.numero_posicao_indicacao,
      person && person.vaga_indicacao,
      person && person.posicao_direta,
      person && person.ordem_direta
    ], null);
    if (value === null || value === "") return null;
    var position = integerValue(value, 0);
    return position > 0 ? position : null;
  }

  function networkPersonRegistrationDate(person) {
    return networkPersonRegistrationInfo(person).value;
  }

  function networkPersonRegistrationInfo(person) {
    var appRegistration = firstNonEmptyText([
      person && person.cadastrado_app_em,
      person && person.cadastro_app_em,
      person && person.usuario_cadastrado_em,
      person && person.data_cadastro_app
    ], "");
    if (appRegistration) return { value: appRegistration, source: "app" };
    var referralLink = firstNonEmptyText([person && person.vinculado_indicacao_em], "");
    return { value: referralLink, source: referralLink ? "vinculo" : "" };
  }

  function networkPersonPlacementSlot(person) {
    var value = firstDefined([
      person && person.slot_posicionamento,
      person && person.vaga_posicionamento,
      person && person.posicao_estrutural
    ], null);
    if (value === null || value === "") return null;
    var slot = integerValue(value, 0);
    return slot > 0 ? slot : null;
  }

  function networkPersonPlacementParentId(person) {
    return firstNonEmptyText([
      person && person.pai_posicionamento_id,
      person && person.id_pai_posicionamento,
      person && person.placement_parent_id
    ], "");
  }

  function networkPersonFullName(person) {
    var composed = cleanText([person && person.nomeuser, person && person.sobrenome].filter(Boolean).join(" "));
    return firstNonEmptyText([
      person && person.nome_completo,
      person && person.usuario_nome_completo,
      composed,
      person && person.nome
    ], "");
  }

  function networkPersonLogin(person) {
    return firstNonEmptyText([
      person && person.loginuser,
      person && person.usuario_loginuser,
      person && person.usuario_login,
      person && person.login,
      person && person.codinome
    ], "");
  }

  function networkPersonActive(person) {
    var explicit = firstDefined([
      person && person.ativo,
      person && person.rede_ativo,
      person && person.usuario_ativo,
      person && person.assinatura_ativa,
      person && person.mmn_ativo,
      person && person.elegivel_fechamento
    ], null);
    if (explicit !== null) return booleanValue(explicit, false);
    var status = cleanText(person && (person.status || person.situacao)).toLowerCase();
    return ["ativo", "elegivel", "confirmado", "premium_ativo"].indexOf(status) >= 0;
  }

  function networkPersonDisplayName(person, directFromRoot) {
    if (directFromRoot) return networkPersonFullName(person) || networkPersonLogin(person) || "Indicado";
    return networkPersonLogin(person) || "Usuário";
  }

  function normalizeNetworkRows(data, directs) {
    var sponsorship = objectFrom(data, ["arvore_patrocinio", "patrocinio_detalhado", "genealogia_patrocinio"]);
    var candidates = [];
    [
      listFrom(data, ["rede_patrocinio", "indicados_rede", "descendentes", "rede_detalhada", "participantes_rede"]),
      listFrom(sponsorship, ["rede", "descendentes", "participantes", "itens"]),
      listFrom(data, ["rede"]),
      directs
    ].forEach(function (rows) {
      listValue(rows).forEach(function (row) {
        if (row && typeof row === "object" && networkPersonId(row)) candidates.push(row);
      });
    });
    var rootId = firstNonEmptyText([
      data.raiz_usuario_id,
      data.no_usuario_id,
      data.usuario_id,
      data.id_usuario,
      objectFrom(data, ["usuario"]).usuario_id,
      objectFrom(data, ["usuario"]).id_usuario,
      objectFrom(data, ["participante", "usuario_mmn"]).usuario_id,
      objectFrom(data, ["participante", "usuario_mmn"]).id_usuario,
      objectFrom(state.user.dashboard || {}, ["usuario"]).usuario_id,
      objectFrom(state.user.dashboard || {}, ["usuario"]).id_usuario,
      objectFrom(state.user.dashboard || {}, ["participante"]).usuario_id,
      objectFrom(state.user.dashboard || {}, ["participante"]).id_usuario,
      networkPersonSponsorId(listValue(directs)[0])
    ], "");
    var directIds = {};
    listValue(directs).forEach(function (person) {
      var id = networkPersonId(person);
      if (id) directIds[id] = true;
    });
    var byId = {};
    candidates.forEach(function (person) {
      var id = networkPersonId(person);
      var normalized = Object.assign({}, byId[id] || {}, person);
      if (directIds[id]) {
        normalized.nivel_patrocinio = 1;
        if (!networkPersonSponsorId(normalized) && rootId) normalized.patrocinador_id = rootId;
      }
      byId[id] = normalized;
    });
    var rows = Object.keys(byId).map(function (id) { return byId[id]; });
    var directRows = Object.keys(directIds).map(function (id) { return byId[id]; }).filter(Boolean);
    if (!directRows.length && rootId) {
      directRows = rows.filter(function (person) { return networkPersonSponsorId(person) === rootId; });
    }
    function sortRows(left, right) {
      var leftPosition = networkPersonPosition(left);
      var rightPosition = networkPersonPosition(right);
      if (leftPosition != null && rightPosition != null && leftPosition !== rightPosition) return leftPosition - rightPosition;
      var leftDate = new Date(networkPersonRegistrationDate(left) || 0).getTime();
      var rightDate = new Date(networkPersonRegistrationDate(right) || 0).getTime();
      if (leftDate !== rightDate) return leftDate - rightDate;
      return networkPersonId(left).localeCompare(networkPersonId(right), "pt-BR", { numeric: true });
    }
    rows.sort(sortRows);
    directRows.sort(sortRows);
    return { rootId: rootId, rows: rows, directs: directRows };
  }

  function storeUserNetwork(data, directs) {
    var normalized = normalizeNetworkRows(data, directs);
    if (normalized.rootId) state.user.network.rootId = normalized.rootId;
    var rowsById = {};
    state.user.network.rows.concat(normalized.rows).forEach(function (person) {
      var id = networkPersonId(person);
      if (id) rowsById[id] = Object.assign({}, rowsById[id] || {}, person);
    });
    state.user.network.rows = Object.keys(rowsById).map(function (id) { return rowsById[id]; });
    var directIds = {};
    state.user.network.directs.concat(normalized.directs).forEach(function (person) {
      var id = networkPersonId(person);
      if (id) directIds[id] = true;
    });
    if (state.user.network.rootId) {
      state.user.network.rows.forEach(function (person) {
        if (networkPersonSponsorId(person) === state.user.network.rootId) directIds[networkPersonId(person)] = true;
      });
    }
    state.user.network.directs = Object.keys(directIds).map(function (id) { return rowsById[id]; }).filter(Boolean).sort(function (left, right) {
      var leftPosition = networkPersonPosition(left);
      var rightPosition = networkPersonPosition(right);
      return (leftPosition == null ? Number.MAX_SAFE_INTEGER : leftPosition) - (rightPosition == null ? Number.MAX_SAFE_INTEGER : rightPosition);
    });
    state.user.network.hasMore = booleanValue(firstDefined([
      data.has_more,
      data.tem_mais,
      data.rede_incompleta
    ], false), false) || !!(data.next_cursor || data.proximo_cursor || data.cursor_proximo);
  }

  function networkChildren(parentId) {
    var expected = cleanText(parentId);
    return state.user.network.rows.filter(function (person) {
      return networkPersonSponsorId(person) === expected;
    });
  }

  function networkDiagramChildren(parentId) {
    var expected = cleanText(parentId);
    return state.user.network.rows.filter(function (person) {
      var placementParent = networkPersonPlacementParentId(person);
      return placementParent ? placementParent === expected : networkPersonSponsorId(person) === expected;
    }).sort(function (left, right) {
      var leftSlot = networkPersonPlacementSlot(left);
      var rightSlot = networkPersonPlacementSlot(right);
      if (leftSlot != null && rightSlot != null && leftSlot !== rightSlot) return leftSlot - rightSlot;
      return networkPersonId(left).localeCompare(networkPersonId(right), "pt-BR", { numeric: true });
    });
  }

  function mergeNetworkRows(rows, parentId) {
    var normalizedRows = listValue(rows).map(function (row) {
      if (!row || typeof row !== "object") return null;
      var result = Object.assign({}, row);
      if (!networkPersonSponsorId(result) && parentId) result.patrocinador_id = parentId;
      return result;
    }).filter(function (row) { return row && networkPersonId(row); });
    storeUserNetwork({ usuario_id: state.user.network.rootId, rede_patrocinio: normalizedRows }, []);
    return normalizedRows.map(function (row) {
      var id = networkPersonId(row);
      return state.user.network.rows.find(function (person) { return networkPersonId(person) === id; }) || row;
    });
  }

  function networkRegistrationLabel(person) {
    var registration = networkPersonRegistrationInfo(person);
    if (!registration.value) return "Data de cadastro no app não informada";
    return registration.source === "vinculo" ?
      "Vínculo da indicação em " + formatDate(registration.value, false) :
      "Cadastro no app em " + formatDate(registration.value, false);
  }

  function networkPositionNumberLabel(person) {
    var position = networkPersonPosition(person);
    return position == null ? "" : "#" + formatInteger(position);
  }

  function networkPersonCardHtml(person, directFromRoot, explorer) {
    var id = networkPersonId(person);
    var children = networkChildren(id).length;
    var hasChildren = children > 0 || booleanValue(person && person.tem_filhos, false);
    var name = networkPersonDisplayName(person, directFromRoot);
    var positionLabel = networkPositionNumberLabel(person);
    var secondary = directFromRoot ?
      (positionLabel ? "Indicação direta " + positionLabel : "Indicação direta · posição ainda não informada") :
      (positionLabel ? "Posição " + positionLabel : "Posição da indicação não informada");
    return "<button class=\"mmn-list-row mmn-network-person\" type=\"button\" data-network-person-id=\"" + escapeHtml(id) + "\">" +
      "<span class=\"mmn-row-main\"><strong>" + escapeHtml(name) + "</strong><small>" + escapeHtml(secondary) + "</small></span>" +
      "<span class=\"mmn-network-date\">" + escapeHtml(networkRegistrationLabel(person)) + "</span>" +
      "<span class=\"mmn-network-children\">" + escapeHtml(children ? formatInteger(children) + (children === 1 ? " indicado" : " indicados") : (hasChildren || !explorer ? "Ver ramificação" : "Sem indicados")) + "</span>" +
      pillHtml(networkPersonActive(person) ? "ativo" : "pendente", networkPersonActive(person) ? "Ativo" : "Inativo") +
      "</button>";
  }

  function selectedNetworkPerson() {
    var id = state.user.network.stack[state.user.network.stack.length - 1] || "";
    return state.user.network.rows.find(function (person) { return networkPersonId(person) === id; }) || null;
  }

  function renderNetworkExplorer() {
    var person = selectedNetworkPerson();
    if (!person) return;
    var id = networkPersonId(person);
    var cache = state.user.network.nodeCache[id] || {};
    var children = Array.isArray(cache.rows) ? cache.rows : networkChildren(id);
    setText("networkExplorerTitle", "Indicados de " + networkPersonDisplayName(person, state.user.network.stack.length === 1));
    setText("networkExplorerSubtitle", networkRegistrationLabel(person) + " · " + (networkPersonActive(person) ? "Ativo" : "Inativo"));
    qs("networkExplorerBack").hidden = state.user.network.stack.length <= 1;
    qs("networkExplorerContent").innerHTML = cache.loading ? emptyHtml("Carregando indicados...") : (children.length ? children.map(function (child) {
      return networkPersonCardHtml(child, false, true);
    }).join("") : emptyHtml(cache.error || "Este indicado ainda não possui indicações registradas."));
    qs("networkExplorerMore").hidden = cache.loading || !cache.hasMore;
  }

  async function loadNetworkNode(personId, append) {
    var id = cleanText(personId);
    if (!id) return;
    var previous = state.user.network.nodeCache[id] || { rows: [], cursor: null, hasMore: false };
    if (previous.loading) return;
    previous.loading = true;
    previous.error = "";
    state.user.network.nodeCache[id] = previous;
    renderNetworkExplorer();
    try {
      var response = await rpc(CONFIG.rpcs.userNetworkNode, {
        p_usuario_id: integerValue(id),
        p_limite: 100,
        p_cursor: append ? previous.cursor : null
      });
      var payload = objectFrom(response, ["dados", "resultado"]);
      if (!Object.keys(payload).length) payload = response || {};
      var node = objectFrom(payload, ["no", "usuario", "participante"]);
      if (Object.keys(node).length) mergeNetworkRows([node], networkPersonSponsorId(node));
      var rows = listFrom(payload, ["indicados", "filhos", "itens", "participantes"]);
      if (!rows.length) rows = listFrom(objectFrom(payload, ["patrocinio", "rede_patrocinio"]), ["indicados", "filhos", "itens"]);
      rows = mergeNetworkRows(rows, id);
      var merged = append ? previous.rows.concat(rows) : rows;
      var seen = {};
      previous.rows = merged.filter(function (row) {
        var rowId = networkPersonId(row);
        if (!rowId || seen[rowId]) return false;
        seen[rowId] = true;
        return true;
      });
      previous.cursor = firstDefined([payload.next_cursor, payload.proximo_cursor, payload.cursor_proximo, response.next_cursor, response.proximo_cursor], null);
      previous.hasMore = booleanValue(firstDefined([payload.has_more, payload.tem_mais], !!previous.cursor), !!previous.cursor);
    } catch (error) {
      previous.error = previous.rows.length ? "" : "Não foi possível carregar esta ramificação agora. Tente novamente.";
      previous.hasMore = false;
    } finally {
      previous.loading = false;
      state.user.network.nodeCache[id] = previous;
      var selected = selectedNetworkPerson();
      if (selected && networkPersonId(selected) === id) renderNetworkExplorer();
    }
  }

  async function openNetworkExplorer(personId) {
    var id = cleanText(personId);
    if (!id || !state.user.network.rows.some(function (person) { return networkPersonId(person) === id; })) return;
    state.user.network.stack = [id];
    renderNetworkExplorer();
    qs("networkExplorerOverlay").hidden = false;
    document.body.classList.add("mmn-detail-open");
    await loadNetworkNode(id, false);
  }

  function closeNetworkExplorer() {
    qs("networkExplorerOverlay").hidden = true;
    state.user.network.stack = [];
    if (qs("networkDiagramOverlay").hidden && qs("rankQualifiedOverlay").hidden && qs("evolutionChartOverlay").hidden) document.body.classList.remove("mmn-detail-open");
  }

  function diagramNodeHtml(person, visited) {
    var id = networkPersonId(person);
    if (!id || visited[id]) return "";
    visited[id] = true;
    var directFromRoot = networkPersonSponsorId(person) === state.user.network.rootId;
    var children = networkDiagramChildren(id);
    var slot = networkPersonPlacementSlot(person);
    var nested = children.map(function (child) {
      return diagramNodeHtml(child, visited);
    }).filter(Boolean).join("");
    return "<li><article class=\"mmn-diagram-node\"><strong>" + escapeHtml(networkPersonDisplayName(person, directFromRoot)) + "</strong><small>" + escapeHtml(networkRegistrationLabel(person)) + "</small><span>" + escapeHtml((slot == null ? "Vaga estrutural não informada" : "Vaga estrutural #" + formatInteger(slot)) + " · " + (networkPersonActive(person) ? "Ativo" : "Inativo")) + "</span></article>" + (nested ? "<ul>" + nested + "</ul>" : "") + "</li>";
  }

  function renderNetworkDiagram() {
    var visited = {};
    var roots = networkDiagramChildren(state.user.network.rootId);
    if (!roots.length) roots = state.user.network.directs;
    var dashboardUser = objectFrom(state.user.dashboard || {}, ["usuario"]);
    var rootLogin = networkPersonLogin(dashboardUser) || "Você";
    var branches = roots.map(function (person) {
      return diagramNodeHtml(person, visited);
    }).filter(Boolean).join("");
    var incomplete = state.user.network.hasMore ? "<p class=\"mmn-diagram-warning\">A consulta atingiu o limite de registros. Este diagrama está incompleto e não representa toda a sua rede.</p>" : "";
    qs("networkDiagramContent").innerHTML = "<div class=\"mmn-diagram-root\"><strong>" + escapeHtml(rootLogin) + "</strong><span>Sua rede de posicionamento</span></div>" +
      (branches ? "<div class=\"mmn-diagram-scroll\"><ul class=\"mmn-diagram-tree\">" + branches + "</ul></div>" : emptyHtml("Você ainda não possui indicados para exibir no diagrama.")) + incomplete;
  }

  async function openNetworkDiagram() {
    qs("networkDiagramOverlay").hidden = false;
    document.body.classList.add("mmn-detail-open");
    qs("networkDiagramContent").innerHTML = emptyHtml("Carregando o diagrama completo da rede...");
    try {
      var response = await rpc(CONFIG.rpcs.userNetworkDiagram, { p_limite: 10000 });
      var payload = objectFrom(response, ["dados", "resultado", "diagrama"]);
      if (!Object.keys(payload).length) payload = response || {};
      var rows = listFrom(payload, ["nos", "rede", "itens", "participantes", "descendentes"]);
      var directs = listFrom(payload, ["diretos", "indicados_diretos"]);
      storeUserNetwork(Object.assign({}, payload, { rede_detalhada: rows }), directs);
      state.user.network.hasMore = booleanValue(firstDefined([payload.has_more, payload.tem_mais, payload.rede_incompleta], false), false);
      renderNetworkDiagram();
    } catch (error) {
      if (state.user.network.rows.length) {
        renderNetworkDiagram();
        qs("networkDiagramContent").insertAdjacentHTML("afterbegin", "<p class=\"mmn-diagram-warning\">Não foi possível atualizar o diagrama completo agora. A visualização usa os dados já carregados.</p>");
      } else {
        qs("networkDiagramContent").innerHTML = emptyHtml("Não foi possível carregar o diagrama da rede agora. Tente novamente.");
      }
    }
  }

  function closeNetworkDiagram() {
    qs("networkDiagramOverlay").hidden = true;
    document.body.classList.remove("mmn-network-printing");
    if (qs("networkExplorerOverlay").hidden && qs("rankQualifiedOverlay").hidden && qs("evolutionChartOverlay").hidden) document.body.classList.remove("mmn-detail-open");
  }

  function renderUserNetwork(data, append) {
    var depth = configuredNetworkDepth(data);
    var levels = listFrom(data, ["por_nivel", "niveis", "levels"]).filter(function (level) {
      return integerValue(level.nivel) >= 1 && integerValue(level.nivel) <= depth;
    });
    var directs = listFrom(data, ["diretos", "participantes"]);
    storeUserNetwork(data, directs);
    if (!append) renderUserGenealogy(data);
    if (levels.length) {
      qs("userLevelGrid").innerHTML = levels.map(function (level) {
        var unlocked = firstDefined([level.liberado, level.qualificado], true);
        return "<article class=\"mmn-level-card " + (unlocked ? "" : "is-locked") + "\"><span>Nível " + escapeHtml(level.nivel) + " · " + escapeHtml(formatPercent(level.percentual)) + "</span><strong>" + escapeHtml(formatInteger(firstDefined([level.ativos, level.participantes_ativos], null))) + "</strong><span>ativos de " + escapeHtml(formatInteger(firstDefined([level.total, level.participantes], null))) + " participantes</span>" + pillHtml(unlocked ? "ativo" : "pendente", unlocked ? "Qualificado" : "Não qualificado") + "</article>";
      }).join("");
    } else if (!append) {
      qs("userLevelGrid").innerHTML = emptyHtml("A distribuição por nível ainda não está disponível.");
    }
    var html = state.user.network.directs.map(function (person) {
      return networkPersonCardHtml(person, true, false);
    }).join("");
    qs("userDirectList").innerHTML = html || emptyHtml("Você ainda não possui indicados diretos.");
    state.user.cursors.network = data.next_cursor || data.proximo_cursor || data.cursor_proximo || null;
    qs("userNetworkMore").hidden = !state.user.cursors.network;
  }

  function disputeButtonHtml(row, targetType, idKeys) {
    var targetId = firstDefined(idKeys.map(function (key) { return row[key]; }), null);
    var deadline = firstDefined([row.contestacao_ate, row.contestavel_ate, row.prazo_contestacao_ate], null);
    var explicitlyAllowed = firstDefined([row.pode_contestar, row.contestavel], null);
    var withinDeadline = deadline ? new Date(deadline).getTime() >= Date.now() : false;
    if (!targetId || !(explicitlyAllowed === true || withinDeadline)) return "";
    return "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-user-dispute-type=\"" + escapeHtml(targetType) + "\" data-user-dispute-id=\"" + escapeHtml(targetId) + "\">Contestar</button>";
  }

  function renderUserLedger(data, append) {
    var rows = listFrom(data, ["lancamentos", "extrato", "historico_mensal", "itens"]);
    var html = rows.map(function (row) {
      var value = row.creditos_centavos !== undefined ? numberValue(row.creditos_centavos) - numberValue(row.debitos_centavos) : centsFrom(row, ["valor_centavos"]);
      return "<div class=\"mmn-ledger-row\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.descricao || row.tipo_nome || row.tipo || (row.competencia ? "Resumo da competência" : "Lançamento")) + "</strong><small>" + escapeHtml(formatDate(row.criado_em || row.data || row.competencia, true)) + " · " + escapeHtml(row.competencia || "") + "</small></div><span>" + escapeHtml(row.nivel ? "Nível " + row.nivel : (row.origem || (row.bonus_rank_centavos ? "Inclui bônus" : "—"))) + "</span><strong>" + escapeHtml(formatMoneyCents(value)) + "</strong>" + pillHtml(row.status || "confirmado") + disputeButtonHtml(row, "lancamento", ["id", "cod_mmn_lancamento"]) + "</div>";
    }).join("");
    if (append) qs("userLedgerList").insertAdjacentHTML("beforeend", html);
    else qs("userLedgerList").innerHTML = html || emptyHtml("Nenhum lançamento encontrado para o período.");
    state.user.cursors.ledger = data.proximo_cursor || data.cursor_proximo || null;
    qs("userLedgerMore").hidden = !state.user.cursors.ledger;
  }

  function renderUserBonuses(data) {
    var ranks = listFrom(data, ["ranks", "ranking"]);
    var bonuses = listFrom(data, ["bonificacoes", "bonus"]);
    var qualification = objectFrom(data, ["qualificacao"]);
    var ledger = listFrom(data, ["extrato", "lancamentos"]);
    state.user.ranks = ranks;
    state.user.rankQualificationData = data;
    qs("userRankLadder").innerHTML = ranks.length ? ranks.map(function (rank) {
      var status = String(rank.status || (String(rank.chave) === String(qualification.rank_chave) ? "atual" : "pendente"));
      return "<button type=\"button\" class=\"mmn-rank-card " + (status === "atual" ? "is-current" : (status === "concluido" ? "is-complete" : "")) + "\" data-rank-qualified-index=\"" + escapeHtml(ranks.indexOf(rank)) + "\"><span>" + escapeHtml(status === "atual" ? "Rank atual" : "Qualificação") + "</span><strong>" + escapeHtml(rank.nome || rank.rank || "") + "</strong><span>" + escapeHtml(formatInteger(rank.min_rede_ativa || rank.min_ativos_rede || rank.ativos_necessarios)) + " ativos na rede · bônus " + escapeHtml(formatPercent(rank.bonus_percentual || rank.percentual_lideranca || rank.percentual)) + " · pool " + escapeHtml(numberValue(rank.pool_coeficiente)) + "</span>" + pillHtml(status || "pendente") + "<small class=\"mmn-rank-open-label\">Ver participantes qualificados</small></button>";
    }).join("") : emptyHtml("Os ranks vigentes ainda não foram carregados.");
    qs("userBonusGrid").innerHTML = bonuses.length ? bonuses.map(function (bonus) {
      var competence = String(bonus.competencia || bonus.periodo || "").slice(0, 7);
      var type = bonus.tipo || bonus.chave || "";
      var source = ledger.find(function (row) {
        return String(row.tipo || "") === String(type) && (!competence || String(row.competencia || row.periodo || "").slice(0, 7) === competence);
      }) || bonus;
      var details = objectFrom(source, ["detalhes"]);
      var detailItems = [];
      var base = firstDefined([source.base_centavos, details.base_centavos], null);
      var coefficient = firstDefined([source.pool_coeficiente, details.coeficiente], null);
      var personalPoints = firstDefined([source.pontos_pessoais, details.pontos_pessoais], null);
      var totalPoints = firstDefined([source.pontos_totais, details.pontos_totais], null);
      var availablePool = firstDefined([source.pool_disponivel_centavos, details.pool_disponivel_centavos], null);
      if (type === "pool_global" || Object.keys(details).length) {
        if (base != null) detailItems.push(["Base pessoal", formatMoneyCents(base)]);
        if (coefficient != null) detailItems.push(["Coeficiente", numberValue(coefficient).toLocaleString("pt-BR", { maximumFractionDigits: 5 })]);
        if (personalPoints != null) detailItems.push(["Seus pontos", numberValue(personalPoints).toLocaleString("pt-BR", { maximumFractionDigits: 3 })]);
        if (totalPoints != null) detailItems.push(["Pontos totais", numberValue(totalPoints).toLocaleString("pt-BR", { maximumFractionDigits: 3 })]);
        if (availablePool != null) detailItems.push(["Pool disponível", formatMoneyCents(availablePool)]);
      }
      var detailHtml = detailItems.length ? "<dl class=\"mmn-bonus-details\">" + detailItems.map(function (item) { return "<div><dt>" + escapeHtml(item[0]) + "</dt><dd>" + escapeHtml(item[1]) + "</dd></div>"; }).join("") + "</dl>" : "";
      var description = bonus.descricao || (competence ? "Competência " + competence : "");
      return "<article class=\"mmn-bonus-card\"><span>" + escapeHtml(bonus.nome || bonus.tipo_nome || bonus.tipo || "Benefício") + "</span><strong>" + escapeHtml(formatMoneyCents(centsFrom(bonus, ["valor_centavos", "estimado_centavos"]))) + "</strong><span>" + escapeHtml(description) + "</span>" + detailHtml + pillHtml(bonus.status || source.status || "apurando") + "</article>";
    }).join("") : emptyHtml("Nenhuma bonificação registrada nesta competência.");
  }

  function qualifiedRowsForRank(rank) {
    var directRows = listFrom(rank, [
      "qualificados",
      "participantes_qualificados",
      "usuarios_qualificados",
      "loginusers_qualificados"
    ]);
    if (directRows.length) return directRows;
    var data = state.user.rankQualificationData || {};
    var grouped = firstDefined([
      data.qualificados_por_rank,
      data.participantes_por_rank,
      objectFrom(state.user.dashboard || {}, ["qualificados_por_rank"])
    ], null);
    var key = cleanText(firstDefined([rank.chave, rank.rank_chave, rank.nome, rank.rank], ""));
    if (grouped && !Array.isArray(grouped) && typeof grouped === "object") {
      return listValue(grouped[key] || grouped[key.toLowerCase()] || []);
    }
    if (Array.isArray(grouped)) {
      var group = grouped.find(function (item) {
        return cleanText(firstDefined([item.rank_chave, item.chave, item.rank, item.nome], "")).toLowerCase() === key.toLowerCase();
      });
      return group ? listFrom(group, ["qualificados", "participantes", "usuarios", "itens"]) : [];
    }
    return [];
  }

  function qualifiedLogin(row) {
    if (typeof row === "string") return cleanText(row);
    return networkPersonLogin(row);
  }

  function renderRankQualified(loading, error) {
    var rank = state.user.rankQualified.rank;
    if (!rank) return;
    var rankName = cleanText(rank.nome || rank.rank || rank.chave) || "Qualificação";
    var rows = state.user.rankQualified.rows;
    var seen = {};
    var unique = rows.filter(function (row) {
      var login = qualifiedLogin(row).toLowerCase();
      if (!login || seen[login]) return false;
      seen[login] = true;
      return true;
    });
    setText("rankQualifiedTitle", rankName);
    setText("rankQualifiedSubtitle", unique.length ? formatInteger(unique.length) + (unique.length === 1 ? " participante qualificado" : " participantes qualificados") : "Participantes qualificados neste rank");
    qs("rankQualifiedContent").innerHTML = loading ? emptyHtml("Carregando participantes qualificados...") : (unique.length ? "<div class=\"mmn-qualified-list\">" + unique.map(function (row) {
      var active = typeof row === "object" ? networkPersonActive(row) : true;
      return "<article class=\"mmn-qualified-person\"><strong>" + escapeHtml(qualifiedLogin(row)) + "</strong>" + pillHtml(active ? "ativo" : "pendente", active ? "Ativo" : "Inativo") + "</article>";
    }).join("") + "</div>" : emptyHtml(error || "Nenhum participante qualificado foi encontrado neste rank."));
    qs("rankQualifiedMore").hidden = loading || !state.user.rankQualified.hasMore;
  }

  async function loadRankQualified(append) {
    var rank = state.user.rankQualified.rank;
    if (!rank) return;
    renderRankQualified(true, "");
    try {
      var rankKey = cleanText(firstDefined([rank.chave, rank.rank_chave, rank.rank, rank.nome], ""));
      var response = await rpc(CONFIG.rpcs.userRankQualified, {
        p_rank_chave: rankKey,
        p_limite: 100,
        p_cursor: append ? state.user.rankQualified.cursor : null
      });
      var payload = objectFrom(response, ["dados", "resultado"]);
      if (!Object.keys(payload).length) payload = response || {};
      var returnedRows = listFrom(payload, ["qualificados", "participantes", "usuarios", "itens"]);
      state.user.rankQualified.rows = append ? state.user.rankQualified.rows.concat(returnedRows) : returnedRows;
      state.user.rankQualified.cursor = firstDefined([payload.next_cursor, payload.proximo_cursor, payload.cursor_proximo, response.next_cursor, response.proximo_cursor], null);
      state.user.rankQualified.hasMore = booleanValue(firstDefined([payload.has_more, payload.tem_mais], !!state.user.rankQualified.cursor), !!state.user.rankQualified.cursor);
      renderRankQualified(false, "");
    } catch (requestError) {
      if (!append && !state.user.rankQualified.rows.length) state.user.rankQualified.rows = qualifiedRowsForRank(rank);
      state.user.rankQualified.hasMore = false;
      renderRankQualified(false, state.user.rankQualified.rows.length ? "" : "Não foi possível carregar os qualificados agora. Tente novamente.");
    }
  }

  async function openRankQualified(rankIndex) {
    var rank = state.user.ranks[integerValue(rankIndex, -1)];
    if (!rank) return;
    state.user.rankQualified = { rank: rank, rows: qualifiedRowsForRank(rank), cursor: null, hasMore: false };
    qs("rankQualifiedOverlay").hidden = false;
    document.body.classList.add("mmn-detail-open");
    renderRankQualified(true, "");
    await loadRankQualified(false);
  }

  function closeRankQualified() {
    qs("rankQualifiedOverlay").hidden = true;
    state.user.rankQualified = { rank: null, rows: [], cursor: null, hasMore: false };
    if (qs("networkExplorerOverlay").hidden && qs("networkDiagramOverlay").hidden && qs("evolutionChartOverlay").hidden) document.body.classList.remove("mmn-detail-open");
  }

  function renderUserPayments(data, append) {
    var summary = objectFrom(data, ["resumo", "saldo", "saldos"]);
    var rules = objectFrom(data, ["configuracao_publica", "regras"]);
    var parameters = objectFrom(rules, ["parametros"]);
    qs("userPaymentSummary").innerHTML = [
      ["Mínimo vigente", firstDefined([summary.minimo_pagamento_centavos, parameters.pagamento_minimo_centavos], null)],
      ["Em processamento", centsFrom(summary, ["aguardando_centavos", "reservado_centavos", "pendente_centavos"])],
      ["Pago", centsFrom(summary, ["total_pago_centavos", "pago_centavos"])]
    ].map(function (item) {
      return "<article class=\"mmn-payment-card\"><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(formatMoneyCents(item[1])) + "</strong></article>";
    }).join("");
    var rows = listFrom(data, ["pagamentos", "itens"]);
    var rpas = listFrom(data, ["rpas"]);
    var html = rows.map(function (row) {
      var rpa = rpas.find(function (item) {
        return String(item.competencia || "").slice(0, 10) === String(row.competencia || "").slice(0, 10) &&
          numberValue(item.liquido_centavos) === numberValue(row.liquido_centavos);
      }) || {};
      var rpaStatus = rpa.status || (row.rpa_documento ? "emitido" : (row.rpa_numero ? "rascunho" : "pendente"));
      var paid = row.status === "pago";
      var documentRef = rpa.documento_ref || row.rpa_documento || "";
      var documentHtml = /^https?:\/\//i.test(documentRef) ? "<a href=\"" + escapeHtml(documentRef) + "\" target=\"_blank\" rel=\"noopener\">Abrir documento RPA</a>" : escapeHtml(documentRef || "Documento ainda não emitido");
      return "<article class=\"mmn-payment-progress-card\"><div class=\"mmn-panel-title\"><div><h3>Competência " + escapeHtml(String(row.competencia || "").slice(0, 7)) + "</h3><p>Líquido: " + escapeHtml(formatMoneyCents(centsFrom(row, ["liquido_centavos"]))) + " · Retenções: " + escapeHtml(formatMoneyCents(centsFrom(row, ["retencoes_centavos"]))) + "</p></div>" + pillHtml(row.status) + "</div><div class=\"mmn-payment-steps\"><div class=\"is-complete\"><span>1</span><strong>Apurado</strong></div><div class=\"" + (["aprovado", "enfileirado", "processando", "pago"].indexOf(row.status) >= 0 ? "is-complete" : "is-current") + "\"><span>2</span><strong>Aprovado</strong></div><div class=\"" + (["emitido", "pago"].indexOf(rpaStatus) >= 0 ? "is-complete" : "is-current") + "\"><span>3</span><strong>RPA " + escapeHtml(rpaStatus) + "</strong></div><div class=\"" + (paid ? "is-complete" : (["enfileirado", "processando"].indexOf(row.status) >= 0 ? "is-current" : "")) + "\"><span>4</span><strong>Transferência " + escapeHtml(paid ? "confirmada" : "pendente") + "</strong></div></div><div class=\"mmn-payment-document\"><strong>" + escapeHtml(rpa.numero || row.rpa_numero || "RPA ainda sem número") + "</strong><span>" + documentHtml + "</span></div>" + disputeButtonHtml(row, "pagamento", ["id", "cod_mmn_lote_beneficiario"]) + "</article>";
    }).join("");
    if (append) qs("userPaymentList").insertAdjacentHTML("beforeend", html);
    else qs("userPaymentList").innerHTML = html || emptyHtml("Nenhum pagamento processado.");
    state.user.cursors.payments = data.proximo_cursor || data.cursor_proximo || null;
    qs("userPaymentsMore").hidden = !state.user.cursors.payments;
  }

  function renderSimulationResults(containerId, data) {
    var container = qs(containerId);
    if (!data || data.ok === false) {
      container.innerHTML = emptyHtml(friendlyMessage((data && data.error) || "simulacao_nao_executada"));
      return;
    }
    var summary = objectFrom(data, ["resumo", "resultado"]);
    var metrics = listFrom(data, ["metricas"]);
    if (!metrics.length) {
      Object.keys(summary).forEach(function (key) {
        var value = summary[key];
        if (typeof value !== "object") metrics.push({ chave: key, nome: key.replace(/_/g, " "), valor: value });
      });
    }
    var html = metrics.map(function (metric) {
      var value;
      if (metric.valor_centavos !== undefined) value = formatMoneyCents(metric.valor_centavos);
      else if (metric.tipo === "percentual") value = formatPercent(metric.valor);
      else value = firstDefined([metric.valor_formatado, metric.valor], "—");
      return "<article class=\"mmn-result-card\"><span>" + escapeHtml(metric.nome || metric.titulo || metric.chave || "Resultado") + "</span><strong>" + escapeHtml(value) + "</strong><small>" + escapeHtml(metric.descricao || "") + "</small></article>";
    }).join("");
    if (data.tipo === "usuario_pessoal") {
      var base = objectFrom(data, ["base_real"]);
      html = "<article class=\"mmn-simulation-context\"><span>Base real usada</span><strong>" + escapeHtml(formatInteger(base.rede_ativa)) + " pessoas ativas na rede · " + escapeHtml(formatInteger(base.diretos_ativos)) + " diretos ativos</strong><small>A projeção parte dos seus dados atuais e das regras vigentes.</small></article>" + html;
    }
    if (data.id_simulacao || data.simulacao_id) {
      html += "<div class=\"mmn-simulation-meta\"><span>Simulação #" + escapeHtml(data.id_simulacao || data.simulacao_id) + "</span>" + pillHtml(data.apta_publicacao ? "ok" : "pendente", data.apta_publicacao ? "Apta para publicação" : "Somente análise") + "<span>Motor " + escapeHtml(data.motor_versao || "V2") + "</span></div>";
    }
    var monthly = listFrom(data, ["serie", "projecao_mensal", "meses"]);
    if (monthly.length) {
      var personal = data.tipo === "usuario_pessoal";
      var replay = data.tipo === "admin_historica";
      html += "<div class=\"mmn-simulation-table table-wrap\"><table><thead><tr><th>Mês</th><th>Ativos</th><th>Receita</th><th>" + (personal ? "Bruto pessoal" : (replay ? "Payout real" : "Comissões")) + "</th><th>" + (personal ? "Líquido estimado" : (replay ? "Recalculado" : "Bônus e pool")) + "</th><th>Payout</th></tr></thead><tbody>" + monthly.map(function (row) {
        var real = objectFrom(row, ["real"]);
        var recalculated = objectFrom(row, ["recalculado"]);
        var fourth = personal ? row.ganho_bruto_centavos : (replay ? real.payout_centavos : row.comissoes_centavos);
        var fifth = personal ? row.liquido_estimado_centavos : (replay ? recalculated.payout_centavos : row.bonus_centavos);
        return "<tr><td>" + escapeHtml(row.competencia || row.mes || "") + "</td><td>" + escapeHtml(formatInteger(firstDefined([row.rede_ativa, row.usuarios_ativos, row.ativos], null))) + "</td><td>" + escapeHtml(formatMoneyCents(centsFrom(row, ["receita_centavos"]))) + "</td><td>" + escapeHtml(formatMoneyCents(fourth)) + "</td><td>" + escapeHtml(formatMoneyCents(fifth)) + "</td><td>" + escapeHtml(formatPercent(row.payout_percentual)) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    }
    var alerts = listFrom(data, ["alertas"]);
    if (alerts.length) html += "<div class=\"mmn-simulation-alerts\"><strong>Avisos da simulação</strong>" + alerts.map(function (alert) { return "<span>" + escapeHtml(String(alert).replace(/_/g, " ")) + "</span>"; }).join("") + "</div>";
    html += "<p class=\"mmn-disclaimer\">Simulação estimativa, sem promessa ou garantia de renda, pagamento ou resultado.</p>";
    container.innerHTML = html || emptyHtml("O servidor não retornou resultados para esta simulação.");
  }

  async function loadUserTab(tab, append) {
    try {
      var dashboard = state.user.dashboard || {};
      if (tab === "rede") {
        var network = objectFrom(dashboard, ["rede"]);
        var levels = listFrom(dashboard, ["niveis"]);
        if (!levels.length) levels = listFrom(network, ["por_nivel", "niveis", "total_por_nivel"]);
        var dashboardUser = objectFrom(dashboard, ["usuario"]);
        var dashboardParticipant = objectFrom(dashboard, ["participante", "usuario_mmn"]);
        var rootId = firstNonEmptyText([
          state.user.network.rootId,
          network.raiz_usuario_id,
          network.usuario_id,
          network.id_usuario,
          dashboardUser.usuario_id,
          dashboardUser.id_usuario,
          dashboardUser.cod_usuario,
          dashboardParticipant.usuario_id,
          dashboardParticipant.id_usuario,
          dashboardParticipant.cod_usuario,
          networkPersonSponsorId(listValue(network.diretos)[0])
        ], "");

        if (append) {
          var currentCursor = state.user.cursors.network;
          if (!rootId || currentCursor === null || currentCursor === "") {
            qs("userNetworkMore").hidden = true;
            return;
          }
          var networkPageResponse = await rpc(CONFIG.rpcs.userNetworkNode, {
            p_usuario_id: integerValue(rootId),
            p_limite: 100,
            p_cursor: currentCursor
          });
          var networkPage = objectFrom(networkPageResponse, ["dados", "resultado"]);
          if (!Object.keys(networkPage).length) networkPage = networkPageResponse || {};
          renderUserNetwork({
            no_usuario_id: rootId,
            diretos: listFrom(networkPage, ["itens", "indicados", "filhos", "participantes"]),
            next_cursor: firstDefined([networkPage.next_cursor, networkPage.proximo_cursor, networkPage.cursor_proximo], null),
            has_more: booleanValue(firstDefined([networkPage.has_more, networkPage.tem_mais], false), false)
          }, true);
          state.user.loaded[tab] = true;
          return;
        }

        var placementPayload = {};
        try {
          var placementNetwork = await rpc(CONFIG.rpcs.userPlacementNetwork, { p_limite: 1000 });
          placementPayload = objectFrom(placementNetwork, ["rede", "dados"]);
          if (!Object.keys(placementPayload).length) placementPayload = placementNetwork || {};
        } catch (networkError) {
          placementPayload = {};
        }
        rootId = firstNonEmptyText([
          rootId,
          placementPayload.raiz_usuario_id,
          placementPayload.usuario_id,
          placementPayload.id_usuario
        ], "");
        var positionedRows = listFrom(placementPayload, ["rede"]);
        var placementLevels = listFrom(placementPayload, ["por_nivel", "niveis", "levels"]);
        if (!placementLevels.length && positionedRows.length) {
          var grouped = {};
          positionedRows.forEach(function (row) {
            var level = integerValue(firstDefined([row.nivel, row.nivel_estrutural], 0));
            if (level < 1) return;
            if (!grouped[level]) grouped[level] = { nivel: level, total: 0, ativos: null };
            grouped[level].total += 1;
          });
          placementLevels = Object.keys(grouped).map(function (key) { return grouped[key]; }).sort(function (a, b) { return a.nivel - b.nivel; });
        }
        var placementDirects = listFrom(placementPayload, ["patrocinio", "diretos", "indicados_diretos"]);
        if (!placementDirects.length) placementDirects = listFrom(objectFrom(placementPayload, ["patrocinio", "arvore_patrocinio"]), ["diretos", "indicados", "participantes"]);

        var directPage = {};
        if (rootId) {
          try {
            var directResponse = await rpc(CONFIG.rpcs.userNetworkNode, {
              p_usuario_id: integerValue(rootId),
              p_limite: 100,
              p_cursor: null
            });
            directPage = objectFrom(directResponse, ["dados", "resultado"]);
            if (!Object.keys(directPage).length) directPage = directResponse || {};
          } catch (directError) {
            directPage = {};
          }
        }
        var directRows = listFrom(directPage, ["itens", "indicados", "filhos", "participantes"]);
        renderUserNetwork(Object.assign({}, network, placementPayload, {
          raiz_usuario_id: rootId,
          niveis: placementLevels.length ? placementLevels : levels,
          diretos: directRows.length ? directRows : (placementDirects.length ? placementDirects : (network.diretos || [])),
          next_cursor: firstDefined([directPage.next_cursor, directPage.proximo_cursor, directPage.cursor_proximo], null),
          has_more: booleanValue(firstDefined([directPage.has_more, directPage.tem_mais], false), false),
          regras: objectFrom(dashboard, ["regras", "configuracao_publica"]),
          participante: dashboardParticipant
        }), false);
      } else if (tab === "extrato") {
        var selectedPeriod = qs("userLedgerPeriod").value;
        var entries = listFrom(dashboard, ["historico_mensal", "extrato"]).filter(function (row) {
          return !selectedPeriod || String(row.competencia || row.periodo || "").slice(0, 7) === selectedPeriod;
        });
        renderUserLedger({ lancamentos: entries }, false);
      } else if (tab === "beneficios") {
        var publicConfig = objectFrom(dashboard, ["regras", "configuracao_publica"]);
        var userBonuses = listFrom(dashboard, ["bonificacoes", "bonus"]);
        if (!userBonuses.length) userBonuses = bonusesFromEvolution(dashboard);
        renderUserBonuses({ ranks: listFrom(publicConfig, ["ranks"]), bonificacoes: userBonuses, qualificacao: objectFrom(dashboard, ["qualificacao_atual", "qualificacao"]), extrato: listFrom(dashboard, ["extrato"]) });
      } else if (tab === "pagamentos") {
        renderUserPayments({ pagamentos: listFrom(dashboard, ["pagamentos"]), rpas: listFrom(dashboard, ["rpas"]), resumo: objectFrom(dashboard, ["resumo"]), saldo: objectFrom(dashboard, ["saldo"]), configuracao_publica: objectFrom(dashboard, ["configuracao_publica", "regras"]) }, false);
      }
      state.user.loaded[tab] = true;
    } catch (error) {
      setGlobalError(error);
    }
  }

  function activateUserTab(tab) {
    qsa("[data-user-tab]").forEach(function (button) {
      var active = button.getAttribute("data-user-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa("[data-user-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-user-panel") !== tab;
    });
    if (["rede", "extrato", "beneficios", "pagamentos"].indexOf(tab) >= 0 && !state.user.loaded[tab]) loadUserTab(tab, false);
  }

  function renderAdminOverview(data) {
    var summary = objectFrom(data, ["resumo", "metricas"]);
    var period = objectFrom(data, ["periodo"]);
    var revenue = centsFrom(summary, ["receita_confirmada_centavos", "receita_reconhecida_centavos", "receita_centavos", "mrr_centavos"]);
    var allocated = numberValue(period.total_comissao_base_centavos) + numberValue(period.total_bonus_rank_centavos) + numberValue(period.total_pool_centavos);
    var payout = numberValue(revenue) > 0 ? allocated * 100 / numberValue(revenue) : null;
    setText("adminMetricRevenue", formatMoneyCents(revenue));
    setText("adminMetricPayout", formatPercent(firstDefined([summary.payout_efetivo_percentual, summary.payout_percentual, payout], null)));
    setText("adminMetricAllocated", formatMoneyCents(firstDefined([summary.alocado_centavos, summary.comissoes_bonus_centavos, summary.comissao_centavos], allocated)));
    setText("adminMetricReserve", formatMoneyCents(firstDefined([summary.reserva_centavos], period.total_reserva_centavos)));
    setText("adminMetricEligible", formatInteger(firstDefined([summary.participantes_elegiveis, summary.elegiveis], null)));
    setText("adminMetricPending", formatInteger(firstDefined([summary.pendencias, summary.total_pendencias], numberValue(summary.espera_pendente) + numberValue(summary.ocorrencias_abertas) + numberValue(summary.pendentes_regulamento))));
    var levels = listFrom(data, ["niveis", "levels"]);
    if (!levels.length) levels = listFrom(objectFrom(data, ["regras"]), ["niveis", "levels"]);
    var adminDepth = configuredNetworkDepth(data);
    levels = levels.filter(function (row) { return integerValue(row.nivel) >= 1 && integerValue(row.nivel) <= adminDepth; });
    var max = Math.max.apply(null, levels.map(function (row) { return numberValue(row.percentual); }).concat([1]));
    qs("adminLevelBars").innerHTML = levels.length ? levels.map(function (row) {
      return "<div class=\"mmn-level-bar\"><strong>Nível " + escapeHtml(row.nivel) + "</strong><span class=\"mmn-level-bar-track\"><span style=\"width:" + Math.max(0, Math.min(100, numberValue(row.percentual) / max * 100)) + "%\"></span></span><span>" + escapeHtml(formatPercent(row.percentual)) + "</span></div>";
    }).join("") : emptyHtml("A versão vigente ainda não retornou os níveis.");
    var health = listFrom(data, ["saude", "pendencias_resumo"]);
    if (!health.length && data.alertas && typeof data.alertas === "object") {
      health = Object.keys(data.alertas).map(function (key) {
        var value = data.alertas[key];
        var status;
        if (key === "pagamento_real_bloqueado") status = booleanValue(value, true) ? "pendente" : "ok";
        else if (key === "fiscal_homologado") status = booleanValue(value, false) ? "ok" : "pendente";
        else status = typeof value === "boolean" ? (value ? "ok" : "pendente") : (numberValue(value) > 0 ? "pendente" : "ok");
        return { nome: key.replace(/_/g, " "), status: status, valor_formatado: typeof value === "boolean" ? (value ? "Sim" : "Não") : value };
      });
    }
    qs("adminHealthList").innerHTML = health.length ? health.map(function (item) {
      return "<div class=\"mmn-health-item\"><span>" + escapeHtml(item.nome || item.titulo || item.tipo || "Verificação") + "</span>" + pillHtml(item.status || (item.ok ? "ok" : "pendente"), item.valor_formatado || item.status_texto || item.status || "") + "</div>";
    }).join("") : emptyHtml("Nenhuma pendência operacional informada.");
  }

  function renderAdminPeriods(data, append) {
    var rows = listFrom(data, ["competencias", "periodos", "itens"]);
    var html = rows.map(function (row) {
      var id = row.cod_mmn_competencia || row.cod_mmn_periodo || row.id;
      var actions = [];
      if (["aberto", "reaberto"].indexOf(row.status) >= 0) actions.push(["apurar", "Apurar"]);
      if (row.status === "revisao") actions.push(["fechar", "Fechar"]);
      if (["fechado", "liberado"].indexOf(row.status) >= 0) actions.push(["reabrir", "Reabrir"]);
      var periodRevenue = centsFrom(row, ["total_receita_centavos", "receita_centavos", "mrr_centavos"]);
      var periodAllocated = numberValue(row.total_comissao_base_centavos) + numberValue(row.total_bonus_rank_centavos) + numberValue(row.total_pool_centavos);
      var periodPayout = numberValue(periodRevenue) > 0 ? periodAllocated * 100 / numberValue(periodRevenue) : null;
      return "<tr><td><strong>" + escapeHtml(row.competencia || row.periodo || "") + "</strong></td><td>Config. #" + escapeHtml(row.id_config || row.versao_nome || row.configuracao_versao || "—") + "</td><td>" + escapeHtml(formatMoneyCents(periodRevenue)) + "</td><td>" + escapeHtml(formatPercent(firstDefined([row.payout_percentual, periodPayout], null))) + "</td><td>" + pillHtml(row.status) + "</td><td><div class=\"btn-row\">" + actions.map(function (action) { return "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-period-action=\"" + action[0] + "\" data-period-value=\"" + escapeHtml(row.competencia || row.periodo || "") + "\" data-period-id=\"" + escapeHtml(id) + "\">" + action[1] + "</button>"; }).join("") + "</div></td></tr>";
    }).join("");
    if (append) qs("adminPeriodsBody").insertAdjacentHTML("beforeend", html);
    else qs("adminPeriodsBody").innerHTML = html || emptyTableHtml(6, "Nenhuma competência encontrada.");
    state.admin.cursors.periods = data.proximo_cursor || null;
    qs("adminPeriodsMore").hidden = !state.admin.cursors.periods;
  }

  function renderAdminParticipants(data, append) {
    var rows = listFrom(data, ["participantes", "usuarios", "itens"]);
    var html = rows.map(function (row) {
      var id = row.usuario_id || row.id_usuario || row.cod_usuario;
      var eligibility = objectFrom(row, ["elegibilidade"]);
      var placement = objectFrom(row, ["posicionamento", "posicao"]);
      var placementParent = firstDefined([placement.pai_posicionamento_id, row.pai_posicionamento_id], null);
      var placementSlot = firstDefined([placement.slot_posicionamento, placement.slot, row.slot_posicionamento], null);
      var userLogin = cleanText(firstDefined([row.loginuser, row.usuario_loginuser, row.login, row.codinome], "Usuário"));
      var sponsorLogin = cleanText(firstDefined([row.patrocinador_loginuser, row.patrocinador_login], row.patrocinador_id ? "Usuário" : "Raiz"));
      var placementParentLogin = cleanText(firstDefined([placement.pai_posicionamento_loginuser, row.pai_posicionamento_loginuser], placementParent == null ? "Raiz estrutural" : "Usuário"));
      var placementText = placementParentLogin + (placementSlot == null ? "" : " · #" + placementSlot);
      var spillover = booleanValue(firstDefined([placement.spillover, placement.foi_spillover, row.foi_spillover], false), false);
      var permanent = row.status === "inelegivel_permanente" || booleanValue(row.inelegibilidade_permanente, false);
      return "<tr><td><strong>" + escapeHtml(userLogin) + "</strong><br><small>" + escapeHtml(row.nome || "") + "</small></td><td>" + escapeHtml(sponsorLogin) + "<br><small>Indicação direta</small></td><td>" + escapeHtml(placementText) + "<br><small>" + escapeHtml(spillover ? "Spillover" : "Posição direta") + "</small></td><td>" + escapeHtml(row.grupo || row.grupo_chave || "—") + "</td><td>" + pillHtml(eligibility.premium_vigente ? "ativo" : "pendente", eligibility.premium_vigente ? "Em dia" : "Inativo") + "</td><td>" + pillHtml(permanent ? "permanente" : (eligibility.elegivel_receber ? "ativo" : row.status), permanent ? "Permanente" : (eligibility.elegivel_receber ? "Elegível" : row.status)) + "</td><td>" + escapeHtml(row.rank_nome || row.rank || "—") + "</td><td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-participant-edit=\"" + escapeHtml(id) + "\">Gerenciar</button></td></tr>";
    }).join("");
    if (append) qs("adminParticipantsBody").insertAdjacentHTML("beforeend", html);
    else qs("adminParticipantsBody").innerHTML = html || emptyTableHtml(8, "Nenhum participante encontrado.");
    state.admin.participants = append ? (state.admin.participants || []).concat(rows) : rows;
    state.admin.cursors.participants = data.next_cursor || data.proximo_cursor || null;
    qs("adminParticipantsMore").hidden = data.has_more === false || !state.admin.cursors.participants;
  }

  function renderAdminWaitlist(data, append) {
    var rows = listFrom(data, ["lista_espera", "cadastros", "itens"]);
    var html = rows.map(function (row) {
      var id = row.cod_mmn_espera_vinculo || row.id;
      var actions = row.status === "prazo_expirado" ? [["reativar", "Reativar prazo"], ["aprovar", "Aprovar"], ["cancelar", "Cancelar"]] :
        (row.status === "convertido" || row.status === "cancelado" ? [] : [["aprovar", "Aprovar"], ["revisao", "Revisar"], ["cancelar", "Cancelar"]]);
      return "<tr><td><strong>#" + escapeHtml(row.codigo_convite || row.codigo || "") + "</strong></td><td>#" + escapeHtml(row.id_lead || "—") + "</td><td>" + escapeHtml(row.id_usuario_convertido ? "#" + row.id_usuario_convertido : "Aguardando cadastro") + "</td><td>#" + escapeHtml(row.id_lead_patrocinador || "—") + "</td><td>" + escapeHtml(formatDate(row.prazo_vinculacao_ate || row.prazo_ate || row.expira_em, false)) + "</td><td>" + pillHtml(row.status) + "</td><td><div class=\"btn-row\">" + (actions.map(function (action) { return "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-waitlist-action=\"" + action[0] + "\" data-waitlist-id=\"" + escapeHtml(id) + "\">" + action[1] + "</button>"; }).join("") || "—") + "</div></td></tr>";
    }).join("");
    if (append) qs("adminWaitlistBody").insertAdjacentHTML("beforeend", html);
    else qs("adminWaitlistBody").innerHTML = html || emptyTableHtml(7, "Nenhum cadastro na lista de espera.");
    state.admin.cursors.waitlist = data.next_cursor || data.proximo_cursor || null;
    qs("adminWaitlistMore").hidden = data.has_more === false || !state.admin.cursors.waitlist;
  }

  function renderAdminNetwork(data) {
    var network = data.rede || data;
    var base = objectFrom(network, ["usuario", "base"]);
    var participant = objectFrom(network, ["participante"]);
    var sponsorship = objectFrom(network, ["patrocinio", "arvore_patrocinio"]);
    var placement = objectFrom(network, ["posicionamento", "arvore_posicionamento"]);
    var depth = configuredNetworkDepth(network);
    var width = configuredPlacementWidth(network);
    var levels = listFrom(network, ["rede_por_nivel", "niveis", "levels"]).filter(function (level) { return integerValue(level.nivel) >= 1 && integerValue(level.nivel) <= depth; });
    var directs = listFrom(network, ["diretos"]);
    if (!directs.length) directs = listFrom(sponsorship, ["diretos", "filhos"]);
    var positioned = listFrom(placement, ["filhos", "posicoes", "participantes"]);
    var html = "";
    if (base.id || base.cod_usuario || base.id_usuario) {
      var baseLogin = cleanText(firstDefined([base.loginuser, base.usuario_loginuser, base.login, base.codinome], "Usuário"));
      var adminSponsorLogin = cleanText(firstDefined([participant.patrocinador_loginuser, data.patrocinador_loginuser], participant.id_patrocinador || participant.patrocinador_id ? "Usuário" : "Raiz"));
      var adminParentLogin = cleanText(firstDefined([placement.pai_posicionamento_loginuser, participant.pai_posicionamento_loginuser], placement.pai_posicionamento_id || participant.pai_posicionamento_id ? "Usuário" : "Raiz estrutural"));
      var adminSlot = firstDefined([placement.slot_posicionamento, participant.slot_posicionamento], null);
      html += "<article class=\"mmn-feature-panel\"><div class=\"mmn-panel-title\"><div><h3>" + escapeHtml(baseLogin) + "</h3><p>" + escapeHtml(base.nome || "") + "</p></div>" + pillHtml(participant.status || (base.mmn_ativo ? "ativo" : "suspenso")) + "</div><div class=\"mmn-genealogy-summary\"><div><span>Patrocínio</span><strong>" + escapeHtml(relationPersonLabel(objectFrom(sponsorship, ["patrocinador", "pai"]), adminSponsorLogin)) + "</strong><small>Origem da comissão direta.</small></div><div><span>Pai de posicionamento</span><strong>" + escapeHtml(relationPersonLabel(objectFrom(placement, ["pai", "pai_posicionamento"]), adminParentLogin)) + "</strong><small>Origem dos níveis residuais.</small></div><div><span>Vaga</span><strong>" + escapeHtml(adminSlot == null ? "—" : "#" + adminSlot) + "</strong><small>Slot estrutural registrado.</small></div><div><span>Regra</span><strong>" + escapeHtml(width === 0 ? "Largura ilimitada" : (width + " vagas por nó")) + "</strong><small>Profundidade remunerada: " + escapeHtml(depth) + " nível(is).</small></div></div></article>";
    }
    html += "<div class=\"mmn-tree-explanation\"><strong>Duas genealogias independentes</strong><span>Patrocínio preserva quem convidou. Posicionamento organiza as vagas e o spillover. A comissão direta prevalece e o mesmo beneficiário não recebe duas vezes sobre a mesma assinatura.</span></div>";
    html += levels.map(function (level) {
      return "<div class=\"mmn-tree-level\"><strong>Nível " + escapeHtml(level.nivel) + "</strong><div class=\"mmn-tree-people\"><div class=\"mmn-tree-person\"><strong>" + escapeHtml(formatInteger(level.ativos)) + " ativos</strong><span>de " + escapeHtml(formatInteger(level.total)) + " participantes</span></div></div></div>";
    }).join("");
    if (directs.length) html += "<div class=\"mmn-tree-level\"><strong>Patrocínio · indicados diretos</strong><div class=\"mmn-tree-people\">" + directs.map(function (person) { return "<div class=\"mmn-tree-person\"><strong>" + escapeHtml(firstDefined([person.loginuser, person.usuario_loginuser, person.login, person.codinome, person.nome], "Usuário")) + "</strong><span>Vínculo permanente de indicação</span>" + pillHtml(person.status || (person.ativo ? "ativo" : "suspenso")) + "</div>"; }).join("") + "</div></div>";
    if (positioned.length) html += "<div class=\"mmn-tree-level\"><strong>Posicionamento · vagas abaixo</strong><div class=\"mmn-tree-people\">" + positioned.map(function (person) { return "<div class=\"mmn-tree-person\"><strong>" + escapeHtml(firstDefined([person.loginuser, person.usuario_loginuser, person.login, person.codinome, person.nome], "Usuário")) + "</strong><span>#" + escapeHtml(firstDefined([person.slot_posicionamento, person.slot], "—")) + (booleanValue(firstDefined([person.spillover, person.foi_spillover], false), false) ? " · spillover" : " · posição direta") + "</span>" + pillHtml(person.status || (person.ativo ? "ativo" : "suspenso")) + "</div>"; }).join("") + "</div></div>";
    qs("adminNetworkTree").innerHTML = html || emptyHtml("Nenhuma genealogia encontrada para esse usuário.");
  }

  function renderAdminRevenue(data, append) {
    var rows = listFrom(data, ["lancamentos", "receitas", "alocacoes", "itens"]);
    var html = rows.map(function (row) {
      return "<tr><td>" + escapeHtml(formatDate(row.ingerido_em || row.criado_em || row.data_evento, true)) + "</td><td><strong>" + escapeHtml(firstDefined([row.loginuser, row.origem_loginuser, row.usuario_loginuser, row.nome, row.origem_nome], "Usuário")) + "</strong><br><small>" + escapeHtml(row.nome || row.origem_nome || "") + "</small></td><td>#" + escapeHtml(row.id_pagamento || "—") + "<br><small>" + escapeHtml(row.gateway_payment_id || "") + "</small></td><td>" + escapeHtml(row.gateway || "—") + "</td><td><strong>" + escapeHtml(formatMoneyCents(centsFrom(row, ["valor_pago_centavos"]))) + "</strong></td><td>" + (row.valor_confirmado ? escapeHtml(formatDate(row.confirmado_em, true)) : "Aguardando") + "</td><td>" + pillHtml(row.gera_comissao ? "ativo" : "bloqueado", row.gera_comissao ? "Gera" : (row.motivo_nao_geracao || "Não gera")) + "</td><td>" + pillHtml(row.status) + "</td></tr>";
    }).join("");
    if (append) qs("adminRevenueBody").insertAdjacentHTML("beforeend", html);
    else qs("adminRevenueBody").innerHTML = html || emptyTableHtml(8, "Nenhum lançamento encontrado.");
    state.admin.cursors.revenue = data.next_cursor || data.proximo_cursor || null;
    qs("adminRevenueMore").hidden = data.has_more === false || !state.admin.cursors.revenue;
  }

  function configVersions(data) {
    return listFrom(data, ["versoes", "configuracoes", "itens"]);
  }

  function normalizeConfigResponse(data) {
    var source = data || {};
    var row = objectFrom(source, ["config", "configuracao", "configuracao_ativa"]);
    if (!Object.keys(row).length && (source.cod_mmn_config || source.cod_mmn_configuracao || source.id)) row = source;
    var parameters = objectFrom(row, ["parametros"]);
    var normalized = Object.assign({}, parameters, row);
    normalized.parametros = Object.assign({}, parameters);
    normalized.cod_mmn_config = row.cod_mmn_config || row.cod_mmn_configuracao || row.id || null;
    normalized.niveis = listFrom(source, ["niveis", "percentuais_nivel"]);
    if (!normalized.niveis.length) normalized.niveis = listFrom(row, ["niveis", "percentuais_nivel"]);
    normalized.ranks = listFrom(source, ["ranks"]);
    if (!normalized.ranks.length) normalized.ranks = listFrom(row, ["ranks"]);
    normalized.grupos_isentos = listFrom(source, ["grupos_isentos", "grupos"]);
    if (!normalized.grupos_isentos.length) normalized.grupos_isentos = listFrom(row, ["grupos_isentos", "grupos"]);
    normalized.retencoes = listFrom(source, ["retencoes", "taxas"]);
    if (!normalized.retencoes.length) normalized.retencoes = listFrom(row, ["retencoes", "taxas"]);
    normalized.aprovadores = listFrom(source, ["aprovadores"]);
    normalized.documento_regulamento = objectFrom(source, ["documento_regulamento"]);
    if (!Object.keys(normalized.documento_regulamento).length) normalized.documento_regulamento = objectFrom(row, ["documento_regulamento"]);
    normalized.validacao = objectFrom(source, ["validacao", "validacao_config"]);
    normalized.hash_atual = source.hash_atual || row.hash_atual || null;
    normalized.regras_hash_atual = source.regras_hash_atual || row.regras_hash_atual || null;
    return normalized;
  }

  function calculateNetworkCapacity(width, depth) {
    width = integerValue(width, 0);
    depth = Math.max(1, Math.min(10, integerValue(depth, 6)));
    if (width === 0) return { unlimited: true, levels: [], total: null, perLeg: null };
    var levels = [];
    var total = 0;
    var perLeg = 0;
    for (var level = 1; level <= depth; level += 1) {
      var capacity = Math.pow(width, level);
      levels.push(capacity);
      total += capacity;
      perLeg += Math.pow(width, level - 1);
    }
    return { unlimited: false, levels: levels, total: total, perLeg: perLeg };
  }

  function formatCapacity(value) {
    if (value == null) return "Ilimitada";
    if (!Number.isFinite(value) || value > Number.MAX_SAFE_INTEGER) return "Acima do limite numérico de exibição";
    return formatInteger(value);
  }

  function updateConfigNetworkStructure() {
    var depth = Math.max(1, Math.min(10, integerValue(qs("adminConfigLevelCount").value, 6)));
    var width = integerValue(qs("adminConfigPlacementWidth").value, 0);
    qsa("[data-level-row]").forEach(function (row) {
      var outside = integerValue(row.dataset.levelNumber) > depth;
      row.classList.toggle("is-outside-depth", outside);
      row.setAttribute("aria-disabled", outside ? "true" : "false");
      qsa("[data-level-field]", row).forEach(function (field) { field.disabled = outside; });
    });
    var capacity = calculateNetworkCapacity(width, depth);
    var summary = qs("adminNetworkCapacity");
    if (summary) {
      if (width === 0) {
        summary.innerHTML = "<strong>Largura ilimitada</strong><span>Não há limite estrutural horizontal. A profundidade remunerada permanece em " + escapeHtml(depth) + " nível(is).</span>";
      } else if (width >= 2) {
        var levelSummary = capacity.levels.map(function (value, index) { return "N" + (index + 1) + ": " + formatCapacity(value); }).join(" · ");
        summary.innerHTML = "<strong>Capacidade teórica da matriz</strong><span>Por nível (W<sup>d</sup>): " + escapeHtml(levelSummary) + "</span><span>Rede até o nível " + escapeHtml(depth) + ": " + escapeHtml(formatCapacity(capacity.total)) + " posições</span><span>Capacidade por perna: " + escapeHtml(formatCapacity(capacity.perLeg)) + " posições</span>";
      } else {
        summary.innerHTML = "<strong>Configuração inválida</strong><span>Use 0 para ilimitada ou um inteiro a partir de 2.</span>";
      }
    }
  }

  function validateConfigNetworkStructure(showStatus) {
    var fields = [qs("adminConfigLevelCount"), qs("adminConfigPlacementWidth")].concat(qsa("[data-level-field], [data-rank-field]"));
    fields.forEach(function (field) { if (field && typeof field.setCustomValidity === "function") field.setCustomValidity(""); });
    var depthValue = Number(qs("adminConfigLevelCount").value);
    var widthValue = Number(qs("adminConfigPlacementWidth").value);
    var message = "";
    var invalidField = null;
    function invalidate(field, text) {
      if (message) return;
      message = text;
      invalidField = field;
      if (field && typeof field.setCustomValidity === "function") field.setCustomValidity(text);
    }
    if (!Number.isInteger(depthValue) || depthValue < 1 || depthValue > 10) invalidate(qs("adminConfigLevelCount"), "A quantidade de níveis deve ser um inteiro de 1 a 10.");
    if (!Number.isInteger(widthValue) || widthValue < 0 || widthValue === 1 || widthValue > 2147483647) invalidate(qs("adminConfigPlacementWidth"), "A largura deve ser 0 para ilimitada ou um inteiro de 2 a 2.147.483.647.");
    var depth = Number.isInteger(depthValue) ? depthValue : 6;
    var width = Number.isInteger(widthValue) ? widthValue : 0;
    var capacity = calculateNetworkCapacity(width, depth);
    if (!message && width >= 2) {
      qsa("[data-level-row]").some(function (row) {
        var level = integerValue(row.dataset.levelNumber);
        if (level > depth) return false;
        var activeField = row.querySelector("[data-level-field=\"ativo\"]");
        if (activeField && activeField.value !== "true") return false;
        var directs = row.querySelector("[data-level-field=\"min_diretos_ativos\"]");
        var legs = row.querySelector("[data-level-field=\"min_pernas_qualificadas\"]");
        var perLeg = row.querySelector("[data-level-field=\"min_ativos_por_perna\"]");
        if (numberValue(directs.value) > width) invalidate(directs, "No nível " + level + ", diretos ativos mínimos não pode superar a largura atual de " + width + ".");
        else if (numberValue(legs.value) > width) invalidate(legs, "No nível " + level + ", pernas qualificadas não pode superar a largura atual de " + width + ".");
        else if (Number.isFinite(capacity.perLeg) && numberValue(perLeg.value) > capacity.perLeg) invalidate(perLeg, "No nível " + level + ", ativos mínimos por perna supera a capacidade teórica de " + formatCapacity(capacity.perLeg) + ".");
        else if (Number.isFinite(capacity.total) && numberValue(legs.value) * numberValue(perLeg.value) > capacity.total) invalidate(perLeg, "No nível " + level + ", a combinação de pernas e ativos por perna supera a capacidade total de " + formatCapacity(capacity.total) + ".");
        return !!message;
      });
      if (!message) qsa("[data-rank-row]").some(function (row) {
        var activeField = row.querySelector("[data-rank-field=\"ativo\"]");
        if (activeField && activeField.value !== "true") return false;
        var name = (row.querySelector("[data-rank-field=\"nome\"]") || {}).value || "rank";
        var directs = row.querySelector("[data-rank-field=\"min_diretos_ativos\"]");
        var network = row.querySelector("[data-rank-field=\"min_rede_ativa\"]");
        var concentration = row.querySelector("[data-rank-field=\"max_percentual_maior_perna\"]");
        if (numberValue(directs.value) > width) invalidate(directs, "No rank " + name + ", diretos ativos mínimos não pode superar a largura atual de " + width + ".");
        else if (Number.isFinite(capacity.total) && numberValue(network.value) > capacity.total) invalidate(network, "No rank " + name + ", a rede ativa mínima supera a capacidade teórica de " + formatCapacity(capacity.total) + ".");
        else if (numberValue(network.value) > 0 && numberValue(concentration.value) < 100 / width) invalidate(concentration, "No rank " + name + ", a maior perna não pode ter limite inferior ao mínimo teórico de " + formatPercent(100 / width) + " para largura " + width + ".");
        return !!message;
      });
    }
    if (showStatus && message) setStatus("adminConfigStatus", message, "error");
    return { valid: !message, message: message, field: invalidField };
  }

  function renderConfigRows(config) {
    var existingLevels = listFrom(config, ["niveis", "percentuais_nivel"]);
    var depth = Math.max(1, Math.min(10, integerValue(firstDefined([config.quantidade_niveis, objectFrom(config, ["parametros"]).quantidade_niveis], 6), 6)));
    var levels = [];
    for (var level = 1; level <= 10; level += 1) {
      var existing = existingLevels.find(function (row) { return integerValue(row.nivel) === level; });
      levels.push(Object.assign({ nivel: level, percentual: 0, min_diretos_ativos: 0, min_pernas_qualificadas: 0, min_ativos_por_perna: 0, ativo: level <= depth }, existing || {}));
    }
    qs("adminLevelConfig").innerHTML = levels.map(function (row) {
      return "<div class=\"mmn-config-row\" data-level-row data-level-number=\"" + escapeHtml(row.nivel) + "\"><strong>Nível " + escapeHtml(row.nivel) + "</strong><label class=\"field\"><span>Percentual (%)</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-level-field=\"percentual\" value=\"" + escapeHtml(firstDefined([row.percentual], 0)) + "\"></label><label class=\"field\"><span>Diretos ativos mínimos</span><input type=\"number\" min=\"0\" data-level-field=\"min_diretos_ativos\" value=\"" + escapeHtml(firstDefined([row.min_diretos_ativos], 0)) + "\"></label><label class=\"field\"><span>Pernas qualificadas mínimas</span><input type=\"number\" min=\"0\" data-level-field=\"min_pernas_qualificadas\" value=\"" + escapeHtml(firstDefined([row.min_pernas_qualificadas], 0)) + "\"></label><label class=\"field\"><span>Ativos mínimos por perna</span><input type=\"number\" min=\"0\" data-level-field=\"min_ativos_por_perna\" value=\"" + escapeHtml(firstDefined([row.min_ativos_por_perna], 0)) + "\"></label><label class=\"field\"><span>Ativo</span><select data-level-field=\"ativo\"><option value=\"true\" " + (booleanValue(row.ativo, true) ? "selected" : "") + ">Sim</option><option value=\"false\" " + (!booleanValue(row.ativo, true) ? "selected" : "") + ">Não</option></select></label></div>";
    }).join("");
    var ranks = listFrom(config, ["ranks"]);
    qs("adminRankConfig").innerHTML = ranks.map(rankRowHtml).join("") || emptyHtml("Nenhum rank configurado.");
    var groups = listFrom(config, ["grupos_isentos", "grupos"]);
    qs("adminGroupConfig").innerHTML = groups.map(groupRowHtml).join("") || emptyHtml("Nenhum grupo isento configurado.");
    var taxes = listFrom(config, ["retencoes", "taxas"]);
    qs("adminTaxConfig").innerHTML = taxes.map(taxRowHtml).join("") || emptyHtml("Nenhuma retenção configurada.");
    var approvers = listFrom(config, ["aprovadores"]);
    var actionNames = { publicacao: "Publicação", fechamento: "Fechamento", pagamento: "Pagamento", reabertura: "Reabertura" };
    qs("adminApproverList").innerHTML = approvers.length ? approvers.map(function (row) {
      var identity = row.uid_admin ? ("UID " + row.uid_admin) : ("Perfil " + (row.perfil_chave || "—"));
      return "<div class=\"mmn-config-row\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(identity) + "</strong><small>" + escapeHtml(actionNames[row.acao] || row.acao || "Pagamento") + "</small></div>" + pillHtml(row.ativo ? "ativo" : "bloqueado", row.ativo ? "Ativo" : "Inativo") + "</div>";
    }).join("") : emptyHtml("Nenhum aprovador adicional configurado.");
    updateConfigNetworkStructure();
    validateConfigNetworkStructure(false);
  }

  function rankRowHtml(row) {
    return "<div class=\"mmn-config-row\" data-rank-row data-rank-id=\"" + escapeHtml(row.cod_mmn_config_rank || row.id || "") + "\"><label class=\"field\"><span>Chave</span><input data-rank-field=\"chave\" value=\"" + escapeHtml(row.chave || "") + "\"></label><label class=\"field\"><span>Nome</span><input data-rank-field=\"nome\" value=\"" + escapeHtml(row.nome || "") + "\"></label><label class=\"field\"><span>Rede ativa mínima</span><input type=\"number\" min=\"0\" data-rank-field=\"min_rede_ativa\" value=\"" + escapeHtml(row.min_rede_ativa || 0) + "\"></label><label class=\"field\"><span>Diretos ativos mínimos</span><input type=\"number\" min=\"0\" data-rank-field=\"min_diretos_ativos\" value=\"" + escapeHtml(row.min_diretos_ativos || 0) + "\"></label><label class=\"field\"><span>Máximo da maior perna (%)</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-rank-field=\"max_percentual_maior_perna\" value=\"" + escapeHtml(firstDefined([row.max_percentual_maior_perna], 60)) + "\"></label><label class=\"field\"><span>Bônus de liderança (%)</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-rank-field=\"bonus_percentual\" value=\"" + escapeHtml(row.bonus_percentual || 0) + "\"></label><label class=\"field\"><span>Coeficiente pool</span><input type=\"number\" min=\"0\" step=\"0.001\" data-rank-field=\"pool_coeficiente\" value=\"" + escapeHtml(row.pool_coeficiente || 0) + "\"></label><label class=\"field\"><span>Ativo</span><select data-rank-field=\"ativo\"><option value=\"true\" " + (booleanValue(row.ativo, true) ? "selected" : "") + ">Sim</option><option value=\"false\" " + (!booleanValue(row.ativo, true) ? "selected" : "") + ">Não</option></select></label><button class=\"btn btn-ghost\" type=\"button\" data-remove-row>Remover</button></div>";
  }

  function groupRowHtml(row) {
    return "<div class=\"mmn-config-row\" data-group-row data-group-id=\"" + escapeHtml(row.cod_mmn_config_grupo || row.id || "") + "\"><label class=\"field\"><span>Grupo</span><input data-group-field=\"grupo_chave\" value=\"" + escapeHtml(row.grupo_chave || row.chave || "") + "\"></label><label class=\"field\"><span>Dispensa Premium</span><select data-group-field=\"dispensa_premium\"><option value=\"true\" " + (booleanValue(firstDefined([row.dispensa_premium, row.isento_premium], true), true) ? "selected" : "") + ">Sim</option><option value=\"false\" " + (!booleanValue(firstDefined([row.dispensa_premium, row.isento_premium], true), true) ? "selected" : "") + ">Não</option></select></label><label class=\"field\"><span>Ativo</span><select data-group-field=\"ativo\"><option value=\"true\" " + (booleanValue(row.ativo, true) ? "selected" : "") + ">Sim</option><option value=\"false\" " + (!booleanValue(row.ativo, true) ? "selected" : "") + ">Não</option></select></label><button class=\"btn btn-ghost\" type=\"button\" data-remove-row>Remover</button></div>";
  }

  function taxRowHtml(row) {
    var type = row.tipo || "percentual";
    var parameters = JSON.stringify(row.parametros && typeof row.parametros === "object" ? row.parametros : {}, null, 2);
    return "<div class=\"mmn-tax-row\" data-tax-row data-tax-id=\"" + escapeHtml(row.cod_mmn_config_retencao || row.id || "") + "\"><label class=\"field\"><span>Chave</span><input data-tax-field=\"chave\" value=\"" + escapeHtml(row.chave || "") + "\"></label><label class=\"field\"><span>Nome</span><input data-tax-field=\"nome\" value=\"" + escapeHtml(row.nome || "") + "\"></label><label class=\"field\"><span>Tipo</span><select data-tax-field=\"tipo\"><option value=\"percentual\" " + (type === "percentual" ? "selected" : "") + ">Percentual</option><option value=\"valor_fixo\" " + (type === "valor_fixo" ? "selected" : "") + ">Valor fixo</option><option value=\"faixas\" " + (type === "faixas" ? "selected" : "") + ">Faixas</option></select></label><label class=\"field\"><span>Reter</span><select data-tax-field=\"reter\"><option value=\"true\" " + (booleanValue(row.reter, false) ? "selected" : "") + ">Sim</option><option value=\"false\" " + (!booleanValue(row.reter, false) ? "selected" : "") + ">Não</option></select></label><label class=\"field\"><span>Alíquota (%)</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-tax-field=\"aliquota\" value=\"" + escapeHtml(row.aliquota || 0) + "\"></label><label class=\"field\"><span>Base mínima (R$)</span><input type=\"number\" min=\"0\" step=\"0.01\" data-tax-field=\"base_minima_reais\" value=\"" + escapeHtml(numberValue(row.base_minima_centavos) / 100) + "\"></label><label class=\"field\"><span>Teto (R$)</span><input type=\"number\" min=\"0\" step=\"0.01\" data-tax-field=\"teto_reais\" value=\"" + escapeHtml(row.teto_centavos == null ? "" : numberValue(row.teto_centavos) / 100) + "\"></label><label class=\"field\"><span>Município</span><input data-tax-field=\"municipio\" value=\"" + escapeHtml(row.municipio || "") + "\"></label><label class=\"field\"><span>Estado</span><input data-tax-field=\"estado\" maxlength=\"2\" value=\"" + escapeHtml(row.estado || "") + "\"></label><label class=\"field wide\"><span>Parâmetros por faixa (JSON)</span><textarea rows=\"5\" data-json-field=\"parametros\">" + escapeHtml(parameters) + "</textarea><small>Use JSON válido para faixas, limites e regras adicionais.</small></label><button class=\"btn btn-ghost\" type=\"button\" data-remove-row>Remover</button></div>";
  }

  function renderAdminRegulationMetadata(regulation) {
    regulation = regulation || {};
    var container = qs("adminRegulationMetadata");
    if (!container) return;
    var version = regulation.versao || regulation.documento_versao || "";
    if (!version && !(regulation.cod_mmn_documento || regulation.id)) {
      container.innerHTML = emptyHtml("Nenhum regulamento foi gerado para esta versão.");
      return;
    }
    var publicUrl = "../../regulamento-mmn.html" + (version ? "?versao=" + encodeURIComponent(version) : "");
    container.innerHTML = "<div><span>Versão</span><strong>" + escapeHtml(version || "—") + "</strong></div><div><span>Status</span><strong>" + escapeHtml(regulation.status || "rascunho") + "</strong></div><div><span>Atualização</span><strong>" + escapeHtml(formatDate(regulation.atualizado_em || regulation.criado_em, true)) + "</strong></div><div><span>Publicação</span><strong>" + escapeHtml(formatDate(regulation.publicado_em, true)) + "</strong></div><div><span>Vigência</span><strong>" + escapeHtml(formatDate(regulation.vigencia_inicio || regulation.vigente_desde, false)) + "</strong></div><a class=\"btn btn-ghost btn-small\" href=\"" + escapeHtml(publicUrl) + "\" target=\"_blank\" rel=\"noopener\">Abrir versão/histórico</a>";
  }

  function renderAdminRegulationPreview(data) {
    var container = qs("adminRegulationPreview");
    if (!container) return;
    var source = data || {};
    var documentRow = objectFrom(source, ["documento", "regulamento"]);
    var snapshot = objectFrom(source, ["snapshot", "conteudo_snapshot", "configuracao", "regras"]);
    if (!Object.keys(snapshot).length) snapshot = objectFrom(documentRow, ["snapshot", "conteudo_snapshot"]);
    if (!Object.keys(documentRow).length) documentRow = objectFrom(snapshot, ["documento"]);
    var htmlDocument = firstDefined([source.conteudo_html, source.html, documentRow.conteudo_html], "");
    if (htmlDocument) {
      container.innerHTML = "";
      var iframe = document.createElement("iframe");
      iframe.className = "mmn-regulation-frame";
      iframe.setAttribute("sandbox", "");
      iframe.setAttribute("title", "Pré-visualização do regulamento");
      iframe.srcdoc = String(htmlDocument);
      container.appendChild(iframe);
      return;
    }
    var parameters = Object.assign({},
      objectFrom(snapshot, ["estrutura"]),
      objectFrom(snapshot, ["financeiro"]),
      objectFrom(snapshot, ["pagamentos"]),
      objectFrom(snapshot, ["operacional"]),
      objectFrom(snapshot, ["parametros"]),
      snapshot
    );
    var levels = listFrom(snapshot, ["niveis", "percentuais_nivel"]);
    var ranks = listFrom(snapshot, ["ranks"]);
    var depth = Math.max(1, Math.min(10, integerValue(firstDefined([parameters.quantidade_niveis], 6), 6)));
    levels = levels.filter(function (row) { return integerValue(row.nivel) <= depth; });
    var title = documentRow.titulo || source.titulo || "Regulamento de Indicações e Benefícios";
    container.innerHTML = "<article><h4>" + escapeHtml(title) + "</h4><p>Versão " + escapeHtml(documentRow.versao || source.versao || "—") + " · modelo jurídico Regulamento MMN v1.</p><div class=\"mmn-regulation-preview-grid\"><span><strong>" + escapeHtml(depth) + "</strong> níveis</span><span><strong>" + escapeHtml(integerValue(parameters.largura_maxima_posicionamento, 0) === 0 ? "Ilimitada" : formatInteger(parameters.largura_maxima_posicionamento)) + "</strong> largura</span><span><strong>" + escapeHtml(formatPercent(parameters.payout_teto_percentual)) + "</strong> teto</span><span><strong>" + escapeHtml(formatMoneyCents(parameters.pagamento_minimo_centavos)) + "</strong> mínimo</span></div>" + (levels.length ? "<div class=\"table-wrap\"><table><thead><tr><th>Nível</th><th>Percentual</th><th>Diretos</th><th>Pernas</th><th>Ativos/perna</th></tr></thead><tbody>" + levels.map(function (row) { return "<tr><td>" + escapeHtml(row.nivel) + "</td><td>" + escapeHtml(formatPercent(row.percentual)) + "</td><td>" + escapeHtml(formatInteger(row.min_diretos_ativos)) + "</td><td>" + escapeHtml(formatInteger(row.min_pernas_qualificadas)) + "</td><td>" + escapeHtml(formatInteger(row.min_ativos_por_perna)) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "") + (ranks.length ? "<p><strong>Ranks:</strong> " + ranks.map(function (rank) { return escapeHtml(rank.nome || rank.chave); }).join(" · ") + "</p>" : "") + "</article>";
  }

  function fillConfigForm(config) {
    config = normalizeConfigResponse(config || {});
    state.admin.selectedConfig = config;
    var company = objectFrom(config, ["dados_empresa"]);
    var values = {
      adminConfigVersionId: config.cod_mmn_config || config.cod_mmn_configuracao || config.id || "",
      adminConfigName: config.nome || "",
      adminConfigEffective: String(config.vigencia_inicio || config.vigencia || "").slice(0, 10),
      adminConfigPayoutCap: firstDefined([config.payout_teto_percentual, config.teto_payout_percentual], 33),
      adminConfigHoldDays: firstDefined([config.carencia_estorno_dias, config.prazo_seguranca_dias], 15),
      adminConfigMinimumPayment: numberValue(firstDefined([config.pagamento_minimo_centavos], 5000)) / 100,
      adminConfigWaitlistDays: firstDefined([config.prazo_conversao_espera_dias, config.lista_espera_prazo_dias], 90),
      adminConfigLevelCount: firstDefined([config.quantidade_niveis], 6),
      adminConfigPlacementWidth: firstDefined([config.largura_maxima_posicionamento], 0),
      adminConfigPaymentsEnabled: String(!booleanValue(firstDefined([config.pagamento_real_bloqueado], !booleanValue(config.pagamentos_reais_liberados, false)), true)),
      adminConfigPaymentMode: config.pagamento_modo || "manual",
      adminConfigApprovalsPublication: firstDefined([config.aprovacoes_publicacao], 1),
      adminConfigApprovalsClosing: firstDefined([config.aprovacoes_fechamento], 1),
      adminConfigApprovalsPayment: firstDefined([config.aprovacoes_pagamento, config.aprovacoes_necessarias], 1),
      adminConfigApprovalsReopen: firstDefined([config.aprovacoes_reabertura], 1),
      adminConfigPoolPercent: firstDefined([config.pool_global_percentual], 2),
      adminConfigClosingDay: firstDefined([config.fechamento_dia], 10),
      adminConfigPaymentDay: firstDefined([config.pagamento_dia], 20),
      adminConfigDisputeDays: firstDefined([config.contestacao_dias_uteis], 5),
      adminConfigPixHoldDays: firstDefined([config.alteracao_pix_carencia_dias], 3),
      adminConfigPremiumRequired: String(booleanValue(firstDefined([config.premium_obrigatorio], true), true)),
      adminConfigUserSimulatorMaxMonths: firstDefined([config.simulador_usuario_max_meses], 24),
      adminConfigAdminSimulatorMaxMonths: firstDefined([config.simulador_admin_max_meses], 60),
      adminProgramName: config.programa_nome || "Programa de Indicações e Benefícios Turbo Tiger",
      adminProgramBeta: String(booleanValue(firstDefined([config.programa_beta], true), true)),
      adminProgramTerritory: config.territorio || "BR",
      adminProgramCurrency: config.moeda || "BRL",
      adminProgramTimezone: config.fuso_horario || "America/Sao_Paulo",
      adminCompanyLegalName: company.razao_social || "",
      adminCompanyCnpj: company.cnpj || "",
      adminCompanyAddress: company.endereco || "",
      adminCompanyRepresentative: company.representante || "",
      adminCompanyPhone: company.telefone || "",
      adminCompanyWhatsapp: company.whatsapp || "",
      adminCompanyFinanceEmail: company.email_financeiro || "",
      adminCompanyPrivacyEmail: company.email_privacidade || "",
      adminConfigReason: ""
    };
    Object.keys(values).forEach(function (id) { if (qs(id)) qs(id).value = values[id]; });
    qs("adminConfigProvider").value = config.pagamento_provedor || config.provedor_pagamento_chave || "";
    var regulation = objectFrom(config, ["documento_regulamento"]);
    var regulationValues = {
      adminRegulationId: regulation.cod_mmn_documento || regulation.id || "",
      adminRegulationVersion: regulation.versao || "",
      adminRegulationTitle: regulation.titulo || "",
      adminRegulationSummary: regulation.conteudo_resumo || "",
      adminRegulationReason: ""
    };
    Object.keys(regulationValues).forEach(function (id) { if (qs(id)) qs(id).value = regulationValues[id]; });
    renderAdminRegulationMetadata(regulation);
    qs("adminRegulationPreview").innerHTML = emptyHtml(regulation.cod_mmn_documento || regulation.id ? "Use Pré-visualizar para conferir o snapshot desta versão." : "Gere o regulamento depois de salvar as regras.");
    renderConfigRows(config);
    qsa(".mmn-version-button").forEach(function (button) { button.classList.toggle("is-active", String(button.dataset.configId) === String(values.adminConfigVersionId)); });
    loadPublicationProgress(integerValue(values.adminConfigVersionId));
  }

  function renderAdminConfig(data) {
    state.admin.config = data;
    var versions = configVersions(data);
    qs("adminConfigVersions").innerHTML = versions.length ? versions.map(function (version) {
      return "<button class=\"mmn-version-button " + (version.status === "vigente" ? "is-active" : "") + "\" type=\"button\" data-config-id=\"" + escapeHtml(version.cod_mmn_config || version.cod_mmn_configuracao || version.id) + "\"><strong>" + escapeHtml(version.nome || ("Versão " + (version.versao || ""))) + "</strong><small>" + escapeHtml(formatDate(version.vigencia_inicio || version.vigencia, false)) + " · " + escapeHtml(version.status || "rascunho") + "</small></button>";
    }).join("") : emptyHtml("Nenhuma versão de configuração.");
    var selected = normalizeConfigResponse(data);
    if (!selected.cod_mmn_config) selected = normalizeConfigResponse(versions.find(function (version) { return version.status === "vigente"; }) || versions[0] || {});
    fillConfigForm(selected);
    var groups = listFrom(selected || {}, ["grupos_isentos", "grupos"]);
    qs("adminParticipantGroup").innerHTML = "<option value=\"\">Nenhum</option>" + groups.map(function (group) { return "<option value=\"" + escapeHtml(group.grupo_chave || group.chave || group.id) + "\">" + escapeHtml(group.grupo_chave || group.nome || group.chave) + "</option>"; }).join("");
    var versionOptions = versions.map(function (version) { return "<option value=\"" + escapeHtml(version.cod_mmn_config || version.cod_mmn_configuracao || version.id) + "\">" + escapeHtml(version.nome || version.versao) + "</option>"; }).join("");
    qs("adminSimVersion").innerHTML = versionOptions;
    qs("adminReplayVersion").innerHTML = versionOptions;
    qs("adminSimulationHistoryVersion").innerHTML = "<option value=\"\">Todas</option>" + versionOptions;
  }

  function renderPublicationProgress(data) {
    var container = qs("adminPublicationProgress");
    if (!container) return;
    if (!data || !data.config_id) {
      container.innerHTML = emptyHtml("Salve o rascunho para consultar o progresso.");
      if (qs("adminConfigActivate")) qs("adminConfigActivate").disabled = true;
      return;
    }
    var documentReady = !!data.documento_regulamento_id;
    var simulationReady = !!data.simulacao_id && data.simulacao_hash === data.config_hash;
    var approvalsReady = numberValue(data.aprovacoes_recebidas) >= numberValue(data.aprovacoes_necessarias, 1);
    var steps = [
      { label: "Rascunho salvo", detail: "Configuração #" + data.config_id, ready: true },
      { label: "Regulamento gerado", detail: documentReady ? (objectFrom(data, ["documento_regulamento"]).titulo || "Snapshot #" + data.documento_regulamento_id) : "Gere o snapshot no servidor", ready: documentReady },
      { label: "Simulação V2 válida", detail: simulationReady ? "Simulação #" + data.simulacao_id + " no hash atual" : "Execute novamente após qualquer alteração", ready: simulationReady },
      { label: "Quórum de publicação", detail: formatInteger(data.aprovacoes_recebidas) + " de " + formatInteger(data.aprovacoes_necessarias), ready: approvalsReady }
    ];
    container.innerHTML = steps.map(function (step, index) {
      return "<article class=\"mmn-governance-step " + (step.ready ? "is-complete" : "") + "\"><span>" + (step.ready ? "✓" : index + 1) + "</span><div><strong>" + escapeHtml(step.label) + "</strong><small>" + escapeHtml(step.detail) + "</small></div></article>";
    }).join("") + (listFrom(data, ["aprovacoes"]).length ? "<div class=\"mmn-governance-approvals\"><strong>Aprovações registradas</strong>" + listFrom(data, ["aprovacoes"]).map(function (row) { return "<span>" + escapeHtml(formatDate(row.criado_em, true)) + " · " + escapeHtml(row.uid_admin || "Administrador") + "</span>"; }).join("") + "</div>" : "");
    if (qs("adminConfigActivate")) qs("adminConfigActivate").disabled = data.status !== "rascunho" || !documentReady || !simulationReady || !booleanValue(data.pode_aprovar, false);
  }

  async function loadPublicationProgress(configId) {
    if (!configId || !(hasCapability("configurar") || hasCapability("auditar"))) {
      renderPublicationProgress(null);
      return null;
    }
    try {
      var data = await rpc(CONFIG.rpcs.adminConfigProgress, { p_config_id: configId });
      if (String(qs("adminConfigVersionId").value) !== String(configId)) return data;
      state.admin.publicationProgress = data;
      renderPublicationProgress(data);
      return data;
    } catch (error) {
      qs("adminPublicationProgress").innerHTML = emptyHtml(friendlyMessage(error.message || error));
      return null;
    }
  }

  function renderAdminPayments(data, append) {
    var rows = listFrom(data, ["lotes", "pagamentos", "itens"]);
    var requestedStatus = qs("adminPaymentStatus") ? qs("adminPaymentStatus").value : "";
    if (requestedStatus) rows = rows.filter(function (row) { return row.status === requestedStatus; });
    var html = rows.map(function (row) {
      var id = row.cod_mmn_lote || row.cod_mmn_pagamento || row.id;
      var action = hasCapability("pagar") && (row.status === "calculado" || row.status === "revisao") ? "aprovar" : (hasCapability("pagar") && row.status === "aprovado" && row.modo === "manual" ? "pago" : "");
      var actionHtml = action ? "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-payment-action=\"" + action + "\" data-payment-id=\"" + escapeHtml(id) + "\">" + escapeHtml(action === "pago" ? "Registrar pago" : "Aprovar") + "</button>" : "—";
      return "<tr><td><strong>Lote #" + escapeHtml(id) + "</strong><br><small>" + escapeHtml(row.competencia || "") + " · " + escapeHtml(row.modo || "manual") + "</small></td><td>" + escapeHtml(formatMoneyCents(centsFrom(row, ["total_bruto_centavos", "bruto_centavos", "valor_bruto_centavos"]))) + "</td><td>" + escapeHtml(formatMoneyCents(centsFrom(row, ["total_retencoes_centavos", "retencoes_centavos", "valor_retencoes_centavos"]))) + "</td><td><strong>" + escapeHtml(formatMoneyCents(centsFrom(row, ["total_liquido_centavos", "liquido_centavos", "valor_liquido_centavos", "total_centavos"]))) + "</strong></td><td>" + escapeHtml(formatInteger(row.aprovacoes_recebidas)) + "/" + escapeHtml(formatInteger(row.aprovacoes_necessarias)) + "</td><td>" + pillHtml(row.rpa_status || (row.simulacao ? "simulacao" : "pendente")) + "</td><td>" + pillHtml(row.status) + "</td><td>" + actionHtml + "</td></tr>";
    }).join("");
    if (append) qs("adminPaymentsBody").insertAdjacentHTML("beforeend", html);
    else qs("adminPaymentsBody").innerHTML = html || emptyTableHtml(8, "Nenhum pagamento encontrado.");
    state.admin.cursors.payments = data.next_cursor || data.proximo_cursor || null;
    qs("adminPaymentsMore").hidden = !state.admin.cursors.payments;
  }

  function renderAdminRpas(data, append) {
    var rows = listFrom(data, ["itens"]);
    var summary = objectFrom(data, ["resumo"]);
    qs("adminRpaSummary").innerHTML = [
      ["Beneficiários", summary.beneficiarios],
      ["Aguardando RPA", summary.aguardando_rpa],
      ["Rascunhos", summary.rpas_rascunho],
      ["Emitidos", summary.rpas_emitidos],
      ["Pagos", summary.rpas_pagos]
    ].map(function (item) { return "<article class=\"mmn-payment-card\"><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(formatInteger(item[1])) + "</strong></article>"; }).join("");
    var html = rows.map(function (row) {
      var documentStatus = row.rpa_status || (row.rpa_id ? "rascunho" : "pendente");
      var transferStatus = row.pagamento_saida_status || (row.beneficiario_status === "pago" ? "confirmado" : "aguardando_rpa");
      return "<tr><td><strong>" + escapeHtml(firstDefined([row.loginuser, row.usuario_loginuser, row.login, row.nome], "Usuário")) + "</strong><br><small>" + escapeHtml(row.cpf_mascarado || "") + " · PIX " + escapeHtml(row.pix_mascarado || "—") + "</small></td><td>" + escapeHtml(String(row.competencia || "").slice(0, 7)) + "<br><small>Lote #" + escapeHtml(row.id_lote) + " · " + escapeHtml(row.modo || "") + "</small></td><td><strong>" + escapeHtml(formatMoneyCents(row.valor_liquido_centavos)) + "</strong><br><small>Bruto " + escapeHtml(formatMoneyCents(row.valor_bruto_centavos)) + " · retenções " + escapeHtml(formatMoneyCents(row.retencoes_centavos)) + "</small></td><td>" + pillHtml(documentStatus) + "<br><small>" + escapeHtml(row.rpa_numero || "Sem número") + "</small></td><td>" + pillHtml(transferStatus) + "<br><small>" + escapeHtml(row.provedor_chave || "manual") + "</small></td><td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-rpa-detail=\"" + escapeHtml(row.cod_mmn_lote_beneficiario) + "\">Detalhes</button></td></tr>";
    }).join("");
    if (append) qs("adminRpaBody").insertAdjacentHTML("beforeend", html);
    else qs("adminRpaBody").innerHTML = html || emptyTableHtml(6, "Nenhum beneficiário encontrado na fila fiscal.");
    state.admin.cursors.rpas = data.next_cursor || null;
    qs("adminRpaMore").hidden = data.has_more === false || !state.admin.cursors.rpas;
  }

  function renderAdminRpaDetail(data) {
    var beneficiary = objectFrom(data, ["beneficiario"]);
    var rpa = objectFrom(data, ["rpa"]);
    var output = objectFrom(data, ["pagamento_saida"]);
    state.admin.selectedRpa = data;
    qs("adminRpaBeneficiaryId").value = beneficiary.id || "";
    setText("adminRpaEditorTitle", (beneficiary.nome || "Beneficiário") + " · " + String(beneficiary.competencia || "").slice(0, 7));
    qs("adminRpaNumber").value = rpa.numero || "";
    qs("adminRpaDocumentRef").value = rpa.documento_ref || "";
    qs("adminRpaDocumentHash").value = rpa.documento_hash || "";
    qs("adminRpaReason").value = "";
    qs("adminRpaDetail").innerHTML = [
      ["Titular", (beneficiary.nome || "—") + " · " + (beneficiary.cpf_mascarado || "")],
      ["PIX", (beneficiary.pix_tipo || "") + " · " + (beneficiary.pix_mascarado || "—")],
      ["Valores", "Bruto " + formatMoneyCents(beneficiary.bruto_centavos) + " · retenções " + formatMoneyCents(beneficiary.retencoes_centavos) + " · líquido " + formatMoneyCents(beneficiary.liquido_centavos)],
      ["RPA", (rpa.numero || "Ainda não registrado") + " · " + (rpa.status || "pendente")],
      ["Transferência", output.status || beneficiary.status || "pendente"],
      ["Comprovante", beneficiary.comprovante_ref || "Ainda não confirmado"]
    ].map(function (item) { return "<div><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></div>"; }).join("");
    var canOperate = hasCapability("financeiro") || hasCapability("pagar");
    qs("adminRpaRegister").hidden = !canOperate || ["pago", "cancelado", "emitido"].indexOf(rpa.status) >= 0;
    qs("adminRpaEmit").hidden = !canOperate || !rpa.cod_mmn_rpa || ["pago", "cancelado"].indexOf(rpa.status) >= 0;
    qs("adminRpaEditor").hidden = false;
    qs("adminRpaEditor").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderAdminSupport(data, append) {
    var rows = listFrom(data, ["ocorrencias", "tickets", "itens"]);
    var html = rows.map(function (row) {
      return "<article class=\"mmn-ticket\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.assunto || row.tipo || "Ocorrência") + "</strong><small>#" + escapeHtml(row.cod_mmn_ocorrencia || row.id || "") + " · " + escapeHtml(row.usuario_nome || row.usuario_codinome || row.usuario || "") + "</small></div><span>" + escapeHtml(row.prioridade || "normal") + "</span>" + pillHtml(row.status) + "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-support-action=\"em_analise\" data-support-id=\"" + escapeHtml(row.cod_mmn_ocorrencia || row.id) + "\">Analisar</button></article>";
    }).join("");
    if (append) qs("adminSupportList").insertAdjacentHTML("beforeend", html);
    else qs("adminSupportList").innerHTML = html || emptyHtml("Nenhuma ocorrência encontrada.");
    state.admin.cursors.support = data.next_cursor || data.proximo_cursor || null;
    qs("adminSupportMore").hidden = data.has_more === false || !state.admin.cursors.support;
  }

  function renderAdminAudit(data, append) {
    var rows = listFrom(data, ["auditoria", "eventos", "itens"]);
    var html = rows.map(function (row) {
      return "<article class=\"mmn-audit-row\"><span>" + escapeHtml(formatDate(row.criado_em, true)) + "</span><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.acao || "Alteração") + "</strong><small>" + escapeHtml(row.alvo_tipo || "") + " " + escapeHtml(row.alvo_id || "") + "</small></div><span>" + escapeHtml(row.motivo || row.resumo || row.justificativa || "—") + "</span><span>" + escapeHtml(row.uid_ator || row.id_usuario_ator || row.admin_nome || row.autor || "Sistema") + "</span></article>";
    }).join("");
    if (append) qs("adminAuditList").insertAdjacentHTML("beforeend", html);
    else qs("adminAuditList").innerHTML = html || emptyHtml("Nenhum evento de auditoria encontrado.");
    state.admin.cursors.audit = data.next_cursor || data.proximo_cursor || null;
    qs("adminAuditMore").hidden = data.has_more === false || !state.admin.cursors.audit;
  }

  async function loadAdminTab(tab, append) {
    try {
      setGlobalError(null);
      var dashboard = state.admin.dashboard || {};
      if (tab === "competencias") {
        var periods = listFrom(dashboard, ["competencias", "periodos"]);
        if (!periods.length && dashboard.periodo && typeof dashboard.periodo === "object") periods = [dashboard.periodo];
        renderAdminPeriods({ competencias: periods }, false);
      } else if (tab === "participantes") {
        var query = qs("adminParticipantQuery").value.trim().toLowerCase();
        var eligibility = qs("adminParticipantEligibility").value;
        var participantsResponse = await rpc(CONFIG.rpcs.adminParticipantsList, {
          p_cursor: append ? state.admin.cursors.participants : null,
          p_limite: CONFIG.pageSize,
          p_busca: query || null,
          p_status: eligibility || null
        });
        renderAdminParticipants(participantsResponse, append);
      } else if (tab === "espera") {
        var waitQuery = qs("adminWaitlistQuery").value.trim();
        var waitStatus = qs("adminWaitlistStatus").value;
        var waitResponse = await rpc(CONFIG.rpcs.adminWaitlistList, {
          p_cursor: append ? state.admin.cursors.waitlist : null,
          p_limite: CONFIG.pageSize,
          p_busca: waitQuery || null,
          p_status: waitStatus || null
        });
        renderAdminWaitlist(waitResponse, append);
      } else if (tab === "receitas") {
        var revenuePeriod = qs("adminRevenuePeriod").value;
        var revenueType = qs("adminRevenueType").value;
        var revenueStatus = qs("adminRevenueStatus").value;
        var revenueResponse = await rpc(CONFIG.rpcs.adminRevenueList, {
          p_cursor: append ? state.admin.cursors.revenue : null,
          p_limite: CONFIG.pageSize,
          p_competencia: monthDate(revenuePeriod),
          p_status: revenueStatus || null
        });
        revenueResponse.itens = listFrom(revenueResponse, ["itens"]).filter(function (row) {
          return !revenueType || (revenueType === "comissao" ? row.gera_comissao === true : row.gera_comissao === false);
        });
        renderAdminRevenue(revenueResponse, append);
      } else if (tab === "configuracoes") {
        var currentConfig = objectFrom(dashboard, ["config", "configuracao"]);
        var configData = objectFrom(currentConfig, ["dados"]);
        var configId = currentConfig.id || configData.cod_mmn_config || currentConfig.cod_mmn_config || currentConfig.cod_mmn_configuracao || null;
        var configDetail = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: configId });
        if (!Array.isArray(configDetail.versoes)) configDetail.versoes = listFrom(dashboard, ["versoes"]);
        renderAdminConfig(configDetail);
      } else if (tab === "pagamentos") {
        var paymentPeriod = qs("adminPaymentPeriod").value;
        var paymentStatus = qs("adminPaymentStatus").value;
        var batches = listFrom(dashboard, ["lotes", "pagamentos"]).filter(function (row) {
          return (!paymentPeriod || String(row.competencia || row.periodo || "").slice(0, 7) === paymentPeriod) && (!paymentStatus || row.status === paymentStatus);
        });
        renderAdminPayments({ lotes: batches }, false);
        var rpaResponse = await rpc(CONFIG.rpcs.adminRpasList, {
          p_cursor: append ? state.admin.cursors.rpas : null,
          p_limite: CONFIG.pageSize,
          p_competencia: monthDate(paymentPeriod),
          p_status: qs("adminRpaStatus").value || null
        });
        renderAdminRpas(rpaResponse, append);
      } else if (tab === "suporte") {
        var supportQuery = qs("adminSupportQuery").value.trim();
        var supportStatus = qs("adminSupportStatus").value;
        var supportResponse = await rpc(CONFIG.rpcs.adminOccurrencesList, {
          p_cursor: append ? state.admin.cursors.support : null,
          p_limite: CONFIG.pageSize,
          p_busca: supportQuery || null,
          p_status: supportStatus || null
        });
        renderAdminSupport(supportResponse, append);
      } else if (tab === "auditoria") {
        var auditQuery = qs("adminAuditQuery").value.trim().toLowerCase();
        var from = qs("adminAuditFrom").value;
        var to = qs("adminAuditTo").value;
        var auditResponse = await rpc(CONFIG.rpcs.adminAuditList, {
          p_cursor: append ? state.admin.cursors.audit : null,
          p_limite: CONFIG.pageSize,
          p_acao: auditQuery || null
        });
        auditResponse.itens = listFrom(auditResponse, ["itens"]).filter(function (row) {
          var date = String(row.criado_em || "").slice(0, 10);
          var searchable = [row.acao, row.alvo_tipo, row.alvo_id, row.motivo, row.uid_ator, row.id_usuario_ator].join(" ").toLowerCase();
          return (!from || date >= from) && (!to || date <= to) && (!auditQuery || searchable.indexOf(auditQuery) >= 0);
        });
        renderAdminAudit(auditResponse, append);
      }
      state.admin.loaded[tab] = true;
    } catch (error) {
      setGlobalError(error);
    }
  }

  function activateAdminTab(tab) {
    qsa("[data-admin-tab]").forEach(function (button) {
      var active = button.getAttribute("data-admin-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa("[data-admin-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-admin-panel") !== tab;
    });
    if (["competencias", "participantes", "espera", "receitas", "configuracoes", "pagamentos", "suporte", "auditoria"].indexOf(tab) >= 0 && !state.admin.loaded[tab]) loadAdminTab(tab, false);
  }

  function collectProfile(prefix) {
    var address = addressContext(prefix);
    var selectedState = address.selectedState || {};
    var selectedCity = address.selectedCity || {};
    var cityName = cleanText(qs(prefix + "City").value);
    var uf = cleanText(firstDefined([selectedState.uf, qs(prefix + "State").value], "")).toUpperCase();
    return {
      pix_tipo: qs(prefix + "PixType").value,
      pix_chave: qs(prefix + "PixKey").value.trim(),
      cep: digitsOnly(qs(prefix + "PostalCode").value).slice(0, 8),
      logradouro: qs(prefix + "Address").value.trim(),
      numero: qs(prefix + "AddressNumber").value.trim(),
      complemento: qs(prefix + "AddressExtra").value.trim(),
      bairro: qs(prefix + "District").value.trim(),
      cidade: cityName,
      cidade_nome: cityName,
      cidade_ibge: cleanText(selectedCity.ibge),
      id_cidade: firstDefined([selectedCity.cod_cidade, selectedCity.id_cidade], null),
      cod_cidade: firstDefined([selectedCity.cod_cidade, selectedCity.id_cidade], null),
      uf: uf,
      id_estado: firstDefined([selectedState.cod_estado, selectedState.id_estado, selectedCity.cod_estado, selectedCity.id_estado], null),
      cod_estado: firstDefined([selectedState.cod_estado, selectedState.id_estado, selectedCity.cod_estado, selectedCity.id_estado], null),
      nit: qs(prefix + "Nit").value.trim(),
      pix_mesmo_cpf: currentPixIsPersisted(prefix)
    };
  }

  function collectRows(selector, fieldAttribute) {
    return qsa(selector).map(function (row) {
      var result = { id: row.dataset.rankId || row.dataset.groupId || row.dataset.taxId || null };
      qsa("[" + fieldAttribute + "]", row).forEach(function (input) {
        var key = input.getAttribute(fieldAttribute);
        var value = input.value;
        if (input.type === "number") value = key === "teto_reais" && value === "" ? "" : numberValue(value);
        if (value === "true" || value === "false") value = value === "true";
        result[key] = value;
      });
      qsa("[data-json-field]", row).forEach(function (input) {
        var key = input.getAttribute("data-json-field");
        var value = input.value.trim();
        try {
          result[key] = value ? JSON.parse(value) : {};
        } catch (error) {
          throw new Error("JSON inválido na retenção " + (result.nome || result.chave || "sem nome") + ".");
        }
      });
      return result;
    });
  }

  function mergeCollectedRows(collected, previousRows, idKeys, keyKeys) {
    return collected.map(function (row) {
      var previous = (previousRows || []).find(function (candidate) {
        var candidateId = firstDefined(idKeys.map(function (key) { return candidate[key]; }), null);
        if (row.id && candidateId != null && String(row.id) === String(candidateId)) return true;
        return keyKeys.some(function (key) {
          return row[key] && candidate[key] && String(row[key]).toLowerCase() === String(candidate[key]).toLowerCase();
        });
      }) || {};
      return Object.assign({}, previous, row);
    });
  }

  function ensureUniqueOrder(rows) {
    var used = {};
    var next = 1;
    return rows.map(function (row) {
      var order = integerValue(row.ordem, 0);
      if (order <= 0 || used[order]) {
        while (used[next]) next += 1;
        order = next;
      }
      used[order] = true;
      next = Math.max(next, order + 1);
      return Object.assign({}, row, { ordem: order });
    });
  }

  function collectConfig() {
    var selected = state.admin.selectedConfig || {};
    var parameters = Object.assign({}, selected.parametros || {});
    parameters.payout_teto_percentual = numberValue(qs("adminConfigPayoutCap").value);
    parameters.carencia_estorno_dias = integerValue(qs("adminConfigHoldDays").value);
    parameters.pagamento_minimo_centavos = Math.round(numberValue(qs("adminConfigMinimumPayment").value) * 100);
    parameters.prazo_conversao_espera_dias = integerValue(qs("adminConfigWaitlistDays").value);
    parameters.quantidade_niveis = integerValue(qs("adminConfigLevelCount").value, 6);
    parameters.largura_maxima_posicionamento = integerValue(qs("adminConfigPlacementWidth").value, 0);
    parameters.pagamento_real_bloqueado = qs("adminConfigPaymentsEnabled").value !== "true";
    parameters.pagamento_modo = qs("adminConfigPaymentMode").value;
    parameters.pagamento_provedor = qs("adminConfigProvider").value.trim();
    parameters.aprovacoes_publicacao = integerValue(qs("adminConfigApprovalsPublication").value);
    parameters.aprovacoes_fechamento = integerValue(qs("adminConfigApprovalsClosing").value);
    parameters.aprovacoes_pagamento = integerValue(qs("adminConfigApprovalsPayment").value);
    parameters.aprovacoes_reabertura = integerValue(qs("adminConfigApprovalsReopen").value);
    delete parameters.rank_min_diretos_ativos;
    delete parameters.diretos_com_10_ativos_minimos;
    parameters.pool_global_percentual = numberValue(qs("adminConfigPoolPercent").value);
    parameters.fechamento_dia = integerValue(qs("adminConfigClosingDay").value);
    parameters.pagamento_dia = integerValue(qs("adminConfigPaymentDay").value);
    parameters.contestacao_dias_uteis = integerValue(qs("adminConfigDisputeDays").value);
    parameters.alteracao_pix_carencia_dias = integerValue(qs("adminConfigPixHoldDays").value);
    parameters.premium_obrigatorio = qs("adminConfigPremiumRequired").value === "true";
    parameters.simulador_usuario_max_meses = integerValue(qs("adminConfigUserSimulatorMaxMonths").value);
    parameters.simulador_admin_max_meses = integerValue(qs("adminConfigAdminSimulatorMaxMonths").value);
    parameters.programa_nome = qs("adminProgramName").value.trim();
    parameters.programa_beta = qs("adminProgramBeta").value === "true";
    parameters.territorio = qs("adminProgramTerritory").value.trim().toUpperCase();
    parameters.moeda = qs("adminProgramCurrency").value.trim().toUpperCase();
    parameters.fuso_horario = qs("adminProgramTimezone").value.trim();
    parameters.dados_empresa = Object.assign({}, objectFrom(selected.parametros || {}, ["dados_empresa"]), {
      razao_social: qs("adminCompanyLegalName").value.trim(),
      cnpj: qs("adminCompanyCnpj").value.trim(),
      endereco: qs("adminCompanyAddress").value.trim(),
      representante: qs("adminCompanyRepresentative").value.trim(),
      telefone: qs("adminCompanyPhone").value.trim(),
      whatsapp: qs("adminCompanyWhatsapp").value.trim(),
      email_financeiro: qs("adminCompanyFinanceEmail").value.trim(),
      email_privacidade: qs("adminCompanyPrivacyEmail").value.trim()
    });
    var previousLevels = listFrom(selected, ["niveis"]);
    var previousRanks = listFrom(selected, ["ranks"]);
    var previousGroups = listFrom(selected, ["grupos_isentos", "grupos"]);
    var previousTaxes = listFrom(selected, ["retencoes", "taxas"]);
    return {
      cod_mmn_config: integerValue(qs("adminConfigVersionId").value) || null,
      nome: qs("adminConfigName").value.trim(),
      vigencia_inicio: qs("adminConfigEffective").value,
      parametros: parameters,
      pagamentos_reais_liberados: !parameters.pagamento_real_bloqueado,
      niveis: ensureUniqueOrder(qsa("[data-level-row]").map(function (row) {
        var level = integerValue(row.dataset.levelNumber);
        var previous = previousLevels.find(function (row) { return integerValue(row.nivel) === level; }) || {};
        var values = { nivel: level };
        qsa("[data-level-field]", row).forEach(function (input) {
          var key = input.dataset.levelField;
          values[key] = input.value === "true" || input.value === "false" ? input.value === "true" : numberValue(input.value);
        });
        return Object.assign({}, previous, values);
      })),
      ranks: ensureUniqueOrder(mergeCollectedRows(collectRows("[data-rank-row]", "data-rank-field"), previousRanks, ["cod_mmn_config_rank", "id"], ["chave"])),
      grupos_isentos: mergeCollectedRows(collectRows("[data-group-row]", "data-group-field"), previousGroups, ["cod_mmn_config_grupo", "id"], ["grupo_chave"]),
      retencoes: ensureUniqueOrder(mergeCollectedRows(collectRows("[data-tax-row]", "data-tax-field"), previousTaxes, ["cod_mmn_config_retencao", "id"], ["chave"]).map(function (row) {
        row.base_minima_centavos = Math.round(numberValue(row.base_minima_reais) * 100);
        row.teto_centavos = row.teto_reais === "" || row.teto_reais == null ? null : Math.round(numberValue(row.teto_reais) * 100);
        delete row.base_minima_reais;
        delete row.teto_reais;
        return row;
      })),
      justificativa: qs("adminConfigReason").value.trim()
    };
  }

  function configSavePayload(config) {
    return {
      p_config_id: config.cod_mmn_config,
      p_nome: config.nome,
      p_vigencia_inicio: config.vigencia_inicio,
      p_parametros: config.parametros,
      p_niveis: config.niveis,
      p_ranks: config.ranks,
      p_grupos_isentos: config.grupos_isentos,
      p_retencoes: config.retencoes,
      p_motivo: config.justificativa
    };
  }

  function confirmAction(title, text, requireReason) {
    var dialog = qs("actionDialog");
    setText("actionDialogTitle", title);
    setText("actionDialogText", text);
    qs("actionDialogReasonField").hidden = !requireReason;
    qs("actionDialogReason").required = !!requireReason;
    qs("actionDialogReason").value = "";
    if (state.dialogResolve) state.dialogResolve(null);
    return new Promise(function (resolve) {
      state.dialogResolve = resolve;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "open");
    });
  }

  function closeActionDialog(value) {
    var dialog = qs("actionDialog");
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    var resolve = state.dialogResolve;
    state.dialogResolve = null;
    if (resolve) resolve(value);
  }

  async function performAdminAction(rpcName, payload, title, message) {
    var reason = await confirmAction(title, message, true);
    if (reason === null) return null;
    payload.p_motivo = reason;
    return rpc(rpcName, payload);
  }

  async function bootUser(sequence) {
    state.session = null;
    await requestAppSession();
    if (sequence !== state.bootSequence) return;
    var data = await rpc(CONFIG.rpcs.userDashboard, {});
    if (sequence !== state.bootSequence) return;
    state.user.dashboard = data;
    state.user.loaded = {};
    state.user.network = { rootId: "", rows: [], directs: [], stack: [], hasMore: false, nodeCache: {} };
    state.user.evolution = { rows: [], loaded: false, loading: false, error: "" };
    state.user.ranks = [];
    state.user.rankQualificationData = null;
    state.user.rankQualified = { rank: null, rows: [], cursor: null, hasMore: false };
    qs("userApp").hidden = false;
    qs("adminApp").hidden = true;
    qs("adminLoginPanel").hidden = true;
    renderUserDashboard(data);
    setText("adminIdentity", objectFrom(data, ["usuario"]).codinome || "Turbo Tiger");
    setStatus("pageStatus", "", null);
  }

  async function bootAdmin(sequence) {
    state.session = readAdminSession();
    if (!state.session || !state.session.access_token) {
      showLoading(false);
      qs("adminLoginPanel").hidden = false;
      qs("adminApp").hidden = true;
      setStatus("pageStatus", "Entre com uma conta autorizada", null);
      return;
    }
    await refreshSessionIfNeeded();
    var context = await rpc(CONFIG.rpcs.adminContext, {});
    if (sequence !== state.bootSequence) return;
    state.context = context;
    state.capabilities = normalizeCapabilities(context);
    if (!state.capabilities.acessar) throw new Error("sem_permissao_mmn");
    var user = objectFrom(context, ["usuario"]);
    setText("adminIdentity", user.nome || user.email || (state.session.user && state.session.user.email) || "Turbo Tiger");
    applyAdminCapabilities();
    var data = await rpc(CONFIG.rpcs.adminDashboard, { p_competencia: monthDate(qs("adminOverviewPeriod").value) });
    if (sequence !== state.bootSequence) return;
    state.admin.dashboard = data;
    state.admin.loaded = {};
    qs("adminLoginPanel").hidden = true;
    qs("adminApp").hidden = false;
    qs("userApp").hidden = true;
    renderAdminOverview(data);
    setStatus("pageStatus", "Online · acesso conforme suas permissões", "ok");
  }

  async function refreshAdminDashboard() {
    var data = await rpc(CONFIG.rpcs.adminDashboard, { p_competencia: monthDate(qs("adminOverviewPeriod").value) });
    state.admin.dashboard = data;
    renderAdminOverview(data);
    return data;
  }

  async function boot() {
    var sequence = ++state.bootSequence;
    setGlobalError(null);
    showLoading(true);
    setStatus("pageStatus", "Carregando...", null);
    try {
      configureMode();
      if (state.mode === "user") await bootUser(sequence);
      else await bootAdmin(sequence);
    } catch (error) {
      if (sequence !== state.bootSequence) return;
      setGlobalError(error);
      setStatus("pageStatus", error.message || String(error), "error");
      if (state.mode === "admin") {
        qs("adminLoginPanel").hidden = false;
        qs("adminApp").hidden = true;
      }
    } finally {
      if (sequence === state.bootSequence) showLoading(false);
    }
  }

  function setupTabs() {
    qsa("[data-user-tab]").forEach(function (button) { button.addEventListener("click", function () { activateUserTab(button.getAttribute("data-user-tab")); }); });
    qsa("[data-admin-tab]").forEach(function (button) { button.addEventListener("click", function () { activateAdminTab(button.getAttribute("data-admin-tab")); }); });
  }

  function setupAuthEvents() {
    on("adminLoginForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("loginButton", true, "Entrando...");
      setStatus("loginStatus", "Validando acesso...", null);
      try {
        saveAdminSession(await adminLogin(qs("loginEmail").value.trim(), qs("loginPassword").value));
        await boot();
      } catch (error) {
        clearAdminSession();
        setStatus("loginStatus", error.message || error, "error");
      } finally {
        setBusy("loginButton", false);
      }
    });
    on("logoutButton", "click", function () {
      clearAdminSession();
      qs("adminApp").hidden = true;
      qs("adminLoginPanel").hidden = false;
      setStatus("pageStatus", "Sessão encerrada", null);
    });
    on("reloadButton", "click", boot);
    on("retryButton", "click", boot);
  }

  function shareInvite() {
    if (state.mode === "user" && hasNativeBridge()) {
      try {
        window.TurboTigerHistoricoBridge.post("TURBO_SHARE_INVITE");
        return;
      } catch (error) {}
    }
    if (state.user.inviteUrl && navigator.share) navigator.share({ title: "Convite Turbo Tiger", url: state.user.inviteUrl }).catch(function () {});
  }

  function showInviteCopyToast() {
    var toast = qs("userCopyInviteToast");
    if (!toast) return;
    if (state.user.copyToastTimer) window.clearTimeout(state.user.copyToastTimer);
    toast.hidden = false;
    toast.classList.add("is-visible");
    state.user.copyToastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      toast.hidden = true;
      state.user.copyToastTimer = null;
    }, 3000);
  }

  function regulationOverlayUrl(rawUrl) {
    var url = new URL(rawUrl || "../../regulamento-mmn.html", window.location.href);
    url.searchParams.set("embedded", "1");
    return url.href;
  }

  function openRegulationOverlay(rawUrl) {
    var overlay = qs("regulationOverlay");
    var frame = qs("regulationOverlayFrame");
    if (!overlay || !frame) return;
    frame.src = regulationOverlayUrl(rawUrl);
    overlay.hidden = false;
    document.body.classList.add("mmn-regulation-open");
  }

  function closeRegulationOverlay() {
    var overlay = qs("regulationOverlay");
    var frame = qs("regulationOverlayFrame");
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove("mmn-regulation-open");
    if (frame) frame.src = "about:blank";
    var link = qs("regulationLink");
    if (link) link.focus();
  }

  function setupRegulationOverlay() {
    on("regulationLink", "click", function (event) {
      event.preventDefault();
      openRegulationOverlay(event.currentTarget.href);
    });
    window.addEventListener("message", function (event) {
      var payload = event.data || {};
      if (payload.type === "TURBO_MMN_REGULATION_CLOSE") closeRegulationOverlay();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && qs("regulationOverlay") && !qs("regulationOverlay").hidden) closeRegulationOverlay();
    });
  }

  function setupUserEvents() {
    on("userShareButton", "click", shareInvite);
    on("userCopyInviteButton", "click", async function () {
      if (!state.user.inviteUrl) {
        setGlobalError(new Error("O link de convite ainda não está disponível."));
        return;
      }
      try {
        await navigator.clipboard.writeText(state.user.inviteUrl);
        showInviteCopyToast();
      } catch (error) {
        setGlobalError(new Error("Não foi possível copiar o link neste dispositivo."));
      }
    });
    var enrollmentForm = qs("enrollmentForm");
    if (enrollmentForm) {
      ["input", "change"].forEach(function (eventName) {
        enrollmentForm.addEventListener(eventName, function () {
          setStatus("enrollmentStatus", "", null);
          updateEnrollmentSubmitState();
        });
      });
    }
    on("enrollmentSubmit", "click", function (event) {
      var issue = enrollmentCompletionIssue();
      if (showEnrollmentCompletionIssue(issue)) event.preventDefault();
    });
    on("enrollmentForm", "submit", async function (event) {
      event.preventDefault();
      if (showEnrollmentCompletionIssue(enrollmentCompletionIssue())) {
        updateEnrollmentSubmitState();
        return;
      }
      if (!(await ensurePixReadyForSubmission("enrollment"))) {
        updatePixActions("enrollment");
        return;
      }
      setBusy("enrollmentSubmit", true, "Salvando adesão...");
      setStatus("enrollmentStatus", "", null);
      try {
        validateAddressForSubmission("enrollment", true);
        var payload = collectProfile("enrollment");
        var regulation = objectFrom(state.user.dashboard, ["regulamento", "termos"]);
        var participation = userParticipation(state.user.dashboard || {});
        var isReentry = participation.status === "saida_voluntaria";
        await rpc(CONFIG.rpcs.userEnrollmentSave, {
          p_documento_id: regulation.documento_id || regulation.cod_documento || regulation.id || null,
          p_pix_tipo: payload.pix_tipo,
          p_pix_chave: payload.pix_chave,
          p_titularidade_confirmada: payload.pix_mesmo_cpf,
          p_dados_rpa: payload,
          p_confirmacao: qs("enrollmentTerms").checked && payload.pix_mesmo_cpf
        });
        if (isReentry) {
          await rpc(CONFIG.rpcs.userProgramReenter, { p_confirmacao: true });
        }
        setStatus("enrollmentStatus", isReentry ? "Reentrada concluída com segurança." : "Adesão concluída com segurança.", "ok");
        await boot();
      } catch (error) {
        showPixFormError("enrollment", "enrollmentStatus", error);
      } finally {
        setBusy("enrollmentSubmit", false);
        updatePixActions("enrollment");
      }
    });
    on("userProfileForm", "submit", async function (event) {
      event.preventDefault();
      var pixChangeRequested = profilePixChangeRequested();
      if (!(await ensurePixReadyForSubmission("profile"))) {
        setStatus("profileStatus", "Verifique, confira e confirme a chave Pix antes de salvar.", "error");
        updatePixActions("profile");
        return;
      }
      setBusy("profileSubmit", true, "Salvando...");
      try {
        validateAddressForSubmission("profile", true);
        var profile = collectProfile("profile");
        var profilePixFlow = pixState("profile");
        var result = await rpc(CONFIG.rpcs.userProfileSave, {
          p_pix_tipo: profile.pix_tipo,
          p_pix_chave: profile.pix_chave,
          p_titularidade_confirmada: profile.pix_mesmo_cpf,
          p_dados_rpa: profile
        });
        var confirmedAfterSave = booleanValue(firstDefined([
          result.pix_confirmado,
          result.pix_validado,
          pixChangeRequested ? true : profilePixFlow.storedConfirmed
        ], false), false);
        if (pixChangeRequested && !confirmedAfterSave) throw new Error("A confirmação da nova chave Pix não foi preservada. Verifique novamente.");
        var savedType = normalizePixType(firstDefined([result.pix_tipo, profile.pix_tipo, profilePixFlow.storedType], "cpf"));
        var savedMasked = cleanText(firstDefined([
          result.pix_mascarado,
          profilePixFlow.persistedMasked,
          profilePixFlow.storedMasked
        ], ""));
        qs("profilePixKey").value = "";
        qs("profilePixType").value = savedType || "cpf";
        setText("profilePixMasked", savedMasked ? "Chave atual: " + savedMasked : "Nenhuma chave cadastrada.");
        initializePixValidation("profile", {
          cadastrado: !!savedMasked,
          pix_tipo: savedType,
          pix_mascarado: savedMasked,
          pix_validado: confirmedAfterSave
        });
        setStatus("profileStatus", "Dados atualizados.", "ok");
      } catch (error) {
        showPixFormError("profile", "profileStatus", error);
      } finally {
        setBusy("profileSubmit", false);
        updatePixActions("profile");
      }
    });
    on("userSimulatorForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("userSimulatorSubmit", true, "Simulando...");
      try {
        var data = await rpc(CONFIG.rpcs.userSimulator, { p_parametros: {
          novos_diretos_mes: integerValue(qs("userSimDirects").value),
          media_indicacoes_por_direto: numberValue(qs("userSimReplication").value),
          meses: integerValue(qs("userSimMonths").value),
          continuidade_percentual: numberValue(qs("userSimContinuity").value),
          cenario: qs("userSimScenario").value
        } });
        renderSimulationResults("userSimulatorResults", data);
      } catch (error) {
        qs("userSimulatorResults").innerHTML = emptyHtml(friendlyMessage(error.message || error));
      } finally {
        setBusy("userSimulatorSubmit", false);
      }
    });
    on("userDashboard", "click", async function (event) {
      var readButton = event.target.closest("[data-user-event-read]");
      if (readButton) {
        try {
          var eventId = integerValue(readButton.dataset.userEventRead);
          var result = await rpc(CONFIG.rpcs.userEventRead, { p_evento_id: eventId });
          var events = listFrom(state.user.dashboard || {}, ["eventos"]);
          events.forEach(function (item) {
            if (String(item.id || item.cod_mmn_evento) === String(eventId)) item.lido_em = result.lido_em || new Date().toISOString();
          });
          renderUserNotifications(state.user.dashboard || {});
        } catch (error) { setGlobalError(error); }
        return;
      }
      var button = event.target.closest("[data-user-dispute-id]");
      if (!button) return;
      var subject = window.prompt("Assunto da contestação:", "Revisão de lançamento");
      if (subject === null) return;
      var description = window.prompt("Descreva o motivo da contestação:", "");
      if (description === null) return;
      if (!subject.trim() || !description.trim()) return setGlobalError(new Error("Informe o assunto e a descrição da contestação."));
      try {
        await rpc(CONFIG.rpcs.userDispute, {
          p_alvo_tipo: button.dataset.userDisputeType,
          p_alvo_id: integerValue(button.dataset.userDisputeId),
          p_assunto: subject.trim(),
          p_descricao: description.trim()
        });
        setStatus("pageStatus", "Contestação registrada para análise.", "ok");
        button.disabled = true;
      } catch (error) { setGlobalError(error); }
    });
    on("userNetworkMore", "click", function () { loadUserTab("rede", true); });
    on("userLedgerMore", "click", function () { loadUserTab("extrato", true); });
    on("userPaymentsMore", "click", function () { loadUserTab("pagamentos", true); });
    on("userLedgerPeriod", "change", function () { state.user.loaded.extrato = false; loadUserTab("extrato", false); });
  }

  function setupUserDetailOverlays() {
    on("userDirectList", "click", function (event) {
      var card = event.target.closest("[data-network-person-id]");
      if (card) openNetworkExplorer(card.dataset.networkPersonId);
    });
    on("networkExplorerContent", "click", async function (event) {
      var card = event.target.closest("[data-network-person-id]");
      if (!card) return;
      state.user.network.stack.push(card.dataset.networkPersonId);
      renderNetworkExplorer();
      await loadNetworkNode(card.dataset.networkPersonId, false);
    });
    on("networkExplorerBack", "click", function () {
      if (state.user.network.stack.length <= 1) return;
      state.user.network.stack.pop();
      renderNetworkExplorer();
    });
    on("networkExplorerClose", "click", closeNetworkExplorer);
    on("networkExplorerMore", "click", async function () {
      var person = selectedNetworkPerson();
      if (person) await loadNetworkNode(networkPersonId(person), true);
    });
    on("userNetworkDiagramOpen", "click", async function () {
      if (!state.user.network.rows.length && !state.user.loaded.rede) await loadUserTab("rede", false);
      await openNetworkDiagram();
    });
    on("networkDiagramClose", "click", closeNetworkDiagram);
    on("networkDiagramPrint", "click", function () {
      document.body.classList.add("mmn-network-printing");
      window.setTimeout(function () { window.print(); }, 0);
    });
    window.addEventListener("afterprint", function () {
      document.body.classList.remove("mmn-network-printing");
    });
    on("userRankLadder", "click", async function (event) {
      var card = event.target.closest("[data-rank-qualified-index]");
      if (card) await openRankQualified(card.dataset.rankQualifiedIndex);
    });
    on("rankQualifiedMore", "click", function () { loadRankQualified(true); });
    on("rankQualifiedClose", "click", closeRankQualified);
    on("userEvolutionChartOpen", "click", openEvolutionChart);
    on("evolutionChartClose", "click", closeEvolutionChart);
    ["networkExplorerOverlay", "networkDiagramOverlay", "rankQualifiedOverlay", "evolutionChartOverlay"].forEach(function (id) {
      on(id, "click", function (event) {
        if (event.target !== event.currentTarget) return;
        if (id === "networkExplorerOverlay") closeNetworkExplorer();
        else if (id === "networkDiagramOverlay") closeNetworkDiagram();
        else if (id === "rankQualifiedOverlay") closeRankQualified();
        else closeEvolutionChart();
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!qs("networkExplorerOverlay").hidden) closeNetworkExplorer();
      else if (!qs("networkDiagramOverlay").hidden) closeNetworkDiagram();
      else if (!qs("rankQualifiedOverlay").hidden) closeRankQualified();
      else if (!qs("evolutionChartOverlay").hidden) closeEvolutionChart();
    });
  }

  function openProgramExitDialog() {
    var dialog = qs("programExitDialog");
    var checkbox = qs("programExitConfirmCheck");
    checkbox.checked = false;
    qs("programExitConfirm").disabled = true;
    setStatus("programExitDialogStatus", "", null);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "open");
    window.setTimeout(function () { checkbox.focus(); }, 0);
  }

  function closeProgramExitDialog() {
    if (state.programExitBusy) return;
    var dialog = qs("programExitDialog");
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    qs("programExitConfirmCheck").checked = false;
    qs("programExitConfirm").disabled = true;
    var trigger = qs("programExitOpen");
    if (trigger && !trigger.hidden) trigger.focus();
  }

  function setupProgramExitDialog() {
    on("programExitOpen", "click", openProgramExitDialog);
    on("programExitConfirmCheck", "change", function () {
      qs("programExitConfirm").disabled = !qs("programExitConfirmCheck").checked || state.programExitBusy;
    });
    on("programExitCancel", "click", closeProgramExitDialog);
    on("programExitClose", "click", closeProgramExitDialog);
    on("programExitDialog", "cancel", function (event) {
      event.preventDefault();
      closeProgramExitDialog();
    });
    on("programExitDialogForm", "submit", async function (event) {
      event.preventDefault();
      if (state.programExitBusy || !qs("programExitConfirmCheck").checked) return;

      state.programExitBusy = true;
      qs("programExitCancel").disabled = true;
      qs("programExitClose").disabled = true;
      setBusy("programExitConfirm", true, "Saindo...");
      setStatus("programExitDialogStatus", "Processando sua solicitação...", null);

      var exitCompleted = false;
      try {
        await rpc(CONFIG.rpcs.userProgramExit, {
          p_confirmacao: true,
          p_motivo: "saida_solicitada_pelo_participante"
        });
        exitCompleted = true;
      } catch (error) {
        setStatus("programExitDialogStatus", error.message || error, "error");
      } finally {
        state.programExitBusy = false;
        qs("programExitCancel").disabled = false;
        qs("programExitClose").disabled = false;
        setBusy("programExitConfirm", false);
        qs("programExitConfirm").disabled = !qs("programExitConfirmCheck").checked;
      }

      if (!exitCompleted) return;

      closeProgramExitDialog();
      setStatus("programExitStatus", "Saída concluída. Atualizando seu painel...", "ok");
      await boot();
      setStatus("pageStatus", "Você saiu do programa de indicações.", "ok");
      if (!qs("userEnrollment").hidden) {
        setStatus("enrollmentStatus", "Sua saída foi concluída. Para participar novamente, faça uma nova adesão ao regulamento vigente.", "ok");
        qs("userEnrollment").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function setupAdminFilters() {
    on("adminOverviewPeriod", "change", async function () {
      try { var data = await rpc(CONFIG.rpcs.adminDashboard, { p_competencia: monthDate(qs("adminOverviewPeriod").value) }); state.admin.dashboard = data; renderAdminOverview(data); } catch (error) { setGlobalError(error); }
    });
    on("adminParticipantFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("participantes", false); });
    on("adminWaitlistFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("espera", false); });
    on("adminRevenueFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("receitas", false); });
    on("adminPaymentFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("pagamentos", false); });
    on("adminSupportFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("suporte", false); });
    on("adminAuditFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("auditoria", false); });
    on("adminNetworkForm", "submit", async function (event) {
      event.preventDefault();
      try { renderAdminNetwork(await rpc(CONFIG.rpcs.adminUserDetail, { p_usuario_id: integerValue(qs("adminNetworkUser").value) })); } catch (error) { setGlobalError(error); }
    });
    on("adminPeriodsMore", "click", function () { loadAdminTab("competencias", true); });
    on("adminParticipantsMore", "click", function () { loadAdminTab("participantes", true); });
    on("adminWaitlistMore", "click", function () { loadAdminTab("espera", true); });
    on("adminRevenueMore", "click", function () { loadAdminTab("receitas", true); });
    on("adminPaymentsMore", "click", function () { loadAdminTab("pagamentos", true); });
    on("adminSupportMore", "click", function () { loadAdminTab("suporte", true); });
    on("adminAuditMore", "click", function () { loadAdminTab("auditoria", true); });
  }

  function setupAdminActions() {
    on("adminPeriodsBody", "click", async function (event) {
      var button = event.target.closest("[data-period-action]");
      if (!button) return;
      try {
        var action = button.dataset.periodAction;
        var rpcName = action === "apurar" ? CONFIG.rpcs.adminPeriodCalculate : (action === "fechar" ? CONFIG.rpcs.adminPeriodClose : CONFIG.rpcs.adminPeriodReopen);
        await performAdminAction(rpcName, { p_competencia: monthDate(String(button.dataset.periodValue).slice(0, 7)) }, "Confirmar ação na competência", "A ação respeitará a versão vinculada e manterá a trilha de auditoria.");
        await refreshAdminDashboard();
        await loadAdminTab("competencias", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminParticipantsBody", "click", async function (event) {
      var button = event.target.closest("[data-participant-edit]");
      if (!button) return;
      var row = (state.admin.participants || []).find(function (item) { return String(item.usuario_id || item.id_usuario || item.cod_usuario) === String(button.dataset.participantEdit); });
      if (!row) return;
      try {
        var detail = await rpc(CONFIG.rpcs.adminUserDetail, { p_usuario_id: integerValue(button.dataset.participantEdit) });
        var detailedUser = objectFrom(detail, ["usuario"]);
        var detailedParticipant = objectFrom(detail, ["participante"]);
        row = Object.assign({}, row, detailedUser, detailedParticipant, {
          usuario_id: detailedUser.id || row.usuario_id,
          grupo: detailedUser.grupo || row.grupo,
          elegibilidade: objectFrom(detail, ["elegibilidade"])
        });
      } catch (error) {
        setGlobalError(error);
        return;
      }
      qs("adminParticipantId").value = row.usuario_id || row.id_usuario || row.cod_usuario || row.id;
      setText("adminParticipantEditorTitle", "Gerenciar " + (row.loginuser || row.usuario_loginuser || row.login || row.codinome || row.nome || "participante"));
      qs("adminParticipantActive").value = String(booleanValue(row.mmn_ativo, false));
      qs("adminParticipantIneligibility").value = row.status === "inelegivel_permanente" || row.inelegibilidade_permanente ? "permanente" : (row.status === "suspenso" ? "temporaria" : "nenhuma");
      qs("adminParticipantTechnical").value = String(booleanValue(row.conta_tecnica, false));
      qs("adminParticipantGroup").value = row.grupo || row.grupo_chave || "";
      qs("adminParticipantGroup").dataset.originalGroup = row.grupo || row.grupo_chave || "";
      qs("adminParticipantSponsor").value = row.id_patrocinador || row.patrocinador_id || "";
      qs("adminParticipantSponsor").dataset.originalSponsor = row.id_patrocinador || row.patrocinador_id || "";
      qs("adminParticipantReason").value = "";
      qs("adminParticipantEditor").hidden = false;
      qs("adminParticipantEditor").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    on("adminParticipantClose", "click", function () { qs("adminParticipantEditor").hidden = true; });
    async function validateParticipantPix(approved) {
      try {
        var userId = integerValue(qs("adminParticipantId").value);
        if (!userId) throw new Error("Selecione um participante.");
        await performAdminAction(CONFIG.rpcs.adminPixValidate, { p_usuario_id: userId, p_aprovado: approved }, approved ? "Validar PIX" : "Rejeitar PIX", approved ? "Confirme que a chave pertence ao mesmo titular cadastrado no app." : "O PIX ficará pendente até uma nova validação administrativa.");
        setStatus("adminParticipantStatus", approved ? "PIX validado." : "PIX rejeitado.", "ok");
      } catch (error) { setStatus("adminParticipantStatus", error.message || error, "error"); }
    }
    on("adminParticipantPixApprove", "click", function () { validateParticipantPix(true); });
    on("adminParticipantPixReject", "click", function () { validateParticipantPix(false); });
    on("adminParticipantEditor", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminParticipantSave", true, "Salvando...");
      try {
        var userId = integerValue(qs("adminParticipantId").value);
        var ineligibility = qs("adminParticipantIneligibility").value;
        var status = ineligibility === "permanente" ? "inelegivel_permanente" :
          (ineligibility === "temporaria" || qs("adminParticipantActive").value !== "true" ? "suspenso" : "ativo");
        var reason = qs("adminParticipantReason").value.trim();
        await rpc(CONFIG.rpcs.adminParticipantStatus, {
          p_usuario_id: userId,
          p_status: status,
          p_conta_tecnica: qs("adminParticipantTechnical").value === "true",
          p_inelegivel_permanente: ineligibility === "permanente",
          p_motivo: reason
        });
        var group = qs("adminParticipantGroup").value || null;
        var originalGroup = qs("adminParticipantGroup").dataset.originalGroup || null;
        if (group !== originalGroup) {
          await rpc(CONFIG.rpcs.adminParticipantGroup, {
            p_usuario_id: userId,
            p_grupo_chave: group,
            p_motivo: reason
          });
        }
        var sponsor = integerValue(qs("adminParticipantSponsor").value) || null;
        var originalSponsor = integerValue(qs("adminParticipantSponsor").dataset.originalSponsor) || null;
        if (sponsor !== originalSponsor) {
          await rpc(CONFIG.rpcs.adminSponsorCorrect, {
            p_usuario_id: userId,
            p_novo_patrocinador_id: sponsor,
            p_motivo: reason
          });
        }
        setStatus("adminParticipantStatus", "Alteração registrada e auditada.", "ok");
        await refreshAdminDashboard();
        await loadAdminTab("participantes", false);
      } catch (error) { setStatus("adminParticipantStatus", error.message || error, "error"); }
      finally { setBusy("adminParticipantSave", false); }
    });
    on("adminWaitlistBody", "click", async function (event) {
      var button = event.target.closest("[data-waitlist-action]");
      if (!button) return;
      try {
        var sponsorId = null;
        if (button.dataset.waitlistAction === "aprovar") {
          var informed = window.prompt("Informe o ID do usuário patrocinador (deixe vazio para raiz):", "");
          if (informed === null) return;
          sponsorId = informed.trim() ? integerValue(informed) : null;
          if (informed.trim() && sponsorId <= 0) throw new Error("Informe um usuário patrocinador válido.");
        }
        await performAdminAction(CONFIG.rpcs.adminWaitlistDecide, {
          p_vinculo_id: integerValue(button.dataset.waitlistId),
          p_decisao: button.dataset.waitlistAction,
          p_patrocinador_usuario_id: sponsorId
        }, "Decidir vínculo da lista de espera", "A genealogia será preservada sem reservar ou alterar o cod_usuario normal.");
        await loadAdminTab("espera", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminPaymentsBody", "click", async function (event) {
      var button = event.target.closest("[data-payment-action]");
      if (!button) return;
      try {
        var paymentAction = button.dataset.paymentAction;
        var paymentPayload = { p_lote_id: integerValue(button.dataset.paymentId) };
        var paymentRpc = CONFIG.rpcs.adminBatchApprove;
        if (paymentAction === "pago") {
          var proof = window.prompt("Informe a referência do comprovante de pagamento:", "");
          if (proof === null) return;
          if (!proof.trim()) throw new Error("Informe a referência do comprovante.");
          paymentPayload.p_comprovante_ref = proof.trim();
          paymentRpc = CONFIG.rpcs.adminBatchMarkPaid;
        }
        await performAdminAction(paymentRpc, paymentPayload, "Confirmar ação financeira", "A ação será validada pelas aprovações, bloqueios fiscais e estado atual do lote.");
        await refreshAdminDashboard();
        await loadAdminTab("pagamentos", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminRpaBody", "click", async function (event) {
      var button = event.target.closest("[data-rpa-detail]");
      if (!button) return;
      setBusy(button, true, "Abrindo...");
      try {
        var beneficiaryId = integerValue(button.dataset.rpaDetail);
        if (!beneficiaryId) throw new Error("Beneficiário do lote inválido.");
        renderAdminRpaDetail(await rpc(CONFIG.rpcs.adminRpaGet, {
          p_lote_beneficiario_id: beneficiaryId
        }));
      } catch (error) { setGlobalError(error); }
      finally { setBusy(button, false); }
    });
    on("adminRpaRegister", "click", async function () {
      if (!(hasCapability("financeiro") || hasCapability("pagar"))) return setGlobalError(new Error("acesso_financeiro_negado"));
      var beneficiaryId = integerValue(qs("adminRpaBeneficiaryId").value);
      var reason = qs("adminRpaReason").value.trim();
      if (!beneficiaryId) return setStatus("adminRpaStatusText", "Selecione um beneficiário.", "error");
      if (!reason) return setStatus("adminRpaStatusText", "Informe o motivo do registro.", "error");
      var confirmation = await confirmAction("Registrar rascunho do RPA", "Os dados fiscais e os valores do beneficiário serão validados pelo servidor.", false);
      if (confirmation === null) return;
      setBusy("adminRpaRegister", true, "Registrando...");
      try {
        await rpc(CONFIG.rpcs.adminRpaRegister, {
          p_lote_beneficiario_id: beneficiaryId,
          p_numero: qs("adminRpaNumber").value.trim() || null,
          p_motivo: reason
        });
        await loadAdminTab("pagamentos", false);
        renderAdminRpaDetail(await rpc(CONFIG.rpcs.adminRpaGet, {
          p_lote_beneficiario_id: beneficiaryId
        }));
        setStatus("adminRpaStatusText", "Rascunho do RPA registrado.", "ok");
      } catch (error) { setStatus("adminRpaStatusText", error.message || error, "error"); }
      finally { setBusy("adminRpaRegister", false); }
    });
    on("adminRpaEmit", "click", async function () {
      if (!(hasCapability("financeiro") || hasCapability("pagar"))) return setGlobalError(new Error("acesso_financeiro_negado"));
      var beneficiaryId = integerValue(qs("adminRpaBeneficiaryId").value);
      var documentRef = qs("adminRpaDocumentRef").value.trim();
      var documentHash = qs("adminRpaDocumentHash").value.trim();
      var reason = qs("adminRpaReason").value.trim();
      if (!beneficiaryId) return setStatus("adminRpaStatusText", "Selecione um beneficiário.", "error");
      if (!documentRef) return setStatus("adminRpaStatusText", "Informe a referência do documento fiscal.", "error");
      if (documentHash && !/^[0-9a-f]{64}$/i.test(documentHash)) return setStatus("adminRpaStatusText", "Informe um hash SHA-256 válido com 64 caracteres hexadecimais.", "error");
      if (!reason) return setStatus("adminRpaStatusText", "Informe o motivo da emissão.", "error");
      var confirmation = await confirmAction("Emitir RPA", "A emissão será auditada e poderá liberar a próxima etapa do pagamento.", false);
      if (confirmation === null) return;
      setBusy("adminRpaEmit", true, "Emitindo...");
      try {
        await rpc(CONFIG.rpcs.adminRpaIssue, {
          p_lote_beneficiario_id: beneficiaryId,
          p_documento_ref: documentRef,
          p_motivo: reason,
          p_documento_hash: documentHash || null
        });
        await loadAdminTab("pagamentos", false);
        renderAdminRpaDetail(await rpc(CONFIG.rpcs.adminRpaGet, {
          p_lote_beneficiario_id: beneficiaryId
        }));
        setStatus("adminRpaStatusText", "RPA emitido com sucesso.", "ok");
      } catch (error) { setStatus("adminRpaStatusText", error.message || error, "error"); }
      finally { setBusy("adminRpaEmit", false); }
    });
    on("adminSupportList", "click", async function (event) {
      var button = event.target.closest("[data-support-action]");
      if (!button) return;
      try {
        var response = await confirmAction("Atualizar ocorrência", "Registre a orientação inicial. Depois, o status poderá ser atualizado conforme a decisão administrativa.", true);
        if (response === null) return;
        await rpc(CONFIG.rpcs.adminOccurrenceUpdate, { p_ocorrencia_id: integerValue(button.dataset.supportId), p_status: button.dataset.supportAction, p_resposta: response });
        await refreshAdminDashboard();
        await loadAdminTab("suporte", false);
      } catch (error) { setGlobalError(error); }
    });
  }

  function setupConfigEvents() {
    function revalidateNetworkStructure() {
      updateConfigNetworkStructure();
      validateConfigNetworkStructure(false);
    }
    on("adminConfigLevelCount", "input", revalidateNetworkStructure);
    on("adminConfigPlacementWidth", "input", revalidateNetworkStructure);
    on("adminLevelConfig", "input", function () { validateConfigNetworkStructure(false); });
    on("adminLevelConfig", "change", function () { validateConfigNetworkStructure(false); });
    on("adminRankConfig", "input", function () { validateConfigNetworkStructure(false); });
    on("adminRankConfig", "change", function () { validateConfigNetworkStructure(false); });
    on("adminConfigVersions", "click", async function (event) {
      var button = event.target.closest("[data-config-id]");
      if (!button || !state.admin.config) return;
      try {
        var result = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: integerValue(button.dataset.configId) });
        fillConfigForm(normalizeConfigResponse(result));
      } catch (error) { setGlobalError(error); }
    });
    on("adminNewConfigVersion", "click", async function () {
      var baseId = integerValue((state.admin.selectedConfig || {}).cod_mmn_config || qs("adminConfigVersionId").value);
      if (!baseId) return setGlobalError(new Error("Selecione uma versão base para duplicar."));
      var name = window.prompt("Nome da nova versão em rascunho:", "Nova versão");
      if (name === null) return;
      if (!name.trim()) return setGlobalError(new Error("Informe o nome da nova versão."));
      setBusy("adminNewConfigVersion", true, "Criando...");
      try {
        var result = await rpc(CONFIG.rpcs.adminConfigDuplicate, { p_config_id: baseId, p_nome: name.trim() });
        state.admin.config = result;
        renderAdminConfig(result);
        setStatus("adminConfigStatus", "Nova versão criada como rascunho auditável.", "ok");
        qs("adminConfigName").focus();
      } catch (error) { setGlobalError(error); }
      finally { setBusy("adminNewConfigVersion", false); }
    });
    on("adminApproverSave", "click", async function () {
      if (!hasCapability("superadmin")) return setGlobalError(new Error("somente_superadmin"));
      var configId = integerValue(qs("adminConfigVersionId").value);
      var uid = qs("adminApproverUid").value.trim();
      var profile = qs("adminApproverProfile").value.trim().toLowerCase();
      var reason = qs("adminApproverReason").value.trim();
      if (!configId) return setStatus("adminApproverStatus", "Selecione uma versão de configuração.", "error");
      if ((!uid && !profile) || (uid && profile)) return setStatus("adminApproverStatus", "Informe somente o UID do administrador ou somente o perfil.", "error");
      if (!reason) return setStatus("adminApproverStatus", "Informe o motivo da alteração.", "error");
      setBusy("adminApproverSave", true, "Salvando...");
      try {
        await rpc(CONFIG.rpcs.adminConfigApproverSave, {
          p_config_id: configId,
          p_uid_admin: uid || null,
          p_perfil_chave: profile || null,
          p_acao: qs("adminApproverAction").value,
          p_ativo: qs("adminApproverActive").value === "true",
          p_motivo: reason
        });
        var versions = configVersions(state.admin.config || {});
        var detail = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: configId });
        if (!Array.isArray(detail.versoes) || !detail.versoes.length) detail.versoes = versions;
        renderAdminConfig(detail);
        qs("adminApproverUid").value = "";
        qs("adminApproverProfile").value = "";
        qs("adminApproverReason").value = "";
        setStatus("adminApproverStatus", "Aprovador salvo e auditado.", "ok");
      } catch (error) { setStatus("adminApproverStatus", error.message || error, "error"); }
      finally { setBusy("adminApproverSave", false); }
    });
    on("adminRegulationSaveLink", "click", async function () {
      if (!hasCapability("superadmin")) return setStatus("adminRegulationStatus", "Somente o superadmin pode gerar o regulamento.", "error");
      var configId = integerValue(qs("adminConfigVersionId").value);
      var version = qs("adminRegulationVersion").value.trim();
      var title = qs("adminRegulationTitle").value.trim();
      var reason = qs("adminRegulationReason").value.trim();
      if (!configId) return setStatus("adminRegulationStatus", "Salve primeiro a versão em rascunho.", "error");
      if (!version || !title || !reason) return setStatus("adminRegulationStatus", "Informe versão, título e motivo da geração.", "error");
      setBusy("adminRegulationSaveLink", true, "Gerando...");
      try {
        var saved = await rpc(CONFIG.rpcs.adminRegulationDraftSave, {
          p_config_id: configId,
          p_versao: version,
          p_titulo: title,
          p_conteudo_modelo: "regulamento_mmn_v1",
          p_conteudo_resumo: qs("adminRegulationSummary").value.trim() || null,
          p_motivo: reason
        });
        var documentRow = objectFrom(saved, ["documento"]);
        if (!Object.keys(documentRow).length) documentRow = Object.assign({}, objectFrom(objectFrom(saved, ["snapshot"]), ["documento"]), { id: saved.documento_id, versao: saved.versao });
        qs("adminRegulationId").value = documentRow.cod_mmn_documento || documentRow.id || saved.documento_id || "";
        renderAdminRegulationMetadata(documentRow);
        setStatus("adminRegulationStatus", "Snapshot do regulamento gerado e vinculado à configuração atual.", "ok");
        var detail = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: configId });
        detail.versoes = configVersions(state.admin.config || {});
        renderAdminConfig(detail);
        var preview = await rpc(CONFIG.rpcs.adminRegulationPreview, { p_config_id: configId });
        renderAdminRegulationPreview(preview);
      } catch (error) { setStatus("adminRegulationStatus", error.message || error, "error"); }
      finally { setBusy("adminRegulationSaveLink", false); }
    });
    on("adminRegulationPreviewButton", "click", async function () {
      var configId = integerValue(qs("adminConfigVersionId").value);
      if (!configId) return setStatus("adminRegulationStatus", "Salve primeiro a versão em rascunho.", "error");
      setBusy("adminRegulationPreviewButton", true, "Carregando...");
      try {
        var preview = await rpc(CONFIG.rpcs.adminRegulationPreview, { p_config_id: configId });
        renderAdminRegulationPreview(preview);
        var previewDocument = objectFrom(preview, ["documento", "regulamento"]);
        if (!Object.keys(previewDocument).length) previewDocument = objectFrom(objectFrom(preview, ["snapshot"]), ["documento"]);
        renderAdminRegulationMetadata(previewDocument);
        setStatus("adminRegulationStatus", "Pré-visualização carregada a partir do snapshot do servidor.", "ok");
      } catch (error) { setStatus("adminRegulationStatus", error.message || error, "error"); }
      finally { setBusy("adminRegulationPreviewButton", false); }
    });
    on("adminPublicationRefresh", "click", function () { loadPublicationProgress(integerValue(qs("adminConfigVersionId").value)); });
    on("adminConfigOpenSimulator", "click", function () {
      var configId = integerValue(qs("adminConfigVersionId").value);
      if (configId && qs("adminSimVersion")) qs("adminSimVersion").value = String(configId);
      activateAdminTab("simulador");
      activateSimulatorTab("sintetico");
      if (qs("adminSimName")) qs("adminSimName").focus();
    });
    on("adminAddRank", "click", function () { qs("adminRankConfig").insertAdjacentHTML("beforeend", rankRowHtml({})); validateConfigNetworkStructure(false); });
    on("adminAddGroup", "click", function () { qs("adminGroupConfig").insertAdjacentHTML("beforeend", groupRowHtml({ ativo: true, isento_premium: true })); });
    on("adminAddTax", "click", function () { qs("adminTaxConfig").insertAdjacentHTML("beforeend", taxRowHtml({ tipo: "percentual", reter: false, parametros: {} })); });
    on("adminConfigForm", "click", function (event) { var button = event.target.closest("[data-remove-row]"); if (button) button.closest("[data-rank-row],[data-group-row],[data-tax-row]").remove(); });
    on("adminConfigForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminConfigSave", true, "Salvando...");
      try {
        var structuralValidation = validateConfigNetworkStructure(true);
        if (!structuralValidation.valid) {
          qs("adminConfigForm").reportValidity();
          throw new Error(structuralValidation.message);
        }
        var config = collectConfig();
        var result = await rpc(CONFIG.rpcs.adminConfigSave, configSavePayload(config));
        setStatus("adminConfigStatus", "Rascunho salvo. Gere novamente o regulamento e valide a simulação para estas regras.", "ok");
        state.admin.loaded.configuracoes = false;
        await loadAdminTab("configuracoes", false);
        return result;
      } catch (error) { setStatus("adminConfigStatus", error.message || error, "error"); }
      finally { setBusy("adminConfigSave", false); }
    });
    on("adminConfigActivate", "click", async function () {
      try {
        if (!qs("adminConfigForm").reportValidity()) return;
        var structuralValidation = validateConfigNetworkStructure(true);
        if (!structuralValidation.valid) {
          qs("adminConfigForm").reportValidity();
          throw new Error(structuralValidation.message);
        }
        var config = collectConfig();
        if (!config.cod_mmn_config) throw new Error("Salve primeiro a versão em rascunho.");
        var progress = await loadPublicationProgress(config.cod_mmn_config);
        if (!progress || !progress.documento_regulamento_id || !progress.simulacao_id || progress.simulacao_hash !== progress.config_hash) throw new Error("Gere o regulamento no servidor e execute uma simulação V2 válida para as regras atuais antes de publicar.");
        var reason = await confirmAction("Aprovar publicação", "Sua aprovação será registrada no quórum desta versão. Ao completar o quórum, ela será agendada para a vigência informada sem recalcular competências fechadas.", true);
        if (reason === null) return;
        var publication = await rpc(CONFIG.rpcs.adminConfigPublish, { p_config_id: config.cod_mmn_config, p_vigencia_inicio: config.vigencia_inicio, p_motivo: reason });
        setStatus("adminConfigStatus", publication.aguardando_aprovacoes ? "Aprovação registrada; aguardando o restante do quórum." : "Versão publicada e agendada.", "ok");
        state.admin.loaded.configuracoes = false;
        await loadAdminTab("configuracoes", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminFiscalApprove", "click", async function () {
      try {
        var config = collectConfig();
        if (!config.cod_mmn_config) throw new Error("Salve a versão antes da homologação fiscal.");
        var homologate = window.confirm("Confirmar que os parâmetros fiscais desta versão foram homologados com a contabilidade?");
        var reason = await confirmAction("Homologação fiscal", homologate ? "A versão será marcada como homologada. Defina se os pagamentos permanecem bloqueados no campo da configuração." : "A homologação será removida e os pagamentos permanecerão bloqueados.", true);
        if (reason === null) return;
        await rpc(CONFIG.rpcs.adminFiscalApprove, {
          p_config_id: integerValue(config.cod_mmn_config),
          p_fiscal_homologado: homologate,
          p_bloquear_pagamento_real: !config.pagamentos_reais_liberados,
          p_motivo: reason
        });
        setStatus("adminConfigStatus", homologate ? "Configuração fiscal homologada." : "Homologação fiscal removida.", "ok");
        state.admin.loaded.configuracoes = false;
        await loadAdminTab("configuracoes", false);
      } catch (error) { setGlobalError(error); }
    });
  }

  function activateSimulatorTab(tab) {
    qsa("[data-simulator-tab]").forEach(function (button) {
      var active = button.getAttribute("data-simulator-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa("[data-simulator-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-simulator-panel") !== tab;
    });
    if (tab === "historico" && !state.admin.loaded.simulationHistory) loadSimulationHistory(false);
  }

  function collectPlanMix() {
    var names = { 1: "mensal", 3: "trimestral", 6: "semestral", 12: "anual" };
    var rows = qsa("[data-plan-months]").map(function (row) {
      var months = integerValue(row.dataset.planMonths);
      var values = {};
      qsa("[data-plan-field]", row).forEach(function (input) { values[input.dataset.planField] = numberValue(input.value); });
      return {
        plano: names[months] || (months + "_meses"),
        meses: months,
        participacao_percentual: values.participacao_percentual,
        valor_total_centavos: Math.round(values.valor_total_reais * 100),
        desconto_percentual: values.desconto_percentual
      };
    });
    var total = rows.reduce(function (sum, row) { return sum + numberValue(row.participacao_percentual); }, 0);
    if (Math.abs(total - 100) > 0.001) throw new Error("As participações do mix de planos devem somar exatamente 100%.");
    return rows;
  }

  function collectAdminSimulationParameters() {
    return Object.assign({}, state.admin.simulationParameters || {}, {
      nome: qs("adminSimName").value.trim() || null,
      modo_base: qs("adminSimBaseMode").value,
      usuarios_ativos_iniciais: integerValue(qs("adminSimUsers").value),
      ativos_iniciais: integerValue(qs("adminSimUsers").value),
      ticket_medio_centavos: Math.round(numberValue(qs("adminSimTicket").value) * 100),
      valor_mensal_centavos: Math.round(numberValue(qs("adminSimTicket").value) * 100),
      meses: integerValue(qs("adminSimMonths").value),
      churn_percentual: numberValue(qs("adminSimChurn").value),
      continuidade_percentual: numberValue(qs("adminSimContinuity").value),
      novos_diretos_mes: numberValue(qs("adminSimDirects").value),
      media_indicacoes_por_direto: numberValue(qs("adminSimReplication").value),
      indicacoes_meses_impares: numberValue(qs("adminSimOdd").value),
      indicacoes_meses_pares: numberValue(qs("adminSimEven").value),
      meta_usuarios: integerValue(qs("adminSimTarget").value),
      teto_usuarios: integerValue(qs("adminSimCeiling").value),
      inicio_amortecimento_usuarios: integerValue(qs("adminSimDampingStart").value),
      expoente_amortecimento: numberValue(qs("adminSimDampingExponent").value),
      concentracao_maior_perna_percentual: numberValue(qs("adminSimConcentration").value),
      idade_media_base_meses: integerValue(qs("adminSimBaseAge").value),
      desconto_percentual: numberValue(qs("adminSimDiscount").value),
      taxa_gateway_percentual: numberValue(qs("adminSimGateway").value),
      impostos_percentual: numberValue(qs("adminSimTaxes").value),
      chargeback_percentual: numberValue(qs("adminSimChargeback").value),
      conversao_percentual: numberValue(qs("adminSimConversion").value),
      maturidade_meses: integerValue(qs("adminSimMaturity").value),
      cenario: qs("adminSimScenario").value,
      mix_planos: collectPlanMix()
    });
  }

  function simulationSummaryText(row) {
    var summary = objectFrom(row, ["resumo"]);
    if (row.tipo === "admin_historica") return "Real " + formatMoneyCents(summary.payout_real_total_centavos) + " · recalculado " + formatMoneyCents(summary.payout_recalculado_total_centavos);
    if (row.tipo === "usuario") return "Líquido estimado " + formatMoneyCents(summary.liquido_total_centavos);
    return "Receita " + formatMoneyCents(summary.receita_reconhecida_total_centavos) + " · payout " + formatMoneyCents(summary.payout_total_estimado_centavos);
  }

  function renderSimulationHistory(data, append) {
    var rows = listFrom(data, ["itens"]);
    state.admin.simulations = append ? state.admin.simulations.concat(rows) : rows;
    var html = rows.map(function (row) {
      var id = row.id_simulacao || row.simulacao_id;
      return "<article class=\"mmn-simulation-history-row\"><label class=\"mmn-check\"><input type=\"checkbox\" data-simulation-select=\"" + escapeHtml(id) + "\"><span></span></label><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.nome || (row.tipo === "admin_historica" ? "Replay histórico" : "Simulação " + (row.cenario || ""))) + "</strong><small>#" + escapeHtml(id) + " · Config. #" + escapeHtml(row.config_id) + " · " + escapeHtml(formatDate(row.criado_em, true)) + "</small><span>" + escapeHtml(simulationSummaryText(row)) + "</span></div>" + pillHtml(row.apta_publicacao ? "ok" : "pendente", row.apta_publicacao ? "Apta" : row.tipo) + "<div class=\"btn-row\"><button class=\"btn btn-ghost btn-small\" type=\"button\" data-simulation-detail=\"" + escapeHtml(id) + "\">Ver detalhes</button><select class=\"mmn-export-select\" data-simulation-export-section=\"" + escapeHtml(id) + "\"><option value=\"mensal\">Mensal</option><option value=\"niveis\">Níveis</option><option value=\"ranks\">Ranks</option><option value=\"resumo\">Resumo</option><option value=\"completo\">Completo</option></select><button class=\"btn btn-ghost btn-small\" type=\"button\" data-simulation-export=\"" + escapeHtml(id) + "\">Exportar JSON</button></div></article>";
    }).join("");
    if (append) qs("adminSimulationHistory").insertAdjacentHTML("beforeend", html);
    else qs("adminSimulationHistory").innerHTML = html || emptyHtml("Nenhuma simulação registrada com esses filtros.");
    state.admin.cursors.simulations = data.proximo_cursor || null;
    qs("adminSimulationHistoryMore").hidden = data.has_more === false || !state.admin.cursors.simulations;
  }

  async function loadSimulationHistory(append) {
    try {
      var data = await rpc(CONFIG.rpcs.adminSimulationsList, {
        p_tipo: qs("adminSimulationHistoryType").value || null,
        p_config_id: integerValue(qs("adminSimulationHistoryVersion").value) || null,
        p_cursor: append ? state.admin.cursors.simulations : null,
        p_limite: CONFIG.pageSize
      });
      renderSimulationHistory(data, append);
      state.admin.loaded.simulationHistory = true;
    } catch (error) { qs("adminSimulationHistory").innerHTML = emptyHtml(friendlyMessage(error.message || error)); }
  }

  function renderSimulationComparison(data) {
    var simulations = listFrom(data, ["simulacoes"]);
    var series = listFrom(data, ["serie"]);
    var header = simulations.map(function (row) { return "<th>#" + escapeHtml(row.id_simulacao) + "<br><small>" + escapeHtml(row.nome || row.cenario || row.tipo) + "</small></th>"; }).join("");
    var rows = series.map(function (month) {
      return "<tr><td>" + escapeHtml(month.mes) + "</td>" + listFrom(month, ["valores"]).map(function (value) {
        var metrics = objectFrom(value, ["metricas"]);
        return "<td><strong>" + escapeHtml(formatMoneyCents(metrics.payout_centavos)) + "</strong><br><small>Receita " + escapeHtml(formatMoneyCents(metrics.receita_centavos)) + " · margem " + escapeHtml(formatMoneyCents(metrics.margem_centavos)) + "</small><br><small>Δ payout " + escapeHtml(formatMoneyCents(value.diferenca_payout_centavos)) + "</small></td>";
      }).join("") + "</tr>";
    }).join("");
    qs("adminSimulationCompareResults").innerHTML = "<div class=\"mmn-simulation-meta\"><strong>Comparação com baseline #" + escapeHtml(data.baseline_id) + "</strong><span>2 a 4 execuções registradas, sem alterar dados reais.</span></div><div class=\"table-wrap mmn-simulation-table\"><table><thead><tr><th>Mês</th>" + header + "</tr></thead><tbody>" + rows + "</tbody></table></div>";
  }

  async function exportSimulation(simulationId, section) {
    var data = await rpc(CONFIG.rpcs.adminSimulationExport, { p_simulacao_id: simulationId, p_secao: section });
    var blob = new Blob([JSON.stringify({ metadados: data.metadados, linhas: data.linhas }, null, 2)], { type: data.mime || "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = data.arquivo || ("mmn-simulacao-" + simulationId + ".json");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function setupSimulatorAndExport() {
    on("adminSimulatorForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminSimulatorSubmit", true, "Simulando...");
      try {
        var simulationParameters = collectAdminSimulationParameters();
        var data = await rpc(CONFIG.rpcs.adminSimulator, { p_config_id: integerValue(qs("adminSimVersion").value) || null, p_parametros: simulationParameters });
        state.admin.simulationParameters = Object.assign({}, objectFrom(data, ["premissas"]), simulationParameters);
        renderSimulationResults("adminSimulatorResults", data);
        state.admin.loaded.simulationHistory = false;
        await loadPublicationProgress(integerValue(qs("adminSimVersion").value));
      } catch (error) { qs("adminSimulatorResults").innerHTML = emptyHtml(friendlyMessage(error.message || error)); }
      finally { setBusy("adminSimulatorSubmit", false); }
    });
    on("adminReplayForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminReplaySubmit", true, "Executando...");
      try {
        var data = await rpc(CONFIG.rpcs.adminSimulatorReplay, {
          p_config_id: integerValue(qs("adminReplayVersion").value) || null,
          p_competencia_de: monthDate(qs("adminReplayFrom").value),
          p_competencia_ate: monthDate(qs("adminReplayTo").value),
          p_parametros: {
            taxa_gateway_percentual: numberValue(qs("adminReplayGateway").value),
            impostos_percentual: numberValue(qs("adminReplayTaxes").value)
          }
        });
        renderSimulationResults("adminReplayResults", data);
        state.admin.loaded.simulationHistory = false;
      } catch (error) { qs("adminReplayResults").innerHTML = emptyHtml(friendlyMessage(error.message || error)); }
      finally { setBusy("adminReplaySubmit", false); }
    });
    on("adminSimulationHistoryFilter", "submit", function (event) { event.preventDefault(); loadSimulationHistory(false); });
    on("adminSimulationHistoryMore", "click", function () { loadSimulationHistory(true); });
    on("adminSimulationHistory", "click", async function (event) {
      var detailButton = event.target.closest("[data-simulation-detail]");
      var exportButton = event.target.closest("[data-simulation-export]");
      try {
        if (detailButton) {
          var detail = await rpc(CONFIG.rpcs.adminSimulationGet, { p_simulacao_id: integerValue(detailButton.dataset.simulationDetail) });
          renderSimulationResults("adminSimulationDetailResults", detail);
          qs("adminSimulationDetailResults").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (exportButton) {
          var id = integerValue(exportButton.dataset.simulationExport);
          var select = qs("adminSimulationHistory").querySelector("[data-simulation-export-section=\"" + id + "\"]");
          setBusy(exportButton, true, "Gerando...");
          try { await exportSimulation(id, select ? select.value : "mensal"); }
          finally { setBusy(exportButton, false); }
        }
      } catch (error) { setGlobalError(error); }
    });
    on("adminSimulationCompare", "click", async function () {
      var ids = qsa("[data-simulation-select]:checked", qs("adminSimulationHistory")).map(function (input) { return integerValue(input.dataset.simulationSelect); });
      if (ids.length < 2 || ids.length > 4) return setGlobalError(new Error("Selecione de 2 a 4 simulações distintas."));
      setBusy("adminSimulationCompare", true, "Comparando...");
      try {
        var data = await rpc(CONFIG.rpcs.adminSimulationsCompare, { p_simulacao_ids: ids });
        renderSimulationComparison(data);
        qs("adminSimulationCompareResults").scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) { setGlobalError(error); }
      finally { setBusy("adminSimulationCompare", false); }
    });
    on("adminPaymentExport", "click", async function () {
      try {
        var reason = await confirmAction("Criar lote manual", "Será criado um lote real para a competência selecionada. Bloqueios fiscais e valor mínimo serão validados pelo servidor.", true);
        if (reason === null) return;
        await rpc(CONFIG.rpcs.adminBatchCreate, { p_competencia: monthDate(qs("adminPaymentPeriod").value), p_simulacao: false, p_motivo: reason });
        await refreshAdminDashboard();
        await loadAdminTab("pagamentos", false);
      } catch (error) { setGlobalError(error); }
    });
  }

  function setupDialog() {
    on("actionDialogConfirm", "click", function () {
      var required = !qs("actionDialogReasonField").hidden;
      var reason = qs("actionDialogReason").value.trim();
      if (required && !reason) {
        qs("actionDialogReason").focus();
        return;
      }
      closeActionDialog(reason);
    });
    on("actionDialogForm", "submit", function (event) {
      if (event.submitter && event.submitter.value === "cancel") {
        event.preventDefault();
        closeActionDialog(null);
      }
    });
    on("actionDialog", "cancel", function (event) { event.preventDefault(); closeActionDialog(null); });
  }

  function setupInitialValues() {
    ["adminOverviewPeriod", "adminRevenuePeriod", "adminPaymentPeriod", "userLedgerPeriod"].forEach(function (id) { if (qs(id)) qs(id).value = monthValue(); });
    var now = new Date();
    var thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    if (qs("adminAuditFrom")) qs("adminAuditFrom").value = thirtyDaysAgo.toISOString().slice(0, 10);
    if (qs("adminAuditTo")) qs("adminAuditTo").value = now.toISOString().slice(0, 10);
    if (qs("adminSimUsers")) qs("adminSimUsers").value = "1000";
    if (qs("adminSimTicket")) qs("adminSimTicket").value = "19.90";
    if (qs("adminSimChurn")) qs("adminSimChurn").value = "16.67";
    if (qs("adminSimContinuity")) qs("adminSimContinuity").value = "60";
    if (qs("adminSimDirects")) qs("adminSimDirects").value = "0";
    if (qs("adminSimReplication")) qs("adminSimReplication").value = "2";
    if (qs("adminSimOdd")) qs("adminSimOdd").value = "6";
    if (qs("adminSimEven")) qs("adminSimEven").value = "8";
    if (qs("adminSimTarget")) qs("adminSimTarget").value = "300000";
    if (qs("adminSimCeiling")) qs("adminSimCeiling").value = "330000";
    if (qs("adminSimDiscount")) qs("adminSimDiscount").value = "0";
    if (qs("adminSimGateway")) qs("adminSimGateway").value = "3";
    if (qs("adminSimTaxes")) qs("adminSimTaxes").value = "0";
    if (qs("adminSimChargeback")) qs("adminSimChargeback").value = "1";
    if (qs("adminSimConversion")) qs("adminSimConversion").value = "40";
    if (qs("adminSimMaturity")) qs("adminSimMaturity").value = "3";
  }

  document.addEventListener("DOMContentLoaded", function () {
    configureMode();
    setupInitialValues();
    setupTabs();
    setupAuthEvents();
    setupAddressForms();
    setupPixValidationForms();
    setupRegulationOverlay();
    setupUserEvents();
    setupUserDetailOverlays();
    setupProgramExitDialog();
    setupAdminFilters();
    setupAdminActions();
    setupConfigEvents();
    setupSimulatorAndExport();
    setupDialog();
    boot();
  });
}());
