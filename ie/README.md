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

A página usa exclusivamente as fachadas públicas `ie_*`: resumo do card, bootstrap, catálogo, seleções, filtros, esporte favorito, alertas, partidas, detalhe de partida e notícias. IDs e nomes específicos de provedores nunca chegam à interface.

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

## Publicação e validação

Codex altera somente esta pasta local. O proprietário publica manualmente.

Antes da publicação/teste final:

- confirmar a URL HTTPS e o prefixo autorizados no Delphi;
- testar entrada fora do app, que deve permanecer bloqueada;
- testar sessão, voltar, atualizar, fechar e logout;
- testar busca/filtros, seleções independentes e esporte favorito;
- abrir uma notícia e confirmar que só é possível rolar;
- confirmar em navegador desktop e mobile que a página permanece bloqueada, inclusive com parâmetros de URL arbitrários;
- validar a interface funcional somente dentro da WebView dedicada do app Turbo Tiger.

Referência técnica completa: `docs/_referencias/inteligencia_esportiva/README.md`.
