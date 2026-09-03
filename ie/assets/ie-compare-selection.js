(function () {
  "use strict";
  window.TurboTigerCompareSelection = function (api) {
    var root = api.root, selected = [], press = null, swallowed = null;
    var selector = '[data-compare-select]';
    function escape(value) { return String(value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function eligible(button) { return api.active() && !button.disabled && Number(button.dataset.compareStart) > api.now(); }
    function prune() { selected = selected.filter(function (item) { return item.start > api.now(); }); }
    function sync() {
      prune();
      root.querySelectorAll(selector).forEach(function (button) {
        button.setAttribute('aria-pressed', String(selected.some(function (item) { return item.id === Number(button.dataset.compareSelect); })));
      });
    }
    function cancel(swallow) {
      if (!press) return;
      clearTimeout(press.timer);
      if (swallow) swallowed = press.id;
      press = null;
    }
    function launch() {
      prune();
      if (selected.length < 2) return;
      var ids = selected.map(function (item) { return item.id; });
      selected = []; sync(); api.open(ids);
    }
    function choose(button, hold) {
      if (!eligible(button)) return;
      prune();
      var id = Number(button.dataset.compareSelect), index = selected.findIndex(function (item) { return item.id === id; });
      if (index >= 0 && !hold) selected.splice(index, 1);
      else if (index < 0 && selected.length < 3) selected.push({ id: id, start: Number(button.dataset.compareStart) });
      sync();
      if (selected.length === 3 || (hold && selected.length === 2)) launch();
    }
    root.addEventListener('pointerdown', function (event) {
      // A second finger cancels the pending hold without interfering with page scrolling.
      if (event.isPrimary === false) { cancel(true); return; }
      cancel(false); swallowed = null;
      var button = event.target.closest(selector);
      if (!button || event.button !== 0 || !eligible(button)) return;
      event.stopPropagation();
      press = { id: Number(button.dataset.compareSelect), pointer: event.pointerId, x: event.clientX, y: event.clientY, button: button };
      var current = press;
      current.timer = setTimeout(function () {
        if (press !== current || !current.button.isConnected || !eligible(current.button)) return;
        swallowed = current.id; press = null; choose(current.button, true);
      }, 550);
    }, true);
    root.addEventListener('pointermove', function (event) {
      if (press && event.pointerId === press.pointer && (Math.abs(event.clientX - press.x) > 10 || Math.abs(event.clientY - press.y) > 10)) cancel(true);
    }, { capture: true, passive: true });
    root.addEventListener('pointerup', function (event) { if (press && event.pointerId === press.pointer) cancel(false); }, true);
    root.addEventListener('pointercancel', function () { cancel(true); }, true);
    root.addEventListener('scroll', function () { cancel(true); }, { capture: true, passive: true });
    root.addEventListener('visibilitychange', function () { if (root.hidden) cancel(true); });
    window.addEventListener('blur', function () { cancel(true); });
    root.addEventListener('contextmenu', function (event) { if (event.target.closest(selector)) event.preventDefault(); }, true);
    root.addEventListener('click', function (event) {
      var button = event.target.closest(selector);
      if (!button) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (swallowed === Number(button.dataset.compareSelect) && event.detail !== 0) { swallowed = null; return; }
      swallowed = null; choose(button, false);
    }, true);
    root.addEventListener('keydown', function (event) {
      var button = event.target.closest(selector);
      if (!button || !['Enter', ' '].includes(event.key)) return;
      event.stopPropagation();
      if (event.key === 'Enter' && event.shiftKey) { event.preventDefault(); choose(button, true); }
    }, true);
    new MutationObserver(sync).observe(root, { childList: true, subtree: true });
    return {
      reset: function () { cancel(true); selected = []; swallowed = null; sync(); },
      button: function (id, name, start) {
        var marked = selected.some(function (item) { return item.id === Number(id); });
        return '<button type="button" class="ie-compare-select" data-compare-select="' + Number(id) + '" data-compare-start="' + Number(start) + '" aria-pressed="' + marked + '" aria-label="Comparar ' + escape(name) + '. Toque para marcar ou desmarcar; mantenha pressionado para abrir com dois confrontos. No teclado, Shift mais Enter."><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="7" height="16" rx="1.5"/><rect x="15" y="4" width="7" height="16" rx="1.5"/><path d="M7 9h10m-2-2 2 2-2 2M17 15H7m2-2-2 2 2 2"/></svg></button>';
      }
    };
  };
})();
