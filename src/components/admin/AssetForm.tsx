"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Asset, AssetStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

export function AssetForm({ initial }: { initial?: Asset }) {
  const router = useRouter();
  const { store, upsertAsset, currentUser } = useStore();
  const { notify } = useToast();

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial?.categoryIds ?? []
  );
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [productId, setProductId] = useState(initial?.productId ?? "");
  const [campaignId, setCampaignId] = useState(initial?.campaignId ?? "");
  const [status, setStatus] = useState<AssetStatus>(
    initial?.status ?? "em_revisao"
  );
  const [version, setVersion] = useState(initial?.version ?? "1.0");
  const [usageNotes, setUsageNotes] = useState(initial?.usageNotes ?? "");
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? "");
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? "");
  const [format, setFormat] = useState(initial?.formats[0]?.format ?? "PNG");
  const [channels, setChannels] = useState(
    initial?.channels.join(", ") ?? "digital"
  );
  const [replaceNote, setReplaceNote] = useState("");

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || categoryIds.length === 0) {
      notify("Preencha nome, descrição e ao menos uma categoria");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const nextVersion =
      initial && replaceNote
        ? (Number.parseFloat(version) + 0.1).toFixed(1)
        : version;

    const asset: Asset = {
      id: initial?.id ?? uid("asset"),
      name: name.trim(),
      description: description.trim(),
      categoryIds,
      productId: productId || undefined,
      campaignId: campaignId || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      channels: channels
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      thumbnailGradient:
        initial?.thumbnailGradient ??
        "linear-gradient(135deg,#0033FF,#001364)",
      thumbnailLabel: initial?.thumbnailLabel ?? format,
      previewType: initial?.previewType ?? "doc",
      formats: initial?.formats?.length
        ? initial.formats.map((f, idx) =>
            idx === 0
              ? {
                  ...f,
                  format,
                  label: `${format} — arquivo principal`,
                  content: replaceNote
                    ? `${f.content}\n\n<!-- versão atualizada: ${replaceNote} -->`
                    : f.content,
                }
              : f
          )
        : [
            {
              id: uid("f"),
              format,
              label: `${format} — arquivo principal`,
              sizeLabel: "120 KB",
              mimeType: "text/plain",
              content: `Placeholder do asset ${name}`,
              encoding: "text",
            },
          ],
      version: nextVersion,
      status,
      publishedAt: initial?.publishedAt ?? today,
      updatedAt: today,
      expiresAt: expiresAt || undefined,
      ownerId: initial?.ownerId ?? currentUser.id,
      usageNotes: usageNotes.trim() || "Seguir diretrizes oficiais da marca.",
      dimensions: dimensions || undefined,
      downloads: initial?.downloads ?? 0,
      featured: initial?.featured ?? false,
    };

    upsertAsset(asset, replaceNote ? "substituiu arquivo / nova versão" : "salvou");
    notify(initial ? "Asset atualizado" : "Asset cadastrado");
    router.push("/admin/assets");
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2>Informações básicas</h2>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field full">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="field full">
          <label>Categorias</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {store.categories.map((cat) => (
              <label key={cat.id} style={{ fontWeight: 400 }}>
                <input
                  type="checkbox"
                  checked={categoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />{" "}
                {cat.name}
              </label>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="logo, campanha, feed"
          />
        </div>
        <div className="field">
          <label htmlFor="channels">Canais</label>
          <input
            id="channels"
            className="input"
            value={channels}
            onChange={(e) => setChannels(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="product">Produto</label>
          <select
            id="product"
            className="select"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Nenhum</option>
            {store.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="campaign">Campanha</label>
          <select
            id="campaign"
            className="select"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
          >
            <option value="">Nenhuma</option>
            {store.campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Informações técnicas</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="format">Formato principal</label>
          <input
            id="format"
            className="input"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="dimensions">Dimensões</label>
          <input
            id="dimensions"
            className="input"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="version">Versão</label>
          <input
            id="version"
            className="input"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div className="field full">
          <label htmlFor="replace">
            Substituir arquivo / nota de nova versão
          </label>
          <input
            id="replace"
            className="input"
            value={replaceNote}
            onChange={(e) => setReplaceNote(e.target.value)}
            placeholder="Ex.: Atualização de CTA e validade"
          />
          <span className="hint">
            Ao preencher, o sistema registra nova versão sem apagar o histórico.
          </span>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Governança</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as AssetStatus)}
          >
            <option value="aprovado">Aprovado</option>
            <option value="em_revisao">Em revisão</option>
            <option value="expirado">Expirado</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="expires">Data de validade</label>
          <input
            id="expires"
            className="input"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
        <div className="field full">
          <label htmlFor="usage">Orientações de uso</label>
          <textarea
            id="usage"
            className="textarea"
            value={usageNotes}
            onChange={(e) => setUsageNotes(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Button type="submit" variant="secondary">
          {initial ? "Salvar alterações" : "Cadastrar asset"}
        </Button>
        <Button href="/admin/assets" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
