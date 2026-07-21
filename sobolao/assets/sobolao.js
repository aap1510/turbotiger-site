(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    sessionKey: "tt_admin_session_v1",
    roleKey: "tt_sobolao_role_v1"
  };

  var state = {
    session: null,
    contexto: null,
    role: "usuario",
    demo: false,
    data: null,
    activeTab: "visao",
    slip: {
      bolaoId: null,
      selected: []
    }
  };

  var LOTTERY_RULES = {
    mega_sena: { min: 1, max: 60, qty: 6, nome: "Mega-Sena" },
    lotofacil: { min: 1, max: 25, qty: 15, nome: "Lotofacil" },
    quina: { min: 1, max: 80, qty: 5, nome: "Quina" }
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function qsa(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function numberValue(value, fallback) {
    var n = Number(value);
    return Number.isFinite(n) ? n : (fallback || 0);
  }

  function intValue(value, fallback) {
    return Math.trunc(numberValue(value, fallback));
  }

  function moneyFromCents(value) {
    return (numberValue(value) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function compactNumber(value) {
    return intValue(value).toLocaleString("pt-BR");
  }

  function pct(value) {
    return numberValue(value).toLocaleString("pt-BR", {
      minimumFractionDigits: numberValue(value) % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 2
    }) + "%";
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatDateTime(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDateInput(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function formatDateTimeInput(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    var local = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return local.toISOString().slice(0, 16);
  }

  function friendlyMessage(value) {
    var raw = String(value == null ? "" : value).trim();
    var map = {
      "Email not confirmed": "Confirme seu e-mail antes de entrar.",
      "Failed to fetch": "Falha de conexao. Verifique sua internet e tente novamente.",
      "Invalid login credentials": "E-mail ou senha invalidos.",
      "invalid_grant": "E-mail ou senha invalidos.",
      "missing_authorization": "Sessao expirada. Entre novamente.",
      "nao_autenticado": "Entre para continuar.",
      "sem_permissao_admin": "Sem permissao administrativa.",
      "sem_permissao_sobolao": "Sem permissao para acessar o So Bolao.",
      "sessao_expirada": "Sessao expirada. Entre novamente.",
      "bolao_indisponivel": "Bolao indisponivel para reserva.",
      "cotas_insuficientes": "Nao ha cotas suficientes nesse bolao.",
      "dados_obrigatorios": "Preencha os campos obrigatorios.",
      "palpite_incompleto": "Complete a cartela do palpite antes de reservar."
    };
    return map[raw] || map[raw.toLowerCase()] || raw;
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = friendlyMessage(text || "");
    el.classList.remove("is-error", "is-ok");
    if (kind) el.classList.add(kind === "ok" ? "is-ok" : "is-error");
  }

  function setBusy(button, busy) {
    if (button) button.disabled = !!busy;
  }

  function pill(status) {
    var value = String(status || "").toLowerCase();
    var cls = value === "ativo" || value === "ativa" || value === "ok" || value === "aberto" || value === "pago" || value === "confirmado" || value === "apurado" ? "ok" :
      (value === "pendente" || value === "reservado" || value === "fechando" || value === "registrado" || value === "analise" || value === "rascunho" ? "warn" : "bad");
    return "<span class=\"sb-pill " + cls + "\">" + escapeHtml(status || "pendente") + "</span>";
  }

  function parseNumbers(value) {
    return String(value || "")
      .split(/[\s,;.-]+/g)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function centsFromInput(value) {
    return Math.round(numberValue(String(value || "0").replace(",", ".")) * 100);
  }

  function normalizeNumbers(value) {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.numeros)) return value.numeros;
    return parseNumbers(value);
  }

  function normalizeKey(value) {
    var raw = String(value || "").toLowerCase();
    if (typeof raw.normalize === "function") raw = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return raw.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function padNumber(value) {
    return String(Math.max(0, intValue(value))).padStart(2, "0");
  }

  function ruleForBolao(bolao) {
    var key = normalizeKey(bolao && (bolao.modalidade_chave || bolao.modalidade));
    return LOTTERY_RULES[key] || LOTTERY_RULES.mega_sena;
  }

  function currentBolao() {
    var select = qs("joinBolao");
    var id = select ? select.value : "";
    return (state.data && state.data.boloes ? state.data.boloes : []).find(function (bolao) {
      return String(bolao.cod_bolao) === String(id);
    }) || null;
  }

  function selectedSlipNumbers() {
    return state.slip.selected.slice().sort(function (a, b) { return a - b; }).map(padNumber);
  }

  function updateSlipHidden() {
    var input = qs("joinNumeros");
    if (input) input.value = selectedSlipNumbers().join(", ");
  }

  function setSlipNumbers(numbers) {
    var bolao = currentBolao();
    var rule = ruleForBolao(bolao);
    var seen = {};
    state.slip.selected = normalizeNumbers(numbers).map(function (item) {
      return intValue(item);
    }).filter(function (num) {
      if (num < rule.min || num > rule.max || seen[num]) return false;
      seen[num] = true;
      return true;
    }).slice(0, rule.qty);
    renderSlip();
  }

  function clearSlip() {
    state.slip.selected = [];
    renderSlip();
  }

  function randomSlip() {
    var bolao = currentBolao();
    if (!bolao) return;
    var rule = ruleForBolao(bolao);
    var pool = [];
    var i;
    for (i = rule.min; i <= rule.max; i += 1) pool.push(i);
    for (i = pool.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    setSlipNumbers(pool.slice(0, rule.qty));
  }

  function toggleSlipNumber(value) {
    var bolao = currentBolao();
    if (!bolao) return;
    var rule = ruleForBolao(bolao);
    var num = intValue(value);
    var index = state.slip.selected.indexOf(num);
    if (index >= 0) {
      state.slip.selected.splice(index, 1);
    } else if (state.slip.selected.length < rule.qty) {
      state.slip.selected.push(num);
    }
    renderSlip();
  }

  function syncSlipWithSelectedBolao() {
    var bolao = currentBolao();
    var id = bolao ? String(bolao.cod_bolao) : null;
    if (state.slip.bolaoId !== id) {
      state.slip.bolaoId = id;
      state.slip.selected = [];
    }
    renderSlip();
  }

  function renderSlip() {
    var grid = qs("slipNumberGrid");
    if (!grid) return;
    var bolao = currentBolao();
    if (!bolao) {
      state.slip.selected = [];
      updateSlipHidden();
      qs("slipMode").textContent = "Escolha manual";
      qs("slipCounter").textContent = "0/0 numeros";
      qs("slipHint").textContent = "Selecione um bolao primeiro.";
      qs("slipSubtitle").textContent = "Selecione um bolao para montar a cartela.";
      qs("slipSelected").innerHTML = "<span class=\"sb-status\">Nenhum bolao selecionado.</span>";
      grid.innerHTML = "";
      return;
    }

    var rule = ruleForBolao(bolao);
    var selected = selectedSlipNumbers();
    var selectedLookup = {};
    selected.forEach(function (num) { selectedLookup[num] = true; });
    var full = selected.length >= rule.qty;
    updateSlipHidden();
    qs("slipMode").textContent = rule.nome;
    qs("slipCounter").textContent = selected.length + "/" + rule.qty + " numeros";
    qs("slipHint").textContent = full ? "Cartela completa." : "Marque " + (rule.qty - selected.length) + " numero(s).";
    qs("slipSubtitle").textContent = (bolao.titulo || rule.nome) + " #" + (bolao.concurso || "") + " - marque " + rule.qty + " numeros.";
    qs("slipSelected").innerHTML = selected.length ? selected.map(function (num) {
      return "<span class=\"sb-ball\">" + escapeHtml(num) + "</span>";
    }).join("") : "<span class=\"sb-status\">Nenhum numero marcado.</span>";

    var buttons = [];
    for (var i = rule.min; i <= rule.max; i += 1) {
      var label = padNumber(i);
      var isSelected = !!selectedLookup[label];
      var locked = full && !isSelected;
      buttons.push("<button class=\"sb-number-button" + (isSelected ? " is-selected" : "") + (locked ? " is-locked" : "") + "\" type=\"button\" data-slip-number=\"" + i + "\" aria-pressed=\"" + (isSelected ? "true" : "false") + "\"" + (locked ? " disabled" : "") + ">" + label + "</button>");
    }
    grid.innerHTML = buttons.join("");
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
    state.contexto = null;
    localStorage.removeItem(CONFIG.sessionKey);
  }

  function readRole() {
    try {
      var urlRole = new URLSearchParams(window.location.search).get("role");
      if (["usuario", "admin", "suporte", "loterica"].indexOf(urlRole) >= 0) {
        localStorage.setItem(CONFIG.roleKey, urlRole);
        return urlRole;
      }
      return localStorage.getItem(CONFIG.roleKey) || "usuario";
    } catch (error) {
      return "usuario";
    }
  }

  function saveRole(role) {
    state.role = role || "usuario";
    try {
      localStorage.setItem(CONFIG.roleKey, state.role);
    } catch (error) {}
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
      var message = (data && (data.error_description || data.message || data.error || data.details)) || "falha_http_" + response.status;
      throw new Error(message);
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

  async function optionalRpc(name, payload) {
    try {
      return await rpc(name, payload);
    } catch (error) {
      state.demo = true;
      return null;
    }
  }

  function todayPlus(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  function demoData(role) {
    var boloes = [
      {
        cod_bolao: 501,
        titulo: "Mega-Sena Virada Controlada",
        modalidade: "Mega-Sena",
        modalidade_chave: "mega_sena",
        concurso: 2921,
        data_sorteio: todayPlus(2),
        data_limite: todayPlus(1),
        loterica: "Loterica Centro TT",
        qtd_cotas: 180,
        cotas_reservadas: 128,
        valor_aposta_cota_centavos: 600,
        taxa_gestao_percentual: 10,
        valor_total_cota_centavos: 660,
        status: "aberto",
        numeros: ["05", "11", "23", "32", "44", "56"],
        comprovante_url: ""
      },
      {
        cod_bolao: 502,
        titulo: "Lotofacil Disciplina",
        modalidade: "Lotofacil",
        modalidade_chave: "lotofacil",
        concurso: 3440,
        data_sorteio: todayPlus(1),
        data_limite: todayPlus(1),
        loterica: "Loterica Premium Sul",
        qtd_cotas: 90,
        cotas_reservadas: 82,
        valor_aposta_cota_centavos: 350,
        taxa_gestao_percentual: 10,
        valor_total_cota_centavos: 385,
        status: "fechando",
        numeros: ["01", "02", "04", "05", "07", "09", "10", "12", "13", "15", "17", "18", "20", "21", "24"],
        comprovante_url: ""
      },
      {
        cod_bolao: 503,
        titulo: "Quina Recorrente",
        modalidade: "Quina",
        modalidade_chave: "quina",
        concurso: 6788,
        data_sorteio: todayPlus(3),
        data_limite: todayPlus(2),
        loterica: "Loterica Jardim",
        qtd_cotas: 120,
        cotas_reservadas: 39,
        valor_aposta_cota_centavos: 300,
        taxa_gestao_percentual: 10,
        valor_total_cota_centavos: 330,
        status: "aberto",
        numeros: ["08", "19", "37", "52", "71"],
        comprovante_url: ""
      }
    ];

    var minhas = [
      {
        cod_participacao: 9001,
        bolao: "Mega-Sena Virada Controlada",
        modalidade: "Mega-Sena",
        concurso: 2921,
        cotas: 2,
        valor_total_centavos: 1320,
        status: "pago",
        palpite_numeros: ["05", "11", "23", "32", "44", "56"],
        documento_url: "",
        data_sorteio: todayPlus(2)
      },
      {
        cod_participacao: 9002,
        bolao: "Lotofacil Disciplina",
        modalidade: "Lotofacil",
        concurso: 3440,
        cotas: 1,
        valor_total_centavos: 385,
        status: "reservado",
        palpite_numeros: ["01", "02", "04", "05", "07", "09", "10", "12", "13", "15", "17", "18", "20", "21", "24"],
        documento_url: "",
        data_sorteio: todayPlus(1)
      }
    ];

    var resultados = [
      { modalidade: "Mega-Sena", concurso: 2920, data_sorteio: todayPlus(-1), numeros: ["03", "14", "29", "36", "47", "58"], status: "apurado", premio_estimado_centavos: 6500000000 },
      { modalidade: "Lotofacil", concurso: 3439, data_sorteio: todayPlus(-1), numeros: ["01", "02", "03", "05", "06", "08", "10", "11", "13", "14", "17", "19", "20", "23", "25"], status: "apurado", premio_estimado_centavos: 180000000 },
      { modalidade: "Quina", concurso: 6787, data_sorteio: todayPlus(-1), numeros: ["09", "26", "44", "61", "74"], status: "apurado", premio_estimado_centavos: 84000000 }
    ];

    var lotericas = [
      { cod_loterica: 301, nome: "Loterica Centro TT", cnpj: "00000000000191", cidade: "Sao Paulo", uf: "SP", whatsapp: "11999990000", status: "ativa", boloes_ativos: 4, repasse_pendente_centavos: 184500 },
      { cod_loterica: 302, nome: "Loterica Premium Sul", cnpj: "00000000000272", cidade: "Curitiba", uf: "PR", whatsapp: "41999990000", status: "ativa", boloes_ativos: 2, repasse_pendente_centavos: 73150 },
      { cod_loterica: 303, nome: "Loterica Jardim", cnpj: "00000000000353", cidade: "Belo Horizonte", uf: "MG", whatsapp: "31999990000", status: "analise", boloes_ativos: 1, repasse_pendente_centavos: 11700 }
    ];

    return {
      resumo: {
        boloes_ativos: role === "usuario" ? 3 : 7,
        cotas_reservadas: role === "usuario" ? 3 : 249,
        premios_centavos: role === "usuario" ? 0 : 2830000,
        gestao_centavos: role === "usuario" ? 171 : 26935,
        parceiras: lotericas.length,
        pendencias: role === "usuario" ? 1 : 14,
        taxa_gestao_percentual: 10,
        conversao_alvo_percentual: 30,
        apostas_media_mes: 4,
        ticket_oficial_centavos: 600
      },
      fluxo: [
        { titulo: "Formacao", texto: "Bolao aberto com cotas, modalidade, concurso e limite definidos." },
        { titulo: "Reserva", texto: "Participante registra cota e pagamento fica rastreavel." },
        { titulo: "Repasse", texto: "Valor oficial segue para a loterica parceira; taxa fica separada." },
        { titulo: "Documento", texto: "Comprovante da aposta e auditoria ficam vinculados ao bolao." },
        { titulo: "Apuracao", texto: "Resultado, premio e rateio proporcional sao registrados." }
      ],
      modalidades: [
        { chave: "mega_sena", nome: "Mega-Sena" },
        { chave: "lotofacil", nome: "Lotofacil" },
        { chave: "quina", nome: "Quina" }
      ],
      boloes: boloes,
      minhas_participacoes: minhas,
      resultados: resultados,
      premios: [
        { bolao: "Mega-Sena Virada Controlada", faixa: "Sena", total_centavos: 0, minha_parte_centavos: 0, status: "aguardando" },
        { bolao: "Lotofacil Disciplina", faixa: "14 acertos", total_centavos: 128000, minha_parte_centavos: 1422, status: "apurando" }
      ],
      lotericas: lotericas,
      fila_loterica: [
        { bolao: "Mega-Sena Virada Controlada", repasse_centavos: 76800, comprovante_url: "", status: "aguardando_comprovante" },
        { bolao: "Lotofacil Disciplina", repasse_centavos: 28700, comprovante_url: "", status: "registrado" }
      ],
      chamados: [
        { cod_chamado: 71, assunto: "Conferencia de comprovante", status: "aberto", prioridade: "media", atualizado_em: todayPlus(0) },
        { cod_chamado: 72, assunto: "Duvida sobre rateio", status: "respondido", prioridade: "baixa", atualizado_em: todayPlus(-1) }
      ],
      fila_admin: [
        { id: 1, tipo: "bolao", titulo: "Conferir comprovante Mega-Sena", responsavel: "Admin", valor_centavos: 76800, status: "pendente" },
        { id: 2, tipo: "loterica", titulo: "Validar Loterica Jardim", responsavel: "Suporte", valor_centavos: 0, status: "analise" },
        { id: 3, tipo: "premio", titulo: "Rateio Lotofacil Disciplina", responsavel: "Financeiro", valor_centavos: 128000, status: "apurando" }
      ]
    };
  }

  function normalizeData(data, role) {
    var base = demoData(role);
    if (!data || data.ok === false) return base;
    return {
      resumo: Object.assign({}, base.resumo, data.resumo || data.metricas || {}),
      fluxo: data.fluxo || data.esteira || base.fluxo,
      modalidades: data.modalidades || base.modalidades,
      boloes: data.boloes || data.boloes_disponiveis || base.boloes,
      minhas_participacoes: data.minhas_participacoes || data.participacoes || base.minhas_participacoes,
      resultados: data.resultados || data.concursos || base.resultados,
      premios: data.premios || data.rateios || base.premios,
      lotericas: data.lotericas || data.parceiras || base.lotericas,
      fila_loterica: data.fila_loterica || data.repasses || base.fila_loterica,
      chamados: data.chamados || data.suporte || base.chamados,
      fila_admin: data.fila_admin || data.operacao || base.fila_admin
    };
  }

  async function loadContext() {
    try {
      var contexto = await rpc("adm_contexto_rpc", {});
      if (contexto && contexto.ok === true) {
        state.contexto = contexto;
        return contexto;
      }
    } catch (error) {}
    state.contexto = null;
    return null;
  }

  function hasAdminAccess(role) {
    if (role === "usuario" || role === "loterica") return true;
    var contexto = state.contexto || {};
    var areas = contexto.areas || [];
    var perfil = contexto.perfil && contexto.perfil.chave;
    if (perfil === "super_admin") return true;
    if (areas.indexOf("sobolao") >= 0) return true;
    if (role === "admin" && areas.indexOf("admin") >= 0) return true;
    if (role === "suporte" && (areas.indexOf("admin") >= 0 || areas.indexOf("push") >= 0)) return true;
    return false;
  }

  async function loadData() {
    state.demo = false;
    var data = null;
    if (state.role === "usuario") {
      data = await optionalRpc("sobolao_usuario_painel_rpc", {});
    } else if (state.role === "loterica") {
      data = await optionalRpc("sobolao_loterica_painel_rpc", {});
    } else {
      data = await optionalRpc("adm_sobolao_painel_rpc", { p_periodo: null });
    }
    state.data = normalizeData(data, state.role);
  }

  function showLogin(show) {
    qs("loginPanel").hidden = !show;
    qs("sobolaoApp").hidden = !!show;
  }

  function applyRoleButtons() {
    qsa("[data-role]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-role") === state.role);
    });
    if (qs("loginRole")) qs("loginRole").value = state.role;
  }

  function allowedTabsForRole() {
    qsa("[data-tab]").forEach(function (button) {
      var access = String(button.getAttribute("data-access") || "").split(/\s+/);
      var allowed = access.indexOf(state.role) >= 0;
      button.hidden = !allowed;
    });
    var active = document.querySelector("[data-tab].is-active");
    if (!active || active.hidden) {
      var first = qsa("[data-tab]").find(function (button) { return !button.hidden; });
      if (first) activateTab(first.getAttribute("data-tab"));
    } else {
      activateTab(active.getAttribute("data-tab"));
    }
  }

  function activateTab(tab) {
    state.activeTab = tab || "visao";
    qsa("[data-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-tab") === state.activeTab);
    });
    qsa("[data-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== state.activeTab;
    });
  }

  function renderMetrics() {
    var r = state.data.resumo || {};
    qs("metricBoloes").textContent = compactNumber(r.boloes_ativos);
    qs("metricCotas").textContent = compactNumber(r.cotas_reservadas);
    qs("metricPremios").textContent = moneyFromCents(r.premios_centavos);
    qs("metricGestao").textContent = moneyFromCents(r.gestao_centavos);
    qs("metricParceiras").textContent = compactNumber(r.parceiras);
    qs("metricPendencias").textContent = compactNumber(r.pendencias);
    qs("summaryTaxa").textContent = pct(r.taxa_gestao_percentual);
    qs("summaryConversao").textContent = pct(r.conversao_alvo_percentual);
    qs("summaryApostasMes").textContent = compactNumber(r.apostas_media_mes) + "/mes";
    qs("summaryTicket").textContent = moneyFromCents(r.ticket_oficial_centavos);
  }

  function renderSummary() {
    qs("operationFlow").innerHTML = (state.data.fluxo || []).map(function (item, index) {
      return "<div class=\"sb-flow-item\">" +
        "<span class=\"sb-flow-index\">" + String(index + 1).padStart(2, "0") + "</span>" +
        "<div><strong>" + escapeHtml(item.titulo) + "</strong><span>" + escapeHtml(item.texto) + "</span></div>" +
      "</div>";
    }).join("");

    qs("nextDraws").innerHTML = (state.data.boloes || []).slice(0, 4).map(function (bolao) {
      return "<div class=\"sb-draw\">" +
        "<div><strong>" + escapeHtml(bolao.modalidade || "") + " #" + escapeHtml(bolao.concurso || "") + "</strong>" +
        "<div class=\"sb-draw-meta\">" + escapeHtml(bolao.titulo || "") + " - " + formatDate(bolao.data_sorteio) + "</div></div>" +
        renderBalls(bolao.numeros) +
      "</div>";
    }).join("") || empty("Nenhum concurso na fila.");
  }

  function renderBalls(numbers) {
    var list = normalizeNumbers(numbers).slice(0, 15);
    if (!list.length) return "<div class=\"sb-draw-balls\"><span class=\"sb-status\">Aguardando registro</span></div>";
    return "<div class=\"sb-draw-balls\">" + list.map(function (num) {
      return "<span class=\"sb-ball\">" + escapeHtml(num) + "</span>";
    }).join("") + "</div>";
  }

  function fillFiltersAndJoin() {
    var modalidades = state.data.modalidades || [];
    var currentModalidade = qs("filterModalidade").value;
    qs("filterModalidade").innerHTML = "<option value=\"\">Todas</option>" + modalidades.map(function (item) {
      return "<option value=\"" + escapeHtml(item.chave || item.nome) + "\">" + escapeHtml(item.nome || item.chave) + "</option>";
    }).join("");
    qs("filterModalidade").value = currentModalidade || "";

    var currentBolaoValue = qs("joinBolao").value;
    qs("joinBolao").innerHTML = (state.data.boloes || []).map(function (bolao) {
      return "<option value=\"" + escapeHtml(bolao.cod_bolao) + "\">" + escapeHtml(bolao.titulo) + " - " + moneyFromCents(bolao.valor_total_cota_centavos) + "</option>";
    }).join("");
    if (currentBolaoValue) {
      var exists = Array.prototype.some.call(qs("joinBolao").options, function (option) {
        return option.value === currentBolaoValue;
      });
      if (exists) qs("joinBolao").value = currentBolaoValue;
    }
    syncSlipWithSelectedBolao();
  }

  function filteredBoloes() {
    var modalidade = qs("filterModalidade").value;
    var status = qs("filterStatus").value;
    return (state.data.boloes || []).filter(function (bolao) {
      if (modalidade && String(bolao.modalidade_chave || bolao.modalidade) !== modalidade) return false;
      if (status && String(bolao.status) !== status) return false;
      return true;
    });
  }

  function renderBoloes() {
    fillFiltersAndJoin();
    var rows = filteredBoloes();
    qs("boloesGrid").innerHTML = rows.length ? rows.map(function (bolao) {
      var reserved = numberValue(bolao.cotas_reservadas);
      var total = Math.max(1, numberValue(bolao.qtd_cotas));
      var width = Math.min(100, reserved / total * 100);
      var adminButton = state.role === "admin" || state.role === "suporte" ?
        "<button class=\"sb-btn sb-btn-ghost sb-btn-small\" type=\"button\" data-edit-bolao=\"" + escapeHtml(bolao.cod_bolao) + "\">Editar</button>" : "";
      return "<article class=\"sb-card\">" +
        "<div class=\"sb-card-head\"><div><h3>" + escapeHtml(bolao.titulo) + "</h3><small>" + escapeHtml(bolao.modalidade) + " #" + escapeHtml(bolao.concurso) + "</small></div>" + pill(bolao.status) + "</div>" +
        renderBalls(bolao.numeros) +
        "<div class=\"sb-progress\"><span class=\"sb-progress-fill\" style=\"width:" + width + "%\"></span></div>" +
        "<div class=\"sb-card-data\">" +
          "<span><b>Cotas</b><strong>" + compactNumber(reserved) + "/" + compactNumber(total) + "</strong></span>" +
          "<span><b>Valor</b><strong>" + moneyFromCents(bolao.valor_total_cota_centavos) + "</strong></span>" +
          "<span><b>Limite</b><strong>" + formatDateTime(bolao.data_limite) + "</strong></span>" +
          "<span><b>Loterica</b><strong>" + escapeHtml(bolao.loterica || "A definir") + "</strong></span>" +
        "</div>" +
        "<div class=\"sb-form-actions\"><button class=\"sb-btn sb-btn-primary sb-btn-small\" type=\"button\" data-select-bolao=\"" + escapeHtml(bolao.cod_bolao) + "\">Reservar</button>" + adminButton + "</div>" +
      "</article>";
    }).join("") : empty("Nenhum bolao encontrado.");
    setStatus(qs("boloesStatus"), rows.length + " bolao(s)", "ok");
  }

  function renderMine() {
    var rows = state.data.minhas_participacoes || [];
    qs("myTableBody").innerHTML = rows.length ? rows.map(function (row) {
      var doc = row.documento_url ? "<a href=\"" + escapeHtml(row.documento_url) + "\" target=\"_blank\" rel=\"noopener\">Abrir</a>" : "Pendente";
      var palpite = normalizeNumbers(row.palpite_numeros || row.numeros_palpite || row.numeros || []).join(", ");
      return "<tr>" +
        "<td><strong>" + escapeHtml(row.bolao) + "</strong><br><span class=\"sb-status\">" + escapeHtml(row.modalidade || "") + "</span></td>" +
        "<td>#" + escapeHtml(row.concurso || "") + "<br><span class=\"sb-status\">" + formatDate(row.data_sorteio) + "</span></td>" +
        "<td>" + compactNumber(row.cotas) + "</td>" +
        "<td>" + moneyFromCents(row.valor_total_centavos) + "</td>" +
        "<td>" + pill(row.status) + "</td>" +
        "<td><span class=\"sb-status\">" + escapeHtml(palpite || "Aguardando") + "</span></td>" +
        "<td>" + doc + "</td>" +
      "</tr>";
    }).join("") : "<tr><td colspan=\"7\">" + empty("Nenhuma participacao encontrada.") + "</td></tr>";
    setStatus(qs("myStatus"), rows.length + " participacao(oes)", "ok");
  }

  function renderResults() {
    var rows = state.data.resultados || [];
    qs("resultsGrid").innerHTML = rows.length ? rows.map(function (row) {
      return "<article class=\"sb-result\">" +
        "<div><h3>" + escapeHtml(row.modalidade) + " #" + escapeHtml(row.concurso) + "</h3>" +
        "<span class=\"sb-status\">" + formatDate(row.data_sorteio) + " - premio estimado " + moneyFromCents(row.premio_estimado_centavos) + "</span></div>" +
        renderBalls(row.numeros) +
      "</article>";
    }).join("") : empty("Nenhum resultado registrado.");
    setStatus(qs("resultsStatus"), rows.length + " resultado(s)", "ok");
  }

  function renderAwards() {
    var rows = state.data.premios || [];
    qs("awardsTableBody").innerHTML = rows.length ? rows.map(function (row) {
      return "<tr>" +
        "<td><strong>" + escapeHtml(row.bolao) + "</strong></td>" +
        "<td>" + escapeHtml(row.faixa || "") + "</td>" +
        "<td>" + moneyFromCents(row.total_centavos) + "</td>" +
        "<td><strong>" + moneyFromCents(row.minha_parte_centavos) + "</strong></td>" +
        "<td>" + pill(row.status) + "</td>" +
      "</tr>";
    }).join("") : "<tr><td colspan=\"5\">" + empty("Nenhum premio apurado.") + "</td></tr>";
    setStatus(qs("awardsStatus"), rows.length + " lancamento(s)", "ok");
  }

  function renderPartners() {
    var rows = state.data.lotericas || [];
    qs("partnersGrid").innerHTML = rows.length ? rows.map(function (row) {
      var adminButton = state.role === "admin" || state.role === "suporte" ?
        "<button class=\"sb-btn sb-btn-ghost sb-btn-small\" type=\"button\" data-edit-partner=\"" + escapeHtml(row.cod_loterica) + "\">Editar</button>" : "";
      return "<article class=\"sb-card\">" +
        "<div class=\"sb-card-head\"><div><h3>" + escapeHtml(row.nome) + "</h3><small>" + escapeHtml(row.cidade || "") + "/" + escapeHtml(row.uf || "") + "</small></div>" + pill(row.status) + "</div>" +
        "<div class=\"sb-card-data\">" +
          "<span><b>CNPJ</b><strong>" + escapeHtml(row.cnpj || "") + "</strong></span>" +
          "<span><b>Boloes</b><strong>" + compactNumber(row.boloes_ativos) + "</strong></span>" +
          "<span><b>Repasse</b><strong>" + moneyFromCents(row.repasse_pendente_centavos) + "</strong></span>" +
        "</div>" +
        "<div class=\"sb-form-actions\">" + adminButton + "</div>" +
      "</article>";
    }).join("") : empty("Nenhuma loterica cadastrada.");

    qs("partnerQueueBody").innerHTML = (state.data.fila_loterica || []).map(function (row) {
      var doc = row.comprovante_url ? "<a href=\"" + escapeHtml(row.comprovante_url) + "\" target=\"_blank\" rel=\"noopener\">Abrir</a>" : "Pendente";
      return "<tr><td><strong>" + escapeHtml(row.bolao) + "</strong></td><td>" + moneyFromCents(row.repasse_centavos) + "</td><td>" + doc + "</td><td>" + pill(row.status) + "</td></tr>";
    }).join("") || "<tr><td colspan=\"4\">" + empty("Sem repasses pendentes.") + "</td></tr>";
    setStatus(qs("partnersStatus"), rows.length + " parceira(s)", "ok");
  }

  function renderSupport() {
    var rows = state.data.chamados || [];
    qs("ticketsList").innerHTML = rows.length ? rows.map(function (row) {
      return "<article class=\"sb-ticket\"><strong>#" + escapeHtml(row.cod_chamado) + " - " + escapeHtml(row.assunto) + "</strong><small>" + escapeHtml(row.prioridade || "media") + " - " + formatDateTime(row.atualizado_em) + "</small>" + pill(row.status) + "</article>";
    }).join("") : empty("Nenhum chamado aberto.");
    setStatus(qs("supportStatus"), rows.length + " chamado(s)", "ok");
  }

  function renderAdmin() {
    var rows = state.data.fila_admin || [];
    qs("adminQueueBody").innerHTML = rows.length ? rows.map(function (row) {
      return "<tr>" +
        "<td><strong>" + escapeHtml(row.titulo) + "</strong><br><span class=\"sb-status\">" + escapeHtml(row.tipo || "") + "</span></td>" +
        "<td>" + escapeHtml(row.responsavel || "") + "</td>" +
        "<td>" + moneyFromCents(row.valor_centavos) + "</td>" +
        "<td>" + pill(row.status) + "</td>" +
        "<td><button class=\"sb-btn sb-btn-ghost sb-btn-small\" type=\"button\" data-admin-done=\"" + escapeHtml(row.id) + "\">Marcar ok</button></td>" +
      "</tr>";
    }).join("") : "<tr><td colspan=\"5\">" + empty("Fila operacional limpa.") + "</td></tr>";
    setStatus(qs("adminStatus"), rows.length + " item(ns)", "ok");
  }

  function empty(text) {
    return "<div class=\"sb-empty\">" + escapeHtml(text) + "</div>";
  }

  function renderAll() {
    applyRoleButtons();
    allowedTabsForRole();
    qs("backendNotice").hidden = !state.demo;
    renderMetrics();
    renderSummary();
    renderBoloes();
    renderMine();
    renderResults();
    renderAwards();
    renderPartners();
    renderSupport();
    renderAdmin();
  }

  async function boot() {
    setStatus(qs("pageStatus"), "Carregando", "");
    state.session = readSession();
    state.role = readRole();
    applyRoleButtons();
    if (!state.session || !state.session.access_token) {
      showLogin(true);
      setStatus(qs("pageStatus"), "Entre para continuar", "");
      return;
    }
    try {
      await refreshSessionIfNeeded();
      await loadContext();
      if (!hasAdminAccess(state.role)) throw new Error("sem_permissao_sobolao");
      await loadData();
      showLogin(false);
      renderAll();
      setStatus(qs("pageStatus"), state.demo ? "Previa local" : "Online", state.demo ? "" : "ok");
    } catch (error) {
      showLogin(true);
      setStatus(qs("pageStatus"), error.message || String(error), "error");
      setStatus(qs("loginStatus"), error.message || String(error), "error");
    }
  }

  function openDemo() {
    state.demo = true;
    state.role = qs("loginRole").value || readRole();
    saveRole(state.role);
    state.data = demoData(state.role);
    showLogin(false);
    renderAll();
    setStatus(qs("pageStatus"), "Previa local", "");
  }

  async function submitLogin(event) {
    event.preventDefault();
    var button = qs("loginButton");
    setBusy(button, true);
    setStatus(qs("loginStatus"), "Entrando", "");
    try {
      saveRole(qs("loginRole").value);
      var session = await login(qs("loginEmail").value.trim(), qs("loginPassword").value);
      saveSession(session);
      await boot();
    } catch (error) {
      clearSession();
      setStatus(qs("loginStatus"), error.message || String(error), "error");
    } finally {
      setBusy(button, false);
    }
  }

  async function changeRole(role) {
    saveRole(role);
    applyRoleButtons();
    if (state.demo && !state.session) {
      state.data = demoData(state.role);
      renderAll();
      return;
    }
    await boot();
  }

  async function joinBolao(event) {
    event.preventDefault();
    var button = qs("joinButton");
    setBusy(button, true);
    setStatus(qs("boloesStatus"), "Reservando", "");
    try {
      var bolaoId = Number(qs("joinBolao").value);
      var cotas = Math.max(1, intValue(qs("joinCotas").value, 1));
      var bolao = currentBolao();
      var rule = ruleForBolao(bolao);
      var numeros = selectedSlipNumbers();
      if (!bolao) throw new Error("bolao_indisponivel");
      if (numeros.length !== rule.qty) throw new Error("palpite_incompleto");
      if (state.demo) {
        if (numberValue(bolao.cotas_reservadas) + cotas > numberValue(bolao.qtd_cotas)) throw new Error("cotas_insuficientes");
        bolao.cotas_reservadas = numberValue(bolao.cotas_reservadas) + cotas;
        state.data.minhas_participacoes.unshift({
          cod_participacao: Date.now(),
          bolao: bolao.titulo,
          modalidade: bolao.modalidade,
          concurso: bolao.concurso,
          cotas: cotas,
          valor_total_centavos: numberValue(bolao.valor_total_cota_centavos) * cotas,
          status: "reservado",
          palpite_numeros: numeros,
          documento_url: "",
          data_sorteio: bolao.data_sorteio
        });
        setStatus(qs("boloesStatus"), "Reserva criada na previa local.", "ok");
      } else {
        var data = await rpc("sobolao_participar_rpc", {
          p_cod_bolao: bolaoId,
          p_qtd_cotas: cotas,
          p_palpite_numeros: numeros
        });
        if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel reservar.");
        setStatus(qs("boloesStatus"), "Reserva criada.", "ok");
        await loadData();
      }
      state.slip.selected = [];
      renderAll();
      activateTab("meus");
    } catch (error) {
      setStatus(qs("boloesStatus"), error.message || String(error), "error");
    } finally {
      setBusy(button, false);
    }
  }

  function fillAdminBolao(bolao) {
    if (!bolao) return;
    qs("adminBolaoId").value = bolao.cod_bolao || "";
    qs("adminBolaoTitulo").value = bolao.titulo || "";
    qs("adminBolaoModalidade").value = bolao.modalidade_chave || "";
    qs("adminBolaoConcurso").value = bolao.concurso || "";
    qs("adminBolaoSorteio").value = formatDateInput(bolao.data_sorteio);
    qs("adminBolaoLoterica").value = bolao.loterica_cnpj || "";
    qs("adminBolaoCotas").value = bolao.qtd_cotas || 100;
    qs("adminBolaoValor").value = (numberValue(bolao.valor_aposta_cota_centavos) / 100).toFixed(2);
    qs("adminBolaoTaxa").value = bolao.taxa_gestao_percentual || 10;
    qs("adminBolaoLimite").value = formatDateTimeInput(bolao.data_limite);
    qs("adminBolaoStatus").value = bolao.status || "rascunho";
    qs("adminBolaoNumeros").value = normalizeNumbers(bolao.numeros).join(", ");
  }

  function resetAdminBolao() {
    qs("adminBolaoId").value = "";
    qs("adminBolaoTitulo").value = "";
    qs("adminBolaoModalidade").value = "mega_sena";
    qs("adminBolaoConcurso").value = "";
    qs("adminBolaoSorteio").value = "";
    qs("adminBolaoLoterica").value = "";
    qs("adminBolaoCotas").value = "100";
    qs("adminBolaoValor").value = "6.00";
    qs("adminBolaoTaxa").value = "10";
    qs("adminBolaoLimite").value = "";
    qs("adminBolaoStatus").value = "rascunho";
    qs("adminBolaoNumeros").value = "";
  }

  async function saveAdminBolao(event) {
    event.preventDefault();
    var button = qs("adminBolaoButton");
    setBusy(button, true);
    setStatus(qs("adminStatus"), "Salvando bolao", "");
    try {
      var payload = {
        p_cod_bolao: qs("adminBolaoId").value ? Number(qs("adminBolaoId").value) : null,
        p_titulo: qs("adminBolaoTitulo").value.trim(),
        p_modalidade_chave: qs("adminBolaoModalidade").value.trim(),
        p_concurso_numero: Number(qs("adminBolaoConcurso").value),
        p_data_sorteio: qs("adminBolaoSorteio").value,
        p_loterica_cnpj: qs("adminBolaoLoterica").value.trim(),
        p_qtd_cotas: Number(qs("adminBolaoCotas").value),
        p_valor_aposta_cota_centavos: centsFromInput(qs("adminBolaoValor").value),
        p_taxa_gestao_percentual: Number(qs("adminBolaoTaxa").value),
        p_data_limite: qs("adminBolaoLimite").value ? new Date(qs("adminBolaoLimite").value).toISOString() : null,
        p_numeros_json: parseNumbers(qs("adminBolaoNumeros").value),
        p_status: qs("adminBolaoStatus").value
      };
      if (state.demo) {
        var existing = (state.data.boloes || []).find(function (item) { return Number(item.cod_bolao) === Number(payload.p_cod_bolao); });
        var row = existing || { cod_bolao: Date.now(), cotas_reservadas: 0 };
        row.titulo = payload.p_titulo;
        row.modalidade_chave = payload.p_modalidade_chave;
        row.modalidade = payload.p_modalidade_chave.replace(/_/g, " ");
        row.concurso = payload.p_concurso_numero;
        row.data_sorteio = payload.p_data_sorteio;
        row.data_limite = payload.p_data_limite;
        row.loterica_cnpj = payload.p_loterica_cnpj;
        row.loterica = payload.p_loterica_cnpj || "A definir";
        row.qtd_cotas = payload.p_qtd_cotas;
        row.valor_aposta_cota_centavos = payload.p_valor_aposta_cota_centavos;
        row.taxa_gestao_percentual = payload.p_taxa_gestao_percentual;
        row.valor_total_cota_centavos = Math.round(payload.p_valor_aposta_cota_centavos * (1 + payload.p_taxa_gestao_percentual / 100));
        row.numeros = payload.p_numeros_json;
        row.status = payload.p_status;
        if (!existing) state.data.boloes.unshift(row);
      } else {
        var data = await rpc("adm_sobolao_bolao_salvar_rpc", payload);
        if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel salvar o bolao.");
        await loadData();
      }
      resetAdminBolao();
      renderAll();
      setStatus(qs("adminStatus"), "Bolao salvo.", "ok");
    } catch (error) {
      setStatus(qs("adminStatus"), error.message || String(error), "error");
    } finally {
      setBusy(button, false);
    }
  }

  function fillPartner(row) {
    if (!row) return;
    qs("partnerId").value = row.cod_loterica || "";
    qs("partnerName").value = row.nome || "";
    qs("partnerCnpj").value = row.cnpj || "";
    qs("partnerCity").value = row.cidade || "";
    qs("partnerUf").value = row.uf || "";
    qs("partnerWhatsapp").value = row.whatsapp || "";
    qs("partnerStatus").value = row.status || "analise";
  }

  function resetPartner() {
    qs("partnerId").value = "";
    qs("partnerName").value = "";
    qs("partnerCnpj").value = "";
    qs("partnerCity").value = "";
    qs("partnerUf").value = "";
    qs("partnerWhatsapp").value = "";
    qs("partnerStatus").value = "analise";
  }

  async function savePartner(event) {
    event.preventDefault();
    var button = qs("partnerButton");
    setBusy(button, true);
    setStatus(qs("adminStatus"), "Salvando loterica", "");
    try {
      var payload = {
        p_cod_loterica: qs("partnerId").value ? Number(qs("partnerId").value) : null,
        p_nome: qs("partnerName").value.trim(),
        p_cnpj: qs("partnerCnpj").value.trim(),
        p_cidade: qs("partnerCity").value.trim(),
        p_uf: qs("partnerUf").value.trim(),
        p_whatsapp: qs("partnerWhatsapp").value.trim(),
        p_status: qs("partnerStatus").value
      };
      if (state.demo) {
        var existing = (state.data.lotericas || []).find(function (item) { return Number(item.cod_loterica) === Number(payload.p_cod_loterica); });
        var row = existing || { cod_loterica: Date.now(), boloes_ativos: 0, repasse_pendente_centavos: 0 };
        row.nome = payload.p_nome;
        row.cnpj = payload.p_cnpj;
        row.cidade = payload.p_cidade;
        row.uf = payload.p_uf;
        row.whatsapp = payload.p_whatsapp;
        row.status = payload.p_status;
        if (!existing) state.data.lotericas.unshift(row);
      } else {
        var data = await rpc("adm_sobolao_loterica_salvar_rpc", payload);
        if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel salvar a loterica.");
        await loadData();
      }
      resetPartner();
      renderAll();
      setStatus(qs("adminStatus"), "Loterica salva.", "ok");
    } catch (error) {
      setStatus(qs("adminStatus"), error.message || String(error), "error");
    } finally {
      setBusy(button, false);
    }
  }

  async function saveSupport(event) {
    event.preventDefault();
    var button = qs("supportButton");
    setBusy(button, true);
    setStatus(qs("supportStatus"), "Abrindo chamado", "");
    try {
      var payload = {
        p_assunto: qs("supportSubject").value.trim(),
        p_mensagem: qs("supportMessage").value.trim(),
        p_origem: state.role
      };
      if (state.demo) {
        state.data.chamados.unshift({
          cod_chamado: Date.now(),
          assunto: payload.p_assunto,
          status: "aberto",
          prioridade: "media",
          atualizado_em: new Date().toISOString()
        });
      } else {
        var data = await rpc("sobolao_suporte_chamado_rpc", payload);
        if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel abrir chamado.");
        await loadData();
      }
      qs("supportSubject").value = "";
      qs("supportMessage").value = "";
      renderAll();
      setStatus(qs("supportStatus"), "Chamado aberto.", "ok");
    } catch (error) {
      setStatus(qs("supportStatus"), error.message || String(error), "error");
    } finally {
      setBusy(button, false);
    }
  }

  async function markAdminDone(id) {
    setStatus(qs("adminStatus"), "Atualizando", "");
    try {
      if (state.demo) {
        (state.data.fila_admin || []).forEach(function (row) {
          if (String(row.id) === String(id)) row.status = "ok";
        });
      } else {
        var data = await rpc("adm_sobolao_status_rpc", {
          p_tipo: "fila",
          p_id: Number(id),
          p_status: "ok",
          p_observacao: "Atualizado pelo painel So Bolao"
        });
        if (!data || data.ok !== true) throw new Error((data && data.error) || "Nao foi possivel atualizar.");
        await loadData();
      }
      renderAll();
      setStatus(qs("adminStatus"), "Atualizado.", "ok");
    } catch (error) {
      setStatus(qs("adminStatus"), error.message || String(error), "error");
    }
  }

  function setupEvents() {
    qs("loginForm").addEventListener("submit", submitLogin);
    qs("demoButton").addEventListener("click", openDemo);
    qs("reloadButton").addEventListener("click", boot);
    qs("logoutButton").addEventListener("click", function () {
      clearSession();
      showLogin(true);
      setStatus(qs("pageStatus"), "Sessao encerrada", "");
    });
    qs("switchAccountButton").addEventListener("click", function () {
      clearSession();
      showLogin(true);
      setStatus(qs("loginStatus"), "", "");
      if (qs("loginEmail")) qs("loginEmail").focus();
    });
    qsa("[data-role]").forEach(function (button) {
      button.addEventListener("click", function () {
        changeRole(button.getAttribute("data-role"));
      });
    });
    qsa("[data-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        activateTab(button.getAttribute("data-tab"));
      });
    });
    qs("filterModalidade").addEventListener("change", renderBoloes);
    qs("filterStatus").addEventListener("change", renderBoloes);
    qs("joinBolao").addEventListener("change", syncSlipWithSelectedBolao);
    qs("joinForm").addEventListener("submit", joinBolao);
    qs("slipNumberGrid").addEventListener("click", function (event) {
      var button = event.target.closest("[data-slip-number]");
      if (button) toggleSlipNumber(button.getAttribute("data-slip-number"));
    });
    qs("slipClearButton").addEventListener("click", clearSlip);
    qs("slipRandomButton").addEventListener("click", randomSlip);
    qs("boloesGrid").addEventListener("click", function (event) {
      var select = event.target.closest("[data-select-bolao]");
      if (select) {
        qs("joinBolao").value = select.getAttribute("data-select-bolao");
        syncSlipWithSelectedBolao();
        qs("joinCotas").focus();
        return;
      }
      var edit = event.target.closest("[data-edit-bolao]");
      if (edit) {
        var bolao = (state.data.boloes || []).find(function (item) { return String(item.cod_bolao) === edit.getAttribute("data-edit-bolao"); });
        fillAdminBolao(bolao);
        activateTab("admin");
      }
    });
    qs("partnersGrid").addEventListener("click", function (event) {
      var edit = event.target.closest("[data-edit-partner]");
      if (!edit) return;
      var row = (state.data.lotericas || []).find(function (item) { return String(item.cod_loterica) === edit.getAttribute("data-edit-partner"); });
      fillPartner(row);
      activateTab("admin");
    });
    qs("adminBolaoForm").addEventListener("submit", saveAdminBolao);
    qs("adminBolaoNovo").addEventListener("click", resetAdminBolao);
    qs("partnerForm").addEventListener("submit", savePartner);
    qs("partnerNovo").addEventListener("click", resetPartner);
    qs("supportForm").addEventListener("submit", saveSupport);
    qs("adminQueueBody").addEventListener("click", function (event) {
      var done = event.target.closest("[data-admin-done]");
      if (done) markAdminDone(done.getAttribute("data-admin-done"));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupEvents();
    boot();
  });
})();
