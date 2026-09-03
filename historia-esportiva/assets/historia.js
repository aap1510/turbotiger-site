(function () {
  "use strict";

  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU"
  };
  var CODE_RE = /^[A-Za-z0-9_-]{16,160}$/;
  var TOKEN_RE = /^[A-Za-z0-9_-]{64}$/;
  var PAGE_LIMIT = 20;
  var state = {
    code: "",
    invitation: "",
    invitationMode: "",
    data: null,
    toastTimer: null,
    titles: {
      summary: null,
      byMatch: Object.create(null),
      loadedMatches: Object.create(null),
      summaryUnavailable: false,
      contextsUnavailable: false
    },
    pages: {
      experiencias: { items: [], nextCursor: null, hasMore: false, loading: false, initialized: false, failed: false },
      colaboracoes: { items: [], nextCursor: null, hasMore: false, loading: false, initialized: false, failed: false }
    }
  };

  function byId(id) { return document.getElementById(id); }
  function arrayOf(value) { return Array.isArray(value) ? value : value && Array.isArray(value.itens) ? value.itens : []; }
  function numberOf(value) { var number = Number(value); return Number.isFinite(number) ? number : 0; }
  function escapeHtml(value) { return String(value == null ? "" : value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }
  function safeUrl(value) { try { var url = new URL(String(value || ""), location.origin); return url.protocol === "https:" || url.origin === location.origin ? url.href : ""; } catch (error) { return ""; } }
  function icon(name) { return "<svg aria-hidden=\"true\"><use href=\"#hs-" + name + "\"/></svg>"; }
  function initials(name) { return String(name || "M").trim().split(/\s+/).slice(0,2).map(function (part) { return part.charAt(0).toUpperCase(); }).join("") || "M"; }
  function formatDate(value) {
    var raw = String(value || "").slice(0,10);
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    var date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
  }

  function positiveId(value) {
    var parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
  }

  function storySportId(data) {
    data = data || state.data || {};
    var profile = data.perfil || {};
    return positiveId(profile.id_esporte || data.id_esporte || data.esporte_id);
  }

  function resetTitleData() {
    state.titles = {
      summary: null,
      byMatch: Object.create(null),
      loadedMatches: Object.create(null),
      summaryUnavailable: false,
      contextsUnavailable: false
    };
    byId("titleMetrics").innerHTML = "";
    byId("titlesList").innerHTML = "";
    byId("titlesSection").hidden = true;
  }

  async function rpc(name, payload) {
    var response = await fetch(CONFIG.supabaseUrl + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: { apikey: CONFIG.apiKey, Authorization: "Bearer " + CONFIG.apiKey, "Content-Type": "application/json; charset=utf-8" },
      cache: "no-store",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(payload || {})
    });
    var text = await response.text();
    var result = {};
    try { result = text ? JSON.parse(text) : {}; } catch (error) { result = {}; }
    if (!response.ok) throw new Error(result.message || result.error || "falha_http_" + response.status);
    if (result && result.schema_version && result.data != null) {
      if (Array.isArray(result.data)) return { itens: result.data };
      return result.data;
    }
    return result;
  }

  function showToast(message, isError) {
    var toast = byId("toast");
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.classList.toggle("is-error", !!isError);
    toast.setAttribute("role", isError ? "alert" : "status");
    toast.setAttribute("aria-live", isError ? "assertive" : "polite");
    toast.hidden = false;
    state.toastTimer = window.setTimeout(function () { toast.hidden = true; }, 3800);
  }

  function showState(type, title, message) {
    var symbols = { invalid: "close", private: "lock", empty: "clock", success: "trophy" };
    byId("storyPage").hidden = true;
    var panel = byId("statePanel");
    panel.innerHTML = icon(symbols[type] || "clock") + "<h1>" + escapeHtml(title) + "</h1><p>" + escapeHtml(message) + "</p>" + (type === "invalid" ? "<button type=\"button\" data-retry>Tentar novamente</button>" : "");
    panel.hidden = false;
    panel.tabIndex = -1;
    try { panel.focus(); } catch (error) {}
  }

  function storyCodeFromUrl() {
    var value = new URLSearchParams(location.search).get("codigo") || "";
    return CODE_RE.test(value) ? value : "";
  }

  function invitationFromUrl() {
    var value = new URLSearchParams(location.search).get("convite") || "";
    return TOKEN_RE.test(value) ? value : "";
  }

  function optoutFromUrl() {
    var value = new URLSearchParams(location.search).get("optout") || "";
    return TOKEN_RE.test(value) ? value : "";
  }

  function removeSensitiveParametersFromAddressBar() {
    try {
      var clean = new URL(location.href);
      clean.searchParams.delete("convite");
      clean.searchParams.delete("optout");
      history.replaceState(null, "", clean.pathname + clean.search + clean.hash);
    } catch (error) {}
  }

  function safeInviteUrl(data) {
    var value = safeUrl(data && (data.convite_mmn_url || data.convite_url || data.url_convite) || "");
    if (value) {
      try {
        var parsed = new URL(value);
        if ((parsed.hostname === "turbotiger.com.br" || parsed.hostname.endsWith(".turbotiger.com.br")) && parsed.pathname.indexOf("/convite/") === 0) return parsed.href;
      } catch (error) {}
    }
    var ref = String(data && (data.mmn_ref || data.convite_ref || data.ref_convite) || "");
    return CODE_RE.test(ref) ? "https://turbotiger.com.br/convite/?ref=" + encodeURIComponent(ref) : "/";
  }

  function renderMetrics(summary) {
    var metrics = [
      { icon:"clock", label:"Confrontos", value:numberOf(summary.total) },
      { icon:"stadium", label:"No local", value:numberOf(summary.total_local || summary.presenciais) },
      { icon:"tv", label:"TV/outro meio", value:numberOf(summary.total_remoto || summary.remotos) },
      { icon:"group", label:"Contribuições", value:numberOf(summary.contribuicoes) }
    ];
    byId("storyMetrics").innerHTML = metrics.map(function (metric) { return "<div><dt>" + icon(metric.icon) + "<span>" + escapeHtml(metric.label) + "</span></dt><dd>" + escapeHtml(metric.value) + "</dd></div>"; }).join("");
  }

  function firstMetric(summary, names) {
    for (var index = 0; index < names.length; index += 1) {
      if (summary[names[index]] != null) return numberOf(summary[names[index]]);
    }
    return 0;
  }

  function titleNames(value, fallback) {
    var source = Array.isArray(value) && value.length ? value : value != null && value !== "" && !Array.isArray(value) ? [value] : fallback ? [fallback] : [];
    var seen = Object.create(null);
    return source.map(function (entry) {
      if (entry && typeof entry === "object") return entry.nome || entry.nome_time || entry.nome_clube || entry.time || entry.clube || "";
      return String(entry || "");
    }).map(function (name) { return String(name).trim(); }).filter(function (name) {
      var key = name.toLocaleLowerCase("pt-BR");
      if (!name || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function joinTitleNames(names) {
    if (names.length < 2) return names[0] || "";
    if (names.length === 2) return names[0] + " e " + names[1];
    return names.slice(0,-1).join(", ") + " e " + names[names.length - 1];
  }

  function titleDecisionStatus(item, required) {
    var status = String(item && item.decisao_status || "").toLowerCase();
    if (["completa", "incompleta", "nao_aplicavel"].indexOf(status) >= 0) return status;
    if (item && item.decisao_completa === true) return "completa";
    if (item && item.decisao_completa === false && required > 0) return "incompleta";
    return "nao_aplicavel";
  }

  function renderTitles() {
    var payload = state.titles.summary || {};
    var summary = payload.resumo || payload.summary || {};
    var titles = arrayOf(payload.titulos || payload.titles || payload.items);
    var metrics = [
      { label:"Títulos acompanhados", value:firstMetric(summary,["titulos_acompanhados","total_titulos"]) },
      { label:"Confrontos de título", value:firstMetric(summary,["confrontos_titulo_assistidos","confrontos_assistidos"]) },
      { label:"Decisões completas", value:firstMetric(summary,["decisoes_completas","finais_completas"]) },
      { label:"Confirmações vistas", value:firstMetric(summary,["confirmacoes_titulo_assistidas","confirmacoes_assistidas"]) },
      { label:"Principais no local", value:firstMetric(summary,["confrontos_principais_local","principais_local"]) },
      { label:"Clubes campeões", value:firstMetric(summary,["clubes_campeoes","total_clubes_campeoes"]) },
      { label:"Competições", value:firstMetric(summary,["competicoes","total_competicoes"]) }
    ];
    var hasData = titles.length > 0 || metrics.some(function (metric) { return metric.value > 0; });
    var section = byId("titlesSection");
    if (!hasData) {
      byId("titleMetrics").innerHTML = "";
      byId("titlesList").innerHTML = "";
      section.hidden = true;
      return;
    }
    byId("titleMetrics").innerHTML = metrics.map(function (metric) {
      return "<div><dt>" + escapeHtml(metric.label) + "</dt><dd>" + escapeHtml(metric.value) + "</dd></div>";
    }).join("");
    byId("titlesList").innerHTML = titles.map(function (item) {
      item = item || {};
      var competition = item.competicao || item.competition || "Competição";
      var season = item.temporada || item.season || "";
      var championFallback = item.campeao || item.campeao_nome || item.champion || "";
      var runnerUpFallback = item.vice || item.vice_campeao || item.vice_nome || item.runner_up || "";
      var champions = titleNames(item.campeoes || item.champions, championFallback);
      var runnersUp = titleNames(item.vices || item.runners_up, runnerUpFallback);
      var shared = item.titulo_compartilhado === true || String(item.titulo_compartilhado || "").toLowerCase() === "true" || champions.length > 1;
      var watched = firstMetric(item,["confrontos_titulo_assistidos","confrontos_assistidos","assistidos"]);
      var decisionWatched = firstMetric(item,["confrontos_decisao_assistidos"]);
      var required = firstMetric(item,["confrontos_decisao_total","confrontos_necessarios","necessarios"]);
      var decisionStatus = titleDecisionStatus(item, required);
      var decisionApplies = decisionStatus !== "nao_aplicavel" && required > 0;
      var result = [];
      if (champions.length) result.push((champions.length > 1 ? "Campeões: " : "Campeão: ") + joinTitleNames(champions));
      if (runnersUp.length) result.push((runnersUp.length > 1 ? "Vices: " : "Vice: ") + joinTitleNames(runnersUp));
      var count = decisionApplies
        ? decisionWatched + " de " + required + (required === 1 ? " confronto da decisão acompanhado" : " confrontos da decisão acompanhados")
        : watched > 0 ? watched + (watched === 1 ? " confronto de título acompanhado" : " confrontos de título acompanhados") : "";
      var flags = [];
      if (decisionStatus === "completa") flags.push("Decisão completa");
      else if (decisionStatus === "incompleta") flags.push("Decisão incompleta");
      if (shared) flags.push("Título compartilhado");
      if (item.confronto_principal_local === true || item.assistiu_principal_local === true) flags.push("Principal no local");
      return "<article class=\"hs-title-item\"><div><strong>" + escapeHtml(competition) + "</strong>" + (season ? "<span>" + escapeHtml(season) + "</span>" : "") + "</div>" + (result.length ? "<p>" + escapeHtml(result.join(" · ")) + "</p>" : "") + (count ? "<small>" + escapeHtml(count) + "</small>" : "") + (flags.length ? "<div class=\"hs-title-flags\">" + flags.map(function (flag) { return "<span>" + escapeHtml(flag) + "</span>"; }).join("") + "</div>" : "") + "</article>";
    }).join("");
    section.hidden = false;
  }

  function titleRoleLabel(item) {
    var roles = {
      final_unica:"Final",
      final_ida:"Final · ida",
      final_volta:"Final · volta",
      desempate:"Desempate",
      confirmacao_titulo:"Título confirmado",
      rodada_decisiva:"Rodada decisiva",
      entrega_taca:"Entrega da taça",
      final_fase:"Final da fase",
      relacionado:"Relacionado ao título"
    };
    var role = String(item && (item.papel_confronto || item.papel || item.tipo_vinculo || item.role) || "").toLowerCase();
    return roles[role] || "Confronto de título";
  }

  function titleRoleLabels(item) {
    var labels = [titleRoleLabel(item)];
    if (item && item.confronto_principal === true) labels.push("Principal");
    return labels;
  }

  function namesInPortuguese(names) {
    names = arrayOf(names).filter(Boolean);
    if (names.length < 2) return names[0] || "";
    return names.slice(0, -1).join(", ") + " e " + names[names.length - 1];
  }

  function titleBadges(item) {
    var matchId = positiveId(item && (item.id_confronto || item.cod_confronto));
    var titles = matchId ? arrayOf(state.titles.byMatch[String(matchId)]) : [];
    if (!titles.length) return "";
    var visible = titles.slice(0,2).map(function (title) {
      title = title || {};
      return titleRoleLabels(title).map(function (context, index) {
        return "<span class=\"hs-title-badge\">" + (index === 0 ? icon("trophy") : "") + "<span>" + escapeHtml(context) + "</span></span>";
      }).join("");
    });
    if (titles.length > visible.length) visible.push("<span class=\"hs-title-badge hs-title-badge-more\">+" + escapeHtml(titles.length - visible.length) + "</span>");
    return "<span class=\"hs-title-badges\">" + visible.join("") + "</span>";
  }

  function timelineItem(item) {
    var form = String(item.forma || item.modo || "remoto") === "local" ? "local" : "remoto";
    var home = item.time_casa || item.participante_casa || "";
    var away = item.time_fora || item.participante_fora || "";
    var hasScore = item.placar_casa != null && item.placar_fora != null;
    var title = home && away ? [home, hasScore ? item.placar_casa : "", "×", hasScore ? item.placar_fora : "", away].filter(function (value) { return value !== ""; }).join(" ") : item.titulo;
    var detail = form === "local" ? [item.local, item.cidade].filter(Boolean).join(" · ") || "No local do evento" : "TV/outro meio";
    var rawDate = item.data_partida || item.data || item.inicio_em;
    var formatted = formatDate(rawDate);
    var parts = formatted.split(" ");
    var companions = arrayOf(item.acompanhantes).map(function (person) { return person && person.nome; }).filter(Boolean);
    var competition = item.competicao || "";
    if (item.temporada && competition.toLowerCase().indexOf(String(item.temporada).toLowerCase()) < 0) competition += " " + item.temporada;
    var subline = [competition, detail].filter(Boolean).join(" · ");
    var companionsLine = companions.length ? "<small class=\"hs-timeline-companions\">Assistiu com " + escapeHtml(namesInPortuguese(companions)) + "</small>" : "";
    var wo = item.wo_time_casa === true || item.wo_time_fora === true;
    var titleHtml = home && away ? [
      { name:home, score:item.placar_casa, wo:item.wo_time_casa === true },
      { name:away, score:item.placar_fora, wo:item.wo_time_fora === true }
    ].map(function (team) {
      return "<span class=\"hs-timeline-team\"><span class=\"hs-timeline-team-name" + (team.wo ? " is-wo" : "") + "\">" + escapeHtml(team.name) + "</span>" + (hasScore ? "<span class=\"hs-timeline-score\">" + escapeHtml(team.score) + "</span>" : "") + "</span>";
    }).join("") : escapeHtml(title || "Confronto");
    return "<article class=\"hs-timeline-item\"><time datetime=\"" + escapeHtml(String(rawDate || "").slice(0,10)) + "\"><strong>" + escapeHtml(parts[0] || "") + "</strong><span>" + escapeHtml(parts.slice(1).join(" ")) + "</span>" + (wo ? "<em class=\"hs-wo\">W.O.</em>" : "") + "</time><span class=\"hs-timeline-node\"></span><div class=\"hs-timeline-copy\"><strong class=\"hs-timeline-match\" aria-label=\"" + escapeHtml(title || "Confronto") + "\">" + titleHtml + "</strong><span class=\"hs-timeline-meta\">" + escapeHtml(subline) + "</span>" + companionsLine + titleBadges(item) + "</div>" + icon(form === "local" ? "stadium" : "tv") + "</article>";
  }

  async function loadTitleContexts(items) {
    if (state.titles.contextsUnavailable) return;
    var requestCode = state.code;
    var ids = arrayOf(items).map(function (item) { return positiveId(item && (item.id_confronto || item.cod_confronto)); }).filter(function (id, index, values) {
      return id && values.indexOf(id) === index && !state.titles.loadedMatches[String(id)];
    });
    if (!ids.length || !CODE_RE.test(requestCode)) return;
    try {
      var result = await rpc("ie_titulos_confrontos_resumo_rpc", {
        p_ids_confrontos: ids,
        p_codigo_publico: requestCode,
        p_id_esporte: storySportId()
      });
      if (state.code !== requestCode) return;
      ids.forEach(function (id) {
        state.titles.loadedMatches[String(id)] = true;
        state.titles.byMatch[String(id)] = [];
      });
      arrayOf(result && (result.items || result.itens || result)).forEach(function (row) {
        row = row || {};
        var matchId = positiveId(row.id_confronto || row.cod_confronto);
        if (!matchId || ids.indexOf(matchId) < 0) return;
        var titles = arrayOf(row.titulos || row.titles);
        if (!titles.length && row.id_titulo) titles = [row];
        state.titles.byMatch[String(matchId)] = titles.filter(function (title) { return title && typeof title === "object"; });
      });
    } catch (error) {
      if (state.code === requestCode) state.titles.contextsUnavailable = true;
    }
  }

  async function loadTitleSummary(data) {
    var profile = data && data.perfil || {};
    var requestCode = state.code;
    if (profile.exibir_confrontos === false || !CODE_RE.test(requestCode) || state.titles.summaryUnavailable) {
      renderTitles();
      return;
    }
    try {
      var result = await rpc("ie_experiencia_titulos_resumo_rpc", {
        p_codigo_publico: requestCode,
        p_id_esporte: storySportId(data)
      });
      if (state.code !== requestCode) return;
      state.titles.summary = result && typeof result === "object" ? result : null;
    } catch (error) {
      if (state.code === requestCode) state.titles.summaryUnavailable = true;
    }
    if (state.code === requestCode) renderTitles();
  }

  function newPage(items) {
    return { items: items.slice(0,PAGE_LIMIT), nextCursor: null, hasMore: false, loading: false, initialized: false, failed: false };
  }

  function resetPagination(data) {
    state.pages.experiencias = newPage(arrayOf(data.linha_do_tempo || data.experiencias));
    state.pages.colaboracoes = newPage(arrayOf(data.colaboracoes));
  }

  function mergePageItems(section, current, incoming) {
    var key = section === "experiencias" ? "id_experiencia" : "id_contribuicao";
    var seen = Object.create(null);
    return current.concat(incoming).filter(function (item, index) {
      var value = item && item[key];
      var identity = value == null ? "fallback:" + index + ":" + JSON.stringify(item || {}) : "id:" + String(value);
      if (seen[identity]) return false;
      seen[identity] = true;
      return true;
    });
  }

  function updatePageButton(section) {
    var page = state.pages[section];
    var button = byId(section === "experiencias" ? "loadMoreButton" : "loadMoreContributionsButton");
    button.disabled = page.loading;
    button.setAttribute("aria-busy", page.loading ? "true" : "false");
    button.textContent = page.loading ? "Carregando…" : page.failed ? "Tentar novamente" : "Ver mais";
    button.hidden = !page.loading && !page.failed && (!page.initialized || !page.hasMore);
  }

  async function loadHistorySection(section, reset) {
    var page = state.pages[section];
    if (!page || page.loading || (!reset && page.initialized && !page.hasMore)) return;
    var requestCode = state.code;
    page.loading = true;
    page.failed = false;
    if (section === "experiencias") renderTimeline(state.data || {});
    else renderContributions(state.data || {});
    try {
      var result = await rpc("ie_experiencia_historia_itens_rpc", {
        p_codigo_publico: requestCode,
        p_id_esporte: null,
        p_secao: section,
        p_cursor: reset ? null : page.nextCursor,
        p_limite: PAGE_LIMIT
      });
      if (state.code !== requestCode) return;
      var incoming = arrayOf(result && result.itens);
      page.items = reset ? incoming : mergePageItems(section, page.items, incoming);
      if (section === "experiencias") await loadTitleContexts(incoming);
      page.nextCursor = result && result.next_cursor ? String(result.next_cursor) : null;
      page.hasMore = !!(result && result.tem_mais && page.nextCursor);
      page.initialized = true;
    } catch (error) {
      if (state.code === requestCode) {
        page.failed = true;
        showToast(section === "experiencias" ? "Não foi possível carregar a linha do tempo." : "Não foi possível carregar as colaborações.", true);
      }
    } finally {
      page.loading = false;
      if (state.code === requestCode) {
        if (section === "experiencias") renderTimeline(state.data || {});
        else renderContributions(state.data || {});
      }
    }
  }

  function renderTimeline(data) {
    var profile = data.perfil || {};
    var page = state.pages.experiencias;
    var rows = page.items;
    if (profile.exibir_confrontos === false) {
      byId("timelineSection").hidden = true;
      return;
    }
    byId("timelineSection").hidden = false;
    byId("timeline").innerHTML = rows.length ? rows.map(timelineItem).join("") : "<div class=\"hs-empty\">" + (page.loading ? "Carregando linha do tempo…" : page.failed ? "Não foi possível carregar a linha do tempo." : "Este membro ainda não publicou confrontos em sua linha do tempo.") + "</div>";
    updatePageButton("experiencias");
  }

  function renderContributions(data) {
    var profile = data.perfil || {};
    var page = state.pages.colaboracoes;
    var rows = page.items;
    var section = byId("contributionsSection");
    if (profile.exibir_colaboracoes === false || (!rows.length && !page.loading && !page.failed)) { section.hidden = true; return; }
    byId("contributions").innerHTML = rows.length ? rows.map(function (item) {
      var match = [item.time_casa, item.time_fora].filter(Boolean).join(" × ") || "Confronto revisado";
      var detail = [item.competicao, item.tipo === "inclusao" ? "Confronto incluído" : "Informação corrigida"].filter(Boolean).join(" · ");
      var rawDate = item.aprovada_em || item.data;
      return "<article class=\"hs-contribution\"><time datetime=\"" + escapeHtml(String(rawDate || "").slice(0,10)) + "\">" + escapeHtml(formatDate(rawDate)) + "</time><span><strong>" + escapeHtml(match) + "</strong><small>" + escapeHtml(detail) + "</small></span></article>";
    }).join("") : "<div class=\"hs-empty\">" + (page.loading ? "Carregando colaborações…" : "Não foi possível carregar as colaborações.") + "</div>";
    section.hidden = false;
    updatePageButton("colaboracoes");
  }

  function renderRanking(data) {
    var profile = data.perfil || {};
    var payload = data.ranking_experiencias;
    var rows = payload ? arrayOf(payload) : [];
    var section = byId("rankingSection");
    if (profile.exibir_ranking === false || !payload || !rows.length) {
      byId("ranking").innerHTML = "";
      section.hidden = true;
      return;
    }
    byId("ranking").innerHTML = rows.map(function (item) {
      var detail = numberOf(item.pontos) + " pontos · " + numberOf(item.total_local) + " no local · " + numberOf(item.total_remoto) + " por TV/outro meio";
      return "<li><span class=\"hs-ranking-position\">#" + escapeHtml(numberOf(item.posicao)) + "</span><span><strong>" + escapeHtml(item.codinome || "Membro Turbo Tiger") + "</strong><small>" + escapeHtml(detail) + "</small></span></li>";
    }).join("");
    section.hidden = false;
  }

  function renderStory(data) {
    data = data || {};
    var profile = data.perfil || {};
    var summary = data.resumo || {};
    if (profile.ativo === false || data.status === "privada") {
      showState("private", "Perfil privado", "Este membro não disponibilizou sua história esportiva publicamente.");
      return false;
    }
    state.data = data;
    state.code = String(profile.codigo_publico || data.codigo_publico || data.codigo || state.code);
    resetTitleData();
    resetPagination(data);
    var name = profile.nome_exibicao || profile.codinome || "Membro Turbo Tiger";
    byId("profileName").textContent = name;
    var codename = profile.exibir_codinome === false || !profile.codinome || profile.codinome === name ? "" : profile.codinome;
    byId("profileCodename").textContent = codename;
    byId("profileCodename").hidden = !codename;
    byId("profileSport").textContent = profile.esporte || data.esporte_nome || "Esporte";
    byId("profileAvatar").textContent = initials(name);
    if (summary.contribuicoes == null) summary.contribuicoes = arrayOf(data.colaboracoes).length;
    renderMetrics(summary);
    renderRanking(data);
    renderTitles();
    renderTimeline(data);
    renderContributions(data);
    byId("inviteDownloadLink").href = safeInviteUrl(profile);
    byId("statePanel").hidden = true;
    byId("storyPage").hidden = false;
    return true;
  }

  async function loadStory(code) {
    if (!CODE_RE.test(code || "")) { showState("invalid", "Código inválido", "Verifique o link recebido e tente novamente."); return; }
    try {
      var data = await rpc("ie_experiencia_historia_bootstrap_rpc", { p_codigo_publico: code, p_id_esporte: null });
      if (!renderStory(data || {})) return;
      var profile = data && data.perfil || {};
      var loads = [loadTitleSummary(data || {})];
      if (profile.exibir_confrontos !== false) loads.push(loadHistorySection("experiencias", true));
      if (profile.exibir_colaboracoes !== false) loads.push(loadHistorySection("colaboracoes", true));
      await Promise.all(loads);
    } catch (error) {
      showState("invalid", "História indisponível", "O código pode ter expirado, sido renovado ou a página pode ter sido desativada.");
    }
  }

  function renderInvitation(invitation) {
    var match = invitation.confronto || {};
    var member = invitation.convidador_codinome || "Um membro da comunidade Turbo Tiger";
    var addressee = invitation.destinatario_nome ? invitation.destinatario_nome + ", " : "";
    var title = match.titulo || "Confronto esportivo";
    var detail = [formatDate(match.data), match.hora ? String(match.hora).slice(0,5) : "", match.competicao, match.local, match.cidade].filter(Boolean).join(" · ");
    var panel = byId("invitePanel");
    var heading = byId("storyPage").hidden ? "h1" : "h2";
    if (invitation.status === "confirmado" || invitation.respondido === true) {
      panel.innerHTML = "<" + heading + ">Lembrança confirmada</" + heading + "><p>Você confirmou que assistiram juntos. A história compartilhada continua disponível abaixo.</p>";
      if (byId("storyPage").hidden) byId("statePanel").hidden = true;
      panel.hidden = false;
      return;
    }
    panel.innerHTML = "<" + heading + ">" + escapeHtml(addressee + member) + " disse que assistiu com você</" + heading + "><p>Confirme apenas se reconhecer esta lembrança. O Turbo Tiger não considera a informação comprovada até sua resposta.</p><div class=\"hs-invite-match\"><strong>" + escapeHtml(title) + "</strong><span>" + escapeHtml(detail) + "</span></div><label class=\"hs-invite-consent\"><input id=\"inviteNameConsent\" type=\"checkbox\"><span>Se eu confirmar, autorizo que o nome informado no convite apareça nesta lembrança pública.</span></label><div class=\"hs-invite-actions\"><button type=\"button\" data-invite-response=\"confirmar\">Sim, assistimos juntos</button><button type=\"button\" data-invite-response=\"contestar\">Não reconheço</button><button type=\"button\" data-invite-response=\"recusar\">Prefiro não responder</button></div><button type=\"button\" class=\"hs-invite-optout\" data-invite-response=\"optout\">Não quero receber novos convites</button>";
    if (byId("storyPage").hidden) byId("statePanel").hidden = true;
    panel.hidden = false;
    try { panel.focus(); } catch (error) {}
  }

  function renderOptoutPanel(title, message) {
    var panel = byId("invitePanel");
    var heading = byId("storyPage").hidden ? "h1" : "h2";
    panel.innerHTML = "<" + heading + ">" + escapeHtml(title) + "</" + heading + "><p>" + escapeHtml(message) + "</p><div class=\"hs-invite-actions hs-invite-actions-single\"><button type=\"button\" data-invite-response=\"optout\">Não quero receber novos convites</button></div>";
    if (byId("storyPage").hidden) byId("statePanel").hidden = true;
    panel.hidden = false;
    try { panel.focus(); } catch (error) {}
  }

  async function loadInvitation(token) {
    try {
      var result = await rpc("ie_experiencia_convite_publico_rpc", { p_token: token });
      var invitation = result && result.convite || {};
      var storyCode = String(invitation.codigo_historia || state.code || "");
      state.code = CODE_RE.test(storyCode) ? storyCode : state.code;
      if (CODE_RE.test(storyCode)) await loadStory(storyCode);
      else if (!state.code) {
        byId("statePanel").hidden = true;
        byId("storyPage").hidden = true;
      }
      renderInvitation(invitation || {});
    } catch (error) {
      renderOptoutPanel("Convite indisponível", "Este convite pode ter expirado, sido revogado ou já ter sido respondido. Você ainda pode impedir novos convites para este endereço.");
    }
  }

  async function optOutInvitation() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-invite-response]"));
    buttons.forEach(function (button) { button.disabled = true; });
    try {
      await rpc("ie_experiencia_email_optout_rpc", { p_token: state.invitation });
      byId("invitePanel").hidden = true;
      var message = "Preferência registrada. Você não receberá novos convites neste endereço.";
      if (!byId("storyPage").hidden && state.data) showToast(message, false);
      else showState("success", "Preferência registrada", message);
    } catch (error) {
      showToast("Não foi possível registrar sua preferência agora.", true);
      buttons.forEach(function (button) { button.disabled = false; });
    }
  }

  async function respondInvitation(response) {
    if (response === "optout") { await optOutInvitation(); return; }
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-invite-response]"));
    buttons.forEach(function (button) { button.disabled = true; });
    try {
      var consent = response === "confirmar" && !!(byId("inviteNameConsent") && byId("inviteNameConsent").checked);
      await rpc("ie_experiencia_convite_responder_rpc", { p_token: state.invitation, p_resposta: response, p_autoriza_exibicao_nome: consent });
      byId("invitePanel").hidden = true;
      var message = response === "confirmar" ? "Obrigado por confirmar esta lembrança." : response === "contestar" ? "Contestação registrada para análise." : "Resposta registrada.";
      if (CODE_RE.test(state.code)) {
        showToast(message, false);
        await loadStory(state.code);
      } else {
        showState("success", "Resposta registrada", message);
      }
    } catch (error) {
      showToast("Não foi possível registrar sua resposta agora.", true);
      buttons.forEach(function (button) { button.disabled = false; });
    }
  }

  async function shareStory() {
    var shareUrl = new URL(location.href);
    shareUrl.search = "";
    if (CODE_RE.test(state.code)) shareUrl.searchParams.set("codigo", state.code);
    var url = shareUrl.href.split("#")[0];
    var payload = { title:"História esportiva no Turbo Tiger", text:"Veja esta história esportiva compartilhada pela comunidade Turbo Tiger.", url:url };
    try {
      if (navigator.share) await navigator.share(payload);
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); showToast("Link copiado.", false); }
      else throw new Error("indisponivel");
    } catch (error) {
      if (String(error && error.name) !== "AbortError") showToast("Não foi possível compartilhar agora.", true);
    }
  }

  document.addEventListener("click", function (event) {
    var responseButton = event.target.closest("[data-invite-response]");
    if (responseButton) { respondInvitation(responseButton.getAttribute("data-invite-response")); return; }
    if (event.target.closest("[data-retry]")) { location.reload(); return; }
  });
  byId("shareButton").addEventListener("click", shareStory);
  byId("loadMoreButton").addEventListener("click", function () { loadHistorySection("experiencias", !state.pages.experiencias.initialized); });
  byId("loadMoreContributionsButton").addEventListener("click", function () { loadHistorySection("colaboracoes", !state.pages.colaboracoes.initialized); });

  async function init() {
    var params = new URLSearchParams(location.search);
    var hadInvitationParameter = params.has("convite");
    var hadOptoutParameter = params.has("optout");
    var invitationToken = invitationFromUrl();
    var optoutToken = optoutFromUrl();
    state.code = storyCodeFromUrl();
    state.invitation = optoutToken || invitationToken;
    state.invitationMode = optoutToken ? "optout" : invitationToken ? "convite" : "";
    if (hadInvitationParameter || hadOptoutParameter) removeSensitiveParametersFromAddressBar();
    if ((hadInvitationParameter || hadOptoutParameter) && !state.invitation && !state.code) {
      showState("invalid", hadOptoutParameter ? "Link de preferência indisponível" : "Convite indisponível", "Verifique o link recebido e tente novamente.");
      return;
    }
    if (!state.code && !state.invitation) { showState("invalid", "Código obrigatório", "Abra esta página pelo link seguro compartilhado por um membro Turbo Tiger."); return; }
    if (state.code) await loadStory(state.code);
    if (state.invitationMode === "optout") renderOptoutPanel("Preferências de convites", "Confirme abaixo se não quiser receber novos convites do Turbo Tiger neste endereço.");
    else if (state.invitation) await loadInvitation(state.invitation);
    else if (hadInvitationParameter || hadOptoutParameter) showToast("O link informado não é válido.", true);
  }

  init();
}());
