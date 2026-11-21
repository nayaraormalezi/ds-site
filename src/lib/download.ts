import JSZip from "jszip";
import type { Asset, AssetFile } from "./types";

function fileName(asset: Asset, file: AssetFile): string {
  const base = asset.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
  return `${base}.${file.format.toLowerCase()}`;
}

function toBlob(file: AssetFile): Blob {
  if (file.encoding === "svg") {
    return new Blob([file.content], { type: "image/svg+xml" });
  }
  if (file.encoding === "json") {
    return new Blob([file.content], { type: "application/json" });
  }
  return new Blob([file.content], { type: file.mimeType || "text/plain" });
}

export function downloadAssetFile(asset: Asset, file: AssetFile): void {
  const blob = toBlob(file);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName(asset, file);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function downloadCampaignZip(
  campaignName: string,
  assets: Asset[]
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(
    campaignName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase()
  );

  for (const asset of assets) {
    for (const file of asset.formats) {
      folder?.file(fileName(asset, file), toBlob(file));
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${campaignName.toLowerCase().replace(/\s+/g, "-")}-kit.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadTextFile(name: string, content: string, mime = "text/plain"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
