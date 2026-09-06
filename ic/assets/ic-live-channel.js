/* Canal privado, somente para invalidação. Nunca transporta saldo, estado financeiro ou token na URL. */
(function (root, factory) {
  "use strict";
  root.TurboTigerIC = root.TurboTigerIC || {};
  root.TurboTigerIC.LiveChannel = factory(root);
}(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";
  var SUPABASE_URL = "https://jzqgudmvquokizvgehow.supabase.co";
  var PUBLISHABLE_KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";
  var TOPIC_PATTERN = /^ic:[a-z0-9_-]{12,160}$/i;

  function create(options) {
    options = options || {};
    var socket = null, stopped = true, heartbeat = null, deadline = null, reconnect = null;
    var sequence = 1, heartbeatRef = null, joined = false, lastToken = null, generation = 0, reconnectAttempt = 0;

    function clearTimers() { root.clearTimeout(heartbeat); root.clearTimeout(deadline); heartbeat = null; deadline = null; }
    function disconnectSocket() {
      clearTimers();
      if (socket) { socket.onclose = socket.onerror = socket.onmessage = socket.onopen = null; try { socket.close(); } catch (_error) {} }
      socket = null; lastToken = null; heartbeatRef = null; joined = false;
    }
    function clearReconnect() { root.clearTimeout(reconnect); reconnect = null; }
    function stop() { stopped = true; generation += 1; clearReconnect(); disconnectSocket(); reconnectAttempt = 0; }
    function fail(localGeneration) {
      if (stopped || localGeneration !== generation) return;
      disconnectSocket();
      if (options.onDisconnect) options.onDisconnect();
      var delay = Math.min(30000, 1000 * Math.pow(2, Math.min(reconnectAttempt, 5)));
      reconnectAttempt += 1;
      clearReconnect();
      reconnect = root.setTimeout(function () {
        reconnect = null;
        if (!stopped && localGeneration === generation) connect();
      }, delay);
    }
    function send(topic, event, payload, reference) {
      if (!socket || socket.readyState !== 1) return false;
      socket.send(JSON.stringify({ topic: topic, event: event, payload: payload || {}, ref: reference, join_ref: topic === "phoenix" ? null : "1" }));
      return true;
    }
    async function getSession() { return options.getSession ? await options.getSession() : null; }

    async function beat(topic, localGeneration) {
      if (stopped || localGeneration !== generation) return;
      if (heartbeatRef) { fail(localGeneration); return; }
      try {
        var session = await getSession();
        if (stopped || localGeneration !== generation) return;
        if (!session || !session.accessToken) { fail(localGeneration); return; }
        if (lastToken !== session.accessToken) {
          send(topic, "access_token", { access_token: session.accessToken }, String(++sequence));
          lastToken = session.accessToken;
        }
        heartbeatRef = String(++sequence);
        send("phoenix", "heartbeat", {}, heartbeatRef);
        heartbeat = root.setTimeout(function () { beat(topic, localGeneration); }, 20000);
      } catch (_error) { fail(localGeneration); }
    }

    async function connect() {
      clearReconnect();
      disconnectSocket();
      if (stopped) return;
      var rawTopic = options.getTopic ? options.getTopic() : null;
      if (!TOPIC_PATTERN.test(String(rawTopic || ""))) return;
      var topic = "realtime:" + rawTopic;
      var localGeneration = ++generation;
      try {
        var session = await getSession();
        if (stopped || localGeneration !== generation) return;
        if (!session || !session.accessToken) { fail(localGeneration); return; }
        socket = new root.WebSocket(SUPABASE_URL.replace(/^https:/, "wss:") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(PUBLISHABLE_KEY) + "&vsn=1.0.0");
        deadline = root.setTimeout(function () { fail(localGeneration); }, 15000);
        socket.onopen = function () {
          lastToken = session.accessToken;
          send(topic, "phx_join", { config: { broadcast: { ack: false, self: false }, presence: { enabled: false }, postgres_changes: [], private: true }, access_token: session.accessToken }, "1");
          session = null;
        };
        socket.onerror = socket.onclose = function () { fail(localGeneration); };
        socket.onmessage = function (event) {
          var message;
          try { message = JSON.parse(event.data); } catch (_error) { return; }
          if (message.topic === "phoenix" && message.event === "phx_reply" && message.ref === heartbeatRef) { heartbeatRef = null; return; }
          if (message.topic !== topic) return;
          if (message.event === "phx_error" || message.event === "phx_close") { fail(localGeneration); return; }
          if (message.event === "phx_reply" && message.ref === "1") {
            if (!message.payload || message.payload.status !== "ok") { fail(localGeneration); return; }
            joined = true; reconnectAttempt = 0; root.clearTimeout(deadline);
            heartbeat = root.setTimeout(function () { beat(topic, localGeneration); }, 20000);
            if (options.onInvalidate) options.onInvalidate({ reason: "realtime_join" });
          } else if (joined && message.event === "broadcast" && message.payload && message.payload.event === "atualizacao") {
            if (options.onInvalidate) options.onInvalidate({ reason: "realtime", version: message.payload.payload && message.payload.payload.version || null });
          }
        };
      } catch (_error) { fail(localGeneration); }
    }

    function start() { if (!stopped) return; stopped = false; reconnectAttempt = 0; connect(); }
    function renew() { if (!stopped) { reconnectAttempt = 0; connect(); } }
    return { start: start, stop: stop, renew: renew, hasValidTopic: function () { return TOPIC_PATTERN.test(String(options.getTopic && options.getTopic() || "")); } };
  }

  return { create: create, TOPIC_PATTERN: TOPIC_PATTERN };
}));
