"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import type { Category } from "@/lib/types";
import { slugify, uid } from "@/lib/utils";

export default function AdminCategoriasPage() {
  const { store, upsertCategory, deleteCategory } = useStore();
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  function save() {
    if (!name.trim()) {
      notify("Informe o nome da categoria");
      return;
    }
    const category: Category = {
      id: editingId ?? uid("cat"),
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
      productIds,
    };
    upsertCategory(category);
    setName("");
    setDescription("");
    setProductIds([]);
    setEditingId(null);
    notify(editingId ? "Categoria atualizada" : "Categoria criada");
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Categorias</h1>
          <p>Organize a taxonomia da biblioteca e associe produtos.</p>
        </div>
      </div>

      <div className="panel">
        <h2>{editingId ? "Editar categoria" : "Nova categoria"}</h2>
        <div className="form-grid">
          <div className="field">
            <label>Nome</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field full">
            <label>Descrição</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field full">
            <label>Produtos associados</label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {store.products.map((p) => (
                <label key={p.id} style={{ fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={productIds.includes(p.id)}
                    onChange={() =>
                      setProductIds((prev) =>
                        prev.includes(p.id)
                          ? prev.filter((id) => id !== p.id)
                          : [...prev, p.id]
                      )
                    }
                  />{" "}
                  {p.name}
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
                setName("");
                setDescription("");
                setProductIds([]);
              }}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Produtos</th>
                <th>Assets</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {store.categories.map((cat) => {
                const count = store.assets.filter((a) =>
                  a.categoryIds.includes(cat.id)
                ).length;
                return (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>{cat.description}</td>
                    <td>
                      {cat.productIds
                        .map(
                          (id) =>
                            store.products.find((p) => p.id === id)?.name ?? id
                        )
                        .join(", ") || "—"}
                    </td>
                    <td>{count}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setEditingId(cat.id);
                            setName(cat.name);
                            setDescription(cat.description);
                            setProductIds(cat.productIds);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (count > 0) {
                              notify(
                                "Remova ou reclassifyique os assets antes de excluir"
                              );
                              return;
                            }
                            if (window.confirm(`Excluir categoria ${cat.name}?`)) {
                              deleteCategory(cat.id);
                              notify("Categoria excluída");
                            }
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
