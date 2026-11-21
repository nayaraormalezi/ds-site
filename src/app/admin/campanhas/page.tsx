"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import type { Campaign } from "@/lib/types";
import { formatDate, slugify, uid } from "@/lib/utils";

const emptyForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "rascunho" as Campaign["status"],
  assetIds: [] as string[],
};

export default function AdminCampanhasPage() {
  const { store, upsertCampaign } = useStore();
  const { notify } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  function startEdit(campaign: Campaign) {
    setEditingId(campaign.id);
    setForm({
      name: campaign.name,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      assetIds: campaign.assetIds,
    });
  }

  function save() {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      notify("Preencha nome e período");
      return;
    }
    const campaign: Campaign = {
      id: editingId ?? uid("camp"),
      name: form.name.trim(),
      slug: slugify(form.name),
      description: form.description.trim(),
      coverGradient: "linear-gradient(135deg,#005CA9,#F39200)",
      coverLabel: form.name.trim().slice(0, 12),
      startDate: form.startDate,
      endDate: form.endDate,
      productIds: [],
      assetIds: form.assetIds,
      status: form.status,
      published: form.status !== "rascunho",
    };
    upsertCampaign(campaign);
    setForm(emptyForm);
    setEditingId(null);
    notify(editingId ? "Campanha atualizada" : "Campanha criada");
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Campanhas</h1>
          <p>Crie kits, defina vigência e associe assets.</p>
        </div>
      </div>

      <div className="panel">
        <h2>{editingId ? "Editar campanha" : "Nova campanha"}</h2>
        <div className="form-grid">
          <div className="field">
            <label>Nome</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              className="select"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as Campaign["status"],
                })
              }
            >
              <option value="rascunho">Rascunho</option>
              <option value="vigente">Vigente</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>
          <div className="field full">
            <label>Descrição</label>
            <textarea
              className="textarea"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Início</label>
            <input
              type="date"
              className="input"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Fim</label>
            <input
              type="date"
              className="input"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <div className="field full">
            <label>Assets associados</label>
            <div style={{ display: "grid", gap: 6, maxHeight: 180, overflow: "auto" }}>
              {store.assets.map((asset) => (
                <label key={asset.id} style={{ fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={form.assetIds.includes(asset.id)}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        assetIds: prev.assetIds.includes(asset.id)
                          ? prev.assetIds.filter((id) => id !== asset.id)
                          : [...prev.assetIds, asset.id],
                      }))
                    }
                  />{" "}
                  {asset.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Button variant="secondary" onClick={save}>
            Salvar
          </Button>
          {editingId ? (
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancelar edição
            </Button>
          ) : null}
        </div>
      </div>

      <div className="panel">
        <h2>Campanhas cadastradas</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Período</th>
                <th>Assets</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {store.campaigns.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    {formatDate(c.startDate)} — {formatDate(c.endDate)}
                  </td>
                  <td>{c.assetIds.length}</td>
                  <td>
                    <Badge
                      tone={c.status === "vigente" ? "vigente" : "encerrada"}
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(c)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
