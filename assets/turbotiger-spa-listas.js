(function () {
  "use strict";

  var REST_URL = "https://jzqgudmvquokizvgehow.supabase.co/rest/v1/rpc/spa_listagem_publica_rpc";
  var API_KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";
  var API_PAGE_SIZE = 100;
  var PAGE_COUNT = 5;
  var MIN_PAGE_SIZE = 20;

  document.querySelectorAll("[data-spa-reference]").forEach(initialize);

  function initialize(section) {
    var toggle = section.querySelector("[data-spa-toggle]");
    var panel = section.querySelector("[data-spa-panel]");
    var search = section.querySelector("[data-spa-search]");
    var list = section.querySelector("[data-spa-list]");
    var status = section.querySelector("[data-spa-status]");
    var pagination = section.querySelector("[data-spa-pagination]");
    var tabs = Array.prototype.slice.call(section.querySelectorAll("[data-spa-origin]"));
    var state = { loaded: false, loading: false, origin: "", query: "", page: 1, items: [] };
    var debounceTimer = 0;

    ["copy", "cut", "dragstart", "contextmenu"].forEach(function (eventName) {
      section.addEventListener(eventName, function (event) {
        if (event.target === search) return;
        event.preventDefault();
      });
    });

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.textContent = expanded ? "Consultar lista" : "Fechar consulta";
      panel.hidden = expanded;
      if (!expanded && !state.loaded) load();
    });

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var next = tab.getAttribute("data-spa-origin") || "";
        if (next === state.origin) return;
        state.origin = next;
        tabs.forEach(function (item) {
          item.setAttribute("aria-selected", String(item === tab));
        });
        load();
      });
    });

    search.addEventListener("input", function () {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(function () {
        state.query = search.value.trim();
        load();
      }, 280);
    });

    async function request(offset) {
      var response = await fetch(REST_URL, {
        method: "POST",
        cache: "no-store",
        headers: {
          apikey: API_KEY,
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        body: JSON.stringify({
          p_busca: state.query || null,
          p_origem: state.origin || null,
          p_limite: API_PAGE_SIZE,
          p_offset: offset
        })
      });
      if (!response.ok) throw new Error("http_" + response.status);
      return response.json();
    }

    async function load() {
      if (state.loading) return;
      state.loading = true;
      state.page = 1;
      status.textContent = "Consultando a base informativa...";
      pagination.replaceChildren();

      try {
        var first = await request(0);
        var total = Number(first.total || 0);
        var items = Array.isArray(first.itens) ? first.itens.slice() : [];
        for (var offset = API_PAGE_SIZE; offset < total; offset += API_PAGE_SIZE) {
          var next = await request(offset);
          if (Array.isArray(next.itens)) items = items.concat(next.itens);
        }

        state.items = items.sort(compareItems);
        state.loaded = true;
        status.textContent = total + (total === 1 ? " dom\u00ednio encontrado" : " dom\u00ednios encontrados");
        showPage();
      } catch (_) {
        state.items = [];
        list.replaceChildren();
        showEmpty("N\u00e3o foi poss\u00edvel consultar a lista neste momento. Tente novamente em instantes.");
        status.textContent = "Consulta temporariamente indispon\u00edvel.";
      } finally {
        state.loading = false;
      }
    }

    function compareItems(a, b) {
      var brandOrder = String(a.marca || "").localeCompare(String(b.marca || ""), "pt-BR", { sensitivity: "base" });
      if (brandOrder) return brandOrder;
      return String(a.dominio || "").localeCompare(String(b.dominio || ""), "pt-BR", { sensitivity: "base" });
    }

    function showPage() {
      list.replaceChildren();
      pagination.replaceChildren();
      if (!state.items.length) {
        showEmpty();
        return;
      }

      var pageSize = Math.max(MIN_PAGE_SIZE, Math.ceil(state.items.length / PAGE_COUNT));
      var totalPages = Math.min(PAGE_COUNT, Math.ceil(state.items.length / pageSize));
      state.page = Math.min(state.page, totalPages);
      var start = (state.page - 1) * pageSize;
      render(state.items.slice(start, start + pageSize));

      for (var page = 1; page <= totalPages; page += 1) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "spa-reference-page";
        button.textContent = String(page);
        button.setAttribute("aria-label", "Ir para a p\u00e1gina " + page);
        button.setAttribute("aria-current", page === state.page ? "page" : "false");
        button.addEventListener("click", selectPage.bind(null, page));
        pagination.appendChild(button);
      }
    }

    function selectPage(page) {
      state.page = page;
      showPage();
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function render(items) {
      var fragment = document.createDocumentFragment();
      items.forEach(function (item) {
        var row = document.createElement("article");
        row.className = "spa-reference-row";

        var brand = document.createElement("div");
        brand.className = "spa-reference-brand";
        brand.textContent = item.marca || "Marca n\u00e3o informada";

        var company = document.createElement("div");
        company.className = "spa-reference-company";
        company.textContent = item.razaosocial || "";
        var cnpj = document.createElement("span");
        cnpj.textContent = item.cnpj || "";
        company.appendChild(cnpj);

        var domain = document.createElement("span");
        domain.className = "spa-reference-domain";
        domain.textContent = item.dominio || "";
        domain.setAttribute("aria-label", "Dom\u00ednio informativo: " + (item.dominio || ""));

        var kind = document.createElement("div");
        kind.className = "spa-reference-kind";
        kind.setAttribute("data-kind", item.origem || "");
        kind.textContent = item.origem === "judicial" ? "Determina\u00e7\u00e3o judicial" : "Autorizada pela SPA/MF";

        row.appendChild(brand);
        row.appendChild(company);
        row.appendChild(domain);
        row.appendChild(kind);
        fragment.appendChild(row);
      });
      list.appendChild(fragment);
    }

    function showEmpty(message) {
      var empty = document.createElement("p");
      empty.className = "spa-reference-empty";
      empty.textContent = message || "Nenhum resultado encontrado para esta busca.";
      list.appendChild(empty);
    }
  }
})();
