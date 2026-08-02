# Turbo Tiger — Painel MMN

Frontend local do programa de indicações, fidelização e benefícios.

## Superfícies

- **Usuário:** disponível somente no WebView institucional. A sessão é recebida pela ponte nativa, sem formulário de login, troca de conta ou saída.
- **Administração/Suporte:** disponível no navegador com Supabase Auth e capacidades retornadas por `adm_contexto_rpc()`.
- A mesma URL `/adm/mmn/index.html` é preservada para manter a validação existente no app.

## Ponte do app

Os contratos nativos preservados são:

- solicitação de sessão: `TURBO_MMN_SESSION_REQUEST`;
- retorno da sessão: `window.TurboTigerMmnReceiveSession(payload)`;
- compartilhamento nativo: `TURBO_SHARE_INVITE`.

O token recebido pelo app permanece somente em memória. A área do usuário não pode ser selecionada pelo login do navegador.

## Arquivos

- `index.html`: estrutura das superfícies de usuário, Administração e Suporte;
- `mmn.css`: sistema visual responsivo, incluindo a experiência mobile do WebView;
- `mmn.js`: autenticação, capacidades, RPCs, renderização, paginação e mutações auditadas;
- `supabase-mmn.sql`: índice não executável das migrations oficiais do módulo.

## Backend oficial

O backend final é composto, nesta ordem, por três migrations locais:

1. `supabase/migrations/20260801040000_mmn_sistema_completo.sql`: schema isolado `mod_mmn`, regras versionadas, genealogia, elegibilidade, competências, comissões, governança, regulamento, aceite, lotes, auditoria e contratos base;
2. `supabase/migrations/20260801041000_mmn_simuladores_v2.sql`: simuladores V2 do usuário e da administração, cenários, coortes/mix de planos, replay histórico, persistência, comparação e exportação;
3. `supabase/migrations/20260801042000_mmn_operacional_final.sql`: validações fiscais/RPA, notificações, expiração de elegibilidade, privacidade por capacidade, progresso de publicação e fechamento final de privilégios.

As migrations são aplicadas isoladamente pelo CLI local, na ordem acima. Não use `supabase db push` para este módulo.

## Integridade dos dados

- Não existe modo demonstrativo nem fallback com números fictícios.
- Falhas do backend são mostradas como falhas; nunca são convertidas em dados operacionais.
- Valores financeiros são consumidos em campos `*_centavos` e apenas formatados no cliente.
- Comissão, elegibilidade, qualificação, payout, retenções e simulações oficiais são calculados pelo backend.
- A evolução de bônus usa `evolucao_mensal`; os detalhes do Pool Global vêm exclusivamente de `extrato[].detalhes`.
- Notificações do usuário usam somente `eventos`, sem conteúdo demonstrativo.
- A chave PIX atual é exibida apenas mascarada; chave vazia ao salvar preserva o cadastro existente no backend.
- O documento fiscal RPA e o comprovante da transferência são referências independentes. Nenhum pagamento manual ou automático pode começar sem RPA emitido.
- O lote automático permanece `aprovado` até a emissão do RPA; a emissão enfileira somente o beneficiário documentalmente pronto.
- Filtros paginados usam cursores retornados pelo servidor.
- Busca de lista de espera e ocorrências é executada pelo servidor pelo parâmetro `p_busca`.
- Ações administrativas exigem justificativa e dependem das capacidades efetivas do usuário autenticado.

## RPCs consumidos

### Usuário

- `mmn_usuario_painel_rpc()`
- `mmn_usuario_aderir_rpc(...)`
- `mmn_usuario_perfil_pagamento_salvar_rpc(...)`
- `mmn_usuario_simular_rpc(jsonb)`
- `mmn_usuario_contestar_rpc(...)`
- `mmn_usuario_evento_marcar_lido_rpc(bigint)`

### Administração/Suporte

- contexto e painel: `adm_contexto_rpc()`, `adm_mmn_painel_rpc(date)`, `adm_mmn_usuario_detalhe_rpc(bigint)`;
- configuração e governança: `adm_mmn_config_obter_rpc`, `adm_mmn_config_salvar_rpc`, `adm_mmn_config_publicar_rpc`, `adm_mmn_config_publicacao_progresso_rpc`, `adm_mmn_config_duplicar_rpc`, `adm_mmn_config_aprovador_salvar_rpc`, `adm_mmn_documento_salvar_rpc`, `adm_mmn_config_documento_vincular_rpc`, `adm_mmn_fiscal_homologar_rpc`;
- competências: `adm_mmn_periodo_apurar_rpc`, `adm_mmn_periodo_fechar_rpc`, `adm_mmn_periodo_reabrir_rpc`;
- participantes e espera: `adm_mmn_participante_status_rpc`, `adm_mmn_participante_grupo_rpc`, `adm_mmn_patrocinador_corrigir_rpc`, `adm_mmn_pix_validar_rpc`, `adm_mmn_espera_decidir_rpc`;
- pagamentos e RPA: `adm_mmn_lote_criar_rpc`, `adm_mmn_lote_aprovar_rpc`, `adm_mmn_lote_marcar_pago_rpc`, `adm_mmn_rpa_registrar_rpc`, `adm_mmn_rpa_emitir_rpc`, `adm_mmn_rpas_listar_rpc`, `adm_mmn_rpa_obter_rpc`;
- suporte: `adm_mmn_ocorrencia_atualizar_rpc`;
- simuladores V2: `adm_mmn_simular_rpc`, `adm_mmn_simular_historico_rpc`, `adm_mmn_simulacoes_listar_rpc`, `adm_mmn_simulacao_obter_rpc`, `adm_mmn_simulacoes_comparar_rpc`, `adm_mmn_simulacao_exportar_rpc`;
- consultas paginadas: `adm_mmn_participantes_listar_rpc`, `adm_mmn_espera_listar_rpc`, `adm_mmn_receitas_listar_rpc`, `adm_mmn_auditoria_listar_rpc`, `adm_mmn_ocorrencias_listar_rpc`.

### Worker (`service_role`)

- `mmn_pagamento_saida_proximo_rpc(text)`
- `mmn_pagamento_saida_resultado_rpc(...)`
- `mmn_expiracoes_processar_rpc(timestamptz)`

Esses contratos não são concedidos a `anon` nem a `authenticated`.

## Publicação

Os arquivos deste diretório são apenas locais. A publicação no site é manual e não é realizada por este módulo.
