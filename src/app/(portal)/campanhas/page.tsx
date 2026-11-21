"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
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
          <Link
            key={campaign.id}
            href={`/campanhas/${campaign.id}`}
            className="card card-interactive campaign-card"
          >
            <div className="thumb" style={{ background: campaign.coverGradient }}>
              <span>{campaign.coverLabel}</span>
            </div>
            <div className="campaign-card__body">
              <h3>{campaign.name}</h3>
              <p>{campaign.description}</p>
              <div className="campaign-meta">
                <Badge tone={campaign.status === "vigente" ? "vigente" : "encerrada"}>
                  {campaign.status === "vigente" ? "Vigente" : "Encerrada"}
                </Badge>
                <Badge tone="neutral">{campaign.assetIds.length} materiais</Badge>
                <Badge tone="neutral">
                  {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
