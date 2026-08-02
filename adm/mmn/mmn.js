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
    rpcs: {
      adminContext: "adm_contexto_rpc",
      userDashboard: "mmn_usuario_painel_rpc",
      userEnrollmentSave: "mmn_usuario_aderir_rpc",
      userSimulator: "mmn_usuario_simular_rpc",
      userProfileSave: "mmn_usuario_perfil_pagamento_salvar_rpc",
      userDispute: "mmn_usuario_contestar_rpc",
      userEventRead: "mmn_usuario_evento_marcar_lido_rpc",
      userPlacementNetwork: "mmn_usuario_rede_posicionamento_rpc",
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
      cursors: { network: null, ledger: null, payments: null },
      loaded: {}
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
    pix_titular_invalido: "A chave PIX deve pertencer ao mesmo CPF do cadastro.",
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
      button.textContent = busyText || "Aguarde...";
      button.disabled = true;
    } else {
      if (button.dataset.label) button.textContent = button.dataset.label;
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
      document.title = "Minha rede - Turbo Tiger";
      setText("brandTitle", "Indicações");
      setText("pageTitle", "Minha rede");
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

  function cleanText(value) {
    return String(value == null ? "" : value).trim();
  }

  function digitsOnly(value) {
    return cleanText(value).replace(/\D/g, "");
  }

  function formatPostalCode(value) {
    var digits = digitsOnly(value).slice(0, 8);
    return digits.length > 5 ? digits.slice(0, 5) + "-" + digits.slice(5) : digits;
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

  function markAddressResolved(prefix) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    context.resolvedPostalCode = cep.length === 8 ? cep : "";
    context.resolvedAddressKey = currentAddressKey(prefix);
    context.postalCodeConsistent = !!context.resolvedPostalCode && addressHasReverseLookupKey(prefix);
  }

  function markAddressPending(prefix, scheduleLookup, delay) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    var unchanged = cep.length === 8 && cep === context.resolvedPostalCode && currentAddressKey(prefix) === context.resolvedAddressKey;
    if (unchanged) {
      context.postalCodeConsistent = true;
      return;
    }
    context.postalCodeConsistent = false;
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
    return objectFrom(data, ["participacao", "adesao", "elegibilidade", "participante", "usuario_mmn"]);
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
    var regulation = objectFrom(data, ["regulamento", "termos"]);
    var accepted = booleanValue(firstDefined([
      regulation.aceito,
      participation.aceite_vigente,
      participation.regulamento_aceito,
      participation.aderiu,
      participation.adesao_ativa,
      data.adesao_concluida
    ], false), false);
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
      PixType: profile.pix_tipo || profile.tipo || profile.tipo_chave_pix || "cpf",
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
    var ownership = qs(prefix + "PixOwnership");
    if (ownership) ownership.checked = booleanValue(profile.titularidade_declarada, false);
    if (prefix === "profile") {
      setText("profilePixMasked", profile.pix_mascarado ? "Chave atual: " + profile.pix_mascarado : "Nenhuma chave cadastrada.");
    }
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
    var name = user.nome_exibicao || user.codinome || user.login || user.nome || (state.session && state.session.user && (state.session.user.name || state.session.user.email)) || "participante";
    setText("userGreeting", "Olá, " + name + ". Sua rede está aqui.");
    var eligible = booleanValue(firstDefined([eligibility.elegivel_receber, eligibility.elegivel, data.elegivel], false), false);
    var status = qs("userEligibility");
    var reasons = listValue(eligibility.motivos);
    status.textContent = eligible ? "Elegível nesta competência" : (reasons.length ? reasons.join(" · ").replace(/_/g, " ") : (participation.status || "Inelegível nesta competência"));
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
    var target = firstDefined([qualification.proximo_rank_min_ativos, qualification.meta_ativos, nextRankRow && (nextRankRow.min_rede_ativa || nextRankRow.min_ativos_rede)], current);
    var progress = firstDefined([qualification.progresso_percentual], target > 0 ? (numberValue(current) / numberValue(target) * 100) : 100);
    setText("userRankDescription", "Rank atual: " + currentRank + ". Os critérios são avaliados a cada competência.");
    setText("userNextRank", nextRank);
    qs("userRankProgressBar").style.width = Math.max(0, Math.min(100, numberValue(progress))) + "%";
    setText("userRankProgressCurrent", formatInteger(current) + " ativos");
    setText("userRankProgressTarget", target > current ? formatInteger(target) + " necessários" : "Objetivo alcançado");
    var requirements = listFrom(qualification, ["requisitos", "criterios"]);
    if (!requirements.length && nextRankRow) {
      requirements = [
        { nome: "Rede ativa: " + formatInteger(current) + " de " + formatInteger(target), ok: numberValue(current) >= numberValue(target) },
        { nome: "Diretos ativos: " + formatInteger(qualification.diretos_ativos) + " de " + formatInteger(nextRankRow.min_diretos_ativos), ok: numberValue(qualification.diretos_ativos) >= numberValue(nextRankRow.min_diretos_ativos) },
        { nome: "Maior perna: " + formatPercent(qualification.percentual_maior_perna) + " (máximo " + formatPercent(nextRankRow.max_percentual_maior_perna) + ")", ok: numberValue(qualification.percentual_maior_perna) <= numberValue(nextRankRow.max_percentual_maior_perna) }
      ];
    }
    qs("userQualificationChecklist").innerHTML = requirements.length ? requirements.map(function (item) {
      var ok = booleanValue(item.atendido || item.ok, false);
      return "<div class=\"mmn-check-item " + (ok ? "is-ok" : "") + "\"><span>" + escapeHtml(item.nome || item.titulo || item.descricao || "Critério") + "</span></div>";
    }).join("") : emptyHtml("Os critérios da competência ainda não foram publicados.");
    setText("userDirectActive", formatInteger(firstDefined([qualification.diretos_ativos, network.diretos_ativos], null)));
    setText("userNetworkActive", formatInteger(firstDefined([qualification.rede_ativa, qualification.rede_ativos, network.rede_ativos], null)));
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
    if (typeof person !== "object") return "#" + person;
    var id = firstDefined([person.usuario_id, person.id_usuario, person.cod_usuario, person.id], null);
    var name = person.nome || person.codinome || person.login || "";
    return [name, id != null ? "#" + id : ""].filter(Boolean).join(" · ") || fallback || "—";
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
    setText("userSponsorRelation", Object.keys(sponsor).length ? relationPersonLabel(sponsor, "Raiz") : relationPersonLabel(sponsorId, "Raiz"));
    setText("userPlacementParent", Object.keys(parent).length ? relationPersonLabel(parent, "Raiz estrutural") : relationPersonLabel(parentId, "Raiz estrutural"));
    setText("userPlacementSlot", slot == null || slot === "" ? "Sem vaga atribuída" : "Vaga " + slot);
    setText("userPlacementWidth", width === 0 ? "Ilimitada" : formatInteger(width) + " vagas por participante");
    setText("userPlacementSpillover", spillover ? "Posicionado por spillover; seu patrocinador permanece o mesmo." : "Posicionamento direto, sem spillover nesta entrada.");
  }

  function renderUserNetwork(data, append) {
    var depth = configuredNetworkDepth(data);
    var levels = listFrom(data, ["por_nivel", "niveis", "levels"]).filter(function (level) {
      return integerValue(level.nivel) >= 1 && integerValue(level.nivel) <= depth;
    });
    var directs = listFrom(data, ["diretos", "participantes"]);
    renderUserGenealogy(data);
    if (levels.length) {
      qs("userLevelGrid").innerHTML = levels.map(function (level) {
        var unlocked = firstDefined([level.liberado, level.qualificado], true);
        return "<article class=\"mmn-level-card " + (unlocked ? "" : "is-locked") + "\"><span>Nível " + escapeHtml(level.nivel) + " · " + escapeHtml(formatPercent(level.percentual)) + "</span><strong>" + escapeHtml(formatInteger(firstDefined([level.ativos, level.participantes_ativos], null))) + "</strong><span>ativos de " + escapeHtml(formatInteger(firstDefined([level.total, level.participantes], null))) + " participantes</span>" + pillHtml(unlocked ? "ativo" : "pendente", unlocked ? "Qualificado" : "Não qualificado") + "</article>";
      }).join("");
    } else if (!append) {
      qs("userLevelGrid").innerHTML = emptyHtml("A distribuição por nível ainda não está disponível.");
    }
    var html = directs.map(function (person) {
      var personId = person.id_usuario || person.usuario_id || person.id || person.cod_usuario || "";
      return "<div class=\"mmn-list-row\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(person.nome || person.codinome || person.login || ("Participante #" + personId)) + "</strong><small>Indicação direta · #" + escapeHtml(personId) + "</small></div><span>" + escapeHtml(formatDate(person.desde || person.criado_em || person.indicado_em, false)) + "</span><span>" + escapeHtml(person.rank_nome || person.rank || "—") + "</span>" + pillHtml(person.status || (person.ativo ? "ativo" : "pendente")) + "</div>";
    }).join("");
    if (append) qs("userDirectList").insertAdjacentHTML("beforeend", html);
    else qs("userDirectList").innerHTML = html || emptyHtml("Você ainda não possui indicados diretos.");
    state.user.cursors.network = data.proximo_cursor || data.cursor_proximo || null;
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
    qs("userRankLadder").innerHTML = ranks.length ? ranks.map(function (rank) {
      var status = String(rank.status || (String(rank.chave) === String(qualification.rank_chave) ? "atual" : "pendente"));
      return "<article class=\"mmn-rank-card " + (status === "atual" ? "is-current" : (status === "concluido" ? "is-complete" : "")) + "\"><span>" + escapeHtml(status === "atual" ? "Rank atual" : "Qualificação") + "</span><strong>" + escapeHtml(rank.nome || rank.rank || "") + "</strong><span>" + escapeHtml(formatInteger(rank.min_rede_ativa || rank.min_ativos_rede || rank.ativos_necessarios)) + " ativos na rede · bônus " + escapeHtml(formatPercent(rank.bonus_percentual || rank.percentual_lideranca || rank.percentual)) + " · pool " + escapeHtml(numberValue(rank.pool_coeficiente)) + "</span>" + pillHtml(status || "pendente") + "</article>";
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
        try {
          var placementNetwork = await rpc(CONFIG.rpcs.userPlacementNetwork, { p_limite: 250 });
          var placementPayload = objectFrom(placementNetwork, ["rede", "dados"]);
          if (!Object.keys(placementPayload).length) placementPayload = placementNetwork;
          var positionedRows = listFrom(placementPayload, ["rede"]);
          var placementLevels = listFrom(placementPayload, ["por_nivel", "niveis", "levels"]);
          if (!placementLevels.length && positionedRows.length) {
            var grouped = {};
            positionedRows.forEach(function (row) {
              var level = integerValue(row.nivel);
              if (!grouped[level]) grouped[level] = { nivel: level, total: 0, ativos: null };
              grouped[level].total += 1;
            });
            placementLevels = Object.keys(grouped).map(function (key) { return grouped[key]; }).sort(function (a, b) { return a.nivel - b.nivel; });
          }
          var placementDirects = listFrom(placementPayload, ["patrocinio", "diretos", "indicados_diretos"]);
          renderUserNetwork(Object.assign({}, network, placementPayload, {
            niveis: placementLevels.length ? placementLevels : levels,
            diretos: placementDirects.length ? placementDirects : (network.diretos || []),
            regras: objectFrom(dashboard, ["regras", "configuracao_publica"]),
            participante: objectFrom(dashboard, ["participante", "usuario_mmn"])
          }), false);
        } catch (networkError) {
          renderUserNetwork(Object.assign({}, network, { niveis: levels, diretos: network.diretos || [], regras: objectFrom(dashboard, ["regras", "configuracao_publica"]) }), false);
        }
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
      var placementText = placementParent == null ? "Raiz estrutural" : ("Pai #" + placementParent + (placementSlot == null ? "" : " · vaga " + placementSlot));
      var spillover = booleanValue(firstDefined([placement.spillover, placement.foi_spillover, row.foi_spillover], false), false);
      var permanent = row.status === "inelegivel_permanente" || booleanValue(row.inelegibilidade_permanente, false);
      return "<tr><td><strong>" + escapeHtml(row.nome || row.codinome || row.login || "") + "</strong><br><small>#" + escapeHtml(id) + "</small></td><td>#" + escapeHtml(row.patrocinador_id || "Raiz") + "<br><small>Indicação direta</small></td><td>" + escapeHtml(placementText) + "<br><small>" + escapeHtml(spillover ? "Spillover" : "Posição direta") + "</small></td><td>" + escapeHtml(row.grupo || row.grupo_chave || "—") + "</td><td>" + pillHtml(eligibility.premium_vigente ? "ativo" : "pendente", eligibility.premium_vigente ? "Em dia" : "Inativo") + "</td><td>" + pillHtml(permanent ? "permanente" : (eligibility.elegivel_receber ? "ativo" : row.status), permanent ? "Permanente" : (eligibility.elegivel_receber ? "Elegível" : row.status)) + "</td><td>" + escapeHtml(row.rank_nome || row.rank || "—") + "</td><td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-participant-edit=\"" + escapeHtml(id) + "\">Gerenciar</button></td></tr>";
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
      html += "<article class=\"mmn-feature-panel\"><div class=\"mmn-panel-title\"><div><h3>" + escapeHtml(base.nome || base.codinome || base.login || "Usuário") + "</h3><p>#" + escapeHtml(base.id || base.cod_usuario || base.id_usuario) + " · patrocinador #" + escapeHtml(participant.id_patrocinador || participant.patrocinador_id || "Raiz") + "</p></div>" + pillHtml(participant.status || (base.mmn_ativo ? "ativo" : "suspenso")) + "</div><div class=\"mmn-genealogy-summary\"><div><span>Patrocínio</span><strong>" + escapeHtml(relationPersonLabel(objectFrom(sponsorship, ["patrocinador", "pai"]), relationPersonLabel(participant.patrocinador_id || participant.id_patrocinador, "Raiz"))) + "</strong><small>Origem da comissão direta.</small></div><div><span>Pai de posicionamento</span><strong>" + escapeHtml(relationPersonLabel(objectFrom(placement, ["pai", "pai_posicionamento"]), relationPersonLabel(placement.pai_posicionamento_id || participant.pai_posicionamento_id, "Raiz estrutural"))) + "</strong><small>Origem dos níveis residuais.</small></div><div><span>Vaga</span><strong>" + escapeHtml(firstDefined([placement.slot_posicionamento, participant.slot_posicionamento], "—")) + "</strong><small>Slot estrutural registrado.</small></div><div><span>Regra</span><strong>" + escapeHtml(width === 0 ? "Largura ilimitada" : (width + " vagas por nó")) + "</strong><small>Profundidade remunerada: " + escapeHtml(depth) + " nível(is).</small></div></div></article>";
    }
    html += "<div class=\"mmn-tree-explanation\"><strong>Duas genealogias independentes</strong><span>Patrocínio preserva quem convidou. Posicionamento organiza as vagas e o spillover. A comissão direta prevalece e o mesmo beneficiário não recebe duas vezes sobre a mesma assinatura.</span></div>";
    html += levels.map(function (level) {
      return "<div class=\"mmn-tree-level\"><strong>Nível " + escapeHtml(level.nivel) + "</strong><div class=\"mmn-tree-people\"><div class=\"mmn-tree-person\"><strong>" + escapeHtml(formatInteger(level.ativos)) + " ativos</strong><span>de " + escapeHtml(formatInteger(level.total)) + " participantes</span></div></div></div>";
    }).join("");
    if (directs.length) html += "<div class=\"mmn-tree-level\"><strong>Patrocínio · indicados diretos</strong><div class=\"mmn-tree-people\">" + directs.map(function (person) { return "<div class=\"mmn-tree-person\"><strong>" + escapeHtml(person.nome || ("#" + (person.id || person.cod_usuario))) + "</strong><span>#" + escapeHtml(person.id || person.cod_usuario) + " · vínculo permanente de indicação</span>" + pillHtml(person.status || (person.ativo ? "ativo" : "suspenso")) + "</div>"; }).join("") + "</div></div>";
    if (positioned.length) html += "<div class=\"mmn-tree-level\"><strong>Posicionamento · vagas abaixo</strong><div class=\"mmn-tree-people\">" + positioned.map(function (person) { return "<div class=\"mmn-tree-person\"><strong>" + escapeHtml(person.nome || ("#" + (person.id || person.cod_usuario))) + "</strong><span>Vaga " + escapeHtml(firstDefined([person.slot_posicionamento, person.slot], "—")) + (booleanValue(firstDefined([person.spillover, person.foi_spillover], false), false) ? " · spillover" : " · posição direta") + "</span>" + pillHtml(person.status || (person.ativo ? "ativo" : "suspenso")) + "</div>"; }).join("") + "</div></div>";
    qs("adminNetworkTree").innerHTML = html || emptyHtml("Nenhuma genealogia encontrada para esse usuário.");
  }

  function renderAdminRevenue(data, append) {
    var rows = listFrom(data, ["lancamentos", "receitas", "alocacoes", "itens"]);
    var html = rows.map(function (row) {
      return "<tr><td>" + escapeHtml(formatDate(row.ingerido_em || row.criado_em || row.data_evento, true)) + "</td><td><strong>" + escapeHtml(row.nome || row.origem_nome || "—") + "</strong><br><small>#" + escapeHtml(row.id_usuario_origem || "—") + "</small></td><td>#" + escapeHtml(row.id_pagamento || "—") + "<br><small>" + escapeHtml(row.gateway_payment_id || "") + "</small></td><td>" + escapeHtml(row.gateway || "—") + "</td><td><strong>" + escapeHtml(formatMoneyCents(centsFrom(row, ["valor_pago_centavos"]))) + "</strong></td><td>" + (row.valor_confirmado ? escapeHtml(formatDate(row.confirmado_em, true)) : "Aguardando") + "</td><td>" + pillHtml(row.gera_comissao ? "ativo" : "bloqueado", row.gera_comissao ? "Gera" : (row.motivo_nao_geracao || "Não gera")) + "</td><td>" + pillHtml(row.status) + "</td></tr>";
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
      return "<tr><td><strong>" + escapeHtml(row.nome || ("Usuário #" + row.id_usuario)) + "</strong><br><small>" + escapeHtml(row.cpf_mascarado || "") + " · PIX " + escapeHtml(row.pix_mascarado || "—") + "</small></td><td>" + escapeHtml(String(row.competencia || "").slice(0, 7)) + "<br><small>Lote #" + escapeHtml(row.id_lote) + " · " + escapeHtml(row.modo || "") + "</small></td><td><strong>" + escapeHtml(formatMoneyCents(row.valor_liquido_centavos)) + "</strong><br><small>Bruto " + escapeHtml(formatMoneyCents(row.valor_bruto_centavos)) + " · retenções " + escapeHtml(formatMoneyCents(row.retencoes_centavos)) + "</small></td><td>" + pillHtml(documentStatus) + "<br><small>" + escapeHtml(row.rpa_numero || "Sem número") + "</small></td><td>" + pillHtml(transferStatus) + "<br><small>" + escapeHtml(row.provedor_chave || "manual") + "</small></td><td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-rpa-detail=\"" + escapeHtml(row.cod_mmn_lote_beneficiario) + "\">Detalhes</button></td></tr>";
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
      pix_mesmo_cpf: qs(prefix + "PixOwnership").checked
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
    qs("userApp").hidden = false;
    qs("adminApp").hidden = true;
    qs("adminLoginPanel").hidden = true;
    renderUserDashboard(data);
    setText("adminIdentity", objectFrom(data, ["usuario"]).codinome || "Turbo Tiger");
    setStatus("pageStatus", "Atualizado com dados do servidor", "ok");
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

  function setupUserEvents() {
    on("userShareButton", "click", shareInvite);
    on("networkShareButton", "click", shareInvite);
    on("userCopyInviteButton", "click", async function () {
      if (!state.user.inviteUrl) {
        setGlobalError(new Error("O link de convite ainda não está disponível."));
        return;
      }
      try {
        await navigator.clipboard.writeText(state.user.inviteUrl);
        setStatus("pageStatus", "Link de convite copiado", "ok");
      } catch (error) {
        setGlobalError(new Error("Não foi possível copiar o link neste dispositivo."));
      }
    });
    on("enrollmentForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("enrollmentSubmit", true, "Salvando adesão...");
      setStatus("enrollmentStatus", "", null);
      try {
        validateAddressForSubmission("enrollment", true);
        var payload = collectProfile("enrollment");
        var regulation = objectFrom(state.user.dashboard, ["regulamento", "termos"]);
        await rpc(CONFIG.rpcs.userEnrollmentSave, {
          p_documento_id: regulation.documento_id || regulation.cod_documento || regulation.id || null,
          p_pix_tipo: payload.pix_tipo,
          p_pix_chave: payload.pix_chave,
          p_titularidade_confirmada: payload.pix_mesmo_cpf,
          p_dados_rpa: payload,
          p_confirmacao: qs("enrollmentTerms").checked && payload.pix_mesmo_cpf
        });
        setStatus("enrollmentStatus", "Adesão concluída com segurança.", "ok");
        await boot();
      } catch (error) {
        setStatus("enrollmentStatus", error.message || error, "error");
      } finally {
        setBusy("enrollmentSubmit", false);
      }
    });
    on("userProfileForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("profileSubmit", true, "Salvando...");
      try {
        validateAddressForSubmission("profile", true);
        var profile = collectProfile("profile");
        var result = await rpc(CONFIG.rpcs.userProfileSave, {
          p_pix_tipo: profile.pix_tipo,
          p_pix_chave: profile.pix_chave,
          p_titularidade_confirmada: profile.pix_mesmo_cpf,
          p_dados_rpa: profile
        });
        qs("profilePixKey").value = "";
        if (result.pix_mascarado) setText("profilePixMasked", "Chave atual: " + result.pix_mascarado);
        setStatus("profileStatus", "Dados atualizados.", "ok");
      } catch (error) {
        setStatus("profileStatus", error.message || error, "error");
      } finally {
        setBusy("profileSubmit", false);
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
      setText("adminParticipantEditorTitle", "Gerenciar " + (row.codinome || row.login || row.nome || "participante"));
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
    setupUserEvents();
    setupAdminFilters();
    setupAdminActions();
    setupConfigEvents();
    setupSimulatorAndExport();
    setupDialog();
    boot();
  });
}());
