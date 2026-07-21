(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    sessionKey: "tt_admin_session_v1",
    modeKey: "tt_mmn_mode_v1",
    inviteBaseUrl: "https://www.turbotiger.com.br/convite/?ref="
  };

  var LEVELS = [
    { nivel: 1, percentual: 10.7 },
    { nivel: 2, percentual: 8 },
    { nivel: 3, percentual: 7.6 },
    { nivel: 4, percentual: 3.8 },
    { nivel: 5, percentual: 1.9 },
    { nivel: 6, percentual: 1 }
  ];

  var RANKS = [
    { rank: "Executivo", criterio: "1.000 ativos na rede", pool: "2%" },
    { rank: "Senior", criterio: "5.000 ativos na rede", pool: "4%" },
    { rank: "Master", criterio: "10.000 ativos na rede", pool: "6%" },
    { rank: "Elite", criterio: "50.000 ativos na rede", pool: "8%" }
  ];

  var state = {
    session: null,
    contexto: null,
    role: "admin",
    demo: false,
    data: null,
    selectedNetworkUser: null
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

  function pct(value) {
    return numberValue(value).toLocaleString("pt-BR", {
      minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 2
    }) + "%";
  }

  function percentText(value) {
    var raw = String(value == null ? "" : value).trim();
    if (!raw) return "";
    if (raw.slice(-1) === "%") {
      var parsed = Number(raw.slice(0, -1).replace(",", "."));
      return Number.isFinite(parsed) ? pct(parsed) : raw;
    }
    return pct(value);
  }

  function money(value) {
    return numberValue(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function compactNumber(value) {
    return intValue(value).toLocaleString("pt-BR");
  }

  function friendlyMessage(value) {
    var raw = String(value == null ? "" : value).trim();
    var map = {
      "Email not confirmed": "Confirme seu e-mail antes de entrar.",
      "Failed to fetch": "Falha de conexao. Verifique sua internet e tente novamente.",
      "Invalid login credentials": "E-mail ou senha invalidos.",
      "invalid_credentials": "E-mail ou senha invalidos.",
      "invalid_grant": "E-mail ou senha invalidos.",
      "missing_authorization": "Sessao expirada. Entre novamente.",
      "nao_autenticado": "Entre para continuar.",
      "sem_permissao_admin": "Sem permissao administrativa.",
      "sem_permissao_mmn": "Sem permissao para acessar o MMN.",
      "sessao_expirada": "Sessao expirada. Entre novamente."
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
    var data;
    try {
      data = await parseResponse(response);
    } catch (error) {
      if (response.status === 400 || response.status === 401) {
        throw new Error("E-mail ou senha invalidos.");
      }
      throw error;
    }
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

  function readSavedRole() {
    try {
      return localStorage.getItem(CONFIG.modeKey) || "admin";
    } catch (error) {
      return "admin";
    }
  }

  function saveRole(role) {
    state.role = role || "admin";
    try {
      localStorage.setItem(CONFIG.modeKey, state.role);
    } catch (error) {}
  }

  async function loadContext() {
    try {
      var contexto = await rpc("adm_contexto_rpc", {});
      if (contexto && contexto.ok === true) {
        state.contexto = contexto;
        return contexto;
      }
      return null;
    } catch (error) {
      state.contexto = null;
      return null;
    }
  }

  function hasAdminAccess(role) {
    var contexto = state.contexto;
    var areas = (contexto && contexto.areas) || [];
    var perfil = contexto && contexto.perfil && contexto.perfil.chave;
    if (perfil === "super_admin") return true;
    if (areas.indexOf("mmn") >= 0) return true;
    if (role === "admin" && areas.indexOf("admin") >= 0) return true;
    if (role === "suporte" && (areas.indexOf("admin") >= 0 || areas.indexOf("push") >= 0)) return true;
    return false;
  }

  function showLogin(show) {
    qs("mmnLoginPanel").hidden = !show;
    qs("mmnApp").hidden = !!show;
  }

  function applyRoleButtons() {
    qsa("[data-role]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-role") === state.role);
    });
    if (qs("loginRole")) qs("loginRole").value = state.role;
  }

  function demoData(role) {
    var users = [
      { cod_usuario: 101, login: "TigerAlpha", nome: "Tiger Alpha", indicador: "", diretos: 16, redeAtivos: 149296, rank: "Elite", status: "ativo", ref: "demoAlphaRef20260720" },
      { cod_usuario: 102, login: "BancaForte", nome: "Banca Forte", indicador: "TigerAlpha", diretos: 12, redeAtivos: 42000, rank: "Master", status: "ativo", ref: "demoBancaForte20260720" },
      { cod_usuario: 103, login: "MetaControl", nome: "Meta Control", indicador: "TigerAlpha", diretos: 8, redeAtivos: 11200, rank: "Master", status: "ativo", ref: "demoMetaControl20260720" },
      { cod_usuario: 104, login: "SaldoZen", nome: "Saldo Zen", indicador: "BancaForte", diretos: 5, redeAtivos: 5100, rank: "Senior", status: "pendente", ref: "demoSaldoZen20260720" },
      { cod_usuario: 105, login: "GestaoVip", nome: "Gestao Vip", indicador: "BancaForte", diretos: 3, redeAtivos: 1020, rank: "Executivo", status: "ativo", ref: "demoGestaoVip20260720" },
      { cod_usuario: 106, login: "ControlePro", nome: "Controle Pro", indicador: "MetaControl", diretos: 2, redeAtivos: 340, rank: "Base", status: "ativo", ref: "demoControlePro20260720" }
    ];

    var networkUser = role === "usuario" ? users[4] : users[0];
    var acima = role === "usuario" ? [
      { nivel: 1, login: "BancaForte", nome: "Banca Forte", cod_usuario: 102, rank: "Master" },
      { nivel: 2, login: "TigerAlpha", nome: "Tiger Alpha", cod_usuario: 101, rank: "Elite" },
      { nivel: 3, login: "Fundador", nome: "Raiz Turbo", cod_usuario: 1, rank: "Elite" }
    ] : [
      { nivel: 1, login: "Fundador", nome: "Raiz Turbo", cod_usuario: 1, rank: "Elite" }
    ];

    var abaixo = [
      { nivel: 1, login: "SaldoZen", nome: "Saldo Zen", cod_usuario: 104, rank: "Senior", ativos: 5100 },
      { nivel: 2, login: "GestaoVip", nome: "Gestao Vip", cod_usuario: 105, rank: "Executivo", ativos: 1020 },
      { nivel: 3, login: "ControlePro", nome: "Controle Pro", cod_usuario: 106, rank: "Base", ativos: 340 },
      { nivel: 4, login: "MapaROI", nome: "Mapa ROI", cod_usuario: 107, rank: "Base", ativos: 96 },
      { nivel: 5, login: "StopLossOK", nome: "Stop Loss OK", cod_usuario: 108, rank: "Base", ativos: 24 },
      { nivel: 6, login: "DisciplinaBR", nome: "Disciplina BR", cod_usuario: 109, rank: "Base", ativos: 6 }
    ];

    return {
      resumo: {
        ativos: role === "usuario" ? 1020 : 297901,
        mrr: role === "usuario" ? 20298 : 5928235.79,
        payout: role === "usuario" ? 13.1 : 33,
        comissoes: role === "usuario" ? 1201.46 : 1956317.81,
        bonificacoes: role === "usuario" ? 23.56 : 129412.14,
        pendencias: role === "usuario" ? 2 : 37,
        ticket: 19.9,
        payoutCap: 33,
        niveis: 6,
        margem: role === "usuario" ? 86.9 : 67,
        levels: LEVELS,
        stages: [
          { titulo: "Implantacao", texto: "Meses 1-3 com lideres iniciais e validacao de comportamento." },
          { titulo: "Aceleracao", texto: "Meses 4-16 com duplicacao ativa apos maturacao." },
          { titulo: "Saturacao", texto: "Meses 13-18 com amortecimento progressivo." },
          { titulo: "Estabilizacao", texto: "Meses 19-24 com teto tecnico e previsibilidade." }
        ]
      },
      usuarios: users,
      rede: {
        usuario: networkUser,
        indicador: acima[0] || null,
        acima: acima,
        abaixo: abaixo,
        diretos: users.slice(1, 5),
        convite_link: CONFIG.inviteBaseUrl + (networkUser.ref || "demo")
      },
      comissoes: [
        { periodo: "2026-07", beneficiario: networkUser.login, origem: "SaldoZen", nivel: 1, base: 19.9, percentual: 10.7, valor: 2.13, status: "confirmado" },
        { periodo: "2026-07", beneficiario: networkUser.login, origem: "GestaoVip", nivel: 2, base: 19.9, percentual: 8, valor: 1.59, status: "pendente" },
        { periodo: "2026-07", beneficiario: networkUser.login, origem: "ControlePro", nivel: 3, base: 19.9, percentual: 7.6, valor: 1.51, status: "confirmado" },
        { periodo: "2026-07", beneficiario: networkUser.login, origem: "MapaROI", nivel: 4, base: 19.9, percentual: 3.8, valor: 0.76, status: "retido" },
        { periodo: "2026-07", beneficiario: networkUser.login, origem: "StopLossOK", nivel: 5, base: 19.9, percentual: 1.9, valor: 0.38, status: "pendente" },
        { periodo: "2026-07", beneficiario: networkUser.login, origem: "DisciplinaBR", nivel: 6, base: 19.9, percentual: 1, valor: 0.2, status: "confirmado" }
      ],
      premios: [
        { titulo: "Bonus lideranca", valor: role === "usuario" ? 23.56 : 13776.87, status: "apurando", descricao: "Pool por rank e ativos." },
        { titulo: "Pool global", valor: role === "usuario" ? 8.45 : 1782.59, status: "previsto", descricao: "Participacao em performance." },
        { titulo: "Indicador ativo", valor: role === "usuario" ? 3 : 3515, status: "ok", descricao: "Diretos ativos qualificados." },
        { titulo: "Qualificacao", valor: role === "usuario" ? 2 : 37, status: "pendente", descricao: "Itens para revisar." }
      ],
      ranks: RANKS,
      regras: {
        levels: LEVELS,
        qualificacao: [
          { titulo: "Diretos ativos", texto: "Minimo de 3 diretos ativos para habilitar comissao." },
          { titulo: "Rede ativa", texto: "Base liquida ativa, sem contar historico bruto cancelado." },
          { titulo: "Nivel 5 e 6", texto: "Exigem diretos com 10+ ativos e continuidade confirmada." },
          { titulo: "Payout", texto: "Teto operacional de 33% sobre receita confirmada." }
        ]
      }
    };
  }

  function normalizeData(data, role) {
    if (!data || data.ok === false) return demoData(role);
    var base = demoData(role);
    var resumo = data.resumo || data.metricas || data.summary || {};
    var rede = data.rede || data.network || {};
    return {
      resumo: Object.assign({}, base.resumo, resumo),
      usuarios: data.usuarios || data.users || base.usuarios,
      rede: Object.assign({}, base.rede, rede),
      comissoes: data.comissoes || data.lancamentos || data.commissions || base.comissoes,
      premios: data.premios || data.bonificacoes || data.awards || base.premios,
      ranks: data.ranks || data.ranking || base.ranks,
      regras: Object.assign({}, base.regras, data.regras || data.rules || {})
    };
  }

  async function loadData() {
    state.demo = false;
    var payload = { p_periodo: null };
    var data;
    if (state.role === "usuario") {
      data = await optionalRpc("mmn_usuario_painel_rpc", {});
    } else {
      data = await optionalRpc("adm_mmn_painel_rpc", payload);
    }
    state.data = normalizeData(data, state.role);
    if (!state.selectedNetworkUser && state.data.rede && state.data.rede.usuario) {
      state.selectedNetworkUser = state.data.rede.usuario.cod_usuario;
    }
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
    qsa("[data-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-tab") === tab);
    });
    qsa("[data-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== tab;
    });
  }

  function pill(status) {
    var value = String(status || "").toLowerCase();
    var cls = value === "ativo" || value === "ok" || value === "confirmado" ? "ok" :
      (value === "pendente" || value === "apurando" || value === "previsto" ? "warn" : "bad");
    return "<span class=\"pill " + cls + "\">" + escapeHtml(status || "pendente") + "</span>";
  }

  function renderMetrics() {
    var r = state.data.resumo || {};
    qs("metricAtivos").textContent = compactNumber(r.ativos);
    qs("metricMRR").textContent = money(r.mrr);
    qs("metricPayout").textContent = pct(r.payout);
    qs("metricComissoes").textContent = money(r.comissoes);
    qs("metricBonificacoes").textContent = money(r.bonificacoes);
    qs("metricPendencias").textContent = compactNumber(r.pendencias);
    qs("summaryTicket").textContent = money(r.ticket);
    qs("summaryPayoutCap").textContent = pct(r.payoutCap);
    qs("summaryLevels").textContent = compactNumber(r.niveis || 6);
    qs("summaryMargin").textContent = pct(r.margem);
  }

  function renderSummary() {
    var r = state.data.resumo || {};
    var levels = r.levels || LEVELS;
    var max = Math.max.apply(null, levels.map(function (item) { return numberValue(item.percentual); }));
    qs("levelBars").innerHTML = levels.map(function (item) {
      var percent = numberValue(item.percentual);
      var width = max ? (percent / max * 100) : 0;
      return "<div class=\"mmn-level-row\">" +
        "<strong>Nivel " + escapeHtml(item.nivel) + "</strong>" +
        "<span class=\"mmn-bar-track\"><span class=\"mmn-bar-fill\" style=\"width:" + width + "%\"></span></span>" +
        "<span>" + pct(percent) + "</span>" +
      "</div>";
    }).join("");

    qs("growthTimeline").innerHTML = (r.stages || []).map(function (stage, index) {
      return "<div class=\"mmn-stage\">" +
        "<span class=\"mmn-stage-index\">" + (index + 1) + "</span>" +
        "<div><strong>" + escapeHtml(stage.titulo) + "</strong><span>" + escapeHtml(stage.texto) + "</span></div>" +
      "</div>";
    }).join("");
  }

  function filteredUsers() {
    var query = String(qs("userSearch") ? qs("userSearch").value : "").trim().toLowerCase();
    var status = qs("userStatusFilter") ? qs("userStatusFilter").value : "";
    var rank = qs("userRankFilter") ? qs("userRankFilter").value : "";
    return (state.data.usuarios || []).filter(function (user) {
      var text = [user.cod_usuario, user.login, user.nome, user.indicador, user.rank].join(" ").toLowerCase();
      if (query && text.indexOf(query) === -1) return false;
      if (status && String(user.status || "").toLowerCase() !== status) return false;
      if (rank && String(user.rank || "").toLowerCase() !== rank) return false;
      return true;
    });
  }

  function renderUsers() {
    var rows = filteredUsers();
    var tbody = qs("usersTableBody");
    if (!rows.length) {
      tbody.innerHTML = "<tr><td colspan=\"7\"><div class=\"mmn-empty\">Nenhum usuario encontrado.</div></td></tr>";
      return;
    }
    tbody.innerHTML = rows.map(function (user) {
      return "<tr>" +
        "<td><strong>" + escapeHtml(user.login || user.nome) + "</strong><br><span class=\"status-line\">#" + escapeHtml(user.cod_usuario) + " - " + escapeHtml(user.nome || "") + "</span></td>" +
        "<td>" + escapeHtml(user.indicador || "Raiz") + "</td>" +
        "<td>" + compactNumber(user.diretos) + "</td>" +
        "<td>" + compactNumber(user.redeAtivos) + "</td>" +
        "<td>" + escapeHtml(user.rank || "Base") + "</td>" +
        "<td>" + pill(user.status || "ativo") + "</td>" +
        "<td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-network-user=\"" + escapeHtml(user.cod_usuario) + "\">Rede</button></td>" +
      "</tr>";
    }).join("");
    setStatus(qs("usersStatus"), rows.length + " usuario(s)", "ok");
  }

  function renderNetworkSelect() {
    var select = qs("networkUserSelect");
    if (!select) return;
    var users = state.data.usuarios || [];
    select.innerHTML = users.map(function (user) {
      return "<option value=\"" + escapeHtml(user.cod_usuario) + "\">" + escapeHtml(user.login || user.nome) + " (#" + escapeHtml(user.cod_usuario) + ")</option>";
    }).join("");
    if (state.selectedNetworkUser) select.value = String(state.selectedNetworkUser);
  }

  function chainCard(person) {
    return "<div class=\"mmn-chain-card\">" +
      "<span class=\"mmn-chain-level\">" + escapeHtml(person.nivel || "-") + "</span>" +
      "<span class=\"mmn-chain-name\"><strong>" + escapeHtml(person.login || person.nome || "Usuario") + "</strong><small>" + escapeHtml(person.nome || ("#" + person.cod_usuario)) + "</small></span>" +
      "<span class=\"mmn-chain-meta\">" + escapeHtml(person.rank || "Base") + "</span>" +
    "</div>";
  }

  function renderNetwork() {
    var rede = state.data.rede || {};
    var usuario = rede.usuario || {};
    var invite = rede.convite_link || (CONFIG.inviteBaseUrl + (usuario.ref || ""));

    qs("networkSelf").innerHTML =
      "<h3>" + escapeHtml(usuario.login || usuario.nome || "Usuario") + "</h3>" +
      "<div class=\"mmn-self-data\">" +
        "<span><b>Codigo</b><strong>#" + escapeHtml(usuario.cod_usuario || "") + "</strong></span>" +
        "<span><b>Rank</b><strong>" + escapeHtml(usuario.rank || "Base") + "</strong></span>" +
        "<span><b>Diretos</b><strong>" + compactNumber(usuario.diretos || 0) + "</strong></span>" +
        "<span><b>Rede ativa</b><strong>" + compactNumber(usuario.redeAtivos || 0) + "</strong></span>" +
      "</div>" +
      "<div class=\"result-box\">" + escapeHtml(invite || "Convite indisponivel") + "</div>";

    qs("lineAbove").innerHTML = (rede.acima || []).length ? (rede.acima || []).slice(0, 6).map(chainCard).join("") :
      "<div class=\"mmn-empty\">Sem usuario acima.</div>";
    qs("lineBelow").innerHTML = (rede.abaixo || []).length ? (rede.abaixo || []).slice(0, 6).map(chainCard).join("") :
      "<div class=\"mmn-empty\">Sem usuario abaixo.</div>";
    qs("directsList").innerHTML = (rede.diretos || []).length ? (rede.diretos || []).map(function (person) {
      return "<div class=\"mmn-person\"><strong>" + escapeHtml(person.login || person.nome) + "</strong><small>#" + escapeHtml(person.cod_usuario) + " - " + escapeHtml(person.rank || "Base") + "</small><span>" + compactNumber(person.redeAtivos || person.ativos || 0) + " ativos na rede</span></div>";
    }).join("") : "<div class=\"mmn-empty\">Sem indicados diretos.</div>";
  }

  function commissionValue(row) {
    if (row.valor_reais != null) return numberValue(row.valor_reais);
    if (row.valor_centavos != null) return numberValue(row.valor_centavos) / 100;
    return numberValue(row.valor);
  }

  function renderCommissions() {
    var rows = state.data.comissoes || [];
    var totals = rows.reduce(function (acc, row) {
      var value = commissionValue(row);
      var status = String(row.status || "").toLowerCase();
      if (status === "confirmado" || status === "pago") acc.confirmed += value;
      else if (status === "retido" || status === "bloqueado") acc.held += value;
      else acc.pending += value;
      return acc;
    }, { confirmed: 0, pending: 0, held: 0 });
    qs("commissionConfirmed").textContent = money(totals.confirmed);
    qs("commissionPending").textContent = money(totals.pending);
    qs("commissionHeld").textContent = money(totals.held);
    qs("commissionsTableBody").innerHTML = rows.length ? rows.map(function (row) {
      return "<tr>" +
        "<td>" + escapeHtml(row.periodo || row.period || "") + "</td>" +
        "<td>" + escapeHtml(row.beneficiario || row.usuario || "") + "</td>" +
        "<td>" + escapeHtml(row.origem || row.usuario_origem || "") + "</td>" +
        "<td>" + escapeHtml(row.nivel || "") + "</td>" +
        "<td>" + money(row.base_reais != null ? row.base_reais : row.base) + "</td>" +
        "<td>" + pct(row.percentual || row.percentual_aplicado || 0) + "</td>" +
        "<td><strong>" + money(commissionValue(row)) + "</strong></td>" +
        "<td>" + pill(row.status || "pendente") + "</td>" +
      "</tr>";
    }).join("") : "<tr><td colspan=\"8\"><div class=\"mmn-empty\">Nenhum lancamento.</div></td></tr>";
  }

  function renderAwards() {
    qs("awardsGrid").innerHTML = (state.data.premios || []).map(function (award) {
      var value = typeof award.valor === "number" && award.valor > 100 ? money(award.valor) : escapeHtml(award.valor);
      return "<div class=\"mmn-award\">" +
        "<span>" + escapeHtml(award.titulo) + "</span>" +
        "<strong>" + value + "</strong>" +
        "<span>" + escapeHtml(award.descricao || "") + "</span>" +
        pill(award.status || "previsto") +
      "</div>";
    }).join("");
    qs("rankTableBody").innerHTML = (state.data.ranks || RANKS).map(function (row) {
      return "<tr><td><strong>" + escapeHtml(row.rank) + "</strong></td><td>" + escapeHtml(row.criterio) + "</td><td>" + escapeHtml(percentText(row.pool)) + "</td><td>" + pill(row.status || "ativo") + "</td></tr>";
    }).join("");
  }

  function renderRules() {
    var rules = state.data.regras || {};
    qs("rulesLevels").innerHTML = (rules.levels || LEVELS).map(function (item) {
      return "<div class=\"mmn-rule\"><strong>Nivel " + escapeHtml(item.nivel) + "</strong><span>" + pct(item.percentual) + " sobre receita confirmada.</span></div>";
    }).join("");
    qs("qualificationRules").innerHTML = (rules.qualificacao || []).map(function (item) {
      return "<div class=\"mmn-rule\"><strong>" + escapeHtml(item.titulo) + "</strong><span>" + escapeHtml(item.texto) + "</span></div>";
    }).join("");
  }

  function runSimulator(event) {
    if (event) event.preventDefault();
    var users = numberValue(qs("simUsers").value, 300000);
    var ticket = numberValue(qs("simTicket").value, 19.9);
    var payout = numberValue(qs("simPayout").value, 33) / 100;
    var continuity = numberValue(qs("simContinuity").value, 60) / 100;
    var churn = numberValue(qs("simChurn").value, 16.67) / 100;
    var expansion = numberValue(qs("simExpansion").value, 6);
    var mrr = users * ticket;
    var commission = mrr * payout * continuity * Math.max(0.35, 1 - churn);
    var margin = mrr - commission;
    var activeLeaders = Math.max(1, Math.round(users / Math.max(1, expansion * 120)));

    qs("simulatorResults").innerHTML = [
      { label: "MRR", value: money(mrr), help: "Usuarios ativos x ticket." },
      { label: "Comissao alvo", value: money(commission), help: "Payout ajustado por continuidade e churn." },
      { label: "Margem rede", value: money(margin), help: pct(mrr ? (margin / mrr * 100) : 0) + " do faturamento." },
      { label: "Lideres ativos", value: compactNumber(activeLeaders), help: "Estimativa operacional." }
    ].map(function (item) {
      return "<div class=\"mmn-sim-card\"><span>" + escapeHtml(item.label) + "</span><strong>" + escapeHtml(item.value) + "</strong><span>" + escapeHtml(item.help) + "</span></div>";
    }).join("");
  }

  function renderAll() {
    applyRoleButtons();
    allowedTabsForRole();
    qs("backendNotice").hidden = !state.demo;
    renderMetrics();
    renderSummary();
    renderUsers();
    renderNetworkSelect();
    renderNetwork();
    renderCommissions();
    renderAwards();
    renderRules();
    runSimulator();
  }

  async function boot() {
    setStatus(qs("pageStatus"), "Carregando", "");
    state.session = readSession();
    state.role = readSavedRole();
    applyRoleButtons();
    if (!state.session || !state.session.access_token) {
      showLogin(true);
      setStatus(qs("pageStatus"), "Entre para continuar", "");
      return;
    }
    try {
      await refreshSessionIfNeeded();
      await loadContext();
      if (state.role !== "usuario" && !hasAdminAccess(state.role)) {
        throw new Error("sem_permissao_mmn");
      }
      var nome = (state.contexto && state.contexto.usuario && (state.contexto.usuario.nome || state.contexto.usuario.email)) ||
        (state.session.user && state.session.user.email) ||
        "Turbo Tiger";
      qs("adminIdentity").textContent = nome;
      await loadData();
      showLogin(false);
      renderAll();
      setStatus(qs("pageStatus"), state.demo ? "Demo local" : "Online", state.demo ? "" : "ok");
    } catch (error) {
      showLogin(true);
      setStatus(qs("pageStatus"), error.message || String(error), "error");
      setStatus(qs("loginStatus"), error.message || String(error), "error");
    }
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
    await boot();
  }

  function setupEvents() {
    qs("mmnLoginForm").addEventListener("submit", submitLogin);
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
    qs("userFilterForm").addEventListener("submit", function (event) {
      event.preventDefault();
      renderUsers();
    });
    qs("usersTableBody").addEventListener("click", function (event) {
      var button = event.target.closest("[data-network-user]");
      if (!button) return;
      state.selectedNetworkUser = button.getAttribute("data-network-user");
      qs("networkUserSelect").value = String(state.selectedNetworkUser);
      activateTab("rede");
      setStatus(qs("networkStatus"), "Rede carregada.", "ok");
    });
    qs("networkUserSelect").addEventListener("change", function () {
      state.selectedNetworkUser = qs("networkUserSelect").value;
      var user = (state.data.usuarios || []).find(function (item) {
        return String(item.cod_usuario) === String(state.selectedNetworkUser);
      });
      if (user) {
        state.data.rede.usuario = user;
        state.data.rede.convite_link = CONFIG.inviteBaseUrl + (user.ref || "");
        renderNetwork();
      }
    });
    qs("copyInviteButton").addEventListener("click", async function () {
      var link = (state.data.rede && state.data.rede.convite_link) || "";
      try {
        await navigator.clipboard.writeText(link);
        setStatus(qs("networkStatus"), "Convite copiado.", "ok");
      } catch (error) {
        setStatus(qs("networkStatus"), link || "Convite indisponivel.", "");
      }
    });
    qs("simulatorForm").addEventListener("submit", runSimulator);
    ["simUsers", "simTicket", "simPayout", "simContinuity", "simChurn", "simExpansion"].forEach(function (id) {
      qs(id).addEventListener("input", runSimulator);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupEvents();
    boot();
  });
})();
