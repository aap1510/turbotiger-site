# Credenciais e aprovações externas

O Codex pode construir telas, fluxos OAuth, conectores, testes e documentação. Ele não substitui ações administrativas exigidas pelas plataformas.

## Ações humanas necessárias

- Criar/validar portfólio empresarial e contas.
- Aceitar termos de desenvolvedor.
- Criar aplicativos nas plataformas.
- Solicitar revisão de permissões quando exigida.
- Autorizar OAuth com usuário administrador.
- Fornecer IDs de contas, páginas, pixels/datasets, canais e números.
- Configurar domínios, URLs de redirecionamento e webhooks.
- Validar contratos e territórios.
- Definir orçamentos e aprovações.
- Cadastrar método de pagamento diretamente nas plataformas.

## Segurança de credenciais

- Nunca enviar chaves por chat ou commit.
- Inserir segredos diretamente no cofre do ambiente.
- Usar credenciais de homologação primeiro.
- Conceder somente escopos necessários.
- Registrar proprietário, data, expiração e rotação.

## Checklist por conector

Cada conector deve produzir um documento próprio com:

- conta e aplicativo;
- escopos/permissões;
- ambiente;
- redirect URIs;
- webhook URLs;
- processo de revisão;
- limites/rate limits;
- política de tokens;
- modo de teste;
- procedimento de revogação;
- responsável interno.
