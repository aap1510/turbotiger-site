# Central de Inteligência Esportiva

Central local, app-only, carregada pela WebView dedicada do Turbo Tiger. Estes arquivos não devem ser publicados automaticamente.

## Contrato com o aplicativo

A página chama `window.TurboTigerIEBridge.post(JSON)` com uma destas mensagens:

- `session_request`: solicita a sessão Supabase atual.
- `close`: solicita o fechamento da central.
- `open_news`: solicita a WebView isolada e somente leitura da fonte original.
- `preferences_changed`: informa que as escolhas foram alteradas.

O aplicativo entrega a sessão em memória chamando:

```js
window.TurboTigerIEReceiveSession({
  ok: true,
  session: { access_token: "..." }
});
```

O token não é colocado na URL, no armazenamento do navegador ou em logs. Fora do aplicativo, a página permanece bloqueada. Não existe modo de prévia, parâmetro de URL ou dados demonstrativos capazes de liberar a interface em navegador desktop ou mobile.

## Backend esperado

A página usa exclusivamente as fachadas públicas `ie_*`: resumo do card, bootstrap, catálogo, seleções, filtros, esporte favorito, alertas, partidas, detalhe de partida, notícias, experiência esportiva e títulos confirmados. IDs e nomes específicos de provedores nunca chegam à interface.

Para a experiência esportiva, a central usa as RPCs autenticadas de marcação, conflito, acompanhantes, configuração do perfil e ranking. A interface nunca lê diretamente as tabelas `mod_ie.tbl_ie_exp_*` nem chama as rotinas internas de fila, hash, manutenção ou registro de origem.

## Segurança das WebViews

A central e a fonte da notícia usam WebViews e pontes diferentes:

- A central aceita mensagens somente quando Java confirma a origem HTTPS e o prefixo de caminho autorizados.
- A sessão Supabase é entregue apenas à central e permanece em memória.
- A janela de notícia nunca recebe sessão, `TurboTigerIEBridge` ou outra ponte nativa.
- Na notícia, somente o carregamento HTTPS inicial e seus redirecionamentos iniciais limitados são aceitos.
- Depois do carregamento, cliques, links, formulários, popups, novas janelas, downloads, file chooser, diálogos, permissões, geolocalização e navegação são bloqueados; a rolagem permanece disponível.
- A janela de notícia deve aparecer menor que a central e usar os controles nativos de voltar e fechar.

## Rotas e ações

As ações da interface carregam apenas tipo, ID canônico interno e seção visual. As rotas cobertas são:

- `para-voce`
- `jogos`
- `campeonatos`
- `times`
- `noticias`
- `configuracoes`
- detalhe de partida por ID interno

O botão `Detalhes` de cada face abre a seção correspondente. Notícias usam `open_news` com a URL HTTPS original retornada pelo backend.

## Logout, troca de conta e cache

Ao receber logout, sessão inválida ou troca de usuário, a página deve:

1. eliminar a sessão mantida em memória;
2. interromper chamadas autenticadas pendentes;
3. remover o conteúdo e as preferências em memória do usuário anterior;
4. voltar ao estado bloqueado até uma nova `session_request` válida.

O cache persistente do card pertence ao aplicativo nativo e é separado por usuário. Esta página não deve gravar token nem snapshot autenticado em `localStorage`, `sessionStorage`, cookies próprios ou IndexedDB.

## Experiência esportiva e títulos

O usuário pode marcar um confronto como assistido no `local` do evento ou de forma `remoto` por TV, streaming ou outro meio. As opções são mutuamente exclusivas. Marcações locais conflitantes são resolvidas pelas RPCs do backend com duração e margens configuradas por esporte; a página apenas apresenta o conflito e a escolha do usuário.

Acompanhantes e convites seguem estes limites:

- o nome e o e-mail não são publicados por padrão;
- o destinatário pode confirmar, contestar, recusar ou bloquear novos convites;
- limites e intervalo mínimo por destinatário são aplicados no backend sem revelar bloqueio ou existência do endereço;
- a vinculação a uma conta exige correspondência com o e-mail verificado;
- a central exibe somente o estado autorizado e nunca recebe o pepper HMAC, o e-mail completo de terceiros ou o segredo do worker;
- o envio é executado pela Edge `ie-experiencia-convites`, não pelo navegador.

O perfil público pertence a um usuário e esporte, é localizado por código opaco e respeita controles independentes para codinome, confrontos, locais, acompanhantes, colaborações e ranking. Sua referência MMN vem do fluxo oficial de indicação; abrir um link não contabiliza indicação sem o cadastro/vínculo exigido pelo MMN.

Os títulos exibidos usam os arrays autoritativos `campeoes` e `vices`, inclusive quando `titulo_compartilhado=true`. A página deve preservar todos os campeões e a ausência real de vice, sem reduzir o dado aos campos singulares de compatibilidade.

Estados de decisão:

- `completa`: o usuário assistiu a todos os confrontos confirmados exigidos pelo formato da decisão;
- `incompleta`: existe formato aplicável, mas falta ao menos um confronto obrigatório;
- `nao_aplicavel`: não há estrutura confirmada suficiente de final única, ida/volta ou desempate; nesse caso `decisao_completa` é `null`.

O selo `Título confirmado` só pode aparecer quando o próprio vínculo do confronto tiver `papel_confronto='confirmacao_titulo'`. Um título confirmado na edição não autoriza aplicar o selo a todos os confrontos relacionados.

RPCs adicionais consumidas pela interface:

- `ie_experiencias_confrontos_resumo_rpc`
- `ie_experiencia_marcar_rpc`
- `ie_exp_experiencia_origem_marcar_rpc`
- `ie_experiencia_conflito_resolver_rpc`
- `ie_exp_experiencia_origem_conflito_resolver_rpc`
- `ie_experiencia_acompanhantes_listar_rpc`
- `ie_experiencia_acompanhante_salvar_rpc`
- `ie_experiencia_acompanhante_remover_rpc`
- `ie_experiencia_historia_config_salvar_rpc`
- `ie_experiencia_historia_codigo_renovar_rpc`
- `ie_experiencias_ranking_rpc`
- `ie_titulos_confrontos_resumo_rpc`
- `ie_experiencia_titulos_resumo_rpc`

## História pública por código

`turbotiger-site/historia-esportiva` é uma superfície separada da central. Ela pode ser aberta por código público de perfil ou token de convite e consome somente as RPCs públicas limitadas:

- `ie_experiencia_historia_bootstrap_rpc`
- `ie_experiencia_historia_itens_rpc`
- `ie_experiencia_convite_publico_rpc`
- `ie_experiencia_convite_responder_rpc`
- `ie_experiencia_email_optout_rpc`

Essa página pública não recebe sessão da central, não cria um modo navegador para `turbotiger-site/ie` e não pode ampliar a visibilidade além das preferências do dono.

## Publicação e validação

Codex altera somente esta pasta local. O proprietário publica manualmente.

A integração de experiência e títulos altera somente banco, Edge e arquivos locais do site. Não muda Delphi, JNI, Java, JAR ou DEX e não exige recompilação desses artefatos por si só.

Antes da publicação/teste final:

- confirmar a URL HTTPS e o prefixo autorizados no Delphi;
- testar entrada fora do app, que deve permanecer bloqueada;
- testar sessão, voltar, atualizar, fechar e logout;
- testar busca/filtros, seleções independentes e esporte favorito;
- abrir uma notícia e confirmar que só é possível rolar;
- confirmar em navegador desktop e mobile que a página permanece bloqueada, inclusive com parâmetros de URL arbitrários;
- validar a interface funcional somente dentro da WebView dedicada do app Turbo Tiger.

Referência técnica completa: `docs/_referencias/inteligencia_esportiva/README.md`.
