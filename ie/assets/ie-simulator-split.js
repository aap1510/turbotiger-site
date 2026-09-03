(function () {
  "use strict";
  // Apenas visibilidade das abas existentes. Nenhum link, odd ou valor e enviado.
  var content = document.getElementById("detailContent");
  var modal = document.getElementById("detailModal");
  var close = document.querySelector("#detailModal button[data-close-detail]");
  var bridge = window.TurboTigerIEBridge;
  if (!content || !modal || !close || !bridge || typeof bridge.post !== "function") return;
  var carga = new URLSearchParams(window.location.search).get("carga") || "";
  if (!carga) return;
  var active = false, pending = false, timeout = null;
  var button = document.createElement("button");
  button.type = "button";
  button.className = "ie-button ie-button-secondary ie-simulator-split";
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/></svg>';
  button.hidden = true;
  close.parentNode.insertBefore(button, close);

  function supportsSplitView() {
    var view = content.getAttribute("data-detail-view") || "";
    return !modal.hidden &&
      (/^financial-simulator:\d+$/.test(view) || view === "compare");
  }
  function render() {
    button.hidden = !supportsSplitView();
    button.disabled = pending;
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Ocultar navegador das bets" : "Mostrar navegador das bets em tela dividida");
  }
  function request(visible) {
    pending = true;
    clearTimeout(timeout);
    render();
    try {
      bridge.post(JSON.stringify({ type: "simulator_bets_visibility", visible: visible, carga: carga }));
    } catch (error) { pending = false; render(); return; }
    timeout = setTimeout(function () {
      pending = false;
      render();
    }, 5000);
  }
  button.addEventListener("click", function () {
    if (supportsSplitView() && !pending) request(!active);
  });
  window.addEventListener("turbotiger:simulator-bets", function (event) {
    clearTimeout(timeout);
    pending = false;
    active = !!(event.detail && event.detail.visible === true);
    if (active && !supportsSplitView()) request(false);
    else render();
  });
  new MutationObserver(function () {
    if (!supportsSplitView() && (active || pending)) request(false);
    render();
  }).observe(content, { attributes: true, attributeFilter: ["data-detail-view"] });
  new MutationObserver(function () {
    if (modal.hidden && (active || pending)) request(false);
    render();
  }).observe(modal, { attributes: true, attributeFilter: ["hidden"] });
  render();
}());
