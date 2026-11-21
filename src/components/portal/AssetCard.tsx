"use client";

import type { Asset } from "@/lib/types";
import { formatDate, isDownloadable } from "@/lib/utils";
import { ContentCard } from "@/components/ui/ContentCard";
import { Button } from "@/components/ui/Button";
import { AssetThumb } from "./AssetThumb";
import { useStore } from "@/lib/store";
import { downloadAssetFile } from "@/lib/download";
import { useToast } from "@/components/ui/Toast";

export function AssetCard({
  asset,
  categoryName,
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
    <ContentCard
      href={`/biblioteca/${asset.id}`}
      eyebrow={categoryName ?? asset.formats[0]?.format}
      title={asset.name}
      description={asset.description}
      meta={formatDate(asset.updatedAt)}
      media={
        <AssetThumb
          gradient={asset.thumbnailGradient}
          label={asset.thumbnailLabel}
          ratio="1/1"
        />
      }
      footer={
        <div className="asset-card__actions">
          <Button href={`/biblioteca/${asset.id}`} variant="outline" size="sm">
            Detalhes
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!canDownload}
            onClick={() => {
              downloadAssetFile(asset, asset.formats[0]);
              recordDownload(asset.id);
              notify("Download iniciado");
            }}
          >
            Baixar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={favored ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={() => {
              toggleFavorite(asset.id);
              notify(favored ? "Removido dos favoritos" : "Adicionado aos favoritos");
            }}
          >
            {favored ? "★" : "☆"}
          </Button>
        </div>
      }
    />
  );
}
