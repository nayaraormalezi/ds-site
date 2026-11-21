"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AssetCard } from "@/components/portal/AssetCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatDate, isExternallyVisible } from "@/lib/utils";

const QUICK = [
  {
    href: "/biblioteca",
    eyebrow: "Assets",
    title: "Biblioteca de assets",
    desc: "Busque, filtre e baixe materiais aprovados.",
  },
  {
    href: "/identidade-visual",
    eyebrow: "Diretrizes",
    title: "Identidade visual",
    desc: "Logo, cores, tipografia e aplicações.",
  },
  {
    href: "/guias",
    eyebrow: "Documentos",
    title: "Guias e orientações",
    desc: "Tom de voz, campanhas e comunicação.",
  },
  {
    href: "/templates",
    eyebrow: "Modelos",
    title: "Templates",
    desc: "Arquivos editáveis para agilizar entregas.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { store, ready } = useStore();
  const [query, setQuery] = useState("");

  const featured = useMemo(
    () =>
      store.assets
        .filter((a) => a.featured && isExternallyVisible(a))
        .slice(0, 6),
    [store.assets]
  );

  const campaigns = useMemo(
    () => store.campaigns.filter((c) => c.status === "vigente" && c.published),
    [store.campaigns]
  );

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <p className="section-label" style={{ color: "#F39200" }}>
            Portal de Marca e Assets
          </p>
          <h1>Tudo para comunicar a nossa marca.</h1>
          <p className="lead">
            Encontre materiais oficiais, diretrizes e recursos para suas
            produções.
          </p>
          <form
            className="search-field"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              router.push(q ? `/biblioteca?q=${encodeURIComponent(q)}` : "/biblioteca");
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <label className="sr-only" htmlFor="home-search">
              Buscar materiais
            </label>
            <input
              id="home-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por nome, categoria, campanha ou palavra-chave"
            />
            <Button type="submit" variant="secondary" size="sm">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      <div className="container">
        <div className="quick-grid">
          {QUICK.map((item) => (
            <Link key={item.href} href={item.href} className="quick-card">
              <div className="eyebrow">{item.eyebrow}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>

        <section className="section-block">
          <div className="section-head">
            <div>
              <p className="section-label">Destaques</p>
              <h2>Materiais em destaque</h2>
            </div>
            <Button href="/biblioteca" variant="outline" size="sm">
              Ver biblioteca
            </Button>
          </div>
          {!ready ? (
            <div className="grid-cards">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280 }} />
              ))}
            </div>
          ) : (
            <div className="grid-cards">
              {featured.map((asset) => (
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

        <section className="section-block" style={{ paddingBottom: 64 }}>
          <div className="section-head">
            <div>
              <p className="section-label">Campanhas</p>
              <h2>Campanhas vigentes</h2>
            </div>
            <Button href="/campanhas" variant="outline" size="sm">
              Ver todas
            </Button>
          </div>
          <div className="grid-cards">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campanhas/${campaign.id}`}
                className="card card-interactive campaign-card"
              >
                <div
                  className="thumb"
                  style={{ background: campaign.coverGradient }}
                >
                  <span>{campaign.coverLabel}</span>
                </div>
                <div className="campaign-card__body">
                  <h3>{campaign.name}</h3>
                  <p>{campaign.description}</p>
                  <div className="campaign-meta">
                    <Badge tone="vigente">Vigente</Badge>
                    <Badge tone="neutral">
                      {campaign.assetIds.length} materiais
                    </Badge>
                    <Badge tone="neutral">
                      até {formatDate(campaign.endDate)}
                    </Badge>
                  </div>
                  <span className="btn btn-secondary btn-sm">Abrir kit</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
