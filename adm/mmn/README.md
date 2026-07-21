# Turbo Tiger MMN

Modulo administrativo e de usuario para marketing multinivel do Turbo Tiger.

## Arquivos

- `index.html`: painel web em `/adm/mmn/`.
- `mmn.css`: visual do painel MMN.
- `mmn.js`: autenticacao, telas, consumo dos RPCs e modo demonstrativo.
- `supabase-mmn.sql`: backend sugerido em schema proprio `mod_mmn`.

## Backend

O SQL cria somente tabelas novas dentro de `mod_mmn`:

- `tbl_mmn_percentuais_nivel`
- `tbl_mmn_ranks`
- `tbl_mmn_periodos`
- `tbl_mmn_usuario_status`
- `tbl_mmn_qualificacoes`
- `tbl_mmn_lancamentos`
- `tbl_mmn_premios`
- `tbl_mmn_suporte_ocorrencias`
- `tbl_mmn_auditoria`

Ele tambem registra a area administrativa `mmn` em `mod_admin.tbl_adm_areas` e adiciona a permissao
ao perfil `super_admin`. Nenhuma tabela MMN nova e criada fora de `mod_mmn`.

RPCs publicos esperados pela tela:

- `public.mmn_usuario_painel_rpc()`
- `public.adm_mmn_painel_rpc(date)`
- `public.adm_mmn_rede_usuario_rpc(bigint)`

## Funcionamento

O painel usa a mesma sessao local do admin existente: `tt_admin_session_v1`.

Quando os RPCs do MMN ainda nao existem no Supabase, a tela entra em modo demonstrativo para permitir
validar fluxo, layout e navegacao sem quebrar o site.

## Regras usadas

- Ate 6 niveis.
- Payout maximo de 33%.
- Percentuais padrao: 10,7%, 8%, 7,6%, 3,8%, 1,9%, 1%.
- Ranks: Executivo, Senior, Master e Elite.
- Comissao vinculada a receita confirmada, nunca antecipada.
- Base ativa liquida, nao historico bruto.

## Publicacao

Este diretorio e apenas local. Publique manualmente no provedor quando concluir a revisao.
