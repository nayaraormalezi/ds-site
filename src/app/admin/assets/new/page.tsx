import { AssetForm } from "@/components/admin/AssetForm";

export default function NewAssetPage() {
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Cadastrar asset</h1>
          <p>Preencha as informações básicas, técnicas e de governança.</p>
        </div>
      </div>
      <AssetForm />
    </div>
  );
}
