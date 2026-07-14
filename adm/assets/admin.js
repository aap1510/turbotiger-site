(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    sessionKey: "tt_admin_session_v1"
  };

  var state = {
    session: null,
    contexto: null,
    catalogo: null,
    historico: null,
    admin: {
      areas: [],
      perfis: [],
      usuarios: []
    }
  };

  var FRIENDLY_MESSAGES = {
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
    "Failed to fetch": "Falha de conexao. Verifique sua internet e tente novamente.",
    "Invalid login credentials": "E-mail ou senha invalidos.",
    admin_ja_configurado: "O primeiro administrador j\u00e1 foi configurado.",
    area_protegida: "Esta \u00e1rea \u00e9 essencial e n\u00e3o pode ser desativada.",
    catalogo_indisponivel: "N\u00e3o foi poss\u00edvel carregar as configura\u00e7\u00f5es de notifica\u00e7\u00e3o.",
    categoria_invalida: "Categoria inv\u00e1lida.",
    dados_obrigatorios: "Preencha os campos obrigat\u00f3rios.",
    falha_http_400: "N\u00e3o foi poss\u00edvel concluir a opera\u00e7\u00e3o.",
    falha_http_401: "Sess\u00e3o expirada. Entre novamente.",
    falha_http_403: "Voc\u00ea n\u00e3o tem permiss\u00e3o para esta a\u00e7\u00e3o.",
    historico_indisponivel: "N\u00e3o foi poss\u00edvel carregar o hist\u00f3rico.",
    informe_grupos: "Informe pelo menos um grupo.",
    informe_licencas: "Informe pelo menos uma licen\u00e7a.",
    informe_plataforma: "Selecione pelo menos uma plataforma.",
    informe_token: "Informe o token de destino.",
    informe_usuarios: "Informe pelo menos um usu\u00e1rio.",
    invalid_grant: "E-mail ou senha inv\u00e1lidos.",
    missing_authorization: "Sess\u00e3o expirada. Entre novamente.",
    modelo_nao_salvo: "N\u00e3o foi poss\u00edvel salvar o modelo.",
    nao_autenticado: "Entre para continuar.",
    nenhum_destinatario_push: "Nenhum destinat\u00e1rio encontrado para esta configura\u00e7\u00e3o.",
    perfil_admin_invalido: "Perfil administrativo inv\u00e1lido.",
    perfil_protegido: "O perfil de super administrador n\u00e3o pode ser desativado.",
    push_broadcast_sem_permissao: "Seu perfil n\u00e3o permite enviar para todos os aparelhos.",
    sem_permissao_admin: "Sem permiss\u00e3o para administra\u00e7\u00e3o.",
    sem_permissao_areas: "Sem permiss\u00e3o para alterar \u00e1reas administrativas.",
    sem_permissao_configurar_push: "Sem permiss\u00e3o para configurar notifica\u00e7\u00f5es.",
    sem_permissao_perfis: "Sem permiss\u00e3o para alterar perfis administrativos.",
    sem_permissao_push: "Sem permiss\u00e3o para acessar notifica\u00e7\u00f5es.",
    sem_permissao_usuarios: "Sem permiss\u00e3o para alterar usu\u00e1rios administrativos.",
    sessao_expirada: "Sess\u00e3o expirada. Entre novamente.",
    usuario_auth_nao_encontrado: "Usu\u00e1rio n\u00e3o encontrado no Supabase Auth."
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = friendlyMessage(text || "");
    el.classList.remove("is-error", "is-ok");
    if (kind) el.classList.add(kind === "ok" ? "is-ok" : "is-error");
  }

  function setBusy(button, busy) {
    if (!button) return;
    button.disabled = !!busy;
  }

  function safeJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value);
    }
  }

  function friendlyMessage(value) {
    var raw = String(value == null ? "" : value).trim();
    if (!raw) return "";
    return FRIENDLY_MESSAGES[raw] || FRIENDLY_MESSAGES[raw.toLowerCase()] || raw;
  }

  function responseMessage(data) {
    if (!data || typeof data !== "object") return friendlyMessage(data);
    if (data.ok === false) return friendlyMessage(data.error || data.message || "Nao foi possivel concluir a operacao.");
    if (data.dry_run) return "Simulacao concluida. Tokens encontrados: " + (data.tokens || 0) + ".";
    if (Object.prototype.hasOwnProperty.call(data, "sent")) {
      if ((data.sent || 0) === 0 && (data.failed || 0) === 0) {
        return zeroPushMessage(data);
      }
      return "Envio concluido. Enviadas: " + (data.sent || 0) + ". Falhas: " + (data.failed || 0) + ".";
    }
    if (data.ok === true) return "Operacao concluida.";
    return safeJson(data);
  }

  function zeroPushMessage(data) {
    var parts = [];
    if (data.destino_tipo) parts.push("Destino: " + data.destino_tipo);
    if (data.plataformas) parts.push("Plataforma: " + String(data.plataformas));
    if (Object.prototype.hasOwnProperty.call(data, "tokens_resolvidos")) {
      parts.push("Antes do filtro: " + (data.tokens_resolvidos || 0));
    }
    return friendlyMessage(data.error || "nenhum_destinatario_push") + (parts.length ? " " + parts.join(". ") + "." : "");
  }

  function readSession() {
    try {
      var raw = localStorage.getItem(CONFIG.sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveSession(session) {
    state.session = session;
    localStorage.setItem(CONFIG.sessionKey, JSON.stringify(session));
  }

  function clearSession() {
    state.session = null;
    localStorage.removeItem(CONFIG.sessionKey);
  }

  function authHeaders(token) {
    var accessToken = token || (state.session && state.session.access_token) || "";
    return {
      "apikey": CONFIG.apiKey,
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json; charset=utf-8"
    };
  }

  async function parseResponse(response) {
    var text = await response.text();
    var data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { raw: text };
      }
    }
    if (!response.ok) {
      var message = (data && (data.error_description || data.message || data.error)) || "falha_http_" + response.status;
      throw new Error(friendlyMessage(message));
    }
    return data;
  }

  async function login(email, password) {
    var response = await fetch(CONFIG.supabaseUrl + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "apikey": CONFIG.apiKey,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ email: email, password: password })
    });
    var data = await parseResponse(response);
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type || "bearer",
      expires_at: Date.now() + (Number(data.expires_in || 3600) * 1000),
      user: data.user || null
    };
  }

  async function refreshSessionIfNeeded() {
    if (!state.session) state.session = readSession();
    if (!state.session || !state.session.access_token) return null;
    if (state.session.expires_at && state.session.expires_at > Date.now() + 60000) {
      return state.session;
    }
    if (!state.session.refresh_token) {
      clearSession();
      return null;
    }
    var response = await fetch(CONFIG.supabaseUrl + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: {
        "apikey": CONFIG.apiKey,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ refresh_token: state.session.refresh_token })
    });
    var data = await parseResponse(response);
    saveSession({
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
    if (!session) throw new Error("sessao_expirada");
    var response = await fetch(CONFIG.supabaseUrl + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: authHeaders(session.access_token),
      body: JSON.stringify(payload || {})
    });
    return parseResponse(response);
  }

  async function ensureAdmin(area) {
    var session = await refreshSessionIfNeeded();
    if (!session) {
      window.location.href = "../";
      return null;
    }
    var contexto = await rpc("adm_contexto_rpc", {});
    if (!contexto || contexto.ok !== true) {
      clearSession();
      window.location.href = "../";
      return null;
    }
    if (area && Array.isArray(contexto.areas) && contexto.areas.indexOf(area) === -1) {
      throw new Error("sem_permissao_" + area);
    }
    state.contexto = contexto;
    return contexto;
  }

  function fillSelect(select, rows, valueKey, labelKey) {
    if (!select) return;
    select.innerHTML = "";
    (rows || []).forEach(function (row) {
      var option = document.createElement("option");
      option.value = row[valueKey];
      option.textContent = row[labelKey] || row[valueKey];
      select.appendChild(option);
    });
  }

  function splitList(value) {
    return String(value || "")
      .split(/[\n,;]+/g)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function numberList(items) {
    return items
      .map(function (item) { return Number(item); })
      .filter(function (item) { return Number.isFinite(item) && item > 0; })
      .map(function (item) { return Math.trunc(item); });
  }

  function uuidList(items) {
    return items.filter(function (item) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item);
    });
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function restoreSelectValue(select, value) {
    if (!select) return;
    var wanted = String(value || "");
    var found = false;
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value === wanted) found = true;
    });
    if (found) {
      select.value = wanted;
    } else if (select.options.length) {
      select.selectedIndex = 0;
    }
  }

  function exactModel(categoria, tipo) {
    var modelos = (state.catalogo && state.catalogo.modelos) || [];
    var wanted = tipo || "padrao";
    return modelos.find(function (m) {
      return m.categoria === categoria && m.tipo === wanted;
    }) || null;
  }

  function activeModel(categoria, tipo) {
    var wanted = tipo || "padrao";
    return exactModel(categoria, wanted) || exactModel(categoria, "padrao") || null;
  }

  function currentCategoryDefault(categoria) {
    var categorias = (state.catalogo && state.catalogo.categorias) || [];
    return categorias.find(function (item) { return item.chave === categoria; }) || null;
  }

  function humanizeTipo(tipo) {
    return String(tipo || "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, function (letter) { return letter.toUpperCase(); }) || "Padrao";
  }

  function modelTypeOptions(categoria) {
    var map = {};
    ((state.catalogo && state.catalogo.tipos_notificacao) || []).forEach(function (item) {
      if (item.categoria !== categoria || !item.tipo) return;
      map[item.tipo] = {
        tipo: item.tipo,
        nome: item.nome || humanizeTipo(item.tipo),
        descricao: item.descricao || "",
        ordem: item.ordem || 999,
        titulo_padrao: item.titulo_padrao || "",
        mensagem_padrao: item.mensagem_padrao || "",
        placeholders_json: item.placeholders_json || [],
        contexto_exemplo_json: item.contexto_exemplo_json || {},
        automatico: item.automatico === true,
        manual: item.manual !== false
      };
    });
    ((state.catalogo && state.catalogo.modelos) || []).forEach(function (model) {
      if (model.categoria !== categoria || !model.tipo) return;
      var option = map[model.tipo] || {
        tipo: model.tipo,
        nome: model.nome || humanizeTipo(model.tipo),
        descricao: model.descricao || "",
        ordem: model.ordem || 999,
        placeholders_json: model.placeholders_json || [],
        contexto_exemplo_json: model.contexto_exemplo_json || {},
        automatico: model.automatico === true,
        manual: model.manual !== false
      };
      option.titulo_padrao = model.titulo_padrao || option.titulo_padrao || "";
      option.mensagem_padrao = model.mensagem_padrao || option.mensagem_padrao || "";
      option.prioridade = model.prioridade || option.prioridade || "";
      option.canal_android = model.canal_android || option.canal_android || "";
      map[model.tipo] = option;
    });
    return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
      return (a.ordem - b.ordem) || a.nome.localeCompare(b.nome);
    });
  }

  function currentModelTypeOption(categoria, tipo) {
    return modelTypeOptions(categoria).find(function (item) { return item.tipo === tipo; }) || null;
  }

  function fillModelTypeSelect(preferredTipo) {
    var select = qs("modelTipo");
    var categoria = qs("modelCategoria") && qs("modelCategoria").value;
    if (!select || !categoria) return;
    var current = preferredTipo || select.value || "padrao";
    select.innerHTML = "";
    modelTypeOptions(categoria).forEach(function (item) {
      var option = document.createElement("option");
      option.value = item.tipo;
      option.textContent = item.nome + " (" + item.tipo + ")";
      select.appendChild(option);
    });
    restoreSelectValue(select, current);
  }

  function fillSendTypeSelect(preferredTipo) {
    var select = qs("sendTipo");
    var categoria = qs("sendCategoria") && qs("sendCategoria").value;
    if (!select || !categoria) return;
    var options = sendModelOptions(categoria);
    var current = preferredTipo || select.value || "manual";
    select.innerHTML = "";
    options.forEach(function (item) {
      var option = document.createElement("option");
      option.value = item.tipo;
      option.textContent = item.nome + " (" + item.tipo + ")";
      select.appendChild(option);
    });
    restoreSelectValue(select, current);
  }

  function sendModelOptions(categoria) {
    return modelTypeOptions(categoria).filter(function (item) { return item.manual !== false; });
  }

  function applyModelToSend() {
    var categoria = qs("sendCategoria") && qs("sendCategoria").value;
    var tipo = qs("sendTipo") && qs("sendTipo").value;
    var modelo = activeModel(categoria, tipo);
    var defaults = currentCategoryDefault(categoria);
    if (!modelo) return;
    qs("sendTitulo").value = modelo.titulo_padrao || "Turbo Tiger";
    qs("sendMensagem").value = modelo.mensagem_padrao || "";
    qs("sendPrioridade").value = modelo.prioridade || (defaults && defaults.prioridade_padrao) || "alta";
    qs("sendUsarImagem").checked = modelo.usar_imagem === true;
    qs("sendImagemUrl").value = modelo.imagem_url || "";
    updateSendImageField();
    updatePushPreview();
    renderSendModelPicker();
  }

  function renderSendModelPicker() {
    var box = qs("sendModelPicker");
    if (!box) return;
    var categoria = qs("sendCategoria") && qs("sendCategoria").value;
    var selectedTipo = qs("sendTipo") && qs("sendTipo").value;
    var rows = categoria ? sendModelOptions(categoria) : [];

    if (!rows.length) {
      box.innerHTML = "<div class=\"status-line\">Nenhum modelo manual encontrado para esta categoria.</div>";
      return;
    }

    box.innerHTML =
      "<div class=\"section-label\">Modelos da categoria</div>" +
      "<div class=\"send-model-list\">" +
      rows.map(function (option) {
        var model = exactModel(categoria, option.tipo);
        var title = (model && model.titulo_padrao) || option.titulo_padrao || "Turbo Tiger";
        var message = (model && model.mensagem_padrao) || option.mensagem_padrao || "";
        var active = option.tipo === selectedTipo ? " is-selected" : "";
        var modo = [option.automatico ? "Automatico" : "", option.manual ? "Manual" : ""].filter(Boolean).join(" / ");
        return "<button class=\"send-model-card" + active + "\" type=\"button\" data-send-model=\"" + escapeHtml(option.tipo) + "\">" +
          "<span class=\"send-model-card-title\">" + escapeHtml(option.nome || humanizeTipo(option.tipo)) + "</span>" +
          "<span class=\"send-model-card-key\">" + escapeHtml(option.tipo) + (modo ? " - " + escapeHtml(modo) : "") + "</span>" +
          "<strong>" + escapeHtml(title) + "</strong>" +
          "<span class=\"send-model-card-message\">" + escapeHtml(message) + "</span>" +
        "</button>";
      }).join("") +
      "</div>";
  }

  function toggleSendModelPicker() {
    var box = qs("sendModelPicker");
    if (!box) return;
    renderSendModelPicker();
    box.hidden = !box.hidden;
  }

  function hideSendModelPicker() {
    var box = qs("sendModelPicker");
    if (box) box.hidden = true;
  }

  function chooseSendModel(tipo) {
    if (!tipo || !qs("sendTipo")) return;
    restoreSelectValue(qs("sendTipo"), tipo);
    applyModelToSend();
    hideSendModelPicker();
  }

  function applyModelToEditor() {
    var categoria = qs("modelCategoria") && qs("modelCategoria").value;
    var tipo = qs("modelTipo") && qs("modelTipo").value;
    var modelo = exactModel(categoria, tipo);
    var fallback = modelo ? null : activeModel(categoria, "padrao");
    var option = currentModelTypeOption(categoria, tipo);
    var defaults = currentCategoryDefault(categoria);
    qs("modelTitulo").value = (modelo && modelo.titulo_padrao) || (option && option.titulo_padrao) || (fallback && fallback.titulo_padrao) || "Turbo Tiger";
    qs("modelMensagem").value = (modelo && modelo.mensagem_padrao) || (option && option.mensagem_padrao) || (fallback && fallback.mensagem_padrao) || "";
    qs("modelUsarImagem").checked = !!(modelo && modelo.usar_imagem);
    qs("modelImagemUrl").value = (modelo && modelo.imagem_url) || "";
    qs("modelCanalAndroid").value = (modelo && modelo.canal_android) || (defaults && defaults.canal_android_padrao) || "";
    qs("modelPrioridade").value = (modelo && modelo.prioridade) || (defaults && defaults.prioridade_padrao) || "alta";
    qs("modelAtivo").checked = !modelo || modelo.ativo !== false;
    updateModelImageField();
    updateModelPreview();
    renderModels();
  }

  function updateImagePreview() {
    updateModelPreview();
  }

  function updateSendImageField() {
    var field = qs("sendImagemUrlField");
    if (!field) return;
    field.hidden = !(qs("sendUsarImagem") && qs("sendUsarImagem").checked);
  }

  function updateModelImageField() {
    var field = qs("modelImagemUrlField");
    if (!field) return;
    field.hidden = !(qs("modelUsarImagem") && qs("modelUsarImagem").checked);
  }

  function updateNotificationPreview(titleId, bodyId, mediaId, imageId, title, body, useImage, imageUrl) {
    var titleEl = qs(titleId);
    var bodyEl = qs(bodyId);
    if (!titleEl || !bodyEl) return;
    var media = qs(mediaId);
    var image = qs(imageId);
    titleEl.textContent = title || "Turbo Tiger";
    bodyEl.textContent = body || "Sua mensagem aparece aqui.";
    if (media && image) {
      var showImage = useImage && /^https:\/\//i.test(imageUrl);
      media.hidden = !showImage;
      if (showImage) {
        image.src = imageUrl;
      } else {
        image.removeAttribute("src");
      }
    }
  }

  function updatePushPreview() {
    updateNotificationPreview(
      "previewTitle",
      "previewBody",
      "previewMedia",
      "previewImage",
      qs("sendTitulo") ? qs("sendTitulo").value.trim() : "",
      qs("sendMensagem") ? qs("sendMensagem").value.trim() : "",
      qs("sendUsarImagem") && qs("sendUsarImagem").checked,
      qs("sendImagemUrl") ? qs("sendImagemUrl").value.trim() : ""
    );
  }

  function updateModelPreview() {
    updateNotificationPreview(
      "modelPreviewTitle",
      "modelPreviewBody",
      "modelPreviewMedia",
      "modelPreviewImage",
      qs("modelTitulo") ? qs("modelTitulo").value.trim() : "",
      qs("modelMensagem") ? qs("modelMensagem").value.trim() : "",
      qs("modelUsarImagem") && qs("modelUsarImagem").checked,
      qs("modelImagemUrl") ? qs("modelImagemUrl").value.trim() : ""
    );
  }

  function renderMetrics() {
    var m = (state.catalogo && state.catalogo.metricas) || {};
    qs("metricUsers").textContent = m.usuarios_cadastrados || 0;
    qs("metricDevices").textContent = m.dispositivos_ativos || 0;
    qs("metricLinked").textContent = m.dispositivos_vinculados || 0;
    qs("metricOpen").textContent = m.app_aberto || 0;
    qs("metricLogged").textContent = m.usuarios_logados || 0;
  }

  function checkboxValues(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector + ":checked"))
      .map(function (input) { return input.value; })
      .filter(Boolean);
  }

  function createChoiceMarkup(items, attrName, emptyText) {
    if (!items.length) {
      return "<div class=\"status-line\">" + escapeHtml(emptyText) + "</div>";
    }
    return items.map(function (item) {
      return "<label class=\"choice-item\" data-choice-label=\"" + escapeHtml(item.search) + "\">" +
        "<input type=\"checkbox\" " + attrName + " value=\"" + escapeHtml(item.value) + "\">" +
        "<span>" + escapeHtml(item.label) + (item.detail ? "<small>" + escapeHtml(item.detail) + "</small>" : "") + "</span>" +
        "</label>";
    }).join("");
  }

  function renderDestinoOptions() {
    var box = qs("sendDestinoOptions");
    if (!box || !qs("sendDestinoTipo")) return;
    var tipo = qs("sendDestinoTipo").value;
    var title = "";
    var items = [];
    var attrName = "";
    var emptyText = "";

    if (tipo === "usuarios") {
      title = "Usu\u00e1rios";
      attrName = "data-destino-user";
      emptyText = "Nenhum usu\u00e1rio encontrado.";
      items = ((state.catalogo && state.catalogo.usuarios) || []).map(function (user) {
        var name = user.nome || user.email || user.loginuser || ("Usu\u00e1rio " + user.cod_usuario);
        var detail = ["ID " + user.cod_usuario, user.email || "", user.loginuser || ""].filter(Boolean).join(" - ");
        return {
          value: String(user.cod_usuario),
          label: name,
          detail: detail,
          search: (name + " " + detail).toLowerCase()
        };
      });
    } else if (tipo === "licenca") {
      title = "Licen\u00e7as";
      attrName = "data-destino-licenca";
      emptyText = "Nenhuma licen\u00e7a encontrada.";
      items = ((state.catalogo && state.catalogo.licencas) || []).map(function (licenca) {
        return {
          value: licenca.chave,
          label: licenca.nome || licenca.chave,
          detail: "",
          search: String((licenca.nome || "") + " " + (licenca.chave || "")).toLowerCase()
        };
      });
    } else if (tipo === "grupo") {
      title = "Grupos";
      attrName = "data-destino-grupo";
      emptyText = "Nenhum grupo encontrado.";
      items = ((state.catalogo && state.catalogo.grupos) || []).map(function (grupo) {
        return {
          value: grupo.chave || String(grupo.cod_usuario_grupo),
          label: grupo.nome || grupo.chave || ("Grupo " + grupo.cod_usuario_grupo),
          detail: grupo.chave ? ("Chave " + grupo.chave) : "",
          search: String((grupo.nome || "") + " " + (grupo.chave || "") + " " + (grupo.cod_usuario_grupo || "")).toLowerCase()
        };
      });
    }

    if (!title) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }

    box.hidden = false;
    box.innerHTML =
      "<div class=\"section-label\">" + escapeHtml(title) + "</div>" +
      "<label class=\"field choice-filter\"><input id=\"sendDestinoSearch\" type=\"search\" placeholder=\"Filtrar\"></label>" +
      "<div class=\"choice-list\">" + createChoiceMarkup(items, attrName, emptyText) + "</div>";

    var search = qs("sendDestinoSearch");
    if (search) {
      search.addEventListener("input", function () {
        var term = search.value.trim().toLowerCase();
        Array.prototype.forEach.call(box.querySelectorAll("[data-choice-label]"), function (item) {
          item.hidden = term !== "" && item.getAttribute("data-choice-label").indexOf(term) === -1;
        });
      });
    }
  }

  function selectedPlatforms() {
    var platforms = Array.prototype.slice.call(document.querySelectorAll("[data-platform]:checked"))
      .map(function (input) { return input.getAttribute("data-platform") || input.value; })
      .filter(Boolean);
    if (!platforms.length) throw new Error("informe_plataforma");
    return platforms;
  }

  function renderModels() {
    var tbody = qs("modelsTableBody");
    if (!tbody) return;
    var categoria = qs("modelCategoria") && qs("modelCategoria").value;
    var selectedTipo = qs("modelTipo") && qs("modelTipo").value;
    var rows = categoria ? modelTypeOptions(categoria) : [];
    tbody.innerHTML = "";
    if (!rows.length) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td colspan=\"5\" class=\"status-line\">Nenhuma configuracao encontrada.</td>";
      tbody.appendChild(tr);
      return;
    }
    rows.forEach(function (option) {
      var model = exactModel(categoria, option.tipo);
    var title = (model && model.titulo_padrao) || option.titulo_padrao || "";
    var priority = (model && model.prioridade) || (currentCategoryDefault(categoria) && currentCategoryDefault(categoria).prioridade_padrao) || "";
    var statusClass = model ? (model.ativo ? "ok" : "bad") : "warn";
    var statusText = model ? (model.ativo ? "Ativo" : "Inativo") : "Nao configurado";
      var modo = [option.automatico ? "Automatico" : "", option.manual ? "Manual" : ""].filter(Boolean).join(" / ");
      var tr = document.createElement("tr");
      tr.className = option.tipo === selectedTipo ? "is-selected" : "";
      tr.setAttribute("data-model-row", option.tipo);
      tr.innerHTML =
        "<td><strong>" + escapeHtml(option.nome) + "</strong><br><span class=\"status-line\">" + escapeHtml(option.tipo) + (option.descricao ? " - " + escapeHtml(option.descricao) : "") + (modo ? " - " + escapeHtml(modo) : "") + "</span></td>" +
        "<td>" + escapeHtml(title) + "</td>" +
        "<td>" + escapeHtml(priority) + "</td>" +
        "<td><span class=\"pill " + statusClass + "\">" + statusText + "</span></td>" +
        "<td><div class=\"row-actions\"><button class=\"btn btn-ghost btn-small\" type=\"button\" data-edit-model=\"" + escapeHtml(option.tipo) + "\">Editar</button></div></td>";
      tbody.appendChild(tr);
    });
  }

  function renderHistory() {
    var tbody = qs("historyTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    var rows = (state.historico && state.historico.envios) || [];
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      var statusClass = row.status === "enviado" ? "ok" : (row.status === "erro" ? "bad" : "warn");
      tr.innerHTML =
        "<td>#" + escapeHtml(row.cod_envio || "") + "</td>" +
        "<td>" + escapeHtml(row.categoria || "") + "<br><span class=\"status-line\">" + escapeHtml(row.tipo || "") + "</span></td>" +
        "<td>" + escapeHtml(row.destino_tipo || row.motivo_destino || "") + "</td>" +
        "<td><span class=\"pill " + statusClass + "\">" + escapeHtml(row.status || "") + "</span></td>" +
        "<td><strong>" + escapeHtml(row.titulo || "") + "</strong><br>" + escapeHtml(row.mensagem || "") + "</td>" +
        "<td>" + escapeHtml(formatDate(row.enviado_em || row.criado_em)) + "</td>";
      tbody.appendChild(tr);
    });
  }

  function permissionActionsFor(areaKey) {
    if (areaKey === "push") {
      return [
        { chave: "acessar", nome: "Acessar" },
        { chave: "configurar", nome: "Configurar" },
        { chave: "enviar", nome: "Enviar" },
        { chave: "broadcast", nome: "Todos aparelhos" }
      ];
    }
    if (areaKey === "admin") {
      return [
        { chave: "acessar", nome: "Acessar" },
        { chave: "usuarios", nome: "Usuarios" },
        { chave: "perfis", nome: "Perfis" },
        { chave: "areas", nome: "Areas" }
      ];
    }
    return [{ chave: "acessar", nome: "Acessar" }];
  }

  function loadPermissionEditor(permissoes) {
    var box = qs("profilePermissions");
    if (!box) return;
    var data = permissoes && typeof permissoes === "object" ? permissoes : {};
    var allowedAreas = Array.isArray(data.areas) ? data.areas : [];
    box.innerHTML = "";
    (state.admin.areas || []).forEach(function (area) {
      var areaKey = area.chave;
      var wrap = document.createElement("div");
      wrap.className = "permission-area";
      var title = document.createElement("h3");
      title.textContent = area.nome || areaKey;
      wrap.appendChild(title);
      var actions = document.createElement("div");
      actions.className = "permission-actions";
      permissionActionsFor(areaKey).forEach(function (action) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("data-perm-area", areaKey);
        input.setAttribute("data-perm-action", action.chave);
        input.checked = data[areaKey] && data[areaKey][action.chave] === true;
        if (action.chave === "acessar" && allowedAreas.indexOf(areaKey) >= 0 && data[areaKey] == null) {
          input.checked = true;
        }
        label.appendChild(input);
        label.appendChild(document.createTextNode(action.nome));
        actions.appendChild(label);
      });
      wrap.appendChild(actions);
      box.appendChild(wrap);
    });
  }

  function buildProfilePermissions() {
    var result = { areas: [] };
    Array.prototype.forEach.call(document.querySelectorAll("[data-perm-area]"), function (input) {
      var area = input.getAttribute("data-perm-area");
      var action = input.getAttribute("data-perm-action");
      if (!area || !action) return;
      if (!result[area]) result[area] = {};
      result[area][action] = input.checked === true;
      if (input.checked && result.areas.indexOf(area) === -1) {
        result.areas.push(area);
      }
    });
    result.areas.forEach(function (area) {
      if (!result[area]) result[area] = {};
      if (!result[area].acessar) result[area].acessar = true;
    });
    return result;
  }

  function activeProfiles() {
    var perfis = state.admin.perfis || [];
    var active = perfis.filter(function (perfil) { return perfil.ativo !== false; });
    return active.length ? active : perfis;
  }

  function fillAdminProfileSelect() {
    fillSelect(qs("admUserPerfil"), activeProfiles(), "chave", "nome");
  }

  function renderAdminUsers() {
    var tbody = qs("adminUsersTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    (state.admin.usuarios || []).forEach(function (user, index) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(user.email || "") + "</strong><br><span class=\"status-line\">" + escapeHtml(user.nome || "") + "</span></td>" +
        "<td>" + escapeHtml(user.perfil_nome || user.perfil_chave || "") + "</td>" +
        "<td><span class=\"pill " + (user.ativo ? "ok" : "bad") + "\">" + (user.ativo ? "Ativo" : "Inativo") + "</span></td>" +
        "<td>" + escapeHtml(formatDate(user.ultimo_login_em)) + "</td>" +
        "<td><div class=\"row-actions\"><button class=\"btn btn-ghost btn-small\" type=\"button\" data-edit-user=\"" + index + "\">Editar</button></div></td>";
      tbody.appendChild(tr);
    });
  }

  function renderAdminProfiles() {
    var tbody = qs("adminProfilesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    (state.admin.perfis || []).forEach(function (perfil, index) {
      var areas = perfil.permissoes_json && Array.isArray(perfil.permissoes_json.areas)
        ? perfil.permissoes_json.areas.join(", ")
        : "";
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(perfil.nome || "") + "</strong><br><span class=\"status-line\">" + escapeHtml(perfil.chave || "") + "</span></td>" +
        "<td>" + escapeHtml(areas) + "</td>" +
        "<td><span class=\"pill " + (perfil.ativo ? "ok" : "bad") + "\">" + (perfil.ativo ? "Ativo" : "Inativo") + "</span></td>" +
        "<td><div class=\"row-actions\"><button class=\"btn btn-ghost btn-small\" type=\"button\" data-edit-profile=\"" + index + "\">Editar</button></div></td>";
      tbody.appendChild(tr);
    });
  }

  function renderAdminAreas() {
    var tbody = qs("adminAreasTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    (state.admin.areas || []).forEach(function (area, index) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(area.nome || "") + "</strong><br><span class=\"status-line\">" + escapeHtml(area.chave || "") + "</span></td>" +
        "<td>" + escapeHtml(area.descricao || "") + "</td>" +
        "<td>" + escapeHtml(area.ordem || "") + "</td>" +
        "<td><span class=\"pill " + (area.ativo ? "ok" : "bad") + "\">" + (area.ativo ? "Ativa" : "Inativa") + "</span></td>" +
        "<td><div class=\"row-actions\"><button class=\"btn btn-ghost btn-small\" type=\"button\" data-edit-area=\"" + index + "\">Editar</button></div></td>";
      tbody.appendChild(tr);
    });
  }

  function resetAdminUserForm() {
    qs("admUserCod").value = "";
    qs("admUserEmail").value = "";
    qs("admUserNome").value = "";
    qs("admUserAtivo").checked = true;
    fillAdminProfileSelect();
  }

  function resetAdminProfileForm() {
    qs("admProfileChave").value = "";
    qs("admProfileChave").readOnly = false;
    qs("admProfileNome").value = "";
    qs("admProfileDescricao").value = "";
    qs("admProfileAtivo").checked = true;
    loadPermissionEditor({ areas: [] });
  }

  function resetAdminAreaForm() {
    qs("admAreaChave").value = "";
    qs("admAreaChave").readOnly = false;
    qs("admAreaNome").value = "";
    qs("admAreaDescricao").value = "";
    qs("admAreaOrdem").value = "100";
    qs("admAreaAtivo").checked = true;
  }

  function editAdminUser(index) {
    var user = (state.admin.usuarios || [])[index];
    if (!user) return;
    qs("admUserCod").value = user.cod_adm_usuario || "";
    qs("admUserEmail").value = user.email || "";
    qs("admUserNome").value = user.nome || "";
    qs("admUserPerfil").value = user.perfil_chave || "";
    qs("admUserAtivo").checked = user.ativo !== false;
    setStatus(qs("userStatus"), "Editando usuario.", "");
  }

  function editAdminProfile(index) {
    var perfil = (state.admin.perfis || [])[index];
    if (!perfil) return;
    qs("admProfileChave").value = perfil.chave || "";
    qs("admProfileChave").readOnly = true;
    qs("admProfileNome").value = perfil.nome || "";
    qs("admProfileDescricao").value = perfil.descricao || "";
    qs("admProfileAtivo").checked = perfil.ativo !== false;
    loadPermissionEditor(perfil.permissoes_json || {});
    setStatus(qs("profileStatus"), "Editando perfil.", "");
  }

  function editAdminArea(index) {
    var area = (state.admin.areas || [])[index];
    if (!area) return;
    qs("admAreaChave").value = area.chave || "";
    qs("admAreaChave").readOnly = true;
    qs("admAreaNome").value = area.nome || "";
    qs("admAreaDescricao").value = area.descricao || "";
    qs("admAreaOrdem").value = area.ordem || 100;
    qs("admAreaAtivo").checked = area.ativo !== false;
    setStatus(qs("areaStatus"), "Editando area.", "");
  }

  async function loadAdminData() {
    var areas = await rpc("adm_admin_areas_listar_rpc", {});
    if (!areas || areas.ok !== true) throw new Error((areas && areas.error) || "sem_permissao_areas");
    var perfis = await rpc("adm_admin_perfis_listar_rpc", {});
    if (!perfis || perfis.ok !== true) throw new Error((perfis && perfis.error) || "sem_permissao_perfis");
    var usuarios = await rpc("adm_admin_usuarios_listar_rpc", {});
    if (!usuarios || usuarios.ok !== true) throw new Error((usuarios && usuarios.error) || "sem_permissao_usuarios");
    state.admin.areas = areas.areas || [];
    state.admin.perfis = perfis.perfis || [];
    state.admin.usuarios = usuarios.usuarios || [];
    fillAdminProfileSelect();
    renderAdminUsers();
    renderAdminProfiles();
    renderAdminAreas();
    if (!qs("admProfileChave").value) loadPermissionEditor({ areas: [] });
  }

  async function saveAdminUser(event) {
    event.preventDefault();
    setBusy(qs("admUserSaveButton"), true);
    setStatus(qs("userStatus"), "Salvando", "");
    try {
      var data = await rpc("adm_admin_usuario_salvar_rpc", {
        p_cod_adm_usuario: qs("admUserCod").value ? Number(qs("admUserCod").value) : null,
        p_email: qs("admUserEmail").value.trim(),
        p_uid_usuario: null,
        p_nome: qs("admUserNome").value.trim(),
        p_perfil_chave: qs("admUserPerfil").value,
        p_ativo: qs("admUserAtivo").checked
      });
      if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel salvar o usuario.");
      setStatus(qs("userStatus"), "Usuario salvo.", "ok");
      resetAdminUserForm();
      await loadAdminData();
    } catch (error) {
      setStatus(qs("userStatus"), error.message || String(error), "error");
    } finally {
      setBusy(qs("admUserSaveButton"), false);
    }
  }

  async function saveAdminProfile(event) {
    event.preventDefault();
    setBusy(qs("admProfileSaveButton"), true);
    setStatus(qs("profileStatus"), "Salvando", "");
    try {
      var data = await rpc("adm_admin_perfil_salvar_rpc", {
        p_chave: qs("admProfileChave").value.trim(),
        p_nome: qs("admProfileNome").value.trim(),
        p_descricao: qs("admProfileDescricao").value.trim(),
        p_permissoes_json: buildProfilePermissions(),
        p_ativo: qs("admProfileAtivo").checked
      });
      if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel salvar o perfil.");
      setStatus(qs("profileStatus"), "Perfil salvo.", "ok");
      resetAdminProfileForm();
      await loadAdminData();
    } catch (error) {
      setStatus(qs("profileStatus"), error.message || String(error), "error");
    } finally {
      setBusy(qs("admProfileSaveButton"), false);
    }
  }

  async function saveAdminArea(event) {
    event.preventDefault();
    setBusy(qs("admAreaSaveButton"), true);
    setStatus(qs("areaStatus"), "Salvando", "");
    try {
      var ordem = Number(qs("admAreaOrdem").value || 100);
      var data = await rpc("adm_admin_area_salvar_rpc", {
        p_chave: qs("admAreaChave").value.trim(),
        p_nome: qs("admAreaNome").value.trim(),
        p_descricao: qs("admAreaDescricao").value.trim(),
        p_ativo: qs("admAreaAtivo").checked,
        p_ordem: Number.isFinite(ordem) ? Math.trunc(ordem) : 100
      });
      if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel salvar a area.");
      setStatus(qs("areaStatus"), "Area salva.", "ok");
      resetAdminAreaForm();
      await loadAdminData();
    } catch (error) {
      setStatus(qs("areaStatus"), error.message || String(error), "error");
    } finally {
      setBusy(qs("admAreaSaveButton"), false);
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildDestino() {
    var tipo = qs("sendDestinoTipo").value;
    if (tipo === "usuarios") {
      var ids = checkboxValues("[data-destino-user]").map(function (value) { return Number(value); })
        .filter(function (value) { return Number.isFinite(value) && value > 0; })
        .map(function (value) { return Math.trunc(value); });
      if (!ids.length) throw new Error("informe_usuarios");
      return { tipo: "usuarios", id_usuarios: ids };
    }
    if (tipo === "licenca") {
      var licencas = checkboxValues("[data-destino-licenca]");
      if (!licencas.length) throw new Error("informe_licencas");
      return { tipo: "licenca", licencas: licencas };
    }
    if (tipo === "grupo") {
      var grupos = checkboxValues("[data-destino-grupo]");
      if (!grupos.length) throw new Error("informe_grupos");
      return { tipo: "grupo", grupos: grupos };
    }
    return { tipo: tipo };
  }

  async function loadCatalog() {
    var sendCategoria = qs("sendCategoria") && qs("sendCategoria").value;
    var sendTipo = qs("sendTipo") && qs("sendTipo").value;
    var sendDestinoTipo = qs("sendDestinoTipo") && qs("sendDestinoTipo").value;
    var modelCategoria = qs("modelCategoria") && qs("modelCategoria").value;
    var modelTipo = qs("modelTipo") && qs("modelTipo").value;
    state.catalogo = await rpc("adm_push_catalogo_rpc", {});
    if (!state.catalogo || state.catalogo.ok !== true) {
      throw new Error((state.catalogo && state.catalogo.error) || "catalogo_indisponivel");
    }
    var categorias = state.catalogo.categorias || [];
    fillSelect(qs("sendCategoria"), categorias, "chave", "nome");
    fillSelect(qs("modelCategoria"), categorias, "chave", "nome");
    fillSelect(qs("sendDestinoTipo"), state.catalogo.destinos || [], "tipo", "nome");
    restoreSelectValue(qs("sendCategoria"), sendCategoria);
    restoreSelectValue(qs("sendDestinoTipo"), sendDestinoTipo);
    restoreSelectValue(qs("modelCategoria"), modelCategoria);
    fillSendTypeSelect(sendTipo);
    fillModelTypeSelect(modelTipo);
    renderDestinoOptions();
    renderMetrics();
    renderModels();
    renderSendModelPicker();
    applyModelToSend();
    applyModelToEditor();
  }

  async function loadHistory() {
    state.historico = await rpc("adm_push_historico_rpc", { p_limite: 40 });
    if (!state.historico || state.historico.ok !== true) {
      throw new Error((state.historico && state.historico.error) || "historico_indisponivel");
    }
    renderHistory();
  }

  async function sendPush(event) {
    event.preventDefault();
    var button = qs("sendButton");
    var result = qs("sendResult");
    setBusy(button, true);
    result.textContent = "Enviando...";
    try {
      var destino = buildDestino();
      var plataformas = selectedPlatforms();
      destino.plataformas = plataformas;
      var limit = Number(qs("sendLimit").value || 200);
      var payload = {
        categoria: qs("sendCategoria").value,
        tipo: qs("sendTipo").value,
        titulo: qs("sendTitulo").value,
        mensagem: qs("sendMensagem").value,
        usar_imagem: qs("sendUsarImagem").checked,
        imagem_url: qs("sendImagemUrl").value.trim(),
        prioridade: qs("sendPrioridade").value,
        destino: destino,
        limit: Number.isFinite(limit) ? limit : 200,
        dry_run: qs("sendDryRun").checked,
        data: {
          origem: "adm_push",
          source: "adm_push",
          escopo_privacidade: qs("sendPrivacidade").value,
          destino_tipo: destino.tipo,
          plataformas: plataformas.join(",")
        }
      };
      var session = await refreshSessionIfNeeded();
      if (!session) throw new Error("sessao_expirada");
      var response = await fetch(CONFIG.supabaseUrl + "/functions/v1/push-geral", {
        method: "POST",
        headers: authHeaders(session.access_token),
        body: JSON.stringify(payload)
      });
      var data = await parseResponse(response);
      result.textContent = responseMessage(data);
      await loadHistory();
      await loadCatalog();
    } catch (error) {
      result.textContent = friendlyMessage(error.message || String(error));
    } finally {
      setBusy(button, false);
    }
  }

  async function saveModel(event) {
    event.preventDefault();
    var button = qs("modelSaveButton");
    setBusy(button, true);
    setStatus(qs("modelStatus"), "Salvando", "");
    try {
      var data = await rpc("adm_push_modelo_salvar_rpc", {
        p_categoria: qs("modelCategoria").value,
        p_tipo: qs("modelTipo").value,
        p_titulo_padrao: qs("modelTitulo").value,
        p_mensagem_padrao: qs("modelMensagem").value,
        p_usar_imagem: qs("modelUsarImagem").checked,
        p_imagem_url: qs("modelImagemUrl").value.trim(),
        p_prioridade: qs("modelPrioridade").value,
        p_canal_android: qs("modelCanalAndroid").value.trim(),
        p_ativo: qs("modelAtivo").checked
      });
      if (!data || data.ok !== true) throw new Error((data && data.error) || "modelo_nao_salvo");
      setStatus(qs("modelStatus"), "Salvo", "ok");
      await loadCatalog();
    } catch (error) {
      setStatus(qs("modelStatus"), error.message || String(error), "error");
    } finally {
      setBusy(button, false);
    }
  }

  function editModelType(tipo) {
    if (!tipo || !qs("modelTipo")) return;
    restoreSelectValue(qs("modelTipo"), tipo);
    applyModelToEditor();
    if (qs("modelTitulo")) qs("modelTitulo").focus();
  }

  function setupTabs() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-tab]"), function (button) {
      button.addEventListener("click", function () {
        var tab = button.getAttribute("data-tab");
        Array.prototype.forEach.call(document.querySelectorAll("[data-tab]"), function (item) {
          item.classList.toggle("is-active", item === button);
        });
        Array.prototype.forEach.call(document.querySelectorAll("[data-panel]"), function (panel) {
          panel.hidden = panel.getAttribute("data-panel") !== tab;
        });
      });
    });
  }

  async function initLogin() {
    state.session = readSession();
    if (state.session && state.session.access_token) {
      try {
        var contexto = await rpc("adm_contexto_rpc", {});
        if (contexto && contexto.ok === true && Array.isArray(contexto.areas) && contexto.areas.indexOf("admin") >= 0) {
          window.location.href = "admin/";
          return;
        }
        if (contexto && contexto.ok === true && Array.isArray(contexto.areas) && contexto.areas.indexOf("push") >= 0) {
          window.location.href = "push/";
          return;
        }
      } catch (error) {
        clearSession();
      }
    }

    var form = qs("adminLoginForm");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var button = qs("loginButton");
      setBusy(button, true);
      setStatus(qs("loginStatus"), "Entrando", "");
      try {
        var session = await login(qs("loginEmail").value.trim(), qs("loginPassword").value);
        saveSession(session);
        var contexto = await rpc("adm_contexto_rpc", {});
        if (!contexto || contexto.ok !== true) {
          clearSession();
          throw new Error((contexto && contexto.error) || "sem_permissao_admin");
        }
        if (!Array.isArray(contexto.areas) || (contexto.areas.indexOf("push") === -1 && contexto.areas.indexOf("admin") === -1)) {
          clearSession();
          throw new Error("sem_permissao_admin");
        }
        window.location.href = contexto.areas.indexOf("admin") >= 0 ? "admin/" : "push/";
      } catch (error) {
        setStatus(qs("loginStatus"), error.message || String(error), "error");
      } finally {
        setBusy(button, false);
      }
    });
  }

  async function initPush() {
    setupTabs();
    qs("logoutButton").addEventListener("click", function () {
      clearSession();
      window.location.href = "../";
    });
    qs("switchAccountButton").addEventListener("click", function () {
      clearSession();
      window.location.href = "../";
    });
    qs("reloadButton").addEventListener("click", async function () {
      await bootPush();
    });
    qs("historyReloadButton").addEventListener("click", async function () {
      await loadHistory();
    });
    qs("modelReloadButton").addEventListener("click", async function () {
      await loadCatalog();
    });
    qs("fillFromModelButton").addEventListener("click", toggleSendModelPicker);
    qs("pushSendForm").addEventListener("submit", sendPush);
    qs("pushModelForm").addEventListener("submit", saveModel);
    qs("sendCategoria").addEventListener("change", function () {
      fillSendTypeSelect("manual");
      hideSendModelPicker();
      renderSendModelPicker();
      applyModelToSend();
    });
    qs("sendTipo").addEventListener("change", function () {
      applyModelToSend();
      renderSendModelPicker();
    });
    qs("sendDestinoTipo").addEventListener("change", renderDestinoOptions);
    qs("sendTitulo").addEventListener("input", updatePushPreview);
    qs("sendMensagem").addEventListener("input", updatePushPreview);
    qs("sendImagemUrl").addEventListener("input", updatePushPreview);
    qs("sendUsarImagem").addEventListener("change", function () {
      updateSendImageField();
      updatePushPreview();
    });
    qs("modelCategoria").addEventListener("change", function () {
      fillModelTypeSelect("padrao");
      applyModelToEditor();
    });
    qs("modelTipo").addEventListener("change", applyModelToEditor);
    qs("modelTitulo").addEventListener("input", updateModelPreview);
    qs("modelMensagem").addEventListener("input", updateModelPreview);
    qs("modelImagemUrl").addEventListener("input", updateImagePreview);
    qs("modelUsarImagem").addEventListener("change", function () {
      updateModelImageField();
      updateImagePreview();
    });
    qs("modelsTableBody").addEventListener("click", function (event) {
      var target = event.target.closest("[data-edit-model], [data-model-row]");
      if (!target) return;
      editModelType(target.getAttribute("data-edit-model") || target.getAttribute("data-model-row"));
    });
    qs("sendModelPicker").addEventListener("click", function (event) {
      var target = event.target.closest("[data-send-model]");
      if (!target) return;
      chooseSendModel(target.getAttribute("data-send-model"));
    });
    await bootPush();
  }

  async function initAdmin() {
    setupTabs();
    qs("logoutButton").addEventListener("click", function () {
      clearSession();
      window.location.href = "../";
    });
    qs("switchAccountButton").addEventListener("click", function () {
      clearSession();
      window.location.href = "../";
    });
    qs("reloadButton").addEventListener("click", async function () {
      await bootAdmin();
    });
    qs("adminUserForm").addEventListener("submit", saveAdminUser);
    qs("adminProfileForm").addEventListener("submit", saveAdminProfile);
    qs("adminAreaForm").addEventListener("submit", saveAdminArea);
    qs("admUserNewButton").addEventListener("click", function () {
      resetAdminUserForm();
      setStatus(qs("userStatus"), "", "");
    });
    qs("admProfileNewButton").addEventListener("click", function () {
      resetAdminProfileForm();
      setStatus(qs("profileStatus"), "", "");
    });
    qs("admAreaNewButton").addEventListener("click", function () {
      resetAdminAreaForm();
      setStatus(qs("areaStatus"), "", "");
    });
    qs("adminUsersTableBody").addEventListener("click", function (event) {
      var button = event.target.closest("[data-edit-user]");
      if (button) editAdminUser(Number(button.getAttribute("data-edit-user")));
    });
    qs("adminProfilesTableBody").addEventListener("click", function (event) {
      var button = event.target.closest("[data-edit-profile]");
      if (button) editAdminProfile(Number(button.getAttribute("data-edit-profile")));
    });
    qs("adminAreasTableBody").addEventListener("click", function (event) {
      var button = event.target.closest("[data-edit-area]");
      if (button) editAdminArea(Number(button.getAttribute("data-edit-area")));
    });
    await bootAdmin();
  }

  async function bootPush() {
    setStatus(qs("pageStatus"), "Carregando", "");
    try {
      var contexto = await ensureAdmin("push");
      if (!contexto) return;
      var nome = (contexto.usuario && (contexto.usuario.nome || contexto.usuario.email)) || "Turbo Tiger";
      qs("adminIdentity").textContent = nome;
      await loadCatalog();
      await loadHistory();
      setStatus(qs("pageStatus"), "Online", "ok");
    } catch (error) {
      setStatus(qs("pageStatus"), error.message || String(error), "error");
    }
  }

  async function bootAdmin() {
    setStatus(qs("pageStatus"), "Carregando", "");
    try {
      var contexto = await ensureAdmin("admin");
      if (!contexto) return;
      var nome = (contexto.usuario && (contexto.usuario.nome || contexto.usuario.email)) || "Turbo Tiger";
      qs("adminIdentity").textContent = nome;
      await loadAdminData();
      setStatus(qs("pageStatus"), "Online", "ok");
    } catch (error) {
      setStatus(qs("pageStatus"), error.message || String(error), "error");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-admin-page");
    if (page === "login") {
      initLogin();
    } else if (page === "push") {
      initPush();
    } else if (page === "admin") {
      initAdmin();
    }
  });
})();
