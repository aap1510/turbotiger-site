(function (global) {
  "use strict";

  // Consulta de apresentacao. Nao abre dominios, aciona pontes ou usa IDs operacionais.
  var REST = "https://jzqgudmvquokizvgehow.supabase.co/rest/v1/rpc/";
  var KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";
  var PAGE_SIZE = 20;
  var legendas = global.TurboTigerLegendas;
  var textos = {
    legenda_bets_internacionais_titulo: "Consultar sites por país",
    legenda_bets_internacionais_orientacao: "Selecione o país e, quando necessário, o estado ou a província. O idioma e a região são filtros independentes.",
    legenda_bets_internacionais_pais: "País",
    legenda_bets_internacionais_subdivisao: "Estado ou província",
    legenda_bets_internacionais_selecionar_subdivisao: "Selecione o estado ou a província",
    legenda_bets_internacionais_abrangencia_nacional: "Abrangência nacional",
    legenda_bets_internacionais_carregando_territorios: "Consultando as regiões com catálogo disponível…",
    legenda_bets_internacionais_sem_territorios: "Ainda não há catálogo internacional disponível para consulta.",
    legenda_bets_internacionais_falha_territorios: "Não foi possível consultar as regiões neste momento.",
    legenda_bets_internacionais_tentar_novamente: "Tentar novamente",
    legenda_bets_internacionais_sugestao: "Sugestão de região baseada em consulta de {data}: {regiao}. Confirme a região que deseja consultar.",
    legenda_bets_internacionais_usar_sugestao: "Usar região sugerida",
    legenda_bets_internacionais_sugestao_sem_catalogo: "Ainda não há catálogo disponível para essa região. Você pode escolher outra região para consulta.",
    legenda_bets_internacionais_catalogo_titulo: "Sites de apostas — {regiao}",
    legenda_bets_internacionais_texto_informativo: "Domínios exibidos como texto informativo, sem redirecionamento.",
    legenda_bets_internacionais_buscar: "Buscar por marca, empresa ou domínio",
    legenda_bets_internacionais_carregando_catalogo: "Consultando o catálogo desta região…",
    legenda_bets_internacionais_subdivisao_necessaria: "Selecione o estado ou a província para consultar o catálogo.",
    legenda_bets_internacionais_falha_catalogo: "Não foi possível consultar o catálogo neste momento. Tente novamente em instantes.",
    legenda_bets_internacionais_catalogo_vazio: "Nenhum site publicado está disponível para o idioma e a região selecionados.",
    legenda_bets_internacionais_busca_vazia: "Nenhum resultado encontrado para esta busca.",
    legenda_bets_internacionais_um_resultado: "{quantidade} registro encontrado",
    legenda_bets_internacionais_resultados: "{quantidade} registros encontrados",
    legenda_bets_internacionais_dominio: "Domínio informativo: {dominio}",
    legenda_bets_internacionais_modalidade_esporte: "Apostas esportivas",
    legenda_bets_internacionais_modalidade_cassino: "Jogos de cassino",
    legenda_bets_internacionais_licenca: "{modalidade} — {regulador}",
    legenda_bets_internacionais_escopos: "Escopo informado pelo regulador: {escopos}",
    legenda_bets_internacionais_pagina_anterior: "Página anterior",
    legenda_bets_internacionais_proxima_pagina: "Próxima página",
    legenda_bets_internacionais_paginacao: "Página {pagina} de {total}"
  };
  if (legendas) legendas.registrar(textos);
  function texto(chave, valores) {
    if (legendas) return legendas.texto(chave, valores);
    return textos[chave].replace(/\{([a-z_]+)\}/g, function (token, nome) {
      return valores && Object.prototype.hasOwnProperty.call(valores, nome) ? String(valores[nome]) : token;
    });
  }
  function idioma() { return legendas ? legendas.idioma() : "pt-BR"; }
  function paisValido(valor) { return typeof valor === "string" && /^[A-Z]{2}$/.test(valor); }
  function subdivisaoValida(valor, pais) {
    return typeof valor === "string" && /^[A-Z]{2}-[A-Z0-9]{1,4}$/.test(valor) && valor.slice(0, 2) === pais;
  }
  function cadeia(valor, limite) { return typeof valor === "string" && valor.trim().length > 0 && valor.length <= limite; }
  function nomePais(pais) {
    try { return new Intl.DisplayNames([idioma()], { type: "region" }).of(pais) || pais; }
    catch (_) { return pais; }
  }
  function nomeRegiao(pais, subdivisao) { return nomePais(pais) + (subdivisao ? " · " + subdivisao : ""); }
  function elemento(tipo, classe) {
    var no = document.createElement(tipo);
    if (classe) no.className = "tt-bets-internacionais__" + classe;
    return no;
  }
  function botao() { var no = elemento("button", "botao"); no.type = "button"; return no; }
  function opcao(valor, rotulo) { var no = elemento("option"); no.value = valor; no.textContent = rotulo; return no; }
  async function rpc(nome, corpo, controller) {
    var timer = global.setTimeout(function () { controller.abort(); }, 12000);
    try {
      var resposta = await fetch(REST + nome, {
        method: "POST", cache: "no-store", signal: controller.signal,
        headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(corpo)
      });
      if (!resposta.ok) throw new Error("consulta_indisponivel");
      return await resposta.json();
    } finally { global.clearTimeout(timer); }
  }
  function validarTerritorios(valor) {
    if (!valor || valor.origem !== "internacional" || valor.formato !== "territorios_publicados" ||
        !Array.isArray(valor.territorios) || valor.territorios.length > 5000) throw new Error("territorios_invalidos");
    var paises = new Map();
    valor.territorios.forEach(function (item) {
      if (!item || !paisValido(item.pais) || item.pais === "BR" ||
          (item.subdivisao !== null && !subdivisaoValida(item.subdivisao, item.pais))) throw new Error("territorio_invalido");
      if (!paises.has(item.pais)) paises.set(item.pais, { nacional: false, subdivisoes: new Set() });
      if (item.subdivisao === null) paises.get(item.pais).nacional = true;
      else paises.get(item.pais).subdivisoes.add(item.subdivisao);
    });
    return paises;
  }
  function validarCatalogo(valor, consulta) {
    if (!valor || valor.origem !== "internacional" || valor.formato !== "dominios_internacionais" ||
        valor.idioma !== consulta.idioma || valor.pais !== consulta.pais || valor.subdivisao !== consulta.subdivisao ||
        !Array.isArray(valor.itens) || valor.itens.length > 20000) throw new Error("catalogo_invalido");
    return valor.itens.map(function (item) {
      if (!item || item.listavel !== true || item.integracao_operacional !== false || item.estado_tecnico !== "disponivel" ||
          item.idioma !== consulta.idioma || item.pais !== consulta.pais ||
          (item.subdivisao !== null && item.subdivisao !== consulta.subdivisao) ||
          !cadeia(item.marca, 500) || (item.entidade_exploradora !== null && !cadeia(item.entidade_exploradora, 1000)) ||
          !cadeia(item.dominio, 253) || !/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(item.dominio) ||
          !cadeia(item.url_destino, 4096) || /[\\#\s]/.test(item.url_destino) ||
          !Array.isArray(item.modalidades) || !item.modalidades.length || item.modalidades.length > 2 || item.modalidades.some(function (m) { return m !== "esporte" && m !== "cassino"; }) ||
          !Array.isArray(item.licencas) || !item.licencas.length || item.licencas.length > 1000) throw new Error("item_invalido");
      var url = new URL(item.url_destino);
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash ||
          (url.hostname !== item.dominio && url.hostname !== "www." + item.dominio)) throw new Error("url_invalida");
      var licencas = item.licencas.map(function (licenca) {
        if (!licenca || item.modalidades.indexOf(licenca.modalidade) < 0 || !cadeia(licenca.regulador, 1000) ||
            !Array.isArray(licenca.escopos) || !licenca.escopos.length || licenca.escopos.length > 100 ||
            licenca.escopos.some(function (escopo) { return !cadeia(escopo, 1200); })) throw new Error("licenca_invalida");
        return { modalidade: licenca.modalidade, regulador: licenca.regulador, escopos: licenca.escopos.slice() };
      });
      // Nem IDs nem URL de navegacao sao mantidos no estado da apresentacao.
      return { marca: item.marca, empresa: item.entidade_exploradora || "", dominio: item.dominio, licencas: licencas };
    });
  }
  function validarSugestao(valor) {
    if (!valor || valor.natureza !== "sugestao_territorial" || valor.confirmacao_necessaria !== true ||
        valor.posicao_atual_confirmada !== false || !paisValido(valor.pais_iso) ||
        (valor.subdivisao_iso !== null && valor.subdivisao_iso !== "" && !subdivisaoValida(valor.subdivisao_iso, valor.pais_iso)) ||
        !cadeia(valor.origem, 100) || !cadeia(valor.resolvido_em_utc, 100)) return null;
    var instante = new Date(valor.resolvido_em_utc);
    if (!Number.isFinite(instante.getTime())) return null;
    return { pais: valor.pais_iso, subdivisao: valor.subdivisao_iso || null, instante: instante };
  }
  function iniciar() {
    if (!/(?:^|\/)(?:index(?:_app)?\.html)?$/i.test(location.pathname)) return;
    var raiz = document.querySelector("[data-tt-bets-internacionais]");
    var brasileiro = document.querySelector("[data-spa-reference]");
    if (!raiz || !brasileiro || raiz.dataset.ttBetsInicializado) return;
    raiz.dataset.ttBetsInicializado = "true";
    raiz.classList.add("tt-bets-internacionais");
    var estado = { pais: "BR", subdivisao: null, territorios: new Map(), territoriosEstado: "carregando", itens: [],
      catalogoEstado: "inicial", pagina: 1, geracao: 0, requisicao: null, geracaoTerritorios: 0, requisicaoTerritorios: null,
      sugestao: validarSugestao(global.TurboTigerJurisdicaoSugerida) };
    var conteudo = elemento("div", "conteudo");
    var titulo = elemento("h2", "titulo");
    var orientacao = elemento("p", "orientacao");
    var filtros = elemento("div", "filtros");
    var rotuloPais = elemento("label", "campo");
    var textoPais = elemento("span");
    var selectPais = elemento("select", "selecao");
    rotuloPais.append(textoPais, selectPais);
    var rotuloSubdivisao = elemento("label", "campo");
    var textoSubdivisao = elemento("span");
    var selectSubdivisao = elemento("select", "selecao");
    rotuloSubdivisao.append(textoSubdivisao, selectSubdivisao);
    filtros.append(rotuloPais, rotuloSubdivisao);
    var statusTerritorios = elemento("p", "status");
    statusTerritorios.setAttribute("role", "status");
    var repetirTerritorios = botao();
    var sugestao = elemento("div", "sugestao");
    var textoSugestao = elemento("p");
    var sugestaoIndisponivel = elemento("p", "status");
    var usarSugestao = botao();
    sugestao.append(textoSugestao, sugestaoIndisponivel, usarSugestao);
    var painel = elemento("div", "painel");
    var tituloCatalogo = elemento("h3", "subtitulo");
    var nota = elemento("p", "orientacao");
    var buscaRotulo = elemento("label", "campo");
    var textoBusca = elemento("span");
    var busca = elemento("input", "busca");
    busca.type = "search"; busca.maxLength = 150;
    buscaRotulo.append(textoBusca, busca);
    var statusCatalogo = elemento("p", "status");
    statusCatalogo.setAttribute("role", "status");
    var repetirCatalogo = botao();
    var lista = elemento("div", "lista");
    var paginacao = elemento("div", "paginacao");
    var anterior = botao(); var proxima = botao(); var pagina = elemento("span");
    paginacao.append(anterior, pagina, proxima);
    painel.append(tituloCatalogo, nota, buscaRotulo, statusCatalogo, repetirCatalogo, lista, paginacao);
    conteudo.append(titulo, orientacao, filtros, statusTerritorios, repetirTerritorios, sugestao, painel);
    raiz.appendChild(conteudo);

    function atualizarOpcoes() {
      selectPais.replaceChildren(opcao("BR", nomePais("BR")));
      Array.from(estado.territorios.keys()).sort(function (a, b) { return nomePais(a).localeCompare(nomePais(b), idioma()); }).forEach(function (pais) {
        selectPais.appendChild(opcao(pais, nomePais(pais)));
      });
      selectPais.value = estado.pais;
      var territorio = estado.territorios.get(estado.pais);
      rotuloSubdivisao.hidden = !territorio || !territorio.subdivisoes.size;
      selectSubdivisao.replaceChildren();
      if (territorio) {
        if (territorio.nacional) selectSubdivisao.appendChild(opcao("", texto("legenda_bets_internacionais_abrangencia_nacional")));
        else { var inicial = opcao("", texto("legenda_bets_internacionais_selecionar_subdivisao")); inicial.disabled = true; selectSubdivisao.appendChild(inicial); }
        Array.from(territorio.subdivisoes).sort().forEach(function (subdivisao) { selectSubdivisao.appendChild(opcao(subdivisao, subdivisao)); });
      }
      selectSubdivisao.value = estado.subdivisao || "";
    }
    function sugestaoDisponivel() {
      var valor = estado.sugestao;
      if (!valor) return false;
      if (valor.pais === "BR") return true;
      var territorio = estado.territorios.get(valor.pais);
      return !!territorio && (territorio.nacional || !!valor.subdivisao && territorio.subdivisoes.has(valor.subdivisao));
    }
    function atualizarSugestao() {
      sugestao.hidden = !estado.sugestao;
      if (!estado.sugestao) return;
      var data = new Intl.DateTimeFormat(idioma(), { dateStyle: "short", timeStyle: "short" }).format(estado.sugestao.instante);
      textoSugestao.textContent = texto("legenda_bets_internacionais_sugestao", { data: data, regiao: nomeRegiao(estado.sugestao.pais, estado.sugestao.subdivisao) });
      usarSugestao.textContent = texto("legenda_bets_internacionais_usar_sugestao");
      usarSugestao.hidden = !sugestaoDisponivel();
      sugestaoIndisponivel.hidden = sugestaoDisponivel() || estado.territoriosEstado === "carregando";
      sugestaoIndisponivel.textContent = texto(estado.territoriosEstado === "erro" ? "legenda_bets_internacionais_falha_territorios" : "legenda_bets_internacionais_sugestao_sem_catalogo");
    }
    function atualizarTextos() {
      titulo.textContent = texto("legenda_bets_internacionais_titulo");
      orientacao.textContent = texto("legenda_bets_internacionais_orientacao");
      textoPais.textContent = texto("legenda_bets_internacionais_pais");
      textoSubdivisao.textContent = texto("legenda_bets_internacionais_subdivisao");
      repetirTerritorios.textContent = repetirCatalogo.textContent = texto("legenda_bets_internacionais_tentar_novamente");
      var chaveTerritorios = estado.territoriosEstado === "carregando" ? "carregando_territorios" : estado.territoriosEstado === "erro" ? "falha_territorios" : !estado.territorios.size ? "sem_territorios" : "";
      statusTerritorios.hidden = !chaveTerritorios;
      statusTerritorios.textContent = chaveTerritorios ? texto("legenda_bets_internacionais_" + chaveTerritorios) : "";
      repetirTerritorios.hidden = estado.territoriosEstado !== "erro";
      tituloCatalogo.textContent = texto("legenda_bets_internacionais_catalogo_titulo", { regiao: nomeRegiao(estado.pais, estado.subdivisao) });
      nota.textContent = texto("legenda_bets_internacionais_texto_informativo");
      textoBusca.textContent = busca.placeholder = texto("legenda_bets_internacionais_buscar");
      anterior.textContent = texto("legenda_bets_internacionais_pagina_anterior");
      proxima.textContent = texto("legenda_bets_internacionais_proxima_pagina");
      atualizarOpcoes(); atualizarSugestao();
    }
    function mostrarLista() {
      lista.replaceChildren(); paginacao.hidden = true;
      repetirCatalogo.hidden = estado.catalogoEstado !== "erro";
      buscaRotulo.hidden = estado.catalogoEstado !== "pronto" || !estado.itens.length;
      if (estado.catalogoEstado !== "pronto") {
        var chave = estado.catalogoEstado === "carregando" ? "carregando_catalogo" : estado.catalogoEstado === "erro" ? "falha_catalogo" : "subdivisao_necessaria";
        statusCatalogo.textContent = texto("legenda_bets_internacionais_" + chave);
        return;
      }
      var termo = busca.value.trim().toLocaleLowerCase(idioma());
      var itens = estado.itens.filter(function (item) { return (item.marca + " " + item.empresa + " " + item.dominio).toLocaleLowerCase(idioma()).indexOf(termo) >= 0; });
      if (!itens.length) {
        statusCatalogo.textContent = texto(estado.itens.length ? "legenda_bets_internacionais_busca_vazia" : "legenda_bets_internacionais_catalogo_vazio");
        return;
      }
      statusCatalogo.textContent = texto(itens.length === 1 ? "legenda_bets_internacionais_um_resultado" : "legenda_bets_internacionais_resultados", { quantidade: itens.length });
      var total = Math.ceil(itens.length / PAGE_SIZE);
      estado.pagina = Math.max(1, Math.min(estado.pagina, total));
      itens.slice((estado.pagina - 1) * PAGE_SIZE, estado.pagina * PAGE_SIZE).forEach(function (item) {
        var linha = elemento("article", "linha");
        var marca = elemento("h4", "marca"); marca.textContent = item.marca;
        var empresa = elemento("p", "empresa"); empresa.textContent = item.empresa;
        var dominio = elemento("span", "dominio"); dominio.textContent = item.dominio;
        dominio.setAttribute("aria-label", texto("legenda_bets_internacionais_dominio", { dominio: item.dominio }));
        linha.append(marca, empresa, dominio);
        item.licencas.forEach(function (licenca) {
          var descricao = elemento("p", "licenca");
          descricao.textContent = texto("legenda_bets_internacionais_licenca", { modalidade: texto("legenda_bets_internacionais_modalidade_" + licenca.modalidade), regulador: licenca.regulador });
          var escopos = elemento("p", "escopos");
          escopos.textContent = texto("legenda_bets_internacionais_escopos", { escopos: licenca.escopos.join(", ") });
          linha.append(descricao, escopos);
        });
        lista.appendChild(linha);
      });
      paginacao.hidden = total < 2;
      anterior.disabled = estado.pagina === 1; proxima.disabled = estado.pagina === total;
      pagina.textContent = texto("legenda_bets_internacionais_paginacao", { pagina: estado.pagina, total: total });
    }
    function cancelarConsulta() {
      estado.geracao += 1;
      if (estado.requisicao) estado.requisicao.abort();
      estado.requisicao = null; estado.itens = []; estado.pagina = 1;
      painel.removeAttribute("aria-busy");
    }
    async function carregarCatalogo() {
      cancelarConsulta();
      painel.hidden = estado.pais === "BR";
      if (estado.pais === "BR") {
        brasileiro.removeAttribute("data-tt-bets-oculto");
        lista.replaceChildren(); return;
      }
      brasileiro.setAttribute("data-tt-bets-oculto", "true");
      var territorio = estado.territorios.get(estado.pais);
      if (!territorio || (!estado.subdivisao && !territorio.nacional)) { estado.catalogoEstado = "inicial"; mostrarLista(); return; }
      var geracao = estado.geracao;
      var consulta = { idioma: idioma(), pais: estado.pais, subdivisao: estado.subdivisao };
      var controller = new AbortController(); estado.requisicao = controller;
      estado.catalogoEstado = "carregando"; painel.setAttribute("aria-busy", "true"); mostrarLista();
      try {
        var resultado = await rpc("bets_catalogo_localizado_rpc", { p_idioma: consulta.idioma, p_pais: consulta.pais, p_subdivisao: consulta.subdivisao }, controller);
        if (geracao !== estado.geracao) return;
        estado.itens = validarCatalogo(resultado, consulta).sort(function (a, b) { return a.marca.localeCompare(b.marca, consulta.idioma) || a.dominio.localeCompare(b.dominio); });
        estado.catalogoEstado = "pronto";
      } catch (_) {
        if (geracao !== estado.geracao) return;
        estado.catalogoEstado = "erro"; estado.itens = [];
      } finally {
        if (geracao === estado.geracao) { estado.requisicao = null; painel.removeAttribute("aria-busy"); mostrarLista(); }
      }
    }
    async function carregarTerritorios() {
      var geracao = ++estado.geracaoTerritorios;
      if (estado.requisicaoTerritorios) estado.requisicaoTerritorios.abort();
      var controller = new AbortController(); estado.requisicaoTerritorios = controller;
      estado.territoriosEstado = "carregando"; atualizarTextos();
      try {
        var resultado = await rpc("bets_catalogo_territorios_rpc", {}, controller);
        if (geracao !== estado.geracaoTerritorios) return;
        estado.territorios = validarTerritorios(resultado); estado.territoriosEstado = "pronto";
      } catch (_) {
        if (geracao !== estado.geracaoTerritorios) return;
        estado.territoriosEstado = "erro";
      } finally {
        if (geracao === estado.geracaoTerritorios) { estado.requisicaoTerritorios = null; atualizarTextos(); }
      }
    }
    function selecionarRegiao(pais, subdivisao) {
      if (pais !== "BR" && !estado.territorios.has(pais)) return;
      var territorio = estado.territorios.get(pais);
      if (subdivisao && pais !== "BR" && !territorio.subdivisoes.has(subdivisao)) {
        if (!territorio.nacional) return;
        // Sem destino estadual publicado, consulta apenas o alcance nacional
        // documentado. Nunca escolhe outra subdivisao nem altera a sugestao.
        subdivisao = null;
      }
      estado.pais = pais; estado.subdivisao = pais === "BR" ? null : subdivisao || null;
      busca.value = ""; atualizarTextos(); carregarCatalogo();
    }
    selectPais.addEventListener("change", function () { selecionarRegiao(selectPais.value, null); });
    selectSubdivisao.addEventListener("change", function () { selecionarRegiao(estado.pais, selectSubdivisao.value); });
    busca.addEventListener("input", function () { estado.pagina = 1; mostrarLista(); });
    anterior.addEventListener("click", function () { estado.pagina -= 1; mostrarLista(); });
    proxima.addEventListener("click", function () { estado.pagina += 1; mostrarLista(); });
    repetirTerritorios.addEventListener("click", carregarTerritorios);
    repetirCatalogo.addEventListener("click", carregarCatalogo);
    usarSugestao.addEventListener("click", function () { if (sugestaoDisponivel()) selecionarRegiao(estado.sugestao.pais, estado.sugestao.subdivisao); });
    global.addEventListener("turbotiger:idioma", function () { atualizarTextos(); carregarCatalogo(); });
    global.addEventListener("turbotiger:jurisdicao-sugerida", function (evento) { estado.sugestao = validarSugestao(evento.detail); atualizarSugestao(); });
    painel.hidden = true;
    atualizarTextos(); carregarTerritorios();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
}(window));
