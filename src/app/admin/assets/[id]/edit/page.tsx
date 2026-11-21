"use client";

import { useParams } from "next/navigation";
import { AssetForm } from "@/components/admin/AssetForm";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";

export default function EditAssetPage() {
  const { id } = useParams<{ id: string }>();
  const { store } = useStore();
  const asset = store.assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div>
        <h1>Asset não encontrado</h1>
        <Button href="/admin/assets" variant="secondary">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Editar asset</h1>
          <p>{asset.name}</p>
        </div>
      </div>
      <AssetForm initial={asset} />
    </div>
  );
}
