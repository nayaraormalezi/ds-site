# DAM — Portal de Marca CAIXA Consórcio

## Análise do projeto-base (`nayaraormalezi/site`)

- Stack base: HTML + CSS + JS estático
- Tipografia: CAIXA Std (Light/Regular/SemiBold/Bold)
- Tokens: `--blue #005ca9`, `--blue-deep #003d73`, `--orange #f39200`, `--ink #232b35`, `--ink-muted #616d7a`, `--line #ebedee`, `--bg-soft #f5f7f9`, `--radius 8px`, `--radius-lg 16px`, `--container 1320px`
- Componentes reaproveitados: botões (primary/secondary/outline), search field, cards, section labels, header/footer patterns, FAQ/details
- Referência de produto: marca.totvs.com (IA de portal de marca)

## Stack do DAM (`ds-site`)

- Next.js App Router + TypeScript
- CSS global com tokens do projeto-base (sem design system paralelo)
- Persistência demo: localStorage + seed estático (camada `lib/store` pronta para API)
- Downloads reais via Blob + JSZip para kits de campanha
