"use client";

import Link from "next/link";
import type { Asset } from "@/lib/types";
import { formatDate, isDownloadable } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { AssetThumb } from "./AssetThumb";
import { useStore } from "@/lib/store";
import { downloadAssetFile } from "@/lib/download";
import { useToast } from "@/components/ui/Toast";

export function AssetCard({
  asset,
  categoryName,
  dense,
}: {
  asset: Asset;
  categoryName?: string;
  dense?: boolean;
}) {
  const { recordDownload, toggleFavorite, store } = useStore();
  const { notify } = useToast();
  const canDownload = isDownloadable(asset);
  const favored = store.favorites.includes(asset.id);

  return (
    <article className={`card card-interactive asset-card ${dense ? "asset-card--dense" : ""}`}>
      <Link href={`/biblioteca/${asset.id}`} className="asset-card__media">
        <AssetThumb gradient={asset.thumbnailGradient} label={asset.thumbnailLabel} />
      </Link>
      <div className="asset-card__body">
        <div className="asset-card__meta">
          <StatusBadge status={asset.status} />
          <span>{asset.formats[0]?.format}</span>
        </div>
        <h3>
          <Link href={`/biblioteca/${asset.id}`}>{asset.name}</Link>
        </h3>
        {categoryName ? <p className="asset-card__cat">{categoryName}</p> : null}
        <p className="asset-card__date">Atualizado em {formatDate(asset.updatedAt)}</p>
        <div className="asset-card__actions">
          <Link className="btn btn-outline btn-sm" href={`/biblioteca/${asset.id}`}>
            Detalhes
          </Link>
          <button
            className="btn btn-secondary btn-sm"
            disabled={!canDownload}
            onClick={() => {
              downloadAssetFile(asset, asset.formats[0]);
              recordDownload(asset.id);
              notify("Download iniciado");
            }}
          >
            Baixar
          </button>
          <button
            className="btn btn-ghost btn-sm"
            aria-label={favored ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={() => {
              toggleFavorite(asset.id);
              notify(favored ? "Removido dos favoritos" : "Adicionado aos favoritos");
            }}
          >
            {favored ? "★" : "☆"}
          </button>
        </div>
      </div>
    </article>
  );
}
