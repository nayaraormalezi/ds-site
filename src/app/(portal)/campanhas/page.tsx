"use client";

import { ContentCard } from "@/components/ui/ContentCard";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function CampanhasPage() {
  const { store } = useStore();
  const campaigns = store.campaigns.filter((c) => c.published);

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="section-label">Kits</p>
        <h1>Campanhas</h1>
        <p>
          Cada campanha agrupa os materiais oficiais do período. Baixe o kit
          completo em ZIP na página da campanha.
        </p>
      </div>

      <div className="grid-cards">
        {campaigns.map((campaign) => (
          <ContentCard
            key={campaign.id}
            href={`/campanhas/${campaign.id}`}
            eyebrow={
              campaign.status === "vigente" ? "Campanha vigente" : "Encerrada"
            }
            title={campaign.name}
            description={`${campaign.description} · ${campaign.assetIds.length} materiais · ${formatDate(campaign.startDate)} — ${formatDate(campaign.endDate)}`}
            meta={formatDate(campaign.endDate)}
            actionLabel="Abrir kit"
            media={
              <div
                className="thumb"
                style={{
                  background: campaign.coverGradient,
                  aspectRatio: "1/1",
                }}
              >
                <span>{campaign.coverLabel}</span>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
