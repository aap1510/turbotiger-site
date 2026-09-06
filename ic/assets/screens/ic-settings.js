(function (root) {
  "use strict";
  var IC = root.TurboTigerIC;
  IC.Screens = IC.Screens || {};

  IC.Screens.configuracoes = function (deps) {
    var Core = IC.Core, UI = IC.UI;
    var state = { status: "idle", data: null, error: null, open: "notifications", pendingSubscription: null, requests: [], dataRequest: null, requesting: false, exportText: null };
    var groups = [
      ["notifications", "Notificações", "Canal, som, vibração e horário silencioso"],
      ["clock", "Relógio", "Exibição, texto, movimento e acessibilidade"],
      ["bankroll", "Banca", "Moeda, teto percentual e contas"],
      ["data", "Dados", "Qualidade, sincronização, exportação e privacidade"],
      ["community", "Comunidade", "Transparência, contribuição e consentimentos"],
      ["ai", "Inteligência artificial", "Explicações, histórico e fallback"],
      ["security", "Segurança e emergência", "Pessoa de confiança, pausas e domínios"]
    ];

    function currencyContext() {
      var bootstrap = deps.store.getState().bootstrap;
      return bootstrap && bootstrap.data || {};
    }

    async function load(force) {
      if (state.status === "loading" || (!force && state.status === "ready")) return;
      state.status = "loading"; renderInto();
      try { var result = await deps.api.rpc("ic_configuracoes_contexto_rpc", {}, { key: "settings:context" }); state.status = "ready"; state.data = result.data || {}; state.error = null; }
      catch (error) { if (error.code === "aborted" || error.code === "stale_session") return; state.status = "error"; state.error = error; }
      renderInto();
    }

    function groupBody(id) {
      var aliases = { notifications: "notificacoes", clock: "relogio", bankroll: "banca", data: "dados", community: "comunidade", ai: "ia", security: "seguranca" };
      var data = (state.data || {})[id] || (state.data || {})[aliases[id]] || {};
      if (id === "notifications") return notificationsBody(data);
      if (id === "clock") return '<form class="ic-form" id="icSettingsClock"><label class="ic-check"><input type="checkbox" name="show_text"' + (data.show_text !== false ? " checked" : "") + '><span>Mostrar nome e motivo do estado além da cor</span></label><label class="ic-check"><input type="checkbox" name="reduced_motion"' + (data.reduced_motion ? " checked" : "") + '><span>Reduzir animações</span></label><label class="ic-check"><input type="checkbox" name="show_advanced"' + (data.show_advanced ? " checked" : "") + '><span>Mostrar métricas avançadas no painel expandido</span></label><p class="ic-required-note">Os limiares de segurança são administrados por política e não podem ser ampliados durante uma sessão.</p>' + saveButton(id) + '</form>';
      if (id === "bankroll") return '<form class="ic-form" id="icSettingsBankroll"><div class="ic-field"><label for="ic-bankroll-currency">Moeda principal</label><select id="ic-bankroll-currency" name="currency">' + Core.currencyOptions(currencyContext(), data.currency || "", "Selecione a moeda") + '</select></div><div class="ic-field"><label for="ic-bankroll-cap">Teto percentual por rodada</label><input id="ic-bankroll-cap" name="stake_percent_cap" inputmode="decimal" value="' + Core.escapeHtml(data.stake_percent_cap || "") + '" placeholder="Ex.: 0,50%"></div>' + UI.banner("Saldo reconciliado", Core.safeText(data.reconciliation_message, "A banca protegida só usa saldos com origem e qualidade conhecidas."), data.reconciliation_status || "neutral") + saveButton(id) + '</form>';
      if (id === "data") return dataBody(data);
      if (id === "community") return UI.banner("Uso agregado", "Sua participação nunca expõe linhas individuais. Recortes pequenos permanecem suprimidos.", "control") + '<form class="ic-form" id="icSettingsCommunity"><label class="ic-check"><input type="checkbox" name="contribute"' + (data.contribute ? " checked" : "") + '><span>Permitir contribuição pseudonimizada para análises comunitárias elegíveis</span></label><p class="ic-required-note">Retirar o consentimento afeta usos futuros conforme a política, sem reescrever auditoria legítima.</p>' + saveButton(id) + '</form>';
      if (id === "ai") return '<form class="ic-form" id="icSettingsAi"><label class="ic-check"><input type="checkbox" name="enabled"' + (data.enabled !== false ? " checked" : "") + '><span>Permitir explicações do Tiger Coach</span></label><label class="ic-check"><input type="checkbox" name="aggregated_context"' + (data.aggregated_context ? " checked" : "") + '><span>Permitir contexto agregado já validado pelo motor determinístico</span></label><p class="ic-required-note">Desativar a IA não desativa relógio, regras, alertas ou cálculos.</p>' + saveButton(id) + '</form>';
      var emergencyAction = deps.featureEnabled("ic_emergency_enabled") ? '<div class="ic-card__footer">' + UI.button("Abrir pausas", { route: "regras-pausas", icon: "shield" }) + '</div>' : "";
      return UI.banner("Proteção ativa", Core.safeText(data.message, "Pausas e domínios reconhecidos permanecem disponíveis na área de segurança."), data.status || "control") + '<div class="ic-list">' + UI.listRow("Pessoa de confiança", "Contato somente com consentimento explícito", Core.safeText(data.trusted_contact_status, "Não configurada")) + UI.listRow("Domínios reconhecidos", "Proteção contra clones e redirecionamentos", Core.safeText(data.recognized_domains_status, "Verificando")) + UI.listRow("Autoexclusão e apoio", "Acesso a recursos oficiais quando necessário", "Disponível") + '</div>' + emergencyAction;
    }

    function dataBody(data) {
      var requests = state.requests.map(function (item) {
        return UI.listRow(item.tipo === "exportacao_resumo" ? "Resumo agregado" : "Solicitação de correção", Core.formatDateTime(item.criado_em), item.status === "pronta" ? "Pronto" : "Recebida para revisão", UI.button("Consultar", { action: "data-request-detail", value: item.id_solicitacao }));
      }).join("");
      return UI.banner("Qualidade da captura", Core.safeText(data.quality_message, "Nenhuma informação de qualidade foi recebida."), data.quality_status || "capture") + '<div class="ic-list">' + UI.listRow("Última captura", "Último evento aceito pelo pipeline", Core.formatDateTime(data.last_capture_at)) + UI.listRow("Última sincronização", "Reconciliação concluída", Core.formatDateTime(data.last_sync_at)) + UI.listRow("Lacunas", "Intervalos conhecidos sem cobertura completa", Core.safeText(data.gaps || 0)) + '</div><div class="ic-card__footer">' + UI.button("Preparar resumo para exportação", { action: "request-export", disabled: state.requesting }) + UI.button("Informar correção", { action: "request-correction", disabled: state.requesting }) + '</div><p>O resumo inclui a visão geral, as regras e as preferências atuais. Não contém a lista completa de rodadas.</p>' + (requests ? '<section><h3>Últimas solicitações</h3><div class="ic-list">' + requests + '</div></section>' : '');
    }

    async function loadRequests() {
      try { var result = await deps.api.rpc("ic_dados_solicitacoes_listar_rpc", {}, { key: "settings:data-list" }); state.requests = Core.normalizeArray((result.data || {}).items); renderInto(); }
      catch (error) { UI.toast(error.message || "Não foi possível consultar as solicitações."); }
    }

    async function showRequest(id) {
      if (!Core.validUuid(id)) return;
      try {
        var result = await deps.api.rpc("ic_dados_solicitacao_consultar_rpc", { p_id_solicitacao: id }, { key: "settings:data-detail" });
        var item = result.data || {};
        state.exportText = item.tipo === "exportacao_resumo" ? JSON.stringify(item.conteudo, null, 2) : null;
        var body = state.exportText ? '<p>Resumo agregado gerado em ' + Core.escapeHtml(Core.formatDateTime(item.criado_em)) + '.</p><div class="ic-field"><label for="icExportSummary">Conteúdo do resumo</label><textarea id="icExportSummary" readonly rows="12">' + Core.escapeHtml(state.exportText) + '</textarea></div>' + UI.button("Copiar resumo", { action: "copy-export" }) : UI.banner("Solicitação recebida para revisão", item.descricao || "", "neutral");
        UI.openSheet({ title: state.exportText ? "Seu resumo" : "Correção informada", html: body });
      } catch (error) { UI.toast(error.message || "Não foi possível consultar esta solicitação."); }
    }

    async function requestData(kind, description) {
      if (state.requesting) return;
      state.requesting = true;
      try {
        if (!state.dataRequest || state.dataRequest.kind !== kind || state.dataRequest.description !== description) {
          if (!root.crypto || typeof root.crypto.randomUUID !== "function") throw new Error("Não foi possível identificar a solicitação neste dispositivo.");
          state.dataRequest = { kind: kind, description: description, key: root.crypto.randomUUID() };
        }
        var result = await deps.api.rpc("ic_dados_solicitar_rpc", { p_tipo: kind, p_chave_idempotencia: state.dataRequest.key, p_descricao: description || null }, { key: "settings:data-request" });
        state.dataRequest = null;
        UI.closeSheet();
        await loadRequests();
        await showRequest((result.data || {}).id_solicitacao);
      } catch (error) { UI.toast(error.message || "Não foi possível registrar a solicitação."); }
      finally { state.requesting = false; renderInto(); }
    }

    function subscriptionCode(item) { return item && (item.code || item.codigo || item.hypothesis_code || item.codigo_hipotese); }
    function evidenceId(item) { return Core.validUuid(item && (item.id_insight_evidencia || item.insight_evidence_id || item.uuid_insight_evidencia || item.evidence_id)); }
    function sourceLabel(value) { return value === "pessoal" ? "Meu histórico" : value === "comunidade" ? "Comunidade" : "Meu histórico + comunidade"; }
    function notificationChannel(value) { value = String(value || "hybrid").toLowerCase(); return value === "remoto" ? "remote" : value === "hibrido" ? "hybrid" : ["local", "remote", "hybrid"].indexOf(value) >= 0 ? value : "hybrid"; }
    function channelOption(value, label, current) { return '<option value="' + value + '"' + (current === value ? " selected" : "") + '>' + label + '</option>'; }
    function subscriptions(data) { return Core.normalizeArray(data.subscriptions || data.assinaturas || data.hypothesis_subscriptions || data.assinaturas_hipoteses); }
    function notificationsBody(data) {
      var active = subscriptions(data);
      var currentChannel = notificationChannel(data.channel);
      var list = active.length ? '<section><div class="ic-card__header"><div><h3>Lembretes de padrões históricos</h3><p>Avisos dinâmicos sem data fixa. Cada aviso identifica sua origem efetiva e a direção observada.</p></div></div><div class="ic-list">' + active.map(function (item, index) {
        var direction = item.direction || item.direcao || "descritiva";
        var effective = item.effective_source || item.fonte_efetiva;
        return UI.listRow(item.title || item.titulo || subscriptionCode(item) || "Padrão histórico", "Direção observada: " + direction + (effective ? " · Origem efetiva: " + sourceLabel(effective) : ""), "Preferência: " + sourceLabel(item.source || item.fonte || item.scope || item.escopo_estatistico || "ambos"), evidenceId(item) ? UI.button("Gerenciar", { action: "settings-subscription", value: evidenceId(item), icon: "bell", kind: "quiet" }) : "");
      }).join("") + '</div></section>' : UI.state({ type: "empty", title: "Nenhum lembrete de padrão", message: "Você poderá acompanhar ocorrências em Estatísticas, Histórico ou Comunidade, escolhendo a origem pessoal, comunitária ou ambas.", retry: false });
      return '<form class="ic-form" id="icSettingsNotifications"><div class="ic-field"><label for="ic-notification-channel">Canal do lembrete</label><select id="ic-notification-channel" name="channel">' + channelOption("local", "Local", currentChannel) + channelOption("remote", "Remoto", currentChannel) + channelOption("hybrid", "Híbrido", currentChannel) + '</select><small>O lembrete funcional é obrigatório em toda Sessão Planejada. Aqui você escolhe apenas como ele será entregue.</small></div><label class="ic-check"><input type="checkbox" name="sound"' + (data.sound !== false ? " checked" : "") + '><span>Som nos alertas permitidos</span></label><label class="ic-check"><input type="checkbox" name="vibration"' + (data.vibration !== false ? " checked" : "") + '><span>Vibração nos alertas permitidos</span></label><div class="ic-form-grid"><div class="ic-field"><label for="ic-quiet-start">Silencioso a partir de</label><input id="ic-quiet-start" type="time" name="quiet_start" value="' + Core.escapeHtml(data.quiet_start || "22:00") + '"></div><div class="ic-field"><label for="ic-quiet-end">Até</label><input id="ic-quiet-end" type="time" name="quiet_end" value="' + Core.escapeHtml(data.quiet_end || "08:00") + '"></div></div>' + saveButton("notifications") + '</form><div class="ic-disclaimer">Lembrete de Sessão Planejada e assinatura de padrão são contratos diferentes: o primeiro sempre tem data e horário; a assinatura acompanha uma análise sem marcar sessão. No canal Local, uma ocorrência estatística aparece somente no painel enquanto o aplicativo estiver disponível; a origem pessoal/comunitária nunca é afirmada por um agendamento antigo sem revalidação.</div>' + list;
    }

    function communityEligible(item) { return item.community_eligible !== false && item.comunidade_elegivel !== false && item.community_cell_eligible !== false && item.celula_comunitaria_elegivel !== false; }
    function openSubscription(item) {
      state.pendingSubscription = item;
      var direction = item.direction || item.direcao || "descritiva";
      var eligible = communityEligible(item);
      UI.openSheet({ eyebrow: subscriptionCode(item), title: "Gerenciar lembrete de padrão", html: UI.banner("Direção observada: " + direction, "Escolha quais dados devem sustentar o lembrete recorrente. A notificação exibirá apenas a fonte efetivamente elegível naquela ocorrência.", "neutral") + '<div class="ic-choice-grid">' + UI.button("Meu histórico", { action: "settings-source", value: "pessoal" }) + UI.button("Comunidade", { action: "settings-source", value: "comunidade" }) + UI.button("Ambos, quando elegíveis", { action: "settings-source", value: "ambos", kind: "primary" }) + '</div>' + (!eligible ? UI.banner("Comunidade ainda sem evidência elegível", "A preferência pode permanecer ativa. Nenhum aviso alegará origem comunitária até que a célula atenda aos critérios de amostra, qualidade, concentração e privacidade.", "neutral") : '') + '<div class="ic-card__footer">' + UI.button("Desativar lembrete", { action: "settings-unsubscribe", kind: "danger" }) + '</div><div class="ic-disclaimer">Sem data fixa: o Turbo Tiger avisará em cada nova ocorrência da janela histórica. Isso não cria Sessão Planejada nem prevê resultados.</div>' });
    }

    async function saveSubscription(source, active) {
      var item = state.pendingSubscription;
      if (!item || !evidenceId(item)) return;
      try {
        await deps.api.rpc("ic_hipotese_notificacao_rpc", { p_id_insight_evidencia: evidenceId(item), p_escopo_estatistico: source, p_ativa: active }, { key: "settings:subscription" });
        UI.closeSheet(); UI.toast(active ? "Origem da assinatura atualizada." : "Assinatura desativada."); state.pendingSubscription = null; state.status = "idle"; await load(true);
      } catch (error) { UI.toast(error.message || "Não foi possível atualizar a assinatura."); }
    }

    function saveButton(id) { return UI.button("Salvar esta seção", { type: "submit", kind: "primary", value: id }); }

    function content() {
      var visible = groups.filter(function (group) { return group[0] !== "ai" || deps.featureEnabled("ic_ai_coach_enabled"); });
      return '<div class="ic-settings-list">' + visible.map(function (group) { var isOpen = state.open === group[0]; return '<section class="ic-settings-group"><button type="button" data-screen-action="settings-group" data-action-value="' + group[0] + '" aria-expanded="' + isOpen + '"><span><strong>' + group[1] + '</strong><small class="ic-metric__detail">' + group[2] + '</small></span>' + UI.icon("chevron") + '</button>' + (isOpen ? '<div class="ic-settings-group__body">' + groupBody(group[0]) + '</div>' : '') + '</section>'; }).join("") + '</div>';
    }

    function render() {
      var html = UI.sectionHeader("Configurações", "Preferências de entrega, acessibilidade, dados e proteção.", UI.button("Atualizar", { action: "retry", icon: "refresh" })) + '<div class="ic-page-stack">';
      if (state.status === "idle" || state.status === "loading") html += UI.state({ type: "loading", retry: false });
      else if (state.status === "error") html += UI.state({ type: state.error && state.error.code === "offline" ? "offline" : state.error && /^http_40[346]$/.test(state.error.code || "") ? "unavailable" : "error", message: state.error && state.error.message });
      else html += content();
      return html + '</div>';
    }
    function renderInto() { deps.container.innerHTML = render(); }
    async function handleAction(action, value) {
      if (action === "retry") load(true);
      if (action === "settings-group") { state.open = state.open === value ? null : value; renderInto(); if (state.open === "data") await loadRequests(); }
      if (action === "settings-subscription") { var notifications = (state.data || {}).notifications || (state.data || {}).notificacoes || {}; var item = subscriptions(notifications).find(function (candidate) { return String(evidenceId(candidate)) === String(value); }); if (item) openSubscription(item); }
      if (action === "settings-source" && ["pessoal", "comunidade", "ambos"].indexOf(value) >= 0) return saveSubscription(value, true);
      if (action === "settings-unsubscribe") return saveSubscription((state.pendingSubscription && (state.pendingSubscription.source || state.pendingSubscription.fonte || state.pendingSubscription.scope || state.pendingSubscription.escopo_estatistico)) || "ambos", false);
      if (action === "request-export") return requestData("exportacao_resumo", null);
      if (action === "request-correction") UI.openSheet({ title: "Informar uma correção", html: '<form class="ic-form" id="icDataCorrection"><div class="ic-field"><label for="icCorrectionDescription">O que precisa ser revisado?</label><textarea id="icCorrectionDescription" name="description" minlength="10" maxlength="2000" required></textarea><small>Indique a data, a Bet e o registro envolvido. Não informe senhas ou códigos de acesso.</small></div><p>A solicitação fica registrada para revisão. Nenhuma rodada ou movimentação será alterada automaticamente.</p>' + UI.button("Registrar solicitação", { type: "submit", disabled: state.requesting }) + '</form>' });
      if (action === "data-request-detail") return showRequest(value);
      if (action === "copy-export" && state.exportText) {
        try { if (!root.navigator || !root.navigator.clipboard) throw new Error("clipboard_unavailable"); await root.navigator.clipboard.writeText(state.exportText); UI.toast("Resumo copiado."); }
        catch (_error) { var field = document.getElementById("icExportSummary"); if (field) { field.focus(); field.select(); } UI.toast("Selecione o conteúdo e use Copiar no seu dispositivo."); }
      }
    }
    async function handleSubmit(form) {
      if (form.id === "icDataCorrection") {
        var description = String(new FormData(form).get("description") || "").trim();
        if (description.length < 10 || description.length > 2000) { UI.toast("Descreva a correção em 10 a 2.000 caracteres."); return; }
        return requestData("correcao", description);
      }
      if (form.id.indexOf("icSettings") !== 0) return;
      var sectionMap = { icSettingsNotifications: "notifications", icSettingsClock: "clock", icSettingsBankroll: "bankroll", icSettingsCommunity: "community", icSettingsAi: "ai" };
      var section = sectionMap[form.id]; if (!section) return;
      var values = new FormData(form), payload = {};
      values.forEach(function (value, key) { payload[key] = value === "on" ? true : value; });
      if (section === "bankroll") {
        var currency = Core.currencyCatalog(currencyContext()).find(function (item) { return item.code === payload.currency; });
        if (!currency) { UI.toast("Escolha uma moeda do catálogo validado."); return; }
        payload.decimal_places = currency.decimal_places;
      }
      Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"]')).forEach(function (input) { payload[input.name] = input.checked; });
      try { await deps.api.rpc("ic_configuracoes_salvar_rpc", { p_secao: section, p_preferencias: payload }, { key: "settings:save" }); UI.toast("Configurações salvas."); state.status = "idle"; await load(true); }
      catch (error) { UI.toast(error.message || "Não foi possível salvar as configurações."); }
    }
    return { render: render, load: load, handleAction: handleAction, handleSubmit: handleSubmit };
  };
}(window));
