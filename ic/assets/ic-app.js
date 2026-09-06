(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  var Core = IC.Core, UI = IC.UI, Bridge = IC.Bridge;
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
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active) {
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (focusTab) tab.focus();
      }
    });
    Array.prototype.slice.call(document.querySelectorAll("[role='tabpanel'][data-panel]")).forEach(function (panel) { panel.hidden = panel.dataset.panel !== section; });
    var bootstrap = store.getState().bootstrap;
    if (section !== "visao-geral" && (!bootstrap || bootstrap.status !== "ready")) {
      var waitingContainer = document.querySelector('[data-panel="' + section + '"]');
      if (waitingContainer) {
        waitingContainer.innerHTML = UI.sectionHeader("Preparando a Central", "Primeiro validamos a sessão, as capacidades e as políticas disponíveis.") + (bootstrap && bootstrap.status === "error" ? UI.state({ type: bootstrap.error && bootstrap.error.code === "offline" ? "offline" : "unavailable", message: bootstrap.error && bootstrap.error.message }) : UI.state({ type: "loading", retry: false }));
      }
      return;
    }
    if (store.getState().bootstrap && store.getState().bootstrap.status === "ready" && !sectionEnabled(section)) {
      var disabledContainer = document.querySelector('[data-panel="' + section + '"]');
      if (disabledContainer) disabledContainer.innerHTML = UI.sectionHeader("Recurso indisponível", "Esta área está desativada pela política operacional atual.") + UI.state({ type: "unavailable", title: "Área temporariamente desativada", message: "Os demais controles e o histórico permanecem preservados.", retry: false });
      return;
    }
    var screen = getScreen(section);
    if (screen) { screen.container = document.querySelector('[data-panel="' + section + '"]'); screen.container.innerHTML = screen.render(); screen.load(false); }
    UI.announce("Aba " + section.replace(/-/g, " ") + " aberta.");
  }

  function navigate(target, replace) {
    var next = typeof target === "string" ? { section: target } : Object.assign({}, target || {});
    route = Object.assign({}, route, next, { section: Core.validSection(next.section || route.section) });
    var url = root.location.pathname + router.toSearch(route, root.location.search);
    if (replace) root.history.replaceState(route, "", url);
    else root.history.pushState(route, "", url);
    activateSection(route.section, false);
  }

  async function loadBootstrap(force) {
    if (!hasAuthorizedSession()) return null;
    var current = store.getState().bootstrap;
    if (!force && current && (current.status === "ready" || current.status === "loading")) return current;
    store.set({ bootstrap: { status: "loading", data: current && current.data || null, updatedAt: current && current.updatedAt || null } });
    rerender("visao-geral");
    try {
      var result = await api.rpc("ic_contexto_rpc", {}, { key: "central:context" });
      var resource = { status: "ready", data: result.data || {}, meta: result.meta || {}, version: result.version, updatedAt: new Date().toISOString() };
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
    var greeting = document.getElementById("icGreeting");
    if (greeting) greeting.textContent = data.greeting || data.saudacao || "Seu controle";
    var capture = data.capture || data.captura || {};
    var captureNode = document.getElementById("icCaptureStatus");
    if (captureNode) captureNode.innerHTML = '<span class="ic-status-dot ic-status-dot--' + Core.statusTone(capture.status || capture.estado || "neutral") + '"></span><span>' + Core.escapeHtml(capture.label || capture.rotulo || "Captura não informada") + '</span>';
    var globalSession = data.global_session || data.sessao_global || {};
    var globalNode = document.getElementById("icGlobalSessionStatus");
    if (globalNode) globalNode.innerHTML = UI.icon("live") + '<span>' + Core.escapeHtml(globalSession.label || globalSession.rotulo || (globalSession.active || globalSession.ativa ? "Sessão ativa" : "Nenhuma sessão ativa")) + '</span>';
    var updated = document.getElementById("icLastUpdated");
    if (updated) updated.textContent = data.updated_at || data.atualizado_em ? "Atualizado " + Core.formatDateTime(data.updated_at || data.atualizado_em, { hour: "2-digit", minute: "2-digit" }) : "Atualizado agora";
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
        UI.toast(error && error.message || "Não foi possível atualizar as informações.", true);
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
      var sourceLabel = effectiveSource === "pessoal" ? "Origem efetiva: seu histórico" : effectiveSource === "comunidade" ? "Origem efetiva: comunidade elegível" : effectiveSource === "ambos" ? "Origem efetiva: seu histórico e comunidade elegível" : isHistoricalPattern ? "Origem efetiva indisponível" : "";
      var detail = [item.message || item.mensagem || "", sourceLabel].filter(Boolean).join(" · ");
      return UI.listRow(item.title || item.titulo || "Notificação", detail, item.created_at || item.criado_em ? Core.formatDateTime(item.created_at || item.criado_em) : "");
    }).join("") + '</div>' : UI.state({ type: "empty", title: "Nenhuma notificação", message: "Lembretes, alertas de controle e atualizações aparecerão aqui.", retry: false });
    UI.openSheet({ eyebrow: "Central de controle", title: "Notificações", html: html });
  }

  function activeScreen() { return screens[route.section] || getScreen(route.section); }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var routeNode = event.target.closest("[data-route]");
      if (routeNode) { event.preventDefault(); navigate({ section: routeNode.dataset.route }); return; }
      var tab = event.target.closest("[role='tab'][data-section]");
      if (tab) { event.preventDefault(); navigate({ section: tab.dataset.section }); return; }
      var globalAction = event.target.closest("[data-global-action]");
      if (globalAction) {
        event.preventDefault();
        if (globalAction.dataset.globalAction === "close") Bridge.close(route.loadGeneration);
        if (globalAction.dataset.globalAction === "notifications") notificationSheet();
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
      var tabs = Array.prototype.slice.call(document.querySelectorAll("[role='tab'][data-section]"));
      var index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = tabs.length - 1;
      else index = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      navigate({ section: tabs[index].dataset.section });
      tabs[index].focus();
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
