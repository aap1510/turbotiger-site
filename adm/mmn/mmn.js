(function () {
  "use strict";
  var LEGENDAS_MMN = {
"legenda_fechamento_extra_emitido":"emitido",
"legenda_fechamento_extra_rascunho":"rascunho",
"legenda_fechamento_extra_confirmada":"confirmada",
"legenda_fechamento_extra_motor":"Motor ",
  "legenda_fechamento_mmn_escolher_endereco": "Selecione um dos ",
  "legenda_fechamento_mmn_enderecos_encontrados": " endereços encontrados",
  "legenda_fechamento_mmn_nivel": "Nível ",
  "legenda_fechamento_mmn_ativos_de": "ativos de ",
  "legenda_fechamento_mmn_participantes": " participantes",
  "legenda_fechamento_mmn_competencia": "Competência ",
  "legenda_fechamento_mmn_liquido": "Líquido: ",
  "legenda_fechamento_mmn_transferencia": "Transferência ",
  "legenda_fechamento_mmn_diretos_ativos": " diretos ativos",
  "legenda_fechamento_mmn_simulacao": "Simulação #",
  "legenda_fechamento_mmn_profundidade": "Profundidade remunerada: ",
  "legenda_fechamento_mmn_niveis_sufixo": " nível(is).",
  "legenda_fechamento_mmn_sem_limite": "Não há limite estrutural horizontal. A profundidade remunerada permanece em ",
  "legenda_fechamento_mmn_rede_ate": "Rede até o nível ",
  "legenda_fechamento_mmn_posicoes": " posições",
  "legenda_fechamento_mmn_capacidade_perna": "Capacidade por perna: ",
  "legenda_fechamento_mmn_versao": "Versão ",
  "legenda_fechamento_mmn_modelo_juridico": " · modelo jurídico Regulamento MMN v1.",
  "legenda_fechamento_mmn_comparacao_base": "Comparação com baseline #",
  "legenda_fechamento_mmn_ativos": " ativos",
  "legenda_fechamento_mmn_de": "de ",

"legenda_mmn_estado_ativo": "ativo",
"legenda_mmn_estado_elegivel": "elegivel",
"legenda_mmn_estado_confirmado": "confirmado",
"legenda_mmn_estado_pago": "pago",
"legenda_mmn_estado_concluido": "concluido",
"legenda_mmn_estado_ok": "ok",
"legenda_mmn_estado_convertido": "convertido",
"legenda_mmn_estado_homologado": "homologado",
"legenda_mmn_estado_pendente": "pendente",
"legenda_mmn_estado_apurando": "apurando",
"legenda_mmn_estado_retido": "retido",
"legenda_mmn_estado_revisao": "revisao",
"legenda_mmn_estado_aguardando": "aguardando",
"legenda_mmn_estado_fila": "fila",
"legenda_mmn_estado_enviado": "enviado",
"legenda_mmn_estado_aberto": "aberto",
"legenda_mmn_estado_aberta": "aberta",
"legenda_mmn_estado_em_atendimento": "em_atendimento",
"legenda_mmn_estado_bloqueado": "bloqueado",
"legenda_mmn_estado_cancelado": "cancelado",
"legenda_mmn_estado_falhou": "falhou",
"legenda_mmn_estado_revertido": "revertido",
"legenda_mmn_estado_permanente": "permanente",
"legenda_mmn_estado_inelegivel": "inelegivel",
"legenda_mmn_complemento_acompanhe_sua_jornada": ". Acompanhe sua jornada.",
"legenda_mmn_complemento_ativos": " ativos",
"legenda_mmn_complemento_de": " de ",
"legenda_mmn_complemento_diretos": " diretos",
"legenda_mmn_complemento_vagas_por_participante": " vagas por participante",
"legenda_mmn_complemento_indicado": " indicado",
"legenda_mmn_complemento_indicados": " indicados",
"legenda_mmn_complemento_pool": " · pool ",
"legenda_mmn_complemento_participante_qualificado": " participante qualificado",
"legenda_mmn_complemento_participantes_qualificados": " participantes qualificados",
"legenda_mmn_complemento_meses": " meses.",
"legenda_mmn_complemento_pessoas_ativas_na_rede": " pessoas ativas na rede · ",
"legenda_mmn_complemento_spillover": " · spillover",
"legenda_mmn_complemento_para_largura": " para largura ",
"legenda_mmn_complemento_pre_visualizacao_do_regulamento": "Pré-visualização do regulamento",
"legenda_mmn_complemento_no_hash_atual": " no hash atual",
"legenda_mmn_complemento_sem_nome": "sem nome",
"legenda_mmn_complemento_a_genealogia_sera_preservada_sem_reservar_ou_alterar_o_cod_usuario_normal": "A genealogia será preservada sem reservar ou alterar o cod_usuario normal.",
"legenda_mmn_complemento_recalculado": " · recalculado ",
"legenda_mmn_complemento_payout": " · payout ",
"legenda_mmn_complemento_config": " · Config. #",
"legenda_mmn_complemento_margem": " · margem ",
"legenda_mmn_rotulo_aguarde": "Aguarde...",
"legenda_mmn_rotulo_celular": "Celular",
"legenda_mmn_rotulo_verificando": "Verificando...",
"legenda_mmn_rotulo_confirmando": "Confirmando...",
"legenda_mmn_rotulo_nenhum_estado_encontrado": "Nenhum estado encontrado.",
"legenda_mmn_rotulo_selecione": "Selecione",
"legenda_mmn_rotulo_rank": "Rank ",
"legenda_mmn_rotulo_base": "Base",
"legenda_mmn_rotulo_marcar_como_lida": "Marcar como lida",
"legenda_mmn_rotulo_raiz": "Raiz",
"legenda_mmn_rotulo_ilimitada": "Ilimitada",
"legenda_mmn_rotulo_indicado": "Indicado",
"legenda_mmn_rotulo_ativo": "Ativo",
"legenda_mmn_rotulo_inativo": "Inativo",
"legenda_mmn_rotulo_a_consulta_atingiu_o_limite_de_registros_este_diagrama_esta_incompleto_e_nao": "A consulta atingiu o limite de registros. Este diagrama está incompleto e não representa toda a sua rede.",
"legenda_mmn_rotulo_sua_rede_de_posicionamento": "Sua rede de posicionamento",
"legenda_mmn_rotulo_nao_foi_possivel_atualizar_o_diagrama_completo_agora_a_visualizacao_usa_os_dados": "Não foi possível atualizar o diagrama completo agora. A visualização usa os dados já carregados.",
"legenda_mmn_rotulo_qualificado": "Qualificado",
"legenda_mmn_rotulo_contestar": "Contestar",
"legenda_mmn_rotulo_ver_participantes_qualificados": "Ver participantes qualificados",
"legenda_mmn_rotulo_coeficiente": "Coeficiente",
"legenda_mmn_rotulo_pago": "Pago",
"legenda_mmn_rotulo_abrir_documento_rpa": "Abrir documento RPA",
"legenda_mmn_rotulo_apurado": "Apurado",
"legenda_mmn_rotulo_aprovado": "Aprovado",
"legenda_mmn_rotulo_resultado": "Resultado",
"legenda_mmn_rotulo_base_real_usada": "Base real usada",
"legenda_mmn_rotulo_a_projecao_parte_dos_seus_dados_atuais_e_das_regras_vigentes": "A projeção parte dos seus dados atuais e das regras vigentes.",
"legenda_mmn_rotulo_mes": "Mês",
"legenda_mmn_rotulo_ativos": "Ativos",
"legenda_mmn_rotulo_receita": "Receita",
"legenda_mmn_rotulo_recalculado": "Recalculado",
"legenda_mmn_rotulo_payout": "Payout",
"legenda_mmn_rotulo_avisos_da_simulacao": "Avisos da simulação",
"legenda_mmn_rotulo_simulacao_estimativa_sem_promessa_ou_garantia_de_renda_pagamento_ou_resultado": "Simulação estimativa, sem promessa ou garantia de renda, pagamento ou resultado.",
"legenda_mmn_rotulo_sim": "Sim",
"legenda_mmn_rotulo_apurar": "Apurar",
"legenda_mmn_rotulo_fechar": "Fechar",
"legenda_mmn_rotulo_reabrir": "Reabrir",
"legenda_mmn_rotulo_indicacao_direta": "Indicação direta",
"legenda_mmn_rotulo_spillover": "Spillover",
"legenda_mmn_rotulo_permanente": "Permanente",
"legenda_mmn_rotulo_gerenciar": "Gerenciar",
"legenda_mmn_rotulo_aprovar": "Aprovar",
"legenda_mmn_rotulo_cancelar": "Cancelar",
"legenda_mmn_rotulo_revisar": "Revisar",
"legenda_mmn_rotulo_patrocinio": "Patrocínio",
"legenda_mmn_rotulo_origem_da_comissao_direta": "Origem da comissão direta.",
"legenda_mmn_rotulo_pai_de_posicionamento": "Pai de posicionamento",
"legenda_mmn_rotulo_origem_dos_niveis_residuais": "Origem dos níveis residuais.",
"legenda_mmn_rotulo_vaga": "Vaga",
"legenda_mmn_rotulo_slot_estrutural_registrado": "Slot estrutural registrado.",
"legenda_mmn_rotulo_regra": "Regra",
"legenda_mmn_rotulo_duas_genealogias_independentes": "Duas genealogias independentes",
"legenda_mmn_rotulo_patrocinio_preserva_quem_convidou_posicionamento_organiza_as_vagas_e_o_spillover_a_comissao": "Patrocínio preserva quem convidou. Posicionamento organiza as vagas e o spillover. A comissão direta prevalece e o mesmo beneficiário não recebe duas vezes sobre a mesma assinatura.",
"legenda_mmn_rotulo_patrocinio_indicados_diretos": "Patrocínio · indicados diretos",
"legenda_mmn_rotulo_vinculo_permanente_de_indicacao": "Vínculo permanente de indicação",
"legenda_mmn_rotulo_posicionamento_vagas_abaixo": "Posicionamento · vagas abaixo",
"legenda_mmn_rotulo_aguardando": "Aguardando",
"legenda_mmn_rotulo_gera": "Gera",
"legenda_mmn_rotulo_largura_ilimitada": "Largura ilimitada",
"legenda_mmn_rotulo_capacidade_teorica_da_matriz": "Capacidade teórica da matriz",
"legenda_mmn_rotulo_por_nivel_w": "Por nível (W",
"legenda_mmn_rotulo_configuracao_invalida": "Configuração inválida",
"legenda_mmn_rotulo_use_0_para_ilimitada_ou_um_inteiro_a_partir_de_2": "Use 0 para ilimitada ou um inteiro a partir de 2.",
"legenda_mmn_rotulo_percentual": "Percentual (%)",
"legenda_mmn_rotulo_diretos_ativos_minimos": "Diretos ativos mínimos",
"legenda_mmn_rotulo_pernas_qualificadas_minimas": "Pernas qualificadas mínimas",
"legenda_mmn_rotulo_ativos_minimos_por_perna": "Ativos mínimos por perna",
"legenda_mmn_rotulo_nao": "Não",
"legenda_mmn_rotulo_fechamento": "Fechamento",
"legenda_mmn_rotulo_pagamento": "Pagamento",
"legenda_mmn_rotulo_reabertura": "Reabertura",
"legenda_mmn_rotulo_uid": "UID ",
"legenda_mmn_rotulo_perfil": "Perfil ",
"legenda_mmn_rotulo_chave": "Chave",
"legenda_mmn_rotulo_nome": "Nome",
"legenda_mmn_rotulo_rede_ativa_minima": "Rede ativa mínima",
"legenda_mmn_rotulo_maximo_da_maior_perna": "Máximo da maior perna (%)",
"legenda_mmn_rotulo_bonus_de_lideranca": "Bônus de liderança (%)",
"legenda_mmn_rotulo_coeficiente_pool": "Coeficiente pool",
"legenda_mmn_rotulo_remover": "Remover",
"legenda_mmn_rotulo_grupo": "Grupo",
"legenda_mmn_rotulo_dispensa_premium": "Dispensa Premium",
"legenda_mmn_rotulo_tipo": "Tipo",
"legenda_mmn_rotulo_percentual_mensagem": "Percentual",
"legenda_mmn_rotulo_valor_fixo": "Valor fixo",
"legenda_mmn_rotulo_faixas": "Faixas",
"legenda_mmn_rotulo_reter": "Reter",
"legenda_mmn_rotulo_aliquota": "Alíquota (%)",
"legenda_mmn_rotulo_base_minima_r": "Base mínima (R$)",
"legenda_mmn_rotulo_teto_r": "Teto (R$)",
"legenda_mmn_rotulo_municipio": "Município",
"legenda_mmn_rotulo_estado": "Estado",
"legenda_mmn_rotulo_parametros_por_faixa_json": "Parâmetros por faixa (JSON)",
"legenda_mmn_rotulo_use_json_valido_para_faixas_limites_e_regras_adicionais": "Use JSON válido para faixas, limites e regras adicionais.",
"legenda_mmn_rotulo_versao": "Versão",
"legenda_mmn_rotulo_status": "Status",
"legenda_mmn_rotulo_atualizacao": "Atualização",
"legenda_mmn_rotulo_publicacao": "Publicação",
"legenda_mmn_rotulo_vigencia": "Vigência",
"legenda_mmn_rotulo_abrir_versao_historico": "Abrir versão/histórico",
"legenda_mmn_rotulo_niveis": " níveis",
"legenda_mmn_rotulo_largura": " largura",
"legenda_mmn_rotulo_teto": " teto",
"legenda_mmn_rotulo_minimo": " mínimo",
"legenda_mmn_rotulo_nivel": "Nível",
"legenda_mmn_rotulo_diretos": "Diretos",
"legenda_mmn_rotulo_pernas": "Pernas",
"legenda_mmn_rotulo_ativos_perna": "Ativos/perna",
"legenda_mmn_rotulo_ranks": "Ranks:",
"legenda_mmn_rotulo_nenhum": "Nenhum",
"legenda_mmn_rotulo_todas": "Todas",
"legenda_mmn_rotulo_aprovacoes_registradas": "Aprovações registradas",
"legenda_mmn_rotulo_administrador": "Administrador",
"legenda_mmn_rotulo_rascunhos": "Rascunhos",
"legenda_mmn_rotulo_emitidos": "Emitidos",
"legenda_mmn_rotulo_pagos": "Pagos",
"legenda_mmn_rotulo_detalhes": "Detalhes",
"legenda_mmn_rotulo_titular": "Titular",
"legenda_mmn_rotulo_valores": "Valores",
"legenda_mmn_rotulo_bruto": "Bruto ",
"legenda_mmn_rotulo_comprovante": "Comprovante",
"legenda_mmn_rotulo_analisar": "Analisar",
"legenda_mmn_rotulo_sistema": "Sistema",
"legenda_mmn_rotulo_carregando": "Carregando...",
"legenda_mmn_rotulo_entrando": "Entrando...",
"legenda_mmn_rotulo_salvando": "Salvando...",
"legenda_mmn_rotulo_simulando": "Simulando...",
"legenda_mmn_rotulo_saindo": "Saindo...",
"legenda_mmn_rotulo_gerenciar_prefixo": "Gerenciar ",
"legenda_mmn_rotulo_abrindo": "Abrindo...",
"legenda_mmn_rotulo_registrando": "Registrando...",
"legenda_mmn_rotulo_emitindo": "Emitindo...",
"legenda_mmn_rotulo_criando": "Criando...",
"legenda_mmn_rotulo_gerando": "Gerando...",
"legenda_mmn_rotulo_real": "Real ",
"legenda_mmn_rotulo_receita_prefixo": "Receita ",
"legenda_mmn_rotulo_apta": "Apta",
"legenda_mmn_rotulo_ver_detalhes": "Ver detalhes",
"legenda_mmn_rotulo_mensal": "Mensal",
"legenda_mmn_rotulo_niveis_mensagem": "Níveis",
"legenda_mmn_rotulo_ranks_mensagem": "Ranks",
"legenda_mmn_rotulo_resumo": "Resumo",
"legenda_mmn_rotulo_completo": "Completo",
"legenda_mmn_rotulo_exportar_json": "Exportar JSON",
"legenda_mmn_rotulo_2_a_4_execucoes_registradas_sem_alterar_dados_reais": "2 a 4 execuções registradas, sem alterar dados reais.",
"legenda_mmn_rotulo_executando": "Executando...",
"legenda_mmn_rotulo_comparando": "Comparando...",
  "legenda_mmn_confirme_seu_e_mail_antes_de_entrar": "Confirme seu e-mail antes de entrar.",
  "legenda_mmn_falha_de_conexao_verifique_sua_internet_e_tente_novamente": "Falha de conexão. Verifique sua internet e tente novamente.",
  "legenda_mmn_e_mail_ou_senha_invalidos": "E-mail ou senha inválidos.",
  "legenda_mmn_o_app_demorou_para_validar_sua_sessao_toque_em_atualizar": "O app demorou para validar sua sessão. Toque em Atualizar.",
  "legenda_mmn_nao_foi_possivel_validar_sua_sessao_pelo_app": "Não foi possível validar sua sessão pelo app.",
  "legenda_mmn_preencha_os_campos_obrigatorios": "Preencha os campos obrigatórios.",
  "legenda_mmn_sessao_expirada_entre_novamente": "Sessão expirada. Entre novamente.",
  "legenda_mmn_entre_para_continuar": "Entre para continuar.",
  "legenda_mmn_sem_permissao_administrativa": "Sem permissão administrativa.",
  "legenda_mmn_sem_permissao_para_acessar_o_mmn": "Sem permissão para acessar o MMN.",
  "legenda_mmn_usuario_nao_encontrado": "Usuário não encontrado.",
  "legenda_mmn_usuario_do_app_nao_encontrado": "Usuário do app não encontrado.",
  "legenda_mmn_confirme_a_reentrada_no_programa": "Confirme a reentrada no programa.",
  "legenda_mmn_aceite_novamente_o_regulamento_vigente_antes_de_reentrar": "Aceite novamente o regulamento vigente antes de reentrar.",
  "legenda_mmn_nao_ha_uma_saida_voluntaria_pendente_de_reentrada": "Não há uma saída voluntária pendente de reentrada.",
  "legenda_mmn_sua_situacao_cadastral_nao_permite_a_reentrada_neste_momento": "Sua situação cadastral não permite a reentrada neste momento.",
  "legenda_mmn_a_chave_pix_deve_pertencer_ao_mesmo_cpf_do_cadastro": "A chave PIX deve pertencer ao mesmo CPF do cadastro.",
  "legenda_mmn_informe_um_e_mail_valido_para_a_chave_pix": "Informe um e-mail válido para a chave Pix.",
  "legenda_mmn_informe_um_celular_com_ddd_e_11_numeros": "Informe um celular com DDD e 11 números.",
  "legenda_mmn_informe_uma_chave_aleatoria_pix_valida": "Informe uma chave aleatória Pix válida.",
  "legenda_mmn_informe_um_cpf_valido_com_11_numeros": "Informe um CPF válido com 11 números.",
  "legenda_mmn_e_necessario_aceitar_o_regulamento_vigente": "É necessário aceitar o regulamento vigente.",
  "legenda_mmn_os_pagamentos_reais_permanecem_bloqueados_ate_a_homologacao_fiscal": "Os pagamentos reais permanecem bloqueados até a homologação fiscal.",
  "legenda_mmn_a_quantidade_de_niveis_deve_ser_um_inteiro_de_1_a_10": "A quantidade de níveis deve ser um inteiro de 1 a 10.",
  "legenda_mmn_a_largura_deve_ser_0_para_ilimitada_ou_um_inteiro_a_partir_de": "A largura deve ser 0 para ilimitada ou um inteiro a partir de 2.",
  "legenda_mmn_as_dez_faixas_de_nivel_precisam_permanecer_preservadas_na_configuracao": "As dez faixas de nível precisam permanecer preservadas na configuração.",
  "legenda_mmn_gere_primeiro_o_rascunho_do_regulamento_para_esta_configuracao": "Gere primeiro o rascunho do regulamento para esta configuração.",
  "legenda_mmn_o_regulamento_so_pode_ser_gerado_para_uma_configuracao_em_rascunho": "O regulamento só pode ser gerado para uma configuração em rascunho.",
  "legenda_mmn_o_modelo_juridico_solicitado_nao_e_permitido": "O modelo jurídico solicitado não é permitido.",
  "legenda_mmn_essa_versao_do_regulamento_ja_existe": "Essa versão do regulamento já existe.",
  "legenda_mmn_as_regras_mudaram_gere_novamente_o_regulamento_e_refaca_a_simulacao_antes_de": "As regras mudaram. Gere novamente o regulamento e refaça a simulação antes de publicar.",
  "legenda_mmn_nao_foi_possivel_concluir_a_operacao": "Não foi possível concluir a operação.",
  "legenda_mmn_indicacoes_e_beneficios_turbo_tiger": "Indicações e Benefícios - Turbo Tiger",
  "legenda_mmn_indicacoes_e_beneficios": "Indicações e Benefícios",
  "legenda_mmn_mmn_turbo_tiger_admin": "MMN - Turbo Tiger Admin",
  "legenda_mmn_admin_mmn": "Admin MMN",
  "legenda_mmn_painel_mmn": "Painel MMN",
  "legenda_mmn_falha_http": "Falha HTTP ",
  "legenda_mmn_a_consulta_demorou_alem_do_esperado": "A consulta demorou além do esperado.",
  "legenda_mmn_chave_aleatoria": "Chave aleatória",
  "legenda_mmn_selecione_o_tipo_da_chave_pix": "Selecione o tipo da chave Pix.",
  "legenda_mmn_informe_a_chave_pix": "Informe a chave Pix.",
  "legenda_mmn_muitas_tentativas_em_pouco_tempo_aguarde_um_momento_e_tente_novamente": "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.",
  "legenda_mmn_ela_sera_mantida_enquanto_voce_nao_informar_uma_nova_chave": "Ela será mantida enquanto você não informar uma nova chave.",
  "legenda_mmn_chave_pix_confirmada": "Chave Pix confirmada.",
  "legenda_mmn_a_chave_atual_ainda_nao_esta_confirmada_informe_a_novamente_para_verificar": "A chave atual ainda não está confirmada. Informe-a novamente para verificar.",
  "legenda_mmn_informe_novamente_a_chave_pix_atual_para_concluir_a_confirmacao": "Informe novamente a chave Pix atual para concluir a confirmação.",
  "legenda_mmn_informe_a_nova_chave_pix_para_verificar_a_alteracao": "Informe a nova chave Pix para verificar a alteração.",
  "legenda_mmn_informe_a_nova_chave_pix": "Informe a nova chave Pix.",
  "legenda_mmn_informe_o_tipo_e_a_chave_depois_toque_em_verificar": "Informe o tipo e a chave, depois toque em verificar.",
  "legenda_mmn_a_verificacao_expirou_verifique_a_chave_pix_novamente": "A verificação expirou. Verifique a chave Pix novamente.",
  "legenda_mmn_por_seguranca_sua_chave_pix_podera_ser_alterada_novamente_em": "Por segurança, sua chave Pix poderá ser alterada novamente em ",
  "legenda_mmn_por_seguranca_ainda_nao_e_possivel_alterar_sua_chave_pix_aguarde_o_prazo": "Por segurança, ainda não é possível alterar sua chave Pix. Aguarde o prazo informado pelo programa e tente novamente.",
  "legenda_mmn_o_servico_de_consulta_pix_esta_temporariamente_indisponivel_tente_novamente_mais_tarde": "O serviço de consulta Pix está temporariamente indisponível. Tente novamente mais tarde.",
  "legenda_mmn_sua_sessao_expirou_atualize_o_painel_e_tente_novamente": "Sua sessão expirou. Atualize o painel e tente novamente.",
  "legenda_mmn_selecione_um_tipo_valido_de_chave_pix": "Selecione um tipo válido de chave Pix.",
  "legenda_mmn_informe_uma_chave_pix_valida": "Informe uma chave Pix válida.",
  "legenda_mmn_esta_chave_pix_nao_corresponde_ao_titular_do_cadastro_confira_os_dados_ou": "Esta chave Pix não corresponde ao titular do cadastro. Confira os dados ou use uma chave do mesmo CPF.",
  "legenda_mmn_a_chave_pix_nao_foi_localizada_confira_o_tipo_e_a_chave_informados": "A chave Pix não foi localizada. Confira o tipo e a chave informados.",
  "legenda_mmn_a_verificacao_desta_chave_pix_ja_esta_em_andamento_aguarde_alguns_segundos_e": "A verificação desta chave Pix já está em andamento. Aguarde alguns segundos e tente novamente.",
  "legenda_mmn_a_instituicao_retornou_dados_que_nao_puderam_ser_confirmados_com_seguranca_confira_a": "A instituição retornou dados que não puderam ser confirmados com segurança. Confira a chave ou tente novamente mais tarde.",
  "legenda_mmn_nao_foi_possivel_consultar_a_chave_pix_agora_tente_novamente_em_instantes": "Não foi possível consultar a chave Pix agora. Tente novamente em instantes.",
  "legenda_mmn_nao_foi_possivel_confirmar_esta_chave_pix_verifique_novamente_e_repita_a_confirmacao": "Não foi possível confirmar esta chave Pix. Verifique novamente e repita a confirmação.",
  "legenda_mmn_nao_foi_possivel_confirmar_que_esta_chave_pix_pertence_ao_titular_do_cadastro": "Não foi possível confirmar que esta chave Pix pertence ao titular do cadastro. Confira os dados ou use outra chave.",
  "legenda_mmn_consultando_a_chave_pix_com_seguranca": "Consultando a chave Pix com segurança...",
  "legenda_mmn_chave_localizada_confira_os_dados_abaixo_e_confirme_a_titularidade": "Chave localizada. Confira os dados abaixo e confirme a titularidade.",
  "legenda_mmn_registrando_sua_confirmacao": "Registrando sua confirmação...",
  "legenda_mmn_a_confirmacao_foi_registrada_se_alterar_o_tipo_ou_a_chave_sera_necessario": "A confirmação foi registrada. Se alterar o tipo ou a chave, será necessário verificar novamente.",
  "legenda_mmn_informe_novamente_a_chave_pix_atual_para_verificar_e_confirmar": "Informe novamente a chave Pix atual para verificar e confirmar.",
  "legenda_mmn_confira_os_dados_encontrados_e_toque_em_confirmar": "Confira os dados encontrados e toque em Confirmar.",
  "legenda_mmn_endereco_alterado_complete_uf_cidade_e_logradouro_ou_digite_um_cep_valido": "Endereço alterado. Complete UF, cidade e logradouro ou digite um CEP válido.",
  "legenda_mmn_endereco_alterado_conferindo_o_cep_correspondente": "Endereço alterado. Conferindo o CEP correspondente...",
  "legenda_mmn_nao_foi_possivel_carregar_as_cidades_agora": "Não foi possível carregar as cidades agora.",
  "legenda_mmn_digite_e_selecione_a_cidade": "Digite e selecione a cidade",
  "legenda_mmn_cep_nao_encontrado": "CEP não encontrado.",
  "legenda_mmn_falha_nas_consultas_de_cep": "Falha nas consultas de CEP.",
  "legenda_mmn_nao_foi_possivel_localizar_esse_cep": "Não foi possível localizar esse CEP.",
  "legenda_mmn_consultando_o_cep": "Consultando o CEP...",
  "legenda_mmn_endereco_encontrado": "Endereço encontrado.",
  "legenda_mmn_nao_foi_possivel_consultar_o_cep": "Não foi possível consultar o CEP.",
  "legenda_mmn_selecione_uma_uf_valida": "Selecione uma UF válida.",
  "legenda_mmn_informe_uma_cidade_com_pelo_menos_3_caracteres": "Informe uma cidade com pelo menos 3 caracteres.",
  "legenda_mmn_informe_uma_rua_ou_avenida_com_pelo_menos_3_caracteres": "Informe uma rua ou avenida com pelo menos 3 caracteres.",
  "legenda_mmn_procurando_o_cep_do_endereco": "Procurando o CEP do endereço...",
  "legenda_mmn_corrija_o_endereco_ou_digite_um_cep_valido": "Corrija o endereço ou digite um CEP válido.",
  "legenda_mmn_cep_encontrado": "CEP encontrado.",
  "legenda_mmn_foram_encontrados_varios_ceps_selecione_o_endereco_correto_para_confirmar": "Foram encontrados vários CEPs. Selecione o endereço correto para confirmar.",
  "legenda_mmn_selecione_o_estado_primeiro": "Selecione o estado primeiro",
  "legenda_mmn_cep_selecionado_com_sucesso": "CEP selecionado com sucesso.",
  "legenda_mmn_informe_um_cep_valido_com_8_digitos": "Informe um CEP válido com 8 dígitos.",
  "legenda_mmn_complete_o_endereco_para_os_dados_do_rpa": "Complete o endereço para os dados do RPA.",
  "legenda_mmn_selecione_a_uf_do_endereco": "Selecione a UF do endereço.",
  "legenda_mmn_o_cep_e_o_endereco_ainda_nao_foram_confirmados_corrija_o_endereco_selecione": "O CEP e o endereço ainda não foram confirmados. Corrija o endereço, selecione um dos CEPs encontrados ou digite um CEP válido.",
  "legenda_mmn_verifique_confira_e_confirme_a_chave_pix_antes_de_concluir_a_adesao": "Verifique, confira e confirme a chave Pix antes de concluir a adesão.",
  "legenda_mmn_informe_a_rua_ou_avenida": "Informe a rua ou avenida.",
  "legenda_mmn_informe_o_numero_do_endereco": "Informe o número do endereço.",
  "legenda_mmn_informe_o_bairro": "Informe o bairro.",
  "legenda_mmn_informe_e_selecione_a_cidade": "Informe e selecione a cidade.",
  "legenda_mmn_confirme_o_cep_e_o_endereco_antes_de_concluir_a_adesao": "Confirme o CEP e o endereço antes de concluir a adesão.",
  "legenda_mmn_leia_e_aceite_o_regulamento_vigente_para_concluir_a_adesao": "Leia e aceite o regulamento vigente para concluir a adesão.",
  "legenda_mmn_a_comissao_considera_somente_assinaturas_efetivamente_pagas": "A comissão considera somente assinaturas efetivamente pagas.",
  "legenda_mmn_e_necessario_estar_elegivel_na_data_da_receita_e_no_fechamento": "É necessário estar elegível na data da receita e no fechamento.",
  "legenda_mmn_simulacoes_nao_representam_garantia_de_renda": "Simulações não representam garantia de renda.",
  "legenda_mmn_chave_atual": "Chave atual: ",
  "legenda_mmn_nenhuma_chave_cadastrada": "Nenhuma chave cadastrada.",
  "legenda_mmn_ola": "Olá, ",
  "legenda_mmn_indicacoes_qualificacoes_e_valores": "Indicações, qualificações e valores.",
  "legenda_mmn_elegivel_nesta_competencia": "Elegível nesta competência",
  "legenda_mmn_inelegivel_nesta_competencia": "Inelegível nesta competência",
  "legenda_mmn_maior_rank_alcancado": "Maior rank alcançado",
  "legenda_mmn_os_criterios_sao_avaliados_a_cada_competencia": "Os critérios são avaliados a cada competência.",
  "legenda_mmn_necessarios": " necessários",
  "legenda_mmn_objetivo_alcancado": "Objetivo alcançado",
  "legenda_mmn_rede_ativa": "Rede ativa: ",
  "legenda_mmn_diretos_ativos": "Diretos ativos: ",
  "legenda_mmn_maior_perna": "Maior perna: ",
  "legenda_mmn_maximo": " (máximo ",
  "legenda_mmn_criterio": "Critério",
  "legenda_mmn_os_criterios_da_competencia_ainda_nao_foram_publicados": "Os critérios da competência ainda não foram publicados.",
  "legenda_mmn_ainda_nao_ha_competencias_reconhecidas_para_exibir": "Ainda não há competências reconhecidas para exibir.",
  "legenda_mmn_carregando_a_evolucao_real_da_sua_rede": "Carregando a evolução real da sua rede...",
  "legenda_mmn_ainda_nao_ha_competencias_com_totais_da_rede_suficientes_para_montar_o_grafico": "Ainda não há competências com totais da rede suficientes para montar o gráfico de evolução.",
  "legenda_mmn_o_grafico_usa_somente_os_totais_reais_de_rede_retornados_em_cada_competencia": "O gráfico usa somente os totais reais de rede retornados em cada competência.",
  "legenda_mmn_nao_foi_possivel_atualizar_a_evolucao_da_rede_agora": "Não foi possível atualizar a evolução da rede agora.",
  "legenda_mmn_atualizacao": "Atualização",
  "legenda_mmn_nenhuma_notificacao_disponivel": "Nenhuma notificação disponível.",
  "legenda_mmn_bonus_de_lideranca": "Bônus de liderança",
  "legenda_mmn_pool_global": "Pool Global",
  "legenda_mmn_usuario": "Usuário",
  "legenda_mmn_raiz_estrutural": "Raiz estrutural",
  "legenda_mmn_sem_vaga_atribuida": "Sem vaga atribuída",
  "legenda_mmn_sem_limite_horizontal_de_posicionamento": "Sem limite horizontal de posicionamento.",
  "legenda_mmn_posicionado_por_spillover_seu_patrocinador_permanece_o_mesmo": "Posicionado por spillover; seu patrocinador permanece o mesmo.",
  "legenda_mmn_posicionamento_direto_sem_spillover_nesta_entrada": "Posicionamento direto, sem spillover nesta entrada.",
  "legenda_mmn_com_a_largura_limitada_indicacoes_alem_das_vagas_diretas_entram_por_spillover_a": "Com a largura limitada, indicações além das vagas diretas entram por spillover. A comissão direta permanece com quem convidou; as residuais seguem os níveis reais, sem pagar duas vezes o mesmo beneficiário pela mesma assinatura.",
  "legenda_mmn_data_de_cadastro_no_app_nao_informada": "Data de cadastro no app não informada",
  "legenda_mmn_vinculo_da_indicacao_em": "Vínculo da indicação em ",
  "legenda_mmn_cadastro_no_app_em": "Cadastro no app em ",
  "legenda_mmn_indicacao_direta": "Indicação direta ",
  "legenda_mmn_indicacao_direta_posicao_ainda_nao_informada": "Indicação direta · posição ainda não informada",
  "legenda_mmn_posicao": "Posição ",
  "legenda_mmn_posicao_da_indicacao_nao_informada": "Posição da indicação não informada",
  "legenda_mmn_ver_ramificacao": "Ver ramificação",
  "legenda_mmn_sem_indicados": "Sem indicados",
  "legenda_mmn_indicados_de": "Indicados de ",
  "legenda_mmn_carregando_indicados": "Carregando indicados...",
  "legenda_mmn_este_indicado_ainda_nao_possui_indicacoes_registradas": "Este indicado ainda não possui indicações registradas.",
  "legenda_mmn_nao_foi_possivel_carregar_esta_ramificacao_agora_tente_novamente": "Não foi possível carregar esta ramificação agora. Tente novamente.",
  "legenda_mmn_vaga_da_indicacao_nao_informada": "Vaga da indicação não informada",
  "legenda_mmn_vaga": "Vaga #",
  "legenda_mmn_voce": "Você",
  "legenda_mmn_voce_ainda_nao_possui_indicados_para_exibir_no_diagrama": "Você ainda não possui indicados para exibir no diagrama.",
  "legenda_mmn_carregando_o_diagrama_completo_da_rede": "Carregando o diagrama completo da rede...",
  "legenda_mmn_nao_foi_possivel_carregar_o_diagrama_da_rede_agora_tente_novamente": "Não foi possível carregar o diagrama da rede agora. Tente novamente.",
  "legenda_mmn_nao_qualificado": "Não qualificado",
  "legenda_mmn_a_distribuicao_por_nivel_ainda_nao_esta_disponivel": "A distribuição por nível ainda não está disponível.",
  "legenda_mmn_voce_ainda_nao_possui_indicados_diretos": "Você ainda não possui indicados diretos.",
  "legenda_mmn_resumo_da_competencia": "Resumo da competência",
  "legenda_mmn_lancamento": "Lançamento",
  "legenda_mmn_nivel": "Nível ",
  "legenda_mmn_inclui_bonus": "Inclui bônus",
  "legenda_mmn_nenhum_lancamento_encontrado_para_o_periodo": "Nenhum lançamento encontrado para o período.",
  "legenda_mmn_rank_atual": "Rank atual",
  "legenda_mmn_qualificacao": "Qualificação",
  "legenda_mmn_ativos_na_rede_bonus": " ativos na rede · bônus ",
  "legenda_mmn_os_ranks_vigentes_ainda_nao_foram_carregados": "Os ranks vigentes ainda não foram carregados.",
  "legenda_mmn_base_pessoal": "Base pessoal",
  "legenda_mmn_seus_pontos": "Seus pontos",
  "legenda_mmn_pontos_totais": "Pontos totais",
  "legenda_mmn_pool_disponivel": "Pool disponível",
  "legenda_mmn_competencia": "Competência ",
  "legenda_mmn_beneficio": "Benefício",
  "legenda_mmn_nenhuma_bonificacao_registrada_nesta_competencia": "Nenhuma bonificação registrada nesta competência.",
  "legenda_mmn_participantes_qualificados_neste_rank": "Participantes qualificados neste rank",
  "legenda_mmn_carregando_participantes_qualificados": "Carregando participantes qualificados...",
  "legenda_mmn_nenhum_participante_qualificado_foi_encontrado_neste_rank": "Nenhum participante qualificado foi encontrado neste rank.",
  "legenda_mmn_nao_foi_possivel_carregar_os_qualificados_agora_tente_novamente": "Não foi possível carregar os qualificados agora. Tente novamente.",
  "legenda_mmn_minimo_vigente": "Mínimo vigente",
  "legenda_mmn_em_processamento": "Em processamento",
  "legenda_mmn_documento_ainda_nao_emitido": "Documento ainda não emitido",
  "legenda_mmn_retencoes": " · Retenções: ",
  "legenda_mmn_rpa_ainda_sem_numero": "RPA ainda sem número",
  "legenda_mmn_nenhum_pagamento_processado": "Nenhum pagamento processado.",
  "legenda_mmn_total_projetado_para": "Total projetado para ",
  "legenda_mmn_mes": " mês.",
  "legenda_mmn_media_mensal_estimada": "Média mensal estimada",
  "legenda_mmn_bruto_medio_mensal": "Bruto médio mensal: ",
  "legenda_mmn_valor_mensal_no_ultimo_mes": "Valor mensal no último mês",
  "legenda_mmn_bruto_no_ultimo_mes": "Bruto no último mês: ",
  "legenda_mmn_apta_para_publicacao": "Apta para publicação",
  "legenda_mmn_somente_analise": "Somente análise",
  "legenda_mmn_bruto_pessoal": "Bruto pessoal",
  "legenda_mmn_payout_real": "Payout real",
  "legenda_mmn_comissoes": "Comissões",
  "legenda_mmn_liquido_estimado": "Líquido estimado",
  "legenda_mmn_bonus_e_pool": "Bônus e pool",
  "legenda_mmn_projecao_futura_calculada_por_coortes_estatisticas": "Projeção futura calculada por coortes estatísticas.",
  "legenda_mmn_pool_global_indisponivel_nesta_estimativa_por_falta_de_base_historica": "Pool global indisponível nesta estimativa por falta de base histórica.",
  "legenda_mmn_a_projecao_aplica_a_estrutura_vigente_e_prioriza_a_comissao_direta_sem_duplicidade": "A projeção aplica a estrutura vigente e prioriza a comissão direta sem duplicidade.",
  "legenda_mmn_indicacao_pessoal_e_posicionamento_sao_calculados_separadamente": "Indicação pessoal e posicionamento são calculados separadamente.",
  "legenda_mmn_o_spillover_futuro_e_estimado_conforme_a_capacidade_da_estrutura": "O spillover futuro é estimado conforme a capacidade da estrutura.",
  "legenda_mmn_a_deduplicacao_futura_e_apresentada_como_intervalo_estimado": "A deduplicação futura é apresentada como intervalo estimado.",
  "legenda_mmn_o_servidor_nao_retornou_resultados_para_esta_simulacao": "O servidor não retornou resultados para esta simulação.",
  "legenda_mmn_a_versao_vigente_ainda_nao_retornou_os_niveis": "A versão vigente ainda não retornou os níveis.",
  "legenda_mmn_nao": "Não",
  "legenda_mmn_verificacao": "Verificação",
  "legenda_mmn_nenhuma_pendencia_operacional_informada": "Nenhuma pendência operacional informada.",
  "legenda_mmn_nenhuma_competencia_encontrada": "Nenhuma competência encontrada.",
  "legenda_mmn_posicao_direta": "Posição direta",
  "legenda_mmn_em_dia": "Em dia",
  "legenda_mmn_elegivel": "Elegível",
  "legenda_mmn_nenhum_participante_encontrado": "Nenhum participante encontrado.",
  "legenda_mmn_reativar_prazo": "Reativar prazo",
  "legenda_mmn_aguardando_cadastro": "Aguardando cadastro",
  "legenda_mmn_nenhum_cadastro_na_lista_de_espera": "Nenhum cadastro na lista de espera.",
  "legenda_mmn_largura_ilimitada": "Largura ilimitada",
  "legenda_mmn_vagas_por_no": " vagas por nó",
  "legenda_mmn_posicao_direta_mensagem": " · posição direta",
  "legenda_mmn_nenhuma_genealogia_encontrada_para_esse_usuario": "Nenhuma genealogia encontrada para esse usuário.",
  "legenda_mmn_nao_gera": "Não gera",
  "legenda_mmn_nenhum_lancamento_encontrado": "Nenhum lançamento encontrado.",
  "legenda_mmn_acima_do_limite_numerico_de_exibicao": "Acima do limite numérico de exibição",
  "legenda_mmn_a_largura_deve_ser_0_para_ilimitada_ou_um_inteiro_de_2_a": "A largura deve ser 0 para ilimitada ou um inteiro de 2 a 2.147.483.647.",
  "legenda_mmn_no_nivel": "No nível ",
  "legenda_mmn_diretos_ativos_minimos_nao_pode_superar_a_largura_atual_de": ", diretos ativos mínimos não pode superar a largura atual de ",
  "legenda_mmn_pernas_qualificadas_nao_pode_superar_a_largura_atual_de": ", pernas qualificadas não pode superar a largura atual de ",
  "legenda_mmn_ativos_minimos_por_perna_supera_a_capacidade_teorica_de": ", ativos mínimos por perna supera a capacidade teórica de ",
  "legenda_mmn_a_combinacao_de_pernas_e_ativos_por_perna_supera_a_capacidade_total_de": ", a combinação de pernas e ativos por perna supera a capacidade total de ",
  "legenda_mmn_no_rank": "No rank ",
  "legenda_mmn_a_rede_ativa_minima_supera_a_capacidade_teorica_de": ", a rede ativa mínima supera a capacidade teórica de ",
  "legenda_mmn_a_maior_perna_nao_pode_ter_limite_inferior_ao_minimo_teorico_de": ", a maior perna não pode ter limite inferior ao mínimo teórico de ",
  "legenda_mmn_nenhum_rank_configurado": "Nenhum rank configurado.",
  "legenda_mmn_nenhum_grupo_isento_configurado": "Nenhum grupo isento configurado.",
  "legenda_mmn_nenhuma_retencao_configurada": "Nenhuma retenção configurada.",
  "legenda_mmn_publicacao": "Publicação",
  "legenda_mmn_nenhum_aprovador_adicional_configurado": "Nenhum aprovador adicional configurado.",
  "legenda_mmn_nenhum_regulamento_foi_gerado_para_esta_versao": "Nenhum regulamento foi gerado para esta versão.",
  "legenda_mmn_regulamento_de_indicacoes_e_beneficios": "Regulamento de Indicações e Benefícios",
  "legenda_mmn_use_pre_visualizar_para_conferir_o_snapshot_desta_versao": "Use Pré-visualizar para conferir o snapshot desta versão.",
  "legenda_mmn_gere_o_regulamento_depois_de_salvar_as_regras": "Gere o regulamento depois de salvar as regras.",
  "legenda_mmn_versao": "Versão ",
  "legenda_mmn_nenhuma_versao_de_configuracao": "Nenhuma versão de configuração.",
  "legenda_mmn_salve_o_rascunho_para_consultar_o_progresso": "Salve o rascunho para consultar o progresso.",
  "legenda_mmn_rascunho_salvo": "Rascunho salvo",
  "legenda_mmn_configuracao": "Configuração #",
  "legenda_mmn_regulamento_gerado": "Regulamento gerado",
  "legenda_mmn_snapshot": "Snapshot #",
  "legenda_mmn_gere_o_snapshot_no_servidor": "Gere o snapshot no servidor",
  "legenda_mmn_simulacao_v2_valida": "Simulação V2 válida",
  "legenda_mmn_simulacao": "Simulação #",
  "legenda_mmn_execute_novamente_apos_qualquer_alteracao": "Execute novamente após qualquer alteração",
  "legenda_mmn_quorum_de_publicacao": "Quórum de publicação",
  "legenda_mmn_registrar_pago": "Registrar pago",
  "legenda_mmn_nenhum_pagamento_encontrado": "Nenhum pagamento encontrado.",
  "legenda_mmn_beneficiarios": "Beneficiários",
  "legenda_mmn_aguardando_rpa": "Aguardando RPA",
  "legenda_mmn_retencoes_prefixo": " · retenções ",
  "legenda_mmn_sem_numero": "Sem número",
  "legenda_mmn_nenhum_beneficiario_encontrado_na_fila_fiscal": "Nenhum beneficiário encontrado na fila fiscal.",
  "legenda_mmn_beneficiario": "Beneficiário",
  "legenda_mmn_liquido": " · líquido ",
  "legenda_mmn_ainda_nao_registrado": "Ainda não registrado",
  "legenda_mmn_transferencia": "Transferência",
  "legenda_mmn_ainda_nao_confirmado": "Ainda não confirmado",
  "legenda_mmn_ocorrencia": "Ocorrência",
  "legenda_mmn_nenhuma_ocorrencia_encontrada": "Nenhuma ocorrência encontrada.",
  "legenda_mmn_alteracao": "Alteração",
  "legenda_mmn_nenhum_evento_de_auditoria_encontrado": "Nenhum evento de auditoria encontrado.",
  "legenda_mmn_json_invalido_na_retencao": "JSON inválido na retenção ",
  "legenda_mmn_entre_com_uma_conta_autorizada": "Entre com uma conta autorizada",
  "legenda_mmn_online_acesso_conforme_suas_permissoes": "Online · acesso conforme suas permissões",
  "legenda_mmn_validando_acesso": "Validando acesso...",
  "legenda_mmn_sessao_encerrada": "Sessão encerrada",
  "legenda_mmn_convite_turbo_tiger": "Convite Turbo Tiger",
  "legenda_mmn_o_link_de_convite_ainda_nao_esta_disponivel": "O link de convite ainda não está disponível.",
  "legenda_mmn_nao_foi_possivel_copiar_o_link_neste_dispositivo": "Não foi possível copiar o link neste dispositivo.",
  "legenda_mmn_salvando_adesao": "Salvando adesão...",
  "legenda_mmn_reentrada_concluida_com_seguranca": "Reentrada concluída com segurança.",
  "legenda_mmn_adesao_concluida_com_seguranca": "Adesão concluída com segurança.",
  "legenda_mmn_verifique_confira_e_confirme_a_chave_pix_antes_de_salvar": "Verifique, confira e confirme a chave Pix antes de salvar.",
  "legenda_mmn_a_confirmacao_da_nova_chave_pix_nao_foi_preservada_verifique_novamente": "A confirmação da nova chave Pix não foi preservada. Verifique novamente.",
  "legenda_mmn_dados_atualizados": "Dados atualizados.",
  "legenda_mmn_assunto_da_contestacao": "Assunto da contestação:",
  "legenda_mmn_revisao_de_lancamento": "Revisão de lançamento",
  "legenda_mmn_descreva_o_motivo_da_contestacao": "Descreva o motivo da contestação:",
  "legenda_mmn_informe_o_assunto_e_a_descricao_da_contestacao": "Informe o assunto e a descrição da contestação.",
  "legenda_mmn_contestacao_registrada_para_analise": "Contestação registrada para análise.",
  "legenda_mmn_preparando_o_diagrama_para_gerar_o_pdf": "Preparando o diagrama para gerar o PDF...",
  "legenda_mmn_nao_foi_possivel_abrir_a_geracao_do_pdf_no_aplicativo": "Não foi possível abrir a geração do PDF no aplicativo.",
  "legenda_mmn_escolha_salvar_como_pdf_na_tela_aberta_pelo_dispositivo": "Escolha Salvar como PDF na tela aberta pelo dispositivo.",
  "legenda_mmn_nao_foi_possivel_gerar_o_pdf": "Não foi possível gerar o PDF.",
  "legenda_mmn_processando_sua_solicitacao": "Processando sua solicitação...",
  "legenda_mmn_saida_concluida_atualizando_seu_painel": "Saída concluída. Atualizando seu painel...",
  "legenda_mmn_voce_saiu_do_programa_de_indicacoes": "Você saiu do programa de indicações.",
  "legenda_mmn_sua_saida_foi_concluida_para_participar_novamente_faca_uma_nova_adesao_ao_regulamento": "Sua saída foi concluída. Para participar novamente, faça uma nova adesão ao regulamento vigente.",
  "legenda_mmn_confirmar_acao_na_competencia": "Confirmar ação na competência",
  "legenda_mmn_a_acao_respeitara_a_versao_vinculada_e_mantera_a_trilha_de_auditoria": "A ação respeitará a versão vinculada e manterá a trilha de auditoria.",
  "legenda_mmn_selecione_um_participante": "Selecione um participante.",
  "legenda_mmn_validar_pix": "Validar PIX",
  "legenda_mmn_rejeitar_pix": "Rejeitar PIX",
  "legenda_mmn_confirme_que_a_chave_pertence_ao_mesmo_titular_cadastrado_no_app": "Confirme que a chave pertence ao mesmo titular cadastrado no app.",
  "legenda_mmn_o_pix_ficara_pendente_ate_uma_nova_validacao_administrativa": "O PIX ficará pendente até uma nova validação administrativa.",
  "legenda_mmn_pix_validado": "PIX validado.",
  "legenda_mmn_pix_rejeitado": "PIX rejeitado.",
  "legenda_mmn_alteracao_registrada_e_auditada": "Alteração registrada e auditada.",
  "legenda_mmn_informe_o_id_do_usuario_patrocinador_deixe_vazio_para_raiz": "Informe o ID do usuário patrocinador (deixe vazio para raiz):",
  "legenda_mmn_informe_um_usuario_patrocinador_valido": "Informe um usuário patrocinador válido.",
  "legenda_mmn_decidir_vinculo_da_lista_de_espera": "Decidir vínculo da lista de espera",
  "legenda_mmn_informe_a_referencia_do_comprovante_de_pagamento": "Informe a referência do comprovante de pagamento:",
  "legenda_mmn_informe_a_referencia_do_comprovante": "Informe a referência do comprovante.",
  "legenda_mmn_confirmar_acao_financeira": "Confirmar ação financeira",
  "legenda_mmn_a_acao_sera_validada_pelas_aprovacoes_bloqueios_fiscais_e_estado_atual_do_lote": "A ação será validada pelas aprovações, bloqueios fiscais e estado atual do lote.",
  "legenda_mmn_beneficiario_do_lote_invalido": "Beneficiário do lote inválido.",
  "legenda_mmn_selecione_um_beneficiario": "Selecione um beneficiário.",
  "legenda_mmn_informe_o_motivo_do_registro": "Informe o motivo do registro.",
  "legenda_mmn_registrar_rascunho_do_rpa": "Registrar rascunho do RPA",
  "legenda_mmn_os_dados_fiscais_e_os_valores_do_beneficiario_serao_validados_pelo_servidor": "Os dados fiscais e os valores do beneficiário serão validados pelo servidor.",
  "legenda_mmn_rascunho_do_rpa_registrado": "Rascunho do RPA registrado.",
  "legenda_mmn_informe_a_referencia_do_documento_fiscal": "Informe a referência do documento fiscal.",
  "legenda_mmn_informe_um_hash_sha_256_valido_com_64_caracteres_hexadecimais": "Informe um hash SHA-256 válido com 64 caracteres hexadecimais.",
  "legenda_mmn_informe_o_motivo_da_emissao": "Informe o motivo da emissão.",
  "legenda_mmn_emitir_rpa": "Emitir RPA",
  "legenda_mmn_a_emissao_sera_auditada_e_podera_liberar_a_proxima_etapa_do_pagamento": "A emissão será auditada e poderá liberar a próxima etapa do pagamento.",
  "legenda_mmn_rpa_emitido_com_sucesso": "RPA emitido com sucesso.",
  "legenda_mmn_atualizar_ocorrencia": "Atualizar ocorrência",
  "legenda_mmn_registre_a_orientacao_inicial_depois_o_status_podera_ser_atualizado_conforme_a_decisao": "Registre a orientação inicial. Depois, o status poderá ser atualizado conforme a decisão administrativa.",
  "legenda_mmn_selecione_uma_versao_base_para_duplicar": "Selecione uma versão base para duplicar.",
  "legenda_mmn_nome_da_nova_versao_em_rascunho": "Nome da nova versão em rascunho:",
  "legenda_mmn_informe_o_nome_da_nova_versao": "Informe o nome da nova versão.",
  "legenda_mmn_nova_versao_criada_como_rascunho_auditavel": "Nova versão criada como rascunho auditável.",
  "legenda_mmn_selecione_uma_versao_de_configuracao": "Selecione uma versão de configuração.",
  "legenda_mmn_informe_somente_o_uid_do_administrador_ou_somente_o_perfil": "Informe somente o UID do administrador ou somente o perfil.",
  "legenda_mmn_informe_o_motivo_da_alteracao": "Informe o motivo da alteração.",
  "legenda_mmn_aprovador_salvo_e_auditado": "Aprovador salvo e auditado.",
  "legenda_mmn_somente_o_superadmin_pode_gerar_o_regulamento": "Somente o superadmin pode gerar o regulamento.",
  "legenda_mmn_salve_primeiro_a_versao_em_rascunho": "Salve primeiro a versão em rascunho.",
  "legenda_mmn_informe_versao_titulo_e_motivo_da_geracao": "Informe versão, título e motivo da geração.",
  "legenda_mmn_snapshot_do_regulamento_gerado_e_vinculado_a_configuracao_atual": "Snapshot do regulamento gerado e vinculado à configuração atual.",
  "legenda_mmn_pre_visualizacao_carregada_a_partir_do_snapshot_do_servidor": "Pré-visualização carregada a partir do snapshot do servidor.",
  "legenda_mmn_rascunho_salvo_gere_novamente_o_regulamento_e_valide_a_simulacao_para_estas_regras": "Rascunho salvo. Gere novamente o regulamento e valide a simulação para estas regras.",
  "legenda_mmn_gere_o_regulamento_no_servidor_e_execute_uma_simulacao_v2_valida_para_as": "Gere o regulamento no servidor e execute uma simulação V2 válida para as regras atuais antes de publicar.",
  "legenda_mmn_aprovar_publicacao": "Aprovar publicação",
  "legenda_mmn_sua_aprovacao_sera_registrada_no_quorum_desta_versao_ao_completar_o_quorum_ela": "Sua aprovação será registrada no quórum desta versão. Ao completar o quórum, ela será agendada para a vigência informada sem recalcular competências fechadas.",
  "legenda_mmn_aprovacao_registrada_aguardando_o_restante_do_quorum": "Aprovação registrada; aguardando o restante do quórum.",
  "legenda_mmn_versao_publicada_e_agendada": "Versão publicada e agendada.",
  "legenda_mmn_salve_a_versao_antes_da_homologacao_fiscal": "Salve a versão antes da homologação fiscal.",
  "legenda_mmn_confirmar_que_os_parametros_fiscais_desta_versao_foram_homologados_com_a_contabilidade": "Confirmar que os parâmetros fiscais desta versão foram homologados com a contabilidade?",
  "legenda_mmn_homologacao_fiscal": "Homologação fiscal",
  "legenda_mmn_a_versao_sera_marcada_como_homologada_defina_se_os_pagamentos_permanecem_bloqueados_no": "A versão será marcada como homologada. Defina se os pagamentos permanecem bloqueados no campo da configuração.",
  "legenda_mmn_a_homologacao_sera_removida_e_os_pagamentos_permanecerao_bloqueados": "A homologação será removida e os pagamentos permanecerão bloqueados.",
  "legenda_mmn_configuracao_fiscal_homologada": "Configuração fiscal homologada.",
  "legenda_mmn_homologacao_fiscal_removida": "Homologação fiscal removida.",
  "legenda_mmn_as_participacoes_do_mix_de_planos_devem_somar_exatamente_100": "As participações do mix de planos devem somar exatamente 100%.",
  "legenda_mmn_liquido_estimado_prefixo": "Líquido estimado ",
  "legenda_mmn_replay_historico": "Replay histórico",
  "legenda_mmn_simulacao_prefixo": "Simulação ",
  "legenda_mmn_nenhuma_simulacao_registrada_com_esses_filtros": "Nenhuma simulação registrada com esses filtros.",
  "legenda_mmn_selecione_de_2_a_4_simulacoes_distintas": "Selecione de 2 a 4 simulações distintas.",
  "legenda_mmn_criar_lote_manual": "Criar lote manual",
  "legenda_mmn_sera_criado_um_lote_real_para_a_competencia_selecionada_bloqueios_fiscais_e_valor": "Será criado um lote real para a competência selecionada. Bloqueios fiscais e valor mínimo serão validados pelo servidor."
};
  if(window.TurboTigerLegendas)window.TurboTigerLegendas.registrar(LEGENDAS_MMN);
  function legendaMmn(chave){return window.TurboTigerLegendas?window.TurboTigerLegendas.texto(chave):LEGENDAS_MMN[chave]||chave;}



  var vinculosApresentacaoMmn=new Map();
  function apresentarMmn(elemento,propriedade,obter){var texto=obter();elemento[propriedade]=texto;vinculosApresentacaoMmn.set(elemento,{propriedade:propriedade,obter:obter,ultimo:propriedade==='innerHTML'?elemento.textContent:elemento[propriedade]});return texto;}
  function acrescentarHtmlMmn(elemento, html, obter) {
    var anterior=vinculosApresentacaoMmn.get(elemento), fixo=elemento.innerHTML;
    var reutilizar=anterior&&anterior.propriedade==="innerHTML"&&elemento.textContent===anterior.ultimo;
    elemento.insertAdjacentHTML("beforeend",html);
    vinculosApresentacaoMmn.set(elemento,{propriedade:"innerHTML",ultimo:elemento.textContent,obter:function(){return (reutilizar?anterior.obter():fixo)+obter();}});
  }
  function atualizarApresentacaoMmn(){vinculosApresentacaoMmn.forEach(function(v,e){if(!e.isConnected||(v.propriedade==='innerHTML'?e.textContent:e[v.propriedade])!==v.ultimo){vinculosApresentacaoMmn.delete(e);return;}var texto=v.obter();if(v.propriedade==='innerHTML'){if(!window.TurboTigerLegendas||!window.TurboTigerLegendas.atualizarApresentacao(e,texto)){vinculosApresentacaoMmn.delete(e);return;}}else e[v.propriedade]=texto;v.ultimo=v.propriedade==='innerHTML'?e.textContent:e[v.propriedade];});}
  window.addEventListener('turbotiger:idioma',atualizarApresentacaoMmn);
  var CONFIG = {
    supabaseUrl: "https://jzqgudmvquokizvgehow.supabase.co",
    apiKey: "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU",
    siteHomeUrl: "https://turbotiger.com.br/",
    adminSessionKey: "tt_admin_session_v1",
    requestTimeoutMs: 30000,
    addressRequestTimeoutMs: 4500,
    appSessionTimeoutMs: 15000,
    pageSize: 30,
    edgeFunctions: {
      validatePixKey: "validate-pix-key",
      confirmPixKey: "confirm-pix-key"
    },
    rpcs: {
      adminContext: "adm_contexto_rpc",
      userDashboard: "mmn_usuario_painel_rpc",
      userEnrollmentSave: "mmn_usuario_aderir_rpc",
      userProgramExit: "mmn_usuario_programa_sair_rpc",
      userProgramReenter: "mmn_usuario_programa_reentrar_rpc",
      userSimulator: "mmn_usuario_simular_rpc",
      userProfileSave: "mmn_usuario_perfil_pagamento_salvar_rpc",
      userDispute: "mmn_usuario_contestar_rpc",
      userEventRead: "mmn_usuario_evento_marcar_lido_rpc",
      userPlacementNetwork: "mmn_usuario_rede_posicionamento_rpc",
      userNetworkNode: "mmn_usuario_rede_no_rpc",
      userNetworkDiagram: "mmn_usuario_rede_diagrama_rpc",
      userRankQualified: "mmn_usuario_rank_qualificados_rpc",
      userEvolution: "mmn_usuario_evolucao_rpc",
      locationCities: "espera_cidades_uf_rpc",
      adminDashboard: "adm_mmn_painel_rpc",
      adminUserDetail: "adm_mmn_usuario_detalhe_rpc",
      adminConfigGet: "adm_mmn_config_obter_rpc",
      adminConfigSave: "adm_mmn_config_salvar_rpc",
      adminConfigDuplicate: "adm_mmn_config_duplicar_rpc",
      adminConfigPublish: "adm_mmn_config_publicar_rpc",
      adminConfigProgress: "adm_mmn_config_publicacao_progresso_rpc",
      adminConfigApproverSave: "adm_mmn_config_aprovador_salvar_rpc",
      adminRegulationDraftSave: "adm_mmn_regulamento_rascunho_salvar_rpc",
      adminRegulationPreview: "adm_mmn_regulamento_previsualizar_rpc",
      adminSimulator: "adm_mmn_simular_rpc",
      adminSimulatorReplay: "adm_mmn_simular_historico_rpc",
      adminSimulationsList: "adm_mmn_simulacoes_listar_rpc",
      adminSimulationGet: "adm_mmn_simulacao_obter_rpc",
      adminSimulationsCompare: "adm_mmn_simulacoes_comparar_rpc",
      adminSimulationExport: "adm_mmn_simulacao_exportar_rpc",
      adminPeriodCalculate: "adm_mmn_periodo_apurar_rpc",
      adminPeriodClose: "adm_mmn_periodo_fechar_rpc",
      adminPeriodReopen: "adm_mmn_periodo_reabrir_rpc",
      adminBatchCreate: "adm_mmn_lote_criar_rpc",
      adminBatchApprove: "adm_mmn_lote_aprovar_rpc",
      adminBatchMarkPaid: "adm_mmn_lote_marcar_pago_rpc",
      adminRpasList: "adm_mmn_rpas_listar_rpc",
      adminRpaGet: "adm_mmn_rpa_obter_rpc",
      adminRpaRegister: "adm_mmn_rpa_registrar_rpc",
      adminRpaIssue: "adm_mmn_rpa_emitir_rpc",
      adminParticipantStatus: "adm_mmn_participante_status_rpc",
      adminParticipantGroup: "adm_mmn_participante_grupo_rpc",
      adminSponsorCorrect: "adm_mmn_patrocinador_corrigir_rpc",
      adminPixValidate: "adm_mmn_pix_validar_rpc",
      adminWaitlistDecide: "adm_mmn_espera_decidir_rpc",
      adminFiscalApprove: "adm_mmn_fiscal_homologar_rpc",
      adminOccurrenceUpdate: "adm_mmn_ocorrencia_atualizar_rpc",
      adminParticipantsList: "adm_mmn_participantes_listar_rpc",
      adminWaitlistList: "adm_mmn_espera_listar_rpc",
      adminRevenueList: "adm_mmn_receitas_listar_rpc",
      adminAuditList: "adm_mmn_auditoria_listar_rpc",
      adminOccurrencesList: "adm_mmn_ocorrencias_listar_rpc"
    }
  };

  var state = {
    mode: "admin",
    session: null,
    context: null,
    capabilities: {},
    user: {
      dashboard: null,
      inviteUrl: "",
      copyToastTimer: null,
      cursors: { network: null, ledger: null, payments: null },
      loaded: {},
      pix: {},
      network: { rootId: "", rows: [], directs: [], stack: [], hasMore: false, nodeCache: {} },
      evolution: { rows: [], loaded: false, loading: false, error: "" },
      ranks: [],
      rankQualificationData: null,
      rankQualified: { rank: null, rows: [], cursor: null, hasMore: false }
    },
    admin: {
      dashboard: null,
      config: null,
      simulationParameters: {},
      simulations: [],
      selectedRpa: null,
      cursors: {},
      loaded: {}
    },
    dialogResolve: null,
    programExitBusy: false,
    bootSequence: 0
  };

  var addressState = {
    contexts: {},
    postalCodeCache: {}
  };

  var FRIENDLY_MESSAGES = {
    get "Email not confirmed"(){return legendaMmn("legenda_mmn_confirme_seu_e_mail_antes_de_entrar");},
    get "Failed to fetch"(){return legendaMmn("legenda_mmn_falha_de_conexao_verifique_sua_internet_e_tente_novamente");},
    get "Invalid login credentials"(){return legendaMmn("legenda_mmn_e_mail_ou_senha_invalidos");},
    get app_session_timeout(){return legendaMmn("legenda_mmn_o_app_demorou_para_validar_sua_sessao_toque_em_atualizar");},
    get app_session_unavailable(){return legendaMmn("legenda_mmn_nao_foi_possivel_validar_sua_sessao_pelo_app");},
    get dados_obrigatorios(){return legendaMmn("legenda_mmn_preencha_os_campos_obrigatorios");},
    get invalid_credentials(){return legendaMmn("legenda_mmn_e_mail_ou_senha_invalidos");},
    get invalid_grant(){return legendaMmn("legenda_mmn_e_mail_ou_senha_invalidos");},
    get missing_authorization(){return legendaMmn("legenda_mmn_sessao_expirada_entre_novamente");},
    get nao_autenticado(){return legendaMmn("legenda_mmn_entre_para_continuar");},
    get sem_permissao_admin(){return legendaMmn("legenda_mmn_sem_permissao_administrativa");},
    get sem_permissao_mmn(){return legendaMmn("legenda_mmn_sem_permissao_para_acessar_o_mmn");},
    get sessao_expirada(){return legendaMmn("legenda_mmn_sessao_expirada_entre_novamente");},
    get usuario_nao_encontrado(){return legendaMmn("legenda_mmn_usuario_nao_encontrado");},
    get usuario_nao_encontrado_no_app(){return legendaMmn("legenda_mmn_usuario_do_app_nao_encontrado");},
    get confirmacao_reentrada_mmn_obrigatoria(){return legendaMmn("legenda_mmn_confirme_a_reentrada_no_programa");},
    get novo_aceite_regulamento_vigente_obrigatorio(){return legendaMmn("legenda_mmn_aceite_novamente_o_regulamento_vigente_antes_de_reentrar");},
    get saida_voluntaria_nao_encontrada(){return legendaMmn("legenda_mmn_nao_ha_uma_saida_voluntaria_pendente_de_reentrada");},
    get situacao_cadastral_nao_permite_reentrada(){return legendaMmn("legenda_mmn_sua_situacao_cadastral_nao_permite_a_reentrada_neste_momento");},
    get pix_titular_invalido(){return legendaMmn("legenda_mmn_a_chave_pix_deve_pertencer_ao_mesmo_cpf_do_cadastro");},
    get pix_email_invalido(){return legendaMmn("legenda_mmn_informe_um_e_mail_valido_para_a_chave_pix");},
    get pix_celular_invalido(){return legendaMmn("legenda_mmn_informe_um_celular_com_ddd_e_11_numeros");},
    get pix_phone_invalido(){return legendaMmn("legenda_mmn_informe_um_celular_com_ddd_e_11_numeros");},
    get pix_evp_invalido(){return legendaMmn("legenda_mmn_informe_uma_chave_aleatoria_pix_valida");},
    get pix_chave_aleatoria_invalida(){return legendaMmn("legenda_mmn_informe_uma_chave_aleatoria_pix_valida");},
    get pix_cpf_invalido(){return legendaMmn("legenda_mmn_informe_um_cpf_valido_com_11_numeros");},
    get regulamento_nao_aceito(){return legendaMmn("legenda_mmn_e_necessario_aceitar_o_regulamento_vigente");},
    get configuracao_fiscal_nao_homologada(){return legendaMmn("legenda_mmn_os_pagamentos_reais_permanecem_bloqueados_ate_a_homologacao_fiscal");},
    get quantidade_niveis_deve_ser_inteiro_de_1_a_10(){return legendaMmn("legenda_mmn_a_quantidade_de_niveis_deve_ser_um_inteiro_de_1_a_10");},
    get largura_deve_ser_zero_ou_inteiro_maior_ou_igual_a_2(){return legendaMmn("legenda_mmn_a_largura_deve_ser_0_para_ilimitada_ou_um_inteiro_a_partir_de");},
    get dez_faixas_de_nivel_devem_ser_preservadas_na_configuracao(){return legendaMmn("legenda_mmn_as_dez_faixas_de_nivel_precisam_permanecer_preservadas_na_configuracao");},
    get regulamento_rascunho_nao_encontrado(){return legendaMmn("legenda_mmn_gere_primeiro_o_rascunho_do_regulamento_para_esta_configuracao");},
    get regulamento_somente_para_configuracao_rascunho(){return legendaMmn("legenda_mmn_o_regulamento_so_pode_ser_gerado_para_uma_configuracao_em_rascunho");},
    get modelo_de_regulamento_nao_permitido(){return legendaMmn("legenda_mmn_o_modelo_juridico_solicitado_nao_e_permitido");},
    get versao_de_regulamento_ja_existe(){return legendaMmn("legenda_mmn_essa_versao_do_regulamento_ja_existe");},
    get regulamento_desatualizado_salvar_novamente_e_refazer_simulacao(){return legendaMmn("legenda_mmn_as_regras_mudaram_gere_novamente_o_regulamento_e_refaca_a_simulacao_antes_de");}
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function on(id, eventName, handler) {
    var element = qs(id);
    if (element) element.addEventListener(eventName, handler);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function numberValue(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : (fallback == null ? 0 : fallback);
  }

  function integerValue(value, fallback) {
    return Math.trunc(numberValue(value, fallback));
  }

  function booleanValue(value, fallback) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    if (value === "false" || value === 0 || value === "0") return false;
    return !!fallback;
  }

  function firstDefined(values, fallback) {
    for (var index = 0; index < values.length; index += 1) {
      if (values[index] !== undefined && values[index] !== null) return values[index];
    }
    return fallback;
  }

  function listValue(value) {
    return Array.isArray(value) ? value : [];
  }

  function listFrom(data, keys) {
    var source = data || {};
    for (var index = 0; index < keys.length; index += 1) {
      if (Array.isArray(source[keys[index]])) return source[keys[index]];
    }
    return [];
  }

  function objectFrom(data, keys) {
    var source = data || {};
    for (var index = 0; index < keys.length; index += 1) {
      var value = source[keys[index]];
      if (value && typeof value === "object" && !Array.isArray(value)) return value;
    }
    return {};
  }

  function formatMoneyCents(value) {
    if (value === undefined || value === null || value === "") return "—";
    return (numberValue(value) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function centsFrom(object, keys) {
    var source = object || {};
    for (var index = 0; index < keys.length; index += 1) {
      if (source[keys[index]] !== undefined && source[keys[index]] !== null) {
        return source[keys[index]];
      }
    }
    return null;
  }

  function formatPercent(value) {
    if (value === undefined || value === null || value === "") return "—";
    return numberValue(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    }) + "%";
  }

  function formatInteger(value) {
    if (value === undefined || value === null || value === "") return "—";
    return integerValue(value).toLocaleString("pt-BR");
  }

  function formatDate(value, withTime) {
    if (!value) return "—";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("pt-BR", withTime ? {
      dateStyle: "short",
      timeStyle: "short"
    } : { dateStyle: "short" }).format(date);
  }

  function monthValue(date) {
    var current = date || new Date();
    return current.getFullYear() + "-" + String(current.getMonth() + 1).padStart(2, "0");
  }

  function monthDate(value) {
    return value ? value + "-01" : null;
  }

  function friendlyMessage(value) {
    var raw = String(value == null ? "" : value).trim();
    if (!raw) return legendaMmn("legenda_mmn_nao_foi_possivel_concluir_a_operacao");
    return FRIENDLY_MESSAGES[raw] || FRIENDLY_MESSAGES[raw.toLowerCase()] || raw;
  }

  function apresentarTextoMmn(id, obter) {
    var element = qs(id);
    if (element) apresentarMmn(element, "textContent", function(){var value=obter();return value == null ? "" : String(value);});
  }

  function apresentarStatusMmn(id, obter, kind) {
    var element = typeof id === "string" ? qs(id) : id;
    if (!element) return;
    setStatus(id, obter(), kind);
    apresentarMmn(element, "textContent", function(){var value=obter();return value ? friendlyMessage(value) : "";});
  }

  function setText(id, value) {
    var element = qs(id);
    if (element) vinculosApresentacaoMmn.delete(element);
    if (element) element.textContent = value == null ? "" : String(value);
  }

  function setStatus(id, text, kind) {
    var element = typeof id === "string" ? qs(id) : id;
    if (!element) return;
    vinculosApresentacaoMmn.delete(element);
    element.textContent = text ? friendlyMessage(text) : "";
    element.classList.remove("is-error", "is-ok", "is-warn");
    if (kind) element.classList.add("is-" + kind);
  }

  function setBusy(buttonOrId, busy, busyText) {
    var button = typeof buttonOrId === "string" ? qs(buttonOrId) : buttonOrId;
    if (!button) return;
    if (busy) {
      if (!button.dataset.label) button.dataset.label = button.textContent;
      button.dataset.busy = "true";
      apresentarMmn(button,"textContent",function(){return busyText || legendaMmn("legenda_mmn_rotulo_aguarde");});
      button.disabled = true;
    } else {
      if (button.dataset.label) button.textContent = button.dataset.label;
      delete button.dataset.busy;
      button.disabled = false;
    }
  }

  function emptyHtml(message) {
    return "<div class=\"mmn-empty\">" + escapeHtml(message) + "</div>";
  }

  function emptyTableHtml(columns, message) {
    return "<tr><td colspan=\"" + columns + "\"><div class=\"mmn-empty\">" + escapeHtml(message) + "</div></td></tr>";
  }

  var LEGENDAS_ESTADOS_MMN = {
  "ativo": "legenda_mmn_estado_ativo",
  "elegivel": "legenda_mmn_estado_elegivel",
  "confirmado": "legenda_mmn_estado_confirmado",
  "pago": "legenda_mmn_estado_pago",
  "concluido": "legenda_mmn_estado_concluido",
  "ok": "legenda_mmn_estado_ok",
  "convertido": "legenda_mmn_estado_convertido",
  "homologado": "legenda_mmn_estado_homologado",
  "pendente": "legenda_mmn_estado_pendente",
  "apurando": "legenda_mmn_estado_apurando",
  "retido": "legenda_mmn_estado_retido",
  "revisao": "legenda_mmn_estado_revisao",
  "aguardando": "legenda_mmn_estado_aguardando",
  "fila": "legenda_mmn_estado_fila",
  "enviado": "legenda_mmn_estado_enviado",
  "aberto": "legenda_mmn_estado_aberto",
  "aberta": "legenda_mmn_estado_aberta",
  "em_atendimento": "legenda_mmn_estado_em_atendimento",
  "bloqueado": "legenda_mmn_estado_bloqueado",
  "cancelado": "legenda_mmn_estado_cancelado",
  "falhou": "legenda_mmn_estado_falhou",
  "revertido": "legenda_mmn_estado_revertido",
  "permanente": "legenda_mmn_estado_permanente",
  "inelegivel": "legenda_mmn_estado_inelegivel"
};
  function textoEstadoMmn(status) {
    var motor = window.TurboTigerLegendas;
    if (!motor || !motor.idioma || motor.idioma() === "pt-BR") return status;
    var codigo = String(status || "").toLowerCase();
    return Object.prototype.hasOwnProperty.call(LEGENDAS_ESTADOS_MMN, codigo) ? legendaMmn(LEGENDAS_ESTADOS_MMN[codigo]) : status;
  }

  function pillHtml(status, label) {
    var normalized = String(status || "").toLowerCase();
    var kind = ["ativo", "elegivel", "confirmado", "pago", "concluido", "ok", "convertido", "homologado"].indexOf(normalized) >= 0 ? "is-ok" :
      (["pendente", "apurando", "retido", "revisao", "aguardando", "fila", "enviado", "aberto", "aberta", "em_atendimento"].indexOf(normalized) >= 0 ? "is-warn" :
      (["bloqueado", "cancelado", "falhou", "revertido", "permanente", "inelegivel"].indexOf(normalized) >= 0 ? "is-bad" : ""));
    return "<span class=\"mmn-pill " + kind + "\">" + escapeHtml(label || textoEstadoMmn(status) || "—") + "</span>";
  }

  function setGlobalError(error) {
    var box = qs("globalError");
    if (!box) return;
    if (!error) {
      box.hidden = true;
      setText("globalErrorText", "");
      return;
    }
    setText("globalErrorText", friendlyMessage(error.message || error));
    box.hidden = false;
  }

  function showLoading(show) {
    if (qs("loadingPanel")) qs("loadingPanel").hidden = !show;
  }

  var DETAIL_OVERLAY_IDS = [
    "networkExplorerOverlay",
    "networkDiagramOverlay",
    "rankQualifiedOverlay",
    "evolutionChartOverlay"
  ];

  function overlayIsOpen(id) {
    var overlay = qs(id);
    return !!(overlay && !overlay.hidden);
  }

  function syncPageScrollLock() {
    if (!document.body) return;
    document.body.classList.toggle("mmn-detail-open", DETAIL_OVERLAY_IDS.some(overlayIsOpen));
    document.body.classList.toggle("mmn-regulation-open", overlayIsOpen("regulationOverlay"));
  }

  function setupScrollLockRecovery() {
    var overlays = DETAIL_OVERLAY_IDS.concat(["regulationOverlay"]).map(qs).filter(Boolean);
    if (typeof MutationObserver === "function") {
      var observer = new MutationObserver(syncPageScrollLock);
      overlays.forEach(function (overlay) {
        observer.observe(overlay, { attributes: true, attributeFilter: ["hidden"] });
      });
    }
    window.addEventListener("pageshow", syncPageScrollLock);
    window.addEventListener("focus", syncPageScrollLock);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        document.body.classList.remove("mmn-network-printing");
        syncPageScrollLock();
      }
    });
    syncPageScrollLock();
  }

  function hasNativeBridge() {
    try {
      return !!(window.TurboTigerHistoricoBridge &&
        typeof window.TurboTigerHistoricoBridge.post === "function");
    } catch (error) {
      return false;
    }
  }

  function configureMode() {
    state.mode = hasNativeBridge() ? "user" : "admin";
    document.documentElement.classList.toggle("mmn-app-webview", state.mode === "user");
    if (state.mode === "user") {
      apresentarMmn(document,"title",function(){return legendaMmn("legenda_mmn_indicacoes_e_beneficios_turbo_tiger");});
      apresentarTextoMmn("brandTitle",function(){return legendaMmn("legenda_mmn_indicacoes_e_beneficios");});
      setText("pageTitle", "");
    } else {
      apresentarMmn(document,"title",function(){return legendaMmn("legenda_mmn_mmn_turbo_tiger_admin");});
      apresentarTextoMmn("brandTitle",function(){return legendaMmn("legenda_mmn_admin_mmn");});
      apresentarTextoMmn("pageTitle",function(){return legendaMmn("legenda_mmn_painel_mmn");});
    }
  }

  var brandHomeUrlRequest = null;

  async function publicConfigValue(category, type) {
    var data = await fetchJson(CONFIG.supabaseUrl + "/rest/v1/rpc/app_config_buscar_rpc", {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: CONFIG.apiKey,
        Authorization: "Bearer " + CONFIG.apiKey,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ p_categoria: category, p_tipo: type })
    });
    if (data && typeof data === "object") {
      return cleanText(firstDefined([data.valor, data.value], ""));
    }
    return cleanText(data);
  }

  function safeBrandHomeUrl(value) {
    try {
      var normalized = cleanText(value);
      if (!normalized) return CONFIG.siteHomeUrl;
      var parsed = new URL(normalized, window.location.origin);
      return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : CONFIG.siteHomeUrl;
    } catch (error) {
      return CONFIG.siteHomeUrl;
    }
  }

  function loadBrandHomeUrl() {
    if (state.mode !== "user") return Promise.resolve(CONFIG.siteHomeUrl);
    if (!brandHomeUrlRequest) {
      brandHomeUrlRequest = publicConfigValue("turbotiger_urls", "index_app")
        .then(safeBrandHomeUrl)
        .catch(function () { return CONFIG.siteHomeUrl; });
    }
    return brandHomeUrlRequest;
  }

  function configureBrandHomeLink() {
    var link = qs("brandHomeLink");
    if (!link) return;
    link.href = "./";
  }

  function configureBrandLogo() {
    var image = qs("mmnLogoImg");
    if (!image) return;
    var fallback = image.src;
    publicConfigValue("turbotiger_mmn", "logo_img").then(function (value) {
      if (!value) return;
      image.onerror = function () {
        image.onerror = null;
        image.src = fallback;
      };
      image.src = value;
    }).catch(function () {});
  }

  function readAdminSession() {
    try {
      var raw = localStorage.getItem(CONFIG.adminSessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveAdminSession(session) {
    state.session = session;
    localStorage.setItem(CONFIG.adminSessionKey, JSON.stringify(session));
  }

  function clearAdminSession() {
    state.session = null;
    state.context = null;
    state.capabilities = {};
    localStorage.removeItem(CONFIG.adminSessionKey);
  }

  function jwtExpiresAt(token) {
    try {
      var part = String(token || "").split(".")[1] || "";
      part = part.replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      return Number(JSON.parse(atob(part)).exp || 0) * 1000;
    } catch (error) {
      return 0;
    }
  }

  var appSessionRequest = null;
  var appSessionResolve = null;
  var appSessionReject = null;
  var appSessionTimer = null;

  function finishAppSession(error, session) {
    if (appSessionTimer) window.clearTimeout(appSessionTimer);
    appSessionTimer = null;
    var resolve = appSessionResolve;
    var reject = appSessionReject;
    appSessionRequest = null;
    appSessionResolve = null;
    appSessionReject = null;
    if (error && reject) reject(error);
    if (!error && resolve) resolve(session);
  }

  window.TurboTigerMmnReceiveSession = function (payload) {
    try {
      if (!payload || payload.ok !== true) throw new Error((payload && payload.error) || "app_session_unavailable");
      var value = payload.session || payload;
      var token = String(value.access_token || "").trim();
      if (!token) throw new Error("app_session_unavailable");
      state.session = {
        access_token: token,
        expires_at: jwtExpiresAt(token),
        user: value.user || null,
        endereco_sugerido: payload.endereco_sugerido || value.endereco_sugerido || null
      };
      finishAppSession(null, state.session);
    } catch (error) {
      finishAppSession(error);
    }
  };

  function requestAppSession() {
    if (state.mode !== "user" || !hasNativeBridge()) return Promise.reject(new Error("app_session_unavailable"));
    if (appSessionRequest) return appSessionRequest;
    appSessionRequest = new Promise(function (resolve, reject) {
      appSessionResolve = resolve;
      appSessionReject = reject;
      appSessionTimer = window.setTimeout(function () {
        finishAppSession(new Error("app_session_timeout"));
      }, CONFIG.appSessionTimeoutMs);
      try {
        window.TurboTigerHistoricoBridge.post("TURBO_MMN_SESSION_REQUEST");
      } catch (error) {
        finishAppSession(new Error("app_session_unavailable"));
      }
    });
    return appSessionRequest;
  }

  async function parseResponse(response) {
    var text = await response.text();
    var data = null;
    if (text) {
      try { data = JSON.parse(text); } catch (error) { data = { raw: text }; }
    }
    if (!response.ok) {
      throw new Error((data && (data.error_description || data.message || data.error || data.erro || data.details)) || legendaMmn("legenda_mmn_falha_http") + response.status + ".");
    }
    if (data && data.ok === false) throw new Error(data.error || data.erro || data.message || legendaMmn("legenda_mmn_nao_foi_possivel_concluir_a_operacao"));
    return data == null ? {} : data;
  }

  async function fetchJson(url, options) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, CONFIG.requestTimeoutMs) : null;
    var requestOptions = Object.assign({}, options || {});
    if (controller) requestOptions.signal = controller.signal;
    try {
      return await parseResponse(await fetch(url, requestOptions));
    } catch (error) {
      if (error && error.name === "AbortError") throw new Error(legendaMmn("legenda_mmn_a_consulta_demorou_alem_do_esperado"));
      throw error;
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  async function adminLogin(email, password) {
    var data = await fetchJson(CONFIG.supabaseUrl + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: CONFIG.apiKey, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ email: email, password: password })
    });
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type || "bearer",
      expires_at: Date.now() + (Number(data.expires_in || 3600) * 1000),
      user: data.user || null
    };
  }

  async function refreshSessionIfNeeded() {
    if (state.mode === "user") {
      if (state.session && state.session.access_token && state.session.expires_at > Date.now() + 60000) return state.session;
      return requestAppSession();
    }
    if (!state.session) state.session = readAdminSession();
    if (!state.session || !state.session.access_token) return null;
    if (state.session.expires_at && state.session.expires_at > Date.now() + 60000) return state.session;
    if (!state.session.refresh_token) {
      clearAdminSession();
      return null;
    }
    var data = await fetchJson(CONFIG.supabaseUrl + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: { apikey: CONFIG.apiKey, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ refresh_token: state.session.refresh_token })
    });
    saveAdminSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token || state.session.refresh_token,
      token_type: data.token_type || "bearer",
      expires_at: Date.now() + (Number(data.expires_in || 3600) * 1000),
      user: data.user || state.session.user || null
    });
    return state.session;
  }

  async function rpc(name, payload) {
    var session = await refreshSessionIfNeeded();
    if (!session || !session.access_token) throw new Error("sessao_expirada");
    return fetchJson(CONFIG.supabaseUrl + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: {
        apikey: CONFIG.apiKey,
        Authorization: "Bearer " + session.access_token,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload || {})
    });
  }

  function edgeErrorCode(data) {
    var source = data && typeof data === "object" ? data : {};
    var nested = source.error && typeof source.error === "object" ? source.error : {};
    return cleanText(firstDefined([
      cleanText(source.code) || null,
      cleanText(source.error_code) || null,
      cleanText(source.codigo) || null,
      typeof source.error === "string" ? (cleanText(source.error) || null) : null,
      typeof source.erro === "string" ? (cleanText(source.erro) || null) : null,
      cleanText(nested.code) || null,
      cleanText(nested.error_code) || null,
      cleanText(nested.codigo) || null
    ], "")).toUpperCase();
  }

  function retryAfterMilliseconds(response) {
    var value = response && response.headers ? response.headers.get("Retry-After") : "";
    if (!value) return 30000;
    var seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.max(1000, seconds * 1000);
    var date = new Date(value);
    if (!Number.isNaN(date.getTime())) return Math.max(1000, date.getTime() - Date.now());
    return 30000;
  }

  async function edgeFunction(name, payload) {
    var session = await refreshSessionIfNeeded();
    if (!session || !session.access_token) throw new Error("sessao_expirada");
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, CONFIG.requestTimeoutMs) : null;
    try {
      var response = await fetch(CONFIG.supabaseUrl + "/functions/v1/" + name, {
        method: "POST",
        headers: {
          apikey: CONFIG.apiKey,
          Authorization: "Bearer " + session.access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(payload || {}),
        signal: controller ? controller.signal : undefined
      });
      var responseText = await response.text();
      var data = {};
      if (responseText) {
        try { data = JSON.parse(responseText); }
        catch (error) { data = {}; }
      }
      if (!response.ok || data.ok === false) {
        var requestError = new Error("pix_request_failed");
        requestError.status = response.status;
        requestError.code = edgeErrorCode(data);
        var retryAfterSeconds = numberValue(firstDefined([
          data.retryAfterSeconds,
          data.retry_after_seconds,
          data.retryAfter,
          data.retry_after
        ], 0), 0);
        requestError.retryAfterMs = response.status === 429 ?
          (retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : retryAfterMilliseconds(response)) : 0;
        throw requestError;
      }
      return data;
    } catch (error) {
      if (error && error.name === "AbortError") {
        var timeoutError = new Error("pix_request_timeout");
        timeoutError.code = "REQUEST_TIMEOUT";
        throw timeoutError;
      }
      throw error;
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function cleanText(value) {
    return String(value == null ? "" : value).trim();
  }

  function firstNonEmptyText(values, fallback) {
    for (var index = 0; index < values.length; index += 1) {
      var value = cleanText(values[index]);
      if (value) return value;
    }
    return cleanText(fallback);
  }

  function digitsOnly(value) {
    return cleanText(value).replace(/\D/g, "");
  }

  function formatPostalCode(value) {
    var digits = digitsOnly(value).slice(0, 8);
    return digits.length > 5 ? digits.slice(0, 5) + "-" + digits.slice(5) : digits;
  }

  var PIX_TYPE_LABELS = {
    cpf: "CPF",
    email: "E-mail",
    get celular(){return legendaMmn("legenda_mmn_rotulo_celular");},
    get aleatoria(){return legendaMmn("legenda_mmn_chave_aleatoria");}
  };

  var PIX_TYPE_ALIASES = {
    cpf: "cpf",
    email: "email",
    celular: "celular",
    phone: "celular",
    aleatoria: "aleatoria",
    evp: "aleatoria"
  };

  var PIX_PROVIDER_TYPES = {
    cpf: "CPF",
    email: "EMAIL",
    celular: "PHONE",
    aleatoria: "EVP"
  };

  function pixState(prefix) {
    if (!state.user.pix[prefix]) {
      state.user.pix[prefix] = {
        requestSequence: 0,
        validating: false,
        confirming: false,
        validationId: "",
        validationType: "",
        validationKeyFingerprint: "",
        expiresAt: 0,
        expiryTimer: null,
        rateLimitedUntil: 0,
        rateLimitTimer: null,
        verified: false,
        persisted: false,
        persistedType: "",
        persistedKeyFingerprint: "",
        persistedMasked: "",
        hasStoredKey: false,
        storedConfirmed: false,
        storedType: "",
        storedMasked: ""
      };
    }
    return state.user.pix[prefix];
  }

  function normalizePixType(value) {
    var type = cleanText(value).toLowerCase();
    return PIX_TYPE_ALIASES[type] || "";
  }

  function pixProviderType(value) {
    return PIX_PROVIDER_TYPES[normalizePixType(value)] || "";
  }

  function normalizePixKey(type, value) {
    var key = cleanText(value);
    if (type === "cpf") return digitsOnly(key);
    if (type === "celular") {
      var phoneDigits = digitsOnly(key);
      if (phoneDigits.length === 11) return "55" + phoneDigits;
      return phoneDigits;
    }
    if (type === "email" || type === "aleatoria") return key.toLowerCase();
    return key;
  }

  function validatePixMinimumFormat(type, key) {
    var normalizedType = normalizePixType(type);
    var rawKey = cleanText(key);
    if (!normalizedType) {
      return { valid: false, message: legendaMmn("legenda_mmn_selecione_o_tipo_da_chave_pix") };
    }
    if (!rawKey) {
      return { valid: false, message: legendaMmn("legenda_mmn_informe_a_chave_pix") };
    }
    if (normalizedType === "cpf") {
      if (!/^[0-9.\s-]+$/.test(rawKey) || digitsOnly(rawKey).length !== 11) {
        return { valid: false, message: legendaMmn("legenda_mmn_informe_um_cpf_valido_com_11_numeros") };
      }
    } else if (normalizedType === "email") {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawKey)) {
        return { valid: false, message: legendaMmn("legenda_mmn_informe_um_e_mail_valido_para_a_chave_pix") };
      }
    } else if (normalizedType === "celular") {
      var phoneDigits = digitsOnly(rawKey);
      var validPhoneCharacters = /^[+0-9() .-]+$/.test(rawKey);
      var validNationalPhone = /^[1-9]\d{10}$/.test(phoneDigits);
      var validInternationalPhone = /^55[1-9]\d{10}$/.test(phoneDigits);
      if (!validPhoneCharacters || (!validNationalPhone && !validInternationalPhone)) {
        return { valid: false, message: legendaMmn("legenda_mmn_informe_um_celular_com_ddd_e_11_numeros") };
      }
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawKey)) {
      return { valid: false, message: legendaMmn("legenda_mmn_informe_uma_chave_aleatoria_pix_valida") };
    }
    return { valid: true, message: "" };
  }

  function currentPixSnapshot(prefix) {
    var typeElement = qs(prefix + "PixType");
    var keyElement = qs(prefix + "PixKey");
    var type = normalizePixType(typeElement ? typeElement.value : "");
    var key = cleanText(keyElement ? keyElement.value : "");
    return {
      type: type,
      key: key,
      fingerprint: normalizePixKey(type, key)
    };
  }

  function currentPixMinimumFormat(prefix) {
    var current = currentPixSnapshot(prefix);
    return validatePixMinimumFormat(current.type, current.key);
  }

  function samePixSnapshot(prefix, type, fingerprint) {
    var current = currentPixSnapshot(prefix);
    return current.type === type && current.fingerprint === fingerprint;
  }

  function maskCpfForDisplay(value) {
    var text = cleanText(value);
    if (!text) return "";
    if (text.indexOf("*") >= 0) return text;
    var digits = digitsOnly(text);
    if (digits.length !== 11) return "";
    return "***.***.***-" + digits.slice(-2);
  }

  function maskPixKeyForDisplay(type, value) {
    var key = cleanText(value);
    if (!key) return "";
    if (type === "cpf") return maskCpfForDisplay(key);
    if (type === "email") {
      var parts = key.split("@");
      return parts.length === 2 ? (parts[0].slice(0, 1) || "*") + "***@" + parts[1] : "********";
    }
    if (type === "celular") return "******" + digitsOnly(key).slice(-4);
    return "********" + key.slice(-4);
  }

  function profilePixChangeRequested() {
    var flow = pixState("profile");
    var current = currentPixSnapshot("profile");
    if (!flow.hasStoredKey) return !!current.key || !!current.type;
    return !!current.key || current.type !== flow.storedType;
  }

  function currentPixIsPersisted(prefix) {
    var flow = pixState(prefix);
    if (prefix === "profile" && !profilePixChangeRequested()) return flow.storedConfirmed;
    return flow.persisted && samePixSnapshot(prefix, flow.persistedType, flow.persistedKeyFingerprint);
  }

  function currentPixIsVerified(prefix) {
    var flow = pixState(prefix);
    return flow.verified && !pixValidationExpired(flow) &&
      samePixSnapshot(prefix, flow.validationType, flow.validationKeyFingerprint);
  }

  function setPixFieldStatus(prefix, text, kind) {
    var key = qs(prefix + "PixKey");
    if (!key) return;
    if (kind === "error") key.setAttribute("aria-invalid", "true");
    else key.removeAttribute("aria-invalid");
  }

  function setPixWorkflowStatus(prefix, text, kind) {
    setPixFieldStatus(prefix, text, kind);
    setStatus(prefix + "PixStatus", text, kind);
  }

  function setPixConfirmedPanel(prefix, visible, description) {
    var panel = qs(prefix + "PixConfirmed");
    if (!panel) return;
    panel.hidden = !visible;
    if (description) {
      var span = panel.querySelector("span");
      if (span) span.textContent = description;
    }
  }

  function clearPixResult(prefix) {
    var result = qs(prefix + "PixResult");
    if (result) result.hidden = true;
    ["HolderName", "HolderCpf", "BankName"].forEach(function (field) {
      setText(prefix + "PixResult" + field, "—");
    });
    var checkbox = qs(prefix + "PixConfirmCheck");
    if (checkbox) checkbox.checked = false;
  }

  function clearPixExpiry(flow) {
    if (flow.expiryTimer) window.clearTimeout(flow.expiryTimer);
    flow.expiryTimer = null;
  }

  function renderPixBaseline(prefix) {
    var flow = pixState(prefix);
    clearPixResult(prefix);
    if (flow.rateLimitedUntil > Date.now()) {
      setPixConfirmedPanel(prefix, false);
      setPixWorkflowStatus(prefix, legendaMmn("legenda_mmn_muitas_tentativas_em_pouco_tempo_aguarde_um_momento_e_tente_novamente"), "error");
      return;
    }
    if (prefix === "profile" && !profilePixChangeRequested() && flow.storedConfirmed) {
      setPixConfirmedPanel(prefix, true, legendaMmn("legenda_mmn_ela_sera_mantida_enquanto_voce_nao_informar_uma_nova_chave"));
      setStatus(prefix + "PixStatus", "", null);
      setPixFieldStatus(prefix, legendaMmn("legenda_mmn_chave_pix_confirmada"), "ok");
      return;
    }
    setPixConfirmedPanel(prefix, false);
    if (prefix === "profile" && !profilePixChangeRequested() && flow.hasStoredKey) {
      apresentarStatusMmn(prefix + "PixStatus",function(){return legendaMmn("legenda_mmn_a_chave_atual_ainda_nao_esta_confirmada_informe_a_novamente_para_verificar");},"warn");
      setPixFieldStatus(prefix, legendaMmn("legenda_mmn_informe_novamente_a_chave_pix_atual_para_concluir_a_confirmacao"), "warn");
    } else if (prefix === "profile" && flow.hasStoredKey && !currentPixSnapshot(prefix).key) {
      apresentarStatusMmn(prefix + "PixStatus",function(){return legendaMmn("legenda_mmn_informe_a_nova_chave_pix_para_verificar_a_alteracao");},"warn");
      setPixFieldStatus(prefix, legendaMmn("legenda_mmn_informe_a_nova_chave_pix"), "warn");
    } else {
      apresentarStatusMmn(prefix + "PixStatus",function(){return legendaMmn("legenda_mmn_informe_o_tipo_e_a_chave_depois_toque_em_verificar");},null);
      setPixFieldStatus(prefix, "", null);
    }
  }

  function clearPendingPix(prefix, renderBaseline) {
    var flow = pixState(prefix);
    flow.requestSequence += 1;
    flow.validating = false;
    flow.confirming = false;
    flow.validationId = "";
    flow.validationType = "";
    flow.validationKeyFingerprint = "";
    flow.expiresAt = 0;
    flow.verified = false;
    flow.persisted = false;
    flow.persistedType = "";
    flow.persistedKeyFingerprint = "";
    flow.persistedMasked = "";
    clearPixExpiry(flow);
    setBusy(prefix + "PixVerify", false);
    setBusy(prefix + "PixConfirm", false);
    var typeElement = qs(prefix + "PixType");
    var keyElement = qs(prefix + "PixKey");
    if (typeElement) typeElement.disabled = false;
    if (keyElement) keyElement.disabled = false;
    if (renderBaseline !== false) renderPixBaseline(prefix);
  }

  function pixValidationExpired(flow) {
    return !flow.expiresAt || flow.expiresAt <= Date.now();
  }

  function updatePixActions(prefix) {
    var flow = pixState(prefix);
    var current = currentPixSnapshot(prefix);
    var minimumFormat = validatePixMinimumFormat(current.type, current.key);
    var rateLimited = flow.rateLimitedUntil > Date.now();
    var verify = qs(prefix + "PixVerify");
    var confirm = qs(prefix + "PixConfirm");
    var correct = qs(prefix + "PixCorrect");
    if (verify) {
      verify.hidden = flow.verified || currentPixIsPersisted(prefix);
      verify.disabled = flow.validating || flow.confirming || rateLimited || !minimumFormat.valid || currentPixIsPersisted(prefix);
    }
    if (confirm) {
      confirm.disabled = flow.validating || flow.confirming || !flow.verified || pixValidationExpired(flow) ||
        !samePixSnapshot(prefix, flow.validationType, flow.validationKeyFingerprint);
    }
    if (correct) correct.disabled = flow.confirming;
    if (prefix === "enrollment") updateEnrollmentSubmitState();
    else {
      var submit = qs("profileSubmit");
      var submissionBlocked = !currentPixIsPersisted(prefix);
      if (submit && !submit.dataset.busy) {
        submit.disabled = submissionBlocked;
        submit.setAttribute("aria-disabled", submissionBlocked ? "true" : "false");
      }
    }
  }

  function clearPixRateLimit(prefix) {
    var flow = pixState(prefix);
    if (flow.rateLimitTimer) window.clearTimeout(flow.rateLimitTimer);
    flow.rateLimitedUntil = 0;
    flow.rateLimitTimer = null;
  }

  function schedulePixRateLimit(prefix, milliseconds) {
    var flow = pixState(prefix);
    if (flow.rateLimitTimer) window.clearTimeout(flow.rateLimitTimer);
    flow.rateLimitedUntil = Date.now() + Math.max(1000, milliseconds || 30000);
    flow.rateLimitTimer = window.setTimeout(function () {
      flow.rateLimitedUntil = 0;
      flow.rateLimitTimer = null;
      if (!flow.validating && !flow.confirming && !flow.verified && !currentPixIsPersisted(prefix)) {
        renderPixBaseline(prefix);
      }
      updatePixActions(prefix);
    }, Math.min(2147483647, Math.max(1000, flow.rateLimitedUntil - Date.now() + 50)));
  }

  function expirePixValidation(prefix, validationId) {
    var flow = pixState(prefix);
    if (!flow.verified || (validationId && flow.validationId !== validationId)) return;
    flow.validationId = "";
    flow.validationType = "";
    flow.validationKeyFingerprint = "";
    flow.expiresAt = 0;
    flow.verified = false;
    clearPixExpiry(flow);
    clearPixResult(prefix);
    setPixWorkflowStatus(prefix, legendaMmn("legenda_mmn_a_verificacao_expirou_verifique_a_chave_pix_novamente"), "warn");
    updatePixActions(prefix);
  }

  function schedulePixExpiration(prefix) {
    var flow = pixState(prefix);
    clearPixExpiry(flow);
    var validationId = flow.validationId;
    var delay = flow.expiresAt - Date.now();
    if (delay <= 0) return expirePixValidation(prefix, validationId);
    flow.expiryTimer = window.setTimeout(function () {
      expirePixValidation(prefix, validationId);
    }, Math.min(2147483647, delay + 25));
  }

  function pixResponseSource(data) {
    var source = objectFrom(data, ["data", "result", "resultado", "validation", "validacao"]);
    return Object.keys(source).length ? source : (data || {});
  }

  function normalizePixValidationResponse(data, submitted) {
    var source = pixResponseSource(data);
    var action = cleanText(firstDefined([data.action, source.action], "")).toUpperCase();
    if (action === "IN_PROGRESS") {
      var inProgress = new Error("pix_validation_in_progress");
      inProgress.code = "VALIDATION_IN_PROGRESS";
      throw inProgress;
    }
    var pix = objectFrom(source, ["pix", "keyData", "dados_chave", "key", "chave"]);
    if (!Object.keys(pix).length) pix = source;
    var holder = objectFrom(pix, ["holder", "owner", "titular", "accountHolder", "account"]);
    if (!Object.keys(holder).length) holder = objectFrom(source, ["holder", "owner", "titular", "accountHolder", "account"]);
    var bank = objectFrom(pix, ["bank", "provider", "instituicao", "banco", "institution"]);
    if (!Object.keys(bank).length) bank = objectFrom(source, ["bank", "provider", "instituicao", "banco", "institution"]);
    var validationId = cleanText(firstDefined([
      data.validationId, data.validation_id, data.validacao_id,
      source.validationId, source.validation_id, source.validacao_id, source.id
    ], ""));
    var expiresRaw = firstDefined([
      data.expiresAt, data.expires_at, data.expira_em,
      source.expiresAt, source.expires_at, source.expira_em
    ], "");
    var expiresAt = expiresRaw ? new Date(expiresRaw).getTime() : 0;
    if (!expiresAt) {
      var expiresIn = numberValue(firstDefined([data.expiresIn, data.expires_in, source.expiresIn, source.expires_in], 0));
      if (expiresIn > 0) expiresAt = Date.now() + expiresIn * 1000;
    }
    var type = normalizePixType(firstDefined([pix.type, pix.tipo, pix.keyType, pix.key_type, source.type, source.tipo], submitted.type));
    var key = cleanText(firstDefined([pix.key, pix.chave, pix.value, pix.valor, source.key, source.chave], submitted.key));
    var holderName = cleanText(firstDefined([
      holder.name, holder.nome, holder.fullName, holder.nome_completo,
      pix.name, pix.nome, pix.holderName, pix.holder_name, pix.titular_nome,
      source.name, source.nome, source.holderName, source.holder_name, source.titular_nome
    ], ""));
    var holderCpf = maskCpfForDisplay(firstDefined([
      holder.cpfMasked, holder.cpf_masked, holder.cpf_mascarado, holder.cpf, holder.taxId, holder.tax_id, holder.documento,
      pix.cpfMasked, pix.cpf_masked, pix.cpf_mascarado, pix.holderCpfMasked, pix.holder_cpf_masked, pix.titular_cpf_mascarado, pix.titular_cpf,
      source.cpfMasked, source.cpf_masked, source.cpf_mascarado, source.holderCpfMasked, source.holder_cpf_masked, source.titular_cpf_mascarado, source.titular_cpf
    ], ""));
    var bankCode = cleanText(firstDefined([
      bank.code, bank.codigo, bank.ispb, bank.compe,
      pix.bankCode, pix.bank_code, source.bankCode, source.bank_code
    ], ""));
    var bankName = cleanText(firstDefined([
      bank.name, bank.nome, bank.corporateName, bank.razao_social,
      pix.bankName, pix.bank_name, source.bankName, source.bank_name
    ], ""));
    if (!validationId || !expiresAt || expiresAt <= Date.now() || !type || !key || !holderName || !holderCpf || !bankCode || !bankName) {
      var invalidResponse = new Error("pix_validation_response_invalid");
      invalidResponse.code = "INVALID_RESPONSE";
      throw invalidResponse;
    }
    if (type !== submitted.type || normalizePixKey(type, key) !== submitted.fingerprint) {
      var divergentResponse = new Error("pix_validation_response_divergent");
      divergentResponse.code = "DIVERGENT_RESPONSE";
      throw divergentResponse;
    }
    return {
      validationId: validationId,
      expiresAt: expiresAt,
      type: type,
      key: key,
      holderName: holderName,
      holderCpf: holderCpf,
      bankCode: bankCode,
      bankName: bankName
    };
  }

  function pixConfirmationAccepted(data) {
    var source = pixResponseSource(data);
    var status = cleanText(firstDefined([data.status, source.status, data.situacao, source.situacao], "")).toLowerCase();
    return booleanValue(firstDefined([
      data.confirmed, data.confirmado, source.confirmed, source.confirmado
    ], false), false) || status === "confirmed" || status === "confirmado";
  }

  function pixConfirmationMaskedKey(data, type, fallbackKey) {
    var source = pixResponseSource(data);
    var pix = objectFrom(source, ["pix"]);
    var masked = cleanText(firstDefined([
      pix.keyMasked, pix.key_masked, pix.chave_mascarada,
      source.keyMasked, source.key_masked, source.chave_mascarada,
      data.keyMasked, data.key_masked, data.chave_mascarada
    ], ""));
    return masked || maskPixKeyForDisplay(type, fallbackKey);
  }

  function pixErrorMessage(error, confirming) {
    var status = numberValue(error && error.status, 0);
    var rawCode = cleanText(error && error.code) || cleanText(error && error.message);
    var code = rawCode.toUpperCase();
    var blockedMatch = rawCode.match(/alteracao_pix_bloqueada_ate_(.+)$/i);
    if (blockedMatch) {
      var blockedValue = blockedMatch[1].replace(/^(\d{4}-\d{2}-\d{2})(\d{2}:)/, "$1T$2");
      var blockedDate = new Date(blockedValue);
      if (!Number.isNaN(blockedDate.getTime())) {
        return legendaMmn("legenda_mmn_por_seguranca_sua_chave_pix_podera_ser_alterada_novamente_em") +
          new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(blockedDate) + ".";
      }
      return legendaMmn("legenda_mmn_por_seguranca_ainda_nao_e_possivel_alterar_sua_chave_pix_aguarde_o_prazo");
    }
    if (status === 429 || code.indexOf("RATE_LIMIT") >= 0 || code.indexOf("TOO_MANY") >= 0) {
      return legendaMmn("legenda_mmn_muitas_tentativas_em_pouco_tempo_aguarde_um_momento_e_tente_novamente");
    }
    if (status === 401 || status === 403 || code.indexOf("AUTH") >= 0 ||
        code.indexOf("SESSION") >= 0 || code.indexOf("SESSAO") >= 0) {
      if (code.indexOf("ASAAS") >= 0 || code.indexOf("PROVIDER") >= 0) {
        return legendaMmn("legenda_mmn_o_servico_de_consulta_pix_esta_temporariamente_indisponivel_tente_novamente_mais_tarde");
      }
      return legendaMmn("legenda_mmn_sua_sessao_expirou_atualize_o_painel_e_tente_novamente");
    }
    if (status === 410 || code.indexOf("EXPIRED") >= 0 || code.indexOf("EXPIRAD") >= 0) {
      return legendaMmn("legenda_mmn_a_verificacao_expirou_verifique_a_chave_pix_novamente");
    }
    if (code.indexOf("INVALID_PIX_TYPE") >= 0 || code.indexOf("PIX_TYPE_INVALID") >= 0) {
      return legendaMmn("legenda_mmn_selecione_um_tipo_valido_de_chave_pix");
    }
    if (code.indexOf("INVALID_PIX_CPF") >= 0 || code.indexOf("PIX_CPF_INVALID") >= 0 || code.indexOf("PIX_CPF_INVAL") >= 0) {
      return legendaMmn("legenda_mmn_informe_um_cpf_valido_com_11_numeros");
    }
    if (code.indexOf("INVALID_PIX_EMAIL") >= 0 || code.indexOf("PIX_EMAIL_INVALID") >= 0 || code.indexOf("PIX_EMAIL_INVAL") >= 0) {
      return legendaMmn("legenda_mmn_informe_um_e_mail_valido_para_a_chave_pix");
    }
    if (code.indexOf("INVALID_PIX_PHONE") >= 0 || code.indexOf("INVALID_PIX_CELULAR") >= 0 ||
        code.indexOf("PIX_PHONE_INVALID") >= 0 || code.indexOf("PIX_CELULAR_INVAL") >= 0) {
      return legendaMmn("legenda_mmn_informe_um_celular_com_ddd_e_11_numeros");
    }
    if (code.indexOf("INVALID_PIX_EVP") >= 0 || code.indexOf("PIX_EVP_INVALID") >= 0 ||
        code.indexOf("CHAVE_PIX_ALEATORIA_INVALIDA") >= 0 || code.indexOf("PIX_CHAVE_ALEATORIA_INVAL") >= 0) {
      return legendaMmn("legenda_mmn_informe_uma_chave_aleatoria_pix_valida");
    }
    if (code.indexOf("INVALID_PIX_KEY") >= 0) {
      return legendaMmn("legenda_mmn_informe_uma_chave_pix_valida");
    }
    if (code.indexOf("HOLDER_DATA_MISMATCH") >= 0 || code.indexOf("CPF_KEY_MUST_MATCH_USER") >= 0 ||
        code.indexOf("REJECTED_DIVERGENCE") >= 0 || code.indexOf("TITULAR") >= 0 ||
        code.indexOf("OWNERSHIP") >= 0 || code.indexOf("DIVERGEN") >= 0) {
      return legendaMmn("legenda_mmn_esta_chave_pix_nao_corresponde_ao_titular_do_cadastro_confira_os_dados_ou");
    }
    if (code.indexOf("PIX_KEY_NOT_VALIDATED") >= 0 || code.indexOf("KEY_NOT_FOUND") >= 0 ||
        code.indexOf("PIX_KEY_INVALID") >= 0 || code.indexOf("REJECTED_PROVIDER") >= 0) {
      return legendaMmn("legenda_mmn_a_chave_pix_nao_foi_localizada_confira_o_tipo_e_a_chave_informados");
    }
    if (code.indexOf("VALIDATION_IN_PROGRESS") >= 0) {
      return legendaMmn("legenda_mmn_a_verificacao_desta_chave_pix_ja_esta_em_andamento_aguarde_alguns_segundos_e");
    }
    if (code.indexOf("PROVIDER_DATA_ANOMALOUS") >= 0 || code.indexOf("REVIEW_REQUIRED") >= 0 ||
        code.indexOf("CONSISTENCY") >= 0 || code === "INVALID_RESPONSE") {
      return legendaMmn("legenda_mmn_a_instituicao_retornou_dados_que_nao_puderam_ser_confirmados_com_seguranca_confira_a");
    }
    if (code.indexOf("ASAAS") >= 0 || code.indexOf("PROVIDER_ERROR") >= 0 ||
        code.indexOf("BACKEND_UNAVAILABLE") >= 0 || code.indexOf("BACKEND_INVALID_RESPONSE") >= 0) {
      return legendaMmn("legenda_mmn_o_servico_de_consulta_pix_esta_temporariamente_indisponivel_tente_novamente_mais_tarde");
    }
    if (status >= 500 || code === "REQUEST_TIMEOUT" || code.indexOf("FAILED TO FETCH") >= 0 ||
        code.indexOf("NETWORK") >= 0 || code.indexOf("LOAD FAILED") >= 0) {
      return legendaMmn("legenda_mmn_nao_foi_possivel_consultar_a_chave_pix_agora_tente_novamente_em_instantes");
    }
    if (confirming) return legendaMmn("legenda_mmn_nao_foi_possivel_confirmar_esta_chave_pix_verifique_novamente_e_repita_a_confirmacao");
    return legendaMmn("legenda_mmn_nao_foi_possivel_confirmar_que_esta_chave_pix_pertence_ao_titular_do_cadastro");
  }

  function isPixRelatedError(error) {
    var code = (cleanText(error && error.code) || cleanText(error && error.message) || cleanText(error)).toUpperCase();
    return /PIX|ASAAS|EVP|PHONE|CELULAR|TITULAR|HOLDER|OWNERSHIP|DIVERGEN/.test(code);
  }

  function renderPixValidationResult(prefix, details) {
    setText(prefix + "PixResultHolderName", details.holderName);
    setText(prefix + "PixResultHolderCpf", details.holderCpf);
    setText(prefix + "PixResultBankName", [details.bankCode, details.bankName].filter(Boolean).join(" "));
    qs(prefix + "PixResult").hidden = false;
    setPixConfirmedPanel(prefix, false);
  }

  async function verifyPixKey(prefix) {
    var existingFlow = pixState(prefix);
    if (existingFlow.validating || existingFlow.confirming) return false;
    if (currentPixIsPersisted(prefix) || currentPixIsVerified(prefix)) return true;
    var submitted = currentPixSnapshot(prefix);
    var minimumFormat = validatePixMinimumFormat(submitted.type, submitted.key);
    if (!minimumFormat.valid) {
      setPixWorkflowStatus(prefix, minimumFormat.message, "error");
      updatePixActions(prefix);
      return false;
    }
    clearPendingPix(prefix, false);
    var flow = pixState(prefix);
    var requestSequence = ++flow.requestSequence;
    flow.validating = true;
    setBusy(prefix + "PixVerify", true, legendaMmn("legenda_mmn_rotulo_verificando"));
    setPixWorkflowStatus(prefix, legendaMmn("legenda_mmn_consultando_a_chave_pix_com_seguranca"), "warn");
    clearPixResult(prefix);
    setPixConfirmedPanel(prefix, false);
    updatePixActions(prefix);
    try {
      var response = await edgeFunction(CONFIG.edgeFunctions.validatePixKey, {
        type: pixProviderType(submitted.type),
        key: submitted.key
      });
      if (requestSequence !== flow.requestSequence || !samePixSnapshot(prefix, submitted.type, submitted.fingerprint)) return false;
      var details = normalizePixValidationResponse(response, submitted);
      clearPixRateLimit(prefix);
      flow.validationId = details.validationId;
      flow.validationType = submitted.type;
      flow.validationKeyFingerprint = submitted.fingerprint;
      flow.expiresAt = details.expiresAt;
      flow.verified = true;
      renderPixValidationResult(prefix, details);
      setPixWorkflowStatus(prefix, legendaMmn("legenda_mmn_chave_localizada_confira_os_dados_abaixo_e_confirme_a_titularidade"), "ok");
      schedulePixExpiration(prefix);
      return true;
    } catch (error) {
      if (requestSequence !== flow.requestSequence) return false;
      flow.validationId = "";
      flow.validationType = "";
      flow.validationKeyFingerprint = "";
      flow.expiresAt = 0;
      flow.verified = false;
      clearPixResult(prefix);
      if (numberValue(error && error.status, 0) === 429 || cleanText(error && error.code).toUpperCase().indexOf("RATE_LIMIT") >= 0) {
        schedulePixRateLimit(prefix, error.retryAfterMs || 30000);
      }
      setPixWorkflowStatus(prefix, pixErrorMessage(error, false), "error");
      return false;
    } finally {
      if (requestSequence === flow.requestSequence) {
        flow.validating = false;
        setBusy(prefix + "PixVerify", false);
        updatePixActions(prefix);
      }
    }
  }

  async function confirmPixKey(prefix) {
    var flow = pixState(prefix);
    if (flow.confirming || flow.validating) return false;
    if (!flow.verified || pixValidationExpired(flow)) {
      expirePixValidation(prefix, flow.validationId);
      return false;
    }
    if (!samePixSnapshot(prefix, flow.validationType, flow.validationKeyFingerprint)) {
      clearPendingPix(prefix, true);
      return false;
    }
    var validationId = flow.validationId;
    var submitted = currentPixSnapshot(prefix);
    var requestSequence = ++flow.requestSequence;
    flow.confirming = true;
    qs(prefix + "PixType").disabled = true;
    qs(prefix + "PixKey").disabled = true;
    setBusy(prefix + "PixConfirm", true, legendaMmn("legenda_mmn_rotulo_confirmando"));
    setPixWorkflowStatus(prefix, legendaMmn("legenda_mmn_registrando_sua_confirmacao"), "warn");
    updatePixActions(prefix);
    try {
      var response = await edgeFunction(CONFIG.edgeFunctions.confirmPixKey, {
        validationId: validationId,
        confirmed: true
      });
      if (requestSequence !== flow.requestSequence) return false;
      if (!pixConfirmationAccepted(response)) {
        var invalidConfirmation = new Error("pix_confirmation_response_invalid");
        invalidConfirmation.code = "INVALID_RESPONSE";
        throw invalidConfirmation;
      }
      clearPixRateLimit(prefix);
      flow.persisted = true;
      flow.persistedType = submitted.type;
      flow.persistedKeyFingerprint = submitted.fingerprint;
      flow.persistedMasked = pixConfirmationMaskedKey(response, submitted.type, submitted.key);
      flow.verified = false;
      flow.validationId = "";
      flow.expiresAt = 0;
      clearPixExpiry(flow);
      clearPixResult(prefix);
      setPixConfirmedPanel(prefix, true, legendaMmn("legenda_mmn_a_confirmacao_foi_registrada_se_alterar_o_tipo_ou_a_chave_sera_necessario"));
      setPixWorkflowStatus(prefix, "", null);
      return true;
    } catch (error) {
      if (requestSequence !== flow.requestSequence) return false;
      if (numberValue(error && error.status, 0) === 429 || cleanText(error && error.code).toUpperCase().indexOf("RATE_LIMIT") >= 0) {
        schedulePixRateLimit(prefix, error.retryAfterMs || 30000);
      }
      flow.verified = false;
      flow.validationId = "";
      flow.expiresAt = 0;
      clearPixExpiry(flow);
      clearPixResult(prefix);
      setPixWorkflowStatus(prefix, pixErrorMessage(error, true), "error");
      return false;
    } finally {
      if (requestSequence === flow.requestSequence) {
        flow.confirming = false;
        qs(prefix + "PixType").disabled = false;
        qs(prefix + "PixKey").disabled = false;
        setBusy(prefix + "PixConfirm", false);
        updatePixActions(prefix);
      }
    }
  }

  function initializePixValidation(prefix, profile) {
    var flow = pixState(prefix);
    flow.hasStoredKey = prefix === "profile" && (
      booleanValue(profile.cadastrado, false) || !!profile.pix_mascarado || !!profile.pix_chave
    );
    flow.storedConfirmed = prefix === "profile" && booleanValue(firstDefined([
      profile.pix_confirmado,
      profile.pix_validado,
      profile.confirmado,
      profile.validado
    ], false), false);
    flow.storedType = prefix === "profile" && flow.hasStoredKey ? normalizePixType(firstDefined([
      profile.pix_tipo, profile.tipo, profile.tipo_chave_pix
    ], qs(prefix + "PixType").value)) : "";
    flow.storedMasked = prefix === "profile" ? cleanText(firstDefined([
      profile.pix_mascarado, profile.chave_mascarada
    ], "")) : "";
    clearPendingPix(prefix, true);
    updatePixActions(prefix);
  }

  async function ensurePixReadyForSubmission(prefix) {
    var flow = pixState(prefix);
    if (prefix === "profile" && !profilePixChangeRequested() && flow.storedConfirmed) return true;
    var current = currentPixSnapshot(prefix);
    var minimumFormat = validatePixMinimumFormat(current.type, current.key);
    if (!minimumFormat.valid) {
      var missingStoredKey = prefix === "profile" && pixState(prefix).hasStoredKey && !current.key;
      var message = missingStoredKey ?
        legendaMmn("legenda_mmn_informe_novamente_a_chave_pix_atual_para_verificar_e_confirmar") : minimumFormat.message;
      setPixWorkflowStatus(prefix, message, "error");
      var invalidKey = qs(prefix + "PixKey");
      if (invalidKey) invalidKey.focus();
      updatePixActions(prefix);
      return false;
    }
    if (currentPixIsPersisted(prefix)) return true;
    if (!currentPixIsVerified(prefix)) {
      var verified = await verifyPixKey(prefix);
      if (!verified) return false;
    }
    if (!currentPixIsPersisted(prefix)) {
      setPixWorkflowStatus(prefix, legendaMmn("legenda_mmn_confira_os_dados_encontrados_e_toque_em_confirmar"), "warn");
      updatePixActions(prefix);
      return false;
    }
    return true;
  }

  function showPixFormError(prefix, statusId, error) {
    var raw = cleanText(error && (error.message || error));
    var pixRelated = isPixRelatedError(error);
    var codedError = !!cleanText(error && error.code) || /^[A-Z0-9_]+$/i.test(raw);
    var message = pixRelated && codedError ? pixErrorMessage(error, false) : friendlyMessage(raw);
    if (pixRelated) setPixWorkflowStatus(prefix, message, "error");
    else setStatus(statusId, message, "error");
  }

  function setupPixValidationForms() {
    ["enrollment", "profile"].forEach(function (prefix) {
      on(prefix + "PixType", "change", function () {
        clearPendingPix(prefix, true);
        updatePixActions(prefix);
      });
      on(prefix + "PixKey", "input", function () {
        clearPendingPix(prefix, true);
        updatePixActions(prefix);
      });
      on(prefix + "PixKey", "blur", function () {
        if (currentPixIsPersisted(prefix) || currentPixIsVerified(prefix)) return;
        var minimumFormat = currentPixMinimumFormat(prefix);
        if (!minimumFormat.valid) {
          setPixWorkflowStatus(prefix, minimumFormat.message, "error");
          updatePixActions(prefix);
          return;
        }
        verifyPixKey(prefix);
      });
      on(prefix + "PixVerify", "click", function () { verifyPixKey(prefix); });
      on(prefix + "PixConfirm", "click", function () { confirmPixKey(prefix); });
      on(prefix + "PixCorrect", "click", function () {
        clearPendingPix(prefix, true);
        var key = qs(prefix + "PixKey");
        key.focus();
        if (typeof key.select === "function") key.select();
      });
      updatePixActions(prefix);
    });
  }

  function normalizeSearchText(value) {
    return cleanText(value).toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function addressContext(prefix) {
    if (!addressState.contexts[prefix]) {
      addressState.contexts[prefix] = {
        prefix: prefix,
        states: staticAddressStates(prefix),
        cities: [],
        selectedState: null,
        selectedCity: null,
        stateTimer: null,
        cityTimer: null,
        postalCodeTimer: null,
        postalLookupRequest: 0,
        reversePostalCodeTimer: null,
        reverseRequest: 0,
        resolvedPostalCode: "",
        resolvedAddressKey: "",
        postalCodeConsistent: false,
        stateRequest: 0,
        cityRequest: 0,
        reverseResults: []
      };
    }
    return addressState.contexts[prefix];
  }

  function staticAddressStates(prefix) {
    var field = qs(prefix + "State");
    if (!field || !field.options) return [];
    return Array.prototype.slice.call(field.options).filter(function (option) {
      return /^[A-Z]{2}$/.test(cleanText(option.value).toUpperCase());
    }).map(function (option) {
      var uf = cleanText(option.value).toUpperCase();
      var label = cleanText(option.textContent);
      return normalizeStateRow({ uf: uf, nome: cleanText(label.replace(new RegExp("^" + uf + "\\s*-\\s*", "i"), "")) || uf });
    });
  }

  function findStaticAddressState(prefix, value) {
    var search = normalizeSearchText(value);
    if (!search) return null;
    return addressContext(prefix).states.find(function (row) {
      return normalizeSearchText(row.uf) === search || normalizeSearchText(row.nome) === search;
    }) || null;
  }

  function normalizeStateRow(raw) {
    var row = raw || {};
    return Object.assign({}, row, {
      cod_estado: firstDefined([row.cod_estado, row.id_estado, row.id], null),
      uf: cleanText(firstDefined([row.uf, row.sigla], "")).toUpperCase(),
      nome: cleanText(firstDefined([row.nome, row.estado, row.nome_estado], ""))
    });
  }

  function normalizeCityRow(raw, fallbackUf) {
    var row = raw || {};
    return Object.assign({}, row, {
      cod_cidade: firstDefined([row.cod_cidade, row.id_cidade, row.id], null),
      cod_estado: firstDefined([row.cod_estado, row.id_estado], null),
      ibge: cleanText(firstDefined([row.ibge, row.codigo_ibge, row.cidade_ibge], "")),
      uf: cleanText(firstDefined([row.uf, row.estado_uf, fallbackUf], "")).toUpperCase(),
      nome: cleanText(firstDefined([row.nome, row.cidade, row.nome_cidade], ""))
    });
  }

  function setAddressStatus(prefix, text, kind) {
    var element = qs(prefix + "PostalCodeStatus");
    if (!element) return;
    element.textContent = text || "";
    element.classList.remove("is-error", "is-ok", "is-warn");
    if (kind) element.classList.add("is-" + kind);
  }

  function currentAddressKey(prefix) {
    return [
      cleanText(qs(prefix + "State").value).toUpperCase(),
      normalizeSearchText(qs(prefix + "City").value),
      normalizeSearchText(qs(prefix + "Address").value)
    ].join("|");
  }

  function addressHasReverseLookupKey(prefix) {
    return /^[A-Z]{2}$/.test(cleanText(qs(prefix + "State").value).toUpperCase()) && cleanText(qs(prefix + "City").value).length >= 3 && cleanText(qs(prefix + "Address").value).length >= 3;
  }

  function updatePostalCodeSearchButton(prefix) {
    var button = qs(prefix + "FindPostalCode");
    if (!button) return;
    button.hidden = addressContext(prefix).postalCodeConsistent;
  }

  function markAddressResolved(prefix) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    context.resolvedPostalCode = cep.length === 8 ? cep : "";
    context.resolvedAddressKey = currentAddressKey(prefix);
    context.postalCodeConsistent = !!context.resolvedPostalCode && addressHasReverseLookupKey(prefix);
    updatePostalCodeSearchButton(prefix);
    if (prefix === "enrollment") updateEnrollmentSubmitState();
  }

  function markAddressPending(prefix, scheduleLookup, delay) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    var unchanged = cep.length === 8 && cep === context.resolvedPostalCode && currentAddressKey(prefix) === context.resolvedAddressKey;
    if (unchanged) {
      context.postalCodeConsistent = true;
      updatePostalCodeSearchButton(prefix);
      if (prefix === "enrollment") updateEnrollmentSubmitState();
      return;
    }
    context.postalCodeConsistent = false;
    updatePostalCodeSearchButton(prefix);
    if (prefix === "enrollment") updateEnrollmentSubmitState();
    context.postalLookupRequest += 1;
    window.clearTimeout(context.reversePostalCodeTimer);
    if (!addressHasReverseLookupKey(prefix)) {
      setAddressStatus(prefix, legendaMmn("legenda_mmn_endereco_alterado_complete_uf_cidade_e_logradouro_ou_digite_um_cep_valido"), "warn");
      return;
    }
    setAddressStatus(prefix, legendaMmn("legenda_mmn_endereco_alterado_conferindo_o_cep_correspondente"), "warn");
    if (scheduleLookup !== false) {
      context.reversePostalCodeTimer = window.setTimeout(function () {
        findPostalCodeByAddress(prefix, true);
      }, delay == null ? 700 : delay);
    }
  }

  function hideAddressOptions(prefix, kind) {
    var list = qs(prefix + (kind === "state" ? "StateList" : "CityList"));
    if (!list) return;
    list.hidden = true;
    list.innerHTML = "";
  }

  function addressOptionHtml(label, index) {
    return "<button class=\"mmn-address-option\" type=\"button\" role=\"option\" data-address-index=\"" + escapeHtml(index) + "\">" + escapeHtml(label) + "</button>";
  }

  function renderStateOptions(prefix, rows) {
    var list = qs(prefix + "StateList");
    if (!list) return;
    apresentarMmn(list,"innerHTML",function(){return rows.length ? rows.map(function (row, index) {
      return addressOptionHtml(row.uf + " - " + row.nome, index);
    }).join("") : ("<div class=\"mmn-address-option\" role=\"option\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nenhum_estado_encontrado")) + "</div>");});
    list.hidden = false;
  }

  function renderCityOptions(prefix, rows) {
    var list = qs(prefix + "CityList");
    if (!list) return;
    list.innerHTML = rows.length ? rows.map(function (row, index) {
      return addressOptionHtml(row.nome + " - " + row.uf, index);
    }).join("") : "";
    list.hidden = !rows.length;
  }

  async function loadAddressStates(prefix, search, showOptions) {
    var context = addressContext(prefix);
    context.states = staticAddressStates(prefix);
    var selected = findStaticAddressState(prefix, search);
    if (selected) context.selectedState = selected;
    if (showOptions !== false && !qs(prefix + "State").options) renderStateOptions(prefix, context.states);
    return context.states;
  }

  async function loadAddressCities(prefix, search, showOptions) {
    var context = addressContext(prefix);
    var stateInput = qs(prefix + "State");
    var cityInput = qs(prefix + "City");
    var uf = context.selectedState ? context.selectedState.uf : cleanText(stateInput && stateInput.value).toUpperCase();
    if (!/^[A-Z]{2}$/.test(uf) || !cityInput || cityInput.disabled) {
      context.cities = [];
      renderCityOptions(prefix, []);
      return;
    }
    var request = ++context.cityRequest;
    try {
      var data = await rpc(CONFIG.rpcs.locationCities, {
        p_uf: uf,
        p_busca: cleanText(search),
        p_limite: 40
      });
      if (request !== context.cityRequest) return;
      context.cities = listFrom(data, ["cidades", "itens"]).map(function (row) {
        return normalizeCityRow(row, uf);
      }).filter(function (row) {
        return row.nome && row.uf === uf;
      });
      if (showOptions !== false) renderCityOptions(prefix, context.cities);
    } catch (error) {
      if (request !== context.cityRequest) return;
      context.cities = [];
      renderCityOptions(prefix, []);
      setAddressStatus(prefix, legendaMmn("legenda_mmn_nao_foi_possivel_carregar_as_cidades_agora"), "error");
    }
  }

  function selectAddressState(prefix, row, preserveCity) {
    var context = addressContext(prefix);
    var normalized = normalizeStateRow(row);
    if (!/^[A-Z]{2}$/.test(normalized.uf)) return;
    context.selectedState = normalized;
    qs(prefix + "State").value = normalized.uf;
    hideAddressOptions(prefix, "state");
    var cityInput = qs(prefix + "City");
    cityInput.disabled = false;
    cityInput.placeholder = legendaMmn("legenda_mmn_digite_e_selecione_a_cidade");
    if (!preserveCity) {
      context.selectedCity = null;
      cityInput.value = "";
    }
  }

  function selectAddressCity(prefix, row) {
    var context = addressContext(prefix);
    var normalized = normalizeCityRow(row, context.selectedState && context.selectedState.uf);
    if (!normalized.nome) return;
    context.selectedCity = normalized;
    qs(prefix + "City").value = normalized.nome;
    hideAddressOptions(prefix, "city");
  }

  function selectTypedAddressState(prefix, allowSingleMatch, preserveCity) {
    var context = addressContext(prefix);
    var search = normalizeSearchText(qs(prefix + "State").value);
    if (!search) return false;
    var exact = context.states.find(function (row) {
      return normalizeSearchText(row.uf) === search || normalizeSearchText(row.nome) === search;
    });
    var matches = context.states.filter(function (row) {
      return normalizeSearchText(row.uf).indexOf(search) >= 0 || normalizeSearchText(row.nome).indexOf(search) >= 0;
    });
    var selected = exact || (allowSingleMatch && matches.length === 1 ? matches[0] : null);
    if (!selected) return false;
    selectAddressState(prefix, selected, !!preserveCity);
    loadAddressCities(prefix, preserveCity ? qs(prefix + "City").value : "", preserveCity ? false : true);
    return true;
  }

  function selectTypedAddressCity(prefix) {
    var context = addressContext(prefix);
    var search = normalizeSearchText(qs(prefix + "City").value);
    var selected = context.cities.find(function (row) { return normalizeSearchText(row.nome) === search; });
    if (!selected) return false;
    selectAddressCity(prefix, selected);
    return true;
  }

  async function fetchAddressJson(url) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, CONFIG.addressRequestTimeoutMs) : null;
    try {
      var response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      });
      if (!response.ok) throw new Error(legendaMmn("legenda_mmn_falha_http") + response.status + ".");
      return await response.json();
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function normalizeViaCep(raw) {
    var row = raw || {};
    return {
      cep: digitsOnly(row.cep),
      logradouro: cleanText(row.logradouro),
      complemento: cleanText(row.complemento),
      bairro: cleanText(row.bairro),
      cidade: cleanText(row.localidade),
      uf: cleanText(row.uf).toUpperCase(),
      ibge: cleanText(row.ibge)
    };
  }

  function normalizeBrasilApi(raw) {
    var row = raw || {};
    return {
      cep: digitsOnly(row.cep),
      logradouro: cleanText(row.street),
      complemento: "",
      bairro: cleanText(row.neighborhood),
      cidade: cleanText(row.city),
      uf: cleanText(row.state).toUpperCase(),
      ibge: cleanText(row.city_ibge)
    };
  }

  async function findAddressByPostalCode(postalCode) {
    var cep = digitsOnly(postalCode);
    if (addressState.postalCodeCache[cep]) return addressState.postalCodeCache[cep];
    var viaCepError = null;
    try {
      var viaCep = await fetchAddressJson("https://viacep.com.br/ws/" + encodeURIComponent(cep) + "/json/");
      if (!viaCep.erro) {
        var normalizedViaCep = normalizeViaCep(viaCep);
        addressState.postalCodeCache[cep] = normalizedViaCep;
        return normalizedViaCep;
      }
      viaCepError = new Error(legendaMmn("legenda_mmn_cep_nao_encontrado"));
    } catch (error) {
      viaCepError = error;
    }
    try {
      var brasilApi = await fetchAddressJson("https://brasilapi.com.br/api/cep/v2/" + encodeURIComponent(cep));
      var normalizedBrasilApi = normalizeBrasilApi(brasilApi);
      addressState.postalCodeCache[cep] = normalizedBrasilApi;
      return normalizedBrasilApi;
    } catch (error) {
      if (window.console && console.warn) console.warn(legendaMmn("legenda_mmn_falha_nas_consultas_de_cep"), viaCepError, error);
      throw new Error(legendaMmn("legenda_mmn_nao_foi_possivel_localizar_esse_cep"));
    }
  }

  function setAddressSelectionFromLookup(prefix, address) {
    var context = addressContext(prefix);
    var stateRow = context.states.find(function (row) { return row.uf === address.uf; }) || { uf: address.uf, nome: address.uf };
    selectAddressState(prefix, stateRow, true);
    var cityRow = context.cities.find(function (row) {
      return row.uf === address.uf && normalizeSearchText(row.nome) === normalizeSearchText(address.cidade);
    }) || { nome: address.cidade, uf: address.uf, ibge: address.ibge };
    selectAddressCity(prefix, cityRow);
  }

  function fillAddressFromLookup(prefix, address, focusNumber) {
    qs(prefix + "PostalCode").value = formatPostalCode(address.cep);
    qs(prefix + "Address").value = address.logradouro || "";
    qs(prefix + "District").value = address.bairro || "";
    qs(prefix + "City").value = address.cidade || "";
    qs(prefix + "State").value = address.uf || "";
    setAddressSelectionFromLookup(prefix, address);
    var resolvedKey = currentAddressKey(prefix);
    loadAddressCities(prefix, address.cidade, false).then(function () {
      if (currentAddressKey(prefix) !== resolvedKey) return;
      selectTypedAddressCity(prefix);
      hideAddressOptions(prefix, "city");
      markAddressResolved(prefix);
    }).catch(function () {});
    markAddressResolved(prefix);
    if (focusNumber) qs(prefix + "AddressNumber").focus();
  }

  async function lookupAddressByPostalCode(prefix, postalCode, focusNumber) {
    var context = addressContext(prefix);
    var cep = digitsOnly(postalCode);
    if (cep.length !== 8) return;
    var request = ++context.postalLookupRequest;
    setAddressStatus(prefix, legendaMmn("legenda_mmn_consultando_o_cep"), null);
    var expectedCep = cep;
    try {
      var address = await findAddressByPostalCode(cep);
      if (request !== context.postalLookupRequest || digitsOnly(qs(prefix + "PostalCode").value) !== expectedCep) return;
      fillAddressFromLookup(prefix, address, focusNumber);
      setAddressStatus(prefix, legendaMmn("legenda_mmn_endereco_encontrado"), "ok");
    } catch (error) {
      if (request !== context.postalLookupRequest || digitsOnly(qs(prefix + "PostalCode").value) !== expectedCep) return;
      setAddressStatus(prefix, error.message || legendaMmn("legenda_mmn_nao_foi_possivel_consultar_o_cep"), "error");
    }
  }

  function resetReversePostalCodeResults(prefix) {
    var context = addressContext(prefix);
    context.reverseResults = [];
    var container = qs(prefix + "PostalCodeResults");
    var select = qs(prefix + "PostalCodeSelect");
    container.hidden = true;
    apresentarMmn(select,"innerHTML",function(){return "<option value=\"\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_selecione")) + "</option>";});
  }

  async function findPostalCodeByAddress(prefix, automatic) {
    var context = addressContext(prefix);
    var uf = cleanText(qs(prefix + "State").value).toUpperCase();
    var city = cleanText(qs(prefix + "City").value);
    var street = cleanText(qs(prefix + "Address").value);
    var expectedKey = currentAddressKey(prefix);
    var request = ++context.reverseRequest;
    resetReversePostalCodeResults(prefix);
    if (!/^[A-Z]{2}$/.test(uf)) {
      setAddressStatus(prefix, legendaMmn("legenda_mmn_selecione_uma_uf_valida"), "error");
      qs(prefix + "State").focus();
      return;
    }
    if (city.length < 3) {
      setAddressStatus(prefix, legendaMmn("legenda_mmn_informe_uma_cidade_com_pelo_menos_3_caracteres"), "error");
      qs(prefix + "City").focus();
      return;
    }
    if (street.length < 3) {
      setAddressStatus(prefix, legendaMmn("legenda_mmn_informe_uma_rua_ou_avenida_com_pelo_menos_3_caracteres"), "error");
      qs(prefix + "Address").focus();
      return;
    }
    setAddressStatus(prefix, legendaMmn("legenda_mmn_procurando_o_cep_do_endereco"), null);
    var url = [
      "https://viacep.com.br/ws",
      encodeURIComponent(uf),
      encodeURIComponent(city),
      encodeURIComponent(street),
      "json/"
    ].join("/");
    try {
      var data = await fetchAddressJson(url);
      if (request !== context.reverseRequest || currentAddressKey(prefix) !== expectedKey) return;
      var unique = {};
      (Array.isArray(data) ? data : []).forEach(function (item) {
        var normalized = normalizeViaCep(item);
        if (normalized.cep.length === 8 && !unique[normalized.cep]) unique[normalized.cep] = normalized;
      });
      var rows = Object.keys(unique).map(function (key) { return unique[key]; });
      var district = normalizeSearchText(qs(prefix + "District").value);
      if (district && rows.length > 1) {
        var districtMatches = rows.filter(function (row) { return normalizeSearchText(row.bairro) === district; });
        if (districtMatches.length) rows = districtMatches;
      }
      if (!rows.length) throw new Error(legendaMmn("legenda_mmn_corrija_o_endereco_ou_digite_um_cep_valido"));
      if (rows.length === 1) {
        fillAddressFromLookup(prefix, rows[0], true);
        setAddressStatus(prefix, legendaMmn("legenda_mmn_cep_encontrado"), "ok");
        return;
      }
      context.reverseResults = rows;
      context.postalCodeConsistent = false;
      updatePostalCodeSearchButton(prefix);
      var select = qs(prefix + "PostalCodeSelect");
      apresentarMmn(select, "innerHTML", function () { return ("<option value=\"\">" + escapeHtml(legendaMmn("legenda_fechamento_mmn_escolher_endereco"))) + rows.length + (escapeHtml(legendaMmn("legenda_fechamento_mmn_enderecos_encontrados")) + "</option>") + rows.map(function (row, index) {
        var label = [formatPostalCode(row.cep), row.logradouro, row.bairro, row.cidade + "/" + row.uf].filter(Boolean).join(" - ");
        return "<option value=\"" + index + "\">" + escapeHtml(label) + "</option>";
      }).join(""); });
      qs(prefix + "PostalCodeResults").hidden = false;
      setAddressStatus(prefix, legendaMmn("legenda_mmn_foram_encontrados_varios_ceps_selecione_o_endereco_correto_para_confirmar"), "warn");
    } catch (error) {
      if (request !== context.reverseRequest || currentAddressKey(prefix) !== expectedKey) return;
      context.postalCodeConsistent = false;
      updatePostalCodeSearchButton(prefix);
      var message = error.message || legendaMmn("legenda_mmn_corrija_o_endereco_ou_digite_um_cep_valido");
      if (automatic && /^Não foi possível/i.test(message)) message = legendaMmn("legenda_mmn_corrija_o_endereco_ou_digite_um_cep_valido");
      setAddressStatus(prefix, message, "error");
    }
  }

  function setupAddressForm(prefix) {
    var context = addressContext(prefix);
    var postalCode = qs(prefix + "PostalCode");
    var stateInput = qs(prefix + "State");
    var cityInput = qs(prefix + "City");
    if (!postalCode || !stateInput || !cityInput) return;

    postalCode.addEventListener("input", function () {
      window.clearTimeout(context.postalCodeTimer);
      window.clearTimeout(context.reversePostalCodeTimer);
      context.reverseRequest += 1;
      context.postalLookupRequest += 1;
      context.postalCodeConsistent = false;
      updatePostalCodeSearchButton(prefix);
      var cep = digitsOnly(postalCode.value).slice(0, 8);
      postalCode.value = formatPostalCode(cep);
      resetReversePostalCodeResults(prefix);
      if (cep.length !== 8) {
        setAddressStatus(prefix, "", null);
        return;
      }
      context.postalCodeTimer = window.setTimeout(function () {
        lookupAddressByPostalCode(prefix, cep, true);
      }, 300);
    });

    stateInput.addEventListener("change", function () {
      context.selectedState = null;
      context.selectedCity = null;
      cityInput.value = "";
      hideAddressOptions(prefix, "city");
      if (!selectTypedAddressState(prefix, true)) {
        cityInput.disabled = true;
        cityInput.placeholder = legendaMmn("legenda_mmn_selecione_o_estado_primeiro");
        markAddressPending(prefix, false);
        return;
      }
      markAddressPending(prefix, false);
    });

    cityInput.addEventListener("focus", function () {
      if (!cityInput.disabled) loadAddressCities(prefix, cityInput.value);
    });
    cityInput.addEventListener("input", function () {
      window.clearTimeout(context.cityTimer);
      context.selectedCity = null;
      context.cityTimer = window.setTimeout(function () { loadAddressCities(prefix, cityInput.value); }, 180);
      markAddressPending(prefix, true, 850);
    });
    cityInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideAddressOptions(prefix, "city");
    });
    cityInput.addEventListener("blur", function () {
      window.setTimeout(function () {
        if (!context.selectedCity) selectTypedAddressCity(prefix);
        hideAddressOptions(prefix, "city");
        markAddressPending(prefix, true, 120);
      }, 140);
    });

    qs(prefix + "Address").addEventListener("input", function () { markAddressPending(prefix, true, 850); });
    qs(prefix + "Address").addEventListener("blur", function () { markAddressPending(prefix, true, 120); });
    qs(prefix + "District").addEventListener("change", function () {
      if (!context.postalCodeConsistent) markAddressPending(prefix, true, 120);
    });

    var stateList = qs(prefix + "StateList");
    if (stateList) {
      stateList.addEventListener("mousedown", function (event) { event.preventDefault(); });
      stateList.addEventListener("click", function (event) {
        var button = event.target.closest("[data-address-index]");
        if (!button) return;
        var selected = context.states[integerValue(button.dataset.addressIndex)];
        if (!selected) return;
        selectAddressState(prefix, selected, false);
        loadAddressCities(prefix, "");
      });
    }
    qs(prefix + "CityList").addEventListener("mousedown", function (event) { event.preventDefault(); });
    qs(prefix + "CityList").addEventListener("click", function (event) {
      var button = event.target.closest("[data-address-index]");
      if (!button) return;
      var selected = context.cities[integerValue(button.dataset.addressIndex)];
      if (selected) {
        selectAddressCity(prefix, selected);
        markAddressPending(prefix, true, 120);
      }
    });
    qs(prefix + "FindPostalCode").addEventListener("click", function () { findPostalCodeByAddress(prefix, false); });
    qs(prefix + "PostalCodeSelect").addEventListener("change", function () {
      var index = integerValue(qs(prefix + "PostalCodeSelect").value, -1);
      var selected = context.reverseResults[index];
      if (!selected) return;
      fillAddressFromLookup(prefix, selected, true);
      resetReversePostalCodeResults(prefix);
      setAddressStatus(prefix, legendaMmn("legenda_mmn_cep_selecionado_com_sucesso"), "ok");
    });
    updatePostalCodeSearchButton(prefix);
  }

  function setupAddressForms() {
    ["enrollment", "profile"].forEach(setupAddressForm);
  }

  function validateAddressForSubmission(prefix, required) {
    var context = addressContext(prefix);
    var cep = digitsOnly(qs(prefix + "PostalCode").value);
    var street = cleanText(qs(prefix + "Address").value);
    var number = cleanText(qs(prefix + "AddressNumber").value);
    var district = cleanText(qs(prefix + "District").value);
    var city = cleanText(qs(prefix + "City").value);
    var uf = cleanText(qs(prefix + "State").value).toUpperCase();
    var hasAddress = !!(cep || street || number || district || city || uf);
    if ((required || cep) && cep.length !== 8) throw new Error(legendaMmn("legenda_mmn_informe_um_cep_valido_com_8_digitos"));
    if ((required || uf) && !/^[A-Z]{2}$/.test(uf)) throw new Error(legendaMmn("legenda_mmn_selecione_uma_uf_valida"));
    if (required && (!street || !number || !district || !city)) throw new Error(legendaMmn("legenda_mmn_complete_o_endereco_para_os_dados_do_rpa"));
    if (!required && hasAddress && city && !uf) throw new Error(legendaMmn("legenda_mmn_selecione_a_uf_do_endereco"));
    if (hasAddress && (!context.postalCodeConsistent || context.resolvedPostalCode !== cep || context.resolvedAddressKey !== currentAddressKey(prefix))) {
      throw new Error(legendaMmn("legenda_mmn_o_cep_e_o_endereco_ainda_nao_foram_confirmados_corrija_o_endereco_selecione"));
    }
    return true;
  }

  function enrollmentCompletionIssue() {
    if (!currentPixIsPersisted("enrollment")) {
      return {
        scope: "pix",
        message: legendaMmn("legenda_mmn_verifique_confira_e_confirme_a_chave_pix_antes_de_concluir_a_adesao"),
        element: qs("enrollmentPixKey")
      };
    }

    var requiredFields = [
      ["enrollmentPostalCode", legendaMmn("legenda_mmn_informe_um_cep_valido_com_8_digitos")],
      ["enrollmentAddress", legendaMmn("legenda_mmn_informe_a_rua_ou_avenida")],
      ["enrollmentAddressNumber", legendaMmn("legenda_mmn_informe_o_numero_do_endereco")],
      ["enrollmentDistrict", legendaMmn("legenda_mmn_informe_o_bairro")],
      ["enrollmentState", legendaMmn("legenda_mmn_selecione_a_uf_do_endereco")],
      ["enrollmentCity", legendaMmn("legenda_mmn_informe_e_selecione_a_cidade")]
    ];
    for (var index = 0; index < requiredFields.length; index += 1) {
      var field = qs(requiredFields[index][0]);
      if (!field || !cleanText(field.value)) {
        return { scope: "form", message: requiredFields[index][1], element: field };
      }
    }
    if (digitsOnly(qs("enrollmentPostalCode").value).length !== 8) {
      return { scope: "form", message: legendaMmn("legenda_mmn_informe_um_cep_valido_com_8_digitos"), element: qs("enrollmentPostalCode") };
    }
    var address = addressContext("enrollment");
    if (!address.postalCodeConsistent ||
        address.resolvedPostalCode !== digitsOnly(qs("enrollmentPostalCode").value) ||
        address.resolvedAddressKey !== currentAddressKey("enrollment")) {
      return {
        scope: "form",
        message: legendaMmn("legenda_mmn_confirme_o_cep_e_o_endereco_antes_de_concluir_a_adesao"),
        element: qs("enrollmentPostalCode")
      };
    }
    if (!qs("enrollmentTerms").checked) {
      return {
        scope: "form",
        message: legendaMmn("legenda_mmn_leia_e_aceite_o_regulamento_vigente_para_concluir_a_adesao"),
        element: qs("enrollmentTerms")
      };
    }
    return null;
  }

  function updateEnrollmentSubmitState() {
    var button = qs("enrollmentSubmit");
    if (!button || button.dataset.busy) return;
    var blocked = !!enrollmentCompletionIssue();
    button.disabled = false;
    button.classList.toggle("is-inactive", blocked);
    button.dataset.inactive = blocked ? "true" : "false";
    button.removeAttribute("aria-disabled");
  }

  function showEnrollmentCompletionIssue(issue) {
    if (!issue) return false;
    if (issue.scope === "pix") setPixWorkflowStatus("enrollment", issue.message, "error");
    else setStatus("enrollmentStatus", issue.message, "error");
    if (issue.element && typeof issue.element.focus === "function") issue.element.focus();
    return true;
  }

  function normalizeCapabilities(context) {
    var result = { acessar: false, suporte: false, configurar: false, fechar: false, pagar: false, financeiro: false, fiscal: false, auditar: false, superadmin: false };
    var profile = objectFrom(context, ["perfil"]);
    var profileKey = String(profile.chave || context.perfil_chave || "").toLowerCase();
    var permissions = context.permissoes_json || context.permissoes || profile.permissoes_json || {};
    var mmn = permissions.mmn || context.mmn || {};
    var areas = listValue(context.areas);
    var superAdmin = profileKey === "super_admin" || booleanValue(context.super_admin, false);
    result.superadmin = superAdmin;
    result.acessar = superAdmin || areas.indexOf("mmn") >= 0 || booleanValue(mmn.acessar, false);
    result.suporte = superAdmin || booleanValue(mmn.suporte, false);
    result.configurar = superAdmin || booleanValue(mmn.configurar, false);
    result.fechar = superAdmin || booleanValue(mmn.fechar, false);
    result.pagar = superAdmin || booleanValue(mmn.pagar, false);
    result.financeiro = superAdmin || booleanValue(mmn.financeiro, false);
    result.fiscal = superAdmin || booleanValue(mmn.fiscal, false) || result.financeiro;
    result.auditar = superAdmin || booleanValue(mmn.auditar, false);
    return result;
  }

  function hasCapability(name) {
    return !!state.capabilities[name];
  }

  function applyAdminCapabilities() {
    qsa("[data-capability]").forEach(function (element) {
      element.hidden = !hasCapability(element.getAttribute("data-capability"));
    });
    qsa("[data-capability-any]").forEach(function (element) {
      var names = String(element.getAttribute("data-capability-any") || "").split(/\s+/).filter(Boolean);
      element.hidden = !names.some(hasCapability);
    });
    var active = document.querySelector("[data-admin-tab].is-active:not([hidden])");
    if (!active) {
      var first = document.querySelector("[data-admin-tab]:not([hidden])");
      if (first) activateAdminTab(first.getAttribute("data-admin-tab"));
    }
  }

  function userParticipation(data) {
    return objectFrom(data, ["participacao_mmn", "participacao", "adesao", "elegibilidade", "participante", "usuario_mmn"]);
  }

  function userProfile(data) {
    var profile = objectFrom(data, ["perfil_pagamento", "dados_pagamento", "rpa"]);
    return Object.assign({}, objectFrom(profile, ["dados_rpa"]), profile);
  }

  function normalizeAddressProfile(raw) {
    var source = raw || {};
    return {
      cep: firstDefined([source.cep, source.codigo_postal, source.postal_code], ""),
      logradouro: firstDefined([source.logradouro, source.endereco, source.rua, source.address], ""),
      numero: firstDefined([source.numero, source.numero_endereco, source.address_number], ""),
      complemento: firstDefined([source.complemento, source.address_extra], ""),
      bairro: firstDefined([source.bairro, source.distrito, source.neighborhood], ""),
      cidade: firstDefined([source.cidade, source.cidade_nome, source.localidade, source.city], ""),
      uf: firstDefined([source.uf, source.estado_uf, source.estado, source.state], ""),
      cod_estado: firstDefined([source.cod_estado, source.id_estado], null),
      cod_cidade: firstDefined([source.cod_cidade, source.id_cidade], null),
      cidade_ibge: firstDefined([source.cidade_ibge, source.ibge, source.codigo_ibge], "")
    };
  }

  function addressSuggestionFromDashboard(data) {
    var user = objectFrom(data, ["usuario"]);
    var sessionUser = state.session && state.session.user ? state.session.user : {};
    var candidates = [
      objectFrom(data, ["endereco_sugerido", "endereco_app", "endereco_usuario", "localizacao"]),
      state.session && state.session.endereco_sugerido ? state.session.endereco_sugerido : {},
      objectFrom(user, ["endereco", "localizacao"]),
      user,
      objectFrom(sessionUser, ["endereco", "localizacao"]),
      sessionUser
    ];
    var result = {};
    candidates.forEach(function (candidate) {
      var normalized = normalizeAddressProfile(candidate);
      Object.keys(normalized).forEach(function (key) {
        if ((result[key] === undefined || result[key] === null || result[key] === "") && normalized[key] !== undefined && normalized[key] !== null && normalized[key] !== "") {
          result[key] = normalized[key];
        }
      });
    });
    return result;
  }

  function mergeProfileAddress(profile, suggestion) {
    var result = Object.assign({}, suggestion || {}, profile || {});
    var stored = normalizeAddressProfile(profile);
    var suggested = normalizeAddressProfile(suggestion);
    Object.keys(stored).forEach(function (key) {
      result[key] = stored[key] !== undefined && stored[key] !== null && stored[key] !== "" ? stored[key] : suggested[key];
    });
    return result;
  }

  function renderEnrollment(data) {
    var participation = userParticipation(data);
    var eligibility = objectFrom(data, ["elegibilidade"]);
    var regulation = objectFrom(data, ["regulamento", "termos"]);
    var accepted = booleanValue(firstDefined([
      regulation.aceito,
      participation.aceite_vigente,
      participation.regulamento_aceito,
      eligibility.regulamento_aceito,
      participation.aderiu,
      participation.adesao_ativa,
      data.adesao_concluida,
      cleanText(participation.status).toLowerCase() === "participando"
    ], false), false);
    if (participation.status === "saida_voluntaria") accepted = false;
    qs("userEnrollment").hidden = accepted;
    qs("userDashboard").hidden = !accepted;
    if (accepted) return;
    var summaries = listFrom(regulation, ["resumo", "itens"]);
    if (!summaries.length && typeof regulation.resumo === "string" && regulation.resumo.trim()) summaries = [regulation.resumo];
    if (!summaries.length) {
      summaries = [
        legendaMmn("legenda_mmn_a_comissao_considera_somente_assinaturas_efetivamente_pagas"),
        legendaMmn("legenda_mmn_e_necessario_estar_elegivel_na_data_da_receita_e_no_fechamento"),
        legendaMmn("legenda_mmn_simulacoes_nao_representam_garantia_de_renda")
      ];
    }
    qs("enrollmentRuleSummary").innerHTML = summaries.map(function (item) {
      return "<div>" + escapeHtml(typeof item === "string" ? item : (item.texto || item.descricao || "")) + "</div>";
    }).join("");
    var regulationUrl = regulation.url || regulation.url_documento || "";
    var regulationVersion = regulation.versao || regulation.documento_versao || "";
    if (!regulationUrl && regulationVersion) regulationUrl = "../../regulamento-mmn.html?versao=" + encodeURIComponent(regulationVersion);
    if (regulationUrl) qs("regulationLink").href = regulationUrl;
    var profile = mergeProfileAddress(userProfile(data), addressSuggestionFromDashboard(data));
    fillUserProfileFields(profile, "enrollment");
  }

  function fillUserProfileFields(profile, prefix) {
    var context = addressContext(prefix);
    var rawState = firstDefined([profile.uf, profile.estado_uf, profile.estado, profile.state], "");
    var staticState = findStaticAddressState(prefix, rawState);
    var map = {
      PixType: normalizePixType(profile.pix_tipo || profile.tipo || profile.tipo_chave_pix) || "cpf",
      PixKey: prefix === "profile" && profile.pix_mascarado ? "" : (profile.pix_chave || profile.chave_pix || ""),
      PostalCode: formatPostalCode(profile.cep || ""),
      Address: profile.logradouro || profile.endereco || "",
      AddressNumber: profile.numero || "",
      AddressExtra: profile.complemento || "",
      District: profile.bairro || "",
      City: profile.cidade || profile.cidade_nome || "",
      State: staticState ? staticState.uf : cleanText(rawState).toUpperCase(),
      Nit: profile.nit || profile.pis_pasep || ""
    };
    Object.keys(map).forEach(function (suffix) {
      var element = qs(prefix + suffix);
      if (element) element.value = map[suffix] == null ? "" : map[suffix];
    });
    if (prefix === "profile") {
      apresentarTextoMmn("profilePixMasked",function(){return profile.pix_mascarado ? legendaMmn("legenda_mmn_chave_atual") + profile.pix_mascarado : legendaMmn("legenda_mmn_nenhuma_chave_cadastrada");});
    }
    initializePixValidation(prefix, profile);
    var uf = cleanText(map.State).toUpperCase();
    var city = cleanText(map.City);
    context.selectedState = /^[A-Z]{2}$/.test(uf) ? normalizeStateRow({
      cod_estado: firstDefined([profile.cod_estado, profile.id_estado], null),
      uf: uf,
      nome: profile.estado_nome || (staticState && staticState.nome) || uf
    }) : null;
    context.selectedCity = city ? normalizeCityRow({
      cod_cidade: firstDefined([profile.cod_cidade, profile.id_cidade], null),
      cod_estado: firstDefined([profile.cod_estado, profile.id_estado], null),
      ibge: firstDefined([profile.cidade_ibge, profile.ibge], ""),
      uf: uf,
      nome: city
    }, uf) : null;
    var cityInput = qs(prefix + "City");
    if (cityInput) {
      cityInput.disabled = !context.selectedState;
      cityInput.placeholder = context.selectedState ? legendaMmn("legenda_mmn_digite_e_selecione_a_cidade") : legendaMmn("legenda_mmn_selecione_o_estado_primeiro");
    }
    var expectedState = cleanText(map.State);
    var expectedCity = cleanText(map.City);
    if (digitsOnly(map.PostalCode).length === 8 && addressHasReverseLookupKey(prefix)) markAddressResolved(prefix);
    else if (digitsOnly(map.PostalCode).length === 8) lookupAddressByPostalCode(prefix, digitsOnly(map.PostalCode), false);
    if (expectedState) {
      loadAddressStates(prefix, expectedState, false).then(function () {
        if (cleanText(qs(prefix + "State").value) !== expectedState || cleanText(qs(prefix + "City").value) !== expectedCity) return null;
        var search = normalizeSearchText(expectedState);
        var matchedState = context.states.find(function (row) {
          return normalizeSearchText(row.uf) === search || normalizeSearchText(row.nome) === search;
        }) || null;
        if (!matchedState) return null;
        selectAddressState(prefix, matchedState, true);
        return loadAddressCities(prefix, expectedCity, false);
      }).then(function () {
        if (expectedCity && cleanText(qs(prefix + "City").value) === expectedCity) selectTypedAddressCity(prefix);
        if (digitsOnly(qs(prefix + "PostalCode").value).length === 8 && addressHasReverseLookupKey(prefix)) markAddressResolved(prefix);
        hideAddressOptions(prefix, "state");
        hideAddressOptions(prefix, "city");
      }).catch(function () {});
    }
  }

  function renderUserHero(data) {
    var user = objectFrom(data, ["usuario", "participante"]);
    var participation = objectFrom(data, ["participante"]);
    var eligibility = objectFrom(data, ["elegibilidade"]);
    var qualification = objectFrom(data, ["qualificacao_atual", "qualificacao", "rank"]);
    var fullName = user.nomeuser || user.nome_exibicao || user.nome || user.codinome || user.loginuser || user.login || (state.session && state.session.user && (state.session.user.name || state.session.user.email)) || "participante";
    var firstName = cleanText(fullName).split(/\s+/)[0] || "participante";
    firstName = firstName.slice(0, 1).toLocaleUpperCase("pt-BR") + firstName.slice(1).toLocaleLowerCase("pt-BR");
    apresentarTextoMmn("userGreeting",function(){return legendaMmn("legenda_mmn_ola") + firstName + legendaMmn("legenda_mmn_complemento_acompanhe_sua_jornada");});
    apresentarTextoMmn("userHeroText",function(){return legendaMmn("legenda_mmn_indicacoes_qualificacoes_e_valores");});
    var eligible = booleanValue(firstDefined([eligibility.elegivel_receber, eligibility.elegivel, data.elegivel], false), false);
    var status = qs("userEligibility");
    var reasons = listValue(eligibility.motivos);
    apresentarMmn(status,"textContent",function(){return eligible ? legendaMmn("legenda_mmn_elegivel_nesta_competencia") : (reasons.length ? reasons.map(function (reason) {
      return String(reason).replace(/_/g, " ");
    }).join("\n") : String(participation.status || legendaMmn("legenda_mmn_inelegivel_nesta_competencia")).replace(/_/g, " "));});
    status.className = "mmn-status " + (eligible ? "is-ok" : "is-warn");
    apresentarTextoMmn("userRank",function(){return legendaMmn("legenda_mmn_rotulo_rank") + (qualification.rank_financeiro || qualification.rank_atual_nome || qualification.rank_nome || user.rank || legendaMmn("legenda_mmn_rotulo_base"));});
    var invite = objectFrom(data, ["convite"]);
    state.user.inviteUrl = invite.url || data.convite_link || "";
  }

  function renderUserBalances(data) {
    var balances = objectFrom(data, ["saldo", "saldos", "resumo_financeiro", "resumo"]);
    setText("userBalanceEstimated", formatMoneyCents(centsFrom(balances, ["em_apuracao_centavos", "estimado_centavos", "pendente_centavos"])));
    setText("userBalanceConfirmed", formatMoneyCents(centsFrom(balances, ["confirmado_centavos"])));
    setText("userBalanceAvailable", formatMoneyCents(centsFrom(balances, ["disponivel_centavos", "liberado_centavos"])));
    setText("userBalancePaid", formatMoneyCents(centsFrom(balances, ["pago_centavos", "total_pago_centavos"])));
  }

  function renderUserQualification(data) {
    var qualification = objectFrom(data, ["qualificacao_atual", "qualificacao", "rank"]);
    var network = objectFrom(data, ["rede_resumo", "rede"]);
    var rules = objectFrom(data, ["regras", "configuracao_publica"]);
    var ranks = listFrom(rules, ["ranks"]);
    var currentRank = qualification.rank_financeiro || qualification.rank_atual_nome || qualification.rank_nome || legendaMmn("legenda_mmn_rotulo_base");
    var current = firstDefined([qualification.rede_ativa, qualification.rede_ativos, network.rede_ativos], 0);
    var nextRankRow = ranks.filter(function (rank) { return numberValue(rank.min_rede_ativa || rank.min_ativos_rede) > numberValue(current); })
      .sort(function (a, b) { return numberValue(a.min_rede_ativa || a.min_ativos_rede) - numberValue(b.min_rede_ativa || b.min_ativos_rede); })[0] || null;
    var nextRank = qualification.proximo_rank_nome || (nextRankRow && nextRankRow.nome) || legendaMmn("legenda_mmn_maior_rank_alcancado");
    var target = firstDefined([qualification.proximo_rank_min_ativos, qualification.meta_ativos, nextRankRow && (nextRankRow.min_rede_ativa || nextRankRow.min_ativos_rede)], numberValue(current) > 0 ? current : 1000);
    var progress = firstDefined([qualification.progresso_percentual], target > 0 ? (numberValue(current) / numberValue(target) * 100) : 100);
    setText("userCurrentRank", currentRank);
    apresentarTextoMmn("userRankCriteria",function(){return legendaMmn("legenda_mmn_os_criterios_sao_avaliados_a_cada_competencia");});
    setText("userNextRank", nextRank);
    qs("userRankProgressBar").style.width = Math.max(0, Math.min(100, numberValue(progress))) + "%";
    apresentarTextoMmn("userRankProgressCurrent",function(){return formatInteger(current) + legendaMmn("legenda_mmn_complemento_ativos");});
    apresentarTextoMmn("userRankProgressTarget",function(){return target > current ? formatInteger(target) + legendaMmn("legenda_mmn_necessarios") : legendaMmn("legenda_mmn_objetivo_alcancado");});
    var requirements = listFrom(qualification, ["requisitos", "criterios"]);
    if (!requirements.length) {
      var directActive = numberValue(firstDefined([qualification.diretos_ativos, network.diretos_ativos], 0));
      var directTarget = numberValue(firstDefined([nextRankRow && nextRankRow.min_diretos_ativos], 3));
      var largestLeg = numberValue(firstDefined([qualification.percentual_maior_perna, network.percentual_maior_perna], 0));
      var largestLegLimit = numberValue(firstDefined([nextRankRow && nextRankRow.max_percentual_maior_perna], 100));
      requirements = [
        { nome: legendaMmn("legenda_mmn_rede_ativa") + formatInteger(current) + legendaMmn("legenda_mmn_complemento_de") + formatInteger(target), ok: numberValue(current) >= numberValue(target) },
        { nome: legendaMmn("legenda_mmn_diretos_ativos") + formatInteger(directActive) + legendaMmn("legenda_mmn_complemento_de") + formatInteger(directTarget), ok: directActive >= directTarget },
        { nome: legendaMmn("legenda_mmn_maior_perna") + formatPercent(largestLeg) + legendaMmn("legenda_mmn_maximo") + formatPercent(largestLegLimit) + ")", ok: largestLeg <= largestLegLimit }
      ];
    }
    apresentarMmn(qs("userQualificationChecklist"),"innerHTML",function(){return requirements.length ? requirements.map(function (item) {
      var ok = booleanValue(item.atendido || item.ok, false);
      return "<div class=\"mmn-check-item " + (ok ? "is-ok" : "") + "\"><span>" + escapeHtml(item.nome || item.titulo || item.descricao || legendaMmn("legenda_mmn_criterio")) + "</span></div>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_os_criterios_da_competencia_ainda_nao_foram_publicados"));});
    setText("userDirectActive", formatInteger(firstDefined([qualification.diretos_ativos, network.diretos_ativos], 0)));
    setText("userNetworkActive", formatInteger(firstDefined([qualification.rede_ativa, qualification.rede_ativos, network.rede_ativos], 0)));
    setText("userPeriod", qualification.competencia || data.competencia || data.periodo || "—");
  }

  function renderMonthlyChart(data) {
    var rows = listFrom(data, ["historico_mensal", "evolucao_mensal", "evolucao"]);
    var container = qs("userMonthlyChart");
    if (!rows.length) {
      apresentarMmn(container,"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_ainda_nao_ha_competencias_reconhecidas_para_exibir"));});
      return;
    }
    var max = Math.max.apply(null, rows.map(function (row) {
      return Math.max(numberValue(centsFrom(row, ["valor_centavos", "total_centavos", "creditos_centavos"])) - numberValue(row.debitos_centavos), 0);
    }).concat([1]));
    container.innerHTML = rows.map(function (row) {
      var value = Math.max(numberValue(centsFrom(row, ["valor_centavos", "total_centavos", "creditos_centavos"])) - numberValue(row.debitos_centavos), 0);
      var height = Math.max(2, value / max * 100);
      return "<div class=\"mmn-chart-column\"><strong title=\"" + escapeHtml(formatMoneyCents(value)) + "\">" + escapeHtml(formatMoneyCents(value)) + "</strong><div class=\"mmn-chart-bar-wrap\"><span class=\"mmn-chart-bar\" style=\"height:" + height + "%\"></span></div><span>" + escapeHtml(row.competencia || row.periodo || "") + "</span></div>";
    }).join("");
  }

  function realEvolutionSourceRows() {
    if (state.user.evolution.rows.length) return state.user.evolution.rows;
    var dashboard = state.user.dashboard || {};
    var embedded = listFrom(dashboard, ["evolucao_rede"]);
    if (embedded.length) return embedded;
    return listFrom(objectFrom(dashboard, ["evolucao_rede"]), ["itens"]);
  }

  function userEvolutionRows() {
    var sourceRows = realEvolutionSourceRows();
    if (!sourceRows.length) sourceRows = listFrom(state.user.dashboard || {}, ["historico_mensal", "evolucao_mensal", "evolucao"]);
    return sourceRows.map(function (row) {
      var active = firstDefined([
        row.rede_ativa,
        row.rede_ativos,
        row.ativos_rede,
        row.total_rede_ativa,
        row.usuarios_ativos
      ], null);
      return {
        competencia: cleanText(row.competencia || row.periodo || row.mes),
        ativos: active,
        diretos: firstDefined([row.diretos_ativos, row.total_diretos_ativos], null),
        rank: cleanText(row.rank_nome || row.rank || row.qualificacao_nome)
      };
    }).filter(function (row) {
      return row.competencia && row.ativos !== null && row.ativos !== "";
    });
  }

  function renderEvolutionChart() {
    if (state.user.evolution.loading) {
      apresentarMmn(qs("evolutionChartContent"),"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_carregando_a_evolucao_real_da_sua_rede"));});
      return;
    }
    var rows = userEvolutionRows();
    if (!rows.length) {
      apresentarMmn(qs("evolutionChartContent"),"innerHTML",function(){return emptyHtml(state.user.evolution.error || legendaMmn("legenda_mmn_ainda_nao_ha_competencias_com_totais_da_rede_suficientes_para_montar_o_grafico"));});
      return;
    }
    var max = Math.max.apply(null, rows.map(function (row) { return numberValue(row.ativos); }).concat([1]));
    apresentarMmn(qs("evolutionChartContent"),"innerHTML",function(){return "<div class=\"mmn-evolution-chart\">" + rows.map(function (row) {
      var value = Math.max(0, numberValue(row.ativos));
      var height = Math.max(3, value / max * 100);
      var details = [row.rank, row.diretos !== null && row.diretos !== "" ? formatInteger(row.diretos) + legendaMmn("legenda_mmn_complemento_diretos") : ""].filter(Boolean).join(" · ");
      return "<article class=\"mmn-evolution-column\"><strong>" + escapeHtml(formatInteger(value)) + "</strong><div class=\"mmn-evolution-bar-wrap\"><span style=\"height:" + height + "%\"></span></div><small>" + escapeHtml(row.competencia.slice(0, 7)) + "</small>" + (details ? "<em title=\"" + escapeHtml(details) + "\">" + escapeHtml(details) + "</em>" : "") + "</article>";
    }).join("") + "</div><p class=\"mmn-evolution-note" + (state.user.evolution.error ? " is-error" : "") + "\">" + escapeHtml(state.user.evolution.error || legendaMmn("legenda_mmn_o_grafico_usa_somente_os_totais_reais_de_rede_retornados_em_cada_competencia")) + "</p>";});
  }

  async function openEvolutionChart() {
    qs("evolutionChartOverlay").hidden = false;
    syncPageScrollLock();
    if (!realEvolutionSourceRows().length && !state.user.evolution.loaded && !state.user.evolution.loading) {
      state.user.evolution.loading = true;
      state.user.evolution.error = "";
      renderEvolutionChart();
      try {
        var response = await rpc(CONFIG.rpcs.userEvolution, {});
        var payload = objectFrom(response, ["dados", "resultado"]);
        if (!Object.keys(payload).length) payload = response || {};
        state.user.evolution.rows = listFrom(payload, ["itens", "evolucao_rede", "evolucao"]);
      } catch (error) {
        state.user.evolution.error = legendaMmn("legenda_mmn_nao_foi_possivel_atualizar_a_evolucao_da_rede_agora");
      } finally {
        state.user.evolution.loading = false;
        state.user.evolution.loaded = true;
      }
    }
    renderEvolutionChart();
  }

  function closeEvolutionChart() {
    qs("evolutionChartOverlay").hidden = true;
    syncPageScrollLock();
  }

  function renderUserNotifications(data) {
    var events = listFrom(data, ["eventos"]);
    var container = qs("userNotificationList");
    apresentarMmn(container,"innerHTML",function(){return events.length ? events.map(function (event) {
      var readAction = event.lido_em ? "" : "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-user-event-read=\"" + escapeHtml(event.id || event.cod_mmn_evento) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_marcar_como_lida")) + "</button>");
      return "<article class=\"mmn-notification-item " + (event.lido_em ? "" : "is-unread") + "\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(event.titulo || event.tipo || legendaMmn("legenda_mmn_atualizacao")) + "</strong><span>" + escapeHtml(event.mensagem || "") + "</span></div><div class=\"mmn-notification-meta\"><time datetime=\"" + escapeHtml(event.criado_em || "") + "\">" + escapeHtml(formatDate(event.criado_em, true)) + "</time>" + readAction + "</div></article>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_nenhuma_notificacao_disponivel"));});
  }

  function bonusesFromEvolution(data) {
    var rows = listFrom(data, ["evolucao_mensal", "historico_mensal"]);
    var result = [];
    rows.forEach(function (row) {
      var competence = String(row.competencia || row.periodo || "").slice(0, 7);
      var rankValue = numberValue(row.bonus_rank_centavos);
      var poolValue = numberValue(row.pool_centavos);
      if (rankValue > 0) result.push({ nome: legendaMmn("legenda_mmn_bonus_de_lideranca"), tipo: "bonus_rank", competencia: competence, valor_centavos: rankValue, status: "confirmado" });
      if (poolValue > 0) result.push({ nome: legendaMmn("legenda_mmn_pool_global"), tipo: "pool_global", competencia: competence, valor_centavos: poolValue, status: "confirmado" });
    });
    return result;
  }

  function renderUserDashboard(data) {
    renderUserHero(data);
    renderEnrollment(data);
    if (qs("userDashboard").hidden) return;
    renderUserBalances(data);
    renderUserQualification(data);
    renderMonthlyChart(data);
    renderUserNotifications(data);
    fillUserProfileFields(mergeProfileAddress(userProfile(data), addressSuggestionFromDashboard(data)), "profile");
    var network = objectFrom(data, ["rede_resumo", "rede"]);
    var publicConfig = objectFrom(data, ["regras", "configuracao_publica"]);
    var dashboardLevels = listFrom(data, ["niveis"]);
    if (!dashboardLevels.length) dashboardLevels = listFrom(network, ["por_nivel", "niveis", "total_por_nivel"]);
    var ruleLevels = listFrom(publicConfig, ["niveis"]);
    dashboardLevels = dashboardLevels.map(function (level) {
      var rule = ruleLevels.find(function (item) { return String(item.nivel) === String(level.nivel); }) || {};
      return Object.assign({}, rule, level);
    });
    if (dashboardLevels.length || Array.isArray(network.diretos) || Object.keys(network).length) {
      renderUserNetwork(Object.assign({}, network, {
        niveis: dashboardLevels,
        diretos: network.diretos || [],
        regras: publicConfig,
        patrocinio: objectFrom(data, ["patrocinio", "arvore_patrocinio"]),
        posicionamento: objectFrom(data, ["posicionamento", "arvore_posicionamento", "posicao"]),
        participante: objectFrom(data, ["participante", "usuario_mmn"])
      }), false);
    }
    var ranks = listFrom(data, ["ranks"]);
    if (!ranks.length) ranks = listFrom(publicConfig, ["ranks"]);
    var bonuses = listFrom(data, ["bonificacoes", "bonus"]);
    if (!bonuses.length) bonuses = bonusesFromEvolution(data);
    if (ranks.length || bonuses.length) renderUserBonuses({ ranks: ranks, bonificacoes: bonuses, qualificacao: objectFrom(data, ["qualificacao_atual", "qualificacao"]), extrato: listFrom(data, ["extrato"]) });
  }

  function configuredNetworkParameters(data) {
    var source = data || {};
    var direct = objectFrom(source, ["parametros"]);
    var rules = objectFrom(source, ["regras", "configuracao_publica", "configuracao"]);
    var nested = objectFrom(rules, ["parametros"]);
    var dashboard = state.user.dashboard || {};
    var dashboardRules = objectFrom(dashboard, ["regras", "configuracao_publica"]);
    var dashboardParameters = objectFrom(dashboardRules, ["parametros"]);
    return Object.assign({}, dashboardRules, dashboardParameters, rules, nested, direct);
  }

  function configuredNetworkDepth(data) {
    return Math.max(1, Math.min(10, integerValue(firstDefined([
      configuredNetworkParameters(data).quantidade_niveis,
      data && data.quantidade_niveis
    ], 6), 6)));
  }

  function configuredPlacementWidth(data) {
    return Math.max(0, integerValue(firstDefined([
      configuredNetworkParameters(data).largura_maxima_posicionamento,
      data && data.largura_maxima_posicionamento
    ], 0), 0));
  }

  function relationPersonLabel(person, fallback) {
    if (person == null || person === "") return fallback || legendaMmn("legenda_mmn_rotulo_raiz");
    if (typeof person !== "object") return legendaMmn("legenda_mmn_usuario");
    return cleanText(firstDefined([
      person.loginuser, person.usuario_login, person.login_user, person.login,
      person.codinome, person.nome
    ], "")) || fallback || legendaMmn("legenda_mmn_usuario");
  }

  function renderUserGenealogy(data) {
    var participant = objectFrom(data, ["participante", "usuario_mmn"]);
    var sponsorship = objectFrom(data, ["patrocinio", "arvore_patrocinio"]);
    var placement = objectFrom(data, ["posicionamento", "arvore_posicionamento", "posicao"]);
    var sponsor = objectFrom(sponsorship, ["patrocinador", "pai"]);
    var parent = objectFrom(placement, ["pai", "pai_posicionamento"]);
    var sponsorId = firstDefined([sponsor.usuario_id, sponsor.id_usuario, sponsor.cod_usuario, sponsor.id, sponsorship.patrocinador_id, participant.patrocinador_id, data.patrocinador_id], null);
    var parentId = firstDefined([parent.usuario_id, parent.id_usuario, parent.cod_usuario, parent.id, placement.pai_posicionamento_id, participant.pai_posicionamento_id, data.pai_posicionamento_id], null);
    var slot = firstDefined([placement.slot_posicionamento, placement.slot, participant.slot_posicionamento, data.slot_posicionamento], null);
    var width = Math.max(0, integerValue(firstDefined([placement.largura_aplicada, configuredPlacementWidth(data)], 0), 0));
    var spillover = booleanValue(firstDefined([placement.spillover, placement.foi_spillover, participant.foi_spillover, data.foi_spillover], sponsorId != null && parentId != null && String(sponsorId) !== String(parentId)), false);
    var sponsorLogin = cleanText(firstDefined([sponsor.loginuser, sponsorship.patrocinador_loginuser, placement.patrocinador_loginuser, participant.patrocinador_loginuser, data.patrocinador_loginuser], ""));
    var parentLogin = cleanText(firstDefined([parent.loginuser, placement.pai_posicionamento_loginuser, participant.pai_posicionamento_loginuser, data.pai_posicionamento_loginuser], ""));
    apresentarTextoMmn("userSponsorRelation",function(){return sponsorLogin || (Object.keys(sponsor).length ? relationPersonLabel(sponsor, legendaMmn("legenda_mmn_rotulo_raiz")) : relationPersonLabel(sponsorId, legendaMmn("legenda_mmn_rotulo_raiz")));});
    apresentarTextoMmn("userPlacementParent",function(){return parentLogin || (Object.keys(parent).length ? relationPersonLabel(parent, legendaMmn("legenda_mmn_raiz_estrutural")) : relationPersonLabel(parentId, legendaMmn("legenda_mmn_raiz_estrutural")));});
    apresentarTextoMmn("userPlacementSlot",function(){return slot == null || slot === "" ? legendaMmn("legenda_mmn_sem_vaga_atribuida") : "#" + slot;});
    apresentarTextoMmn("userPlacementWidth",function(){return width === 0 ? legendaMmn("legenda_mmn_rotulo_ilimitada") : formatInteger(width) + legendaMmn("legenda_mmn_complemento_vagas_por_participante");});
    apresentarTextoMmn("userPlacementSpillover",function(){return width === 0 ? legendaMmn("legenda_mmn_sem_limite_horizontal_de_posicionamento") : (spillover ? legendaMmn("legenda_mmn_posicionado_por_spillover_seu_patrocinador_permanece_o_mesmo") : legendaMmn("legenda_mmn_posicionamento_direto_sem_spillover_nesta_entrada"));});
    var genealogyRule = qs("userGenealogyRule");
    if (genealogyRule) {
      genealogyRule.hidden = width === 0;
      apresentarMmn(genealogyRule,"textContent",function(){return legendaMmn("legenda_mmn_com_a_largura_limitada_indicacoes_alem_das_vagas_diretas_entram_por_spillover_a");});
    }
  }

  function networkPersonId(person) {
    return firstNonEmptyText([
      person && person.usuario_id,
      person && person.id_usuario,
      person && person.id_participante,
      person && person.id
    ], "");
  }

  function networkPersonSponsorId(person) {
    return firstNonEmptyText([
      person && person.patrocinador_id,
      person && person.id_patrocinador,
      person && person.sponsor_id,
      person && person.indicador_id
    ], "");
  }

  function networkPersonPosition(person) {
    var value = firstDefined([
      person && person.posicao_indicacao,
      person && person.ordem_indicacao,
      person && person.numero_posicao_indicacao,
      person && person.vaga_indicacao,
      person && person.posicao_direta,
      person && person.ordem_direta
    ], null);
    if (value === null || value === "") return null;
    var position = integerValue(value, 0);
    return position > 0 ? position : null;
  }

  function networkPersonRegistrationDate(person) {
    return networkPersonRegistrationInfo(person).value;
  }

  function networkPersonRegistrationInfo(person) {
    var appRegistration = firstNonEmptyText([
      person && person.cadastrado_app_em,
      person && person.cadastro_app_em,
      person && person.usuario_cadastrado_em,
      person && person.data_cadastro_app
    ], "");
    if (appRegistration) return { value: appRegistration, source: "app" };
    var referralLink = firstNonEmptyText([person && person.vinculado_indicacao_em], "");
    return { value: referralLink, source: referralLink ? "vinculo" : "" };
  }

  function networkPersonPlacementSlot(person) {
    var value = firstDefined([
      person && person.slot_posicionamento,
      person && person.vaga_posicionamento,
      person && person.posicao_estrutural
    ], null);
    if (value === null || value === "") return null;
    var slot = integerValue(value, 0);
    return slot > 0 ? slot : null;
  }

  function networkPersonPlacementParentId(person) {
    return firstNonEmptyText([
      person && person.pai_posicionamento_id,
      person && person.id_pai_posicionamento,
      person && person.placement_parent_id
    ], "");
  }

  function networkPersonFullName(person) {
    var composed = cleanText([person && person.nomeuser, person && person.sobrenome].filter(Boolean).join(" "));
    return firstNonEmptyText([
      person && person.nome_completo,
      person && person.usuario_nome_completo,
      composed,
      person && person.nome
    ], "");
  }

  function networkPersonLogin(person) {
    return firstNonEmptyText([
      person && person.loginuser,
      person && person.usuario_loginuser,
      person && person.usuario_login,
      person && person.login,
      person && person.codinome
    ], "");
  }

  function networkPersonActive(person) {
    var explicit = firstDefined([
      person && person.ativo,
      person && person.rede_ativo,
      person && person.usuario_ativo,
      person && person.assinatura_ativa,
      person && person.mmn_ativo,
      person && person.elegivel_fechamento
    ], null);
    if (explicit !== null) return booleanValue(explicit, false);
    var status = cleanText(person && (person.status || person.situacao)).toLowerCase();
    return ["ativo", "elegivel", "confirmado", "premium_ativo"].indexOf(status) >= 0;
  }

  function networkPersonDisplayName(person, directFromRoot) {
    if (directFromRoot) return networkPersonFullName(person) || networkPersonLogin(person) || legendaMmn("legenda_mmn_rotulo_indicado");
    return networkPersonLogin(person) || legendaMmn("legenda_mmn_usuario");
  }

  function normalizeNetworkRows(data, directs) {
    var sponsorship = objectFrom(data, ["arvore_patrocinio", "patrocinio_detalhado", "genealogia_patrocinio"]);
    var candidates = [];
    [
      listFrom(data, ["rede_patrocinio", "indicados_rede", "descendentes", "rede_detalhada", "participantes_rede"]),
      listFrom(sponsorship, ["rede", "descendentes", "participantes", "itens"]),
      listFrom(data, ["rede"]),
      directs
    ].forEach(function (rows) {
      listValue(rows).forEach(function (row) {
        if (row && typeof row === "object" && networkPersonId(row)) candidates.push(row);
      });
    });
    var rootId = firstNonEmptyText([
      data.raiz_usuario_id,
      data.no_usuario_id,
      data.usuario_id,
      data.id_usuario,
      objectFrom(data, ["usuario"]).usuario_id,
      objectFrom(data, ["usuario"]).id_usuario,
      objectFrom(data, ["participante", "usuario_mmn"]).usuario_id,
      objectFrom(data, ["participante", "usuario_mmn"]).id_usuario,
      objectFrom(state.user.dashboard || {}, ["usuario"]).usuario_id,
      objectFrom(state.user.dashboard || {}, ["usuario"]).id_usuario,
      objectFrom(state.user.dashboard || {}, ["participante"]).usuario_id,
      objectFrom(state.user.dashboard || {}, ["participante"]).id_usuario,
      networkPersonSponsorId(listValue(directs)[0])
    ], "");
    var directIds = {};
    listValue(directs).forEach(function (person) {
      var id = networkPersonId(person);
      if (id) directIds[id] = true;
    });
    var byId = {};
    candidates.forEach(function (person) {
      var id = networkPersonId(person);
      var normalized = Object.assign({}, byId[id] || {}, person);
      if (directIds[id]) {
        normalized.nivel_patrocinio = 1;
        if (!networkPersonSponsorId(normalized) && rootId) normalized.patrocinador_id = rootId;
      }
      byId[id] = normalized;
    });
    var rows = Object.keys(byId).map(function (id) { return byId[id]; });
    var directRows = Object.keys(directIds).map(function (id) { return byId[id]; }).filter(Boolean);
    if (!directRows.length && rootId) {
      directRows = rows.filter(function (person) { return networkPersonSponsorId(person) === rootId; });
    }
    function sortRows(left, right) {
      var leftPosition = networkPersonPosition(left);
      var rightPosition = networkPersonPosition(right);
      if (leftPosition != null && rightPosition != null && leftPosition !== rightPosition) return leftPosition - rightPosition;
      var leftDate = new Date(networkPersonRegistrationDate(left) || 0).getTime();
      var rightDate = new Date(networkPersonRegistrationDate(right) || 0).getTime();
      if (leftDate !== rightDate) return leftDate - rightDate;
      return networkPersonId(left).localeCompare(networkPersonId(right), "pt-BR", { numeric: true });
    }
    rows.sort(sortRows);
    directRows.sort(sortRows);
    return { rootId: rootId, rows: rows, directs: directRows };
  }

  function storeUserNetwork(data, directs) {
    var normalized = normalizeNetworkRows(data, directs);
    if (normalized.rootId) state.user.network.rootId = normalized.rootId;
    var rowsById = {};
    state.user.network.rows.concat(normalized.rows).forEach(function (person) {
      var id = networkPersonId(person);
      if (id) rowsById[id] = Object.assign({}, rowsById[id] || {}, person);
    });
    state.user.network.rows = Object.keys(rowsById).map(function (id) { return rowsById[id]; });
    var directIds = {};
    state.user.network.directs.concat(normalized.directs).forEach(function (person) {
      var id = networkPersonId(person);
      if (id) directIds[id] = true;
    });
    if (state.user.network.rootId) {
      state.user.network.rows.forEach(function (person) {
        if (networkPersonSponsorId(person) === state.user.network.rootId) directIds[networkPersonId(person)] = true;
      });
    }
    state.user.network.directs = Object.keys(directIds).map(function (id) { return rowsById[id]; }).filter(Boolean).sort(function (left, right) {
      var leftPosition = networkPersonPosition(left);
      var rightPosition = networkPersonPosition(right);
      return (leftPosition == null ? Number.MAX_SAFE_INTEGER : leftPosition) - (rightPosition == null ? Number.MAX_SAFE_INTEGER : rightPosition);
    });
    state.user.network.hasMore = booleanValue(firstDefined([
      data.has_more,
      data.tem_mais,
      data.rede_incompleta
    ], false), false) || !!(data.next_cursor || data.proximo_cursor || data.cursor_proximo);
  }

  function networkChildren(parentId) {
    var expected = cleanText(parentId);
    return state.user.network.rows.filter(function (person) {
      return networkPersonSponsorId(person) === expected;
    });
  }

  function networkDiagramChildren(parentId) {
    var expected = cleanText(parentId);
    return state.user.network.rows.filter(function (person) {
      var placementParent = networkPersonPlacementParentId(person);
      return placementParent ? placementParent === expected : networkPersonSponsorId(person) === expected;
    }).sort(function (left, right) {
      var leftPosition = networkPersonPosition(left);
      var rightPosition = networkPersonPosition(right);
      if (leftPosition != null || rightPosition != null) {
        if (leftPosition == null) return 1;
        if (rightPosition == null) return -1;
        if (leftPosition !== rightPosition) return leftPosition - rightPosition;
      }
      var leftSlot = networkPersonPlacementSlot(left);
      var rightSlot = networkPersonPlacementSlot(right);
      if (leftSlot != null && rightSlot != null && leftSlot !== rightSlot) return leftSlot - rightSlot;
      return networkPersonId(left).localeCompare(networkPersonId(right), "pt-BR", { numeric: true });
    });
  }

  function mergeNetworkRows(rows, parentId) {
    var normalizedRows = listValue(rows).map(function (row) {
      if (!row || typeof row !== "object") return null;
      var result = Object.assign({}, row);
      if (!networkPersonSponsorId(result) && parentId) result.patrocinador_id = parentId;
      return result;
    }).filter(function (row) { return row && networkPersonId(row); });
    storeUserNetwork({ usuario_id: state.user.network.rootId, rede_patrocinio: normalizedRows }, []);
    return normalizedRows.map(function (row) {
      var id = networkPersonId(row);
      return state.user.network.rows.find(function (person) { return networkPersonId(person) === id; }) || row;
    });
  }

  function networkRegistrationLabel(person) {
    var registration = networkPersonRegistrationInfo(person);
    if (!registration.value) return legendaMmn("legenda_mmn_data_de_cadastro_no_app_nao_informada");
    return registration.source === "vinculo" ?
      legendaMmn("legenda_mmn_vinculo_da_indicacao_em") + formatDate(registration.value, false) :
      legendaMmn("legenda_mmn_cadastro_no_app_em") + formatDate(registration.value, false);
  }

  function networkPositionNumberLabel(person) {
    var position = networkPersonPosition(person);
    return position == null ? "" : "#" + formatInteger(position);
  }

  function networkPersonCardHtml(person, directFromRoot, explorer) {
    var id = networkPersonId(person);
    var children = networkChildren(id).length;
    var hasChildren = children > 0 || booleanValue(person && person.tem_filhos, false);
    var name = networkPersonDisplayName(person, directFromRoot);
    var positionLabel = networkPositionNumberLabel(person);
    var secondary = directFromRoot ?
      (positionLabel ? legendaMmn("legenda_mmn_indicacao_direta") + positionLabel : legendaMmn("legenda_mmn_indicacao_direta_posicao_ainda_nao_informada")) :
      (positionLabel ? legendaMmn("legenda_mmn_posicao") + positionLabel : legendaMmn("legenda_mmn_posicao_da_indicacao_nao_informada"));
    return "<button class=\"mmn-list-row mmn-network-person\" type=\"button\" data-network-person-id=\"" + escapeHtml(id) + "\">" +
      "<span class=\"mmn-row-main\"><strong>" + escapeHtml(name) + "</strong><small>" + escapeHtml(secondary) + "</small></span>" +
      "<span class=\"mmn-network-date\">" + escapeHtml(networkRegistrationLabel(person)) + "</span>" +
      "<span class=\"mmn-network-children\">" + escapeHtml(children ? formatInteger(children) + (children === 1 ? legendaMmn("legenda_mmn_complemento_indicado") : legendaMmn("legenda_mmn_complemento_indicados")) : (hasChildren || !explorer ? legendaMmn("legenda_mmn_ver_ramificacao") : legendaMmn("legenda_mmn_sem_indicados"))) + "</span>" +
      pillHtml(networkPersonActive(person) ? "ativo" : "pendente", networkPersonActive(person) ? legendaMmn("legenda_mmn_rotulo_ativo") : legendaMmn("legenda_mmn_rotulo_inativo")) +
      "</button>";
  }

  function selectedNetworkPerson() {
    var id = state.user.network.stack[state.user.network.stack.length - 1] || "";
    return state.user.network.rows.find(function (person) { return networkPersonId(person) === id; }) || null;
  }

  function renderNetworkExplorer() {
    var person = selectedNetworkPerson();
    if (!person) return;
    var id = networkPersonId(person);
    var cache = state.user.network.nodeCache[id] || {};
    var children = Array.isArray(cache.rows) ? cache.rows : networkChildren(id);
    apresentarTextoMmn("networkExplorerTitle",function(){return legendaMmn("legenda_mmn_indicados_de") + networkPersonDisplayName(person, state.user.network.stack.length === 1);});
    apresentarTextoMmn("networkExplorerSubtitle",function(){return networkRegistrationLabel(person) + " · " + (networkPersonActive(person) ? legendaMmn("legenda_mmn_rotulo_ativo") : legendaMmn("legenda_mmn_rotulo_inativo"));});
    qs("networkExplorerBack").hidden = state.user.network.stack.length <= 1;
    apresentarMmn(qs("networkExplorerContent"),"innerHTML",function(){return cache.loading ? emptyHtml(legendaMmn("legenda_mmn_carregando_indicados")) : (children.length ? children.map(function (child) {
      return networkPersonCardHtml(child, false, true);
    }).join("") : emptyHtml(cache.error || legendaMmn("legenda_mmn_este_indicado_ainda_nao_possui_indicacoes_registradas")));});
    qs("networkExplorerMore").hidden = cache.loading || !cache.hasMore;
  }

  async function loadNetworkNode(personId, append) {
    var id = cleanText(personId);
    if (!id) return;
    var previous = state.user.network.nodeCache[id] || { rows: [], cursor: null, hasMore: false };
    if (previous.loading) return;
    previous.loading = true;
    previous.error = "";
    state.user.network.nodeCache[id] = previous;
    renderNetworkExplorer();
    try {
      var response = await rpc(CONFIG.rpcs.userNetworkNode, {
        p_usuario_id: integerValue(id),
        p_limite: 100,
        p_cursor: append ? previous.cursor : null
      });
      var payload = objectFrom(response, ["dados", "resultado"]);
      if (!Object.keys(payload).length) payload = response || {};
      var node = objectFrom(payload, ["no", "usuario", "participante"]);
      if (Object.keys(node).length) mergeNetworkRows([node], networkPersonSponsorId(node));
      var rows = listFrom(payload, ["indicados", "filhos", "itens", "participantes"]);
      if (!rows.length) rows = listFrom(objectFrom(payload, ["patrocinio", "rede_patrocinio"]), ["indicados", "filhos", "itens"]);
      rows = mergeNetworkRows(rows, id);
      var merged = append ? previous.rows.concat(rows) : rows;
      var seen = {};
      previous.rows = merged.filter(function (row) {
        var rowId = networkPersonId(row);
        if (!rowId || seen[rowId]) return false;
        seen[rowId] = true;
        return true;
      });
      previous.cursor = firstDefined([payload.next_cursor, payload.proximo_cursor, payload.cursor_proximo, response.next_cursor, response.proximo_cursor], null);
      previous.hasMore = booleanValue(firstDefined([payload.has_more, payload.tem_mais], !!previous.cursor), !!previous.cursor);
    } catch (error) {
      previous.error = previous.rows.length ? "" : legendaMmn("legenda_mmn_nao_foi_possivel_carregar_esta_ramificacao_agora_tente_novamente");
      previous.hasMore = false;
    } finally {
      previous.loading = false;
      state.user.network.nodeCache[id] = previous;
      var selected = selectedNetworkPerson();
      if (selected && networkPersonId(selected) === id) renderNetworkExplorer();
    }
  }

  async function openNetworkExplorer(personId) {
    var id = cleanText(personId);
    if (!id || !state.user.network.rows.some(function (person) { return networkPersonId(person) === id; })) return;
    state.user.network.stack = [id];
    renderNetworkExplorer();
    qs("networkExplorerOverlay").hidden = false;
    syncPageScrollLock();
    await loadNetworkNode(id, false);
  }

  function closeNetworkExplorer() {
    qs("networkExplorerOverlay").hidden = true;
    state.user.network.stack = [];
    syncPageScrollLock();
  }

  function diagramNodeHtml(person, visited) {
    var id = networkPersonId(person);
    if (!id || visited[id]) return "";
    visited[id] = true;
    var directFromRoot = networkPersonSponsorId(person) === state.user.network.rootId;
    var children = networkDiagramChildren(id);
    var position = networkPersonPosition(person);
    var nested = children.map(function (child) {
      return diagramNodeHtml(child, visited);
    }).filter(Boolean).join("");
    return "<li><article class=\"mmn-diagram-node\"><strong>" + escapeHtml(networkPersonDisplayName(person, directFromRoot)) + "</strong><small>" + escapeHtml(networkRegistrationLabel(person)) + "</small><span>" + escapeHtml((position == null ? legendaMmn("legenda_mmn_vaga_da_indicacao_nao_informada") : legendaMmn("legenda_mmn_vaga") + formatInteger(position)) + " · " + (networkPersonActive(person) ? legendaMmn("legenda_mmn_rotulo_ativo") : legendaMmn("legenda_mmn_rotulo_inativo"))) + "</span></article>" + (nested ? "<ul>" + nested + "</ul>" : "") + "</li>";
  }

  function renderNetworkDiagram() {
    var visited = {};
    var roots = networkDiagramChildren(state.user.network.rootId);
    if (!roots.length) roots = state.user.network.directs;
    var dashboardUser = objectFrom(state.user.dashboard || {}, ["usuario"]);
    var rootLogin = networkPersonLogin(dashboardUser) || legendaMmn("legenda_mmn_voce");
    var branches = roots.map(function (person) {
      return diagramNodeHtml(person, visited);
    }).filter(Boolean).join("");
    var incomplete = state.user.network.hasMore ? ("<p class=\"mmn-diagram-warning\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_a_consulta_atingiu_o_limite_de_registros_este_diagrama_esta_incompleto_e_nao")) + "</p>") : "";
    apresentarMmn(qs("networkDiagramContent"),"innerHTML",function(){return "<div class=\"mmn-diagram-root\"><strong>" + escapeHtml(rootLogin) + ("</strong><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_sua_rede_de_posicionamento")) + "</span></div>") +
      (branches ? "<div class=\"mmn-diagram-scroll\"><ul class=\"mmn-diagram-tree\">" + branches + "</ul></div>" : emptyHtml(legendaMmn("legenda_mmn_voce_ainda_nao_possui_indicados_para_exibir_no_diagrama"))) + incomplete;});
  }

  async function openNetworkDiagram() {
    qs("networkDiagramOverlay").hidden = false;
    syncPageScrollLock();
    apresentarMmn(qs("networkDiagramContent"),"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_carregando_o_diagrama_completo_da_rede"));});
    try {
      var response = await rpc(CONFIG.rpcs.userNetworkDiagram, { p_limite: 10000 });
      var payload = objectFrom(response, ["dados", "resultado", "diagrama"]);
      if (!Object.keys(payload).length) payload = response || {};
      var rows = listFrom(payload, ["nos", "rede", "itens", "participantes", "descendentes"]);
      var directs = listFrom(payload, ["diretos", "indicados_diretos"]);
      storeUserNetwork(Object.assign({}, payload, { rede_detalhada: rows }), directs);
      state.user.network.hasMore = booleanValue(firstDefined([payload.has_more, payload.tem_mais, payload.rede_incompleta], false), false);
      renderNetworkDiagram();
    } catch (error) {
      if (state.user.network.rows.length) {
        renderNetworkDiagram();
        qs("networkDiagramContent").insertAdjacentHTML("afterbegin", ("<p class=\"mmn-diagram-warning\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nao_foi_possivel_atualizar_o_diagrama_completo_agora_a_visualizacao_usa_os_dados")) + "</p>"));
      } else {
        apresentarMmn(qs("networkDiagramContent"),"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_nao_foi_possivel_carregar_o_diagrama_da_rede_agora_tente_novamente"));});
      }
    }
  }

  function closeNetworkDiagram() {
    qs("networkDiagramOverlay").hidden = true;
    document.body.classList.remove("mmn-network-printing");
    syncPageScrollLock();
  }

  function renderUserNetwork(data, append) {
    var depth = configuredNetworkDepth(data);
    var levels = listFrom(data, ["por_nivel", "niveis", "levels"]).filter(function (level) {
      return integerValue(level.nivel) >= 1 && integerValue(level.nivel) <= depth;
    });
    var directs = listFrom(data, ["diretos", "participantes"]);
    storeUserNetwork(data, directs);
    if (!append) renderUserGenealogy(data);
    if (levels.length) {
      apresentarMmn(qs("userLevelGrid"),"innerHTML",function(){return levels.map(function (level) {
        var unlocked = firstDefined([level.liberado, level.qualificado], true);
        return "<article class=\"mmn-level-card " + (unlocked ? "" : "is-locked") + ("\"><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_nivel"))) + escapeHtml(level.nivel) + " · " + escapeHtml(formatPercent(level.percentual)) + "</span><strong>" + escapeHtml(formatInteger(firstDefined([level.ativos, level.participantes_ativos], null))) + ("</strong><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_ativos_de"))) + escapeHtml(formatInteger(firstDefined([level.total, level.participantes], null))) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_participantes")) + "</span>") + pillHtml(unlocked ? "ativo" : "pendente", unlocked ? legendaMmn("legenda_mmn_rotulo_qualificado") : legendaMmn("legenda_mmn_nao_qualificado")) + "</article>";
      }).join("");});
    } else if (!append) {
      apresentarMmn(qs("userLevelGrid"),"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_a_distribuicao_por_nivel_ainda_nao_esta_disponivel"));});
    }
    function construirHtmlLegendaMmn() {
      var html = state.user.network.directs.map(function (person) {
      return networkPersonCardHtml(person, true, false);
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    apresentarMmn(qs("userDirectList"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_voce_ainda_nao_possui_indicados_diretos"));});
    state.user.cursors.network = data.next_cursor || data.proximo_cursor || data.cursor_proximo || null;
    qs("userNetworkMore").hidden = !state.user.cursors.network;
  }

  function disputeButtonHtml(row, targetType, idKeys) {
    var targetId = firstDefined(idKeys.map(function (key) { return row[key]; }), null);
    var deadline = firstDefined([row.contestacao_ate, row.contestavel_ate, row.prazo_contestacao_ate], null);
    var explicitlyAllowed = firstDefined([row.pode_contestar, row.contestavel], null);
    var withinDeadline = deadline ? new Date(deadline).getTime() >= Date.now() : false;
    if (!targetId || !(explicitlyAllowed === true || withinDeadline)) return "";
    return "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-user-dispute-type=\"" + escapeHtml(targetType) + "\" data-user-dispute-id=\"" + escapeHtml(targetId) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_contestar")) + "</button>");
  }

  function renderUserLedger(data, append) {
    var rows = listFrom(data, ["lancamentos", "extrato", "historico_mensal", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var value = row.creditos_centavos !== undefined ? numberValue(row.creditos_centavos) - numberValue(row.debitos_centavos) : centsFrom(row, ["valor_centavos"]);
      return "<div class=\"mmn-ledger-row\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.descricao || row.tipo_nome || row.tipo || (row.competencia ? legendaMmn("legenda_mmn_resumo_da_competencia") : legendaMmn("legenda_mmn_lancamento"))) + "</strong><small>" + escapeHtml(formatDate(row.criado_em || row.data || row.competencia, true)) + " · " + escapeHtml(row.competencia || "") + "</small></div><span>" + escapeHtml(row.nivel ? legendaMmn("legenda_mmn_nivel") + row.nivel : (row.origem || (row.bonus_rank_centavos ? legendaMmn("legenda_mmn_inclui_bonus") : "—"))) + "</span><strong>" + escapeHtml(formatMoneyCents(value)) + "</strong>" + pillHtml(row.status || "confirmado") + disputeButtonHtml(row, "lancamento", ["id", "cod_mmn_lancamento"]) + "</div>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("userLedgerList"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("userLedgerList"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_nenhum_lancamento_encontrado_para_o_periodo"));});
    state.user.cursors.ledger = data.proximo_cursor || data.cursor_proximo || null;
    qs("userLedgerMore").hidden = !state.user.cursors.ledger;
  }

  function renderUserBonuses(data) {
    var ranks = listFrom(data, ["ranks", "ranking"]);
    var bonuses = listFrom(data, ["bonificacoes", "bonus"]);
    var qualification = objectFrom(data, ["qualificacao"]);
    var ledger = listFrom(data, ["extrato", "lancamentos"]);
    state.user.ranks = ranks;
    state.user.rankQualificationData = data;
    apresentarMmn(qs("userRankLadder"),"innerHTML",function(){return ranks.length ? ranks.map(function (rank) {
      var status = String(rank.status || (String(rank.chave) === String(qualification.rank_chave) ? "atual" : "pendente"));
      return "<button type=\"button\" class=\"mmn-rank-card " + (status === "atual" ? "is-current" : (status === "concluido" ? "is-complete" : "")) + "\" data-rank-qualified-index=\"" + escapeHtml(ranks.indexOf(rank)) + "\"><span>" + escapeHtml(status === "atual" ? legendaMmn("legenda_mmn_rank_atual") : legendaMmn("legenda_mmn_qualificacao")) + "</span><strong>" + escapeHtml(rank.nome || rank.rank || "") + "</strong><span>" + escapeHtml(formatInteger(rank.min_rede_ativa || rank.min_ativos_rede || rank.ativos_necessarios)) + legendaMmn("legenda_mmn_ativos_na_rede_bonus") + escapeHtml(formatPercent(rank.bonus_percentual || rank.percentual_lideranca || rank.percentual)) + legendaMmn("legenda_mmn_complemento_pool") + escapeHtml(numberValue(rank.pool_coeficiente)) + "</span>" + pillHtml(status || "pendente") + ("<small class=\"mmn-rank-open-label\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ver_participantes_qualificados")) + "</small></button>");
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_os_ranks_vigentes_ainda_nao_foram_carregados"));});
    apresentarMmn(qs("userBonusGrid"),"innerHTML",function(){return bonuses.length ? bonuses.map(function (bonus) {
      var competence = String(bonus.competencia || bonus.periodo || "").slice(0, 7);
      var type = bonus.tipo || bonus.chave || "";
      var source = ledger.find(function (row) {
        return String(row.tipo || "") === String(type) && (!competence || String(row.competencia || row.periodo || "").slice(0, 7) === competence);
      }) || bonus;
      var details = objectFrom(source, ["detalhes"]);
      var detailItems = [];
      var base = firstDefined([source.base_centavos, details.base_centavos], null);
      var coefficient = firstDefined([source.pool_coeficiente, details.coeficiente], null);
      var personalPoints = firstDefined([source.pontos_pessoais, details.pontos_pessoais], null);
      var totalPoints = firstDefined([source.pontos_totais, details.pontos_totais], null);
      var availablePool = firstDefined([source.pool_disponivel_centavos, details.pool_disponivel_centavos], null);
      if (type === "pool_global" || Object.keys(details).length) {
        if (base != null) detailItems.push([legendaMmn("legenda_mmn_base_pessoal"), formatMoneyCents(base)]);
        if (coefficient != null) detailItems.push([legendaMmn("legenda_mmn_rotulo_coeficiente"), numberValue(coefficient).toLocaleString("pt-BR", { maximumFractionDigits: 5 })]);
        if (personalPoints != null) detailItems.push([legendaMmn("legenda_mmn_seus_pontos"), numberValue(personalPoints).toLocaleString("pt-BR", { maximumFractionDigits: 3 })]);
        if (totalPoints != null) detailItems.push([legendaMmn("legenda_mmn_pontos_totais"), numberValue(totalPoints).toLocaleString("pt-BR", { maximumFractionDigits: 3 })]);
        if (availablePool != null) detailItems.push([legendaMmn("legenda_mmn_pool_disponivel"), formatMoneyCents(availablePool)]);
      }
      var detailHtml = detailItems.length ? "<dl class=\"mmn-bonus-details\">" + detailItems.map(function (item) { return "<div><dt>" + escapeHtml(item[0]) + "</dt><dd>" + escapeHtml(item[1]) + "</dd></div>"; }).join("") + "</dl>" : "";
      var description = bonus.descricao || (competence ? legendaMmn("legenda_mmn_competencia") + competence : "");
      return "<article class=\"mmn-bonus-card\"><span>" + escapeHtml(bonus.nome || bonus.tipo_nome || bonus.tipo || legendaMmn("legenda_mmn_beneficio")) + "</span><strong>" + escapeHtml(formatMoneyCents(centsFrom(bonus, ["valor_centavos", "estimado_centavos"]))) + "</strong><span>" + escapeHtml(description) + "</span>" + detailHtml + pillHtml(bonus.status || source.status || "apurando") + "</article>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_nenhuma_bonificacao_registrada_nesta_competencia"));});
  }

  function qualifiedRowsForRank(rank) {
    var directRows = listFrom(rank, [
      "qualificados",
      "participantes_qualificados",
      "usuarios_qualificados",
      "loginusers_qualificados"
    ]);
    if (directRows.length) return directRows;
    var data = state.user.rankQualificationData || {};
    var grouped = firstDefined([
      data.qualificados_por_rank,
      data.participantes_por_rank,
      objectFrom(state.user.dashboard || {}, ["qualificados_por_rank"])
    ], null);
    var key = cleanText(firstDefined([rank.chave, rank.rank_chave, rank.nome, rank.rank], ""));
    if (grouped && !Array.isArray(grouped) && typeof grouped === "object") {
      return listValue(grouped[key] || grouped[key.toLowerCase()] || []);
    }
    if (Array.isArray(grouped)) {
      var group = grouped.find(function (item) {
        return cleanText(firstDefined([item.rank_chave, item.chave, item.rank, item.nome], "")).toLowerCase() === key.toLowerCase();
      });
      return group ? listFrom(group, ["qualificados", "participantes", "usuarios", "itens"]) : [];
    }
    return [];
  }

  function qualifiedLogin(row) {
    if (typeof row === "string") return cleanText(row);
    return networkPersonLogin(row);
  }

  function renderRankQualified(loading, error) {
    var rank = state.user.rankQualified.rank;
    if (!rank) return;
    var rankName = cleanText(rank.nome || rank.rank || rank.chave) || legendaMmn("legenda_mmn_qualificacao");
    var rows = state.user.rankQualified.rows;
    var seen = {};
    var unique = rows.filter(function (row) {
      var login = qualifiedLogin(row).toLowerCase();
      if (!login || seen[login]) return false;
      seen[login] = true;
      return true;
    });
    setText("rankQualifiedTitle", rankName);
    apresentarTextoMmn("rankQualifiedSubtitle",function(){return unique.length ? formatInteger(unique.length) + (unique.length === 1 ? legendaMmn("legenda_mmn_complemento_participante_qualificado") : legendaMmn("legenda_mmn_complemento_participantes_qualificados")) : legendaMmn("legenda_mmn_participantes_qualificados_neste_rank");});
    apresentarMmn(qs("rankQualifiedContent"),"innerHTML",function(){return loading ? emptyHtml(legendaMmn("legenda_mmn_carregando_participantes_qualificados")) : (unique.length ? "<div class=\"mmn-qualified-list\">" + unique.map(function (row) {
      var active = typeof row === "object" ? networkPersonActive(row) : true;
      return "<article class=\"mmn-qualified-person\"><strong>" + escapeHtml(qualifiedLogin(row)) + "</strong>" + pillHtml(active ? "ativo" : "pendente", active ? legendaMmn("legenda_mmn_rotulo_ativo") : legendaMmn("legenda_mmn_rotulo_inativo")) + "</article>";
    }).join("") + "</div>" : emptyHtml(error || legendaMmn("legenda_mmn_nenhum_participante_qualificado_foi_encontrado_neste_rank")));});
    qs("rankQualifiedMore").hidden = loading || !state.user.rankQualified.hasMore;
  }

  async function loadRankQualified(append) {
    var rank = state.user.rankQualified.rank;
    if (!rank) return;
    renderRankQualified(true, "");
    try {
      var rankKey = cleanText(firstDefined([rank.chave, rank.rank_chave, rank.rank, rank.nome], ""));
      var response = await rpc(CONFIG.rpcs.userRankQualified, {
        p_rank_chave: rankKey,
        p_limite: 100,
        p_cursor: append ? state.user.rankQualified.cursor : null
      });
      var payload = objectFrom(response, ["dados", "resultado"]);
      if (!Object.keys(payload).length) payload = response || {};
      var returnedRows = listFrom(payload, ["qualificados", "participantes", "usuarios", "itens"]);
      state.user.rankQualified.rows = append ? state.user.rankQualified.rows.concat(returnedRows) : returnedRows;
      state.user.rankQualified.cursor = firstDefined([payload.next_cursor, payload.proximo_cursor, payload.cursor_proximo, response.next_cursor, response.proximo_cursor], null);
      state.user.rankQualified.hasMore = booleanValue(firstDefined([payload.has_more, payload.tem_mais], !!state.user.rankQualified.cursor), !!state.user.rankQualified.cursor);
      renderRankQualified(false, "");
    } catch (requestError) {
      if (!append && !state.user.rankQualified.rows.length) state.user.rankQualified.rows = qualifiedRowsForRank(rank);
      state.user.rankQualified.hasMore = false;
      renderRankQualified(false, state.user.rankQualified.rows.length ? "" : legendaMmn("legenda_mmn_nao_foi_possivel_carregar_os_qualificados_agora_tente_novamente"));
    }
  }

  async function openRankQualified(rankIndex) {
    var rank = state.user.ranks[integerValue(rankIndex, -1)];
    if (!rank) return;
    state.user.rankQualified = { rank: rank, rows: qualifiedRowsForRank(rank), cursor: null, hasMore: false };
    qs("rankQualifiedOverlay").hidden = false;
    syncPageScrollLock();
    renderRankQualified(true, "");
    await loadRankQualified(false);
  }

  function closeRankQualified() {
    qs("rankQualifiedOverlay").hidden = true;
    state.user.rankQualified = { rank: null, rows: [], cursor: null, hasMore: false };
    syncPageScrollLock();
  }

  function renderUserPayments(data, append) {
    var summary = objectFrom(data, ["resumo", "saldo", "saldos"]);
    var rules = objectFrom(data, ["configuracao_publica", "regras"]);
    var parameters = objectFrom(rules, ["parametros"]);
    apresentarMmn(qs("userPaymentSummary"),"innerHTML",function(){return [
      [legendaMmn("legenda_mmn_minimo_vigente"), firstDefined([summary.minimo_pagamento_centavos, parameters.pagamento_minimo_centavos], null)],
      [legendaMmn("legenda_mmn_em_processamento"), centsFrom(summary, ["aguardando_centavos", "reservado_centavos", "pendente_centavos"])],
      [legendaMmn("legenda_mmn_rotulo_pago"), centsFrom(summary, ["total_pago_centavos", "pago_centavos"])]
    ].map(function (item) {
      return "<article class=\"mmn-payment-card\"><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(formatMoneyCents(item[1])) + "</strong></article>";
    }).join("");});
    var rows = listFrom(data, ["pagamentos", "itens"]);
    var rpas = listFrom(data, ["rpas"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var rpa = rpas.find(function (item) {
        return String(item.competencia || "").slice(0, 10) === String(row.competencia || "").slice(0, 10) &&
          numberValue(item.liquido_centavos) === numberValue(row.liquido_centavos);
      }) || {};
      var rpaStatus = rpa.status || (row.rpa_documento ? "emitido" : (row.rpa_numero ? "rascunho" : "pendente"));
      var paid = row.status === "pago";
      var documentRef = rpa.documento_ref || row.rpa_documento || "";
      var documentHtml = /^https?:\/\//i.test(documentRef) ? "<a href=\"" + escapeHtml(documentRef) + ("\" target=\"_blank\" rel=\"noopener\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_abrir_documento_rpa")) + "</a>") : escapeHtml(documentRef || legendaMmn("legenda_mmn_documento_ainda_nao_emitido"));
      return ("<article class=\"mmn-payment-progress-card\"><div class=\"mmn-panel-title\"><div><h3>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_competencia"))) + escapeHtml(String(row.competencia || "").slice(0, 7)) + ("</h3><p>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_liquido"))) + escapeHtml(formatMoneyCents(centsFrom(row, ["liquido_centavos"]))) + legendaMmn("legenda_mmn_retencoes") + escapeHtml(formatMoneyCents(centsFrom(row, ["retencoes_centavos"]))) + "</p></div>" + pillHtml(row.status) + ("</div><div class=\"mmn-payment-steps\"><div class=\"is-complete\"><span>1</span><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_apurado")) + "</strong></div><div class=\"") + (["aprovado", "enfileirado", "processando", "pago"].indexOf(row.status) >= 0 ? "is-complete" : "is-current") + ("\"><span>2</span><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_aprovado")) + "</strong></div><div class=\"") + (["emitido", "pago"].indexOf(rpaStatus) >= 0 ? "is-complete" : "is-current") + "\"><span>3</span><strong>RPA " + escapeHtml(rpaStatus === "emitido" || rpaStatus === "rascunho" ? legendaMmn("legenda_fechamento_extra_" + rpaStatus) : textoEstadoMmn(rpaStatus)) + "</strong></div><div class=\"" + (paid ? "is-complete" : (["enfileirado", "processando"].indexOf(row.status) >= 0 ? "is-current" : "")) + ("\"><span>4</span><strong>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_transferencia"))) + escapeHtml(paid ? legendaMmn("legenda_fechamento_extra_confirmada") : legendaMmn("legenda_mmn_estado_pendente")) + "</strong></div></div><div class=\"mmn-payment-document\"><strong>" + escapeHtml(rpa.numero || row.rpa_numero || legendaMmn("legenda_mmn_rpa_ainda_sem_numero")) + "</strong><span>" + documentHtml + "</span></div>" + disputeButtonHtml(row, "pagamento", ["id", "cod_mmn_lote_beneficiario"]) + "</article>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("userPaymentList"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("userPaymentList"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_nenhum_pagamento_processado"));});
    state.user.cursors.payments = data.proximo_cursor || data.cursor_proximo || null;
    qs("userPaymentsMore").hidden = !state.user.cursors.payments;
  }

  function renderSimulationResults(containerId, data) {
    var container = qs(containerId);
    if (!data || data.ok === false) {
      container.innerHTML = emptyHtml(friendlyMessage((data && data.error) || "simulacao_nao_executada"));
      return;
    }
    var summary = objectFrom(data, ["resumo", "resultado"]);
    var descricoesLegendaMmn = new WeakMap();
    function descricaoMetricaLegenda(metric) {
      var vinculo=descricoesLegendaMmn.get(metric);
      return vinculo&&metric.descricao===vinculo.ultimo?vinculo.obter():(metric.descricao||"");
    }
    var metrics = listFrom(data, ["metricas"]).slice();
    var monthly = listFrom(data, ["serie", "projecao_mensal", "meses"]);
    if (!metrics.length) {
      Object.keys(summary).forEach(function (key) {
        var value = summary[key];
        if (typeof value !== "object") metrics.push({ chave: key, nome: key.replace(/_/g, " "), valor: value });
      });
    }
    if (data.tipo === "usuario_pessoal" && monthly.length) {
      var grossSum = monthly.reduce(function (total, row) { return total + numberValue(row.ganho_bruto_centavos); }, 0);
      var netSum = monthly.reduce(function (total, row) { return total + numberValue(row.liquido_estimado_centavos); }, 0);
      var lastMonth = monthly[monthly.length - 1] || {};
      var projectedMonths = monthly.length;
      metrics.forEach(function (metric) {
        if (["bruto_total", "liquido_total"].indexOf(cleanText(metric.chave)) >= 0 && !metric.descricao) {
          var obterDescricao=function(){return legendaMmn("legenda_mmn_total_projetado_para") + projectedMonths + (projectedMonths === 1 ? legendaMmn("legenda_mmn_mes") : legendaMmn("legenda_mmn_complemento_meses"));};
          metric.descricao=obterDescricao();
          descricoesLegendaMmn.set(metric,{ultimo:metric.descricao,obter:obterDescricao});
        }
      });
      metrics.push({
        chave: "media_mensal_liquida",
        get nome(){return legendaMmn("legenda_mmn_media_mensal_estimada");},
        valor_centavos: Math.round(netSum / projectedMonths),
        get descricao(){return legendaMmn("legenda_mmn_bruto_medio_mensal") + formatMoneyCents(Math.round(grossSum / projectedMonths)) + ".";}
      });
      metrics.push({
        chave: "ultimo_mes_liquido",
        get nome(){return legendaMmn("legenda_mmn_valor_mensal_no_ultimo_mes");},
        valor_centavos: numberValue(lastMonth.liquido_estimado_centavos),
        get descricao(){return legendaMmn("legenda_mmn_bruto_no_ultimo_mes") + formatMoneyCents(lastMonth.ganho_bruto_centavos) + ".";}
      });
    }
    function construirHtmlLegendaMmn() {
      var html = metrics.map(function (metric) {
      var value;
      if (metric.valor_centavos !== undefined) value = formatMoneyCents(metric.valor_centavos);
      else if (metric.tipo === "percentual") value = formatPercent(metric.valor);
      else value = firstDefined([metric.valor_formatado, metric.valor], "—");
      return "<article class=\"mmn-result-card\"><span>" + escapeHtml(metric.nome || metric.titulo || metric.chave || legendaMmn("legenda_mmn_rotulo_resultado")) + "</span><strong>" + escapeHtml(value) + "</strong><small>" + escapeHtml(descricaoMetricaLegenda(metric)) + "</small></article>";
    }).join("");
    if (data.tipo === "usuario_pessoal") {
      var base = objectFrom(data, ["base_real"]);
      html = ("<article class=\"mmn-simulation-context\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_base_real_usada")) + "</span><strong>") + escapeHtml(formatInteger(base.rede_ativa)) + legendaMmn("legenda_mmn_complemento_pessoas_ativas_na_rede") + escapeHtml(formatInteger(base.diretos_ativos)) + ((escapeHtml(legendaMmn("legenda_fechamento_mmn_diretos_ativos")) + "</strong><small>") + escapeHtml(legendaMmn("legenda_mmn_rotulo_a_projecao_parte_dos_seus_dados_atuais_e_das_regras_vigentes")) + "</small></article>") + html;
    }
    if (data.id_simulacao || data.simulacao_id) {
      html += ("<div class=\"mmn-simulation-meta\"><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_simulacao"))) + escapeHtml(data.id_simulacao || data.simulacao_id) + "</span>" + pillHtml(data.apta_publicacao ? "ok" : "pendente", data.apta_publicacao ? legendaMmn("legenda_mmn_apta_para_publicacao") : legendaMmn("legenda_mmn_somente_analise")) + ("<span>" + escapeHtml(legendaMmn("legenda_fechamento_extra_motor"))) + escapeHtml(data.motor_versao || "V2") + "</span></div>";
    }
    if (monthly.length) {
      var personal = data.tipo === "usuario_pessoal";
      var replay = data.tipo === "admin_historica";
      html += ("<div class=\"mmn-simulation-table table-wrap\"><table><thead><tr><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_mes")) + "</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ativos")) + "</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_receita")) + "</th><th>") + (personal ? legendaMmn("legenda_mmn_bruto_pessoal") : (replay ? legendaMmn("legenda_mmn_payout_real") : legendaMmn("legenda_mmn_comissoes"))) + "</th><th>" + (personal ? legendaMmn("legenda_mmn_liquido_estimado") : (replay ? legendaMmn("legenda_mmn_rotulo_recalculado") : legendaMmn("legenda_mmn_bonus_e_pool"))) + ("</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_payout")) + "</th></tr></thead><tbody>") + monthly.map(function (row) {
        var real = objectFrom(row, ["real"]);
        var recalculated = objectFrom(row, ["recalculado"]);
        var fourth = personal ? row.ganho_bruto_centavos : (replay ? real.payout_centavos : row.comissoes_centavos);
        var fifth = personal ? row.liquido_estimado_centavos : (replay ? recalculated.payout_centavos : row.bonus_centavos);
        return "<tr><td>" + escapeHtml(row.competencia || row.mes || "") + "</td><td>" + escapeHtml(formatInteger(firstDefined([row.rede_ativa, row.usuarios_ativos, row.ativos], null))) + "</td><td>" + escapeHtml(formatMoneyCents(centsFrom(row, ["receita_centavos"]))) + "</td><td>" + escapeHtml(formatMoneyCents(fourth)) + "</td><td>" + escapeHtml(formatMoneyCents(fifth)) + "</td><td>" + escapeHtml(formatPercent(row.payout_percentual)) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    }
    var alertMessages = {
      projecao_futura_por_coortes_estatisticas: legendaMmn("legenda_mmn_projecao_futura_calculada_por_coortes_estatisticas"),
      pool_global_sem_base_historica_estimado_como_indisponivel: legendaMmn("legenda_mmn_pool_global_indisponivel_nesta_estimativa_por_falta_de_base_historica"),
      estrutura_parametrizada_e_deduplicacao_direta_prioritaria: legendaMmn("legenda_mmn_a_projecao_aplica_a_estrutura_vigente_e_prioriza_a_comissao_direta_sem_duplicidade"),
      indicacao_pessoal_separada_do_posicionamento: legendaMmn("legenda_mmn_indicacao_pessoal_e_posicionamento_sao_calculados_separadamente"),
      spillover_futuro_estimado_por_capacidade: legendaMmn("legenda_mmn_o_spillover_futuro_e_estimado_conforme_a_capacidade_da_estrutura"),
      deduplicacao_apresentada_como_intervalo_sem_garantia: legendaMmn("legenda_mmn_a_deduplicacao_futura_e_apresentada_como_intervalo_estimado")
    };
    var alerts = listFrom(data, ["alertas"]).map(function (alert) {
      var key = cleanText(alert).toLowerCase();
      if (["estimativa_sem_garantia_de_renda", "simulacao_estimativa_sem_garantia_de_renda"].indexOf(key) >= 0) return "";
      if (alertMessages[key]) return alertMessages[key];
      var message = String(alert).replace(/_/g, " ").trim();
      return message ? message.charAt(0).toUpperCase() + message.slice(1) + (/[.!?]$/.test(message) ? "" : ".") : "";
    }).filter(Boolean);
    if (alerts.length) html += ("<div class=\"mmn-simulation-alerts\"><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_avisos_da_simulacao")) + "</strong>") + alerts.map(function (alert) { return "<span>" + escapeHtml(alert) + "</span>"; }).join("") + "</div>";
    html += ("<p class=\"mmn-disclaimer\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_simulacao_estimativa_sem_promessa_ou_garantia_de_renda_pagamento_ou_resultado")) + "</p>");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    apresentarMmn(container,"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_o_servidor_nao_retornou_resultados_para_esta_simulacao"));});
  }

  async function loadUserTab(tab, append) {
    try {
      var dashboard = state.user.dashboard || {};
      if (tab === "rede") {
        var network = objectFrom(dashboard, ["rede"]);
        var levels = listFrom(dashboard, ["niveis"]);
        if (!levels.length) levels = listFrom(network, ["por_nivel", "niveis", "total_por_nivel"]);
        var dashboardUser = objectFrom(dashboard, ["usuario"]);
        var dashboardParticipant = objectFrom(dashboard, ["participante", "usuario_mmn"]);
        var rootId = firstNonEmptyText([
          state.user.network.rootId,
          network.raiz_usuario_id,
          network.usuario_id,
          network.id_usuario,
          dashboardUser.usuario_id,
          dashboardUser.id_usuario,
          dashboardUser.cod_usuario,
          dashboardParticipant.usuario_id,
          dashboardParticipant.id_usuario,
          dashboardParticipant.cod_usuario,
          networkPersonSponsorId(listValue(network.diretos)[0])
        ], "");

        if (append) {
          var currentCursor = state.user.cursors.network;
          if (!rootId || currentCursor === null || currentCursor === "") {
            qs("userNetworkMore").hidden = true;
            return;
          }
          var networkPageResponse = await rpc(CONFIG.rpcs.userNetworkNode, {
            p_usuario_id: integerValue(rootId),
            p_limite: 100,
            p_cursor: currentCursor
          });
          var networkPage = objectFrom(networkPageResponse, ["dados", "resultado"]);
          if (!Object.keys(networkPage).length) networkPage = networkPageResponse || {};
          renderUserNetwork({
            no_usuario_id: rootId,
            diretos: listFrom(networkPage, ["itens", "indicados", "filhos", "participantes"]),
            next_cursor: firstDefined([networkPage.next_cursor, networkPage.proximo_cursor, networkPage.cursor_proximo], null),
            has_more: booleanValue(firstDefined([networkPage.has_more, networkPage.tem_mais], false), false)
          }, true);
          state.user.loaded[tab] = true;
          return;
        }

        var placementPayload = {};
        try {
          var placementNetwork = await rpc(CONFIG.rpcs.userPlacementNetwork, { p_limite: 1000 });
          placementPayload = objectFrom(placementNetwork, ["rede", "dados"]);
          if (!Object.keys(placementPayload).length) placementPayload = placementNetwork || {};
        } catch (networkError) {
          placementPayload = {};
        }
        rootId = firstNonEmptyText([
          rootId,
          placementPayload.raiz_usuario_id,
          placementPayload.usuario_id,
          placementPayload.id_usuario
        ], "");
        var positionedRows = listFrom(placementPayload, ["rede"]);
        var placementLevels = listFrom(placementPayload, ["por_nivel", "niveis", "levels"]);
        if (!placementLevels.length && positionedRows.length) {
          var grouped = {};
          positionedRows.forEach(function (row) {
            var level = integerValue(firstDefined([row.nivel, row.nivel_estrutural], 0));
            if (level < 1) return;
            if (!grouped[level]) grouped[level] = { nivel: level, total: 0, ativos: null };
            grouped[level].total += 1;
          });
          placementLevels = Object.keys(grouped).map(function (key) { return grouped[key]; }).sort(function (a, b) { return a.nivel - b.nivel; });
        }
        var placementDirects = listFrom(placementPayload, ["patrocinio", "diretos", "indicados_diretos"]);
        if (!placementDirects.length) placementDirects = listFrom(objectFrom(placementPayload, ["patrocinio", "arvore_patrocinio"]), ["diretos", "indicados", "participantes"]);

        var directPage = {};
        if (rootId) {
          try {
            var directResponse = await rpc(CONFIG.rpcs.userNetworkNode, {
              p_usuario_id: integerValue(rootId),
              p_limite: 100,
              p_cursor: null
            });
            directPage = objectFrom(directResponse, ["dados", "resultado"]);
            if (!Object.keys(directPage).length) directPage = directResponse || {};
          } catch (directError) {
            directPage = {};
          }
        }
        var directRows = listFrom(directPage, ["itens", "indicados", "filhos", "participantes"]);
        renderUserNetwork(Object.assign({}, network, placementPayload, {
          raiz_usuario_id: rootId,
          niveis: placementLevels.length ? placementLevels : levels,
          diretos: directRows.length ? directRows : (placementDirects.length ? placementDirects : (network.diretos || [])),
          next_cursor: firstDefined([directPage.next_cursor, directPage.proximo_cursor, directPage.cursor_proximo], null),
          has_more: booleanValue(firstDefined([directPage.has_more, directPage.tem_mais], false), false),
          regras: objectFrom(dashboard, ["regras", "configuracao_publica"]),
          participante: dashboardParticipant
        }), false);
      } else if (tab === "extrato") {
        var selectedPeriod = qs("userLedgerPeriod").value;
        var entries = listFrom(dashboard, ["historico_mensal", "extrato"]).filter(function (row) {
          return !selectedPeriod || String(row.competencia || row.periodo || "").slice(0, 7) === selectedPeriod;
        });
        renderUserLedger({ lancamentos: entries }, false);
      } else if (tab === "beneficios") {
        var publicConfig = objectFrom(dashboard, ["regras", "configuracao_publica"]);
        var userBonuses = listFrom(dashboard, ["bonificacoes", "bonus"]);
        if (!userBonuses.length) userBonuses = bonusesFromEvolution(dashboard);
        renderUserBonuses({ ranks: listFrom(publicConfig, ["ranks"]), bonificacoes: userBonuses, qualificacao: objectFrom(dashboard, ["qualificacao_atual", "qualificacao"]), extrato: listFrom(dashboard, ["extrato"]) });
      } else if (tab === "pagamentos") {
        renderUserPayments({ pagamentos: listFrom(dashboard, ["pagamentos"]), rpas: listFrom(dashboard, ["rpas"]), resumo: objectFrom(dashboard, ["resumo"]), saldo: objectFrom(dashboard, ["saldo"]), configuracao_publica: objectFrom(dashboard, ["configuracao_publica", "regras"]) }, false);
      }
      state.user.loaded[tab] = true;
    } catch (error) {
      setGlobalError(error);
    }
  }

  function activateUserTab(tab) {
    qsa("[data-user-tab]").forEach(function (button) {
      var active = button.getAttribute("data-user-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa("[data-user-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-user-panel") !== tab;
    });
    if (["rede", "extrato", "beneficios", "pagamentos"].indexOf(tab) >= 0 && !state.user.loaded[tab]) loadUserTab(tab, false);
  }

  function renderAdminOverview(data) {
    var summary = objectFrom(data, ["resumo", "metricas"]);
    var period = objectFrom(data, ["periodo"]);
    var revenue = centsFrom(summary, ["receita_confirmada_centavos", "receita_reconhecida_centavos", "receita_centavos", "mrr_centavos"]);
    var allocated = numberValue(period.total_comissao_base_centavos) + numberValue(period.total_bonus_rank_centavos) + numberValue(period.total_pool_centavos);
    var payout = numberValue(revenue) > 0 ? allocated * 100 / numberValue(revenue) : null;
    setText("adminMetricRevenue", formatMoneyCents(revenue));
    setText("adminMetricPayout", formatPercent(firstDefined([summary.payout_efetivo_percentual, summary.payout_percentual, payout], null)));
    setText("adminMetricAllocated", formatMoneyCents(firstDefined([summary.alocado_centavos, summary.comissoes_bonus_centavos, summary.comissao_centavos], allocated)));
    setText("adminMetricReserve", formatMoneyCents(firstDefined([summary.reserva_centavos], period.total_reserva_centavos)));
    setText("adminMetricEligible", formatInteger(firstDefined([summary.participantes_elegiveis, summary.elegiveis], null)));
    setText("adminMetricPending", formatInteger(firstDefined([summary.pendencias, summary.total_pendencias], numberValue(summary.espera_pendente) + numberValue(summary.ocorrencias_abertas) + numberValue(summary.pendentes_regulamento))));
    var levels = listFrom(data, ["niveis", "levels"]);
    if (!levels.length) levels = listFrom(objectFrom(data, ["regras"]), ["niveis", "levels"]);
    var adminDepth = configuredNetworkDepth(data);
    levels = levels.filter(function (row) { return integerValue(row.nivel) >= 1 && integerValue(row.nivel) <= adminDepth; });
    var max = Math.max.apply(null, levels.map(function (row) { return numberValue(row.percentual); }).concat([1]));
    apresentarMmn(qs("adminLevelBars"),"innerHTML",function(){return levels.length ? levels.map(function (row) {
      return ("<div class=\"mmn-level-bar\"><strong>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_nivel"))) + escapeHtml(row.nivel) + "</strong><span class=\"mmn-level-bar-track\"><span style=\"width:" + Math.max(0, Math.min(100, numberValue(row.percentual) / max * 100)) + "%\"></span></span><span>" + escapeHtml(formatPercent(row.percentual)) + "</span></div>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_a_versao_vigente_ainda_nao_retornou_os_niveis"));});
    var health = listFrom(data, ["saude", "pendencias_resumo"]);
    if (!health.length && data.alertas && typeof data.alertas === "object") {
      health = Object.keys(data.alertas).map(function (key) {
        var value = data.alertas[key];
        var status;
        if (key === "pagamento_real_bloqueado") status = booleanValue(value, true) ? "pendente" : "ok";
        else if (key === "fiscal_homologado") status = booleanValue(value, false) ? "ok" : "pendente";
        else status = typeof value === "boolean" ? (value ? "ok" : "pendente") : (numberValue(value) > 0 ? "pendente" : "ok");
        return { nome: key.replace(/_/g, " "), status: status, valor_formatado: typeof value === "boolean" ? (value ? legendaMmn("legenda_mmn_rotulo_sim") : legendaMmn("legenda_mmn_nao")) : value };
      });
    }
    apresentarMmn(qs("adminHealthList"),"innerHTML",function(){return health.length ? health.map(function (item) {
      return "<div class=\"mmn-health-item\"><span>" + escapeHtml(item.nome || item.titulo || item.tipo || legendaMmn("legenda_mmn_verificacao")) + "</span>" + pillHtml(item.status || (item.ok ? "ok" : "pendente"), item.valor_formatado || item.status_texto || item.status || "") + "</div>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_nenhuma_pendencia_operacional_informada"));});
  }

  function renderAdminPeriods(data, append) {
    var rows = listFrom(data, ["competencias", "periodos", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var id = row.cod_mmn_competencia || row.cod_mmn_periodo || row.id;
      var actions = [];
      if (["aberto", "reaberto"].indexOf(row.status) >= 0) actions.push(["apurar", legendaMmn("legenda_mmn_rotulo_apurar")]);
      if (row.status === "revisao") actions.push(["fechar", legendaMmn("legenda_mmn_rotulo_fechar")]);
      if (["fechado", "liberado"].indexOf(row.status) >= 0) actions.push(["reabrir", legendaMmn("legenda_mmn_rotulo_reabrir")]);
      var periodRevenue = centsFrom(row, ["total_receita_centavos", "receita_centavos", "mrr_centavos"]);
      var periodAllocated = numberValue(row.total_comissao_base_centavos) + numberValue(row.total_bonus_rank_centavos) + numberValue(row.total_pool_centavos);
      var periodPayout = numberValue(periodRevenue) > 0 ? periodAllocated * 100 / numberValue(periodRevenue) : null;
      return "<tr><td><strong>" + escapeHtml(row.competencia || row.periodo || "") + "</strong></td><td>Config. #" + escapeHtml(row.id_config || row.versao_nome || row.configuracao_versao || "—") + "</td><td>" + escapeHtml(formatMoneyCents(periodRevenue)) + "</td><td>" + escapeHtml(formatPercent(firstDefined([row.payout_percentual, periodPayout], null))) + "</td><td>" + pillHtml(row.status) + "</td><td><div class=\"btn-row\">" + actions.map(function (action) { return "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-period-action=\"" + action[0] + "\" data-period-value=\"" + escapeHtml(row.competencia || row.periodo || "") + "\" data-period-id=\"" + escapeHtml(id) + "\">" + action[1] + "</button>"; }).join("") + "</div></td></tr>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminPeriodsBody"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminPeriodsBody"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyTableHtml(6, legendaMmn("legenda_mmn_nenhuma_competencia_encontrada"));});
    state.admin.cursors.periods = data.proximo_cursor || null;
    qs("adminPeriodsMore").hidden = !state.admin.cursors.periods;
  }

  function renderAdminParticipants(data, append) {
    var rows = listFrom(data, ["participantes", "usuarios", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var id = row.usuario_id || row.id_usuario || row.cod_usuario;
      var eligibility = objectFrom(row, ["elegibilidade"]);
      var placement = objectFrom(row, ["posicionamento", "posicao"]);
      var placementParent = firstDefined([placement.pai_posicionamento_id, row.pai_posicionamento_id], null);
      var placementSlot = firstDefined([placement.slot_posicionamento, placement.slot, row.slot_posicionamento], null);
      var userLogin = cleanText(firstDefined([row.loginuser, row.usuario_loginuser, row.login, row.codinome], legendaMmn("legenda_mmn_usuario")));
      var sponsorLogin = cleanText(firstDefined([row.patrocinador_loginuser, row.patrocinador_login], row.patrocinador_id ? legendaMmn("legenda_mmn_usuario") : legendaMmn("legenda_mmn_rotulo_raiz")));
      var placementParentLogin = cleanText(firstDefined([placement.pai_posicionamento_loginuser, row.pai_posicionamento_loginuser], placementParent == null ? legendaMmn("legenda_mmn_raiz_estrutural") : legendaMmn("legenda_mmn_usuario")));
      var placementText = placementParentLogin + (placementSlot == null ? "" : " · #" + placementSlot);
      var spillover = booleanValue(firstDefined([placement.spillover, placement.foi_spillover, row.foi_spillover], false), false);
      var permanent = row.status === "inelegivel_permanente" || booleanValue(row.inelegibilidade_permanente, false);
      return "<tr><td><strong>" + escapeHtml(userLogin) + "</strong><br><small>" + escapeHtml(row.nome || "") + "</small></td><td>" + escapeHtml(sponsorLogin) + ("<br><small>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_indicacao_direta")) + "</small></td><td>") + escapeHtml(placementText) + "<br><small>" + escapeHtml(spillover ? legendaMmn("legenda_mmn_rotulo_spillover") : legendaMmn("legenda_mmn_posicao_direta")) + "</small></td><td>" + escapeHtml(row.grupo || row.grupo_chave || "—") + "</td><td>" + pillHtml(eligibility.premium_vigente ? "ativo" : "pendente", eligibility.premium_vigente ? legendaMmn("legenda_mmn_em_dia") : legendaMmn("legenda_mmn_rotulo_inativo")) + "</td><td>" + pillHtml(permanent ? "permanente" : (eligibility.elegivel_receber ? "ativo" : row.status), permanent ? legendaMmn("legenda_mmn_rotulo_permanente") : (eligibility.elegivel_receber ? legendaMmn("legenda_mmn_elegivel") : row.status)) + "</td><td>" + escapeHtml(row.rank_nome || row.rank || "—") + "</td><td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-participant-edit=\"" + escapeHtml(id) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_gerenciar")) + "</button></td></tr>");
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminParticipantsBody"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminParticipantsBody"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyTableHtml(8, legendaMmn("legenda_mmn_nenhum_participante_encontrado"));});
    state.admin.participants = append ? (state.admin.participants || []).concat(rows) : rows;
    state.admin.cursors.participants = data.next_cursor || data.proximo_cursor || null;
    qs("adminParticipantsMore").hidden = data.has_more === false || !state.admin.cursors.participants;
  }

  function renderAdminWaitlist(data, append) {
    var rows = listFrom(data, ["lista_espera", "cadastros", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var id = row.cod_mmn_espera_vinculo || row.id;
      var actions = row.status === "prazo_expirado" ? [["reativar", legendaMmn("legenda_mmn_reativar_prazo")], ["aprovar", legendaMmn("legenda_mmn_rotulo_aprovar")], ["cancelar", legendaMmn("legenda_mmn_rotulo_cancelar")]] :
        (row.status === "convertido" || row.status === "cancelado" ? [] : [["aprovar", legendaMmn("legenda_mmn_rotulo_aprovar")], ["revisao", legendaMmn("legenda_mmn_rotulo_revisar")], ["cancelar", legendaMmn("legenda_mmn_rotulo_cancelar")]]);
      return "<tr><td><strong>#" + escapeHtml(row.codigo_convite || row.codigo || "") + "</strong></td><td>#" + escapeHtml(row.id_lead || "—") + "</td><td>" + escapeHtml(row.id_usuario_convertido ? "#" + row.id_usuario_convertido : legendaMmn("legenda_mmn_aguardando_cadastro")) + "</td><td>#" + escapeHtml(row.id_lead_patrocinador || "—") + "</td><td>" + escapeHtml(formatDate(row.prazo_vinculacao_ate || row.prazo_ate || row.expira_em, false)) + "</td><td>" + pillHtml(row.status) + "</td><td><div class=\"btn-row\">" + (actions.map(function (action) { return "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-waitlist-action=\"" + action[0] + "\" data-waitlist-id=\"" + escapeHtml(id) + "\">" + action[1] + "</button>"; }).join("") || "—") + "</div></td></tr>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminWaitlistBody"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminWaitlistBody"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyTableHtml(7, legendaMmn("legenda_mmn_nenhum_cadastro_na_lista_de_espera"));});
    state.admin.cursors.waitlist = data.next_cursor || data.proximo_cursor || null;
    qs("adminWaitlistMore").hidden = data.has_more === false || !state.admin.cursors.waitlist;
  }

  function renderAdminNetwork(data) {
    var network = data.rede || data;
    var base = objectFrom(network, ["usuario", "base"]);
    var participant = objectFrom(network, ["participante"]);
    var sponsorship = objectFrom(network, ["patrocinio", "arvore_patrocinio"]);
    var placement = objectFrom(network, ["posicionamento", "arvore_posicionamento"]);
    var depth = configuredNetworkDepth(network);
    var width = configuredPlacementWidth(network);
    var levels = listFrom(network, ["rede_por_nivel", "niveis", "levels"]).filter(function (level) { return integerValue(level.nivel) >= 1 && integerValue(level.nivel) <= depth; });
    var directs = listFrom(network, ["diretos"]);
    if (!directs.length) directs = listFrom(sponsorship, ["diretos", "filhos"]);
    var positioned = listFrom(placement, ["filhos", "posicoes", "participantes"]);
    function construirHtmlLegendaMmn() {
      var html = "";
    if (base.id || base.cod_usuario || base.id_usuario) {
      var baseLogin = cleanText(firstDefined([base.loginuser, base.usuario_loginuser, base.login, base.codinome], legendaMmn("legenda_mmn_usuario")));
      var adminSponsorLogin = cleanText(firstDefined([participant.patrocinador_loginuser, data.patrocinador_loginuser], participant.id_patrocinador || participant.patrocinador_id ? legendaMmn("legenda_mmn_usuario") : legendaMmn("legenda_mmn_rotulo_raiz")));
      var adminParentLogin = cleanText(firstDefined([placement.pai_posicionamento_loginuser, participant.pai_posicionamento_loginuser], placement.pai_posicionamento_id || participant.pai_posicionamento_id ? legendaMmn("legenda_mmn_usuario") : legendaMmn("legenda_mmn_raiz_estrutural")));
      var adminSlot = firstDefined([placement.slot_posicionamento, participant.slot_posicionamento], null);
      html += "<article class=\"mmn-feature-panel\"><div class=\"mmn-panel-title\"><div><h3>" + escapeHtml(baseLogin) + "</h3><p>" + escapeHtml(base.nome || "") + "</p></div>" + pillHtml(participant.status || (base.mmn_ativo ? "ativo" : "suspenso")) + ("</div><div class=\"mmn-genealogy-summary\"><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_patrocinio")) + "</span><strong>") + escapeHtml(relationPersonLabel(objectFrom(sponsorship, ["patrocinador", "pai"]), adminSponsorLogin)) + ("</strong><small>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_origem_da_comissao_direta")) + "</small></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_pai_de_posicionamento")) + "</span><strong>") + escapeHtml(relationPersonLabel(objectFrom(placement, ["pai", "pai_posicionamento"]), adminParentLogin)) + ("</strong><small>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_origem_dos_niveis_residuais")) + "</small></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_vaga")) + "</span><strong>") + escapeHtml(adminSlot == null ? "—" : "#" + adminSlot) + ("</strong><small>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_slot_estrutural_registrado")) + "</small></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_regra")) + "</span><strong>") + escapeHtml(width === 0 ? legendaMmn("legenda_mmn_largura_ilimitada") : (width + legendaMmn("legenda_mmn_vagas_por_no"))) + ("</strong><small>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_profundidade"))) + escapeHtml(depth) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_niveis_sufixo")) + "</small></div></div></article>");
    }
    html += ("<div class=\"mmn-tree-explanation\"><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_duas_genealogias_independentes")) + "</strong><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_patrocinio_preserva_quem_convidou_posicionamento_organiza_as_vagas_e_o_spillover_a_comissao")) + "</span></div>");
    html += levels.map(function (level) {
      return ("<div class=\"mmn-tree-level\"><strong>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_nivel"))) + escapeHtml(level.nivel) + "</strong><div class=\"mmn-tree-people\"><div class=\"mmn-tree-person\"><strong>" + escapeHtml(formatInteger(level.ativos)) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_ativos")) + "</strong><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_de"))) + escapeHtml(formatInteger(level.total)) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_participantes")) + "</span></div></div></div>");
    }).join("");
    if (directs.length) html += ("<div class=\"mmn-tree-level\"><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_patrocinio_indicados_diretos")) + "</strong><div class=\"mmn-tree-people\">") + directs.map(function (person) { return "<div class=\"mmn-tree-person\"><strong>" + escapeHtml(firstDefined([person.loginuser, person.usuario_loginuser, person.login, person.codinome, person.nome], legendaMmn("legenda_mmn_usuario"))) + ("</strong><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_vinculo_permanente_de_indicacao")) + "</span>") + pillHtml(person.status || (person.ativo ? "ativo" : "suspenso")) + "</div>"; }).join("") + "</div></div>";
    if (positioned.length) html += ("<div class=\"mmn-tree-level\"><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_posicionamento_vagas_abaixo")) + "</strong><div class=\"mmn-tree-people\">") + positioned.map(function (person) { return "<div class=\"mmn-tree-person\"><strong>" + escapeHtml(firstDefined([person.loginuser, person.usuario_loginuser, person.login, person.codinome, person.nome], legendaMmn("legenda_mmn_usuario"))) + "</strong><span>#" + escapeHtml(firstDefined([person.slot_posicionamento, person.slot], "—")) + (booleanValue(firstDefined([person.spillover, person.foi_spillover], false), false) ? legendaMmn("legenda_mmn_complemento_spillover") : legendaMmn("legenda_mmn_posicao_direta_mensagem")) + "</span>" + pillHtml(person.status || (person.ativo ? "ativo" : "suspenso")) + "</div>"; }).join("") + "</div></div>";
          return html;
    }
    var html = construirHtmlLegendaMmn();
    apresentarMmn(qs("adminNetworkTree"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_nenhuma_genealogia_encontrada_para_esse_usuario"));});
  }

  function renderAdminRevenue(data, append) {
    var rows = listFrom(data, ["lancamentos", "receitas", "alocacoes", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      return "<tr><td>" + escapeHtml(formatDate(row.ingerido_em || row.criado_em || row.data_evento, true)) + "</td><td><strong>" + escapeHtml(firstDefined([row.loginuser, row.origem_loginuser, row.usuario_loginuser, row.nome, row.origem_nome], legendaMmn("legenda_mmn_usuario"))) + "</strong><br><small>" + escapeHtml(row.nome || row.origem_nome || "") + "</small></td><td>#" + escapeHtml(row.id_pagamento || "—") + "<br><small>" + escapeHtml(row.gateway_payment_id || "") + "</small></td><td>" + escapeHtml(row.gateway || "—") + "</td><td><strong>" + escapeHtml(formatMoneyCents(centsFrom(row, ["valor_pago_centavos"]))) + "</strong></td><td>" + (row.valor_confirmado ? escapeHtml(formatDate(row.confirmado_em, true)) : legendaMmn("legenda_mmn_rotulo_aguardando")) + "</td><td>" + pillHtml(row.gera_comissao ? "ativo" : "bloqueado", row.gera_comissao ? legendaMmn("legenda_mmn_rotulo_gera") : (row.motivo_nao_geracao || legendaMmn("legenda_mmn_nao_gera"))) + "</td><td>" + pillHtml(row.status) + "</td></tr>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminRevenueBody"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminRevenueBody"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyTableHtml(8, legendaMmn("legenda_mmn_nenhum_lancamento_encontrado"));});
    state.admin.cursors.revenue = data.next_cursor || data.proximo_cursor || null;
    qs("adminRevenueMore").hidden = data.has_more === false || !state.admin.cursors.revenue;
  }

  function configVersions(data) {
    return listFrom(data, ["versoes", "configuracoes", "itens"]);
  }

  function normalizeConfigResponse(data) {
    var source = data || {};
    var row = objectFrom(source, ["config", "configuracao", "configuracao_ativa"]);
    if (!Object.keys(row).length && (source.cod_mmn_config || source.cod_mmn_configuracao || source.id)) row = source;
    var parameters = objectFrom(row, ["parametros"]);
    var normalized = Object.assign({}, parameters, row);
    normalized.parametros = Object.assign({}, parameters);
    normalized.cod_mmn_config = row.cod_mmn_config || row.cod_mmn_configuracao || row.id || null;
    normalized.niveis = listFrom(source, ["niveis", "percentuais_nivel"]);
    if (!normalized.niveis.length) normalized.niveis = listFrom(row, ["niveis", "percentuais_nivel"]);
    normalized.ranks = listFrom(source, ["ranks"]);
    if (!normalized.ranks.length) normalized.ranks = listFrom(row, ["ranks"]);
    normalized.grupos_isentos = listFrom(source, ["grupos_isentos", "grupos"]);
    if (!normalized.grupos_isentos.length) normalized.grupos_isentos = listFrom(row, ["grupos_isentos", "grupos"]);
    normalized.retencoes = listFrom(source, ["retencoes", "taxas"]);
    if (!normalized.retencoes.length) normalized.retencoes = listFrom(row, ["retencoes", "taxas"]);
    normalized.aprovadores = listFrom(source, ["aprovadores"]);
    normalized.documento_regulamento = objectFrom(source, ["documento_regulamento"]);
    if (!Object.keys(normalized.documento_regulamento).length) normalized.documento_regulamento = objectFrom(row, ["documento_regulamento"]);
    normalized.validacao = objectFrom(source, ["validacao", "validacao_config"]);
    normalized.hash_atual = source.hash_atual || row.hash_atual || null;
    normalized.regras_hash_atual = source.regras_hash_atual || row.regras_hash_atual || null;
    return normalized;
  }

  function calculateNetworkCapacity(width, depth) {
    width = integerValue(width, 0);
    depth = Math.max(1, Math.min(10, integerValue(depth, 6)));
    if (width === 0) return { unlimited: true, levels: [], total: null, perLeg: null };
    var levels = [];
    var total = 0;
    var perLeg = 0;
    for (var level = 1; level <= depth; level += 1) {
      var capacity = Math.pow(width, level);
      levels.push(capacity);
      total += capacity;
      perLeg += Math.pow(width, level - 1);
    }
    return { unlimited: false, levels: levels, total: total, perLeg: perLeg };
  }

  function formatCapacity(value) {
    if (value == null) return legendaMmn("legenda_mmn_rotulo_ilimitada");
    if (!Number.isFinite(value) || value > Number.MAX_SAFE_INTEGER) return legendaMmn("legenda_mmn_acima_do_limite_numerico_de_exibicao");
    return formatInteger(value);
  }

  function updateConfigNetworkStructure() {
    var depth = Math.max(1, Math.min(10, integerValue(qs("adminConfigLevelCount").value, 6)));
    var width = integerValue(qs("adminConfigPlacementWidth").value, 0);
    qsa("[data-level-row]").forEach(function (row) {
      var outside = integerValue(row.dataset.levelNumber) > depth;
      row.classList.toggle("is-outside-depth", outside);
      row.setAttribute("aria-disabled", outside ? "true" : "false");
      qsa("[data-level-field]", row).forEach(function (field) { field.disabled = outside; });
    });
    var capacity = calculateNetworkCapacity(width, depth);
    var summary = qs("adminNetworkCapacity");
    if (summary) {
      if (width === 0) {
        apresentarMmn(summary,"innerHTML",function(){return ("<strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_largura_ilimitada")) + ("</strong><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_sem_limite")))) + escapeHtml(depth) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_niveis_sufixo")) + "</span>");});
      } else if (width >= 2) {
        var levelSummary = capacity.levels.map(function (value, index) { return "N" + (index + 1) + ": " + formatCapacity(value); }).join(" · ");
        apresentarMmn(summary,"innerHTML",function(){return ("<strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_capacidade_teorica_da_matriz")) + "</strong><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_por_nivel_w")) + "<sup>d</sup>): ") + escapeHtml(levelSummary) + ("</span><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_rede_ate"))) + escapeHtml(depth) + ": " + escapeHtml(formatCapacity(capacity.total)) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_posicoes")) + "</span><span>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_capacidade_perna"))) + escapeHtml(formatCapacity(capacity.perLeg)) + (escapeHtml(legendaMmn("legenda_fechamento_mmn_posicoes")) + "</span>");});
      } else {
        apresentarMmn(summary,"innerHTML",function(){return "<strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_configuracao_invalida")) + "</strong><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_use_0_para_ilimitada_ou_um_inteiro_a_partir_de_2")) + "</span>";});
      }
    }
  }

  function validateConfigNetworkStructure(showStatus) {
    var fields = [qs("adminConfigLevelCount"), qs("adminConfigPlacementWidth")].concat(qsa("[data-level-field], [data-rank-field]"));
    fields.forEach(function (field) { if (field && typeof field.setCustomValidity === "function") field.setCustomValidity(""); });
    var depthValue = Number(qs("adminConfigLevelCount").value);
    var widthValue = Number(qs("adminConfigPlacementWidth").value);
    var message = "";
    var invalidField = null;
    function invalidate(field, text) {
      if (message) return;
      message = text;
      invalidField = field;
      if (field && typeof field.setCustomValidity === "function") field.setCustomValidity(text);
    }
    if (!Number.isInteger(depthValue) || depthValue < 1 || depthValue > 10) invalidate(qs("adminConfigLevelCount"), legendaMmn("legenda_mmn_a_quantidade_de_niveis_deve_ser_um_inteiro_de_1_a_10"));
    if (!Number.isInteger(widthValue) || widthValue < 0 || widthValue === 1 || widthValue > 2147483647) invalidate(qs("adminConfigPlacementWidth"), legendaMmn("legenda_mmn_a_largura_deve_ser_0_para_ilimitada_ou_um_inteiro_de_2_a"));
    var depth = Number.isInteger(depthValue) ? depthValue : 6;
    var width = Number.isInteger(widthValue) ? widthValue : 0;
    var capacity = calculateNetworkCapacity(width, depth);
    if (!message && width >= 2) {
      qsa("[data-level-row]").some(function (row) {
        var level = integerValue(row.dataset.levelNumber);
        if (level > depth) return false;
        var activeField = row.querySelector("[data-level-field=\"ativo\"]");
        if (activeField && activeField.value !== "true") return false;
        var directs = row.querySelector("[data-level-field=\"min_diretos_ativos\"]");
        var legs = row.querySelector("[data-level-field=\"min_pernas_qualificadas\"]");
        var perLeg = row.querySelector("[data-level-field=\"min_ativos_por_perna\"]");
        if (numberValue(directs.value) > width) invalidate(directs, legendaMmn("legenda_mmn_no_nivel") + level + legendaMmn("legenda_mmn_diretos_ativos_minimos_nao_pode_superar_a_largura_atual_de") + width + ".");
        else if (numberValue(legs.value) > width) invalidate(legs, legendaMmn("legenda_mmn_no_nivel") + level + legendaMmn("legenda_mmn_pernas_qualificadas_nao_pode_superar_a_largura_atual_de") + width + ".");
        else if (Number.isFinite(capacity.perLeg) && numberValue(perLeg.value) > capacity.perLeg) invalidate(perLeg, legendaMmn("legenda_mmn_no_nivel") + level + legendaMmn("legenda_mmn_ativos_minimos_por_perna_supera_a_capacidade_teorica_de") + formatCapacity(capacity.perLeg) + ".");
        else if (Number.isFinite(capacity.total) && numberValue(legs.value) * numberValue(perLeg.value) > capacity.total) invalidate(perLeg, legendaMmn("legenda_mmn_no_nivel") + level + legendaMmn("legenda_mmn_a_combinacao_de_pernas_e_ativos_por_perna_supera_a_capacidade_total_de") + formatCapacity(capacity.total) + ".");
        return !!message;
      });
      if (!message) qsa("[data-rank-row]").some(function (row) {
        var activeField = row.querySelector("[data-rank-field=\"ativo\"]");
        if (activeField && activeField.value !== "true") return false;
        var name = (row.querySelector("[data-rank-field=\"nome\"]") || {}).value || "rank";
        var directs = row.querySelector("[data-rank-field=\"min_diretos_ativos\"]");
        var network = row.querySelector("[data-rank-field=\"min_rede_ativa\"]");
        var concentration = row.querySelector("[data-rank-field=\"max_percentual_maior_perna\"]");
        if (numberValue(directs.value) > width) invalidate(directs, legendaMmn("legenda_mmn_no_rank") + name + legendaMmn("legenda_mmn_diretos_ativos_minimos_nao_pode_superar_a_largura_atual_de") + width + ".");
        else if (Number.isFinite(capacity.total) && numberValue(network.value) > capacity.total) invalidate(network, legendaMmn("legenda_mmn_no_rank") + name + legendaMmn("legenda_mmn_a_rede_ativa_minima_supera_a_capacidade_teorica_de") + formatCapacity(capacity.total) + ".");
        else if (numberValue(network.value) > 0 && numberValue(concentration.value) < 100 / width) invalidate(concentration, legendaMmn("legenda_mmn_no_rank") + name + legendaMmn("legenda_mmn_a_maior_perna_nao_pode_ter_limite_inferior_ao_minimo_teorico_de") + formatPercent(100 / width) + legendaMmn("legenda_mmn_complemento_para_largura") + width + ".");
        return !!message;
      });
    }
    if (showStatus && message) setStatus("adminConfigStatus", message, "error");
    return { valid: !message, message: message, field: invalidField };
  }

  function renderConfigRows(config) {
    var existingLevels = listFrom(config, ["niveis", "percentuais_nivel"]);
    var depth = Math.max(1, Math.min(10, integerValue(firstDefined([config.quantidade_niveis, objectFrom(config, ["parametros"]).quantidade_niveis], 6), 6)));
    var levels = [];
    for (var level = 1; level <= 10; level += 1) {
      var existing = existingLevels.find(function (row) { return integerValue(row.nivel) === level; });
      levels.push(Object.assign({ nivel: level, percentual: 0, min_diretos_ativos: 0, min_pernas_qualificadas: 0, min_ativos_por_perna: 0, ativo: level <= depth }, existing || {}));
    }
    apresentarMmn(qs("adminLevelConfig"),"innerHTML",function(){return levels.map(function (row) {
      return "<div class=\"mmn-config-row\" data-level-row data-level-number=\"" + escapeHtml(row.nivel) + ("\"><strong>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_nivel"))) + escapeHtml(row.nivel) + ("</strong><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_percentual")) + "</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-level-field=\"percentual\" value=\"") + escapeHtml(firstDefined([row.percentual], 0)) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_diretos_ativos_minimos")) + "</span><input type=\"number\" min=\"0\" data-level-field=\"min_diretos_ativos\" value=\"") + escapeHtml(firstDefined([row.min_diretos_ativos], 0)) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_pernas_qualificadas_minimas")) + "</span><input type=\"number\" min=\"0\" data-level-field=\"min_pernas_qualificadas\" value=\"") + escapeHtml(firstDefined([row.min_pernas_qualificadas], 0)) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ativos_minimos_por_perna")) + "</span><input type=\"number\" min=\"0\" data-level-field=\"min_ativos_por_perna\" value=\"") + escapeHtml(firstDefined([row.min_ativos_por_perna], 0)) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ativo")) + "</span><select data-level-field=\"ativo\"><option value=\"true\" ") + (booleanValue(row.ativo, true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_sim")) + "</option><option value=\"false\" ") + (!booleanValue(row.ativo, true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nao")) + "</option></select></label></div>");
    }).join("");});
    var ranks = listFrom(config, ["ranks"]);
    apresentarMmn(qs("adminRankConfig"),"innerHTML",function(){return ranks.map(rankRowHtml).join("") || emptyHtml(legendaMmn("legenda_mmn_nenhum_rank_configurado"));});
    var groups = listFrom(config, ["grupos_isentos", "grupos"]);
    apresentarMmn(qs("adminGroupConfig"),"innerHTML",function(){return groups.map(groupRowHtml).join("") || emptyHtml(legendaMmn("legenda_mmn_nenhum_grupo_isento_configurado"));});
    var taxes = listFrom(config, ["retencoes", "taxas"]);
    apresentarMmn(qs("adminTaxConfig"),"innerHTML",function(){return taxes.map(taxRowHtml).join("") || emptyHtml(legendaMmn("legenda_mmn_nenhuma_retencao_configurada"));});
    var approvers = listFrom(config, ["aprovadores"]);
    var actionNames = { publicacao: legendaMmn("legenda_mmn_publicacao"), fechamento: legendaMmn("legenda_mmn_rotulo_fechamento"), pagamento: legendaMmn("legenda_mmn_rotulo_pagamento"), reabertura: legendaMmn("legenda_mmn_rotulo_reabertura") };
    apresentarMmn(qs("adminApproverList"),"innerHTML",function(){return approvers.length ? approvers.map(function (row) {
      var identity = row.uid_admin ? (legendaMmn("legenda_mmn_rotulo_uid") + row.uid_admin) : (legendaMmn("legenda_mmn_rotulo_perfil") + (row.perfil_chave || "—"));
      return "<div class=\"mmn-config-row\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(identity) + "</strong><small>" + escapeHtml(actionNames[row.acao] || row.acao || legendaMmn("legenda_mmn_rotulo_pagamento")) + "</small></div>" + pillHtml(row.ativo ? "ativo" : "bloqueado", row.ativo ? legendaMmn("legenda_mmn_rotulo_ativo") : legendaMmn("legenda_mmn_rotulo_inativo")) + "</div>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_nenhum_aprovador_adicional_configurado"));});
    updateConfigNetworkStructure();
    validateConfigNetworkStructure(false);
  }

  function rankRowHtml(row) {
    return "<div class=\"mmn-config-row\" data-rank-row data-rank-id=\"" + escapeHtml(row.cod_mmn_config_rank || row.id || "") + ("\"><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_chave")) + "</span><input data-rank-field=\"chave\" value=\"") + escapeHtml(row.chave || "") + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nome")) + "</span><input data-rank-field=\"nome\" value=\"") + escapeHtml(row.nome || "") + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_rede_ativa_minima")) + "</span><input type=\"number\" min=\"0\" data-rank-field=\"min_rede_ativa\" value=\"") + escapeHtml(row.min_rede_ativa || 0) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_diretos_ativos_minimos")) + "</span><input type=\"number\" min=\"0\" data-rank-field=\"min_diretos_ativos\" value=\"") + escapeHtml(row.min_diretos_ativos || 0) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_maximo_da_maior_perna")) + "</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-rank-field=\"max_percentual_maior_perna\" value=\"") + escapeHtml(firstDefined([row.max_percentual_maior_perna], 60)) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_bonus_de_lideranca")) + "</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-rank-field=\"bonus_percentual\" value=\"") + escapeHtml(row.bonus_percentual || 0) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_coeficiente_pool")) + "</span><input type=\"number\" min=\"0\" step=\"0.001\" data-rank-field=\"pool_coeficiente\" value=\"") + escapeHtml(row.pool_coeficiente || 0) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ativo")) + "</span><select data-rank-field=\"ativo\"><option value=\"true\" ") + (booleanValue(row.ativo, true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_sim")) + "</option><option value=\"false\" ") + (!booleanValue(row.ativo, true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nao")) + "</option></select></label><button class=\"btn btn-ghost\" type=\"button\" data-remove-row>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_remover")) + "</button></div>");
  }

  function groupRowHtml(row) {
    return "<div class=\"mmn-config-row\" data-group-row data-group-id=\"" + escapeHtml(row.cod_mmn_config_grupo || row.id || "") + ("\"><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_grupo")) + "</span><input data-group-field=\"grupo_chave\" value=\"") + escapeHtml(row.grupo_chave || row.chave || "") + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_dispensa_premium")) + "</span><select data-group-field=\"dispensa_premium\"><option value=\"true\" ") + (booleanValue(firstDefined([row.dispensa_premium, row.isento_premium], true), true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_sim")) + "</option><option value=\"false\" ") + (!booleanValue(firstDefined([row.dispensa_premium, row.isento_premium], true), true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nao")) + "</option></select></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ativo")) + "</span><select data-group-field=\"ativo\"><option value=\"true\" ") + (booleanValue(row.ativo, true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_sim")) + "</option><option value=\"false\" ") + (!booleanValue(row.ativo, true) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nao")) + "</option></select></label><button class=\"btn btn-ghost\" type=\"button\" data-remove-row>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_remover")) + "</button></div>");
  }

  function taxRowHtml(row) {
    var type = row.tipo || "percentual";
    var parameters = JSON.stringify(row.parametros && typeof row.parametros === "object" ? row.parametros : {}, null, 2);
    return "<div class=\"mmn-tax-row\" data-tax-row data-tax-id=\"" + escapeHtml(row.cod_mmn_config_retencao || row.id || "") + ("\"><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_chave")) + "</span><input data-tax-field=\"chave\" value=\"") + escapeHtml(row.chave || "") + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nome")) + "</span><input data-tax-field=\"nome\" value=\"") + escapeHtml(row.nome || "") + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_tipo")) + "</span><select data-tax-field=\"tipo\"><option value=\"percentual\" ") + (type === "percentual" ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_percentual_mensagem")) + "</option><option value=\"valor_fixo\" ") + (type === "valor_fixo" ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_valor_fixo")) + "</option><option value=\"faixas\" ") + (type === "faixas" ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_faixas")) + "</option></select></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_reter")) + "</span><select data-tax-field=\"reter\"><option value=\"true\" ") + (booleanValue(row.reter, false) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_sim")) + "</option><option value=\"false\" ") + (!booleanValue(row.reter, false) ? "selected" : "") + (">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nao")) + "</option></select></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_aliquota")) + "</span><input type=\"number\" min=\"0\" max=\"100\" step=\"0.001\" data-tax-field=\"aliquota\" value=\"") + escapeHtml(row.aliquota || 0) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_base_minima_r")) + "</span><input type=\"number\" min=\"0\" step=\"0.01\" data-tax-field=\"base_minima_reais\" value=\"") + escapeHtml(numberValue(row.base_minima_centavos) / 100) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_teto_r")) + "</span><input type=\"number\" min=\"0\" step=\"0.01\" data-tax-field=\"teto_reais\" value=\"") + escapeHtml(row.teto_centavos == null ? "" : numberValue(row.teto_centavos) / 100) + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_municipio")) + "</span><input data-tax-field=\"municipio\" value=\"") + escapeHtml(row.municipio || "") + ("\"></label><label class=\"field\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_estado")) + "</span><input data-tax-field=\"estado\" maxlength=\"2\" value=\"") + escapeHtml(row.estado || "") + ("\"></label><label class=\"field wide\"><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_parametros_por_faixa_json")) + "</span><textarea rows=\"5\" data-json-field=\"parametros\">") + escapeHtml(parameters) + ("</textarea><small>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_use_json_valido_para_faixas_limites_e_regras_adicionais")) + "</small></label><button class=\"btn btn-ghost\" type=\"button\" data-remove-row>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_remover")) + "</button></div>");
  }

  function renderAdminRegulationMetadata(regulation) {
    regulation = regulation || {};
    var container = qs("adminRegulationMetadata");
    if (!container) return;
    var version = regulation.versao || regulation.documento_versao || "";
    if (!version && !(regulation.cod_mmn_documento || regulation.id)) {
      apresentarMmn(container,"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_nenhum_regulamento_foi_gerado_para_esta_versao"));});
      return;
    }
    var publicUrl = "../../regulamento-mmn.html" + (version ? "?versao=" + encodeURIComponent(version) : "");
    apresentarMmn(container,"innerHTML",function(){return ("<div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_versao")) + "</span><strong>") + escapeHtml(version || "—") + ("</strong></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_status")) + "</span><strong>") + escapeHtml(regulation.status || "rascunho") + ("</strong></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_atualizacao")) + "</span><strong>") + escapeHtml(formatDate(regulation.atualizado_em || regulation.criado_em, true)) + ("</strong></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_publicacao")) + "</span><strong>") + escapeHtml(formatDate(regulation.publicado_em, true)) + ("</strong></div><div><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_vigencia")) + "</span><strong>") + escapeHtml(formatDate(regulation.vigencia_inicio || regulation.vigente_desde, false)) + "</strong></div><a class=\"btn btn-ghost btn-small\" href=\"" + escapeHtml(publicUrl) + ("\" target=\"_blank\" rel=\"noopener\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_abrir_versao_historico")) + "</a>");});
  }

  function renderAdminRegulationPreview(data) {
    var container = qs("adminRegulationPreview");
    if (!container) return;
    var source = data || {};
    var documentRow = objectFrom(source, ["documento", "regulamento"]);
    var snapshot = objectFrom(source, ["snapshot", "conteudo_snapshot", "configuracao", "regras"]);
    if (!Object.keys(snapshot).length) snapshot = objectFrom(documentRow, ["snapshot", "conteudo_snapshot"]);
    if (!Object.keys(documentRow).length) documentRow = objectFrom(snapshot, ["documento"]);
    var htmlDocument = firstDefined([source.conteudo_html, source.html, documentRow.conteudo_html], "");
    if (htmlDocument) {
      container.innerHTML = "";
      var iframe = document.createElement("iframe");
      iframe.className = "mmn-regulation-frame";
      iframe.setAttribute("sandbox", "");
      iframe.setAttribute("title", legendaMmn("legenda_mmn_complemento_pre_visualizacao_do_regulamento"));
      iframe.setAttribute("data-legenda-atributos",JSON.stringify({title:"legenda_mmn_complemento_pre_visualizacao_do_regulamento"}));
      iframe.srcdoc = String(htmlDocument);
      container.appendChild(iframe);
      return;
    }
    var parameters = Object.assign({},
      objectFrom(snapshot, ["estrutura"]),
      objectFrom(snapshot, ["financeiro"]),
      objectFrom(snapshot, ["pagamentos"]),
      objectFrom(snapshot, ["operacional"]),
      objectFrom(snapshot, ["parametros"]),
      snapshot
    );
    var levels = listFrom(snapshot, ["niveis", "percentuais_nivel"]);
    var ranks = listFrom(snapshot, ["ranks"]);
    var depth = Math.max(1, Math.min(10, integerValue(firstDefined([parameters.quantidade_niveis], 6), 6)));
    levels = levels.filter(function (row) { return integerValue(row.nivel) <= depth; });
    function tituloRegulamentoLegenda(){return documentRow.titulo || source.titulo || legendaMmn("legenda_mmn_regulamento_de_indicacoes_e_beneficios");}
    apresentarMmn(container,"innerHTML",function(){return "<article><h4>" + escapeHtml(tituloRegulamentoLegenda()) + ("</h4><p>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_versao"))) + escapeHtml(documentRow.versao || source.versao || "—") + (escapeHtml(legendaMmn("legenda_fechamento_mmn_modelo_juridico")) + "</p><div class=\"mmn-regulation-preview-grid\"><span><strong>") + escapeHtml(depth) + ("</strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_niveis")) + "</span><span><strong>") + escapeHtml(integerValue(parameters.largura_maxima_posicionamento, 0) === 0 ? legendaMmn("legenda_mmn_rotulo_ilimitada") : formatInteger(parameters.largura_maxima_posicionamento)) + ("</strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_largura")) + "</span><span><strong>") + escapeHtml(formatPercent(parameters.payout_teto_percentual)) + ("</strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_teto")) + "</span><span><strong>") + escapeHtml(formatMoneyCents(parameters.pagamento_minimo_centavos)) + ("</strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_minimo")) + "</span></div>") + (levels.length ? ("<div class=\"table-wrap\"><table><thead><tr><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nivel")) + "</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_percentual_mensagem")) + "</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_diretos")) + "</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_pernas")) + "</th><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ativos_perna")) + "</th></tr></thead><tbody>") + levels.map(function (row) { return "<tr><td>" + escapeHtml(row.nivel) + "</td><td>" + escapeHtml(formatPercent(row.percentual)) + "</td><td>" + escapeHtml(formatInteger(row.min_diretos_ativos)) + "</td><td>" + escapeHtml(formatInteger(row.min_pernas_qualificadas)) + "</td><td>" + escapeHtml(formatInteger(row.min_ativos_por_perna)) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "") + (ranks.length ? ("<p><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ranks")) + "</strong> ") + ranks.map(function (rank) { return escapeHtml(rank.nome || rank.chave); }).join(" · ") + "</p>" : "") + "</article>";});
  }

  function fillConfigForm(config) {
    config = normalizeConfigResponse(config || {});
    state.admin.selectedConfig = config;
    var company = objectFrom(config, ["dados_empresa"]);
    var values = {
      adminConfigVersionId: config.cod_mmn_config || config.cod_mmn_configuracao || config.id || "",
      adminConfigName: config.nome || "",
      adminConfigEffective: String(config.vigencia_inicio || config.vigencia || "").slice(0, 10),
      adminConfigPayoutCap: firstDefined([config.payout_teto_percentual, config.teto_payout_percentual], 33),
      adminConfigHoldDays: firstDefined([config.carencia_estorno_dias, config.prazo_seguranca_dias], 15),
      adminConfigMinimumPayment: numberValue(firstDefined([config.pagamento_minimo_centavos], 5000)) / 100,
      adminConfigWaitlistDays: firstDefined([config.prazo_conversao_espera_dias, config.lista_espera_prazo_dias], 90),
      adminConfigLevelCount: firstDefined([config.quantidade_niveis], 6),
      adminConfigPlacementWidth: firstDefined([config.largura_maxima_posicionamento], 0),
      adminConfigPaymentsEnabled: String(!booleanValue(firstDefined([config.pagamento_real_bloqueado], !booleanValue(config.pagamentos_reais_liberados, false)), true)),
      adminConfigPaymentMode: config.pagamento_modo || "manual",
      adminConfigApprovalsPublication: firstDefined([config.aprovacoes_publicacao], 1),
      adminConfigApprovalsClosing: firstDefined([config.aprovacoes_fechamento], 1),
      adminConfigApprovalsPayment: firstDefined([config.aprovacoes_pagamento, config.aprovacoes_necessarias], 1),
      adminConfigApprovalsReopen: firstDefined([config.aprovacoes_reabertura], 1),
      adminConfigPoolPercent: firstDefined([config.pool_global_percentual], 2),
      adminConfigClosingDay: firstDefined([config.fechamento_dia], 10),
      adminConfigPaymentDay: firstDefined([config.pagamento_dia], 20),
      adminConfigDisputeDays: firstDefined([config.contestacao_dias_uteis], 5),
      adminConfigPixHoldDays: firstDefined([config.alteracao_pix_carencia_dias], 3),
      adminConfigPremiumRequired: String(booleanValue(firstDefined([config.premium_obrigatorio], true), true)),
      adminConfigUserSimulatorMaxMonths: firstDefined([config.simulador_usuario_max_meses], 24),
      adminConfigAdminSimulatorMaxMonths: firstDefined([config.simulador_admin_max_meses], 60),
      adminProgramName: config.programa_nome || "Programa de Indicações e Benefícios Turbo Tiger",
      adminProgramBeta: String(booleanValue(firstDefined([config.programa_beta], true), true)),
      adminProgramTerritory: config.territorio || "BR",
      adminProgramCurrency: config.moeda || "BRL",
      adminProgramTimezone: config.fuso_horario || "America/Sao_Paulo",
      adminCompanyLegalName: company.razao_social || "",
      adminCompanyCnpj: company.cnpj || "",
      adminCompanyAddress: company.endereco || "",
      adminCompanyRepresentative: company.representante || "",
      adminCompanyPhone: company.telefone || "",
      adminCompanyWhatsapp: company.whatsapp || "",
      adminCompanyFinanceEmail: company.email_financeiro || "",
      adminCompanyPrivacyEmail: company.email_privacidade || "",
      adminConfigReason: ""
    };
    Object.keys(values).forEach(function (id) { if (qs(id)) qs(id).value = values[id]; });
    qs("adminConfigProvider").value = config.pagamento_provedor || config.provedor_pagamento_chave || "";
    var regulation = objectFrom(config, ["documento_regulamento"]);
    var regulationValues = {
      adminRegulationId: regulation.cod_mmn_documento || regulation.id || "",
      adminRegulationVersion: regulation.versao || "",
      adminRegulationTitle: regulation.titulo || "",
      adminRegulationSummary: regulation.conteudo_resumo || "",
      adminRegulationReason: ""
    };
    Object.keys(regulationValues).forEach(function (id) { if (qs(id)) qs(id).value = regulationValues[id]; });
    renderAdminRegulationMetadata(regulation);
    apresentarMmn(qs("adminRegulationPreview"),"innerHTML",function(){return emptyHtml(regulation.cod_mmn_documento || regulation.id ? legendaMmn("legenda_mmn_use_pre_visualizar_para_conferir_o_snapshot_desta_versao") : legendaMmn("legenda_mmn_gere_o_regulamento_depois_de_salvar_as_regras"));});
    renderConfigRows(config);
    qsa(".mmn-version-button").forEach(function (button) { button.classList.toggle("is-active", String(button.dataset.configId) === String(values.adminConfigVersionId)); });
    loadPublicationProgress(integerValue(values.adminConfigVersionId));
  }

  function renderAdminConfig(data) {
    state.admin.config = data;
    var versions = configVersions(data);
    apresentarMmn(qs("adminConfigVersions"),"innerHTML",function(){return versions.length ? versions.map(function (version) {
      return "<button class=\"mmn-version-button " + (version.status === "vigente" ? "is-active" : "") + "\" type=\"button\" data-config-id=\"" + escapeHtml(version.cod_mmn_config || version.cod_mmn_configuracao || version.id) + "\"><strong>" + escapeHtml(version.nome || (legendaMmn("legenda_mmn_versao") + (version.versao || ""))) + "</strong><small>" + escapeHtml(formatDate(version.vigencia_inicio || version.vigencia, false)) + " · " + escapeHtml(version.status || "rascunho") + "</small></button>";
    }).join("") : emptyHtml(legendaMmn("legenda_mmn_nenhuma_versao_de_configuracao"));});
    var selected = normalizeConfigResponse(data);
    if (!selected.cod_mmn_config) selected = normalizeConfigResponse(versions.find(function (version) { return version.status === "vigente"; }) || versions[0] || {});
    fillConfigForm(selected);
    var groups = listFrom(selected || {}, ["grupos_isentos", "grupos"]);
    apresentarMmn(qs("adminParticipantGroup"),"innerHTML",function(){return ("<option value=\"\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_nenhum")) + "</option>") + groups.map(function (group) { return "<option value=\"" + escapeHtml(group.grupo_chave || group.chave || group.id) + "\">" + escapeHtml(group.grupo_chave || group.nome || group.chave) + "</option>"; }).join("");});
    var versionOptions = versions.map(function (version) { return "<option value=\"" + escapeHtml(version.cod_mmn_config || version.cod_mmn_configuracao || version.id) + "\">" + escapeHtml(version.nome || version.versao) + "</option>"; }).join("");
    qs("adminSimVersion").innerHTML = versionOptions;
    qs("adminReplayVersion").innerHTML = versionOptions;
    apresentarMmn(qs("adminSimulationHistoryVersion"),"innerHTML",function(){return ("<option value=\"\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_todas")) + "</option>") + versionOptions;});
  }

  function renderPublicationProgress(data) {
    var container = qs("adminPublicationProgress");
    if (!container) return;
    if (!data || !data.config_id) {
      apresentarMmn(container,"innerHTML",function(){return emptyHtml(legendaMmn("legenda_mmn_salve_o_rascunho_para_consultar_o_progresso"));});
      if (qs("adminConfigActivate")) qs("adminConfigActivate").disabled = true;
      return;
    }
    var documentReady = !!data.documento_regulamento_id;
    var simulationReady = !!data.simulacao_id && data.simulacao_hash === data.config_hash;
    var approvalsReady = numberValue(data.aprovacoes_recebidas) >= numberValue(data.aprovacoes_necessarias, 1);
    var steps = [
      { label: legendaMmn("legenda_mmn_rascunho_salvo"), detail: legendaMmn("legenda_mmn_configuracao") + data.config_id, ready: true },
      { label: legendaMmn("legenda_mmn_regulamento_gerado"), detail: documentReady ? (objectFrom(data, ["documento_regulamento"]).titulo || legendaMmn("legenda_mmn_snapshot") + data.documento_regulamento_id) : legendaMmn("legenda_mmn_gere_o_snapshot_no_servidor"), ready: documentReady },
      { label: legendaMmn("legenda_mmn_simulacao_v2_valida"), detail: simulationReady ? legendaMmn("legenda_mmn_simulacao") + data.simulacao_id + legendaMmn("legenda_mmn_complemento_no_hash_atual") : legendaMmn("legenda_mmn_execute_novamente_apos_qualquer_alteracao"), ready: simulationReady },
      { label: legendaMmn("legenda_mmn_quorum_de_publicacao"), detail: formatInteger(data.aprovacoes_recebidas) + legendaMmn("legenda_mmn_complemento_de") + formatInteger(data.aprovacoes_necessarias), ready: approvalsReady }
    ];
    apresentarMmn(container,"innerHTML",function(){return steps.map(function (step, index) {
      return "<article class=\"mmn-governance-step " + (step.ready ? "is-complete" : "") + "\"><span>" + (step.ready ? "✓" : index + 1) + "</span><div><strong>" + escapeHtml(step.label) + "</strong><small>" + escapeHtml(step.detail) + "</small></div></article>";
    }).join("") + (listFrom(data, ["aprovacoes"]).length ? ("<div class=\"mmn-governance-approvals\"><strong>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_aprovacoes_registradas")) + "</strong>") + listFrom(data, ["aprovacoes"]).map(function (row) { return "<span>" + escapeHtml(formatDate(row.criado_em, true)) + " · " + escapeHtml(row.uid_admin || legendaMmn("legenda_mmn_rotulo_administrador")) + "</span>"; }).join("") + "</div>" : "");});
    if (qs("adminConfigActivate")) qs("adminConfigActivate").disabled = data.status !== "rascunho" || !documentReady || !simulationReady || !booleanValue(data.pode_aprovar, false);
  }

  async function loadPublicationProgress(configId) {
    if (!configId || !(hasCapability("configurar") || hasCapability("auditar"))) {
      renderPublicationProgress(null);
      return null;
    }
    try {
      var data = await rpc(CONFIG.rpcs.adminConfigProgress, { p_config_id: configId });
      if (String(qs("adminConfigVersionId").value) !== String(configId)) return data;
      state.admin.publicationProgress = data;
      renderPublicationProgress(data);
      return data;
    } catch (error) {
      qs("adminPublicationProgress").innerHTML = emptyHtml(friendlyMessage(error.message || error));
      return null;
    }
  }

  function renderAdminPayments(data, append) {
    var rows = listFrom(data, ["lotes", "pagamentos", "itens"]);
    var requestedStatus = qs("adminPaymentStatus") ? qs("adminPaymentStatus").value : "";
    if (requestedStatus) rows = rows.filter(function (row) { return row.status === requestedStatus; });
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var id = row.cod_mmn_lote || row.cod_mmn_pagamento || row.id;
      var action = hasCapability("pagar") && (row.status === "calculado" || row.status === "revisao") ? "aprovar" : (hasCapability("pagar") && row.status === "aprovado" && row.modo === "manual" ? "pago" : "");
      var actionHtml = action ? "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-payment-action=\"" + action + "\" data-payment-id=\"" + escapeHtml(id) + "\">" + escapeHtml(action === "pago" ? legendaMmn("legenda_mmn_registrar_pago") : legendaMmn("legenda_mmn_rotulo_aprovar")) + "</button>" : "—";
      return "<tr><td><strong>Lote #" + escapeHtml(id) + "</strong><br><small>" + escapeHtml(row.competencia || "") + " · " + escapeHtml(row.modo || "manual") + "</small></td><td>" + escapeHtml(formatMoneyCents(centsFrom(row, ["total_bruto_centavos", "bruto_centavos", "valor_bruto_centavos"]))) + "</td><td>" + escapeHtml(formatMoneyCents(centsFrom(row, ["total_retencoes_centavos", "retencoes_centavos", "valor_retencoes_centavos"]))) + "</td><td><strong>" + escapeHtml(formatMoneyCents(centsFrom(row, ["total_liquido_centavos", "liquido_centavos", "valor_liquido_centavos", "total_centavos"]))) + "</strong></td><td>" + escapeHtml(formatInteger(row.aprovacoes_recebidas)) + "/" + escapeHtml(formatInteger(row.aprovacoes_necessarias)) + "</td><td>" + pillHtml(row.rpa_status || (row.simulacao ? "simulacao" : "pendente")) + "</td><td>" + pillHtml(row.status) + "</td><td>" + actionHtml + "</td></tr>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminPaymentsBody"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminPaymentsBody"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyTableHtml(8, legendaMmn("legenda_mmn_nenhum_pagamento_encontrado"));});
    state.admin.cursors.payments = data.next_cursor || data.proximo_cursor || null;
    qs("adminPaymentsMore").hidden = !state.admin.cursors.payments;
  }

  function renderAdminRpas(data, append) {
    var rows = listFrom(data, ["itens"]);
    var summary = objectFrom(data, ["resumo"]);
    apresentarMmn(qs("adminRpaSummary"),"innerHTML",function(){return [
      [legendaMmn("legenda_mmn_beneficiarios"), summary.beneficiarios],
      [legendaMmn("legenda_mmn_aguardando_rpa"), summary.aguardando_rpa],
      [legendaMmn("legenda_mmn_rotulo_rascunhos"), summary.rpas_rascunho],
      [legendaMmn("legenda_mmn_rotulo_emitidos"), summary.rpas_emitidos],
      [legendaMmn("legenda_mmn_rotulo_pagos"), summary.rpas_pagos]
    ].map(function (item) { return "<article class=\"mmn-payment-card\"><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(formatInteger(item[1])) + "</strong></article>"; }).join("");});
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var documentStatus = row.rpa_status || (row.rpa_id ? "rascunho" : "pendente");
      var transferStatus = row.pagamento_saida_status || (row.beneficiario_status === "pago" ? "confirmado" : "aguardando_rpa");
      return "<tr><td><strong>" + escapeHtml(firstDefined([row.loginuser, row.usuario_loginuser, row.login, row.nome], legendaMmn("legenda_mmn_usuario"))) + "</strong><br><small>" + escapeHtml(row.cpf_mascarado || "") + " · PIX " + escapeHtml(row.pix_mascarado || "—") + "</small></td><td>" + escapeHtml(String(row.competencia || "").slice(0, 7)) + "<br><small>Lote #" + escapeHtml(row.id_lote) + " · " + escapeHtml(row.modo || "") + "</small></td><td><strong>" + escapeHtml(formatMoneyCents(row.valor_liquido_centavos)) + "</strong><br><small>Bruto " + escapeHtml(formatMoneyCents(row.valor_bruto_centavos)) + legendaMmn("legenda_mmn_retencoes_prefixo") + escapeHtml(formatMoneyCents(row.retencoes_centavos)) + "</small></td><td>" + pillHtml(documentStatus) + "<br><small>" + escapeHtml(row.rpa_numero || legendaMmn("legenda_mmn_sem_numero")) + "</small></td><td>" + pillHtml(transferStatus) + "<br><small>" + escapeHtml(row.provedor_chave || "manual") + "</small></td><td><button class=\"btn btn-ghost btn-small\" type=\"button\" data-rpa-detail=\"" + escapeHtml(row.cod_mmn_lote_beneficiario) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_detalhes")) + "</button></td></tr>");
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminRpaBody"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminRpaBody"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyTableHtml(6, legendaMmn("legenda_mmn_nenhum_beneficiario_encontrado_na_fila_fiscal"));});
    state.admin.cursors.rpas = data.next_cursor || null;
    qs("adminRpaMore").hidden = data.has_more === false || !state.admin.cursors.rpas;
  }

  function renderAdminRpaDetail(data) {
    var beneficiary = objectFrom(data, ["beneficiario"]);
    var rpa = objectFrom(data, ["rpa"]);
    var output = objectFrom(data, ["pagamento_saida"]);
    state.admin.selectedRpa = data;
    qs("adminRpaBeneficiaryId").value = beneficiary.id || "";
    apresentarTextoMmn("adminRpaEditorTitle",function(){return (beneficiary.nome || legendaMmn("legenda_mmn_beneficiario")) + " · " + String(beneficiary.competencia || "").slice(0, 7);});
    qs("adminRpaNumber").value = rpa.numero || "";
    qs("adminRpaDocumentRef").value = rpa.documento_ref || "";
    qs("adminRpaDocumentHash").value = rpa.documento_hash || "";
    qs("adminRpaReason").value = "";
    apresentarMmn(qs("adminRpaDetail"),"innerHTML",function(){return [
      [legendaMmn("legenda_mmn_rotulo_titular"), (beneficiary.nome || "—") + " · " + (beneficiary.cpf_mascarado || "")],
      ["PIX", (beneficiary.pix_tipo || "") + " · " + (beneficiary.pix_mascarado || "—")],
      [legendaMmn("legenda_mmn_rotulo_valores"), legendaMmn("legenda_mmn_rotulo_bruto") + formatMoneyCents(beneficiary.bruto_centavos) + legendaMmn("legenda_mmn_retencoes_prefixo") + formatMoneyCents(beneficiary.retencoes_centavos) + legendaMmn("legenda_mmn_liquido") + formatMoneyCents(beneficiary.liquido_centavos)],
      ["RPA", (rpa.numero || legendaMmn("legenda_mmn_ainda_nao_registrado")) + " · " + (rpa.status || "pendente")],
      [legendaMmn("legenda_mmn_transferencia"), output.status || beneficiary.status || "pendente"],
      [legendaMmn("legenda_mmn_rotulo_comprovante"), beneficiary.comprovante_ref || legendaMmn("legenda_mmn_ainda_nao_confirmado")]
    ].map(function (item) { return "<div><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></div>"; }).join("");});
    var canOperate = hasCapability("financeiro") || hasCapability("pagar");
    qs("adminRpaRegister").hidden = !canOperate || ["pago", "cancelado", "emitido"].indexOf(rpa.status) >= 0;
    qs("adminRpaEmit").hidden = !canOperate || !rpa.cod_mmn_rpa || ["pago", "cancelado"].indexOf(rpa.status) >= 0;
    qs("adminRpaEditor").hidden = false;
    qs("adminRpaEditor").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderAdminSupport(data, append) {
    var rows = listFrom(data, ["ocorrencias", "tickets", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      return "<article class=\"mmn-ticket\"><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.assunto || row.tipo || legendaMmn("legenda_mmn_ocorrencia")) + "</strong><small>#" + escapeHtml(row.cod_mmn_ocorrencia || row.id || "") + " · " + escapeHtml(row.usuario_nome || row.usuario_codinome || row.usuario || "") + "</small></div><span>" + escapeHtml(row.prioridade || "normal") + "</span>" + pillHtml(row.status) + "<button class=\"btn btn-ghost btn-small\" type=\"button\" data-support-action=\"em_analise\" data-support-id=\"" + escapeHtml(row.cod_mmn_ocorrencia || row.id) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_analisar")) + "</button></article>");
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminSupportList"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminSupportList"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_nenhuma_ocorrencia_encontrada"));});
    state.admin.cursors.support = data.next_cursor || data.proximo_cursor || null;
    qs("adminSupportMore").hidden = data.has_more === false || !state.admin.cursors.support;
  }

  function renderAdminAudit(data, append) {
    var rows = listFrom(data, ["auditoria", "eventos", "itens"]);
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      return "<article class=\"mmn-audit-row\"><span>" + escapeHtml(formatDate(row.criado_em, true)) + "</span><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.acao || legendaMmn("legenda_mmn_alteracao")) + "</strong><small>" + escapeHtml(row.alvo_tipo || "") + " " + escapeHtml(row.alvo_id || "") + "</small></div><span>" + escapeHtml(row.motivo || row.resumo || row.justificativa || "—") + "</span><span>" + escapeHtml(row.uid_ator || row.id_usuario_ator || row.admin_nome || row.autor || legendaMmn("legenda_mmn_rotulo_sistema")) + "</span></article>";
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminAuditList"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminAuditList"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_nenhum_evento_de_auditoria_encontrado"));});
    state.admin.cursors.audit = data.next_cursor || data.proximo_cursor || null;
    qs("adminAuditMore").hidden = data.has_more === false || !state.admin.cursors.audit;
  }

  async function loadAdminTab(tab, append) {
    try {
      setGlobalError(null);
      var dashboard = state.admin.dashboard || {};
      if (tab === "competencias") {
        var periods = listFrom(dashboard, ["competencias", "periodos"]);
        if (!periods.length && dashboard.periodo && typeof dashboard.periodo === "object") periods = [dashboard.periodo];
        renderAdminPeriods({ competencias: periods }, false);
      } else if (tab === "participantes") {
        var query = qs("adminParticipantQuery").value.trim().toLowerCase();
        var eligibility = qs("adminParticipantEligibility").value;
        var participantsResponse = await rpc(CONFIG.rpcs.adminParticipantsList, {
          p_cursor: append ? state.admin.cursors.participants : null,
          p_limite: CONFIG.pageSize,
          p_busca: query || null,
          p_status: eligibility || null
        });
        renderAdminParticipants(participantsResponse, append);
      } else if (tab === "espera") {
        var waitQuery = qs("adminWaitlistQuery").value.trim();
        var waitStatus = qs("adminWaitlistStatus").value;
        var waitResponse = await rpc(CONFIG.rpcs.adminWaitlistList, {
          p_cursor: append ? state.admin.cursors.waitlist : null,
          p_limite: CONFIG.pageSize,
          p_busca: waitQuery || null,
          p_status: waitStatus || null
        });
        renderAdminWaitlist(waitResponse, append);
      } else if (tab === "receitas") {
        var revenuePeriod = qs("adminRevenuePeriod").value;
        var revenueType = qs("adminRevenueType").value;
        var revenueStatus = qs("adminRevenueStatus").value;
        var revenueResponse = await rpc(CONFIG.rpcs.adminRevenueList, {
          p_cursor: append ? state.admin.cursors.revenue : null,
          p_limite: CONFIG.pageSize,
          p_competencia: monthDate(revenuePeriod),
          p_status: revenueStatus || null
        });
        revenueResponse.itens = listFrom(revenueResponse, ["itens"]).filter(function (row) {
          return !revenueType || (revenueType === "comissao" ? row.gera_comissao === true : row.gera_comissao === false);
        });
        renderAdminRevenue(revenueResponse, append);
      } else if (tab === "configuracoes") {
        var currentConfig = objectFrom(dashboard, ["config", "configuracao"]);
        var configData = objectFrom(currentConfig, ["dados"]);
        var configId = currentConfig.id || configData.cod_mmn_config || currentConfig.cod_mmn_config || currentConfig.cod_mmn_configuracao || null;
        var configDetail = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: configId });
        if (!Array.isArray(configDetail.versoes)) configDetail.versoes = listFrom(dashboard, ["versoes"]);
        renderAdminConfig(configDetail);
      } else if (tab === "pagamentos") {
        var paymentPeriod = qs("adminPaymentPeriod").value;
        var paymentStatus = qs("adminPaymentStatus").value;
        var batches = listFrom(dashboard, ["lotes", "pagamentos"]).filter(function (row) {
          return (!paymentPeriod || String(row.competencia || row.periodo || "").slice(0, 7) === paymentPeriod) && (!paymentStatus || row.status === paymentStatus);
        });
        renderAdminPayments({ lotes: batches }, false);
        var rpaResponse = await rpc(CONFIG.rpcs.adminRpasList, {
          p_cursor: append ? state.admin.cursors.rpas : null,
          p_limite: CONFIG.pageSize,
          p_competencia: monthDate(paymentPeriod),
          p_status: qs("adminRpaStatus").value || null
        });
        renderAdminRpas(rpaResponse, append);
      } else if (tab === "suporte") {
        var supportQuery = qs("adminSupportQuery").value.trim();
        var supportStatus = qs("adminSupportStatus").value;
        var supportResponse = await rpc(CONFIG.rpcs.adminOccurrencesList, {
          p_cursor: append ? state.admin.cursors.support : null,
          p_limite: CONFIG.pageSize,
          p_busca: supportQuery || null,
          p_status: supportStatus || null
        });
        renderAdminSupport(supportResponse, append);
      } else if (tab === "auditoria") {
        var auditQuery = qs("adminAuditQuery").value.trim().toLowerCase();
        var from = qs("adminAuditFrom").value;
        var to = qs("adminAuditTo").value;
        var auditResponse = await rpc(CONFIG.rpcs.adminAuditList, {
          p_cursor: append ? state.admin.cursors.audit : null,
          p_limite: CONFIG.pageSize,
          p_acao: auditQuery || null
        });
        auditResponse.itens = listFrom(auditResponse, ["itens"]).filter(function (row) {
          var date = String(row.criado_em || "").slice(0, 10);
          var searchable = [row.acao, row.alvo_tipo, row.alvo_id, row.motivo, row.uid_ator, row.id_usuario_ator].join(" ").toLowerCase();
          return (!from || date >= from) && (!to || date <= to) && (!auditQuery || searchable.indexOf(auditQuery) >= 0);
        });
        renderAdminAudit(auditResponse, append);
      }
      state.admin.loaded[tab] = true;
    } catch (error) {
      setGlobalError(error);
    }
  }

  function activateAdminTab(tab) {
    qsa("[data-admin-tab]").forEach(function (button) {
      var active = button.getAttribute("data-admin-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa("[data-admin-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-admin-panel") !== tab;
    });
    if (["competencias", "participantes", "espera", "receitas", "configuracoes", "pagamentos", "suporte", "auditoria"].indexOf(tab) >= 0 && !state.admin.loaded[tab]) loadAdminTab(tab, false);
  }

  function collectProfile(prefix) {
    var address = addressContext(prefix);
    var selectedState = address.selectedState || {};
    var selectedCity = address.selectedCity || {};
    var cityName = cleanText(qs(prefix + "City").value);
    var uf = cleanText(firstDefined([selectedState.uf, qs(prefix + "State").value], "")).toUpperCase();
    return {
      pix_tipo: qs(prefix + "PixType").value,
      pix_chave: qs(prefix + "PixKey").value.trim(),
      cep: digitsOnly(qs(prefix + "PostalCode").value).slice(0, 8),
      logradouro: qs(prefix + "Address").value.trim(),
      numero: qs(prefix + "AddressNumber").value.trim(),
      complemento: qs(prefix + "AddressExtra").value.trim(),
      bairro: qs(prefix + "District").value.trim(),
      cidade: cityName,
      cidade_nome: cityName,
      cidade_ibge: cleanText(selectedCity.ibge),
      id_cidade: firstDefined([selectedCity.cod_cidade, selectedCity.id_cidade], null),
      cod_cidade: firstDefined([selectedCity.cod_cidade, selectedCity.id_cidade], null),
      uf: uf,
      id_estado: firstDefined([selectedState.cod_estado, selectedState.id_estado, selectedCity.cod_estado, selectedCity.id_estado], null),
      cod_estado: firstDefined([selectedState.cod_estado, selectedState.id_estado, selectedCity.cod_estado, selectedCity.id_estado], null),
      nit: qs(prefix + "Nit").value.trim(),
      pix_mesmo_cpf: currentPixIsPersisted(prefix)
    };
  }

  function collectRows(selector, fieldAttribute) {
    return qsa(selector).map(function (row) {
      var result = { id: row.dataset.rankId || row.dataset.groupId || row.dataset.taxId || null };
      qsa("[" + fieldAttribute + "]", row).forEach(function (input) {
        var key = input.getAttribute(fieldAttribute);
        var value = input.value;
        if (input.type === "number") value = key === "teto_reais" && value === "" ? "" : numberValue(value);
        if (value === "true" || value === "false") value = value === "true";
        result[key] = value;
      });
      qsa("[data-json-field]", row).forEach(function (input) {
        var key = input.getAttribute("data-json-field");
        var value = input.value.trim();
        try {
          result[key] = value ? JSON.parse(value) : {};
        } catch (error) {
          throw new Error(legendaMmn("legenda_mmn_json_invalido_na_retencao") + (result.nome || result.chave || legendaMmn("legenda_mmn_complemento_sem_nome")) + ".");
        }
      });
      return result;
    });
  }

  function mergeCollectedRows(collected, previousRows, idKeys, keyKeys) {
    return collected.map(function (row) {
      var previous = (previousRows || []).find(function (candidate) {
        var candidateId = firstDefined(idKeys.map(function (key) { return candidate[key]; }), null);
        if (row.id && candidateId != null && String(row.id) === String(candidateId)) return true;
        return keyKeys.some(function (key) {
          return row[key] && candidate[key] && String(row[key]).toLowerCase() === String(candidate[key]).toLowerCase();
        });
      }) || {};
      return Object.assign({}, previous, row);
    });
  }

  function ensureUniqueOrder(rows) {
    var used = {};
    var next = 1;
    return rows.map(function (row) {
      var order = integerValue(row.ordem, 0);
      if (order <= 0 || used[order]) {
        while (used[next]) next += 1;
        order = next;
      }
      used[order] = true;
      next = Math.max(next, order + 1);
      return Object.assign({}, row, { ordem: order });
    });
  }

  function collectConfig() {
    var selected = state.admin.selectedConfig || {};
    var parameters = Object.assign({}, selected.parametros || {});
    parameters.payout_teto_percentual = numberValue(qs("adminConfigPayoutCap").value);
    parameters.carencia_estorno_dias = integerValue(qs("adminConfigHoldDays").value);
    parameters.pagamento_minimo_centavos = Math.round(numberValue(qs("adminConfigMinimumPayment").value) * 100);
    parameters.prazo_conversao_espera_dias = integerValue(qs("adminConfigWaitlistDays").value);
    parameters.quantidade_niveis = integerValue(qs("adminConfigLevelCount").value, 6);
    parameters.largura_maxima_posicionamento = integerValue(qs("adminConfigPlacementWidth").value, 0);
    parameters.pagamento_real_bloqueado = qs("adminConfigPaymentsEnabled").value !== "true";
    parameters.pagamento_modo = qs("adminConfigPaymentMode").value;
    parameters.pagamento_provedor = qs("adminConfigProvider").value.trim();
    parameters.aprovacoes_publicacao = integerValue(qs("adminConfigApprovalsPublication").value);
    parameters.aprovacoes_fechamento = integerValue(qs("adminConfigApprovalsClosing").value);
    parameters.aprovacoes_pagamento = integerValue(qs("adminConfigApprovalsPayment").value);
    parameters.aprovacoes_reabertura = integerValue(qs("adminConfigApprovalsReopen").value);
    delete parameters.rank_min_diretos_ativos;
    delete parameters.diretos_com_10_ativos_minimos;
    parameters.pool_global_percentual = numberValue(qs("adminConfigPoolPercent").value);
    parameters.fechamento_dia = integerValue(qs("adminConfigClosingDay").value);
    parameters.pagamento_dia = integerValue(qs("adminConfigPaymentDay").value);
    parameters.contestacao_dias_uteis = integerValue(qs("adminConfigDisputeDays").value);
    parameters.alteracao_pix_carencia_dias = integerValue(qs("adminConfigPixHoldDays").value);
    parameters.premium_obrigatorio = qs("adminConfigPremiumRequired").value === "true";
    parameters.simulador_usuario_max_meses = integerValue(qs("adminConfigUserSimulatorMaxMonths").value);
    parameters.simulador_admin_max_meses = integerValue(qs("adminConfigAdminSimulatorMaxMonths").value);
    parameters.programa_nome = qs("adminProgramName").value.trim();
    parameters.programa_beta = qs("adminProgramBeta").value === "true";
    parameters.territorio = qs("adminProgramTerritory").value.trim().toUpperCase();
    parameters.moeda = qs("adminProgramCurrency").value.trim().toUpperCase();
    parameters.fuso_horario = qs("adminProgramTimezone").value.trim();
    parameters.dados_empresa = Object.assign({}, objectFrom(selected.parametros || {}, ["dados_empresa"]), {
      razao_social: qs("adminCompanyLegalName").value.trim(),
      cnpj: qs("adminCompanyCnpj").value.trim(),
      endereco: qs("adminCompanyAddress").value.trim(),
      representante: qs("adminCompanyRepresentative").value.trim(),
      telefone: qs("adminCompanyPhone").value.trim(),
      whatsapp: qs("adminCompanyWhatsapp").value.trim(),
      email_financeiro: qs("adminCompanyFinanceEmail").value.trim(),
      email_privacidade: qs("adminCompanyPrivacyEmail").value.trim()
    });
    var previousLevels = listFrom(selected, ["niveis"]);
    var previousRanks = listFrom(selected, ["ranks"]);
    var previousGroups = listFrom(selected, ["grupos_isentos", "grupos"]);
    var previousTaxes = listFrom(selected, ["retencoes", "taxas"]);
    return {
      cod_mmn_config: integerValue(qs("adminConfigVersionId").value) || null,
      nome: qs("adminConfigName").value.trim(),
      vigencia_inicio: qs("adminConfigEffective").value,
      parametros: parameters,
      pagamentos_reais_liberados: !parameters.pagamento_real_bloqueado,
      niveis: ensureUniqueOrder(qsa("[data-level-row]").map(function (row) {
        var level = integerValue(row.dataset.levelNumber);
        var previous = previousLevels.find(function (row) { return integerValue(row.nivel) === level; }) || {};
        var values = { nivel: level };
        qsa("[data-level-field]", row).forEach(function (input) {
          var key = input.dataset.levelField;
          values[key] = input.value === "true" || input.value === "false" ? input.value === "true" : numberValue(input.value);
        });
        return Object.assign({}, previous, values);
      })),
      ranks: ensureUniqueOrder(mergeCollectedRows(collectRows("[data-rank-row]", "data-rank-field"), previousRanks, ["cod_mmn_config_rank", "id"], ["chave"])),
      grupos_isentos: mergeCollectedRows(collectRows("[data-group-row]", "data-group-field"), previousGroups, ["cod_mmn_config_grupo", "id"], ["grupo_chave"]),
      retencoes: ensureUniqueOrder(mergeCollectedRows(collectRows("[data-tax-row]", "data-tax-field"), previousTaxes, ["cod_mmn_config_retencao", "id"], ["chave"]).map(function (row) {
        row.base_minima_centavos = Math.round(numberValue(row.base_minima_reais) * 100);
        row.teto_centavos = row.teto_reais === "" || row.teto_reais == null ? null : Math.round(numberValue(row.teto_reais) * 100);
        delete row.base_minima_reais;
        delete row.teto_reais;
        return row;
      })),
      justificativa: qs("adminConfigReason").value.trim()
    };
  }

  function configSavePayload(config) {
    return {
      p_config_id: config.cod_mmn_config,
      p_nome: config.nome,
      p_vigencia_inicio: config.vigencia_inicio,
      p_parametros: config.parametros,
      p_niveis: config.niveis,
      p_ranks: config.ranks,
      p_grupos_isentos: config.grupos_isentos,
      p_retencoes: config.retencoes,
      p_motivo: config.justificativa
    };
  }

  function confirmAction(title, text, requireReason) {
    var dialog = qs("actionDialog");
    setText("actionDialogTitle", title);
    setText("actionDialogText", text);
    qs("actionDialogReasonField").hidden = !requireReason;
    qs("actionDialogReason").required = !!requireReason;
    qs("actionDialogReason").value = "";
    if (state.dialogResolve) state.dialogResolve(null);
    return new Promise(function (resolve) {
      state.dialogResolve = resolve;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "open");
    });
  }

  function closeActionDialog(value) {
    var dialog = qs("actionDialog");
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    var resolve = state.dialogResolve;
    state.dialogResolve = null;
    if (resolve) resolve(value);
  }

  async function performAdminAction(rpcName, payload, title, message) {
    var reason = await confirmAction(title, message, true);
    if (reason === null) return null;
    payload.p_motivo = reason;
    return rpc(rpcName, payload);
  }

  async function bootUser(sequence) {
    state.session = null;
    await requestAppSession();
    if (sequence !== state.bootSequence) return;
    var data = await rpc(CONFIG.rpcs.userDashboard, {});
    if (sequence !== state.bootSequence) return;
    state.user.dashboard = data;
    state.user.loaded = {};
    state.user.network = { rootId: "", rows: [], directs: [], stack: [], hasMore: false, nodeCache: {} };
    state.user.evolution = { rows: [], loaded: false, loading: false, error: "" };
    state.user.ranks = [];
    state.user.rankQualificationData = null;
    state.user.rankQualified = { rank: null, rows: [], cursor: null, hasMore: false };
    qs("userApp").hidden = false;
    qs("adminApp").hidden = true;
    qs("adminLoginPanel").hidden = true;
    renderUserDashboard(data);
    setText("adminIdentity", objectFrom(data, ["usuario"]).codinome || "Turbo Tiger");
    setStatus("pageStatus", "", null);
  }

  async function bootAdmin(sequence) {
    state.session = readAdminSession();
    if (!state.session || !state.session.access_token) {
      showLoading(false);
      qs("adminLoginPanel").hidden = false;
      qs("adminApp").hidden = true;
      apresentarStatusMmn("pageStatus",function(){return legendaMmn("legenda_mmn_entre_com_uma_conta_autorizada");},null);
      return;
    }
    await refreshSessionIfNeeded();
    var context = await rpc(CONFIG.rpcs.adminContext, {});
    if (sequence !== state.bootSequence) return;
    state.context = context;
    state.capabilities = normalizeCapabilities(context);
    if (!state.capabilities.acessar) throw new Error("sem_permissao_mmn");
    var user = objectFrom(context, ["usuario"]);
    setText("adminIdentity", user.nome || user.email || (state.session.user && state.session.user.email) || "Turbo Tiger");
    applyAdminCapabilities();
    var data = await rpc(CONFIG.rpcs.adminDashboard, { p_competencia: monthDate(qs("adminOverviewPeriod").value) });
    if (sequence !== state.bootSequence) return;
    state.admin.dashboard = data;
    state.admin.loaded = {};
    qs("adminLoginPanel").hidden = true;
    qs("adminApp").hidden = false;
    qs("userApp").hidden = true;
    renderAdminOverview(data);
    apresentarStatusMmn("pageStatus",function(){return legendaMmn("legenda_mmn_online_acesso_conforme_suas_permissoes");},"ok");
  }

  async function refreshAdminDashboard() {
    var data = await rpc(CONFIG.rpcs.adminDashboard, { p_competencia: monthDate(qs("adminOverviewPeriod").value) });
    state.admin.dashboard = data;
    renderAdminOverview(data);
    return data;
  }

  async function boot() {
    var sequence = ++state.bootSequence;
    setGlobalError(null);
    showLoading(true);
    apresentarStatusMmn("pageStatus",function(){return legendaMmn("legenda_mmn_rotulo_carregando");},null);
    try {
      configureMode();
      if (state.mode === "user") await bootUser(sequence);
      else await bootAdmin(sequence);
    } catch (error) {
      if (sequence !== state.bootSequence) return;
      setGlobalError(error);
      setStatus("pageStatus", error.message || String(error), "error");
      if (state.mode === "admin") {
        qs("adminLoginPanel").hidden = false;
        qs("adminApp").hidden = true;
      }
    } finally {
      if (sequence === state.bootSequence) showLoading(false);
    }
  }

  function setupTabs() {
    qsa("[data-user-tab]").forEach(function (button) { button.addEventListener("click", function () { activateUserTab(button.getAttribute("data-user-tab")); }); });
    qsa("[data-admin-tab]").forEach(function (button) { button.addEventListener("click", function () { activateAdminTab(button.getAttribute("data-admin-tab")); }); });
  }

  function setupAuthEvents() {
    on("adminLoginForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("loginButton", true, legendaMmn("legenda_mmn_rotulo_entrando"));
      apresentarStatusMmn("loginStatus",function(){return legendaMmn("legenda_mmn_validando_acesso");},null);
      try {
        saveAdminSession(await adminLogin(qs("loginEmail").value.trim(), qs("loginPassword").value));
        await boot();
      } catch (error) {
        clearAdminSession();
        setStatus("loginStatus", error.message || error, "error");
      } finally {
        setBusy("loginButton", false);
      }
    });
    on("logoutButton", "click", function () {
      clearAdminSession();
      qs("adminApp").hidden = true;
      qs("adminLoginPanel").hidden = false;
      apresentarStatusMmn("pageStatus",function(){return legendaMmn("legenda_mmn_sessao_encerrada");},null);
    });
    on("reloadButton", "click", boot);
    on("retryButton", "click", boot);
  }

  function shareInvite() {
    if (state.mode === "user" && hasNativeBridge()) {
      try {
        window.TurboTigerHistoricoBridge.post("TURBO_SHARE_INVITE");
        return;
      } catch (error) {}
    }
    if (state.user.inviteUrl && navigator.share) navigator.share({ title: legendaMmn("legenda_mmn_convite_turbo_tiger"), url: state.user.inviteUrl }).catch(function () {});
  }

  function showInviteCopyToast() {
    var toast = qs("userCopyInviteToast");
    if (!toast) return;
    if (state.user.copyToastTimer) window.clearTimeout(state.user.copyToastTimer);
    toast.hidden = false;
    toast.classList.add("is-visible");
    state.user.copyToastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      toast.hidden = true;
      state.user.copyToastTimer = null;
    }, 3000);
  }

  function regulationOverlayUrl(rawUrl) {
    var url = new URL(rawUrl || "../../regulamento-mmn.html", window.location.href);
    url.searchParams.set("embedded", "1");
    return url.href;
  }

  function openRegulationOverlay(rawUrl) {
    var overlay = qs("regulationOverlay");
    var frame = qs("regulationOverlayFrame");
    if (!overlay || !frame) return;
    frame.src = regulationOverlayUrl(rawUrl);
    overlay.hidden = false;
    document.body.classList.add("mmn-regulation-open");
    syncPageScrollLock();
  }

  function closeRegulationOverlay() {
    var overlay = qs("regulationOverlay");
    var frame = qs("regulationOverlayFrame");
    if (!overlay) return;
    overlay.hidden = true;
    syncPageScrollLock();
    if (frame) frame.src = "about:blank";
    var link = qs("regulationLink");
    if (link) link.focus();
  }

  function setupRegulationOverlay() {
    on("regulationLink", "click", function (event) {
      event.preventDefault();
      openRegulationOverlay(event.currentTarget.href);
    });
    window.addEventListener("message", function (event) {
      var payload = event.data || {};
      if (payload.type === "TURBO_MMN_REGULATION_CLOSE") closeRegulationOverlay();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && qs("regulationOverlay") && !qs("regulationOverlay").hidden) closeRegulationOverlay();
    });
  }

  function setupUserEvents() {
    on("userShareButton", "click", shareInvite);
    on("userCopyInviteButton", "click", async function () {
      if (!state.user.inviteUrl) {
        setGlobalError(new Error(legendaMmn("legenda_mmn_o_link_de_convite_ainda_nao_esta_disponivel")));
        return;
      }
      try {
        await navigator.clipboard.writeText(state.user.inviteUrl);
        showInviteCopyToast();
      } catch (error) {
        setGlobalError(new Error(legendaMmn("legenda_mmn_nao_foi_possivel_copiar_o_link_neste_dispositivo")));
      }
    });
    var enrollmentForm = qs("enrollmentForm");
    if (enrollmentForm) {
      ["input", "change"].forEach(function (eventName) {
        enrollmentForm.addEventListener(eventName, function () {
          setStatus("enrollmentStatus", "", null);
          updateEnrollmentSubmitState();
        });
      });
    }
    on("enrollmentSubmit", "click", function (event) {
      var issue = enrollmentCompletionIssue();
      if (showEnrollmentCompletionIssue(issue)) event.preventDefault();
    });
    on("enrollmentForm", "submit", async function (event) {
      event.preventDefault();
      if (showEnrollmentCompletionIssue(enrollmentCompletionIssue())) {
        updateEnrollmentSubmitState();
        return;
      }
      if (!(await ensurePixReadyForSubmission("enrollment"))) {
        updatePixActions("enrollment");
        return;
      }
      setBusy("enrollmentSubmit", true, legendaMmn("legenda_mmn_salvando_adesao"));
      setStatus("enrollmentStatus", "", null);
      try {
        validateAddressForSubmission("enrollment", true);
        var payload = collectProfile("enrollment");
        var regulation = objectFrom(state.user.dashboard, ["regulamento", "termos"]);
        var participation = userParticipation(state.user.dashboard || {});
        var isReentry = participation.status === "saida_voluntaria";
        await rpc(CONFIG.rpcs.userEnrollmentSave, {
          p_documento_id: regulation.documento_id || regulation.cod_documento || regulation.id || null,
          p_pix_tipo: payload.pix_tipo,
          p_pix_chave: payload.pix_chave,
          p_titularidade_confirmada: payload.pix_mesmo_cpf,
          p_dados_rpa: payload,
          p_confirmacao: qs("enrollmentTerms").checked && payload.pix_mesmo_cpf
        });
        if (isReentry) {
          await rpc(CONFIG.rpcs.userProgramReenter, { p_confirmacao: true });
        }
        apresentarStatusMmn("enrollmentStatus",function(){return isReentry ? legendaMmn("legenda_mmn_reentrada_concluida_com_seguranca") : legendaMmn("legenda_mmn_adesao_concluida_com_seguranca");},"ok");
        await boot();
      } catch (error) {
        showPixFormError("enrollment", "enrollmentStatus", error);
      } finally {
        setBusy("enrollmentSubmit", false);
        updatePixActions("enrollment");
      }
    });
    on("userProfileForm", "submit", async function (event) {
      event.preventDefault();
      var pixChangeRequested = profilePixChangeRequested();
      if (!(await ensurePixReadyForSubmission("profile"))) {
        apresentarStatusMmn("profileStatus",function(){return legendaMmn("legenda_mmn_verifique_confira_e_confirme_a_chave_pix_antes_de_salvar");},"error");
        updatePixActions("profile");
        return;
      }
      setBusy("profileSubmit", true, legendaMmn("legenda_mmn_rotulo_salvando"));
      try {
        validateAddressForSubmission("profile", true);
        var profile = collectProfile("profile");
        var profilePixFlow = pixState("profile");
        var result = await rpc(CONFIG.rpcs.userProfileSave, {
          p_pix_tipo: profile.pix_tipo,
          p_pix_chave: profile.pix_chave,
          p_titularidade_confirmada: profile.pix_mesmo_cpf,
          p_dados_rpa: profile
        });
        var confirmedAfterSave = booleanValue(firstDefined([
          result.pix_confirmado,
          result.pix_validado,
          pixChangeRequested ? true : profilePixFlow.storedConfirmed
        ], false), false);
        if (pixChangeRequested && !confirmedAfterSave) throw new Error(legendaMmn("legenda_mmn_a_confirmacao_da_nova_chave_pix_nao_foi_preservada_verifique_novamente"));
        var savedType = normalizePixType(firstDefined([result.pix_tipo, profile.pix_tipo, profilePixFlow.storedType], "cpf"));
        var savedMasked = cleanText(firstDefined([
          result.pix_mascarado,
          profilePixFlow.persistedMasked,
          profilePixFlow.storedMasked
        ], ""));
        qs("profilePixKey").value = "";
        qs("profilePixType").value = savedType || "cpf";
        apresentarTextoMmn("profilePixMasked",function(){return savedMasked ? legendaMmn("legenda_mmn_chave_atual") + savedMasked : legendaMmn("legenda_mmn_nenhuma_chave_cadastrada");});
        initializePixValidation("profile", {
          cadastrado: !!savedMasked,
          pix_tipo: savedType,
          pix_mascarado: savedMasked,
          pix_validado: confirmedAfterSave
        });
        apresentarStatusMmn("profileStatus",function(){return legendaMmn("legenda_mmn_dados_atualizados");},"ok");
      } catch (error) {
        showPixFormError("profile", "profileStatus", error);
      } finally {
        setBusy("profileSubmit", false);
        updatePixActions("profile");
      }
    });
    on("userSimulatorForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("userSimulatorSubmit", true, legendaMmn("legenda_mmn_rotulo_simulando"));
      try {
        var data = await rpc(CONFIG.rpcs.userSimulator, { p_parametros: {
          novos_diretos_mes: integerValue(qs("userSimDirects").value),
          media_indicacoes_por_direto: numberValue(qs("userSimReplication").value),
          meses: integerValue(qs("userSimMonths").value),
          continuidade_percentual: numberValue(qs("userSimContinuity").value),
          cenario: qs("userSimScenario").value
        } });
        renderSimulationResults("userSimulatorResults", data);
      } catch (error) {
        qs("userSimulatorResults").innerHTML = emptyHtml(friendlyMessage(error.message || error));
      } finally {
        setBusy("userSimulatorSubmit", false);
      }
    });
    on("userDashboard", "click", async function (event) {
      var readButton = event.target.closest("[data-user-event-read]");
      if (readButton) {
        try {
          var eventId = integerValue(readButton.dataset.userEventRead);
          var result = await rpc(CONFIG.rpcs.userEventRead, { p_evento_id: eventId });
          var events = listFrom(state.user.dashboard || {}, ["eventos"]);
          events.forEach(function (item) {
            if (String(item.id || item.cod_mmn_evento) === String(eventId)) item.lido_em = result.lido_em || new Date().toISOString();
          });
          renderUserNotifications(state.user.dashboard || {});
        } catch (error) { setGlobalError(error); }
        return;
      }
      var button = event.target.closest("[data-user-dispute-id]");
      if (!button) return;
      var subject = window.prompt(legendaMmn("legenda_mmn_assunto_da_contestacao"), legendaMmn("legenda_mmn_revisao_de_lancamento"));
      if (subject === null) return;
      var description = window.prompt(legendaMmn("legenda_mmn_descreva_o_motivo_da_contestacao"), "");
      if (description === null) return;
      if (!subject.trim() || !description.trim()) return setGlobalError(new Error(legendaMmn("legenda_mmn_informe_o_assunto_e_a_descricao_da_contestacao")));
      try {
        await rpc(CONFIG.rpcs.userDispute, {
          p_alvo_tipo: button.dataset.userDisputeType,
          p_alvo_id: integerValue(button.dataset.userDisputeId),
          p_assunto: subject.trim(),
          p_descricao: description.trim()
        });
        apresentarStatusMmn("pageStatus",function(){return legendaMmn("legenda_mmn_contestacao_registrada_para_analise");},"ok");
        button.disabled = true;
      } catch (error) { setGlobalError(error); }
    });
    on("userNetworkMore", "click", function () { loadUserTab("rede", true); });
    on("userLedgerMore", "click", function () { loadUserTab("extrato", true); });
    on("userPaymentsMore", "click", function () { loadUserTab("pagamentos", true); });
    on("userLedgerPeriod", "change", function () { state.user.loaded.extrato = false; loadUserTab("extrato", false); });
  }

  function setupUserDetailOverlays() {
    on("userDirectList", "click", function (event) {
      var card = event.target.closest("[data-network-person-id]");
      if (card) openNetworkExplorer(card.dataset.networkPersonId);
    });
    on("networkExplorerContent", "click", async function (event) {
      var card = event.target.closest("[data-network-person-id]");
      if (!card) return;
      state.user.network.stack.push(card.dataset.networkPersonId);
      renderNetworkExplorer();
      await loadNetworkNode(card.dataset.networkPersonId, false);
    });
    on("networkExplorerBack", "click", function () {
      if (state.user.network.stack.length <= 1) return;
      state.user.network.stack.pop();
      renderNetworkExplorer();
    });
    on("networkExplorerClose", "click", closeNetworkExplorer);
    on("networkExplorerMore", "click", async function () {
      var person = selectedNetworkPerson();
      if (person) await loadNetworkNode(networkPersonId(person), true);
    });
    on("userNetworkDiagramOpen", "click", async function () {
      if (!state.user.network.rows.length && !state.user.loaded.rede) await loadUserTab("rede", false);
      await openNetworkDiagram();
    });
    on("networkDiagramClose", "click", closeNetworkDiagram);
    function setNetworkDiagramPrintStatus(message, tone) {
      var status = qs("networkDiagramPrintStatus");
      if (!status) return;
      status.textContent = message || "";
      status.hidden = !message;
      status.classList.toggle("is-success", tone === "success");
      status.classList.toggle("is-error", tone === "error");
    }
    on("networkDiagramPrint", "click", function () {
      document.body.classList.add("mmn-network-printing");
      setNetworkDiagramPrintStatus(legendaMmn("legenda_mmn_preparando_o_diagrama_para_gerar_o_pdf"), null);
      if (hasNativeBridge()) {
        try {
          window.TurboTigerHistoricoBridge.post("TURBO_MMN_EXPORT_NETWORK_PDF");
          return;
        } catch (error) {
          document.body.classList.remove("mmn-network-printing");
          setNetworkDiagramPrintStatus(legendaMmn("legenda_mmn_nao_foi_possivel_abrir_a_geracao_do_pdf_no_aplicativo"), "error");
          return;
        }
      }
      window.setTimeout(function () { window.print(); }, 0);
    });
    window.addEventListener("TURBO_MMN_PDF_STATUS", function (event) {
      var detail = event.detail || {};
      setNetworkDiagramPrintStatus(detail.message || (detail.ok ? legendaMmn("legenda_mmn_escolha_salvar_como_pdf_na_tela_aberta_pelo_dispositivo") : legendaMmn("legenda_mmn_nao_foi_possivel_gerar_o_pdf")), detail.ok ? "success" : "error");
      if (!detail.ok) document.body.classList.remove("mmn-network-printing");
    });
    window.addEventListener("afterprint", function () {
      document.body.classList.remove("mmn-network-printing");
      setNetworkDiagramPrintStatus("", null);
    });
    on("userRankLadder", "click", async function (event) {
      var card = event.target.closest("[data-rank-qualified-index]");
      if (card) await openRankQualified(card.dataset.rankQualifiedIndex);
    });
    on("rankQualifiedMore", "click", function () { loadRankQualified(true); });
    on("rankQualifiedClose", "click", closeRankQualified);
    on("userEvolutionChartOpen", "click", openEvolutionChart);
    on("evolutionChartClose", "click", closeEvolutionChart);
    ["networkExplorerOverlay", "networkDiagramOverlay", "rankQualifiedOverlay", "evolutionChartOverlay"].forEach(function (id) {
      on(id, "click", function (event) {
        if (event.target !== event.currentTarget) return;
        if (id === "networkExplorerOverlay") closeNetworkExplorer();
        else if (id === "networkDiagramOverlay") closeNetworkDiagram();
        else if (id === "rankQualifiedOverlay") closeRankQualified();
        else closeEvolutionChart();
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!qs("networkExplorerOverlay").hidden) closeNetworkExplorer();
      else if (!qs("networkDiagramOverlay").hidden) closeNetworkDiagram();
      else if (!qs("rankQualifiedOverlay").hidden) closeRankQualified();
      else if (!qs("evolutionChartOverlay").hidden) closeEvolutionChart();
    });
  }

  function openProgramExitDialog() {
    var dialog = qs("programExitDialog");
    var checkbox = qs("programExitConfirmCheck");
    checkbox.checked = false;
    qs("programExitConfirm").disabled = true;
    setStatus("programExitDialogStatus", "", null);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "open");
    window.setTimeout(function () { checkbox.focus(); }, 0);
  }

  function closeProgramExitDialog() {
    if (state.programExitBusy) return;
    var dialog = qs("programExitDialog");
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    qs("programExitConfirmCheck").checked = false;
    qs("programExitConfirm").disabled = true;
    var trigger = qs("programExitOpen");
    if (trigger && !trigger.hidden) trigger.focus();
  }

  function setupProgramExitDialog() {
    on("programExitOpen", "click", openProgramExitDialog);
    on("programExitConfirmCheck", "change", function () {
      qs("programExitConfirm").disabled = !qs("programExitConfirmCheck").checked || state.programExitBusy;
    });
    on("programExitCancel", "click", closeProgramExitDialog);
    on("programExitClose", "click", closeProgramExitDialog);
    on("programExitDialog", "cancel", function (event) {
      event.preventDefault();
      closeProgramExitDialog();
    });
    on("programExitDialogForm", "submit", async function (event) {
      event.preventDefault();
      if (state.programExitBusy || !qs("programExitConfirmCheck").checked) return;

      state.programExitBusy = true;
      qs("programExitCancel").disabled = true;
      qs("programExitClose").disabled = true;
      setBusy("programExitConfirm", true, legendaMmn("legenda_mmn_rotulo_saindo"));
      apresentarStatusMmn("programExitDialogStatus",function(){return legendaMmn("legenda_mmn_processando_sua_solicitacao");},null);

      var exitCompleted = false;
      try {
        await rpc(CONFIG.rpcs.userProgramExit, {
          p_confirmacao: true,
          p_motivo: "saida_solicitada_pelo_participante"
        });
        exitCompleted = true;
      } catch (error) {
        setStatus("programExitDialogStatus", error.message || error, "error");
      } finally {
        state.programExitBusy = false;
        qs("programExitCancel").disabled = false;
        qs("programExitClose").disabled = false;
        setBusy("programExitConfirm", false);
        qs("programExitConfirm").disabled = !qs("programExitConfirmCheck").checked;
      }

      if (!exitCompleted) return;

      closeProgramExitDialog();
      apresentarStatusMmn("programExitStatus",function(){return legendaMmn("legenda_mmn_saida_concluida_atualizando_seu_painel");},"ok");
      await boot();
      apresentarStatusMmn("pageStatus",function(){return legendaMmn("legenda_mmn_voce_saiu_do_programa_de_indicacoes");},"ok");
      if (!qs("userEnrollment").hidden) {
        apresentarStatusMmn("enrollmentStatus",function(){return legendaMmn("legenda_mmn_sua_saida_foi_concluida_para_participar_novamente_faca_uma_nova_adesao_ao_regulamento");},"ok");
        qs("userEnrollment").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function setupAdminFilters() {
    on("adminOverviewPeriod", "change", async function () {
      try { var data = await rpc(CONFIG.rpcs.adminDashboard, { p_competencia: monthDate(qs("adminOverviewPeriod").value) }); state.admin.dashboard = data; renderAdminOverview(data); } catch (error) { setGlobalError(error); }
    });
    on("adminParticipantFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("participantes", false); });
    on("adminWaitlistFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("espera", false); });
    on("adminRevenueFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("receitas", false); });
    on("adminPaymentFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("pagamentos", false); });
    on("adminSupportFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("suporte", false); });
    on("adminAuditFilter", "submit", function (event) { event.preventDefault(); loadAdminTab("auditoria", false); });
    on("adminNetworkForm", "submit", async function (event) {
      event.preventDefault();
      try { renderAdminNetwork(await rpc(CONFIG.rpcs.adminUserDetail, { p_usuario_id: integerValue(qs("adminNetworkUser").value) })); } catch (error) { setGlobalError(error); }
    });
    on("adminPeriodsMore", "click", function () { loadAdminTab("competencias", true); });
    on("adminParticipantsMore", "click", function () { loadAdminTab("participantes", true); });
    on("adminWaitlistMore", "click", function () { loadAdminTab("espera", true); });
    on("adminRevenueMore", "click", function () { loadAdminTab("receitas", true); });
    on("adminPaymentsMore", "click", function () { loadAdminTab("pagamentos", true); });
    on("adminSupportMore", "click", function () { loadAdminTab("suporte", true); });
    on("adminAuditMore", "click", function () { loadAdminTab("auditoria", true); });
  }

  function setupAdminActions() {
    on("adminPeriodsBody", "click", async function (event) {
      var button = event.target.closest("[data-period-action]");
      if (!button) return;
      try {
        var action = button.dataset.periodAction;
        var rpcName = action === "apurar" ? CONFIG.rpcs.adminPeriodCalculate : (action === "fechar" ? CONFIG.rpcs.adminPeriodClose : CONFIG.rpcs.adminPeriodReopen);
        await performAdminAction(rpcName, { p_competencia: monthDate(String(button.dataset.periodValue).slice(0, 7)) }, legendaMmn("legenda_mmn_confirmar_acao_na_competencia"), legendaMmn("legenda_mmn_a_acao_respeitara_a_versao_vinculada_e_mantera_a_trilha_de_auditoria"));
        await refreshAdminDashboard();
        await loadAdminTab("competencias", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminParticipantsBody", "click", async function (event) {
      var button = event.target.closest("[data-participant-edit]");
      if (!button) return;
      var row = (state.admin.participants || []).find(function (item) { return String(item.usuario_id || item.id_usuario || item.cod_usuario) === String(button.dataset.participantEdit); });
      if (!row) return;
      try {
        var detail = await rpc(CONFIG.rpcs.adminUserDetail, { p_usuario_id: integerValue(button.dataset.participantEdit) });
        var detailedUser = objectFrom(detail, ["usuario"]);
        var detailedParticipant = objectFrom(detail, ["participante"]);
        row = Object.assign({}, row, detailedUser, detailedParticipant, {
          usuario_id: detailedUser.id || row.usuario_id,
          grupo: detailedUser.grupo || row.grupo,
          elegibilidade: objectFrom(detail, ["elegibilidade"])
        });
      } catch (error) {
        setGlobalError(error);
        return;
      }
      qs("adminParticipantId").value = row.usuario_id || row.id_usuario || row.cod_usuario || row.id;
      apresentarTextoMmn("adminParticipantEditorTitle",function(){return legendaMmn("legenda_mmn_rotulo_gerenciar_prefixo") + (row.loginuser || row.usuario_loginuser || row.login || row.codinome || row.nome || "participante");});
      qs("adminParticipantActive").value = String(booleanValue(row.mmn_ativo, false));
      qs("adminParticipantIneligibility").value = row.status === "inelegivel_permanente" || row.inelegibilidade_permanente ? "permanente" : (row.status === "suspenso" ? "temporaria" : "nenhuma");
      qs("adminParticipantTechnical").value = String(booleanValue(row.conta_tecnica, false));
      qs("adminParticipantGroup").value = row.grupo || row.grupo_chave || "";
      qs("adminParticipantGroup").dataset.originalGroup = row.grupo || row.grupo_chave || "";
      qs("adminParticipantSponsor").value = row.id_patrocinador || row.patrocinador_id || "";
      qs("adminParticipantSponsor").dataset.originalSponsor = row.id_patrocinador || row.patrocinador_id || "";
      qs("adminParticipantReason").value = "";
      qs("adminParticipantEditor").hidden = false;
      qs("adminParticipantEditor").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    on("adminParticipantClose", "click", function () { qs("adminParticipantEditor").hidden = true; });
    async function validateParticipantPix(approved) {
      try {
        var userId = integerValue(qs("adminParticipantId").value);
        if (!userId) throw new Error(legendaMmn("legenda_mmn_selecione_um_participante"));
        await performAdminAction(CONFIG.rpcs.adminPixValidate, { p_usuario_id: userId, p_aprovado: approved }, approved ? legendaMmn("legenda_mmn_validar_pix") : legendaMmn("legenda_mmn_rejeitar_pix"), approved ? legendaMmn("legenda_mmn_confirme_que_a_chave_pertence_ao_mesmo_titular_cadastrado_no_app") : legendaMmn("legenda_mmn_o_pix_ficara_pendente_ate_uma_nova_validacao_administrativa"));
        apresentarStatusMmn("adminParticipantStatus",function(){return approved ? legendaMmn("legenda_mmn_pix_validado") : legendaMmn("legenda_mmn_pix_rejeitado");},"ok");
      } catch (error) { setStatus("adminParticipantStatus", error.message || error, "error"); }
    }
    on("adminParticipantPixApprove", "click", function () { validateParticipantPix(true); });
    on("adminParticipantPixReject", "click", function () { validateParticipantPix(false); });
    on("adminParticipantEditor", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminParticipantSave", true, legendaMmn("legenda_mmn_rotulo_salvando"));
      try {
        var userId = integerValue(qs("adminParticipantId").value);
        var ineligibility = qs("adminParticipantIneligibility").value;
        var status = ineligibility === "permanente" ? "inelegivel_permanente" :
          (ineligibility === "temporaria" || qs("adminParticipantActive").value !== "true" ? "suspenso" : "ativo");
        var reason = qs("adminParticipantReason").value.trim();
        await rpc(CONFIG.rpcs.adminParticipantStatus, {
          p_usuario_id: userId,
          p_status: status,
          p_conta_tecnica: qs("adminParticipantTechnical").value === "true",
          p_inelegivel_permanente: ineligibility === "permanente",
          p_motivo: reason
        });
        var group = qs("adminParticipantGroup").value || null;
        var originalGroup = qs("adminParticipantGroup").dataset.originalGroup || null;
        if (group !== originalGroup) {
          await rpc(CONFIG.rpcs.adminParticipantGroup, {
            p_usuario_id: userId,
            p_grupo_chave: group,
            p_motivo: reason
          });
        }
        var sponsor = integerValue(qs("adminParticipantSponsor").value) || null;
        var originalSponsor = integerValue(qs("adminParticipantSponsor").dataset.originalSponsor) || null;
        if (sponsor !== originalSponsor) {
          await rpc(CONFIG.rpcs.adminSponsorCorrect, {
            p_usuario_id: userId,
            p_novo_patrocinador_id: sponsor,
            p_motivo: reason
          });
        }
        apresentarStatusMmn("adminParticipantStatus",function(){return legendaMmn("legenda_mmn_alteracao_registrada_e_auditada");},"ok");
        await refreshAdminDashboard();
        await loadAdminTab("participantes", false);
      } catch (error) { setStatus("adminParticipantStatus", error.message || error, "error"); }
      finally { setBusy("adminParticipantSave", false); }
    });
    on("adminWaitlistBody", "click", async function (event) {
      var button = event.target.closest("[data-waitlist-action]");
      if (!button) return;
      try {
        var sponsorId = null;
        if (button.dataset.waitlistAction === "aprovar") {
          var informed = window.prompt(legendaMmn("legenda_mmn_informe_o_id_do_usuario_patrocinador_deixe_vazio_para_raiz"), "");
          if (informed === null) return;
          sponsorId = informed.trim() ? integerValue(informed) : null;
          if (informed.trim() && sponsorId <= 0) throw new Error(legendaMmn("legenda_mmn_informe_um_usuario_patrocinador_valido"));
        }
        await performAdminAction(CONFIG.rpcs.adminWaitlistDecide, {
          p_vinculo_id: integerValue(button.dataset.waitlistId),
          p_decisao: button.dataset.waitlistAction,
          p_patrocinador_usuario_id: sponsorId
        }, legendaMmn("legenda_mmn_decidir_vinculo_da_lista_de_espera"), legendaMmn("legenda_mmn_complemento_a_genealogia_sera_preservada_sem_reservar_ou_alterar_o_cod_usuario_normal"));
        await loadAdminTab("espera", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminPaymentsBody", "click", async function (event) {
      var button = event.target.closest("[data-payment-action]");
      if (!button) return;
      try {
        var paymentAction = button.dataset.paymentAction;
        var paymentPayload = { p_lote_id: integerValue(button.dataset.paymentId) };
        var paymentRpc = CONFIG.rpcs.adminBatchApprove;
        if (paymentAction === "pago") {
          var proof = window.prompt(legendaMmn("legenda_mmn_informe_a_referencia_do_comprovante_de_pagamento"), "");
          if (proof === null) return;
          if (!proof.trim()) throw new Error(legendaMmn("legenda_mmn_informe_a_referencia_do_comprovante"));
          paymentPayload.p_comprovante_ref = proof.trim();
          paymentRpc = CONFIG.rpcs.adminBatchMarkPaid;
        }
        await performAdminAction(paymentRpc, paymentPayload, legendaMmn("legenda_mmn_confirmar_acao_financeira"), legendaMmn("legenda_mmn_a_acao_sera_validada_pelas_aprovacoes_bloqueios_fiscais_e_estado_atual_do_lote"));
        await refreshAdminDashboard();
        await loadAdminTab("pagamentos", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminRpaBody", "click", async function (event) {
      var button = event.target.closest("[data-rpa-detail]");
      if (!button) return;
      setBusy(button, true, legendaMmn("legenda_mmn_rotulo_abrindo"));
      try {
        var beneficiaryId = integerValue(button.dataset.rpaDetail);
        if (!beneficiaryId) throw new Error(legendaMmn("legenda_mmn_beneficiario_do_lote_invalido"));
        renderAdminRpaDetail(await rpc(CONFIG.rpcs.adminRpaGet, {
          p_lote_beneficiario_id: beneficiaryId
        }));
      } catch (error) { setGlobalError(error); }
      finally { setBusy(button, false); }
    });
    on("adminRpaRegister", "click", async function () {
      if (!(hasCapability("financeiro") || hasCapability("pagar"))) return setGlobalError(new Error("acesso_financeiro_negado"));
      var beneficiaryId = integerValue(qs("adminRpaBeneficiaryId").value);
      var reason = qs("adminRpaReason").value.trim();
      if (!beneficiaryId) return apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_selecione_um_beneficiario");},"error");
      if (!reason) return apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_informe_o_motivo_do_registro");},"error");
      var confirmation = await confirmAction(legendaMmn("legenda_mmn_registrar_rascunho_do_rpa"), legendaMmn("legenda_mmn_os_dados_fiscais_e_os_valores_do_beneficiario_serao_validados_pelo_servidor"), false);
      if (confirmation === null) return;
      setBusy("adminRpaRegister", true, legendaMmn("legenda_mmn_rotulo_registrando"));
      try {
        await rpc(CONFIG.rpcs.adminRpaRegister, {
          p_lote_beneficiario_id: beneficiaryId,
          p_numero: qs("adminRpaNumber").value.trim() || null,
          p_motivo: reason
        });
        await loadAdminTab("pagamentos", false);
        renderAdminRpaDetail(await rpc(CONFIG.rpcs.adminRpaGet, {
          p_lote_beneficiario_id: beneficiaryId
        }));
        apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_rascunho_do_rpa_registrado");},"ok");
      } catch (error) { setStatus("adminRpaStatusText", error.message || error, "error"); }
      finally { setBusy("adminRpaRegister", false); }
    });
    on("adminRpaEmit", "click", async function () {
      if (!(hasCapability("financeiro") || hasCapability("pagar"))) return setGlobalError(new Error("acesso_financeiro_negado"));
      var beneficiaryId = integerValue(qs("adminRpaBeneficiaryId").value);
      var documentRef = qs("adminRpaDocumentRef").value.trim();
      var documentHash = qs("adminRpaDocumentHash").value.trim();
      var reason = qs("adminRpaReason").value.trim();
      if (!beneficiaryId) return apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_selecione_um_beneficiario");},"error");
      if (!documentRef) return apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_informe_a_referencia_do_documento_fiscal");},"error");
      if (documentHash && !/^[0-9a-f]{64}$/i.test(documentHash)) return apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_informe_um_hash_sha_256_valido_com_64_caracteres_hexadecimais");},"error");
      if (!reason) return apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_informe_o_motivo_da_emissao");},"error");
      var confirmation = await confirmAction(legendaMmn("legenda_mmn_emitir_rpa"), legendaMmn("legenda_mmn_a_emissao_sera_auditada_e_podera_liberar_a_proxima_etapa_do_pagamento"), false);
      if (confirmation === null) return;
      setBusy("adminRpaEmit", true, legendaMmn("legenda_mmn_rotulo_emitindo"));
      try {
        await rpc(CONFIG.rpcs.adminRpaIssue, {
          p_lote_beneficiario_id: beneficiaryId,
          p_documento_ref: documentRef,
          p_motivo: reason,
          p_documento_hash: documentHash || null
        });
        await loadAdminTab("pagamentos", false);
        renderAdminRpaDetail(await rpc(CONFIG.rpcs.adminRpaGet, {
          p_lote_beneficiario_id: beneficiaryId
        }));
        apresentarStatusMmn("adminRpaStatusText",function(){return legendaMmn("legenda_mmn_rpa_emitido_com_sucesso");},"ok");
      } catch (error) { setStatus("adminRpaStatusText", error.message || error, "error"); }
      finally { setBusy("adminRpaEmit", false); }
    });
    on("adminSupportList", "click", async function (event) {
      var button = event.target.closest("[data-support-action]");
      if (!button) return;
      try {
        var response = await confirmAction(legendaMmn("legenda_mmn_atualizar_ocorrencia"), legendaMmn("legenda_mmn_registre_a_orientacao_inicial_depois_o_status_podera_ser_atualizado_conforme_a_decisao"), true);
        if (response === null) return;
        await rpc(CONFIG.rpcs.adminOccurrenceUpdate, { p_ocorrencia_id: integerValue(button.dataset.supportId), p_status: button.dataset.supportAction, p_resposta: response });
        await refreshAdminDashboard();
        await loadAdminTab("suporte", false);
      } catch (error) { setGlobalError(error); }
    });
  }

  function setupConfigEvents() {
    function revalidateNetworkStructure() {
      updateConfigNetworkStructure();
      validateConfigNetworkStructure(false);
    }
    on("adminConfigLevelCount", "input", revalidateNetworkStructure);
    on("adminConfigPlacementWidth", "input", revalidateNetworkStructure);
    on("adminLevelConfig", "input", function () { validateConfigNetworkStructure(false); });
    on("adminLevelConfig", "change", function () { validateConfigNetworkStructure(false); });
    on("adminRankConfig", "input", function () { validateConfigNetworkStructure(false); });
    on("adminRankConfig", "change", function () { validateConfigNetworkStructure(false); });
    on("adminConfigVersions", "click", async function (event) {
      var button = event.target.closest("[data-config-id]");
      if (!button || !state.admin.config) return;
      try {
        var result = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: integerValue(button.dataset.configId) });
        fillConfigForm(normalizeConfigResponse(result));
      } catch (error) { setGlobalError(error); }
    });
    on("adminNewConfigVersion", "click", async function () {
      var baseId = integerValue((state.admin.selectedConfig || {}).cod_mmn_config || qs("adminConfigVersionId").value);
      if (!baseId) return setGlobalError(new Error(legendaMmn("legenda_mmn_selecione_uma_versao_base_para_duplicar")));
      var name = window.prompt(legendaMmn("legenda_mmn_nome_da_nova_versao_em_rascunho"), "Nova versão");
      if (name === null) return;
      if (!name.trim()) return setGlobalError(new Error(legendaMmn("legenda_mmn_informe_o_nome_da_nova_versao")));
      setBusy("adminNewConfigVersion", true, legendaMmn("legenda_mmn_rotulo_criando"));
      try {
        var result = await rpc(CONFIG.rpcs.adminConfigDuplicate, { p_config_id: baseId, p_nome: name.trim() });
        state.admin.config = result;
        renderAdminConfig(result);
        apresentarStatusMmn("adminConfigStatus",function(){return legendaMmn("legenda_mmn_nova_versao_criada_como_rascunho_auditavel");},"ok");
        qs("adminConfigName").focus();
      } catch (error) { setGlobalError(error); }
      finally { setBusy("adminNewConfigVersion", false); }
    });
    on("adminApproverSave", "click", async function () {
      if (!hasCapability("superadmin")) return setGlobalError(new Error("somente_superadmin"));
      var configId = integerValue(qs("adminConfigVersionId").value);
      var uid = qs("adminApproverUid").value.trim();
      var profile = qs("adminApproverProfile").value.trim().toLowerCase();
      var reason = qs("adminApproverReason").value.trim();
      if (!configId) return apresentarStatusMmn("adminApproverStatus",function(){return legendaMmn("legenda_mmn_selecione_uma_versao_de_configuracao");},"error");
      if ((!uid && !profile) || (uid && profile)) return apresentarStatusMmn("adminApproverStatus",function(){return legendaMmn("legenda_mmn_informe_somente_o_uid_do_administrador_ou_somente_o_perfil");},"error");
      if (!reason) return apresentarStatusMmn("adminApproverStatus",function(){return legendaMmn("legenda_mmn_informe_o_motivo_da_alteracao");},"error");
      setBusy("adminApproverSave", true, legendaMmn("legenda_mmn_rotulo_salvando"));
      try {
        await rpc(CONFIG.rpcs.adminConfigApproverSave, {
          p_config_id: configId,
          p_uid_admin: uid || null,
          p_perfil_chave: profile || null,
          p_acao: qs("adminApproverAction").value,
          p_ativo: qs("adminApproverActive").value === "true",
          p_motivo: reason
        });
        var versions = configVersions(state.admin.config || {});
        var detail = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: configId });
        if (!Array.isArray(detail.versoes) || !detail.versoes.length) detail.versoes = versions;
        renderAdminConfig(detail);
        qs("adminApproverUid").value = "";
        qs("adminApproverProfile").value = "";
        qs("adminApproverReason").value = "";
        apresentarStatusMmn("adminApproverStatus",function(){return legendaMmn("legenda_mmn_aprovador_salvo_e_auditado");},"ok");
      } catch (error) { setStatus("adminApproverStatus", error.message || error, "error"); }
      finally { setBusy("adminApproverSave", false); }
    });
    on("adminRegulationSaveLink", "click", async function () {
      if (!hasCapability("superadmin")) return apresentarStatusMmn("adminRegulationStatus",function(){return legendaMmn("legenda_mmn_somente_o_superadmin_pode_gerar_o_regulamento");},"error");
      var configId = integerValue(qs("adminConfigVersionId").value);
      var version = qs("adminRegulationVersion").value.trim();
      var title = qs("adminRegulationTitle").value.trim();
      var reason = qs("adminRegulationReason").value.trim();
      if (!configId) return apresentarStatusMmn("adminRegulationStatus",function(){return legendaMmn("legenda_mmn_salve_primeiro_a_versao_em_rascunho");},"error");
      if (!version || !title || !reason) return apresentarStatusMmn("adminRegulationStatus",function(){return legendaMmn("legenda_mmn_informe_versao_titulo_e_motivo_da_geracao");},"error");
      setBusy("adminRegulationSaveLink", true, legendaMmn("legenda_mmn_rotulo_gerando"));
      try {
        var saved = await rpc(CONFIG.rpcs.adminRegulationDraftSave, {
          p_config_id: configId,
          p_versao: version,
          p_titulo: title,
          p_conteudo_modelo: "regulamento_mmn_v1",
          p_conteudo_resumo: qs("adminRegulationSummary").value.trim() || null,
          p_motivo: reason
        });
        var documentRow = objectFrom(saved, ["documento"]);
        if (!Object.keys(documentRow).length) documentRow = Object.assign({}, objectFrom(objectFrom(saved, ["snapshot"]), ["documento"]), { id: saved.documento_id, versao: saved.versao });
        qs("adminRegulationId").value = documentRow.cod_mmn_documento || documentRow.id || saved.documento_id || "";
        renderAdminRegulationMetadata(documentRow);
        apresentarStatusMmn("adminRegulationStatus",function(){return legendaMmn("legenda_mmn_snapshot_do_regulamento_gerado_e_vinculado_a_configuracao_atual");},"ok");
        var detail = await rpc(CONFIG.rpcs.adminConfigGet, { p_config_id: configId });
        detail.versoes = configVersions(state.admin.config || {});
        renderAdminConfig(detail);
        var preview = await rpc(CONFIG.rpcs.adminRegulationPreview, { p_config_id: configId });
        renderAdminRegulationPreview(preview);
      } catch (error) { setStatus("adminRegulationStatus", error.message || error, "error"); }
      finally { setBusy("adminRegulationSaveLink", false); }
    });
    on("adminRegulationPreviewButton", "click", async function () {
      var configId = integerValue(qs("adminConfigVersionId").value);
      if (!configId) return apresentarStatusMmn("adminRegulationStatus",function(){return legendaMmn("legenda_mmn_salve_primeiro_a_versao_em_rascunho");},"error");
      setBusy("adminRegulationPreviewButton", true, legendaMmn("legenda_mmn_rotulo_carregando"));
      try {
        var preview = await rpc(CONFIG.rpcs.adminRegulationPreview, { p_config_id: configId });
        renderAdminRegulationPreview(preview);
        var previewDocument = objectFrom(preview, ["documento", "regulamento"]);
        if (!Object.keys(previewDocument).length) previewDocument = objectFrom(objectFrom(preview, ["snapshot"]), ["documento"]);
        renderAdminRegulationMetadata(previewDocument);
        apresentarStatusMmn("adminRegulationStatus",function(){return legendaMmn("legenda_mmn_pre_visualizacao_carregada_a_partir_do_snapshot_do_servidor");},"ok");
      } catch (error) { setStatus("adminRegulationStatus", error.message || error, "error"); }
      finally { setBusy("adminRegulationPreviewButton", false); }
    });
    on("adminPublicationRefresh", "click", function () { loadPublicationProgress(integerValue(qs("adminConfigVersionId").value)); });
    on("adminConfigOpenSimulator", "click", function () {
      var configId = integerValue(qs("adminConfigVersionId").value);
      if (configId && qs("adminSimVersion")) qs("adminSimVersion").value = String(configId);
      activateAdminTab("simulador");
      activateSimulatorTab("sintetico");
      if (qs("adminSimName")) qs("adminSimName").focus();
    });
    on("adminAddRank", "click", function () { qs("adminRankConfig").insertAdjacentHTML("beforeend", rankRowHtml({})); validateConfigNetworkStructure(false); });
    on("adminAddGroup", "click", function () { qs("adminGroupConfig").insertAdjacentHTML("beforeend", groupRowHtml({ ativo: true, isento_premium: true })); });
    on("adminAddTax", "click", function () { qs("adminTaxConfig").insertAdjacentHTML("beforeend", taxRowHtml({ tipo: "percentual", reter: false, parametros: {} })); });
    on("adminConfigForm", "click", function (event) { var button = event.target.closest("[data-remove-row]"); if (button) button.closest("[data-rank-row],[data-group-row],[data-tax-row]").remove(); });
    on("adminConfigForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminConfigSave", true, legendaMmn("legenda_mmn_rotulo_salvando"));
      try {
        var structuralValidation = validateConfigNetworkStructure(true);
        if (!structuralValidation.valid) {
          qs("adminConfigForm").reportValidity();
          throw new Error(structuralValidation.message);
        }
        var config = collectConfig();
        var result = await rpc(CONFIG.rpcs.adminConfigSave, configSavePayload(config));
        apresentarStatusMmn("adminConfigStatus",function(){return legendaMmn("legenda_mmn_rascunho_salvo_gere_novamente_o_regulamento_e_valide_a_simulacao_para_estas_regras");},"ok");
        state.admin.loaded.configuracoes = false;
        await loadAdminTab("configuracoes", false);
        return result;
      } catch (error) { setStatus("adminConfigStatus", error.message || error, "error"); }
      finally { setBusy("adminConfigSave", false); }
    });
    on("adminConfigActivate", "click", async function () {
      try {
        if (!qs("adminConfigForm").reportValidity()) return;
        var structuralValidation = validateConfigNetworkStructure(true);
        if (!structuralValidation.valid) {
          qs("adminConfigForm").reportValidity();
          throw new Error(structuralValidation.message);
        }
        var config = collectConfig();
        if (!config.cod_mmn_config) throw new Error(legendaMmn("legenda_mmn_salve_primeiro_a_versao_em_rascunho"));
        var progress = await loadPublicationProgress(config.cod_mmn_config);
        if (!progress || !progress.documento_regulamento_id || !progress.simulacao_id || progress.simulacao_hash !== progress.config_hash) throw new Error(legendaMmn("legenda_mmn_gere_o_regulamento_no_servidor_e_execute_uma_simulacao_v2_valida_para_as"));
        var reason = await confirmAction(legendaMmn("legenda_mmn_aprovar_publicacao"), legendaMmn("legenda_mmn_sua_aprovacao_sera_registrada_no_quorum_desta_versao_ao_completar_o_quorum_ela"), true);
        if (reason === null) return;
        var publication = await rpc(CONFIG.rpcs.adminConfigPublish, { p_config_id: config.cod_mmn_config, p_vigencia_inicio: config.vigencia_inicio, p_motivo: reason });
        apresentarStatusMmn("adminConfigStatus",function(){return publication.aguardando_aprovacoes ? legendaMmn("legenda_mmn_aprovacao_registrada_aguardando_o_restante_do_quorum") : legendaMmn("legenda_mmn_versao_publicada_e_agendada");},"ok");
        state.admin.loaded.configuracoes = false;
        await loadAdminTab("configuracoes", false);
      } catch (error) { setGlobalError(error); }
    });
    on("adminFiscalApprove", "click", async function () {
      try {
        var config = collectConfig();
        if (!config.cod_mmn_config) throw new Error(legendaMmn("legenda_mmn_salve_a_versao_antes_da_homologacao_fiscal"));
        var homologate = window.confirm(legendaMmn("legenda_mmn_confirmar_que_os_parametros_fiscais_desta_versao_foram_homologados_com_a_contabilidade"));
        var reason = await confirmAction(legendaMmn("legenda_mmn_homologacao_fiscal"), homologate ? legendaMmn("legenda_mmn_a_versao_sera_marcada_como_homologada_defina_se_os_pagamentos_permanecem_bloqueados_no") : legendaMmn("legenda_mmn_a_homologacao_sera_removida_e_os_pagamentos_permanecerao_bloqueados"), true);
        if (reason === null) return;
        await rpc(CONFIG.rpcs.adminFiscalApprove, {
          p_config_id: integerValue(config.cod_mmn_config),
          p_fiscal_homologado: homologate,
          p_bloquear_pagamento_real: !config.pagamentos_reais_liberados,
          p_motivo: reason
        });
        apresentarStatusMmn("adminConfigStatus",function(){return homologate ? legendaMmn("legenda_mmn_configuracao_fiscal_homologada") : legendaMmn("legenda_mmn_homologacao_fiscal_removida");},"ok");
        state.admin.loaded.configuracoes = false;
        await loadAdminTab("configuracoes", false);
      } catch (error) { setGlobalError(error); }
    });
  }

  function activateSimulatorTab(tab) {
    qsa("[data-simulator-tab]").forEach(function (button) {
      var active = button.getAttribute("data-simulator-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa("[data-simulator-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-simulator-panel") !== tab;
    });
    if (tab === "historico" && !state.admin.loaded.simulationHistory) loadSimulationHistory(false);
  }

  function collectPlanMix() {
    var names = { 1: "mensal", 3: "trimestral", 6: "semestral", 12: "anual" };
    var rows = qsa("[data-plan-months]").map(function (row) {
      var months = integerValue(row.dataset.planMonths);
      var values = {};
      qsa("[data-plan-field]", row).forEach(function (input) { values[input.dataset.planField] = numberValue(input.value); });
      return {
        plano: names[months] || (months + "_meses"),
        meses: months,
        participacao_percentual: values.participacao_percentual,
        valor_total_centavos: Math.round(values.valor_total_reais * 100),
        desconto_percentual: values.desconto_percentual
      };
    });
    var total = rows.reduce(function (sum, row) { return sum + numberValue(row.participacao_percentual); }, 0);
    if (Math.abs(total - 100) > 0.001) throw new Error(legendaMmn("legenda_mmn_as_participacoes_do_mix_de_planos_devem_somar_exatamente_100"));
    return rows;
  }

  function collectAdminSimulationParameters() {
    return Object.assign({}, state.admin.simulationParameters || {}, {
      nome: qs("adminSimName").value.trim() || null,
      modo_base: qs("adminSimBaseMode").value,
      usuarios_ativos_iniciais: integerValue(qs("adminSimUsers").value),
      ativos_iniciais: integerValue(qs("adminSimUsers").value),
      ticket_medio_centavos: Math.round(numberValue(qs("adminSimTicket").value) * 100),
      valor_mensal_centavos: Math.round(numberValue(qs("adminSimTicket").value) * 100),
      meses: integerValue(qs("adminSimMonths").value),
      churn_percentual: numberValue(qs("adminSimChurn").value),
      continuidade_percentual: numberValue(qs("adminSimContinuity").value),
      novos_diretos_mes: numberValue(qs("adminSimDirects").value),
      media_indicacoes_por_direto: numberValue(qs("adminSimReplication").value),
      indicacoes_meses_impares: numberValue(qs("adminSimOdd").value),
      indicacoes_meses_pares: numberValue(qs("adminSimEven").value),
      meta_usuarios: integerValue(qs("adminSimTarget").value),
      teto_usuarios: integerValue(qs("adminSimCeiling").value),
      inicio_amortecimento_usuarios: integerValue(qs("adminSimDampingStart").value),
      expoente_amortecimento: numberValue(qs("adminSimDampingExponent").value),
      concentracao_maior_perna_percentual: numberValue(qs("adminSimConcentration").value),
      idade_media_base_meses: integerValue(qs("adminSimBaseAge").value),
      desconto_percentual: numberValue(qs("adminSimDiscount").value),
      taxa_gateway_percentual: numberValue(qs("adminSimGateway").value),
      impostos_percentual: numberValue(qs("adminSimTaxes").value),
      chargeback_percentual: numberValue(qs("adminSimChargeback").value),
      conversao_percentual: numberValue(qs("adminSimConversion").value),
      maturidade_meses: integerValue(qs("adminSimMaturity").value),
      cenario: qs("adminSimScenario").value,
      mix_planos: collectPlanMix()
    });
  }

  function simulationSummaryText(row) {
    var summary = objectFrom(row, ["resumo"]);
    if (row.tipo === "admin_historica") return legendaMmn("legenda_mmn_rotulo_real") + formatMoneyCents(summary.payout_real_total_centavos) + legendaMmn("legenda_mmn_complemento_recalculado") + formatMoneyCents(summary.payout_recalculado_total_centavos);
    if (row.tipo === "usuario") return legendaMmn("legenda_mmn_liquido_estimado_prefixo") + formatMoneyCents(summary.liquido_total_centavos);
    return legendaMmn("legenda_mmn_rotulo_receita_prefixo") + formatMoneyCents(summary.receita_reconhecida_total_centavos) + legendaMmn("legenda_mmn_complemento_payout") + formatMoneyCents(summary.payout_total_estimado_centavos);
  }

  function renderSimulationHistory(data, append) {
    var rows = listFrom(data, ["itens"]);
    state.admin.simulations = append ? state.admin.simulations.concat(rows) : rows;
    function construirHtmlLegendaMmn() {
      var html = rows.map(function (row) {
      var id = row.id_simulacao || row.simulacao_id;
      return "<article class=\"mmn-simulation-history-row\"><label class=\"mmn-check\"><input type=\"checkbox\" data-simulation-select=\"" + escapeHtml(id) + "\"><span></span></label><div class=\"mmn-row-main\"><strong>" + escapeHtml(row.nome || (row.tipo === "admin_historica" ? legendaMmn("legenda_mmn_replay_historico") : legendaMmn("legenda_mmn_simulacao_prefixo") + (row.cenario || ""))) + "</strong><small>#" + escapeHtml(id) + legendaMmn("legenda_mmn_complemento_config") + escapeHtml(row.config_id) + " · " + escapeHtml(formatDate(row.criado_em, true)) + "</small><span>" + escapeHtml(simulationSummaryText(row)) + "</span></div>" + pillHtml(row.apta_publicacao ? "ok" : "pendente", row.apta_publicacao ? legendaMmn("legenda_mmn_rotulo_apta") : row.tipo) + "<div class=\"btn-row\"><button class=\"btn btn-ghost btn-small\" type=\"button\" data-simulation-detail=\"" + escapeHtml(id) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ver_detalhes")) + "</button><select class=\"mmn-export-select\" data-simulation-export-section=\"") + escapeHtml(id) + ("\"><option value=\"mensal\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_mensal")) + "</option><option value=\"niveis\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_niveis_mensagem")) + "</option><option value=\"ranks\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_ranks_mensagem")) + "</option><option value=\"resumo\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_resumo")) + "</option><option value=\"completo\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_completo")) + "</option></select><button class=\"btn btn-ghost btn-small\" type=\"button\" data-simulation-export=\"") + escapeHtml(id) + ("\">" + escapeHtml(legendaMmn("legenda_mmn_rotulo_exportar_json")) + "</button></div></article>");
    }).join("");
          return html;
    }
    var html = construirHtmlLegendaMmn();
    if (append) acrescentarHtmlMmn(qs("adminSimulationHistory"), html, construirHtmlLegendaMmn);
    else apresentarMmn(qs("adminSimulationHistory"),"innerHTML",function(){return construirHtmlLegendaMmn() || emptyHtml(legendaMmn("legenda_mmn_nenhuma_simulacao_registrada_com_esses_filtros"));});
    state.admin.cursors.simulations = data.proximo_cursor || null;
    qs("adminSimulationHistoryMore").hidden = data.has_more === false || !state.admin.cursors.simulations;
  }

  async function loadSimulationHistory(append) {
    try {
      var data = await rpc(CONFIG.rpcs.adminSimulationsList, {
        p_tipo: qs("adminSimulationHistoryType").value || null,
        p_config_id: integerValue(qs("adminSimulationHistoryVersion").value) || null,
        p_cursor: append ? state.admin.cursors.simulations : null,
        p_limite: CONFIG.pageSize
      });
      renderSimulationHistory(data, append);
      state.admin.loaded.simulationHistory = true;
    } catch (error) { qs("adminSimulationHistory").innerHTML = emptyHtml(friendlyMessage(error.message || error)); }
  }

  function renderSimulationComparison(data) {
    var simulations = listFrom(data, ["simulacoes"]);
    var series = listFrom(data, ["serie"]);
    var header = simulations.map(function (row) { return "<th>#" + escapeHtml(row.id_simulacao) + "<br><small>" + escapeHtml(row.nome || row.cenario || row.tipo) + "</small></th>"; }).join("");
    var rows = series.map(function (month) {
      return "<tr><td>" + escapeHtml(month.mes) + "</td>" + listFrom(month, ["valores"]).map(function (value) {
        var metrics = objectFrom(value, ["metricas"]);
        return "<td><strong>" + escapeHtml(formatMoneyCents(metrics.payout_centavos)) + "</strong><br><small>Receita " + escapeHtml(formatMoneyCents(metrics.receita_centavos)) + legendaMmn("legenda_mmn_complemento_margem") + escapeHtml(formatMoneyCents(metrics.margem_centavos)) + "</small><br><small>Δ payout " + escapeHtml(formatMoneyCents(value.diferenca_payout_centavos)) + "</small></td>";
      }).join("") + "</tr>";
    }).join("");
    apresentarMmn(qs("adminSimulationCompareResults"),"innerHTML",function(){return ("<div class=\"mmn-simulation-meta\"><strong>" + escapeHtml(legendaMmn("legenda_fechamento_mmn_comparacao_base"))) + escapeHtml(data.baseline_id) + ("</strong><span>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_2_a_4_execucoes_registradas_sem_alterar_dados_reais")) + "</span></div><div class=\"table-wrap mmn-simulation-table\"><table><thead><tr><th>" + escapeHtml(legendaMmn("legenda_mmn_rotulo_mes")) + "</th>") + header + "</tr></thead><tbody>" + rows + "</tbody></table></div>";});
  }

  async function exportSimulation(simulationId, section) {
    var data = await rpc(CONFIG.rpcs.adminSimulationExport, { p_simulacao_id: simulationId, p_secao: section });
    var blob = new Blob([JSON.stringify({ metadados: data.metadados, linhas: data.linhas }, null, 2)], { type: data.mime || "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = data.arquivo || ("mmn-simulacao-" + simulationId + ".json");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function setupSimulatorAndExport() {
    on("adminSimulatorForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminSimulatorSubmit", true, legendaMmn("legenda_mmn_rotulo_simulando"));
      try {
        var simulationParameters = collectAdminSimulationParameters();
        var data = await rpc(CONFIG.rpcs.adminSimulator, { p_config_id: integerValue(qs("adminSimVersion").value) || null, p_parametros: simulationParameters });
        state.admin.simulationParameters = Object.assign({}, objectFrom(data, ["premissas"]), simulationParameters);
        renderSimulationResults("adminSimulatorResults", data);
        state.admin.loaded.simulationHistory = false;
        await loadPublicationProgress(integerValue(qs("adminSimVersion").value));
      } catch (error) { qs("adminSimulatorResults").innerHTML = emptyHtml(friendlyMessage(error.message || error)); }
      finally { setBusy("adminSimulatorSubmit", false); }
    });
    on("adminReplayForm", "submit", async function (event) {
      event.preventDefault();
      setBusy("adminReplaySubmit", true, legendaMmn("legenda_mmn_rotulo_executando"));
      try {
        var data = await rpc(CONFIG.rpcs.adminSimulatorReplay, {
          p_config_id: integerValue(qs("adminReplayVersion").value) || null,
          p_competencia_de: monthDate(qs("adminReplayFrom").value),
          p_competencia_ate: monthDate(qs("adminReplayTo").value),
          p_parametros: {
            taxa_gateway_percentual: numberValue(qs("adminReplayGateway").value),
            impostos_percentual: numberValue(qs("adminReplayTaxes").value)
          }
        });
        renderSimulationResults("adminReplayResults", data);
        state.admin.loaded.simulationHistory = false;
      } catch (error) { qs("adminReplayResults").innerHTML = emptyHtml(friendlyMessage(error.message || error)); }
      finally { setBusy("adminReplaySubmit", false); }
    });
    on("adminSimulationHistoryFilter", "submit", function (event) { event.preventDefault(); loadSimulationHistory(false); });
    on("adminSimulationHistoryMore", "click", function () { loadSimulationHistory(true); });
    on("adminSimulationHistory", "click", async function (event) {
      var detailButton = event.target.closest("[data-simulation-detail]");
      var exportButton = event.target.closest("[data-simulation-export]");
      try {
        if (detailButton) {
          var detail = await rpc(CONFIG.rpcs.adminSimulationGet, { p_simulacao_id: integerValue(detailButton.dataset.simulationDetail) });
          renderSimulationResults("adminSimulationDetailResults", detail);
          qs("adminSimulationDetailResults").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (exportButton) {
          var id = integerValue(exportButton.dataset.simulationExport);
          var select = qs("adminSimulationHistory").querySelector("[data-simulation-export-section=\"" + id + "\"]");
          setBusy(exportButton, true, legendaMmn("legenda_mmn_rotulo_gerando"));
          try { await exportSimulation(id, select ? select.value : "mensal"); }
          finally { setBusy(exportButton, false); }
        }
      } catch (error) { setGlobalError(error); }
    });
    on("adminSimulationCompare", "click", async function () {
      var ids = qsa("[data-simulation-select]:checked", qs("adminSimulationHistory")).map(function (input) { return integerValue(input.dataset.simulationSelect); });
      if (ids.length < 2 || ids.length > 4) return setGlobalError(new Error(legendaMmn("legenda_mmn_selecione_de_2_a_4_simulacoes_distintas")));
      setBusy("adminSimulationCompare", true, legendaMmn("legenda_mmn_rotulo_comparando"));
      try {
        var data = await rpc(CONFIG.rpcs.adminSimulationsCompare, { p_simulacao_ids: ids });
        renderSimulationComparison(data);
        qs("adminSimulationCompareResults").scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) { setGlobalError(error); }
      finally { setBusy("adminSimulationCompare", false); }
    });
    on("adminPaymentExport", "click", async function () {
      try {
        var reason = await confirmAction(legendaMmn("legenda_mmn_criar_lote_manual"), legendaMmn("legenda_mmn_sera_criado_um_lote_real_para_a_competencia_selecionada_bloqueios_fiscais_e_valor"), true);
        if (reason === null) return;
        await rpc(CONFIG.rpcs.adminBatchCreate, { p_competencia: monthDate(qs("adminPaymentPeriod").value), p_simulacao: false, p_motivo: reason });
        await refreshAdminDashboard();
        await loadAdminTab("pagamentos", false);
      } catch (error) { setGlobalError(error); }
    });
  }

  function setupDialog() {
    on("actionDialogConfirm", "click", function () {
      var required = !qs("actionDialogReasonField").hidden;
      var reason = qs("actionDialogReason").value.trim();
      if (required && !reason) {
        qs("actionDialogReason").focus();
        return;
      }
      closeActionDialog(reason);
    });
    on("actionDialogForm", "submit", function (event) {
      if (event.submitter && event.submitter.value === "cancel") {
        event.preventDefault();
        closeActionDialog(null);
      }
    });
    on("actionDialog", "cancel", function (event) { event.preventDefault(); closeActionDialog(null); });
  }

  function setupInitialValues() {
    ["adminOverviewPeriod", "adminRevenuePeriod", "adminPaymentPeriod", "userLedgerPeriod"].forEach(function (id) { if (qs(id)) qs(id).value = monthValue(); });
    var now = new Date();
    var thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    if (qs("adminAuditFrom")) qs("adminAuditFrom").value = thirtyDaysAgo.toISOString().slice(0, 10);
    if (qs("adminAuditTo")) qs("adminAuditTo").value = now.toISOString().slice(0, 10);
    if (qs("adminSimUsers")) qs("adminSimUsers").value = "1000";
    if (qs("adminSimTicket")) qs("adminSimTicket").value = "19.90";
    if (qs("adminSimChurn")) qs("adminSimChurn").value = "16.67";
    if (qs("adminSimContinuity")) qs("adminSimContinuity").value = "60";
    if (qs("adminSimDirects")) qs("adminSimDirects").value = "0";
    if (qs("adminSimReplication")) qs("adminSimReplication").value = "2";
    if (qs("adminSimOdd")) qs("adminSimOdd").value = "6";
    if (qs("adminSimEven")) qs("adminSimEven").value = "8";
    if (qs("adminSimTarget")) qs("adminSimTarget").value = "300000";
    if (qs("adminSimCeiling")) qs("adminSimCeiling").value = "330000";
    if (qs("adminSimDiscount")) qs("adminSimDiscount").value = "0";
    if (qs("adminSimGateway")) qs("adminSimGateway").value = "3";
    if (qs("adminSimTaxes")) qs("adminSimTaxes").value = "0";
    if (qs("adminSimChargeback")) qs("adminSimChargeback").value = "1";
    if (qs("adminSimConversion")) qs("adminSimConversion").value = "40";
    if (qs("adminSimMaturity")) qs("adminSimMaturity").value = "3";
  }

  document.addEventListener("DOMContentLoaded", function () {
    configureMode();
    configureBrandHomeLink();
    configureBrandLogo();
    setupScrollLockRecovery();
    setupInitialValues();
    setupTabs();
    setupAuthEvents();
    setupAddressForms();
    setupPixValidationForms();
    setupRegulationOverlay();
    setupUserEvents();
    setupUserDetailOverlays();
    setupProgramExitDialog();
    setupAdminFilters();
    setupAdminActions();
    setupConfigEvents();
    setupSimulatorAndExport();
    setupDialog();
    boot();
  });
}());
