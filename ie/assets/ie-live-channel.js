/* Private, receive-only invalidations. No scores, storage, app bridge or provider logic. */
(function (root) {
  "use strict";
  root.TurboIELiveChannel = function (options) {
    var socket = null, stopped = false, heartbeat = null, deadline = null;
    var sequence = 1, heartbeatRef = null, joined = false, lastToken = null;
    var topic = "realtime:" + options.topic;
    function stop() {
      stopped = true;
      root.clearTimeout(heartbeat);
      root.clearTimeout(deadline);
      if (socket) { socket.onclose = socket.onerror = socket.onmessage = socket.onopen = null; socket.close(); }
      socket = null;
      lastToken = null;
    }
    function fail() { if (stopped) return; stop(); options.onDisconnect(); }
    function send(event, payload, channel, ref) {
      if (!socket || socket.readyState !== 1) return false;
      socket.send(JSON.stringify({ topic: channel || topic, event: event, payload: payload, ref: ref, join_ref: channel === 'phoenix' ? null : '1' }));
      return true;
    }
    async function beat() {
      if (stopped) return;
      if (heartbeatRef) { fail(); return; }
      try {
        var session = await options.getSession();
        if (stopped) return;
        if (!session || !session.access_token) { fail(); return; }
        if (lastToken !== session.access_token) {
          send('access_token', { access_token: session.access_token }, null, String(++sequence));
          lastToken = session.access_token;
        }
        heartbeatRef = String(++sequence);
        send('heartbeat', {}, 'phoenix', heartbeatRef);
        // Transport keep-alive only. This never polls scores or defines provider cadence.
        heartbeat = root.setTimeout(beat, 20000);
      } catch (_) { fail(); }
    }
    (async function () {
      try {
        var session = await options.getSession();
        if (stopped) return;
        if (!session || !session.access_token) { fail(); return; }
        socket = new root.WebSocket(options.url.replace(/^https:/, 'wss:') + '/realtime/v1/websocket?apikey=' + encodeURIComponent(options.apiKey) + '&vsn=1.0.0');
        deadline = root.setTimeout(fail, 15000);
        socket.onopen = function () {
          lastToken = session.access_token;
          send('phx_join', { config: { broadcast: { ack:false, self:false }, presence: { enabled:false }, postgres_changes:[], private:true }, access_token:session.access_token }, null, '1');
          session = null;
        };
        socket.onerror = socket.onclose = fail;
        socket.onmessage = function (event) {
          var message;
          try { message = JSON.parse(event.data); } catch (_) { return; }
          if (message.topic === 'phoenix' && message.event === 'phx_reply' && message.ref === heartbeatRef) { heartbeatRef = null; return; }
          if (message.topic !== topic) return;
          if (message.event === 'phx_error' || message.event === 'phx_close') { fail(); return; }
          if (message.event === 'phx_reply' && message.ref === '1') {
            if (!message.payload || message.payload.status !== 'ok') { fail(); return; }
            joined = true;
            root.clearTimeout(deadline);
            heartbeat = root.setTimeout(beat, 20000);
            options.onChange(); // Reconcile changes that arrived while joining/reconnecting.
          } else if (joined && message.event === 'broadcast' && message.payload && message.payload.event === 'atualizacao') {
            options.onChange();
          }
        };
      } catch (_) { fail(); }
    }());
    return { close: stop };
  };
}(window));
