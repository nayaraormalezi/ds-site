import type { Asset, AssetFilters, AssetStatus, DamStore } from "./types";

export function formatDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

export function statusLabel(status: AssetStatus): string {
  const map: Record<AssetStatus, string> = {
    aprovado: "Aprovado",
    em_revisao: "Em revisão",
    expirado: "Expirado",
    arquivado: "Arquivado",
  };
  return map[status];
}

export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    administrador: "Administrador",
    gestor_marca: "Gestor de marca",
    editor: "Editor de conteúdo",
    fornecedor: "Fornecedor",
  };
  return map[role] ?? role;
}

export function requestStatusLabel(status: string): string {
  const map: Record<string, string> = {
    recebida: "Recebida",
    em_analise: "Em análise",
    em_atendimento: "Em atendimento",
    concluida: "Concluída",
    recusada: "Recusada",
  };
  return map[status] ?? status;
}

export function isDownloadable(asset: Asset, now = new Date()): boolean {
  if (asset.status !== "aprovado") return false;
  if (asset.expiresAt) {
    const exp = new Date(`${asset.expiresAt}T23:59:59`);
    if (exp < now) return false;
  }
  return true;
}

export function isExternallyVisible(asset: Asset, now = new Date()): boolean {
  if (asset.status === "arquivado" || asset.status === "em_revisao") return false;
  if (asset.status === "expirado") return false;
  if (asset.expiresAt) {
    const exp = new Date(`${asset.expiresAt}T23:59:59`);
    if (exp < now) return false;
  }
  return asset.status === "aprovado";
}

export function filterAssets(
  assets: Asset[],
  filters: AssetFilters,
  opts?: { admin?: boolean }
): Asset[] {
  const now = new Date();
  let list = [...assets];

  if (!opts?.admin) {
    list = list.filter((a) => isExternallyVisible(a, now));
  }

  const q = filters.query?.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.formats.some((f) => f.format.toLowerCase().includes(q))
    );
  }

  if (filters.categoryIds?.length) {
    list = list.filter((a) =>
      a.categoryIds.some((id) => filters.categoryIds!.includes(id))
    );
  }

  if (filters.productId) {
    list = list.filter((a) => a.productId === filters.productId);
  }

  if (filters.campaignId) {
    list = list.filter((a) => a.campaignId === filters.campaignId);
  }

  if (filters.formats?.length) {
    list = list.filter((a) =>
      a.formats.some((f) => filters.formats!.includes(f.format))
    );
  }

  if (filters.channels?.length) {
    list = list.filter((a) =>
      a.channels.some((c) => filters.channels!.includes(c))
    );
  }

  if (filters.status?.length) {
    list = list.filter((a) => filters.status!.includes(a.status));
  }

  switch (filters.sort) {
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      break;
    case "downloads":
      list.sort((a, b) => b.downloads - a.downloads);
      break;
    case "updated":
      list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      break;
    case "recent":
    default:
      list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  return list;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find((i) => i.id === id);
}

export function dashboardStats(store: DamStore) {
  const assets = store.assets;
  return {
    total: assets.length,
    published: assets.filter((a) => a.status === "aprovado").length,
    review: assets.filter((a) => a.status === "em_revisao").length,
    expired: assets.filter((a) => a.status === "expirado").length,
    downloads: assets.reduce((sum, a) => sum + a.downloads, 0),
    campaigns: store.campaigns.filter((c) => c.status === "vigente").length,
    pendingRequests: store.requests.filter(
      (r) => r.status === "recebida" || r.status === "em_analise"
    ).length,
  };
}
