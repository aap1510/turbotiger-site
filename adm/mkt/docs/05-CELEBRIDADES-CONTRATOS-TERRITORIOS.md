# Celebridades, contratos, ativos e territórios

## Objetivo

Transformar direitos contratuais em regras executáveis, testáveis e auditáveis.

## Caso inicial conhecido

- Celebridade: Cauã Reymond.
- Tráfego pago: permitido somente na região contratualmente autorizada.
- Tráfego orgânico: permitido sem restrição regional, conforme informação atual.
- A definição operacional exata da região e as datas de vigência ainda devem ser cadastradas a partir do contrato oficial.
- Não assumir município, região metropolitana, raio ou lista de cidades sem validação.

## Entidades

### Celebridade

- nome;
- nome público;
- status;
- observações.

### Contrato de direitos

- identificador;
- celebridade;
- documento e hash;
- início e fim;
- status;
- modalidades permitidas;
- plataformas permitidas;
- formatos permitidos;
- territórios;
- regras de edição;
- exigência de aprovação;
- ação ao vencer.

### Ativo

- arquivo, hash e versão;
- celebridade e contrato;
- origem e aprovação;
- modalidades paga/orgânica;
- plataformas e formatos;
- vigência própria;
- recorte, texto sobreposto, alteração visual, voz e fala permitidos/proibidos;
- territórios aplicáveis.

### Território operacional

- nome e versão;
- tipo: municípios, raio, geo IDs ou polígono quando suportado;
- descrição contratual original;
- lista operacional validada;
- IDs por plataforma;
- inclusões e exclusões;
- aprovador e data;
- status.

## Política de validação

Para ação com celebridade:

1. contrato ativo;
2. ativo aprovado e hash válido;
3. modalidade permitida;
4. plataforma e formato permitidos;
5. vigência válida;
6. edição compatível;
7. território correto para mídia paga;
8. criação pausada;
9. readback da plataforma;
10. ativação somente após sucesso de todas as verificações.

## Regra de segurança

Se não for possível provar que o território configurado corresponde ao autorizado, o sistema deve bloquear, não aproximar.
