(function (global) {
  "use strict";

  // Camada exclusiva de apresentacao. Nunca traduz valores, protocolos ou dados de terceiros.
  var REST = "https://jzqgudmvquokizvgehow.supabase.co/rest/v1/rpc/";
  var KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";
  var STORAGE = "turbotiger.idioma.v1";
  var CACHE = "turbotiger.legendas.v1.";
  var idiomas = {
    "pt-BR": { base: "pt-BR", pais: "br", nome: "Português (Brasil)" },
    "pt-PT": { base: "pt-PT", pais: "pt", nome: "Português (Portugal)" },
    "es-ES": { base: "es-ES", pais: "es", nome: "Español (España)" },
    "en-US": { base: "en-US", pais: "us", nome: "English (United States)" },
    "fr-FR": { base: "fr-FR", pais: "fr", nome: "Français (France)" },
    "de-DE": { base: "de-DE", pais: "de", nome: "Deutsch (Deutschland)" },
    "en-GB": { base: "en-US", pais: "gb", nome: "English (United Kingdom)" },
    "en-CA": { base: "en-US", pais: "ca", nome: "English (Canada)" },
    "es-MX": { base: "es-ES", pais: "mx", nome: "Español (México)" },
    "fr-CA": { base: "fr-FR", pais: "ca", nome: "Français (Canada)" }
  };
  var padrao = Object.create(null);
  var pacotes = Object.create(null);
  var requisicoes = Object.create(null);
  var idioma = "pt-BR";
  var geracao = 0;
  var escolhasLocais = 0;
  var sessao = null;
  var geracaoSessao = 0;
  var filaSalvarPreferencia = Promise.resolve();
  var ultimaSolicitacaoWeb = "";
  var selecaoWebEmCurso = false;
  var pedidoNativo = null;
  var vinculados = new WeakMap();
  var assinantes = new Set();
  var script = document.currentScript;
  var baseAssets = script && script.src ? new URL(".", script.src).href : new URL("/assets/", location.href).href;
  var seletor = null;
  var tem = function (obj, chave) { return Object.prototype.hasOwnProperty.call(obj, chave); };
  var chaveValida = function (chave) { return /^legenda_[a-z0-9]+(?:_[a-z0-9]+)*$/.test(chave); };

  function normalizarIdioma(valor) {
    return Object.keys(idiomas).find(function (item) { return item.toLowerCase() === String(valor || "").toLowerCase(); }) || "";
  }
  function ler(chave) {
    try { return JSON.parse(localStorage.getItem(chave)); } catch (erro) { return null; }
  }
  function guardar(chave, valor) {
    var publico;
    if (chave === STORAGE) {
      var idiomaSalvo = normalizarIdioma(valor && valor.idioma);
      if (!idiomaSalvo) return;
      publico = { idioma: idiomaSalvo };
    } else if (chave.indexOf(CACHE) === 0) {
      var idiomaCache = normalizarIdioma(chave.slice(CACHE.length));
      publico = idiomaCache && validarPacote(valor, idiomaCache);
      if (!publico) return;
    } else return;
    // A sessao autenticada nunca pertence a estes dois formatos publicos.
    try { localStorage.setItem(chave, JSON.stringify(publico)); } catch (erro) { /* O modo privado permanece funcional. */ }
  }
  function parametros(texto) {
    return (texto.match(/\{[a-z][a-z0-9_]*\}/g) || []).sort().join("|");
  }
  function interpolar(texto, valores) {
    return texto.replace(/\{([a-z][a-z0-9_]*)\}/g, function (token, nome) {
      return valores && tem(valores, nome) ? String(valores[nome]) : token;
    });
  }
  function registrar(fontes) {
    Object.keys(fontes || {}).forEach(function (chave) {
      if (chaveValida(chave) && typeof fontes[chave] === "string") padrao[chave] = fontes[chave];
    });
  }
  function texto(chave, valores) {
    var exato = pacotes[idioma];
    var base = pacotes[idiomas[idioma].base];
    var original = tem(padrao, chave) ? padrao[chave] : chave;
    var traduzido = exato && exato.fontes[chave] === original && exato.legendas[chave] ||
      base && base.fontes[chave] === original && base.legendas[chave] || original;
    // Um pacote remoto nunca pode retirar/inventar os parametros da fonte embarcada.
    if (parametros(traduzido) !== parametros(original)) traduzido = original;
    return interpolar(traduzido, valores);
  }
  function validarPacote(valor, esperado) {
    if (!valor || valor.idioma !== esperado || !Number.isSafeInteger(Number(valor.versao)) || Number(valor.versao) < 0 ||
        !valor.legendas || typeof valor.legendas !== "object" || Array.isArray(valor.legendas) ||
        !valor.fontes || typeof valor.fontes !== "object" || Array.isArray(valor.fontes)) return null;
    var copia = Object.create(null);
    var fontes = Object.create(null);
    var chaves = Object.keys(valor.legendas);
    if (chaves.length > 100000) return null;
    for (var i = 0; i < chaves.length; i += 1) {
      var chave = chaves[i];
      if (!chaveValida(chave) || typeof valor.legendas[chave] !== "string" || !valor.legendas[chave].trim() || valor.legendas[chave].length > 200000 ||
          typeof valor.fontes[chave] !== "string" || !valor.fontes[chave].trim() || valor.fontes[chave].length > 100000 ||
          parametros(valor.legendas[chave]) !== parametros(valor.fontes[chave])) return null;
      copia[chave] = valor.legendas[chave];
      fontes[chave] = valor.fontes[chave];
    }
    var cobertura = valor.cobertura && Number.isSafeInteger(valor.cobertura.total) && Number.isSafeInteger(valor.cobertura.pendentes)
      ? { total: valor.cobertura.total, pendentes: valor.cobertura.pendentes } : null;
    return { idioma: esperado, versao: Number(valor.versao), legendas: copia, fontes: fontes, cobertura: cobertura };
  }
  async function rpc(nome, corpo, token) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 12000);
    try {
      var resposta = await fetch(REST + nome, {
        method: "POST", cache: "no-store", signal: controller.signal,
        headers: { apikey: KEY, Authorization: "Bearer " + (token || KEY), "Content-Type": "application/json" },
        body: JSON.stringify(corpo || {})
      });
      if (!resposta.ok) throw new Error("catalogo_indisponivel");
      return await resposta.json();
    } finally { clearTimeout(timer); }
  }
  async function carregar(novoIdioma) {
    if (!requisicoes[novoIdioma]) {
      requisicoes[novoIdioma] = (async function () {
        var salvo = validarPacote(ler(CACHE + novoIdioma), novoIdioma);
        if (salvo && (!pacotes[novoIdioma] || salvo.versao > pacotes[novoIdioma].versao)) pacotes[novoIdioma] = salvo;
        try {
          var remoto = validarPacote(await rpc("legendas_catalogo_rpc", { p_idioma: novoIdioma, p_modulo: null }), novoIdioma);
          if (remoto && (!pacotes[novoIdioma] || remoto.versao >= pacotes[novoIdioma].versao)) {
            pacotes[novoIdioma] = remoto;
            guardar(CACHE + novoIdioma, remoto);
          }
        } catch (erro) { /* Sem rede, conserva a ultima publicacao local valida. */ }
        return pacotes[novoIdioma] || null;
      }()).finally(function () { delete requisicoes[novoIdioma]; });
    }
    return requisicoes[novoIdioma];
  }
  function mapaAtributo(elemento, atributo) {
    try { var valor = JSON.parse(elemento.getAttribute(atributo) || "{}"); return valor && typeof valor === "object" ? valor : {}; }
    catch (erro) { return {}; }
  }
  function aplicarElemento(elemento) {
    if (elemento.closest("[data-legenda-ignorar]")) return;
    var estado = vinculados.get(elemento);
    if (!estado) { estado = { nos: Object.create(null), atributos: Object.create(null) }; vinculados.set(elemento, estado); }
    var nos = mapaAtributo(elemento, "data-legenda-nos");
    Object.keys(nos).forEach(function (indice) {
      var no = elemento.childNodes[Number(indice)];
      var chave = nos[indice];
      if (!no || no.nodeType !== 3 || !chaveValida(chave) || !tem(padrao, chave)) return;
      var item = estado.nos[indice];
      if (!item) {
        // Scripts da pagina podem escrever antes de DOMContentLoaded. Nesse
        // caso o texto estatico ja deixou de ser o dono desta apresentacao.
        if (no.nodeValue.trim() !== padrao[chave]) return;
        item = { no: no, ultimo: no.nodeValue, prefixo: no.nodeValue.match(/^\s*/)[0], sufixo: no.nodeValue.match(/\s*$/)[0] };
        estado.nos[indice] = item;
      }
      // Uma escrita posterior pelo modulo transfere a propriedade do no para ele.
      if (item.no !== no || item.ultimo !== no.nodeValue) return;
      var proximo = item.prefixo + texto(chave) + item.sufixo;
      if (proximo !== no.nodeValue) no.nodeValue = proximo;
      item.ultimo = proximo;
    });
    var atributos = mapaAtributo(elemento, "data-legenda-atributos");
    Object.keys(atributos).forEach(function (nome) {
      if (!/^(?:title|alt|aria-label|aria-description|placeholder|content)$/.test(nome) || !chaveValida(atributos[nome]) || !tem(padrao, atributos[nome])) return;
      var atual = elemento.getAttribute(nome);
      if (!tem(estado.atributos, nome) && (atual === null || atual.trim() !== padrao[atributos[nome]])) return;
      if (tem(estado.atributos, nome) && atual !== estado.atributos[nome]) return;
      var proximo = texto(atributos[nome]);
      if (atual !== proximo) elemento.setAttribute(nome, proximo);
      estado.atributos[nome] = proximo;
    });
  }
  function aplicar(raiz) {
    raiz = raiz || document;
    if (raiz.nodeType === 1 && raiz.matches("[data-legenda-nos],[data-legenda-atributos]")) aplicarElemento(raiz);
    if (raiz.querySelectorAll) raiz.querySelectorAll("[data-legenda-nos],[data-legenda-atributos]").forEach(aplicarElemento);
  }
  function vincularTexto(elemento, chave, valores) {
    if (!elemento || !chaveValida(chave)) return function () {};
    var atualizar = function () { if (elemento.isConnected) elemento.textContent = texto(chave, typeof valores === "function" ? valores() : valores); };
    elemento.textContent = texto(chave, typeof valores === "function" ? valores() : valores);
    assinantes.add(atualizar);
    return function () { assinantes.delete(atualizar); };
  }
  function atualizarApresentacao(raiz, html) {
    if (!raiz || typeof html !== "string") return false;
    var modelo = document.createElement("template");
    modelo.innerHTML = html;
    var alteracoes = [];
    var atributosVisiveis = ["title", "alt", "aria-label", "aria-description", "placeholder"];
    function comparar(atual, novo) {
      if (atual.nodeType !== novo.nodeType) return false;
      if (atual.nodeType === 3) {
        if (atual.nodeValue !== novo.nodeValue) alteracoes.push(function () { atual.nodeValue = novo.nodeValue; });
        return true;
      }
      if (atual.nodeType === 1) {
        if (atual.tagName !== novo.tagName) return false;
        // Identidade, acoes e valores nunca sao reconstruidos pela troca de idioma.
        var identidade = ["id", "name", "type", "data-screen-action", "data-action-value", "data-route", "value"];
        if (identidade.some(function (nome) { return atual.getAttribute(nome) !== novo.getAttribute(nome); })) return false;
        atributosVisiveis.forEach(function (nome) {
          if (atual.hasAttribute(nome) && novo.hasAttribute(nome) && atual.getAttribute(nome) !== novo.getAttribute(nome)) {
            alteracoes.push(function () { atual.setAttribute(nome, novo.getAttribute(nome)); });
          }
        });
        if (/^(INPUT|TEXTAREA|SCRIPT|STYLE|CANVAS)$/.test(atual.tagName) || atual.isContentEditable) return true;
        if (atual.tagName === "OPTION" && !atual.hasAttribute("value")) return true;
      }
      if (atual.childNodes.length !== novo.childNodes.length) return false;
      for (var i = 0; i < atual.childNodes.length; i += 1) {
        if (!comparar(atual.childNodes[i], novo.childNodes[i])) return false;
      }
      return true;
    }
    if (raiz.childNodes.length !== modelo.content.childNodes.length) return false;
    for (var i = 0; i < raiz.childNodes.length; i += 1) {
      if (!comparar(raiz.childNodes[i], modelo.content.childNodes[i])) return false;
    }
    alteracoes.forEach(function (alterar) { alterar(); });
    return true;
  }
  function emitir() {
    document.documentElement.lang = idioma;
    aplicar();
    atualizarSeletor();
    assinantes.forEach(function (atualizar) { atualizar(); });
    global.dispatchEvent(new CustomEvent("turbotiger:idioma", { detail: { idioma: idioma } }));
  }
  function salvarPreferenciaAtual() {
    if (!sessao || !sessao.sincronizar) return Promise.resolve();
    var atual = sessao;
    var valor = idioma;
    var versaoSessao = geracaoSessao;
    filaSalvarPreferencia = filaSalvarPreferencia.then(async function () {
      if (versaoSessao !== geracaoSessao || atual !== sessao || valor !== idioma) return;
      try { await rpc("idioma_preferencia_salvar_rpc", { p_idioma: valor }, atual.token); }
      catch (erro) { /* A escolha permanece local; nenhuma validacao de acesso depende dela. */ }
    });
    return filaSalvarPreferencia;
  }
  function ponteNativa() {
    try { return global.TurboTigerHistoricoBridge && typeof global.TurboTigerHistoricoBridge.post === "function" ? global.TurboTigerHistoricoBridge : null; }
    catch (erro) { return null; }
  }
  function confirmarNoApp(valor, solicitacao) {
    return new Promise(function (resolver) {
      var ponte = ponteNativa();
      if (!ponte) { resolver(false); return; }
      var timer = setTimeout(function () {
        if (pedidoNativo && pedidoNativo.solicitacao === solicitacao) pedidoNativo = null;
        resolver(false);
      }, 20000);
      pedidoNativo = { solicitacao: solicitacao, concluir: function (confirmado) { clearTimeout(timer); resolver(confirmado === valor); } };
      try { ponte.post("TURBO_IDIOMA:" + JSON.stringify({ idioma: valor, solicitacao: solicitacao })); }
      catch (erro) { clearTimeout(timer); pedidoNativo = null; resolver(false); }
    });
  }
  async function selecionar(novoIdioma, opcoes) {
    novoIdioma = normalizarIdioma(novoIdioma);
    if (!novoIdioma) return false;
    opcoes = opcoes || {};
    var minhaGeracao = ++geracao;
    var escolhaLocal = opcoes.origem !== "nativo" && opcoes.origem !== "conta" && opcoes.origem !== "inicio";
    var sincronizarApp = escolhaLocal && !!ponteNativa();
    var solicitacao = "";
    if (escolhaLocal) {
      escolhasLocais += 1;
      if (pedidoNativo) { pedidoNativo.concluir(""); pedidoNativo = null; }
      ultimaSolicitacaoWeb = Date.now().toString(36) + "-" + minhaGeracao + "-" + Math.random().toString(36).slice(2);
      solicitacao = ultimaSolicitacaoWeb;
      selecaoWebEmCurso = sincronizarApp;
    }
    // PT-BR ja acompanha as fontes locais; nao requer rede nem catalogo remoto.
    var pacote = novoIdioma === "pt-BR" ? null : await carregar(novoIdioma);
    if (minhaGeracao !== geracao || (opcoes.versaoSessao !== undefined && opcoes.versaoSessao !== geracaoSessao)) return false;
    // Nao anuncia como pronta uma lingua sem qualquer catalogo publicado.
    if (novoIdioma !== "pt-BR" && (!pacote || !Object.keys(pacote.legendas).length ||
        !pacote.cobertura || Number(pacote.cobertura.total) <= 0 || Number(pacote.cobertura.pendentes) !== 0 ||
        !Object.keys(padrao).every(function (chave) { return tem(pacote.legendas, chave) && pacote.fontes[chave] === padrao[chave]; }))) {
      if (minhaGeracao === geracao) selecaoWebEmCurso = false;
      return false;
    }
    if (sincronizarApp) {
      var confirmado = await confirmarNoApp(novoIdioma, solicitacao);
      if (minhaGeracao !== geracao) return false;
      selecaoWebEmCurso = false;
      if (!confirmado) return false;
    }
    idioma = novoIdioma;
    guardar(STORAGE, { idioma: idioma });
    emitir();
    if (opcoes.origem !== "conta" && opcoes.origem !== "inicio") salvarPreferenciaAtual();
    return true;
  }
  async function definirSessao(valor) {
    var versaoSessao = ++geracaoSessao;
    sessao = valor && typeof valor.token === "string" && valor.token ? { token: valor.token, sincronizar: valor.sincronizar === true } : null;
    if (!sessao || !sessao.sincronizar) return;
    var escolhaInicial = escolhasLocais;
    var atual = sessao;
    try {
      var preferencia = await rpc("idioma_preferencia_obter_rpc", {}, atual.token);
      if (versaoSessao !== geracaoSessao || escolhaInicial !== escolhasLocais || atual !== sessao) return;
      if (preferencia.definida && normalizarIdioma(preferencia.idioma)) await selecionar(preferencia.idioma, { origem: "conta", versaoSessao: versaoSessao });
      else await salvarPreferenciaAtual();
    } catch (erro) { /* Falha de preferencia nunca impede autenticacao. */ }
  }
  function atualizarSeletor() {
    if (!seletor) return;
    seletor.imagem.src = baseAssets + "bandeiras/" + idiomas[idioma].pais + ".svg";
    seletor.codigo.textContent = idioma.toUpperCase();
    seletor.botao.setAttribute("aria-label", texto("legenda_idioma_selecionar") + ": " + idiomas[idioma].nome);
    seletor.titulo.textContent = texto("legenda_idioma_selecionar");
    seletor.fechar.setAttribute("aria-label", texto("legenda_idioma_fechar"));
    seletor.opcoes.forEach(function (opcao) { opcao.setAttribute("aria-pressed", String(opcao.dataset.idioma === idioma)); });
  }
  function montarSeletor() {
    var alvo = document.querySelector("[data-tt-seletor-idioma]");
    if (!alvo || !/(?:^|\/)(?:index(?:_app)?\.html)?$/i.test(location.pathname) || alvo.closest("main")) return;
    document.body.classList.add("tt-idioma-home");
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "tt-idioma-botao";
    botao.setAttribute("aria-haspopup", "dialog");
    var imagem = document.createElement("img");
    imagem.alt = "";
    imagem.width = 24; imagem.height = 18;
    var codigo = document.createElement("span");
    codigo.className = "tt-idioma-codigo";
    botao.append(imagem, codigo);
    alvo.appendChild(botao);
    var dialogo = document.createElement("dialog");
    dialogo.className = "tt-idioma-dialogo";
    dialogo.setAttribute("aria-labelledby", "tt-idioma-titulo");
    var cabecalho = document.createElement("div");
    cabecalho.className = "tt-idioma-cabecalho";
    var titulo = document.createElement("h2");
    titulo.id = "tt-idioma-titulo";
    var fechar = document.createElement("button");
    fechar.type = "button"; fechar.textContent = "×";
    cabecalho.append(titulo, fechar);
    dialogo.appendChild(cabecalho);
    var lista = document.createElement("div");
    lista.className = "tt-idioma-opcoes";
    var opcoes = [];
    var geracaoDialogo = 0;
    var status = document.createElement("p");
    status.className = "tt-idioma-status";
    status.setAttribute("role", "status");
    Object.keys(idiomas).forEach(function (valor) {
      var opcao = document.createElement("button");
      opcao.type = "button"; opcao.dataset.idioma = valor;
      var bandeira = document.createElement("img");
      bandeira.src = baseAssets + "bandeiras/" + idiomas[valor].pais + ".svg";
      bandeira.alt = ""; bandeira.width = 28; bandeira.height = 21;
      var rotulo = document.createElement("span");
      rotulo.textContent = valor.toUpperCase();
      var nome = document.createElement("small");
      nome.textContent = idiomas[valor].nome; nome.lang = valor;
      opcao.append(bandeira, rotulo, nome);
      opcao.addEventListener("click", async function () {
        var minhaSelecao = ++geracaoDialogo;
        lista.setAttribute("aria-busy", "true");
        status.textContent = texto("legenda_idioma_carregando");
        var sucesso = await selecionar(valor);
        if (minhaSelecao !== geracaoDialogo) return;
        lista.removeAttribute("aria-busy");
        if (sucesso) { status.textContent = ""; dialogo.close(); }
        else status.textContent = texto("legenda_idioma_indisponivel");
      });
      opcoes.push(opcao); lista.appendChild(opcao);
    });
    dialogo.append(lista, status); document.body.appendChild(dialogo);
    botao.addEventListener("click", function () { status.textContent = ""; dialogo.showModal(); });
    fechar.addEventListener("click", function () { dialogo.close(); });
    dialogo.addEventListener("close", function () { botao.focus(); });
    dialogo.addEventListener("click", function (evento) {
      if (evento.target !== dialogo) return;
      var rect = dialogo.getBoundingClientRect();
      if (evento.clientX < rect.left || evento.clientX > rect.right || evento.clientY < rect.top || evento.clientY > rect.bottom) dialogo.close();
    });
    seletor = { botao: botao, imagem: imagem, codigo: codigo, titulo: titulo, fechar: fechar, opcoes: opcoes };
    atualizarSeletor();
  }
  registrar({
    legenda_idioma_selecionar: "Selecionar idioma",
    legenda_idioma_fechar: "Fechar seleção de idioma",
    legenda_idioma_carregando: "Carregando idioma…",
    legenda_idioma_indisponivel: "Este idioma ainda não está disponível. Tente novamente mais tarde."
  });
  global.TurboTigerLegendas = Object.freeze({
    texto: texto, registrar: registrar, aplicar: aplicar, vincularTexto: vincularTexto,
    atualizarApresentacao: atualizarApresentacao,
    selecionar: selecionar, definirSessao: definirSessao,
    idioma: function () { return idioma; }
  });
  global.TurboTigerIdiomaAplicado = function (valor) {
    if (!valor || !normalizarIdioma(valor.idioma)) return;
    var solicitacao = typeof valor.solicitacao === "string" ? valor.solicitacao : "";
    if (pedidoNativo && solicitacao === pedidoNativo.solicitacao) {
      var pedido = pedidoNativo; pedidoNativo = null;
      pedido.concluir(normalizarIdioma(valor.idioma));
      return;
    }
    if (selecaoWebEmCurso || (solicitacao && ultimaSolicitacaoWeb && solicitacao !== ultimaSolicitacaoWeb)) return;
    if (normalizarIdioma(valor.idioma) === idioma) return;
    selecionar(valor.idioma, { origem: "nativo" });
  };
  function iniciar() {
    aplicar(); montarSeletor();
    new MutationObserver(function (mudancas) {
      mudancas.forEach(function (mudanca) { mudanca.addedNodes.forEach(function (no) { if (no.nodeType === 1) aplicar(no); }); });
    }).observe(document.documentElement, { childList: true, subtree: true });
    var preferencia = ler(STORAGE);
    var idiomaNativo = normalizarIdioma(global.TurboTigerIdiomaNativo);
    selecionar(idiomaNativo || preferencia && normalizarIdioma(preferencia.idioma) || "pt-BR", { origem: idiomaNativo ? "nativo" : "inicio" });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
}(window));
