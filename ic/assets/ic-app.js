(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  var Core = IC.Core, UI = IC.UI, Bridge = IC.Bridge;

  var fontesLegendasCentral = {
    "legenda_ic_central_preparando": "Preparando a Central",
    "legenda_ic_central_validando_disponibilidade": "Primeiro validamos a sessão, as capacidades e as políticas disponíveis.",
    "legenda_ic_central_recurso_indisponivel": "Recurso indisponível",
    "legenda_ic_central_area_desativada_politica": "Esta área está desativada pela política operacional atual.",
    "legenda_ic_central_area_desativada": "Área temporariamente desativada",
    "legenda_ic_central_demais_controles_preservados": "Os demais controles e o histórico permanecem preservados.",
    "legenda_ic_central_captura_nao_informada": "Captura não informada",
    "legenda_ic_central_sessao_ativa": "Sessão ativa",
    "legenda_ic_central_sem_sessao": "Nenhuma sessão ativa",
    "legenda_ic_central_atualizado": "Atualizado ",
    "legenda_ic_central_falha_atualizacao": "Não foi possível atualizar as informações.",
    "legenda_ic_central_origem_historico": "Origem efetiva: seu histórico",
    "legenda_ic_central_origem_comunidade": "Origem efetiva: comunidade elegível",
    "legenda_ic_central_origem_ambos": "Origem efetiva: seu histórico e comunidade elegível",
    "legenda_ic_central_origem_indisponivel": "Origem efetiva indisponível",
    "legenda_ic_central_notificacao": "Notificação",
    "legenda_ic_central_sem_notificacoes": "Nenhuma notificação",
    "legenda_ic_central_notificacoes_descricao": "Lembretes, alertas de controle e atualizações aparecerão aqui.",
    "legenda_ic_central_central_controle": "Central de controle",
    "legenda_ic_central_notificacoes": "Notificações",
    "legenda_ic_central_explorar_central": "Explorar a Central",
    "legenda_ic_central_meu_historico": "Meu histórico",
    "legenda_ic_central_jogos_passaportes": "Jogos e passaportes",
    "legenda_ic_central_comunidade": "Comunidade",
    "legenda_ic_central_regras_pausas": "Regras e pausas",
    "legenda_ic_central_alertas_configuracoes": "Meus alertas e configurações",
    "legenda_ic_central_aba_aberta": "Aba {secao} aberta."
  };
  if (root.TurboTigerLegendas) root.TurboTigerLegendas.registrar(fontesLegendasCentral);
  function legendaCentral(chave, valores) {
    if (root.TurboTigerLegendas) return root.TurboTigerLegendas.texto(chave, valores);
    return fontesLegendasCentral[chave].replace(/\{([a-z][a-z0-9_]*)\}/g, function (token, nome) { return valores && Object.prototype.hasOwnProperty.call(valores, nome) ? String(valores[nome]) : token; });
  }

  var store = IC.Store.createStore();
  var router = IC.Router;
  var SECTION_POLICIES = {
    "planejar": { all: ["ic_planned_session_enabled", "ic_reminders_enabled"] },
    "ao-vivo": { all: ["ic_live_clock_enabled"] },
    "historico": { all: ["ic_historical_report_enabled"] },
    "estatisticas": { any: ["ic_personal_insights_enabled", "ic_interval_lab_enabled", "ic_bankroll_curve_enabled", "ic_significant_win_enabled", "ic_session_risk_enabled"] },
    "comunidade": { all: ["ic_community_report_enabled"] },
    "coach": { all: ["ic_ai_coach_enabled"] }
  };
  var route = router.parse(root.location && root.location.search || "");
  var screens = {};
  var sessionRequestPending = false;
  var pullRefreshActive = false;
  var api = IC.Api.create({
    getSession: function () { return store.getState().session; },
    getSessionEpoch: function () { return store.getState().sessionEpoch; }
  });
  var liveChannel = IC.LiveChannel.create({
    getSession: function () { return store.getState().session; },
    getTopic: function () {
      var data = store.getState().bootstrap && store.getState().bootstrap.data || {};
      return data.realtime_topic || data.topico_realtime || null;
    },
    onInvalidate: function () { refreshCurrent(true); }
  });

  function showGate(kind) {
    document.getElementById("icLoadingPanel").hidden = kind !== "loading";
    document.getElementById("icAccessPanel").hidden = kind !== "access";
    document.getElementById("icApp").hidden = kind !== "app";
  }

  function hasAuthorizedSession() {
    return Bridge.hasBridge() && Bridge.isAuthorizedDocument() && !!store.getState().session;
  }

  function screenDeps(section, container) {
    return {
      api: api,
      store: store,
      container: container,
      route: function () { return route; },
      navigate: navigate,
      loadBootstrap: loadBootstrap,
      featureEnabled: function (name) {
        var flags = store.getState().features || {};
        return flags[name] === true;
      }
    };
  }

  function sectionEnabled(section) {
    var policy = SECTION_POLICIES[section], flags = store.getState().features || {};
    if (!policy) return true;
    if (policy.all && !policy.all.every(function (flag) { return flags[flag] === true; })) return false;
    if (policy.any && !policy.any.some(function (flag) { return flags[flag] === true; })) return false;
    return true;
  }

  function getScreen(section) {
    if (screens[section]) return screens[section];
    var factory = IC.Screens && IC.Screens[section];
    var container = document.querySelector('[data-panel="' + section + '"]');
    if (!factory || !container) return null;
    screens[section] = factory(screenDeps(section, container));
    return screens[section];
  }

  function activateSection(section, focusTab) {
    if (!hasAuthorizedSession()) return;
    section = Core.validSection(section);
    route.section = section;
    store.set({ activeSection: section, route: route });
    Array.prototype.slice.call(document.querySelectorAll("[role='tab'][data-section]")).forEach(function (tab) {
      var active = tab.dataset.section === section;
      tab.hidden = ["visao-geral", "planejar", "ao-vivo", "estatisticas"].indexOf(tab.dataset.section) < 0;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && !tab.hidden) {
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (focusTab) tab.focus();
      }
    });
    var more = document.getElementById("icMoreSections");
    if (more) more.classList.toggle("is-active", ["visao-geral", "planejar", "ao-vivo", "estatisticas"].indexOf(section) < 0);
    Array.prototype.slice.call(document.querySelectorAll("[role='tabpanel'][data-panel]")).forEach(function (panel) { panel.hidden = panel.dataset.panel !== section; });
    var bootstrap = store.getState().bootstrap;
    if (section !== "visao-geral" && (!bootstrap || bootstrap.status !== "ready")) {
      var waitingContainer = document.querySelector('[data-panel="' + section + '"]');
      if (waitingContainer) {
        waitingContainer.innerHTML = UI.sectionHeader(legendaCentral("legenda_ic_central_preparando"), legendaCentral("legenda_ic_central_validando_disponibilidade")) + (bootstrap && bootstrap.status === "error" ? UI.state({ type: bootstrap.error && bootstrap.error.code === "offline" ? "offline" : "unavailable", message: bootstrap.error && bootstrap.error.message }) : UI.state({ type: "loading", retry: false }));
      }
      return;
    }
    if (store.getState().bootstrap && store.getState().bootstrap.status === "ready" && !sectionEnabled(section)) {
      var disabledContainer = document.querySelector('[data-panel="' + section + '"]');
      if (disabledContainer) disabledContainer.innerHTML = UI.sectionHeader(legendaCentral("legenda_ic_central_recurso_indisponivel"), legendaCentral("legenda_ic_central_area_desativada_politica")) + UI.state({ type: "unavailable", title: legendaCentral("legenda_ic_central_area_desativada"), message: legendaCentral("legenda_ic_central_demais_controles_preservados"), retry: false });
      return;
    }
    var screen = getScreen(section);
    if (screen) { screen.container = document.querySelector('[data-panel="' + section + '"]'); screen.container.innerHTML = screen.render(); screen.load(false); }
    UI.announce(legendaCentral("legenda_ic_central_aba_aberta", { secao: section.replace(/-/g, " ") }));
  }

  function navigate(target, replace) {
    var next = typeof target === "string" ? { section: target } : Object.assign({}, target || {});
    route = Object.assign({}, route, next, { section: Core.validSection(next.section || route.section) });
    var url = root.location.pathname + router.toSearch(route, root.location.search);
    if (replace) root.history.replaceState(route, "", url);
    else root.history.pushState(route, "", url);
    activateSection(route.section, false);
    root.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  async function loadBootstrap(force) {
    if (!hasAuthorizedSession()) return null;
    var current = store.getState().bootstrap;
    if (!force && current && (current.status === "ready" || current.status === "loading")) return current;
    store.set({ bootstrap: { status: "loading", data: current && current.data || null, updatedAt: current && current.updatedAt || null } });
    rerender("visao-geral");
    try {
      var result = await api.rpc("ic_contexto_rpc", {}, { key: "central:context" });
      var resource = { status: "ready", data: result.data || {}, meta: result.meta || {}, version: result.version, updatedAt: (result.data || {}).updated_at || (result.data || {}).generated_at || (result.meta || {}).generated_at || null };
      var receivedFlags = resource.data.feature_flags || resource.data.flags || {};
      var featureFlags = {};
      Core.FEATURE_FLAGS.forEach(function (flag) { featureFlags[flag] = receivedFlags[flag] === true; });
      featureFlags.ic_predictive_legacy_enabled = false;
      store.set({ bootstrap: resource, features: featureFlags });
      renderHeader(resource.data);
      activateSection(route.section, false);
      liveChannel.renew();
      return resource;
    } catch (error) {
      if (error.code === "aborted" || error.code === "stale_session") return null;
      var failed = { status: "error", error: error, data: current && current.data || null, updatedAt: current && current.updatedAt || null };
      store.set({ bootstrap: failed });
      renderHeader(failed.data || {});
      activateSection(route.section, false);
      if (/^http_401/.test(error.code || "")) Bridge.requestSession(route.loadGeneration);
      return failed;
    }
  }

  function renderHeader(data) {
    data = data || {};
    var capture = data.capture || data.captura || {};
    var captureNode = document.getElementById("icCaptureStatus");
    if (captureNode) captureNode.innerHTML = '<span class="ic-status-dot ic-status-dot--' + Core.statusTone(capture.status || capture.estado || "neutral") + '"></span><span>' + Core.escapeHtml(capture.label || capture.rotulo || legendaCentral("legenda_ic_central_captura_nao_informada")) + '</span>';
    var globalSession = data.global_session || data.sessao_global || {};
    var sessionActive = globalSession.active === true || globalSession.ativa === true;
    if (captureNode) captureNode.hidden = !(globalSession.active || globalSession.ativa);
    var sessionDot = document.getElementById("icHeaderSessionDot");
    if (sessionDot) {
      sessionDot.classList.toggle("is-active", sessionActive);
      sessionDot.setAttribute("aria-label", sessionActive ? legendaCentral("legenda_ic_central_sessao_ativa") : legendaCentral("legenda_ic_central_sem_sessao"));
      sessionDot.title = sessionActive ? legendaCentral("legenda_ic_central_sessao_ativa") : legendaCentral("legenda_ic_central_sem_sessao");
    }
    var statusStrip = document.getElementById("icStatusStrip");
    if (statusStrip) statusStrip.hidden = !sessionActive;
    var header = document.querySelector(".ic-header");
    if (header) header.classList.toggle("has-active-session", sessionActive);
    var updated = document.getElementById("icLastUpdated");
    var updatedAt = data.updated_at || data.atualizado_em || data.generated_at;
    if (updated) updated.textContent = updatedAt ? legendaCentral("legenda_ic_central_atualizado") + Core.formatDateTime(updatedAt, { hour: "2-digit", minute: "2-digit" }) : "";
    var notifications = data.notifications || data.notificacoes || {};
    var dot = document.getElementById("icNotificationDot");
    if (dot) dot.hidden = !(Number(notifications.unread || notifications.nao_lidas || 0) > 0);
  }

  function rerender(section) {
    var screen = screens[section];
    if (!screen) return;
    var container = document.querySelector('[data-panel="' + section + '"]');
    if (container) container.innerHTML = screen.render();
  }

  async function refreshCurrent(force) {
    if (!hasAuthorizedSession()) return;
    await loadBootstrap(true);
    var screen = getScreen(route.section);
    if (screen && route.section !== "visao-geral") await screen.load(force !== false);
  }

  function setPullRefreshState(progress, refreshing) {
    var indicator = document.getElementById("icPullRefreshIndicator");
    if (!indicator) return;
    var value = Math.max(0, Math.min(1, Number(progress) || 0));
    indicator.style.setProperty("--ic-pull-rotation", Math.round(value * 240) + "deg");
    indicator.classList.toggle("is-visible", value > 0 || !!refreshing);
    indicator.classList.toggle("is-refreshing", !!refreshing);
  }

  function setupPullToRefresh() {
    var tracking = false;
    var startY = 0;
    var progress = 0;
    var threshold = 76;

    document.addEventListener("touchstart", function (event) {
      var sheet = document.getElementById("icSheet");
      if (pullRefreshActive || !hasAuthorizedSession() || root.scrollY > 0 ||
          (sheet && !sheet.hidden) || !event.touches || event.touches.length !== 1) {
        tracking = false;
        return;
      }
      tracking = true;
      progress = 0;
      startY = event.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchmove", function (event) {
      if (!tracking || !event.touches || event.touches.length !== 1) return;
      progress = Math.min(1, Math.max(0, event.touches[0].clientY - startY) / threshold);
      setPullRefreshState(progress, false);
    }, { passive: true });

    function release() {
      if (!tracking) return;
      tracking = false;
      if (progress < 1) {
        setPullRefreshState(0, false);
        progress = 0;
        return;
      }
      pullRefreshActive = true;
      setPullRefreshState(1, true);
      Promise.resolve(refreshCurrent(true)).catch(function (error) {
        UI.toast(error && error.message || legendaCentral("legenda_ic_central_falha_atualizacao"), true);
      }).finally(function () {
        root.setTimeout(function () {
          pullRefreshActive = false;
          setPullRefreshState(0, false);
        }, 220);
      });
      progress = 0;
    }

    document.addEventListener("touchend", release, { passive: true });
    document.addEventListener("touchcancel", release, { passive: true });
  }

  function notificationSheet() {
    var data = store.getState().bootstrap && store.getState().bootstrap.data || {};
    var notifications = data.notifications || data.notificacoes || {};
    var items = Core.normalizeArray(notifications.items || notifications.itens);
    var html = items.length ? '<div class="ic-list">' + items.map(function (item) {
      var effectiveSource = item.effective_source || item.fonte_efetiva;
      var isHistoricalPattern = !!(item.id_assinatura_estatistica || item.statistical_subscription_id || item.codigo_hipotese || item.hypothesis_code);
      var sourceLabel = effectiveSource === "pessoal" ? legendaCentral("legenda_ic_central_origem_historico") : effectiveSource === "comunidade" ? legendaCentral("legenda_ic_central_origem_comunidade") : effectiveSource === "ambos" ? legendaCentral("legenda_ic_central_origem_ambos") : isHistoricalPattern ? legendaCentral("legenda_ic_central_origem_indisponivel") : "";
      var detail = [item.message || item.mensagem || "", sourceLabel].filter(Boolean).join(" · ");
      return UI.listRow(item.title || item.titulo || legendaCentral("legenda_ic_central_notificacao"), detail, item.created_at || item.criado_em ? Core.formatDateTime(item.created_at || item.criado_em) : "");
    }).join("") + '</div>' : UI.state({ type: "empty", title: legendaCentral("legenda_ic_central_sem_notificacoes"), message: legendaCentral("legenda_ic_central_notificacoes_descricao"), retry: false });
    UI.openSheet({ eyebrow: legendaCentral("legenda_ic_central_central_controle"), title: legendaCentral("legenda_ic_central_notificacoes"), html: html });
  }

  function activeScreen() { return screens[route.section] || getScreen(route.section); }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var routeNode = event.target.closest("[data-route]");
      if (routeNode) { event.preventDefault(); UI.closeSheet(); navigate({ section: routeNode.dataset.route }); return; }
      var tab = event.target.closest("[role='tab'][data-section]");
      if (tab) { event.preventDefault(); navigate({ section: tab.dataset.section }); return; }
      var globalAction = event.target.closest("[data-global-action]");
      if (globalAction) {
        event.preventDefault();
        if (globalAction.dataset.globalAction === "close") Bridge.close(route.loadGeneration);
        if (globalAction.dataset.globalAction === "notifications") notificationSheet();
        if (globalAction.dataset.globalAction === "sections") UI.openSheet({ title: legendaCentral("legenda_ic_central_explorar_central"), html: '<div class="ic-quick-actions">' + [["historico", legendaCentral("legenda_ic_central_meu_historico"), "history"], ["jogos", legendaCentral("legenda_ic_central_jogos_passaportes"), "game"], ["comunidade", legendaCentral("legenda_ic_central_comunidade"), "community"], ["regras-pausas", legendaCentral("legenda_ic_central_regras_pausas"), "shield"], ["coach", "Tiger Coach", "coach"], ["configuracoes", legendaCentral("legenda_ic_central_alertas_configuracoes"), "bell"]].filter(function (item) { return sectionEnabled(item[0]); }).map(function (item) { return UI.button(item[1], { route: item[0], icon: item[2] }); }).join("") + '</div>' });
        return;
      }
      var actionNode = event.target.closest("[data-screen-action]");
      if (actionNode) { event.preventDefault(); var screen = activeScreen(); if (screen && screen.handleAction) screen.handleAction(actionNode.dataset.screenAction, actionNode.dataset.actionValue, actionNode); }
    });

    document.addEventListener("submit", function (event) {
      var screen = activeScreen();
      if (screen && screen.handleSubmit) { event.preventDefault(); screen.handleSubmit(event.target); }
    });

    document.addEventListener("change", function (event) {
      var screen = activeScreen();
      if (screen && screen.handleChange) screen.handleChange(event.target);
    });

    document.getElementById("icTabs").addEventListener("keydown", function (event) {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) < 0) return;
      var tabs = Array.prototype.slice.call(document.querySelectorAll("[role='tab'][data-section]")).filter(function (tab) { return !tab.hidden; });
      var index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = tabs.length - 1;
      else index = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      navigate({ section: tabs[index].dataset.section });
      tabs[index].focus();
    });

    root.addEventListener("turbotiger:idioma", function () {
      if (!root.TurboTigerLegendas || !hasAuthorizedSession()) return;
      Object.keys(screens).forEach(function (section) {
        var container = document.querySelector('[data-panel="' + section + '"]');
        if (container) root.TurboTigerLegendas.atualizarApresentacao(container, screens[section].render());
      });
      var bootstrap = store.getState().bootstrap;
      if (bootstrap) renderHeader(bootstrap.data || {});
    });
    root.addEventListener("popstate", function () { route = router.parse(root.location.search); activateSection(route.section, false); });
    root.addEventListener("online", function () { store.set({ online: true }); refreshCurrent(true); });
    root.addEventListener("offline", function () { store.set({ online: false }); rerender(route.section); });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && store.getState().session) refreshCurrent(true); });
  }

  function clearSession() {
    api.cancelAll();
    liveChannel.stop();
    disposeScreens();
    store.clearSession();
    screens = {};
    UI.closeSheet();
    showGate("loading");
    sessionRequestPending = false;
    requestNativeSession();
  }

  function nativeBridgeReady() {
    if (store.getState().session || !Bridge.hasBridge() || !Bridge.isAuthorizedDocument()) return;
    showGate("loading");
    requestNativeSession();
  }

  function openNativeSection(context) {
    if (!context || context.section !== "estatisticas") return false;
    store.set({ statisticsNotificationContext: context });
    if (!store.getState().session) return true;
    var subsection = router.SUBSECTIONS.indexOf(context.escopo_estatistico) >= 0 ? context.escopo_estatistico : "laboratorio";
    navigate({ section: "estatisticas", subsection: subsection, insightId: context.id_insight_evidencia || context.id_assinatura_estatistica });
    return true;
  }

  function requestNativeSession() {
    if (sessionRequestPending) return true;
    sessionRequestPending = Bridge.requestSession(route.loadGeneration);
    if (!sessionRequestPending) showGate("access");
    return sessionRequestPending;
  }

  function receiveSession(session) {
    if (!Bridge.hasBridge() || !Bridge.isAuthorizedDocument()) { showGate("access"); return; }
    sessionRequestPending = false;
    api.cancelAll();
    liveChannel.stop();
    disposeScreens();
    store.setSession(session);
    screens = {};
    showGate("app");
    renderHeader({});
    activateSection(route.section, false);
    loadBootstrap(true);
    liveChannel.start();
    Bridge.post("central_ready", { carga: route.loadGeneration || null, section: route.section });
    var pendingContext = store.getState().statisticsNotificationContext;
    if (pendingContext) openNativeSection(pendingContext);
  }

  function disposeScreens() {
    Object.keys(screens).forEach(function (key) { if (screens[key] && typeof screens[key].dispose === "function") screens[key].dispose(); });
  }

  function initialize() {
    UI.bindGlobalSheet();
    bindEvents();
    setupPullToRefresh();
    Bridge.bind({ onSession: receiveSession, onClear: clearSession, onRefresh: function () { refreshCurrent(true); }, onNativeReady: nativeBridgeReady, onOpenSection: openNativeSection, onBack: function () { if (UI.closeSheet()) return true; if (route.section !== "visao-geral") { navigate({ section: "visao-geral" }); return true; } return false; } });
    if (!Bridge.hasBridge() || !Bridge.isAuthorizedDocument()) { showGate("access"); return; }
    showGate("loading");
    requestNativeSession();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
}(window));
