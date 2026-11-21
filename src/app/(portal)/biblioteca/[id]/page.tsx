"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AssetThumb } from "@/components/portal/AssetThumb";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { downloadAssetFile } from "@/lib/download";
import { useStore } from "@/lib/store";
import { formatDate, isDownloadable } from "@/lib/utils";

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { store, recordDownload, toggleFavorite } = useStore();
  const { notify } = useToast();
  const asset = store.assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="container" style={{ padding: "64px 20px" }}>
        <h1>Asset não encontrado</h1>
        <p style={{ margin: "12px 0 20px", color: "var(--ink-muted)" }}>
          O material solicitado não existe ou foi removido.
        </p>
        <Button href="/biblioteca" variant="secondary">
          Voltar à biblioteca
        </Button>
      </div>
    );
  }

  const canDownload = isDownloadable(asset);
  const favored = store.favorites.includes(asset.id);
  const categories = store.categories.filter((c) =>
    asset.categoryIds.includes(c.id)
  );
  const product = store.products.find((p) => p.id === asset.productId);
  const campaign = store.campaigns.find((c) => c.id === asset.campaignId);
  const owner = store.users.find((u) => u.id === asset.ownerId);

  return (
    <div className="container" style={{ paddingBottom: 64 }}>
      <div className="page-hero">
        <Link href="/biblioteca" style={{ color: "var(--blue)", fontSize: 14 }}>
          ← Biblioteca
        </Link>
        <h1 style={{ marginTop: 12 }}>{asset.name}</h1>
        <p>{asset.description}</p>
      </div>

      <div className="detail-grid">
        <div className="card" style={{ overflow: "hidden" }}>
          <AssetThumb
            gradient={asset.thumbnailGradient}
            label={asset.thumbnailLabel}
            ratio="16/11"
          />
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <StatusBadge status={asset.status} />
            <span className="badge badge-neutral">v{asset.version}</span>
            {favored ? <span className="badge badge-neutral">Favorito</span> : null}
          </div>

          <dl className="detail-dl">
            <dt>Categorias</dt>
            <dd>{categories.map((c) => c.name).join(", ") || "—"}</dd>
            <dt>Produto</dt>
            <dd>{product?.name ?? "—"}</dd>
            <dt>Campanha</dt>
            <dd>
              {campaign ? (
                <Link href={`/campanhas/${campaign.id}`} style={{ color: "var(--blue)" }}>
                  {campaign.name}
                </Link>
              ) : (
                "—"
              )}
            </dd>
            <dt>Dimensões</dt>
            <dd>{asset.dimensions ?? "—"}</dd>
            <dt>Publicado</dt>
            <dd>{formatDate(asset.publishedAt)}</dd>
            <dt>Atualizado</dt>
            <dd>{formatDate(asset.updatedAt)}</dd>
            <dt>Validade</dt>
            <dd>{asset.expiresAt ? formatDate(asset.expiresAt) : "Sem validade"}</dd>
            <dt>Responsável</dt>
            <dd>{owner?.name ?? "—"}</dd>
            <dt>Downloads</dt>
            <dd>{asset.downloads}</dd>
          </dl>

          <div className="usage-box">
            <strong>Orientações de utilização</strong>
            <p>{asset.usageNotes}</p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                toggleFavorite(asset.id);
                notify(
                  favored ? "Removido dos favoritos" : "Adicionado aos favoritos"
                );
              }}
            >
              {favored ? "★ Remover favorito" : "☆ Favoritar"}
            </button>
          </div>

          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Formatos disponíveis</h2>
          {!canDownload ? (
            <p style={{ color: "var(--danger)", marginBottom: 12 }}>
              Este material não está disponível para download (status: {asset.status}
              {asset.expiresAt ? ` · validade ${formatDate(asset.expiresAt)}` : ""}).
            </p>
          ) : null}
          <div style={{ display: "grid", gap: 10 }}>
            {asset.formats.map((file) => (
              <div key={file.id} className="format-row">
                <div>
                  <strong>{file.label}</strong>
                  <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    {file.format}
                    {file.dimensions ? ` · ${file.dimensions}` : ""} · {file.sizeLabel}
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={!canDownload}
                  onClick={() => {
                    downloadAssetFile(asset, file);
                    recordDownload(asset.id);
                    notify(`Download: ${file.format}`);
                  }}
                >
                  Baixar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-grid {
          display: grid;
          grid-template-columns: minmax(280px, 1.1fr) minmax(280px, 0.9fr);
          gap: 28px;
        }
        .detail-dl {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 10px 12px;
          margin: 0 0 20px;
          font-size: 14px;
        }
        .detail-dl dt {
          color: var(--ink-muted);
        }
        .detail-dl dd {
          margin: 0;
        }
        .usage-box {
          background: var(--bg-soft);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .usage-box strong {
          display: block;
          margin-bottom: 6px;
        }
        .usage-box p {
          color: var(--ink-muted);
          font-size: 14px;
        }
        .format-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
        }
        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
