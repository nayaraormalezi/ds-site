"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AssetCard } from "@/components/portal/AssetCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { downloadCampaignZip } from "@/lib/download";
import { useStore } from "@/lib/store";
import { formatDate, isDownloadable } from "@/lib/utils";

export default function CampanhaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { store, recordDownload } = useStore();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  const campaign = store.campaigns.find((c) => c.id === id);
  const assets = useMemo(
    () =>
      campaign
        ? store.assets.filter((a) => campaign.assetIds.includes(a.id))
        : [],
    [campaign, store.assets]
  );
  const downloadable = assets.filter((a) => isDownloadable(a));

  if (!campaign) {
    return (
      <div className="container" style={{ padding: 64 }}>
        <h1>Campanha não encontrada</h1>
        <Button href="/campanhas" variant="secondary">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <Link href="/campanhas" style={{ color: "var(--blue)", fontSize: 14 }}>
          ← Campanhas
        </Link>
        <div
          className="thumb"
          style={{
            background: campaign.coverGradient,
            marginTop: 16,
            borderRadius: 16,
            minHeight: 200,
          }}
        >
          <span>{campaign.coverLabel}</span>
        </div>
        <h1 style={{ marginTop: 20 }}>{campaign.name}</h1>
        <p>{campaign.description}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          <Badge tone={campaign.status === "vigente" ? "vigente" : "encerrada"}>
            {campaign.status === "vigente" ? "Vigente" : "Encerrada"}
          </Badge>
          <Badge tone="neutral">
            {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
          </Badge>
          <Badge tone="neutral">{assets.length} materiais</Badge>
        </div>
        <div style={{ marginTop: 20 }}>
          <button
            className="btn btn-secondary"
            disabled={busy || downloadable.length === 0}
            onClick={async () => {
              setBusy(true);
              try {
                await downloadCampaignZip(campaign.name, downloadable);
                downloadable.forEach((a) => recordDownload(a.id));
                notify("Kit ZIP baixado com sucesso");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Preparando ZIP..." : "Baixar kit completo (ZIP)"}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: 22, color: "var(--blue-deep)", marginBottom: 16 }}>
        Materiais da campanha
      </h2>
      <div className="grid-cards">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            categoryName={
              store.categories.find((c) => c.id === asset.categoryIds[0])?.name
            }
          />
        ))}
      </div>
    </div>
  );
}
