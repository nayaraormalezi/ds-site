# CAIXA Consórcio | Portal de Marca e Assets (DAM)

Portal DAM para centralizar materiais oficiais da marca CAIXA Consórcio — biblioteca, diretrizes, kits de campanha e painel administrativo.

## Referências

- **Projeto-base visual/técnico:** [nayaraormalezi/site](https://github.com/nayaraormalezi/site) (tokens, tipografia CAIXA Std, botões, logo)
- **Referência de produto:** [marca.totvs.com](https://marca.totvs.com/)

## Stack

- Next.js (App Router) + TypeScript
- CSS com design tokens do projeto-base
- Persistência demo em `localStorage` (`src/lib/store.tsx`)
- Downloads reais + ZIP de campanha (`jszip`)

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

- Portal externo: `/`
- Painel admin: `/admin`

## Ambientes

### Portal (fornecedores)

Início · A marca · Identidade visual · Guias · Biblioteca · Templates · Campanhas · Central de ajuda

### Admin

Dashboard · Assets · Campanhas · Categorias · Guias · Usuários · Solicitações · Histórico · Configurações

## Governança

Somente assets `aprovado` e dentro da validade podem ser baixados no portal. Expirados, arquivados e em revisão ficam fora da biblioteca externa.
