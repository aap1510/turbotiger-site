# So Bolao - Turbo Tiger

Modulo web estatico acoplado ao site do Turbo Tiger.

## Arquivos

- `index.html` - painel unico com perfis Usuario, Admin, Suporte e Loterica.
- `assets/sobolao.css` - visual responsivo do modulo.
- `assets/sobolao.js` - autenticacao Supabase, RPCs e previa local.
- `database/mod_sobolao.sql` - schema `mod_sobolao`, tabelas, RLS e RPCs.

## Banco

O SQL cria o schema isolado `mod_sobolao`, bloqueia acesso direto por RLS e expoe a operacao por RPCs:

- `sobolao_usuario_painel_rpc`
- `sobolao_loterica_painel_rpc`
- `sobolao_participar_rpc`
- `sobolao_suporte_chamado_rpc`
- `adm_sobolao_painel_rpc`
- `adm_sobolao_bolao_salvar_rpc`
- `adm_sobolao_loterica_salvar_rpc`
- `adm_sobolao_status_rpc`

Aplicacao manual recomendada, a partir da raiz do projeto:

```powershell
& "tools\supabase-cli\supabase.exe" db query --linked --file "turbotiger-site\sobolao\database\mod_sobolao.sql"
```

## Publicacao

Somente arquivos locais foram preparados. A publicacao no provedor deve ser feita manualmente junto com o restante de `turbotiger-site`.
