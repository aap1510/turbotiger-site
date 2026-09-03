/* Serialized, session-bound autosave. No storage, network or browser bypass. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.TurboIEAutosave = factory;
})(typeof window === "object" ? window : this, function (options) {
  "use strict";
  var timer = null, pending = null, running = null, stopped = false;
  var revision = 0, acknowledged = null, failure = null, invalid = false;
  var schedule = options.schedule || setTimeout;
  var unschedule = options.unschedule || clearTimeout;
  function current() { return !stopped && (!options.current || options.current()); }
  function notify(status, error) { if (current() && options.status) options.status(status, error); }
  function clearTimer() { if (timer !== null) unschedule(timer); timer = null; }
  function flush() {
    clearTimer();
    if (!current() || running || !pending) return running || Promise.resolve();
    var item = pending;
    pending = null;
    failure = null;
    notify("saving");
    running = Promise.resolve().then(function () {
      if (current()) return options.save(item.value, function () { return current() && revision === item.revision; });
    }).then(function () {
      if (!current()) return;
      acknowledged = item.key;
      if (pending && pending.key === acknowledged) pending = null;
      notify(pending ? "pending" : invalid ? "invalid" : "saved");
    }, function (error) {
      if (!current()) return;
      failure = error;
      if (!pending && revision === item.revision) pending = item;
      notify("error", error);
    }).finally(function () {
      running = null;
      // Never retry an ambiguous failure without a new edit or explicit retry.
      if (current() && pending && !failure && timer === null) flush();
    });
    return running;
  }
  return {
    update: function (value, delay) {
      if (!current()) return;
      clearTimer();
      revision += 1;
      failure = null;
      invalid = value === null;
      if (invalid) { pending = null; notify("invalid"); return; }
      var key = JSON.stringify(value);
      if (!running && key === acknowledged) { pending = null; notify("saved"); return; }
      pending = { value: JSON.parse(key), key: key, revision: revision };
      notify("pending");
      if (delay === 0) flush();
      else timer = schedule(function () { timer = null; flush(); }, delay == null ? 650 : delay);
    },
    flush: flush,
    retry: function () { failure = null; return flush(); },
    busy: function () { return current() && (!!running || !!pending && !failure); },
    unsaved: function () { return current() && (invalid || !!failure); },
    cancel: function () { stopped = true; clearTimer(); pending = null; }
  };
});
