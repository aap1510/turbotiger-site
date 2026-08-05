# PRD - requisitos do produto

## Perfis de usuário

- Proprietário/Administrador geral.
- Gestor de marketing.
- Gestor de tráfego.
- Atendente comercial/suporte.
- Revisor de compliance/jurídico.
- Analista somente leitura.
- Agente de serviço/worker, sem acesso humano ao painel.

## Requisitos funcionais

### Organizações e marcas

- Cadastrar empresa, marca, domínio, páginas, contas e canais.
- Permitir inicialmente uma organização, com estrutura preparada para mais de uma.
- Isolar dados por organização.

### Conectores

- Ativar/desativar cada plataforma.
- Definir modo: somente leitura, rascunho, aprovação, automático, bloqueado.
- Gerenciar OAuth, contas e permissões.
- Exibir saúde do conector, token, escopos, última sincronização e erros.
- Manter matriz de capacidades por plataforma e versão.

### IA

- Cadastrar provedores, modelos, prioridade, fallback e teto de custo.
- Selecionar modelo por tarefa.
- Guardar versão de prompt, entrada, saída, custo e decisão.
- Permitir segunda revisão por outro modelo.
- Impedir que conteúdo recebido do público altere instruções internas.

### Conteúdo orgânico

- Calendário por dia, horário, canal e formato.
- Feed, Stories, Reels, Shorts, vídeos, imagens, carrosséis e textos conforme capacidade da plataforma.
- Geração de briefing, legenda, roteiro e criativo.
- Aprovação e versionamento.
- Publicação agendada, confirmação pós-publicação e tratamento de falha.
- Limites de frequência e prevenção de repetição.

### Tráfego pago

- Criar briefings de campanha.
- Gerar proposta de estrutura, público, orçamento e criativos.
- Criar campanha real no gerenciador oficial por API/conector.
- Nascer pausada ou em rascunho.
- Ler de volta a configuração e validar antes de ativar.
- Limitar orçamento, território, idade, prazo, posicionamento e ativos.
- Coletar métricas e permitir regras de otimização.

### Celebridades e direitos

- Cadastrar celebridade, contrato, vigência, território e ativos.
- Diferenciar tráfego pago e orgânico.
- Definir plataformas, formatos e edições permitidas.
- Bloquear uso fora da regra.
- Alertar vencimento e pausar programações relacionadas.

### Atendimento omnichannel

- Receber Instagram Direct, Facebook Messenger, comentários, WhatsApp, e-mail, formulários e leads.
- Normalizar em caixa de entrada única.
- Identificar contato, canal, origem, anúncio, campanha e UTM quando disponível.
- Responder automaticamente, criar rascunho ou encaminhar para humano.
- Permitir ao humano assumir e devolver a conversa.
- Manter histórico, anexos, tags, SLA e status.

### CRM e atribuição

- Contatos, oportunidades, estágios, tarefas, notas e responsáveis.
- Registrar origem e touchpoints.
- Marcar cadastro, assinatura, cancelamento e receita quando integrados.
- Enviar conversões elegíveis de volta às plataformas.
- Relatórios por campanha, criativo, canal, celebridade, território e estágio.

### Auditoria

- Registrar toda ação humana, da IA e dos workers.
- Guardar antes/depois, regra aplicada, aprovação, retorno externo e correlation ID.
- Permitir exportação e investigação.

## Requisitos não funcionais

- Segurança por padrão e menor privilégio.
- Idempotência em webhooks e comandos externos.
- Observabilidade com logs estruturados, métricas e alertas.
- Resiliência a token expirado, indisponibilidade e rate limits.
- LGPD: minimização, retenção, consentimento, acesso e exclusão conforme política aprovada.
- Escalabilidade horizontal dos workers.
- Interface em português do Brasil.
- Acessibilidade e responsividade.
- Testabilidade de regras sem depender de plataformas reais.
