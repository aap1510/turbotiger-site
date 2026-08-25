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

O token não é colocado na URL, no armazenamento do navegador ou em logs. Fora do aplicativo, a página permanece bloqueada.

## Prévia local

Somente em `localhost` ou `127.0.0.1`, a query `?preview=1` ativa dados demonstrativos para validação visual. Esse modo não funciona em um domínio publicado.

## Backend esperado

A página usa exclusivamente as fachadas públicas `ie_*`: resumo do card, bootstrap, catálogo, seleções, filtros, esporte favorito, alertas, partidas, detalhe de partida e notícias. IDs e nomes específicos de provedores nunca chegam à interface.
