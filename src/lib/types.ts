export type AssetStatus = "aprovado" | "em_revisao" | "expirado" | "arquivado";
export type UserRole = "administrador" | "gestor_marca" | "editor" | "fornecedor";
export type RequestStatus =
  | "recebida"
  | "em_analise"
  | "em_atendimento"
  | "concluida"
  | "recusada";
export type ViewMode = "grid" | "list";
export type SortOption = "recent" | "name" | "downloads" | "updated";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  productIds: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverGradient: string;
  coverLabel: string;
  startDate: string;
  endDate: string;
  productIds: string[];
  assetIds: string[];
  status: "vigente" | "encerrada" | "rascunho";
  published: boolean;
}

export interface AssetFile {
  id: string;
  format: string;
  label: string;
  sizeLabel: string;
  dimensions?: string;
  mimeType: string;
  content: string;
  encoding: "text" | "svg" | "json";
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
  productId?: string;
  campaignId?: string;
  tags: string[];
  channels: string[];
  thumbnailGradient: string;
  thumbnailLabel: string;
  previewType: "logo" | "social" | "print" | "video" | "presentation" | "doc" | "digital";
  formats: AssetFile[];
  version: string;
  status: AssetStatus;
  publishedAt: string;
  updatedAt: string;
  expiresAt?: string;
  ownerId: string;
  usageNotes: string;
  dimensions?: string;
  downloads: number;
  featured?: boolean;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  format: string;
  pages: number;
  coverGradient: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  editableFormat: string;
  updatedAt: string;
  coverGradient: string;
  coverLabel: string;
  content: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface MaterialRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  priority: "baixa" | "media" | "alta";
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: "asset" | "campaign" | "category" | "guide" | "user" | "request";
  entityId: string;
  entityName: string;
  userId: string;
  createdAt: string;
  details?: string;
}

export interface DamStore {
  assets: Asset[];
  categories: Category[];
  products: Product[];
  campaigns: Campaign[];
  guides: Guide[];
  templates: Template[];
  users: User[];
  requests: MaterialRequest[];
  activities: ActivityLog[];
  favorites: string[];
  currentUserId: string;
  initializedAt: string;
}

export interface AssetFilters {
  query?: string;
  categoryIds?: string[];
  productId?: string;
  campaignId?: string;
  formats?: string[];
  channels?: string[];
  status?: AssetStatus[];
  sort?: SortOption;
}
