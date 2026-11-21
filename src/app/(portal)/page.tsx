"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AssetCard } from "@/components/portal/AssetCard";
import { Button } from "@/components/ui/Button";
import { ContentCard } from "@/components/ui/ContentCard";
import { SearchField } from "@/components/ui/SearchField";
import { useStore } from "@/lib/store";
import { formatDate, isExternallyVisible } from "@/lib/utils";

const QUICK = [
  {
    href: "/biblioteca",
    eyebrow: "Assets",
    title: "Biblioteca de assets",
    desc: "Busque, filtre e baixe materiais aprovados.",
    icon: "/brand/icon-document.svg",
  },
  {
    href: "/identidade-visual",
    eyebrow: "Diretrizes",
    title: "Identidade visual",
    desc: "Logo, cores, tipografia e aplicações.",
    icon: "/brand/icon-notebook.svg",
  },
  {
    href: "/guias",
    eyebrow: "Documentos",
    title: "Guias e orientações",
    desc: "Tom de voz, campanhas e comunicação.",
    icon: "/brand/icon-assembly.svg",
  },
  {
    href: "/templates",
    eyebrow: "Modelos",
    title: "Templates",
    desc: "Arquivos editáveis para agilizar entregas.",
    icon: "/brand/icon-group.svg",
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
        <div className="home-hero__banner">
          <Image
            className="home-hero__bg"
            src="/brand/hero-banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="home-hero__overlay" />
          <div className="container home-hero__content">
            <div className="home-hero__copy">
              <p className="home-hero__brand">CAIXA Consórcio</p>
              <h1>Tudo para comunicar a nossa marca.</h1>
              <p className="lead">
                Encontre materiais oficiais, diretrizes e recursos para suas
                produções.
              </p>
            </div>
            <p className="home-hero__aside">
              Portal de marca e assets — fonte única e confiável para
              agências, parceiros e times internos.
            </p>
            <div className="home-hero__actions">
              <Button href="/biblioteca" variant="secondary" size="lg">
                Ir para biblioteca
              </Button>
              <Button href="/identidade-visual" variant="on-color" size="lg">
                Ver identidade visual
              </Button>
            </div>
            <SearchField
              id="home-search"
              className="home-hero__search"
              value={query}
              onChange={setQuery}
              placeholder="Busque por nome, categoria, campanha ou palavra-chave"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                router.push(
                  q ? `/biblioteca?q=${encodeURIComponent(q)}` : "/biblioteca"
                );
              }}
              action={
                <Button type="submit" variant="secondary" size="sm">
                  Buscar
                </Button>
              }
            />
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section-block section-block--tight">
          <div className="section-head">
            <div>
              <p className="section-label">Acesso rápido</p>
              <h2>Comece por aqui</h2>
            </div>
          </div>
          <div className="quick-grid">
            {QUICK.map((item) => (
              <ContentCard
                key={item.href}
                href={item.href}
                variant="icon"
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.desc}
                actionLabel="Acessar"
                icon={
                  <Image src={item.icon} alt="" width={32} height={32} />
                }
              />
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-head">
            <div>
              <p className="section-label">Destaques</p>
              <h2>Materiais em destaque</h2>
            </div>
            <Button href="/biblioteca" variant="outline" size="sm" externalIcon>
              Ver biblioteca
            </Button>
          </div>
          {!ready ? (
            <div className="grid-cards">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 360 }} />
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
            <Button href="/campanhas" variant="outline" size="sm" externalIcon>
              Ver todas
            </Button>
          </div>
          <div className="grid-cards">
            {campaigns.map((campaign) => (
              <ContentCard
                key={campaign.id}
                href={`/campanhas/${campaign.id}`}
                eyebrow="Campanha vigente"
                title={campaign.name}
                description={campaign.description}
                meta={`até ${formatDate(campaign.endDate)}`}
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
        </section>
      </div>
    </>
  );
}
