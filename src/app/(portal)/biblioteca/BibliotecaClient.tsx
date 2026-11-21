"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssetCard } from "@/components/portal/AssetCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchField } from "@/components/ui/SearchField";
import { useStore } from "@/lib/store";
import type { SortOption, ViewMode } from "@/lib/types";
import { filterAssets } from "@/lib/utils";

export default function BibliotecaClient() {
  const { store, ready } = useStore();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [productId, setProductId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [formats, setFormats] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("recent");
  const [view, setView] = useState<ViewMode>("grid");

  const allFormats = useMemo(() => {
    const set = new Set<string>();
    store.assets.forEach((a) => a.formats.forEach((f) => set.add(f.format)));
    return Array.from(set).sort();
  }, [store.assets]);

  const allChannels = useMemo(() => {
    const set = new Set<string>();
    store.assets.forEach((a) => a.channels.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [store.assets]);

  const results = useMemo(
    () =>
      filterAssets(store.assets, {
        query,
        categoryIds,
        productId: productId || undefined,
        campaignId: campaignId || undefined,
        formats,
        channels,
        sort,
      }),
    [store.assets, query, categoryIds, productId, campaignId, formats, channels, sort]
  );

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  }

  return (
    <div className="container" style={{ paddingBottom: 64 }}>
      <div className="page-hero">
        <p className="section-label">Biblioteca</p>
        <h1>Biblioteca de assets</h1>
        <p>
          Encontre materiais oficiais aprovados para suas produções. Filtre por
          categoria, produto, campanha e formato.
        </p>
      </div>

      <div className="library-layout">
        <aside className="filters-panel" aria-label="Filtros">
          <h3>Filtros</h3>

          <div className="filter-group">
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Categoria
            </strong>
            {store.categories.map((cat) => (
              <label key={cat.id}>
                <input
                  type="checkbox"
                  checked={categoryIds.includes(cat.id)}
                  onChange={() => toggle(categoryIds, cat.id, setCategoryIds)}
                />
                {cat.name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <label htmlFor="product">
              <strong>Produto</strong>
            </label>
            <select
              id="product"
              className="select"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Todos</option>
              {store.products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="campaign">
              <strong>Campanha</strong>
            </label>
            <select
              id="campaign"
              className="select"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <option value="">Todas</option>
              {store.campaigns
                .filter((c) => c.published)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="filter-group">
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Formato
            </strong>
            {allFormats.map((format) => (
              <label key={format}>
                <input
                  type="checkbox"
                  checked={formats.includes(format)}
                  onChange={() => toggle(formats, format, setFormats)}
                />
                {format}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Canal
            </strong>
            {allChannels.map((channel) => (
              <label key={channel}>
                <input
                  type="checkbox"
                  checked={channels.includes(channel)}
                  onChange={() => toggle(channels, channel, setChannels)}
                />
                {channel}
              </label>
            ))}
          </div>

          <button
            className="btn btn-soft btn-sm"
            style={{ width: "100%" }}
            onClick={() => {
              setCategoryIds([]);
              setProductId("");
              setCampaignId("");
              setFormats([]);
              setChannels([]);
              setQuery("");
            }}
          >
            Limpar filtros
          </button>
        </aside>

        <section>
          <div className="library-toolbar">
            <SearchField
              id="lib-search"
              className="library-search"
              value={query}
              onChange={setQuery}
              placeholder="Buscar assets..."
            />

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label className="sr-only" htmlFor="sort">
                Ordenar
              </label>
              <select
                id="sort"
                className="select"
                style={{ width: "auto" }}
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
              >
                <option value="recent">Mais recentes</option>
                <option value="updated">Atualização</option>
                <option value="name">Nome</option>
                <option value="downloads">Downloads</option>
              </select>
              <button
                className={`btn btn-sm ${view === "grid" ? "btn-secondary" : "btn-outline"}`}
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
              >
                Grid
              </button>
              <button
                className={`btn btn-sm ${view === "list" ? "btn-secondary" : "btn-outline"}`}
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
              >
                Lista
              </button>
            </div>
          </div>

          <p style={{ color: "var(--ink-muted)", marginBottom: 16 }}>
            {ready ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Carregando..."}
          </p>

          {!ready ? (
            <div className="grid-cards">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260 }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title="Nenhum material encontrado"
              description="Ajuste os filtros ou tente outra busca. Apenas assets aprovados e vigentes aparecem aqui."
              actionLabel="Limpar filtros"
              onAction={() => {
                setCategoryIds([]);
                setProductId("");
                setCampaignId("");
                setFormats([]);
                setChannels([]);
                setQuery("");
              }}
            />
          ) : (
            <div
              className="grid-cards"
              style={view === "list" ? { gridTemplateColumns: "1fr" } : undefined}
            >
              {results.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  categoryName={
                    store.categories.find((c) => c.id === asset.categoryIds[0])
                      ?.name
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
