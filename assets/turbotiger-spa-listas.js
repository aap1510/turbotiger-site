(function () {
  "use strict";

  var REST_URL = "https://jzqgudmvquokizvgehow.supabase.co/rest/v1/rpc/spa_listagem_publica_rpc";
  var API_KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";
  var API_PAGE_SIZE = 100;
  var PAGE_COUNT = 5;
  var MIN_PAGE_SIZE = 20;
  var legendas = window.TurboTigerLegendas;
  var textos = {
    legenda_bets_consultar_lista: "Consultar lista",
    legenda_bets_fechar_consulta: "Fechar consulta",
    legenda_bets_consultando_base: "Consultando a base informativa...",
    legenda_bets_dominio_encontrado: "{quantidade} domínio encontrado",
    legenda_bets_dominios_encontrados: "{quantidade} domínios encontrados",
    legenda_bets_falha_consultar: "Não foi possível consultar a lista neste momento. Tente novamente em instantes.",
    legenda_bets_consulta_indisponivel: "Consulta temporariamente indisponível.",
    legenda_bets_ir_para_pagina: "Ir para a página {pagina}",
    legenda_bets_marca_nao_informada: "Marca não informada",
    legenda_bets_dominio_informativo: "Domínio informativo: {dominio}",
    legenda_bets_determinacao_judicial: "Determinação judicial",
    legenda_bets_autorizada_spa: "Autorizada pela SPA/MF",
    legenda_bets_busca_sem_resultado: "Nenhum resultado encontrado para esta busca."
  };
  if (legendas) legendas.registrar(textos);
  function legenda(chave, valores) {
    if (legendas) return legendas.texto(chave, valores);
    return textos[chave].replace(/\{([a-z_]+)\}/g, function (token, nome) { return valores && Object.prototype.hasOwnProperty.call(valores, nome) ? String(valores[nome]) : token; });
  }

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
    var legendaStatus = "";
    var parametrosStatus;
    var legendaVazio = "";

    function mostrarStatus(chave, valores) {
      legendaStatus = chave; parametrosStatus = valores;
      status.textContent = legenda(chave, valores);
    }

    ["copy", "cut", "dragstart", "contextmenu"].forEach(function (eventName) {
      section.addEventListener(eventName, function (event) {
        if (event.target === search) return;
        event.preventDefault();
      });
    });

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.textContent = legenda(expanded ? "legenda_bets_consultar_lista" : "legenda_bets_fechar_consulta");
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
      mostrarStatus("legenda_bets_consultando_base");
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
        mostrarStatus(total === 1 ? "legenda_bets_dominio_encontrado" : "legenda_bets_dominios_encontrados", { quantidade: total });
        showPage();
      } catch (_) {
        state.items = [];
        list.replaceChildren();
        showEmpty("legenda_bets_falha_consultar");
        mostrarStatus("legenda_bets_consulta_indisponivel");
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
      legendaVazio = "";
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
        button.setAttribute("aria-label", legenda("legenda_bets_ir_para_pagina", { pagina: page }));
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
        brand.textContent = item.marca || legenda("legenda_bets_marca_nao_informada");

        var company = document.createElement("div");
        company.className = "spa-reference-company";
        company.textContent = item.razaosocial || "";
        var cnpj = document.createElement("span");
        cnpj.textContent = item.cnpj || "";
        company.appendChild(cnpj);

        var domain = document.createElement("span");
        domain.className = "spa-reference-domain";
        domain.textContent = item.dominio || "";
        domain.setAttribute("aria-label", legenda("legenda_bets_dominio_informativo", { dominio: item.dominio || "" }));

        var kind = document.createElement("div");
        kind.className = "spa-reference-kind";
        kind.setAttribute("data-kind", item.origem || "");
        kind.textContent = legenda(item.origem === "judicial" ? "legenda_bets_determinacao_judicial" : "legenda_bets_autorizada_spa");

        row.appendChild(brand);
        row.appendChild(company);
        row.appendChild(domain);
        row.appendChild(kind);
        fragment.appendChild(row);
      });
      list.appendChild(fragment);
    }

    function showEmpty(chave) {
      legendaVazio = chave || "legenda_bets_busca_sem_resultado";
      var empty = document.createElement("p");
      empty.className = "spa-reference-empty";
      empty.textContent = legenda(legendaVazio);
      list.appendChild(empty);
    }

    window.addEventListener("turbotiger:idioma", function () {
      toggle.textContent = legenda(toggle.getAttribute("aria-expanded") === "true" ? "legenda_bets_fechar_consulta" : "legenda_bets_consultar_lista");
      if (legendaStatus) status.textContent = legenda(legendaStatus, parametrosStatus);
      if (legendaVazio) {
        var chaveVazio = legendaVazio;
        list.replaceChildren(); showEmpty(chaveVazio);
      } else if (state.loaded) showPage();
    });
  }
})();
