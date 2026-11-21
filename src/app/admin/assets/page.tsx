"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import type { AssetStatus } from "@/lib/types";
import { filterAssets, formatDate } from "@/lib/utils";

export default function AdminAssetsPage() {
  const { store, setAssetStatus, deleteAsset, duplicateAsset } = useStore();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AssetStatus | "">("");

  const rows = useMemo(
    () =>
      filterAssets(
        store.assets,
        {
          query,
          status: status ? [status] : undefined,
          sort: "updated",
        },
        { admin: true }
      ),
    [store.assets, query, status]
  );

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Biblioteca de assets</h1>
          <p>Cadastre, publique, versione e arquive materiais.</p>
        </div>
        <Link className="btn btn-secondary" href="/admin/assets/new">
          Cadastrar asset
        </Link>
      </div>

      <div className="panel">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <input
            className="input"
            style={{ maxWidth: 360 }}
            placeholder="Buscar por nome, tag ou formato"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="select"
            style={{ width: "auto" }}
            value={status}
            onChange={(e) => setStatus(e.target.value as AssetStatus | "")}
          >
            <option value="">Todos os status</option>
            <option value="aprovado">Aprovado</option>
            <option value="em_revisao">Em revisão</option>
            <option value="expirado">Expirado</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Produto</th>
                <th>Formato</th>
                <th>Versão</th>
                <th>Status</th>
                <th>Atualização</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((asset) => {
                const category = store.categories.find((c) =>
                  asset.categoryIds.includes(c.id)
                );
                const product = store.products.find((p) => p.id === asset.productId);
                const owner = store.users.find((u) => u.id === asset.ownerId);
                return (
                  <tr key={asset.id}>
                    <td>
                      <div
                        className="thumb-mini"
                        style={{ background: asset.thumbnailGradient }}
                      >
                        {asset.thumbnailLabel.slice(0, 6)}
                      </div>
                    </td>
                    <td style={{ minWidth: 180 }}>{asset.name}</td>
                    <td>{category?.name ?? "—"}</td>
                    <td>{product?.name ?? "—"}</td>
                    <td>{asset.formats.map((f) => f.format).join(", ")}</td>
                    <td>{asset.version}</td>
                    <td>
                      <StatusBadge status={asset.status} />
                    </td>
                    <td>{formatDate(asset.updatedAt)}</td>
                    <td>{owner?.name.split(" ")[0] ?? "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Link
                          className="btn btn-outline btn-sm"
                          href={`/admin/assets/${asset.id}/edit`}
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-soft btn-sm"
                          onClick={() => {
                            setAssetStatus(
                              asset.id,
                              asset.status === "aprovado" ? "arquivado" : "aprovado"
                            );
                            notify(
                              asset.status === "aprovado"
                                ? "Asset arquivado"
                                : "Asset publicado"
                            );
                          }}
                        >
                          {asset.status === "aprovado" ? "Arquivar" : "Publicar"}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            duplicateAsset(asset.id);
                            notify("Asset duplicado");
                          }}
                        >
                          Duplicar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Excluir "${asset.name}"? Esta ação não pode ser desfeita.`
                              )
                            ) {
                              deleteAsset(asset.id);
                              notify("Asset excluído");
                            }
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
