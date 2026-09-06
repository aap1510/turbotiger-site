(function (root, factory) {
  "use strict";
  var api = factory();
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.Store = api;
  if (typeof module === "object" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function createStore() {
    var listeners = [];
    var state = {
      session: null,
      sessionEpoch: 0,
      bootstrap: null,
      features: {},
      activeSection: "visao-geral",
      route: null,
      screenStates: {},
      online: typeof navigator === "undefined" ? true : navigator.onLine !== false
    };

    function notify() { listeners.slice().forEach(function (listener) { listener(state); }); }
    function getState() { return state; }
    function set(patch) { Object.assign(state, patch || {}); notify(); return state; }
    function setScreen(section, patch) {
      state.screenStates[section] = Object.assign({}, state.screenStates[section] || {}, patch || {});
      notify();
      return state.screenStates[section];
    }
    function setSession(session) {
      state.sessionEpoch += 1;
      state.session = session || null;
      state.bootstrap = null;
      state.features = {};
      state.screenStates = {};
      notify();
      return state.sessionEpoch;
    }
    function clearSession() { return setSession(null); }
    function subscribe(listener) {
      if (typeof listener !== "function") return function () {};
      listeners.push(listener);
      return function () { listeners = listeners.filter(function (entry) { return entry !== listener; }); };
    }
    return { getState: getState, set: set, setScreen: setScreen, setSession: setSession, clearSession: clearSession, subscribe: subscribe };
  }

  return { createStore: createStore };
}));
